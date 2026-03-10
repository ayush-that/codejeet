---
title: "How to Solve Maximum Area Rectangle With Point Constraints I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Area Rectangle With Point Constraints I. Medium difficulty, 51.3% acceptance rate. Topics: Array, Math, Binary Indexed Tree, Segment Tree, Geometry."
date: "2030-02-20"
category: "dsa-patterns"
tags:
  [
    "maximum-area-rectangle-with-point-constraints-i",
    "array",
    "math",
    "binary-indexed-tree",
    "medium",
  ]
---

# How to Solve Maximum Area Rectangle With Point Constraints I

This problem asks us to find the maximum area rectangle formed by four points from a given set, with the additional constraint that the rectangle cannot contain any other points from the set inside it. What makes this problem interesting is that we need to efficiently check both rectangle validity and interior emptiness while searching through combinations of points.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider these points: `[[1,1], [1,3], [3,1], [3,3], [2,2]]`.

We want to find rectangles where:

1. All four corners exist in our point set
2. No other points lie strictly inside the rectangle

Visually, we can see that points `[1,1]`, `[1,3]`, `[3,1]`, and `[3,3]` form a rectangle with area 4. However, point `[2,2]` lies exactly in the center of this rectangle, so this rectangle is invalid because it contains another point inside.

If we had points `[1,1]`, `[1,4]`, `[4,1]`, and `[4,4]` without any interior points, that would form a valid rectangle with area 9.

The key insight is that for any rectangle, we can identify it by its diagonal points. If we have points `(x1, y1)` and `(x2, y2)` where `x1 < x2` and `y1 < y2`, then the other two corners would be `(x1, y2)` and `(x2, y1)`. The rectangle is valid only if all four points exist and no other points lie strictly inside the rectangle defined by these corners.

## Brute Force Approach

A naive approach would be to:

1. Generate all combinations of 4 points (O(n⁴) time)
2. For each combination, check if they form a rectangle (parallel sides, right angles)
3. Check if any other points lie inside the rectangle
4. Track the maximum valid area

This approach is clearly too slow for any reasonable input size. Even with just 100 points, we'd have over 3.9 million combinations to check (100 choose 4 ≈ 3.9M), and for each combination we'd need to check up to 96 other points for interior containment.

The brute force fails because it doesn't leverage the structure of rectangles or use efficient data structures for point lookup and interior checking.

## Optimized Approach

The key insight is that we can identify rectangles by their diagonal pairs. For any two points `(x1, y1)` and `(x2, y2)` where `x1 < x2` and `y1 < y2`, they could be opposite corners of a rectangle. The other two corners would be `(x1, y2)` and `(x2, y1)`.

Our optimized approach:

1. Sort all points and store them in a hash set for O(1) lookup
2. Iterate through all pairs of points `(x1, y1)` and `(x2, y2)` where `x1 < x2` and `y1 < y2`
3. Check if the other two corners `(x1, y2)` and `(x2, y1)` exist in our point set
4. If all four corners exist, check if any points lie strictly inside this rectangle
5. Track the maximum area of valid rectangles

The interior check is the tricky part. We need to efficiently determine if any points fall strictly inside the rectangle `(x1, y1)` to `(x2, y2)`. We can use a 2D Binary Indexed Tree (Fenwick Tree) or Segment Tree to answer range queries in O(log² n) time.

## Optimal Solution

We'll use a 2D Binary Indexed Tree to efficiently count points in any rectangular region. This allows us to check if a rectangle contains interior points by querying the region `(x1+1, y1+1)` to `(x2-1, y2-1)`.

<div class="code-group">

```python
# Time: O(n² log² n) | Space: O(n²) for BIT, O(n) for point set
class Solution:
    def maxRectangleArea(self, points):
        if len(points) < 4:
            return 0

        # Sort points for coordinate compression
        sorted_points = sorted(points)

        # Coordinate compression for x and y
        x_vals = sorted(set(x for x, _ in points))
        y_vals = sorted(set(y for _, y in points))

        # Create mapping from original coordinates to compressed indices
        x_to_idx = {x: i+1 for i, x in enumerate(x_vals)}  # 1-indexed for BIT
        y_to_idx = {y: i+1 for i, y in enumerate(y_vals)}

        # Store points in a set for O(1) lookup
        point_set = set((x, y) for x, y in points)

        # Initialize 2D Binary Indexed Tree
        n, m = len(x_vals), len(y_vals)
        bit = [[0] * (m + 2) for _ in range(n + 2)]

        # Helper functions for 2D BIT
        def update(x, y, val):
            """Update BIT at position (x, y) with value val"""
            i = x
            while i <= n:
                j = y
                while j <= m:
                    bit[i][j] += val
                    j += j & -j  # Move to next index in BIT
                i += i & -i

        def query(x, y):
            """Query prefix sum from (1,1) to (x, y)"""
            total = 0
            i = x
            while i > 0:
                j = y
                while j > 0:
                    total += bit[i][j]
                    j -= j & -j  # Move to parent in BIT
                i -= i & -i
            return total

        def range_query(x1, y1, x2, y2):
            """Query sum in rectangle from (x1, y1) to (x2, y2) inclusive"""
            if x1 > x2 or y1 > y2:
                return 0
            # Using inclusion-exclusion principle
            return (query(x2, y2) - query(x1-1, y2) -
                    query(x2, y1-1) + query(x1-1, y1-1))

        # Insert all points into BIT
        for x, y in points:
            update(x_to_idx[x], y_to_idx[y], 1)

        max_area = 0

        # Try all pairs of points as potential diagonal corners
        for i in range(len(points)):
            x1, y1 = points[i]
            idx_x1, idx_y1 = x_to_idx[x1], y_to_idx[y1]

            for j in range(i + 1, len(points)):
                x2, y2 = points[j]

                # Ensure x1 < x2 and y1 < y2 for consistent rectangle orientation
                if x1 >= x2 or y1 >= y2:
                    continue

                # Check if the other two corners exist
                if (x1, y2) not in point_set or (x2, y1) not in point_set:
                    continue

                idx_x2, idx_y2 = x_to_idx[x2], y_to_idx[y2]

                # Check if there are any points strictly inside the rectangle
                # We query the interior region (x1+1, y1+1) to (x2-1, y2-1)
                interior_count = range_query(idx_x1 + 1, idx_y1 + 1,
                                            idx_x2 - 1, idx_y2 - 1)

                # If no interior points, calculate area and update max
                if interior_count == 0:
                    area = (x2 - x1) * (y2 - y1)
                    max_area = max(max_area, area)

        return max_area
```

```javascript
// Time: O(n² log² n) | Space: O(n²) for BIT, O(n) for point set
class Solution {
  maxRectangleArea(points) {
    if (points.length < 4) return 0;

    // Sort points for coordinate compression
    const sortedPoints = [...points].sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));

    // Coordinate compression for x and y
    const xVals = [...new Set(points.map((p) => p[0]))].sort((a, b) => a - b);
    const yVals = [...new Set(points.map((p) => p[1]))].sort((a, b) => a - b);

    // Create mapping from original coordinates to compressed indices
    const xToIdx = new Map();
    const yToIdx = new Map();
    xVals.forEach((x, i) => xToIdx.set(x, i + 1)); // 1-indexed for BIT
    yVals.forEach((y, i) => yToIdx.set(y, i + 1));

    // Store points in a set for O(1) lookup
    const pointSet = new Set(points.map((p) => `${p[0]},${p[1]}`));

    // Initialize 2D Binary Indexed Tree
    const n = xVals.length,
      m = yVals.length;
    const bit = Array.from({ length: n + 2 }, () => Array(m + 2).fill(0));

    // Helper functions for 2D BIT
    const update = (x, y, val) => {
      let i = x;
      while (i <= n) {
        let j = y;
        while (j <= m) {
          bit[i][j] += val;
          j += j & -j; // Move to next index in BIT
        }
        i += i & -i;
      }
    };

    const query = (x, y) => {
      let total = 0;
      let i = x;
      while (i > 0) {
        let j = y;
        while (j > 0) {
          total += bit[i][j];
          j -= j & -j; // Move to parent in BIT
        }
        i -= i & -i;
      }
      return total;
    };

    const rangeQuery = (x1, y1, x2, y2) => {
      if (x1 > x2 || y1 > y2) return 0;
      // Using inclusion-exclusion principle
      return query(x2, y2) - query(x1 - 1, y2) - query(x2, y1 - 1) + query(x1 - 1, y1 - 1);
    };

    // Insert all points into BIT
    points.forEach(([x, y]) => {
      update(xToIdx.get(x), yToIdx.get(y), 1);
    });

    let maxArea = 0;

    // Try all pairs of points as potential diagonal corners
    for (let i = 0; i < points.length; i++) {
      const [x1, y1] = points[i];
      const idxX1 = xToIdx.get(x1),
        idxY1 = yToIdx.get(y1);

      for (let j = i + 1; j < points.length; j++) {
        const [x2, y2] = points[j];

        // Ensure x1 < x2 and y1 < y2 for consistent rectangle orientation
        if (x1 >= x2 || y1 >= y2) continue;

        // Check if the other two corners exist
        if (!pointSet.has(`${x1},${y2}`) || !pointSet.has(`${x2},${y1}`)) {
          continue;
        }

        const idxX2 = xToIdx.get(x2),
          idxY2 = yToIdx.get(y2);

        // Check if there are any points strictly inside the rectangle
        // We query the interior region (x1+1, y1+1) to (x2-1, y2-1)
        const interiorCount = rangeQuery(idxX1 + 1, idxY1 + 1, idxX2 - 1, idxY2 - 1);

        // If no interior points, calculate area and update max
        if (interiorCount === 0) {
          const area = (x2 - x1) * (y2 - y1);
          maxArea = Math.max(maxArea, area);
        }
      }
    }

    return maxArea;
  }
}
```

```java
// Time: O(n² log² n) | Space: O(n²) for BIT, O(n) for point set
import java.util.*;

class Solution {
    public int maxRectangleArea(int[][] points) {
        if (points.length < 4) return 0;

        // Sort points for coordinate compression
        Arrays.sort(points, (a, b) -> a[0] == b[0] ? a[1] - b[1] : a[0] - b[0]);

        // Coordinate compression for x and y
        Set<Integer> xSet = new HashSet<>();
        Set<Integer> ySet = new HashSet<>();
        for (int[] p : points) {
            xSet.add(p[0]);
            ySet.add(p[1]);
        }

        List<Integer> xVals = new ArrayList<>(xSet);
        List<Integer> yVals = new ArrayList<>(ySet);
        Collections.sort(xVals);
        Collections.sort(yVals);

        // Create mapping from original coordinates to compressed indices
        Map<Integer, Integer> xToIdx = new HashMap<>();
        Map<Integer, Integer> yToIdx = new HashMap<>();
        for (int i = 0; i < xVals.size(); i++) xToIdx.put(xVals.get(i), i + 1);  // 1-indexed
        for (int i = 0; i < yVals.size(); i++) yToIdx.put(yVals.get(i), i + 1);

        // Store points in a set for O(1) lookup
        Set<String> pointSet = new HashSet<>();
        for (int[] p : points) {
            pointSet.add(p[0] + "," + p[1]);
        }

        // Initialize 2D Binary Indexed Tree
        int n = xVals.size(), m = yVals.size();
        int[][] bit = new int[n + 2][m + 2];

        // Insert all points into BIT
        for (int[] p : points) {
            update(bit, xToIdx.get(p[0]), yToIdx.get(p[1]), 1, n, m);
        }

        int maxArea = 0;

        // Try all pairs of points as potential diagonal corners
        for (int i = 0; i < points.length; i++) {
            int x1 = points[i][0], y1 = points[i][1];
            int idxX1 = xToIdx.get(x1), idxY1 = yToIdx.get(y1);

            for (int j = i + 1; j < points.length; j++) {
                int x2 = points[j][0], y2 = points[j][1];

                // Ensure x1 < x2 and y1 < y2 for consistent rectangle orientation
                if (x1 >= x2 || y1 >= y2) continue;

                // Check if the other two corners exist
                if (!pointSet.contains(x1 + "," + y2) ||
                    !pointSet.contains(x2 + "," + y1)) {
                    continue;
                }

                int idxX2 = xToIdx.get(x2), idxY2 = yToIdx.get(y2);

                // Check if there are any points strictly inside the rectangle
                // We query the interior region (x1+1, y1+1) to (x2-1, y2-1)
                int interiorCount = rangeQuery(bit,
                    idxX1 + 1, idxY1 + 1,
                    idxX2 - 1, idxY2 - 1, n, m);

                // If no interior points, calculate area and update max
                if (interiorCount == 0) {
                    int area = (x2 - x1) * (y2 - y1);
                    maxArea = Math.max(maxArea, area);
                }
            }
        }

        return maxArea;
    }

    private void update(int[][] bit, int x, int y, int val, int n, int m) {
        for (int i = x; i <= n; i += i & -i) {
            for (int j = y; j <= m; j += j & -j) {
                bit[i][j] += val;
            }
        }
    }

    private int query(int[][] bit, int x, int y) {
        int total = 0;
        for (int i = x; i > 0; i -= i & -i) {
            for (int j = y; j > 0; j -= j & -j) {
                total += bit[i][j];
            }
        }
        return total;
    }

    private int rangeQuery(int[][] bit, int x1, int y1, int x2, int y2, int n, int m) {
        if (x1 > x2 || y1 > y2) return 0;
        // Using inclusion-exclusion principle
        return query(bit, x2, y2) - query(bit, x1 - 1, y2) -
               query(bit, x2, y1 - 1) + query(bit, x1 - 1, y1 - 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² log² n)

- We consider O(n²) pairs of points as potential diagonals
- For each valid rectangle candidate, we perform:
  - O(1) lookup for corner existence using hash set
  - O(log² n) range query using 2D BIT to check interior points
- Building the BIT takes O(n log² n) time
- Coordinate compression takes O(n log n) time

**Space Complexity:** O(n²) in the worst case for the BIT

- The 2D BIT requires O(n²) space where n is the number of unique coordinates
- Hash set for point lookup: O(n)
- Coordinate mapping: O(n)

The space complexity is dominated by the 2D BIT, which in practice is often acceptable since coordinate compression reduces the dimensions.

## Common Mistakes

1. **Forgetting to check for interior points on the boundary**: When checking interior points, make sure to query `(x1+1, y1+1)` to `(x2-1, y2-1)` to exclude points exactly on the rectangle edges. Points on the boundary don't count as "inside" the rectangle.

2. **Not handling duplicate coordinates correctly**: If multiple points share the same x or y coordinate, coordinate compression must map them to the same index. Failing to do this can cause incorrect BIT queries.

3. **Missing the orientation condition**: When selecting diagonal points, ensure `x1 < x2` and `y1 < y2` to maintain consistent rectangle orientation. Without this, you might miss valid rectangles or double-count them.

4. **Inefficient interior point checking**: Some candidates try to check interior points by iterating through all points for each rectangle candidate, resulting in O(n³) time. The BIT approach is crucial for efficiency.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Coordinate compression + 2D range queries**: Similar to problems like [Range Sum Query 2D - Mutable](https://leetcode.com/problems/range-sum-query-2d-mutable/) and [Count of Range Sum](https://leetcode.com/problems/count-of-range-sum/).

2. **Geometric constraints with point sets**: Like [Minimum Area Rectangle](https://leetcode.com/problems/minimum-area-rectangle/) but with additional interior constraints.

3. **Pairwise enumeration with validation**: Common in problems where you need to validate combinations against constraints, such as [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line/).

The key technique is using efficient data structures (BIT/Segment Tree) to answer range queries when validating constraints during pairwise enumeration.

## Key Takeaways

1. **Diagonal identification simplifies rectangle search**: Instead of checking all 4-point combinations, identify rectangles by their diagonal pairs and verify the existence of the other two corners.

2. **Range query data structures enable constraint validation**: When you need to check if points fall within a region, BIT or Segment Trees provide efficient O(log² n) queries instead of O(n) linear scans.

3. **Coordinate compression is essential for discrete geometry**: When coordinates can be large, compress them to indices to make data structures manageable.

Related problems: [Minimum Area Rectangle](/problem/minimum-area-rectangle)
