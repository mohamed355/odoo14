{
    'name': 'Saudi Arabia Electronic Invoicing',

    'version': '14.0.1',

    'category': '',

    'summary': 'Saudi Arabia Electronic Invoicing',

    "description": """ Saudi Arabia Electronic Invoicing """,

    'author': 'Mohab Ahmed Hamed',

    'website': '',

    'depends': ['base', 'account', 'base_address_city','base_address_extended'],

    'data': [
        'reports/report_header.xml',
        'reports/report.xml',
        'reports/report_action.xml',
        'views/account_move.xml',
        'views/res_partner_bank.xml',
        'views/res_bank.xml',
    ],
}
