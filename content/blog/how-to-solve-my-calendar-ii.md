---
title: "How to Solve My Calendar II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode My Calendar II. Medium difficulty, 62.9% acceptance rate. Topics: Array, Binary Search, Design, Segment Tree, Prefix Sum."
date: "2028-08-27"
category: "dsa-patterns"
tags: ["my-calendar-ii", "array", "binary-search", "design", "medium"]
---

# How to Solve My Calendar II

You need to implement a calendar that prevents triple bookings — where three events overlap at any point in time. The challenge is efficiently tracking overlapping intervals when events can be added dynamically. What makes this interesting is that we need to detect when adding a new event would create **three overlapping events**, not just two.

## Visual Walkthrough

Let's trace through a concrete example. We'll start with an empty calendar and add events:

1. **Add [10, 20]** — Calendar is empty, so this is accepted.
2. **Add [15, 25]** — This overlaps with [10, 20] from time 15-20. We now have one double booking, but no triple booking, so it's accepted.
3. **Add [5, 15]** — This overlaps with [10, 20] from time 10-15, and with [15, 25] at exactly time 15. At time 15, we have all three events overlapping! This would be a triple booking, so it should be rejected.
4. **Add [5, 10]** — This overlaps with [10, 20] only at time 10 (boundary). Since boundaries are considered non-empty intersections, this creates a double booking with [10, 20] but no triple booking, so it's accepted.

The key insight: we need to track not just which events exist, but specifically where overlaps occur. A triple booking happens when a new event overlaps with an existing **double booking** (an area where two events already overlap).

## Brute Force Approach

A naive approach would store all booked events and check overlaps by comparing the new event with every pair of existing events:

1. Store all accepted events in a list
2. When a new event [start, end) arrives:
   - Create a temporary list of all existing events plus the new event
   - For every time point in the new event's range, count how many events contain it
   - If any time point has count ≥ 3, reject the event
   - Otherwise, accept it and add to the list

The problem with this approach is efficiency. If we have N events, checking every time point is impossible (time is continuous). Even if we discretize time, checking all pairs of events would be O(N²) per booking, which is too slow for the constraints (up to 1000 bookings).

What a candidate might try: store all events and check the new event against each existing event, counting overlaps. But this misses the critical detail — we need to know not just if the new event overlaps with individual events, but if it overlaps with **areas where two events already overlap**.

## Optimized Approach

The key insight is that we can track **overlaps separately from regular bookings**. Think of it this way:

1. **Regular bookings** are intervals where one event exists
2. **Double bookings** are intervals where two events overlap
3. A **triple booking** happens when a new event overlaps with any double booking

We can maintain two lists:

- `bookings`: All successfully booked events
- `overlaps`: Intervals where two events already overlap (double bookings)

When a new event arrives:

1. First check if it overlaps with any interval in `overlaps` (double bookings). If yes, this would create a triple booking → reject immediately.
2. If not, check which existing bookings it overlaps with. For each overlap found:
   - Add the overlapping interval to `overlaps`
3. Add the new event to `bookings`

This approach works because:

- We only need to track double bookings, not all possible overlaps
- Each new event only needs to be checked against existing double bookings and regular bookings
- The overlap intervals we store are minimal (just the actual overlapping regions)

## Optimal Solution

We implement the two-list approach with interval overlap checking. The overlap check is standard: two intervals [s1, e1) and [s2, e2) overlap if `max(s1, s2) < min(e1, e2)`.

<div class="code-group">

```python
# Time: O(n²) where n is number of bookings (in worst case, checking all previous bookings)
# Space: O(n) for storing bookings and overlaps
class MyCalendarTwo:
    def __init__(self):
        # Store all successfully booked events
        self.bookings = []
        # Store intervals where two events overlap (double bookings)
        self.overlaps = []

    def book(self, start: int, end: int) -> bool:
        # Step 1: Check if new event overlaps with any double booking
        # If it does, adding it would create a triple booking
        for overlap_start, overlap_end in self.overlaps:
            if max(start, overlap_start) < min(end, overlap_end):
                # Overlap with a double booking → triple booking!
                return False

        # Step 2: Check overlaps with existing bookings
        # For each overlap found, add to double bookings list
        for book_start, book_end in self.bookings:
            # Calculate overlap between new event and existing booking
            overlap_start = max(start, book_start)
            overlap_end = min(end, book_end)

            if overlap_start < overlap_end:  # They actually overlap
                # Add this overlapping region to double bookings
                self.overlaps.append((overlap_start, overlap_end))

        # Step 3: No triple booking would occur, so add to bookings
        self.bookings.append((start, end))
        return True
```

```javascript
// Time: O(n²) where n is number of bookings
// Space: O(n) for storing bookings and overlaps
class MyCalendarTwo {
  constructor() {
    // Store all successfully booked events
    this.bookings = [];
    // Store intervals where two events overlap (double bookings)
    this.overlaps = [];
  }

  /**
   * @param {number} start
   * @param {number} end
   * @return {boolean}
   */
  book(start, end) {
    // Step 1: Check if new event overlaps with any double booking
    for (const [overlapStart, overlapEnd] of this.overlaps) {
      if (Math.max(start, overlapStart) < Math.min(end, overlapEnd)) {
        // Overlap with a double booking → triple booking!
        return false;
      }
    }

    // Step 2: Check overlaps with existing bookings
    for (const [bookStart, bookEnd] of this.bookings) {
      // Calculate overlap between new event and existing booking
      const overlapStart = Math.max(start, bookStart);
      const overlapEnd = Math.min(end, bookEnd);

      if (overlapStart < overlapEnd) {
        // They actually overlap
        // Add this overlapping region to double bookings
        this.overlaps.push([overlapStart, overlapEnd]);
      }
    }

    // Step 3: No triple booking would occur, so add to bookings
    this.bookings.push([start, end]);
    return true;
  }
}
```

```java
// Time: O(n²) where n is number of bookings
// Space: O(n) for storing bookings and overlaps
class MyCalendarTwo {
    // Store all successfully booked events
    private List<int[]> bookings;
    // Store intervals where two events overlap (double bookings)
    private List<int[]> overlaps;

    public MyCalendarTwo() {
        bookings = new ArrayList<>();
        overlaps = new ArrayList<>();
    }

    public boolean book(int start, int end) {
        // Step 1: Check if new event overlaps with any double booking
        for (int[] overlap : overlaps) {
            int overlapStart = overlap[0];
            int overlapEnd = overlap[1];

            // Check if intervals overlap (exclusive of boundaries)
            if (Math.max(start, overlapStart) < Math.min(end, overlapEnd)) {
                // Overlap with a double booking → triple booking!
                return false;
            }
        }

        // Step 2: Check overlaps with existing bookings
        for (int[] booking : bookings) {
            int bookStart = booking[0];
            int bookEnd = booking[1];

            // Calculate overlap between new event and existing booking
            int overlapStart = Math.max(start, bookStart);
            int overlapEnd = Math.min(end, bookEnd);

            if (overlapStart < overlapEnd) {  // They actually overlap
                // Add this overlapping region to double bookings
                overlaps.add(new int[]{overlapStart, overlapEnd});
            }
        }

        // Step 3: No triple booking would occur, so add to bookings
        bookings.add(new int[]{start, end});
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) in the worst case, where n is the number of successful bookings. For each new event, we check all existing double bookings (up to O(n)) and all existing bookings (O(n)). In practice, it's often better since many events don't overlap.

**Space Complexity:** O(n) for storing the bookings and overlaps lists. Each successful booking adds one interval to `bookings`, and potentially one interval to `overlaps` for each overlapping existing booking.

## Common Mistakes

1. **Incorrect overlap condition:** Using `≤` instead of `<` for interval comparisons. Remember: [10, 20) and [20, 30) do NOT overlap because the end time is exclusive. The correct condition is `max(start1, start2) < min(end1, end2)`.

2. **Forgetting to check double bookings first:** Some candidates check overlaps with regular bookings first, add to double bookings, then check if the new event overlaps with the double booking they just created. This is wrong because you need to check if the new event overlaps with **existing** double bookings before creating new ones.

3. **Not storing minimal overlap intervals:** When two events [10, 20) and [15, 25) overlap, the overlap region is [15, 20), not the entire event. Storing the full events in the overlaps list would cause false triple booking detections.

4. **Boundary condition errors:** Events like [10, 20] and [20, 30] should not be considered overlapping since the end time is exclusive. Always test with events that share exact boundaries.

## When You'll See This Pattern

This "tracking overlaps" pattern appears in several interval problems:

1. **My Calendar I (LeetCode 729)** — Simpler version where no double bookings allowed. The solution uses similar interval checking but only needs to track single bookings.

2. **My Calendar III (LeetCode 732)** — Extended version asking for the maximum k-booking at any time. This requires tracking all overlaps, often solved with sweep line algorithm or segment trees.

3. **Meeting Rooms II (LeetCode 253)** — Finding the minimum number of rooms needed, which is essentially finding the maximum number of overlapping intervals at any time.

The core technique of separating different "levels" of overlap (single, double, triple bookings) can be extended to other problems where you need to track multiple layers of resource usage.

## Key Takeaways

1. **Separate concerns:** When dealing with multiple layers of overlap, track each layer separately. Here we tracked regular bookings and double bookings in separate lists.

2. **Check in the right order:** Always check stricter conditions first (triple booking checks before double booking updates) to avoid incorrect state changes.

3. **Interval math is precise:** The overlap condition `max(start1, start2) < min(end1, end2)` is fundamental. Practice it until it's automatic.

Related problems: [My Calendar I](/problem/my-calendar-i), [My Calendar III](/problem/my-calendar-iii)
