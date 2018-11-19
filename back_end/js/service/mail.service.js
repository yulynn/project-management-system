var nodemailer = require('nodemailer');
var config = require('../../config');
var transporter = nodemailer.createTransport(config.transporter);

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var defaultOptions = config.mailOptions;

function sendMail(newOptions) {    
    return new Promise((resolve, reject) => {
        // send mail with defined transport object
        let options = extend(defaultOptions, newOptions)
        transporter.sendMail(options, function(error, info) {
            if(error){
                reject(error);
            } else {
                resolve(info.response);
            }
        });
    })
}

var extend = function(destination,source) {
    for(var property in source) {
        destination[property] = source[property]
    }
    return destination
}

module.exports = {
    sendMail: sendMail
}

/*
var extend = (function() {
    var isObjFunc = function(name) {
        var toString = Object.prototype.toString
        return function() {
            return toString.call(arguments[0]) === '[object ' + name + ']'
        } 
    }
    var   isObject = isObjFunc('Object'),
        isArray = isObjFunc('Array'),
        isBoolean = isObjFunc('Boolean')
    return function extend() {
        var index = 0,isDeep = false,obj,copy,destination,source,i
        if(isBoolean(arguments[0])) {
            index = 1
            isDeep = arguments[0]
        }
        for(i = arguments.length - 1;i>index;i--) {
            destination = arguments[i - 1]
            source = arguments[i]
            if(isObject(source) || isArray(source)) {
                console.log(source)
                for(var property in source) {
                    obj = source[property]
                    if(isDeep && ( isObject(obj) || isArray(obj) ) ) {
                        copy = isObject(obj) ? {} : []
                        var extended = extend(isDeep,copy,obj)
                        destination[property] = extended 
                    }else {
                        destination[property] = source[property]
                    }
                }
            } else {
                destination = source
            }
        }
        return destination
    }
})()
*/