---
title: "Binary Search Questions at Uber: What to Expect"
description: "Prepare for Binary Search interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-06-09"
category: "dsa-patterns"
tags: ["uber", "binary-search", "interview prep"]
---

Binary Search is a critical algorithm for Uber interviews because it directly maps to real-world engineering problems at scale. Uber deals with massive datasets—billions of rides, real-time location tracking, dynamic pricing, and ETA calculations. Efficiently searching through sorted data (like time-series logs, sorted driver lists, or spatial indexes) is a daily necessity. A brute-force linear scan is unacceptable at this volume. Interviewers use Binary Search questions to assess if you can design systems that are not just correct, but efficient under constraints. Mastering it demonstrates you think about algorithmic efficiency, a non-negotiable skill for handling Uber's data intensity.

## What to Expect — Types of Problems

You won't see textbook "find a number in a sorted array" questions. Uber's problems are applied and often involve a "search space" abstraction. Expect these types:

1.  **Modified or Rotated Arrays:** Searching in a sorted array that has been pivoted at an unknown point. This tests your ability to handle asymmetry in the search logic.
2.  **Search in a Sorted 2D Structure:** This could be a matrix sorted row-wise and column-wise, or a matrix where each row is sorted. It evaluates your skill in reducing a 2D problem to a 1D search.
3.  **Finding Boundaries (First/Last Occurrence):** Critical for log analysis—like finding the first time a specific error code appeared in sorted timestamps or the last location update before a system event.
4.  **Search on a Function/Answer Space (Most Common):** The most frequent and challenging type. The problem presents a scenario where you must find a _minimum_ or _maximum_ value that satisfies a specific condition. The sorted array isn't given; you must identify that the _answer itself_ is monotonic and can be binary searched. Classic Uber examples involve allocating resources (e.g., the smallest capacity for a fleet to handle trips) or optimizing a schedule.

## How to Prepare — Study Tips with One Code Example

First, internalize the core pattern: Binary Search finds a target in a **sorted** sequence by repeatedly dividing the search interval in half. The key is recognizing what is sorted (the data or the possible answers) and what the "target" condition is.

**Critical Tip:** Always decide your loop condition (`left <= right` vs `left < right`) and how you update bounds (`mid ± 1`) upfront to avoid infinite loops. Use a consistent template.

Let's look at a fundamental pattern: finding the first occurrence of a target (essential for boundary problems).

<div class="code-group">

```python
def find_first_occurrence(nums, target):
    left, right = 0, len(nums) - 1
    first_index = -1
    while left <= right:
        mid = left + (right - left) // 2  # Avoids overflow
        if nums[mid] == target:
            first_index = mid
            right = mid - 1  # Search left for an earlier occurrence
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return first_index
```

```javascript
function findFirstOccurrence(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  let firstIndex = -1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) {
      firstIndex = mid;
      right = mid - 1; // Search left for an earlier occurrence
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return firstIndex;
}
```

```java
public int findFirstOccurrence(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    int firstIndex = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2; // Prevents overflow
        if (nums[mid] == target) {
            firstIndex = mid;
            right = mid - 1; // Search left for an earlier occurrence
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return firstIndex;
}
```

</div>

The crucial line is `right = mid - 1` when we find a match. This shrinks the search space to the left half, allowing us to find the _first_ occurrence. For the _last_ occurrence, you would set `left = mid + 1` instead.

## Recommended Practice Order

Build competence progressively:

1.  **Standard Implementation:** Perfect finding a target and handling edge cases (empty array, target not found).
2.  **Boundary Searches:** Practice "find first/last position," "count occurrences."
3.  **Modified Arrays:** Tackle search in rotated sorted arrays and find minimum in rotated arrays.
4.  **2D Search:** Practice searching in a row-wise and column-wise sorted matrix.
5.  **Answer Space Search (Most Important):** Solve problems like "Koko Eating Bananas," "Capacity To Ship Packages," and "Split Array Largest Sum." This is where you train to identify the monotonic condition.

[Practice Binary Search at Uber](/company/uber/binary-search)
