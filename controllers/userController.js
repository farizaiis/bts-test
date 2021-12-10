require('dotenv').config();
const Joi = require('joi');
const { generateToken } = require('../helpers/jwt');
const { encrypt, comparePass } = require('../helpers/bcrypt');
const { user } = require('../models');

module.exports = {
    signup: async (req, res) => {
        const body = req.body;

        try {
            const schema = Joi.object({
                username: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().min(6).max(12).required(),
                phone: Joi.number().required(),
                address: Joi.string().required(),
                city: Joi.string().required(),
                country: Joi.string().required(),
                name: Joi.string().required(),
                postcode: Joi.number().required(),
            });

            const check = schema.validate(
                {
                    username: body.username,
                    email: body.email,
                    password: body.password,
                    phone: body.phone,
                    address: body.address,
                    city: body.city,
                    country: body.country,
                    name: body.name,
                    postcode: body.postcode,
                },
                { abortEarly: false }
            );

            if (check.error) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'bad request',
                    errors: check.error['details'].map(
                        ({ message }) => message
                    ),
                });
            }

            const checkEmail = await user.findOne({
                where: {
                    email: body.email,
                },
            });

            if (checkEmail) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Email already use, please use another email',
                });
            }

            const createUser = await user.create({
                username: body.username,
                email: body.email,
                password: encrypt(body.password),
                phone: body.phone,
                address: body.address,
                city: body.city,
                country: body.country,
                name: body.name,
                postcode: body.postcode,
            });
            const payload = {
                role: createUser.dataValues.role,
                email: createUser.dataValues.email,
                id: createUser.dataValues.id,
            };

            const token = generateToken(payload);

            const data = {
                email: createUser.dataValues.email,
                token: token,
                username: createUser.dataValues.username,
            };

            return res.status(200).json({
                status: 'success',
                message: 'Sign up Successfully',
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

    signin: async (req, res) => {
        const body = req.body;

        try {
            const schema = Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required(),
            });

            const check = schema.validate(
                {
                    email: body.email,
                    password: body.password,
                },
                { abortEarly: false }
            );

            if (check.error) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'bad request',
                    errors: check.error['details'].map(
                        ({ message }) => message
                    ),
                });
            }

            const userEmailData = await user.findOne({
                where: {
                    email: body.email,
                },
            });

            if (!userEmailData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Invalid email',
                });
            }

            const checkPass = comparePass(
                body.password,
                userEmailData.dataValues.password
            );

            if (!checkPass) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Invalid password',
                });
            }

            const payload = {
                role: userEmailData.dataValues.role,
                email: userEmailData.dataValues.email,
                id: userEmailData.dataValues.id,
            };

            const token = generateToken(payload);

            const data = {
                email: body.email,
                token: token,
                username: userEmailData.dataValues.username,
            };

            return res.status(200).json({
                status: 'success',
                message: 'Sign in Successfully',
                data: data,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'Internal server error',
            });
        }
    },

    getAllUser: async (req, res) => {
        try {
            const getAll = await user.findAll({
                attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
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
};
