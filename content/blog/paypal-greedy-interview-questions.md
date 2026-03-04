---
title: "Greedy Questions at PayPal: What to Expect"
description: "Prepare for Greedy interview questions at PayPal — patterns, difficulty breakdown, and study tips."
date: "2028-05-22"
category: "dsa-patterns"
tags: ["paypal", "greedy", "interview prep"]
---

Greedy algorithms are a small but significant part of PayPal's technical interview landscape, representing about 11% of their tagged problems. For a company that handles real-time payment processing, fraud detection, and resource optimization, the greedy paradigm is directly relevant. It's used in scenarios where making the locally optimal choice at each step leads to a globally optimal solution for problems like scheduling transactions, minimizing cash handling delays, or optimizing server task allocation. Mastering these questions demonstrates you can think efficiently about resource allocation and step-by-step optimization—core skills for a financial technology engineer.

## What to Expect — Types of Problems

PayPal's greedy questions typically fall into predictable categories. You can expect **interval-based problems**, such as meeting room scheduling or merging intervals, which model real-world allocation of time slots or transaction windows. **Assignment problems** are also common, like task scheduling to minimize wait time or assigning resources. A third frequent category is **array-based optimization**, which includes problems like maximizing profit from a sequence of actions (e.g., a simplified model of buying/selling with transaction constraints) or partitioning arrays. The constraints are usually designed so a greedy approach is valid, but you must be prepared to justify why your chosen strategy is correct.

## How to Prepare — Study Tips with One Code Example

Start by learning the hallmark greedy patterns: sorting followed by iteration, using a priority queue (heap) to repeatedly select the best current option, and building a solution incrementally. Always validate that the greedy choice property holds—ask yourself, "Does this best local choice avoid blocking a better future outcome?" For practice, implement classic problems like "Merge Intervals" or "Task Scheduler" before tackling company-specific questions.

A key pattern is solving interval problems by sorting on the end time. This is optimal for "select the maximum number of non-overlapping intervals."

<div class="code-group">

```python
def max_non_overlapping(intervals):
    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])
    count = 0
    last_end = float('-inf')

    for start, end in intervals:
        if start >= last_end:
            count += 1
            last_end = end
    return count
```

```javascript
function maxNonOverlapping(intervals) {
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

public int maxNonOverlapping(int[][] intervals) {
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
```

</div>

## Recommended Practice Order

1.  **Foundational Patterns:** Practice classic greedy problems (Activity Selection, Coin Change greedy variant, Huffman Coding) to internalize the thought process.
2.  **PayPal-Tagged Easy:** Solve PayPal's easier greedy questions to build confidence and recognize their problem styling.
3.  **Core Categories:** Drill into each major type: interval problems, assignment/scheduling problems, and array optimization.
4.  **PayPal-Tagged Medium/Hard:** Attempt their more complex questions, focusing on deriving the greedy rule and writing bug-free code under time constraints.
5.  **Verification:** Always articulate a brief correctness argument for your approach—this is often expected during the interview.

[Practice Greedy at PayPal](/company/paypal/greedy)
