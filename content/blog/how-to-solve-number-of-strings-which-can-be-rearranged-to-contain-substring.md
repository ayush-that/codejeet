---
title: "How to Solve Number of Strings Which Can Be Rearranged to Contain Substring — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Strings Which Can Be Rearranged to Contain Substring. Medium difficulty, 57.0% acceptance rate. Topics: Math, Dynamic Programming, Combinatorics."
date: "2026-06-21"
category: "dsa-patterns"
tags:
  [
    "number-of-strings-which-can-be-rearranged-to-contain-substring",
    "math",
    "dynamic-programming",
    "combinatorics",
    "medium",
  ]
---

# How to Solve "Number of Strings Which Can Be Rearranged to Contain Substring"

This problem asks us to count how many strings of length `n` (using only lowercase English letters) can be rearranged to contain "leet" as a contiguous substring. The tricky part is that we're counting strings where the characters can be rearranged — so we need to ensure we have at least the required letters for "leet", but we also need to account for all possible positions and arrangements of the remaining letters.

## Visual Walkthrough

Let's build intuition with `n = 4`. We need strings of length 4 that can be rearranged to contain "leet". But "leet" itself has 4 characters, so the only way is if the string contains exactly: one 'l', one 'e', one 'e', and one 't' (in any order).

Valid examples: "leet", "eelt", "tlee"
Invalid: "leat" (missing second 'e'), "leee" (missing 't')

Now consider `n = 5`. We need at least the 4 letters for "leet", plus one extra letter (any of 26 letters). The "leet" substring could be in positions 1-4 or 2-5 of the rearranged string.

Example: "leeta" → rearrange to "aleet" (contains "leet" at positions 2-5)
Example: "xleet" → already contains "leet" at positions 2-5

The counting becomes complex because:

1. We need at least 1 'l', 2 'e's, and 1 't'
2. The remaining letters can be anything
3. We must avoid double-counting strings that satisfy the condition in multiple ways

## Brute Force Approach

A naive approach would be:

1. Generate all possible strings of length `n` (26^n possibilities — astronomically large)
2. For each string, check if it can be rearranged to contain "leet"
3. Count the valid ones

Checking if a string can be rearranged requires:

- Counting frequency of each letter
- Ensuring we have at least 1 'l', 2 'e's, and 1 't'
- This check is O(n), but with 26^n total strings, this is completely infeasible even for small n.

Even for n=10, 26^10 ≈ 1.4×10^14 operations — impossible.

## Optimized Approach

The key insight is to use **combinatorics and inclusion-exclusion principle**. Instead of counting good strings directly, we'll:

1. **Count total possible strings**: 26^n (all strings of length n)
2. **Subtract bad strings**: Strings that CANNOT be rearranged to contain "leet"
3. **Use inclusion-exclusion**: A string is bad if it's missing at least one requirement:
   - Missing at least 1 'l' (no 'l' at all)
   - Missing at least 2 'e's (0 or 1 'e' only)
   - Missing at least 1 't' (no 't' at all)

Let's define:

- A = strings with no 'l'
- B = strings with 0 or 1 'e'
- C = strings with no 't'

By inclusion-exclusion:
Bad strings = |A ∪ B ∪ C| = |A| + |B| + |C| - |A∩B| - |A∩C| - |B∩C| + |A∩B∩C|

We can compute each term using combinatorics:

- |A|: Strings with no 'l' → 25^n (25 choices for each position)
- |C|: Strings with no 't' → 25^n
- |B|: Strings with 0 or 1 'e':
  - 0 e's: 25^n (25 choices, since 'e' is excluded)
  - 1 e: Choose 1 position for 'e' (C(n,1) ways), remaining n-1 positions have 25 choices each
  - So |B| = 25^n + n × 25^(n-1)

Similarly for intersections:

- |A∩B|: No 'l' and (0 or 1 'e'):
  - No 'l' means 25 letters available, but 'e' is one of them
  - 0 e's: 24^n (exclude both 'l' and 'e')
  - 1 e: Choose 1 position for 'e' (C(n,1)), remaining n-1 positions have 24 choices
  - So |A∩B| = 24^n + n × 24^(n-1)

- |A∩C|: No 'l' and no 't' → 24^n (24 choices per position)
- |B∩C|: (0 or 1 'e') and no 't':
  - 0 e's: 24^n (exclude 'e' and 't')
  - 1 e: Choose 1 position for 'e', remaining n-1 positions have 24 choices
  - So |B∩C| = 24^n + n × 24^(n-1)

- |A∩B∩C|: No 'l', no 't', and (0 or 1 'e'):
  - 0 e's: 23^n (exclude 'l', 'e', 't')
  - 1 e: Choose 1 position for 'e', remaining n-1 positions have 23 choices
  - So |A∩B∩C| = 23^n + n × 23^(n-1)

Finally: Good strings = Total - Bad = 26^n - |A ∪ B ∪ C|

## Optimal Solution

We implement the inclusion-exclusion formula with modular arithmetic (since results can be huge).

<div class="code-group">

```python
# Time: O(log n) for modular exponentiation | Space: O(1)
MOD = 10**9 + 7

def stringCount(n: int) -> int:
    # Total possible strings: 26^n
    total = pow(26, n, MOD)

    # Strings missing at least one requirement
    # A: no 'l', B: 0 or 1 'e', C: no 't'

    # |A| = 25^n
    A = pow(25, n, MOD)

    # |C| = 25^n
    C = pow(25, n, MOD)

    # |B| = strings with 0 or 1 'e'
    # 0 e's: 25^n, 1 e: n * 25^(n-1)
    B = (pow(25, n, MOD) + n * pow(25, n-1, MOD)) % MOD

    # Intersections
    # |A∩B| = no 'l' and (0 or 1 'e')
    AB = (pow(24, n, MOD) + n * pow(24, n-1, MOD)) % MOD

    # |A∩C| = no 'l' and no 't'
    AC = pow(24, n, MOD)

    # |B∩C| = (0 or 1 'e') and no 't'
    BC = (pow(24, n, MOD) + n * pow(24, n-1, MOD)) % MOD

    # |A∩B∩C| = no 'l', no 't', and (0 or 1 'e')
    ABC = (pow(23, n, MOD) + n * pow(23, n-1, MOD)) % MOD

    # Inclusion-exclusion: |A ∪ B ∪ C| = A + B + C - AB - AC - BC + ABC
    bad = (A + B + C - AB - AC - BC + ABC) % MOD

    # Good strings = total - bad
    result = (total - bad) % MOD

    # Ensure non-negative result
    return result if result >= 0 else result + MOD
```

```javascript
// Time: O(log n) for modular exponentiation | Space: O(1)
const MOD = 1_000_000_007n; // Use BigInt for large exponents

function stringCount(n) {
  // Helper function for modular exponentiation
  function powMod(base, exp) {
    let result = 1n;
    let b = BigInt(base) % MOD;
    let e = BigInt(exp);

    while (e > 0n) {
      if (e % 2n === 1n) {
        result = (result * b) % MOD;
      }
      b = (b * b) % MOD;
      e = e / 2n;
    }
    return result;
  }

  // Total possible strings: 26^n
  const total = powMod(26, n);

  // |A| = no 'l' = 25^n
  const A = powMod(25, n);

  // |C| = no 't' = 25^n
  const C = powMod(25, n);

  // |B| = 0 or 1 'e' = 25^n + n * 25^(n-1)
  const B = (powMod(25, n) + ((BigInt(n) * powMod(25, n - 1)) % MOD)) % MOD;

  // Intersections
  // |A∩B| = no 'l' and (0 or 1 'e')
  const AB = (powMod(24, n) + ((BigInt(n) * powMod(24, n - 1)) % MOD)) % MOD;

  // |A∩C| = no 'l' and no 't'
  const AC = powMod(24, n);

  // |B∩C| = (0 or 1 'e') and no 't'
  const BC = (powMod(24, n) + ((BigInt(n) * powMod(24, n - 1)) % MOD)) % MOD;

  // |A∩B∩C| = no 'l', no 't', and (0 or 1 'e')
  const ABC = (powMod(23, n) + ((BigInt(n) * powMod(23, n - 1)) % MOD)) % MOD;

  // Inclusion-exclusion: |A ∪ B ∪ C| = A + B + C - AB - AC - BC + ABC
  let bad = (A + B + C - AB - AC - BC + ABC) % MOD;

  // Ensure non-negative
  if (bad < 0n) bad += MOD;

  // Good strings = total - bad
  let result = (total - bad) % MOD;
  if (result < 0n) result += MOD;

  return Number(result);
}
```

```java
// Time: O(log n) for modular exponentiation | Space: O(1)
class Solution {
    private static final int MOD = 1_000_000_007;

    public int stringCount(int n) {
        // Total possible strings: 26^n
        long total = powMod(26, n);

        // |A| = no 'l' = 25^n
        long A = powMod(25, n);

        // |C| = no 't' = 25^n
        long C = powMod(25, n);

        // |B| = 0 or 1 'e' = 25^n + n * 25^(n-1)
        long B = (powMod(25, n) + n * powMod(25, n-1) % MOD) % MOD;

        // Intersections
        // |A∩B| = no 'l' and (0 or 1 'e')
        long AB = (powMod(24, n) + n * powMod(24, n-1) % MOD) % MOD;

        // |A∩C| = no 'l' and no 't'
        long AC = powMod(24, n);

        // |B∩C| = (0 or 1 'e') and no 't'
        long BC = (powMod(24, n) + n * powMod(24, n-1) % MOD) % MOD;

        // |A∩B∩C| = no 'l', no 't', and (0 or 1 'e')
        long ABC = (powMod(23, n) + n * powMod(23, n-1) % MOD) % MOD;

        // Inclusion-exclusion: |A ∪ B ∪ C| = A + B + C - AB - AC - BC + ABC
        long bad = (A + B + C - AB - AC - BC + ABC) % MOD;
        if (bad < 0) bad += MOD;

        // Good strings = total - bad
        long result = (total - bad) % MOD;
        if (result < 0) result += MOD;

        return (int) result;
    }

    // Modular exponentiation helper
    private long powMod(long base, int exp) {
        if (exp < 0) return 0; // Handle n-1 when n=0
        long result = 1;
        long b = base % MOD;
        int e = exp;

        while (e > 0) {
            if ((e & 1) == 1) {
                result = (result * b) % MOD;
            }
            b = (b * b) % MOD;
            e >>= 1;
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- We perform 9 modular exponentiations (pow(26,n), pow(25,n) twice, etc.)
- Each modular exponentiation takes O(log n) time using binary exponentiation
- All other operations are O(1)

**Space Complexity:** O(1)

- We only store a constant number of variables
- No data structures that grow with input size

## Common Mistakes

1. **Forgetting modular arithmetic**: The results grow exponentially with n, so we must work modulo 10^9+7. Without this, we'll get integer overflow even for moderate n.

2. **Incorrect inclusion-exclusion formula**: A common error is to miss terms or get signs wrong. Remember: |A ∪ B ∪ C| = |A| + |B| + |C| - |A∩B| - |A∩C| - |B∩C| + |A∩B∩C|.

3. **Miscounting |B| (strings with 0 or 1 'e')**:
   - Wrong: Counting only strings with exactly 0 or exactly 1 'e' separately
   - Correct: |B| = (strings with 0 e) + (strings with 1 e) = 25^n + n × 25^(n-1)

4. **Handling n=0 or n=1 incorrectly**:
   - For n < 4, answer should be 0 (can't fit "leet" in a shorter string)
   - Our formula handles this correctly because when n < 4, some terms become 0

## When You'll See This Pattern

The inclusion-exclusion principle appears in counting problems where we need to count objects satisfying multiple conditions. It's especially useful when direct counting is hard but counting complements is easier.

Related problems:

1. **Count Vowels Permutation (Hard)**: Similar combinatorial counting with constraints on adjacent characters.
2. **Count the Number of Ideal Arrays (Hard)**: Uses combinatorial counting with constraints.
3. **Number of Music Playlists (Hard)**: Uses inclusion-exclusion to count valid playlists.

## Key Takeaways

1. **Inclusion-exclusion transforms hard counting into easier subproblems**: Instead of counting strings that CAN be rearranged to contain "leet", count those that CAN'T and subtract from total.

2. **Combinatorial formulas simplify complex constraints**: The condition "0 or 1 'e'" translates to 25^n + n×25^(n-1) using combinatorics.

3. **Modular arithmetic is essential for large n**: Always check if results need to be modulo a prime (often 10^9+7 in LeetCode).

Related problems: [Count Vowels Permutation](/problem/count-vowels-permutation)
