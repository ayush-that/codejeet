---
title: "How to Solve Find the Number of Subsequences With Equal GCD — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Number of Subsequences With Equal GCD. Hard difficulty, 31.5% acceptance rate. Topics: Array, Math, Dynamic Programming, Number Theory."
date: "2026-07-09"
category: "dsa-patterns"
tags:
  ["find-the-number-of-subsequences-with-equal-gcd", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Find the Number of Subsequences With Equal GCD

This problem asks us to count pairs of **disjoint non-empty subsequences** from an array where both subsequences have the same greatest common divisor (GCD). What makes this problem challenging is that we're dealing with subsequences (not subarrays), which means elements don't need to be contiguous, and we need to count pairs of disjoint subsequences where both have identical GCD values. The combinatorial nature combined with GCD calculations creates a complex counting problem that requires careful dynamic programming.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 4, 6]`

We need to count pairs of disjoint subsequences with equal GCD. Let's enumerate all possibilities:

**Step 1: List all non-empty subsequences**

- Single elements: [2], [4], [6]
- Two elements: [2,4], [2,6], [4,6]
- Three elements: [2,4,6]

**Step 2: Calculate GCD for each subsequence**

- [2] → GCD = 2
- [4] → GCD = 4
- [6] → GCD = 6
- [2,4] → GCD(2,4) = 2
- [2,6] → GCD(2,6) = 2
- [4,6] → GCD(4,6) = 2
- [2,4,6] → GCD(2,4,6) = 2

**Step 3: Find disjoint pairs with equal GCD**
We need pairs (seq1, seq2) where:

1. Both are non-empty subsequences
2. They share no indices
3. They have equal GCD

Let's find some valid pairs:

- ([2], [4]) → GCDs: 2 ≠ 4 ❌
- ([2], [6]) → GCDs: 2 ≠ 6 ❌
- ([2], [2,4]) → Not disjoint (both use index 0) ❌
- ([2], [4,6]) → GCDs: 2 = 2 ✅ and disjoint ✅
- ([4], [2,6]) → GCDs: 4 ≠ 2 ❌
- ([6], [2,4]) → GCDs: 6 ≠ 2 ❌
- ([2,4], [6]) → GCDs: 2 ≠ 6 ❌
- ([2,6], [4]) → GCDs: 2 ≠ 4 ❌
- ([4,6], [2]) → GCDs: 2 = 2 ✅ and disjoint ✅

We also need to consider that order matters: ([2], [4,6]) and ([4,6], [2]) are different pairs.

**Step 4: Count all valid pairs**
Continuing this process systematically, we would find all valid pairs. The key insight is that we need an efficient way to count these without explicitly enumerating all subsequence pairs.

## Brute Force Approach

The brute force approach would be:

1. Generate all possible non-empty subsequences (2^n - 1 possibilities)
2. For each pair of subsequences, check if they're disjoint
3. If disjoint, calculate GCD of each subsequence
4. Count pairs where GCDs are equal

This approach has several problems:

- Generating all subsequences: O(2^n)
- Checking all pairs: O((2^n)²) = O(4^n)
- For n=20, this is over 1 trillion operations
- Even for moderate n, this is completely infeasible

The brute force code would look something like:

```python
def brute_force(nums):
    n = len(nums)
    count = 0

    # Generate all subsequences
    all_subs = []
    for mask in range(1, 1 << n):
        sub = []
        for i in range(n):
            if mask & (1 << i):
                sub.append(nums[i])
        all_subs.append((mask, sub))

    # Check all pairs
    for i in range(len(all_subs)):
        mask1, sub1 = all_subs[i]
        gcd1 = calculate_gcd(sub1)

        for j in range(len(all_subs)):
            if i == j:
                continue

            mask2, sub2 = all_subs[j]

            # Check if disjoint
            if mask1 & mask2 == 0:
                gcd2 = calculate_gcd(sub2)
                if gcd1 == gcd2:
                    count += 1

    return count
```

This is clearly too slow for any reasonable input size.

## Optimized Approach

The key insight is to use **dynamic programming with GCD states**. Instead of tracking individual subsequences, we track what GCD values we can achieve and how many ways to achieve them.

**Core Insight**: For each element, we can either:

1. Include it in the first subsequence
2. Include it in the second subsequence
3. Exclude it from both

We need to track the GCD of both subsequences simultaneously.

**DP State Definition**:
Let `dp[i][g1][g2]` = number of ways to process first `i` elements such that:

- First subsequence has GCD = `g1`
- Second subsequence has GCD = `g2`

**Transition**:
For element `nums[i]`:

1. Add to first subsequence: `new_g1 = gcd(g1, nums[i])`
2. Add to second subsequence: `new_g2 = gcd(g2, nums[i])`
3. Skip: state remains `(g1, g2)`

**Optimization**: The maximum possible GCD is the maximum element in `nums`. We can compress the state space by only considering GCD values that actually appear or are divisors of elements.

**Final Answer**: Sum over all `g` where `g > 0` of `dp[n][g][g]`

## Optimal Solution

The optimal solution uses dynamic programming with GCD states, but we need to be careful about memory usage. Since `n` can be up to 50 and maximum element value up to 100, a 3D array of size `50 × 101 × 101` is manageable (about 500k states).

<div class="code-group">

```python
# Time: O(n * M^2) where M is max(nums) | Space: O(n * M^2)
def subsequencePairGCD(nums):
    MOD = 10**9 + 7
    n = len(nums)

    # Find maximum value to determine DP array size
    max_val = max(nums)

    # dp[i][g1][g2] = ways after processing first i elements
    # with first subsequence GCD = g1, second subsequence GCD = g2
    dp = [[[0] * (max_val + 1) for _ in range(max_val + 1)] for _ in range(n + 1)]

    # Base case: before processing any elements, both subsequences are "empty"
    # We use GCD=0 to represent empty subsequence (gcd(0, x) = x)
    dp[0][0][0] = 1

    for i in range(n):
        x = nums[i]
        for g1 in range(max_val + 1):
            for g2 in range(max_val + 1):
                if dp[i][g1][g2] == 0:
                    continue

                val = dp[i][g1][g2]

                # Option 1: Skip current element
                dp[i + 1][g1][g2] = (dp[i + 1][g1][g2] + val) % MOD

                # Option 2: Add to first subsequence
                new_g1 = g1
                if g1 == 0:
                    new_g1 = x  # gcd(0, x) = x
                else:
                    # Compute gcd using Euclidean algorithm
                    a, b = g1, x
                    while b:
                        a, b = b, a % b
                    new_g1 = a
                dp[i + 1][new_g1][g2] = (dp[i + 1][new_g1][g2] + val) % MOD

                # Option 3: Add to second subsequence
                new_g2 = g2
                if g2 == 0:
                    new_g2 = x
                else:
                    a, b = g2, x
                    while b:
                        a, b = b, a % b
                    new_g2 = a
                dp[i + 1][g1][new_g2] = (dp[i + 1][g1][new_g2] + val) % MOD

    # Sum all cases where both subsequences have same GCD and are non-empty
    result = 0
    for g in range(1, max_val + 1):  # g > 0 means both subsequences are non-empty
        result = (result + dp[n][g][g]) % MOD

    return result
```

```javascript
// Time: O(n * M^2) where M is max(nums) | Space: O(n * M^2)
function subsequencePairGCD(nums) {
  const MOD = 10 ** 9 + 7;
  const n = nums.length;

  // Find maximum value to determine DP array size
  const maxVal = Math.max(...nums);

  // dp[i][g1][g2] = ways after processing first i elements
  // with first subsequence GCD = g1, second subsequence GCD = g2
  const dp = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    dp[i] = new Array(maxVal + 1);
    for (let g1 = 0; g1 <= maxVal; g1++) {
      dp[i][g1] = new Array(maxVal + 1).fill(0);
    }
  }

  // Base case: before processing any elements
  dp[0][0][0] = 1;

  // Helper function to compute GCD
  function gcd(a, b) {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  for (let i = 0; i < n; i++) {
    const x = nums[i];
    for (let g1 = 0; g1 <= maxVal; g1++) {
      for (let g2 = 0; g2 <= maxVal; g2++) {
        if (dp[i][g1][g2] === 0) continue;

        const val = dp[i][g1][g2];

        // Option 1: Skip current element
        dp[i + 1][g1][g2] = (dp[i + 1][g1][g2] + val) % MOD;

        // Option 2: Add to first subsequence
        const newG1 = g1 === 0 ? x : gcd(g1, x);
        dp[i + 1][newG1][g2] = (dp[i + 1][newG1][g2] + val) % MOD;

        // Option 3: Add to second subsequence
        const newG2 = g2 === 0 ? x : gcd(g2, x);
        dp[i + 1][g1][newG2] = (dp[i + 1][g1][newG2] + val) % MOD;
      }
    }
  }

  // Sum all cases where both subsequences have same GCD and are non-empty
  let result = 0;
  for (let g = 1; g <= maxVal; g++) {
    result = (result + dp[n][g][g]) % MOD;
  }

  return result;
}
```

```java
// Time: O(n * M^2) where M is max(nums) | Space: O(n * M^2)
class Solution {
    public int subsequencePairGCD(int[] nums) {
        final int MOD = 1000000007;
        int n = nums.length;

        // Find maximum value to determine DP array size
        int maxVal = 0;
        for (int num : nums) {
            maxVal = Math.max(maxVal, num);
        }

        // dp[i][g1][g2] = ways after processing first i elements
        // with first subsequence GCD = g1, second subsequence GCD = g2
        int[][][] dp = new int[n + 1][maxVal + 1][maxVal + 1];

        // Base case: before processing any elements
        dp[0][0][0] = 1;

        for (int i = 0; i < n; i++) {
            int x = nums[i];
            for (int g1 = 0; g1 <= maxVal; g1++) {
                for (int g2 = 0; g2 <= maxVal; g2++) {
                    if (dp[i][g1][g2] == 0) continue;

                    int val = dp[i][g1][g2];

                    // Option 1: Skip current element
                    dp[i + 1][g1][g2] = (dp[i + 1][g1][g2] + val) % MOD;

                    // Option 2: Add to first subsequence
                    int newG1 = (g1 == 0) ? x : gcd(g1, x);
                    dp[i + 1][newG1][g2] = (dp[i + 1][newG1][g2] + val) % MOD;

                    // Option 3: Add to second subsequence
                    int newG2 = (g2 == 0) ? x : gcd(g2, x);
                    dp[i + 1][g1][newG2] = (dp[i + 1][g1][newG2] + val) % MOD;
                }
            }
        }

        // Sum all cases where both subsequences have same GCD and are non-empty
        int result = 0;
        for (int g = 1; g <= maxVal; g++) {
            result = (result + dp[n][g][g]) % MOD;
        }

        return result;
    }

    // Helper method to compute GCD using Euclidean algorithm
    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × M²) where:

- `n` is the length of `nums` (up to 50)
- `M` is the maximum value in `nums` (up to 100)

We iterate through all `n` elements, and for each element, we iterate through all possible GCD pairs (M × M). For each state, we perform constant-time operations.

**Space Complexity**: O(n × M²) for the DP table. We can optimize this to O(M²) by using only two layers (current and previous) since we only need `dp[i]` and `dp[i+1]` at any time.

**Why this works**: The DP approach efficiently counts all possible ways to partition elements into two subsequences while tracking their GCDs. By using GCD as the state instead of tracking actual elements, we avoid the exponential explosion of the brute force approach.

## Common Mistakes

1. **Forgetting that subsequences must be non-empty**: The final sum should only include cases where `g > 0`, which ensures both subsequences have at least one element. Empty subsequences have GCD = 0 by our convention.

2. **Incorrect GCD calculation for empty subsequences**: We use GCD = 0 to represent an empty subsequence because `gcd(0, x) = x`. This is mathematically correct and simplifies the transition logic.

3. **Not using modulo operations correctly**: The count can be very large, so we need to apply modulo `10^9 + 7` after each addition. Forgetting this can lead to integer overflow.

4. **Inefficient GCD computation**: Computing GCD inside nested loops can be expensive. While our solution computes it inline, in practice you might want to precompute GCDs or use a more efficient GCD function.

5. **Memory overflow with large M**: If M were larger (say 10^5), the M² factor would be problematic. In such cases, we'd need to compress the state space by only tracking achievable GCD values.

## When You'll See This Pattern

This problem combines several important patterns:

1. **GCD-based DP**: Problems where you need to track GCD as part of the state appear in:
   - "Number of Different Subsequences GCDs" (LeetCode 1819)
   - "Split Array With Same Average" (similar partitioning concept)

2. **Partition DP**: Counting ways to partition elements into groups with certain properties:
   - "Partition Equal Subset Sum" (LeetCode 416)
   - "Target Sum" (LeetCode 494)

3. **Subsequence counting with constraints**:
   - "Number of Subsequences That Satisfy the Given Sum Condition" (LeetCode 1498)
   - "Count Number of Special Subsequences" (LeetCode 1955)

The key pattern is using dynamic programming with states that capture the essential information (GCD values) rather than tracking the actual elements, which reduces exponential complexity to polynomial.

## Key Takeaways

1. **When dealing with subsequences and combinatorial counts, consider DP with compressed states**: Instead of tracking which elements are chosen, track aggregate properties (like GCD, sum, product) that matter for the problem.

2. **GCD has useful mathematical properties for DP**: `gcd(a, b, c) = gcd(gcd(a, b), c)` allows incremental computation, making it suitable for DP transitions.

3. **For disjoint subsequence problems, think in terms of three choices per element**: Each element can go to the first subsequence, second subsequence, or be excluded. This leads to a natural DP formulation.

4. **Always check boundary conditions carefully**: Empty subsequences need special handling (GCD = 0 convention), and final counts should exclude invalid cases.

Related problems: [Find Greatest Common Divisor of Array](/problem/find-greatest-common-divisor-of-array)
