---
title: "Binary Search Questions at Meesho: What to Expect"
description: "Prepare for Binary Search interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-12-01"
category: "dsa-patterns"
tags: ["meesho", "binary-search", "interview prep"]
---

Binary search isn’t just about finding an element in a sorted array. At Meesho, where engineering decisions directly impact scalability and cost-efficiency in e-commerce, binary search is a critical tool for optimizing search, recommendation, and inventory systems. With 5 out of 44 total coding questions focused on binary search, Meesho clearly values candidates who can apply this O(log n) paradigm to real-world, large-scale data problems. Mastering it demonstrates you can write efficient code that scales with their catalog of millions of products and suppliers.

## What to Expect — Types of Problems

Meesho’s binary search questions typically extend beyond the textbook algorithm. Expect problems framed around their domain:

- **Search in Rotated or Nearly Sorted Data:** Mimicking how product listings might be partitioned or re-ordered.
- **Finding Boundaries or Ranges:** Such as identifying the first or last occurrence of a price threshold, or allocating resources within constraints.
- **Optimization and Minimization Problems:** For example, determining the minimum capacity for a task (like order batching) to meet a time limit, a classic "minimize the maximum" pattern.
- **Binary Search on Answer (or "Guess the Answer"):** When the solution space is monotonic, you use binary search to efficiently converge on the correct answer, even if the underlying check function is more complex.

The core twist is that the array or search space is often not explicitly given. You must identify that the problem has a sorted or monotonic property that makes binary search applicable.

## How to Prepare — Study Tips with One Code Example

Focus on the underlying pattern, not memorization. Internalize this: binary search is a method to discard half of the search space at each step based on a condition. Practice writing a bug-free, generalized binary search loop and then adapt the condition (`if` statement) to the problem.

A fundamental pattern you must know is finding the first occurrence of a target in a sorted array (or the lower bound). This is the basis for many boundary-finding problems.

<div class="code-group">

```python
def first_occurrence(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            result = mid
            right = mid - 1  # Search left for an earlier occurrence
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result
```

```javascript
function firstOccurrence(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // Search left for an earlier occurrence
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return result;
}
```

```java
public int firstOccurrence(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    int result = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            result = mid;
            right = mid - 1; // Search left for an earlier occurrence
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return result;
}
```

</div>

## Recommended Practice Order

Build competence progressively:

1.  **Classic Implementation:** Standard search, first/last occurrence.
2.  **Search in Modified Arrays:** Rotated sorted arrays, nearly sorted arrays.
3.  **Binary Search on Answer:** Solve problems like "Koko Eating Bananas" or "Minimum Time to Complete Trips." This is where Meesho problems often land.
4.  **Advanced Applications:** More complex minimization problems and multi-dimensional search spaces.

[Practice Binary Search at Meesho](/company/meesho/binary-search)
