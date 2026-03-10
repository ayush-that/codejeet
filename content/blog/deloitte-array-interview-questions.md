---
title: "Array Questions at Deloitte: What to Expect"
description: "Prepare for Array interview questions at Deloitte — patterns, difficulty breakdown, and study tips."
date: "2030-03-13"
category: "dsa-patterns"
tags: ["deloitte", "array", "interview prep"]
---

If you're preparing for a technical interview at Deloitte, you'll quickly notice something striking: **half of their coding question bank is dedicated to array problems.** With 19 out of 38 total questions focusing on arrays, this isn't just a topic you should know—it's the single most important data structure you need to master for their interviews. Unlike companies like Google or Meta, where questions might span graphs, dynamic programming, and system design, Deloitte's technical screen is heavily concentrated on core data manipulation. This makes strategic sense: arrays are fundamental, test a candidate's ability to handle indices and state, and mirror the data transformation tasks common in consulting and analytics work. Expect at least one, and often two, array-based problems in any live coding interview.

## Specific Patterns Deloitte Favors

Deloitte's array questions aren't about obscure algorithms. They focus on **practical, business-logic adjacent patterns** that test clarity of thought and clean code. You won't find many convoluted graph traversals or advanced DP here. Instead, the emphasis is on:

1.  **In-place Array Modification:** Problems that require you to rearrange, filter, or deduplicate an array without using extra space. This tests your understanding of two-pointer techniques and careful index management.
2.  **Prefix Sum & Sliding Window:** Calculating running totals or finding subarrays that meet a condition (like a target sum). This is common in time-series or aggregated data analysis.
3.  **Basic Sorting & Searching:** Not complex sorts, but applied uses: finding the Kth largest/smallest element, merging sorted arrays, or handling intervals.
4.  **Simulation & Iteration:** Problems that describe a process (like rotating an array or a game rule) and ask you to simulate it efficiently.

For example, **Remove Duplicates from Sorted Array (LeetCode #26)** is a classic Deloitte-style problem: it's a pure in-place two-pointer exercise. **Two Sum (LeetCode #1)** and its variant **Two Sum II - Input Array Is Sorted (LeetCode #167)** test your ability to use a hash map or two-pointer approach for a lookup. **Best Time to Buy and Sell Stock (LeetCode #121)** is a quintessential single-pass, track-the-minimum problem that models a simple business decision.

## How to Prepare

Your preparation should be methodical. Don't just solve random problems. Internalize the core patterns through variations. Let's look at the **Two-Pointer / In-place Modification** pattern, which is arguably the most critical for Deloitte.

The key insight is to use one pointer (`i`) to iterate through the array and another (`k`) to track the position of the "valid" part of the array you're building. Here's how it applies to removing duplicates from a sorted array:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def removeDuplicates(nums):
    """
    Removes duplicates in-place from a sorted array.
    Returns the length of the unique portion.
    """
    if not nums:
        return 0

    k = 1  # Pointer for the position of the next unique element
    for i in range(1, len(nums)):
        if nums[i] != nums[i - 1]:  # Found a new unique element
            nums[k] = nums[i]       # Place it at position k
            k += 1
    return k
```

```javascript
// Time: O(n) | Space: O(1)
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let k = 1; // Pointer for the position of the next unique element
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      // Found a new unique element
      nums[k] = nums[i]; // Place it at position k
      k++;
    }
  }
  return k;
}
```

```java
// Time: O(n) | Space: O(1)
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;

    int k = 1; // Pointer for the position of the next unique element
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] != nums[i - 1]) { // Found a new unique element
            nums[k] = nums[i];        // Place it at position k
            k++;
        }
    }
    return k;
}
```

</div>

Once you master this, you can solve variations like **Move Zeroes (LeetCode #283)** with the same mental model—just change the condition from `nums[i] != nums[i-1]` to `nums[i] != 0`.

Another essential pattern is the **Sliding Window** for subarray problems. Here's the template for finding a subarray with a sum equal to a target (a common variant):

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - for non-negative numbers only
def subarraySumTarget(nums, target):
    """
    Finds a contiguous subarray whose sum equals target.
    Returns the start and end indices (1-indexed).
    Assumes a solution exists and numbers are non-negative.
    """
    left = 0
    current_sum = 0

    for right in range(len(nums)):
        current_sum += nums[right]

        # Shrink the window from the left while sum exceeds target
        while current_sum > target and left <= right:
            current_sum -= nums[left]
            left += 1

        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed return
    return [-1, -1]
```

```javascript
// Time: O(n) | Space: O(1) - for non-negative numbers only
function subarraySumTarget(nums, target) {
  let left = 0;
  let currentSum = 0;

  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];

    // Shrink the window from the left while sum exceeds target
    while (currentSum > target && left <= right) {
      currentSum -= nums[left];
      left++;
    }

    if (currentSum === target) {
      return [left + 1, right + 1]; // 1-indexed return
    }
  }
  return [-1, -1];
}
```

```java
// Time: O(n) | Space: O(1) - for non-negative numbers only
public int[] subarraySumTarget(int[] nums, int target) {
    int left = 0;
    int currentSum = 0;

    for (int right = 0; right < nums.length; right++) {
        currentSum += nums[right];

        // Shrink the window from the left while sum exceeds target
        while (currentSum > target && left <= right) {
            currentSum -= nums[left];
            left++;
        }

        if (currentSum == target) {
            return new int[]{left + 1, right + 1}; // 1-indexed return
        }
    }
    return new int[]{-1, -1};
}
```

</div>

## How Deloitte Tests Array vs Other Companies

Deloitte's array questions differ from those at FAANG or pure tech firms in three key ways:

1.  **Difficulty Ceiling:** The problems are almost exclusively Easy to Medium on LeetCode. You're unlikely to see a "Hard" array problem involving complex state machines or optimization. The challenge is in writing bug-free, clean, and efficient code under time pressure, not in deriving a novel algorithm.
2.  **Business Context:** Problems often have a thin veneer of business logic—"calculating profit," "merging client records," "analyzing daily transactions." This tests if you can translate a word problem into a clean algorithmic solution.
3.  **Focus on Fundamentals:** While a Google interview might test your knowledge of a specialized algorithm (e.g., Dijkstra's), Deloitte tests if you truly understand iteration, pointer manipulation, and basic time/space trade-offs. A missed `+1` or `-1` on an index is more likely to cost you than not knowing an advanced data structure.

## Study Order

Tackle array topics in this logical progression to build a solid foundation:

1.  **Basic Iteration & Counting:** Start with simple loops, finding max/min, and basic aggregation. This warms up your index handling.
2.  **Two-Pointer Techniques:** Learn the in-place modification pattern (like removing duplicates). This is the backbone of many Deloitte problems.
3.  **Sliding Window:** Master fixed and dynamic windows for subarray problems. This naturally follows two-pointer skills.
4.  **Prefix Sum:** Understand how to pre-compute running sums to answer range queries quickly.
5.  **Binary Search on Sorted Arrays:** Learn how to apply binary search beyond simple lookup (e.g., finding boundaries, pivot points).
6.  **Basic Sorting Applications:** Practice using built-in sorts to solve problems like finding the Kth largest element or merging intervals.

This order works because each topic builds on the mental models of the previous one. Two-pointer techniques teach you to manage multiple indices, which is directly applicable to sliding windows. Prefix sum is a complementary tool to sliding window for sum-related problems.

## Recommended Practice Order

Solve these problems in sequence to build competency:

1.  **Two Sum (LeetCode #1)** - Master the hash map approach.
2.  **Remove Duplicates from Sorted Array (LeetCode #26)** - Learn the fundamental in-place two-pointer.
3.  **Best Time to Buy and Sell Stock (LeetCode #121)** - Practice single-pass simulation.
4.  **Merge Sorted Array (LeetCode #88)** - Apply two-pointer from the end.
5.  **Move Zeroes (LeetCode #283)** - A direct variation of the in-place pattern.
6.  **Two Sum II - Input Array Is Sorted (LeetCode #167)** - Two-pointer on a sorted array.
7.  **Subarray Sum Equals K (LeetCode #560)** - Introduces prefix sum with a hash map (a slight step up).
8.  **Merge Intervals (LeetCode #56)** - A classic sorting application.

By following this focused path, you'll cover the vast majority of patterns Deloitte uses. Remember, their goal is to assess your fundamental coding skill and problem-solving clarity, not your knowledge of esoteric algorithms. Write clean code, explain your thought process, and always check your edge cases.

[Practice Array at Deloitte](/company/deloitte/array)
