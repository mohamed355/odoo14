# -*- coding: utf-8 -*-

{
    "name" : "POS Hide Client Button",
    "version" : "14.1.0",
    'category' : 'Sales/Point of Sale',
    "depends" : ['base','point_of_sale'],
    "author": "Ahmed Elmahdi",
    'summary': 'POS Hide Client Button',
    "price": 6,
    "currency": "EUR",
    "license": "LGPL-3",
    "description": """
POS Hide Client Button
Create Button
Edit Button
    """,
    "data": [
        'views/custom_config_view.xml',
    ],
    'qweb': [
        'static/src/xml/pos_extended.xml',
    ],
    "auto_install": False,
    "installable": True,
    # "images":['static/description/showHideButton.png'],
}
