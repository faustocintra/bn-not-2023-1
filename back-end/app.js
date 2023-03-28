// Carregar as variáveis de ambiente a partir do arquivo .env
require('dotenv').config()

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Conectar ao banco de dados
require('./config/database')()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/*************************
 * ROTAS
 *************************/

const customersRouter = require('./routes/customers')
app.use('/customers', customersRouter)

module.exports = app;
