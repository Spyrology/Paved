var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var fs = require('fs');
var path = require('path');
var companies = require('../models/opportunities');
var api_key = 'key-394bb0ed0f344eee80cf5827f753b0ff';
var domain = 'sandbox4806cb76f7084b8bbd9acc856f53724a.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

exports.upload = function(req, cb) {
  var userEmail = req.user.localAuth.email;
  var filename = req.files.file.originalname;
  var filePath = req.files.file.path;
  var params = {
    Bucket: 'paved-test',
    Key: filename,
    Body: fs.createReadStream(filePath),
    Metadata: {
      user: userEmail
    }
  };
  s3.upload(params)
    .on('httpUploadProgress', function(evt) {
      console.log(evt);
    })
    .send(function(err, data) {
      fs.unlink(filePath);
      cb(err, data);
    });

  //get signed URL to include in email to company   
/*  var url = s3.getSignedUrl('putObject', params);
  console.log('The URL is', url);*/

  //mailgun data object
  var mgData = {
    from: 'Excited User <eval@paved.io>',
    to: 'spyrology@gmail.com',
    subject: 'You have an evaluation from Paved',
    text: 'Please review and provide prompt feedback. Thanks',
    attachment: filePath
  };

  //mailgun method
  console.log("time 4");
  mailgun.messages().send(mgData, function (error, body) {
    console.log(body);
  });
};

exports.downloadEvaluation = function (req, res) {
  companies.getOpportunity(req, function(opportunity) {
    var filename = opportunity.file;
    var params = {Bucket: 'paved-test', Key: filename};
    var url = s3.getSignedUrl('getObject', params);
    console.log('The URL is', url);
    res.redirect(url);
  });
};