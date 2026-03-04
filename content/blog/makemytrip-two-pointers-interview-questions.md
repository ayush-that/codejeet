---
title: "Two Pointers Questions at MakeMyTrip: What to Expect"
description: "Prepare for Two Pointers interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-21"
category: "dsa-patterns"
tags: ["makemytrip", "two-pointers", "interview prep"]
---

Two Pointers is a critical pattern to master for MakeMyTrip interviews. With 3 out of their 24 total coding questions dedicated to this technique, it represents a significant 12.5% of their problem set. This frequency signals that interviewers actively test your ability to optimize solutions by reducing time complexity, often from O(n²) to O(n), which is essential for efficient travel algorithms dealing with schedules, pricing, or sorted data like flight timings and hotel availability.

## What to Expect — Types of Problems

MakeMyTrip’s Two Pointers questions typically fall into two categories, both involving sorted data structures.

1.  **Pair Search in Sorted Arrays:** The most common type. You’ll be given a sorted array and a target (e.g., a budget or a total travel time) and asked to find a pair of elements that meets a condition. Classic examples are "Two Sum" on a sorted array or finding the pair with a sum closest to a target—directly applicable to matching a customer’s budget with two combined service prices.

2.  **In-Place Array Manipulation:** This involves processing an array with two pointers moving from the same end. A frequent problem is removing duplicates from a sorted array in-place, which mirrors cleaning and deduplicating sorted lists of flight IDs or hotel records.

Expect the input to be pre-sorted. Your task is rarely to sort it, but to leverage its sorted nature for an efficient scan.

## How to Prepare — Study Tips with One Code Example

Focus on the core pattern: initialize two pointers (often at the start and end of a sorted array), then move them inward based on a comparison with your target. This converges to a solution in linear time.

Practice this by writing the algorithm for "Two Sum II - Input Array Is Sorted" from memory. Here is the key pattern implemented across languages:

<div class="code-group">

```python
def two_sum_sorted(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1  # Need a larger sum
        else:
            right -= 1  # Need a smaller sum
    return []
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
      left++; // Need a larger sum
    } else {
      right--; // Need a smaller sum
    }
  }
  return [];
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
            left++; // Need a larger sum
        } else {
            right--; // Need a smaller sum
        }
    }
    return new int[]{};
}
```

</div>

**Study Tip:** Internalize the logic of pointer movement. If the sum is too small, increment the left pointer to increase it. If the sum is too large, decrement the right pointer to decrease it. This only works because the array is sorted.

## Recommended Practice Order

Build competency in this sequence:

1.  **Fundamentals:** Two Sum II (as above), Valid Palindrome.
2.  **Core Patterns:** 3Sum, Remove Duplicates from Sorted Array, Container With Most Water.
3.  **MakeMyTrip Focus:** Practice problems involving "closest to target" and "pairs with a specific difference." These are direct analogs for matching budgets or time windows.

Mastering these 6-8 core problems will prepare you for the variations presented in the interview.

[Practice Two Pointers at MakeMyTrip](/company/makemytrip/two-pointers)
