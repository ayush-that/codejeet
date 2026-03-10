---
title: "How to Solve Minimum Moves to Clean the Classroom — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Clean the Classroom. Medium difficulty, 26.5% acceptance rate. Topics: Array, Hash Table, Bit Manipulation, Breadth-First Search, Matrix."
date: "2026-06-18"
category: "dsa-patterns"
tags: ["minimum-moves-to-clean-the-classroom", "array", "hash-table", "bit-manipulation", "medium"]
---

# How to Solve Minimum Moves to Clean the Classroom

This problem asks us to find the minimum number of moves for a student to collect all litter in a classroom grid, where they can move in four directions and each move counts as one step. The challenge comes from needing to collect multiple pieces of litter in any order, which creates a shortest path problem with multiple destinations—a classic traveling salesman variation on a grid.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
S . L
. . .
L . .

Coordinates:
S at (0,0)
L at (0,2)
L at (2,0)
```

The student needs to collect both litter pieces. Possible sequences:

1. Go to (0,2) first (2 moves), then to (2,0) (4 more moves) = 6 moves
2. Go to (2,0) first (2 moves), then to (0,2) (4 more moves) = 6 moves

But wait—what if we take a smarter path? Actually, both sequences give 6 moves. Let's verify:

- Path 1: (0,0) → (0,1) → (0,2) = 2 moves, collect first litter
- Then: (0,2) → (1,2) → (2,2) → (2,1) → (2,0) = 4 moves, collect second litter
- Total: 6 moves

The key insight: we need to calculate distances between all points (start + litter locations), then find the optimal order to visit them all.

## Brute Force Approach

A naive approach would be:

1. Find all litter locations and the starting position
2. Generate all possible permutations of visiting the litter locations
3. For each permutation, calculate the total distance by summing Manhattan distances between consecutive points in the path
4. Return the minimum total distance

Why this fails: If there are k pieces of litter, there are k! permutations. For k=10, that's 3.6 million permutations. For each permutation, we need to calculate k+1 distances. This becomes computationally infeasible even for moderate k.

The brute force also misses a crucial optimization: we can reuse precomputed shortest path distances between all points using BFS (since the grid might have obstacles, though in the basic version without obstacles, Manhattan distance works).

## Optimized Approach

The key insight is to break this into two subproblems:

1. **Distance Calculation**: We need the shortest path distance between every pair of relevant points (start position + all litter locations). Since the grid allows 4-directional movement and has no obstacles in the basic problem, the Manhattan distance works: `|x1-x2| + |y1-y2|`. If obstacles were present, we'd use BFS from each point.

2. **Path Optimization**: Once we have a distance matrix between all points, this becomes the Traveling Salesman Problem (TSP) on a small graph. We can solve it using dynamic programming with bitmasking.

The DP state: `dp[mask][last]` = minimum distance to visit all litter pieces represented by `mask` (bitmask where bit i is 1 if litter i has been collected), ending at litter location `last`.

Transition: `dp[mask][last] = min(dp[mask_without_last][prev] + dist[prev][last])` for all `prev` where we came from.

The answer is the minimum of `dp[full_mask][last]` over all possible ending litter locations.

## Optimal Solution

Here's the complete solution implementing the optimized approach:

<div class="code-group">

```python
# Time: O(k^2 * 2^k) where k is number of litter pieces
# Space: O(k * 2^k) for DP table
from typing import List

class Solution:
    def minMovesToClean(self, classroom: List[List[str]]) -> int:
        m, n = len(classroom), len(classroom[0])

        # Step 1: Find all important positions (start + litter)
        positions = []
        start_idx = -1

        for i in range(m):
            for j in range(n):
                if classroom[i][j] == 'S':
                    positions.append((i, j))
                    start_idx = len(positions) - 1
                elif classroom[i][j] == 'L':
                    positions.append((i, j))

        k = len(positions)  # Total points including start

        # Step 2: Calculate distance matrix between all points
        # Since no obstacles, use Manhattan distance
        dist = [[0] * k for _ in range(k)]
        for i in range(k):
            x1, y1 = positions[i]
            for j in range(i + 1, k):
                x2, y2 = positions[j]
                # Manhattan distance for 4-directional movement
                d = abs(x1 - x2) + abs(y1 - y2)
                dist[i][j] = d
                dist[j][i] = d

        # Step 3: DP with bitmask for TSP
        # dp[mask][last] = min distance to visit all in mask, ending at last
        full_mask = (1 << k) - 1  # All bits set for all points
        dp = [[float('inf')] * k for _ in range(1 << k)]

        # Initialize: starting from the start position
        start_mask = 1 << start_idx
        dp[start_mask][start_idx] = 0

        # Iterate over all masks
        for mask in range(1 << k):
            # Only consider masks that include the start position
            if not (mask & start_mask):
                continue

            for last in range(k):
                if dp[mask][last] == float('inf'):
                    continue

                # Try to go to an unvisited point
                for nxt in range(k):
                    if mask & (1 << nxt):  # Already visited
                        continue

                    new_mask = mask | (1 << nxt)
                    new_dist = dp[mask][last] + dist[last][nxt]
                    dp[new_mask][nxt] = min(dp[new_mask][nxt], new_dist)

        # Step 4: Find minimum distance to visit all litter
        # We need to end after visiting all points (full_mask)
        min_moves = float('inf')
        for last in range(k):
            min_moves = min(min_moves, dp[full_mask][last])

        return min_moves
```

```javascript
// Time: O(k^2 * 2^k) where k is number of litter pieces + start
// Space: O(k * 2^k) for DP table
function minMovesToClean(classroom) {
  const m = classroom.length;
  const n = classroom[0].length;

  // Step 1: Find all important positions (start + litter)
  const positions = [];
  let startIdx = -1;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (classroom[i][j] === "S") {
        positions.push([i, j]);
        startIdx = positions.length - 1;
      } else if (classroom[i][j] === "L") {
        positions.push([i, j]);
      }
    }
  }

  const k = positions.length; // Total points including start

  // Step 2: Calculate distance matrix between all points
  // Since no obstacles, use Manhattan distance
  const dist = Array(k)
    .fill()
    .map(() => Array(k).fill(0));
  for (let i = 0; i < k; i++) {
    const [x1, y1] = positions[i];
    for (let j = i + 1; j < k; j++) {
      const [x2, y2] = positions[j];
      // Manhattan distance for 4-directional movement
      const d = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      dist[i][j] = d;
      dist[j][i] = d;
    }
  }

  // Step 3: DP with bitmask for TSP
  // dp[mask][last] = min distance to visit all in mask, ending at last
  const fullMask = (1 << k) - 1; // All bits set for all points
  const dp = Array(1 << k)
    .fill()
    .map(() => Array(k).fill(Infinity));

  // Initialize: starting from the start position
  const startMask = 1 << startIdx;
  dp[startMask][startIdx] = 0;

  // Iterate over all masks
  for (let mask = 0; mask < 1 << k; mask++) {
    // Only consider masks that include the start position
    if (!(mask & startMask)) continue;

    for (let last = 0; last < k; last++) {
      if (dp[mask][last] === Infinity) continue;

      // Try to go to an unvisited point
      for (let nxt = 0; nxt < k; nxt++) {
        if (mask & (1 << nxt)) continue; // Already visited

        const newMask = mask | (1 << nxt);
        const newDist = dp[mask][last] + dist[last][nxt];
        dp[newMask][nxt] = Math.min(dp[newMask][nxt], newDist);
      }
    }
  }

  // Step 4: Find minimum distance to visit all litter
  // We need to end after visiting all points (fullMask)
  let minMoves = Infinity;
  for (let last = 0; last < k; last++) {
    minMoves = Math.min(minMoves, dp[fullMask][last]);
  }

  return minMoves;
}
```

```java
// Time: O(k^2 * 2^k) where k is number of litter pieces + start
// Space: O(k * 2^k) for DP table
import java.util.*;

class Solution {
    public int minMovesToClean(char[][] classroom) {
        int m = classroom.length;
        int n = classroom[0].length;

        // Step 1: Find all important positions (start + litter)
        List<int[]> positions = new ArrayList<>();
        int startIdx = -1;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (classroom[i][j] == 'S') {
                    positions.add(new int[]{i, j});
                    startIdx = positions.size() - 1;
                } else if (classroom[i][j] == 'L') {
                    positions.add(new int[]{i, j});
                }
            }
        }

        int k = positions.size();  // Total points including start

        // Step 2: Calculate distance matrix between all points
        // Since no obstacles, use Manhattan distance
        int[][] dist = new int[k][k];
        for (int i = 0; i < k; i++) {
            int x1 = positions.get(i)[0];
            int y1 = positions.get(i)[1];
            for (int j = i + 1; j < k; j++) {
                int x2 = positions.get(j)[0];
                int y2 = positions.get(j)[1];
                // Manhattan distance for 4-directional movement
                int d = Math.abs(x1 - x2) + Math.abs(y1 - y2);
                dist[i][j] = d;
                dist[j][i] = d;
            }
        }

        // Step 3: DP with bitmask for TSP
        // dp[mask][last] = min distance to visit all in mask, ending at last
        int fullMask = (1 << k) - 1;  // All bits set for all points
        int[][] dp = new int[1 << k][k];
        for (int[] row : dp) {
            Arrays.fill(row, Integer.MAX_VALUE);
        }

        // Initialize: starting from the start position
        int startMask = 1 << startIdx;
        dp[startMask][startIdx] = 0;

        // Iterate over all masks
        for (int mask = 0; mask < (1 << k); mask++) {
            // Only consider masks that include the start position
            if ((mask & startMask) == 0) continue;

            for (int last = 0; last < k; last++) {
                if (dp[mask][last] == Integer.MAX_VALUE) continue;

                // Try to go to an unvisited point
                for (int nxt = 0; nxt < k; nxt++) {
                    if ((mask & (1 << nxt)) != 0) continue;  // Already visited

                    int newMask = mask | (1 << nxt);
                    int newDist = dp[mask][last] + dist[last][nxt];
                    if (newDist < dp[newMask][nxt]) {
                        dp[newMask][nxt] = newDist;
                    }
                }
            }
        }

        // Step 4: Find minimum distance to visit all litter
        // We need to end after visiting all points (fullMask)
        int minMoves = Integer.MAX_VALUE;
        for (int last = 0; last < k; last++) {
            minMoves = Math.min(minMoves, dp[fullMask][last]);
        }

        return minMoves;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(k² × 2^k) where k is the number of litter pieces plus the start position. Here's why:

- Distance matrix calculation: O(k²) to compute all pairwise distances
- DP with bitmask: We have 2^k possible masks and for each mask, we iterate over k possible last positions, and for each of those, we try k possible next positions → O(k² × 2^k)

**Space Complexity:** O(k × 2^k) for the DP table storing one value for each (mask, last) combination.

This complexity is acceptable because k (number of litter pieces) is typically small in such problems (usually ≤ 15). For larger k, we'd need heuristic approaches instead of exact solutions.

## Common Mistakes

1. **Using Euclidean distance instead of Manhattan distance**: The student moves in 4 directions (up, down, left, right), not diagonally. Manhattan distance (`|x1-x2| + |y1-y2|`) is correct; Euclidean would underestimate the actual moves needed.

2. **Forgetting to include the start position in the TSP graph**: The path must start at 'S', so we need to include it as a node in our distance matrix and ensure our DP starts from there.

3. **Incorrect bitmask initialization**: Starting with mask = 0 and last = start_idx won't work because mask=0 means "no points visited". We need to initialize with the start position already visited (mask with bit start_idx set to 1).

4. **Not handling the case when there's no litter**: If there are no 'L' cells, the answer should be 0 (student doesn't need to move). Our solution handles this because k=1 (only start position), full_mask = 1, and dp[1][start_idx] = 0.

## When You'll See This Pattern

This "shortest path to visit multiple points" pattern appears in several LeetCode problems:

1. **847. Shortest Path Visiting All Nodes**: Similar TSP on a graph, but here the graph is implicit (grid positions). The bitmask DP approach is identical.

2. **864. Shortest Path to Get All Keys**: Another grid problem where you need to collect keys in any order, using BFS with bitmask state.

3. **943. Find the Shortest Superstring**: Different context (strings) but similar DP with bitmask to track which strings have been used.

The core pattern is: when you need to visit multiple targets and the order matters, but the number of targets is small enough (≤ 20), consider TSP with DP + bitmask.

## Key Takeaways

1. **Break complex problems into subproblems**: This problem combines grid pathfinding (Manhattan distance) with combinatorial optimization (TSP). Solving each part separately makes the problem manageable.

2. **Bitmask DP for small sets**: When you need to track which elements of a small set have been visited/used, bitmask representation (integers where bit i = 1 if element i is used) is efficient and enables DP solutions.

3. **Know when Manhattan vs Euclidean applies**: In grid problems with 4-directional movement, Manhattan distance gives the actual shortest path when there are no obstacles. With obstacles, you'd need BFS.

[Practice this problem on CodeJeet](/problem/minimum-moves-to-clean-the-classroom)
