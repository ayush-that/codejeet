---
title: "Greedy Questions at PayPal: What to Expect"
description: "Prepare for Greedy interview questions at PayPal — patterns, difficulty breakdown, and study tips."
date: "2028-05-14"
category: "dsa-patterns"
tags: ["paypal", "greedy", "interview prep"]
---

Greedy algorithms are deceptive. They look simple — just make the locally optimal choice at each step — but they’re one of the most common places where strong candidates stumble in interviews. At PayPal, with 12 out of their 106 tagged questions being Greedy, it’s not the largest category, but it’s a critical one. Why? Because PayPal’s engineering problems often involve optimizing resources, scheduling transactions, or minimizing costs in financial systems. A greedy approach is frequently the elegant, efficient solution to these real-world scenarios. In interviews, a Greedy question might not always be labeled as such; it often appears disguised as an array, string, or interval problem. The key is recognizing when a greedy choice property holds.

## Specific Patterns PayPal Favors

PayPal’s Greedy problems tend to cluster around a few practical themes. You won’t see overly abstract or purely mathematical greedy puzzles here. Instead, focus on:

1.  **Interval Scheduling and Merging:** This is huge. Think about scheduling transactions, batching processes, or managing time-bound events. The classic "pick the most non-overlapping intervals" or "merge overlapping intervals" pattern is directly applicable to financial processing.
2.  **Array Partitioning and Ordering:** Problems where you need to rearrange or partition data to minimize or maximize a sum, often related to load balancing or resource allocation.
3.  **String Manipulation with Lexicographic Goals:** Creating the smallest or largest string under certain constraints, which can mirror generating transaction IDs or serial numbers in a sorted manner.

For example, **Meeting Rooms II (LeetCode #253)** is a classic interval scheduling problem that tests if you can find the minimum number of resources (like servers) needed for concurrent events. **Task Scheduler (LeetCode #621)** is another favorite that combines greedy scheduling with priority queue thinking to minimize idle time. **Partition Labels (LeetCode #763)** is a perfect example of a greedy array partition problem that feels very relevant to segmenting data streams.

## How to Prepare

The single most important skill for Greedy problems is **proof-of-concept intuition**. You must be able to argue, if only to yourself, _why_ making the greedy choice at each step leads to a globally optimal solution. For interval problems, this often means sorting first.

Let’s look at the core pattern for "Maximum Number of Non-Overlapping Intervals" (the essence of LeetCode #435 and #452). The greedy strategy is to always pick the interval that ends the earliest, as it leaves the most room for future intervals.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    LeetCode #435: Non-overlapping Intervals
    Goal: Find min intervals to remove to make the rest non-overlapping.
    Greedy choice: Keep the interval with the earliest end time.
    Time: O(n log n) for sorting | Space: O(1) (or O(n) if sorting uses extra space)
    """
    if not intervals:
        return 0

    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    last_end = intervals[0][1]

    # Start from the second interval
    for start, end in intervals[1:]:
        if start < last_end:  # Overlaps with the last kept interval
            count += 1        # We need to remove this current interval
        else:
            # No overlap, we can keep this interval. Update the last end.
            last_end = end

    return count
```

```javascript
function eraseOverlapIntervals(intervals) {
  // Time: O(n log n) | Space: O(1) (sorting in-place, but sort may use O(n) space)
  if (intervals.length === 0) return 0;

  // Sort by ending time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start < lastEnd) {
      // Overlaps, we remove this interval
      count++;
    } else {
      // No overlap, we can keep it. Update the last ending time.
      lastEnd = end;
    }
  }
  return count;
}
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    // Time: O(n log n) | Space: O(1) (ignoring sorting space)
    if (intervals.length == 0) return 0;

    // Sort intervals by ending time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];
        if (start < lastEnd) {
            // Overlap, remove current interval
            count++;
        } else {
            // No overlap, update the last ending time we are tracking
            lastEnd = end;
        }
    }
    return count;
}
```

</div>

For array partitioning problems like **Partition Labels (LeetCode #763)**, the greedy strategy is to extend your current partition until you've seen all occurrences of every character within it.

<div class="code-group">

```python
def partitionLabels(s):
    """
    LeetCode #763: Partition Labels
    Goal: Split string into most parts so each letter appears in at most one part.
    Greedy choice: Extend the current partition to the last index of all chars in it.
    Time: O(n) | Space: O(1) (the last_index map is at most size 26)
    """
    # First pass: record the last occurrence index of each character
    last_index = {char: i for i, char in enumerate(s)}

    result = []
    start = 0
    end = 0

    # Second pass: greedily extend the partition
    for i, char in enumerate(s):
        end = max(end, last_index[char])  # Extend the boundary if needed
        if i == end:  # We've reached the end of the current partition
            result.append(end - start + 1)
            start = i + 1  # Start the next partition
    return result
```

```javascript
function partitionLabels(s) {
  // Time: O(n) | Space: O(1) (lastIndex map is bounded by alphabet)
  const lastIndex = new Map();
  for (let i = 0; i < s.length; i++) {
    lastIndex.set(s[i], i);
  }

  const result = [];
  let start = 0;
  let end = 0;

  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, lastIndex.get(s[i]));
    if (i === end) {
      result.push(end - start + 1);
      start = i + 1;
    }
  }
  return result;
}
```

```java
public List<Integer> partitionLabels(String s) {
    // Time: O(n) | Space: O(1) (lastIndex array of size 26)
    int[] lastIndex = new int[26];
    for (int i = 0; i < s.length(); i++) {
        lastIndex[s.charAt(i) - 'a'] = i;
    }

    List<Integer> result = new ArrayList<>();
    int start = 0;
    int end = 0;

    for (int i = 0; i < s.length(); i++) {
        end = Math.max(end, lastIndex[s.charAt(i) - 'a']);
        if (i == end) {
            result.add(end - start + 1);
            start = i + 1;
        }
    }
    return result;
}
```

</div>

## How PayPal Tests Greedy vs Other Companies

Compared to companies like Google or Meta, which might use Greedy as a component in a complex graph or system design problem, PayPal's Greedy questions are often more self-contained and directly tied to a clear business logic. The difficulty is usually medium. The "trick" isn't in complex data structure manipulation, but in the initial insight that a greedy approach is valid and correct.

What's unique is the **context**. A problem about merging intervals might be framed as "consolidating overlapping transaction validation windows." A problem about assigning cookies (LeetCode #455) might be framed as matching customer request sizes to available server capacities. You need to translate the business narrative into the underlying algorithmic pattern quickly.

## Study Order

Don't jump into hard Greedy problems. Build your intuition systematically.

1.  **Fundamental Proofs & Sorting:** Start with the classic "Activity Selection" problem. Understand why sorting by end time works. This builds your foundational greedy proof muscle.
2.  **Simple Array Greedy:** Move to problems like **Assign Cookies (#455)** or **Lemonade Change (#860)**. These have very straightforward local choice rules.
3.  **Interval Problems:** Now tackle the core PayPal pattern: **Non-overlapping Intervals (#435)**, **Minimum Number of Arrows to Burst Balloons (#452)**, and **Meeting Rooms II (#253)**. These all use the same sorted-by-end-time skeleton.
4.  **String-Based Greedy:** Practice **Partition Labels (#763)** and **Valid Parenthesis String (#678)**. These require tracking boundaries or counts greedily.
5.  **Advanced/Combination Patterns:** Finally, look at problems like **Task Scheduler (#621)** (greedy + priority queue) or **Gas Station (#134)** (greedy with a circuit). These test if you can identify the greedy core within a more complex setup.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the intuition of the last.

1.  **Assign Cookies (LeetCode #455)** - The simplest form of "give the smallest sufficient resource."
2.  **Non-overlapping Intervals (LeetCode #435)** - Master the interval sorting pattern.
3.  **Minimum Number of Arrows to Burst Balloons (LeetCode #452)** - A slight twist on #435. Solidifies the pattern.
4.  **Partition Labels (LeetCode #763)** - Shifts context to strings but uses similar boundary extension logic.
5.  **Task Scheduler (LeetCode #621)** - Introduces the need for a priority queue to efficiently find the next best greedy choice.
6.  **Gas Station (LeetCode #134)** - A classic circuit problem that has a clever greedy proof. Good for testing deeper understanding.

Remember, at PayPal, the goal isn't just to solve it. Be prepared to explain _why_ your greedy solution is optimal, as if you were justifying a design decision to a colleague. That's what separates a working coder from a trusted engineer.

[Practice Greedy at PayPal](/company/paypal/greedy)
