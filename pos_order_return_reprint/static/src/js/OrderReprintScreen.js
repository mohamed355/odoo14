odoo.define('pos_order_return_reprint.OrderReprintScreen', function (require) {
	'use strict';

	const ReceiptScreen = require('point_of_sale.ReceiptScreen');
	const Registries = require('point_of_sale.Registries');

	const OrderReprintScreen = (ReceiptScreen) => {
		class OrderReprintScreen extends ReceiptScreen {
			constructor() {
				super(...arguments);
			}

			back() {
				var self = this;
				// this.props.resolve({ confirmed: true, payload: null });
				self.showScreen('OrdersScreenWidget',{});
				// this.trigger('close-temp-screen');
			}
		}
		OrderReprintScreen.template = 'OrderReprintScreen';
		return OrderReprintScreen;
	};

	Registries.Component.addByExtending(OrderReprintScreen, ReceiptScreen);

	return OrderReprintScreen;
});
