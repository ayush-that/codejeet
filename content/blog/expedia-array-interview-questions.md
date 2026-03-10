---
title: "Array Questions at Expedia: What to Expect"
description: "Prepare for Array interview questions at Expedia — patterns, difficulty breakdown, and study tips."
date: "2029-05-27"
category: "dsa-patterns"
tags: ["expedia", "array", "interview prep"]
---

## Why Array Questions Dominate Expedia Interviews

With 26 out of 54 total coding questions tagged as Array problems, Expedia clearly considers this a core data structure for assessing candidates. This isn't surprising — arrays form the backbone of real-world travel systems. Think about flight itineraries (arrays of segments), hotel availability calendars (2D arrays), price lists for different dates, or user preference rankings. The interviewers aren't just testing algorithmic knowledge; they're evaluating how you handle the kind of sequential data their systems process daily.

In my experience conducting mock interviews with Expedia candidates, array questions appear in nearly every technical round. They serve as the foundation for more complex discussions about system design and optimization. What makes Expedia's array questions particularly interesting is their practical slant — you'll rarely see purely academic problems. Instead, expect scenarios that mirror actual travel platform challenges.

## Specific Patterns Expedia Favors

Expedia's array problems cluster around three practical patterns:

**1. Sliding Window with Business Logic**
These aren't textbook sliding windows. You'll get constraints like "find the maximum revenue period given daily booking counts" or "identify the longest streak of available hotel rooms." The window mechanics are straightforward, but the business logic inside the window requires careful implementation.

**2. Array Transformation with In-Place Operations**
Expedia systems often optimize memory usage when handling large datasets. You'll see problems requiring in-place modifications, like reorganizing flight segments or compressing user activity logs. These test your ability to manipulate indices without extra space.

**3. Multi-Pointer Techniques for Scheduling**
Given their scheduling-heavy domain (flights, hotels, cars), Expedia loves problems where you manage multiple pointers to merge intervals, find conflicts, or optimize allocations. These questions assess how you handle overlapping constraints.

A classic example is **Meeting Rooms II (LeetCode #253)** — but with Expedia's twist. Instead of meeting rooms, you might be allocating airport gates to arriving flights or hotel check-in desks to guests. The core pattern remains: sort by start time, use a min-heap for end times, but the edge cases become domain-specific.

## How to Prepare: Master the Scheduling Pattern

The most frequent pattern I've seen is interval scheduling with resource allocation. Let's examine the core approach with a hotel booking scenario:

<div class="code-group">

```python
def min_rooms_required(intervals):
    """
    Calculate minimum conference rooms needed for meetings.
    Similar to hotel check-in desk allocation problems.

    Time: O(n log n) - sorting dominates
    Space: O(n) - for the two sorted arrays
    """
    if not intervals:
        return 0

    # Separate start and end times
    starts = sorted([i[0] for i in intervals])
    ends = sorted([i[1] for i in intervals])

    rooms_needed = 0
    max_rooms = 0
    start_ptr = 0
    end_ptr = 0

    # Process in chronological order
    while start_ptr < len(intervals):
        if starts[start_ptr] < ends[end_ptr]:
            # A meeting starts before one ends, need another room
            rooms_needed += 1
            start_ptr += 1
            max_rooms = max(max_rooms, rooms_needed)
        else:
            # A meeting ends, free up a room
            rooms_needed -= 1
            end_ptr += 1

    return max_rooms
```

```javascript
function minRoomsRequired(intervals) {
  /**
   * Calculate minimum conference rooms needed for meetings.
   * Similar to hotel check-in desk allocation problems.
   *
   * Time: O(n log n) - sorting dominates
   * Space: O(n) - for the two sorted arrays
   */
  if (!intervals || intervals.length === 0) return 0;

  // Separate start and end times
  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);

  let roomsNeeded = 0;
  let maxRooms = 0;
  let startPtr = 0;
  let endPtr = 0;

  // Process in chronological order
  while (startPtr < intervals.length) {
    if (starts[startPtr] < ends[endPtr]) {
      // A meeting starts before one ends, need another room
      roomsNeeded++;
      startPtr++;
      maxRooms = Math.max(maxRooms, roomsNeeded);
    } else {
      // A meeting ends, free up a room
      roomsNeeded--;
      endPtr++;
    }
  }

  return maxRooms;
}
```

```java
public int minRoomsRequired(int[][] intervals) {
    /**
     * Calculate minimum conference rooms needed for meetings.
     * Similar to hotel check-in desk allocation problems.
     *
     * Time: O(n log n) - sorting dominates
     * Space: O(n) - for the two sorted arrays
     */
    if (intervals == null || intervals.length == 0) return 0;

    // Separate start and end times
    int[] starts = new int[intervals.length];
    int[] ends = new int[intervals.length];

    for (int i = 0; i < intervals.length; i++) {
        starts[i] = intervals[i][0];
        ends[i] = intervals[i][1];
    }

    Arrays.sort(starts);
    Arrays.sort(ends);

    int roomsNeeded = 0;
    int maxRooms = 0;
    int startPtr = 0;
    int endPtr = 0;

    // Process in chronological order
    while (startPtr < intervals.length) {
        if (starts[startPtr] < ends[endPtr]) {
            // A meeting starts before one ends, need another room
            roomsNeeded++;
            startPtr++;
            maxRooms = Math.max(maxRooms, roomsNeeded);
        } else {
            // A meeting ends, free up a room
            roomsNeeded--;
            endPtr++;
        }
    }

    return maxRooms;
}
```

</div>

The key insight here is using two pointers to track overlapping intervals without a heap. This approach is particularly valuable at Expedia because it's more memory-efficient for large datasets (like thousands of flight arrivals).

## How Expedia Tests Array vs Other Companies

Expedia's array questions differ from FAANG companies in three noticeable ways:

**1. Less Emphasis on Pure Optimization**
At Google, you might need to shave milliseconds off a sorting algorithm. At Expedia, they care more about readable, maintainable code that handles edge cases. I've seen candidates penalized for overly clever one-liners that sacrifice clarity.

**2. Domain Context Matters**
While Amazon might ask abstract array manipulation, Expedia wraps problems in travel scenarios. "Rotate an array" becomes "rotate flight segments in an itinerary." This tests your ability to map real-world problems to algorithmic solutions.

**3. Moderate Difficulty with Practical Twists**
Expedia's questions typically range from LeetCode Medium to Medium-Hard, but with practical constraints. You might need to modify a standard solution to account for business rules like "minimum connection times" or "blackout dates."

## Study Order: Build From Foundations

Don't jump straight to complex interval problems. Follow this progression:

1. **Basic Array Operations** - Master traversal, insertion, deletion. These fundamentals appear in every array problem.
2. **Two-Pointer Techniques** - Essential for in-place operations and many Expedia problems.
3. **Sliding Window Patterns** - Start with fixed windows, then move to variable windows with constraints.
4. **Interval Problems** - Begin with simple overlap detection (#252), then progress to scheduling (#253).
5. **Array Transformation** - Practice rotating, rearranging, and compressing arrays in-place.
6. **Multi-Array Operations** - Work with 2D arrays and multiple related arrays.

This order works because each concept builds on the previous one. Two-pointer skills directly apply to sliding windows. Interval problems combine sorting with pointer management. Trying interval problems before mastering pointers leads to messy, buggy code.

## Recommended Practice Order

Solve these problems in sequence to build Expedia-relevant skills:

1. **Two Sum (#1)** - Basic hash map usage with arrays
2. **Best Time to Buy and Sell Stock (#121)** - Simple single-pass logic
3. **Merge Intervals (#56)** - Foundation for scheduling problems
4. **Meeting Rooms II (#253)** - Core scheduling pattern
5. **Rotate Array (#189)** - In-place manipulation practice
6. **Product of Array Except Self (#238)** - Clever transformation thinking
7. **Insert Interval (#57)** - Builds on #56 with added complexity
8. **Car Pooling (#1094)** - Expedia-style scheduling with capacity
9. **Maximum Subarray (#53)** - Kadane's algorithm for revenue optimization
10. **Find All Duplicates in an Array (#442)** - In-place marking technique

After completing these, search for Expedia-specific questions tagged on LeetCode. Look for problems mentioning "flights," "hotels," "bookings," or "itineraries" to get the closest simulation of actual interview questions.

[Practice Array at Expedia](/company/expedia/array)
