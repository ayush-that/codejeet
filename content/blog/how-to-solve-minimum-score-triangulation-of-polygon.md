---
title: "How to Solve Minimum Score Triangulation of Polygon — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Score Triangulation of Polygon. Medium difficulty, 67.4% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-11-05"
category: "dsa-patterns"
tags: ["minimum-score-triangulation-of-polygon", "array", "dynamic-programming", "medium"]
---

# How to Solve Minimum Score Triangulation of Polygon

You're given a convex polygon represented by vertex values in clockwise order. Your task is to triangulate it (divide into triangles) such that the sum of the product of each triangle's three vertices is minimized. The challenge is that there are many possible triangulations, and we need to find the optimal one efficiently.

What makes this problem interesting is that it's a classic dynamic programming problem disguised as a geometry puzzle. The "convex" condition is crucial—it means any diagonal between non-adjacent vertices will lie entirely inside the polygon, making the problem tractable.

## Visual Walkthrough

Let's trace through a concrete example: `values = [1, 3, 1, 4, 1, 5]`

We have a 6-sided polygon with vertices labeled 0 through 5. Our goal is to find the minimum triangulation score.

**Key insight**: When we pick any triangle in the triangulation, it splits the polygon into smaller polygons. For example, if we pick triangle (0, 2, 5), we get:

- Left polygon: vertices 0, 1, 2
- Right polygon: vertices 2, 3, 4, 5

The score for triangle (i, j, k) is `values[i] * values[j] * values[k]`. The total score is this triangle's score plus the scores of triangulating the left and right polygons.

Let's think about the smallest case: a triangle (3 vertices). It's already triangulated with score 0 since it's just one triangle.

For 4 vertices (0, 1, 2, 3), we have two possible diagonals:

- Diagonal (0, 2): Creates triangles (0, 1, 2) and (0, 2, 3)
- Diagonal (1, 3): Creates triangles (0, 1, 3) and (1, 2, 3)

We need to pick the minimum of these two options.

This suggests a dynamic programming approach where `dp[i][j]` represents the minimum score to triangulate the polygon from vertex `i` to vertex `j`.

## Brute Force Approach

A naive approach would be to try all possible triangulations. For an n-sided polygon, the number of triangulations is the (n-2)th Catalan number, which grows exponentially (approximately O(4ⁿ/n^(3/2))). This is clearly infeasible for n up to 50 as specified in the problem constraints.

Even if we tried to implement this recursively, we'd have something like:

```
function minScore(i, j):
    if j - i < 2: return 0  # Not a valid polygon
    minScore = INF
    for k from i+1 to j-1:
        score = values[i] * values[k] * values[j] +
                minScore(i, k) +
                minScore(k, j)
        minScore = min(minScore, score)
    return minScore
```

This has exponential time complexity due to repeated calculations of the same subproblems.

## Optimized Approach

The key insight is that this problem has **optimal substructure** and **overlapping subproblems**—the hallmarks of dynamic programming.

**Optimal substructure**: The optimal triangulation of a polygon can be constructed from optimal triangulations of its sub-polygons.

**Overlapping subproblems**: When we recursively compute scores for different triangulations, we end up computing the same subpolygon scores many times.

We can solve this with bottom-up dynamic programming:

1. Define `dp[i][j]` as the minimum score to triangulate the polygon from vertex `i` to vertex `j` (inclusive).
2. Base case: `dp[i][i+1] = 0` for all `i` (a line segment, not a polygon)
3. For polygons with 3 or more vertices (when `j - i >= 2`), we need to consider all possible triangles that can be formed with base `(i, j)`.
4. For each possible vertex `k` between `i` and `j`, triangle `(i, k, j)` splits the polygon into:
   - Left polygon: `(i, i+1, ..., k)`
   - Right polygon: `(k, k+1, ..., j)`
5. The score is: `values[i] * values[k] * values[j] + dp[i][k] + dp[k][j]`
6. We take the minimum over all possible `k`.

We need to fill the DP table in increasing order of polygon size, starting with the smallest polygons (3 vertices) and building up to the full polygon.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n³) | Space: O(n²)
def minScoreTriangulation(values):
    """
    Find minimum triangulation score for a convex polygon.

    Args:
        values: List of vertex values in clockwise order

    Returns:
        Minimum possible sum of triangle scores
    """
    n = len(values)

    # dp[i][j] = minimum score to triangulate polygon from vertex i to j
    # Initialize with 0s
    dp = [[0] * n for _ in range(n)]

    # We need to fill the table diagonally
    # Start with smallest polygons (3 vertices) and build up
    for length in range(2, n):  # length = j - i
        for i in range(n - length):
            j = i + length
            # Initialize dp[i][j] to a large number
            dp[i][j] = float('inf')

            # Try all possible vertices k between i and j
            # k is the vertex that forms triangle (i, k, j)
            for k in range(i + 1, j):
                # Score = triangle (i, k, j) + left polygon + right polygon
                score = values[i] * values[k] * values[j] + dp[i][k] + dp[k][j]
                dp[i][j] = min(dp[i][j], score)

    # Result is the minimum score for the entire polygon (vertices 0 to n-1)
    return dp[0][n - 1]
```

```javascript
// Time: O(n³) | Space: O(n²)
function minScoreTriangulation(values) {
  /**
   * Find minimum triangulation score for a convex polygon.
   *
   * @param {number[]} values - Vertex values in clockwise order
   * @return {number} Minimum possible sum of triangle scores
   */
  const n = values.length;

  // dp[i][j] = minimum score to triangulate polygon from vertex i to j
  // Initialize with 0s
  const dp = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  // Fill the table diagonally, starting with smallest polygons
  for (let length = 2; length < n; length++) {
    for (let i = 0; i < n - length; i++) {
      const j = i + length;
      // Initialize to a large number
      dp[i][j] = Infinity;

      // Try all possible vertices k between i and j
      for (let k = i + 1; k < j; k++) {
        // Score = triangle (i, k, j) + left polygon + right polygon
        const score = values[i] * values[k] * values[j] + dp[i][k] + dp[k][j];
        dp[i][j] = Math.min(dp[i][j], score);
      }
    }
  }

  // Result is for the entire polygon (vertices 0 to n-1)
  return dp[0][n - 1];
}
```

```java
// Time: O(n³) | Space: O(n²)
class Solution {
    public int minScoreTriangulation(int[] values) {
        /**
         * Find minimum triangulation score for a convex polygon.
         *
         * @param values Vertex values in clockwise order
         * @return Minimum possible sum of triangle scores
         */
        int n = values.length;

        // dp[i][j] = minimum score to triangulate polygon from vertex i to j
        // Initialize with 0s (default for int)
        int[][] dp = new int[n][n];

        // Fill the table diagonally, starting with smallest polygons
        // length represents the distance between i and j (j - i)
        for (int length = 2; length < n; length++) {
            for (int i = 0; i < n - length; i++) {
                int j = i + length;
                // Initialize to a large number
                dp[i][j] = Integer.MAX_VALUE;

                // Try all possible vertices k between i and j
                for (int k = i + 1; k < j; k++) {
                    // Score = triangle (i, k, j) + left polygon + right polygon
                    int score = values[i] * values[k] * values[j] + dp[i][k] + dp[k][j];
                    dp[i][j] = Math.min(dp[i][j], score);
                }
            }
        }

        // Result is for the entire polygon (vertices 0 to n-1)
        return dp[0][n - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n³)**

- We have three nested loops:
  1. Outer loop: `length` from 2 to n-1 → O(n)
  2. Middle loop: `i` from 0 to n-length → O(n)
  3. Inner loop: `k` from i+1 to j-1 → O(n)
- In total: O(n × n × n) = O(n³)

**Space Complexity: O(n²)**

- We store a 2D DP table of size n × n
- Each cell stores an integer value
- Total space: O(n²)

For n ≤ 50 (as per problem constraints), O(n³) = 125,000 operations is perfectly acceptable.

## Common Mistakes

1. **Incorrect DP initialization**: Forgetting to initialize `dp[i][j]` to infinity before the inner loop. This can cause the minimum calculation to always return 0.

2. **Wrong loop order**: Trying to fill the DP table row-by-row instead of diagonally. Since `dp[i][j]` depends on `dp[i][k]` and `dp[k][j]` where `k` is between `i` and `j`, we must fill in increasing order of polygon size (increasing `j-i`).

3. **Off-by-one errors in indices**:
   - Using `k <= j` instead of `k < j` (k must be strictly between i and j)
   - Incorrect bounds for the `i` loop (should be `i < n - length`, not `i < n`)

4. **Missing the convex polygon assumption**: The solution relies on the polygon being convex. For non-convex polygons, we'd need to check if diagonals are valid (lie inside the polygon), which would make the problem much harder.

## When You'll See This Pattern

This problem uses **interval DP** (also called **range DP**), a common pattern for problems involving partitioning sequences or intervals. Similar problems include:

1. **Matrix Chain Multiplication (LeetCode 1039 is actually the same problem!)**: Given matrices of different dimensions, find the optimal parenthesization to minimize operations. The recurrence is nearly identical: `dp[i][j] = min(dp[i][k] + dp[k][j] + cost(i,k,j))`.

2. **Burst Balloons (LeetCode 312)**: Given balloons with values, burst them in some order to maximize coins. The DP approach is similar: `dp[i][j] = max(dp[i][k-1] + dp[k+1][j] + nums[i-1]*nums[k]*nums[j+1])`.

3. **Stone Game (LeetCode 877)**: Two players take stones from either end of a pile. The DP state represents the best score for a subarray of stones.

The key signature of interval DP problems is that you're trying to optimize some operation on a sequence or polygon, and the optimal solution for a range depends on optimal solutions for subranges.

## Key Takeaways

1. **Recognize interval DP**: When you see problems about optimizing operations on sequences, arrays, or polygons where the solution for a range depends on solutions for subranges, think interval DP.

2. **Fill DP table diagonally**: For interval DP, you typically need to fill the table in increasing order of interval length, not row-by-row.

3. **Convexity matters**: The "convex polygon" condition in this problem ensures that any diagonal between non-adjacent vertices is valid. Without this, the problem becomes NP-hard.

Remember: The hardest part of DP problems is often identifying the correct state and recurrence. Once you have those, the implementation is usually straightforward.

[Practice this problem on CodeJeet](/problem/minimum-score-triangulation-of-polygon)
