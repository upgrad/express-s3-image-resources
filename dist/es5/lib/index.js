"use strict";

var express = require("express");
var formidable = require("formidable");
var commands = require("./commands");
var s3 = require("./config/s3");

var upload = function upload(awsS3Client) {
	return function (req, res, next) {
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			commands.upload(awsS3Client, files.file, fields, function (err, data) {
				if (err) return next(err);
				res.send(data);
			});
		});
	};
};

var search = function search(awsS3Client, cache) {
	return function (req, res, next) {
		var query = req.params.query;
		if (req.query.disableCache == "true") cache = undefined;
		commands.search(awsS3Client, req.body, query, cache, function (err, data) {
			if (err) return next(err);
			res.send(data);
		});
	};
};

module.exports = function (aws, cache) {
	var awsS3Client = s3(aws);
	var router = express.Router();
	router.post("/upload", upload(awsS3Client));
	router.post("/search/:query", search(awsS3Client, cache));
	return router;
};