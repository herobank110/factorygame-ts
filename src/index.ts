/**
 * This game engine is designed to let you create your own game engine.
 * Simply create a class derived from GameEngine and set property defaults
 * in the constructor. It is recommended that you also implement the
 * methods: `setup_input_mappings`.
 *
 * Use the GameplayUtilities helper class to initialise your game engine
 * by calling `create_game_engine` supplied by your game engine class.
 * Any object in the world, including abstract manager classes, should
 * inherit from from `Actor`. Actors must be spawned by the world's
 * `spawn_actor` method and destroyed by the world's `destroy_actor'
 * method.
 *
 * Actors receive vital gameplay methods including `begin_play`, `tick`
 * and `begin_destroy`. This helps tracking the lifetime of the actor,
 * though keep in mind memory management is performed by Python's GC.
 * It is highly recommended to use the `weakref` module to store actor
 * references to ensure that actors can be destroyed safely.
 */

// Import useful classes.

export { Actor, GameEngine } from "./core/engineBase.js";
export { Loc, ILoc } from "./utils/loc.js";
export { GameplayStatics, GameplayUtilities } from "./utils/gameplay.js";


// for typescript giving errors wanting to import three, when it should
// come from a CDN sourced on the HTML page, use this workaround.
// var THREE = window.THREE;
// When the script is loaded from the HTML page, that's where it goes.
// Although in the electron version we probably want to bundle it with the game.