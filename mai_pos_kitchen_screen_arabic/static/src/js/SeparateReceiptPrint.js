odoo.define('mai_pos_kitchen_screen_arabic.SeparateReceiptPrint', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const AbstractReceiptScreen = require('point_of_sale.AbstractReceiptScreen');

    const SeparateReceiptPrint = (AbstractReceiptScreen) =>
  		class extends AbstractReceiptScreen {
        async _printWeb() {
            try {
              var x = document.getElementsByClassName("pos-receipt");
              var dict = {};
              for (var i = 0; i < x.length; i++) {
                dict[i]=x[i];
              }
              if (document.getElementsByClassName("pos-receipt")[1]) {
                document.getElementsByClassName("pos-receipt")[1].outerHTML = "";
              }
              for(var key in dict) {
                  document.getElementsByClassName("pos-receipt")[0].outerHTML = dict[key].outerHTML;
                  window.print();
              }
              document.getElementsByClassName("pos-receipt")[0].outerHTML = dict["0"].outerHTML;
              for (var i = 1; i < Object.keys(dict).length; i++) {
                document.getElementsByClassName("pos-receipt")[0].outerHTML += dict[Object.keys(dict)[i]].outerHTML;
              }
                // window.print();
                return true;
            } catch (err) {
                await this.showPopup('ErrorPopup', {
                    title: this.env._t('Printing is not supported on some browsers'),
                    body: this.env._t(
                        'Printing is not supported on some browsers due to no default printing protocol ' +
                            'is available. It is possible to print your tickets by making use of an IoT Box.'
                    ),
                });
                return false;
            }
        }
  		}
  	Registries.Component.extend(AbstractReceiptScreen,SeparateReceiptPrint);


    return PosComponent;
});
