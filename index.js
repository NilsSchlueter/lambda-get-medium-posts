var request = require("request"); 
var AWS = require("aws-sdk");

exports.handler = function(event, context, callback) {
	callback = context.done;
	var data = event.bodyJson || {};
	var s3 = new AWS.S3();

	// Sets the username - replace username with your Medium Username
	var username = '<YOUR_USERNAME>'
	var url = "https://medium.com/@"+username+"/latest?format=json";

	// Make the request to Medium and return the Obj
	request({
	    url: url,
	    json: true
	}, function (error, response, body) {
	    if (!error && response.statusCode === 200) {
			var jsonBody = JSON.parse(body.replace('])}while(1);</x>', ''));
			
			// Set up your S3 Bucket access
			var params = {
				Bucket: '<YOUR_S3_BUCKET_NAME>',
				Key: 'medium_posts.json',
				Body: JSON.stringify(jsonBody)
			}
			
			// Put the file in the bucket
			s3.putObject(params, function(err, data) {
				if (err) {
					console.log(err, err.stack);
				}
				else {
					console.log(data);
				}
			});
			
	        callback(null, jsonBody);
	    }
	});
};
