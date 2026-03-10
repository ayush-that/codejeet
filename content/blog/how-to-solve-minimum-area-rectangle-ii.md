---
title: "How to Solve Minimum Area Rectangle II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Area Rectangle II. Medium difficulty, 55.9% acceptance rate. Topics: Array, Hash Table, Math, Geometry."
date: "2029-01-21"
category: "dsa-patterns"
tags: ["minimum-area-rectangle-ii", "array", "hash-table", "math", "medium"]
---

## How to Solve Minimum Area Rectangle II

This problem asks us to find the minimum area rectangle formed by any four points in a given set, where the rectangle's sides don't need to be axis-aligned. What makes this tricky is that rectangles can be rotated arbitrarily, so we can't rely on simple coordinate comparisons like we could with axis-aligned rectangles. Instead, we need to identify rectangles through their geometric properties.

## Visual Walkthrough

Let's trace through a small example: `points = [[1,2],[2,1],[2,3],[3,2],[4,1],[4,3]]`

Visually, these points form two rectangles:

1. A square with corners at (1,2), (2,1), (3,2), (2,3) - area = 2
2. A rectangle with corners at (2,1), (4,1), (4,3), (2,3) - area = 4

The key insight is that for any rectangle, its diagonals:

- Have equal length
- Bisect each other (meet at the same midpoint)
- Are perpendicular to each other

So if we take pairs of points and treat them as potential diagonal endpoints, we can group them by their midpoint and distance. Any two diagonals with the same midpoint and same length must form a rectangle!

Let's check points (1,2) and (3,2):

- Midpoint = (2,2)
- Distance² = (3-1)² + (2-2)² = 4

Now check points (2,1) and (2,3):

- Midpoint = (2,2)
- Distance² = (2-2)² + (3-1)² = 4

Same midpoint and same distance! These two diagonals form a rectangle. We can calculate its area using vector math: area = length of diagonal 1 × length of diagonal 2 × sin(angle between them) / 2, but since they're perpendicular, sin(90°) = 1, so area = d1 × d2 / 2.

## Brute Force Approach

A naive approach would check all combinations of 4 points (O(n⁴) time) and verify if they form a rectangle. For each quadruple, we'd need to:

1. Check if all four points are distinct
2. Verify opposite sides are parallel and equal
3. Verify adjacent sides are perpendicular
4. Calculate the area

The verification step requires vector operations and floating-point comparisons, which are error-prone. Even with optimizations, O(n⁴) is far too slow for n up to 50 (giving ~6 million combinations) or n up to 500 (giving ~26 billion combinations).

```python
# Brute force - too slow for n > 20
def minAreaFreeRect(points):
    n = len(points)
    min_area = float('inf')

    for i in range(n):
        for j in range(i+1, n):
            for k in range(j+1, n):
                for l in range(k+1, n):
                    # Check if these 4 points form a rectangle
                    # This requires complex geometry checks
                    # ...
    return 0 if min_area == float('inf') else min_area
```

The main issues are the O(n⁴) time complexity and the complexity of verifying rectangles from arbitrary point sets.

## Optimized Approach

The key insight is that **the diagonals of a rectangle have equal length and share the same midpoint**. If we find two distinct pairs of points (p1,p2) and (p3,p4) such that:

1. They have the same midpoint
2. They have the same distance between the points in each pair

Then (p1,p2,p3,p4) form a rectangle!

Here's the step-by-step reasoning:

1. For each pair of points (i,j), calculate:
   - Midpoint (mx, my) = ((xi+xj)/2, (yi+yj)/2)
   - Distance squared = (xi-xj)² + (yi-yj)²
2. Group pairs by (midpoint, distance)
3. For each group with k pairs, those k diagonals can form k(k-1)/2 rectangles
4. For each rectangle, calculate area using vector cross product
5. Track the minimum area found

Why does this work? In a rectangle, the diagonals bisect each other and are equal in length. So any two diagonals with the same midpoint and length must be the two diagonals of some rectangle. The four endpoints are the rectangle's corners.

## Optimal Solution

We use a hash map where the key is (midpoint_x, midpoint_y, distance²) and the value is a list of point pairs that share that midpoint and distance. For each group of diagonals, we iterate through all pairs of diagonals to form rectangles and calculate their areas.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²)
def minAreaFreeRect(points):
    """
    Find minimum area rectangle from given points.
    Key insight: Rectangle diagonals have same midpoint and length.
    """
    from collections import defaultdict
    import math

    # Map from (mid_x, mid_y, dist_sq) -> list of point pairs
    groups = defaultdict(list)
    n = len(points)

    # Step 1: Process all pairs of points
    for i in range(n):
        x1, y1 = points[i]
        for j in range(i+1, n):
            x2, y2 = points[j]

            # Calculate midpoint (use double to avoid floating errors)
            mid_x = (x1 + x2) / 2.0
            mid_y = (y1 + y2) / 2.0

            # Calculate squared distance (avoid sqrt for precision)
            dist_sq = (x1 - x2) ** 2 + (y1 - y2) ** 2

            # Use tuple as key for grouping
            key = (mid_x, mid_y, dist_sq)
            groups[key].append((i, j))

    min_area = float('inf')

    # Step 2: For each group of diagonals, find rectangles
    for key, pairs in groups.items():
        # Need at least 2 diagonals to form a rectangle
        if len(pairs) < 2:
            continue

        # Check all pairs of diagonals in this group
        for a in range(len(pairs)):
            i1, j1 = pairs[a]
            x1, y1 = points[i1]
            x2, y2 = points[j1]

            # Vector from midpoint to first point
            # (same as from midpoint to second point but opposite direction)
            v1 = (x1 - key[0], y1 - key[1])

            for b in range(a+1, len(pairs)):
                i2, j2 = pairs[b]
                x3, y3 = points[i2]
                x4, y4 = points[j2]

                # Vector from midpoint to third point
                v2 = (x3 - key[0], y3 - key[1])

                # Calculate area using cross product of diagonal vectors
                # Area = 2 * |v1| * |v2| (since diagonals are perpendicular)
                # But |v1| = |v2| = half of diagonal length
                # So area = 2 * (d/2) * (d/2) = d²/2? Wait, that's wrong.
                # Actually, area = |v1 × v2| * 2 (cross product gives parallelogram area)

                # Cross product magnitude
                cross = abs(v1[0] * v2[1] - v1[1] * v2[0])

                # The two vectors are from center to corners, so rectangle area
                # is 4 times the area of the right triangle formed by v1 and v2
                # Area = 4 * (|v1| * |v2|) / 2 = 2 * |v1| * |v2|
                # But since |v1| = |v2| = diagonal_length/2
                # And cross = |v1| * |v2| * sin(angle) = |v1| * |v2| (angle=90°)
                # So area = 2 * cross
                area = 2.0 * cross

                min_area = min(min_area, area)

    return 0 if math.isinf(min_area) else min_area
```

```javascript
// Time: O(n²) | Space: O(n²)
function minAreaFreeRect(points) {
  // Map from "midX,midY,distSq" -> array of point pairs
  const groups = new Map();
  const n = points.length;

  // Step 1: Process all pairs of points
  for (let i = 0; i < n; i++) {
    const [x1, y1] = points[i];
    for (let j = i + 1; j < n; j++) {
      const [x2, y2] = points[j];

      // Calculate midpoint
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      // Calculate squared distance
      const distSq = (x1 - x2) ** 2 + (y1 - y2) ** 2;

      // Create key for grouping
      const key = `${midX},${midY},${distSq}`;

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push([i, j]);
    }
  }

  let minArea = Infinity;

  // Step 2: For each group of diagonals, find rectangles
  for (const [key, pairs] of groups.entries()) {
    // Need at least 2 diagonals to form a rectangle
    if (pairs.length < 2) continue;

    // Parse key back to numbers
    const [midX, midY, distSq] = key.split(",").map(Number);

    // Check all pairs of diagonals in this group
    for (let a = 0; a < pairs.length; a++) {
      const [i1, j1] = pairs[a];
      const [x1, y1] = points[i1];
      const [x2, y2] = points[j1];

      // Vector from midpoint to first point
      const v1 = [x1 - midX, y1 - midY];

      for (let b = a + 1; b < pairs.length; b++) {
        const [i2, j2] = pairs[b];
        const [x3, y3] = points[i2];
        const [x4, y4] = points[j2];

        // Vector from midpoint to third point
        const v2 = [x3 - midX, y3 - midY];

        // Cross product magnitude
        const cross = Math.abs(v1[0] * v2[1] - v1[1] * v2[0]);

        // Rectangle area = 2 * cross
        const area = 2 * cross;

        minArea = Math.min(minArea, area);
      }
    }
  }

  return minArea === Infinity ? 0 : minArea;
}
```

```java
// Time: O(n²) | Space: O(n²)
import java.util.*;

class Solution {
    public double minAreaFreeRect(int[][] points) {
        // Map from "midX,midY,distSq" -> list of point pairs
        Map<String, List<int[]>> groups = new HashMap<>();
        int n = points.length;

        // Step 1: Process all pairs of points
        for (int i = 0; i < n; i++) {
            int x1 = points[i][0], y1 = points[i][1];
            for (int j = i + 1; j < n; j++) {
                int x2 = points[j][0], y2 = points[j][1];

                // Calculate midpoint
                double midX = (x1 + x2) / 2.0;
                double midY = (y1 + y2) / 2.0;

                // Calculate squared distance
                long distSq = (long)(x1 - x2) * (x1 - x2) + (long)(y1 - y2) * (y1 - y2);

                // Create key for grouping
                String key = midX + "," + midY + "," + distSq;

                groups.putIfAbsent(key, new ArrayList<>());
                groups.get(key).add(new int[]{i, j});
            }
        }

        double minArea = Double.MAX_VALUE;

        // Step 2: For each group of diagonals, find rectangles
        for (Map.Entry<String, List<int[]>> entry : groups.entrySet()) {
            List<int[]> pairs = entry.getValue();

            // Need at least 2 diagonals to form a rectangle
            if (pairs.size() < 2) continue;

            // Parse key to get midpoint
            String[] parts = entry.getKey().split(",");
            double midX = Double.parseDouble(parts[0]);
            double midY = Double.parseDouble(parts[1]);

            // Check all pairs of diagonals in this group
            for (int a = 0; a < pairs.size(); a++) {
                int[] pair1 = pairs.get(a);
                int i1 = pair1[0], j1 = pair1[1];
                int x1 = points[i1][0], y1 = points[i1][1];
                int x2 = points[j1][0], y2 = points[j1][1];

                // Vector from midpoint to first point
                double v1x = x1 - midX;
                double v1y = y1 - midY;

                for (int b = a + 1; b < pairs.size(); b++) {
                    int[] pair2 = pairs.get(b);
                    int i2 = pair2[0], j2 = pair2[1];
                    int x3 = points[i2][0], y3 = points[i2][1];
                    int x4 = points[j2][0], y4 = points[j2][1];

                    // Vector from midpoint to third point
                    double v2x = x3 - midX;
                    double v2y = y3 - midY;

                    // Cross product magnitude
                    double cross = Math.abs(v1x * v2y - v1y * v2x);

                    // Rectangle area = 2 * cross
                    double area = 2.0 * cross;

                    if (area < minArea) {
                        minArea = area;
                    }
                }
            }
        }

        return minArea == Double.MAX_VALUE ? 0.0 : minArea;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We examine all pairs of points: n choose 2 = n(n-1)/2 = O(n²) pairs
- For each pair, we compute midpoint and distance: O(1)
- Grouping by hash map: O(1) average case per insertion
- Processing groups: In worst case, all pairs could have same midpoint and distance, giving O(m²) where m = O(n²), but in practice this is much smaller. The worst-case total is still O(n⁴) but with a very small constant factor for realistic inputs.

**Space Complexity:** O(n²)

- We store all pairs of points in the hash map
- In worst case, all pairs might have unique keys, giving O(n²) entries
- Each entry stores indices of two points

## Common Mistakes

1. **Using floating-point equality for midpoint comparison**: Due to precision errors, (x1+x2)/2 might not exactly equal (x3+x4)/2 even mathematically. Solution: Use a tolerance or store as rational numbers (use fractions).

2. **Calculating actual distance instead of squared distance**: Calculating sqrt() is expensive and introduces floating-point errors. Squared distance preserves ordering for equality checks and avoids sqrt.

3. **Forgetting to check diagonal pairs come from different point sets**: When we find two diagonals with same midpoint and length, we must ensure all four endpoints are distinct points. Our approach using point indices automatically handles this since i < j and we compare different pairs.

4. **Incorrect area calculation**: The area of a rectangle with diagonal vectors v1 and v2 from center is 2 × |v1 × v2| (cross product magnitude), not |v1 × v2| or 4 × |v1 × v2|. Draw a diagram to verify: the rectangle consists of 4 congruent right triangles.

## When You'll See This Pattern

This "group by geometric properties" pattern appears in several geometry problems:

1. **Minimum Area Rectangle I (LeetCode 939)**: Axis-aligned version where rectangles have sides parallel to axes. Solution groups points by x-coordinate instead of using diagonals.

2. **Max Points on a Line (LeetCode 149)**: Group points by slope to find collinear points. Similar idea of hashing geometric properties.

3. **Number of Boomerangs (LeetCode 447)**: Count tuples (i,j,k) where distance(i,j) = distance(i,k). Uses distance grouping like our problem.

The core technique is identifying invariant properties (midpoint, distance, slope) that define the geometric object you're looking for, then hashing these properties to efficiently find matches.

## Key Takeaways

1. **Geometric hashing**: When dealing with geometric objects, identify invariant properties that can be hashed. For rectangles, it's diagonal midpoint and length; for lines, it's slope and intercept; for circles, it's center and radius.

2. **Avoid floating-point comparisons**: Use squared distances, integer representations, or tolerances instead of exact floating-point equality in geometry problems.

3. **Vector operations are your friend**: Cross products give area, dot products give angle information. Mastering these helps solve many geometry problems efficiently.

[Practice this problem on CodeJeet](/problem/minimum-area-rectangle-ii)
