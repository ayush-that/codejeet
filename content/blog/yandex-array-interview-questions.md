---
title: "Array Questions at Yandex: What to Expect"
description: "Prepare for Array interview questions at Yandex — patterns, difficulty breakdown, and study tips."
date: "2028-02-22"
category: "dsa-patterns"
tags: ["yandex", "array", "interview prep"]
---

Array questions make up exactly half of Yandex's technical interview problem set. This isn't a coincidence. Arrays are the fundamental data structure for representing sequences, lists, and matrices—core to search engine indexing, geospatial data (Yandex Maps), ride-hailing logistics (Yandex Go), and real-time analytics. Your ability to manipulate arrays efficiently directly tests your capacity for writing the performant, memory-conscious code required in Yandex's large-scale systems. Expect array problems to be a primary filter in their interview process.

## What to Expect — Types of Problems

Yandex's array problems are practical and often map to real-world scenarios. You can categorize them into several key types:

1.  **In-Place Manipulation:** Problems requiring you to modify the array without using extra space (O(1) auxiliary space). This tests your understanding of pointers and careful element swapping.
    - _Examples:_ Removing duplicates from a sorted array, moving zeroes to the end, applying a rotation.
2.  **Prefix Sum & Sliding Window:** Extremely common for subarray problems. Prefix sum helps with range sum queries, while the sliding window technique is optimal for problems involving contiguous subarrays with specific conditions (e.g., maximum sum, shortest/longest subarray meeting a criteria).
    - _Examples:_ Find a subarray with a given sum, maximum average subarray, longest substring without repeating characters (treated as a character array).
3.  **Two-Pointer & Multi-Pointer Techniques:** Used for searching pairs, triples, or partitioning arrays. Often appears in problems derived from sorting or searching data.
    - _Examples:_ Two-sum variations, three-sum, partitioning an array (like the Dutch National Flag problem).
4.  **Matrix & 2D Array Traversal:** Yandex, with its focus on maps and images, frequently asks 2D array questions. These test your grasp of traversal patterns (spiral, diagonal) and graph-search algorithms (BFS/DFS) applied to grids.
    - _Examples:_ Rotating an image (matrix), number of islands, spiral order traversal.

## How to Prepare — Study Tips with One Code Example

Focus on mastering the patterns, not just memorizing solutions. For each problem type above, learn the underlying technique. Start by solving classic problems to internalize the pattern, then apply it to Yandex's specific questions. Always analyze time and space complexity.

A key pattern is the **Sliding Window** for finding a contiguous subarray. Here is a template for finding the length of the longest subarray with a sum less than or equal to a target `k`.

<div class="code-group">

```python
def longest_subarray_sum_at_most_k(nums, k):
    left = 0
    current_sum = 0
    max_length = 0

    for right in range(len(nums)):
        current_sum += nums[right]

        # Shrink the window from the left if sum exceeds k
        while current_sum > k and left <= right:
            current_sum -= nums[left]
            left += 1

        # Update the answer. Window [left, right] is now valid.
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
function longestSubarraySumAtMostK(nums, k) {
  let left = 0;
  let currentSum = 0;
  let maxLength = 0;

  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];

    // Shrink the window from the left if sum exceeds k
    while (currentSum > k && left <= right) {
      currentSum -= nums[left];
      left++;
    }

    // Update the answer. Window [left, right] is now valid.
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}
```

```java
public int longestSubarraySumAtMostK(int[] nums, int k) {
    int left = 0;
    int currentSum = 0;
    int maxLength = 0;

    for (int right = 0; right < nums.length; right++) {
        currentSum += nums[right];

        // Shrink the window from the left if sum exceeds k
        while (currentSum > k && left <= right) {
            currentSum -= nums[left];
            left++;
        }

        // Update the answer. Window [left, right] is now valid.
        maxLength = Math.max(maxLength, right - left + 1);
    }
    return maxLength;
}
```

</div>

## Recommended Practice Order

Build your skills progressively:

1.  **Foundation:** Start with basic in-place operations (remove element, remove duplicates) and classic two-pointer problems (Two Sum).
2.  **Core Patterns:** Deep dive into **Sliding Window** and **Prefix Sum**. These are arguably the most frequent patterns.
3.  **Advanced Techniques:** Practice multi-pointer problems (Three Sum, Dutch Flag) and matrix traversal problems.
4.  **Yandex-Specific:** Finally, apply all learned patterns by solving Yandex's tagged array problems. This consolidates your knowledge and builds familiarity with their problem style.

[Practice Array at Yandex](/company/yandex/array)
