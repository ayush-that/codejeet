---
title: "Greedy Questions at Microsoft: What to Expect"
description: "Prepare for Greedy interview questions at Microsoft — patterns, difficulty breakdown, and study tips."
date: "2027-04-10"
category: "dsa-patterns"
tags: ["microsoft", "greedy", "interview prep"]
---

Greedy algorithms are a practical and frequently tested category at Microsoft because they mirror real-world optimization problems in systems design, resource allocation, and scheduling—core concerns for a company building cloud platforms, operating systems, and enterprise software. With 133 specific greedy questions in their problem bank (nearly 10% of their technical question pool), demonstrating fluency in identifying and implementing greedy strategies is non-negotiable for a successful interview. It tests your ability to recognize when a simple, step-by-step optimal choice leads to a globally optimal solution, a skill directly applicable to writing efficient, scalable code.

## What to Expect — Types of Problems

Microsoft’s greedy questions often fall into predictable patterns. Expect to encounter **interval scheduling problems** (like meeting rooms or task scheduling), **assignment problems** (such as distributing resources or partitioning arrays), and **"greedy choice on sorted data"** problems. A common theme is minimizing or maximizing a value—like the minimum number of arrows to burst balloons, the maximum number of non-overlapping intervals, or the minimum cost to connect points. You will often be given a problem where a brute-force solution is too slow, and the efficient path requires sorting the input first, then making a series of locally optimal decisions. The challenge is proving to yourself and the interviewer that the greedy approach is valid for that specific problem.

## How to Prepare — Study Tips with One Code Example

Your preparation should focus on pattern recognition, not memorization. Start by mastering fundamental greedy problems like Activity Selection, Fractional Knapsack, and Minimum Number of Coins. For each problem, practice articulating the **greedy choice property** and **optimal substructure** in plain English. Always sort the input if it helps make a better local decision. Validate your approach with edge cases: empty input, single element, and duplicate values.

A key pattern is solving interval problems by sorting on the end time and then greedily selecting compatible intervals. Below is the classic "Maximum Number of Non-Overlapping Intervals" solution.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    if not intervals:
        return 0
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    count = 1
    last_end = intervals[0][1]

    for start, end in intervals[1:]:
        if start >= last_end:  # Non-overlapping
            count += 1
            last_end = end
    return len(intervals) - count  # Intervals to remove
```

```javascript
function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;
  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 1;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start >= lastEnd) {
      count++;
      lastEnd = end;
    }
  }
  return intervals.length - count;
}
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    if (intervals.length == 0) return 0;
    // Sort by end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
    int count = 1;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];
        if (start >= lastEnd) {
            count++;
            lastEnd = end;
        }
    }
    return intervals.length - count;
}
```

</div>

## Recommended Practice Order

1.  **Foundations:** Start with basic problems like "Assign Cookies" and "Lemonade Change" to build intuition for greedy decision-making.
2.  **Interval Patterns:** Move to scheduling problems ("Non-overlapping Intervals," "Meeting Rooms II") which are highly frequent at Microsoft.
3.  **Advanced Greedy:** Tackle problems combining greedy with other concepts, like "Task Scheduler" or "Minimum Domino Rotations."
4.  **Microsoft-Tagged:** Finally, filter the problem bank to only Microsoft-tagged greedy questions and solve them under timed conditions.

[Practice Greedy at Microsoft](/company/microsoft/greedy)
