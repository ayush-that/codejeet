---
title: "How to Solve K Inverse Pairs Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode K Inverse Pairs Array. Hard difficulty, 49.0% acceptance rate. Topics: Dynamic Programming."
date: "2026-11-06"
category: "dsa-patterns"
tags: ["k-inverse-pairs-array", "dynamic-programming", "hard"]
---

# How to Solve K Inverse Pairs Array

This problem asks: given integers `n` and `k`, how many permutations of the numbers `[1, 2, ..., n]` contain exactly `k` inverse pairs? An inverse pair occurs when a larger number appears before a smaller number in the sequence. What makes this problem challenging is that we need to count permutations with a specific inversion count without generating all permutations, which would be impossibly slow for large `n`.

## Visual Walkthrough

Let's build intuition with a small example: `n = 3, k = 1`.

First, recall what inverse pairs are. For the permutation `[2, 3, 1]`:

- Compare 2 and 3: 2 < 3, not an inverse pair
- Compare 2 and 1: 2 > 1, this is an inverse pair (position 0, 2)
- Compare 3 and 1: 3 > 1, this is an inverse pair (position 1, 2)
  Total: 2 inverse pairs

Now let's find all permutations of `[1, 2, 3]` with exactly 1 inverse pair:

1. `[1, 3, 2]`:
   - 1 < 3, not inverse
   - 1 < 2, not inverse
   - 3 > 2, inverse pair ✓ (1 total)

2. `[2, 1, 3]`:
   - 2 > 1, inverse pair ✓ (1 total)
   - 2 < 3, not inverse
   - 1 < 3, not inverse

3. `[2, 3, 1]`: Has 2 inverse pairs ✗
4. `[3, 1, 2]`: Has 2 inverse pairs ✗
5. `[3, 2, 1]`: Has 3 inverse pairs ✗
6. `[1, 2, 3]`: Has 0 inverse pairs ✗

So for `n = 3, k = 1`, the answer is 2.

The key insight: when we insert the number `n` into a permutation of `[1, 2, ..., n-1]`, we can create between 0 and `n-1` new inverse pairs depending on where we insert it. If we insert it at position `i` (0-indexed from the right), it creates exactly `i` new inverse pairs because it's larger than all existing numbers.

## Brute Force Approach

A naive approach would generate all `n!` permutations and count the inverse pairs in each one. We could count inverse pairs using nested loops (O(n²) per permutation) or merge-sort style counting (O(n log n) per permutation).

```python
# Brute force - too slow for n > 10
def count_inverse_pairs(arr):
    count = 0
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):
            if arr[i] > arr[j]:
                count += 1
    return count

def kInversePairs_brute(n, k):
    from itertools import permutations
    count = 0
    for perm in permutations(range(1, n+1)):
        if count_inverse_pairs(perm) == k:
            count += 1
    return count
```

**Why this fails:** For `n = 20`, there are 20! ≈ 2.4×10¹⁸ permutations - an astronomically large number. Even for `n = 10` with 3.6 million permutations, this is too slow. We need a smarter approach that doesn't enumerate permutations.

## Optimized Approach

The optimal solution uses **dynamic programming** with a clever optimization.

**DP State Definition:**
Let `dp[n][k]` = number of permutations of `[1..n]` with exactly `k` inverse pairs.

**Base Cases:**

- `dp[0][0] = 1` (empty permutation has 0 inverse pairs)
- `dp[n][k] = 0` if `k < 0` (can't have negative inverse pairs)

**Recurrence Relation:**
Consider building permutations of size `n` from permutations of size `n-1`. When we insert the number `n` into a permutation of `[1..n-1]`:

- If we insert it at the end (rightmost position), it creates 0 new inverse pairs
- If we insert it one position from the end, it creates 1 new inverse pair
- ...
- If we insert it at the beginning, it creates `n-1` new inverse pairs

So if a permutation of size `n-1` has `j` inverse pairs, and we insert `n` at a position that creates `i` new inverse pairs, then the resulting permutation has `j + i` inverse pairs.

Therefore:

```
dp[n][k] = sum(dp[n-1][k-i] for i in range(0, min(n, k+1)))
```

Where `i` is the number of new inverse pairs created by inserting `n`.

**Optimization:**
The naive DP would be O(n²k) which is still too slow for the constraints (n, k up to 1000). We can optimize using a **prefix sum** technique. Notice that:

```
dp[n][k] = dp[n-1][k] + dp[n-1][k-1] + ... + dp[n-1][k-min(n-1, k)]
```

And similarly:

```
dp[n][k-1] = dp[n-1][k-1] + dp[n-1][k-2] + ... + dp[n-1][k-1-min(n-1, k-1)]
```

We can derive:

```
dp[n][k] = dp[n][k-1] + dp[n-1][k] - dp[n-1][k-n]  (when k >= n)
```

This gives us O(1) transition instead of O(n)!

## Optimal Solution

<div class="code-group">

```python
# Time: O(n*k) | Space: O(k)
def kInversePairs(n, k):
    MOD = 10**9 + 7

    # dp[k] represents number of permutations for current n with k inverse pairs
    dp = [0] * (k + 1)
    dp[0] = 1  # Base case: 1 permutation with 0 inverse pairs

    for i in range(1, n + 1):
        # New dp array for current i
        new_dp = [0] * (k + 1)
        prefix_sum = 0

        for j in range(k + 1):
            # Add dp[j] to running prefix sum
            prefix_sum = (prefix_sum + dp[j]) % MOD

            # Remove dp[j - i] from prefix sum if j >= i
            # This maintains sum of last i elements
            if j >= i:
                prefix_sum = (prefix_sum - dp[j - i]) % MOD

            # new_dp[j] = sum(dp[max(0, j-i+1)] to dp[j])
            new_dp[j] = prefix_sum

        dp = new_dp

    return dp[k] % MOD
```

```javascript
// Time: O(n*k) | Space: O(k)
function kInversePairs(n, k) {
  const MOD = 10 ** 9 + 7;

  // dp[k] represents number of permutations for current n with k inverse pairs
  let dp = new Array(k + 1).fill(0);
  dp[0] = 1; // Base case: 1 permutation with 0 inverse pairs

  for (let i = 1; i <= n; i++) {
    // New dp array for current i
    const newDp = new Array(k + 1).fill(0);
    let prefixSum = 0;

    for (let j = 0; j <= k; j++) {
      // Add dp[j] to running prefix sum
      prefixSum = (prefixSum + dp[j]) % MOD;

      // Remove dp[j - i] from prefix sum if j >= i
      // This maintains sum of last i elements
      if (j >= i) {
        prefixSum = (prefixSum - dp[j - i] + MOD) % MOD;
      }

      // newDp[j] = sum(dp[max(0, j-i+1)] to dp[j])
      newDp[j] = prefixSum;
    }

    dp = newDp;
  }

  return dp[k] % MOD;
}
```

```java
// Time: O(n*k) | Space: O(k)
class Solution {
    public int kInversePairs(int n, int k) {
        final int MOD = 1000000007;

        // dp[k] represents number of permutations for current n with k inverse pairs
        int[] dp = new int[k + 1];
        dp[0] = 1;  // Base case: 1 permutation with 0 inverse pairs

        for (int i = 1; i <= n; i++) {
            // New dp array for current i
            int[] newDp = new int[k + 1];
            long prefixSum = 0;

            for (int j = 0; j <= k; j++) {
                // Add dp[j] to running prefix sum
                prefixSum = (prefixSum + dp[j]) % MOD;

                // Remove dp[j - i] from prefix sum if j >= i
                // This maintains sum of last i elements
                if (j >= i) {
                    prefixSum = (prefixSum - dp[j - i] + MOD) % MOD;
                }

                // newDp[j] = sum(dp[max(0, j-i+1)] to dp[j])
                newDp[j] = (int)prefixSum;
            }

            dp = newDp;
        }

        return dp[k] % MOD;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k)

- We have an outer loop from 1 to n: O(n)
- Inner loop from 0 to k: O(k)
- Each iteration does O(1) work with the prefix sum optimization
- Total: O(n × k)

**Space Complexity:** O(k)

- We maintain two DP arrays of size k+1
- We could optimize to use a single array with careful updating, but O(k) is already efficient

## Common Mistakes

1. **Forgetting the modulo operation:** The result can be huge, so we need to take modulo 10^9+7 at each addition/subtraction. Forgetting this causes integer overflow.

2. **Incorrect prefix sum maintenance:** The trickiest part is maintaining the sliding window sum of size `i`. When `j >= i`, we need to subtract `dp[j-i]` from the prefix sum. Forgetting the `+ MOD` before `% MOD` when subtracting can give negative values.

3. **Using 2D array without optimization:** A naive 2D DP with O(n²k) complexity will timeout. The prefix sum optimization is crucial for passing all test cases within constraints.

4. **Wrong base case initialization:** `dp[0][0]` should be 1 (empty permutation), not 0. Also, `dp[n][k] = 0` for `k < 0`.

## When You'll See This Pattern

This problem combines two important patterns:

1. **DP with prefix sum optimization:** When your DP transition involves summing a range of previous states, consider using prefix sums to make it O(1). Similar problems:
   - [Coin Change II](https://leetcode.com/problems/coin-change-ii/) - Counting ways to make change
   - [Number of Dice Rolls With Target Sum](https://leetcode.com/problems/number-of-dice-rolls-with-target-sum/) - Counting dice roll combinations

2. **Counting permutations with constraints:** Problems that ask "how many permutations satisfy X property" often use DP where state represents partial permutations:
   - [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement/) - Counting permutations where position divides number or vice versa
   - [Count Sorted Vowel Strings](https://leetcode.com/problems/count-sorted-vowel-strings/) - Counting sorted strings (similar insertion logic)

## Key Takeaways

1. **Think about building permutations incrementally:** When counting permutations, consider how to build them from smaller permutations by inserting new elements. This often leads to a natural DP formulation.

2. **Optimize range sums with prefix sums:** If your DP transition sums a contiguous range of previous states, use a sliding window or prefix sum to reduce from O(n) to O(1) per transition.

3. **Modulo arithmetic requires care:** When doing subtraction with modulo, always add MOD before taking modulo to avoid negative values: `(a - b + MOD) % MOD`.

Related problems: [Count the Number of Inversions](/problem/count-the-number-of-inversions)
