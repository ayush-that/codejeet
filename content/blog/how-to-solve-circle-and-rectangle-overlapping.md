---
title: "How to Solve Circle and Rectangle Overlapping — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Circle and Rectangle Overlapping. Medium difficulty, 49.8% acceptance rate. Topics: Math, Geometry."
date: "2029-08-31"
category: "dsa-patterns"
tags: ["circle-and-rectangle-overlapping", "math", "geometry", "medium"]
---

# How to Solve Circle and Rectangle Overlapping

This problem asks whether a circle and an axis-aligned rectangle overlap. Given a circle defined by its radius and center coordinates, and a rectangle defined by its bottom-left and top-right corners, we need to return `true` if they intersect (touch or overlap) and `false` otherwise. What makes this problem interesting is that it's not just about checking if the circle's center is inside the rectangle—the circle can intersect the rectangle even when its center is outside, as long as it's close enough to an edge or corner.

## Visual Walkthrough

Let's walk through an example to build intuition. Consider:

- Circle: radius = 2, center at (3, 3)
- Rectangle: bottom-left (1, 1), top-right (5, 5)

Visually, the rectangle forms a 4×4 square, and the circle with radius 2 is centered inside it. Clearly they overlap. But how do we check this systematically?

The key insight is to find the closest point on the rectangle to the circle's center, then check if the distance from that point to the center is ≤ the radius.

For our example:

1. The circle center (3, 3) is inside the rectangle (x between 1-5, y between 1-5)
2. The closest point on the rectangle to (3, 3) is (3, 3) itself (the center is already inside)
3. Distance = 0, which is ≤ radius 2 → overlap

Now consider a harder case:

- Circle: radius = 2, center at (6, 3)
- Rectangle: same as before (1, 1, 5, 5)

The center (6, 3) is to the right of the rectangle. The closest point on the rectangle is:

- x: clamped between 1 and 5 → 5 (the right edge)
- y: 3 is between 1 and 5 → 3
- Closest point = (5, 3)
- Distance = √((6-5)² + (3-3)²) = √1 = 1
- 1 ≤ 2 → overlap (circle touches right side)

This "closest point" approach works for all cases: when the center is inside, on an edge, outside near an edge, or outside near a corner.

## Brute Force Approach

A naive approach might try to check every point along the circle's circumference or rectangle's perimeter, but that's computationally infeasible. Another brute force idea: check if any of the rectangle's corners are inside the circle, or if the circle's center is inside the rectangle, or if any edge intersects the circle. This requires multiple checks and edge-case handling.

The problem with checking just corners or center is that it misses cases like:

- Circle entirely contains the rectangle (all corners inside circle)
- Circle touches a rectangle edge without containing any corners
- Circle's center is outside but circle still overlaps

A complete brute force would need to check:

1. Is circle center inside rectangle?
2. Is any rectangle corner inside circle?
3. Does any rectangle edge intersect the circle?

This involves multiple distance calculations and line-circle intersection checks, which is messy and error-prone. More importantly, it's unnecessary—we can solve this with a single, elegant approach.

## Optimized Approach

The optimal solution uses the "closest point" method described in the visual walkthrough. Here's the step-by-step reasoning:

1. **Find the closest x-coordinate on the rectangle to the circle's center**:
   - If the center's x is between rectangle's left and right edges, the closest x is the center's x itself
   - If the center's x is left of the rectangle, the closest x is the left edge (x1)
   - If the center's x is right of the rectangle, the closest x is the right edge (x2)

2. **Find the closest y-coordinate on the rectangle to the circle's center**:
   - Same logic as above, but for y-coordinates

3. **Calculate the squared distance** from the circle center to this closest point
   - We use squared distance to avoid expensive square root operations
   - Distance² = (closestX - xCenter)² + (closestY - yCenter)²

4. **Compare with radius²**:
   - If distance² ≤ radius², they overlap (touch or intersect)
   - If distance² > radius², they don't overlap

Why does this work? The closest point on an axis-aligned rectangle to any given point is found by clamping each coordinate independently to the rectangle's bounds. If this closest point is within the circle's radius, some part of the rectangle must be inside the circle. If it's outside, the entire rectangle is outside the circle.

## Optimal Solution

Here's the complete implementation in three languages:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def checkOverlap(radius, xCenter, yCenter, x1, y1, x2, y2):
    """
    Check if a circle and axis-aligned rectangle overlap.

    Approach: Find the closest point on the rectangle to the circle center,
    then check if the distance from that point to the center is ≤ radius.
    """
    # Step 1: Find the closest x-coordinate on the rectangle to the circle center
    # If xCenter is between x1 and x2, the closest x is xCenter itself
    # If xCenter is left of x1, the closest x is x1
    # If xCenter is right of x2, the closest x is x2
    closestX = max(x1, min(xCenter, x2))

    # Step 2: Find the closest y-coordinate on the rectangle to the circle center
    # Same logic as for x-coordinate
    closestY = max(y1, min(yCenter, y2))

    # Step 3: Calculate squared distance from circle center to closest point
    # We use squared distance to avoid expensive sqrt operation
    distance_squared = (closestX - xCenter) ** 2 + (closestY - yCenter) ** 2

    # Step 4: Check if distance is within radius (compare squared values)
    # If distance² ≤ radius², the point is inside or on the circle
    return distance_squared <= radius ** 2
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Check if a circle and axis-aligned rectangle overlap.
 *
 * Approach: Find the closest point on the rectangle to the circle center,
 * then check if the distance from that point to the center is ≤ radius.
 */
function checkOverlap(radius, xCenter, yCenter, x1, y1, x2, y2) {
  // Step 1: Find the closest x-coordinate on the rectangle to the circle center
  // Math.max(x1, Math.min(xCenter, x2)) gives us:
  // - xCenter if it's between x1 and x2
  // - x1 if xCenter < x1
  // - x2 if xCenter > x2
  const closestX = Math.max(x1, Math.min(xCenter, x2));

  // Step 2: Find the closest y-coordinate on the rectangle to the circle center
  // Same logic as for x-coordinate
  const closestY = Math.max(y1, Math.min(yCenter, y2));

  // Step 3: Calculate squared distance from circle center to closest point
  // We avoid Math.sqrt for performance by comparing squared values
  const dx = closestX - xCenter;
  const dy = closestY - yCenter;
  const distanceSquared = dx * dx + dy * dy;

  // Step 4: Check if distance is within radius (compare squared values)
  // If distance² ≤ radius², the point is inside or on the circle
  return distanceSquared <= radius * radius;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Check if a circle and axis-aligned rectangle overlap.
     *
     * Approach: Find the closest point on the rectangle to the circle center,
     * then check if the distance from that point to the center is ≤ radius.
     */
    public boolean checkOverlap(int radius, int xCenter, int yCenter,
                                int x1, int y1, int x2, int y2) {
        // Step 1: Find the closest x-coordinate on the rectangle to the circle center
        // Math.max(x1, Math.min(xCenter, x2)) gives us:
        // - xCenter if it's between x1 and x2
        // - x1 if xCenter < x1
        // - x2 if xCenter > x2
        int closestX = Math.max(x1, Math.min(xCenter, x2));

        // Step 2: Find the closest y-coordinate on the rectangle to the circle center
        // Same logic as for x-coordinate
        int closestY = Math.max(y1, Math.min(yCenter, y2));

        // Step 3: Calculate squared distance from circle center to closest point
        // We avoid Math.sqrt for performance by comparing squared values
        int dx = closestX - xCenter;
        int dy = closestY - yCenter;
        int distanceSquared = dx * dx + dy * dy;

        // Step 4: Check if distance is within radius (compare squared values)
        // If distance² ≤ radius², the point is inside or on the circle
        return distanceSquared <= radius * radius;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform a constant number of operations: 4 comparisons (max/min), 4 subtractions, 3 multiplications, and 1 comparison
- No loops or recursion, so time is constant regardless of input size

**Space Complexity: O(1)**

- We use only a constant amount of extra space (a few variables to store intermediate results)
- No data structures that grow with input size

The efficiency comes from the mathematical insight that lets us compute the answer directly without iterating through points or checking multiple cases separately.

## Common Mistakes

1. **Only checking if circle center is inside rectangle**: This misses cases where the circle overlaps but its center is outside. For example, a large circle touching the rectangle from outside.

2. **Only checking rectangle corners**: A circle can intersect a rectangle edge without containing any corners. For instance, a circle centered just outside the midpoint of an edge.

3. **Using actual distance with square root**: Calculating `Math.sqrt(dx² + dy²) ≤ radius` works mathematically but is less efficient. Comparing squared values (`dx² + dy² ≤ radius²`) avoids the expensive square root operation.

4. **Misunderstanding rectangle coordinates**: Assuming (x1, y1) is top-left and (x2, y2) is bottom-right. The problem states (x1, y1) is bottom-left and (x2, y2) is top-right. This affects the clamping logic.

5. **Forgetting the "touching" case**: The problem considers touching as overlapping. Make sure to use `≤` not `<` when comparing distance to radius.

## When You'll See This Pattern

This "closest point" or "distance to bounded region" pattern appears in several geometry problems:

1. **Rectangle Overlap (LeetCode 836)**: Checking if two rectangles overlap uses similar coordinate comparison logic.

2. **Valid Square (LeetCode 593)**: Checking distances between points to determine if they form a square.

3. **Minimum Area Rectangle (LeetCode 939)**: Finding rectangles in a set of points involves coordinate comparisons.

4. **K Closest Points to Origin (LeetCode 973)**: While not exactly the same, it involves distance calculations and comparisons.

The core pattern is: when dealing with geometric shapes, often the optimal solution involves finding some representative point (like the closest point) and performing a simple calculation, rather than checking all boundary points or using complex intersection formulas.

## Key Takeaways

1. **Clamping coordinates is powerful**: The `max(min(value, upper), lower)` pattern efficiently finds the closest point on an axis-aligned rectangle to any given point. This works because x and y can be handled independently for axis-aligned shapes.

2. **Compare squared distances**: When checking if a distance is within a radius, compare squared values to avoid expensive square root operations. This optimization applies whenever you're comparing distances.

3. **Break down 2D problems into 1D**: By handling x and y coordinates separately, we simplify what seems like a complex 2D geometry problem into simple 1D comparisons.

Remember this approach whenever you need to check relationships between circles and axis-aligned rectangles—it's efficient, elegant, and handles all edge cases correctly.

[Practice this problem on CodeJeet](/problem/circle-and-rectangle-overlapping)
