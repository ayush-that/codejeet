---
title: "How to Solve Target Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Target Sum. Medium difficulty, 51.9% acceptance rate. Topics: Array, Dynamic Programming, Backtracking."
date: "2026-10-07"
category: "dsa-patterns"
tags: ["target-sum", "array", "dynamic-programming", "backtracking", "medium"]
---

# How to Solve Target Sum

The Target Sum problem asks us to find how many ways we can assign `+` or `-` signs to each number in an array so that their sum equals a given target. What makes this problem interesting is that it looks like a simple combination problem at first, but the brute force approach becomes impossibly slow with just 20 numbers. This forces us to find a smarter approach using dynamic programming or mathematical transformation.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have `nums = [1, 1, 1, 1, 1]` and `target = 3`.

We need to assign either `+` or `-` to each number. One valid assignment would be:

- `+1 +1 +1 +1 -1 = 3` (first four numbers positive, last one negative)

Another would be:

- `+1 +1 +1 -1 +1 = 3` (first three and last positive, fourth negative)

We can think of this as: we need to partition the numbers into two groups:

- **Positive group**: numbers with `+` sign
- **Negative group**: numbers with `-` sign (which we subtract)

The sum we want is: `sum(positive_group) - sum(negative_group) = target`

Let's call:

- `P` = sum of positive group
- `N` = sum of negative group (absolute value, before subtraction)
- `total` = sum of all numbers = `P + N`

Then:
`P - N = target`
`P + N = total`

Adding these two equations:
`2P = target + total`
`P = (target + total) / 2`

So the problem reduces to: **Find how many subsets of `nums` sum to `(target + total) / 2`**

For our example:

- `total = 5`
- `(target + total) / 2 = (3 + 5) / 2 = 4`

So we need to find how many subsets of `[1, 1, 1, 1, 1]` sum to 4. That's choosing 4 out of 5 ones, which gives us 5 ways.

## Brute Force Approach

The most straightforward approach is to try all possible combinations of `+` and `-` signs. With `n` numbers, there are `2^n` possible assignments. For each assignment, we calculate the sum and check if it equals the target.

<div class="code-group">

```python
# Time: O(2^n) | Space: O(n) for recursion stack
def findTargetSumWays_brute(nums, target):
    def backtrack(index, current_sum):
        # Base case: processed all numbers
        if index == len(nums):
            return 1 if current_sum == target else 0

        # Try adding current number with + sign
        positive = backtrack(index + 1, current_sum + nums[index])

        # Try adding current number with - sign
        negative = backtrack(index + 1, current_sum - nums[index])

        return positive + negative

    return backtrack(0, 0)
```

```javascript
// Time: O(2^n) | Space: O(n) for recursion stack
function findTargetSumWaysBrute(nums, target) {
  function backtrack(index, currentSum) {
    // Base case: processed all numbers
    if (index === nums.length) {
      return currentSum === target ? 1 : 0;
    }

    // Try adding current number with + sign
    const positive = backtrack(index + 1, currentSum + nums[index]);

    // Try adding current number with - sign
    const negative = backtrack(index + 1, currentSum - nums[index]);

    return positive + negative;
  }

  return backtrack(0, 0);
}
```

```java
// Time: O(2^n) | Space: O(n) for recursion stack
public int findTargetSumWaysBrute(int[] nums, int target) {
    return backtrack(0, 0, nums, target);
}

private int backtrack(int index, int currentSum, int[] nums, int target) {
    // Base case: processed all numbers
    if (index == nums.length) {
        return currentSum == target ? 1 : 0;
    }

    // Try adding current number with + sign
    int positive = backtrack(index + 1, currentSum + nums[index], nums, target);

    // Try adding current number with - sign
    int negative = backtrack(index + 1, currentSum - nums[index], nums, target);

    return positive + negative;
}
```

</div>

**Why this is too slow:** With `n = 20`, we have `2^20 ≈ 1,048,576` possibilities. With `n = 30`, it's over 1 billion. The problem constraints allow `n` up to 20, which might seem borderline, but in practice, this approach times out on LeetCode for the maximum input size.

## Optimized Approach

The key insight is the mathematical transformation we discovered in the visual walkthrough. Instead of trying all `2^n` sign combinations, we can transform the problem into a **subset sum** problem:

1. Calculate the total sum of all numbers: `total = sum(nums)`
2. We need `P - N = target` where `P + N = total`
3. Solving gives: `P = (target + total) / 2`
4. Now we need to count subsets of `nums` that sum to `P`

There's an important constraint: `(target + total)` must be even and non-negative. If it's odd or negative, there are zero solutions.

Now we have a classic **0/1 knapsack** problem: given items (numbers) with weights (their values), count how many ways we can select items to reach exactly weight `P`.

We can solve this with dynamic programming:

- `dp[s]` = number of ways to achieve sum `s`
- For each number `num` in `nums`, we update `dp` from right to left (to avoid reusing the same number multiple times)
- Base case: `dp[0] = 1` (one way to make sum 0: choose no numbers)

## Optimal Solution

Here's the complete DP solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * target_sum) | Space: O(target_sum)
def findTargetSumWays(nums, target):
    total = sum(nums)

    # Check if target is achievable
    # 1. (target + total) must be even (from P = (target + total)/2)
    # 2. The subset sum we're looking for must be non-negative
    if (target + total) % 2 != 0 or (target + total) < 0:
        return 0

    subset_sum = (target + total) // 2

    # dp[s] = number of ways to achieve sum s
    dp = [0] * (subset_sum + 1)
    dp[0] = 1  # One way to make sum 0: choose no numbers

    # For each number in nums
    for num in nums:
        # Update dp from right to left to avoid reusing the same number
        # We go backwards because we're updating dp in-place
        for s in range(subset_sum, num - 1, -1):
            # Number of ways to make sum s includes:
            # 1. Ways we already had to make sum s (not using current num)
            # 2. Ways to make sum (s - num) (then add current num)
            dp[s] += dp[s - num]

    return dp[subset_sum]
```

```javascript
// Time: O(n * target_sum) | Space: O(target_sum)
function findTargetSumWays(nums, target) {
  const total = nums.reduce((sum, num) => sum + num, 0);

  // Check if target is achievable
  // 1. (target + total) must be even (from P = (target + total)/2)
  // 2. The subset sum we're looking for must be non-negative
  if ((target + total) % 2 !== 0 || target + total < 0) {
    return 0;
  }

  const subsetSum = (target + total) / 2;

  // dp[s] = number of ways to achieve sum s
  const dp = new Array(subsetSum + 1).fill(0);
  dp[0] = 1; // One way to make sum 0: choose no numbers

  // For each number in nums
  for (const num of nums) {
    // Update dp from right to left to avoid reusing the same number
    // We go backwards because we're updating dp in-place
    for (let s = subsetSum; s >= num; s--) {
      // Number of ways to make sum s includes:
      // 1. Ways we already had to make sum s (not using current num)
      // 2. Ways to make sum (s - num) (then add current num)
      dp[s] += dp[s - num];
    }
  }

  return dp[subsetSum];
}
```

```java
// Time: O(n * target_sum) | Space: O(target_sum)
public int findTargetSumWays(int[] nums, int target) {
    int total = 0;
    for (int num : nums) {
        total += num;
    }

    // Check if target is achievable
    // 1. (target + total) must be even (from P = (target + total)/2)
    // 2. The subset sum we're looking for must be non-negative
    if ((target + total) % 2 != 0 || (target + total) < 0) {
        return 0;
    }

    int subsetSum = (target + total) / 2;

    // dp[s] = number of ways to achieve sum s
    int[] dp = new int[subsetSum + 1];
    dp[0] = 1;  // One way to make sum 0: choose no numbers

    // For each number in nums
    for (int num : nums) {
        // Update dp from right to left to avoid reusing the same number
        // We go backwards because we're updating dp in-place
        for (int s = subsetSum; s >= num; s--) {
            // Number of ways to make sum s includes:
            // 1. Ways we already had to make sum s (not using current num)
            // 2. Ways to make sum (s - num) (then add current num)
            dp[s] += dp[s - num];
        }
    }

    return dp[subsetSum];
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * target_sum)` where `target_sum = (target + total) / 2`

- We iterate through all `n` numbers
- For each number, we iterate through all possible sums from `target_sum` down to the number's value
- In the worst case, `target_sum` could be up to `total`, which is `sum(nums)`

**Space Complexity:** `O(target_sum)`

- We maintain a DP array of size `target_sum + 1`
- This is much more efficient than the brute force's exponential space for recursion

## Common Mistakes

1. **Not checking if `(target + total)` is even:** This is a critical mathematical constraint. If `(target + total)` is odd, `P = (target + total)/2` would not be an integer, meaning no solution exists.

2. **Updating DP array from left to right:** When we update `dp` in-place, we must go from right to left. Going left to right would allow reusing the same number multiple times (turning it into an unbounded knapsack problem instead of 0/1 knapsack).

3. **Forgetting to handle negative targets:** The subset sum `P` must be non-negative. We need to check `(target + total) >= 0`. Also, in the DP solution, array indices can't be negative.

4. **Not initializing `dp[0] = 1`:** This represents the one way to make sum 0: by choosing no numbers. Without this base case, the DP won't work correctly.

## When You'll See This Pattern

This problem teaches the **subset sum DP pattern**, which appears in many variations:

1. **Partition Equal Subset Sum (LeetCode 416):** Determine if an array can be partitioned into two subsets with equal sums. This is essentially checking if there's a subset summing to `total/2`.

2. **Coin Change 2 (LeetCode 518):** Count the number of combinations that make up a given amount. Similar DP approach but with unbounded knapsack (coins can be reused).

3. **Combination Sum IV (LeetCode 377):** Count combinations that add up to target, similar DP structure but with different ordering considerations.

The key insight is recognizing when a problem can be transformed into counting subsets that sum to a specific value, then applying the classic 0/1 knapsack DP solution.

## Key Takeaways

1. **Mathematical transformation can simplify problems:** The insight that `P - N = target` and `P + N = total` leads to `P = (target + total)/2` transforms an exponential problem into a polynomial one.

2. **Subset sum problems often use 0/1 knapsack DP:** When you need to count subsets with a specific sum, think of the DP approach where `dp[s]` counts ways to achieve sum `s`, updated from right to left for each number.

3. **Always check mathematical constraints:** Before diving into DP, verify that the transformed problem has valid parameters (evenness, non-negativity). This catches edge cases early.

Related problems: [Expression Add Operators](/problem/expression-add-operators), [Ways to Express an Integer as Sum of Powers](/problem/ways-to-express-an-integer-as-sum-of-powers)
