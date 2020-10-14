import {Ui} from './ui.js';

export class Counter extends Ui{
    value=null;
    element=null;
    
    init(){
        this.element = this.getElement(this.UiSelectors.counter);
    }
    setValue(value){
        this.value=value;
        this.updateValue();
    }
    updateValue(){
        this.element.textContent = this.value;
    }

    increment(){
        this.value++;
        this.updateValue(); 
    }    
    decrement(){
        this.value--;
        this.updateValue(); 
    }    

}



