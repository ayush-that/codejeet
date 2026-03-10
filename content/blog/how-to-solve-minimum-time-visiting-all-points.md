---
title: "How to Solve Minimum Time Visiting All Points — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Time Visiting All Points. Easy difficulty, 84.8% acceptance rate. Topics: Array, Math, Geometry."
date: "2027-07-26"
category: "dsa-patterns"
tags: ["minimum-time-visiting-all-points", "array", "math", "geometry", "easy"]
---

# How to Solve Minimum Time Visiting All Points

This problem asks us to find the minimum time to visit a sequence of points on a 2D grid, where we can move vertically, horizontally, or diagonally at the same speed (one unit per second). The interesting twist is that diagonal moves let us cover both horizontal and vertical distance simultaneously, making this fundamentally a problem about finding the **Chebyshev distance** between consecutive points rather than Euclidean or Manhattan distance.

## Visual Walkthrough

Let's trace through a concrete example: `points = [[1,1],[3,4],[-1,0]]`

**Step 1: From [1,1] to [3,4]**

- Horizontal distance: |3 - 1| = 2 units
- Vertical distance: |4 - 1| = 3 units
- We can move diagonally for min(2, 3) = 2 seconds, covering 2 units in both directions
- Remaining vertical distance: 3 - 2 = 1 unit
- Total time: 2 (diagonal) + 1 (vertical) = 3 seconds

**Step 2: From [3,4] to [-1,0]**

- Horizontal distance: |(-1) - 3| = 4 units
- Vertical distance: |0 - 4| = 4 units
- We can move diagonally for min(4, 4) = 4 seconds, covering all distance
- Total time: 4 seconds

**Total minimum time**: 3 + 4 = 7 seconds

Notice the pattern: The time between two points equals the **maximum** of the horizontal and vertical distances. Why? Because diagonal moves let us cover both dimensions simultaneously until one dimension reaches its target, then we finish with straight moves in the remaining dimension.

## Brute Force Approach

A naive approach might try to simulate every possible path between points, but that's unnecessary. Some candidates might incorrectly try to:

1. Always move diagonally first, then straight (which is actually correct, but they might overcomplicate it)
2. Calculate Euclidean distance (√(dx² + dy²)) which doesn't account for diagonal moves
3. Calculate Manhattan distance (|dx| + |dy|) which assumes no diagonal moves

The key insight is that the optimal path always uses as many diagonal moves as possible, and the time equals max(|dx|, |dy|). There's no brute force that makes sense here — either you recognize the pattern or you don't.

## Optimal Solution

The solution is elegantly simple: for each consecutive pair of points, calculate the absolute differences in x and y coordinates, take the maximum of these two values, and sum them up.

<div class="code-group">

```python
# Time: O(n) where n is number of points
# Space: O(1) - only using constant extra space
def minTimeToVisitAllPoints(points):
    """
    Calculate minimum time to visit all points in sequence.

    The key insight: moving diagonally covers both horizontal and vertical
    distance simultaneously. The time between two points equals the
    maximum of their horizontal and vertical separation.

    Args:
        points: List of [x, y] coordinate pairs

    Returns:
        Minimum time in seconds to visit all points
    """
    total_time = 0

    # Iterate through consecutive point pairs
    for i in range(len(points) - 1):
        # Current point coordinates
        x1, y1 = points[i]
        # Next point coordinates
        x2, y2 = points[i + 1]

        # Calculate absolute differences in x and y
        dx = abs(x2 - x1)
        dy = abs(y2 - y1)

        # Time to travel between these points is max(dx, dy)
        # Why? We can move diagonally for min(dx, dy) seconds,
        # then move straight in the remaining dimension for |dx - dy| seconds
        # Total = min(dx, dy) + |dx - dy| = max(dx, dy)
        total_time += max(dx, dy)

    return total_time
```

```javascript
// Time: O(n) where n is number of points
// Space: O(1) - only using constant extra space
function minTimeToVisitAllPoints(points) {
  /**
   * Calculate minimum time to visit all points in sequence.
   *
   * The key insight: moving diagonally covers both horizontal and vertical
   * distance simultaneously. The time between two points equals the
   * maximum of their horizontal and vertical separation.
   *
   * @param {number[][]} points - Array of [x, y] coordinate pairs
   * @return {number} Minimum time in seconds to visit all points
   */
  let totalTime = 0;

  // Iterate through consecutive point pairs
  for (let i = 0; i < points.length - 1; i++) {
    // Current point coordinates
    const [x1, y1] = points[i];
    // Next point coordinates
    const [x2, y2] = points[i + 1];

    // Calculate absolute differences in x and y
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    // Time to travel between these points is max(dx, dy)
    // Why? We can move diagonally for min(dx, dy) seconds,
    // then move straight in the remaining dimension for |dx - dy| seconds
    // Total = min(dx, dy) + |dx - dy| = max(dx, dy)
    totalTime += Math.max(dx, dy);
  }

  return totalTime;
}
```

```java
// Time: O(n) where n is number of points
// Space: O(1) - only using constant extra space
class Solution {
    /**
     * Calculate minimum time to visit all points in sequence.
     *
     * The key insight: moving diagonally covers both horizontal and vertical
     * distance simultaneously. The time between two points equals the
     * maximum of their horizontal and vertical separation.
     *
     * @param points Array of [x, y] coordinate pairs
     * @return Minimum time in seconds to visit all points
     */
    public int minTimeToVisitAllPoints(int[][] points) {
        int totalTime = 0;

        // Iterate through consecutive point pairs
        for (int i = 0; i < points.length - 1; i++) {
            // Current point coordinates
            int x1 = points[i][0];
            int y1 = points[i][1];
            // Next point coordinates
            int x2 = points[i + 1][0];
            int y2 = points[i + 1][1];

            // Calculate absolute differences in x and y
            int dx = Math.abs(x2 - x1);
            int dy = Math.abs(y2 - y1);

            // Time to travel between these points is max(dx, dy)
            // Why? We can move diagonally for min(dx, dy) seconds,
            // then move straight in the remaining dimension for |dx - dy| seconds
            // Total = min(dx, dy) + |dx - dy| = max(dx, dy)
            totalTime += Math.max(dx, dy);
        }

        return totalTime;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the points array once, processing each consecutive pair
- For each pair, we perform constant-time operations: subtraction, absolute value, maximum, and addition
- If there are n points, we have n-1 pairs to process

**Space Complexity: O(1)**

- We only use a few integer variables (`total_time`, `dx`, `dy`, loop counter)
- No additional data structures that scale with input size
- The input array is given and not counted toward our space usage

## Common Mistakes

1. **Using Manhattan distance (|dx| + |dy|) instead of max(|dx|, |dy|)**
   - This assumes you can't move diagonally, which doubles the time in some cases
   - Example: From (0,0) to (3,3): Manhattan = 6, but correct answer = 3
   - **Fix**: Remember diagonal moves cover both dimensions simultaneously

2. **Forgetting to use absolute values**
   - Calculating `x2 - x1` without `abs()` gives negative values for leftward moves
   - `max()` with negative values gives wrong results
   - **Fix**: Always take absolute value of coordinate differences

3. **Incorrect loop bounds**
   - Going from `i = 0` to `i < points.length` causes index out of bounds when accessing `points[i+1]`
   - **Fix**: Loop until `i < points.length - 1` or `i = 1` to `i < points.length`

4. **Overcomplicating with simulation**
   - Some candidates try to simulate step-by-step movement with while loops
   - This works but is unnecessarily complex (O(max(dx, dy)) per pair vs O(1))
   - **Fix**: Recognize the mathematical formula: `max(|dx|, |dy|)`

## When You'll See This Pattern

This problem teaches the **Chebyshev distance** (also called chessboard distance or L∞ metric), which is useful in several contexts:

1. **Grid-based movement with 8-direction movement** (like a king in chess)
   - Related problem: [Minimum Moves to Equal Array Elements II](https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/) - finding median minimizes L1 distance, but similar optimization thinking

2. **Geometry problems with diagonal movement**
   - Related problem: [Minimum Operations to Make Array Equal](https://leetcode.com/problems/minimum-operations-to-make-array-equal/) - similar pattern of minimizing distance

3. **Pathfinding on grids with varied movement costs**
   - While not identical, understanding different distance metrics (Euclidean, Manhattan, Chebyshev) helps in problems like [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)

The core pattern is recognizing when you can make progress in multiple dimensions simultaneously, which changes the distance calculation from additive to based on the limiting dimension.

## Key Takeaways

1. **Diagonal movement is powerful** - It lets you cover horizontal and vertical distance at the same time, making the travel time equal to the maximum dimension difference, not the sum.

2. **Chebyshev distance formula** - For grid movement with 8 directions, distance = max(|dx|, |dy|). This is different from Manhattan distance (|dx| + |dy|) for 4-direction movement or Euclidean distance (√(dx² + dy²)) for straight-line movement.

3. **Look for mathematical simplifications** - Instead of simulating movement step-by-step, often there's a direct formula. When you see "minimum time" or "minimum moves" with flexible movement rules, consider if there's a distance metric that captures the movement capabilities.

[Practice this problem on CodeJeet](/problem/minimum-time-visiting-all-points)
