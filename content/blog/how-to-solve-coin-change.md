---
title: "How to Solve Coin Change — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Coin Change. Medium difficulty, 48.0% acceptance rate. Topics: Array, Dynamic Programming, Breadth-First Search."
date: "2026-04-13"
category: "dsa-patterns"
tags: ["coin-change", "array", "dynamic-programming", "breadth-first-search", "medium"]
---

# How to Solve Coin Change

You're given coin denominations and a target amount, and you need to find the minimum number of coins needed to make exactly that amount. If it's impossible, return -1. This problem is tricky because it looks simple but hides a classic dynamic programming challenge — you can't just use a greedy approach (taking the largest coin first) since that fails for many coin systems.

## Visual Walkthrough

Let's trace through `coins = [1, 2, 5]`, `amount = 11`:

A greedy approach would take the largest coin first: 5 + 5 = 10, then need 1 more → 3 coins total (5, 5, 1). But is this optimal? Let's think systematically.

We want to build up to 11 using the fewest coins. Think about the last coin we add:

- If the last coin is 1, we need to make 10 with fewest coins
- If the last coin is 2, we need to make 9 with fewest coins
- If the last coin is 5, we need to make 6 with fewest coins

So the minimum coins for 11 = 1 + min(minCoins(10), minCoins(9), minCoins(6))

This reveals our DP approach: solve for smaller amounts first. Let's build a table `dp` where `dp[i]` = min coins for amount `i`:

```
Amount: 0  1  2  3  4  5  6  7  8  9  10  11
Coins:  0  1  1  2  2  1  2  2  3  3  2   3
```

How we get there:

- `dp[0] = 0` (0 coins needed for amount 0)
- For amount 1: only coin 1 works → `dp[1] = 1`
- For amount 2: min(dp[2-1]+1, dp[2-2]+1) = min(1+1, 0+1) = 1
- For amount 3: min(dp[3-1]+1, dp[3-2]+1) = min(2+1, 1+1) = 2
- Continue until amount 11...

## Brute Force Approach

The brute force solution uses recursion to explore all combinations. For each amount, try every coin denomination, subtract it, and recursively solve the smaller subproblem:

```
minCoins(amount) =
  0 if amount == 0
  min(1 + minCoins(amount - coin)) for coin in coins where coin <= amount
  otherwise INF (impossible)
```

The problem? This has exponential time complexity O(amount^coins) due to repeated work. For `coins = [1, 2, 5]` and `amount = 11`, we'd recompute `minCoins(6)` multiple times from different paths.

<div class="code-group">

```python
# Brute force recursive solution - TOO SLOW for large amounts
# Time: O(amount^coins) | Space: O(amount) for recursion depth
def coinChangeBrute(coins, amount):
    def dfs(remaining):
        if remaining == 0:
            return 0
        if remaining < 0:
            return float('inf')

        min_coins = float('inf')
        for coin in coins:
            result = dfs(remaining - coin)
            if result != float('inf'):
                min_coins = min(min_coins, 1 + result)

        return min_coins

    result = dfs(amount)
    return -1 if result == float('inf') else result
```

```javascript
// Brute force recursive solution - TOO SLOW for large amounts
// Time: O(amount^coins) | Space: O(amount) for recursion depth
function coinChangeBrute(coins, amount) {
  function dfs(remaining) {
    if (remaining === 0) return 0;
    if (remaining < 0) return Infinity;

    let minCoins = Infinity;
    for (const coin of coins) {
      const result = dfs(remaining - coin);
      if (result !== Infinity) {
        minCoins = Math.min(minCoins, 1 + result);
      }
    }

    return minCoins;
  }

  const result = dfs(amount);
  return result === Infinity ? -1 : result;
}
```

```java
// Brute force recursive solution - TOO SLOW for large amounts
// Time: O(amount^coins) | Space: O(amount) for recursion depth
public int coinChangeBrute(int[] coins, int amount) {
    if (amount < 0) return -1;
    if (amount == 0) return 0;

    int minCoins = Integer.MAX_VALUE;
    for (int coin : coins) {
        if (coin <= amount) {
            int result = coinChangeBrute(coins, amount - coin);
            if (result != -1) {
                minCoins = Math.min(minCoins, 1 + result);
            }
        }
    }

    return minCoins == Integer.MAX_VALUE ? -1 : minCoins;
}
```

</div>

## Optimized Approach

The key insight is **dynamic programming with memoization**. We notice two important properties:

1. **Optimal substructure**: The optimal solution for amount `n` can be built from optimal solutions for smaller amounts
2. **Overlapping subproblems**: We solve the same subproblems repeatedly

We can solve this bottom-up using a DP array where `dp[i]` represents the minimum coins needed for amount `i`. We initialize `dp[0] = 0` and all other values to infinity (or a large number). Then for each amount from 1 to the target, we try every coin denomination: if the coin value is ≤ current amount, we check if using this coin gives us a better solution than what we already have.

The recurrence relation is:

```
dp[i] = min(dp[i], dp[i - coin] + 1) for all coins where coin ≤ i
```

This approach guarantees we find the minimum because we systematically try all possibilities while avoiding recomputation.

## Optimal Solution

Here's the bottom-up DP solution that runs in O(amount × coins) time:

<div class="code-group">

```python
# Optimal DP solution (bottom-up)
# Time: O(amount × len(coins)) | Space: O(amount)
def coinChange(coins, amount):
    # Create DP array where dp[i] = min coins for amount i
    # Initialize with a value larger than any possible answer
    dp = [float('inf')] * (amount + 1)

    # Base case: 0 coins needed for amount 0
    dp[0] = 0

    # Build up solutions for all amounts from 1 to target
    for i in range(1, amount + 1):
        # Try every coin denomination
        for coin in coins:
            # Check if this coin can be used (coin value <= current amount)
            if coin <= i:
                # Update dp[i] if using this coin gives a better solution
                # dp[i - coin] + 1 means: min coins for (i - coin) plus this 1 coin
                dp[i] = min(dp[i], dp[i - coin] + 1)

    # If dp[amount] is still infinity, no solution exists
    return -1 if dp[amount] == float('inf') else dp[amount]
```

```javascript
// Optimal DP solution (bottom-up)
// Time: O(amount × coins.length) | Space: O(amount)
function coinChange(coins, amount) {
  // Create DP array where dp[i] = min coins for amount i
  // Initialize with Infinity (impossible value)
  const dp = new Array(amount + 1).fill(Infinity);

  // Base case: 0 coins needed for amount 0
  dp[0] = 0;

  // Build up solutions for all amounts from 1 to target
  for (let i = 1; i <= amount; i++) {
    // Try every coin denomination
    for (const coin of coins) {
      // Check if this coin can be used (coin value <= current amount)
      if (coin <= i) {
        // Update dp[i] if using this coin gives a better solution
        // dp[i - coin] + 1 means: min coins for (i - coin) plus this 1 coin
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  // If dp[amount] is still Infinity, no solution exists
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

```java
// Optimal DP solution (bottom-up)
// Time: O(amount × coins.length) | Space: O(amount)
public int coinChange(int[] coins, int amount) {
    // Create DP array where dp[i] = min coins for amount i
    // Initialize with amount + 1 (a value larger than any possible answer)
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);

    // Base case: 0 coins needed for amount 0
    dp[0] = 0;

    // Build up solutions for all amounts from 1 to target
    for (int i = 1; i <= amount; i++) {
        // Try every coin denomination
        for (int coin : coins) {
            // Check if this coin can be used (coin value <= current amount)
            if (coin <= i) {
                // Update dp[i] if using this coin gives a better solution
                // dp[i - coin] + 1 means: min coins for (i - coin) plus this 1 coin
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    // If dp[amount] is still the initial large value, no solution exists
    return dp[amount] > amount ? -1 : dp[amount];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(amount × n) where n is the number of coin denominations. We iterate through all amounts from 1 to `amount`, and for each amount, we try all `n` coins.

**Space Complexity:** O(amount) for the DP array storing solutions for all amounts from 0 to `amount`.

The time complexity comes from the nested loops: the outer loop runs `amount` times, and the inner loop runs `n` times. The space is linear in `amount` because we only need to store the DP array.

## Common Mistakes

1. **Using greedy approach**: Many candidates try to sort coins and always take the largest coin first. This fails for coin systems like `[1, 3, 4]` with `amount = 6`. Greedy gives 4+1+1 = 3 coins, but optimal is 3+3 = 2 coins.

2. **Incorrect initialization**: Forgetting to initialize `dp[0] = 0` or using wrong initial values (like 0 instead of infinity for other amounts). The DP array should start with "impossible" values except for the base case.

3. **Off-by-one errors in array indexing**: Since we have `amount + 1` elements in the DP array (0 through amount), it's easy to access `dp[amount]` when you meant `dp[amount - 1]` or vice versa.

4. **Not handling the "impossible" case correctly**: Returning 0 or another wrong value when no combination exists. Always check if your final result is still the "impossible" marker.

## When You'll See This Pattern

This is a classic **unbounded knapsack** problem — you can use each coin unlimited times. Similar DP patterns appear in:

1. **Minimum Cost For Tickets (LeetCode 983)**: Instead of coins, you have 1-day, 7-day, and 30-day passes. You're finding minimum cost to cover all travel days — same DP structure but with different "step sizes."

2. **Perfect Squares (LeetCode 279)**: Find the minimum number of perfect square numbers that sum to `n`. This is exactly Coin Change where the "coins" are all perfect squares ≤ n.

3. **Combination Sum IV (LeetCode 377)**: Count the number of combinations that add up to target — similar DP structure but counting instead of minimizing.

All these problems share the same core: building up a solution for target value `n` from solutions for smaller values, with some set of "moves" or "items" you can use repeatedly.

## Key Takeaways

1. **Recognize unbounded knapsack problems**: When you can use items unlimited times to reach a target, think Coin Change DP. The recurrence `dp[i] = min(dp[i], dp[i - coin] + 1)` (for minimization) or `dp[i] += dp[i - coin]` (for counting) is the giveaway.

2. **Bottom-up DP is often cleaner**: For problems with a single target value, building solutions from 0 up to the target is usually more intuitive than top-down with memoization.

3. **Initialize carefully**: The base case (`dp[0]`) and the "impossible" value matter. For minimization, use infinity or a value larger than any possible answer. For counting, use 0 or 1 depending on the problem.

Related problems: [Minimum Cost For Tickets](/problem/minimum-cost-for-tickets), [Maximum Value of K Coins From Piles](/problem/maximum-value-of-k-coins-from-piles), [Minimum Number of Operations to Convert Time](/problem/minimum-number-of-operations-to-convert-time)
