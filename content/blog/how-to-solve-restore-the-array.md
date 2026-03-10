---
title: "How to Solve Restore The Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Restore The Array. Hard difficulty, 46.8% acceptance rate. Topics: String, Dynamic Programming."
date: "2028-02-17"
category: "dsa-patterns"
tags: ["restore-the-array", "string", "dynamic-programming", "hard"]
---

# How to Solve Restore The Array

You're given a string of digits `s` and an integer `k`. The string represents an array of integers that were printed without spaces, where each integer was between 1 and `k` inclusive, and no integer had leading zeros. Your task is to count how many possible arrays could have produced this string. This problem is tricky because you need to count all valid partitions of the string where each segment represents a valid integer in the range [1, k], and the count can be huge (modulo 10⁹+7).

## Visual Walkthrough

Let's trace through an example: `s = "1317"`, `k = 2000`

We need to count all ways to split this string into valid integers between 1 and 2000:

1. **First cut after position 0**: "1" (valid, 1 ≤ 1 ≤ 2000)
   - Remaining: "317"
   - "3" (valid) → "17" → "1" (valid) → "7" (valid) ✓
   - "3" (valid) → "17" (valid, 17 ≤ 2000) ✓
   - "31" (valid, 31 ≤ 2000) → "7" (valid) ✓
   - "317" (valid, 317 ≤ 2000) ✓
     That's 4 ways starting with "1"

2. **First cut after position 1**: "13" (valid, 13 ≤ 2000)
   - Remaining: "17"
   - "1" (valid) → "7" (valid) ✓
   - "17" (valid) ✓
     That's 2 ways starting with "13"

3. **First cut after position 2**: "131" (valid, 131 ≤ 2000)
   - Remaining: "7" (valid) ✓
     That's 1 way starting with "131"

4. **First cut after position 3**: "1317" (valid, 1317 ≤ 2000) ✓
   That's 1 way

Total: 4 + 2 + 1 + 1 = 8 possible arrays

Notice how we're counting overlapping subproblems: after taking "1", we need to count ways to split "317", which is the same problem we'd solve if "317" were our starting string. This overlapping substructure suggests dynamic programming.

## Brute Force Approach

A naive solution would try all possible partitions using recursion. At each position `i`, we could try taking substrings of length 1, 2, 3, ... up to the maximum length where the substring represents a valid integer ≤ k and has no leading zeros.

The brute force would look like this:

- Start at position 0
- For each possible end position `j` (from `i+1` to `n`):
  - If substring `s[i:j]` is valid (no leading zero, ≤ k), recursively count ways to split the rest `s[j:]`
- Sum all valid recursive results

This approach has exponential time complexity because for each position, we could branch into multiple recursive calls. For a string of length `n`, there are 2^(n-1) possible partitions to check (each of the n-1 gaps between digits can either have a cut or not). With `n` up to 10^5, this is completely infeasible.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with a **prefix sum optimization**.

**Step-by-step reasoning:**

1. **DP State Definition**: Let `dp[i]` = number of ways to split the substring `s[i:]` (from position i to the end).

2. **Base Case**: `dp[n] = 1` (empty string has 1 way to split: an empty array)

3. **Transition**: For position `i`, we can take substrings starting at `i` with various lengths. For each valid substring `s[i:j]` (where j > i), we add `dp[j]` to `dp[i]`:

   ```
   dp[i] = sum(dp[j] for all j where s[i:j] is valid)
   ```

4. **Validity Check**: A substring `s[i:j]` is valid if:
   - It has no leading zero: `s[i] != '0'`
   - Its integer value ≤ k
   - Its length ≤ maximum possible length (since k has at most `len(str(k))` digits)

5. **Optimization Challenge**: The naive DP would be O(n²) because for each i, we check up to n possible j values. With n up to 10^5, O(n²) is too slow (10^10 operations).

6. **Key Optimization**: Notice that for a given i, the valid j values form a contiguous range! Why?
   - Minimum j: `i+1` (at least 1 digit)
   - Maximum j: `min(n, i + max_len)` where `max_len` is the number of digits in k
   - Within this range, all substrings with length ≤ max_len are valid as long as their numeric value ≤ k
   - Since the substring gets longer as j increases, once we find a substring > k, all longer substrings will also be > k

7. **Prefix Sum Trick**: Instead of summing `dp[j]` values for each i (which would be O(n²)), we maintain a prefix sum array `prefix` where `prefix[i] = sum(dp[0] + dp[1] + ... + dp[i])`. Then:
   ```
   dp[i] = prefix[j_max] - prefix[j_min-1]
   ```
   This gives us O(1) range sum queries!

The final algorithm runs in O(n × max_len) time, where max_len ≤ 10 (since k ≤ 10^9 has at most 10 digits).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * log10(k)) | Space: O(n)
# Since k ≤ 10^9, log10(k) ≤ 10, so effectively O(n)
def numberOfArrays(s: str, k: int) -> int:
    MOD = 10**9 + 7
    n = len(s)

    # dp[i] = number of ways to split s[i:]
    dp = [0] * (n + 1)
    # Base case: empty string has 1 way
    dp[n] = 1

    # Prefix sum array for O(1) range sum queries
    prefix = [0] * (n + 1)
    prefix[n] = 1  # dp[n] = 1

    # Maximum length of a valid number (digits in k)
    max_len = len(str(k))

    # Process from right to left
    for i in range(n - 1, -1, -1):
        # Skip numbers with leading zero
        if s[i] == '0':
            # dp[i] remains 0, but we still need to update prefix[i]
            prefix[i] = prefix[i + 1]
            continue

        total_ways = 0
        # Try all possible end positions j (exclusive)
        # j ranges from i+1 to min(n, i+max_len)
        for j in range(i + 1, min(n, i + max_len) + 1):
            # Check if substring s[i:j] is valid (≤ k)
            # Compare as strings first for efficiency
            if j - i == max_len and s[i:j] > str(k):
                break  # All longer substrings will also be > k

            # Valid substring found, add dp[j] to total
            total_ways = (total_ways + dp[j]) % MOD

        dp[i] = total_ways
        # Update prefix sum: prefix[i] = dp[i] + prefix[i+1]
        prefix[i] = (dp[i] + prefix[i + 1]) % MOD

    return dp[0]
```

```javascript
// Time: O(n * log10(k)) | Space: O(n)
// Since k ≤ 10^9, log10(k) ≤ 10, so effectively O(n)
function numberOfArrays(s, k) {
  const MOD = 1_000_000_007;
  const n = s.length;

  // dp[i] = number of ways to split s[i:]
  const dp = new Array(n + 1).fill(0);
  // Base case: empty string has 1 way
  dp[n] = 1;

  // Prefix sum array for O(1) range sum queries
  const prefix = new Array(n + 1).fill(0);
  prefix[n] = 1; // dp[n] = 1

  // Maximum length of a valid number (digits in k)
  const maxLen = k.toString().length;
  const kStr = k.toString();

  // Process from right to left
  for (let i = n - 1; i >= 0; i--) {
    // Skip numbers with leading zero
    if (s[i] === "0") {
      // dp[i] remains 0, but we still need to update prefix[i]
      prefix[i] = prefix[i + 1];
      continue;
    }

    let totalWays = 0;
    // Try all possible end positions j (exclusive)
    // j ranges from i+1 to min(n, i+maxLen)
    for (let j = i + 1; j <= Math.min(n, i + maxLen); j++) {
      // Check if substring s[i:j] is valid (≤ k)
      const substr = s.substring(i, j);

      // Compare as strings first for efficiency
      if (substr.length === maxLen && substr > kStr) {
        break; // All longer substrings will also be > k
      }

      // Valid substring found, add dp[j] to total
      totalWays = (totalWays + dp[j]) % MOD;
    }

    dp[i] = totalWays;
    // Update prefix sum: prefix[i] = dp[i] + prefix[i+1]
    prefix[i] = (dp[i] + prefix[i + 1]) % MOD;
  }

  return dp[0];
}
```

```java
// Time: O(n * log10(k)) | Space: O(n)
// Since k ≤ 10^9, log10(k) ≤ 10, so effectively O(n)
class Solution {
    public int numberOfArrays(String s, int k) {
        final int MOD = 1_000_000_007;
        int n = s.length();

        // dp[i] = number of ways to split s[i:]
        int[] dp = new int[n + 1];
        // Base case: empty string has 1 way
        dp[n] = 1;

        // Prefix sum array for O(1) range sum queries
        int[] prefix = new int[n + 1];
        prefix[n] = 1;  // dp[n] = 1

        // Maximum length of a valid number (digits in k)
        int maxLen = String.valueOf(k).length();
        String kStr = String.valueOf(k);

        // Process from right to left
        for (int i = n - 1; i >= 0; i--) {
            // Skip numbers with leading zero
            if (s.charAt(i) == '0') {
                // dp[i] remains 0, but we still need to update prefix[i]
                prefix[i] = prefix[i + 1];
                continue;
            }

            long totalWays = 0;
            // Try all possible end positions j (exclusive)
            // j ranges from i+1 to min(n, i+maxLen)
            for (int j = i + 1; j <= Math.min(n, i + maxLen); j++) {
                // Check if substring s[i:j] is valid (≤ k)
                String substr = s.substring(i, j);

                // Compare as strings first for efficiency
                if (substr.length() == maxLen && substr.compareTo(kStr) > 0) {
                    break;  // All longer substrings will also be > k
                }

                // Valid substring found, add dp[j] to total
                totalWays = (totalWays + dp[j]) % MOD;
            }

            dp[i] = (int) totalWays;
            // Update prefix sum: prefix[i] = dp[i] + prefix[i+1]
            prefix[i] = (dp[i] + prefix[i + 1]) % MOD;
        }

        return dp[0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × log₁₀(k))**

- We iterate through the string once (O(n))
- For each position, we check at most `log₁₀(k)` possible substring lengths (since k ≤ 10^9, this is at most 10)
- The string comparison for checking if substring > k is O(log₁₀(k)) but constant-bounded
- Total: O(n × 10) = O(n) for practical purposes

**Space Complexity: O(n)**

- We store two arrays of size n+1: `dp` and `prefix`
- No recursion stack since we use iterative DP
- Additional O(log₁₀(k)) space for the string representation of k

## Common Mistakes

1. **Not handling leading zeros correctly**: A substring starting with '0' is invalid regardless of its numeric value. Some candidates check `int(substr) > 0` instead of explicitly checking `s[i] != '0'`, which misses that "0" itself is invalid (integers must be ≥ 1).

2. **Integer overflow when converting substrings**: With n up to 10^5, converting long substrings to integers can overflow 64-bit integers. The solution: compare as strings first when the substring length equals max_len, or use careful numeric comparison.

3. **Forgetting the modulo operation**: The result can be huge, so we need to apply modulo 10^9+7 after each addition. A common mistake is to apply modulo only at the end, which can cause integer overflow during intermediate calculations.

4. **Incorrect DP direction**: Processing from left to right seems natural but leads to more complex state transitions. Processing from right to left is cleaner because `dp[i]` depends on `dp[j]` where j > i.

## When You'll See This Pattern

This problem combines **dynamic programming** with **prefix sum optimization** for range queries, which appears in many counting problems:

1. **Number of Ways to Separate Numbers (LeetCode 1977)**: Similar concept of counting valid splits of a numeric string with constraints on the numbers.

2. **Number of Beautiful Partitions (LeetCode 2478)**: Another string partitioning problem with additional constraints, using DP with optimization.

3. **Decode Ways (LeetCode 91)**: A simpler version where each chunk must be 1-2 digits representing 1-26.

4. **Word Break (LeetCode 139)**: Similar DP structure but with dictionary lookup instead of numeric range check.

The pattern to recognize: when you need to count ways to partition a sequence where each partition must satisfy certain constraints, and the count depends on how you partition the remainder.

## Key Takeaways

1. **DP for counting partitions**: When asked to count ways to split/partition a sequence, dynamic programming is often the right approach. Define `dp[i]` as the number of ways to handle the suffix starting at position i.

2. **Prefix sums for range queries**: When your DP transition sums over a range of previous DP values (`dp[i] = sum(dp[j] for j in range)`), use prefix sums to optimize from O(n) to O(1) per state.

3. **Early termination for bounded searches**: When checking possible partition lengths, you can stop early once a substring exceeds k, since longer substrings will also exceed k (when there are no leading zeros).

Related problems: [Number of Ways to Separate Numbers](/problem/number-of-ways-to-separate-numbers), [Number of Beautiful Partitions](/problem/number-of-beautiful-partitions)
