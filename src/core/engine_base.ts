/** Game engine for FactoryGame. */

import { GameplayStatics } from "../utils/gameplay.js";
import { EngineInputMappings } from "./input_base.js";


/**
 * Low level implementation of EngineObjectBase, should not be used directly
 * in game code.
 */
class EngineObjectBase { }


/**
 * Base object for all Engine objects. Provides basic gameplay functions
 * that can be overridden in children.
 */
export class EngineObject extends EngineObjectBase {

    /**
     * Called when this object has been successfully initialised
     * and it is safe to call gameplay functions from this point on
     */
    beginPlay() { }

    /**
     * Called before this object will be destroyed.
     */
    beginDestroy() { }

}

/**
 * High level engine object that initialises other components when the
 * game is created.
 */
export class GameEngine extends EngineObject {

    /** Name to use in window title. */
    protected _windowTitle: string;

    /** Number of times to update game per second. */
    protected _frameRate: number;

    /**
     * Class to use for initial world creation.
     * 
     * If omitted default world will be used.
     */
    protected _startingWorld: World;
    protected _window: Document;  // | whatever electron calls a window
    private _inputMappings: EngineInputMappings;

    /** Getter for _windowTitle. */
    public get WINDOW_TITLE(): string { return this._windowTitle; }
    /** Getter for _frameRate. */
    public get FRAME_RATE(): number { return this._frameRate; }
    public get FRAME_TIME(): number { return Math.floor(1000 / this._frameRate); }

    /**
     * Initialise game engine in widget MASTER. If omitted a new window is made.
     */
    constructor() {
        super();
        this._windowTitle = "engine_base";
        this._frameRate = 30;
        this._startingWorld = null;
    }

    /**
     * Create the game engine. Shouldn't be called directly, call
     * from GameplayUtilities instead.
     */
    public __initGameEngine__(master: Document) {
        // Set central reference to game engine.
        GameplayStatics.setGameEngine(this);

        // Create/setup the game window.
        if (master === null) {
            // Create window for game.
            this._window = document;
            this._window.head.title = this._windowTitle;
        } else {
            // Use an existing window.
            // Doesn't guarantee that it is a Toplevel widget. (Python???)
            this._window = master;
        }

        // Set reference to the window.
        GameplayStatics.setRootWindow(this._window);


        // Create input binding objects.

        // TODO: There needs to be a safer way to instantiate EngineObjects (Done???)

        // Let action mappings be added.
        this._inputMappings = new EngineInputMappings();
        var a = GameplayStatics.world;

        // Create GUI input receiver.
        // (Python???)
        // this._inputHandler = new TkInputHandler();
        // this._inputHandler.bindToWidget(GameplayStatics.rootWindow);

    }

}

export class World extends EngineObject { }
