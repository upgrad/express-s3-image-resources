"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var AWS = require('aws-sdk');
var awsS3Client = void 0;

var isConfig = function isConfig(configOrInstance) {
	if ((typeof configOrInstance === "undefined" ? "undefined" : _typeof(configOrInstance)) == "object" && configOrInstance.accessKeyId && configOrInstance.secretAccessKey && configOrInstance.region) {
		return true;
	}
	return;
};

module.exports = function (configOrInstance) {
	if (!configOrInstance) return awsS3Client;
	if (isConfig(configOrInstance)) {
		AWS.config.update(configOrInstance);
		awsS3Client = new AWS.S3();
	} else {
		awsS3Client = configOrInstance;
	}
	return awsS3Client;
};