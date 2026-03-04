---
title: "Binary Search Questions at Zepto: What to Expect"
description: "Prepare for Binary Search interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-12-08"
category: "dsa-patterns"
tags: ["zepto", "binary-search", "interview prep"]
---

Binary search isn't just about finding an element in a sorted array. At Zepto, with 5 out of 28 tagged problems using this technique, it's a critical tool for optimizing core operations in a fast-paced delivery environment. The company's focus on speed, logistics, and inventory management means many problems involve searching through ordered data—like delivery time slots, sorted product inventories, or geographical coordinates—to find an optimal answer efficiently. Mastering binary search transitions you from O(n) to O(log n) solutions, which is often the difference between a brute-force answer and a hireable one.

## What to Expect — Types of Problems

Zepto's binary search problems typically extend beyond the classic "find a target." Expect variations that test your ability to adapt the core algorithm. Common themes include:

- **Search in Rotated Sorted Arrays:** Modeling a scenario where a sorted list (like a timeline or inventory log) has been pivoted.
- **Finding Boundaries (First/Last Occurrence):** Essential for tasks like finding the earliest available delivery slot or the last item in a specific price range.
- **Answer on a Sorted Function (Min/Max of something):** This is the most common advanced pattern. You'll use binary search to guess an answer (like a minimum capacity or maximum distance) and check if that guess is feasible with a helper function. This applies to problems like allocating resources or minimizing maximum delivery time.

## How to Prepare — Study Tips with One Code Example

First, internalize the standard binary search pattern to avoid infinite loops. Use `left <= right` for exact search and `left < right` for boundary searches. For advanced problems, practice the "guess and check" framework:

1.  Identify the search space (the range of possible answers).
2.  Write a helper function `isFeasible(guess)` that returns True/False.
3.  Use binary search to find the minimum (or maximum) `guess` where `isFeasible` returns True.

Consider the classic "Koko Eating Bananas" pattern, which mirrors optimization problems like determining minimum delivery speed.

<div class="code-group">

```python
def min_eating_speed(piles, h):
    def can_eat(k):
        hours = 0
        for p in piles:
            hours += (p + k - 1) // k  # ceil(p / k)
        return hours <= h

    left, right = 1, max(piles)
    while left < right:
        mid = (left + right) // 2
        if can_eat(mid):
            right = mid   # try a smaller speed
        else:
            left = mid + 1 # need a faster speed
    return left
```

```javascript
function minEatingSpeed(piles, h) {
  const canEat = (k) => {
    let hours = 0;
    for (const p of piles) {
      hours += Math.ceil(p / k);
    }
    return hours <= h;
  };

  let left = 1;
  let right = Math.max(...piles);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canEat(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}
```

```java
public int minEatingSpeed(int[] piles, int h) {
    int left = 1;
    int right = 0;
    for (int p : piles) right = Math.max(right, p);

    while (left < right) {
        int mid = left + (right - left) / 2;
        if (canEat(piles, h, mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

private boolean canEat(int[] piles, int h, int k) {
    long hours = 0; // Use long to prevent overflow
    for (int p : piles) {
        hours += (p + k - 1) / k; // ceiling division
    }
    return hours <= h;
}
```

</div>

## Recommended Practice Order

Build competence sequentially. Start with the classic implementation to cement the pattern. Then solve "search in rotated sorted array" and "find first/last position" problems. Finally, focus on the "guess and check" pattern, which is the most frequent and challenging type at companies like Zepto. For each problem, manually trace the `left` and `right` pointers to build intuition.

[Practice Binary Search at Zepto](/company/zepto/binary-search)
