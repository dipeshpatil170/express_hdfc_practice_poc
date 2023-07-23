const { StatusCode, StatusDescription, ErrorPhrase } = require("../utils/errorPhrase");
const { createErrorPayload, errorHandler, generateTokens, extractUserId } = require("../utils/utils");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs/dist/bcrypt");
const User = require("../models/user");
const Token = require("../models/token");
const Order = require("../models/order");
const Product = require("../models/product");



const registerUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (!user) throw Error('User could not created.')

        const { accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry } = generateTokens(user.id);

        await Token.create({
            accessToken,
            refreshToken,
            accessTokenExpiry,
            refreshTokenExpiry,
            userId: user.id,
        });

        const createUserResponse = {
            username: user.username,
            email: user.email,
            accessToken: accessToken,
            accessTokenExpiry: accessTokenExpiry,
            refreshToken: refreshToken,
            refreshTokenExpiry: refreshTokenExpiry
        }

        res.status(StatusCode.OK).send({
            status: StatusDescription.SUCCESS,
            statusCode: StatusCode.OK,
            data: createUserResponse,
        });

    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(createErrorPayload({
            status: StatusDescription.INTERNAL_SERVER_ERROR,
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            message: errorHandler(error),
        }));
    }

}

const getUsers = async (_req, res) => {
    try {

        // const users = await User.findAll({ include: [{ model: Order, required: false }], });
        const users = await User.findAll();

        res.status(StatusCode.OK).send({
            status: StatusDescription.SUCCESS,
            statusCode: StatusCode.OK,
            data: users,
        });
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(createErrorPayload({
            status: StatusDescription.INTERNAL_SERVER_ERROR,
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            message: errorHandler(error),
        }));
    }
};

const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            where: { username: username }
        });


        if (!user) {
            res.status(StatusCode.NOT_FOUND).send(createErrorPayload({
                status: StatusDescription.NOT_FOUND,
                statusCode: StatusCode.NOT_FOUND,
                message: ErrorPhrase.USER_NOT_FOUND,
            }));
        } else {
            const existingToken = await Token.findOne({ where: { userId: user.id } });

            const response = {
                username: user.username,
                email: user.email
            }

            if (existingToken) {

                const { accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry } = generateTokens(user.id);

                existingToken.accessToken = accessToken;
                existingToken.refreshToken = refreshToken;
                existingToken.accessTokenExpiry = accessTokenExpiry;
                existingToken.refreshTokenExpiry = refreshTokenExpiry;

                response.accessToken = accessToken;
                response.refreshToken = refreshToken;
                response.accessTokenExpiry = accessTokenExpiry;
                response.refreshTokenExpiry = refreshTokenExpiry;

                existingToken.save();

            } else {

                const { accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry } = generateTokens(user.id);

                response.accessToken = accessToken;
                response.refreshToken = refreshToken;
                response.accessTokenExpiry = accessTokenExpiry;
                response.refreshTokenExpiry = refreshTokenExpiry;

                await Token.create({
                    accessToken,
                    refreshToken,
                    accessTokenExpiry,
                    refreshTokenExpiry,
                    userId: user.id,
                });
            }

            const isMatched = await bcrypt.compare(password, user.password);

            if (!isMatched) {
                res.status(StatusCode.UNAUTHORIZED).send(createErrorPayload({
                    status: StatusDescription.UNAUTHORIZED,
                    statusCode: StatusCode.UNAUTHORIZED,
                    message: ErrorPhrase.INVALID_CREDENTIALS,
                }));
            } else {
                res.status(StatusCode.OK).send({
                    status: StatusDescription.SUCCESS,
                    statusCode: StatusCode.OK,
                    data: response,
                });
            }
        }

    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(createErrorPayload({
            status: StatusDescription.INTERNAL_SERVER_ERROR,
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            message: errorHandler(error),
        }));
    }
};

const userPasswordReset = async (req, res) => {
    try {
        const { password } = req.body;
        const token = req.headers['authorization'];
        const tokenRegex = /^Bearer (.+)$/i;
        const matches = token.match(tokenRegex);

        if (!matches || matches.length < 2) return false;

        const seperatedtoken = matches[1];
        const decoded = jwt.verify(seperatedtoken, process.env.SECRET_KEY);

        const user = await User.findByPk(decoded.userId);

        if (!user) {
            res.status(StatusCode.NOT_FOUND).send(createErrorPayload({
                status: StatusDescription.NOT_FOUND,
                statusCode: StatusCode.NOT_FOUND,
                message: ErrorPhrase.USER_NOT_FOUND,
            }));
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            user.password = hashedPassword;
            await user.save();

            res.status(StatusCode.OK).send({
                status: StatusDescription.SUCCESS,
                statusCode: StatusCode.OK,
                data: ErrorPhrase.PASSWORD_RESET_SUCCESS,
            });
        }

    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(createErrorPayload({
            status: StatusDescription.INTERNAL_SERVER_ERROR,
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            message: errorHandler(error),
        }));
    }

}
const getOrdersOfUsers = async (req, res) => {
    try {
        const userId = await extractUserId(req);

        const user = await User.findByPk(userId, {
            include: {
                model: Order,
                include: Product,
            },
        });

        res.status(StatusCode.OK).send({
            status: StatusDescription.SUCCESS,
            statusCode: StatusCode.OK,
            data: user,
        });

    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(createErrorPayload({
            status: StatusDescription.INTERNAL_SERVER_ERROR,
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            message: errorHandler(error),
        }));
    }

}

const getLoggedInUserDetails = async (req, res) => {
    try {
        const userId = await extractUserId(req);

        const user = await User.findByPk(userId);

        const token = await Token.findOne({ userId: userId })

        const response = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            accessToken: token.accessToken
        }

        res.status(StatusCode.OK).send({
            status: StatusDescription.SUCCESS,
            statusCode: StatusCode.OK,
            data: response,
        });

    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(createErrorPayload({
            status: StatusDescription.INTERNAL_SERVER_ERROR,
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            message: errorHandler(error),
        }));
    }

}



module.exports = {
    getUsers,
    registerUser,
    userLogin,
    userPasswordReset,
    getOrdersOfUsers,
    getLoggedInUserDetails
}