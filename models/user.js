const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User schema describing how data is stored on the database
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
//export the schema/class, which allows other classes to use this schema
const User = module.exports = mongoose.model('User', UserSchema); // model name, schema

//get user by ID, takes in id, then findbyid mongoose method is called with the id
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

//get user by username, which takes in a username
module.exports.getUserByUsername = function(username, callback){
    //create a query object, which has a field of username and value of what username is passed in
    const query = {username: username}
    //findOne document on db that matches the queries username
    User.findOne(query, callback);
}

//add user, takes in a user object
module.exports.addUser = function(newUser, callback){
    //using the bcrypt lib generate a hashed password for the new user
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            //if everything is ok then assign the hash to be the password
            newUser.password = hash;
            //save the newUser object to the db
            newUser.save(callback);
        });
    });
}

//compare passwords function, which compares the password entered by a user
//against the hashed password on the db
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};