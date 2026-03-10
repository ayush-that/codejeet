---
title: "How to Solve Divide Intervals Into Minimum Number of Groups — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Divide Intervals Into Minimum Number of Groups. Medium difficulty, 63.6% acceptance rate. Topics: Array, Two Pointers, Greedy, Sorting, Heap (Priority Queue)."
date: "2026-10-17"
category: "dsa-patterns"
tags:
  ["divide-intervals-into-minimum-number-of-groups", "array", "two-pointers", "greedy", "medium"]
---

# How to Solve Divide Intervals Into Minimum Number of Groups

This problem asks us to schedule intervals into the minimum number of groups such that no two overlapping intervals are placed in the same group. Think of it like scheduling meetings into conference rooms: if two meetings overlap in time, they need different rooms. The challenge is finding the minimum number of rooms needed to accommodate all meetings without conflicts.

What makes this problem interesting is that it's essentially the **"Meeting Rooms II"** problem in disguise. The core difficulty lies in efficiently tracking when intervals start and end to determine the maximum concurrent overlap at any point in time.

## Visual Walkthrough

Let's trace through an example: `intervals = [[5,10],[1,3],[2,5],[6,8],[3,7]]`

We want to find the maximum number of intervals that overlap at any point. Here's how we can think about it:

1. **Sort intervals by start time**: `[[1,3],[2,5],[3,7],[5,10],[6,8]]`
2. **Track active intervals**: As we process each interval, we need to know which previous intervals are still "active" (haven't ended yet)
3. **Use a min-heap to track end times**: This lets us efficiently remove intervals that have ended

Let's walk through the sorted intervals:

- Interval `[1,3]`: No active intervals → 1 group needed
- Interval `[2,5]`: Check if `[1,3]` has ended (3 ≥ 2? No, 3 < 2? Actually 3 > 2, so it hasn't ended). Overlap! → 2 groups needed
- Interval `[3,7]`: `[1,3]` ends at 3, which equals current start 3, so it doesn't overlap. But `[2,5]` ends at 5 > 3, so it overlaps. → Still 2 groups
- Interval `[5,10]`: `[2,5]` ends at 5 ≤ 5, so it doesn't overlap. `[3,7]` ends at 7 > 5, so it overlaps. → Still 2 groups
- Interval `[6,8]`: `[3,7]` ends at 7 > 6, so it overlaps. `[5,10]` ends at 10 > 6, so it overlaps. → 3 groups needed

The maximum groups we needed at any point was 3, so that's our answer.

## Brute Force Approach

A naive approach would be to check every time point where an interval starts or ends. For each time point, count how many intervals contain that time. The maximum count is our answer.

**Why this is inefficient:**

- Time points could be very large (up to 10⁶)
- Checking each interval for each time point gives O(n × m) where m is the range of times
- Even if we only check start/end points, we still need O(n²) to compare each interval against all others

**What candidates might try:**

- Checking all pairs of intervals for overlap: O(n²) time
- Using a frequency array for all possible times: O(n × range) which could be huge

These approaches don't scale well for large inputs (n up to 10⁵).

## Optimized Approach

The key insight is that we don't need to check every time point or compare every pair of intervals. We can use a **sweep line algorithm** with a **priority queue**:

1. **Sort intervals by start time**: This lets us process intervals in chronological order
2. **Use a min-heap to track end times**: The heap tells us which interval will end the earliest
3. **For each new interval**:
   - Remove all intervals from the heap that have ended before this interval starts
   - Add the new interval's end time to the heap
   - The heap size represents the number of concurrent intervals at this moment
4. **Track the maximum heap size** throughout the process

**Why this works:**

- By sorting, we ensure we process intervals in the order they start
- The min-heap efficiently tells us which interval ends soonest
- If the earliest-ending interval hasn't ended when a new one starts, we definitely need another group
- The heap size at any point equals the number of active intervals at that start time

**Alternative approach without a heap:**
We can also solve this using the **"line sweep"** technique:

1. Separate all start times and end times into two arrays
2. Sort both arrays
3. Use two pointers to track how many intervals start before others end
4. Increment count when we encounter a start, decrement when we encounter an end
5. Track the maximum count

This approach is more memory-efficient (O(n) space) and has the same O(n log n) time complexity.

## Optimal Solution

Here's the complete solution using the line sweep approach, which is more space-efficient than the heap approach:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minGroups(intervals):
    """
    Find the minimum number of groups needed so no overlapping intervals
    are in the same group.

    Approach: Line sweep - separate start and end times, then use two pointers
    to track active intervals.
    """
    n = len(intervals)

    # Step 1: Extract all start times and end times
    starts = []
    ends = []

    for start, end in intervals:
        starts.append(start)
        ends.append(end)

    # Step 2: Sort both arrays
    starts.sort()
    ends.sort()

    # Step 3: Use two pointers to sweep through time
    i = 0  # pointer for starts
    j = 0  # pointer for ends
    current_groups = 0
    max_groups = 0

    # Process while we still have intervals starting
    while i < n:
        # If the next start is before or at the same time as the next end,
        # we need to start a new interval (potentially in a new group)
        if starts[i] <= ends[j]:
            current_groups += 1
            i += 1
        else:
            # An interval ended before the next one starts,
            # so we can reuse a group
            current_groups -= 1
            j += 1

        # Update the maximum groups needed at any point
        max_groups = max(max_groups, current_groups)

    return max_groups
```

```javascript
// Time: O(n log n) | Space: O(n)
function minGroups(intervals) {
  /**
   * Find the minimum number of groups needed so no overlapping intervals
   * are in the same group.
   *
   * Approach: Line sweep - separate start and end times, then use two pointers
   * to track active intervals.
   */
  const n = intervals.length;

  // Step 1: Extract all start times and end times
  const starts = new Array(n);
  const ends = new Array(n);

  for (let i = 0; i < n; i++) {
    starts[i] = intervals[i][0];
    ends[i] = intervals[i][1];
  }

  // Step 2: Sort both arrays
  starts.sort((a, b) => a - b);
  ends.sort((a, b) => a - b);

  // Step 3: Use two pointers to sweep through time
  let i = 0; // pointer for starts
  let j = 0; // pointer for ends
  let currentGroups = 0;
  let maxGroups = 0;

  // Process while we still have intervals starting
  while (i < n) {
    // If the next start is before or at the same time as the next end,
    // we need to start a new interval (potentially in a new group)
    if (starts[i] <= ends[j]) {
      currentGroups++;
      i++;
    } else {
      // An interval ended before the next one starts,
      // so we can reuse a group
      currentGroups--;
      j++;
    }

    // Update the maximum groups needed at any point
    maxGroups = Math.max(maxGroups, currentGroups);
  }

  return maxGroups;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.Arrays;

class Solution {
    public int minGroups(int[][] intervals) {
        /**
         * Find the minimum number of groups needed so no overlapping intervals
         * are in the same group.
         *
         * Approach: Line sweep - separate start and end times, then use two pointers
         * to track active intervals.
         */
        int n = intervals.length;

        // Step 1: Extract all start times and end times
        int[] starts = new int[n];
        int[] ends = new int[n];

        for (int i = 0; i < n; i++) {
            starts[i] = intervals[i][0];
            ends[i] = intervals[i][1];
        }

        // Step 2: Sort both arrays
        Arrays.sort(starts);
        Arrays.sort(ends);

        // Step 3: Use two pointers to sweep through time
        int i = 0;  // pointer for starts
        int j = 0;  // pointer for ends
        int currentGroups = 0;
        int maxGroups = 0;

        // Process while we still have intervals starting
        while (i < n) {
            // If the next start is before or at the same time as the next end,
            // we need to start a new interval (potentially in a new group)
            if (starts[i] <= ends[j]) {
                currentGroups++;
                i++;
            } else {
                // An interval ended before the next one starts,
                // so we can reuse a group
                currentGroups--;
                j++;
            }

            // Update the maximum groups needed at any point
            maxGroups = Math.max(maxGroups, currentGroups);
        }

        return maxGroups;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Extracting start and end times: O(n)
- Sorting both arrays: O(n log n) each, but 2 × O(n log n) = O(n log n)
- The two-pointer sweep: O(n)
- Dominated by sorting: **O(n log n)**

**Space Complexity: O(n)**

- We store two arrays of size n: starts[] and ends[]
- No recursion or additional data structures needed
- **O(n)** total space

## Common Mistakes

1. **Forgetting to sort**: Some candidates try to process intervals in the given order, which doesn't work because intervals might start out of order. Always sort by start time first.

2. **Off-by-one with inclusive intervals**: The problem states intervals are inclusive `[left, right]`. When comparing `starts[i] <= ends[j]`, we use `<=` not `<` because if an interval ends at time 5 and another starts at time 5, they don't overlap (the first ends exactly when the second starts).

3. **Incorrect heap management in alternative approach**: If using a heap, remember to remove ALL intervals that have ended, not just one. The condition should be `while heap and heap[0] < start` (not `<=` for exclusive end).

4. **Not tracking the maximum properly**: Some candidates return the final count instead of the maximum count seen during processing. You need to track the peak concurrent intervals, not the count at the end.

## When You'll See This Pattern

This **line sweep with two pointers** pattern appears in many interval scheduling problems:

1. **Merge Intervals (LeetCode 56)**: Similar interval processing but focuses on merging rather than counting overlaps.
2. **Meeting Rooms II (LeetCode 253)**: Essentially the same problem - find minimum conference rooms needed.
3. **Car Pooling (LeetCode 1094)**: Tracks passengers getting on/off at different stops, similar to intervals starting/ending.
4. **Minimum Number of Frogs Croaking (LeetCode 1419)**: Tracks concurrent characters in a sequence, similar to tracking overlapping intervals.

The pattern is: when you need to track "events" happening over time and find maximum concurrent events, separate the start and end events, sort them, and sweep through with counters.

## Key Takeaways

1. **Maximum overlap = Minimum groups**: The minimum number of groups needed equals the maximum number of intervals overlapping at any point in time. This is the core insight.

2. **Line sweep with sorted starts/ends**: When dealing with intervals, separating start and end times into sorted arrays and using two pointers is often more efficient than comparing all pairs.

3. **Inclusive vs exclusive boundaries matter**: Pay attention to whether intervals are inclusive `[a,b]` or exclusive `[a,b)`. This affects whether you use `<=` or `<` in comparisons.

**Related problems:**

- [Merge Intervals](/problem/merge-intervals)
- [Minimum Number of Frogs Croaking](/problem/minimum-number-of-frogs-croaking)
- [Average Height of Buildings in Each Segment](/problem/average-height-of-buildings-in-each-segment)
