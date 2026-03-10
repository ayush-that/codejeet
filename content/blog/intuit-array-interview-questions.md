---
title: "Array Questions at Intuit: What to Expect"
description: "Prepare for Array interview questions at Intuit — patterns, difficulty breakdown, and study tips."
date: "2028-10-19"
category: "dsa-patterns"
tags: ["intuit", "array", "interview prep"]
---

If you're preparing for an interview at Intuit, you've likely seen the statistic: **41 out of their 71 tagged LeetCode problems are Array-based.** That's 58%. This isn't a quirk of their LeetCode company page; it's a direct reflection of their business. Intuit's core products—QuickBooks, TurboTax, Mint—are fundamentally about processing financial data: transactions, deductions, income streams, budgets. This data is most naturally represented and manipulated as sequences, or **arrays**. An interview at Intuit isn't an abstract algorithms test; it's a proxy for how you'd handle the ordered, numerical data at the heart of their software. Expect at least one, and often two, array-focused problems in any technical screen or onsite loop. They are not a secondary topic; they are the primary battlefield.

## Specific Patterns Intuit Favors

Intuit's array problems skew heavily toward **practical data manipulation** rather than purely mathematical or computer science puzzles. You won't find many convoluted graph transformations hidden in arrays here. Instead, focus on these core patterns:

1.  **Sliding Window & Two Pointers:** This is the undisputed king for Intuit. Why? Think about real-time transaction analysis, finding periods of high expenditure, or validating sequences of entries. Problems like finding a subarray with a given sum or the longest substring with unique characters are direct analogs.
    - **LeetCode Examples:** #3 Longest Substring Without Repeating Characters, #209 Minimum Size Subarray Sum, #713 Subarray Product Less Than K.

2.  **Sorting & Interval Merging:** Financial data often comes with start/end dates (tax years, subscription periods, fiscal quarters). Merging, inserting, and comparing intervals is a daily task.
    - **LeetCode Examples:** #56 Merge Intervals, #57 Insert Interval, #252 Meeting Rooms.

3.  **Prefix Sum & Hashing for Subarray Problems:** Quickly answering queries about ranges (e.g., "what were the total expenses between March and July?") is crucial. The combination of a prefix sum array and a hash map to track seen sums is a powerful tool for problems like finding subarrays that sum to `k`.
    - **LeetCode Examples:** #560 Subarray Sum Equals K, #325 Maximum Size Subarray Sum Equals k.

4.  **In-place Array Modification:** Efficiently reordering or segregating data in a single pass reflects real-world memory constraints. Think of flagging suspicious transactions to one side of a list.
    - **LeetCode Examples:** #75 Sort Colors (Dutch National Flag), #283 Move Zeroes.

Recursive Dynamic Programming is less common. Their array problems are typically **iterative, pointer-based, and emphasize optimal time _and_ space complexity.** They love an O(n) time, O(1) space solution.

## How to Prepare

Master the sliding window pattern in all its forms. Let's break down the two-pointer sliding window template for finding the smallest subarray with a sum ≥ target. This pattern is reusable for "maximum length with unique chars," "subarrays with product < k," and more.

<div class="code-group">

```python
def min_subarray_len(target, nums):
    """
    Finds the minimal length of a contiguous subarray whose sum is >= target.
    Time: O(n) - Each element is processed at most twice (by `end` and `start`).
    Space: O(1) - Only uses a few integer variables.
    """
    n = len(nums)
    min_len = float('inf')
    window_sum = 0
    start = 0  # Left pointer of the sliding window

    for end in range(n):  # `end` is the right pointer
        window_sum += nums[end]

        # Shrink the window from the left as long as the condition is met
        while window_sum >= target:
            min_len = min(min_len, end - start + 1)
            window_sum -= nums[start]
            start += 1

    return 0 if min_len == float('inf') else min_len
```

```javascript
function minSubArrayLen(target, nums) {
  /**
   * Finds the minimal length of a contiguous subarray whose sum is >= target.
   * Time: O(n) - Each element is processed at most twice.
   * Space: O(1) - Constant extra space.
   */
  let n = nums.length;
  let minLen = Infinity;
  let windowSum = 0;
  let start = 0; // Left pointer of the sliding window

  for (let end = 0; end < n; end++) {
    // `end` is the right pointer
    windowSum += nums[end];

    // Shrink the window from the left as long as the condition is met
    while (windowSum >= target) {
      minLen = Math.min(minLen, end - start + 1);
      windowSum -= nums[start];
      start++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
}
```

```java
public int minSubArrayLen(int target, int[] nums) {
    /**
     * Finds the minimal length of a contiguous subarray whose sum is >= target.
     * Time: O(n) - Each element is processed at most twice.
     * Space: O(1) - Constant extra space.
     */
    int n = nums.length;
    int minLen = Integer.MAX_VALUE;
    int windowSum = 0;
    int start = 0; // Left pointer of the sliding window

    for (int end = 0; end < n; end++) { // `end` is the right pointer
        windowSum += nums[end];

        // Shrink the window from the left as long as the condition is met
        while (windowSum >= target) {
            minLen = Math.min(minLen, end - start + 1);
            windowSum -= nums[start];
            start++;
        }
    }

    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}
```

</div>

For prefix sum problems, the key insight is using a hash map to store the frequency of prefix sums you've seen. Here's the core of solving "Subarray Sum Equals K":

<div class="code-group">

```python
def subarray_sum_equals_k(nums, k):
    """
    Counts the number of subarrays that sum to exactly k.
    Time: O(n) - Single pass through the array.
    Space: O(n) - In the worst case, the hash map can hold n distinct prefix sums.
    """
    count = 0
    prefix_sum = 0
    # Map: prefix_sum_value -> frequency_of_that_value_seen_so_far
    prefix_sum_map = {0: 1}  # Crucial: a prefix sum of 0 has occurred once (empty subarray)

    for num in nums:
        prefix_sum += num
        # If (prefix_sum - k) exists in the map, we found subarrays summing to k
        count += prefix_sum_map.get(prefix_sum - k, 0)
        # Record the current prefix sum in the map
        prefix_sum_map[prefix_sum] = prefix_sum_map.get(prefix_sum, 0) + 1

    return count
```

```javascript
function subarraySum(nums, k) {
  /**
   * Counts the number of subarrays that sum to exactly k.
   * Time: O(n) - Single pass.
   * Space: O(n) - Worst-case hash map size.
   */
  let count = 0;
  let prefixSum = 0;
  const prefixSumMap = new Map();
  prefixSumMap.set(0, 1); // Crucial: empty subarray sum

  for (const num of nums) {
    prefixSum += num;
    // If (prefixSum - k) exists, we found subarrays summing to k
    if (prefixSumMap.has(prefixSum - k)) {
      count += prefixSumMap.get(prefixSum - k);
    }
    // Record the current prefix sum
    prefixSumMap.set(prefixSum, (prefixSumMap.get(prefixSum) || 0) + 1);
  }
  return count;
}
```

```java
public int subarraySum(int[] nums, int k) {
    /**
     * Counts the number of subarrays that sum to exactly k.
     * Time: O(n) - Single pass.
     * Space: O(n) - Worst-case hash map size.
     */
    int count = 0, prefixSum = 0;
    Map<Integer, Integer> prefixSumMap = new HashMap<>();
    prefixSumMap.put(0, 1); // Crucial: empty subarray sum

    for (int num : nums) {
        prefixSum += num;
        // If (prefixSum - k) exists, we found subarrays summing to k
        count += prefixSumMap.getOrDefault(prefixSum - k, 0);
        // Record the current prefix sum
        prefixSumMap.put(prefixSum, prefixSumMap.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
}
```

</div>

## How Intuit Tests Array vs Other Companies

- **vs. Google/Meta:** These companies often use arrays as a vehicle for more abstract graph or system design concepts (e.g., #399 Evaluate Division, #759 Employee Free Time). Intuit's arrays _are_ the problem—the data modeling is explicit.
- **vs. Amazon:** Amazon leans heavily on hash maps and sets with arrays (Two Sum variants). While Intuit uses hashing, it's more frequently paired with prefix sums for range queries rather than simple complement lookups.
- **vs. Startups/Unicorns:** Startups might ask trickier, less common array puzzles. Intuit's problems are more predictable in pattern but demand flawless, clean implementation. The difficulty is in execution, not in unearthing a hidden algorithm.
- **The Intuit "Feel":** Problems often have a clear, real-world narrative: "merge accounting periods," "find a sequence of transactions that matches a pattern," "flag invalid entries." Your solution's efficiency directly translates to processing large financial datasets.

## Study Order

Tackle these sub-topics in this order to build a logical foundation:

1.  **Basic Two-Pointer Operations:** (Reversal, palindromes). This builds intuition for manipulating indices. (LeetCode #344, #125)
2.  **In-place Modification & Sorting:** Learn to partition and segregate data without extra space. This is a common optimization ask. (LeetCode #75, #283, #912)
3.  **Sliding Window (Fixed & Variable):** This is your most important tool. Master the template for both fixed-size and dynamically-sized windows. (LeetCode #209, #3, #904)
4.  **Prefix Sum & Cumulative Array:** Understand how to pre-compute range sums. (LeetCode #303, #238)
5.  **Prefix Sum + Hash Map:** Combine steps 3 & 4 to solve the trickier subarray sum/count problems. (LeetCode #560, #325)
6.  **Interval Merging & Scheduling:** Apply sorting and greedy principles to handle ranges, a direct business use case. (LeetCode #56, #57, #252)

## Recommended Practice Order

Solve these Intuit-tagged problems in sequence. Each group reinforces a pattern before moving to the next.

1.  **Warm-up & In-place:** #283 Move Zeroes, #75 Sort Colors.
2.  **Sliding Window Foundation:** #209 Minimum Size Subarray Sum, #3 Longest Substring Without Repeating Characters, #713 Subarray Product Less Than K.
3.  **Prefix Sum & Hashing:** #560 Subarray Sum Equals K, #325 Maximum Size Subarray Sum Equals k, #523 Continuous Subarray Sum.
4.  **Intervals (Common at Intuit):** #56 Merge Intervals, #57 Insert Interval, #252 Meeting Rooms.
5.  **Final Integration (Medium Level):** #11 Container With Most Water (two-pointer), #15 3Sum (sorting + two-pointer), #238 Product of Array Except Self (prefix/suffix product).

This progression moves from simple pointer mechanics to the combined patterns that solve Intuit's most frequent and relevant array challenges. Remember, at Intuit, an optimal array solution isn't just correct code—it's efficient data processing for their domain.

[Practice Array at Intuit](/company/intuit/array)
