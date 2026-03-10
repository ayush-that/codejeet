---
title: "How to Solve Find the Grid of Region Average — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Grid of Region Average. Medium difficulty, 43.3% acceptance rate. Topics: Array, Matrix."
date: "2026-04-13"
category: "dsa-patterns"
tags: ["find-the-grid-of-region-average", "array", "matrix", "medium"]
---

# How to Solve Find the Grid of Region Average

This problem asks us to process a grayscale image grid and identify "regions" where all adjacent pixel differences within a 3×3 subgrid are within a given threshold. For each valid region, we calculate the average intensity of its 9 pixels and place that average in the center cell of the output grid. The tricky part is that regions can overlap, and we need to efficiently check all 9 adjacent pairs within each 3×3 window while handling edge cases properly.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider this 4×4 grid with threshold = 2:

```
Input grid:
[1, 2, 3, 4]
[2, 3, 4, 5]
[3, 4, 5, 6]
[4, 5, 6, 7]
```

We need to check every possible 3×3 region. For the top-left region (rows 0-2, cols 0-2):

```
[1, 2, 3]
[2, 3, 4]
[3, 4, 5]
```

We must check all adjacent pairs (sharing an edge). Let's check a few:

- |1-2| = 1 ≤ 2 ✓
- |1-2| = 1 ≤ 2 ✓ (vertical)
- |2-3| = 1 ≤ 2 ✓
- |3-4| = 1 ≤ 2 ✓
- |4-5| = 1 ≤ 2 ✓

All differences are within threshold=2, so this is a valid region. The average is (1+2+3+2+3+4+3+4+5)/9 = 27/9 = 3. This average goes in position (1,1) of the output grid (center of the 3×3 region).

Now consider the region at rows 0-2, cols 1-3:

```
[2, 3, 4]
[3, 4, 5]
[4, 5, 6]
```

Check |4-6| = 2 ≤ 2 ✓, but wait - we need to check ALL adjacent pairs. The pair (4,6) is diagonal, not adjacent! Adjacent means sharing an edge, so we only check up/down/left/right neighbors. All adjacent differences here are ≤2, so this region is also valid. Average = (2+3+4+3+4+5+4+5+6)/9 = 36/9 = 4.

The output grid will have the same dimensions as input, with invalid region centers set to -1.

## Brute Force Approach

A naive approach would be to:

1. Iterate through all possible 3×3 regions (for center positions (1,1) to (m-2, n-2))
2. For each region, check all 12 adjacent pairs (each cell checks right and down neighbors to avoid double counting)
3. If all differences ≤ threshold, calculate the average of all 9 pixels
4. Place the average in the output grid at the center position

The brute force has O(m × n × 9) time complexity for checking differences (since each region has 9 cells, each checking 2 directions = 18 checks, but we can optimize to 12). The real issue is we're repeatedly accessing the same pixels and performing redundant calculations.

However, in this specific problem, the brute force is actually acceptable because m and n are constrained (up to 500×500) and 3×3 is constant size. The brute force would be O(m×n) with a constant factor. But let's think about what makes a candidate struggle: the adjacency checking logic is error-prone, and the indexing for 3×3 regions requires careful bounds handling.

## Optimized Approach

The key insight is that we need to efficiently check all adjacent pairs within each 3×3 region. Since the region size is fixed at 3×3, we can:

1. Predefine the 12 adjacent pairs we need to check (each cell's right and down neighbors within the 3×3 grid)
2. For each possible center position (i,j), check if ALL these 12 differences are ≤ threshold
3. Only if all checks pass, calculate the average of the 9 pixels

We can optimize further by:

- Calculating region sums using a sliding window approach (like prefix sums)
- But for 3×3 regions, the benefit is minimal since 9 is constant
- The main challenge is the adjacency checking logic

A clean approach is to define two arrays for the 4 directions we need to check (right and down), then verify all these differences within each 3×3 window.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m * n) for the output grid
def resultGrid(self, image, threshold):
    """
    Returns a grid where each cell contains the average of valid 3x3 regions
    that have the cell as their center, or -1 if no valid region covers it.
    """
    m, n = len(image), len(image[0])
    result = [[-1] * n for _ in range(m)]

    # For each possible center of a 3x3 region
    # Center can be from (1,1) to (m-2, n-2) inclusive
    for i in range(1, m - 1):
        for j in range(1, n - 1):
            valid = True

            # Check all adjacent pairs in the 3x3 region centered at (i,j)
            # We need to check 12 adjacent pairs (each cell checks right and down)
            # The region rows are i-1 to i+1, cols j-1 to j+1
            for x in range(i - 1, i + 2):
                for y in range(j - 1, j + 2):
                    # Check right neighbor (if within region)
                    if y + 1 <= j + 1:
                        if abs(image[x][y] - image[x][y + 1]) > threshold:
                            valid = False
                            break
                    # Check down neighbor (if within region)
                    if x + 1 <= i + 1:
                        if abs(image[x][y] - image[x + 1][y]) > threshold:
                            valid = False
                            break
                if not valid:
                    break

            if valid:
                # Calculate sum of the 3x3 region
                region_sum = 0
                for x in range(i - 1, i + 2):
                    for y in range(j - 1, j + 2):
                        region_sum += image[x][y]

                avg = region_sum // 9

                # Update the center cell in result
                if result[i][j] == -1:
                    result[i][j] = avg
                else:
                    # If multiple regions contribute to same center, average them
                    # But actually, each center can only be in one region's center
                    # Wait - that's not true! Overlapping regions can share centers
                    # Actually re-reading: "the average of all the pixels in the region"
                    # Each region's average goes to its own center
                    # Centers don't get averaged with other regions
                    # So we just assign
                    result[i][j] = avg

    return result
```

```javascript
// Time: O(m * n) | Space: O(m * n) for the output grid
var resultGrid = function (image, threshold) {
  const m = image.length,
    n = image[0].length;
  const result = Array.from({ length: m }, () => Array(n).fill(-1));

  // Iterate through all possible centers of 3x3 regions
  for (let i = 1; i < m - 1; i++) {
    for (let j = 1; j < n - 1; j++) {
      let valid = true;

      // Check all adjacent pairs in the 3x3 region
      for (let x = i - 1; x <= i + 1; x++) {
        for (let y = j - 1; y <= j + 1; y++) {
          // Check right neighbor if within region bounds
          if (y + 1 <= j + 1) {
            if (Math.abs(image[x][y] - image[x][y + 1]) > threshold) {
              valid = false;
              break;
            }
          }
          // Check down neighbor if within region bounds
          if (x + 1 <= i + 1) {
            if (Math.abs(image[x][y] - image[x + 1][y]) > threshold) {
              valid = false;
              break;
            }
          }
        }
        if (!valid) break;
      }

      if (valid) {
        // Calculate sum of all pixels in the 3x3 region
        let sum = 0;
        for (let x = i - 1; x <= i + 1; x++) {
          for (let y = j - 1; y <= j + 1; y++) {
            sum += image[x][y];
          }
        }

        const avg = Math.floor(sum / 9);
        result[i][j] = avg;
      }
    }
  }

  return result;
};
```

```java
// Time: O(m * n) | Space: O(m * n) for the output grid
class Solution {
    public int[][] resultGrid(int[][] image, int threshold) {
        int m = image.length, n = image[0].length;
        int[][] result = new int[m][n];

        // Initialize result with -1
        for (int i = 0; i < m; i++) {
            Arrays.fill(result[i], -1);
        }

        // Check each possible center for a 3x3 region
        for (int i = 1; i < m - 1; i++) {
            for (int j = 1; j < n - 1; j++) {
                boolean valid = true;

                // Verify all adjacent pairs in the 3x3 region
                for (int x = i - 1; x <= i + 1 && valid; x++) {
                    for (int y = j - 1; y <= j + 1 && valid; y++) {
                        // Check right neighbor (east)
                        if (y + 1 <= j + 1) {
                            if (Math.abs(image[x][y] - image[x][y + 1]) > threshold) {
                                valid = false;
                                break;
                            }
                        }
                        // Check down neighbor (south)
                        if (x + 1 <= i + 1) {
                            if (Math.abs(image[x][y] - image[x + 1][y]) > threshold) {
                                valid = false;
                                break;
                            }
                        }
                    }
                }

                if (valid) {
                    // Calculate average of the valid region
                    int sum = 0;
                    for (int x = i - 1; x <= i + 1; x++) {
                        for (int y = j - 1; y <= j + 1; y++) {
                            sum += image[x][y];
                        }
                    }
                    int avg = sum / 9;
                    result[i][j] = avg;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We iterate through all possible center positions: (m-2) × (n-2) positions
- For each position, we check up to 12 adjacent pairs (constant time)
- For valid regions, we sum 9 pixels (constant time)
- Overall: O(m × n) with a constant factor

**Space Complexity:** O(m × n)

- We create an output grid of size m × n
- We use only a few extra variables (O(1) additional space)
- Total: O(m × n) for the output

## Common Mistakes

1. **Incorrect adjacency checking:** Checking diagonal pairs or missing some adjacent pairs. Remember: adjacent = sharing an edge, not corner. Each cell should check right and down neighbors only (to avoid double counting).

2. **Off-by-one errors in bounds:** The center of a 3×3 region must have at least 1 row above/below and 1 column left/right. So centers range from (1,1) to (m-2,n-2), not (0,0) to (m-1,n-1).

3. **Integer division vs float average:** The problem states pixel intensities are integers and the average should be the floor of the sum/9. Using float division and then converting can cause precision issues or incorrect rounding.

4. **Not initializing output with -1:** The problem requires -1 for cells not covered by any valid region. Forgetting to initialize or incorrectly handling overlapping regions (though centers don't actually overlap in this problem's definition).

## When You'll See This Pattern

This problem combines several patterns common in matrix problems:

1. **Sliding window over 2D grid:** Similar to "Range Sum Query 2D - Immutable" where you calculate sums of submatrices efficiently using prefix sums. Here the window is fixed at 3×3.

2. **Neighbor checking in grids:** Like "Island Perimeter" or "Flood Fill" where you check adjacent cells, but here with a threshold condition.

3. **Fixed-size region processing:** Similar to "K Radius Subarray Averages" but extended to 2D, where you process fixed-radius neighborhoods around each point.

Specific related problems:

- **Range Sum Query 2D - Immutable**: Uses prefix sums to efficiently calculate submatrix sums
- **K Radius Subarray Averages**: 1D version of processing fixed-radius neighborhoods
- **Image Smoother**: Applies a 3×3 averaging filter to an image (simpler version without threshold)

## Key Takeaways

1. **Fixed-size window problems** in 2D often involve careful bounds checking. Remember that an h×w window centered at (i,j) requires i ≥ h/2 and j ≥ w/2 distance from edges.

2. **Adjacency in grids** has specific definitions: 4-directional (up, down, left, right) vs 8-directional (includes diagonals). Always clarify which is meant.

3. **Threshold-based region growing** is a common image processing technique. The efficient solution often involves checking conditions as you build regions rather than checking everything repeatedly.

Related problems: [Range Sum Query 2D - Immutable](/problem/range-sum-query-2d-immutable), [K Radius Subarray Averages](/problem/k-radius-subarray-averages)
