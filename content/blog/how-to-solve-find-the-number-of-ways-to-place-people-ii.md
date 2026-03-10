---
title: "How to Solve Find the Number of Ways to Place People II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Number of Ways to Place People II. Hard difficulty, 64.4% acceptance rate. Topics: Array, Math, Geometry, Sorting, Enumeration."
date: "2027-08-31"
category: "dsa-patterns"
tags: ["find-the-number-of-ways-to-place-people-ii", "array", "math", "geometry", "hard"]
---

# How to Solve Find the Number of Ways to Place People II

This problem asks us to count valid placements of two people (Alice and Bob) on a 2D plane given existing points, where a placement is valid if: 1) Alice is strictly to the left of Bob (Alice's x < Bob's x), and 2) No other point lies in or on the rectangle formed by their positions. The challenge lies in efficiently checking the "no other points in rectangle" condition without examining all point pairs, which would be too slow for large inputs.

## Visual Walkthrough

Let's trace through a concrete example: `points = [[1,1],[2,2],[3,3]]`

We need to count pairs (Alice, Bob) where:

1. Alice.x < Bob.x (strictly left)
2. No other point lies in or on the rectangle defined by their positions

Consider Alice at (1,1) and Bob at (3,3):

- Rectangle corners: bottom-left (1,1), top-right (3,3)
- Other point (2,2) lies INSIDE this rectangle → Invalid

Consider Alice at (1,1) and Bob at (2,2):

- Rectangle: (1,1) to (2,2)
- Other point (3,3) is outside (x=3 > 2) → Valid

Consider Alice at (2,2) and Bob at (3,3):

- Rectangle: (2,2) to (3,3)
- Other point (1,1) is outside (x=1 < 2) → Valid

So valid pairs: (1,1)-(2,2) and (2,2)-(3,3) → Answer: 2

The key insight: For Alice at (x₁,y₁) and Bob at (x₂,y₂) with x₁ < x₂, the "no points in rectangle" condition means:

- No point has x between x₁ and x₂ AND y between min(y₁,y₂) and max(y₁,y₂)
- Points exactly on the boundary also invalidate the placement

## Brute Force Approach

A naive solution would check all O(n²) pairs of points, and for each pair, check all other O(n) points to see if any lie in the rectangle. This gives O(n³) time complexity, which is far too slow for n up to 1000 (would be ~10⁹ operations).

Even with some optimizations (like pre-sorting), the fundamental issue remains: checking all points for each pair is expensive. We need a smarter way to verify the "empty rectangle" condition.

## Optimized Approach

The key insight comes from sorting and careful enumeration:

1. **Sort points by x-coordinate, then by y-coordinate**: This ensures when we consider Alice and Bob, all points between them in the sorted list have x-coordinates between Alice.x and Bob.x.

2. **For each pair (i,j) with i < j (Alice at i, Bob at j)**:
   - Since points are sorted by x, we have Alice.x ≤ Bob.x
   - We need Alice.x < Bob.x strictly, so we skip equal x
   - The rectangle's y-range is [min(yᵢ,yⱼ), max(yᵢ,yⱼ)]
3. **Check if any point between i and j falls in the y-range**:
   - Instead of checking all points, we can track the minimum and maximum y-values we've seen
   - If all points between i and j have y-values outside the range [min(yᵢ,yⱼ), max(yᵢ,yⱼ)], then the rectangle is empty
   - Actually, we need to check if any point has y in [min(yᵢ,yⱼ), max(yᵢ,yⱼ)] inclusive

4. **Efficient checking with prefix arrays**:
   - Precompute for each position i:
     - `min_prefix[i]` = minimum y from start to i
     - `max_prefix[i]` = maximum y from start to i
     - `min_suffix[i]` = minimum y from i to end
     - `max_suffix[i]` = maximum y from i to end
   - For points between i and j, we can get min/max y using these arrays

5. **The empty rectangle condition**:
   - Let y_low = min(yᵢ, yⱼ), y_high = max(yᵢ, yⱼ)
   - Rectangle is empty if:
     - Maximum y between i and j ≤ y_low, OR
     - Minimum y between i and j ≥ y_high
   - But wait: we need STRICTLY empty (no points on boundary)
   - Actually, points on the boundary invalidate the placement, so:
     - If max y between i and j == y_low or y_high → invalid
     - If min y between i and j == y_low or y_high → invalid
   - Correct condition: max y < y_high AND min y > y_low

This gives us O(n²) solution with O(n) preprocessing, which is acceptable for n ≤ 1000.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def numberOfPairs(points):
    """
    Count valid placements where Alice is strictly left of Bob
    and no other point lies in or on their rectangle.
    """
    # Sort points by x, then by y for consistent ordering
    # This ensures when we consider i < j, we have x_i <= x_j
    points.sort(key=lambda p: (p[0], p[1]))
    n = len(points)

    # Precompute prefix min/max and suffix min/max arrays
    # These help us quickly find min/max y-values in any range
    min_prefix = [0] * n
    max_prefix = [0] * n
    min_suffix = [0] * n
    max_suffix = [0] * n

    # Initialize first element
    min_prefix[0] = points[0][1]
    max_prefix[0] = points[0][1]

    # Fill prefix arrays: track min/max from start to i
    for i in range(1, n):
        min_prefix[i] = min(min_prefix[i-1], points[i][1])
        max_prefix[i] = max(max_prefix[i-1], points[i][1])

    # Initialize last element
    min_suffix[n-1] = points[n-1][1]
    max_suffix[n-1] = points[n-1][1]

    # Fill suffix arrays: track min/max from i to end
    for i in range(n-2, -1, -1):
        min_suffix[i] = min(min_suffix[i+1], points[i][1])
        max_suffix[i] = max(max_suffix[i+1], points[i][1])

    count = 0

    # Check all pairs (i, j) where i < j
    for i in range(n):
        xi, yi = points[i]
        for j in range(i + 1, n):
            xj, yj = points[j]

            # Alice must be strictly left of Bob
            if xi == xj:
                continue

            # Determine y-range of the rectangle
            y_low = min(yi, yj)
            y_high = max(yi, yj)

            # Check if any point between i and j falls in y-range
            # We need to check points with indices between i+1 and j-1
            valid = True

            if j == i + 1:
                # No points between i and j, so rectangle is always valid
                # (except we already checked x_i != x_j)
                pass
            else:
                # Get min and max y-values between i and j
                # Using precomputed arrays for efficiency
                min_between = min_suffix[i+1]
                max_between = max_suffix[i+1]

                # Actually, we need min/max from i+1 to j-1
                # Let's compute directly since n is only up to 1000
                min_y = float('inf')
                max_y = float('-inf')
                for k in range(i + 1, j):
                    yk = points[k][1]
                    min_y = min(min_y, yk)
                    max_y = max(max_y, yk)

                # Check if any point lies in or on the rectangle
                # Point lies in rectangle if its y is between y_low and y_high
                # Since x is already between xi and xj (due to sorting)
                if min_y <= y_high and max_y >= y_low:
                    # There's at least one point in the y-range
                    # Need to check if it's actually in the rectangle
                    # Actually, if min_y <= y_high and max_y >= y_low,
                    # then some point has y in [y_low, y_high]
                    valid = False

            if valid:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(n)
function numberOfPairs(points) {
  // Sort points by x, then by y for consistent ordering
  points.sort((a, b) => {
    if (a[0] === b[0]) return a[1] - b[1];
    return a[0] - b[0];
  });

  const n = points.length;
  let count = 0;

  // Check all pairs (i, j) where i < j
  for (let i = 0; i < n; i++) {
    const [xi, yi] = points[i];

    for (let j = i + 1; j < n; j++) {
      const [xj, yj] = points[j];

      // Alice must be strictly left of Bob
      if (xi === xj) continue;

      // Determine y-range of the rectangle
      const yLow = Math.min(yi, yj);
      const yHigh = Math.max(yi, yj);

      let valid = true;

      // Check points between i and j
      for (let k = i + 1; k < j; k++) {
        const yk = points[k][1];

        // If any point has y in [yLow, yHigh], rectangle is not empty
        // Note: points on boundary invalidate the placement
        if (yk >= yLow && yk <= yHigh) {
          valid = false;
          break;
        }
      }

      if (valid) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1) extra space
import java.util.Arrays;

class Solution {
    public int numberOfPairs(int[][] points) {
        // Sort points by x, then by y for consistent ordering
        Arrays.sort(points, (a, b) -> {
            if (a[0] == b[0]) return Integer.compare(a[1], b[1]);
            return Integer.compare(a[0], b[0]);
        });

        int n = points.length;
        int count = 0;

        // Check all pairs (i, j) where i < j
        for (int i = 0; i < n; i++) {
            int xi = points[i][0];
            int yi = points[i][1];

            for (int j = i + 1; j < n; j++) {
                int xj = points[j][0];
                int yj = points[j][1];

                // Alice must be strictly left of Bob
                if (xi == xj) continue;

                // Determine y-range of the rectangle
                int yLow = Math.min(yi, yj);
                int yHigh = Math.max(yi, yj);

                boolean valid = true;

                // Check points between i and j
                for (int k = i + 1; k < j; k++) {
                    int yk = points[k][1];

                    // If any point has y in [yLow, yHigh], rectangle is not empty
                    // Note: points on boundary invalidate the placement
                    if (yk >= yLow && yk <= yHigh) {
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    count++;
                }
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Sorting takes O(n log n)
- Outer double loop runs O(n²) iterations
- Inner loop (checking points between i and j) runs O(j-i) operations, but in total across all pairs, this sums to O(n³) in worst case
- Wait, that's problematic! Let's analyze more carefully:

Actually, the naive implementation with triple nested loops is O(n³). We need to optimize the "check points between i and j" part. The insight is that for fixed i, as j increases, we can maintain the min and max y-values seen so far. Here's an optimized O(n²) approach:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def numberOfPairs(points):
    points.sort(key=lambda p: (p[0], p[1]))
    n = len(points)
    count = 0

    for i in range(n):
        xi, yi = points[i]

        # Track min and max y for points between i and current j
        min_y = float('inf')
        max_y = float('-inf')

        for j in range(i + 1, n):
            xj, yj = points[j]

            if xi == xj:
                # Update min/max y for points at same x
                min_y = min(min_y, yj)
                max_y = max(max_y, yj)
                continue

            y_low = min(yi, yj)
            y_high = max(yi, yj)

            # Check if rectangle is empty
            # No point between i and j should have y in [y_low, y_high]
            if max_y < y_low or min_y > y_high:
                count += 1

            # Update min/max y with current point
            min_y = min(min_y, yj)
            max_y = max(max_y, yj)

    return count
```

</div>

This optimized version is truly O(n²) because for each i, we make a single pass through j > i, maintaining running min/max.

**Space Complexity: O(1)** extra space (excluding input storage).

## Common Mistakes

1. **Not handling points on boundary correctly**: The problem states points "in or on" the rectangle invalidate the placement. Many candidates check only for points strictly inside. Remember to use `>=` and `<=` not just `>` and `<`.

2. **Forgetting to sort by y when x coordinates are equal**: When two points have the same x, their order matters for the "between i and j" check. Always sort by x then y to ensure consistent ordering.

3. **O(n³) time complexity**: The naive triple-nested loop approach times out. The key optimization is maintaining running min/max y-values as j increases, reducing to O(n²).

4. **Incorrect handling of equal x-coordinates**: Alice must be strictly left of Bob, so pairs with equal x should be skipped entirely, not just when xi == xj but also when points between them have the same x.

## When You'll See This Pattern

This problem combines **sorting** with **range emptiness checking**, a pattern seen in:

1. **Rectangle Area (Medium)**: Also involves rectangle geometry and checking overlaps. The difference is Rectangle Area computes area of overlap, while this checks if a rectangle is empty of points.

2. **Count the Number of Rectangles Containing Each Point (Medium)**: Similar 2D geometry problem requiring efficient range queries, often solved with sorting and binary search.

3. **The Skyline Problem (Hard)**: Involves processing 2D intervals and maintaining max/min values, though more complex with sweep line algorithm.

The core technique of sorting points and then using running aggregates (min/max) to answer queries about ranges is widely applicable in computational geometry problems.

## Key Takeaways

1. **Sorting transforms 2D problems into 1D sequences**: By sorting points by x, we reduce the "x between" condition to simple index comparisons, letting us focus on the y-dimension.

2. **Running aggregates enable efficient range queries**: Maintaining min/max (or sum/count) as we iterate allows O(1) range queries instead of O(k) scans for each query.

3. **Boundary conditions matter in geometry problems**: Points "on the boundary" often require careful handling with inclusive/exclusive comparisons. Always test with points that share coordinates.

Related problems: [Rectangle Area](/problem/rectangle-area)
