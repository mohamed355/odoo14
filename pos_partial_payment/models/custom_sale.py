# -*- coding: utf-8 -*-
# Part of BrowseInfo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models, api, _, tools
from datetime import date, time, datetime
import psycopg2
import logging
_logger = logging.getLogger(__name__)

class PosConfig(models.Model):
	_inherit = 'pos.config'

	invoice_credit_payment = fields.Selection([('full_amount', 'Full Amount(without credit)'), ('partial_amount', 'Partial Amount(with credit)')],string='',default='full_amount')
	partial_journal_id = fields.Many2one('account.journal', 'Partial Payment Journal' , required = True)


class res_partner(models.Model):
	_inherit = 'res.partner'

	custom_credit = fields.Float('Credit')
	allow_credit = fields.Boolean(string='Allow Credit')
	allow_over_limit = fields.Boolean(string='Allow Over limit')
	limit_credit = fields.Float("Credit Limit.")

	def update_partner_credit(self, amount):
		self.update({'custom_credit': self.custom_credit + amount})


	def check_change_credit(self,amount , journal,payment_type ,session_id):
		session = self.env['pos.session'].browse(int(session_id))
		cr_journal_obj = self.env['account.journal'].search([('id','=',journal)])
		paid_journal_obj = self.env['account.journal'].search([('id','=',payment_type)])
		if cr_journal_obj.default_account_id.currency_id.id and session.company_id.currency_id.id:
			if session.company_id.currency_id.id != cr_journal_obj.default_account_id.currency_id.id:
				company_rate = session.company_id.currency_id.rate
				different_rate = cr_journal_obj.default_account_id.currency_id.rate
				amount_diff = company_rate/different_rate
				diff_amount = amount* amount_diff
			else:
				diff_amount = amount
		else:
			diff_amount = amount
		return diff_amount


	def pay_partial_payment(self, amount, journal_id,payment_type,session_id):
		session = self.env['pos.session'].browse(int(session_id))
		cr_journal_obj = self.env['account.journal'].search([('id','=',journal_id)])
		paid_journal_id = self.env['account.journal'].browse(int(payment_type))
		lines = []
		if cr_journal_obj.default_account_id.currency_id.id and session.company_id.currency_id.id:
			if session.company_id.currency_id.id != cr_journal_obj.default_account_id.currency_id.id:
				company_rate = session.company_id.currency_id.rate
				different_rate = cr_journal_obj.default_account_id.currency_id.rate
				amount_diff = company_rate/different_rate
				diff_amount = amount* amount_diff

		if cr_journal_obj.default_account_id.currency_id.id and session.company_id.currency_id.id:
			if session.company_id.currency_id.id != cr_journal_obj.default_account_id.currency_id.id:
				# partner_line = {'account_id':self.property_account_receivable_id.id,
				partner_line = {'account_id':paid_journal_id.default_account_id.id,
					'name':'/',
					'date':date.today(),
					'partner_id': self.id,
					'debit': 0.0,
					'credit':diff_amount,
				}
				lines.append(partner_line)
				pos_line  = {
					'account_id':cr_journal_obj.default_account_id.id,
					'name':'POS Payment',
					'currency_id' : cr_journal_obj.default_account_id.currency_id.id,
					'amount_currency' : float(amount),
					'date':date.today(),
					'partner_id': self.id,
					'credit': 0.0,
					'debit':diff_amount,
				}
				lines.append(pos_line)
			else:
				partner_line = {'account_id':paid_journal_id.default_account_id.id,
					'name':'/',
					'date':date.today(),
					'partner_id': self.id,
					'debit': 0.0,
					'credit':float(amount),
				}
				lines.append(partner_line)
				pos_line  = {
					'account_id':cr_journal_obj.default_account_id.id,
					'name':'POS Payment',
					'date':date.today(),
					'partner_id': self.id,
					'credit': 0.0,
					'debit':float(amount),
				}
				lines.append(pos_line)
		else:
			partner_line = {'account_id':paid_journal_id.default_account_id.id,
				'name':'/',
				'date':date.today(),
				'partner_id': self.id,
				'debit': 0.0,
				'credit':float(amount),
			}
			lines.append(partner_line)
			pos_line  = {
				'account_id':cr_journal_obj.default_account_id.id,
				'name':'POS Payment',
				'date':date.today(),
				'partner_id': self.id,
				'credit': 0.0,
				'debit':float(amount),
			}
			lines.append(pos_line)
		line_list = [(0, 0, x) for x in lines]
		move_id = self.env['account.move'].create({
			'ref' : session.name,
			'partner_id':self.id,
			'date':date.today(),
			'journal_id':journal_id,
			'line_ids':line_list
		})
		move_id.action_post()
		if cr_journal_obj.default_account_id.currency_id.id and session.company_id.currency_id.id:
			if session.company_id.currency_id.id != cr_journal_obj.default_account_id.currency_id.id:
				amount = diff_amount
		return move_id.name

	def action_view_credit_detail(self):
		self.ensure_one()

		partner_credit_ids = self.env['partner.credit'].search([('partner_id','=',self.id)])
		for payment_id in partner_credit_ids:
			browse_record = self.env['partner.credit'].browse(payment_id.id)
			browse_record.do_update()

		return {
			'name': 'Credit.Details',
			'type': 'ir.actions.act_window',
			'view_mode': 'tree',
			'res_model': 'partner.credit',
			'domain': [('partner_id', '=', self.id)],
		}


class partner_credit(models.Model):
	_name = 'partner.credit'
	_description = "Partner Credit"

	partner_id = fields.Many2one('res.partner',"Customer")
	credit = fields.Float('Credit', readonly=True)
	update = fields.Float('Update')

	def do_update(self):
		if self.update > 0.00:
			self.credit = self.update
			self.partner_id.custom_credit = self.credit
		if self.partner_id.custom_credit != 0.00:
			self.credit = self.partner_id.custom_credit
		self.update = 0.00

	@api.onchange('partner_id')
	def onchange_partner_id(self):
		if self.partner_id:
			update = self.partner_id.update
			return {'credit':update}


class account_journal(models.Model):
	_inherit = 'account.journal'

	is_credit = fields.Boolean(string='Is Credit')


class account_journal(models.Model):
	_inherit = 'pos.payment.method'

	is_credit = fields.Boolean(string='Is Credit',related='cash_journal_id.is_credit',readonly=False)


class PosOrderCreditInvoice(models.Model):
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



	def check_change_credit(self,amount , journal ,session_id):
		session = self.env['pos.session'].browse(int(session_id))
		payment_method = self.env['pos.payment.method'].browse(int(journal))
		currency_id = payment_method.cash_journal_id.currency_id if payment_method.cash_journal_id.currency_id else False

		if currency_id:
			if session.company_id.currency_id.id != currency_id.id:
				company_rate = session.company_id.currency_id.rate
				different_rate = currency_id.rate
				amount_diff = company_rate/different_rate
				diff_amount = amount* amount_diff
			else:
				diff_amount = amount
		else:
			diff_amount = amount
		return diff_amount


	def action_pos_order_invoice(self):
		moves = self.env['account.move']
		for order in self:
			invoice_credit_payment = order.config_id.invoice_credit_payment
			if invoice_credit_payment != 'partial_amount':
				return super(PosOrderCreditInvoice, self).action_pos_order_invoice()
			else:
				# Force company for all SUPERUSER_ID action
				if order.account_move:
					moves += order.account_move
					continue

				if not order.partner_id:
					raise UserError(_('Please provide a partner for the sale.'))

				move_vals = order._prepare_invoice_vals()
				new_move = moves.sudo()\
								.with_company(order.company_id)\
								.with_context(default_move_type=move_vals['move_type'])\
								.create(move_vals)

				crd_amt = 0
				for pymt in order.payment_ids :
					if pymt.payment_method_id.is_credit:
						crd_amt += pymt.amount

				if crd_amt != 0 :
					new_move.update({'invoice_line_ids': [(0, 0, {
							'move_id': new_move.id,
							'quantity': 1,
							'name': 'Credit',
							'price_unit': - float(crd_amt),
							'account_id': self.env['account.account'].search([('internal_type','=', 'other')], limit=1).id,
						})]
					})

				message = _("This invoice has been created from the point of sale session: <a href=# data-oe-model=pos.order data-oe-id=%d>%s</a>") % (order.id, order.name)
				new_move.message_post(body=message)
				order.write({'account_move': new_move.id, 'state': 'invoiced'})
				new_move.sudo().with_company(order.company_id)._post()
				moves += new_move

		if not moves:
			return {}

		return {
			'name': _('Customer Invoice'),
			'view_mode': 'form',
			'view_id': self.env.ref('account.view_move_form').id,
			'res_model': 'account.move',
			'context': "{'move_type':'out_invoice'}",
			'type': 'ir.actions.act_window',
			'nodestroy': True,
			'target': 'current',
			'res_id': moves and moves.ids[0] or False,
		}




############################################################################################################
