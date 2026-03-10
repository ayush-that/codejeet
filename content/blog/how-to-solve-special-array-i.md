---
title: "How to Solve Special Array I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Special Array I. Easy difficulty, 81.6% acceptance rate. Topics: Array."
date: "2028-04-14"
category: "dsa-patterns"
tags: ["special-array-i", "array", "easy"]
---

# How to Solve Special Array I

An array is **special** if every adjacent pair has different parity — one even, one odd. The problem asks us to verify this property for a given integer array. While conceptually simple, this problem tests your attention to detail with array traversal and parity checking, which are fundamental skills for more complex array manipulation problems.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [4, 3, 1, 6]`:

1. **First pair (index 0-1):** `4` (even) and `3` (odd) → different parity ✓
2. **Second pair (index 1-2):** `3` (odd) and `1` (odd) → same parity ✗

We can stop here because the array is already not special. The moment we find any adjacent pair with the same parity, we can return `false`.

Now let's try a valid example: `nums = [2, 7, 4, 9]`:

1. **Pair 0-1:** `2` (even) and `7` (odd) → different ✓
2. **Pair 1-2:** `7` (odd) and `4` (even) → different ✓
3. **Pair 2-3:** `4` (even) and `9` (odd) → different ✓

All pairs satisfy the condition, so we return `true`.

The key insight: we only need to check `n-1` adjacent pairs (where `n` is the array length). For each pair `(nums[i], nums[i+1])`, we verify that one is even and the other is odd.

## Brute Force Approach

The most straightforward approach is exactly what we visualized: iterate through the array and check every adjacent pair. While this is actually the optimal solution for this problem (since we must examine each element at least once), let's consider what a less experienced candidate might try:

**Inefficient alternative:** Some might try to generate all possible arrays and check if our input matches any special array pattern. This would be exponential in time and completely unnecessary. The direct linear scan is both simple and optimal.

The "brute force" here is simply checking each pair individually without any clever optimizations. Since we must verify the property for all `n-1` pairs, there's no way to avoid checking each one in the worst case.

## Optimal Solution

We iterate through the array from index `0` to `n-2` (inclusive), checking if each adjacent pair has different parity. We can check parity using the modulo operator (`% 2`) or bitwise AND (`& 1`). The bitwise approach is slightly more efficient as it avoids division.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def isArraySpecial(nums):
    """
    Check if an array is special (alternating parity between adjacent elements).

    Args:
        nums: List of integers to check

    Returns:
        True if array is special, False otherwise
    """
    n = len(nums)

    # Edge case: array with 0 or 1 element is trivially special
    # No adjacent pairs to check, so condition is vacuously true
    if n <= 1:
        return True

    # Iterate through all adjacent pairs
    for i in range(n - 1):
        # Check if current and next element have same parity
        # Using bitwise AND with 1:
        # - nums[i] & 1 gives 0 for even, 1 for odd
        # - If both have same result, parity is the same
        if (nums[i] & 1) == (nums[i + 1] & 1):
            return False  # Found a pair with same parity

    # All adjacent pairs have different parity
    return True
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Check if an array is special (alternating parity between adjacent elements).
 * @param {number[]} nums - Array of integers to check
 * @return {boolean} True if array is special, False otherwise
 */
function isArraySpecial(nums) {
  const n = nums.length;

  // Edge case: array with 0 or 1 element is trivially special
  // No adjacent pairs to check, so condition is vacuously true
  if (n <= 1) {
    return true;
  }

  // Iterate through all adjacent pairs
  for (let i = 0; i < n - 1; i++) {
    // Check if current and next element have same parity
    // Using bitwise AND with 1:
    // - nums[i] & 1 gives 0 for even, 1 for odd
    // - If both have same result, parity is the same
    if ((nums[i] & 1) === (nums[i + 1] & 1)) {
      return false; // Found a pair with same parity
    }
  }

  // All adjacent pairs have different parity
  return true;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Check if an array is special (alternating parity between adjacent elements).
     * @param nums Array of integers to check
     * @return True if array is special, False otherwise
     */
    public boolean isArraySpecial(int[] nums) {
        int n = nums.length;

        // Edge case: array with 0 or 1 element is trivially special
        // No adjacent pairs to check, so condition is vacuously true
        if (n <= 1) {
            return true;
        }

        // Iterate through all adjacent pairs
        for (int i = 0; i < n - 1; i++) {
            // Check if current and next element have same parity
            // Using bitwise AND with 1:
            // - nums[i] & 1 gives 0 for even, 1 for odd
            // - If both have same result, parity is the same
            if ((nums[i] & 1) == (nums[i + 1] & 1)) {
                return false;  // Found a pair with same parity
            }
        }

        // All adjacent pairs have different parity
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once, checking `n-1` adjacent pairs
- Each check is O(1) operation (bitwise AND and comparison)
- In the worst case, we examine all pairs before returning `true`

**Space Complexity:** O(1)

- We only use a constant amount of extra space (loop variable `i`)
- No additional data structures are created
- The input array is not modified

## Common Mistakes

1. **Off-by-one errors in loop bounds:**
   - Mistake: Using `for i in range(n):` and accessing `nums[i+1]` causes `IndexError` on last iteration
   - Solution: Loop from `0` to `n-2` inclusive, or `i < n-1`

2. **Incorrect parity check:**
   - Mistake: Using `nums[i] % 2 != nums[i+1] % 2` without considering negative numbers (in Python, `-3 % 2 = 1`, but in Java/JS, `-3 % 2 = -1`)
   - Solution: Use bitwise AND: `(nums[i] & 1) != (nums[i+1] & 1)` or `nums[i] % 2 != nums[i+1] % 2` with `Math.abs()` in Java/JS

3. **Missing edge cases:**
   - Mistake: Not handling empty array or single-element array
   - Solution: Arrays with 0 or 1 elements have no adjacent pairs, so they're trivially special

4. **Early termination oversight:**
   - Mistake: Continuing to check all pairs after finding a violation
   - Solution: Return `false` immediately when any pair has same parity

## When You'll See This Pattern

This problem uses **adjacent element comparison**, a fundamental pattern in array processing:

1. **Valid Mountain Array (LeetCode 941)** - Check if array first strictly increases then strictly decreases by comparing adjacent elements
2. **Monotonic Array (LeetCode 896)** - Verify if array is entirely non-increasing or non-decreasing by checking adjacent pairs
3. **Wiggle Sort (LeetCode 280)** - Arrange array in alternating "low-high-low" pattern, similar parity concept but with values instead of parity

The core technique of comparing `nums[i]` with `nums[i+1]` appears in many array validation problems where a property must hold for all adjacent pairs.

## Key Takeaways

1. **Adjacent comparison is O(n):** When you need to check a property between all adjacent elements, a single pass through the array is sufficient and optimal.

2. **Bitwise operations for parity:** Using `& 1` is cleaner and more efficient than `% 2` for checking even/odd, especially across different programming languages.

3. **Edge cases matter:** Always consider empty arrays, single-element arrays, and the boundaries of your loops. These are common places where interview solutions fail.

4. **Early exit optimization:** If you're checking for a condition that invalidates the entire result, return immediately when you find a violation rather than checking all elements.

[Practice this problem on CodeJeet](/problem/special-array-i)
