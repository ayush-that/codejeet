---
title: "How to Solve Count the Hidden Sequences — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count the Hidden Sequences. Medium difficulty, 56.7% acceptance rate. Topics: Array, Prefix Sum."
date: "2027-02-03"
category: "dsa-patterns"
tags: ["count-the-hidden-sequences", "array", "prefix-sum", "medium"]
---

# How to Solve Count the Hidden Sequences

This problem asks us to count how many valid hidden sequences exist given an array of differences between consecutive elements. The tricky part is that the hidden sequence must stay within a given range `[lower, upper]`, and we need to determine how many starting values make this possible.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `differences = [1, -3, 4]`
- `lower = 1`
- `upper = 6`

We know that `differences[i] = hidden[i+1] - hidden[i]`. This means:

- `hidden[1] = hidden[0] + differences[0] = hidden[0] + 1`
- `hidden[2] = hidden[1] + differences[1] = hidden[0] + 1 - 3 = hidden[0] - 2`
- `hidden[3] = hidden[2] + differences[2] = hidden[0] - 2 + 4 = hidden[0] + 2`

So all elements in the hidden sequence can be expressed as `hidden[0] + prefix_sum[i]`, where `prefix_sum[i]` is the cumulative sum of differences up to index `i-1`.

For our example:

- `hidden[0] = hidden[0] + 0`
- `hidden[1] = hidden[0] + 1`
- `hidden[2] = hidden[0] - 2`
- `hidden[3] = hidden[0] + 2`

Now, all these values must be within `[lower, upper] = [1, 6]`. This means:

1. `hidden[0] + 0` must be between 1 and 6
2. `hidden[0] + 1` must be between 1 and 6
3. `hidden[0] - 2` must be between 1 and 6
4. `hidden[0] + 2` must be between 1 and 6

We can rewrite these as:

1. `1 ≤ hidden[0] ≤ 6`
2. `1 - 1 ≤ hidden[0] ≤ 6 - 1` → `0 ≤ hidden[0] ≤ 5`
3. `1 + 2 ≤ hidden[0] ≤ 6 + 2` → `3 ≤ hidden[0] ≤ 8`
4. `1 - 2 ≤ hidden[0] ≤ 6 - 2` → `-1 ≤ hidden[0] ≤ 4`

The valid `hidden[0]` values must satisfy ALL these constraints simultaneously. Taking the intersection:

- From constraint 1: `[1, 6]`
- From constraint 2: `[0, 5]`
- From constraint 3: `[3, 8]`
- From constraint 4: `[-1, 4]`

The intersection is `[3, 4]` (the highest lower bound is 3, the lowest upper bound is 4).

Thus, `hidden[0]` can be 3 or 4, giving us 2 valid sequences.

## Brute Force Approach

A naive approach would be to try every possible starting value for `hidden[0]` from `lower` to `upper`, build the entire sequence, and check if all elements stay within bounds.

```python
def brute_force(differences, lower, upper):
    count = 0
    for start in range(lower, upper + 1):
        current = start
        valid = True

        for diff in differences:
            current += diff
            if current < lower or current > upper:
                valid = False
                break

        if valid:
            count += 1

    return count
```

**Why this fails:** The range `[lower, upper]` can be as large as `10^9`, and we have up to `10^5` differences. In the worst case, we'd need to check `10^9` starting values, each requiring `O(n)` operations, resulting in `O(10^14)` operations — far too slow.

## Optimized Approach

The key insight is that we don't need to check every possible starting value. Since all elements are `hidden[0] + prefix_sum[i]`, we can determine the valid range for `hidden[0]` directly.

Let `prefix_min` be the minimum prefix sum and `prefix_max` be the maximum prefix sum. Then:

- The smallest value in the sequence will be `hidden[0] + prefix_min`
- The largest value in the sequence will be `hidden[0] + prefix_max`

For the entire sequence to stay within `[lower, upper]`, we need:

1. `hidden[0] + prefix_min ≥ lower` → `hidden[0] ≥ lower - prefix_min`
2. `hidden[0] + prefix_max ≤ upper` → `hidden[0] ≤ upper - prefix_max`

Additionally, `hidden[0]` itself must be within `[lower, upper]`.

So the valid range for `hidden[0]` is:

- `max(lower, lower - prefix_min) ≤ hidden[0] ≤ min(upper, upper - prefix_max)`

The number of valid starting values is:
`max(0, min(upper, upper - prefix_max) - max(lower, lower - prefix_min) + 1)`

We use `max(0, ...)` because if the upper bound is less than the lower bound, there are no valid sequences.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numberOfArrays(differences, lower, upper):
    """
    Counts the number of valid hidden sequences.

    Args:
        differences: List of differences between consecutive elements
        lower: Minimum allowed value in the sequence
        upper: Maximum allowed value in the sequence

    Returns:
        Number of valid starting values for hidden[0]
    """
    # Initialize prefix sum and track min/max
    prefix_sum = 0
    min_prefix = 0  # Track minimum prefix sum
    max_prefix = 0  # Track maximum prefix sum

    # Calculate prefix sums and track min/max
    for diff in differences:
        prefix_sum += diff
        min_prefix = min(min_prefix, prefix_sum)
        max_prefix = max(max_prefix, prefix_sum)

    # Calculate valid range for hidden[0]
    # hidden[0] must be >= max(lower, lower - min_prefix)
    # because the smallest element is hidden[0] + min_prefix ≥ lower
    lower_bound = max(lower, lower - min_prefix)

    # hidden[0] must be <= min(upper, upper - max_prefix)
    # because the largest element is hidden[0] + max_prefix ≤ upper
    upper_bound = min(upper, upper - max_prefix)

    # Count valid starting values
    # If upper_bound < lower_bound, there are no valid sequences
    return max(0, upper_bound - lower_bound + 1)
```

```javascript
// Time: O(n) | Space: O(1)
function numberOfArrays(differences, lower, upper) {
  /**
   * Counts the number of valid hidden sequences.
   *
   * @param {number[]} differences - Differences between consecutive elements
   * @param {number} lower - Minimum allowed value in the sequence
   * @param {number} upper - Maximum allowed value in the sequence
   * @return {number} Number of valid starting values for hidden[0]
   */
  let prefixSum = 0;
  let minPrefix = 0; // Track minimum prefix sum
  let maxPrefix = 0; // Track maximum prefix sum

  // Calculate prefix sums and track min/max
  for (const diff of differences) {
    prefixSum += diff;
    minPrefix = Math.min(minPrefix, prefixSum);
    maxPrefix = Math.max(maxPrefix, prefixSum);
  }

  // Calculate valid range for hidden[0]
  // hidden[0] must be >= max(lower, lower - minPrefix)
  const lowerBound = Math.max(lower, lower - minPrefix);

  // hidden[0] must be <= min(upper, upper - maxPrefix)
  const upperBound = Math.min(upper, upper - maxPrefix);

  // Count valid starting values
  // If upperBound < lowerBound, there are no valid sequences
  return Math.max(0, upperBound - lowerBound + 1);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int numberOfArrays(int[] differences, int lower, int upper) {
        /**
         * Counts the number of valid hidden sequences.
         *
         * @param differences Differences between consecutive elements
         * @param lower Minimum allowed value in the sequence
         * @param upper Maximum allowed value in the sequence
         * @return Number of valid starting values for hidden[0]
         */
        long prefixSum = 0;  // Use long to prevent overflow
        long minPrefix = 0;  // Track minimum prefix sum
        long maxPrefix = 0;  // Track maximum prefix sum

        // Calculate prefix sums and track min/max
        for (int diff : differences) {
            prefixSum += diff;
            minPrefix = Math.min(minPrefix, prefixSum);
            maxPrefix = Math.max(maxPrefix, prefixSum);
        }

        // Calculate valid range for hidden[0]
        // hidden[0] must be >= max(lower, lower - minPrefix)
        long lowerBound = Math.max(lower, lower - minPrefix);

        // hidden[0] must be <= min(upper, upper - maxPrefix)
        long upperBound = Math.min(upper, upper - maxPrefix);

        // Count valid starting values
        // If upperBound < lowerBound, there are no valid sequences
        return (int) Math.max(0, upperBound - lowerBound + 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the `differences` array to compute prefix sums and track min/max values.
- Each iteration does constant work (addition and comparison).

**Space Complexity:** O(1)

- We only use a few variables to track prefix sum, min prefix, and max prefix.
- No additional data structures are needed.

## Common Mistakes

1. **Forgetting that `hidden[0]` itself must be within bounds:** Some candidates only check `lower - min_prefix ≤ hidden[0] ≤ upper - max_prefix` but forget that `hidden[0]` must also satisfy `lower ≤ hidden[0] ≤ upper`. Always take the intersection with `[lower, upper]`.

2. **Integer overflow:** When `lower` and `upper` are large (up to 10^9) and prefix sums can be negative, calculations like `lower - min_prefix` can overflow 32-bit integers. Use 64-bit integers (long in Java, no issue in Python).

3. **Incorrect min/max initialization:** The prefix sum starts at 0 (before processing any differences), so `min_prefix` and `max_prefix` should both be initialized to 0, not to the first difference.

4. **Not handling empty result case:** When `upper_bound < lower_bound`, the result should be 0, not negative. Always use `max(0, ...)` when counting.

## When You'll See This Pattern

This problem uses **prefix sums with range constraints**, a pattern that appears in many array problems:

1. **Maximum Subarray (LeetCode 53):** Uses prefix sums to find the subarray with the largest sum by tracking minimum prefix sum.

2. **Contiguous Array (LeetCode 525):** Uses prefix sums (treating 0 as -1 and 1 as +1) to find the longest subarray with equal number of 0s and 1s.

3. **Subarray Sum Equals K (LeetCode 560):** Uses prefix sums with hash maps to count subarrays summing to a target value.

The common theme is transforming a problem about consecutive elements into a prefix sum problem, then using additional tracking (min/max or hash maps) to find the answer efficiently.

## Key Takeaways

1. **When you see "consecutive differences" or "relative constraints," think prefix sums:** The relationship `differences[i] = hidden[i+1] - hidden[i]` naturally leads to expressing all elements as `hidden[0] + prefix_sum[i]`.

2. **Range constraints become constraints on the starting value:** Once all elements are expressed relative to `hidden[0]`, checking if they stay within bounds becomes checking if `hidden[0]` stays within a derived range.

3. **Track min/max of prefix sums for range problems:** When you need all values to stay within bounds, the extreme values (min and max of prefix sums) determine the tightest constraints on the starting value.

[Practice this problem on CodeJeet](/problem/count-the-hidden-sequences)
