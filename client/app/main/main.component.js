import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
import config from './config/config.controller';

export class MainController {
    rows;
    columns;
    cell = 1; //Default cell count starts from 1
    daimonds;
    daimondCount;
    myClass = [];
    score = 0;
    scope;
    ModalService;

    /*@ngInject*/
    constructor($scope, ModalService) {
        'ngInject';
        this.scope = $scope;
        this.ModalService = ModalService;
        this.rows = 3;
        this.columns = 3;
        this.cell = 1;
        this.daimondCount = 5;
        this.init();

        //Watch to end game when all the diamonds are discovered
        this.scope.$watch(() => this.score, (nw) => {
            if (nw === this.daimondCount) {
                swal({
                    title: "Good job!",
                    text: "Score - " + this.score,
                    icon: "success",
                    button: "Restart!",
                })
                this.init();
            }
        });
    }


    //Random number generator
    randomGenerator = (count) => {
        let arr = [];
        let min = 1;
        let max = this.rows * this.columns;
        while (arr.length < count) {
            var randomnumber = Math.floor(Math.random() * (max - min + 1)) + min;
            if (arr.indexOf(randomnumber) > -1) continue;
            arr[arr.length] = randomnumber;
        }
        return arr;
    }


    init = () => {
        this.daimonds = this.randomGenerator(this.daimondCount);
        console.log(this.daimonds);
        this.score = 0;
        for (var i = 0; i < (this.rows * this.columns); i++) {
            this.myClass[i] = 'unknown';
        }
    }

    config = () => {
        var that = this;
        this.ModalService.showModal({
            template: require("./config/config.html"),
            controller: "configController",
            controllerAs: 'vm',
            inputs: {
                rows: this.rows,
                columns: this.columns,
                diamond: this.daimondCount
            }
        }).then(function(modal) {
            // The modal object has the element built, if this is a bootstrap modal
            // you can call 'modal' to show it, if it's a custom modal just show or hide
            // it as you need to.
            modal.element.modal();
            modal.close.then(function(result) {
                that.rows = result.rows;
                that.columns = result.columns;
                that.daimondCount = result.diamond;

                that.init();
            });
        });
    }

    save = () => {
        if (this.score === this.daimondCount) {
            alert('Game is Over');
        } else {
            localStorage.setItem('diamonds', JSON.stringify(this.daimonds));
            localStorage.setItem('class', JSON.stringify(this.myClass));
            localStorage.setItem('score', this.score);

            let config = {
                rows: this.rows,
                columns: this.columns,
                diamond: this.diamond
            }

            localStorage.setItem('config', JSON.stringify(config));
        }
    }

    getRowNumber = (cell) => Math.ceil(cell / this.rows);

    getColumnNumber = (cell) => {
        let col = cell % this.columns;

        if (col === 0)
            col = this.columns;

        return col;
    }

    resume = () => {
        this.daimonds = JSON.parse(localStorage.getItem('diamonds'));
        this.myClass = JSON.parse(localStorage.getItem('class'));
        this.score = JSON.parse(localStorage.getItem('score'));
        let config = JSON.parse(localStorage.getItem('config'));

        this.rows = config.rows;
        this.columns = config.columns;
        this.daimondCount = config.diamond;
    }

    hint = (cell) => {
        let cellRow = this.getRowNumber(cell);
        let cellColumn = this.getColumnNumber(cell);

        let symbol = this.daimonds.map((diamond) => {
            let diamondRow = this.getRowNumber(diamond);
            let diamondColumn = this.getColumnNumber(diamond);
            let sym = ''; // Default Blank Symbol

            if (cellRow === diamondRow) {
                sym = cellColumn < diamondColumn ? 'fa fa-angle-right' : 'fa fa-angle-left';
            } else if (cellColumn === diamondColumn) {
                sym = cellRow < diamondRow ? 'fa fa-angle-down' : 'fa fa-angle-up';
            }

            return sym;
        })

        return symbol;
    }

    //Used to iterate ng-repeat as it only works
    //on array instead of an integer
    range = (num) => new Array(num);

    //Counter to know track clicks
    counter = () => this.cell++;

    check = (cell) => {
        console.log(cell);
        if (this.daimonds.length > 0) {
            if (_.includes(this.daimonds, cell)) {
                this.myClass[cell - 1] = 'diamond';
                this.score++;
                //removing the element to improve the hint functionality
                _.remove(this.daimonds, (n) => n === cell);
                console.log(this.daimonds);
            } else {

                //Condition added to remove the bug where if its already
                // a daimond and user clicks again it becomes blank
                if (this.myClass[cell - 1] != 'diamond')
                    this.myClass[cell - 1] = this.hint(cell);
            }
        }
    }
}

export default angular.module('daimondSweeperApp.main', [uiRouter, config])
    .config(routing)
    .component('main', {
        template: require('./main.html'),
        controller: MainController,
        controllerAs: 'vm'
    })
    .name;