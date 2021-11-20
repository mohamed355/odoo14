# -*- coding: utf-8 -*-
# Part of BrowseInfo. See LICENSE file for full copyright and licensing details.

{
	"name" : "Pos Stock Qty",
	"version" : "14.0.1.3",
	"category" : "Point of Sale",
	"description": """
	Purpose :-

	odoo stock quantity on point of sale available stock on pos available stock on point of sale


	odoo Display Stock in POS Display Stock Quantity on POS
	odoo POS warning stock Warning on POS
	odoo POS stock management odoo Stock management on POS Product stock on POS
	odoo POS product stock POS product stock on hand Display product stock on POS
	odoo Point of sale stock odoo Display Stock in Point of Sales
	odoo Display Stock Quantity on Point of Sales odoo Point of Sales warning stock  Warning on Point of Sales
	odoo Point of Sales stock management odoo Stock management on Point of Sales
	odoo Product stock on Point of Sales odoo Point of sales product stock
	odoo Point of sales product stock on hand Display product stock on Point of Sales,

	odoo Point of sales stock odoo Display Stock in Point of Sales
	odoo Display Stock Quantity on Point of Sale odoo Point of Sales warning stock  Warning on Point of Sales odoo
	odoo Point of Sale stock management odoo Stock management on Point of Sales odoo
	odoo Product stock on Point of Sale odoo Point of sales product stock odoo
	odoo Point of sale product stock on hand Display product stock on Point of Sale odoo

	""",
	"depends" : ['base','point_of_sale'],
	"price": 50,
	"currency": 'EUR',
	"data": [
		'views/assets.xml',
		'views/pos_config_view.xml',
	],
	'qweb': [
		'static/src/xml/pos_stock.xml',
	],
	"auto_install": False,
	"installable": True,
}
