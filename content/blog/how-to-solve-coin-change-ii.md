---
title: "How to Solve Coin Change II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Coin Change II. Medium difficulty, 60.4% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-10-24"
category: "dsa-patterns"
tags: ["coin-change-ii", "array", "dynamic-programming", "medium"]
---

# How to Solve Coin Change II

You're given coin denominations and a target amount, and you need to count the number of distinct combinations (order doesn't matter) that sum to that amount. This is a classic **unbounded knapsack** problem where you have unlimited coins of each denomination. The tricky part is avoiding double-counting combinations that differ only in order (like 2+5 vs 5+2), which requires careful DP state design.

## Visual Walkthrough

Let's trace through `coins = [1, 2, 5]` and `amount = 5`:

We want to count combinations like:

- 1+1+1+1+1
- 1+1+1+2
- 1+2+2
- 5

**Key insight**: Process coins one denomination at a time to avoid order-based duplicates. If we process all coins together, we might count (1,2,2) and (2,1,2) as different.

Let's build a DP table where `dp[a]` = number of ways to make amount `a` using processed coins so far:

1. Start with only coin `1`:
   - `dp[0] = 1` (one way: use no coins)
   - `dp[1] = 1` (1)
   - `dp[2] = 1` (1+1)
   - `dp[3] = 1` (1+1+1)
   - `dp[4] = 1` (1+1+1+1)
   - `dp[5] = 1` (1+1+1+1+1)

2. Add coin `2`:
   For each amount `a` from 2 to 5:
   - `dp[a] += dp[a-2]` (add ways using the new coin)
   - `dp[2]` becomes 1 + 1 = 2 (1+1, 2)
   - `dp[3]` becomes 1 + 1 = 2 (1+1+1, 1+2)
   - `dp[4]` becomes 1 + 2 = 3 (1+1+1+1, 1+1+2, 2+2)
   - `dp[5]` becomes 1 + 2 = 3 (1+1+1+1+1, 1+1+1+2, 1+2+2)

3. Add coin `5`:
   For each amount `a` from 5 to 5:
   - `dp[5] += dp[0]` = 3 + 1 = 4 (add the 5 coin itself)

Final answer: 4 combinations.

## Brute Force Approach

A naive solution would try all possible combinations using recursion:

```python
def brute_force(coins, amount):
    def dfs(i, remaining):
        if remaining == 0:
            return 1
        if remaining < 0 or i >= len(coins):
            return 0
        # Use coin i or skip it
        return dfs(i, remaining - coins[i]) + dfs(i + 1, remaining)
    return dfs(0, amount)
```

This explores two choices at each step: use the current coin (and stay on same coin since unlimited supply) or move to next coin. However, this has **exponential time complexity** O(2^(amount/min_coin)) and will time out for moderate inputs. The recursion tree explodes because we're recomputing the same subproblems repeatedly.

## Optimized Approach

The optimal solution uses **dynamic programming** with a clever ordering to avoid counting permutations as distinct combinations:

1. **DP State**: `dp[a]` = number of ways to make amount `a` using the coins processed so far
2. **DP Transition**: For each coin, update amounts from that coin value upward:  
   `dp[a] += dp[a - coin]` if `a >= coin`
3. **Why this works**: By processing coins one denomination at a time (outer loop over coins), we ensure we never count different orderings of the same coins as separate combinations. Once we've moved past a coin denomination, we never consider it again for future combinations.

Think of it as: "For each new coin, how many new ways can we make each amount by including this coin?"

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * amount) where n = len(coins)
# Space: O(amount)
def change(amount, coins):
    # dp[a] = number of ways to make amount a
    # Initialize with base case: 1 way to make amount 0 (use no coins)
    dp = [0] * (amount + 1)
    dp[0] = 1

    # Process each coin one by one
    for coin in coins:
        # For each amount from coin to amount (inclusive)
        # We go forward to allow using multiple coins of same denomination
        for a in range(coin, amount + 1):
            # Add ways to make (a - coin) using coins up to current coin
            # This effectively counts combinations where we use at least one of current coin
            dp[a] += dp[a - coin]

    return dp[amount]
```

```javascript
// Time: O(n * amount) where n = coins.length
// Space: O(amount)
function change(amount, coins) {
  // dp[a] = number of ways to make amount a
  // Initialize with base case: 1 way to make amount 0 (use no coins)
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;

  // Process each coin one by one
  for (const coin of coins) {
    // For each amount from coin to amount (inclusive)
    // Forward iteration allows using multiple coins of same denomination
    for (let a = coin; a <= amount; a++) {
      // Add ways to make (a - coin) using coins up to current coin
      dp[a] += dp[a - coin];
    }
  }

  return dp[amount];
}
```

```java
// Time: O(n * amount) where n = coins.length
// Space: O(amount)
public int change(int amount, int[] coins) {
    // dp[a] = number of ways to make amount a
    // Initialize with base case: 1 way to make amount 0 (use no coins)
    int[] dp = new int[amount + 1];
    dp[0] = 1;

    // Process each coin one by one
    for (int coin : coins) {
        // For each amount from coin to amount (inclusive)
        // Forward iteration allows using multiple coins of same denomination
        for (int a = coin; a <= amount; a++) {
            // Add ways to make (a - coin) using coins up to current coin
            dp[a] += dp[a - coin];
        }
    }

    return dp[amount];
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × amount) where n is the number of coin denominations. We iterate through each coin (n iterations) and for each coin, we iterate through amounts from coin value to target amount (up to amount iterations).

**Space Complexity**: O(amount) for the DP array. We only need a 1D array of size amount+1 to store the number of ways for each amount.

The nested loops structure is optimal because we must consider each coin and each relevant amount at least once. Any solution would need to examine these combinations.

## Common Mistakes

1. **Swapping the loops** (iterating amounts outer, coins inner): This counts permutations as distinct combinations. For example, with coins [1,2] and amount=3, you'd count (1,2) and (2,1) separately. The correct order (coins outer loop) ensures each combination is counted only once in canonical order.

2. **Starting inner loop from 0 instead of coin value**: This causes index errors when accessing `dp[a - coin]` with negative indices. Always start from `coin` since you can't use a coin larger than the target amount.

3. **Forgetting the base case `dp[0] = 1`**: There's exactly 1 way to make amount 0: use no coins. This is crucial for the recurrence to work correctly.

4. **Using integer overflow for large amounts**: While not an issue in LeetCode's constraints, in real interviews you might discuss that the count could exceed 32-bit integer limits and require using `long` or modulo arithmetic.

## When You'll See This Pattern

This **unbounded knapsack counting combinations** pattern appears in many DP problems:

1. **Maximum Value of K Coins From Piles** (Hard): Similar to choosing coins from piles with limits, combining unbounded knapsack with additional constraints.

2. **Number of Ways to Earn Points** (Hard): Counting ways to achieve a score target using different question types, exactly like counting coin combinations.

3. **Count of Sub-Multisets With Bounded Sum** (Hard): A more complex variant with quantity limits on each "coin" (element).

4. **Partition Equal Subset Sum** (Medium): While that's a 0/1 knapsack (each item once), the DP structure is similar but with boolean states instead of counts.

Recognize this pattern when you need to count ways to reach a target using unlimited supply of items, especially when order doesn't matter.

## Key Takeaways

1. **Order matters in DP loops**: When counting combinations (order doesn't matter), put the items loop outside and amounts inside. When counting permutations (order matters), do the opposite.

2. **Unbounded knapsack uses forward iteration**: Unlike 0/1 knapsack which uses backward iteration to prevent reusing items, unbounded knapsack uses forward iteration in the inner loop to allow multiple uses of the same item.

3. **DP state compression is often possible**: Many knapsack problems can be solved with 1D DP arrays instead of 2D, saving space while maintaining correctness through careful iteration order.

Related problems: [Maximum Value of K Coins From Piles](/problem/maximum-value-of-k-coins-from-piles), [Number of Ways to Earn Points](/problem/number-of-ways-to-earn-points), [Count of Sub-Multisets With Bounded Sum](/problem/count-of-sub-multisets-with-bounded-sum)
