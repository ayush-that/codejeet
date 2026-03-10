---
title: "How to Solve Minimum Number of Operations to Make Array Continuous — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Make Array Continuous. Hard difficulty, 52.1% acceptance rate. Topics: Array, Hash Table, Binary Search, Sliding Window."
date: "2027-09-18"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-operations-to-make-array-continuous",
    "array",
    "hash-table",
    "binary-search",
    "hard",
  ]
---

# How to Solve Minimum Number of Operations to Make Array Continuous

This problem asks us to find the minimum number of element replacements needed to transform an array into a "continuous" array, where all elements are unique and form a consecutive sequence. The tricky part is that we can replace any element with any integer, which means we can essentially choose which values to keep and which to change. The challenge lies in finding the largest subset of unique values that can be extended into a continuous sequence with minimal replacements.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [4, 2, 5, 3, 7]`.

**Step 1: Understanding the goal**
A continuous array would be something like `[2, 3, 4, 5, 6]` or `[3, 4, 5, 6, 7]` - all unique values forming a consecutive sequence. We need to find the minimum replacements to achieve this.

**Step 2: Removing duplicates**
First, we need unique values since the final array must have all unique elements. Our array already has unique values: `{2, 3, 4, 5, 7}`.

**Step 3: Thinking about the continuous sequence**
If we want a continuous sequence of length 5, we need 5 consecutive integers. For example, `[2, 3, 4, 5, 6]` or `[3, 4, 5, 6, 7]`.

**Step 4: Finding what fits**
Let's check if we can form `[2, 3, 4, 5, 6]`:

- We have 2, 3, 4, 5 (4 values)
- We're missing 6
- We need to replace 7 with 6
- That's 1 replacement

Now check `[3, 4, 5, 6, 7]`:

- We have 3, 4, 5, 7 (4 values)
- We're missing 6
- We need to replace 2 with 6
- That's also 1 replacement

**Step 5: The key insight**
Notice that for a sequence of length 5 starting at value `x`, we need values `x, x+1, x+2, x+3, x+4`. The minimum replacements = total length (5) minus how many of these values we already have in our unique set.

**Step 6: Generalizing**
We need to find the starting value `x` such that the maximum number of values from `x` to `x+n-1` (where n is array length) are already in our set. Then replacements = n - (number of values we already have in that range).

## Brute Force Approach

A naive approach would be to:

1. Get all unique values from the array
2. For each possible starting value `x`, check how many values from `x` to `x+n-1` exist in our unique set
3. Find the starting value that gives the maximum count
4. Minimum operations = n - maximum count

The problem with this brute force approach is the range of possible starting values. Since we can replace elements with any integer, `x` could be any integer. Even if we limit it to the range of existing values, checking each possible `x` would be O(n²) since for each `x` we check n values.

```python
# Brute force - too slow for large inputs
def minOperations(nums):
    n = len(nums)
    unique_nums = set(nums)

    max_found = 0
    # For each possible starting value in our unique set
    for start in unique_nums:
        count = 0
        # Check for n consecutive values
        for i in range(n):
            if (start + i) in unique_nums:
                count += 1
        max_found = max(max_found, count)

    return n - max_found
```

This approach is O(n²) which is too slow for n up to 10⁵. We need a more efficient way to find the maximum number of existing values in any consecutive range of length n.

## Optimized Approach

The key insight is that we can use a sliding window approach on the sorted unique values. Here's the step-by-step reasoning:

1. **Sort the unique values**: This allows us to think about consecutive sequences.
2. **Think in terms of a window**: We want to find the largest window of unique values that can be extended to a continuous sequence of length n.
3. **The window constraint**: For a window of unique values from `arr[left]` to `arr[right]`, if `arr[right] - arr[left] < n`, then all values in this window can potentially be part of a continuous sequence of length n starting somewhere between `arr[left]` and `arr[right] - n + 1`.
4. **Why this works**: If the difference between the smallest and largest values in our window is less than n, then we can extend this window to exactly n consecutive integers by filling in the missing values.
5. **Finding the maximum window**: We use two pointers (left and right) to find the largest window where `arr[right] - arr[left] < n`. The size of this window tells us how many values we can keep.

The algorithm:

1. Get unique values and sort them
2. Use two pointers to find the largest window where `arr[right] - arr[left] < n`
3. Minimum operations = n - (size of this window)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minOperations(nums):
    """
    Find minimum replacements to make array continuous.

    Args:
        nums: List[int] - input array

    Returns:
        int - minimum number of operations
    """
    n = len(nums)

    # Step 1: Get unique values and sort them
    # Sorting allows us to use sliding window on consecutive values
    unique_nums = sorted(set(nums))
    unique_count = len(unique_nums)

    # Step 2: Initialize sliding window pointers
    left = 0
    max_window_size = 0

    # Step 3: Slide the right pointer through the unique values
    for right in range(unique_count):
        # Step 4: Shrink window from left while the window is too wide
        # A window is "too wide" if the difference between max and min
        # is >= n, meaning we can't extend it to n consecutive integers
        while unique_nums[right] - unique_nums[left] >= n:
            left += 1

        # Step 5: Update maximum window size
        # Current window size is (right - left + 1)
        max_window_size = max(max_window_size, right - left + 1)

    # Step 6: Minimum operations = total length - maximum values we can keep
    return n - max_window_size
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * Find minimum replacements to make array continuous.
 * @param {number[]} nums - Input array
 * @return {number} - Minimum number of operations
 */
function minOperations(nums) {
  const n = nums.length;

  // Step 1: Get unique values and sort them
  // Sorting allows us to use sliding window on consecutive values
  const uniqueNums = [...new Set(nums)].sort((a, b) => a - b);
  const uniqueCount = uniqueNums.length;

  // Step 2: Initialize sliding window pointers
  let left = 0;
  let maxWindowSize = 0;

  // Step 3: Slide the right pointer through the unique values
  for (let right = 0; right < uniqueCount; right++) {
    // Step 4: Shrink window from left while the window is too wide
    // A window is "too wide" if the difference between max and min
    // is >= n, meaning we can't extend it to n consecutive integers
    while (uniqueNums[right] - uniqueNums[left] >= n) {
      left++;
    }

    // Step 5: Update maximum window size
    // Current window size is (right - left + 1)
    maxWindowSize = Math.max(maxWindowSize, right - left + 1);
  }

  // Step 6: Minimum operations = total length - maximum values we can keep
  return n - maxWindowSize;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    /**
     * Find minimum replacements to make array continuous.
     * @param nums - Input array
     * @return Minimum number of operations
     */
    public int minOperations(int[] nums) {
        int n = nums.length;

        // Step 1: Get unique values and sort them
        // Sorting allows us to use sliding window on consecutive values
        Set<Integer> uniqueSet = new HashSet<>();
        for (int num : nums) {
            uniqueSet.add(num);
        }

        List<Integer> uniqueNums = new ArrayList<>(uniqueSet);
        Collections.sort(uniqueNums);
        int uniqueCount = uniqueNums.size();

        // Step 2: Initialize sliding window pointers
        int left = 0;
        int maxWindowSize = 0;

        // Step 3: Slide the right pointer through the unique values
        for (int right = 0; right < uniqueCount; right++) {
            // Step 4: Shrink window from left while the window is too wide
            // A window is "too wide" if the difference between max and min
            // is >= n, meaning we can't extend it to n consecutive integers
            while (uniqueNums.get(right) - uniqueNums.get(left) >= n) {
                left++;
            }

            // Step 5: Update maximum window size
            // Current window size is (right - left + 1)
            maxWindowSize = Math.max(maxWindowSize, right - left + 1);
        }

        // Step 6: Minimum operations = total length - maximum values we can keep
        return n - maxWindowSize;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Creating a set from nums: O(n)
- Sorting unique values: O(k log k) where k ≤ n (number of unique values)
- Sliding window traversal: O(k) since each element is visited at most twice (once by right pointer, once by left pointer)
- Overall: O(n + k log k) = O(n log n) in worst case when all values are unique

**Space Complexity: O(n)**

- We store the set of unique values: O(k) where k ≤ n
- We store the sorted list of unique values: O(k)
- Overall: O(n) in worst case

## Common Mistakes

1. **Not handling duplicates correctly**: Some candidates try to work with the original array without removing duplicates first. Remember that the final array must have all unique elements, so duplicates must be removed or replaced.

2. **Wrong window condition**: The condition `arr[right] - arr[left] < n` is subtle. Some candidates use `arr[right] - arr[left] <= n` or `arr[right] - arr[left] + 1 < n`. The correct reasoning is: if the difference is less than n, we can extend to n consecutive integers. If it's exactly n, we would need n+1 consecutive integers.

3. **Forgetting to sort**: The sliding window approach only works on sorted data. Without sorting, we can't guarantee that values between left and right pointers can form a consecutive sequence.

4. **Off-by-one in window size calculation**: When calculating `right - left + 1`, remember to add 1 because both endpoints are inclusive. A window from index 2 to index 5 contains 4 elements (5-2+1=4).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sliding Window on Sorted Data**: Similar to problems like "Longest Substring Without Repeating Characters" but applied to numerical ranges instead of strings.

2. **Transformation to Find Maximum Subset**: Like "Longest Increasing Subsequence" where we're looking for the largest subset that satisfies certain conditions.

3. **Array Transformation Problems**: Similar to "Minimum Moves to Make Array Complementary" or "Minimum Operations to Reduce X to Zero" where we need to find optimal transformations.

**Related Problems:**

- **Longest Repeating Character Replacement**: Uses sliding window with character counts
- **Continuous Subarray Sum**: Looks for subarrays with specific properties
- **Moving Stones Until Consecutive II**: Similar concept of making values consecutive with minimal moves

## Key Takeaways

1. **When you need consecutive values, think sorting**: Sorting transforms the problem from finding scattered values to finding contiguous ranges.

2. **Sliding window finds optimal subarrays efficiently**: When you need to find a subarray that maximizes or minimizes something subject to constraints, sliding window with two pointers is often O(n) after sorting.

3. **Minimum operations = total - maximum keepable**: A common pattern in transformation problems: find the maximum number of elements you can keep, then change the rest.

This problem teaches how to transform a seemingly complex optimization problem into a simpler search for the largest valid window in sorted data—a powerful technique for many array manipulation challenges.

Related problems: [Longest Repeating Character Replacement](/problem/longest-repeating-character-replacement), [Continuous Subarray Sum](/problem/continuous-subarray-sum), [Moving Stones Until Consecutive II](/problem/moving-stones-until-consecutive-ii)
