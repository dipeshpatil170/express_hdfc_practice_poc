const { StatusCode, ErrorPhrase, StatusDescription } = require("../utils/errorPhrase");
const { errorHandler, createErrorPayload } = require("../utils/utils");
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require("../models/token");

module.exports.checkAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    try {

        if (!token) {
            return res.status(StatusCode.UNAUTHORIZED).send(
                createErrorPayload({
                    status: StatusDescription.UNAUTHORIZED,
                    statusCode: StatusCode.UNAUTHORIZED,
                    message: ErrorPhrase.TOKEN_NOT_PROVIDED,
                })
            );
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
            return res.status(StatusCode.NOT_FOUND).send(createErrorPayload({
                status: StatusDescription.NOT_FOUND,
                statusCode: StatusCode.NOT_FOUND,
                message: ErrorPhrase.USER_NOT_FOUND
            }));
        } else {
            const token = await Token.findOne({ userId: decoded.userId });

            if (seperatedtoken !== token.accessToken) {
                return res.status(StatusCode.UNAUTHORIZED).send(createErrorPayload({
                    status: StatusDescription.UNAUTHORIZED,
                    statusCode: StatusCode.UNAUTHORIZED,
                    message: ErrorPhrase.INVALID_TOKEN
                }));
            } else {
                next();
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

