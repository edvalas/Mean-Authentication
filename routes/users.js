const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

//require user model
const User = require('../models/user');

//register route
router.post('/register', (req, res, next) => {
    //create new user object and fill in details from the request body
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    //add the user to the db by calling the User.addUser method and return a json object as responce
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
    //get the username and password from request body
    const username = req.body.username;
    const password = req.body.password;

    //first check if user is registered by getting user from db by username, if there is an error throw error
    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;

        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }

        //if the user is found then call the compare passwords method and pass in the password entered in the logging form
        //and the password that was returned from the db
        User.comparePassword(password, user.password, (err, isMatch) => {
            //if they dont match then throw an error
            if(err) throw err;
            
            //if passwords do match
            if(isMatch){
                //create a jwt token, which contains user data from db, is encrypted with the secret from config.secret
                //and exoures in 1 hour
                const token = jwt.sign({ data: user }, config.secret, { expiresIn: '1h' });

                //return json responce to frontend and some user details excluding the password
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
                //else passwords did not match return error message
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

//profile route, which requires jwt authentication
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //if the user has a jwt token and authenticates then send back the user data from the jwt token as it contains the user object
    res.send({user: req.user});
});

//expose the router to other classes
module.exports = router;