/** No need to fully re-implement a simple vector! */

// import * as THREE from "three";
var THREE = window.THREE;

/** Structure for representing coordinates, with basic arithmetic.
 * 
 * Essentially a 3 dimensional vector.
 */
export class Loc extends THREE.Vector3 {

    /** Sets X, Y, Z elements to zero. */
    public constructor();

    /** Constructs X, Y, Z elements individually. */
    public constructor(x: Number, y: Number, z: Number);
    
    /** Constructs X and Y elements to simulate a 2D vector. (Z will be zero.) */
    public constructor(x: Number, y: Number);

    /** Copy constructor. Sets X, Y, Z from Loc or array's elements. */
    public constructor(other: Loc | Array<Number>);

    public constructor() {
        if (arguments[0] instanceof Array)
            super(...arguments[0]);
        else if (arguments[0] instanceof Loc)
            super(...arguments[0]);
        else
            super(...arguments);
    }

    public *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }

    public toString(): string {
        return `(X=${this.x}, Y=${this.y},  Z=${this.z})`;
    }

    /** Return Loc with types (int or float) from repr string OTHER.
     * Example input is `(10.0, 5.0)`, not `(X=2, Y=30)`
     */
    public static fromStr(other: string): Loc {
        other = other.trim();
        while (other.includes(" ")) other = other.replace(" ", "");
        other = other.replace("(", "").replace(")", "");
        let items = other.split(",");
        return new Loc(Number(items[0]), Number(items[1]), Number(items[2]));
    }
}

/** Allows arrays to be passed as Loc.
 * 
 * You should still construct a Loc out of the parameter passed in as ILoc
 * to be sure it is an actual Loc object. This creates a copy if a Loc was
 * already passed in, so only use sparingly!
 * 
 * Example:
 * ```
 * fn(location: ILoc) {
 *     let l = new Loc(location); // Ensure it is a Loc.
 *     // code...
 * }
 * fn(new Loc(1, 2, 3));
 * fn([1, 2, 3]);
 * ```
 */
export type ILoc = Loc | Array<Number>;
