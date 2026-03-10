---
title: "How to Solve Minimum Average Difference — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Average Difference. Medium difficulty, 43.8% acceptance rate. Topics: Array, Prefix Sum."
date: "2027-07-12"
category: "dsa-patterns"
tags: ["minimum-average-difference", "array", "prefix-sum", "medium"]
---

# How to Solve Minimum Average Difference

This problem asks us to find the index where splitting an array minimizes the absolute difference between the average of the left part and the average of the right part. What makes this tricky is that we need to compute averages for **every possible split point** efficiently, and handle edge cases like when the right part is empty (which should be treated as 0 average).

## Visual Walkthrough

Let's trace through a concrete example: `nums = [2, 5, 3, 9, 5, 3]`

We need to check every possible split point `i` (from 0 to n-1):

- At `i = 0`: Left = [2], Right = [5, 3, 9, 5, 3]
  - Left average = 2/1 = 2
  - Right average = (5+3+9+5+3)/5 = 25/5 = 5
  - Difference = |2 - 5| = 3

- At `i = 1`: Left = [2, 5], Right = [3, 9, 5, 3]
  - Left average = (2+5)/2 = 7/2 = 3 (integer division: floor(3.5) = 3)
  - Right average = (3+9+5+3)/4 = 20/4 = 5
  - Difference = |3 - 5| = 2

- At `i = 2`: Left = [2, 5, 3], Right = [9, 5, 3]
  - Left average = (2+5+3)/3 = 10/3 = 3 (floor(3.33) = 3)
  - Right average = (9+5+3)/3 = 17/3 = 5 (floor(5.67) = 5)
  - Difference = |3 - 5| = 2

- At `i = 3`: Left = [2, 5, 3, 9], Right = [5, 3]
  - Left average = (2+5+3+9)/4 = 19/4 = 4 (floor(4.75) = 4)
  - Right average = (5+3)/2 = 8/2 = 4
  - Difference = |4 - 4| = 0 ← Minimum found!

- At `i = 4`: Left = [2, 5, 3, 9, 5], Right = [3]
  - Left average = (2+5+3+9+5)/5 = 24/5 = 4 (floor(4.8) = 4)
  - Right average = 3/1 = 3
  - Difference = |4 - 3| = 1

- At `i = 5`: Left = [2, 5, 3, 9, 5, 3], Right = []
  - Left average = (2+5+3+9+5+3)/6 = 27/6 = 4 (floor(4.5) = 4)
  - Right average = 0 (by definition when right part is empty)
  - Difference = |4 - 0| = 4

The minimum difference is 0 at index 3.

## Brute Force Approach

The most straightforward approach is to compute averages for each split point by summing the elements on each side every time:

1. For each index `i` from 0 to n-1:
   - Sum the first `i+1` elements to get left sum
   - Sum the last `n-i-1` elements to get right sum
   - Compute left average = left sum / (i+1)
   - Compute right average = right sum / (n-i-1) if right part not empty, else 0
   - Calculate absolute difference
   - Track the minimum difference and corresponding index

The problem with this approach is **time complexity**: For each of n indices, we sum up to n elements, resulting in O(n²) time. For n up to 10⁵ (as in LeetCode constraints), this is far too slow.

## Optimized Approach

The key insight is that we can use **prefix sums** to avoid recomputing sums repeatedly. A prefix sum array `prefix[i]` stores the sum of the first `i+1` elements (or elements up to index i).

Here's the step-by-step reasoning:

1. **Precompute total sum**: First, calculate the sum of all elements in the array.

2. **Use running sums**: As we iterate through the array:
   - Maintain a running sum of the left part
   - The right sum can be computed as `total_sum - left_sum`
   - This gives us O(1) access to both sums at each split point

3. **Handle edge cases**:
   - When i = n-1 (last index), the right part is empty, so right average = 0
   - Use integer division (floor) for averages as specified

4. **Track minimum**: Keep track of the minimum difference and the index where it occurs.

This reduces the time complexity from O(n²) to O(n) with O(1) extra space (or O(n) if we precompute prefix sums in an array).

## Optimal Solution

Here's the complete solution using prefix sums:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumAverageDifference(nums):
    n = len(nums)

    # Edge case: if array is empty, return 0
    if n == 0:
        return 0

    # Calculate total sum of all elements
    total_sum = sum(nums)

    # Initialize variables
    left_sum = 0
    min_avg_diff = float('inf')
    result_index = 0

    # Iterate through each possible split point
    for i in range(n):
        # Add current element to left sum
        left_sum += nums[i]

        # Calculate left average: floor(left_sum / (i+1))
        left_avg = left_sum // (i + 1)

        # Calculate right average
        if i == n - 1:
            # When we're at the last element, right part is empty
            right_avg = 0
        else:
            # Right sum = total_sum - left_sum
            # Right count = n - i - 1
            right_avg = (total_sum - left_sum) // (n - i - 1)

        # Calculate absolute difference
        diff = abs(left_avg - right_avg)

        # Update minimum if we found a smaller difference
        # If tie, keep the smaller index
        if diff < min_avg_diff:
            min_avg_diff = diff
            result_index = i

    return result_index
```

```javascript
// Time: O(n) | Space: O(1)
function minimumAverageDifference(nums) {
  const n = nums.length;

  // Edge case: if array is empty, return 0
  if (n === 0) return 0;

  // Calculate total sum of all elements
  let totalSum = 0;
  for (let num of nums) {
    totalSum += num;
  }

  // Initialize variables
  let leftSum = 0;
  let minAvgDiff = Infinity;
  let resultIndex = 0;

  // Iterate through each possible split point
  for (let i = 0; i < n; i++) {
    // Add current element to left sum
    leftSum += nums[i];

    // Calculate left average: Math.floor(leftSum / (i+1))
    const leftAvg = Math.floor(leftSum / (i + 1));

    // Calculate right average
    let rightAvg;
    if (i === n - 1) {
      // When we're at the last element, right part is empty
      rightAvg = 0;
    } else {
      // Right sum = totalSum - leftSum
      // Right count = n - i - 1
      rightAvg = Math.floor((totalSum - leftSum) / (n - i - 1));
    }

    // Calculate absolute difference
    const diff = Math.abs(leftAvg - rightAvg);

    // Update minimum if we found a smaller difference
    // If tie, keep the smaller index
    if (diff < minAvgDiff) {
      minAvgDiff = diff;
      resultIndex = i;
    }
  }

  return resultIndex;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minimumAverageDifference(int[] nums) {
        int n = nums.length;

        // Edge case: if array is empty, return 0
        if (n == 0) return 0;

        // Calculate total sum of all elements
        long totalSum = 0;  // Use long to prevent overflow
        for (int num : nums) {
            totalSum += num;
        }

        // Initialize variables
        long leftSum = 0;
        long minAvgDiff = Long.MAX_VALUE;
        int resultIndex = 0;

        // Iterate through each possible split point
        for (int i = 0; i < n; i++) {
            // Add current element to left sum
            leftSum += nums[i];

            // Calculate left average: leftSum / (i+1)
            long leftAvg = leftSum / (i + 1);

            // Calculate right average
            long rightAvg;
            if (i == n - 1) {
                // When we're at the last element, right part is empty
                rightAvg = 0;
            } else {
                // Right sum = totalSum - leftSum
                // Right count = n - i - 1
                rightAvg = (totalSum - leftSum) / (n - i - 1);
            }

            // Calculate absolute difference
            long diff = Math.abs(leftAvg - rightAvg);

            // Update minimum if we found a smaller difference
            // If tie, keep the smaller index
            if (diff < minAvgDiff) {
                minAvgDiff = diff;
                resultIndex = i;
            }
        }

        return resultIndex;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass to compute the total sum: O(n)
- We make another pass through the array to check each split point: O(n)
- At each split point, we do O(1) operations (addition, subtraction, division)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a few variables: `total_sum`, `left_sum`, `min_avg_diff`, `result_index`
- No additional data structures that scale with input size
- Even if we used a prefix sum array, it would be O(n), but we can optimize to O(1) by computing running sums

## Common Mistakes

1. **Integer overflow**: When dealing with large arrays (n up to 10⁵) and potentially large numbers (up to 10⁵), the sums can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, no issue in Python, BigInt if needed in JavaScript).

2. **Wrong average calculation for empty right part**: When i = n-1, the right part has no elements. The problem states this should be treated as 0 average, not division by zero. Many candidates forget this edge case.

3. **Using floating-point division instead of integer division**: The problem specifies averages should be "rounded down to the nearest integer." Using float division and then Math.floor() works, but integer division (// in Python, / with integers in Java/JavaScript) is cleaner and avoids precision issues.

4. **Not handling ties correctly**: When two indices have the same minimum average difference, we should return the smaller index. The comparison `if diff < min_avg_diff` (not `<=`) ensures we keep the first occurrence.

## When You'll See This Pattern

The prefix sum/running sum pattern appears in many array problems where you need to compute something about subarrays efficiently:

1. **Number of Ways to Split Array (Medium)**: Count valid splits where left sum ≥ right sum. Uses the same running sum technique.

2. **Split Array With Same Average (Hard)**: More complex version where you need to find if you can split into two groups with equal averages.

3. **Maximum Subarray (Easy)**: Kadane's algorithm uses a similar running sum concept to find maximum subarray sum.

4. **Product of Array Except Self (Medium)**: Uses prefix and suffix products, similar to prefix sums.

## Key Takeaways

1. **Prefix sums transform O(n²) to O(n)**: When you need to compute sums of subarrays repeatedly, precomputing prefix sums (or using running sums) is often the key optimization.

2. **Watch for edge cases at boundaries**: The first and last indices often have special cases (empty left or right parts). Always test these explicitly.

3. **Integer vs floating-point matters**: Pay attention to whether the problem requires exact integer division or floating-point precision. Using the wrong type can lead to incorrect results or performance issues.

Related problems: [Split Array With Same Average](/problem/split-array-with-same-average), [Number of Ways to Split Array](/problem/number-of-ways-to-split-array)
