---
title: "How to Solve Longest Strictly Increasing or Strictly Decreasing Subarray — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Longest Strictly Increasing or Strictly Decreasing Subarray. Easy difficulty, 64.9% acceptance rate. Topics: Array."
date: "2028-08-04"
category: "dsa-patterns"
tags: ["longest-strictly-increasing-or-strictly-decreasing-subarray", "array", "easy"]
---

# How to Solve Longest Strictly Increasing or Strictly Decreasing Subarray

This problem asks us to find the longest contiguous subarray where elements are either strictly increasing (each number larger than the previous) or strictly decreasing (each number smaller than the previous). While the problem is labeled "Easy," it's interesting because it requires careful handling of two different conditions simultaneously and managing transitions between increasing and decreasing sequences. The tricky part is that we need to track both directions at once while ensuring we don't miss the longest possible subarray.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 4, 2, 5, 7, 3, 2, 1]`

We'll walk through the array while tracking:

- Current increasing streak length
- Current decreasing streak length
- Maximum length found so far

**Step-by-step tracking:**

1. Start at index 0: `1`
   - No previous element, so both increasing and decreasing streaks = 1
   - Max length = 1

2. Index 1: `4` (compare to previous `1`)
   - `4 > 1`, so increasing streak continues: inc = 2, dec = 1
   - Max length = max(1, 2) = 2

3. Index 2: `2` (compare to previous `4`)
   - `2 < 4`, so decreasing streak continues: dec = 2, inc = 1
   - Max length = max(2, 2) = 2

4. Index 3: `5` (compare to previous `2`)
   - `5 > 2`, so increasing streak continues: inc = 2, dec = 1
   - Max length = 2

5. Index 4: `7` (compare to previous `5`)
   - `7 > 5`, so increasing streak continues: inc = 3, dec = 1
   - Max length = max(2, 3) = 3

6. Index 5: `3` (compare to previous `7`)
   - `3 < 7`, so decreasing streak continues: dec = 2, inc = 1
   - Max length = 3

7. Index 6: `2` (compare to previous `3`)
   - `2 < 3`, so decreasing streak continues: dec = 3, inc = 1
   - Max length = max(3, 3) = 3

8. Index 7: `1` (compare to previous `2`)
   - `1 < 2`, so decreasing streak continues: dec = 4, inc = 1
   - Max length = max(3, 4) = 4

The longest strictly increasing or decreasing subarray is `[7, 3, 2, 1]` with length 4.

## Brute Force Approach

A naive approach would check every possible subarray to see if it's strictly increasing or strictly decreasing. For each starting index `i` and ending index `j` (where `j ≥ i`), we would:

1. Check if `nums[i...j]` is strictly increasing
2. Check if `nums[i...j]` is strictly decreasing
3. Track the maximum length where either condition is true

This approach has O(n³) time complexity because:

- There are O(n²) subarrays to check
- Checking each subarray takes O(n) time in the worst case

The brute force is clearly inefficient for larger arrays. Even for n=1000, we'd need to check about 500,000 subarrays, and checking each could take up to 1000 operations, resulting in 500 million operations.

## Optimal Solution

The optimal solution uses a single pass through the array while tracking two counters:

- `inc_len`: length of current strictly increasing streak
- `dec_len`: length of current strictly decreasing streak

At each position, we compare the current element with the previous one:

- If current > previous: we're in an increasing streak
- If current < previous: we're in a decreasing streak
- If current == previous: both streaks reset (since neither strictly increasing nor decreasing)

We update both counters at each step and track the maximum value seen.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def longestMonotonicSubarray(nums):
    """
    Find the longest subarray that is either strictly increasing or strictly decreasing.

    Args:
        nums: List of integers

    Returns:
        Length of the longest monotonic (strictly increasing or decreasing) subarray
    """
    # Edge case: empty array or single element
    if not nums:
        return 0
    if len(nums) == 1:
        return 1

    # Initialize counters
    inc_len = 1  # Length of current increasing streak
    dec_len = 1  # Length of current decreasing streak
    max_len = 1  # Maximum length found so far

    # Iterate through the array starting from the second element
    for i in range(1, len(nums)):
        if nums[i] > nums[i-1]:
            # Current element is greater than previous: increasing streak continues
            inc_len += 1
            # Decreasing streak resets to 1 (current element alone)
            dec_len = 1
        elif nums[i] < nums[i-1]:
            # Current element is smaller than previous: decreasing streak continues
            dec_len += 1
            # Increasing streak resets to 1 (current element alone)
            inc_len = 1
        else:
            # Current element equals previous: both streaks reset
            # Neither strictly increasing nor decreasing can continue
            inc_len = 1
            dec_len = 1

        # Update maximum length with the longer of the two current streaks
        max_len = max(max_len, inc_len, dec_len)

    return max_len
```

```javascript
// Time: O(n) | Space: O(1)
function longestMonotonicSubarray(nums) {
  /**
   * Find the longest subarray that is either strictly increasing or strictly decreasing.
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Length of the longest monotonic subarray
   */
  // Edge case: empty array or single element
  if (!nums || nums.length === 0) return 0;
  if (nums.length === 1) return 1;

  // Initialize counters
  let incLen = 1; // Length of current increasing streak
  let decLen = 1; // Length of current decreasing streak
  let maxLen = 1; // Maximum length found so far

  // Iterate through the array starting from the second element
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      // Current element is greater than previous: increasing streak continues
      incLen++;
      // Decreasing streak resets to 1 (current element alone)
      decLen = 1;
    } else if (nums[i] < nums[i - 1]) {
      // Current element is smaller than previous: decreasing streak continues
      decLen++;
      // Increasing streak resets to 1 (current element alone)
      incLen = 1;
    } else {
      // Current element equals previous: both streaks reset
      // Neither strictly increasing nor decreasing can continue
      incLen = 1;
      decLen = 1;
    }

    // Update maximum length with the longer of the two current streaks
    maxLen = Math.max(maxLen, incLen, decLen);
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int longestMonotonicSubarray(int[] nums) {
        /**
         * Find the longest subarray that is either strictly increasing or strictly decreasing.
         *
         * @param nums Array of integers
         * @return Length of the longest monotonic subarray
         */
        // Edge case: empty array or single element
        if (nums == null || nums.length == 0) return 0;
        if (nums.length == 1) return 1;

        // Initialize counters
        int incLen = 1;  // Length of current increasing streak
        int decLen = 1;  // Length of current decreasing streak
        int maxLen = 1;  // Maximum length found so far

        // Iterate through the array starting from the second element
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > nums[i-1]) {
                // Current element is greater than previous: increasing streak continues
                incLen++;
                // Decreasing streak resets to 1 (current element alone)
                decLen = 1;
            } else if (nums[i] < nums[i-1]) {
                // Current element is smaller than previous: decreasing streak continues
                decLen++;
                // Increasing streak resets to 1 (current element alone)
                incLen = 1;
            } else {
                // Current element equals previous: both streaks reset
                // Neither strictly increasing nor decreasing can continue
                incLen = 1;
                decLen = 1;
            }

            // Update maximum length with the longer of the two current streaks
            maxLen = Math.max(maxLen, Math.max(incLen, decLen));
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, visiting each element exactly once
- At each element, we perform constant-time operations (comparisons and updates)
- This gives us O(n) time complexity where n is the length of the input array

**Space Complexity: O(1)**

- We only use a fixed number of integer variables (inc_len, dec_len, max_len)
- No additional data structures that grow with input size
- This gives us O(1) auxiliary space complexity

## Common Mistakes

1. **Forgetting to handle equal elements correctly**: When `nums[i] == nums[i-1]`, both increasing and decreasing streaks must reset to 1. Some candidates only reset one counter or try to continue the streak, which violates the "strictly" increasing/decreasing requirement.

2. **Starting counters at 0 instead of 1**: Each element by itself forms a valid subarray of length 1. Starting counters at 0 would undercount single-element subarrays and fail for arrays where the longest monotonic subarray has length 1.

3. **Not updating max_len at each step**: Some candidates only update max_len when a streak ends, but the longest streak might be the current one that hasn't ended yet. We need to check after processing each element.

4. **Confusing subarray with subsequence**: This problem asks for contiguous subarrays, not subsequences (which don't need to be contiguous). The sliding window/two-pointer approach works for contiguous subarrays but wouldn't work for subsequences.

## When You'll See This Pattern

This "streak counting" or "run length encoding" pattern appears in many array problems:

1. **Maximum Subarray (Kadane's Algorithm)**: Similar idea of tracking a running count and resetting when beneficial, though Kadane's algorithm handles sums rather than monotonic sequences.

2. **Longest Turbulent Subarray (LeetCode 978)**: A more complex version where the pattern alternates between increasing and decreasing. The same streak-tracking approach applies but with different reset conditions.

3. **Max Consecutive Ones (LeetCode 485)**: Simpler version tracking consecutive identical elements rather than monotonic sequences.

4. **Best Time to Buy and Sell Stock (LeetCode 121)**: While not identical, it involves tracking increasing sequences in prices to find maximum profit.

## Key Takeaways

1. **Single-pass streak tracking**: When looking for the longest contiguous sequence satisfying some condition, often you can solve it in O(n) time by tracking the current streak length and resetting when the condition breaks.

2. **Dual counters for dual conditions**: When a problem asks for the maximum of two different patterns (increasing OR decreasing), maintain separate counters for each pattern and update them independently based on the current relationship between elements.

3. **Reset logic is critical**: The most important part of streak-tracking problems is correctly determining when to reset counters. Always test edge cases with equal elements and single-element arrays.

[Practice this problem on CodeJeet](/problem/longest-strictly-increasing-or-strictly-decreasing-subarray)
