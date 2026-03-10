---
title: "How to Solve Find All Possible Stable Binary Arrays II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find All Possible Stable Binary Arrays II. Hard difficulty, 27.6% acceptance rate. Topics: Dynamic Programming, Prefix Sum."
date: "2026-09-08"
category: "dsa-patterns"
tags: ["find-all-possible-stable-binary-arrays-ii", "dynamic-programming", "prefix-sum", "hard"]
---

# How to Solve Find All Possible Stable Binary Arrays II

This problem asks us to count all binary arrays that contain exactly `zero` zeros and `one` ones, with the additional constraint that no subarray longer than `limit` can contain only the same digit. In other words, we can't have more than `limit` consecutive 0s or 1s in a row. The combination of exact counts and consecutive length restrictions makes this a challenging combinatorial dynamic programming problem.

What makes this problem particularly tricky is that we need to track two dimensions simultaneously: how many zeros and ones we've used so far, AND how many consecutive digits of the current type we have at the end of our sequence. This requires careful state design and efficient transitions.

## Visual Walkthrough

Let's walk through a small example: `zero = 2`, `one = 2`, `limit = 2`

We want to count all binary sequences with exactly 2 zeros and 2 ones, where we never have more than 2 consecutive identical digits.

Let's build sequences step by step:

**Valid sequences:**

- 0101 (alternating pattern, never exceeds 1 consecutive)
- 0110 (has "11" but that's exactly limit=2, not exceeding it)
- 1001 (has "00" exactly at limit)
- 1010 (alternating)
- 0011 (starts with "00" at limit, ends with "11" at limit)
- 1100 (starts with "11" at limit, ends with "00" at limit)

**Invalid sequences:**

- 0001... (can't even start with 3 zeros)
- 1110... (can't start with 3 ones)

Notice that at each step, we need to know:

1. How many zeros we've used so far
2. How many ones we've used so far
3. What the last digit is
4. How many consecutive of that digit we have at the end

For example, when building "001":

- Used zeros: 2, used ones: 1
- Last digit: 1
- Consecutive ones at end: 1 (just the single '1')

If we try to add another '1', we'd check: consecutive ones would become 2, which equals limit (2), so it's allowed.
If we try to add a third '1', consecutive ones would become 3, which exceeds limit, so it's NOT allowed.

This intuition leads us to dynamic programming where our state tracks these four pieces of information.

## Brute Force Approach

A naive approach would be to generate all possible binary sequences of length `zero + one` and check each one:

1. Count zeros and ones to ensure exact counts
2. Check every subarray to ensure no run exceeds `limit`

The brute force code would look something like this:

<div class="code-group">

```python
def brute_force(zero, one, limit):
    from itertools import product

    total = 0
    n = zero + one

    # Generate all binary sequences of length n
    for seq in product([0, 1], repeat=n):
        # Check exact counts
        if seq.count(0) != zero or seq.count(1) != one:
            continue

        # Check consecutive runs
        valid = True
        current_run = 1
        for i in range(1, n):
            if seq[i] == seq[i-1]:
                current_run += 1
                if current_run > limit:
                    valid = False
                    break
            else:
                current_run = 1

        if valid:
            total += 1

    return total
```

```javascript
function bruteForce(zero, one, limit) {
  const n = zero + one;
  let total = 0;

  // Generate all binary sequences
  const totalSequences = Math.pow(2, n);

  for (let mask = 0; mask < totalSequences; mask++) {
    // Check exact counts
    let zeroCount = 0;
    let oneCount = 0;
    let seq = [];

    for (let i = 0; i < n; i++) {
      const bit = (mask >> i) & 1;
      seq.push(bit);
      if (bit === 0) zeroCount++;
      else oneCount++;
    }

    if (zeroCount !== zero || oneCount !== one) continue;

    // Check consecutive runs
    let valid = true;
    let currentRun = 1;

    for (let i = 1; i < n; i++) {
      if (seq[i] === seq[i - 1]) {
        currentRun++;
        if (currentRun > limit) {
          valid = false;
          break;
        }
      } else {
        currentRun = 1;
      }
    }

    if (valid) total++;
  }

  return total;
}
```

```java
public int bruteForce(int zero, int one, int limit) {
    int n = zero + one;
    int total = 0;

    // Generate all binary sequences
    for (int mask = 0; mask < (1 << n); mask++) {
        // Check exact counts
        int zeroCount = 0;
        int oneCount = 0;
        int[] seq = new int[n];

        for (int i = 0; i < n; i++) {
            int bit = (mask >> i) & 1;
            seq[i] = bit;
            if (bit == 0) zeroCount++;
            else oneCount++;
        }

        if (zeroCount != zero || oneCount != one) continue;

        // Check consecutive runs
        boolean valid = true;
        int currentRun = 1;

        for (int i = 1; i < n; i++) {
            if (seq[i] == seq[i-1]) {
                currentRun++;
                if (currentRun > limit) {
                    valid = false;
                    break;
                }
            } else {
                currentRun = 1;
            }
        }

        if (valid) total++;
    }

    return total;
}
```

</div>

**Why this is too slow:**

- Time complexity: O(2^n × n) where n = zero + one
- For n = 1000 (typical constraint), 2^1000 is astronomically large
- We need a solution that scales polynomially, not exponentially

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with multiple states. We need to track:

1. How many zeros we've placed so far (`z`)
2. How many ones we've placed so far (`o`)
3. What the last digit was (`lastDigit`: 0 or 1)
4. How many consecutive of that digit we have at the end (`consecutive`)

Our DP state can be: `dp[z][o][lastDigit][consecutive]` = number of ways to build a sequence with `z` zeros, `o` ones, ending with `lastDigit` repeated `consecutive` times.

**Transitions:**

1. If we want to add another `lastDigit`:
   - We can only do this if `consecutive < limit`
   - New state: `dp[z+1][o][0][consecutive+1]` if adding 0
   - New state: `dp[z][o+1][1][consecutive+1]` if adding 1
2. If we want to add the opposite digit:
   - We always can do this (breaks the consecutive run)
   - New state: `dp[z+1][o][0][1]` if adding 0 (starting new run of zeros)
   - New state: `dp[z][o+1][1][1]` if adding 1 (starting new run of ones)

**Base case:** `dp[0][0][0][0] = 1` and `dp[0][0][1][0] = 1` (empty sequence, can start with either digit)

**Answer:** Sum of `dp[zero][one][0][c]` for all c ≤ limit + `dp[zero][one][1][c]` for all c ≤ limit

**Optimization:** We can reduce space by noticing we only need the current and previous layers for the zeros dimension, or use a 4D DP array. The consecutive dimension only goes up to `limit`, which is small (≤ 200).

## Optimal Solution

Here's the complete DP solution with careful state management:

<div class="code-group">

```python
# Time: O(zero * one * limit) | Space: O(zero * one * limit)
def numberOfStableArrays(self, zero: int, one: int, limit: int) -> int:
    MOD = 10**9 + 7

    # dp[z][o][last][consecutive]
    # z: zeros used so far (0 to zero)
    # o: ones used so far (0 to one)
    # last: last digit (0 for 0, 1 for 1)
    # consecutive: how many consecutive last digits at the end
    dp = [[[[0] * (limit + 1) for _ in range(2)] for _ in range(one + 1)] for _ in range(zero + 1)]

    # Base cases: empty sequence
    # We can think of empty sequence as ending with either digit with 0 consecutive
    dp[0][0][0][0] = 1  # empty sequence, last digit doesn't matter, we'll use this as starting point
    dp[0][0][1][0] = 1  # alternative representation

    for z in range(zero + 1):
        for o in range(one + 1):
            for last in range(2):  # 0 or 1
                for consecutive in range(limit + 1):
                    curr = dp[z][o][last][consecutive]
                    if curr == 0:
                        continue  # skip invalid states

                    # Try to add the same digit
                    if consecutive < limit:
                        if last == 0 and z < zero:
                            # Adding another 0
                            dp[z + 1][o][0][consecutive + 1] = (dp[z + 1][o][0][consecutive + 1] + curr) % MOD
                        elif last == 1 and o < one:
                            # Adding another 1
                            dp[z][o + 1][1][consecutive + 1] = (dp[z][o + 1][1][consecutive + 1] + curr) % MOD

                    # Try to add the opposite digit
                    if last == 0 and o < one:
                        # Currently ending with 0, adding 1 (starts new run of 1s)
                        dp[z][o + 1][1][1] = (dp[z][o + 1][1][1] + curr) % MOD
                    elif last == 1 and z < zero:
                        # Currently ending with 1, adding 0 (starts new run of 0s)
                        dp[z + 1][o][0][1] = (dp[z + 1][o][0][1] + curr) % MOD

    # Sum up all valid ending states with exactly zero zeros and one ones
    result = 0
    for last in range(2):
        for consecutive in range(1, limit + 1):
            result = (result + dp[zero][one][last][consecutive]) % MOD

    return result
```

```javascript
// Time: O(zero * one * limit) | Space: O(zero * one * limit)
function numberOfStableArrays(zero, one, limit) {
  const MOD = 1_000_000_007;

  // Create 4D DP array: dp[z][o][last][consecutive]
  const dp = new Array(zero + 1);
  for (let z = 0; z <= zero; z++) {
    dp[z] = new Array(one + 1);
    for (let o = 0; o <= one; o++) {
      dp[z][o] = new Array(2);
      for (let last = 0; last < 2; last++) {
        dp[z][o][last] = new Array(limit + 1).fill(0);
      }
    }
  }

  // Base cases
  dp[0][0][0][0] = 1;
  dp[0][0][1][0] = 1;

  for (let z = 0; z <= zero; z++) {
    for (let o = 0; o <= one; o++) {
      for (let last = 0; last < 2; last++) {
        for (let consecutive = 0; consecutive <= limit; consecutive++) {
          const curr = dp[z][o][last][consecutive];
          if (curr === 0) continue;

          // Add same digit if we haven't reached limit
          if (consecutive < limit) {
            if (last === 0 && z < zero) {
              // Add another 0
              dp[z + 1][o][0][consecutive + 1] = (dp[z + 1][o][0][consecutive + 1] + curr) % MOD;
            } else if (last === 1 && o < one) {
              // Add another 1
              dp[z][o + 1][1][consecutive + 1] = (dp[z][o + 1][1][consecutive + 1] + curr) % MOD;
            }
          }

          // Add opposite digit (always allowed, starts new run)
          if (last === 0 && o < one) {
            // Switch from 0 to 1
            dp[z][o + 1][1][1] = (dp[z][o + 1][1][1] + curr) % MOD;
          } else if (last === 1 && z < zero) {
            // Switch from 1 to 0
            dp[z + 1][o][0][1] = (dp[z + 1][o][0][1] + curr) % MOD;
          }
        }
      }
    }
  }

  // Sum all valid ending states
  let result = 0;
  for (let last = 0; last < 2; last++) {
    for (let consecutive = 1; consecutive <= limit; consecutive++) {
      result = (result + dp[zero][one][last][consecutive]) % MOD;
    }
  }

  return result;
}
```

```java
// Time: O(zero * one * limit) | Space: O(zero * one * limit)
public int numberOfStableArrays(int zero, int one, int limit) {
    final int MOD = 1_000_000_007;

    // dp[z][o][last][consecutive]
    int[][][][] dp = new int[zero + 1][one + 1][2][limit + 1];

    // Base cases
    dp[0][0][0][0] = 1;
    dp[0][0][1][0] = 1;

    for (int z = 0; z <= zero; z++) {
        for (int o = 0; o <= one; o++) {
            for (int last = 0; last < 2; last++) {
                for (int consecutive = 0; consecutive <= limit; consecutive++) {
                    int curr = dp[z][o][last][consecutive];
                    if (curr == 0) continue;

                    // Add same digit if under limit
                    if (consecutive < limit) {
                        if (last == 0 && z < zero) {
                            // Add another 0
                            dp[z + 1][o][0][consecutive + 1] =
                                (dp[z + 1][o][0][consecutive + 1] + curr) % MOD;
                        } else if (last == 1 && o < one) {
                            // Add another 1
                            dp[z][o + 1][1][consecutive + 1] =
                                (dp[z][o + 1][1][consecutive + 1] + curr) % MOD;
                        }
                    }

                    // Add opposite digit (starts new run)
                    if (last == 0 && o < one) {
                        // Switch from 0 to 1
                        dp[z][o + 1][1][1] = (dp[z][o + 1][1][1] + curr) % MOD;
                    } else if (last == 1 && z < zero) {
                        // Switch from 1 to 0
                        dp[z + 1][o][0][1] = (dp[z + 1][o][0][1] + curr) % MOD;
                    }
                }
            }
        }
    }

    // Sum all valid ending states
    int result = 0;
    for (int last = 0; last < 2; last++) {
        for (int consecutive = 1; consecutive <= limit; consecutive++) {
            result = (result + dp[zero][one][last][consecutive]) % MOD;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(zero × one × limit)

- We have four nested loops:
  - `z` from 0 to `zero` (zero + 1 iterations)
  - `o` from 0 to `one` (one + 1 iterations)
  - `last` has 2 iterations (0 or 1)
  - `consecutive` from 0 to `limit` (limit + 1 iterations)
- Inside each iteration, we do constant time operations
- Total: O(zero × one × limit × 2) = O(zero × one × limit)

**Space Complexity:** O(zero × one × limit)

- We store a 4D DP array of size (zero + 1) × (one + 1) × 2 × (limit + 1)
- This dominates the space usage
- Could be optimized to O(one × limit) using rolling arrays since we only need current and previous `z` values

## Common Mistakes

1. **Forgetting to handle the empty sequence case**: Many candidates start with dp[1][0][0][1] = 1 and dp[0][1][1][1] = 1, but miss that you can also start with the other digit. Using dp[0][0][0][0] = 1 and dp[0][0][1][0] = 1 as base cases handles this cleanly.

2. **Incorrect consecutive count handling**: When switching digits, the consecutive count should reset to 1 (not 0), because we're starting a new run of the new digit. A run of length 1 means "we have exactly one of this digit at the end."

3. **Missing the MOD operation in intermediate steps**: With large numbers, intermediate sums can overflow even 64-bit integers. Apply MOD after every addition, not just at the end.

4. **Including invalid consecutive=0 states in final answer**: In the final sum, we only want states where consecutive ≥ 1 (we actually have some digits). The consecutive=0 states represent the empty sequence, which shouldn't be counted if we have non-zero zero or one counts.

## When You'll See This Pattern

This type of "constrained sequence counting" problem with multiple dimensions appears in various forms:

1. **Count Ways to Build Good Strings** (LeetCode 2466): Count binary strings of certain length with constraints on consecutive digits. Similar DP state with last digit and consecutive count.

2. **Student Attendance Record II** (LeetCode 552): Count attendance records with constraints on consecutive 'A' and total 'A' count. Requires tracking multiple constraints simultaneously.

3. **Decode Ways II** (LeetCode 639): Counting ways to decode with wildcards, needing to track previous digit for valid two-digit combinations.

The pattern is: when you need to count sequences with constraints on counts of elements AND constraints on their arrangement (like consecutive limits), think about a DP state that tracks both the quantities used and some property of the ending segment.

## Key Takeaways

1. **Multi-dimensional DP for constrained counting**: When counting sequences with multiple constraints, design your DP state to track all relevant information needed to enforce constraints. Here we needed: zeros used, ones used, last digit, and consecutive count of last digit.

2. **Careful state transitions**: Think through all possible moves from each state. For this problem: adding same digit (if under limit) or adding opposite digit (always allowed, resets consecutive count).

3. **Parameter limits guide complexity**: The limit parameter (≤ 200) is small enough that we can afford to have it as a dimension. If it were larger (like ≤ 10^5), we'd need a more optimized approach using prefix sums.

Related problems: [Contiguous Array](/problem/contiguous-array), [Binary Subarrays With Sum](/problem/binary-subarrays-with-sum)
