---
title: "How to Solve Profitable Schemes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Profitable Schemes. Hard difficulty, 48.2% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-12-02"
category: "dsa-patterns"
tags: ["profitable-schemes", "array", "dynamic-programming", "hard"]
---

# How to Solve Profitable Schemes

This problem asks us to count the number of ways to commit crimes using up to `n` members while achieving at least `minProfit`, where each crime has a member requirement and profit value. The challenge lies in the combinatorial explosion of possibilities—we need to count subsets of crimes that satisfy constraints, which screams for dynamic programming rather than brute force enumeration.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- n = 5 (5 members available)
- minProfit = 3
- group = [2, 2] (crime 0 needs 2 members, crime 1 needs 2 members)
- profit = [1, 2] (crime 0 gives profit 1, crime 1 gives profit 2)

We want to count subsets of crimes where:

1. Total members used ≤ 5
2. Total profit ≥ 3

Let's enumerate possibilities:

**Option 1: Commit only crime 0**

- Members used: 2 ≤ 5 ✓
- Profit: 1 < 3 ✗ (not enough profit)

**Option 2: Commit only crime 1**

- Members used: 2 ≤ 5 ✓
- Profit: 2 < 3 ✗ (not enough profit)

**Option 3: Commit both crimes**

- Members used: 2 + 2 = 4 ≤ 5 ✓
- Profit: 1 + 2 = 3 ≥ 3 ✓

So there's exactly 1 profitable scheme. The key insight: we need to track two dimensions—members used and profit achieved—as we consider each crime.

## Brute Force Approach

A naive solution would generate all 2^m subsets of crimes (where m = number of crimes), check each subset's total members and profit, and count those satisfying constraints. For each subset, we sum the group sizes and profits, then compare against n and minProfit.

**Why this fails:**

- With m up to 100, 2^100 subsets is astronomically large (~1.27 × 10^30)
- Even with pruning (stopping when members exceed n), the search space is still exponential
- We need a polynomial-time solution

The brute force teaches us what we're trying to compute but doesn't scale. We need to avoid recomputing the same subproblems.

## Optimized Approach

This is a classic **0/1 knapsack problem with two constraints** (members and profit). We can use dynamic programming where:

`dp[i][j]` = number of ways to achieve exactly `j` profit using exactly `i` members

But wait—we need "at least" minProfit, not "exactly." We can handle this by:

1. Tracking profit up to minProfit (any profit ≥ minProfit gets capped at minProfit)
2. At the end, summing all ways with profit ≥ minProfit

**Key insight:** Since we only care about reaching minProfit, any profit beyond minProfit is equivalent to exactly minProfit. This allows us to bound our DP table size.

**DP State Transition:**
For each crime (group size `g`, profit `p`), we update our DP table from high to low (to avoid reusing the same crime multiple times):

- If we don't take the crime: dp[i][j] stays the same
- If we take the crime: dp[i+g][min(j+p, minProfit)] += dp[i][j] (if i+g ≤ n)

**Base case:** dp[0][0] = 1 (one way to do nothing: 0 members, 0 profit)

## Optimal Solution

We implement a 2D DP array where dp[i][j] = number of schemes using exactly i members and achieving at least j profit (with j capped at minProfit).

<div class="code-group">

```python
# Time: O(m * n * minProfit) where m = number of crimes
# Space: O(n * minProfit)
def profitableSchemes(n, minProfit, group, profit):
    MOD = 10**9 + 7
    m = len(group)

    # dp[i][j] = number of ways to use exactly i members
    # and achieve at least j profit (j capped at minProfit)
    dp = [[0] * (minProfit + 1) for _ in range(n + 1)]

    # Base case: 0 members, 0 profit = 1 way (do nothing)
    dp[0][0] = 1

    # Process each crime
    for g, p in zip(group, profit):
        # Iterate backwards to avoid reusing the same crime
        for i in range(n, -1, -1):
            for j in range(minProfit, -1, -1):
                # Check if we can add this crime
                if i + g <= n:
                    # New profit is min(j + p, minProfit) since we cap at minProfit
                    new_profit = min(j + p, minProfit)
                    dp[i + g][new_profit] = (dp[i + g][new_profit] + dp[i][j]) % MOD

    # Sum all ways using up to n members with at least minProfit
    total = 0
    for i in range(n + 1):
        total = (total + dp[i][minProfit]) % MOD

    return total
```

```javascript
// Time: O(m * n * minProfit) where m = number of crimes
// Space: O(n * minProfit)
function profitableSchemes(n, minProfit, group, profit) {
  const MOD = 10 ** 9 + 7;
  const m = group.length;

  // dp[i][j] = number of ways to use exactly i members
  // and achieve at least j profit (j capped at minProfit)
  const dp = Array.from({ length: n + 1 }, () => Array(minProfit + 1).fill(0));

  // Base case: 0 members, 0 profit = 1 way (do nothing)
  dp[0][0] = 1;

  // Process each crime
  for (let k = 0; k < m; k++) {
    const g = group[k];
    const p = profit[k];

    // Iterate backwards to avoid reusing the same crime
    for (let i = n; i >= 0; i--) {
      for (let j = minProfit; j >= 0; j--) {
        // Check if we can add this crime
        if (i + g <= n) {
          // New profit is min(j + p, minProfit) since we cap at minProfit
          const newProfit = Math.min(j + p, minProfit);
          dp[i + g][newProfit] = (dp[i + g][newProfit] + dp[i][j]) % MOD;
        }
      }
    }
  }

  // Sum all ways using up to n members with at least minProfit
  let total = 0;
  for (let i = 0; i <= n; i++) {
    total = (total + dp[i][minProfit]) % MOD;
  }

  return total;
}
```

```java
// Time: O(m * n * minProfit) where m = number of crimes
// Space: O(n * minProfit)
class Solution {
    public int profitableSchemes(int n, int minProfit, int[] group, int[] profit) {
        final int MOD = 1000000007;
        int m = group.length;

        // dp[i][j] = number of ways to use exactly i members
        // and achieve at least j profit (j capped at minProfit)
        int[][] dp = new int[n + 1][minProfit + 1];

        // Base case: 0 members, 0 profit = 1 way (do nothing)
        dp[0][0] = 1;

        // Process each crime
        for (int k = 0; k < m; k++) {
            int g = group[k];
            int p = profit[k];

            // Iterate backwards to avoid reusing the same crime
            for (int i = n; i >= 0; i--) {
                for (int j = minProfit; j >= 0; j--) {
                    // Check if we can add this crime
                    if (i + g <= n) {
                        // New profit is min(j + p, minProfit) since we cap at minProfit
                        int newProfit = Math.min(j + p, minProfit);
                        dp[i + g][newProfit] = (dp[i + g][newProfit] + dp[i][j]) % MOD;
                    }
                }
            }
        }

        // Sum all ways using up to n members with at least minProfit
        int total = 0;
        for (int i = 0; i <= n; i++) {
            total = (total + dp[i][minProfit]) % MOD;
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n × minProfit)

- We iterate through all m crimes
- For each crime, we iterate through all possible member counts (0 to n) and profit values (0 to minProfit)
- The triple nested loops give us O(m × n × minProfit)

**Space Complexity:** O(n × minProfit)

- We maintain a 2D DP table of size (n+1) × (minProfit+1)
- We could optimize to O(n × minProfit) by reusing the same array (as shown in our solution which updates in-place backwards)

## Common Mistakes

1. **Not iterating backwards in the DP loops**: When we iterate forwards, we might reuse the same crime multiple times (like an unbounded knapsack). Since each crime can be used at most once, we must iterate backwards to ensure we don't count schemes where the same crime appears multiple times.

2. **Forgetting to cap profit at minProfit**: If we don't cap profit values at minProfit, our DP table would need size n × (sum of all profits), which could be huge (up to 100 × 10000 = 1M cells). The insight that profit beyond minProfit is equivalent to exactly minProfit is crucial for efficiency.

3. **Missing the modulo operation**: The result can be very large, so we need to apply modulo 10^9+7 after each addition. Forgetting this can cause integer overflow or incorrect results.

4. **Incorrect base case**: dp[0][0] should be 1 (the empty scheme), not 0. This represents the option of committing no crimes.

## When You'll See This Pattern

This is a **2D knapsack DP** problem with profit capping. Similar patterns appear in:

1. **Target Sum (LeetCode 494)**: Count ways to assign +/- to numbers to reach target sum. Like our problem, it counts subsets satisfying a constraint.

2. **Coin Change 2 (LeetCode 518)**: Count ways to make amount with coins. Similar DP structure but with unbounded items (coins can be reused).

3. **Partition Equal Subset Sum (LeetCode 416)**: Check if array can be partitioned into two equal sum subsets. Uses subset sum DP similar to our profit dimension.

The key pattern: when you need to count subsets satisfying multiple constraints, think multi-dimensional DP where each dimension represents one constraint.

## Key Takeaways

1. **Multi-constraint subset counting → multi-dimensional DP**: When counting subsets with constraints on sum/weight/profit, use DP where each dimension tracks one constraint.

2. **"At least" constraints can be capped**: If you need "at least X" of something, you can cap values at X in your DP to reduce state space. Any value ≥ X is equivalent to exactly X for counting purposes.

3. **0/1 knapsack requires backwards iteration**: To ensure each item is used at most once, iterate backwards through the DP array when updating in-place.

[Practice this problem on CodeJeet](/problem/profitable-schemes)
