odoo.define('pos_partial_payment.PaymentScreenWidget', function(require){
	'use strict';

	const PaymentScreen = require('point_of_sale.PaymentScreen');
	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');
	const { Component } = owl;


	const PaymentScreenWidget = (PaymentScreen) =>
		class extends PaymentScreen {
			constructor() {
				super(...arguments);

				var currentOrder = this.env.pos.get_order();

				if (currentOrder.get_total_with_tax() < 0 && currentOrder.return_order_id ) {
					var refund_order = this.env.pos.db.order_by_id[currentOrder.return_order_id]
					let flag = 0;
					for (let i = 0; i < refund_order.payment_ids.length; i++) {
						var pline = this.env.pos.db.payment_by_id[refund_order.payment_ids[i]];
						var payment_method = this.env.pos.payment_methods_by_id[pline.journal_id[0]];
						if (payment_method.is_credit === true  && payment_method.is_cash_count === true) { //we've given credit journal Type
							flag += 1;
							break;
						}
					}
					if(flag != 0){
						this.payment_methods_from_config = this.env.pos.payment_methods.filter(method => method.is_credit && this.env.pos.config.payment_method_ids.includes(method.id));
					}
				}
			}

			async check_credit_validation(){
				let self = this;
				let currentOrder = this.env.pos.get_order();
				let orderlines = currentOrder.get_orderlines();
				let plines = currentOrder.get_paymentlines();
				let dued = currentOrder.get_due();
				let changed = currentOrder.get_change();
				let client = currentOrder.get_client();
				let flag = 0;
				let pos_cur =  this.env.pos.config.currency_id[0];
				let company_id = this.env.pos.config.company_id;
				let call_super = true;

				if(orderlines.length === 0){
					call_super = false;
					return self.showPopup('ErrorPopup',{
						'title': this.env._t('Empty Order'),
						'body': this.env._t('There must be at least one product in your order before it can be validated.'),
					});
				}

				if (client){  //if customer is selected
					for (let i = 0; i < plines.length; i++) {
						if (plines[i].payment_method.is_credit === true  && plines[i].payment_method.is_cash_count === true) {
							//we've given credit journal Type
							await self.rpc({
								model: 'pos.order',
								method: 'check_change_credit',
								args: [currentOrder ,plines[i].amount, plines[i].payment_method.id,currentOrder.pos_session_id],
							}).then(function(output) {
								if (currentOrder.return_order_id) {
									output *= -1;
								}
								// console.log("output");
								// console.log(output);

								let limit_amount = client.custom_credit + output
								if(client.allow_credit == false){
									call_super = false;
									return self.showPopup('ErrorPopup',{
										'title': self.env._t('Not Allow Credit Payment'),
										'body': self.env._t('You cannot use Credit payment.Please allow credit payment to this customer.'),
									});
								}
								if(client.allow_credit == true && client.allow_over_limit == false){
									if(client.custom_credit==0){
										if(currentOrder.get_change() > 0){
											call_super = false;
											return self.showPopup('ErrorPopup',{
												'title': self.env._t('Payment Amount Exceeded'),
												'body': self.env._t('You cannot Pay More than Total Amount'),
											});
										}else{
											console.log("currentOrder.get_change() > 0");
											self.rpc({
												model: 'res.partner',
												method: 'update_partner_credit',
												args: [client.id, output],
											});
											return true;
										}
									}else{
										if(client.custom_credit > 0){
											call_super = false;
											return self.showPopup('ErrorPopup',{
												'title': self.env._t('Not Allow Credit Payment'),
												'body': self.env._t('please pay credited amount first.'),
											});
										}
									}
								}
								if(client.allow_credit == true && client.allow_over_limit == true){
									if(currentOrder.get_change() > 0){ // Make Condition that pay exact amount, You cannot Pay More than Total Amount
										call_super = false;
										return self.showPopup('ErrorPopup',{
											'title': self.env._t('Payment Amount Exceeded'),
											'body': self.env._t('You cannot Pay More than Total Amount'),
										});
									}
									else if(limit_amount > client.limit_credit){
										call_super = false;
										return self.showPopup('ErrorPopup',{
											'title': self.env._t('Not Allow Credit Payment'),
											'body': self.env._t('Maximum Credit Limit for this customer reached.'),
										});
									}
									else{
										console.log("limit_amount > client.limit_credit");
										self.rpc({
											model: 'res.partner',
											method: 'update_partner_credit',
											args: [client.id, output],
										});
										return true;
									}
								}
							});
						}
					}
				}
				if (!client){
					for (let i = 0; i < plines.length; i++) {
						if (plines[i].payment_method.is_credit === true  && plines[i].payment_method.is_cash_count === true) { //we've given credit journal Type
							flag += 1;
							return;
						}
					}
				}

				if(flag != 0){
					call_super = false;
					return self.showPopup('ErrorPopup',{
						'title': self.env._t('Unknown customer'),
						'body': self.env._t('You cannot use Credit payment. Select customer first.'),
					});
				}
				return call_super;
			}

			async validateOrder(isForceValidate) {
				let check = await this.check_credit_validation();
				if (check){
					super.validateOrder(isForceValidate);
				}
			}
	};

	Registries.Component.extend(PaymentScreen, PaymentScreenWidget);

	return PaymentScreen;

});
