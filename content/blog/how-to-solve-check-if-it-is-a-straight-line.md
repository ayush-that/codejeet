---
title: "How to Solve Check If It Is a Straight Line — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check If It Is a Straight Line. Easy difficulty, 40.0% acceptance rate. Topics: Array, Math, Geometry."
date: "2028-01-01"
category: "dsa-patterns"
tags: ["check-if-it-is-a-straight-line", "array", "math", "geometry", "easy"]
---

# How to Solve "Check If It Is a Straight Line"

This problem asks us to determine whether a set of points all lie on the same straight line. While it seems simple mathematically, the implementation has several subtle pitfalls that make it trickier than it appears. The main challenge is handling edge cases like vertical lines, duplicate points, and floating-point precision issues without making the code overly complex.

## Visual Walkthrough

Let's trace through an example: `coordinates = [[1,2],[2,3],[3,4],[4,5]]`

These points appear to form a straight line, but how do we verify this programmatically?

The key insight is that for any three points to be collinear (on the same line), the slope between the first two points must equal the slope between any other pair. However, we need to be careful with vertical lines where the slope would be undefined (division by zero).

Let's calculate:

- Slope between point 1 (1,2) and point 2 (2,3): (3-2)/(2-1) = 1/1 = 1
- Slope between point 1 (1,2) and point 3 (3,4): (4-2)/(3-1) = 2/2 = 1
- Slope between point 1 (1,2) and point 4 (4,5): (5-2)/(4-1) = 3/3 = 1

All slopes are equal, so these points form a straight line.

Now consider a counterexample: `coordinates = [[1,1],[2,2],[2,0],[3,3]]`

- Slope between (1,1) and (2,2): (2-1)/(2-1) = 1
- Slope between (1,1) and (2,0): (0-1)/(2-1) = -1
- The slopes differ, so these points don't form a straight line.

## Brute Force Approach

A naive approach would be to calculate the slope between every pair of points and check if they're all equal. For n points, we'd need to check C(n,2) = n(n-1)/2 pairs, giving us O(n²) time complexity. We'd also need to handle special cases for vertical lines separately.

However, there's a simpler brute force: for each point after the first two, check if it lies on the line defined by the first two points. This is still O(n) but has precision issues when using floating-point division to calculate slopes.

The main problem with the naive approach using floating-point division is precision. Due to how computers represent floating-point numbers, `(y2-y1)/(x2-x1)` might not exactly equal `(y3-y1)/(x3-x1)` even when mathematically they should be equal. For example, `1/3` in floating-point isn't exactly representable.

## Optimal Solution

Instead of comparing slopes directly using division, we can use cross-multiplication to avoid floating-point precision issues. For points (x1,y1), (x2,y2), and (x3,y3) to be collinear, the following must be true:

`(y2 - y1) * (x3 - x1) = (y3 - y1) * (x2 - x1)`

This formula comes from comparing the slopes without division. If the line is vertical (x2 = x1), the left side becomes `(y2 - y1) * (x3 - x1)` and the right side becomes `(y3 - y1) * 0 = 0`, so we check if `x3 = x1` for all points.

Here's the optimal solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def checkStraightLine(coordinates):
    """
    Check if all points lie on the same straight line.

    Args:
        coordinates: List of [x, y] points

    Returns:
        True if all points are collinear, False otherwise
    """
    # If we have 2 or fewer points, they always form a straight line
    if len(coordinates) <= 2:
        return True

    # Get the first two points as reference
    x1, y1 = coordinates[0]
    x2, y2 = coordinates[1]

    # Check all other points against the line formed by the first two points
    for i in range(2, len(coordinates)):
        x3, y3 = coordinates[i]

        # Using cross-multiplication to avoid floating-point precision issues
        # Check if (y2 - y1)/(x2 - x1) == (y3 - y1)/(x3 - x1)
        # Equivalent to: (y2 - y1) * (x3 - x1) == (y3 - y1) * (x2 - x1)
        if (y2 - y1) * (x3 - x1) != (y3 - y1) * (x2 - x1):
            return False

    return True
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Check if all points lie on the same straight line.
 * @param {number[][]} coordinates - Array of [x, y] points
 * @return {boolean} True if all points are collinear, False otherwise
 */
function checkStraightLine(coordinates) {
  // If we have 2 or fewer points, they always form a straight line
  if (coordinates.length <= 2) {
    return true;
  }

  // Get the first two points as reference
  const [x1, y1] = coordinates[0];
  const [x2, y2] = coordinates[1];

  // Check all other points against the line formed by the first two points
  for (let i = 2; i < coordinates.length; i++) {
    const [x3, y3] = coordinates[i];

    // Using cross-multiplication to avoid floating-point precision issues
    // Check if (y2 - y1)/(x2 - x1) == (y3 - y1)/(x3 - x1)
    // Equivalent to: (y2 - y1) * (x3 - x1) == (y3 - y1) * (x2 - x1)
    if ((y2 - y1) * (x3 - x1) !== (y3 - y1) * (x2 - x1)) {
      return false;
    }
  }

  return true;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Check if all points lie on the same straight line.
     * @param coordinates Array of [x, y] points
     * @return True if all points are collinear, False otherwise
     */
    public boolean checkStraightLine(int[][] coordinates) {
        // If we have 2 or fewer points, they always form a straight line
        if (coordinates.length <= 2) {
            return true;
        }

        // Get the first two points as reference
        int x1 = coordinates[0][0];
        int y1 = coordinates[0][1];
        int x2 = coordinates[1][0];
        int y2 = coordinates[1][1];

        // Check all other points against the line formed by the first two points
        for (int i = 2; i < coordinates.length; i++) {
            int x3 = coordinates[i][0];
            int y3 = coordinates[i][1];

            // Using cross-multiplication to avoid floating-point precision issues
            // Check if (y2 - y1)/(x2 - x1) == (y3 - y1)/(x3 - x1)
            // Equivalent to: (y2 - y1) * (x3 - x1) == (y3 - y1) * (x2 - x1)
            if ((y2 - y1) * (x3 - x1) != (y3 - y1) * (x2 - x1)) {
                return false;
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n), where n is the number of points. We iterate through the points once, performing constant-time operations for each point after the first two.

**Space Complexity:** O(1). We only use a constant amount of extra space to store the coordinates of the first two points and the current point being checked.

The key to achieving O(n) time is that we only need to compare each point against the line defined by the first two points, rather than comparing every pair of points.

## Common Mistakes

1. **Using floating-point division for slope comparison**: This leads to precision errors. For example, `(4-1)/(4-1) = 1.0` but `(5-2)/(5-2)` might compute as `0.9999999999999999` due to floating-point representation. Always use cross-multiplication instead.

2. **Not handling vertical lines properly**: When `x2 - x1 = 0`, dividing by zero causes an error. The cross-multiplication approach handles this naturally because if `x2 = x1`, the equation becomes `(y2 - y1) * (x3 - x1) = (y3 - y1) * 0`, which simplifies to checking if `x3 = x1` for all points.

3. **Forgetting the edge case of 0 or 1 point**: While the problem guarantees at least 2 points, it's good practice to handle edge cases. With 0 or 1 point, they trivially form a straight line. With exactly 2 points, they always form a straight line.

4. **Using the wrong reference points**: Some candidates try to compare each point with its immediate neighbor, but this fails for cases like `[[0,0],[1,1],[1,2],[2,2]]` where each consecutive pair has slope 1, but the points don't all lie on the same line. Always use a fixed reference (the first two points).

## When You'll See This Pattern

The cross-multiplication technique for avoiding floating-point comparison appears in several geometry problems:

1. **Max Points on a Line (LeetCode 149)**: This is essentially the harder version of this problem, where you need to find the maximum number of points that lie on the same straight line. You'll use the same slope comparison logic but need to handle duplicate points and track counts.

2. **Valid Square (LeetCode 593)**: When checking if four points form a square, you need to compare distances and slopes between points, often using cross-multiplication to avoid precision issues.

3. **Rectangle Area (LeetCode 223)**: While not exactly the same, this problem involves coordinate geometry where precise comparisons are important.

The pattern of transforming division comparisons into multiplication comparisons to avoid precision issues is useful whenever you're working with ratios or slopes in programming problems.

## Key Takeaways

1. **Avoid floating-point division in equality comparisons**: When comparing slopes or ratios, use cross-multiplication to transform `a/b == c/d` into `a*d == b*c`. This eliminates precision issues and division-by-zero errors.

2. **Use a fixed reference for linearity checks**: To verify if multiple points are collinear, compare each point against the line defined by the first two points rather than comparing consecutive points.

3. **Geometry problems often have simple mathematical solutions**: Many seemingly complex geometry problems reduce to applying the right formula. In interviews, explaining the mathematical reasoning before coding demonstrates strong problem-solving skills.

[Practice this problem on CodeJeet](/problem/check-if-it-is-a-straight-line)
