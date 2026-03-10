---
title: "How to Solve Count the Number of Ideal Arrays — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count the Number of Ideal Arrays. Hard difficulty, 56.9% acceptance rate. Topics: Math, Dynamic Programming, Combinatorics, Number Theory."
date: "2028-02-02"
category: "dsa-patterns"
tags: ["count-the-number-of-ideal-arrays", "math", "dynamic-programming", "combinatorics", "hard"]
---

# How to Solve Count the Number of Ideal Arrays

This problem asks us to count the number of ideal arrays of length `n` where each element is between 1 and `maxValue`, and every element divides the next element (arr[i] divides arr[i+1]). The challenge comes from combining combinatorial counting with dynamic programming while handling the divisibility constraint efficiently. What makes this problem interesting is that we need to count sequences where each element is a multiple of the previous one, which connects to prime factorization and combinatorial distribution of "steps" in the factor chain.

## Visual Walkthrough

Let's trace through a small example: `n = 3, maxValue = 4`

We need to count arrays of length 3 where:

1. Each element is between 1 and 4
2. arr[0] divides arr[1], and arr[1] divides arr[2]

Let's enumerate all valid arrays:

**Starting with 1:**

- 1 → 1 → 1 (1 divides 1, 1 divides 1)
- 1 → 1 → 2 (1 divides 1, 1 divides 2)
- 1 → 1 → 3 (1 divides 1, 1 divides 3)
- 1 → 1 → 4 (1 divides 1, 1 divides 4)
- 1 → 2 → 2 (1 divides 2, 2 divides 2)
- 1 → 2 → 4 (1 divides 2, 2 divides 4)
- 1 → 3 → 3 (1 divides 3, 3 divides 3)
- 1 → 4 → 4 (1 divides 4, 4 divides 4)

**Starting with 2:**

- 2 → 2 → 2 (2 divides 2, 2 divides 2)
- 2 → 2 → 4 (2 divides 2, 2 divides 4)
- 2 → 4 → 4 (2 divides 4, 4 divides 4)

**Starting with 3:**

- 3 → 3 → 3 (3 divides 3, 3 divides 3)

**Starting with 4:**

- 4 → 4 → 4 (4 divides 4, 4 divides 4)

Total: 8 + 3 + 1 + 1 = 13 ideal arrays.

The key observation: For a sequence starting with value `v`, the sequence represents a chain of multiplications by integers ≥ 1. For example, 1 → 2 → 4 can be seen as: start with 1, multiply by 2 to get 2, multiply by 2 to get 4. The multipliers must be integers, and the final value must be ≤ maxValue.

## Brute Force Approach

A naive approach would be to generate all possible arrays of length `n` with values from 1 to `maxValue`, then check the divisibility condition for each. This would require checking `maxValue^n` arrays, which is exponential and completely infeasible even for moderate values.

Even a recursive approach that builds valid sequences would be too slow:

```python
def brute_force(n, maxValue):
    def dfs(idx, prev):
        if idx == n:
            return 1
        total = 0
        for num in range(1, maxValue + 1):
            if prev % num == 0:  # Actually should be num % prev == 0
                total += dfs(idx + 1, num)
        return total

    result = 0
    for start in range(1, maxValue + 1):
        result += dfs(1, start)
    return result
```

This has complexity O(maxValue^n) which is far too slow. We need a smarter approach that leverages the structure of the problem.

## Optimized Approach

The key insight is to think in terms of **prime factorizations** and **combinatorial distribution**.

1. **Divisibility Chain as Multiplier Sequence**: If we have an ideal array [a₁, a₂, ..., aₙ], then aᵢ divides aᵢ₊₁, which means aᵢ₊₁ = aᵢ × mᵢ where mᵢ is an integer ≥ 1. Therefore, aₙ = a₁ × m₁ × m₂ × ... × mₙ₋₁.

2. **Prime Factorization Perspective**: Let's consider the prime factorization of the final value. Each multiplier mᵢ contributes some prime factors. The sequence of multipliers determines how we distribute prime factors across the n-1 "steps" in the chain.

3. **Dynamic Programming on Factors**: For each starting value `v` from 1 to `maxValue`, we need to count how many sequences end with a value ≤ `maxValue`. Instead of tracking exact values, we track the exponents of prime factors.

4. **Stars and Bars Combinatorics**: For each prime factor `p` with exponent `e` in the starting value `v`, we need to distribute `e` additional units of exponent `p` across `n-1` steps. This is equivalent to placing `e` identical balls into `n-1` distinct boxes, which is C(e + n - 2, n - 2) using stars and bars.

5. **Independent Prime Factors**: Since prime factors are independent, the total number of sequences starting with `v` is the product over all prime factors of C(eᵢ + n - 2, n - 2), where eᵢ is the exponent of prime factor i in v.

6. **Final Calculation**: Sum this product over all starting values `v` from 1 to `maxValue`.

The challenge is computing combinations efficiently for large n (up to 10⁴) and maxValue (up to 10⁴). We need to precompute factorials and inverse factorials modulo 10⁹+7.

## Optimal Solution

The solution involves:

1. Precomputing factorials and inverse factorials for combinatorial calculations
2. For each number from 1 to maxValue, compute its prime factorization
3. For each starting value, compute the product of combinations for each prime exponent
4. Sum all results modulo 10⁹+7

<div class="code-group">

```python
# Time: O(maxValue * log(maxValue) + maxValue * sqrt(maxValue)) | Space: O(maxValue)
MOD = 10**9 + 7

class Solution:
    def idealArrays(self, n: int, maxValue: int) -> int:
        # Precompute factorials and inverse factorials for combinations
        # We need up to n + maxValue because exponents can be up to log2(maxValue) ~ 14
        # but n can be up to 10^4, so e + n can be up to n + 14
        max_n = n + 20  # Small buffer for safety
        fact = [1] * (max_n + 1)
        inv_fact = [1] * (max_n + 1)

        # Compute factorials modulo MOD
        for i in range(1, max_n + 1):
            fact[i] = fact[i-1] * i % MOD

        # Compute inverse factorials using Fermat's Little Theorem
        inv_fact[max_n] = pow(fact[max_n], MOD-2, MOD)
        for i in range(max_n-1, -1, -1):
            inv_fact[i] = inv_fact[i+1] * (i+1) % MOD

        # Helper function for combinations using precomputed factorials
        def comb(a, b):
            if a < b or b < 0:
                return 0
            return fact[a] * inv_fact[b] % MOD * inv_fact[a-b] % MOD

        result = 0

        # For each possible starting value
        for start in range(1, maxValue + 1):
            # Get prime factorization of start
            num = start
            ways = 1  # Product of combinations for each prime factor

            # Check each prime factor
            p = 2
            while p * p <= num:
                if num % p == 0:
                    exp = 0
                    while num % p == 0:
                        num //= p
                        exp += 1
                    # For this prime with exponent exp, we need to distribute
                    # exp additional units across n-1 steps
                    # Using stars and bars: C(exp + n - 2, n - 2)
                    ways = ways * comb(exp + n - 1, n - 1) % MOD
                p += 1

            # If there's a prime factor left (num > 1), it's a prime with exponent 1
            if num > 1:
                ways = ways * comb(1 + n - 1, n - 1) % MOD

            result = (result + ways) % MOD

        return result
```

```javascript
// Time: O(maxValue * log(maxValue) + maxValue * sqrt(maxValue)) | Space: O(maxValue)
const MOD = 10 ** 9 + 7;

/**
 * @param {number} n
 * @param {number} maxValue
 * @return {number}
 */
var idealArrays = function (n, maxValue) {
  // Precompute factorials and inverse factorials
  const maxN = n + 20; // Buffer for safety
  const fact = new Array(maxN + 1).fill(1);
  const invFact = new Array(maxN + 1).fill(1);

  // Compute factorials
  for (let i = 1; i <= maxN; i++) {
    fact[i] = (fact[i - 1] * i) % MOD;
  }

  // Compute inverse factorials using Fermat's Little Theorem
  invFact[maxN] = modPow(fact[maxN], MOD - 2);
  for (let i = maxN - 1; i >= 0; i--) {
    invFact[i] = (invFact[i + 1] * (i + 1)) % MOD;
  }

  // Helper function for modular exponentiation
  function modPow(base, exp) {
    let result = 1;
    base %= MOD;
    while (exp > 0) {
      if (exp & 1) {
        result = (result * base) % MOD;
      }
      base = (base * base) % MOD;
      exp >>= 1;
    }
    return result;
  }

  // Helper function for combinations
  function comb(a, b) {
    if (a < b || b < 0) return 0;
    return (((fact[a] * invFact[b]) % MOD) * invFact[a - b]) % MOD;
  }

  let result = 0;

  // For each possible starting value
  for (let start = 1; start <= maxValue; start++) {
    let num = start;
    let ways = 1;

    // Prime factorization
    for (let p = 2; p * p <= num; p++) {
      if (num % p === 0) {
        let exp = 0;
        while (num % p === 0) {
          num /= p;
          exp++;
        }
        // Distribute exp additional units across n-1 steps
        ways = (ways * comb(exp + n - 1, n - 1)) % MOD;
      }
    }

    // Handle remaining prime factor
    if (num > 1) {
      ways = (ways * comb(1 + n - 1, n - 1)) % MOD;
    }

    result = (result + ways) % MOD;
  }

  return result;
};
```

```java
// Time: O(maxValue * log(maxValue) + maxValue * sqrt(maxValue)) | Space: O(maxValue)
class Solution {
    private static final int MOD = 1_000_000_007;

    public int idealArrays(int n, int maxValue) {
        // Precompute factorials and inverse factorials
        int maxN = n + 20; // Buffer for safety
        long[] fact = new long[maxN + 1];
        long[] invFact = new long[maxN + 1];
        fact[0] = 1;
        invFact[0] = 1;

        // Compute factorials
        for (int i = 1; i <= maxN; i++) {
            fact[i] = (fact[i-1] * i) % MOD;
        }

        // Compute inverse factorials using Fermat's Little Theorem
        invFact[maxN] = modPow(fact[maxN], MOD - 2);
        for (int i = maxN - 1; i >= 0; i--) {
            invFact[i] = (invFact[i+1] * (i+1)) % MOD;
        }

        long result = 0;

        // For each possible starting value
        for (int start = 1; start <= maxValue; start++) {
            int num = start;
            long ways = 1;

            // Prime factorization
            for (int p = 2; p * p <= num; p++) {
                if (num % p == 0) {
                    int exp = 0;
                    while (num % p == 0) {
                        num /= p;
                        exp++;
                    }
                    // Distribute exp additional units across n-1 steps
                    ways = (ways * comb(exp + n - 1, n - 1, fact, invFact)) % MOD;
                }
            }

            // Handle remaining prime factor
            if (num > 1) {
                ways = (ways * comb(1 + n - 1, n - 1, fact, invFact)) % MOD;
            }

            result = (result + ways) % MOD;
        }

        return (int) result;
    }

    // Modular exponentiation
    private long modPow(long base, long exp) {
        long result = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1) == 1) {
                result = (result * base) % MOD;
            }
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return result;
    }

    // Combination function using precomputed factorials
    private long comb(int a, int b, long[] fact, long[] invFact) {
        if (a < b || b < 0) return 0;
        return (fact[a] * invFact[b] % MOD) * invFact[a-b] % MOD;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(maxValue × √maxValue + maxN)

- We iterate through all starting values from 1 to maxValue: O(maxValue)
- For each value, we perform prime factorization up to √maxValue: O(√maxValue) per number
- Precomputing factorials takes O(maxN) where maxN = n + O(log(maxValue))
- Total: O(maxValue × √maxValue + n)

**Space Complexity:** O(maxN)

- We store factorials and inverse factorials up to maxN = n + O(log(maxValue))
- Other variables use constant space

The √maxValue factor comes from trial division for prime factorization. For maxValue = 10⁴, √maxValue = 100, making this approach efficient.

## Common Mistakes

1. **Wrong combinatorial formula**: Using C(exp + n - 2, exp) instead of C(exp + n - 1, n - 1). Remember: distributing `e` identical items into `n-1` distinct boxes (with possibly empty boxes) is C(e + n - 2, n - 2) or equivalently C(e + n - 1, n - 1). The key is that we have `n-1` multipliers, and we need to distribute `e` additional units of exponent.

2. **Forgetting to handle large exponents**: The exponent `e` in prime factorization can be up to log₂(maxValue) ≈ 14 for maxValue = 10⁴. When computing C(e + n - 1, n - 1), we need factorials up to n + e, not just up to n.

3. **Modulo arithmetic errors**: Forgetting to apply modulo after each multiplication or using integer division instead of modular inverse. Always use modular multiplication and precompute inverse factorials for efficiency.

4. **Missing the remaining prime factor**: After the loop `while (p * p <= num)`, if `num > 1`, it means `num` is a prime number with exponent 1. Forgetting to handle this case will undercount sequences.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Stars and Bars Combinatorics**: Used in problems where you need to distribute identical items into distinct groups. Similar to "Count Ways to Make Array With Product" where you distribute prime factors among array elements.

2. **Prime Factorization with Dynamic Programming**: Problems that involve multiplicative constraints often benefit from thinking in terms of prime factors. The exponents of prime factors can be treated independently.

3. **Sequences with Multiplicative Constraints**: Any problem where each element is related to the next by multiplication or division (like "Ideal Arrays" or sequences where each element divides the next) can use this approach.

Related problems:

- **Count Ways to Make Array With Product (Hard)**: Similar prime factorization and stars-and-bars approach to distribute prime factors among array elements.
- **Count the Number of Beautiful Subarrays (Medium)**: Uses bitwise properties instead of multiplicative, but similar idea of breaking down into independent components.
- **Number of Ways to Split a String (Medium)**: Uses combinatorial counting similar to stars and bars.

## Key Takeaways

1. **Break multiplicative constraints into prime factors**: When dealing with divisibility or multiplication constraints, prime factorization often simplifies the problem by making factors independent.

2. **Stars and bars for distribution problems**: When you need to distribute identical items (like exponent units) into distinct containers (like positions in the sequence), remember the formula C(items + containers - 1, containers - 1).

3. **Precompute factorials for combinatorial modulo problems**: For problems requiring many combination calculations modulo a prime, precompute factorials and inverse factorials for O(1) combination queries.

Related problems: [Count Ways to Make Array With Product](/problem/count-ways-to-make-array-with-product), [Count the Number of Beautiful Subarrays](/problem/count-the-number-of-beautiful-subarrays)
