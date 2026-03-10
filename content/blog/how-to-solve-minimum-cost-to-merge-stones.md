---
title: "How to Solve Minimum Cost to Merge Stones — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Merge Stones. Hard difficulty, 45.6% acceptance rate. Topics: Array, Dynamic Programming, Prefix Sum."
date: "2028-07-15"
category: "dsa-patterns"
tags: ["minimum-cost-to-merge-stones", "array", "dynamic-programming", "prefix-sum", "hard"]
---

# How to Solve Minimum Cost to Merge Stones

This problem asks us to merge piles of stones in a row, where each move combines exactly `k` consecutive piles into one pile at a cost equal to the sum of their stones. We need to find the **minimum total cost** to merge all piles into one. The tricky part is that merges must be exactly `k` piles at a time, which creates dependencies between moves—merging one group affects what groups can be merged next. This constraint makes the problem fundamentally different from simpler merging problems where you can combine any two piles.

## Visual Walkthrough

Let's trace through a small example: `stones = [3, 2, 4, 1]`, `k = 2`. We need to merge all 4 piles into 1 pile using moves that combine exactly 2 consecutive piles.

**Initial state:** [3, 2, 4, 1] (4 piles)

**Step 1:** We have several options for our first merge:

- Merge piles 0-1: cost = 3+2 = 5 → new array: [5, 4, 1] (3 piles)
- Merge piles 1-2: cost = 2+4 = 6 → new array: [3, 6, 1] (3 piles)
- Merge piles 2-3: cost = 4+1 = 5 → new array: [3, 2, 5] (3 piles)

**Step 2:** After any first merge, we have 3 piles left. But wait—we can only merge exactly 2 piles at a time, and we need to end with 1 pile. With `k=2`, each merge reduces the pile count by `k-1 = 1`. Starting with `n` piles, we need `(n-1)/(k-1)` to be an integer for a solution to exist. Here, `(4-1)/(2-1) = 3`, which is integer, so a solution exists.

Let's follow the first option: [5, 4, 1] after first merge (cost=5)

Now we can merge:

- Merge piles 0-1: cost = 5+4 = 9 → new array: [9, 1] (2 piles)
- Merge piles 1-2: cost = 4+1 = 5 → new array: [5, 5] (2 piles)

Let's take the first sub-option: [9, 1] after second merge (total cost = 5+9 = 14)

**Step 3:** Merge the last 2 piles: cost = 9+1 = 10 → new array: [10] (1 pile)
Total cost = 5+9+10 = 24

But is this optimal? Let's try a different path:
First merge piles 2-3: cost = 4+1 = 5 → [3, 2, 5]
Then merge piles 1-2: cost = 2+5 = 7 → [3, 7]  
Then merge last 2: cost = 3+7 = 10 → total = 5+7+10 = 22

This is better! The optimal solution requires considering all possible merge sequences—this is where dynamic programming comes in.

## Brute Force Approach

A brute force solution would try all possible sequences of merges. At each step, we have up to `n-k+1` choices (we can merge starting at any position where there are at least `k` consecutive piles remaining). The number of possible sequences grows factorially with `n`, making this approach infeasible even for moderate `n`.

What might a naive candidate try? They might think of a greedy approach: always merge the smallest `k` consecutive piles. But this fails because merging changes the array structure—what seems optimal locally may block better global sequences. For example, with `[6,4,4,6]` and `k=2`, merging the middle two (4+4=8) gives cost 8, then we have [6,8,6], then merge 6+8=14, then 14+6=20, total=8+14+20=42. But merging the first two (6+4=10) gives [10,4,6], then merge 4+6=10, then 10+10=20, total=10+10+20=40, which is better.

The brute force approach is `O(n!)` time—completely impractical for `n` up to 30 (typical constraint for this problem).

## Optimized Approach

The key insight is that this is an **interval DP** problem similar to "Burst Balloons" or "Stone Game." We need to track not just the cost of merging, but also how many piles are left after each merge.

**Critical observation:** Each merge reduces the number of piles by `k-1`. Starting with `n` piles and ending with 1 pile, we need `(n-1) % (k-1) == 0` for a solution to exist. If not, return -1.

**DP state definition:** Let `dp[i][j]` be the minimum cost to merge piles from index `i` to index `j` into as few piles as possible. But here's the twist: we can't always merge `[i,j]` into 1 pile—sometimes we can only reduce it to a certain number of piles. Actually, the correct state is: `dp[i][j]` = minimum cost to merge piles `i` through `j` into `(j-i) % (k-1) + 1` piles (the minimum possible number of piles we can reduce this interval to).

**Better formulation:** Let `dp[i][j]` = minimum cost to merge piles `i` through `j` into **as few piles as possible**. The number of piles we can reduce to is determined by the length of the interval: if length `L = j-i+1`, we can reduce it to `(L-1) % (k-1) + 1` piles.

**Transition:** To compute `dp[i][j]`, we consider where to make the **last merge** in this interval. We split at `m` (where `i ≤ m < j`) and combine the results from `dp[i][m]` and `dp[m+1][j]`. But we can only combine them if the total number of piles from both sides equals `k`. Actually, we need to check if we can merge them: if `(len_left - 1) % (k-1) == 0` and `(len_right - 1) % (k-1) == 0`, then both intervals can be reduced to 1 pile each, and we can merge them.

**Even better approach (standard solution):** Let `dp[i][j][p]` = minimum cost to merge stones `i..j` into `p` piles. But this is `O(n^3 * k)` which is too slow for `n=30`. We need optimization.

**Optimal DP formulation:** Let `dp[i][j]` = minimum cost to merge stones `i..j` into **as few piles as possible**. When we merge an interval that can be reduced to 1 pile (i.e., `(j-i) % (k-1) == 0`), the cost includes the sum of all stones in `i..j`. Otherwise, the cost doesn't include the sum.

**Why this works:** When we finally merge `k` piles into 1, we pay the sum of all stones in those `k` piles. Those stones come from the original piles in that interval. So the total cost is the sum of all stones in each "final merge" group. We can compute this efficiently using prefix sums.

## Optimal Solution

The standard solution uses 3D DP but with an important optimization: we only need to track when we can merge into 1 pile. Here's the approach:

1. Check if `(n-1) % (k-1) == 0`. If not, return -1.
2. Compute prefix sums for quick range sum queries.
3. `dp[i][j]` = minimum cost to merge `i..j` into as few piles as possible.
4. Base case: `dp[i][i] = 0` (single pile, no cost to merge).
5. Transition: For each `i..j`, try all possible splits `m` where we merge `i..m` and `m+1..j`. If the left part can be merged into 1 pile and the right part can be merged into `k-1` piles (or vice versa), we can combine them with cost = sum of `i..j`.
6. Actually, simpler: We only add the sum of `i..j` when `(j-i) % (k-1) == 0`, because that's when we can finally merge all piles in this interval into 1 pile.

<div class="code-group">

```python
# Time: O(n^3 / k) | Space: O(n^2)
def mergeStones(stones, k):
    """
    Minimum cost to merge stones with exactly k piles per merge.

    Args:
        stones: List of stone counts in each pile
        k: Number of consecutive piles to merge at once

    Returns:
        Minimum total cost to merge all piles into one, or -1 if impossible
    """
    n = len(stones)

    # Check if solution exists: each merge reduces pile count by k-1
    # Starting with n piles, ending with 1 pile: need (n-1) % (k-1) == 0
    if (n - 1) % (k - 1) != 0:
        return -1

    # Prefix sums for O(1) range sum queries
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]

    # dp[i][j] = min cost to merge stones[i..j] into as few piles as possible
    dp = [[0] * n for _ in range(n)]

    # We need to consider intervals of increasing length
    # Start with length = k (smallest interval that can be merged)
    for length in range(k, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1

            # Initialize to infinity (we'll find minimum)
            dp[i][j] = float('inf')

            # Try all possible split points m
            # We step by k-1 because merging reduces piles by k-1 each time
            for m in range(i, j, k - 1):
                # Cost to merge left part (i..m) and right part (m+1..j)
                dp[i][j] = min(dp[i][j], dp[i][m] + dp[m + 1][j])

            # If this interval can be merged into 1 pile, add the sum
            # An interval can be merged into 1 pile if (length-1) % (k-1) == 0
            if (length - 1) % (k - 1) == 0:
                dp[i][j] += prefix[j + 1] - prefix[i]

    return dp[0][n - 1]
```

```javascript
// Time: O(n^3 / k) | Space: O(n^2)
function mergeStones(stones, k) {
  const n = stones.length;

  // Check if solution exists
  if ((n - 1) % (k - 1) !== 0) {
    return -1;
  }

  // Prefix sums for O(1) range sum queries
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + stones[i];
  }

  // dp[i][j] = min cost to merge stones[i..j]
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));

  // Consider intervals of increasing length
  for (let length = k; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;

      // Initialize to Infinity
      dp[i][j] = Infinity;

      // Try all possible split points
      // Step by k-1 because of pile reduction per merge
      for (let m = i; m < j; m += k - 1) {
        dp[i][j] = Math.min(dp[i][j], dp[i][m] + dp[m + 1][j]);
      }

      // If interval can be merged into 1 pile, add sum of stones
      if ((length - 1) % (k - 1) === 0) {
        dp[i][j] += prefix[j + 1] - prefix[i];
      }
    }
  }

  return dp[0][n - 1];
}
```

```java
// Time: O(n^3 / k) | Space: O(n^2)
class Solution {
    public int mergeStones(int[] stones, int k) {
        int n = stones.length;

        // Check if solution exists
        if ((n - 1) % (k - 1) != 0) {
            return -1;
        }

        // Prefix sums for O(1) range sum queries
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + stones[i];
        }

        // dp[i][j] = min cost to merge stones[i..j]
        int[][] dp = new int[n][n];

        // Consider intervals of increasing length
        for (int length = k; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;

                // Initialize to maximum value
                dp[i][j] = Integer.MAX_VALUE;

                // Try all possible split points
                // Step by k-1 because of pile reduction pattern
                for (int m = i; m < j; m += k - 1) {
                    // Avoid overflow when adding
                    long sum = (long) dp[i][m] + dp[m + 1][j];
                    dp[i][j] = (int) Math.min(dp[i][j], sum);
                }

                // If interval can be merged into 1 pile, add sum of stones
                if ((length - 1) % (k - 1) == 0) {
                    // Avoid overflow
                    long total = (long) dp[i][j] + (prefix[j + 1] - prefix[i]);
                    dp[i][j] = (int) total;
                }
            }
        }

        return dp[0][n - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n^3 / k)` where `n` is the number of piles. Here's why:

- We iterate over all interval lengths from `k` to `n`: `O(n)` iterations
- For each interval length, we iterate over all starting positions: `O(n)` iterations
- For each interval, we try split points stepping by `k-1`: `O(n/k)` iterations on average
- Total: `O(n * n * (n/k)) = O(n^3 / k)`

**Space Complexity:** `O(n^2)` for the DP table. We could optimize to `O(n)` by noticing we only need certain diagonals, but the `O(n^2)` solution is typically acceptable for `n ≤ 30`.

## Common Mistakes

1. **Not checking if solution exists:** Forgetting that `(n-1) % (k-1) == 0` must hold. Without this check, you might try to compute a solution that doesn't exist.

2. **Wrong DP state definition:** Trying to use 2D DP without considering the pile count constraint. The key insight is that we can only merge when the total piles from subintervals equals `k`.

3. **Incorrect interval splitting:** Iterating split points by 1 instead of `k-1`. Since each merge reduces piles by `k-1`, we only need to consider splits where both sides can be reduced to appropriate pile counts.

4. **Forgetting to add range sum:** Only adding the sum when the interval can be merged into 1 pile `(length-1) % (k-1) == 0`. If you add it for all intervals, you'll overcount.

## When You'll See This Pattern

This interval DP pattern appears in problems where:

1. Operations on an array/sequence have costs depending on the values
2. Operations affect adjacent elements or create dependencies between subproblems
3. You need to find an optimal ordering of operations

**Related problems:**

- **Burst Balloons (Hard):** Similar interval DP where popping a balloon affects adjacent balloons. The cost depends on the balloon and its neighbors.
- **Stone Game (Medium):** Another interval DP with piles of stones, though with different rules.
- **Minimum Cost to Connect Sticks (Medium):** Simpler version where you can always merge any two sticks (not exactly k), solvable with a heap.

## Key Takeaways

1. **Interval DP is the right approach** for sequence optimization problems where operations have chain effects. Look for problems where the optimal solution for an interval depends on optimal solutions for subintervals.

2. **The `(n-1) % (k-1) == 0` check is crucial** for problems with fixed-size operations. Each operation reduces the count by a fixed amount, so the total reduction must match exactly.

3. **Prefix sums are essential** for efficiently computing the cost of merging intervals. Any time you need frequent range sum queries, prefix sums give O(1) lookups after O(n) preprocessing.

Related problems: [Burst Balloons](/problem/burst-balloons), [Minimum Cost to Connect Sticks](/problem/minimum-cost-to-connect-sticks)
