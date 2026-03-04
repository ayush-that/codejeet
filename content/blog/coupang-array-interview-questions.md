---
title: "Array Questions at Coupang: What to Expect"
description: "Prepare for Array interview questions at Coupang — patterns, difficulty breakdown, and study tips."
date: "2029-06-22"
category: "dsa-patterns"
tags: ["coupang", "array", "interview prep"]
---

Array questions make up nearly half of Coupang’s technical interview problems. For a company managing massive logistics networks, real-time inventory systems, and high-throughput e-commerce platforms, arrays are the fundamental data structure for organizing and processing streams of data. Your ability to manipulate arrays efficiently directly translates to handling product catalogs, order batches, delivery route coordinates, and system event logs. Expect interviewers to assess not just if you can solve a problem, but if you can implement the most performant solution under the constraints of scale that Coupang operates at.

## What to Expect — Types of Problems

Coupang’s array problems focus on practical, scalable data manipulation. You will encounter three primary categories.

**Two-Pointer and Sliding Window:** These are the most frequent patterns. They are used for problems involving sorted arrays, subarray sums, or removing duplicates—common when processing sorted lists of IDs or time-series data. Examples include finding pairs with a target sum or the longest subarray with a certain property.

**In-Place Array Modification:** Questions that require rearranging or modifying an array without using extra space are common. This tests your understanding of memory efficiency, crucial for systems handling large datasets. Problems often involve moving zeros, rearranging elements based on a condition (like parity), or applying rotations.

**Prefix Sum and Hashing:** For problems related to subarray sums or finding specific contiguous segments, the prefix sum technique is key. Often combined with a hash map, this pattern solves problems like finding the number of subarrays that sum to a target, which mirrors analyzing metrics over specific time windows.

## How to Prepare — Study Tips with One Code Example

Master the core patterns, not just individual problems. For each question, identify the underlying technique. Practice writing clean, bug-free code under time pressure. Always discuss time and space complexity first.

A critical pattern is the **Two-Pointer technique for a sorted array**. The classic problem is finding two numbers that sum to a target. The efficient approach uses a left pointer at the start and a right pointer at the end, moving them inward based on the comparison with the target sum.

<div class="code-group">

```python
def two_sum_sorted(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]
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

1.  **Two-Pointer Fundamentals:** Start with basic two-sum and remove duplicates.
2.  **Sliding Window:** Move to fixed and dynamic window problems (e.g., maximum average subarray).
3.  **In-Place Operations:** Practice problems like move zeros, sort by parity, and array rotations.
4.  **Prefix Sum & Hashing:** Tackle subarray sum problems, which are often the most challenging.
5.  **Coupang-Specific List:** Finally, work through all 24 array problems from Coupang’s tagged list to familiarize yourself with their exact style and difficulty.

[Practice Array at Coupang](/company/coupang/array)
