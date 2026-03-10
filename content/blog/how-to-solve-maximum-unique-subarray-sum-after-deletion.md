---
title: "How to Solve Maximum Unique Subarray Sum After Deletion — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Unique Subarray Sum After Deletion. Easy difficulty, 40.5% acceptance rate. Topics: Array, Hash Table, Greedy."
date: "2026-08-09"
category: "dsa-patterns"
tags: ["maximum-unique-subarray-sum-after-deletion", "array", "hash-table", "greedy", "easy"]
---

# How to Solve Maximum Unique Subarray Sum After Deletion

This problem asks us to find the maximum sum of a subarray where all elements are unique, after we're allowed to delete any number of elements from the original array. The key insight is that we're essentially looking for the subarray with the highest sum where no element repeats, but we can skip over elements that would cause duplicates. This is tricky because we need to efficiently track both the sum and which elements we've seen while maintaining a valid subarray.

## Visual Walkthrough

Let's trace through an example: `nums = [4, 2, 4, 5, 6]`

We want to find the maximum sum subarray with all unique elements. Let's think through the possibilities:

1. Start at index 0: `[4]` → sum = 4
2. Add index 1: `[4, 2]` → sum = 6 (all unique)
3. Add index 2: `[4, 2, 4]` → duplicate 4! We need to remove elements from the left until the duplicate is gone. Remove 4 from left: `[2, 4]` → sum = 6
4. Add index 3: `[2, 4, 5]` → sum = 11 (all unique)
5. Add index 4: `[2, 4, 5, 6]` → sum = 17 (all unique)

The maximum sum we found is 17 from subarray `[2, 4, 5, 6]`. Notice that we effectively "deleted" the first 4 when we encountered the duplicate second 4.

Another example: `nums = [5, 2, 1, 2, 5, 2, 1, 2, 5]`

1. Start: `[5]` → sum = 5
2. Add 2: `[5, 2]` → sum = 7
3. Add 1: `[5, 2, 1]` → sum = 8
4. Add 2: Duplicate! Remove from left until 2 is gone: `[1, 2]` → sum = 3
5. Add 5: `[1, 2, 5]` → sum = 8
6. Add 2: Duplicate! Remove from left until 2 is gone: `[5, 2]` → sum = 7
7. Add 1: `[5, 2, 1]` → sum = 8
8. Add 2: Duplicate! Remove from left until 2 is gone: `[1, 2]` → sum = 3
9. Add 5: `[1, 2, 5]` → sum = 8

Maximum sum is 8. The optimal subarray could be `[5, 2, 1]` or `[2, 1, 5]`.

## Brute Force Approach

A brute force approach would try all possible subarrays and check if they contain all unique elements. For each starting index `i`, we would:

1. Initialize an empty set to track seen elements
2. For each ending index `j` from `i` to `n-1`:
   - If `nums[j]` is already in the set, break (subarray no longer valid)
   - Otherwise, add `nums[j]` to set, update current sum
   - Update maximum sum if current sum is greater

This approach has O(n²) time complexity in the worst case (when all elements are unique, we check all n(n+1)/2 subarrays) and O(n) space complexity for the set.

The problem with this approach is efficiency. With n up to 10⁵, O(n²) is far too slow (10¹⁰ operations). We need a linear solution.

## Optimal Solution

The optimal solution uses a sliding window with two pointers and a hash map/set to track elements in the current window. The key insight is that when we encounter a duplicate, we need to shrink the window from the left until the duplicate is removed, not just reset the entire window.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumUniqueSubarray(nums):
    """
    Find maximum sum of subarray with all unique elements.

    Approach: Sliding window with two pointers (left, right)
    and a set to track elements in current window.
    """
    n = len(nums)
    if n == 0:
        return 0

    # Set to track elements in current window
    seen = set()

    # Two pointers for sliding window
    left = 0
    current_sum = 0
    max_sum = 0

    # Expand window by moving right pointer
    for right in range(n):
        # If current element is already in window, shrink from left
        while nums[right] in seen:
            # Remove leftmost element from window
            seen.remove(nums[left])
            current_sum -= nums[left]
            left += 1

        # Add current element to window
        seen.add(nums[right])
        current_sum += nums[right]

        # Update maximum sum
        max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n) | Space: O(n)
function maximumUniqueSubarray(nums) {
  /**
   * Find maximum sum of subarray with all unique elements.
   *
   * Approach: Sliding window with two pointers (left, right)
   * and a set to track elements in current window.
   */
  const n = nums.length;
  if (n === 0) return 0;

  // Set to track elements in current window
  const seen = new Set();

  // Two pointers for sliding window
  let left = 0;
  let currentSum = 0;
  let maxSum = 0;

  // Expand window by moving right pointer
  for (let right = 0; right < n; right++) {
    // If current element is already in window, shrink from left
    while (seen.has(nums[right])) {
      // Remove leftmost element from window
      seen.delete(nums[left]);
      currentSum -= nums[left];
      left++;
    }

    // Add current element to window
    seen.add(nums[right]);
    currentSum += nums[right];

    // Update maximum sum
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int maximumUniqueSubarray(int[] nums) {
        /**
         * Find maximum sum of subarray with all unique elements.
         *
         * Approach: Sliding window with two pointers (left, right)
         * and a set to track elements in current window.
         */
        int n = nums.length;
        if (n == 0) return 0;

        // Set to track elements in current window
        Set<Integer> seen = new HashSet<>();

        // Two pointers for sliding window
        int left = 0;
        int currentSum = 0;
        int maxSum = 0;

        // Expand window by moving right pointer
        for (int right = 0; right < n; right++) {
            // If current element is already in window, shrink from left
            while (seen.contains(nums[right])) {
                // Remove leftmost element from window
                seen.remove(nums[left]);
                currentSum -= nums[left];
                left++;
            }

            // Add current element to window
            seen.add(nums[right]);
            currentSum += nums[right];

            // Update maximum sum
            maxSum = Math.max(maxSum, currentSum);
        }

        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once with the right pointer (n iterations)
- Each element is added to the set exactly once
- Each element is removed from the set at most once (when left pointer moves past it)
- The while loop for shrinking the window doesn't make the complexity O(n²) because each element is processed at most twice (once when added, once when removed)

**Space Complexity: O(n)**

- In the worst case, when all elements are unique, the set will contain all n elements
- The space used by the set is proportional to the number of unique elements in the current window, which is at most n

## Common Mistakes

1. **Resetting the entire window when encountering a duplicate**: Some candidates reset `left = right` and clear the entire set when they find a duplicate. This is wrong because we might lose a valid longer subarray. For example, in `[1, 2, 3, 2, 4]`, if we reset completely at the second 2, we miss `[3, 2, 4]`.

2. **Forgetting to update current_sum when shrinking window**: When removing elements from the left, you must subtract them from `current_sum`. Otherwise, your sum will be incorrect.

3. **Using an array instead of a hash set for tracking seen elements**: Since values can be up to 10⁴, an array of size 10⁴+1 would work, but a hash set is more general and works for any integer values.

4. **Not handling empty array**: While the problem says we can't make the array empty after deletions, the input array itself could be empty. Always check for edge cases.

## When You'll See This Pattern

This sliding window with two pointers and a hash set pattern appears in several other problems:

1. **Longest Substring Without Repeating Characters (LeetCode #3)**: Almost identical pattern - find the longest substring without repeating characters instead of maximum sum.

2. **Fruit Into Baskets (LeetCode #904)**: Similar sliding window where you track at most 2 types of fruits (elements) in the window.

3. **Maximum Erasure Value (LeetCode #1695)**: This is actually the same problem with a different name!

The core pattern is: when you need to find a contiguous subarray/substring that satisfies some uniqueness or frequency constraint, consider a sliding window with a hash map/set to track elements in the current window.

## Key Takeaways

1. **Sliding window with two pointers** is the go-to approach for contiguous subarray problems with uniqueness constraints. The left pointer tracks the start of the valid window, and the right pointer expands it.

2. **Use a hash set to efficiently check for duplicates** in the current window. This allows O(1) lookups to determine if an element is already present.

3. **When you encounter a duplicate, shrink from the left until it's removed** rather than resetting the entire window. This preserves the valid portion of the window that comes after the duplicate.

Related problems: [Maximum Subarray Sum with One Deletion](/problem/maximum-subarray-sum-with-one-deletion)
