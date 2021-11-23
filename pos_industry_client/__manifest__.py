# -*- coding: utf-8 -*-
#################################################################################
#################################################################################
{
  "name"                 :  "POS industry_client",
  "category"             :  "Point Of Sale",
  "version"              :  "1.1.1",
  "sequence"             :  1,
  "license"              :  "Other proprietary",
  "depends"              :  ['pos_orders'],
  "data"                 :  [
                             'views/pos_view.xml',
                             'views/template.xml',
                            ],
  "application"          :  True,
  "installable"          :  True,
  "auto_install"         :  False,
  "price"                :  22,
  "currency"             :  "USD",
}
