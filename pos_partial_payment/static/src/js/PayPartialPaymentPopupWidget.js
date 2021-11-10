odoo.define('pos_partial_payment.PayPartialPaymentPopupWidget', function(require) {
	'use strict';

	const Registries = require('point_of_sale.Registries');
	const PosComponent = require('point_of_sale.PosComponent');
	const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');

	class PayPartialPaymentPopupWidget extends AbstractAwaitablePopup {
		constructor() {
            super(...arguments);
        }

		async pay_credit(ev) {
			var self = this;
			var order = this.env.pos.get_order();
			var selectedOrder = self.env.pos.get('selectedOrder');
			let entered_amount = parseFloat($("#entered_amount").val());
			var payment_type = $('#payment_type').val();
			let partial_journal = self.env.pos.config.partial_journal_id[0]
			let partner_id = self.props.partner;
			console.log(partner_id);
			if(!entered_amount || parseFloat(entered_amount) == 0){
				alert('Please enter valid amount !!!!');
			}else{
				if (!partner_id) {
					self.showPopup('ErrorPopup', {
						'title': self.env._t('Unknown customer'),
						'body': self.env._t('You cannot Pay Partial Payment. Select customer first.'),
					});
					return;
				}else if (!partner_id.allow_credit) {

					self.rpc({
						model: 'pos.order',
						method: 'create_customer_payment',
						args: [0, partner_id.id, payment_type, entered_amount],
					}).then(function(output) {
						// alert('Customer Payment Created !!!!');
						self.trigger('close-popup');
						self.showTempScreen('PartialPayReceiptScreen',{
							journal_entry : output,
							partner_id : partner_id,
							amount: entered_amount,
							date:moment(new Date()).locale('en').format("YYYY-MM-DD HH:mm"),
						});
					});
				}else{
					await self.rpc({
						model: 'res.partner',
						method: 'check_change_credit',
						args: [partner_id ? partner_id.id : 0, entered_amount, partial_journal,payment_type,order.pos_session_id],
					}).then(function(output) {
						console.log('partner_id',partner_id);
						if(output > partner_id.custom_credit){ // Make Condition that Customer cannot Pay More than Credit Amount
							ev.stopPropagation();
							ev.preventDefault();
							ev.stopImmediatePropagation();
							self.showPopup('ErrorPopup',{
								'title': self.env._t('Payment Amount Exceeded'),
								'body': self.env._t('You cannot Pay More than Credit Amount'),
							});
						}
						if (output <= partner_id.custom_credit){
							// self.rpc({
							// 	model: 'pos.order',
							// 	method: 'create_customer_payment',
							// 	args: [0, partner_id.id, payment_type, entered_amount],
							// }).then(function(output) {
							// 	// alert('Customer Payment Created !!!!');
							// 	var partial = partner_id.custom_credit - entered_amount;
							// 	self.rpc({
							// 		model: 'res.partner',
							// 		method: 'write',
							// 		args: [[partner_id.id], {'custom_credit': partial}],
							// 	});
							//
							// 	self.trigger('close-popup');
							//
							// 	self.showTempScreen('PartialPayReceiptScreen',{
							// 		journal_entry : output,
							// 		partner_id : partner_id,
							// 		amount: entered_amount,
							// 		date:moment(new Date()).locale('en').format("YYYY-MM-DD HH:mm"),
							// 	});
							//
							// });

							self.rpc({
								model: 'res.partner',
								method: 'pay_partial_payment',
								args: [partner_id ? partner_id.id : 0, entered_amount, partial_journal,payment_type,order.pos_session_id],
							}).then(function(journal_entry) {
								var partial = partner_id.custom_credit - entered_amount;
								self.rpc({
									model: 'res.partner',
									method: 'write',
									args: [[partner_id.id], {'custom_credit': partial}],
								});
								self.trigger('close-popup');
								self.showTempScreen('PartialPayReceiptScreen',{
									journal_entry : journal_entry,
									partner_id : partner_id,
									amount: entered_amount,
									date:moment(new Date()).locale('en').format("YYYY-MM-DD HH:mm"),
								});
							});
						}
					});
				}
			}
		}

	}

	PayPartialPaymentPopupWidget.template = 'PayPartialPaymentPopupWidget';
	Registries.Component.add(PayPartialPaymentPopupWidget);
	return PayPartialPaymentPopupWidget;



});
