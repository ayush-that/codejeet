---
title: "How to Solve Minimum Increment Operations to Make Array Beautiful — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Increment Operations to Make Array Beautiful. Medium difficulty, 34.7% acceptance rate. Topics: Array, Dynamic Programming."
date: "2030-01-19"
category: "dsa-patterns"
tags:
  ["minimum-increment-operations-to-make-array-beautiful", "array", "dynamic-programming", "medium"]
---

# How to Solve Minimum Increment Operations to Make Array Beautiful

This problem asks us to make an array "beautiful" by incrementing elements, where beautiful means every element is at least as large as the previous element. We need to find the minimum number of increment operations needed. What makes this tricky is that we can't decrease elements, only increase them, so we need to carefully propagate increases forward through the array to maintain the non-decreasing property.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 2, 1, 4]`

**Step 1:** Start with the first element: 3. No previous element to compare with, so it's fine.

**Step 2:** Move to the second element: 2. It's less than the previous element (3). To make the array beautiful, we need to increase 2 until it's at least 3. We need 1 increment (2 → 3). Now array becomes `[3, 3, 1, 4]`.

**Step 3:** Move to the third element: 1. It's less than the previous element (3). We need to increase 1 until it's at least 3. We need 2 increments (1 → 3). Now array becomes `[3, 3, 3, 4]`.

**Step 4:** Move to the fourth element: 4. It's already greater than the previous element (3), so no increments needed.

Total increments: 1 + 2 = 3

The key insight is that once we increase an element to match or exceed the previous one, we might need to propagate this "minimum required value" forward. If we don't track this properly, we might undercount the needed increments.

## Brute Force Approach

A naive approach would be to repeatedly scan the array, fixing violations one by one:

1. Scan from left to right
2. Whenever we find `nums[i] < nums[i-1]`, increment `nums[i]` by 1
3. Count each increment
4. Repeat until the array is beautiful

This approach is problematic because:

- It could be extremely slow for large arrays with big differences between elements
- In the worst case (array in strictly decreasing order), we'd need O(n²) operations
- Each pass only fixes immediate neighbors, requiring multiple passes

While this would technically work, it's too inefficient for the constraints typically given in coding interviews.

## Optimized Approach

The optimal solution uses a single pass with careful tracking:

**Key Insight:** For each position `i`, the minimum value it needs to have is the maximum of:

1. Its original value
2. The minimum required value for position `i-1`

Why? Because if position `i-1` needed to be increased to some value `x` to satisfy the beautiful condition with its predecessor, then position `i` must be at least `x` to be beautiful with position `i-1`.

**Step-by-step reasoning:**

1. Start with the first element - it doesn't need to satisfy any condition with a previous element
2. For each subsequent element `i`:
   - Calculate what value it needs to be: `max(nums[i], required_prev)`
   - The increments needed for this element: `max(nums[i], required_prev) - nums[i]`
   - Update `required_prev` to be this new required value for the next iteration
3. Sum all the increments

This approach works because we're propagating the "minimum required value" forward through the array. Each element must be at least as large as what the previous element needed to be.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minIncrementOperations(nums):
    """
    Calculate minimum increments to make array beautiful (non-decreasing).

    Args:
        nums: List of integers

    Returns:
        Minimum number of increment operations needed
    """
    # Edge case: empty array or single element is already beautiful
    if len(nums) <= 1:
        return 0

    total_increments = 0
    # Tracks the minimum value the previous element needed to be
    required_prev = nums[0]

    # Process each element starting from the second one
    for i in range(1, len(nums)):
        # Current element must be at least as large as what previous element needed to be
        required_current = max(nums[i], required_prev)

        # Add the increments needed for current element
        total_increments += required_current - nums[i]

        # Update required_prev for next iteration
        required_prev = required_current

    return total_increments
```

```javascript
// Time: O(n) | Space: O(1)
function minIncrementOperations(nums) {
  /**
   * Calculate minimum increments to make array beautiful (non-decreasing).
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Minimum number of increment operations needed
   */

  // Edge case: empty array or single element is already beautiful
  if (nums.length <= 1) {
    return 0;
  }

  let totalIncrements = 0;
  // Tracks the minimum value the previous element needed to be
  let requiredPrev = nums[0];

  // Process each element starting from the second one
  for (let i = 1; i < nums.length; i++) {
    // Current element must be at least as large as what previous element needed to be
    const requiredCurrent = Math.max(nums[i], requiredPrev);

    // Add the increments needed for current element
    totalIncrements += requiredCurrent - nums[i];

    // Update requiredPrev for next iteration
    requiredPrev = requiredCurrent;
  }

  return totalIncrements;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minIncrementOperations(int[] nums) {
        /**
         * Calculate minimum increments to make array beautiful (non-decreasing).
         *
         * @param nums Array of integers
         * @return Minimum number of increment operations needed
         */

        // Edge case: empty array or single element is already beautiful
        if (nums.length <= 1) {
            return 0;
        }

        int totalIncrements = 0;
        // Tracks the minimum value the previous element needed to be
        int requiredPrev = nums[0];

        // Process each element starting from the second one
        for (int i = 1; i < nums.length; i++) {
            // Current element must be at least as large as what previous element needed to be
            int requiredCurrent = Math.max(nums[i], requiredPrev);

            // Add the increments needed for current element
            totalIncrements += requiredCurrent - nums[i];

            // Update requiredPrev for next iteration
            requiredPrev = requiredCurrent;
        }

        return totalIncrements;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the array, processing each element exactly once
- Each operation inside the loop is O(1): max calculation, subtraction, and addition
- The edge case check is also O(1)

**Space Complexity:** O(1)

- We only use a constant amount of extra space: `total_increments`, `required_prev`, and loop variables
- No additional data structures that grow with input size
- The input array is modified in-place in terms of our logic, but we don't actually modify it

## Common Mistakes

1. **Modifying the array unnecessarily:** Some candidates try to actually modify `nums[i]` to the new value. This isn't needed - we just need to track what the value _should be_ for the next comparison.

2. **Forgetting to update the required value for next iteration:** After calculating `required_current`, you must update `required_prev = required_current`. If you use `required_prev = nums[i]`, you'll undercount when `nums[i]` was already larger than the previous required value.

3. **Incorrect initialization of `required_prev`:** It should be initialized to `nums[0]`, not 0. The first element sets the baseline for what comes after it.

4. **Off-by-one errors in the loop:** The loop should start at index 1 (the second element), not 0. The first element doesn't need to be compared with any previous element.

## When You'll See This Pattern

This "propagate minimum/maximum requirement forward" pattern appears in several array transformation problems:

1. **Candy (LeetCode 135)** - Similar propagation of minimum requirements in both directions to satisfy constraints with neighbors.

2. **Minimum Operations to Make the Array Increasing (LeetCode 1827)** - Almost identical problem with slightly different constraints.

3. **Best Time to Buy and Sell Stock (LeetCode 121)** - While not identical, it uses similar forward propagation of minimum values to track optimal buying points.

The core pattern is: when each element's constraint depends on the previous element's value, you can process the array in one direction, carrying forward the necessary state information.

## Key Takeaways

1. **Single pass with state tracking:** When constraints are local (each element depends only on its immediate neighbor), you can often solve with a single forward pass while carrying minimal state information.

2. **Think in terms of "minimum required value":** Instead of focusing on individual increments, think about what each element _needs to be_ to satisfy constraints. The difference between this and its current value gives you the increments needed.

3. **Don't modify unless necessary:** You can solve many array problems by tracking what values _should be_ rather than actually modifying the array. This often leads to cleaner, more efficient solutions.

[Practice this problem on CodeJeet](/problem/minimum-increment-operations-to-make-array-beautiful)
