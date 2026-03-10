---
title: "How to Solve Minimum White Tiles After Covering With Carpets — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum White Tiles After Covering With Carpets. Hard difficulty, 38.6% acceptance rate. Topics: String, Dynamic Programming, Prefix Sum."
date: "2030-02-07"
category: "dsa-patterns"
tags:
  [
    "minimum-white-tiles-after-covering-with-carpets",
    "string",
    "dynamic-programming",
    "prefix-sum",
    "hard",
  ]
---

# How to Solve Minimum White Tiles After Covering With Carpets

You're given a binary string representing floor tiles (0=black, 1=white) and `numCarpets` carpets of length `carpetLen`. Each carpet can cover exactly `carpetLen` consecutive tiles, and you want to minimize the number of visible white tiles after placing all carpets. The challenge is determining where to place carpets to maximize white tile coverage—this is tricky because carpets can overlap, and you need to consider both which tiles to cover and how many carpets remain.

What makes this problem interesting is that it looks like a greedy problem (cover the most white tiles first), but greedy fails because covering one area might prevent covering an even better area later. This is fundamentally a **dynamic programming** problem where you track both position in the string and carpets remaining.

## Visual Walkthrough

Let's trace through a small example: `floor = "10110101"`, `numCarpets = 2`, `carpetLen = 3`.

**Step 1: Understanding the goal**
We have 8 tiles: positions 0,2,3,5,7 are white (1's). That's 5 white tiles initially. With 2 carpets of length 3, we can cover up to 6 tiles total (carpets can overlap).

**Step 2: Thinking about placement**
If we place the first carpet starting at position 0: covers positions 0-2 → covers white tiles at 0 and 2. Remaining white: positions 3,5,7.

If we place the second carpet starting at position 3: covers positions 3-5 → covers white tiles at 3 and 5. Remaining white: position 7 only.

Total white tiles left: 1. But is this optimal?

**Step 3: Trying a better placement**
What if we place first carpet at position 2: covers 2-4 → covers white at 2 and 3.
Place second carpet at position 5: covers 5-7 → covers white at 5 and 7.
Remaining white: position 0 only.

Total white tiles left: 0! This is better. The optimal solution requires careful placement, not just covering the most white tiles immediately.

**Step 4: Key insight**
At each position `i`, we have two choices:

1. Don't use a carpet here → white tile at `i` remains uncovered if it's '1'
2. Use a carpet here (if available) → cover `carpetLen` tiles starting at `i`

We need to track: current position `i` and carpets remaining `k`. This suggests a DP approach: `dp[i][k]` = minimum white tiles visible starting from position `i` with `k` carpets left.

## Brute Force Approach

A naive brute force would try all possible placements of carpets. With `n` positions and `numCarpets` carpets, there are `C(n, numCarpets)` ways to choose starting positions, and for each placement, we'd need to calculate coverage. Even for moderate `n=100` and `numCarpets=10`, this is astronomically large.

A slightly better brute force uses recursion: at each position, try both using a carpet (if available) and not using one. This has complexity O(2^n) in the worst case, which is still far too slow for constraints where `n` can be up to 1000.

The brute force fails because it repeatedly solves the same subproblems. For example, after placing a carpet at position 0, we need to solve the subproblem starting at position 3 with one fewer carpet. We'll encounter this same subproblem from many different paths.

## Optimized Approach

The key insight is that this has **optimal substructure**: the optimal solution from position `i` with `k` carpets depends on optimal solutions from later positions. This screams dynamic programming.

**DP State Definition:**
Let `dp[i][k]` = minimum white tiles visible from position `i` to the end, given `k` carpets remaining.

**Transition:**
At position `i`:

1. **Don't use carpet:** We pay cost of 1 if `floor[i]` is white, then move to `i+1` with same `k`
   `cost1 = (floor[i] == '1' ? 1 : 0) + dp[i+1][k]`
2. **Use carpet (if k > 0):** Cover `carpetLen` tiles starting at `i`, jump to `i + carpetLen` with `k-1` carpets
   `cost2 = dp[min(i + carpetLen, n)][k-1]` (min handles going past end)

Take the minimum: `dp[i][k] = min(cost1, cost2)`

**Base Case:**

- If `i >= n`: `dp[i][k] = 0` (no more tiles to cover)
- If `k = 0`: can only choose "don't use carpet" option

**Optimization with Prefix Sum:**
We need to know if `floor[i]` is white for the "don't use carpet" case. Instead of checking each character repeatedly, we can use a prefix sum array `prefix` where `prefix[i]` = number of white tiles from 0 to `i-1`. Then white tiles from `i` to `j-1` = `prefix[j] - prefix[i]`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * numCarpets) | Space: O(n * numCarpets)
def minimumWhiteTiles(floor: str, numCarpets: int, carpetLen: int) -> int:
    n = len(floor)

    # Prefix sum array: prefix[i] = number of white tiles in floor[0:i]
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + (1 if floor[i] == '1' else 0)

    # DP table: dp[i][k] = min white tiles from position i with k carpets left
    # Initialize with large values
    dp = [[float('inf')] * (numCarpets + 1) for _ in range(n + 1)]

    # Base case: if we're at or beyond the end, no white tiles left
    for k in range(numCarpets + 1):
        dp[n][k] = 0

    # Fill DP table from right to left (from end to beginning)
    for i in range(n - 1, -1, -1):
        for k in range(numCarpets + 1):
            # Option 1: Don't use carpet at position i
            # Cost = white tile at i (if exists) + dp[i+1][k]
            cost_no_carpet = (1 if floor[i] == '1' else 0) + dp[i + 1][k]

            # Option 2: Use carpet at position i (if available)
            if k > 0:
                # If we use carpet, we cover carpetLen tiles starting at i
                # Next position to consider is i + carpetLen (or n if beyond end)
                next_pos = min(i + carpetLen, n)
                cost_use_carpet = dp[next_pos][k - 1]
            else:
                cost_use_carpet = float('inf')

            # Take the better option
            dp[i][k] = min(cost_no_carpet, cost_use_carpet)

    # Answer: minimum white tiles starting from position 0 with all carpets
    return dp[0][numCarpets]
```

```javascript
// Time: O(n * numCarpets) | Space: O(n * numCarpets)
function minimumWhiteTiles(floor, numCarpets, carpetLen) {
  const n = floor.length;

  // Prefix sum array: prefix[i] = number of white tiles in floor[0:i]
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + (floor[i] === "1" ? 1 : 0);
  }

  // DP table: dp[i][k] = min white tiles from position i with k carpets left
  // Initialize with Infinity
  const dp = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    dp[i] = new Array(numCarpets + 1).fill(Infinity);
  }

  // Base case: if we're at or beyond the end, no white tiles left
  for (let k = 0; k <= numCarpets; k++) {
    dp[n][k] = 0;
  }

  // Fill DP table from right to left (from end to beginning)
  for (let i = n - 1; i >= 0; i--) {
    for (let k = 0; k <= numCarpets; k++) {
      // Option 1: Don't use carpet at position i
      // Cost = white tile at i (if exists) + dp[i+1][k]
      const costNoCarpet = (floor[i] === "1" ? 1 : 0) + dp[i + 1][k];

      // Option 2: Use carpet at position i (if available)
      let costUseCarpet = Infinity;
      if (k > 0) {
        // If we use carpet, we cover carpetLen tiles starting at i
        // Next position to consider is i + carpetLen (or n if beyond end)
        const nextPos = Math.min(i + carpetLen, n);
        costUseCarpet = dp[nextPos][k - 1];
      }

      // Take the better option
      dp[i][k] = Math.min(costNoCarpet, costUseCarpet);
    }
  }

  // Answer: minimum white tiles starting from position 0 with all carpets
  return dp[0][numCarpets];
}
```

```java
// Time: O(n * numCarpets) | Space: O(n * numCarpets)
class Solution {
    public int minimumWhiteTiles(String floor, int numCarpets, int carpetLen) {
        int n = floor.length();

        // Prefix sum array: prefix[i] = number of white tiles in floor[0:i)
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + (floor.charAt(i) == '1' ? 1 : 0);
        }

        // DP table: dp[i][k] = min white tiles from position i with k carpets left
        // Initialize with large values
        int[][] dp = new int[n + 1][numCarpets + 1];
        for (int i = 0; i <= n; i++) {
            for (int k = 0; k <= numCarpets; k++) {
                dp[i][k] = Integer.MAX_VALUE / 2; // Avoid overflow
            }
        }

        // Base case: if we're at or beyond the end, no white tiles left
        for (int k = 0; k <= numCarpets; k++) {
            dp[n][k] = 0;
        }

        // Fill DP table from right to left (from end to beginning)
        for (int i = n - 1; i >= 0; i--) {
            for (int k = 0; k <= numCarpets; k++) {
                // Option 1: Don't use carpet at position i
                // Cost = white tile at i (if exists) + dp[i+1][k]
                int costNoCarpet = (floor.charAt(i) == '1' ? 1 : 0) + dp[i + 1][k];

                // Option 2: Use carpet at position i (if available)
                int costUseCarpet = Integer.MAX_VALUE / 2;
                if (k > 0) {
                    // If we use carpet, we cover carpetLen tiles starting at i
                    // Next position to consider is i + carpetLen (or n if beyond end)
                    int nextPos = Math.min(i + carpetLen, n);
                    costUseCarpet = dp[nextPos][k - 1];
                }

                // Take the better option
                dp[i][k] = Math.min(costNoCarpet, costUseCarpet);
            }
        }

        // Answer: minimum white tiles starting from position 0 with all carpets
        return dp[0][numCarpets];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × numCarpets)

- We have a DP table of size (n+1) × (numCarpets+1)
- Each cell takes O(1) time to compute (just two options to compare)
- Total operations: (n+1) × (numCarpets+1) = O(n × numCarpets)

**Space Complexity:** O(n × numCarpets) for the DP table

- We could optimize to O(n) by only storing two rows at a time (current and next), but the 2D version is clearer for understanding
- The prefix sum array uses O(n) additional space

## Common Mistakes

1. **Trying greedy approach:** Candidates often think "cover the most white tiles first" but this fails because covering one area might block a better combination later. Example: `"1110111"`, `numCarpets=2`, `carpetLen=3`. Greedy covers middle "111" first, leaving two separate "11" groups that need 2 carpets but only 1 left. Optimal covers first and last "111" groups.

2. **Incorrect DP direction:** Filling DP from left to right instead of right to left. We need to know the future to make optimal decisions at current position. Starting from the end ensures we've already computed needed subproblems.

3. **Forgetting to handle carpet going beyond string end:** When `i + carpetLen > n`, the carpet covers fewer than `carpetLen` tiles. We must use `min(i + carpetLen, n)` as the next position.

4. **Off-by-one errors in prefix sum:** Remember `prefix[i]` typically means sum of elements 0 to i-1. A common mistake is using `prefix[j] - prefix[i]` for range `[i, j]` instead of `[i, j)`.

## When You'll See This Pattern

This DP pattern appears in problems where you have:

1. A sequence of items (string, array)
2. Limited resources to use (carpets, transactions, operations)
3. Decisions at each position affect future options

**Related problems:**

1. **Edit Distance (LeetCode 72)** - Similar DP structure with two sequences and operations
2. **Best Time to Buy and Sell Stock IV (LeetCode 188)** - Limited transactions, DP with state (day, transactions remaining)
3. **Coin Change II (LeetCode 518)** - Limited coins, though usually unlimited in that problem
4. **Maximum Profit in Job Scheduling (LeetCode 1235)** - Choosing whether to take a job affects future options

## Key Takeaways

1. **When you have limited resources and sequential decisions, think DP:** The state usually includes position in sequence and resources remaining.

2. **Right-to-left DP is natural for "starting from position i" problems:** It ensures subproblems are solved before they're needed.

3. **Prefix sums optimize range queries:** When you need to frequently compute sums over ranges, precompute prefix sums for O(1) queries.

4. **Always test edge cases:** Empty string, carpet length longer than string, zero carpets, all white/black tiles.

Related problems: [Edit Distance](/problem/edit-distance)
