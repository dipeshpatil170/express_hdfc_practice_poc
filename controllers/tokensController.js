const { StatusCode, StatusDescription, ErrorPhrase } = require("../utils/errorPhrase");
const { createErrorPayload, errorHandler, generateTokens, extractUserId } = require("../utils/utils");
const Token = require("../models/token");


const reNewAccessToken = async (req, res) => {
    try {
        const userId = await extractUserId(req);

        const existingToken = await Token.findOne({ userId: userId });

        if (existingToken) {
            const { accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry } = generateTokens(userId);

            existingToken.accessToken = accessToken;
            existingToken.refreshToken = refreshToken;
            existingToken.accessTokenExpiry = accessTokenExpiry;
            existingToken.refreshTokenExpiry = refreshTokenExpiry;

            existingToken.save();

            res.status(StatusCode.OK).send({
                status: StatusDescription.SUCCESS,
                statusCode: StatusCode.OK,
                data: "Token has been renewed.",
            });
        } else {
            res.status(StatusCode.NOT_FOUND).send(createErrorPayload({
                status: StatusDescription.NOT_FOUND,
                statusCode: StatusCode.NOT_FOUND,
                message: ErrorPhrase.INVALID_TOKEN,
            }));
        }




    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(createErrorPayload({
            status: StatusDescription.INTERNAL_SERVER_ERROR,
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            message: errorHandler(error),
        }));
    }
};



module.exports = {
    reNewAccessToken
}