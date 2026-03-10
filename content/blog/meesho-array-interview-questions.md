---
title: "Array Questions at Meesho: What to Expect"
description: "Prepare for Array interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-11-11"
category: "dsa-patterns"
tags: ["meesho", "array", "interview prep"]
---

If you're preparing for a Meesho interview, you'll quickly notice something striking: **26 of their 44 tagged coding problems are Array-based.** That's nearly 60%. This isn't a coincidence; it's a signal. Meesho, as a high-growth e-commerce platform, deals with massive datasets—product catalogs, user orders, inventory lists, recommendation feeds. The fundamental data structure for all of this? The array. Your ability to manipulate, traverse, and derive insights from arrays directly mirrors your ability to handle their core data. Expect at least one, and often two, array-focused problems in any technical interview loop. They use it as a primary filter for fundamental data structure competency and problem-solving speed.

## Specific Patterns Meesho Favors

Meesho's array problems aren't about obscure tricks. They heavily favor **practical patterns that map to real-world platform operations.** You'll see a clear bias toward:

1.  **Two-Pointer & Sliding Window:** This is their single most tested pattern. It's the workhorse for optimizing operations on sorted data (like merging user lists) or finding subarrays (like analyzing session data). They love problems that require you to maintain a "window" of valid data.
2.  **Prefix Sum & Hashing for Subarray Problems:** Questions about finding a subarray that sums to a target, or checking for equality, are common. This tests if you can move beyond brute-force O(n²) solutions to efficient O(n) ones, crucial for scaling.
3.  **In-place Array Modification:** Meesho values memory efficiency. Problems where you must rearrange, segregate, or modify an array using only O(1) extra space are frequent. This tests your grasp of pointer manipulation and careful value swapping.
4.  **Simulation & Index Manipulation:** You'll encounter problems that ask you to simulate a process (like a circular tour or jumping game) by traversing the array. These test your ability to translate a wordy problem into clean, bug-free iteration logic.

You will _not_ typically find heavy graph theory, advanced dynamic programming (DP), or complex mathematical number theory in their array questions. The focus is on clean, efficient, and correct implementation of the patterns above.

## How to Prepare

The key is pattern recognition through deliberate practice. Don't just solve problems; solve them with the intent to internalize the template. Let's look at the **Sliding Window** pattern, a Meesho staple, in its two main forms.

**Fixed-Length Window (Find maximum/minimum sum of subarray of size k):**
The template involves calculating the first window sum, then sliding by adding the next element and subtracting the one leaving the window.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def max_sum_subarray_fixed(arr, k):
    """Returns the maximum sum of any contiguous subarray of length k."""
    if not arr or k > len(arr):
        return 0

    # Calculate sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # Slide the window
    for i in range(k, len(arr)):
        # Add the new element, remove the element leaving the window
        window_sum = window_sum + arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum
```

```javascript
// Time: O(n) | Space: O(1)
function maxSumSubarrayFixed(arr, k) {
  if (!arr || k > arr.length) return 0;

  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum + arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxSumSubarrayFixed(int[] arr, int k) {
    if (arr == null || k > arr.length) return 0;

    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    int maxSum = windowSum;

    for (int i = k; i < arr.length; i++) {
        windowSum = windowSum + arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}
```

</div>

**Variable-Length Window (Find longest subarray with sum ≤ target):**
This uses two pointers (`left` and `right`) to dynamically expand and contract the window based on a condition.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def longest_subarray_sum_at_most_k(arr, k):
    """Returns the length of the longest subarray with sum <= k."""
    left = 0
    current_sum = 0
    max_length = 0

    for right in range(len(arr)):
        current_sum += arr[right]

        # Shrink the window from the left while the condition is invalid
        while current_sum > k and left <= right:
            current_sum -= arr[left]
            left += 1

        # Condition is now valid (current_sum <= k), update answer
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Time: O(n) | Space: O(1)
function longestSubarraySumAtMostK(arr, k) {
  let left = 0;
  let currentSum = 0;
  let maxLength = 0;

  for (let right = 0; right < arr.length; right++) {
    currentSum += arr[right];

    while (currentSum > k && left <= right) {
      currentSum -= arr[left];
      left++;
    }

    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}
```

```java
// Time: O(n) | Space: O(1)
public int longestSubarraySumAtMostK(int[] arr, int k) {
    int left = 0;
    int currentSum = 0;
    int maxLength = 0;

    for (int right = 0; right < arr.length; right++) {
        currentSum += arr[right];

        while (currentSum > k && left <= right) {
            currentSum -= arr[left];
            left++;
        }

        maxLength = Math.max(maxLength, right - left + 1);
    }
    return maxLength;
}
```

</div>

## How Meesho Tests Array vs Other Companies

Compared to FAANG companies, Meesho's array problems are often more **direct and less "clever."**

- **vs. Google:** Google might embed an array problem within a complex scenario requiring a non-obvious insight (e.g., transforming it into a graph or using a specific math property). Meesho's problems are more likely to be a direct application of a standard pattern.
- **vs. Meta:** Meta leans heavily into recursion, trees, and graphs, even for problems that seem array-like. Meesho keeps its array problems firmly in the iterative, linear data structure domain.
- **vs. Amazon:** While both are e-commerce, Amazon's problems often have longer descriptions with more edge cases to consider (simulating their "customer obsession"). Meesho's problem statements tend to be more concise, testing your raw algorithmic skill rather than your requirement-gathering.

The unique aspect of Meesho's approach is the **practicality-to-difficulty ratio.** The problems are of medium difficulty (LeetCode Medium) but are chosen for their high relevance to operations you might actually work on—processing batches, optimizing delivery routes (implied in array jumps), or analyzing user behavior sequences.

## Study Order

Tackle the patterns in this logical progression to build a strong foundation:

1.  **Basic Traversal & Pointers:** Start with simple iteration, two-pointer for reversing/swapping, and basic in-place operations. This builds muscle memory for manipulating indices without errors.
2.  **Prefix Sum & Hashing:** Learn to pre-compute running sums and use hash maps to store seen values/indexes. This is the gateway to solving subarray sum problems in O(n) time.
3.  **Two-Pointer (Sorted Data):** Master merging, finding pairs/triplets with a target sum in a sorted array. This introduces the concept of intelligent pointer movement.
4.  **Sliding Window:** Start with fixed-size windows, then move to variable-size. This is where you combine traversal with maintaining a valid state, a critical skill.
5.  **In-place Rearrangement:** Finally, tackle problems that require cycling through an array to segregate, rotate, or reorder elements using O(1) space. This tests your mastery of index arithmetic.

This order works because each step provides a tool needed for the next. You can't efficiently do a sliding window without being comfortable with two pointers. You can't solve complex in-place problems without a rock-solid understanding of how to traverse and swap elements without losing data.

## Recommended Practice Order

Solve these problems in sequence. Each introduces a slight twist on the core pattern, building your adaptability.

1.  **Two Sum (#1)** - The foundational hash map problem.
2.  **Best Time to Buy and Sell Stock (#121)** - Simple one-pass traversal (a proto-sliding window).
3.  **Merge Sorted Array (#88)** - Fundamental two-pointer on sorted data.
4.  **Contains Duplicate (#217)** - Basic hash set application.
5.  **Product of Array Except Self (#238)** - Excellent prefix/postfix product practice.
6.  **Maximum Subarray (#53)** - Kadane's Algorithm (a dynamic sliding window).
7.  **Subarray Sum Equals K (#560)** - The classic prefix sum + hash map problem.
8.  **Longest Substring Without Repeating Characters (#3)** - The canonical variable sliding window problem (applied to strings, but the logic is identical to arrays).
9.  **Find All Duplicates in an Array (#442)** - A perfect example of in-place marking using index manipulation.
10. **Jump Game (#55)** - A classic simulation/index manipulation problem.

Mastering this progression will make you exceptionally well-prepared for the array challenges in a Meesho interview. Remember, they are testing for clean, efficient, and correct code that solves a practical problem. Focus on that.

[Practice Array at Meesho](/company/meesho/array)
