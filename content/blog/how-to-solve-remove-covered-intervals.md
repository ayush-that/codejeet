---
title: "How to Solve Remove Covered Intervals — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Covered Intervals. Medium difficulty, 56.1% acceptance rate. Topics: Array, Sorting."
date: "2026-10-25"
category: "dsa-patterns"
tags: ["remove-covered-intervals", "array", "sorting", "medium"]
---

# How to Solve Remove Covered Intervals

This problem asks us to count how many intervals remain after removing all intervals that are completely covered by another interval. An interval `[a, b)` is covered by `[c, d)` if `c ≤ a` and `b ≤ d`. What makes this problem interesting is that we need to efficiently identify these coverage relationships without comparing every pair of intervals, which would be too slow for large inputs.

## Visual Walkthrough

Let's trace through an example: `intervals = [[1,4],[3,6],[2,8]]`

We need to find intervals that are completely covered by others:

- `[1,4]` vs `[3,6]`: 3 > 1, so not covered
- `[1,4]` vs `[2,8]`: 2 > 1, so not covered
- `[3,6]` vs `[1,4]`: 1 < 3, but 4 < 6, so not covered
- `[3,6]` vs `[2,8]`: 2 < 3 and 8 > 6, so `[3,6]` IS covered by `[2,8]`
- `[2,8]` vs `[1,4]`: 1 < 2, but 4 < 8, so not covered
- `[2,8]` vs `[3,6]`: 3 > 2, so not covered

So `[3,6]` is covered and should be removed, leaving 2 intervals.

The challenge is doing this efficiently. If we sort intervals by their start points, we can process them in a single pass. Let's sort: `[[1,4],[2,8],[3,6]]`

Now we can track the "current maximum end point" as we go:

1. First interval `[1,4]`: max_end = 4, count = 1
2. Second interval `[2,8]`: start=2 ≥ 1, end=8 > 4 → not covered, update max_end = 8, count = 2
3. Third interval `[3,6]`: start=3 ≥ 2, end=6 ≤ 8 → COVERED! Don't increment count

We get the correct answer: 2 remaining intervals.

## Brute Force Approach

The brute force solution compares every pair of intervals to check if one covers the other. For each interval `i`, we check all other intervals `j` to see if `j` covers `i`. If we find any `j` that covers `i`, we mark `i` as covered and skip it.

**Why this is inefficient:**

- Time complexity: O(n²) where n is the number of intervals
- For each of n intervals, we compare with n-1 other intervals
- With n up to 1000, this could mean ~1,000,000 comparisons
- The problem constraints make this approach too slow for efficient solutions

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def removeCoveredIntervalsBrute(intervals):
    n = len(intervals)
    covered = [False] * n  # Track which intervals are covered

    # Compare every pair of intervals
    for i in range(n):
        for j in range(n):
            if i == j:
                continue
            # Check if interval j covers interval i
            if intervals[j][0] <= intervals[i][0] and intervals[i][1] <= intervals[j][1]:
                covered[i] = True
                break  # No need to check other j's if i is already covered

    # Count intervals that are NOT covered
    count = 0
    for i in range(n):
        if not covered[i]:
            count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(n)
function removeCoveredIntervalsBrute(intervals) {
  const n = intervals.length;
  const covered = new Array(n).fill(false);

  // Compare every pair of intervals
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;

      // Check if interval j covers interval i
      if (intervals[j][0] <= intervals[i][0] && intervals[i][1] <= intervals[j][1]) {
        covered[i] = true;
        break; // No need to check other j's if i is already covered
      }
    }
  }

  // Count intervals that are NOT covered
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (!covered[i]) count++;
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(n)
public int removeCoveredIntervalsBrute(int[][] intervals) {
    int n = intervals.length;
    boolean[] covered = new boolean[n];

    // Compare every pair of intervals
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) continue;

            // Check if interval j covers interval i
            if (intervals[j][0] <= intervals[i][0] &&
                intervals[i][1] <= intervals[j][1]) {
                covered[i] = true;
                break;  // No need to check other j's if i is already covered
            }
        }
    }

    // Count intervals that are NOT covered
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (!covered[i]) count++;
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that if we sort intervals by their start points (and by end points in descending order when starts are equal), we can process them in a single pass. Here's why this works:

1. **Sort by start ascending**: This ensures that as we process intervals left to right, each new interval starts at or after the previous ones.
2. **When starts are equal, sort by end descending**: This ensures that if two intervals start at the same point, the wider one comes first. This way, the wider interval won't be mistakenly marked as covered by the narrower one.
3. **Track the maximum end point seen so far**: As we process sorted intervals:
   - If the current interval's end ≤ current max_end, it's covered by some previous interval
   - Otherwise, it's not covered, so we increment our count and update max_end

This works because any interval that could cover the current one must start at or before the current interval's start (due to sorting). By tracking the maximum end point among all intervals we've seen that start at or before the current interval, we can immediately determine if the current interval is covered.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def removeCoveredIntervals(intervals):
    """
    Removes intervals that are covered by another interval.

    Args:
        intervals: List of [start, end] intervals

    Returns:
        Number of intervals remaining after removing covered ones
    """
    # Step 1: Sort intervals by start time ascending
    # When start times are equal, sort by end time descending
    # This ensures wider intervals come before narrower ones with same start
    intervals.sort(key=lambda x: (x[0], -x[1]))

    count = 0  # Count of non-covered intervals
    max_end = 0  # Maximum end point seen so far

    # Step 2: Process intervals in sorted order
    for start, end in intervals:
        # If current interval's end is greater than max_end seen so far,
        # it means this interval is not covered by any previous interval
        if end > max_end:
            count += 1  # This interval survives
            max_end = end  # Update the maximum end point

        # If end <= max_end, this interval is covered by some previous interval
        # (because its start is >= previous interval's start due to sorting,
        # and its end is <= max_end, which belongs to some previous interval)

    return count
```

```javascript
// Time: O(n log n) | Space: O(1) or O(log n) for sorting
function removeCoveredIntervals(intervals) {
  /**
   * Removes intervals that are covered by another interval.
   *
   * @param {number[][]} intervals - Array of [start, end] intervals
   * @return {number} - Number of intervals remaining after removing covered ones
   */

  // Step 1: Sort intervals by start time ascending
  // When start times are equal, sort by end time descending
  // This ensures wider intervals come before narrower ones with same start
  intervals.sort((a, b) => {
    if (a[0] === b[0]) {
      return b[1] - a[1]; // Descending end when starts are equal
    }
    return a[0] - b[0]; // Ascending start
  });

  let count = 0; // Count of non-covered intervals
  let maxEnd = 0; // Maximum end point seen so far

  // Step 2: Process intervals in sorted order
  for (const [start, end] of intervals) {
    // If current interval's end is greater than maxEnd seen so far,
    // it means this interval is not covered by any previous interval
    if (end > maxEnd) {
      count++; // This interval survives
      maxEnd = end; // Update the maximum end point
    }

    // If end <= maxEnd, this interval is covered by some previous interval
    // (because its start is >= previous interval's start due to sorting,
    // and its end is <= maxEnd, which belongs to some previous interval)
  }

  return count;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(log n) for sorting
import java.util.Arrays;

public int removeCoveredIntervals(int[][] intervals) {
    /**
     * Removes intervals that are covered by another interval.
     *
     * @param intervals - Array of [start, end] intervals
     * @return Number of intervals remaining after removing covered ones
     */

    // Step 1: Sort intervals by start time ascending
    // When start times are equal, sort by end time descending
    // This ensures wider intervals come before narrower ones with same start
    Arrays.sort(intervals, (a, b) -> {
        if (a[0] == b[0]) {
            return b[1] - a[1];  // Descending end when starts are equal
        }
        return a[0] - b[0];  // Ascending start
    });

    int count = 0;  // Count of non-covered intervals
    int maxEnd = 0;  // Maximum end point seen so far

    // Step 2: Process intervals in sorted order
    for (int[] interval : intervals) {
        int start = interval[0];
        int end = interval[1];

        // If current interval's end is greater than maxEnd seen so far,
        // it means this interval is not covered by any previous interval
        if (end > maxEnd) {
            count++;  // This interval survives
            maxEnd = end;  // Update the maximum end point
        }

        // If end <= maxEnd, this interval is covered by some previous interval
        // (because its start is >= previous interval's start due to sorting,
        // and its end is <= maxEnd, which belongs to some previous interval)
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the intervals takes O(n log n) time
- The single pass through sorted intervals takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity: O(1) or O(n)**

- If sorting is done in-place (like Python's Timsort), space is O(1) or O(log n) for the recursion stack
- If sorting requires additional space, it could be O(n)
- Our algorithm itself uses only O(1) extra space for `count` and `max_end`

## Common Mistakes

1. **Not sorting by end descending when starts are equal**: Consider `[[1,4],[1,3]]`. If we sort only by start ascending, `[1,4]` comes first, then `[1,3]`. When we process `[1,3]`, max_end=4, so we incorrectly think `[1,3]` is covered. But actually, `[1,4]` should cover `[1,3]`. By sorting ends descending when starts are equal, `[1,4]` comes first and correctly covers `[1,3]`.

2. **Using ≤ instead of < when comparing ends**: We need `end > max_end` not `end ≥ max_end`. If `end == max_end`, the current interval is covered by the one that established `max_end` (since that one starts at or before current interval).

3. **Forgetting to update max_end when finding a non-covered interval**: If we find an interval that's not covered, we must update `max_end` to its end point. Otherwise, subsequent intervals might be incorrectly marked as covered.

4. **Trying to modify the input array while iterating**: Some candidates try to physically remove covered intervals from the array. This is inefficient (O(n²) due to shifting elements) and error-prone. It's better to just count the non-covered intervals.

## When You'll See This Pattern

This "sort and track maximum" pattern appears in many interval problems:

1. **Merge Intervals (LeetCode 56)**: Sort intervals by start, then merge overlapping ones by tracking the current maximum end.
2. **Non-overlapping Intervals (LeetCode 435)**: Sort by end time, then count how many intervals you need to remove to make all non-overlapping.
3. **Meeting Rooms II (LeetCode 253)**: Sort start and end times separately, then use a two-pointer approach to track concurrent meetings.

The core idea is that sorting brings order to the problem, allowing you to make decisions with local information (like the current maximum end point) that have global correctness.

## Key Takeaways

1. **Sorting is powerful for interval problems**: When dealing with intervals, sorting by start time (and sometimes end time) often reveals structure that makes the problem solvable in linear time after sorting.

2. **Track extremes during iteration**: Maintaining the "maximum end seen so far" or similar extremes while processing sorted data is a common technique for making greedy decisions.

3. **Handle equal starts carefully**: When sorting intervals with equal start times, think about whether you want wider or narrower intervals first. For coverage problems, wider intervals should come first so they can cover narrower ones.

[Practice this problem on CodeJeet](/problem/remove-covered-intervals)
