---
title: "How to Solve Number of Distinct Roll Sequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Distinct Roll Sequences. Hard difficulty, 58.2% acceptance rate. Topics: Dynamic Programming, Memoization."
date: "2026-02-20"
category: "dsa-patterns"
tags: ["number-of-distinct-roll-sequences", "dynamic-programming", "memoization", "hard"]
---

# How to Solve Number of Distinct Roll Sequences

This problem asks us to count valid sequences of dice rolls where adjacent numbers must be coprime (GCD = 1) and no three consecutive rolls can be identical. The challenge lies in efficiently counting sequences that satisfy both constraints simultaneously, especially when `n` can be up to 10⁴. The two constraints interact in non-trivial ways, making brute force enumeration impossible.

## Visual Walkthrough

Let's trace through a small example with `n = 3` to build intuition:

We need sequences of length 3 where:

1. Adjacent numbers are coprime (GCD = 1)
2. No three consecutive identical numbers (but with n=3, this just means no single number repeated 3 times)

**Step 1: Start with first roll**
We can roll any number 1-6: {1, 2, 3, 4, 5, 6}

**Step 2: Choose second roll**
For each first roll, the second must be coprime with it:

- If first = 1: Coprime with all numbers → 6 choices
- If first = 2: Coprime with {1, 3, 5} → 3 choices
- If first = 3: Coprime with {1, 2, 4, 5} → 4 choices
- If first = 4: Coprime with {1, 3, 5} → 3 choices
- If first = 5: Coprime with {1, 2, 3, 4, 6} → 5 choices
- If first = 6: Coprime with {1, 5} → 2 choices

**Step 3: Choose third roll**
Now we need to check BOTH constraints:

1. Third roll must be coprime with second roll
2. First three rolls can't all be identical

Example: First=2, Second=3

- Third must be coprime with 3: {1, 2, 4, 5}
- Check triple constraint: (2, 3, 1) OK, (2, 3, 2) OK, (2, 3, 4) OK, (2, 3, 5) OK
- So 4 valid sequences starting with (2, 3)

We'd continue this process for all combinations. For n=3, we can manually count, but for larger n, we need a systematic approach.

## Brute Force Approach

The brute force solution would generate all 6ⁿ possible sequences and check both constraints for each. Here's what that might look like:

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW FOR n > 10
def distinctSequences_brute(n):
    from math import gcd

    def is_valid(seq):
        # Check adjacent GCD condition
        for i in range(len(seq) - 1):
            if gcd(seq[i], seq[i + 1]) != 1:
                return False

        # Check no three consecutive identical
        for i in range(len(seq) - 2):
            if seq[i] == seq[i + 1] == seq[i + 2]:
                return False

        return True

    def backtrack(current):
        if len(current) == n:
            return 1 if is_valid(current) else 0

        total = 0
        for roll in range(1, 7):
            current.append(roll)
            total += backtrack(current)
            current.pop()
        return total

    return backtrack([])
```

```javascript
// BRUTE FORCE - TOO SLOW FOR n > 10
function distinctSequencesBrute(n) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  function isValid(seq) {
    // Check adjacent GCD condition
    for (let i = 0; i < seq.length - 1; i++) {
      if (gcd(seq[i], seq[i + 1]) !== 1) return false;
    }

    // Check no three consecutive identical
    for (let i = 0; i < seq.length - 2; i++) {
      if (seq[i] === seq[i + 1] && seq[i + 1] === seq[i + 2]) return false;
    }

    return true;
  }

  function backtrack(current) {
    if (current.length === n) {
      return isValid(current) ? 1 : 0;
    }

    let total = 0;
    for (let roll = 1; roll <= 6; roll++) {
      current.push(roll);
      total += backtrack(current);
      current.pop();
    }
    return total;
  }

  return backtrack([]);
}
```

```java
// BRUTE FORCE - TOO SLOW FOR n > 10
public class Solution {
    public int distinctSequencesBrute(int n) {
        return backtrack(new ArrayList<>(), n);
    }

    private int backtrack(List<Integer> current, int n) {
        if (current.size() == n) {
            return isValid(current) ? 1 : 0;
        }

        int total = 0;
        for (int roll = 1; roll <= 6; roll++) {
            current.add(roll);
            total += backtrack(current, n);
            current.remove(current.size() - 1);
        }
        return total;
    }

    private boolean isValid(List<Integer> seq) {
        // Check adjacent GCD condition
        for (int i = 0; i < seq.size() - 1; i++) {
            if (gcd(seq.get(i), seq.get(i + 1)) != 1) return false;
        }

        // Check no three consecutive identical
        for (int i = 0; i < seq.size() - 2; i++) {
            if (seq.get(i).equals(seq.get(i + 1)) &&
                seq.get(i + 1).equals(seq.get(i + 2))) return false;
        }

        return true;
    }

    private int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
}
```

</div>

**Why brute force fails:**

- Time complexity: O(6ⁿ) which is astronomical for n up to 10⁴
- Even for n=20, 6²⁰ ≈ 3.6×10¹⁵ operations
- We need to count sequences, not enumerate them

## Optimized Approach

The key insight is that we only need to track the **last two rolls** to determine what the next roll can be. This is because:

1. The GCD constraint only involves adjacent rolls
2. The "no three identical" constraint only involves three consecutive rolls

This suggests a **dynamic programming** approach where:

- State: `dp[i][prev][prev2]` = number of valid sequences of length `i` ending with rolls `prev2` then `prev`
- Transition: To extend a sequence, we choose `curr` such that:
  1. `gcd(prev, curr) == 1`
  2. `curr != prev2` OR `prev2 == 0` (for sequences shorter than 2)
  3. Actually, we need to ensure we don't create three identical in a row: `curr != prev` OR `prev != prev2`

Wait, let's think carefully about the "no three identical" constraint. It says we cannot have `x, x, x` for any x. So if we have `prev2, prev, curr`, we need to avoid `prev2 == prev == curr`. This means:

- If `prev2 == prev`, then `curr` cannot equal `prev`
- If `prev2 != prev`, then any valid `curr` (by GCD) is allowed

So our DP state needs to track the last two rolls to enforce this constraint properly.

## Optimal Solution

We use 3D DP where `dp[i][prev][prev2]` represents the number of valid sequences of length `i` where the last roll is `prev` and the second-to-last roll is `prev2`. For the base cases:

- When i=1: `dp[1][x][0] = 1` for all x (only one roll, no previous rolls)
- When i=2: `dp[2][x][y] = 1` if `gcd(x, y) = 1`

<div class="code-group">

```python
# Time: O(n * 6^3) = O(216n) | Space: O(n * 6^2) = O(36n)
def distinctSequences(n):
    from math import gcd

    # Edge case: n = 1 has 6 valid sequences
    if n == 1:
        return 6

    # Precompute GCD table for all pairs of dice values (1-6)
    # coprime[i][j] = True if gcd(i, j) == 1
    coprime = [[False] * 7 for _ in range(7)]
    for i in range(1, 7):
        for j in range(1, 7):
            coprime[i][j] = (gcd(i, j) == 1)

    # dp[i][prev][prev2]: sequences of length i ending with prev2, prev
    # We use 0 to represent "no roll" for prev2 when sequence length < 2
    dp = [[[0] * 7 for _ in range(7)] for _ in range(n + 1)]

    # Base case: sequences of length 1
    # For length 1, prev2 = 0 (no previous roll), prev = dice value
    for curr in range(1, 7):
        dp[1][curr][0] = 1

    # Fill DP table for lengths 2 to n
    for length in range(2, n + 1):
        for prev in range(1, 7):          # Last roll
            for prev2 in range(0, 7):     # Second-to-last roll (0 means none)
                # Skip if no sequences of this ending exist
                if dp[length - 1][prev][prev2] == 0:
                    continue

                # Try all possible current rolls
                for curr in range(1, 7):
                    # Constraint 1: curr must be coprime with prev
                    if not coprime[curr][prev]:
                        continue

                    # Constraint 2: No three consecutive identical
                    # If prev2 exists and equals prev, then curr cannot equal prev
                    if prev2 != 0 and prev2 == prev and curr == prev:
                        continue

                    # Add sequences: extend (prev2, prev) with curr to get (prev, curr)
                    dp[length][curr][prev] = (
                        dp[length][curr][prev] + dp[length - 1][prev][prev2]
                    ) % (10**9 + 7)

    # Sum all sequences of length n
    result = 0
    for prev in range(1, 7):
        for prev2 in range(0, 7):
            result = (result + dp[n][prev][prev2]) % (10**9 + 7)

    return result
```

```javascript
// Time: O(n * 6^3) = O(216n) | Space: O(n * 6^2) = O(36n)
function distinctSequences(n) {
  // Edge case: n = 1 has 6 valid sequences
  if (n === 1) return 6;

  // Helper function to compute GCD
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  // Precompute GCD table for all pairs of dice values (1-6)
  // coprime[i][j] = true if gcd(i, j) === 1
  const coprime = Array(7)
    .fill()
    .map(() => Array(7).fill(false));
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 6; j++) {
      coprime[i][j] = gcd(i, j) === 1;
    }
  }

  // dp[i][prev][prev2]: sequences of length i ending with prev2, prev
  // We use 0 to represent "no roll" for prev2 when sequence length < 2
  const dp = Array(n + 1)
    .fill()
    .map(() =>
      Array(7)
        .fill()
        .map(() => Array(7).fill(0))
    );

  // Base case: sequences of length 1
  // For length 1, prev2 = 0 (no previous roll), prev = dice value
  for (let curr = 1; curr <= 6; curr++) {
    dp[1][curr][0] = 1;
  }

  const MOD = 10 ** 9 + 7;

  // Fill DP table for lengths 2 to n
  for (let length = 2; length <= n; length++) {
    for (let prev = 1; prev <= 6; prev++) {
      // Last roll
      for (let prev2 = 0; prev2 <= 6; prev2++) {
        // Second-to-last roll
        // Skip if no sequences of this ending exist
        if (dp[length - 1][prev][prev2] === 0) continue;

        // Try all possible current rolls
        for (let curr = 1; curr <= 6; curr++) {
          // Constraint 1: curr must be coprime with prev
          if (!coprime[curr][prev]) continue;

          // Constraint 2: No three consecutive identical
          // If prev2 exists and equals prev, then curr cannot equal prev
          if (prev2 !== 0 && prev2 === prev && curr === prev) continue;

          // Add sequences: extend (prev2, prev) with curr to get (prev, curr)
          dp[length][curr][prev] = (dp[length][curr][prev] + dp[length - 1][prev][prev2]) % MOD;
        }
      }
    }
  }

  // Sum all sequences of length n
  let result = 0;
  for (let prev = 1; prev <= 6; prev++) {
    for (let prev2 = 0; prev2 <= 6; prev2++) {
      result = (result + dp[n][prev][prev2]) % MOD;
    }
  }

  return result;
}
```

```java
// Time: O(n * 6^3) = O(216n) | Space: O(n * 6^2) = O(36n)
class Solution {
    public int distinctSequences(int n) {
        // Edge case: n = 1 has 6 valid sequences
        if (n == 1) return 6;

        // Precompute GCD table for all pairs of dice values (1-6)
        // coprime[i][j] = true if gcd(i, j) == 1
        boolean[][] coprime = new boolean[7][7];
        for (int i = 1; i <= 6; i++) {
            for (int j = 1; j <= 6; j++) {
                coprime[i][j] = (gcd(i, j) == 1);
            }
        }

        // dp[i][prev][prev2]: sequences of length i ending with prev2, prev
        // We use 0 to represent "no roll" for prev2 when sequence length < 2
        int[][][] dp = new int[n + 1][7][7];

        // Base case: sequences of length 1
        // For length 1, prev2 = 0 (no previous roll), prev = dice value
        for (int curr = 1; curr <= 6; curr++) {
            dp[1][curr][0] = 1;
        }

        final int MOD = 1000000007;

        // Fill DP table for lengths 2 to n
        for (int length = 2; length <= n; length++) {
            for (int prev = 1; prev <= 6; prev++) {      // Last roll
                for (int prev2 = 0; prev2 <= 6; prev2++) { // Second-to-last roll
                    // Skip if no sequences of this ending exist
                    if (dp[length - 1][prev][prev2] == 0) continue;

                    // Try all possible current rolls
                    for (int curr = 1; curr <= 6; curr++) {
                        // Constraint 1: curr must be coprime with prev
                        if (!coprime[curr][prev]) continue;

                        // Constraint 2: No three consecutive identical
                        // If prev2 exists and equals prev, then curr cannot equal prev
                        if (prev2 != 0 && prev2 == prev && curr == prev) continue;

                        // Add sequences: extend (prev2, prev) with curr to get (prev, curr)
                        dp[length][curr][prev] = (
                            dp[length][curr][prev] + dp[length - 1][prev][prev2]
                        ) % MOD;
                    }
                }
            }
        }

        // Sum all sequences of length n
        int result = 0;
        for (int prev = 1; prev <= 6; prev++) {
            for (int prev2 = 0; prev2 <= 6; prev2++) {
                result = (result + dp[n][prev][prev2]) % MOD;
            }
        }

        return result;
    }

    private int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(216n)**

- We have three nested loops: length (n), prev (6), prev2 (7)
- Inside, we loop through curr (6)
- Total: n × 6 × 7 × 6 ≈ 252n operations
- In practice, we skip many states where dp[length-1][prev][prev2] = 0
- The 7 for prev2 includes 0 (no previous roll), giving 7 possibilities

**Space Complexity: O(36n)**

- DP table size: (n+1) × 7 × 7 ≈ 49n
- We can optimize to O(36) by only storing two layers at a time (current and previous length)
- The coprime table uses O(36) constant space

## Common Mistakes

1. **Incorrectly handling the "no three identical" constraint**: The constraint is NOT "no two identical in a row" but "no three identical in a row". Some candidates mistakenly think adjacent rolls can't be equal, but that's wrong. Rolls can repeat, just not three times consecutively.

2. **Forgetting to handle n=1 as a special case**: When n=1, there are no adjacent pairs to check for GCD, and no possibility of three consecutive identical rolls. The answer should simply be 6.

3. **Not using modulo arithmetic correctly**: The result can be huge (6¹⁰⁰⁰⁰), so we need to take mod 10⁹+7 at each addition, not just at the end. Integer overflow will occur otherwise.

4. **Inefficient state representation**: Some candidates try to track the entire sequence or use a state that's too large. The key insight is that only the last two rolls matter for both constraints.

## When You'll See This Pattern

This type of "constrained sequence counting with limited dependency" problem appears frequently in dynamic programming:

1. **Dice Roll Simulation (Hard)**: Count dice roll sequences where no number appears more than consecutivelyRollMax[i] times in a row. Similar state tracking of last roll and its consecutive count.

2. **Paint House III (Hard)**: Paint houses with constraints on adjacent colors and exactly k neighborhoods. Tracks last color and current count of neighborhoods.

3. **Student Attendance Record II (Hard)**: Count attendance records with constraints on consecutive 'L's and total 'A's. Tracks last few characters and counts.

The pattern: When constraints only depend on a limited history (last k elements), use DP with state tracking those k elements.

## Key Takeaways

1. **Limited dependency enables DP**: When constraints only look at a fixed window of the sequence (here, 2-3 consecutive rolls), you can use DP with state tracking that window rather than the entire sequence.

2. **Precompute what you can**: The GCD checks between 1-6 are constant and can be precomputed in a 6×6 table, saving repeated gcd() calls.

3. **Carefully parse constraints**: The "no three identical" constraint is subtle—it doesn't forbid repetitions entirely, just three in a row. Always test your understanding with small examples.

Related problems: [Dice Roll Simulation](/problem/dice-roll-simulation), [Paint House III](/problem/paint-house-iii)
