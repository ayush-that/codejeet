---
title: "Greedy Questions at Atlassian: What to Expect"
description: "Prepare for Greedy interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-28"
category: "dsa-patterns"
tags: ["atlassian", "greedy", "interview prep"]
---

Greedy algorithms are a small but critical part of Atlassian's technical interview repertoire, representing about 11% of their tagged problems. While not the most frequent, they test a candidate's ability to make a series of locally optimal choices to arrive at a globally optimal solution—a skill directly applicable to optimizing resource allocation, scheduling, and feature rollout decisions in large-scale systems like Jira or Confluence. Mastering these questions demonstrates you can think pragmatically about efficiency and trade-offs, a valued trait for engineers building and maintaining their platforms.

## What to Expect — Types of Problems

Atlassian's greedy questions typically fall into predictable categories that align with real-world engineering scenarios. You can expect problems centered on **interval scheduling** (e.g., meeting room allocation, task scheduling), **array manipulation and sorting** (e.g., maximizing profit, minimizing wait time), and **string manipulation** (e.g., reorganizing strings, minimal edits). The problems are often framed in a business context, such as optimizing server loads, arranging data migrations, or managing continuous deployment pipelines. The key is to recognize the greedy property: that a greedy choice at each step leads to an optimal solution, often requiring the data to be sorted in a specific way first.

## How to Prepare — Study Tips with One Code Example

Start by solidifying the core greedy patterns: activity selection, coin change (canonical systems), and minimum spanning tree concepts. For each problem, practice the two-step approach: first, prove or convince yourself that a greedy choice is safe (usually by exchange argument), then implement the sorting and iteration. Always validate with edge cases—empty inputs, single elements, and already-sorted data.

A fundamental pattern is the "minimum number of meetings/activities" problem, often asked as scheduling the maximum number of non-overlapping intervals. The greedy choice is to always pick the activity that ends the earliest.

<div class="code-group">

```python
def max_meetings(intervals):
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    count = 0
    last_end = -float('inf')

    for start, end in intervals:
        if start >= last_end:
            count += 1
            last_end = end
    return count
```

```javascript
function maxMeetings(intervals) {
  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let lastEnd = -Infinity;

  for (const [start, end] of intervals) {
    if (start >= lastEnd) {
      count++;
      lastEnd = end;
    }
  }
  return count;
}
```

```java
import java.util.Arrays;
import java.util.Comparator;

public int maxMeetings(int[][] intervals) {
    // Sort by end time
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[1]));
    int count = 0;
    int lastEnd = Integer.MIN_VALUE;

    for (int[] interval : intervals) {
        if (interval[0] >= lastEnd) {
            count++;
            lastEnd = interval[1];
        }
    }
    return count;
}
```

</div>

## Recommended Practice Order

Tackle problems in this sequence to build competency: begin with classic leetcode easy problems like "Assign Cookies" or "Lemonade Change" to internalize the greedy decision process. Move to medium-difficulty interval problems (like the example above) and "Jump Game" variants. Finally, attempt Atlassian’s specific tagged questions, which often combine greedy logic with light data structure use. Timebox your practice: spend no more than 10-15 minutes identifying the greedy strategy before checking the solution if stuck. The goal is pattern recognition, not brute-force derivation.

[Practice Greedy at Atlassian](/company/atlassian/greedy)
