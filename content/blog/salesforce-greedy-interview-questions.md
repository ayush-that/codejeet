---
title: "Greedy Questions at Salesforce: What to Expect"
description: "Prepare for Greedy interview questions at Salesforce — patterns, difficulty breakdown, and study tips."
date: "2027-09-23"
category: "dsa-patterns"
tags: ["salesforce", "greedy", "interview prep"]
---

If you're preparing for a Salesforce interview, you've likely seen the statistic: they have 23 Greedy algorithm questions in their tagged LeetCode list. That's a significant 12% of their 189 total problems. This isn't a coincidence or a quirk of their question tagging. In my experience conducting and analyzing interviews, Greedy problems are a deliberate, high-frequency focus at Salesforce. They appear not just in final rounds, but often in initial technical screens. Why? Because Salesforce builds complex, real-time platforms for sales, service, and marketing. The core engineering challenges often boil down to optimization: scheduling the next best action for a sales rep, allocating limited server resources for a cloud instance, or determining the optimal order to process data streams. Greedy algorithms, which make the locally optimal choice at each step hoping to find a global optimum, are the conceptual backbone for these resource allocation and scheduling systems. Mastering them isn't just about passing an interview; it's about demonstrating you think like a Salesforce engineer.

## Specific Patterns Salesforce Favors

Salesforce's Greedy problems aren't about obscure mathematical proofs. They are practical, pattern-based, and often intertwined with other fundamental concepts. You can expect a strong emphasis on two core categories:

1.  **Interval Scheduling & Merging:** This is arguably the most important pattern. Questions revolve around fitting tasks (intervals) into limited resources (time, machines, people). The classic approach is to sort by the ending time and greedily select the next non-overlapping interval that ends the earliest. This pattern tests your ability to model a real-world constraint (like a meeting or a job) and find an optimal sequence.
2.  **Array Transformation with Local Decisions:** These problems present an array and ask you to transform it to meet a condition using the minimum number of operations. The "greedy" choice is usually made by looking at a local window (often just 2-3 elements at a time) and deciding the best immediate action, like in "Jump Game" or when minimizing increments/decrements.

You will rarely see a "pure" Greedy problem in isolation. Salesforce interviewers skillfully blend Greedy logic with:

- **Sorting:** Almost always the preprocessing step.
- **Two Pointers:** To traverse sorted intervals or arrays efficiently.
- **Basic Data Structures:** Using a heap (priority queue) to always access the "best" current option, which is a greedy selection mechanism.

For example, **Meeting Rooms II (LeetCode #253)** is a quintessential Salesforce-style problem. It's tagged under Greedy, but its optimal solution uses a min-heap to track meeting endings. Another favorite is **Task Scheduler (LeetCode #621)**, which uses a greedy strategy of always scheduling the most frequent task first, implemented with a max-heap or array counting.

## How to Prepare

The key is to internalize the proof-by-construction mindset. You don't need to formally prove correctness, but you must articulate _why_ taking the greedy step at each point is safe and won't lead to a dead end. Practice this explanation.

Let's look at the most common pattern: **Interval Scheduling (Maximum Number of Non-Overlapping Intervals).** The greedy rule is: _Always pick the interval that ends the earliest, and then discard all intervals that overlap with it._

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    LeetCode #435. Non-overlapping Intervals
    Goal: Find min intervals to remove to make the rest non-overlapping.
    Greedy choice: Keep the interval with the earliest end time.
    Time: O(n log n) for sort, then O(n) traversal → O(n log n)
    Space: O(1) (or O(n) if sort uses extra space)
    """
    if not intervals:
        return 0

    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    prev_end = intervals[0][1]

    # Start from the second interval
    for start, end in intervals[1:]:
        if start >= prev_end:
            # No overlap, we can keep this interval. Update the previous end.
            prev_end = end
        else:
            # Overlap! Greedy choice: we remove the current interval
            # because we already kept the one that ended earlier (prev_end).
            count += 1

    return count
```

```javascript
function eraseOverlapIntervals(intervals) {
  // Time: O(n log n) | Space: O(1) (sort in-place) or O(n) (if not)
  if (intervals.length === 0) return 0;

  // Sort by ending time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start >= prevEnd) {
      // No overlap, update the end we are comparing against
      prevEnd = end;
    } else {
      // Overlap, greedily remove the current (later-ending) interval
      count++;
    }
  }
  return count;
}
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    // Time: O(n log n) | Space: O(log n) for sorting (Java's Arrays.sort uses Timsort)
    if (intervals.length == 0) return 0;

    // Sort by ending time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int prevEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];
        if (start >= prevEnd) {
            prevEnd = end;
        } else {
            count++;
        }
    }
    return count;
}
```

</div>

The variation to master next is **"Minimum Number of Arrows to Burst Balloons" (LeetCode #452)**, which is conceptually identical: find the minimum number of points (arrows) that intersect all intervals. The code structure is nearly the same.

## How Salesforce Tests Greedy vs Other Companies

At companies like Google or Meta, a Greedy problem might be one part of a complex, multi-step problem where you need to discover the greedy property yourself, often requiring deeper insight. At Salesforce, the Greedy approach is more often the _direct_ solution to a clearly framed business-logic problem. The difficulty isn't in uncovering an obscure algorithm, but in cleanly implementing the pattern while handling edge cases and clearly communicating your reasoning.

What's unique is the **context**. The problem statement will often be wrapped in a plausible Salesforce domain scenario: "You have N customer support cases with priority and duration, and M support agents..." Your first job is to strip away the scenario and recognize the underlying pattern (e.g., it's **"Meeting Rooms II"**). This tests your ability to abstract a real product requirement into a solvable CS problem.

## Study Order

Tackle these sub-topics in this order to build a logical foundation:

1.  **Basic Interval Scheduling:** Start with "Non-overlapping Intervals" (#435) and "Minimum Number of Arrows to Burst Balloons" (#452). This teaches the core _sort-by-end_ greedy logic.
2.  **Interval Partitioning (Calendar-Style):** Move to "Meeting Rooms II" (#253). This introduces the need for a data structure (heap) to track multiple resources, building on the interval concept.
3.  **Array Transformation Greedy:** Practice "Jump Game" (#55) and "Jump Game II" (#45). These teach you to make greedy decisions about reachability based on local information.
4.  **Greedy with Sorting & Two Pointers:** Solve "Merge Intervals" (#56) and "Insert Interval" (#57). While often categorized under "Sorting," the merge step is a greedy "take action if overlapping" decision.
5.  **Task Scheduling & Priority:** Finally, tackle "Task Scheduler" (#621) and "Reorganize String" (#767). These combine frequency counting, greedy selection of the most frequent item, and heap management—a powerful composite pattern.

This order works because it starts with the purest form of the greedy proof (intervals), adds complexity (multiple resources), then applies the greedy mindset to different data structures (arrays, heaps).

## Recommended Practice Order

Solve these specific Salesforce-tagged problems in sequence:

1.  **Non-overlapping Intervals (#435)** - The fundamental pattern.
2.  **Minimum Number of Arrows to Burst Balloons (#452)** - Reinforces the pattern with a twist.
3.  **Merge Intervals (#56)** - Greedy merging after sorting.
4.  **Meeting Rooms II (#253)** - Level up: intervals + heap.
5.  **Jump Game (#55)** - Simple array traversal greedy check.
6.  **Jump Game II (#45)** - More advanced, minimum steps.
7.  **Task Scheduler (#621)** - The classic advanced greedy/heap problem.

Once comfortable, practice the pattern of making a local choice based on sorted data with this variation:

<div class="code-group">

```python
def findMinArrowShots(points):
    """
    LeetCode #452. Minimum Number of Arrows to Burst Balloons.
    Greedy choice: Shoot an arrow at the earliest ending point of the current balloon cluster.
    Time: O(n log n) | Space: O(1)
    """
    if not points:
        return 0

    points.sort(key=lambda x: x[1])  # Sort by end coordinate
    arrows = 1
    current_end = points[0][1]

    for start, end in points[1:]:
        # If the balloon starts after the current arrow position, we need a new arrow
        if start > current_end:
            arrows += 1
            current_end = end  # New arrow is placed at this balloon's end
        # else: start <= current_end, the current arrow already bursts it

    return arrows
```

```javascript
function findMinArrowShots(points) {
  // Time: O(n log n) | Space: O(1)
  if (points.length === 0) return 0;

  points.sort((a, b) => a[1] - b[1]);
  let arrows = 1;
  let currentEnd = points[0][1];

  for (let i = 1; i < points.length; i++) {
    const [start, end] = points[i];
    if (start > currentEnd) {
      arrows++;
      currentEnd = end;
    }
    // Overlapping interval, can be burst by the same arrow, do nothing.
  }
  return arrows;
}
```

```java
public int findMinArrowShots(int[][] points) {
    // Time: O(n log n) | Space: O(log n)
    if (points.length == 0) return 0;

    Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));
    int arrows = 1;
    int currentEnd = points[0][1];

    for (int i = 1; i < points.length; i++) {
        int start = points[i][0];
        int end = points[i][1];
        if (start > currentEnd) {
            arrows++;
            currentEnd = end;
        }
    }
    return arrows;
}
```

</div>

Remember, at Salesforce, your goal is to demonstrate efficient, clean, and logical problem-solving for scenarios that mirror their platform's needs. Greedy algorithms are a prime vehicle for this. Master the patterns, practice articulating the "why," and you'll be well-prepared.

[Practice Greedy at Salesforce](/company/salesforce/greedy)
