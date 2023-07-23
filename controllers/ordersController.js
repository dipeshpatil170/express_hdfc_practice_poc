const { StatusCode, StatusDescription, ErrorPhrase } = require("../utils/errorPhrase");
const { createErrorPayload, errorHandler, generateTokens, extractUserId, notFound } = require("../utils/utils");
const { Product, Order } = require("../models");


const createOrder = async (req, res) => {

    try {
        const { productId, quantity } = req.body;
        const userId = await extractUserId(req);
        const product = await Product.findByPk(productId);

        if (!product) {
            throw Error(notFound('Product', productId));
        } else {
            const totalPrice = product.price * quantity;
            const order = await Order.create({
                quantity,
                totalPrice,
                userId: userId,
                productId: productId,
            });

            res.status(StatusCode.OK).send({
                status: StatusDescription.SUCCESS,
                statusCode: StatusCode.OK,
                data: order,
            });
        }

    } catch (error) {
        if (error.name && error.name === 'SequelizeUniqueConstraintError') {
            res.status(StatusCode.CONFLICT).send(createErrorPayload({
                status: StatusDescription.CONFLICT,
                statusCode: StatusCode.CONFLICT,
                message: errorHandler(error),
            }));
        } else {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).send(createErrorPayload({
                status: StatusDescription.INTERNAL_SERVER_ERROR,
                statusCode: StatusCode.INTERNAL_SERVER_ERROR,
                message: errorHandler(error),
            }));
        }
    }

}


module.exports = {
    createOrder,
}