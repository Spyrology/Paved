var express = require('express');
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

	profile				: {
		firstname		: String,
		lastname		: String,
  	charges			: [] 
	},
	localAuth			: {
		email   		: String,
  	password  	: String,
  }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.localAuth.password);
};

var User = mongoose.model('User', userSchema);

User.saveChargeToUser = function(req) {
	User.findById(req.user, function (err, user) {
		if (err) return console.log(err);
		var evalId = req.params.id;
		user.profile.charges.push(evalId);
		user.save(function(err) {
			if (err) return console.log(err);
		});
	});
};

User.checkPriorCharges = function(req, cb) {
	User.findById(req.user, function (err, user) {
		if (err) return console.log(err);
		var evalId = req.params.id;
		var hasEval = false;
		for (i = 0; i < user.profile.charges.length; i++) {
			if (evalId === user.profile.charges[i]) {
				hasEval = true;
			}
		};
		cb(hasEval);
	});
};

module.exports = mongoose.model('User', userSchema);