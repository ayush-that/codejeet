---
title: "How to Solve Burst Balloons — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Burst Balloons. Hard difficulty, 63.0% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-07-09"
category: "dsa-patterns"
tags: ["burst-balloons", "array", "dynamic-programming", "hard"]
---

# How to Solve Burst Balloons

You're given an array `nums` representing balloons with numbers, and bursting balloon `i` gives you `nums[i-1] * nums[i] * nums[i+1]` coins (with virtual balloons of value 1 at the boundaries). After bursting, adjacent balloons become adjacent. The goal is to find the maximum coins you can collect by bursting all balloons in optimal order.

What makes this problem tricky is that the coins you get for bursting a balloon depend on its neighbors, but those neighbors change as you burst other balloons. The optimal bursting order isn't obvious, and trying all permutations is astronomically slow. This is a classic dynamic programming problem where we need to think backwards: instead of "which balloon to burst first," we think "which balloon bursts last."

## Visual Walkthrough

Let's trace through a small example: `nums = [3, 1, 5, 8]`.

First, add virtual balloons with value 1 at both ends: `[1, 3, 1, 5, 8, 1]`. Now we have indices 0-5.

The key insight: Instead of thinking "burst balloon i first," think "if balloon i is the LAST one to burst in some subarray, what coins do we get?"

Consider the entire array `[1, 3, 1, 5, 8, 1]`. If balloon 3 (value 5) bursts last:

- All balloons to its left (indices 1-2: values 3, 1) are already gone
- All balloons to its right (indices 4: value 8) are already gone
- So its neighbors are the virtual balloons at the boundaries: index 0 (value 1) and index 5 (value 1)
- Coins = `1 * 5 * 1 = 5`

But wait — that's too small! The real value comes from solving subproblems recursively.

Better approach: For any subarray from `left` to `right` (inclusive), if balloon `i` bursts last in that subarray:

1. All balloons between `left` and `i-1` are already burst (solved as subproblem)
2. All balloons between `i+1` and `right` are already burst (solved as subproblem)
3. Balloon `i` is now alone, with neighbors `nums[left-1]` and `nums[right+1]`
4. Coins = `nums[left-1] * nums[i] * nums[right+1] + dp[left][i-1] + dp[i+1][right]`

For our example with `[1, 3, 1, 5, 8, 1]`:

- If balloon 2 (value 1) bursts last in the entire array:
  - Left subarray [1,3] (indices 1-1) gives max coins
  - Right subarray [5,8] (indices 3-4) gives max coins
  - Coins = `1 * 1 * 1 + dp[1][1] + dp[3][4]`
- We need to compute all possibilities and take the maximum.

## Brute Force Approach

The brute force approach would try all possible bursting orders. For n balloons, there are n! possible orders. For each order, we'd simulate the bursting process, which takes O(n) time per order. This gives us O(n! \* n) time complexity, which is astronomically slow even for small n like 10.

A naive candidate might try greedy approaches like "always burst the smallest balloon first" or "always burst the balloon that gives the most coins right now," but these fail because they don't consider future effects. The optimal bursting order often involves saving valuable balloons to be neighbors when other valuable balloons burst.

## Optimized Approach

The key insight is dynamic programming with a clever state definition. Instead of tracking which balloons are burst (which would be 2^n states), we track which balloons remain in a contiguous segment.

Define `dp[left][right]` as the maximum coins we can get from bursting all balloons between indices `left` and `right` (inclusive), assuming balloons outside this range are still present (not yet burst).

The recurrence relation:

- For each possible `last` balloon to burst in the range `[left, right]`:
  - Coins from bursting `last` = `nums[left-1] * nums[last] * nums[right+1]`
  - Plus coins from left side: `dp[left][last-1]`
  - Plus coins from right side: `dp[last+1][right]`
- Take the maximum over all possible `last` choices

We need to compute `dp` for increasing lengths of intervals:

1. Start with length 1 intervals (single balloons)
2. Then length 2, 3, up to length n
3. The answer is `dp[1][n]` (using 1-indexed with virtual balloons)

This is O(n³) time and O(n²) space — much better than factorial time!

## Optimal Solution

<div class="code-group">

```python
# Time: O(n³) | Space: O(n²)
def maxCoins(nums):
    """
    Calculate maximum coins from bursting balloons.

    Args:
        nums: List of balloon values

    Returns:
        Maximum coins possible
    """
    # Add virtual balloons with value 1 at both ends
    # This simplifies boundary handling
    balloons = [1] + nums + [1]
    n = len(balloons)

    # dp[left][right] = max coins from bursting balloons between left and right (exclusive)
    # We use exclusive boundaries: (left, right) means balloons between left and right
    dp = [[0] * n for _ in range(n)]

    # We need to compute for increasing lengths of intervals
    # length represents how many balloons we're considering
    for length in range(2, n):  # length from 2 to n-1 (at least one balloon between)
        # left boundary goes from 0 to n - length
        for left in range(0, n - length):
            right = left + length

            # Try every possible last balloon to burst in (left, right)
            # last is the index of the balloon that bursts last
            for last in range(left + 1, right):
                # Coins from bursting 'last' as the final balloon:
                # balloons[left] and balloons[right] are the boundaries that remain
                coins = balloons[left] * balloons[last] * balloons[right]

                # Add coins from left side (balloons between left and last)
                coins += dp[left][last]

                # Add coins from right side (balloons between last and right)
                coins += dp[last][right]

                # Update maximum
                dp[left][right] = max(dp[left][right], coins)

    # Answer is dp[0][n-1] which represents all original balloons
    return dp[0][n-1]
```

```javascript
// Time: O(n³) | Space: O(n²)
/**
 * Calculate maximum coins from bursting balloons.
 *
 * @param {number[]} nums - Array of balloon values
 * @return {number} Maximum coins possible
 */
function maxCoins(nums) {
  // Add virtual balloons with value 1 at both ends
  // This simplifies boundary handling
  const balloons = [1, ...nums, 1];
  const n = balloons.length;

  // dp[left][right] = max coins from bursting balloons between left and right (exclusive)
  // We use exclusive boundaries: (left, right) means balloons between left and right
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));

  // We need to compute for increasing lengths of intervals
  // length represents how many balloons we're considering
  for (let length = 2; length < n; length++) {
    // left boundary goes from 0 to n - length
    for (let left = 0; left < n - length; left++) {
      const right = left + length;

      // Try every possible last balloon to burst in (left, right)
      // last is the index of the balloon that bursts last
      for (let last = left + 1; last < right; last++) {
        // Coins from bursting 'last' as the final balloon:
        // balloons[left] and balloons[right] are the boundaries that remain
        const coins =
          balloons[left] * balloons[last] * balloons[right] +
          dp[left][last] + // left side
          dp[last][right]; // right side

        // Update maximum
        dp[left][right] = Math.max(dp[left][right], coins);
      }
    }
  }

  // Answer is dp[0][n-1] which represents all original balloons
  return dp[0][n - 1];
}
```

```java
// Time: O(n³) | Space: O(n²)
class Solution {
    /**
     * Calculate maximum coins from bursting balloons.
     *
     * @param nums Array of balloon values
     * @return Maximum coins possible
     */
    public int maxCoins(int[] nums) {
        // Add virtual balloons with value 1 at both ends
        // This simplifies boundary handling
        int n = nums.length + 2;
        int[] balloons = new int[n];
        balloons[0] = 1;
        balloons[n - 1] = 1;
        for (int i = 0; i < nums.length; i++) {
            balloons[i + 1] = nums[i];
        }

        // dp[left][right] = max coins from bursting balloons between left and right (exclusive)
        // We use exclusive boundaries: (left, right) means balloons between left and right
        int[][] dp = new int[n][n];

        // We need to compute for increasing lengths of intervals
        // length represents how many balloons we're considering
        for (int length = 2; length < n; length++) {
            // left boundary goes from 0 to n - length
            for (int left = 0; left < n - length; left++) {
                int right = left + length;

                // Try every possible last balloon to burst in (left, right)
                // last is the index of the balloon that bursts last
                for (int last = left + 1; last < right; last++) {
                    // Coins from bursting 'last' as the final balloon:
                    // balloons[left] and balloons[right] are the boundaries that remain
                    int coins = balloons[left] * balloons[last] * balloons[right]
                               + dp[left][last]   // left side
                               + dp[last][right]; // right side

                    // Update maximum
                    dp[left][right] = Math.max(dp[left][right], coins);
                }
            }
        }

        // Answer is dp[0][n-1] which represents all original balloons
        return dp[0][n - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n³)**

- We have three nested loops:
  1. Outer loop over interval lengths: O(n)
  2. Middle loop over left boundaries: O(n)
  3. Inner loop over possible last balloons: O(n)
- This gives us O(n³) total operations
- For n = 500 (typical constraint), this is 125 million operations, which is acceptable

**Space Complexity: O(n²)**

- We store a 2D DP table of size n × n where n = len(nums) + 2
- This is O(n²) space
- We could optimize to O(n) by noticing we only need certain diagonals, but the O(n²) solution is usually acceptable

## Common Mistakes

1. **Wrong boundary handling without virtual balloons**: Without adding 1s at both ends, you need complex conditional logic to handle bursting balloons at the ends. The virtual balloons elegantly handle this.

2. **Incorrect DP state definition**: Some candidates try to define `dp[i]` as max coins for first i balloons, but this doesn't work because bursting affects both sides. The interval-based approach is crucial.

3. **Wrong iteration order**: Computing intervals from smallest to largest is essential. If you try to compute `dp[0][n-1]` directly without computing smaller intervals first, you'll get incorrect results or infinite recursion.

4. **Forgetting that boundaries remain**: When computing coins for bursting balloon `last`, remember that `balloons[left]` and `balloons[right]` are the boundaries that remain (not yet burst), not the immediate neighbors.

## When You'll See This Pattern

This "burst balloons" pattern appears in problems where you need to find an optimal order of operations on a sequence, and each operation's cost depends on adjacent elements that change as you perform operations.

Related problems:

1. **Minimum Cost to Merge Stones (Hard)**: Similar interval DP where you merge stones in optimal order, and cost depends on the sum of stones in the interval.
2. **Stone Game (Medium)**: Another interval DP where players take from ends, and you track optimal scores.
3. **Palindrome Partitioning II (Hard)**: Uses interval DP to find minimum cuts for palindrome partitioning.

The core pattern is: when you have a sequence and operations that depend on neighbors, think about the "last operation" and use interval DP to build from smaller to larger intervals.

## Key Takeaways

1. **Think backwards**: Instead of "what to do first," think "what happens last." This reversal often simplifies dependency chains in DP problems.

2. **Interval DP for sequence operations**: When operations on a sequence affect neighbors, define `dp[left][right]` as the optimal result for that subarray, and build from smaller to larger intervals.

3. **Add sentinel values**: Adding dummy values at boundaries (like the 1s here) can simplify edge case handling in many array/sequence problems.

Related problems: [Minimum Cost to Merge Stones](/problem/minimum-cost-to-merge-stones)
