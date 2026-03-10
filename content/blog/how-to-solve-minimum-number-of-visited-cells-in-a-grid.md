---
title: "How to Solve Minimum Number of Visited Cells in a Grid — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Number of Visited Cells in a Grid. Hard difficulty, 23.6% acceptance rate. Topics: Array, Dynamic Programming, Stack, Breadth-First Search, Union-Find."
date: "2026-04-17"
category: "dsa-patterns"
tags: ["minimum-number-of-visited-cells-in-a-grid", "array", "dynamic-programming", "stack", "hard"]
---

# How to Solve Minimum Number of Visited Cells in a Grid

This problem asks you to find the minimum number of cells you need to visit to reach the bottom-right corner of a grid, where from each cell `(i, j)` you can jump right up to `grid[i][j]` columns or down up to `grid[i][j]` rows. What makes this problem tricky is that it's essentially **two-dimensional jump game** — unlike the classic 1D jump game where you only move forward, here you can move in two dimensions, and the jumps can be quite large, making a naive BFS or DP approach too slow.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
    [3, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
]
```

We start at `(0,0)` with value 3. From here we can:

- Move right to columns 1, 2, or 3 (but column 3 doesn't exist, so only 1 and 2)
- Move down to rows 1, 2, or 3 (but row 3 doesn't exist, so only 1 and 2)

Let's track the minimum steps to reach each cell:

- `(0,0)`: 0 steps (starting point)
- From `(0,0)` we can reach:
  - `(0,1)` in 1 step
  - `(0,2)` in 1 step
  - `(1,0)` in 1 step
  - `(2,0)` in 1 step

Now from `(0,1)` (value 1), we can reach:

- `(0,2)` in min(1, 0+1+1) = 1 step (no improvement)
- `(1,1)` in 2 steps

From `(1,0)` (value 1), we can reach:

- `(1,1)` in min(2, 1+1) = 2 steps (no improvement)
- `(2,0)` in min(1, 1+1) = 1 step (no improvement)

Continuing this process, we'd find the minimum steps to reach `(2,2)` is 3. The key insight is that we need to efficiently track which cells we can reach and in how many steps, without checking every possible jump from every cell.

## Brute Force Approach

The most straightforward approach is BFS (Breadth-First Search):

1. Start from `(0,0)` with distance 0
2. For each cell we visit, explore all reachable cells in the same row and column
3. Use a visited set to avoid revisiting cells
4. Return the distance when we reach `(m-1, n-1)`

The problem with this approach is **time complexity**. From each cell `(i, j)` with value `v`, we could explore up to `v` cells to the right and `v` cells down. In the worst case where `v` is large (up to `m+n`), this gives us `O(m*n*(m+n))` operations, which is far too slow for the constraints (grid up to 10^5 cells).

Even a DP approach where `dp[i][j]` stores the minimum steps to reach `(i,j)` would have the same issue — to compute `dp[i][j]`, we'd need to check all cells in row `i` to the left of `j` and all cells in column `j` above `i` that could jump to `(i,j)`.

## Optimized Approach

The key insight is that we need to **process cells in increasing order of distance** (like BFS) but **skip cells we've already reached more efficiently**. Think of it this way:

1. We maintain for each row and column the "next available cell" that hasn't been visited yet
2. When we process a cell `(i, j)` with distance `d`, we want to mark all reachable cells in row `i` and column `j` as having distance `d+1`
3. Instead of marking each cell individually, we use **union-find (disjoint set union)** to skip over already-visited cells

Here's the step-by-step reasoning:

**Why union-find?**

- When we visit a cell, we never need to visit it again
- Instead of checking if each cell in a jump range is visited, we can "skip" to the next unvisited cell
- Union-find lets us efficiently find the next unvisited cell and mark cells as visited

**The algorithm:**

1. Create union-find structures for rows and columns
2. For rows: `rowDSU[i][j]` points to the next available column in row `i`
3. For columns: `colDSU[j][i]` points to the next available row in column `j`
4. Use a BFS queue starting with `(0,0)` at distance 0
5. For each cell `(i, j)` we process:
   - Mark it as visited by unioning it with its neighbor in both DSUs
   - For all unvisited cells reachable in the same row (rightward jumps), add them to queue with distance+1
   - For all unvisited cells reachable in the same column (downward jumps), add them to queue with distance+1
6. Stop when we reach `(m-1, n-1)` or the queue is empty

**Why this is efficient:**

- Each cell is processed at most once
- The union-find operations are nearly constant time
- We skip over already-visited cells without checking them individually

## Optimal Solution

<div class="code-group">

```python
# Time: O(m*n*α(m*n)) where α is the inverse Ackermann function (near constant)
# Space: O(m*n) for the DSU structures and queue
class Solution:
    def minimumVisitedCells(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])

        # If grid has only one cell, we're already at destination
        if m == 1 and n == 1:
            return 1

        # DSU for rows: rowDSU[i][j] = next available column in row i
        # Initialize each column to point to itself
        rowDSU = [[j for j in range(n + 1)] for _ in range(m)]

        # DSU for columns: colDSU[j][i] = next available row in column j
        # Initialize each row to point to itself
        colDSU = [[i for i in range(m + 1)] for _ in range(n)]

        # Helper function to find next available position in DSU
        def find(dsu, index, pos):
            # Path compression: flatten the tree as we search
            if dsu[index][pos] != pos:
                dsu[index][pos] = find(dsu, index, dsu[index][pos])
            return dsu[index][pos]

        # BFS queue: (row, col, distance)
        queue = deque()
        queue.append((0, 0, 1))  # Start at (0,0) with distance 1 (counting the starting cell)

        # Mark (0,0) as visited by unioning it with next column/row
        rowDSU[0][0] = 1
        colDSU[0][0] = 1

        while queue:
            i, j, dist = queue.popleft()

            # Check if we reached the destination
            if i == m - 1 and j == n - 1:
                return dist

            # Maximum reach based on cell value
            maxJump = grid[i][j]

            # Process rightward jumps in the same row
            # Start from next column after current, up to j + maxJump
            col = find(rowDSU, i, j + 1)
            while col <= min(j + maxJump, n - 1):
                # Add this reachable cell to queue
                queue.append((i, col, dist + 1))
                # Mark as visited by unioning with next column
                rowDSU[i][col] = col + 1
                # Also mark in column DSU
                colDSU[col][i] = i + 1
                # Move to next available column
                col = find(rowDSU, i, col)

            # Process downward jumps in the same column
            # Start from next row after current, up to i + maxJump
            row = find(colDSU, j, i + 1)
            while row <= min(i + maxJump, m - 1):
                # Add this reachable cell to queue
                queue.append((row, j, dist + 1))
                # Mark as visited by unioning with next row
                colDSU[j][row] = row + 1
                # Also mark in row DSU
                rowDSU[row][j] = j + 1
                # Move to next available row
                row = find(colDSU, j, row)

        # If we exhaust the queue without reaching destination
        return -1
```

```javascript
// Time: O(m*n*α(m*n)) where α is the inverse Ackermann function
// Space: O(m*n) for the DSU structures and queue
function minimumVisitedCells(grid) {
  const m = grid.length;
  const n = grid[0].length;

  // Single cell grid case
  if (m === 1 && n === 1) {
    return 1;
  }

  // Initialize DSU for rows: each row has array of size n+1
  // rowDSU[i][j] = next available column in row i
  const rowDSU = Array(m);
  for (let i = 0; i < m; i++) {
    rowDSU[i] = Array(n + 1);
    for (let j = 0; j <= n; j++) {
      rowDSU[i][j] = j;
    }
  }

  // Initialize DSU for columns: each column has array of size m+1
  // colDSU[j][i] = next available row in column j
  const colDSU = Array(n);
  for (let j = 0; j < n; j++) {
    colDSU[j] = Array(m + 1);
    for (let i = 0; i <= m; i++) {
      colDSU[j][i] = i;
    }
  }

  // Find with path compression
  const find = (dsu, index, pos) => {
    if (dsu[index][pos] !== pos) {
      dsu[index][pos] = find(dsu, index, dsu[index][pos]);
    }
    return dsu[index][pos];
  };

  // BFS queue: [row, col, distance]
  const queue = [];
  queue.push([0, 0, 1]); // Start with distance 1 (including starting cell)

  // Mark (0,0) as visited
  rowDSU[0][0] = 1;
  colDSU[0][0] = 1;

  while (queue.length > 0) {
    const [i, j, dist] = queue.shift();

    // Check if reached destination
    if (i === m - 1 && j === n - 1) {
      return dist;
    }

    const maxJump = grid[i][j];

    // Process rightward jumps
    let col = find(rowDSU, i, j + 1);
    const maxCol = Math.min(j + maxJump, n - 1);
    while (col <= maxCol) {
      queue.push([i, col, dist + 1]);
      // Mark as visited
      rowDSU[i][col] = col + 1;
      colDSU[col][i] = i + 1;
      // Find next available column
      col = find(rowDSU, i, col);
    }

    // Process downward jumps
    let row = find(colDSU, j, i + 1);
    const maxRow = Math.min(i + maxJump, m - 1);
    while (row <= maxRow) {
      queue.push([row, j, dist + 1]);
      // Mark as visited
      colDSU[j][row] = row + 1;
      rowDSU[row][j] = j + 1;
      // Find next available row
      row = find(colDSU, j, row);
    }
  }

  // Destination not reachable
  return -1;
}
```

```java
// Time: O(m*n*α(m*n)) where α is the inverse Ackermann function
// Space: O(m*n) for the DSU structures and queue
class Solution {
    public int minimumVisitedCells(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // Single cell grid
        if (m == 1 && n == 1) {
            return 1;
        }

        // DSU for rows: rowDSU[i][j] = next available column in row i
        int[][] rowDSU = new int[m][n + 1];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j <= n; j++) {
                rowDSU[i][j] = j;
            }
        }

        // DSU for columns: colDSU[j][i] = next available row in column j
        int[][] colDSU = new int[n][m + 1];
        for (int j = 0; j < n; j++) {
            for (int i = 0; i <= m; i++) {
                colDSU[j][i] = i;
            }
        }

        // Queue for BFS: stores {row, col, distance}
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, 1});  // Distance 1 includes starting cell

        // Mark (0,0) as visited
        rowDSU[0][0] = 1;
        colDSU[0][0] = 1;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int i = curr[0];
            int j = curr[1];
            int dist = curr[2];

            // Check if reached destination
            if (i == m - 1 && j == n - 1) {
                return dist;
            }

            int maxJump = grid[i][j];

            // Process rightward jumps
            int col = find(rowDSU[i], j + 1);
            int maxCol = Math.min(j + maxJump, n - 1);
            while (col <= maxCol) {
                queue.offer(new int[]{i, col, dist + 1});
                // Mark as visited
                rowDSU[i][col] = col + 1;
                colDSU[col][i] = i + 1;
                // Find next available column
                col = find(rowDSU[i], col);
            }

            // Process downward jumps
            int row = find(colDSU[j], i + 1);
            int maxRow = Math.min(i + maxJump, m - 1);
            while (row <= maxRow) {
                queue.offer(new int[]{row, j, dist + 1});
                // Mark as visited
                colDSU[j][row] = row + 1;
                rowDSU[row][j] = j + 1;
                // Find next available row
                row = find(colDSU[j], row);
            }
        }

        // Destination not reachable
        return -1;
    }

    // Helper method for DSU find with path compression
    private int find(int[] dsu, int pos) {
        if (dsu[pos] != pos) {
            dsu[pos] = find(dsu, dsu[pos]);
        }
        return dsu[pos];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(m*n*α(m*n))` where `α` is the inverse Ackermann function, which grows extremely slowly (essentially constant for practical input sizes). Here's why:

- Each cell is added to the queue at most once
- For each cell, we process all reachable unvisited cells in its row and column
- The union-find operations (find with path compression) are amortized `O(α(n))`
- In worst case, we might process `O(m*n)` cells with `O(m+n)` union-find operations each, but the skipping mechanism makes it much faster in practice

**Space Complexity:** `O(m*n)` because:

- We store DSU structures for rows (`m*(n+1)`) and columns (`n*(m+1)`)
- The BFS queue could hold up to `O(m*n)` cells in worst case
- Overall, this simplifies to `O(m*n)`

## Common Mistakes

1. **Forgetting to handle the single-cell grid**: When `m = 1` and `n = 1`, the answer should be 1 (you're already at the destination), not 0. Always check edge cases first.

2. **Off-by-one errors with DSU indices**: The DSU arrays need size `n+1` and `m+1` (not `n` and `m`) because when we mark the last cell in a row/column as visited, we need to point to `n` or `m` (which are out of bounds but valid DSU positions).

3. **Not marking cells in both DSUs**: When you visit a cell `(i, j)`, you need to update both `rowDSU[i][j]` AND `colDSU[j][i]`. Forgetting one leads to cells being processed multiple times.

4. **Incorrect jump bounds**: The jump is `grid[i][j]` steps, but you need to ensure you don't jump beyond grid boundaries with `min(j + grid[i][j], n-1)` for columns and `min(i + grid[i][j], m-1)` for rows.

## When You'll See This Pattern

This problem combines several important patterns:

1. **BFS for shortest path in unweighted grid**: Like "Shortest Path in Binary Matrix" (LeetCode 1091), but with variable jump lengths instead of 8-direction movement.

2. **Union-Find for skipping processed elements**: Similar to "Number of Islands" (LeetCode 200) where union-find helps merge connected components, but here it's used to skip visited cells efficiently.

3. **Jump Game variations**: This is essentially a 2D version of "Jump Game II" (LeetCode 45). The 1D version uses greedy BFS; this 2D version needs the DSU optimization to handle two dimensions efficiently.

The core technique — using union-find to skip already-processed elements in a BFS — appears in problems where you need to traverse a space but want to avoid `O(n²)` operations when marking visited nodes.

## Key Takeaways

1. **When BFS would be too slow due to large branching factors, consider union-find to skip visited nodes**: If each node can reach many others and you're checking them one by one, DSU can help you jump over already-visited nodes in near-constant time.

2. **2D problems often need separate data structures for rows and columns**: When movement is constrained to rows and columns independently (not diagonals), maintaining separate tracking for each dimension can simplify the problem.

3. **The inverse Ackermann function is effectively constant**: Don't be scared by `O(α(n))` complexity — it's so close to constant that for all practical interview purposes, you can call it `O(1)`.

Related problems: [Jump Game II](/problem/jump-game-ii), [Jump Game](/problem/jump-game)
