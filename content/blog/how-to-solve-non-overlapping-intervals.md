---
title: "How to Solve Non-overlapping Intervals — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Non-overlapping Intervals. Medium difficulty, 56.7% acceptance rate. Topics: Array, Dynamic Programming, Greedy, Sorting."
date: "2026-10-23"
category: "dsa-patterns"
tags: ["non-overlapping-intervals", "array", "dynamic-programming", "greedy", "medium"]
---

# How to Solve Non-overlapping Intervals

This problem asks us to find the minimum number of intervals to remove from a collection so that the remaining intervals don't overlap. What makes this problem interesting is that while it sounds like we need to remove intervals, we're actually solving for the maximum number of intervals we can keep without overlaps. This subtle reframing is key to finding an efficient solution.

## Visual Walkthrough

Let's trace through an example: `intervals = [[1,2], [2,3], [3,4], [1,3]]`

We want to remove as few intervals as possible to eliminate all overlaps. Notice that intervals that just touch at endpoints (like `[1,2]` and `[2,3]`) are considered non-overlapping.

Here's how we can think about it:

1. Sort the intervals by their end times: `[[1,2], [2,3], [1,3], [3,4]]`
2. Keep track of the last interval we kept (initially none)
3. For each interval:
   - If it doesn't overlap with the last kept interval, keep it
   - If it does overlap, we need to remove one of them

Let's walk through:

- Start with `[1,2]` (end=2) - keep it, last_end = 2
- Next `[2,3]` (start=2, end=3) - start=2 equals last_end=2, so no overlap, keep it, last_end = 3
- Next `[1,3]` (start=1, end=3) - start=1 < last_end=3, so they overlap! Remove `[1,3]` (removals=1)
- Next `[3,4]` (start=3, end=4) - start=3 equals last_end=3, so no overlap, keep it

We removed 1 interval. The optimal solution is indeed to remove `[1,3]`.

## Brute Force Approach

A brute force approach would try all possible subsets of intervals and check which ones are non-overlapping. For each subset:

1. Check if all intervals in the subset are non-overlapping
2. Track the largest subset found
3. The answer is total intervals minus size of largest non-overlapping subset

This approach has exponential time complexity O(2ⁿ × n) since there are 2ⁿ subsets and checking each subset takes O(n) time. For n=20, that's over 1 million operations × 20 checks = 20 million operations. For n=1000, it's completely infeasible.

Even a dynamic programming approach that sorts by start time and uses memoization would be O(n²), which is still too slow for large inputs.

## Optimized Approach

The key insight is that this is actually an **interval scheduling problem**. We want to maximize the number of non-overlapping intervals we can keep. Once we reframe it this way, a greedy approach becomes apparent:

**Sort intervals by their end time.** Why? Because if we want to fit as many intervals as possible, we should always pick the interval that finishes earliest, leaving more room for subsequent intervals.

Here's the step-by-step reasoning:

1. Sort all intervals by their end time (ascending)
2. Initialize a counter for intervals we keep (or equivalently, intervals we remove)
3. Keep track of the end time of the last interval we kept
4. Iterate through sorted intervals:
   - If current interval's start ≥ last kept interval's end: no overlap, keep it
   - Otherwise: overlap detected, we need to remove one
     - Which one to remove? The one that ends later (the current one), because it leaves less room for future intervals

This greedy choice is optimal because by always keeping the interval that ends earliest, we maximize the space available for future intervals.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting, O(n) for iteration = O(n log n)
# Space: O(1) if we sort in-place, O(n) if we need to copy (Python's sort is O(n) space)
def eraseOverlapIntervals(intervals):
    """
    Returns the minimum number of intervals to remove to make all intervals non-overlapping.

    Approach: Sort by end time, then greedily keep intervals that don't overlap with the last kept interval.
    This maximizes the number of intervals we can keep, which minimizes the number we need to remove.
    """
    if not intervals:
        return 0

    # Step 1: Sort intervals by their end time
    # This allows us to always pick the interval that finishes earliest
    intervals.sort(key=lambda x: x[1])

    # Step 2: Initialize tracking variables
    removals = 0  # Count of intervals we need to remove
    last_end = intervals[0][1]  # End time of the last interval we kept
    # We always keep the first interval since it ends earliest

    # Step 3: Iterate through remaining intervals
    # Start from the second interval (index 1) since we already "kept" the first one
    for i in range(1, len(intervals)):
        current_start, current_end = intervals[i]

        # Check if current interval overlaps with last kept interval
        if current_start < last_end:
            # Overlap detected! We need to remove one interval
            removals += 1
            # We remove the current interval (implicitly by not updating last_end)
            # Why? Because last_end represents the interval that ends earlier,
            # which gives us more room for future intervals
        else:
            # No overlap, we can keep this interval
            # Update last_end to current interval's end time
            last_end = current_end

    return removals
```

```javascript
// Time: O(n log n) for sorting, O(n) for iteration = O(n log n)
// Space: O(1) if we sort in-place, but JavaScript's sort may use O(n) space
/**
 * Returns the minimum number of intervals to remove to make all intervals non-overlapping.
 *
 * Approach: Sort by end time, then greedily keep intervals that don't overlap with the last kept interval.
 * This maximizes the number of intervals we can keep, which minimizes the number we need to remove.
 */
function eraseOverlapIntervals(intervals) {
  if (!intervals || intervals.length === 0) {
    return 0;
  }

  // Step 1: Sort intervals by their end time (second element)
  // This allows us to always pick the interval that finishes earliest
  intervals.sort((a, b) => a[1] - b[1]);

  // Step 2: Initialize tracking variables
  let removals = 0; // Count of intervals we need to remove
  let lastEnd = intervals[0][1]; // End time of the last interval we kept
  // We always keep the first interval since it ends earliest

  // Step 3: Iterate through remaining intervals
  // Start from the second interval (index 1) since we already "kept" the first one
  for (let i = 1; i < intervals.length; i++) {
    const [currentStart, currentEnd] = intervals[i];

    // Check if current interval overlaps with last kept interval
    if (currentStart < lastEnd) {
      // Overlap detected! We need to remove one interval
      removals++;
      // We remove the current interval (implicitly by not updating lastEnd)
      // Why? Because lastEnd represents the interval that ends earlier,
      // which gives us more room for future intervals
    } else {
      // No overlap, we can keep this interval
      // Update lastEnd to current interval's end time
      lastEnd = currentEnd;
    }
  }

  return removals;
}
```

```java
// Time: O(n log n) for sorting, O(n) for iteration = O(n log n)
// Space: O(1) if we sort in-place, but Java's sort uses O(n) space for objects
import java.util.Arrays;

class Solution {
    /**
     * Returns the minimum number of intervals to remove to make all intervals non-overlapping.
     *
     * Approach: Sort by end time, then greedily keep intervals that don't overlap with the last kept interval.
     * This maximizes the number of intervals we can keep, which minimizes the number we need to remove.
     */
    public int eraseOverlapIntervals(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            return 0;
        }

        // Step 1: Sort intervals by their end time (second element)
        // This allows us to always pick the interval that finishes earliest
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

        // Step 2: Initialize tracking variables
        int removals = 0;  // Count of intervals we need to remove
        int lastEnd = intervals[0][1];  // End time of the last interval we kept
        // We always keep the first interval since it ends earliest

        // Step 3: Iterate through remaining intervals
        // Start from the second interval (index 1) since we already "kept" the first one
        for (int i = 1; i < intervals.length; i++) {
            int currentStart = intervals[i][0];
            int currentEnd = intervals[i][1];

            // Check if current interval overlaps with last kept interval
            if (currentStart < lastEnd) {
                // Overlap detected! We need to remove one interval
                removals++;
                // We remove the current interval (implicitly by not updating lastEnd)
                // Why? Because lastEnd represents the interval that ends earlier,
                // which gives us more room for future intervals
            } else {
                // No overlap, we can keep this interval
                // Update lastEnd to current interval's end time
                lastEnd = currentEnd;
            }
        }

        return removals;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the intervals takes O(n log n) time
- The single pass through the sorted array takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity: O(1) or O(n) depending on implementation**

- If we sort in-place: O(1) extra space (but sorting algorithms often use O(n) space internally)
- If we need to copy the array for sorting: O(n)
- The algorithm itself only uses a few variables (removals, last_end), so O(1) extra space beyond sorting

## Common Mistakes

1. **Sorting by start time instead of end time**: If you sort by start time, you might keep an interval that starts early but ends late, blocking many future intervals. Always sort by end time for interval scheduling problems.

2. **Incorrect overlap condition**: Remember that intervals that touch at endpoints are NOT overlapping. So the condition is `current_start < last_end`, not `current_start <= last_end`. This is explicitly stated in the problem but often missed.

3. **Forgetting to handle empty input**: Always check if the input array is empty or null. The problem doesn't explicitly say it won't be empty, so defensive programming is good practice.

4. **Not understanding the greedy choice**: When two intervals overlap, you need to remove one. The optimal choice is to remove the one that ends later. Some candidates try to remove based on start time or length, which doesn't guarantee optimality.

5. **Off-by-one in the loop**: Since we always keep the first interval, we should start iterating from index 1, not index 0. Starting from 0 would incorrectly count the first interval as a removal.

## When You'll See This Pattern

This "interval scheduling" pattern appears in many problems where you need to select non-overlapping intervals:

1. **Minimum Number of Arrows to Burst Balloons (LeetCode 452)**: Almost identical! Instead of removing intervals, you're finding points to "burst" overlapping intervals. The greedy approach is the same: sort by end coordinate.

2. **Meeting Rooms II (LeetCode 253)**: While this uses a different technique (min-heap), it's solving a related problem of scheduling meetings without overlap across multiple rooms.

3. **Maximum Length of Pair Chain (LeetCode 646)**: This is essentially the same problem but with a different framing - you're finding the longest chain of non-overlapping pairs.

4. **Video Stitching (LeetCode 1024)**: Another interval problem where you need to cover a range with minimal clips, using greedy selection.

The core pattern: when you need to maximize/minimize something with intervals, think about sorting by end time and using a greedy approach.

## Key Takeaways

1. **Reframe the problem**: "Minimum removals" = "Maximum intervals we can keep". This mental shift is crucial for finding the greedy solution.

2. **Sort by end time**: For interval scheduling problems where you want to maximize the number of non-overlapping intervals, always sort by end time. This lets you greedily select intervals that finish earliest.

3. **Greedy proof intuition**: By always keeping the interval that ends earliest, you leave the maximum possible room for future intervals. This local optimal choice leads to a global optimum.

4. **Watch the overlap condition**: Remember that intervals touching at endpoints are non-overlapping (`[1,2]` and `[2,3]` don't overlap). Use `<` not `<=` for the comparison.

Related problems: [Minimum Number of Arrows to Burst Balloons](/problem/minimum-number-of-arrows-to-burst-balloons), [Determine if Two Events Have Conflict](/problem/determine-if-two-events-have-conflict)
