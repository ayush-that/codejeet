---
title: "Greedy Questions at DE Shaw: What to Expect"
description: "Prepare for Greedy interview questions at DE Shaw — patterns, difficulty breakdown, and study tips."
date: "2028-03-21"
category: "dsa-patterns"
tags: ["de-shaw", "greedy", "interview prep"]
---

Greedy algorithms are a core part of DE Shaw's technical interview process, representing nearly 20% of their tagged problems. This focus is strategic. Greedy problems test a candidate's ability to identify optimal substructure and make a series of locally optimal choices that lead to a globally optimal solution. For a quantitative research and trading firm like DE Shaw, this mirrors real-world decision-making under constraints—whether optimizing portfolio allocations, scheduling compute jobs, or managing real-time data streams. Successfully solving these questions demonstrates strong analytical reasoning and the ability to design efficient, often O(n log n) or O(n), solutions, which are critical in high-performance environments.

## What to Expect — Types of Problems

DE Shaw's greedy questions tend to fall into a few predictable categories. Expect to encounter classic **interval scheduling** problems, such as meeting rooms or non-overlapping intervals, where you must maximize the number of activities. **Array-based greedy** problems are also frequent, requiring transformations or partitions, like minimum moves to equal array elements or dividing a sequence. You will likely see **assignment or matching problems**, often involving sorting and pairing. The problems are rarely presented in their raw, textbook form; they are often disguised within a business or data context, requiring you to first model the scenario and then identify the greedy property. The key is to recognize that if a problem asks for a maximum or minimum result and has a "take the best apparent option now" structure, a greedy approach is likely.

## How to Prepare — Study Tips with One Code Example

Start by solidifying your understanding of core greedy patterns: sorting followed by iteration, using priority queues (heaps) for selection, and building solutions incrementally. Prove to yourself why the greedy choice is safe for each problem type. During practice, always attempt to formally argue the correctness before coding.

A fundamental pattern is the **"minimum number of arrows to burst balloons"** or interval intersection problem. The greedy strategy is to sort intervals by their end point and then traverse, shooting an arrow at the end of the first interval. Any subsequent interval that starts before or at this arrow's position is also burst. If an interval starts after, you need a new arrow.

<div class="code-group">

```python
def findMinArrowShots(points):
    if not points:
        return 0
    # Sort by the end coordinate
    points.sort(key=lambda x: x[1])
    arrows = 1
    current_end = points[0][1]

    for start, end in points[1:]:
        # If the balloon starts after the current arrow position, need a new arrow
        if start > current_end:
            arrows += 1
            current_end = end
    return arrows
```

```javascript
function findMinArrowShots(points) {
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
  }
  return arrows;
}
```

```java
import java.util.Arrays;

public class Solution {
    public int findMinArrowShots(int[][] points) {
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
}
```

</div>

## Recommended Practice Order

Build competence progressively. First, master foundational LeetCode Easy problems like "Assign Cookies" and "Lemonade Change." Next, tackle the core Medium problems that form the bulk of DE Shaw's question bank: "Non-overlapping Intervals," "Merge Intervals," "Task Scheduler," and "Minimum Number of Arrows to Burst Balloons." Finally, challenge yourself with a few harder problems like "Candy" or "IPO" to ensure you can handle variations. Always time yourself and practice verbalizing your reasoning as you solve.

[Practice Greedy at DE Shaw](/company/de-shaw/greedy)
