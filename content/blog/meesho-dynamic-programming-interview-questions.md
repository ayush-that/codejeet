---
title: "Dynamic Programming Questions at Meesho: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-11-19"
category: "dsa-patterns"
tags: ["meesho", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Meesho isn't just another topic on a checklist; it's a critical filter. With 12 out of their 44 tagged problems being DP, that's over 27% of their technical question bank. In a company built on optimizing a massive, complex supply chain and logistics network—connecting suppliers, resellers, and customers across India—the ability to model and solve optimization problems is paramount. DP is the algorithmic embodiment of breaking down a large, daunting problem (like minimizing delivery costs or maximizing inventory efficiency) into manageable, overlapping subproblems. In real interviews, you can expect at least one medium-to-hard DP question in the technical rounds for software engineering roles, especially those backend-focused. It's not a "nice to have"; it's a core focus area used to assess your problem decomposition skills and computational thinking.

## Specific Patterns Meesho Favors

Meesho's DP problems tend to cluster around practical optimization scenarios, often avoiding overly abstract or purely mathematical puzzles. You'll see a heavy emphasis on **"Take or Skip" decision-making patterns**, which model real-world choices like including an item in a shipment or skipping a costly operation.

The two most prevalent patterns are:

1.  **0/1 Knapsack and its variants:** This is the undisputed king. The classic problem—"Given a set of items with weights and values, determine the maximum value you can carry in a knapsack of capacity W"—directly mirrors inventory selection, resource allocation, and budget-constrained feature development. Meesho often uses variations like **Partition Equal Subset Sum (LeetCode #416)** or **Target Sum (LeetCode #494)**, which are essentially knapsack problems in disguise.
2.  **String/Sequence Alignment and Comparison:** Problems like **Edit Distance (LeetCode #72)** or **Longest Common Subsequence (LeetCode #1143)** are highly relevant. They model the comparison of product descriptions, user search queries, or catalog entries—common tasks in e-commerce platforms for search, recommendations, and data deduplication.

You will primarily be expected to implement **iterative, bottom-up DP** using a 1D or 2D array. While understanding the recursive top-down memoization approach is crucial for problem-solving, the final, optimized solution in an interview should usually be the iterative version for its better space complexity and avoidance of recursion overhead.

## How to Prepare

Don't just memorize solutions. Internalize the framework: 1) Define the DP state (`dp[i]` or `dp[i][j]` means what?), 2) Define the recurrence relation (how does state `i` relate to states `i-1`, `i-2`, etc.?), 3) Define base cases, 4) Determine the iteration order, and 5) Extract the answer.

Let's look at the most common pattern: the 0/1 Knapsack. The core decision is: for the `i-th` item and remaining capacity `c`, do we take it or skip it?

<div class="code-group">

```python
def knapsack_01(values, weights, capacity):
    """
    Classic 0/1 Knapsack - Bottom-up DP.
    dp[c] = max value achievable with capacity `c`.
    """
    n = len(values)
    # dp array for capacities 0..capacity
    dp = [0] * (capacity + 1)

    # Iterate through each item
    for i in range(n):
        # Iterate capacities backwards to ensure each item is used at most once
        for c in range(capacity, weights[i] - 1, -1):
            # Decision: skip item (dp[c]) or take it (dp[c - weight[i]] + value[i])
            dp[c] = max(dp[c], dp[c - weights[i]] + values[i])
    return dp[capacity]
# Time: O(n * capacity) | Space: O(capacity)
```

```javascript
function knapsack01(values, weights, capacity) {
  const n = values.length;
  const dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < n; i++) {
    // Traverse backwards to prevent reusing the same item
    for (let c = capacity; c >= weights[i]; c--) {
      dp[c] = Math.max(dp[c], dp[c - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}
// Time: O(n * capacity) | Space: O(capacity)
```

```java
public int knapsack01(int[] values, int[] weights, int capacity) {
    int n = values.length;
    int[] dp = new int[capacity + 1];

    for (int i = 0; i < n; i++) {
        // Reverse iteration is key for 0/1 Knapsack
        for (int c = capacity; c >= weights[i]; c--) {
            dp[c] = Math.max(dp[c], dp[c - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}
// Time: O(n * capacity) | Space: O(capacity)
```

</div>

Now, see how this pattern applies to a Meesho-favored variant, **Partition Equal Subset Sum (LeetCode #416)**. The problem: can the array be partitioned into two subsets with equal sum? This is a knapsack where our target capacity is `total_sum / 2`, each item's weight equals its value (the number itself), and we ask: "Can we exactly fill this capacity?"

<div class="code-group">

```python
def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2

    # dp[c] = True if sum `c` is achievable
    dp = [False] * (target + 1)
    dp[0] = True  # Base case: sum of 0 is always achievable

    for num in nums:
        # Iterate backwards to prevent reuse
        for c in range(target, num - 1, -1):
            if dp[c - num]:  # If we can achieve sum (c - num), we can achieve sum c by adding num
                dp[c] = True
    return dp[target]
# Time: O(n * target) | Space: O(target)
```

```javascript
function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;

  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let c = target; c >= num; c--) {
      if (dp[c - num]) {
        dp[c] = true;
      }
    }
  }
  return dp[target];
}
// Time: O(n * target) | Space: O(target)
```

```java
public boolean canPartition(int[] nums) {
    int total = 0;
    for (int num : nums) total += num;
    if (total % 2 != 0) return false;
    int target = total / 2;

    boolean[] dp = new boolean[target + 1];
    dp[0] = true;

    for (int num : nums) {
        for (int c = target; c >= num; c--) {
            if (dp[c - num]) {
                dp[c] = true;
            }
        }
    }
    return dp[target];
}
// Time: O(n * target) | Space: O(target)
```

</div>

## How Meesho Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, Meesho's DP questions are less about clever "aha!" tricks (like some of the more obscure combinatorial DP problems) and more about **applied optimization**. At Google or Meta, you might get a DP problem wrapped in a complex story about alien languages or social network paths. At Meesho, the narrative is often closer to home: "select products for a flash sale under a budget constraint" or "find the minimum edits to correct a product SKU."

The difficulty is consistently in the **medium to medium-hard range**. You're unlikely to see a "Hard" labeled DP problem that requires a 3D state or extremely non-intuitive transitions. The test is on your mastery of the fundamental patterns and your ability to adapt them to a slightly new context. The interviewer will probe your thought process deeply, expecting you to arrive at the subproblem definition and recurrence relation through logical discussion, not just regurgitation.

## Study Order

Tackle DP in this logical progression to build a solid foundation:

1.  **Start with 1D Linear DP:** Problems like **Climbing Stairs (LeetCode #70)** and **House Robber (LeetCode #198)**. They teach the core concept of state (`dp[i]`) and simple recurrence (`dp[i] = dp[i-1] + dp[i-2]`).
2.  **Master the 0/1 Knapsack Framework:** Learn the classic version, then immediately practice its variants: **Partition Equal Subset Sum (#416)**, **Target Sum (#494)**, and **Coin Change (#322)** (though Coin Change is "unbounded," contrasting it with 0/1 is instructive). This builds pattern recognition for "take or skip" decisions.
3.  **Move to 2D DP for Sequences:** Tackle **Longest Common Subsequence (#1143)** and **Edit Distance (#72)**. These introduce a 2D state (`dp[i][j]`) for comparing two sequences, a very common e-commerce pattern.
4.  **Learn Kadane's Algorithm for Maximum Subarray (#53):** While often classified under "Array," it's a quintessential DP concept (optimal substructure) and is incredibly common.
5.  **Finally, Explore Matrix/Grid DP:** Problems like **Unique Paths (#62)** or **Minimum Path Sum (#64)**. These solidify your understanding of 2D state spaces derived from a grid, which can model logistics paths.

## Recommended Practice Order

Solve these Meesho-relevant problems in sequence:

1.  Climbing Stairs (#70) - Warm-up
2.  House Robber (#198) - 1D DP with a simple decision.
3.  0/1 Knapsack (GeeksforGeeks/Conceptual) - Understand the core.
4.  Partition Equal Subset Sum (#416) - First major variant.
5.  Target Sum (#494) - A more challenging knapsack variant.
6.  Coin Change (#322) - Contrast with 0/1 (unbounded vs bounded).
7.  Longest Common Subsequence (#1143) - Intro to 2D sequence DP.
8.  Edit Distance (#72) - A must-know, highly applicable problem.
9.  Maximum Subarray (#53) - Kadane's Algorithm.
10. Minimum Path Sum (#64) - 2D grid DP.

This path takes you from the simplest state definition to the patterns most relevant to Meesho's domain. Remember, the goal is not to solve hundreds of problems, but to solve a few dozen _thoughtfully_, understanding how each builds upon or varies a core pattern.

[Practice Dynamic Programming at Meesho](/company/meesho/dynamic-programming)
