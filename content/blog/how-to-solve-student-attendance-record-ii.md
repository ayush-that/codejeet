---
title: "How to Solve Student Attendance Record II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Student Attendance Record II. Hard difficulty, 56.4% acceptance rate. Topics: Dynamic Programming."
date: "2026-08-11"
category: "dsa-patterns"
tags: ["student-attendance-record-ii", "dynamic-programming", "hard"]
---

# How to Solve Student Attendance Record II

This problem asks us to count the number of valid attendance records of length `n` where a record is invalid if it contains more than one 'A' (absent) OR three consecutive 'L's (late). While the constraints seem simple, the combinatorial nature makes this a challenging counting problem. What makes this interesting is that we can't simply enumerate all 3ⁿ possibilities for large `n` (up to 10⁵), so we need a smarter way to count valid sequences.

## Visual Walkthrough

Let's build intuition with `n = 2`. We need to count sequences of length 2 using characters {A, L, P} that satisfy:

1. At most one 'A' total
2. No "LLL" substring (though with n=2, this only matters for n≥3)

For n=2, all 3² = 9 sequences are valid except those with two A's:

- Valid: PP, PL, LP, AP, PA, AL, LA, LL (8 sequences)
- Invalid: AA (has two A's)

Now consider `n = 3`. We need to avoid:

1. More than one 'A' (like "AAP", "APA", etc.)
2. Three consecutive L's ("LLL")

Let's count manually for intuition:

- Total possible sequences: 3³ = 27
- Invalid due to 2+ A's: Sequences with exactly 2 A's = C(3,2) × 1¹ = 3 × 1 = 3 (AAL, ALA, LAA)
- Invalid due to 3 L's: Just "LLL" (1 sequence)
- Sequences invalid for both reasons: None (can't have 2 A's and 3 L's in length 3)
- Valid sequences: 27 - 3 - 1 = 23

This manual counting becomes impossible for n=10⁵. We need a systematic way.

## Brute Force Approach

The brute force approach would generate all 3ⁿ possible strings and check each one for validity. For each string:

1. Count 'A's, reject if > 1
2. Check for "LLL" substring, reject if found

This has O(3ⁿ × n) time complexity (n for checking each string). For n=10, that's 3¹⁰ = 59,049 strings to check. For n=20, it's 3.5 billion. Clearly impossible for n=10⁵.

Even with optimization (backtracking to prune invalid prefixes), the exponential nature makes this infeasible. We need a way to count without enumerating.

## Optimized Approach

The key insight: This is a **dynamic programming** counting problem. We need to track state as we build the sequence character by character.

What state do we need to remember?

1. How many A's we've used so far (0 or 1, since >1 makes sequence invalid)
2. How many consecutive L's we have at the end (0, 1, or 2, since 3 makes sequence invalid)

This gives us 2 × 3 = 6 possible states:

- dp[i][a][l] = number of valid sequences of length i with 'a' A's used (0 or 1) and ending with 'l' consecutive L's (0, 1, or 2)

Transition rules:

1. If we add 'P' (Present): Resets consecutive L's to 0, A count unchanged
   - dp[i+1][a][0] += dp[i][a][l] for all a, l
2. If we add 'L' (Late): Increases consecutive L's by 1 (but only if l < 2)
   - dp[i+1][a][l+1] += dp[i][a][l] for all a, l < 2
3. If we add 'A' (Absent): Resets consecutive L's to 0, increases A count (but only if a = 0)
   - dp[i+1][1][0] += dp[i][0][l] for all l

Base case: dp[0][0][0] = 1 (empty sequence)

Answer: Sum of dp[n][a][l] for all a∈{0,1}, l∈{0,1,2}

We can optimize space by only keeping current and previous rows since we only need dp[i] to compute dp[i+1].

## Optimal Solution

Here's the DP solution with space optimization:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def checkRecord(n: int) -> int:
    MOD = 10**9 + 7

    # dp[a][l] = number of sequences with 'a' A's and ending with 'l' consecutive L's
    # Initialize for length 0: empty sequence
    dp = [[0] * 3 for _ in range(2)]
    dp[0][0] = 1  # length 0, 0 A's, 0 consecutive L's

    for _ in range(n):
        # New DP table for next length
        new_dp = [[0] * 3 for _ in range(2)]

        for a in range(2):  # a = 0 or 1 A's used
            for l in range(3):  # l = 0, 1, or 2 consecutive L's
                count = dp[a][l]
                if count == 0:
                    continue

                # Add 'P': Present resets consecutive L's to 0
                new_dp[a][0] = (new_dp[a][0] + count) % MOD

                # Add 'L': Late if we have less than 2 consecutive L's
                if l < 2:
                    new_dp[a][l + 1] = (new_dp[a][l + 1] + count) % MOD

                # Add 'A': Absent if we have 0 A's so far
                if a == 0:
                    new_dp[1][0] = (new_dp[1][0] + count) % MOD

        dp = new_dp

    # Sum all valid states for length n
    result = 0
    for a in range(2):
        for l in range(3):
            result = (result + dp[a][l]) % MOD

    return result
```

```javascript
// Time: O(n) | Space: O(1)
function checkRecord(n) {
  const MOD = 10 ** 9 + 7;

  // dp[a][l] = number of sequences with 'a' A's and ending with 'l' consecutive L's
  // Initialize for length 0: empty sequence
  let dp = Array.from({ length: 2 }, () => Array(3).fill(0));
  dp[0][0] = 1; // length 0, 0 A's, 0 consecutive L's

  for (let i = 0; i < n; i++) {
    // New DP table for next length
    let newDp = Array.from({ length: 2 }, () => Array(3).fill(0));

    for (let a = 0; a < 2; a++) {
      // a = 0 or 1 A's used
      for (let l = 0; l < 3; l++) {
        // l = 0, 1, or 2 consecutive L's
        let count = dp[a][l];
        if (count === 0) continue;

        // Add 'P': Present resets consecutive L's to 0
        newDp[a][0] = (newDp[a][0] + count) % MOD;

        // Add 'L': Late if we have less than 2 consecutive L's
        if (l < 2) {
          newDp[a][l + 1] = (newDp[a][l + 1] + count) % MOD;
        }

        // Add 'A': Absent if we have 0 A's so far
        if (a === 0) {
          newDp[1][0] = (newDp[1][0] + count) % MOD;
        }
      }
    }

    dp = newDp;
  }

  // Sum all valid states for length n
  let result = 0;
  for (let a = 0; a < 2; a++) {
    for (let l = 0; l < 3; l++) {
      result = (result + dp[a][l]) % MOD;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int checkRecord(int n) {
        final int MOD = 1000000007;

        // dp[a][l] = number of sequences with 'a' A's and ending with 'l' consecutive L's
        // Initialize for length 0: empty sequence
        long[][] dp = new long[2][3];
        dp[0][0] = 1;  // length 0, 0 A's, 0 consecutive L's

        for (int i = 0; i < n; i++) {
            // New DP table for next length
            long[][] newDp = new long[2][3];

            for (int a = 0; a < 2; a++) {  // a = 0 or 1 A's used
                for (int l = 0; l < 3; l++) {  // l = 0, 1, or 2 consecutive L's
                    long count = dp[a][l];
                    if (count == 0) continue;

                    // Add 'P': Present resets consecutive L's to 0
                    newDp[a][0] = (newDp[a][0] + count) % MOD;

                    // Add 'L': Late if we have less than 2 consecutive L's
                    if (l < 2) {
                        newDp[a][l + 1] = (newDp[a][l + 1] + count) % MOD;
                    }

                    // Add 'A': Absent if we have 0 A's so far
                    if (a == 0) {
                        newDp[1][0] = (newDp[1][0] + count) % MOD;
                    }
                }
            }

            dp = newDp;
        }

        // Sum all valid states for length n
        long result = 0;
        for (int a = 0; a < 2; a++) {
            for (int l = 0; l < 3; l++) {
                result = (result + dp[a][l]) % MOD;
            }
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate n times (for each character position)
- Each iteration processes 6 states (2 × 3) with constant work per state
- Total: O(6n) = O(n)

**Space Complexity:** O(1)

- We only store two 2×3 tables (current and next)
- Constant space regardless of n
- Even if we used the full n×2×3 table, it would be O(n), but we optimized to O(1)

## Common Mistakes

1. **Forgetting the modulo operation**: The result can be huge (exponential in n), so we need modulo 10⁹+7 at every addition, not just at the end. Intermediate values can overflow 64-bit integers for large n.

2. **Incorrect state definition**: Some candidates track total L's instead of consecutive L's. We only care about consecutive L's at the end because "LLL" anywhere makes it invalid, and if we break the streak with P or A, we reset.

3. **Off-by-one in DP initialization**: The base case should be dp[0][0][0] = 1 (empty sequence of length 0). Starting with dp[1][0][0] = 3 (for P, L, A) is incorrect because we're counting sequences of length 1, not building from empty.

4. **Missing the "at most one A" constraint**: Some solutions correctly handle consecutive L's but forget to limit total A's to ≤1. We need the 'a' dimension in our state (0 or 1 A's used so far).

## When You'll See This Pattern

This type of **state-based DP for counting valid sequences** appears in many problems:

1. **Decode Ways (LeetCode 91)**: Count ways to decode a digit string, where state tracks if previous digit was '1' or '2' (affects whether current digit can be part of two-digit code).

2. **Knight Dialer (LeetCode 935)**: Count sequences of knight moves on phone pad, where state is current position and we transition based on valid knight moves.

3. **Number of Dice Rolls With Target Sum (LeetCode 1155)**: Count sequences of dice rolls summing to target, where state is current sum.

The pattern: When counting sequences/strings subject to constraints, define DP state that captures all relevant information about the prefix that affects what can come next.

## Key Takeaways

1. **For counting problems with constraints on sequences, think in terms of state machines**: What do you need to know about the prefix to determine what characters can come next? Here: A-count and consecutive L-count.

2. **DP state compression is key**: We only needed 2×3 = 6 states, not all 3ⁿ possibilities. Look for the minimal information that captures the constraints.

3. **Space optimization often possible**: If transitions only depend on previous state, we can use O(1) space instead of O(n).

Related problems: [Student Attendance Record I](/problem/student-attendance-record-i)
