var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var fs = require('fs');

exports.upload = function(req, cb) {
	console.log(req.files);
  var filename = req.files.file.originalname;
  console.log(filename);
  var params = {
    Bucket: 'paved-test',
    Key: filename,
    Body: fs.createReadStream(req.files.file.path)
  };
  s3.upload(params)
    .on('httpUploadProgress', function(evt) {
      console.log(evt);
    })
    .send(function(err, data) {
      console.log(err, data);
      cb(err, data);
    });
};
