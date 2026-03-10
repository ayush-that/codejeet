---
title: "How to Solve Dice Roll Simulation — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Dice Roll Simulation. Hard difficulty, 50.7% acceptance rate. Topics: Array, Dynamic Programming."
date: "2028-12-31"
category: "dsa-patterns"
tags: ["dice-roll-simulation", "array", "dynamic-programming", "hard"]
---

# How to Solve Dice Roll Simulation

This problem asks us to count the number of distinct sequences of length `n` we can generate by rolling a die (values 1-6) with a constraint: we cannot roll the same number `i` more than `rollMax[i-1]` times consecutively. What makes this problem tricky is that we need to count sequences while tracking both the current number and how many times it has appeared consecutively—a classic dynamic programming problem with multiple states.

## Visual Walkthrough

Let's walk through a small example: `n = 3`, `rollMax = [1,1,1,1,1,1]` (meaning each number can appear at most once consecutively).

We want to count all sequences of length 3 where no number repeats consecutively.

**Step-by-step counting:**

1. First roll: 6 possibilities (1,2,3,4,5,6)
2. Second roll: For each first roll, we have 5 possibilities (any number except the previous one)
3. Third roll: For each second roll, we have 5 possibilities (any number except the previous one)

Total sequences: 6 × 5 × 5 = 150

Now let's trace one specific path:

- Start with roll 1: Choose 1
- Roll 2: Can't choose 1, so choose 2
- Roll 3: Can't choose 2, so choose 3
  Sequence: [1,2,3] ✓

Another path:

- Start with roll 1: Choose 1
- Roll 2: Can't choose 1, so choose 2
- Roll 3: Can't choose 2, so choose 1 (allowed because 1 isn't consecutive with the previous 1)
  Sequence: [1,2,1] ✓

This shows we need to track not just the last number, but how many times it has appeared consecutively.

## Brute Force Approach

The brute force approach would generate all possible sequences of length `n` (6^n possibilities) and check each one against the constraints. For each sequence:

1. Iterate through the sequence
2. Track the current number and its consecutive count
3. If any number exceeds its `rollMax` limit, discard the sequence

**Why this fails:**

- With `n` up to 5000, 6^5000 is astronomically large
- Even for moderate `n` like 20, 6^20 ≈ 3.6 × 10^15 is far too large
- We need a smarter approach that avoids enumerating all possibilities

The key insight is that many sequences share the same "state": same position, same last number, same consecutive count. We can use dynamic programming to count these states efficiently.

## Optimized Approach

We need a DP state that captures:

1. How many rolls we've made so far (position `i`)
2. What number we rolled last (`last`)
3. How many times that number has appeared consecutively (`k`)

Let `dp[i][last][k]` = number of sequences of length `i` ending with number `last` that has appeared `k` times consecutively.

**Transition logic:**

1. If we roll a **different** number `j` (j ≠ last):
   - We can transition from any sequence ending with any number ≠ j
   - The consecutive count resets to 1
   - `dp[i][j][1] += sum(dp[i-1][x][y])` for all x ≠ j, all valid y

2. If we roll the **same** number `j` (j = last) and k < rollMax[j]:
   - We can continue the streak
   - `dp[i][j][k+1] += dp[i-1][j][k]`

**Base case:**

- For the first roll: `dp[1][j][1] = 1` for all j (6 possibilities)

**Final answer:**

- Sum of `dp[n][j][k]` for all j (1-6) and all valid k (1 to rollMax[j])

**Optimization:** We can reduce space from O(n × 6 × maxRoll) to O(6 × maxRoll) by only storing the current and previous rows.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * 6 * 6 * maxRoll) ≈ O(n * 216) since maxRoll ≤ 15
# Space: O(6 * maxRoll) = O(90) ≈ O(1) constant space
class Solution:
    def dieSimulator(self, n: int, rollMax: List[int]) -> int:
        MOD = 10**9 + 7

        # dp[last][k] = number of sequences ending with 'last' having 'k' consecutive 'last's
        # Initialize for first roll: 1 way for each number with consecutive count 1
        dp = [[0] * 16 for _ in range(6)]
        for j in range(6):
            dp[j][1] = 1

        # Process each additional roll
        for i in range(2, n + 1):
            # Create new dp for current roll
            new_dp = [[0] * 16 for _ in range(6)]

            # For each possible last number in previous roll
            for last in range(6):
                # For each possible consecutive count
                for k in range(1, rollMax[last] + 1):
                    if dp[last][k] == 0:
                        continue

                    # Try rolling a different number
                    for new_num in range(6):
                        if new_num != last:
                            # Reset consecutive count to 1 for new number
                            new_dp[new_num][1] = (new_dp[new_num][1] + dp[last][k]) % MOD

                    # Try rolling the same number if allowed
                    if k < rollMax[last]:
                        new_dp[last][k + 1] = (new_dp[last][k + 1] + dp[last][k]) % MOD

            dp = new_dp

        # Sum all valid sequences of length n
        total = 0
        for j in range(6):
            for k in range(1, rollMax[j] + 1):
                total = (total + dp[j][k]) % MOD

        return total
```

```javascript
// Time: O(n * 6 * 6 * maxRoll) ≈ O(n * 216)
// Space: O(6 * maxRoll) = O(90) ≈ O(1) constant space
/**
 * @param {number} n
 * @param {number[]} rollMax
 * @return {number}
 */
var dieSimulator = function (n, rollMax) {
  const MOD = 10 ** 9 + 7;

  // dp[last][k] = number of sequences ending with 'last' having 'k' consecutive 'last's
  // Initialize for first roll
  let dp = Array(6)
    .fill()
    .map(() => Array(16).fill(0));
  for (let j = 0; j < 6; j++) {
    dp[j][1] = 1;
  }

  // Process each additional roll
  for (let i = 2; i <= n; i++) {
    // Create new dp for current roll
    let newDp = Array(6)
      .fill()
      .map(() => Array(16).fill(0));

    // For each possible last number in previous roll
    for (let last = 0; last < 6; last++) {
      // For each possible consecutive count
      for (let k = 1; k <= rollMax[last]; k++) {
        if (dp[last][k] === 0) continue;

        // Try rolling a different number
        for (let newNum = 0; newNum < 6; newNum++) {
          if (newNum !== last) {
            // Reset consecutive count to 1 for new number
            newDp[newNum][1] = (newDp[newNum][1] + dp[last][k]) % MOD;
          }
        }

        // Try rolling the same number if allowed
        if (k < rollMax[last]) {
          newDp[last][k + 1] = (newDp[last][k + 1] + dp[last][k]) % MOD;
        }
      }
    }

    dp = newDp;
  }

  // Sum all valid sequences of length n
  let total = 0;
  for (let j = 0; j < 6; j++) {
    for (let k = 1; k <= rollMax[j]; k++) {
      total = (total + dp[j][k]) % MOD;
    }
  }

  return total;
};
```

```java
// Time: O(n * 6 * 6 * maxRoll) ≈ O(n * 216)
// Space: O(6 * maxRoll) = O(90) ≈ O(1) constant space
class Solution {
    public int dieSimulator(int n, int[] rollMax) {
        final int MOD = 1000000007;

        // dp[last][k] = number of sequences ending with 'last' having 'k' consecutive 'last's
        // rollMax[i] ≤ 15, so we need up to 15 consecutive counts
        int[][] dp = new int[6][16];

        // Initialize for first roll: 1 way for each number with consecutive count 1
        for (int j = 0; j < 6; j++) {
            dp[j][1] = 1;
        }

        // Process each additional roll
        for (int i = 2; i <= n; i++) {
            // Create new dp for current roll
            int[][] newDp = new int[6][16];

            // For each possible last number in previous roll
            for (int last = 0; last < 6; last++) {
                // For each possible consecutive count
                for (int k = 1; k <= rollMax[last]; k++) {
                    if (dp[last][k] == 0) continue;

                    // Try rolling a different number
                    for (int newNum = 0; newNum < 6; newNum++) {
                        if (newNum != last) {
                            // Reset consecutive count to 1 for new number
                            newDp[newNum][1] = (newDp[newNum][1] + dp[last][k]) % MOD;
                        }
                    }

                    // Try rolling the same number if allowed
                    if (k < rollMax[last]) {
                        newDp[last][k + 1] = (newDp[last][k + 1] + dp[last][k]) % MOD;
                    }
                }
            }

            dp = newDp;
        }

        // Sum all valid sequences of length n
        int total = 0;
        for (int j = 0; j < 6; j++) {
            for (int k = 1; k <= rollMax[j]; k++) {
                total = (total + dp[j][k]) % MOD;
            }
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × 6 × 6 × maxRoll)

- We iterate through `n` rolls
- For each roll, we iterate through 6 possible last numbers
- For each last number, we iterate through up to `rollMax[last]` consecutive counts (≤ 15)
- For each state, we iterate through 6 possible next numbers
- In practice: O(n × 6 × 6 × 15) = O(540n) ≈ O(n)

**Space Complexity:** O(6 × maxRoll) = O(90) ≈ O(1)

- We only store two 2D arrays (current and previous)
- Each has 6 × 16 = 96 elements (16 because rollMax[i] ≤ 15)
- This is constant space regardless of `n`

## Common Mistakes

1. **Forgetting to reset consecutive count when rolling a different number**: When switching to a new number, the consecutive count should be 1, not continue from the previous number's count.

2. **Not using modulo operations correctly**: The result can be huge (6^5000), so we need modulo operations at every addition. Waiting until the end to apply modulo will cause integer overflow.

3. **Incorrect array bounds for consecutive count**: `rollMax[i]` is the maximum allowed consecutive rolls, so valid counts are 1 to `rollMax[i]`. Using `rollMax[i]` as an inclusive upper bound is correct.

4. **Confusing 0-indexed vs 1-indexed**: The problem states `rollMax` is 1-indexed for die values 1-6, but in code we use 0-indexed arrays. Remember: die value `i` corresponds to `rollMax[i-1]`.

## When You'll See This Pattern

This type of "stateful" dynamic programming appears in problems where you need to track additional information beyond just position:

1. **Number of Distinct Roll Sequences (LeetCode 2318)**: Similar dice rolling problem with different constraints (can't roll same number consecutively AND numbers with GCD > 1 can't be adjacent).

2. **Student Attendance Record II (LeetCode 552)**: Count attendance records where 'A' appears at most once and 'L' never appears 3+ times consecutively. Similar state tracking of consecutive counts.

3. **Decode Ways II (LeetCode 639)**: Counting ways to decode a string with wildcards, needing to track previous character(s) to determine valid decodings.

The pattern is: when a problem involves counting sequences/strings with constraints on consecutive elements, consider DP states that include information about the last element and how many times it has appeared.

## Key Takeaways

1. **Track consecutive counts in DP states**: When constraints involve consecutive repetitions, include the count of consecutive occurrences as part of your DP state.

2. **Optimize space with rolling arrays**: When DP transitions only depend on the previous state, use two arrays (current and previous) instead of a full n-sized array.

3. **Break transitions into cases**: Separate logic for "same element" (continue streak) vs "different element" (reset streak) transitions. This makes the logic clearer and easier to debug.

Related problems: [Find Missing Observations](/problem/find-missing-observations), [Number of Distinct Roll Sequences](/problem/number-of-distinct-roll-sequences)
