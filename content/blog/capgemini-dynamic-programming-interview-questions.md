---
title: "Dynamic Programming Questions at Capgemini: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Capgemini — patterns, difficulty breakdown, and study tips."
date: "2030-04-30"
category: "dsa-patterns"
tags: ["capgemini", "dynamic-programming", "interview prep"]
---

Dynamic Programming (DP) is a critical filter in Capgemini's technical interviews. With 3 out of 36 total questions dedicated to DP, it's a focused area that tests a candidate's ability to move beyond brute-force solutions and think in terms of optimization and overlapping subproblems. For a global consulting and technology services firm like Capgemini, this skill is directly relevant. Consultants and engineers often design systems, optimize processes, and solve client problems where efficient resource allocation—whether it's compute time, memory, or project scheduling—is paramount. Demonstrating mastery of DP signals you can handle complex, scalable problem-solving, a core requirement for roles in software development, data engineering, and technical analysis.

## What to Expect — Types of Problems

You will not encounter esoteric, competition-level DP problems. Capgemini's questions are practical and align with common algorithmic patterns. Expect problems that can be broken down into these categories:

- **Classic Knapsack Variants:** Problems involving optimal selection or partitioning, such as subset sum or minimum coin change.
- **1D/2D Sequence Problems:** These involve strings or arrays, like the Longest Common Subsequence (LCS), Longest Increasing Subsequence (LIS), or edit distance.
- **Simple Path/Grid Problems:** Finding minimum or maximum cost paths in a grid, or counting unique paths with obstacles.
- **Basic State Machine DP:** Problems like "House Robber" or buying/selling stock with a small number of states.

The complexity is typically moderate. The key is recognizing the DP pattern, correctly defining the state (e.g., `dp[i][j]`), and formulating the recurrence relation.

## How to Prepare — Study Tips with One Code Example

Start by solidifying the core concept: DP is optimized recursion using memoization (top-down) or tabulation (bottom-up). For interviews, the bottom-up approach is often clearer to explain.

1.  **Pattern First, Problems Second:** Learn the fundamental patterns (0/1 Knapsack, LCS, LIS, etc.) before tackling numerous problems.
2.  **Solve by Hand:** For a new problem, manually solve a small instance. This forces you to identify subproblems and dependencies.
3.  **Define the State:** Ask, "What is the smallest piece of information I need to store to build the solution incrementally?"
4.  **Find the Recurrence:** This is the heart of DP—how does a larger solution depend on smaller, already-computed solutions?

**Code Example: The 0/1 Knapsack Pattern**
This is a foundational pattern. Given weights and values of items and a capacity, find the maximum value you can carry.

<div class="code-group">

```python
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(
                    values[i-1] + dp[i-1][w - weights[i-1]],
                    dp[i-1][w]
                )
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]
```

```javascript
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}
```

```java
public int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= capacity; w++) {
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(
                    values[i-1] + dp[i-1][w - weights[i-1]],
                    dp[i-1][w]
                );
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

Do not jump into hard problems. Follow this progression:

1.  **Foundation:** Fibonacci sequence (memoization vs. tabulation).
2.  **Core Patterns:** 0/1 Knapsack, Longest Common Subsequence, Longest Increasing Subsequence, Coin Change (counting ways and minimum coins), Edit Distance.
3.  **Capgemini-Level Practice:** House Robber, Unique Paths I & II, Partition Equal Subset Sum, Target Sum.
4.  **Review & Mock:** Re-solve problems without reference. Explain your solution aloud as you would in an interview.

[Practice Dynamic Programming at Capgemini](/company/capgemini/dynamic-programming)
