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

var User = mongoose.model('User', userSchema);

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

exports.saveChargeToUser = function(req, done) {
	User.findById(req.user, function (err, user) {
		if (err) return console.log(err);
		var evalId = req.params.id;
		user.charges.push(evalId);
		console.log(user.charges);
		user.save(function(err) {
			if (err) return console.log(err);
			done(user);
		});
	});
};

module.exports = mongoose.model('User', userSchema);