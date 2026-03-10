---
title: "How to Solve Smallest Range II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Smallest Range II. Medium difficulty, 37.7% acceptance rate. Topics: Array, Math, Greedy, Sorting."
date: "2028-03-06"
category: "dsa-patterns"
tags: ["smallest-range-ii", "array", "math", "greedy", "medium"]
---

# How to Solve Smallest Range II

You're given an array of integers and a value `k`. For each number, you must either add `k` or subtract `k`. Your goal is to minimize the difference between the maximum and minimum values in the resulting array. What makes this problem tricky is that each element has two possible states, creating 2ⁿ possible configurations—too many to check exhaustively for large arrays. The key insight is that sorting the array first reveals a pattern: there's a "split point" where elements before it should be increased and elements after it should be decreased.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 3, 6]`, `k = 3`

**Step 1: Sort the array** (though it's already sorted here)
Sorted: `[1, 3, 6]`

**Step 2: Understand the transformation possibilities**
Each number can become either `num + k` or `num - k`:

- 1 → 4 or -2
- 3 → 6 or 0
- 6 → 9 or 3

**Step 3: The split point insight**
After sorting, imagine a split point `i` where:

- All elements before index `i` get `+k` (they become larger)
- All elements at or after index `i` get `-k` (they become smaller)

Why does this make sense? In a sorted array, if we want to minimize the range, we generally want to bring numbers closer together. Adding `k` to smaller numbers and subtracting `k` from larger numbers helps achieve this.

**Step 4: Try different split points**

For `i = 0` (all elements get `-k`):

- 1 → -2
- 3 → 0
- 6 → 3
  Range = max(3) - min(-2) = 3 - (-2) = 5

For `i = 1` (first element gets `+k`, others get `-k`):

- 1 → 4
- 3 → 0
- 6 → 3
  Range = max(4, 3) - min(4, 0) = 4 - 0 = 4

For `i = 2` (first two get `+k`, last gets `-k`):

- 1 → 4
- 3 → 6
- 6 → 3
  Range = max(6, 4, 3) - min(6, 4, 3) = 6 - 3 = 3

For `i = 3` (all elements get `+k`):

- 1 → 4
- 3 → 6
- 6 → 9
  Range = 9 - 4 = 5

The minimum range is 3, achieved when `i = 2`.

**Step 5: The formula**
For each split point `i`:

- Minimum value = min(first element + k, element at i - k)
- Maximum value = max(last element - k, element at i-1 + k)
- Range = maximum - minimum

## Brute Force Approach

A naive approach would try all 2ⁿ possible configurations by deciding for each element whether to add or subtract `k`. For each configuration, we'd find the min and max values and track the smallest range.

```python
def smallestRangeII_brute(nums, k):
    n = len(nums)
    min_range = float('inf')

    # Try all 2^n possibilities using bitmask
    for mask in range(1 << n):
        transformed = []
        for i in range(n):
            if mask & (1 << i):
                transformed.append(nums[i] + k)
            else:
                transformed.append(nums[i] - k)

        current_range = max(transformed) - min(transformed)
        min_range = min(min_range, current_range)

    return min_range
```

**Why this fails:**

- Time complexity is O(2ⁿ × n), which grows exponentially
- For n = 20, that's over 1 million operations × 20 = 20 million operations
- For n = 30, it's over 1 billion operations × 30 = 30 billion operations
- The problem constraints don't specify n, but typical LeetCode constraints would make this too slow for n > 20

## Optimized Approach

The key insight comes from these observations:

1. **Sorting helps**: After sorting, we can think about the problem differently. The smallest possible range will come from some configuration where smaller numbers are increased and larger numbers are decreased.

2. **The split point**: There exists an index `i` where:
   - All elements before `i` get `+k`
   - All elements from `i` onward get `-k`

   Why? Consider what happens if we have a smaller number that gets `-k` and a larger number that gets `+k`—this would increase the range, which we don't want.

3. **Why check all split points?** Because we don't know where the optimal split is. The split point could be anywhere from 0 (all `-k`) to n (all `+k`).

4. **Calculating range for a split point**:
   - The smallest number will be either: `nums[0] + k` (if we add to the smallest) or `nums[i] - k` (the first number we subtract from)
   - The largest number will be either: `nums[n-1] - k` (if we subtract from the largest) or `nums[i-1] + k` (the last number we add to)
   - So: `min_val = min(nums[0] + k, nums[i] - k)`
     `max_val = max(nums[n-1] - k, nums[i-1] + k)`
     `range = max_val - min_val`

5. **Base case**: We also need to consider the initial range (if we do nothing special), which is `nums[n-1] - nums[0]`. Actually, we can think of this as either all `+k` or all `-k`, which gives the same range.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def smallestRangeII(nums, k):
    """
    Find minimum possible range after transforming each element to either +k or -k.

    Approach:
    1. Sort the array to bring order to potential transformations
    2. Consider all possible split points where:
       - Elements before split get +k (become larger)
       - Elements at/after split get -k (become smaller)
    3. For each split point, calculate the resulting range
    4. Return the minimum range found

    Why this works: In sorted order, to minimize range, we want to:
       - Increase smaller numbers (bring them up)
       - Decrease larger numbers (bring them down)
    The split point defines where we switch from increasing to decreasing.
    """
    n = len(nums)

    # Sort the array - this is crucial for the split point logic
    nums.sort()

    # Initial range if we add k to all or subtract k from all
    # Both give same range: (max - min)
    result = nums[-1] - nums[0]

    # Try all possible split points
    # i represents the first index that gets -k
    # Elements before i get +k, elements from i onward get -k
    for i in range(1, n):
        # For split at i:
        # - nums[0] + k is the smallest of the increased numbers
        # - nums[i] - k is the smallest of the decreased numbers
        # The overall minimum is the smaller of these two
        min_val = min(nums[0] + k, nums[i] - k)

        # - nums[i-1] + k is the largest of the increased numbers
        # - nums[-1] - k is the largest of the decreased numbers
        # The overall maximum is the larger of these two
        max_val = max(nums[i-1] + k, nums[-1] - k)

        # Update result with the minimum range found so far
        result = min(result, max_val - min_val)

    return result
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
/**
 * Find minimum possible range after transforming each element to either +k or -k.
 *
 * @param {number[]} nums - The input array
 * @param {number} k - The value to add/subtract
 * @return {number} - Minimum possible range
 */
function smallestRangeII(nums, k) {
  const n = nums.length;

  // Sort the array - crucial for split point logic
  nums.sort((a, b) => a - b);

  // Initial range if we add k to all or subtract k from all
  let result = nums[n - 1] - nums[0];

  // Try all possible split points
  // i represents the first index that gets -k
  // Elements before i get +k, elements from i onward get -k
  for (let i = 1; i < n; i++) {
    // Calculate minimum value after transformation
    // nums[0] + k is smallest of increased numbers
    // nums[i] - k is smallest of decreased numbers
    const minVal = Math.min(nums[0] + k, nums[i] - k);

    // Calculate maximum value after transformation
    // nums[i-1] + k is largest of increased numbers
    // nums[n-1] - k is largest of decreased numbers
    const maxVal = Math.max(nums[i - 1] + k, nums[n - 1] - k);

    // Update result with minimum range found so far
    result = Math.min(result, maxVal - minVal);
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
import java.util.Arrays;

class Solution {
    /**
     * Find minimum possible range after transforming each element to either +k or -k.
     *
     * @param nums The input array
     * @param k The value to add/subtract
     * @return Minimum possible range
     */
    public int smallestRangeII(int[] nums, int k) {
        int n = nums.length;

        // Sort the array - crucial for split point logic
        Arrays.sort(nums);

        // Initial range if we add k to all or subtract k from all
        int result = nums[n - 1] - nums[0];

        // Try all possible split points
        // i represents the first index that gets -k
        // Elements before i get +k, elements from i onward get -k
        for (int i = 1; i < n; i++) {
            // Calculate minimum value after transformation
            // nums[0] + k is smallest of increased numbers
            // nums[i] - k is smallest of decreased numbers
            int minVal = Math.min(nums[0] + k, nums[i] - k);

            // Calculate maximum value after transformation
            // nums[i-1] + k is largest of increased numbers
            // nums[n-1] - k is largest of decreased numbers
            int maxVal = Math.max(nums[i - 1] + k, nums[n - 1] - k);

            // Update result with minimum range found so far
            result = Math.min(result, maxVal - minVal);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time
- The loop that checks all split points runs O(n) times
- Each iteration does constant work (min/max calculations)
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity: O(1) or O(n)**

- If the sort is in-place (like Python's Timsort for arrays), it's O(1) extra space
- If the sort uses additional space (like merge sort), it's O(n)
- The algorithm itself uses only O(1) extra space beyond sorting

## Common Mistakes

1. **Not sorting the array first**: This is the most critical step. Without sorting, the split point logic doesn't work because we can't guarantee that increasing earlier elements and decreasing later elements is optimal.

2. **Forgetting the initial range**: Some candidates only check split points from 1 to n-1, forgetting that doing the same operation to all elements (all +k or all -k) is also a valid configuration. This is covered by our initial `result` value.

3. **Incorrect index handling in the loop**:
   - Using `nums[i]` instead of `nums[i] - k` for the minimum calculation
   - Using `nums[i-1]` instead of `nums[i-1] + k` for the maximum calculation
   - Starting the loop from 0 instead of 1 (which would cause index out of bounds when accessing `nums[i-1]`)

4. **Misunderstanding what 'i' represents**: Remember that `i` is the first index that gets `-k`. Elements before `i` get `+k`. This is counterintuitive for some—they think `i` should be the last index that gets `+k`.

## When You'll See This Pattern

This "split point" or "divide array into two groups" pattern appears in several optimization problems:

1. **Best Time to Buy and Sell Stock with Transaction Fee** (LeetCode 714): You need to decide when to buy and sell, which creates a natural split in the timeline.

2. **Partition Array for Maximum Sum** (LeetCode 1043): You split the array into subarrays of at most length k and maximize the sum.

3. **Split Array Largest Sum** (LeetCode 410): Divide array into m subarrays to minimize the largest sum among them.

The common theme is: after sorting or arranging data in some order, you look for an optimal point to divide the data into two groups with different treatments.

## Key Takeaways

1. **When each element has binary choices**, look for an ordering that simplifies the decision. Sorting often reveals that the optimal solution has a monotonic property (like "increase smaller elements, decrease larger elements").

2. **The "split point" technique** is powerful for optimization problems where you need to divide data into two groups with different treatments. After sorting, you can try all possible split points in O(n) time.

3. **Always consider edge cases**: What if all elements get the same operation? What if the array has 1 element? What if k is 0? Test these mentally before coding.

[Practice this problem on CodeJeet](/problem/smallest-range-ii)
