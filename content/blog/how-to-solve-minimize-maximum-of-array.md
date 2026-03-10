---
title: "How to Solve Minimize Maximum of Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimize Maximum of Array. Medium difficulty, 46.5% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Greedy, Prefix Sum."
date: "2027-06-29"
category: "dsa-patterns"
tags: ["minimize-maximum-of-array", "array", "binary-search", "dynamic-programming", "medium"]
---

# How to Solve Minimize Maximum of Array

You're given an array of non-negative integers where you can repeatedly take 1 from any element (except the first) and add it to the element immediately to its left. Your goal is to minimize the maximum value in the array after performing as many such operations as needed. The tricky part is that operations can only move values leftward, creating an asymmetric constraint that requires careful analysis of prefix averages rather than simple array balancing.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [3, 7, 1, 6]`

**Initial state:** `[3, 7, 1, 6]` with maximum value = 7

**Operation 1:** Take 1 from index 1 (value 7), add to index 0

- `[4, 6, 1, 6]` max = 6

**Operation 2:** Take 1 from index 3 (value 6), add to index 2

- `[4, 6, 2, 5]` max = 6

**Operation 3:** Take 1 from index 1 (value 6), add to index 0

- `[5, 5, 2, 5]` max = 5

**Operation 4:** Take 1 from index 3 (value 5), add to index 2

- `[5, 5, 3, 4]` max = 5

**Operation 5:** Take 1 from index 3 (value 4), add to index 2

- `[5, 5, 4, 3]` max = 5

**Operation 6:** Take 1 from index 1 (value 5), add to index 0

- `[6, 4, 4, 3]` max = 6 (oops, that made it worse!)

This shows we can't just greedily reduce the current maximum. Let's think differently: Since we can only move values left, the total sum of the first `k+1` elements can be redistributed among those positions. The minimum possible maximum for the first `k+1` elements is the ceiling of their average: `ceil(sum / (k+1))`.

For our example `[3, 7, 1, 6]`:

- Prefix 1: `[3]` → max ≥ ceil(3/1) = 3
- Prefix 2: `[3, 7]` → max ≥ ceil((3+7)/2) = ceil(10/2) = 5
- Prefix 3: `[3, 7, 1]` → max ≥ ceil((3+7+1)/3) = ceil(11/3) = ceil(3.67) = 4
- Prefix 4: `[3, 7, 1, 6]` → max ≥ ceil((3+7+1+6)/4) = ceil(17/4) = ceil(4.25) = 5

The answer is the maximum of these prefix ceilings: `max(3, 5, 4, 5) = 5`

Let's verify: Can we achieve maximum value 5? Yes, one possible arrangement is `[5, 5, 4, 3]`.

## Brute Force Approach

A naive approach would try to simulate the operations. We could:

1. Find the current maximum value in the array
2. Try to reduce it by moving values from elements to its right (if any) leftward
3. Repeat until no further improvements are possible

The problem with this approach is that it's extremely inefficient. In the worst case (like `[0, 0, 0, 1000000]`), we'd need to perform millions of operations. Even with optimization, we'd need to track which elements can donate to which positions, leading to O(n²) complexity or worse.

More fundamentally, this approach misses the key mathematical insight: the answer depends on prefix averages, not on simulating individual transfers. The brute force would also struggle with determining when we've reached the optimal state.

## Optimized Approach

The key insight is that operations can only move values leftward, so for any prefix of length `k+1` (indices 0 through k), the total sum of those elements is fixed. We can redistribute this sum among the `k+1` positions, but we cannot bring in any value from outside this prefix.

Therefore, the minimum possible maximum value for the entire array must be at least the ceiling of the average of each prefix:

```
answer ≥ ceil(prefix_sum / (k+1)) for all k from 0 to n-1
```

The beautiful part is that this lower bound is actually achievable. We can always redistribute values within each prefix to make the maximum equal to this ceiling value. The algorithm becomes:

1. Calculate the running prefix sum as we iterate through the array
2. For each position `i`, compute `ceil(prefix_sum / (i+1))`
3. Track the maximum of these values

Why does this work? Consider any prefix ending at index `i`. If we need to achieve maximum value `M`, we must be able to distribute the prefix sum so that no element exceeds `M`. The maximum total we can have without exceeding `M` is `M * (i+1)`. Therefore, we need `prefix_sum ≤ M * (i+1)`, or equivalently `M ≥ ceil(prefix_sum / (i+1))`.

Since this must hold for every prefix, the answer is the maximum of all these ceiling values.

## Optimal Solution

Here's the implementation using the prefix average approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimizeArrayValue(nums):
    """
    Returns the minimum possible maximum value after performing operations
    that can only move values leftward in the array.

    The key insight: For any prefix of the array, the minimum possible
    maximum value for that prefix is the ceiling of its average.
    The answer is the maximum of these prefix ceiling averages.
    """
    total = 0  # Running prefix sum
    result = 0  # Track the maximum ceiling average

    for i in range(len(nums)):
        total += nums[i]  # Add current element to prefix sum

        # Calculate ceiling of prefix average: (total + i) // (i + 1)
        # Using (total + i) // (i + 1) is equivalent to ceil(total / (i + 1))
        # because integer division truncates downward, and adding i
        # before dividing effectively rounds up
        current_ceil = (total + i) // (i + 1)

        # Update result if this prefix requires a higher maximum
        result = max(result, current_ceil)

    return result
```

```javascript
// Time: O(n) | Space: O(1)
function minimizeArrayValue(nums) {
  /**
   * Returns the minimum possible maximum value after performing operations
   * that can only move values leftward in the array.
   *
   * The key insight: For any prefix of the array, the minimum possible
   * maximum value for that prefix is the ceiling of its average.
   * The answer is the maximum of these prefix ceiling averages.
   */
  let total = 0; // Running prefix sum
  let result = 0; // Track the maximum ceiling average

  for (let i = 0; i < nums.length; i++) {
    total += nums[i]; // Add current element to prefix sum

    // Calculate ceiling of prefix average: Math.ceil(total / (i + 1))
    // We use Math.ceil to get the smallest integer ≥ the average
    const currentCeil = Math.ceil(total / (i + 1));

    // Update result if this prefix requires a higher maximum
    result = Math.max(result, currentCeil);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minimizeArrayValue(int[] nums) {
        /**
         * Returns the minimum possible maximum value after performing operations
         * that can only move values leftward in the array.
         *
         * The key insight: For any prefix of the array, the minimum possible
         * maximum value for that prefix is the ceiling of its average.
         * The answer is the maximum of these prefix ceiling averages.
         */
        long total = 0;  // Use long to prevent overflow with large sums
        int result = 0;

        for (int i = 0; i < nums.length; i++) {
            total += nums[i];  // Add current element to prefix sum

            // Calculate ceiling of prefix average: (total + i) / (i + 1)
            // The cast to int is safe because result fits in 32-bit integer
            int currentCeil = (int) ((total + i) / (i + 1));

            // Update result if this prefix requires a higher maximum
            result = Math.max(result, currentCeil);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the array, performing constant-time operations at each step (addition, division, comparison).
- The loop runs exactly n times, where n is the length of the input array.

**Space Complexity:** O(1)

- We only use a few variables (`total`, `result`, loop counter) regardless of input size.
- No additional data structures are created that scale with input size.

## Common Mistakes

1. **Using integer division without proper ceiling calculation:** Writing `total / (i+1)` instead of `ceil(total / (i+1))` or `(total + i) / (i+1)`. This gives the floor instead of the ceiling, which is incorrect when the average isn't an integer.

2. **Integer overflow with large sums:** In languages like Java, using `int` for the running total can overflow with large arrays and large values. Always use `long` for the prefix sum when values can be up to 10⁹ and array length up to 10⁵.

3. **Trying to simulate operations:** Candidates often waste time trying to actually move values around or use greedy approaches that reduce the current maximum. This misses the mathematical insight about prefix averages.

4. **Forgetting the array is 0-indexed:** When calculating `(i+1)` for the denominator, remember that `i` is the index, so the prefix length is `i+1`. Using `i` instead would be off-by-one.

## When You'll See This Pattern

This problem uses the "prefix average ceiling" pattern, which appears in problems where:

1. You need to distribute resources subject to ordering constraints
2. Operations can only move values in one direction
3. You're minimizing a maximum or maximizing a minimum

Related problems:

- **Maximum Candies Allocated to K Children (Medium):** Similar concept of distributing items among groups while minimizing the maximum or maximizing the minimum. Uses binary search on the answer space.
- **Minimum Speed to Arrive on Time (Medium):** Another "minimize maximum" problem solved with binary search, where you test if a candidate speed works.
- **Minimum Time to Complete Trips (Medium):** Binary search on time to find the minimum time needed, testing feasibility at each candidate.

The common thread is testing feasibility of a candidate answer, often using greedy checks or mathematical bounds.

## Key Takeaways

1. **When operations have directional constraints (like only moving left), think in terms of prefixes.** The inability to move values rightward means each prefix's sum is a hard constraint on what can be achieved within that prefix.

2. **For "minimize maximum" problems, consider if the answer can be expressed as a function of prefix/suffix statistics.** Often the answer is the maximum of some per-prefix calculation rather than requiring complex simulation.

3. **Ceiling division trick:** Remember that `ceil(a/b) = (a + b - 1) // b` for positive integers. In our case with 0-indexing, it becomes `(total + i) // (i + 1)`.

Related problems: [Maximum Candies Allocated to K Children](/problem/maximum-candies-allocated-to-k-children), [Minimum Speed to Arrive on Time](/problem/minimum-speed-to-arrive-on-time), [Minimum Time to Complete Trips](/problem/minimum-time-to-complete-trips)
