---
title: "Array Questions at MakeMyTrip: What to Expect"
description: "Prepare for Array interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-09"
category: "dsa-patterns"
tags: ["makemytrip", "array", "interview prep"]
---

Array questions dominate MakeMyTrip’s technical interviews, making up 13 of the 24 most frequently asked problems. This focus isn’t random. Arrays are the fundamental data structure for handling ordered data—perfect for modeling real-world travel scenarios like flight schedules, hotel booking dates, seat arrangements, and pricing lists. Mastering array manipulation is essential because it tests a candidate’s core ability to process sequences efficiently, a daily requirement for building and optimizing MakeMyTrip’s travel platforms.

## What to Expect — Types of Problems

The array problems at MakeMyTrip generally fall into three practical categories:

1.  **Two-Pointer Techniques:** Used for problems involving sorted data, pair sums, or removing duplicates. Expect questions like finding two numbers in a sorted array that add up to a target (common for flight combinations).
2.  **Sliding Window:** Central for questions about contiguous subarrays. This is frequently applied to problems like finding the maximum sum subarray of a fixed size (e.g., analyzing a fixed-day travel package) or the smallest subarray with a sum greater than a target.
3.  **In-Place Array Manipulation:** Tests your ability to modify an array using O(1) extra space. Common tasks include rotating an array, moving all zeros to the end, or rearranging positive and negative numbers—operations analogous to reorganizing booking lists or inventory.

You will rarely see highly abstract or purely mathematical array puzzles. The problems are grounded in logical data processing.

## How to Prepare — Study Tips with One Code Example

Start by solidifying the three core patterns above. Practice by first drawing the logic on a whiteboard, then coding. Always discuss time and space complexity. For each problem, ask: "Could this be solved with a hash map, or do pointers provide a more efficient solution?"

A key pattern to internalize is the **Two-Pointer technique for a sorted array**. Here is a classic example: finding two numbers that sum to a target.

<div class="code-group">

```python
def two_sum_sorted(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]  # 1-based indices
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
      return [left + 1, right + 1]; // 1-based indices
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
            return new int[]{left + 1, right + 1}; // 1-based indices
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

Tackle problems in this sequence to build competency logically:

1.  **Basics:** Start with fundamental in-place operations (e.g., Remove Duplicates from Sorted Array).
2.  **Two-Pointer:** Move to pair-sum and validation problems using the two-pointer approach.
3.  **Sliding Window:** Practice fixed-size and dynamic-size window problems to understand boundary handling.
4.  **Combination Patterns:** Finally, solve problems that may require a mix of techniques, like using a hash map alongside array traversal for more complex conditions.

This progression ensures you build from simple manipulation to efficient, pattern-based problem-solving.

[Practice Array at MakeMyTrip](/company/makemytrip/array)
