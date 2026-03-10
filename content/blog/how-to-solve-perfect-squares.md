---
title: "How to Solve Perfect Squares — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Perfect Squares. Medium difficulty, 56.3% acceptance rate. Topics: Math, Dynamic Programming, Breadth-First Search."
date: "2026-10-08"
category: "dsa-patterns"
tags: ["perfect-squares", "math", "dynamic-programming", "breadth-first-search", "medium"]
---

# How to Solve Perfect Squares

Given an integer `n`, we need to find the smallest number of perfect square numbers (like 1, 4, 9, 16, etc.) that sum to exactly `n`. This problem is interesting because it combines number theory with dynamic programming and graph search techniques. The challenge lies in finding an efficient way to break down `n` into the minimum number of perfect squares, which isn't as straightforward as it might initially seem.

## Visual Walkthrough

Let's trace through `n = 12` step by step to build intuition:

**Perfect squares ≤ 12:** 1, 4, 9

We want to find the minimum number of these that sum to 12:

- **Option 1:** 9 + 1 + 1 + 1 = 12 (4 squares)
- **Option 2:** 4 + 4 + 4 = 12 (3 squares)
- **Option 3:** 4 + 4 + 1 + 1 + 1 + 1 = 12 (6 squares)
- **Option 4:** 1 repeated 12 times (12 squares)

The minimum is clearly 3 squares (4 + 4 + 4).

But how do we systematically find this minimum? Think of it as building up from 0:

- To reach 1, we need 1 square (1)
- To reach 2, we need 2 squares (1 + 1)
- To reach 3, we need 3 squares (1 + 1 + 1)
- To reach 4, we need 1 square (4) - this is better than 1+1+1+1
- To reach 5, we can use 4 + 1 = 2 squares
- To reach 8, we can use 4 + 4 = 2 squares
- To reach 12, we can check all perfect squares ≤ 12:
  - Using 9: We need 1 + dp[12-9] = 1 + dp[3] = 1 + 3 = 4 squares
  - Using 4: We need 1 + dp[12-4] = 1 + dp[8] = 1 + 2 = 3 squares
  - Using 1: We need 1 + dp[12-1] = 1 + dp[11] = 1 + 3 = 4 squares
  - Minimum is 3 squares

This "building up" approach is the key to our solution.

## Brute Force Approach

A naive brute force approach would try all possible combinations of perfect squares that sum to `n`. For each number `n`, we could generate all perfect squares ≤ `n`, then recursively try subtracting each square and solving the subproblem.

The recursive relation would be:

```
numSquares(n) = 1 + min(numSquares(n - s)) for all perfect squares s ≤ n
```

With base cases:

- `numSquares(0) = 0` (0 needs 0 squares)
- `numSquares(1) = 1` (1 is a perfect square)

However, this approach has exponential time complexity. For `n = 12`, the recursion tree would explore many redundant subproblems (like computing `numSquares(3)` multiple times). For larger `n`, this becomes completely impractical.

## Optimized Approach

The key insight is that we can use **dynamic programming** to avoid redundant computations. We can build a DP array where `dp[i]` represents the minimum number of perfect squares that sum to `i`.

**Step-by-step reasoning:**

1. Initialize `dp[0] = 0` (0 requires 0 squares)
2. For each number `i` from 1 to `n`:
   - Start with a worst-case value: `dp[i] = i` (using all 1's)
   - For each perfect square `s ≤ i`:
     - Check if using square `s` gives us a better solution: `dp[i] = min(dp[i], 1 + dp[i - s])`
3. Return `dp[n]`

This works because to form `i`, we can take any perfect square `s ≤ i` and then solve the subproblem for `i - s`. We want the minimum over all possible choices of `s`.

**Alternative perspective:** This problem can also be solved using **BFS** where we treat numbers as nodes and edges represent subtracting perfect squares. Starting from node `n`, we subtract perfect squares to reach new nodes. The first time we reach 0, we've found the shortest path (minimum number of squares).

## Optimal Solution

Here's the dynamic programming solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * sqrt(n)) | Space: O(n)
def numSquares(n):
    """
    Returns the least number of perfect square numbers that sum to n.

    Approach: Dynamic Programming
    - dp[i] = minimum number of perfect squares that sum to i
    - For each i, try all perfect squares j*j ≤ i
    - dp[i] = min(dp[i], 1 + dp[i - j*j])
    """
    # Initialize dp array with worst-case values
    # Worst case: using all 1's, so dp[i] = i initially
    dp = [float('inf')] * (n + 1)

    # Base case: 0 requires 0 perfect squares
    dp[0] = 0

    # Precompute all perfect squares up to n
    # We'll generate them on the fly in the inner loop instead

    # Fill dp array from 1 to n
    for i in range(1, n + 1):
        # Try all perfect squares ≤ i
        j = 1
        while j * j <= i:
            # If we use square j*j, then we need 1 + dp[i - j*j] squares
            dp[i] = min(dp[i], 1 + dp[i - j * j])
            j += 1

    return dp[n]
```

```javascript
// Time: O(n * sqrt(n)) | Space: O(n)
function numSquares(n) {
  /**
   * Returns the least number of perfect square numbers that sum to n.
   *
   * Approach: Dynamic Programming
   * - dp[i] = minimum number of perfect squares that sum to i
   * - For each i, try all perfect squares j*j ≤ i
   * - dp[i] = min(dp[i], 1 + dp[i - j*j])
   */

  // Initialize dp array with worst-case values
  // Using Infinity for uncomputed values
  const dp = new Array(n + 1).fill(Infinity);

  // Base case: 0 requires 0 perfect squares
  dp[0] = 0;

  // Fill dp array from 1 to n
  for (let i = 1; i <= n; i++) {
    // Try all perfect squares ≤ i
    for (let j = 1; j * j <= i; j++) {
      // If we use square j*j, then we need 1 + dp[i - j*j] squares
      dp[i] = Math.min(dp[i], 1 + dp[i - j * j]);
    }
  }

  return dp[n];
}
```

```java
// Time: O(n * sqrt(n)) | Space: O(n)
class Solution {
    public int numSquares(int n) {
        /**
         * Returns the least number of perfect square numbers that sum to n.
         *
         * Approach: Dynamic Programming
         * - dp[i] = minimum number of perfect squares that sum to i
         * - For each i, try all perfect squares j*j ≤ i
         * - dp[i] = min(dp[i], 1 + dp[i - j*j])
         */

        // Initialize dp array with worst-case values
        int[] dp = new int[n + 1];

        // Fill with maximum possible value initially
        for (int i = 0; i <= n; i++) {
            dp[i] = Integer.MAX_VALUE;
        }

        // Base case: 0 requires 0 perfect squares
        dp[0] = 0;

        // Fill dp array from 1 to n
        for (int i = 1; i <= n; i++) {
            // Try all perfect squares ≤ i
            for (int j = 1; j * j <= i; j++) {
                // If we use square j*j, then we need 1 + dp[i - j*j] squares
                // Check to avoid integer overflow
                if (dp[i - j * j] != Integer.MAX_VALUE) {
                    dp[i] = Math.min(dp[i], 1 + dp[i - j * j]);
                }
            }
        }

        return dp[n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n√n)

- We iterate through all numbers from 1 to `n` (O(n) iterations)
- For each number `i`, we iterate through all perfect squares ≤ `i`, which is at most √i iterations
- In the worst case, this gives us O(n√n) total operations

**Space Complexity:** O(n)

- We store a DP array of size `n+1`
- No other significant data structures are used

**Why not O(n²)?** Because the inner loop doesn't go up to `i`, it only goes up to √i. For `i = 100`, we only check j values up to 10, not up to 100.

## Common Mistakes

1. **Forgetting the base case `dp[0] = 0`**: This is crucial because when `i` equals a perfect square, we need `dp[0]` to compute `1 + dp[0] = 1`. Without it, the logic breaks.

2. **Initializing `dp[i]` incorrectly**: Some candidates initialize with 0, but we need a large value (like infinity or `i`) to ensure `min()` works correctly. If we start with 0, `min(0, anything)` will always be 0.

3. **Incorrect loop boundaries**: The inner loop should be `j * j <= i`, not `j <= i`. We only care about perfect squares, not all numbers up to `i`.

4. **Integer overflow in Java**: When using `Integer.MAX_VALUE`, adding 1 to it causes overflow. Always check if `dp[i - j*j]` is not `Integer.MAX_VALUE` before adding 1 to it.

## When You'll See This Pattern

This "minimum number of coins" pattern appears in many DP problems:

1. **Coin Change (LeetCode 322)**: Almost identical structure - find minimum coins to make amount `n` given coin denominations. Here, our "coins" are perfect squares.

2. **Minimum Cost For Tickets (LeetCode 983)**: Find minimum cost to travel for `n` days given different ticket durations and prices. The DP approach is similar.

3. **Decode Ways (LeetCode 91)**: Count number of ways to decode a string, where each step considers 1 or 2 characters. The "building up" DP approach is similar.

The pattern to recognize: When you need to find a minimum (or maximum) number of "steps" to reach a target, and each step has multiple options, dynamic programming with a bottom-up approach is often the solution.

## Key Takeaways

1. **Recognize the "unbounded knapsack" pattern**: This is essentially an unbounded knapsack problem where we have unlimited copies of each perfect square and want to minimize the count to reach target `n`.

2. **DP state definition is key**: Defining `dp[i]` as "minimum number of perfect squares summing to `i`" makes the recurrence relation natural: `dp[i] = min(1 + dp[i - s])` for all perfect squares `s ≤ i`.

3. **Start with brute force, then optimize**: The recursive brute force solution reveals the optimal substructure, which leads naturally to the DP solution with memoization or bottom-up tabulation.

**Related problems:** [Count Primes](/problem/count-primes), [Ugly Number II](/problem/ugly-number-ii), [Ways to Express an Integer as Sum of Powers](/problem/ways-to-express-an-integer-as-sum-of-powers)
