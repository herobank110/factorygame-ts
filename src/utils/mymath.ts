/** Static math library. */
class MathStat {
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
     * can also extrapolate if clamp is set to False */
    public static lerp<T>(a: T, b: T, bias: number, clamp?: boolean): T {
        let lerp1 = (a, b, bias) => a + (b-a) * bias;
        let crossIter = function* (a, b) {
            for (let i = 0; i < a.length; i++)
                yield [a[i], b[i]];
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
         
// TODO: Finish this function.
    }


}