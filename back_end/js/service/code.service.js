
const db = require('../datastorage.js')
var dynamodb = db.getDynamodb()
var docClient = db.getDocClient()


var management = {
    add: (newCode) => {
        return new Promise((resolve, reject) => {
            var code_params = {
                TableName: "code",
                Item: {
                    "code": newCode.code,
                    "codeType": newCode.codeType,
                    "state": 'unused'
                }
            }
            docClient.put(code_params, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },
    delete: (code) => {
        return new Promise((resolve, reject) => {
            if (typeof code === 'object') code = code.S
            var code_params = {
                TableName: "code",
                Key: { code }
            }
            docClient.delete(code_params, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },    
    get: (code) => {
        return new Promise((resolve, reject) => {
            if (typeof code === 'object') code = code.S
            var code_params = {
                TableName: "code",
                Key: { code }
            }
            docClient.get(code_params, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(null)
                } else {
                    resolve(data.Item)
                }
            })
        })
    },
    update: (newCode) => {
        return new Promise((resolve, reject) => {
            var code_params = {
                TableName: "code",
                Item: {
                    "code": newCode.code,
                    "codeType": newCode.codeType,
                    "state": newCode.state
                }
            }
            docClient.put(code_params, (err, data) => {
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
                TableName: "code"
            }
            dynamodb.scan(params, function (err, data) {
                if (err) reject(err)
                else {
                    resolve(data)
                }
            })
        })
    }
}

module.exports = management