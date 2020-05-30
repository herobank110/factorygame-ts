/** Utilities for working with gameplay mechanics. */

// ///<reference path="../core/engine_base.ts"/> // not working!!!
// seems circular references are OK... but only needed the types!!!
import { GameEngine, World } from "../core/engine_base.js";


/** Holds central information about the running game. */
export class GameplayStatics {

    /** Check whether the game engine is still valid. */
    public static isGameValid(): boolean {
        return (
            GameplayStatics._gameEngine !== null
            && GameplayStatics._world !== null
        );
    }

    // GameEngine

    private static _gameEngine: GameEngine;
    public static get gameEngine() { return GameplayStatics._gameEngine; }

    public static setGameEngine(value: GameEngine): void {
        GameplayStatics._gameEngine = value;
    }


    // World

    private static _world: World;
    public static get world() { return GameplayStatics._world }

    public static setWorld(value: World): void {
        GameplayStatics._world = value;
    }


    // Root window

    private static _window: Document;
    public static get rootWindow() { return this._window; }

    static setRootWindow(value: Document) {
        GameplayStatics._window = value;
    }
}
