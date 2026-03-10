---
title: "How to Solve Valid Boomerang — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Valid Boomerang. Easy difficulty, 39.2% acceptance rate. Topics: Array, Math, Geometry."
date: "2027-12-27"
category: "dsa-patterns"
tags: ["valid-boomerang", "array", "math", "geometry", "easy"]
---

# How to Solve Valid Boomerang

This problem asks us to determine if three given points form a "boomerang" — meaning they are all distinct points that don't lie on a straight line. While the problem seems simple at first glance, it's interesting because it tests your understanding of coordinate geometry and how to avoid floating-point precision issues in computational geometry problems. The tricky part is calculating slopes without running into division-by-zero errors or precision problems.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the points `[[1,1], [2,3], [3,2]]`:

1. **Check if points are distinct**: All three points have different coordinates, so they're distinct ✓

2. **Check if they're collinear (lie on a straight line)**:
   - We need to see if the slope between point 1 and point 2 equals the slope between point 2 and point 3
   - Slope formula: `(y2 - y1) / (x2 - x1)`
   - Slope between [1,1] and [2,3]: `(3-1)/(2-1) = 2/1 = 2`
   - Slope between [2,3] and [3,2]: `(2-3)/(3-2) = (-1)/1 = -1`
   - Since 2 ≠ -1, the points are NOT collinear ✓

3. **Conclusion**: These points form a valid boomerang!

Now let's look at a counterexample: `[[1,1], [2,2], [3,3]]`:

- All points are distinct ✓
- Slope between [1,1] and [2,2]: `(2-1)/(2-1) = 1/1 = 1`
- Slope between [2,2] and [3,3]: `(3-2)/(3-2) = 1/1 = 1`
- Since slopes are equal, points are collinear ✗
- This is NOT a valid boomerang.

## Brute Force Approach

A naive approach might try to calculate slopes directly using division. Here's what that would look like:

1. Check if all points are distinct
2. Calculate slope between points 0 and 1: `slope1 = (y1 - y0) / (x1 - x0)`
3. Calculate slope between points 1 and 2: `slope2 = (y2 - y1) / (x2 - x1)`
4. Return `true` if `slope1 ≠ slope2`

**Why this fails:**

- **Division by zero**: If `x1 - x0 = 0` or `x2 - x1 = 0`, we get a division error
- **Floating-point precision**: Comparing floating-point numbers for equality is unreliable due to rounding errors
- **Vertical lines**: Points with the same x-coordinate form vertical lines, which have undefined slope

## Optimal Solution

The optimal solution avoids division entirely by using cross multiplication. Instead of checking if `(y1-y0)/(x1-x0) = (y2-y1)/(x2-x1)`, we check if `(y1-y0)*(x2-x1) = (y2-y1)*(x1-x0)`. This eliminates division-by-zero issues and floating-point precision problems.

Additionally, we need to check if points are distinct. Three points are distinct if they're not all the same point.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def isBoomerang(points):
    """
    Check if three points form a valid boomerang.

    A valid boomerang requires:
    1. All three points are distinct
    2. The points are not collinear (don't lie on a straight line)

    We avoid division by using cross multiplication to check collinearity.
    """
    # Extract coordinates for better readability
    x1, y1 = points[0]
    x2, y2 = points[1]
    x3, y3 = points[2]

    # Check if points are distinct
    # Three points are the same if all coordinates match
    if (x1 == x2 and y1 == y2) or (x1 == x3 and y1 == y3) or (x2 == x3 and y2 == y3):
        return False

    # Check if points are collinear using cross multiplication
    # Instead of (y2-y1)/(x2-x1) == (y3-y2)/(x3-x2)
    # We check: (y2-y1)*(x3-x2) == (y3-y2)*(x2-x1)
    # This avoids division by zero and floating-point precision issues

    # Calculate differences
    dx1 = x2 - x1
    dy1 = y2 - y1
    dx2 = x3 - x2
    dy2 = y3 - y2

    # Check if slopes are equal using cross multiplication
    # If dy1/dx1 == dy2/dx2, then dy1*dx2 == dy2*dx1
    # Points are collinear if this equality holds
    return dy1 * dx2 != dy2 * dx1
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Check if three points form a valid boomerang.
 *
 * A valid boomerang requires:
 * 1. All three points are distinct
 * 2. The points are not collinear (don't lie on a straight line)
 *
 * We avoid division by using cross multiplication to check collinearity.
 */
function isBoomerang(points) {
  // Extract coordinates for better readability
  const [x1, y1] = points[0];
  const [x2, y2] = points[1];
  const [x3, y3] = points[2];

  // Check if points are distinct
  // Three points are the same if all coordinates match
  if ((x1 === x2 && y1 === y2) || (x1 === x3 && y1 === y3) || (x2 === x3 && y2 === y3)) {
    return false;
  }

  // Check if points are collinear using cross multiplication
  // Instead of (y2-y1)/(x2-x1) == (y3-y2)/(x3-x2)
  // We check: (y2-y1)*(x3-x2) == (y3-y2)*(x2-x1)
  // This avoids division by zero and floating-point precision issues

  // Calculate differences
  const dx1 = x2 - x1;
  const dy1 = y2 - y1;
  const dx2 = x3 - x2;
  const dy2 = y3 - y2;

  // Check if slopes are equal using cross multiplication
  // If dy1/dx1 == dy2/dx2, then dy1*dx2 == dy2*dx1
  // Points are collinear if this equality holds
  return dy1 * dx2 !== dy2 * dx1;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Check if three points form a valid boomerang.
     *
     * A valid boomerang requires:
     * 1. All three points are distinct
     * 2. The points are not collinear (don't lie on a straight line)
     *
     * We avoid division by using cross multiplication to check collinearity.
     */
    public boolean isBoomerang(int[][] points) {
        // Extract coordinates for better readability
        int x1 = points[0][0], y1 = points[0][1];
        int x2 = points[1][0], y2 = points[1][1];
        int x3 = points[2][0], y3 = points[2][1];

        // Check if points are distinct
        // Three points are the same if all coordinates match
        if ((x1 == x2 && y1 == y2) ||
            (x1 == x3 && y1 == y3) ||
            (x2 == x3 && y2 == y3)) {
            return false;
        }

        // Check if points are collinear using cross multiplication
        // Instead of (y2-y1)/(x2-x1) == (y3-y2)/(x3-x2)
        // We check: (y2-y1)*(x3-x2) == (y3-y2)*(x2-x1)
        // This avoids division by zero and floating-point precision issues

        // Calculate differences
        int dx1 = x2 - x1;
        int dy1 = y2 - y1;
        int dx2 = x3 - x2;
        int dy2 = y3 - y2;

        // Check if slopes are equal using cross multiplication
        // If dy1/dx1 == dy2/dx2, then dy1*dx2 == dy2*dx1
        // Points are collinear if this equality holds
        return dy1 * dx2 != dy2 * dx1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We only perform a constant number of arithmetic operations and comparisons
- Extracting coordinates: O(1)
- Checking point distinctness: O(1) comparisons
- Calculating differences and cross multiplication: O(1) arithmetic operations

**Space Complexity: O(1)**

- We only use a constant amount of extra space to store coordinates and differences
- No additional data structures that grow with input size
- All operations are done with primitive variables

## Common Mistakes

1. **Using direct slope comparison with division**: This leads to division-by-zero errors when points have the same x-coordinate (vertical lines). Always use cross multiplication instead.

2. **Incorrect distinctness check**: Some candidates only check if all three points are identical, but we need to check if ANY two points are identical. If two points are the same, it's not a valid boomerang even if the third is different.

3. **Floating-point precision errors**: Comparing `float` or `double` values for equality is unreliable. For example, `0.1 + 0.2 == 0.3` returns `false` in many languages due to binary representation issues.

4. **Forgetting to handle edge cases**: Always test with:
   - All points identical: `[[0,0],[0,0],[0,0]]` → should return `false`
   - Two points identical: `[[0,0],[0,0],[1,1]]` → should return `false`
   - Vertical line: `[[0,0],[0,1],[0,2]]` → should return `false`
   - Horizontal line: `[[0,0],[1,0],[2,0]]` → should return `false`

## When You'll See This Pattern

The cross multiplication technique for avoiding division is common in computational geometry problems:

1. **Check If It Is a Straight Line (LeetCode 1232)**: Same exact problem but with N points instead of 3. You check if all consecutive pairs have the same slope using cross multiplication.

2. **Max Points on a Line (LeetCode 149)**: A harder problem where you need to find the maximum number of points that lie on the same straight line. You use the same slope calculation approach but need to handle duplicate points and vertical lines carefully.

3. **Convex Polygon (LeetCode 469)**: When checking if a polygon is convex, you need to check the orientation of consecutive edges, which involves similar cross product calculations.

## Key Takeaways

1. **Avoid division in geometry problems**: Use cross multiplication to compare slopes without division. This handles vertical lines and avoids floating-point precision issues.

2. **Check edge cases systematically**: For geometry problems, always consider:
   - Duplicate points
   - Vertical and horizontal lines
   - Points with large coordinate values that might cause integer overflow

3. **Understand the math behind the code**: Knowing why `dy1/dx1 = dy2/dx2` implies `dy1*dx2 = dy2*dx1` helps you adapt the solution to similar problems.

[Practice this problem on CodeJeet](/problem/valid-boomerang)
