---
title: "Sorting Questions at Yelp: What to Expect"
description: "Prepare for Sorting interview questions at Yelp — patterns, difficulty breakdown, and study tips."
date: "2031-01-05"
category: "dsa-patterns"
tags: ["yelp", "sorting", "interview prep"]
---

If you're preparing for a Yelp software engineering interview, you'll quickly notice a significant pattern: **Sorting** is a major focus. With 7 out of their 27 tagged LeetCode problems being sorting-related, it's not just a topic—it's a core competency they actively test. This isn't an accident. Yelp's entire product revolves around ordering and ranking: search results by relevance and distance, businesses by rating, reviews by usefulness. The ability to efficiently sort, merge, and compare datasets is fundamental to their engineering work. In real interviews, you are very likely to encounter at least one problem where sorting is either the primary solution or a critical optimization step.

## Specific Patterns Yelp Favors

Yelp's sorting problems rarely ask you to implement a raw sorting algorithm like quicksort from scratch. Instead, they test your ability to _apply_ sorting as a tool to simplify more complex problems. The two most prevalent patterns are:

1.  **Sorting as a Preprocessing Step for Intervals:** Many Yelp problems involve merging, comparing, or finding gaps in sets of time slots, business hours, or geographical ranges. Sorting the data first by a start point transforms a messy comparison problem into a linear scan.
2.  **Custom Comparator Sorting:** This is Yelp's bread and butter. You'll frequently need to sort objects (like businesses or reviews) based on multiple, sometimes competing, criteria (e.g., sort by highest rating, but break ties by proximity, then by number of reviews). Writing a clean, correct comparator is essential.

A classic example is **Merge Intervals (LeetCode #56)**, a direct analog to merging overlapping business hours or appointment slots. Another is **Meeting Rooms II (LeetCode #253)**, which uses sorting to efficiently find the maximum number of concurrent events—useful for modeling peak load on Yelp's reservation systems.

## How to Prepare

Mastering these patterns means moving beyond `array.sort()`. You need to understand how sorting changes the problem landscape. Let's look at the cornerstone pattern: using sorting to merge intervals.

The trick is to sort all intervals by their start time. Once sorted, you can iterate through them. If the current interval starts _after_ the previous one ends, they don't overlap. If it starts _before or at_ the previous one ends, they do overlap, and you merge them by updating the ending to be the maximum of the two.

<div class="code-group">

```python
def merge(intervals):
    """
    Merges all overlapping intervals.
    :type intervals: List[List[int]]
    :rtype: List[List[int]]
    """
    # 1. Sort by the start time
    intervals.sort(key=lambda x: x[0])

    merged = []
    for interval in intervals:
        # If merged is empty or current interval does NOT overlap with the last merged interval
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            # There is an overlap, so merge by updating the end time
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged

# Time Complexity: O(n log n) due to sorting. The linear scan is O(n).
# Space Complexity: O(log n) to O(n) depending on the sorting algorithm's space, plus O(n) for the output.
```

```javascript
function merge(intervals) {
  if (intervals.length === 0) return [];

  // 1. Sort by the start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];

    // If current interval does NOT overlap with the last merged interval
    if (current[0] > last[1]) {
      merged.push(current);
    } else {
      // Merge by updating the end time
      last[1] = Math.max(last[1], current[1]);
    }
  }
  return merged;
}

// Time Complexity: O(n log n) due to sorting.
// Space Complexity: O(log n) for sort space in some JS engines, plus O(n) for output.
```

```java
import java.util.*;

public class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;

        // 1. Sort by the start time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        int[] currentInterval = intervals[0];
        merged.add(currentInterval);

        for (int[] interval : intervals) {
            int currentEnd = currentInterval[1];
            int nextStart = interval[0];
            int nextEnd = interval[1];

            // If current interval overlaps with the next one
            if (currentEnd >= nextStart) {
                // Merge by updating the end time
                currentInterval[1] = Math.max(currentEnd, nextEnd);
            } else {
                // No overlap, move to the next interval
                currentInterval = interval;
                merged.add(currentInterval);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}

// Time Complexity: O(n log n) due to sorting.
// Space Complexity: O(log n) for sort space, plus O(n) for output.
```

</div>

The second critical skill is writing custom comparators. For example, sorting strings representing version numbers like "1.2.0" and "1.10.1" requires splitting and comparing integer parts numerically, not lexicographically.

## How Yelp Tests Sorting vs Other Companies

Compared to companies like Google or Meta, Yelp's sorting questions tend to be more _applied_ and less _theoretical_. You're less likely to get a puzzle that requires inventing a novel sorting algorithm and more likely to get a business logic problem where sorting is the cleanest path to a solution.

The difficulty often lies in the problem description itself—it may be wrapped in a domain-specific scenario (e.g., "merge conflicting restaurant reservation slots"). Your first job is to recognize the underlying pattern (merge intervals, custom sort, etc.). The implementation, once the pattern is identified, is usually straightforward. This tests your ability to translate real-world Yelp problems into clean code.

## Study Order

Tackle sorting systematically. Don't jump into complex problems immediately.

1.  **Fundamental Sorting Algorithms:** Understand how QuickSort and MergeSort work at a high level (partitioning, divide-and-conquer). You won't implement them, but you must know their O(n log n) average-case guarantee and stable/unstable properties.
2.  **Basic Library Sorting:** Practice using your language's sort function with a simple key (e.g., `sort by x[0]`). Solve easy problems like **Kth Largest Element (LeetCode #215)**.
3.  **Custom Comparators:** Learn to sort objects by multiple fields. Practice ascending/descending order and tie-breaking logic. This is a huge step.
4.  **Sorting as a Tool:** Now apply sorting to more complex patterns: Merge Intervals, Meeting Rooms II, and Non-overlapping Intervals (LeetCode #435).
5.  **Advanced Applications:** Finally, tackle problems where sorting is part of a larger solution, such as in two-pointer techniques (e.g., **3Sum, LeetCode #15**) or scheduling with heaps.

## Recommended Practice Order

Build confidence with this sequence:

1.  **Merge Intervals (LeetCode #56)** - The foundational pattern.
2.  **Meeting Rooms II (LeetCode #253)** - Applies the same sorted `start` and `end` array technique.
3.  **Sort Colors (LeetCode #75)** - Tests understanding of in-place partitioning (like in QuickSort).
4.  **Largest Number (LeetCode #179)** - An excellent custom comparator challenge (sorting strings as numbers).
5.  **Non-overlapping Intervals (LeetCode #435)** - A variation on the merge theme requiring greedy choice.
6.  **Insert Interval (LeetCode #57)** - A more complex variant of merge intervals.
7.  **Car Fleet (LeetCode #853)** - A great example of sorting to simplify a physics/position problem.

By following this progression, you move from recognizing the pattern, to implementing it, to finally adapting it for trickier scenarios. This is exactly the skill progression a Yelp interviewer is looking for.

[Practice Sorting at Yelp](/company/yelp/sorting)
