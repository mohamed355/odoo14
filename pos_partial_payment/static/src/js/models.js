odoo.define('pos_partial_payment.pos', function (require) {
	"use strict";

	var models = require('point_of_sale.models');

	models.load_fields('res.partner', ['custom_credit','allow_credit','allow_over_limit','limit_credit']);
	models.load_fields('pos.payment.method', ['is_credit']);
	models.load_models({
		model:  'account.journal',
		fields: ['name','type','is_credit'],
		domain: function(self){
			return [['type','in',["cash","bank"]],['is_credit','=',false]];
		},
		loaded: function(self,journal){
			self.journals = journal;
		},
	});




});
