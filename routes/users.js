const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

//require user model
const User = require('../models/user');

//register route
router.post('/register', (req, res, next) => {
    //create new user object and fill in details
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    //add the user
    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg: 'Failed to resgister'});
        } else{
            res.json({success: true, msg: 'User registered'});
        }
    });
});

//authenticate route
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;

        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            
            if(isMatch){
                const token = jwt.sign({ data: user }, config.secret, { expiresIn: '1h' });

                res.json({
                    success: true,
                    token: 'JWT '+ token,
                    user: {
                        id : user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            }else{
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

//profile route
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.send({user: req.user});
});

module.exports = router;