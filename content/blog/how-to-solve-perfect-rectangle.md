---
title: "How to Solve Perfect Rectangle — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Perfect Rectangle. Hard difficulty, 37.3% acceptance rate. Topics: Array, Hash Table, Math, Geometry, Sweep Line."
date: "2028-04-27"
category: "dsa-patterns"
tags: ["perfect-rectangle", "array", "hash-table", "math", "hard"]
---

# How to Solve Perfect Rectangle

This problem asks us to determine whether a collection of axis-aligned rectangles perfectly covers a single rectangular region without gaps or overlaps. The challenge lies in detecting subtle issues: even if the total area matches and rectangles don't obviously overlap, they might leave small gaps or have overlapping corners that are hard to detect visually.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider these rectangles:

```
rectangles = [
    [1,1,3,3],  # Rectangle A: bottom-left (1,1), top-right (3,3)
    [3,1,4,2],  # Rectangle B: bottom-left (3,1), top-right (4,2)
    [1,3,2,4],  # Rectangle C: bottom-left (1,3), top-right (2,4)
    [2,3,3,4]   # Rectangle D: bottom-left (2,3), top-right (3,4)
]
```

Visually, these form a perfect 3×3 rectangle from (1,1) to (4,4). Let's check the conditions:

1. **Total Area Check**: Sum of individual rectangle areas = (2×2)+(1×1)+(1×1)+(1×1) = 9. The bounding rectangle area = (4-1)×(4-1) = 9. ✓

2. **Corner Points**: Each rectangle contributes 4 corner points. When rectangles meet, interior corners cancel out (appear twice), leaving only the 4 outer corners of the combined shape:
   - (1,1) appears once (from rectangle A)
   - (4,4) doesn't appear directly (no rectangle ends there)
   - Wait, something's wrong! Let's track all corners...

This reveals the key insight: we need to track corners carefully. A perfect rectangle has exactly 4 corner points that appear an odd number of times (the outer corners), while all other points appear an even number of times (they cancel out as interior corners).

## Brute Force Approach

A naive approach might try to simulate the coverage by creating a large grid and marking covered cells. However, coordinates can be up to 10^5, making a grid infeasible. Another brute force idea: check all pairs of rectangles for overlaps, and verify the total area matches the bounding rectangle. While checking overlaps is O(n²), the real issue is that even with no overlaps and matching area, rectangles could still leave gaps (like puzzle pieces that don't quite fit).

The fundamental problem with brute force is it doesn't capture the geometric constraint that in a perfect tiling, interior corners must cancel out perfectly. We need a way to track corner points efficiently.

## Optimized Approach

The optimal solution uses two key observations:

1. **Area Condition**: The sum of areas of all rectangles must equal the area of the bounding rectangle (determined by the min/max x and y coordinates).

2. **Corner Condition**: In a perfect rectangle:
   - The four corners of the bounding rectangle appear exactly once
   - All other corner points appear an even number of times (2 or 4 times)

Why does this work? When two rectangles meet at a corner, that point becomes an interior point and should appear twice (once from each rectangle). When four rectangles meet at a point, it appears four times. Only the outermost corners appear once.

We can implement this using a hash set to track corner points: when we encounter a corner, if it's already in the set, remove it (canceling out); otherwise, add it. After processing all rectangles, we should have exactly 4 points left—the corners of the bounding rectangle.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def isRectangleCover(rectangles):
    """
    Check if rectangles form a perfect rectangle cover.

    Args:
        rectangles: List of [x1, y1, x2, y2] where (x1,y1) is bottom-left
                    and (x2,y2) is top-right

    Returns:
        bool: True if rectangles form exact cover of rectangular region
    """

    # Track the bounding rectangle coordinates
    min_x = min_y = float('inf')
    max_x = max_y = float('-inf')

    total_area = 0
    corners = set()  # Use set to track corners with odd counts

    for x1, y1, x2, y2 in rectangles:
        # Update bounding rectangle
        min_x = min(min_x, x1)
        min_y = min(min_y, y1)
        max_x = max(max_x, x2)
        max_y = max(max_y, y2)

        # Add rectangle area to total
        total_area += (x2 - x1) * (y2 - y1)

        # Get all four corners of current rectangle
        rect_corners = [(x1, y1), (x1, y2), (x2, y1), (x2, y2)]

        # Toggle each corner in the set
        # If corner exists, remove it (even count)
        # If corner doesn't exist, add it (odd count)
        for corner in rect_corners:
            if corner in corners:
                corners.remove(corner)
            else:
                corners.add(corner)

    # Check area condition
    bounding_area = (max_x - min_x) * (max_y - min_y)
    if total_area != bounding_area:
        return False

    # Check corner condition
    # We should have exactly 4 corners left
    if len(corners) != 4:
        return False

    # These 4 corners must be the bounding rectangle corners
    expected_corners = {(min_x, min_y), (min_x, max_y),
                        (max_x, min_y), (max_x, max_y)}

    return corners == expected_corners
```

```javascript
// Time: O(n) | Space: O(n)
function isRectangleCover(rectangles) {
  /**
   * Check if rectangles form a perfect rectangle cover.
   *
   * @param {number[][]} rectangles - Array of [x1, y1, x2, y2] where
   *                                  (x1,y1) is bottom-left, (x2,y2) is top-right
   * @return {boolean} - True if rectangles form exact cover of rectangular region
   */

  // Track the bounding rectangle coordinates
  let minX = Infinity,
    minY = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity;

  let totalArea = 0;
  const corners = new Set(); // Track corners with odd counts

  for (const [x1, y1, x2, y2] of rectangles) {
    // Update bounding rectangle
    minX = Math.min(minX, x1);
    minY = Math.min(minY, y1);
    maxX = Math.max(maxX, x2);
    maxY = Math.max(maxY, y2);

    // Add rectangle area to total
    totalArea += (x2 - x1) * (y2 - y1);

    // Get all four corners of current rectangle
    const rectCorners = [
      `${x1},${y1}`, // bottom-left
      `${x1},${y2}`, // top-left
      `${x2},${y1}`, // bottom-right
      `${x2},${y2}`, // top-right
    ];

    // Toggle each corner in the set
    // If corner exists, remove it (even count)
    // If corner doesn't exist, add it (odd count)
    for (const corner of rectCorners) {
      if (corners.has(corner)) {
        corners.delete(corner);
      } else {
        corners.add(corner);
      }
    }
  }

  // Check area condition
  const boundingArea = (maxX - minX) * (maxY - minY);
  if (totalArea !== boundingArea) {
    return false;
  }

  // Check corner condition
  // We should have exactly 4 corners left
  if (corners.size !== 4) {
    return false;
  }

  // These 4 corners must be the bounding rectangle corners
  const expectedCorners = new Set([
    `${minX},${minY}`, // bottom-left
    `${minX},${maxY}`, // top-left
    `${maxX},${minY}`, // bottom-right
    `${maxX},${maxY}`, // top-right
  ]);

  // Check if corners match expected corners
  for (const corner of corners) {
    if (!expectedCorners.has(corner)) {
      return false;
    }
  }

  return true;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean isRectangleCover(int[][] rectangles) {
        /**
         * Check if rectangles form a perfect rectangle cover.
         *
         * @param rectangles - Array of [x1, y1, x2, y2] where
         *                   (x1,y1) is bottom-left, (x2,y2) is top-right
         * @return boolean - True if rectangles form exact cover of rectangular region
         */

        // Track the bounding rectangle coordinates
        int minX = Integer.MAX_VALUE, minY = Integer.MAX_VALUE;
        int maxX = Integer.MIN_VALUE, maxY = Integer.MIN_VALUE;

        long totalArea = 0;  // Use long to avoid integer overflow
        Set<String> corners = new HashSet<>();  // Track corners with odd counts

        for (int[] rect : rectangles) {
            int x1 = rect[0], y1 = rect[1], x2 = rect[2], y2 = rect[3];

            // Update bounding rectangle
            minX = Math.min(minX, x1);
            minY = Math.min(minY, y1);
            maxX = Math.max(maxX, x2);
            maxY = Math.max(maxY, y2);

            // Add rectangle area to total (cast to long to avoid overflow)
            totalArea += (long)(x2 - x1) * (y2 - y1);

            // Get all four corners of current rectangle as strings
            String[] rectCorners = {
                x1 + "," + y1,  // bottom-left
                x1 + "," + y2,  // top-left
                x2 + "," + y1,  // bottom-right
                x2 + "," + y2   // top-right
            };

            // Toggle each corner in the set
            // If corner exists, remove it (even count)
            // If corner doesn't exist, add it (odd count)
            for (String corner : rectCorners) {
                if (corners.contains(corner)) {
                    corners.remove(corner);
                } else {
                    corners.add(corner);
                }
            }
        }

        // Check area condition
        long boundingArea = (long)(maxX - minX) * (maxY - minY);
        if (totalArea != boundingArea) {
            return false;
        }

        // Check corner condition
        // We should have exactly 4 corners left
        if (corners.size() != 4) {
            return false;
        }

        // These 4 corners must be the bounding rectangle corners
        String[] expectedCorners = {
            minX + "," + minY,  // bottom-left
            minX + "," + maxY,  // top-left
            maxX + "," + minY,  // bottom-right
            maxX + "," + maxY   // top-right
        };

        // Check if all expected corners are present
        for (String corner : expectedCorners) {
            if (!corners.contains(corner)) {
                return false;
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n), where n is the number of rectangles. We process each rectangle once, performing constant-time operations for each (updating min/max, calculating area, and toggling 4 corners in a hash set).

**Space Complexity**: O(n) in the worst case. The hash set stores corner points. In a perfect rectangle, most corners cancel out, leaving only 4 points. However, in imperfect cases, we might store up to 4n points before cancellation (though typically much less).

## Common Mistakes

1. **Forgetting to check both conditions**: Some candidates only check the area condition or only the corner condition. Both are necessary! Rectangles could have matching total area but leave gaps, or have proper corners but overlapping areas.

2. **Integer overflow in area calculation**: When coordinates are large (up to 10^5), the area can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C) for area calculations.

3. **Incorrect corner toggling logic**: The toggle operation (add if absent, remove if present) is crucial. Simply counting occurrences with a dictionary works too, but toggling with a set is more elegant.

4. **Not verifying the final 4 corners match bounding rectangle**: Having exactly 4 corners isn't enough—they must be the correct corners. A case could have 4 corners left but not at the bounding rectangle positions.

## When You'll See This Pattern

This "corner cancellation" pattern appears in geometry problems where you need to verify tiling properties or detect boundaries:

1. **Rectangle Area II (LeetCode 850)**: Calculating total area covered by rectangles uses similar corner tracking with sweep line algorithm.

2. **The Skyline Problem (LeetCode 218)**: While more complex, it also involves processing building corners and tracking height changes.

3. **Valid Square (LeetCode 593)**: Checking if four points form a square involves analyzing distances and corner relationships.

The core idea is using hash sets/maps to track geometric features (points, edges) that should cancel out in a valid configuration.

## Key Takeaways

1. **Geometric constraints often translate to counting conditions**: In tiling problems, interior features cancel out, leaving only boundary features. This gives us an efficient way to verify correctness without simulating the entire coverage.

2. **Multiple necessary conditions are often sufficient**: When dealing with complex constraints, break them down into independent conditions that are easier to check (area + corners in this case).

3. **Hash sets are powerful for toggle/cancellation logic**: The "add if absent, remove if present" pattern efficiently tracks parity (odd/even counts) without maintaining full counters.

[Practice this problem on CodeJeet](/problem/perfect-rectangle)
