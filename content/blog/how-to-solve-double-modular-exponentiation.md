---
title: "How to Solve Double Modular Exponentiation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Double Modular Exponentiation. Medium difficulty, 48.0% acceptance rate. Topics: Array, Math, Simulation."
date: "2029-08-04"
category: "dsa-patterns"
tags: ["double-modular-exponentiation", "array", "math", "simulation", "medium"]
---

# How to Solve Double Modular Exponentiation

This problem asks us to find all indices where a nested modular exponentiation formula equals a target value. Given a 2D array `variables` where each element is `[aᵢ, bᵢ, cᵢ, mᵢ]`, we need to check if `((aᵢ^bᵢ % 10)^cᵢ) % mᵢ == target` for each index `i`. The challenge lies in handling potentially large exponents efficiently while avoiding overflow.

## Visual Walkthrough

Let's trace through a concrete example to understand the calculation:

**Input:**

```
variables = [[2, 3, 3, 5], [3, 3, 3, 5]]
target = 2
```

**For index 0:** `[a=2, b=3, c=3, m=5]`

1. First compute `a^b % 10`: `2^3 % 10 = 8 % 10 = 8`
2. Then compute `(result)^c % m`: `8^3 % 5 = 512 % 5 = 2`
3. Compare with target: `2 == 2` ✓ This is a good index.

**For index 1:** `[a=3, b=3, c=3, m=5]`

1. `a^b % 10`: `3^3 % 10 = 27 % 10 = 7`
2. `7^3 % 5 = 343 % 5 = 3`
3. `3 != 2` ✗ Not a good index.

**Output:** `[0]`

The key observation is that we need to compute modular exponentiation twice: first modulo 10, then modulo `mᵢ`. Direct computation of `aᵢ^bᵢ` could cause overflow for large exponents, so we need an efficient method.

## Brute Force Approach

A naive approach would compute the exponentiations directly:

1. For each variable set `[a, b, c, m]`:
2. Compute `a^b` directly (could overflow for large b)
3. Take `% 10` of that result
4. Raise that to power `c` (could overflow again)
5. Take `% m` and compare with target

**Why this fails:**

- For large `b` or `c` (up to 10^4 in constraints), computing `a^b` directly would create astronomically large numbers that exceed integer limits in any language.
- Even with big integers, the computation would be extremely slow (O(b) for exponentiation).
- The problem constraints require handling up to 1000 variable sets efficiently.

We need modular exponentiation to keep numbers manageable.

## Optimized Approach

The key insight is to use **modular exponentiation** (exponentiation by squaring) at both steps:

1. **First modulo operation**: Compute `(a^b) % 10` using modular exponentiation
   - We use modulo 10 because that's specified in the formula
   - This keeps intermediate results small (0-9)

2. **Second modulo operation**: Compute `(result^c) % m` using modular exponentiation again
   - We use modulo `m` because that's the final modulus in the formula
   - This keeps numbers within `[0, m-1]` range

**Why modular exponentiation works:**

- Instead of computing `a^b` then taking modulo, we take modulo at each step
- `(a * b) % m = ((a % m) * (b % m)) % m` - this property lets us keep numbers small
- Exponentiation by squaring reduces time from O(b) to O(log b)

**Step-by-step reasoning:**

1. For each variable set `[a, b, c, m]`:
2. Compute `first = pow_mod(a, b, 10)` where `pow_mod` uses modular exponentiation
3. Compute `second = pow_mod(first, c, m)` using modular exponentiation
4. If `second == target`, add index to result list

## Optimal Solution

Here's the complete solution using modular exponentiation:

<div class="code-group">

```python
# Time: O(n * log(max(b, c))) where n = len(variables)
# Space: O(1) excluding output array
def getGoodIndices(self, variables, target):
    """
    Returns indices where ((a^b % 10)^c) % m == target
    Uses modular exponentiation to handle large exponents efficiently.
    """
    def mod_pow(base, exp, mod):
        """Modular exponentiation using exponentiation by squaring."""
        result = 1
        base %= mod  # Ensure base is within modulo range

        while exp > 0:
            # If exp is odd, multiply result by current base
            if exp & 1:
                result = (result * base) % mod
            # Square the base
            base = (base * base) % mod
            # Halve the exponent (integer division)
            exp >>= 1
        return result

    good_indices = []

    for i, (a, b, c, m) in enumerate(variables):
        # Step 1: Compute (a^b) % 10 using modular exponentiation
        first_mod = mod_pow(a, b, 10)

        # Step 2: Compute (first_mod^c) % m using modular exponentiation
        # Special case: if m == 1, result is always 0
        if m == 1:
            second_mod = 0
        else:
            second_mod = mod_pow(first_mod, c, m)

        # Step 3: Check if result equals target
        if second_mod == target:
            good_indices.append(i)

    return good_indices
```

```javascript
// Time: O(n * log(max(b, c))) where n = variables.length
// Space: O(1) excluding output array
function getGoodIndices(variables, target) {
  /**
   * Modular exponentiation using exponentiation by squaring.
   * Computes (base^exp) % mod efficiently.
   */
  function modPow(base, exp, mod) {
    let result = 1n; // Use BigInt for safety with large numbers
    base = BigInt(base) % BigInt(mod);
    let expRemaining = BigInt(exp);

    while (expRemaining > 0n) {
      // If exponent is odd, multiply result by current base
      if (expRemaining & 1n) {
        result = (result * base) % BigInt(mod);
      }
      // Square the base
      base = (base * base) % BigInt(mod);
      // Halve the exponent (integer division)
      expRemaining >>= 1n;
    }
    return Number(result);
  }

  const goodIndices = [];

  for (let i = 0; i < variables.length; i++) {
    const [a, b, c, m] = variables[i];

    // Step 1: Compute (a^b) % 10 using modular exponentiation
    const firstMod = modPow(a, b, 10);

    // Step 2: Compute (firstMod^c) % m using modular exponentiation
    let secondMod;
    if (m === 1) {
      secondMod = 0; // Anything % 1 is 0
    } else {
      secondMod = modPow(firstMod, c, m);
    }

    // Step 3: Check if result equals target
    if (secondMod === target) {
      goodIndices.push(i);
    }
  }

  return goodIndices;
}
```

```java
// Time: O(n * log(max(b, c))) where n = variables.length
// Space: O(1) excluding output list
import java.util.*;

class Solution {
    public List<Integer> getGoodIndices(int[][] variables, int target) {
        List<Integer> goodIndices = new ArrayList<>();

        for (int i = 0; i < variables.length; i++) {
            int a = variables[i][0];
            int b = variables[i][1];
            int c = variables[i][2];
            int m = variables[i][3];

            // Step 1: Compute (a^b) % 10 using modular exponentiation
            int firstMod = modPow(a, b, 10);

            // Step 2: Compute (firstMod^c) % m using modular exponentiation
            int secondMod;
            if (m == 1) {
                secondMod = 0;  // Anything modulo 1 is 0
            } else {
                secondMod = modPow(firstMod, c, m);
            }

            // Step 3: Check if result equals target
            if (secondMod == target) {
                goodIndices.add(i);
            }
        }

        return goodIndices;
    }

    /**
     * Modular exponentiation using exponentiation by squaring.
     * Computes (base^exp) % mod efficiently without overflow.
     */
    private int modPow(long base, int exp, int mod) {
        long result = 1;
        base %= mod;  // Reduce base modulo mod first

        while (exp > 0) {
            // If exponent is odd, multiply result by current base
            if ((exp & 1) == 1) {
                result = (result * base) % mod;
            }
            // Square the base
            base = (base * base) % mod;
            // Halve the exponent (integer division)
            exp >>= 1;
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × log(max(b, c)))

- `n` is the number of variable sets (length of `variables` array)
- For each set, we perform two modular exponentiations
- Each modular exponentiation takes O(log(exp)) time using exponentiation by squaring
- The dominant exponents are `b` and `c`, so we get O(log(max(b, c))) per exponentiation

**Space Complexity:** O(1) auxiliary space

- We only use a few variables for computation
- The output array is not counted in auxiliary space complexity
- If counting output, it would be O(k) where k is number of good indices

## Common Mistakes

1. **Not using modular exponentiation**: Attempting to compute `a^b` directly will cause overflow for large exponents. Even with big integers, it would be too slow.

2. **Forgetting the special case when m = 1**: When `m = 1`, any number modulo 1 is 0. Some implementations of modular exponentiation might handle this, but it's safer to check explicitly.

3. **Incorrect order of operations**: The formula is `((a^b % 10)^c) % m`, not `(a^b % (10^c)) % m` or other variations. Pay close attention to parentheses.

4. **Not reducing base modulo mod first**: In the modular exponentiation function, always reduce `base %= mod` at the beginning. This prevents unnecessary large multiplications.

5. **Using integer types that are too small**: In Java, use `long` for intermediate calculations to avoid overflow when multiplying. In JavaScript, consider using BigInt for safety.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Modular Exponentiation**: Used whenever you need to compute large powers modulo some number without overflow.
   - Related problems:
     - **Pow(x, n)** (LeetCode 50) - Compute x^n efficiently
     - **Super Pow** (LeetCode 372) - Compute a^b mod 1337 where b is an array

2. **Nested Mathematical Operations**: Problems where you need to apply operations in a specific order with intermediate modulo reductions.
   - Related problems:
     - **Concatenation of Consecutive Binary Numbers** (LeetCode 1680) - Requires modular arithmetic with shifting
     - **Number of Good Pairs** (LeetCode 1512) - Simpler but teaches careful counting

## Key Takeaways

1. **Modular exponentiation is essential for large powers**: When you see exponents in problems with modulo operations, immediately think of exponentiation by squaring to keep numbers manageable.

2. **Pay attention to operation order**: In mathematical expressions with multiple operations, the order matters significantly. Break complex formulas into steps.

3. **Handle edge cases for modulo 1**: Remember that `x % 1 = 0` for all x. This is a common edge case in modulo problems.

4. **Use appropriate data types**: Choose integer types that can handle the maximum possible intermediate values, or use modulo reduction to keep numbers small.

[Practice this problem on CodeJeet](/problem/double-modular-exponentiation)
