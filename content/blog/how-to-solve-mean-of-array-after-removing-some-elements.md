---
title: "How to Solve Mean of Array After Removing Some Elements — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Mean of Array After Removing Some Elements. Easy difficulty, 71.5% acceptance rate. Topics: Array, Sorting."
date: "2027-10-18"
category: "dsa-patterns"
tags: ["mean-of-array-after-removing-some-elements", "array", "sorting", "easy"]
---

# How to Solve Mean of Array After Removing Some Elements

This problem asks us to calculate the mean of an array after removing the smallest 5% and largest 5% of elements. While conceptually straightforward, it requires careful handling of array indices and floating-point precision. The interesting part is determining exactly which elements to exclude when the array length isn't perfectly divisible by 20 (since 5% = 1/20).

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `arr = [6,2,7,5,1,2,0,3,10,2,5,0,5,5,0,8,7,6,8,0]` with 20 elements.

**Step 1: Sort the array**
Sorted: `[0,0,0,0,1,2,2,2,3,5,5,5,5,6,6,7,7,8,8,10]`

**Step 2: Calculate how many elements to remove from each end**

- Array length: 20
- 5% of 20 = 20 × 0.05 = 1 element from each end
- We'll remove 1 smallest and 1 largest element

**Step 3: Identify which elements to keep**

- Remove indices 0 (smallest: 0) and 19 (largest: 10)
- Keep indices 1 through 18 inclusive

**Step 4: Calculate the mean of remaining elements**
Sum of elements at indices 1-18: `0+0+0+1+2+2+2+3+5+5+5+5+6+6+7+7+8+8 = 72`
Number of elements: 18
Mean: 72 ÷ 18 = 4.0

**Edge case example:** What if the array has 21 elements?

- 5% of 21 = 1.05 elements
- Since we can't remove fractions of elements, we need to round: remove 1 element from each end
- This is why we use integer division: `n // 20` gives us exactly how many to remove

## Brute Force Approach

A naive approach might try to find and remove elements without sorting first. However, this becomes complex because:

1. We need to identify which elements are in the smallest 5% and largest 5%
2. We can't just remove all occurrences of the minimum and maximum values, as we need to remove exactly 5% of elements from each end when sorted
3. Without sorting, we'd need multiple passes to find the cutoff values

The brute force would essentially be: find the 5th percentile value, find the 95th percentile value, then remove all elements below/above those thresholds. But this fails when there are duplicate values at the boundaries.

The only reasonable approach is to sort first, which gives us direct access to the elements we need to exclude.

## Optimal Solution

The optimal solution follows these steps:

1. Sort the array to bring smallest elements to the front and largest to the back
2. Calculate how many elements to remove from each end (5% of total)
3. Sum only the middle elements (excluding the first and last 5%)
4. Calculate the mean by dividing the sum by the count of remaining elements

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def trimMean(arr):
    """
    Calculate mean after removing smallest and largest 5% of elements.

    Steps:
    1. Sort the array to easily identify smallest/largest elements
    2. Calculate number of elements to remove from each end (5% of total)
    3. Sum only the middle portion (excluding removed elements)
    4. Calculate and return the mean
    """
    # Step 1: Sort the array - O(n log n)
    arr.sort()

    # Step 2: Calculate how many elements to remove from each end
    # 5% of n = n * 0.05 = n // 20 (integer division)
    n = len(arr)
    remove_count = n // 20  # Number to remove from each end

    # Step 3: Sum only the middle elements
    # We skip first 'remove_count' and last 'remove_count' elements
    total = 0
    for i in range(remove_count, n - remove_count):
        total += arr[i]

    # Step 4: Calculate mean
    # Number of remaining elements = n - 2*remove_count
    remaining_count = n - 2 * remove_count
    mean = total / remaining_count

    return mean
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function trimMean(arr) {
  /**
   * Calculate mean after removing smallest and largest 5% of elements.
   *
   * Steps:
   * 1. Sort the array to easily identify smallest/largest elements
   * 2. Calculate number of elements to remove from each end (5% of total)
   * 3. Sum only the middle portion (excluding removed elements)
   * 4. Calculate and return the mean
   */

  // Step 1: Sort the array - O(n log n)
  // Note: JavaScript sort() sorts lexicographically by default for strings,
  // so we need a comparator for numeric sorting
  arr.sort((a, b) => a - b);

  // Step 2: Calculate how many elements to remove from each end
  // 5% of n = n * 0.05 = Math.floor(n / 20)
  const n = arr.length;
  const removeCount = Math.floor(n / 20); // Number to remove from each end

  // Step 3: Sum only the middle elements
  // We skip first 'removeCount' and last 'removeCount' elements
  let total = 0;
  for (let i = removeCount; i < n - removeCount; i++) {
    total += arr[i];
  }

  // Step 4: Calculate mean
  // Number of remaining elements = n - 2*removeCount
  const remainingCount = n - 2 * removeCount;
  const mean = total / remainingCount;

  return mean;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

class Solution {
    public double trimMean(int[] arr) {
        /**
         * Calculate mean after removing smallest and largest 5% of elements.
         *
         * Steps:
         * 1. Sort the array to easily identify smallest/largest elements
         * 2. Calculate number of elements to remove from each end (5% of total)
         * 3. Sum only the middle portion (excluding removed elements)
         * 4. Calculate and return the mean
         */

        // Step 1: Sort the array - O(n log n)
        Arrays.sort(arr);

        // Step 2: Calculate how many elements to remove from each end
        // 5% of n = n * 0.05 = n / 20 (integer division)
        int n = arr.length;
        int removeCount = n / 20;  // Number to remove from each end

        // Step 3: Sum only the middle elements
        // We skip first 'removeCount' and last 'removeCount' elements
        double total = 0;
        for (int i = removeCount; i < n - removeCount; i++) {
            total += arr[i];
        }

        // Step 4: Calculate mean
        // Number of remaining elements = n - 2*removeCount
        int remainingCount = n - 2 * removeCount;
        double mean = total / remainingCount;

        return mean;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- The dominant operation is sorting the array, which takes O(n log n) time in most programming languages
- The subsequent loop to sum the middle elements takes O(n) time
- Since O(n log n) dominates O(n), the overall time complexity is O(n log n)

**Space Complexity: O(1) or O(n) depending on language**

- In Python: `list.sort()` sorts in-place, so O(1) additional space
- In JavaScript: The ECMAScript specification doesn't guarantee in-place sorting, but most implementations use O(1) space
- In Java: `Arrays.sort()` for primitive types uses a dual-pivot quicksort with O(log n) stack space
- The additional variables use O(1) space regardless of language

## Common Mistakes

1. **Incorrect removal count calculation**: Using floating-point math (`n * 0.05`) instead of integer division (`n // 20` or `Math.floor(n / 20)`). Since we can't remove fractions of elements, we must use integer division.

2. **Off-by-one errors in loop boundaries**: When iterating from `remove_count` to `n - remove_count`, remember that the end index is exclusive in most languages. Using `<=` instead of `<` would include one extra element.

3. **Forgetting to sort the array**: Attempting to find and remove elements without sorting first leads to complex logic and potential errors, especially with duplicate values.

4. **Integer division when calculating mean**: Using integer division (`total // remaining_count`) instead of floating-point division. This would truncate the decimal portion of the mean.

5. **Not handling the return type correctly**: In Java, returning an `int` instead of `double`, or in Python using `//` instead of `/` for division.

## When You'll See This Pattern

This problem uses the "sort and select" pattern, which appears in many algorithmic problems:

1. **Kth Largest Element in an Array (LeetCode 215)**: Find the kth largest element by sorting and selecting, or using a heap for optimization.

2. **Top K Frequent Elements (LeetCode 347)**: Sort elements by frequency and select the top k.

3. **Minimum Moves to Equal Array Elements II (LeetCode 462)**: Sort the array and find the median, which minimizes the total distance.

4. **Array Partition I (LeetCode 561)**: Sort the array and pair elements to maximize the sum of minimums in each pair.

The core insight is that sorting transforms positional problems (like "smallest 5%") into index-based problems, which are much easier to solve.

## Key Takeaways

1. **Sorting simplifies selection problems**: When you need to select elements based on their relative position (smallest, largest, percentiles), sorting first makes the problem trivial.

2. **Integer division for discrete counts**: When dealing with percentages of discrete items (like array elements), use integer division to determine how many items to include/exclude.

3. **Careful boundary management**: Pay close attention to loop indices when working with subarrays, especially when excluding elements from both ends.

4. **Precision matters with means**: Use floating-point division and be aware of precision requirements (the problem accepts answers within 10⁻⁵ of the actual value).

[Practice this problem on CodeJeet](/problem/mean-of-array-after-removing-some-elements)
