---
title: "How to Solve My Calendar I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode My Calendar I. Medium difficulty, 58.2% acceptance rate. Topics: Array, Binary Search, Design, Segment Tree, Ordered Set."
date: "2027-06-08"
category: "dsa-patterns"
tags: ["my-calendar-i", "array", "binary-search", "design", "medium"]
---

# How to Solve My Calendar I

You need to implement a calendar that can add new events without causing double bookings. The tricky part is efficiently checking for overlaps between events when new events can be added in any order. This problem is interesting because it requires maintaining a sorted collection of intervals and quickly finding where a new interval should be inserted while checking for conflicts.

## Visual Walkthrough

Let's trace through a concrete example. Suppose we have an empty calendar and we want to add these events in order:

1. `[10, 20]` - Calendar is empty, so it's added
2. `[15, 25]` - Overlaps with `[10, 20]` (15 < 20), so it's rejected
3. `[20, 30]` - Does NOT overlap with `[10, 20]` (end time 20 equals start time 20), so it's added
4. `[5, 10]` - Does NOT overlap with `[10, 20]` (end time 10 equals start time 10), so it's added

After these operations, our calendar contains: `[5, 10]`, `[10, 20]`, `[20, 30]`.

The key insight: Two intervals `[s1, e1]` and `[s2, e2]` overlap if `s1 < e2` AND `s2 < e1`. If either condition is false, they don't overlap. For example:

- `[10, 20]` and `[15, 25]`: 10 < 25 (true) AND 15 < 20 (true) → overlap
- `[10, 20]` and `[20, 30]`: 10 < 30 (true) BUT 20 < 20 (false) → no overlap

## Brute Force Approach

The simplest approach is to store all booked events in a list. For each new event, check it against every existing event to see if there's any overlap.

**Why this is insufficient:**

- Time complexity: O(n²) for n bookings
- With up to 1000 calls to `book()` (as per typical constraints), this could mean up to 500,000 operations
- While this might pass for small inputs, it's inefficient and won't scale well

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
class MyCalendar:
    def __init__(self):
        # Store all booked events
        self.events = []

    def book(self, start: int, end: int) -> bool:
        # Check for overlap with all existing events
        for s, e in self.events:
            # Two intervals overlap if start1 < end2 AND start2 < end1
            if start < e and s < end:
                return False

        # No overlaps found, add the event
        self.events.append((start, end))
        return True
```

```javascript
// Time: O(n²) | Space: O(n)
class MyCalendar {
  constructor() {
    // Store all booked events
    this.events = [];
  }

  book(start, end) {
    // Check for overlap with all existing events
    for (const [s, e] of this.events) {
      // Two intervals overlap if start1 < end2 AND start2 < end1
      if (start < e && s < end) {
        return false;
      }
    }

    // No overlaps found, add the event
    this.events.push([start, end]);
    return true;
  }
}
```

```java
// Time: O(n²) | Space: O(n)
class MyCalendar {
    private List<int[]> events;

    public MyCalendar() {
        // Store all booked events
        events = new ArrayList<>();
    }

    public boolean book(int start, int end) {
        // Check for overlap with all existing events
        for (int[] event : events) {
            int s = event[0], e = event[1];
            // Two intervals overlap if start1 < end2 AND start2 < end1
            if (start < e && s < end) {
                return false;
            }
        }

        // No overlaps found, add the event
        events.add(new int[]{start, end});
        return true;
    }
}
```

</div>

## Optimized Approach

The key insight is that we only need to check the new event against its neighbors in a sorted timeline. If we maintain events in sorted order by start time, we can use binary search to find where the new event would be inserted, then only check it against the immediate previous and next events.

**Why this works:**

1. When events are sorted by start time, any potential overlap will be with:
   - The event just before the insertion point (if it ends after our start time)
   - The event just after the insertion point (if it starts before our end time)
2. We don't need to check all events because if an event doesn't overlap with these two neighbors, it won't overlap with any others due to the sorted order
3. Binary search gives us O(log n) time to find the insertion point

**Step-by-step reasoning:**

1. Use a data structure that maintains sorted order (like a balanced binary search tree or a list with binary search)
2. For a new event `[start, end]`, find where it would be inserted in the sorted list
3. Check the event before the insertion point: does it end after our start time?
4. Check the event after the insertion point: does it start before our end time?
5. If either check is true, there's an overlap → reject
6. Otherwise, insert and return true

## Optimal Solution

We'll use a list to store events in sorted order and binary search to find the insertion point. This gives us O(log n) search time and O(n) insertion time in the worst case, but amortized O(log n) overall.

<div class="code-group">

```python
# Time: O(log n) for search + O(n) for insertion = O(n) worst case, O(log n) amortized
# Space: O(n) for storing all events
class MyCalendar:
    def __init__(self):
        # Store events as (start, end) tuples, always sorted by start time
        self.events = []

    def book(self, start: int, end: int) -> bool:
        # Find the position where this event should be inserted
        # using binary search (bisect_left finds first position where start >= x)
        idx = bisect.bisect_left(self.events, (start, end))

        # Check for overlap with the event just before the insertion point
        # idx > 0 means there's an event before our insertion point
        if idx > 0 and self.events[idx-1][1] > start:
            # Previous event ends after our start time → overlap
            return False

        # Check for overlap with the event at the insertion point (or after)
        # idx < len(self.events) means there's an event at or after our insertion point
        if idx < len(self.events) and self.events[idx][0] < end:
            # Next event starts before our end time → overlap
            return False

        # No overlaps found, insert the event at position idx
        self.events.insert(idx, (start, end))
        return True

# Note: In Python, we need to import bisect at the top of the file
# import bisect
```

```javascript
// Time: O(log n) for search + O(n) for insertion = O(n) worst case, O(log n) amortized
// Space: O(n) for storing all events
class MyCalendar {
  constructor() {
    // Store events as [start, end] arrays, always sorted by start time
    this.events = [];
  }

  book(start, end) {
    // Find the position where this event should be inserted using binary search
    let left = 0;
    let right = this.events.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.events[mid][0] < start) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    const idx = left;

    // Check for overlap with the event just before the insertion point
    // idx > 0 means there's an event before our insertion point
    if (idx > 0 && this.events[idx - 1][1] > start) {
      // Previous event ends after our start time → overlap
      return false;
    }

    // Check for overlap with the event at the insertion point (or after)
    // idx < this.events.length means there's an event at or after our insertion point
    if (idx < this.events.length && this.events[idx][0] < end) {
      // Next event starts before our end time → overlap
      return false;
    }

    // No overlaps found, insert the event at position idx
    this.events.splice(idx, 0, [start, end]);
    return true;
  }
}
```

```java
// Time: O(log n) for search + O(n) for insertion = O(n) worst case, O(log n) amortized
// Space: O(n) for storing all events
class MyCalendar {
    private List<int[]> events;

    public MyCalendar() {
        // Store events as [start, end] arrays, always sorted by start time
        events = new ArrayList<>();
    }

    public boolean book(int start, int end) {
        // Find the position where this event should be inserted using binary search
        int left = 0;
        int right = events.size();

        while (left < right) {
            int mid = left + (right - left) / 2;
            if (events.get(mid)[0] < start) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        int idx = left;

        // Check for overlap with the event just before the insertion point
        // idx > 0 means there's an event before our insertion point
        if (idx > 0 && events.get(idx-1)[1] > start) {
            // Previous event ends after our start time → overlap
            return false;
        }

        // Check for overlap with the event at the insertion point (or after)
        // idx < events.size() means there's an event at or after our insertion point
        if (idx < events.size() && events.get(idx)[0] < end) {
            // Next event starts before our end time → overlap
            return false;
        }

        // No overlaps found, insert the event at position idx
        events.add(idx, new int[]{start, end});
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Search:** O(log n) using binary search to find the insertion point
- **Insertion:** O(n) in the worst case when inserting at the beginning of the list (requires shifting all elements)
- **Overall:** O(n) worst case per `book()` call, but amortized O(log n) since binary search tree implementations (like TreeMap in Java) or balanced structures can achieve O(log n) for both operations

**Space Complexity:**

- O(n) to store all booked events in the calendar

**Note:** The solution above uses a list with binary search. For true O(log n) operations, you'd use a balanced binary search tree (like TreeMap in Java, or implement your own). However, the list approach is simpler and often sufficient for interview settings.

## Common Mistakes

1. **Incorrect overlap condition:** Using `start < e and end > s` instead of `start < e and s < end`. They're mathematically equivalent, but the latter is more intuitive: two intervals overlap if each starts before the other ends.

2. **Forgetting to check both neighbors:** Some candidates only check the previous event or only check the next event. You must check both because:
   - The previous event could end after your start time
   - The next event could start before your end time

3. **Off-by-one errors with equal endpoints:** Remember that `[10, 20]` and `[20, 30]` do NOT overlap because the end time of the first equals the start time of the second. The overlap condition is strict inequality: `start < e` not `start <= e`.

4. **Not maintaining sorted order:** If you simply append events without sorting, you'll need to check all events for overlap (O(n) time). The optimization comes from maintaining sorted order and using binary search.

## When You'll See This Pattern

This interval scheduling pattern appears in many problems:

1. **My Calendar II (Medium):** Similar but allows double booking (two overlaps) but not triple booking. Requires tracking overlaps more carefully.

2. **My Calendar III (Hard):** Asks for the maximum number of overlapping events at any time. Requires sweep line algorithm or segment trees.

3. **Merge Intervals (Medium):** Given a collection of intervals, merge all overlapping intervals. Uses similar overlap checking logic.

4. **Insert Interval (Medium):** Insert a new interval into a sorted list of non-overlapping intervals and merge if necessary.

5. **Meeting Rooms II (Medium):** Find the minimum number of conference rooms required given meeting schedules. Uses similar interval overlap concepts with a different approach (often using min-heap).

The core technique is maintaining intervals in sorted order and using binary search to efficiently find insertion points and check for overlaps.

## Key Takeaways

1. **Sorted intervals + binary search** is a powerful pattern for interval scheduling problems. By keeping intervals sorted, you can use binary search to achieve O(log n) operations instead of O(n).

2. **The overlap condition** `s1 < e2 and s2 < e1` is fundamental to interval problems. Memorize this formula and understand why it works.

3. **When checking a new interval in a sorted list**, you only need to check the immediate neighbors. If it doesn't overlap with them, it won't overlap with any others due to the sorted order.

4. **Consider edge cases carefully**: equal endpoints (no overlap), intervals that completely contain other intervals, and intervals at the beginning/end of the list.

Related problems: [My Calendar II](/problem/my-calendar-ii), [My Calendar III](/problem/my-calendar-iii), [Determine if Two Events Have Conflict](/problem/determine-if-two-events-have-conflict)
