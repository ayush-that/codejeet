---
title: "Greedy Questions at Atlassian: What to Expect"
description: "Prepare for Greedy interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-20"
category: "dsa-patterns"
tags: ["atlassian", "greedy", "interview prep"]
---

# Greedy Questions at Atlassian: What to Expect

Atlassian’s coding interviews are known for being practical and product‑focused, but that doesn’t mean they skip on algorithmic fundamentals. Out of the 62 tagged problems in their LeetCode company list, 7 are Greedy—that’s about 11%, which is a meaningful slice. In my experience interviewing there, Greedy questions don’t appear in every round, but when they do, they’re often used to assess how you think about optimization in real‑time, a skill critical for building efficient features in tools like Jira or Confluence. Atlassian engineers care about solutions that are not only correct but also simple and fast to implement—exactly the strengths of a well‑applied greedy approach.

## Specific Patterns Atlassian Favors

Atlassian’s Greedy problems tend to cluster around **interval scheduling** and **resource allocation** patterns. These mirror real‑world scenarios they face: scheduling background jobs, optimizing server usage, or assigning tasks to meet deadlines. You’re less likely to see abstract mathematical greedy proofs and more likely to get a problem that feels like a simplified version of a system design challenge.

Two patterns stand out:

1. **Interval Merging/Partitioning** – Problems where you need to combine overlapping intervals or find the minimum number of points/partitions to cover all intervals. This tests your ability to sort and then make locally optimal choices.
2. **Task Scheduling with Constraints** – Often involving picking the “best” task at each step given a limitation (like time or resources), these questions assess your knack for ordering decisions to maximize output or minimize cost.

A classic example is **Meeting Rooms II (LeetCode #253)**, which asks for the minimum number of conference rooms needed given a list of meeting intervals. Atlassian has a direct variant in their list, and it’s a perfect example of the “resource allocation” flavor they like. Another is **Non‑overlapping Intervals (LeetCode #435)**, which is about removing the minimum number of intervals to make the rest non‑overlapping—a greedy selection problem.

## How to Prepare

The key to greedy problems is recognizing when a locally optimal choice leads to a globally optimal solution. For interval‑based questions, that almost always starts with sorting. Let’s look at the core pattern for interval scheduling:

<div class="code-group">

```python
def minMeetingRooms(intervals):
    if not intervals:
        return 0

    # Separate sorted start and end times
    starts = sorted(i[0] for i in intervals)
    ends = sorted(i[1] for i in intervals)

    rooms = 0
    end_ptr = 0

    # Iterate through start times
    for start in starts:
        if start < ends[end_ptr]:
            # Need a new room
            rooms += 1
        else:
            # Reuse a room, move end pointer
            end_ptr += 1

    return rooms

# Time: O(n log n) for sorting, O(n) for the sweep → O(n log n)
# Space: O(n) for the two sorted arrays
```

```javascript
function minMeetingRooms(intervals) {
  if (intervals.length === 0) return 0;

  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);

  let rooms = 0;
  let endPtr = 0;

  for (let start of starts) {
    if (start < ends[endPtr]) {
      rooms++;
    } else {
      endPtr++;
    }
  }

  return rooms;
}

// Time: O(n log n) | Space: O(n)
```

```java
public int minMeetingRooms(int[][] intervals) {
    if (intervals.length == 0) return 0;

    int[] starts = new int[intervals.length];
    int[] ends = new int[intervals.length];
    for (int i = 0; i < intervals.length; i++) {
        starts[i] = intervals[i][0];
        ends[i] = intervals[i][1];
    }

    Arrays.sort(starts);
    Arrays.sort(ends);

    int rooms = 0;
    int endPtr = 0;

    for (int start : starts) {
        if (start < ends[endPtr]) {
            rooms++;
        } else {
            endPtr++;
        }
    }

    return rooms;
}

// Time: O(n log n) | Space: O(n)
```

</div>

Notice the pattern: sort, then use a two‑pointer sweep to track overlapping intervals. This is a staple you must internalize.

For task‑selection problems, the greedy rule often involves picking the task that finishes earliest or has the smallest impact on future options. Here’s a template for the “erase overlapping intervals” problem:

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    if not intervals:
        return 0

    # Sort by end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    prev_end = intervals[0][1]

    for start, end in intervals[1:]:
        if start < prev_end:
            # Overlap, remove this interval
            count += 1
        else:
            # No overlap, update prev_end
            prev_end = end

    return count

# Time: O(n log n) | Space: O(1) (excluding sort space)
```

```javascript
function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;

  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start < prevEnd) {
      count++;
    } else {
      prevEnd = end;
    }
  }

  return count;
}

// Time: O(n log n) | Space: O(1)
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    if (intervals.length == 0) return 0;

    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int prevEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < prevEnd) {
            count++;
        } else {
            prevEnd = intervals[i][1];
        }
    }

    return count;
}

// Time: O(n log n) | Space: O(1)
```

</div>

## How Atlassian Tests Greedy vs Other Companies

Atlassian’s Greedy questions are typically **medium difficulty** and are often presented with a practical narrative—e.g., “Imagine you’re scheduling CI/CD jobs” or “We need to assign tickets to engineers.” This differs from companies like Google, which might lean toward more mathematically rigorous greedy proofs (think “Gas Station” or “Jump Game”), or Facebook, which often embeds greedy choices within array/string manipulation.

What’s unique at Atlassian is the **emphasis on clarity and communication**. You’re expected to explain why your greedy approach works, not just implement it. Interviewers there frequently ask, “Can you think of a counterexample where this might fail?” to test your understanding of the greedy invariant. Be prepared to walk through a small example and justify your sorting key.

## Study Order

1. **Basic Interval Scheduling** – Start with the classic “Non‑overlapping Intervals” and “Meeting Rooms” problems. These teach you the fundamental sort‑and‑sweep pattern.
2. **Resource Allocation** – Move to problems like “Minimum Number of Arrows to Burst Balloons” (LeetCode #452), which adds a twist on the interval model.
3. **Task Sequencing** – Tackle problems where order matters based on a rule, such as “Task Scheduler” (LeetCode #621). This introduces priority queues alongside greedy logic.
4. **Greedy on Strings/Arrays** – Practice problems like “Partition Labels” (LeetCode #763) to see how greedy partitioning works in different data structures.
5. **Advanced Proof‑Based Greedy** – Finally, look at problems like “Gas Station” (LeetCode #134) where the greedy choice requires a deeper invariant proof.

This order builds from concrete interval patterns to more abstract greedy reasoning, ensuring you have the templates down before tackling variations.

## Recommended Practice Order

1. **LeetCode #435 – Non‑overlapping Intervals** – The simplest interval selection problem.
2. **LeetCode #253 – Meeting Rooms II** – Introduces the two‑pointer resource count technique.
3. **LeetCode #452 – Minimum Number of Arrows to Burst Balloons** – A slight variation that tests if you really understand the interval overlap condition.
4. **LeetCode #763 – Partition Labels** – Applies greedy partitioning to strings, a common Atlassian‑style twist.
5. **LeetCode #621 – Task Scheduler** – Combines greedy with heap usage, good for medium‑hard practice.
6. **LeetCode #134 – Gas Station** – Proof‑heavy greedy; practice explaining why the solution works.
7. **Atlassian‑tagged Greedy problems** – Filter by company on LeetCode and solve the remaining ones.

Remember, at Atlassian, clean code and clear reasoning often outweigh clever tricks. Practice writing greedy solutions that are immediately understandable, and always articulate your sorting rationale.

[Practice Greedy at Atlassian](/company/atlassian/greedy)
