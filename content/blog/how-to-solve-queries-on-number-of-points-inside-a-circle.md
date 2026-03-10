---
title: "How to Solve Queries on Number of Points Inside a Circle — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Queries on Number of Points Inside a Circle. Medium difficulty, 86.8% acceptance rate. Topics: Array, Math, Geometry."
date: "2027-07-25"
category: "dsa-patterns"
tags: ["queries-on-number-of-points-inside-a-circle", "array", "math", "geometry", "medium"]
---

# How to Solve Queries on Number of Points Inside a Circle

This problem asks us to count how many given points lie inside each of several circles. While conceptually straightforward, it's interesting because it combines geometry with query processing—a common pattern in computational problems. The challenge isn't in finding a clever algorithm, but in efficiently implementing the geometric check and understanding when more advanced optimizations might be needed.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Points:** [[1,3], [2,1], [3,2], [4,4], [5,1]]  
**Queries:** [[2,2,2], [3,3,1], [5,2,3]]

For the first query `[2,2,2]` (circle centered at (2,2) with radius 2):

- Point [1,3]: Distance = √((1-2)² + (3-2)²) = √(1+1) = √2 ≈ 1.41 ≤ 2 ✓
- Point [2,1]: Distance = √((2-2)² + (1-2)²) = √(0+1) = 1 ≤ 2 ✓
- Point [3,2]: Distance = √((3-2)² + (2-2)²) = √(1+0) = 1 ≤ 2 ✓
- Point [4,4]: Distance = √((4-2)² + (4-2)²) = √(4+4) = √8 ≈ 2.83 > 2 ✗
- Point [5,1]: Distance = √((5-2)² + (1-2)²) = √(9+1) = √10 ≈ 3.16 > 2 ✗

Count = 3 points inside.

For the second query `[3,3,1]`:

- Only point [3,2] is within distance 1 (distance = 1 exactly)
- Count = 1

For the third query `[5,2,3]`:

- All points except possibly [1,3] are inside
- [1,3]: Distance = √((1-5)² + (3-2)²) = √(16+1) = √17 ≈ 4.12 > 3 ✗
- Count = 4

So the answer would be `[3, 1, 4]`.

## Brute Force Approach

The most straightforward approach is to check every point against every circle. For each query circle, we iterate through all points and count how many satisfy the distance condition.

The distance check formula is:  
`distance² = (x_point - x_center)² + (y_point - y_center)²`  
A point is inside the circle if `distance² ≤ radius²`

We compare squared distances to avoid computing square roots, which is both faster and avoids floating-point precision issues.

**Why this might be insufficient:**  
If we have `n` points and `m` queries, the brute force approach takes O(n × m) time. For large inputs (up to 500 points and 500 queries in LeetCode constraints), this is 250,000 operations, which is actually acceptable. However, if constraints were larger, we'd need optimization.

## Optimized Approach

For this specific problem with the given constraints (n, m ≤ 500), the brute force solution is optimal in practice. However, let's discuss what we'd do if constraints were larger:

1. **Spatial partitioning:** We could use a quadtree or k-d tree to organize points spatially, allowing us to quickly eliminate points far from a query circle.

2. **Range trees:** For counting points within circles, we could transform the problem—a circle centered at (x,y) with radius r contains points where (x_i - x)² + (y_i - y)² ≤ r². This is equivalent to x_i² - 2x·x_i + x² + y_i² - 2y·y_i + y² ≤ r², which can be rearranged but doesn't lead to a simple range query.

3. **Grid hashing:** Divide the plane into a grid of cells with side length equal to the maximum radius. For each query, only check points in cells that intersect the circle.

The key insight is that for the actual LeetCode problem, the constraints are small enough that brute force is acceptable. The optimization comes from avoiding square roots by comparing squared distances.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * m) where n = len(points), m = len(queries)
# Space: O(m) for the result array
def countPoints(points, queries):
    """
    Count how many points lie inside each circle.

    Args:
        points: List of [x, y] coordinates
        queries: List of [x, y, r] circle definitions

    Returns:
        List of counts for each query
    """
    result = []

    # Process each query circle
    for x_center, y_center, radius in queries:
        count = 0
        radius_squared = radius * radius  # Pre-compute to avoid repeated multiplication

        # Check each point against the current circle
        for x_point, y_point in points:
            # Calculate squared distance from point to circle center
            dx = x_point - x_center
            dy = y_point - y_center
            distance_squared = dx * dx + dy * dy

            # Point is inside if squared distance <= squared radius
            if distance_squared <= radius_squared:
                count += 1

        result.append(count)

    return result
```

```javascript
// Time: O(n * m) where n = points.length, m = queries.length
// Space: O(m) for the result array
function countPoints(points, queries) {
  const result = [];

  // Process each query circle
  for (const [xCenter, yCenter, radius] of queries) {
    let count = 0;
    const radiusSquared = radius * radius; // Pre-compute to avoid repeated multiplication

    // Check each point against the current circle
    for (const [xPoint, yPoint] of points) {
      // Calculate squared distance from point to circle center
      const dx = xPoint - xCenter;
      const dy = yPoint - yCenter;
      const distanceSquared = dx * dx + dy * dy;

      // Point is inside if squared distance <= squared radius
      if (distanceSquared <= radiusSquared) {
        count++;
      }
    }

    result.push(count);
  }

  return result;
}
```

```java
// Time: O(n * m) where n = points.length, m = queries.length
// Space: O(m) for the result array
class Solution {
    public int[] countPoints(int[][] points, int[][] queries) {
        int[] result = new int[queries.length];

        // Process each query circle
        for (int i = 0; i < queries.length; i++) {
            int xCenter = queries[i][0];
            int yCenter = queries[i][1];
            int radius = queries[i][2];
            int count = 0;
            int radiusSquared = radius * radius;  // Pre-compute to avoid repeated multiplication

            // Check each point against the current circle
            for (int[] point : points) {
                int xPoint = point[0];
                int yPoint = point[1];

                // Calculate squared distance from point to circle center
                int dx = xPoint - xCenter;
                int dy = yPoint - yCenter;
                int distanceSquared = dx * dx + dy * dy;

                // Point is inside if squared distance <= squared radius
                if (distanceSquared <= radiusSquared) {
                    count++;
                }
            }

            result[i] = count;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m) where n is the number of points and m is the number of queries. For each of the m queries, we check all n points. With constraints n, m ≤ 500, this gives at most 250,000 operations, which is efficient.

**Space Complexity:** O(m) for storing the result array. We use only a constant amount of extra space beyond the input and output.

## Common Mistakes

1. **Using square root instead of squared distances:** Some candidates compute actual Euclidean distance with `Math.sqrt()`, which is slower and introduces floating-point precision issues. Always compare squared distances to avoid these problems.

2. **Forgetting that points on the circle boundary count as inside:** The problem states "inside a circle," which mathematically includes points exactly on the circumference. The condition should be `distance² ≤ radius²`, not `distance² < radius²`.

3. **Not pre-computing radius²:** Computing `radius * radius` inside the inner loop for each point is wasteful. Compute it once per query outside the inner loop.

4. **Incorrect array indexing in Java:** Java arrays use `queries[i][0]` for x, `queries[i][1]` for y, `queries[i][2]` for radius. Mixing up these indices is a common off-by-one error.

## When You'll See This Pattern

This problem exemplifies the "query processing with geometric constraints" pattern. Similar problems include:

1. **Count Lattice Points Inside a Circle (Medium):** Similar concept but with integer lattice points and a single circle. The optimization techniques (avoiding square roots, bounding box checks) are identical.

2. **Count Number of Rectangles Containing Each Point (Medium):** Instead of circles, we have axis-aligned rectangles. The pattern of checking geometric containment remains, though rectangle checks are simpler (just coordinate comparisons).

3. **Queries on a Permutation With Key (Medium):** While not geometric, it shares the pattern of processing multiple queries against a dataset, which often requires balancing between preprocessing cost and query time.

## Key Takeaways

1. **Avoid square roots in geometry problems:** When comparing distances, work with squared values to improve performance and avoid floating-point issues.

2. **Understand constraint implications:** With n, m ≤ 500, O(n×m) brute force is acceptable. Always check constraints before over-engineering a solution.

3. **Geometric containment checks follow mathematical definitions:** A point is inside a circle if the distance to the center ≤ radius. On the boundary counts as inside unless specified otherwise.

Related problems: [Count Lattice Points Inside a Circle](/problem/count-lattice-points-inside-a-circle), [Count Number of Rectangles Containing Each Point](/problem/count-number-of-rectangles-containing-each-point), [Check if the Rectangle Corner Is Reachable](/problem/check-if-the-rectangle-corner-is-reachable)
