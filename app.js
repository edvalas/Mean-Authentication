//imports/setting up dependencies we need
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//connect to the database, inside the config file, database variable just contains a url
//to mongodb://localhost:27017/meanauth
mongoose.connect(config.database);

//if connected successfully, output a message
mongoose.connection.on('connected', () => {
    console.log('connected to db ' + config.database);
});
//if there is a db error, output a message
mongoose.connection.on('error', (err) => {
    console.log('db error ' + err);
});

const app = express();

//set up users var for routing
const users = require('./routes/users');

//port
const port = 3000;

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
//require the passpost function, which extracts user info from web token sent in the header
require('./config/passport')(passport);

//set up static folder
app.use(express.static(path.join(__dirname, 'public')));

//any /users route requested will be redirectedto routes/users file for it
app.use('/users', users);

//index route, send responce as there is nothing there
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

//any other route than the ones defined shows the home page
app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname, 'public/index.html'));
});

//run the app and listen on the port we assigned
app.listen(port, () => {
    console.log('Server started on port ' + port);
});