---
title: "Dynamic Programming Questions at Amazon: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Amazon — patterns, difficulty breakdown, and study tips."
date: "2027-02-25"
category: "dsa-patterns"
tags: ["amazon", "dynamic-programming", "interview prep"]
---

Dynamic Programming (DP) is a cornerstone of Amazon's technical interviews because it directly tests a candidate's ability to break down complex, scalable problems into optimal, overlapping subproblems. At Amazon, efficient algorithms are not academic—they are essential for systems handling millions of requests, optimizing logistics in fulfillment centers, or managing data in AWS. A candidate who can recognize and implement a DP solution demonstrates the analytical rigor and systems thinking required to build cost-effective, high-performance solutions at Amazon's scale. With 277 DP questions in their question bank (out of 1938 total), it's a pattern you cannot afford to overlook.

## What to Expect — Types of Problems

Amazon's DP questions often revolve around practical, large-scale scenarios. You can generally expect them to fall into a few key categories:

1.  **String & Sequence Manipulation:** Problems like edit distance, longest common subsequence, or palindrome partitioning. These model text processing, data deduplication, or DNA sequence analysis at scale.
2.  **Knapsack & Resource Allocation:** Classic 0/1 Knapsack or unbounded knapsack variants. These directly relate to inventory management, cost optimization, and resource scheduling within fulfillment networks.
3.  **Pathfinding & Grid Problems:** Finding unique paths, minimum path sums, or maximum profit in a grid. These abstract routing algorithms for delivery or robotics in warehouses.
4.  **Decision & State Problems:** House Robber, buying/selling stock with constraints, or decoding ways. These test your ability to model decisions with dependencies over time.

The problems are rarely presented as pure algorithm exercises. Instead, they are wrapped in a business narrative—optimizing packaging, routing data, or allocating server capacity—requiring you to strip away the context to reveal the underlying DP structure.

## How to Prepare — Study Tips with One Code Example

Start by internalizing the core DP patterns, not just memorizing solutions. Follow this process: 1) Identify the problem as having **optimal substructure** (the best solution can be built from best sub-solutions) and **overlapping subproblems**. 2) Define the **state** (`dp[i]` or `dp[i][j]`). 3) Establish the **recurrence relation**. 4) Determine **base cases** and **iteration order**.

A fundamental pattern is the "Fibonacci-style" or "count ways" DP, which forms the basis for many pathfinding problems. Let's look at a classic: counting the number of unique ways to climb `n` stairs, taking 1 or 2 steps at a time.

<div class="code-group">

```python
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1  # Base case: 1 way for 1 step
    dp[2] = 2  # Base case: 2 ways for 2 steps (1+1, 2)
    for i in range(3, n + 1):
        # Recurrence: Ways to reach i = ways to (i-1) + ways to (i-2)
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
```

```javascript
function climbStairs(n) {
  if (n <= 2) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1; // Base case
  dp[2] = 2; // Base case
  for (let i = 3; i <= n; i++) {
    // Recurrence relation
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
```

```java
public int climbStairs(int n) {
    if (n <= 2) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1; // Base case
    dp[2] = 2; // Base case
    for (int i = 3; i <= n; i++) {
        // Recurrence relation
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

</div>

This pattern of `dp[i] = dp[i-1] + dp[i-2]` is the essence of many "count ways" problems. Practice by identifying its variants.

## Recommended Practice Order

Do not jump into hard problems. Build competence systematically:

1.  **Foundation:** Master Fibonacci, Climbing Stairs, and Min Cost Climbing Stairs. Understand top-down (memoization) and bottom-up (tabulation).
2.  **1D DP:** Solve House Robber, Decode Ways, and Word Break. Focus on defining the state and transition clearly.
3.  **2D/Grid DP:** Practice Unique Paths, Minimum Path Sum, and 0/1 Knapsack. This is where most Amazon problems reside.
4.  **String DP:** Tackle Longest Common Subsequence and Edit Distance. These are frequent and challenging.
5.  **Amazon-Focused:** Finally, drill problems frequently tagged for Amazon, especially those involving strings, knapsack, and pathfinding.

Consistency is key. Solve at least 2-3 DP problems daily, always aiming to derive the recurrence yourself before looking at solutions.

[Practice Dynamic Programming at Amazon](/company/amazon/dynamic-programming)
