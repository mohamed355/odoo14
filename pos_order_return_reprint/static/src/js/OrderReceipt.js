odoo.define('pos_order_return_reprint.BiOrderReceipt', function(require) {
	"use strict";

	const OrderReceipt = require('point_of_sale.OrderReceipt');
	const Registries = require('point_of_sale.Registries');

	const BarcodeOrderReceipt = OrderReceipt =>
		class extends OrderReceipt {
			constructor() {
				super(...arguments);
			}


			get receiptBarcode(){
				var order = this.env.pos.get_order();
				$("#barcode_print").barcode(
					order.barcode, // Value barcode (dependent on the type of barcode)
					"code128" // type (string)
				);
			return true
			}

	};

	Registries.Component.extend(OrderReceipt, BarcodeOrderReceipt);

	return OrderReceipt;
});
