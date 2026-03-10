---
title: "How to Solve Length of the Longest Subsequence That Sums to Target — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Length of the Longest Subsequence That Sums to Target. Medium difficulty, 39.3% acceptance rate. Topics: Array, Dynamic Programming."
date: "2029-01-08"
category: "dsa-patterns"
tags:
  [
    "length-of-the-longest-subsequence-that-sums-to-target",
    "array",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Length of the Longest Subsequence That Sums to Target

You're given an array of integers and a target sum. Your task is to find the length of the longest subsequence (not necessarily contiguous) that sums exactly to the target. If no such subsequence exists, return -1. This problem is tricky because it combines two classic concepts: finding subsets that sum to a target (like the subset sum problem) and maximizing the count of elements used. The "subsequence" aspect means we can pick any elements in their original order, but we want to maximize how many we pick while hitting the exact target sum.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 4, 5]`, `target = 7`.

We want the longest subsequence that sums to 7. Let's think about possibilities:

- `[2, 5]` → length 2, sum 7
- `[3, 4]` → length 2, sum 7
- `[1, 2, 4]` → length 3, sum 7 ← this is longer!
- `[1, 3, 3]` → invalid (3 appears only once)
- `[1, 1, 5]` → invalid (1 appears only once)

So the answer should be 3. But how do we find this systematically?

Imagine we process each number one by one. For each number, we can either include it or exclude it in our subsequence. This is similar to the knapsack problem: we have items (numbers) with values (the numbers themselves as weights) and we want to fill a knapsack of capacity `target` while maximizing the number of items.

Let's build a table where `dp[sum]` stores the maximum length of subsequence that sums to exactly `sum`:

Initialize: `dp[0] = 0` (empty subsequence sums to 0 with length 0), all other sums = `-inf` (impossible)

Process `1`:

- We can make sum 1 by including the 1: length 1
- `dp[1] = max(dp[1], dp[0] + 1) = max(-inf, 0 + 1) = 1`

Process `2`:

- For each existing sum, we can add 2 to it
- Sum 2: `dp[2] = max(dp[2], dp[0] + 1) = max(-inf, 0 + 1) = 1`
- Sum 3: `dp[3] = max(dp[3], dp[1] + 1) = max(-inf, 1 + 1) = 2`

Process `3`:

- Sum 3: `dp[3] = max(2, dp[0] + 1) = max(2, 1) = 2`
- Sum 4: `dp[4] = max(dp[4], dp[1] + 1) = max(-inf, 1 + 1) = 2`
- Sum 5: `dp[5] = max(dp[5], dp[2] + 1) = max(-inf, 1 + 1) = 2`
- Sum 6: `dp[6] = max(dp[6], dp[3] + 1) = max(-inf, 2 + 1) = 3`

Process `4`:

- Sum 4: `dp[4] = max(2, dp[0] + 1) = max(2, 1) = 2`
- Sum 5: `dp[5] = max(2, dp[1] + 1) = max(2, 2) = 2`
- Sum 6: `dp[6] = max(3, dp[2] + 1) = max(3, 2) = 3`
- Sum 7: `dp[7] = max(dp[7], dp[3] + 1) = max(-inf, 2 + 1) = 3` ← Found it!

Process `5`:

- Sum 5: `dp[5] = max(2, dp[0] + 1) = max(2, 1) = 2`
- Sum 6: `dp[6] = max(3, dp[1] + 1) = max(3, 2) = 3`
- Sum 7: `dp[7] = max(3, dp[2] + 1) = max(3, 2) = 3`
- Sum 8: `dp[8] = max(dp[8], dp[3] + 1) = max(-inf, 2 + 1) = 3`

Final answer: `dp[7] = 3`, which matches our manual finding.

## Brute Force Approach

The most straightforward approach is to generate all possible subsequences (subsets) of the array and check their sums. For each subsequence, if the sum equals the target, we track the maximum length.

There are 2^n possible subsequences for an array of length n. For each subsequence, we need to compute its sum (O(n) in worst case) and compare to target. This gives us O(n \* 2^n) time complexity, which is far too slow for typical constraints (n up to 1000).

Even if we optimize the sum calculation using incremental updates, we still have O(2^n) subsequences to check. This exponential growth makes the brute force approach impractical.

## Optimized Approach

The key insight is that this is a variation of the **0/1 knapsack problem**:

- Our "knapsack capacity" is the target sum
- Each number has a "weight" equal to its value
- We want to maximize the "count" of items (numbers) in the knapsack
- Unlike standard knapsack, we must fill the knapsack exactly to capacity

We can use dynamic programming where `dp[sum]` represents the maximum length of subsequence that sums exactly to `sum`. We initialize `dp[0] = 0` (empty subsequence) and all other sums to negative infinity (or a very small number) to indicate they're impossible.

For each number in `nums`, we iterate backwards through the `dp` array from `target` down to the number's value. Why backwards? Because we're doing 0/1 knapsack (each number can be used at most once). If we iterate forwards, we might use the same number multiple times (which would be the unbounded knapsack version).

The recurrence relation is:

```
dp[sum] = max(dp[sum], dp[sum - num] + 1)
```

This means: "The best way to make sum `sum` is either what we already have, OR by taking whatever gave us sum `sum - num` and adding the current number (which increases length by 1)."

After processing all numbers, `dp[target]` gives us the maximum length. If it's still negative infinity (or less than 0), we return -1.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * target) | Space: O(target)
def lengthOfLongestSubsequence(self, nums, target):
    """
    Finds the length of the longest subsequence that sums exactly to target.

    Args:
        nums: List of integers
        target: The target sum to achieve

    Returns:
        Maximum length of subsequence summing to target, or -1 if impossible
    """
    # Initialize DP array with negative infinity (impossible states)
    # We use float('-inf') to properly handle comparisons
    dp = [float('-inf')] * (target + 1)

    # Base case: empty subsequence sums to 0 with length 0
    dp[0] = 0

    # Process each number in the array
    for num in nums:
        # Iterate backwards from target down to num
        # This ensures each number is used at most once (0/1 knapsack)
        for current_sum in range(target, num - 1, -1):
            # If we can make (current_sum - num), then we can make current_sum
            # by adding the current number (increases length by 1)
            if dp[current_sum - num] != float('-inf'):
                dp[current_sum] = max(dp[current_sum], dp[current_sum - num] + 1)

    # If dp[target] is still negative infinity, no subsequence sums to target
    return dp[target] if dp[target] > 0 else -1
```

```javascript
// Time: O(n * target) | Space: O(target)
/**
 * Finds the length of the longest subsequence that sums exactly to target.
 *
 * @param {number[]} nums - Array of integers
 * @param {number} target - The target sum to achieve
 * @return {number} Maximum length of subsequence summing to target, or -1 if impossible
 */
var lengthOfLongestSubsequence = function (nums, target) {
  // Initialize DP array with negative infinity (impossible states)
  // We use -Infinity to properly handle comparisons
  const dp = new Array(target + 1).fill(-Infinity);

  // Base case: empty subsequence sums to 0 with length 0
  dp[0] = 0;

  // Process each number in the array
  for (const num of nums) {
    // Iterate backwards from target down to num
    // This ensures each number is used at most once (0/1 knapsack)
    for (let currentSum = target; currentSum >= num; currentSum--) {
      // If we can make (currentSum - num), then we can make currentSum
      // by adding the current number (increases length by 1)
      if (dp[currentSum - num] !== -Infinity) {
        dp[currentSum] = Math.max(dp[currentSum], dp[currentSum - num] + 1);
      }
    }
  }

  // If dp[target] is still negative infinity, no subsequence sums to target
  return dp[target] > 0 ? dp[target] : -1;
};
```

```java
// Time: O(n * target) | Space: O(target)
class Solution {
    /**
     * Finds the length of the longest subsequence that sums exactly to target.
     *
     * @param nums Array of integers
     * @param target The target sum to achieve
     * @return Maximum length of subsequence summing to target, or -1 if impossible
     */
    public int lengthOfLongestSubsequence(List<Integer> nums, int target) {
        // Initialize DP array with a very small number (impossible states)
        // Using Integer.MIN_VALUE/2 to avoid overflow when adding 1
        int[] dp = new int[target + 1];
        Arrays.fill(dp, Integer.MIN_VALUE / 2);

        // Base case: empty subsequence sums to 0 with length 0
        dp[0] = 0;

        // Process each number in the array
        for (int num : nums) {
            // Iterate backwards from target down to num
            // This ensures each number is used at most once (0/1 knapsack)
            for (int currentSum = target; currentSum >= num; currentSum--) {
                // If we can make (currentSum - num), then we can make currentSum
                // by adding the current number (increases length by 1)
                if (dp[currentSum - num] != Integer.MIN_VALUE / 2) {
                    dp[currentSum] = Math.max(dp[currentSum], dp[currentSum - num] + 1);
                }
            }
        }

        // If dp[target] is still the initial very small value, no subsequence sums to target
        return dp[target] > 0 ? dp[target] : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × target), where n is the length of `nums` and `target` is the target sum. For each of the n numbers, we iterate through at most `target` values in the DP array.

**Space Complexity:** O(target), for the DP array of size `target + 1`. We only need to track the current state for each possible sum from 0 to target.

The time complexity is pseudo-polynomial because it depends on the value of `target`, not just the size of the input. If `target` is very large (e.g., 10^9), this solution becomes impractical. However, for typical constraints where `target` is reasonable (up to 1000), this is efficient.

## Common Mistakes

1. **Iterating forwards instead of backwards**: This is the most common mistake. If you iterate from `num` to `target` (forwards), you might use the same number multiple times because when you update `dp[current_sum]`, that updated value could be used later in the same iteration for a larger sum. This would solve the "unbounded knapsack" version where you can use numbers repeatedly, not the "0/1 knapsack" version we need.

2. **Incorrect initialization**: Forgetting to initialize `dp[0] = 0` or initializing it to something else. The empty subsequence is valid and sums to 0 with length 0. Also, using 0 instead of negative infinity for impossible states can cause issues because 0 might be a valid result (e.g., if we update `dp[sum] = max(0, dp[sum-num] + 1)`, we might incorrectly think we can make a sum when we can't).

3. **Not handling negative numbers**: The problem statement doesn't specify that numbers are positive, but if they could be negative, our DP approach would need adjustment (the bounds of our loop would change). In practice, for this problem, numbers are typically non-negative, but it's worth considering edge cases.

4. **Returning 0 instead of -1 when no subsequence exists**: The problem specifies to return -1 when no subsequence sums to target. If `dp[target]` is 0 or negative, we should return -1, not 0. An empty subsequence only sums to 0, not to a positive target.

## When You'll See This Pattern

This 0/1 knapsack DP pattern appears in many problems where you need to:

1. Select a subset of items with certain constraints
2. Optimize some value (maximize count, minimize cost, etc.)
3. Each item can be used at most once

Related problems:

- **Coin Change**: Minimize the number of coins to make a target amount (unbounded knapsack)
- **Coin Change II**: Count the number of combinations to make a target amount
- **Partition Equal Subset Sum**: Check if array can be partitioned into two subsets with equal sum
- **Target Sum**: Assign + or - to each number to reach target sum (a variation with two choices per number)

The key difference between this problem and Coin Change is that here we're maximizing the count (length) while in Coin Change we're minimizing it. Also, Coin Change typically allows unlimited use of each coin (unbounded knapsack), while here we can use each number at most once.

## Key Takeaways

1. **Recognize the 0/1 knapsack pattern**: When you need to select a subset with constraints and each element can be used at most once, think of DP with a table tracking achievable sums.

2. **Backward iteration is crucial for 0/1 knapsack**: Always iterate backwards through the DP array when each item can be used only once. Forward iteration gives you the unbounded knapsack solution.

3. **Initialize carefully**: Use negative infinity (or a sentinel value) for impossible states, and don't forget the base case (empty subset sums to 0).

This problem teaches you how to adapt the classic knapsack DP approach to maximize count rather than value, which is a useful pattern for many optimization problems.

Related problems: [Coin Change](/problem/coin-change), [Coin Change II](/problem/coin-change-ii), [Find the Maximum Length of Valid Subsequence I](/problem/find-the-maximum-length-of-valid-subsequence-i)
