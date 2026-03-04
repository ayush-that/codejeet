---
title: "Greedy Questions at American Express: What to Expect"
description: "Prepare for Greedy interview questions at American Express — patterns, difficulty breakdown, and study tips."
date: "2031-04-01"
category: "dsa-patterns"
tags: ["american-express", "greedy", "interview prep"]
---

Greedy algorithms are a small but critical part of the American Express technical interview. With 3 out of their 24 total coding questions tagged as Greedy, you have a roughly 1 in 8 chance of encountering one. While not the most frequent category, these questions are often used to assess a candidate's ability to identify optimal local choices and prove a simple, efficient solution works. Mastering them can be the difference between a good and a great performance.

## What to Expect — Types of Problems

American Express tends to favor practical, optimization-focused greedy problems. You are unlikely to see highly abstract or mathematical puzzles. Instead, expect problems that model real-world resource allocation or scheduling. Common patterns include:

- **Interval Problems:** Merging intervals, scheduling the maximum number of non-overlapping events, or meeting room assignments.
- **Assignment Problems:** Tasks like finding the minimum number of resources (arrows, bursts, employees) needed to cover a set of points or intervals.
- **Array Optimization:** Problems where you make a series of local decisions to achieve a global optimum, such as jump game variants or maximizing profit from simple transactions.

The key is recognizing the greedy property: that making the best possible choice at each step leads to the globally optimal solution.

## How to Prepare — Study Tips with One Code Example

Your preparation should focus on pattern recognition, not memorization. Start by understanding the proof or intuition behind classic greedy solutions. Why does sorting intervals by their end time maximize the number you can select? Practice verbalizing this reasoning.

When solving a problem, ask yourself: "If I make this locally optimal choice, could it possibly force a worse outcome later?" If the answer is consistently "no," a greedy approach is likely valid.

A fundamental pattern is the **"Minimum Number of Arrows to Burst Balloons"** or **"Merge Intervals"** problem. The core algorithm is to sort intervals and then iterate, greedily extending or creating new groups based on overlap.

<div class="code-group">

```python
def findMinArrowShots(points):
    if not points:
        return 0
    # Sort intervals by their end point
    points.sort(key=lambda x: x[1])
    arrows = 1
    current_end = points[0][1]

    for start, end in points[1:]:
        # If the balloon starts after the last end point, we need a new arrow
        if start > current_end:
            arrows += 1
            current_end = end
    return arrows
```

```javascript
function findMinArrowShots(points) {
  if (points.length === 0) return 0;
  // Sort intervals by their end point
  points.sort((a, b) => a[1] - b[1]);
  let arrows = 1;
  let currentEnd = points[0][1];

  for (let i = 1; i < points.length; i++) {
    const [start, end] = points[i];
    // If the balloon starts after the last end point, we need a new arrow
    if (start > currentEnd) {
      arrows++;
      currentEnd = end;
    }
  }
  return arrows;
}
```

```java
public int findMinArrowShots(int[][] points) {
    if (points.length == 0) return 0;
    // Sort intervals by their end point (using comparator to avoid overflow)
    Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));
    int arrows = 1;
    int currentEnd = points[0][1];

    for (int i = 1; i < points.length; i++) {
        int start = points[i][0];
        int end = points[i][1];
        // If the balloon starts after the last end point, we need a new arrow
        if (start > currentEnd) {
            arrows++;
            currentEnd = end;
        }
    }
    return arrows;
}
```

</div>

## Recommended Practice Order

Build your competency systematically:

1.  **Foundations:** Start with classic problems like "Maximum Subarray" (Kadane's Algorithm) and "Assign Cookies." These establish the basic "take the local optimum" mindset.
2.  **Intervals:** Move to interval scheduling ("Non-overlapping Intervals," "Meeting Rooms II") and merging problems. This is a high-probability area for Amex.
3.  **Advanced Greedy:** Tackle problems like "Task Scheduler" or "Gas Station," which combine greedy reasoning with more complex state tracking.
4.  **Company-Specific:** Finally, focus your practice on problems tagged for American Express to understand their specific difficulty and problem flavor.

[Practice Greedy at American Express](/company/american-express/greedy)
