---
title: "How to Solve Max Consecutive Ones III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Max Consecutive Ones III. Medium difficulty, 67.3% acceptance rate. Topics: Array, Binary Search, Sliding Window, Prefix Sum."
date: "2026-08-12"
category: "dsa-patterns"
tags: ["max-consecutive-ones-iii", "array", "binary-search", "sliding-window", "medium"]
---

# How to Solve Max Consecutive Ones III

This problem asks: given a binary array (containing only 0s and 1s) and an integer `k`, what's the longest sequence of consecutive 1s we can create by flipping at most `k` zeros to ones? The challenge is that we need to find this maximum length efficiently without actually modifying the array. What makes this interesting is that it's not just about counting consecutive 1s—we can strategically "borrow" zeros to extend our streak, but only up to `k` of them.

## Visual Walkthrough

Let's trace through an example: `nums = [1,1,1,0,0,1,1,0,1,1,1]` with `k = 2`.

We want to find the longest window (contiguous subarray) that contains at most `k` zeros. When we flip those zeros to ones, the entire window becomes consecutive 1s.

**Step-by-step sliding window approach:**

1. Start with left = 0, right = 0, zeroCount = 0, maxLength = 0
2. Expand right pointer: [1] → zeroCount = 0, length = 1
3. Expand: [1,1] → zeroCount = 0, length = 2
4. Expand: [1,1,1] → zeroCount = 0, length = 3
5. Expand: [1,1,1,0] → zeroCount = 1, length = 4 (still ≤ k=2)
6. Expand: [1,1,1,0,0] → zeroCount = 2, length = 5 (still ≤ k=2)
7. Expand: [1,1,1,0,0,1] → zeroCount = 2, length = 6 (still ≤ k=2)
8. Expand: [1,1,1,0,0,1,1] → zeroCount = 2, length = 7 (still ≤ k=2)
9. Expand: [1,1,1,0,0,1,1,0] → zeroCount = 3 (now > k=2!)
   - We need to shrink from left until zeroCount ≤ k
   - Move left from 0 to 1: window becomes [1,1,0,0,1,1,0], zeroCount still 3
   - Move left to 2: [1,0,0,1,1,0], zeroCount still 3
   - Move left to 3: [0,0,1,1,0], zeroCount still 3
   - Move left to 4: [0,1,1,0], zeroCount = 3
   - Move left to 5: [1,1,0], zeroCount = 2 (now ≤ k)
   - Current length = 3, maxLength remains 7
10. Continue expanding right... and so on

The maximum window we found was length 7 (indices 0-6: [1,1,1,0,0,1,1]), which contains exactly 2 zeros that we can flip.

## Brute Force Approach

A naive approach would be to check every possible subarray. For each starting index `i`, we would:

1. Initialize a counter for zeros encountered
2. Expand `j` from `i` to the end of array
3. For each new element at `j`, if it's 0, increment zero counter
4. If zero counter exceeds `k`, stop expanding and record the length
5. Track the maximum length across all subarrays

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def longestOnes_brute(nums, k):
    max_length = 0
    n = len(nums)

    # Try every possible starting point
    for left in range(n):
        zero_count = 0

        # Expand right pointer from left to end
        for right in range(left, n):
            if nums[right] == 0:
                zero_count += 1

            # If we've used more than k flips, this window is invalid
            if zero_count > k:
                break

            # Update max length if current window is longer
            current_length = right - left + 1
            max_length = max(max_length, current_length)

    return max_length
```

```javascript
// Time: O(n²) | Space: O(1)
function longestOnesBrute(nums, k) {
  let maxLength = 0;
  const n = nums.length;

  // Try every possible starting point
  for (let left = 0; left < n; left++) {
    let zeroCount = 0;

    // Expand right pointer from left to end
    for (let right = left; right < n; right++) {
      if (nums[right] === 0) {
        zeroCount++;
      }

      // If we've used more than k flips, this window is invalid
      if (zeroCount > k) {
        break;
      }

      // Update max length if current window is longer
      const currentLength = right - left + 1;
      maxLength = Math.max(maxLength, currentLength);
    }
  }

  return maxLength;
}
```

```java
// Time: O(n²) | Space: O(1)
public int longestOnesBrute(int[] nums, int k) {
    int maxLength = 0;
    int n = nums.length;

    // Try every possible starting point
    for (int left = 0; left < n; left++) {
        int zeroCount = 0;

        // Expand right pointer from left to end
        for (int right = left; right < n; right++) {
            if (nums[right] == 0) {
                zeroCount++;
            }

            // If we've used more than k flips, this window is invalid
            if (zeroCount > k) {
                break;
            }

            // Update max length if current window is longer
            int currentLength = right - left + 1;
            maxLength = Math.max(maxLength, currentLength);
        }
    }

    return maxLength;
}
```

</div>

**Why this is inefficient:** With nested loops, this runs in O(n²) time. For an array of length 10⁵ (common in LeetCode), this would be 10¹⁰ operations—far too slow. We need a solution that runs in O(n) time.

## Optimized Approach

The key insight is that we can use a **sliding window** approach. Instead of checking every possible subarray, we maintain a window that always contains at most `k` zeros. Here's the reasoning:

1. **Expand the window** by moving the right pointer forward
2. **Count zeros** as we encounter them
3. **When we have more than k zeros**, shrink the window from the left until we're back to ≤ k zeros
4. **Track the maximum window size** throughout the process

Why does this work? Because we're looking for the _maximum_ window, we never need to shrink the left pointer unless we absolutely have to (when zero count exceeds k). This ensures we explore all valid windows efficiently.

Think of it this way: for each position of the right pointer, we find the smallest left pointer such that the window [left, right] contains ≤ k zeros. This gives us the longest valid window ending at position `right`.

## Optimal Solution

Here's the O(n) sliding window solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def longestOnes(nums, k):
    """
    Find the maximum number of consecutive 1s by flipping at most k zeros.

    Args:
        nums: List[int] - Binary array containing only 0s and 1s
        k: int - Maximum number of zeros that can be flipped

    Returns:
        int - Maximum length of consecutive 1s achievable
    """
    left = 0          # Left pointer of our sliding window
    zero_count = 0    # Number of zeros in current window
    max_length = 0    # Track the maximum window size found

    # Expand the window by moving right pointer through the array
    for right in range(len(nums)):
        # If current element is 0, increment our zero count
        if nums[right] == 0:
            zero_count += 1

        # If we have more than k zeros, we need to shrink the window
        # from the left until we're back to ≤ k zeros
        while zero_count > k:
            # If the element leaving the window is 0, decrement zero count
            if nums[left] == 0:
                zero_count -= 1
            # Move left pointer to shrink the window
            left += 1

        # Update max_length with current window size
        # Window size = right - left + 1
        current_length = right - left + 1
        max_length = max(max_length, current_length)

    return max_length
```

```javascript
// Time: O(n) | Space: O(1)
function longestOnes(nums, k) {
  /**
   * Find the maximum number of consecutive 1s by flipping at most k zeros.
   *
   * @param {number[]} nums - Binary array containing only 0s and 1s
   * @param {number} k - Maximum number of zeros that can be flipped
   * @return {number} - Maximum length of consecutive 1s achievable
   */
  let left = 0; // Left pointer of our sliding window
  let zeroCount = 0; // Number of zeros in current window
  let maxLength = 0; // Track the maximum window size found

  // Expand the window by moving right pointer through the array
  for (let right = 0; right < nums.length; right++) {
    // If current element is 0, increment our zero count
    if (nums[right] === 0) {
      zeroCount++;
    }

    // If we have more than k zeros, we need to shrink the window
    // from the left until we're back to ≤ k zeros
    while (zeroCount > k) {
      // If the element leaving the window is 0, decrement zero count
      if (nums[left] === 0) {
        zeroCount--;
      }
      // Move left pointer to shrink the window
      left++;
    }

    // Update maxLength with current window size
    // Window size = right - left + 1
    const currentLength = right - left + 1;
    maxLength = Math.max(maxLength, currentLength);
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(1)
public int longestOnes(int[] nums, int k) {
    /**
     * Find the maximum number of consecutive 1s by flipping at most k zeros.
     *
     * @param nums - Binary array containing only 0s and 1s
     * @param k - Maximum number of zeros that can be flipped
     * @return - Maximum length of consecutive 1s achievable
     */
    int left = 0;          // Left pointer of our sliding window
    int zeroCount = 0;     // Number of zeros in current window
    int maxLength = 0;     // Track the maximum window size found

    // Expand the window by moving right pointer through the array
    for (int right = 0; right < nums.length; right++) {
        // If current element is 0, increment our zero count
        if (nums[right] == 0) {
            zeroCount++;
        }

        // If we have more than k zeros, we need to shrink the window
        // from the left until we're back to ≤ k zeros
        while (zeroCount > k) {
            // If the element leaving the window is 0, decrement zero count
            if (nums[left] == 0) {
                zeroCount--;
            }
            // Move left pointer to shrink the window
            left++;
        }

        // Update maxLength with current window size
        // Window size = right - left + 1
        int currentLength = right - left + 1;
        maxLength = Math.max(maxLength, currentLength);
    }

    return maxLength;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- The right pointer traverses the entire array once: O(n)
- The left pointer also traverses the entire array at most once: O(n)
- Each element is processed at most twice (once by right, once by left)
- Total operations: O(2n) = O(n)

**Space Complexity: O(1)**

- We only use a few integer variables (left, right, zeroCount, maxLength)
- No additional data structures that scale with input size

## Common Mistakes

1. **Using if instead of while when shrinking the window**: Some candidates write `if (zeroCount > k)` instead of `while (zeroCount > k)`. This is wrong because removing one element from the left might not be enough to bring zeroCount ≤ k. We need to keep shrinking until the condition is satisfied.

2. **Forgetting to update maxLength when window shrinks**: Even when we shrink the window, we should still check if the current (smaller) window is the longest we've seen. The maximum might occur after shrinking.

3. **Incorrect zero count management**: When the left pointer moves, you must check if the element leaving the window is a 0 before decrementing zeroCount. A common error is to always decrement zeroCount when moving left.

4. **Off-by-one errors in window length calculation**: Remember that window length = right - left + 1, not right - left. This mistake gives answers that are off by 1.

## When You'll See This Pattern

The sliding window pattern with a "constraint counter" (like our zeroCount) appears in many problems where you need to find the longest subarray satisfying some condition about element frequencies:

1. **Longest Substring with At Most K Distinct Characters** (LeetCode 340): Instead of counting zeros, count distinct characters. The pattern is identical: expand right, track character counts, shrink left when we have more than k distinct characters.

2. **Longest Repeating Character Replacement** (LeetCode 424): Similar concept but with a twist—you can replace any character, not just zeros. The constraint is (window length - max frequency of any character) ≤ k.

3. **Fruit Into Baskets** (LeetCode 904): Essentially the same as "at most K distinct characters" with k=2.

4. **Minimum Size Subarray Sum** (LeetCode 209): A variation where you're looking for the _minimum_ window that satisfies a sum condition, but uses the same two-pointer sliding window technique.

## Key Takeaways

1. **Sliding window is ideal for "longest subarray with constraint" problems**: When you need to find the longest contiguous subarray satisfying some condition (like "at most k zeros"), think sliding window.

2. **The pattern: expand right, track constraint, shrink left when needed**: Maintain a window that always satisfies the constraint. Expand with the right pointer, and only shrink the left side when the constraint is violated.

3. **This is an "at most k" problem, not "exactly k"**: We can use up to k flips, which means windows with fewer than k zeros are also valid. This is why we track "≤ k" not "= k".

Related problems: [Longest Substring with At Most K Distinct Characters](/problem/longest-substring-with-at-most-k-distinct-characters), [Longest Repeating Character Replacement](/problem/longest-repeating-character-replacement), [Max Consecutive Ones](/problem/max-consecutive-ones)
