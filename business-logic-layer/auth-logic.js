require("../data-access-layer/dal");
const cryptoHelper = require("../helpers/crypto-helper");
const jwtHelper = require("../helpers/jwt-helper");
const UserLoginModel = require("../models/auth/user-login-model");
const UserRegisterModel = require("../models/auth/user-register-model");
const ResetPasswordModel = require("../models/auth/reset-password-model");
const helpers = require("../helpers/helpers");

async function registerAsync(user) {
    user.password = cryptoHelper.hash(user.password);
    user.createdDate = helpers.getDateTimeNow();
    user.isActive = true;
    await user.save();
    return changeTokenAndPasswordOfUser(user);
}

async function loginAsync(email, password) {
    password = cryptoHelper.hash(password);
    const user = await UserLoginModel.findOne({ $and: [{ email }, { password }, { isActive: true }] }).exec();
    if (!user) return null;

    await updateLastLoginAsync(user._id);
    return changeTokenAndPasswordOfUser(user);
}

async function userChangePasswordAsync(user) {
    const userExist = await loginAsync(user.email, user.oldPassword);
    if (userExist) {
        user._id = userExist._id;
        return await updateUserDataAsync(user);
    }
    return null;
}

async function updateUserDataAsync(user) {
    user.password = cryptoHelper.hash(user.password);
    user.oldPassword = undefined;
    user.lastModified = helpers.getDateTimeNow();
    const info = await ResetPasswordModel.findByIdAndUpdate(user._id, user, { returnOriginal: false }).exec();
    return info ? changeTokenAndPasswordOfUser(user) : null;
}

function updateLastLoginAsync(userId) {
    const user = new UserRegisterModel({
        _id: userId,
        lastLogin: helpers.getDateTimeNow(),
    });
    return UserRegisterModel.findByIdAndUpdate(user._id, user, { returnOriginal: false }).exec();
}

function changeTokenAndPasswordOfUser(user) {
    user.token = jwtHelper.getNewToken({ user });
    user.password = undefined;
    return user;
}
async function checkEmailExistAsync(email) {
    const isEmailNotExist = await UserRegisterModel.findOne(email).exec();
    if (isEmailNotExist) return false;
    return true;
}
module.exports = {
    registerAsync,
    loginAsync,
    userChangePasswordAsync,
    checkEmailExistAsync,
};