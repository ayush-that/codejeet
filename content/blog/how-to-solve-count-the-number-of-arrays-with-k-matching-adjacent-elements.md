---
title: "How to Solve Count the Number of Arrays with K Matching Adjacent Elements — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count the Number of Arrays with K Matching Adjacent Elements. Hard difficulty, 58.4% acceptance rate. Topics: Math, Combinatorics."
date: "2028-02-10"
category: "dsa-patterns"
tags:
  ["count-the-number-of-arrays-with-k-matching-adjacent-elements", "math", "combinatorics", "hard"]
---

# How to Solve Count the Number of Arrays with K Matching Adjacent Elements

You need to count arrays of length `n` where each element is between 1 and `m`, and exactly `k` adjacent pairs are equal. The challenge is that `n` can be up to 5000, making brute force enumeration impossible—we need a combinatorial approach.

## Visual Walkthrough

Let's trace through a small example: `n = 3, m = 2, k = 1`.

We need arrays of length 3 with values 1-2, where exactly 1 adjacent pair matches.

**Step 1:** List all possible arrays (2³ = 8 total):

- [1,1,1] → 2 matching pairs (i=1: 1==1, i=2: 1==1) → NO
- [1,1,2] → 1 matching pair (i=1: 1==1) → YES
- [1,2,1] → 0 matching pairs → NO
- [1,2,2] → 1 matching pair (i=2: 2==2) → YES
- [2,1,1] → 1 matching pair (i=2: 1==1) → YES
- [2,1,2] → 0 matching pairs → NO
- [2,2,1] → 1 matching pair (i=1: 2==2) → YES
- [2,2,2] → 2 matching pairs → NO

**Step 2:** Count valid arrays: [1,1,2], [1,2,2], [2,1,1], [2,2,1] → 4 valid arrays.

**Key observation:** The problem reduces to: we have `n` positions, we need exactly `k` "breaks" where adjacent elements differ. Each break creates a new segment of equal values.

## Brute Force Approach

The brute force solution would generate all mⁿ arrays and count those with exactly `k` matching adjacent pairs. For each array, we'd check `n-1` adjacent pairs.

```python
def brute_force(n, m, k):
    count = 0
    # Generate all arrays via recursion
    def dfs(arr):
        nonlocal count
        if len(arr) == n:
            # Count matching adjacent pairs
            matches = sum(1 for i in range(1, n) if arr[i-1] == arr[i])
            if matches == k:
                count += 1
            return
        for val in range(1, m+1):
            dfs(arr + [val])
    dfs([])
    return count
```

**Why it fails:** With `n` up to 5000 and `m` up to 10⁹, mⁿ is astronomically large. Even for small `n=20, m=10`, we'd have 10²⁰ arrays to check—completely infeasible.

## Optimized Approach

The key insight is to think in terms of **segments** rather than individual positions:

1. If we have exactly `k` matching adjacent pairs, then we have `n-k` segments (groups of consecutive equal values).
2. The first element can be any of `m` values.
3. For each subsequent segment, the value must differ from the previous segment's value, so we have `m-1` choices.
4. Therefore, the number of ways to choose values for segments is: `m × (m-1)^(n-k-1)`.

But wait—this counts arrays with **at least** `k` matching pairs, not exactly `k`. We need to ensure no additional matches beyond the `k` required ones.

**Correct combinatorial reasoning:**

- We need exactly `k` positions where `arr[i-1] == arr[i]`
- This means we have `n-k` segments of equal values
- First segment: `m` choices for its value
- Each subsequent segment: `m-1` choices (must differ from previous segment)
- Total value assignments: `m × (m-1)^(n-k-1)`

But we also need to choose **which positions** are the matching ones. The `k` matches occur at the boundaries between segments. With `n-k` segments, we have `n-1` possible boundaries, and we need to choose `k` of them to be matches.

**Final formula:** `C(n-1, k) × m × (m-1)^(n-k-1)`

Where `C(n-1, k)` is the binomial coefficient "n-1 choose k".

**Special cases:**

- If `k > n-1`: impossible, return 0
- If `m == 1`: only one array possible [1,1,...,1]
  - If `k == n-1`: return 1 (all pairs match)
  - Else: return 0 (can't have exactly k matches when all must match)

## Optimal Solution

We need efficient computation of:

1. Binomial coefficient `C(n-1, k)` modulo 10⁹+7
2. Modular exponentiation for `(m-1)^(n-k-1)`

We'll use:

- Precomputed factorials for binomial coefficients
- Fast modular exponentiation
- Modular arithmetic throughout

<div class="code-group">

```python
MOD = 10**9 + 7

class Solution:
    def numOfArrays(self, n: int, m: int, k: int) -> int:
        # If k is impossible (more matches than possible positions)
        if k > n - 1:
            return 0

        # Special case: m = 1
        if m == 1:
            # Only one possible array: all 1's
            # This has n-1 matching pairs if n > 1
            return 1 if k == n - 1 else 0

        # Precompute factorials and inverse factorials up to n
        fact = [1] * (n + 1)
        inv_fact = [1] * (n + 1)

        for i in range(1, n + 1):
            fact[i] = fact[i-1] * i % MOD

        # Fermat's little theorem for modular inverse
        inv_fact[n] = pow(fact[n], MOD-2, MOD)
        for i in range(n-1, -1, -1):
            inv_fact[i] = inv_fact[i+1] * (i+1) % MOD

        # Helper function for binomial coefficient
        def comb(a, b):
            if b < 0 or b > a:
                return 0
            return fact[a] * inv_fact[b] % MOD * inv_fact[a-b] % MOD

        # Calculate components
        # 1. Choose positions for the k matches: C(n-1, k)
        ways_to_choose_matches = comb(n-1, k)

        # 2. First segment: m choices
        first_segment_choices = m % MOD

        # 3. Remaining segments: (m-1)^(n-k-1) choices
        # There are n-k segments total, first one already counted
        remaining_segments = n - k - 1
        if remaining_segments < 0:
            # This happens when k = n-1 (all pairs match)
            # Only one way: all elements same
            return (ways_to_choose_matches * first_segment_choices) % MOD

        segment_choices = pow((m-1) % MOD, remaining_segments, MOD)

        # Combine all components
        result = ways_to_choose_matches * first_segment_choices % MOD
        result = result * segment_choices % MOD

        return result
```

```javascript
const MOD = 1_000_000_007n;

/**
 * @param {number} n
 * @param {number} m
 * @param {number} k
 * @return {number}
 */
var numOfArrays = function (n, m, k) {
  // If k is impossible (more matches than possible positions)
  if (k > n - 1) return 0;

  // Special case: m = 1
  if (m === 1) {
    // Only one possible array: all 1's
    // This has n-1 matching pairs if n > 1
    return k === n - 1 ? 1 : 0;
  }

  // Precompute factorials and inverse factorials up to n
  const fact = new Array(n + 1).fill(1n);
  const invFact = new Array(n + 1).fill(1n);

  for (let i = 1; i <= n; i++) {
    fact[i] = (fact[i - 1] * BigInt(i)) % MOD;
  }

  // Fermat's little theorem for modular inverse
  invFact[n] = modPow(fact[n], MOD - 2n);
  for (let i = n - 1; i >= 0; i--) {
    invFact[i] = (invFact[i + 1] * BigInt(i + 1)) % MOD;
  }

  // Helper function for binomial coefficient
  const comb = (a, b) => {
    if (b < 0 || b > a) return 0n;
    return (((fact[a] * invFact[b]) % MOD) * invFact[a - b]) % MOD;
  };

  // Fast modular exponentiation
  function modPow(base, exp) {
    let result = 1n;
    base %= MOD;
    while (exp > 0) {
      if (exp % 2n === 1n) {
        result = (result * base) % MOD;
      }
      base = (base * base) % MOD;
      exp = exp / 2n;
    }
    return result;
  }

  // Calculate components
  // 1. Choose positions for the k matches: C(n-1, k)
  const waysToChooseMatches = comb(n - 1, k);

  // 2. First segment: m choices
  const firstSegmentChoices = BigInt(m) % MOD;

  // 3. Remaining segments: (m-1)^(n-k-1) choices
  const remainingSegments = n - k - 1;
  if (remainingSegments < 0) {
    // This happens when k = n-1 (all pairs match)
    // Only one way: all elements same
    return Number((waysToChooseMatches * firstSegmentChoices) % MOD);
  }

  const segmentChoices = modPow(BigInt(m - 1), BigInt(remainingSegments));

  // Combine all components
  let result = (waysToChooseMatches * firstSegmentChoices) % MOD;
  result = (result * segmentChoices) % MOD;

  return Number(result);
};
```

```java
class Solution {
    private static final int MOD = 1_000_000_007;

    public int numOfArrays(int n, int m, int k) {
        // If k is impossible (more matches than possible positions)
        if (k > n - 1) return 0;

        // Special case: m = 1
        if (m == 1) {
            // Only one possible array: all 1's
            // This has n-1 matching pairs if n > 1
            return k == n - 1 ? 1 : 0;
        }

        // Precompute factorials and inverse factorials up to n
        long[] fact = new long[n + 1];
        long[] invFact = new long[n + 1];
        fact[0] = 1;

        for (int i = 1; i <= n; i++) {
            fact[i] = fact[i-1] * i % MOD;
        }

        // Fermat's little theorem for modular inverse
        invFact[n] = modPow(fact[n], MOD - 2);
        for (int i = n - 1; i >= 0; i--) {
            invFact[i] = invFact[i+1] * (i+1) % MOD;
        }

        // Helper function for binomial coefficient
        // 1. Choose positions for the k matches: C(n-1, k)
        long waysToChooseMatches = comb(n-1, k, fact, invFact);

        // 2. First segment: m choices
        long firstSegmentChoices = m % MOD;

        // 3. Remaining segments: (m-1)^(n-k-1) choices
        int remainingSegments = n - k - 1;
        if (remainingSegments < 0) {
            // This happens when k = n-1 (all pairs match)
            // Only one way: all elements same
            return (int)(waysToChooseMatches * firstSegmentChoices % MOD);
        }

        long segmentChoices = modPow((m-1) % MOD, remainingSegments);

        // Combine all components
        long result = waysToChooseMatches * firstSegmentChoices % MOD;
        result = result * segmentChoices % MOD;

        return (int)result;
    }

    private long comb(int a, int b, long[] fact, long[] invFact) {
        if (b < 0 || b > a) return 0;
        return fact[a] * invFact[b] % MOD * invFact[a-b] % MOD;
    }

    private long modPow(long base, long exp) {
        long result = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1) == 1) {
                result = result * base % MOD;
            }
            base = base * base % MOD;
            exp >>= 1;
        }
        return result;
    }

    // Overload for int exponent
    private long modPow(long base, int exp) {
        return modPow(base, (long)exp);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We compute factorials up to n: O(n)
- We compute inverse factorials: O(n)
- Modular exponentiation: O(log(n-k-1)) which is O(log n)
- Overall: O(n) dominates

**Space Complexity:** O(n)

- We store factorials and inverse factorials arrays of size n+1

## Common Mistakes

1. **Forgetting the m=1 special case**: When m=1, there's only one possible array [1,1,...,1]. This has n-1 matching pairs if n>1. Many solutions fail when m=1 and k≠n-1.

2. **Incorrect exponent calculation**: The exponent for (m-1) is `n-k-1`, not `n-k`. We have n-k segments total, and the first segment's choice is separate (m choices).

3. **Not handling large exponents efficiently**: Computing (m-1)^(n-k-1) directly would overflow. We need modular exponentiation with O(log n) time.

4. **Missing the binomial coefficient**: Some solutions try `m × (m-1)^(n-k-1)` without `C(n-1, k)`, which counts arrangements where the matching positions are predetermined rather than chosen.

## When You'll See This Pattern

This problem combines **combinatorics** with **modular arithmetic**—a common pattern in counting problems:

1. **Count Good Numbers (Medium)**: Similar combinatorial counting with modular exponentiation.
2. **Count Sorted Vowel Strings (Medium)**: Counting sequences with constraints on adjacent elements.
3. **Paint House II (Hard)**: Counting ways with adjacency constraints, though typically solved with DP.

The core technique is: when counting arrangements with adjacency constraints, think in terms of segments rather than individual positions, and use combinatorial formulas instead of enumeration.

## Key Takeaways

1. **Convert adjacency constraints to segment counting**: When dealing with "adjacent elements equal/different" conditions, count segments of consecutive equal values instead of individual positions.

2. **Combine combinatorial components**: The total count = (ways to choose positions) × (ways to assign values to segments). This multiplicative approach is cleaner than trying to count everything at once.

3. **Handle edge cases systematically**: Special cases like m=1 or k=n-1 often break the general formula. Test these explicitly.

Related problems: [Count Good Numbers](/problem/count-good-numbers)
