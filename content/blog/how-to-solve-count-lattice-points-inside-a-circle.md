---
title: "How to Solve Count Lattice Points Inside a Circle — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Lattice Points Inside a Circle. Medium difficulty, 56.5% acceptance rate. Topics: Array, Hash Table, Math, Geometry, Enumeration."
date: "2029-03-21"
category: "dsa-patterns"
tags: ["count-lattice-points-inside-a-circle", "array", "hash-table", "math", "medium"]
---

# How to Solve Count Lattice Points Inside a Circle

This problem asks us to count all integer coordinate points (lattice points) that lie within at least one of the given circles. Each circle is defined by its center `(x, y)` and radius `r`. The challenge comes from needing to efficiently check which integer points fall within circles without explicitly checking every possible point in an unbounded grid.

What makes this interesting is the trade-off: we could check all points within the bounding box of all circles, but that could be inefficient if circles are far apart. However, since circles are defined on a grid and we only care about integer points, there's a clever optimization we can apply.

## Visual Walkthrough

Let's trace through a simple example: `circles = [[2,2,1]]`

This is a circle centered at (2,2) with radius 1. The lattice points inside this circle are:

- (2,2) - the center itself
- (2,1), (2,3) - directly above and below
- (1,2), (3,2) - directly left and right

That's 5 points total. Notice that (1,1), (1,3), (3,1), (3,3) are NOT inside because their distance from (2,2) is √2 ≈ 1.414 > 1.

Now consider `circles = [[2,2,1], [3,2,1]]`:

- First circle: (2,2), (2,1), (2,3), (1,2), (3,2) = 5 points
- Second circle: (3,2), (3,1), (3,3), (2,2), (4,2) = 5 points
- Union: (1,2), (2,1), (2,2), (2,3), (3,1), (3,2), (3,3), (4,2) = 8 unique points

The key insight: we only need to check points within each circle's bounding box (x±r, y±r), not the entire infinite grid.

## Brute Force Approach

A naive approach would be to find the overall bounding box of all circles and check every integer point within it:

1. Find min_x, max_x, min_y, max_y across all circles (center ± radius)
2. For each integer point (i,j) in this bounding box
3. Check if it's inside any circle using distance formula: √((i-x)² + (j-y)²) ≤ r
4. Count points that satisfy this condition

The problem? The bounding box could be huge if circles are far apart. For example, with circles at (0,0,r=1) and (1000,1000,r=1), we'd check about 1,000,000 points but only ~10 are actually inside circles. This is extremely inefficient.

## Optimized Approach

The key optimization is to check only points that could possibly be inside any circle. For each circle, we only need to check points within its own bounding box (x±r, y±r). We can use a hash set to track unique points across all circles.

Here's the step-by-step reasoning:

1. **Why check per circle?** Each circle only contains points within r units of its center. There's no point checking points farther than r from any circle's center.

2. **How to avoid duplicates?** Use a set to store points as tuples (x,y). Sets automatically handle duplicates.

3. **How to efficiently check points within a circle's bounding box?** For each circle, iterate i from x-r to x+r and j from y-r to y+r. For each (i,j), check if it's inside the circle.

4. **Optimization within the loop:** Instead of computing √((i-x)² + (j-y)²) ≤ r, we can avoid the square root by comparing squared distances: (i-x)² + (j-y)² ≤ r². This is faster and avoids floating-point precision issues.

This approach is optimal because we only check points that could possibly be in any circle, and we avoid checking the same point multiple times for the same circle.

## Optimal Solution

<div class="code-group">

```python
# Time: O(N * R^2) where N = number of circles, R = max radius
# Space: O(P) where P = number of unique lattice points inside circles
def countLatticePoints(circles):
    """
    Count all unique lattice points inside at least one circle.

    Args:
        circles: List of [x, y, r] where (x,y) is center and r is radius

    Returns:
        Number of unique integer points inside any circle
    """
    # Set to store all unique lattice points
    points = set()

    # Process each circle independently
    for x, y, r in circles:
        # Calculate bounding box for this circle
        # We only need to check points within r units of the center
        x_min, x_max = x - r, x + r
        y_min, y_max = y - r, y + r

        # Pre-compute r^2 to avoid recomputing in the loop
        r_squared = r * r

        # Check every integer point in the bounding box
        for i in range(x_min, x_max + 1):
            for j in range(y_min, y_max + 1):
                # Check if point (i,j) is inside the circle
                # Using squared distance to avoid sqrt computation
                dx = i - x
                dy = j - y
                if dx * dx + dy * dy <= r_squared:
                    # Add to set (automatically handles duplicates)
                    points.add((i, j))

    # The size of the set is the count of unique points
    return len(points)
```

```javascript
// Time: O(N * R^2) where N = number of circles, R = max radius
// Space: O(P) where P = number of unique lattice points inside circles
function countLatticePoints(circles) {
  /**
   * Count all unique lattice points inside at least one circle.
   *
   * @param {number[][]} circles - Array of [x, y, r] where (x,y) is center and r is radius
   * @return {number} - Number of unique integer points inside any circle
   */
  const points = new Set();

  // Process each circle independently
  for (const [x, y, r] of circles) {
    // Calculate bounding box for this circle
    const xMin = x - r;
    const xMax = x + r;
    const yMin = y - r;
    const yMax = y + r;

    // Pre-compute r^2 for efficiency
    const rSquared = r * r;

    // Check every integer point in the bounding box
    for (let i = xMin; i <= xMax; i++) {
      for (let j = yMin; j <= yMax; j++) {
        // Check if point (i,j) is inside the circle
        const dx = i - x;
        const dy = j - y;
        if (dx * dx + dy * dy <= rSquared) {
          // Use string key for Set since JavaScript Sets compare object references
          points.add(`${i},${j}`);
        }
      }
    }
  }

  // Return count of unique points
  return points.size;
}
```

```java
// Time: O(N * R^2) where N = number of circles, R = max radius
// Space: O(P) where P = number of unique lattice points inside circles
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int countLatticePoints(int[][] circles) {
        /**
         * Count all unique lattice points inside at least one circle.
         *
         * @param circles - Array of [x, y, r] where (x,y) is center and r is radius
         * @return Number of unique integer points inside any circle
         */
        Set<String> points = new HashSet<>();

        // Process each circle independently
        for (int[] circle : circles) {
            int x = circle[0];
            int y = circle[1];
            int r = circle[2];

            // Calculate bounding box for this circle
            int xMin = x - r;
            int xMax = x + r;
            int yMin = y - r;
            int yMax = y + r;

            // Pre-compute r^2 for efficiency
            int rSquared = r * r;

            // Check every integer point in the bounding box
            for (int i = xMin; i <= xMax; i++) {
                for (int j = yMin; j <= yMax; j++) {
                    // Check if point (i,j) is inside the circle
                    int dx = i - x;
                    int dy = j - y;
                    if (dx * dx + dy * dy <= rSquared) {
                        // Use string key for HashSet
                        points.add(i + "," + j);
                    }
                }
            }
        }

        // Return count of unique points
        return points.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(N × R²) where N is the number of circles and R is the maximum radius.

- For each circle, we check (2R+1) × (2R+1) ≈ 4R² points
- Each point check involves O(1) operations (distance calculation and set insertion)
- In the worst case, if all circles are large and don't overlap much, we check about N × 4R² points

**Space Complexity:** O(P) where P is the total number of unique lattice points inside circles.

- We store each unique point in a hash set
- In the worst case, if circles don't overlap at all, P ≈ N × πR² (but integer points, so slightly less)
- The maximum possible P is bounded by the total area covered by circles

Note: The problem constraints (circles.length ≤ 200, r ≤ 100) make this approach feasible. The worst-case operations would be 200 × (201)² ≈ 8 million, which is acceptable.

## Common Mistakes

1. **Checking the wrong bounding box:** Some candidates try to find a global bounding box and check all points within it. This is inefficient when circles are far apart. Always check per-circle bounding boxes.

2. **Using floating-point comparisons:** Computing √((i-x)² + (j-y)²) ≤ r introduces floating-point precision issues. Always use the squared distance comparison: (i-x)² + (j-y)² ≤ r².

3. **Forgetting the +1 in range bounds:** When iterating from x-r to x+r inclusive, you need `range(x-r, x+r+1)` in Python or `i <= xMax` in Java/JavaScript. The "inclusive" part is easy to miss.

4. **Not handling duplicates correctly:** If you use a list instead of a set, you'll count duplicate points multiple times. Always use a set-like structure to ensure uniqueness.

## When You'll See This Pattern

This problem uses **bounded enumeration with geometric constraints** - a common pattern in computational geometry problems:

1. **Queries on Number of Points Inside a Circle (Medium)** - Similar concept but with queries instead of counting all points. The optimization of checking only relevant points applies here too.

2. **Count Lattice Points Inside a Circle (this problem)** - The exact same problem.

3. **Rectangle Overlap (Easy)** - While simpler, it uses similar bounding box logic to determine if rectangles intersect.

4. **Image Overlap (Medium)** - Uses bounded iteration over possible translations to find maximum overlap.

The core pattern: when you need to check relationships between geometric objects, determine the minimal search space first rather than checking everything.

## Key Takeaways

1. **Bound your search space:** Instead of checking infinite or very large spaces, use the problem constraints to limit what you need to examine. Here, each circle only affects points within r units of its center.

2. **Use squared distances for circles:** Avoid square roots and floating-point issues by comparing squared distances to squared radii.

3. **Sets are perfect for uniqueness:** When you need to count unique items satisfying a condition, a set is usually the right data structure.

4. **Consider per-object processing:** Sometimes processing each object independently with its own bounds is more efficient than finding global bounds.

Related problems: [Queries on Number of Points Inside a Circle](/problem/queries-on-number-of-points-inside-a-circle)
