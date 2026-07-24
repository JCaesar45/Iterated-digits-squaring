// iteratedSquare.ts
// TypeScript Implementation — Digital Baroque Engine
// Strict mode with exhaustive type safety and generics

/**
 * Represents the final convergence state of the iterated square process.
 * Only two possible terminal values exist: 1 or 89.
 */
type ConvergenceValue = 1 | 89;

/**
 * Result of the iterated square computation.
 */
interface IteratedSquareResult {
    /** The final convergence value (1 or 89) */
    readonly finalValue: ConvergenceValue;
    /** Complete path from input to convergence */
    readonly path: readonly number[];
    /** Number of steps to reach convergence */
    readonly steps: number;
}

/**
 * Pure function implementing the iterated digit square sum algorithm.
 * 
 * Mathematical basis: Every natural number under repeated digit-square
 * summation eventually reaches either 1 or 89. This is a deterministic
 * process related to the concept of "happy numbers" generalized.
 * 
 * @param n - Natural number input (must be integer > 0)
 * @returns IteratedSquareResult containing convergence value and path
 * @throws {RangeError} If input is not a positive integer
 * 
 * @see Guy, R. K. (2004). Unsolved Problems in Number Theory (3rd ed.). Springer.
 */
function iteratedSquare(n: number): IteratedSquareResult {
    if (!Number.isInteger(n) || n < 1) {
        throw new RangeError(
            `iteratedSquare: Expected a natural number (positive integer), received ${n}`
        );
    }

    const path: number[] = [n];
    let current: number = n;

    // Precomputed squares 0-9 for O(1) digit lookup
    const DIGIT_SQUARES: ReadonlyArray<number> = [0, 1, 4, 9, 16, 25, 36, 49, 64, 81];

    while (current !== 1 && current !== 89) {
        let sum = 0;
        let temp = current;

        // Arithmetic digit extraction — avoids string allocation
        while (temp > 0) {
            const digit = temp % 10;
            sum += DIGIT_SQUARES[digit];
            temp = Math.floor(temp / 10);
        }

        current = sum;
        path.push(current);
    }

    return {
        finalValue: current as ConvergenceValue,
        path: Object.freeze([...path]),
        steps: path.length - 1,
    };
}

/**
 * Memoized variant for batch computation efficiency.
 * Caches intermediate results to avoid redundant calculations.
 */
function createMemoizedIteratedSquare(): (n: number) => IteratedSquareResult {
    const cache = new Map<number, ConvergenceValue>();

    return function memoizedIteratedSquare(n: number): IteratedSquareResult {
        if (!Number.isInteger(n) || n < 1) {
            throw new RangeError(`Expected a natural number, received ${n}`);
        }

        const path: number[] = [n];
        let current = n;
        const DIGIT_SQUARES = [0, 1, 4, 9, 16, 25, 36, 49, 64, 81];

        while (current !== 1 && current !== 89) {
            if (cache.has(current)) {
                const cached = cache.get(current)!;
                path.push(current);
                return {
                    finalValue: cached,
                    path: Object.freeze([...path]),
                    steps: path.length - 1,
                };
            }

            let sum = 0;
            let temp = current;
            while (temp > 0) {
                const digit = temp % 10;
                sum += DIGIT_SQUARES[digit];
                temp = Math.floor(temp / 10);
            }

            current = sum;
            path.push(current);
        }

        cache.set(n, current as ConvergenceValue);
        return {
            finalValue: current as ConvergenceValue,
            path: Object.freeze([...path]),
            steps: path.length - 1,
        };
    };
}

/**
 * Statistical analysis utility for studying convergence distribution.
 */
function analyzeConvergenceDistribution(limit: number): {
    ones: number;
    eightyNines: number;
    percentageOne: number;
} {
    let ones = 0;
    let eightyNines = 0;

    for (let i = 1; i <= limit; i++) {
        const result = iteratedSquare(i);
        if (result.finalValue === 1) ones++;
        else eightyNines++;
    }

    return {
        ones,
        eightyNines,
        percentage
