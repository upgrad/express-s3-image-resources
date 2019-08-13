const Fuse = require("fuse.js");
let store = require("./../store");

module.exports = (awsS3Client, metaData, query, cache, callback) => {
	const search = () => {
		const options = {
			shouldSort: true,
			threshold: 0.6,
			location: 0,
			distance: 100,
			maxPatternLength: 32,
			minMatchCharLength: 3,
			keys: [
				{
					name: "slug",
					weight: 1
				}
			]
		};

		let result = (store.imageJson || []).filter(data => data.slug);
		if(query != '__getDefaultImgs__'){
			let fuse = new Fuse(store.imageJson, options);
			result = fuse.search(query);
		}
		callback(undefined, result);
	};

	const serveCacheData = () => {
		if (cache && Number(cache) && store.lastSyncTime) {
			if (Date.now() - store.lastSyncTime <= Number(cache)) return true;
		}
	};

	if (serveCacheData() && (store.imageJson && store.imageJson.length)) search();
	else {
		fetchImageFromS3(awsS3Client, metaData, (err, data) => {
			if (err) callBack(err);
			store.imageJson = data;
			store.lastSyncTime = Date.now();
			search();
		});
	}
};

const fetchImageFromS3 = (awsS3Client, metaData, callback) => {
	let params = {
		Bucket: `${metaData.s3Bucket}`,
		Prefix: `${metaData.s3Path}/`
	};
	awsS3Client.listObjectsV2(params, function(err, s3Data) {
		if (err) callback(err && err.stack);
		else {
			const data = s3Data.Contents.map(item => {
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
