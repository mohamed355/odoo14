# -*- coding: utf-8 -*-
#################################################################################

#################################################################################
{
  "name"                 :  "Pos Cash Control",
  "summary"              :  """POS Cash Control allows you to manage the cash controls in the running POS session""",
  "category"             :  "Point Of Sale",
  "version"              :  "1.0.0",
  "author"               :  "Qodoos",
  "license"              :  "Other proprietary",
  "website"              :  "www.qodoos.com",
  "description"          :  """Pos Cash Control
  Pos Cash Alert
  Manage Cash
  Cash Management
  Cash Control Management
  Cash Box Closing Balance
  Payments Pos Session
  Closing Cash
  Track Cash In Cash Out
  """,
  "live_test_url"        :  "http://odoodemo.webkul.com/?module=pos_cash_control&custom_url=/pos/auto",
  "depends"              :  ['point_of_sale'],
  "data"                 :  [
                             'security/ir.model.access.csv',
                             'views/template.xml',
                             'views/pos_config.xml',
                             'views/pos_cash_in_out.xml',
                            ],
  "qweb"                 :  [
                              'static/src/xml/pos.xml',
                            ],
  "images"               :  ['static/description/banner.gif'],
  "application"          :  True,
  "installable"          :  True,
  "auto_install"         :  False,
  "price"                :  49,
  "currency"             :  "USD",
  "pre_init_hook"        :  "pre_init_check",
}
