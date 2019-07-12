"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
		var config = configOrInstance;
		awsS3Client = new _awsSdk2.default.S3(config);
	} else {
		awsS3Client = configOrInstance;
	}
	return awsS3Client;
};