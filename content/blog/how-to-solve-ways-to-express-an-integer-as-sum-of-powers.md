---
title: "How to Solve Ways to Express an Integer as Sum of Powers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Ways to Express an Integer as Sum of Powers. Medium difficulty, 49.9% acceptance rate. Topics: Dynamic Programming."
date: "2027-02-22"
category: "dsa-patterns"
tags: ["ways-to-express-an-integer-as-sum-of-powers", "dynamic-programming", "medium"]
---

# How to Solve Ways to Express an Integer as Sum of Powers

This problem asks us to count the number of ways a positive integer `n` can be expressed as the sum of unique positive integers each raised to the power `x`. For example, with `n = 10` and `x = 2`, we need to find all unique sets of integers where the sum of their squares equals 10. What makes this problem interesting is that we're dealing with **unique integers** in each set (no repeats allowed) and we need to count **sets**, not permutations. This is essentially a subset sum problem with a twist: the available numbers are all integers `i` where `i^x ≤ n`.

## Visual Walkthrough

Let's trace through `n = 10, x = 2` step by step to build intuition:

**Available numbers:** We can only use numbers whose square is ≤ 10:

- 1² = 1 ≤ 10 ✓
- 2² = 4 ≤ 10 ✓
- 3² = 9 ≤ 10 ✓
- 4² = 16 > 10 ✗

So our available numbers are [1, 2, 3] (but we're actually using their squares: 1, 4, 9).

**We need to find subsets of {1, 4, 9} that sum to 10:**

1. Start with empty set: sum = 0
2. Consider including 1: sum = 1, need 9 more
3. Consider including 4: sum = 5, need 5 more
4. Consider including 9: sum = 10 ✓ Found one way: {1, 9}
5. Backtrack and try other combinations...

Let's think systematically:

- {1, 4, 9} = 14 > 10 ✗
- {1, 4} = 5 < 10 ✗
- {1, 9} = 10 ✓
- {4, 9} = 13 > 10 ✗
- {9} = 9 < 10 ✗
- {4} = 4 < 10 ✗
- {1} = 1 < 10 ✗

So there's exactly **1 way**: using 1² + 3² = 1 + 9 = 10.

This is essentially a **subset sum counting problem** where we need to count subsets that sum to exactly `n`. The "unique integers" requirement means we can use each number at most once, which makes this a 0/1 knapsack style problem.

## Brute Force Approach

The brute force approach would be to generate all possible subsets of the available numbers and check if their sum equals `n`. For each number from 1 up to the maximum `i` where `i^x ≤ n`, we have two choices: include it or exclude it.

**Why this is too slow:**

- With `m` available numbers, there are 2^m possible subsets
- `m` can be up to `n^(1/x)`, which for `x=1` gives `m=n`, making 2^n subsets
- Even for `x=2`, `m=sqrt(n)`, which for `n=100` gives 2^10 = 1024 subsets (manageable), but for `n=10^4` gives 2^100 subsets (impossible)

The brute force doesn't scale because it explores all combinations without memoization, doing redundant work.

## Optimized Approach

The key insight is that this is a **dynamic programming (DP) counting problem** similar to the "subset sum" problem. We can use a DP array where `dp[s]` represents the number of ways to achieve sum `s` using the numbers we've considered so far.

**Step-by-step reasoning:**

1. **Determine available numbers:** Find all integers `i` such that `i^x ≤ n`. These are our candidate numbers.
2. **DP state definition:** Let `dp[s]` = number of ways to achieve sum `s` using a subset of the numbers we've processed so far.
3. **DP transition:** For each candidate number `num = i^x`, we update our DP array from right to left (to avoid reusing the same number multiple times, which ensures uniqueness):
   - For each sum `s` from `n` down to `num`:
     - `dp[s] += dp[s - num]` (ways to get sum `s` now includes ways to get `s-num` plus using `num`)
4. **Base case:** `dp[0] = 1` (one way to make sum 0: use no numbers)
5. **Answer:** `dp[n]` gives the total number of ways

The "right to left" update is crucial because it ensures each number is used at most once. If we updated left to right, we could use the same number multiple times.

## Optimal Solution

Here's the complete solution using dynamic programming:

<div class="code-group">

```python
# Time: O(n * m) where m = n^(1/x) | Space: O(n)
def numberOfWays(n, x):
    """
    Counts the number of ways to express n as sum of unique xth powers.

    Args:
        n: The target sum
        x: The power to raise each number to

    Returns:
        Number of ways to achieve the sum
    """
    MOD = 10**9 + 7

    # Step 1: Initialize DP array
    # dp[s] = number of ways to achieve sum s
    dp = [0] * (n + 1)
    dp[0] = 1  # Base case: one way to make sum 0 (use no numbers)

    # Step 2: Try each possible base number i
    # We go up to the largest i where i^x <= n
    i = 1
    while True:
        # Calculate i raised to power x
        power = i ** x

        # If i^x exceeds n, we can stop
        if power > n:
            break

        # Step 3: Update DP array from right to left
        # This ensures each number is used at most once (0/1 knapsack style)
        for s in range(n, power - 1, -1):
            # Number of ways to make sum s includes:
            # - Previous ways to make sum s (without using current power)
            # - Ways to make sum (s - power) plus using current power
            dp[s] = (dp[s] + dp[s - power]) % MOD

        i += 1

    # Step 4: The answer is the number of ways to make sum n
    return dp[n]
```

```javascript
// Time: O(n * m) where m = n^(1/x) | Space: O(n)
/**
 * Counts the number of ways to express n as sum of unique xth powers.
 * @param {number} n - The target sum
 * @param {number} x - The power to raise each number to
 * @return {number} Number of ways to achieve the sum
 */
function numberOfWays(n, x) {
  const MOD = 10 ** 9 + 7;

  // Step 1: Initialize DP array
  // dp[s] = number of ways to achieve sum s
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // Base case: one way to make sum 0 (use no numbers)

  // Step 2: Try each possible base number i
  // We go up to the largest i where i^x <= n
  let i = 1;
  while (true) {
    // Calculate i raised to power x
    const power = Math.pow(i, x);

    // If i^x exceeds n, we can stop
    if (power > n) {
      break;
    }

    // Step 3: Update DP array from right to left
    // This ensures each number is used at most once (0/1 knapsack style)
    for (let s = n; s >= power; s--) {
      // Number of ways to make sum s includes:
      // - Previous ways to make sum s (without using current power)
      // - Ways to make sum (s - power) plus using current power
      dp[s] = (dp[s] + dp[s - power]) % MOD;
    }

    i++;
  }

  // Step 4: The answer is the number of ways to make sum n
  return dp[n];
}
```

```java
// Time: O(n * m) where m = n^(1/x) | Space: O(n)
class Solution {
    public int numberOfWays(int n, int x) {
        final int MOD = 1_000_000_007;

        // Step 1: Initialize DP array
        // dp[s] = number of ways to achieve sum s
        int[] dp = new int[n + 1];
        dp[0] = 1;  // Base case: one way to make sum 0 (use no numbers)

        // Step 2: Try each possible base number i
        // We go up to the largest i where i^x <= n
        int i = 1;
        while (true) {
            // Calculate i raised to power x
            long power = (long) Math.pow(i, x);

            // If i^x exceeds n, we can stop
            if (power > n) {
                break;
            }

            int powInt = (int) power;

            // Step 3: Update DP array from right to left
            // This ensures each number is used at most once (0/1 knapsack style)
            for (int s = n; s >= powInt; s--) {
                // Number of ways to make sum s includes:
                // - Previous ways to make sum s (without using current power)
                // - Ways to make sum (s - power) plus using current power
                dp[s] = (dp[s] + dp[s - powInt]) % MOD;
            }

            i++;
        }

        // Step 4: The answer is the number of ways to make sum n
        return dp[n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m) where m = n^(1/x)

- We iterate through approximately m numbers (from 1 up to n^(1/x))
- For each number, we iterate through the DP array of size n
- In the worst case when x=1, m=n, giving O(n²) time
- When x=2, m=√n, giving O(n√n) time

**Space Complexity:** O(n)

- We use a DP array of size n+1
- No additional data structures scale with input size

## Common Mistakes

1. **Updating DP left-to-right instead of right-to-left:** This would allow reusing the same number multiple times, violating the "unique integers" requirement. Always update from `n` down to `power` for 0/1 knapsack problems.

2. **Forgetting the modulo operation:** The problem states the result can be very large, so we need to return it modulo 10^9+7. Candidates often calculate exact values which can overflow.

3. **Incorrect loop bounds:** When checking `if power > n`, some candidates use `>=` instead of `>`, which would incorrectly exclude cases where `i^x = n`. Also, in the inner loop, starting from `n-1` instead of `n` or going below `power` can cause off-by-one errors.

4. **Not handling large powers correctly:** When calculating `i^x`, integer overflow can occur for large values. In Java, using `Math.pow` returns a double, which we cast to long before comparing with n to avoid precision issues.

## When You'll See This Pattern

This "subset sum counting with unique elements" pattern appears in several classic DP problems:

1. **Coin Change II (LeetCode 518):** Count ways to make amount with coins (similar but coins can have unlimited supply, so update left-to-right instead).

2. **Target Sum (LeetCode 494):** Assign +/- to numbers to reach target - can be reduced to subset sum problem.

3. **Partition Equal Subset Sum (LeetCode 416):** Check if array can be partitioned into two equal sum subsets.

4. **Combination Sum IV (mentioned in similar problems):** Different because it counts permutations, not combinations/sets.

The key identifier is when you need to count ways to achieve a target using elements from a set with constraints on usage (at most once, at least once, etc.).

## Key Takeaways

1. **Recognize subset sum problems:** When you need to count combinations that sum to a target with limited usage of each element, think 0/1 knapsack DP.

2. **Direction matters in DP updates:** Right-to-left update ensures each element is used at most once; left-to-right allows reuse. This is the key difference between "unique" and "reusable" element problems.

3. **Build solution incrementally:** Start with what numbers are available, then use DP to count combinations. The "available numbers" step is often overlooked but crucial for efficiency.

Related problems: [Perfect Squares](/problem/perfect-squares), [Combination Sum IV](/problem/combination-sum-iv), [Target Sum](/problem/target-sum)
