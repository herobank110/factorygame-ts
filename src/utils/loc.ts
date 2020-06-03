/** No need to fully re-implement a simple vector! */

/** Structure for representing coordinates, with basic arithmetic.
 * 
 * Essentially a 3 dimensional vector.
 */
export class Loc extends THREE.Vector3 {

    public constructor(coordinates: Array<Number>);
    public constructor(x: Number, y: Number, z: Number);

    public constructor() {
        if (arguments[0] instanceof Array)
            super(...arguments[0]);
        else
            super(...arguments);
    }

    public toString(): string {
        return `(X=${this.x}, Y=${this.y},  Z=${this.z})`;
    }

    /** Return Loc with types (int or float) from repr string OTHER.
     * Example input is `(10.0, 5.0)`, not `(X=2, Y=30)`
     */
    public fromStr(other: string): Loc {
        other = other.trim();
        while (other.includes(" ")) other = other.replace(" ", "");
        other = other.replace("(", "").replace(")", "");
        let items = other.split(",");
        return new Loc(Number(items[0]), Number(items[1]), Number(items[2]));
    }
}
