const jwt = require("jsonwebtoken");

const key = "ThisIsVeryStrongToken";

function getNewToken(payload) {
    return jwt.sign(payload, key, { expiresIn: "30m" });
}

module.exports = {
    getNewToken
};