---
title: "How to Solve Minimum Area Rectangle — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Area Rectangle. Medium difficulty, 55.3% acceptance rate. Topics: Array, Hash Table, Math, Geometry, Sorting."
date: "2026-04-23"
category: "dsa-patterns"
tags: ["minimum-area-rectangle", "array", "hash-table", "math", "medium"]
---

# How to Solve Minimum Area Rectangle

We need to find the minimum area rectangle with sides parallel to the X and Y axes from a given set of points. The challenge is that we can't just pick any four points — they must form an axis-aligned rectangle, meaning we need two points with the same x-coordinate and two points with the same y-coordinate. What makes this problem interesting is that points aren't guaranteed to form rectangles at all, and we need an efficient way to check for valid rectangles without checking every possible quadruple of points.

## Visual Walkthrough

Let's trace through a concrete example: `points = [[1,1],[1,3],[3,1],[3,3],[2,2]]`

We're looking for rectangles with sides parallel to the axes. This means for a rectangle to exist, we need:

- Two points with the same x-coordinate (forming a vertical side)
- Two points with the same y-coordinate (forming a horizontal side)
- All four points must exist in our set

Let's visualize the points:

```
y
4
3     • (1,3)       • (3,3)
2           • (2,2)
1     • (1,1)       • (3,1)
0
  0   1   2   3   4   x
```

The key insight: A rectangle is defined by two vertical lines (same x-values) and two horizontal lines (same y-values). For example:

- Points (1,1) and (1,3) share x=1 (vertical line)
- Points (3,1) and (3,3) share x=3 (vertical line)
- Points (1,1) and (3,1) share y=1 (horizontal line)
- Points (1,3) and (3,3) share y=3 (horizontal line)

These four points form a rectangle with area = (3-1) × (3-1) = 4.

Notice that point (2,2) doesn't help form any rectangle because there's no other point with x=2 at a different y-value, and no other point with y=2 at a different x-value.

## Brute Force Approach

The most straightforward approach is to check all possible combinations of 4 points. For each quadruple, we verify if they form an axis-aligned rectangle and calculate the area.

Steps for brute force:

1. Generate all combinations of 4 points from n points (n choose 4)
2. For each combination, check if they form a rectangle:
   - Two points share the same x-coordinate
   - Two other points share the same x-coordinate (different from first pair)
   - Two points share the same y-coordinate
   - Two other points share the same y-coordinate (different from first pair)
3. If valid, calculate area = |x₂ - x₁| × |y₂ - y₁|
4. Track the minimum area found

Why this is too slow:

- For n points, there are C(n,4) = n!/(4!(n-4)!) combinations
- For n=100, that's about 3.9 million combinations
- For n=1000, that's about 41 billion combinations — completely infeasible
- Each combination check requires coordinate comparisons

The brute force approach has O(n⁴) time complexity, which is unacceptable for typical constraints where n can be up to 5000.

## Optimized Approach

The key insight is that we don't need to check all quadruples. Instead, we can think about rectangles as being formed by **pairs of points that could be diagonals**.

For an axis-aligned rectangle, if we take two points that could be opposite corners (diagonally opposite), they must have:

- Different x-coordinates
- Different y-coordinates
- The other two corners must exist: (x₁, y₂) and (x₂, y₁)

Here's the step-by-step reasoning:

1. Store all points in a hash set for O(1) lookup
2. Group points by their x-coordinate (points with same x form vertical lines)
3. For each x-coordinate with at least 2 points, sort the y-values
4. For each pair of y-values in that x-group (these could be top and bottom of a vertical side):
   - This pair (y₁, y₂) represents a potential vertical edge
   - Store this pair as a key in a dictionary, with the x-coordinate as the value
5. When we find the same (y₁, y₂) pair at a different x-coordinate, we've found two vertical edges that could form a rectangle
6. Calculate the area: width = |x₂ - x₁|, height = |y₂ - y₁|, area = width × height
7. Track the minimum area found

Why this works efficiently:

- We only consider pairs of points that could form vertical sides
- When we find the same vertical side at different x-positions, we know we have a rectangle
- We're effectively finding rectangles by matching vertical edges rather than checking all point combinations

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n²) in worst case, but typically much better | Space: O(n)
def minAreaRect(points):
    """
    Find minimum area rectangle with sides parallel to axes.

    Approach: Group points by x-coordinate, then for each x, sort y-values.
    For each pair of y-values at the same x, check if we've seen this
    vertical edge at a different x before.
    """
    # Step 1: Group points by x-coordinate
    # key: x-coordinate, value: list of y-coordinates at that x
    x_to_ys = {}
    for x, y in points:
        if x not in x_to_ys:
            x_to_ys[x] = []
        x_to_ys[x].append(y)

    # Step 2: Sort y-values for each x and filter x's with at least 2 points
    # We only care about x positions that have multiple points (potential vertical sides)
    for x in x_to_ys:
        x_to_ys[x].sort()

    # Step 3: Dictionary to track seen vertical edges
    # key: (y1, y2) pair representing a vertical edge, value: x-coordinate where we saw it
    last_x_for_edge = {}
    min_area = float('inf')

    # Step 4: Process x-coordinates in sorted order
    # Sorting x's ensures we calculate positive widths
    sorted_xs = sorted(x_to_ys.keys())

    for x in sorted_xs:
        ys = x_to_ys[x]
        n = len(ys)

        # Step 5: Check all pairs of y-values at this x
        for i in range(n):
            for j in range(i + 1, n):
                y1, y2 = ys[i], ys[j]

                # Create a key for this vertical edge
                edge = (y1, y2)

                # Step 6: Check if we've seen this vertical edge before
                if edge in last_x_for_edge:
                    # We have a rectangle!
                    prev_x = last_x_for_edge[edge]
                    width = x - prev_x  # positive because x's are sorted
                    height = y2 - y1    # positive because y's are sorted
                    area = width * height
                    min_area = min(min_area, area)

                # Step 7: Update with current x (most recent gives smaller width)
                last_x_for_edge[edge] = x

    # Step 8: Return 0 if no rectangle found, otherwise min_area
    return 0 if min_area == float('inf') else min_area
```

```javascript
// Time: O(n²) in worst case, but typically much better | Space: O(n)
function minAreaRect(points) {
  /**
   * Find minimum area rectangle with sides parallel to axes.
   *
   * Approach: Group points by x-coordinate, then for each x, sort y-values.
   * For each pair of y-values at the same x, check if we've seen this
   * vertical edge at a different x before.
   */

  // Step 1: Group points by x-coordinate
  // key: x-coordinate, value: array of y-coordinates at that x
  const xToYs = new Map();
  for (const [x, y] of points) {
    if (!xToYs.has(x)) {
      xToYs.set(x, []);
    }
    xToYs.get(x).push(y);
  }

  // Step 2: Sort y-values for each x
  for (const [x, ys] of xToYs) {
    ys.sort((a, b) => a - b);
  }

  // Step 3: Map to track seen vertical edges
  // key: string representation of (y1,y2) pair, value: x-coordinate
  const lastXForEdge = new Map();
  let minArea = Infinity;

  // Step 4: Process x-coordinates in sorted order
  const sortedXs = Array.from(xToYs.keys()).sort((a, b) => a - b);

  for (const x of sortedXs) {
    const ys = xToYs.get(x);
    const n = ys.length;

    // Step 5: Check all pairs of y-values at this x
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const y1 = ys[i];
        const y2 = ys[j];

        // Create a key for this vertical edge
        const edgeKey = `${y1},${y2}`;

        // Step 6: Check if we've seen this vertical edge before
        if (lastXForEdge.has(edgeKey)) {
          // We have a rectangle!
          const prevX = lastXForEdge.get(edgeKey);
          const width = x - prevX; // positive because x's are sorted
          const height = y2 - y1; // positive because y's are sorted
          const area = width * height;
          minArea = Math.min(minArea, area);
        }

        // Step 7: Update with current x
        lastXForEdge.set(edgeKey, x);
      }
    }
  }

  // Step 8: Return 0 if no rectangle found, otherwise minArea
  return minArea === Infinity ? 0 : minArea;
}
```

```java
// Time: O(n²) in worst case, but typically much better | Space: O(n)
import java.util.*;

class Solution {
    public int minAreaRect(int[][] points) {
        /**
         * Find minimum area rectangle with sides parallel to axes.
         *
         * Approach: Group points by x-coordinate, then for each x, sort y-values.
         * For each pair of y-values at the same x, check if we've seen this
         * vertical edge at a different x before.
         */

        // Step 1: Group points by x-coordinate
        // key: x-coordinate, value: list of y-coordinates at that x
        Map<Integer, List<Integer>> xToYs = new HashMap<>();
        for (int[] point : points) {
            int x = point[0];
            int y = point[1];
            xToYs.putIfAbsent(x, new ArrayList<>());
            xToYs.get(x).add(y);
        }

        // Step 2: Sort y-values for each x
        for (List<Integer> ys : xToYs.values()) {
            Collections.sort(ys);
        }

        // Step 3: Map to track seen vertical edges
        // key: string representation of (y1,y2) pair, value: x-coordinate
        Map<String, Integer> lastXForEdge = new HashMap<>();
        int minArea = Integer.MAX_VALUE;

        // Step 4: Process x-coordinates in sorted order
        List<Integer> sortedXs = new ArrayList<>(xToYs.keySet());
        Collections.sort(sortedXs);

        for (int x : sortedXs) {
            List<Integer> ys = xToYs.get(x);
            int n = ys.size();

            // Step 5: Check all pairs of y-values at this x
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    int y1 = ys.get(i);
                    int y2 = ys.get(j);

                    // Create a key for this vertical edge
                    String edgeKey = y1 + "," + y2;

                    // Step 6: Check if we've seen this vertical edge before
                    if (lastXForEdge.containsKey(edgeKey)) {
                        // We have a rectangle!
                        int prevX = lastXForEdge.get(edgeKey);
                        int width = x - prevX;  // positive because x's are sorted
                        int height = y2 - y1;   // positive because y's are sorted
                        int area = width * height;
                        minArea = Math.min(minArea, area);
                    }

                    // Step 7: Update with current x
                    lastXForEdge.put(edgeKey, x);
                }
            }
        }

        // Step 8: Return 0 if no rectangle found, otherwise minArea
        return minArea == Integer.MAX_VALUE ? 0 : minArea;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²) in worst case, but typically better**

- Grouping points by x-coordinate: O(n)
- Sorting y-values for each x: O(k log k) for each x with k points, total O(n log n) in worst case
- Checking pairs of y-values: For each x with k points, we check C(k,2) = k(k-1)/2 pairs
- In worst case, all points have same x, giving O(n²) pairs to check
- In practice, points are distributed, so performance is much better

**Space Complexity: O(n)**

- Storing points grouped by x: O(n)
- Dictionary for tracking edges: O(n) in worst case (each pair of points creates an entry)
- Overall linear space relative to input size

## Common Mistakes

1. **Not checking if all four points exist**: The biggest mistake is assuming that if you find two points with same x and two points with same y, you have a rectangle. You must verify all four corner points exist. Our solution avoids this by only considering valid rectangles when we find matching vertical edges.

2. **Forgetting to handle the no-rectangle case**: Always return 0 when no rectangle is found. Candidates often forget to initialize min_area properly or check if it was updated.

3. **Not sorting coordinates**: If you don't sort x-coordinates before processing, you might get negative widths. If you don't sort y-values for each x, you might get negative heights. Always sort to ensure positive dimensions.

4. **Using inefficient data structures**: Using lists instead of hash sets/maps for lookups turns O(1) operations into O(n), making the solution much slower. Always use appropriate data structures for frequent lookups.

## When You'll See This Pattern

This "pair matching" pattern appears in several geometry and grouping problems:

1. **149. Max Points on a Line (Hard)**: Group points by slope to find collinear points. Similar grouping concept but with slopes instead of coordinates.

2. **939. Minimum Area Rectangle (this problem)**: The core pattern of grouping by one coordinate and matching pairs.

3. **356. Line Reflection (Medium)**: Find if points are symmetric about a line. Uses similar coordinate grouping and pair matching techniques.

4. **Maximum Area Rectangle With Point Constraints I/II**: Variations of this problem with additional constraints, using the same core approach.

The pattern is: when you need to find geometric relationships between points, consider grouping them by one coordinate or property, then look for matches in another dimension.

## Key Takeaways

1. **Think in terms of edges, not just points**: Instead of checking all quadruples of points, look for matching pairs of points that could form opposite sides of a rectangle. This reduces O(n⁴) to O(n²) in worst case.

2. **Group and sort strategically**: Grouping points by x-coordinate and sorting both x's and y's simplifies the logic and ensures positive dimensions. This is a common technique in geometry problems.

3. **Hash maps are your friend for geometry**: When you need to check if specific points or configurations exist, hash sets/maps provide O(1) lookups. The edge dictionary in our solution is what makes the efficient matching possible.

Related problems: [Minimum Rectangles to Cover Points](/problem/minimum-rectangles-to-cover-points), [Maximum Area Rectangle With Point Constraints I](/problem/maximum-area-rectangle-with-point-constraints-i), [Maximum Area Rectangle With Point Constraints II](/problem/maximum-area-rectangle-with-point-constraints-ii)
