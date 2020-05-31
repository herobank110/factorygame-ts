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

    /** Setup input events for a widget. */
    bindToDocument(inDocument: Document): void {

        inDocument.addEventListener("mousedown", (event) => {
            // event.preventDefault();
            // const key = browserKeyMapping.get(event.button.toString());
            // this.registerKeyEvent(key, EInputEvent.PRESSED);
        })
    }
}
