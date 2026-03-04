---
title: "Binary Search Questions at Yandex: What to Expect"
description: "Prepare for Binary Search interview questions at Yandex — patterns, difficulty breakdown, and study tips."
date: "2028-03-03"
category: "dsa-patterns"
tags: ["yandex", "binary-search", "interview prep"]
---

Binary Search is a core algorithmic technique at Yandex, appearing in 12 of their 134 cataloged problems. This frequency signals its importance for roles involving search infrastructure, data processing, or backend systems—areas where Yandex excels. Mastering it is non-negotiable. The skill tested is not just knowing the template, but recognizing when a problem can be transformed into a search over a defined answer space, often on non-obvious domains like time, distance, or resource allocation.

## What to Expect — Types of Problems

Yandex’s binary search problems typically extend beyond searching a sorted array. Expect two main categories:

1.  **Direct Application on Arrays/Lists:** Classic modifications like finding the first/last occurrence, searching in a rotated sorted array, or finding the insertion index. These test your ability to implement a bug-free binary search with precise boundary handling.

2.  **Answer Space Binary Search (The Key Pattern):** This is the most common and critical type. You are given a problem like "allocate minimum pages," "find the smallest divisor to meet a threshold," or "minimize the maximum waiting time." The solution involves:
    - Identifying a monotonic condition—if answer `X` works, then all answers greater than (or less than) `X` also work.
    - Searching over the range of possible answers (e.g., `[1, max(array)]` or `[min, sum]`).
    - Implementing a validation function `canDo(value)` that checks if a candidate answer is feasible.
    - Using binary search to find the optimal (minimum or maximum) feasible answer.

## How to Prepare — Study Tips with Code Example

First, internalize a single, robust binary search implementation. Use explicit `left` and `right` pointers and a loop condition of `left <= right`. Decide your mid-calculation (`left + (right - left) // 2` to avoid overflow) and be consistent with how you update boundaries based on the condition.

The most important skill is recognizing the "answer space" pattern. For any optimization problem asking for a _minimum_ or _maximum_ of something, ask: if I guess an answer, can I efficiently check if it's feasible? If yes, and feasibility is monotonic, binary search applies.

Consider the classic "Koko Eating Bananas" style problem: find the minimum integer `k` such that you can complete a task within `h` hours, where work speed is `k` units/hour. The validation function is straightforward, and the feasibility condition is monotonic (if speed `k` works, any speed faster than `k` also works).

<div class="code-group">

```python
def min_eating_speed(piles, h):
    def can_eat(k):
        hours = 0
        for p in piles:
            hours += (p + k - 1) // k  # ceil(p / k)
        return hours <= h

    left, right = 1, max(piles)
    while left <= right:
        mid = left + (right - left) // 2
        if can_eat(mid):
            right = mid - 1  # try for a smaller speed
        else:
            left = mid + 1   # need a faster speed
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
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (canEat(mid)) {
      right = mid - 1;
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
    for (int p : piles) {
        right = Math.max(right, p);
    }

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (canEat(piles, h, mid)) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

private boolean canEat(int[] piles, int h, int k) {
    long hours = 0; // Use long to avoid overflow
    for (int p : piles) {
        hours += (p + k - 1) / k; // Ceiling division
    }
    return hours <= h;
}
```

</div>

## Recommended Practice Order

1.  **Fundamentals:** Implement standard binary search, find first/last position of an element.
2.  **Answer Space Introduction:** Solve "Find Smallest Divisor Given a Threshold" or "Koko Eating Bananas" to solidify the pattern.
3.  **Yandex-Style Complexity:** Progress to problems like "Split Array Largest Sum" (allocating pages) or "Minimum Time to Complete Trips," which have more complex validation logic.
4.  **Final Review:** Attempt Yandex's specific tagged problems. Time yourself and ensure you can derive the search bounds and validation function from the problem description without hints.

[Practice Binary Search at Yandex](/company/yandex/binary-search)
