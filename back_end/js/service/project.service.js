const db = require('../datastorage.js')
var dynamodb = db.getDynamodb()
var docClient = db.getDocClient()


var management = {
    add: (newProject) => {
        return new Promise((resolve, reject) => {
            var project_params = {
                TableName: "project",
                Item: {
                    "id": randomString(32),
                    "realname": newProject.realname,
                    "state": newProject.state,
                    "intro": newProject.intro,
                    "manager": newProject.manager,
                    "developers": [],
                    "applies": []
                }
            }
            docClient.put(project_params, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },
    addApply: (projectid, developerid) => {
        return new Promise((resolve, reject) => {
            if (typeof projectid === 'object') projectid = projectid.S
            if (typeof developerid === 'object') developerid = developerid.S
            management.get(projectid)
                .then(
                    (data) => {
                        var applies = data.applies
                        applies.push(developerid)
                        applies = applies.unique('S')
                        management.update(data)
                            .then(
                                (data) => {
                                    resolve(data)
                                }
                            )
                            .catch(
                                (err) => {
                                    console.log(err)
                                    reject(err)
                                }
                            )
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        reject(err)
                    }
                )
        })
    },
    addDeveloper: (projectid, developerid) => {
        return new Promise((resolve, reject) => {
            if (typeof projectid === 'object') projectid = projectid.S
            if (typeof developerid === 'object') developerid = developerid.S
            management.get(projectid)
                .then(
                    (data) => {
                        console.log(data)
                        var developers = data.developers
                        developers.push(developerid)
                        developers = developers.unique('S')
                        console.log(developerid)
                        data.developers = developers
                        management.update(data)
                            .then(
                                (data) => {
                                    resolve(data)
                                }
                            )
                            .catch(
                                (err) => {
                                    console.log(err)
                                    reject(err)
                                }
                            )
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        reject(err)
                    }
                )
        })
    },
    deleteApply: (projectid, developerid) => {
        return new Promise((resolve, reject) => {
            if (typeof projectid === 'object') projectid = projectid.S
            if (typeof developerid === 'object') developerid = developerid.S
            management.get(projectid)
                .then(
                    (data) => {
                        var applies = data.applies
                        var index = -1
                        console.log("applies")
                        console.log(applies)
                        applies.forEach((apply, i) => {
                            let applyid = apply
                            if(typeof applyid == 'object') {
                                applyid = applyid.S
                            }
                            if (applyid === developerid) {
                                index = i
                            }
                        })
                        if (index > -1) {
                            applies.splice(index, 1)
                        }
                        management.update(data)
                            .then(
                                (data) => {
                                    resolve(data)
                                }
                            )
                            .catch(
                                (err) => {
                                    console.log(err)
                                    reject(err)
                                }
                            )
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        reject(err)
                    }
                )
        })
    },
    deleteDeveloper: (projectid, developerid) => {
        return new Promise((resolve, reject) => {
            if (typeof projectid === 'object') projectid = projectid.S
            if (typeof developerid === 'object') developerid = developerid.S
            management.get(projectid)
                .then(
                    (data) => {
                        var developers = data.developers
                        var index = developers.indexOf(developerid)
                        if (index > -1) {
                            developers.splice(index, 1)
                        }
                        management.update(data)
                            .then(
                                (data) => {
                                    resolve(data)
                                }
                            )
                            .catch(
                                (err) => {
                                    console.log(err)
                                    reject(err)
                                }
                            )
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        reject(err)
                    }
                )
        })
    },
    clearApply: (projectid) => {
        return new Promise((resolve, reject) => {
            if (typeof projectid === 'object') projectid = projectid.S
            management.get(projectid)
                .then(
                    (data) => {
                        data.applies = []
                        management.update(data)
                            .then(
                                (data) => {
                                    resolve(data)
                                }
                            )
                            .catch(
                                (err) => {
                                    console.log(err)
                                    reject(err)
                                }
                            )
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        reject(err)
                    }
                )
        })
    },
    clearDeveloper: (projectid) => {
        return new Promise((resolve, reject) => {
            if (typeof projectid === 'object') projectid = projectid.S
            management.get(projectid)
                .then(
                    (data) => {
                        data.developers = []
                        management.update(data)
                            .then(
                                (data) => {
                                    resolve(data)
                                }
                            )
                            .catch(
                                (err) => {
                                    console.log(err)
                                    reject(err)
                                }
                            )
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        reject(err)
                    }
                )
        })
    },
    delete: (id) => {
        return new Promise((resolve, reject) => {
            if (typeof id === 'object') id = id.S
            var project_params = {
                TableName: "project",
                Key: {
                    id
                }
            }
            docClient.delete(project_params, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },
    get: (id) => {
        return new Promise((resolve, reject) => {
            if (typeof id === 'object') id = id.S
            var project_params = {
                TableName: "project",
                Key: {
                    id
                }
            }
            docClient.get(project_params, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(null)
                } else {
                    resolve(data.Item)
                }
            })
        })
    },
    getByIds: (ids) => {
        return new Promise((resolve, reject) => {
            if (typeof id === 'object') id = id.S
            var params = {
                TableName: 'project',
                ScanFilter: {
                    "id": {
                        ComparisonOperator: "IN",
                        AttributeValueList: ids
                    }
                }
            };
            docClient.scan(params, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(null)
                } else {
                    resolve(data.Items)
                }
            })
        })
    },
    getByName: (realname) => {
        return new Promise((resolve, reject) => {
            if (typeof realname === 'object') realname = realname.S
            var params = {
                TableName: "project",
                IndexName: "realname-index",
                KeyConditionExpression: "realname = :realname",
                ExpressionAttributeValues: {
                    ":realname": {
                        "S": realname
                    }
                }
            }
            dynamodb.query(params, function (err, data) {
                if (err) console.log(err, err.stack)
                else {
                    console.log(data)
                    if (data.ScanedCount <= 0) {
                        reject(null)
                    } else {
                        resolve(data.Items[0])
                    }
                }
            })
        })
    },
    update: (newProject) => {
        return new Promise((resolve, reject) => {
            var project_params = {
                TableName: "project",
                Item: {
                    "id": newProject.id,
                    "realname": newProject.realname,
                    "state": newProject.state,
                    "intro": newProject.intro,
                    "manager": newProject.manager,
                    "developers": newProject.developers,
                    "applies": newProject.applies
                }
            }
            docClient.put(project_params, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },
    updateState: (projectid, state) => {
        return new Promise((resolve, reject) => {
            var project_params = {
                TableName: 'project',
                Key: {
                    id: projectid
                },
                UpdateExpression: 'set #a = :state',
                ExpressionAttributeNames: {
                    '#a': 'state'
                },
                ExpressionAttributeValues: {
                    ':state': state
                }
            };
            docClient.update(project_params, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },
    getAll: () => {
        return new Promise((resolve, reject) => {
            var params = {
                TableName: "project"
            }
            dynamodb.scan(params, function (err, data) {
                if (err) reject(err)
                else {
                    resolve(data.Items)
                }
            })
        })
    },
    getByManager: (managerid) => {
        return new Promise((resolve, reject) => {
            var params = {
                TableName: 'project',
                FilterExpression: 'manager = :managerid',
                ExpressionAttributeValues: {
                    ':managerid': {
                        'S': managerid
                    }
                }
            };
            dynamodb.scan(params, function (err, data) {
                if (err) reject(err)
                else resolve(data.Items)
            })
        })
    }
}

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

Array.prototype.unique = function (key) {
    var arr = this;
    var n = [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        if (key === undefined) {
            if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
        } else {
            inner: {
                var has = false;
                for (var j = 0; j < n.length; j++) {
                    if (arr[i][key] == n[j][key]) {
                        has = true;
                        break inner;
                    }
                }
            }
            if (!has) {
                n.push(arr[i]);
            }
        }
    }
    return n;
}

module.exports = management