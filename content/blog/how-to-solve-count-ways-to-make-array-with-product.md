---
title: "How to Solve Count Ways to Make Array With Product — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Ways to Make Array With Product. Hard difficulty, 54.4% acceptance rate. Topics: Array, Math, Dynamic Programming, Combinatorics, Number Theory."
date: "2026-06-16"
category: "dsa-patterns"
tags: ["count-ways-to-make-array-with-product", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Count Ways to Make Array With Product

This problem asks: given multiple queries `[n_i, k_i]`, find how many different arrays of length `n_i` can be formed using positive integers such that their product equals `k_i`. The challenge lies in the combinatorial explosion—both in the number of possible arrays and the size of `k_i` (up to 10⁴). A brute-force search is impossible, so we need to combine number theory (prime factorization) with combinatorics (stars and bars) to solve it efficiently.

## Visual Walkthrough

Let's work through a concrete example: `n = 3`, `k = 12`.

**Step 1: Prime factorization**  
First, factor `k = 12` into primes: `12 = 2² × 3¹`.  
We have two prime factors:

- Factor 2 appears 2 times
- Factor 3 appears 1 time

**Step 2: Distributing prime factors**  
Think of each prime factor's exponent as identical "units" that need to be distributed among the `n` positions in the array.  
For factor 2: we have 2 identical "twos" to place into 3 positions.  
For factor 3: we have 1 identical "three" to place into 3 positions.

**Step 3: Stars and bars**  
The "stars and bars" combinatorial formula tells us how to distribute `e` identical items into `n` distinct boxes (array positions):  
Number of ways = `C(e + n - 1, n - 1)` where `C` is the binomial coefficient.

For factor 2 (e=2, n=3):  
Ways = `C(2+3-1, 3-1) = C(4, 2) = 6`

For factor 3 (e=1, n=3):  
Ways = `C(1+3-1, 3-1) = C(3, 2) = 3`

**Step 4: Combining independent distributions**  
Since prime factors are independent (placing 2's doesn't affect placing 3's), we multiply the counts:  
Total ways = `6 × 3 = 18`

So there are 18 different arrays of length 3 with product 12. One example: `[2, 2, 3]` (2's in first two positions, 3 in last). Another: `[1, 12, 1]` (all 2's and 3 in the second position).

## Brute Force Approach

A naive approach would try to generate all possible arrays of length `n` with positive integers whose product is `k`. For each query, we could:

1. Generate all divisors of `k`
2. Try all combinations of `n` divisors (with repetition) that multiply to `k`
3. Count distinct arrays (order matters)

This is exponential in both `n` and the number of divisors. Even for moderate `k`, the number of divisors can be large, and with `n` up to 10⁵ in queries, this approach is completely infeasible.

What makes this problem hard is that we need to:

- Handle multiple queries efficiently (precompute what we can)
- Deal with large numbers (use modular arithmetic)
- Avoid enumerating actual arrays (use combinatorics)

## Optimized Approach

The key insight is that **prime factorization transforms a multiplicative constraint into an additive one**. Once we factor `k = p₁^e₁ × p₂^e₂ × ... × pₘ^eₘ`, the problem becomes: for each prime factor `pᵢ`, distribute `eᵢ` identical items into `n` distinct boxes.

**Step-by-step reasoning:**

1. **Precomputation**: Since `k ≤ 10⁴`, we can precompute:
   - Prime numbers up to 10⁴ using a sieve
   - Binomial coefficients `C(n, r)` for `n ≤ max_n + max_exponent` using Pascal's triangle
   - Factorization of all numbers up to 10⁴ (optional optimization)

2. **For each query `(n, k)`**:
   - Factorize `k` into prime exponents `(pᵢ, eᵢ)`
   - For each prime factor, compute `C(eᵢ + n - 1, n - 1)` using precomputed binomial coefficients
   - Multiply results for all prime factors (modulo 10⁹+7)

3. **Why stars and bars works**:  
   When distributing `e` identical items into `n` boxes, imagine `e` stars (_) representing the items and `n-1` bars (|) separating the boxes: `\*\*|_||\*\*\*`for n=4, e=6.  
The number of arrangements = number of ways to choose positions for the bars among all symbols:`C(e + n - 1, n - 1)`.

4. **Handling 1's in the array**:  
   Empty boxes (positions with value 1) are automatically handled—they correspond to sections with no stars between bars.

## Optimal Solution

We'll implement the solution with:

1. Sieve of Eratosthenes to find primes up to 10⁴
2. Precomputation of binomial coefficients using dynamic programming
3. Factorization using trial division by primes
4. Modular multiplication for results

<div class="code-group">

```python
MOD = 10**9 + 7

class Solution:
    def waysToFillArray(self, queries):
        """
        Main solution function.
        Time: O(Q * (sqrt(K)/log(K)) + N_max * E_max) for precomputation
        Space: O(N_max * E_max + P) where P = number of primes ≤ 10^4
        """
        # Find maximum n and k from queries to size our precomputations
        max_n = 0
        max_k = 0
        for n, k in queries:
            max_n = max(max_n, n)
            max_k = max(max_k, k)

        # Precompute primes up to max_k using Sieve of Eratosthenes
        primes = self._sieve(max_k)

        # Precompute binomial coefficients C(i, j) for i ≤ max_n + max_exponent
        # The maximum exponent for any prime factor of k ≤ 10^4 is when k = 2^13 = 8192 < 10000
        # So max exponent ≤ 13, but we'll use a conservative bound
        max_exponent = 14  # 2^14 = 16384 > 10000
        max_comb_n = max_n + max_exponent

        # comb[i][j] = C(i, j) mod MOD
        comb = [[0] * (max_exponent + 1) for _ in range(max_comb_n + 1)]

        # Base cases: C(i, 0) = 1, C(i, i) = 1
        for i in range(max_comb_n + 1):
            comb[i][0] = 1
            if i <= max_exponent:
                comb[i][i] = 1

        # Fill using Pascal's identity: C(n, k) = C(n-1, k-1) + C(n-1, k)
        for i in range(1, max_comb_n + 1):
            # j only needs to go up to min(i, max_exponent) since we only need C(n+e-1, e)
            # and e ≤ max_exponent
            for j in range(1, min(i, max_exponent) + 1):
                comb[i][j] = (comb[i-1][j-1] + comb[i-1][j]) % MOD

        # Process each query
        result = []
        for n, k in queries:
            ways = 1

            # Factorize k using precomputed primes
            for p in primes:
                if p * p > k:
                    break
                if k % p == 0:
                    e = 0
                    while k % p == 0:
                        k //= p
                        e += 1
                    # C(e + n - 1, n - 1) ways to distribute e copies of prime p into n positions
                    ways = (ways * comb[e + n - 1][e]) % MOD

            # If k > 1, it's a prime factor itself
            if k > 1:
                # e = 1 for this prime factor
                ways = (ways * comb[1 + n - 1][1]) % MOD

            result.append(ways)

        return result

    def _sieve(self, limit):
        """Return list of primes up to limit using Sieve of Eratosthenes."""
        if limit < 2:
            return []

        is_prime = [True] * (limit + 1)
        is_prime[0] = is_prime[1] = False

        for i in range(2, int(limit**0.5) + 1):
            if is_prime[i]:
                for j in range(i*i, limit + 1, i):
                    is_prime[j] = False

        return [i for i in range(2, limit + 1) if is_prime[i]]
```

```javascript
const MOD = 1_000_000_007n; // Use BigInt for safety with large numbers

/**
 * @param {number[][]} queries
 * @return {number[]}
 */
var waysToFillArray = function (queries) {
  // Find maximum n and k from queries
  let maxN = 0,
    maxK = 0;
  for (const [n, k] of queries) {
    maxN = Math.max(maxN, n);
    maxK = Math.max(maxK, k);
  }

  // Precompute primes up to maxK
  const primes = sieve(maxK);

  // Precompute binomial coefficients
  // Maximum exponent for k ≤ 10000 is when k = 2^13 = 8192
  const maxExponent = 14;
  const maxCombN = maxN + maxExponent;

  // comb[i][j] = C(i, j) mod MOD
  const comb = Array.from({ length: maxCombN + 1 }, () => Array(maxExponent + 1).fill(0n));

  // Base cases
  for (let i = 0; i <= maxCombN; i++) {
    comb[i][0] = 1n;
    if (i <= maxExponent) {
      comb[i][i] = 1n;
    }
  }

  // Pascal's triangle
  for (let i = 1; i <= maxCombN; i++) {
    const limit = Math.min(i, maxExponent);
    for (let j = 1; j <= limit; j++) {
      comb[i][j] = (comb[i - 1][j - 1] + comb[i - 1][j]) % MOD;
    }
  }

  // Process queries
  const result = [];
  for (const [n, k] of queries) {
    let ways = 1n;
    let tempK = k;

    // Factorize k
    for (const p of primes) {
      if (p * p > tempK) break;

      if (tempK % p === 0) {
        let e = 0;
        while (tempK % p === 0) {
          tempK /= p;
          e++;
        }
        // C(e + n - 1, n - 1) = C(e + n - 1, e)
        ways = (ways * comb[e + n - 1][e]) % MOD;
      }
    }

    // Remaining prime factor
    if (tempK > 1) {
      ways = (ways * comb[1 + n - 1][1]) % MOD;
    }

    result.push(Number(ways));
  }

  return result;
};

function sieve(limit) {
  if (limit < 2) return [];

  const isPrime = new Array(limit + 1).fill(true);
  isPrime[0] = isPrime[1] = false;

  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = false;
      }
    }
  }

  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime[i]) primes.push(i);
  }

  return primes;
}
```

```java
import java.util.*;

class Solution {
    private static final int MOD = 1_000_000_007;

    public int[] waysToFillArray(int[][] queries) {
        // Find maximum n and k
        int maxN = 0, maxK = 0;
        for (int[] query : queries) {
            maxN = Math.max(maxN, query[0]);
            maxK = Math.max(maxK, query[1]);
        }

        // Precompute primes
        List<Integer> primes = sieve(maxK);

        // Precompute binomial coefficients
        // Maximum exponent: 2^14 = 16384 > 10000
        int maxExponent = 14;
        int maxCombN = maxN + maxExponent;

        // comb[i][j] = C(i, j) mod MOD
        int[][] comb = new int[maxCombN + 1][maxExponent + 1];

        // Base cases
        for (int i = 0; i <= maxCombN; i++) {
            comb[i][0] = 1;
            if (i <= maxExponent) {
                comb[i][i] = 1;
            }
        }

        // Pascal's triangle
        for (int i = 1; i <= maxCombN; i++) {
            int limit = Math.min(i, maxExponent);
            for (int j = 1; j <= limit; j++) {
                comb[i][j] = (comb[i-1][j-1] + comb[i-1][j]) % MOD;
            }
        }

        // Process queries
        int[] result = new int[queries.length];
        for (int idx = 0; idx < queries.length; idx++) {
            int n = queries[idx][0];
            int k = queries[idx][1];
            long ways = 1; // Use long to avoid overflow before mod

            // Factorize k
            int tempK = k;
            for (int p : primes) {
                if (p * p > tempK) break;

                if (tempK % p == 0) {
                    int e = 0;
                    while (tempK % p == 0) {
                        tempK /= p;
                        e++;
                    }
                    // C(e + n - 1, n - 1) = C(e + n - 1, e)
                    ways = (ways * comb[e + n - 1][e]) % MOD;
                }
            }

            // Remaining prime factor
            if (tempK > 1) {
                ways = (ways * comb[1 + n - 1][1]) % MOD;
            }

            result[idx] = (int) ways;
        }

        return result;
    }

    private List<Integer> sieve(int limit) {
        if (limit < 2) return new ArrayList<>();

        boolean[] isPrime = new boolean[limit + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;

        for (int i = 2; i * i <= limit; i++) {
            if (isPrime[i]) {
                for (int j = i * i; j <= limit; j += i) {
                    isPrime[j] = false;
                }
            }
        }

        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= limit; i++) {
            if (isPrime[i]) primes.add(i);
        }

        return primes;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Precomputing primes up to `max_k`: `O(max_k log log max_k)` using sieve
- Precomputing binomial coefficients: `O((max_n + max_exponent) × max_exponent)`
- Processing Q queries: `O(Q × (number of prime factors of k))`
  - Each factorization takes `O(√k / log k)` using trial division by primes
- Total: `O(max_k log log max_k + (max_n × max_exponent) + Q × (√k / log k))`

**Space Complexity:**

- Storing primes: `O(max_k / log max_k)` (number of primes up to max_k)
- Binomial coefficient table: `O((max_n + max_exponent) × max_exponent)`
- Total: `O(max_k / log max_k + max_n × max_exponent)`

For constraints (k ≤ 10⁴, n ≤ 10⁵, Q ≤ 10⁴), this is efficient.

## Common Mistakes

1. **Forgetting that order matters**: The problem counts `[2, 6]` and `[6, 2]` as different arrays. Some candidates mistakenly use integer partition formulas that ignore order.

2. **Not handling large results with modulo**: The number of ways grows extremely fast. Candidates must apply modulo `10⁹+7` after each multiplication, not just at the end.

3. **Inefficient factorization**: Trying to factorize each `k` from scratch for each query without precomputing primes leads to `O(Q√k)` which may be too slow. Using a precomputed prime list reduces this to `O(Q × (√k / log k))`.

4. **Incorrect binomial coefficient bounds**: The exponent `e` can be up to ~13 for k ≤ 10⁴, but candidates might allocate too large a table. We only need `C(n+e-1, e)` where `e ≤ max_exponent`, not all `C(n, r)`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prime factorization as a reduction tool**: Problems like [Smallest Value After Replacing With Sum of Prime Factors](/problem/smallest-value-after-replacing-with-sum-of-prime-factors) also use factorization to transform the problem.

2. **Stars and bars combinatorics**: Used in counting problems where you distribute identical items into distinct bins. Similar to [Count the Number of Ideal Arrays](/problem/count-the-number-of-ideal-arrays) which also uses combinatorics with constraints.

3. **Precomputation for multiple queries**: When dealing with many queries, precomputing primes, factorials, or binomial coefficients is essential. Problems like counting primes in ranges use similar techniques.

## Key Takeaways

1. **Multiplicative to additive transformation**: Prime factorization converts product constraints into sum constraints, making combinatorial counting possible.

2. **Stars and bars formula**: For distributing `e` identical items into `n` distinct boxes, use `C(e + n - 1, n - 1)`. Remember: "identical items, distinct boxes."

3. **Precomputation strategy**: When queries have bounded inputs (k ≤ 10⁴), precompute primes and binomial coefficients once, then answer each query in time proportional to the number of prime factors.

Related problems: [Count the Number of Ideal Arrays](/problem/count-the-number-of-ideal-arrays), [Smallest Value After Replacing With Sum of Prime Factors](/problem/smallest-value-after-replacing-with-sum-of-prime-factors), [Closest Prime Numbers in Range](/problem/closest-prime-numbers-in-range)
