---
title: "Dynamic Programming Questions at eBay: What to Expect"
description: "Prepare for Dynamic Programming interview questions at eBay — patterns, difficulty breakdown, and study tips."
date: "2029-03-06"
category: "dsa-patterns"
tags: ["ebay", "dynamic-programming", "interview prep"]
---

If you're preparing for software engineering interviews at eBay, you'll quickly notice a significant emphasis on Dynamic Programming (DP). With 10 out of their 60 total tagged questions being DP problems, it's not a niche topic—it's a core competency they expect you to have. This frequency suggests that while you might not get a DP question in every single interview loop, the odds are high you'll face at least one, especially for mid-to-senior level roles. The reason is practical: DP tests a candidate's ability to break down complex, often optimization-based problems into simpler sub-problems, a skill directly applicable to eBay's domains like auction systems, pricing algorithms, inventory optimization, and logistics routing. It's less about memorizing solutions and more about demonstrating structured, efficient problem-solving.

## Specific Patterns eBay Favors

eBay's DP questions tend to cluster around a few key patterns, with a noticeable preference for **iterative (bottom-up) DP** over purely recursive solutions. They favor problems with clear real-world analogs in e-commerce.

1.  **Classic 0/1 Knapsack & Unbounded Knapsack Variations:** This is arguably the most important pattern. Problems like deciding optimal resource allocation (e.g., server capacity, budget allocation for features) map directly to this. You'll see variations asking for "minimum cost to achieve a target" or "number of ways to form a sum."
2.  **String/Sequence DP (LCS, Edit Distance):** These are highly relevant for features like search relevance, fuzzy matching of product titles, or detecting duplicate listings. Understanding the Longest Common Subsequence (LCS) and Edit Distance algorithms is crucial.
3.  **1D and 2D DP on Arrays:** Problems involving maximizing profit, minimizing cost, or counting ways over a sequence (like a timeline of bids or inventory changes) fall here. They often involve state definitions like `dp[i] = best outcome up to index i`.

For example, **Coin Change (#322)** is a quintessential unbounded knapsack problem for "minimum coins." **Target Sum (#494)** is a clever 0/1 knapsack variation disguised as a partitioning problem. For sequence problems, **Longest Increasing Subsequence (#300)** is a classic, and **Edit Distance (#72)** is a must-know for string manipulation.

## How to Prepare

The key is to internalize the pattern, not the specific problem. Let's look at the unbounded knapsack pattern, as seen in Coin Change. The mental model is: "For a given amount, the minimum coins is 1 plus the minimum coins for `(amount - coin_value)` for each coin."

<div class="code-group">

```python
def coinChange(coins, amount):
    # dp[i] will store the min coins needed for amount i
    # Initialize with a value larger than any possible answer (amount + 1)
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins needed for amount 0

    # Build the DP table bottom-up for every amount from 1 to target
    for i in range(1, amount + 1):
        # For each amount i, try every coin
        for coin in coins:
            if coin <= i:  # Coin can be used
                # The optimal choice is the minimum of:
                # 1. Current best for amount i
                # 2. 1 coin + the best for the remaining amount (i - coin)
                dp[i] = min(dp[i], 1 + dp[i - coin])

    # If dp[amount] is still our initial large value, it's impossible
    return dp[amount] if dp[amount] <= amount else -1

# Time: O(A * C) where A is amount, C is number of coins
# Space: O(A) for the dp array
```

```javascript
function coinChange(coins, amount) {
  // dp[i] = min coins for amount i
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
      }
    }
  }

  return dp[amount] <= amount ? dp[amount] : -1;
}
// Time: O(A * C) | Space: O(A)
```

```java
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
// Time: O(A * C) | Space: O(A)
```

</div>

Another critical pattern is the **DP on Strings** for Edit Distance. The state transition is fundamental: `dp[i][j]` represents the min operations to convert `word1[0..i-1]` to `word2[0..j-1]`.

<div class="code-group">

```python
def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases: converting to/from empty string
    for i in range(m + 1):
        dp[i][0] = i  # delete all chars from word1
    for j in range(n + 1):
        dp[0][j] = j  # insert all chars into word1

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                # Characters match, no new operation needed
                dp[i][j] = dp[i - 1][j - 1]
            else:
                # Choose the minimum of insert, delete, or replace
                dp[i][j] = 1 + min(
                    dp[i][j - 1],    # Insert into word1
                    dp[i - 1][j],    # Delete from word1
                    dp[i - 1][j - 1] # Replace in word1
                )
    return dp[m][n]

# Time: O(m * n) | Space: O(m * n)
```

```javascript
function minDistance(word1, word2) {
  const m = word1.length,
    n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}
// Time: O(m * n) | Space: O(m * n)
```

```java
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    Math.min(dp[i][j - 1], dp[i - 1][j]),
                    dp[i - 1][j - 1]
                );
            }
        }
    }
    return dp[m][n];
}
// Time: O(m * n) | Space: O(m * n)
```

</div>

## How eBay Tests Dynamic Programming vs Other Companies

Compared to companies like Google or Meta, eBay's DP questions are often more "applied" and less "theoretical." You're less likely to get a highly abstract, purely mathematical DP problem and more likely to get one framed in a business context—optimizing delivery routes (a shortest path/variation), bundling products for maximum profit (knapsack), or matching user queries (string DP). The difficulty is typically in the **medium to medium-hard** range on LeetCode; they want to see you can correctly identify the pattern and implement it cleanly under pressure, not that you can solve an obscure "hard" problem you've memorized.

What's unique is the follow-up. eBay interviewers are known to dig into the _why_ of your space optimization (e.g., "Can we reduce the `O(m*n)` space to `O(n)`?"). They care about the trade-offs because efficient resource use matters at scale. Be prepared to discuss the time/space complexity of both the standard and optimized solutions.

## Study Order

Tackle DP in this logical progression to build a solid foundation:

1.  **Foundations & Fibonacci:** Start with the simplest recursion-with-memoization (top-down) to understand the core concept of overlapping subproblems and memoization. Solve Climbing Stairs (#70).
2.  **1D DP (Linear Sequences):** Move to problems where the state depends on a few previous states. Practice House Robber (#198) and Longest Increasing Subsequence (#300). This builds intuition for state definition `dp[i]`.
3.  **Classic 0/1 Knapsack:** This is a cornerstone. Master the 2D DP solution for 0/1 Knapsack and Partition Equal Subset Sum (#416). Understand how to derive the state transition.
4.  **Unbounded Knapsack:** Learn how the transition changes when items can be reused. Coin Change (#322) and Coin Change 2 (#518) are perfect.
5.  **2D DP on Grids/Matrices:** Problems like Unique Paths (#62) and Minimum Path Sum (#64) introduce 2D state.
6.  **DP on Strings:** This combines sequence and 2D DP. Focus on Longest Common Subsequence (#1143) and Edit Distance (#72). These are highly relevant for eBay.
7.  **Advanced Variations & State Machines:** Finally, tackle problems with more complex state definitions, like Best Time to Buy and Sell Stock with Cooldown (#309), which models different "states" (hold, sold, cooldown).

## Recommended Practice Order

Solve these eBay-tagged or highly relevant problems in sequence:

1.  **Climbing Stairs (#70)** - The "Hello World" of DP.
2.  **House Robber (#198)** - Classic 1D DP with a simple decision.
3.  **Coin Change (#322)** - Master unbounded knapsack (minimum).
4.  **Coin Change 2 (#518)** - Unbounded knapsack (count ways).
5.  **Partition Equal Subset Sum (#416)** - 0/1 Knapsack identification.
6.  **Target Sum (#494)** - A brilliant 0/1 knapsack reduction.
7.  **Longest Increasing Subsequence (#300)** - Important 1D pattern with binary search optimization.
8.  **Longest Common Subsequence (#1143)** - Foundational string DP.
9.  **Edit Distance (#72)** - The ultimate string DP problem for eBay.
10. **Best Time to Buy and Sell Stock with Cooldown (#309)** - A step into DP with state machines.

This path takes you from the absolute basics to the patterns most valued at eBay. Remember, the goal isn't to solve 100 problems, but to deeply understand the 10 patterns that explain 100 problems.

[Practice Dynamic Programming at eBay](/company/ebay/dynamic-programming)
