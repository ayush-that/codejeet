---
title: "How to Solve Erect the Fence — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Erect the Fence. Hard difficulty, 52.7% acceptance rate. Topics: Array, Math, Geometry."
date: "2028-02-24"
category: "dsa-patterns"
tags: ["erect-the-fence", "array", "math", "geometry", "hard"]
---

# How to Solve Erect the Fence

This problem asks us to find the convex hull of a set of points — the smallest polygon that encloses all given trees. What makes this tricky is that we need to handle edge cases like collinear points correctly (including points on the boundary) and implement a robust geometric algorithm under interview pressure. The convex hull is a classic computational geometry problem with practical applications in computer graphics, GIS, and pattern recognition.

## Visual Walkthrough

Let's trace through a concrete example: `trees = [[1,1],[2,2],[2,0],[2,4],[3,3],[4,2]]`

**Step 1: Find the starting point**  
We look for the point with the smallest y-coordinate (and smallest x if there's a tie). Here, both `[1,1]` and `[2,0]` have y=0? Actually `[2,0]` has y=0, which is smaller than `[1,1]`'s y=1. So our starting point is `[2,0]`.

**Step 2: Sort by polar angle**  
We sort all other points relative to `[2,0]` by the angle they make with the positive x-axis. Using the cross product to compare angles without actually computing angles:

- `[1,1]`: angle ≈ 135°
- `[2,2]`: angle ≈ 90°
- `[2,4]`: angle ≈ 90° (same x, different y)
- `[3,3]`: angle ≈ 45°
- `[4,2]`: angle ≈ 0°

**Step 3: Build the hull using Graham Scan**  
We use a stack to maintain candidate hull points:

1. Start with `[2,0]`
2. Add `[4,2]` (rightmost)
3. Add `[3,3]` - check orientation: turn is counterclockwise ✓
4. Add `[2,4]` - check orientation: counterclockwise ✓
5. Add `[2,2]` - check orientation: collinear with `[2,4]` and `[2,0]`? Actually need to check carefully
6. Add `[1,1]` - check orientation: would make clockwise turn, so pop `[2,2]` and check again

The final hull contains `[2,0]`, `[4,2]`, `[3,3]`, `[2,4]`, `[1,1]`.

**Key insight**: We're building the hull by always making left turns (counterclockwise rotations). If we'd make a right turn, we backtrack by removing points until we get a left turn again.

## Brute Force Approach

A naive approach would be to check all possible polygons containing the points. For n points, there are O(2ⁿ) possible subsets, and checking if a polygon encloses all points takes O(n) time. This gives O(n·2ⁿ) time complexity — completely impractical for n > 20.

Another brute force idea: For every pair of points (i, j), check if all other points lie on the same side of the line through i and j. If so, (i, j) is an edge of the convex hull. This takes O(n³) time — still too slow for n up to 3000.

The problem with brute force is the combinatorial explosion. We need a more structured approach that leverages geometric properties.

## Optimized Approach

The key insight is that we can build the convex hull incrementally using sorting and a stack. Graham's Scan algorithm works in O(n log n) time:

1. **Find the anchor point**: The point with the smallest y-coordinate (and smallest x if tied). This point is guaranteed to be on the convex hull.

2. **Sort by polar angle**: Sort all other points by the angle they make with the anchor point relative to the positive x-axis. We use the cross product to compare angles without expensive trigonometric functions.

3. **Handle collinear points**: If multiple points have the same angle, keep only the farthest one (closest to anchor goes first in sorted list).

4. **Build the hull with a stack**: Process sorted points:
   - For each new point, check if we make a "right turn" (clockwise rotation) from the last two points in the hull
   - If yes, pop the last point from the stack until we get a left turn
   - Add the new point to the stack

5. **Include collinear points on edges**: The problem requires all points on the hull boundary, not just vertices. We handle this by not discarding collinear points during sorting and including them in our result.

The cross product is crucial: For points p, q, r, the cross product (q-p) × (r-p) tells us the orientation:

- Positive: Counterclockwise (left turn)
- Negative: Clockwise (right turn)
- Zero: Collinear

## Optimal Solution

Here's the complete implementation using Graham's Scan algorithm:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def outerTrees(trees):
    """
    Returns the convex hull of given points using Graham's Scan.
    Includes all points on the boundary, not just vertices.
    """
    def cross(p, q, r):
        """
        Cross product of vectors (q-p) and (r-p).
        Returns:
          > 0 if counterclockwise (left turn)
          < 0 if clockwise (right turn)
          = 0 if collinear
        """
        return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])

    def distance(p, q):
        """Square of Euclidean distance between p and q."""
        return (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2

    n = len(trees)
    if n <= 3:
        # All points are on convex hull for n ≤ 3
        return trees

    # Step 1: Find the anchor point (lowest y, then lowest x)
    anchor = min(trees, key=lambda p: (p[1], p[0]))

    # Step 2: Sort points by polar angle with anchor
    # Points with same angle are sorted by distance (closer first)
    sorted_points = sorted(trees, key=lambda p: (
        # Sort by polar angle using cross product
        # Points with same angle get sorted by distance
        (p[1] - anchor[1]) / (distance(p, anchor) ** 0.5) if p != anchor else -1,
        distance(p, anchor)
    ))

    # Alternative: More robust sorting using cross product comparison
    def polar_cmp(p):
        if p == anchor:
            return (0, 0)
        # Use atan2 for angle, but cross product for comparison is better
        # We'll implement custom sort key
        return None

    # Actually implement custom comparator or use cross product in sort
    # For simplicity, we'll use the cross product approach directly:

    # Sort by polar angle: if cross product is 0, sort by distance
    trees.sort(key=lambda p: (
        math.atan2(p[1] - anchor[1], p[0] - anchor[0]),
        distance(p, anchor)
    ))

    # Step 3: Build hull using Graham Scan
    hull = [anchor]

    for i in range(1, n):
        # Skip the anchor point in iteration
        if trees[i] == anchor:
            continue

        # While last 3 points make a right turn, pop the middle one
        while len(hull) >= 2 and cross(hull[-2], hull[-1], trees[i]) < 0:
            hull.pop()
        hull.append(trees[i])

    # Step 4: Handle collinear points on the last edge
    # Check if points between anchor and hull[-1] are collinear
    for i in range(n-2, -1, -1):
        if cross(anchor, hull[-1], trees[i]) == 0:
            hull.append(trees[i])

    # Remove duplicates while preserving order
    seen = set()
    result = []
    for point in hull:
        pt = tuple(point)
        if pt not in seen:
            seen.add(pt)
            result.append(list(point))

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function outerTrees(trees) {
  // Cross product of vectors (q-p) and (r-p)
  // Returns positive for counterclockwise, negative for clockwise, 0 for collinear
  function cross(p, q, r) {
    return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  }

  // Square of Euclidean distance
  function distance(p, q) {
    return Math.pow(p[0] - q[0], 2) + Math.pow(p[1] - q[1], 2);
  }

  const n = trees.length;
  if (n <= 3) {
    // All points are on convex hull for n ≤ 3
    return trees;
  }

  // Step 1: Find anchor point (lowest y, then lowest x)
  let anchor = trees[0];
  for (let i = 1; i < n; i++) {
    if (trees[i][1] < anchor[1] || (trees[i][1] === anchor[1] && trees[i][0] < anchor[0])) {
      anchor = trees[i];
    }
  }

  // Step 2: Sort by polar angle with anchor
  trees.sort((a, b) => {
    if (a === anchor) return -1;
    if (b === anchor) return 1;

    const angleA = Math.atan2(a[1] - anchor[1], a[0] - anchor[0]);
    const angleB = Math.atan2(b[1] - anchor[1], b[0] - anchor[0]);

    if (angleA !== angleB) {
      return angleA - angleB;
    }
    // Same angle: sort by distance from anchor
    return distance(a, anchor) - distance(b, anchor);
  });

  // Step 3: Build hull using Graham Scan
  const hull = [anchor];

  for (let i = 1; i < n; i++) {
    // Skip anchor point
    if (trees[i][0] === anchor[0] && trees[i][1] === anchor[1]) {
      continue;
    }

    // While last 3 points make a right turn (clockwise), pop
    while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], trees[i]) < 0) {
      hull.pop();
    }
    hull.push(trees[i]);
  }

  // Step 4: Handle collinear points on the last edge
  // Check points between anchor and last hull point
  for (let i = n - 2; i >= 0; i--) {
    if (cross(anchor, hull[hull.length - 1], trees[i]) === 0) {
      // Check if not already in hull
      const inHull = hull.some((p) => p[0] === trees[i][0] && p[1] === trees[i][1]);
      if (!inHull) {
        hull.push(trees[i]);
      }
    }
  }

  // Remove duplicates
  const seen = new Set();
  const result = [];
  for (const point of hull) {
    const key = `${point[0]},${point[1]}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(point);
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int[][] outerTrees(int[][] trees) {
        int n = trees.length;
        if (n <= 3) {
            // All points are on convex hull for n ≤ 3
            return trees;
        }

        // Step 1: Find anchor point (lowest y, then lowest x)
        int[] anchor = trees[0];
        for (int i = 1; i < n; i++) {
            if (trees[i][1] < anchor[1] ||
                (trees[i][1] == anchor[1] && trees[i][0] < anchor[0])) {
                anchor = trees[i];
            }
        }

        // Step 2: Sort by polar angle with anchor
        final int[] finalAnchor = anchor;
        Arrays.sort(trees, new Comparator<int[]>() {
            @Override
            public int compare(int[] a, int[] b) {
                if (a == finalAnchor) return -1;
                if (b == finalAnchor) return 1;

                double angleA = Math.atan2(a[1] - finalAnchor[1], a[0] - finalAnchor[0]);
                double angleB = Math.atan2(b[1] - finalAnchor[1], b[0] - finalAnchor[0]);

                if (angleA != angleB) {
                    return Double.compare(angleA, angleB);
                }
                // Same angle: sort by distance from anchor
                long distA = distance(a, finalAnchor);
                long distB = distance(b, finalAnchor);
                return Long.compare(distA, distB);
            }
        });

        // Step 3: Build hull using Graham Scan
        List<int[]> hull = new ArrayList<>();
        hull.add(anchor);

        for (int i = 1; i < n; i++) {
            // Skip anchor point
            if (trees[i][0] == anchor[0] && trees[i][1] == anchor[1]) {
                continue;
            }

            // While last 3 points make a right turn (clockwise), pop
            while (hull.size() >= 2 &&
                   cross(hull.get(hull.size() - 2),
                         hull.get(hull.size() - 1),
                         trees[i]) < 0) {
                hull.remove(hull.size() - 1);
            }
            hull.add(trees[i]);
        }

        // Step 4: Handle collinear points on the last edge
        for (int i = n - 2; i >= 0; i--) {
            if (cross(anchor, hull.get(hull.size() - 1), trees[i]) == 0) {
                // Check if not already in hull
                boolean inHull = false;
                for (int[] p : hull) {
                    if (p[0] == trees[i][0] && p[1] == trees[i][1]) {
                        inHull = true;
                        break;
                    }
                }
                if (!inHull) {
                    hull.add(trees[i]);
                }
            }
        }

        // Remove duplicates
        Set<String> seen = new HashSet<>();
        List<int[]> result = new ArrayList<>();
        for (int[] point : hull) {
            String key = point[0] + "," + point[1];
            if (!seen.contains(key)) {
                seen.add(key);
                result.add(point);
            }
        }

        return result.toArray(new int[result.size()][]);
    }

    // Cross product of vectors (q-p) and (r-p)
    private int cross(int[] p, int[] q, int[] r) {
        return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
    }

    // Square of Euclidean distance
    private long distance(int[] p, int[] q) {
        return (long)(p[0] - q[0]) * (p[0] - q[0]) +
               (long)(p[1] - q[1]) * (p[1] - q[1]);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Finding the anchor point: O(n)
- Sorting points by polar angle: O(n log n)
- Building the hull with Graham Scan: O(n) — each point is pushed and popped at most once
- Total: O(n log n) dominated by the sorting step

**Space Complexity: O(n)**

- Storing the sorted array: O(n)
- The hull stack: O(n) in worst case (when all points are on convex hull)
- Auxiliary space for removing duplicates: O(n)

The O(n log n) time is optimal for convex hull algorithms in the comparison model. There are O(n log h) algorithms (where h is hull size) like Chan's algorithm, but Graham's Scan is usually preferred in interviews for its simplicity.

## Common Mistakes

1. **Not handling collinear points correctly**: The problem requires ALL points on the boundary, not just extreme vertices. Candidates often use standard Graham Scan which removes collinear points. Fix: Include a final pass to add collinear points on the last edge.

2. **Floating point precision issues**: Using `Math.atan2()` for sorting can cause precision errors. Better approach: Use cross product comparison directly in the sort comparator to avoid floating point arithmetic entirely.

3. **Wrong orientation check**: Confusing clockwise vs counterclockwise turns. Remember: positive cross product = counterclockwise = left turn. We want to pop when cross product < 0 (right turn).

4. **Forgetting edge cases**:
   - 1-3 points: All points are on the hull
   - All points collinear: Entire set is the hull
   - Duplicate points: Need to remove duplicates from result

## When You'll See This Pattern

Convex hull algorithms appear in problems involving:

- **Minimum bounding geometry**: Finding smallest enclosing circle, rectangle, or polygon
- **Path planning**: Finding shortest paths around obstacles
- **Collision detection**: Determining if points/objects are within a region

Related LeetCode problems:

1. **Erect the Fence II** (Hard): 3D version or weighted version of the same problem
2. **Largest Perimeter Triangle** (Easy): Uses sorting and traversal similar to hull construction
3. **Max Points on a Line** (Hard): Also uses cross product for collinearity checks
4. **Minimum Area Rectangle** (Medium): Geometric optimization with point sets

## Key Takeaways

1. **Graham's Scan is the interview-friendly convex hull algorithm**: It combines sorting with a stack-based incremental construction. The key steps are: find anchor → sort by angle → build hull with orientation checks.

2. **Cross product is your geometric Swiss Army knife**: It tests orientation (clockwise/counterclockwise), checks collinearity, and compares angles without trig functions. Master the formula: `(q-p) × (r-p) = (qx-px)*(ry-py) - (qy-py)*(rx-px)`.

3. **Handle collinear points explicitly**: Many geometry problems have special cases for collinear points. Always test with points in a straight line.

4. **Sorting transforms geometric problems**: Many computational geometry problems become tractable after sorting points by coordinates or angles.

Related problems: [Erect the Fence II](/problem/erect-the-fence-ii), [Sort the Students by Their Kth Score](/problem/sort-the-students-by-their-kth-score)
