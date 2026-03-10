---
title: "How to Solve Separate Squares I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Separate Squares I. Medium difficulty, 58.0% acceptance rate. Topics: Array, Binary Search."
date: "2027-01-18"
category: "dsa-patterns"
tags: ["separate-squares-i", "array", "binary-search", "medium"]
---

# How to Solve Separate Squares I

You're given a list of axis-aligned squares and need to find the minimum y-coordinate for a horizontal line that separates the squares such that the total area above the line equals the total area below it. The challenge lies in efficiently searching through continuous coordinate space while calculating areas accurately for any candidate line position.

## Visual Walkthrough

Let's work through a concrete example to build intuition. Suppose we have three squares:

- Square A: [0, 0, 2] (bottom-left at (0,0), side length 2)
- Square B: [1, 3, 2] (bottom-left at (1,3), side length 2)
- Square C: [4, 1, 3] (bottom-left at (4,1), side length 3)

First, let's understand what we're calculating. For any candidate y-coordinate `y_line`:

- Area above = sum of areas of each square's portion above the line
- Area below = sum of areas of each square's portion below the line

Consider trying `y_line = 2`:

- Square A (y-range 0-2): Entirely below the line → 0 above, 4 below
- Square B (y-range 3-5): Entirely above the line → 4 above, 0 below
- Square C (y-range 1-4): Partially intersected → portion above = 2×3 = 6, portion below = 1×3 = 3
- Total above = 0 + 4 + 6 = 10
- Total below = 4 + 0 + 3 = 7

Since 10 > 7, the line is too low. We need to move it up to reduce the area above.

Now try `y_line = 3`:

- Square A: Entirely below → 0 above, 4 below
- Square B: Partially intersected → portion above = 2×1 = 2, portion below = 2×1 = 2
- Square C: Partially intersected → portion above = 1×3 = 3, portion below = 2×3 = 6
- Total above = 0 + 2 + 3 = 5
- Total below = 4 + 2 + 6 = 12

Now 5 < 12, so the line is too high. The optimal line lies between y=2 and y=3.

This demonstrates the key insight: the area difference function is **monotonic** — as we move the line up, area above decreases and area below increases. This monotonic property makes binary search possible.

## Brute Force Approach

A naive approach might try every possible y-coordinate with some small increment (like 0.001). For each candidate line:

1. Calculate area above by checking each square's intersection with the line
2. Calculate area below similarly
3. Check if the areas are equal (within some tolerance)

The problem with this approach is precision and efficiency. We don't know what increment to use — too large and we miss the exact solution, too small and we have millions of iterations. Even with a reasonable increment, checking O(n) squares for each candidate gives O(n × precision_factor) time, which is impractical.

More fundamentally, the areas change only at specific y-values: the bottom and top edges of each square. Between these critical points, the area functions are linear. This suggests we should focus on these critical y-values rather than scanning continuously.

## Optimized Approach

The key insight is that we can use **binary search** on the y-coordinate because the difference between area above and area below is a monotonic function. As we move the line upward:

- Area above decreases (or stays the same)
- Area below increases (or stays the same)
- Therefore, (area_above - area_below) decreases monotonically

We can find the exact y-coordinate where area_above = area_below by:

1. Identifying the search range: from minimum y (bottom of lowest square) to maximum y (top of highest square)
2. Using binary search to narrow down to the precise y-coordinate
3. At each candidate y, calculating total area above and below by summing contributions from all squares

The calculation for a single square at position `[x, y, l]` with candidate line at `y_line`:

- If `y_line <= y`: Entire square is above → area_above = l², area_below = 0
- If `y_line >= y + l`: Entire square is below → area_above = 0, area_below = l²
- Otherwise: Square is intersected → area_above = l × (y + l - y_line), area_below = l × (y_line - y)

We run binary search until we achieve sufficient precision (typically 1e-6 or similar for floating-point problems).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log(R/ε)) where n = number of squares, R = y-range, ε = precision
# Space: O(1)
def separate_squares(squares):
    """
    Find the minimum y-coordinate of a horizontal line that divides
    the total area of squares equally between above and below.
    """
    if not squares:
        return 0.0

    # Find the overall y-range containing all squares
    min_y = float('inf')
    max_y = float('-inf')
    for x, y, l in squares:
        min_y = min(min_y, y)           # Bottom of lowest square
        max_y = max(max_y, y + l)       # Top of highest square

    # Binary search for the optimal y-coordinate
    left, right = min_y, max_y
    precision = 1e-6

    while right - left > precision:
        mid = (left + right) / 2

        # Calculate total area above and below the candidate line
        area_above = 0.0
        area_below = 0.0

        for x, y, l in squares:
            square_area = l * l

            if mid <= y:
                # Entire square is above the line
                area_above += square_area
            elif mid >= y + l:
                # Entire square is below the line
                area_below += square_area
            else:
                # Line intersects the square
                height_above = y + l - mid
                height_below = mid - y
                area_above += l * height_above
                area_below += l * height_below

        # Adjust search range based on area comparison
        if area_above > area_below:
            # Too much area above, need to move line up
            left = mid
        else:
            # Too much area below (or equal), need to move line down
            right = mid

    # Return the minimum y-coordinate (left boundary)
    return left
```

```javascript
// Time: O(n log(R/ε)) where n = number of squares, R = y-range, ε = precision
// Space: O(1)
function separateSquares(squares) {
  /**
   * Find the minimum y-coordinate of a horizontal line that divides
   * the total area of squares equally between above and below.
   */
  if (!squares || squares.length === 0) {
    return 0.0;
  }

  // Find the overall y-range containing all squares
  let minY = Infinity;
  let maxY = -Infinity;

  for (const [x, y, l] of squares) {
    minY = Math.min(minY, y); // Bottom of lowest square
    maxY = Math.max(maxY, y + l); // Top of highest square
  }

  // Binary search for the optimal y-coordinate
  let left = minY;
  let right = maxY;
  const precision = 1e-6;

  while (right - left > precision) {
    const mid = (left + right) / 2;

    // Calculate total area above and below the candidate line
    let areaAbove = 0.0;
    let areaBelow = 0.0;

    for (const [x, y, l] of squares) {
      const squareArea = l * l;

      if (mid <= y) {
        // Entire square is above the line
        areaAbove += squareArea;
      } else if (mid >= y + l) {
        // Entire square is below the line
        areaBelow += squareArea;
      } else {
        // Line intersects the square
        const heightAbove = y + l - mid;
        const heightBelow = mid - y;
        areaAbove += l * heightAbove;
        areaBelow += l * heightBelow;
      }
    }

    // Adjust search range based on area comparison
    if (areaAbove > areaBelow) {
      // Too much area above, need to move line up
      left = mid;
    } else {
      // Too much area below (or equal), need to move line down
      right = mid;
    }
  }

  // Return the minimum y-coordinate (left boundary)
  return left;
}
```

```java
// Time: O(n log(R/ε)) where n = number of squares, R = y-range, ε = precision
// Space: O(1)
public double separateSquares(int[][] squares) {
    /**
     * Find the minimum y-coordinate of a horizontal line that divides
     * the total area of squares equally between above and below.
     */
    if (squares == null || squares.length == 0) {
        return 0.0;
    }

    // Find the overall y-range containing all squares
    double minY = Double.POSITIVE_INFINITY;
    double maxY = Double.NEGATIVE_INFINITY;

    for (int[] square : squares) {
        int x = square[0];
        int y = square[1];
        int l = square[2];

        minY = Math.min(minY, y);           // Bottom of lowest square
        maxY = Math.max(maxY, y + l);       // Top of highest square
    }

    // Binary search for the optimal y-coordinate
    double left = minY;
    double right = maxY;
    final double precision = 1e-6;

    while (right - left > precision) {
        double mid = (left + right) / 2;

        // Calculate total area above and below the candidate line
        double areaAbove = 0.0;
        double areaBelow = 0.0;

        for (int[] square : squares) {
            int x = square[0];
            int y = square[1];
            int l = square[2];
            double squareArea = l * l;

            if (mid <= y) {
                // Entire square is above the line
                areaAbove += squareArea;
            } else if (mid >= y + l) {
                // Entire square is below the line
                areaBelow += squareArea;
            } else {
                // Line intersects the square
                double heightAbove = y + l - mid;
                double heightBelow = mid - y;
                areaAbove += l * heightAbove;
                areaBelow += l * heightBelow;
            }
        }

        // Adjust search range based on area comparison
        if (areaAbove > areaBelow) {
            // Too much area above, need to move line up
            left = mid;
        } else {
            // Too much area below (or equal), need to move line down
            right = mid;
        }
    }

    // Return the minimum y-coordinate (left boundary)
    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log(R/ε))

- `n`: Number of squares. We process all squares in each binary search iteration.
- `R`: Range of y-coordinates (max_y - min_y). This determines the initial search space.
- `ε`: Precision requirement (1e-6 in our solution). Binary search reduces the interval by half each iteration, requiring log₂(R/ε) iterations.
- Each iteration processes all n squares, giving O(n log(R/ε)).

**Space Complexity:** O(1)

- We use only a constant amount of extra space for variables like min_y, max_y, area calculations, and binary search bounds.
- The input is not counted toward space complexity (standard in algorithm analysis).

## Common Mistakes

1. **Incorrect area calculation for intersected squares**: When the line cuts through a square, candidates sometimes calculate the intersected area incorrectly. Remember: for a square of side length `l` intersected at height `h` from the bottom, the area below is `l × h` and area above is `l × (l - h)`.

2. **Using integer division in binary search**: In languages like Java or C++, using integer division `(left + right) / 2` with integer bounds can cause infinite loops. Always use floating-point arithmetic for continuous search spaces.

3. **Insufficient precision handling**: Setting precision too loose (like 0.1) can return inaccurate results. Setting it too tight (like 1e-12) can cause unnecessary iterations. 1e-6 is typically sufficient for most problems.

4. **Forgetting edge cases**: Empty input, single square, or squares with zero area. Always check for these and handle them appropriately (return 0.0 or a reasonable default).

## When You'll See This Pattern

This problem combines **binary search on answer** with **geometric area calculation**. You'll encounter similar patterns in:

1. **LeetCode 410: Split Array Largest Sum** - Binary search on the maximum subarray sum, checking feasibility at each candidate value.
2. **LeetCode 1011: Capacity To Ship Packages Within D Days** - Binary search on shipping capacity, checking if packages can be shipped within D days.
3. **LeetCode 875: Koko Eating Bananas** - Binary search on eating speed, checking if Koko can finish all bananas in H hours.

The common thread: when you need to find a minimum/maximum value satisfying some condition, and you can efficiently check whether a candidate value works, binary search on the answer space is often the solution.

## Key Takeaways

1. **Binary search isn't just for sorted arrays**: When you have a monotonic property (as y increases, area_above decreases), you can binary search over a continuous range. This is called "binary search on answer" or "parametric search."

2. **Geometric problems often reduce to 1D**: Even though squares exist in 2D space, the horizontal line constraint reduces the problem to finding the right y-coordinate, making it effectively a 1D search problem.

3. **Precision matters in continuous search**: Always define a precision threshold and understand the trade-off between accuracy and performance. In interviews, 1e-6 is usually acceptable unless specified otherwise.

[Practice this problem on CodeJeet](/problem/separate-squares-i)
