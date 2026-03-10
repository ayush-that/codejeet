---
title: "Dynamic Programming Questions at Myntra: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Myntra — patterns, difficulty breakdown, and study tips."
date: "2031-04-25"
category: "dsa-patterns"
tags: ["myntra", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Myntra isn't just another topic on a checklist—it's a critical filter. With 5 out of 24 total questions dedicated to DP, it represents over 20% of their curated problem set. This is a significant concentration, higher than at many generalist tech companies. The reason is practical: Myntra's core business—fashion e-commerce, inventory management, recommendation engines, and logistics optimization—is riddled with optimization problems. Whether it's maximizing the value of a warehouse shelf (knapsack), finding the most efficient delivery routes (shortest path variations), or sequencing personalized style recommendations, DP provides the algorithmic backbone. In real interviews, you can expect at least one medium-to-hard DP question in the technical rounds for backend, data, and ML engineering roles. They don't just test if you can memorize solutions; they test if you can _model_ a real-world constraint as a state transition.

## Specific Patterns Myntra Favors

Myntra's DP questions lean heavily towards **one-dimensional and two-dimensional iterative (bottom-up) DP** applied to classic optimization and combinatorial problems. You'll rarely see obscure graph theory DP or highly abstract state definitions. Their focus is on foundational, high-utility patterns.

1.  **0/1 Knapsack & Variations:** This is the undisputed king. The core problem of selecting items with weight and value to maximize total value within a capacity directly mirrors inventory bundling, promotional pricing, and resource allocation. Expect variations like subset sum, partition equal subset sum, and target sum.
2.  **Unbounded Knapsack (Coin Change):** Problems like coin change (fewest coins) and coin change II (number of combinations) model scenarios with unlimited supply—think applying discount coupons or assembling outfit combinations from a reusable catalog.
3.  **String DP (LCS, Edit Distance):** Longest Common Subsequence and Edit Distance appear because they underpin data matching, duplicate detection, and fuzzy search in product catalogs and user queries.
4.  **1D DP on Sequences (House Robber, Max Subarray):** Simple yet powerful patterns for making sequential decisions, like choosing non-adjacent elements for maximum gain (House Robber) or finding optimal contiguous segments.

You will notice a distinct _absence_ of highly complex multi-dimensional DP (e.g., DP on advanced graphs like "Cherry Pickup") or purely mathematical DP (e.g., "Unique Paths" is about as simple as it gets). Myntra's DP is applied and iterative.

## How to Prepare

The key is to master the state definition and transition for the core patterns. Let's look at the iterative 0/1 Knapsack solution, which is the template for many problems.

<div class="code-group">

```python
def knapsack(weights, values, capacity):
    """
    Classic 0/1 Knapsack. Returns maximum achievable value.
    """
    n = len(weights)
    # dp[i][w] = max value using first i items with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            # Option 1: Don't take item i-1
            dp[i][w] = dp[i-1][w]
            # Option 2: Take item i-1 if it fits
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], values[i-1] + dp[i-1][w - weights[i-1]])
    return dp[n][capacity]

# Time: O(n * capacity) | Space: O(n * capacity)
# Can be optimized to O(capacity) space by using a 1D array and iterating backwards.
```

```javascript
function knapsack(weights, values, capacity) {
  const n = weights.length;
  // dp[i][w] = max value using first i items with capacity w
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      // Don't take item i-1
      dp[i][w] = dp[i - 1][w];
      // Take item i-1 if it fits
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
      }
    }
  }
  return dp[n][capacity];
}
// Time: O(n * capacity) | Space: O(n * capacity)
```

```java
public int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    // dp[i][w] = max value using first i items with capacity w
    int[][] dp = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= capacity; w++) {
            // Don't take item i-1
            dp[i][w] = dp[i-1][w];
            // Take item i-1 if it fits
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(dp[i][w], values[i-1] + dp[i-1][w - weights[i-1]]);
            }
        }
    }
    return dp[n][capacity];
}
// Time: O(n * capacity) | Space: O(n * capacity)
```

</div>

For unbounded knapsack (coin change), the transition changes subtly: `dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i][w - weights[i-1]])`. Notice the second term uses `dp[i][...]`, not `dp[i-1][...]`, because we can reuse the item. This small change is a classic Myntra follow-up: "What if we have an unlimited supply?"

## How Myntra Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, Myntra's DP questions are less about algorithmic trickery and more about **clean implementation and adaptation**. At Google or Meta, you might get a DP problem disguised as a novel graph or game theory puzzle, requiring deep insight to even recognize it as DP. At Myntra, the DP nature is usually clearer, but the emphasis shifts to:

- **Modeling Constraints:** Can you correctly map "budget" to "capacity" and "product profit" to "value"?
- **Space Optimization:** They often ask for the O(capacity) space solution as a follow-up.
- **Variation Identification:** They love to start with a classic problem (e.g., "Partition Equal Subset Sum" - LeetCode #416) and then tweak one constraint ("What if we need to partition into K equal subsets?").

The difficulty is consistently in the medium range on LeetCode. You won't see "hard" problems that require 3D DP or extremely clever state compression, but you must execute the medium problems flawlessly under pressure.

## Study Order

Tackle DP in this logical sequence to build intuition without getting overwhelmed:

1.  **Foundation: Fibonacci & Climbing Stairs (LeetCode #70).** Understand overlapping subproblems and memoization vs. tabulation. This is your "Hello World."
2.  **1D Decision Making: House Robber (LeetCode #198).** Learn to define `dp[i]` as the best outcome up to house `i`. This pattern extends to many sequence problems.
3.  **Classical 2D DP: 0/1 Knapsack.** This is the most important pattern. Internalize the 2D table and the take/don't take transition. Practice its direct variants: Subset Sum, Partition Equal Subset Sum (LeetCode #416).
4.  **Unbounded Knapsack: Coin Change (LeetCode #322) & Coin Change II (LeetCode #518).** Master the transition difference from 0/1 Knapsack. This is a very common Myntra pattern.
5.  **String DP: Longest Common Subsequence (LeetCode #1143) & Edit Distance (LeetCode #72).** Learn to build the 2D table where `dp[i][j]` represents the answer for prefixes `s1[0:i]` and `s2[0:j]`.
6.  **(Optional) Kadane's Algorithm: Maximum Subarray (LeetCode #53).** While often solved greedily, it's a great example of a 1D DP where `dp[i]` is defined as the best subarray _ending_ at index `i`.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous pattern.

1.  Climbing Stairs (LeetCode #70) - Foundation
2.  House Robber (LeetCode #198) - 1D Sequence DP
3.  0/1 Knapsack (GeeksforGeeks / Educative) - Core Pattern
4.  Partition Equal Subset Sum (LeetCode #416) - Direct 0/1 Knapsack application
5.  Coin Change (LeetCode #322) - Unbounded Knapsack (Minimize)
6.  Coin Change II (LeetCode #518) - Unbounded Knapsack (Count Ways)
7.  Longest Common Subsequence (LeetCode #1143) - String DP
8.  Edit Distance (LeetCode #72) - String DP (Harder, but highly relevant)

To solidify, here's the space-optimized 1D DP for the unbounded knapsack (coin change) pattern, which is a must-know for Myntra.

<div class="code-group">

```python
def coin_change(coins, amount):
    """
    Minimum number of coins to make amount. Returns -1 if impossible.
    Unbounded Knapsack pattern with minimization.
    """
    # dp[w] = min coins to make amount w
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins to make amount 0

    for w in range(1, amount + 1):
        for coin in coins:
            if coin <= w:
                dp[w] = min(dp[w], 1 + dp[w - coin])
    return dp[amount] if dp[amount] != float('inf') else -1

# Time: O(amount * len(coins)) | Space: O(amount)
```

```javascript
function coinChange(coins, amount) {
  // dp[w] = min coins to make amount w
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let w = 1; w <= amount; w++) {
    for (const coin of coins) {
      if (coin <= w) {
        dp[w] = Math.min(dp[w], 1 + dp[w - coin]);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
// Time: O(amount * coins.length) | Space: O(amount)
```

```java
public int coinChange(int[] coins, int amount) {
    // dp[w] = min coins to make amount w
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // Use a value > possible answer
    dp[0] = 0;

    for (int w = 1; w <= amount; w++) {
        for (int coin : coins) {
            if (coin <= w) {
                dp[w] = Math.min(dp[w], 1 + dp[w - coin]);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
// Time: O(amount * coins.length) | Space: O(amount)
```

</div>

Master these patterns, understand the transitions, and practice clean, optimized implementations. Myntra's DP interview is a test of applied algorithmic thinking—your ability to use these classic tools to solve their business-like optimization problems.

[Practice Dynamic Programming at Myntra](/company/myntra/dynamic-programming)
