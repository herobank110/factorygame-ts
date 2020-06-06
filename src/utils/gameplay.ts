/** Utilities for working with gameplay mechanics. */

// ///<reference path="../core/engine_base.ts"/> // not working!!!
// seems circular references are OK... but only needed the types!!!
import { GameEngine, World, TSubclassOf, EngineObject } from "../core/engineBase.js";


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

export class GameplayUtilities {

    /**
     * Create new game engine instance. Only one game engine can
     * exist at a time. Will fail if one already exists.
     *
     * (DocFix???) params undocumented
     * @return a new game engine
     */
    public static createGameEngine<T extends GameEngine>(engineClass: TSubclassOf<T>, master?: Window): T {
        if (GameplayStatics.isGameValid())
            throw new Error("Attempted to create game engine when valid game engine already exists.");

        // Initialise to set default values.
        let engine = new engineClass();

        // Initialise game engine on base class.
        engine.__initGameEngine__(master);

        return engine;
    }

    /**
     * Completely close down the active engine and all currently
     * running processes, including all worlds and spawned actors.
     * 
     * Will not exit Javascript execution process.
     */
    public static closeGame(): void {
        if (GameplayStatics.isGameValid())
            GameplayStatics.gameEngine.closeGame();
    }

    /**
     * Create an EngineObject instance.
     * Requires GameEngine to be created.
     * (DocFix???) params undocumented
     */
    public static createEngineObject<T extends EngineObject>(objectClass: TSubclassOf<T>): T {
        if (!GameplayStatics.isGameValid())
            throw new Error(
                `Attempted to create engine object '${objectClass.name}' without valid game engine.`
            )

        // Call default constructor.
        // Should set up attributes with default values.
        let obj = new objectClass();

        // Call begin play.
        // Should start any gameplay actions.
        obj.beginPlay();

        // Return newly created engine object.
        return obj;
    }

    /**
     * Travel to the specified world.
     * 
     * Will invalidate old world and all existing actors.
     */
    public static travel<T extends World>(worldClass: TSubclassOf<T>): T {
        let oldWorld = GameplayStatics.world;
        if (oldWorld === null) return;

        // Will destroy all old actors
        oldWorld.beginDestroy();

        // Create new input bindings just in case old actors still exist. (Refactor???)
        // GameplayStatics.gameEngine.inputMappings._boundEvents = new Map();
        GameplayStatics.gameEngine.inputMappings.clearBoundEvents();

        let newWorld = new worldClass();
        newWorld.__initWorld__(GameplayStatics.rootWindow);
        GameplayStatics.setWorld(newWorld);
        newWorld.beginPlay();

        // Return newly created world
        return newWorld;

        // (DocFix???)
        // world = self._starting_world()
        // world.__init_world__(self._window)
        // GameplayStatics.set_world(world)
        // world.begin_play()
    }
}
