---
title: "Array Questions at Zepto: What to Expect"
description: "Prepare for Array interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-11-28"
category: "dsa-patterns"
tags: ["zepto", "array", "interview prep"]
---

Array questions dominate Zepto's technical interviews, making up 21 of their 28 most frequently asked problems. This focus isn't random. Zepto's core business—10-minute grocery delivery—relies on real-time systems for inventory management, order batching, delivery route optimization, and tracking live location data. These systems fundamentally operate on sequences of items: lists of products, arrays of delivery coordinates, queues of pending orders, and streams of time-series data. Mastering array manipulation is therefore not just about solving algorithmic puzzles; it's about demonstrating the foundational skill needed to build and optimize the high-performance, data-intensive applications that power Zepto's operations.

## What to Expect — Types of Problems

Zepto's array problems test your ability to transform, analyze, and extract information from data sequences under constraints. You can expect three primary categories:

1.  **In-Place Manipulation:** Problems requiring you to modify the array without using significant extra space. This tests understanding of two-pointer techniques (for sorted data, removing duplicates, or partitioning) and cyclic sort for arrays containing a limited range of numbers.
2.  **Subarray Analysis:** Questions focused on contiguous segments of the array. This includes finding subarrays with a target sum (using prefix sums or sliding window), calculating maximum/minimum sums (Kadane's algorithm), or solving problems related to product, average, or specific patterns within a window.
3.  **Sorting, Searching, and Hashing:** Classic problems that involve efficient lookup, pairing elements, or finding missing/duplicate numbers. These often combine sorting or the use of hash maps (dictionaries/objects) for O(1) access to achieve optimal time complexity.

## How to Prepare — Study Tips with One Code Example

Start by deeply understanding the fundamental patterns: two-pointers, sliding window, prefix sum, and hashing. Practice implementing them from scratch. Then, apply these patterns to Zepto's specific problem list. For each problem, first clarify the input, output, and edge cases (empty array, single element, large values). Verbally walk through your logic before coding.

A key pattern is the **two-pointer technique for in-place operations**, such as removing duplicates from a sorted array. The idea is to use one pointer (`write`) to track the position of the next unique element and another (`read`) to scan through the array.

<div class="code-group">

```python
def remove_duplicates(nums):
    if not nums:
        return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[write - 1]:
            nums[write] = nums[read]
            write += 1
    return write
```

```javascript
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[write - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}
```

```java
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int write = 1;
    for (int read = 1; read < nums.length; read++) {
        if (nums[read] != nums[write - 1]) {
            nums[write] = nums[read];
            write++;
        }
    }
    return write;
}
```

</div>

## Recommended Practice Order

Tackle problems in order of increasing conceptual complexity to build confidence and reinforce patterns.

1.  **Foundation:** Begin with basic in-place operations (Remove Duplicates, Move Zeroes) and simple hashing problems (Two Sum).
2.  **Subarray Patterns:** Progress to sliding window (Maximum Average Subarray) and prefix sum problems.
3.  **Advanced Manipulation:** Finally, solve problems requiring combinations of techniques, like sorting plus two-pointers or more complex in-place rearrangements.

[Practice Array at Zepto](/company/zepto/array)
