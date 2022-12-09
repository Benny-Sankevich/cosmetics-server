const express = require("express");
const authLogic = require("../business-logic-layer/auth-logic");
const errorHelper = require("../helpers/errors-helper");
const UserRegisterModel = require("../models/auth/user-register-model");
const UserLoginModel = require("../models/auth/user-login-model");
const ResetPasswordModel = require("../models/auth/reset-password-model");
const verifyIsLoggedIn = require("../middleware/verify-logged-in");
const saveRequestInfo = require("../middleware/save-req-info");

const router = express.Router();

router.post("/register", async (request, response) => {
    try {
        const user = new UserRegisterModel(request.body);
        const error = user.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const userAdded = await authLogic.registerAsync(user);
        response.json(userAdded);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/login", async (request, response) => {
    try {
        const user = new UserLoginModel(request.body);
        const error = user.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const userLoggedIn = await authLogic.loginAsync(user.email, user.password);
        if (!userLoggedIn) return response.status(401).send('msgIncorrectUsernameOrPassword');
        saveRequestInfo(request, 'Login', userLoggedIn.email);
        response.json(userLoggedIn);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/change-password", verifyIsLoggedIn, async (request, response) => {
    try {
        const user = new ResetPasswordModel(request.body);
        const error = user.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const passwordChanged = await authLogic.userChangePasswordAsync(user);
        if (!passwordChanged) return response.status(401).send('msgOldPasswordWrong');
        response.json(passwordChanged);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/check-email", async (request, response) => {
    try {
        const emailData = request.body;
        if (emailData.email === undefined) return response.status(400).send('msgMissingEmail');
        const emailNotExist = await authLogic.checkEmailExistAsync(emailData);
        response.json(emailNotExist);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

module.exports = router;