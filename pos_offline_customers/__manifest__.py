# -*- coding: utf-8 -*-

{
    'name': 'POS Offline Customers',
    'version': '1.0',
    'category': 'Point of Sale',
    'sequence': 6,
    'author': 'ErpMstar Solutions',
    'summary': "Allows you to create customer in offline mode." ,
    'description': "Allows you to create customer in offline mode.",
    'depends': ['point_of_sale'],
    'data': [
        'views/views.xml',
        'views/templates.xml',
    ],
    'qweb': [
        'static/src/xml/pos.xml',
    ],
    'images': [
        'static/description/banner.jpg',
    ],
    'installable': True,
    'website': '',
    'auto_install': False,
    'price': 99,
    'currency': 'EUR',
}
