'use strict';
const angular = require('angular');

/*@ngInject*/
export function configController(rows, columns, diamond, close, $element) {
    this.rows = rows;
    this.columns = columns;
    this.diamond = diamond;

    this.dismissModal = function() {
        var data = {
            rows: this.rows,
            columns: this.columns,
            diamond: this.diamond
        };

        //  Manually hide the modal using bootstrap.
        $element.modal('hide');
        close(data, 200); // close, but give 200ms for bootstrap to animate
    };
}

export default angular.module('daimondSweeperApp.config', [])
    .controller('configController', configController)
    .name;