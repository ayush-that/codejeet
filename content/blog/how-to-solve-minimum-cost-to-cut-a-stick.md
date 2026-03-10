---
title: "How to Solve Minimum Cost to Cut a Stick — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Cut a Stick. Hard difficulty, 62.8% acceptance rate. Topics: Array, Dynamic Programming, Sorting."
date: "2028-07-27"
category: "dsa-patterns"
tags: ["minimum-cost-to-cut-a-stick", "array", "dynamic-programming", "sorting", "hard"]
---

# How to Solve Minimum Cost to Cut a Stick

You're given a wooden stick of length `n` units and an array `cuts` where each element represents a position where you must make a cut. Each cut costs the length of the stick segment you're currently cutting. Your task is to determine the minimum total cost to make all the cuts in any order. What makes this problem tricky is that the cost depends on the order of cuts—cutting a longer segment first is more expensive, but cutting strategically can minimize total cost. This is a classic dynamic programming problem that requires careful state definition and ordering.

## Visual Walkthrough

Let's trace through a concrete example: `n = 7`, `cuts = [1, 3, 4, 5]`

First, we need to understand the problem setup. We have a stick from position 0 to 7. The cuts must be made at positions 1, 3, 4, and 5. The cost of each cut equals the length of the current stick segment being cut.

**Key Insight**: The order matters! Let's compare two different cutting orders:

**Order 1 (left to right)**:

- Cut at 1 first: cost = 7 (entire stick length 0-7)
- Now we have segments [0-1] and [1-7]
- Cut at 3 next: cost = 6 (segment 1-7 has length 6)
- Now segments: [0-1], [1-3], [3-7]
- Cut at 4 next: cost = 4 (segment 3-7 has length 4)
- Now segments: [0-1], [1-3], [3-4], [4-7]
- Cut at 5 last: cost = 3 (segment 4-7 has length 3)
- **Total cost**: 7 + 6 + 4 + 3 = 20

**Order 2 (more optimal)**:

- Cut at 4 first: cost = 7 (entire stick)
- Segments: [0-4], [4-7]
- Cut at 3 next: cost = 4 (segment 0-4)
- Segments: [0-3], [3-4], [4-7]
- Cut at 1 next: cost = 3 (segment 0-3)
- Segments: [0-1], [1-3], [3-4], [4-7]
- Cut at 5 last: cost = 3 (segment 4-7)
- **Total cost**: 7 + 4 + 3 + 3 = 17

We can see that cutting in the middle first (position 4) gave us a better result. But how do we find the optimal order systematically? The key is to think recursively: for any segment between two cut points (or endpoints), the optimal cost is the segment length plus the sum of optimal costs for the left and right subsegments created by choosing a cut point.

## Brute Force Approach

A brute force approach would try all possible cutting orders. For `k` cuts, there are `k!` possible permutations. For each permutation, we'd simulate the cutting process:

1. Start with the full stick [0, n]
2. For each cut in the current order:
   - Find which segment contains this cut
   - Add the segment length to total cost
   - Split the segment at the cut point
3. Track the minimum cost across all permutations

This approach has factorial time complexity O(k!), which is completely impractical for even moderate `k` (10 cuts would mean 3.6 million permutations). The problem requires a smarter approach.

**Why brute force fails**: The cost calculation has overlapping subproblems. When we cut at position `x`, the left segment [start, x] and right segment [x, end] become independent subproblems. The optimal way to cut [start, x] doesn't depend on how we cut [x, end], and vice versa. This optimal substructure property is a classic sign that dynamic programming can help.

## Optimized Approach

The key insight is to use **interval DP**. We need to think about cutting segments defined by their endpoints, not individual cut positions in isolation.

**Step-by-step reasoning**:

1. **Sort the cuts and add endpoints**: First, we sort the cuts and add 0 and n to create a complete list of all relevant positions. For our example `n=7, cuts=[1,3,4,5]`, we get `[0, 1, 3, 4, 5, 7]`.

2. **Define DP state**: Let `dp[i][j]` represent the minimum cost to cut the segment between position `i` and position `j` in our sorted positions array, where `i` and `j` are indices in this array. In other words, `dp[i][j]` is the minimum cost to make all cuts between positions `positions[i]` and `positions[j]`.

3. **Base case**: If there are no cuts between `i` and `j` (i.e., `j = i+1`), then `dp[i][j] = 0` because there's nothing to cut.

4. **Recurrence relation**: For a segment `[i, j]` with cuts between them, we need to choose where to make the first cut. If we choose to cut at position `k` (where `i < k < j`), then:
   - Cost = length of current segment (`positions[j] - positions[i]`)
   - Plus cost to cut left segment: `dp[i][k]`
   - Plus cost to cut right segment: `dp[k][j]`

   We try all possible `k` and take the minimum:  
   `dp[i][j] = min(dp[i][k] + dp[k][j]) + (positions[j] - positions[i])` for all `k` where `i < k < j`

5. **Fill order**: We need to fill the DP table in increasing order of segment length (difference between `j` and `i`). Start with the smallest segments and build up to larger ones.

6. **Answer**: The answer is `dp[0][m-1]` where `m` is the length of our positions array (including endpoints).

This approach has O(m³) time complexity where `m = k+2` (k cuts plus 2 endpoints). Since `k ≤ 100` in the problem constraints, O(m³) is feasible.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m^3) where m = len(cuts) + 2 | Space: O(m^2)
def minCost(n, cuts):
    """
    Calculate minimum cost to cut a stick of length n at given positions.

    Args:
        n: Length of the stick
        cuts: List of positions where cuts must be made

    Returns:
        Minimum total cost to make all cuts
    """
    # Step 1: Sort cuts and add endpoints (0 and n)
    # We need endpoints to define segments properly
    cuts.sort()
    positions = [0] + cuts + [n]
    m = len(positions)  # Number of positions including endpoints

    # Step 2: Initialize DP table
    # dp[i][j] = min cost to cut segment between positions[i] and positions[j]
    # where i and j are indices in the positions array
    dp = [[0] * m for _ in range(m)]

    # Step 3: Fill DP table in increasing order of segment length
    # We start with length = 2 (smallest possible segment with no cuts between)
    # and go up to the full stick (length = m-1)
    for length in range(2, m):  # length = j - i
        for i in range(m - length):  # Starting index i
            j = i + length  # Ending index j

            # Initialize to a large value since we're looking for minimum
            dp[i][j] = float('inf')

            # Try all possible first cuts between i and j
            # k represents the index of the cut position in positions array
            for k in range(i + 1, j):
                # Current cost = cost of cutting this segment
                #               + optimal cost of left subsegment
                #               + optimal cost of right subsegment
                current_cost = dp[i][k] + dp[k][j] + (positions[j] - positions[i])

                # Update minimum
                dp[i][j] = min(dp[i][j], current_cost)

    # Step 4: Return answer for the full stick (from position 0 to n)
    return dp[0][m-1]
```

```javascript
// Time: O(m^3) where m = cuts.length + 2 | Space: O(m^2)
function minCost(n, cuts) {
  /**
   * Calculate minimum cost to cut a stick of length n at given positions.
   *
   * @param {number} n - Length of the stick
   * @param {number[]} cuts - Array of positions where cuts must be made
   * @return {number} Minimum total cost to make all cuts
   */

  // Step 1: Sort cuts and add endpoints (0 and n)
  cuts.sort((a, b) => a - b);
  const positions = [0, ...cuts, n];
  const m = positions.length; // Number of positions including endpoints

  // Step 2: Initialize DP table
  // dp[i][j] = min cost to cut segment between positions[i] and positions[j]
  const dp = Array(m)
    .fill()
    .map(() => Array(m).fill(0));

  // Step 3: Fill DP table in increasing order of segment length
  for (let length = 2; length < m; length++) {
    for (let i = 0; i < m - length; i++) {
      const j = i + length;

      // Initialize to a large value since we're looking for minimum
      dp[i][j] = Infinity;

      // Try all possible first cuts between i and j
      for (let k = i + 1; k < j; k++) {
        // Current cost = cost of cutting this segment
        //               + optimal cost of left subsegment
        //               + optimal cost of right subsegment
        const currentCost = dp[i][k] + dp[k][j] + (positions[j] - positions[i]);

        // Update minimum
        dp[i][j] = Math.min(dp[i][j], currentCost);
      }
    }
  }

  // Step 4: Return answer for the full stick (from position 0 to n)
  return dp[0][m - 1];
}
```

```java
// Time: O(m^3) where m = cuts.length + 2 | Space: O(m^2)
class Solution {
    public int minCost(int n, int[] cuts) {
        /**
         * Calculate minimum cost to cut a stick of length n at given positions.
         *
         * @param n Length of the stick
         * @param cuts Array of positions where cuts must be made
         * @return Minimum total cost to make all cuts
         */

        // Step 1: Sort cuts and add endpoints (0 and n)
        Arrays.sort(cuts);
        int m = cuts.length + 2;  // +2 for endpoints
        int[] positions = new int[m];
        positions[0] = 0;
        positions[m - 1] = n;
        for (int i = 0; i < cuts.length; i++) {
            positions[i + 1] = cuts[i];
        }

        // Step 2: Initialize DP table
        // dp[i][j] = min cost to cut segment between positions[i] and positions[j]
        int[][] dp = new int[m][m];

        // Step 3: Fill DP table in increasing order of segment length
        // We iterate by length because longer segments depend on shorter ones
        for (int length = 2; length < m; length++) {
            for (int i = 0; i < m - length; i++) {
                int j = i + length;

                // Initialize to a large value since we're looking for minimum
                dp[i][j] = Integer.MAX_VALUE;

                // Try all possible first cuts between i and j
                for (int k = i + 1; k < j; k++) {
                    // Current cost = cost of cutting this segment
                    //               + optimal cost of left subsegment
                    //               + optimal cost of right subsegment
                    int currentCost = dp[i][k] + dp[k][j] + (positions[j] - positions[i]);

                    // Update minimum
                    dp[i][j] = Math.min(dp[i][j], currentCost);
                }
            }
        }

        // Step 4: Return answer for the full stick (from position 0 to n)
        return dp[0][m - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m³) where m = k + 2 (k is the number of cuts, plus 2 endpoints).

- We have three nested loops:
  1. Outer loop over segment lengths: O(m)
  2. Middle loop over starting indices: O(m)
  3. Inner loop over cut positions: O(m)
- This gives us O(m × m × m) = O(m³) operations.

**Space Complexity**: O(m²) for the DP table.

- We store a 2D array of size m × m where m = k + 2.

For the problem constraints (k ≤ 100, so m ≤ 102), O(102³) ≈ 1,061,208 operations is well within limits.

## Common Mistakes

1. **Forgetting to sort cuts and add endpoints**: The cuts array isn't necessarily sorted, and we need endpoints 0 and n to define segments properly. Without this, you can't correctly calculate segment lengths or define the DP state.

2. **Incorrect DP state definition**: Some candidates try to define DP based on the original cuts array indices rather than the sorted positions including endpoints. This leads to incorrect segment length calculations and boundary issues.

3. **Wrong fill order**: The DP table must be filled in increasing order of segment length (difference between j and i). If you fill row by row or column by column, you'll access uninitialized DP values. The recurrence `dp[i][j]` depends on `dp[i][k]` and `dp[k][j]` where `k` is between `i` and `j`, so shorter segments must be computed first.

4. **Off-by-one errors in loops**: The loop boundaries are tricky:
   - `length` starts at 2 (smallest segment with no cuts between)
   - `i` goes up to `m - length` (to ensure `j` stays within bounds)
   - `k` goes from `i + 1` to `j - 1` (cuts must be strictly between endpoints)

## When You'll See This Pattern

This **interval DP** pattern appears in problems where you need to make optimal decisions about partitioning intervals, especially when the cost depends on the partition point and the resulting subproblems are independent.

Related problems:

1. **Burst Balloons (LeetCode 312)**: Similar interval DP where you choose which balloon to burst last, with cost depending on neighbors.
2. **Stone Game (LeetCode 877)**: Another interval DP where you choose which stone to take first, with scores accumulating.
3. **Palindrome Partitioning II (LeetCode 132)**: Uses interval DP to find minimum cuts to partition a string into palindromes.

The common thread is defining DP state as `dp[i][j]` representing optimal solution for interval `[i, j]`, then trying all possible split points `k` between `i` and `j`.

## Key Takeaways

1. **Interval DP is the go-to approach for partition problems**: When you need to partition an interval and the cost has optimal substructure (subproblems are independent), think interval DP with state `dp[i][j]`.

2. **Sort and add boundaries**: For problems involving cuts or partitions on a line/array, always sort the cut points and consider adding boundary markers (like 0 and n here) to simplify calculations.

3. **Fill in increasing order of interval length**: The recurrence typically depends on smaller intervals, so you must compute all smaller intervals before larger ones. This is done by iterating by interval length from smallest to largest.

**Related problems**: [Number of Ways to Divide a Long Corridor](/problem/number-of-ways-to-divide-a-long-corridor), [Divide an Array Into Subarrays With Minimum Cost II](/problem/divide-an-array-into-subarrays-with-minimum-cost-ii)
