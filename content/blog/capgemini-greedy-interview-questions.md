---
title: "Greedy Questions at Capgemini: What to Expect"
description: "Prepare for Greedy interview questions at Capgemini — patterns, difficulty breakdown, and study tips."
date: "2030-05-04"
category: "dsa-patterns"
tags: ["capgemini", "greedy", "interview prep"]
---

Greedy algorithms are a small but critical part of Capgemini's technical assessment. With 3 out of 36 questions typically dedicated to this topic, they represent a focused area where you can secure decisive points. While the count may seem low, these questions are often designed to test your problem-solving intuition and ability to implement efficient, straightforward solutions under time pressure. Mastering them demonstrates you can identify problems where a locally optimal choice leads to a globally optimal solution—a valuable skill for real-world optimization tasks in consulting and delivery projects.

## What to Expect — Types of Problems

Capgemini's greedy questions tend to be classic and application-oriented. You won't encounter obscure theoretical puzzles; instead, expect problems with clear, real-world analogs. The most common types are:

1.  **Activity Selection / Scheduling:** Problems about selecting the maximum number of non-overlapping intervals or tasks. This directly tests the canonical greedy interval scheduling algorithm.
2.  **Coin Change / Minimum Sum Problems:** Finding the minimum number of items (like coins or notes) to reach a target, given a standard denomination system (e.g., [1, 2, 5, 10]). This tests the assumption that a greedy approach works for canonical coin systems.
3.  **Simple Assignment or Partitioning:** Such as assigning tasks to workers to minimize maximum load or splitting a sequence into segments with certain properties.

The constraints are usually moderate, allowing for a correct O(n log n) greedy solution to pass easily. The key challenge is recognizing the greedy property and sorting the input correctly.

## How to Prepare — Study Tips with One Code Example

Your preparation should focus on pattern recognition, not memorization. Follow these steps:

1.  **Learn the Core Property:** A greedy algorithm works if a problem has both the _greedy choice property_ (a local optimal choice leads to a global optimum) and _optimal substructure_ (the optimal solution contains optimal solutions to subproblems).
2.  **Master the Classic Problems:** Deeply understand and code the standard greedy problems: Activity Selection, Fractional Knapsack, Minimum Coin Change (for standard denominations), and Huffman Coding.
3.  **Practice the Thought Process:** For each new problem, ask: "If I sort the data by a specific key (end time, value/weight ratio, start time), will taking the 'best' available item at each step lead to the correct answer?"

A quintessential example is the **Activity Selection Problem**. The goal is to select the maximum number of non-overlapping activities. The proven greedy strategy is to always pick the next activity that finishes earliest.

<div class="code-group">

```python
def max_activities(activities):
    # activities: list of [start, end] pairs
    activities.sort(key=lambda x: x[1])  # Sort by end time
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
  // activities: array of [start, end] pairs
  activities.sort((a, b) => a[1] - b[1]); // Sort by end time
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
        // activities: array of {start, end} pairs
        Arrays.sort(activities, Comparator.comparingInt(a -> a[1]));
        int count = 1;
        int lastEnd = activities[0][1];

        for (int i = 1; i < activities.length; i++) {
            int start = activities[i][0];
            int end = activities[i][1];
            if (start >= lastEnd) {
                count++;
                lastEnd = end;
            }
        }
        return count;
    }
}
```

</div>

## Recommended Practice Order

Build your competency sequentially:

1.  **Foundations:** Start with "Fractional Knapsack" and "Activity Selection." These teach the core sorting and iteration pattern.
2.  **Classic Optimization:** Move to "Minimum Coin Change" (with standard denominations) and "Huffman Coding" to understand greedy tree building.
3.  **Interval Problems:** Practice variants like "Meeting Rooms II" which uses a min-heap alongside greedy selection.
4.  **Capgemini-Specific Practice:** Finally, solve problems tagged for Capgemini on platforms like CodeJeet to familiarize yourself with their exact format and difficulty.

Focus on writing clean, correct code for these patterns. In the interview, clearly explain your reasoning: why sorting by a particular attribute is optimal.

[Practice Greedy at Capgemini](/company/capgemini/greedy)
