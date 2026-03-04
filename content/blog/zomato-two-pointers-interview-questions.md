---
title: "Two Pointers Questions at Zomato: What to Expect"
description: "Prepare for Two Pointers interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-24"
category: "dsa-patterns"
tags: ["zomato", "two-pointers", "interview prep"]
---

Two Pointers questions appear in about 10% of Zomato's technical interviews (3 out of 29 total problems). This isn't a dominant pattern, but its presence is significant. For a company handling massive datasets related to restaurant listings, delivery logistics, and geographic searches, the Two Pointers technique is a practical tool for optimizing array and string manipulations. It demonstrates a candidate's ability to move beyond brute-force solutions to achieve O(n) time complexity with O(1) extra space—a critical skill for writing efficient code at scale.

## What to Expect — Types of Problems

Zomato's Two Pointers problems typically fall into two categories that mirror real-world platform needs.

The first is **Pair Searching in Sorted Data**. This involves finding a pair of elements in a sorted array that meets a specific condition, such as two delivery IDs whose combined value matches a target or two restaurant locations within a certain distance threshold. The classic "Two Sum II - Input Array Is Sorted" is a foundational model for these questions.

The second category is **In-Place Array/String Manipulation**. Given Zomato's focus on user-generated content (reviews, menus), questions may involve tasks like removing duplicates from a sorted list of item IDs, validating a palindrome (relevant for checking usernames or dish names), or partitioning data. These problems test your ability to process sequences efficiently without allocating extra space.

You will not encounter highly abstract or purely mathematical Two Pointers puzzles. The problems are grounded in scenarios plausible for a food-tech platform: filtering, searching, and validating ordered data streams.

## How to Prepare — Study Tips with One Code Example

Master the standard approach: sort the data if unsorted, then initialize two pointers (often at the start and end). Move them inward based on a comparison to the target condition. The core skill is correctly deciding which pointer to move and when.

Practice this pattern on the fundamental "Two Sum II" problem. The goal is to find the 1-indexed positions of two numbers in a sorted array that add up to a target.

<div class="code-group">

```python
def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1  # Need a larger sum
        else:
            right -= 1  # Need a smaller sum
    return [-1, -1]
```

```javascript
function twoSum(numbers, target) {
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
  return [-1, -1];
}
```

```java
public int[] twoSum(int[] numbers, int target) {
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
    return new int[]{-1, -1};
}
```

</div>

Internalize this logic. Then, practice variants where pointers might both start at the beginning for problems like removing duplicates.

## Recommended Practice Order

Build competence sequentially. Start with the basic pair-search pattern ("Two Sum II", "3Sum"). Next, tackle in-place manipulation problems ("Remove Duplicates from Sorted Array", "Valid Palindrome"). Finally, combine concepts with slightly more complex scenarios like "Container With Most Water" or "Trapping Rain Water," which use the Two Pointers technique to optimize area or volume calculations—analogous to optimizing delivery ranges or resource allocation.

Focus on writing clean, bug-free code for these patterns. In an interview, clearly explain your pointer movement logic before you start coding.

[Practice Two Pointers at Zomato](/company/zomato/two-pointers)
