---
title: "Greedy Questions at IBM: What to Expect"
description: "Prepare for Greedy interview questions at IBM — patterns, difficulty breakdown, and study tips."
date: "2027-11-22"
category: "dsa-patterns"
tags: ["ibm", "greedy", "interview prep"]
---

## Why Greedy Matters at IBM

IBM’s interview process is unique because it blends traditional software engineering with a heavy emphasis on systems thinking and practical optimization. With 27 Greedy questions in their tagged LeetCode list (out of 170 total), Greedy algorithms represent about 16% of their technical focus—a significant portion, but not the largest. However, this number is misleading. In real interviews, Greedy concepts appear more frequently as sub-components of larger system design or optimization discussions. An IBM interviewer might not ask you to solve a pure "Greedy" problem in isolation. Instead, they often present a real-world scenario—like task scheduling on a mainframe, resource allocation in a cloud environment, or data compression for a database—where the optimal local choice leads to a globally optimal solution. Recognizing the Greedy pattern within a story-based problem is the real test. If you can’t articulate why a Greedy approach is correct (or when it would fail), you’ll struggle. At IBM, Greedy isn’t just an algorithm topic; it’s a lens for making efficient, scalable decisions in constrained systems.

## Specific Patterns IBM Favors

IBM’s Greedy problems lean heavily toward **interval scheduling** and **resource allocation** patterns. These mirror real IBM workloads: scheduling batch jobs on z/OS, allocating virtual machines in IBM Cloud, or optimizing queries in Db2. You’ll rarely see esoteric Greedy puzzles. Instead, expect problems where sorting by a specific endpoint (like finish time or deadline) unlocks a simple, optimal solution.

The most common patterns are:

1.  **Interval Scheduling & Merging:** Classic problems like "Non-overlapping Intervals" (LeetCode #435) and "Merge Intervals" (LeetCode #56) are staples. The core insight is to sort intervals by their end time to maximize non-overlapping count or by start time to merge.
2.  **Task Scheduling with Deadlines/Cooldowns:** Problems like "Task Scheduler" (LeetCode #621) test your ability to arrange tasks to minimize idle time, simulating CPU scheduling or workload management.
3.  **Simple Assignment Problems:** "Assign Cookies" (LeetCode #455) and "Lemonade Change" (LeetCode #860) are common warm-ups. They test basic Greedy reasoning—satisfy the smallest requirement first or use the largest denomination change possible.

You will almost never see a Greedy problem based on graph theory (like Prim’s or Kruskal’s) in an initial IBM screen—those are reserved for more advanced, role-specific interviews. The focus is on iterative, sort-based Greedy solutions that can be reasoned about in a 30-45 minute interview slot.

## How to Prepare

The key to Greedy problems is proving (or at least convincing) your solution is optimal. Your preparation should focus on two things: **identifying the sort key** and **articulating the Greedy choice property**.

For interval problems, the pattern is nearly always: 1) Sort, 2) Iterate with a local decision. Let’s look at the "Non-overlapping Intervals" pattern.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    LeetCode #435. Minimum intervals to remove for non-overlap.
    Greedy choice: Always keep the interval with the earliest end time.
    """
    if not intervals:
        return 0

    # Sort by end time - this is the crucial Greedy step
    intervals.sort(key=lambda x: x[1])

    count = 0
    prev_end = intervals[0][1]

    for start, end in intervals[1:]:
        if start >= prev_end:
            # No overlap, update the previous end to current end
            prev_end = end
        else:
            # Overlap occurs, we greedily remove the current interval
            # (by not updating prev_end) because we kept the earlier-finishing one.
            count += 1

    return count
# Time: O(n log n) for sorting | Space: O(1) (or O(log n) for sort space in some languages)
```

```javascript
function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;

  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start >= prevEnd) {
      prevEnd = end;
    } else {
      count++;
    }
  }
  return count;
}
// Time: O(n log n) | Space: O(1) (sort in-place)
```

```java
import java.util.Arrays;

public int eraseOverlapIntervals(int[][] intervals) {
    if (intervals.length == 0) return 0;

    // Sort by end time (index 1)
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int prevEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];
        if (start >= prevEnd) {
            prevEnd = end;
        } else {
            count++;
        }
    }
    return count;
}
// Time: O(n log n) | Space: O(log n) for sorting space (Java's Timsort)
```

</div>

For task scheduling problems like LeetCode #621, the pattern shifts to counting frequencies and calculating idle slots. The Greedy choice is to always schedule the most frequent task first to minimize gaps.

<div class="code-group">

```python
def leastInterval(tasks, n):
    """
    LeetCode #621. Task Scheduler.
    Greedy choice: Schedule the most frequent task first to minimize idle time.
    """
    freq = [0] * 26
    for task in tasks:
        freq[ord(task) - ord('A')] += 1

    freq.sort()
    max_freq = freq[-1]

    # Maximum possible idle time
    idle_time = (max_freq - 1) * n

    # Fill idle slots with other tasks
    for i in range(24, -1, -1):
        idle_time -= min(max_freq - 1, freq[i])

    # If idle_time is negative, we have more tasks than idle slots
    idle_time = max(0, idle_time)

    return len(tasks) + idle_time
# Time: O(n) | Space: O(1) (array size 26)
```

```javascript
function leastInterval(tasks, n) {
  const freq = new Array(26).fill(0);
  for (const task of tasks) {
    freq[task.charCodeAt(0) - "A".charCodeAt(0)]++;
  }
  freq.sort((a, b) => a - b);

  const maxFreq = freq[25];
  let idleTime = (maxFreq - 1) * n;

  for (let i = 24; i >= 0 && freq[i] > 0; i--) {
    idleTime -= Math.min(maxFreq - 1, freq[i]);
  }

  idleTime = Math.max(0, idleTime);
  return tasks.length + idleTime;
}
// Time: O(n) | Space: O(1)
```

```java
public int leastInterval(char[] tasks, int n) {
    int[] freq = new int[26];
    for (char task : tasks) {
        freq[task - 'A']++;
    }
    Arrays.sort(freq);

    int maxFreq = freq[25];
    int idleTime = (maxFreq - 1) * n;

    for (int i = 24; i >= 0 && freq[i] > 0; i--) {
        idleTime -= Math.min(maxFreq - 1, freq[i]);
    }

    idleTime = Math.max(0, idleTime);
    return tasks.length + idleTime;
}
// Time: O(n) | Space: O(1)
```

</div>

## How IBM Tests Greedy vs Other Companies

At FAANG companies (especially Google and Meta), Greedy problems are often disguised as difficult Dynamic Programming (DP) problems, and the interview tests if you can find the Greedy optimization to avoid a DP solution. They’re about cleverness. At IBM, Greedy problems are more straightforward but are presented in a **context-rich format**. You might get: "We have a batch of jobs with start and end times on our mainframe. How do we schedule to maximize throughput?" That’s just "Non-overlapping Intervals," but you need to translate the business need into the algorithm.

The difficulty is not in the algorithm’s complexity—it’s in the **justification**. IBM interviewers will probe: "Why does sorting by end time work? Can you think of a counterexample where it wouldn’t?" They want to see systems thinking. In contrast, a company like Amazon might focus on the implementation speed within a larger behavioral framework (Leadership Principles). IBM’s style is more academic and proof-oriented for these algorithm questions.

## Study Order

1.  **Fundamental Greedy Choice Problems:** Start with "Assign Cookies" (#455) and "Lemonade Change" (#860). These have obvious Greedy choices and build intuition without sorting complexity.
2.  **Interval Scheduling:** Move to "Non-overlapping Intervals" (#435) and "Merge Intervals" (#56). This is IBM’s core pattern. Mastering the sort-by-end-time logic is critical.
3.  **Task Scheduling:** Tackle "Task Scheduler" (#621). This introduces frequency counting and a different type of Greedy reasoning (most frequent first).
4.  **Jump Game Variants:** Practice "Jump Game" (#55) and "Jump Game II" (#45). These teach array-based Greedy decisions and are common in IBM’s optimization scenarios.
5.  **Advanced Intervals & Greedy Proofs:** Finally, attempt "Minimum Number of Arrows to Burst Balloons" (#452) and "Video Stitching" (#1024). These require adapting the interval pattern and rigorously proving your approach.

This order builds from simple decisions to complex interval manipulations, ensuring you internalize the sort-first pattern before handling edge cases.

## Recommended Practice Order

Solve these IBM-tagged problems in sequence:

1.  **Easy Warm-up:** `#455 Assign Cookies`, `#860 Lemonade Change`
2.  **Core Interval Pattern:** `#435 Non-overlapping Intervals`, `#56 Merge Intervals`
3.  **IBM-Style Scheduling:** `#621 Task Scheduler`
4.  **Array-Based Greedy:** `#55 Jump Game`, `#45 Jump Game II`
5.  **Advanced Application:** `#452 Minimum Number of Arrows to Burst Balloons`, `#1024 Video Stitching`
6.  **Final Challenge (if time):** `#757 Set Intersection Size At Least Two` – a hard interval problem that tests deep Greedy understanding.

Focus on explaining _why_ the Greedy choice works as you solve. At IBM, a correct solution with a weak justification is often less impressive than an optimal approach with a solid, logical proof.

[Practice Greedy at IBM](/company/ibm/greedy)
