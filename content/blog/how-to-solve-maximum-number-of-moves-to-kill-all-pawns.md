---
title: "How to Solve Maximum Number of Moves to Kill All Pawns — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Moves to Kill All Pawns. Hard difficulty, 33.7% acceptance rate. Topics: Array, Math, Bit Manipulation, Breadth-First Search, Game Theory."
date: "2026-07-18"
category: "dsa-patterns"
tags: ["maximum-number-of-moves-to-kill-all-pawns", "array", "math", "bit-manipulation", "hard"]
---

# How to Solve Maximum Number of Moves to Kill All Pawns

This problem presents a chessboard with one knight and multiple pawns. The knight moves in its standard L-shaped pattern, and the goal is to determine the maximum number of moves needed for the knight to capture all pawns, visiting each pawn exactly once in any order. The challenge lies in the combinatorial explosion: with up to 15 pawns on a 50×50 board, we need to compute pairwise distances efficiently and then solve what's essentially a traveling salesman problem with a twist—we can start from any pawn after reaching the first one from the knight's starting position.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have:

- Knight at (0, 0)
- Pawns at [(1, 2), (2, 2), (3, 3)]

First, we need to understand the knight's movement. From (0, 0), the knight can move to eight possible positions: (±1, ±2) and (±2, ±1). So from (0, 0), valid moves include (1, 2), (2, 1), (-1, 2), etc. (though negative coordinates would be off-board in our problem).

**Step 1: Compute distances between all points**
We need:

1. Distance from knight to each pawn
2. Distance between every pair of pawns

For our example:

- Knight to pawn distances:
  - (0,0)→(1,2): 1 move (directly reachable)
  - (0,0)→(2,2): Let's trace: (0,0)→(1,2)→(2,0)→(3,2)→(2,2) = 4 moves
  - (0,0)→(3,3): (0,0)→(1,2)→(2,4)→(3,2)→(4,4)→(3,3) = 5 moves

**Step 2: The combinatorial challenge**
We need to find the visiting order that maximizes total moves. Since we want the _maximum_ number of moves, we want to find the longest path that visits all pawns exactly once, starting from the knight.

Consider two possible orders:

1. (1,2)→(2,2)→(3,3): 1 + distance(1,2→2,2) + distance(2,2→3,3)
2. (1,2)→(3,3)→(2,2): 1 + distance(1,2→3,3) + distance(3,3→2,2)

We need to compute all pairwise distances to evaluate these permutations.

**Step 3: Key insight**
The maximum path will be some permutation of the pawns. With n pawns, there are n! possible orders—far too many to brute force for n=15 (15! ≈ 1.3 trillion). We need a smarter approach using dynamic programming with bitmasking.

## Brute Force Approach

A naive brute force solution would:

1. Generate all permutations of pawn visiting orders
2. For each permutation, compute the total moves:
   - Distance from knight to first pawn
   - Plus distances between consecutive pawns in the order
3. Track the maximum total

The code would look something like this:

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW FOR n=15
from itertools import permutations

def maxMovesBruteForce(kx, ky, positions):
    n = len(positions)
    max_total = 0

    # Precompute distances (simplified - actual BFS needed)
    # This is already problematic for brute force

    for perm in permutations(range(n)):
        total = distance(kx, ky, positions[perm[0]])
        for i in range(n-1):
            total += distance_between(positions[perm[i]], positions[perm[i+1]])
        max_total = max(max_total, total)

    return max_total
```

```javascript
// BRUTE FORCE - TOO SLOW
function maxMovesBruteForce(kx, ky, positions) {
  const n = positions.length;
  let maxTotal = 0;

  // Generate all permutations (implementation omitted for brevity)
  // For each permutation, compute total distance

  return maxTotal;
}
```

```java
// BRUTE FORCE - TOO SLOW
public int maxMovesBruteForce(int kx, int ky, int[][] positions) {
    int n = positions.length;
    int maxTotal = 0;

    // Generate all permutations - factorial complexity O(n!)
    // This is infeasible for n=15

    return maxTotal;
}
```

</div>

**Why this fails:**

- Time complexity: O(n! × n) for n=15 pawns, which is astronomically large (~1.3 trillion permutations)
- Even with precomputed distances, the permutation generation alone is impossible
- We need to exploit the structure of the problem to avoid examining all permutations

## Optimized Approach

The key insight is that this is a variation of the **Traveling Salesman Problem (TSP)** where:

- Cities = pawn positions
- Start = knight's position (but we only travel from knight to the first pawn)
- We want the _maximum_ Hamiltonian path (not cycle) starting from the knight

We can solve this with **Dynamic Programming with Bitmasking**:

1. **State**: dp[mask][last] = maximum moves to visit all pawns in 'mask', ending at pawn 'last'
   - mask: bitmask representing which pawns have been visited (1=visited, 0=not visited)
   - last: index of the last pawn visited in this path
2. **Transition**: To extend a path, we try adding an unvisited pawn 'next':
   dp[mask | (1<<next)][next] = max(dp[mask | (1<<next)][next], dp[mask][last] + dist[last][next])
3. **Base case**: dp[1<<i][i] = dist_knight[i] (starting from knight to pawn i)
4. **Answer**: max over all dp[full_mask][last] where full_mask = (1<<n)-1

**Why this works:**

- We're still considering all possible visiting orders, but we're using DP to avoid recomputation
- Each state (mask, last) represents all permutations that visit exactly those pawns and end at 'last'
- Time complexity drops from O(n!) to O(n² × 2^n), which is feasible for n=15 (15² × 2¹⁵ ≈ 7.4 million operations)

**Additional optimization**: We need efficient computation of all pairwise distances. Since the board is 50×50, we can use BFS from each pawn position and the knight's position to compute distances to all other positions.

## Optimal Solution

Here's the complete optimal solution with detailed comments:

<div class="code-group">

```python
from collections import deque
from typing import List

class Solution:
    def maxMoves(self, kx: int, ky: int, positions: List[List[int]]) -> int:
        """
        Main solution using BFS for distance computation and DP with bitmasking.
        Time: O(n^2 * 2^n + n * BFS) where n <= 15, BFS on 50x50 board
        Space: O(n^2 + n * 2^n)
        """
        n = len(positions)
        if n == 0:
            return 0

        # Knight's possible moves (8 directions)
        moves = [(2, 1), (2, -1), (-2, 1), (-2, -1),
                 (1, 2), (1, -2), (-1, 2), (-1, -2)]

        def bfs(start_x, start_y):
            """
            BFS to compute shortest path from (start_x, start_y) to all board positions.
            Returns a 50x50 grid of distances, -1 if unreachable.
            """
            dist = [[-1] * 50 for _ in range(50)]
            q = deque()
            q.append((start_x, start_y))
            dist[start_x][start_y] = 0

            while q:
                x, y = q.popleft()
                for dx, dy in moves:
                    nx, ny = x + dx, y + dy
                    # Check bounds and if not visited
                    if 0 <= nx < 50 and 0 <= ny < 50 and dist[nx][ny] == -1:
                        dist[nx][ny] = dist[x][y] + 1
                        q.append((nx, ny))
            return dist

        # Step 1: Compute distances from knight to all pawns
        knight_dist_grid = bfs(kx, ky)
        dist_from_knight = [0] * n
        for i in range(n):
            px, py = positions[i]
            dist_from_knight[i] = knight_dist_grid[px][py]
            # If any pawn is unreachable from knight, it's impossible
            if dist_from_knight[i] == -1:
                return -1

        # Step 2: Compute pairwise distances between pawns using BFS from each pawn
        # dist_between[i][j] = shortest path from pawn i to pawn j
        dist_between = [[0] * n for _ in range(n)]
        pawn_dist_grids = []

        for i in range(n):
            px, py = positions[i]
            grid = bfs(px, py)
            pawn_dist_grids.append(grid)

        # Fill the distance matrix
        for i in range(n):
            for j in range(n):
                if i == j:
                    dist_between[i][j] = 0
                else:
                    px, py = positions[j]
                    dist_between[i][j] = pawn_dist_grids[i][px][py]
                    # If any pawn is unreachable from another, it's impossible
                    if dist_between[i][j] == -1:
                        return -1

        # Step 3: DP with bitmasking
        # dp[mask][last] = max moves to visit pawns in mask, ending at pawn 'last'
        dp = [[-1] * n for _ in range(1 << n)]

        # Initialize: starting from knight to each pawn
        for i in range(n):
            dp[1 << i][i] = dist_from_knight[i]

        # Iterate over all masks
        for mask in range(1 << n):
            for last in range(n):
                if dp[mask][last] == -1:
                    continue  # This state is not reachable

                # Try to extend the path by visiting a new pawn
                for next_pawn in range(n):
                    if mask & (1 << next_pawn):
                        continue  # Already visited

                    new_mask = mask | (1 << next_pawn)
                    new_dist = dp[mask][last] + dist_between[last][next_pawn]

                    # Update if we found a longer path
                    if dp[new_mask][next_pawn] < new_dist:
                        dp[new_mask][next_pawn] = new_dist

        # Step 4: Find the maximum among all complete paths
        full_mask = (1 << n) - 1
        max_moves = 0
        for last in range(n):
            if dp[full_mask][last] > max_moves:
                max_moves = dp[full_mask][last]

        return max_moves
```

```javascript
/**
 * @param {number} kx
 * @param {number} ky
 * @param {number[][]} positions
 * @return {number}
 */
var maxMoves = function (kx, ky, positions) {
  // Time: O(n^2 * 2^n + n * BFS) where n <= 15
  // Space: O(n^2 + n * 2^n)

  const n = positions.length;
  if (n === 0) return 0;

  // Knight's 8 possible moves
  const moves = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ];

  // BFS helper function
  const bfs = (startX, startY) => {
    const dist = Array(50)
      .fill()
      .map(() => Array(50).fill(-1));
    const queue = [[startX, startY]];
    dist[startX][startY] = 0;

    while (queue.length > 0) {
      const [x, y] = queue.shift();

      for (const [dx, dy] of moves) {
        const nx = x + dx;
        const ny = y + dy;

        // Check bounds and if not visited
        if (nx >= 0 && nx < 50 && ny >= 0 && ny < 50 && dist[nx][ny] === -1) {
          dist[nx][ny] = dist[x][y] + 1;
          queue.push([nx, ny]);
        }
      }
    }
    return dist;
  };

  // Step 1: Compute distances from knight to all pawns
  const knightDistGrid = bfs(kx, ky);
  const distFromKnight = new Array(n);

  for (let i = 0; i < n; i++) {
    const [px, py] = positions[i];
    distFromKnight[i] = knightDistGrid[px][py];

    // If any pawn is unreachable, return -1
    if (distFromKnight[i] === -1) {
      return -1;
    }
  }

  // Step 2: Compute pairwise distances between pawns
  const distBetween = Array(n)
    .fill()
    .map(() => Array(n).fill(0));
  const pawnDistGrids = [];

  // Run BFS from each pawn
  for (let i = 0; i < n; i++) {
    const [px, py] = positions[i];
    pawnDistGrids.push(bfs(px, py));
  }

  // Fill distance matrix
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        distBetween[i][j] = 0;
      } else {
        const [px, py] = positions[j];
        distBetween[i][j] = pawnDistGrids[i][px][py];

        // Check if reachable
        if (distBetween[i][j] === -1) {
          return -1;
        }
      }
    }
  }

  // Step 3: DP with bitmasking
  // dp[mask][last] = max moves
  const dp = Array(1 << n)
    .fill()
    .map(() => Array(n).fill(-1));

  // Initialize: knight to each pawn
  for (let i = 0; i < n; i++) {
    dp[1 << i][i] = distFromKnight[i];
  }

  // Iterate over all masks
  for (let mask = 0; mask < 1 << n; mask++) {
    for (let last = 0; last < n; last++) {
      if (dp[mask][last] === -1) continue;

      // Try to extend path
      for (let nextPawn = 0; nextPawn < n; nextPawn++) {
        if (mask & (1 << nextPawn)) continue;

        const newMask = mask | (1 << nextPawn);
        const newDist = dp[mask][last] + distBetween[last][nextPawn];

        if (dp[newMask][nextPawn] < newDist) {
          dp[newMask][nextPawn] = newDist;
        }
      }
    }
  }

  // Step 4: Find maximum complete path
  const fullMask = (1 << n) - 1;
  let maxMoves = 0;

  for (let last = 0; last < n; last++) {
    if (dp[fullMask][last] > maxMoves) {
      maxMoves = dp[fullMask][last];
    }
  }

  return maxMoves;
};
```

```java
import java.util.*;

class Solution {
    // Knight's 8 possible moves
    private static final int[][] MOVES = {
        {2, 1}, {2, -1}, {-2, 1}, {-2, -1},
        {1, 2}, {1, -2}, {-1, 2}, {-1, -2}
    };

    public int maxMoves(int kx, int ky, int[][] positions) {
        // Time: O(n^2 * 2^n + n * BFS) where n <= 15
        // Space: O(n^2 + n * 2^n)

        int n = positions.length;
        if (n == 0) return 0;

        // Step 1: Compute distances from knight to all pawns
        int[][] knightDistGrid = bfs(kx, ky);
        int[] distFromKnight = new int[n];

        for (int i = 0; i < n; i++) {
            int px = positions[i][0];
            int py = positions[i][1];
            distFromKnight[i] = knightDistGrid[px][py];

            // If unreachable, return -1
            if (distFromKnight[i] == -1) {
                return -1;
            }
        }

        // Step 2: Compute pairwise distances between pawns
        int[][] distBetween = new int[n][n];
        List<int[][]> pawnDistGrids = new ArrayList<>();

        // Run BFS from each pawn
        for (int i = 0; i < n; i++) {
            int px = positions[i][0];
            int py = positions[i][1];
            pawnDistGrids.add(bfs(px, py));
        }

        // Fill distance matrix
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) {
                    distBetween[i][j] = 0;
                } else {
                    int px = positions[j][0];
                    int py = positions[j][1];
                    distBetween[i][j] = pawnDistGrids.get(i)[px][py];

                    // Check if reachable
                    if (distBetween[i][j] == -1) {
                        return -1;
                    }
                }
            }
        }

        // Step 3: DP with bitmasking
        // dp[mask][last] = max moves
        int[][] dp = new int[1 << n][n];
        for (int[] row : dp) {
            Arrays.fill(row, -1);
        }

        // Initialize: knight to each pawn
        for (int i = 0; i < n; i++) {
            dp[1 << i][i] = distFromKnight[i];
        }

        // Iterate over all masks
        for (int mask = 0; mask < (1 << n); mask++) {
            for (int last = 0; last < n; last++) {
                if (dp[mask][last] == -1) continue;

                // Try to extend path
                for (int nextPawn = 0; nextPawn < n; nextPawn++) {
                    if ((mask & (1 << nextPawn)) != 0) continue;

                    int newMask = mask | (1 << nextPawn);
                    int newDist = dp[mask][last] + distBetween[last][nextPawn];

                    if (dp[newMask][nextPawn] < newDist) {
                        dp[newMask][nextPawn] = newDist;
                    }
                }
            }
        }

        // Step 4: Find maximum complete path
        int fullMask = (1 << n) - 1;
        int maxMoves = 0;

        for (int last = 0; last < n; last++) {
            if (dp[fullMask][last] > maxMoves) {
                maxMoves = dp[fullMask][last];
            }
        }

        return maxMoves;
    }

    private int[][] bfs(int startX, int startY) {
        int[][] dist = new int[50][50];
        for (int[] row : dist) {
            Arrays.fill(row, -1);
        }

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{startX, startY});
        dist[startX][startY] = 0;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int x = curr[0], y = curr[1];

            for (int[] move : MOVES) {
                int nx = x + move[0];
                int ny = y + move[1];

                // Check bounds and if not visited
                if (nx >= 0 && nx < 50 && ny >= 0 && ny < 50 && dist[nx][ny] == -1) {
                    dist[nx][ny] = dist[x][y] + 1;
                    queue.offer(new int[]{nx, ny});
                }
            }
        }

        return dist;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

1. **BFS computations**: O(n × 50 × 50 × 8) = O(20000n) ≈ O(n) for n ≤ 15
   - Each BFS explores at most 2500 cells with 8 neighbors each
   - We run BFS from knight + each pawn = (n+1) times
2. **DP with bitmasking**: O(n² × 2^n)
   - We have 2^n masks and n possible ending positions
   - For each state, we try extending to n possible next pawns
   - For n=15: 15² × 2¹⁵ ≈ 225 × 32768 ≈ 7.4 million operations
3. **Total**: O(n² × 2^n + n × BFS) which is feasible for n ≤ 15

**Space Complexity:**

1. **Distance grids**: O(n × 50 × 50) = O(2500n) for storing BFS results
2. **Distance matrices**: O(n²) for pairwise distances
3. **DP table**: O(2^n × n) for the dp array
4. **Total**: O(n² + n × 2^n + 2500n) ≈ O(n² + n × 2^n) for n ≤ 15

## Common Mistakes

1. **Forgetting to check reachability**: The knight might not be able to reach some pawns due to board constraints. Always check if BFS returns -1 for any pawn position and return -1 immediately if so.

2. **Incorrect BFS implementation**: Knight moves are L-shaped (±2, ±1) and (±1, ±2). A common mistake is using rook or queen moves instead. Double-check the move offsets.

3. **Off-by-one errors in bitmasking**: When using 1 << i for bitmask operations, remember that i should be 0-indexed. Also, the full mask is (1 << n) - 1, not (1 << n).

4. **Not handling the empty case**: If there are no pawns, the answer should be 0, not -1. Always check for edge cases at the beginning.

5. **Confusing maximum with minimum**: The problem asks for the _maximum_ number of moves, not the minimum. This affects the DP initialization and updates (we use max() instead of min()).

## When You'll See This Pattern

This problem combines several important algorithmic patterns:

1. **BFS on grid**: Used for computing shortest paths with non-standard movement (knight moves). Similar to:
   - **Knight Probability in Chessboard** (LeetCode 688): Also involves knight moves on a chessboard
   - **Minimum Knight Moves** (LeetCode 1197): Computing shortest path for a knight

2. **DP with Bitmasking (Traveling Salesman)**: The core of solving the path optimization. Similar to:
   - **Maximum Vacation Days** (LeetCode 568): DP with bitmasking for city visits
   - **Shortest Path Visiting All Nodes** (LeetCode 847): Bitmask DP for graph traversal

3. **Hamiltonian Path**: Finding a path that visits all nodes exactly once. The "maximum" variant is less common but uses the same state representation as the standard TSP.

## Key Takeaways

1. **When you need to consider all permutations but n is small (≤ 20)**, think about DP with bitmasking. The state (mask, last) efficiently represents all paths visiting specific nodes and ending at a particular node.

2. **For grid-based movement problems**, BFS is your go-to for shortest path computation when all moves have equal cost. Remember to handle the specific movement rules correctly.

3. **The combination of BFS precomputation + DP** is powerful: Use BFS to compute all pairwise distances efficiently, then use DP to solve the combinatorial optimization problem on the complete distance graph.

4. **Always check reachability first**: Before attempting complex optimization, verify that all points are reachable from each other. This can save computation and handle edge cases properly.

Related problems: [Knight Probability in Chessboard](/problem/knight-probability-in-chessboard), [Check Knight Tour Configuration](/problem/check-knight-tour-configuration)
