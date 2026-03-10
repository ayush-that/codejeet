---
title: "How to Solve Count Number of Ways to Place Houses — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Number of Ways to Place Houses. Medium difficulty, 43.8% acceptance rate. Topics: Dynamic Programming."
date: "2029-01-19"
category: "dsa-patterns"
tags: ["count-number-of-ways-to-place-houses", "dynamic-programming", "medium"]
---

# How to Solve Count Number of Ways to Place Houses

This problem asks us to count the number of valid ways to place houses on a street with `n` plots on each side (2n total plots), where houses cannot be adjacent on the same side. The tricky part is that the two sides are independent — houses on opposite sides don't affect each other — but we need to combine their counts correctly. This independence is the key insight that transforms what seems like a complex 2D problem into a simpler 1D problem.

## Visual Walkthrough

Let's trace through a small example with `n = 3`. We have 3 plots on each side:

```
Side 1: [P1, P2, P3]
Side 2: [P1, P2, P3]
```

We need to count valid placements where no two houses are adjacent on the same side. Let's first solve for **one side only**:

For 1 plot (n=1): We can either place a house (1 way) or leave it empty (1 way) → 2 ways total.

For 2 plots (n=2):

- No houses: 1 way
- House on first plot only: 1 way
- House on second plot only: 1 way
- Houses on both plots: NOT allowed (adjacent)
  Total: 3 ways

For 3 plots (n=3):

- No houses: 1 way
- House on plot 1 only: 1 way
- House on plot 2 only: 1 way
- House on plot 3 only: 1 way
- Houses on plots 1 and 3: 1 way (not adjacent)
- Houses on plots 1 and 2: NOT allowed
- Houses on plots 2 and 3: NOT allowed
- All three houses: NOT allowed
  Total: 5 ways

Notice the pattern? For one side with n plots, the number of valid arrangements follows the Fibonacci sequence: 2, 3, 5... (starting from n=1).

Now, since the two sides are independent, the total arrangements for both sides is simply (ways_for_one_side)². For n=3: 5² = 25 total ways.

## Brute Force Approach

A naive approach would try to enumerate all possible placements across both sides and check adjacency constraints. For each of the 2n plots, we could either place a house (1) or not (0), giving 2^(2n) possible configurations. For each configuration, we'd need to check all adjacent pairs on each side to ensure no two adjacent houses exist.

This brute force solution would have O(2^(2n) \* n) time complexity, which is exponential and completely impractical for even moderate n (like n=20 would mean checking over a trillion configurations).

What makes this approach fail is that it doesn't leverage the independence between sides or the recurrence relation we observed in the visual walkthrough. We're doing unnecessary work by treating both sides together when they don't interact.

## Optimized Approach

The key insight is that **the two sides are independent** — houses on opposite sides don't affect each other. Therefore:

1. First, calculate the number of valid arrangements for **one side** with n plots
2. Since arrangements on both sides are independent, total arrangements = (arrangements_for_one_side)²

Now, how do we calculate arrangements for one side? This is where dynamic programming shines. Let's define:

- `dp[i]` = number of ways to arrange houses on i plots

For the i-th plot, we have two choices:

1. **Don't place a house** on plot i: Then we can use any valid arrangement for the first i-1 plots → `dp[i-1]` ways
2. **Place a house** on plot i: Then we CANNOT place a house on plot i-1, so we need valid arrangements for the first i-2 plots → `dp[i-2]` ways

Thus, `dp[i] = dp[i-1] + dp[i-2]` — the Fibonacci recurrence!

Base cases:

- `dp[0] = 1` (empty arrangement, no plots)
- `dp[1] = 2` (either place a house or don't on 1 plot)

Wait, but our visual walkthrough showed 2, 3, 5... not 1, 2, 3, 5. That's because we need to be careful with indexing. If we want `dp[n]` to represent arrangements for n plots, we should use:

- `dp[0] = 1` (no plots, 1 way: do nothing)
- `dp[1] = 2` (1 plot, 2 ways: house or no house)
- `dp[i] = dp[i-1] + dp[i-2]` for i ≥ 2

Then `dp[n]` gives us arrangements for one side, and total = `dp[n]²`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countHousePlacements(self, n: int) -> int:
    """
    Counts the number of ways to place houses on both sides of a street
    with n plots on each side, with no two houses adjacent on the same side.

    The key insight: The two sides are independent, so we can:
    1. Calculate ways for one side using Fibonacci-like DP
    2. Square the result (since sides are independent)
    """
    MOD = 10**9 + 7  # Required by problem to prevent overflow

    # Base cases for Fibonacci sequence starting at n=0
    # dp0: ways for i-2 plots, dp1: ways for i-1 plots
    if n == 0:
        return 1  # Only empty arrangement

    # Initialize for n=1: dp[0]=1, dp[1]=2
    dp0, dp1 = 1, 2

    # Compute Fibonacci-like sequence: dp[i] = dp[i-1] + dp[i-2]
    for i in range(2, n + 1):
        # Current ways = ways without house (dp1) + ways with house (dp0)
        current = (dp0 + dp1) % MOD

        # Shift for next iteration: dp0 becomes old dp1, dp1 becomes current
        dp0, dp1 = dp1, current

    # dp1 now contains ways for one side with n plots
    # Total ways = (ways for one side)² since sides are independent
    return (dp1 * dp1) % MOD
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Counts the number of ways to place houses on both sides of a street
 * with n plots on each side, with no two houses adjacent on the same side.
 *
 * The key insight: The two sides are independent, so we can:
 * 1. Calculate ways for one side using Fibonacci-like DP
 * 2. Square the result (since sides are independent)
 */
function countHousePlacements(n) {
  const MOD = 10 ** 9 + 7; // Required by problem to prevent overflow

  // Base cases for Fibonacci sequence starting at n=0
  // dp0: ways for i-2 plots, dp1: ways for i-1 plots
  if (n === 0) return 1; // Only empty arrangement

  // Initialize for n=1: dp[0]=1, dp[1]=2
  let dp0 = 1,
    dp1 = 2;

  // Compute Fibonacci-like sequence: dp[i] = dp[i-1] + dp[i-2]
  for (let i = 2; i <= n; i++) {
    // Current ways = ways without house (dp1) + ways with house (dp0)
    const current = (dp0 + dp1) % MOD;

    // Shift for next iteration: dp0 becomes old dp1, dp1 becomes current
    dp0 = dp1;
    dp1 = current;
  }

  // dp1 now contains ways for one side with n plots
  // Total ways = (ways for one side)² since sides are independent
  return (dp1 * dp1) % MOD;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Counts the number of ways to place houses on both sides of a street
     * with n plots on each side, with no two houses adjacent on the same side.
     *
     * The key insight: The two sides are independent, so we can:
     * 1. Calculate ways for one side using Fibonacci-like DP
     * 2. Square the result (since sides are independent)
     */
    public int countHousePlacements(int n) {
        final int MOD = 1_000_000_007;  // Required by problem to prevent overflow

        // Base cases for Fibonacci sequence starting at n=0
        // dp0: ways for i-2 plots, dp1: ways for i-1 plots
        if (n == 0) return 1;  // Only empty arrangement

        // Initialize for n=1: dp[0]=1, dp[1]=2
        long dp0 = 1, dp1 = 2;  // Use long to prevent overflow before mod

        // Compute Fibonacci-like sequence: dp[i] = dp[i-1] + dp[i-2]
        for (int i = 2; i <= n; i++) {
            // Current ways = ways without house (dp1) + ways with house (dp0)
            long current = (dp0 + dp1) % MOD;

            // Shift for next iteration: dp0 becomes old dp1, dp1 becomes current
            dp0 = dp1;
            dp1 = current;
        }

        // dp1 now contains ways for one side with n plots
        // Total ways = (ways for one side)² since sides are independent
        return (int)((dp1 * dp1) % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate from 2 to n once, performing constant-time operations in each iteration
- The loop runs n-1 times for n ≥ 2, giving linear time complexity

**Space Complexity: O(1)**

- We only store two variables (`dp0` and `dp1`) regardless of n
- This is the optimized space version of dynamic programming (like Fibonacci)

## Common Mistakes

1. **Forgetting to square the result**: Some candidates correctly compute arrangements for one side but forget that both sides are independent and need to multiply (or square) the results. Remember: total = (ways_for_one_side)².

2. **Incorrect base cases**: Using `dp[1] = 1` instead of `dp[1] = 2` (for 1 plot, you can either place a house or not). Always test with n=1: there should be 4 total arrangements (2² = 4).

3. **Not using modulo correctly**: The problem requires results modulo 10^9+7. Candidates often:
   - Forget to apply modulo after each addition to prevent overflow
   - Apply modulo only at the end, which can cause overflow in intermediate calculations
   - Forget to apply modulo to the final multiplication (squaring)

4. **Overcomplicating with 2D DP**: Some candidates try to model both sides together with a 2D DP, which is unnecessary since the sides are independent. This adds complexity without benefit.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Fibonacci/Climbing Stairs Pattern**: The recurrence `dp[i] = dp[i-1] + dp[i-2]` appears in:
   - [Climbing Stairs](/problem/climbing-stairs): Ways to climb n steps taking 1 or 2 steps
   - [Decode Ways](/problem/decode-ways): Ways to decode a string of digits
   - [Fibonacci Number](/problem/fibonacci-number): The classic sequence itself

2. **Independent Subproblems Pattern**: When a problem can be broken into independent parts:
   - [House Robber](/problem/house-robber): Houses are in a line, but this is different — here we have two independent lines
   - [Unique Paths II](/problem/unique-paths-ii): With obstacles, but the grid traversal has dependencies

The key is recognizing when subproblems don't interact — here, the two sides of the street are completely independent, so we solve one and square it.

## Key Takeaways

1. **Look for independence**: When a problem has independent components, solve each separately and combine results. Here, the two sides of the street don't interact, so `total = (ways_per_side)²`.

2. **Fibonacci appears in arrangement problems**: When you have binary choices (place/don't place) with adjacency constraints, you often get `dp[i] = dp[i-1] + dp[i-2]`. This is because placing at position i forces specific constraints on position i-1.

3. **Optimize DP space**: For linear recurrences like Fibonacci, you only need to keep the last two values, reducing space from O(n) to O(1).

Related problems: [Climbing Stairs](/problem/climbing-stairs), [House Robber](/problem/house-robber)
