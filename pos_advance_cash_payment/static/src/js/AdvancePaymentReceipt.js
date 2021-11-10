
odoo.define('pos_advance_cash_payment.AdvancePaymentReceipt', function(require) {
	'use strict';

	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');

	class AdvancePaymentReceipt extends PosComponent {
		constructor() {
			super(...arguments);
		}
	}

	AdvancePaymentReceipt.template = 'AdvancePaymentReceipt';
	Registries.Component.add(AdvancePaymentReceipt);
	return AdvancePaymentReceipt;
});
