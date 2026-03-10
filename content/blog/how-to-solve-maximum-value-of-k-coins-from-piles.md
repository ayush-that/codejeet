---
title: "How to Solve Maximum Value of K Coins From Piles — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Value of K Coins From Piles. Hard difficulty, 60.4% acceptance rate. Topics: Array, Dynamic Programming, Prefix Sum."
date: "2027-11-04"
category: "dsa-patterns"
tags: ["maximum-value-of-k-coins-from-piles", "array", "dynamic-programming", "prefix-sum", "hard"]
---

# How to Solve Maximum Value of K Coins From Piles

You have `n` piles of coins, each with coins stacked in order. You can take coins from the top of any pile, and you want to maximize the total value after taking exactly `k` coins. The challenge is that coins in each pile are only accessible from the top down, so you can't skip coins within a pile. This makes it a constrained selection problem where you need to decide how many coins to take from each pile while respecting the pile order.

## Visual Walkthrough

Let's trace through a small example: `piles = [[1,100,3],[7,8,9]]`, `k = 3`.

We have 2 piles:

- Pile 0: [1, 100, 3] (top to bottom: 1, then 100, then 3)
- Pile 1: [7, 8, 9] (top to bottom: 7, then 8, then 9)

We need to choose exactly 3 coins total. Let's think through some possibilities:

**Option 1**: Take all 3 coins from pile 0 → [1, 100, 3] = 104 total
**Option 2**: Take all 3 coins from pile 1 → [7, 8, 9] = 24 total  
**Option 3**: Take 2 from pile 0 and 1 from pile 1:

- From pile 0: take top 2 coins [1, 100] = 101
- From pile 1: take top coin [7] = 7
- Total = 108

**Option 4**: Take 1 from pile 0 and 2 from pile 1:

- From pile 0: take top coin [1] = 1
- From pile 1: take top 2 coins [7, 8] = 15
- Total = 16

The best is option 3 with total 108. Notice we can't take just the 100 from pile 0 without also taking the 1 on top of it. This ordering constraint is what makes the problem interesting.

## Brute Force Approach

A naive approach would try all possible ways to distribute `k` coins across `n` piles. For each pile `i`, we could take between 0 and `min(k, len(piles[i]))` coins from that pile. We'd need to explore all combinations where the total coins taken equals `k`.

This leads to exponential time complexity. For each pile, we have up to `k+1` choices, and with `n` piles, that's roughly `O((k+1)^n)` possibilities. Even for moderate values like `n=10` and `k=10`, that's `11^10 ≈ 2.6×10^10` possibilities - far too many.

The brute force fails because it recomputes the same subproblems many times. For example, if we take 2 coins from the first pile, we need to solve the subproblem of taking `k-2` coins from the remaining piles. This subproblem gets solved repeatedly for different paths that lead to the same state.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with two dimensions:

1. Which pile we're currently considering (pile index `i`)
2. How many coins we have left to take (remaining coins `coinsLeft`)

We can define `dp[i][coinsLeft]` as the maximum value we can get by taking exactly `coinsLeft` coins from piles starting at index `i` (piles `i` through `n-1`).

For each pile `i`, we can choose to take `t` coins from it (where `0 ≤ t ≤ min(coinsLeft, len(piles[i]))`). If we take `t` coins from pile `i`, we get the sum of the first `t` coins from that pile (since we can only take from the top), and then we need to take `coinsLeft - t` coins from the remaining piles.

The recurrence relation is:

```
dp[i][coinsLeft] = max(
    for t in 0..min(coinsLeft, len(piles[i])):
        prefixSum[i][t] + dp[i+1][coinsLeft - t]
)
```

where `prefixSum[i][t]` is the sum of the first `t` coins in pile `i`.

We compute `dp` from the last pile backward to the first, so when we're at pile `i`, we already know the optimal values for piles `i+1` onward.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * k * min(m, k)) where n = number of piles, k = total coins to take,
#       m = average pile size. In worst case O(n * k^2)
# Space: O(n * k) for the DP table
def maxValueOfCoins(piles, k):
    n = len(piles)

    # Precompute prefix sums for each pile
    # prefix[i][t] = sum of first t coins in pile i
    prefix = []
    for pile in piles:
        # Create prefix sum array for this pile
        # prefix[0] = 0 (taking 0 coins gives 0 value)
        # prefix[1] = pile[0] (taking 1 coin gives first coin)
        # prefix[2] = pile[0] + pile[1] (taking 2 coins gives sum of first 2)
        # etc.
        curr_prefix = [0]  # Taking 0 coins gives 0 value
        total = 0
        for coin in pile:
            total += coin
            curr_prefix.append(total)
        prefix.append(curr_prefix)

    # DP table: dp[i][coins] = max value taking exactly 'coins' coins from piles i..n-1
    # We use n+1 rows to handle i=n (no piles left) as base case
    dp = [[0] * (k + 1) for _ in range(n + 1)]

    # Fill DP table from last pile to first (bottom-up)
    for i in range(n - 1, -1, -1):
        # For current pile i, consider all possible numbers of coins to take
        for coins in range(1, k + 1):
            # Try taking t coins from current pile i
            # t can be from 0 to min(coins, number of coins in pile i)
            max_t = min(coins, len(piles[i]))

            best = 0
            for t in range(max_t + 1):
                # If we take t coins from pile i, we get prefix[i][t] value
                # Then we need to take (coins - t) coins from remaining piles (i+1..n-1)
                # dp[i+1][coins - t] gives optimal value for that subproblem
                value = prefix[i][t] + dp[i + 1][coins - t]
                best = max(best, value)

            dp[i][coins] = best

    # Answer: max value taking exactly k coins from all piles (starting at pile 0)
    return dp[0][k]
```

```javascript
// Time: O(n * k * min(m, k)) where n = number of piles, k = total coins to take,
//       m = average pile size. In worst case O(n * k^2)
// Space: O(n * k) for the DP table
function maxValueOfCoins(piles, k) {
  const n = piles.length;

  // Precompute prefix sums for each pile
  // prefix[i][t] = sum of first t coins in pile i
  const prefix = [];
  for (const pile of piles) {
    // Create prefix sum array for this pile
    // prefix[0] = 0 (taking 0 coins gives 0 value)
    // prefix[1] = pile[0] (taking 1 coin gives first coin)
    // prefix[2] = pile[0] + pile[1] (taking 2 coins gives sum of first 2)
    const currPrefix = [0]; // Taking 0 coins gives 0 value
    let total = 0;
    for (const coin of pile) {
      total += coin;
      currPrefix.push(total);
    }
    prefix.push(currPrefix);
  }

  // DP table: dp[i][coins] = max value taking exactly 'coins' coins from piles i..n-1
  // We use n+1 rows to handle i=n (no piles left) as base case
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(k + 1).fill(0));

  // Fill DP table from last pile to first (bottom-up)
  for (let i = n - 1; i >= 0; i--) {
    // For current pile i, consider all possible numbers of coins to take
    for (let coins = 1; coins <= k; coins++) {
      // Try taking t coins from current pile i
      // t can be from 0 to min(coins, number of coins in pile i)
      const maxT = Math.min(coins, piles[i].length);

      let best = 0;
      for (let t = 0; t <= maxT; t++) {
        // If we take t coins from pile i, we get prefix[i][t] value
        // Then we need to take (coins - t) coins from remaining piles (i+1..n-1)
        // dp[i+1][coins - t] gives optimal value for that subproblem
        const value = prefix[i][t] + dp[i + 1][coins - t];
        best = Math.max(best, value);
      }

      dp[i][coins] = best;
    }
  }

  // Answer: max value taking exactly k coins from all piles (starting at pile 0)
  return dp[0][k];
}
```

```java
// Time: O(n * k * min(m, k)) where n = number of piles, k = total coins to take,
//       m = average pile size. In worst case O(n * k^2)
// Space: O(n * k) for the DP table
class Solution {
    public int maxValueOfCoins(List<List<Integer>> piles, int k) {
        int n = piles.size();

        // Precompute prefix sums for each pile
        // prefix[i][t] = sum of first t coins in pile i
        List<List<Integer>> prefix = new ArrayList<>();
        for (List<Integer> pile : piles) {
            // Create prefix sum array for this pile
            // prefix[0] = 0 (taking 0 coins gives 0 value)
            // prefix[1] = pile[0] (taking 1 coin gives first coin)
            // prefix[2] = pile[0] + pile[1] (taking 2 coins gives sum of first 2)
            List<Integer> currPrefix = new ArrayList<>();
            currPrefix.add(0);  // Taking 0 coins gives 0 value
            int total = 0;
            for (int coin : pile) {
                total += coin;
                currPrefix.add(total);
            }
            prefix.add(currPrefix);
        }

        // DP table: dp[i][coins] = max value taking exactly 'coins' coins from piles i..n-1
        // We use n+1 rows to handle i=n (no piles left) as base case
        int[][] dp = new int[n + 1][k + 1];

        // Fill DP table from last pile to first (bottom-up)
        for (int i = n - 1; i >= 0; i--) {
            // For current pile i, consider all possible numbers of coins to take
            for (int coins = 1; coins <= k; coins++) {
                // Try taking t coins from current pile i
                // t can be from 0 to min(coins, number of coins in pile i)
                int maxT = Math.min(coins, piles.get(i).size());

                int best = 0;
                for (int t = 0; t <= maxT; t++) {
                    // If we take t coins from pile i, we get prefix[i][t] value
                    // Then we need to take (coins - t) coins from remaining piles (i+1..n-1)
                    // dp[i+1][coins - t] gives optimal value for that subproblem
                    int value = prefix.get(i).get(t) + dp[i + 1][coins - t];
                    best = Math.max(best, value);
                }

                dp[i][coins] = best;
            }
        }

        // Answer: max value taking exactly k coins from all piles (starting at pile 0)
        return dp[0][k];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: `O(n * k * min(m, k))` where:

- `n` = number of piles
- `k` = total coins to take
- `m` = average pile size

In the worst case where all piles have at least `k` coins, `min(m, k) = k`, giving `O(n * k²)`. This comes from:

- Outer loop over `n` piles
- Middle loop over `k` possible coin counts
- Inner loop over up to `min(m, k)` choices for how many coins to take from current pile

**Space Complexity**: `O(n * k)` for the DP table. We could optimize to `O(k)` by only keeping the current and next row of the DP table, but the `O(n * k)` version is clearer for understanding.

## Common Mistakes

1. **Forgetting the pile order constraint**: Candidates sometimes try to take the largest `k` coins overall, ignoring that you can only take coins from the top of each pile. You must take all coins above any coin you want in a pile.

2. **Incorrect DP state definition**: Using 1D DP like `dp[coins]` = max value with `coins` coins doesn't work because it doesn't track which piles we've used. We need 2D DP to track both pile index and coins taken.

3. **Not handling the "exactly k coins" requirement**: Some solutions maximize value with _at most_ `k` coins, but the problem requires _exactly_ `k` coins. This affects the DP base cases and transitions.

4. **Inefficient prefix sum computation**: Recomputing the sum of first `t` coins from a pile for each `t` would add an extra `O(m)` factor. Precomputing prefix sums reduces this to `O(1)` lookup.

## When You'll See This Pattern

This is a **bounded knapsack** variant with ordering constraints. Similar problems include:

1. **Coin Change II (518)**: Both involve selecting coins to reach a target, but here coins are grouped in piles with ordering constraints.

2. **Partition Equal Subset Sum (416)**: Both use DP to make selections that sum to a target, though without the pile constraints.

3. **Target Sum (494)**: Another DP problem where you make selections (adding + or - signs) to reach a target.

The key pattern is when you need to make selections from groups with constraints, and the optimal solution for the whole problem depends on optimal solutions for subproblems.

## Key Takeaways

1. **Recognize constrained selection problems**: When you need to choose items with constraints (like "must take from top of pile"), think about DP where state tracks both which group you're in and how much you've selected.

2. **Precompute for efficiency**: When you repeatedly need sums of prefixes or other aggregates, precompute them to avoid redundant calculations.

3. **Work backward in DP**: For problems where choices affect future options, it's often cleaner to fill DP table from the end to the beginning.

Related problems: [Coin Change](/problem/coin-change), [Coin Change II](/problem/coin-change-ii)
