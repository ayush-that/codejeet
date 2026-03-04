---
title: "Greedy Questions at Amazon: What to Expect"
description: "Prepare for Greedy interview questions at Amazon — patterns, difficulty breakdown, and study tips."
date: "2027-03-01"
category: "dsa-patterns"
tags: ["amazon", "greedy", "interview prep"]
---

Greedy algorithms are a core part of Amazon's technical interview repertoire. With 225 specific Greedy problems in their question bank—representing a significant portion of their 1938 total questions—this category is not one you can afford to overlook. At Amazon, the ability to identify and implement a greedy approach reflects key leadership principles like _Bias for Action_ and _Invent and Simplify_. A greedy solution often provides the most efficient, straightforward path to a working algorithm, demonstrating you can prioritize immediate, optimal steps to reach a global solution. Mastering these problems shows you can think pragmatically about resource allocation, scheduling, and optimization—all central to Amazon's scale and operational challenges.

## What to Expect — Types of Problems

Amazon's greedy questions typically fall into a few predictable patterns. You won't be asked to prove optimality mathematically, but you must convincingly argue why your greedy choice leads to a correct solution.

- **Interval Problems:** These are extremely common. You'll be given a set of intervals (meetings, tasks, events) and asked to schedule or select them. Classic examples include "Meeting Rooms II" (finding the minimum number of rooms) and "Non-overlapping Intervals" (removing the minimum number to make all intervals non-overlapping).
- **Assignment & Partitioning:** Problems where you need to assign resources or split a sequence. "Task Scheduler" is a famous example, mimicking workload distribution. Another is partitioning a sequence into chunks to satisfy a condition (e.g., "Partition Labels").
- **Jump Game & Reachability:** Problems like "Jump Game" and "Jump Game II" ask if you can reach the end of an array and the minimum steps to do so. These test your ability to make locally optimal jumps.
- **String Manipulation:** Problems such as "Rearrange String k Distance Apart" or finding the lexicographically smallest sequence after removals require making the best possible choice at each step to build the final string.

The key is recognizing the pattern: if a problem asks for a minimum or maximum result and the solution involves making a series of locally optimal choices, it's likely greedy.

## How to Prepare — Study Tips with One Code Example

Your preparation should focus on pattern identification, not memorization. Start by learning the classic greedy problems until you can instantly recognize their variants. Practice verbalizing your reasoning: "At each step, I will choose the interval that ends earliest to maximize the number of non-overlapping intervals."

Always validate your greedy choice with a few edge cases. Ask yourself: "If I make this choice now, could it prevent a better outcome later?" For interval problems, sorting is almost always the first step.

Consider the classic "Maximum Number of Events That Can Be Attended" problem. The greedy strategy is to always attend the event that ends the soonest among those available today.

<div class="code-group">

```python
import heapq

def maxEvents(events):
    # Sort events by start day
    events.sort(key=lambda x: x[0])
    total_days = max(end for _, end in events)
    min_heap = []
    event_idx = 0
    count = 0

    for day in range(1, total_days + 1):
        # Add all events that start today to the min-heap (by end day)
        while event_idx < len(events) and events[event_idx][0] == day:
            heapq.heappush(min_heap, events[event_idx][1])
            event_idx += 1
        # Remove events that have already ended
        while min_heap and min_heap[0] < day:
            heapq.heappop(min_heap)
        # Attend the event that ends the soonest
        if min_heap:
            heapq.heappop(min_heap)
            count += 1
    return count
```

```javascript
function maxEvents(events) {
  events.sort((a, b) => a[0] - b[0]);
  const totalDays = Math.max(...events.map((e) => e[1]));
  const minHeap = new MinPriorityQueue();
  let eventIdx = 0;
  let count = 0;

  for (let day = 1; day <= totalDays; day++) {
    // Add all events starting today
    while (eventIdx < events.length && events[eventIdx][0] === day) {
      minHeap.enqueue(events[eventIdx][1]);
      eventIdx++;
    }
    // Remove events that have already ended
    while (!minHeap.isEmpty() && minHeap.front().element < day) {
      minHeap.dequeue();
    }
    // Attend the event that ends the soonest
    if (!minHeap.isEmpty()) {
      minHeap.dequeue();
      count++;
    }
  }
  return count;
}
```

```java
public int maxEvents(int[][] events) {
    // Sort events by start day
    Arrays.sort(events, (a, b) -> a[0] - b[0]);
    int totalDays = 0;
    for (int[] e : events) totalDays = Math.max(totalDays, e[1]);

    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    int eventIdx = 0, count = 0;

    for (int day = 1; day <= totalDays; day++) {
        // Add all events starting today
        while (eventIdx < events.length && events[eventIdx][0] == day) {
            minHeap.offer(events[eventIdx][1]);
            eventIdx++;
        }
        // Remove events that have already ended
        while (!minHeap.isEmpty() && minHeap.peek() < day) {
            minHeap.poll();
        }
        // Attend the event that ends the soonest
        if (!minHeap.isEmpty()) {
            minHeap.poll();
            count++;
        }
    }
    return count;
}
```

</div>

## Recommended Practice Order

1.  **Foundations:** Start with absolute classics: "Meeting Rooms II", "Non-overlapping Intervals", "Jump Game", and "Task Scheduler". Ensure you can code them flawlessly.
2.  **Core Patterns:** Move to problems that solidify the main categories: "Partition Labels", "Gas Station", "Minimum Number of Arrows to Burst Balloons".
3.  **Amazon-Focused:** Finally, target problems frequently reported in Amazon interviews. These often combine greedy with simple data structures (heaps, sorting), as seen in the example above.

Build your intuition by always asking the core question: "What is the single best thing I can do right now?"

[Practice Greedy at Amazon](/company/amazon/greedy)
