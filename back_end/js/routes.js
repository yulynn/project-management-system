const route_admin = require('./controller/admin.controller.js');
const route_manager = require('./controller/manager.controller.js');
const route_developer = require('./controller/developer.controller.js');
const route_project = require('./controller/project.controller.js');
const jwt = require('jsonwebtoken'); 
const config = require('../config'); 


routes = function () {
  
  var route = require('express').Router();

    route.get('/', (req, res) => {
        res.status(200).send({message: "api route"});
    });

    route.use(function(req, res, next) {
        
        var token = req.headers['x-access-token'];
        
        if (token) {
          jwt.verify(token, config.jwtsecret, function(err, decoded) {
            if (err) {
              return res.json({ success: false, message: 'token invalid.' });
            } else {
              req.user = decoded;
              next();
            }
          });
        } else {
          return res.status(403).send({ 
              success: false,
              message: 'token not found.'
          });
        }
      });

    route.use('/admin', route_admin);
    route.use('/manager', route_manager);
    route.use('/developer', route_developer);
    route.use('/project', route_project);

    return route;
};

module.exports = routes();



function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}