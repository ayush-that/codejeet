---
title: "Array Questions at Tinkoff: What to Expect"
description: "Prepare for Array interview questions at Tinkoff — patterns, difficulty breakdown, and study tips."
date: "2030-12-10"
category: "dsa-patterns"
tags: ["tinkoff", "array", "interview prep"]
---

If you're preparing for Tinkoff's technical interviews, you need to know one thing: **Array problems are the single most important data structure you'll face.** With 12 out of 27 total questions dedicated to arrays, they represent nearly 45% of their technical question bank. This isn't a coincidence—arrays are fundamental to everything from financial transaction processing to real-time data streams, both core to Tinkoff's business. In real interviews, you're almost guaranteed to get at least one array question, often as the first or second problem.

## Specific Patterns Tinkoff Favors

Tinkoff's array questions aren't about obscure tricks. They focus on **practical patterns that test your ability to manipulate data efficiently under constraints**. Here's what they consistently ask for:

1. **Two-pointer techniques** - Especially for sorted arrays or when you need to find pairs meeting certain conditions. They love variations beyond the basic "Two Sum."
2. **Sliding window** - Both fixed and variable size windows for substring/subarray problems. This appears frequently in their questions about financial data streams.
3. **In-place array manipulation** - Rearranging, partitioning, or modifying arrays without extra space. This tests your understanding of memory efficiency.
4. **Prefix sums** - For rapid range queries, which is crucial for financial calculations over time periods.

Notice what's missing: complex dynamic programming with arrays, heavy recursion, or obscure mathematical tricks. Tinkoff prefers **iterative, space-efficient solutions** that mirror real-world backend code.

For example, their problems often resemble:

- **Two Sum variations** (LeetCode #1, #167) but with additional constraints
- **Sliding window maximum** (LeetCode #239) adapted for financial data
- **Partitioning problems** (LeetCode #75 - Sort Colors) testing in-place operations

## How to Prepare

Master these four patterns, and you'll handle 90% of Tinkoff's array questions. Let's look at the sliding window pattern, which appears in multiple Tinkoff problems:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def max_sum_subarray(arr, k):
    """Find maximum sum of any contiguous subarray of size k."""
    if len(arr) < k:
        return 0

    # Calculate first window sum
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # Slide the window
    for i in range(k, len(arr)):
        # Add new element, remove element leaving window
        window_sum = window_sum + arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum

# Key insight: Avoid recalculating entire window sum each time
# This pattern works for any fixed-size window problem
```

```javascript
// Time: O(n) | Space: O(1)
function maxSumSubarray(arr, k) {
  if (arr.length < k) return 0;

  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum + arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Note: The sliding window avoids O(n*k) brute force solution
```

```java
// Time: O(n) | Space: O(1)
public int maxSumSubarray(int[] arr, int k) {
    if (arr.length < k) return 0;

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

// This pattern is fundamental for Tinkoff's data stream problems
```

</div>

Another critical pattern is two-pointer for sorted arrays:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def two_sum_sorted(arr, target):
    """Find if two numbers in sorted array sum to target."""
    left, right = 0, len(arr) - 1

    while left < right:
        current_sum = arr[left] + arr[right]

        if current_sum == target:
            return True
        elif current_sum < target:
            left += 1  # Need larger sum
        else:
            right -= 1  # Need smaller sum

    return False

# This beats O(n²) brute force and O(n) hash table (which needs O(n) space)
```

```javascript
// Time: O(n) | Space: O(1)
function twoSumSorted(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];

    if (sum === target) return true;
    if (sum < target) left++;
    else right--;
  }

  return false;
}

// Space efficiency matters at Tinkoff - they'll ask about it
```

```java
// Time: O(n) | Space: O(1)
public boolean twoSumSorted(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;

    while (left < right) {
        int sum = arr[left] + arr[right];

        if (sum == target) return true;
        if (sum < target) left++;
        else right--;
    }

    return false;
}

// Always mention the space advantage over hash table solution
```

</div>

## How Tinkoff Tests Array vs Other Companies

Tinkoff's array questions differ from FAANG companies in three key ways:

1. **Practical over theoretical** - While Google might ask about array rotation using mathematical properties, Tinkoff asks about processing transaction batches. The problems feel like real backend tasks.

2. **Space efficiency emphasis** - They consistently ask follow-ups about reducing space complexity. At Amazon, you might get away with O(n) extra space; at Tinkoff, they'll push for O(1) in-place solutions.

3. **Intermediate difficulty** - Tinkoff problems are typically LeetCode Medium level. You won't see the brutal Hard problems common at Google or the ultra-optimization puzzles from HFT firms. But you need clean, correct code quickly.

4. **Follow-up questions** - They love asking "what if the array is streamed?" or "how would this work with concurrent modifications?" These test practical engineering thinking.

## Study Order

Don't study randomly. Follow this progression:

1. **Basic traversal and manipulation** - Learn to iterate, access, and modify arrays efficiently. Understand index math.
2. **Two-pointer techniques** - Start with sorted arrays, then move to unsorted variations. This builds intuition for simultaneous access.
3. **Sliding window** - Begin with fixed windows, then variable windows. This is crucial for Tinkoff's data stream problems.
4. **In-place operations** - Practice swapping, partitioning, and rearranging without extra arrays.
5. **Prefix sums** - Learn to precompute for fast range queries, common in financial calculations.
6. **Combination patterns** - Problems that mix two techniques (like sliding window with hash maps).

This order works because each concept builds on the previous. Two-pointer teaches you about multiple indices, which sliding window extends. In-place operations require careful index management that you learn from two-pointer.

## Recommended Practice Order

Solve these in sequence:

1. **Two Sum** (LeetCode #1) - Basic hash map approach
2. **Two Sum II - Input Array Is Sorted** (LeetCode #167) - Two-pointer version
3. **Best Time to Buy and Sell Stock** (LeetCode #121) - Simple one-pass
4. **Maximum Subarray** (LeetCode #53) - Kadane's algorithm foundation
5. **Contains Duplicate** (LeetCode #217) - Multiple approaches
6. **Product of Array Except Self** (LeetCode #238) - Space optimization focus
7. **Maximum Sum Subarray of Size K** (generic sliding window)
8. **Sort Colors** (LeetCode #75) - Classic in-place partitioning
9. **Sliding Window Maximum** (LeetCode #239) - Advanced window
10. **Subarray Sum Equals K** (LeetCode #560) - Prefix sum application

After these 10, you'll have covered every pattern Tinkoff tests. Time yourself: aim for 15 minutes per problem including edge cases and optimization discussion.

Remember: Tinkoff interviewers care about **clean code, correct handling of edge cases, and clear explanation of your approach**. They're not looking for one-line clever solutions—they want maintainable, efficient code that solves real problems.

[Practice Array at Tinkoff](/company/tinkoff/array)
