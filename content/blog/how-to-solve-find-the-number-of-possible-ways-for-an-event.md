---
title: "How to Solve Find the Number of Possible Ways for an Event — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Number of Possible Ways for an Event. Hard difficulty, 34.9% acceptance rate. Topics: Math, Dynamic Programming, Combinatorics."
date: "2026-08-26"
category: "dsa-patterns"
tags:
  [
    "find-the-number-of-possible-ways-for-an-event",
    "math",
    "dynamic-programming",
    "combinatorics",
    "hard",
  ]
---

# How to Solve "Find the Number of Possible Ways for an Event"

This problem asks: given `n` performers, `x` stages, and `y` bands, count the number of ways to assign performers to stages such that all performers on the same stage form a band, and exactly `y` bands perform (some stages may be empty). The challenge lies in the combinatorial nature — we must count assignments where exactly `y` stages are non-empty, and performers on those stages form distinct bands.

**What makes this tricky:** It combines two combinatorial concepts: 1) partitioning `n` items into exactly `y` non-empty groups (Stirling numbers), and 2) assigning those groups to `x` available stages (permutations). Many candidates recognize the combinatorial formula but struggle with implementation due to large numbers and modular arithmetic.

## Visual Walkthrough

Let's trace through example `n=3, x=2, y=2`:

We have 3 performers (A,B,C), 2 stages, and want exactly 2 bands performing.

**Step 1: Partition performers into exactly 2 non-empty groups**
Possible partitions of 3 items into 2 groups:

- Group sizes: (1,2)
- Specific partitions: {A} and {B,C}, {B} and {A,C}, {C} and {A,B}
  That's 3 partitions.

**Step 2: Assign groups to 2 available stages**
For each partition, we need to assign groups to stages. Since stages are distinct, we're essentially permuting the 2 groups across 2 stages:

- For partition {A} and {B,C}: assign to stage1/stage2 → 2! = 2 arrangements
- Same for other partitions → each has 2 arrangements

**Step 3: Calculate total ways**
Total = (number of partitions) × (arrangements of groups to stages)
= 3 × 2 = 6

Let's verify one assignment: Partition {A} and {B,C}. Assign {A} to stage1, {B,C} to stage2 → Band1: {A}, Band2: {B,C}. This is valid since exactly 2 bands perform.

## Brute Force Approach

A naive approach would enumerate all possible assignments of each performer to a stage (including empty stages), then filter those with exactly `y` non-empty stages. For `n` performers and `x` stages, each performer has `x` choices, giving `x^n` total assignments. We'd then:

1. Generate all `x^n` assignments
2. For each, count non-empty stages
3. Keep those with exactly `y` non-empty stages

**Why this fails:** For `n=100`, `x=100`, we'd have `100^100` assignments — astronomically large. Even with pruning, the exponential growth makes this infeasible. We need a combinatorial formula rather than enumeration.

## Optimized Approach

The key insight: This problem reduces to computing:

```
answer = S(n, y) × P(x, y) mod MOD
```

Where:

- `S(n, y)` = Stirling numbers of the second kind (ways to partition `n` items into exactly `y` non-empty groups)
- `P(x, y)` = permutations of `x` items taken `y` at a time (ways to assign `y` groups to `x` distinct stages)

**Reasoning step-by-step:**

1. **Partition performers into bands:** We need exactly `y` bands, so we partition `n` performers into exactly `y` non-empty groups. This is exactly the definition of Stirling numbers of the second kind `S(n, y)`.

2. **Assign bands to stages:** We have `x` distinct stages, and need to assign `y` bands to them. Since bands are distinct (different performers), and stages are distinct, this is a permutation problem: choose `y` stages from `x` and assign bands to them → `P(x, y) = x!/(x-y)!`.

3. **Combine:** Multiply these counts since partitioning and assignment are independent.

4. **Handle constraints:** If `y > n` or `y > x`, answer is 0 (can't have more bands than performers or stages).

**Computing Stirling numbers efficiently:** Use dynamic programming with the recurrence:

```
S(n, k) = k × S(n-1, k) + S(n-1, k-1)
```

Base cases: `S(0,0)=1`, `S(n,0)=0` for n>0, `S(0,k)=0` for k>0.

**Modular arithmetic:** Since results can be huge, compute modulo `10^9+7`.

## Optimal Solution

<div class="code-group">

```python
MOD = 10**9 + 7

def numberOfWays(n: int, x: int, y: int) -> int:
    """
    Count ways to assign n performers to x stages forming exactly y bands.
    Time: O(n*y) - DP for Stirling numbers
    Space: O(n*y) - can be optimized to O(y) but clarity preferred
    """
    # Edge cases: can't have more bands than performers or stages
    if y > n or y > x:
        return 0

    # Step 1: Compute Stirling numbers S(n, y) using DP
    # dp[i][j] = S(i, j) = ways to partition i items into j non-empty groups
    dp = [[0] * (y + 1) for _ in range(n + 1)]
    dp[0][0] = 1  # Base case: empty partition

    for i in range(1, n + 1):
        # j can't exceed i (can't have more groups than items)
        for j in range(1, min(i, y) + 1):
            # Recurrence: S(i,j) = j * S(i-1,j) + S(i-1,j-1)
            # j * S(i-1,j): add i-th item to existing j groups
            # S(i-1,j-1): put i-th item in its own new group
            dp[i][j] = (j * dp[i-1][j] + dp[i-1][j-1]) % MOD

    # Step 2: Compute permutations P(x, y) = x!/(x-y)!
    # Compute iteratively: x * (x-1) * ... * (x-y+1)
    permutations = 1
    for i in range(y):
        permutations = (permutations * (x - i)) % MOD

    # Step 3: Combine results
    result = (dp[n][y] * permutations) % MOD
    return result
```

```javascript
const MOD = 1000000007n; // Use BigInt for safety with large multiplications

function numberOfWays(n, x, y) {
  /**
   * Count ways to assign n performers to x stages forming exactly y bands.
   * Time: O(n*y) - DP for Stirling numbers
   * Space: O(n*y) - can be optimized to O(y) but clarity preferred
   */
  // Edge cases: can't have more bands than performers or stages
  if (y > n || y > x) {
    return 0;
  }

  // Step 1: Compute Stirling numbers S(n, y) using DP
  // dp[i][j] = S(i, j) = ways to partition i items into j non-empty groups
  const dp = Array.from({ length: n + 1 }, () => new Array(y + 1).fill(0n));
  dp[0][0] = 1n; // Base case: empty partition

  for (let i = 1; i <= n; i++) {
    // j can't exceed i (can't have more groups than items)
    const maxJ = Math.min(i, y);
    for (let j = 1; j <= maxJ; j++) {
      // Recurrence: S(i,j) = j * S(i-1,j) + S(i-1,j-1)
      // j * S(i-1,j): add i-th item to existing j groups
      // S(i-1,j-1): put i-th item in its own new group
      const term1 = (BigInt(j) * dp[i - 1][j]) % MOD;
      const term2 = dp[i - 1][j - 1] % MOD;
      dp[i][j] = (term1 + term2) % MOD;
    }
  }

  // Step 2: Compute permutations P(x, y) = x!/(x-y)!
  // Compute iteratively: x * (x-1) * ... * (x-y+1)
  let permutations = 1n;
  for (let i = 0; i < y; i++) {
    permutations = (permutations * BigInt(x - i)) % MOD;
  }

  // Step 3: Combine results
  const result = (dp[n][y] * permutations) % MOD;
  return Number(result);
}
```

```java
class Solution {
    private static final int MOD = 1000000007;

    public int numberOfWays(int n, int x, int y) {
        /**
         * Count ways to assign n performers to x stages forming exactly y bands.
         * Time: O(n*y) - DP for Stirling numbers
         * Space: O(n*y) - can be optimized to O(y) but clarity preferred
         */
        // Edge cases: can't have more bands than performers or stages
        if (y > n || y > x) {
            return 0;
        }

        // Step 1: Compute Stirling numbers S(n, y) using DP
        // dp[i][j] = S(i, j) = ways to partition i items into j non-empty groups
        long[][] dp = new long[n + 1][y + 1];
        dp[0][0] = 1; // Base case: empty partition

        for (int i = 1; i <= n; i++) {
            // j can't exceed i (can't have more groups than items)
            int maxJ = Math.min(i, y);
            for (int j = 1; j <= maxJ; j++) {
                // Recurrence: S(i,j) = j * S(i-1,j) + S(i-1,j-1)
                // j * S(i-1,j): add i-th item to existing j groups
                // S(i-1,j-1): put i-th item in its own new group
                long term1 = (j * dp[i-1][j]) % MOD;
                long term2 = dp[i-1][j-1] % MOD;
                dp[i][j] = (term1 + term2) % MOD;
            }
        }

        // Step 2: Compute permutations P(x, y) = x!/(x-y)!
        // Compute iteratively: x * (x-1) * ... * (x-y+1)
        long permutations = 1;
        for (int i = 0; i < y; i++) {
            permutations = (permutations * (x - i)) % MOD;
        }

        // Step 3: Combine results
        long result = (dp[n][y] * permutations) % MOD;
        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n × y)`

- The DP for Stirling numbers has `n` iterations, each computing up to `y` values → `O(n × y)`
- Computing permutations takes `O(y)` time
- Overall dominated by `O(n × y)`

**Space Complexity:** `O(n × y)` for the DP table

- We store `(n+1) × (y+1)` values for the Stirling numbers
- Can be optimized to `O(y)` using only two rows since we only need previous row, but the `O(n × y)` version is clearer for understanding

## Common Mistakes

1. **Forgetting modular arithmetic:** The results grow extremely fast (factorials of up to 10^5). Without modulo operations, integers overflow even with 64-bit types. Always apply `% MOD` after each multiplication.

2. **Incorrect Stirling number computation:** The recurrence `S(n,k) = k*S(n-1,k) + S(n-1,k-1)` has two common errors:
   - Using `(k-1)` instead of `k` for the first term
   - Missing base case `S(0,0)=1`
     Always test with small values: `S(3,2)=3`, `S(4,2)=7`

3. **Wrong permutation formula:** Using combinations `C(x,y)` instead of permutations `P(x,y)`. Remember: stages are distinct, and assigning band A to stage1 vs stage2 creates different arrangements.

4. **Not handling edge cases:** When `y > n` or `y > x`, answer should be 0. Also handle `y=0`: only valid if `n=0` (no performers), otherwise 0 since we can't have 0 bands with performers.

## When You'll See This Pattern

This combinatorial DP pattern appears in problems involving:

1. **Partitions and assignments:** Any problem asking "ways to divide N items into K groups" likely uses Stirling numbers.
2. **Distinct arrangements with constraints:** Problems where items must be assigned to distinct containers with capacity/empty constraints.

**Related LeetCode problems:**

- **"Count Ways to Build Rooms in an Ant Colony" (Hard):** Similar combinatorial counting with modular arithmetic.
- **"Number of Ways to Rearrange Sticks With K Sticks Visible" (Hard):** Uses Stirling-like numbers (unsigned Stirling of first kind).
- **"Kth Smallest Amount With Single Denomination Combination" (Hard):** Mentioned as similar — involves combinatorial counting with inclusion-exclusion.

## Key Takeaways

1. **Recognize combinatorial building blocks:** This problem combines Stirling numbers (partitions) with permutations (assignments). Many hard combinatorics problems are combinations of simpler counting principles.

2. **DP for combinatorial numbers:** Stirling numbers, binomial coefficients, and other combinatorial sequences often have efficient DP recurrences. Memorize common ones: `S(n,k)=k*S(n-1,k)+S(n-1,k-1)`, `C(n,k)=C(n-1,k)+C(n-1,k-1)`.

3. **Modular arithmetic is essential:** When problem statements include "modulo 10^9+7" or results are huge, apply modulo after each operation, not just at the end, to prevent overflow.

Related problems: [Kth Smallest Amount With Single Denomination Combination](/problem/kth-smallest-amount-with-single-denomination-combination)
