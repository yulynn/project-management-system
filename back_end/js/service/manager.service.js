
const db = require('../datastorage.js')
const crypto = require("crypto")
var dynamodb = db.getDynamodb()
var docClient = db.getDocClient()


var management = {
    add: (newManager) => {
        return new Promise((resolve, reject) => {
            var manager_params = {
                TableName: "manager",
                Item: {
                    "id": randomString(32),
                    "realname": newManager.realname,
                    "email": newManager.email,
                    "password": crypto.createHash("md5").update(newManager.password).digest("hex"),
                    "projects": []
                }
            }
            docClient.put(manager_params, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },
    delete: (id) => {
        return new Promise((resolve, reject) => {
            if (typeof id === 'object') {
                id = id.S
            }
            var manager_params = {
                TableName: "manager",
                Key: { id }
            }
            docClient.delete(manager_params, (err, data) => {
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
            var manager_params = {
                TableName: "manager",
                Key: { id }
            }
            docClient.get(manager_params, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(null)
                } else {
                    resolve(data.Item)
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
                TableName: "manager",
                IndexName: "email-index",
                KeyConditionExpression: "email = :email",
                ExpressionAttributeValues: {
                    ":email": {"S": email}
                }
            }
            dynamodb.query(params, function (err, data) {
                if(err) console.log(err, err.stack)
                else {
                    if(data.ScanedCount <= 0) {
                        reject(null)
                    } else {
                        resolve(data.Items[0])
                    }
                }
            })
        })
    },
    update: (newManager) => {
        return new Promise((resolve, reject) => {
            var params = {
                TableName: "manager",
                Item: {
                    "id": newManager.id,
                    "realname": newManager.realname,
                    "email": newManager.email,
                    "password": newManager.password,
                    "projects": newManager.projects
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
                TableName: "manager"
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

module.exports = management