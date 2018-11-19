const express = require('express');
const db = require('./js/datastorage.js');

var server = {
    connectToDB: () => {
        return new Promise((resolve, reject) => {
            db.initialize();
            resolve();
        });
    },
    getDynamodb: () => {
        return db.getDynamodb();
    },
    getDocClient: () => {
        return db.getDocClient();
    }
}
module.exports = server;
