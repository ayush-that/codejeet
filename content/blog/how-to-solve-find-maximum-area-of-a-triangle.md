---
title: "How to Solve Find Maximum Area of a Triangle — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Maximum Area of a Triangle. Medium difficulty, 29.1% acceptance rate. Topics: Array, Hash Table, Math, Greedy, Geometry."
date: "2026-04-15"
category: "dsa-patterns"
tags: ["find-maximum-area-of-a-triangle", "array", "hash-table", "math", "medium"]
---

# How to Solve Find Maximum Area of a Triangle

This problem asks us to find twice the maximum area of any triangle formed by three points from a given set, with the constraint that at least one side must be parallel to either the x-axis or y-axis. The "twice the area" detail is actually helpful—it eliminates the need for division by 2 in the area formula. What makes this problem interesting is that the parallel constraint transforms a seemingly O(n³) brute force problem into one we can solve in O(n²) through careful grouping and observation.

## Visual Walkthrough

Let's work through a concrete example with points: `[(1, 2), (3, 5), (4, 2), (6, 5), (7, 3)]`

We need to find triangles where at least one side is horizontal (parallel to x-axis) or vertical (parallel to y-axis). Let's think about what this means:

1. **Horizontal side**: Two points share the same y-coordinate. The length of this base is simply the absolute difference in their x-coordinates.
2. **Vertical side**: Two points share the same x-coordinate. The length of this base is the absolute difference in their y-coordinates.

For a triangle with a horizontal base, the area is `(1/2) * base * height`, where height is the vertical distance from the third point to the line containing the base. Since we want twice the area, that's simply `base * height`.

Let's find all horizontal bases:

- Points with y=2: (1,2) and (4,2) → base length = |4-1| = 3
- Points with y=5: (3,5) and (6,5) → base length = |6-3| = 3

For the base (1,2)-(4,2) with length 3, we can use any other point as the third vertex. The height will be the absolute difference between that point's y-coordinate and 2:

- (3,5): height = |5-2| = 3 → area×2 = 3×3 = 9
- (6,5): height = |5-2| = 3 → area×2 = 3×3 = 9
- (7,3): height = |3-2| = 1 → area×2 = 3×1 = 3

Similarly for vertical bases:

- Points with x=3: (3,5) only → no pair
- Points with x=4: (4,2) only → no pair
- Points with x=6: (6,5) only → no pair
- Points with x=1: (1,2) only → no pair
- Points with x=7: (7,3) only → no pair

So the maximum twice-area we found is 9. The key insight: for each group of points sharing the same y-coordinate (horizontal case) or same x-coordinate (vertical case), we only need the minimum and maximum coordinate value to form the longest possible base.

## Brute Force Approach

A naive approach would check all possible triples of points (O(n³)), calculate the area for each, check if at least one side is parallel to an axis, and track the maximum. For each triple (p, q, r):

1. Check if any side is horizontal (same y) or vertical (same x)
2. If yes, calculate twice the area using the appropriate formula
3. Update maximum if larger

The check for parallel sides requires examining all three sides: pq, pr, and qr. For a triangle with a horizontal base between points p and q (same y), the area×2 = |x₁ - x₂| × |y₃ - y| where y is the common y-coordinate of the base.

While this brute force is correct, it's far too slow for n up to 1000 (which would be ~10⁹ operations). We need to optimize by avoiding the triple nested loop.

## Optimized Approach

The key insight is that we don't need to check all triples. Instead, we can:

1. **Group points by their y-coordinate** (for horizontal bases)
2. For each group (points with same y), the longest possible base uses the points with minimum and maximum x in that group
3. For each such base, the maximum area triangle will use the point with the maximum vertical distance from this y-value
4. Repeat symmetrically for vertical bases by grouping points by x-coordinate

But there's a subtlety: the point giving maximum height might be in the same group as the base points (same y), which would give height 0. So we actually need to track both the maximum positive and maximum negative deviation from the base y-value.

A more efficient approach:

- For horizontal case: Group by y, track min_x and max_x for each group
- Find global max_y and min_y across all points
- For each y-group, base = max_x - min_x, height = max(|max_y - y|, |min_y - y|)
- Area×2 = base × height

Similarly for vertical case: Group by x, track min_y and max_y for each group

- Find global max_x and min_x across all points
- For each x-group, base = max_y - min_y, height = max(|max_x - x|, |min_x - x|)

This gives us O(n) time after grouping, which is O(n) with a hash map.

## Optimal Solution

The algorithm:

1. Find global min/max x and y across all points
2. Group points by y-coordinate, tracking min and max x for each y
3. For each y-group: area×2 = (max_x - min_x) × max(|max_y - y|, |min_y - y|)
4. Group points by x-coordinate, tracking min and max y for each x
5. For each x-group: area×2 = (max_y - min_y) × max(|max_x - x|, |min_x - x|)
6. Return maximum across all calculations

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def max_twice_area(coords):
    """
    Returns twice the maximum area of a triangle formed by any three points
    where at least one side is parallel to x-axis or y-axis.
    """
    if len(coords) < 3:
        return 0

    n = len(coords)

    # Step 1: Find global min and max for x and y coordinates
    # We need these to compute maximum possible height for any base
    min_x = min_y = float('inf')
    max_x = max_y = float('-inf')

    for x, y in coords:
        min_x = min(min_x, x)
        max_x = max(max_x, x)
        min_y = min(min_y, y)
        max_y = max(max_y, y)

    max_area = 0

    # Step 2: Handle horizontal bases (same y-coordinate)
    # Group points by y-coordinate, track min and max x for each y
    y_groups = {}
    for x, y in coords:
        if y not in y_groups:
            y_groups[y] = [x, x]  # [min_x, max_x]
        else:
            y_groups[y][0] = min(y_groups[y][0], x)  # update min_x
            y_groups[y][1] = max(y_groups[y][1], x)  # update max_x

    # For each horizontal base (same y), compute maximum possible area
    for y, (min_x_for_y, max_x_for_y) in y_groups.items():
        if min_x_for_y == max_x_for_y:
            continue  # Need at least two points with same y to form a base

        base_length = max_x_for_y - min_x_for_y

        # Height is maximum vertical distance from base y to any point
        # We can use the global min_y or max_y for maximum height
        height = max(abs(max_y - y), abs(min_y - y))

        max_area = max(max_area, base_length * height)

    # Step 3: Handle vertical bases (same x-coordinate)
    # Group points by x-coordinate, track min and max y for each x
    x_groups = {}
    for x, y in coords:
        if x not in x_groups:
            x_groups[x] = [y, y]  # [min_y, max_y]
        else:
            x_groups[x][0] = min(x_groups[x][0], y)  # update min_y
            x_groups[x][1] = max(x_groups[x][1], y)  # update max_y

    # For each vertical base (same x), compute maximum possible area
    for x, (min_y_for_x, max_y_for_x) in x_groups.items():
        if min_y_for_x == max_y_for_x:
            continue  # Need at least two points with same x to form a base

        base_length = max_y_for_x - min_y_for_x

        # Height is maximum horizontal distance from base x to any point
        # We can use the global min_x or max_x for maximum height
        height = max(abs(max_x - x), abs(min_x - x))

        max_area = max(max_area, base_length * height)

    return max_area
```

```javascript
// Time: O(n) | Space: O(n)
function maxTwiceArea(coords) {
  /**
   * Returns twice the maximum area of a triangle formed by any three points
   * where at least one side is parallel to x-axis or y-axis.
   */
  if (coords.length < 3) return 0;

  const n = coords.length;

  // Step 1: Find global min and max for x and y coordinates
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  for (const [x, y] of coords) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  let maxArea = 0;

  // Step 2: Handle horizontal bases (same y-coordinate)
  // Group points by y-coordinate, track min and max x for each y
  const yGroups = new Map();
  for (const [x, y] of coords) {
    if (!yGroups.has(y)) {
      yGroups.set(y, [x, x]); // [min_x, max_x]
    } else {
      const [currentMin, currentMax] = yGroups.get(y);
      yGroups.set(y, [
        Math.min(currentMin, x), // update min_x
        Math.max(currentMax, x), // update max_x
      ]);
    }
  }

  // For each horizontal base (same y), compute maximum possible area
  for (const [y, [minXForY, maxXForY]] of yGroups) {
    if (minXForY === maxXForY) continue; // Need at least two points with same y

    const baseLength = maxXForY - minXForY;

    // Height is maximum vertical distance from base y to any point
    // We can use the global minY or maxY for maximum height
    const height = Math.max(Math.abs(maxY - y), Math.abs(minY - y));

    maxArea = Math.max(maxArea, baseLength * height);
  }

  // Step 3: Handle vertical bases (same x-coordinate)
  // Group points by x-coordinate, track min and max y for each x
  const xGroups = new Map();
  for (const [x, y] of coords) {
    if (!xGroups.has(x)) {
      xGroups.set(x, [y, y]); // [min_y, max_y]
    } else {
      const [currentMin, currentMax] = xGroups.get(x);
      xGroups.set(x, [
        Math.min(currentMin, y), // update min_y
        Math.max(currentMax, y), // update max_y
      ]);
    }
  }

  // For each vertical base (same x), compute maximum possible area
  for (const [x, [minYForX, maxYForX]] of xGroups) {
    if (minYForX === maxYForX) continue; // Need at least two points with same x

    const baseLength = maxYForX - minYForX;

    // Height is maximum horizontal distance from base x to any point
    // We can use the global minX or maxX for maximum height
    const height = Math.max(Math.abs(maxX - x), Math.abs(minX - x));

    maxArea = Math.max(maxArea, baseLength * height);
  }

  return maxArea;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public int maxTwiceArea(int[][] coords) {
        /**
         * Returns twice the maximum area of a triangle formed by any three points
         * where at least one side is parallel to x-axis or y-axis.
         */
        if (coords.length < 3) return 0;

        int n = coords.length;

        // Step 1: Find global min and max for x and y coordinates
        int minX = Integer.MAX_VALUE, maxX = Integer.MIN_VALUE;
        int minY = Integer.MAX_VALUE, maxY = Integer.MIN_VALUE;

        for (int[] point : coords) {
            int x = point[0], y = point[1];
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }

        int maxArea = 0;

        // Step 2: Handle horizontal bases (same y-coordinate)
        // Group points by y-coordinate, track min and max x for each y
        Map<Integer, int[]> yGroups = new HashMap<>();
        for (int[] point : coords) {
            int x = point[0], y = point[1];
            if (!yGroups.containsKey(y)) {
                yGroups.put(y, new int[]{x, x});  // [min_x, max_x]
            } else {
                int[] range = yGroups.get(y);
                range[0] = Math.min(range[0], x);  // update min_x
                range[1] = Math.max(range[1], x);  // update max_x
            }
        }

        // For each horizontal base (same y), compute maximum possible area
        for (Map.Entry<Integer, int[]> entry : yGroups.entrySet()) {
            int y = entry.getKey();
            int[] range = entry.getValue();
            int minXForY = range[0], maxXForY = range[1];

            if (minXForY == maxXForY) continue;  // Need at least two points with same y

            int baseLength = maxXForY - minXForY;

            // Height is maximum vertical distance from base y to any point
            // We can use the global minY or maxY for maximum height
            int height = Math.max(
                Math.abs(maxY - y),
                Math.abs(minY - y)
            );

            maxArea = Math.max(maxArea, baseLength * height);
        }

        // Step 3: Handle vertical bases (same x-coordinate)
        // Group points by x-coordinate, track min and max y for each x
        Map<Integer, int[]> xGroups = new HashMap<>();
        for (int[] point : coords) {
            int x = point[0], y = point[1];
            if (!xGroups.containsKey(x)) {
                xGroups.put(x, new int[]{y, y});  // [min_y, max_y]
            } else {
                int[] range = xGroups.get(x);
                range[0] = Math.min(range[0], y);  // update min_y
                range[1] = Math.max(range[1], y);  // update max_y
            }
        }

        // For each vertical base (same x), compute maximum possible area
        for (Map.Entry<Integer, int[]> entry : xGroups.entrySet()) {
            int x = entry.getKey();
            int[] range = entry.getValue();
            int minYForX = range[0], maxYForX = range[1];

            if (minYForX == maxYForX) continue;  // Need at least two points with same x

            int baseLength = maxYForX - minYForX;

            // Height is maximum horizontal distance from base x to any point
            // We can use the global minX or maxX for maximum height
            int height = Math.max(
                Math.abs(maxX - x),
                Math.abs(minX - x)
            );

            maxArea = Math.max(maxArea, baseLength * height);
        }

        return maxArea;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the points: one to find global min/max (O(n)), and another to build the y-groups (O(n))
- We then iterate through the y-groups (at most n entries) and x-groups (at most n entries), performing O(1) work per group
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store two hash maps: y_groups and x_groups
- In the worst case, all points have unique y-coordinates, so y_groups has n entries
- Similarly, x_groups could have n entries if all x's are unique
- Total space: O(n) + O(n) = O(n)

## Common Mistakes

1. **Forgetting to check if a group has at least 2 points**: If only one point has a particular y-coordinate, you can't form a base. Always check that min_x != max_x (or min_y != max_y for vertical case).

2. **Using local instead of global extremes for height**: The maximum height for a base at y = k is not necessarily from points in the same y-group. You need to consider the global min_y and max_y across ALL points.

3. **Not handling both horizontal and vertical cases**: Some candidates only check for horizontal bases and forget that vertical bases (same x-coordinate) are equally valid. The problem says "at least one side is parallel to the x-axis OR y-axis."

4. **Incorrect area calculation**: Remember we want "twice the area" which simplifies to base × height. Don't divide by 2. For a triangle with horizontal base between (x₁,y) and (x₂,y), and third point (x₃,y₃), twice area = |x₁ - x₂| × |y₃ - y|.

## When You'll See This Pattern

This problem combines **grouping with hash maps** and **optimization through precomputation of extremes**—patterns that appear in many geometry and optimization problems:

1. **Max Points on a Line (LeetCode 149)**: Also groups points by slope, using hash maps to count collinear points.

2. **Rectangle Area (LeetCode 223)**: Involves computing maximum/minimum coordinates to find overlapping areas.

3. **Largest Triangle Area (LeetCode 812)**: While brute force O(n³) works for small n, the optimization pattern of finding extreme points is similar.

The core technique is: when brute force checking all combinations is too expensive, look for ways to group elements by some property and then optimize within each group using precomputed global information.

## Key Takeaways

1. **Constraint-based optimization**: The requirement that a side must be parallel to an axis transforms the problem. Always look for how constraints simplify the search space.

2. **Group then optimize**: When you need to consider pairs/triples with a common property (same y or x here), group them first, then find optimal pairs within each group using min/max tracking.

3. **Precompute global extremes**: Computing global min/max x and y at the start enables O(1) height calculation for any base, avoiding the need to search for the optimal third point.

[Practice this problem on CodeJeet](/problem/find-maximum-area-of-a-triangle)
