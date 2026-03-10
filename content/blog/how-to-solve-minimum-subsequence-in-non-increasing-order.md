---
title: "How to Solve Minimum Subsequence in Non-Increasing Order — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Subsequence in Non-Increasing Order. Easy difficulty, 73.6% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2027-08-15"
category: "dsa-patterns"
tags: ["minimum-subsequence-in-non-increasing-order", "array", "greedy", "sorting", "easy"]
---

# How to Solve Minimum Subsequence in Non-Increasing Order

This problem asks us to find a subsequence (not necessarily contiguous) from an array where the sum of the chosen elements is strictly greater than the sum of all remaining elements. If multiple valid subsequences exist, we need the one with the smallest size, and if there are still ties, we need the one with the maximum total sum (which translates to picking the largest elements first). The challenge lies in efficiently determining which elements to pick while satisfying all conditions.

## Visual Walkthrough

Let's trace through an example: `nums = [4,3,10,9,8]`

**Step 1: Understanding the goal**
We need a subsequence where:

1. Sum(chosen) > Sum(remaining)
2. If multiple solutions: choose smallest size
3. If still multiple: choose largest total sum

**Step 2: Key insight**
If we sort the array in descending order: `[10, 9, 8, 4, 3]`

- Total sum = 34
- We want: Sum(chosen) > Sum(remaining)
- This means: Sum(chosen) > Total - Sum(chosen)
- Which simplifies to: 2 × Sum(chosen) > Total
- Or: Sum(chosen) > Total/2

**Step 3: Greedy approach**
Start picking the largest elements first:

- Pick 10: sum = 10, remaining sum = 24 → 10 > 24? No
- Pick 9: sum = 19, remaining sum = 15 → 19 > 15? Yes ✓

We found a valid subsequence `[10, 9]` with size 2. Could we do better with size 1?

- Just 10: 10 > 24? No
- Just 9: 9 > 25? No
- Just 8: 8 > 26? No

So `[10, 9]` is indeed the minimum size solution.

**Step 4: Why sorting works**
By picking the largest elements first, we:

1. Reach the "> half total sum" condition fastest (minimizing size)
2. Among same-size solutions, we get the largest sum (breaking ties)

## Brute Force Approach

A naive approach would be to try all possible subsequences (2ⁿ possibilities where n is the array length). For each subsequence:

1. Calculate its sum
2. Calculate the sum of remaining elements
3. Check if sum > remaining sum
4. Track the valid subsequence with smallest size, then largest sum

This approach has exponential time complexity O(2ⁿ × n) which is completely impractical for arrays of any reasonable size (n > 20 becomes impossible).

Even if we try to optimize by sorting first and then trying combinations, we'd still need to check many possibilities. The key realization is that we don't need to check all combinations - picking the largest elements in descending order is always optimal.

## Optimal Solution

The optimal solution uses a greedy approach:

1. Sort the array in descending order
2. Calculate total sum of all elements
3. Iterate through sorted array, adding elements to our result
4. Stop when our running sum > half of total sum
5. Return the collected elements

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for the result, O(1) extra space
def minSubsequence(nums):
    """
    Returns the minimum subsequence where sum > sum of remaining elements.

    Approach:
    1. Sort in descending order to pick largest elements first
    2. Keep adding until our sum exceeds half of total sum
    3. This ensures minimum size and maximum sum for that size
    """
    # Step 1: Sort in descending order
    # This ensures we pick the largest elements first
    nums.sort(reverse=True)

    # Step 2: Calculate total sum
    total_sum = sum(nums)

    # Step 3: Initialize variables
    current_sum = 0
    result = []

    # Step 4: Iterate through sorted array
    for num in nums:
        # Add current number to our subsequence
        result.append(num)
        current_sum += num

        # Check if we've satisfied the condition
        # current_sum > total_sum - current_sum
        # Which simplifies to: current_sum > total_sum / 2
        if current_sum > total_sum - current_sum:
            # We found the minimum valid subsequence
            return result

    # This line should never be reached if nums is non-empty
    # but we return result for completeness
    return result
```

```javascript
// Time: O(n log n) | Space: O(n) for the result, O(1) extra space
function minSubsequence(nums) {
  /**
   * Returns the minimum subsequence where sum > sum of remaining elements.
   *
   * Approach:
   * 1. Sort in descending order to pick largest elements first
   * 2. Keep adding until our sum exceeds half of total sum
   * 3. This ensures minimum size and maximum sum for that size
   */

  // Step 1: Sort in descending order
  // Using (b - a) for descending sort
  nums.sort((a, b) => b - a);

  // Step 2: Calculate total sum
  const totalSum = nums.reduce((sum, num) => sum + num, 0);

  // Step 3: Initialize variables
  let currentSum = 0;
  const result = [];

  // Step 4: Iterate through sorted array
  for (const num of nums) {
    // Add current number to our subsequence
    result.push(num);
    currentSum += num;

    // Check if we've satisfied the condition
    // currentSum > totalSum - currentSum
    if (currentSum > totalSum - currentSum) {
      // We found the minimum valid subsequence
      return result;
    }
  }

  // This line should never be reached if nums is non-empty
  // but we return result for completeness
  return result;
}
```

```java
// Time: O(n log n) | Space: O(n) for the result, O(1) extra space
import java.util.*;

class Solution {
    public List<Integer> minSubsequence(int[] nums) {
        /**
         * Returns the minimum subsequence where sum > sum of remaining elements.
         *
         * Approach:
         * 1. Sort in descending order to pick largest elements first
         * 2. Keep adding until our sum exceeds half of total sum
         * 3. This ensures minimum size and maximum sum for that size
         */

        // Step 1: Convert to Integer array for descending sort
        Integer[] numsObj = new Integer[nums.length];
        for (int i = 0; i < nums.length; i++) {
            numsObj[i] = nums[i];
        }

        // Sort in descending order
        Arrays.sort(numsObj, Collections.reverseOrder());

        // Step 2: Calculate total sum
        int totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }

        // Step 3: Initialize variables
        int currentSum = 0;
        List<Integer> result = new ArrayList<>();

        // Step 4: Iterate through sorted array
        for (int num : numsObj) {
            // Add current number to our subsequence
            result.add(num);
            currentSum += num;

            // Check if we've satisfied the condition
            // currentSum > totalSum - currentSum
            if (currentSum > totalSum - currentSum) {
                // We found the minimum valid subsequence
                return result;
            }
        }

        // This line should never be reached if nums is non-empty
        // but we return result for completeness
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time
- Calculating total sum takes O(n) time
- Iterating through the sorted array takes O(n) time
- Dominant factor is sorting: O(n log n)

**Space Complexity: O(n) or O(1) depending on perspective**

- The result array takes O(k) space where k ≤ n
- If we consider only extra space (excluding output): O(1) for variables
- If we consider total space including output: O(n)
- Sorting may require O(log n) to O(n) space depending on algorithm

## Common Mistakes

1. **Forgetting to sort in descending order**: Sorting ascending and picking from the end works, but it's less intuitive and can lead to off-by-one errors.

2. **Incorrect termination condition**: Using `current_sum >= total_sum / 2` instead of `current_sum > total_sum - current_sum`. The problem says "strictly greater", so equality is not enough. The mathematical transformation helps: we need `current_sum > total_sum / 2`.

3. **Not handling the "minimum size" requirement correctly**: Some candidates try to find the exact minimum by checking all sizes starting from 1. While this works, it's unnecessary. The greedy approach of picking largest elements first naturally gives the minimum size.

4. **Modifying the original array unnecessarily**: While we need to sort, we should be aware that in some interview settings, modifying the input might be undesirable. We could create a copy if needed, though the problem doesn't prohibit modification.

## When You'll See This Pattern

This greedy "pick largest/smallest first" pattern appears in many optimization problems:

1. **Assign Cookies (Easy)**: Sort children's greed factors and cookie sizes, then match the smallest adequate cookie to each child.

2. **Maximum Units on a Truck (Easy)**: Sort box types by units per box in descending order, then fill the truck with the most valuable boxes first.

3. **Partition Array Such That Maximum Difference Is K (Medium)**: Sort and then group elements greedily to minimize number of subsequences.

The core insight is that when you need to optimize for size or count, sorting often reveals a greedy strategy where locally optimal choices lead to a globally optimal solution.

## Key Takeaways

1. **When minimizing count/size, think greedy with sorting**: If you need the smallest number of elements to achieve a threshold, sorting and picking the largest/most valuable elements first is often optimal.

2. **Transform inequality conditions**: Convert "sum of A > sum of B" to "sum of A > total/2" to simplify the checking logic.

3. **Prove greedy correctness intuitively**: For this problem, if you need to exceed half the total sum, the fastest way is to take the largest elements. Any other selection would require more elements to reach the same sum.

Related problems: [Count Hills and Valleys in an Array](/problem/count-hills-and-valleys-in-an-array)
