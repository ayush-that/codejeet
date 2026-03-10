---
title: "How to Solve Find the Integer Added to Array I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Integer Added to Array I. Easy difficulty, 82.9% acceptance rate. Topics: Array."
date: "2027-10-31"
category: "dsa-patterns"
tags: ["find-the-integer-added-to-array-i", "array", "easy"]
---

# How to Solve Find the Integer Added to Array I

This problem gives us two arrays of equal length, `nums1` and `nums2`, where each element in `nums1` has been increased (or decreased) by the same integer `x` to become equal to `nums2`. Our task is to find that integer `x`. While this is an easy problem, it's interesting because it tests your understanding of array operations and mathematical reasoning—specifically, recognizing that the relationship between corresponding elements reveals the constant difference.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Example:** `nums1 = [2, 6, 4]`, `nums2 = [9, 13, 11]`

We know that for each position `i`, `nums1[i] + x = nums2[i]`. This means:

- For `i = 0`: `2 + x = 9` → `x = 7`
- For `i = 1`: `6 + x = 13` → `x = 7`
- For `i = 2`: `4 + x = 11` → `x = 7`

All three calculations give us `x = 7`. Notice that we could pick any single pair to find `x`, but the problem guarantees all pairs will yield the same result.

What if we had negative numbers? Let's try: `nums1 = [-3, 2, 0]`, `nums2 = [4, 9, 7]`

- For `i = 0`: `-3 + x = 4` → `x = 7`
- For `i = 1`: `2 + x = 9` → `x = 7`
- For `i = 2`: `0 + x = 7` → `x = 7`

The pattern holds: `x = nums2[i] - nums1[i]` for any valid index `i`.

## Brute Force Approach

A naive approach might involve checking all possible integer values of `x` within some range. For example:

1. Find the minimum and maximum values in both arrays
2. Try every possible `x` from `min(nums2) - max(nums1)` to `max(nums2) - min(nums1)`
3. For each candidate `x`, check if `nums1[i] + x == nums2[i]` for all `i`

However, this is inefficient—we'd be testing many unnecessary values when we can compute `x` directly. Even if we implemented this, the time complexity would be O(n × m) where `n` is array length and `m` is the range of possible `x` values, which could be very large.

The key insight is that since `x` must be the same for all elements, we can simply compute it once using any corresponding pair. The problem guarantees the arrays are equal length and that such an `x` exists, so we don't need to validate beyond a single calculation.

## Optimal Solution

The optimal solution is straightforward: pick any index `i`, compute `nums2[i] - nums1[i]`, and return the result. Since all pairs must satisfy the same relationship, any index will give us the correct answer.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def addedInteger(nums1, nums2):
    """
    Returns the integer x that was added to each element of nums1
    to transform it into nums2.

    Since nums1[i] + x = nums2[i] for all i, we can solve for x:
    x = nums2[i] - nums1[i] for any valid index i.

    We choose index 0 for simplicity.
    """
    # The difference between the first elements gives us x
    # This works because the same x is added to all elements
    return nums2[0] - nums1[0]
```

```javascript
// Time: O(1) | Space: O(1)
function addedInteger(nums1, nums2) {
  /**
   * Returns the integer x that was added to each element of nums1
   * to transform it into nums2.
   *
   * Since nums1[i] + x = nums2[i] for all i, we can solve for x:
   * x = nums2[i] - nums1[i] for any valid index i.
   *
   * We choose index 0 for simplicity.
   */
  // The difference between the first elements gives us x
  // This works because the same x is added to all elements
  return nums2[0] - nums1[0];
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int addedInteger(int[] nums1, int[] nums2) {
        /**
         * Returns the integer x that was added to each element of nums1
         * to transform it into nums2.
         *
         * Since nums1[i] + x = nums2[i] for all i, we can solve for x:
         * x = nums2[i] - nums1[i] for any valid index i.
         *
         * We choose index 0 for simplicity.
         */
        // The difference between the first elements gives us x
        // This works because the same x is added to all elements
        return nums2[0] - nums1[0];
    }
}
```

</div>

**Alternative approach using sorting:** Some candidates might sort both arrays and compute the difference between corresponding elements. While this works, it's less efficient (O(n log n) time) and unnecessary. However, it's worth mentioning because it demonstrates a different way of thinking about the problem:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def addedIntegerSorting(nums1, nums2):
    """
    Alternative approach using sorting.
    Not optimal but demonstrates another way to think about the problem.
    """
    # Sort both arrays
    nums1.sort()
    nums2.sort()

    # After sorting, the smallest in nums1 corresponds to smallest in nums2
    # The difference will be the same for all pairs
    return nums2[0] - nums1[0]
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We only perform a single subtraction operation regardless of array size
- No loops or recursion needed

**Space Complexity:** O(1)

- We only use a constant amount of extra space
- No additional data structures are created

## Common Mistakes

1. **Overcomplicating the solution:** Some candidates try to validate that all pairs give the same result by looping through the entire array. While this isn't wrong, it's unnecessary since the problem guarantees the arrays are equal after transformation. The O(1) solution is sufficient.

2. **Using the wrong index:** If a candidate accidentally uses different indices for `nums1` and `nums2` (like `nums2[0] - nums1[1]`), they'll get the wrong answer. Always use the same index for both arrays.

3. **Forgetting about negative numbers:** The subtraction `nums2[i] - nums1[i]` handles negative numbers correctly. For example, if `nums1[i] = -5` and `nums2[i] = 3`, then `x = 3 - (-5) = 8`, which is correct because `-5 + 8 = 3`. Some candidates might mistakenly try to add instead of subtract.

4. **Not reading the problem constraints carefully:** The problem states the arrays have equal length, so we don't need to handle unequal lengths. However, in a real interview, it's good practice to mention this assumption.

## When You'll See This Pattern

This problem teaches the pattern of **constant transformation**—when all elements of a collection are modified by the same operation. You'll see variations of this pattern in:

1. **Find the Difference (LeetCode 389):** Similar concept but with strings—find the extra character added to one string.
2. **Missing Number (LeetCode 268):** Find the missing number in a range, which can be solved by comparing sums.
3. **Single Number (LeetCode 136):** Find the element that appears once while others appear twice, using XOR operations.

The core idea is recognizing when a problem involves a uniform operation applied to all elements, allowing you to derive a simple mathematical relationship rather than brute-forcing through possibilities.

## Key Takeaways

1. **Look for mathematical relationships:** When a problem describes a uniform transformation (like "each element is increased by the same amount"), there's usually a simple mathematical formula you can derive rather than checking all possibilities.

2. **Trust the problem constraints:** If the problem guarantees something (like arrays being equal length and the transformation existing), you don't need to write extra validation code unless specifically asked.

3. **Start with the simplest case:** Often the easiest way to understand a transformation is to look at a single element or pair. If the same operation applies to all elements, understanding one case gives you the solution for all.

[Practice this problem on CodeJeet](/problem/find-the-integer-added-to-array-i)
