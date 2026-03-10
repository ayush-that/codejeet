---
title: "Array Questions at Zomato: What to Expect"
description: "Prepare for Array interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-10-31"
category: "dsa-patterns"
tags: ["zomato", "array", "interview prep"]
---

If you're preparing for a Zomato interview, you need to know one thing: arrays are not just another topic—they're the main event. With 20 out of 29 total questions tagged as array problems, this isn't a coincidence. Zomato's entire business—restaurant listings, food delivery logistics, location-based searches, and menu data—is fundamentally built on ordered collections of data. Whether it's processing a list of nearby restaurants, optimizing delivery routes, or managing time slots for orders, the array is the workhorse data structure. In real interviews, you can almost guarantee at least one array-focused problem, often as the first technical question to assess your fundamental data structure manipulation skills.

## Specific Patterns Zomato Favors

Zomato's array problems tend to cluster around practical, real-world scenarios rather than abstract mathematical puzzles. You'll notice a strong emphasis on **in-place transformations** and **subarray analysis**. These directly mirror engineering tasks like modifying restaurant lists in a database or analyzing continuous time-series data (like order volumes).

The most frequent patterns are:

1.  **Two Pointers / Sliding Window:** Used for problems involving contiguous subarrays, pair sums, or removing duplicates in-place. Think "find a delivery route under a certain distance" or "merge overlapping time intervals for restaurant availability."
2.  **In-place Array Modification:** Questions that ask you to rearrange, segregate, or modify an array using O(1) extra space. This tests your ability to think about indices and swaps carefully.
3.  **Prefix Sum / Cumulative Calculations:** Applied to problems where you need to frequently query the sum of a subarray, which is analogous to calculating total orders or revenue over a time window.

You will see far fewer problems on advanced dynamic programming (DP) with arrays or complex graph-based array traversals. The focus is on clean, efficient, and practical manipulation.

## How to Prepare

Your preparation should prioritize mastering index manipulation and recognizing when a brute-force O(n²) solution can be collapsed into an O(n) one using a smart pointer strategy. Let's look at the quintessential **in-place modification with two pointers** pattern, common in problems like "Remove Duplicates from Sorted Array" (LeetCode #26) or "Move Zeroes" (LeetCode #283).

The core idea is to maintain a "write" pointer that tracks the position of the next valid element, and a "read" pointer that scans through the array. You process each element once, deciding whether to "write" it.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def moveZeroes(nums):
    """
    Moves all zeros to the end while maintaining the relative order
    of non-zero elements.
    """
    write_idx = 0  # Tracks the position for the next non-zero element

    # First pass: move all non-zero elements to the front
    for read_idx in range(len(nums)):
        if nums[read_idx] != 0:
            nums[write_idx] = nums[read_idx]
            write_idx += 1

    # Second pass: fill the remaining positions with zeros
    for i in range(write_idx, len(nums)):
        nums[i] = 0

# Example: [0,1,0,3,12] -> read_idx=1, write_idx=0 -> swap -> [1,0,0,3,12]
# Continue... final result [1,3,12,0,0]
```

```javascript
// Time: O(n) | Space: O(1)
function moveZeroes(nums) {
  let writeIdx = 0;

  // Shift non-zero elements forward
  for (let readIdx = 0; readIdx < nums.length; readIdx++) {
    if (nums[readIdx] !== 0) {
      nums[writeIdx] = nums[readIdx];
      writeIdx++;
    }
  }

  // Fill the rest with zeros
  for (let i = writeIdx; i < nums.length; i++) {
    nums[i] = 0;
  }
}
```

```java
// Time: O(n) | Space: O(1)
public void moveZeroes(int[] nums) {
    int writeIdx = 0;

    // Place non-zero elements in order
    for (int readIdx = 0; readIdx < nums.length; readIdx++) {
        if (nums[readIdx] != 0) {
            nums[writeIdx] = nums[readIdx];
            writeIdx++;
        }
    }

    // Zero out the remainder
    for (int i = writeIdx; i < nums.length; i++) {
        nums[i] = 0;
    }
}
```

</div>

Another critical pattern is the **Sliding Window for subarray problems**, such as "Maximum Subarray" (LeetCode #53 - Kadane's Algorithm) or "Minimum Size Subarray Sum" (LeetCode #209). This is essential for questions about finding optimal contiguous sequences.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - Kadane's Algorithm
def maxSubArray(nums):
    """
    Returns the sum of the contiguous subarray with the largest sum.
    """
    current_sum = nums[0]
    max_sum = nums[0]

    for i in range(1, len(nums)):
        # Decision: start a new subarray at i, or add nums[i] to the current one?
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n) | Space: O(1)
function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxSubArray(int[] nums) {
    int currentSum = nums[0];
    int maxSum = nums[0];

    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}
```

</div>

## How Zomato Tests Array vs Other Companies

Compared to other companies, Zomato's array questions have a distinct flavor:

- **vs. FAANG (Meta, Google):** FAANG interviews often include array problems that are a thin veil over advanced topics like DP (e.g., "Longest Increasing Subsequence") or clever bit manipulation. Zomato's problems are more straightforward—the core challenge is usually implementing an efficient in-place algorithm or a sliding window correctly under pressure.
- **vs. FinTech (Stripe, PayPal):** FinTech companies might lean toward array problems involving numerical computation, permutations, or complex sorting. Zomato's problems are more about _ordering_ and _filtering_ data, reflecting their domain.
- **The Zomato Difference:** The unique aspect is the strong bias toward **in-place operations**. They want to see if you can manipulate data efficiently without allocating extra arrays, which is crucial for handling large datasets in their systems. The difficulty often lies not in the algorithm's conceptual complexity, but in getting the index management perfect on a whiteboard or shared editor.

## Study Order

Tackle array topics in this order to build a solid foundation before tackling Zomato's common variations:

1.  **Basic Traversal & Index Manipulation:** Before anything else, be comfortable with simple loops, accessing elements, and basic swaps. This is the absolute foundation.
2.  **Two Pointers (Sorted Data):** Start with the classic "Two Sum II" (LeetCode #167) where the array is sorted. This introduces the concept of using two indices to converge on a solution.
3.  **In-place Modification:** Now, learn to manipulate arrays using pointers _within the same array_. "Remove Duplicates" (LeetCode #26) and "Move Zeroes" (LeetCode #283) are perfect.
4.  **Sliding Window (Fixed & Dynamic):** Begin with fixed-size windows (e.g., "Maximum Average Subarray I" - LeetCode #643), then move to dynamic windows that grow/shrink ("Minimum Size Subarray Sum" - LeetCode #209).
5.  **Prefix Sum:** Learn how to pre-compute cumulative sums to answer subarray sum queries in O(1) time. This is a powerful optimization for a specific class of problems.
6.  **Cyclic Sort / Advanced In-place:** Finally, practice patterns like cyclic sort for arrays containing a limited range of numbers (e.g., "Find All Duplicates in an Array" - LeetCode #442). This is less common but tests deep understanding of indices.

## Recommended Practice Order

Solve these problems in sequence. Each one builds a skill needed for the next:

1.  **Two Sum II - Input Array Is Sorted (LeetCode #167):** Master the basic two-pointer approach.
2.  **Remove Duplicates from Sorted Array (LeetCode #26):** Learn the read/write pointer in-place pattern.
3.  **Move Zeroes (LeetCode #283):** Solidify in-place modification with a slight twist.
4.  **Maximum Subarray (LeetCode #53):** Understand the fundamental sliding window (Kadane's Algorithm).
5.  **Minimum Size Subarray Sum (LeetCode #209):** Practice the dynamic sliding window pattern.
6.  **Product of Array Except Self (LeetCode #238):** Combines prefix/postfix thinking with O(1) space requirements (excluding the output array)—a very Zomato-style challenge.
7.  **Merge Intervals (LeetCode #56):** A classic that uses sorting and then a form of in-place merging, highly relevant for time-based data.

By following this progression, you'll develop the precise skills Zomato interviewers are looking for: the ability to cleanly and efficiently manipulate array data in ways that mirror real-world platform tasks.

[Practice Array at Zomato](/company/zomato/array)
