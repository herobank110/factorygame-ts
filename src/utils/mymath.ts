import { Loc } from "./loc.js";


export interface IIterable<T> {
    [Symbol.iterator](): Generator<T>;
}


/** Static math library. */
export class MathStat {
    // (DocFix???)
    public static clamp(val: number, min?: number, max?: number): number {
        if (min == undefined) min == 0;
        if (max == undefined) max == 1;
        return val < min ? min : val > max ? max : val;
    }

    /** returns what percent (0 to 1) val is between min and max.
     * eg: val of 15 from 10 to 20 will return 0.5 */
    public static getpercent(val: number, min: number, max: number): number {
        return (val - min) / (max - min);
    }

    /** returns val mapped from range(in_a to in_b) to range(out_a to out_b)
     * eg: 15 mapped from 10,20 to 1,100 returns 50 */
    public static mapRange(val: number, inA: number, inB: number, outA: number, outB: number): number {
        return MathStat.lerp(outA, outB,
            MathStat.getpercent(val, inA, inB), false);
    }

    /** returns val mapped from range(in_a to in_b) to range(out_a to out_b)
     * eg: 15 mapped from 10,20 to 1,100 returns 50 */
    public static mapRangeClamped(val: number, inA: number, inB: number, outA: number, outB: number): number {
        return MathStat.lerp(outA, outB,
            MathStat.clamp(MathStat.getpercent(val, inA, inB)), true);
    }


    /** returns interpolation between a and b. bias 0 = a, bias 1 = b.
     * also works with iterables by lerping each element of a and b
     * can also extrapolate if clamp is set to False
     * 
     * This version will lerp between two numbers.
     */
    public static lerp(a: number, b: number, bias: number, clamp?: boolean): number;

    /** Lerp components of two vectors, not the `ILoc` which accepts arrays.
     * 
     * @return A new Loc object.
     */
    public static lerp(a: Loc, b: Loc, bias: number, clamp?: boolean): Loc;

    /** Lerp numeric components of two iterable objects.
     * 
     * @return an new array.
     */
    public static lerp(a: IIterable<number>, b: IIterable<number>, bias: number, clamp?: boolean): Array<number>;

    /** Lerp hex codes. String must be formatted like: `"#rrggbb"`.
     * 
     * @return A new string in hex format `"#rrggbb"`. Returns `""` if format invalid.
     */
    public static lerp(a: string, b: string, bias: number, clamp?: boolean): string;

    public static lerp(a, b, bias, clamp) {
        let lerp1 = (a: number, b: number, bias: number) => a + (b - a) * bias;
        let crossIter = function*<T>(a: IIterable<T>, b: IIterable<T>): Generator<T[]> {
            const a_it = a[Symbol.iterator](), b_it = b[Symbol.iterator]();
            while (1) {
                const a_i = a_it.next(), b_i = b_it.next();
                if (a_i.done || b_i.done) return;
                yield [a_i.value, b_i.value];
            }
        };
        let crossIterStr = function* (a, b) {
            // format: '#rrggbb...' hex codes
            // yields integers rr, gg, bb, etc for a and b
            for (let i = 0; i < a.length; i++) {
                if (i % 2 === 1) // (Refactor???)
                    yield [parseInt(a.substring(i, 2), 16), parseInt(b.substring(i, 2), 16)];
            }
        };
        if (clamp)
            bias = MathStat.clamp(bias);
        if (!(a instanceof String)) {
            // lerp each element in iterable container
            let crossLerp = [];
            for (const [ax, bx] of crossIter(a as IIterable<number>, b)) {
                crossLerp.push(lerp1(ax, bx, bias));
            }

            if (a instanceof Loc) {
                return new Loc(crossLerp);
            } else {
                return crossLerp;
            }
        } else {
            // string hex code color lerp
            if (a instanceof String) {
                let retStr = "";
                for (const [ax, bx] of crossIterStr(a, b)) {
                    retStr += lerp1(ax, bx, bias).toString(16);
                }
                return retStr;
            }
            // simple lerp
            return lerp1(a, b, bias);
        }
    }
}
