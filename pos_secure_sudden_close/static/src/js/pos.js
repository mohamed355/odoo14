odoo.define('pos_secure_sudden_close', function (require) {
"use strict";

    const Chrome = require('point_of_sale.Chrome');
    const Registries = require('point_of_sale.Registries');

    const PosResChrome = (Chrome) =>
        class extends Chrome {
            get startScreen() {
                var leave_message = 'You sure you want to leave?'
                function goodbye(e) {
                    if(!e) e = window.event;
                    e.cancelBubble = true;
                    e.returnValue = leave_message;
                    if (e.stopPropagation){
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    return leave_message;
                } 
                window.onbeforeunload=goodbye;
                console.log("Leave functionlity is loaded");
                return super.startScreen;
            }
        }

    Registries.Component.extend(Chrome, PosResChrome);
});
