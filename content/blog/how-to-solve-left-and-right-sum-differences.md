---
title: "How to Solve Left and Right Sum Differences — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Left and Right Sum Differences. Easy difficulty, 87.9% acceptance rate. Topics: Array, Prefix Sum."
date: "2028-08-05"
category: "dsa-patterns"
tags: ["left-and-right-sum-differences", "array", "prefix-sum", "easy"]
---

# How to Solve Left and Right Sum Differences

This problem asks us to calculate, for each position in an array, the absolute difference between the sum of elements to its left and the sum of elements to its right. While conceptually straightforward, it introduces the powerful **prefix sum** pattern that forms the foundation for many array optimization problems. The challenge lies in implementing this efficiently without recalculating sums repeatedly.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [10, 4, 8, 3]`

**Step 1: Understanding what we need**
For each index `i`, we need:

- `leftSum[i]` = sum of all elements with indices less than `i`
- `rightSum[i]` = sum of all elements with indices greater than `i`
- `answer[i]` = `|leftSum[i] - rightSum[i]|`

**Step 2: Calculate manually**

- Index 0:
  - Left: No elements → 0
  - Right: sum of [4, 8, 3] = 15
  - Difference: |0 - 15| = 15
- Index 1:
  - Left: [10] → 10
  - Right: [8, 3] → 11
  - Difference: |10 - 11| = 1
- Index 2:
  - Left: [10, 4] → 14
  - Right: [3] → 3
  - Difference: |14 - 3| = 11
- Index 3:
  - Left: [10, 4, 8] → 22
  - Right: No elements → 0
  - Difference: |22 - 0| = 22

Final answer: `[15, 1, 11, 22]`

Notice that calculating each sum from scratch would be inefficient. This is where prefix sums come in.

## Brute Force Approach

A naive approach would calculate each left and right sum independently for every index:

1. For each index `i` from 0 to n-1:
   - Calculate left sum by summing elements from index 0 to i-1
   - Calculate right sum by summing elements from i+1 to n-1
   - Compute absolute difference

**Why this is inefficient:**

- Time complexity: O(n²) because for each of n positions, we're summing up to n elements
- We're doing redundant work — recalculating overlapping sums repeatedly
- For an array of size 1000, we'd perform about 500,000 operations instead of the optimal ~2000

While this would technically work for small inputs (n ≤ 100), it fails the efficiency requirements for larger arrays.

## Optimal Solution

The key insight is that we can compute all left sums in one pass and all right sums in another pass using **prefix sums**. Even better, we can compute the answer in a single pass by tracking the running left sum and calculating the right sum using the total sum.

**Algorithm:**

1. Calculate the total sum of all elements
2. Initialize left sum as 0
3. For each index i from 0 to n-1:
   - Right sum = total sum - left sum - nums[i]
   - Compute |left sum - right sum|
   - Add nums[i] to left sum for the next iteration

This works because:

- At any index i, elements before i are already in left sum
- Elements after i = total sum - (elements before i + current element)

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output array
def leftRightDifference(nums):
    """
    Calculate absolute difference between left and right sums for each index.

    Args:
        nums: List of integers

    Returns:
        List of absolute differences
    """
    # Step 1: Calculate total sum of all elements
    total_sum = sum(nums)

    # Step 2: Initialize left sum (no elements to the left of first index)
    left_sum = 0

    # Step 3: Initialize result array
    answer = [0] * len(nums)

    # Step 4: Iterate through each index
    for i in range(len(nums)):
        # Right sum = total - left - current element
        right_sum = total_sum - left_sum - nums[i]

        # Calculate absolute difference
        answer[i] = abs(left_sum - right_sum)

        # Update left sum for next iteration
        left_sum += nums[i]

    return answer
```

```javascript
// Time: O(n) | Space: O(1) excluding output array
function leftRightDifference(nums) {
  /**
   * Calculate absolute difference between left and right sums for each index.
   *
   * @param {number[]} nums - Array of integers
   * @return {number[]} Array of absolute differences
   */

  // Step 1: Calculate total sum of all elements
  let totalSum = 0;
  for (let num of nums) {
    totalSum += num;
  }

  // Step 2: Initialize left sum (no elements to the left of first index)
  let leftSum = 0;

  // Step 3: Initialize result array
  let answer = new Array(nums.length);

  // Step 4: Iterate through each index
  for (let i = 0; i < nums.length; i++) {
    // Right sum = total - left - current element
    const rightSum = totalSum - leftSum - nums[i];

    // Calculate absolute difference
    answer[i] = Math.abs(leftSum - rightSum);

    // Update left sum for next iteration
    leftSum += nums[i];
  }

  return answer;
}
```

```java
// Time: O(n) | Space: O(1) excluding output array
class Solution {
    public int[] leftRightDifference(int[] nums) {
        /**
         * Calculate absolute difference between left and right sums for each index.
         *
         * @param nums Array of integers
         * @return Array of absolute differences
         */

        // Step 1: Calculate total sum of all elements
        int totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }

        // Step 2: Initialize left sum (no elements to the left of first index)
        int leftSum = 0;

        // Step 3: Initialize result array
        int[] answer = new int[nums.length];

        // Step 4: Iterate through each index
        for (int i = 0; i < nums.length; i++) {
            // Right sum = total - left - current element
            int rightSum = totalSum - leftSum - nums[i];

            // Calculate absolute difference
            answer[i] = Math.abs(leftSum - rightSum);

            // Update left sum for next iteration
            leftSum += nums[i];
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array: one to calculate total sum, and one to compute the answer
- Each pass processes each element exactly once
- 2n operations → O(n) linear time

**Space Complexity: O(1) excluding output array**

- We only use a few variables: `total_sum`, `left_sum`, and loop counters
- The output array is required by the problem, so typically we don't count it in space complexity
- If we count the output, it's O(n) for the result array

## Common Mistakes

1. **Off-by-one errors in index calculations**
   - Mistake: Including current element in left or right sum
   - Fix: Remember `leftSum[i]` includes elements with indices < i, not ≤ i
   - Tip: Write out the definition clearly before coding

2. **Recalculating sums for each position**
   - Mistake: Using nested loops to calculate left and right sums separately
   - Fix: Use the running sum pattern shown above
   - Tip: If you find yourself writing O(n²) code for an array problem, consider prefix sums

3. **Forgetting to handle edge cases**
   - Mistake: Not testing with single-element arrays
   - Fix: Test with `[5]` → left sum = 0, right sum = 0, answer = `[0]`
   - Tip: Always test with empty arrays, single elements, and two elements

4. **Incorrect right sum calculation**
   - Mistake: Calculating right sum as `total_sum - left_sum` (forgetting to subtract current element)
   - Fix: Right sum = `total_sum - left_sum - nums[i]`
   - Tip: Verify with the first element: left=0, right should be sum of all other elements

## When You'll See This Pattern

The prefix sum pattern appears in many array problems where you need to calculate cumulative values:

1. **Find Pivot Index (LeetCode 724)**
   - Direct application: find index where left sum equals right sum
   - Uses the exact same running sum technique

2. **Range Sum Query - Immutable (LeetCode 303)**
   - Precompute prefix sums to answer sum queries in O(1) time
   - Same core idea: avoid recalculating sums

3. **Subarray Sum Equals K (LeetCode 560)**
   - Uses prefix sums with hash maps to find subarrays summing to k
   - More advanced application of the same concept

4. **Product of Array Except Self (LeetCode 238)**
   - Similar structure but with multiplication instead of addition
   - Uses prefix and suffix products

## Key Takeaways

1. **Prefix sums transform O(n²) problems into O(n)**
   - When you need cumulative values at each position, precompute running totals
   - This pattern eliminates redundant calculations

2. **Right sum = Total sum - Left sum - Current element**
   - This formula is the key insight for this specific problem
   - Remember to subtract the current element when calculating right sum

3. **The running sum technique is fundamental**
   - Initialize a sum variable before the loop
   - Update it as you iterate through the array
   - Use it to compute values for the current position

This problem serves as an excellent introduction to prefix sums, a technique that will appear repeatedly in array and string problems. Mastering this pattern will help you solve more complex problems efficiently.

Related problems: [Find Pivot Index](/problem/find-pivot-index), [Find the Middle Index in Array](/problem/find-the-middle-index-in-array), [Find the Distinct Difference Array](/problem/find-the-distinct-difference-array)
