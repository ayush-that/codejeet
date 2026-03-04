---
title: "Dynamic Programming Questions at MakeMyTrip: What to Expect"
description: "Prepare for Dynamic Programming interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-15"
category: "dsa-patterns"
tags: ["makemytrip", "dynamic-programming", "interview prep"]
---

Dynamic Programming (DP) is a core algorithmic paradigm tested at MakeMyTrip, representing over a third of their technical interview problems. For a company managing complex travel logistics—optimizing flight paths, pricing bundles, hotel allocations, and route planning—DP is not an academic exercise. It's the practical framework for solving optimization and combinatorial problems at scale. Successfully navigating these questions demonstrates your ability to break down intricate real-world problems into overlapping subproblems and build efficient, optimal solutions, a skill directly applicable to backend systems, pricing engines, and inventory management.

## What to Expect — Types of Problems

MakeMyTrip's DP problems typically fall into two categories, mirroring their business domains.

1.  **Classic Optimization & Counting Problems:** These are foundational DP patterns applied to travel-adjacent scenarios. Expect variations of the Knapsack problem (e.g., selecting travel packages within a budget for maximum value), Coin Change (calculating payment combinations or loyalty point redemptions), Longest Common Subsequence (comparing itineraries or user preferences), and Minimum Path Sum (finding the cheapest route through a grid of flight or hotel options).

2.  **String & Array Manipulation:** These problems assess your ability to handle sequence data, crucial for processing search queries, dates, and customer information. Common patterns include Longest Palindromic Substring (could model symmetrical itinerary planning), Edit Distance (fuzzy matching for city or hotel names), and problems involving subsequences or partitions.

The key is recognizing the underlying pattern within a potentially novel problem statement related to travel.

## How to Prepare — Study Tips with One Code Example

Move beyond memorization. Focus on the core principle: defining a state (`dp[i]` or `dp[i][j]`), establishing a base case, and formulating a recurrence relation. Practice by first solving the standard problem, then verbally walking through how you'd adapt it to a hypothetical travel context.

A fundamental pattern is the **0/1 Knapsack Problem**, which models selecting indivisible items (like travel add-ons) with weight and value under a capacity constraint (like a budget). Here is the iterative DP solution:

<div class="code-group">

```python
def knapSack(capacity, weights, values, n):
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(values[i-1] + dp[i-1][w - weights[i-1]],
                               dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]

# Example: Choose between upgrades (values) with costs (weights) under a budget.
```

```javascript
function knapSack(capacity, weights, values, n) {
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
public class Knapsack {
    static int knapSack(int capacity, int[] weights, int[] values, int n) {
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
}
```

</div>

## Recommended Practice Order

Build competency sequentially:

1.  **Start with 1D DP:** Fibonacci, Coin Change (minimum/maximum ways), Climbing Stairs.
2.  **Master 2D DP for sequences:** Longest Common Subsequence, Longest Palindromic Subsequence, Edit Distance.
3.  **Tackle the Knapsack family:** 0/1 Knapsack, Subset Sum, Partition Equal Subset Sum.
4.  **Solve Matrix/Grid Path problems:** Minimum Path Sum, Unique Paths.
5.  **Finally, attempt harder categories:** DP on Trees, Interval DP (e.g., Matrix Chain Multiplication).

For each pattern, implement it, then analyze its time/space complexity and potential for optimization (e.g., space reduction in Knapsack).

[Practice Dynamic Programming at MakeMyTrip](/company/makemytrip/dynamic-programming)
