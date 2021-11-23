# -*- coding: utf-8 -*-
# Part of BrowseInfo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models, api, _, tools
from datetime import date, time, datetime
import psycopg2
import logging
_logger = logging.getLogger(__name__)

class PosConfig(models.Model):
	"""docstring for PosConfig."""
	_inherit = 'pos.config'

	industry_id = fields.Many2many('res.partner.industry', string='Industry',help='If left empty, all Industry will show in the PoS session')



# 
# class res_partner(models.Model):
# 	_inherit = 'res.partner'
#
# 	industry_id = fields.Many2one('res.partner.industry', string='Industry')
#
#



############################################################################################################
