---
title: "Greedy Questions at Capgemini: What to Expect"
description: "Prepare for Greedy interview questions at Capgemini — patterns, difficulty breakdown, and study tips."
date: "2030-04-26"
category: "dsa-patterns"
tags: ["capgemini", "greedy", "interview prep"]
---

Greedy algorithms are one of those topics that can feel deceptively simple in theory but surprisingly tricky in interviews. At Capgemini, with 3 out of 36 total questions tagged as Greedy, it’s not the dominant theme, but its appearance is significant. Why? Because these 3 questions aren’t just random; they represent a specific, high-value filter. In a large-scale hiring process, a well-designed Greedy problem is excellent at separating candidates who can recognize optimal substructure and make locally optimal choices from those who just brute force everything. In my experience, Capgemini uses Greedy questions not as a primary focus but as a _gatekeeper_ for roles requiring strong analytical and optimization thinking—think software engineer, data analyst, or solutions architect positions. You might not see it in every first-round screen, but if you do, it’s because they’re testing for a particular kind of problem-solving efficiency.

## Specific Patterns Capgemini Favors

Capgemini’s Greedy problems tend to cluster around practical, business-logic optimization rather than abstract mathematical puzzles. You’re unlikely to see esoteric interval scheduling with weird constraints. Instead, expect problems that mirror real-world scenarios they encounter: resource allocation, cost minimization, and scheduling for efficiency.

The most common pattern is the **"Sort and Select"** Greedy approach. The core idea is that by sorting the input data based on a specific key (like end time, cost, or value-to-weight ratio), you can then make a series of locally optimal choices that lead to a globally optimal solution. A classic example is the **Activity Selection Problem** (analogous to LeetCode’s "Non-overlapping Intervals" #435). You’re given a set of activities with start and end times, and you need to select the maximum number of non-overlapping activities. The Greedy choice is to always pick the activity that finishes earliest, freeing up the rest of the timeline for more activities.

Another favored type is the **"Greedy Assignment"** problem, often involving arrays or sequences. Think "Assign Cookies" (#455) or "Minimum Number of Arrows to Burst Balloons" (#452). These test your ability to match or pair elements in a way that satisfies a condition with minimal moves or maximum matches. The pattern usually involves sorting two arrays and using a two-pointer technique to make incremental, optimal assignments.

Here’s a canonical example of the "Sort and Select" pattern for the activity selection/non-overlapping intervals problem:

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    LeetCode #435: Non-overlapping Intervals
    Greedy approach: Sort by end time, always pick the earliest finishing interval.
    """
    if not intervals:
        return 0

    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    last_end = intervals[0][1]

    # Start from the second interval
    for i in range(1, len(intervals)):
        start, end = intervals[i]
        # If the current interval starts before the last one ended, it's overlapping
        if start < last_end:
            count += 1  # We need to remove this overlapping interval
        else:
            # No overlap, update the last_end to the current interval's end
            last_end = end

    return count

# Time Complexity: O(n log n) due to sorting. The loop is O(n).
# Space Complexity: O(1) if we ignore the space used by sorting (in-place sort is O(log n) stack space).
```

```javascript
function eraseOverlapIntervals(intervals) {
  // LeetCode #435: Non-overlapping Intervals
  if (!intervals || intervals.length === 0) return 0;

  // Sort intervals by their end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    // If overlapping, we need to remove one
    if (start < lastEnd) {
      count++;
    } else {
      // No overlap, update the tracker
      lastEnd = end;
    }
  }
  return count;
}

// Time Complexity: O(n log n) for sorting. Loop is O(n).
// Space Complexity: O(1) extra space. Sort is in-place.
```

```java
import java.util.Arrays;

public class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        // LeetCode #435: Non-overlapping Intervals
        if (intervals.length == 0) return 0;

        // Sort intervals by their end time (second element)
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

        int count = 0;
        int lastEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            int start = intervals[i][0];
            int end = intervals[i][1];

            if (start < lastEnd) {
                // Overlapping interval, we need to remove it
                count++;
            } else {
                // No overlap, update the last ending time
                lastEnd = end;
            }
        }
        return count;
    }
}

// Time Complexity: O(n log n) for sorting. Loop is O(n).
// Space Complexity: O(log n) for the sorting algorithm's stack space.
```

</div>

## How to Prepare

The key to Greedy is pattern recognition. You can’t derive a Greedy algorithm from first principles in 30 minutes; you need to have seen the pattern before. Your preparation should focus on two things:

1.  **Memorizing the common sorting keys:** For interval problems, it’s almost always "sort by end time." For assignment problems (like "Assign Cookies"), it’s "sort both arrays and use two pointers." For "Jump Game" problems, it’s about maintaining the farthest reachable index.
2.  **Proving to yourself (and the interviewer) why the Greedy choice works.** Be prepared to say: "If we always choose the interval that ends earliest, we leave the maximum possible time for future intervals. Any other choice would risk ending later and potentially blocking more activities."

Practice by implementing the pattern, then tweaking it. For example, take the interval problem and change the goal from "maximum number of intervals" to "minimum rooms needed" (LeetCode #253: Meeting Rooms II). This shifts from a pure Greedy selection to a Greedy + min-heap pattern, testing your ability to adapt.

Here’s the "Greedy Assignment" pattern for "Assign Cookies":

<div class="code-group">

```python
def findContentChildren(g, s):
    """
    LeetCode #455: Assign Cookies.
    Greedy: Satisfy the least greedy children first with the smallest adequate cookie.
    """
    # Sort both arrays
    g.sort()
    s.sort()

    child_i = cookie_j = 0
    content_children = 0

    while child_i < len(g) and cookie_j < len(s):
        # If the cookie is big enough for the child, assign it
        if s[cookie_j] >= g[child_i]:
            content_children += 1
            child_i += 1  # move to next child
        # Move to next cookie regardless (if too small, it's useless for this and any future child)
        cookie_j += 1

    return content_children

# Time Complexity: O(n log n + m log m) for sorting both arrays. The while loop is O(min(n, m)).
# Space Complexity: O(1) extra space, or O(log n + log m) for sorting space.
```

```javascript
function findContentChildren(g, s) {
  // LeetCode #455: Assign Cookies
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let childIdx = 0;
  let cookieIdx = 0;
  let content = 0;

  while (childIdx < g.length && cookieIdx < s.length) {
    // If the cookie satisfies the child's greed
    if (s[cookieIdx] >= g[childIdx]) {
      content++;
      childIdx++;
    }
    // Try the next cookie
    cookieIdx++;
  }
  return content;
}

// Time Complexity: O(n log n + m log m) for sorting.
// Space Complexity: O(1) extra space.
```

```java
import java.util.Arrays;

public class Solution {
    public int findContentChildren(int[] g, int[] s) {
        // LeetCode #455: Assign Cookies
        Arrays.sort(g);
        Arrays.sort(s);

        int child = 0;
        int cookie = 0;
        int content = 0;

        while (child < g.length && cookie < s.length) {
            if (s[cookie] >= g[child]) {
                content++;
                child++;
            }
            cookie++;
        }
        return content;
    }
}

// Time Complexity: O(n log n + m log m).
// Space Complexity: O(log n + log m) for sorting space.
```

</div>

## How Capgemini Tests Greedy vs Other Companies

Compared to FAANG companies, Capgemini’s Greedy questions are less about algorithmic cleverness and more about **applied logic**. At Google, a Greedy problem might be deeply intertwined with a graph or a novel data structure. At Capgemini, the problem statement will often feel like a simplified business case: "Schedule these meetings to use the fewest rooms" or "Assign these tasks to minimize cost."

The difficulty is usually in the **easy to medium** range on LeetCode. The twist is that the "Greedy" property might not be immediately obvious. You might start down a path of brute force or dynamic programming before realizing a simple sort solves it. This is the test: can you spot the optimization? Their interviewers are looking for efficiency of thought, mirroring the efficiency they want in their consulting and software solutions.

## Study Order

Don’t jump into complex Greedy proofs. Build intuition first.

1.  **Fundamental "Take or Skip" Problems:** Start with the most intuitive Greedy choices. Problems like "Best Time to Buy and Sell Stock II" (#122) where the Greedy choice (buy every time the next day's price is higher) is easy to see and prove. This builds confidence.
2.  **Interval Scheduling Patterns:** Move to problems defined by start/end times. This is where the critical "sort by end time" pattern is cemented. Do "Non-overlapping Intervals" (#435) and "Meeting Rooms" (#252) back-to-back.
3.  **Assignment & Matching Problems:** Here you combine sorting with two-pointer traversal. Practice "Assign Cookies" (#455) and "Minimum Number of Arrows to Burst Balloons" (#452). They use the same sorted, incremental processing skeleton.
4.  **Greedy on Arrays/Strings:** Tackle problems where the Greedy choice is made via local scanning, like "Jump Game" (#55) or "Partition Labels" (#763). These require maintaining a piece of state (max reach, last occurrence) as you iterate.
5.  **Advanced Hybrids:** Finally, look at problems where Greedy is one part of the solution, often combined with a heap or queue, like "Meeting Rooms II" (#253) or "Task Scheduler" (#621). This tests if you can identify the Greedy core within a more complex problem.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the intuition of the last.

1.  **LeetCode #122: Best Time to Buy and Sell Stock II** - The simplest Greedy intuition.
2.  **LeetCode #455: Assign Cookies** - Introduces sorting two arrays and the two-pointer assignment.
3.  **LeetCode #435: Non-overlapping Intervals** - Teaches the paramount "sort by end time" rule for intervals.
4.  **LeetCode #452: Minimum Number of Arrows to Burst Balloons** - A variation on the interval pattern that changes the condition for "overlap."
5.  **LeetCode #55: Jump Game** - Greedy without sorting, focusing on maintaining a maximum reach.
6.  **LeetCode #253: Meeting Rooms II** - A step up, combining the interval concept with a min-heap to track resources.

Mastering these six problems will give you a robust toolkit for the vast majority of Greedy questions you’ll see at Capgemini. Remember, they’re not testing your ability to invent new algorithms; they’re testing your ability to recognize and apply efficient, optimal patterns to practical problems—which is exactly what they do for their clients.

[Practice Greedy at Capgemini](/company/capgemini/greedy)
