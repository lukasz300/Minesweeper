import {Ui} from './ui.js';
import {Cell} from './cols.js';
import {Counter} from './counter.js';
import {Timer} from './timer.js'
import {Reset} from './reset.js'
class Game extends Ui {
    config = {
        easy: {
            rows: 8,
            cols: 8,
            mines: 10
        },
        medium: {
            rows:16,
            cols:16,
            mines:40
        },
        hard: {
            rows:22,
            cols:22,
            mines:99
        },

    }
    numberOfCols = null;
    numberOfRows = null;
    numberOfMines = null;
    finish = false;
    modal = null;
    modalHeader = null;
    cells = [];
    cellsElements = [];
    counter = new Counter;
    timer = new Timer;
    revealedCells = 0;
    cellsToReaveal = 0;
    buttons = {
        modalMutton: null,
        easy: null,
        medium: null,
        hard: null,
        reset: new Reset(),
    }

    newGame(
        cols = this.config.easy.cols,
        rows = this.config.easy.rows,
        mines =this.config.easy.mines,
            )
        {
        this.numberOfRows = cols;
        this.numberOfCols = rows;
        this.numberOfMines = mines;
        this.generateCell();
        this.boardWidthHandler();
        this.handleElements();
        this.renderBoard(); 
        this.placeMine();
        this.addCellEventListener();
        this.counter.setValue(this.numberOfMines);
        this.timer.startTimer();
        this.buttonEventsListeners();
    }
    boardWidthHandler(){
        let gameBoard = document.querySelector(".game");
        gameBoard.style.maxWidth=`${3.6 + this.numberOfCols*4.0}rem`;
    }
    

    generateCell(){
        this.cells.length = 0;
        for(let row = 0; row < this.numberOfRows; row++){
            this.cells[row]=[];
            for(let col = 0; col < this.numberOfCols; col++){
                this.cells[row].push(new Cell(col,row));
            }
        }
        
    }
    renderBoard(){
        while (this.board.firstChild){
            this.board.removeChild(this.board.lastChild);
        }
        this.cells.flat().forEach(cell => {
            let item  = cell.createElement();
            this.board.insertAdjacentHTML('beforeend', item);
            cell.element = cell.getElement(cell.selector);   
        });
    }    

    placeMine() {
        let mineToPlace = this.numberOfMines;
        while(mineToPlace) {
            const rowIndex = this.getRandomNumber(0, this.numberOfRows - 1); 
            const colIndex = this.getRandomNumber(0, this.numberOfCols - 1); 
            const cell = this.cells[rowIndex][colIndex];
            if(!cell.isMine){
                cell.isMine = true; 
                mineToPlace--;
            }

        }

    }
    handleElements(){
        this.board = this.getElement(this.UiSelectors.board);   
        this.buttons.modal = this.getElement(this.UiSelectors.modalButton);
        this.buttons.easy = this.getElement(this.UiSelectors.easyButton);
        this.buttons.medium = this.getElement(this.UiSelectors.mediumButton);
        this.buttons.hard = this.getElement(this.UiSelectors.hardButton);
        this.modal = this.getElement(this.UiSelectors.modal);
        this.modalHeader = this.getElement(this.UiSelectors.modalHeader);
        this.modalButton = this.getElement(this.UiSelectors.modalButton);
    }   
    
    toggleFlag() {
        if(!this.isReveal) {
            this.isFlaged = !(this.isFlaged)    
            this.element.classList.toggle('cell--flag');
        }
        else(null);
        
        }
    
    addCellEventListener(){
        
        this.cellsElements = this.getElements(this.UiSelectors.cell);
        this.cellsElements.forEach((el) =>{
            el.addEventListener('mousedown', () => this.buttons.reset.changeEmotion('neutral'));
            el.addEventListener('mouseup', () => this.buttons.reset.changeEmotion('positive'));
            el.addEventListener('click', this.handleCellClick);
            el.addEventListener('contextmenu', this.handleCellContextmenu); 
            })
        }
    
    
    handleCellClick = (e) => {
        const target = e.target;
        const rowIndex = parseInt(target.getAttribute('data-y'),10);
        const colIndex = parseInt(target.getAttribute('data-x'),10);
        if(this.cells[rowIndex][colIndex].isMine){
            this.cells[rowIndex][colIndex].addMine();
            this.revealMine();
            this.buttons.reset.changeEmotion('negative')
            this.finishGame('fail');
        }
        else{  
            this.clickCell(this.cells[rowIndex][colIndex])
            this.cells[rowIndex][colIndex].revealCell();
            this.checkWinCondition();
            }
        }
    handleCellContextmenu = (e) => {
        e.preventDefault();
        const target = e.target;
        const rowIndex = parseInt(target.getAttribute('data-y'),10);
        const colIndex = parseInt(target.getAttribute('data-x'),10);
        if(!this.cells[rowIndex][colIndex].isFlaged && this.counter.value>0 && !this.cells[rowIndex][colIndex].isReveal){
            this.cells[rowIndex][colIndex].toggleFlag();
            this.counter.decrement();
        }
        else if(this.cells[rowIndex][colIndex].isFlaged){
            this.cells[rowIndex][colIndex].toggleFlag();
            this.counter.increment();
        }
        else(null)
    }    

    buttonEventsListeners(){
        this.buttons.easy.addEventListener('click', () => this.newGameHandler(this.config.easy));
        this.buttons.medium.addEventListener('click', () => this.newGameHandler(this.config.medium));
        this.buttons.hard.addEventListener('click', () => this.newGameHandler(this.config.hard));
        this.buttons.reset.resetButton.addEventListener('click', () => this.newGameHandler(this.config.easy));
        this.buttons.reset.resetButton.addEventListener('mousedown', () => this.buttons.reset.changeEmotion('neutral'));
        this.buttons.reset.resetButton.addEventListener('mouseup', () => this.buttons.reset.changeEmotion('positive'));
        this.modalButton.addEventListener('click', () => this.newGameHandler(this.config.easy));
    
    }   

    newGameHandler(config){
        this.timer.stopTimer();
        this.newGame(config.cols, config.rows, config.mines);
        this.modal.classList.add('modal--hiden');
        this.buttons.reset.changeEmotion('positive');
    }

    clickCell(cell){
        this.setCellValue(cell);
        cell.revealCell();
       
        
    }  
    setCellValue(cell){
        let minesCount = 0;
        for (let rowIndex = Math.max(cell.y - 1, 0); rowIndex <= Math.min(cell.y + 1, this.numberOfRows - 1); rowIndex++ ){
            for (let colIndex = Math.max(cell.x - 1, 0);  colIndex <= Math.min(cell.x + 1, this.numberOfCols - 1) ; colIndex++){
                if(this.cells[rowIndex][colIndex].isMine){
                    minesCount ++;
                }
            }  
        }
            
        cell.value = minesCount;
        if(!cell.value){
            for (let rowIndex = Math.max(cell.y - 1, 0); rowIndex <= Math.min(cell.y + 1, this.numberOfRows - 1); rowIndex++ ){
                for (let colIndex = Math.max(cell.x - 1, 0);  colIndex <= Math.min(cell.x + 1, this.numberOfCols - 1) ; colIndex++){
                    if(!this.cells[rowIndex][colIndex].isReveal){
                        cell.revealCell();
                        this.clickCell(this.cells[rowIndex][colIndex]); 
                    }
                }        
        
            }
        }
    }

    removeEventListener(){
        this.cellsElements = this.getElements(this.UiSelectors.cell);
        this.cellsElements.forEach((el) =>{
            el.removeEventListener('mousedown', () => this.buttons.reset.changeEmotion());
            el.removeEventListener('mouseup', () => this.buttons.reset.changeEmotion());
            el.removeEventListener('click', this.handleCellClick);
            el.removeEventListener('contextmenu', this.handleCellContextmenu); 
            })
    }

    checkWinCondition(){
        this.revealedCells = 0;
        this.cellsToReaveal = (this.numberOfCols * this.numberOfRows) - this.numberOfMines;
        this.cells.flat().forEach((el) => 
            {if (el.isReveal){  this.revealedCells++}});
        if(this.cellsToReaveal == this.revealedCells){
            this.finishGame('won');
        } 
        
        
    }

    finishGame(checkResult){
        this.finish = true;
        this.removeEventListener();
        this.modal.classList.remove('modal--hiden');
            if(checkResult=='won'){
                this.modalHeader.textContent='You won'
            }
            else{
                this.modalHeader.textContent='You lose try again'
            }
        }


    getRandomNumber(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    revealMine(){
        this.cells
        .flat()
        .filter(({isMine})=> isMine)
        .forEach((cell) => {
            cell.revealCell()
            cell.addMine();}
        );
    }

    initalizeGame() {
        this.counter.init();
        this.timer.init();   
        this.newGame();        
             
        }


}

window.onload = function () {
    const game = new Game();
    game.initalizeGame();
}