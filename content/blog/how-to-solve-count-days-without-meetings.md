---
title: "How to Solve Count Days Without Meetings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Days Without Meetings. Medium difficulty, 48.1% acceptance rate. Topics: Array, Sorting."
date: "2026-03-28"
category: "dsa-patterns"
tags: ["count-days-without-meetings", "array", "sorting", "medium"]
---

# How to Solve Count Days Without Meetings

You're given a total number of days and a list of meeting intervals, and you need to count how many days have no meetings scheduled. The challenge is that meetings can overlap, so simply summing their durations won't work—you need to find the total number of unique days covered by meetings and subtract from the total days.

What makes this problem interesting is that it's essentially a "merge intervals" problem in disguise. You need to merge overlapping meeting intervals first, then calculate the total meeting days from the merged intervals.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:** `days = 10`, `meetings = [[2,4], [3,5], [7,9]]`

**Step 1: Sort meetings by start day**
`[[2,4], [3,5], [7,9]]` (already sorted in this case)

**Step 2: Merge overlapping intervals**

- Start with `[2,4]`
- Next meeting `[3,5]` overlaps with `[2,4]` (since 3 ≤ 4), so merge to `[2,5]`
- Next meeting `[7,9]` doesn't overlap (7 > 5), so keep `[2,5]` and start new interval `[7,9]`

**Step 3: Calculate total meeting days**

- `[2,5]` covers days 2,3,4,5 → 4 days
- `[7,9]` covers days 7,8,9 → 3 days
- Total meeting days = 4 + 3 = 7 days

**Step 4: Calculate days without meetings**
Total days = 10, meeting days = 7 → days without meetings = 10 - 7 = 3

The 3 days without meetings are: day 1, day 6, and day 10.

## Brute Force Approach

A naive approach would be to mark each day from 1 to `days` in a boolean array, then for each meeting, mark all days in its range as having meetings. Finally, count the unmarked days.

**Why this fails:**

- Time complexity: O(days × n) where n is number of meetings
- Space complexity: O(days)
- If `days` is very large (up to 10^9 in constraints), this approach is impossible—you can't even create an array that large!

Even with smaller constraints, this approach is inefficient. A candidate might try this, but they should quickly realize it won't scale.

## Optimized Approach

The key insight is that we don't need to track individual days—we only need to know the total number of unique days covered by meetings. This is a classic "merge intervals" problem:

1. **Sort meetings by start day** - This allows us to process meetings in chronological order
2. **Merge overlapping intervals** - As we process sorted meetings, if a meeting overlaps with the current merged interval, extend the end day; otherwise, finalize the current interval and start a new one
3. **Calculate total meeting days** - Sum the lengths of all merged intervals
4. **Compute result** - Subtract total meeting days from total days

The critical realization is that two meetings `[a,b]` and `[c,d]` overlap if `c ≤ b`. When they overlap, the merged interval becomes `[a, max(b,d)]`.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) if we don't count input storage, O(n) if we do
def countDays(days, meetings):
    """
    Count days without meetings by merging overlapping intervals.

    Args:
        days: Total number of days (1-indexed)
        meetings: List of [start, end] intervals (inclusive)

    Returns:
        Number of days without any meetings
    """
    # Edge case: no meetings at all
    if not meetings:
        return days

    # Step 1: Sort meetings by start day
    # This is crucial for the merge process to work correctly
    meetings.sort(key=lambda x: x[0])

    # Initialize variables
    total_meeting_days = 0
    # Start with the first meeting as our current interval
    current_start, current_end = meetings[0]

    # Step 2: Merge overlapping intervals
    for i in range(1, len(meetings)):
        start, end = meetings[i]

        # Check if this meeting overlaps with current interval
        # Meetings overlap if start <= current_end
        if start <= current_end:
            # Merge: extend current_end if needed
            current_end = max(current_end, end)
        else:
            # No overlap, finalize current interval
            # Add its length to total meeting days
            # Length = end - start + 1 (inclusive)
            total_meeting_days += (current_end - current_start + 1)

            # Start a new current interval with this meeting
            current_start, current_end = start, end

    # Don't forget the last interval!
    total_meeting_days += (current_end - current_start + 1)

    # Step 3: Calculate days without meetings
    return days - total_meeting_days
```

```javascript
// Time: O(n log n) | Space: O(1) if we don't count input storage, O(n) if we do
/**
 * Count days without meetings by merging overlapping intervals.
 *
 * @param {number} days - Total number of days (1-indexed)
 * @param {number[][]} meetings - Array of [start, end] intervals (inclusive)
 * @return {number} - Number of days without any meetings
 */
function countDays(days, meetings) {
  // Edge case: no meetings at all
  if (!meetings || meetings.length === 0) {
    return days;
  }

  // Step 1: Sort meetings by start day
  // This is crucial for the merge process to work correctly
  meetings.sort((a, b) => a[0] - b[0]);

  // Initialize variables
  let totalMeetingDays = 0;
  // Start with the first meeting as our current interval
  let [currentStart, currentEnd] = meetings[0];

  // Step 2: Merge overlapping intervals
  for (let i = 1; i < meetings.length; i++) {
    const [start, end] = meetings[i];

    // Check if this meeting overlaps with current interval
    // Meetings overlap if start <= currentEnd
    if (start <= currentEnd) {
      // Merge: extend currentEnd if needed
      currentEnd = Math.max(currentEnd, end);
    } else {
      // No overlap, finalize current interval
      // Add its length to total meeting days
      // Length = end - start + 1 (inclusive)
      totalMeetingDays += currentEnd - currentStart + 1;

      // Start a new current interval with this meeting
      currentStart = start;
      currentEnd = end;
    }
  }

  // Don't forget the last interval!
  totalMeetingDays += currentEnd - currentStart + 1;

  // Step 3: Calculate days without meetings
  return days - totalMeetingDays;
}
```

```java
// Time: O(n log n) | Space: O(1) if we don't count input storage, O(n) if we do
import java.util.Arrays;

class Solution {
    /**
     * Count days without meetings by merging overlapping intervals.
     *
     * @param days - Total number of days (1-indexed)
     * @param meetings - Array of [start, end] intervals (inclusive)
     * @return Number of days without any meetings
     */
    public int countDays(int days, int[][] meetings) {
        // Edge case: no meetings at all
        if (meetings == null || meetings.length == 0) {
            return days;
        }

        // Step 1: Sort meetings by start day
        // This is crucial for the merge process to work correctly
        Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]));

        // Initialize variables
        int totalMeetingDays = 0;
        // Start with the first meeting as our current interval
        int currentStart = meetings[0][0];
        int currentEnd = meetings[0][1];

        // Step 2: Merge overlapping intervals
        for (int i = 1; i < meetings.length; i++) {
            int start = meetings[i][0];
            int end = meetings[i][1];

            // Check if this meeting overlaps with current interval
            // Meetings overlap if start <= currentEnd
            if (start <= currentEnd) {
                // Merge: extend currentEnd if needed
                currentEnd = Math.max(currentEnd, end);
            } else {
                // No overlap, finalize current interval
                // Add its length to total meeting days
                // Length = end - start + 1 (inclusive)
                totalMeetingDays += (currentEnd - currentStart + 1);

                // Start a new current interval with this meeting
                currentStart = start;
                currentEnd = end;
            }
        }

        // Don't forget the last interval!
        totalMeetingDays += (currentEnd - currentStart + 1);

        // Step 3: Calculate days without meetings
        return days - totalMeetingDays;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the meetings takes O(n log n) time
- Merging intervals takes O(n) time (single pass through sorted array)
- Dominated by the sorting step

**Space Complexity: O(1) or O(n)**

- If we consider only auxiliary space (not counting input storage): O(1) - we use only a few variables
- If we count input storage: O(n) for the meetings array
- Sorting may use O(log n) or O(n) space depending on the language's sort implementation

## Common Mistakes

1. **Forgetting to sort meetings first** - This is the most common mistake. Without sorting, you can't efficiently merge intervals. Test with `[[5,7], [1,3]]` to see why sorting is essential.

2. **Off-by-one errors in interval length calculation** - Remember that `[2,5]` includes days 2,3,4,5 which is 4 days, not 3. The formula is `end - start + 1`. Always test with small examples.

3. **Not handling the last merged interval** - After the loop ends, you still need to add the last interval's length to the total. This is easy to forget.

4. **Incorrect overlap condition** - The condition is `start ≤ currentEnd`, not `start < currentEnd`. If a meeting starts exactly when another ends (`[2,4]` and `[4,6]`), they should be merged to `[2,6]` covering days 2,3,4,5,6 continuously.

## When You'll See This Pattern

The "merge intervals" pattern appears in many coding problems:

1. **Merge Intervals (LeetCode 56)** - The classic problem this is based on. You merge overlapping intervals and return the merged list.

2. **Insert Interval (LeetCode 57)** - Insert a new interval into a list of non-overlapping intervals, merging if necessary.

3. **Meeting Rooms II (LeetCode 253)** - Find the minimum number of conference rooms needed given meeting intervals. While it uses a different approach (sweep line), it deals with the same interval overlap concepts.

4. **Non-overlapping Intervals (LeetCode 435)** - Find the minimum number of intervals to remove to make all intervals non-overlapping.

The core skill is recognizing when you need to process intervals and that sorting by start time is usually the first step.

## Key Takeaways

1. **When you see "intervals" and "overlap" in a problem description, think "merge intervals"** - This pattern solves a wide range of interval-related problems.

2. **Always sort intervals by start time first** - This transforms an O(n²) overlap checking problem into an O(n) linear scan.

3. **The overlap condition is `new_start ≤ current_end`** - When this is true, merge by taking `max(current_end, new_end)`. When false, finalize the current interval and start a new one.

Remember: The merge intervals pattern is about transforming overlapping intervals into a minimal set of non-overlapping intervals, which makes subsequent calculations much simpler.

Related problems: [Merge Intervals](/problem/merge-intervals)
