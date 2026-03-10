---
title: "How to Solve Maximum Number of Distinct Elements After Operations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Distinct Elements After Operations. Medium difficulty, 52.2% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2027-06-01"
category: "dsa-patterns"
tags:
  ["maximum-number-of-distinct-elements-after-operations", "array", "greedy", "sorting", "medium"]
---

# How to Solve Maximum Number of Distinct Elements After Operations

You're given an array of integers and can adjust each element by adding any value between `-k` and `k` (inclusive) at most once. Your goal is to maximize the number of distinct values in the final array. The challenge lies in strategically choosing adjustments to transform duplicate values into unique ones while avoiding collisions with existing values.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 5, 5, 7]`, `k = 2`

**Initial state:** We have values 3, 5, 5, 7. Only 3 and 7 are distinct (5 appears twice).

**Step 1 - Sort the array:** `[3, 5, 5, 7]` (already sorted in this case)

**Step 2 - Process first element (3):**

- Current target = 3 (first element)
- We can keep it as 3, no adjustment needed
- Next target = 3 + 1 = 4 (we want the next value to be at least 4 to stay distinct)

**Step 3 - Process first 5:**

- Current value = 5
- We need it to be at least target = 4
- The best we can make it is 5 (since we can only adjust by ±2)
- Since 5 ≥ 4, we can use it
- Next target = max(5, 4) + 1 = 6

**Step 4 - Process second 5:**

- Current value = 5
- We need it to be at least target = 6
- Can we adjust 5 to reach 6? Yes, add +1 (within ±2 range)
- New value = 6
- Next target = max(6, 6) + 1 = 7

**Step 5 - Process 7:**

- Current value = 7
- We need it to be at least target = 7
- Can we adjust 7 to reach 7? Yes, no adjustment needed
- New value = 7
- Next target = max(7, 7) + 1 = 8

**Result:** Final values are [3, 5, 6, 7] → 4 distinct elements (improved from 3).

## Brute Force Approach

A naive approach would consider all possible adjustments for each element. Since each element can be adjusted to any value in `[nums[i]-k, nums[i]+k]`, and we have `n` elements, the brute force would explore `(2k+1)^n` possibilities. Even for small `k` and `n`, this grows exponentially.

What might a candidate try? They might think about randomly adjusting duplicates to avoid collisions, but without a systematic approach, they'll likely miss the optimal strategy. The key insight is that we should process values in sorted order and always aim for the smallest possible distinct value that doesn't conflict with previous ones.

## Optimized Approach

The optimal solution uses a **greedy approach with sorting**:

1. **Sort the array** - This allows us to process numbers in increasing order, making it easier to assign distinct values.

2. **Track the next available target** - This is the minimum value the current element should be adjusted to in order to remain distinct from all previous elements.

3. **For each element:**
   - Calculate the minimum value we can achieve: `max(nums[i] - k, target)`
   - Calculate the maximum value we can achieve: `nums[i] + k`
   - If the minimum achievable value is ≤ the maximum achievable value, we can adjust this element to a distinct value
   - Update the target to `max(min_achievable, target) + 1` for the next element

**Why this works:** By always aiming for the smallest possible distinct value, we leave more "room" for subsequent elements. This greedy choice is optimal because if we can make the current element distinct with a smaller value, choosing a larger value would only make it harder for future elements to find distinct values.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def maxDistinctElements(nums, k):
    """
    Returns the maximum number of distinct elements after adjusting each element
    by at most ±k.

    Args:
        nums: List of integers
        k: Maximum adjustment allowed per element

    Returns:
        Maximum number of distinct elements achievable
    """
    # Step 1: Sort the array to process elements in increasing order
    # This allows us to greedily assign the smallest possible distinct values
    nums.sort()

    # Step 2: Initialize target - the minimum value the next element should have
    # to be distinct from all previous elements
    target = nums[0] - k  # Start with the smallest possible value for first element

    # Step 3: Count distinct elements we can achieve
    distinct_count = 0

    # Step 4: Process each element
    for num in nums:
        # The minimum value we can assign to current element while being ≥ target
        # We can't go below num - k (minimum adjustment)
        min_possible = max(target, num - k)

        # The maximum value we can assign to current element
        max_possible = num + k

        # If we can assign a value within our adjustment range
        if min_possible <= max_possible:
            # We can make this element distinct
            distinct_count += 1
            # Update target for next element: it must be at least (current value + 1)
            # to remain distinct from this element
            target = min_possible + 1

    return distinct_count
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function maxDistinctElements(nums, k) {
  /**
   * Returns the maximum number of distinct elements after adjusting each element
   * by at most ±k.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Maximum adjustment allowed per element
   * @return {number} Maximum number of distinct elements achievable
   */

  // Step 1: Sort the array to process elements in increasing order
  // This allows us to greedily assign the smallest possible distinct values
  nums.sort((a, b) => a - b);

  // Step 2: Initialize target - the minimum value the next element should have
  // to be distinct from all previous elements
  let target = nums[0] - k; // Start with the smallest possible value for first element

  // Step 3: Count distinct elements we can achieve
  let distinctCount = 0;

  // Step 4: Process each element
  for (let num of nums) {
    // The minimum value we can assign to current element while being ≥ target
    // We can't go below num - k (minimum adjustment)
    const minPossible = Math.max(target, num - k);

    // The maximum value we can assign to current element
    const maxPossible = num + k;

    // If we can assign a value within our adjustment range
    if (minPossible <= maxPossible) {
      // We can make this element distinct
      distinctCount++;
      // Update target for next element: it must be at least (current value + 1)
      // to remain distinct from this element
      target = minPossible + 1;
    }
  }

  return distinctCount;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

public class Solution {
    public int maxDistinctElements(int[] nums, int k) {
        /**
         * Returns the maximum number of distinct elements after adjusting each element
         * by at most ±k.
         *
         * @param nums Array of integers
         * @param k Maximum adjustment allowed per element
         * @return Maximum number of distinct elements achievable
         */

        // Step 1: Sort the array to process elements in increasing order
        // This allows us to greedily assign the smallest possible distinct values
        Arrays.sort(nums);

        // Step 2: Initialize target - the minimum value the next element should have
        // to be distinct from all previous elements
        // Use long to avoid integer overflow when nums[0] - k might be very small
        long target = (long)nums[0] - k;

        // Step 3: Count distinct elements we can achieve
        int distinctCount = 0;

        // Step 4: Process each element
        for (int num : nums) {
            // The minimum value we can assign to current element while being ≥ target
            // We can't go below num - k (minimum adjustment)
            long minPossible = Math.max(target, (long)num - k);

            // The maximum value we can assign to current element
            long maxPossible = (long)num + k;

            // If we can assign a value within our adjustment range
            if (minPossible <= maxPossible) {
                // We can make this element distinct
                distinctCount++;
                // Update target for next element: it must be at least (current value + 1)
                // to remain distinct from this element
                target = minPossible + 1;
            }
        }

        return distinctCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the array takes O(n log n) time
- The single pass through the array takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity:** O(1) or O(n) depending on sorting implementation

- If sorting is done in-place (like Python's Timsort or Java's Arrays.sort for primitives), space is O(1)
- If sorting requires additional space (like merge sort), it's O(n)
- Our algorithm itself uses only O(1) extra space for variables

## Common Mistakes

1. **Not sorting the array first:** Attempting to process elements in their original order makes it impossible to apply the greedy strategy effectively. Always sort when you need to assign values in increasing order.

2. **Forgetting about the lower bound:** When calculating `min_possible = max(target, num - k)`, candidates might use just `target` and forget that we can't adjust an element below `num - k`. This could lead to attempting impossible adjustments.

3. **Integer overflow:** When `num` is large and `k` is large, `num + k` or `num - k` might overflow. In Java, use `long` for intermediate calculations. In Python and JavaScript, integers have arbitrary precision, so overflow isn't an issue.

4. **Incorrect target update:** After successfully adjusting an element, the target should be updated to `min_possible + 1` (not `num + 1` or `max_possible + 1`). We use `min_possible` because that's the actual value we assigned to the element.

## When You'll See This Pattern

This greedy sorting pattern appears in problems where you need to assign values while maintaining some ordering constraint:

1. **Minimum Number of Arrows to Burst Balloons (LeetCode 452)** - Sort by end points and greedily shoot arrows at the earliest ending balloons.

2. **Meeting Rooms II (LeetCode 253)** - Sort meetings by start time and use a min-heap to track ending times.

3. **Non-overlapping Intervals (LeetCode 435)** - Sort by end time and greedily keep intervals that end earliest.

The common theme is sorting to create an order that enables greedy choices, where each decision is locally optimal and leads to a globally optimal solution.

## Key Takeaways

1. **When you can adjust values to meet constraints, sort first.** Processing in sorted order often reveals a greedy strategy where you can assign the smallest possible value that satisfies constraints.

2. **Greedy with sorting works when local optimality implies global optimality.** If always choosing the smallest available distinct value doesn't hurt future choices, the greedy approach is valid.

3. **Track the "next available" value.** Many assignment problems benefit from maintaining a variable that represents the next available slot or minimum required value.

Related problems: [Least Number of Unique Integers after K Removals](/problem/least-number-of-unique-integers-after-k-removals)
