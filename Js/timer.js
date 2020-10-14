import {Ui} from './ui.js';

export class Timer extends Ui{
    element = null;
    curentTime = 0;
    maxTime = 999;
    gameOver = false;

init() {
    this.element = this.getElement(this.UiSelectors.timer);
}
startTimer(){
    this.interval = setInterval(() => this.updateTimer() ,1000);
    }
    

updateTimer(){
    this.curentTime++;
    this.element.textContent = this.curentTime;
        if(this.curentTime == this.maxTime || this.gameOver){
            clearInterval(this.interval);
        }
    }

    stopTimer(){
        this.curentTime = 0;
        clearInterval(this.interval);
    }
}
