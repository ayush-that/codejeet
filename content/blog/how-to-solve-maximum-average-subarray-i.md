---
title: "How to Solve Maximum Average Subarray I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Average Subarray I. Easy difficulty, 47.1% acceptance rate. Topics: Array, Sliding Window."
date: "2026-09-17"
category: "dsa-patterns"
tags: ["maximum-average-subarray-i", "array", "sliding-window", "easy"]
---

# How to Solve Maximum Average Subarray I

This problem asks us to find the maximum average value of any contiguous subarray of exactly length `k` in an integer array. While conceptually straightforward, it's an excellent introduction to the sliding window technique—a pattern that appears in dozens of array problems. The key insight is that we don't need to recalculate the sum of each subarray from scratch, which would be inefficient.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 12, -5, -6, 50, 3]`, `k = 4`

**Step 1: Calculate first window sum**

- Window indices: 0 to 3
- Sum = 1 + 12 + (-5) + (-6) = 2
- Average = 2 / 4 = 0.5
- Current maximum = 0.5

**Step 2: Slide window right by 1**

- Remove `nums[0]` (value 1) from sum
- Add `nums[4]` (value 50) to sum
- New sum = 2 - 1 + 50 = 51
- New average = 51 / 4 = 12.75
- Update maximum = max(0.5, 12.75) = 12.75

**Step 3: Slide window right by 1**

- Remove `nums[1]` (value 12) from sum
- Add `nums[5]` (value 3) to sum
- New sum = 51 - 12 + 3 = 42
- New average = 42 / 4 = 10.5
- Update maximum = max(12.75, 10.5) = 12.75

**Result:** Maximum average is 12.75

Notice how we only performed one subtraction and one addition per slide, rather than recalculating the entire sum each time.

## Brute Force Approach

The most straightforward solution would be to check every possible subarray of length `k`:

1. For each starting index `i` from 0 to `n-k`
2. Calculate the sum of elements from `i` to `i+k-1`
3. Compute the average (sum/k)
4. Track the maximum average found

While this approach works, it's inefficient because it recalculates overlapping sums repeatedly. For each window, we sum `k` elements, leading to O(n × k) time complexity. When `k` is large (close to `n`), this approaches O(n²), which is too slow for large inputs.

## Optimal Solution: Sliding Window

The key optimization is recognizing that consecutive windows of size `k` overlap by `k-1` elements. When we slide the window right by one position, we only need to:

1. Subtract the element that's leaving the window (leftmost element)
2. Add the element that's entering the window (new rightmost element)

This reduces the work from O(k) per window to O(1) per window.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findMaxAverage(nums, k):
    """
    Find the maximum average of any contiguous subarray of length k.

    Args:
        nums: List of integers
        k: Length of subarray

    Returns:
        Maximum average as a float
    """
    # Step 1: Calculate sum of first window
    window_sum = 0
    for i in range(k):
        window_sum += nums[i]

    # Step 2: Initialize max_sum with first window's sum
    # We track max_sum instead of max_average to avoid repeated division
    max_sum = window_sum

    # Step 3: Slide the window across the array
    # Start from index k, as we already processed first window
    for i in range(k, len(nums)):
        # Remove leftmost element of previous window
        window_sum -= nums[i - k]
        # Add new element to the window
        window_sum += nums[i]
        # Update max_sum if current window sum is larger
        max_sum = max(max_sum, window_sum)

    # Step 4: Convert max_sum to average and return
    return max_sum / k
```

```javascript
// Time: O(n) | Space: O(1)
function findMaxAverage(nums, k) {
  /**
   * Find the maximum average of any contiguous subarray of length k.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Length of subarray
   * @return {number} Maximum average
   */

  // Step 1: Calculate sum of first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }

  // Step 2: Initialize maxSum with first window's sum
  // We track maxSum instead of maxAverage to avoid repeated division
  let maxSum = windowSum;

  // Step 3: Slide the window across the array
  // Start from index k, as we already processed first window
  for (let i = k; i < nums.length; i++) {
    // Remove leftmost element of previous window
    windowSum -= nums[i - k];
    // Add new element to the window
    windowSum += nums[i];
    // Update maxSum if current window sum is larger
    maxSum = Math.max(maxSum, windowSum);
  }

  // Step 4: Convert maxSum to average and return
  return maxSum / k;
}
```

```java
// Time: O(n) | Space: O(1)
public double findMaxAverage(int[] nums, int k) {
    /**
     * Find the maximum average of any contiguous subarray of length k.
     *
     * @param nums Array of integers
     * @param k Length of subarray
     * @return Maximum average
     */

    // Step 1: Calculate sum of first window
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }

    // Step 2: Initialize maxSum with first window's sum
    // We track maxSum instead of maxAverage to avoid repeated division
    int maxSum = windowSum;

    // Step 3: Slide the window across the array
    // Start from index k, as we already processed first window
    for (int i = k; i < nums.length; i++) {
        // Remove leftmost element of previous window
        windowSum -= nums[i - k];
        // Add new element to the window
        windowSum += nums[i];
        // Update maxSum if current window sum is larger
        maxSum = Math.max(maxSum, windowSum);
    }

    // Step 4: Convert maxSum to average and return
    // Note: We need to cast to double for precise division
    return (double) maxSum / k;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array exactly once to calculate the first window sum: O(k)
- We then slide the window across the remaining n-k elements: O(n-k)
- Total: O(k + n-k) = O(n)

**Space Complexity: O(1)**

- We only use a few variables (`window_sum`, `max_sum`, loop counters)
- No additional data structures that scale with input size

## Common Mistakes

1. **Off-by-one errors in window boundaries**: When sliding the window, candidates often use wrong indices. Remember: if current index is `i`, the element leaving the window is at `i-k`, not `i-k+1`. Test with small examples to verify.

2. **Calculating average at each step**: This is inefficient and can lead to floating-point precision issues. Track the maximum sum instead, and only divide once at the end.

3. **Not handling k > n**: While the problem constraints guarantee k ≤ n, in interviews you might be asked about edge cases. Always clarify assumptions or add a check: `if k > len(nums): return sum(nums)/len(nums)`.

4. **Integer division in statically-typed languages**: In Java, dividing two integers gives an integer result. You must cast to double: `(double) maxSum / k`.

5. **Initializing max_sum incorrectly**: Some candidates initialize `max_sum` with 0 or `Integer.MIN_VALUE`, but this fails when all numbers are negative. Always initialize with the first window's sum.

## When You'll See This Pattern

The sliding window technique appears whenever you need to analyze contiguous subarrays/substrings of a fixed size or satisfying certain conditions:

1. **Maximum Sum Subarray of Size K** (this problem's variant) - Exactly the same pattern
2. **Minimum Size Subarray Sum** - Similar sliding window, but window size varies
3. **Longest Substring Without Repeating Characters** - Uses a hash map with sliding window
4. **Fruit Into Baskets** - Sliding window with character counting
5. **Permutation in String** - Fixed-size window with frequency comparison

The pattern is recognizable when:

- Problem involves contiguous subarrays/substrings
- You need to find maximum/minimum/average of subarrays
- The subarray has a fixed size or constraints on size

## Key Takeaways

1. **Sliding window optimizes overlapping calculations**: When consecutive windows share most elements, avoid recalculating from scratch by adjusting the previous result.

2. **Track sums, not averages**: For maximum average problems, track the maximum sum and divide once at the end. This is more efficient and avoids precision issues.

3. **Test with edge cases**: Always test with all-negative numbers, k=1, k=n, and small arrays. These often reveal boundary condition errors.

4. **The sliding window template**:
   - Calculate first window
   - Initialize result with first window
   - Slide window across array, adjusting sum by removing left element and adding right element
   - Update result as needed

Related problems: [Maximum Average Subarray II](/problem/maximum-average-subarray-ii), [K Radius Subarray Averages](/problem/k-radius-subarray-averages)
