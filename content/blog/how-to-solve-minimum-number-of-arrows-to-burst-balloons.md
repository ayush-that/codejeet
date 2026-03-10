---
title: "How to Solve Minimum Number of Arrows to Burst Balloons — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Arrows to Burst Balloons. Medium difficulty, 61.2% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2026-12-28"
category: "dsa-patterns"
tags: ["minimum-number-of-arrows-to-burst-balloons", "array", "greedy", "sorting", "medium"]
---

# How to Solve Minimum Number of Arrows to Burst Balloons

You're given a list of balloons represented as intervals on the x-axis, where each balloon spans from `xstart` to `xend`. Your task is to find the minimum number of vertical arrows needed to burst all balloons. An arrow shot at position `x` will burst any balloon whose interval contains `x`. This problem is interesting because it looks like a simple interval problem, but requires careful thinking about how to maximize the number of balloons each arrow can burst.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `points = [[10,16], [2,8], [1,6], [7,12]]`.

**Step 1: Sort by ending coordinate**
First, we sort the intervals by their ending coordinate:

- Sorted: `[[1,6], [2,8], [7,12], [10,16]]`

**Step 2: Shoot first arrow**
We start with the first balloon `[1,6]`. The optimal place to shoot is at its end point `x = 6`. This arrow will burst:

- `[1,6]` (contains 6)
- `[2,8]` (contains 6)

**Step 3: Move to next unburst balloon**
The next balloon not burst by our first arrow is `[7,12]`. We shoot at `x = 12`. This arrow bursts:

- `[7,12]` (contains 12)
- `[10,16]` (contains 12)

**Step 4: Result**
We used 2 arrows to burst all 4 balloons. The key insight: by always shooting at the end of the current balloon, we maximize the chance of bursting subsequent balloons that start before or at that point.

## Brute Force Approach

A naive approach would be to try all possible arrow positions. Since arrows can only be placed at integer coordinates within the range of balloon endpoints, we could:

1. Find the minimum start and maximum end across all balloons
2. Try every integer position in that range
3. For each position, check which balloons it bursts
4. Use a greedy or backtracking approach to find the minimum arrows

However, this approach has several problems:

- The range could be huge (up to 2³¹ - 1)
- Checking all positions is O(range × n), which is impractical
- Even with pruning, it's exponential in the worst case

The brute force approach doesn't give us a clear path to optimization because it doesn't leverage the interval structure of the problem.

## Optimized Approach

The key insight is that this is an **interval scheduling** problem. We want to find the minimum number of points (arrows) that intersect all intervals (balloons). This is equivalent to finding the maximum number of non-overlapping intervals, but with a twist: intervals that share endpoints can be burst by the same arrow.

Here's the step-by-step reasoning:

1. **Sort by ending coordinate**: This is crucial. By sorting intervals by their end point, we ensure that when we place an arrow, we're considering the earliest possible ending point for maximum coverage.

2. **Greedy arrow placement**: Start with the first interval and place an arrow at its end point. This arrow will burst all intervals that start before or at this arrow position (since they must overlap with the end point).

3. **Skip burst balloons**: Move to the next interval that starts AFTER the current arrow position. These balloons weren't burst by the current arrow.

4. **Repeat**: Place a new arrow at the end of this next unburst balloon and continue.

Why this works: At each step, we're choosing the arrow position that gives us the maximum "rightward coverage" while still bursting the current balloon. Any balloon that starts before our arrow position must intersect it (because we sorted by end point, so their end is ≥ current balloon's end).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting, O(n) for processing → O(n log n)
# Space: O(1) if we sort in-place, O(n) for Timsort's worst case
def findMinArrowShots(points):
    """
    Find minimum arrows to burst all balloons.

    Args:
        points: List of [start, end] intervals representing balloons

    Returns:
        Minimum number of arrows needed
    """
    # Edge case: no balloons
    if not points:
        return 0

    # Step 1: Sort balloons by their ending coordinate
    # This allows us to greedily place arrows at end points
    points.sort(key=lambda x: x[1])

    # Step 2: Initialize first arrow at the end of the first balloon
    arrows = 1
    current_arrow_pos = points[0][1]

    # Step 3: Process remaining balloons
    for start, end in points[1:]:
        # If this balloon starts after the current arrow position,
        # it's not burst by the current arrow
        if start > current_arrow_pos:
            # We need a new arrow for this balloon
            arrows += 1
            # Place it at the end of this balloon
            current_arrow_pos = end

    return arrows
```

```javascript
// Time: O(n log n) for sorting, O(n) for processing → O(n log n)
// Space: O(1) if we sort in-place, O(n) for sorting algorithm's space
function findMinArrowShots(points) {
  /**
   * Find minimum arrows to burst all balloons.
   *
   * @param {number[][]} points - Array of [start, end] intervals
   * @return {number} Minimum arrows needed
   */

  // Edge case: no balloons
  if (points.length === 0) {
    return 0;
  }

  // Step 1: Sort balloons by their ending coordinate
  // Using localeCompare to handle large numbers correctly
  points.sort((a, b) => a[1] - b[1]);

  // Step 2: Initialize first arrow
  let arrows = 1;
  let currentArrowPos = points[0][1];

  // Step 3: Process remaining balloons
  for (let i = 1; i < points.length; i++) {
    const [start, end] = points[i];

    // If balloon starts after current arrow, need new arrow
    if (start > currentArrowPos) {
      arrows++;
      currentArrowPos = end;
    }
    // Note: we don't need an else branch because if start <= currentArrowPos,
    // the balloon is already burst by the current arrow
  }

  return arrows;
}
```

```java
// Time: O(n log n) for sorting, O(n) for processing → O(n log n)
// Space: O(1) if we sort in-place, O(n) for sorting algorithm's space
import java.util.Arrays;

class Solution {
    public int findMinArrowShots(int[][] points) {
        /**
         * Find minimum arrows to burst all balloons.
         *
         * @param points Array of [start, end] intervals
         * @return Minimum arrows needed
         */

        // Edge case: no balloons
        if (points.length == 0) {
            return 0;
        }

        // Step 1: Sort balloons by their ending coordinate
        // Using lambda comparator for cleaner code
        Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));

        // Step 2: Initialize first arrow
        int arrows = 1;
        int currentArrowPos = points[0][1];

        // Step 3: Process remaining balloons
        for (int i = 1; i < points.length; i++) {
            int start = points[i][0];
            int end = points[i][1];

            // If balloon starts after current arrow, need new arrow
            if (start > currentArrowPos) {
                arrows++;
                currentArrowPos = end;
            }
            // No else needed - balloon is burst by current arrow if start <= currentArrowPos
        }

        return arrows;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the intervals takes O(n log n) time
- The single pass through the sorted array takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity: O(1) or O(n)**

- If we sort in-place: O(1) additional space (but some sorting algorithms like Timsort in Python use O(n) in worst case)
- If we create a new sorted array: O(n)
- The algorithm itself only uses a few variables (arrows, currentArrowPos), so O(1) beyond sorting

## Common Mistakes

1. **Sorting by start instead of end**: This is the most common mistake. If you sort by start coordinate, you might place arrows suboptimally. Example: `[[1,10], [2,3], [4,5]]`. Sorted by start, you'd place an arrow at 10, then need more arrows. Sorted by end, you'd place at 3, then 5, and burst all with 2 arrows.

2. **Using `>=` instead of `>` in the comparison**: The problem states that if an arrow is at position `x`, it bursts balloons where `xstart ≤ x ≤ xend`. So when checking if a balloon is already burst, we use `start > currentArrowPos` (strictly greater), not `>=`. A balloon starting exactly at the arrow position can be burst by that arrow.

3. **Integer overflow with large numbers**: When subtracting large integers (like in JavaScript's sort comparator), you can get overflow. Use `a[1] - b[1]` carefully, or use explicit comparison: `a[1] < b[1] ? -1 : (a[1] > b[1] ? 1 : 0)`.

4. **Forgetting to handle empty input**: Always check for edge cases. If `points` is empty, we need 0 arrows, not 1.

## When You'll See This Pattern

This problem uses the **interval scheduling** pattern, which appears in many coding interview problems:

1. **Non-overlapping Intervals (LeetCode 435)**: Find the minimum number of intervals to remove to make all intervals non-overlapping. The solution is almost identical — sort by end and greedily keep intervals that don't overlap.

2. **Meeting Rooms II (LeetCode 253)**: Find the minimum number of conference rooms required. While often solved with a different approach (sweep line), it's conceptually similar — you're finding points of maximum overlap.

3. **Merge Intervals (LeetCode 56)**: Merge all overlapping intervals. The pattern of sorting by start and then merging overlapping intervals is related, though the goal is different.

The key insight for all these problems: **sorting intervals by one coordinate (usually end) enables greedy solutions that process intervals in an optimal order.**

## Key Takeaways

1. **Sort by end point for minimum points/arrows problems**: When you need to find the minimum number of points to cover all intervals, sorting by end coordinate and placing points at ends gives an optimal greedy solution.

2. **Greedy works when local optimal choices lead to global optimum**: This is a classic example where making the best choice at each step (shoot at the current balloon's end) gives the overall best solution.

3. **Interval problems often reduce to sorting + single pass**: Many interval problems can be solved efficiently by sorting once and then making a single pass through the data with O(1) operations per interval.

**Related problems:** [Meeting Rooms II](/problem/meeting-rooms-ii), [Non-overlapping Intervals](/problem/non-overlapping-intervals)
