---
title: "How to Solve Maximum Strength of K Disjoint Subarrays — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Strength of K Disjoint Subarrays. Hard difficulty, 27.5% acceptance rate. Topics: Array, Dynamic Programming, Prefix Sum."
date: "2026-06-29"
category: "dsa-patterns"
tags:
  ["maximum-strength-of-k-disjoint-subarrays", "array", "dynamic-programming", "prefix-sum", "hard"]
---

# How to Solve Maximum Strength of K Disjoint Subarrays

You're given an array `nums` and an odd integer `k`. Your task is to select exactly `k` non-overlapping subarrays (with the last element of each subarray coming before the first element of the next) to maximize the "strength" — which is the sum of each subarray multiplied by alternating signs: `sub₁ - sub₂ + sub₃ - sub₄ + ...`. The alternating signs make this problem particularly tricky because the sign of each subarray depends on its position, and we need to track both the number of subarrays selected and their parity.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3, -1, -2]` with `k = 3`.

We need to select 3 disjoint subarrays with alternating signs: `+sub₁ - sub₂ + sub₃`. The subarrays must be in order, so we can think of this as partitioning the array into 3 segments, each contributing with alternating signs.

One valid selection:

- `sub₁ = [1, 2]` → sum = 3, contributes `+3`
- `sub₂ = [3]` → sum = 3, contributes `-3`
- `sub₃ = [-1, -2]` → sum = -3, contributes `+(-3) = -3`
- Total strength: `3 - 3 - 3 = -3`

But we can do better:

- `sub₁ = [1, 2, 3]` → sum = 6, contributes `+6`
- `sub₂ = [-1]` → sum = -1, contributes `-(-1) = 1`
- `sub₃ = [-2]` → sum = -2, contributes `+(-2) = -2`
- Total strength: `6 + 1 - 2 = 5`

The challenge is finding the optimal partition among all possible selections. Notice that `k` is odd, so the last subarray always has a positive sign. This alternating pattern is key to the dynamic programming approach.

## Brute Force Approach

A naive solution would try all possible ways to select `k` subarrays. For each subarray, we need to choose its starting and ending indices, ensuring they don't overlap and are in order. With `n` elements and `k` subarrays, this leads to combinatorial explosion.

We could try recursion: at each step, choose a subarray starting from some index, add it with appropriate sign, and recursively select the remaining subarrays from the remaining portion of the array. However, this would have exponential time complexity — roughly O(n^k) — which is completely impractical for typical constraints where `n` can be up to 10^4.

Even for small `n`, this approach fails because we need to consider all possible subarray lengths at each step. A candidate might try to optimize by precomputing prefix sums to quickly calculate subarray sums, but the fundamental issue remains: we're exploring too many possibilities.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with two dimensions:

1. **Position in the array** (which element we're considering)
2. **Number of subarrays selected so far**

But there's a twist: we also need to track whether the current subarray we're building is "open" or "closed" because we can either extend the current subarray or start a new one. This gives us three states for our DP:

Let `dp[i][j][state]` represent the maximum strength achievable considering the first `i` elements, having selected `j` complete subarrays, where `state` indicates:

- `0`: Not currently building a subarray (last subarray is closed)
- `1`: Currently building a subarray that will have positive contribution
- `2`: Currently building a subarray that will have negative contribution

The sign alternates: the 1st, 3rd, 5th... subarrays are positive; the 2nd, 4th, 6th... are negative.

**Transition logic:**

1. If `state = 0` (no open subarray):
   - Skip the current element: `dp[i][j][0] = dp[i-1][j][0]`
   - Start a new subarray: `dp[i][j][1 or 2] = dp[i-1][j][0] ± nums[i-1]` (sign depends on parity of `j`)

2. If `state = 1 or 2` (building a subarray):
   - Extend current subarray: `dp[i][j][state] = dp[i-1][j][state] ± nums[i-1]`
   - Close current subarray: `dp[i][j+1][0] = dp[i-1][j][state]` (only if `j < k`)

We initialize `dp[0][0][0] = 0` and all others to `-infinity` since we haven't selected any subarrays yet. The answer is `dp[n][k][0]` — we've considered all elements, selected exactly `k` subarrays, and no subarray is open.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n * k) | Space: O(n * k)
def maximumStrength(nums, k):
    n = len(nums)
    # dp[i][j][state]: max strength using first i elements, j complete subarrays
    # state: 0 = no open subarray, 1 = open positive, 2 = open negative
    # We use 2D arrays for current and previous rows to optimize space
    dp_prev = [[float('-inf')] * 3 for _ in range(k + 1)]
    dp_curr = [[float('-inf')] * 3 for _ in range(k + 1)]

    # Base case: 0 elements, 0 subarrays, no open subarray
    dp_prev[0][0] = 0

    for i in range(1, n + 1):
        num = nums[i - 1]
        # Initialize current row with -inf
        for j in range(k + 1):
            for s in range(3):
                dp_curr[j][s] = float('-inf')

        for j in range(k + 1):
            # State 0: No open subarray
            # Option 1: Skip current element
            dp_curr[j][0] = max(dp_curr[j][0], dp_prev[j][0])

            # Option 2: Start a new subarray (if we haven't reached k yet)
            if j < k:
                # Determine sign based on parity of j (0-based)
                # j completed subarrays means next will be (j+1)th
                # Odd-indexed subarrays (1st, 3rd, 5th...) are positive
                # Even-indexed subarrays (2nd, 4th, 6th...) are negative
                sign = 1 if (j % 2 == 0) else -1
                # Multiply by (k - j) for the strength formula
                strength = sign * (k - j)
                value_to_add = num * strength

                # Start positive subarray if (j+1) is odd
                if (j + 1) % 2 == 1:
                    dp_curr[j][1] = max(dp_curr[j][1], dp_prev[j][0] + value_to_add)
                else:
                    dp_curr[j][2] = max(dp_curr[j][2], dp_prev[j][0] + value_to_add)

            # State 1: Building positive subarray
            if dp_prev[j][1] != float('-inf'):
                # Option 1: Extend current positive subarray
                sign = 1 if (j % 2 == 0) else -1
                strength = sign * (k - j)
                dp_curr[j][1] = max(dp_curr[j][1], dp_prev[j][1] + num * strength)

                # Option 2: Close current positive subarray
                if j < k:
                    dp_curr[j + 1][0] = max(dp_curr[j + 1][0], dp_prev[j][1])

            # State 2: Building negative subarray
            if dp_prev[j][2] != float('-inf'):
                # Option 1: Extend current negative subarray
                sign = 1 if (j % 2 == 0) else -1
                strength = sign * (k - j)
                dp_curr[j][2] = max(dp_curr[j][2], dp_prev[j][2] + num * strength)

                # Option 2: Close current negative subarray
                if j < k:
                    dp_curr[j + 1][0] = max(dp_curr[j + 1][0], dp_prev[j][2])

        # Swap for next iteration
        dp_prev, dp_curr = dp_curr, dp_prev

    # Result: used all n elements, formed exactly k subarrays, no open subarray
    return dp_prev[k][0]
```

```javascript
// Time: O(n * k) | Space: O(k)
function maximumStrength(nums, k) {
  const n = nums.length;
  // dp_prev[j][state] and dp_curr[j][state]
  let dpPrev = Array.from({ length: k + 1 }, () => Array(3).fill(-Infinity));
  let dpCurr = Array.from({ length: k + 1 }, () => Array(3).fill(-Infinity));

  // Base case
  dpPrev[0][0] = 0;

  for (let i = 1; i <= n; i++) {
    const num = nums[i - 1];

    // Reset current DP table
    for (let j = 0; j <= k; j++) {
      dpCurr[j][0] = -Infinity;
      dpCurr[j][1] = -Infinity;
      dpCurr[j][2] = -Infinity;
    }

    for (let j = 0; j <= k; j++) {
      // State 0: No open subarray
      // Skip current element
      dpCurr[j][0] = Math.max(dpCurr[j][0], dpPrev[j][0]);

      // Start new subarray if we haven't reached k yet
      if (j < k) {
        // Determine sign and strength multiplier
        const sign = j % 2 === 0 ? 1 : -1;
        const strength = sign * (k - j);
        const valueToAdd = num * strength;

        // Start positive or negative based on parity of (j+1)
        if ((j + 1) % 2 === 1) {
          // Starting positive subarray
          dpCurr[j][1] = Math.max(dpCurr[j][1], dpPrev[j][0] + valueToAdd);
        } else {
          // Starting negative subarray
          dpCurr[j][2] = Math.max(dpCurr[j][2], dpPrev[j][0] + valueToAdd);
        }
      }

      // State 1: Building positive subarray
      if (dpPrev[j][1] !== -Infinity) {
        const sign = j % 2 === 0 ? 1 : -1;
        const strength = sign * (k - j);
        // Extend current positive subarray
        dpCurr[j][1] = Math.max(dpCurr[j][1], dpPrev[j][1] + num * strength);

        // Close current positive subarray
        if (j < k) {
          dpCurr[j + 1][0] = Math.max(dpCurr[j + 1][0], dpPrev[j][1]);
        }
      }

      // State 2: Building negative subarray
      if (dpPrev[j][2] !== -Infinity) {
        const sign = j % 2 === 0 ? 1 : -1;
        const strength = sign * (k - j);
        // Extend current negative subarray
        dpCurr[j][2] = Math.max(dpCurr[j][2], dpPrev[j][2] + num * strength);

        // Close current negative subarray
        if (j < k) {
          dpCurr[j + 1][0] = Math.max(dpCurr[j + 1][0], dpPrev[j][2]);
        }
      }
    }

    // Swap for next iteration
    [dpPrev, dpCurr] = [dpCurr, dpPrev];
  }

  // Final answer: all elements processed, exactly k subarrays, no open subarray
  return dpPrev[k][0];
}
```

```java
// Time: O(n * k) | Space: O(k)
class Solution {
    public long maximumStrength(int[] nums, int k) {
        int n = nums.length;
        // dp_prev[j][state] and dp_curr[j][state]
        long[][] dpPrev = new long[k + 1][3];
        long[][] dpCurr = new long[k + 1][3];

        // Initialize with -infinity
        for (int j = 0; j <= k; j++) {
            Arrays.fill(dpPrev[j], Long.MIN_VALUE);
            Arrays.fill(dpCurr[j], Long.MIN_VALUE);
        }

        // Base case
        dpPrev[0][0] = 0;

        for (int i = 1; i <= n; i++) {
            long num = nums[i - 1];

            // Reset current DP table
            for (int j = 0; j <= k; j++) {
                Arrays.fill(dpCurr[j], Long.MIN_VALUE);
            }

            for (int j = 0; j <= k; j++) {
                // State 0: No open subarray
                // Skip current element
                if (dpPrev[j][0] != Long.MIN_VALUE) {
                    dpCurr[j][0] = Math.max(dpCurr[j][0], dpPrev[j][0]);
                }

                // Start new subarray if we haven't reached k yet
                if (j < k && dpPrev[j][0] != Long.MIN_VALUE) {
                    // Determine sign and strength multiplier
                    int sign = (j % 2 == 0) ? 1 : -1;
                    long strength = sign * (long)(k - j);
                    long valueToAdd = num * strength;

                    // Start positive or negative based on parity of (j+1)
                    if ((j + 1) % 2 == 1) {
                        // Starting positive subarray
                        dpCurr[j][1] = Math.max(dpCurr[j][1], dpPrev[j][0] + valueToAdd);
                    } else {
                        // Starting negative subarray
                        dpCurr[j][2] = Math.max(dpCurr[j][2], dpPrev[j][0] + valueToAdd);
                    }
                }

                // State 1: Building positive subarray
                if (dpPrev[j][1] != Long.MIN_VALUE) {
                    int sign = (j % 2 == 0) ? 1 : -1;
                    long strength = sign * (long)(k - j);
                    // Extend current positive subarray
                    dpCurr[j][1] = Math.max(dpCurr[j][1], dpPrev[j][1] + num * strength);

                    // Close current positive subarray
                    if (j < k) {
                        dpCurr[j + 1][0] = Math.max(dpCurr[j + 1][0], dpPrev[j][1]);
                    }
                }

                // State 2: Building negative subarray
                if (dpPrev[j][2] != Long.MIN_VALUE) {
                    int sign = (j % 2 == 0) ? 1 : -1;
                    long strength = sign * (long)(k - j);
                    // Extend current negative subarray
                    dpCurr[j][2] = Math.max(dpCurr[j][2], dpPrev[j][2] + num * strength);

                    // Close current negative subarray
                    if (j < k) {
                        dpCurr[j + 1][0] = Math.max(dpCurr[j + 1][0], dpPrev[j][2]);
                    }
                }
            }

            // Swap for next iteration
            long[][] temp = dpPrev;
            dpPrev = dpCurr;
            dpCurr = temp;
        }

        // Final answer: all elements processed, exactly k subarrays, no open subarray
        return dpPrev[k][0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k)

- We have `n` iterations (for each element in the array)
- For each element, we iterate over `k+1` possible counts of completed subarrays
- For each `(i, j)` pair, we perform constant-time operations for the 3 states
- Total: O(n × k × 3) = O(n × k)

**Space Complexity:** O(k)

- We maintain two 2D arrays of size `(k+1) × 3`
- We only need the previous row to compute the current row, so we can space-optimize
- Even with the space optimization, we need O(k) space for each of the two rows

## Common Mistakes

1. **Forgetting the strength multiplier `(k - j)`**: Each subarray's contribution isn't just `±sum`, but `±sum × (k - j)` where `j` is the number of previously completed subarrays. This multiplier decreases as we select more subarrays.

2. **Incorrect sign handling**: The sign alternates based on the subarray index (1-based), not based on the number of completed subarrays. The `(j+1)`th subarray has sign `+` if `(j+1)` is odd, `-` if even.

3. **Not handling the "open subarray" state properly**: This is the trickiest part. Candidates often try a simpler DP with only `dp[i][j]` (position and count), but this doesn't account for whether we're currently extending a subarray or starting a new one. You need the third state dimension.

4. **Integer overflow**: The values can get large (up to 10^9 × 10^4 × 10^4 in worst case), so use 64-bit integers (long in Java/C++, long long in C).

## When You'll See This Pattern

This problem combines several classic DP patterns:

1. **Partition DP**: Similar to "Partition Array for Maximum Sum" (LeetCode 1043) or "Palindrome Partitioning II" (LeetCode 132), where you partition an array into segments to optimize some metric.

2. **Kadane's algorithm with constraints**: Like "Maximum Subarray" (LeetCode 53) but with the twist of needing exactly K disjoint segments with alternating signs.

3. **State machine DP**: The three-state approach (no open subarray, open positive, open negative) is similar to problems like "Best Time to Buy and Sell Stock with Cooldown" (LeetCode 309), where you track different states of engagement with the array.

Specifically, you'll see similar patterns in:

- **Maximum Sum of 3 Non-Overlapping Subarrays** (LeetCode 689): Also selects K disjoint subarrays, but sums them without alternating signs.
- **Partition Array into Disjoint Intervals** (LeetCode 915): Partitions array into two segments with specific properties.
- **Maximum Strength of a Group** (LeetCode 2708): Also involves selecting elements with alternating signs, though not necessarily contiguous subarrays.

## Key Takeaways

1. **When you need to select exactly K contiguous segments from an array**, think about DP with dimensions for position and count, plus an additional state for whether you're currently inside a segment.

2. **Alternating signs create a state machine**: You need to track not just how many segments you've completed, but also the parity of the current segment to determine its sign contribution.

3. **Space optimization is often possible**: Even with 3D DP states, you can usually reduce space by only keeping the previous row, especially when transitions only depend on the immediate previous state.

Related problems: [Partition Array into Disjoint Intervals](/problem/partition-array-into-disjoint-intervals), [Maximum Strength of a Group](/problem/maximum-strength-of-a-group)
