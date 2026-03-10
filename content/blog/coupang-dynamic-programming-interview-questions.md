---
title: "Dynamic Programming Questions at Coupang: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Coupang — patterns, difficulty breakdown, and study tips."
date: "2029-06-22"
category: "dsa-patterns"
tags: ["coupang", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Coupang isn't just another topic on a list; it's a critical filter. With 9 out of their 53 tagged problems being DP, that's roughly 17% of their technical problem bank. In practice, this means you have a significant chance of encountering at least one DP question in your interview loop, especially for mid-to-senior roles. Why? Coupang's core business—large-scale logistics, inventory management, and real-time routing—is riddled with optimization problems. Whether it's minimizing delivery costs, optimizing warehouse bin packing, or calculating the most efficient fulfillment paths, the underlying thought process of breaking down a complex problem into overlapping subproblems (DP's essence) is directly applicable. They're not testing academic trivia; they're testing for a scalable, efficient problem-solving mindset that mirrors the engineering challenges their teams face daily.

## Specific Patterns Coupang Favors

Coupang's DP questions tend to skew towards practical, one-dimensional and two-dimensional patterns rather than esoteric graph DP. You'll most frequently encounter:

1.  **Classic 0/1 Knapsack & Variations:** This is the undisputed king. The pattern of making a sequence of binary decisions (include/exclude) with a capacity constraint is fundamental to resource allocation—a perfect fit for logistics. Expect variations that aren't about literal knapsacks.
2.  **String/Sequence DP:** Problems involving edit distance, longest common subsequence, and palindrome partitioning. These test your ability to define a state based on positions in two sequences, a common pattern in data processing pipelines.
3.  **Linear DP (1D):** Problems like "Climbing Stairs", "House Robber", and "Decode Ways". These are often used as a warm-up or a follow-up to gauge if you understand the core concept of state definition and transition before jumping to more complex variants.

You will notice a distinct _lack_ of highly abstract graph DP (like DP on trees or DAGs with complex state compression). Coupang's DP is typically iterative bottom-up tabulation, as it's more intuitive for optimization problems and maps better to real-world system design where you're filling a results table.

## How to Prepare

The key is to internalize the framework, not memorize problems. For Coupang, master this iterative, tabulation-based approach:

1.  **Define the DP Array:** What does `dp[i]` or `dp[i][j]` represent? Be precise. (e.g., "`dp[i][j]` is the minimum cost to achieve the first `i` results considering the first `j` resources").
2.  **Initialize the Base Cases:** What are the smallest, trivial subproblems you know the answer to? This often involves initializing the first row/column or `dp[0]`.
3.  **State the Transition Relation:** How do you build the solution for a larger subproblem from smaller, already-solved ones? This is the core formula.
4.  **Determine the Iteration Order:** You must iterate such that when you need a smaller subproblem's result, it has already been computed and stored in your table.
5.  **Extract the Final Answer:** Which cell in your DP table holds the solution to the original problem?

Let's see this with the **0/1 Knapsack** pattern, the most likely candidate.

<div class="code-group">

```python
def knapsack(weights, values, capacity):
    """
    Classic 0/1 Knapsack. Returns maximum value.
    Time: O(n * capacity) | Space: O(n * capacity)
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
                dp[i][w] = max(dp[i][w],
                               dp[i-1][w - weights[i-1]] + values[i-1])
    return dp[n][capacity]

# Space-optimized version (common follow-up)
def knapsack_optimized(weights, values, capacity):
    """
    Time: O(n * capacity) | Space: O(capacity)
    """
    dp = [0] * (capacity + 1)
    for i in range(n):
        # Iterate backwards to avoid overwriting needed subproblems
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[capacity]
```

```javascript
function knapsack(weights, values, capacity) {
  // Time: O(n * capacity) | Space: O(n * capacity)
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      // Don't take item i-1
      dp[i][w] = dp[i - 1][w];
      // Take item i-1 if it fits
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
      }
    }
  }
  return dp[n][capacity];
}

// Space-optimized version
function knapsackOptimized(weights, values, capacity) {
  // Time: O(n * capacity) | Space: O(capacity)
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}
```

```java
public class Knapsack {
    // Time: O(n * capacity) | Space: O(n * capacity)
    public int knapsack(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                // Don't take item i-1
                dp[i][w] = dp[i-1][w];
                // Take item i-1 if it fits
                if (weights[i-1] <= w) {
                    dp[i][w] = Math.max(
                        dp[i][w],
                        dp[i-1][w - weights[i-1]] + values[i-1]
                    );
                }
            }
        }
        return dp[n][capacity];
    }

    // Space-optimized version
    // Time: O(n * capacity) | Space: O(capacity)
    public int knapsackOptimized(int[] weights, int[] values, int capacity) {
        int[] dp = new int[capacity + 1];
        for (int i = 0; i < weights.length; i++) {
            for (int w = capacity; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
        return dp[capacity];
    }
}
```

</div>

## How Coupang Tests Dynamic Programming vs Other Companies

Compared to other companies, Coupang's DP style is more "applied" and less "purely algorithmic."

- **vs. FAANG (Meta, Google):** FAANG might ask more diverse DP, including DP on trees (Google) or complex state compression (Meta). Coupang's problems are more grounded. They feel like a stripped-down version of a real system design problem.
- **vs. Finance/HFT:** Finance DP can be more mathematically intense. Coupang's difficulty is high but focused on clear, logical decomposition.
- **The Coupang Difference:** The unique angle is the **follow-up**. After you solve the core DP problem, be prepared to discuss how it scales. "What if `capacity` is in the billions?" (Hint: you might shift to a DP-on-value approach). "How would you modify this if items could be split?" (It becomes a greedy fractional knapsack). They are testing if you can see the _engineering implications_ of the algorithm.

## Study Order

Tackle DP in this logical progression to build a solid foundation:

1.  **Foundation & 1D Linear DP:** Start with "Climbing Stairs" and "House Robber". This teaches you the simplest form of state (`dp[i]`) and transition (`dp[i] = dp[i-1] + dp[i-2]`).
2.  **Classic 2D Sequence DP:** Move to "Longest Common Subsequence" and "Edit Distance". This is crucial for learning to define state with two indices (`dp[i][j]`) and handling string/sequence comparisons.
3.  **The 0/1 Knapsack Framework:** Master the standard knapsack, then its variations like "Partition Equal Subset Sum" (LeetCode #416) or "Target Sum" (LeetCode #494). This pattern is non-negotiable for Coupang.
4.  **Unbounded Knapsack & Coin Change:** Learn the variant where items can be reused infinitely ("Coin Change" LeetCode #322). The iteration order changes (forward vs. backward in the space-optimized version).
5.  **Interval & 2D Grid DP:** Problems like "Unique Paths" and "Minimum Path Sum". These solidify your understanding of moving through a 2D state space, which can model grid-based logistics scenarios.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous pattern.

1.  **Climbing Stairs (LeetCode #70)** - The "Hello World" of DP.
2.  **House Robber (LeetCode #198)** - Introduces the "take or skip" decision.
3.  **Longest Common Subsequence (LeetCode #1143)** - Master 2D sequence DP.
4.  **0/1 Knapsack (Standard Problem)** - Find it on GeeksforGeeks or similar. Do the classic version first.
5.  **Partition Equal Subset Sum (LeetCode #416)** - A brilliant knapsack variation.
6.  **Coin Change (LeetCode #322)** - Unbounded knapsack pattern.
7.  **Target Sum (LeetCode #494)** - A more challenging knapsack variant (can be reduced to subset sum).
8.  **Edit Distance (LeetCode #72)** - A classic 2D DP often asked for its practical utility in data correction.
9.  **Decode Ways (LeetCode #91)** - Excellent for testing careful initialization and edge case handling in 1D DP.

Focus on writing clean, iterative tabulation code for each. Explain your state definition aloud as you practice. For Coupang, if you can confidently solve problems 4, 5, 6, and 8 using the framework outlined, you'll be in a very strong position.

[Practice Dynamic Programming at Coupang](/company/coupang/dynamic-programming)
