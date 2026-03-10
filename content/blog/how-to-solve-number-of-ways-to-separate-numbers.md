---
title: "How to Solve Number of Ways to Separate Numbers — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Ways to Separate Numbers. Hard difficulty, 21.6% acceptance rate. Topics: String, Dynamic Programming, Suffix Array."
date: "2026-06-28"
category: "dsa-patterns"
tags:
  ["number-of-ways-to-separate-numbers", "string", "dynamic-programming", "suffix-array", "hard"]
---

# How to Solve Number of Ways to Separate Numbers

You're given a string `num` containing digits without separators, representing a sequence of positive integers that was originally non-decreasing and had no leading zeros. Your task is to count how many ways you can insert commas to split the string into such a valid sequence. This problem is tricky because you need to consider both the numeric values (to ensure non-decreasing order) and string constraints (no leading zeros), while efficiently comparing potentially very long numbers.

## Visual Walkthrough

Let's trace through `num = "1234"` step by step:

We need to insert commas between digits to create valid numbers. Each number must:

1. Be positive (no empty strings)
2. Have no leading zeros (unless it's exactly "0", but here all numbers are positive)
3. Form a non-decreasing sequence

For `"1234"`, possible valid splits:

- `[1234]` (no commas)
- `[1, 234]` (comma after position 1)
- `[1, 2, 34]` (commas after positions 1 and 2)
- `[1, 2, 3, 4]` (commas after positions 1, 2, 3)
- `[1, 23, 4]` (commas after positions 1 and 3)
- `[12, 34]` (comma after position 2)
- `[12, 3, 4]` (commas after positions 2 and 3)
- `[123, 4]` (comma after position 3)

That's 8 valid ways. Notice we can't have `[123, 4]`? Wait, check: `123 ≤ 4`? No, `123 > 4`, so that's invalid! Let's verify each:

1. `[1234]` - single number, valid
2. `[1, 234]` - `1 ≤ 234`, valid
3. `[1, 2, 34]` - `1 ≤ 2 ≤ 34`, valid
4. `[1, 2, 3, 4]` - `1 ≤ 2 ≤ 3 ≤ 4`, valid
5. `[1, 23, 4]` - `1 ≤ 23`, but `23 > 4`, invalid!
6. `[12, 34]` - `12 ≤ 34`, valid
7. `[12, 3, 4]` - `12 > 3`, invalid!
8. `[123, 4]` - `123 > 4`, invalid!

So only 4 valid ways. The challenge is efficiently checking these numeric comparisons without converting to integers (which could overflow for long strings).

## Brute Force Approach

A naive solution would try all possible comma placements and check each resulting sequence. For a string of length `n`, there are `n-1` potential comma positions, giving `2^(n-1)` possible splits. For each split, we'd need to:

1. Check no number has leading zeros (unless it's "0")
2. Convert substrings to integers and verify non-decreasing order

This is `O(2^n * n)` time - impossibly slow for `n` up to 3500 as in the problem constraints. Even for `n=20`, that's over a million operations.

The brute force fails because it doesn't reuse comparisons. When we check `"1234"`, we compare `"12"` with `"3"` in one split and `"12"` with `"34"` in another, doing the same work multiple times.

## Optimized Approach

The key insight is dynamic programming. Let `dp[i]` = number of valid ways to split the suffix starting at index `i`. We compute from right to left.

For position `i`, we consider all possible ending positions `j` (where `i < j ≤ n`) for the first number. The substring `num[i:j]` must:

1. Have no leading zeros (unless length 1)
2. When combined with a valid split of `num[j:]`, form a valid sequence

The tricky part: to ensure non-decreasing order, we need to compare `num[i:j]` with the next number. But we don't know what the next number will be yet!

Here's the breakthrough: when we're at position `i` considering a first number ending at `j-1`, the next number starts at `j`. For the sequence to be valid, we need `num[i:j] ≤ num[j:k]` where `k` is the end of the second number. But we can precompute something better.

We can precompute `lcp[i][j]` = length of longest common prefix starting at positions `i` and `j`. This helps compare substrings without converting to integers:

- If `num[i:j]` and `num[j:k]` have different lengths, the shorter one is smaller
- If they have the same length, compare digit by digit until they differ

With `lcp`, we can compare `num[i:j]` and `num[j:k]` in O(1) time by:

1. If `j-i < k-j`, then `num[i:j]` is shorter, so it's smaller
2. If `j-i > k-j`, then `num[i:j]` is longer, so it's larger
3. If equal length, use `lcp[i][j]` to see if they're equal up to length `j-i`

Wait, we need to compare `num[i:j]` with the NEXT number, which starts at `j` but has variable length. Actually, for `dp[i]`, when we choose first number as `num[i:j]`, we need all valid splits starting at `j` where the first number of that split (call it `num[j:k]`) satisfies `num[i:j] ≤ num[j:k]`.

So we need a second DP dimension: `dp[i][l]` where `l` is the length of the previous number? Or better: `dp[i]` = sum over all valid next splits. We can compute this efficiently with prefix sums and the comparison optimization.

The optimal approach uses:

1. `dp[i]` = number of valid ways for suffix starting at `i`
2. `lcp[i][j]` for O(1) substring comparisons
3. Prefix sums to accumulate valid transitions

## Optimal Solution

The solution uses dynamic programming with suffix comparisons. We compute from right to left, maintaining how many valid sequences exist for each starting position.

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2)
class Solution:
    def numberOfCombinations(self, num: str) -> int:
        MOD = 10**9 + 7
        n = len(num)

        # Handle leading zeros: if first digit is '0', no valid splits
        if num[0] == '0':
            return 0

        # lcp[i][j] = length of longest common prefix starting at i and j
        lcp = [[0] * (n + 1) for _ in range(n + 1)]
        for i in range(n - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                if num[i] == num[j]:
                    lcp[i][j] = lcp[i + 1][j + 1] + 1

        # dp[i][l] = number of valid splits starting at i with previous length l
        # But we optimize space using rolling arrays
        dp = [[0] * (n + 1) for _ in range(n + 1)]
        prefix = [[0] * (n + 1) for _ in range(n + 1)]

        # Base case: empty suffix has 1 way (no numbers)
        for l in range(1, n + 1):
            dp[n][l] = 1
            prefix[n][l] = 1

        # Process from right to left
        for i in range(n - 1, -1, -1):
            # Can't start a number with '0' unless it's the entire number
            if num[i] == '0':
                continue

            for l in range(1, n - i + 1):
                # First number is num[i:i+l]
                j = i + l

                # Case 1: Only one number (rest of string)
                if j == n:
                    dp[i][l] = 1
                else:
                    # We need next number starting at j with length >= l
                    # But next number can't have leading zero
                    if num[j] == '0':
                        # Next number would start with 0, invalid
                        # So we can only have next number longer than l
                        k = j + l + 1
                    else:
                        # Check if num[i:i+l] <= num[j:j+l]
                        common = lcp[i][j]
                        if common >= l or num[i + common] <= num[j + common]:
                            # Next number can be exactly length l
                            k = j + l
                        else:
                            # Need next number to be longer
                            k = j + l + 1

                    if k <= n:
                        dp[i][l] = prefix[j][k - j]

                # Update prefix sums: prefix[i][l] = sum(dp[i][l:])
                prefix[i][l] = (prefix[i][l - 1] + dp[i][l]) % MOD

        # Result is sum of all splits starting at 0 with any first number length
        return prefix[0][n] % MOD
```

```javascript
// Time: O(n^2) | Space: O(n^2)
var numberOfCombinations = function (num) {
  const MOD = 1e9 + 7;
  const n = num.length;

  // Handle leading zeros
  if (num[0] === "0") return 0;

  // lcp[i][j] = length of longest common prefix starting at i and j
  const lcp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (num[i] === num[j]) {
        lcp[i][j] = lcp[i + 1][j + 1] + 1;
      }
    }
  }

  // dp[i][l] = number of valid splits starting at i with previous length l
  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  const prefix = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

  // Base case
  for (let l = 1; l <= n; l++) {
    dp[n][l] = 1;
    prefix[n][l] = 1;
  }

  // Process from right to left
  for (let i = n - 1; i >= 0; i--) {
    // Skip if current digit is '0' (can't start a number with 0)
    if (num[i] === "0") continue;

    for (let l = 1; l <= n - i; l++) {
      const j = i + l;

      // Case 1: Only one number (rest of string)
      if (j === n) {
        dp[i][l] = 1;
      } else {
        // Determine minimum length for next number
        let k;
        if (num[j] === "0") {
          // Next number would start with 0, so must be longer
          k = j + l + 1;
        } else {
          // Compare current number with potential next number of same length
          const common = lcp[i][j];
          if (common >= l || num[i + common] <= num[j + common]) {
            // Current <= next with same length
            k = j + l;
          } else {
            // Need longer next number
            k = j + l + 1;
          }
        }

        if (k <= n) {
          dp[i][l] = prefix[j][k - j];
        }
      }

      // Update prefix sums
      prefix[i][l] = (prefix[i][l - 1] + dp[i][l]) % MOD;
    }
  }

  return prefix[0][n] % MOD;
};
```

```java
// Time: O(n^2) | Space: O(n^2)
class Solution {
    public int numberOfCombinations(String num) {
        final int MOD = 1_000_000_007;
        int n = num.length();

        // Handle leading zeros
        if (num.charAt(0) == '0') return 0;

        // lcp[i][j] = length of longest common prefix starting at i and j
        int[][] lcp = new int[n + 1][n + 1];
        for (int i = n - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                if (num.charAt(i) == num.charAt(j)) {
                    lcp[i][j] = lcp[i + 1][j + 1] + 1;
                }
            }
        }

        // dp[i][l] = number of valid splits starting at i with previous length l
        int[][] dp = new int[n + 1][n + 1];
        int[][] prefix = new int[n + 1][n + 1];

        // Base case: empty suffix
        for (int l = 1; l <= n; l++) {
            dp[n][l] = 1;
            prefix[n][l] = 1;
        }

        // Process from right to left
        for (int i = n - 1; i >= 0; i--) {
            // Can't start a number with '0'
            if (num.charAt(i) == '0') continue;

            for (int l = 1; l <= n - i; l++) {
                int j = i + l;

                // Case 1: Only one number (rest of string)
                if (j == n) {
                    dp[i][l] = 1;
                } else {
                    // Determine minimum length for next number
                    int k;
                    if (num.charAt(j) == '0') {
                        // Next number would start with 0, must be longer
                        k = j + l + 1;
                    } else {
                        // Compare current number with potential next number of same length
                        int common = lcp[i][j];
                        if (common >= l || num.charAt(i + common) <= num.charAt(j + common)) {
                            // Current <= next with same length
                            k = j + l;
                        } else {
                            // Need longer next number
                            k = j + l + 1;
                        }
                    }

                    if (k <= n) {
                        dp[i][l] = prefix[j][k - j];
                    }
                }

                // Update prefix sums
                prefix[i][l] = (int)(((long)prefix[i][l - 1] + dp[i][l]) % MOD);
            }
        }

        return prefix[0][n] % MOD;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- Building the LCP table takes O(n²) time with nested loops
- The DP computation also takes O(n²) as we iterate over all (i, l) pairs
- Each DP transition uses O(1) time thanks to the LCP table and prefix sums

**Space Complexity:** O(n²)

- The LCP table is (n+1)×(n+1) = O(n²)
- The DP and prefix arrays are also O(n²)
- This could be optimized to O(n) with careful implementation, but O(n²) is acceptable for n ≤ 3500

## Common Mistakes

1. **Not handling leading zeros correctly**: A number like "01" is invalid unless it's exactly "0". Candidates often miss that a number starting with '0' is only valid if it's the single digit "0", but here all numbers are positive, so any leading zero makes the entire split invalid.

2. **Integer overflow when comparing numbers**: Converting substrings to integers for comparison causes overflow for long strings (up to 3500 digits). The LCP table trick is essential for O(1) comparisons without conversion.

3. **Off-by-one errors in indices**: With 0-based vs 1-based indexing and substring ranges [i:j] vs [i:j+1], it's easy to make mistakes. The solution uses inclusive-exclusive ranges consistently: `num[i:j]` means characters from i to j-1.

4. **Forgetting the modulo operation**: The result can be huge, so we need modulo 10^9+7 at each addition. Candidates sometimes apply modulo only at the end, risking overflow during intermediate calculations.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Dynamic Programming with String Constraints**: Like "Decode Ways" where you count ways to split a string under certain rules, but with the added complexity of numeric comparisons between segments.

2. **Longest Common Prefix for String Comparison**: Used in problems like "Longest Happy Prefix" or string matching algorithms. The LCP table lets you compare substrings in O(1) time.

3. **Non-decreasing Sequence Constraints**: Similar to "Restore The Array" where you need to maintain order constraints between consecutive elements.

Related problems: [Decode Ways](/problem/decode-ways) (simpler splitting rules), [Decode Ways II](/problem/decode-ways-ii) (with wildcards), [Restore The Array](/problem/restore-the-array) (similar numeric constraints).

## Key Takeaways

1. **When comparing numeric substrings without conversion**, use a longest common prefix table for O(1) comparisons. This is crucial when numbers can be very long.

2. **For counting ways to split a string with constraints**, dynamic programming from right to left often works well. Each state represents "ways to split the suffix starting here."

3. **Prefix sums can optimize DP transitions** when you need sums over ranges of states. Instead of iterating to sum valid next states, maintain prefix sums for O(1) lookups.

Related problems: [Decode Ways](/problem/decode-ways), [Decode Ways II](/problem/decode-ways-ii), [Restore The Array](/problem/restore-the-array)
