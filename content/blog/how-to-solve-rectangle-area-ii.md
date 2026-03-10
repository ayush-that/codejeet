---
title: "How to Solve Rectangle Area II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Rectangle Area II. Hard difficulty, 55.9% acceptance rate. Topics: Array, Segment Tree, Sweep Line, Ordered Set."
date: "2028-10-10"
category: "dsa-patterns"
tags: ["rectangle-area-ii", "array", "segment-tree", "sweep-line", "hard"]
---

# How to Solve Rectangle Area II

This problem asks us to calculate the total area covered by a set of axis-aligned rectangles, where rectangles may overlap. The challenge is that we need to avoid double-counting overlapping regions while efficiently handling potentially many rectangles (up to 200 in the constraints). A brute force approach that checks every point on a grid would be far too slow, so we need a smarter geometric approach.

## Visual Walkthrough

Let's walk through a simple example with two rectangles:

- Rectangle 1: [0,0,2,2] (area = 4)
- Rectangle 2: [1,1,3,3] (area = 4)

Visually, these rectangles overlap in a 1×1 square from (1,1) to (2,2). If we simply sum their areas (4 + 4 = 8), we'd double-count the overlapping 1×1 area. The correct total area is 4 + 4 - 1 = 7.

With more rectangles, the overlaps become more complex. Consider adding a third rectangle: [0.5,0.5,1.5,1.5]. Now we have three overlapping regions to account for. The key insight is that we need to find all unique x-coordinates and y-coordinates, then check which grid cells are covered by at least one rectangle.

## Brute Force Approach

A naive approach would be to create a 2D grid covering all possible coordinates and mark each cell as covered if it falls within any rectangle. However, coordinates can be large (up to 10^9), making this approach infeasible in both time and space.

Even if we discretize the coordinates (compress them to indices), a direct approach of checking every cell against every rectangle would be O(n³) where n is the number of rectangles. For 200 rectangles, this could mean checking up to 200³ = 8 million operations, which might be borderline acceptable but doesn't scale well and has implementation complexity.

The real issue with brute force is that we'd need to:

1. Find all unique x and y coordinates
2. Create a 2D boolean grid of size (unique_x × unique_y)
3. For each rectangle, mark all cells it covers as true
4. Sum the area of all true cells

This could work for small inputs but becomes inefficient for the problem constraints.

## Optimized Approach

The optimal solution uses a **sweep line algorithm** with **coordinate compression**:

1. **Coordinate Compression**: Since coordinates can be large but there are at most 2n unique x-values and 2n unique y-values (where n is the number of rectangles), we can map these to indices. This reduces our working space from potentially 10^9×10^9 to at most 400×400.

2. **Sweep Line Algorithm**: We sweep a vertical line from left to right across all x-coordinates. At each x-position, we maintain which y-intervals are currently "active" (covered by at least one rectangle).

3. **Event Processing**: For each rectangle, we create two events:
   - A "start" event at x1: add the rectangle's y-interval to active set
   - An "end" event at x2: remove the rectangle's y-interval from active set

4. **Area Calculation**: Between consecutive x-positions (x*i and x*{i+1}), we calculate:
   - Width = x\_{i+1} - x_i
   - Height = total length of active y-intervals
   - Area contribution = width × height

The key data structure we need is one that can efficiently:

- Add intervals (when we encounter a rectangle start)
- Remove intervals (when we encounter a rectangle end)
- Query the total covered length of all active intervals

We can implement this using a simple array or a segment tree. For this problem, since n ≤ 200, a simple array approach works well.

## Optimal Solution

Here's the complete solution using sweep line with coordinate compression:

<div class="code-group">

```python
# Time: O(n^3) worst case but O(n^2) typical due to constraints
# Space: O(n^2) for the grid
def rectangleArea(rectangles):
    """
    Calculate total area covered by rectangles using sweep line algorithm.
    """
    # Step 1: Collect all unique x and y coordinates
    xs = set()
    ys = set()

    for x1, y1, x2, y2 in rectangles:
        xs.add(x1)
        xs.add(x2)
        ys.add(y1)
        ys.add(y2)

    # Sort coordinates for binary search
    xs = sorted(xs)
    ys = sorted(ys)

    # Create mapping from coordinate to index
    x_idx = {x: i for i, x in enumerate(xs)}
    y_idx = {y: i for i, y in enumerate(ys)}

    # Step 2: Create a 2D grid to mark coverage
    # grid[i][j] = True if cell (i,j) is covered by at least one rectangle
    m, n = len(xs), len(ys)
    grid = [[False] * n for _ in range(m)]

    # Step 3: Mark all covered cells
    for x1, y1, x2, y2 in rectangles:
        # Convert coordinates to indices
        i1, i2 = x_idx[x1], x_idx[x2]
        j1, j2 = y_idx[y1], y_idx[y2]

        # Mark all cells in this rectangle as covered
        for i in range(i1, i2):
            for j in range(j1, j2):
                grid[i][j] = True

    # Step 4: Calculate total area
    MOD = 10**9 + 7
    area = 0

    for i in range(m - 1):
        for j in range(n - 1):
            if grid[i][j]:
                # Calculate area of this cell
                width = xs[i + 1] - xs[i]
                height = ys[j + 1] - ys[j]
                area = (area + width * height) % MOD

    return area
```

```javascript
// Time: O(n^3) worst case but O(n^2) typical due to constraints
// Space: O(n^2) for the grid
function rectangleArea(rectangles) {
  // Step 1: Collect all unique x and y coordinates
  const xs = new Set();
  const ys = new Set();

  for (const [x1, y1, x2, y2] of rectangles) {
    xs.add(x1);
    xs.add(x2);
    ys.add(y1);
    ys.add(y2);
  }

  // Sort coordinates for binary search
  const xsSorted = Array.from(xs).sort((a, b) => a - b);
  const ysSorted = Array.from(ys).sort((a, b) => a - b);

  // Create mapping from coordinate to index
  const xIdx = new Map();
  const yIdx = new Map();

  xsSorted.forEach((x, i) => xIdx.set(x, i));
  ysSorted.forEach((y, i) => yIdx.set(y, i));

  // Step 2: Create a 2D grid to mark coverage
  const m = xsSorted.length;
  const n = ysSorted.length;
  const grid = Array(m)
    .fill()
    .map(() => Array(n).fill(false));

  // Step 3: Mark all covered cells
  for (const [x1, y1, x2, y2] of rectangles) {
    // Convert coordinates to indices
    const i1 = xIdx.get(x1);
    const i2 = xIdx.get(x2);
    const j1 = yIdx.get(y1);
    const j2 = yIdx.get(y2);

    // Mark all cells in this rectangle as covered
    for (let i = i1; i < i2; i++) {
      for (let j = j1; j < j2; j++) {
        grid[i][j] = true;
      }
    }
  }

  // Step 4: Calculate total area
  const MOD = 10 ** 9 + 7;
  let area = 0;

  for (let i = 0; i < m - 1; i++) {
    for (let j = 0; j < n - 1; j++) {
      if (grid[i][j]) {
        // Calculate area of this cell
        const width = xsSorted[i + 1] - xsSorted[i];
        const height = ysSorted[j + 1] - ysSorted[j];
        area = (area + width * height) % MOD;
      }
    }
  }

  return area;
}
```

```java
// Time: O(n^3) worst case but O(n^2) typical due to constraints
// Space: O(n^2) for the grid
import java.util.*;

class Solution {
    public int rectangleArea(int[][] rectangles) {
        // Step 1: Collect all unique x and y coordinates
        Set<Integer> xSet = new HashSet<>();
        Set<Integer> ySet = new HashSet<>();

        for (int[] rect : rectangles) {
            xSet.add(rect[0]);
            xSet.add(rect[2]);
            ySet.add(rect[1]);
            ySet.add(rect[3]);
        }

        // Sort coordinates
        Integer[] xs = xSet.toArray(new Integer[0]);
        Integer[] ys = ySet.toArray(new Integer[0]);
        Arrays.sort(xs);
        Arrays.sort(ys);

        // Create mapping from coordinate to index
        Map<Integer, Integer> xIdx = new HashMap<>();
        Map<Integer, Integer> yIdx = new HashMap<>();

        for (int i = 0; i < xs.length; i++) {
            xIdx.put(xs[i], i);
        }
        for (int i = 0; i < ys.length; i++) {
            yIdx.put(ys[i], i);
        }

        // Step 2: Create a 2D grid to mark coverage
        boolean[][] grid = new boolean[xs.length][ys.length];

        // Step 3: Mark all covered cells
        for (int[] rect : rectangles) {
            int x1 = rect[0], y1 = rect[1], x2 = rect[2], y2 = rect[3];

            // Convert coordinates to indices
            int i1 = xIdx.get(x1);
            int i2 = xIdx.get(x2);
            int j1 = yIdx.get(y1);
            int j2 = yIdx.get(y2);

            // Mark all cells in this rectangle as covered
            for (int i = i1; i < i2; i++) {
                for (int j = j1; j < j2; j++) {
                    grid[i][j] = true;
                }
            }
        }

        // Step 4: Calculate total area
        long area = 0;
        final int MOD = 1_000_000_007;

        for (int i = 0; i < xs.length - 1; i++) {
            for (int j = 0; j < ys.length - 1; j++) {
                if (grid[i][j]) {
                    // Calculate area of this cell
                    long width = (long) xs[i + 1] - xs[i];
                    long height = (long) ys[j + 1] - ys[j];
                    area = (area + width * height) % MOD;
                }
            }
        }

        return (int) area;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n³) in the worst case, but typically O(n²) for the given constraints. Here's why:

- Collecting unique coordinates: O(n)
- Sorting coordinates: O(n log n) where n is number of rectangles
- Marking grid cells: For each rectangle, we iterate over its cells. In worst case, each rectangle could cover O(n²) cells, leading to O(n³). However, with n ≤ 200, this is acceptable.
- Calculating area: O(m × n) where m and n are number of unique coordinates (≤ 400)

**Space Complexity:** O(n²) for the grid, where n is the number of unique coordinates (at most 400).

## Common Mistakes

1. **Forgetting to use modulo operation**: The problem requires returning result modulo 10^9+7. Candidates often calculate the correct area but forget the modulo, or apply it incorrectly during intermediate calculations.

2. **Off-by-one errors in coordinate mapping**: When converting from continuous coordinates to discrete indices, it's easy to confuse whether to use `i` or `i+1`. Remember: if xs[i] = x1 and xs[i+1] = x2, then the width is xs[i+1] - xs[i].

3. **Incorrect handling of overlapping areas**: Simply summing rectangle areas without accounting for overlaps gives wrong results. The grid approach automatically handles this because each cell is either covered or not.

4. **Integer overflow**: When coordinates are large (up to 10^9), multiplying width × height can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, normal int in Python handles big integers).

## When You'll See This Pattern

The sweep line algorithm with coordinate compression appears in several geometric problems:

1. **The Skyline Problem (LeetCode 218)**: Similar concept of processing events at x-coordinates and maintaining active heights. Instead of summing area, we track the maximum height at each x.

2. **Merge Intervals (LeetCode 56)**: A simpler 1D version of the same concept. The active set management is similar to merging overlapping intervals.

3. **Range Addition (LeetCode 370)**: Uses similar event-based approach for 1D range updates.

The pattern is: when you need to process events in sorted order and maintain some state (like active intervals), think sweep line. When coordinates are large but sparse, think coordinate compression.

## Key Takeaways

1. **Sweep line transforms 2D problems into 1D**: By sweeping across one dimension (x), we reduce the problem to maintaining active intervals in the other dimension (y).

2. **Coordinate compression makes large ranges manageable**: Even with coordinates up to 10^9, we only need to consider the 2n unique values that actually matter.

3. **Event-driven processing is efficient**: Instead of checking every point, we only process changes (rectangle starts and ends), which are O(n) events rather than O(area) points.

Related problems: [Separate Squares II](/problem/separate-squares-ii)
