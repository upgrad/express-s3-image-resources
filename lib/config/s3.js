import AWS from "aws-sdk";
let awsS3Client;

const isConfig = configOrInstance => {
	if (typeof configOrInstance == "object" && configOrInstance.accessKeyId && configOrInstance.secretAccessKey && configOrInstance.region) {
		return true;
	}
	return;
};

module.exports = configOrInstance => {
	if (!configOrInstance) return awsS3Client;
	if (isConfig(configOrInstance)) {
		const config = configOrInstance;
		awsS3Client = new AWS.S3(config);
	} else {
		awsS3Client = configOrInstance;
	}
	return awsS3Client;
};
