---
title: "How to Solve Maximum Number of Points with Cost — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Points with Cost. Medium difficulty, 41.8% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2026-08-07"
category: "dsa-patterns"
tags: ["maximum-number-of-points-with-cost", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Maximum Number of Points with Cost

This problem asks you to maximize points collected from an `m x n` matrix by picking exactly one cell from each row, but with a twist: if you pick column `c` in row `r` and column `c'` in the next row, you pay a penalty of `|c - c'|` points. The challenge is balancing between picking high-value cells and minimizing the column transition cost between rows. What makes this interesting is that a greedy approach fails—you can't just pick the maximum in each row independently because future transition costs depend on your current choice.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
points = [
    [1, 2, 3],
    [1, 5, 1],
    [3, 1, 1]
]
```

**Row 0:** We start with `[1, 2, 3]` since there's no previous row to consider.

**Row 1:** For each column in row 1, we need to consider:

- If we pick column 0 (value 1), we could have come from:
  - Column 0 in previous row: 1 + 1 - |0-0| = 2
  - Column 1 in previous row: 2 + 1 - |1-0| = 2
  - Column 2 in previous row: 3 + 1 - |2-0| = 2
    Best: 2
- If we pick column 1 (value 5), we could have come from:
  - Column 0: 1 + 5 - |0-1| = 5
  - Column 1: 2 + 5 - |1-1| = 7
  - Column 2: 3 + 5 - |2-1| = 7
    Best: 7
- If we pick column 2 (value 1), we could have come from:
  - Column 0: 1 + 1 - |0-2| = 0
  - Column 1: 2 + 1 - |1-2| = 2
  - Column 2: 3 + 1 - |2-2| = 4
    Best: 4

So after row 1, our best scores are `[2, 7, 4]`.

**Row 2:** Now using `[2, 7, 4]` as our previous best:

- Column 0 (value 3):
  - From col 0: 2 + 3 - |0-0| = 5
  - From col 1: 7 + 3 - |1-0| = 9
  - From col 2: 4 + 3 - |2-0| = 5
    Best: 9
- Column 1 (value 1):
  - From col 0: 2 + 1 - |0-1| = 2
  - From col 1: 7 + 1 - |1-1| = 8
  - From col 2: 4 + 1 - |2-1| = 4
    Best: 8
- Column 2 (value 1):
  - From col 0: 2 + 1 - |0-2| = 1
  - From col 1: 7 + 1 - |1-2| = 7
  - From col 2: 4 + 1 - |2-2| = 5
    Best: 7

Final best scores: `[9, 8, 7]`, so maximum is 9.

The path achieving this: row 0 col 2 (3), row 1 col 1 (5), row 2 col 0 (3). Total: 3 + 5 + 3 = 11, minus penalties: |2-1| + |1-0| = 1 + 1 = 2, so 11 - 2 = 9.

## Brute Force Approach

The brute force solution would try every possible path through the matrix. For each row, you could pick any of the `n` columns, and you have `m` rows, so there are `n^m` possible paths. For each path, you'd calculate the total points minus transition costs.

This is clearly exponential and would timeout even for moderate inputs (e.g., `m=100, n=100` gives `100^100` possibilities).

A naive dynamic programming approach without optimization would be `O(m * n^2)`:

- For each row `i` (1 to m-1)
- For each column `j` in row `i`
- Check all columns `k` in previous row to find the best transition

This is `O(m * n^2)` which is still too slow for the constraints (up to 10^5 cells).

## Optimized Approach

The key insight is that for each cell in the current row, we need the maximum of `dp_prev[k] - |j - k|` over all `k` in the previous row, where `dp_prev[k]` is the best score ending at column `k` in the previous row.

The naive `O(n^2)` check for each cell comes from computing this maximum separately for each `j`. But we can optimize this using **prefix and suffix maximums**:

For a given `j`, `dp_prev[k] - |j - k|` can be split into two cases:

1. When `k ≤ j`: `dp_prev[k] - (j - k) = (dp_prev[k] + k) - j`
2. When `k ≥ j`: `dp_prev[k] - (k - j) = (dp_prev[k] - k) + j`

So for each `j`, we need:

- Maximum of `(dp_prev[k] + k)` for `k ≤ j`, minus `j`
- Maximum of `(dp_prev[k] - k)` for `k ≥ j`, plus `j`

We can precompute these maximums in `O(n)` time using prefix and suffix arrays, then compute each `dp_curr[j]` in `O(1)` time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n) | Space: O(n)
def maxPoints(points):
    """
    Calculate maximum points with cost for column transitions.

    Args:
        points: 2D list of integers with dimensions m x n

    Returns:
        Maximum possible points
    """
    m, n = len(points), len(points[0])

    # dp array for the previous row, initialized with first row
    dp_prev = points[0][:]

    # Process each subsequent row
    for i in range(1, m):
        dp_curr = [0] * n

        # Precompute left_max: max(dp_prev[k] + k) for k from 0 to j
        left_max = [0] * n
        left_max[0] = dp_prev[0]  # dp_prev[0] + 0
        for j in range(1, n):
            # For each position, track the best value from left side
            left_max[j] = max(left_max[j-1], dp_prev[j] + j)

        # Precompute right_max: max(dp_prev[k] - k) for k from j to n-1
        right_max = [0] * n
        right_max[n-1] = dp_prev[n-1] - (n-1)
        for j in range(n-2, -1, -1):
            # For each position, track the best value from right side
            right_max[j] = max(right_max[j+1], dp_prev[j] - j)

        # Calculate dp_curr for each column
        for j in range(n):
            # Best coming from left side: max(dp_prev[k] + k) - j
            from_left = left_max[j] - j

            # Best coming from right side: max(dp_prev[k] - k) + j
            from_right = right_max[j] + j

            # Take the better of the two, plus current cell value
            dp_curr[j] = max(from_left, from_right) + points[i][j]

        # Update dp_prev for next iteration
        dp_prev = dp_curr

    # Answer is the maximum value in the last row
    return max(dp_prev)
```

```javascript
// Time: O(m * n) | Space: O(n)
function maxPoints(points) {
  /**
   * Calculate maximum points with cost for column transitions.
   *
   * @param {number[][]} points - 2D array of integers with dimensions m x n
   * @return {number} Maximum possible points
   */
  const m = points.length;
  const n = points[0].length;

  // dp array for the previous row, initialized with first row
  let dpPrev = [...points[0]];

  // Process each subsequent row
  for (let i = 1; i < m; i++) {
    const dpCurr = new Array(n).fill(0);

    // Precompute leftMax: max(dpPrev[k] + k) for k from 0 to j
    const leftMax = new Array(n);
    leftMax[0] = dpPrev[0]; // dpPrev[0] + 0
    for (let j = 1; j < n; j++) {
      // For each position, track the best value from left side
      leftMax[j] = Math.max(leftMax[j - 1], dpPrev[j] + j);
    }

    // Precompute rightMax: max(dpPrev[k] - k) for k from j to n-1
    const rightMax = new Array(n);
    rightMax[n - 1] = dpPrev[n - 1] - (n - 1);
    for (let j = n - 2; j >= 0; j--) {
      // For each position, track the best value from right side
      rightMax[j] = Math.max(rightMax[j + 1], dpPrev[j] - j);
    }

    // Calculate dpCurr for each column
    for (let j = 0; j < n; j++) {
      // Best coming from left side: max(dpPrev[k] + k) - j
      const fromLeft = leftMax[j] - j;

      // Best coming from right side: max(dpPrev[k] - k) + j
      const fromRight = rightMax[j] + j;

      // Take the better of the two, plus current cell value
      dpCurr[j] = Math.max(fromLeft, fromRight) + points[i][j];
    }

    // Update dpPrev for next iteration
    dpPrev = dpCurr;
  }

  // Answer is the maximum value in the last row
  return Math.max(...dpPrev);
}
```

```java
// Time: O(m * n) | Space: O(n)
class Solution {
    public long maxPoints(int[][] points) {
        /**
         * Calculate maximum points with cost for column transitions.
         *
         * @param points 2D array of integers with dimensions m x n
         * @return Maximum possible points
         */
        int m = points.length;
        int n = points[0].length;

        // dp array for the previous row, initialized with first row
        long[] dpPrev = new long[n];
        for (int j = 0; j < n; j++) {
            dpPrev[j] = points[0][j];
        }

        // Process each subsequent row
        for (int i = 1; i < m; i++) {
            long[] dpCurr = new long[n];

            // Precompute leftMax: max(dpPrev[k] + k) for k from 0 to j
            long[] leftMax = new long[n];
            leftMax[0] = dpPrev[0]; // dpPrev[0] + 0
            for (int j = 1; j < n; j++) {
                // For each position, track the best value from left side
                leftMax[j] = Math.max(leftMax[j-1], dpPrev[j] + j);
            }

            // Precompute rightMax: max(dpPrev[k] - k) for k from j to n-1
            long[] rightMax = new long[n];
            rightMax[n-1] = dpPrev[n-1] - (n-1);
            for (int j = n-2; j >= 0; j--) {
                // For each position, track the best value from right side
                rightMax[j] = Math.max(rightMax[j+1], dpPrev[j] - j);
            }

            // Calculate dpCurr for each column
            for (int j = 0; j < n; j++) {
                // Best coming from left side: max(dpPrev[k] + k) - j
                long fromLeft = leftMax[j] - j;

                // Best coming from right side: max(dpPrev[k] - k) + j
                long fromRight = rightMax[j] + j;

                // Take the better of the two, plus current cell value
                dpCurr[j] = Math.max(fromLeft, fromRight) + points[i][j];
            }

            // Update dpPrev for next iteration
            dpPrev = dpCurr;
        }

        // Answer is the maximum value in the last row
        long maxPoints = 0;
        for (long val : dpPrev) {
            maxPoints = Math.max(maxPoints, val);
        }
        return maxPoints;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(m * n)`

- We iterate through all `m` rows
- For each row, we do three passes over `n` columns:
  1. Left-to-right pass to compute `leftMax`
  2. Right-to-left pass to compute `rightMax`
  3. Final pass to compute `dpCurr`
- Each pass is `O(n)`, so total is `O(3 * m * n) = O(m * n)`

**Space Complexity:** `O(n)`

- We maintain `dpPrev`, `dpCurr`, `leftMax`, and `rightMax` arrays, each of size `n`
- This is `O(4n) = O(n)` space
- We could optimize further to use only `O(n)` total by reusing arrays, but the clarity of separate arrays is worth the small constant factor

## Common Mistakes

1. **Using greedy approach:** Picking the maximum in each row independently ignores transition costs. The example in the visual walkthrough shows why this fails: row 1 maximum is 5 at column 1, but if you pick it, you might pay higher transition costs later.

2. **Forgetting to handle large numbers:** The points can be up to 10^5, and with up to 10^5 cells, the total can exceed 32-bit integer range. Always use 64-bit integers (long in Java, no issue in Python, BigInt if needed in JavaScript).

3. **Incorrect prefix/suffix computation:** A common error is computing `max(dp_prev[k])` instead of `max(dp_prev[k] ± k)`. Remember the transformation: `dp_prev[k] - |j-k| = (dp_prev[k] + k) - j` for `k ≤ j`.

4. **Off-by-one errors in indices:** When computing `leftMax` and `rightMax`, ensure you're using the correct indices. `leftMax[j]` should consider columns 0 through `j`, and `rightMax[j]` should consider columns `j` through `n-1`.

## When You'll See This Pattern

This "prefix and suffix maximums" optimization pattern appears in problems where you need to compute `max(arr[k] ± f(k, j))` for each `j`:

1. **Minimum Path Sum with penalties** - Similar structure but with different transition costs
2. **Best Time to Buy and Sell Stock with Transaction Fee** - Uses similar prefix maximum tracking
3. **Trapping Rain Water** - Uses left and right maximums to compute water capacity at each position
4. **Maximum Subarray Sum with constraints** - When you need to consider elements with positional penalties

The core idea is recognizing when a computation can be decomposed into independent left and right components that can be preprocessed.

## Key Takeaways

1. **Break absolute value expressions:** `|j-k|` naturally splits into two cases (`k ≤ j` and `k ≥ j`), which allows separate optimization for each direction.

2. **Precompute directional maximums:** When you need `max(arr[k] ± f(k, j))` for each `j`, consider if you can precompute prefix and suffix arrays to get `O(1)` lookup per position.

3. **Think in terms of transformations:** The key insight was rewriting `dp_prev[k] - |j-k|` as `(dp_prev[k] + k) - j` or `(dp_prev[k] - k) + j`, separating the terms that depend only on `k` from those that depend on `j`.

Related problems: [Minimum Path Sum](/problem/minimum-path-sum), [Minimize the Difference Between Target and Chosen Elements](/problem/minimize-the-difference-between-target-and-chosen-elements)
