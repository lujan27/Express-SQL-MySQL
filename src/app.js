const express = require('express');
const app = express();
const logger = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const methodoverride = require('method-override');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(methodoverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(myConnection(mysql, {
    user: 'root', //In MySQL the user by default is root
    password: '', //The password is empty by default as well
    host: 'localhost', //If you're in a develop enviroment you can put this on host
    port: 8080, //Check in your connection for your port
    database: 'person'
}, 'single'));

app.use(require('./routes/index'));

app.listen(port, () => {
    console.log('Server on port: ', port);
});
