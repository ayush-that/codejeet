---
title: "Greedy Questions at Paytm: What to Expect"
description: "Prepare for Greedy interview questions at Paytm — patterns, difficulty breakdown, and study tips."
date: "2030-10-23"
category: "dsa-patterns"
tags: ["paytm", "greedy", "interview prep"]
---

Greedy algorithms are deceptive. They seem simple—just make the locally optimal choice at each step—but interviewers love them precisely because they test whether you can recognize when a greedy approach is valid. At Paytm, with 5 out of 29 tagged questions being greedy, it’s not their absolute top category, but it’s a consistent, high-signal one. In real interviews, a greedy question often appears in the second round, testing your problem-solving intuition and your ability to argue correctness. They don’t just want you to implement an algorithm; they want you to prove why the greedy choice leads to a global optimum. This is where candidates stumble—jumping to code without justifying the approach.

## Specific Patterns Paytm Favors

Paytm’s greedy problems tend to cluster around **interval scheduling and resource allocation**—fitting for a fintech company dealing with transactions, scheduling payments, or optimizing resource use. You’ll rarely see esoteric graph-based greedy problems here. Instead, think about arranging intervals, minimizing costs, or maximizing throughput under constraints.

A classic pattern is **"earliest finish time"** for interval scheduling (LeetCode #435, Non-overlapping Intervals). Another favorite is the **"jump game"** pattern (LeetCode #55, Jump Game), which tests if you can reach the end given maximum jump lengths—a metaphor for progressing through financial milestones. They also lean into **"assign cookies"** type problems (LeetCode #455, Assign Cookies), which is about matching resources to demands efficiently. These aren’t abstract; they mirror real-world scenarios like scheduling server tasks or allocating customer support.

Here’s the core of the earliest finish time pattern, used to find the maximum number of non-overlapping intervals:

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    LeetCode #435: Non-overlapping Intervals
    Greedy choice: always pick the interval with the earliest finish time.
    This leaves the most room for remaining intervals.
    """
    if not intervals:
        return 0

    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    last_end = intervals[0][1]

    for i in range(1, len(intervals)):
        start, end = intervals[i]
        if start < last_end:
            # Overlaps with the last kept interval, so we need to remove one
            count += 1
        else:
            # No overlap, update the last end to current end
            last_end = end

    return count

# Time: O(n log n) due to sorting | Space: O(1) excluding input storage
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
    if (start < lastEnd) {
      count++;
    } else {
      lastEnd = end;
    }
  }

  return count;
}

// Time: O(n log n) | Space: O(1)
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
        if (start < lastEnd) {
            count++;
        } else {
            lastEnd = end;
        }
    }

    return count;
}

// Time: O(n log n) | Space: O(log n) for sorting (Java's Arrays.sort uses a variant of quicksort/mergesort)
```

</div>

## How to Prepare

Don’t just memorize solutions. For each greedy problem, ask yourself: **Why is the greedy choice safe?** Practice articulating a proof—either by exchange argument (showing swapping doesn’t improve the solution) or by demonstrating optimal substructure. When studying, implement the pattern, then tweak it. For example, take the interval problem above and modify it to find the minimum number of intervals to remove to make the rest non-overlapping (which is essentially the same). Then, try the "meeting rooms II" variant (LeetCode #253), which uses a min-heap—it’s not purely greedy, but it builds on the same interval intuition.

Another key pattern is the **"maximum jump"** greedy approach, where you iteratively extend your reach:

<div class="code-group">

```python
def canJump(nums):
    """
    LeetCode #55: Jump Game
    Greedy choice: at each step, update the farthest index you can reach.
    If you ever have an index > farthest, you're stuck.
    """
    farthest = 0
    for i in range(len(nums)):
        if i > farthest:
            return False
        farthest = max(farthest, i + nums[i])
        if farthest >= len(nums) - 1:
            return True
    return farthest >= len(nums) - 1

# Time: O(n) | Space: O(1)
```

```javascript
function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
    if (farthest >= nums.length - 1) return true;
  }
  return farthest >= nums.length - 1;
}

// Time: O(n) | Space: O(1)
```

```java
public boolean canJump(int[] nums) {
    int farthest = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > farthest) return false;
        farthest = Math.max(farthest, i + nums[i]);
        if (farthest >= nums.length - 1) return true;
    }
    return farthest >= nums.length - 1;
}

// Time: O(n) | Space: O(1)
```

</div>

## How Paytm Tests Greedy vs Other Companies

At companies like Google or Meta, greedy problems are often disguised within graph or dynamic programming scenarios, requiring deeper pattern recognition. Paytm’s approach is more direct—they present a problem that clearly maps to a known greedy pattern, but they elevate the difficulty by adding a twist or asking for a rigorous correctness proof. For instance, instead of just "find minimum arrows to burst balloons" (LeetCode #452), they might ask you to modify it for weighted intervals. Their questions feel practical, rooted in operational efficiency. Unlike some startups that might throw a novel greedy problem at you, Paytm sticks to established patterns but expects flawless execution and clear reasoning.

## Study Order

1.  **Basic Interval Scheduling:** Start with Non-overlapping Intervals (#435). It teaches the fundamental "earliest finish time" logic.
2.  **Jump Game Variations:** Move to Jump Game (#55) and Jump Game II (#45). These introduce the concept of maintaining a "farthest reach" and making greedy leaps.
3.  **Assignment Problems:** Tackle Assign Cookies (#455). It’s a simple two-pointer greedy that reinforces sorting as a pre-processing step.
4.  **More Complex Intervals:** Advance to Minimum Number of Arrows to Burst Balloons (#452) and Merge Intervals (#56). These build on interval logic but add conditions (touching endpoints, merging).
5.  **Greedy with Data Structures:** Finally, attempt Meeting Rooms II (#253). It uses a min-heap alongside greedy thinking, bridging to more complex topics.

This order works because it builds from simple sorting-based greed to incremental state tracking (jump game), then to more nuanced interval rules, and finally introduces auxiliary data structures. Each step reinforces the core skill: identifying the property that makes a greedy choice safe.

## Recommended Practice Order

Solve these in sequence to build competency:

1.  Assign Cookies (#455) – Warm-up with sorting and two pointers.
2.  Non-overlapping Intervals (#435) – Learn the fundamental interval rule.
3.  Jump Game (#55) – Understand reachability.
4.  Merge Intervals (#56) – Practice merging with a greedy scan.
5.  Minimum Number of Arrows to Burst Balloons (#452) – Apply interval logic with edge-case handling.
6.  Jump Game II (#45) – A slightly more advanced variation.
7.  Task Scheduler (#621) – A harder problem that sometimes appears; it combines greedy with counting.

This sequence mirrors the increasing complexity you’ll see in interviews. By the end, you’ll have covered the core patterns Paytm uses.

[Practice Greedy at Paytm](/company/paytm/greedy)
