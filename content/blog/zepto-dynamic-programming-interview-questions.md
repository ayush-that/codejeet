---
title: "Dynamic Programming Questions at Zepto: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-12-04"
category: "dsa-patterns"
tags: ["zepto", "dynamic-programming", "interview prep"]
---

Dynamic Programming (DP) is a core algorithmic technique for optimizing solutions to complex problems by breaking them down into simpler overlapping subproblems. At Zepto, a company built on the fast-paced logistics of 10-minute grocery delivery, algorithmic efficiency isn't academic—it's operational. Their systems must constantly solve optimization problems: finding the fastest delivery routes (a variant of the shortest path problem), bundling orders for a single runner (knapsack-like resource allocation), or managing inventory across hubs. DP provides the framework for solving these problems with optimal or near-optimal efficiency at scale. With 5 out of their 28 tagged coding problems focusing on DP, mastering it is non-negotiable for candidates in engineering roles, particularly those dealing with backend systems, logistics, and optimization.

## What to Expect — Types of Problems

Zepto's DP questions typically fall into two practical categories that mirror their business domain.

1.  **Combinatorial Optimization:** These are classic DP patterns applied to real-world constraints. Expect variations of the Knapsack problem (e.g., "Given a delivery runner's capacity, what's the maximum value of orders they can carry?") or problems involving sequences and choices, like finding the longest or shortest valid sequence of operations. The "state" often represents a resource limit (like time or capacity) and a decision point.
2.  **String/Sequence Analysis:** DP on strings is prevalent for tasks like order matching, route similarity, or parsing. Common patterns include Longest Common Subsequence (LCS) for comparing two sequences (like two potential delivery lists) or Edit Distance for measuring the difference between strings, which can model the cost of reconciling two order states.

The problems will likely be framed within a relatable context—delivery, inventory, user journeys—but will fundamentally test your ability to identify the overlapping subproblems and optimal substructure that make DP applicable.

## How to Prepare — Study Tips with One Code Example

Start by internalizing the core DP patterns, not just memorizing solutions. Follow this process: 1) Identify if the problem has overlapping subproblems and optimal substructure. 2) Define the state (`dp[i]` or `dp[i][j]` usually represents the best answer up to a certain point). 3) Formulate the state transition relation (the recurrence). 4) Determine base cases. 5) Implement iteration order and space optimization.

A fundamental pattern is the **0/1 Knapsack**. Imagine a delivery runner with a weight capacity `W`. They have `n` orders, each with a weight `wt[i]` and a value `val[i]` (representing priority or revenue). The goal is to maximize the total value without exceeding capacity.

<div class="code-group">

```python
def knapSack(W, wt, val, n):
    dp = [0] * (W + 1)
    for i in range(n):
        # Iterate backwards to ensure each item is used at most once
        for w in range(W, wt[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - wt[i]] + val[i])
    return dp[W]
```

```javascript
function knapSack(W, wt, val, n) {
  let dp = new Array(W + 1).fill(0);
  for (let i = 0; i < n; i++) {
    for (let w = W; w >= wt[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
    }
  }
  return dp[W];
}
```

```java
public int knapSack(int W, int[] wt, int[] val, int n) {
    int[] dp = new int[W + 1];
    for (int i = 0; i < n; i++) {
        for (int w = W; w >= wt[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
        }
    }
    return dp[W];
}
```

</div>

This optimized version uses a 1D array and iterates backwards on the weight dimension. The key transition is `dp[w] = max(not_take_current_item, take_current_item)`.

## Recommended Practice Order

Tackle problems in this order to build a solid foundation:

1.  **Classic Fundamentals:** Fibonacci, Climbing Stairs, 0/1 Knapsack.
2.  **String DP:** Longest Common Subsequence, Edit Distance.
3.  **Grid/Path DP:** Unique Paths, Minimum Path Sum.
4.  **Partition/Interval DP:** (Advanced) Problems like Matrix Chain Multiplication, which model complex decision trees.
5.  **Zepto-Tagged Problems:** Finally, apply your pattern recognition to the specific DP problems in Zepto's question bank. Contextualize how each problem could map to a real system at the company.

[Practice Dynamic Programming at Zepto](/company/zepto/dynamic-programming)
