const express = require('express');
const models = require('../models');
const User = require('../models/users')(models.sequelize);
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/', (req, res) => {
    User.findAll({
        attributes: ['name', 'email', 'id']
    }).then(users => {
        res.json({
            error: false,
            users: users
        });
    }).catch(err => {
        res.json({ message: "some error occured" });
    });
});

router.post('/register', (req, res, next) => {
    User.findAll({
        where: {
            email: req.body.email
        }
    }).then(users => {
        if (users.length !== 0) {
            res.json({
                error: true,
                message: 'user already exists'
            });
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash
            }).then(user => {
                res.status(200).json({
                    error: false,
                    message: 'user registered successfully',
                    email: user.email
                });
            }).catch(err => {
                next(err);
            });
        }
    }).catch(err => {
        next(err);
    });
});

router.post('/login', (req, res, next) => {
    User.findAll({
        where: {
            email: req.body.email
        }
    }).then(users => {
        let user = users[0];
        bcrypt.compare(req.body.password, user.password, (err, status) => {
            if (status) {
                res.status(200).json({
                    error: false,
                    message: 'succesfully logged in',
                    user: {
                        email: user.email,
                        name: user.name,
                        id: user.id
                    }
                });
            } else {
                res.json({
                    error: true,
                    message: 'invalid credentials'
                });
            }
        });
    }).catch(err => {
        next(err);
    });
});

module.exports = router;