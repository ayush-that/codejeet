---
title: "How to Solve Largest Submatrix With Rearrangements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Submatrix With Rearrangements. Medium difficulty, 75.2% acceptance rate. Topics: Array, Greedy, Sorting, Matrix."
date: "2027-11-17"
category: "dsa-patterns"
tags: ["largest-submatrix-with-rearrangements", "array", "greedy", "sorting", "medium"]
---

## How to Solve Largest Submatrix With Rearrangements

You're given a binary matrix where you can rearrange columns in any order. Your goal is to find the largest rectangular submatrix containing only 1's after optimal column rearrangement. What makes this problem interesting is that column rearrangement allows us to "stack" 1's vertically in ways that wouldn't be possible in a fixed column order, enabling larger submatrices.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Matrix:
[0, 0, 1]
[1, 1, 1]
[1, 0, 1]
```

**Step 1: Convert to heights**
For each cell, we want to know "how many consecutive 1's are above this cell (including itself)?" This gives us "pillars" of 1's that we can potentially rearrange.

Row 0: `[0, 0, 1]` (no rows above)
Row 1: For each column, if current cell is 1, add 1 to the height above it:

- Column 0: 1 (current) + 0 (above) = 1
- Column 1: 1 (current) + 0 (above) = 1
- Column 2: 1 (current) + 1 (above) = 2
  Result: `[1, 1, 2]`

Row 2: Same logic:

- Column 0: 1 + 1 = 2
- Column 1: 0 + 1 = 0 (reset to 0 when current cell is 0!)
- Column 2: 1 + 2 = 3
  Result: `[2, 0, 3]`

**Step 2: Sort and calculate area for each row**
Now for each row, we sort the heights in descending order and calculate potential rectangle areas.

Row 1 heights: `[1, 1, 2]` sorted → `[2, 1, 1]`

- At position 0: height = 2, width = 1 → area = 2 × 1 = 2
- At position 1: height = 1, width = 2 → area = 1 × 2 = 2
- At position 2: height = 1, width = 3 → area = 1 × 3 = 3
  Max area for this row = 3

Row 2 heights: `[2, 0, 3]` sorted → `[3, 2, 0]`

- Position 0: height = 3, width = 1 → area = 3
- Position 1: height = 2, width = 2 → area = 4
- Position 2: height = 0, width = 3 → area = 0
  Max area for this row = 4

**Step 3: Track maximum**
Overall maximum area = max(3, 4) = 4

The optimal submatrix is 2 rows tall (rows 1-2) and 2 columns wide (after rearranging columns with heights 2 and 3 next to each other).

## Brute Force Approach

A naive approach would be:

1. Generate all possible column permutations (n! possibilities)
2. For each permutation, find the largest rectangle of 1's (like "Maximal Rectangle" problem)
3. Track the maximum area found

This is clearly infeasible. Even for a modest 10×10 matrix, we'd have 10! = 3.6 million permutations, and for each we'd need O(m×n) time to find the largest rectangle. The total complexity would be O(n! × m × n), which is astronomical.

What makes this problem solvable is the key insight: **Column rearrangement only matters for grouping columns with similar heights together**. We don't need to try all permutations—we just need to sort heights at each row level.

## Optimized Approach

The core insight has two parts:

1. **Height accumulation**: For each cell `(i, j)`, if `matrix[i][j] = 1`, then `height[i][j] = height[i-1][j] + 1`. If it's 0, reset to 0. This tells us "how tall of a pillar of 1's exists ending at this row for each column."

2. **Sorting for optimal arrangement**: At each row, if we sort the heights in descending order, then for position `k` in the sorted array, `sorted[k]` represents the height of the pillar, and `(k+1)` represents how many columns we can include (since all columns to the left have equal or greater height). The area at position `k` is `sorted[k] × (k+1)`.

Why does sorting work? Because after sorting descending, any subarray starting from index 0 represents columns we can group together. The minimum height in that group is the last element's height, but since we calculate area for each position individually using its own height as the limiting factor, we're essentially trying every possible "base height" for our rectangle.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m × n log n) - we sort n columns for each of m rows
# Space: O(n) - we only need to store heights for current row
def largestSubmatrix(matrix):
    m, n = len(matrix), len(matrix[0])

    # Step 1: Initialize heights array with first row
    # heights[j] stores the number of consecutive 1's in column j
    # ending at the current row
    heights = [0] * n
    max_area = 0

    # Process each row
    for i in range(m):
        # Update heights for current row
        for j in range(n):
            if matrix[i][j] == 1:
                # Extend the pillar of 1's from row above
                heights[j] += 1
            else:
                # Reset to 0 if current cell is 0
                heights[j] = 0

        # Step 2: Create a copy of heights to sort
        # We need to sort but preserve original order for next iteration
        sorted_heights = heights.copy()

        # Sort in descending order - this simulates optimal column rearrangement
        # Higher pillars should be grouped together to maximize area
        sorted_heights.sort(reverse=True)

        # Step 3: Calculate maximum area for current row
        # For each position k, sorted_heights[k] is the pillar height
        # and (k+1) is how many columns we can include with at least this height
        for k in range(n):
            # Area = height × width, where width = (k+1)
            # This works because all columns 0..k have height >= sorted_heights[k]
            current_area = sorted_heights[k] * (k + 1)
            max_area = max(max_area, current_area)

    return max_area
```

```javascript
// Time: O(m × n log n) - sorting n columns for each of m rows
// Space: O(n) - storing heights for current row
function largestSubmatrix(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;

  // Step 1: Initialize heights array
  // heights[j] = number of consecutive 1's in column j ending at current row
  let heights = new Array(n).fill(0);
  let maxArea = 0;

  // Process each row from top to bottom
  for (let i = 0; i < m; i++) {
    // Update heights based on current row
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 1) {
        // Extend the pillar from previous row
        heights[j] += 1;
      } else {
        // Reset to 0 if current cell is 0
        heights[j] = 0;
      }
    }

    // Step 2: Create a copy of heights to sort
    // We sort descending to group taller pillars together
    let sortedHeights = [...heights];
    sortedHeights.sort((a, b) => b - a);

    // Step 3: Calculate maximum rectangle area for this row
    // After sorting, for index k, we can form a rectangle of height
    // sortedHeights[k] using the first (k+1) columns
    for (let k = 0; k < n; k++) {
      // Area = height × width
      // Width is (k+1) because we're using columns 0 through k
      const currentArea = sortedHeights[k] * (k + 1);
      maxArea = Math.max(maxArea, currentArea);
    }
  }

  return maxArea;
}
```

```java
// Time: O(m × n log n) - sorting n columns for each of m rows
// Space: O(n) - additional array for heights
class Solution {
    public int largestSubmatrix(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;

        // Step 1: Initialize heights array
        // heights[j] stores consecutive 1's count for column j
        int[] heights = new int[n];
        int maxArea = 0;

        // Process each row
        for (int i = 0; i < m; i++) {
            // Update heights for current row
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 1) {
                    // Extend the pillar from row above
                    heights[j] += 1;
                } else {
                    // Reset to 0 if current cell is 0
                    heights[j] = 0;
                }
            }

            // Step 2: Create a copy to sort (preserve original for next iteration)
            int[] sortedHeights = heights.clone();

            // Sort in descending order - this is key for column rearrangement
            // Arrays.sort() with Collections.reverseOrder() doesn't work for primitives
            // So we sort ascending then process in reverse
            Arrays.sort(sortedHeights);

            // Step 3: Calculate maximum area for current row
            // Process in reverse to get descending order effect
            for (int k = n - 1; k >= 0; k--) {
                // Height is sortedHeights[k], width is (n - k)
                // Because after sorting ascending, indices n-1, n-2, ... have largest values
                int height = sortedHeights[k];
                int width = n - k;
                int currentArea = height * width;
                maxArea = Math.max(maxArea, currentArea);
            }
        }

        return maxArea;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n log n)**

- We process each of the `m` rows
- For each row, we update `n` heights: O(n)
- For each row, we sort `n` heights: O(n log n)
- The sorting dominates, giving us O(m × n log n)

**Space Complexity: O(n)**

- We store the `heights` array of size `n`
- We create a copy `sortedHeights` of size `n` (can be avoided by sorting in-place if we don't need original order, but the copy makes logic clearer)
- Total: O(2n) = O(n)

## Common Mistakes

1. **Not resetting heights when encountering 0**: Forgetting to set `heights[j] = 0` when `matrix[i][j] == 0` breaks the "consecutive 1's" property. The pillar must be contiguous vertically.

2. **Sorting the original heights array**: If you sort `heights` in-place, you lose the correct heights for the next row iteration. Always create a copy before sorting.

3. **Calculating width incorrectly**: After sorting descending, the width for element at index `k` is `(k+1)`, not `k`. This is because we're using columns 0 through `k` (inclusive), which gives us `k+1` columns.

4. **Missing the row iteration**: Some candidates try to process the entire matrix at once, but the height accumulation must be done row-by-row since "consecutive 1's" is a vertical property.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Histogram/Largest Rectangle Area**: The height accumulation creates what's essentially a histogram at each row. Problems like [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) use a similar "height × width" calculation, though they typically use a stack for O(n) time.

2. **Dynamic "pillar" accumulation**: The idea of building up heights row-by-row appears in [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/), which also finds the largest rectangle of 1's but without column rearrangement.

3. **Sorting for grouping optimization**: The insight that sorting allows optimal grouping appears in problems like [Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts](https://leetcode.com/problems/maximum-area-of-a-piece-of-cake-after-horizontal-and-vertical-cuts/), where sorting cuts gives you the largest gaps.

## Key Takeaways

1. **Column rearrangement ≡ sorting heights**: When you can rearrange columns arbitrarily, you should sort column-based metrics (like heights of 1's) to group similar values together for maximum area/effect.

2. **Build histograms row-by-row**: For matrix problems involving contiguous vertical 1's, accumulate heights dynamically as you scan rows. Reset to 0 when you hit a 0.

3. **Area = min_height × width**: In sorted descending order, for position `k`, all elements 0..k have height ≥ `sorted[k]`, so using `sorted[k]` as height and `(k+1)` as width gives a valid rectangle area.

Related problems: [Max Area of Island](/problem/max-area-of-island)
