import { GameplayUtilities, Actor, GameplayStatics } from "./src/index.js";
import { FactoryEngine } from "./src/factoryEngine.js";

class TickingActor extends Actor {
    constructor() {
        super();
        this.tickCount = 0;
    }
    tick(deltaTime) {
        this.tickCount++;
        document.body.innerText = `Tick #${this.tickCount}, last frame time: ${deltaTime}`;
    }
}

function main() {
    GameplayUtilities.createGameEngine(FactoryEngine);
    GameplayStatics.world.spawnActor(TickingActor, [0, 0]);
}

main();
