---
title: "Sorting Questions at Intuit: What to Expect"
description: "Prepare for Sorting interview questions at Intuit — patterns, difficulty breakdown, and study tips."
date: "2028-10-27"
category: "dsa-patterns"
tags: ["intuit", "sorting", "interview prep"]
---

If you're preparing for an interview at Intuit, you might have noticed something interesting in their problem distribution: **Sorting** is a significant category. With 10 dedicated questions out of 71 total, it's not just a minor topic—it's a core assessment area. This isn't an accident. Intuit's flagship products, like QuickBooks and TurboTax, are fundamentally data aggregation and organization engines. They take messy, unordered financial transactions, tax forms, and user inputs and transform them into coherent reports, summaries, and filings. The underlying logic that makes this possible? Efficient sorting and ordering algorithms. In an interview, they're not just testing if you know `array.sort()`; they're testing if you understand how to impose meaningful order on complex data to enable downstream logic, which is the daily work of an Intuit engineer.

## Specific Patterns Intuit Favors

Intuit's sorting questions rarely ask you to implement a vanilla sorting algorithm like quicksort from scratch. Instead, they focus on **applied sorting**—using sorting as a critical preprocessing step to simplify a more complex problem. The patterns you'll see most often are:

1.  **Sorting with Custom Comparators:** This is the undisputed king. Problems where the "correct" order isn't alphabetical or numerical, but defined by business logic (e.g., sort transactions by date and then by amount, reconcile invoices by ID and type). The key is writing a comparator function that returns -1, 0, or 1 (or using a language's key-function) to define that order.
2.  **Interval Merging and Overlap:** A direct reflection of reconciling time periods, financial quarters, or scheduling. After sorting intervals by their start time, problems like finding overlaps, merging, or inserting new intervals become tractable with a single linear pass.
3.  **"K-th" Element in a Sorted Order:** Finding the Kth largest/smallest element, or the top K frequent elements. This often involves a clever combination of sorting, heaps, or quickselect.

For example, **Merge Intervals (#56)** is a classic Intuit-style problem. The sorting step is what unlocks the simple merge pass. Similarly, **Meeting Rooms II (#253)** uses sorting to find the maximum concurrent meetings (overlaps), a pattern applicable to resource scheduling.

## How to Prepare

Master the custom comparator. It's the single most important skill for Intuit's sorting problems. Let's look at a common variation: sorting strings based on custom rules.

**Problem:** You have log entries, each a string like `"offer1 10 30"` (id, value, timestamp). Sort them primarily by value (ascending), but if values are equal, sort by timestamp (descending).

The solution hinges entirely on writing the correct comparator or sort key.

<div class="code-group">

```python
def sort_logs(logs):
    """
    Sorts a list of log strings.
    Each log is "id value timestamp".
    Primary key: value (int, ascending).
    Secondary key: timestamp (int, descending).
    """
    def sort_key(log):
        # Split the log string
        id_str, val_str, ts_str = log.split()
        # Return a tuple as the composite key.
        # For timestamp, we use negative for descending order.
        return (int(val_str), -int(ts_str))

    # The sorted() function is stable, but our key handles all ordering.
    return sorted(logs, key=sort_key)

# Time: O(N * L log N) where N is logs count, L is avg log length for split.
# Space: O(N) for the new sorted list (or O(1) if sorted in-place).
```

```javascript
function sortLogs(logs) {
  return logs.sort((a, b) => {
    const [idA, valA, tsA] = a.split(" ");
    const [idB, valB, tsB] = b.split(" ");

    // Compare primary key: value
    if (parseInt(valA) !== parseInt(valB)) {
      return parseInt(valA) - parseInt(valB); // Ascending
    }
    // If values equal, compare secondary key: timestamp (descending)
    return parseInt(tsB) - parseInt(tsA); // Descending
  });
}

// Time: O(N * L log N) | Space: O(log N) for sort's recursion stack (or O(1) for iterative sort).
```

```java
import java.util.*;

public class LogSorter {
    public List<String> sortLogs(List<String> logs) {
        logs.sort((a, b) -> {
            String[] partsA = a.split(" ");
            String[] partsB = b.split(" ");
            int valA = Integer.parseInt(partsA[1]);
            int valB = Integer.parseInt(partsB[1]);
            int tsA = Integer.parseInt(partsA[2]);
            int tsB = Integer.parseInt(partsB[2]);

            // Primary comparison: value
            if (valA != valB) {
                return Integer.compare(valA, valB); // Ascending
            }
            // Secondary comparison: timestamp (descending)
            return Integer.compare(tsB, tsA); // Note: B compared to A for descending
        });
        return logs;
    }
}

// Time: O(N * L log N) | Space: O(log N) for TimSort's auxiliary space.
```

</div>

The pattern is consistent: parse the elements you need to compare, then structure your comparison logic to respect the primary and secondary keys in the required order.

## How Intuit Tests Sorting vs Other Companies

Compared to other tech companies, Intuit's sorting questions have a distinct flavor:

- **vs. FAANG (Meta, Google):** FAANG interviews often use sorting as a component in harder, multi-step algorithm puzzles (e.g., sorting to enable a two-pointer solution on a sorted array). Intuit's problems are more directly tied to **realistic data organization tasks**. The complexity comes from the comparison logic, not from the algorithm itself.
- **vs. FinTech (Stripe, PayPal):** While both deal with transactions, Stripe might focus more on idempotency and id sorting for idempotent requests. Intuit leans into **temporal sorting and interval management** (tax years, fiscal periods).
- **Unique Intuit Angle:** They love problems where sorting transforms an **O(N²)** brute-force comparison into an **O(N log N)** solution. The "aha" moment is realizing that sorting the data first creates a structure where relationships (like overlaps or nearest pairs) become obvious.

## Study Order

Tackle sorting topics in this logical progression:

1.  **Basic In-Place Sorting Algorithms:** Understand how `Quicksort` (average O(N log N), worst O(N²)) and `Mergesort` (stable, always O(N log N)) work at a high level. You won't implement them, but you need to know their properties to discuss trade-offs.
2.  **Built-in Sort & Custom Comparators:** Learn how to use your language's sort function with a custom comparator or key. This is 80% of the battle.
3.  **Interval Patterns:** Master sorting intervals by start time to solve merging (#56), insertion (#57), and overlap problems (#252, #253).
4.  **"K-th" Element Patterns:** Learn to use a min-heap for "Top K" problems (#347, #215) and understand the quickselect algorithm conceptually.
5.  **Advanced Composite Sorting:** Practice problems where you sort based on derived properties or multiple keys, like **Largest Number (#179)**, where you sort strings via a custom concatenation comparison.

This order works because it builds from foundational knowledge (how sorting works) to the primary tool (custom sort), then to the most common applied patterns (intervals, K-th), and finally to tricky edge cases.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous concept.

1.  **Meeting Rooms (#252):** (Easy) The simplest interval check. Sort, then one pass.
2.  **Merge Intervals (#56):** (Medium) The foundational interval pattern. Sort, then merge in a pass.
3.  **Insert Interval (#57):** (Medium) A variation on merging. Sort isn't strictly needed if input is sorted, but the pattern is identical.
4.  **Meeting Rooms II (#253):** (Medium) Takes the interval pattern further to find maximum concurrency. Uses sorting plus a min-heap.
5.  **K Closest Points to Origin (#973):** (Medium) Applies sorting with a custom key (distance).
6.  **Top K Frequent Elements (#347):** (Medium) Combines hash map frequency counting with sorting (or a heap) by frequency.
7.  **Largest Number (#179):** (Medium) A challenging custom comparator problem. The sort logic (`a+b` vs `b+a`) is non-obvious.
8.  **Non-overlapping Intervals (#435):** (Medium) A greedy interval problem that relies on a smart sort (by end time).

By following this path, you'll systematically build the exact skill set Intuit interviewers are looking for: the ability to look at a messy data problem and see how imposing the right order can create a simple, efficient solution.

[Practice Sorting at Intuit](/company/intuit/sorting)
