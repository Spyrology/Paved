var stripe = require('stripe')("sk_test_r6CoQNy1HzO4cfqEDqS6D4I8");
var companies = require('../models/opportunities');
var user = require('../models/users');

exports.createCharge = function (req, res, next) {
	
	//Obtain stripeToken
	var stripeToken = req.body.token;

	companies.getOpportunityA(req, function (opportunity) {

		var userEmail = req.user.localAuth.email;
		var evalId = opportunity.id;

		stripe.customers.create({
		  source: stripeToken,
		  description: userEmail
		}).then(function (customer) {
		  return stripe.charges.create({ 
		    amount: opportunity.price * 100, // amount in cents
		    currency: "usd",
		    customer: customer.id,
		    metadata: {'evalId': evalId}
		  }, function (err, charge) {
				  	if (err && err.type === 'StripeCardError') {
					    // The card has been declined
					    /*return next (err);*/
					    return res.json({success: false});
					  }
					  else {
					  	user.saveChargeToUser(req);
					  	return res.json({hasPurchased: true,
								evalDetails: {
									description: opportunity.description,
									file: opportunity.file
								}
							})
					  }
			});
		});
	});
};