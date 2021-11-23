odoo.define('pos_industry_client.POSClientListScreenWidget', function(require) {
	"use strict";

	const ClientListScreen = require('point_of_sale.ClientListScreen');
	const { debounce } = owl.utils;
	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');
	const { useListener } = require('web.custom_hooks');

	var models = require('point_of_sale.models');
	const db = require('point_of_sale.DB');

	models.load_fields('res.partner', 'industry_id');


	const PosResClientListScreen = (ClientListScreen) =>
			class extends ClientListScreen{
				get clients() {

					var partners = [];
          if (this.state.query && this.state.query.trim() !== '') {
						partners = this.env.pos.db.search_partner(this.state.query.trim());
          } else {
						partners = this.env.pos.db.get_partners_sorted(1000);
          }

					return partners.filter(client => client.industry_id && this.env.pos.config.industry_id.includes(client.industry_id[0]));

        }

			}
	Registries.Component.extend(ClientListScreen, PosResClientListScreen);





});
