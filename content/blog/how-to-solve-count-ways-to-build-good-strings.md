---
title: "How to Solve Count Ways To Build Good Strings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Ways To Build Good Strings. Medium difficulty, 59.0% acceptance rate. Topics: Dynamic Programming."
date: "2026-04-17"
category: "dsa-patterns"
tags: ["count-ways-to-build-good-strings", "dynamic-programming", "medium"]
---

# How to Solve Count Ways To Build Good Strings

This problem asks us to count how many different "good strings" we can build where a good string has length between `low` and `high` inclusive. At each construction step, we can either append `'0'` exactly `zero` times or `'1'` exactly `one` times. The challenge is that we need to count ALL possible construction sequences that result in valid lengths, not just count distinct strings.

What makes this problem interesting is that it's essentially a **dynamic programming counting problem** disguised as a string construction problem. The key insight is that we don't actually care about the string content itself - we only care about the lengths we can achieve and how many ways we can reach each length.

## Visual Walkthrough

Let's trace through a concrete example: `zero = 1`, `one = 2`, `low = 3`, `high = 5`

We start with an empty string (length 0). At each step, we can:

- Add 1 character (append '0' once)
- Add 2 characters (append '1' twice)

We want to count all construction sequences that result in lengths between 3 and 5.

**Step-by-step construction:**

1. Start: length 0 (1 way to be at length 0)
2. From length 0:
   - Add 1 → length 1 (1 way)
   - Add 2 → length 2 (1 way)
3. From length 1:
   - Add 1 → length 2 (now total 2 ways to reach length 2)
   - Add 2 → length 3 (1 way)
4. From length 2 (which has 2 ways to reach it):
   - Add 1 → length 3 (adds 2 more ways, total 3 ways to reach length 3)
   - Add 2 → length 4 (adds 2 ways)
5. From length 3:
   - Add 1 → length 4 (adds 3 ways, total 5 ways to reach length 4)
   - Add 2 → length 5 (adds 3 ways)
6. From length 4:
   - Add 1 → length 5 (adds 5 ways, total 8 ways to reach length 5)
   - Add 2 → length 6 (ignore, exceeds high)

Now we sum all ways to reach lengths 3-5:

- Length 3: 3 ways
- Length 4: 5 ways
- Length 5: 8 ways
  Total: 3 + 5 + 8 = 16 good strings

## Brute Force Approach

A naive approach would be to actually generate all possible construction sequences using recursion/backtracking. We'd start with an empty string and recursively try both operations (append `zero` zeros or append `one` ones) until we exceed `high`, then count sequences that ended with lengths between `low` and `high`.

The problem with this approach is **exponential time complexity**. Each step branches into 2 possibilities, and we could have up to `high` steps, resulting in O(2^high) time complexity. For `high` up to 10^5 (as in the problem constraints), this is completely infeasible.

Even if we memoize based on current length, we still need to consider all possible sequences, which grows too quickly. The brute force teaches us that we need a way to count without enumerating all sequences.

## Optimized Approach

The key insight is that **this is exactly like the "Climbing Stairs" problem**, but with variable step sizes (`zero` and `one` instead of 1 and 2).

We can use dynamic programming where `dp[i]` represents the number of ways to build a string of length `i`. The recurrence relation is:

```
dp[i] = dp[i - zero] + dp[i - one]  (if i >= zero and i >= one respectively)
```

Why does this work?

1. To reach length `i`, our last operation must have been either:
   - Append `zero` zeros: we came from length `i - zero`
   - Append `one` ones: we came from length `i - one`
2. The number of ways to reach `i` is the sum of ways to reach these two previous lengths
3. We initialize `dp[0] = 1` because there's exactly 1 way to have an empty string

We compute `dp` for all lengths from 1 to `high`, then sum `dp[low]` through `dp[high]`. This gives us the total count of good strings.

## Optimal Solution

Here's the complete solution using dynamic programming:

<div class="code-group">

```python
# Time: O(high) | Space: O(high)
def countGoodStrings(self, low: int, high: int, zero: int, one: int) -> int:
    MOD = 10**9 + 7  # Required by problem to avoid integer overflow

    # dp[i] = number of ways to build a string of length i
    dp = [0] * (high + 1)

    # Base case: 1 way to build empty string
    dp[0] = 1

    # Fill dp array from 1 to high
    for i in range(1, high + 1):
        # If we can append 'zero' zeros to reach length i
        if i >= zero:
            dp[i] = (dp[i] + dp[i - zero]) % MOD

        # If we can append 'one' ones to reach length i
        if i >= one:
            dp[i] = (dp[i] + dp[i - one]) % MOD

    # Sum all ways to build strings with lengths between low and high
    total = 0
    for length in range(low, high + 1):
        total = (total + dp[length]) % MOD

    return total
```

```javascript
// Time: O(high) | Space: O(high)
var countGoodStrings = function (low, high, zero, one) {
  const MOD = 10 ** 9 + 7; // Required by problem to avoid integer overflow

  // dp[i] = number of ways to build a string of length i
  const dp = new Array(high + 1).fill(0);

  // Base case: 1 way to build empty string
  dp[0] = 1;

  // Fill dp array from 1 to high
  for (let i = 1; i <= high; i++) {
    // If we can append 'zero' zeros to reach length i
    if (i >= zero) {
      dp[i] = (dp[i] + dp[i - zero]) % MOD;
    }

    // If we can append 'one' ones to reach length i
    if (i >= one) {
      dp[i] = (dp[i] + dp[i - one]) % MOD;
    }
  }

  // Sum all ways to build strings with lengths between low and high
  let total = 0;
  for (let length = low; length <= high; length++) {
    total = (total + dp[length]) % MOD;
  }

  return total;
};
```

```java
// Time: O(high) | Space: O(high)
class Solution {
    public int countGoodStrings(int low, int high, int zero, int one) {
        final int MOD = 1_000_000_007;  // Required by problem to avoid integer overflow

        // dp[i] = number of ways to build a string of length i
        int[] dp = new int[high + 1];

        // Base case: 1 way to build empty string
        dp[0] = 1;

        // Fill dp array from 1 to high
        for (int i = 1; i <= high; i++) {
            // If we can append 'zero' zeros to reach length i
            if (i >= zero) {
                dp[i] = (dp[i] + dp[i - zero]) % MOD;
            }

            // If we can append 'one' ones to reach length i
            if (i >= one) {
                dp[i] = (dp[i] + dp[i - one]) % MOD;
            }
        }

        // Sum all ways to build strings with lengths between low and high
        int total = 0;
        for (int length = low; length <= high; length++) {
            total = (total + dp[length]) % MOD;
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(high)**

- We iterate through all lengths from 1 to `high` exactly once
- Each iteration performs constant time operations (two conditional checks and additions)
- The final summation from `low` to `high` is also O(high)

**Space Complexity: O(high)**

- We maintain a DP array of size `high + 1`
- We could optimize to O(max(zero, one)) by only keeping the last `max(zero, one)` values, but the current solution is clear and within constraints

## Common Mistakes

1. **Forgetting the modulo operation**: The problem states the answer should be returned modulo 10^9+7. Without this, intermediate values can overflow even 64-bit integers for large inputs.

2. **Incorrect base case**: Some candidates start with `dp[0] = 0`, but there's exactly 1 way to have an empty string (do nothing). This is crucial for the recurrence to work correctly.

3. **Off-by-one errors in array indexing**: Since we need `dp[high]`, we must allocate `high + 1` elements. Also, when checking `i >= zero` and `i >= one`, we need to ensure we don't access negative indices.

4. **Double-counting when zero == one**: When `zero` and `one` are equal, both conditions in the loop will be true for the same `i`. This is correct - we're counting two different operations (appending zeros vs ones) even if they add the same number of characters.

## When You'll See This Pattern

This "ways to reach a target" pattern appears in many counting problems:

1. **Climbing Stairs (LeetCode 70)**: Exactly the same structure but with fixed step sizes of 1 and 2.

2. **Coin Change (LeetCode 322)**: Similar DP structure for minimum coins, though that's an optimization problem rather than counting.

3. **Decode Ways (LeetCode 91)**: Counting ways to decode a string, where each digit or pair of digits maps to a letter.

4. **Combination Sum IV (LeetCode 377)**: Counting combinations that sum to target with different numbers.

The pattern to recognize: when you need to count the number of ways to reach a target/state, and you can get there from a fixed set of previous states, dynamic programming is usually the solution.

## Key Takeaways

1. **Think in terms of states and transitions**: Instead of tracking the actual strings, we only need to track lengths and counts. This reduction is key to efficient solutions.

2. **Recognize the "Climbing Stairs" family**: Any problem where you count ways to reach a target using steps of fixed sizes is essentially a variation of the climbing stairs problem.

3. **DP for counting problems**: When asked "how many ways" and the problem has optimal substructure (solutions can be built from smaller solutions), dynamic programming is often the right approach.

Related problems: [Climbing Stairs](/problem/climbing-stairs)
