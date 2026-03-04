---
title: "Two Pointers Questions at Capgemini: What to Expect"
description: "Prepare for Two Pointers interview questions at Capgemini — patterns, difficulty breakdown, and study tips."
date: "2030-05-08"
category: "dsa-patterns"
tags: ["capgemini", "two-pointers", "interview prep"]
---

Two Pointers is a high-frequency pattern at Capgemini, appearing in 9 out of 36 of their coding problems. This means roughly 25% of their technical screen questions can be efficiently solved using this technique. Mastering it is not optional; it's a direct efficiency multiplier for your interview performance. The pattern is favored because it tests fundamental algorithmic thinking—transforming an O(n²) brute-force solution into an elegant O(n) one—while also evaluating your ability to manipulate indices and reason about sorted data. For a company that handles large-scale enterprise systems, demonstrating you can write optimized, clean code is paramount.

## What to Expect — Types of Problems

Capgemini's Two Pointers questions typically fall into three categories. First, **pair search in a sorted array**, where you find two numbers that meet a condition, like summing to a target. Second, **in-place array manipulation**, such as removing duplicates or segregating elements (e.g., moving all zeros to the end). Third, **sequence comparison or validation**, like checking for a palindrome or finding a contiguous subarray. The problems often involve sorted input, but some variations require you to sort the data first as a preprocessing step. Expect the constraints to emphasize optimal time and space complexity, pushing you beyond naive solutions.

## How to Prepare — Study Tips with One Code Example

Focus on the core mechanic: using two indices (often named `left` and `right`) that traverse a linear data structure from different positions. Start by identifying problems where the solution involves comparing or combining elements. A reliable strategy is: 1) Sort the array if it's not already sorted, 2) Initialize pointers, 3) Use a while loop to move them based on a condition, and 4) Process the elements at the pointer positions.

Consider the classic "Two Sum II - Input Array Is Sorted" problem. The brute-force approach checks every pair (O(n²)). The Two Pointers solution starts at both ends and moves inward based on the sum comparison.

<div class="code-group">

```python
def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []
```

```javascript
function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}
```

```java
public int[] twoSum(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            return new int[]{left + 1, right + 1};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{};
}
```

</div>

## Recommended Practice Order

Build competency progressively. Begin with fundamental pair-search problems (Two Sum, Three Sum). Move to in-place operations (Remove Duplicates, Move Zeroes). Then tackle sliding window variants (a close relative of Two Pointers) like Maximum Subarray. Finally, practice hybrid problems that combine sorting with pointer logic. Always code by hand first, then test your solutions. Time yourself to simulate interview pressure.

[Practice Two Pointers at Capgemini](/company/capgemini/two-pointers)
