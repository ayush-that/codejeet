---
title: "How to Solve Longest Subarray of 1's After Deleting One Element — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Subarray of 1's After Deleting One Element. Medium difficulty, 71.1% acceptance rate. Topics: Array, Dynamic Programming, Sliding Window."
date: "2027-02-26"
category: "dsa-patterns"
tags:
  [
    "longest-subarray-of-1s-after-deleting-one-element",
    "array",
    "dynamic-programming",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Longest Subarray of 1's After Deleting One Element

You're given a binary array `nums` where you must delete exactly one element, then find the longest subarray containing only 1's in the resulting array. The challenge is that you're not actually modifying the array—you're finding the longest subarray that would exist if you could remove one element. This problem is interesting because it looks like a simple "max consecutive ones" problem, but the ability to delete one element (effectively skip one zero) adds complexity that requires careful window management.

## Visual Walkthrough

Let's trace through `nums = [1,1,0,1,1,0,1,1,1,0,1]` step by step:

We want to find the longest sequence of 1's where we're allowed to skip/delete one element (which must be a zero, since deleting a 1 would only hurt us).

**Key insight**: This is equivalent to finding the longest subarray containing at most one zero.

Let's track our window:

- Start with left = 0, right = 0, zeroCount = 0
- Move right pointer through the array:
  - `[1]`: zeroCount = 0, window length = 1
  - `[1,1]`: zeroCount = 0, window length = 2
  - `[1,1,0]`: zeroCount = 1, window length = 3 (valid since we can delete this zero)
  - `[1,1,0,1]`: zeroCount = 1, window length = 4
  - `[1,1,0,1,1]`: zeroCount = 1, window length = 5
  - `[1,1,0,1,1,0]`: zeroCount = 2 → invalid! Need to shrink window
    - Move left pointer: `[1,0,1,1,0]` (removed first 1)
    - Still zeroCount = 2, move left: `[0,1,1,0]` (removed another 1)
    - Still zeroCount = 2, move left: `[1,1,0]` (removed the zero) → zeroCount = 1, valid
  - Continue expanding...

The longest valid window we'll find is `[1,1,0,1,1]` (positions 0-4) or `[1,1,0,1,1,1]` (positions 6-11 if we skip the middle zero), both of length 5.

**Important**: Since we must delete exactly one element, our answer is `window length - 1` (we need to remove one element from our window).

## Brute Force Approach

A naive solution would try deleting each element one by one, then finding the longest consecutive 1's in the modified array:

1. For each index `i` from 0 to n-1:
   - Create a new array without element `i`
   - Find the longest consecutive sequence of 1's in this array
2. Return the maximum length found

This approach has O(n²) time complexity (O(n) deletions × O(n) scanning) and O(n) space for creating modified arrays. It's too slow for typical constraints (n up to 10⁵).

Even a slightly better brute force would still be O(n²): for each starting index, expand until you've seen two zeros, then record the length.

## Optimized Approach

The optimal solution uses a **sliding window** approach similar to "Max Consecutive Ones III" but with a fixed allowance of one zero. Here's the step-by-step reasoning:

1. **Problem Restatement**: We need the longest subarray with at most one zero (since we can delete one element).
2. **Window Invariant**: Maintain a window `[left, right]` that contains at most one zero.
3. **Expansion**: Move `right` pointer forward, counting zeros.
4. **Contraction**: When we encounter a second zero, move `left` pointer forward until we remove the first zero from our window.
5. **Result Calculation**: At each valid window, the potential answer is `(right - left)` (not `+1` because we need to delete one element from this window).

**Why this works**: The sliding window efficiently finds all valid subarrays with at most one zero in O(n) time. We're essentially finding the longest subarray where we could remove one element (the zero) to leave only 1's.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def longestSubarray(nums):
    """
    Find the longest subarray containing only 1's after deleting one element.

    Approach: Sliding window where window can contain at most one zero.
    The result is window length minus 1 (since we must delete one element).
    """
    left = 0          # Left pointer of sliding window
    zero_count = 0    # Number of zeros in current window
    max_length = 0    # Maximum window length found

    for right in range(len(nums)):
        # Expand window by including nums[right]
        if nums[right] == 0:
            zero_count += 1

        # Shrink window if it contains more than one zero
        while zero_count > 1:
            if nums[left] == 0:
                zero_count -= 1
            left += 1

        # Update max_length with current window size minus 1
        # We subtract 1 because we must delete one element from the window
        current_length = right - left  # Not +1 because we'll delete one element
        max_length = max(max_length, current_length)

    return max_length
```

```javascript
// Time: O(n) | Space: O(1)
function longestSubarray(nums) {
  /**
   * Find the longest subarray containing only 1's after deleting one element.
   *
   * Approach: Sliding window where window can contain at most one zero.
   * The result is window length minus 1 (since we must delete one element).
   */
  let left = 0; // Left pointer of sliding window
  let zeroCount = 0; // Number of zeros in current window
  let maxLength = 0; // Maximum window length found

  for (let right = 0; right < nums.length; right++) {
    // Expand window by including nums[right]
    if (nums[right] === 0) {
      zeroCount++;
    }

    // Shrink window if it contains more than one zero
    while (zeroCount > 1) {
      if (nums[left] === 0) {
        zeroCount--;
      }
      left++;
    }

    // Update maxLength with current window size minus 1
    // We subtract 1 because we must delete one element from the window
    const currentLength = right - left; // Not +1 because we'll delete one element
    maxLength = Math.max(maxLength, currentLength);
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int longestSubarray(int[] nums) {
        /**
         * Find the longest subarray containing only 1's after deleting one element.
         *
         * Approach: Sliding window where window can contain at most one zero.
         * The result is window length minus 1 (since we must delete one element).
         */
        int left = 0;          // Left pointer of sliding window
        int zeroCount = 0;     // Number of zeros in current window
        int maxLength = 0;     // Maximum window length found

        for (int right = 0; right < nums.length; right++) {
            // Expand window by including nums[right]
            if (nums[right] == 0) {
                zeroCount++;
            }

            // Shrink window if it contains more than one zero
            while (zeroCount > 1) {
                if (nums[left] == 0) {
                    zeroCount--;
                }
                left++;
            }

            // Update maxLength with current window size minus 1
            // We subtract 1 because we must delete one element from the window
            int currentLength = right - left;  // Not +1 because we'll delete one element
            maxLength = Math.max(maxLength, currentLength);
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n) where n is the length of `nums`. Each element is visited at most twice—once by the `right` pointer and once by the `left` pointer. The while loop inside doesn't make this O(n²) because `left` only moves forward and never backward.

**Space Complexity**: O(1). We only use a few integer variables regardless of input size. No additional data structures are needed.

## Common Mistakes

1. **Forgetting to subtract 1 from the window length**: The problem requires deleting exactly one element, so even if your window contains all 1's, you must remove one element. The answer should be `window length - 1`, not `window length`.

2. **Not handling all-ones arrays correctly**: For `nums = [1,1,1]`, the answer is 2 (delete the middle 1, leaving `[1,1]`). Some candidates return 3, forgetting they must delete one element.

3. **Using a fixed window size**: This isn't a fixed-size window problem. The window grows and shrinks dynamically based on zero count.

4. **Missing the edge case of no zeros**: When the array has no zeros, you still must delete one element, so the answer is `n - 1`. When it has no 1's, the answer is 0.

5. **Incorrect zero counting in window contraction**: When moving the left pointer, you must decrement `zero_count` only when the element being removed is actually a zero.

## When You'll See This Pattern

This sliding window pattern with a constraint on element counts appears in several problems:

1. **Max Consecutive Ones III** (LeetCode 1004): Almost identical—find the longest subarray with at most K zeros. This problem is the special case where K = 1.

2. **Longest Substring with At Most K Distinct Characters** (LeetCode 340): Similar window management but with character counts instead of zeros.

3. **Fruit Into Baskets** (LeetCode 904): Another variation where you can have at most 2 types of fruits (similar to at most 2 distinct values).

4. **Minimum Window Substring** (LeetCode 76): A more complex version where you need to contain all characters of a target string.

The pattern is: maintain a window that satisfies some constraint (max zeros, max distinct chars, contains all chars), expand when possible, contract when the constraint is violated.

## Key Takeaways

1. **Sliding window with count constraints**: When you need to find a subarray/substring with constraints on element frequencies (like "at most K zeros"), sliding window with frequency counting is often the optimal approach.

2. **The "delete one element" trick**: Many problems that ask "after deleting one element" are equivalent to "find subarray with at most one [problem element]". This transformation simplifies the problem.

3. **Window length vs result calculation**: Pay close attention to what the problem is actually asking for. Here, we track window length but subtract 1 in the result because of the deletion requirement.

4. **Two-pointer movement**: The left pointer moves only when necessary (constraint violated), ensuring O(n) time complexity. Each element is processed at most twice.

Related problems: [Max Consecutive Ones III](/problem/max-consecutive-ones-iii)
