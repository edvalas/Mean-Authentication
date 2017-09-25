const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./database');
const User = require('../models/user');

//method to extract jwt token from request header
module.exports = function(passport){
    let opts = {};
    //extract the jwt and add to opts
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    //add the secret from config to opts
    opts.secretOrKey = config.secret;

    //pass in the opts to use method
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        //console.log(jwt_payload);
        //get the user by id from db and _id is extracted from jwt
        User.getUserById(jwt_payload.data._id, (err, user) => {
            //if user exist then return the user otherwise return error
            if(err){
                return done(err, false);
            }

            if(user){
                return done(null, user);
            }else{
                return done(null, false);
            }
        });
    }));
}