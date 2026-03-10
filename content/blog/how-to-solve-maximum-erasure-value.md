---
title: "How to Solve Maximum Erasure Value — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Erasure Value. Medium difficulty, 64.1% acceptance rate. Topics: Array, Hash Table, Sliding Window."
date: "2028-01-23"
category: "dsa-patterns"
tags: ["maximum-erasure-value", "array", "hash-table", "sliding-window", "medium"]
---

# How to Solve Maximum Erasure Value

This problem asks us to find the maximum sum of a contiguous subarray where all elements are unique. While it sounds similar to finding the maximum sum subarray (Kadane's algorithm), the uniqueness constraint adds complexity. The interesting challenge is maintaining a sliding window of unique elements while efficiently tracking both the window's sum and its element uniqueness.

## Visual Walkthrough

Let's trace through an example: `nums = [4, 2, 4, 5, 6]`

**Step 1:** Start with an empty window, sum = 0, max_sum = 0

- Add `4`: window = [4], sum = 4, max_sum = 4

**Step 2:** Add `2`: window = [4, 2], sum = 6, max_sum = 6

- Both elements are unique, so we keep expanding

**Step 3:** Try to add `4`: window = [4, 2, 4]

- We have a duplicate `4`! We need to remove elements from the left until the duplicate is gone
- Remove `4` from left: window = [2, 4], sum = 6 (was 6, removed 4, added 4)
- max_sum = 6 (unchanged)

**Step 4:** Add `5`: window = [2, 4, 5], sum = 11, max_sum = 11

**Step 5:** Add `6`: window = [2, 4, 5, 6], sum = 17, max_sum = 17

The maximum sum is 17 from the subarray [2, 4, 5, 6].

## Brute Force Approach

A naive approach would check every possible subarray and verify if all its elements are unique:

1. Generate all possible subarrays (O(n²) subarrays)
2. For each subarray, check if all elements are unique (O(n) with a hash set)
3. Calculate the sum if unique (O(n))
4. Track the maximum sum found

This results in O(n³) time complexity, which is far too slow for typical constraints (n up to 10⁵). Even with optimizations like prefix sums to calculate sums in O(1), we still have O(n²) time to check all subarrays, which is insufficient.

## Optimized Approach

The key insight is that this is a **sliding window** problem with a uniqueness constraint. We can maintain:

1. A **hash map/dictionary** to track the last seen index of each element
2. A **left pointer** marking the start of our current valid window
3. A **running sum** of the current window

When we encounter a duplicate:

1. The duplicate's last occurrence tells us where our window must start to remain valid
2. We need to remove all elements from our window sum that come before the new left boundary
3. We update the left pointer to be one position after the duplicate's last occurrence

This approach gives us O(n) time complexity since each element is processed at most twice (added once, potentially removed once).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(min(n, k)) where k is the number of unique elements
def maximumUniqueSubarray(nums):
    """
    Find the maximum sum of a subarray with all unique elements.

    Approach: Sliding window with hash map to track last seen indices.
    We maintain a window [left, right] where all elements are unique.
    """
    # Dictionary to store the last index where each number was seen
    last_seen = {}

    # Left pointer of our sliding window
    left = 0

    # Current window sum and maximum sum found
    current_sum = 0
    max_sum = 0

    # Expand the window by moving right pointer
    for right in range(len(nums)):
        num = nums[right]

        # If we've seen this number before within our current window
        if num in last_seen and last_seen[num] >= left:
            # We need to shrink the window from the left
            # Remove all elements from left up to the duplicate's last position
            while left <= last_seen[num]:
                current_sum -= nums[left]
                left += 1

        # Add the current number to our window sum
        current_sum += num

        # Update the last seen index for this number
        last_seen[num] = right

        # Update maximum sum if current window sum is larger
        max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n) | Space: O(min(n, k)) where k is the number of unique elements
function maximumUniqueSubarray(nums) {
  /**
   * Find the maximum sum of a subarray with all unique elements.
   *
   * Approach: Sliding window with hash map to track last seen indices.
   * We maintain a window [left, right] where all elements are unique.
   */

  // Map to store the last index where each number was seen
  const lastSeen = new Map();

  // Left pointer of our sliding window
  let left = 0;

  // Current window sum and maximum sum found
  let currentSum = 0;
  let maxSum = 0;

  // Expand the window by moving right pointer
  for (let right = 0; right < nums.length; right++) {
    const num = nums[right];

    // If we've seen this number before within our current window
    if (lastSeen.has(num) && lastSeen.get(num) >= left) {
      // We need to shrink the window from the left
      // Remove all elements from left up to the duplicate's last position
      while (left <= lastSeen.get(num)) {
        currentSum -= nums[left];
        left++;
      }
    }

    // Add the current number to our window sum
    currentSum += num;

    // Update the last seen index for this number
    lastSeen.set(num, right);

    // Update maximum sum if current window sum is larger
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
```

```java
// Time: O(n) | Space: O(min(n, k)) where k is the number of unique elements
class Solution {
    public int maximumUniqueSubarray(int[] nums) {
        /**
         * Find the maximum sum of a subarray with all unique elements.
         *
         * Approach: Sliding window with hash map to track last seen indices.
         * We maintain a window [left, right] where all elements are unique.
         */

        // Map to store the last index where each number was seen
        Map<Integer, Integer> lastSeen = new HashMap<>();

        // Left pointer of our sliding window
        int left = 0;

        // Current window sum and maximum sum found
        int currentSum = 0;
        int maxSum = 0;

        // Expand the window by moving right pointer
        for (int right = 0; right < nums.length; right++) {
            int num = nums[right];

            // If we've seen this number before within our current window
            if (lastSeen.containsKey(num) && lastSeen.get(num) >= left) {
                // We need to shrink the window from the left
                // Remove all elements from left up to the duplicate's last position
                while (left <= lastSeen.get(num)) {
                    currentSum -= nums[left];
                    left++;
                }
            }

            // Add the current number to our window sum
            currentSum += num;

            // Update the last seen index for this number
            lastSeen.put(num, right);

            // Update maximum sum if current window sum is larger
            maxSum = Math.max(maxSum, currentSum);
        }

        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once with the right pointer (O(n))
- Each element is added to the window sum exactly once
- Each element is removed from the window sum at most once (when we encounter a duplicate)
- The while loop for removing elements doesn't make this O(n²) because each element is removed at most once across the entire algorithm

**Space Complexity: O(min(n, k))**

- We store at most one entry per unique element in the hash map
- In the worst case (all elements unique), we store n entries
- In practice, k is often much smaller than n, especially with integer constraints

## Common Mistakes

1. **Forgetting to check if duplicate is within current window**: Just checking `num in last_seen` isn't enough. The duplicate might be from a previous window that we've already moved past. Always check `last_seen[num] >= left`.

2. **Incorrectly updating the window sum**: When removing elements, you must subtract them from `current_sum` in the correct order. A common error is trying to calculate `current_sum` from scratch each time, which makes the solution O(n²).

3. **Using a set instead of a map**: A set can tell you if an element exists, but not where it was last seen. You need the index to know how far to move the left pointer.

4. **Off-by-one errors in the while loop**: The condition should be `left <= last_seen[num]` not `left < last_seen[num]`. We need to remove the duplicate element itself, not just elements before it.

## When You'll See This Pattern

This sliding window with uniqueness constraint pattern appears in several problems:

1. **Longest Substring Without Repeating Characters (LeetCode #3)**: Almost identical pattern - find the longest substring with unique characters instead of maximum sum.

2. **Fruit Into Baskets (LeetCode #904)**: Similar sliding window with constraint on number of unique elements (at most 2 types).

3. **Longest Substring with At Most K Distinct Characters (LeetCode #340)**: Generalization where you can have up to k unique characters.

The core pattern is: maintain a window that satisfies some uniqueness or frequency constraint, and efficiently adjust the window when the constraint is violated.

## Key Takeaways

1. **Sliding window + hash map is powerful**: When you need to maintain a contiguous sequence with uniqueness constraints, this combination lets you track both what's in the window and where elements were last seen.

2. **Track last seen indices, not just existence**: Knowing where a duplicate occurred lets you efficiently shrink the window to the correct position in one operation.

3. **Maintain running sums for efficiency**: Instead of recalculating from scratch, keep a running sum and adjust it as the window changes. This turns O(n) operations into O(1).

Related problems: [Longest Substring Without Repeating Characters](/problem/longest-substring-without-repeating-characters)
