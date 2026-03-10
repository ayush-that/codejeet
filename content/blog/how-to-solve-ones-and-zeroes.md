---
title: "How to Solve Ones and Zeroes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Ones and Zeroes. Medium difficulty, 53.1% acceptance rate. Topics: Array, String, Dynamic Programming."
date: "2027-10-17"
category: "dsa-patterns"
tags: ["ones-and-zeroes", "array", "string", "dynamic-programming", "medium"]
---

# How to Solve Ones and Zeroes

You're given an array of binary strings and two integers `m` and `n`. Your task is to find the largest subset of strings where the total count of `0`s is at most `m` and total count of `1`s is at most `n`. This problem is tricky because it's essentially a **two-dimensional knapsack problem** — each string has both a "zero weight" and a "one weight," and we need to maximize the number of items (strings) we can select without exceeding capacity in either dimension.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `strs = ["10", "0001", "111001", "1", "0"]`, `m = 5`, `n = 3`

First, let's count the zeros and ones in each string:

- `"10"`: 1 zero, 1 one
- `"0001"`: 3 zeros, 1 one
- `"111001"`: 2 zeros, 4 ones
- `"1"`: 0 zeros, 1 one
- `"0"`: 1 zero, 0 ones

We need to choose a subset of these strings where:

- Total zeros ≤ 5
- Total ones ≤ 3

Let's think through some combinations:

- If we take `["10", "0001", "1", "0"]`: zeros = 1+3+0+1 = 5, ones = 1+1+1+0 = 3 ✓ (size 4)
- If we try to add `"111001"`: zeros would be 5+2=7 > 5 ✗
- What about `["10", "111001", "1"]`: zeros = 1+2+0=3, ones = 1+4+1=6 > 3 ✗

The optimal subset here is indeed `["10", "0001", "1", "0"]` with size 4. But how do we systematically find this? We need to consider all combinations while respecting both constraints simultaneously.

## Brute Force Approach

The brute force solution would generate all possible subsets (2^k where k is the number of strings) and check each one:

1. For each subset, count total zeros and ones
2. If both counts are within limits, track the maximum subset size

This approach has exponential time complexity O(2^k × L) where L is the total length of all strings (for counting zeros/ones). For k=50 strings, that's 2^50 ≈ 1 quadrillion operations — completely infeasible.

Even if we try to be clever with backtracking or recursion with pruning, we're still looking at exponential time in the worst case. We need a more efficient approach.

## Optimized Approach

The key insight is recognizing this as a **dynamic programming problem** similar to the classic 0/1 knapsack, but with two constraints instead of one.

Think of it this way:

- Each string is an "item" with two "weights" (zero count and one count)
- We want to maximize the "value" (which is always 1 per string — we just want to maximize count)
- We have two capacity constraints: `m` for zeros and `n` for ones

We can use a 3D DP approach: `dp[i][j][k]` = maximum number of strings we can form using the first `i` strings with at most `j` zeros and `k` ones.

But we can optimize space by using a 2D DP array and processing strings one by one, similar to the space-optimized knapsack solution:

- `dp[j][k]` = maximum number of strings we can form with at most `j` zeros and `k` ones
- For each string, we iterate backwards through the DP array to avoid reusing the same string multiple times

The recurrence relation is:

```
For each string with z zeros and o ones:
    For j from m down to z:
        For k from n down to o:
            dp[j][k] = max(dp[j][k], dp[j-z][k-o] + 1)
```

This works because:

1. Going backwards ensures we don't use the same string more than once (like in 0/1 knapsack)
2. We're considering whether to include the current string or not
3. If we include it, we need to have enough capacity for its zeros and ones

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(L + k*m*n) where L is total length of all strings, k is number of strings
# Space: O(m*n)
def findMaxForm(strs, m, n):
    """
    Finds the largest subset of strs with at most m zeros and n ones.

    Args:
        strs: List of binary strings
        m: Maximum allowed zeros
        n: Maximum allowed ones

    Returns:
        Size of the largest valid subset
    """
    # Initialize DP table: dp[j][k] = max strings with j zeros and k ones
    # We use (m+1) x (n+1) because we need indices from 0 to m and 0 to n
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Process each string one by one
    for s in strs:
        # Count zeros and ones in current string
        zeros = s.count('0')
        ones = len(s) - zeros

        # Iterate backwards to avoid reusing the same string multiple times
        # This is the key to making it a 0/1 knapsack style solution
        for j in range(m, zeros - 1, -1):
            for k in range(n, ones - 1, -1):
                # Two choices:
                # 1. Don't take current string: dp[j][k] (already computed)
                # 2. Take current string: dp[j-zeros][k-ones] + 1
                # We take the maximum of these two options
                dp[j][k] = max(dp[j][k], dp[j - zeros][k - ones] + 1)

    # The answer is in dp[m][n] - maximum strings with at most m zeros and n ones
    return dp[m][n]
```

```javascript
// Time: O(L + k*m*n) where L is total length of all strings, k is number of strings
// Space: O(m*n)
function findMaxForm(strs, m, n) {
  /**
   * Finds the largest subset of strs with at most m zeros and n ones.
   *
   * @param {string[]} strs - Array of binary strings
   * @param {number} m - Maximum allowed zeros
   * @param {number} n - Maximum allowed ones
   * @return {number} Size of the largest valid subset
   */

  // Initialize DP table: dp[j][k] = max strings with j zeros and k ones
  // We use (m+1) x (n+1) because we need indices from 0 to m and 0 to n
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Process each string one by one
  for (const s of strs) {
    // Count zeros and ones in current string
    let zeros = 0,
      ones = 0;
    for (const char of s) {
      if (char === "0") zeros++;
      else ones++;
    }

    // Iterate backwards to avoid reusing the same string multiple times
    // This is the key to making it a 0/1 knapsack style solution
    for (let j = m; j >= zeros; j--) {
      for (let k = n; k >= ones; k--) {
        // Two choices:
        // 1. Don't take current string: dp[j][k] (already computed)
        // 2. Take current string: dp[j-zeros][k-ones] + 1
        // We take the maximum of these two options
        dp[j][k] = Math.max(dp[j][k], dp[j - zeros][k - ones] + 1);
      }
    }
  }

  // The answer is in dp[m][n] - maximum strings with at most m zeros and n ones
  return dp[m][n];
}
```

```java
// Time: O(L + k*m*n) where L is total length of all strings, k is number of strings
// Space: O(m*n)
class Solution {
    public int findMaxForm(String[] strs, int m, int n) {
        /**
         * Finds the largest subset of strs with at most m zeros and n ones.
         *
         * @param strs Array of binary strings
         * @param m Maximum allowed zeros
         * @param n Maximum allowed ones
         * @return Size of the largest valid subset
         */

        // Initialize DP table: dp[j][k] = max strings with j zeros and k ones
        // We use (m+1) x (n+1) because we need indices from 0 to m and 0 to n
        int[][] dp = new int[m + 1][n + 1];

        // Process each string one by one
        for (String s : strs) {
            // Count zeros and ones in current string
            int zeros = 0, ones = 0;
            for (char c : s.toCharArray()) {
                if (c == '0') zeros++;
                else ones++;
            }

            // Iterate backwards to avoid reusing the same string multiple times
            // This is the key to making it a 0/1 knapsack style solution
            for (int j = m; j >= zeros; j--) {
                for (int k = n; k >= ones; k--) {
                    // Two choices:
                    // 1. Don't take current string: dp[j][k] (already computed)
                    // 2. Take current string: dp[j-zeros][k-ones] + 1
                    // We take the maximum of these two options
                    dp[j][k] = Math.max(dp[j][k], dp[j - zeros][k - ones] + 1);
                }
            }
        }

        // The answer is in dp[m][n] - maximum strings with at most m zeros and n ones
        return dp[m][n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(L + k × m × n)

- `L`: Total length of all strings (for counting zeros and ones)
- `k`: Number of strings
- `m`: Maximum allowed zeros
- `n`: Maximum allowed ones

We spend O(L) time to count zeros and ones across all strings. Then for each of the k strings, we iterate through the m × n DP table (backwards), giving us O(k × m × n).

**Space Complexity:** O(m × n)
We only need the 2D DP array of size (m+1) × (n+1). The space for counting zeros/ones per string is O(1) per string (we reuse variables).

## Common Mistakes

1. **Iterating forwards instead of backwards:** This is the most common mistake. If you iterate forwards (from 0 to m and 0 to n), you might use the same string multiple times because dp[j][k] could be updated using dp[j-zeros][k-ones] that already includes the current string. Always iterate backwards in knapsack-style problems when each item can be used at most once.

2. **Forgetting to handle empty strings:** An empty string has 0 zeros and 0 ones. Some candidates might skip counting or handle it incorrectly. The solution handles this correctly because zeros=0, ones=0, and the loops will still run (j >= 0, k >= 0).

3. **Incorrect DP dimensions:** Using m × n instead of (m+1) × (n+1). We need indices from 0 to m inclusive and 0 to n inclusive, so we need one extra row and column.

4. **Not counting zeros/ones efficiently:** Some candidates might convert strings to integers and count bits, which is more complex and error-prone than simply counting characters. The character counting approach is simpler and works for any string length.

## When You'll See This Pattern

This **multi-dimensional knapsack** pattern appears in problems where you have:

1. A set of items to choose from
2. Multiple constraints to satisfy
3. An objective to maximize (usually count or value)

Related LeetCode problems:

1. **Partition Equal Subset Sum (416)** - Single constraint (sum), similar 0/1 knapsack
2. **Target Sum (494)** - Can be reduced to a subset sum problem with constraints
3. **Coin Change II (518)** - Unbounded knapsack (can use items multiple times)
4. **Last Stone Weight II (1049)** - Another variation of partition/subset problems

The key difference with classic knapsack is having two constraints instead of one, which requires a 2D DP table instead of 1D.

## Key Takeaways

1. **Recognize multi-constraint knapsack:** When you see problems about selecting items with multiple resource constraints (weight, volume, time, etc.), think multi-dimensional DP.

2. **Backwards iteration for 0/1 knapsack:** Always iterate backwards through the DP array when each item can be used at most once. Forwards iteration works for unbounded knapsack (items can be reused).

3. **DP state definition matters:** `dp[j][k]` represents the maximum value achievable with exactly j and k resources OR at most j and k resources. In this problem, it's "at most," which is why we can return `dp[m][n]` directly.

**Related problems:** [Count Subarrays With More Ones Than Zeros](/problem/count-subarrays-with-more-ones-than-zeros), [Non-negative Integers without Consecutive Ones](/problem/non-negative-integers-without-consecutive-ones), [All Divisions With the Highest Score of a Binary Array](/problem/all-divisions-with-the-highest-score-of-a-binary-array)
