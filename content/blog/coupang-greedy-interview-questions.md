---
title: "Greedy Questions at Coupang: What to Expect"
description: "Prepare for Greedy interview questions at Coupang — patterns, difficulty breakdown, and study tips."
date: "2029-07-04"
category: "dsa-patterns"
tags: ["coupang", "greedy", "interview prep"]
---

Greedy algorithms are a significant part of Coupang's technical interview, representing about 11% of their problem catalog. For a company optimizing massive logistics networks, delivery routes, and inventory allocation, greedy strategies—making the locally optimal choice at each step—are not just an academic exercise but a practical tool for real-time decision-making. Mastering these questions demonstrates you can think about efficiency and incremental optimization, which is core to Coupang's operations.

## What to Expect — Types of Problems

Coupang's greedy questions typically fall into a few predictable categories. You won't see overly complex mathematical proofs; instead, expect applied problems where a sorted order or a simple rule leads to the solution.

- **Interval Scheduling:** Problems involving meeting rooms, tasks, or time intervals where you need to select the maximum number of non-overlapping activities. This is a classic greedy pattern.
- **Assignment & Partitioning:** Distributing resources or splitting groups in a way that minimizes cost or maximizes fairness (e.g., load balancing, dividing array into subsets).
- **Coin Change / Greedy Choice:** Problems where the standard greedy coin algorithm works (e.g., using the largest denomination first). Be cautious, as this only applies to specific coin systems.
- **String Manipulation:** Constructing lexicographically smallest/largest strings or palindromes by making optimal character-by-character choices.

The key is recognizing the problem allows for a greedy approach. The interviewer will often want to hear your reasoning: _"Why is it safe to take this item first?"_

## How to Prepare — Study Tips with One Code Example

First, solidify the core principle: a greedy algorithm builds a solution piece by piece, always choosing the next piece that offers the most immediate benefit. To prepare:

1.  **Learn the canonical patterns:** Interval scheduling, task scheduling, and greedy coin change are fundamental. Understand why sorting is often the first step.
2.  **Prove it to yourself:** Before coding, verbally justify why the greedy choice is optimal. This is crucial for the interview discussion.
3.  **Start with sorting:** If a problem involves "maximum number," "minimum cost," or "optimal arrangement," try sorting the data first. The solution often emerges from processing the sorted order.

A perfect example is the **"Maximum Number of Events You Can Attend"** type problem. The greedy strategy is to always attend the event that ends the earliest, freeing up your time for more events later.

<div class="code-group">

```python
def max_events(events):
    # events: list of [startDay, endDay]
    events.sort(key=lambda x: x[1])  # Sort by end day
    attended = set()
    for start, end in events:
        # Attend on the first available day within the event's range
        for day in range(start, end + 1):
            if day not in attended:
                attended.add(day)
                break
    return len(attended)
```

```javascript
function maxEvents(events) {
  // events: array of [startDay, endDay]
  events.sort((a, b) => a[1] - b[1]); // Sort by end day
  const attended = new Set();
  for (const [start, end] of events) {
    for (let day = start; day <= end; day++) {
      if (!attended.has(day)) {
        attended.add(day);
        break;
      }
    }
  }
  return attended.size;
}
```

```java
public int maxEvents(int[][] events) {
    // events: array of [startDay, endDay]
    Arrays.sort(events, (a, b) -> Integer.compare(a[1], b[1])); // Sort by end day
    Set<Integer> attended = new HashSet<>();
    for (int[] event : events) {
        for (int day = event[0]; day <= event[1]; day++) {
            if (!attended.contains(day)) {
                attended.add(day);
                break;
            }
        }
    }
    return attended.size();
}
```

</div>

## Recommended Practice Order

Tackle problems in this order to build confidence:

1.  **Classic Foundations:** Start with simple interval scheduling (Meeting Rooms, Non-overlapping Intervals).
2.  **Greedy on Sorted Arrays:** Move to problems like Assign Cookies or Minimum Number of Arrows to Burst Balloons.
3.  **More Complex Selection:** Try Task Scheduler or problems requiring a priority queue (heap) to manage the greedy choice efficiently.
4.  **Coupang-Specific:** Finally, practice the actual greedy problems tagged for Coupang on CodeJeet to familiarize yourself with their style and difficulty.

[Practice Greedy at Coupang](/company/coupang/greedy)
