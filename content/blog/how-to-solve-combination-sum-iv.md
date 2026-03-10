---
title: "How to Solve Combination Sum IV — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Combination Sum IV. Medium difficulty, 55.0% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-03-10"
category: "dsa-patterns"
tags: ["combination-sum-iv", "array", "dynamic-programming", "medium"]
---

# How to Solve Combination Sum IV

Given an array of distinct integers `nums` and a target integer `target`, we need to count all possible combinations (where order matters) that sum to the target. This problem is tricky because it looks like the classic "Combination Sum" problem, but here different sequences are counted as different combinations—making it essentially a permutation problem. The key insight is recognizing this as a dynamic programming problem where we build up solutions for smaller targets.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 2, 3]`, `target = 4`.

We want to find all sequences where the numbers sum to 4. Let's think recursively:

- If we start with 1, we need to find combinations that sum to 3 (4-1)
- If we start with 2, we need combinations that sum to 2 (4-2)
- If we start with 3, we need combinations that sum to 1 (4-3)

But notice: after taking 1, we could then take 2 (needing sum 1), or take 3 (needing sum 0), or take another 1 (needing sum 2). This creates a tree of possibilities.

Let's build from the bottom up:

- Target 0: There's exactly 1 way to make 0 (take nothing)
- Target 1: We can use [1] → 1 way
- Target 2:
  - Start with 1 → need target 1 → 1 way
  - Start with 2 → need target 0 → 1 way
  - Total: 2 ways ([1,1], [2])
- Target 3:
  - Start with 1 → need target 2 → 2 ways
  - Start with 2 → need target 1 → 1 way
  - Start with 3 → need target 0 → 1 way
  - Total: 4 ways ([1,1,1], [1,2], [2,1], [3])
- Target 4:
  - Start with 1 → need target 3 → 4 ways
  - Start with 2 → need target 2 → 2 ways
  - Start with 3 → need target 1 → 1 way
  - Total: 7 ways

So the answer is 7. This bottom-up approach reveals the recurrence relation: `dp[target] = sum(dp[target - num] for num in nums if target >= num)`.

## Brute Force Approach

A naive solution would use recursion to explore all possible sequences:

```python
def combinationSum4(nums, target):
    if target == 0:
        return 1
    if target < 0:
        return 0

    total = 0
    for num in nums:
        total += combinationSum4(nums, target - num)
    return total
```

This brute force approach has exponential time complexity O(n^target) in the worst case, where n is the number of elements in `nums`. Why? Because at each step, we branch into n possibilities, and the recursion depth can go up to `target` (if we keep subtracting 1). For example, with `nums = [1]` and `target = 20`, we'd have 20 recursive calls in a chain.

The problem with this approach is massive recomputation. Notice that when computing combinations for target 4, we need combinations for targets 3, 2, and 1. But when computing combinations for target 3, we also need combinations for target 2 and 1. We're computing the same subproblems over and over.

## Optimized Approach

The key insight is that this problem has **optimal substructure** and **overlapping subproblems**—the hallmarks of dynamic programming. Each larger target's solution depends on solutions to smaller targets.

We can use memoization (top-down DP) or tabulation (bottom-up DP):

1. **Memoization**: Store computed results for each target in a dictionary/array to avoid recomputation
2. **Tabulation**: Build an array `dp` where `dp[i]` = number of combinations summing to `i`, starting from 0 up to target

The recurrence relation is:

```
dp[i] = sum(dp[i - num] for num in nums if i >= num)
```

with base case `dp[0] = 1` (one way to make sum 0: take nothing).

This works because for each target `i`, we consider every possible last number we could add. If the last number is `num`, then we need to have formed `i - num` before adding `num`. Since we're counting all permutations, we sum over all possible last numbers.

## Optimal Solution

Here's the complete solution using bottom-up dynamic programming:

<div class="code-group">

```python
# Time: O(n * target) where n = len(nums)
# Space: O(target) for the dp array
def combinationSum4(nums, target):
    # dp[i] will store the number of combinations that sum to i
    dp = [0] * (target + 1)

    # Base case: there's exactly 1 way to make sum 0 (take no elements)
    dp[0] = 1

    # Build up solutions for all targets from 1 to target
    for i in range(1, target + 1):
        # For each target i, try every possible number from nums
        for num in nums:
            # We can only use num if it doesn't exceed current target i
            if i >= num:
                # If we use num as the last element, we need combinations for i - num
                dp[i] += dp[i - num]

    return dp[target]
```

```javascript
// Time: O(n * target) where n = nums.length
// Space: O(target) for the dp array
function combinationSum4(nums, target) {
  // dp[i] will store the number of combinations that sum to i
  const dp = new Array(target + 1).fill(0);

  // Base case: there's exactly 1 way to make sum 0 (take no elements)
  dp[0] = 1;

  // Build up solutions for all targets from 1 to target
  for (let i = 1; i <= target; i++) {
    // For each target i, try every possible number from nums
    for (const num of nums) {
      // We can only use num if it doesn't exceed current target i
      if (i >= num) {
        // If we use num as the last element, we need combinations for i - num
        dp[i] += dp[i - num];
      }
    }
  }

  return dp[target];
}
```

```java
// Time: O(n * target) where n = nums.length
// Space: O(target) for the dp array
public int combinationSum4(int[] nums, int target) {
    // dp[i] will store the number of combinations that sum to i
    int[] dp = new int[target + 1];

    // Base case: there's exactly 1 way to make sum 0 (take no elements)
    dp[0] = 1;

    // Build up solutions for all targets from 1 to target
    for (int i = 1; i <= target; i++) {
        // For each target i, try every possible number from nums
        for (int num : nums) {
            // We can only use num if it doesn't exceed current target i
            if (i >= num) {
                // If we use num as the last element, we need combinations for i - num
                dp[i] += dp[i - num];
            }
        }
    }

    return dp[target];
}
```

</div>

**Important note about integer overflow**: The problem states the answer fits in a 32-bit integer, but intermediate sums during computation might overflow. In a real interview, you might want to mention this and discuss using `long` in Java or checking for overflow.

## Complexity Analysis

**Time Complexity**: O(n × target), where n is the length of `nums`. We iterate through all targets from 1 to `target`, and for each target, we iterate through all n numbers in `nums`.

**Space Complexity**: O(target) for the DP array that stores results for all targets from 0 to `target`.

The brute force approach was exponential because it recomputed the same subproblems repeatedly. The DP solution eliminates this redundancy by storing and reusing computed results.

## Common Mistakes

1. **Confusing with regular Combination Sum**: The classic Combination Sum problem (LeetCode 39) counts combinations where order doesn't matter. This problem counts permutations where order matters. Using a backtracking approach that doesn't allow reuse of the same element in different positions would undercount.

2. **Incorrect base case**: Forgetting that `dp[0] = 1` (one way to make sum 0: the empty combination). Some candidates set it to 0, which makes the whole DP chain fail.

3. **Wrong iteration order**: In the inner loop, we must iterate through all `nums` for each target. Some candidates try to optimize by sorting and breaking early when `num > i`, which is fine, but if they put the `nums` loop outside and `target` loop inside, they'd be solving a different problem (where order doesn't matter).

4. **Integer overflow**: Not considering that intermediate sums might exceed 32-bit integer limits during computation, even if the final answer fits. This is especially important in Java where integer overflow wraps around silently.

## When You'll See This Pattern

This "target sum with unlimited elements" pattern appears in many DP problems:

1. **Coin Change II (LeetCode 518)**: Count ways to make amount with coins (order doesn't matter). The difference is in iteration order—for combinations (order doesn't matter), iterate coins outer loop, amount inner loop. For permutations (order matters, like this problem), iterate amount outer loop, coins inner loop.

2. **Climbing Stairs (LeetCode 70)**: A special case where `nums = [1, 2]`. The recurrence is the same: `dp[i] = dp[i-1] + dp[i-2]`.

3. **Decode Ways (LeetCode 91)**: Count ways to decode a string where digits map to letters. The recurrence considers whether the last 1 or 2 digits form valid letters.

The core pattern is: when you need to count ways to reach a target and the problem has overlapping subproblems, think DP with `dp[target]` representing the count for that target value.

## Key Takeaways

1. **Recognize permutation vs combination problems**: If order matters (different sequences count separately), you typically need the amount/outer loop. If order doesn't matter, you typically need the coins/inner loop in DP solutions.

2. **DP for counting problems**: When asked "how many ways" to achieve something, especially with a target value, dynamic programming is often the right approach. Look for the recurrence relation between larger problems and smaller subproblems.

3. **Start with brute force recursion**: Even if it's inefficient, writing the recursive solution helps you identify the recurrence relation and overlapping subproblems, which guides you toward the DP solution.

Related problems: [Combination Sum](/problem/combination-sum), [Ways to Express an Integer as Sum of Powers](/problem/ways-to-express-an-integer-as-sum-of-powers)
