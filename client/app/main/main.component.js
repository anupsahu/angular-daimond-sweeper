import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
    rows;
    columns;
    cell;
    daimonds;
    daimondCount;
    myClass = [];
    score = 0;
    scope;

    /*@ngInject*/
    constructor($scope) {
        'ngInject';
        this.scope = $scope;
        this.rows = 4;
        this.columns = 4;
        this.cell = 1;
        this.daimondCount = 5;
        this.init();

        //Watch to end game when all the diamonds are discovered
        this.scope.$watch(() => this.score, (nw) => {
            if (nw === this.daimondCount) {
                alert('Congrats');
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

    save = () => {
        if (this.score === this.daimondCount) {
            alert('Game is Over');
        } else {
            localStorage.setItem('diamonds', JSON.stringify(this.daimonds));
            localStorage.setItem('class', JSON.stringify(this.myClass));
            localStorage.setItem('score', this.score);
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
        this.score = JSON.parse(localStorage.getItem('score'))
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
        } else {
            alert("Game Over");
            this.init();
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