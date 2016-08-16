"use strict";

(function() {

    var entities = require('html-entities').AllHtmlEntities,
        get = require('lodash.get'),
        isInteger = require('lodash.isinteger'),
        random = require('lodash.random'),
        size = require('lodash.size');

    var getLastRequest = function(source) {
        if (request) {
            return request;
        } else {
            var exchange = source.getLastExchange();
            request = JSON.parse(exchange.responseBody);
            return request;
        }
    };

    var getPath = function(source, keypath) {
        var regexValue = new RegExp("[A-Za-z0-9]*\\[([0-9]+|[\\*]+|[\\@f]+|[\\@l]+|[\\@m]+)\\]");
        var regexReplace = new RegExp("\\*|\\@f|\\@l|\\@m");
        var pathItems = keypath.split('.');
        var pathList = [];
        var result;

        for(var i in pathItems) {
            if (pathItems.hasOwnProperty(i)) {
                var regexTest = regexValue.test(pathItems[i]);
                if (regexTest) {
                    var regexResult = regexValue.exec(pathItems[i]);
                    var length = getLength(source, pathList, pathItems[i]);
                    if (regexResult[1] === '*') {
                        var rIndex = random(length - 1);
                        pathList.push(pathItems[i].replace(regexReplace, rIndex));
                    } else if(regexResult[1] === '@f') {
                        pathList.push(pathItems[i].replace(regexReplace, 0));
                    }
                    else if(regexResult[1] === '@l') {
                        pathList.push(pathItems[i].replace(regexReplace, length - 1));
                    }
                    else if(regexResult[1] === '@m') {
                        pathList.push(pathItems[i].replace(regexReplace, Math.round((length - 1)/2)));
                    }
                    else if (isInteger(parseInt(regexResult[1]))) {
                        pathList.push(pathItems[i]);
                    } else {
                        throw "Error with your array syntax key[value], please check...";
                    }
                } else {
                    pathList.push(pathItems[i]);
                }
            }
        }
        result = pathList.join('.');
        return result;
    };

    var getLength = function(source, pathList, pathItem) {
        var regex = new RegExp("([A-Za-z0-9]*)\\[[0-9]+|[\\*]+|[\\@f]+|[\\@l]+|[\\@m]+\\]");
        var path = pathList.join('.');
        var regexResult = regex.exec(pathItem);
        var lastRequest = getLastRequest(source);
        var result;

        if(path && regexResult[1]) { // [x].path.to.pathItem
            result = size(get(lastRequest, path + '.' + regexResult[1]));
        } else if(path) { // [x].pathItem
            result = size(get(lastRequest, pathItem));
        } else { // [x]
            result = size(lastRequest);
        }
        if(!result) {
            throw "Error key was not found"
        }
        return result;
    };

// Extensions are implemented as JavaScript classes
    var RindexDynamicValue = function() {

        // implement the evaluate() method to generate the dynamic value
        this.evaluate = function(context) {
            // assign var
            var keypath = this.keypath;
            var source = this.source;
            // init var
            var path;

            if (keypath === undefined || keypath === null) {
                throw "Please insert a valid Keypath...";
            }

            path = getPath(source, keypath);
            var lastRequest = getLastRequest(source);
            return get(lastRequest, path);
        };

        // Text function: takes no params, should return the string to display as
        // the Dynamic Value text
        this.text = function() {
            if(typeof this.keypath !== undefined) {
                return this.source.name + ' ' + entities.decode('&#9658;') + ' ' + this.keypath;
            } else {
                return null;
            }
        };
    };

    var request = null;

// set the Extension Identifier (must be same as the directory name)
    RindexDynamicValue.identifier = "com.coder4life.PawExtensions.RindexDynamicValue";

// give a display name to your Dynamic Value
    RindexDynamicValue.title = "Rindex";

// link to the Dynamic Value documentation
    RindexDynamicValue.help = "https://github.com/coder4life/Paw-RindexDynamicValue";

// inputs
    RindexDynamicValue.inputs = [
        InputField("source", "Source Request", "Request"),
        InputField("keypath", "KeyPath", "String")
    ];

// call to register function is required
    registerDynamicValueClass(RindexDynamicValue);

}).call(this);