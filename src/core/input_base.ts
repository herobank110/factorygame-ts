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


export class GameViewportClient {} // (Refactor???)

/** Holder for an input key. Should not be used directly, use EKeys instead. */
export interface FKey {
    readonly keyName: string;
    equals(other: FKey): boolean;
    // hash(): number; (Python???)
}


/** Private module level implementation of FKey. */
class FKey_Impl implements FKey {
    public readonly keyName: string;

    public constructor(keyName: string) {
        this.keyName = keyName;
    }

    equals(other: FKey): boolean {
        return this.keyName === other.keyName;
    }
    // hash(): number {
    //     return hash()
    // }
}


/** Enum of all input keys. */
export class EKeys {

    // Mouse keys

    static readonly LeftMouseButton: FKey = new FKey_Impl("LeftMouseButton");
    static readonly RightMouseButton: FKey = new FKey_Impl("RightMouseButton");
    static readonly MiddleMouseButton: FKey = new FKey_Impl("MiddleMouseButton");

    // Currently thumb buttons aren't recognised by tkinter.
    static readonly ThumbMouseButton: FKey = new FKey_Impl("ThumbMouseButton");
    static readonly ThumbMouseButton2: FKey = new FKey_Impl("ThumbMouseButton2");

    // Keyboard keys

    static readonly A: FKey = new FKey_Impl("A");
    static readonly B: FKey = new FKey_Impl("B");
    static readonly C: FKey = new FKey_Impl("C");
    static readonly D: FKey = new FKey_Impl("D");
    static readonly E: FKey = new FKey_Impl("E");
    static readonly F: FKey = new FKey_Impl("F");
    static readonly G: FKey = new FKey_Impl("G");
    static readonly H: FKey = new FKey_Impl("H");
    static readonly I: FKey = new FKey_Impl("I");
    static readonly J: FKey = new FKey_Impl("J");
    static readonly K: FKey = new FKey_Impl("K");
    static readonly L: FKey = new FKey_Impl("L");
    static readonly M: FKey = new FKey_Impl("M");
    static readonly N: FKey = new FKey_Impl("N");
    static readonly O: FKey = new FKey_Impl("O");
    static readonly P: FKey = new FKey_Impl("P");
    static readonly Q: FKey = new FKey_Impl("Q");
    static readonly R: FKey = new FKey_Impl("R");
    static readonly S: FKey = new FKey_Impl("S");
    static readonly T: FKey = new FKey_Impl("T");
    static readonly U: FKey = new FKey_Impl("U");
    static readonly V: FKey = new FKey_Impl("V");
    static readonly W: FKey = new FKey_Impl("W");
    static readonly X: FKey = new FKey_Impl("X");
    static readonly Y: FKey = new FKey_Impl("Y");
    static readonly Z: FKey = new FKey_Impl("Z");
}


/** Type of event that can occur on a given key. */
export enum EInputEvent {
    PRESSED = 0,
    RELEASED = 1,

    MAX = 2
}


/** Contains mappings between input events and functions to fire. */
export class EngineInputMappings {
    /** Mappings of actions to keys. Each action has a set of keys. */
    _actionMappings: Map<string, Set<FKey>>;

    /** dictionary: keys -> action mapping CONCAT key_event : value -> set of callables
     * Functions to fire when relevant input is received. (DocFix???)
     */
    _boundEvents: Map<string, Set<InputActionCallback>>;

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
        const eventCode = actionName + "." + keyEvent;
        const boundFuncs = this._boundEvents.get(eventCode);
        if (boundFuncs !== undefined)
            boundFuncs.forEach((func) => { func(); });
    }
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
     * @param rawKey Key that was pressed.
     * @param inputEvent Type of event to occur.
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
