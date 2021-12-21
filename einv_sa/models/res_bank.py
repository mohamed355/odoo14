# -*- coding: utf-8 -*-
from odoo import api, fields, models, _

class ResBank(models.Model):

    _inherit = "res.bank"

    swift_code = fields.Char()
