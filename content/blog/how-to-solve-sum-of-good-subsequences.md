---
title: "How to Solve Sum of Good Subsequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sum of Good Subsequences. Hard difficulty, 30.8% acceptance rate. Topics: Array, Hash Table, Dynamic Programming."
date: "2026-04-10"
category: "dsa-patterns"
tags: ["sum-of-good-subsequences", "array", "hash-table", "dynamic-programming", "hard"]
---

# How to Solve Sum of Good Subsequences

This problem asks us to find the sum of all possible "good" subsequences from an integer array, where a good subsequence is defined as having consecutive elements with an absolute difference of exactly 1. The challenge lies in efficiently counting and summing exponentially many valid subsequences without explicitly enumerating them all.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider `nums = [1, 2, 3]`.

A subsequence is any sequence we can form by deleting some (or no) elements while maintaining order. Good subsequences must have consecutive elements differing by exactly 1.

Let's list all good subsequences:

- Single elements: [1], [2], [3] (all valid since no consecutive elements)
- Pairs: [1,2] (diff=1), [2,3] (diff=1), [1,3] (diff=2, NOT good)
- Triples: [1,2,3] (diffs: 1 and 1, both valid)

Now let's sum all these subsequences:

- [1] = 1
- [2] = 2
- [3] = 3
- [1,2] = 3
- [2,3] = 5
- [1,2,3] = 6

Total sum = 1 + 2 + 3 + 3 + 5 + 6 = 20

The brute force approach would generate all 2^n subsequences (8 for n=3) and check each one. For n=1000, this is impossible (2^1000 is astronomical). We need a smarter way to count without enumeration.

## Brute Force Approach

The naive solution would:

1. Generate all possible subsequences (2^n possibilities)
2. For each subsequence, check if it's "good" (all consecutive differences = 1)
3. Sum the elements of valid subsequences

This approach has O(2^n \* n) time complexity, which is completely infeasible for the constraints (n up to 10^5). Even for n=20, 2^20 = 1,048,576 operations might be borderline, but for n=1000, it's impossible.

The key insight we need is that we don't need to enumerate subsequences explicitly. We can use dynamic programming to count how many subsequences end with each value and what their sums are.

## Optimized Approach

The core insight: For any good subsequence ending with value `x`, the previous element must be either `x-1` or `x+1` (to maintain the difference of 1).

We can maintain two DP maps:

1. `count[x]`: Number of good subsequences ending with value `x`
2. `sum[x]`: Sum of all good subsequences ending with value `x`

When we process a new number `num`:

- It can start a new subsequence of length 1: `[num]`
- It can extend subsequences ending with `num-1`
- It can extend subsequences ending with `num+1`

The recurrence relations:

- New subsequence starting with `num`: adds 1 to `count[num]` and adds `num` to `sum[num]`
- Extending from `num-1`: For each subsequence ending with `num-1`, we append `num`. This creates `count[num-1]` new subsequences ending with `num`. Their total sum increases by `sum[num-1] + num * count[num-1]`
- Similarly for `num+1`

We process numbers in any order since subsequences don't depend on array order (we're counting all possible subsequences, not subarrays).

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) where n is the length of nums
# We process each number once and use hash maps for DP states
def sumOfGoodSubsequences(nums):
    """
    Calculate the sum of all good subsequences where consecutive
    elements differ by exactly 1.
    """
    MOD = 10**9 + 7

    # count[x] = number of good subsequences ending with value x
    count = {}
    # sum[x] = total sum of all good subsequences ending with value x
    sum_dp = {}

    for num in nums:
        # Initialize current values if not present
        current_count = 1  # The subsequence [num] itself
        current_sum = num  # Sum of the subsequence [num]

        # Extend subsequences ending with num-1
        if num - 1 in count:
            # For each subsequence ending with num-1, we can append num
            # This creates count[num-1] new subsequences ending with num
            # Their total sum increases by sum[num-1] + num * count[num-1]
            current_count = (current_count + count[num - 1]) % MOD
            current_sum = (current_sum + sum_dp[num - 1] + num * count[num - 1]) % MOD

        # Extend subsequences ending with num+1
        if num + 1 in count:
            current_count = (current_count + count[num + 1]) % MOD
            current_sum = (current_sum + sum_dp[num + 1] + num * count[num + 1]) % MOD

        # Update DP tables for current num
        # We need to add to existing values because num might appear multiple times
        if num in count:
            count[num] = (count[num] + current_count) % MOD
            sum_dp[num] = (sum_dp[num] + current_sum) % MOD
        else:
            count[num] = current_count
            sum_dp[num] = current_sum

    # Sum up all sums from all possible ending values
    result = 0
    for s in sum_dp.values():
        result = (result + s) % MOD

    return result
```

```javascript
// Time: O(n) | Space: O(n) where n is the length of nums
// We process each number once and use hash maps for DP states
function sumOfGoodSubsequences(nums) {
  const MOD = 10 ** 9 + 7;

  // count[x] = number of good subsequences ending with value x
  const count = new Map();
  // sum[x] = total sum of all good subsequences ending with value x
  const sumDP = new Map();

  for (const num of nums) {
    // Initialize current values for this occurrence of num
    let currentCount = 1; // The subsequence [num] itself
    let currentSum = num; // Sum of the subsequence [num]

    // Extend subsequences ending with num-1
    if (count.has(num - 1)) {
      const prevCount = count.get(num - 1);
      const prevSum = sumDP.get(num - 1);
      // For each subsequence ending with num-1, append num
      currentCount = (currentCount + prevCount) % MOD;
      currentSum = (currentSum + prevSum + num * prevCount) % MOD;
    }

    // Extend subsequences ending with num+1
    if (count.has(num + 1)) {
      const prevCount = count.get(num + 1);
      const prevSum = sumDP.get(num + 1);
      currentCount = (currentCount + prevCount) % MOD;
      currentSum = (currentSum + prevSum + num * prevCount) % MOD;
    }

    // Update DP tables for current num
    // Add to existing values since num might appear multiple times
    if (count.has(num)) {
      count.set(num, (count.get(num) + currentCount) % MOD);
      sumDP.set(num, (sumDP.get(num) + currentSum) % MOD);
    } else {
      count.set(num, currentCount);
      sumDP.set(num, currentSum);
    }
  }

  // Sum up all sums from all possible ending values
  let result = 0;
  for (const sum of sumDP.values()) {
    result = (result + sum) % MOD;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) where n is the length of nums
// We process each number once and use hash maps for DP states
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int sumOfGoodSubsequences(int[] nums) {
        final int MOD = 1_000_000_007;

        // count[x] = number of good subsequences ending with value x
        Map<Integer, Integer> count = new HashMap<>();
        // sum[x] = total sum of all good subsequences ending with value x
        Map<Integer, Integer> sumDP = new HashMap<>();

        for (int num : nums) {
            // Initialize current values for this occurrence of num
            long currentCount = 1;  // The subsequence [num] itself
            long currentSum = num;  // Sum of the subsequence [num]

            // Extend subsequences ending with num-1
            if (count.containsKey(num - 1)) {
                int prevCount = count.get(num - 1);
                int prevSum = sumDP.get(num - 1);
                // For each subsequence ending with num-1, append num
                currentCount = (currentCount + prevCount) % MOD;
                currentSum = (currentSum + prevSum + (long)num * prevCount) % MOD;
            }

            // Extend subsequences ending with num+1
            if (count.containsKey(num + 1)) {
                int prevCount = count.get(num + 1);
                int prevSum = sumDP.get(num + 1);
                currentCount = (currentCount + prevCount) % MOD;
                currentSum = (currentSum + prevSum + (long)num * prevCount) % MOD;
            }

            // Update DP tables for current num
            // Add to existing values since num might appear multiple times
            if (count.containsKey(num)) {
                int existingCount = count.get(num);
                int existingSum = sumDP.get(num);
                count.put(num, (int)((existingCount + currentCount) % MOD));
                sumDP.put(num, (int)((existingSum + currentSum) % MOD));
            } else {
                count.put(num, (int)currentCount);
                sumDP.put(num, (int)currentSum);
            }
        }

        // Sum up all sums from all possible ending values
        long result = 0;
        for (int sum : sumDP.values()) {
            result = (result + sum) % MOD;
        }

        return (int)result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each of the n numbers exactly once
- For each number, we perform O(1) hash map operations (lookups and updates)
- The final summation over distinct values is O(d) where d ≤ n

**Space Complexity:** O(n)

- In the worst case, all numbers are distinct, so we store O(n) entries in each hash map
- Even with duplicates, we still need O(d) space where d is the number of distinct values

The key to achieving linear time is recognizing that each number only needs to check its neighbors (num-1 and num+1), not all previous numbers.

## Common Mistakes

1. **Forgetting about single-element subsequences**: Every single element forms a valid good subsequence (since there are no consecutive elements to violate the condition). Candidates often miss these.

2. **Not handling duplicates correctly**: When the same number appears multiple times, we need to add to existing counts, not replace them. Each occurrence can create new subsequences independently.

3. **Integer overflow without modulo**: The sums can grow very large (exponential in n). We must apply modulo 10^9+7 operations throughout, not just at the end.

4. **Confusing subsequences with subarrays**: Subsequences don't need to be contiguous in the original array, only maintain order. This is a common point of confusion.

5. **Incorrect recurrence for sum calculation**: When extending subsequences, the new sum is `old_sum + num * count` (not just `old_sum + num`). Each existing subsequence gets extended, multiplying the contribution.

## When You'll See This Pattern

This problem uses **DP with hash maps** where the state is based on the ending value rather than position. Similar patterns appear in:

1. **Longest Increasing Subsequence (LeetCode 300)** - Classic DP problem where you track the longest subsequence ending at each position.

2. **Arithmetic Slices II - Subsequence (LeetCode 446)** - Uses DP with hash maps where key is (index, difference) to count arithmetic subsequences.

3. **Number of Longest Increasing Subsequence (LeetCode 673)** - Similar DP approach tracking both count and length of LIS ending at each position.

The common theme: when subsequences have constraints based on relationships between elements (difference, ratio, etc.), DP with states based on those relationships (like ending value) is often efficient.

## Key Takeaways

1. **DP with value-based states**: When dealing with subsequences and element relationships, consider DP states based on element values rather than positions, especially when values have a limited range or simple relationships.

2. **Count and sum separately**: For problems asking for sums of combinatorial objects, often maintain both count and sum DP tables. The sum recurrence usually involves both previous sum and count.

3. **Think about transitions**: For good subsequences ending with x, what could the previous element be? This defines the DP transitions. Here, only x-1 and x+1 are valid predecessors.

[Practice this problem on CodeJeet](/problem/sum-of-good-subsequences)
