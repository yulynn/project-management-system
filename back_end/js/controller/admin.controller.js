const adminService = require('../service/admin.service.js');
const managerService = require('../service/manager.service.js');
const developerService = require('../service/developer.service.js');
const projectService = require('../service/project.service.js');
const codeService = require('../service/code.service.js');
const crypto = require("crypto");

routes = function () {
    var route = require('express').Router();


    route.use(function (req, res, next) {
        if (req.user && req.user.role == "admin") {
            next();
        } else {
            
            return res.status(403).send({
                success: false,
                message: 'error.'
            });
        }
    });

    route.route('/profile')
        // admin
        .get((req, res) => {
            console.log("profile")
            // console.log(req.user)
            var id = req.user.id;
            adminService.get(id)
                .then(
                    (data) => {
                        console.log(data)
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
        })
        // admin
        .put((req, res) => {
            var newOne = req.body
            newOne.id = req.user.id
            if (typeof newOne.id === 'object') newOne.id = newOne.id.S
            if(newOne.password && newOne.password.length != 32) {
                newOne.password = crypto.createHash("md5").update(newOne.password).digest("hex")
            }
            adminService.update(newOne)
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
        })
        
    route.route('/')
        // admin
        .get((req, res) => {
            adminService.getAll()
                .then(
                    (data) => {
                        res.status(200).send(data);
                    }
                )
                .catch(
                    (err) => {
                        res.status(500).send(err);
                    }
                )
        })
        .post((req, res) => {
            var newOne = req.body;
            console.log(newOne)
            newOne.id = randomString(32)
            adminService.add(newOne)
                .then(
                    (data) => {
                        res.status(200).send(data);
                    })
                .catch(
                    (err) => {
                        res.status(500).send(err);
                    }
                );
        })
        .put((req, res) => {
            var newOne = req.body;
            console.log(newOne)
            adminService.update(newOne)
                .then(
                    (data) => {
                        res.status(200).send(data);
                    })
                .catch(
                    (err) => {
                        res.status(500).send(err);
                    }
                )
        })
        .delete((req, res) => {
            var id = req.body.id;
            adminService.delete(id)
                .then(
                    (data) => {
                        res.status(200).send(data);
                    })
                .catch(
                    (err) => {
                        res.status(500).send(err);
                    }
                );
        });

    route.get('/:id', (req, res) => {
        var id = req.params.id;
        adminService.get(id)
            .then(
                (data) => {
                    res.status(200).send(data);
                }
            )
            .catch(
                (err) => {
                    res.status(500).send(err);
                }
            )
    });

    route.get('/manager/:pageNum/:pageSize', (req, res) => {
        managerService.getAll()
            .then(
                (data) => {
                    data = data.splice((req.params.pageNum - 1) * req.params.pageSize, req.params.pageSize)
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
    })

    route.route('/manager/:managerid')
        // admin
        .get((req, res) => {
            var id = req.params.managerid
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
                            error: "error"
                        })
                    }
                )
        })
        // admin
        .put((req, res) => {
            var id = req.params.managerid
            var newOne = req.body
            newOne.id = id
            if(newOne.password && newOne.password.length != 32) {
                newOne.password = crypto.createHash("md5").update(newOne.password).digest("hex")
            }
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

    route.route('/user')
        // admin
        .post((req, res) => {
            if (!(req.body.realname && req.body.password && req.body.email && req.body.userType)) {
                res.json({
                    success: false,
                    msg: "error"
                });
            }
            var newOne = {
                realname: req.body.realname,
                email: req.body.email,
                password: req.body.password
            };
            switch (req.body.userType) {
                case "admin":
                    {
                        adminService.add(newOne)
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
                    }
                    break;
                case "manager":
                    {
                        managerService.add(newOne)
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
                    }
                    break;
                case "developer":
                    {
                        newOne.skills = req.body.skills
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
                    }
                    break;
                default:
                    break;
            }
        })
        // admin
        .put((req, res) => {
            // putjson:
            // userid
            // role
            // new_role
            var id = req.body.id
            var role = req.body.role
            var newRole = req.body.newRole
            var oldOne = {}
            var newOne = {}
            var p = {}
            
            switch (role) {
                case 'developer':
                p = developerService.get(id)
                p = p.then(deleteUserFromDeveloper)
                break;
                case 'manager':
                p = managerService.get(id)
                p = p.then(deleteUserFromManager)
                default:
                break;
            }

            switch (newRole) {
                case 'developer':
                p = p.then(addUserToDeveloper)
                break;
                case 'manager':
                p = p.then(addUserToManager)
                default:
                break;
            }

            p.then(
                (data) => {
                    res.json({
                        success: true
                    })
                }
            ).catch(
                (err) => {
                    res.json({
                        success: false,
                        message: 'error'
                    })
                }
            )

        });
        function deleteUserFromDeveloper(data) {
            return new Promise((resolve, reject) => {
                developerService.delete(data.id)
                .then(
                    (datas) => {
                        resolve(data)
                    }
                )
                .catch(
                    (err) => {
                        reject(null)
                    }
                )
            })
        }
        function deleteUserFromManager(data) {
            return new Promise((resolve, reject) => {
                managerService.delete(data.id)
                .then(
                    (datas) => {
                        resolve(data)
                    }
                )
                .catch(
                    (err) => {
                        reject(null)
                    }
                )
            })
        }
        function addUserToDeveloper(data) {
            return new Promise((resolve, reject) => {
                developerService.add(data)
                .then(
                    (datas) => {
                        resolve(data)
                    }
                )
                .catch(
                    (err) => {
                        reject(null)
                    }
                )
            })
        }
        function addUserToManager(data) {
            return new Promise((resolve, reject) => {
                managerService.add(data)
                .then(
                    (datas) => {
                        resolve(data)
                    }
                )
                .catch(
                    (err) => {
                        reject(null)
                    }
                )
            })
        }
    // admin
    route.delete('/user/:userType/:userId', (req, res) => {
        switch (req.params.userType) {
            case "admin":
                {
                    adminService.delete(req.params.userId)
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
                }
                break;
            case "manager":
                {
                    managerService.delete(req.params.userId)
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
                }
                break;
            case "developer":
                {
                    developerService.delete(req.params.userId)
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
                }
                break;
            default:
                break;
        }
    })
    // admin
    route.get('/code/:userType', (req, res) => {
        var newCode = {
            userType: req.params.userType,
            code: randomString(24)
        }
        codeService.add(newCode)
            .then(
                (data) => {
                    res.json({
                        success: true,
                        code: newCode
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

    function randomString(len) {
        len = len || 32
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
        var maxPos = $chars.length
        var pwd = ''
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
        }
        return pwd
    }

    return route;
};

module.exports = routes();