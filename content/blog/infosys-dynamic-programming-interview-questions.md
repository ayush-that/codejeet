---
title: "Dynamic Programming Questions at Infosys: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Infosys — patterns, difficulty breakdown, and study tips."
date: "2027-12-08"
category: "dsa-patterns"
tags: ["infosys", "dynamic-programming", "interview prep"]
---

If you're preparing for Infosys interviews, you might have noticed their coding assessment includes a significant number of Dynamic Programming (DP) questions — 38 out of 158 total problems. That's about 24% of their problem bank. This isn't an accident. While Infosys isn't known for asking the same brutal DP problems as FAANG companies, they heavily emphasize DP in their online coding rounds and technical interviews for a specific reason: it's an excellent filter for identifying candidates who can think systematically about optimization and overlapping subproblems, skills directly transferable to large-scale enterprise system design and performance tuning.

The key insight is this: Infosys uses DP not to test obscure algorithmic brilliance, but to assess structured problem-solving. You won't typically get a "Cherry Pickup" or "Strange Printer" style problem. Instead, expect classic, pattern-based DP questions that have clear real-world analogs in resource allocation, scheduling, or cost optimization — common themes in consulting and system integration projects.

## Specific Patterns Infosys Favors

Infosys's DP questions cluster around a few predictable categories. They strongly favor **iterative (bottom-up) DP** over recursive memoization, likely because it's easier to evaluate in timed coding environments and aligns with how optimization is often implemented in production systems.

The most common patterns, in order of frequency:

1.  **1D Linear DP:** Classic "sequence" problems. Think Fibonacci variations, house robber problems, or ways to climb stairs. These test your ability to define a state and a transition.
2.  **Knapsack & Subset Problems:** This is a major theme. Given a constraint (weight, sum, capacity), find an optimal way to select items. This maps directly to resource allocation tasks.
3.  **Grid/Matrix Traversal DP:** Problems like "Minimum Path Sum" or "Unique Paths." These are essentially 2D DP problems and test your comfort with moving through a state space defined by two indices.
4.  **String DP (LCS & Edit Distance):** Longest Common Subsequence and variations appear frequently. This tests your ability to handle two sequences and has applications in data comparison and diff algorithms.

You will almost never see advanced DP on trees or complex graph DP at Infosys. The focus is on foundational, teachable patterns.

## How to Prepare

Your preparation should be methodical. Don't just solve random DP problems. Internalize the framework:

1.  **Define the State:** What does `dp[i]` or `dp[i][j]` represent? Be precise.
2.  **Define the Recurrence Relation:** How does a state relate to previous states?
3.  **Define the Base Case:** What are the smallest, simplest states you can solve directly?
4.  **Determine the Evaluation Order:** In which order should you compute states so that when you need a previous state, it's already computed?
5.  **Identify the Final Answer:** Which state holds the solution?

Let's look at the most common pattern: the 0/1 Knapsack. This pattern underlies many Infosys problems.

<div class="code-group">

```python
# 0/1 Knapsack - Bottom-Up DP
# Problem: Given weights and values of n items, put them in a knapsack of capacity W
# to get the maximum total value. You cannot break items (0/1 property).
def knapSack(W, wt, val, n):
    # dp[i][w] will store the maximum value achievable with the first i items and capacity w
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]

    # Build table dp[][] in bottom-up manner
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            # If current item's weight is less than or equal to current capacity w
            if wt[i-1] <= w:
                # Choice 1: Include the item (add its value, reduce capacity)
                # Choice 2: Exclude the item
                dp[i][w] = max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w])
            else:
                # Cannot include the item if it's too heavy
                dp[i][w] = dp[i-1][w]
    return dp[n][W]
# Time Complexity: O(n*W), where n is number of items, W is capacity.
# Space Complexity: O(n*W). Can be optimized to O(W) using a 1D array.
```

```javascript
// 0/1 Knapsack - Bottom-Up DP
function knapSack(W, wt, val, n) {
  // dp[i][w] = max value with first i items and capacity w
  let dp = Array(n + 1)
    .fill()
    .map(() => Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (wt[i - 1] <= w) {
        // Max of including or excluding item i-1
        dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][W];
}
// Time Complexity: O(n*W)
// Space Complexity: O(n*W)
```

```java
// 0/1 Knapsack - Bottom-Up DP
public class Knapsack {
    static int knapSack(int W, int wt[], int val[], int n) {
        int[][] dp = new int[n + 1][W + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= W; w++) {
                if (wt[i - 1] <= w) {
                    dp[i][w] = Math.max(
                        val[i - 1] + dp[i - 1][w - wt[i - 1]],
                        dp[i - 1][w]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][W];
    }
}
// Time Complexity: O(n*W)
// Space Complexity: O(n*W)
```

</div>

Another cornerstone is Grid DP. Here's the pattern for Minimum Path Sum, which frequently appears in variations.

<div class="code-group">

```python
# Minimum Path Sum - Bottom-Up DP (In-Place Modification)
# Problem: Given a m x n grid filled with non-negative numbers, find a path from top left
# to bottom right which minimizes the sum of all numbers along its path.
def minPathSum(grid):
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])

    # We can use the input grid as our DP table to save space
    # First row: can only come from left
    for j in range(1, n):
        grid[0][j] += grid[0][j-1]
    # First column: can only come from top
    for i in range(1, m):
        grid[i][0] += grid[i-1][0]

    # For other cells, path sum is value + min(from top, from left)
    for i in range(1, m):
        for j in range(1, n):
            grid[i][j] += min(grid[i-1][j], grid[i][j-1])

    return grid[m-1][n-1]
# Time Complexity: O(m*n), we traverse each cell once.
# Space Complexity: O(1), we reuse the input grid. O(m*n) if modification is not allowed.
```

```javascript
// Minimum Path Sum - Bottom-Up DP
function minPathSum(grid) {
  if (!grid.length) return 0;
  const m = grid.length,
    n = grid[0].length;

  // First row
  for (let j = 1; j < n; j++) {
    grid[0][j] += grid[0][j - 1];
  }
  // First column
  for (let i = 1; i < m; i++) {
    grid[i][0] += grid[i - 1][0];
  }

  // Rest of the grid
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
    }
  }
  return grid[m - 1][n - 1];
}
// Time Complexity: O(m*n)
// Space Complexity: O(1) (modifies input)
```

```java
// Minimum Path Sum - Bottom-Up DP
public class MinPathSum {
    public int minPathSum(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int m = grid.length, n = grid[0].length;

        // First row
        for (int j = 1; j < n; j++) {
            grid[0][j] += grid[0][j-1];
        }
        // First column
        for (int i = 1; i < m; i++) {
            grid[i][0] += grid[i-1][0];
        }

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                grid[i][j] += Math.min(grid[i-1][j], grid[i][j-1]);
            }
        }
        return grid[m-1][n-1];
    }
}
// Time Complexity: O(m*n)
// Space Complexity: O(1) (modifies input)
```

</div>

## How Infosys Tests Dynamic Programming vs Other Companies

The difference is one of **difficulty and presentation**. At companies like Google or Meta, a DP problem is often disguised within a complex scenario or requires a non-obvious state definition. The "aha!" moment is critical. At Infosys, the DP nature of the problem is usually more apparent. The scenarios are straightforward, and the expected pattern is often one of the classics listed above.

The unique aspect of Infosys's approach is the **practical framing**. A problem might be presented as "minimizing server costs" (a knapsack problem) or "finding the most efficient data migration path" (a minimum path sum problem). Your task is to recognize the underlying pattern, not to invent a novel DP state. This makes preparation more formulaic and success more predictable if you've drilled the patterns.

## Study Order

Tackle DP in this specific order to build understanding cumulatively:

1.  **1D DP (Fibonacci-style):** Start with the simplest state definition: `dp[i]` depends on `dp[i-1]` and `dp[i-2]`. This builds intuition for the state-relation-base case triad. (LeetCode 70: Climbing Stairs, LeetCode 198: House Robber).
2.  **Grid/2D DP (Matrix Traversal):** Move to two indices. Learn how movement (right, down) translates to dependencies (`dp[i-1][j]`, `dp[i][j-1]`). This is a natural extension. (LeetCode 62: Unique Paths, LeetCode 64: Minimum Path Sum).
3.  **String DP (LCS):** Introduce comparing two sequences. This teaches you to handle a 2D state where the transition involves matching/not matching characters. (LeetCode 1143: Longest Common Subsequence).
4.  **0/1 Knapsack DP:** This is the core of resource allocation problems. Master the "include/exclude" decision logic. (Classic 0/1 Knapsack, LeetCode 416: Partition Equal Subset Sum).
5.  **Unbounded Knapsack & Coin Change:** A variation where items can be reused. This changes the recurrence slightly and is a common Infosys variant. (LeetCode 322: Coin Change).

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous pattern.

1.  LeetCode 70: Climbing Stairs (1D DP)
2.  LeetCode 198: House Robber (1D DP with a twist)
3.  LeetCode 62: Unique Paths (2D Grid DP)
4.  LeetCode 64: Minimum Path Sum (2D Grid DP with values)
5.  LeetCode 1143: Longest Common Subsequence (String DP)
6.  LeetCode 416: Partition Equal Subset Sum (0/1 Knapsack application)
7.  LeetCode 322: Coin Change (Unbounded Knapsack)

Mastering these seven problems will give you the pattern recognition needed to tackle the vast majority of Infosys's Dynamic Programming questions. Remember, their goal is to see if you can apply a known optimization technique to a business-like problem. Show them you know the technique cold.

[Practice Dynamic Programming at Infosys](/company/infosys/dynamic-programming)
