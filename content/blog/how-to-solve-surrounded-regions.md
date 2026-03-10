---
title: "How to Solve Surrounded Regions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Surrounded Regions. Medium difficulty, 44.8% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix."
date: "2026-09-14"
category: "dsa-patterns"
tags: ["surrounded-regions", "array", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Surrounded Regions

The Surrounded Regions problem asks us to flip all `'O'` cells that are completely surrounded by `'X'` cells to `'X'`, while preserving any `'O'` cells that are connected to the border of the board. What makes this problem tricky is that we can't simply look at individual cells - we need to identify entire connected regions and determine if they're "trapped" inside the board. The key insight is to work backwards: instead of finding regions to capture, find regions to preserve.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Initial board:
X X X X
X O O X
X X O X
X O X X
```

**Step 1:** Identify border-connected `'O'` cells

- Top row: No `'O'` cells
- Bottom row: No `'O'` cells
- Left column: No `'O'` cells
- Right column: No `'O'` cells
- Wait, let's check more carefully: cell (1,1) is `'O'` but not on border
- Cell (3,1) is `'O'` and on the left border! This is a border-connected `'O'`

**Step 2:** Mark all `'O'` cells connected to border `'O'` cells

- From (3,1), we can move to adjacent `'O'` cells
- (3,1) has no adjacent `'O'` cells (check up, down, left, right)
- So only (3,1) gets marked as "safe" (not to be flipped)

**Step 3:** Flip all unmarked `'O'` cells to `'X'`

- Cell (1,1): `'O'` → `'X'` (not connected to border)
- Cell (1,2): `'O'` → `'X'` (not connected to border)
- Cell (2,2): `'O'` → `'X'` (not connected to border)
- Cell (3,1): stays `'O'` (connected to border)

**Final board:**

```
X X X X
X X X X
X X X X
X O X X
```

The key realization: any `'O'` region that touches the border cannot be completely surrounded, so we should find all border-connected `'O'` regions first and mark them as safe.

## Brute Force Approach

A naive approach might try to identify each connected region of `'O'` cells, check if it's completely surrounded by `'X'`, and if so, flip all cells in that region. Here's how that might work:

1. Find all connected components of `'O'` cells using DFS/BFS
2. For each component, check if any cell touches the border
3. If no cell touches the border, flip all cells in that component to `'X'`

The problem with this approach is efficiency: we'd need to store all components, check each one for border contact, and potentially revisit cells multiple times. More importantly, this doesn't leverage the key insight that we should work from the border inward.

## Optimized Approach

The optimal solution uses a clever reversal of perspective. Instead of finding regions to capture, we find regions to preserve:

**Key Insight:** Any `'O'` cell that is connected (directly or indirectly) to a border `'O'` cell cannot be captured. Therefore, we should:

1. Start from every `'O'` cell on the border
2. Mark all `'O'` cells reachable from these border cells as "safe" (using DFS or BFS)
3. After marking, iterate through the entire board:
   - Flip unmarked `'O'` cells to `'X'` (these are surrounded)
   - Restore marked cells back to `'O'` (if we used a temporary marker)

This approach is efficient because:

- We only traverse `'O'` cells connected to borders (often a small subset)
- We make a single pass to flip the remaining `'O'` cells
- No need to store separate components or check each one for border contact

## Optimal Solution

Here's the complete solution using DFS from border cells:

<div class="code-group">

```python
# Time: O(m * n) - we visit each cell at most twice
# Space: O(m * n) - recursion stack in worst case (all cells are 'O')
class Solution:
    def solve(self, board: List[List[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        if not board or not board[0]:
            return

        m, n = len(board), len(board[0])

        # Step 1: DFS from border 'O' cells to mark connected 'O' cells
        def dfs(r, c):
            # Base cases: out of bounds or not 'O'
            if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != 'O':
                return

            # Mark current cell as safe (temporarily as 'S')
            board[r][c] = 'S'

            # Explore all four directions
            dfs(r + 1, c)  # down
            dfs(r - 1, c)  # up
            dfs(r, c + 1)  # right
            dfs(r, c - 1)  # left

        # Check border rows (first and last row)
        for i in range(m):
            if board[i][0] == 'O':
                dfs(i, 0)  # left border
            if board[i][n-1] == 'O':
                dfs(i, n-1)  # right border

        # Check border columns (first and last column, excluding corners we already checked)
        for j in range(n):
            if board[0][j] == 'O':
                dfs(0, j)  # top border
            if board[m-1][j] == 'O':
                dfs(m-1, j)  # bottom border

        # Step 2: Process the entire board
        for i in range(m):
            for j in range(n):
                if board[i][j] == 'O':
                    # This 'O' was not reachable from border, so flip it
                    board[i][j] = 'X'
                elif board[i][j] == 'S':
                    # This was marked as safe, restore to 'O'
                    board[i][j] = 'O'
```

```javascript
// Time: O(m * n) - we visit each cell at most twice
// Space: O(m * n) - recursion stack in worst case (all cells are 'O')
/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function (board) {
  if (!board || board.length === 0 || board[0].length === 0) {
    return;
  }

  const m = board.length;
  const n = board[0].length;

  // Step 1: DFS helper function to mark border-connected 'O' cells
  const dfs = (r, c) => {
    // Base cases: out of bounds or not 'O'
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== "O") {
      return;
    }

    // Mark current cell as safe (temporarily as 'S')
    board[r][c] = "S";

    // Explore all four directions
    dfs(r + 1, c); // down
    dfs(r - 1, c); // up
    dfs(r, c + 1); // right
    dfs(r, c - 1); // left
  };

  // Check border rows (first and last row)
  for (let i = 0; i < m; i++) {
    if (board[i][0] === "O") {
      dfs(i, 0); // left border
    }
    if (board[i][n - 1] === "O") {
      dfs(i, n - 1); // right border
    }
  }

  // Check border columns (first and last column, excluding corners)
  for (let j = 0; j < n; j++) {
    if (board[0][j] === "O") {
      dfs(0, j); // top border
    }
    if (board[m - 1][j] === "O") {
      dfs(m - 1, j); // bottom border
    }
  }

  // Step 2: Process the entire board
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === "O") {
        // This 'O' was not reachable from border, so flip it
        board[i][j] = "X";
      } else if (board[i][j] === "S") {
        // This was marked as safe, restore to 'O'
        board[i][j] = "O";
      }
    }
  }
};
```

```java
// Time: O(m * n) - we visit each cell at most twice
// Space: O(m * n) - recursion stack in worst case (all cells are 'O')
class Solution {
    public void solve(char[][] board) {
        if (board == null || board.length == 0 || board[0].length == 0) {
            return;
        }

        int m = board.length;
        int n = board[0].length;

        // Step 1: DFS from border 'O' cells to mark connected 'O' cells
        for (int i = 0; i < m; i++) {
            if (board[i][0] == 'O') {
                dfs(board, i, 0);  // left border
            }
            if (board[i][n - 1] == 'O') {
                dfs(board, i, n - 1);  // right border
            }
        }

        for (int j = 0; j < n; j++) {
            if (board[0][j] == 'O') {
                dfs(board, 0, j);  // top border
            }
            if (board[m - 1][j] == 'O') {
                dfs(board, m - 1, j);  // bottom border
            }
        }

        // Step 2: Process the entire board
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 'O') {
                    // This 'O' was not reachable from border, so flip it
                    board[i][j] = 'X';
                } else if (board[i][j] == 'S') {
                    // This was marked as safe, restore to 'O'
                    board[i][j] = 'O';
                }
            }
        }
    }

    private void dfs(char[][] board, int r, int c) {
        int m = board.length;
        int n = board[0].length;

        // Base cases: out of bounds or not 'O'
        if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] != 'O') {
            return;
        }

        // Mark current cell as safe (temporarily as 'S')
        board[r][c] = 'S';

        // Explore all four directions
        dfs(board, r + 1, c);  // down
        dfs(board, r - 1, c);  // up
        dfs(board, r, c + 1);  // right
        dfs(board, r, c - 1);  // left
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n) where m is the number of rows and n is the number of columns. We perform DFS from border cells (which visits each cell at most once) and then make a single pass through the entire board.

**Space Complexity:** O(m × n) in the worst case for the recursion stack. This occurs when the entire board is filled with `'O'` cells connected to the border. In practice, the space complexity is often much smaller. We could reduce this to O(min(m, n)) by using BFS with an explicit queue, but the recursive DFS is cleaner to implement.

## Common Mistakes

1. **Forgetting to handle empty input:** Always check if the board is null or empty at the beginning. An empty board should return immediately.

2. **Modifying cells during traversal:** When doing DFS/BFS, mark cells as visited immediately when you enqueue/push them, not when you pop them. Otherwise, you might push the same cell multiple times.

3. **Only checking corners instead of entire borders:** Some candidates only check the four corners instead of all cells on all four borders. Remember that any `'O'` on any border cell makes its entire connected region safe.

4. **Using the wrong marker:** If you use a marker that's not distinguishable from `'O'` and `'X'`, you might create infinite recursion or incorrect results. Using `'S'` (or any temporary marker) is crucial.

## When You'll See This Pattern

This "border propagation" or "work backwards" pattern appears in several grid-based problems:

1. **Number of Islands (Medium):** Similar DFS/BFS traversal to mark connected components, though here we're counting rather than modifying.

2. **Walls and Gates (Medium):** Another BFS-from-multiple-sources problem where you propagate distances from gates to empty rooms.

3. **Pacific Atlantic Water Flow (Medium):** Uses the exact same pattern - start DFS from border cells (pacific and atlantic borders separately) and mark reachable cells.

The common theme: when you need to find components with a specific relationship to borders, start from the borders and work inward rather than examining each component individually.

## Key Takeaways

1. **Reverse your perspective:** Instead of finding regions to capture, find regions to preserve. This "work backwards" approach is often more efficient for problems involving borders or boundaries.

2. **Border-first traversal:** When a problem involves connectivity to borders, start your search from the border cells and propagate inward. This avoids the need to check each component for border contact.

3. **Temporary markers are your friend:** Using a temporary marker (like `'S'`) allows you to distinguish between cells that need different processing without needing extra data structures.

Related problems: [Number of Islands](/problem/number-of-islands), [Walls and Gates](/problem/walls-and-gates)
