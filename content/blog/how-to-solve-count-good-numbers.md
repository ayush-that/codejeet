---
title: "How to Solve Count Good Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Good Numbers. Medium difficulty, 57.4% acceptance rate. Topics: Math, Recursion."
date: "2028-03-20"
category: "dsa-patterns"
tags: ["count-good-numbers", "math", "recursion", "medium"]
---

# How to Solve Count Good Numbers

This problem asks us to count how many digit strings of length `n` are "good" according to specific rules: digits at even indices (0-indexed) must be even (0, 2, 4, 6, 8), and digits at odd indices must be prime (2, 3, 5, 7). The challenge is that `n` can be up to 10¹⁵, making brute force generation impossible. This transforms what looks like a string generation problem into a combinatorics and modular exponentiation problem.

## Visual Walkthrough

Let's build intuition with a small example. For `n = 4`, we need to count all 4-digit strings where:

- Positions 0 and 2 (even indices) must be even digits: {0, 2, 4, 6, 8} → 5 choices each
- Positions 1 and 3 (odd indices) must be prime digits: {2, 3, 5, 7} → 4 choices each

The total count would be: 5 × 4 × 5 × 4 = 400

Notice the pattern:

- If `n` is even, we have `n/2` even positions and `n/2` odd positions
- If `n` is odd, we have `⌈n/2⌉` even positions and `⌊n/2⌋` odd positions

So the formula becomes: `5^(number of even positions) × 4^(number of odd positions)`

For `n = 4`: `5² × 4² = 25 × 16 = 400`
For `n = 5`: `5³ × 4² = 125 × 16 = 2000`

The real challenge is computing these exponentials efficiently when `n` is huge (up to 10¹⁵).

## Brute Force Approach

A naive approach would try to generate all possible digit strings of length `n` and check each one. For each position, we'd have:

- 5 choices for even positions
- 4 choices for odd positions

This gives us `5^(ceil(n/2)) × 4^(floor(n/2))` total possibilities. Even for moderate `n`, this number grows astronomically:

- For `n = 10`: ~6.4 million possibilities
- For `n = 20`: ~1.1×10¹³ possibilities
- For `n = 50`: ~1.3×10³³ possibilities

Clearly, we cannot generate and count these strings. Even if we could, the problem asks for the result modulo 10⁹+7, which hints that the actual count is far too large to compute directly.

## Optimized Approach

The key insight is that we don't need to generate the strings—we just need to count them using combinatorics:

1. **Combinatorial counting**: Each position's digit choice is independent of others
2. **Even positions**: 5 choices each (0, 2, 4, 6, 8)
3. **Odd positions**: 4 choices each (2, 3, 5, 7)
4. **Total count**: `5^(even_count) × 4^(odd_count)`

Where:

- `even_count = ceil(n/2)` = `(n + 1) // 2`
- `odd_count = floor(n/2)` = `n // 2`

The challenge now is computing `5^(even_count) × 4^(odd_count) mod (10⁹+7)` efficiently when `even_count` and `odd_count` can be up to ~5×10¹⁴.

We need **modular exponentiation** using the **fast exponentiation (binary exponentiation)** technique, which computes `a^b mod m` in O(log b) time instead of O(b).

## Optimal Solution

We'll use modular exponentiation with these steps:

1. Calculate number of even and odd positions
2. Compute `5^(even_count) mod MOD` using fast exponentiation
3. Compute `4^(odd_count) mod MOD` using fast exponentiation
4. Multiply results modulo MOD

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
class Solution:
    def countGoodNumbers(self, n: int) -> int:
        MOD = 10**9 + 7

        # Count positions: even indices and odd indices
        # For 0-indexed positions:
        # - Even indices: 0, 2, 4, ... → count = ceil(n/2)
        # - Odd indices: 1, 3, 5, ... → count = floor(n/2)
        even_count = (n + 1) // 2  # ceil(n/2)
        odd_count = n // 2         # floor(n/2)

        # Helper function for modular exponentiation (fast exponentiation)
        def pow_mod(base, exponent):
            result = 1
            base %= MOD  # Reduce base modulo MOD

            while exponent > 0:
                # If exponent is odd, multiply result by current base
                if exponent % 2 == 1:
                    result = (result * base) % MOD

                # Square the base and halve the exponent
                base = (base * base) % MOD
                exponent //= 2

            return result

        # Calculate 5^even_count mod MOD and 4^odd_count mod MOD
        even_choices = pow_mod(5, even_count)
        odd_choices = pow_mod(4, odd_count)

        # Total combinations = product modulo MOD
        return (even_choices * odd_choices) % MOD
```

```javascript
// Time: O(log n) | Space: O(1)
/**
 * @param {number} n
 * @return {number}
 */
var countGoodNumbers = function (n) {
  const MOD = BigInt(1000000007);

  // Count even and odd positions
  // even_count = ceil(n/2), odd_count = floor(n/2)
  const evenCount = Math.ceil(n / 2);
  const oddCount = Math.floor(n / 2);

  // Fast modular exponentiation helper
  const powMod = (base, exponent) => {
    let result = 1n;
    let b = BigInt(base) % MOD;
    let exp = BigInt(exponent);

    while (exp > 0n) {
      // If exponent is odd, multiply result by current base
      if (exp % 2n === 1n) {
        result = (result * b) % MOD;
      }

      // Square the base and halve the exponent
      b = (b * b) % MOD;
      exp = exp / 2n; // Integer division for BigInt
    }

    return result;
  };

  // Calculate 5^evenCount and 4^oddCount modulo MOD
  const evenChoices = powMod(5, evenCount);
  const oddChoices = powMod(4, oddCount);

  // Total combinations = product modulo MOD
  return Number((evenChoices * oddChoices) % MOD);
};
```

```java
// Time: O(log n) | Space: O(1)
class Solution {
    private static final int MOD = 1_000_000_007;

    public int countGoodNumbers(long n) {
        // Count even and odd positions
        // even_count = ceil(n/2), odd_count = floor(n/2)
        long evenCount = (n + 1) / 2;  // ceil(n/2)
        long oddCount = n / 2;         // floor(n/2)

        // Calculate 5^evenCount and 4^oddCount modulo MOD
        long evenChoices = powMod(5, evenCount);
        long oddChoices = powMod(4, oddCount);

        // Total combinations = product modulo MOD
        return (int)((evenChoices * oddChoices) % MOD);
    }

    // Fast modular exponentiation (binary exponentiation)
    private long powMod(long base, long exponent) {
        long result = 1;
        base %= MOD;

        while (exponent > 0) {
            // If exponent is odd, multiply result by current base
            if (exponent % 2 == 1) {
                result = (result * base) % MOD;
            }

            // Square the base and halve the exponent
            base = (base * base) % MOD;
            exponent /= 2;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log n)**

- We compute two modular exponentiations: `5^(ceil(n/2))` and `4^(floor(n/2))`
- Each modular exponentiation takes O(log exponent) time using binary exponentiation
- Since exponents are ~n/2, time complexity is O(log n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- The recursive stack for binary exponentiation is iterative, not recursive

## Common Mistakes

1. **Using regular exponentiation instead of modular exponentiation**: Computing `5^(n/2)` directly will cause integer overflow even for moderate `n`. Always use modular exponentiation with binary exponentiation.

2. **Incorrect position counting**: Mixing up `ceil(n/2)` and `floor(n/2)` for even and odd positions. Remember: 0-indexed means position 0 is even, so even positions = `ceil(n/2)`.

3. **Forgetting modulo operations during multiplication**: After computing `5^even_count mod MOD` and `4^odd_count mod MOD`, you must multiply them and take modulo again: `(a × b) mod MOD`.

4. **Using integer types that overflow**: In Java/C++, use `long` instead of `int` for intermediate results. In JavaScript, use `BigInt` for large exponents.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Combinatorial counting with modular arithmetic**: Similar to problems where you count configurations with independent choices, like:
   - [Count Sorted Vowel Strings](https://leetcode.com/problems/count-sorted-vowel-strings/) - Counting strings with ordering constraints
   - [Count Ways To Build Good Strings](https://leetcode.com/problems/count-ways-to-build-good-strings/) - Counting strings with length constraints

2. **Fast modular exponentiation**: Essential for problems involving large exponents modulo a prime:
   - [Super Pow](https://leetcode.com/problems/super-pow/) - Computing a^b mod 1337
   - [Pow(x, n)](https://leetcode.com/problems/powx-n/) - Computing x^n efficiently

The combination appears in problems where you need to count exponentially many possibilities modulo a large prime, which is common in combinatorics and number theory problems.

## Key Takeaways

1. **When counting configurations with independent choices**, multiply the number of choices for each position. If choices differ by position type (even/odd), count each type separately.

2. **For large exponents modulo M**, always use binary exponentiation (fast exponentiation) which runs in O(log n) time instead of O(n).

3. **Pay attention to indexing conventions**: 0-indexed vs 1-indexed changes which positions are "even" or "odd" in the problem statement.

Related problems: [Count the Number of Arrays with K Matching Adjacent Elements](/problem/count-the-number-of-arrays-with-k-matching-adjacent-elements)
