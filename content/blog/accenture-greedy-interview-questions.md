---
title: "Greedy Questions at Accenture: What to Expect"
description: "Prepare for Greedy interview questions at Accenture — patterns, difficulty breakdown, and study tips."
date: "2028-01-19"
category: "dsa-patterns"
tags: ["accenture", "greedy", "interview prep"]
---

# Greedy Questions at Accenture: What to Expect

If you're preparing for a software engineering interview at Accenture, you might have noticed that Greedy algorithms represent a small but significant slice of their problem catalog—10 out of 144 total questions. This ratio is telling. It means you won't be grilled exclusively on Greedy techniques, but you absolutely must be prepared for them. In my experience conducting and analyzing interviews, Greedy questions at Accenture serve a specific purpose: they are less about testing if you've memorized a particular algorithm and more about evaluating your problem-solving intuition and your ability to justify a locally optimal choice. They want to see if you can recognize when a simple, step-by-step approach is sufficient and, crucially, if you can articulate _why_ it works. Missing the "why" is where many candidates stumble.

## Specific Patterns Accenture Favors

Accenture's Greedy problems tend to cluster around practical, business-logic scenarios rather than abstract mathematical puzzles. You're more likely to see problems about scheduling, resource allocation, or maximizing profit under constraints—situations that mirror the kind of optimization challenges their consultants and engineers solve for clients.

The most frequent patterns I've observed are:

1.  **Interval Scheduling:** This is the classic "maximum number of non-overlapping intervals" problem and its variants. It tests if you can sort by end times and make the greedy choice of picking the next available interval that finishes the earliest.
2.  **Assign/Candy Problems:** These involve distributing resources (like meeting rooms, tasks, or candy) according to a rule set, often requiring a two-pass greedy approach to satisfy constraints from both directions.
3.  **Jump Game & Minimum Increments:** Problems that ask for the minimum number of steps or increments to reach a goal. The greedy logic here involves always taking the step that gives you the furthest _reach_ or addressing the most urgent deficit first.

For example, **Non-overlapping Intervals (LeetCode #435)** is a quintessential Accenture-style problem. It's a clean application of the interval scheduling pattern. **Candy (LeetCode #135)** is another favorite because it requires a nuanced two-directional greedy pass. You'll rarely see esoteric Greedy problems like Huffman coding; the focus is on applicable logic.

## How to Prepare

The key to Greedy algorithms is not just implementation, but proof of concept. For each problem type, you must internalize the _greedy choice property_ and _optimal substructure_. Your study should follow this pattern: 1) Identify the candidate choices, 2) Determine the selection rule (sort by what?), 3) Prove to yourself (and later, to your interviewer) why the greedy choice leads to a global optimum.

Let's look at the core pattern for Interval Scheduling. The algorithm is straightforward, but your explanation is what matters.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    LeetCode #435: Non-overlapping Intervals
    Greedy choice: Always pick the interval that ends the earliest.
    This leaves the most room for future intervals.
    Time: O(n log n) for sorting | Space: O(1) (or O(n) if sorting in-place isn't possible)
    """
    if not intervals:
        return 0

    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    last_end = intervals[0][1]

    # Start from the second interval
    for start, end in intervals[1:]:
        if start < last_end:
            # Overlaps with the last kept interval
            count += 1
        else:
            # No overlap, update the last end to this interval's end
            last_end = end

    return count
```

```javascript
function eraseOverlapIntervals(intervals) {
  // LeetCode #435: Non-overlapping Intervals
  // Greedy choice: Always pick the interval that ends the earliest.
  // Time: O(n log n) | Space: O(1) (or O(log n) for sort stack)
  if (intervals.length === 0) return 0;

  // Sort intervals by their end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start < lastEnd) {
      // Overlaps with the last kept interval
      count++;
    } else {
      // No overlap, update the last end
      lastEnd = end;
    }
  }
  return count;
}
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    // LeetCode #435: Non-overlapping Intervals
    // Greedy choice: Always pick the interval that ends the earliest.
    // Time: O(n log n) | Space: O(log n) for sorting (quicksort stack)
    if (intervals.length == 0) return 0;

    // Sort intervals by their end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];
        if (start < lastEnd) {
            // Overlaps with the last kept interval
            count++;
        } else {
            // No overlap, update the last end
            lastEnd = end;
        }
    }
    return count;
}
```

</div>

For the two-pass greedy pattern, **Candy (LeetCode #135)** is the model. The trick is to satisfy left-to-right constraints, then right-to-left constraints, taking the maximum.

<div class="code-group">

```python
def candy(ratings):
    """
    LeetCode #135: Candy
    Greedy approach: Two passes.
    1. Left to right: Give more candy if rating is higher than left neighbor.
    2. Right to left: Give more candy if rating is higher than right neighbor,
       taking the max of current candy and new requirement.
    Time: O(n) | Space: O(n) for the candy array.
    """
    n = len(ratings)
    candies = [1] * n  # Every child must have at least one candy

    # Left to right pass
    for i in range(1, n):
        if ratings[i] > ratings[i-1]:
            candies[i] = candies[i-1] + 1

    # Right to left pass
    for i in range(n-2, -1, -1):
        if ratings[i] > ratings[i+1]:
            candies[i] = max(candies[i], candies[i+1] + 1)

    return sum(candies)
```

```javascript
function candy(ratings) {
  // LeetCode #135: Candy
  // Time: O(n) | Space: O(n)
  const n = ratings.length;
  const candies = new Array(n).fill(1); // Every child must have at least one

  // Left to right pass
  for (let i = 1; i < n; i++) {
    if (ratings[i] > ratings[i - 1]) {
      candies[i] = candies[i - 1] + 1;
    }
  }

  // Right to left pass
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) {
      candies[i] = Math.max(candies[i], candies[i + 1] + 1);
    }
  }

  // Sum the candies
  return candies.reduce((a, b) => a + b, 0);
}
```

```java
public int candy(int[] ratings) {
    // LeetCode #135: Candy
    // Time: O(n) | Space: O(n)
    int n = ratings.length;
    int[] candies = new int[n];
    Arrays.fill(candies, 1); // Every child must have at least one

    // Left to right pass
    for (int i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) {
            candies[i] = candies[i - 1] + 1;
        }
    }

    // Right to left pass
    for (int i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) {
            candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
    }

    // Sum the candies
    int total = 0;
    for (int candy : candies) {
        total += candy;
    }
    return total;
}
```

</div>

## How Accenture Tests Greedy vs Other Companies

Compared to FAANG companies, Accenture's Greedy questions are often more "disguised." At a company like Google, you might get a pure algorithm problem like **Jump Game II (LeetCode #45)** where the greedy nature is front and center. At Accenture, the same greedy principle (always jump to the position that gives you the furthest reach) might be wrapped in a business narrative—like minimizing the number of project phases or server hops.

The difficulty is generally moderate. They are less interested in you deriving a complex greedy proof on the spot and more interested in you applying a known pattern to a new scenario and communicating your reasoning clearly. The "soft" skill of explaining your approach is weighted heavily, reflecting the client-facing and collaborative nature of much of Accenture's work.

## Study Order

Don't dive into the hardest problems first. Build your intuition systematically.

1.  **Foundational Sorting & Selection:** Start with the simplest greedy idea: sorting. Problems like **Meeting Rooms (LeetCode #252)** or **Largest Number (LeetCode #179)** teach you that the greedy choice often starts with putting data in the right order.
2.  **Classic Interval Scheduling:** Move to **Non-overlapping Intervals (#435)** and **Merge Intervals (#56)**. This establishes the pattern of sorting by one dimension (usually end time) and making sequential choices.
3.  **Two-Pass Greedy:** Tackle **Candy (#135)**. This introduces the concept of satisfying multiple, potentially conflicting constraints with separate passes.
4.  **Jump Game Variants:** Solve **Jump Game (#55)** and **Jump Game II (#45)**. This pattern is about maximizing your immediate "reach" or "coverage."
5.  **Assignment & Partitioning:** Finally, approach problems like **Task Scheduler (#621)** or **Partition Labels (#763)**. These combine greedy selection with more complex data structures or counting logic.

## Recommended Practice Order

Solve these problems in sequence to build competency:

1.  **Meeting Rooms (LeetCode #252)** - The simplest "check if possible" interval problem.
2.  **Non-overlapping Intervals (LeetCode #435)** - The core interval scheduling pattern.
3.  **Merge Intervals (LeetCode #56)** - A slight twist on the interval theme.
4.  **Candy (LeetCode #135)** - Master the two-pass technique.
5.  **Jump Game (LeetCode #55)** - Understand the concept of "farthest reach."
6.  **Jump Game II (LeetCode #45)** - Apply the "farthest reach" to minimize steps.
7.  **Partition Labels (LeetCode #763)** - A excellent problem that combines greedy partitioning with hash map tracking.
8.  **Task Scheduler (LeetCode #621)** - A more advanced problem that uses greedy prioritization with a heap (bridging greedy and heap concepts).

By following this path, you'll move from recognizing the greedy choice to justifying it and finally to applying it in increasingly complex scenarios—exactly the progression an Accenture interviewer hopes to see.

[Practice Greedy at Accenture](/company/accenture/greedy)
