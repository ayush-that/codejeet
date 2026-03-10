---
title: "How to Solve Reduction Operations to Make the Array Elements Equal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reduction Operations to Make the Array Elements Equal. Medium difficulty, 72.5% acceptance rate. Topics: Array, Sorting."
date: "2027-04-29"
category: "dsa-patterns"
tags: ["reduction-operations-to-make-the-array-elements-equal", "array", "sorting", "medium"]
---

# How to Solve Reduction Operations to Make the Array Elements Equal

You're given an array of integers, and in each operation you must reduce the current largest value to the next largest distinct value in the array. Your goal is to make all elements equal. The challenge lies in efficiently counting how many operations are needed without simulating each reduction step-by-step.

## Visual Walkthrough

Let's trace through the example `nums = [5,1,3]`:

**Step 1:** Current array: `[5,1,3]`

- Largest value is 5 (at index 0)
- Next largest distinct value is 3
- Reduce 5 → 3: `[3,1,3]`
- Operations: 1

**Step 2:** Current array: `[3,1,3]`

- Largest value is 3 (at indices 0 and 2)
- Next largest distinct value is 1
- Reduce both 3s → 1: `[1,1,1]`
- Operations: 2 more (total 3)

Total operations: 3

Now let's try `nums = [1,1,2,2,3]`:

**Step 1:** Reduce all 3s → 2: `[1,1,2,2,2]` (1 operation)
**Step 2:** Reduce all 2s → 1: `[1,1,1,1,1]` (3 operations, since there are 3 elements with value 2)

Total operations: 1 + 3 = 4

Notice the pattern: Each time we reduce a value to the next smaller distinct value, we're essentially moving all elements at or above that value down one level. The number of operations equals the sum of counts of elements at each "level" above the minimum value.

## Brute Force Approach

A naive approach would simulate the exact process described:

1. While not all elements are equal:
   - Find the current maximum value
   - Find the next largest distinct value (second maximum)
   - Reduce all maximum values to the second maximum
   - Increment operation count

This approach has several problems:

- Finding the maximum and second maximum in each iteration takes O(n) time
- We might need O(n) operations in the worst case (when values decrease by 1 each time)
- This leads to O(n²) time complexity, which is too slow for constraints where n ≤ 10⁵

Even with optimization (like keeping elements sorted), the simulation approach is inefficient because we're repeatedly processing the same elements.

## Optimized Approach

The key insight is that we don't need to simulate each operation. Instead, we can think in terms of "levels" or "tiers":

1. Sort the array in ascending order
2. Group identical values together
3. Each unique value represents a "level" above the minimum
4. When we reduce from level i to level i-1, all elements at or above level i need to be reduced
5. The total operations = sum(count of elements at each level × levels above that level)

More formally:

- Sort the array: `[a₁ ≤ a₂ ≤ ... ≤ aₙ]`
- For each distinct value (except the smallest), count how many elements have that value
- The number of operations needed to reduce all elements with value vᵢ to the next smaller value vᵢ₋₁ equals the total number of elements with values ≥ vᵢ
- We can accumulate this count as we process from largest to smallest

Example: `[1,1,2,2,3]` sorted is already sorted

- Value 3: 1 element, needs to be reduced to 2 → 1 operation
- Value 2: 3 elements (2 original + 1 from value 3), need to be reduced to 1 → 3 operations
- Total: 1 + 3 = 4 operations

## Optimal Solution

The cleanest implementation:

1. Sort the array in ascending order
2. Traverse from the end to the beginning
3. Track the number of operations needed so far
4. Whenever we encounter a new (smaller) distinct value, add the count of elements we've seen so far to the operations

<div class="code-group">

```python
# Time: O(n log n) for sorting | Space: O(1) if we sort in-place, O(n) for timsort
def reductionOperations(nums):
    """
    Calculate the minimum number of operations to make all elements equal.

    Args:
        nums: List[int] - array of integers

    Returns:
        int - minimum number of operations required
    """
    # Step 1: Sort the array in ascending order
    # This groups identical values together and allows us to process
    # from smallest to largest (or vice versa)
    nums.sort()

    # Step 2: Initialize counters
    operations = 0  # total operations needed
    count = 0       # number of elements processed at current "level"

    # Step 3: Process from the end of the sorted array
    # We start from the second last element and move backward
    for i in range(len(nums) - 1, 0, -1):
        # Increment count for each element we pass
        count += 1

        # If current element is different from the next one (to the left),
        # we've reached a new distinct value level
        if nums[i] != nums[i - 1]:
            # All 'count' elements need to be reduced from current level
            # to the next lower level (nums[i-1])
            operations += count

    return operations
```

```javascript
// Time: O(n log n) for sorting | Space: O(1) if we sort in-place, O(n) for built-in sort
function reductionOperations(nums) {
  /**
   * Calculate the minimum number of operations to make all elements equal.
   *
   * @param {number[]} nums - array of integers
   * @return {number} - minimum number of operations required
   */

  // Step 1: Sort the array in ascending order
  // The built-in sort converts numbers to strings by default,
  // so we need to provide a compare function
  nums.sort((a, b) => a - b);

  // Step 2: Initialize counters
  let operations = 0; // total operations needed
  let count = 0; // number of elements processed at current "level"

  // Step 3: Process from the end of the sorted array
  // We start from the second last element and move backward
  for (let i = nums.length - 1; i > 0; i--) {
    // Increment count for each element we pass
    count++;

    // If current element is different from the next one (to the left),
    // we've reached a new distinct value level
    if (nums[i] !== nums[i - 1]) {
      // All 'count' elements need to be reduced from current level
      // to the next lower level (nums[i-1])
      operations += count;
    }
  }

  return operations;
}
```

```java
// Time: O(n log n) for sorting | Space: O(1) if we sort in-place, O(n) for timsort
class Solution {
    public int reductionOperations(int[] nums) {
        /**
         * Calculate the minimum number of operations to make all elements equal.
         *
         * @param nums - array of integers
         * @return minimum number of operations required
         */

        // Step 1: Sort the array in ascending order
        // Arrays.sort() uses dual-pivot quicksort for primitives
        Arrays.sort(nums);

        // Step 2: Initialize counters
        int operations = 0;  // total operations needed
        int count = 0;       // number of elements processed at current "level"

        // Step 3: Process from the end of the sorted array
        // We start from the second last element and move backward
        for (int i = nums.length - 1; i > 0; i--) {
            // Increment count for each element we pass
            count++;

            // If current element is different from the next one (to the left),
            // we've reached a new distinct value level
            if (nums[i] != nums[i - 1]) {
                // All 'count' elements need to be reduced from current level
                // to the next lower level (nums[i-1])
                operations += count;
            }
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- The dominant operation is sorting the array, which takes O(n log n) time in most languages
- The single pass through the sorted array takes O(n) time
- Total: O(n log n) + O(n) = O(n log n)

**Space Complexity:** O(1) or O(n) depending on implementation

- If the sorting algorithm is in-place (like heapsort), space is O(1)
- Python's Timsort and Java's Arrays.sort() for objects use O(n) space in worst case
- JavaScript's Array.sort() implementation varies by browser but typically uses O(n) space
- The algorithm itself uses only O(1) additional space for counters

## Common Mistakes

1. **Forgetting to sort the array**: Without sorting, you can't efficiently identify distinct value levels. Some candidates try to use a hash map to count frequencies but then struggle to process values in descending order.

2. **Off-by-one errors in the loop**: Starting the loop at `len(nums)-1` instead of `len(nums)-2`, or using `i >= 0` instead of `i > 0`. Remember we compare `nums[i]` with `nums[i-1]`, so we need to stop before `i = 0`.

3. **Incorrect counting logic**: Adding 1 instead of `count` when encountering a new distinct value. Each time we move down a level, ALL elements at or above the current level need reduction, not just the ones at the exact current level.

4. **Not handling single-element or all-equal arrays**: The algorithm correctly handles these cases (returns 0), but some implementations might have edge case bugs. Test with `[1]`, `[1,1,1]`, and `[1,2,3,4,5]`.

## When You'll See This Pattern

This problem uses the **"sorted processing with level counting"** pattern, which appears in several other problems:

1. **Minimum Increments to Make Array Unique (LeetCode 945)**: Similar concept of making array elements equal/distinct by incrementing, often solved by sorting and tracking the next available value.

2. **Minimum Operations to Make the Array Increasing (LeetCode 1827)**: Requires making array strictly increasing by incrementing elements, solved with a single pass and tracking the expected next value.

3. **Assign Cookies (LeetCode 455)**: Greedy assignment problem that benefits from sorting both arrays and processing in order.

The common theme is sorting to reveal structure, then making a single pass with cumulative counting or tracking.

## Key Takeaways

1. **Sorting reveals patterns**: When operations depend on relative values (largest, next largest), sorting often transforms the problem into something simpler.

2. **Think in terms of cumulative counts**: Instead of simulating individual operations, consider how many elements are affected by each "level change."

3. **Process from largest to smallest**: When reducing values, it's natural to start with the largest elements and work downward, which aligns with processing a sorted array from the end.

[Practice this problem on CodeJeet](/problem/reduction-operations-to-make-the-array-elements-equal)
