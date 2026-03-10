---
title: "Greedy Questions at Deutsche Bank: What to Expect"
description: "Prepare for Greedy interview questions at Deutsche Bank — patterns, difficulty breakdown, and study tips."
date: "2031-09-06"
category: "dsa-patterns"
tags: ["deutsche-bank", "greedy", "interview prep"]
---

If you're preparing for a Deutsche Bank technical interview, you've likely seen the statistic: roughly 5 out of their 21 tagged LeetCode problems are Greedy. That's about 24%, which is a significant chunk. But what does that _actually_ mean for your interview? It's not that Greedy is their sole obsession, but rather that it's a highly efficient filter. Greedy problems test a specific and valuable engineering mindset: the ability to make a series of locally optimal choices to arrive at a globally optimal solution. In a fast-paced financial environment where systems need to make real-time decisions on resource allocation, scheduling, or minimizing costs, this isn't just an algorithm—it's a daily operational principle. You can expect at least one Greedy question in most technical rounds, often as the first or second coding problem to assess your problem-solving intuition before diving into more complex data structures.

## Specific Patterns Deutsche Bank Favors

Deutsche Bank's Greedy problems aren't about obscure mathematical proofs. They favor applied, business-logic-adjacent patterns. You'll rarely see purely theoretical Greedy problems. Instead, they lean heavily on two core categories:

1.  **Interval Scheduling & Merging:** This is the undisputed king. Think about scheduling trades, booking meeting rooms, or allocating time-limited resources—all core banking operations. The pattern involves sorting intervals by their end (or start) time and making greedy choices about inclusion or merging.
2.  **"Can Place Flowers" / Simple Array Greedy:** These are problems where you traverse an array once, making a greedy decision at each step based on local neighbors. They test your ability to reason about simple states and edge cases without complex data structures.

You will see far less of the more complex Greedy patterns like Huffman coding or matroid theory. Their focus is on practical, intuitive greediness.

For example, **Meeting Rooms II (LeetCode #253)** is a classic. The greedy approach uses a min-heap to track meeting endings, directly modeling resource (room) allocation. **Merge Intervals (LeetCode #56)** is another staple, where sorting by start time and then merging overlapping intervals is the key greedy step. A problem like **Task Scheduler (LeetCode #621)**, while sometimes solved with a heap, has a famous greedy formula that they love because it's clever and efficient.

## How to Prepare

The biggest mistake candidates make with Greedy is trying to memorize solutions. You can't. You must learn to _recognize the property_ that makes a greedy choice safe. For interval problems, that property is often: "If we pick the interval that ends the earliest, we leave the most room for future intervals."

Let's look at the foundational pattern for the "Maximum Number of Non-Overlapping Intervals" problem (a variant of LeetCode #435). The greedy choice is to always pick the interval with the earliest end time.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    Finds the max number of non-overlapping intervals.
    LeetCode #435: Non-overlapping Intervals
    """
    if not intervals:
        return 0

    # The Greedy Choice: Sort by end time
    intervals.sort(key=lambda x: x[1])

    count = 1  # We will always take the first interval (earliest end)
    last_end = intervals[0][1]

    for start, end in intervals[1:]:
        # If this interval starts after or when the last one ended, take it
        if start >= last_end:
            count += 1
            last_end = end  # Update the tracker to this new interval's end

    return count

# Time Complexity: O(n log n) due to sorting. The loop is O(n).
# Space Complexity: O(1) or O(log n) depending on sorting algorithm.
```

```javascript
function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;

  // The Greedy Choice: Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 1;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start >= lastEnd) {
      count++;
      lastEnd = end;
    }
  }
  return count;
}

// Time Complexity: O(n log n) due to sorting. The loop is O(n).
// Space Complexity: O(1) or O(log n) for sorting space.
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    if (intervals.length == 0) return 0;

    // The Greedy Choice: Sort by end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 1;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];
        if (start >= lastEnd) {
            count++;
            lastEnd = end;
        }
    }
    return count;
}

// Time Complexity: O(n log n) due to sorting. The loop is O(n).
// Space Complexity: O(log n) for the sorting algorithm's recursion stack.
```

</div>

For the simpler array-based greedy problems, the pattern is about careful traversal and state checking. Here's the essence of the "Can Place Flowers" (LeetCode #605) logic:

<div class="code-group">

```python
def canPlaceFlowers(flowerbed, n):
    """
    Greedy check at each plot.
    LeetCode #605: Can Place Flowers
    """
    count = 0
    length = len(flowerbed)

    for i in range(length):
        # Check if current plot is empty and its neighbors are empty (or out of bounds)
        if flowerbed[i] == 0:
            empty_left = (i == 0) or (flowerbed[i - 1] == 0)
            empty_right = (i == length - 1) or (flowerbed[i + 1] == 0)

            if empty_left and empty_right:
                flowerbed[i] = 1  # Greedy placement
                count += 1
                if count >= n:
                    return True
                # Skip the next plot as we just planted here
                i += 1  # Note: the for loop increment will add another 1
    return count >= n

# Time Complexity: O(n), single pass.
# Space Complexity: O(1).
```

```javascript
function canPlaceFlowers(flowerbed, n) {
  let count = 0;
  const length = flowerbed.length;

  for (let i = 0; i < length; i++) {
    if (flowerbed[i] === 0) {
      const emptyLeft = i === 0 || flowerbed[i - 1] === 0;
      const emptyRight = i === length - 1 || flowerbed[i + 1] === 0;

      if (emptyLeft && emptyRight) {
        flowerbed[i] = 1; // Greedy placement
        count++;
        if (count >= n) return true;
        i++; // Skip the next plot
      }
    }
  }
  return count >= n;
}

// Time Complexity: O(n), single pass.
// Space Complexity: O(1).
```

```java
public boolean canPlaceFlowers(int[] flowerbed, int n) {
    int count = 0;
    int length = flowerbed.length;

    for (int i = 0; i < length; i++) {
        if (flowerbed[i] == 0) {
            boolean emptyLeft = (i == 0) || (flowerbed[i - 1] == 0);
            boolean emptyRight = (i == length - 1) || (flowerbed[i + 1] == 0);

            if (emptyLeft && emptyRight) {
                flowerbed[i] = 1; // Greedy placement
                count++;
                if (count >= n) return true;
                i++; // Skip the next plot
            }
        }
    }
    return count >= n;
}

// Time Complexity: O(n), single pass.
// Space Complexity: O(1).
```

</div>

## How Deutsche Bank Tests Greedy vs Other Companies

At major pure-tech companies (FAANG), Greedy problems often serve as a medium-difficulty warm-up or are woven into more complex graph/Dynamic Programming problems. They might test more exotic Greedy proofs. At Deutsche Bank, the style is different:

- **Practical Focus:** The problem statement will often be thinly-veiled business logic. "Schedule the most meetings" becomes "execute the most trades within the arbitrage window."
- **Difficulty Ceiling:** They rarely go beyond Medium difficulty. The challenge isn't in implementing a complex data structure, but in _identifying_ that a greedy approach works and then handling all edge cases flawlessly.
- **Communication Weight:** They place a higher premium on you explaining _why_ your greedy choice is correct. Be prepared to walk through a small example and justify that no other choice would be better. This tests communication skills vital for client-facing or cross-team roles.
- **Follow-ups:** A common follow-up is to modify constraints. "What if each interval had a weight?" This gently pushes you towards recognizing where Greedy breaks down and Dynamic Programming would be needed, showing you understand the algorithm's limits.

## Study Order

Don't jump into the hardest labeled Greedy problems. Build intuition progressively.

1.  **Foundational Array Greedy:** Start with problems where the greedy choice is obvious and the traversal is simple (e.g., Best Time to Buy and Sell Stock II #122). This builds confidence.
2.  **Basic Interval Scheduling:** Learn the "sort by end time" pattern for non-overlapping intervals (#435). This is the single most important Greedy pattern for Deutsche Bank.
3.  **Interval Merging & Coverage:** Move to merging overlapping intervals (#56) and checking if you can cover a range (#55 Jump Game, #452 Minimum Number of Arrows to Burst Balloons). These are variations on the core interval theme.
4.  **Simple Scheduling with Heaps:** Introduce the min-heap to handle resource scheduling (Meeting Rooms II #253). This combines Greedy with a basic data structure.
5.  **"Clever Formula" Greedy:** Finally, tackle problems like Task Scheduler (#621) or Gas Station (#134), where the greedy approach involves a non-obvious insight or formula. These test your ability to derive a pattern.

## Recommended Practice Order

Solve these problems in sequence. Each one builds on the intuition of the last or introduces a slight twist.

1.  **Best Time to Buy and Sell Stock II (LeetCode #122)** - The simplest greedy intuition.
2.  **Maximum Subarray (LeetCode #53)** - Kadane's algorithm (a form of greedy/dp).
3.  **Merge Intervals (LeetCode #56)** - Foundational interval manipulation.
4.  **Non-overlapping Intervals (LeetCode #435)** - Core Deutsche Bank pattern.
5.  **Meeting Rooms II (LeetCode #253)** - Greedy + heap for resource scheduling.
6.  **Minimum Number of Arrows to Burst Balloons (LeetCode #452)** - A clever twist on the interval pattern.
7.  **Task Scheduler (LeetCode #621)** - The "clever formula" greedy problem to round out your prep.

Master this progression, and you'll walk into your Deutsche Bank interview able to not only code the solution but also articulate the business logic behind the greedy choice—exactly what they're looking for.

[Practice Greedy at Deutsche Bank](/company/deutsche-bank/greedy)
