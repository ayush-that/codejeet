---
title: "How to Solve Maximum Ascending Subarray Sum — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Ascending Subarray Sum. Easy difficulty, 66.3% acceptance rate. Topics: Array."
date: "2028-05-19"
category: "dsa-patterns"
tags: ["maximum-ascending-subarray-sum", "array", "easy"]
---

## How to Solve Maximum Ascending Subarray Sum

You're given an array of positive integers and need to find the maximum sum of any strictly increasing contiguous subarray. While this is labeled as "Easy," it tests your ability to track running states and reset conditions properly—a pattern that appears in many array processing problems. The key insight is recognizing that you can solve this with a single pass through the array while maintaining a running sum that resets when the increasing sequence breaks.

---

## Visual Walkthrough

Let's trace through `nums = [10, 20, 30, 5, 10, 50]` step by step:

1. **Start at index 0**: Current sum = 10, max sum = 10  
   Sequence: [10]

2. **Index 1 (20)**: 20 > 10, so sequence continues  
   Current sum = 10 + 20 = 30, max sum = 30  
   Sequence: [10, 20]

3. **Index 2 (30)**: 30 > 20, sequence continues  
   Current sum = 30 + 30 = 60, max sum = 60  
   Sequence: [10, 20, 30]

4. **Index 3 (5)**: 5 ≤ 30, sequence breaks  
   Reset current sum = 5, max sum stays 60  
   New sequence: [5]

5. **Index 4 (10)**: 10 > 5, sequence continues  
   Current sum = 5 + 10 = 15, max sum stays 60  
   Sequence: [5, 10]

6. **Index 5 (50)**: 50 > 10, sequence continues  
   Current sum = 15 + 50 = 65, max sum = 65  
   Sequence: [5, 10, 50]

**Final answer**: 65

The pattern is clear: we maintain a running sum of the current increasing subarray, update our maximum when needed, and reset the running sum whenever we encounter a non-increasing element.

---

## Brute Force Approach

A naive approach would check every possible subarray to see if it's strictly increasing, calculate its sum, and track the maximum. For each starting index `i`, we'd expand to ending index `j`, checking if `nums[j] > nums[j-1]` for each extension.

**Why this fails**: With `n` elements, there are `O(n²)` subarrays. For each subarray, we need to verify it's strictly increasing (O(n) check) and compute its sum (O(n) computation). This leads to `O(n³)` time complexity, which is far too slow for typical constraints where `n` can be up to 100 or 1000.

Even if we precompute prefix sums to get subarray sums in O(1), we still need O(n) time to verify the strictly increasing condition for each subarray, resulting in O(n³) overall. This brute force approach is clearly impractical.

---

## Optimal Solution

We can solve this in a single pass through the array using a greedy approach. The key observation: when processing element `i`, we only need to know:

1. The sum of the current increasing subarray ending at `i-1`
2. Whether `nums[i]` continues the increasing sequence

If `nums[i] > nums[i-1]`, we extend the current subarray by adding `nums[i]` to our running sum. Otherwise, we start a new subarray beginning at `nums[i]`. We track the maximum sum seen throughout.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxAscendingSum(nums):
    """
    Find the maximum sum of any strictly increasing contiguous subarray.

    Args:
        nums: List of positive integers

    Returns:
        Maximum sum of strictly increasing subarray
    """
    # Edge case: empty array
    if not nums:
        return 0

    # Initialize with first element
    current_sum = nums[0]  # Sum of current increasing subarray
    max_sum = nums[0]      # Maximum sum found so far

    # Start from second element
    for i in range(1, len(nums)):
        if nums[i] > nums[i - 1]:
            # Continue the increasing subarray
            current_sum += nums[i]
        else:
            # Start a new subarray
            current_sum = nums[i]

        # Update maximum if current sum is larger
        if current_sum > max_sum:
            max_sum = current_sum

    return max_sum
```

```javascript
// Time: O(n) | Space: O(1)
function maxAscendingSum(nums) {
  /**
   * Find the maximum sum of any strictly increasing contiguous subarray.
   *
   * @param {number[]} nums - Array of positive integers
   * @return {number} Maximum sum of strictly increasing subarray
   */
  // Edge case: empty array
  if (nums.length === 0) {
    return 0;
  }

  // Initialize with first element
  let currentSum = nums[0]; // Sum of current increasing subarray
  let maxSum = nums[0]; // Maximum sum found so far

  // Start from second element
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      // Continue the increasing subarray
      currentSum += nums[i];
    } else {
      // Start a new subarray
      currentSum = nums[i];
    }

    // Update maximum if current sum is larger
    if (currentSum > maxSum) {
      maxSum = currentSum;
    }
  }

  return maxSum;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int maxAscendingSum(int[] nums) {
        /**
         * Find the maximum sum of any strictly increasing contiguous subarray.
         *
         * @param nums Array of positive integers
         * @return Maximum sum of strictly increasing subarray
         */
        // Edge case: empty array
        if (nums.length == 0) {
            return 0;
        }

        // Initialize with first element
        int currentSum = nums[0];  // Sum of current increasing subarray
        int maxSum = nums[0];      // Maximum sum found so far

        // Start from second element
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > nums[i - 1]) {
                // Continue the increasing subarray
                currentSum += nums[i];
            } else {
                // Start a new subarray
                currentSum = nums[i];
            }

            // Update maximum if current sum is larger
            if (currentSum > maxSum) {
                maxSum = currentSum;
            }
        }

        return maxSum;
    }
}
```

</div>

**Why this works**: We're essentially performing a greedy scan. At each position, we make the locally optimal choice (continue the sequence if possible, start fresh if not), and this leads to the globally optimal solution because we track the maximum across all sequences. The problem has optimal substructure—the best solution up to index `i` depends only on the solution up to index `i-1`.

---

## Complexity Analysis

**Time Complexity**: O(n)  
We make a single pass through the array, performing constant-time operations at each element. The loop runs `n-1` times (starting from index 1), giving us O(n) total operations.

**Space Complexity**: O(1)  
We only use a fixed number of variables (`current_sum`, `max_sum`, and loop index), regardless of input size. No additional data structures are needed.

---

## Common Mistakes

1. **Forgetting to handle the empty array case**: The problem states the array contains positive integers, but in interviews, you should always check edge cases. If `nums` is empty, we should return 0.

2. **Incorrect comparison operator**: Using `>=` instead of `>` when checking if the sequence continues. The problem says "strictly increasing," so equal values break the sequence. For `[3, 3, 4]`, the maximum sum is 4 (not 7), since `[3, 3]` isn't strictly increasing.

3. **Not resetting current_sum properly**: When the sequence breaks, some candidates reset to 0 instead of `nums[i]`. Remember, each element itself is a valid subarray of length 1, so the new sequence starts with the current element's value.

4. **Updating max_sum at the wrong time**: Updating `max_sum` only when a sequence breaks misses cases where the last sequence is the maximum. Always update `max_sum` after processing each element.

---

## When You'll See This Pattern

This "running state with reset" pattern appears in many array processing problems where you need to track sequences or segments:

1. **Maximum Subarray (Kadane's Algorithm)**: Similar structure but resets when current sum becomes negative rather than when sequence breaks.

2. **Longest Continuous Increasing Subsequence**: Instead of tracking sums, you track lengths of increasing sequences.

3. **Best Time to Buy and Sell Stock**: You track the minimum price seen so far and maximum profit, with a similar single-pass approach.

4. **Find Good Days to Rob the Bank**: Requires tracking non-increasing sequences before a day and non-decreasing sequences after it—essentially two passes of this pattern.

The core idea is maintaining some "current state" (sum, length, minimum, etc.) as you iterate, updating it based on local conditions, and resetting it when certain criteria are met.

---

## Key Takeaways

1. **Single-pass solutions often exist for contiguous subarray problems**: When you need to find optimal contiguous subarrays meeting certain conditions, consider whether you can solve it in O(n) by tracking running state.

2. **The reset condition is crucial**: In this problem, we reset when `nums[i] ≤ nums[i-1]`. Identifying the exact reset condition for your problem is key to a correct solution.

3. **Track both current and maximum values**: Maintain the current sequence's value and the global maximum separately. Update the maximum whenever the current value exceeds it.

---

**Related problems**: [Find Good Days to Rob the Bank](/problem/find-good-days-to-rob-the-bank), [Maximum Number of Books You Can Take](/problem/maximum-number-of-books-you-can-take), [Count Strictly Increasing Subarrays](/problem/count-strictly-increasing-subarrays)
