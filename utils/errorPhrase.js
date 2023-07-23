
const StatusCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
}
const StatusDescription = {
    SUCCESS: 'Success',
    FAILED: 'Failed',
    OK: 'Ok',
    CREATED: 'Created',
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found',
    METHOD_NOT_ALLOWED: 'Method Not Allowed',
    CONFLICT: 'Conflict',
    INTERNAL_SERVER_ERROR: 'Internal Sever Error',
}

const ErrorPhrase = {
    END_POINT_NOT_FOUND: 'The endpoint you are attempting to access cannot be found.',
    TOKEN_NOT_PROVIDED: 'Token not provided.',
    UNAUTHORIZED: 'Access unauthorized.',
    INVALID_TOKEN: 'The token provided is invalid.',
    FORBIDDEN: 'Access forbidden.',
    USER_NOT_FOUND: 'The user could not be found.',
    INVALID_CREDENTIALS: 'Invalid credentials; please double-check your login information and try again.',
    ID_NOT_FOUND: 'The specified ID was not found in the URL.',
    DATA_NOT_FOUND: 'The data you are attempting to search for is not found.',
    INTERNAL_SERVER_ERROR: 'Internal Server Error: Something went wrong.',
    PASSWORD_RESET_SUCCESS: 'Password has been reset successfully.'
}

module.exports = {
    StatusCode,
    ErrorPhrase,
    StatusDescription
}