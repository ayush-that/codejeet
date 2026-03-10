---
title: "How to Solve Maximum Sum of Two Non-Overlapping Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Sum of Two Non-Overlapping Subarrays. Medium difficulty, 60.8% acceptance rate. Topics: Array, Dynamic Programming, Sliding Window."
date: "2027-10-09"
category: "dsa-patterns"
tags:
  [
    "maximum-sum-of-two-non-overlapping-subarrays",
    "array",
    "dynamic-programming",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Maximum Sum of Two Non-Overlapping Subarrays

This problem asks us to find the maximum possible sum of two fixed-length subarrays that don't overlap in a given array. The tricky part is that the two subarrays can appear in either order: the first-length subarray could come before OR after the second-length subarray. This means we need to consider both arrangements while ensuring the subarrays never share any elements.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [0,6,5,2,2,5,1,9,4]`, `firstLen = 1`, `secondLen = 2`.

We need to find two non-overlapping subarrays of lengths 1 and 2 with maximum total sum. Let's think through the possibilities:

**Case 1: First-length subarray comes first (length 1, then length 2)**

- Position the length-1 subarray at index 0: `[0]` (sum=0)
  - Then length-2 subarray can start at index 1: `[6,5]` (sum=11) → total=11
  - Or at index 2: `[5,2]` (sum=7) → total=7
  - ... and so on
- Position the length-1 subarray at index 1: `[6]` (sum=6)
  - Length-2 subarray can start at index 2: `[5,2]` (sum=7) → total=13
  - Or at index 3: `[2,2]` (sum=4) → total=10
  - ... etc.

**Case 2: Second-length subarray comes first (length 2, then length 1)**

- Position the length-2 subarray at index 0: `[0,6]` (sum=6)
  - Then length-1 subarray can start at index 2: `[5]` (sum=5) → total=11
  - Or at index 3: `[2]` (sum=2) → total=8
  - ... etc.

By checking all combinations, we'd find the maximum is 20: length-1 subarray `[9]` at index 7 (sum=9) plus length-2 subarray `[5,6]` at indices 1-2 (sum=11). But checking all combinations manually is tedious — we need a systematic approach.

## Brute Force Approach

The brute force solution would check every possible pair of starting positions for the two subarrays:

1. For every possible starting position `i` of the first subarray (length `firstLen`)
2. For every possible starting position `j` of the second subarray (length `secondLen`)
3. Check if the subarrays overlap (they overlap if their index ranges intersect)
4. If they don't overlap, calculate their sums and track the maximum

The problem with this approach is its time complexity: O(n²) for the nested loops, plus O(L) for calculating each sum (where L is the subarray length). Even with prefix sums to calculate sums in O(1), we still have O(n²) from checking all position pairs, which is too slow for typical constraints (n up to 1000).

## Optimized Approach

The key insight is that we can process the array in **one pass** while maintaining the best subarray sum we've seen so far. Here's the step-by-step reasoning:

1. **Use prefix sums** to calculate any subarray sum in O(1) time. This eliminates the need to repeatedly sum elements.

2. **Process both arrangements separately**:
   - Case L-M: First-length subarray comes first, then second-length subarray
   - Case M-L: Second-length subarray comes first, then first-length subarray

3. **For each case, use a sliding window approach**:
   - Slide a window of the "first" subarray through the array
   - Keep track of the maximum sum of a "first" subarray seen so far
   - When we reach a position where a "second" subarray could start, combine the best "first" subarray sum with the current "second" subarray sum

4. **Why this works**: For any position where we could place the "second" subarray, the best possible "first" subarray that doesn't overlap with it is simply the best one we've seen before (for L-M case) or after (for M-L case) that position.

## Optimal Solution

The solution processes the array twice: once for each possible order of the subarrays. We use prefix sums for O(1) subarray sum calculation and maintain a running maximum of the "first" subarray as we iterate.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxSumTwoNoOverlap(nums, firstLen, secondLen):
    """
    Find maximum sum of two non-overlapping subarrays of given lengths.

    Approach:
    1. Calculate prefix sums for O(1) subarray sum queries
    2. Try both orders: firstLen then secondLen, and secondLen then firstLen
    3. For each order, slide through array maintaining best first subarray sum
    4. Combine with current second subarray sum to find maximum total
    """
    n = len(nums)

    # Step 1: Build prefix sum array
    # prefix[i] = sum of first i elements (prefix[0] = 0)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    def max_sum_for_order(L, M):
        """
        Calculate max sum when subarray of length L comes before length M.
        """
        max_sum = 0

        # max_L stores the maximum sum of a subarray of length L
        # that ends BEFORE the current M subarray starts
        max_L = 0

        # Iterate through possible starting positions of M subarray
        # M subarray can start at index i where i + M <= n
        # The earliest M can start is at index M (0-indexed)
        for i in range(M, n - L + 1):
            # Calculate sum of L subarray that ends right before M starts
            # L subarray ends at i-1, so it starts at i-L
            L_sum = prefix[i] - prefix[i - L]
            max_L = max(max_L, L_sum)

            # Calculate sum of current M subarray starting at i
            M_sum = prefix[i + M] - prefix[i]

            # Update maximum total sum
            max_sum = max(max_sum, max_L + M_sum)

        return max_sum

    # Try both possible orders and return the maximum
    return max(
        max_sum_for_order(firstLen, secondLen),  # L then M
        max_sum_for_order(secondLen, firstLen)   # M then L
    )
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Find maximum sum of two non-overlapping subarrays of given lengths.
 *
 * Approach:
 * 1. Calculate prefix sums for O(1) subarray sum queries
 * 2. Try both orders: firstLen then secondLen, and secondLen then firstLen
 * 3. For each order, slide through array maintaining best first subarray sum
 * 4. Combine with current second subarray sum to find maximum total
 */
function maxSumTwoNoOverlap(nums, firstLen, secondLen) {
  const n = nums.length;

  // Step 1: Build prefix sum array
  // prefix[i] = sum of first i elements (prefix[0] = 0)
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  /**
   * Calculate max sum when subarray of length L comes before length M.
   */
  function maxSumForOrder(L, M) {
    let maxSum = 0;

    // maxL stores the maximum sum of a subarray of length L
    // that ends BEFORE the current M subarray starts
    let maxL = 0;

    // Iterate through possible starting positions of M subarray
    // M subarray can start at index i where i + M <= n
    for (let i = M; i <= n - L; i++) {
      // Calculate sum of L subarray that ends right before M starts
      // L subarray ends at i-1, so it starts at i-L
      const LSum = prefix[i] - prefix[i - L];
      maxL = Math.max(maxL, LSum);

      // Calculate sum of current M subarray starting at i
      const MSum = prefix[i + M] - prefix[i];

      // Update maximum total sum
      maxSum = Math.max(maxSum, maxL + MSum);
    }

    return maxSum;
  }

  // Try both possible orders and return the maximum
  return Math.max(
    maxSumForOrder(firstLen, secondLen), // firstLen then secondLen
    maxSumForOrder(secondLen, firstLen) // secondLen then firstLen
  );
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    /**
     * Find maximum sum of two non-overlapping subarrays of given lengths.
     *
     * Approach:
     * 1. Calculate prefix sums for O(1) subarray sum queries
     * 2. Try both orders: firstLen then secondLen, and secondLen then firstLen
     * 3. For each order, slide through array maintaining best first subarray sum
     * 4. Combine with current second subarray sum to find maximum total
     */
    public int maxSumTwoNoOverlap(int[] nums, int firstLen, int secondLen) {
        int n = nums.length;

        // Step 1: Build prefix sum array
        // prefix[i] = sum of first i elements (prefix[0] = 0)
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }

        // Try both possible orders and return the maximum
        return Math.max(
            maxSumForOrder(prefix, firstLen, secondLen),  // firstLen then secondLen
            maxSumForOrder(prefix, secondLen, firstLen)   // secondLen then firstLen
        );
    }

    /**
     * Calculate max sum when subarray of length L comes before length M.
     */
    private int maxSumForOrder(int[] prefix, int L, int M) {
        int n = prefix.length - 1;  // Original array length
        int maxSum = 0;

        // maxL stores the maximum sum of a subarray of length L
        // that ends BEFORE the current M subarray starts
        int maxL = 0;

        // Iterate through possible starting positions of M subarray
        // M subarray can start at index i where i + M <= n
        for (int i = M; i <= n - L; i++) {
            // Calculate sum of L subarray that ends right before M starts
            // L subarray ends at i-1, so it starts at i-L
            int LSum = prefix[i] - prefix[i - L];
            maxL = Math.max(maxL, LSum);

            // Calculate sum of current M subarray starting at i
            int MSum = prefix[i + M] - prefix[i];

            // Update maximum total sum
            maxSum = Math.max(maxSum, maxL + MSum);
        }

        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the prefix sum array takes O(n)
- Each `max_sum_for_order` function runs in O(n) — it makes a single pass through the array
- We call it twice (for both orders), so total is O(2n) = O(n)

**Space Complexity: O(n)**

- We store the prefix sum array of size n+1
- All other variables use O(1) space
- The space could be reduced to O(1) by calculating running sums instead of storing prefix array, but the O(n) approach is clearer and still efficient

## Common Mistakes

1. **Forgetting to check both orders**: Candidates often only check one arrangement (e.g., firstLen then secondLen) and miss cases where the other order gives a better result. Always remember the subarrays can appear in either order.

2. **Off-by-one errors in index calculations**: When calculating subarray sums using prefix sums, remember that `prefix[r] - prefix[l]` gives the sum from index `l` to `r-1` (inclusive of l, exclusive of r). Double-check your indices: for subarray starting at `i` with length `L`, the sum is `prefix[i+L] - prefix[i]`.

3. **Incorrect overlap checking in the optimized approach**: In the sliding window solution, it's crucial to update `max_L` BEFORE calculating the combination with the current M subarray. If you update it after, you might accidentally use an L subarray that overlaps with the current M subarray.

4. **Not handling edge cases**: What if `firstLen + secondLen > n`? The problem guarantees valid inputs, but in interviews, it's good to mention this. Also, consider cases where one length is 0 (though constraints say positive integers).

## When You'll See This Pattern

This "maximum sum of non-overlapping subarrays" pattern appears in several variations:

1. **Maximum Sum of 3 Non-Overlapping Subarrays (LeetCode 689)**: The same concept extended to three subarrays. You need to track the best single subarray, then best two subarrays, then combine for three.

2. **Best Time to Buy and Sell Stock III (LeetCode 123)**: While not about fixed-length subarrays, it uses a similar "split point" concept where you find the best transaction before and after each day.

3. **Partition Array for Maximum Sum (LeetCode 1043)**: Uses dynamic programming with the idea of considering different partition points, similar to how we consider where to place the boundary between our two subarrays.

The core technique is **processing the array while maintaining the best result seen so far on one side**, then combining it with the current position. This avoids the need for nested loops.

## Key Takeaways

1. **When dealing with non-overlapping segments, consider processing from both directions**: Maintain the best result on the left as you scan right, or vice versa. This turns O(n²) checking into O(n).

2. **Prefix sums are your friend for subarray sum problems**: They transform O(L) sum calculations into O(1) lookups, which is crucial for efficiency.

3. **For problems with two components, try both arrangements**: When order matters but isn't fixed, don't assume one configuration — test both and take the maximum.

[Practice this problem on CodeJeet](/problem/maximum-sum-of-two-non-overlapping-subarrays)
