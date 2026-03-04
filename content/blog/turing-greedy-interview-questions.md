---
title: "Greedy Questions at Turing: What to Expect"
description: "Prepare for Greedy interview questions at Turing — patterns, difficulty breakdown, and study tips."
date: "2030-03-15"
category: "dsa-patterns"
tags: ["turing", "greedy", "interview prep"]
---

Greedy algorithms are a small but critical part of the Turing coding interview. With 4 out of 40 questions typically dedicated to this paradigm, you cannot afford to ignore them. While the count may seem low, these questions are often high-impact. They test your ability to identify optimal substructure and make locally optimal choices that lead to a globally optimal solution—a key skill for designing efficient systems. Failing a greedy problem can be a significant setback in your overall score.

## What to Expect — Types of Problems

Turing's greedy questions tend to focus on practical, recognizable patterns rather than obscure mathematical puzzles. You can expect problems in these core categories:

1.  **Interval Scheduling:** Problems involving selecting non-overlapping intervals, such as meeting rooms or tasks, to maximize count or minimize conflicts.
2.  **Coin Change / Making Change:** Given coin denominations, find the minimum number of coins to make a target amount (when the greedy approach is valid, unlike the dynamic programming version).
3.  **Assignments & Pairings:** Problems like assigning cookies to children or matching speed to efficiency to maximize or minimize a metric.
4.  **Jump Game Variants:** Determining the minimum number of jumps to reach the end of an array.

The challenge is rarely in coding complexity; it's in proving to yourself that a greedy approach will work for the given problem constraints.

## How to Prepare — Study Tips with One Code Example

Your preparation should focus on pattern recognition and validation. Don't just memorize solutions. For each problem, ask: "Why is the greedy choice optimal here?" Practice the following steps:

1.  **Identify the greedy choice:** What is the local optimal decision at each step? (e.g., always pick the earliest ending interval).
2.  **Prove safety:** Argue that this choice is part of some optimal solution.
3.  **Implement efficiently:** This often involves sorting first, then making a single pass.

A classic example is the **"Meeting Rooms II"** style problem: given intervals, find the minimum number of rooms (or resources) needed to avoid conflicts. The efficient greedy approach uses a min-heap to track end times.

<div class="code-group">

```python
import heapq

def min_meeting_rooms(intervals):
    if not intervals:
        return 0

    intervals.sort(key=lambda x: x[0])  # Sort by start time
    end_times = []  # min-heap
    heapq.heappush(end_times, intervals[0][1])

    for interval in intervals[1:]:
        start, end = interval
        # If the room due to free the earliest is free before this start time, reuse it
        if end_times[0] <= start:
            heapq.heappop(end_times)
        # Assign a new room (or the reused one)
        heapq.heappush(end_times, end)

    return len(end_times)
```

```javascript
function minMeetingRooms(intervals) {
  if (intervals.length === 0) return 0;

  intervals.sort((a, b) => a[0] - b[0]); // Sort by start time
  const endTimes = []; // min-heap (using array and manual sort)

  function pushHeap(val) {
    endTimes.push(val);
    endTimes.sort((a, b) => a - b);
  }
  function popHeap() {
    return endTimes.shift();
  }

  pushHeap(intervals[0][1]);

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    // Reuse a room if the earliest ending meeting is done
    if (endTimes[0] <= start) {
      popHeap();
    }
    // Assign new room
    pushHeap(end);
  }
  return endTimes.length;
}
```

```java
import java.util.*;

public class Solution {
    public int minMeetingRooms(int[][] intervals) {
        if (intervals.length == 0) return 0;

        // Sort by start time
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        // Min-heap to store end times
        PriorityQueue<Integer> endTimes = new PriorityQueue<>();

        endTimes.add(intervals[0][1]);

        for (int i = 1; i < intervals.length; i++) {
            int start = intervals[i][0];
            int end = intervals[i][1];
            // If the earliest ending meeting is done, reuse that room
            if (endTimes.peek() <= start) {
                endTimes.poll();
            }
            // Assign a new room (or the freed one)
            endTimes.add(end);
        }
        return endTimes.size();
    }
}
```

</div>

## Recommended Practice Order

Build your understanding progressively:

1.  Start with foundational problems: **Assign Cookies**, **Lemonade Change**.
2.  Move to interval problems: **Non-overlapping Intervals**, **Minimum Number of Arrows to Burst Balloons**.
3.  Tackle jump problems: **Jump Game I & II**.
4.  Conclude with advanced greedy: **Task Scheduler**, **Gas Station**.

Master these patterns. In the interview, clearly articulate your reasoning before coding. A correct greedy solution is typically concise and efficient, leaving a strong impression.

[Practice Greedy at Turing](/company/turing/greedy)
