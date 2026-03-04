---
title: "Dynamic Programming Questions at Zomato: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-16"
category: "dsa-patterns"
tags: ["zomato", "dynamic-programming", "interview prep"]
---

Dynamic Programming (DP) is a critical skill for Zomato’s technical interviews because it directly tests a candidate’s ability to optimize complex, real-world logistics problems. At its core, Zomato’s business—food delivery, supply chain management, route optimization, and resource allocation—revolves around making efficient decisions. DP is the algorithmic embodiment of breaking down these large, seemingly intractable problems (like minimizing delivery time or maximizing order bundling efficiency) into smaller, overlapping subproblems and building optimal solutions systematically. Demonstrating mastery of DP signals you can think recursively about a problem, identify optimal substructure, and implement efficient, cached solutions—exactly the kind of scalable thinking needed for engineering roles that handle millions of orders.

## What to Expect — Types of Problems

Zomato’s DP questions typically fall into two categories, both grounded in practical scenarios.

1.  **Classic Optimization Problems:** You can expect adaptations of well-known DP patterns. The "0/1 Knapsack" pattern is highly relevant for problems like maximizing delivery value within a scooter’s capacity or bundling orders for a single delivery executive. The "Longest Common Subsequence" (LCS) pattern might be applied to menu matching or route similarity. "Coin Change" variants could model assigning payment denominations or allocating delivery slots.
2.  **1D/2D Array DP:** Many problems involve traversing a grid or a sequence. A classic is the "Minimum Path Sum" problem, which directly mirrors finding the fastest route for a delivery agent through a grid of traffic delays. "House Robber" style problems could model selecting non-adjacent restaurants for promotions or scheduling order batches without conflict.

The key is that these problems will rarely be presented in their textbook form. You’ll need to map the problem statement—often about delivery times, order values, or route efficiency—onto a known DP pattern.

## How to Prepare — Study Tips with One Code Example

Effective DP preparation requires a structured approach. First, **internalize the core principles:** optimal substructure (an optimal solution can be constructed from optimal solutions of its subproblems) and overlapping subproblems. Second, **practice the solution process:** define the state (what does `dp[i]` represent?), establish the recurrence relation, set base cases, and decide the traversal order (top-down memoization or bottom-up tabulation). Third, **focus on pattern recognition,** not memorizing solutions.

A fundamental pattern is the **0/1 Knapsack**. Here’s how to solve it using bottom-up DP, where you must choose items with given values and weights to maximize total value without exceeding a capacity.

<div class="code-group">

```python
def knapsack(values, weights, capacity):
    n = len(values)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]

# Example: Items: (value, weight) = [(60, 10), (100, 20), (120, 30)], Capacity = 50
# Output: 220
```

```javascript
function knapsack(values, weights, capacity) {
  const n = values.length;
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}
// Example: Items: [(60,10), (100,20), (120,30)], Capacity = 50 -> 220
```

```java
public class Knapsack {
    public static int knapsack(int[] values, int[] weights, int capacity) {
        int n = values.length;
        int[][] dp = new int[n + 1][capacity + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                if (weights[i-1] <= w) {
                    dp[i][w] = Math.max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]]);
                } else {
                    dp[i][w] = dp[i-1][w];
                }
            }
        }
        return dp[n][capacity];
    }
}
// Example: Items: {(60,10), (100,20), (120,30)}, Capacity = 50 -> 220
```

</div>

## Recommended Practice Order

Build your DP skills progressively. Start with foundational 1D problems: **Climbing Stairs, House Robber, Coin Change.** Next, master core patterns: **0/1 Knapsack, Unbounded Knapsack, Longest Common Subsequence, and Longest Increasing Subsequence.** Then, move to 2D DP: **Unique Paths, Minimum Path Sum.** Finally, tackle more complex problems involving strings or partitions, like **Palindrome Partitioning or Edit Distance.** For each problem, first attempt a brute-force recursive solution, then add memoization (top-down), and finally derive the iterative bottom-up DP table. This sequence ensures you deeply understand the recurrence before optimizing.

[Practice Dynamic Programming at Zomato](/company/zomato/dynamic-programming)
