---
title: "Dynamic Programming Questions at JPMorgan: What to Expect"
description: "Prepare for Dynamic Programming interview questions at JPMorgan — patterns, difficulty breakdown, and study tips."
date: "2028-09-17"
category: "dsa-patterns"
tags: ["jpmorgan", "dynamic-programming", "interview prep"]
---

Dynamic Programming at JPMorgan isn't just another algorithm topic—it's a direct test of your ability to model complex financial decisions. With 11 out of their 78 tagged questions being DP problems, that's roughly 14% of their technical question bank. In real interviews, especially for quantitative roles, software engineering positions in trading systems, or risk analytics, you're more likely to encounter a DP problem here than at a typical FAANG company for a generalist role. Why? Because finance is built on optimization: maximizing profit, minimizing risk, and evaluating decisions over time. DP is the mathematical framework for solving these multi-stage optimization problems. If you can't reason through overlapping subproblems and optimal substructure, you'll struggle with the core logic of many financial models.

## Specific Patterns JPMorgan Favors

JPMorgan's DP questions tend to cluster around practical, one-dimensional and two-dimensional optimization. You won't find many esoteric graph DP problems here. Instead, focus on these core patterns:

1.  **Classic 0/1 Knapsack & Unbounded Knapsack Variations:** This is the single most important pattern. The knapsack problem—deciding which items to include given a capacity constraint to maximize value—is a direct analog for portfolio optimization, capital allocation, and resource scheduling. Expect variations.
2.  **String/Sequence DP:** Problems like **Longest Common Subsequence (#1143)** and **Edit Distance (#72)** appear because they model data comparison and transformation—think of comparing time series data, transaction sequences, or reconciling datasets.
3.  **State Machine DP:** Problems where your `dp` state includes not just an index but also a status (e.g., holding a stock or not, as in **Best Time to Buy and Sell Stock with Cooldown (#309)**). This mirrors the stateful nature of trading decisions.
4.  **Simple 1D/2D Iterative DP:** Problems like **Coin Change (#322)** (unbounded knapsack) and **Unique Paths (#62)**. These test fundamental DP construction.

The emphasis is overwhelmingly on **bottom-up, iterative DP**. Recursive solutions with memoization are acceptable to derive initially, but interviewers will push for the space-optimized iterative version. They want to see you build the solution matrix and understand the exact transition logic between states.

## How to Prepare

Your study must move from understanding the generic pattern to applying it to financial contexts. Let's take the Unbounded Knapsack pattern, which is the basis for Coin Change (#322). The core idea is: given a _capacity_ (an amount of money) and _items_ (coin denominations), find the number of ways or minimum items to fulfill the capacity.

Here is the bottom-up solution for the "minimum number of coins" variant. Master this template.

<div class="code-group">

```python
def coinChange(coins, amount):
    """
    Coin Change (LeetCode #322) - Minimum coins to make amount.
    Unbounded Knapsack pattern.
    """
    # dp[i] = min coins to make amount i
    # Initialize with amount+1 (impossibly large value)
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins needed for amount 0

    # Build dp table for every amount from 1 to target
    for i in range(1, amount + 1):
        # Try every coin denomination
        for coin in coins:
            if coin <= i:  # Coin can be used for current amount i
                # Transition: dp[i] = 1 coin + min coins for remaining amount (i-coin)
                dp[i] = min(dp[i], 1 + dp[i - coin])

    # If dp[amount] is still the initial large value, it's impossible
    return dp[amount] if dp[amount] != amount + 1 else -1

# Time Complexity: O(amount * len(coins)). We iterate through all amounts and for each, all coins.
# Space Complexity: O(amount) for the dp array.
```

```javascript
function coinChange(coins, amount) {
  // dp[i] = min coins to make amount i
  // Initialize with Infinity
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Base case

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        // Transition: use this coin + best solution for remainder
        dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
// Time: O(amount * n) | Space: O(amount)
```

```java
public int coinChange(int[] coins, int amount) {
    // dp[i] = min coins for amount i
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // Use amount+1 as "infinity"
    dp[0] = 0; // Base case

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
// Time: O(amount * n) | Space: O(amount)
```

</div>

To prepare, practice altering this template. Change the inner `min` to a `+` to solve the "number of ways" problem (Coin Change 2, #518). Recognize that the "Perfect Squares" problem (#279) is just this pattern where your "coins" are all perfect squares.

## How JPMorgan Tests Dynamic Programming vs Other Companies

At large tech companies (Google, Meta), DP problems can often be disguised as graph or array problems and may require more creative state definition. At JPMorgan, the DP problems are more "textbook" but with a sharper focus on _correctly modeling the business constraint_. The difficulty isn't in discovering you need DP—the problem statement often makes that clear. The difficulty is in:

1.  **Precisely defining the `dp` array:** Is it 1D or 2D? What does each index represent? (e.g., `dp[i][j]` as the max profit up to day `i` with `j` transactions remaining).
2.  **Getting the transition formula perfect:** A single off-by-one error or incorrect `min`/`max` choice will fail the edge cases they carefully design.
3.  **Space optimization:** They frequently ask, "Can you do this with O(n) or even O(1) space?" You must be ready to collapse a 2D DP array to two rows or one row.

The style is less "aha-moment" and more "precision engineering." They test meticulousness.

## Study Order

Do not jump into hard problems. Build your intuition sequentially.

1.  **Foundation: Fibonacci & Climbing Stairs (#70).** Understand recursion, memoization, and the step to bottom-up. This teaches the core concept of overlapping subproblems.
2.  **1D Linear DP:** **House Robber (#198)** and its variants. This introduces state decisions (rob/skip) and is a gentle intro to state machine thinking.
3.  **Classical 0/1 Knapsack.** Solve the standard problem, then its "subset sum" variant. This is the cornerstone. Understand the difference between the "maximum value" and "true/false" (existence) DP formulation.
4.  **Unbounded Knapsack:** **Coin Change (#322)** and **Coin Change 2 (#518)**. Learn to modify the inner/outer loop order and the transition between `min` and `+`.
5.  **2D Grid DP:** **Unique Paths (#62)** and **Minimum Path Sum (#64).** Solidify building a 2D table.
6.  **String DP:** **Longest Common Subsequence (#1143).** Learn to handle two sequences. This often appears in data comparison contexts.
7.  **State Machine DP:** **Best Time to Buy and Sell Stock with Cooldown (#309).** This is where finance-specific logic appears. Master defining states (hold, sold, cooldown) and the transitions between them.

This order builds from simple dependency (step i depends on i-1, i-2) to complex dependencies (state depends on previous state and action), and from one sequence to two.

## Recommended Practice Order

Solve these problems in this sequence to build the JPMorgan-relevant DP skillset:

1.  Climbing Stairs (#70) - Foundation
2.  House Robber (#198) - 1D Decision DP
3.  0/1 Knapsack (GeeksforGeeks / generic) - Core pattern
4.  Coin Change (#322) - Unbounded Knapsack (Min)
5.  Coin Change 2 (#518) - Unbounded Knapsack (Ways)
6.  Unique Paths (#62) - 2D Grid DP
7.  Longest Common Subsequence (#1143) - 2-Sequence DP
8.  Best Time to Buy and Sell Stock (#121) - Simple State
9.  Best Time to Buy and Sell Stock with Cooldown (#309) - Advanced State Machine
10. Target Sum (#494) - A excellent final challenge that combines 0/1 Knapsack thinking with a clever transformation into a subset sum problem.

Let's look at the State Machine pattern from problem #309, a classic in financial interviewing.

<div class="code-group">

```python
def maxProfit(prices):
    """
    Best Time to Buy and Sell Stock with Cooldown (LeetCode #309)
    State Machine DP: hold, sold, cooldown.
    """
    if not prices:
        return 0

    n = len(prices)
    # dp[i][0]: max profit on day i holding a stock
    # dp[i][1]: max profit on day i in cooldown (just sold)
    # dp[i][2]: max profit on day i not holding, not in cooldown (can buy)
    dp = [[0] * 3 for _ in range(n)]
    dp[0][0] = -prices[0]  # Buy on day 0
    dp[0][1] = 0
    dp[0][2] = 0

    for i in range(1, n):
        # State 0 (Hold): Either continue holding from prev day, or buy today from cooldown state.
        dp[i][0] = max(dp[i-1][0], dp[i-1][2] - prices[i])
        # State 1 (Sold): Sell the stock you were holding. Profit = price today + profit when you bought.
        dp[i][1] = dp[i-1][0] + prices[i]
        # State 2 (Cooldown): Either continue cooldown from prev day, or come from just-sold state.
        dp[i][2] = max(dp[i-1][2], dp[i-1][1])

    # Max profit will be in either sold or cooldown state on last day (not holding).
    return max(dp[n-1][1], dp[n-1][2])

# Time: O(n) | Space: O(n) (can be optimized to O(1))
```

```javascript
function maxProfit(prices) {
  if (prices.length === 0) return 0;
  const n = prices.length;
  const dp = new Array(n).fill(0).map(() => new Array(3).fill(0));
  dp[0][0] = -prices[0]; // hold
  dp[0][1] = 0; // sold
  dp[0][2] = 0; // cooldown

  for (let i = 1; i < n; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][2] - prices[i]);
    dp[i][1] = dp[i - 1][0] + prices[i];
    dp[i][2] = Math.max(dp[i - 1][2], dp[i - 1][1]);
  }
  return Math.max(dp[n - 1][1], dp[n - 1][2]);
}
// Time: O(n) | Space: O(n)
```

```java
public int maxProfit(int[] prices) {
    if (prices.length == 0) return 0;
    int n = prices.length;
    int[][] dp = new int[n][3];
    dp[0][0] = -prices[0]; // hold
    dp[0][1] = 0; // sold
    dp[0][2] = 0; // cooldown

    for (int i = 1; i < n; i++) {
        dp[i][0] = Math.max(dp[i-1][0], dp[i-1][2] - prices[i]);
        dp[i][1] = dp[i-1][0] + prices[i];
        dp[i][2] = Math.max(dp[i-1][2], dp[i-1][1]);
    }
    return Math.max(dp[n-1][1], dp[n-1][2]);
}
// Time: O(n) | Space: O(n)
```

</div>

The key is mapping business logic (buy, sell, wait) to discrete states and defining all legal transitions. This pattern is ubiquitous in trading system logic.

Master these patterns, practice the iterative build-up, and always articulate your definition of the `dp` array and transition before coding. At JPMorgan, clarity of thought is as valued as the correct answer.

[Practice Dynamic Programming at JPMorgan](/company/jpmorgan/dynamic-programming)
