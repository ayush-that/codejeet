---
title: "How to Solve Smallest Index With Equal Value — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Smallest Index With Equal Value. Easy difficulty, 73.1% acceptance rate. Topics: Array."
date: "2027-10-01"
category: "dsa-patterns"
tags: ["smallest-index-with-equal-value", "array", "easy"]
---

# How to Solve Smallest Index With Equal Value

This problem asks us to find the smallest index `i` in a 0-indexed array where `i mod 10` equals `nums[i]`, returning `-1` if no such index exists. While straightforward, it's a good exercise in careful array traversal and understanding modulo operations. The challenge lies in recognizing that we need to check every element until we find a match, but we must stop at the first valid index to satisfy the "smallest" requirement.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]`.

We need to check each index `i` from 0 to `n-1`:

- **i = 0**: `0 mod 10 = 0`, `nums[0] = 0` → Match! We found `i mod 10 == nums[i]`
- Since we need the **smallest** index, we can return 0 immediately.

Now consider `nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]`:

- **i = 0**: `0 mod 10 = 0`, `nums[0] = 1` → No match
- **i = 1**: `1 mod 10 = 1`, `nums[1] = 2` → No match
- **i = 2**: `2 mod 10 = 2`, `nums[2] = 3` → No match
- **i = 3**: `3 mod 10 = 3`, `nums[3] = 4` → No match
- **i = 4**: `4 mod 10 = 4`, `nums[4] = 5` → No match
- **i = 5**: `5 mod 10 = 5`, `nums[5] = 6` → No match
- **i = 6**: `6 mod 10 = 6`, `nums[6] = 7` → No match
- **i = 7**: `7 mod 10 = 7`, `nums[7] = 8` → No match
- **i = 8**: `8 mod 10 = 8`, `nums[8] = 9` → No match
- **i = 9**: `9 mod 10 = 9`, `nums[9] = 0` → No match
- No matches found → Return `-1`

The key insight: We must check indices in order from 0 upward and return the first match we find.

## Brute Force Approach

The brute force approach is actually the optimal approach for this problem since we need to examine each element in order until we find a match. There's no way to skip indices because:

1. The condition depends on both the index value and the array value
2. The array is unsorted with respect to this condition
3. We need the smallest index, so we must check from the beginning

A truly naive approach might try to precompute all matches and then find the minimum, but that would be less efficient than stopping at the first match. The straightforward linear scan is optimal.

## Optimal Solution

The optimal solution is a simple linear scan through the array. For each index `i`, we check if `i % 10 == nums[i]`. If true, we return `i` immediately (ensuring we get the smallest index). If we finish the loop without finding a match, we return `-1`.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def smallestEqual(nums):
    """
    Find the smallest index i where i mod 10 equals nums[i].

    Args:
        nums: List of integers to search through

    Returns:
        The smallest index satisfying the condition, or -1 if none exists
    """
    # Iterate through each index in the array
    for i in range(len(nums)):
        # Check if i mod 10 equals the value at nums[i]
        if i % 10 == nums[i]:
            # Found the smallest valid index (since we check in order)
            return i

    # If we complete the loop without returning, no index satisfies the condition
    return -1
```

```javascript
// Time: O(n) | Space: O(1)
function smallestEqual(nums) {
  /**
   * Find the smallest index i where i mod 10 equals nums[i].
   *
   * @param {number[]} nums - Array of integers to search through
   * @return {number} The smallest index satisfying the condition, or -1 if none exists
   */

  // Iterate through each index in the array
  for (let i = 0; i < nums.length; i++) {
    // Check if i mod 10 equals the value at nums[i]
    if (i % 10 === nums[i]) {
      // Found the smallest valid index (since we check in order)
      return i;
    }
  }

  // If we complete the loop without returning, no index satisfies the condition
  return -1;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int smallestEqual(int[] nums) {
        /**
         * Find the smallest index i where i mod 10 equals nums[i].
         *
         * @param nums Array of integers to search through
         * @return The smallest index satisfying the condition, or -1 if none exists
         */

        // Iterate through each index in the array
        for (int i = 0; i < nums.length; i++) {
            // Check if i mod 10 equals the value at nums[i]
            if (i % 10 == nums[i]) {
                // Found the smallest valid index (since we check in order)
                return i;
            }
        }

        // If we complete the loop without returning, no index satisfies the condition
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once in the worst case (when no match exists or the match is at the last position)
- Each iteration performs a constant-time modulo operation and comparison
- `n` is the length of the input array

**Space Complexity: O(1)**

- We only use a constant amount of extra space (the loop variable `i`)
- No additional data structures are created that scale with input size

## Common Mistakes

1. **Forgetting to handle the empty array case**: If `nums` is empty, the loop won't execute, and we correctly return `-1`. However, some candidates might add unnecessary checks. The current solution handles this correctly.

2. **Using the wrong modulo operator or misunderstanding modulo**: Some candidates might confuse `%` with integer division or use `nums[i] % 10` instead of `i % 10`. Remember: we're checking the remainder when the **index** is divided by 10, not when the array value is divided by 10.

3. **Continuing to search after finding a match**: The problem asks for the **smallest** index. Since we're checking indices in increasing order, the first match we find is guaranteed to be the smallest. Some candidates might continue searching and then find the minimum of all matches, which is unnecessary and less efficient.

4. **Off-by-one errors in loop bounds**: Using `i <= len(nums)` instead of `i < len(nums)` would cause an index out of bounds error. Remember that arrays are 0-indexed, so valid indices go from 0 to `n-1`.

## When You'll See This Pattern

This problem demonstrates the **linear scan with early termination** pattern, which appears in many array problems:

1. **Find First Palindromic String in Array (LeetCode 2108)**: Similar linear scan looking for the first element satisfying a condition (being a palindrome).

2. **First Unique Character in a String (LeetCode 387)**: Requires scanning through the string to find the first character with count 1.

3. **Find Pivot Index (LeetCode 724)**: Involves scanning through an array while maintaining running sums to find the first index where left sum equals right sum.

The core pattern is: iterate through elements in order, check a condition at each step, and return immediately when the condition is met (since we want the first occurrence).

## Key Takeaways

1. **When you need the "first" or "smallest" index satisfying a condition, a linear scan with early return is often optimal**. There's no need to continue searching once you find a valid candidate.

2. **Pay close attention to what's being compared in the condition**. In this case, it's `i % 10` (the index modulo 10) compared to `nums[i]` (the value at that index), not the other way around.

3. **Simple problems test attention to detail**. Even with an O(n) solution, you need to correctly implement the modulo operation, loop bounds, and return conditions.

[Practice this problem on CodeJeet](/problem/smallest-index-with-equal-value)
