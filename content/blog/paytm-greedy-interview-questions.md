---
title: "Greedy Questions at Paytm: What to Expect"
description: "Prepare for Greedy interview questions at Paytm — patterns, difficulty breakdown, and study tips."
date: "2030-10-31"
category: "dsa-patterns"
tags: ["paytm", "greedy", "interview prep"]
---

Greedy algorithms are a core part of Paytm's technical interviews, representing about 17% of their problem pool. For a company handling real-time payments, logistics, and financial services, the ability to choose the optimal immediate action is directly applicable. Greedy strategies are essential for problems like scheduling transactions for maximum throughput, minimizing cash handling delays, or optimizing resource allocation for server requests—all scenarios where a locally optimal choice leads to a globally efficient system. Mastering these questions demonstrates you can think about efficiency and scalability, which are critical for Paytm's high-volume platforms.

## What to Expect — Types of Problems

Paytm's greedy questions typically fall into predictable categories that test your ability to recognize when a greedy choice property holds. You won't encounter overly abstract puzzles; the problems are grounded in practical optimization.

- **Interval Scheduling:** This is a classic. You might be asked to find the maximum number of non-overlapping intervals (e.g., meeting rooms, transaction batches) or the minimum number of resources to schedule all intervals (e.g., payment gateways). The standard approach is to sort by end time.
- **Coin Change / Minimum Operations:** While the canonical coin change is dynamic programming, Paytm often asks variants where the greedy approach _does_ work, such as finding the minimum number of notes/coins for an amount given standard Indian denominations (which have the greedy property). It tests your understanding of when greedy is applicable.
- **Assignment & Partitioning:** Problems like assigning tasks to workers for minimum total time or splitting an array into segments with maximum/minimum sum constraints. These require clever sorting and accumulation.
- **String Manipulation:** Tasks like minimum deletions to make a string palindrome or unique often have a greedy solution using frequency counts or two-pointer techniques.

The key is to quickly identify the sorting criteria (by end time, start time, value, or cost) and prove to yourself that a step-by-step optimal choice is valid.

## How to Prepare — Study Tips with One Code Example

Start by solidifying the theory. Understand the hallmarks of a greedy problem: optimal substructure and the greedy choice property. Then, move to pattern recognition. Don't just solve problems; categorize them. For each problem you practice, ask: "What is the sorting key?" and "Why is the greedy choice safe?"

A fundamental pattern is **"Earliest End Time"** for interval problems. The logic is to always pick the next event that finishes the soonest, freeing up resources for more events later.

<div class="code-group">

```python
def max_non_overlapping_intervals(intervals):
    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])
    count = 0
    last_end = -float('inf')

    for start, end in intervals:
        if start >= last_end:  # Non-overlapping condition
            count += 1
            last_end = end
    return count

# Example: intervals = [[1,3], [2,4], [3,5]]
# Output: 2 ([1,3] and [3,5])
```

```javascript
function maxNonOverlappingIntervals(intervals) {
  // Sort intervals by their end time
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let lastEnd = -Infinity;

  for (const [start, end] of intervals) {
    if (start >= lastEnd) {
      count++;
      lastEnd = end;
    }
  }
  return count;
}
```

```java
import java.util.Arrays;

public class Solution {
    public int maxNonOverlappingIntervals(int[][] intervals) {
        // Sort intervals by their end time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        int count = 0;
        int lastEnd = Integer.MIN_VALUE;

        for (int[] interval : intervals) {
            if (interval[0] >= lastEnd) {
                count++;
                lastEnd = interval[1];
            }
        }
        return count;
    }
}
```

</div>

## Recommended Practice Order

Tackle problems in this order to build competence progressively:

1.  **Foundational:** Start with classic proofs of concept like "Activity Selection" (the interval problem above) and "Coin Change" where greedy works.
2.  **Core Patterns:** Practice "Minimum Number of Platforms Required" (a two-sort interval problem) and "Job Sequencing" to handle deadlines and profits.
3.  **Paytm-Focused:** Move to problems involving arrays and strings that mimic data stream processing, like "Minimum Sum of Four Digit Number After Splitting Digits" or "Minimum Deletions to Make Character Frequencies Unique."
4.  **Integration:** Finally, solve problems where you must decide between a greedy approach and a dynamic programming one (e.g., "Partition Labels" is greedy, while standard "Coin Change" is DP). This sharpens your pattern identification.

Consistently practice explaining your reasoning. In the interview, you'll need to justify why your greedy approach is correct, not just implement it.

[Practice Greedy at Paytm](/company/paytm/greedy)
