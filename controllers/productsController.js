const { StatusCode, StatusDescription, ErrorPhrase } = require("../utils/errorPhrase");
const { createErrorPayload, errorHandler, generateTokens } = require("../utils/utils");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs/dist/bcrypt");
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

        res.status(StatusCode.OK).send({
            status: StatusDescription.SUCCESS,
            statusCode: StatusCode.OK,
            data: product,
        });

    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send(createErrorPayload({
            status: StatusDescription.INTERNAL_SERVER_ERROR,
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            message: errorHandler(error),
        }));
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
                res.status(StatusCode.NOT_FOUND).send({
                    status: StatusDescription.NOT_FOUND,
                    statusCode: StatusCode.NOT_FOUND,
                    message: 'User data not found.',
                });
            }

        } else {
            res.status(StatusCode.NOT_FOUND).send(createErrorPayload({
                status: StatusDescription.NOT_FOUND,
                statusCode: StatusCode.NOT_FOUND,
                message: ErrorPhrase.ID_NOT_FOUND,
            }));
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