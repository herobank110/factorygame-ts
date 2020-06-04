/** Game engine for FactoryGame. */

import { GameplayStatics } from "../utils/gameplay.js";
import { EngineInputMappings } from "./input_base.js";
import { BrowserInputHandler } from "./input_browser.js";
import { Loc, ILoc } from "../utils/loc.js";


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
    public beginPlay(): void { }

    /**
     * Called before this object will be destroyed.
     */
    public beginDestroy(): void { }

}

/**
 * High level engine object that initialises other components when the
 * game is created.
 */
export class GameEngine extends EngineObject {

    public get WINDOW_TITLE() { return this._windowTitle; }
    public get FRAME_RATE() { return this._frameRate; } // in frames per second
    public get FRAME_TIME() { return Math.floor(1000 / this._frameRate); } // in miliseconds (Spelling???)

    /** Initialise game engine in widget MASTER. If omitted a new window is made. */
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
    public __initGameEngine__(master: Window): void {

        // Set central reference to game engine.
        GameplayStatics.setGameEngine(this);


        // Create/setup the game window.

        if (master === null) {
            // Create window for game. (Python???)
            this._window = window;
            this._window.document.head.title = this.WINDOW_TITLE;
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

        // Create GUI input receiver. (Python???)
        this._inputHandler = new BrowserInputHandler();
        this._inputHandler.bindToWidget(GameplayStatics.rootWindow);

        // Override in child game engines to set up the action mappings,
        // possibly from a config file. (MissingFeature???)
        this.setupInputMappings();


        // Create the starting world.

        if (this._startingWorld === null)
            // Choose default world if not specified.
            this._startingWorld = World;

        // try: (DocFix???)
        let world = new this._startingWorld();
        world.__initWorld__(this._window); // (Inconsistent??) above used GameplayStatics.rootWindow
        world.beginPlay();
    }

    /** Set up input mappings associated with a set of keys. */
    protected setupInputMappings(): void { }

    public get inputMappings() { return this._inputMappings; }


    // Typescript member variable declarations

    /** Name to use in window title. */
    protected _windowTitle: string;

    /** Number of times to update game per second. */
    protected _frameRate: number;

    /**
     * Class to use for initial world creation.
     * 
     * If omitted default world will be used.
     */
    protected _startingWorld: typeof World;
    protected _window: Window;  // | whatever electron calls a window
    private _inputMappings: EngineInputMappings;
    private _inputHandler: BrowserInputHandler;
}


/**
 * Manages all content that makes up a level as well as keeping
 * track of all dynamically spawned actors and triggering core
 * gameplay events such as tick.
 */


/** A type-safe way to pass classes. A default constructor must exist. */
interface TSubclassOf<T> { new(): T; };

export class World extends EngineObject {

    /** Set default values. */
    public constructor() {
        super();

        let tickingActorSet = new Map();
        for (let group = 0; group < ETickGroup.MAX; group++)
            tickingActorSet.set(group, new Set());
        this._tickingActors = tickingActorSet;

        this._actors = [];
        this._toDestroy = [];
        this._tkObj = null;
    }

    /** Initialise world with any active tkinter object TK_OBJ. (Python???) */
    public __initWorld__(tkObj: Window | HTMLElement): void {
        // Prepare for starting tick timer.
        this._tkObj = tkObj;
        this.__tryStartTickLoop();
    }

    /**
     * Attempt to initialise a new actor in this world, from start
     * to finish.
     * 
     * To have further control on the actor before it is gameplay ready,
     * use deferred_spawn_actor.
     * 
     * @param actorClass Class of actor to spawn (Spelling???) 
     * @param loc Location to spawn actor at.
     * @param ActorType Type of actor to spawn and return.
     * @return Spawned actor if successful, otherwise None
     */
    public spawnActor<T extends Actor>(actorClass: TSubclassOf<T>, loc: ILoc): T {
        return this.finishDeferredSpawnActor(this.deferredSpawnActor(actorClass, loc));
    }

    /**
     * Begin to initialise a new actor in this world, then allow
     * attributes to be set before finishing the spawning process.
     * 
     * Warning: It is not safe to call any gameplay functions (eg tick)
     * or anything involving the world because the actor is not officially
     * in the world yet.
     * 
     * @param actorClass class of actor to spawn
     * @param loc location to spawn actor at
     * @return initialised actor object if successful, otherwise None
     */
    public deferredSpawnActor<T extends Actor>(actorClass: TSubclassOf<T>, loc: ILoc): T {
        // validate actorClass to check it is valid (Spelling???)
        if (actorClass === null)
            return null;

        // initialise new actor object.
        let actorObject = new actorClass();
        actorObject.__spawn__(this, new Loc(loc));

        // return the newly created actor_object for further modification and
        // to pass in to finishDeferredSpawnActor
        return actorObject;
    }

    /**
     * Finish spawning an actor in this world, allowing gameplay
     * functions to safely begin for the actor.
     * 
     * @param actorObject initialised actor object to finish spawning
     * @return gameplay ready actor object if successful, otherwise None
     */
    public finishDeferredSpawnActor<T extends Actor>(actorObject: T): T {

        // validate actorObject to check it is valid
        if (actorObject === null)
            return null;

        // update world references
        actorObject._world = this;
        this._actors.push(actorObject);

        // Attach to scene so it can be rendered.
        // this.add(actorObject);

        // call begin play
        actorObject.beginPlay();

        // schedule ticks if necessary (DocFix???)
        // if actor_object.primary_actor_tick.start_with_tick_enabled:
        //     self.set_actor_tick_enabled(actor_object, True)

        // return the fully spawned actor for further use
        return actorObject;
    }


    /**
     * Attempt to start a tick loop.
     * 
     * @return Whether the tick loop was started successfully.
     */
    private __tryStartTickLoop(): boolean {
        if (!this._tkObj) // (Refactor???) use explicit null check
            return false;

        this._tickLoop();
        return true;
    }

    private _tickLoop(): void {
        throw new Error("Method not implemented.");
    }


    // Typescript member variable declarations.

    /** All spawned actors to receive tick events, grouped by tick priority. */
    _tickingActors: Map<ETickGroup, Set<Actor>>;

    /** All spawned actors in the world. */
    _actors: Array<Actor>;

    /** List of actors to destroy next tick. */
    _toDestroy: Array<Actor>;

    /** Tkinter object reference for tick loop timer. (Python???) */
    _tkObj: Window | HTMLElement;
}


///////////////////////////////////////////////////////////
// Start of tick data structures

/** Groups for ticking objects. Lower value groups are fired first. */
enum ETickGroup {
    ENGINE = 0,
    WORLD = 1,
    PHYSICS = 2,
    GAME = 3,
    UI = 4,

    MAX = 5
}

class FTickFunction { }

// End of tick data structures
///////////////////////////////////////////////////////////

class Actor extends EngineObject {

    public get world() { return this._world; }
    public get location() { return this._location; }
    public set location(value: ILoc) { this._location = new Loc(value); }


    /** Called when actor is spawned by world. Shouldn't be called directly. */
    public __spawn__(world: World, location: Loc) {

        this._world = world;
        this._location = location;

        // Register the tick function for this actor.
        let tickFunc = this.primaryActorTick;
        if (tickFunc !== undefined && tickFunc.canEverTick) {
            tickFunc.target = this;
            tickFunc.tickEnabled = tickFunc.startWithTickEnabled;
        }
    }


    // Typescript member variable declarations

    /** World actor is in. */
    private _world: World;

    /** Location of actor in world. */
    private _location: Loc;

    protected primaryActorTick: FTickFunction;
}
