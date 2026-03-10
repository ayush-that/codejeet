---
title: "How to Solve Wiggle Subsequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Wiggle Subsequence. Medium difficulty, 49.3% acceptance rate. Topics: Array, Dynamic Programming, Greedy."
date: "2028-01-31"
category: "dsa-patterns"
tags: ["wiggle-subsequence", "array", "dynamic-programming", "greedy", "medium"]
---

# How to Solve Wiggle Subsequence

A wiggle sequence is one where consecutive differences strictly alternate between positive and negative. The challenge lies in finding the longest possible wiggle subsequence from an array without reordering elements. What makes this problem interesting is that it looks like a typical dynamic programming problem, but has an elegant greedy solution that's more efficient.

## Visual Walkthrough

Let's trace through the example `[1, 7, 4, 9, 2, 5]`:

1. Start with `1` (length = 1)
2. Compare `1` and `7`: difference is positive (+6), so we can extend our sequence: `[1, 7]` (length = 2, last difference = positive)
3. Compare `7` and `4`: difference is negative (-3). Since our last difference was positive, this alternates correctly: `[1, 7, 4]` (length = 3, last difference = negative)
4. Compare `4` and `9`: difference is positive (+5). Last difference was negative, so this alternates: `[1, 7, 4, 9]` (length = 4, last difference = positive)
5. Compare `9` and `2`: difference is negative (-7). Last difference was positive, so this alternates: `[1, 7, 4, 9, 2]` (length = 5, last difference = negative)
6. Compare `2` and `5`: difference is positive (+3). Last difference was negative, so this alternates: `[1, 7, 4, 9, 2, 5]` (length = 6)

The entire sequence is a wiggle sequence! But what about `[1, 17, 5, 10, 13, 15, 10, 5, 16, 8]`?

1. `[1, 17]` (up, length 2)
2. `[1, 17, 5]` (down, length 3)
3. `[1, 17, 5, 10]` (up, length 4)
4. `[1, 17, 5, 10, 13]` - Wait! 10→13 is up, but last difference was also up (5→10). This breaks the alternation. We need to make a choice here.

The key insight: when we encounter a "flat" or non-alternating difference, we should keep the element that gives us the best chance for future alternation. For upward trends, keep the higher number; for downward trends, keep the lower number.

## Brute Force Approach

The brute force approach would be to generate all possible subsequences and check which ones are wiggle sequences. For each element, we have two choices: include it or exclude it. This gives us 2^n possible subsequences to check.

The checking process for each subsequence would involve:

1. Calculate differences between consecutive elements
2. Verify they strictly alternate between positive and negative
3. Track the maximum length found

This approach has exponential time complexity O(2^n \* n), which is completely impractical for arrays of any reasonable size. Even for n=20, we'd need to check over 1 million subsequences.

## Optimized Approach

The key insight is that we don't need to track all possible subsequences. At any point, we only care about two things:

1. The length of the longest wiggle sequence ending with an upward difference
2. The length of the longest wiggle sequence ending with a downward difference

We can use dynamic programming with two states:

- `up[i]`: longest wiggle subsequence length ending at index i with an upward difference
- `down[i]`: longest wiggle subsequence length ending at index i with a downward difference

For each new element `nums[i]`, we compare it with previous elements `nums[j]`:

- If `nums[i] > nums[j]`, we can extend a downward-ending sequence with an upward move
- If `nums[i] < nums[j]`, we can extend an upward-ending sequence with a downward move

But there's an even better greedy approach! We only need to track the peaks and valleys. Whenever the difference changes direction, we have a new peak or valley that extends our wiggle sequence. This gives us O(n) time with O(1) space.

## Optimal Solution

The greedy approach works because we only care about changes in direction. We can traverse the array once, tracking whether we're currently looking for an upward or downward move. When we find the appropriate move, we extend our sequence and flip what we're looking for.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def wiggleMaxLength(nums):
    """
    Find the length of the longest wiggle subsequence.

    A wiggle sequence alternates between increasing and decreasing differences.
    This solution uses a greedy approach that tracks peaks and valleys.
    """
    n = len(nums)

    # Edge cases: empty array or single element
    if n < 2:
        return n

    # Track the previous difference to determine direction
    prev_diff = nums[1] - nums[0]

    # If first two elements are different, we already have a sequence of length 2
    # If they're equal, we start with length 1 (just the first element)
    count = 2 if prev_diff != 0 else 1

    # Iterate through the array starting from the third element
    for i in range(2, n):
        # Calculate current difference
        curr_diff = nums[i] - nums[i - 1]

        # Check if we have a valid wiggle (alternating sign)
        # We need either:
        # 1. prev_diff was <= 0 and curr_diff > 0 (valley to peak)
        # 2. prev_diff was >= 0 and curr_diff < 0 (peak to valley)
        if (prev_diff <= 0 and curr_diff > 0) or (prev_diff >= 0 and curr_diff < 0):
            count += 1          # Extend our wiggle sequence
            prev_diff = curr_diff  # Update previous difference for next comparison

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function wiggleMaxLength(nums) {
  /**
   * Find the length of the longest wiggle subsequence.
   *
   * A wiggle sequence alternates between increasing and decreasing differences.
   * This solution uses a greedy approach that tracks peaks and valleys.
   */
  const n = nums.length;

  // Edge cases: empty array or single element
  if (n < 2) {
    return n;
  }

  // Track the previous difference to determine direction
  let prevDiff = nums[1] - nums[0];

  // If first two elements are different, we already have a sequence of length 2
  // If they're equal, we start with length 1 (just the first element)
  let count = prevDiff !== 0 ? 2 : 1;

  // Iterate through the array starting from the third element
  for (let i = 2; i < n; i++) {
    // Calculate current difference
    const currDiff = nums[i] - nums[i - 1];

    // Check if we have a valid wiggle (alternating sign)
    // We need either:
    // 1. prevDiff was <= 0 and currDiff > 0 (valley to peak)
    // 2. prevDiff was >= 0 and currDiff < 0 (peak to valley)
    if ((prevDiff <= 0 && currDiff > 0) || (prevDiff >= 0 && currDiff < 0)) {
      count++; // Extend our wiggle sequence
      prevDiff = currDiff; // Update previous difference for next comparison
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
public int wiggleMaxLength(int[] nums) {
    /**
     * Find the length of the longest wiggle subsequence.
     *
     * A wiggle sequence alternates between increasing and decreasing differences.
     * This solution uses a greedy approach that tracks peaks and valleys.
     */
    int n = nums.length;

    // Edge cases: empty array or single element
    if (n < 2) {
        return n;
    }

    // Track the previous difference to determine direction
    int prevDiff = nums[1] - nums[0];

    // If first two elements are different, we already have a sequence of length 2
    // If they're equal, we start with length 1 (just the first element)
    int count = prevDiff != 0 ? 2 : 1;

    // Iterate through the array starting from the third element
    for (int i = 2; i < n; i++) {
        // Calculate current difference
        int currDiff = nums[i] - nums[i - 1];

        // Check if we have a valid wiggle (alternating sign)
        // We need either:
        // 1. prevDiff was <= 0 and currDiff > 0 (valley to peak)
        // 2. prevDiff was >= 0 and currDiff < 0 (peak to valley)
        if ((prevDiff <= 0 && currDiff > 0) || (prevDiff >= 0 && currDiff < 0)) {
            count++;            // Extend our wiggle sequence
            prevDiff = currDiff; // Update previous difference for next comparison
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, comparing each element with its predecessor
- Each comparison and update takes constant time
- Total operations scale linearly with input size

**Space Complexity: O(1)**

- We only use a fixed number of variables regardless of input size
- No additional data structures that grow with input
- This is the optimal space complexity for this problem

## Common Mistakes

1. **Forgetting to handle equal consecutive elements**: When two consecutive elements are equal, they don't create a valid wiggle. The greedy solution handles this by only updating `prev_diff` when we actually extend the sequence.

2. **Incorrect initialization with first two elements**: If the first two elements are equal, we should start with count = 1, not 2. Many candidates miss this edge case.

3. **Using strict inequalities incorrectly**: The condition should be `(prev_diff <= 0 and curr_diff > 0)` not `(prev_diff < 0 and curr_diff > 0)`. This is because when `prev_diff = 0`, we're essentially starting fresh and can accept either direction.

4. **Overcomplicating with full DP**: While a DP solution with O(n²) time and O(n) space works, it's suboptimal. The greedy O(n) solution is simpler and more efficient.

## When You'll See This Pattern

The "peak and valley" or "local extremum" pattern appears in several optimization problems:

1. **Best Time to Buy and Sell Stock II** (Easy): You can buy and sell multiple times to maximize profit. The solution involves summing up all positive differences between consecutive days, which is similar to counting all upward moves.

2. **Monotonic Array** (Easy): Checking if an array is entirely non-increasing or non-decreasing uses similar comparison logic between consecutive elements.

3. **Longest Turbulent Subarray** (Medium): This is essentially the wiggle subsequence problem but for contiguous subarrays instead of subsequences.

The core pattern is tracking changes in direction or trend in a sequence, often allowing for greedy solutions when you only need to consider local decisions.

## Key Takeaways

1. **Greedy can beat DP for sequence problems**: When you only need to track the most recent state (like the last direction of movement), a greedy approach often works better than full dynamic programming.

2. **Peaks and valleys matter more than exact values**: For wiggle sequences, the exact values don't matter as much as whether we're moving up or down. This simplification leads to the O(1) space solution.

3. **Handle equality as a special case**: Many sequence problems have special handling for equal elements. Always test with arrays containing duplicates.

Related problems: [Rearrange Array Elements by Sign](/problem/rearrange-array-elements-by-sign)
