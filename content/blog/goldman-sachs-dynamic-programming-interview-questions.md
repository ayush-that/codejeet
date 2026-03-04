---
title: "Dynamic Programming Questions at Goldman Sachs: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Goldman Sachs — patterns, difficulty breakdown, and study tips."
date: "2027-08-04"
category: "dsa-patterns"
tags: ["goldman-sachs", "dynamic-programming", "interview prep"]
---

Dynamic Programming (DP) is a cornerstone of Goldman Sachs' technical interviews because it directly tests a candidate's ability to optimize solutions to complex, multi-step problems—a daily necessity in financial software engineering and quantitative analysis. The firm’s systems, from risk modeling and trade execution to pricing algorithms, often involve recursive calculations over massive datasets where naive solutions are computationally impossible. Mastering DP demonstrates you can break down a large problem, identify overlapping subproblems, store results to avoid redundant work, and build an optimal solution efficiently. With 56 DP questions in their known question bank (out of 270 total), it's a domain you cannot afford to overlook.

## What to Expect — Types of Problems

Goldman Sachs DP questions frequently fall into a few predictable categories. You won't see overly obscure problems; instead, expect classic patterns applied to finance-adjacent scenarios.

1.  **Knapsack & Subset Problems:** These model resource allocation, such as selecting a portfolio of trades under capital constraints or bundling financial instruments. Problems often involve finding a subset that meets a target sum or maximizes value given a limit.
2.  **String & Sequence DP:** Common for comparing time-series data, transaction sequences, or parsing financial messages. Look for Longest Common Subsequence (LCS), Edit Distance, and palindromic substring problems.
3.  **Grid & Pathfinding:** Used in modeling paths through a matrix of costs, probabilities, or returns—think of navigating a grid of trading decisions or risk values. This includes classic minimum/maximum path sum problems.
4.  **1D/2D Dynamic Programming:** Simpler linear problems, like the "House Robber" pattern (maximizing non-adjacent sums), often appear as a first step to gauge fundamental DP understanding.

The problems are often dressed in financial terminology (e.g., "maximize profit," "minimize risk," "count valid trade sequences"), but the underlying algorithm is standard.

## How to Prepare — Study Tips with One Code Example

Start by internalizing the core DP patterns, not just memorizing solutions. Use a systematic approach: 1) Define the state `dp[i]` or `dp[i][j]`, 2) Establish the recurrence relation, 3) Set base cases, and 4) Determine the traversal order and final answer location.

A critical pattern is the **0/1 Knapsack**. It's the foundation for many resource optimization questions. Here is the standard implementation for finding the maximum value achievable with a given weight capacity.

<div class="code-group">

```python
def knapsack(values, weights, capacity):
    n = len(values)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]
```

```javascript
function knapsack(values, weights, capacity) {
  const n = values.length;
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}
```

```java
public int knapsack(int[] values, int[] weights, int capacity) {
    int n = values.length;
    int[][] dp = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]]);
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    return dp[n][capacity];
}
```

</div>

## Recommended Practice Order

Build competence sequentially. First, ensure you are solid on recursion and memoization (top-down DP). Then, practice bottom-up tabulation for these core patterns in this order:

1.  **Fibonacci & 1D DP** (Climbing Stairs, House Robber)
2.  **0/1 Knapsack** and its variants (Subset Sum, Partition Equal Subset Sum)
3.  **Unbounded Knapsack** (Coin Change)
4.  **Longest Common Subsequence (LCS)** and Edit Distance
5.  **Matrix/Grid Path** problems (Unique Paths, Minimum Path Sum)
6.  **String DP** problems (Longest Palindromic Subsequence)

Finally, apply these patterns to Goldman Sachs' tagged questions. Time yourself and practice verbalizing your thought process clearly, as interviewers prioritize your problem-solving narrative as much as the final code.

[Practice Dynamic Programming at Goldman Sachs](/company/goldman-sachs/dynamic-programming)
