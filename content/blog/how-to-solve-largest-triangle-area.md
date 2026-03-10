---
title: "How to Solve Largest Triangle Area — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Largest Triangle Area. Easy difficulty, 71.5% acceptance rate. Topics: Array, Math, Geometry."
date: "2026-04-25"
category: "dsa-patterns"
tags: ["largest-triangle-area", "array", "math", "geometry", "easy"]
---

# How to Solve Largest Triangle Area

This problem asks us to find the largest possible triangle area that can be formed by selecting any three points from a given list of coordinates. While the problem is categorized as "Easy," it's interesting because it combines geometry with combinatorial search. The challenge isn't in finding a clever algorithm, but in efficiently implementing the mathematical formula and understanding how to explore all possible combinations.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Suppose we have points: `[[0,0], [0,1], [1,0], [1,1]]` (forming a unit square).

We need to check all combinations of 3 points:

1. Points (0,0), (0,1), (1,0): These form a right triangle with legs of length 1. Area = 0.5
2. Points (0,0), (0,1), (1,1): These form a right triangle with legs of length 1. Area = 0.5
3. Points (0,0), (1,0), (1,1): These form a right triangle with legs of length 1. Area = 0.5
4. Points (0,1), (1,0), (1,1): These form a right triangle with legs of length √2 and height √2/2. Area = 0.5

The maximum area is 0.5. Notice that the largest triangle comes from points that aren't collinear and are spread out as much as possible.

The key mathematical insight is the **shoelace formula** for triangle area:
Given points (x1,y1), (x2,y2), (x3,y3):
Area = 0.5 \* |x1(y2 - y3) + x2(y3 - y1) + x3(y1 - y2)|

The absolute value ensures positive area, and the 0.5 factor converts from parallelogram to triangle area.

## Brute Force Approach

The most straightforward approach is to check every possible combination of 3 points from the n points. For each combination, we calculate the area using the shoelace formula and keep track of the maximum.

Why is this brute force acceptable? Let's analyze:

- With n points, there are C(n,3) = n(n-1)(n-2)/6 combinations
- For n ≤ 50 (typical constraint), this is at most 50×49×48/6 = 19,600 combinations
- Each area calculation is O(1) time
- Total: O(n³) time complexity, which is fine for n ≤ 50

Actually, there's no more optimal solution than brute force for this problem since we must consider all combinations to guarantee finding the maximum. The "brute force" is the optimal solution here. A naive candidate might try to sort points or use other heuristics, but any three points could form the largest triangle, so we must check them all.

## Optimal Solution

Since we need to check all combinations, we'll use three nested loops to iterate through all possible triples of points. For each triple, we apply the shoelace formula and update our maximum area.

<div class="code-group">

```python
# Time: O(n³) where n is the number of points
# Space: O(1) - we only use a few variables
def largestTriangleArea(points):
    """
    Calculate the largest triangle area formed by any three points.

    Args:
        points: List[List[int]] - List of [x, y] coordinates

    Returns:
        float - Maximum triangle area
    """
    max_area = 0
    n = len(points)

    # Iterate through all combinations of 3 points
    # We use indices i, j, k to represent the three points
    for i in range(n):
        x1, y1 = points[i]

        for j in range(i + 1, n):
            x2, y2 = points[j]

            for k in range(j + 1, n):
                x3, y3 = points[k]

                # Apply the shoelace formula to calculate triangle area
                # Formula: 0.5 * |x1(y2 - y3) + x2(y3 - y1) + x3(y1 - y2)|
                area = 0.5 * abs(
                    x1 * (y2 - y3) +
                    x2 * (y3 - y1) +
                    x3 * (y1 - y2)
                )

                # Update maximum area if current area is larger
                if area > max_area:
                    max_area = area

    return max_area
```

```javascript
// Time: O(n³) where n is the number of points
// Space: O(1) - we only use a few variables
function largestTriangleArea(points) {
  /**
   * Calculate the largest triangle area formed by any three points.
   *
   * @param {number[][]} points - Array of [x, y] coordinates
   * @return {number} - Maximum triangle area
   */
  let maxArea = 0;
  const n = points.length;

  // Iterate through all combinations of 3 points
  // We use indices i, j, k to represent the three points
  for (let i = 0; i < n; i++) {
    const [x1, y1] = points[i];

    for (let j = i + 1; j < n; j++) {
      const [x2, y2] = points[j];

      for (let k = j + 1; k < n; k++) {
        const [x3, y3] = points[k];

        // Apply the shoelace formula to calculate triangle area
        // Formula: 0.5 * |x1(y2 - y3) + x2(y3 - y1) + x3(y1 - y2)|
        const area = 0.5 * Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));

        // Update maximum area if current area is larger
        if (area > maxArea) {
          maxArea = area;
        }
      }
    }
  }

  return maxArea;
}
```

```java
// Time: O(n³) where n is the number of points
// Space: O(1) - we only use a few variables
class Solution {
    public double largestTriangleArea(int[][] points) {
        /**
         * Calculate the largest triangle area formed by any three points.
         *
         * @param points: int[][] - Array of [x, y] coordinates
         * @return double - Maximum triangle area
         */
        double maxArea = 0;
        int n = points.length;

        // Iterate through all combinations of 3 points
        // We use indices i, j, k to represent the three points
        for (int i = 0; i < n; i++) {
            int x1 = points[i][0];
            int y1 = points[i][1];

            for (int j = i + 1; j < n; j++) {
                int x2 = points[j][0];
                int y2 = points[j][1];

                for (int k = j + 1; k < n; k++) {
                    int x3 = points[k][0];
                    int y3 = points[k][1];

                    // Apply the shoelace formula to calculate triangle area
                    // Formula: 0.5 * |x1(y2 - y3) + x2(y3 - y1) + x3(y1 - y2)|
                    double area = 0.5 * Math.abs(
                        x1 * (y2 - y3) +
                        x2 * (y3 - y1) +
                        x3 * (y1 - y2)
                    );

                    // Update maximum area if current area is larger
                    if (area > maxArea) {
                        maxArea = area;
                    }
                }
            }
        }

        return maxArea;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n³)**

- We have three nested loops that iterate through all combinations of 3 points
- The outer loop runs n times
- The middle loop runs approximately n/2 times on average
- The inner loop runs approximately n/3 times on average
- Total combinations: n(n-1)(n-2)/6 ∈ O(n³)
- Each combination requires O(1) time to compute the area

**Space Complexity: O(1)**

- We only use a constant amount of extra space:
  - Variables to store coordinates (x1, y1, etc.)
  - Variables to store current and maximum area
  - Loop counters
- No additional data structures are needed

## Common Mistakes

1. **Forgetting the absolute value in the shoelace formula**: The shoelace formula can produce negative values depending on the order of points (clockwise vs. counterclockwise). Always take the absolute value to ensure positive area.

2. **Using the wrong loop indices**: When checking combinations, ensure j starts from i+1 and k starts from j+1. This avoids checking the same combination multiple times (e.g., (1,2,3) and (3,2,1)) and ensures we don't use the same point twice.

3. **Integer division issues**: In languages like Python 2 or Java with integer arithmetic, be careful with division. Use 0.5 (float) instead of 1/2 (integer division). In our formula, we multiply by 0.5 at the end to avoid precision issues.

4. **Not handling collinear points correctly**: The shoelace formula naturally handles collinear points (area = 0), so no special handling is needed. Some candidates try to add extra checks, which are unnecessary.

5. **Assuming points need to be sorted**: The largest triangle could be formed by any three points, not necessarily the "extreme" points. Don't waste time sorting or trying to find convex hulls unnecessarily.

## When You'll See This Pattern

This problem uses the **exhaustive search** or **brute force combination** pattern, which appears when:

1. The input size is small enough (typically n ≤ 50)
2. You need to consider all possible subsets or combinations
3. There's no obvious mathematical property to optimize

Related problems that use similar patterns:

1. **Largest Perimeter Triangle (Easy)**: Find three lengths that can form a triangle with the largest perimeter. Also uses triple nested loops to check combinations.

2. **Maximum Product of Three Numbers (Easy)**: Find three numbers in an array that yield the maximum product. Similar combinatorial search.

3. **3Sum (Medium)**: Find all unique triplets that sum to zero. Uses sorting and two pointers, but fundamentally deals with triple combinations.

4. **Valid Triangle Number (Medium)**: Count the number of triplets that can form triangles. Uses sorting and binary search or two pointers.

## Key Takeaways

1. **When n is small (≤ 50), O(n³) brute force is acceptable**: Don't overcomplicate problems with small constraints. Sometimes the straightforward solution is the right one.

2. **The shoelace formula is versatile for polygon areas**: Memorize this formula as it appears in various geometry problems. For triangles: Area = 0.5 × |x1(y2−y3) + x2(y3−y1) + x3(y1−y2)|

3. **Combination loops should use increasing indices**: When checking all combinations of k items from n, use nested loops where each inner loop starts from the previous index + 1. This ensures each combination is checked exactly once.

4. **Geometry problems often have precision requirements**: The problem accepts answers within 10⁻⁵, so using double/float precision is sufficient. No need for arbitrary precision arithmetic.

Related problems: [Largest Perimeter Triangle](/problem/largest-perimeter-triangle)
