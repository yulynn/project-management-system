const AWS = require("aws-sdk");

AWS.config.region = "eu-west-2";

var dynamodb = null;
var docClient = null;

var database = {
    getDynamodb: () => {
        if(dynamodb == null) {
            dynamodb = new AWS.DynamoDB();
        }
        return dynamodb;
    },
    getDocClient: () => {
        if(docClient == null) {
            docClient = new AWS.DynamoDB.DocumentClient();
        }
        return docClient;
    },
    initialize: () => {
        dynamodb = new AWS.DynamoDB();
        docClient = new AWS.DynamoDB.DocumentClient();
    }
};

module.exports = database;