---
title: "How to Solve Count K-Reducible Numbers Less Than N — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count K-Reducible Numbers Less Than N. Hard difficulty, 27.6% acceptance rate. Topics: Math, String, Dynamic Programming, Combinatorics."
date: "2026-09-06"
category: "dsa-patterns"
tags: ["count-k-reducible-numbers-less-than-n", "math", "string", "dynamic-programming", "hard"]
---

# How to Solve Count K-Reducible Numbers Less Than N

This problem asks us to count how many numbers less than a given binary number `n` are "k-reducible" — meaning we can reduce them to 1 by repeatedly replacing the number with its popcount (number of set bits) at most `k` times. The challenge lies in efficiently counting numbers with specific popcount reduction properties without checking every number individually, which would be infeasible for large `n`.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `s = "1010"` (binary for 10) and `k = 2`.

First, understand what "k-reducible" means:

- Start with number `x`
- Operation: `x = popcount(x)` (count of 1 bits in binary representation)
- If we can reach 1 within `k` operations, `x` is k-reducible

Let's check some numbers less than 10:

- `1` (binary "1"): popcount(1) = 1 → already 1, took 0 operations → k-reducible
- `2` (binary "10"): popcount(2) = 1 → took 1 operation → k-reducible
- `3` (binary "11"): popcount(3) = 2 → popcount(2) = 1 → took 2 operations → k-reducible
- `4` (binary "100"): popcount(4) = 1 → took 1 operation → k-reducible
- `5` (binary "101"): popcount(5) = 2 → popcount(2) = 1 → took 2 operations → k-reducible
- `6` (binary "110"): popcount(6) = 2 → popcount(2) = 1 → took 2 operations → k-reducible
- `7` (binary "111"): popcount(7) = 3 → popcount(3) = 2 → popcount(2) = 1 → took 3 operations → NOT k-reducible (k=2)
- `8` (binary "1000"): popcount(8) = 1 → took 1 operation → k-reducible
- `9` (binary "1001"): popcount(9) = 2 → popcount(2) = 1 → took 2 operations → k-reducible

So numbers less than 10 that are 2-reducible: 1,2,3,4,5,6,8,9 → 8 numbers.

The key insight: The popcount operation dramatically reduces numbers. For any number ≤ 10^5 (common constraint), its popcount is ≤ 20 (since 2^20 > 10^6). This means after the first operation, we're dealing with small numbers we can precompute.

## Brute Force Approach

A naive approach would:

1. Convert binary string `s` to integer `n`
2. For each number `x` from 1 to `n-1`:
   - Repeatedly apply popcount until reaching 1 or exceeding `k` operations
   - Count if reached 1 within `k` operations

This approach has several problems:

- Converting large binary strings to integers can overflow (strings can be up to 1000 bits)
- Checking up to `n` numbers is impossible when `n` can be 2^1000
- Even if we could handle the size, the time complexity would be astronomical

The brute force fails because it doesn't leverage the mathematical structure of the problem. We need a smarter combinatorial approach.

## Optimized Approach

The key insight is that we can use **digit dynamic programming (digit DP)** to count numbers with specific properties without enumerating them all. Here's the step-by-step reasoning:

1. **Observation 1**: After the first popcount operation, any number reduces to a value between 1 and `len(s)` (since popcount ≤ number of bits). For `n ≤ 2^1000`, this is at most 1000.

2. **Observation 2**: We can precompute for all small numbers `m` (1 to 1000) how many operations are needed to reduce to 1. Let `steps[m]` = minimum operations to reduce `m` to 1.

3. **Observation 3**: A number `x` is k-reducible if `steps[popcount(x)] ≤ k-1` (since first operation gives us popcount(x), then we need ≤ k-1 more operations).

4. **Core problem**: Count numbers < `n` whose popcount has `steps[popcount] ≤ k-1`.

5. **Digit DP approach**: We can count numbers with a specific popcount using combinatorial formulas or DP. For each possible target popcount `p` where `steps[p] ≤ k-1`, we count numbers < `n` with exactly `p` set bits.

6. **Counting numbers with exactly p set bits**: Use digit DP that processes bits from most significant to least significant, keeping track of:
   - Current position in the binary string
   - How many bits we've set so far
   - Whether we're still matching the prefix of `n` (tight bound)

7. **Special cases**: Handle `k=0` separately (only number 1 qualifies). Also handle the case when `k` is large enough that all numbers qualify.

## Optimal Solution

The solution uses digit DP to count numbers with specific popcounts, combined with precomputation of reduction steps for small numbers.

<div class="code-group">

```python
# Time: O(L^2 * K) where L = len(s), K = max steps
# Space: O(L^2) for DP memoization
class Solution:
    def countKReducibleNumbers(self, s: str, k: int) -> int:
        MOD = 10**9 + 7
        L = len(s)

        # Special case: if k == 0, only number 1 is reducible
        if k == 0:
            # Check if n > 1 (since we need numbers less than n)
            # Only 1 qualifies if n > 1
            return 1 if int(s, 2) > 1 else 0

        # Precompute steps to reduce numbers 1..L to 1
        # L is enough because popcount(x) ≤ len(binary(x)) ≤ L for x < n
        max_val = L
        steps = [0] * (max_val + 1)

        for i in range(2, max_val + 1):
            # popcount(i) can be computed as bin(i).count('1')
            pop = bin(i).count('1')
            steps[i] = steps[pop] + 1

        # For each possible popcount p, check if steps[p] ≤ k-1
        # (first operation gives popcount, then need ≤ k-1 more steps)
        valid_popcounts = []
        for p in range(1, max_val + 1):
            if steps[p] <= k - 1:
                valid_popcounts.append(p)

        # If no valid popcounts, no numbers qualify
        if not valid_popcounts:
            return 0

        # Digit DP to count numbers < n with exactly p set bits
        def count_with_popcount(target_bits):
            # memo[pos][bits_set][is_tight]
            @lru_cache(None)
            def dp(pos, bits_used, tight):
                # Base case: processed all bits
                if pos == L:
                    return 1 if bits_used == target_bits else 0

                # What's the current bit in n at position pos?
                max_bit = int(s[pos]) if tight else 1
                total = 0

                # Try setting current bit to 0
                total += dp(pos + 1, bits_used, tight and (0 == max_bit))

                # Try setting current bit to 1 (if allowed by target and n)
                if bits_used < target_bits and 1 <= max_bit:
                    total += dp(pos + 1, bits_used + 1, tight and (1 == max_bit))

                return total % MOD

            # Start DP: position 0, 0 bits used, tight bound initially True
            return dp(0, 0, True)

        # Sum counts for all valid popcounts
        total = 0
        for p in valid_popcounts:
            total = (total + count_with_popcount(p)) % MOD

        # We counted numbers with popcount p, but need to exclude n itself
        # and include 0? Actually problem says numbers less than n, so 0..n-1
        # But 0 has popcount 0, which is not in valid_popcounts (starts from 1)
        # So we're good.

        # Special case: if n itself has valid popcount, we included it
        # Need to subtract it since we want numbers < n
        n_popcount = s.count('1')
        if steps[n_popcount] <= k - 1:
            total = (total - 1) % MOD

        return total
```

```javascript
// Time: O(L^2 * K) where L = s.length, K = max steps
// Space: O(L^2) for DP memoization
function countKReducibleNumbers(s, k) {
  const MOD = 1e9 + 7;
  const L = s.length;

  // Special case: if k == 0, only number 1 is reducible
  if (k === 0) {
    // Check if n > 1 (since we need numbers less than n)
    const n = parseInt(s, 2);
    return n > 1 ? 1 : 0;
  }

  // Precompute steps to reduce numbers 1..L to 1
  const maxVal = L;
  const steps = new Array(maxVal + 1).fill(0);

  // Helper to compute popcount
  function popcount(x) {
    let count = 0;
    while (x > 0) {
      count += x & 1;
      x >>= 1;
    }
    return count;
  }

  for (let i = 2; i <= maxVal; i++) {
    steps[i] = steps[popcount(i)] + 1;
  }

  // Collect valid popcounts where steps[p] ≤ k-1
  const validPopcounts = [];
  for (let p = 1; p <= maxVal; p++) {
    if (steps[p] <= k - 1) {
      validPopcounts.push(p);
    }
  }

  if (validPopcounts.length === 0) {
    return 0;
  }

  // Digit DP to count numbers < n with exactly targetBits set bits
  function countWithPopcount(targetBits) {
    // memo[pos][bitsUsed][tight]
    const memo = new Array(L + 1);
    for (let i = 0; i <= L; i++) {
      memo[i] = new Array(targetBits + 1);
      for (let j = 0; j <= targetBits; j++) {
        memo[i][j] = new Array(2);
        memo[i][j][0] = memo[i][j][1] = -1;
      }
    }

    function dp(pos, bitsUsed, tight) {
      // Base case
      if (pos === L) {
        return bitsUsed === targetBits ? 1 : 0;
      }

      if (memo[pos][bitsUsed][tight ? 1 : 0] !== -1) {
        return memo[pos][bitsUsed][tight ? 1 : 0];
      }

      const maxBit = tight ? parseInt(s[pos]) : 1;
      let total = 0;

      // Try bit 0
      total = (total + dp(pos + 1, bitsUsed, tight && 0 === maxBit)) % MOD;

      // Try bit 1 if allowed
      if (bitsUsed < targetBits && 1 <= maxBit) {
        total = (total + dp(pos + 1, bitsUsed + 1, tight && 1 === maxBit)) % MOD;
      }

      memo[pos][bitsUsed][tight ? 1 : 0] = total;
      return total;
    }

    return dp(0, 0, true);
  }

  // Sum counts for all valid popcounts
  let total = 0;
  for (const p of validPopcounts) {
    total = (total + countWithPopcount(p)) % MOD;
  }

  // Subtract n itself if it was counted
  const nPopcount = s.split("").filter((c) => c === "1").length;
  if (steps[nPopcount] <= k - 1) {
    total = (total - 1 + MOD) % MOD;
  }

  return total;
}
```

```java
// Time: O(L^2 * K) where L = s.length(), K = max steps
// Space: O(L^2) for DP memoization
class Solution {
    private static final int MOD = 1_000_000_007;

    public int countKReducibleNumbers(String s, int k) {
        int L = s.length();

        // Special case: k == 0
        if (k == 0) {
            // Only number 1 is reducible, check if n > 1
            long n = Long.parseLong(s, 2);
            return n > 1 ? 1 : 0;
        }

        // Precompute steps for numbers 1..L
        int maxVal = L;
        int[] steps = new int[maxVal + 1];

        for (int i = 2; i <= maxVal; i++) {
            steps[i] = steps[Integer.bitCount(i)] + 1;
        }

        // Collect valid popcounts
        List<Integer> validPopcounts = new ArrayList<>();
        for (int p = 1; p <= maxVal; p++) {
            if (steps[p] <= k - 1) {
                validPopcounts.add(p);
            }
        }

        if (validPopcounts.isEmpty()) {
            return 0;
        }

        // Digit DP for counting numbers with exactly targetBits set bits
        int total = 0;
        for (int targetBits : validPopcounts) {
            total = (total + countWithPopcount(s, targetBits)) % MOD;
        }

        // Subtract n itself if it was counted
        int nPopcount = 0;
        for (char c : s.toCharArray()) {
            if (c == '1') nPopcount++;
        }
        if (steps[nPopcount] <= k - 1) {
            total = (total - 1 + MOD) % MOD;
        }

        return total;
    }

    private int countWithPopcount(String s, int targetBits) {
        int L = s.length();
        // dp[pos][bitsUsed][tight]
        Integer[][][] memo = new Integer[L + 1][targetBits + 1][2];

        return dfs(0, 0, true, s, targetBits, L, memo);
    }

    private int dfs(int pos, int bitsUsed, boolean tight,
                   String s, int targetBits, int L, Integer[][][] memo) {
        // Base case
        if (pos == L) {
            return bitsUsed == targetBits ? 1 : 0;
        }

        int tightInt = tight ? 1 : 0;
        if (memo[pos][bitsUsed][tightInt] != null) {
            return memo[pos][bitsUsed][tightInt];
        }

        int maxBit = tight ? (s.charAt(pos) - '0') : 1;
        long total = 0;

        // Try bit 0
        total += dfs(pos + 1, bitsUsed, tight && (0 == maxBit),
                    s, targetBits, L, memo);

        // Try bit 1 if allowed
        if (bitsUsed < targetBits && 1 <= maxBit) {
            total += dfs(pos + 1, bitsUsed + 1, tight && (1 == maxBit),
                        s, targetBits, L, memo);
        }

        total %= MOD;
        memo[pos][bitsUsed][tightInt] = (int) total;
        return (int) total;
    }

    // Helper method for Java 17+ compatibility (Integer.bitCount used above)
    // For older Java, implement popcount manually
    private int popcount(int x) {
        int count = 0;
        while (x > 0) {
            count += x & 1;
            x >>= 1;
        }
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(L² \* K) where L is the length of binary string `s` and K is the maximum steps needed (bounded by log L).

- Precomputing `steps` array: O(L \* log L) since each popcount computation takes O(log i)
- Digit DP for each valid popcount: O(L²) per popcount, and there are at most L valid popcounts
- In practice, valid popcounts are limited by `k`, so it's often much less than L

**Space Complexity**: O(L²) for the DP memoization tables. We need to store states for (position × bits_used × tight_bound), which gives us L × L × 2 = O(L²) states.

## Common Mistakes

1. **Not handling k=0 case**: When k=0, only the number 1 is reducible (if n > 1). Many candidates forget this edge case.

2. **Including n itself in the count**: The problem asks for numbers _less than_ n, but digit DP often includes n itself when counting numbers with certain properties. Remember to subtract n if it qualifies.

3. **Integer overflow with large binary strings**: Trying to convert 1000-bit binary strings to integers will overflow in most languages. Always work with the string representation directly using digit DP.

4. **Missing the -1 in steps comparison**: A number is k-reducible if `steps[popcount(x)] ≤ k-1`, not `≤ k`. The first operation reduces x to popcount(x), then we need ≤ k-1 more operations.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Digit Dynamic Programming**: Used in problems like "Count Numbers with Unique Digits", "Numbers At Most N Given Digit Set", and "Non-negative Integers without Consecutive Ones". The pattern involves counting numbers with specific digit properties without enumerating them all.

2. **Popcount/bit manipulation patterns**: Problems like "Counting Bits", "Number of 1 Bits", and "Total Hamming Distance" deal with popcount properties.

3. **Reduction chain analysis**: Similar to "Minimum Number of Steps to Reduce a Number to 1" but with a combinatorial counting twist.

## Key Takeaways

1. **Digit DP is powerful for counting problems**: When you need to count numbers with specific digit properties in a range [0, n], digit DP with tight bounding is the go-to technique.

2. **Break complex operations into stages**: The insight that the first popcount operation reduces any number to at most its bit length is crucial. This allows precomputation for small numbers.

3. **Watch for off-by-one in operation counts**: In reduction problems, carefully track whether you're counting operations applied or operations remaining. The "at most k times" condition needs precise handling.

[Practice this problem on CodeJeet](/problem/count-k-reducible-numbers-less-than-n)
