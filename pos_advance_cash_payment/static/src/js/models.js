odoo.define('pos_advance_cash_payment.pos', function (require) {
	"use strict";

	var models = require('point_of_sale.models');
	
	models.load_models({
		model:  'account.journal',
		fields: ['name','type'],
		domain: function(self){ return [['type','in',["cash","bank"]]]; },
		loaded: function(self,journal){
			self.journals = journal;
		},
	});

});
