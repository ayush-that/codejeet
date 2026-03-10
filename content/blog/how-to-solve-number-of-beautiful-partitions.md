---
title: "How to Solve Number of Beautiful Partitions — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Beautiful Partitions. Hard difficulty, 32.8% acceptance rate. Topics: String, Dynamic Programming, Prefix Sum."
date: "2026-03-19"
category: "dsa-patterns"
tags: ["number-of-beautiful-partitions", "string", "dynamic-programming", "prefix-sum", "hard"]
---

# How to Solve Number of Beautiful Partitions

This problem asks us to count the number of ways to partition a numeric string into exactly `k` substrings where each substring has length at least `minLength` and starts with a prime digit (2,3,5,7) while ending with a non-prime digit (1,4,6,8,9). The challenge lies in efficiently counting these partitions while respecting all constraints — a classic dynamic programming problem made tricky by the multiple constraints that interact with each other.

## Visual Walkthrough

Let's trace through a small example: `s = "235421"`, `k = 2`, `minLength = 2`

**Step 1: Identify valid starting positions**

- A substring must start with a prime digit (2,3,5,7)
- Positions with prime digits: index 0 (2), index 2 (5)
- Index 1 (3) is prime but can't start a substring because it's not at the beginning of the original string or after a valid partition point

**Step 2: Identify valid ending positions**

- A substring must end with a non-prime digit (1,4,6,8,9)
- Positions with non-prime digits: index 3 (4), index 4 (2 is prime!), index 5 (1)
- Wait — index 4 has digit '2' which is prime, so it can't end a substring
- Valid ending positions: index 3, index 5

**Step 3: Find valid partitions**
We need exactly 2 substrings, each at least length 2:

Option 1: [0-3], [4-5]

- First substring: "2354" (length 4, starts with 2, ends with 4) ✓
- Second substring: "21" (length 2, starts with 2, ends with 1) ✓
- Valid partition!

Option 2: [0-5] as one substring? No, we need exactly 2 substrings.

Option 3: [0-1], [2-5]

- First substring: "23" (length 2, starts with 2, ends with 3) ✗ ends with prime digit

Option 4: [0-2], [3-5]

- First substring: "235" (length 3, starts with 2, ends with 5) ✗ ends with prime digit

Only 1 beautiful partition exists for this example.

## Brute Force Approach

A naive approach would try all possible partition points. For a string of length `n`, we need to choose `k-1` cut points from `n-1` possible positions between characters. This gives us C(n-1, k-1) possibilities to check. For each combination:

1. Check if each substring has length ≥ minLength
2. Check if each substring starts with prime and ends with non-prime
3. Count valid partitions

The complexity would be O(C(n-1, k-1) × n) which is exponential and impractical for n up to 1000.

Even a recursive approach that tries to build partitions step by step would have exponential time complexity because at each position we could either cut or not cut, leading to O(2^n) possibilities.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with two dimensions:

1. How many substrings we've formed so far (from 0 to k)
2. How far we've processed in the string (from 0 to n)

Let's define `dp[i][j]` = number of ways to partition the first `i` characters into `j` beautiful substrings.

**Transition logic:**
If we're at position `i` and want to form the `j`-th substring ending at `i`, we need to find all valid starting positions `start` for this substring such that:

1. `start ≤ i - minLength + 1` (length constraint)
2. `s[start]` is prime (starts with prime)
3. `s[i]` is non-prime (ends with non-prime)
4. The previous character `s[start-1]` (if it exists) must be non-prime OR `start = 0`

Wait — condition 4 is subtle but crucial! If we're starting a new substring at position `start`, then either:

- `start = 0` (we're at the beginning of the string), OR
- `s[start-1]` is non-prime (the previous substring ended properly with non-prime)

This ensures consecutive substrings are properly separated.

**Optimization with prefix sums:**
The naive DP would check all possible `start` positions for each `(i, j)`, giving O(n² × k) time. We can optimize to O(n × k) using prefix sums:

- Maintain `prefix[j]` = sum of `dp[start][j-1]` for all valid starting positions `start` up to current position
- When we move `i` forward, we add new valid starting positions to the prefix sum
- This lets us compute `dp[i][j]` in O(1) time

## Optimal Solution

<div class="code-group">

```python
# Time: O(n × k) | Space: O(n × k)
class Solution:
    def beautifulPartitions(self, s: str, k: int, minLength: int) -> int:
        MOD = 10**9 + 7
        n = len(s)

        # Helper to check if a digit is prime
        def is_prime(digit: str) -> bool:
            return digit in "2357"

        # Precompute valid start positions
        # A position i is a valid start if:
        # 1. s[i] is prime
        # 2. Either i == 0 or s[i-1] is non-prime
        valid_start = [False] * n
        for i in range(n):
            if is_prime(s[i]):
                if i == 0 or not is_prime(s[i-1]):
                    valid_start[i] = True

        # DP table: dp[i][j] = ways to partition first i chars into j beautiful substrings
        # We use i+1 indexing for dp to handle i=0 case
        dp = [[0] * (k + 1) for _ in range(n + 1)]
        dp[0][0] = 1  # Base case: empty string, 0 substrings

        # For each number of substrings j
        for j in range(1, k + 1):
            prefix_sum = 0  # Tracks sum of dp[start][j-1] for valid starts

            # For each ending position i (1-indexed in dp)
            for i in range(1, n + 1):
                # Add dp[start][j-1] to prefix_sum if position start is a valid start
                # where start = i - minLength (0-indexed in string)
                start_idx = i - minLength
                if start_idx >= 0:
                    # Check if this is a valid starting position for a substring
                    if valid_start[start_idx]:
                        prefix_sum = (prefix_sum + dp[start_idx][j-1]) % MOD

                # We can end a substring at i-1 (0-indexed) if s[i-1] is non-prime
                if not is_prime(s[i-1]):
                    dp[i][j] = prefix_sum

        return dp[n][k] % MOD
```

```javascript
// Time: O(n × k) | Space: O(n × k)
/**
 * @param {string} s
 * @param {number} k
 * @param {number} minLength
 * @return {number}
 */
var beautifulPartitions = function (s, k, minLength) {
  const MOD = 10 ** 9 + 7;
  const n = s.length;

  // Helper to check if a digit is prime
  const isPrime = (digit) => "2357".includes(digit);

  // Precompute valid start positions
  // A position i is a valid start if:
  // 1. s[i] is prime
  // 2. Either i == 0 or s[i-1] is non-prime
  const validStart = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    if (isPrime(s[i])) {
      if (i === 0 || !isPrime(s[i - 1])) {
        validStart[i] = true;
      }
    }
  }

  // DP table: dp[i][j] = ways to partition first i chars into j beautiful substrings
  // We use i+1 indexing for dp to handle i=0 case
  const dp = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    dp[i] = new Array(k + 1).fill(0);
  }
  dp[0][0] = 1; // Base case: empty string, 0 substrings

  // For each number of substrings j
  for (let j = 1; j <= k; j++) {
    let prefixSum = 0; // Tracks sum of dp[start][j-1] for valid starts

    // For each ending position i (1-indexed in dp)
    for (let i = 1; i <= n; i++) {
      // Add dp[start][j-1] to prefixSum if position start is a valid start
      // where start = i - minLength (0-indexed in string)
      const startIdx = i - minLength;
      if (startIdx >= 0) {
        // Check if this is a valid starting position for a substring
        if (validStart[startIdx]) {
          prefixSum = (prefixSum + dp[startIdx][j - 1]) % MOD;
        }
      }

      // We can end a substring at i-1 (0-indexed) if s[i-1] is non-prime
      if (!isPrime(s[i - 1])) {
        dp[i][j] = prefixSum;
      }
    }
  }

  return dp[n][k] % MOD;
};
```

```java
// Time: O(n × k) | Space: O(n × k)
class Solution {
    public int beautifulPartitions(String s, int k, int minLength) {
        final int MOD = 1000000007;
        int n = s.length();

        // Helper to check if a digit is prime
        boolean isPrime(char digit) {
            return digit == '2' || digit == '3' || digit == '5' || digit == '7';
        }

        // Precompute valid start positions
        // A position i is a valid start if:
        // 1. s.charAt(i) is prime
        // 2. Either i == 0 or s.charAt(i-1) is non-prime
        boolean[] validStart = new boolean[n];
        for (int i = 0; i < n; i++) {
            if (isPrime(s.charAt(i))) {
                if (i == 0 || !isPrime(s.charAt(i-1))) {
                    validStart[i] = true;
                }
            }
        }

        // DP table: dp[i][j] = ways to partition first i chars into j beautiful substrings
        // We use i+1 indexing for dp to handle i=0 case
        int[][] dp = new int[n + 1][k + 1];
        dp[0][0] = 1;  // Base case: empty string, 0 substrings

        // For each number of substrings j
        for (int j = 1; j <= k; j++) {
            int prefixSum = 0;  // Tracks sum of dp[start][j-1] for valid starts

            // For each ending position i (1-indexed in dp)
            for (int i = 1; i <= n; i++) {
                // Add dp[start][j-1] to prefixSum if position start is a valid start
                // where start = i - minLength (0-indexed in string)
                int startIdx = i - minLength;
                if (startIdx >= 0) {
                    // Check if this is a valid starting position for a substring
                    if (validStart[startIdx]) {
                        prefixSum = (prefixSum + dp[startIdx][j-1]) % MOD;
                    }
                }

                // We can end a substring at i-1 (0-indexed) if s.charAt(i-1) is non-prime
                if (!isPrime(s.charAt(i - 1))) {
                    dp[i][j] = prefixSum;
                }
            }
        }

        return dp[n][k] % MOD;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k)

- We have two nested loops: outer loop runs k times, inner loop runs n times
- Each iteration does O(1) work (updating prefix sum and checking conditions)
- The precomputation of `validStart` array takes O(n) time, which is dominated by O(n × k)

**Space Complexity:** O(n × k)

- The DP table has dimensions (n+1) × (k+1)
- The `validStart` array uses O(n) space
- In practice, we could optimize to O(n) space by only keeping the previous row of the DP table, but the code is clearer with the full table

## Common Mistakes

1. **Forgetting the "starts after non-prime" rule**: Many candidates correctly check that a substring must start with prime and end with non-prime, but forget that if we're not at the beginning of the string, the previous character must be non-prime. This ensures proper separation between substrings.

2. **Off-by-one errors with indices**: The problem uses 0-indexed string positions but DP often uses 1-indexed positions for the "first i characters" concept. Mixing these up leads to incorrect results. Always be explicit about which indexing system you're using.

3. **Not handling the minLength constraint properly**: When checking if we can end a substring at position `i`, we need to ensure it started at least `minLength` characters ago. The condition `startIdx = i - minLength` must be carefully implemented.

4. **Missing modulo operations**: The result can be huge, so we need to apply modulo after each addition. Forgetting this can cause integer overflow in languages like Java, or timeouts in Python/JavaScript.

## When You'll See This Pattern

This problem combines several classic DP patterns:

1. **Partition DP**: Similar to "Palindrome Partitioning" problems where we count ways to partition a string subject to constraints. The key is defining `dp[i][j]` as ways to partition first `i` characters into `j` groups.

2. **Prefix Sum Optimization**: When the DP transition sums over a range of previous states, we can use prefix sums to make it O(1) instead of O(n). This appears in:
   - **Restore The Array** (LeetCode 1416): Count ways to split string into numbers ≤ k
   - **Number of Ways to Separate Numbers** (LeetCode 1977): Similar partitioning with numeric constraints

3. **String DP with character constraints**: Problems where the validity of a substring depends on its first/last character, like "Decode Ways" where validity depends on whether characters form valid numbers.

## Key Takeaways

1. **Partition problems often use 2D DP**: When you need to partition into exactly k groups, think `dp[i][j]` = ways to partition first i elements into j groups. The transition usually considers where the last group starts.

2. **Prefix sums optimize range sums in DP**: If your transition sums `dp[start][j-1]` over a range of start positions, maintain a running prefix sum to make it O(1) instead of O(n).

3. **Precompute validity checks**: When checking complex conditions (like "starts with prime after non-prime"), precompute a boolean array to make the DP loop cleaner and faster.

Related problems: [Restore The Array](/problem/restore-the-array), [Number of Ways to Separate Numbers](/problem/number-of-ways-to-separate-numbers)
