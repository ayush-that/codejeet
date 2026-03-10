---
title: "How to Solve Check if Grid can be Cut into Sections — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check if Grid can be Cut into Sections. Medium difficulty, 68.3% acceptance rate. Topics: Array, Sorting."
date: "2027-03-26"
category: "dsa-patterns"
tags: ["check-if-grid-can-be-cut-into-sections", "array", "sorting", "medium"]
---

# How to Solve "Check if Grid can be Cut into Sections"

This problem asks whether we can cut an `n x n` grid into non-overlapping sections by making cuts along the boundaries of given rectangles. Each rectangle is defined by its bottom-left `(startx, starty)` and top-right `(endx, endy)` coordinates. The challenge lies in determining whether these rectangles collectively form complete horizontal and vertical cuts that partition the entire grid into distinct sections without gaps or overlaps.

What makes this problem interesting is that it's essentially a **coordinate compression and interval merging** problem disguised as a geometry puzzle. The key insight is that we need to check two independent dimensions separately: whether the x-intervals and y-intervals of the rectangles form complete partitions of the grid.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose `n = 5` and we have rectangles:

```
rectangles = [[1,0,3,2], [3,0,5,3], [0,2,1,5], [1,3,5,5]]
```

Visually, the grid looks like this:

```
y=5: |   |███|███|███|
y=4: |   |███|███|███|
y=3: |   |███|███|███|
y=2: |███|███|   |   |
y=1: |███|███|   |   |
y=0: |   |███|███|   |
      x=0 1   3   5
```

**Step 1: Analyze x-direction intervals**

- Rectangle 1: x-range [1,3]
- Rectangle 2: x-range [3,5]
- Rectangle 3: x-range [0,1]
- Rectangle 4: x-range [1,5]

If we sort and merge overlapping x-intervals:

1. Sort by startx: [0,1], [1,3], [1,5], [3,5]
2. Merge overlapping: [0,1] + [1,3] = [0,3], then [0,3] + [1,5] = [0,5]
3. Result: single interval [0,5] covers entire x-range ✓

**Step 2: Analyze y-direction intervals**

- Rectangle 1: y-range [0,2]
- Rectangle 2: y-range [0,3]
- Rectangle 3: y-range [2,5]
- Rectangle 4: y-range [3,5]

If we sort and merge overlapping y-intervals:

1. Sort by starty: [0,2], [0,3], [2,5], [3,5]
2. Merge overlapping: [0,2] + [0,3] = [0,3], then [0,3] + [2,5] = [0,5]
3. Result: single interval [0,5] covers entire y-range ✓

Since both dimensions have intervals covering the full range, we can cut the grid into sections.

## Brute Force Approach

A naive approach would be to simulate the grid as a 2D array and mark covered cells, then check if the uncovered cells form connected components. However, this fails because:

1. `n` can be up to 10^9, so we can't allocate an `n x n` grid
2. Even with smaller `n`, this would be O(n²) which is infeasible

Another brute force idea: check all possible cut positions by examining every x-coordinate and y-coordinate from the rectangles. For each candidate cut position, verify if rectangles on both sides are separated. This would be O(m²) where m is the number of rectangles (up to 10^5), which is still too slow at O(10^10) operations.

The fundamental issue with brute force is that it doesn't leverage the structure of the problem: we only need to know if the rectangles' projections onto the x and y axes cover the entire range, not the exact 2D arrangement.

## Optimized Approach

The key insight is that **the grid can be cut into sections if and only if both of these conditions hold**:

1. The x-intervals of the rectangles (when merged) cover the entire range [0, n]
2. The y-intervals of the rectangles (when merged) cover the entire range [0, n]

Why does this work? If the x-intervals cover [0, n], then for every x-coordinate from 0 to n, there's at least one rectangle covering it. This means no vertical line can be drawn through the entire grid without hitting a rectangle. Similarly for y-intervals. When both conditions hold, rectangles form a connected "barrier" that prevents any continuous cut through the grid.

The algorithm:

1. Extract all x-intervals `[startx, endx]` from rectangles
2. Sort them by startx, then merge overlapping intervals
3. Check if merged intervals cover [0, n]
4. Repeat steps 1-3 for y-intervals `[starty, endy]`
5. Return true only if both x and y intervals cover their full ranges

## Optimal Solution

<div class="code-group">

```python
# Time: O(m log m) where m = len(rectangles)
# Space: O(m) for storing intervals
def canCutGrid(n, rectangles):
    """
    Check if rectangles can partition the grid by checking if their
    projections on x and y axes both cover the entire range [0, n].
    """

    def intervals_cover_full_range(intervals):
        """Check if merged intervals cover [0, n]."""
        if not intervals:
            return False

        # Sort intervals by their start position
        intervals.sort(key=lambda x: x[0])

        # Initialize with first interval
        merged = []
        current_start, current_end = intervals[0]

        for start, end in intervals[1:]:
            if start <= current_end:
                # Intervals overlap or touch, merge them
                current_end = max(current_end, end)
            else:
                # No overlap, add current interval and start new one
                merged.append([current_start, current_end])
                current_start, current_end = start, end

        # Add the last interval
        merged.append([current_start, current_end])

        # Check if merged intervals cover [0, n]
        # They must start at 0, end at n, and have no gaps
        if merged[0][0] != 0:
            return False

        # Track how far we've covered
        covered_end = merged[0][1]
        for i in range(1, len(merged)):
            if merged[i][0] > covered_end:
                # Found a gap
                return False
            covered_end = max(covered_end, merged[i][1])

        return covered_end == n

    # Extract x-intervals: [startx, endx]
    x_intervals = [[rect[0], rect[2]] for rect in rectangles]

    # Extract y-intervals: [starty, endy]
    y_intervals = [[rect[1], rect[3]] for rect in rectangles]

    # Both x and y intervals must cover [0, n]
    return intervals_cover_full_range(x_intervals) and intervals_cover_full_range(y_intervals)
```

```javascript
// Time: O(m log m) where m = rectangles.length
// Space: O(m) for storing intervals
function canCutGrid(n, rectangles) {
  /**
   * Check if rectangles can partition the grid by checking if their
   * projections on x and y axes both cover the entire range [0, n].
   */

  function intervalsCoverFullRange(intervals) {
    /** Check if merged intervals cover [0, n]. */
    if (intervals.length === 0) return false;

    // Sort intervals by their start position
    intervals.sort((a, b) => a[0] - b[0]);

    // Initialize with first interval
    const merged = [];
    let [currentStart, currentEnd] = intervals[0];

    for (let i = 1; i < intervals.length; i++) {
      const [start, end] = intervals[i];
      if (start <= currentEnd) {
        // Intervals overlap or touch, merge them
        currentEnd = Math.max(currentEnd, end);
      } else {
        // No overlap, add current interval and start new one
        merged.push([currentStart, currentEnd]);
        currentStart = start;
        currentEnd = end;
      }
    }

    // Add the last interval
    merged.push([currentStart, currentEnd]);

    // Check if merged intervals cover [0, n]
    // They must start at 0, end at n, and have no gaps
    if (merged[0][0] !== 0) return false;

    // Track how far we've covered
    let coveredEnd = merged[0][1];
    for (let i = 1; i < merged.length; i++) {
      if (merged[i][0] > coveredEnd) {
        // Found a gap
        return false;
      }
      coveredEnd = Math.max(coveredEnd, merged[i][1]);
    }

    return coveredEnd === n;
  }

  // Extract x-intervals: [startx, endx]
  const xIntervals = rectangles.map((rect) => [rect[0], rect[2]]);

  // Extract y-intervals: [starty, endy]
  const yIntervals = rectangles.map((rect) => [rect[1], rect[3]]);

  // Both x and y intervals must cover [0, n]
  return intervalsCoverFullRange(xIntervals) && intervalsCoverFullRange(yIntervals);
}
```

```java
// Time: O(m log m) where m = rectangles.length
// Space: O(m) for storing intervals
import java.util.*;

public class Solution {
    public boolean canCutGrid(int n, int[][] rectangles) {
        /**
         * Check if rectangles can partition the grid by checking if their
         * projections on x and y axes both cover the entire range [0, n].
         */

        // Extract x-intervals: [startx, endx]
        List<int[]> xIntervals = new ArrayList<>();
        for (int[] rect : rectangles) {
            xIntervals.add(new int[]{rect[0], rect[2]});
        }

        // Extract y-intervals: [starty, endy]
        List<int[]> yIntervals = new ArrayList<>();
        for (int[] rect : rectangles) {
            yIntervals.add(new int[]{rect[1], rect[3]});
        }

        // Both x and y intervals must cover [0, n]
        return intervalsCoverFullRange(xIntervals, n) &&
               intervalsCoverFullRange(yIntervals, n);
    }

    private boolean intervalsCoverFullRange(List<int[]> intervals, int n) {
        /** Check if merged intervals cover [0, n]. */
        if (intervals.isEmpty()) return false;

        // Sort intervals by their start position
        intervals.sort((a, b) -> Integer.compare(a[0], b[0]));

        // Initialize with first interval
        List<int[]> merged = new ArrayList<>();
        int currentStart = intervals.get(0)[0];
        int currentEnd = intervals.get(0)[1];

        for (int i = 1; i < intervals.size(); i++) {
            int start = intervals.get(i)[0];
            int end = intervals.get(i)[1];

            if (start <= currentEnd) {
                // Intervals overlap or touch, merge them
                currentEnd = Math.max(currentEnd, end);
            } else {
                // No overlap, add current interval and start new one
                merged.add(new int[]{currentStart, currentEnd});
                currentStart = start;
                currentEnd = end;
            }
        }

        // Add the last interval
        merged.add(new int[]{currentStart, currentEnd});

        // Check if merged intervals cover [0, n]
        // They must start at 0, end at n, and have no gaps
        if (merged.get(0)[0] != 0) return false;

        // Track how far we've covered
        int coveredEnd = merged.get(0)[1];
        for (int i = 1; i < merged.size(); i++) {
            if (merged.get(i)[0] > coveredEnd) {
                // Found a gap
                return false;
            }
            coveredEnd = Math.max(coveredEnd, merged.get(i)[1]);
        }

        return coveredEnd == n;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m log m) where m is the number of rectangles

- We extract intervals: O(m)
- We sort intervals twice (x and y): O(2m log m) = O(m log m)
- We merge intervals twice: O(2m) = O(m)
- Total: O(m log m) dominates

**Space Complexity:** O(m)

- We store x-intervals: O(m)
- We store y-intervals: O(m)
- We store merged intervals: O(m) in worst case (when no intervals overlap)
- Total: O(m)

## Common Mistakes

1. **Not handling touching intervals correctly**: Intervals that touch at endpoints (e.g., [0,2] and [2,4]) should be merged because they form a continuous coverage. The condition for merging should be `start ≤ currentEnd` not `start < currentEnd`.

2. **Forgetting to check both dimensions**: Some candidates check only x-intervals or only y-intervals. Both must cover [0, n] for the grid to be partitionable.

3. **Incorrect sorting**: Sorting by end coordinate instead of start coordinate leads to incorrect merging logic. Always sort by start coordinate when merging intervals.

4. **Not checking the start at 0**: The merged intervals must start exactly at 0. If the first interval starts at 1, there's a gap from 0 to 1, so the answer should be false.

5. **Assuming rectangles don't overlap**: The problem doesn't say rectangles are non-overlapping, so we must merge overlapping intervals. Overlapping rectangles still contribute to coverage.

## When You'll See This Pattern

This problem uses **interval merging** and **coordinate projection**, which appear in many coding problems:

1. **Merge Intervals (LeetCode 56)**: Direct application of interval merging. This problem is essentially "check if merged intervals cover [0, n]" applied twice.

2. **Non-overlapping Intervals (LeetCode 435)**: Similar interval manipulation but with a different goal (minimizing removals rather than checking coverage).

3. **Meeting Rooms II (LeetCode 253)**: Uses interval sorting and scanning to find maximum overlap, which is related to how we process intervals here.

4. **Rectangle Area II (LeetCode 850)**: More complex but uses similar concepts of projecting rectangles onto axes and dealing with intervals.

The pattern to recognize: when a 2D problem can be decomposed into independent 1D problems, consider projecting onto axes. When dealing with ranges/coverage, think about sorting and merging intervals.

## Key Takeaways

1. **Dimensionality reduction**: Many 2D geometry problems can be solved by analyzing x and y dimensions separately. If a condition must hold in both dimensions independently, check them separately.

2. **Interval merging pattern**: When checking coverage of a range, sort intervals by start, merge overlapping/touching ones, then verify they cover the entire range without gaps.

3. **Touch vs overlap distinction**: In coverage problems, intervals that touch at endpoints (end of one equals start of next) should typically be merged since they create continuous coverage.

[Practice this problem on CodeJeet](/problem/check-if-grid-can-be-cut-into-sections)
