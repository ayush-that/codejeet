---
title: "How to Solve Pizza With 3n Slices — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Pizza With 3n Slices. Hard difficulty, 53.8% acceptance rate. Topics: Array, Dynamic Programming, Greedy, Heap (Priority Queue)."
date: "2029-01-01"
category: "dsa-patterns"
tags: ["pizza-with-3n-slices", "array", "dynamic-programming", "greedy", "hard"]
---

# How to Solve Pizza With 3n Slices

You have a circular pizza with `3n` slices of varying sizes. You and two friends take turns picking slices with specific rules: after you pick any slice, Alice takes the next slice counterclockwise, and Bob takes the next slice clockwise. Your goal is to maximize the total size of slices you collect. The challenge is that this is essentially a circular array problem where you cannot pick adjacent slices, and you need to pick exactly `n` slices for yourself from the `3n` total slices.

What makes this problem tricky is the circular constraint combined with the fact that you're effectively selecting `n` non-adjacent slices from a circular array to maximize their sum. The circular aspect means the first and last slices are adjacent, which complicates dynamic programming approaches.

## Visual Walkthrough

Let's trace through a small example: `slices = [1, 2, 3, 4, 5, 6]` where `3n = 6`, so `n = 2`.

The pizza is circular, so slice 6 is adjacent to slice 1. You need to pick 2 slices for yourself, and they cannot be adjacent (since Alice and Bob take the adjacent slices after each of your picks).

**Key insight**: This is equivalent to selecting `n` non-adjacent slices from a circular array to maximize their sum.

Let's consider possible valid selections:

- If you pick slice 1 (value 1), you cannot pick slices 2 or 6 (adjacent). You could then pick slice 4 (value 4) since it's not adjacent to 1. Total = 5.
- If you pick slice 2 (value 2), you cannot pick slices 1, 3, or 6. You could pick slice 5 (value 5). Total = 7.
- If you pick slice 3 (value 3), you cannot pick slices 2, 4, or 1. You could pick slice 6 (value 6). Total = 9.
- If you pick slice 4 (value 4), you cannot pick slices 3, 5, or 1. You could pick slice 1 (value 1). Total = 5.

The maximum is 9 (slices 3 and 6). Notice that in a circular array, we need to handle the case where we pick the first element separately from the case where we don't, since the first and last elements are adjacent.

## Brute Force Approach

A brute force approach would try all possible combinations of `n` slices from the `3n` slices, check if they're non-adjacent (considering circular adjacency), and track the maximum sum. This involves:

1. Generating all combinations of `n` indices from `[0, 1, ..., 3n-1]`
2. For each combination, checking that no two indices are adjacent (with special handling for circular adjacency)
3. Calculating the sum and tracking the maximum

The number of combinations is C(3n, n), which grows factorially. For `n = 10` (30 slices), that's C(30, 10) ≈ 30 million combinations. For `n = 33` (99 slices), it's astronomically large. This approach is clearly infeasible.

Even a recursive approach that tries to pick or skip each slice would have O(2^(3n)) time complexity, which is also exponential and too slow.

## Optimized Approach

The key insight is that this problem reduces to the **"House Robber II"** problem, where you need to select `n` non-adjacent elements from a circular array to maximize their sum.

In "House Robber II", you have a circular array of houses, and you want to maximize robbery without robbing adjacent houses. The solution is to solve the problem twice:

1. Exclude the last element (solve for array[0:n-1])
2. Exclude the first element (solve for array[1:n])
3. Take the maximum of both results

For our pizza problem with `3n` slices where we need to pick `n` slices:

- We need to pick exactly `n` slices (not up to `n`)
- We cannot pick adjacent slices (circular constraint)
- This becomes: "Select `n` non-adjacent elements from circular array of size `3n`"

We can use dynamic programming with state `dp[i][j]` = maximum sum we can get from the first `i` slices when we have picked `j` slices, with the constraint that no two picked slices are adjacent.

The recurrence relation:

- If we pick slice `i`: `dp[i][j] = dp[i-2][j-1] + slices[i]`
- If we don't pick slice `i`: `dp[i][j] = dp[i-1][j]`
- `dp[i][j] = max(pick, not_pick)`

For the circular constraint, we solve two cases:

1. We don't pick the first slice (so we can pick the last slice)
2. We don't pick the last slice (so we can pick the first slice)

We take the maximum of both cases.

## Optimal Solution

Here's the complete solution using dynamic programming:

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2)
def maxSizeSlices(slices):
    """
    Calculate the maximum sum of n non-adjacent slices from a circular pizza.

    Args:
        slices: List of integers representing slice sizes

    Returns:
        Maximum possible sum of slices you can take
    """
    n = len(slices) // 3  # Number of slices we need to pick
    m = len(slices)       # Total number of slices (3n)

    # Helper function to solve the linear (non-circular) version
    def solve_linear(arr):
        """
        Solve for a linear array (not circular).

        Args:
            arr: List of integers representing slice sizes in linear order

        Returns:
            Maximum sum when picking exactly n slices from linear array
        """
        # dp[i][j] = max sum using first i slices, picking exactly j slices
        # We need m+1 rows (0 to m) and n+1 columns (0 to n)
        dp = [[0] * (n + 1) for _ in range(len(arr) + 1)]

        # Base case: dp[0][j] = 0 for all j (no slices available)
        # dp[i][0] = 0 for all i (picking 0 slices gives sum 0)

        for i in range(1, len(arr) + 1):
            for j in range(1, n + 1):
                # If we pick slice i-1 (0-indexed in arr)
                if i >= 2:
                    pick = dp[i-2][j-1] + arr[i-1]
                else:
                    # If i < 2, we can only pick if j == 1
                    pick = arr[i-1] if j == 1 else 0

                # If we don't pick slice i-1
                not_pick = dp[i-1][j]

                # Take the maximum
                dp[i][j] = max(pick, not_pick)

        return dp[len(arr)][n]

    # Case 1: Exclude the first slice (solve for slices[1:])
    # This allows us to potentially pick the last slice
    case1 = solve_linear(slices[1:])

    # Case 2: Exclude the last slice (solve for slices[:-1])
    # This allows us to potentially pick the first slice
    case2 = solve_linear(slices[:-1])

    # Return the maximum of both cases
    return max(case1, case2)
```

```javascript
// Time: O(n^2) | Space: O(n^2)
/**
 * Calculate the maximum sum of n non-adjacent slices from a circular pizza.
 * @param {number[]} slices - Array of integers representing slice sizes
 * @return {number} Maximum possible sum of slices you can take
 */
function maxSizeSlices(slices) {
  const n = slices.length / 3; // Number of slices we need to pick
  const m = slices.length; // Total number of slices (3n)

  /**
   * Solve for a linear array (not circular).
   * @param {number[]} arr - Array of slice sizes in linear order
   * @return {number} Maximum sum when picking exactly n slices
   */
  function solveLinear(arr) {
    // dp[i][j] = max sum using first i slices, picking exactly j slices
    // We need arr.length+1 rows and n+1 columns
    const dp = Array(arr.length + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));

    // Base cases are already 0 (dp[0][j] = 0, dp[i][0] = 0)

    for (let i = 1; i <= arr.length; i++) {
      for (let j = 1; j <= n; j++) {
        // If we pick slice i-1 (0-indexed in arr)
        let pick;
        if (i >= 2) {
          pick = dp[i - 2][j - 1] + arr[i - 1];
        } else {
          // If i < 2, we can only pick if j == 1
          pick = j === 1 ? arr[i - 1] : 0;
        }

        // If we don't pick slice i-1
        const notPick = dp[i - 1][j];

        // Take the maximum
        dp[i][j] = Math.max(pick, notPick);
      }
    }

    return dp[arr.length][n];
  }

  // Case 1: Exclude the first slice (solve for slices[1:])
  // This allows us to potentially pick the last slice
  const case1 = solveLinear(slices.slice(1));

  // Case 2: Exclude the last slice (solve for slices[0:m-1])
  // This allows us to potentially pick the first slice
  const case2 = solveLinear(slices.slice(0, m - 1));

  // Return the maximum of both cases
  return Math.max(case1, case2);
}
```

```java
// Time: O(n^2) | Space: O(n^2)
class Solution {
    /**
     * Calculate the maximum sum of n non-adjacent slices from a circular pizza.
     * @param slices Array of integers representing slice sizes
     * @return Maximum possible sum of slices you can take
     */
    public int maxSizeSlices(int[] slices) {
        int n = slices.length / 3;  // Number of slices we need to pick
        int m = slices.length;      // Total number of slices (3n)

        // Case 1: Exclude the first slice (solve for slices[1:])
        // This allows us to potentially pick the last slice
        int case1 = solveLinear(Arrays.copyOfRange(slices, 1, m), n);

        // Case 2: Exclude the last slice (solve for slices[0:m-1])
        // This allows us to potentially pick the first slice
        int case2 = solveLinear(Arrays.copyOfRange(slices, 0, m - 1), n);

        // Return the maximum of both cases
        return Math.max(case1, case2);
    }

    /**
     * Solve for a linear array (not circular).
     * @param arr Array of slice sizes in linear order
     * @param k Number of slices to pick (n in the main function)
     * @return Maximum sum when picking exactly k slices
     */
    private int solveLinear(int[] arr, int k) {
        // dp[i][j] = max sum using first i slices, picking exactly j slices
        // We need arr.length+1 rows and k+1 columns
        int[][] dp = new int[arr.length + 1][k + 1];

        // Base cases are already 0 (dp[0][j] = 0, dp[i][0] = 0)

        for (int i = 1; i <= arr.length; i++) {
            for (int j = 1; j <= k; j++) {
                // If we pick slice i-1 (0-indexed in arr)
                int pick;
                if (i >= 2) {
                    pick = dp[i - 2][j - 1] + arr[i - 1];
                } else {
                    // If i < 2, we can only pick if j == 1
                    pick = (j == 1) ? arr[i - 1] : 0;
                }

                // If we don't pick slice i-1
                int notPick = dp[i - 1][j];

                // Take the maximum
                dp[i][j] = Math.max(pick, notPick);
            }
        }

        return dp[arr.length][k];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n²) where n is the number of slices to pick (n = len(slices)/3)

- We solve two linear DP problems, each with O(m × n) operations where m = 3n
- Since m = 3n, this is O(3n × n) = O(n²) for each case
- Two cases gives us O(2n²) = O(n²)

**Space Complexity**: O(n²)

- The DP table has dimensions (m+1) × (n+1) where m = 3n
- This is O(3n × n) = O(n²) space
- We can optimize to O(n) space by only keeping the previous two rows, but the O(n²) solution is clearer for understanding

## Common Mistakes

1. **Forgetting the circular constraint**: The most common mistake is treating the array as linear. Candidates solve for the entire array without realizing that the first and last slices are adjacent in a circular pizza. Always remember to handle circular arrays by solving two cases: excluding the first element and excluding the last element.

2. **Incorrect DP state definition**: Some candidates define `dp[i]` as the maximum sum using first `i` slices without tracking how many slices have been picked. Since we need to pick exactly `n` slices, we need a 2D DP state `dp[i][j]` where `j` tracks the number of picked slices.

3. **Off-by-one errors in indices**: When accessing `slices[i-1]` in the DP loop (since `i` starts from 1 but array indices start from 0), it's easy to make off-by-one mistakes. Always be careful with 0-based vs 1-based indexing in DP problems.

4. **Not handling the base case correctly**: When `i < 2` (only one slice available), we can only pick it if we need exactly 1 slice (`j == 1`). Forgetting this special case leads to incorrect results when the array is small.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Circular array DP**: Similar to "House Robber II" (LeetCode 213), where you need to solve a DP problem on a circular array by solving two linear cases.

2. **Selecting exactly k non-adjacent elements**: This appears in problems like "Maximum Sum of 3 Non-Overlapping Subarrays" (LeetCode 689) and "Delete and Earn" (LeetCode 740), where you need to select elements with constraints.

3. **Interval scheduling with constraints**: Problems where you need to select non-overlapping intervals or elements, like "Maximum Length of Pair Chain" (LeetCode 646) or "Non-overlapping Intervals" (LeetCode 435).

## Key Takeaways

1. **Circular array problems often reduce to solving two linear cases**: When dealing with circular constraints, a common technique is to break the circle by considering cases where you exclude either the first or last element.

2. **When you need to select exactly k items with constraints, use 2D DP**: The second dimension should track how many items have been selected so far. This pattern appears in many "select exactly k elements" problems.

3. **The "pick or skip" recurrence is fundamental**: For many DP problems involving sequence selection, the recurrence `dp[i] = max(pick_current, skip_current)` is a building block. The complexity comes from adding constraints like "non-adjacent" or "exactly k items".

[Practice this problem on CodeJeet](/problem/pizza-with-3n-slices)
