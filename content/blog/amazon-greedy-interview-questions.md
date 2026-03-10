---
title: "Greedy Questions at Amazon: What to Expect"
description: "Prepare for Greedy interview questions at Amazon — patterns, difficulty breakdown, and study tips."
date: "2027-02-21"
category: "dsa-patterns"
tags: ["amazon", "greedy", "interview prep"]
---

Greedy algorithms are deceptively simple in concept—make the locally optimal choice at each step—but notoriously difficult to prove correct. At Amazon, with 225 Greedy questions in their LeetCode catalog (roughly 11.6% of their total), this topic is not a niche interest but a core assessment area. In real interviews, you're less likely to get a "pure" greedy problem labeled as such and more likely to encounter a problem where a greedy approach is the optimal, efficient solution among other plausible ones. Amazon interviewers favor these problems because they test a candidate's ability to identify the correct "rule" or sorting criteria that leads to a global optimum, mirroring real-world system design decisions about resource allocation, scheduling, and cost minimization. If you can't justify _why_ your greedy choice works, you'll struggle, even if your code is correct.

## Specific Patterns Amazon Favors

Amazon's greedy problems often cluster around **interval scheduling, task/CPU scheduling, and array-based "pick or skip" decisions**. They heavily favor problems that require a **sorting pre-processing step**, turning a seemingly complex problem into a straightforward single-pass traversal. You won't see many esoteric graph-greedy hybrids here; the focus is on applied, business-logic-adjacent optimization.

Two dominant patterns stand out:

1.  **"Earliest End Time" for Intervals:** The classic "schedule the most non-overlapping events" pattern. The greedy rule is: always pick the interval that ends the soonest, as it leaves the most room for future intervals.
2.  **"Greedy Assignment with Two Passes or Counters":** Problems where you allocate resources (like meeting rooms, workers, or gas) by tracking deficits and surpluses, often using a single variable that is reset or accumulated.

For example, **Meeting Rooms II (LeetCode #253)** is a favorite that tests if you can identify the minimal resource count needed. The optimal greedy-adjacent solution uses a min-heap to track end times, but the core insight is greedy: assign a new room only if the earliest ending meeting hasn't finished.

<div class="code-group">

```python
# LeetCode #253 - Meeting Rooms II
# Time: O(N log N) for sorting + O(N log K) for heap ops, where K is rooms.
# Space: O(N) for sorting in Python (Timsort) + O(K) for heap, K <= N.
import heapq

def minMeetingRooms(intervals):
    if not intervals:
        return 0

    # Sort by start time (greedy pre-processing)
    intervals.sort(key=lambda x: x[0])

    # Min-heap to store END times of ongoing meetings
    free_rooms = []

    # Greedy allocation: for each new meeting, check if earliest ending is free
    for start, end in intervals:
        # If the earliest ending meeting is done by this start time, free its room
        if free_rooms and free_rooms[0] <= start:
            heapq.heappop(free_rooms)
        # Assign a room (push the current meeting's end time)
        heapq.heappush(free_rooms, end)

    # The heap size is the max concurrent rooms needed
    return len(free_rooms)
```

```javascript
// LeetCode #253 - Meeting Rooms II
// Time: O(N log N) for sorting + O(N log K) for heap ops.
// Space: O(N) for sorting + O(K) for heap.
function minMeetingRooms(intervals) {
  if (!intervals || intervals.length === 0) return 0;

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  // Min-heap (using array and manual sort or priority queue library).
  // Here, we simulate with an array and binary search/insert for simplicity.
  // In a real interview, you might implement a proper MinHeap class.
  const endTimes = [];

  for (const [start, end] of intervals) {
    // If earliest end time is <= start, reuse that room
    if (endTimes.length > 0 && endTimes[0] <= start) {
      endTimes.shift(); // O(K) - use a heap for O(log K)
    }
    // Add current meeting's end time
    endTimes.push(end);
    endTimes.sort((a, b) => a - b); // O(K log K) - again, use a heap.
  }
  return endTimes.length;
}
// Note: For JS, it's acceptable to explain you'd use a heap for O(N log N).
```

```java
// LeetCode #253 - Meeting Rooms II
// Time: O(N log N) for sorting + O(N log K) for heap ops.
// Space: O(N) for sorting + O(K) for heap.
import java.util.*;

public int minMeetingRooms(int[][] intervals) {
    if (intervals == null || intervals.length == 0) return 0;

    // Sort by start time
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

    // Min-heap to store end times
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();

    for (int[] interval : intervals) {
        int start = interval[0], end = interval[1];
        // If the earliest ending meeting is done, free that room
        if (!minHeap.isEmpty() && minHeap.peek() <= start) {
            minHeap.poll();
        }
        // Assign a room
        minHeap.offer(end);
    }
    return minHeap.size();
}
```

</div>

Another quintessential Amazon problem is **Gas Station (LeetCode #134)**, which uses a greedy single-pass approach with a total surplus/deficit check.

## How to Prepare

Your study should focus on **pattern recognition and proof-of-correctness reasoning**. When you practice, don't just code. Ask yourself: "Why is it safe to make this greedy choice? What property guarantees it won't break future optimality?"

1.  **Always Sort First:** For array/interview problems, your first instinct should be: "Can I sort this to create a greedy property?" Try sorting by start time, end time, or a custom comparator (e.g., profit minus cost).
2.  **Look for "Best Fit" Signals:** Problems asking for "minimum number of resources," "maximum number of tasks," or "is it possible to complete" are greedy candidates.
3.  **Practice the Two-Pass Proof:** For many problems, you need to check total feasibility first, then find the starting point. Gas Station is the archetype.

<div class="code-group">

```python
# LeetCode #134 - Gas Station
# Time: O(N) | Space: O(1)
def canCompleteCircuit(gas, cost):
    total_surplus = 0
    current_surplus = 0
    start_index = 0

    for i in range(len(gas)):
        total_surplus += gas[i] - cost[i]
        current_surplus += gas[i] - cost[i]

        # Greedy choice: if we run out of gas at i, start at i+1
        if current_surplus < 0:
            current_surplus = 0
            start_index = i + 1

    # Only possible if total gas >= total cost
    return start_index if total_surplus >= 0 else -1
```

```javascript
// LeetCode #134 - Gas Station
// Time: O(N) | Space: O(1)
function canCompleteCircuit(gas, cost) {
  let totalSurplus = 0;
  let currentSurplus = 0;
  let startIndex = 0;

  for (let i = 0; i < gas.length; i++) {
    totalSurplus += gas[i] - cost[i];
    currentSurplus += gas[i] - cost[i];

    // Greedy reset
    if (currentSurplus < 0) {
      currentSurplus = 0;
      startIndex = i + 1;
    }
  }
  return totalSurplus >= 0 ? startIndex : -1;
}
```

```java
// LeetCode #134 - Gas Station
// Time: O(N) | Space: O(1)
public int canCompleteCircuit(int[] gas, int[] cost) {
    int totalSurplus = 0;
    int currentSurplus = 0;
    int startIndex = 0;

    for (int i = 0; i < gas.length; i++) {
        totalSurplus += gas[i] - cost[i];
        currentSurplus += gas[i] - cost[i];

        if (currentSurplus < 0) {
            currentSurplus = 0;
            startIndex = i + 1;
        }
    }
    return totalSurplus >= 0 ? startIndex : -1;
}
```

</div>

## How Amazon Tests Greedy vs Other Companies

At Amazon, greedy questions are often framed within a **practical, operational context**. You might hear a story about optimizing warehouse robot paths, scheduling delivery trucks, or allocating server capacity. The difficulty is moderate—usually LeetCode Medium—but the trap is over-engineering. Candidates often jump to dynamic programming or complex BFS when a simple greedy sort solves it. At Google or Meta, greedy problems might be more mathematically intricate or embedded within a graph algorithm (e.g., Minimum Spanning Tree). At Amazon, the "greedy insight" is usually about **sorting and linear traversal**.

What's unique is the follow-up: "Can you prove this works?" or "What if we had two types of resources?" Be prepared to discuss edge cases and slight variations.

## Study Order

1.  **Basic Sorting Greedy:** Start with the foundational "pick optimal item" problems. This builds intuition for why sorting enables greedy choices.
    - Example: **Assign Cookies (LeetCode #455)**.
2.  **Interval Scheduling:** Learn the "earliest finish time" paradigm. This is a critical pattern for resource allocation.
    - Example: **Non-overlapping Intervals (LeetCode #435)**.
3.  **Greedy on Arrays with Counters:** Problems where you track balances (like gas station or parentheses validation). This teaches single-pass accumulation.
    - Example: **Gas Station (LeetCode #134)**.
4.  **Task Scheduling with Heaps:** This combines greedy choice with a data structure for efficiency. It's a bridge to more complex problems.
    - Example: **Meeting Rooms II (LeetCode #253)**.
5.  **"Jump Game" Variants:** These test greedy reachability and are common at Amazon.
    - Example: **Jump Game II (LeetCode #45)**.
6.  **Advanced Greedy with Proof:** Finally, tackle problems where the greedy rule is non-obvious and requires rigorous justification.
    - Example: **Task Scheduler (LeetCode #621)**.

This order works because it progresses from simple sorting intuition to combining greedy with data structures, ending with problems that demand deeper proof, which is exactly how Amazon interviews escalate.

## Recommended Practice Order

Solve these Amazon-tagged problems in sequence:

1.  **Assign Cookies (#455)** – Warm-up with sorting and two pointers.
2.  **Non-overlapping Intervals (#435)** – Master the interval sorting pattern.
3.  **Minimum Number of Arrows to Burst Balloons (#452)** – A slight twist on intervals.
4.  **Gas Station (#134)** – Learn the total/cumulative surplus pattern.
5.  **Jump Game (#55)** and **Jump Game II (#45)** – Greedy reachability.
6.  **Meeting Rooms II (#253)** – Greedy + heap for resource counting.
7.  **Task Scheduler (#621)** – Advanced greedy with idle time calculation.
8.  **Maximum Subarray (#53)** – Kadane’s algorithm (greedy/DP hybrid).
9.  **Partition Labels (#763)** – Greedy partitioning with last occurrence tracking.
10. **Two City Scheduling (#1029)** – Greedy sorting on cost difference.

This sequence builds complexity and covers the core patterns you will see. Remember, at Amazon, communicating your reasoning is as important as the code. Always state your greedy choice and justify it.

[Practice Greedy at Amazon](/company/amazon/greedy)
