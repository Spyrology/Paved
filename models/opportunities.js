var express = require('express');
var mongoose = require('mongoose');
var amazon = require('../lib/amazon');

var oppSchema = mongoose.Schema({
	position: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	requirements: {
		type: String,
		required: true
	},
	timeestimate: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	file: {
		type: String,
		required: false
	}
});

// define the schema for our opportunity model
var companySchema = mongoose.Schema({
	name: String,
	opportunities: [oppSchema]
});

var Company = mongoose.model('Company', companySchema);

var buildOpportunity = function(req) {
	var opp = {
		position: req.body.position,
		status: req.body.status,
		requirements: req.body.requirements,
		timeestimate: req.body.timeestimate,
		price: req.body.price,
		description: req.body.description,
		file: req.files.file.originalname
	};
	return opp;
};

exports.create = function(req, res) {
	amazon.upload(req, function (err, data) {
		var company = new Company({
			name: req.body.name,
			opportunities: [buildOpportunity(req)]
		});
		company.save(function (err, item) {
			if (err) return console.error(err);
			res.render('opportunities', {
				stylesheet: 'opportunities'
			});
		});
	});
};

exports.update = function(req, res) {
	amazon.upload(req, function (err, data) {
		if (err) return console.error(err);
		Company.findById(req.body.company, function (err, company) {
			if (err) return console.log(err);
			company.opportunities.push(buildOpportunity(req));
			company.save(function (err) {
				if (err) return console.log(err);
        res.render('opportunities', {
  				stylesheet: 'opportunities'
  			});
			});
		});
	});
};

exports.find = function(req, done) {
	Company.find(function (err, opps) {
		if (typeof done === 'function') {
			done(err, opps);
		} else {
			throw ('Expects a function as a second argument');
		}
	});
};

exports.show = function(req, res) {
	Company.findById(req.params.companyId, function (err, company) {
		if (err) throw err;
		var evaluation = company.opportunities.id(req.params.id);
		res.render('evaluation', {
			stylesheet: 'evaluation',
			company: company,
			opportunity: evaluation
		});
	});
};

// this would go away after a full refactor
exports.getOpportunity = function(req, done) {
	var companyId = req.params.companyId;
	var evalId = req.params.id;
	Company.findById(companyId, function (err, company) {
		if (err) throw err;
		var opportunity = company.opportunities.id(evalId);
		done(opportunity);
	});
};

exports.getOpportunity = function(companyId, evalId, done) {
    Company.findById(companyId, function (err, company) {
        if (err) return done(err);

        var opportunity = company.opportunities.id(evalId);
        done(null, opportunity);
    });
};
