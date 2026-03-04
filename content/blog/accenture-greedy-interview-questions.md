---
title: "Greedy Questions at Accenture: What to Expect"
description: "Prepare for Greedy interview questions at Accenture — patterns, difficulty breakdown, and study tips."
date: "2028-01-27"
category: "dsa-patterns"
tags: ["accenture", "greedy", "interview prep"]
---

Greedy algorithms are a small but critical part of Accenture's technical assessment, representing about 7% of their question bank. While the count is low, their presence is significant. Accenture's projects often involve optimization, resource allocation, and process streamlining—scenarios where a greedy approach of making the locally optimal choice at each step can yield an efficient, effective solution. Mastering these questions demonstrates you can think pragmatically about cost, time, and scalability, which is directly applicable to the client delivery work Accenture consultants perform.

## What to Expect — Types of Problems

Accenture's greedy questions typically fall into predictable categories focused on real-world optimization. You will not encounter overly abstract or mathematical puzzles. Expect problems you can reason about logically.

- **Interval Scheduling:** The classic "maximum number of non-overlapping intervals" problem. This models scheduling meetings or jobs without conflicts.
- **Coin Change (Canonical Systems):** Determining the minimum number of coins needed for an amount, given standard denominations (e.g., U.S. coins). This tests understanding of when greedy works versus when it fails.
- **Fractional Knapsack:** Maximizing the total value of items placed in a bag with a weight capacity, where you can take fractions of items. This is a direct model for resource allocation.
- **Simple Assignment Problems:** Tasks like "minimum number of platforms required for a railway station" based on arrival/departure times, which is essentially finding the maximum overlap at any point.

The key is recognizing the problem type and the **greedy property**: that a local optimal choice leads to a global optimum. You must also be prepared to explain _why_ a greedy approach is suitable.

## How to Prepare — Study Tips with One Code Example

Focus on understanding the core patterns, not memorizing solutions. For each problem type, learn:

1.  The sorting criteria (what makes a choice "greedy"?).
2.  The step-by-step process.
3.  The proof or logical reasoning for why it works.

A fundamental pattern is **sorting first**. Many greedy solutions become obvious once the data is ordered correctly—by end time, by value-to-weight ratio, by start time, etc.

Consider the **Activity Selection (Interval Scheduling)** problem: find the maximum number of non-overlapping activities. The greedy choice is to always pick the activity that finishes earliest, as it leaves the most room for later activities.

<div class="code-group">

```python
def max_activities(activities):
    # activities is a list of [start, end] pairs
    # Sort activities by their finish time
    activities.sort(key=lambda x: x[1])

    count = 1
    last_end = activities[0][1]

    for start, end in activities[1:]:
        if start >= last_end:
            count += 1
            last_end = end
    return count
```

```javascript
function maxActivities(activities) {
  // activities is an array of [start, end] pairs
  // Sort by finish time
  activities.sort((a, b) => a[1] - b[1]);

  let count = 1;
  let lastEnd = activities[0][1];

  for (let i = 1; i < activities.length; i++) {
    const [start, end] = activities[i];
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

public class ActivitySelection {
    public static int maxActivities(int[][] activities) {
        // Sort activities by end time
        Arrays.sort(activities, Comparator.comparingInt(a -> a[1]));

        int count = 1;
        int lastEnd = activities[0][1];

        for (int i = 1; i < activities.length; i++) {
            if (activities[i][0] >= lastEnd) {
                count++;
                lastEnd = activities[i][1];
            }
        }
        return count;
    }
}
```

</div>

## Recommended Practice Order

Build your competency sequentially:

1.  **Coin Change (Greedy Version)** – Understand the basic mechanic.
2.  **Fractional Knapsack** – Learn the value/weight ratio sort.
3.  **Activity Selection / Interval Scheduling** – Master the most common pattern.
4.  **Minimum Platforms / Meeting Rooms II** – Practice the "chronological ordering" technique.
5.  **More complex problems** like "Job Sequencing with Deadlines".

Always code the solution by hand after designing it. Accenture's platform may require you to write syntactically correct code without an IDE.

[Practice Greedy at Accenture](/company/accenture/greedy)
