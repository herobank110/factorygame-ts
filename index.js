import { BrowserInputHandler } from "./src/core/input_browser.js";
import { EKeys, EInputEvent } from "./src/core/input_base.js";

function fn() {
    document.body.innerText = "Just clicked!" + Math.floor(Math.random() * 100);
}

let a = new BrowserInputHandler();
a.bindToWidget(window);
let b = a._inputMappings;

b.addActionMapping("MoveForward", EKeys.W);
b.addActionMapping("Pickup", EKeys.Q);
b.addActionMapping("OpenDoor", EKeys.T);
b.addActionMapping("ShowRadar", EKeys.R);



b.bindAction("ShowRadar", EInputEvent.PRESSED, fn);





b.addActionMapping("Jump", EKeys.J, EKeys.U, EKeys.M, EKeys.P);
b.bindAction("Jump", EInputEvent.PRESSED, () => {
    document.body.innerText = "Just jumped!" + Math.floor(Math.random() * 100);
});
