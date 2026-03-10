---
title: "Greedy Questions at Google: What to Expect"
description: "Prepare for Greedy interview questions at Google — patterns, difficulty breakdown, and study tips."
date: "2027-02-01"
category: "dsa-patterns"
tags: ["google", "greedy", "interview prep"]
---

# Greedy Questions at Google: What to Expect

Google has 219 Greedy questions out of 2217 total on LeetCode. That’s roughly 10% of their problem set, which tells you something important: Greedy isn’t just a niche topic. It’s a core part of their interview repertoire, especially for roles involving optimization, resource allocation, or systems design. In my experience conducting and passing interviews at Google, Greedy questions appear in about 1 in 4–5 onsite rounds. They’re not as frequent as, say, arrays or trees, but when they show up, they’re often the deciding factor between a strong hire and a borderline candidate. Why? Because Greedy problems test your ability to recognize when a locally optimal choice leads to a globally optimal solution—a skill that mirrors real‑world engineering decisions at scale.

Google’s interviewers love Greedy for its elegance and efficiency. In distributed systems, scheduling tasks, or designing caching strategies, you often need algorithms that make the best immediate decision with limited information. That’s Greedy thinking. So while you might not see a pure Greedy problem in every interview, the mindset is always relevant.

## Specific Patterns Google Favors

Google’s Greedy problems tend to cluster around a few high‑value patterns. They rarely ask obscure, theoretical Greedy proofs. Instead, they focus on practical applications where the Greedy choice is intuitive but requires careful justification.

1. **Interval Scheduling & Merging** – This is arguably the most common Greedy pattern at Google. Problems like “schedule the maximum number of non‑overlapping meetings” or “merge overlapping intervals” appear frequently because they model real‑world scheduling in Google Calendar, meeting rooms, or job processing. The Greedy strategy is usually to sort by end time and iterate.

2. **Task Scheduling with Constraints** – Think LeetCode 621 (Task Scheduler) or 767 (Reorganize String). These problems ask you to arrange tasks or characters to satisfy spacing constraints. The Greedy approach often involves prioritizing the most frequent tasks first. Google uses variants of this in their data center job schedulers.

3. **Greedy on Arrays/Strings** – Problems where you make a series of local decisions to build a result, like 122 (Best Time to Buy and Sell Stock II) or 678 (Valid Parenthesis String). The pattern here is to iterate once, maintaining some state, and make the optimal choice at each step without backtracking.

4. **Minimum Number of Moves/Operations** – For example, 455 (Assign Cookies) or 135 (Candy). These ask you to minimize something (like unfairness or unmet demand) by making Greedy assignments. They test your ability to transform a problem into a sorting‑based matching.

Notice what’s missing: complex graph Greedy algorithms like Prim’s or Kruskal’s are less common unless you’re interviewing for a role specifically in networking or infrastructure. Google prefers Greedy patterns that have direct analogs in their products.

## How to Prepare

The key to Greedy is pattern recognition. Unlike Dynamic Programming, where you can often brute‑force a solution and then optimize, Greedy requires you to spot the invariant that makes local choices safe. My advice: don’t just memorize solutions—practice justifying why the Greedy choice works. In interviews, you’ll need to explain your reasoning clearly.

Let’s look at the classic interval scheduling pattern. The problem: given a list of intervals, find the minimum number of intervals to remove to make the rest non‑overlapping (LeetCode 435, Non‑overlapping Intervals). The Greedy insight: if you sort by end time and always pick the interval that ends earliest, you maximize the space left for future intervals.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    Greedy approach: sort by end time, keep intervals that don't overlap.
    Time: O(n log n) for sorting, O(n) for iteration → O(n log n)
    Space: O(1) (in‑place sort) or O(n) if sorting creates a new list
    """
    if not intervals:
        return 0

    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    prev_end = intervals[0][1]

    for start, end in intervals[1:]:
        if start >= prev_end:
            # No overlap, update prev_end to current end
            prev_end = end
        else:
            # Overlap, we need to remove one
            count += 1
            # We keep the interval with smaller end time (already prev_end)
            # So no need to update prev_end

    return count
```

```javascript
function eraseOverlapIntervals(intervals) {
  /**
   * Greedy approach: sort by end time, keep intervals that don't overlap.
   * Time: O(n log n) for sorting, O(n) for iteration → O(n log n)
   * Space: O(1) or O(n) depending on sort implementation
   */
  if (intervals.length === 0) return 0;

  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start >= prevEnd) {
      // No overlap
      prevEnd = end;
    } else {
      // Overlap, remove current interval
      count++;
      // Keep the interval with smaller end (prevEnd unchanged)
    }
  }

  return count;
}
```

```java
import java.util.Arrays;

public int eraseOverlapIntervals(int[][] intervals) {
    /**
     * Greedy approach: sort by end time, keep intervals that don't overlap.
     * Time: O(n log n) for sorting, O(n) for iteration → O(n log n)
     * Space: O(log n) for sorting (Java's Arrays.sort uses Timsort)
     */
    if (intervals.length == 0) return 0;

    // Sort by end time
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
            // Overlap
            count++;
            // Keep the earlier ending interval (prevEnd stays)
        }
    }

    return count;
}
```

</div>

Another common pattern is task scheduling with prioritization. Here’s a simplified version of the “reorganize string” problem (LeetCode 767), where we want to rearrange characters so no two adjacent are the same.

<div class="code-group">

```python
def reorganizeString(s):
    """
    Greedy: always place the most frequent character that isn't the last placed.
    Time: O(n) for counting, O(n log n) for heap operations → O(n log n)
    Space: O(n) for heap and counter
    """
    from collections import Counter
    import heapq

    # Count frequencies
    count = Counter(s)

    # Max‑heap based on frequency (negative for max‑heap in Python)
    max_heap = [(-freq, char) for char, freq in count.items()]
    heapq.heapify(max_heap)

    result = []
    prev = None

    while max_heap or prev:
        if not max_heap and prev:
            # We have a character left but no slot → impossible
            return ""

        # Get the most frequent character (excluding previous)
        freq, char = heapq.heappop(max_heap)
        result.append(char)

        # Push back the previous character if it still has count
        if prev:
            heapq.heappush(max_heap, prev)
            prev = None

        # Update frequency and set as previous if count remains
        if freq + 1 < 0:  # because freq is negative
            prev = (freq + 1, char)

    return ''.join(result)
```

```javascript
function reorganizeString(s) {
  /**
   * Greedy: always pick the most frequent char that isn't the last used.
   * Time: O(n) for counting, O(n log n) for heap ops → O(n log n)
   * Space: O(n) for heap and map
   */
  const freqMap = new Map();
  for (let char of s) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }

  // Max‑heap (priority queue) using array and sort for simplicity
  // In a real interview, implement a proper heap for efficiency
  const maxHeap = Array.from(freqMap.entries()).map(([char, freq]) => [-freq, char]);
  maxHeap.sort((a, b) => a[0] - b[0]); // simulate heapify

  const result = [];
  let prev = null;

  while (maxHeap.length > 0 || prev) {
    if (maxHeap.length === 0 && prev) {
      return "";
    }

    // Get most frequent char
    let [freq, char] = maxHeap.shift();
    result.push(char);

    // Push back previous if exists
    if (prev) {
      maxHeap.push(prev);
      maxHeap.sort((a, b) => a[0] - b[0]);
      prev = null;
    }

    // Update frequency
    if (freq + 1 < 0) {
      prev = [freq + 1, char];
    }
  }

  return result.join("");
}
```

```java
import java.util.PriorityQueue;

public String reorganizeString(String s) {
    /**
     * Greedy: always pick the most frequent char that isn't the last used.
     * Time: O(n) for counting, O(n log n) for heap ops → O(n log n)
     * Space: O(n) for heap and map
     */
    int[] freq = new int[26];
    for (char c : s.toCharArray()) {
        freq[c - 'a']++;
    }

    // Max‑heap: store [frequency, character]
    PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> b[0] - a[0]);
    for (int i = 0; i < 26; i++) {
        if (freq[i] > 0) {
            maxHeap.offer(new int[]{freq[i], i + 'a'});
        }
    }

    StringBuilder result = new StringBuilder();
    int[] prev = null;

    while (!maxHeap.isEmpty() || prev != null) {
        if (maxHeap.isEmpty() && prev != null) {
            return "";
        }

        int[] current = maxHeap.poll();
        result.append((char) current[1]);

        if (prev != null) {
            maxHeap.offer(prev);
            prev = null;
        }

        if (--current[0] > 0) {
            prev = current;
        }
    }

    return result.toString();
}
```

</div>

## How Google Tests Greedy vs Other Companies

Google’s Greedy questions are typically medium difficulty, but they’re often disguised. You might start with a brute‑force solution, then the interviewer will push you to optimize. Unlike at Facebook or Amazon, where Greedy problems are more straightforward (e.g., “find the maximum profit”), Google often embeds Greedy within a larger problem. For example, you might be asked to design a meeting scheduler system, and the core algorithm is Greedy interval scheduling.

What’s unique is the emphasis on proof. Google interviewers will ask, “Why does this work?” They want to see you reason about optimal substructure or exchange arguments. At other companies, you might get away with just coding the solution. At Google, you need to articulate the “why.”

Also, Google mixes Greedy with other topics. A problem might start as a Greedy array problem but have a follow‑up that requires a heap or dynamic programming. Be prepared to discuss trade‑offs.

## Study Order

1. **Basic Sorting‑Based Greedy** – Start with problems where the Greedy choice is obvious after sorting. Examples: Assign Cookies (455), Minimum Number of Arrows to Burst Balloons (452). This builds intuition for ordering matters.

2. **Interval Problems** – Move to interval scheduling and merging. These are high‑frequency at Google. Practice Non‑overlapping Intervals (435), Merge Intervals (56), Meeting Rooms II (253). Learn to sort by start vs. end time depending on the goal.

3. **Task Scheduling** – Tackle problems with prioritization, like Task Scheduler (621) and Reorganize String (767). These introduce the “most frequent first” heuristic and often require a heap.

4. **Greedy on Strings/Arrays** – Problems where you iterate once and make decisions: Best Time to Buy and Sell Stock II (122), Valid Parenthesis String (678). These test your ability to maintain state.

5. **Advanced/Combined Patterns** – Finally, try problems that blend Greedy with other concepts, like Jump Game (55) or Gas Station (134). These often have tricky edge cases.

This order works because it builds from simple sorting to more complex state management, then to integrated patterns. Each step reinforces the previous.

## Recommended Practice Order

1. Assign Cookies (455) – Warm‑up with sorting and matching.
2. Non‑overlapping Intervals (435) – Master interval sorting by end time.
3. Merge Intervals (56) – Learn to merge rather than remove.
4. Meeting Rooms II (253) – Extend to counting overlapping intervals.
5. Task Scheduler (621) – Introduce priority queues.
6. Reorganize String (767) – Similar pattern but with characters.
7. Valid Parenthesis String (678) – Greedy with low/high bounds.
8. Jump Game (55) – Greedy with farthest reach.
9. Gas Station (134) – Circular Greedy with total balance check.
10. Minimum Domino Rotations (1007) – A trickier Google‑style problem.

After these, explore Google’s tagged Greedy problems on LeetCode. Focus on medium‑difficulty ones first.

[Practice Greedy at Google](/company/google/greedy)
