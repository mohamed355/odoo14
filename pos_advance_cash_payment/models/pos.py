# -*- coding: utf-8 -*-
# Part of BrowseInfo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models, api, _
from datetime import date, datetime

class POSOrder(models.Model):
	_inherit = 'pos.order'

	def create_customer_payment(self, partner_id, journal, amount):
		payment_object = self.env['account.payment']
		partner_object = self.env['res.partner']
		journal_id = self.env['account.journal'].browse(int(journal))
		if journal_id:
			vals = {
				'payment_type':'inbound',
				'partner_type':'customer',
				'partner_id':partner_id,
				'journal_id':journal_id.id,
				'amount':amount,
				'create_date': datetime.today(),
				'payment_method_id':1
			}
			payment = payment_object.create(vals)
			payment.action_post()
		return payment.name
