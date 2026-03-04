---
title: "Sorting Questions at Swiggy: What to Expect"
description: "Prepare for Sorting interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-02-07"
category: "dsa-patterns"
tags: ["swiggy", "sorting", "interview prep"]
---

Sorting questions appear in nearly one-fourth of Swiggy's technical interviews. For a company managing millions of food delivery orders, logistics, and real-time tracking, efficient data organization is not an academic exercise—it's a daily operational necessity. The ability to sort data efficiently directly impacts core systems: prioritizing orders by time or location, optimizing delivery routes, ranking restaurant search results, and managing rider dispatch. Your grasp of sorting algorithms demonstrates your understanding of algorithmic efficiency (Big O), which translates to building scalable systems that can handle Swiggy's massive transaction volume.

## What to Expect — Types of Problems

You won't be asked to implement basic bubble sort from scratch. Swiggy's problems apply sorting as a tool to solve real-world scenarios. Expect these categories:

1.  **Custom Sorting & Comparators:** The most frequent type. You'll sort objects based on multiple, often complex, criteria. Example: "Sort delivery orders by priority status first, then by shortest preparation time, then by nearest delivery distance."
2.  **Interval Problems:** Merging, inserting, or finding overlaps in time slots—critical for scheduling deliveries or restaurant kitchen capacity. Example: "Given riders' available time slots, merge overlapping slots to see total available coverage."
3.  **"K-th" Element Problems:** Finding the Kth largest/smallest or top K frequent items. Example: "Find the top 3 most ordered food items in a region this week."
4.  **Sorting as a Pre-processing Step:** Using sort to transform a problem, making the subsequent logic straightforward. Example: "Find the minimum number of meeting rooms required" is often solved by sorting start and end times.

## How to Prepare — Study Tips with Code Example

Master the theory behind **Quick Sort** (average O(n log n), worst O(n²)) and **Merge Sort** (stable, always O(n log n)). Understand when to use a stable sort. Focus intensely on writing bug-free custom comparator logic. Practice by solving problems where sorting the data is the first clever insight.

A key pattern is the **"Sort by Two Keys"** comparator. You sort primarily by one attribute in a certain order (descending), and secondarily by another attribute (ascending).

<div class="code-group">

```python
# Sort tasks: highest priority first, then shortest duration first
tasks = [(3, 50), (1, 20), (3, 10), (2, 40)]

# Sort by: priority descending (-x[0]), then duration ascending (x[1])
tasks.sort(key=lambda x: (-x[0], x[1]))
# Result: [(3, 10), (3, 50), (2, 40), (1, 20)]
```

```javascript
// Sort tasks: highest priority first, then shortest duration first
let tasks = [
  [3, 50],
  [1, 20],
  [3, 10],
  [2, 40],
];

tasks.sort((a, b) => {
  if (a[0] !== b[0]) {
    return b[0] - a[0]; // Priority descending
  }
  return a[1] - b[1]; // Duration ascending
});
// Result: [[3, 10], [3, 50], [2, 40], [1, 20]]
```

```java
import java.util.*;

// Sort tasks: highest priority first, then shortest duration first
List<int[]> tasks = Arrays.asList(
    new int[]{3, 50},
    new int[]{1, 20},
    new int[]{3, 10},
    new int[]{2, 40}
);

tasks.sort((a, b) -> {
    if (a[0] != b[0]) {
        return b[0] - a[0]; // Priority descending
    }
    return a[1] - b[1]; // Duration ascending
});
// Result: [[3, 10], [3, 50], [2, 40], [1, 20]]
```

</div>

## Recommended Practice Order

Build competency in this sequence:

1.  **Fundamentals:** Implement merge sort and quick sort. Write comparators for basic objects.
2.  **Core Patterns:** Solve 5-10 problems each on custom sorting and interval merging.
3.  **Application:** Tackle "K-th element" problems (using sorting or a heap) and problems where sorting is the key step.
4.  **Swiggy Context:** Think of how each problem could map to a delivery, restaurant, or logistics system.

[Practice Sorting at Swiggy](/company/swiggy/sorting)
