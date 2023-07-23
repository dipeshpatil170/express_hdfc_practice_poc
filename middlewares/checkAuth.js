const { StatusCode, ErrorPhrase, StatusDescription } = require("../utils/errorPhrase");
const { errorHandler, createErrorPayload } = require("../utils/utils");
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require("../models/token");

module.exports.checkAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    try {

        if (!token) {
            throw Error(ErrorPhrase.TOKEN_NOT_PROVIDED);
        }

        const tokenRegex = /^Bearer (.+)$/i;
        const matches = token.match(tokenRegex);

        if (!matches || matches.length < 2) {
            return false;
        }
        const seperatedtoken = matches[1];

        const decoded = jwt.verify(seperatedtoken, process.env.SECRET_KEY);

        const user = await User.findByPk(decoded.userId);


        if (!user) {
            throw Error(ErrorPhrase.USER_NOT_FOUND);
        } else {
            const token = await Token.findOne({ userId: decoded.userId });
            
            if (seperatedtoken === token.accessToken || seperatedtoken === token.refreshToken) {
                next();
            } else {
                throw Error(ErrorPhrase.INVALID_TOKEN);
            }
        }
    } catch (error) {
        return res.status(StatusCode.UNAUTHORIZED).send(createErrorPayload({
            status: StatusDescription.UNAUTHORIZED,
            statusCode: StatusCode.UNAUTHORIZED,
            message: errorHandler(error)
        }));
    }
};

