---
title: "How to Solve Longest Continuous Increasing Subsequence — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Longest Continuous Increasing Subsequence. Easy difficulty, 51.8% acceptance rate. Topics: Array."
date: "2027-10-15"
category: "dsa-patterns"
tags: ["longest-continuous-increasing-subsequence", "array", "easy"]
---

# How to Solve Longest Continuous Increasing Subsequence

This problem asks us to find the length of the longest strictly increasing contiguous subarray in an unsorted integer array. While it's categorized as "Easy," the challenge lies in efficiently tracking increasing sequences without using extra space for storing all possible subarrays. The key insight is recognizing that we only need to compare adjacent elements and maintain a running count.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 3, 5, 4, 7]`

We'll maintain two variables:

- `current_length`: tracks the length of the current increasing sequence
- `max_length`: tracks the longest increasing sequence found so far

**Step 1:** Start with `nums[0] = 1`

- Initialize: `current_length = 1`, `max_length = 1`

**Step 2:** Compare `nums[1] = 3` with `nums[0] = 1`

- `3 > 1` ✓ (increasing)
- `current_length = 2` (extend current sequence)
- `max_length = max(1, 2) = 2`

**Step 3:** Compare `nums[2] = 5` with `nums[1] = 3`

- `5 > 3` ✓ (increasing)
- `current_length = 3`
- `max_length = max(2, 3) = 3`

**Step 4:** Compare `nums[3] = 4` with `nums[2] = 5`

- `4 > 5` ✗ (NOT increasing)
- Reset `current_length = 1` (start new sequence at index 3)
- `max_length` stays at 3

**Step 5:** Compare `nums[4] = 7` with `nums[3] = 4`

- `7 > 4` ✓ (increasing)
- `current_length = 2`
- `max_length = max(3, 2) = 3`

**Result:** The longest continuous increasing subsequence is `[1, 3, 5]` with length 3.

## Brute Force Approach

A naive approach would check every possible subarray to see if it's strictly increasing:

1. Generate all possible subarrays (O(n²) subarrays)
2. For each subarray, verify it's strictly increasing (O(n) check per subarray)
3. Track the maximum length of valid subarrays

This results in O(n³) time complexity, which is far too slow for typical constraints (arrays up to 10⁴ elements). Even with some optimizations, the brute force would still be O(n²), which is unnecessary when we can solve it in O(n).

The key realization is that we don't need to check all subarrays independently. If we know a sequence breaks at index `i`, we can immediately start a new sequence from `i` without going back to check sequences starting at earlier indices.

## Optimal Solution

The optimal solution uses a single pass through the array with O(1) extra space. We maintain a running count of the current increasing sequence and update the maximum whenever we find a longer one.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findLengthOfLCIS(nums):
    """
    Find the length of the longest continuous increasing subsequence.

    Args:
        nums: List of integers

    Returns:
        Integer length of longest continuous increasing subsequence
    """
    # Edge case: empty array
    if not nums:
        return 0

    # Initialize counters
    max_length = 1  # Minimum length is 1 (single element)
    current_length = 1  # Start counting from first element

    # Iterate through array starting from second element
    for i in range(1, len(nums)):
        # Check if current element continues the increasing sequence
        if nums[i] > nums[i - 1]:
            # Extend current sequence
            current_length += 1
            # Update max if current sequence is longer
            max_length = max(max_length, current_length)
        else:
            # Sequence broken, reset counter
            current_length = 1

    return max_length
```

```javascript
// Time: O(n) | Space: O(1)
function findLengthOfLCIS(nums) {
  /**
   * Find the length of the longest continuous increasing subsequence.
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Length of longest continuous increasing subsequence
   */

  // Edge case: empty array
  if (nums.length === 0) {
    return 0;
  }

  // Initialize counters
  let maxLength = 1; // Minimum length is 1 (single element)
  let currentLength = 1; // Start counting from first element

  // Iterate through array starting from second element
  for (let i = 1; i < nums.length; i++) {
    // Check if current element continues the increasing sequence
    if (nums[i] > nums[i - 1]) {
      // Extend current sequence
      currentLength++;
      // Update max if current sequence is longer
      maxLength = Math.max(maxLength, currentLength);
    } else {
      // Sequence broken, reset counter
      currentLength = 1;
    }
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int findLengthOfLCIS(int[] nums) {
        /**
         * Find the length of the longest continuous increasing subsequence.
         *
         * @param nums Array of integers
         * @return Length of longest continuous increasing subsequence
         */

        // Edge case: empty array
        if (nums.length == 0) {
            return 0;
        }

        // Initialize counters
        int maxLength = 1;  // Minimum length is 1 (single element)
        int currentLength = 1;  // Start counting from first element

        // Iterate through array starting from second element
        for (int i = 1; i < nums.length; i++) {
            // Check if current element continues the increasing sequence
            if (nums[i] > nums[i - 1]) {
                // Extend current sequence
                currentLength++;
                // Update max if current sequence is longer
                maxLength = Math.max(maxLength, currentLength);
            } else {
                // Sequence broken, reset counter
                currentLength = 1;
            }
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, comparing each element with its predecessor exactly once
- Each iteration performs O(1) operations (comparison, increment, max calculation)
- Total operations: n-1 comparisons for an array of length n

**Space Complexity: O(1)**

- We only use a constant amount of extra space (two integer variables)
- No additional data structures that grow with input size
- The input array is not modified

## Common Mistakes

1. **Forgetting the empty array edge case**: Always check if `nums` is empty and return 0. Without this check, accessing `nums[0]` would cause an index error.

2. **Starting the loop at index 0 instead of 1**: If you start at index 0, you'll compare `nums[0]` with `nums[-1]` (which doesn't exist) or need special handling for the first element.

3. **Using ≤ instead of < for comparison**: The problem specifies "strictly increasing," so we need `nums[i] > nums[i-1]`, not `nums[i] >= nums[i-1]`. Using `>=` would incorrectly count equal elements as part of the sequence.

4. **Not resetting current_length properly**: When the sequence breaks, you must reset `current_length = 1` (not 0) because the current element itself starts a new sequence of length 1.

5. **Initializing max_length to 0 instead of 1**: For non-empty arrays, the minimum possible answer is 1 (a single element). Initializing to 0 would fail for arrays like `[1]` or `[2, 1]`.

## When You'll See This Pattern

This "running counter with reset" pattern appears in many sequence analysis problems:

1. **Consecutive Characters (LeetCode 1446)**: Find the maximum length of a non-empty substring containing only one unique character. Same pattern: count consecutive identical characters and reset when the character changes.

2. **Maximum Subarray (LeetCode 53)**: While not identical, it uses a similar "carry forward or reset" logic with Kadane's algorithm, where you either extend the current subarray or start a new one.

3. **Max Consecutive Ones (LeetCode 485)**: Count consecutive 1s in a binary array, resetting to 0 when you encounter a 0.

4. **Longest Turbulent Subarray (LeetCode 978)**: A variation where the comparison alternates between > and <, but still uses the same reset mechanism.

The core pattern is: **traverse the array once, maintain a running count of some property, reset when the property no longer holds, and track the maximum count seen.**

## Key Takeaways

1. **Single pass is often enough for sequence problems**: When you need to find the longest contiguous segment with some property, you usually don't need nested loops. A single pass with a running counter suffices.

2. **Reset logic is crucial**: The pattern of "extend if condition holds, reset otherwise" appears in many problems. Pay attention to what value to reset to (often 1, not 0, because the current element starts a new sequence).

3. **Edge cases matter**: Always consider empty arrays, single-element arrays, and arrays where the entire sequence satisfies the condition. Test with `[]`, `[1]`, `[1,2,3,4]`, and `[3,2,1]`.

4. **Initialize carefully**: Choose initial values that make sense for the smallest valid input. For this problem, `max_length = 1` handles the single-element case correctly.

Related problems: [Number of Longest Increasing Subsequence](/problem/number-of-longest-increasing-subsequence), [Minimum Window Subsequence](/problem/minimum-window-subsequence), [Consecutive Characters](/problem/consecutive-characters)
