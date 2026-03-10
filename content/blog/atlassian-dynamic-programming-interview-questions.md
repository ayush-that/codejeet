---
title: "Dynamic Programming Questions at Atlassian: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-16"
category: "dsa-patterns"
tags: ["atlassian", "dynamic-programming", "interview prep"]
---

## Why Dynamic Programming Matters at Atlassian

Atlassian's product suite—Jira, Confluence, Bitbucket, Trello—deals heavily with optimization problems. Whether it's scheduling automated workflows, calculating resource allocation for projects, or optimizing database queries for large-scale collaboration data, efficient algorithms are non-negotiable. This is why Dynamic Programming (DP) appears in roughly 15% of their technical interview questions (9 out of 62 cataloged problems).

However, here's the critical insight: Atlassian doesn't test DP as abstract puzzle-solving. They test it as _applied optimization_. You're less likely to get a purely mathematical DP problem and more likely to encounter a scenario that mirrors real backend or data pipeline challenges. For example, how would you minimize server costs while meeting SLA requirements? How would you optimize the rendering of a complex dashboard with cached components? DP provides the framework for these decisions.

In real interviews, DP questions typically appear in the second or third coding round, often as the "hard" problem in a set. They're used as a filter for senior candidates and for roles touching performance-critical systems. The good news? Atlassian's DP problems tend to be classical variations with clear real-world analogs, not obscure, never-seen-before creations.

## Specific Patterns Atlassian Favors

Atlassian's DP problems cluster around three practical patterns:

1. **String/Sequence Alignment & Transformation**: Think edit distance, regex matching, or sequence comparison. This directly relates to text processing in Confluence pages, code diffing in Bitbucket, or parsing JQL (Jira Query Language). Problems like **Edit Distance (#72)** and **Regular Expression Matching (#10)** are classic examples.

2. **Knapsack/Resource Allocation**: This is huge. Given limited compute resources, how do you maximize value? This could map to feature rollout scheduling, server capacity planning, or batch processing optimization. The **0/1 Knapsack** pattern and its variants appear frequently.

3. **Interval/State Optimization**: Problems where you make decisions over time or across states, like meeting room scheduling (similar to **Meeting Rooms II (#253)** but with DP constraints) or workflow state minimization. These test your ability to model real-world state machines efficiently.

Atlassian heavily favors **iterative, bottom-up DP** solutions. Why? They're more performant in practice (no recursion overhead), easier to parallelize, and map better to distributed systems thinking. You'll rarely see pure recursive DP without memoization as a final answer—it's considered a starting point, not a production-ready solution.

## How to Prepare

Master the iterative DP table approach. Let's examine the most common pattern: the 0/1 Knapsack. This pattern appears disguised in many Atlassian problems.

<div class="code-group">

```python
def knapsack(weights, values, capacity):
    """
    Classic 0/1 Knapsack DP solution.
    Returns maximum value achievable without exceeding capacity.
    """
    n = len(weights)
    # dp[i][w] = max value using first i items with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                # Option 1: Take item i-1
                take = values[i-1] + dp[i-1][w - weights[i-1]]
                # Option 2: Skip item i-1
                skip = dp[i-1][w]
                dp[i][w] = max(take, skip)
            else:
                # Item too heavy for current capacity w
                dp[i][w] = dp[i-1][w]

    return dp[n][capacity]

# Time: O(n * capacity) | Space: O(n * capacity)
# Space can be optimized to O(capacity) using 1D array
```

```javascript
function knapsack(weights, values, capacity) {
  const n = weights.length;
  // dp[i][w] = max value using first i items with capacity w
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        // Option 1: Take item i-1
        const take = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        // Option 2: Skip item i-1
        const skip = dp[i - 1][w];
        dp[i][w] = Math.max(take, skip);
      } else {
        // Item too heavy for current capacity w
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][capacity];
}

// Time: O(n * capacity) | Space: O(n * capacity)
// Space can be optimized to O(capacity) using 1D array
```

```java
public int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    // dp[i][w] = max value using first i items with capacity w
    int[][] dp = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= capacity; w++) {
            if (weights[i-1] <= w) {
                // Option 1: Take item i-1
                int take = values[i-1] + dp[i-1][w - weights[i-1]];
                // Option 2: Skip item i-1
                int skip = dp[i-1][w];
                dp[i][w] = Math.max(take, skip);
            } else {
                // Item too heavy for current capacity w
                dp[i][w] = dp[i-1][w];
            }
        }
    }

    return dp[n][capacity];
}

// Time: O(n * capacity) | Space: O(n * capacity)
// Space can be optimized to O(capacity) using 1D array
```

</div>

The key insight: Atlassian interviewers will expect you to _explain_ the space optimization to a 1D array. They care about practical memory usage. Practice both the 2D and 1D versions.

For string problems, the edit distance pattern is equally important:

<div class="code-group">

```python
def minDistance(word1, word2):
    """
    Edit Distance (LeetCode #72) - classic DP for string transformation.
    """
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all chars from word1
    for j in range(n + 1):
        dp[0][j] = j  # Insert all chars into word1

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # Characters match
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # Delete
                    dp[i][j-1],    # Insert
                    dp[i-1][j-1]   # Replace
                )

    return dp[m][n]

# Time: O(m * n) | Space: O(m * n)
# Space can be optimized to O(min(m, n))
```

```javascript
function minDistance(word1, word2) {
  const m = word1.length,
    n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // Delete
            dp[i][j - 1], // Insert
            dp[i - 1][j - 1] // Replace
          );
      }
    }
  }

  return dp[m][n];
}

// Time: O(m * n) | Space: O(m * n)
// Space can be optimized to O(min(m, n))
```

```java
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];

    // Base cases
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i-1) == word2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i-1][j],    // Delete
                    Math.min(
                        dp[i][j-1],    // Insert
                        dp[i-1][j-1]   // Replace
                    )
                );
            }
        }
    }

    return dp[m][n];
}

// Time: O(m * n) | Space: O(m * n)
// Space can be optimized to O(min(m, n))
```

</div>

## How Atlassian Tests Dynamic Programming vs Other Companies

Atlassian's DP questions differ from FAANG companies in three key ways:

1. **Less emphasis on trickery, more on application**: Google might give you a DP problem disguised as something else (e.g., "Dungeon Game" #174). Atlassian is more direct—they'll describe a business constraint optimization problem that clearly maps to a known DP pattern.

2. **They care about the "why"**: At Amazon, you might get away with just coding the solution. At Atlassian, expect follow-ups like: "How would this scale to 10,000 items?" or "What if capacity constraints change dynamically?" They're testing system design thinking alongside DP.

3. **Difficulty is consistent, not variable**: Unlike Facebook/Meta where DP difficulty spikes dramatically for E5+ roles, Atlassian maintains a consistent medium-to-hard level. Their hardest DP problems are comparable to LeetCode medium with a twist.

What's unique: Atlassian interviewers often provide _partial hints_ if you're stuck on the DP state definition. They're more collaborative—they want to see how you incorporate feedback, which mirrors their actual engineering culture.

## Study Order

1. **Start with Fibonacci & Climbing Stairs (#70)** - Understand overlapping subproblems and optimal substructure without complex state.
2. **0/1 Knapsack** - Learn the fundamental "take or skip" decision pattern. This builds intuition for resource allocation.
3. **Unbounded Knapsack & Coin Change (#322)** - Extend to problems where items can be reused. This is common in scheduling repeated tasks.
4. **Longest Common Subsequence (#1143)** - Master 2D DP for sequence comparison. This is foundational for string problems.
5. **Edit Distance (#72)** - Learn the three-operation pattern (insert, delete, replace) crucial for text processing.
6. **Matrix Chain Multiplication** - Understand interval/partition DP. Useful for optimizing nested operations.
7. **DP on Trees** - For roles touching dependency graphs or hierarchical data.

Why this order? Each step introduces exactly one new complexity dimension: from 1D to 2D DP, from single-use to reusable items, from arrays to strings to trees. This builds layered understanding rather than memorization.

## Recommended Practice Order

Solve these in sequence:

1. **Climbing Stairs (#70)** - Basic 1D DP
2. **Coin Change (#322)** - Unbounded knapsack variant
3. **0/1 Knapsack** (GeeksforGeeks) - Foundational pattern
4. **Target Sum (#494)** - Knapsack with a twist
5. **Longest Increasing Subsequence (#300)** - 1D DP with nested loop
6. **Longest Common Subsequence (#1143)** - 2D string DP
7. **Edit Distance (#72)** - Must-know for string manipulation
8. **Regular Expression Matching (#10)** - Hard but tests if you truly understand state transitions
9. **Burst Balloons (#312)** - Interval DP (advanced, for senior roles)

After these, tackle Atlassian's tagged DP problems. You'll notice they're variations of these classics with business context layered on top.

[Practice Dynamic Programming at Atlassian](/company/atlassian/dynamic-programming)
