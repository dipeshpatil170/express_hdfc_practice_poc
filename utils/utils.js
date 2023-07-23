const jwt = require('jsonwebtoken');
const { StatusDescription } = require('./errorPhrase');
const { DateTime } = require('luxon');


const getSystemDateTime = () => {
    return DateTime.now().setZone('Asia/Kolkata');
};

const errorHandler = (error) => {
    console.log("errorHandler ==> ", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
        return `Duplicate entry: ${error.errors[0].message}`;
    } else if (error instanceof Error) {
        return error.message || error;
    } else {
        return error;
    }
}

const createErrorPayload = (error) => {
    return {
        status: StatusDescription.FAILED,
        error: error
    }
}


const extractUserId = async (req) => {
    const token = req.headers['authorization'];
    try {
        if (!token) {
            return;
        }
        const tokenRegex = /^Bearer (.+)$/i;
        const matches = token.match(tokenRegex);

        if (!matches || matches.length < 2) {
            return false;
        }
        const seperatedtoken = matches[1];

        const decoded = jwt.verify(seperatedtoken, process.env.SECRET_KEY);

        console.log("decoded ",decoded);

        return decoded.userId;
    } catch (error) {
        console.error(error);
        return 0;
    }
};

const notFound = (pageName, id) => {
    return `${pageName} not found with id ${id}`
}

const minutesToSeconds = (mins) => {
    mins = typeof mins === "string" ? Number(mins) : mins;
    return (mins * 60);
};

const generateTokens = (userId) => {
    const accessTokenExpiry = getSystemDateTime().plus({ minutes: Number(process.env.ACCESS_TOKEN_EXPIERY) }).toISO();
    const refreshTokenExpiry = getSystemDateTime().plus({ minutes: Number(process.env.REFRESH_TOKEN_EXPIERY) }).toISO();
    const accessToken = jwt.sign({ userId: userId }, process.env.SECRET_KEY, { expiresIn: minutesToSeconds(process.env.ACCESS_TOKEN_EXPIERY) });
    const refreshToken = jwt.sign({ userId: userId }, process.env.SECRET_KEY, { expiresIn: minutesToSeconds(process.env.REFRESH_TOKEN_EXPIERY) });
    return { accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry }
}


module.exports = {
    errorHandler,
    extractUserId,
    notFound,
    createErrorPayload,
    getSystemDateTime,
    minutesToSeconds,
    generateTokens
}