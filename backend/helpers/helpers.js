var _ = require('lodash');
var moment = require('moment');
var mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

var helper = {
    validateEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    setSearchParams: function (conditions, params) {

      

        if (!_.isEmpty(params.keyword)) {
            let queryClause = params.keyword;
            // console.log("queryClause",queryClause);
            // console.log("queryClause1",queryClause.split(" "));
            conditions = {
                $or: [
                    { username: { $regex: '.*' + queryClause + '.*', $options: 'i' } },
                    { first_name: { $regex: '.*' + queryClause.split(" ")[0] + '.*', $options: 'i' } },
                    { last_name: { $regex: '.*' + queryClause.split(" ")[0] + '.*', $options: 'i' } },
                    { last_name: { $regex: '.*' + queryClause.split(" ")[1] + '.*', $options: 'i' } },                
                ]
            };
        }              

        if (!_.isEmpty(params.status) && params.status !='') {
            let status = params.status;
            conditions.status = status
        } else {
            conditions.status = { $ne: 'deleted' }
        }        
        return conditions;
    },
    getExtension: function (fileName = "") {
        var re = /(?:\.([^.]+))?$/;
        return re.exec(fileName)[1];
    },
    random_number: function (length) {
        var possiblenumber = "0123456789";
        var number = "";
        for (var i = 0; i < length; i++) {
            number += possiblenumber.charAt(
                Math.floor(Math.random() * possiblenumber.length)
            );
        }
        return number;
    },
    random_string: function (length) {
        var possiblenumber =
            "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        var number = "";
        for (var i = 0; i < length; i++) {
            number += possiblenumber.charAt(
                Math.floor(Math.random() * possiblenumber.length)
            );
        }
        return number;
    },
 

}
module.exports = helper;
