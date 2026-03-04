---
title: "Binary Search Questions at Myntra: What to Expect"
description: "Prepare for Binary Search interview questions at Myntra — patterns, difficulty breakdown, and study tips."
date: "2031-05-07"
category: "dsa-patterns"
tags: ["myntra", "binary-search", "interview prep"]
---

Binary Search is a critical algorithm for Myntra’s engineering interviews because it directly reflects the company’s core needs. Myntra handles massive product catalogs, user searches, pricing data, inventory management, and real-time filtering—all domains where efficient search on sorted data is essential. Performance at scale is non-negotiable. An engineer who can implement optimized search (O(log n) vs. O(n)) demonstrates the kind of system-level thinking Myntra values for building fast, scalable e-commerce platforms. With typically 2 out of 24 questions focused on Binary Search, mastering it is a high-leverage use of your preparation time.

## What to Expect — Types of Problems

Myntra’s Binary Search questions typically extend beyond checking for an element in a simple sorted array. You should be ready for applied, array-based problems that test your ability to adapt the core pattern. Common themes include:

- **Search in Modified/Rotated Sorted Arrays:** Finding a target in an array that has been rotated, or finding the rotation point itself.
- **Answer on a Sorted Range (Predicate Problems):** Problems where you binary search over a _range of possible answers_ (like capacities, minimums, or maximums) and use a helper function to check feasibility. This is common for optimization problems like "minimum capacity to ship packages in D days."
- **Finding Boundaries:** Applying binary search to find the first or last occurrence of a target, or the insertion point.
  Expect the problems to have a sorting or ordering constraint that makes binary search applicable, but the implementation will require careful handling of indices and loop conditions.

## How to Prepare — Study Tips with One Code Example

Internalize the standard binary search pattern and then practice its variations. Always clarify edge cases (empty array, duplicates, etc.). Write the loop condition and index updates consistently to avoid infinite loops. A powerful technique is to frame problems as searching for the _first index that satisfies a condition_. This single pattern can solve many boundary-finding problems.

Consider the classic problem: **Find the first bad version.** You have `n` versions, and an API `isBadVersion(i)` returns `true` for all versions from a certain point onward. Find the first bad one.

<div class="code-group">

```python
def firstBadVersion(n):
    left, right = 1, n
    while left < right:
        mid = left + (right - left) // 2
        if isBadVersion(mid):
            right = mid  # Search left half, including mid
        else:
            left = mid + 1  # Search right half
    return left  # left == right, first bad version
```

```javascript
function firstBadVersion(n) {
  let left = 1;
  let right = n;
  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (isBadVersion(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}
```

```java
public int firstBadVersion(int n) {
    int left = 1;
    int right = n;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (isBadVersion(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}
```

</div>

The key is using `while (left < right)` and setting `right = mid` when the condition is true. This converges on the _first_ index where `isBadVersion` is true.

## Recommended Practice Order

1.  **Master the Classic:** Implement standard binary search on a sorted array until it’s error-free.
2.  **Boundary Searches:** Practice finding the first/last position of a target.
3.  **Rotated Arrays:** Solve search in rotated sorted array and find minimum in rotated sorted array.
4.  **Predicate/Answer Search:** Tackle problems like "Koko Eating Bananas" or "Capacity To Ship Packages," where you binary search over a range of possible answers.
5.  **Myntra-Focused Practice:** Finally, work on problems tagged with Myntra to understand their specific style and difficulty level.

[Practice Binary Search at Myntra](/company/myntra/binary-search)
