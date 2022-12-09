const LogModel = require("../models/log-model");
const generalLogic = require("../business-logic-layer/general-logic");

function saveRequestInfo(req, action, user) {
    if (process.env.NODE_ENV === "production") {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ip.includes('::ffff:')) {
            ip = ip.split(':').reverse()[0]
        }
        const log = new LogModel({
            ip,
            action,
            user
        });
        generalLogic.saveLogAsync(log);
    }
}


module.exports = saveRequestInfo;