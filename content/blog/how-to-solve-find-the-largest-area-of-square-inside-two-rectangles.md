---
title: "How to Solve Find the Largest Area of Square Inside Two Rectangles — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Largest Area of Square Inside Two Rectangles. Medium difficulty, 66.9% acceptance rate. Topics: Array, Math, Geometry."
date: "2027-06-20"
category: "dsa-patterns"
tags:
  ["find-the-largest-area-of-square-inside-two-rectangles", "array", "math", "geometry", "medium"]
---

# How to Solve "Find the Largest Area of Square Inside Two Rectangles"

This problem asks us to find the largest possible area of a square that can fit inside the overlapping region of any two rectangles from a given set. Each rectangle is axis-aligned (edges parallel to x and y axes), and we're given their bottom-left and top-right coordinates. The challenge lies in efficiently checking all possible pairs of rectangles and computing their intersection in a way that allows us to find the largest square that fits within that intersection.

What makes this problem interesting is that it combines geometric reasoning with algorithmic efficiency. You need to understand rectangle intersection properties while avoiding an O(n²) brute force that would be too slow for large inputs.

## Visual Walkthrough

Let's walk through a concrete example with 3 rectangles:

**Rectangle 1:** bottomLeft = [1,1], topRight = [4,4]
**Rectangle 2:** bottomLeft = [2,2], topRight = [5,5]  
**Rectangle 3:** bottomLeft = [3,0], topRight = [6,3]

We need to check all pairs of rectangles (1-2, 1-3, 2-3) and find the largest square that fits in their intersection.

**Pair 1-2 Intersection:**

- x-overlap: max(1,2) to min(4,5) → [2,4] → width = 2
- y-overlap: max(1,2) to min(4,5) → [2,4] → height = 2
- Square side length = min(2,2) = 2 → area = 4

**Pair 1-3 Intersection:**

- x-overlap: max(1,3) to min(4,6) → [3,4] → width = 1
- y-overlap: max(1,0) to min(4,3) → [1,3] → height = 2
- Square side length = min(1,2) = 1 → area = 1

**Pair 2-3 Intersection:**

- x-overlap: max(2,3) to min(5,6) → [3,5] → width = 2
- y-overlap: max(2,0) to min(5,3) → [2,3] → height = 1
- Square side length = min(2,1) = 1 → area = 1

The largest square area is 4 from the intersection of rectangles 1 and 2.

## Brute Force Approach

The most straightforward approach is to check every possible pair of rectangles (i, j) where i < j:

1. For each pair, compute their intersection rectangle
2. Calculate the maximum square side length that fits in the intersection (min(width, height))
3. Track the maximum square area across all pairs

The intersection of two rectangles [x1, y1, x2, y2] and [x3, y3, x4, y4] exists if:

- max(x1, x3) < min(x2, x4) (x-overlap exists)
- max(y1, y3) < min(y2, y4) (y-overlap exists)

If both conditions hold, the intersection rectangle is:

- x_left = max(x1, x3)
- x_right = min(x2, x4)
- y_bottom = max(y1, y3)
- y_top = min(y2, y4)

The brute force code would look like this:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def largestSquareArea(bottomLeft, topRight):
    n = len(bottomLeft)
    max_area = 0

    for i in range(n):
        x1, y1 = bottomLeft[i]
        x2, y2 = topRight[i]

        for j in range(i + 1, n):
            x3, y3 = bottomLeft[j]
            x4, y4 = topRight[j]

            # Find intersection
            x_left = max(x1, x3)
            x_right = min(x2, x4)
            y_bottom = max(y1, y3)
            y_top = min(y2, y4)

            # Check if intersection exists
            if x_left < x_right and y_bottom < y_top:
                width = x_right - x_left
                height = y_top - y_bottom
                side = min(width, height)
                max_area = max(max_area, side * side)

    return max_area
```

```javascript
// Time: O(n²) | Space: O(1)
function largestSquareArea(bottomLeft, topRight) {
  const n = bottomLeft.length;
  let maxArea = 0;

  for (let i = 0; i < n; i++) {
    const [x1, y1] = bottomLeft[i];
    const [x2, y2] = topRight[i];

    for (let j = i + 1; j < n; j++) {
      const [x3, y3] = bottomLeft[j];
      const [x4, y4] = topRight[j];

      // Find intersection
      const xLeft = Math.max(x1, x3);
      const xRight = Math.min(x2, x4);
      const yBottom = Math.max(y1, y3);
      const yTop = Math.min(y2, y4);

      // Check if intersection exists
      if (xLeft < xRight && yBottom < yTop) {
        const width = xRight - xLeft;
        const height = yTop - yBottom;
        const side = Math.min(width, height);
        maxArea = Math.max(maxArea, side * side);
      }
    }
  }

  return maxArea;
}
```

```java
// Time: O(n²) | Space: O(1)
public long largestSquareArea(int[][] bottomLeft, int[][] topRight) {
    int n = bottomLeft.length;
    long maxArea = 0;

    for (int i = 0; i < n; i++) {
        int x1 = bottomLeft[i][0];
        int y1 = bottomLeft[i][1];
        int x2 = topRight[i][0];
        int y2 = topRight[i][1];

        for (int j = i + 1; j < n; j++) {
            int x3 = bottomLeft[j][0];
            int y3 = bottomLeft[j][1];
            int x4 = topRight[j][0];
            int y4 = topRight[j][1];

            // Find intersection
            int xLeft = Math.max(x1, x3);
            int xRight = Math.min(x2, x4);
            int yBottom = Math.max(y1, y3);
            int yTop = Math.min(y2, y4);

            // Check if intersection exists
            if (xLeft < xRight && yBottom < yTop) {
                int width = xRight - xLeft;
                int height = yTop - yBottom;
                int side = Math.min(width, height);
                maxArea = Math.max(maxArea, (long) side * side);
            }
        }
    }

    return maxArea;
}
```

</div>

**Why this is insufficient:** With n up to 1000 (as typical in LeetCode constraints), O(n²) means checking up to 500,000 pairs. While this might pass for smaller constraints, it's inefficient and won't scale well. However, for this specific problem, there's no obvious way to avoid checking all pairs since any two rectangles could produce the largest square. The O(n²) solution is actually the optimal approach given the problem constraints and nature.

## Optimized Approach

Given that we need to check all pairs of rectangles, the O(n²) approach is actually optimal for this problem. The key insight is that we cannot avoid checking all pairs because:

1. Any two rectangles might have the largest square in their intersection
2. There's no inherent ordering or structure that lets us eliminate pairs early
3. The intersection computation for each pair is O(1), so the overall O(n²) is acceptable for n ≤ 1000

The optimization comes from writing clean, efficient code and handling edge cases properly rather than from algorithmic improvements.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n²) where n is number of rectangles
# Space: O(1) - only using constant extra space
def largestSquareArea(bottomLeft, topRight):
    """
    Find the largest square area that can fit inside the intersection
    of any two rectangles.

    Args:
        bottomLeft: List of [x, y] coordinates for bottom-left corners
        topRight: List of [x, y] coordinates for top-right corners

    Returns:
        Largest possible square area (0 if no two rectangles intersect)
    """
    n = len(bottomLeft)
    max_area = 0  # Track the maximum square area found

    # Check all unique pairs of rectangles (i, j) where i < j
    for i in range(n):
        # Extract coordinates for rectangle i
        x1, y1 = bottomLeft[i]
        x2, y2 = topRight[i]

        for j in range(i + 1, n):
            # Extract coordinates for rectangle j
            x3, y3 = bottomLeft[j]
            x4, y4 = topRight[j]

            # Find the overlapping region in x-direction
            # The left edge is the maximum of the two left edges
            # The right edge is the minimum of the two right edges
            x_left = max(x1, x3)
            x_right = min(x2, x4)

            # Find the overlapping region in y-direction
            # The bottom edge is the maximum of the two bottom edges
            # The top edge is the minimum of the two top edges
            y_bottom = max(y1, y3)
            y_top = min(y2, y4)

            # Check if rectangles actually overlap
            # They overlap if x_left < x_right AND y_bottom < y_top
            # Using < instead of <= because if edges just touch, area is 0
            if x_left < x_right and y_bottom < y_top:
                # Calculate dimensions of overlapping rectangle
                width = x_right - x_left
                height = y_top - y_bottom

                # The largest square that fits has side = min(width, height)
                side = min(width, height)

                # Update max_area if we found a larger square
                max_area = max(max_area, side * side)

    return max_area
```

```javascript
// Time: O(n²) where n is number of rectangles
// Space: O(1) - only using constant extra space
function largestSquareArea(bottomLeft, topRight) {
  /**
   * Find the largest square area that can fit inside the intersection
   * of any two rectangles.
   *
   * @param {number[][]} bottomLeft - Array of [x, y] for bottom-left corners
   * @param {number[][]} topRight - Array of [x, y] for top-right corners
   * @return {number} Largest possible square area (0 if no intersections)
   */
  const n = bottomLeft.length;
  let maxArea = 0; // Track the maximum square area found

  // Check all unique pairs of rectangles (i, j) where i < j
  for (let i = 0; i < n; i++) {
    // Extract coordinates for rectangle i
    const [x1, y1] = bottomLeft[i];
    const [x2, y2] = topRight[i];

    for (let j = i + 1; j < n; j++) {
      // Extract coordinates for rectangle j
      const [x3, y3] = bottomLeft[j];
      const [x4, y4] = topRight[j];

      // Find the overlapping region in x-direction
      // The left edge is the maximum of the two left edges
      // The right edge is the minimum of the two right edges
      const xLeft = Math.max(x1, x3);
      const xRight = Math.min(x2, x4);

      // Find the overlapping region in y-direction
      // The bottom edge is the maximum of the two bottom edges
      // The top edge is the minimum of the two top edges
      const yBottom = Math.max(y1, y3);
      const yTop = Math.min(y2, y4);

      // Check if rectangles actually overlap
      // They overlap if xLeft < xRight AND yBottom < yTop
      // Using < instead of <= because if edges just touch, area is 0
      if (xLeft < xRight && yBottom < yTop) {
        // Calculate dimensions of overlapping rectangle
        const width = xRight - xLeft;
        const height = yTop - yBottom;

        // The largest square that fits has side = min(width, height)
        const side = Math.min(width, height);

        // Update maxArea if we found a larger square
        maxArea = Math.max(maxArea, side * side);
      }
    }
  }

  return maxArea;
}
```

```java
// Time: O(n²) where n is number of rectangles
// Space: O(1) - only using constant extra space
public long largestSquareArea(int[][] bottomLeft, int[][] topRight) {
    /**
     * Find the largest square area that can fit inside the intersection
     * of any two rectangles.
     *
     * @param bottomLeft - Array of [x, y] for bottom-left corners
     * @param topRight - Array of [x, y] for top-right corners
     * @return Largest possible square area (0 if no intersections)
     */
    int n = bottomLeft.length;
    long maxArea = 0;  // Use long to prevent integer overflow

    // Check all unique pairs of rectangles (i, j) where i < j
    for (int i = 0; i < n; i++) {
        // Extract coordinates for rectangle i
        int x1 = bottomLeft[i][0];
        int y1 = bottomLeft[i][1];
        int x2 = topRight[i][0];
        int y2 = topRight[i][1];

        for (int j = i + 1; j < n; j++) {
            // Extract coordinates for rectangle j
            int x3 = bottomLeft[j][0];
            int y3 = bottomLeft[j][1];
            int x4 = topRight[j][0];
            int y4 = topRight[j][1];

            // Find the overlapping region in x-direction
            // The left edge is the maximum of the two left edges
            // The right edge is the minimum of the two right edges
            int xLeft = Math.max(x1, x3);
            int xRight = Math.min(x2, x4);

            // Find the overlapping region in y-direction
            // The bottom edge is the maximum of the two bottom edges
            // The top edge is the minimum of the two top edges
            int yBottom = Math.max(y1, y3);
            int yTop = Math.min(y2, y4);

            // Check if rectangles actually overlap
            // They overlap if xLeft < xRight AND yBottom < yTop
            // Using < instead of <= because if edges just touch, area is 0
            if (xLeft < xRight && yBottom < yTop) {
                // Calculate dimensions of overlapping rectangle
                int width = xRight - xLeft;
                int height = yTop - yBottom;

                // The largest square that fits has side = min(width, height)
                int side = Math.min(width, height);

                // Update maxArea if we found a larger square
                // Cast to long to prevent integer overflow
                maxArea = Math.max(maxArea, (long) side * side);
            }
        }
    }

    return maxArea;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) where n is the number of rectangles. We need to check all unique pairs of rectangles, which is n\*(n-1)/2 pairs. For each pair, we perform O(1) operations to compute the intersection and square area.

**Space Complexity:** O(1) auxiliary space. We only use a few variables to track coordinates and the maximum area. The input storage is not counted toward space complexity.

## Common Mistakes

1. **Incorrect overlap condition:** Using `<=` instead of `<` when checking if rectangles overlap. If rectangles only touch at edges (x_left == x_right or y_bottom == y_top), the intersection area is 0, so we should return 0 for that pair.

2. **Forgetting to check both dimensions:** Some candidates check only if x_left < x_right but forget to check y_bottom < y_top. Both conditions must be true for rectangles to have a non-zero intersection.

3. **Integer overflow:** When n is large and coordinates are large, multiplying side \* side could overflow 32-bit integers. Always use 64-bit integers (long in Java, no issue in Python).

4. **Checking i ≤ j instead of i < j:** This would compare each rectangle with itself, which is unnecessary since a single rectangle doesn't help us find an intersection between two different rectangles.

5. **Confusing bottomLeft with topRight coordinates:** Make sure you're consistent about which coordinate is x and which is y, and that you're comparing bottom-left with bottom-left and top-right with top-right.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Pairwise comparisons with geometric constraints:** Similar to problems where you need to compare all pairs of geometric objects:
   - [Rectangle Area](https://leetcode.com/problems/rectangle-area/) - Computes total area covered by two rectangles
   - [Rectangle Overlap](https://leetcode.com/problems/rectangle-overlap/) - Determines if two rectangles overlap
   - [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line/) - Checks all pairs of points to find lines

2. **Finding maximum/minimum across all pairs:** The pattern of checking all pairs (i, j) where i < j appears in many problems:
   - [Maximum Product of Two Elements in an Array](https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/)
   - [Count Number of Pairs With Absolute Difference K](https://leetcode.com/problems/count-number-of-pairs-with-absolute-difference-k/)

## Key Takeaways

1. **Rectangle intersection formula is fundamental:** For axis-aligned rectangles [x1, y1, x2, y2] and [x3, y3, x4, y4], the intersection exists if `max(x1, x3) < min(x2, x4)` and `max(y1, y3) < min(y2, y4)`. The intersection rectangle is `[max(x1, x3), max(y1, y3), min(x2, x4), min(y2, y4)]`.

2. **Sometimes O(n²) is optimal:** When you need to check relationships between all pairs of elements and there's no way to eliminate pairs, O(n²) might be the best you can do. The key is ensuring the operations inside the loop are O(1).

3. **Geometric problems often reduce to coordinate comparisons:** Many 2D geometry problems with axis-aligned shapes boil down to comparing x and y coordinates separately. Think in terms of 1D intervals first, then combine the results.

Related problems: [Rectangle Area](/problem/rectangle-area)
