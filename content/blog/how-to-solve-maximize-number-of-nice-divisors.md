---
title: "How to Solve Maximize Number of Nice Divisors — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize Number of Nice Divisors. Hard difficulty, 35.4% acceptance rate. Topics: Math, Recursion, Number Theory."
date: "2026-05-24"
category: "dsa-patterns"
tags: ["maximize-number-of-nice-divisors", "math", "recursion", "number-theory", "hard"]
---

# How to Solve Maximize Number of Nice Divisors

This problem asks us to construct a number with at most `primeFactors` prime factors (not necessarily distinct) that maximizes its number of "nice divisors" — divisors that are divisible by every prime factor of the original number. The tricky part is that this isn't about prime factorization in the traditional sense, but rather a mathematical optimization problem that reduces to splitting a number into parts whose product is maximized.

## Visual Walkthrough

Let's build intuition with a small example. Suppose `primeFactors = 5`. We need to create a number `n` using at most 5 prime factors (they can be repeated) that maximizes nice divisors.

First, what are "nice divisors"? If `n = p₁^a₁ × p₂^a₂ × ... × pₖ^aₖ`, then a divisor is "nice" if it's divisible by every prime factor of `n`. This means the divisor must include at least one of each prime. So for each prime `pᵢ`, we can choose exponents from 1 to `aᵢ` (not 0). The total number of nice divisors is therefore `a₁ × a₂ × ... × aₖ`, where `a₁ + a₂ + ... + aₖ ≤ primeFactors`.

Our goal: maximize `a₁ × a₂ × ... × aₖ` given `sum(aᵢ) ≤ primeFactors`.

Let's try `primeFactors = 5`:

- Split 5 into 5 parts: `[1,1,1,1,1]` → product = 1
- Split into 4 parts: `[2,1,1,1]` → product = 2
- Split into 3 parts: `[3,1,1]` → product = 3, `[2,2,1]` → product = 4
- Split into 2 parts: `[4,1]` → product = 4, `[3,2]` → product = 6
- Split into 1 part: `[5]` → product = 5

The maximum is 6 from `[3,2]`. So with 5 prime factors, we should use 2 primes with exponents 3 and 2: `n = p₁³ × p₂²`. The number of nice divisors is 3×2=6.

Notice the pattern: we want to split the number into as many 3's as possible, then handle the remainder. This is exactly the same as the "Integer Break" problem!

## Brute Force Approach

A naive approach would try all possible partitions of `primeFactors` into positive integers, compute each product, and take the maximum. For `primeFactors = n`, the number of partitions grows exponentially (roughly `O(2^n)`). Even for moderate `n` like 100, this is impossible.

We could try dynamic programming similar to Integer Break: `dp[i]` = maximum product for integer `i`. The recurrence would be `dp[i] = max(j * dp[i-j])` for `j` from 1 to `i-1`. This gives `O(n²)` time and `O(n)` space. However, `primeFactors` can be up to 10⁹, so even `O(n)` is impossible — we need a mathematical solution.

## Optimized Approach

The key insight comes from mathematical optimization: to maximize the product of numbers summing to `n`, we should use as many 3's as possible. Why?

1. For any integer `k ≥ 4`, we can break it into smaller numbers that give a larger product (e.g., 4 → 2×2=4, 5 → 2×3=6 > 5).
2. Using 1's doesn't help since they don't increase the product.
3. Between 2's and 3's, 3's give better products per unit (3 > 2, but 2×2=4 > 3 for the same sum of 4? Let's check: For sum 6: 3+3=6, product=9; 2+2+2=6, product=8. So 3's are better).

The optimal strategy:

- If `n % 3 == 0`: use all 3's → product = 3^(n/3)
- If `n % 3 == 1`: use (n-4)/3 threes and two 2's → product = 3^((n-4)/3) × 4
- If `n % 3 == 2`: use (n-2)/3 threes and one 2 → product = 3^((n-2)/3) × 2

Special case: when `n ≤ 3`, the maximum product is `n-1` (except for n=1 where it's 1).

But wait — there's another twist! We need the result modulo 10⁹+7, and `n` can be huge (up to 10⁹). We need efficient modular exponentiation.

## Optimal Solution

We implement the mathematical solution with fast modular exponentiation. The steps:

1. Handle base cases (n ≤ 3)
2. Calculate the number of 3's and 2's based on n % 3
3. Use fast exponentiation to compute 3^exp mod M
4. Multiply by the remaining 2's (either 2 or 4)
5. Return result mod M

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
class Solution:
    def maxNiceDivisors(self, primeFactors: int) -> int:
        MOD = 10**9 + 7

        # Base cases
        if primeFactors <= 3:
            return primeFactors

        # Calculate number of 3's and 2's
        quotient, remainder = divmod(primeFactors, 3)

        if remainder == 0:
            # All 3's: 3^quotient
            return self.pow_mod(3, quotient, MOD)
        elif remainder == 1:
            # Replace one 3 with 2+2 to get two 2's instead
            # So we have (quotient-1) 3's and two 2's
            return (self.pow_mod(3, quotient - 1, MOD) * 4) % MOD
        else:  # remainder == 2
            # quotient 3's and one 2
            return (self.pow_mod(3, quotient, MOD) * 2) % MOD

    def pow_mod(self, base: int, exp: int, mod: int) -> int:
        """Fast modular exponentiation using binary exponentiation"""
        result = 1
        base %= mod

        while exp > 0:
            # If current bit is set, multiply result by base
            if exp & 1:
                result = (result * base) % mod
            # Square the base for next bit
            base = (base * base) % mod
            # Move to next bit
            exp >>= 1

        return result
```

```javascript
// Time: O(log n) | Space: O(1)
var maxNiceDivisors = function (primeFactors) {
  const MOD = 1000000007n; // Use BigInt for safety with large numbers

  // Base cases
  if (primeFactors <= 3) {
    return primeFactors;
  }

  // Calculate number of 3's and 2's
  const quotient = Math.floor(primeFactors / 3);
  const remainder = primeFactors % 3;

  if (remainder === 0) {
    // All 3's: 3^quotient
    return Number(powMod(3n, BigInt(quotient), MOD));
  } else if (remainder === 1) {
    // (quotient-1) 3's and two 2's
    const power = powMod(3n, BigInt(quotient - 1), MOD);
    return Number((power * 4n) % MOD);
  } else {
    // remainder === 2
    // quotient 3's and one 2
    const power = powMod(3n, BigInt(quotient), MOD);
    return Number((power * 2n) % MOD);
  }
};

function powMod(base, exp, mod) {
  // Fast modular exponentiation
  let result = 1n;
  base %= mod;

  while (exp > 0n) {
    // If current bit is set, multiply result by base
    if (exp & 1n) {
      result = (result * base) % mod;
    }
    // Square the base for next bit
    base = (base * base) % mod;
    // Move to next bit
    exp >>= 1n;
  }

  return result;
}
```

```java
// Time: O(log n) | Space: O(1)
class Solution {
    private static final int MOD = 1_000_000_007;

    public int maxNiceDivisors(int primeFactors) {
        // Base cases
        if (primeFactors <= 3) {
            return primeFactors;
        }

        // Calculate number of 3's and 2's
        int quotient = primeFactors / 3;
        int remainder = primeFactors % 3;

        if (remainder == 0) {
            // All 3's: 3^quotient
            return powMod(3, quotient);
        } else if (remainder == 1) {
            // (quotient-1) 3's and two 2's
            return (int)((powMod(3, quotient - 1) * 4L) % MOD);
        } else { // remainder == 2
            // quotient 3's and one 2
            return (int)((powMod(3, quotient) * 2L) % MOD);
        }
    }

    private int powMod(long base, int exp) {
        // Fast modular exponentiation
        long result = 1;
        base %= MOD;

        while (exp > 0) {
            // If current bit is set, multiply result by base
            if ((exp & 1) == 1) {
                result = (result * base) % MOD;
            }
            // Square the base for next bit
            base = (base * base) % MOD;
            // Move to next bit
            exp >>= 1;
        }

        return (int)result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)  
We use fast modular exponentiation which runs in O(log n) time, where n is the exponent (roughly primeFactors/3). The divmod operation is O(1).

**Space Complexity:** O(1)  
We only use a constant amount of extra space for variables, regardless of input size.

## Common Mistakes

1. **Not using modular exponentiation:** Attempting to compute 3^(10⁹) directly will cause integer overflow and be impossibly slow. Always use fast modular exponentiation for large exponents.

2. **Forgetting the special case when remainder is 1:** When `primeFactors % 3 == 1`, we can't just use `3^quotient × 1` because 1 doesn't help. The correct approach is to use `3^(quotient-1) × 4` (replace one 3 with 2+2).

3. **Incorrect base cases:** For `primeFactors = 1`, the answer is 1 (not 0). For `primeFactors = 2`, answer is 2. For `primeFactors = 3`, answer is 3. Some candidates return `primeFactors-1` for all cases, which is wrong.

4. **Not using modulo correctly in multiplication:** When multiplying large numbers modulo M, we must take modulo after each multiplication to avoid overflow. In Java, use `long` for intermediate results.

## When You'll See This Pattern

This problem uses the same core mathematical insight as **Integer Break (LeetCode 343)**, which asks to break an integer into k positive integers that maximize their product. The "use as many 3's as possible" pattern appears in both.

Other problems using similar mathematical optimization:

1. **Cutting Rope (LCOF 14-I)** - Identical to Integer Break
2. **Maximum Product After K Increments (LeetCode 2233)** - While different, it involves maximizing a product under constraints
3. **Bulb Switcher (LeetCode 319)** - Also requires mathematical insight rather than simulation

The pattern to recognize: when a problem asks to maximize a product given a sum constraint, think about splitting into 3's and 2's.

## Key Takeaways

1. **Maximizing product given sum constraint:** To maximize the product of positive integers summing to n, use as many 3's as possible, with 2's to handle remainders. Never use 1's or numbers ≥ 4.

2. **Fast modular exponentiation is essential:** For problems involving large exponents modulo M, always implement `pow_mod(base, exp, mod)` using binary exponentiation (O(log n) time).

3. **Mathematical insights beat brute force:** Some problems have closed-form mathematical solutions. When constraints are huge (like 10⁹), look for patterns and mathematical properties rather than trying to simulate or use DP.

Related problems: [Integer Break](/problem/integer-break)
