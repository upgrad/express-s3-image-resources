"use strict";

var Fuse = require("fuse.js");
var store = require("./../store");

module.exports = function (awsS3Client, metaData, query, cache, callback) {
	var search = function search() {
		var options = {
			shouldSort: true,
			threshold: 0.6,
			location: 0,
			distance: 100,
			maxPatternLength: 32,
			minMatchCharLength: 3,
			keys: [{
				name: "slug",
				weight: 1
			}]
		};

		var result = (store.imageJson || []).filter(function (data) {
			return data.slug;
		});
		if (query != '__getDefaultImgs__') {
			var fuse = new Fuse(store.imageJson, options);
			result = fuse.search(query);
		}
		callback(undefined, result);
	};

	var serveCacheData = function serveCacheData() {
		if (cache && Number(cache) && store.lastSyncTime) {
			if (Date.now() - store.lastSyncTime <= Number(cache)) return true;
		}
	};

	if (serveCacheData() && store.imageJson && store.imageJson.length) search();else {
		fetchImageFromS3(awsS3Client, metaData, function (err, data) {
			if (err) callBack(err);
			store.imageJson = data;
			store.lastSyncTime = Date.now();
			search();
		});
	}
};

var fetchImageFromS3 = function fetchImageFromS3(awsS3Client, metaData, callback) {
	var params = {
		Bucket: "" + metaData.s3Bucket,
		Prefix: metaData.s3Path + "/"
	};
	awsS3Client.listObjectsV2(params, function (err, s3Data) {
		if (err) callback(err && err.stack);else {
			var data = s3Data.Contents.map(function (item) {
				return {
					size: item.Size,
					slug: item.Key.replace(params.Prefix, ""),
					lastModified: item.LastModified
				};
			});
			callback(null, data);
		}
	});
};