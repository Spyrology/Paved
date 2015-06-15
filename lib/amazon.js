var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var fs = require('fs');

exports.upload = function(req, cb) {
	console.log(req.files);
  var filename = req.files.file.originalname;
  var filePath = req.files.file.path;
  console.log(filename);
  var params = {
    Bucket: 'paved-test',
    Key: filename,
    Body: fs.createReadStream(filePath)
  };
  s3.upload(params)
    .on('httpUploadProgress', function(evt) {
      console.log(evt);
    })
    .send(function(err, data) {
      console.log(err, data);
      fs.unlinkSync(filePath);
      cb(err, data);
    });
};
