const { StatusCode, StatusDescription, ErrorPhrase } = require("../utils/errorPhrase");
const { createErrorPayload, errorHandler, notFound } = require("../utils/utils");
const { Product } = require("../models");
const { Op } = require('sequelize');


const createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;

        const product = await Product.create({
            name,
            price,
            description,
        });

        res.status(StatusCode.CREATED).send({
            status: StatusDescription.SUCCESS,
            statusCode: StatusCode.CREATED,
            data: product,
        });

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

const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy, sortOrder, filter } = req.query;

        const options = {
            offset: (page - 1) * limit,
            limit: parseInt(limit),
            order: [],
            where: {},
        };

        if (sortBy) {
            const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
            options.order.push([sortBy, order]);
        }

        if (filter) {
            options.where = {
                [Op.or]: [
                    { name: { [Op.like]: `%${filter}%` } },
                    { description: { [Op.like]: `%${filter}%` } },
                ],
            };
        }

        const products = await Product.findAll(options);
        const totalCount = await Product.count(options);

        res.status(StatusCode.OK).send({
            status: StatusDescription.SUCCESS,
            statusCode: StatusCode.OK,
            data: { data: products, count: totalCount },
        });
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(createErrorPayload({
            status: StatusDescription.INTERNAL_SERVER_ERROR,
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            message: errorHandler(error),
        }));
    }
};

const singleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            const product = await Product.findByPk(id);

            if (product) {
                res.status(StatusCode.OK).send({
                    status: StatusDescription.SUCCESS,
                    statusCode: StatusCode.OK,
                    data: product,
                });
            } else {
                throw Error(notFound('Product', id))
            }

        } else {
            throw Error(ErrorPhrase.ID_NOT_FOUND);
        }

    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(createErrorPayload({
            status: StatusDescription.INTERNAL_SERVER_ERROR,
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            message: errorHandler(error),
        }));
    }
}


module.exports = {
    createProduct,
    getProducts,
    singleProduct
}