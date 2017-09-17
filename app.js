const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//connect to database
mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
    console.log('connected to db ' + config.database);
});
//db error
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

require('./config/passport')(passport);

//set up static folder
app.use(express.static(path.join(__dirname, 'public')));

//any /users route use users file for it
app.use('/users', users);

app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
    console.log('Server started on port ' + port);
});