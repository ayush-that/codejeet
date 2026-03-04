---
title: "Greedy Questions at Agoda: What to Expect"
description: "Prepare for Greedy interview questions at Agoda — patterns, difficulty breakdown, and study tips."
date: "2029-09-24"
category: "dsa-patterns"
tags: ["agoda", "greedy", "interview prep"]
---

Greedy algorithms are a practical subset of problem-solving that Agoda's interviewers use to assess a candidate's ability to make optimal local choices. With 5 out of their 46 total coding questions tagged as Greedy, it's a pattern you cannot ignore. These questions test not just if you can implement a solution, but if you can recognize the scenario where a simple, step-by-step optimal choice leads to a globally optimal result. For a company optimizing travel bookings, pricing, and resource allocation, this mindset is directly applicable to real-world engineering decisions.

## What to Expect — Types of Problems

Agoda's Greedy questions typically fall into a few predictable categories. You are most likely to encounter **interval-based problems**, such as meeting room scheduling or merging intervals, which are common in system design for handling bookings or events. **Assignment problems** are also frequent, like task scheduling or assigning resources with the goal of maximizing throughput or minimizing cost. A third category involves **array manipulation for optimal outcome**, such as deciding jump games, partitioning labels, or maximizing profit from a single transaction. The key is that the problem will have a property—often "greedy choice" or "optimal substructure"—where what's best right now remains best in the final solution.

## How to Prepare — Study Tips with Code Example

To prepare, first solidify your understanding of when a greedy approach is valid. A rule of thumb: if you can solve the problem by repeatedly taking the "best" available item without needing to reconsider later, it's likely greedy. Practice by sorting data as a first step—many greedy solutions begin with sorting an array of intervals, tasks, or costs. Then, walk through the sorted data with a single pass, making decisions and tracking a key variable (like a count, end time, or total).

A classic pattern is the "Merge Intervals" problem. The greedy strategy is to sort intervals by their start time, then iterate through them, merging any that overlap.

<div class="code-group">

```python
def merge(intervals):
    if not intervals:
        return []
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current in intervals[1:]:
        last = merged[-1]
        # If intervals overlap, merge by updating the end time
        if current[0] <= last[1]:
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)
    return merged
```

```javascript
function merge(intervals) {
  if (intervals.length === 0) return [];
  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    // If intervals overlap, merge
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
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
        // If intervals overlap, merge
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

Start with foundational problems to build intuition. First, practice **"Maximum Subarray"** (Kadane's Algorithm) to understand making optimal local decisions for a global sum. Next, tackle **"Merge Intervals"** as shown above, a pattern directly applicable to booking systems. Then, move to **"Task Scheduler"** to handle assignment and scheduling logic. Follow this with **"Jump Game"** to practice greedy array traversal. Finally, attempt more complex problems like **"Gas Station"** which combines greedy reasoning with a circular array. This progression builds from basic choice-making to integrated problem-solving.

[Practice Greedy at Agoda](/company/agoda/greedy)
