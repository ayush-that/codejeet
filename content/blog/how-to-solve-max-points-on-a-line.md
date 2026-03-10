---
title: "How to Solve Max Points on a Line — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Max Points on a Line. Hard difficulty, 30.3% acceptance rate. Topics: Array, Hash Table, Math, Geometry."
date: "2027-05-01"
category: "dsa-patterns"
tags: ["max-points-on-a-line", "array", "hash-table", "math", "hard"]
---

# How to Solve Max Points on a Line

Given an array of points on the X-Y plane, we need to find the maximum number of points that lie on the same straight line. This problem is notoriously tricky because it combines geometry, mathematics, and careful implementation. The main challenge lies in accurately representing lines while handling edge cases like duplicate points, vertical lines, and floating-point precision issues.

## Visual Walkthrough

Let's trace through a concrete example: `points = [[1,1],[2,2],[3,3],[1,2],[2,3]]`

We need to check all possible lines formed by pairs of points:

1. **Point [1,1] as reference:**
   - With [2,2]: slope = (2-1)/(2-1) = 1/1 = 1
   - With [3,3]: slope = (3-1)/(3-1) = 2/2 = 1
   - With [1,2]: slope = (2-1)/(1-1) = 1/0 = vertical line
   - With [2,3]: slope = (3-1)/(2-1) = 2/1 = 2
   - Points with slope 1: [1,1], [2,2], [3,3] → 3 points
   - Points with vertical slope: [1,1], [1,2] → 2 points
   - Points with slope 2: [1,1], [2,3] → 2 points

2. **Point [2,2] as reference:**
   - We'd repeat similar calculations, but the key insight is that for each reference point, we count how many other points share the same slope relative to that reference.

3. **Point [3,3] as reference:**
   - Would give us the same lines we've already seen.

The maximum we find is 3 points on the line y = x (points [1,1], [2,2], [3,3]).

## Brute Force Approach

A naive approach would be to check every possible pair of points, calculate the line equation (slope and intercept), and count how many points satisfy each equation. For each pair (i,j), we'd check all n points to see if they lie on the same line.

The brute force solution has O(n³) time complexity because:

- There are O(n²) pairs of points
- For each pair, we check all n points
- This gives us O(n² × n) = O(n³)

This is clearly too slow for the constraints (n ≤ 300, which would mean up to 27 million operations in worst case). We need a more efficient way to group points by line.

## Optimized Approach

The key insight is that for a given reference point, all points on the same line through that point will have the **same slope** relative to the reference. Instead of checking all points for every line, we can:

1. For each point as a reference, calculate the slope to every other point
2. Group these slopes using a hash map
3. The maximum frequency of any slope (plus the reference point itself) gives us the maximum points through that reference
4. Take the maximum across all reference points

But we must handle several edge cases:

- **Duplicate points**: Points with identical coordinates should be counted separately
- **Vertical lines**: Slope is undefined (division by zero)
- **Floating-point precision**: Using float/double for slope can cause issues with exact comparisons

The solution: represent slopes as reduced fractions (dy/dx in simplest form) using the greatest common divisor (GCD). For vertical lines (dx = 0), we can use a special representation like "inf" or a tuple (1, 0).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def maxPoints(points):
    """
    Find the maximum number of points that lie on the same straight line.

    Approach: For each point as reference, calculate slope to all other points.
    Use hash map to count points with same slope. Handle duplicates and vertical lines.
    """
    n = len(points)
    if n < 3:
        # With 0, 1, or 2 points, all are collinear
        return n

    max_points = 1  # At least one point

    for i in range(n):
        # For point i as reference
        slope_count = {}  # Map slope -> count of points with that slope from point i
        duplicates = 0    # Count points identical to points[i]
        current_max = 0   # Max points through point i

        for j in range(i + 1, n):
            # Calculate differences
            dx = points[j][0] - points[i][0]
            dy = points[j][1] - points[i][1]

            # Check for duplicate points
            if dx == 0 and dy == 0:
                duplicates += 1
                continue

            # Calculate slope as reduced fraction to avoid floating-point issues
            # For vertical line (dx = 0), use special representation
            if dx == 0:
                # Vertical line - all points have same x coordinate
                slope = (0, 1)  # Represent as (0, 1) for vertical
            elif dy == 0:
                # Horizontal line
                slope = (1, 0)  # Represent as (1, 0) for horizontal
            else:
                # Reduce fraction using GCD to get simplest form
                # This ensures same slope has same representation
                gcd_val = gcd(abs(dx), abs(dy))
                dx //= gcd_val
                dy //= gcd_val

                # Ensure consistent sign representation
                if dx < 0:
                    dx = -dx
                    dy = -dy
                slope = (dy, dx)  # Store as (dy, dx) for consistency

            # Update count for this slope
            slope_count[slope] = slope_count.get(slope, 0) + 1
            current_max = max(current_max, slope_count[slope])

        # Update global maximum: current_max (points with same slope) + duplicates + 1 (reference point)
        max_points = max(max_points, current_max + duplicates + 1)

    return max_points

def gcd(a, b):
    """Calculate greatest common divisor using Euclidean algorithm."""
    while b:
        a, b = b, a % b
    return a
```

```javascript
// Time: O(n²) | Space: O(n)
/**
 * Find the maximum number of points that lie on the same straight line.
 * @param {number[][]} points - Array of [x, y] coordinates
 * @return {number} Maximum number of collinear points
 */
function maxPoints(points) {
  const n = points.length;
  if (n < 3) {
    // With 0, 1, or 2 points, all are collinear
    return n;
  }

  let maxPoints = 1; // At least one point

  // Helper function to calculate GCD
  const gcd = (a, b) => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return Math.abs(a);
  };

  for (let i = 0; i < n; i++) {
    // Map to store slope -> count for point i as reference
    const slopeMap = new Map();
    let duplicates = 0; // Points identical to points[i]
    let currentMax = 0; // Max points through point i

    for (let j = i + 1; j < n; j++) {
      const dx = points[j][0] - points[i][0];
      const dy = points[j][1] - points[i][1];

      // Check for duplicate points
      if (dx === 0 && dy === 0) {
        duplicates++;
        continue;
      }

      // Calculate slope as reduced fraction
      let slopeKey;
      if (dx === 0) {
        // Vertical line
        slopeKey = "v"; // Special key for vertical lines
      } else if (dy === 0) {
        // Horizontal line
        slopeKey = "h"; // Special key for horizontal lines
      } else {
        // Reduce fraction using GCD
        const gcdVal = gcd(dx, dy);
        const reducedDx = dx / gcdVal;
        const reducedDy = dy / gcdVal;

        // Create consistent string representation
        // Ensure consistent sign for comparison
        const sign = reducedDx < 0 ? -1 : 1;
        slopeKey = `${sign * reducedDy}/${sign * reducedDx}`;
      }

      // Update count for this slope
      const count = (slopeMap.get(slopeKey) || 0) + 1;
      slopeMap.set(slopeKey, count);
      currentMax = Math.max(currentMax, count);
    }

    // Update global maximum
    maxPoints = Math.max(maxPoints, currentMax + duplicates + 1);
  }

  return maxPoints;
}
```

```java
// Time: O(n²) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int maxPoints(int[][] points) {
        int n = points.length;
        if (n < 3) {
            // With 0, 1, or 2 points, all are collinear
            return n;
        }

        int maxPoints = 1;  // At least one point

        for (int i = 0; i < n; i++) {
            // Map to store slope -> count for point i as reference
            Map<String, Integer> slopeMap = new HashMap<>();
            int duplicates = 0;    // Points identical to points[i]
            int currentMax = 0;    // Max points through point i

            for (int j = i + 1; j < n; j++) {
                int dx = points[j][0] - points[i][0];
                int dy = points[j][1] - points[i][1];

                // Check for duplicate points
                if (dx == 0 && dy == 0) {
                    duplicates++;
                    continue;
                }

                // Calculate slope as reduced fraction string
                String slopeKey;
                if (dx == 0) {
                    // Vertical line
                    slopeKey = "v";  // Special key for vertical lines
                } else if (dy == 0) {
                    // Horizontal line
                    slopeKey = "h";  // Special key for horizontal lines
                } else {
                    // Reduce fraction using GCD
                    int gcdVal = gcd(Math.abs(dx), Math.abs(dy));
                    dx /= gcdVal;
                    dy /= gcdVal;

                    // Ensure consistent sign representation
                    if (dx < 0) {
                        dx = -dx;
                        dy = -dy;
                    }
                    slopeKey = dy + "/" + dx;  // String representation
                }

                // Update count for this slope
                int count = slopeMap.getOrDefault(slopeKey, 0) + 1;
                slopeMap.put(slopeKey, count);
                currentMax = Math.max(currentMax, count);
            }

            // Update global maximum
            maxPoints = Math.max(maxPoints, currentMax + duplicates + 1);
        }

        return maxPoints;
    }

    // Helper method to calculate greatest common divisor
    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We have an outer loop through all n points
- For each point i, we have an inner loop through the remaining n-i-1 points
- This gives us Σ(i=0 to n-1) (n-i-1) = n(n-1)/2 = O(n²) operations
- Each operation involves calculating GCD (O(log(min(dx, dy))) which is negligible compared to n²

**Space Complexity: O(n)**

- For each reference point, we store a hash map of at most n-1 slopes
- The map is recreated for each reference point, so maximum space is O(n) at any time
- We don't need to store all slopes for all points simultaneously

## Common Mistakes

1. **Floating-point precision errors**: Using float/double for slope calculations can lead to incorrect comparisons due to rounding. Solution: Use reduced fractions (dy/dx in simplest form) with GCD.

2. **Forgetting duplicate points**: When two points have identical coordinates, they should be counted as separate points on any line through them. Solution: Count duplicates separately and add them to the final count.

3. **Incorrect handling of vertical lines**: When dx = 0, calculating dy/dx causes division by zero. Solution: Use a special representation for vertical lines (like "inf" or a tuple (1, 0)).

4. **Not considering all reference points**: Some solutions only check lines between pairs, missing lines where the reference point isn't one of the endpoints. Solution: For each point as reference, calculate slopes to all other points.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Using hash maps for grouping**: Similar to problems where you need to group elements by some property, like:
   - **Group Anagrams** (LeetCode 49): Group strings by their character counts
   - **Brick Wall** (LeetCode 554): Group edges by position to find where most bricks align

2. **Geometric calculations with precision handling**: Problems involving slopes, angles, or ratios often require careful handling:
   - **Line Reflection** (LeetCode 356): Check if points are symmetric about a line
   - **Minimum Area Rectangle** (LeetCode 939): Find rectangles by checking diagonal points

3. **Pairwise comparisons with optimization**: When brute force O(n³) is too slow but O(n²) is acceptable:
   - **4Sum** (LeetCode 18): Find quadruplets that sum to target
   - **Number of Boomerangs** (LeetCode 447): Count equidistant point triples

## Key Takeaways

1. **Slope as a grouping key**: When checking collinearity, the slope between a reference point and other points serves as a perfect hash key. All points on the same line through the reference will have identical slopes.

2. **Handle edge cases mathematically**: Vertical lines (infinite slope), duplicate points, and floating-point precision require special handling. Representing slopes as reduced fractions solves most precision issues.

3. **Think in terms of reference points**: Instead of checking all possible lines (O(n³)), fix one point and check relationships to others (O(n²)). This "fix one, compare to others" pattern appears in many optimization problems.

Related problems: [Line Reflection](/problem/line-reflection), [Minimum Number of Lines to Cover Points](/problem/minimum-number-of-lines-to-cover-points), [Minimum Lines to Represent a Line Chart](/problem/minimum-lines-to-represent-a-line-chart)
