---
title: "How to Solve Maximum Number of Darts Inside of a Circular Dartboard — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Darts Inside of a Circular Dartboard. Hard difficulty, 40.4% acceptance rate. Topics: Array, Math, Geometry."
date: "2026-06-26"
category: "dsa-patterns"
tags:
  ["maximum-number-of-darts-inside-of-a-circular-dartboard", "array", "math", "geometry", "hard"]
---

# How to Solve Maximum Number of Darts Inside of a Circular Dartboard

You're given the positions of `n` darts on a wall and need to find the maximum number of darts that can be enclosed by a circular dartboard of fixed radius `r`. The challenge is that the dartboard can be placed anywhere, not just at dart positions. This is a classic computational geometry problem that tests your ability to think about spatial relationships and optimize search strategies.

What makes this problem tricky is that there are infinitely many possible positions for the dartboard center. A naive approach would try all possible centers, but that's impossible. The key insight is that for any optimal solution, you can adjust the dartboard so it touches at least two darts on its boundary, which dramatically reduces the search space.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have darts at positions: `[[1,1], [2,2], [3,3], [4,4]]` and radius `r = 1.5`.

1. **Initial observation**: We need to find a circle of radius 1.5 that contains as many points as possible.
2. **Key insight**: If we have a circle containing some points, we can "slide" it until it touches at least one point on its boundary. Then we can "rotate" it around that point until it touches a second point. This means any optimal circle can be defined by two points on its circumference.
3. **Applying to our example**:
   - Consider points (1,1) and (3,3). The distance between them is √8 ≈ 2.83.
   - Since 2.83 > 2×1.5 = 3.0, these points are too far apart to both lie on the circumference of a circle with radius 1.5.
   - Consider points (2,2) and (3,3). Distance is √2 ≈ 1.41, which is less than 3.0, so we can find circles with these points on the boundary.
4. **Finding circle centers**: For two points on a circle's circumference, there are typically two possible circle centers (one on each side of the line connecting them). We calculate both and check how many points are within radius `r` of each center.
5. **Edge case**: What if the optimal circle touches only one point? We must also check circles centered at each dart position.

## Brute Force Approach

A naive approach might try to discretize the search space by checking a grid of possible centers. However:

- The wall is "very large" (potentially infinite), so we can't check all positions
- Even if we discretize, the resolution needed for accuracy would make this approach computationally infeasible
- The time complexity would be O(n × grid_points), which is impractical

A slightly better but still insufficient brute force would be to check all circles defined by:

1. Centers at each dart position (touching one dart)
2. Centers defined by every pair of darts (touching two darts)

Even this approach has O(n³) complexity: O(n²) center candidates, and for each we check O(n) darts to count how many are inside. For n up to 100, this is 1,000,000 operations, which might be acceptable but isn't optimal.

## Optimized Approach

The key optimization comes from realizing that we don't need to check all O(n²) pairs of points. Here's the step-by-step reasoning:

1. **Reducing the search space**: Any optimal circle will have at least one dart on its boundary (otherwise we could move it to include more darts). Actually, we can prove that for the maximum coverage, we can adjust the circle so it has at least TWO darts on its boundary (unless all darts fit in a circle of radius r, in which case any circle containing them works).

2. **Center calculation**: Given two points A and B that lie on the circumference of a circle with radius r, we can find the circle's center(s) using geometry:
   - Calculate the midpoint M of AB
   - Calculate the distance d from M to the center
   - The centers lie on the perpendicular bisector of AB at distance d from M
   - There are typically two possible centers (except when AB is exactly 2r apart, then there's one)

3. **Algorithm outline**:
   - For each dart, consider circles centered at that dart (touching one dart)
   - For each pair of darts (i, j) where distance ≤ 2r, calculate the two possible circle centers
   - For each candidate center, count how many darts are within distance r
   - Return the maximum count found

4. **Optimization**: We can use angular sweeping to count points more efficiently for each candidate center, but for n ≤ 100, the O(n³) approach is acceptable.

## Optimal Solution

The optimal solution generates candidate centers from:

1. Each dart position (in case the optimal circle touches only one dart)
2. Each pair of darts that are close enough to both lie on the circumference

For each candidate center, we count how many darts are within radius r using Euclidean distance.

<div class="code-group">

```python
# Time: O(n^3) | Space: O(1)
# For n ≤ 100, O(n^3) = 1,000,000 operations is acceptable
def numPoints(darts, r):
    """
    Find maximum number of darts that can be enclosed by a circle of radius r.

    Args:
        darts: List of [x, y] coordinates
        r: Radius of the dartboard

    Returns:
        Maximum number of darts that can be enclosed
    """
    n = len(darts)
    if n <= 1:
        return n

    max_count = 1  # At least one dart can be enclosed

    # Helper function to calculate distance squared
    def dist_sq(p1, p2):
        dx = p1[0] - p2[0]
        dy = p1[1] - p2[1]
        return dx*dx + dy*dy

    # Helper function to count darts within radius r of center
    def count_darts(center):
        count = 0
        r_sq = r * r
        for dart in darts:
            if dist_sq(center, dart) <= r_sq + 1e-6:  # Add small epsilon for floating point
                count += 1
        return count

    # Check circles centered at each dart (touching one dart)
    for i in range(n):
        max_count = max(max_count, count_darts(darts[i]))

    # Check circles defined by pairs of darts (touching two darts)
    for i in range(n):
        for j in range(i + 1, n):
            x1, y1 = darts[i]
            x2, y2 = darts[j]

            # Calculate squared distance between points
            dx, dy = x2 - x1, y2 - y1
            d_sq = dx*dx + dy*dy
            d = d_sq ** 0.5

            # If points are too far apart, they can't both be on circumference
            if d > 2 * r + 1e-6:
                continue

            # Find the midpoint
            mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2

            # Distance from midpoint to center
            # Using Pythagorean theorem: (d/2)^2 + h^2 = r^2
            h_sq = r*r - d_sq/4
            if h_sq < -1e-6:  # Points too far apart (considering floating point error)
                continue

            h = max(0.0, h_sq) ** 0.5

            # Calculate perpendicular direction
            # For vector (dx, dy), perpendicular is (-dy, dx) or (dy, -dx)
            # Normalize the perpendicular vector
            if abs(d) > 1e-6:
                perp_x = -dy / d
                perp_y = dx / d

                # Two possible centers
                center1 = (mid_x + h * perp_x, mid_y + h * perp_y)
                center2 = (mid_x - h * perp_x, mid_y - h * perp_y)

                # Count darts for both centers
                max_count = max(max_count, count_darts(center1), count_darts(center2))

    return max_count
```

```javascript
// Time: O(n^3) | Space: O(1)
/**
 * Find maximum number of darts that can be enclosed by a circle of radius r.
 * @param {number[][]} darts - Array of [x, y] coordinates
 * @param {number} r - Radius of the dartboard
 * @return {number} Maximum number of darts that can be enclosed
 */
function numPoints(darts, r) {
  const n = darts.length;
  if (n <= 1) return n;

  let maxCount = 1; // At least one dart can be enclosed

  // Helper function to calculate squared distance
  const distSq = (p1, p2) => {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    return dx * dx + dy * dy;
  };

  // Helper function to count darts within radius r of center
  const countDarts = (center) => {
    let count = 0;
    const rSq = r * r;
    const epsilon = 1e-6;

    for (const dart of darts) {
      if (distSq(center, dart) <= rSq + epsilon) {
        count++;
      }
    }
    return count;
  };

  // Check circles centered at each dart (touching one dart)
  for (let i = 0; i < n; i++) {
    maxCount = Math.max(maxCount, countDarts(darts[i]));
  }

  // Check circles defined by pairs of darts (touching two darts)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [x1, y1] = darts[i];
      const [x2, y2] = darts[j];

      // Calculate squared distance between points
      const dx = x2 - x1,
        dy = y2 - y1;
      const dSq = dx * dx + dy * dy;
      const d = Math.sqrt(dSq);

      // If points are too far apart, they can't both be on circumference
      if (d > 2 * r + 1e-6) continue;

      // Find the midpoint
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      // Distance from midpoint to center
      // Using Pythagorean theorem: (d/2)^2 + h^2 = r^2
      let hSq = r * r - dSq / 4;
      if (hSq < -1e-6) continue; // Points too far apart

      hSq = Math.max(0, hSq);
      const h = Math.sqrt(hSq);

      // Calculate perpendicular direction
      // For vector (dx, dy), perpendicular is (-dy, dx) or (dy, -dx)
      if (Math.abs(d) > 1e-6) {
        const perpX = -dy / d;
        const perpY = dx / d;

        // Two possible centers
        const center1 = [midX + h * perpX, midY + h * perpY];
        const center2 = [midX - h * perpX, midY - h * perpY];

        // Count darts for both centers
        maxCount = Math.max(maxCount, countDarts(center1), countDarts(center2));
      }
    }
  }

  return maxCount;
}
```

```java
// Time: O(n^3) | Space: O(1)
import java.util.*;

class Solution {
    /**
     * Find maximum number of darts that can be enclosed by a circle of radius r.
     * @param darts Array of [x, y] coordinates
     * @param r Radius of the dartboard
     * @return Maximum number of darts that can be enclosed
     */
    public int numPoints(int[][] darts, int r) {
        int n = darts.length;
        if (n <= 1) return n;

        int maxCount = 1;  // At least one dart can be enclosed
        double radius = (double) r;

        // Check circles centered at each dart (touching one dart)
        for (int i = 0; i < n; i++) {
            maxCount = Math.max(maxCount, countDarts(darts, darts[i][0], darts[i][1], radius));
        }

        // Check circles defined by pairs of darts (touching two darts)
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int x1 = darts[i][0], y1 = darts[i][1];
                int x2 = darts[j][0], y2 = darts[j][1];

                // Calculate squared distance between points
                double dx = x2 - x1, dy = y2 - y1;
                double dSq = dx * dx + dy * dy;
                double d = Math.sqrt(dSq);

                // If points are too far apart, they can't both be on circumference
                if (d > 2 * radius + 1e-6) continue;

                // Find the midpoint
                double midX = (x1 + x2) / 2.0;
                double midY = (y1 + y2) / 2.0;

                // Distance from midpoint to center
                // Using Pythagorean theorem: (d/2)^2 + h^2 = r^2
                double hSq = radius * radius - dSq / 4.0;
                if (hSq < -1e-6) continue;  // Points too far apart

                hSq = Math.max(0.0, hSq);
                double h = Math.sqrt(hSq);

                // Calculate perpendicular direction
                // For vector (dx, dy), perpendicular is (-dy, dx) or (dy, -dx)
                if (Math.abs(d) > 1e-6) {
                    double perpX = -dy / d;
                    double perpY = dx / d;

                    // Two possible centers
                    double center1X = midX + h * perpX;
                    double center1Y = midY + h * perpY;
                    double center2X = midX - h * perpX;
                    double center2Y = midY - h * perpY;

                    // Count darts for both centers
                    maxCount = Math.max(maxCount,
                        Math.max(countDarts(darts, center1X, center1Y, radius),
                                 countDarts(darts, center2X, center2Y, radius)));
                }
            }
        }

        return maxCount;
    }

    // Helper method to count darts within radius r of center
    private int countDarts(int[][] darts, double centerX, double centerY, double radius) {
        int count = 0;
        double rSq = radius * radius;
        double epsilon = 1e-6;

        for (int[] dart : darts) {
            double dx = dart[0] - centerX;
            double dy = dart[1] - centerY;
            double distSq = dx * dx + dy * dy;

            if (distSq <= rSq + epsilon) {
                count++;
            }
        }
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n³)

- We consider O(n²) candidate centers (from each pair of darts, plus n from single darts)
- For each candidate center, we check all n darts to count how many are inside
- This gives us O(n² × n) = O(n³) operations
- For n ≤ 100, this is at most 1,000,000 operations, which is acceptable

**Space Complexity**: O(1)

- We only use a constant amount of extra space for variables
- No additional data structures that scale with input size

**Why this is optimal for the constraints**:

- The problem has n ≤ 100 in typical test cases
- O(n³) with n=100 is 1,000,000 operations, which runs quickly
- More sophisticated algorithms using angular sweeping could achieve O(n² log n), but they're more complex and unnecessary for these constraints

## Common Mistakes

1. **Floating point precision errors**: When comparing distances, always use a small epsilon (like 1e-6) instead of exact equality. This avoids issues with floating point arithmetic.

2. **Forgetting the single-dart case**: The optimal circle might only touch one dart (if all other darts are clustered around it). Always check circles centered at each dart position.

3. **Not handling collinear or coincident points**: When two darts are at the same position or very close together, the distance d can be zero, causing division by zero. Always check if d > epsilon before dividing.

4. **Missing the case when h² is negative**: When two points are exactly 2r apart, h² = 0. When they're farther apart, h² is negative and we should skip that pair. Use epsilon for comparison.

5. **Integer division errors**: When calculating midpoints in Java, ensure you use `/ 2.0` instead of `/ 2` to avoid integer truncation.

## When You'll See This Pattern

This problem uses a common computational geometry pattern: **reducing infinite search space using boundary constraints**. Similar problems include:

1. **Minimum Area Rectangle II (LeetCode 963)**: Finding the minimum area rectangle that can enclose points, where the rectangle can be rotated. The solution often involves considering pairs of points as potential rectangle diagonals.

2. **Maximum Points on a Line (LeetCode 149)**: Finding the maximum number of points that lie on the same straight line. The solution involves considering each point as a potential anchor and calculating slopes to other points.

3. **Smallest Circle Enclosing Points (a classic problem)**: Finding the smallest circle that encloses all points. The solution often involves randomized incremental construction or considering points on the boundary.

The key insight in all these problems is that optimal geometric configurations often have specific points lying on boundaries (edges, circumferences), which reduces the search space from infinite to polynomial.

## Key Takeaways

1. **Boundary principle**: For optimization problems with movable shapes, the optimal solution often has the shape touching specific points on its boundary. This reduces infinite possibilities to a finite set of candidates.

2. **Pairwise consideration**: When a shape's boundary is determined by two points (like a circle through two points), consider all pairs of input points as potential boundary-defining pairs.

3. **Floating point caution**: Geometric problems often require careful handling of floating point comparisons. Always use epsilon tolerances and watch for division by zero.

4. **Constraint-driven optimization**: Let the problem constraints guide your algorithm choice. For n ≤ 100, O(n³) is acceptable. For larger n, you'd need more sophisticated techniques like angular sweeping.

[Practice this problem on CodeJeet](/problem/maximum-number-of-darts-inside-of-a-circular-dartboard)
