/**
 * Input module for keyboard and mouse interations.
 * (Spelling???)
 *
 * All keyboard and mouse input events will be routed through the
 * engine first. Then custom events can be set up when these events
 * happen.
 */


import { GameplayStatics } from "../utils/gameplay.js";


/** Contains mappings between input events and functions to fire. */
export class EngineInputMappings {
    /** Mappings of actions to keys. Each action has a set of keys. */
    _actionMappings: {};

    /** dictionary: keys -> action mapping CONCAT key_event : value -> set of callables
     * Functions to fire when relevant input is received. (DocFix???)
     */
    _boundEvents: {};

    constructor() {
        this._actionMappings = {};
        this._boundEvents = {};
    }
}