---
title: "Binary Search Questions at Google: What to Expect"
description: "Prepare for Binary Search interview questions at Google — patterns, difficulty breakdown, and study tips."
date: "2027-02-11"
category: "dsa-patterns"
tags: ["google", "binary-search", "interview prep"]
---

Binary Search isn't just about finding an element in a sorted array. At Google, it's a fundamental pattern for optimizing solutions that involve monotonic functions, search spaces, or sorted data. With 191 specific problems tagged, it's one of the most frequent algorithmic concepts you'll encounter. Mastering it is non-negotiable for performance-critical systems where O(log n) efficiency is the difference between a scalable service and a slow one.

## What to Expect — Types of Problems

Google's binary search problems rarely present as textbook examples. You must recognize the underlying pattern.

1.  **Classic Sorted Array Search:** The foundation. Variations include finding the first/last occurrence of a target, or the insertion index.
2.  **Search on a Transformed/Monotonic Function:** The input isn't a sorted array, but a problem where you can define a condition function `f(x)` that is monotonic (always true after a point, or always false). The search space could be a range of integers, a set of possible answers, or a physical dimension.
3.  **Rotated or Shifted Sorted Arrays:** The array is sorted but then rotated at an unknown pivot. You must adapt the classic logic to handle two sorted segments.
4.  **Matrix Search & 2D Search:** Searching in a matrix that is sorted row-wise and column-wise, requiring a clever reduction of the 2D search space.
5.  **Minimization/Maximization Problems:** Often framed as "find the minimum possible maximum value" (like allocating pages, splitting arrays, or painter's partition). You binary search over the _answer space_ and use a helper function to check feasibility.

## How to Prepare — Study Tips with One Code Example

Internalize the loop invariants. The core pattern involves maintaining a search space `[left, right]` that always contains the possible answer. The most robust implementation uses `left <= right` and updates bounds to `mid + 1` or `mid - 1`. This avoids infinite loops.

The key is to write a condition function for problems beyond simple arrays. Ask: "Can I design a `feasible(x)` function that is monotonic?" If yes, you can binary search `x`.

Consider the common pattern: **Finding the first index where a condition becomes true.** This applies to finding the first bad version, the first capacity that works, or the first occurrence of a target.

<div class="code-group">

```python
def first_true(condition, low, high):
    """Finds the first index in [low, high] where condition(index) is True."""
    left, right = low, high
    first_true_index = high + 1  # Default if no true found

    while left <= right:
        mid = left + (right - left) // 2
        if condition(mid):
            # Mid is true, search left half for an earlier true
            first_true_index = mid
            right = mid - 1
        else:
            # Mid is false, search right half
            left = mid + 1
    return first_true_index

# Example: Find first version where API returns error (isBadVersion)
def firstBadVersion(n, isBadVersion):
    return first_true(isBadVersion, 1, n)
```

```javascript
function firstTrue(condition, low, high) {
  let left = low;
  let right = high;
  let firstTrueIndex = high + 1; // Default if no true found

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (condition(mid)) {
      // Mid is true, search left half for an earlier true
      firstTrueIndex = mid;
      right = mid - 1;
    } else {
      // Mid is false, search right half
      left = mid + 1;
    }
  }
  return firstTrueIndex;
}

// Example: Find first bad version
function solution(isBadVersion) {
  return function (n) {
    return firstTrue(isBadVersion, 1, n);
  };
}
```

```java
public class Solution {
    // Generic pattern to find first true
    public int firstTrue(int low, int high, IntPredicate condition) {
        int left = low, right = high;
        int firstTrueIndex = high + 1; // Sentinel value

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (condition.test(mid)) {
                // Mid is true, search left half
                firstTrueIndex = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return firstTrueIndex;
    }

    // Example implementation for First Bad Version
    public int firstBadVersion(int n, Predicate<Integer> isBadVersion) {
        return firstTrue(1, n, isBadVersion::test);
    }
}
```

</div>

## Recommended Practice Order

Build competence sequentially. Start with the classic algorithm until you can write it flawlessly. Then move to variations on 1D arrays: first/last position, search in rotated array. Next, tackle the minimization problems that require a custom condition function. Finally, progress to 2D search and more complex applications. This builds the mental model from concrete arrays to abstract search spaces.

[Practice Binary Search at Google](/company/google/binary-search)
