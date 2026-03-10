---
title: "Sorting Questions at Agoda: What to Expect"
description: "Prepare for Sorting interview questions at Agoda — patterns, difficulty breakdown, and study tips."
date: "2029-09-14"
category: "dsa-patterns"
tags: ["agoda", "sorting", "interview prep"]
---

When you see that 11 out of 46 of Agoda's technical interview questions are tagged as Sorting, your first instinct might be to panic and start grinding every sorting algorithm under the sun. Don't. That number is a bit misleading. In reality, Agoda, like most modern tech companies, rarely asks you to implement a textbook sorting algorithm like quicksort or mergesort from scratch. The "Sorting" tag is a catch-all for a much more important and subtle skill: **using sorting as a pre-processing step to unlock an efficient solution.**

At Agoda, a travel and e-commerce platform, the core engineering challenges revolve around data—searching, filtering, and ranking hotels, flights, and activities. The underlying operations often require ordering data efficiently. Therefore, interviewers use these problems to test if you can recognize when sorting transforms an intractable O(n²) brute-force approach into an elegant O(n log n) one. It's not about the sort itself; it's about your ability to see the structure in a problem.

## Specific Patterns Agoda Favors

Agoda's sorting questions consistently lean toward two specific, practical patterns. You won't find abstract algorithm theory here; you'll find problems that mirror real-world data processing tasks.

1.  **The "Sort Then Greedy/Two-Pointer" Pattern:** This is the undisputed champion. The problem presents a collection of items (intervals, tasks, people) and asks for an optimal arrangement, selection, or merging. The brute-force solution is messy. The insight is that if you sort by a key attribute (start time, end time, value), a simple linear scan with a greedy rule or two pointers becomes possible.
    - **Prime Example:** **Merge Intervals (LeetCode #56)**. Sorting by the start time is the only way to efficiently merge overlapping intervals. This pattern is fundamental for anything dealing with schedules or ranges—think booking systems.
    - **Other Agoda-relevant examples:** **Non-overlapping Intervals (LeetCode #435)**, **Meeting Rooms II (LeetCode #253)**. These test your ability to not just merge, but to optimize schedules with limited resources (e.g., meeting rooms, agent bandwidth).

2.  **The "Custom Sort for Grouping/Ordering" Pattern:** Here, sorting isn't just pre-processing; it's the core logic. You're asked to arrange items according to a specific, often multi-faceted, rule. The solution is to implement a custom comparator.
    - **Prime Example:** **Largest Number (LeetCode #179)**. You don't sort by numeric value; you sort by the concatenated result of two numbers (`'3' + '30' = '330'` vs `'30' + '3' = '303'`). This tests if you can derive the correct sorting key from the problem statement.
    - **Agoda Context:** This directly relates to ranking search results. How do you sort a list of hotels given multiple criteria (price, rating, proximity)? You write a comparator that encodes the business logic.

## How to Prepare

Your preparation should focus on mastering the implementation of these patterns, not memorizing sorting algorithms. The key is to be fluent with your language's sorting function and comparator syntax.

Let's look at the **"Sort Then Two-Pointer"** pattern using the classic Merge Intervals problem.

<div class="code-group">

```python
def merge(intervals):
    """
    Merges all overlapping intervals.
    Time: O(n log n) - due to sorting.
    Space: O(n) - for the output list (or O(log n) for sort space, depending on language).
    """
    if not intervals:
        return []

    # 1. SORT by the start time. This is the key insight.
    intervals.sort(key=lambda x: x[0])

    merged = []
    # 2. Initialize with the first interval
    current_start, current_end = intervals[0]

    for next_start, next_end in intervals[1:]:
        # 3. If the next interval overlaps with the current, merge them.
        if next_start <= current_end:
            current_end = max(current_end, next_end)
        else:
            # 4. No overlap? Add the current merged interval and move on.
            merged.append([current_start, current_end])
            current_start, current_end = next_start, next_end

    # 5. Don't forget the last interval
    merged.append([current_start, current_end])
    return merged
```

```javascript
function merge(intervals) {
  if (intervals.length === 0) return [];

  // 1. SORT by start time.
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [];
  let [currentStart, currentEnd] = intervals[0];

  // 2. Linear scan with two-pointer logic (current interval vs. next).
  for (let i = 1; i < intervals.length; i++) {
    const [nextStart, nextEnd] = intervals[i];

    if (nextStart <= currentEnd) {
      // Overlap: merge by extending the end if needed.
      currentEnd = Math.max(currentEnd, nextEnd);
    } else {
      // No overlap: push current interval and move pointer.
      merged.push([currentStart, currentEnd]);
      [currentStart, currentEnd] = [nextStart, nextEnd];
    }
  }

  merged.push([currentStart, currentEnd]);
  return merged;
  // Time: O(n log n) | Space: O(n) for output.
}
```

```java
import java.util.*;

public class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length == 0) return new int[0][];

        // 1. SORT by start time using a custom comparator.
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        int currentStart = intervals[0][0];
        int currentEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            int nextStart = intervals[i][0];
            int nextEnd = intervals[i][1];

            if (nextStart <= currentEnd) {
                // Overlap
                currentEnd = Math.max(currentEnd, nextEnd);
            } else {
                // No overlap
                merged.add(new int[]{currentStart, currentEnd});
                currentStart = nextStart;
                currentEnd = nextEnd;
            }
        }
        merged.add(new int[]{currentStart, currentEnd});

        return merged.toArray(new int[merged.size()][]);
        // Time: O(n log n) | Space: O(n) for output (O(log n) for sort space).
    }
}
```

</div>

For the **Custom Sort** pattern, the syntax of the comparator is critical. Practice it until it's second nature.

## How Agoda Tests Sorting vs Other Companies

Compared to FAANG companies, Agoda's sorting problems tend to be more **applied and less algorithmic**. At Google, you might get a sorting problem that is a thin disguise for a tricky divide-and-conquer or counting strategy. At Agoda, the link to a practical business scenario—scheduling, ranking, batching tasks—is usually more apparent.

The difficulty is consistent with the upper-mid range of LeetCode (Medium). You are unlikely to see a "Hard" problem that is purely about sorting. The challenge comes from correctly identifying _that_ sorting is the key and then implementing the subsequent linear logic flawlessly. They test for clean, bug-free code that handles edge cases (empty input, single element, fully overlapping intervals).

## Study Order

Tackle this topic in this order to build understanding progressively:

1.  **Fundamental Comparator Syntax:** Before anything else, learn how to write a custom sort function in your chosen language. How do you sort descending? How do you sort by a tuple of values (e.g., sort by price, then by rating)?
2.  **Basic "Sort Then Solve" Patterns:** Start with **Two Sum (LeetCode #1)** using a hash map (not sorting), then solve it using the two-pointer technique _after sorting_. This teaches you the trade-off: sorting gives you a different, often more memory-efficient, way to solve a problem.
3.  **Interval Problems:** This is the core of Agoda's focus. Master Merge Intervals (#56) and Non-overlapping Intervals (#435). They are variations of the same pattern.
4.  **Greedy Scheduling:** Move to problems like Meeting Rooms II (#253) which uses sorting plus a min-heap (a "sort plus greedy with a data structure" pattern). This is a natural progression.
5.  **Advanced Custom Sorting:** Finally, tackle problems like Largest Number (#179) where the entire logic is embedded in a non-obvious comparator. This solidifies your understanding that sorting can _be_ the algorithm.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous one.

1.  **Two Sum (LeetCode #1)** - Solve it with two pointers after sorting. Ignore the hash map solution for this exercise.
2.  **Merge Intervals (LeetCode #56)** - The foundational pattern.
3.  **Non-overlapping Intervals (LeetCode #435)** - A direct variation. If you can merge, you can find the minimum to remove.
4.  **Meeting Rooms II (LeetCode #253)** - Introduces the heap to manage multiple "active" items after sorting.
5.  **Largest Number (LeetCode #179)** - The pure custom comparator test.
6.  **Sort Colors (LeetCode #75)** - A different beast: this is about partitioning _in-place_ in O(n) time (Dutch National Flag). It tests if you understand that not every "sorting" problem uses `sort()`.

Remember, at Agoda, sorting is a tool for organization, not an end in itself. Your goal is to walk into the interview and, when presented with a data-heavy problem, immediately ask yourself: "Would ordering this data simplify my logic?" If the answer is yes, you're already halfway to the solution.

[Practice Sorting at Agoda](/company/agoda/sorting)
