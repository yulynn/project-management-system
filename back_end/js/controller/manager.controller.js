const managerService = require('../service/manager.service.js');
const developerService = require('../service/developer.service.js');
const projectService = require('../service/project.service.js');
const crypto = require("crypto");

routes = function () {
    var route = require('express').Router();

    route.use(function (req, res, next) {
        if (req.user && (req.user.role === "manager" || req.user.role === "admin")) {
            next();
        } else {            
            return res.status(403).send({
                success: false,
                message: 'error.'
            });
        }
    });

    route.route('/profile')
        // manager
        .get((req, res) => {
            var id = req.user.id
            managerService.get(id)
                .then(
                    (data) => {
                        res.json({
                            success: true,
                            data: data
                        })
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        res.json({
                            success: false,
                            error: 'error'
                        })
                    }
                )
        })
        // manager
        .put((req, res) => {
            var newOne = req.body
            newOne.id = req.user.id
            if (typeof newOne.id === 'object') newOne.id = newOne.id.S
            if(newOne.password && newOne.password.length != 32) {
                newOne.password = crypto.createHash("md5").update(newOne.password).digest("hex")
            }
            console.log(newOne)
            managerService.update(newOne)
                .then(
                    (data) => {
                        res.json({
                            success: true
                        })
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        res.json({
                            success: false,
                            error: 'error'
                        })
                    }
                )
        });
    
    // manager
    route.post('/developer', (req, res) => {
        developerService.getByIds(req.body.ids)
            .then(
                (data) => {
                    var total = data.length
                    res.json({
                        success: true,
                        data: data,
                        total: total
                    })
                }
            )
            .catch(
                (err) => {
                    console.log(err)
                    res.json({
                        success: false,
                        error: 'error'
                    })
                }
            )
    });

    // manager
    route.put('/developer/profile', (req, res) => {
        var newOne = req.body
        if(newOne.password && newOne.password.length != 32) {
            newOne.password = crypto.createHash("md5").update(newOne.password).digest("hex")
        }
        developerService.update(newOne)
            .then(
                (data) => {
                    res.json({
                        success: true
                    })
                }
            )
            .catch(
                (err) => {
                    console.log(err)
                    res.json({
                        success: false,
                        error: 'error'
                    })
                }
            )
    });

    // manager
    route.get('/developer/name/:realname', (req, res) => {
        var realname = req.params.realname
        developerService.getByName(realname)
            .then(
                (data) => {
                    let total = data.Items.length
                    res.json({
                        success: true,
                        data: data.Items,
                        total: total
                    })
                }
            )
            .catch(
                (err) => {
                    console.log(err)
                    res.json({
                        success: false,
                        error: "error"
                    })
                }
            )
    });
    
    // manager
    route.get('/developer/profile/:developerid', (req, res) => {
            var id = req.params.developerid
            developerService.get(id)
                .then(
                    (data) => {
                        res.json({
                            success: true,
                            data: data
                        })
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        res.json({
                            success: false,
                            error: "error"
                        })
                    }
                )
    });

    // manager
    route.get('/developer/:pageNum/:pageSize', (req, res) => {
        developerService.getAll()
            .then(
                (data) => {
                    var total = data.length
                    data = data.splice((req.params.pageNum - 1) * req.params.pageSize, req.params.pageSize)
                    res.json({
                        success: true,
                        data: data,
                        total: total
                    })
                }
            )
            .catch(
                (err) => {
                    console.log(err)
                    res.json({
                        success: false,
                        error: 'error'
                    })
                }
            )
    });

    // manager
    route.post('/project/resume', (req, res) => {
        var apply = req.body
        // post json:
        // projectid
        // userid
        // state
        if (apply.state === "pass") {
            projectService.addDeveloper(apply.projectid, apply.developerid)
                .then(
                    (data) => {
                        projectService.deleteApply(apply.projectid, apply.developerid)
                            .then(
                                (data) => {
                                    developerService.addProjectsJoined(apply.projectid, apply.developerid)
                                    .then(
                                        (data) => {
                                            res.json({
                                                success: true
                                            })
                                        }
                                    )
                                    .catch(
                                        (err) => {
                                            console.log(err)
                                            res.json({
                                                success: false,
                                                error: 'error'
                                            })
                                        }
                                    )
                                }
                            )
                            .catch(
                                (err) => {
                                    console.log(err)
                                    res.json({
                                        success: false,
                                        error: 'error'
                                    })
                                }
                            )
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        res.json({
                            success: false,
                            error: 'error'
                        })
                    }
                )
        } else if (apply.state === "reject") {
            projectService.deleteApply(apply.projectid, apply.developerid)
                .then(
                    (data) => {
                        res.json({
                            success: true
                        })
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        res.json({
                            success: false,
                            error: 'error'
                        })
                    }
                )
        }
    });
    // manager
    route.get('/project/resume/:projectid/:pageNum/:pageSize', (req, res) => {
        projectService.get(req.params.projectid)
            .then(
                (data) => {
                    var applies = data.applies
                    developerService.getByIds(applies)
                        .then(
                            (data) => {
                                var total = data.length
                                data = data.splice((req.params.pageNum - 1) * req.params.pageSize, req.params.pageSize)
                                res.json({
                                    success: true,
                                    data: data,
                                    total: total
                                })
                            }
                        )
                        .catch(
                            (err) => {
                                console.log(err)
                                res.json({
                                    success: false,
                                    error: 'error'
                                })
                            }
                        )
                }
            )
            .catch(
                (err) => {
                    console.log(err)
                    res.json({
                        success: false,
                        error: 'error'
                    })
                }
            )
    });

    return route;
};

module.exports = routes();