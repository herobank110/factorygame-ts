/** Utilities for working with gameplay mechanics. */

// ///<reference path="../core/engine_base.ts"/> // not working!!!
// seems circular references are OK... but only needed the types!!!
import { GameEngine, World } from "../core/engineBase.js";


/** Holds central information about the running game. */
export class GameplayStatics {
    /** Clear all references to gameplay objects. */
    public static clearAll() {
        let cls = GameplayStatics;

        cls._gameEngine = null;
        cls._world = null;
    }

    /** Check whether the game engine is still valid. */
    public static isGameValid(): boolean {
        return (
            GameplayStatics._gameEngine !== null
            && GameplayStatics._world !== null
        );
    }

    // GameEngine

    private static _gameEngine: GameEngine = null;
    public static get gameEngine() { return GameplayStatics._gameEngine; }

    public static setGameEngine(value: GameEngine): void {
        GameplayStatics._gameEngine = value;
    }


    // World

    private static _world: World = null;
    public static get world() { return GameplayStatics._world }

    public static setWorld(value: World): void {
        GameplayStatics._world = value;
    }


    // Root window

    private static _window: Window = null;
    public static get rootWindow() { return this._window; }

    static setRootWindow(value: Window) {
        GameplayStatics._window = value;
    }
}
