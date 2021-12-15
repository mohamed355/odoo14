
from odoo import models, fields, api

class POSConfigInherit(models.Model):
    _inherit = 'pos.config'

    allow_qr_code = fields.Boolean(string="Add QR Code in Receipt",default=True)

class POSOrderInherit(models.Model):
    _inherit = 'pos.order'

    qr_code = fields.Char(string="QR Code")

    def _order_fields(self,ui_order):
        data = super(POSOrderInherit,self)._order_fields(ui_order)
        print(ui_order)
        data.update({
            'qr_code': ui_order.get('qr_code') or False
        })
        print(data)
        return data
