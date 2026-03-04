---
title: "Binary Search Questions at Citadel: What to Expect"
description: "Prepare for Binary Search interview questions at Citadel — patterns, difficulty breakdown, and study tips."
date: "2028-08-06"
category: "dsa-patterns"
tags: ["citadel", "binary-search", "interview prep"]
---

Binary search is a fundamental algorithm that appears in 11 of Citadel's 96 coding questions. This high frequency signals its importance in their technical interviews. For a firm like Citadel, where performance and efficiency are paramount, binary search represents a core concept for evaluating a candidate's ability to optimize solutions. It tests not just rote memorization, but the skill to apply a logarithmic-time pattern to problems that may not initially look like a simple array search. Mastering it demonstrates you can think about reducing complex problems to efficient, scalable solutions—a critical mindset for quantitative and software roles.

## What to Expect — Types of Problems

You will rarely encounter a straightforward "find a target in a sorted array" question. Citadel's problems typically involve applying the binary search _pattern_ to more complex scenarios. Expect these main types:

1.  **Search in a Modified or Implicitly Sorted Space:** Problems where the array is rotated, or where the search space isn't an array at all (e.g., finding the square root of a number, minimizing the maximum of something). The challenge is to correctly identify the monotonic condition that allows binary search.
2.  **Answer on a Sorted Function (Monotonic Predicate):** This is the most common advanced pattern. You use binary search to find the _first_ or _last_ position where a true/false condition holds. For example, "find the smallest capacity that allows shipping within D days." The condition "can ship within D days with capacity X" is monotonic—if it's true for X, it's true for all larger capacities.
3.  **Search in a 2D Sorted Structure:** Searching in a matrix that is sorted row-wise and column-wise, requiring you to eliminate rows or columns with each comparison.

## How to Prepare — Study Tips with One Code Example

Internalize the universal binary search template. It avoids infinite loops and works for both finding a target and applying a predicate. The key is to maintain the loop invariant: the answer is always within the `[left, right]` interval.

**Study Tips:**

- **Template First:** Memorize one robust template and use it for every problem.
- **Identify the Monotonic Condition:** For any problem, ask: "As I move through the search space, is there a point where a true/false condition flips from false to true (or vice versa)?" If yes, binary search applies.
- **Practice Edge Cases:** Empty inputs, single elements, duplicates, and large values that cause overflow in midpoint calculation.

Here is the key template for the monotonic predicate pattern, demonstrated with a classic problem: "Find the first bad version."

<div class="code-group">

```python
def first_bad_version(n):
    left, right = 1, n
    while left < right:
        mid = left + (right - left) // 2  # Prevent overflow
        if isBadVersion(mid):
            right = mid  # Answer is at mid or to the left
        else:
            left = mid + 1  # Answer is to the right
    return left  # left == right, the first true index
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
        int mid = left + (right - left) / 2; // Prevent overflow
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

## Recommended Practice Order

1.  **Standard Binary Search:** Implement basic search to solidify the loop and midpoint calculation.
2.  **Search Boundaries:** Find the first/last position of a target in a sorted array with duplicates.
3.  **Answer on Sorted Function:** Solve problems like "Capacity To Ship Packages Within D Days" or "Koko Eating Bananas." This is the most critical category for Citadel.
4.  **Rotated Arrays:** Search in a rotated sorted array and find the minimum element.
5.  **2D Search:** Search in a 2D sorted matrix.

[Practice Binary Search at Citadel](/company/citadel/binary-search)
