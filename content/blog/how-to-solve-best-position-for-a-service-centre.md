---
title: "How to Solve Best Position for a Service Centre — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Best Position for a Service Centre. Hard difficulty, 35.1% acceptance rate. Topics: Array, Math, Geometry, Randomized."
date: "2029-12-04"
category: "dsa-patterns"
tags: ["best-position-for-a-service-centre", "array", "math", "geometry", "hard"]
---

# How to Solve Best Position for a Service Centre

This problem asks us to find the point (x, y) that minimizes the sum of Euclidean distances to all given customer positions. While it sounds simple, it's mathematically challenging because the sum of distances function isn't convex and has no closed-form algebraic solution like the mean (which minimizes sum of squared distances). This makes it a **geometric median** problem, which requires numerical optimization techniques.

## Visual Walkthrough

Let's walk through a small example with positions = [[0,1],[1,0],[1,2],[2,1]]. Imagine these four points forming a diamond shape.

1. **Initial guess**: We might start at the mean point (1,1), which is the center of the diamond.
2. **Calculate distances**: From (1,1) to each point:
   - To (0,1): distance = 1
   - To (1,0): distance = 1
   - To (1,2): distance = 1
   - To (2,1): distance = 1
   - Total distance = 4
3. **Try moving slightly**: If we move to (1.1, 1), distances become approximately 1.1, 1.1, 0.9, 0.9 = total 4.0 (no improvement).
4. **The optimal point**: For this symmetric arrangement, (1,1) is actually optimal. But for asymmetric distributions, we need to systematically search for the minimum.

The key insight: we can't solve this with a formula, but we can iteratively improve our guess by moving in the direction that reduces the total distance most quickly.

## Brute Force Approach

A naive approach would be to search all possible points in some bounded region. For example:

- Find the bounding box of all points
- Sample thousands of points within this box
- Calculate total distance from each sampled point to all customers
- Return the point with minimum total distance

This is extremely inefficient because:

1. We need extremely fine sampling to get good accuracy
2. Each sample requires O(n) distance calculations
3. The search space grows quadratically with precision requirements

For n=50 customers and 1000×1000 grid sampling, that's 50 million distance calculations! The brute force approach is clearly infeasible.

## Optimized Approach

The standard approach uses **gradient descent** or **Weiszfeld's algorithm** (a specialized form of gradient descent for geometric median):

1. **Start with an initial guess** - the mean (centroid) of all points is a good starting point
2. **Iteratively improve** - at each step, compute a weighted average that pulls us toward the optimal point
3. **Handle edge cases** - if our current guess coincides with a data point, we need special handling
4. **Stop when converged** - when the improvement becomes negligible

The mathematical intuition: at each iteration, we compute:

```
next_x = sum(x_i / d_i) / sum(1 / d_i)
next_y = sum(y_i / d_i) / sum(1 / d_i)
```

where d_i is the distance from current point to customer i. Points closer to our current position get more "pull" (larger weight 1/d_i).

## Optimal Solution

We'll implement Weiszfeld's algorithm with careful handling of the case when we land exactly on a data point.

<div class="code-group">

```python
# Time: O(n * k) where k is iterations (typically 100-200) | Space: O(1)
def getMinDistSum(positions):
    """
    Find the geometric median using Weiszfeld's algorithm.

    Args:
        positions: List of [x, y] coordinates of customers

    Returns:
        Minimum sum of Euclidean distances from optimal point to all customers
    """
    # Start with the centroid (mean) as initial guess
    n = len(positions)
    if n == 0:
        return 0

    # Initial point: mean of all positions
    x = sum(p[0] for p in positions) / n
    y = sum(p[1] for p in positions) / n

    # Precompute positions for efficiency
    points = [(float(p[0]), float(p[1])) for p in positions]

    # We'll iterate until convergence or max iterations
    prev_dist = float('inf')
    for _ in range(100):  # Max 100 iterations (usually converges much faster)
        # Check if we're exactly at a data point
        on_point = False
        for px, py in points:
            if abs(x - px) < 1e-12 and abs(y - py) < 1e-12:
                on_point = True
                break

        # Calculate weighted sums for x and y
        sum_weights = 0.0
        sum_weighted_x = 0.0
        sum_weighted_y = 0.0
        current_dist = 0.0

        for px, py in points:
            dx = x - px
            dy = y - py
            dist = (dx * dx + dy * dy) ** 0.5

            # Accumulate total distance for convergence check
            current_dist += dist

            # If we're on a data point, Weiszfeld's formula needs adjustment
            if on_point:
                # When exactly on a point, use a small epsilon to avoid division by zero
                if dist < 1e-12:
                    continue  # Skip this point in the weighted sum
                sum_weights += 1.0 / dist
                sum_weighted_x += px / dist
                sum_weighted_y += py / dist
            else:
                sum_weights += 1.0 / dist
                sum_weighted_x += px / dist
                sum_weighted_y += py / dist

        # Check for convergence
        if abs(prev_dist - current_dist) < 1e-7:
            return current_dist

        prev_dist = current_dist

        # Update position using Weiszfeld's formula
        if sum_weights > 0:
            x = sum_weighted_x / sum_weights
            y = sum_weighted_y / sum_weights

    # Return the best distance found
    return prev_dist
```

```javascript
// Time: O(n * k) where k is iterations (typically 100-200) | Space: O(1)
/**
 * Find the geometric median using Weiszfeld's algorithm.
 *
 * @param {number[][]} positions - Array of [x, y] coordinates of customers
 * @return {number} Minimum sum of Euclidean distances from optimal point to all customers
 */
function getMinDistSum(positions) {
  // Start with the centroid (mean) as initial guess
  const n = positions.length;
  if (n === 0) return 0;

  // Initial point: mean of all positions
  let x = positions.reduce((sum, p) => sum + p[0], 0) / n;
  let y = positions.reduce((sum, p) => sum + p[1], 0) / n;

  // Precompute positions as floats for consistency
  const points = positions.map((p) => [parseFloat(p[0]), parseFloat(p[1])]);

  let prevDist = Infinity;

  // Iterate until convergence or max iterations
  for (let iter = 0; iter < 100; iter++) {
    // Check if we're exactly at a data point
    let onPoint = false;
    for (const [px, py] of points) {
      if (Math.abs(x - px) < 1e-12 && Math.abs(y - py) < 1e-12) {
        onPoint = true;
        break;
      }
    }

    // Calculate weighted sums for x and y
    let sumWeights = 0;
    let sumWeightedX = 0;
    let sumWeightedY = 0;
    let currentDist = 0;

    for (const [px, py] of points) {
      const dx = x - px;
      const dy = y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Accumulate total distance for convergence check
      currentDist += dist;

      // If we're on a data point, Weiszfeld's formula needs adjustment
      if (onPoint) {
        // When exactly on a point, use a small epsilon to avoid division by zero
        if (dist < 1e-12) {
          continue; // Skip this point in the weighted sum
        }
        sumWeights += 1.0 / dist;
        sumWeightedX += px / dist;
        sumWeightedY += py / dist;
      } else {
        sumWeights += 1.0 / dist;
        sumWeightedX += px / dist;
        sumWeightedY += py / dist;
      }
    }

    // Check for convergence
    if (Math.abs(prevDist - currentDist) < 1e-7) {
      return currentDist;
    }

    prevDist = currentDist;

    // Update position using Weiszfeld's formula
    if (sumWeights > 0) {
      x = sumWeightedX / sumWeights;
      y = sumWeightedY / sumWeights;
    }
  }

  // Return the best distance found
  return prevDist;
}
```

```java
// Time: O(n * k) where k is iterations (typically 100-200) | Space: O(1)
class Solution {
    /**
     * Find the geometric median using Weiszfeld's algorithm.
     *
     * @param positions Array of [x, y] coordinates of customers
     * @return Minimum sum of Euclidean distances from optimal point to all customers
     */
    public double getMinDistSum(int[][] positions) {
        // Start with the centroid (mean) as initial guess
        int n = positions.length;
        if (n == 0) return 0.0;

        // Initial point: mean of all positions
        double x = 0.0, y = 0.0;
        for (int[] p : positions) {
            x += p[0];
            y += p[1];
        }
        x /= n;
        y /= n;

        double prevDist = Double.MAX_VALUE;

        // Iterate until convergence or max iterations
        for (int iter = 0; iter < 100; iter++) {
            // Check if we're exactly at a data point
            boolean onPoint = false;
            for (int[] p : positions) {
                if (Math.abs(x - p[0]) < 1e-12 && Math.abs(y - p[1]) < 1e-12) {
                    onPoint = true;
                    break;
                }
            }

            // Calculate weighted sums for x and y
            double sumWeights = 0.0;
            double sumWeightedX = 0.0;
            double sumWeightedY = 0.0;
            double currentDist = 0.0;

            for (int[] p : positions) {
                double dx = x - p[0];
                double dy = y - p[1];
                double dist = Math.sqrt(dx * dx + dy * dy);

                // Accumulate total distance for convergence check
                currentDist += dist;

                // If we're on a data point, Weiszfeld's formula needs adjustment
                if (onPoint) {
                    // When exactly on a point, use a small epsilon to avoid division by zero
                    if (dist < 1e-12) {
                        continue;  // Skip this point in the weighted sum
                    }
                    sumWeights += 1.0 / dist;
                    sumWeightedX += p[0] / dist;
                    sumWeightedY += p[1] / dist;
                } else {
                    sumWeights += 1.0 / dist;
                    sumWeightedX += p[0] / dist;
                    sumWeightedY += p[1] / dist;
                }
            }

            // Check for convergence
            if (Math.abs(prevDist - currentDist) < 1e-7) {
                return currentDist;
            }

            prevDist = currentDist;

            // Update position using Weiszfeld's formula
            if (sumWeights > 0) {
                x = sumWeightedX / sumWeights;
                y = sumWeightedY / sumWeights;
            }
        }

        // Return the best distance found
        return prevDist;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k) where:

- n = number of customer positions
- k = number of iterations (typically 50-100 for convergence)

Each iteration computes distances to all n points and updates the weighted sums. The algorithm typically converges in under 100 iterations even for large n.

**Space Complexity:** O(1) additional space beyond the input. We only store a few double variables for the current position, distances, and weighted sums.

## Common Mistakes

1. **Using the mean (centroid) as the answer**: The mean minimizes sum of squared distances, not sum of distances. These are different optimization problems with different solutions.

2. **Not handling the "on point" case**: When the algorithm lands exactly on a data point, the distance becomes zero, causing division by zero in Weiszfeld's formula. We must detect this and handle it specially.

3. **Insufficient iterations or poor convergence criteria**: The algorithm needs enough iterations to converge. A common mistake is stopping too early or using a convergence threshold that's too large.

4. **Floating-point precision issues**: When comparing distances or checking if we're on a point, we need to use epsilon comparisons (e.g., `abs(a-b) < 1e-7`) rather than exact equality.

## When You'll See This Pattern

This geometric median/Weiszfeld algorithm pattern appears in optimization problems where you need to minimize sum of distances:

1. **Facility Location Problems**: Similar to this problem - placing a warehouse, hospital, or store to minimize total travel distance.

2. **Clustering with L1 norm**: K-medians clustering (as opposed to K-means which uses squared L2 norm).

3. **Robust Statistics**: The geometric median is more robust to outliers than the mean.

Related LeetCode problems:

- **296. Best Meeting Point**: Minimizes sum of Manhattan distances (easier - can solve with medians).
- **462. Minimum Moves to Equal Array Elements II**: 1D version of this problem (median works for 1D).
- **1515. Best Position for a Service Centre**: This exact problem.

## Key Takeaways

1. **Different distance metrics require different optimization techniques**: Mean minimizes squared Euclidean distance, median minimizes Manhattan distance, and geometric median (this problem) minimizes Euclidean distance.

2. **Iterative numerical methods** are needed when no closed-form solution exists. Gradient descent and specialized variants like Weiszfeld's algorithm are powerful tools.

3. **Always handle edge cases** in numerical algorithms: division by zero, convergence criteria, and floating-point precision issues.

[Practice this problem on CodeJeet](/problem/best-position-for-a-service-centre)
