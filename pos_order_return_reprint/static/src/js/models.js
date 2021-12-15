// pos_orders_all js
odoo.define('pos_order_return_reprint.models', function(require) {
	"use strict";

	var models = require('point_of_sale.models');
	var PosDB = require("point_of_sale.DB");
	var utils = require('web.utils');
	var round_pr = utils.round_precision;

	PosDB.include({
		init: function(options){
			this.get_orders_by_id = {};
			this.get_orders_by_barcode = {};
			this.get_orderline_by_id = {};
			this._super(options);
		},
	});




	var posorder_super = models.Order.prototype;
	models.Order = models.Order.extend({
		initialize: function(attr, options) {
			this.barcode = this.barcode || "";

			this.set_barcode();
			posorder_super.initialize.call(this,attr,options);
		},


		set_barcode: function(){
			var self = this;
			var temp = Math.floor(100000000000+ Math.random() * 9000000000000)
			self.barcode =  temp.toString();
		},


		export_as_JSON: function() {
			var self = this;
			var loaded = posorder_super.export_as_JSON.call(this);
			loaded.barcode = self.barcode;

			return loaded;
		},

		init_from_JSON: function(json){
			posorder_super.init_from_JSON.apply(this,arguments);
			this.barcode = json.barcode;

		},


	});


});
