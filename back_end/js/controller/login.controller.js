const adminService = require('../service/admin.service')
const managerService = require('../service/manager.service')
const developerService = require('../service/developer.service')
const crypto = require("crypto");
const config = require('../../config');

const jwt = require('jsonwebtoken');

routes = function () {
    var route = require('express').Router();

    route.post('/developer', (req, res) => {

      developerService.getByEmail(req.body.email)
        .then(
          (data) => {
            if(data != null) {
              console.log(req.body.password)
              console.log(data.password)
              if(comparePassword(req.body.password, data.password.S)) {
                var user = {
                  id: data.id,
                  realname: data.realname,
                  email: data.email,
                  role: "developer"
                }
                var token = jwt.sign(user, config.jwtsecret, {
                  expiresIn : 60*60*24// out time 24h
                });
                res.setHeader("x-access-token",token)
                res.json({
                  success: true,
                  message: 'login successfully',
                  token: token
                });
              } else {
                res.json({
                  success: false,
                  message: "email or password incorrect"
                })
              }
            } else {
              res.json({
                success: false,
                message: "email or password incorrect"
              })
            }
          }
        )
    });
    route.post('/admin', (req, res) => {
        adminService.getByEmail(req.body.email)
          .then(
            (data) => {
              if(data != null) {
                if(comparePassword(req.body.password, data.password.S)) {
                  var user = {
                    id: data.id,
                    realname: data.realname,
                    email: data.email,
                    role: "admin"
                  }
                  var token = jwt.sign(user, config.jwtsecret, {
                    expiresIn : 60*60*24// out time 24h
                  });
                  res.setHeader("x-access-token",token)
                  res.json({
                    success: true,
                    message: 'login successfully',
                    token: token
                  });
                } else {
                  res.json({
                    success: false,
                    message: "email or password incorrect"
                  })
                }
              } else {
                res.json({
                  success: false,
                  message: "email or password incorrect"
                })
              }
            }
          )
    });
    route.post('/manager', (req, res) => {
      managerService.getByEmail(req.body.email)
        .then(
          (data) => {
            if(data != null) {
              if(comparePassword(req.body.password, data.password.S)) {
                var user = {
                  id: data.id,
                  realname: data.realname,
                  email: data.email,
                  role: "manager"
                }
                var token = jwt.sign(user, config.jwtsecret, {
                  expiresIn : 60*60*24// out time 24h
                });
                res.setHeader("x-access-token",token)
                res.json({
                  success: true,
                  message: 'login successfully',
                  token: token
                });
              } else {
                res.json({
                  success: false,
                  message: "email or password incorrect"
                })
              }
            } else {
              res.json({
                success: false,
                message: "email or password incorrect"
              })
            }
          }
        )
    });

    return route;
};

function comparePassword(pwd, md5pwd) {
  let md5 = crypto.createHash("md5");
  if(md5pwd == md5.update(pwd).digest("hex")) {
    return true;
  } else {
    false;
  }

}

module.exports = routes();