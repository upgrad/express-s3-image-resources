
# S3 Gallery Express Middleware

 A middleware which adds two APIs to interact with AWS S3 

- POST /upload
- POST /search/:query


## How to use

```bash
npm install --save upgrad/express-s3-image-resources
```

```js
const  app = express();
const  gallery = require("express-s3-image-resources");

const  AWS_CREDS = {
	accessKeyId: "XXXXXXXXXXXXXXXXXXXX",
	secretAccessKey: "XXXXXXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXXXXX",
	region: "XX-XXXX-X"
};

app.use("/gallery", gallery(AWS_CREDS));
```


## Options

####  ```gallery(awsConfigOrInstance, cacheTime)```


- **awsConfigOrInstance** - This can be either a instance of class AWS or a config mentioned in the above example.

- **cacheTime(ms)** - This is the time which needs to be sent to enable caching of s3 bucket data.
