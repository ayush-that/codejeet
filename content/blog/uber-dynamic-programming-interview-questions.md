---
title: "Dynamic Programming Questions at Uber: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-05-28"
category: "dsa-patterns"
tags: ["uber", "dynamic-programming", "interview prep"]
---

Uber’s interview process is famously pragmatic. They don’t ask Dynamic Programming (DP) questions to test academic knowledge; they ask them because DP is the most efficient way to model many of their core business problems. Think about it: optimizing driver routes (shortest path with constraints), calculating surge pricing over time intervals (state transition), or even matching riders to drivers (assignment problems) can all be framed as DP problems. With 59 DP questions in their tagged LeetCode list—over 15% of their total—it’s not a niche topic. In my experience and from debriefing with dozens of candidates, you should expect at least one DP question in your onsite loop, typically in the second or third technical round. It’s a core focus area because it directly tests your ability to break down a complex, real-world optimization problem into manageable, overlapping subproblems—a skill essential for building efficient systems at Uber’s scale.

## Specific Patterns Uber Favors

Uber’s DP questions have a distinct flavor. They heavily favor **iterative, bottom-up DP** over recursive memoization. This isn’t an accident. Bottom-up DP, which builds a table from the base cases up, mirrors the way you’d process streaming data or batch jobs in a distributed system—you compute results for smaller inputs first, then use them for larger ones. Recursive solutions with deep call stacks are less analogous to production code.

The patterns you’ll see most often are:

1.  **1D/2D "Classic" DP:** These are the workhorses. Think "Climbing Stairs" or "Coin Change" but dressed in Uber’s clothing. The problem statement will involve a real-world metric: "minimum time to reach a destination given traffic light patterns" or "maximum revenue from a series of trip requests with cool-down periods."
2.  **DP on Strings:** Uber deals with massive amounts of text data—locations, user profiles, trip descriptions. Problems like **Edit Distance (#72)** or **Longest Common Subsequence (#1143)** test your ability to efficiently compare and transform sequences, a key operation in data processing pipelines.
3.  **DP on Intervals:** This is a sleeper hit. Scheduling drivers, batching requests, or managing overlapping surge zones are interval problems. **Merge Intervals (#56)** often has a DP cousin, like **Minimum Difficulty of a Job Schedule (#1335)**, where you partition a sequence (days, zones) to optimize a cost.

You’ll notice a distinct lack of highly abstract, purely mathematical DP problems. The context is almost always operational.

## How to Prepare

The key is to practice translating a wordy, scenario-based problem into a formal DP state definition. Your study should focus on this translation step. Let’s look at a classic pattern: finding the number of ways to do something (like unique paths).

A common Uber variant is: "Given a grid of city blocks where some are closed due to construction, how many unique routes can a driver take from the depot (top-left) to a customer (bottom-right) moving only down or right?"

This is **Unique Paths II (#63)**. The pattern is 2D DP where `dp[i][j]` represents the number of ways to reach cell `(i, j)`.

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m * n), can be optimized to O(n)
def uniquePathsWithObstacles(obstacleGrid):
    m, n = len(obstacleGrid), len(obstacleGrid[0])
    dp = [[0] * n for _ in range(m)]

    # Initialize the starting cell
    dp[0][0] = 1 if obstacleGrid[0][0] == 0 else 0

    # Fill the first column
    for i in range(1, m):
        if obstacleGrid[i][0] == 0:
            dp[i][0] = dp[i-1][0]  # Can only come from above

    # Fill the first row
    for j in range(1, n):
        if obstacleGrid[0][j] == 0:
            dp[0][j] = dp[0][j-1]  # Can only come from the left

    # Fill the rest of the DP table
    for i in range(1, m):
        for j in range(1, n):
            if obstacleGrid[i][j] == 0:
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
            # If it's an obstacle, dp[i][j] remains 0

    return dp[m-1][n-1]
```

```javascript
// Time: O(m * n) | Space: O(m * n), can be optimized to O(n)
function uniquePathsWithObstacles(obstacleGrid) {
  const m = obstacleGrid.length,
    n = obstacleGrid[0].length;
  const dp = Array.from({ length: m }, () => new Array(n).fill(0));

  // Start
  dp[0][0] = obstacleGrid[0][0] === 0 ? 1 : 0;

  // First column
  for (let i = 1; i < m; i++) {
    if (obstacleGrid[i][0] === 0) {
      dp[i][0] = dp[i - 1][0];
    }
  }

  // First row
  for (let j = 1; j < n; j++) {
    if (obstacleGrid[0][j] === 0) {
      dp[0][j] = dp[0][j - 1];
    }
  }

  // Rest of the grid
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (obstacleGrid[i][j] === 0) {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      }
    }
  }

  return dp[m - 1][n - 1];
}
```

```java
// Time: O(m * n) | Space: O(m * n), can be optimized to O(n)
public int uniquePathsWithObstacles(int[][] obstacleGrid) {
    int m = obstacleGrid.length, n = obstacleGrid[0].length;
    int[][] dp = new int[m][n];

    // Start
    dp[0][0] = obstacleGrid[0][0] == 0 ? 1 : 0;

    // First column
    for (int i = 1; i < m; i++) {
        if (obstacleGrid[i][0] == 0) {
            dp[i][0] = dp[i-1][0];
        }
    }

    // First row
    for (int j = 1; j < n; j++) {
        if (obstacleGrid[0][j] == 0) {
            dp[0][j] = dp[0][j-1];
        }
    }

    // Rest of the grid
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (obstacleGrid[i][j] == 0) {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
    }

    return dp[m-1][n-1];
}
```

</div>

The second critical pattern is **DP with State**. Uber problems often have an extra dimension, like a resource constraint (e.g., fuel, number of stops). This turns a 2D DP into a 3D DP, or more commonly, a 2D DP where one dimension is the "state." A perfect example is the "Best Time to Buy and Sell Stock with Cooldown (#309)" pattern, which models having a stock or being in a cooldown period.

<div class="code-group">

```python
# Time: O(n) | Space: O(n), can be optimized to O(1)
def maxProfit(prices):
    if not prices:
        return 0

    n = len(prices)
    # dp[i][0]: max profit on day i holding no stock
    # dp[i][1]: max profit on day i holding stock
    # dp[i][2]: max profit on day i in cooldown (sold yesterday)
    dp = [[0, 0, 0] for _ in range(n)]
    dp[0][1] = -prices[0]  # Buy on day 0

    for i in range(1, n):
        # Not holding: either rest from previous day not holding, or come out of cooldown
        dp[i][0] = max(dp[i-1][0], dp[i-1][2])
        # Holding: either hold from previous day, or buy today (must come from state 0)
        dp[i][1] = max(dp[i-1][1], dp[i-1][0] - prices[i])
        # Cooldown: sold today, so previous state must have been holding
        dp[i][2] = dp[i-1][1] + prices[i]

    # Max profit will be in either state 0 (not holding) or state 2 (cooldown)
    return max(dp[n-1][0], dp[n-1][2])
```

```javascript
// Time: O(n) | Space: O(n), can be optimized to O(1)
function maxProfit(prices) {
  if (prices.length === 0) return 0;

  const n = prices.length;
  const dp = Array.from({ length: n }, () => [0, 0, 0]);
  // dp[i][0]: no stock, dp[i][1]: has stock, dp[i][2]: cooldown
  dp[0][1] = -prices[0];

  for (let i = 1; i < n; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][2]);
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
    dp[i][2] = dp[i - 1][1] + prices[i];
  }

  return Math.max(dp[n - 1][0], dp[n - 1][2]);
}
```

```java
// Time: O(n) | Space: O(n), can be optimized to O(1)
public int maxProfit(int[] prices) {
    if (prices.length == 0) return 0;

    int n = prices.length;
    int[][] dp = new int[n][3];
    // dp[i][0]: no stock, dp[i][1]: has stock, dp[i][2]: cooldown
    dp[0][1] = -prices[0];

    for (int i = 1; i < n; i++) {
        dp[i][0] = Math.max(dp[i-1][0], dp[i-1][2]);
        dp[i][1] = Math.max(dp[i-1][1], dp[i-1][0] - prices[i]);
        dp[i][2] = dp[i-1][1] + prices[i];
    }

    return Math.max(dp[n-1][0], dp[n-1][2]);
}
```

</div>

## How Uber Tests Dynamic Programming vs Other Companies

At companies like Google or Meta, a DP problem might be a clever, self-contained puzzle (e.g., "Dungeon Game"). At Amazon, it might be tied to system design (e.g., caching strategies). At Uber, the DP problem is almost always a **simplified model of a logistics or marketplace optimization**.

The difficulty is "Medium" on LeetCode, but the trick is the **context switching**. The interviewer will describe a scenario involving drivers, trips, or maps. Your first job is to strip away the narrative and identify the underlying DP pattern. They are testing if you can listen to a product manager's description of a feature and immediately start modeling it computationally. The follow-up questions often involve space optimization ("Can you do it with O(1) extra space?") or a slight constraint change ("What if the driver can also move left?"), testing your grasp of the DP table's structure.

## Study Order

Don't jump into Uber's hardest tagged problems. Build your foundation sequentially:

1.  **1D DP (Fibonacci-style):** Understand the core concept of state, recurrence, and memoization. Problems: Climbing Stairs (#70), House Robber (#198).
2.  **2D Grid DP:** Learn to navigate a table. This is the most direct analog to map/grid problems. Problems: Unique Paths (#62), Minimum Path Sum (#64).
3.  **DP on Strings:** Master comparing and building strings. This is critical for any data matching logic. Problems: Longest Common Subsequence (#1143), Edit Distance (#72).
4.  **Knapsack-style DP (0/1 and Unbounded):** Learn to handle resource constraints (time, capacity, number of assignments). Problems: Coin Change (#322), Partition Equal Subset Sum (#416).
5.  **DP with State/Multi-dimensional DP:** Add complexity by tracking an additional state (e.g., holding a resource, being in a mode). Problems: Best Time to Buy and Sell Stock with Cooldown (#309), Paint House (#256).

This order works because each step introduces one major new conceptual layer on top of a solidifying foundation.

## Recommended Practice Order

Tackle these problems in sequence. Each one teaches a pattern you will likely see at Uber.

1.  **Climbing Stairs (#70)** - The absolute basics.
2.  **Coin Change (#322)** - Classic unbounded knapsack (minimum coins).
3.  **Unique Paths II (#63)** - 2D grid with obstacles.
4.  **Longest Common Subsequence (#1143)** - Foundational string DP.
5.  **Partition Equal Subset Sum (#416)** - 0/1 knapsack recognition.
6.  **Best Time to Buy and Sell Stock with Cooldown (#309)** - DP with state.
7.  **Minimum Difficulty of a Job Schedule (#1335)** - Interval partitioning DP.
8.  **Edit Distance (#72)** - A harder, but very common, string DP finale.

Mastering this progression will make you fluent in the language of Uber's dynamic programming interviews.

[Practice Dynamic Programming at Uber](/company/uber/dynamic-programming)
