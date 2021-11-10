odoo.define('pos_bag_charges.ClientDetailsEditcustom', function(require) {
	"use strict";

	const ClientDetailsEdit = require('point_of_sale.ClientDetailsEdit');
	const Registries = require('point_of_sale.Registries');
	const PosComponent = require('point_of_sale.PosComponent');

	const ClientDetailsEditcustom = (ClientDetailsEdit) =>
		class extends ClientDetailsEdit {

			constructor() {
				super(...arguments);
			}

			on_click(){
				this.showPopup('AddPaymentPopupWidget', {'partner':this.props.partner});
			}
	};

	Registries.Component.extend(ClientDetailsEdit, ClientDetailsEditcustom);
	return ClientDetailsEdit;
});