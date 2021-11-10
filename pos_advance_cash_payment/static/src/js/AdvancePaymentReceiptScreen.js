odoo.define('pos_advance_cash_payment.AdvancePaymentReceiptScreen', function(require) {
	'use strict';

	const ReceiptScreen = require('point_of_sale.ReceiptScreen');
	const Registries = require('point_of_sale.Registries');

	const AdvancePaymentReceiptScreen = (ReceiptScreen) => {
		class AdvancePaymentReceiptScreen extends ReceiptScreen {
			constructor() {
				super(...arguments);
			}

			back() {
				this.showTempScreen('ClientListScreen');
				// this.trigger('close-temp-screen');
			}
		}
		AdvancePaymentReceiptScreen.template = 'AdvancePaymentReceiptScreen';
		return AdvancePaymentReceiptScreen;
	};

	Registries.Component.addByExtending(AdvancePaymentReceiptScreen, ReceiptScreen);
	return AdvancePaymentReceiptScreen;
});
