---
title: "Array Questions at Paytm: What to Expect"
description: "Prepare for Array interview questions at Paytm — patterns, difficulty breakdown, and study tips."
date: "2030-10-15"
category: "dsa-patterns"
tags: ["paytm", "array", "interview prep"]
---

If you're preparing for a Paytm interview, you should be looking at your screen right now and thinking one thing: arrays. A staggering 15 out of 29 of their tagged coding problems on major platforms are array-based. This isn't a coincidence or a quirk of categorization; it's a direct signal. At a company built on payments, financial data streams, and real-time transaction processing, the array is the fundamental data structure of business logic. Ledgers are arrays. Time-series data is an array. Batched API requests are arrays. Your interview will almost certainly involve manipulating one.

The frequency here is higher than at many pure-software product companies. While Google might ask about distributed systems or Meta about trees, Paytm's technical screen often grounds itself in the concrete, practical world of data transformation and validation—tasks their engineers perform daily. Expect at least one, often two, array-focused problems in any coding round.

## Specific Patterns Paytm Favors

Paytm's array problems aren't about obscure tricks. They test foundational patterns applied to scenarios with a _financial or logistical flavor_. You won't see many abstract mathematical puzzles. Instead, you'll see problems about scheduling transactions, calculating profits, validating sequences, or merging intervals of time.

The dominant patterns are:

1.  **Two-Pointer & Sliding Window:** This is the undisputed king. Why? Payment fraud detection often analyzes sliding time windows of transactions. Finding subarrays with certain sums (like a spending limit) is a classic. Problems like **Maximum Subarray (#53)** and **Subarray Sum Equals K (#560)** are core concepts.
2.  **Sorting & Greedy Algorithms:** Many financial problems involve optimal ordering—scheduling transactions to maximize throughput, batching requests to minimize latency, or assigning resources. **Merge Intervals (#56)** is a favorite, modeling overlapping time periods for transactions or system events.
3.  **Prefix Sum & Hashing:** Instantaneous range queries are vital. Calculating running balances, verifying totals, or finding if a cumulative sum hits a target are everyday operations. This makes problems like **Contiguous Array (#525)** and **Subarray Sum Equals K (#560)** highly relevant.
4.  **In-place Array Modification:** Efficient memory use matters in high-volume systems. Problems requiring you to rearrange, segregate, or modify an array without extra space (like moving zeros or applying rotations) test your ability to write memory-efficient code.

You'll notice a distinct lack of heavy recursion, complex dynamic programming (DP), or advanced graph theory on arrays. The DP that appears is usually the iterative, 1D variety (like **Coin Change (#322)**), directly applicable to "make a payment with minimum coins" scenarios.

## How to Prepare

Don't just solve problems; solve them with the constraints of a financial system in mind. Think about edge cases: empty arrays, large values, negative numbers (refunds!), and integer overflow.

For the sliding window pattern, you must be able to implement both the fixed-size and variable-size variants fluidly. Here's the variable-size template for finding the smallest subarray with a sum ≥ target:

<div class="code-group">

```python
def min_subarray_len(target, nums):
    """
    Finds the minimal length of a contiguous subarray whose sum is >= target.
    Time: O(n) | Space: O(1)
    """
    left = 0
    current_sum = 0
    min_length = float('inf')

    for right in range(len(nums)):
        current_sum += nums[right]  # Expand the window to the right

        # Shrink the window from the left as long as the condition is met
        while current_sum >= target:
            min_length = min(min_length, right - left + 1)
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
    currentSum += nums[right]; // Expand window

    // Shrink window from left while condition is satisfied
    while (currentSum >= target) {
      minLength = Math.min(minLength, right - left + 1);
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
        currentSum += nums[right]; // Expand window

        // Shrink window from left while condition is satisfied
        while (currentSum >= target) {
            minLength = Math.min(minLength, right - left + 1);
            currentSum -= nums[left];
            left++;
        }
    }

    return minLength == Integer.MAX_VALUE ? 0 : minLength;
}
```

</div>

For the sorting & greedy pattern, practice identifying when sorting unlocks a simple greedy solution. The classic "Merge Intervals" problem is a perfect example:

<div class="code-group">

```python
def merge(intervals):
    """
    Merges all overlapping intervals.
    Time: O(n log n) due to sort | Space: O(n) for output (or O(1) if input can be modified)
    """
    if not intervals:
        return []

    # Sort by the start time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]

        # If the current interval overlaps with the last merged one, merge them
        if current_start <= last_end:
            merged[-1] = [last_start, max(last_end, current_end)]
        else:
            merged.append([current_start, current_end])

    return merged
```

```javascript
function merge(intervals) {
  // Time: O(n log n) | Space: O(n)
  if (intervals.length === 0) return [];

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const [currStart, currEnd] = intervals[i];
    const [lastStart, lastEnd] = merged[merged.length - 1];

    // Overlap check and merge
    if (currStart <= lastEnd) {
      merged[merged.length - 1][1] = Math.max(lastEnd, currEnd);
    } else {
      merged.push([currStart, currEnd]);
    }
  }
  return merged;
}
```

```java
public int[][] merge(int[][] intervals) {
    // Time: O(n log n) | Space: O(n) for output (or O(log n) for sort space)
    if (intervals.length == 0) return new int[0][];

    // Sort by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);

    for (int i = 1; i < intervals.length; i++) {
        int[] current = intervals[i];
        int[] last = merged.get(merged.size() - 1);

        // Overlap check and merge
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.add(current);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

## How Paytm Tests Array vs Other Companies

Compared to other major companies, Paytm's array questions are less about algorithmic cleverness for its own sake and more about _applied robustness_.

- **vs. FAANG:** A company like Google might embed an array problem within a larger system design context or require a highly optimized, non-intuitive solution (e.g., a tricky O(n) solution for a problem that seems O(n log n)). Paytm's problems are more direct. The "trick" is usually recognizing a standard pattern, but implementing it flawlessly with all edge cases handled.
- **vs. Startups:** Startups might ask more open-ended, design-heavy array problems. Paytm's questions are well-defined, similar to LeetCode, but with a domain twist. The interviewer will likely probe your thought process on scalability and real-world constraints more than a startup might.
- **The Unique Angle:** The "Paytm flavor" is the implicit requirement to think about the problem as a _data validation or transaction processing_ task. When you solve it, be prepared to answer: "How would this handle 10 million transactions per second?" or "What if the data stream is not sorted?"

## Study Order

Tackle the patterns in this logical progression:

1.  **Basic Traversal & In-place Operations:** Build muscle memory. Problems: Remove Element (#27), Move Zeroes (#283).
2.  **Two-Pointer (Sorted Data):** Learn to use order to your advantage. Problems: Two Sum II (#167), Remove Duplicates from Sorted Array (#26).
3.  **Sliding Window (Fixed & Variable):** Master the most critical pattern for time-series analysis. Problems: Best Time to Buy and Sell Stock (#121), Longest Substring Without Repeating Characters (#3) — it's a string, but the pattern is identical.
4.  **Prefix Sum & Hashing:** Learn to pre-process for fast queries. Problems: Subarray Sum Equals K (#560), Contiguous Array (#525).
5.  **Sorting & Greedy:** Learn to transform problems into a solvable state. Problems: Merge Intervals (#56), Non-overlapping Intervals (#435).
6.  **1D Dynamic Programming:** For the final layer of optimization. Problems: Coin Change (#322), Maximum Subarray (#53) (Kadane's Algorithm, which is essentially DP).

This order builds from simple data manipulation to combining patterns. You can't effectively use a sliding window if you struggle with basic two-pointer movement.

## Recommended Practice Order

Solve these Paytm-relevant problems in sequence:

1.  **Two Sum (#1)** - The absolute foundational hash map problem.
2.  **Best Time to Buy and Sell Stock (#121)** - Classic greedy/sliding window with financial context.
3.  **Merge Intervals (#56)** - Core pattern for scheduling and batching.
4.  **Subarray Sum Equals K (#560)** - Combines prefix sum and hashing; extremely important.
5.  **Product of Array Except Self (#238)** - Tests understanding of prefix/postfix computation in-place.
6.  **Find All Duplicates in an Array (#442)** - A clever in-place marking problem.
7.  **Non-overlapping Intervals (#435)** - A slight twist on the merge intervals greedy approach.
8.  **Coin Change (#322)** - The definitive 1D DP problem for payments.

Master these, and you'll have covered the vast majority of the array territory Paytm explores. Remember, they're testing for a competent, careful engineer who can write efficient, clean code for their core domain—not a research algorithmist.

[Practice Array at Paytm](/company/paytm/array)
