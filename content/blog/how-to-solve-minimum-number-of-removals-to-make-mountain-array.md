---
title: "How to Solve Minimum Number of Removals to Make Mountain Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Number of Removals to Make Mountain Array. Hard difficulty, 54.8% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Greedy."
date: "2027-02-04"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-removals-to-make-mountain-array",
    "array",
    "binary-search",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Minimum Number of Removals to Make Mountain Array

This problem asks us to find the minimum number of elements to remove from an array so that the remaining elements form a valid mountain array. What makes this problem tricky is that we need to find the longest valid mountain subsequence (not necessarily contiguous), and then calculate how many elements we need to remove. The challenge lies in efficiently finding the best "peak" position where elements strictly increase to the left and strictly decrease to the right.

## Visual Walkthrough

Let's walk through an example: `arr = [2,1,1,5,6,2,3,1]`

A valid mountain array needs:

1. A peak element somewhere in the middle (not at the ends)
2. Strictly increasing elements to the left of the peak
3. Strictly decreasing elements to the right of the peak

For our example, let's consider what happens if we choose index 4 (value 6) as the peak:

- Left of index 4: [2,1,1,5] → We need strictly increasing sequence ending at 6
  Best we can do: [2,5,6] or [1,5,6] (length 3)
- Right of index 4: [2,3,1] → We need strictly decreasing sequence starting at 6
  Best we can do: [6,3,1] or [6,2,1] (length 3)
- Total mountain length: 3 (left) + 1 (peak) + 3 (right) - 1 = 6
  (We subtract 1 because the peak is counted in both left and right calculations)

We need to check every possible peak position and find the one that gives us the longest valid mountain. The minimum removals = total length - longest mountain length.

## Brute Force Approach

A naive approach would be to:

1. Try every possible peak position (from index 1 to n-2)
2. For each peak, try all possible subsequences to the left that are strictly increasing and end at the peak
3. Try all possible subsequences to the right that are strictly decreasing and start at the peak
4. Calculate the maximum mountain length

This brute force approach would involve checking all possible subsequences, which is O(2^n) time complexity - far too slow for arrays up to length 1000.

Even a slightly better brute force would be O(n³): for each peak (O(n)), for each left element (O(n)) check if it can be part of increasing sequence, and similarly for the right side.

The key insight is that we don't need to check all combinations - we can use dynamic programming to efficiently find the longest increasing subsequence ending at each position and the longest decreasing subsequence starting at each position.

## Optimized Approach

The optimal solution uses two dynamic programming arrays:

1. `LIS[i]`: Length of the longest strictly increasing subsequence ending at index `i`
2. `LDS[i]`: Length of the longest strictly decreasing subsequence starting at index `i`

Here's the step-by-step reasoning:

1. **Calculate LIS for each position**:
   - For each index `i`, look at all previous indices `j` (0 ≤ j < i)
   - If `arr[j] < arr[i]`, then `LIS[i] = max(LIS[i], LIS[j] + 1)`
   - This tells us the longest increasing sequence we can build ending at `i`

2. **Calculate LDS for each position**:
   - We calculate this from right to left
   - For each index `i`, look at all later indices `j` (i < j < n)
   - If `arr[i] > arr[j]`, then `LDS[i] = max(LDS[i], LDS[j] + 1)`
   - This tells us the longest decreasing sequence we can build starting at `i`

3. **Find the best peak**:
   - For each index `i` to be a valid peak, we need `LIS[i] > 1` (at least one element before it) and `LDS[i] > 1` (at least one element after it)
   - The mountain length at peak `i` = `LIS[i] + LDS[i] - 1`
   - We subtract 1 because the peak is counted in both LIS and LDS

4. **Calculate minimum removals**:
   - Minimum removals = `n - max_mountain_length`
   - If no valid mountain exists, we need to remove all but 2 elements (minimum mountain needs 3 elements), so return `n - 2`

This approach runs in O(n²) time with O(n) space, which is acceptable for n ≤ 1000.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def minimumMountainRemovals(nums):
    """
    Find minimum removals to make array a mountain array.

    Approach:
    1. Calculate LIS (Longest Increasing Subsequence) ending at each index
    2. Calculate LDS (Longest Decreasing Subsequence) starting at each index
    3. For each possible peak, calculate mountain length = LIS[i] + LDS[i] - 1
    4. Minimum removals = n - max_mountain_length
    """
    n = len(nums)
    if n < 3:
        return 0  # Can't form a mountain with less than 3 elements

    # Step 1: Calculate LIS for each position
    # LIS[i] = length of longest increasing subsequence ending at i
    lis = [1] * n  # Each element is at least a subsequence of length 1

    for i in range(n):
        # Check all previous elements
        for j in range(i):
            if nums[j] < nums[i]:
                # We can extend the increasing sequence ending at j
                lis[i] = max(lis[i], lis[j] + 1)

    # Step 2: Calculate LDS for each position
    # LDS[i] = length of longest decreasing subsequence starting at i
    lds = [1] * n  # Each element is at least a subsequence of length 1

    # Process from right to left
    for i in range(n - 1, -1, -1):
        # Check all later elements
        for j in range(i + 1, n):
            if nums[i] > nums[j]:
                # We can extend the decreasing sequence starting at j
                lds[i] = max(lds[i], lds[j] + 1)

    # Step 3: Find the maximum mountain length
    max_mountain = 0

    for i in range(1, n - 1):  # Peak cannot be at ends
        # For a valid peak, we need at least one element on each side
        if lis[i] > 1 and lds[i] > 1:
            # Mountain length = increasing part + decreasing part - 1 (peak counted twice)
            mountain_length = lis[i] + lds[i] - 1
            max_mountain = max(max_mountain, mountain_length)

    # Step 4: Calculate minimum removals
    # If no valid mountain found, we need to remove all but 2 elements
    if max_mountain == 0:
        return n - 2

    return n - max_mountain
```

```javascript
// Time: O(n^2) | Space: O(n)
function minimumMountainRemovals(nums) {
  /**
   * Find minimum removals to make array a mountain array.
   *
   * Approach:
   * 1. Calculate LIS (Longest Increasing Subsequence) ending at each index
   * 2. Calculate LDS (Longest Decreasing Subsequence) starting at each index
   * 3. For each possible peak, calculate mountain length = LIS[i] + LDS[i] - 1
   * 4. Minimum removals = n - max_mountain_length
   */
  const n = nums.length;
  if (n < 3) {
    return 0; // Can't form a mountain with less than 3 elements
  }

  // Step 1: Calculate LIS for each position
  // LIS[i] = length of longest increasing subsequence ending at i
  const lis = new Array(n).fill(1); // Each element is at least a subsequence of length 1

  for (let i = 0; i < n; i++) {
    // Check all previous elements
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        // We can extend the increasing sequence ending at j
        lis[i] = Math.max(lis[i], lis[j] + 1);
      }
    }
  }

  // Step 2: Calculate LDS for each position
  // LDS[i] = length of longest decreasing subsequence starting at i
  const lds = new Array(n).fill(1); // Each element is at least a subsequence of length 1

  // Process from right to left
  for (let i = n - 1; i >= 0; i--) {
    // Check all later elements
    for (let j = i + 1; j < n; j++) {
      if (nums[i] > nums[j]) {
        // We can extend the decreasing sequence starting at j
        lds[i] = Math.max(lds[i], lds[j] + 1);
      }
    }
  }

  // Step 3: Find the maximum mountain length
  let maxMountain = 0;

  for (let i = 1; i < n - 1; i++) {
    // Peak cannot be at ends
    // For a valid peak, we need at least one element on each side
    if (lis[i] > 1 && lds[i] > 1) {
      // Mountain length = increasing part + decreasing part - 1 (peak counted twice)
      const mountainLength = lis[i] + lds[i] - 1;
      maxMountain = Math.max(maxMountain, mountainLength);
    }
  }

  // Step 4: Calculate minimum removals
  // If no valid mountain found, we need to remove all but 2 elements
  if (maxMountain === 0) {
    return n - 2;
  }

  return n - maxMountain;
}
```

```java
// Time: O(n^2) | Space: O(n)
class Solution {
    public int minimumMountainRemovals(int[] nums) {
        /**
         * Find minimum removals to make array a mountain array.
         *
         * Approach:
         * 1. Calculate LIS (Longest Increasing Subsequence) ending at each index
         * 2. Calculate LDS (Longest Decreasing Subsequence) starting at each index
         * 3. For each possible peak, calculate mountain length = LIS[i] + LDS[i] - 1
         * 4. Minimum removals = n - max_mountain_length
         */
        int n = nums.length;
        if (n < 3) {
            return 0;  // Can't form a mountain with less than 3 elements
        }

        // Step 1: Calculate LIS for each position
        // LIS[i] = length of longest increasing subsequence ending at i
        int[] lis = new int[n];
        Arrays.fill(lis, 1);  // Each element is at least a subsequence of length 1

        for (int i = 0; i < n; i++) {
            // Check all previous elements
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    // We can extend the increasing sequence ending at j
                    lis[i] = Math.max(lis[i], lis[j] + 1);
                }
            }
        }

        // Step 2: Calculate LDS for each position
        // LDS[i] = length of longest decreasing subsequence starting at i
        int[] lds = new int[n];
        Arrays.fill(lds, 1);  // Each element is at least a subsequence of length 1

        // Process from right to left
        for (int i = n - 1; i >= 0; i--) {
            // Check all later elements
            for (int j = i + 1; j < n; j++) {
                if (nums[i] > nums[j]) {
                    // We can extend the decreasing sequence starting at j
                    lds[i] = Math.max(lds[i], lds[j] + 1);
                }
            }
        }

        // Step 3: Find the maximum mountain length
        int maxMountain = 0;

        for (int i = 1; i < n - 1; i++) {  // Peak cannot be at ends
            // For a valid peak, we need at least one element on each side
            if (lis[i] > 1 && lds[i] > 1) {
                // Mountain length = increasing part + decreasing part - 1 (peak counted twice)
                int mountainLength = lis[i] + lds[i] - 1;
                maxMountain = Math.max(maxMountain, mountainLength);
            }
        }

        // Step 4: Calculate minimum removals
        // If no valid mountain found, we need to remove all but 2 elements
        if (maxMountain == 0) {
            return n - 2;
        }

        return n - maxMountain;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We have two nested loops for calculating LIS: O(n²)
- We have two nested loops for calculating LDS: O(n²)
- Finding the maximum mountain length: O(n)
- Total: O(n²) + O(n²) + O(n) = O(n²)

**Space Complexity: O(n)**

- We store two arrays of size n: `lis` and `lds`
- No other significant space usage
- Total: O(n) + O(n) = O(n)

For n ≤ 1000, O(n²) is acceptable (up to 1,000,000 operations).

## Common Mistakes

1. **Forgetting to check if peak is valid**: A peak needs at least one element on each side, so `lis[i] > 1` AND `lds[i] > 1`. Without this check, you might count invalid peaks.

2. **Not handling the case when no mountain exists**: If no valid mountain can be formed, the answer should be `n - 2` (remove all but 2 elements, since we need at least 3 for a mountain).

3. **Confusing subsequence with subarray**: Remember we're looking for subsequences (can skip elements), not subarrays (contiguous). This is why we use LIS/LDS DP approach.

4. **Off-by-one error in mountain length calculation**: The peak is counted in both LIS and LDS, so we need to subtract 1: `mountain_length = lis[i] + lds[i] - 1`.

5. **Incorrect bounds for peak search**: The peak cannot be at index 0 or n-1, so we should only check `i` from 1 to n-2.

## When You'll See This Pattern

This problem combines two fundamental patterns:

1. **Longest Increasing Subsequence (LIS)**: The core technique used here. Problems that involve finding optimal subsequences with ordering constraints often use LIS DP.
   - Related: [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) (Medium)

2. **Bidirectional DP**: Calculating DP from both directions (left-to-right and right-to-left) is common in problems where you need information about both sides of an element.
   - Related: [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) (Medium)

3. **Mountain/Peak problems**: Any problem involving finding peaks or mountain-shaped sequences.
   - Related: [Longest Mountain in Array](https://leetcode.com/problems/longest-mountain-in-array/) (Medium), [Peak Index in a Mountain Array](https://leetcode.com/problems/peak-index-in-a-mountain-array/) (Easy)

## Key Takeaways

1. **Convert removal problems to "keep" problems**: Instead of thinking about what to remove, think about what to keep. Minimum removals = n - maximum valid subsequence length.

2. **Bidirectional LIS for mountain problems**: For any mountain/peak problem, consider calculating LIS from left and LDS from right to find the best peak position.

3. **Validate peak conditions**: Always check that a potential peak has valid increasing sequence before it AND valid decreasing sequence after it.

4. **DP for subsequence problems**: When you need to find optimal subsequences (not necessarily contiguous), dynamic programming approaches like LIS are often the solution.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence), [Longest Mountain in Array](/problem/longest-mountain-in-array), [Peak Index in a Mountain Array](/problem/peak-index-in-a-mountain-array)
