---
title: "Greedy Questions at Turing: What to Expect"
description: "Prepare for Greedy interview questions at Turing — patterns, difficulty breakdown, and study tips."
date: "2030-03-07"
category: "dsa-patterns"
tags: ["turing", "greedy", "interview prep"]
---

Greedy algorithms are one of those topics that can feel deceptively simple in theory but surprisingly tricky in practice. At Turing, with 4 out of 40 questions tagged as Greedy, it's not a dominant category like Arrays or Graphs, but it's a critical one. Why? Because these 4 questions represent a deliberate filter. Greedy problems test a specific and valuable engineering mindset: the ability to make a series of locally optimal choices to arrive at a globally optimal solution. In real-world systems design at scale—which Turing deeply cares about—this mirrors decisions about resource allocation, scheduling, and caching. You won't see a barrage of Greedy questions, but you will likely see _one_, and it will be chosen to see if you can identify the correct greedy property and prove (or at least argue) its correctness. Missing it suggests you might reach for a more complex, less optimal solution when a simpler, faster one exists.

## Specific Patterns Turing Favors

Turing's Greedy problems tend to cluster around two practical themes: **interval scheduling** and **array transformation with minimum cost**. They avoid overly mathematical or obscure greedy puzzles. The focus is on problems where the greedy choice is intuitive to a systems thinker.

1.  **Interval Scheduling & Merging:** This is classic greedy territory. Given a set of intervals, how do you schedule the maximum number of non-overlapping tasks? Or merge overlapping ones efficiently? This pattern directly maps to real problems like meeting room allocation or job scheduling. LeetCode #435 (Non-overlapping Intervals) and #56 (Merge Intervals) are the archetypes.
2.  **"Can you reach the end?" / Jump Game Variants:** Problems like LeetCode #55 (Jump Game) and #45 (Jump Game II) are favorites. They test your ability to track a "current maximum reach" with a simple O(n) pass, which is far more efficient than a DP approach. This pattern tests optimization and forward-thinking.
3.  **Partitioning for Balance:** Problems where you need to make a cut or decision to balance two sides, like LeetCode #122 (Best Time to Buy and Sell Stock II). The greedy insight here is that you can capture every upward price movement. It's less about a single transaction and more about the sum of all profitable sub-transactions.

You'll notice a lack of complex graph-based greedy algorithms (like Prim's or Kruskal's) in their core set. Their greedy questions are more about linear scans and clever local decisions on arrays and lists.

## How to Prepare

The key to greedy is not memorization, but pattern recognition and justification. Start by asking: "If I make the _best possible choice right now_, will that lead to the best overall outcome?" For interval problems, that often means sorting by end time. For jump games, it means always knowing the farthest point you can currently reach.

Let's look at the core pattern for **Jump Game II (LeetCode #45)**, which asks for the minimum number of jumps to reach the end. The greedy approach isn't about where to jump from _i_, but about where you can reach in the _next_ jump.

<div class="code-group">

```python
def jump(nums):
    """
    Greedy BFS-like approach. We track the farthest point reachable
    in the current jump (current_end) and the farthest point reachable
    overall (farthest). When we exhaust the range of the current jump,
    we must take another step.
    """
    jumps = 0
    current_end = 0
    farthest = 0

    # We don't need to iterate the last element itself
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])

        # If we've reached the boundary of our current jump
        if i == current_end:
            jumps += 1
            current_end = farthest

            # Early exit: if we can already reach the end
            if current_end >= len(nums) - 1:
                break
    return jumps
# Time: O(n) | Space: O(1)
```

```javascript
function jump(nums) {
  let jumps = 0;
  let currentEnd = 0;
  let farthest = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);

    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;

      if (currentEnd >= nums.length - 1) break;
    }
  }
  return jumps;
}
// Time: O(n) | Space: O(1)
```

```java
public int jump(int[] nums) {
    int jumps = 0;
    int currentEnd = 0;
    int farthest = 0;

    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);

        if (i == currentEnd) {
            jumps++;
            currentEnd = farthest;

            if (currentEnd >= nums.length - 1) break;
        }
    }
    return jumps;
}
// Time: O(n) | Space: O(1)
```

</div>

For **Interval Scheduling (LeetCode #435)**, the pattern is to sort by end time and always pick the next non-overlapping interval that ends the earliest.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    if not intervals:
        return 0

    # Sort by the end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    prev_end = intervals[0][1]

    for start, end in intervals[1:]:
        if start >= prev_end:
            # No overlap, update the previous end
            prev_end = end
        else:
            # Overlap, we need to remove one. Greedy choice:
            # remove the current one (implicitly by not updating prev_end)
            count += 1
    return count
# Time: O(n log n) due to sort | Space: O(1) or O(n) depending on sort
```

```javascript
function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;

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
// Time: O(n log n) | Space: O(1) or O(log n) for sort
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    if (intervals.length == 0) return 0;

    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int prevEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= prevEnd) {
            prevEnd = intervals[i][1];
        } else {
            count++;
        }
    }
    return count;
}
// Time: O(n log n) | Space: O(log n) for Arrays.sort (Timsort)
```

</div>

## How Turing Tests Greedy vs Other Companies

At larger, more algorithm-focused companies like Google or Meta, you might encounter a greedy component embedded within a complex graph or DP problem. At Turing, the Greedy questions are more likely to be standalone and cleaner. The difficulty isn't in the implementation complexity—the code is often short—but in the _correctness proof_. Turing interviewers are known to drill into the "why." "Why does sorting by end time work? Can you give me a counterexample if we sorted by start time?" Be prepared to articulate your reasoning.

This differs from companies like Amazon, which might lean into more practical, data structure-heavy greedy problems (e.g., merging k-sorted lists with a heap), or quant firms that might use extremely tricky greedy puzzles. Turing's style is pragmatic and proof-oriented.

## Study Order

1.  **Fundamental Greedy Proof Concept:** Before any code, understand how to argue greedy choice and optimal substructure. Read the proof for why "earliest finish time" works for interval scheduling.
2.  **Array-Based Greedy (Single Pass):** Start with problems like Best Time to Buy and Sell Stock II (#122) and Jump Game (#55). They build intuition for making a series of simple decisions during a scan.
3.  **Interval Problems:** Move to Non-overlapping Intervals (#435) and Merge Intervals (#56). Sorting is introduced here as a pre-processing step to enable the greedy choice.
4.  **Slightly More Complex Single Pass:** Tackle Jump Game II (#45). It combines the single-pass logic with a "level" or "jump" counter, introducing a second tracking variable.
5.  **Greedy with Priority Queue:** Finally, look at problems like Task Scheduler (#621) to see how a heap can be used to dynamically make the best local choice. This bridges greedy with data structures.

This order builds from simple local decisions, adds the complexity of sorting, then adds more state tracking, and finally introduces auxiliary data structures.

## Recommended Practice Order

Solve these problems in sequence to build the pattern recognition muscle for a Turing interview:

1.  **LeetCode #122 (Best Time to Buy and Sell Stock II):** The simplest greedy insight.
2.  **LeetCode #55 (Jump Game):** The "maximum reach" pattern.
3.  **LeetCode #435 (Non-overlapping Intervals):** Master the interval sorting pattern.
4.  **LeetCode #56 (Merge Intervals):** A close cousin, often solved with a similar sorted approach.
5.  **LeetCode #45 (Jump Game II):** The natural progression from #55, testing if you can handle the jump count.
6.  **LeetCode #621 (Task Scheduler):** A more advanced problem that uses a max-heap to make greedy choices, excellent for rounding out your understanding.

Focus on writing clean code for these, but spend equal time formulating a crisp, one-sentence explanation for _why_ the greedy approach works for each one. That is what will set you apart in the interview room.

[Practice Greedy at Turing](/company/turing/greedy)
