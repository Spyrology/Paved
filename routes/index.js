//testing React branch
//var emails = require('../emails');
var fs = require('fs');
var express = require('express');
var passport = require('passport');
var companies = require('../models/opportunities');
var router = express.Router();
var user = require('../models/users');
var stripe = require('stripe')("sk_test_r6CoQNy1HzO4cfqEDqS6D4I8");
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var path = require('path');
var amazon = require('../lib/amazon');
var stripe = require('../lib/stripe');
var auth = require('../lib/authentication');

/* GET home page. */

router
	/*
	.get('/', function(req, res) {
  	res.render('landing-page.hbs', { layout: false });
	})
	.post('/', emails.create);
	*/
	.get('/', function (req, res) {
		res.render('index', { stylesheet: 'index' });
	})
	.get('/opportunities', function (req, res) {
		companies.find(req, function (err, opps) {
			if(err) return console.log(err);
			opps.forEach(function(company) {
				company.opportunities.forEach(function(opp, i, list) {
					list[i].companyId = company._id;
				});
			});
			res.render('opportunities', {stylesheet: 'opportunities', companies: opps});
		});
	})
	.get('/opportunities/:companyId/evaluation/:id', isLoggedIn, function (req, res) {

		//console.log(user);

		(function checkUserCharges() {
			user.checkPriorCharges(req, function(hasEval) {
				if (hasEval === true) {
					companies.show(req, res);
				}
				else {
					res.render('payment-form', { stylesheet: 'payment-form' });
				}
			});
		}());

	})
	.post('/opportunities/:companyId/evaluation/:id', function (req, res, next) {
		stripe.createCharge(req, res, next);
	})
	.get('/opportunities/:companyId/download/:id', isLoggedIn, function (req, res) {
		amazon.downloadEvaluation(req, res);
	})
	.post('/opportunities/upload', isLoggedIn, function (req, res) {
		res.redirect('/opportunities');
		amazon.upload(req, function (err, data) {
			if (err) return console.error(err);
			res.redirect('/opportunities');
		});
	})
	.get('/admin', isLoggedIn, function (req, res) {
		companies.find(req, function (err, opps) {
			if(err) return console.log(err);
			res.render('admin', { stylesheet: 'admin', companies: opps });
		});
	})
	.post('/admin', function (req, res) {
		console.log(req.files);
		if(req.body.method === 'post') companies.create(req, res);
		else companies.update(req, res);
	})
	.get('/sign-up', function (req, res) {
		res.render('sign-up', {layout: false});
	})
	// process the signup form
  .post('/sign-up', function (req, res, next) {
	  auth.authRedirectSignUp(req, res, next);
  })
  .get('/log-in', function (req, res) {
		res.render('log-in', {layout: false});
	})
  .post('/log-in', function (req, res, next) {
	  auth.authRedirectLogIn(req, res, next);
  });

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    req.session.redirectUrl = req.url;

    // if they aren't redirect them to log in
    res.redirect('/log-in');
}

var requiresAdmin = function() {
  return [
    isLoggedIn('/admin'),
    function (req, res, next) {
      if (req.user && req.user.isAdmin === true)
        next();
      else
        res.send(401, 'Unauthorized');
    }
  ]
};

module.exports = router;
