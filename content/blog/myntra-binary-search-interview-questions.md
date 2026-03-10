---
title: "Binary Search Questions at Myntra: What to Expect"
description: "Prepare for Binary Search interview questions at Myntra — patterns, difficulty breakdown, and study tips."
date: "2031-04-29"
category: "dsa-patterns"
tags: ["myntra", "binary-search", "interview prep"]
---

## Why Binary Search Matters at Myntra

Myntra’s interview process includes a significant technical screening round, often with 2–3 coding problems in 60–90 minutes. With Binary Search appearing in roughly 8% of their problem set (2 out of 24), it’s not the most frequent topic, but it’s a high-signal one. When it does appear, it’s rarely the vanilla “find an element in a sorted array” question. Instead, Myntra uses Binary Search to assess whether you can recognize when a sorted or monotonic property exists in a non-obvious scenario—a skill directly applicable to their e-commerce domain. Think of problems like finding the optimal price point, the minimum server capacity for peak traffic, or the earliest delivery time that satisfies all constraints. If you get a Binary Search question at Myntra, it’s often a medium-to-hard problem designed to test your ability to reduce a complex optimization problem into a search space.

## Specific Patterns Myntra Favors

Myntra’s Binary Search questions tend to fall into two categories:

1. **Search on Answer (or Binary Search on a Range)**: Instead of searching an explicit array, you binary search over a possible range of answers, using a helper function to check feasibility. This pattern is common in optimization problems. For example, LeetCode 410 “Split Array Largest Sum” is a classic—it asks for the minimum possible largest sum when splitting an array into k subarrays. The “answer” is a sum between max(nums) and sum(nums), and you check if a given sum limit is feasible.

2. **Modified Binary Search in Rotated or Partially Sorted Data**: Problems where the array is rotated or has a pivot, requiring you to adapt the standard Binary Search logic. LeetCode 33 “Search in Rotated Sorted Array” is a foundational example. Myntra might extend this to scenarios like searching in a nearly sorted log of user activity timestamps.

They rarely ask pure “find the index” problems. The twist is always in framing: you need to identify the monotonic condition that enables binary search.

## How to Prepare

The key is mastering the template for Binary Search on Answer. Let’s break down the pattern with a code example for a problem like “Find the smallest capacity for a ship to ship packages within D days” (LeetCode 1011).

<div class="code-group">

```python
def shipWithinDays(weights, days):
    def canShip(capacity):
        # Helper: check if we can ship all packages within 'days' using given capacity
        current_load = 0
        needed_days = 1
        for w in weights:
            if current_load + w > capacity:
                needed_days += 1
                current_load = 0
            current_load += w
        return needed_days <= days

    # Binary search on the possible capacity range
    left, right = max(weights), sum(weights)
    while left < right:
        mid = (left + right) // 2
        if canShip(mid):
            right = mid  # Try for a smaller capacity
        else:
            left = mid + 1  # Need more capacity
    return left

# Time: O(n log s) where n = len(weights), s = sum(weights) - max(weights)
# Space: O(1)
```

```javascript
function shipWithinDays(weights, days) {
  const canShip = (capacity) => {
    let currentLoad = 0;
    let neededDays = 1;
    for (let w of weights) {
      if (currentLoad + w > capacity) {
        neededDays++;
        currentLoad = 0;
      }
      currentLoad += w;
    }
    return neededDays <= days;
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

// Time: O(n log s) | Space: O(1)
```

```java
public int shipWithinDays(int[] weights, int days) {
    // Helper method to check feasibility
    auto canShip = [&](int capacity) -> bool {
        int currentLoad = 0;
        int neededDays = 1;
        for (int w : weights) {
            if (currentLoad + w > capacity) {
                neededDays++;
                currentLoad = 0;
            }
            currentLoad += w;
        }
        return neededDays <= days;
    };

    int left = 0, right = 0;
    for (int w : weights) {
        left = Math.max(left, w);
        right += w;
    }

    while (left < right) {
        int mid = left + (right - left) / 2;
        if (canShip(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

// Time: O(n log s) | Space: O(1)
```

</div>

Notice the pattern: define a feasible function, set the search bounds based on the problem constraints, and use binary search to converge to the minimal feasible answer.

## How Myntra Tests Binary Search vs Other Companies

At large tech companies like Google or Meta, Binary Search questions often appear as part of a harder problem, sometimes combined with other data structures (e.g., Binary Search in a matrix, or with a heap). At Myntra, the problems are more likely to be standalone and focused on practical optimization—like allocating resources, scheduling tasks, or minimizing some cost function. The difficulty is similar to a LeetCode medium, but the context is often tied to e-commerce or logistics. You might be asked to find the minimum number of servers needed to handle request peaks or the earliest time all orders can be processed. The unique aspect is the real-world framing: they want to see if you can translate a business constraint into a search problem.

## Study Order

1. **Standard Binary Search**: Get comfortable with the basic iterative implementation on a sorted array. Understand the difference between `while left <= right` and `while left < right` and how to avoid infinite loops.
2. **Search in Rotated Sorted Array**: Learn to handle pivots and uneven halves. This teaches you to identify sorted portions dynamically.
3. **Binary Search on Answer**: Practice problems where you search over a range of possible answers. This is the most frequent pattern at Myntra.
4. **Advanced Variations**: Problems like finding peaks (LeetCode 162) or searching in 2D sorted matrices (LeetCode 74). These are less common but good for depth.

This order builds from the fundamental mechanic to the applied pattern you’ll most likely see.

## Recommended Practice Order

Solve these problems in sequence to build up to Myntra’s typical questions:

1. **LeetCode 704: Binary Search** – Warm-up with the standard algorithm.
2. **LeetCode 33: Search in Rotated Sorted Array** – Handle rotated data.
3. **LeetCode 34: Find First and Last Position of Element in Sorted Array** – Practice with duplicates and boundary finding.
4. **LeetCode 875: Koko Eating Bananas** – Classic “search on answer” problem with a clear feasibility check.
5. **LeetCode 1011: Capacity To Ship Packages Within D Days** – Directly applicable to Myntra’s domain.
6. **LeetCode 410: Split Array Largest Sum** – A harder variation that solidifies the pattern.

Each problem introduces a new twist while reinforcing the core idea: find the monotonic condition, define the search space, and implement a feasibility check.

Here’s another essential pattern: searching in a rotated array. This is a common follow-up to see if you understand edge cases.

<div class="code-group">

```python
def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        # Check which half is sorted
        if nums[left] <= nums[mid]:  # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1

# Time: O(log n) | Space: O(1)
```

```javascript
function search(nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}

// Time: O(log n) | Space: O(1)
```

```java
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}

// Time: O(log n) | Space: O(1)
```

</div>

The key insight is to always identify the sorted half of the current range and determine if the target lies within it.

When preparing for Myntra, focus on the “search on answer” pattern and practice articulating why binary search applies—especially the monotonic relationship. In the interview, explain your thought process clearly: define the search space, state the feasibility condition, and then implement. They care as much about your problem-solving approach as the correct code.

[Practice Binary Search at Myntra](/company/myntra/binary-search)
