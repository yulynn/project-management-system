const developerService = require('../service/developer.service.js');
const projectService = require('../service/project.service.js');
const crypto = require("crypto");

routes = function () {
    var route = require('express').Router();

    route.use(function (req, res, next) {
        if (req.user && req.user.role == "developer") {
            next();
        } else {
            
            return res.status(403).send({
                success: false,
                message: 'error'
            });
        }
    });

    route.route('/profile')
        // developer
        .get((req, res) => {
            var id = req.user.id
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
                            error: 'error'
                        })
                    }
                )
        })
        // developer
        .put((req, res) => {
            var newOne = req.body
            newOne.id = req.user.id
            if (typeof newOne.id === 'object') newOne.id = newOne.id.S
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

    // developer
    route.get('/project/apply/:projectid', (req, res) => {
        var id = req.user.id
        if (typeof id === 'object') id = id.S
        var projectid = req.params.projectid
        projectService.addApply(projectid, id)
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
    });

    // developer
    route.get('/project/joined/:pageNum/:pageSize', (req, res) => {
        var id = req.user.id
        developerService.get(id)
            .then(
                (data) => {
                    var projects_joined = data.projects_joined
                    console.log(projects_joined)
                    if (projects_joined.length <= 0) {
                        res.json({
                            success: true,
                            data: []
                        })
                    } else {
                        projectService.getByIds(projects_joined)
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

    // developer
    route.get('/project/:projectid', (req, res) => {
        projectService.get(req.params.projectid)
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
    });

    return route;
};

module.exports = routes();