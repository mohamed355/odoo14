# -*- coding: utf-8 -*-
#################################################################################
#################################################################################
{
  "name"                 :  "POS All Orders List",
  "summary"              :  """The module shows the list of orders placed in a Odoo POS screen. The user can also view previous orders from one customers in running POS session""",
  "category"             :  "Point of Sale",
  "version"              :  "1.0",
  "sequence"             :  1,
  "author"               :  "Qodoos",
  "license"              :  "Other proprietary",
  "website"              :  "www.qodoos.com",
  "description"          :  """Odoo POS All Orders List
Customer orders list
All POS orders
POS order list
POS Customers orders
Reorder list
POS Load previous orders
Past orders pos
Pos past orders
Orders POS session""",
  "live_test_url"        :  "http://odoodemo.webkul.com/?module=pos_orders&custom_url=/pos/auto",
  "depends"              :  ['point_of_sale'],
  "data"                 :  [
                             'views/pos_config_view.xml',
                             'views/template.xml',
                            ],
  "demo"                 :  ['data/pos_orders_demo.xml'],
  "qweb"                 :  ['static/src/xml/pos_orders.xml'],
  "images"               :  ['static/description/Banner.png'],
  "application"          :  True,
  "installable"          :  True,
  "auto_install"         :  False,
  "price"                :  27,
  "currency"             :  "USD",
  "pre_init_hook"        :  "pre_init_check",
}