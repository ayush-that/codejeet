---
title: "How to Solve Coordinate With Maximum Network Quality — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Coordinate With Maximum Network Quality. Medium difficulty, 39.3% acceptance rate. Topics: Array, Enumeration."
date: "2026-04-22"
category: "dsa-patterns"
tags: ["coordinate-with-maximum-network-quality", "array", "enumeration", "medium"]
---

# How to Solve Coordinate With Maximum Network Quality

You're given an array of network towers with coordinates and quality factors, and need to find the coordinate (including non-tower positions) that maximizes the sum of signal qualities from all towers within range. The signal quality from a tower decreases with distance, and becomes zero beyond a certain radius. What makes this problem interesting is that the optimal coordinate isn't necessarily at a tower location—it could be anywhere on the integer grid within the bounding box of towers plus their range.

## Visual Walkthrough

Let's walk through a small example: `towers = [[1,2,5],[2,1,7],[3,1,9]]`, `radius = 2`

We need to consider all integer coordinates where signals might overlap. First, let's find the search bounds:

- Tower coordinates: (1,2), (2,1), (3,1)
- Min x = 1, Max x = 3
- Min y = 1, Max y = 2

But towers have a radius of 2, so we need to expand our search area:

- Search from x = 1-2 = -1 to x = 3+2 = 5
- Search from y = 1-2 = -1 to y = 2+2 = 4

Now we check each integer coordinate in this 7×6 grid (x from -1 to 5, y from -1 to 4). For each coordinate (x,y), we calculate the total signal quality by checking all towers:

At coordinate (2,1):

- Distance to tower at (1,2): √((2-1)² + (1-2)²) = √(1+1) = √2 ≈ 1.414 ≤ 2
  Quality = floor(5 / (1 + 1.414)) = floor(5/2.414) = floor(2.07) = 2
- Distance to tower at (2,1): 0 ≤ 2
  Quality = floor(7 / (1 + 0)) = 7
- Distance to tower at (3,1): 1 ≤ 2
  Quality = floor(9 / (1 + 1)) = floor(9/2) = 4
- Total quality = 2 + 7 + 4 = 13

We continue this for all coordinates, tracking the maximum. The coordinate with maximum quality (and smallest x, then smallest y if tied) is our answer.

## Brute Force Approach

The most straightforward approach is to check every possible integer coordinate within the expanded bounds. For each coordinate, we iterate through all towers to calculate the total signal quality.

Why this seems reasonable at first: The problem asks for integer coordinates, and the bounds are limited by tower positions plus radius. However, we need to be careful about the search space size.

What makes the brute force workable here: The constraints are small (towers.length ≤ 50, coordinates ≤ 50, radius ≤ 50), so even checking a 100×100 grid (10,000 points) with 50 towers each (500,000 operations) is acceptable.

The naive approach would be to check an arbitrarily large area or use floating-point comparisons incorrectly, but the bounded brute force is actually the optimal solution for this problem.

## Optimized Approach

The key insight is that the optimal coordinate must lie within the bounding box expanded by the radius in all directions. Here's why:

1. **Signal quality decreases with distance**: Beyond the radius, quality is zero, so coordinates outside the expanded bounds receive no signal.
2. **Integer coordinates only**: We only need to check integer coordinates within these bounds.
3. **Quality calculation is deterministic**: For each coordinate, we can compute the total quality by summing contributions from all towers within range.

The optimization comes from:

- Determining the exact search bounds efficiently
- Early termination when distance exceeds radius (skip quality calculation)
- Comparing coordinates properly when qualities are equal

## Optimal Solution

The solution involves three main steps:

1. Determine the search bounds by finding min/max coordinates of all towers and expanding by radius
2. Iterate through all integer coordinates in the search area
3. For each coordinate, calculate total signal quality from all towers
4. Track the coordinate with maximum quality (with proper tie-breaking)

<div class="code-group">

```python
# Time: O(n * w * h) where n = number of towers, w = width of search area, h = height of search area
# Space: O(1) - only using constant extra space
def bestCoordinate(towers, radius):
    """
    Find the coordinate with maximum network quality.

    Args:
        towers: List of [x, y, q] where q is quality factor
        radius: Maximum signal range

    Returns:
        [x, y] coordinate with maximum quality
    """
    # Step 1: Find the bounding box for our search
    # We need to search from (min_x - radius) to (max_x + radius)
    # and similarly for y coordinates
    min_x = min_y = float('inf')
    max_x = max_y = float('-inf')

    for x, y, _ in towers:
        min_x = min(min_x, x)
        max_x = max(max_x, x)
        min_y = min(min_y, y)
        max_y = max(max_y, y)

    # Expand the search area by radius in all directions
    # Since we only check integer coordinates, we can use integer bounds
    search_min_x = min_x - radius
    search_max_x = max_x + radius
    search_min_y = min_y - radius
    search_max_y = max_y + radius

    # Step 2: Initialize variables to track the best coordinate
    best_quality = -1
    best_x = best_y = 0

    # Step 3: Check every integer coordinate in the search area
    for x in range(search_min_x, search_max_x + 1):
        for y in range(search_min_y, search_max_y + 1):
            total_quality = 0

            # Step 4: Calculate quality from each tower
            for tx, ty, q in towers:
                # Calculate Euclidean distance
                dx = x - tx
                dy = y - ty
                distance = (dx * dx + dy * dy) ** 0.5

                # Only add quality if within range
                if distance <= radius:
                    # Signal quality formula: floor(q / (1 + distance))
                    total_quality += int(q / (1 + distance))

            # Step 5: Update best coordinate if we found better quality
            # or same quality with smaller coordinates (tie-breaking)
            if total_quality > best_quality:
                best_quality = total_quality
                best_x, best_y = x, y
            elif total_quality == best_quality:
                # Tie-breaking: smaller x first, then smaller y
                if x < best_x or (x == best_x and y < best_y):
                    best_x, best_y = x, y

    return [best_x, best_y]
```

```javascript
// Time: O(n * w * h) where n = number of towers, w = width of search area, h = height of search area
// Space: O(1) - only using constant extra space
function bestCoordinate(towers, radius) {
  /**
   * Find the coordinate with maximum network quality.
   *
   * @param {number[][]} towers - Array of [x, y, q] where q is quality factor
   * @param {number} radius - Maximum signal range
   * @return {number[]} - [x, y] coordinate with maximum quality
   */

  // Step 1: Find the bounding box for our search
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  for (const [x, y, _] of towers) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  // Expand the search area by radius in all directions
  const searchMinX = minX - radius;
  const searchMaxX = maxX + radius;
  const searchMinY = minY - radius;
  const searchMaxY = maxY + radius;

  // Step 2: Initialize variables to track the best coordinate
  let bestQuality = -1;
  let bestX = 0,
    bestY = 0;

  // Step 3: Check every integer coordinate in the search area
  for (let x = searchMinX; x <= searchMaxX; x++) {
    for (let y = searchMinY; y <= searchMaxY; y++) {
      let totalQuality = 0;

      // Step 4: Calculate quality from each tower
      for (const [tx, ty, q] of towers) {
        // Calculate Euclidean distance
        const dx = x - tx;
        const dy = y - ty;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only add quality if within range
        if (distance <= radius) {
          // Signal quality formula: floor(q / (1 + distance))
          totalQuality += Math.floor(q / (1 + distance));
        }
      }

      // Step 5: Update best coordinate if we found better quality
      // or same quality with smaller coordinates (tie-breaking)
      if (totalQuality > bestQuality) {
        bestQuality = totalQuality;
        bestX = x;
        bestY = y;
      } else if (totalQuality === bestQuality) {
        // Tie-breaking: smaller x first, then smaller y
        if (x < bestX || (x === bestX && y < bestY)) {
          bestX = x;
          bestY = y;
        }
      }
    }
  }

  return [bestX, bestY];
}
```

```java
// Time: O(n * w * h) where n = number of towers, w = width of search area, h = height of search area
// Space: O(1) - only using constant extra space
class Solution {
    public int[] bestCoordinate(int[][] towers, int radius) {
        /**
         * Find the coordinate with maximum network quality.
         *
         * @param towers - Array of [x, y, q] where q is quality factor
         * @param radius - Maximum signal range
         * @return [x, y] coordinate with maximum quality
         */

        // Step 1: Find the bounding box for our search
        int minX = Integer.MAX_VALUE, maxX = Integer.MIN_VALUE;
        int minY = Integer.MAX_VALUE, maxY = Integer.MIN_VALUE;

        for (int[] tower : towers) {
            int x = tower[0];
            int y = tower[1];
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }

        // Expand the search area by radius in all directions
        int searchMinX = minX - radius;
        int searchMaxX = maxX + radius;
        int searchMinY = minY - radius;
        int searchMaxY = maxY + radius;

        // Step 2: Initialize variables to track the best coordinate
        int bestQuality = -1;
        int bestX = 0, bestY = 0;

        // Step 3: Check every integer coordinate in the search area
        for (int x = searchMinX; x <= searchMaxX; x++) {
            for (int y = searchMinY; y <= searchMaxY; y++) {
                int totalQuality = 0;

                // Step 4: Calculate quality from each tower
                for (int[] tower : towers) {
                    int tx = tower[0];
                    int ty = tower[1];
                    int q = tower[2];

                    // Calculate Euclidean distance
                    int dx = x - tx;
                    int dy = y - ty;
                    double distance = Math.sqrt(dx * dx + dy * dy);

                    // Only add quality if within range
                    if (distance <= radius) {
                        // Signal quality formula: floor(q / (1 + distance))
                        totalQuality += (int)(q / (1 + distance));
                    }
                }

                // Step 5: Update best coordinate if we found better quality
                // or same quality with smaller coordinates (tie-breaking)
                if (totalQuality > bestQuality) {
                    bestQuality = totalQuality;
                    bestX = x;
                    bestY = y;
                } else if (totalQuality == bestQuality) {
                    // Tie-breaking: smaller x first, then smaller y
                    if (x < bestX || (x == bestX && y < bestY)) {
                        bestX = x;
                        bestY = y;
                    }
                }
            }
        }

        return new int[]{bestX, bestY};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × w × h)

- `n`: Number of towers (up to 50)
- `w`: Width of search area = (max_x - min_x + 2 × radius + 1)
- `h`: Height of search area = (max_y - min_y + 2 × radius + 1)

In the worst case, coordinates range from 0 to 50 and radius is 50, so:

- w = 50 - 0 + 2×50 + 1 = 151
- h = 151
- Total operations = 50 × 151 × 151 ≈ 1.14 million, which is efficient.

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables tracking the best coordinate, bounds, and temporary calculations.

## Common Mistakes

1. **Not expanding the search bounds by radius**: Some candidates only search within the tower coordinates' bounding box, forgetting that signals extend beyond tower locations. Always expand min/max coordinates by radius in all directions.

2. **Incorrect distance comparison**: Using integer distance squared instead of actual Euclidean distance. Remember: `distance = sqrt(dx² + dy²)` must be compared to radius, not `dx² + dy²` compared to `radius²`.

3. **Wrong quality calculation**: Forgetting to use `floor(q / (1 + distance))` or using integer division incorrectly. In Python, `int()` truncates toward zero, which works for positive numbers. In Java/JavaScript, use explicit floor functions.

4. **Tie-breaking errors**: When two coordinates have equal quality, we must return the one with smallest x coordinate, and if x is equal, smallest y. Forgetting this tie-breaking rule or implementing it incorrectly is a common mistake.

## When You'll See This Pattern

This problem uses **bounded brute force enumeration**—a pattern where you systematically check all possibilities within reasonable bounds. Similar problems include:

1. **LeetCode 149: Max Points on a Line** - Also involves checking all pairs of points and calculating slopes, requiring careful handling of edge cases.

2. **LeetCode 223: Rectangle Area** - Requires calculating overlapping areas by checking coordinate relationships within bounds.

3. **LeetCode 939: Minimum Area Rectangle** - Involves searching through coordinate pairs to find rectangles, similar to checking all possible combinations within bounds.

The key insight is recognizing when brute force is acceptable because constraints are small, and optimizing within that brute force by limiting the search space.

## Key Takeaways

1. **Bounded brute force can be optimal**: When constraints are small (n ≤ 50, coordinates ≤ 50), checking all possibilities within calculated bounds is often the simplest and most correct solution.

2. **Carefully define search space**: The optimal coordinate isn't always at a tower location. Expand your search area by the problem's parameters (radius in this case).

3. **Pay attention to mathematical formulas**: Signal quality calculation with floor division and distance comparisons require precise implementation. Test edge cases like zero distance (division by 1, not 0).

[Practice this problem on CodeJeet](/problem/coordinate-with-maximum-network-quality)
