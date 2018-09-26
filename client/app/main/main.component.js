import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
    rows;
    columns;
    cell;
    daimonds;
    myClass = [];
    /*@ngInject*/
    constructor() {
        this.rows = 8;
        this.columns = 8;
        this.cell = 1;

        this.init();
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
        this.daimonds = this.randomGenerator(5);
        console.log(this.daimonds);
        for (var i = 0; i < (this.rows * this.columns); i++) {
            this.myClass[i] = 'unknown';
        }
    }

    //Used to iterate ng-repeat as it only works
    //on array instead of an integer
    range = (num) => new Array(num);

    //Counter to know track clicks
    counter = () => this.cell++;

    check = (cell) => {
        console.log(cell);
        if (_.includes(this.daimonds, cell)) {
            this.myClass[cell - 1] = 'diamond';

            //removing the element to improve the hint functionality
            _.remove(this.daimonds, (n) => n === cell);
            console.log(this.daimonds);
        } else {

            //Condition added to remove the bug where if its already
            // a daimond and user clicks again it becomes blank
            if (this.myClass[cell - 1] != 'diamond')
                this.myClass[cell - 1] = '';
        }
    }
}

export default angular.module('daimondSweeperApp.main', [uiRouter])
    .config(routing)
    .component('main', {
        template: require('./main.html'),
        controller: MainController,
        controllerAs: 'vm'
    })
    .name;