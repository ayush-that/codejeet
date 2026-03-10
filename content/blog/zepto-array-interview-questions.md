---
title: "Array Questions at Zepto: What to Expect"
description: "Prepare for Array interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-11-20"
category: "dsa-patterns"
tags: ["zepto", "array", "interview prep"]
---

If you're preparing for a Zepto interview, you've likely seen the data: **21 of their 28 tagged coding questions are Array-based.** That's not just a preference; it's a core competency. This focus stems directly from their business model. Zepto is a 10-minute grocery delivery service. Their entire operation—from inventory management in dark stores, to order batching, to delivery route optimization—revolves around processing lists of items, orders, and locations with extreme efficiency. An array is the most fundamental data structure for representing these sequences, so it's no surprise their technical interviews test your mastery over it. Expect at least one, and often two, array-focused problems in any coding round.

## Specific Patterns Zepto Favors

Zepto's array problems aren't about obscure tricks. They test applied problem-solving with patterns that map to real-world logistics. You'll see a heavy emphasis on:

1.  **Two-Pointer & Sliding Window:** This is arguably the most critical pattern for Zepto. It's the engine for optimizing contiguous operations—think finding the optimal batch of orders to deliver in one trip (maximum sum subarray), or managing inventory levels (subarrays with a sum constraint).
2.  **Sorting & Greedy Algorithms:** Many logistics problems involve "best fit" or "optimal arrangement." Sorting an array of orders by delivery time windows or product locations is often the first step to a greedy solution that minimizes total travel time.
3.  **Prefix Sum & Hashing:** For rapid calculation of order totals, inventory checks, or frequency analysis (e.g., "which items are most frequently ordered together?"), the combination of prefix sums and hash maps is indispensable. It transforms O(n²) brute-force checks into O(n) operations.
4.  **In-Place Array Manipulation:** Efficient use of space matters in high-throughput systems. Problems that ask you to rearrange, segregate, or modify an array using only O(1) extra space test this skill directly.

You will notice a distinct _lack_ of highly abstract or purely mathematical array problems. Recursive depth-first search (DFS) on arrays is rare; iterative approaches and greedy logic are king. Dynamic Programming (DP) does appear, but it's typically the more intuitive 1D or 2D iterative variety (like knapsack variants for order packing), not complex recursive memoization.

For example, **Sliding Window Maximum (#239)** is a classic test of maintaining a data structure (a deque) while processing a stream, analogous to tracking the highest-priority order in a moving time window. **Product of Array Except Self (#238)** perfectly tests understanding of prefix and suffix products without division—a pattern useful for aggregated calculations.

## How to Prepare

Don't just solve problems; internalize the patterns. For Zepto, you must be able to identify the sliding window pattern instantly. Here's the mental checklist: The problem asks for a _contiguous subarray_ (a "batch" or "window") related to a sum, product, or length, often with a constraint (like `k`). The solution involves two pointers (`left` and `right`) that define the window, and you adjust the left pointer to maintain validity.

Let's look at a foundational example: finding the length of the longest subarray with a sum less than or equal to a target `k`. This mimics a capacity constraint.

<div class="code-group">

```python
def longest_subarray_sum_limit(nums, k):
    """
    Finds the length of the longest contiguous subarray with sum <= k.
    Time: O(n) - Each element is processed at most twice (added and removed).
    Space: O(1) - Only a few integer variables are used.
    """
    left = 0
    current_sum = 0
    max_length = 0

    for right in range(len(nums)):
        # Expand the window by adding the element at 'right'
        current_sum += nums[right]

        # If the constraint is broken (sum > k), shrink from the left
        while current_sum > k and left <= right:
            current_sum -= nums[left]
            left += 1

        # At this point, the window [left, right] is valid.
        # Update the answer. We use right - left + 1 for the current length.
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
function longestSubarraySumLimit(nums, k) {
  // Time: O(n) | Space: O(1)
  let left = 0;
  let currentSum = 0;
  let maxLength = 0;

  for (let right = 0; right < nums.length; right++) {
    // Expand window
    currentSum += nums[right];

    // Shrink window while constraint is violated
    while (currentSum > k && left <= right) {
      currentSum -= nums[left];
      left++;
    }

    // Window [left, right] is now valid
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}
```

```java
public int longestSubarraySumLimit(int[] nums, int k) {
    // Time: O(n) | Space: O(1)
    int left = 0;
    int currentSum = 0;
    int maxLength = 0;

    for (int right = 0; right < nums.length; right++) {
        // Expand window
        currentSum += nums[right];

        // Shrink window while constraint is violated
        while (currentSum > k && left <= right) {
            currentSum -= nums[left];
            left++;
        }

        // Window [left, right] is now valid
        maxLength = Math.max(maxLength, right - left + 1);
    }
    return maxLength;
}
```

</div>

The second key pattern is using a hash map with a prefix sum for problems about finding subarrays that sum to a specific target. This is like checking if a combination of previous orders meets a certain total.

<div class="code-group">

```python
def subarray_sum_equals_k(nums, k):
    """
    Counts the number of contiguous subarrays whose sum equals k.
    Time: O(n) - Single pass through the array.
    Space: O(n) - In the worst case, the prefix sum map may hold n distinct sums.
    """
    count = 0
    prefix_sum = 0
    # Map: prefix_sum_value -> frequency of that value seen so far
    sum_map = {0: 1}  # Base case: a prefix sum of 0 has occurred once.

    for num in nums:
        prefix_sum += num
        # If (prefix_sum - k) exists in our map, it means there is a
        # previous prefix whose removal gives us a subarray summing to k.
        target = prefix_sum - k
        count += sum_map.get(target, 0)
        # Record the current prefix sum in the map for future checks
        sum_map[prefix_sum] = sum_map.get(prefix_sum, 0) + 1

    return count
```

```javascript
function subarraySumEqualsK(nums, k) {
  // Time: O(n) | Space: O(n)
  let count = 0;
  let prefixSum = 0;
  const sumMap = new Map();
  sumMap.set(0, 1); // Base case

  for (const num of nums) {
    prefixSum += num;
    const target = prefixSum - k;
    count += sumMap.get(target) || 0;
    sumMap.set(prefixSum, (sumMap.get(prefixSum) || 0) + 1);
  }
  return count;
}
```

```java
public int subarraySumEqualsK(int[] nums, int k) {
    // Time: O(n) | Space: O(n)
    int count = 0;
    int prefixSum = 0;
    Map<Integer, Integer> sumMap = new HashMap<>();
    sumMap.put(0, 1); // Base case

    for (int num : nums) {
        prefixSum += num;
        int target = prefixSum - k;
        count += sumMap.getOrDefault(target, 0);
        sumMap.put(prefixSum, sumMap.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
}
```

</div>

## How Zepto Tests Array vs Other Companies

Compared to other companies, Zepto's array questions are less about clever algorithm trivia and more about **applied efficiency**.

- **vs. FAANG (Meta, Google):** FAANG interviews often include array problems that are a gateway to more complex concepts (e.g., merging intervals leading to sweep-line algorithms, or binary search on array leading to optimization problems). Zepto's problems are more self-contained and directly tied to operational logic.
- **vs. FinTech (Stripe, PayPal):** FinTech leans heavily on hash maps for frequency counting and validation (think duplicate transactions). Zepto uses hashing too, but often combines it with the sliding window for time-series or sequence analysis.
- **vs. Early-Stage Startups:** Startups might ask more open-ended, design-heavy questions. Zepto, being a scale-up, has standardized on these core array patterns because they need engineers who can reliably write optimal code for their high-volume core systems.

The unique aspect is the **context**. You might be asked to frame your solution in terms of "orders," "delivery points," or "inventory slots." The underlying pattern, however, will remain one of the classics listed above.

## Study Order

Tackle these sub-topics in this logical progression to build a solid foundation:

1.  **Basic Traversal & Pointers:** Get comfortable with iterating and manipulating indices. This is non-negotiable.
2.  **Sorting & Binary Search:** Sorting transforms many problems. Learn how to use `Arrays.sort()` or `sorted()` and then apply binary search for O(log n) lookups.
3.  **Two-Pointer (Colliding & Fast-Slow):** Master the technique of using two pointers to traverse an array from different ends or at different speeds. This is essential for in-place operations and cycle detection.
4.  **Sliding Window (Fixed & Variable Length):** This is your most important pattern. Start with fixed-length windows, then move to variable-length where you dynamically adjust the window based on a constraint (like the code example above).
5.  **Prefix Sum & Hashing:** Learn how to pre-compute running sums and use a hash map to store and query them instantly. This pattern solves a huge class of subarray sum problems.
6.  **Greedy Algorithms on Sorted Arrays:** Many optimal scheduling or assignment problems become straightforward once the array is sorted. Practice identifying the greedy choice.
7.  **1D/2D Dynamic Programming:** Finally, tackle DP problems where the state is represented by an array (like House Robber #198 or 0/1 Knapsack variants). These are less frequent but appear for optimization problems.

## Recommended Practice Order

Solve these problems in sequence. Each introduces a slight twist on the core patterns:

1.  **Two Sum (#1)** - The classic hash map warm-up.
2.  **Best Time to Buy and Sell Stock (#121)** - Introduces the idea of tracking a minimum as you traverse (a simple form of greedy/1D DP).
3.  **Contains Duplicate (#217)** - Basic hash set application.
4.  **Product of Array Except Self (#238)** - Excellent for mastering prefix and suffix computations.
5.  **Maximum Subarray (#53)** - Kadane's Algorithm, a fundamental DP/greedy pattern.
6.  **Merge Intervals (#56)** - Sorting followed by a linear scan, very common for time-window merging.
7.  **3Sum (#15)** - A step-up in two-pointer technique after sorting.
8.  **Container With Most Water (#11)** - Classic colliding two-pointer problem.
9.  **Sliding Window Maximum (#239)** - Advanced sliding window requiring a deque. A true Zepto-style test.
10. **Subarray Sum Equals K (#560)** - Must-know prefix sum + hash map pattern (as coded above).
11. **Longest Substring Without Repeating Characters (#3)** - Although a string problem, it's the quintessential variable-length sliding window exercise. Apply the same logic to arrays of integers.

Master these, and you'll have covered the vast majority of the array territory Zepto explores. Remember, they are looking for clean, efficient, and communicable code that solves a concrete problem—just like you'd write to optimize a delivery batch on a busy Friday night.

[Practice Array at Zepto](/company/zepto/array)
