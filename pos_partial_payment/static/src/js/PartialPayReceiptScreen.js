odoo.define('pos_partial_payment.PartialPayReceiptScreen', function(require) {
	'use strict';

	const ReceiptScreen = require('point_of_sale.ReceiptScreen');
	const Registries = require('point_of_sale.Registries');

	const PartialPayReceiptScreen = (ReceiptScreen) => {
		class PartialPayReceiptScreen extends ReceiptScreen {
			constructor() {
				super(...arguments);
			}

			back() {
				this.showTempScreen('ClientListScreen');
				// this.trigger('close-temp-screen');
			}
		}
		PartialPayReceiptScreen.template = 'PartialPayReceiptScreen';
		return PartialPayReceiptScreen;
	};

	Registries.Component.addByExtending(PartialPayReceiptScreen, ReceiptScreen);
	return PartialPayReceiptScreen;
});