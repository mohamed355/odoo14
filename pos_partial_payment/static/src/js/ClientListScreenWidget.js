odoo.define('pos_partial_payment.ClientListScreenWidget', function(require) {
	"use strict";

	const ClientListScreen = require('point_of_sale.ClientListScreen');
	const { debounce } = owl.utils;
	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');
	const { useListener } = require('web.custom_hooks');


	const ClientListScreenWidget = (ClientListScreen) =>
		class extends ClientListScreen {
			constructor() {
				super(...arguments);
				var self = this;
				useListener('add-credit-payment', this.add_credit_payment);
				setInterval(function(){
					self.env.pos.load_new_partners();
				}, 5000);
				this.update_customers();
			}

			async update_customers() {
				await this.env.pos.load_new_partners();
			}

			add_credit_payment(event){
				this.showPopup('PayPartialPaymentPopupWidget', {'partner':event.detail});
			}
	};

	Registries.Component.extend(ClientListScreen, ClientListScreenWidget);

	return ClientListScreen;
});
