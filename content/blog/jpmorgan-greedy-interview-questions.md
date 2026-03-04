---
title: "Greedy Questions at JPMorgan: What to Expect"
description: "Prepare for Greedy interview questions at JPMorgan — patterns, difficulty breakdown, and study tips."
date: "2028-09-29"
category: "dsa-patterns"
tags: ["jpmorgan", "greedy", "interview prep"]
---

Greedy algorithms are a practical, optimization-focused approach that aligns well with JPMorgan's work in financial systems, where you often need to make the best immediate decision—like scheduling trades, allocating resources, or minimizing costs—without the computational expense of exploring all possibilities. With 11 out of their 78 total coding questions tagged as Greedy, it's a pattern you cannot afford to overlook. Mastering these questions demonstrates you can think efficiently about real-time constraints and optimal local choices, a valuable skill in high-frequency or resource-sensitive environments.

## What to Expect — Types of Problems

JPMorgan's Greedy questions typically fall into a few predictable categories. You'll frequently encounter **interval scheduling** problems, such as meeting room allocation or non-overlapping intervals, which test your ability to maximize usage within constraints. **Coin change** or **minimum cost** problems are common, focusing on making optimal selections with given denominations or values. **String manipulation** tasks, like checking if one string can be transformed into another with swaps, also appear, requiring you to apply local swaps to achieve a global goal. The key is that each problem presents a scenario where a series of locally optimal choices leads to a globally optimal solution, often involving sorting as a preliminary step to enable the greedy strategy.

## How to Prepare — Study Tips with One Code Example

Start by solidifying your understanding of when a greedy approach is applicable: problems with optimal substructure and the greedy choice property. Practice identifying the "greedy criterion"—what you sort by or choose at each step. A fundamental pattern is sorting an array (by end time, start time, value, etc.) and then iterating to make selections.

For example, consider the classic "Maximum Number of Non-Overlapping Intervals" problem. The greedy criterion is to always pick the interval that ends the earliest, as this leaves the most room for future intervals. Here’s how to implement it:

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    if not intervals:
        return 0
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    count = 0
    last_end = intervals[0][1]

    for start, end in intervals[1:]:
        if start >= last_end:
            # Non-overlapping, update last_end
            last_end = end
        else:
            # Overlapping, increment removal count
            count += 1
    return count
```

```javascript
function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;
  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start >= lastEnd) {
      lastEnd = end;
    } else {
      count++;
    }
  }
  return count;
}
```

```java
import java.util.Arrays;

public int eraseOverlapIntervals(int[][] intervals) {
    if (intervals.length == 0) return 0;
    // Sort by end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
    int count = 0;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];
        if (start >= lastEnd) {
            lastEnd = end;
        } else {
            count++;
        }
    }
    return count;
}
```

</div>

## Recommended Practice Order

Build your skills progressively. First, tackle foundational problems like "Coin Change" (greedy version with canonical systems) and "Maximum Subarray" to understand simple selection. Move to interval-based problems ("Non-overlapping Intervals", "Merge Intervals") as they are highly frequent. Then, practice assignment problems like "Task Scheduler" or "Gas Station". Finally, attempt more complex greedy problems that may combine with other concepts, such as "Jump Game" or "Candy". Always validate that a greedy approach works for the problem—sometimes dynamic programming is required, but JPMorgan's tagged questions are designed for greedy solutions.

[Practice Greedy at JPMorgan](/company/jpmorgan/greedy)
