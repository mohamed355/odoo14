# -*- coding: utf-8 -*-
#################################################################################
#################################################################################
{
  "name"                 :  "POS Order Return",
  "summary"              :  """This module is use to Return orders in running point of sale session.""",
  "category"             :  "Point Of Sale",
  "version"              :  "1.1.1",
  "sequence"             :  1,
  "author"               :  "Qodoos",
  "license"              :  "Other proprietary",
  "website"              :  "www.qodoos.com",
  "description"          :  """http://webkul.com/blog/pos-order-return/""",
  "live_test_url"        :  "http://odoodemo.webkul.com/?module=pos_order_return&custom_url=/pos/auto",
  "depends"              :  ['pos_orders'],
  "data"                 :  [
                             'views/pos_order_return_view.xml',
                             'views/template.xml',
                            ],
  "qweb"                 :  ['static/src/xml/pos_order_return.xml'],
  "images"               :  ['static/description/Banner.png'],
  "application"          :  True,
  "installable"          :  True,
  "auto_install"         :  False,
  "price"                :  22,
  "currency"             :  "USD",
  "pre_init_hook"        :  "pre_init_check",
}
