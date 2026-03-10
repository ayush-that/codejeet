---
title: "Greedy Questions at JPMorgan: What to Expect"
description: "Prepare for Greedy interview questions at JPMorgan — patterns, difficulty breakdown, and study tips."
date: "2028-09-21"
category: "dsa-patterns"
tags: ["jpmorgan", "greedy", "interview prep"]
---

If you're preparing for a software engineering interview at JPMorgan, you might be surprised to see "Greedy" as a distinct topic in their problem frequency list. With 11 out of 78 tagged questions, it's not the largest category, but it's a significant one. Here's the insider perspective: at a quantitative finance giant like JPMorgan, greedy algorithms aren't just an academic exercise. They model real-world financial decision-making under constraints—optimal task scheduling for trade execution, minimizing cash idle time, or maximizing profit from a series of opportunities with limited capital. A greedy approach, which makes the locally optimal choice at each step hoping it leads to a global optimum, directly mirrors high-frequency, heuristic-driven logic used in trading systems and resource allocation. You won't get a PhD-level dynamic programming (DP) problem in a 45-minute interview, but a well-designed greedy question perfectly tests your ability to identify a simple, efficient rule for optimization. Expect to see it, especially in early-round coding screens and technical phone interviews.

## Specific Patterns JPMorgan Favors

JPMorgan's greedy problems tend to cluster around a few practical, finance-adjacent themes. You won't find many esoteric graph theory puzzles. Instead, focus on:

1.  **Interval Scheduling & Merging:** This is the single most important pattern. The core question is: given a set of time intervals (representing meetings, trades, or resource bookings), how do you schedule the maximum number of non-overlapping tasks? Or how do you merge overlapping ones to find free time? This maps directly to calendar management, batch processing, and clearinghouse operations.
2.  **"Jump Game" Variants:** Problems about reaching the end of an array with minimum jumps or determining if the end is reachable. This abstracts to liquidity problems or phased project completion.
3.  **Simple Assignment with Sorting:** Problems where the greedy choice becomes obvious after sorting the input by one key metric (like end time, price, or weight). The classic "Assign Cookies" (#455) is a prime example.

A problem like **Meeting Rooms II (#253)** is a quintessential JPMorgan-style greedy question. It's an interval problem that requires sorting and using a min-heap to track resources, blending greedy scheduling with a fundamental data structure.

<div class="code-group">

```python
# LeetCode #253: Meeting Rooms II - Greedy with Min-Heap
# Time: O(N log N) for sorting and heap operations | Space: O(N) for the heap
import heapq

def minMeetingRooms(intervals):
    if not intervals:
        return 0

    # Sort intervals by their start time (greedy: process in chronological order)
    intervals.sort(key=lambda x: x[0])

    # Min-heap to store the end times of meetings in currently used rooms.
    # The heap's size is the number of rooms needed.
    free_rooms = []

    # Greedy allocation: for each new meeting, check if the earliest ending meeting has finished.
    for start, end in intervals:
        # If the earliest ending meeting is done by the time this one starts, reuse that room.
        if free_rooms and free_rooms[0] <= start:
            heapq.heappop(free_rooms)  # Remove the finished meeting
        # Assign a new room (or the reused one) by adding the current meeting's end time.
        heapq.heappush(free_rooms, end)

    # The heap's size is the minimum rooms required.
    return len(free_rooms)
```

```javascript
// LeetCode #253: Meeting Rooms II - Greedy with Min-Heap
// Time: O(N log N) | Space: O(N)
function minMeetingRooms(intervals) {
  if (intervals.length === 0) return 0;

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  // Min-heap (using array and manual sort simulation, or use a library).
  // Here, we'll simulate with an array sorted to keep smallest end time at [0].
  const heap = [];

  for (const [start, end] of intervals) {
    // If the earliest ending meeting is over, free that room.
    if (heap.length > 0 && heap[0] <= start) {
      heap.shift(); // Remove smallest (O(n) here, but illustrates logic. Use a proper heap for O(log n)).
    }
    // Add current meeting's end time to heap.
    heap.push(end);
    heap.sort((a, b) => a - b); // Keep sorted as min-heap.
  }
  return heap.length;
}
```

```java
// LeetCode #253: Meeting Rooms II - Greedy with Min-Heap
// Time: O(N log N) | Space: O(N)
import java.util.Arrays;
import java.util.PriorityQueue;

public int minMeetingRooms(int[][] intervals) {
    if (intervals.length == 0) return 0;

    // Sort intervals by start time
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

    // Min-heap to store end times
    PriorityQueue<Integer> heap = new PriorityQueue<>();

    for (int[] interval : intervals) {
        int start = interval[0];
        int end = interval[1];
        // If the room with the earliest free time is available, reuse it
        if (!heap.isEmpty() && heap.peek() <= start) {
            heap.poll();
        }
        // Add the current meeting's end time to the heap
        heap.offer(end);
    }
    return heap.size();
}
```

</div>

## How to Prepare

Your study should be pattern-first, not problem-first. For greedy algorithms, the preparation mantra is: **"Prove to yourself why greedy works here."** Don't just memorize solutions.

1.  **Identify the Greedy Choice Property:** For each problem, ask: "What is the locally optimal decision I can make right now?" For intervals, it's often "pick the task that ends earliest." For jump games, it's "jump to the position that gives me the furthest future reach."
2.  **Master the Two-Step Template:** Most greedy solutions follow:
    - **Step 1:** Pre-process the data (usually sort it by a key attribute).
    - **Step 2:** Iterate through the sorted data, applying a simple rule and maintaining a counter or a data structure (like a heap).
3.  **Practice the Proof Sketch:** Be ready to verbally justify your approach. "This works because if we choose the meeting that ends earliest, we leave the maximum possible room for future meetings. Any other choice would not yield a better schedule."

Here's the pattern for another JPMorgan-favored type: the "Jump Game" (#55).

<div class="code-group">

```python
# LeetCode #55: Jump Game - Greedy Reachability
# Time: O(n) | Space: O(1)
def canJump(nums):
    """
    Greedy choice: Track the furthest index we can reach so far.
    If at any point our current index exceeds that reach, we're stuck.
    """
    max_reach = 0
    for i, jump_length in enumerate(nums):
        # If we've passed the furthest point we can reach, fail.
        if i > max_reach:
            return False
        # Greedily update the furthest point we can potentially reach.
        max_reach = max(max_reach, i + jump_length)
        # Early exit: if we can already reach the last index.
        if max_reach >= len(nums) - 1:
            return True
    return True  # The loop will only complete if we never hit the 'i > max_reach' condition.
```

```javascript
// LeetCode #55: Jump Game - Greedy Reachability
// Time: O(n) | Space: O(1)
function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    // If the current index is beyond our maximum reach, we cannot proceed.
    if (i > maxReach) return false;
    // Greedily update the farthest index we can jump to.
    maxReach = Math.max(maxReach, i + nums[i]);
    // If we can already reach the last index, we're done.
    if (maxReach >= nums.length - 1) return true;
  }
  return true;
}
```

```java
// LeetCode #55: Jump Game - Greedy Reachability
// Time: O(n) | Space: O(1)
public boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) {
            return false;
        }
        maxReach = Math.max(maxReach, i + nums[i]);
        if (maxReach >= nums.length - 1) {
            return true;
        }
    }
    return true;
}
```

</div>

## How JPMorgan Tests Greedy vs Other Companies

Compared to FAANG companies, JPMorgan's greedy questions are less about clever "aha!" moments and more about **applied business logic**. At Google, a greedy problem might be disguised in a complex graph scenario. At JPMorgan, the scenario is often explicitly about schedules, profits, or steps. The difficulty is typically medium; they want to see clean, efficient code and clear reasoning, not a groundbreaking algorithm.

The unique aspect is the **emphasis on correctness and edge cases**. In finance, an off-by-one error in an interval merge can mean double-booking a million-dollar asset. Expect interviewers to test edge cases rigorously: empty input, single element, large values, and sorted/unsorted inputs. Your code's robustness is as important as its algorithmic elegance.

## Study Order

Tackle greedy algorithms in this logical progression:

1.  **Fundamental "Take or Skip" Decisions:** Start with the simplest greedy premise, like **Assign Cookies (#455)** or **Lemonade Change (#860)**. This builds intuition for making immediate choices based on a condition.
2.  **Interval Scheduling:** Move to **Non-overlapping Intervals (#435)** and **Merge Intervals (#56)**. This is the core pattern. Understanding why sorting by end time works is critical.
3.  **"Jump Game" Family:** Solve **Jump Game (#55)** and then **Jump Game II (#45)**. This teaches you to maintain a "reach" variable, a common greedy tracking technique.
4.  **Greedy on Strings:** Problems like **Partition Labels (#763)** blend intervals and iteration, showing how greedy patterns appear in different data types.
5.  **Greedy with Data Structures:** Finally, tackle problems like **Meeting Rooms II (#253)** that require a heap or queue to implement the greedy choice efficiently. This combines pattern recognition with tool selection.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous concept.

1.  **Assign Cookies (#455)** - Basic sort-and-compare.
2.  **Merge Intervals (#56)** - The foundational interval operation.
3.  **Non-overlapping Intervals (#435)** - Classic interval scheduling.
4.  **Jump Game (#55)** - Simple reachability.
5.  **Partition Labels (#763)** - Intervals derived from a string.
6.  **Meeting Rooms II (#253)** - Interval scheduling with resource counting (the heap pattern).
7.  **Jump Game II (#45)** - Minimum steps, a slight twist on reachability.
8.  **Task Scheduler (#621)** - A more advanced greedy scheduling problem (good stretch goal).

Remember, the goal is not to solve hundreds of problems, but to deeply understand why a greedy approach is valid for these specific scenarios. At JPMorgan, articulating that "why" clearly will set you apart from candidates who just regurgitate code.

[Practice Greedy at JPMorgan](/company/jpmorgan/greedy)
