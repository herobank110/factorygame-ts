/**
 * Input module for keyboard and mouse interations.
 * (Spelling???)
 *
 * All keyboard and mouse input events will be routed through the
 * engine first. Then custom events can be set up when these events
 * happen.
 */


import { GameplayStatics } from "../utils/gameplay.js";


export type InputActionCallback = () => void;


export class GameViewportClient { } // (Refactor???)

/** Holder for an input key. Should not be used directly, use EKeys instead. */
export interface FKey {
    readonly keyName: string;
    equals(other: FKey): boolean;
    // hash(): number; (Python???)
}


/** Private module level implementation of FKey. */
class FKey_Impl implements FKey {

    public constructor(keyName: string) {
        this.keyName = keyName;
    }

    equals(other: FKey): boolean {
        return this.keyName === other.keyName;
    }
    // hash(): number {
    //     return hash()
    // }
    
    public readonly keyName: string;
}


/** Enum of all input keys. */
export class EKeys {

    // Mouse keys

    public static readonly LeftMouseButton: FKey = new FKey_Impl("LeftMouseButton");
    public static readonly RightMouseButton: FKey = new FKey_Impl("RightMouseButton");
    public static readonly MiddleMouseButton: FKey = new FKey_Impl("MiddleMouseButton");

    // Currently thumb buttons aren't recognised by tkinter. (Python???)
    public static readonly ThumbMouseButton: FKey = new FKey_Impl("ThumbMouseButton");
    public static readonly ThumbMouseButton2: FKey = new FKey_Impl("ThumbMouseButton2");

    // Keyboard keys

    public static readonly A: FKey = new FKey_Impl("A");
    public static readonly B: FKey = new FKey_Impl("B");
    public static readonly C: FKey = new FKey_Impl("C");
    public static readonly D: FKey = new FKey_Impl("D");
    public static readonly E: FKey = new FKey_Impl("E");
    public static readonly F: FKey = new FKey_Impl("F");
    public static readonly G: FKey = new FKey_Impl("G");
    public static readonly H: FKey = new FKey_Impl("H");
    public static readonly I: FKey = new FKey_Impl("I");
    public static readonly J: FKey = new FKey_Impl("J");
    public static readonly K: FKey = new FKey_Impl("K");
    public static readonly L: FKey = new FKey_Impl("L");
    public static readonly M: FKey = new FKey_Impl("M");
    public static readonly N: FKey = new FKey_Impl("N");
    public static readonly O: FKey = new FKey_Impl("O");
    public static readonly P: FKey = new FKey_Impl("P");
    public static readonly Q: FKey = new FKey_Impl("Q");
    public static readonly R: FKey = new FKey_Impl("R");
    public static readonly S: FKey = new FKey_Impl("S");
    public static readonly T: FKey = new FKey_Impl("T");
    public static readonly U: FKey = new FKey_Impl("U");
    public static readonly V: FKey = new FKey_Impl("V");
    public static readonly W: FKey = new FKey_Impl("W");
    public static readonly X: FKey = new FKey_Impl("X");
    public static readonly Y: FKey = new FKey_Impl("Y");
    public static readonly Z: FKey = new FKey_Impl("Z");
}


/** Type of event that can occur on a given key. */
export enum EInputEvent {
    PRESSED = 0,
    RELEASED = 1,

    MAX = 2
}


/** Contains mappings between input events and functions to fire. */
export class EngineInputMappings {

    public constructor() {
        this._actionMappings = new Map();
        this._boundEvents = new Map();
    }

    /**
     * Add an action mapping to be called when input comes from keys.
     * 
     * @param inName Name of (existing) action mapping.
     * @param keys Keys to map to action name.
     */
    public addActionMapping(inName: string, ...keys: Array<FKey>): void {
        var keySet = this._actionMappings.get(inName);
        if (keySet !== undefined)
            // Needs to reassign returned set (Spelling???)
            keys.forEach((key) => { keySet.add(key); });

        else
            // Create a new set of keys.
            this._actionMappings.set(inName, new Set<FKey>(keys));
    }

    /** Remove an action mapping, including all keys that were previously
     * added to it.
     */
    public removeActionMapping(inName: string): void {
        this._actionMappings.delete(inName);
    }

    /**
     * Bind a function to an action defined in add_action_mapping.
     * 
     * @param actionName Name of existing action mapping.
     * @param keyEvent Key event to bind to.
     * @param func Function to call when input comes in.
     */
    public bindAction(
        actionName: string,
        keyEvent: EInputEvent,
        func: InputActionCallback
    ): void {
        //  Concatenate action name and key event.
        var binding = actionName + ":" + keyEvent;

        var funcSet = this._boundEvents.get(binding);
        if (funcSet !== undefined) {
            // Add to existing set.
            funcSet.add(func);
        } else {
            // Create a new set.
            var newSet = new Set<InputActionCallback>();
            newSet.add(func);
            this._boundEvents.set(binding, newSet);
        }
    }

    /**
     * Return a list of mappings that contain a given key.
     * 
     * @param key Key to search for.
     * @return List of corresponding mappings. (Python???)
     */
    public getMappingsForKey(key: FKey): Array<string> {
        var mappings = new Array<string>();
        this._actionMappings.forEach((keySet, mapping) => {
            if (keySet.has(key))
                mappings.push(mapping);
        });
        return mappings;
    }

    /**
     * Invoke all callables registered to a mapping. (Python???)
     * 
     * @param actionName Name of existing mapping.
     * @param keyEvent Type of key event.
     */
    public fireActionBindings(actionName: string, keyEvent: EInputEvent): void {
        const eventCode = actionName + ":" + keyEvent;
        const boundFuncs = this._boundEvents.get(eventCode);
        if (boundFuncs !== undefined)
            boundFuncs.forEach((func) => { func(); });
    }


    // Typescript member variable declaration.

    /** Mappings of actions to keys. Each action has a set of keys. */
    private _actionMappings: Map<string, Set<FKey>>;

    /** dictionary: keys -> action mapping CONCAT key_event : value -> set of callables
     * Functions to fire when relevant input is received. (DocFix???)
     */
    private _boundEvents: Map<string, Set<InputActionCallback>>;
}

/** Handle raw input from a GUI system to map it to an FKey */
export class GUIInputHandler {

    /** Set default values. */
    public constructor() {
        this._heldKeys = new Set<FKey>();
        this.beginPlay(); // (Refactor???)
    }

    private beginPlay(): void {
        // This is being called manually in the constructor, 
        // but once the engine module is refactored this will
        // be derived from EngineObject and it will be called
        // automatically when it is appropriate.
        this._inputMappings = GameplayStatics.gameEngine.inputMappings;
    }

    /**
     * Fire functions bound to action mappings that are bound
     * to the key.
     */
    private fireActionEvents(key: FKey, keyEvent: EInputEvent): void {
        // A single key could trigger several actions.
        var mappings = this._inputMappings.getMappingsForKey(key);
        mappings.forEach((actionName) => {
            // Fire events for each actions.
            this._inputMappings.fireActionBindings(actionName, keyEvent);
        });
    }

    /**
     * Called when a key press is received to fire bound events.
     * 
     * Only for action events (not axis events). (MissingFeature???)
     * 
     * @param inKey Key that was pressed.
     * @param keyEvent Type of event to occur.
     */
    protected registerKeyEvent(inKey: FKey, keyEvent: EInputEvent): void {
        switch (keyEvent) {
            case EInputEvent.PRESSED:
                if (this.heldKeys.has(inKey))
                    // Don't fire events repeatedly if already held.
                    return;
                this.fireActionEvents(inKey, EInputEvent.PRESSED);
                this.heldKeys.add(inKey);
                break;
            case EInputEvent.RELEASED:
                // Remove reference from held keys.
                this.fireActionEvents(inKey, EInputEvent.RELEASED);
                this.heldKeys.delete(inKey); // no throw guarantee
                break;
        }
    }

    public get heldKeys() { return this._heldKeys; }


    // Typescript member variable declarations

    /** Hold currently held buttons in a set. */
    private _heldKeys: Set<FKey>;
    private _inputMappings: EngineInputMappings;
}
