import {IButtonsDown} from './buttons-down';


export class KeyboardEventHandler {

    private readonly keyDownListener = (ev: KeyboardEvent) => this.onKeyDown(ev);
    private readonly keyUpListener = (ev: KeyboardEvent) => this.onKeyUp(ev);

    constructor(private readonly buttonDown: (button: keyof IButtonsDown) => void,
                private readonly buttonUp: (button: keyof IButtonsDown) => void) {

        document.addEventListener('keydown', this.keyDownListener);
        document.addEventListener('keyup', this.keyUpListener);
    }

    removeEventListeners(): void {
        document.removeEventListener('keydown', this.keyDownListener);
        document.removeEventListener('keyup', this.keyUpListener);
    }


    private onKeyDown({code}: KeyboardEvent): void {
        const button = keyToButton(code);
        if (button) {
            this.buttonDown(button);
        }
    }

    private onKeyUp({code}: KeyboardEvent): void {
        const button = keyToButton(code);
        if (button) {
            this.buttonUp(button);
        }
    }
}


function keyToButton(keyCode: string): keyof IButtonsDown | null {
    switch (keyCode) {

        case 'ArrowRight':
            return 'gbRight';

        case 'ArrowDown':
            return 'gbDown';

        case 'ArrowLeft':
            return 'gbLeft';

        case 'ArrowUp':
            return 'gbUp';

        case 'KeyX':
            return 'gbB';

        case 'KeyC':
            return 'gbA';

        case 'Enter':
            return 'gbSelect';

        case 'Space':
            return 'gbStart';

        default:
            return null;
    }
}
