---
title: "How to Solve Minimum Cost to Make Arrays Identical — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Make Arrays Identical. Medium difficulty, 37.7% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2029-08-11"
category: "dsa-patterns"
tags: ["minimum-cost-to-make-arrays-identical", "array", "greedy", "sorting", "medium"]
---

# How to Solve Minimum Cost to Make Arrays Identical

This problem asks us to transform array `arr` into array `brr` using two operations: rearranging contiguous subarrays (cost `k`) and modifying individual elements (cost `|arr[i] - brr[j]|`). The challenge lies in balancing when to pay the fixed rearrangement cost versus paying for element mismatches. The key insight is recognizing this as an optimization problem where we need to partition both arrays into matching segments.

## Visual Walkthrough

Let's trace through a concrete example:

- `arr = [3, 5, 2, 7]`
- `brr = [2, 3, 7, 5]`
- `k = 4`

**Step 1: Understanding the operations**

1. Rearrangement: Split `arr` into contiguous subarrays, reorder them, cost = `k` per operation
2. Element modification: Change any `arr[i]` to any value, cost = absolute difference

**Step 2: Initial observation**
If we don't rearrange at all, we must modify each mismatched element:

- Position 0: |3-2| = 1
- Position 1: |5-3| = 2
- Position 2: |2-7| = 5
- Position 3: |7-5| = 2
  Total = 10, no rearrangement cost

**Step 3: Trying one rearrangement**
What if we rearrange `arr` to match `brr` exactly? First, we need to find if `arr` can be rearranged to equal `brr`. Since both arrays contain the same multiset of elements (3,5,2,7), we can potentially match them.

We could split `arr` into individual elements (4 subarrays), rearrange to match `brr`, paying `k = 4` once, then pay 0 for modifications since arrays match. Total = 4, which is better than 10.

**Step 4: Finding optimal partitioning**
But maybe we can do better by grouping elements. Consider splitting into two segments:

- Segment 1: `[3, 5]` from `arr` → `[2, 3]` from `brr`
- Segment 2: `[2, 7]` from `arr` → `[7, 5]` from `brr`

For segment 1: Sort both → `[3, 5]` and `[2, 3]`, modification cost = |3-2| + |5-3| = 1+2 = 3
For segment 2: Sort both → `[2, 7]` and `[5, 7]`, modification cost = |2-5| + |7-7| = 3+0 = 3
Total modification = 6, plus 1 rearrangement (k=4) = 10. Worse than rearranging all individually.

**Step 5: The optimal solution**
Actually, the best approach here is to rearrange all elements individually (cost 4) with 0 modification cost, total = 4.

This example shows we need a systematic way to decide how to partition the arrays.

## Brute Force Approach

A brute force approach would try all possible ways to partition and match the arrays:

1. Generate all permutations of `arr` (n! possibilities)
2. For each permutation, calculate the cost to transform it to `brr`
3. Consider all possible split points in both arrays

This is clearly infeasible for any reasonable n (n! grows extremely fast). Even for n=10, we have 3.6 million permutations. A naive candidate might try dynamic programming with state tracking which elements have been matched, but that's O(n! × n) at best.

The problem requires a more clever observation: since we can rearrange subarrays arbitrarily, the relative order within matched segments doesn't matter - we can sort them! This reduces the problem to finding an optimal partition where we match sorted segments.

## Optimized Approach

The key insight comes in two parts:

1. **Within a matched segment, we should sort both arrays** because:
   - We can rearrange the segment arbitrarily (due to the rearrangement operation)
   - The minimum cost to make two multisets identical is achieved by pairing their sorted versions and summing absolute differences
   - This works because rearrangement lets us reorder elements within a segment for free

2. **We need to find the optimal partition** using dynamic programming:
   - Let `dp[i]` = minimum cost to match first `i` elements of the sorted arrays
   - Base case: `dp[0] = 0` (matching 0 elements costs 0)
   - Transition: `dp[i] = min(dp[j] + k + cost(j, i))` for all j < i
   - Where `cost(j, i)` = cost to match elements from index j to i-1 as one segment

The `cost(j, i)` is calculated by:

1. Taking slices `arr[j:i]` and `brr[j:i]`
2. Sorting both slices
3. Summing `abs(arr_sorted[k] - brr_sorted[k])` for k in range(i-j)

This gives us O(n²) solution. But we can optimize further: since we're always taking prefixes when calculating costs, we can precompute sorted versions of the entire arrays and use prefix sums of absolute differences.

## Optimal Solution

The optimal solution uses dynamic programming with a clever precomputation:

1. Sort both `arr` and `brr` entirely
2. Precompute prefix sums of absolute differences between sorted arrays
3. Use DP to find optimal partition points

Why does sorting the entire arrays work? Because within any segment [j, i), if we take the j-th to i-th smallest elements from both arrays, pairing them in order gives the minimum modification cost for that segment.

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def minCostToMakeArraysIdentical(arr, brr, k):
    n = len(arr)

    # Step 1: Sort both arrays
    # This allows us to pair corresponding elements within segments
    arr_sorted = sorted(arr)
    brr_sorted = sorted(brr)

    # Step 2: Precompute prefix sums of absolute differences
    # diff[i] = sum_{j=0}^{i-1} |arr_sorted[j] - brr_sorted[j]|
    diff = [0] * (n + 1)
    for i in range(1, n + 1):
        diff[i] = diff[i - 1] + abs(arr_sorted[i - 1] - brr_sorted[i - 1])

    # Step 3: DP array where dp[i] = min cost for first i elements
    dp = [float('inf')] * (n + 1)
    dp[0] = 0  # Base case: 0 elements cost 0

    # Step 4: Fill DP table
    for i in range(1, n + 1):
        # Try all possible previous partition points j
        for j in range(i):
            # Cost = cost to reach j + rearrangement cost + modification cost for segment [j, i)
            # Modification cost for segment [j, i) = diff[i] - diff[j]
            cost = dp[j] + k + (diff[i] - diff[j])
            dp[i] = min(dp[i], cost)

    # Step 5: The answer is dp[n] minus k because we don't need rearrangement for the last segment
    # Actually, we need to subtract k because we always add k for each segment including the last one,
    # but we don't need to rearrange after the last segment
    return dp[n] - k
```

```javascript
// Time: O(n^2) | Space: O(n)
function minCostToMakeArraysIdentical(arr, brr, k) {
  const n = arr.length;

  // Step 1: Sort both arrays
  // Create copies to avoid modifying originals
  const arrSorted = [...arr].sort((a, b) => a - b);
  const brrSorted = [...brr].sort((a, b) => a - b);

  // Step 2: Precompute prefix sums of absolute differences
  // diff[i] = sum of |arrSorted[j] - brrSorted[j]| for j < i
  const diff = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    diff[i] = diff[i - 1] + Math.abs(arrSorted[i - 1] - brrSorted[i - 1]);
  }

  // Step 3: DP array initialization
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0; // Base case: 0 elements cost 0

  // Step 4: Fill DP table
  for (let i = 1; i <= n; i++) {
    // Try all possible previous partition points
    for (let j = 0; j < i; j++) {
      // Cost = cost to reach j + rearrangement cost + modification cost for segment [j, i)
      const segmentCost = diff[i] - diff[j];
      const totalCost = dp[j] + k + segmentCost;
      dp[i] = Math.min(dp[i], totalCost);
    }
  }

  // Step 5: Subtract k because we don't need rearrangement after the last segment
  return dp[n] - k;
}
```

```java
// Time: O(n^2) | Space: O(n)
import java.util.Arrays;

public class Solution {
    public int minCostToMakeArraysIdentical(int[] arr, int[] brr, int k) {
        int n = arr.length;

        // Step 1: Sort both arrays
        // Create copies to avoid modifying original arrays
        int[] arrSorted = arr.clone();
        int[] brrSorted = brr.clone();
        Arrays.sort(arrSorted);
        Arrays.sort(brrSorted);

        // Step 2: Precompute prefix sums of absolute differences
        // diff[i] = sum of |arrSorted[j] - brrSorted[j]| for j < i
        long[] diff = new long[n + 1];
        for (int i = 1; i <= n; i++) {
            diff[i] = diff[i - 1] + Math.abs(arrSorted[i - 1] - brrSorted[i - 1]);
        }

        // Step 3: DP array initialization
        long[] dp = new long[n + 1];
        Arrays.fill(dp, Long.MAX_VALUE);
        dp[0] = 0;  // Base case: 0 elements cost 0

        // Step 4: Fill DP table
        for (int i = 1; i <= n; i++) {
            // Try all possible previous partition points
            for (int j = 0; j < i; j++) {
                // Cost = cost to reach j + rearrangement cost + modification cost for segment [j, i)
                long segmentCost = diff[i] - diff[j];
                long totalCost = dp[j] + k + segmentCost;
                if (totalCost < dp[i]) {
                    dp[i] = totalCost;
                }
            }
        }

        // Step 5: Subtract k because we don't need rearrangement after the last segment
        return (int)(dp[n] - k);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- Sorting both arrays takes O(n log n)
- Precomputing prefix sums takes O(n)
- The DP has O(n²) transitions: for each i (n iterations), we try all j < i (up to n iterations)
- Total: O(n log n + n²) = O(n²) dominates

**Space Complexity:** O(n)

- We store sorted arrays: O(n)
- Prefix sum array: O(n)
- DP array: O(n)
- Total: O(n)

The O(n²) time might seem high, but for typical constraints (n ≤ 1000), this is acceptable. There's actually an O(n log n) solution using convex hull trick, but the O(n²) DP is usually sufficient for interviews.

## Common Mistakes

1. **Not sorting within segments**: The most common error is trying to match segments without sorting them first. Remember: rearrangement lets us reorder elements within a segment, so we should always pair the smallest with smallest, second smallest with second smallest, etc.

2. **Forgetting to subtract k at the end**: We add rearrangement cost k for every segment including the last one, but we don't need to rearrange after matching the final segment. Failing to subtract k leads to overcounting by exactly k.

3. **Using the wrong cost calculation**: Some candidates try to calculate modification cost without sorting, or try to match original indices instead of sorted values. The key is that within a segment, we can rearrange arbitrarily, so only the multiset matters, not the original order.

4. **Integer overflow**: When n is large (up to 10⁵ in some versions), the costs can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, int64 in Python) for DP values and prefix sums.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Partition DP**: Similar to "Palindrome Partitioning II" (LeetCode 132) where you partition a string into palindromes with minimum cuts. Both use DP to find optimal partition points.

2. **Sorting for matching**: Like "Minimum Absolute Difference" (LeetCode 1200) where sorting helps find minimum differences. The insight that sorting minimizes pairwise absolute differences is widely applicable.

3. **Rearrangement with cost**: Similar to "Minimum Cost to Make Array Equal" (LeetCode 2448) where you can change elements with certain costs. Both involve balancing operation costs against transformation goals.

4. **Segment-based operations**: Reminiscent of "Minimum Cost to Cut a Stick" (LeetCode 1547) where operations on segments have costs that depend on segment composition.

## Key Takeaways

1. **When rearrangement is allowed within segments, sort them**: This is the core insight. If you can reorder elements freely within a group, the optimal matching is achieved by sorting both groups and pairing corresponding elements.

2. **Partition DP structure is dp[i] = min(dp[j] + cost(j,i))**: This pattern appears whenever you need to split a sequence optimally. The cost function can often be precomputed or calculated efficiently.

3. **Watch for off-by-one with costs**: When an operation cost applies to creating segments but not to the final state (like the rearrangement cost k), remember to adjust the final answer accordingly.

[Practice this problem on CodeJeet](/problem/minimum-cost-to-make-arrays-identical)
