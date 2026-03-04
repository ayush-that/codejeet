---
title: "Dynamic Programming Questions at Citadel: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Citadel — patterns, difficulty breakdown, and study tips."
date: "2028-08-02"
category: "dsa-patterns"
tags: ["citadel", "dynamic-programming", "interview prep"]
---

Dynamic Programming (DP) is a core competency for quantitative roles at firms like Citadel. It’s not just an algorithmic curiosity; it’s a practical tool for modeling complex, multi-stage decision-making under uncertainty—the essence of many quantitative finance problems, from optimal trade execution to option pricing. Citadel’s interview process reflects this. With 24 out of their 96 cataloged coding questions being DP problems, it’s clear they prioritize candidates who can decompose a problem into overlapping subproblems and build efficient, optimal solutions. Mastering DP demonstrates you can think recursively, optimize for performance, and handle the stateful computations common in financial modeling.

## What to Expect — Types of Problems

You will encounter DP problems that test both foundational patterns and financial intuition. Common categories include:

- **Classic 1D/2D DP:** Problems like climbing stairs, coin change, or longest common subsequence test your grasp of state definition and transition.
- **Knapsack Variants:** These are highly relevant for resource allocation (e.g., capital allocation, portfolio optimization under constraints).
- **Interval DP:** Problems involving decisions over sequences or ranges, which can mirror scheduling or order book analysis.
- **DP on Strings:** Often used in comparisons and alignments.
- **State Machine DP:** Some problems involve tracking multiple states (like buy/sell/hold), directly analogous to trading strategies with transaction constraints. Expect problems that may have a financial flavor, such as maximizing profit from a series of transactions.

## How to Prepare — Study Tips with One Code Example

Move beyond memorization. For each problem, internalize the recurrence relation. Follow this process: 1) Define the state (`dp[i]` or `dp[i][j]` means what?), 2) Establish the base case, 3) Write the transition, 4) Determine the final answer's location. Practice both top-down (memoized recursion) and bottom-up (iterative tabulation) approaches.

A key pattern is the **0/1 Knapsack**. You have items with weights and values, and a capacity. You must maximize total value without exceeding capacity.

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
```

```java
public int knapsack(int[] values, int[] weights, int capacity) {
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
```

</div>

## Recommended Practice Order

Build your skills progressively. Start with foundational 1D DP (Fibonacci, Climbing Stairs). Then master the 0/1 Knapsack pattern and its variants (subset sum, partition problems). Move on to 2D DP for sequences (Longest Common Subsequence, Edit Distance). Practice interval DP and state machine DP (Best Time to Buy and Sell Stock with cooldown). Finally, tackle Citadel’s specific tagged problems, focusing on those with higher frequency.

[Practice Dynamic Programming at Citadel](/company/citadel/dynamic-programming)
