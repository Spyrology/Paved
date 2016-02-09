var passport = require('passport');
var user = require('../models/users');

exports.authRedirectLogIn = function (req, res, next) {
	passport.authenticate('local-login', function(err, user, info) {
    //This is the default destination upon successful login
    var redirectUrl = '/';

    if (err) { return next(err); }
    if (!user) { return res.redirect('/log-in'); }

    //If we have previously stored a redirectUrl, use that,
    // otherwise, use the default
    if (req.session.redirectUrl) {
    	//if user is trying to upload evaluation, they must log in first
    	//and be redirected to opportunities page
    	if (req.session.redirectUrl === '/opportunities/upload') {
    		redirectUrl = '/opportunities';
    	}
    	else {
    		redirectUrl = req.session.redirectUrl;
    		req.session.redirectUrl = null;
    	}
    }

    req.logIn(user, function (err) {
    	if (err) { return next(err); }
    });
    res.redirect(redirectUrl);
	})(req, res, next);
};

exports.authRedirectSignUp = function (req, res, next) {
	passport.authenticate('local-signup', function(err, user, info) {
    //This is the default destination upon successful login
    var redirectUrl = '/';

    if (err) { return next(err); }
    if (!user) { return res.redirect('/'); }

    //If we have previously stored a redirectUrl, use that,
    // otherwise, use the default
    if (req.session.redirectUrl) {
    	//if user is trying to upload evaluation, they must log in first
    	//and be redirected to opportunities page
    	if (req.session.redirectUrl === '/opportunities/upload') {
    		redirectUrl = '/opportunities';
    	}
    	else {
    		redirectUrl = req.session.redirectUrl;
    		req.session.redirectUrl = null;
    	}
    }

    req.logIn(user, function (err) {
    	if (err) { return next(err); }
    });
    res.redirect(redirectUrl);
	})(req, res, next);
};

exports.reactLogIn = function (req, res) {
    passport.authenticate('local-login', function(err, user, info) {

        if (err) { return res.json({success: false}); }
        if (!user) { return res.json({success: false}); }

        req.logIn(user, function (err) {
          //console.log(user);
          if (err) { return res.json({success: false}); }
          else {return res.json({success: true}); }
        });
    })(req, res);
};

exports.reactSignUp = function (req, res) {
    passport.authenticate('local-signup', function(err, user, info) {
        console.log(err);
        console.log(user);
        if (err) { return res.json({success: false}); }
        if (!user) { return res.json({success: false}); }

        req.logIn(user, function (err) {
          console.log(err);
          if (err) { return res.json({success: false}); }
          else {return res.json({success: true}); }
        });
    })(req, res);
};