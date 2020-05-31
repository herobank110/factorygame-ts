/**
 * Take input from the browser web page and send engine input events.
 */

import { GUIInputHandler, EKeys, EInputEvent, FKey } from "./input_base.js";

type KeyMap = Map<string, FKey>;
type BrowserKeyMap = {
    pressFormat: string,
    releaseFormat: string,
    keys: KeyMap
};


// window.addEventListener("", )
// document.body.focus({""})



/** Handle input from web browser. */
export class BrowserInputHandler extends GUIInputHandler {
    private static readonly browserKeyMapping: Map<string, BrowserKeyMap> = new Map([
        ["mouse", {
            pressFormat: "mousedown",
            releaseFormat: "mouseup",
            keys: new Map([
                ["1", EKeys.LeftMouseButton],
                ["2", EKeys.MiddleMouseButton],
                ["3", EKeys.RightMouseButton],
                ["4", EKeys.ThumbMouseButton],
                ["5", EKeys.ThumbMouseButton2]
            ])
        }]
        // ["keyboard", {
        //     pressFormat: ""
        // }]
    ]);

    /** Setup input events for a window.
     * 
     * This could be the 'real' window or an iframe.
     */
    public bindToWindow(inWindow: Window): void {
        var document = inWindow.document;
        // Prevent right click context menu
        inWindow.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        // These bindings will prevent the default action so other
        // handlers may not work. You can still safely bind to 'click'
        // events or 'keypress' events instead.

        // TODO: Also set focus on mouse presses

        const mouseMapping = BrowserInputHandler.browserKeyMapping.get("mouse");
        inWindow.addEventListener(mouseMapping.pressFormat, (event: MouseEvent) => {
            event.preventDefault();
            const key = mouseMapping.keys.get(event.button.toString());
            if (key !== undefined)
                this.registerKeyEvent(key, EInputEvent.PRESSED);
        });
        inWindow.addEventListener(mouseMapping.releaseFormat, (event: MouseEvent) => {
            event.preventDefault();
            const key = mouseMapping.keys.get(event.button.toString());
            if (key !== undefined)
                this.registerKeyEvent(key, EInputEvent.RELEASED);
        });
    }
}





document.addEventListener("contextmenu", (event) => { event.preventDefault(); })

document.querySelector("button").addEventListener("click", () => {
    window.focus();
    //document.body.focus();
    document.querySelector("#test").innerText = "button click";

})
//dd
