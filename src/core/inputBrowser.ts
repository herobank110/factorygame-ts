/**
 * Take input from the browser web page and send engine input events.
 */


import { GUIInputHandler, EKeys, EInputEvent, FKey } from "./inputBase.js";
import { GameplayStatics } from "../utils/gameplay.js";


type KeyMap = Map<string, FKey>;
type BrowserKeyMap = {
    pressFormat: string,
    releaseFormat: string,
    keys: KeyMap
};


/** Handle input from web browser. */
export class BrowserInputHandler extends GUIInputHandler {
    private static readonly browserKeyMapping: Map<string, BrowserKeyMap> = new Map([
        ["mouse", {
            pressFormat: "mousedown",
            releaseFormat: "mouseup",
            keys: new Map([
                ["0", EKeys.LeftMouseButton],
                ["1", EKeys.MiddleMouseButton],
                ["2", EKeys.RightMouseButton],
                ["3", EKeys.ThumbMouseButton],
                ["4", EKeys.ThumbMouseButton2]
            ])
        }],

        ["keyboard", {
            pressFormat: "keydown",
            releaseFormat: "keyup",
            keys: new Map([
                ["KeyA", EKeys.A],
                ["KeyB", EKeys.B],
                ["KeyC", EKeys.C],
                ["KeyD", EKeys.D],
                ["KeyE", EKeys.E],
                ["KeyF", EKeys.F],
                ["KeyG", EKeys.G],
                ["KeyH", EKeys.H],
                ["KeyI", EKeys.I],
                ["KeyJ", EKeys.J],
                ["KeyK", EKeys.K],
                ["KeyL", EKeys.L],
                ["KeyM", EKeys.M],
                ["KeyN", EKeys.N],
                ["KeyO", EKeys.O],
                ["KeyP", EKeys.P],
                ["KeyQ", EKeys.Q],
                ["KeyR", EKeys.R],
                ["KeyS", EKeys.S],
                ["KeyT", EKeys.T],
                ["KeyU", EKeys.U],
                ["KeyV", EKeys.V],
                ["KeyW", EKeys.W],
                ["KeyX", EKeys.X],
                ["KeyY", EKeys.Y],
                ["KeyZ", EKeys.Z],
                ["Digit1", EKeys.One],
                ["Digit2", EKeys.Two],
                ["Digit3", EKeys.Three],
                ["Digit4", EKeys.Four],
                ["Digit5", EKeys.Five],
                ["Digit6", EKeys.Six],
                ["Digit7", EKeys.Seven],
                ["Digit8", EKeys.Eight],
                ["Digit9", EKeys.Nine],
                ["Digit0", EKeys.Zero],
                ["Tab", EKeys.Tab],
                ["CapsLock", EKeys.CapsLock],
                ["ShiftLeft", EKeys.LeftShift],
                ["ControlLeft", EKeys.LeftControl],
                ["AltLeft", EKeys.LeftAlt],
                ["Space", EKeys.SpaceBar],
                ["AltRight", EKeys.RightAlt],
                ["ControlRight", EKeys.RightControl],
                ["ShiftRight", EKeys.RightShift],
                ["Enter", EKeys.Enter],
                ["Backspace", EKeys.Backspace],
                ["Equals", EKeys.Equals],
                ["Minus", EKeys.Minus],
                ["Escape", EKeys.Escape],
                ["ArrowUp", EKeys.UpArrow],
                ["ArrowDown", EKeys.DownArrow],
                ["ArrowLeft", EKeys.LeftArrow],
                ["ArrowRight", EKeys.RightArrow],
                ["ArrowRight", EKeys.RightArrow],
            ])
        }]
    ]);

    /** Setup input events for a widget. */
    public bindToWidget(inWidget: Window | HTMLElement): void {
        // Bind mouse events.
        let mouseBindings = BrowserInputHandler.browserKeyMapping.get("mouse");
        if (mouseBindings !== undefined) {
            let pressFormat = mouseBindings.pressFormat;
            let releaseFormat = mouseBindings.releaseFormat;
            let keys = mouseBindings.keys;

            inWidget.addEventListener(pressFormat, (event: MouseEvent) => {
                this.onInput(event, keys, event.button.toString(), EInputEvent.PRESSED);
                inWidget.focus();  // Set keyboard focus when clicking on the game window.
            });

            inWidget.addEventListener(releaseFormat, (event: MouseEvent) => {
                this.onInput(event, keys, event.button.toString(), EInputEvent.RELEASED);
            });
        }

        // Bind keyboard events.
        let keyboardBindings = BrowserInputHandler.browserKeyMapping.get("keyboard");
        if (keyboardBindings !== undefined) {
            let pressFormat = keyboardBindings.pressFormat;
            let releaseFormat = keyboardBindings.releaseFormat;
            let keys = keyboardBindings.keys;

            inWidget.addEventListener(pressFormat, (event: KeyboardEvent) => {
                this.onInput(event, keys, event.code, EInputEvent.PRESSED);
            });

            inWidget.addEventListener(releaseFormat, (event: KeyboardEvent) => {
                this.onInput(event, keys, event.code, EInputEvent.RELEASED);
            });
        }

        // Prevent right click context menu if desired.
        if (GameplayStatics.isGameValid() && GameplayStatics.gameEngine.ALLOW_CONTEXT_MENU) {
            inWidget.addEventListener("contextmenu", (event) => {
                event.preventDefault();
            });
        }
    }

    /**
     * Process generic browser input events and send to the engine.
     * 
     * These bindings won't prevent the default action so other
     * handlers may not work. You can still safely bind to 'click'
     * events or 'keypress' events instead.
     */
    private onInput(event: Event, keys: KeyMap, formatArg: string, inputEvent: EInputEvent) {
        let key = keys.get(formatArg);
        if (key !== undefined)
            this.registerKeyEvent(key, inputEvent);
        // event.preventDefault();
    }
}
