---
title: "Binary Search Questions at Yahoo: What to Expect"
description: "Prepare for Binary Search interview questions at Yahoo — patterns, difficulty breakdown, and study tips."
date: "2029-02-08"
category: "dsa-patterns"
tags: ["yahoo", "binary-search", "interview prep"]
---

Binary Search isn't just about finding an element in a sorted array. At Yahoo, which handles massive datasets for search, advertising, and content delivery, it's a fundamental pattern for efficient data retrieval, rate limiting, and system design. With 6 out of their 64 tagged questions focused on it, mastering binary search is non-negotiable. It demonstrates you can think in terms of **O(log n)** optimizations—a critical skill for scaling systems that process billions of user queries and data points daily.

## What to Expect — Types of Problems

Yahoo's binary search problems typically extend beyond the classic textbook example. Expect variations that test your ability to adapt the core algorithm to more complex scenarios. The main categories are:

1.  **Search in Modified/Rotated Sorted Arrays:** You'll be given a sorted array that has been rotated at an unknown pivot. The task is to find a target element or the minimum element within it. This tests your understanding of how to determine which half of the array is properly sorted and how to adjust search boundaries accordingly.
2.  **Finding Boundaries (First/Last Position):** Problems ask for the first or last occurrence of a target element, or more abstractly, the first element that satisfies a condition (like a capacity in a ship-loading problem). This requires modifying the standard binary search loop to avoid early returns and carefully manage the `mid` calculation to avoid infinite loops.
3.  **Binary Search on Answer (or Concept Space):** The most advanced type. Here, the array itself isn't given. Instead, you perform binary search on a _range of possible answers_ (e.g., the minimum capacity of a ship to ship packages in D days). You write a helper function (the "feasibility check") to test if a candidate answer works, and binary search to find the optimal one. This pattern is powerful for optimization problems.

## How to Prepare — Study Tips with One Code Example

Internalize the universal binary search template. It works for finding the _first_ position where a condition becomes true. The key is to avoid off-by-one errors by maintaining an invariant: the search space `[left, right]` contains the answer, and you shrink it until `left == right`.

**Core Pattern: Finding the First True in a Sorted Boolean Array**
Imagine a function `isValid(x)` that returns `False` for small `x` and `True` for large `x`. Find the smallest `x` where it becomes `True`.

<div class="code-group">

```python
def first_true(condition, low, high):
    left, right = low, high
    while left < right:
        mid = left + (right - left) // 2  # Prevents overflow
        if condition(mid):
            right = mid  # Answer is at mid or to the left
        else:
            left = mid + 1  # Answer is to the right
    return left  # left == right, the first true index

# Example: Find first index where arr[i] >= target
arr = [2, 3, 5, 7, 11]
target = 6
index = first_true(lambda x: arr[x] >= target, 0, len(arr)-1)
# index = 3 (arr[3] = 7)
```

```javascript
function firstTrue(condition, low, high) {
  let left = low;
  let right = high;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (condition(mid)) {
      right = mid; // Answer is at mid or to the left
    } else {
      left = mid + 1; // Answer is to the right
    }
  }
  return left; // left == right, the first true index
}

// Example: Find first index where arr[i] >= target
const arr = [2, 3, 5, 7, 11];
const target = 6;
const index = firstTrue((x) => arr[x] >= target, 0, arr.length - 1);
// index = 3 (arr[3] = 7)
```

```java
public int firstTrue(IntPredicate condition, int low, int high) {
    int left = low;
    int right = high;
    while (left < right) {
        int mid = left + (right - left) / 2; // Prevents overflow
        if (condition.test(mid)) {
            right = mid; // Answer is at mid or to the left
        } else {
            left = mid + 1; // Answer is to the right
        }
    }
    return left; // left == right, the first true index
}

// Example usage:
// int[] arr = {2, 3, 5, 7, 11};
// int target = 6;
// int index = firstTrue(x -> arr[x] >= target, 0, arr.length - 1);
// index = 3 (arr[3] = 7)
```

</div>

## Recommended Practice Order

Build mastery progressively. Don't jump into Yahoo's hardest questions first.

1.  **Foundation:** Master the classic binary search and its boundary-finding variant (first/last position of a target). LeetCode 704 and 34 are perfect.
2.  **Rotation:** Solve search in rotated sorted array (both with and without duplicates). This solidifies your ability to analyze which half is sorted. Practice LeetCode 33 and 153.
3.  **Answer Search:** Tackle 1-2 problems that use binary search on the answer space, like "Capacity To Ship Packages Within D Days" (LeetCode 1011). This is where you apply the universal template with a custom condition function.
4.  **Yahoo-Specific:** Finally, apply your skills to Yahoo's actual tagged problems. You'll now see them as combinations of the patterns you've already mastered.

[Practice Binary Search at Yahoo](/company/yahoo/binary-search)
