---
title: "Array Questions at Swiggy: What to Expect"
description: "Prepare for Array interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-01-28"
category: "dsa-patterns"
tags: ["swiggy", "array", "interview prep"]
---

Array questions dominate Swiggy's technical interviews, making up 24 of their 41 most frequently asked problems. This focus isn't random. Swiggy's core operations—food delivery, logistics, and real-time tracking—are built on efficiently managing ordered data. Whether it's optimizing delivery routes (a sequence of locations), managing restaurant inventories (lists of items and quantities), or tracking order statuses over time, the array is the fundamental data structure that models these sequences. Mastering array manipulation is not just about passing an interview; it's about demonstrating you can think about the core data flows that power Swiggy's platform.

## What to Expect — Types of Problems

Swiggy's array problems test practical application over theoretical complexity. You can expect a clear emphasis on real-world scenarios.

- **Two-Pointer & Sliding Window:** These are paramount. Expect questions on finding pairs or subarrays that meet a condition, such as delivery routes within a maximum distance (sum) or managing a time window for batch processing. Problems often involve sorting the array first.
- **Sorting & Searching:** Custom sorting logic is common, like ordering delivery tasks by priority and then location. Modified binary search problems also appear, reflecting the need to efficiently search through sorted operational data.
- **In-Place Array Manipulation:** Questions on rearranging, partitioning, or deduplicating arrays without extra space test memory efficiency, a key concern at scale.
- **Prefix Sum & Hashing:** Problems involving cumulative metrics (e.g., total orders per hour) or quickly checking for the existence of an item (like a restaurant ID or promo code) use these patterns.

The problems are less about obscure algorithms and more about cleanly applying these core patterns to a business constraint.

## How to Prepare — Study Tips with One Code Example

Focus on pattern recognition. Don't just solve 100 problems; solve 20 problems across 5 patterns deeply. For each problem, identify the core pattern (e.g., "this is a sorted two-pointer sum problem"). Practice verbalizing your reasoning before you code.

A critical pattern is the **Two-Pointer technique for a sorted array**. This is used for finding pairs, removing duplicates, or partitioning. Here is a classic example: finding two numbers in a sorted array that add up to a target (like finding two delivery locations whose combined distance equals a target route length).

<div class="code-group">

```python
def two_sum_sorted(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed as per common problem
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]  # Not found
```

```javascript
function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const currentSum = numbers[left] + numbers[right];
    if (currentSum === target) {
      return [left + 1, right + 1]; // 1-indexed
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [-1, -1];
}
```

```java
public int[] twoSumSorted(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;
    while (left < right) {
        int currentSum = numbers[left] + numbers[right];
        if (currentSum == target) {
            return new int[]{left + 1, right + 1}; // 1-indexed
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{-1, -1};
}
```

</div>

## Recommended Practice Order

Tackle problems in this order to build competency logically:

1.  **Basic Traversal & In-Place Operations:** Build intuition for index manipulation.
2.  **Two-Pointer on Sorted Arrays:** Master the fundamental pattern for pairs and deduplication.
3.  **Sliding Window (Fixed & Variable):** Extend two-pointer logic to subarrays.
4.  **Prefix Sum & Hashing:** Solve problems involving cumulative data or lookups.
5.  **Sorting & Custom Comparisons:** Handle ordering based on complex rules.
6.  **Modified Binary Search:** Apply search logic to rotated or partitioned arrays.

This progression mirrors increasing complexity and directly maps to the types of problems Swiggy asks.

[Practice Array at Swiggy](/company/swiggy/array)
