require('dotenv').config();
const Joi = require('joi').extend(require('@joi/date'));
const { shopping } = require('../models');

module.exports = {
    create: async (req, res) => {
        const body = req.body;

        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                createdDate: Joi.date().required().format('YYYY-MM-DD'),
            });

            const check = schema.validate(
                {
                    name: body.name,
                    createdDate: body.createdDate,
                },
                { abortEarly: false }
            );

            if (check.error) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Bad request',
                    errors: check.error['details'].map(
                        ({ message }) => message
                    ),
                });
            }

            const createShopping = await shopping.create({
                userId: req.users.id,
                name: body.name,
                createdDate: body.createdDate,
            });

            const data = {
                name: body.name,
                id: createShopping.dataValues.id,
                createdDate: body.createdDate,
            };

            return res.status(200).json({
                status: 'success',
                message: 'Succesfully input new data Shopping',
                data: data,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: 'Internal Server Error',
            });
        }
    },

    getAllShopping: async (req, res) => {
        try {
            const getAll = await shopping.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            });

            return res.status(200).json({
                status: 'success',
                message: 'Success retrieved data',
                data: getAll,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'Internal Server Error',
            });
        }
    },

    getOneShopping: async (req, res) => {
        const id = req.params.id;

        try {
            const getData = await shopping.findOne({
                where: { id },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            });

            if (getData.dataValues.id !== req.users.id) {
                return res.status(400).json({
                    status: 'failed',
                    message:
                        'This shoppiong data is not belongs to you, forbidden to access the data',
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Success retrieved data',
                data: getData,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'Internal Server Error',
            });
        }
    },

    updateShopping: async (req, res) => {
        const id = req.params.id;
        const body = req.body;

        try {
            const schema = Joi.object({
                name: Joi.string(),
                createdDate: Joi.date().format('YYYY-MM-DD'),
            });

            const check = schema.validate(
                {
                    name: body.name,
                    createdDate: body.createdDate,
                },
                { abortEarly: false }
            );

            if (check.error) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Bad request',
                    errors: check.error['details'].map(
                        ({ message }) => message
                    ),
                });
            }

            const findData = await shopping.findOne({
                where: { id },
            });

            if (!findData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Data not found',
                });
            }

            if (findData.dataValues.userId !== req.users.id) {
                return res.status(400).json({
                    status: 'failed',
                    message:
                        'This shoppiong data is not belongs to you, forbidden to access the data',
                });
            }

            await shopping.update(
                {
                    name: body.name,
                    createdDate: body.createdDate,
                },
                { where: { id } }
            );

            const data = await shopping.findOne({
                where: { id },
            });

            return res.status(200).json({
                status: 'success',
                message: 'Success update the data',
                data: data,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'Internal Server Error',
            });
        }
    },

    deleteShopping: async (req, res) => {
        const id = req.params.id;

        try {
            const findData = await shopping.findOne({
                where: { id },
            });

            if (!findData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Data not found',
                });
            }

            if (findData.dataValues.userId !== req.users.id) {
                return res.status(400).json({
                    status: 'failed',
                    message:
                        'This shoppiong data is not belongs to you, forbidden to access the data',
                });
            }

            await shopping.destroy({
                where: { id },
            });

            return res.status(200).json({
                status: 'success',
                message: 'Delete data has successfully',
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'Internal Server Error',
            });
        }
    },
};
