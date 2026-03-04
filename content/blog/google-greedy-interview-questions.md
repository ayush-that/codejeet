---
title: "Greedy Questions at Google: What to Expect"
description: "Prepare for Greedy interview questions at Google — patterns, difficulty breakdown, and study tips."
date: "2027-02-09"
category: "dsa-patterns"
tags: ["google", "greedy", "interview prep"]
---

Greedy algorithms appear in about 10% of Google's technical interview questions. While not the most frequent category, they are a critical filter. Google uses these problems to assess a candidate's ability to identify optimal substructure—the property that a globally optimal solution can be built from locally optimal choices. Success here demonstrates strong problem modeling and logical reasoning, key traits for engineers designing efficient, scalable systems.

## What to Expect — Types of Problems

Google's greedy questions often focus on resource allocation, scheduling, and interval management. You won't typically see abstract algorithmic puzzles; instead, expect practical problems mirroring real-world engineering constraints.

Common patterns include:

- **Interval Scheduling:** Maximizing the number of non-overlapping intervals or minimum rooms for meetings.
- **Assignment Problems:** Tasks like "minimum number of arrows to burst balloons" or "partition labels."
- **Greedy on Sorted Data:** Many solutions begin by sorting the input array to enable a single pass with a local decision rule.
- **Jump Game Variations:** Determining if you can reach the end or the minimum jumps required.

The challenge is rarely in the code complexity but in proving to yourself and the interviewer that the greedy choice is correct. You must articulate _why_ your approach works.

## How to Prepare — Study Tips with One Code Example

Mastering greedy problems requires a shift in mindset. Don't start coding. Start by asking: "If I make the best possible choice at this moment, will it lead to the overall best result?" Look for clues like "minimum," "maximum," "shortest," or "earliest."

A proven study method:

1.  **Learn the canonical patterns** (e.g., interval merging, task scheduling).
2.  **Practice the "greedy proof"** verbally for each problem.
3.  **Code the solution** cleanly after the logic is sound.

A key pattern is solving interval problems by sorting on the end time. Consider the classic "Maximum Number of Non-Overlapping Intervals."

**Problem:** Given an array of intervals `[start, end]`, find the maximum number of non-overlapping intervals.

**Greedy Choice:** Always pick the interval that ends the earliest, as it leaves the most room for future intervals.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    count = 0
    last_end = float('-inf')

    for start, end in intervals:
        if start >= last_end:  # Non-overlapping
            last_end = end
            count += 1
    return count
```

```javascript
function eraseOverlapIntervals(intervals) {
  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let lastEnd = -Infinity;

  for (const [start, end] of intervals) {
    if (start >= lastEnd) {
      lastEnd = end;
      count++;
    }
  }
  return count;
}
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    // Sort by end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
    int count = 0;
    int lastEnd = Integer.MIN_VALUE;

    for (int[] interval : intervals) {
        int start = interval[0];
        int end = interval[1];
        if (start >= lastEnd) {
            lastEnd = end;
            count++;
        }
    }
    return count;
}
```

</div>

## Recommended Practice Order

Build competency progressively:

1.  **Foundations:** "Assign Cookies," "Lemonade Change." Simple choice validation.
2.  **Intervals:** "Non-overlapping Intervals," "Meeting Rooms II." Master sorting by end time.
3.  **Jump Game:** "Jump Game I & II." Greedy lookahead.
4.  **Strings & Partitioning:** "Partition Labels," "Valid Parenthesis Check." Tracking bounds.
5.  **Google-Specific:** Tackle problems frequently tagged for Google interviews last, to apply your pattern recognition.

Focus on quality of understanding over quantity. For each problem, be able to state the greedy criterion and justify it. In your interview, you'll need to do the same.

[Practice Greedy at Google](/company/google/greedy)
