---
title: "Sorting Questions at DoorDash: What to Expect"
description: "Prepare for Sorting interview questions at DoorDash — patterns, difficulty breakdown, and study tips."
date: "2028-08-20"
category: "dsa-patterns"
tags: ["doordash", "sorting", "interview prep"]
---

Sorting questions appear in about 16% of DoorDash’s technical interview problems. This frequency reflects the real-world nature of their work: efficiently matching drivers, orders, and routes requires constantly ordering and prioritizing data streams. A strong grasp of sorting algorithms and, more importantly, the patterns built upon them, is essential for optimizing the logistics and dispatch systems at DoorDash’s scale.

## What to Expect — Types of Problems

You will rarely be asked to implement a raw sorting algorithm like quicksort from scratch. Instead, DoorDash focuses on applied problems where sorting is a key enabling step. Expect these categories:

1.  **Interval Scheduling & Merging:** Core to scheduling driver shifts or batching delivery windows. Problems often involve sorting intervals by start or end time to find overlaps, merge ranges, or check for conflicts.
2.  **Top-K / K-th Element:** Prioritizing the "best" orders, drivers, or routes. This can involve finding the K closest drivers, the K most profitable orders, or the K most frequent menu items. Sorting or a heap-based approach is typical.
3.  **Custom Sorting with Comparators:** Sorting objects (e.g., orders, locations) by complex, business-specific rules. You might sort delivery points by distance from a hub, then by order value, requiring a custom comparator function.
4.  **Greedy Problems with Sorting:** Many optimization problems require sorting the input first to enable a greedy solution, such as assigning the minimum number of drivers to cover all deliveries.

## How to Prepare — Study Tips with One Code Example

Focus on the patterns, not the algorithms. Master writing clean comparator logic and recognizing when sorting transforms a problem. Practice problems that combine sorting with other techniques like two pointers or greedy algorithms.

A fundamental pattern is **sorting intervals**. The standard approach is to sort by the start time, then iterate to merge overlapping intervals or find gaps.

<div class="code-group">

```python
def merge_intervals(intervals):
    if not intervals:
        return []

    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]

        # If intervals overlap, merge them
        if current_start <= last_end:
            merged[-1] = [last_start, max(last_end, current_end)]
        else:
            merged.append([current_start, current_end])

    return merged
```

```javascript
function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const [currStart, currEnd] = intervals[i];
    const [lastStart, lastEnd] = merged[merged.length - 1];

    // If intervals overlap, merge them
    if (currStart <= lastEnd) {
      merged[merged.length - 1][1] = Math.max(lastEnd, currEnd);
    } else {
      merged.push([currStart, currEnd]);
    }
  }
  return merged;
}
```

```java
public int[][] merge(int[][] intervals) {
    if (intervals.length == 0) return new int[0][];

    // Sort by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);

    for (int i = 1; i < intervals.length; i++) {
        int[] current = intervals[i];
        int[] last = merged.get(merged.size() - 1);

        // If intervals overlap, merge them
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.add(current);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

## Recommended Practice Order

Build your competency in this logical sequence:

1.  **Fundamentals:** Master writing custom sort comparators in your language.
2.  **Core Patterns:** Practice interval merging and Top-K problems until they are automatic.
3.  **Greedy Combinations:** Solve problems where sorting enables a simple greedy pass.
4.  **DoorDash Context:** Apply these patterns to problems involving locations, schedules, and priorities to simulate the interview.

[Practice Sorting at DoorDash](/company/doordash/sorting)
