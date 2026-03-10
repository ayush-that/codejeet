---
title: "Dynamic Programming Questions at Wix: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Wix — patterns, difficulty breakdown, and study tips."
date: "2029-05-17"
category: "dsa-patterns"
tags: ["wix", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Wix isn't just another algorithm topic to check off—it's a deliberate filter. With 8 out of their 56 tagged problems being DP, that's roughly 14% of their technical question bank. In practice, this means you have a **1 in 7 chance** of encountering a DP problem in a Wix coding round, a significantly higher probability than at many generalist SaaS companies. Why? Wix builds a complex, stateful visual editor and a globally distributed website platform. Their systems constantly make optimal decisions under constraints—rendering component trees, bundling assets, scheduling background jobs—which mirrors the core DP paradigm: solving overlapping subproblems with optimal substructure. They use these questions to see if you can move from a brute-force mindset to one that efficiently caches state.

## Specific Patterns Wix Favors

Wix's DP questions tend to cluster around two practical, non-abstract domains: **string/sequence manipulation** and **constrained optimization**. You won't often see esoteric graph DP or highly mathematical number theory problems. Instead, they favor problems where the state transition has a clear, almost business-logic-like interpretation.

The dominant pattern is the **1D or 2D "dp array" for sequence alignment or "take-or-skip" decisions**. Think "Edit Distance" or "Knapsack" style reasoning applied to real-world scenarios. For example, a classic Wix-styled problem might involve transforming one user configuration state to another with minimal operations (an Edit Distance variant) or allocating server resources to tasks (a Knapsack variant).

They strongly prefer **iterative, bottom-up tabulation** solutions over top-down memoization. This is a critical insight. In an interview, a recursive memoization solution might be accepted, but the optimal candidate demonstrates they can build the DP table from the ground up. This shows a deeper understanding of state dependencies and often leads to more efficient space optimization.

Specific LeetCode patterns that map directly:

- **Longest Common Subsequence (#1143)** and **Edit Distance (#72)**: The quintessential 2D string DP. Master this transition: `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + cost`.
- **0/1 Knapsack (LC #416 Partition Equal Subset Sum is a variant)**: The "take-or-skip" decision with a capacity constraint.
- **Climbing Stairs (#70) & House Robber (#198)**: The foundation for 1D linear DP. Wix might dress this up as "counting ways to arrange components" or "selecting non-adjacent features for performance."

## How to Prepare

Your study must shift from "recognizing DP" to "instantly deriving the state definition and transition." Start every problem by forcing yourself to answer, out loud:

1.  What is the **state** I need to track? (e.g., `(index, remainingCapacity)`)
2.  What is the **base case**? (e.g., no more items, or empty strings)
3.  What are the **choices** I have at each state? (e.g., take character `i`, skip it, replace it)
4.  How does the **current state** relate to **previous states**? (The recurrence relation)

Let's solidify the most common pattern: 2D DP for two sequences. Here's the skeleton for an LCS/Edit Distance style problem.

<div class="code-group">

```python
def solveTwoSequenceDP(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    # dp[i][j] will represent the answer for s1[:i] and s2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Initialize base cases (often first row and column)
    for i in range(m + 1):
        dp[i][0] = i  # cost to transform s1[:i] to empty string
    for j in range(n + 1):
        dp[0][j] = j  # cost to transform empty string to s2[:j]

    # Fill the table iteratively
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                # Characters match, no extra cost
                dp[i][j] = dp[i-1][j-1]
            else:
                # Characters differ. Consider all operations.
                # Insert into s1, Delete from s1, Replace character
                dp[i][j] = 1 + min(
                    dp[i][j-1],   # Insert (consume s2 char)
                    dp[i-1][j],   # Delete (consume s1 char)
                    dp[i-1][j-1]  # Replace
                )
    return dp[m][n]

# Time: O(m * n) | Space: O(m * n) (can be optimized to O(min(m, n)))
```

```javascript
function solveTwoSequenceDP(s1, s2) {
  const m = s1.length,
    n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i][j - 1], // Insert
            dp[i - 1][j], // Delete
            dp[i - 1][j - 1] // Replace
          );
      }
    }
  }
  return dp[m][n];
}
// Time: O(m * n) | Space: O(m * n)
```

```java
public int solveTwoSequenceDP(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i][j - 1],
                    Math.min(dp[i - 1][j], dp[i - 1][j - 1])
                );
            }
        }
    }
    return dp[m][n];
}
// Time: O(m * n) | Space: O(m * n)
```

</div>

The next critical skill is **space optimization**. Wix engineers value performance. If your DP table only relies on the previous row (common in 1D sequence problems), you must demonstrate you can reduce space complexity.

<div class="code-group">

```python
def houseRobberSpaceOptimized(nums):
    """House Robber (#198) - Space Optimized."""
    if not nums:
        return 0
    # We only need to remember the last two states
    prev2, prev1 = 0, nums[0]  # dp[i-2], dp[i-1]

    for i in range(1, len(nums)):
        # At house i: rob it (nums[i] + prev2) or skip it (prev1)
        current = max(nums[i] + prev2, prev1)
        prev2, prev1 = prev1, current  # slide the window forward
    return prev1

# Time: O(n) | Space: O(1)
```

```javascript
function houseRobberSpaceOptimized(nums) {
  if (nums.length === 0) return 0;
  let prev2 = 0; // dp[i-2]
  let prev1 = nums[0]; // dp[i-1]

  for (let i = 1; i < nums.length; i++) {
    const current = Math.max(nums[i] + prev2, prev1);
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}
// Time: O(n) | Space: O(1)
```

```java
public int houseRobberSpaceOptimized(int[] nums) {
    if (nums.length == 0) return 0;
    int prev2 = 0; // dp[i-2]
    int prev1 = nums[0]; // dp[i-1]

    for (int i = 1; i < nums.length; i++) {
        int current = Math.max(nums[i] + prev2, prev1);
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}
// Time: O(n) | Space: O(1)
```

</div>

## How Wix Tests Dynamic Programming vs Other Companies

At FAANG companies (Meta, Google), DP problems are often levers in a larger system design discussion or are abstracted behind a complex problem statement. At Wix, the DP problem is usually the **main event** of the 45-minute coding round. It will be presented in a more stripped-down, LeetCode-style format, but with a subtle twist that relates to web development: think "minimum edits to match a template," "optimal caching of asset bundles," or "scheduling conflicting user events."

The difficulty is consistently in the **medium to medium-hard** range. You are very unlikely to get a "hard" DP like "Regular Expression Matching" in a first-round interview. The expectation is clean, bug-free, optimally-space-iterative code within 25 minutes, leaving ample time for discussion on edge cases and potential follow-ups (e.g., "what if the input stream was infinite?").

## Study Order

Do not jump into Wix's problem list immediately. Build your DP intuition in this deliberate order:

1.  **Foundation & Fibonacci Logic:** Start with **Climbing Stairs (#70)**. This ingrains the concept of a state (`dp[i]`) and a recurrence (`dp[i] = dp[i-1] + dp[i-2]`). It's simple enough to focus on the pattern.
2.  **1D Linear "Take-or-Skip":** Move to **House Robber (#198)**. This introduces the core DP decision: at state `i`, you have a choice that affects future states. This is the gateway to the Knapsack pattern.
3.  **Constrained 1D DP (Knapsack Core):** Solve **Partition Equal Subset Sum (#416)**. This forces you to add a second dimension to your state (`dp[i][sum]`) to handle a constraint. Master the "include/exclude" transition.
4.  **2D DP for Two Sequences:** Now tackle **Longest Common Subsequence (#1143)**. This is where the classic 2D table becomes essential. Practice drawing the table on paper.
5.  **2D DP with Cost/Operations:** Advance to **Edit Distance (#72)**. This adds the nuance of different costs for different operations, making the recurrence relation slightly more complex.
6.  **Practice Space Optimization:** Re-solve House Robber and LCS/Edit Distance, but this time, derive the space-optimized version. This step is non-negotiable for Wix prep.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the last.

1.  **Climbing Stairs (#70)** - Pure foundation.
2.  **House Robber (#198)** - 1D choices.
3.  **House Robber II (#213)** - Adds a circular constraint, testing your ability to adapt the state.
4.  **Partition Equal Subset Sum (#416)** - Introduction to the "subset sum" / 0/1 Knapsack pattern.
5.  **Longest Common Subsequence (#1143)** - Master the 2D table for sequences.
6.  **Edit Distance (#72)** - Add operation costs.
7.  **Coin Change (#322)** - Unbounded Knapsack variant (can reuse items). Expands your pattern recognition.
8.  **Wix-specific practice:** Now you're ready to tackle the problems tagged to Wix. Look for ones involving strings, partitioning, and cost minimization.

This progression systematically builds the mental machinery you need. When you see a new Wix DP problem, you won't panic—you'll categorize it ("Ah, this is a constrained 1D optimization with a twist") and begin defining your state and transition.

[Practice Dynamic Programming at Wix](/company/wix/dynamic-programming)
