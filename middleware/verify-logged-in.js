const jwt = require("jsonwebtoken");

function verifyLoggedIn(request, response, next) {

    if (!request.headers.authorization) return response.status(401).send('msgYouAreNotLoggedIn');

    const token = request.headers.authorization.split(" ")[1];

    if (!token) return response.status(401).send('msgYouAreNotLoggedIn');

    jwt.verify(token, "ThisIsVeryStrongToken", (err, payload) => {

        if (err && err.message === "jwt expired") return response.status(403).send('msgSessionExpired');

        if (err) return response.status(401).send('msgYouAreNotLoggedIn');

        next();
    });
}

module.exports = verifyLoggedIn;