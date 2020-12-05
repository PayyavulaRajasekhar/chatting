const express = require('express');
const models = require('../models');
const Message = require('../models/messages')(models.sequelize);
const User = require('../models/users')(models.sequelize);
const { Op } = require('sequelize');
const router = express.Router();

const authCheck = require('../middleware/auth');

router.post('/', authCheck, (req, res, next) => {
    User.findAll({
        where: {
            id: {
                [Op.or]: [req.body.sender, req.body.receiver]
            }
        }
    }).then(users => {
        console.log(users);
        if (users.length === 2) {
            Message.create({
                sender: req.body.sender,
                receiver: req.body.receiver,
                message: req.body.message
            }).then(message => {
                res.status(200).json({
                    error: false,
                    message: 'message successfully sent'
                });
            }).catch(err => {
                next(err);
            });
        } else {
            res.json({
                error: true,
                message: 'send or receiver not found'
            });
        }
    }).catch(err => {
        next(err);
    });
});

router.get('/', authCheck, (req, res, next) => {
    const params = req.query;
    Message.findAll({
        where: {
            sender: {
                [Op.or]: [params.sender, params.receiver]
            },
            receiver: {
                [Op.or]: [params.sender, params.receiver]
            }
        }
    }).then(messages => {
        res.json({
            error: false,
            messages: messages
        });
    }).catch(err => {
        next(err);
    });
});

module.exports = router;