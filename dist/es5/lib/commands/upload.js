"use strict";

var fs = require("fs");
var imageJson = require("./../store/index").imageJson;

/**
 *
 * @param {string} metaData.title
 * @param {string} metaData.size
 * @param {string} metaData.s3Path
 * @param {string} metaData.s3Bucket
 * @param {File} imageFile
 */

module.exports = function (awsS3Client, imageFile, metaData, callBack) {
	// EPOCH is suffixed to slug to avoid duplication
	var imageName = metaData.title + "__" + metaData.size + "__" + Date.now() + ".png";
	var imageKey = metaData.s3Path + "/" + imageName;

	fs.readFile(imageFile.path, function (err, imageData) {
		if (err) callBack(err);
		var uploadImageParams = {
			Bucket: metaData.s3Bucket,
			Key: imageKey,
			ContentType: "image/png",
			Body: imageData,
			ACL: "public-read"
		};

		awsS3Client.upload(uploadImageParams, function (err) {
			fs.unlink(imageFile.path);
			if (err) callBack(err);else {
				var data = {
					slug: imageName
				};
				imageJson.push(data);
				callBack(null, data);
			}
		});
	});
};