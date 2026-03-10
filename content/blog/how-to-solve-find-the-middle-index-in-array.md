---
title: "How to Solve Find the Middle Index in Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Middle Index in Array. Easy difficulty, 69.2% acceptance rate. Topics: Array, Prefix Sum."
date: "2026-07-22"
category: "dsa-patterns"
tags: ["find-the-middle-index-in-array", "array", "prefix-sum", "easy"]
---

# How to Solve Find the Middle Index in Array

This problem asks us to find the leftmost index in an array where the sum of elements to its left equals the sum of elements to its right. What makes this problem interesting is that it looks like it requires O(n²) time if we recalculate sums repeatedly, but there's a clever optimization using prefix sums that brings it down to O(n) time with minimal extra space. The key insight is recognizing that we can track the total sum once and maintain a running left sum as we iterate.

## Visual Walkthrough

Let's trace through the example `nums = [2, 3, -1, 8, 4]`:

**Step 1:** Calculate total sum = 2 + 3 + (-1) + 8 + 4 = 16

**Step 2:** Initialize leftSum = 0 (sum of elements to left of index 0)

**Step 3:** Check index 0:

- leftSum = 0
- rightSum = totalSum - leftSum - nums[0] = 16 - 0 - 2 = 14
- 0 ≠ 14 → not a middle index

**Step 4:** Check index 1:

- leftSum = 2 (from previous index)
- rightSum = totalSum - leftSum - nums[1] = 16 - 2 - 3 = 11
- 2 ≠ 11 → not a middle index

**Step 5:** Check index 2:

- leftSum = 2 + 3 = 5
- rightSum = totalSum - leftSum - nums[2] = 16 - 5 - (-1) = 12
- 5 ≠ 12 → not a middle index

**Step 6:** Check index 3:

- leftSum = 2 + 3 + (-1) = 4
- rightSum = totalSum - leftSum - nums[3] = 16 - 4 - 8 = 4
- 4 = 4 ✓ → found middle index at position 3

We return 3 as the answer. Notice how we efficiently compute rightSum using totalSum - leftSum - current element, avoiding the need to sum the right side separately each time.

## Brute Force Approach

A naive solution would be to check each index by calculating the left and right sums from scratch:

For each index i:

1. Sum elements from index 0 to i-1 for left sum
2. Sum elements from index i+1 to n-1 for right sum
3. Compare the two sums

This approach requires O(n) time to calculate sums for each of n indices, resulting in O(n²) total time complexity. While this would work for small arrays, it's inefficient for larger inputs. The space complexity would be O(1) since we only use a few variables.

Here's what the brute force might look like:

```python
def findMiddleIndexBrute(nums):
    n = len(nums)
    for i in range(n):
        left_sum = sum(nums[:i])  # O(i) time
        right_sum = sum(nums[i+1:])  # O(n-i) time
        if left_sum == right_sum:
            return i
    return -1
```

The problem with this approach is the repeated summation. For an array of length n, we're doing roughly n²/2 operations, which becomes impractical for arrays with thousands of elements.

## Optimal Solution

The optimal solution uses prefix sums to avoid recalculating sums. We calculate the total sum once, then iterate through the array while maintaining a running left sum. For each index, we can compute the right sum as totalSum - leftSum - currentElement. This gives us O(n) time complexity with O(1) extra space.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findMiddleIndex(nums):
    """
    Find the leftmost middle index where sum of left elements equals sum of right elements.

    Args:
        nums: List of integers

    Returns:
        The leftmost middle index, or -1 if none exists
    """
    # Step 1: Calculate total sum of all elements
    total_sum = sum(nums)

    # Step 2: Initialize left sum to 0 (no elements to the left of index 0)
    left_sum = 0

    # Step 3: Iterate through each index in the array
    for i in range(len(nums)):
        # Step 4: Calculate right sum using the formula:
        # right_sum = total_sum - left_sum - current_element
        # This avoids having to sum the right side separately
        right_sum = total_sum - left_sum - nums[i]

        # Step 5: Check if left sum equals right sum
        if left_sum == right_sum:
            return i  # Found the leftmost middle index

        # Step 6: Update left sum for the next iteration
        # Add current element to left sum since it will be to the left
        # of the next index we check
        left_sum += nums[i]

    # Step 7: If no middle index found, return -1
    return -1
```

```javascript
// Time: O(n) | Space: O(1)
function findMiddleIndex(nums) {
  /**
   * Find the leftmost middle index where sum of left elements equals sum of right elements.
   *
   * @param {number[]} nums - Array of integers
   * @return {number} The leftmost middle index, or -1 if none exists
   */
  // Step 1: Calculate total sum of all elements
  let totalSum = 0;
  for (let num of nums) {
    totalSum += num;
  }

  // Step 2: Initialize left sum to 0 (no elements to the left of index 0)
  let leftSum = 0;

  // Step 3: Iterate through each index in the array
  for (let i = 0; i < nums.length; i++) {
    // Step 4: Calculate right sum using the formula:
    // rightSum = totalSum - leftSum - currentElement
    // This avoids having to sum the right side separately
    const rightSum = totalSum - leftSum - nums[i];

    // Step 5: Check if left sum equals right sum
    if (leftSum === rightSum) {
      return i; // Found the leftmost middle index
    }

    // Step 6: Update left sum for the next iteration
    // Add current element to left sum since it will be to the left
    // of the next index we check
    leftSum += nums[i];
  }

  // Step 7: If no middle index found, return -1
  return -1;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int findMiddleIndex(int[] nums) {
        /**
         * Find the leftmost middle index where sum of left elements equals sum of right elements.
         *
         * @param nums Array of integers
         * @return The leftmost middle index, or -1 if none exists
         */
        // Step 1: Calculate total sum of all elements
        int totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }

        // Step 2: Initialize left sum to 0 (no elements to the left of index 0)
        int leftSum = 0;

        // Step 3: Iterate through each index in the array
        for (int i = 0; i < nums.length; i++) {
            // Step 4: Calculate right sum using the formula:
            // rightSum = totalSum - leftSum - currentElement
            // This avoids having to sum the right side separately
            int rightSum = totalSum - leftSum - nums[i];

            // Step 5: Check if left sum equals right sum
            if (leftSum == rightSum) {
                return i;  // Found the leftmost middle index
            }

            // Step 6: Update left sum for the next iteration
            // Add current element to left sum since it will be to the left
            // of the next index we check
            leftSum += nums[i];
        }

        // Step 7: If no middle index found, return -1
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass to calculate the total sum: O(n)
- We make another pass to find the middle index: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a few variables (totalSum, leftSum, rightSum, loop counter)
- No additional data structures that grow with input size

The key optimization is calculating the total sum once and reusing it to compute right sums efficiently. This eliminates the need for nested loops or prefix sum arrays.

## Common Mistakes

1. **Off-by-one errors in index boundaries**: When calculating right sums, some candidates might use `totalSum - leftSum` without subtracting the current element, which would include the current element in the right sum. Remember: right sum should exclude the current element.

2. **Forgetting to handle edge cases**:
   - Empty array: Should return -1
   - Single element array: The middle index is 0 because left sum and right sum are both 0
   - Array with all zeros: The leftmost middle index is 0

3. **Updating left sum at the wrong time**: The left sum should be updated AFTER checking the current index, not before. If you update before checking, you're including the current element in the left sum when it shouldn't be there.

4. **Not returning immediately when finding the leftmost index**: Since we're looking for the leftmost middle index, we should return as soon as we find one. Continuing to search would be inefficient and could return a non-leftmost index if we're not careful.

## When You'll See This Pattern

The prefix sum pattern used here appears in many array problems where you need to compare sums of different subarrays. The core idea is to precompute cumulative sums to answer range sum queries efficiently.

**Related problems:**

1. **Find Pivot Index (LeetCode 724)**: This is essentially the same problem with a different name. The solution is identical.
2. **Partition Array Into Three Parts With Equal Sum (LeetCode 1013)**: Uses similar prefix sum logic to find partition points.
3. **Number of Ways to Split Array (LeetCode 2270)**: Requires comparing left and right sums at various split points, using prefix sums for efficiency.
4. **Subarray Sum Equals K (LeetCode 560)**: Uses prefix sums with hash maps to find subarrays with a specific sum.

## Key Takeaways

1. **Prefix sums optimize repeated sum calculations**: When you need to calculate sums of different subarrays repeatedly, precomputing prefix sums (or in this case, just the total sum) can reduce time complexity from O(n²) to O(n).

2. **The right sum trick**: For problems comparing left and right sums around a pivot, remember that `rightSum = totalSum - leftSum - currentElement`. This avoids needing to maintain a separate right sum variable.

3. **Early termination for leftmost matches**: When searching for the leftmost index satisfying a condition, return immediately when you find it during a left-to-right traversal.

This problem teaches a fundamental optimization technique that's widely applicable in array processing problems. Recognizing when to use prefix sums is a key skill for coding interviews.

Related problems: [Find Pivot Index](/problem/find-pivot-index), [Partition Array Into Three Parts With Equal Sum](/problem/partition-array-into-three-parts-with-equal-sum), [Number of Ways to Split Array](/problem/number-of-ways-to-split-array)
