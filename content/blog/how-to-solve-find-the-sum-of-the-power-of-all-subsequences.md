---
title: "How to Solve Find the Sum of the Power of All Subsequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Sum of the Power of All Subsequences. Hard difficulty, 38.1% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-05-29"
category: "dsa-patterns"
tags: ["find-the-sum-of-the-power-of-all-subsequences", "array", "dynamic-programming", "hard"]
---

# How to Solve "Find the Sum of the Power of All Subsequences"

This problem asks us to compute the total number of subsequences across all possible subsequences of an array where the sum equals a target value `k`. The challenge is that we need to count subsequences, not subarrays—meaning elements don't need to be contiguous, and we can choose any subset of elements. With `n` elements, there are `2^n` possible subsequences, making brute force enumeration impossible for large `n`. The key insight is that we can use dynamic programming to count valid subsequences efficiently by tracking sums.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3]`, `k = 3`.

We need to count all subsequences with sum = 3:

- `[3]` (sum = 3)
- `[1, 2]` (sum = 3)

That's 2 subsequences. But wait—we need to understand how to compute this systematically.

Think about building subsequences element by element. For each element, we have two choices: include it or exclude it. We can track the sum of included elements.

Let's build a DP table where `dp[s]` = number of ways to achieve sum `s` using some subsequence:

1. Start with empty subsequence: `dp[0] = 1` (one way to get sum 0: choose nothing)
2. Process element 1 (value = 1):
   - Without element 1: all existing sums stay the same
   - With element 1: for each existing sum `s`, create new sum `s + 1`
   - Update: `dp[1] += dp[0]` → `dp[1] = 1`
   - Now `dp = {0:1, 1:1}`
3. Process element 2 (value = 2):
   - Without element 2: sums unchanged
   - With element 2: for each sum `s`, create `s + 2`
   - `dp[2] += dp[0]` → `dp[2] = 1`
   - `dp[3] += dp[1]` → `dp[3] = 1`
   - Now `dp = {0:1, 1:1, 2:1, 3:1}`
4. Process element 3 (value = 3):
   - Without element 3: sums unchanged
   - With element 3: for each sum `s`, create `s + 3`
   - `dp[3] += dp[0]` → `dp[3] = 1 + 1 = 2`
   - `dp[4] += dp[1]` → `dp[4] = 1`
   - `dp[5] += dp[2]` → `dp[5] = 1`
   - `dp[6] += dp[3]` (old value 1) → `dp[6] = 1`

Final `dp[3] = 2`, which matches our manual count. This DP approach efficiently counts subsequences without enumerating all `2^n` possibilities.

## Brute Force Approach

The most straightforward approach is to generate all `2^n` subsequences, compute each sum, and count how many equal `k`. We could use recursion or bit manipulation to generate subsets:

```python
def brute_force(nums, k):
    n = len(nums)
    count = 0

    # Try all 2^n subsets using bitmasks
    for mask in range(1 << n):
        current_sum = 0
        for i in range(n):
            if mask & (1 << i):  # Check if i-th bit is set
                current_sum += nums[i]
        if current_sum == k:
            count += 1

    return count
```

**Why this fails:** With `n` up to 100 (typical constraint), `2^100` is astronomically large (~1.27e30 operations). Even for `n=30`, that's over 1 billion operations. The brute force approach has O(2^n \* n) time complexity, which is completely infeasible for meaningful input sizes.

## Optimized Approach

The key insight is that we don't need to enumerate all subsequences individually. Instead, we can use **dynamic programming** to count how many subsequences achieve each possible sum.

Here's the step-by-step reasoning:

1. **State definition**: Let `dp[s]` represent the number of subsequences (from processed elements) that sum to exactly `s`.

2. **Initial state**: `dp[0] = 1` because there's exactly one way to get sum 0: the empty subsequence.

3. **Transition**: For each element `num` in `nums`:
   - We can either include `num` in a subsequence or exclude it
   - If we exclude it, all existing subsequences remain valid
   - If we include it, each existing subsequence with sum `s` creates a new subsequence with sum `s + num`
   - So we update: `dp[s + num] += dp[s]` for all sums `s` where `s + num ≤ k`

4. **Implementation detail**: We must process sums in **reverse order** (from `k` down to 0) when updating to avoid double-counting the same element multiple times in one iteration. If we go forward, adding `num` to a sum that was already updated in the current iteration would incorrectly use `num` twice.

5. **Final answer**: After processing all elements, `dp[k]` gives the total count of subsequences with sum exactly `k`.

This approach has O(n\*k) time complexity, which is feasible when `k` is reasonable (typically up to 1000).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * k) | Space: O(k)
def sumOfPower(nums, k):
    MOD = 10**9 + 7

    # dp[s] = number of subsequences with sum exactly s
    # Initialize with dp[0] = 1 (empty subsequence)
    dp = [0] * (k + 1)
    dp[0] = 1

    # Process each number in the array
    for num in nums:
        # Iterate backwards to avoid using the same element multiple times
        # We only need to update sums where s + num <= k
        for s in range(k - num, -1, -1):
            if dp[s] > 0:
                # Add num to all subsequences with sum s
                # This creates new subsequences with sum s + num
                dp[s + num] = (dp[s + num] + dp[s]) % MOD

    # The answer is the number of subsequences with sum exactly k
    return dp[k] % MOD
```

```javascript
// Time: O(n * k) | Space: O(k)
function sumOfPower(nums, k) {
  const MOD = 1e9 + 7;

  // dp[s] = number of subsequences with sum exactly s
  // Initialize with dp[0] = 1 (empty subsequence)
  const dp = new Array(k + 1).fill(0);
  dp[0] = 1;

  // Process each number in the array
  for (const num of nums) {
    // Iterate backwards to avoid using the same element multiple times
    // We only need to update sums where s + num <= k
    for (let s = k - num; s >= 0; s--) {
      if (dp[s] > 0) {
        // Add num to all subsequences with sum s
        // This creates new subsequences with sum s + num
        dp[s + num] = (dp[s + num] + dp[s]) % MOD;
      }
    }
  }

  // The answer is the number of subsequences with sum exactly k
  return dp[k] % MOD;
}
```

```java
// Time: O(n * k) | Space: O(k)
class Solution {
    public int sumOfPower(int[] nums, int k) {
        final int MOD = 1_000_000_007;

        // dp[s] = number of subsequences with sum exactly s
        // Initialize with dp[0] = 1 (empty subsequence)
        int[] dp = new int[k + 1];
        dp[0] = 1;

        // Process each number in the array
        for (int num : nums) {
            // Iterate backwards to avoid using the same element multiple times
            // We only need to update sums where s + num <= k
            for (int s = k - num; s >= 0; s--) {
                if (dp[s] > 0) {
                    // Add num to all subsequences with sum s
                    // This creates new subsequences with sum s + num
                    dp[s + num] = (dp[s + num] + dp[s]) % MOD;
                }
            }
        }

        // The answer is the number of subsequences with sum exactly k
        return dp[k] % MOD;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n \* k)

- We iterate through all `n` elements in the array
- For each element, we iterate through at most `k` possible sums (specifically `k - num` down to 0)
- In the worst case where `num` is small, we iterate through nearly all `k` sums for each of `n` elements

**Space Complexity:** O(k)

- We maintain a DP array of size `k + 1` to track counts for sums 0 through `k`
- No additional data structures scale with `n`

This is optimal for the problem constraints since we must at least examine each element once and track sums up to `k`.

## Common Mistakes

1. **Forward iteration instead of backward**: If you iterate sums from 0 to `k`, you'll double-count elements. Example: with `nums = [1]` and `k = 2`, forward iteration might incorrectly use the same `1` twice to make sum 2. Always iterate backwards when updating DP in-place for subset sum problems.

2. **Forgetting the modulo operation**: The problem states the answer may be large, so we need to return it modulo 10^9+7. Candidates often compute correct counts but forget the modulo, causing integer overflow in languages like Java or incorrect results in Python (though Python handles big integers, the problem expects modulo).

3. **Incorrect initialization**: Some candidates start with `dp[0] = 0` instead of `1`, forgetting that the empty subsequence has sum 0. This undercounts all valid subsequences.

4. **Not handling num > k correctly**: When `num > k`, we can't add it to any subsequence to reach sum `k` (since all sums are non-negative). The backward loop from `k - num` to 0 would have negative start index. Our code handles this correctly because when `num > k`, `k - num` is negative, so the loop doesn't execute.

## When You'll See This Pattern

This "subset sum counting" pattern appears in many DP problems:

1. **Partition Equal Subset Sum (LeetCode 416)**: Determine if an array can be partitioned into two subsets with equal sum. Uses similar DP to track achievable sums.

2. **Target Sum (LeetCode 494)**: Count ways to assign +/- to array elements to reach target sum. This is essentially a subset sum problem with positive and negative numbers.

3. **Coin Change II (LeetCode 518)**: Count number of combinations that make up an amount using coins. Very similar DP structure but with unlimited coins (unbounded knapsack) instead of one per element.

The core pattern is: when you need to count subsets/subsequences satisfying a sum constraint, use DP where state represents the sum and value represents the count of ways to achieve that sum.

## Key Takeaways

1. **Subsequence sum problems often reduce to subset sum DP**: Instead of enumerating all 2^n subsets, track achievable sums with counts using O(n\*k) DP.

2. **Iterate backwards when updating DP in-place**: For "0/1 knapsack" style problems (each element used at most once), always process sums from high to low to avoid reusing the same element multiple times in one iteration.

3. **Empty subsequence matters**: Always initialize `dp[0] = 1` because the empty set is a valid subsequence with sum 0.

Related problems: [Number of Subsequences That Satisfy the Given Sum Condition](/problem/number-of-subsequences-that-satisfy-the-given-sum-condition)
