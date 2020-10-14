import { Counter } from './counter.js';
import {Ui} from './ui.js'
export class Cell extends Ui{
    constructor(x,y){
        super();
        this.x = x;
        this.y = y;
        this.value = 0;
        this.isMine = false;
        this.isReveal = false;
        this.isFlaged = false;
        this.selector = `[data-x="${this.x}"][data-y="${this.y}"]`;
        this.element=null;

    }
createElement(){
    const element = `<div class="cell border border--concave" data-cell data-x=${this.x} data-y=${this.y}></div>`;
        return element;
    
    }
revealCell() {
    if(!this.isFlaged && !this.isReveal){
        this.isReveal = true;
        this.element.classList.remove('border--concave');
        this.element.classList.add('border--revealed');
        if(this.value && !this.isMine){
            this.element.textContent = this.value;
            this.element.classList.add(`text--colour-${this.value}`)
    }
    else{
        null;
        }
    }
}
    toggleFlag(){
        if(!this.isReveal) {
            this.isFlaged = !(this.isFlaged);    
            this.element.classList.toggle('cell--flag');
        }
    }
    addMine() {
        this.element.classList.add('cell--mined');
    }   

}