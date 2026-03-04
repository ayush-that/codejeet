---
title: "Greedy Questions at IBM: What to Expect"
description: "Prepare for Greedy interview questions at IBM — patterns, difficulty breakdown, and study tips."
date: "2027-11-30"
category: "dsa-patterns"
tags: ["ibm", "greedy", "interview prep"]
---

Greedy algorithms are a significant part of IBM's technical interview repertoire, with 27 dedicated questions out of their 170 total problems. This focus reflects the company's work on large-scale systems, resource optimization, and scheduling problems—areas where greedy approaches often provide efficient, practical solutions. Mastering these questions demonstrates your ability to think about immediate, optimal choices that lead to a globally sound outcome, a valuable skill for roles in cloud infrastructure, supply chain analytics, and software development at IBM.

## What to Expect — types of problems

IBM's greedy questions typically fall into a few predictable categories. You can expect **interval scheduling** problems, such as meeting room allocation or job scheduling to maximize the number of non-conflicting tasks. **Coin change** or **minimum cost** problems are common, testing your ability to make optimal selections from a set. Another frequent type is the **array transformation** problem, where you must perform a series of greedy swaps or selections to achieve a target configuration. Finally, **string manipulation** problems, like making a string palindrome with minimal changes or checking if one string can be transformed into another, often have greedy solutions. The key is to recognize that a problem is likely greedy when it asks for a maximum, minimum, or "is it possible" answer and involves making a series of locally optimal decisions.

## How to Prepare — study tips with one code example

Start by solidifying the core concept: a greedy algorithm builds a solution piece by piece, always choosing the next piece that offers the most immediate benefit. To prepare, first practice identifying the greedy choice property and optimal substructure in problems. Then, move to implementation. A fundamental pattern is **sorting first**. Many greedy solutions require you to sort the input data (by end time, value, cost, etc.) to make the correct sequential choices.

Consider the classic "Activity Selection" problem: given start and end times for activities, select the maximum number of non-overlapping activities. The greedy choice is to always pick the activity that finishes earliest, leaving the most room for future activities.

<div class="code-group">

```python
def max_activities(activities):
    # activities is a list of (start, end) tuples
    activities.sort(key=lambda x: x[1])  # Sort by end time
    count = 0
    last_end = -float('inf')

    for start, end in activities:
        if start >= last_end:
            count += 1
            last_end = end
    return count
```

```javascript
function maxActivities(activities) {
  // activities is an array of [start, end] arrays
  activities.sort((a, b) => a[1] - b[1]); // Sort by end time
  let count = 0;
  let lastEnd = -Infinity;

  for (const [start, end] of activities) {
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

public int maxActivities(int[][] activities) {
    // activities is a 2D array [[start, end], ...]
    Arrays.sort(activities, Comparator.comparingInt(a -> a[1]));
    int count = 0;
    int lastEnd = Integer.MIN_VALUE;

    for (int[] activity : activities) {
        if (activity[0] >= lastEnd) {
            count++;
            lastEnd = activity[1];
        }
    }
    return count;
}
```

</div>

## Recommended Practice Order

Tackle problems in increasing difficulty. Begin with foundational problems like Activity Selection and Coin Change (canonical version). Next, move to interval merging and partitioning problems. Then, practice string-based greedy checks. Finally, attempt more complex optimization problems that may require a combination of sorting and a custom comparator or a more nuanced greedy rule. Always analyze why the greedy approach works for each problem—this understanding is more important than memorizing code.

[Practice Greedy at IBM](/company/ibm/greedy)
