---
title: "Greedy Questions at PhonePe: What to Expect"
description: "Prepare for Greedy interview questions at PhonePe — patterns, difficulty breakdown, and study tips."
date: "2028-06-17"
category: "dsa-patterns"
tags: ["phonepe", "greedy", "interview prep"]
---

If you're preparing for a PhonePe interview, you've likely seen the statistic: **15 out of their 102 tagged problems are Greedy**. That's roughly 15%, which is significant but not overwhelming. This tells a clear story: Greedy is a **core secondary topic** at PhonePe. You won't have an interview loop without encountering it, but it's unlikely to be the sole focus of an entire round. Instead, it frequently appears as the optimal solution to a problem that might initially seem to require Dynamic Programming (DP) or a brute-force search. Interviewers use these questions to test your ability to recognize when a locally optimal choice leads to a globally optimal solution—a critical skill for designing efficient, real-world payment and financial systems where resource allocation (like server bandwidth or transaction ordering) is key.

## Specific Patterns PhonePe Favors

PhonePe's Greedy problems aren't about obscure theoretical puzzles. They heavily favor **practical, interval-based and assignment-based optimization** problems. You'll see a clear bias towards:

1.  **Interval Scheduling & Merging:** Problems where you have tasks with start and end times, and you need to maximize tasks completed (non-overlapping intervals) or merge overlapping ones. This directly mirrors real scenarios like scheduling transaction validations or batch processing windows.
2.  **"Jump Game" Variants:** These test your ability to see the minimum steps or feasibility of reaching an end point, analogous to routing a transaction through nodes with certain capacities.
3.  **Simple Assignment with Sorting:** Problems where the greedy choice becomes obvious after sorting the input by one key parameter (e.g., earliest finish time, smallest/largest value).

You will _not_ typically find deeply complex, proof-intensive greedy problems here. The focus is on **applied greedy intuition**.

For example, **Non-overlapping Intervals (LeetCode #435)** and **Merge Intervals (LeetCode #56)** are quintessential PhonePe-style problems. Another favorite pattern is **Jump Game II (LeetCode #45)**, which tests optimal sequence jumping.

## How to Prepare

The key to PhonePe's greedy problems is mastering the **"sort first, then iterate"** pattern. The greedy choice is often hidden until you order the data correctly. Let's look at the most common variation: the interval scheduling pattern for finding the minimum number of intervals to remove to make the rest non-overlapping.

The trick: Sort by the _end time_. Why? To maximize the number of intervals we can keep, we should always pick the interval that finishes the earliest, freeing up the rest of the timeline for more tasks.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    LeetCode #435: Non-overlapping Intervals
    Time: O(n log n) due to sorting. Space: O(1) extra space.
    """
    if not intervals:
        return 0

    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    prev_end = intervals[0][1]

    # Start from the second interval
    for start, end in intervals[1:]:
        if start >= prev_end:
            # No overlap, update the previous end to current end
            prev_end = end
        else:
            # Overlap occurs, we need to remove one.
            # We greedily keep the one with the earlier end (already did by sorting).
            # So we count this one for removal and do NOT update prev_end.
            count += 1

    return count
```

```javascript
function eraseOverlapIntervals(intervals) {
  /**
   * LeetCode #435: Non-overlapping Intervals
   * Time: O(n log n) due to sorting. Space: O(1) extra space.
   */
  if (intervals.length === 0) return 0;

  // Sort intervals by their end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start >= prevEnd) {
      // No overlap, update the previous end
      prevEnd = end;
    } else {
      // Overlap, greedily remove the current interval
      count++;
    }
  }
  return count;
}
```

```java
import java.util.Arrays;

public class Solution {
    // LeetCode #435: Non-overlapping Intervals
    // Time: O(n log n) | Space: O(1) extra space (sorting uses O(log n) space for the sort itself in Java).
    public int eraseOverlapIntervals(int[][] intervals) {
        if (intervals.length == 0) return 0;

        // Sort intervals by their end time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

        int count = 0;
        int prevEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            int start = intervals[i][0];
            int end = intervals[i][1];
            if (start >= prevEnd) {
                // No overlap
                prevEnd = end;
            } else {
                // Overlap, remove this interval
                count++;
            }
        }
        return count;
    }
}
```

</div>

Another essential pattern is the **"minimum jumps"** greedy approach, which is more about smart traversal than sorting.

<div class="code-group">

```python
def jump(nums):
    """
    LeetCode #45: Jump Game II
    Time: O(n). We traverse the list once.
    Space: O(1). We only use a few variables.
    """
    jumps = 0
    current_jump_end = 0
    farthest = 0

    # We don't need to iterate the last element
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])

        # If we've reached the end of the current jump's range,
        # we must take a jump to the farthest point we've seen.
        if i == current_jump_end:
            jumps += 1
            current_jump_end = farthest

            # Early exit: if we can already reach the end
            if current_jump_end >= len(nums) - 1:
                break
    return jumps
```

```javascript
function jump(nums) {
  /**
   * LeetCode #45: Jump Game II
   * Time: O(n). Space: O(1).
   */
  let jumps = 0;
  let currentJumpEnd = 0;
  let farthest = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);

    if (i === currentJumpEnd) {
      jumps++;
      currentJumpEnd = farthest;

      if (currentJumpEnd >= nums.length - 1) {
        break;
      }
    }
  }
  return jumps;
}
```

```java
public class Solution {
    // LeetCode #45: Jump Game II
    // Time: O(n) | Space: O(1)
    public int jump(int[] nums) {
        int jumps = 0;
        int currentJumpEnd = 0;
        int farthest = 0;

        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);

            if (i == currentJumpEnd) {
                jumps++;
                currentJumpEnd = farthest;

                if (currentJumpEnd >= nums.length - 1) {
                    break;
                }
            }
        }
        return jumps;
    }
}
```

</div>

## How PhonePe Tests Greedy vs Other Companies

At companies like Google or Meta, a Greedy problem might be wrapped in a complex graph scenario or require a non-trivial proof of correctness. At PhonePe, the **difficulty is medium, but the application is direct**. The twist is often that the problem statement might _look_ like a DP problem (e.g., "minimum number of something"), tempting you towards a more complex `O(n²)` solution. The interviewer is evaluating if you can pause, consider the properties of the input, and ask, "Is there a property here that allows for a greedy choice?"

What's unique is the **practical context**. You might get a problem about minimizing cash flow between users (a variation of "Minimum Number of Arrows to Burst Balloons" #452) or scheduling transaction batches—abstracted just enough to be a LeetCode problem, but the domain hint is there.

## Study Order

Don't jump into the hardest tagged problems. Build your intuition sequentially:

1.  **Foundational Sorting Greedy:** Start with problems where the greedy choice is obvious after sorting. This builds the core muscle of "reorder, then solve."
    - Example: **Assign Cookies (LeetCode #455)**, **Maximum Units on a Truck (LeetCode #1710)**.
2.  **Interval Patterns:** Move to 1D interval problems. This is PhonePe's bread and butter.
    - First, learn to merge (**Merge Intervals #56**).
    - Then, learn to schedule/select (**Non-overlapping Intervals #435**, **Minimum Number of Arrows to Burst Balloons #452**).
3.  **Jump Game & Reachability:** These teach a different kind of greedy—one based on frontier expansion during traversal, not pre-sorting.
    - Do **Jump Game (LeetCode #55)** first, then **Jump Game II (LeetCode #45)**.
4.  **Slightly Advanced Assignment:** Problems where you need to track more than one variable or use a data structure like a heap to make the greedy choice efficient.
    - Example: **Task Scheduler (LeetCode #621)**.

## Recommended Practice Order

Solve these PhonePe-tagged problems in this sequence to build confidence:

1.  **Assign Cookies (#455)** - The simplest sort-and-match.
2.  **Merge Intervals (#56)** - Fundamental interval operation.
3.  **Non-overlapping Intervals (#435)** - The classic scheduling problem.
4.  **Minimum Number of Arrows to Burst Balloons (#452)** - A clever twist on the interval pattern.
5.  **Jump Game (#55)** - Basic reachability.
6.  **Jump Game II (#45)** - Optimal steps.
7.  **Task Scheduler (#621)** - Introduces the heap-aided greedy pattern.
8.  **Gas Station (#134)** - A circular array greedy problem that tests thoroughness.

By following this path, you move from recognizing the greedy choice to proving it through implementation, which is exactly what your PhonePe interviewer will be watching for.

[Practice Greedy at PhonePe](/company/phonepe/greedy)
