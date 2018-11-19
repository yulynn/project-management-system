const db = require('../datastorage.js')
const crypto = require("crypto")
var dynamodb = db.getDynamodb()
var docClient = db.getDocClient()


var management = {
    add: (newDeveloper) => {
        return new Promise((resolve, reject) => {
            var developer_params = {
                TableName: "developer",
                Item: {
                    "id": randomString(32),
                    "skills": newDeveloper.skills,
                    "realname": newDeveloper.realname,
                    "email": newDeveloper.email,
                    "password": crypto.createHash("md5").update(newDeveloper.password).digest("hex"),
                    "projects_joined": []
                }
            }
            docClient.put(developer_params, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },
    // manager
    addProjectsJoined: (projectid, developerid) => {
        return new Promise((resolve, reject) => {
            if (typeof projectid === 'object') projectid = projectid.S
            if (typeof developerid === 'object') developerid = developerid.S
            management.get(developerid)
                .then(
                    (data) => {
                        console.log(data)
                        var projects_joined = data.projects_joined
                        projects_joined.push(projectid)
                        console.log(projects_joined)
                        projects_joined = projects_joined.unique()
                        data.projects_joined = projects_joined
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
    deleteProjectsJoined: (projectid, developerid) => {
        return new Promise((resolve, reject) => {
            if (typeof projectid === 'object') projectid = projectid.S
            if (typeof developerid === 'object') developerid = developerid.S
            management.get(developerid)
                .then(
                    (data) => {
                        var projects_joined = data.projects_joined
                        var index = projects_joined.indexOf(projectid)
                        if (index > -1) {
                            projects_joined.splice(index, 1)
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
    delete: (id) => {
        return new Promise((resolve, reject) => {
            if (typeof id === 'object') {
                id = id.S
            }
            var params = {
                TableName: "developer",
                Key: {
                    id
                }
            }
            docClient.delete(params, (err, data) => {
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
            if (typeof id === 'object') {
                id = id.S
            }
            var params = {
                TableName: "developer",
                Key: {
                    id
                }
            }
            docClient.get(params, (err, data) => {
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
            if(ids.length == 0) {
                resolve([])
            }
            var params = {
                TableName: 'developer',
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
    getByEmail: (email) => {
        return new Promise((resolve, reject) => {
            if (typeof email === 'object') {
                email = email.S
            }
            var params = {
                TableName: "developer",
                IndexName: "email-index",
                KeyConditionExpression: "email = :email",
                ExpressionAttributeValues: {
                    ":email": {
                        "S": email
                    }
                }
            }
            dynamodb.query(params, function (err, data) {
                if (err) console.log(err, err.stack)
                else {
                    if (data.ScanedCount <= 0) {
                        reject(null)
                    } else {
                        resolve(data.Items[0])
                    }
                }
            })
        })
    },
    getByName: (realname) => {
        return new Promise((resolve, reject) => {
            // var params = {
            //     TableName: "developer",
            //     IndexName: "name-index",
            //     KeyConditionExpression: "name = :nam",
            //     ExpressionAttributeValues: {
            //         ":nam": {"S": name}
            //     }
            // }
            var params = {
                TableName: 'developer',
                FilterExpression: 'realname = :realname',
                ExpressionAttributeValues: {
                    ':realname': {
                        'S': realname
                    }
                }
            };
            dynamodb.scan(params, function (err, data) {
                if (err) console.log(err, err.stack)
                else {
                    console.log(data)
                    resolve(data)
                }
            })
        })
    },
    update: (newDeveloper) => {
        return new Promise((resolve, reject) => {
            var params = {
                TableName: "developer",
                Item: {
                    "id": newDeveloper.id,
                    "realname": newDeveloper.realname,
                    "skills": newDeveloper.skills,
                    "email": newDeveloper.email,
                    "password": newDeveloper.password,
                    "projects_joined": newDeveloper.projects_joined
                }
            }
            docClient.put(params, (err, data) => {
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
                TableName: "developer"
            }
            dynamodb.scan(params, function (err, data) {
                if (err) reject(err)
                else {
                    resolve(data.Items)
                }
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