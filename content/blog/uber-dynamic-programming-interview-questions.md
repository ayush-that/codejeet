---
title: "Dynamic Programming Questions at Uber: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-06-05"
category: "dsa-patterns"
tags: ["uber", "dynamic-programming", "interview prep"]
---

Dynamic Programming (DP) is a critical skill for software engineering interviews at Uber because it directly tests a candidate's ability to optimize complex, real-world problems. Uber's systems—from calculating the most efficient route and fare for a ride to managing real-time driver dispatch and surge pricing—involve making optimal decisions over sequences or states. DP is the algorithmic framework for solving these overlapping subproblems with optimal substructure. With 59 DP questions in their known question bank, it's a high-frequency topic. Mastering it demonstrates you can think about efficiency and scalability, which is essential for handling Uber's massive global data and real-time constraints.

## What to Expect — Types of Problems

Uber's DP questions often model real operational challenges. You can expect problems in these core categories:

1.  **String/Sequence DP:** These are among the most common. Problems involve comparing, transforming, or analyzing sequences, such as calculating the edit distance between two location strings, finding the longest common subsequence in trip data, or counting distinct ways to decode a message (e.g., from a mapping system).
2.  **Knapsack/Partition Problems:** These model resource allocation. A typical problem might involve selecting a subset of driver assignments or service requests to maximize value within a capacity constraint, like a driver's shift time or vehicle capacity.
3.  **State Machine DP:** Uber's real-time systems are all about state transitions (e.g., a trip status from _requested_ to _en route_ to _completed_). DP problems can model these, requiring you to track multiple states to find an optimal path, such as maximizing profit with cooldown periods between activities.
4.  **Grid/Matrix DP:** Used for navigation and pathfinding. Classic problems include finding unique paths or minimum cost paths through a grid, directly analogous to navigating a city map with obstacles or variable traffic costs.

The problems are rarely presented in their raw algorithmic form. The key is to identify the underlying DP pattern behind the Uber-specific scenario.

## How to Prepare — Study Tips with One Code Example

Start by solidifying the fundamentals. Memorizing solutions is ineffective; you must understand the _why_. Internalize the two hallmarks of a DP problem: **optimal substructure** (an optimal solution can be constructed from optimal solutions of its subproblems) and **overlapping subproblems**.

Your approach for any problem should be:

1.  **Define the State:** What does `dp[i]` or `dp[i][j]` represent? Be precise.
2.  **Define the Recurrence Relation:** How does a given state relate to previous, smaller states? This is the core transition.
3.  **Define Base Cases:** What are the smallest, simplest subproblems you can solve directly?
4.  **Determine Iteration Order & Space Optimization:** Decide if you need a 1D or 2D array and the direction to fill it. Later, see if you can reduce space complexity.

Let's look at a fundamental pattern: the **0/1 Knapsack Problem**. Imagine selecting ride requests (each with a value and duration) to maximize total value without exceeding a driver's shift duration.

<div class="code-group">

```python
def knapsack(values, weights, capacity):
    n = len(values)
    dp = [0] * (capacity + 1)

    for i in range(n):
        # Iterate backwards to ensure each item is used at most once
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[capacity]

# Example: values = [60, 100, 120], weights = [10, 20, 30], capacity = 50
# Result: 220
```

```javascript
function knapsack(values, weights, capacity) {
  const n = values.length;
  const dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < n; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}
```

```java
public int knapsack(int[] values, int[] weights, int capacity) {
    int n = values.length;
    int[] dp = new int[capacity + 1];

    for (int i = 0; i < n; i++) {
        for (int w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}
```

</div>

## Recommended Practice Order

Build your skills progressively:

1.  **Foundation:** Start with classic 1D DP: Climbing Stairs, House Robber, Coin Change.
2.  **String Sequences:** Practice Longest Common Subsequence, Edit Distance, and Decode Ways.
3.  **2D & Grid DP:** Solve Unique Paths, Minimum Path Sum.
4.  **Knapsack Variants:** Master the 0/1 Knapsack (above) and Partition Equal Subset Sum.
5.  **State Machine:** Tackle Best Time to Buy and Sell Stock with Cooldown.
6.  **Uber-Specific Practice:** Finally, apply these patterns to actual Uber-tagged DP problems to contextualize your knowledge.

[Practice Dynamic Programming at Uber](/company/uber/dynamic-programming)
