---
title: "How to Solve Selling Pieces of Wood — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Selling Pieces of Wood. Hard difficulty, 52.7% acceptance rate. Topics: Array, Dynamic Programming, Memoization."
date: "2030-02-23"
category: "dsa-patterns"
tags: ["selling-pieces-of-wood", "array", "dynamic-programming", "memoization", "hard"]
---

# How to Solve "Selling Pieces of Wood"

You're given an `m × n` rectangular piece of wood and a list of prices for selling smaller rectangles of specific dimensions. You can cut the wood vertically or horizontally any number of times to maximize your profit. The challenge is that you can sell pieces of any size (not just from the price list), and you can further cut the pieces you obtain from cutting. This creates a complex optimization problem where the optimal solution for a large rectangle depends on optimal solutions for smaller rectangles.

What makes this problem tricky is the combinatorial explosion of possible cutting patterns. A naive approach would try all possible cuts, but that's computationally infeasible. The key insight is recognizing this as a **dynamic programming** problem where we can build up solutions for smaller rectangles to solve larger ones.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

- `m = 3` (height)
- `n = 5` (width)
- `prices = [[1, 4, 2], [2, 2, 3], [3, 5, 10]]`

We have a 3×5 piece of wood. The price list tells us:

- 1×4 rectangle sells for $2
- 2×2 rectangle sells for $3
- 3×5 rectangle sells for $10

**Step 1: Initialize our DP table**
We create a 4×6 table (0-indexed, so indices 0-3 for height, 0-5 for width):

```
dp[h][w] = maximum profit for h×w rectangle
dp[0][*] = 0 (no height)
dp[*][0] = 0 (no width)
```

**Step 2: Fill in direct sales from price list**

- `dp[1][4] = max(dp[1][4], 2) = 2`
- `dp[2][2] = max(dp[2][2], 3) = 3`
- `dp[3][5] = max(dp[3][5], 10) = 10`

**Step 3: Consider all possible cuts**
For each rectangle size (h,w), we try:

1. **Vertical cuts**: Cut at width k (1 ≤ k < w)
   - Left piece: h×k, Right piece: h×(w-k)
   - Profit = dp[h][k] + dp[h][w-k]
2. **Horizontal cuts**: Cut at height k (1 ≤ k < h)
   - Top piece: k×w, Bottom piece: (h-k)×w
   - Profit = dp[k][w] + dp[h-k][w]

For our 3×5 rectangle:

- Direct sale: $10 (from price list)
- Vertical cuts:
  - Cut at width 1: dp[3][1] + dp[3][4] = 0 + 0 = 0
  - Cut at width 2: dp[3][2] + dp[3][3] = 0 + 0 = 0
  - Cut at width 3: dp[3][3] + dp[3][2] = 0 + 0 = 0
  - Cut at width 4: dp[3][4] + dp[3][1] = 0 + 0 = 0
- Horizontal cuts:
  - Cut at height 1: dp[1][5] + dp[2][5] = 0 + 0 = 0
  - Cut at height 2: dp[2][5] + dp[1][5] = 0 + 0 = 0

Best for 3×5 is $10.

**Step 4: Build up to final answer**
We systematically fill dp from smallest to largest rectangles. The final answer is `dp[3][5] = 10`.

## Brute Force Approach

A naive brute force approach would try all possible ways to cut the wood. For an m×n rectangle:

1. Consider selling it directly if it's in the price list
2. Try all possible vertical cuts (n-1 positions)
3. Try all possible horizontal cuts (m-1 positions)
4. For each cut, recursively solve both pieces
5. Take the maximum of all options

The problem with this approach is the exponential time complexity. Each cut creates two subproblems, and we have to consider cuts at every possible position. For an m×n rectangle, there are O(2^(m+n)) possible cutting patterns, which is completely infeasible even for moderate m and n.

The brute force fails because it repeatedly solves the same subproblems. For example, when considering different cutting patterns for a large rectangle, we might need the optimal value for the same smaller rectangle multiple times.

## Optimized Approach

The key insight is that this problem exhibits **optimal substructure** and **overlapping subproblems** — the classic signs that dynamic programming is applicable.

**Optimal substructure**: The optimal profit for an h×w rectangle is the maximum of:

1. Selling it directly (if in price list)
2. The best vertical cut: max over all k (1 ≤ k < w) of dp[h][k] + dp[h][w-k]
3. The best horizontal cut: max over all k (1 ≤ k < h) of dp[k][w] + dp[h-k][w]

**Overlapping subproblems**: When computing dp for different rectangle sizes, we'll need the same smaller rectangle values many times.

We can solve this with a bottom-up DP approach:

1. Create a (m+1)×(n+1) DP table where dp[h][w] = max profit for h×w rectangle
2. Initialize with prices from the input (direct sales)
3. For each rectangle size from smallest to largest:
   - Check all possible vertical cuts
   - Check all possible horizontal cuts
   - Take the maximum of direct sale and all cuts
4. Return dp[m][n]

This approach runs in O(m²n + mn²) time, which is polynomial and efficient enough for the constraints.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m^2 * n + m * n^2) - We iterate through all rectangle sizes and check all cuts
# Space: O(m * n) - For the DP table
def sellingWood(m, n, prices):
    """
    Calculate maximum profit from cutting and selling an m x n piece of wood.

    Args:
        m: Height of the wood
        n: Width of the wood
        prices: List of [height, width, price] for direct sales

    Returns:
        Maximum profit achievable
    """
    # Step 1: Create DP table with dimensions (m+1) x (n+1)
    # dp[h][w] will store maximum profit for h x w rectangle
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Step 2: Initialize with direct prices from input
    # Convert prices to a dictionary-like structure for O(1) lookup
    for h, w, price in prices:
        if h <= m and w <= n:  # Only consider prices for sizes that fit
            dp[h][w] = max(dp[h][w], price)

    # Step 3: Fill DP table from smallest to largest rectangles
    for h in range(1, m + 1):
        for w in range(1, n + 1):
            # Option 1: Try all vertical cuts
            # Cut at width k, left piece: h x k, right piece: h x (w-k)
            for k in range(1, w):
                dp[h][w] = max(dp[h][w], dp[h][k] + dp[h][w - k])

            # Option 2: Try all horizontal cuts
            # Cut at height k, top piece: k x w, bottom piece: (h-k) x w
            for k in range(1, h):
                dp[h][w] = max(dp[h][w], dp[k][w] + dp[h - k][w])

    # Step 4: Return answer for full m x n rectangle
    return dp[m][n]
```

```javascript
// Time: O(m^2 * n + m * n^2) - We iterate through all rectangle sizes and check all cuts
// Space: O(m * n) - For the DP table
function sellingWood(m, n, prices) {
  /**
   * Calculate maximum profit from cutting and selling an m x n piece of wood.
   *
   * @param {number} m - Height of the wood
   * @param {number} n - Width of the wood
   * @param {number[][]} prices - Array of [height, width, price] for direct sales
   * @return {number} Maximum profit achievable
   */

  // Step 1: Create DP table with dimensions (m+1) x (n+1)
  // dp[h][w] will store maximum profit for h x w rectangle
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Step 2: Initialize with direct prices from input
  for (const [h, w, price] of prices) {
    if (h <= m && w <= n) {
      // Only consider prices for sizes that fit
      dp[h][w] = Math.max(dp[h][w], price);
    }
  }

  // Step 3: Fill DP table from smallest to largest rectangles
  for (let h = 1; h <= m; h++) {
    for (let w = 1; w <= n; w++) {
      // Option 1: Try all vertical cuts
      // Cut at width k, left piece: h x k, right piece: h x (w-k)
      for (let k = 1; k < w; k++) {
        dp[h][w] = Math.max(dp[h][w], dp[h][k] + dp[h][w - k]);
      }

      // Option 2: Try all horizontal cuts
      // Cut at height k, top piece: k x w, bottom piece: (h-k) x w
      for (let k = 1; k < h; k++) {
        dp[h][w] = Math.max(dp[h][w], dp[k][w] + dp[h - k][w]);
      }
    }
  }

  // Step 4: Return answer for full m x n rectangle
  return dp[m][n];
}
```

```java
// Time: O(m^2 * n + m * n^2) - We iterate through all rectangle sizes and check all cuts
// Space: O(m * n) - For the DP table
class Solution {
    public long sellingWood(int m, int n, int[][] prices) {
        /**
         * Calculate maximum profit from cutting and selling an m x n piece of wood.
         *
         * @param m Height of the wood
         * @param n Width of the wood
         * @param prices Array of [height, width, price] for direct sales
         * @return Maximum profit achievable
         */

        // Step 1: Create DP table with dimensions (m+1) x (n+1)
        // dp[h][w] will store maximum profit for h x w rectangle
        long[][] dp = new long[m + 1][n + 1];

        // Step 2: Initialize with direct prices from input
        for (int[] price : prices) {
            int h = price[0], w = price[1];
            long p = price[2];
            if (h <= m && w <= n) {  // Only consider prices for sizes that fit
                dp[h][w] = Math.max(dp[h][w], p);
            }
        }

        // Step 3: Fill DP table from smallest to largest rectangles
        for (int h = 1; h <= m; h++) {
            for (int w = 1; w <= n; w++) {
                // Option 1: Try all vertical cuts
                // Cut at width k, left piece: h x k, right piece: h x (w-k)
                for (int k = 1; k < w; k++) {
                    dp[h][w] = Math.max(dp[h][w], dp[h][k] + dp[h][w - k]);
                }

                // Option 2: Try all horizontal cuts
                // Cut at height k, top piece: k x w, bottom piece: (h-k) x w
                for (int k = 1; k < h; k++) {
                    dp[h][w] = Math.max(dp[h][w], dp[k][w] + dp[h - k][w]);
                }
            }
        }

        // Step 4: Return answer for full m x n rectangle
        return dp[m][n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m²n + mn²)**

- We have two outer loops: h from 1 to m, and w from 1 to n → O(mn) iterations
- For each rectangle (h,w):
  - We check vertical cuts: k from 1 to w-1 → O(w) operations
  - We check horizontal cuts: k from 1 to h-1 → O(h) operations
- Total: ΣₕΣᵥ(O(h) + O(w)) = O(m²n + mn²)

**Space Complexity: O(mn)**

- We store a DP table of size (m+1)×(n+1)
- No additional significant memory usage

This is efficient because m and n are at most 200, so m²n + mn² ≤ 200²×200 + 200×200² = 16,000,000 operations, which is manageable.

## Common Mistakes

1. **Forgetting to initialize with direct prices**: Some candidates jump straight to considering cuts but forget that a rectangle might be sold directly without cutting. Always check if the current size is in the price list first.

2. **Incorrect loop boundaries**: When checking cuts, the loop should go from 1 to size-1 (not including 0 or the full size). A cut at 0 or at the full dimension doesn't actually cut the wood.

3. **Using the wrong data type for large values**: With m,n up to 200 and prices up to 10⁹, the maximum profit can exceed 32-bit integer range. Always use 64-bit integers (long in Java, int64 in Python automatically).

4. **Not considering that pieces can be cut further**: The recursive relationship dp[h][w] = max(cuts, dp[h][w]) works because dp values for smaller rectangles already represent the optimal profit including further cuts. This is the essence of dynamic programming.

## When You'll See This Pattern

This "rectangle partitioning" DP pattern appears in several optimization problems:

1. **Tiling a Rectangle with the Fewest Squares (LeetCode 1240)**: Similar structure but minimizing squares instead of maximizing profit. You try all possible cuts and choose the minimum.

2. **Number of Ways of Cutting a Pizza (LeetCode 1444)**: Also involves cutting rectangles, though with different constraints (must contain apples, cuts must be straight).

3. **Rod Cutting Problem**: The 1D version of this problem. Instead of a 2D rectangle, you have a 1D rod that can be cut at various positions.

The pattern is: when you need to partition something (array, string, rectangle) and the optimal solution for the whole depends on optimal solutions for parts, think dynamic programming with a table dimension matching the partition space.

## Key Takeaways

1. **Recognize 2D DP when dealing with rectangle partitioning**: If you're cutting a rectangle and the value depends on how you cut it, a 2D DP table (height × width) is often the right approach.

2. **Consider all cutting directions**: For rectangles, remember to check both vertical and horizontal cuts. The recurrence is: dp[h][w] = max(direct_price, max_over_cuts(dp[piece1] + dp[piece2])).

3. **Build from smallest to largest**: Fill the DP table systematically from small rectangles to large ones. Each rectangle's optimal value depends only on smaller rectangles that have already been computed.

Related problems: [Tiling a Rectangle with the Fewest Squares](/problem/tiling-a-rectangle-with-the-fewest-squares), [Number of Ways of Cutting a Pizza](/problem/number-of-ways-of-cutting-a-pizza)
