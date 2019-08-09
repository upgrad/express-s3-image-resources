const fs = require("fs");
let imageJson = require("./../store/index").imageJson;

/**
 *
 * @param {string} metaData.title
 * @param {string} metaData.s3Path
 * @param {string} metaData.s3Bucket
 * @param {File} imageFile
 */

module.exports = (awsS3Client, imageFile, metaData, callBack) => {
	// EPOCH is suffixed to slug to avoid duplication
	const imageName = `${metaData.title}__${Date.now()}.png`;
	const imageKey = `${metaData.s3Path}/${imageName}`;

	fs.readFile(imageFile.path, function(err, imageData) {
		if (err) callBack(err);
		let uploadImageParams = {
			Bucket: metaData.s3Bucket,
			Key: imageKey,
			ContentType: "image/png",
			Body: imageData,
			ACL: "public-read"
		};

		awsS3Client.upload(uploadImageParams, err => {
			fs.unlink(imageFile.path);
			if (err) callBack(err);
			else {
				let data = {
					slug: imageName
				};
				imageJson.push(data);
				callBack(null, data);
			}
		});
	});
};
