# -*- coding: utf-8 -*-
from odoo import api, fields, models, _

class ResPartnerBank(models.Model):

    _inherit = "res.partner.bank"

    iban_number = fields.Char()
