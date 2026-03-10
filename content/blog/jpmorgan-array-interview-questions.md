---
title: "Array Questions at JPMorgan: What to Expect"
description: "Prepare for Array interview questions at JPMorgan — patterns, difficulty breakdown, and study tips."
date: "2028-09-09"
category: "dsa-patterns"
tags: ["jpmorgan", "array", "interview prep"]
---

If you're preparing for a software engineering interview at JPMorgan, you need to understand one thing immediately: arrays are not just another data structure; they are the primary battleground. With 46 out of 78 total tagged questions on their LeetCode company page being array problems, this represents a staggering 59% of their technical focus. This isn't a coincidence. In financial technology, from processing high-frequency trading data and risk calculations to handling time-series data and ledger entries, the array (and its close cousin, the list) is the fundamental unit of data manipulation. At JPMorgan, array questions aren't just testing your algorithmic knowledge—they're a direct proxy for your ability to handle the ordered, sequential, and often real-time numerical data that forms the backbone of their systems. Expect at least one, and very likely two, array-focused problems in any technical screen or onsite interview loop.

## Specific Patterns JPMorgan Favors

JPMorgan's array problems have a distinct financial flavor. You won't find many abstract graph theory puzzles here. Instead, they heavily favor practical patterns that mirror real-world data processing tasks. The most prevalent categories are:

1.  **Sliding Window & Two Pointers:** This is the single most important pattern for JPMorgan. It's used for analyzing contiguous subarrays, which models tasks like analyzing profit/loss over time windows, finding optimal transaction periods, or validating sequences of data. Problems often involve finding a subarray that meets a sum, product, or character count condition.
2.  **Prefix Sum & Hashing:** Closely related to sliding window problems, these are used for problems where you need frequent range sum queries or need to find subarrays with a specific sum. This pattern is crucial for problems like finding the number of subarrays that sum to a target, which has direct analogs in portfolio analysis.
3.  **Sorting & Greedy Intervals:** JPMorgan loves interval problems. Merging, inserting, or finding overlaps in intervals directly models scheduling meetings, allocating resources, or managing time-bound financial events. The greedy approach after sorting is a classic and efficient solution.
4.  **In-place Array Manipulation:** Problems that ask you to modify the array using O(1) extra space are common. This tests your ability to be memory-efficient, a valued trait when dealing with massive datasets. Think problems like moving zeros, removing duplicates in a sorted array, or the classic Dutch National Flag problem.

You will notice a distinct _lack_ of heavily recursive solutions (like complex backtracking) or advanced dynamic programming requiring 2D+ states. Their problems lean iterative, practical, and optimized for clarity and performance on large input sizes.

## How to Prepare

Your preparation should be pattern-first, not problem-first. Master the template for each pattern, then learn its variations. Let's look at the most critical one: the **Sliding Window with Two Pointers**.

The core idea is to maintain a window `[left, right]` defined by two pointers. You expand the right pointer to add elements, and contract the left pointer when a condition is violated. Here’s a template for the "variable-length window" type, like finding the smallest subarray with a sum ≥ target (LeetCode #209: Minimum Size Subarray Sum).

<div class="code-group">

```python
def minSubArrayLen(target, nums):
    """
    Finds the length of the smallest contiguous subarray whose sum is >= target.
    Time: O(n) - Each element is processed at most twice (by left and right).
    Space: O(1) - Only uses a few integer variables.
    """
    left = 0
    current_sum = 0
    min_length = float('inf')

    for right in range(len(nums)):
        # 1. Expand the window by adding the element at 'right'
        current_sum += nums[right]

        # 2. Contract the window from the left while the condition is satisfied
        while current_sum >= target:
            # Update the answer with the current window size
            min_length = min(min_length, right - left + 1)
            # Shrink the window by moving left forward
            current_sum -= nums[left]
            left += 1

    return 0 if min_length == float('inf') else min_length
```

```javascript
function minSubArrayLen(target, nums) {
  // Time: O(n) | Space: O(1)
  let left = 0;
  let currentSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    // Expand window
    currentSum += nums[right];

    // Contract window while condition is met
    while (currentSum >= target) {
      // Update answer
      minLength = Math.min(minLength, right - left + 1);
      // Shrink window
      currentSum -= nums[left];
      left++;
    }
  }

  return minLength === Infinity ? 0 : minLength;
}
```

```java
public int minSubArrayLen(int target, int[] nums) {
    // Time: O(n) | Space: O(1)
    int left = 0;
    int currentSum = 0;
    int minLength = Integer.MAX_VALUE;

    for (int right = 0; right < nums.length; right++) {
        // Expand window
        currentSum += nums[right];

        // Contract window while condition is met
        while (currentSum >= target) {
            // Update answer
            minLength = Math.min(minLength, right - left + 1);
            // Shrink window
            currentSum -= nums[left];
            left++;
        }
    }

    return minLength == Integer.MAX_VALUE ? 0 : minLength;
}
```

</div>

The other essential pattern is **Interval Merging** (LeetCode #56: Merge Intervals). The trick is always to sort by the start time first.

<div class="code-group">

```python
def merge(intervals):
    """
    Merges all overlapping intervals.
    Time: O(n log n) due to sorting.
    Space: O(n) for the output list (or O(1) if ignoring output storage).
    """
    if not intervals:
        return []

    # Sort by the start value
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]

        # If the current interval overlaps with the last merged one
        if current_start <= last_end:
            # Merge them by updating the end of the last interval
            merged[-1][1] = max(last_end, current_end)
        else:
            # No overlap, add the current interval as a new entry
            merged.append([current_start, current_end])

    return merged
```

```javascript
function merge(intervals) {
  // Time: O(n log n) | Space: O(n)
  if (intervals.length === 0) return [];

  // Sort by the start value
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const [currStart, currEnd] = intervals[i];
    const [lastStart, lastEnd] = merged[merged.length - 1];

    // Check for overlap
    if (currStart <= lastEnd) {
      // Merge
      merged[merged.length - 1][1] = Math.max(lastEnd, currEnd);
    } else {
      // No overlap
      merged.push([currStart, currEnd]);
    }
  }
  return merged;
}
```

```java
public int[][] merge(int[][] intervals) {
    // Time: O(n log n) | Space: O(n) for the output list
    if (intervals.length == 0) return new int[0][];

    // Sort by the start value
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);

    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        int currStart = intervals[i][0];
        int currEnd = intervals[i][1];

        // Check for overlap
        if (currStart <= last[1]) {
            // Merge
            last[1] = Math.max(last[1], currEnd);
        } else {
            // No overlap
            merged.add(intervals[i]);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

## How JPMorgan Tests Array vs Other Companies

Compared to FAANG companies, JPMorgan's array problems are less about clever "aha!" moments and more about robust, efficient implementation of standard patterns.

- **vs. Google/Meta:** These companies often embed arrays within complex graph or system design contexts. JPMorgan's problems are more self-contained and numerically focused.
- **vs. Amazon:** Amazon leans heavily into hash maps (for frequency counting) and more string manipulation. JPMorgan's focus is more purely on numerical array manipulation.
- **vs. Startups/HFTs:** Startups might ask more open-ended questions. JPMorgan's problems are typically well-defined LeetCode-style questions, but with a clear through-line to financial data processing.

The unique aspect is the **context**. You might be asked to explain how your solution relates to processing a stream of stock prices or transaction logs. Be prepared to discuss trade-offs (time vs. space) in a practical, business-oriented way.

## Study Order

1.  **Two Pointers (Basic):** Start with opposite-end pointers (e.g., Two Sum II - Input Array Is Sorted #167). This builds intuition for manipulating indices.
2.  **Sliding Window (Fixed & Variable):** This is the workhorse. Master fixed-size windows first, then variable-size with a condition (like the template above).
3.  **Prefix Sum & Hashing:** Learn how to use a hash map to store prefix sums for O(1) lookups, crucial for problems like Subarray Sum Equals K (#560).
4.  **Sorting & Greedy Intervals:** Learn to sort by a key attribute and then make a single pass with a greedy decision rule.
5.  **In-place Manipulation:** Practice modifying arrays using swaps and overwrites without extra space. This solidifies your understanding of array indexing.
6.  **Cyclic Sort:** A niche but sometimes-tested pattern for arrays containing numbers in a specific range (e.g., Find All Numbers Disappeared in an Array #448).

This order builds from simple index manipulation to more complex state management (the window), then to auxiliary data structures (hashing), and finally to more specialized techniques.

## Recommended Practice Order

Solve these problems in sequence to build the competencies JPMorgan looks for:

1.  **Two Sum II - Input Array Is Sorted (#167)** - Basic two-pointer.
2.  **Best Time to Buy and Sell Stock (#121)** - Simple single pass (foundational).
3.  **Minimum Size Subarray Sum (#209)** - Master the sliding window template.
4.  **Longest Substring Without Repeating Characters (#3)** - Apply sliding window to strings (a common variant).
5.  **Subarray Sum Equals K (#560)** - Prefix sum + hashing pattern.
6.  **Merge Intervals (#56)** - Core interval pattern.
7.  **Insert Interval (#57)** - A harder variation of merging.
8.  **Product of Array Except Self (#238)** - Tests clever in-place manipulation.
9.  **Find All Duplicates in an Array (#442)** - In-place marking/cyclic sort pattern.
10. **Maximum Subarray (#53)** - Kadane's Algorithm, a must-know for any financial data context.

This sequence takes you from the absolute fundamentals to the more integrated patterns that combine several concepts, mirroring the progression of difficulty in an actual interview.

[Practice Array at JPMorgan](/company/jpmorgan/array)
