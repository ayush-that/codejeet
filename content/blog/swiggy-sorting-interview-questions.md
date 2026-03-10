---
title: "Sorting Questions at Swiggy: What to Expect"
description: "Prepare for Sorting interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-01-30"
category: "dsa-patterns"
tags: ["swiggy", "sorting", "interview prep"]
---

# Sorting Questions at Swiggy: What to Expect

Swiggy’s technical interview process is heavily weighted toward algorithmic problem-solving, and sorting is a cornerstone of that assessment. With 9 out of 41 total tagged questions being sorting-related, it’s clear this isn’t just a random topic—it’s a deliberate focus area. Why? Because Swiggy’s core business—food delivery, logistics, and real-time dispatch—is fundamentally about ordering things: orders by priority, drivers by proximity, restaurants by rating, delivery routes by efficiency. A candidate who can’t efficiently sort and reorder data is a candidate who can’t model the company’s most basic operational challenges. In real interviews, you’re almost guaranteed to encounter at least one problem where sorting is either the primary solution or a critical optimization step. They use it to test not just your knowledge of `sort()`, but your ability to recognize when ordering data unlocks a simpler, more efficient algorithm.

## Specific Patterns Swiggy Favors

Swiggy’s sorting questions rarely ask you to implement quicksort from scratch. Instead, they focus on **applied sorting**—using sorting as a tool to transform a problem. The two most frequent patterns are:

1.  **"Sorting as Pre-processing for a Greedy or Two-Pointer Solution":** This is their bread and butter. You’re given a messy dataset; sorting it first reveals a structure that makes the rest of the problem trivial. Classic examples are interval problems or problems where you need to find pairs meeting a condition.
2.  **"Custom Sorting (Comparator-based)":** They love problems where the "correct" order isn’t alphabetical or numerical, but defined by a specific business rule. This tests your ability to abstract a comparison logic.

A quintessential Swiggy-style problem is **Merge Intervals (LeetCode #56)**. The naive approach is a mess of nested loops. The elegant solution? Sort the intervals by their start time. Suddenly, overlapping intervals become adjacent, and you can merge them in a single, clean pass. This pattern of _sort first, then apply a linear scan_ is paramount.

Another favorite is **Non-overlapping Intervals (LeetCode #435)**, which uses the same sorted foundation to apply a greedy selection algorithm. For custom sorting, look at **Largest Number (LeetCode #179)**, where you must sort numbers as strings based on concatenated results.

## How to Prepare

Don’t just memorize sorting algorithms. Practice the _application_ of sorting. For the "sort and solve" pattern, the mental checklist is: 1) Does the problem involve pairs, intervals, or sequences? 2) Would ordering them simplify the state space? 3) After sorting, can I solve it with a greedy rule or a two-pointer scan?

Let’s look at the core code pattern for a custom comparator. Suppose you have a list of transactions and need to sort them by amount descending, then by date ascending.

<div class="code-group">

```python
# Python: Using a lambda with sort() or sorted()
transactions = [{"amount": 100, "date": "2023-10-01"}, {"amount": 50, "date": "2023-10-02"}, {"amount": 100, "date": "2023-09-30"}]

# Sort by amount descending, then date ascending
transactions.sort(key=lambda x: (-x["amount"], x["date"]))

# For more complex logic, you can use a custom function
def compare(t):
    return (-t["amount"], t["date"])  # Negative for descending
transactions.sort(key=compare)

# Time: O(n log n) for the sort | Space: O(1) for in-place sort, O(n) for sorted()
```

```javascript
// JavaScript: Using Array.prototype.sort()
let transactions = [
  { amount: 100, date: "2023-10-01" },
  { amount: 50, date: "2023-10-02" },
  { amount: 100, date: "2023-09-30" },
];

// Sort by amount descending, then date ascending
transactions.sort((a, b) => {
  if (b.amount !== a.amount) {
    return b.amount - a.amount; // Descending
  }
  // If amounts are equal, sort by date ascending
  return new Date(a.date) - new Date(b.date);
});

// Time: O(n log n) | Space: O(1) for in-place sort (though JS engine may use extra space)
```

```java
// Java: Using Comparator with Collections.sort() or List.sort()
import java.util.*;

class Transaction {
    int amount;
    String date;
    // ... constructor, getters
}

List<Transaction> transactions = new ArrayList<>();
// ... add transactions

// Using a lambda comparator (Java 8+)
transactions.sort((a, b) -> {
    if (a.amount != b.amount) {
        return Integer.compare(b.amount, a.amount); // Descending
    }
    return a.date.compareTo(b.date); // Ascending
});

// Alternative: Using Comparator chaining
transactions.sort(
    Comparator.comparingInt(Transaction::getAmount).reversed()
              .thenComparing(Transaction::getDate)
);

// Time: O(n log n) | Space: O(log n) for the sort's auxiliary space (TimSort)
```

</div>

For the "sort and two-pointer" pattern, here’s the skeleton for a problem like **Two Sum II - Input Array Is Sorted (LeetCode #167)**, but applied to a scenario where you must sort first.

<div class="code-group">

```python
def find_pair_with_target_sum(arr, target):
    """Assumes arr is unsorted. Finds two numbers summing to target."""
    arr.sort()  # Critical pre-processing step
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [arr[left], arr[right]]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []  # No pair found

# Time: O(n log n) for the sort dominates the O(n) two-pointer scan.
# Space: O(1) if sort is in-place, else O(n) for the sort's space.
```

```javascript
function findPairWithTargetSum(arr, target) {
  arr.sort((a, b) => a - b); // Numeric sort
  let left = 0,
    right = arr.length - 1;
  while (left < right) {
    const currentSum = arr[left] + arr[right];
    if (currentSum === target) {
      return [arr[left], arr[right]];
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  return []; // No pair found
}
// Time: O(n log n) | Space: O(1) or O(n) depending on JS engine sort implementation.
```

```java
public int[] findPairWithTargetSum(int[] arr, int target) {
    Arrays.sort(arr); // Pre-processing
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int currentSum = arr[left] + arr[right];
        if (currentSum == target) {
            return new int[]{arr[left], arr[right]};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{}; // No pair found
}
// Time: O(n log n) | Space: O(log n) for Arrays.sort (Dual-Pivot Quicksort/TimSort)
```

</div>

## How Swiggy Tests Sorting vs Other Companies

Compared to FAANG companies, Swiggy’s sorting questions are less about algorithmic minutiae (e.g., "derive the worst-case of quicksort") and more about **practical, business-logic application**. A company like Google might ask you to design a novel sorting algorithm for a specific hardware constraint. Amazon might embed a sorting step within a large object-oriented design problem. Swiggy’s questions are typically mid-difficulty LeetCode problems where sorting is the key insight. The uniqueness lies in the domain context—the problems often _feel_ like simplified versions of real dispatch, ranking, or scheduling tasks they handle daily. The expectation is that you not only code the sort but also articulate _why_ sorting is the right approach for the scenario.

## Study Order

1.  **Master Built-in Sorting & Custom Comparators:** Before anything else, be fluent in sorting arrays/lists in your language of choice and writing custom comparison logic. This is the absolute base.
2.  **"Sort and Two-Pointer" Patterns:** Problems like Two Sum (after sorting), 3Sum, and Remove Duplicates. This teaches you how sorting reduces complexity.
3.  **Interval Problems:** Merge Intervals, Non-overlapping Intervals, Meeting Rooms. This is a direct application of pattern #2 and is extremely common.
4.  **Greedy Problems Enabled by Sorting:** Task Scheduler, Queue Reconstruction by Height. Here, sorting sets up the optimal greedy sequence.
5.  **Advanced Custom Sorting:** Largest Number, Custom Sort String. These test your ability to define non-obvious ordering rules.
6.  **(Optional) Underlying Sort Algorithms:** Only if you have time, understand QuickSort and MergeSort well enough to discuss trade-offs, as you might get a follow-up question.

This order works because it builds from the simple tool (using `sort()`) to its most common applications, before diving into the underlying theory. You get maximum interview coverage fastest.

## Recommended Practice Order

Solve these problems in sequence to build the competency Swiggy tests:

1.  **LeetCode #56 - Merge Intervals:** The foundational "sort first" problem.
2.  **LeetCode #75 - Sort Colors (Dutch Flag):** A different take on sorting in-place with constraints.
3.  **LeetCode #435 - Non-overlapping Intervals:** Applies sorting to enable a greedy choice.
4.  **LeetCode #179 - Largest Number:** A classic custom comparator challenge.
5.  **LeetCode #853 - Car Fleet:** A superb example of sorting by position to simplify a simulation.
6.  **LeetCode #406 - Queue Reconstruction by Height:** Combines custom sorting with greedy insertion.
7.  **LeetCode #252 - Meeting Rooms:** A simpler interval check that reinforces the pattern.
8.  **LeetCode #973 - K Closest Points to Origin:** Sorting is the straightforward approach; a follow-up might ask for a heap solution.

This sequence takes you from recognizing the pattern to applying it in increasingly nuanced ways.

[Practice Sorting at Swiggy](/company/swiggy/sorting)
