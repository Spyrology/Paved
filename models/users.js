var express = require('express');
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

	local					: {
  	email   		: String,
  	password  	: String,
  	customerId	: String,
  	charges			: [] 
	}

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	console.log(userSchema);
  return bcrypt.compareSync(password, this.local.password);
};

var User = mongoose.model('User', userSchema);

User.saveChargeToUser = function(req) {
	User.findById(req.user, function (err, user) {
		if (err) return console.log(err);
		console.log(user);
		var evalId = req.params.id;
		user.local.charges.push(evalId);
		user.save(function(err) {
			if (err) return console.log(err);
		});
	});
};

User.testMe = function() {
	console.log(userSchema.methods);
	console.log("I'm here, Ma!");
}

User.checkPriorCharges = function(req, cb) {
	User.findById(req.user, function (err, user) {
		if (err) return console.log(err);
		var evalId = req.params.id;
		var hasEval = false;
		for (i = 0; i < user.local.charges.length; i++) {
			if (evalId === user.local.charges[i]) {
				hasEval = true;
			}
		};
		cb(hasEval);
	});
};

module.exports = mongoose.model('User', userSchema);