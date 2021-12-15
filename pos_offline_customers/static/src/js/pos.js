odoo.define('pos_offline_customers', function (require) {
"use strict";
   	const { useState } = owl;
    const { _t } = require('web.core');
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const ClientDetailsEdit = require('point_of_sale.ClientDetailsEdit');
    const module = require('point_of_sale.models');
    const PosDB = require('point_of_sale.DB');
    const ClientListScreen = require('point_of_sale.ClientListScreen');
    const { useListener } = require('web.custom_hooks');



	module.load_fields('res.partner',['pos_refrence_id']);

    class CustomerSynchNotificationWidget extends PosComponent {
        constructor() {
            super(...arguments);
            const synch = this.env.pos.get('qsynch');
            this.state = useState({ status: synch.status, msg: synch.pending });
        }
        mounted() {
            this.env.pos.on(
                'change:qsynch',
                (pos, synch) => {
                    this.state.status = synch.status;
                    this.state.msg = synch.pending;
                },
                this
            );
        }
        willUnmount() {
            this.env.pos.on('change:qsynch', null, this);
        }
        onClick() {
            this.env.pos.push_customer(null, { show_error: true });
        }
    }

    CustomerSynchNotificationWidget.template = 'CustomerSynchNotificationWidget';
    Registries.Component.add(CustomerSynchNotificationWidget);

    const PosClientDetailsEdit = (ClientDetailsEdit) =>
        class extends ClientDetailsEdit {
	        saveChanges() {
	            let processedChanges = {};
	            let self = this;
	            for (let [key, value] of Object.entries(this.changes)) {
	                if (this.intFields.includes(key)) {
	                    processedChanges[key] = parseInt(value) || false;
	                } else {
	                    processedChanges[key] = value;
	                }
	            }
	            processedChanges['property_product_pricelist'] = processedChanges['property_product_pricelist'] || false;
	            processedChanges.id = this.props.partner.id || false;
		        var config_id = self.env.pos.config_id
		        var session_id = self.env.pos.pos_session.id;
		        var dt = new Date();
				    var time = dt.getHours()+""+dt.getMinutes()+""+dt.getSeconds();
		        self.env.uid = dt.getTime()+''+session_id;
		        processedChanges.uid = self.env.uid;
		        processedChanges.pos_refrence_id = self.env.uid;
		       	processedChanges.write_date = "1970-01-01 00:00:00";
            var id = Object.keys(self.env.pos.db.partner_by_id)[Object.keys(self.env.pos.db.partner_by_id).length - 1] + 1;
            // console.log(last);
            // var id = Object.keys(self.env.pos.db.partner_by_id).length;
		        processedChanges.id = processedChanges.id || id;
            if (!processedChanges.barcode || (processedChanges.barcode && !self.env.pos.db.get_partner_by_barcode(processedChanges.barcode))) {
              self.env.pos.db.add_partners([processedChanges]);
  		        self.env.pos.push_customer(processedChanges);
  		        var partner = self.env.pos.db.get_partner_by_id(processedChanges.id);
              if (partner) {
                  self.new_client = partner;
              }
              // alert("Customer saved")
              this.trigger('save-offline-changes', { processedChanges });
            }else {
              self.showPopup('ErrorPopup', {
                title: _t('Validation Error'),
                body: _t('Customer Barcode is already exist')
              });
            }
		        // self.env.pos.db.add_partners([processedChanges]);
		        // self.env.pos.push_customer(processedChanges);

		        // var partner = self.env.pos.db.get_partner_by_id(processedChanges.id);
            // if (partner) {
            //     self.new_client = partner;
            // }
            // this.trigger('save-offline-changes', { processedChanges });
	        }
        }

    Registries.Component.extend(ClientDetailsEdit, PosClientDetailsEdit);

    const PosClientListScreen = (ClientListScreen) =>
        class extends ClientListScreen {
        	constructor() {
	            super(...arguments);
	            useListener('save-offline-changes', this.saveOfflineChanges);
	        }
	        async saveOfflineChanges(event) {
            var self = this;

                // let load_new_partners = await this.env.pos.load_new_partners();

                var promise = this.env.pos.load_new_partners();
                // var promise = await this.env.pos.load_new_partners();
                promise.then((result) => {
                    // resolve("NULL");
                    self.state.selectedClient = self.env.pos.db.get_partner_by_id(event.detail.processedChanges.id);
                    self.state.detailIsShown = false;
                    self.render();

                }).catch((message) => {
                  self.state.selectedClient = self.env.pos.db.get_partner_by_id(event.detail.processedChanges.id);
                  self.state.detailIsShown = false;
                  self.render();

                    // reject(message);
                    //alert(message)
                });

	        }
    }

    Registries.Component.extend(ClientListScreen, PosClientListScreen);

	var _super_order = module.Order.prototype;
    module.Order = module.Order.extend({
        export_as_JSON: function() {
            var json = _super_order.export_as_JSON.apply(this,arguments);
            json.parnter_obj = {};

            if(json.partner_id){
            	var parnter_obj = this.pos.db.get_partner_by_id(json.partner_id);
            	if(parnter_obj.uid > 0){
            		json.parnter_obj = parnter_obj;
            	}
            }
            return json;
        }
    });

    PosDB.include({

	    add_partners: function(partners){
	        var updated_count = 0;
	        var new_write_date = '';
	        var partner;
	        for(var i = 0, len = partners.length; i < len; i++){
	            partner = partners[i];

	            var local_partner_date = (this.partner_write_date || '').replace(/^(\d{4}-\d{2}-\d{2}) ((\d{2}:?){3})$/, '$1T$2Z');
	            var dist_partner_date = (partner.write_date || '').replace(/^(\d{4}-\d{2}-\d{2}) ((\d{2}:?){3})$/, '$1T$2Z');
	            if (    this.partner_write_date &&
	                    this.partner_by_id[partner.id] &&
	                    new Date(local_partner_date).getTime() + 1000 >=
	                    new Date(dist_partner_date).getTime() ) {
	                // FIXME: The write_date is stored with milisec precision in the database
	                // but the dates we get back are only precise to the second. This means when
	                // you read partners modified strictly after time X, you get back partners that were
	                // modified X - 1 sec ago.
	                continue;
	            } else if ( new_write_date < partner.write_date ) {
	                new_write_date  = partner.write_date;
	            }
	            if(partner.pos_refrence_id > 0){
	            	var p_ref = this.partner_by_id[partner.pos_refrence_id];
	            	if(p_ref){
		            	if(p_ref.id == p_ref.pos_refrence_id){
		            		delete this.partner_by_id[p_ref.pos_refrence_id];
		            		this.partner_sorted.splice(this.partner_sorted.indexOf(p_ref.pos_refrence_id),1);
		            	}
		            }
	            }
	            if (!this.partner_by_id[partner.id]) {
	                this.partner_sorted.push(partner.id);
	            }
	            this.partner_by_id[partner.id] = partner;

	            updated_count += 1;
	        }

	        this.partner_write_date = new_write_date || this.partner_write_date;

	        if (updated_count) {
	            // If there were updates, we need to completely
	            // rebuild the search string and the barcode indexing

	            this.partner_search_string = "";
	            this.partner_by_barcode = {};

	            for (var id in this.partner_by_id) {
	                partner = this.partner_by_id[id];

	                if(partner.barcode){
	                    this.partner_by_barcode[partner.barcode] = partner;
	                }
	                partner.address = (partner.street || '') +', '+
	                                  (partner.zip || '')    +' '+
	                                  (partner.city || '')   +', '+
	                                  (partner.country_id || '');
	                this.partner_search_string += this._partner_search_string(partner);
	            }
	        }
	        return updated_count;
	    },
    	add_customer: function(order){
	        var order_id = order.uid;
	        var orders  = this.load('customers',[]);
          console.log("SDASKJDHUWIopipowqpwoqwpqow add_customer");
	        // if the order was already stored, we overwrite its data
	        for(var i = 0, len = orders.length; i < len; i++){
	            if(orders[i].id === order_id){
	                orders[i].data = order;
	                this.save('customers',orders);
	                return order_id;
	            }
	        }

	        // Only necessary when we store a new, validated order. Orders
	        // that where already stored should already have been removed.
	        // this.remove_unpaid_order(order);

	        orders.push({id: order_id, data: order});
	        this.save('customers',orders);
	        return order_id;
	    },
	    get_customers: function(){

	        return this.load('customers',[]);
	    },
	    get_customer: function(order_id){
	        var orders = this.get_customers();
	        for(var i = 0, len = orders.length; i < len; i++){
	            if(orders[i].id === order_id){
	                return orders[i];
	            }
	        }
	        return undefined;
	    },
	    remove_customer: function(order_id){
	        var orders = this.load('customers',[]);
	        orders = _.filter(orders, function(order){
	            return order.id !== order_id;
	        });
	        this.save('customers',orders);
	    },
	    remove_partner: function(partner_id){
	        var orders = this.load('orders',[]);
	        orders = _.filter(orders, function(order){
	            return order.id !== order_id;
	        });
	        this.save('orders',orders);
	    },
    });

	var _super_PosModel = module.PosModel.prototype;
    module.PosModel = module.PosModel.extend({
	    initialize: function(attributes) {
	    	this.set({'qsynch' :{ status:'connected', pending:0 }});
	    	return _super_PosModel.initialize.apply(this,arguments);
	    },
	    _flush_customers: function(orders, options) {
	        var self = this;
	        this.set('qsynch',{ status: 'connecting', pending: orders.length});
	        return self._save_to_server_cust(orders, options).then(function (server_ids) {
	            var pending = self.db.get_customers().length;

	            self.set('qsynch', {
	                status: pending ? 'connecting' : 'connected',
	                pending: pending
	            });

	            return server_ids;
	        }).catch(function(error){
	            var pending = self.db.get_customers().length;
	            if (self.get('failed')) {
	                self.set('qsynch', { status: 'error', pending: pending });
	            } else {
	                self.set('qsynch', { status: 'disconnected', pending: pending });
	            }
	        });
	    },
    _save_to_server_cust: function (orders, options) {
        if (!orders || !orders.length) {
            return Promise.resolve([]);
        }
        options = options || {};
        var self = this;
        var timeout = typeof options.timeout === 'number' ? options.timeout : 30000 * orders.length;
        var order_ids_to_sync = _.pluck(orders, 'id');
        var args = [_.map(orders, function (order) {
                order.to_invoice = options.to_invoice || false;
                return order;
            })];
        args.push(options.draft || false);
        return this.rpc({
                model: 'res.partner',
                method: 'create_from_ui2',
                args: [args[0]],
                kwargs: {context: this.session.user_context},
            }, {
                timeout: timeout,
                shadow: !options.to_invoice
            })
            .then(function (server_ids) {
                _.each(order_ids_to_sync, function (order_id) {
                    self.db.remove_customer(order_id);
                });

                self.set('failed',false);
                return server_ids;
            }).catch(function (reason){
                var error = reason.message;
                console.warn('Failed to send orders:', orders);
                if(error.code === 200 ){    // Business Logic Error, not a connection problem
                    // Hide error if already shown before ...
                    if ((!self.get('failed') || options.show_error) && !options.to_invoice) {
                        self.set('failed',error);
                        throw error;
                    }
                }
                throw error;
            });
    },

	    push_customer: function(customer, opts) {
	        opts = opts || {};
	        var self = this;
	        if(customer){
	            this.db.add_customer(customer);
	        }
	        return new Promise(function (resolve, reject) {
	            self.flush_mutex.exec(function () {
	                var flushed = self._flush_customers(self.db.get_customers(), opts);

	                flushed.then(resolve, reject);

	                return flushed;
	            });
	        });
	    },
    });
});
