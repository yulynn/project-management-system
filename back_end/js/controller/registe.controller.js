const adminService = require('../service/admin.service');
const developerService = require('../service/developer.service');
const managerService = require('../service/manager.service');
const codeService = require('../service/code.service');
const crypto = require("crypto");

routes = function () {
    var route = require('express').Router();

    // admin
    route.post('/admin', (req, res) => {
        if (req.body.realname && req.body.password && req.body.email) {
            var newOne = {
                realname: req.body.realname,
                email: req.body.email,
                password: req.body.password
            };
            codeService.get(req.body.code)
            .then(
                (data) => {
                    if(data) {
                        if (data.state === "unused") {
                            adminService.add(newOne)
                            .then(
                                (data) => {
                                    codeService.delete(req.body.code)
                                    .then(
                                        (data) => {
                                            res.json({
                                                success: true
                                            })
                                        })
                                    .catch(
                                        (err) => {
                                            res.json({
                                                success: false,
                                                msg: "error"
                                            })
                                        }
                                    )
                                })
                            .catch(
                                (err) => {
                                    res.json({
                                        success: false,
                                        msg: "error"
                                    })
                                }
                            )
                        } else {
                            res.json({
                                success: false,
                                msg: 'The code has been used'
                            })
                        }
                    } else {
                        res.json({
                            success: false,
                            msg: 'The code does not exist'
                        })
                    }
                })
            .catch(
                (err) => {
                    res.json({
                        success: false,
                        msg: "error"
                    })
                }
            )
        } else {
            res.json({
                success: false,
                msg: "error"
            });
        }
    });

    // manager
    route.post('/manager', (req, res) => {
        if (req.body.realname && req.body.password && req.body.email && req.body.code) {
            var newOne = {
                realname: req.body.realname,
                email: req.body.email,
                password: req.body.password
            };
            codeService.get(req.body.code)
            .then(
                (data) => {
                    if(data) {
                        if (data.state === "unused") {
                            managerService.add(newOne)
                            .then(
                                (data) => {
                                    codeService.delete(req.body.code)
                                    .then(
                                        (data) => {
                                            res.json({
                                                success: true
                                            })
                                        })
                                    .catch(
                                        (err) => {
                                            res.json({
                                                success: false,
                                                msg: "error"
                                            })
                                        }
                                    )
                                })
                            .catch(
                                (err) => {
                                    res.json({
                                        success: false,
                                        msg: "error"
                                    })
                                }
                            )
                        } else {
                            res.json({
                                success: false,
                                msg: 'The code has been used'
                            })
                        }
                    } else {
                        res.json({
                            success: false,
                            msg: 'The code does not exist'
                        })
                    }
                })
            .catch(
                (err) => {
                    res.json({
                        success: false,
                        msg: "error"
                    })
                }
            )
        } else {
            res.json({
                success: false,
                msg: "error"
            });
        }
    });

    // developer
    route.post('/developer', (req, res) => {
        if (req.body.realname && req.body.password && req.body.email && req.body.skills) {
            var newOne = {
                realname: req.body.realname,
                skills: req.body.skills,
                email: req.body.email,
                password: req.body.password
            };
            developerService.add(newOne)
                .then(
                    (data) => {
                        res.json({
                            success: true
                        })
                    })
                .catch(
                    (err) => {
                        res.json({
                            success: false,
                            msg: "error"
                        })
                    }
                )
        } else {
            res.json({
                success: false,
                msg: "error"
            });
        }
    });
    return route;
};

module.exports = routes();