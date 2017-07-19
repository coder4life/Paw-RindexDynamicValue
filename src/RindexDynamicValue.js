"use strict";

(function() {

    var entities = require('html-entities').AllHtmlEntities,
        get = require('lodash.get'),
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
        var regexArrayFormatKeyCapture = new RegExp("[A-Za-z0-9]*\\[([0-9]+|[\\*]|\\@[flm]|\\@p\\:)\\]");
        var regexArrayFormatKeyRemove = new RegExp("\\[.*?\\]");
        var pathItems = keypath.split('.');
        var pathList = [];
        var result;

        console.log('pathItems: ' + pathItems);
        console.log('pathList: ' + pathList);

        for(var i = 0; i < pathItems.length; i++) {

            var regexArrayFormatKeyCaptureTest = regexArrayFormatKeyCapture.test(pathItems[i]);

            // pathItem returns a formatted structure, do some operation on it based on the function
            if (regexArrayFormatKeyCaptureTest) {
                var regexArrayFormatKeyCaptureResult = regexArrayFormatKeyCapture.exec(pathItems[i]);
                var length = getLength(source, pathList, pathItems[i].replace(regexArrayFormatKeyRemove, ''));

                if (regexArrayFormatKeyCaptureResult[1] === '*') {
                    var rIndex = random(length - 1);
                    pathList.push(
                        pathItems[i].replace("*", rIndex)
                    );
                } else if(regexArrayFormatKeyCaptureResult[1] === '@f') {
                    pathList.push(
                        pathItems[i].replace("@f", 0)
                    );
                }
                else if(regexArrayFormatKeyCaptureResult[1] === '@l') {
                    pathList.push(
                        pathItems[i].replace("@l", length - 1)
                    );
                }
                else if(regexArrayFormatKeyCaptureResult[1] === '@m') {
                    pathList.push(
                        pathItems[i].replace("@m", Math.round((length - 1) * 0.5))
                    );
                }
                else if(regexArrayFormatKeyCaptureResult[1] === '@p:') {
                    var regexPositionValue = new RegExp("\\@p\\:(\d{1,2}(?!\d)|100)");
                    var regexPositionValueTest = regexPositionValue.test(pathItems[regexArrayFormatKeyCaptureResult[1]]);
                    if(regexPositionValueTest) {
                        var regexPositionValueResult = regexPositionValue.exec(regexArrayFormatKeyCaptureResult[1]);
                        pathList.push(
                            pathItems[i].replace(
                                regexPositionValue, Math.round((length - 1) * (regexPositionValueResult[1] / 100))
                            )
                        );
                    }
                }
                else if (Number.isInteger(parseInt(regexArrayFormatKeyCaptureResult[1]))) {
                    pathList.push(pathItems[i]);
                } else {
                    throw "Error with your array syntax key[value], please check...";
                }

            } else { // do not do anything, not a special format, just push current key item
                pathList.push(pathItems[i]);
            }

        }
        result = pathList.join('.');
        return result;
    };

    var getLength = function(source, pathList, pathItem) {

        var path = pathList.join('.');

        var lastRequest = getLastRequest(source);
        var result = null;

        if(path) { // key[x].path.to[x].pathItem
            result = size(get(lastRequest, path + '.' + pathItem));
        } else { // key[x]
            console.log("isArray: " + Array.isArray(lastRequest));
            if(Array.isArray(lastRequest)) {
                result = size(lastRequest);
            } else {
                result = size(get(lastRequest, pathItem))
            }
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