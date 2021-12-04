# -*- coding: utf-8 -*-

from odoo import fields, models,tools,api, _

class pos_config(models.Model):
    _inherit = 'pos.config' 
    
    allow_offline_customer = fields.Boolean("Allow Offline Customer")

class PosOrder(models.Model):
    _inherit = "pos.order"

    @api.model
    def _order_fields(self, ui_order):
        res = super(PosOrder, self)._order_fields(ui_order)
        partner_id = ui_order['partner_id'] or False
        if partner_id:
            partner = ui_order['parnter_obj']
            if partner.get('image_1920'):
                partner['image_1920'] = partner['image_1920'].split(',')[1]
            if len(str(partner_id)) < 13:
                partner_obj = self.env['res.partner'].search([('id','=',int(partner_id))])
            else:
                partner_obj = self.env['res.partner'].search([('pos_refrence_id','=',partner['pos_refrence_id'])])
            if 'id' in partner:
                del partner['id']
            if 'uid' in partner:
                del partner['uid']
            if 'address' in partner:
                del partner['address']
            if partner_obj:
                partner_obj[0].write(partner)
                res['partner_id'] = partner_obj[0].id
            else:
                partner['lang'] = self.env.user.lang
                res['partner_id'] = self.env['res.partner'].create(partner).id
        return res;



class ResPartner(models.Model):
    _inherit = 'res.partner'

    pos_refrence_id = fields.Char(string='Refrence Id')

    @api.model
    def create_from_ui2(self, partners):
        partner_ids = []
        for partner1 in partners:
            partner = partner1['data']
            if partner.get('image_1920'):
                partner['image_1920'] = partner['image_1920'].split(',')[1]
            partner_id = partner.pop('id', False)

            if len(str(partner_id)) < 10:
                partner_obj = self.env['res.partner'].search(['|',('id','=',int(partner_id)),('pos_refrence_id','=',partner['pos_refrence_id'])])
            else:
                partner_obj = self.env['res.partner'].search([('pos_refrence_id','=',partner['pos_refrence_id'])])
            if 'id' in partner:
                del partner['id']
            if 'uid' in partner:
                del partner['uid']
            if 'address' in partner:
                del partner['address']
            
            if partner_obj:
                partner_obj.write(partner)
            else:
                partner_obj = self.create(partner)
            partner_ids.append(partner_obj.id)
        return self.search_read(domain = [('id', 'in', partner_ids)], fields = ['id', 'pos_refrence_id'])
