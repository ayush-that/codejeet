---
title: "How to Solve Determine if Two Events Have Conflict — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Determine if Two Events Have Conflict. Easy difficulty, 53.1% acceptance rate. Topics: Array, String."
date: "2028-03-28"
category: "dsa-patterns"
tags: ["determine-if-two-events-have-conflict", "array", "string", "easy"]
---

# How to Solve "Determine if Two Events Have Conflict"

This problem asks you to determine if two time intervals overlap given their start and end times in "HH:MM" format. While the concept is straightforward, the challenge lies in properly comparing time strings and understanding interval overlap logic. What makes this interesting is that it's a simplified version of classic interval problems, testing your ability to convert time representations and apply basic interval mathematics.

## Visual Walkthrough

Let's walk through an example: `event1 = ["14:00", "15:30"]` and `event2 = ["15:00", "16:00"]`.

1. First, we need to understand what conflict means: two events conflict if they share any time in common. This happens when one event starts before the other ends AND ends after the other starts.

2. For our example:
   - Event 1 runs from 14:00 to 15:30
   - Event 2 runs from 15:00 to 16:00

3. To check for conflict, we compare:
   - Does event1 start before event2 ends? 14:00 < 16:00 → Yes
   - Does event1 end after event2 starts? 15:30 > 15:00 → Yes

4. Since both conditions are true, the events conflict. They overlap from 15:00 to 15:30.

The key insight is that two intervals [A, B] and [C, D] overlap if A < D AND B > C. Notice we use strict comparisons because the problem states events are inclusive (if one ends exactly when another starts, they don't conflict).

## Brute Force Approach

A naive approach might try to convert times to minutes since midnight and check every minute in both events for overlap. For example:

1. Convert start and end times to minutes from midnight
2. Create sets of all minutes covered by each event
3. Check if the sets intersect

This approach would work but is inefficient. Converting to minutes since midnight for each event takes O(1) time, but if we actually enumerated every minute (up to 1440 possible minutes in a day), we'd have O(n) complexity where n could be up to 1440. More importantly, the mental model is wrong—we don't need to check every minute, just the boundary conditions.

The brute force code might look like:

```python
def haveConflict(event1, event2):
    # Convert to minutes
    def to_minutes(time_str):
        hours, minutes = map(int, time_str.split(':'))
        return hours * 60 + minutes

    start1, end1 = to_minutes(event1[0]), to_minutes(event1[1])
    start2, end2 = to_minutes(event2[0]), to_minutes(event2[1])

    # Check every minute in event1 against event2
    for minute in range(start1, end1 + 1):  # +1 because inclusive
        if start2 <= minute <= end2:
            return True
    return False
```

This has O(k) time complexity where k is the duration of the first event in minutes (up to 1440). While acceptable for this specific problem, it's not the most elegant solution and doesn't generalize well to more intervals or longer time ranges.

## Optimal Solution

The optimal solution uses interval overlap logic directly. Two intervals [A, B] and [C, D] overlap if the maximum of the start times is less than or equal to the minimum of the end times. However, since the problem says events don't conflict if one ends exactly when another starts, we need strict inequality: max(A, C) < min(B, D).

Alternatively, we can think of it as: intervals DON'T conflict if one is completely before the other. That is, event1 ends before event2 starts OR event2 ends before event1 starts. We can check for non-conflict and return the negation.

Here's the complete solution:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def haveConflict(event1, event2):
    """
    Determines if two time intervals conflict.

    Two events conflict if they share any common time (excluding the case
    where one ends exactly when another starts).

    Args:
        event1: List of two strings [start1, end1] in "HH:MM" format
        event2: List of two strings [start2, end2] in "HH:MM" format

    Returns:
        True if events conflict, False otherwise
    """
    # Convert time strings to comparable format
    # Since times are in "HH:MM" format with leading zeros,
    # string comparison works directly
    start1, end1 = event1
    start2, end2 = event2

    # Two events conflict if they overlap
    # They overlap if the maximum start time is less than the minimum end time
    # Using string comparison works because "HH:MM" format ensures
    # lexicographic order matches chronological order

    # Check if events DON'T conflict (one is completely before the other)
    # Event1 ends before Event2 starts OR Event2 ends before Event1 starts
    if end1 < start2 or end2 < start1:
        return False

    # Otherwise, they conflict
    return True

    # Alternative one-liner: return not (end1 < start2 or end2 < start1)
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Determines if two time intervals conflict.
 *
 * Two events conflict if they share any common time (excluding the case
 * where one ends exactly when another starts).
 *
 * @param {string[]} event1 - [start1, end1] in "HH:MM" format
 * @param {string[]} event2 - [start2, end2] in "HH:MM" format
 * @return {boolean} True if events conflict, False otherwise
 */
function haveConflict(event1, event2) {
  // Extract start and end times
  const [start1, end1] = event1;
  const [start2, end2] = event2;

  // Two events conflict if they overlap
  // They DON'T conflict if one is completely before the other
  // Event1 ends before Event2 starts OR Event2 ends before Event1 starts
  // String comparison works because "HH:MM" format ensures
  // lexicographic order matches chronological order

  if (end1 < start2 || end2 < start1) {
    return false; // No conflict
  }

  return true; // Conflict exists

  // Alternative: return !(end1 < start2 || end2 < start1);
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Determines if two time intervals conflict.
     *
     * Two events conflict if they share any common time (excluding the case
     * where one ends exactly when another starts).
     *
     * @param event1 String array [start1, end1] in "HH:MM" format
     * @param event2 String array [start2, end2] in "HH:MM" format
     * @return True if events conflict, False otherwise
     */
    public boolean haveConflict(String[] event1, String[] event2) {
        // Extract start and end times
        String start1 = event1[0];
        String end1 = event1[1];
        String start2 = event2[0];
        String end2 = event2[1];

        // Two events conflict if they overlap
        // They DON'T conflict if one is completely before the other
        // Event1 ends before Event2 starts OR Event2 ends before Event1 starts
        // String comparison works because "HH:MM" format ensures
        // lexicographic order matches chronological order

        if (end1.compareTo(start2) < 0 || end2.compareTo(start1) < 0) {
            return false;  // No conflict
        }

        return true;  // Conflict exists

        // Alternative: return !(end1.compareTo(start2) < 0 || end2.compareTo(start1) < 0);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We perform a constant number of string comparisons (at most 4 comparisons in the worst case)
- String comparison of "HH:MM" strings takes O(1) time since the strings have fixed length (5 characters)

**Space Complexity:** O(1)

- We only store a constant number of string references
- No additional data structures are created that scale with input size

The key insight is that "HH:MM" strings can be compared directly using lexicographic (dictionary) order because:

1. Hours are zero-padded to two digits (e.g., "09:00" not "9:00")
2. Minutes are zero-padded to two digits
3. The ":" character has consistent ASCII ordering

This means "08:15" < "08:30" and "23:59" > "00:00" when compared as strings.

## Common Mistakes

1. **Converting to integers unnecessarily**: Many candidates convert times to minutes since midnight using parsing and arithmetic. While this works, it's more error-prone and verbose than direct string comparison. The string approach is cleaner and equally correct.

2. **Incorrect overlap logic**: The most common error is using ≤ or ≥ instead of strict inequalities. Remember: if event1 ends at "14:00" and event2 starts at "14:00", they do NOT conflict (one ends exactly when another starts). The problem states this explicitly.

3. **Forgetting about inclusive endpoints**: While the endpoints don't create conflict when they touch, events DO include their start and end times. So if event1 is ["10:00", "11:00"] and event2 is ["11:00", "12:00"], they don't conflict. But if event2 were ["10:59", "11:01"], they would conflict from 10:59 to 11:00.

4. **Overcomplicating with sorting**: Some candidates sort the events by start time first. While this can help visualize, it's unnecessary for just two events and adds complexity. The logic `end1 < start2 or end2 < start1` works regardless of which event starts first.

## When You'll See This Pattern

This problem teaches **interval overlap detection**, a fundamental pattern in scheduling and calendar problems:

1. **Merge Intervals (LeetCode 56)**: Instead of just detecting overlap, you merge overlapping intervals into consolidated ranges. The core overlap check is identical.

2. **Non-overlapping Intervals (LeetCode 435)**: Given a collection of intervals, find the minimum number to remove to make the rest non-overlapping. You need to detect overlaps to decide which intervals conflict.

3. **My Calendar I (LeetCode 729)**: Design a calendar that can add events and check for conflicts with existing events. This is essentially the same overlap check applied repeatedly.

4. **Meeting Rooms (LeetCode 252)**: Determine if a person could attend all meetings (no overlaps between any two meetings). This requires checking all pairs of intervals for overlap.

The pattern extends to 2D with problems like **Rectangle Overlap (LeetCode 836)**, where you check if two rectangles overlap by checking for separation on both x and y axes.

## Key Takeaways

1. **Interval overlap can be checked with simple comparisons**: Two intervals [A, B] and [C, D] overlap if `max(A, C) < min(B, D)`. They don't overlap if `B ≤ C` or `D ≤ A` (using ≤ for non-inclusive, < for inclusive based on problem requirements).

2. **String comparison works for zero-padded time formats**: When times are in fixed "HH:MM" format with leading zeros, string comparison is equivalent to time comparison and avoids parsing overhead.

3. **Always clarify endpoint behavior**: In interval problems, carefully check whether endpoints are inclusive or exclusive. A small difference in inequality (≤ vs <) can change the result.

4. **For exactly two intervals, direct comparison is optimal**: No need to sort or use complex data structures when you only have two intervals to compare.

Related problems: [Merge Intervals](/problem/merge-intervals), [Non-overlapping Intervals](/problem/non-overlapping-intervals), [My Calendar I](/problem/my-calendar-i)
