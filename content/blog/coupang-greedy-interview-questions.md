---
title: "Greedy Questions at Coupang: What to Expect"
description: "Prepare for Greedy interview questions at Coupang — patterns, difficulty breakdown, and study tips."
date: "2029-06-26"
category: "dsa-patterns"
tags: ["coupang", "greedy", "interview prep"]
---

If you're preparing for a Coupang interview, you might have noticed something interesting in their problem frequency: out of 53 tagged problems, 6 are Greedy. That's roughly 11% — not the dominant category, but a significant enough slice that you'll almost certainly encounter at least one greedy-style question in your interview loop. At Coupang, greedy algorithms aren't just academic exercises; they reflect the company's core logistics and optimization DNA. Think about it: minimizing delivery times, optimizing warehouse slot assignments, scheduling delivery routes — these are all real-world problems where a locally optimal choice often leads to a globally optimal solution. In my experience conducting and analyzing interviews, Coupang uses greedy problems to test a candidate's ability to recognize when a simple, efficient approach is sufficient, versus over-engineering with a more complex DP or graph solution. They want engineers who can build systems that are not only correct but also fast and scalable under the constraints of a massive e-commerce operation.

## Specific Patterns Coupang Favors

Coupang's greedy problems tend to cluster around two main themes: **interval scheduling** and **resource allocation**. You won't see many esoteric graph-greedy hybrids here; instead, expect practical problems that mirror operational decisions.

1. **Interval Scheduling & Merging**: This is their bread and butter. Problems like **Meeting Rooms II (LeetCode #253)** and **Merge Intervals (LeetCode #56)** test your ability to manage overlapping time commitments — directly analogous to scheduling delivery windows or server resource allocation.

2. **Task Scheduling & Prioritization**: Think **Task Scheduler (LeetCode #621)**. This pattern tests how you handle constraints (like cooldown periods) while maximizing throughput. For a logistics company, this translates to optimizing worker tasks or batch processing orders.

3. **Simple Assignment with Sorting**: Problems where sorting the input unlocks a greedy solution, like **Assign Cookies (LeetCode #455)** or **Minimum Number of Arrows to Burst Balloons (LeetCode #452)**. These test fundamental greedy reasoning: "if I sort by this key, can I make a safe greedy choice?"

Here’s a classic interval scheduling pattern they love. The key insight is that for "how many rooms needed" type problems, you don't need to simulate rooms; you just need to track the maximum concurrent events.

<div class="code-group">

```python
def minMeetingRooms(intervals):
    """
    LeetCode #253: Meeting Rooms II
    Greedy approach using chronological ordering.
    Time: O(N log N) for sorting | Space: O(N) for the two lists.
    """
    if not intervals:
        return 0

    start_times = sorted([i[0] for i in intervals])
    end_times = sorted([i[1] for i in intervals])

    start_ptr = end_ptr = 0
    used_rooms = 0

    while start_ptr < len(intervals):
        # If a meeting has ended by the time the current one starts, reuse that room
        if start_times[start_ptr] >= end_times[end_ptr]:
            used_rooms -= 1
            end_ptr += 1
        # Always allocate a room for the current meeting
        used_rooms += 1
        start_ptr += 1

    return used_rooms
```

```javascript
function minMeetingRooms(intervals) {
  /**
   * LeetCode #253: Meeting Rooms II
   * Time: O(N log N) | Space: O(N)
   */
  if (!intervals.length) return 0;

  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);

  let startPtr = 0,
    endPtr = 0;
  let usedRooms = 0;

  while (startPtr < intervals.length) {
    if (starts[startPtr] >= ends[endPtr]) {
      usedRooms--;
      endPtr++;
    }
    usedRooms++;
    startPtr++;
  }

  return usedRooms;
}
```

```java
public int minMeetingRooms(int[][] intervals) {
    /**
     * LeetCode #253: Meeting Rooms II
     * Time: O(N log N) | Space: O(N)
     */
    if (intervals.length == 0) return 0;

    Integer[] starts = new Integer[intervals.length];
    Integer[] ends = new Integer[intervals.length];
    for (int i = 0; i < intervals.length; i++) {
        starts[i] = intervals[i][0];
        ends[i] = intervals[i][1];
    }

    Arrays.sort(starts);
    Arrays.sort(ends);

    int startPtr = 0, endPtr = 0;
    int usedRooms = 0;

    while (startPtr < intervals.length) {
        if (starts[startPtr] >= ends[endPtr]) {
            usedRooms--;
            endPtr++;
        }
        usedRooms++;
        startPtr++;
    }

    return usedRooms;
}
```

</div>

## How to Prepare

The biggest mistake candidates make with greedy problems is assuming they're "easy" and not practicing the proof. At Coupang, interviewers will expect you to **justify why your greedy choice is optimal**. Your preparation should focus on pattern recognition and proof sketching.

1. **Master the Sorting Pre-process**: 80% of Coupang's greedy problems start with sorting. Ask yourself: "If I sort by start time, end time, or some custom key, does the optimal solution reveal itself?"

2. **Practice the "Two-Pointer Chase"**: The meeting rooms solution above shows a pattern where you process sorted start and end arrays with separate pointers. This appears in multiple interval problems.

3. **Learn to Prove Greedy Choice Property**: For any greedy solution, be ready to explain in simple terms: "Making this local choice is safe because any optimal solution could be transformed to include this choice without making it worse."

Here's another essential pattern: the "earliest deadline first" or "smallest limit first" approach seen in assignment problems.

<div class="code-group">

```python
def findContentChildren(g, s):
    """
    LeetCode #455: Assign Cookies
    Greedy: satisfy the least greedy children first with the smallest adequate cookie.
    Time: O(N log N) for sorting | Space: O(1) aside from sorting memory.
    """
    g.sort()  # children's greed factors
    s.sort()  # cookie sizes
    child_i = cookie_j = 0

    while child_i < len(g) and cookie_j < len(s):
        if s[cookie_j] >= g[child_i]:
            child_i += 1  # child satisfied
        cookie_j += 1  # move to next cookie regardless

    return child_i  # number of satisfied children
```

```javascript
function findContentChildren(g, s) {
  /**
   * LeetCode #455: Assign Cookies
   * Time: O(N log N) | Space: O(1)
   */
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let childIdx = 0,
    cookieIdx = 0;

  while (childIdx < g.length && cookieIdx < s.length) {
    if (s[cookieIdx] >= g[childIdx]) {
      childIdx++;
    }
    cookieIdx++;
  }

  return childIdx;
}
```

```java
public int findContentChildren(int[] g, int[] s) {
    /**
     * LeetCode #455: Assign Cookies
     * Time: O(N log N) | Space: O(1)
     */
    Arrays.sort(g);
    Arrays.sort(s);

    int childIdx = 0, cookieIdx = 0;

    while (childIdx < g.length && cookieIdx < s.length) {
        if (s[cookieIdx] >= g[childIdx]) {
            childIdx++;
        }
        cookieIdx++;
    }

    return childIdx;
}
```

</div>

## How Coupang Tests Greedy vs Other Companies

At FAANG companies, greedy problems often serve as warm-ups or are embedded in more complex system design discussions (e.g., "how would you schedule jobs in a distributed queue?"). At Coupang, greedy questions are more likely to be **standalone, medium-difficulty problems** that directly model a logistics constraint. The difference is in the framing: while Google might ask an abstract "minimum number of arrows to burst balloons," Coupang might contextualize it as "minimum number of delivery drones to cover all package drop-offs."

What's unique is their emphasis on **edge cases that reflect physical constraints**. For interval problems, they might add constraints like "a worker needs 15 minutes between assignments" or "a vehicle has a maximum capacity." This tests whether you can adapt standard greedy patterns to real-world business rules.

## Study Order

Don't jump straight into hard greedy problems. Build your intuition progressively:

1. **Basic Sorting Greedy** (Assign Cookies #455): Learn the fundamental "sort and assign" pattern.
2. **Interval Scheduling** (Non-overlapping Intervals #435, Meeting Rooms II #253): Understand time-based greedy choices.
3. **Task Scheduling with Constraints** (Task Scheduler #621): Introduces the idea of idle time and prioritization.
4. **Greedy on Strings** (Partition Labels #763): Expands your thinking to non-numeric domains.
5. **Advanced Interval Problems** (Minimum Number of Arrows to Burst Balloons #452): Combines sorting with overlapping logic.
6. **Greedy with Heap** (Course Schedule III #630): For when simple sorting isn't enough and you need dynamic prioritization.

This order works because it builds from simple sorting intuition to more complex state management, finally introducing data structures (heaps) that augment greedy decisions.

## Recommended Practice Order

Solve these problems in sequence to build Coupang-relevant greedy skills:

1. **Assign Cookies (#455)** - Warm-up with sorting
2. **Merge Intervals (#56)** - Fundamental interval manipulation
3. **Non-overlapping Intervals (#435)** - Classic interval scheduling
4. **Meeting Rooms II (#253)** - Two-pointer interval counting
5. **Task Scheduler (#621)** - Scheduling with constraints
6. **Minimum Number of Arrows to Burst Balloons (#452)** - Advanced interval application
7. **Partition Labels (#763)** - Greedy on string partitions

After mastering these, if you have time, tackle **Course Schedule III (#630)** which introduces a heap and is the most complex greedy problem in their tagged list.

Remember: at Coupang, the goal isn't just to solve the problem, but to explain why your greedy approach works and how it would perform at scale. Always articulate the time/space complexity and be prepared to discuss how you'd handle input sizes in the millions (their actual data scale).

[Practice Greedy at Coupang](/company/coupang/greedy)
