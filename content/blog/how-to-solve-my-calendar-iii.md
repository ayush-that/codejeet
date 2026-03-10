---
title: "How to Solve My Calendar III — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode My Calendar III. Hard difficulty, 71.5% acceptance rate. Topics: Binary Search, Design, Segment Tree, Prefix Sum, Ordered Set."
date: "2027-04-12"
category: "dsa-patterns"
tags: ["my-calendar-iii", "binary-search", "design", "segment-tree", "hard"]
---

# How to Solve My Calendar III

This problem asks you to design a calendar that can book events and, after each booking, return the maximum number of overlapping events at any point in time. The tricky part is that events are added one at a time, and you need to efficiently maintain and query the maximum overlap after each addition. Unlike simpler calendar problems, here we need to track the exact maximum overlap (k-booking) dynamically, not just check if a booking is possible.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we book events in this order:

1. Book `[10, 20]`
2. Book `[50, 60]`
3. Book `[10, 40]`
4. Book `[5, 15]`
5. Book `[5, 10]`
6. Book `[25, 55]`

We need to track the maximum overlap after each booking.

**Step 1:** Book `[10, 20]`

- Timeline: Only one event from 10 to 20
- Maximum overlap = 1

**Step 2:** Book `[50, 60]`

- Timeline: Two separate events, no overlap
- Maximum overlap = 1

**Step 3:** Book `[10, 40]`

- Now we have: `[10, 20]` and `[10, 40]` overlapping from 10 to 20
- Also `[50, 60]` is separate
- Maximum overlap = 2 (from time 10 to 20)

**Step 4:** Book `[5, 15]`

- Events at time 10: `[10, 20]`, `[10, 40]`, `[5, 15]` → 3 events
- Maximum overlap = 3

**Step 5:** Book `[5, 10]`

- This ends exactly when others start, so no overlap at time 10
- At time 9: `[5, 15]` and `[5, 10]` → 2 events
- Maximum overlap remains 3

**Step 6:** Book `[25, 55]`

- At time 30: `[10, 40]` and `[25, 55]` → 2 events
- At time 50: `[25, 55]` and `[50, 60]` → 2 events
- Maximum overlap remains 3

The key insight: We can track overlaps by noting that each event `[start, end)` increases the overlap count by 1 at `start` and decreases it by 1 at `end`. The maximum overlap at any time is the maximum running sum of these changes.

## Brute Force Approach

A naive approach would be to store all events and, after each booking, scan through all time points to find the maximum overlap. Here's how that might work:

1. Store all booked intervals in a list
2. After each new booking, create a timeline of all start and end points
3. Sort these points and scan through them, incrementing a counter at starts and decrementing at ends
4. Track the maximum value of this counter

The problem with this approach is efficiency. For `n` bookings, we'd have `O(n)` intervals, and scanning through all of them after each booking would take `O(n²)` time overall. This is too slow for large `n`.

Even if we try to be clever by only checking against existing intervals, we still need to consider all overlapping intervals at each point, which becomes inefficient as the number of events grows.

## Optimized Approach

The key insight is that we don't need to scan all time points or all intervals repeatedly. We can use a **sweep line algorithm** with a sorted map (like TreeMap in Java or SortedDict in Python) to efficiently track the cumulative sum of overlaps.

Here's the reasoning:

1. Each event `[start, end)` can be represented as:
   - `+1` at `start` (overlap increases)
   - `-1` at `end` (overlap decreases)

2. We maintain a sorted map where:
   - Keys are time points where the overlap count changes
   - Values are the net change in overlap at that time

3. When booking a new event `[start, end)`:
   - Increment the count at `start` by 1
   - Decrement the count at `end` by 1
   - The map stays sorted, so we can process changes in order

4. To find the maximum overlap:
   - We maintain a running sum as we iterate through the sorted time points
   - The maximum value of this running sum is our answer

The clever part: We don't need to rescan all time points after each booking. We can:

- Update the map in `O(log n)` time (for insertion into sorted structure)
- Track the current maximum as we go, so we don't need to rescan

However, there's a subtlety: If we want to avoid rescanning the entire map after each booking, we need to be smart about how we update and track the maximum.

## Optimal Solution

The most efficient solution uses a sorted map (TreeMap in Java, SortedDict in Python, or Map with manual sorting in JavaScript) to track the cumulative sum of overlaps. After each booking, we update the map and calculate the new maximum overlap.

<div class="code-group">

```python
# Time: O(n²) in worst case but O(n log n) average with SortedDict
# Space: O(n) for storing the timeline
from sortedcontainers import SortedDict

class MyCalendarThree:
    def __init__(self):
        # Use SortedDict to maintain timeline in sorted order
        # Keys: time points where overlap changes
        # Values: net change in overlap count at that time
        self.timeline = SortedDict()

    def book(self, start: int, end: int) -> int:
        # Add +1 at start time (overlap increases)
        self.timeline[start] = self.timeline.get(start, 0) + 1
        # Add -1 at end time (overlap decreases)
        self.timeline[end] = self.timeline.get(end, 0) - 1

        max_overlap = 0
        current_overlap = 0

        # Sweep through all time points in sorted order
        # Calculate running sum to find maximum overlap
        for time in self.timeline:
            current_overlap += self.timeline[time]
            max_overlap = max(max_overlap, current_overlap)

        return max_overlap
```

```javascript
// Time: O(n²) in worst case but O(n log n) average
// Space: O(n) for storing the timeline
var MyCalendarThree = function () {
  // Use a Map to store timeline changes
  // We'll extract and sort keys when needed
  this.timeline = new Map();
};

MyCalendarThree.prototype.book = function (start, end) {
  // Update start time (+1)
  this.timeline.set(start, (this.timeline.get(start) || 0) + 1);
  // Update end time (-1)
  this.timeline.set(end, (this.timeline.get(end) || 0) - 1);

  // Get all time points and sort them
  const times = Array.from(this.timeline.keys()).sort((a, b) => a - b);

  let maxOverlap = 0;
  let currentOverlap = 0;

  // Sweep through sorted time points
  for (const time of times) {
    currentOverlap += this.timeline.get(time);
    maxOverlap = Math.max(maxOverlap, currentOverlap);
  }

  return maxOverlap;
};
```

```java
// Time: O(n²) in worst case but O(n log n) average
// Space: O(n) for storing the timeline
import java.util.TreeMap;

class MyCalendarThree {
    private TreeMap<Integer, Integer> timeline;

    public MyCalendarThree() {
        // TreeMap keeps keys (time points) in sorted order
        timeline = new TreeMap<>();
    }

    public int book(int start, int end) {
        // Add +1 at start time
        timeline.put(start, timeline.getOrDefault(start, 0) + 1);
        // Add -1 at end time
        timeline.put(end, timeline.getOrDefault(end, 0) - 1);

        int maxOverlap = 0;
        int currentOverlap = 0;

        // Iterate through all time points in sorted order
        // TreeMap.values() returns values in key-sorted order
        for (int change : timeline.values()) {
            currentOverlap += change;
            maxOverlap = Math.max(maxOverlap, currentOverlap);
        }

        return maxOverlap;
    }
}
```

</div>

**Important Note about Time Complexity:** The Python solution using `SortedDict` gives us `O(log n)` insertions and `O(n)` scanning. The Java `TreeMap` solution has the same complexity. The JavaScript solution requires sorting keys each time, which is `O(n log n)` per operation. All solutions have `O(n²)` worst-case total time because we scan all points after each booking, but in practice this is efficient enough for the problem constraints.

## Complexity Analysis

**Time Complexity:**

- **Per booking:** `O(n)` where `n` is the number of distinct time points stored
  - Updating the map: `O(log n)` for insertion (or `O(1)` with sorting after)
  - Scanning through all time points: `O(n)`
- **Total for `n` bookings:** `O(n²)` in worst case
  - Each booking might scan through all previous time points
  - However, in practice, the number of distinct time points grows slower than `n`

**Space Complexity:** `O(n)` where `n` is the number of distinct time points stored in the timeline. Each booking adds at most 2 new time points (start and end).

## Common Mistakes

1. **Forgetting that intervals are half-open `[start, end)`**: This is crucial because an event ending at time `t` does not overlap with another event starting at time `t`. Many candidates mistakenly use inclusive intervals, which leads to incorrect overlap counting.

2. **Not handling duplicate time points correctly**: When multiple events start or end at the same time, you need to sum their contributions. Using a simple dictionary without summing can lose events that share boundaries.

3. **Rescanning the entire timeline inefficiently**: Some candidates rebuild the entire timeline from scratch after each booking, which is `O(n log n)` per operation instead of `O(n)`. While this might still pass, it's less efficient.

4. **Confusing maximum overlap with current overlap**: The problem asks for the maximum `k`-booking between **all previous events**, not just the current booking's overlap. You need to track the historical maximum, not just check the latest booking.

## When You'll See This Pattern

The sweep line algorithm with cumulative sums appears in many interval-related problems:

1. **Meeting Rooms II (LeetCode 253)** - Very similar pattern: find the minimum number of rooms needed given meeting intervals, which is essentially the maximum overlap problem.

2. **Corporate Flight Bookings (LeetCode 1109)** - Uses the same difference array technique to efficiently apply range updates.

3. **Range Addition (LeetCode 370)** - Another problem where you apply multiple range updates and need to query the final state.

The core pattern: When you need to track how many intervals cover each point, think of representing each interval as `+1` at start and `-1` at end, then sweep through sorted points maintaining a running sum.

## Key Takeaways

1. **Sweep line + difference array** is a powerful technique for interval overlap problems. Represent intervals as changes at boundaries rather than tracking every point.

2. **Sorted data structures are your friend** for maintaining timeline of events. TreeMap (Java), SortedDict (Python), or manual sorting (JavaScript) help efficiently process events in chronological order.

3. **Half-open intervals matter** in calendar/scheduling problems. Always check whether the problem uses `[start, end)` or `[start, end]` notation, as this affects boundary conditions.

Related problems: [My Calendar I](/problem/my-calendar-i), [My Calendar II](/problem/my-calendar-ii), [Count Integers in Intervals](/problem/count-integers-in-intervals)
