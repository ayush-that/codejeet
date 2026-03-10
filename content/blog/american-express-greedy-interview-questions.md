---
title: "Greedy Questions at American Express: What to Expect"
description: "Prepare for Greedy interview questions at American Express — patterns, difficulty breakdown, and study tips."
date: "2031-03-24"
category: "dsa-patterns"
tags: ["american-express", "greedy", "interview prep"]
---

If you're preparing for software engineering interviews at American Express, you'll quickly notice a distinct pattern in their technical assessments: a significant emphasis on **Greedy Algorithms**. With 3 out of their 24 total tagged questions being Greedy, it represents a core, non-negotiable focus area. This isn't a coincidence. American Express, at its heart, is a financial services and payments network company. Their engineering problems often revolve around optimization—minimizing costs, maximizing resource allocation, scheduling transactions efficiently, or finding the most profitable path through data. These are classic domains for greedy thinking. In real interviews, you are very likely to encounter at least one problem where a greedy approach is either the optimal solution or a critical part of a more complex one. Mastering this paradigm is not just about passing the interview; it's about demonstrating a mindset aligned with the company's core business logic.

## Specific Patterns American Express Favors

American Express's Greedy problems tend to cluster around a few practical, business-relevant themes. You won't find overly abstract or purely mathematical puzzles here. Instead, expect problems that model real-world financial or logistical constraints.

1.  **Interval Scheduling & Merging:** This is arguably the most important pattern. Think of scheduling non-conflicting meetings (transactions, API calls, fraud checks) to maximize throughput or merging overlapping time periods. The classic "pick the interval that ends earliest" strategy is pure gold here.
2.  **Assignment & Partitioning:** Problems where you need to assign resources (like servers to tasks or cards to fraud detection rules) in a balanced or minimum-cost way. The "greedy choice" is often to handle the largest or most demanding item first.
3.  **Simple Array/Sequence Manipulation:** These are problems where you make the locally optimal choice at each step to build a global solution, such as ensuring the array is non-decreasing with minimal increments or jumping through an array to reach the end.

A quintessential Amex-style problem is **Merge Intervals (LeetCode #56)**. It's a direct analog for consolidating transaction periods or billing cycles. Another is **Task Scheduler (LeetCode #621)**, which models efficient CPU scheduling for tasks with cooldowns—imagine processing different types of financial transactions with regulatory delays between identical types.

## How to Prepare

The key to Greedy problems is proving to yourself _why_ the greedy choice works. Don't just memorize solutions. For each pattern, ask: "If I make this locally optimal choice, can I prove it will always lead to a globally optimal solution?" Often, the proof involves an "exchange argument" showing that any optimal solution can be transformed to include your greedy choice without making it worse.

Let's look at the core pattern for **Interval Scheduling** (Maximum number of non-overlapping intervals). The greedy strategy is to always pick the interval that finishes first, as it leaves the most room for future intervals.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    LeetCode #435. Non-overlapping Intervals
    Finds the minimum number of intervals to remove to make the rest non-overlapping.
    Greedy choice: Always keep the interval with the earliest end time.
    """
    if not intervals:
        return 0

    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    prev_end = intervals[0][1]

    for i in range(1, len(intervals)):
        curr_start, curr_end = intervals[i]
        # If the current interval starts before the previous one ends, it overlaps
        if curr_start < prev_end:
            count += 1  # We need to remove this overlapping interval
        else:
            # No overlap, update the previous end to the current end
            prev_end = curr_end

    return count

# Time Complexity: O(n log n) due to sorting. Space Complexity: O(1) (or O(n) if sorting uses extra space).
```

```javascript
function eraseOverlapIntervals(intervals) {
  // LeetCode #435. Non-overlapping Intervals
  if (intervals.length === 0) return 0;

  // Sort intervals by their end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [currStart, currEnd] = intervals[i];
    if (currStart < prevEnd) {
      count++; // Remove this overlapping interval
    } else {
      prevEnd = currEnd; // Keep this interval, move the boundary
    }
  }
  return count;
}
// Time Complexity: O(n log n). Space Complexity: O(1) (or O(n) for sort in some engines).
```

```java
import java.util.Arrays;

public int eraseOverlapIntervals(int[][] intervals) {
    // LeetCode #435. Non-overlapping Intervals
    if (intervals.length == 0) return 0;

    // Sort intervals by their end time (second element)
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int prevEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int currStart = intervals[i][0];
        int currEnd = intervals[i][1];
        if (currStart < prevEnd) {
            count++; // This interval overlaps, remove it
        } else {
            prevEnd = currEnd; // No overlap, update the end pointer
        }
    }
    return count;
}
// Time Complexity: O(n log n). Space Complexity: O(log n) for the sorting algorithm's stack space.
```

</div>

Another common pattern is the **"Jump Game"** style, where you calculate the minimum steps or check feasibility. Here's the O(n) greedy approach for **Jump Game II (LeetCode #45)**.

<div class="code-group">

```python
def jump(nums):
    """
    LeetCode #45. Jump Game II
    Greedy BFS approach. At each step, find the farthest reachable point.
    """
    jumps = 0
    current_jump_end = 0
    farthest = 0

    # We don't need to iterate the last element
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])

        # If we've reached the end of the current jump's range
        if i == current_jump_end:
            jumps += 1
            current_jump_end = farthest

            # Early exit if we can already reach the end
            if current_jump_end >= len(nums) - 1:
                break
    return jumps

# Time Complexity: O(n). Space Complexity: O(1).
```

```javascript
function jump(nums) {
  // LeetCode #45. Jump Game II
  let jumps = 0;
  let currentJumpEnd = 0;
  let farthest = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);

    if (i === currentJumpEnd) {
      jumps++;
      currentJumpEnd = farthest;

      if (currentJumpEnd >= nums.length - 1) break;
    }
  }
  return jumps;
}
// Time Complexity: O(n). Space Complexity: O(1).
```

```java
public int jump(int[] nums) {
    // LeetCode #45. Jump Game II
    int jumps = 0;
    int currentJumpEnd = 0;
    int farthest = 0;

    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);

        if (i == currentJumpEnd) {
            jumps++;
            currentJumpEnd = farthest;

            if (currentJumpEnd >= nums.length - 1) break;
        }
    }
    return jumps;
}
// Time Complexity: O(n). Space Complexity: O(1).
```

</div>

## How American Express Tests Greedy vs Other Companies

Compared to FAANG companies, American Express's Greedy questions are less about clever "aha!" moments and more about applying a known, logical optimization pattern to a business scenario. At Google or Meta, a Greedy problem might be deeply hidden within a complex graph or system design question. At Amex, the Greedy nature is often more apparent—the problem statement itself will hint at optimization, scheduling, or "minimum/maximum" outcomes.

The difficulty is typically in the **"Medium"** range on LeetCode. They prioritize **correct implementation and clear reasoning** over knowing the most obscure algorithm. You'll be expected to explain _why_ your greedy approach works. The unique aspect is the direct line you can draw from the algorithm to a plausible Amex use-case (e.g., "This is similar to optimizing the batch processing of daily transactions"). Making that connection in your interview shows strong product sense.

## Study Order

Tackle Greedy patterns in this logical sequence to build a solid foundation:

1.  **Basic "Take or Skip" Decisions:** Start with the simplest greedy proofs, like **Assign Cookies (LeetCode #455)** or **Lemonade Change (LeetCode #860)**. This builds intuition for making immediate optimal choices.
2.  **Interval Problems:** Move to scheduling—**Non-overlapping Intervals (#435)** and **Merge Intervals (#56)**. This is Amex's bread and butter. Mastering sorting by end time is crucial.
3.  **Array Sequence Manipulation:** Practice problems where you traverse an array making greedy decisions, like **Jump Game (#55)** and **Jump Game II (#45)**. This reinforces the idea of extending your reach step-by-step.
4.  **Partitioning & Assignment:** Tackle problems like **Task Scheduler (#621)** or **Partition Labels (#763)**. These combine greedy logic with basic data structures (heaps, hash maps).
5.  **Advanced/Proof-Intensive Greedy:** Finally, look at problems like **Gas Station (#134)** or **Candy (#135)**, where the greedy proof is more subtle and requires thinking from multiple angles.

## Recommended Practice Order

Solve these problems in sequence to progressively build and test your Amex-ready Greedy skills:

1.  **Assign Cookies (LeetCode #455)** - The simplest greedy proof.
2.  **Merge Intervals (LeetCode #56)** - Absolute fundamental. Write it flawlessly.
3.  **Non-overlapping Intervals (LeetCode #435)** - The flip side of #56, tests the same core sorting principle.
4.  **Jump Game (LeetCode #55)** - Can you reach the end?
5.  **Jump Game II (LeetCode #45)** - Minimum steps to reach the end (use the BFS-style greedy shown above).
6.  **Task Scheduler (LeetCode #621)** - A classic that combines greedy with a max-heap/counting.
7.  **Gas Station (LeetCode #134)** - An excellent Amex-style problem about completing a circuit with cost/profit. The greedy proof is key.

By following this focused path, you'll transform Greedy algorithms from a vague concept into a sharp tool, perfectly calibrated for the optimization challenges American Express loves to present.

[Practice Greedy at American Express](/company/american-express/greedy)
