const express = require('express')

const fs = require('fs');
const path = require('path');
const app = express()
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const config = require('./config');
const apiRoutes = require('./js/routes.js');
const route_login = require('./js/controller/login.controller.js');
const route_registe = require('./js/controller/registe.controller.js');


app.set('superSecret', config.jwtsecret);
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
// log
app.use(morgan('dev'));


//allow custom header and CORS
app.all('*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
  // next();
});

app.use('/login', route_login);

app.use('/registe', route_registe);

app.use('/api', apiRoutes);

app.get('/test', function (req, res) {
  res.send('GET /test successfully')
})

app.use(express.static(path.resolve(__dirname, './dist')));

app.get('*', function (req, res) {
  var html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8');
  // res.send("hello");
});


app.listen(config.network.port);
console.log('ADDRESS:PORT: ' + config.network.port);
module.exports = app;