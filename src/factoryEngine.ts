import { GameEngine } from "./index.js";
import { GameplayStatics } from "./utils/gameplay.js";

/** Game engine class for factories. */
export class FactoryEngine extends GameEngine {
    public constructor() {
        super();
        this._windowTitle = "FactoryGame";
        this._frameRate = 90; // has no effect in typescript version
        // this._startingWorld = World
    }

    public beginPlay() {
        GameplayStatics.rootWindow.document.body.innerText = "Hello world";
    }
}