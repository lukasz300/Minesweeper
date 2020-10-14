import { Ui } from "./ui.js"
export class Reset extends Ui{

    resetButton = this.getElement(this.UiSelectors.resetButton);

    changeEmotion(emotion) {
        this.resetButton.querySelector('use').setAttribute('href', `./Assets/sprite.svg#${emotion}`)

    }


}