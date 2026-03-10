---
title: "Dynamic Programming Questions at Deloitte: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Deloitte — patterns, difficulty breakdown, and study tips."
date: "2030-03-21"
category: "dsa-patterns"
tags: ["deloitte", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Deloitte isn't about testing you on obscure, competitive programming-level algorithms. Their 7 DP questions out of 38 total signals a deliberate, but measured, focus. It's a core screening mechanism for a specific reason: DP problems elegantly separate candidates who can only write code from those who can decompose complex problems, recognize overlapping subproblems, and build efficient, optimal solutions from the ground up. This mirrors the consulting work—you're often optimizing resources, timelines, or financial outcomes under constraints. In real interviews, you might see one DP question per technical round, but it's frequently the deciding problem that pushes a candidate from a "hire" to a "strong hire."

## Specific Patterns Deloitte Favors

Deloitte's DP questions tend to avoid the most abstract graph theory problems (like DP on trees or advanced state compression) and instead favor **classic, one-dimensional and two-dimensional iterative DP** with clear real-world analogs. They heavily test:

1.  **The "Classic Knapsack" Family:** Problems about optimal selection under a capacity constraint. This includes pure 0/1 Knapsack, but more often appears as Partition Equal Subset Sum (LeetCode #416) or Target Sum (LeetCode #494). These test your ability to model a constraint as a "capacity" and your items as "weights" and "values."
2.  **String/Sequence Alignment & Comparison:** Longest Common Subsequence (LeetCode #1143) is a quintessential Deloitte DP problem. It's a perfect test of building a 2D DP table where `dp[i][j]` has an intuitive meaning based on prefixes. Edit Distance (LeetCode #72) is another favorite for similar reasons.
3.  **"Count the Ways" Problems:** These ask for the number of distinct ways to achieve something, like climbing stairs (LeetCode #70) or decoding a message (LeetCode #91). Deloitte likes these because the transition from a brute-force recursive solution to a memoized one to a tabulated one is a clear, teachable progression that interviewers can follow.

You will rarely see purely recursive DP solutions without an iterative optimization path. The expectation is to arrive at a bottom-up, tabulation approach, often with space optimization.

## How to Prepare

The key is to master the transition from the brute-force idea to the optimized DP table. Let's take **Partition Equal Subset Sum (LeetCode #416)** as a study model. The problem: Given a non-empty array `nums`, can you partition it into two subsets with equal sums?

**Step 1: Identify the subproblem.** If total sum is `S`, we need to find a subset with sum `S/2`. This becomes a "subset sum" problem, a variant of 0/1 Knapsack where our capacity is `S/2`, each number's weight and value are equal (`nums[i]`), and we must achieve _exact_ capacity.

**Step 2: Define the DP state.** `dp[i][c]` will represent: can we form sum `c` using the first `i` elements (considering elements 0 through `i-1`)? A boolean state is common for "feasibility" problems.

**Step 3: Derive the transition.** For each element `nums[i-1]` and capacity `c`:

- If we don't take it: `dp[i][c] = dp[i-1][c]`
- If we take it (only if `c >= nums[i-1]`): `dp[i][c] = dp[i-1][c - nums[i-1]]`
  The result is the OR (`||`) of these two possibilities.

Here is the iterative, space-optimized solution. Notice we compress the 2D `dp` to a 1D array and iterate the capacity backwards to avoid overwriting states needed for the current `i`.

<div class="code-group">

```python
# LeetCode 416. Partition Equal Subset Sum
# Time: O(n * target) | Space: O(target)
def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2

    # dp[c] = can we form sum 'c' with the elements processed so far?
    dp = [False] * (target + 1)
    dp[0] = True  # Base case: sum 0 is always achievable

    for num in nums:
        # Iterate backwards to prevent re-using the same element
        for c in range(target, num - 1, -1):
            if dp[c - num]:  # If we can achieve sum (c - num) without this element
                dp[c] = True  # Then we can achieve sum c by including this element
    return dp[target]
```

```javascript
// LeetCode 416. Partition Equal Subset Sum
// Time: O(n * target) | Space: O(target)
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
```

```java
// LeetCode 416. Partition Equal Subset Sum
// Time: O(n * target) | Space: O(target)
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
```

</div>

## How Deloitte Tests Dynamic Programming vs Other Companies

At major tech companies (FAANG), DP problems can be highly algorithmic, sometimes combining DP with other paradigms (e.g., DP on graphs, bitmask DP). The focus is on raw algorithmic ingenuity and optimality. At Deloitte, the DP problems are more "textbook." The difficulty isn't in inventing a novel state definition; it's in cleanly applying a known pattern to a slightly novel constraint and communicating your thought process.

What's unique is the **emphasis on the business logic translation**. An interviewer might frame a problem as: "A client has a list of project costs and wants to know if they can split them into two portfolios of equal value." They want to see you connect the abstract "subset sum" to the business problem. The code must be correct, but explaining _why_ the DP state works in the context of the story is equally important. It's a consulting skill test disguised as a coding test.

## Study Order

Do not jump into hard DP. Build intuition sequentially.

1.  **Foundation: Fibonacci & Climbing Stairs (LeetCode #70).** Understand memoization vs. tabulation. This is where you learn that `dp[i]` represents the answer for the first `i` steps.
2.  **1D "Count Ways" Problems:** Coin Change II (LeetCode #518 - number of combinations) and Decode Ways (LeetCode #91). These solidify the idea of building up an array where each cell aggregates results from previous states.
3.  **The 0/1 Knapsack Core:** Start with the classic 0/1 Knapsack problem on educational platforms, then move to Partition Equal Subset Sum (LeetCode #416) and Target Sum (LeetCode #494). This is the most critical pattern for Deloitte.
4.  **2D Sequence DP:** Longest Common Subsequence (LeetCode #1143) and Edit Distance (LeetCode #72). Practice drawing the 2D table and verbally walking through how `dp[i][j]` is derived from `dp[i-1][j]`, `dp[i][j-1]`, and `dp[i-1][j-1]`.
5.  **(Optional) Kadane's Algorithm & Maximum Subarray (LeetCode #53).** While often categorized separately, it's a form of DP and appears frequently.

## Recommended Practice Order

Solve these problems in this sequence to build the skills Deloitte tests:

1.  Climbing Stairs (LeetCode #70) - Warm-up
2.  Coin Change (LeetCode #322) - Min coins (unbounded knapsack)
3.  Coin Change II (LeetCode #518) - Number of combinations
4.  Partition Equal Subset Sum (LeetCode #416) - Core Deloitte pattern
5.  Target Sum (LeetCode #494) - A twist on #416
6.  Longest Common Subsequence (LeetCode #1143) - Core 2D DP
7.  Edit Distance (LeetCode #72) - Slightly more complex 2D transitions

This path takes you from one-dimensional counting, through the essential knapsack model, to two-dimensional sequence analysis. If you can solve and clearly explain problems #4, #6, and #7, you are in excellent shape for a Deloitte technical interview.

[Practice Dynamic Programming at Deloitte](/company/deloitte/dynamic-programming)
