const db = require('../datastorage.js')
const crypto = require("crypto")
var dynamodb = db.getDynamodb()
var docClient = db.getDocClient()

var adminManagement = {
    add: (newAdmin) => {
        return new Promise((resolve, reject) => {
            var admin_params = {
                TableName: "admin",
                Item: {
                    "id": randomString(32),
                    "realname": newAdmin.realname,
                    "email": newAdmin.email,
                    "password": crypto.createHash("md5").update(newAdmin.password).digest("hex")
                }
            }
            docClient.put(admin_params, (err, data) => {
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
            var admin_params = {
                TableName: "admin",
                Key: { id }
            }
            docClient.delete(admin_params, (err, data) => {
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
            console.log('admin service') 
            console.log("id " + id)
            if (typeof id === 'object') {
                id = id.S
            }
            var admin_params = {
                TableName: "admin",
                Key: { id }
            }
            docClient.get(admin_params, (err, data) => {
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
            var admin_params = {
                TableName: "admin",
                IndexName: "email-index",
                KeyConditionExpression: "email = :email",
                ExpressionAttributeValues: {
                    ":email": {"S": email}
                }
            }
            dynamodb.query(admin_params, function (err, data) {
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
    update: (newAdmin) => {
        return new Promise((resolve, reject) => {
            var admin_params = {
                TableName: "admin",
                Item: {
                    "id": newAdmin.id,
                    "realname": newAdmin.realname,
                    "password": newAdmin.password,
                    "email": newAdmin.email
                }
            }
            docClient.put(admin_params, (err, data) => {
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
                TableName: "admin"
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

module.exports = adminManagement