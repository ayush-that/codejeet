---
title: "How to Solve Minimum Operations to Make the Array Increasing — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make the Array Increasing. Easy difficulty, 81.9% acceptance rate. Topics: Array, Greedy."
date: "2026-12-09"
category: "dsa-patterns"
tags: ["minimum-operations-to-make-the-array-increasing", "array", "greedy", "easy"]
---

# How to Solve Minimum Operations to Make the Array Increasing

This problem asks us to find the minimum number of operations (each operation increments an element by 1) needed to make an array strictly increasing. The tricky part is that we can only increase elements, not decrease them, and we need to achieve this with the fewest possible increments. This constraint forces us to think greedily: once we fix an element, all subsequent elements must be at least one greater than it.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 5, 2, 4, 1]`.

We need the array to be strictly increasing: `nums[0] < nums[1] < nums[2] < nums[3] < nums[4]`.

**Step 1:** Start with the first element `1`. It's fine as is.

**Step 2:** Look at `nums[1] = 5`. It's already greater than `nums[0] = 1`, so no changes needed.

**Step 3:** Look at `nums[2] = 2`. This is less than `nums[1] = 5`, but we can only increase it. To be strictly greater than 5, it needs to be at least 6. We increment it from 2 to 6, which takes 4 operations. Now `nums[2] = 6`.

**Step 4:** Look at `nums[3] = 4`. It needs to be greater than `nums[2] = 6`, so it needs to be at least 7. We increment it from 4 to 7, taking 3 operations. Now `nums[3] = 7`.

**Step 5:** Look at `nums[4] = 1`. It needs to be greater than `nums[3] = 7`, so it needs to be at least 8. We increment it from 1 to 8, taking 7 operations.

Total operations: 0 + 0 + 4 + 3 + 7 = 14.

The pattern is clear: for each position `i` (starting from 1), we ensure `nums[i] > nums[i-1]`. If it's not, we increase it to exactly `nums[i-1] + 1`. This greedy approach works because:

1. We can only increase elements, so making an element just large enough minimizes operations
2. Making earlier elements larger would require even more operations on subsequent elements

## Brute Force Approach

A naive approach might try all possible increment combinations, but that's exponential and impractical. Another brute force would be: for each element, repeatedly increment it until it's greater than the previous element, counting each operation. While this would work, it's inefficient when large increments are needed.

For example, if `nums = [1, 1, 1, 1, 1]`, we'd need:

- `nums[1]` becomes 2 (1 operation)
- `nums[2]` becomes 3 (2 operations)
- `nums[3]` becomes 4 (3 operations)
- `nums[4]` becomes 5 (4 operations)

The brute force would actually perform these increments one by one, taking O(k) time where k is the total number of operations. In the worst case, if the array is decreasing, we could need O(n²) operations (like `[n, n-1, n-2, ..., 1]`).

## Optimal Solution

The optimal solution uses a single pass through the array. We maintain the current "expected" minimum value for each position and calculate how many operations are needed to reach it.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minOperations(nums):
    """
    Calculate minimum increments needed to make array strictly increasing.

    Args:
        nums: List[int] - input array

    Returns:
        int - minimum number of operations
    """
    if not nums:
        return 0

    operations = 0
    # Start from the second element (index 1)
    for i in range(1, len(nums)):
        # If current element is not greater than previous
        if nums[i] <= nums[i-1]:
            # Calculate how much we need to add to make it strictly greater
            # We need nums[i] to be at least nums[i-1] + 1
            needed = nums[i-1] + 1 - nums[i]
            operations += needed
            # Update current element to the new minimum value
            nums[i] = nums[i-1] + 1

    return operations
```

```javascript
// Time: O(n) | Space: O(1)
function minOperations(nums) {
  /**
   * Calculate minimum increments needed to make array strictly increasing.
   *
   * @param {number[]} nums - input array
   * @return {number} - minimum number of operations
   */
  if (!nums || nums.length === 0) {
    return 0;
  }

  let operations = 0;
  // Start from the second element (index 1)
  for (let i = 1; i < nums.length; i++) {
    // If current element is not greater than previous
    if (nums[i] <= nums[i - 1]) {
      // Calculate how much we need to add to make it strictly greater
      // We need nums[i] to be at least nums[i-1] + 1
      const needed = nums[i - 1] + 1 - nums[i];
      operations += needed;
      // Update current element to the new minimum value
      nums[i] = nums[i - 1] + 1;
    }
  }

  return operations;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minOperations(int[] nums) {
        /**
         * Calculate minimum increments needed to make array strictly increasing.
         *
         * @param nums - input array
         * @return minimum number of operations
         */
        if (nums == null || nums.length == 0) {
            return 0;
        }

        int operations = 0;
        // Start from the second element (index 1)
        for (int i = 1; i < nums.length; i++) {
            // If current element is not greater than previous
            if (nums[i] <= nums[i - 1]) {
                // Calculate how much we need to add to make it strictly greater
                // We need nums[i] to be at least nums[i-1] + 1
                int needed = nums[i - 1] + 1 - nums[i];
                operations += needed;
                // Update current element to the new minimum value
                nums[i] = nums[i - 1] + 1;
            }
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n), where n is the length of the array. We make a single pass through the array, performing constant-time operations at each step.

**Space Complexity:** O(1). We only use a few variables (`operations`, loop counter `i`, and `needed`). The input array is modified in place, but if we couldn't modify it, we could use a variable to track the previous value instead, still achieving O(1) space.

## Common Mistakes

1. **Forgetting to update the current element after calculating operations:** If you only count operations but don't update `nums[i]`, the next comparison will be against the original (smaller) value, leading to incorrect results. Always update the element to its new minimum value.

2. **Using `>` instead of `>=` or `<=` in the comparison:** Since we need strictly increasing array, we need `nums[i] > nums[i-1]`. The condition `nums[i] <= nums[i-1]` correctly identifies when we need to increment. Using just `<` would miss the equal case.

3. **Starting the loop from index 0 instead of 1:** The first element doesn't need to be compared to anything before it. Starting from index 0 would cause an index out of bounds error when accessing `nums[i-1]`.

4. **Not handling empty or single-element arrays:** While the problem constraints might guarantee at least 2 elements, it's good practice to handle edge cases. An empty array or single-element array requires 0 operations.

## When You'll See This Pattern

This greedy "make it just good enough" pattern appears in many array manipulation problems:

1. **Minimum Increment to Make Array Unique (LeetCode 945):** Similar concept but with the additional constraint of making all elements unique, not just increasing. The greedy approach of sorting and then ensuring each element is greater than the previous is nearly identical.

2. **Make Array Non-decreasing or Non-increasing (LeetCode 2263):** A harder variation where you can choose to increment or decrement elements, with costs associated with each operation.

3. **Candy (LeetCode 135):** While not identical, it uses a similar two-pass greedy approach to ensure constraints are met with minimum "resources" (candies in that case).

The core pattern is: when you need to satisfy pairwise constraints in a sequence with minimum cost, process elements in order and make each element just good enough to satisfy the constraint with its predecessor.

## Key Takeaways

1. **Greedy works when local optimal choices lead to global optimum:** By making each element just large enough to be greater than its predecessor, we minimize the impact on subsequent elements. This is a classic greedy proof: any other approach would either waste operations or make subsequent elements need even more operations.

2. **Process arrays in natural order for pairwise constraints:** When each element only needs to satisfy a condition with its immediate neighbor, a single left-to-right pass is often sufficient.

3. **The formula `max(prev + 1, current) - current` is key:** This calculates exactly how much we need to add to make an element strictly greater than its predecessor. Understanding this transformation helps with similar problems.

Related problems: [Minimum Increment to Make Array Unique](/problem/minimum-increment-to-make-array-unique), [Make Array Non-decreasing or Non-increasing](/problem/make-array-non-decreasing-or-non-increasing), [Maximum Product After K Increments](/problem/maximum-product-after-k-increments)
