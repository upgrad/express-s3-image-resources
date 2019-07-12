const express = require("express");
const formidable = require("formidable");
const commands = require("./commands");
const s3 = require("./config/s3");

const upload = awsS3Client =>
	function(req, res, next) {
		const form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			commands.upload(awsS3Client, files.file, fields, (err, data) => {
				if (err) return next(err);
				res.send(data);
			});
		});
	};

const search = (awsS3Client, cache) =>
	function(req, res, next) {
		let query = req.params.query;
		if (req.query.disableCache == "true") cache = undefined;
		commands.search(awsS3Client, req.body, query, cache, (err, data) => {
			if (err) return next(err);
			res.send(data);
		});
	};

module.exports = (aws, cache) => {
	const awsS3Client = s3(aws);
	const router = express.Router();
	router.post("/upload", upload(awsS3Client));
	router.post("/search/:query", search(awsS3Client, cache));
	return router;
};
