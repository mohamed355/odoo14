# -*- coding: utf-8 -*-
# Part of BrowseInfo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models, api, _
from datetime import date, datetime
import random
import pytz


class pos_order(models.Model):
	_inherit = 'pos.order'

	pos_order_date = fields.Date('Oder Date', compute='get_order_date')
	barcode = fields.Char(string="Order Barcode")
	barcode_img = fields.Binary('Order Barcode Image')
	# def all_barcode(self):
	# 	all = self.env['pos.order'].search([])
	# 	for order in all:
	# 		order.write({'barcode':random.randrange(1111111111111,9999999999999)})


	def get_order_date(self):
		for order in self:
			order.pos_order_date = order.date_order.date()

	@api.model
	def _order_fields(self, ui_order):
		res = super(pos_order, self)._order_fields(ui_order)
		code =(random.randrange(1111111111111,9999999999999))
		config = self.env['pos.session'].browse(ui_order['pos_session_id']).config_id
		res['barcode'] = ui_order.get('barcode',code)
		# print("NKLDFSAFK")
		# self.all_barcode()
		# print("FKLDSFLDF")
		return res


	def print_pos_receipt(self):
		orderlines = []
		paymentlines = []
		discount = 0

		for orderline in self.lines:
			new_vals = {
				'product_id': orderline.product_id.name,
				'total_price' : orderline.price_subtotal_incl,
				'qty': orderline.qty,
				'price_unit': orderline.price_unit,
				'discount': orderline.discount,
				}

			discount += (orderline.price_unit * orderline.qty * orderline.discount) / 100
			orderlines.append(new_vals)

		for payment in self.payment_ids:
			if payment.amount > 0:
				temp = {
					'amount': payment.amount,
					'name': payment.payment_method_id.name
				}
				paymentlines.append(temp)
		tz = pytz.timezone(self.user_id.tz or 'UTC')
		vals = {
			'discount': discount,
			'orderlines': orderlines,
			'paymentlines': paymentlines,
			'change': self.amount_return,
			'subtotal': self.amount_total - self.amount_tax,
			'tax': self.amount_tax,
			'barcode': self.barcode,
			'user_name' : self.user_id.name,
			'date_order':self.date_order.now(tz=tz).strftime("%Y-%m-%d %H:%M:%S")
		}
		return vals
