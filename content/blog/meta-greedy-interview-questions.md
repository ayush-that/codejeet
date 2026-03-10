---
title: "Greedy Questions at Meta: What to Expect"
description: "Prepare for Greedy interview questions at Meta — patterns, difficulty breakdown, and study tips."
date: "2027-03-13"
category: "dsa-patterns"
tags: ["meta", "greedy", "interview prep"]
---

Greedy algorithms are one of those topics that candidates often misunderstand or underprepare for, especially for Meta interviews. With 117 Greedy questions in their tagged problem set, it represents about 8.4% of their total catalog. In practice, you’re less likely to get a _pure_ greedy problem than a problem where the greedy choice is one component of a more complex solution—often intertwined with intervals, sorting, or heap usage. At Meta, greedy thinking is less about standalone algorithm questions and more about optimization within system design or feature implementation scenarios. Interviewers love to see candidates who can identify when a locally optimal choice leads to a globally optimal solution, because that mirrors real-world product decisions: what’s the next best feature to ship? What’s the most efficient cache eviction policy? This mindset is tested regularly.

## Specific Patterns Meta Favors

Meta’s greedy problems heavily favor **interval scheduling** and **resource allocation** patterns. You’re far more likely to see “given N meetings with start/end times, find the maximum number you can schedule” than something like Huffman coding. The reasoning is practical: these map directly to backend scheduling problems (like task scheduling on servers) or UI rendering optimizations.

The second major category is **array transformation with greedy choice**—problems where you make a series of local decisions to transform an array into a desired state. Think “minimum increments to make array unique” or “minimum deletions to make character frequencies unique.” These test your ability to reason about state and make irreversible decisions.

A subtle but important pattern is **greedy with a heap**. This isn’t just “use a heap”; it’s specifically using a heap to repeatedly select the best local option from a dynamic set. Meta uses this to assess if you can manage competing priorities, a core concept in their news feed or ad delivery systems.

Specific LeetCode problems that embody these patterns:

- **Interval Scheduling**: Meeting Rooms II (LeetCode #253) and Non-overlapping Intervals (LeetCode #435).
- **Array Transformation**: Minimum Deletions to Make Character Frequencies Unique (LeetCode #1647).
- **Greedy with Heap**: Task Scheduler (LeetCode #621) and Reorganize String (LeetCode #767).

## How to Prepare

The key to greedy problems is proving, or at least convincing yourself, that the greedy choice property holds. In interviews, you won’t need a formal proof, but you must articulate _why_ your approach works. Start by sorting—many greedy solutions begin with sorting the input to create an order where greedy choices become obvious.

For interval problems, the classic pattern is to sort by end time, then iterate, keeping track of the last accepted end time. Here’s the template for the maximum number of non-overlapping intervals:

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    LeetCode #435: Non-overlapping Intervals
    Greedy choice: Always pick the interval with the earliest end time.
    Time: O(n log n) for sorting | Space: O(1) extra space
    """
    if not intervals:
        return 0

    # Sort by end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    last_end = intervals[0][1]

    for start, end in intervals[1:]:
        if start >= last_end:
            # No overlap, update last_end to current end
            last_end = end
        else:
            # Overlap, we would remove this interval
            count += 1

    return count
```

```javascript
function eraseOverlapIntervals(intervals) {
  // LeetCode #435: Non-overlapping Intervals
  // Time: O(n log n) | Space: O(1)
  if (intervals.length === 0) return 0;

  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start >= lastEnd) {
      lastEnd = end;
    } else {
      count++;
    }
  }

  return count;
}
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    // LeetCode #435: Non-overlapping Intervals
    // Time: O(n log n) | Space: O(log n) for sorting (Java's Arrays.sort uses quicksort)
    if (intervals.length == 0) return 0;

    // Sort by end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];
        if (start >= lastEnd) {
            lastEnd = end;
        } else {
            count++;
        }
    }

    return count;
}
```

</div>

For array transformation problems, the pattern often involves counting frequencies, then making greedy adjustments. Here’s a template for making character frequencies unique by minimum deletions:

<div class="code-group">

```python
def minDeletions(s):
    """
    LeetCode #1647: Minimum Deletions to Make Character Frequencies Unique
    Greedy choice: Reduce the frequency of the most frequent character to the next available unused frequency.
    Time: O(n + k log k) where k is the number of unique characters (max 26) | Space: O(k)
    """
    from collections import Counter

    freq = Counter(s)
    seen_frequencies = set()
    deletions = 0

    for count in freq.values():
        while count > 0 and count in seen_frequencies:
            count -= 1
            deletions += 1
        seen_frequencies.add(count)

    return deletions
```

```javascript
function minDeletions(s) {
  // LeetCode #1647: Minimum Deletions to Make Character Frequencies Unique
  // Time: O(n + k log k) | Space: O(k)
  const freq = new Map();
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  const seen = new Set();
  let deletions = 0;

  for (let count of freq.values()) {
    while (count > 0 && seen.has(count)) {
      count--;
      deletions++;
    }
    seen.add(count);
  }

  return deletions;
}
```

```java
public int minDeletions(String s) {
    // LeetCode #1647: Minimum Deletions to Make Character Frequencies Unique
    // Time: O(n + k log k) | Space: O(k)
    int[] freq = new int[26];
    for (char c : s.toCharArray()) {
        freq[c - 'a']++;
    }

    Set<Integer> seen = new HashSet<>();
    int deletions = 0;

    for (int count : freq) {
        if (count == 0) continue;
        while (count > 0 && seen.contains(count)) {
            count--;
            deletions++;
        }
        seen.add(count);
    }

    return deletions;
}
```

</div>

## How Meta Tests Greedy vs Other Companies

At companies like Google, greedy problems often appear in their purest form, sometimes requiring more mathematical insight (e.g., gas station problems). At Amazon, they’re frequently tied to operational efficiency (like minimum cost to connect ropes). Meta’s approach is distinct in two ways:

1. **Integration with System Design Concepts**: A greedy question might start as an algorithm problem but evolve into a discussion about how you’d implement this at scale. For example, after solving Task Scheduler (LeetCode #621), you might be asked how you’d distribute this scheduler across servers.
2. **Focus on Product Analogy**: Interviewers often frame problems with a Meta-specific context: “You’re ranking posts in a news feed—how do you pick which to show next given constraints?” This tests if you can abstract a product problem into a greedy algorithm.

The difficulty is usually medium, but the follow-up questions can be hard. They want to see if you understand the _why_ behind the greedy choice, not just the implementation.

## Study Order

1. **Basic Greedy with Sorting**: Start with problems where sorting enables the greedy choice, like Assign Cookies (LeetCode #455) or Maximum Units on a Truck (LeetCode #1710). This builds intuition for “pick the best available option.”
2. **Interval Scheduling**: Move to interval problems, which are Meta’s bread and butter. Understand both maximizing non-overlapping intervals and minimizing rooms/meetings.
3. **Array Transformation**: Practice problems where you modify an array or string through greedy operations. This teaches you to manage state and make incremental decisions.
4. **Greedy with Heap**: Learn to combine heaps with greedy selection. This pattern is powerful for real-time scheduling problems.
5. **Advanced Greedy Proofs**: Finally, tackle problems where the greedy choice is non-obvious, like Jump Game (LeetCode #55) or Candy (LeetCode #135). These require deeper reasoning and are less common but good for completeness.

This order works because it progresses from simple local decisions to decisions that require maintaining dynamic data structures, mirroring increasing complexity in real systems.

## Recommended Practice Order

Solve these problems in sequence to build competency:

1. **Assign Cookies (LeetCode #455)** – Basic sorting and greedy matching.
2. **Meeting Rooms II (LeetCode #253)** – Interval scheduling with a min-heap.
3. **Non-overlapping Intervals (LeetCode #435)** – Classic interval selection.
4. **Task Scheduler (LeetCode #621)** – Greedy with heap and idle time calculation.
5. **Minimum Deletions to Make Character Frequencies Unique (LeetCode #1647)** – Array transformation with frequency management.
6. **Merge Triplets to Form Target Triplet (LeetCode #1899)** – A Meta-favored problem that tests greedy condition checking.
7. **Valid Parenthesis String (LeetCode #678)** – Greedy with two counters, tests flexible thinking.

After these, if you have time, explore **Reorganize String (LeetCode #767)** and **Jump Game II (LeetCode #45)** for more nuanced greedy logic.

[Practice Greedy at Meta](/company/meta/greedy)
