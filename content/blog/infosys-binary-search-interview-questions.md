---
title: "Binary Search Questions at Infosys: What to Expect"
description: "Prepare for Binary Search interview questions at Infosys — patterns, difficulty breakdown, and study tips."
date: "2027-12-22"
category: "dsa-patterns"
tags: ["infosys", "binary-search", "interview prep"]
---

Binary Search is a critical skill for Infosys interviews, with 19 dedicated questions in their problem bank—over 12% of their total technical assessment. This frequency reflects Infosys's focus on evaluating fundamental algorithmic efficiency and problem-solving logic. You are not just being tested on rote implementation; they want to see if you can identify when a problem's sorted nature or searchable property allows you to replace a linear O(n) scan with a logarithmic O(log n) solution. Mastering this pattern demonstrates you think about optimization, a key trait for the large-scale systems and data processing tasks common in Infosys projects.

## What to Expect — Types of Problems

Infosys's Binary Search questions typically fall into two categories. First, **standard application problems** where you search for a target in a sorted array or a variation like finding the first/last occurrence, the insertion point, or searching in a rotated sorted array. These test your grasp of loop invariants and handling edge cases without off-by-one errors.

The second, more common category is **applied or "search space" problems**. Here, Binary Search is the optimization engine for a larger problem. You won't be searching an explicit array for a value. Instead, you define a **monotonic function** and search over a range of possible answers to find the optimal one. Classic examples include:

- **Allocation problems:** Split an array (like books or tasks) into a fixed number of partitions while minimizing the maximum load per partition.
- **Threshold problems:** Find the smallest divisor to meet a sum threshold, or the minimum speed to complete tasks within an hour.
- **Peak or boundary finding:** Problems where an answer condition changes from "possible" to "impossible" at a specific point.

The core skill is recognizing that if you can ask a "yes/no" question (e.g., "Can I ship all packages within D days with this capacity?"), and the answer sequence is `[no, no, ..., yes, yes, yes]` as your candidate answer increases, then you can binary search for the first "yes."

## How to Prepare — Study Tips with One Code Example

Start by writing a flawless, generic Binary Search function from memory. Use clear variable names (`left`, `right`, `mid`) and decide on your loop condition (`left <= right` for inclusive bounds). The most error-resistant approach is using `mid = left + (right - left) // 2` to avoid overflow.

When tackling applied problems, practice this three-step method:

1.  **Identify the search space:** What is the range of possible answers? Define `left` (minimum possible answer) and `right` (maximum possible answer).
2.  **Define the predicate function:** Write a helper function `isFeasible(candidate)` that returns `True` if the candidate answer is workable (or `False` if not). This function often involves a greedy simulation.
3.  **Apply the binary search template:** Search for the first (or last) candidate where `isFeasible` is true.

Consider the classic **"Koko Eating Bananas"** problem: given piles of bananas and `h` hours, find the minimum integer eating speed `k` to finish all piles in `h` hours.

<div class="code-group">

```python
def minEatingSpeed(piles, h):
    def canEat(k):
        hours = 0
        for p in piles:
            hours += (p + k - 1) // k  # ceil(p / k)
        return hours <= h

    left, right = 1, max(piles)
    while left < right:
        mid = left + (right - left) // 2
        if canEat(mid):
            right = mid  # try for a smaller speed
        else:
            left = mid + 1  # need a faster speed
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
    const mid = Math.floor(left + (right - left) / 2);
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
    for (int p : piles) {
        right = Math.max(right, p);
    }

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
    long hours = 0; // Use long to avoid overflow
    for (int p : piles) {
        hours += (p + k - 1) / k; // ceiling division
    }
    return hours <= h;
}
```

</div>

## Recommended Practice Order

Build competence sequentially:

1.  **Master the classic search:** Implement binary search on a sorted array, find first/last position, and search in a rotated array.
2.  **Learn the "search space" pattern:** Solve 2-3 classic applied problems (like the banana example, "Capacity to Ship Packages," or "Find the Smallest Divisor").
3.  **Tackle Infosys-specific problems:** Work through their tagged questions. Sort them by acceptance rate or difficulty, starting with the highest acceptance to build confidence.
4.  **Simulate interview conditions:** Pick a random Infosys Binary Search problem and solve it verbally, explaining your thought process for identifying the search space and predicate function.

[Practice Binary Search at Infosys](/company/infosys/binary-search)
