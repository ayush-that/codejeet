---
title: "How to Solve Longest Non-decreasing Subarray From Two Arrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Non-decreasing Subarray From Two Arrays. Medium difficulty, 31.0% acceptance rate. Topics: Array, Dynamic Programming."
date: "2029-01-17"
category: "dsa-patterns"
tags: ["longest-non-decreasing-subarray-from-two-arrays", "array", "dynamic-programming", "medium"]
---

# How to Solve Longest Non-decreasing Subarray From Two Arrays

You're given two arrays of equal length and can choose elements from either array at each position to form a third array. Your goal is to find the longest possible non-decreasing subarray (contiguous segment) in this constructed array. The challenge lies in tracking two possible "states" at each position—whether we continue a subarray ending with a value from `nums1` or `nums2`—and maximizing the subarray length across all choices.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
nums1 = [5, 2, 4, 6]
nums2 = [3, 1, 7, 5]
n = 4
```

We need to track the longest non-decreasing subarray we can form ending at each position `i`, considering whether we choose `nums1[i]` or `nums2[i]`.

**Position i = 0:**

- Choose nums1[0] = 5: Subarray length = 1
- Choose nums2[0] = 3: Subarray length = 1
  Best so far: length 1

**Position i = 1:**

- For nums1[1] = 2:
  - Can we continue from nums1[0] = 5? 2 < 5 → NO (reset to 1)
  - Can we continue from nums2[0] = 3? 2 < 3 → NO (reset to 1)
    → Length ending with nums1[1] = 1

- For nums2[1] = 1:
  - Continue from nums1[0] = 5? 1 < 5 → NO
  - Continue from nums2[0] = 3? 1 < 3 → NO
    → Length ending with nums2[1] = 1

Best so far: length 1

**Position i = 2:**

- For nums1[2] = 4:
  - Continue from nums1[1] = 2? 4 ≥ 2 → YES (1 + 1 = 2)
  - Continue from nums2[1] = 1? 4 ≥ 1 → YES (1 + 1 = 2)
    → Best: max(2, 2) = 2

- For nums2[2] = 7:
  - Continue from nums1[1] = 2? 7 ≥ 2 → YES (1 + 1 = 2)
  - Continue from nums2[1] = 1? 7 ≥ 1 → YES (1 + 1 = 2)
    → Best: max(2, 2) = 2

Best so far: length 2

**Position i = 3:**

- For nums1[3] = 6:
  - Continue from nums1[2] = 4? 6 ≥ 4 → YES (2 + 1 = 3)
  - Continue from nums2[2] = 7? 6 < 7 → NO (reset to 1)
    → Best: max(3, 1) = 3

- For nums2[3] = 5:
  - Continue from nums1[2] = 4? 5 ≥ 4 → YES (2 + 1 = 3)
  - Continue from nums2[2] = 7? 5 < 7 → NO (reset to 1)
    → Best: max(3, 1) = 3

Best overall: length 3

The longest non-decreasing subarray we can form is length 3 (e.g., choose [2, 4, 6] from nums1 at indices 1, 2, 3).

## Brute Force Approach

A naive approach would be to try all possible combinations of choices between `nums1` and `nums2` at each position, construct `nums3` for each combination, then find the longest non-decreasing subarray in each constructed array.

For each of the `n` positions, we have 2 choices (nums1[i] or nums2[i]), giving us `2^n` possible arrays to check. For each array, finding the longest non-decreasing subarray takes O(n) time. This results in O(n × 2^n) time complexity, which is exponential and completely impractical for even moderately sized inputs (n = 30 would mean checking over 1 billion arrays).

Even if we try to be clever by only tracking subarrays as we go, without dynamic programming we'd need to reconsider all previous choices at each step, leading to exponential complexity.

## Optimized Approach

The key insight is that at each position `i`, we only need to know:

1. The longest non-decreasing subarray ending at position `i` if we choose `nums1[i]`
2. The longest non-decreasing subarray ending at position `i` if we choose `nums2[i]`

We can compute these using dynamic programming with just two state variables:

- `dp1`: Length of longest non-decreasing subarray ending at current position with `nums1[i]`
- `dp2`: Length of longest non-decreasing subarray ending at current position with `nums2[i]`

At each step `i`, we calculate:

- New `dp1` = max(continue from previous `dp1` if `nums1[i] ≥ nums1[i-1]`, continue from previous `dp2` if `nums1[i] ≥ nums2[i-1]`, or start fresh)
- New `dp2` = max(continue from previous `dp1` if `nums2[i] ≥ nums1[i-1]`, continue from previous `dp2` if `nums2[i] ≥ nums2[i-1]`, or start fresh)

We track the maximum length seen so far and update it at each position.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxNonDecreasingLength(nums1, nums2):
    """
    Returns the length of the longest non-decreasing subarray
    that can be formed by choosing elements from nums1 or nums2 at each position.
    """
    n = len(nums1)

    # Base case: empty arrays
    if n == 0:
        return 0

    # dp1: longest subarray ending at current position with nums1[i]
    # dp2: longest subarray ending at current position with nums2[i]
    dp1 = dp2 = 1
    max_len = 1  # Track the maximum length found so far

    for i in range(1, n):
        # Store previous values before updating
        prev_dp1, prev_dp2 = dp1, dp2

        # Calculate new dp1: longest ending with nums1[i]
        # Option 1: Continue from previous nums1[i-1] if non-decreasing
        option1 = prev_dp1 + 1 if nums1[i] >= nums1[i-1] else 1
        # Option 2: Continue from previous nums2[i-1] if non-decreasing
        option2 = prev_dp2 + 1 if nums1[i] >= nums2[i-1] else 1
        # Take the best option
        dp1 = max(option1, option2)

        # Calculate new dp2: longest ending with nums2[i]
        # Option 1: Continue from previous nums1[i-1] if non-decreasing
        option1 = prev_dp1 + 1 if nums2[i] >= nums1[i-1] else 1
        # Option 2: Continue from previous nums2[i-1] if non-decreasing
        option2 = prev_dp2 + 1 if nums2[i] >= nums2[i-1] else 1
        # Take the best option
        dp2 = max(option1, option2)

        # Update the overall maximum length
        max_len = max(max_len, dp1, dp2)

    return max_len
```

```javascript
// Time: O(n) | Space: O(1)
function maxNonDecreasingLength(nums1, nums2) {
  /**
   * Returns the length of the longest non-decreasing subarray
   * that can be formed by choosing elements from nums1 or nums2 at each position.
   */
  const n = nums1.length;

  // Base case: empty arrays
  if (n === 0) {
    return 0;
  }

  // dp1: longest subarray ending at current position with nums1[i]
  // dp2: longest subarray ending at current position with nums2[i]
  let dp1 = 1,
    dp2 = 1;
  let maxLen = 1; // Track the maximum length found so far

  for (let i = 1; i < n; i++) {
    // Store previous values before updating
    const prevDp1 = dp1,
      prevDp2 = dp2;

    // Calculate new dp1: longest ending with nums1[i]
    // Option 1: Continue from previous nums1[i-1] if non-decreasing
    const option1 = nums1[i] >= nums1[i - 1] ? prevDp1 + 1 : 1;
    // Option 2: Continue from previous nums2[i-1] if non-decreasing
    const option2 = nums1[i] >= nums2[i - 1] ? prevDp2 + 1 : 1;
    // Take the best option
    dp1 = Math.max(option1, option2);

    // Calculate new dp2: longest ending with nums2[i]
    // Option 1: Continue from previous nums1[i-1] if non-decreasing
    const option3 = nums2[i] >= nums1[i - 1] ? prevDp1 + 1 : 1;
    // Option 2: Continue from previous nums2[i-1] if non-decreasing
    const option4 = nums2[i] >= nums2[i - 1] ? prevDp2 + 1 : 1;
    // Take the best option
    dp2 = Math.max(option3, option4);

    // Update the overall maximum length
    maxLen = Math.max(maxLen, dp1, dp2);
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int maxNonDecreasingLength(int[] nums1, int[] nums2) {
        /**
         * Returns the length of the longest non-decreasing subarray
         * that can be formed by choosing elements from nums1 or nums2 at each position.
         */
        int n = nums1.length;

        // Base case: empty arrays
        if (n == 0) {
            return 0;
        }

        // dp1: longest subarray ending at current position with nums1[i]
        // dp2: longest subarray ending at current position with nums2[i]
        int dp1 = 1, dp2 = 1;
        int maxLen = 1;  // Track the maximum length found so far

        for (int i = 1; i < n; i++) {
            // Store previous values before updating
            int prevDp1 = dp1, prevDp2 = dp2;

            // Calculate new dp1: longest ending with nums1[i]
            // Option 1: Continue from previous nums1[i-1] if non-decreasing
            int option1 = (nums1[i] >= nums1[i-1]) ? prevDp1 + 1 : 1;
            // Option 2: Continue from previous nums2[i-1] if non-decreasing
            int option2 = (nums1[i] >= nums2[i-1]) ? prevDp2 + 1 : 1;
            // Take the best option
            dp1 = Math.max(option1, option2);

            // Calculate new dp2: longest ending with nums2[i]
            // Option 1: Continue from previous nums1[i-1] if non-decreasing
            int option3 = (nums2[i] >= nums1[i-1]) ? prevDp1 + 1 : 1;
            // Option 2: Continue from previous nums2[i-1] if non-decreasing
            int option4 = (nums2[i] >= nums2[i-1]) ? prevDp2 + 1 : 1;
            // Take the best option
            dp2 = Math.max(option3, option4);

            // Update the overall maximum length
            maxLen = Math.max(maxLen, Math.max(dp1, dp2));
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the arrays exactly once (n-1 iterations for the loop starting at i=1)
- Each iteration performs a constant number of comparisons and arithmetic operations
- No nested loops or recursive calls

**Space Complexity: O(1)**

- We only use a fixed number of variables (dp1, dp2, maxLen, and temporary variables for previous values)
- No additional data structures that scale with input size
- The input arrays themselves are not counted toward auxiliary space complexity

## Common Mistakes

1. **Forgetting to store previous dp values before updating**: If you update `dp1` and then use the new `dp1` value to calculate `dp2`, you'll get incorrect results. Always store the previous iteration's values in temporary variables first.

2. **Not handling the reset case correctly**: When the current element is smaller than the previous chosen element, the subarray must reset to length 1, not continue from the previous length. This is why we use the ternary operator `? 1 : prev + 1` instead of just adding 1 unconditionally.

3. **Confusing non-decreasing with strictly increasing**: Non-decreasing means each element can be equal to or greater than the previous one (`nums[i] >= nums[i-1]`). Some candidates mistakenly use `>` for strictly increasing, which would give incorrect results for equal elements.

4. **Missing the base case for empty arrays**: Always check if `n == 0` and return 0 immediately. While the problem constraints might guarantee non-empty arrays, it's good practice to handle edge cases.

## When You'll See This Pattern

This problem uses a **state machine DP** pattern where you maintain multiple states (in this case, two) representing different "modes" or choices at each step. You'll see similar patterns in:

1. **Best Time to Buy and Sell Stock with Cooldown (LeetCode 309)**: Maintain states for "holding stock", "just sold", and "cooldown" to track maximum profit.

2. **House Robber II (LeetCode 213)**: Track two states—whether you rob the first house or not—to handle the circular arrangement.

3. **Maximum Subarray Sum with One Deletion (LeetCode 1186)**: Maintain states for "no deletion yet" and "one deletion used" to track the best sum.

The common theme is that when you have multiple choices or states at each position, and the optimal solution depends on which state you're in, a multi-state DP approach is often the solution.

## Key Takeaways

1. **When you have binary choices at each step**, consider maintaining separate DP states for each choice. This transforms an exponential search space into linear time.

2. **The state transition depends on compatibility between states**: In this problem, whether you can continue a subarray depends on whether the current choice is non-decreasing relative to the previous choice. Always clearly define the transition conditions.

3. **Track the global maximum separately from state values**: The answer isn't necessarily `max(dp1, dp2)` at the last position—the longest subarray could end earlier. Always update a global maximum as you go.

Related problems: [Russian Doll Envelopes](/problem/russian-doll-envelopes), [Maximum Length of Pair Chain](/problem/maximum-length-of-pair-chain)
