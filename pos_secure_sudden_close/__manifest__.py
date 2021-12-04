# -*- coding: utf-8 -*-

{
    'name': 'Secure Pos From Sudden Close',
    'version': '1.0',
    'category': 'Point of Sale',
    'sequence': 6,
    'author': 'ErpMstar Solutions',
    'summary': "Allows you to protect your POS from sudden browser close." ,
    'description': "Allows you to protect your POS from sudden browser close.",
    'depends': ['point_of_sale'],
    'data': [
        # 'security/ir.model.access.csv',
        # 'views/views.xml',
        'views/templates.xml'
    ],
    'qweb': [
        # 'static/src/xml/pos.xml',
    ],
    'images': [
        'static/description/banner.jpg',
    ],
    'installable': True,
    'website': '',
    'auto_install': False,
    'price': 25,
    'currency': 'EUR',
}
