---
title: "How to Solve Max Dot Product of Two Subsequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Max Dot Product of Two Subsequences. Hard difficulty, 69.3% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-03-17"
category: "dsa-patterns"
tags: ["max-dot-product-of-two-subsequences", "array", "dynamic-programming", "hard"]
---

# How to Solve Max Dot Product of Two Subsequences

This problem asks us to find the maximum dot product between non-empty subsequences of two arrays with equal length. What makes this tricky is that we're not working with contiguous subarrays, but subsequences where we can skip elements, and we must ensure both subsequences have the same length. The challenge lies in efficiently exploring all possible matching combinations without exponential time complexity.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider:

- `nums1 = [2, 1, -2, 5]`
- `nums2 = [3, 0, -6]`

We need to find subsequences of equal length that maximize their dot product. Let's think through some possibilities:

1. **Single element pairs**:
   - (2, 3) = 6
   - (2, 0) = 0
   - (2, -6) = -12
   - (1, 3) = 3
   - (1, 0) = 0
   - (1, -6) = -6
   - (-2, 3) = -6
   - (-2, 0) = 0
   - (-2, -6) = 12
   - (5, 3) = 15
   - (5, 0) = 0
   - (5, -6) = -30

   Best single element: (5, 3) = 15

2. **Two-element subsequences**:
   - From nums1: [2, 1], nums2: [3, 0] → 2×3 + 1×0 = 6
   - [2, 1] with [3, -6] → 2×3 + 1×(-6) = 0
   - [2, -2] with [3, 0] → 2×3 + (-2)×0 = 6
   - [2, -2] with [3, -6] → 2×3 + (-2)×(-6) = 6 + 12 = 18
   - [2, 5] with [3, 0] → 2×3 + 5×0 = 6
   - [2, 5] with [3, -6] → 2×3 + 5×(-6) = 6 - 30 = -24
   - [1, -2] with [3, 0] → 1×3 + (-2)×0 = 3
   - [1, -2] with [3, -6] → 1×3 + (-2)×(-6) = 3 + 12 = 15
   - [1, 5] with [3, 0] → 1×3 + 5×0 = 3
   - [1, 5] with [3, -6] → 1×3 + 5×(-6) = 3 - 30 = -27
   - [-2, 5] with [3, 0] → (-2)×3 + 5×0 = -6
   - [-2, 5] with [3, -6] → (-2)×3 + 5×(-6) = -6 - 30 = -36

   Best two-element: 18 from [2, -2] with [3, -6]

3. **Three-element subsequences**:
   - Only possible if both arrays have at least 3 elements
   - Here nums2 only has 3 elements, nums1 has 4
   - We could take [2, 1, -2] from nums1 and [3, 0, -6] from nums2
     → 2×3 + 1×0 + (-2)×(-6) = 6 + 0 + 12 = 18

The maximum is 18, which comes from either two-element or three-element subsequences. Notice how we need to consider all lengths and all combinations.

## Brute Force Approach

The brute force approach would generate all possible subsequences from both arrays and compute their dot products. For each array of length n, there are 2ⁿ possible subsequences (including the empty one). We'd need to:

1. Generate all non-empty subsequences of nums1
2. Generate all non-empty subsequences of nums2
3. For each pair of subsequences with equal length, compute dot product
4. Track the maximum

This is clearly exponential: O(2^(m+n)) where m and n are array lengths. Even for modest arrays (m=n=20), this would be over 1 trillion operations.

A naive candidate might try to use greedy selection (always pick the largest positive products), but this fails because negative numbers can combine to give positive products (like -2 × -6 = 12 in our example).

## Optimized Approach

The key insight is that this is a **dynamic programming** problem similar to the Longest Common Subsequence (LCS) problem, but instead of counting matches, we're maximizing a weighted sum.

Let's define `dp[i][j]` as the maximum dot product we can get using the first `i` elements of nums1 and first `j` elements of nums2. At each step, we have four choices:

1. **Use both current elements**: Add `nums1[i-1] * nums2[j-1]` to the best result from previous elements `dp[i-1][j-1]`
2. **Skip nums1's current element**: Take `dp[i-1][j]`
3. **Skip nums2's current element**: Take `dp[i][j-1]`
4. **Start fresh with just the current pair**: Use only `nums1[i-1] * nums2[j-1]` (this handles cases where previous results were negative)

The recurrence relation is:

```
dp[i][j] = max(
    nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1]),  // Use both, but only add previous if positive
    dp[i-1][j],  // Skip nums1[i-1]
    dp[i][j-1],  // Skip nums2[j-1]
    nums1[i-1] * nums2[j-1]  // Just the current pair
)
```

We need the `max(0, dp[i-1][j-1])` because if previous results were negative, we're better off starting fresh with just the current pair.

## Optimal Solution

Here's the complete dynamic programming solution:

<div class="code-group">

```python
# Time: O(m*n) | Space: O(m*n) where m,n are lengths of nums1,nums2
def maxDotProduct(nums1, nums2):
    """
    Returns the maximum dot product between non-empty subsequences
    of nums1 and nums2 with equal length.
    """
    m, n = len(nums1), len(nums2)

    # Create DP table with dimensions (m+1) x (n+1)
    # dp[i][j] = max dot product using first i elements of nums1
    # and first j elements of nums2
    dp = [[float('-inf')] * (n + 1) for _ in range(m + 1)]

    # Fill the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            # Current product of the last elements
            current_product = nums1[i - 1] * nums2[j - 1]

            # Option 1: Use both current elements
            # We take max(0, dp[i-1][j-1]) because if previous result is negative,
            # we're better off starting fresh with just the current pair
            use_both = current_product + max(0, dp[i - 1][j - 1])

            # Option 2: Skip current element of nums1
            skip_nums1 = dp[i - 1][j]

            # Option 3: Skip current element of nums2
            skip_nums2 = dp[i][j - 1]

            # Option 4: Use only the current pair (start fresh)
            only_current = current_product

            # Take the maximum of all options
            dp[i][j] = max(use_both, skip_nums1, skip_nums2, only_current)

    # The answer is in dp[m][n] - using all elements from both arrays
    return dp[m][n]
```

```javascript
// Time: O(m*n) | Space: O(m*n) where m,n are lengths of nums1,nums2
function maxDotProduct(nums1, nums2) {
  const m = nums1.length,
    n = nums2.length;

  // Create DP table with dimensions (m+1) x (n+1)
  // dp[i][j] = max dot product using first i elements of nums1
  // and first j elements of nums2
  const dp = Array.from({ length: m + 1 }, () => Array.from({ length: n + 1 }, () => -Infinity));

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // Current product of the last elements
      const currentProduct = nums1[i - 1] * nums2[j - 1];

      // Option 1: Use both current elements
      // We take max(0, dp[i-1][j-1]) because if previous result is negative,
      // we're better off starting fresh with just the current pair
      const useBoth = currentProduct + Math.max(0, dp[i - 1][j - 1]);

      // Option 2: Skip current element of nums1
      const skipNums1 = dp[i - 1][j];

      // Option 3: Skip current element of nums2
      const skipNums2 = dp[i][j - 1];

      // Option 4: Use only the current pair (start fresh)
      const onlyCurrent = currentProduct;

      // Take the maximum of all options
      dp[i][j] = Math.max(useBoth, skipNums1, skipNums2, onlyCurrent);
    }
  }

  // The answer is in dp[m][n] - using all elements from both arrays
  return dp[m][n];
}
```

```java
// Time: O(m*n) | Space: O(m*n) where m,n are lengths of nums1,nums2
class Solution {
    public int maxDotProduct(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length;

        // Create DP table with dimensions (m+1) x (n+1)
        // dp[i][j] = max dot product using first i elements of nums1
        // and first j elements of nums2
        int[][] dp = new int[m + 1][n + 1];

        // Initialize with negative infinity (use Integer.MIN_VALUE/2 to avoid overflow)
        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                dp[i][j] = Integer.MIN_VALUE / 2;
            }
        }

        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                // Current product of the last elements
                int currentProduct = nums1[i - 1] * nums2[j - 1];

                // Option 1: Use both current elements
                // We take max(0, dp[i-1][j-1]) because if previous result is negative,
                // we're better off starting fresh with just the current pair
                int useBoth = currentProduct + Math.max(0, dp[i - 1][j - 1]);

                // Option 2: Skip current element of nums1
                int skipNums1 = dp[i - 1][j];

                // Option 3: Skip current element of nums2
                int skipNums2 = dp[i][j - 1];

                // Option 4: Use only the current pair (start fresh)
                int onlyCurrent = currentProduct;

                // Take the maximum of all options
                dp[i][j] = Math.max(Math.max(useBoth, skipNums1),
                                   Math.max(skipNums2, onlyCurrent));
            }
        }

        // The answer is in dp[m][n] - using all elements from both arrays
        return dp[m][n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m × n) where m and n are the lengths of nums1 and nums2. We iterate through all m × n cells of our DP table, performing constant work at each cell.

**Space Complexity**: O(m × n) for the DP table. We could optimize to O(min(m, n)) by only keeping two rows of the DP table at a time, since we only need the previous row to compute the current row. However, the O(m × n) solution is usually acceptable in interviews and is easier to understand.

## Common Mistakes

1. **Forgetting that subsequences must be non-empty**: Some candidates might initialize dp[0][0] = 0 and return that for empty arrays. But the problem requires non-empty subsequences, so we must ensure we always include at least one pair.

2. **Not considering the "start fresh" option**: The trickiest part is realizing that if previous results are negative, we shouldn't add them to our current product. We need the `max(0, dp[i-1][j-1])` term and the "only current" option to handle this.

3. **Incorrect initialization**: Initializing the DP table with 0 instead of negative infinity can cause issues. For example, if all products are negative, the answer should be the least negative product, not 0.

4. **Confusing subsequences with subarrays**: Remember subsequences don't need to be contiguous. This affects how we skip elements - we can skip any element from either array independently.

## When You'll See This Pattern

This problem uses a **2D dynamic programming** pattern common in sequence alignment problems:

1. **Longest Common Subsequence (LeetCode 1143)**: Similar DP structure but counts matches instead of maximizing weighted sum.

2. **Edit Distance (LeetCode 72)**: Uses similar DP table to find minimum operations to transform one string to another.

3. **Maximum Length of Repeated Subarray (LeetCode 718)**: Another 2D DP problem dealing with sequences, though for contiguous subarrays.

The pattern is: when you have two sequences and need to find an optimal alignment/matching between them (allowing skips), think 2D DP where dp[i][j] represents the optimal solution for the first i elements of sequence 1 and first j elements of sequence 2.

## Key Takeaways

1. **Recognize sequence alignment problems**: When you need to match elements from two sequences with possible skips, it's often a 2D DP problem.

2. **Think about all possibilities at each step**: For each pair of positions (i, j), consider all options: use both, skip from first sequence, skip from second sequence, or start fresh.

3. **Handle negative contributions carefully**: If previous results can be negative, you might need to ignore them (take max with 0) or have a "start fresh" option.

[Practice this problem on CodeJeet](/problem/max-dot-product-of-two-subsequences)
