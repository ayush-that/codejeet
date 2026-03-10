---
title: "How to Solve Minimum Moves to Spread Stones Over Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Spread Stones Over Grid. Medium difficulty, 45.4% acceptance rate. Topics: Array, Dynamic Programming, Backtracking, Bit Manipulation, Matrix."
date: "2029-05-10"
category: "dsa-patterns"
tags:
  [
    "minimum-moves-to-spread-stones-over-grid",
    "array",
    "dynamic-programming",
    "backtracking",
    "medium",
  ]
---

# How to Solve Minimum Moves to Spread Stones Over Grid

This problem asks us to redistribute exactly 9 stones across a 3×3 grid so that each cell ends up with exactly 1 stone, minimizing the total Manhattan distance moved. What makes this problem interesting is that while the grid is small (only 9 cells), the optimal solution requires recognizing this as a **minimum cost assignment problem** rather than trying to solve it with greedy heuristics or brute force permutations.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this grid:

```
Grid:    Stones to move from: (0,0), (0,0), (1,2), (2,2)
         [2, 0, 0]
         [0, 0, 1]
         [0, 0, 1]
```

We have 4 stones at positions: (0,0) has 2 stones, (1,2) has 1, (2,2) has 1. We need to move them to the 4 empty positions: (0,1), (0,2), (1,0), (1,1), (2,0), (2,1).

The key insight: We need to match each "source" cell (with >1 stone) to each "destination" cell (with 0 stones) such that the total movement cost is minimized. Each stone from an overfull cell must go to a different empty cell.

For our example:

- Sources: (0,0)×2, (1,2), (2,2)
- Destinations: (0,1), (0,2), (1,0), (1,1), (2,0), (2,1)

We need to assign 4 sources to 4 destinations (we'll use 4 of the 6 destinations). The cost of moving from source (r1,c1) to destination (r2,c2) is the Manhattan distance: |r1-r2| + |c1-c2|.

The optimal assignment might be:

- (0,0) → (0,1): distance 1
- (0,0) → (1,0): distance 1
- (1,2) → (0,2): distance 1
- (2,2) → (2,1): distance 1
  Total: 4 moves

This is better than any greedy approach that might pair (2,2) with (0,1), which would cost 3 moves instead of 1.

## Brute Force Approach

A naive approach would try all possible ways to move stones:

1. Identify all cells with excess stones (stones > 1)
2. Identify all cells needing stones (stones = 0)
3. Generate all permutations of assigning excess stones to empty cells
4. For each permutation, calculate total Manhattan distance
5. Return the minimum

For a 3×3 grid with k excess stones, there are P(m,k) = m!/(m-k)! permutations where m is the number of empty cells. In worst case, all 9 stones could be in one cell (k=8) with 8 empty cells (m=8), giving 8! = 40,320 permutations. While this might seem manageable for 3×3, the approach doesn't scale and misses the optimal substructure.

The brute force fails to recognize that stones from the same source cell are **indistinguishable** - we don't need to consider different orderings of stones from the same cell. More importantly, it doesn't leverage the fact that this is a **minimum cost bipartite matching** problem.

## Optimized Approach

The key insight is that this is a **minimum cost assignment problem**:

- Left side: Individual stones that need to be moved (not cells!)
- Right side: Empty positions that need stones
- Cost: Manhattan distance between source cell and destination cell

However, there's an important optimization: stones from the same cell are identical. We don't need to create a separate node for each stone from the same cell. Instead, we can:

1. Collect all source positions (cells with >1 stone), but track how many stones each has
2. Collect all destination positions (cells with 0 stones)
3. Since we need to move exactly (total excess) stones, and there are exactly that many empty cells, we need to match each excess stone to an empty cell

The optimal solution uses **bitmask dynamic programming**:

- Let `i` be a bitmask representing which destination cells have been assigned
- DP[mask] = minimum total cost to assign stones to the destinations marked in mask
- For each new stone we need to place, try assigning it to any available (unassigned) destination
- The cost is Manhattan distance from the current source to that destination

We process sources sequentially: for the k-th excess stone (from any source cell), we try all available destinations. But since stones from the same source are identical, we can process all stones from one source before moving to the next.

## Optimal Solution

We'll use DP with bitmasking. The state is (source_index, mask) where source_index tracks which stone we're placing, and mask tracks which destinations are filled.

<div class="code-group">

```python
# Time: O(k * m * 2^m) where k = number of excess stones, m = number of empty cells
# Space: O(k * 2^m) for DP table
class Solution:
    def minimumMoves(self, grid: List[List[int]]) -> int:
        # Step 1: Collect source and destination positions
        sources = []  # positions with excess stones
        dests = []    # positions needing stones

        for r in range(3):
            for c in range(3):
                if grid[r][c] > 1:
                    # Add multiple entries for multiple excess stones
                    # e.g., if cell has 3 stones, we need to move 2 of them
                    for _ in range(grid[r][c] - 1):
                        sources.append((r, c))
                elif grid[r][c] == 0:
                    dests.append((r, c))

        k = len(sources)  # number of stones to move
        m = len(dests)    # number of empty cells

        # Step 2: Precompute cost matrix
        # cost[i][j] = Manhattan distance from source i to destination j
        cost = [[0] * m for _ in range(k)]
        for i in range(k):
            sr, sc = sources[i]
            for j in range(m):
                dr, dc = dests[j]
                cost[i][j] = abs(sr - dr) + abs(sc - dc)

        # Step 3: DP with bitmask
        # dp[mask] = min cost to fill destinations marked in mask
        # We'll process stones one by one
        dp = [float('inf')] * (1 << m)
        dp[0] = 0  # no destinations filled yet

        # For each stone (source), try to place it in any available destination
        for i in range(k):
            # We need to process in reverse mask order to avoid reusing the same stone
            # Actually, we need a new DP array for each stone to prevent reuse
            new_dp = [float('inf')] * (1 << m)

            for mask in range(1 << m):
                if dp[mask] == float('inf'):
                    continue

                # Try placing current stone in any unfilled destination
                for j in range(m):
                    if not (mask >> j) & 1:  # destination j is available
                        new_mask = mask | (1 << j)
                        new_dp[new_mask] = min(new_dp[new_mask],
                                              dp[mask] + cost[i][j])

            dp = new_dp

        # The answer is when all destinations are filled (all m bits set)
        # But wait: we might not use all destinations if k < m
        # Actually, k should equal m since total stones = 9
        # Each excess stone goes to an empty cell, so k = m
        return dp[(1 << m) - 1]
```

```javascript
// Time: O(k * m * 2^m) where k = number of excess stones, m = number of empty cells
// Space: O(k * 2^m) for DP table
var minimumMoves = function (grid) {
  // Step 1: Collect source and destination positions
  const sources = []; // positions with excess stones
  const dests = []; // positions needing stones

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[r][c] > 1) {
        // Add multiple entries for multiple excess stones
        for (let i = 0; i < grid[r][c] - 1; i++) {
          sources.push([r, c]);
        }
      } else if (grid[r][c] === 0) {
        dests.push([r, c]);
      }
    }
  }

  const k = sources.length; // number of stones to move
  const m = dests.length; // number of empty cells

  // Step 2: Precompute cost matrix
  // cost[i][j] = Manhattan distance from source i to destination j
  const cost = Array(k)
    .fill()
    .map(() => Array(m).fill(0));
  for (let i = 0; i < k; i++) {
    const [sr, sc] = sources[i];
    for (let j = 0; j < m; j++) {
      const [dr, dc] = dests[j];
      cost[i][j] = Math.abs(sr - dr) + Math.abs(sc - dc);
    }
  }

  // Step 3: DP with bitmask
  // dp[mask] = min cost to fill destinations marked in mask
  let dp = new Array(1 << m).fill(Infinity);
  dp[0] = 0; // no destinations filled yet

  // For each stone (source), try to place it in any available destination
  for (let i = 0; i < k; i++) {
    const newDp = new Array(1 << m).fill(Infinity);

    for (let mask = 0; mask < 1 << m; mask++) {
      if (dp[mask] === Infinity) continue;

      // Try placing current stone in any unfilled destination
      for (let j = 0; j < m; j++) {
        if (!((mask >> j) & 1)) {
          // destination j is available
          const newMask = mask | (1 << j);
          newDp[newMask] = Math.min(newDp[newMask], dp[mask] + cost[i][j]);
        }
      }
    }

    dp = newDp;
  }

  // Return minimum cost to fill all destinations
  return dp[(1 << m) - 1];
};
```

```java
// Time: O(k * m * 2^m) where k = number of excess stones, m = number of empty cells
// Space: O(k * 2^m) for DP table
class Solution {
    public int minimumMoves(int[][] grid) {
        // Step 1: Collect source and destination positions
        List<int[]> sources = new ArrayList<>();  // positions with excess stones
        List<int[]> dests = new ArrayList<>();    // positions needing stones

        for (int r = 0; r < 3; r++) {
            for (int c = 0; c < 3; c++) {
                if (grid[r][c] > 1) {
                    // Add multiple entries for multiple excess stones
                    for (int i = 0; i < grid[r][c] - 1; i++) {
                        sources.add(new int[]{r, c});
                    }
                } else if (grid[r][c] == 0) {
                    dests.add(new int[]{r, c});
                }
            }
        }

        int k = sources.size();  // number of stones to move
        int m = dests.size();    // number of empty cells

        // Step 2: Precompute cost matrix
        // cost[i][j] = Manhattan distance from source i to destination j
        int[][] cost = new int[k][m];
        for (int i = 0; i < k; i++) {
            int[] src = sources.get(i);
            int sr = src[0], sc = src[1];
            for (int j = 0; j < m; j++) {
                int[] dst = dests.get(j);
                int dr = dst[0], dc = dst[1];
                cost[i][j] = Math.abs(sr - dr) + Math.abs(sc - dc);
            }
        }

        // Step 3: DP with bitmask
        // dp[mask] = min cost to fill destinations marked in mask
        int[] dp = new int[1 << m];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;  // no destinations filled yet

        // For each stone (source), try to place it in any available destination
        for (int i = 0; i < k; i++) {
            int[] newDp = new int[1 << m];
            Arrays.fill(newDp, Integer.MAX_VALUE);

            for (int mask = 0; mask < (1 << m); mask++) {
                if (dp[mask] == Integer.MAX_VALUE) continue;

                // Try placing current stone in any unfilled destination
                for (int j = 0; j < m; j++) {
                    if ((mask >> j & 1) == 0) {  // destination j is available
                        int newMask = mask | (1 << j);
                        int newCost = dp[mask] + cost[i][j];
                        if (newCost < newDp[newMask]) {
                            newDp[newMask] = newCost;
                        }
                    }
                }
            }

            dp = newDp;
        }

        // Return minimum cost to fill all destinations
        return dp[(1 << m) - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(k × m × 2^m)

- k = number of excess stones to move (≤ 8)
- m = number of empty cells (≤ 8)
- For each of k stones, we iterate over all 2^m masks and for each mask, try all m destinations
- In worst case, k = m = 8, giving 8 × 8 × 2^8 = 8 × 8 × 256 = 16,384 operations

**Space Complexity:** O(k × 2^m)

- We store the cost matrix: O(k × m)
- DP array: O(2^m)
- In practice, we use O(2^m) for the DP array and recreate it k times

The constraints make this feasible: 3×3 grid means at most 8 stones to move and 8 empty cells.

## Common Mistakes

1. **Treating stones from the same cell as distinct**: This leads to overcounting permutations. Stones from the same cell are identical - moving stone A from cell X to Y and stone B from cell X to Z is the same as moving B to Y and A to Z.

2. **Using greedy assignment**: A common mistake is to always pair the closest source and destination. This doesn't work because early greedy choices can force expensive later assignments. Example: sources at (0,0) and (2,2), destinations at (0,2) and (2,0). Greedy would pair (0,0)-(0,2)=2 and (2,2)-(2,0)=2 total 4, but optimal is (0,0)-(2,0)=2 and (2,2)-(0,2)=2 also total 4 (in this case same, but other examples show difference).

3. **Forgetting that total stones = 9**: Some solutions incorrectly handle cases where k ≠ m. But since there are exactly 9 stones total, the number of excess stones must equal the number of empty cells. Each stone moved from an overfull cell fills exactly one empty cell.

4. **Incorrect Manhattan distance calculation**: The distance is |r1-r2| + |c1-c2|, not Euclidean distance or max(|r1-r2|, |c1-c2|).

## When You'll See This Pattern

This **minimum cost assignment with bitmask DP** pattern appears in problems where you need to match items from one set to another with minimum total cost:

1. **Minimum Cost to Connect Two Groups of Points** (LeetCode 1595): Connect each point in group A to at least one point in group B with minimum total distance. Uses similar DP with bitmask to track which B points are connected.

2. **Campus Bikes II** (LeetCode 1066): Assign bikes to workers to minimize total Manhattan distance. Exactly the same pattern but with variable numbers of bikes and workers.

3. **Maximum Compatibility Score Sum** (LeetCode 1947): Assign students to mentors to maximize compatibility score. Uses bitmask DP to track which mentors are assigned.

The key signature is: "Assign each of N items to one of M slots with different costs for each pairing, minimize total cost."

## Key Takeaways

1. **Recognize assignment problems**: When you need to match items from two sets with pairwise costs and want to minimize total cost, think of minimum cost bipartite matching. For small N (≤ 16), bitmask DP is often the right approach.

2. **Bitmask DP for small sets**: When the number of items to assign is small (≤ 16), use bitmask to represent which slots are filled. DP state is typically (items_assigned_so_far, mask_of_filled_slots).

3. **Precompute costs**: Always precompute the cost matrix before DP to avoid recomputing distances repeatedly during the DP transitions.

Related problems: [Minimum Number of Operations to Move All Balls to Each Box](/problem/minimum-number-of-operations-to-move-all-balls-to-each-box), [Minimum Number of Operations to Make X and Y Equal](/problem/minimum-number-of-operations-to-make-x-and-y-equal)
