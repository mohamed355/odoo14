
odoo.define('pos_partial_payment.PartialPayReceipt', function(require) {
	'use strict';

	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');

	class PartialPayReceipt extends PosComponent {
		constructor() {
			super(...arguments);
		}
	}

	PartialPayReceipt.template = 'PartialPayReceipt';
	Registries.Component.add(PartialPayReceipt);
	return PartialPayReceipt;
});