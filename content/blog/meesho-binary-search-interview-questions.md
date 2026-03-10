---
title: "Binary Search Questions at Meesho: What to Expect"
description: "Prepare for Binary Search interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-11-23"
category: "dsa-patterns"
tags: ["meesho", "binary-search", "interview prep"]
---

## Why Binary Search Matters at Meesho

Meesho is a high-growth e-commerce platform in India, operating in a hyper-competitive market where performance and scalability are non-negotiable. Their engineering challenges often involve searching through massive datasets—product catalogs, user sessions, inventory logs—to deliver features like personalized recommendations, price filtering, and delivery time estimates. This isn't academic; it's about finding a needle in a haystack, fast.

With 5 out of 44 tagged problems being Binary Search, it represents over 11% of their technical question bank. In real interviews, you have a strong chance of encountering at least one Binary Search variant, often in the second technical round where they assess algorithmic optimization. They don't ask it to check if you know the textbook algorithm; they ask it to see if you can recognize when a search space isn't just a sorted array, but can be a range of possible answers, a timeline, or a configuration of resources. It's a core focus area for evaluating a candidate's ability to move beyond brute force.

## Specific Patterns Meesho Favors

Meesho's Binary Search problems tend to avoid the classic "find target in sorted array" (LeetCode #704). Instead, they favor **applied search on answer** and **search in rotated or modified arrays**. These patterns mirror real-world scenarios: finding the minimum capacity for a server, the optimal price point, or a record in a log that was cyclically shifted.

The two most frequent patterns are:

1.  **Binary Search on Answer (or "Search Space Reduction"):** The problem asks for a minimum or maximum value (like the smallest possible capacity, the earliest time, the largest minimum distance) that satisfies a certain condition. The brute-force approach would be to check every possible answer linearly. The insight is that if a value `X` works, then all values greater (or lesser) than `X` might also work, creating a monotonic condition perfect for binary search. The challenge is writing the helper function `canWeDoThisWithValue(x)`.
2.  **Search in a Rotated or Partially Sorted Array:** Data isn't always perfectly sorted. A log file might be rotated, or a cache might be partitioned. Meesho problems test your ability to adapt the basic binary search logic to handle a pivot point where one half of the array is sorted and the other isn't. The key is to always determine which side is properly sorted and then check if your target lies within that sorted range.

A classic example combining these ideas is **"Capacity To Ship Packages Within D Days" (LeetCode #1011)**, a quintessential "search on answer" problem. Another is **"Search in Rotated Sorted Array" (LeetCode #33)**, which tests your adaptability.

<div class="code-group">

```python
# Pattern: Binary Search on Answer (LeetCode #1011)
# Problem: Find the least weight capacity of a ship to ship all packages within D days.
# Time: O(n * log(sum(weights))) | Space: O(1)
def shipWithinDays(weights, days):
    def canShip(capacity):
        current_load = 0
        needed_days = 1
        for w in weights:
            if current_load + w > capacity:
                needed_days += 1
                current_load = 0
            current_load += w
            if needed_days > days:
                return False
        return True

    # Search space: max(weights) to sum(weights)
    left, right = max(weights), sum(weights)
    while left < right:
        mid = (left + right) // 2
        if canShip(mid):
            right = mid  # Try for a smaller capacity
        else:
            left = mid + 1  # Need a larger capacity
    return left
```

```javascript
// Pattern: Binary Search on Answer (LeetCode #1011)
// Time: O(n * log(sum(weights))) | Space: O(1)
function shipWithinDays(weights, days) {
  const canShip = (capacity) => {
    let currentLoad = 0;
    let neededDays = 1;
    for (const w of weights) {
      if (currentLoad + w > capacity) {
        neededDays++;
        currentLoad = 0;
        if (neededDays > days) return false;
      }
      currentLoad += w;
    }
    return true;
  };

  let left = Math.max(...weights);
  let right = weights.reduce((a, b) => a + b, 0);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canShip(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}
```

```java
// Pattern: Binary Search on Answer (LeetCode #1011)
// Time: O(n * log(sum(weights))) | Space: O(1)
public int shipWithinDays(int[] weights, int days) {
    int left = 0, right = 0;
    for (int w : weights) {
        left = Math.max(left, w);
        right += w;
    }
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (canShip(weights, days, mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

private boolean canShip(int[] weights, int days, int capacity) {
    int currentLoad = 0;
    int neededDays = 1;
    for (int w : weights) {
        if (currentLoad + w > capacity) {
            neededDays++;
            currentLoad = 0;
            if (neededDays > days) return false;
        }
        currentLoad += w;
    }
    return true;
}
```

</div>

## How to Prepare

Your preparation should be methodical. First, internalize the standard binary search template to avoid infinite loops. Then, practice identifying the "search space" and the "condition" separately.

1.  **Template First:** Write a bug-free binary search loop. Use `while (left < right)` and decide carefully between `mid = (left+right)//2` and `mid = (left+right+1)//2` based on your condition.
2.  **Pattern Recognition Drill:** For any problem asking for a "minimum possible maximum" or "maximum possible minimum," immediately think "Binary Search on Answer." Ask yourself: "If I guess the answer is X, can I write a function to check if it's feasible?" If yes, you've reduced the problem.
3.  **Rotated Array Logic:** For rotated arrays, the core skill is comparing `nums[mid]` with `nums[left]` or `nums[right]` to deduce which half is sorted, and then checking if the target lies within that sorted half.

<div class="code-group">

```python
# Pattern: Search in Rotated Sorted Array (LeetCode #33)
# Time: O(log n) | Space: O(1)
def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid

        # Check if left half [left...mid] is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target is in the sorted left half
            else:
                left = mid + 1   # Target is in the right half
        else:  # Right half [mid...right] must be sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target is in the sorted right half
            else:
                right = mid - 1  # Target is in the left half
    return -1
```

```javascript
// Pattern: Search in Rotated Sorted Array (LeetCode #33)
// Time: O(log n) | Space: O(1)
function search(nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
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
// Pattern: Search in Rotated Sorted Array (LeetCode #33)
// Time: O(log n) | Space: O(1)
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        if (nums[left] <= nums[mid]) { // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else { // Right half is sorted
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

## How Meesho Tests Binary Search vs Other Companies

Compared to FAANG companies, Meesho's Binary Search questions are less about obscure variations and more about **practical application**. A company like Google might ask a Binary Search intertwined with a custom data structure or a very abstract monotonic function. Amazon might frame it within a system design context (e.g., finding server load).

Meesho's questions tend to be **directly tied to e-commerce operations**. The "search space" often represents a business constraint: a budget, a time window, a resource limit. They test if you can model a real-world optimization problem (minimizing cost, maximizing throughput) as a search problem. The difficulty is in the modeling, not the implementation of the search itself. They want to see clear, logical reasoning about why binary search applies, a correctly implemented feasibility check, and clean code.

## Study Order

Follow this progression to build a solid understanding without getting overwhelmed:

1.  **Standard Binary Search:** Master the loop invariant and template on a simple sorted array (LeetCode #704). This is your foundation.
2.  **Search with Duplicates & Rotated Arrays:** Learn to handle non-ideal data (LeetCode #81, #33). This teaches you to analyze subarray properties (`nums[left] <= nums[mid]`).
3.  **Binary Search on Answer (1D):** Practice problems where the search space is a range of integers (LeetCode #1011, #410). Focus on writing the `isFeasible()` function.
4.  **Binary Search on Answer (2D/Matrix):** Extend the pattern to a 2D sorted matrix (LeetCode #74, #240). This solidifies the "search space" concept.
5.  **Advanced Applications:** Tackle problems where the monotonic function is less obvious, like finding peaks (LeetCode #162) or sqrt calculations (LeetCode #69). This is for final polish.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous pattern.

1.  **Binary Search (LeetCode #704)** - The absolute basic.
2.  **Search in Rotated Sorted Array (LeetCode #33)** - Learn the rotated array logic.
3.  **Find Minimum in Rotated Sorted Array (LeetCode #153)** - A slight twist on the pattern.
4.  **Capacity To Ship Packages Within D Days (LeetCode #1011)** - Your first major "search on answer" problem.
5.  **Split Array Largest Sum (LeetCode #410)** - A harder variant of #1011, excellent practice.
6.  **Search a 2D Matrix (LeetCode #74)** - Apply binary search in two dimensions.
7.  **Find Peak Element (LeetCode #162)** - Recognize binary search on a non-sorted but monotonic condition.

This sequence takes you from the basic algorithm to the exact patterns Meesho employs, ensuring you're not just memorizing solutions but understanding how to deconstruct their problems.

[Practice Binary Search at Meesho](/company/meesho/binary-search)
