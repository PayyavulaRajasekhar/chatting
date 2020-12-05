const express = require('express');
const models = require('../models');
const User = require('../models/users')(models.sequelize);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authCheck = require('../middleware/auth');

router.get('/', authCheck, (req, res) => {
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
    let fetchedUser;
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        } else {
            res.json({
                error: true,
                message: 'email not registered'
            });
        }
    }).then(result => {
        if (result) {
            const token = jwt.sign(
                { email: fetchedUser.email, id: fetchedUser.id },
                "TYJSP1234",
                { expiresIn: '1hr' }
            );
            res.status(200).json({
                token: token,
                error: false,
                message: 'succesfully logged in',
                user: {
                    email: fetchedUser.email,
                    name: fetchedUser.name,
                    id: fetchedUser.id
                }
            });
        } else {
            res.json({
                error: true,
                message: 'invalid credentials'
            });
        }
    }).catch(err => {
        next(err);
    });
});

module.exports = router;