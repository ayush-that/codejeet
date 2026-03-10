---
title: "Greedy Questions at Agoda: What to Expect"
description: "Prepare for Greedy interview questions at Agoda — patterns, difficulty breakdown, and study tips."
date: "2029-09-16"
category: "dsa-patterns"
tags: ["agoda", "greedy", "interview prep"]
---

## Why Greedy Matters at Agoda

With 5 out of 46 tagged questions, Greedy algorithms represent just over 10% of Agoda's technical interview repertoire. This places them as a secondary but significant topic—not as dominant as arrays or strings, but far from negligible. In practice, you're more likely to encounter a Greedy problem in an Agoda interview than at many other companies of similar scale. Why? Agoda's core business—travel bookings, pricing optimization, and resource allocation—is filled with real-world problems where local optimal choices often lead to globally optimal solutions. Think about dynamic pricing: offering the best discount now might maximize immediate revenue. Or consider hotel room allocation: assigning the earliest checkout time first can maximize room utilization. Interviewers often select Greedy problems not just to test algorithmic knowledge, but to assess your ability to recognize when a simple, efficient solution exists for what might initially look like a complex optimization problem.

## Specific Patterns Agoda Favors

Agoda's Greedy problems tend to cluster around two main themes: **interval scheduling** and **resource allocation with constraints**. You won't find many exotic graph-based Greedy problems here. Instead, expect practical, business-adjacent scenarios.

The most common pattern is the **"sort and select"** approach. You're given a collection of items (intervals, tasks, meetings) with start/end times or deadlines, and you need to maximize or minimize some count. The classic example is **Non-overlapping Intervals (LeetCode #435)**—given intervals, remove the minimum number to make the rest non-overlapping. The Greedy choice: always pick the interval with the earliest end time, as it leaves the most room for future intervals.

Another frequent pattern is **"greedy assignment with two pointers"**. Problems like **Assign Cookies (LeetCode #455)**—assign cookies to children to maximize content children—appear in variations. Here, you sort both arrays and use two pointers to match the smallest sufficient cookie to each child, maximizing the number served.

<div class="code-group">

```python
# LeetCode #435 - Non-overlapping Intervals
# Time: O(n log n) for sorting | Space: O(1) (or O(n) if sorting uses extra space)
def eraseOverlapIntervals(intervals):
    if not intervals:
        return 0

    # Sort by end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    last_end = intervals[0][1]

    for i in range(1, len(intervals)):
        start, end = intervals[i]
        if start < last_end:
            # Overlap found, we need to remove one
            count += 1
        else:
            # No overlap, update the last end time
            last_end = end

    return count
```

```javascript
// LeetCode #435 - Non-overlapping Intervals
// Time: O(n log n) | Space: O(1)
function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;

  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start < lastEnd) {
      count++;
    } else {
      lastEnd = end;
    }
  }

  return count;
}
```

```java
// LeetCode #435 - Non-overlapping Intervals
// Time: O(n log n) | Space: O(1)
public int eraseOverlapIntervals(int[][] intervals) {
    if (intervals.length == 0) return 0;

    // Sort by end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];

        if (start < lastEnd) {
            count++;
        } else {
            lastEnd = end;
        }
    }

    return count;
}
```

</div>

## How to Prepare

Mastering Greedy at Agoda requires a shift in mindset. Unlike Dynamic Programming where you prove correctness through optimal substructure, Greedy problems demand you **justify your local choice**. Your preparation should focus on three steps:

1. **Pattern Recognition**: When you see "minimum/maximum number of intervals/meetings/tasks," think Greedy sorting.
2. **Sorting Strategy**: Determine what to sort by—end time, start time, duration, or a custom metric.
3. **Proof Sketch**: Be ready to explain why your greedy choice leads to a global optimum. For interval problems, the intuitive proof is: "Choosing the interval that ends earliest leaves the maximum remaining time for future intervals."

Practice identifying the sorting key. For **Minimum Number of Arrows to Burst Balloons (LeetCode #452)**, you sort by end coordinate, then shoot an arrow at the end of the first balloon, and remove all balloons it bursts. The pattern is nearly identical to non-overlapping intervals.

<div class="code-group">

```python
# LeetCode #455 - Assign Cookies
# Time: O(n log n + m log m) for sorting both arrays | Space: O(1)
def findContentChildren(g, s):
    g.sort()
    s.sort()

    child_i = 0
    cookie_i = 0

    while child_i < len(g) and cookie_i < len(s):
        if s[cookie_i] >= g[child_i]:
            # This cookie can satisfy the child
            child_i += 1
        cookie_i += 1

    return child_i
```

```javascript
// LeetCode #455 - Assign Cookies
// Time: O(n log n + m log m) | Space: O(1)
function findContentChildren(g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let childIdx = 0;
  let cookieIdx = 0;

  while (childIdx < g.length && cookieIdx < s.length) {
    if (s[cookieIdx] >= g[childIdx]) {
      childIdx++;
    }
    cookieIdx++;
  }

  return childIdx;
}
```

```java
// LeetCode #455 - Assign Cookies
// Time: O(n log n + m log m) | Space: O(1)
public int findContentChildren(int[] g, int[] s) {
    Arrays.sort(g);
    Arrays.sort(s);

    int childIdx = 0;
    int cookieIdx = 0;

    while (childIdx < g.length && cookieIdx < s.length) {
        if (s[cookieIdx] >= g[childIdx]) {
            childIdx++;
        }
        cookieIdx++;
    }

    return childIdx;
}
```

</div>

## How Agoda Tests Greedy vs Other Companies

At major tech companies like Google or Meta, Greedy problems often appear as the "easy part" of a more complex question—perhaps as a preprocessing step or within a system design component. At Agoda, Greedy questions tend to be **self-contained and directly applicable to business logic**. The difficulty is usually medium, but the twist is in the problem framing. You might get a scenario about booking timeslots, allocating hotel rooms, or optimizing coupon distribution. The underlying algorithm is standard, but you need to map the real-world description to the known pattern.

What's unique is the **emphasis on edge cases**. Since these problems mirror real systems, interviewers will test scenarios like empty inputs, single elements, full overlaps, and ties in sorting keys. Your code must handle these gracefully. Also, be prepared to discuss trade-offs: "What if we wanted to maximize total duration instead of count? Would Greedy still work?" This tests your understanding of the algorithm's limitations.

## Study Order

1. **Basic Interval Scheduling**: Start with the classic "maximum number of non-overlapping intervals" pattern. This teaches the fundamental sort-by-end-time approach.
2. **Variants with Different Objectives**: Practice problems where you sort by start time or duration (like **Merge Intervals, LeetCode #56**). This builds flexibility in choosing sorting keys.
3. **Resource Allocation Problems**: Move to problems like Assign Cookies or **Task Scheduler (LeetCode #621)**. These introduce the two-pointer technique and priority queues within Greedy solutions.
4. **Greedy on Strings**: Problems like **Valid Parenthesis String (LeetCode #678)** or **Partition Labels (LeetCode #763)** show how Greedy applies to sequence validation and partitioning.
5. **Advanced Proofs**: Finally, tackle problems where the Greedy choice is non-obvious, like **Gas Station (LeetCode #134)**, to practice rigorous justification.

This order works because it builds from the most common pattern (interval scheduling) to more abstract applications, ensuring you internalize the core mechanic before handling variations.

## Recommended Practice Order

1. **LeetCode #435 - Non-overlapping Intervals**: The foundational problem.
2. **LeetCode #452 - Minimum Number of Arrows to Burst Balloons**: Same pattern, slight twist.
3. **LeetCode #455 - Assign Cookies**: Introduces two-pointer resource allocation.
4. **LeetCode #56 - Merge Intervals**: Teaches sorting by start time and merging.
5. **LeetCode #763 - Partition Labels**: Applies Greedy to string partitioning.
6. **LeetCode #134 - Gas Station**: A harder problem to test deep understanding.

Solve these in sequence, and you'll cover 80% of what Agoda might ask. Focus on writing clean, edge-case-handling code and articulating your reasoning clearly.

[Practice Greedy at Agoda](/company/agoda/greedy)
