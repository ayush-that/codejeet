---
title: "How to Solve Minimum Rectangles to Cover Points — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Rectangles to Cover Points. Medium difficulty, 63.6% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2029-03-19"
category: "dsa-patterns"
tags: ["minimum-rectangles-to-cover-points", "array", "greedy", "sorting", "medium"]
---

# How to Solve Minimum Rectangles to Cover Points

You need to cover all given points with axis-aligned rectangles of fixed width `w` and unlimited height. The key challenge is that rectangles can be placed anywhere horizontally, but must have their bottom on the x-axis and extend upward to cover points. This is essentially a **greedy interval covering problem** disguised as a 2D geometry problem.

What makes this interesting: The y-coordinate doesn't matter for rectangle placement! Since rectangles have unlimited height, any rectangle covering a point's x-coordinate will automatically cover its y-coordinate. This reduces a 2D problem to a 1D interval covering problem on the x-axis.

## Visual Walkthrough

Let's trace through an example: `points = [[1,2], [2,3], [3,4], [5,6], [7,8]]`, `w = 3`

**Step 1: Extract and sort x-coordinates**
We only care about x-values: `[1, 2, 3, 5, 7]`

**Step 2: First rectangle placement**
Start with the leftmost point at x=1. A rectangle of width 3 placed with its left edge at x=1 will cover x-values from 1 to 4 (inclusive). This covers points at x=1, 2, and 3.

**Step 3: Move to next uncovered point**
After covering x=1,2,3, the next uncovered point is at x=5. Place a rectangle with its left edge at x=5, covering x-values from 5 to 8. This covers x=5 and 7.

**Step 4: Result**
We used 2 rectangles. The greedy approach works because placing a rectangle earlier (further left) always gives us the maximum coverage for that rectangle.

## Brute Force Approach

A naive candidate might try to consider all possible rectangle placements. Since rectangles can start at any x-coordinate that covers at least one point, we could:

1. Collect all x-coordinates from points
2. Consider placing rectangle left edges at each x-coordinate
3. For each placement, check which points get covered
4. Try all combinations of placements to find the minimum

This becomes a **set cover problem** which is NP-hard in general. Even for this specific case, checking all combinations would be O(2^n) where n is the number of distinct x-coordinates.

Another naive approach: Sort points by x-coordinate, then for each point, check if it falls within the current rectangle. If not, start a new rectangle. But where to place the rectangle? If we always place the rectangle's left edge at the current point's x-coordinate, we might miss covering points that are slightly to the left but within width w.

The brute force would be too slow for constraints where n can be up to 10^5.

## Optimized Approach

The key insight: **This is exactly the classic "minimum number of intervals to cover points" problem.**

Think of each rectangle as covering an interval on the x-axis: `[x_start, x_start + w]`. Since rectangles have unlimited height, any point with x-coordinate in this interval is covered regardless of its y-value.

The optimal greedy strategy:

1. Sort all x-coordinates (extracted from points)
2. Initialize count = 0 and current coverage endpoint = -∞
3. For each x in sorted order:
   - If x > current coverage endpoint, this point isn't covered
   - Place a new rectangle with left edge at x (covering [x, x+w])
   - Increment count and set new coverage endpoint = x + w

Why greedy works: When we encounter an uncovered point at position x, placing the rectangle's left edge at x is optimal because:

- Placing it earlier would waste coverage capacity on already-covered points
- Placing it later would leave point x uncovered
- This placement maximizes the right endpoint (x + w), covering as many future points as possible

This is the standard "interval covering" greedy proof: Always choose the interval that extends as far right as possible while covering the current leftmost uncovered point.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minRectanglesToCoverPoints(points, w):
    """
    Returns the minimum number of rectangles needed to cover all points.

    Args:
        points: List of [x, y] coordinates
        w: Width of each rectangle

    Returns:
        Minimum number of rectangles (integer)
    """
    # Step 1: Extract x-coordinates from all points
    # We only need x-values since rectangles have unlimited height
    x_coords = [x for x, _ in points]

    # Step 2: Sort x-coordinates in ascending order
    # This allows us to process points from left to right
    x_coords.sort()

    # Step 3: Initialize counters
    rectangles = 0          # Count of rectangles used
    coverage_end = float('-inf')  # Rightmost x covered by current rectangle

    # Step 4: Process each point from left to right
    for x in x_coords:
        # If current point is not covered by the previous rectangle
        if x > coverage_end:
            # Place a new rectangle with its left edge at this point
            # This rectangle covers [x, x + w] on the x-axis
            rectangles += 1
            coverage_end = x + w

    return rectangles
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * Returns the minimum number of rectangles needed to cover all points.
 *
 * @param {number[][]} points - Array of [x, y] coordinates
 * @param {number} w - Width of each rectangle
 * @return {number} Minimum number of rectangles
 */
function minRectanglesToCoverPoints(points, w) {
  // Step 1: Extract x-coordinates from all points
  // We only need x-values since rectangles have unlimited height
  const xCoords = points.map((point) => point[0]);

  // Step 2: Sort x-coordinates in ascending order
  // This allows us to process points from left to right
  xCoords.sort((a, b) => a - b);

  // Step 3: Initialize counters
  let rectangles = 0; // Count of rectangles used
  let coverageEnd = -Infinity; // Rightmost x covered by current rectangle

  // Step 4: Process each point from left to right
  for (const x of xCoords) {
    // If current point is not covered by the previous rectangle
    if (x > coverageEnd) {
      // Place a new rectangle with its left edge at this point
      // This rectangle covers [x, x + w] on the x-axis
      rectangles++;
      coverageEnd = x + w;
    }
  }

  return rectangles;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.Arrays;

class Solution {
    /**
     * Returns the minimum number of rectangles needed to cover all points.
     *
     * @param points Array of [x, y] coordinates
     * @param w Width of each rectangle
     * @return Minimum number of rectangles
     */
    public int minRectanglesToCoverPoints(int[][] points, int w) {
        // Step 1: Extract x-coordinates from all points
        // We only need x-values since rectangles have unlimited height
        int n = points.length;
        int[] xCoords = new int[n];
        for (int i = 0; i < n; i++) {
            xCoords[i] = points[i][0];
        }

        // Step 2: Sort x-coordinates in ascending order
        // This allows us to process points from left to right
        Arrays.sort(xCoords);

        // Step 3: Initialize counters
        int rectangles = 0;               // Count of rectangles used
        long coverageEnd = Long.MIN_VALUE; // Rightmost x covered by current rectangle
        // Using long to avoid integer overflow when x + w is large

        // Step 4: Process each point from left to right
        for (int x : xCoords) {
            // If current point is not covered by the previous rectangle
            if (x > coverageEnd) {
                // Place a new rectangle with its left edge at this point
                // This rectangle covers [x, x + w] on the x-axis
                rectangles++;
                coverageEnd = (long)x + w;
            }
        }

        return rectangles;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Extracting x-coordinates: O(n)
- Sorting x-coordinates: O(n log n) - this dominates
- Single pass through sorted coordinates: O(n)
- Total: O(n log n)

**Space Complexity: O(n)**

- Storing the array of x-coordinates: O(n)
- Sorting typically requires O(n) space (for Timsort in Python, merge sort variants in Java/JavaScript)
- Could be optimized to O(1) if we sort points in-place and track x-coordinates, but the problem gives points as input we shouldn't modify

The log factor comes from sorting. Since we must process points in left-to-right order for the greedy algorithm to work, sorting is necessary.

## Common Mistakes

1. **Forgetting to sort**: The greedy algorithm only works when processing points in increasing x-order. Without sorting, you might place rectangles suboptimally.

2. **Incorrect rectangle placement**: Some candidates try to center the rectangle or place it ending at the point. The optimal placement is always with the left edge at the current uncovered point's x-coordinate.

3. **Integer overflow**: When `x` and `w` are large integers (up to 10^9), `x + w` can overflow 32-bit integers. Use 64-bit integers (long in Java, normal ints are fine in Python).

4. **Overcomplicating with y-coordinates**: The problem mentions y-coordinates, but they're irrelevant since rectangles have unlimited height. Some candidates waste time considering y-values or trying 2D approaches.

5. **Off-by-one with coverage check**: The condition should be `x > coverageEnd`, not `x >= coverageEnd`. If a point is exactly at the right edge of a rectangle (x = coverageEnd), it's covered by that rectangle.

## When You'll See This Pattern

This **greedy interval covering** pattern appears in many scheduling and coverage problems:

1. **Minimum Number of Arrows to Burst Balloons (LeetCode 452)** - Almost identical! Instead of rectangles covering points, it's arrows bursting balloons. The greedy strategy is the same: sort by end points and shoot arrows at the earliest end point that covers overlapping intervals.

2. **Video Stitching (LeetCode 1024)** - Cover a time interval with video clips. Sort clips by start time, then greedily choose the clip that extends furthest while covering the current time.

3. **Meeting Rooms II (LeetCode 253)** - While not identical, it uses similar interval thinking. You're finding the maximum number of overlapping intervals, which requires sorting and greedy processing.

The pattern: When you need to cover points or intervals with minimum resources, and choices are "where to place" or "when to schedule" something, think about sorting and greedy selection.

## Key Takeaways

1. **Reduce dimensionality**: Many 2D problems can be reduced to 1D by recognizing constraints. Here, unlimited height made y-coordinates irrelevant.

2. **Greedy works for interval covering**: When you can choose where to place intervals of fixed length to cover points, placing each interval as far left as possible (starting at the leftmost uncovered point) is optimal.

3. **Sorting enables greedy**: Most greedy algorithms on arrays require sorting first. The sorting cost (O(n log n)) is often acceptable and enables linear-time greedy processing.

4. **Recognize the pattern**: "Minimum number of X to cover Y" with fixed-size coverings often reduces to this interval covering template.

Related problems: [Minimum Area Rectangle](/problem/minimum-area-rectangle), [K Closest Points to Origin](/problem/k-closest-points-to-origin)
