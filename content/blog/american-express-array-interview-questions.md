---
title: "Array Questions at American Express: What to Expect"
description: "Prepare for Array interview questions at American Express — patterns, difficulty breakdown, and study tips."
date: "2031-03-12"
category: "dsa-patterns"
tags: ["american-express", "array", "interview prep"]
---

If you're preparing for a software engineering interview at American Express, you should be looking at your screen right now and thinking one thing: **arrays**. With a staggering 16 out of 24 of their most frequently asked coding questions being array-based, this isn't just a topic—it's _the_ topic. This focus makes perfect sense when you consider American Express's core business: processing millions of financial transactions daily. At its heart, this is about manipulating streams of data—transaction amounts, timestamps, user IDs—all of which are fundamentally represented and processed as arrays or lists. Your ability to efficiently traverse, transform, and derive insights from this sequential data is a direct proxy for your ability to work with their core systems. Expect at least one, and very likely both, of your technical interview rounds to feature an array problem.

## Specific Patterns American Express Favors

American Express's array problems aren't about obscure tricks or complex mathematical proofs. They are practical, leaning heavily on a few key patterns that test fundamental data manipulation and problem-solving skills. The emphasis is on **iteration, state tracking, and in-place modification**.

1.  **Sliding Window & Two Pointers:** This is arguably their favorite pattern. It's ideal for problems involving contiguous subarrays, running calculations, or deduplication within sorted data—all common when analyzing transaction sequences or time-series data.
    - **Example Problems:** "Maximum Subarray" (LeetCode #53, Kadane's Algorithm is a variant), "Remove Duplicates from Sorted Array" (LeetCode #26), "Minimum Size Subarray Sum" (LeetCode #209).

2.  **Hash Map for Frequency/Index Tracking:** The second most common pattern. Used for problems involving pairs, duplicates, or membership checks—think finding fraudulent transaction pairs or validating data.
    - **Example Problems:** "Two Sum" (LeetCode #1), "Contains Duplicate" (LeetCode #217).

3.  **In-Place Array Manipulation:** They frequently ask problems that require rearranging elements within the same array using constant extra space. This tests careful index management and understanding of array structure.
    - **Example Problems:** "Move Zeroes" (LeetCode #283), "Remove Element" (LeetCode #27), the aforementioned "Remove Duplicates from Sorted Array."

You'll notice a distinct lack of heavily recursive patterns (like complex Backtracking or Divide-and-Conquer) or advanced graph algorithms. Their problems are iterative, straightforward to explain, but require clean, bug-free implementation.

## How to Prepare

Your preparation should drill into the patterns above. Let's look at the quintessential **Two Pointer for in-place manipulation**, as seen in "Move Zeroes." The brute-force approach might involve a new array, but the optimal solution does it in one clean pass in-place.

<div class="code-group">

```python
def moveZeroes(nums):
    """
    Moves all 0's to the end while maintaining the relative order of non-zero elements.
    Uses a slow pointer `last_non_zero` to track the position for the next non-zero element.
    Time: O(n) | Space: O(1)
    """
    last_non_zero = 0
    # First pass: move all non-zero elements to the front
    for current in range(len(nums)):
        if nums[current] != 0:
            nums[last_non_zero], nums[current] = nums[current], nums[last_non_zero]
            last_non_zero += 1
    # All zeroes are automatically shifted to positions >= last_non_zero

# Example: [0,1,0,3,12] -> Iteration swaps 1 to index 0, 3 to index 1, 12 to index 2.
# Result: [1,3,12,0,0]
```

```javascript
function moveZeroes(nums) {
  /**
   * Moves all 0's to the end while maintaining the relative order of non-zero elements.
   * Uses a slow pointer `lastNonZero` to track the position for the next non-zero element.
   * Time: O(n) | Space: O(1)
   */
  let lastNonZero = 0;
  // First pass: move all non-zero elements to the front
  for (let current = 0; current < nums.length; current++) {
    if (nums[current] !== 0) {
      // Swap elements at lastNonZero and current
      [nums[lastNonZero], nums[current]] = [nums[current], nums[lastNonZero]];
      lastNonZero++;
    }
  }
}
```

```java
public void moveZeroes(int[] nums) {
    /**
     * Moves all 0's to the end while maintaining the relative order of non-zero elements.
     * Uses a slow pointer `lastNonZero` to track the position for the next non-zero element.
     * Time: O(n) | Space: O(1)
     */
    int lastNonZero = 0;
    // First pass: move all non-zero elements to the front
    for (int current = 0; current < nums.length; current++) {
        if (nums[current] != 0) {
            // Swap elements at lastNonZero and current
            int temp = nums[lastNonZero];
            nums[lastNonZero] = nums[current];
            nums[current] = temp;
            lastNonZero++;
        }
    }
}
```

</div>

Next, master the **Sliding Window** pattern. Here's the fixed-size window variant, useful for problems like finding a subarray of a given size with the maximum sum.

<div class="code-group">

```python
def max_sum_subarray_fixed_k(nums, k):
    """
    Calculates the maximum sum of any contiguous subarray of fixed size k.
    Uses a sliding window to avoid recalculating the sum from scratch.
    Time: O(n) | Space: O(1)
    """
    if len(nums) < k:
        return None

    # Calculate sum of first window
    window_sum = sum(nums[:k])
    max_sum = window_sum

    # Slide the window from index k to the end
    for i in range(k, len(nums)):
        # Add the new element entering the window, subtract the element leaving it
        window_sum = window_sum + nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum

# Example: nums = [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], k = 3
# First window [4,2,1] sum = 7. Slide: [2,1,7] sum=10, [1,7,8] sum=16 (max), etc.
```

```javascript
function maxSumSubarrayFixedK(nums, k) {
  /**
   * Calculates the maximum sum of any contiguous subarray of fixed size k.
   * Uses a sliding window to avoid recalculating the sum from scratch.
   * Time: O(n) | Space: O(1)
   */
  if (nums.length < k) return null;

  // Calculate sum of first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  let maxSum = windowSum;

  // Slide the window from index k to the end
  for (let i = k; i < nums.length; i++) {
    // Add the new element entering the window, subtract the element leaving it
    windowSum = windowSum + nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}
```

```java
public int maxSumSubarrayFixedK(int[] nums, int k) {
    /**
     * Calculates the maximum sum of any contiguous subarray of fixed size k.
     * Uses a sliding window to avoid recalculating the sum from scratch.
     * Time: O(n) | Space: O(1)
     */
    if (nums.length < k) return -1; // Or throw an exception

    // Calculate sum of first window
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    int maxSum = windowSum;

    // Slide the window from index k to the end
    for (int i = k; i < nums.length; i++) {
        // Add the new element entering the window, subtract the element leaving it
        windowSum = windowSum + nums[i] - nums[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum;
}
```

</div>

## How American Express Tests Array vs Other Companies

Compared to FAANG companies, American Express's array questions are less "algorithmically clever" and more "practically correct." At a company like Google, you might get an array problem that is a thin disguise for a complex graph search or union-find. At Amazon, it might be tightly coupled with system design (e.g., designing a LRU cache). At American Express, the problem is usually exactly what it seems: an array manipulation task.

The difficulty is often in the **"Medium"** range on LeetCode, but the evaluation criteria are different. They place a high premium on:

- **Clean, readable code:** They want to see you write maintainable code, not just clever one-liners.
- **Thorough handling of edge cases:** Empty arrays, single-element arrays, all-zero arrays, etc.
- **Clear communication of your thought process:** Walk through your brute-force idea first, then optimize. They care about the _how_ and _why_ as much as the final solution.

## Study Order

Tackle array patterns in this logical progression to build a strong foundation:

1.  **Basic Iteration & Hash Maps:** Start with the absolute fundamentals. Learn how to traverse an array and use a hash map (dictionary/object) for O(1) lookups. This is the bedrock for "Two Sum" and "Contains Duplicate."
2.  **Two Pointers (Sorted Data):** Learn to use left and right pointers on a _sorted_ array for problems like pair summing or deduplication. It's an intuitive introduction to pointer manipulation.
3.  **Two Pointers (In-Place Manipulation):** Advance to using fast/slow or read/write pointers for in-place operations on _unsorted_ data ("Move Zeroes," "Remove Element"). This is a core Amex pattern.
4.  **Prefix Sum:** Understand how to pre-compute cumulative sums to answer range sum queries in O(1) time. It's a simple but powerful concept that appears in many variations.
5.  **Sliding Window (Fixed Size):** Master the easier variant first, which is about maintaining a window of constant length as you slide.
6.  **Sliding Window (Dynamic Size):** Finally, tackle the more complex dynamic window problems (like "Minimum Size Subarray Sum"), which require adjusting the window size based on a condition.

## Recommended Practice Order

Solve these problems in sequence. Each one builds upon the concepts of the last.

1.  **Contains Duplicate (LeetCode #217)** - Hash Map fundamentals.
2.  **Two Sum (LeetCode #1)** - The classic hash map application.
3.  **Remove Duplicates from Sorted Array (LeetCode #26)** - Two pointers on sorted data.
4.  **Move Zeroes (LeetCode #283)** - Two pointers for in-place manipulation.
5.  **Maximum Subarray (LeetCode #53 - Kadane's Algorithm)** - A special form of dynamic sliding window/prefix sum.
6.  **Best Time to Buy and Sell Stock (LeetCode #121)** - Another variant of tracking a minimum and calculating a max difference (akin to one-pass DP or sliding window).
7.  **Minimum Size Subarray Sum (LeetCode #209)** - Dynamic sliding window.
8.  **Product of Array Except Self (LeetCode #238)** - A step up in complexity, testing your ability to manage state from both left and right passes.

Master this progression, and you'll have covered the vast majority of what American Express can throw at you in an array-focused interview. Remember, depth and clarity on these core patterns will serve you better than a shallow knowledge of every data structure.

[Practice Array at American Express](/company/american-express/array)
