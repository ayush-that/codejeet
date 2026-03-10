---
title: "How to Solve Find X Value of Array I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find X Value of Array I. Medium difficulty, 37.2% acceptance rate. Topics: Array, Math, Dynamic Programming."
date: "2026-04-25"
category: "dsa-patterns"
tags: ["find-x-value-of-array-i", "array", "math", "dynamic-programming", "medium"]
---

# How to Solve Find X Value of Array I

You're given an array of positive integers and a positive integer `k`. You can perform **one** operation where you remove a non-overlapping prefix and suffix (leaving a non-empty middle section), and you need to find the **maximum** possible value of `x` where `x` is the minimum of the remaining array after the operation. This problem is tricky because you need to strategically remove parts of the array to maximize the minimum value of what remains, and the optimal solution requires careful mathematical reasoning rather than brute force.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have `nums = [2, 5, 3, 7, 4]` and `k = 3`.

**Understanding the operation:** We can remove a prefix (elements from the start) and a suffix (elements from the end) that don't overlap, leaving a middle section. For example:

- Remove prefix of length 1 (`[2]`) and suffix of length 1 (`[4]`), leaving `[5, 3, 7]`. Minimum = 3.
- Remove prefix of length 0 and suffix of length 2 (`[7, 4]`), leaving `[2, 5, 3]`. Minimum = 2.
- Remove prefix of length 2 (`[2, 5]`) and suffix of length 0, leaving `[3, 7, 4]`. Minimum = 3.

**The key insight:** After removing prefix of length `i` and suffix of length `j`, the remaining array has length `n - i - j`. For the operation to be valid, we need `n - i - j ≥ k` (since we need at least `k` elements remaining). The value `x` will be the minimum element in the remaining subarray.

**Our goal:** Find the maximum possible minimum value across all valid prefix/suffix removals.

Let's try to maximize `x`. If we want the minimum to be at least 4:

- Can we remove enough elements so all remaining elements are ≥ 4?
- Original: `[2, 5, 3, 7, 4]`
- Elements < 4: `[2, 3]` at indices 0 and 2
- To have all remaining ≥ 4, we must remove all elements < 4
- The elements < 4 are at the edges: `2` at index 0 (prefix) and `3` at index 2 (not at edge!)
- Wait, `3` is in the middle! We can't remove it without splitting the array.

This shows we need a systematic approach. Let's think differently: For a candidate value `x`, can we remove a prefix and suffix so that all remaining elements are ≥ `x` AND we have at least `k` elements remaining?

For `x = 3`:

- Elements < 3: `[2]` at index 0
- We can remove prefix containing `[2]` (length 1)
- Remaining: `[5, 3, 7, 4]` all ≥ 3, length 4 ≥ k=3 ✓
- So `x = 3` is possible

For `x = 4`:

- Elements < 4: `[2, 3]` at indices 0 and 2
- These aren't all at the edges (3 is in middle)
- We could remove prefix up to index 2 (removing `[2, 5, 3]`) but that's too much
- Actually, check if we can have ≥ k elements all ≥ 4:
  - Longest contiguous segment with all ≥ 4: `[5, 7, 4]` (indices 1, 3, 4)
  - Length 3 ≥ k=3 ✓
  - So `x = 4` is possible!

For `x = 5`:

- Elements < 5: `[2, 3, 4]` at indices 0, 2, 4
- Longest contiguous segment with all ≥ 5: `[5, 7]` (indices 1, 3)
- Length 2 < k=3 ✗
- So `x = 5` is NOT possible

Thus maximum `x = 4`.

## Brute Force Approach

A naive approach would try all possible prefix and suffix removals:

1. For each possible prefix length `i` (0 to n-1)
2. For each possible suffix length `j` (0 to n-1-i, since they can't overlap)
3. Check if remaining length `n-i-j ≥ k`
4. If yes, find minimum in remaining subarray `nums[i:n-j]`
5. Track the maximum of these minimums

This is O(n³) time: O(n²) prefix/suffix pairs × O(n) to find minimum for each. For n up to 10⁵ (typical constraints), this is completely infeasible.

Even an optimized O(n²) version (precomputing prefix/suffix minimums) would be too slow. We need a better approach.

## Optimized Approach

The key insight is to **binary search on the answer** `x`:

1. **Observation:** If we can achieve minimum value `x`, then we can definitely achieve any value less than `x` (by keeping the same subarray). If we cannot achieve `x`, then we cannot achieve any value greater than `x`. This monotonic property enables binary search.

2. **Checking feasibility for a candidate `x`:** For a given candidate `x`, we need to check: "Is there a contiguous subarray of length at least `k` where every element is ≥ `x`?"
   - Why? Because to have minimum ≥ `x` in the remaining array, ALL elements in that subarray must be ≥ `x`.
   - The operation of removing prefix and suffix is equivalent to selecting a contiguous subarray from the original array.

3. **How to check efficiently:** We can find the longest contiguous segment where all elements are ≥ `x` in O(n) time using a sliding window:
   - Scan through the array
   - When we see an element < `x`, reset the current segment length to 0
   - When we see an element ≥ `x`, increment the current segment length
   - Track the maximum segment length seen
   - If max segment length ≥ `k`, then `x` is feasible

4. **Binary search bounds:**
   - Lower bound: 1 (all elements are positive integers)
   - Upper bound: max(nums) (can't have minimum greater than the maximum element)

5. **Algorithm:**
   - Binary search on `x` from 1 to max(nums)
   - For each mid value, check if there exists a contiguous subarray of length ≥ `k` with all elements ≥ mid
   - If yes, search higher values; if no, search lower values

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log M) where n = len(nums), M = max(nums)
# Space: O(1)
def findXValue(nums, k):
    """
    Finds the maximum possible minimum value after removing
    a non-overlapping prefix and suffix.

    Args:
        nums: List of positive integers
        k: Minimum required length of remaining array

    Returns:
        Maximum possible minimum value
    """
    # Binary search on the answer x
    left, right = 1, max(nums)
    answer = 1  # Initialize with minimum possible value

    while left <= right:
        mid = (left + right) // 2

        # Check if mid is feasible: exists contiguous subarray
        # of length >= k with all elements >= mid
        current_length = 0
        max_length = 0

        for num in nums:
            if num >= mid:
                # Extend current contiguous segment
                current_length += 1
                max_length = max(max_length, current_length)
            else:
                # Reset current segment (element < mid breaks the condition)
                current_length = 0

        # If we found a segment long enough, mid is feasible
        if max_length >= k:
            answer = mid  # Update best answer found so far
            left = mid + 1  # Try for a larger value
        else:
            right = mid - 1  # Try smaller values

    return answer
```

```javascript
// Time: O(n log M) where n = nums.length, M = Math.max(...nums)
// Space: O(1)
function findXValue(nums, k) {
  /**
   * Finds the maximum possible minimum value after removing
   * a non-overlapping prefix and suffix.
   *
   * @param {number[]} nums - Array of positive integers
   * @param {number} k - Minimum required length of remaining array
   * @return {number} Maximum possible minimum value
   */
  // Binary search on the answer x
  let left = 1;
  let right = Math.max(...nums);
  let answer = 1; // Initialize with minimum possible value

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Check if mid is feasible: exists contiguous subarray
    // of length >= k with all elements >= mid
    let currentLength = 0;
    let maxLength = 0;

    for (const num of nums) {
      if (num >= mid) {
        // Extend current contiguous segment
        currentLength++;
        maxLength = Math.max(maxLength, currentLength);
      } else {
        // Reset current segment (element < mid breaks the condition)
        currentLength = 0;
      }
    }

    // If we found a segment long enough, mid is feasible
    if (maxLength >= k) {
      answer = mid; // Update best answer found so far
      left = mid + 1; // Try for a larger value
    } else {
      right = mid - 1; // Try smaller values
    }
  }

  return answer;
}
```

```java
// Time: O(n log M) where n = nums.length, M = max(nums)
// Space: O(1)
public class Solution {
    public int findXValue(int[] nums, int k) {
        /**
         * Finds the maximum possible minimum value after removing
         * a non-overlapping prefix and suffix.
         *
         * @param nums Array of positive integers
         * @param k Minimum required length of remaining array
         * @return Maximum possible minimum value
         */
        // Binary search on the answer x
        int left = 1;
        int right = 0;

        // Find maximum value in nums for upper bound
        for (int num : nums) {
            right = Math.max(right, num);
        }

        int answer = 1;  // Initialize with minimum possible value

        while (left <= right) {
            int mid = left + (right - left) / 2;  // Avoid overflow

            // Check if mid is feasible: exists contiguous subarray
            // of length >= k with all elements >= mid
            int currentLength = 0;
            int maxLength = 0;

            for (int num : nums) {
                if (num >= mid) {
                    // Extend current contiguous segment
                    currentLength++;
                    maxLength = Math.max(maxLength, currentLength);
                } else {
                    // Reset current segment (element < mid breaks the condition)
                    currentLength = 0;
                }
            }

            // If we found a segment long enough, mid is feasible
            if (maxLength >= k) {
                answer = mid;  // Update best answer found so far
                left = mid + 1;  // Try for a larger value
            } else {
                right = mid - 1;  // Try smaller values
            }
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log M) where:

- `n` is the length of the input array
- `M` is the maximum value in the array (upper bound for binary search)
- Binary search runs O(log M) iterations
- Each iteration scans the entire array once in O(n) time to check feasibility
- Total: O(n log M)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables like `left`, `right`, `mid`, `current_length`, `max_length`, etc.
- No additional data structures that scale with input size

This is efficient enough for typical constraints where n ≤ 10⁵ and values are reasonable.

## Common Mistakes

1. **Not recognizing the binary search opportunity:** Many candidates try to solve this directly with two pointers or dynamic programming. The monotonic property (if x works, then anything ≤ x also works) is crucial for binary search.

2. **Incorrect feasibility check:** The check must find the **longest contiguous segment** where all elements ≥ x. Some candidates incorrectly check if "at least k elements in total are ≥ x" without requiring contiguity. Remember: after removing prefix and suffix, the remaining elements must be contiguous.

3. **Off-by-one errors in binary search:**
   - Using `while left < right` instead of `while left <= right` and forgetting to update answer properly
   - Not initializing `answer` (should start at 1, the minimum possible)
   - Incorrectly updating `left = mid` instead of `left = mid + 1` (can cause infinite loops)

4. **Forgetting edge cases:**
   - When k = 1, answer should be max(nums) since we can keep just the maximum element
   - When k = n, answer is min(nums) since we must keep the entire array
   - When all elements are the same, binary search should still work correctly

## When You'll See This Pattern

This "binary search on answer" pattern appears in many optimization problems where:

1. You're asked to maximize/minimize some value
2. There's a monotonic relationship: if value X is achievable, then all values less/greater than X are also achievable
3. Checking feasibility for a given value is easier than directly finding the optimal value

**Related LeetCode problems:**

1. **Capacity To Ship Packages Within D Days (LeetCode 1011):** Similar binary search on the minimum capacity needed to ship packages within D days. Checking if a given capacity works is straightforward.

2. **Split Array Largest Sum (LeetCode 410):** Find the minimum largest sum when splitting array into m subarrays. Binary search on the maximum sum, with greedy checking.

3. **Koko Eating Bananas (LeetCode 875):** Minimize eating speed to finish bananas in h hours. Binary search on speed, with straightforward feasibility check.

All these problems share the same core structure: hard to optimize directly, but easy to check if a candidate value works, enabling binary search.

## Key Takeaways

1. **When to use "binary search on answer":** Look for problems asking to maximize/minimize a value where checking feasibility for a candidate value is easier than finding the optimal directly. The monotonic property is key.

2. **Transforming operations:** The prefix/suffix removal operation is equivalent to selecting a contiguous subarray. Many array manipulation problems become simpler when you recognize what the operation actually allows.

3. **Sliding window for contiguous conditions:** When checking if there exists a contiguous subarray satisfying some condition (like all elements ≥ x), use a sliding window approach to find the maximum length in O(n) time.

[Practice this problem on CodeJeet](/problem/find-x-value-of-array-i)
