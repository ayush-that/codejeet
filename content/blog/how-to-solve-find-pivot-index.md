---
title: "How to Solve Find Pivot Index — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Pivot Index. Easy difficulty, 62.1% acceptance rate. Topics: Array, Prefix Sum."
date: "2026-07-02"
category: "dsa-patterns"
tags: ["find-pivot-index", "array", "prefix-sum", "easy"]
---

# How to Solve Find Pivot Index

This problem asks us to find an index in an array where the sum of elements to its left equals the sum of elements to its right. What makes this problem interesting is that it appears to require O(n²) time if we recalculate sums for each index, but with a clever prefix sum approach, we can solve it in O(n) time with O(1) space. The key insight is recognizing that we can track the running total as we iterate, avoiding redundant calculations.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 7, 3, 6, 5, 6]`.

**Step 1:** Initialize left sum = 0, total sum = 1+7+3+6+5+6 = 28

**Step 2:** Check index 0:

- Left sum = 0
- Right sum = total sum - left sum - nums[0] = 28 - 0 - 1 = 27
- 0 ≠ 27 → Not a pivot

**Step 3:** Check index 1:

- Left sum = 1 (accumulated from previous index)
- Right sum = 28 - 1 - 7 = 20
- 1 ≠ 20 → Not a pivot

**Step 4:** Check index 2:

- Left sum = 1 + 7 = 8
- Right sum = 28 - 8 - 3 = 17
- 8 ≠ 17 → Not a pivot

**Step 5:** Check index 3:

- Left sum = 8 + 3 = 11
- Right sum = 28 - 11 - 6 = 11
- 11 = 11 → Found pivot at index 3!

**Step 6:** Return 3

Notice how we efficiently update the left sum as we move through the array, and calculate the right sum using the formula: `right_sum = total_sum - left_sum - current_element`.

## Brute Force Approach

A naive approach would be to check each index by calculating the left and right sums from scratch:

For each index i:

1. Calculate sum of elements from index 0 to i-1 (left sum)
2. Calculate sum of elements from index i+1 to n-1 (right sum)
3. Compare the two sums

This requires O(n) time for each index, leading to O(n²) total time complexity. For an array of 10,000 elements, this would require about 50 million operations (10,000 × 5,000 on average), which is too slow for typical constraints.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def pivotIndexBruteForce(nums):
    n = len(nums)

    for i in range(n):
        # Calculate left sum from scratch
        left_sum = 0
        for j in range(i):
            left_sum += nums[j]

        # Calculate right sum from scratch
        right_sum = 0
        for j in range(i + 1, n):
            right_sum += nums[j]

        # Check if pivot found
        if left_sum == right_sum:
            return i

    return -1  # No pivot found
```

```javascript
// Time: O(n²) | Space: O(1)
function pivotIndexBruteForce(nums) {
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    // Calculate left sum from scratch
    let leftSum = 0;
    for (let j = 0; j < i; j++) {
      leftSum += nums[j];
    }

    // Calculate right sum from scratch
    let rightSum = 0;
    for (let j = i + 1; j < n; j++) {
      rightSum += nums[j];
    }

    // Check if pivot found
    if (leftSum === rightSum) {
      return i;
    }
  }

  return -1; // No pivot found
}
```

```java
// Time: O(n²) | Space: O(1)
public int pivotIndexBruteForce(int[] nums) {
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        // Calculate left sum from scratch
        int leftSum = 0;
        for (int j = 0; j < i; j++) {
            leftSum += nums[j];
        }

        // Calculate right sum from scratch
        int rightSum = 0;
        for (int j = i + 1; j < n; j++) {
            rightSum += nums[j];
        }

        // Check if pivot found
        if (leftSum == rightSum) {
            return i;
        }
    }

    return -1;  // No pivot found
}
```

</div>

## Optimal Solution

The optimal solution uses prefix sums to avoid redundant calculations. We calculate the total sum once, then iterate through the array while maintaining a running left sum. For each index, we can compute the right sum as `total_sum - left_sum - current_element`. This eliminates the nested loops and reduces time complexity to O(n).

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def pivotIndex(nums):
    """
    Find the pivot index where sum of left elements equals sum of right elements.

    Args:
        nums: List of integers

    Returns:
        Index of pivot, or -1 if no pivot exists
    """
    # Step 1: Calculate total sum of all elements
    total_sum = sum(nums)

    # Step 2: Initialize left sum to 0 (no elements to the left of first index)
    left_sum = 0

    # Step 3: Iterate through each index in the array
    for i in range(len(nums)):
        # Step 4: Calculate right sum using the formula:
        # right_sum = total_sum - left_sum - current_element
        # This works because: total_sum = left_sum + current_element + right_sum
        right_sum = total_sum - left_sum - nums[i]

        # Step 5: Check if left and right sums are equal
        if left_sum == right_sum:
            return i  # Found pivot index

        # Step 6: Update left sum for next iteration
        # Add current element to left sum before moving to next index
        left_sum += nums[i]

    # Step 7: If we reach here, no pivot index was found
    return -1
```

```javascript
// Time: O(n) | Space: O(1)
function pivotIndex(nums) {
  /**
   * Find the pivot index where sum of left elements equals sum of right elements.
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Index of pivot, or -1 if no pivot exists
   */
  // Step 1: Calculate total sum of all elements
  let totalSum = 0;
  for (let num of nums) {
    totalSum += num;
  }

  // Step 2: Initialize left sum to 0 (no elements to the left of first index)
  let leftSum = 0;

  // Step 3: Iterate through each index in the array
  for (let i = 0; i < nums.length; i++) {
    // Step 4: Calculate right sum using the formula:
    // rightSum = totalSum - leftSum - currentElement
    // This works because: totalSum = leftSum + currentElement + rightSum
    let rightSum = totalSum - leftSum - nums[i];

    // Step 5: Check if left and right sums are equal
    if (leftSum === rightSum) {
      return i; // Found pivot index
    }

    // Step 6: Update left sum for next iteration
    // Add current element to left sum before moving to next index
    leftSum += nums[i];
  }

  // Step 7: If we reach here, no pivot index was found
  return -1;
}
```

```java
// Time: O(n) | Space: O(1)
public int pivotIndex(int[] nums) {
    /**
     * Find the pivot index where sum of left elements equals sum of right elements.
     *
     * @param nums Array of integers
     * @return Index of pivot, or -1 if no pivot exists
     */
    // Step 1: Calculate total sum of all elements
    int totalSum = 0;
    for (int num : nums) {
        totalSum += num;
    }

    // Step 2: Initialize left sum to 0 (no elements to the left of first index)
    int leftSum = 0;

    // Step 3: Iterate through each index in the array
    for (int i = 0; i < nums.length; i++) {
        // Step 4: Calculate right sum using the formula:
        // rightSum = totalSum - leftSum - currentElement
        // This works because: totalSum = leftSum + currentElement + rightSum
        int rightSum = totalSum - leftSum - nums[i];

        // Step 5: Check if left and right sums are equal
        if (leftSum == rightSum) {
            return i;  // Found pivot index
        }

        // Step 6: Update left sum for next iteration
        // Add current element to left sum before moving to next index
        leftSum += nums[i];
    }

    // Step 7: If we reach here, no pivot index was found
    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array: one to calculate the total sum (O(n)), and one to find the pivot index (O(n)).
- In practice, we can combine these into a single pass, but the complexity remains O(n).

**Space Complexity: O(1)**

- We only use a few integer variables (`total_sum`, `left_sum`, `right_sum`, and loop counters).
- No additional data structures that grow with input size.

## Common Mistakes

1. **Incorrect right sum calculation**: Some candidates try to calculate right sum by summing from i+1 to end for each index, which leads to O(n²) time. Remember the formula: `right_sum = total_sum - left_sum - current_element`.

2. **Updating left sum at the wrong time**: The left sum should be updated AFTER checking for pivot, not before. If you update before checking, you're including the current element in the left sum when it shouldn't be there.

3. **Forgetting edge cases**:
   - Empty array: Should return -1
   - Single element array: The pivot is at index 0 because left sum (0) equals right sum (0)
   - Array with all zeros: The first index (0) is a pivot

4. **Using the pivot element in calculations**: Remember the problem says "strictly to the left" and "strictly to the right" - the pivot element itself should not be included in either sum.

## When You'll See This Pattern

The prefix sum pattern used here appears in many array problems where you need to compare sums of different subarrays:

1. **Subarray Sum Equals K (Medium)**: Uses prefix sums with a hash map to find subarrays that sum to k in O(n) time.

2. **Find the Middle Index in Array (Easy)**: Essentially the same problem with a different name - tests the exact same concept.

3. **Number of Ways to Split Array (Medium)**: Requires finding split points where the left sum is greater than or equal to the right sum, using similar prefix sum logic.

4. **Range Sum Query - Immutable (Easy)**: Uses prefix sums to answer sum queries in O(1) time after O(n) preprocessing.

## Key Takeaways

1. **Prefix sums eliminate redundant calculations**: When you need to compare sums of different array segments, precomputing prefix sums or total sums can reduce O(n²) solutions to O(n).

2. **The formula trick**: For pivot index problems, remember that `right_sum = total_sum - left_sum - current_element`. This avoids having to calculate right sums from scratch.

3. **Update order matters**: When iterating, update your running sum after checking the current position, not before. This ensures you're checking the correct boundaries.

4. **Test edge cases**: Always test with empty arrays, single-element arrays, arrays with all zeros, and arrays with negative numbers to ensure your solution handles all scenarios.

Related problems: [Subarray Sum Equals K](/problem/subarray-sum-equals-k), [Find the Middle Index in Array](/problem/find-the-middle-index-in-array), [Number of Ways to Split Array](/problem/number-of-ways-to-split-array)
