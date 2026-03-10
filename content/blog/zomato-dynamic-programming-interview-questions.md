---
title: "Dynamic Programming Questions at Zomato: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-08"
category: "dsa-patterns"
tags: ["zomato", "dynamic-programming", "interview prep"]
---

Dynamic Programming (DP) is a notorious topic in coding interviews, often acting as a gatekeeper for senior roles. At Zomato, with its complex logistics involving delivery routing, restaurant recommendations, and inventory management, DP isn't just an academic exercise—it's a practical tool for optimizing real-world systems. While only 3 out of 29 tagged problems on their LeetCode company list are explicitly DP, this low count is deceptive. In live interviews, DP concepts frequently surface within problems about optimal pathfinding, resource allocation, and sequence analysis, which are core to Zomato's operations. It's a secondary topic in terms of volume but a primary topic in terms of signaling your problem-solving depth. Acing a DP question here demonstrates you can think about efficiency and state management at the scale required to serve millions of orders.

## Specific Patterns Zomato Favors

Zomato's DP questions tend to be applied, often disguised as string manipulation or array problems with an optimization twist. They heavily favor **iterative (bottom-up) DP** over recursive memoization, as it aligns better with scalable, systems-level thinking. The two most common patterns are:

1.  **1D/2D "Take or Skip" Decisions (Classic KnapSack):** This is the workhorse. Problems involve making optimal choices with constraints, like allocating delivery slots, bundling menu items for a promotion, or optimizing cache usage. The state typically represents a capacity (time, budget, weight) and the value represents an optimization goal (max profit, min cost).
2.  **String/Sequence Alignment & Comparison:** Given Zomato's work with menu data, user queries, and location strings, problems involving edit distance, longest common subsequence, or matching patterns are highly relevant. These test your ability to handle two-dimensional state spaces derived from two input sequences.

You are very unlikely to see highly abstract graph theory DP (like Floyd-Warshall) or exotic state compression problems. The focus is on foundational, business-applicable patterns.

## How to Prepare

The key is to internalize the framework, not just memorize problems. For any DP problem, you must define:

1.  The `dp` array/table and what its indices represent (the _state_).
2.  The base case(s) that seed the solution.
3.  The recurrence relation that builds larger states from smaller ones.
4.  The final answer's location in the `dp` structure.

Let's look at the quintessential "Take or Skip" pattern, as seen in **0/1 Knapsack** and problems like **Partition Equal Subset Sum (LeetCode #416)**.

<div class="code-group">

```python
# LeetCode #416: Partition Equal Subset Sum
# Time: O(n * target) | Space: O(target) - Optimized 1D DP
def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2

    # dp[j] will be True if a subset with sum 'j' can be formed.
    # We only need to track up to 'target'.
    dp = [False] * (target + 1)
    dp[0] = True  # Base case: sum of 0 is always achievable (empty subset)

    for num in nums:
        # Traverse backwards to avoid re-using the same num (0/1 property)
        for curr_sum in range(target, num - 1, -1):
            # Recurrence: Can we achieve 'curr_sum' by:
            # 1. Not taking 'num' (dp[curr_sum] is already True), OR
            # 2. Taking 'num' AND achieving 'curr_sum - num' with previous items.
            dp[curr_sum] = dp[curr_sum] or dp[curr_sum - num]
    return dp[target]
```

```javascript
// LeetCode #416: Partition Equal Subset Sum
// Time: O(n * target) | Space: O(target) - Optimized 1D DP
function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;

  // dp[j] = true if sum 'j' is achievable.
  const dp = new Array(target + 1).fill(false);
  dp[0] = true; // Base case

  for (const num of nums) {
    // Iterate backwards to ensure each number is used at most once.
    for (let currSum = target; currSum >= num; currSum--) {
      // Recurrence: dp[currSum] = dp[currSum] || dp[currSum - num]
      dp[currSum] = dp[currSum] || dp[currSum - num];
    }
  }
  return dp[target];
}
```

```java
// LeetCode #416: Partition Equal Subset Sum
// Time: O(n * target) | Space: O(target) - Optimized 1D DP
public boolean canPartition(int[] nums) {
    int total = 0;
    for (int num : nums) total += num;
    if (total % 2 != 0) return false;
    int target = total / 2;

    // dp[j] = true if sum 'j' is achievable.
    boolean[] dp = new boolean[target + 1];
    dp[0] = true; // Base case

    for (int num : nums) {
        // Traverse backwards for the 0/1 knapsack property.
        for (int currSum = target; currSum >= num; currSum--) {
            // Recurrence: dp[currSum] = dp[currSum] || dp[currSum - num]
            dp[currSum] = dp[currSum] || dp[currSum - num];
        }
    }
    return dp[target];
}
```

</div>

For string-based DP, the pattern involves a 2D table. Let's examine **Edit Distance (LeetCode #72)**, a classic for comparing strings (e.g., correcting search queries).

<div class="code-group">

```python
# LeetCode #72: Edit Distance
# Time: O(m * n) | Space: O(m * n)
def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    # dp[i][j] = min ops to convert word1[:i] to word2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases: converting to/from empty string
    for i in range(m + 1):
        dp[i][0] = i  # delete all chars from word1
    for j in range(n + 1):
        dp[0][j] = j  # insert all chars into word1

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                # Characters match, no new operation needed.
                dp[i][j] = dp[i - 1][j - 1]
            else:
                # Recurrence: min of insert, delete, or replace.
                dp[i][j] = 1 + min(
                    dp[i][j - 1],    # Insert into word1
                    dp[i - 1][j],    # Delete from word1
                    dp[i - 1][j - 1] # Replace char in word1
                )
    return dp[m][n]
```

```javascript
// LeetCode #72: Edit Distance
// Time: O(m * n) | Space: O(m * n)
function minDistance(word1, word2) {
  const m = word1.length,
    n = word2.length;
  // dp[i][j] = min ops to convert word1[0..i-1] to word2[0..j-1]
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

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
            dp[i][j - 1], // Insert
            dp[i - 1][j], // Delete
            dp[i - 1][j - 1] // Replace
          );
      }
    }
  }
  return dp[m][n];
}
```

```java
// LeetCode #72: Edit Distance
// Time: O(m * n) | Space: O(m * n)
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    // dp[i][j] = min ops to convert word1[0..i-1] to word2[0..j-1]
    int[][] dp = new int[m + 1][n + 1];

    // Base cases
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i][j - 1],      // Insert
                    Math.min(
                        dp[i - 1][j],      // Delete
                        dp[i - 1][j - 1]   // Replace
                    )
                );
            }
        }
    }
    return dp[m][n];
}
```

</div>

## How Zomato Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, Zomato's DP questions are less about algorithmic cleverness and more about **applied modeling**. At Google or Meta, you might get a DP problem with a non-obvious state definition (e.g., "Dungeon Game" #174). At Zomato, the state is usually more directly derived from the problem statement—like a budget, a time window, or two strings. The difficulty often lies in correctly identifying the problem as DP amidst narrative about delivery routes or menu planning, and then cleanly implementing the iterative solution.

The expectation is also different. While a FAANG interview might accept a recursive+memo solution as a first step, Zomato interviewers will likely push you towards the space-optimized iterative version, probing your understanding of the underlying array transitions. They care about the _engineering_ of the solution—its efficiency and clarity—as much as the correctness.

## Study Order

Tackle DP in this logical progression to build a solid mental model:

1.  **Fibonacci & Climbing Stairs (LeetCode #70):** Understand the core idea of overlapping subproblems and memoization. This is your "Hello World."
2.  **1D Linear DP:** Problems like **House Robber (LeetCode #198)**. Learn to define `dp[i]` based on previous 1-2 states.
3.  **Classic 0/1 Knapsack:** Master the "take or skip" decision. Start with the standard problem, then move to **Partition Equal Subset Sum (#416)** and **Target Sum (#494)**. This is the single most important pattern for Zomato.
4.  **Unbounded Knapsack:** Problems like **Coin Change (LeetCode #322)**. Learn how the iteration order changes when you can reuse items.
5.  **2D String DP:** Practice **Longest Common Subsequence (#1143)** and **Edit Distance (#72)**. Get comfortable building a table from two sequences.
6.  **2D Grid DP:** Problems like **Unique Paths (#62)** and **Minimum Path Sum (#64)**. This combines linear and 2D state thinking.
7.  **(Optional) Interval/State DP:** If you have time, look at **House Robber II (#213)** or **Best Time to Buy/Sell Stock with Cooldown (#309)** to see more complex state machines.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous concept.

1.  **Climbing Stairs (#70)** - Pure introduction.
2.  **House Robber (#198)** - 1D linear decisions.
3.  **0/1 Knapsack** (GeeksforGeeks/Fundamental) - Learn the core pattern.
4.  **Partition Equal Subset Sum (#416)** - Apply knapsack to a partition problem.
5.  **Coin Change (#322)** - Unbounded knapsack variation.
6.  **Longest Common Subsequence (#1143)** - Introduction to 2D string DP.
7.  **Edit Distance (#72)** - More complex 2D string DP, highly relevant.
8.  **Unique Paths (#62)** - Simple 2D grid DP.
9.  **Minimum Path Sum (#64)** - 2D grid DP with optimization.
10. **Target Sum (#494)** - A challenging twist on the subset sum/knapsack pattern, excellent final test.

Remember, the goal is not to memorize these solutions but to recognize the family of problems each belongs to. When you see a Zomato problem about optimizing delivery routes within a fuel constraint, you should think: "This is a knapsack problem where the weight is fuel and the value is deliveries completed."

[Practice Dynamic Programming at Zomato](/company/zomato/dynamic-programming)
