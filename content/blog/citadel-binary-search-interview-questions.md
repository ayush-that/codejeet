---
title: "Binary Search Questions at Citadel: What to Expect"
description: "Prepare for Binary Search interview questions at Citadel — patterns, difficulty breakdown, and study tips."
date: "2028-07-29"
category: "dsa-patterns"
tags: ["citadel", "binary-search", "interview prep"]
---

## Why Binary Search Matters at Citadel

Citadel’s 11 Binary Search questions out of 96 total problems on their tagged list isn’t just a statistic—it’s a signal. In my experience interviewing there and coaching candidates, Binary Search appears in roughly 1 in 3 technical screens and on-sites. Why? Because Citadel’s problems often involve searching through sorted financial data, optimizing resource allocation, or finding thresholds in time-series data. It’s not treated as a trivial “find an element” exercise. Instead, they use it as a framework for solving optimization problems where the naive solution is too slow. If you’re interviewing at Citadel, you must be comfortable recognizing when a problem has a _search space_ that can be halved, even if the array isn’t explicitly sorted.

## Specific Patterns Citadel Favors

Citadel’s Binary Search problems tend to fall into three distinct categories, ordered by frequency:

1.  **Search in a Sorted but Rotated or Modified Array:** They love to test if you understand the invariant that one side of the midpoint is always sorted. This pattern appears in problems like **Search in Rotated Sorted Array (LeetCode #33)** and **Find Minimum in Rotated Sorted Array (LeetCode #153)**. The twist is often that the array may contain duplicates.

2.  **Binary Search on Answer (or "Guess the Answer"):** This is the most frequent and critical pattern. The problem presents a scenario where you need to find a minimum or maximum value (like a capacity, a threshold, or a distance) that satisfies a certain condition. The "array" is implicit—your search space is the range of possible answers. **Koko Eating Bananas (LeetCode #875)** is a classic example. You’re not searching an array for `k`; you’re searching the _space of possible eating speeds_ to find the minimum `k` that works.

3.  **Finding Boundaries in a Monotonic Function:** Closely related to the above, this involves finding the first or last position where a condition becomes true or false. Think **First Bad Version (LeetCode #278)**. At Citadel, this might be framed as finding the first day a trading signal exceeds a threshold or the last price point before a market shift.

Notice what’s _not_ heavily emphasized: the vanilla binary search on a simple sorted list. They assume you know that. The test is applying the _principle_ to non-obvious scenarios.

## How to Prepare

The key is to internalize the template for the "Binary Search on Answer" pattern. Let’s break down the universal structure using the Koko Eating Bananas problem.

The core logic is always the same:

1.  Identify the search space (`low`, `high`).
2.  Write a helper function `canDo(guess)` that returns `True` if the proposed answer (`guess`) is feasible.
3.  Use a standard binary search to find the _minimum_ feasible answer (or maximum, depending on the problem).

Here is the template in action:

<div class="code-group">

```python
# LeetCode #875: Koko Eating Bananas
# Time: O(n * log m) where n = len(piles), m = max(piles) | Space: O(1)
def minEatingSpeed(piles, h):
    # 1. Define search space: min speed is 1, max speed is the largest pile.
    low, high = 1, max(piles)

    while low < high:
        mid = (low + high) // 2
        # 2. Helper: Can Koko finish with speed = mid?
        if can_finish(piles, h, mid):
            high = mid  # Try for a smaller speed (search left)
        else:
            low = mid + 1  # Speed too slow, need faster (search right)
    return low  # or high, they converge

def can_finish(piles, h, speed):
    total_hours = 0
    for bananas in piles:
        total_hours += (bananas + speed - 1) // speed  # Ceiling division
        if total_hours > h:
            return False
    return True
```

```javascript
// LeetCode #875: Koko Eating Bananas
// Time: O(n * log m) where n = piles.length, m = Math.max(...piles) | Space: O(1)
function minEatingSpeed(piles, h) {
  let low = 1;
  let high = Math.max(...piles);

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (canFinish(piles, h, mid)) {
      high = mid; // Try a slower speed
    } else {
      low = mid + 1; // Need a faster speed
    }
  }
  return low;
}

function canFinish(piles, h, speed) {
  let totalHours = 0;
  for (const bananas of piles) {
    totalHours += Math.ceil(bananas / speed);
    if (totalHours > h) return false;
  }
  return true;
}
```

```java
// LeetCode #875: Koko Eating Bananas
// Time: O(n * log m) where n = piles.length, m = max(piles) | Space: O(1)
public int minEatingSpeed(int[] piles, int h) {
    int low = 1;
    int high = 0;
    for (int pile : piles) {
        high = Math.max(high, pile);
    }

    while (low < high) {
        int mid = low + (high - low) / 2;
        if (canFinish(piles, h, mid)) {
            high = mid; // Search left for a smaller valid speed
        } else {
            low = mid + 1; // Search right
        }
    }
    return low;
}

private boolean canFinish(int[] piles, int h, int speed) {
    long totalHours = 0; // Use long to prevent overflow
    for (int bananas : piles) {
        totalHours += (bananas + speed - 1) / speed; // Ceiling division
        if (totalHours > h) return false;
    }
    return true;
}
```

</div>

For rotated array problems, master this pattern: after finding the midpoint, _always check which side is sorted_ and then determine if your target lies within that sorted portion.

<div class="code-group">

```python
# LeetCode #33: Search in Rotated Sorted Array
# Time: O(log n) | Space: O(1)
def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid

        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target is in the sorted left half
            else:
                left = mid + 1   # Target is in the right half
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target is in the sorted right half
            else:
                right = mid - 1  # Target is in the left half
    return -1
```

```javascript
// LeetCode #33: Search in Rotated Sorted Array
// Time: O(log n) | Space: O(1)
function search(nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    // Determine which side is properly sorted
    if (nums[left] <= nums[mid]) {
      // Left side is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right side is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}
```

```java
// LeetCode #33: Search in Rotated Sorted Array
// Time: O(log n) | Space: O(1)
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        if (nums[left] <= nums[mid]) { // Left half sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else { // Right half sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}
```

</div>

## How Citadel Tests Binary Search vs Other Companies

At large tech companies (FAANG), Binary Search is often a component of a larger problem or a straightforward assessment of fundamentals. At Citadel, it’s frequently _the entire problem_, but with a clever disguise. The difficulty isn’t in the binary search logic itself—it’s in the **problem framing**.

- **Meta/Google:** Might embed binary search in a 2D matrix search or as part of a system design trade-off discussion.
- **Citadel:** Will present a business constraint ("minimize the maximum shipping capacity," "find the earliest profitable timestamp") and expect you to deduce that the optimal solution involves searching over the space of possible answers. The helper function `canDo()` is where they test your ability to model the real-world constraint. They care less about you knowing the algorithm verbatim and more about you applying the _divide-and-conquer optimization strategy_.

## Study Order

Tackle these sub-topics in this order to build a logical progression:

1.  **Classic Binary Search:** Ensure you can implement iterative and recursive versions flawlessly on a simple sorted array. This is your foundation. (LeetCode #704)
2.  **Finding Boundaries:** Learn to find the first/last occurrence of a target. This teaches you how to adjust the `mid` calculation and loop condition to avoid off-by-one errors. (LeetCode #34)
3.  **Search in Rotated Sorted Array:** This forces you to think about sorted sub-arrays and invariants, a crucial mental shift. Do the version without duplicates first. (LeetCode #33, #153)
4.  **Binary Search on Answer:** This is the climax. Start with the most famous examples to understand the "guess and check" pattern. (LeetCode #875, #1011)
5.  **Advanced Applications:** Finally, tackle problems where the monotonic function or search space is very non-obvious, like in matrix problems or with custom data structures. (LeetCode #378, #410)

This order works because it moves from concrete application (find a number) to abstract principle (find the minimum feasible value that satisfies a complex condition), which is exactly how Citadel interviews progress.

## Recommended Practice Order

Solve these problems in sequence. Each one introduces a slight twist that builds towards Citadel's style.

1.  **Binary Search (LeetCode #704)** - Warm up.
2.  **Find First and Last Position of Element in Sorted Array (LeetCode #34)** - Master boundary searches.
3.  **Search in Rotated Sorted Array (LeetCode #33)** - Learn the sorted-half invariant.
4.  **Find Minimum in Rotated Sorted Array (LeetCode #153)** - A simpler variant of #33.
5.  **First Bad Version (LeetCode #278)** - Introduction to the "find first true" pattern.
6.  **Koko Eating Bananas (LeetCode #875)** - Your first major "Binary Search on Answer" problem.
7.  **Capacity To Ship Packages Within D Days (LeetCode #1011)** - Same pattern as #875, different context.
8.  **Split Array Largest Sum (LeetCode #410)** - A harder optimization variant; very Citadel-like.
9.  **Search in Rotated Sorted Array II (LeetCode #81)** - Handle duplicates, a common Citadel follow-up.
10. **Find Peak Element (LeetCode #162)** - Binary search on a non-sorted but locally monotonic function.

Master this progression, and you’ll be able to deconstruct any Binary Search problem Citadel throws at you, no matter how it’s disguised.

[Practice Binary Search at Citadel](/company/citadel/binary-search)
