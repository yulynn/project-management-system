const projectService = require('../service/project.service.js');
const developerService = require('../service/developer.service.js');
const mailService = require('../service/mail.service.js');

routes = function () {
    var route = require('express').Router();

    // manager create project
    route.post('/', (req, res) => {
        if (req.user && (req.user.role == "manager" || req.user.role == "admin")) {
            var managerid = req.user.id
            if (typeof managerid === 'object') managerid = managerid.S
            if (req.body.realname && req.body.state && req.body.intro) {
                var newOne = {
                    realname: req.body.realname,
                    state: req.body.state,
                    intro: req.body.intro,
                    manager: managerid
                };
                projectService.add(newOne)
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
        } else {
            return res.status(403).send({
                success: false,
                message: 'error'
            });
        }
    })

    // manager delete project
    route.delete('/:projectid', (req, res) => {
        // body: projectid
        if (req.user && (req.user.role == "manager" || req.user.role == "admin")) {
            projectService.delete(req.params.projectid)
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
            
            return res.status(403).send({
                success: false,
                message: 'error'
            });
        }
    });

    // all get project profile
    route.get('/profile/:projectid', (req, res) => {
        projectService.get(req.params.projectid)
            .then(
                (data) => {
                    res.json({
                        success: true,
                        data: data
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
    });

    // manager update project profile
    route.put('/profile', (req, res) => {
        if (req.user && (req.user.role == "manager" || req.user.role == "admin")) {
            projectService.update(req.body)
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
            
            return res.status(403).send({
                success: false,
                message: 'error'
            });
        }
    });
    
    // all get projects
    route.get('/all/:pageNum/:pageSize', (req, res) => {
        projectService.getAll()
            .then(
                (data) => {
                    var total = data.length
                    data = data.splice((req.params.pageNum - 1) * req.params.pageSize, req.params.pageSize)
                    res.json({
                        success: true,
                        data: data,
                        total: total
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
    });

    // manager update project state
    route.put('/state/:projectid/:state', (req, res) => {
        if (req.user && (req.user.role == "manager" || req.user.role == "admin")) {
            projectService.updateState(req.params.projectid, req.params.state)
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
            return res.status(403).send({
                success: false,
                message: 'error'
            });
        }
    });

    // manager distribute project
    route.route('/distribute/:projectid/:userid')
        .get((req, res) => {
            if (req.user && (req.user.role == "manager" || req.user.role == "admin")) {
                projectService.addDeveloper(req.params.projectid, req.params.userid)
                    .then(
                        (data) => {
                            developerService.addProjectsJoined(req.params.projectid, req.params.userid)
                                .then(
                                    (data) => {
                                        res.json({
                                            success: true
                                        })
                                    }
                                )
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
                
                return res.status(403).send({
                    success: false,
                    message: 'error'
                });
            }
        })
        .delete((req, res) => {
            if (req.user && (req.user.role == "manager" || req.user.role == "admin")) {
                projectService.deleteDeveloper(req.params.projectid, req.params.userid)
                    .then(
                        (data) => {
                            developerService.deleteProjectsJoined(req.params.projectid, req.params.userid)
                                .then(
                                    (data) => {
                                        res.json({
                                            success: true
                                        })
                                    }
                                )
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
                return res.status(403).send({
                    success: false,
                    message: 'error'
                });
            }
        });

    // manager
    route.get('/list/:pageSize/:pageNum', (req, res) => {
        if (req.user && (req.user.role == "manager" || req.user.role == "admin")) {
            var managerid = req.user.id
            if (typeof managerid === 'object') managerid = managerid.S
            projectService.getByManager(managerid)
                .then(
                    (data) => {
                        var total = data.length
                        data = data.splice((req.params.pageSize - 1) * req.params.pageNum, req.params.pageNum)
                        res.json({
                            success: true,
                            data: data,
                            total: total
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
            
            return res.status(403).send({
                success: false,
                message: 'error'
            });
        }
    });

    // all send email
    route.post('/sendmail', (req, res) => {
        let options = req.body
        mailService.sendMail(options)
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
    });

    return route;
};

module.exports = routes();