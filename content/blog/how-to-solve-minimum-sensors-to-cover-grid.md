---
title: "How to Solve Minimum Sensors to Cover Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Sensors to Cover Grid. Medium difficulty, 68.7% acceptance rate. Topics: Math."
date: "2029-05-21"
category: "dsa-patterns"
tags: ["minimum-sensors-to-cover-grid", "math", "medium"]
---

# How to Solve Minimum Sensors to Cover Grid

This problem asks us to place the minimum number of sensors on an `n × m` grid such that every cell is covered. A sensor placed at `(r, c)` covers all cells within Chebyshev distance `k`, meaning it covers a square region of side length `2k+1` centered at the sensor. The challenge is that sensors can cover large overlapping areas, and we need to find the optimal placement strategy to minimize the total count while ensuring complete coverage.

What makes this problem interesting is that it appears to be a complex coverage problem, but it actually reduces to a simple mathematical formula once you understand the geometry of Chebyshev distance coverage.

## Visual Walkthrough

Let's walk through a concrete example: `n = 5, m = 7, k = 2`

A sensor with `k = 2` covers a 5×5 square (since `2k+1 = 5`). Let's visualize how we can cover the grid:

```
Grid: 5 rows × 7 columns
Sensor coverage: 5×5 square

One approach: Place sensors in a grid pattern
If we place a sensor at (2, 2), it covers rows 0-4, columns 0-4
But we need to cover column 6 too...

Better approach: Think about how many sensors we need in each dimension:
- Each sensor covers 5 rows
- We have 5 total rows
- So we need ceil(5/5) = 1 sensor in the row dimension

- Each sensor covers 5 columns
- We have 7 total columns
- So we need ceil(7/5) = 2 sensors in the column dimension

Total sensors: 1 × 2 = 2

Let's verify:
Sensor 1 at (2, 2): covers rows 0-4, columns 0-4
Sensor 2 at (2, 5): covers rows 0-4, columns 3-7
Together they cover all 5 rows and all 7 columns!
```

The key insight is that Chebyshev distance creates axis-aligned square coverage, so we can treat the row and column dimensions independently.

## Brute Force Approach

A naive approach would be to try all possible placements of sensors. For an `n × m` grid, there are `n × m` possible positions for each sensor. If we try placing `s` sensors, there are `(n × m)^s` possible configurations to check. We'd need to check if each configuration covers all cells, which takes `O(s × (2k+1)² × n × m)` time in the worst case.

Even for small grids, this approach becomes intractable quickly. For example, with `n = m = 10` and `k = 2`, trying all placements of just 4 sensors would mean checking `100^4 = 100,000,000` configurations!

The brute force approach fails because:

1. Exponential time complexity
2. Doesn't leverage the geometric structure of the problem
3. Tries many redundant configurations

## Optimized Approach

The key insight is that **Chebyshev distance coverage decomposes into independent row and column coverage**.

Think about it this way:

- A sensor covers `2k+1` consecutive rows centered at its row position
- A sensor covers `2k+1` consecutive columns centered at its column position
- To cover all rows, we need to place sensors so their row coverage intervals overlap to cover `[0, n-1]`
- To cover all columns, we need to place sensors so their column coverage intervals overlap to cover `[0, m-1]`

This becomes two separate 1D coverage problems:

1. How many sensors needed to cover n rows if each covers 2k+1 rows?
2. How many sensors needed to cover m columns if each covers 2k+1 columns?

For a 1D line of length L where each sensor covers length C:

- The minimum number of sensors is `ceil(L / C)`
- We can place them at positions: `C/2, 3C/2, 5C/2, ...` (centered in their coverage intervals)

Therefore:

- Sensors needed for rows: `ceil(n / (2k+1))`
- Sensors needed for columns: `ceil(m / (2k+1))`
- Total sensors: `ceil(n / (2k+1)) × ceil(m / (2k+1))`

This works because we can create a grid of sensors where the row positions are spaced `2k+1` apart and column positions are spaced `2k+1` apart.

## Optimal Solution

The solution is straightforward once we understand the mathematical insight. We simply calculate how many sensors we need in each dimension and multiply them together.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def minSensors(n, m, k):
    """
    Calculate minimum sensors needed to cover an n x m grid
    with sensors covering Chebyshev distance k.

    Args:
        n: number of rows
        m: number of columns
        k: coverage radius (Chebyshev distance)

    Returns:
        Minimum number of sensors required
    """
    # Each sensor covers 2k+1 consecutive rows and 2k+1 consecutive columns
    coverage = 2 * k + 1

    # Calculate sensors needed for rows: ceil(n / coverage)
    # Using integer math: (n + coverage - 1) // coverage gives ceil division
    rows_needed = (n + coverage - 1) // coverage

    # Calculate sensors needed for columns: ceil(m / coverage)
    cols_needed = (m + coverage - 1) // coverage

    # Total sensors is product of row and column sensors
    return rows_needed * cols_needed
```

```javascript
// Time: O(1) | Space: O(1)
function minSensors(n, m, k) {
  /**
   * Calculate minimum sensors needed to cover an n x m grid
   * with sensors covering Chebyshev distance k.
   *
   * @param {number} n - number of rows
   * @param {number} m - number of columns
   * @param {number} k - coverage radius (Chebyshev distance)
   * @return {number} Minimum number of sensors required
   */

  // Each sensor covers 2k+1 consecutive rows and 2k+1 consecutive columns
  const coverage = 2 * k + 1;

  // Calculate sensors needed for rows: ceil(n / coverage)
  // Using Math.ceil for clarity
  const rowsNeeded = Math.ceil(n / coverage);

  // Calculate sensors needed for columns: ceil(m / coverage)
  const colsNeeded = Math.ceil(m / coverage);

  // Total sensors is product of row and column sensors
  return rowsNeeded * colsNeeded;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int minSensors(int n, int m, int k) {
        /**
         * Calculate minimum sensors needed to cover an n x m grid
         * with sensors covering Chebyshev distance k.
         *
         * @param n - number of rows
         * @param m - number of columns
         * @param k - coverage radius (Chebyshev distance)
         * @return Minimum number of sensors required
         */

        // Each sensor covers 2k+1 consecutive rows and 2k+1 consecutive columns
        int coverage = 2 * k + 1;

        // Calculate sensors needed for rows: ceil(n / coverage)
        // Using integer math: (n + coverage - 1) / coverage gives ceil division
        int rowsNeeded = (n + coverage - 1) / coverage;

        // Calculate sensors needed for columns: ceil(m / coverage)
        int colsNeeded = (m + coverage - 1) / coverage;

        // Total sensors is product of row and column sensors
        return rowsNeeded * colsNeeded;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We perform a constant number of arithmetic operations regardless of input size
- The calculations don't depend on n or m in a way that scales with their values

**Space Complexity:** O(1)

- We only use a few integer variables
- No data structures that grow with input size

The constant time complexity makes this solution extremely efficient even for very large grids (up to the limits of integer arithmetic).

## Common Mistakes

1. **Using Euclidean distance instead of Chebyshev distance**: Some candidates mistakenly think the sensor covers a circular area (Euclidean distance ≤ k) instead of a square area (Chebyshev distance ≤ k). Chebyshev distance creates axis-aligned squares, which is crucial for the decomposition into independent row and column coverage.

2. **Off-by-one errors in coverage calculation**: The coverage of a sensor is `2k+1`, not `2k`. A sensor at position `(r, c)` covers rows `[r-k, r+k]` inclusive, which contains `(r+k) - (r-k) + 1 = 2k+1` rows. Forgetting the `+1` leads to incorrect results.

3. **Integer division instead of ceiling division**: Using `n // (2k+1)` instead of `ceil(n / (2k+1))` gives wrong results when the grid dimensions aren't multiples of the coverage. For example, if `n=5` and coverage=4, we need 2 sensors (ceil(5/4)=2), not 1 (5//4=1).

4. **Overcomplicating with DP or greedy algorithms**: Some candidates try to use dynamic programming or complex greedy algorithms when a simple mathematical formula exists. Recognizing when a problem has a closed-form solution is an important interview skill.

## When You'll See This Pattern

This problem teaches the pattern of **dimensionality reduction through independent axis consideration**. When coverage or movement is axis-aligned or decomposes along dimensions, you can often solve each dimension separately.

Related problems:

1. **LeetCode 452. Minimum Number of Arrows to Burst Balloons** - Similar interval covering concept, but with 1D intervals instead of 2D coverage.

2. **LeetCode 1024. Video Stitching** - Another coverage problem where you need to cover an interval with available segments.

3. **LeetCode 55. Jump Game** - While not exactly the same, it involves covering positions with a certain reach, which requires similar reasoning about coverage intervals.

4. **Grid coverage problems with Manhattan distance** - Problems where movement or coverage uses Manhattan distance (L1 norm) often require different approaches since Manhattan distance doesn't decompose as cleanly into independent dimensions.

## Key Takeaways

1. **Chebyshev distance creates square coverage areas** that are axis-aligned. This allows you to treat row and column coverage as independent 1D problems.

2. **When a problem seems complex in 2D, check if it decomposes into 1D problems**. Many grid problems become simpler when you realize operations along rows and columns are independent.

3. **Ceil division is crucial for coverage problems**. When covering a length L with segments of length C, you need ceil(L/C) segments, not floor(L/C). The formula `(L + C - 1) // C` gives integer ceil division without floating point.

4. **Sometimes the optimal solution is mathematical, not algorithmic**. Recognizing when a problem has a closed-form solution can save you from implementing unnecessary complex algorithms.

[Practice this problem on CodeJeet](/problem/minimum-sensors-to-cover-grid)
