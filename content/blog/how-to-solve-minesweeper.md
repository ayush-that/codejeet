---
title: "How to Solve Minesweeper — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minesweeper. Medium difficulty, 68.7% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Matrix."
date: "2028-09-29"
category: "dsa-patterns"
tags: ["minesweeper", "array", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Minesweeper

This problem asks us to implement a single click in the classic Minesweeper game. Given a game board and a click coordinate, we need to update the board according to the game's rules: if we click a mine ('M'), it becomes revealed ('X') and the game ends. If we click an empty unrevealed cell ('E'), we need to reveal it and potentially cascade to adjacent cells. The tricky part is handling the cascade logic correctly — when we reveal an empty cell with no adjacent mines, we must recursively reveal all adjacent empty cells, stopping only when we reach cells that have at least one adjacent mine.

## Visual Walkthrough

Let's trace through a simple example to build intuition:

```
Initial board:
E E E E
E M E E
E E E E
E E E E

Click: [1,2] (0-indexed, row 1, column 2)
```

1. We click at position (1,2), which is 'E' (empty unrevealed)
2. First, check adjacent mines around (1,2):
   - Check all 8 directions: (0,1), (0,2), (0,3), (1,1), (1,3), (2,1), (2,2), (2,3)
   - Only (1,1) contains 'M', so there's 1 adjacent mine
3. Since there's at least 1 adjacent mine, we reveal (1,2) as '1' (the count)
4. The board becomes:

```
E E E E
E M 1 E
E E E E
E E E E
```

Now let's try a different click:

```
Same initial board
Click: [3,0] (row 3, column 0)
```

1. Click at (3,0), which is 'E'
2. Check adjacent mines: positions (2,0), (2,1), (3,1)
   - None contain 'M', so count = 0
3. Since count = 0, we reveal (3,0) as 'B' (blank revealed)
4. Now we must recursively reveal all adjacent unrevealed cells:
   - Reveal (2,0): check its adjacent mines
   - Reveal (2,1): check its adjacent mines
   - Reveal (3,1): check its adjacent mines
5. This cascade continues until we hit cells with adjacent mines or boundaries

## Brute Force Approach

A naive approach might try to handle the cascade by repeatedly scanning the entire board. After each click, we could scan all cells to see if any newly revealed 'B' cells have adjacent 'E' cells that should also be revealed. We'd repeat this until no more changes occur.

This approach has several problems:

1. It's inefficient — O(m×n) per scan, and we might need many scans
2. It doesn't handle the recursion depth properly
3. It could reveal cells in the wrong order
4. Most importantly, it doesn't match the actual game logic where revealing happens immediately in a cascading fashion

The brute force would work but would be unnecessarily complex and inefficient. The game's natural logic suggests we should process cells as we encounter them, not rescan the entire board repeatedly.

## Optimized Approach

The key insight is that this is a classic **graph traversal problem**. Each cell is a node, and edges exist between adjacent cells (up, down, left, right, and diagonals). When we click a cell:

1. **Base case 1**: If it's a mine ('M'), game over — reveal it as 'X'
2. **Base case 2**: If it's already revealed (not 'E'), do nothing
3. **Main logic**: If it's 'E':
   - Count adjacent mines
   - If count > 0: reveal with the count
   - If count = 0: reveal as 'B' and recursively process all adjacent 'E' cells

We can use either **DFS (Depth-First Search)** or **BFS (Breadth-First Search)** for the cascade. DFS is more natural here because we want to fully explore one path before backtracking, which matches how players visually see the cascade happen. BFS would also work but uses slightly more memory for the queue.

The recursive DFS approach elegantly handles the cascade: when we find a cell with no adjacent mines, we recursively process all its neighbors. The recursion naturally stops when we hit cells with adjacent mines (since we don't recurse from those) or boundaries.

## Optimal Solution

Here's the complete solution using DFS recursion:

<div class="code-group">

```python
# Time: O(m×n) | Space: O(m×n) for recursion stack in worst case
class Solution:
    def updateBoard(self, board: List[List[str]], click: List[int]) -> List[List[str]]:
        # Directions for all 8 adjacent cells
        directions = [(-1, -1), (-1, 0), (-1, 1),
                      (0, -1),          (0, 1),
                      (1, -1),  (1, 0), (1, 1)]

        m, n = len(board), len(board[0])
        row, col = click

        # Case 1: Clicked on a mine
        if board[row][col] == 'M':
            board[row][col] = 'X'
            return board

        # Helper function to count adjacent mines
        def countMines(r: int, c: int) -> int:
            count = 0
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                # Check bounds and if cell contains a mine
                if 0 <= nr < m and 0 <= nc < n and board[nr][nc] == 'M':
                    count += 1
            return count

        # DFS function to reveal cells
        def dfs(r: int, c: int):
            # Skip if out of bounds or not an unrevealed empty cell
            if not (0 <= r < m and 0 <= c < n) or board[r][c] != 'E':
                return

            # Count adjacent mines
            mines = countMines(r, c)

            if mines > 0:
                # Reveal with mine count
                board[r][c] = str(mines)
            else:
                # Reveal as blank and process all adjacent cells
                board[r][c] = 'B'
                for dr, dc in directions:
                    dfs(r + dr, c + dc)

        # Start DFS from the clicked cell
        dfs(row, col)
        return board
```

```javascript
// Time: O(m×n) | Space: O(m×n) for recursion stack in worst case
/**
 * @param {character[][]} board
 * @param {number[]} click
 * @return {character[][]}
 */
var updateBoard = function (board, click) {
  const m = board.length;
  const n = board[0].length;
  const [row, col] = click;

  // Directions for all 8 adjacent cells
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  // Case 1: Clicked on a mine
  if (board[row][col] === "M") {
    board[row][col] = "X";
    return board;
  }

  // Helper function to count adjacent mines
  const countMines = (r, c) => {
    let count = 0;
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      // Check bounds and if cell contains a mine
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] === "M") {
        count++;
      }
    }
    return count;
  };

  // DFS function to reveal cells
  const dfs = (r, c) => {
    // Skip if out of bounds or not an unrevealed empty cell
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== "E") {
      return;
    }

    // Count adjacent mines
    const mines = countMines(r, c);

    if (mines > 0) {
      // Reveal with mine count
      board[r][c] = mines.toString();
    } else {
      // Reveal as blank and process all adjacent cells
      board[r][c] = "B";
      for (const [dr, dc] of directions) {
        dfs(r + dr, c + dc);
      }
    }
  };

  // Start DFS from the clicked cell
  dfs(row, col);
  return board;
};
```

```java
// Time: O(m×n) | Space: O(m×n) for recursion stack in worst case
class Solution {
    // Directions for all 8 adjacent cells
    private int[][] directions = {
        {-1, -1}, {-1, 0}, {-1, 1},
        {0, -1},           {0, 1},
        {1, -1},  {1, 0},  {1, 1}
    };

    public char[][] updateBoard(char[][] board, int[] click) {
        int m = board.length;
        int n = board[0].length;
        int row = click[0];
        int col = click[1];

        // Case 1: Clicked on a mine
        if (board[row][col] == 'M') {
            board[row][col] = 'X';
            return board;
        }

        // Start DFS from the clicked cell
        dfs(board, row, col, m, n);
        return board;
    }

    private void dfs(char[][] board, int r, int c, int m, int n) {
        // Skip if out of bounds or not an unrevealed empty cell
        if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] != 'E') {
            return;
        }

        // Count adjacent mines
        int mines = countMines(board, r, c, m, n);

        if (mines > 0) {
            // Reveal with mine count
            board[r][c] = (char)('0' + mines);
        } else {
            // Reveal as blank and process all adjacent cells
            board[r][c] = 'B';
            for (int[] dir : directions) {
                dfs(board, r + dir[0], c + dir[1], m, n);
            }
        }
    }

    private int countMines(char[][] board, int r, int c, int m, int n) {
        int count = 0;
        for (int[] dir : directions) {
            int nr = r + dir[0];
            int nc = c + dir[1];
            // Check bounds and if cell contains a mine
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] == 'M') {
                count++;
            }
        }
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)** in the worst case, where m and n are the board dimensions. In the worst case, we might need to reveal every cell on the board (when clicking a cell with no adjacent mines that triggers a cascade across the entire board). Each cell is processed at most once.

**Space Complexity: O(m×n)** in the worst case for the recursion stack. This occurs when we have a large cascade that needs to traverse most of the board. In practice, the space complexity is O(min(m×n, d)) where d is the depth of the recursion, which is limited by the board size.

## Common Mistakes

1. **Forgetting to check bounds when accessing adjacent cells**: This is the most common error. Always validate array indices before accessing `board[nr][nc]`. The solution above checks `0 <= nr < m and 0 <= nc < n` before every access.

2. **Incorrect mine counting logic**: Remember to check all 8 directions, not just the 4 cardinal directions. Minesweeper counts diagonal neighbors too.

3. **Infinite recursion**: Forgetting to mark cells as revealed before recursing can cause infinite loops. Always update `board[r][c]` before calling `dfs` on neighbors to avoid revisiting the same cell.

4. **Handling the mine click incorrectly**: When clicking on 'M', we should change it to 'X' and return immediately without any further processing. Some candidates try to continue processing or trigger cascades after hitting a mine.

5. **Using the wrong data type for mine counts**: Remember that when we reveal a cell with adjacent mines, we need to convert the count to a character (`str(count)` in Python, `toString()` in JavaScript, `(char)('0' + count)` in Java).

## When You'll See This Pattern

This pattern of using DFS/BFS for grid traversal appears in many problems:

1. **Number of Islands (LeetCode 200)**: Similar grid traversal where you mark visited cells to count connected components.
2. **Flood Fill (LeetCode 733)**: Almost identical to this problem — replacing connected pixels of the same color.
3. **Walls and Gates (LeetCode 286)**: BFS traversal to calculate distances from each empty room to the nearest gate.
4. **Rotting Oranges (LeetCode 994)**: BFS traversal to simulate the spread of rot through adjacent cells.

The key pattern is: when you need to process connected cells in a grid based on some condition (same value, reachable, etc.), think of the grid as a graph where each cell is a node connected to its neighbors.

## Key Takeaways

1. **Grid problems are often graph problems in disguise**: When you need to process cells based on their neighbors, think of the grid as an implicit graph. DFS/BFS are your go-to tools.

2. **Always handle bounds checking first**: Before accessing `grid[i][j]`, validate that `i` and `j` are within bounds. This prevents array index errors.

3. **Mark visited cells to avoid infinite loops**: In grid traversal, you must mark cells as visited (or in this case, revealed) to prevent reprocessing them. The marking can be done by changing the cell value or using a separate visited array.

4. **Consider both DFS and BFS**: DFS uses less code and is often sufficient for problems like this. BFS is better when you need the shortest path or level-by-level processing.

Related problems: [Detonate the Maximum Bombs](/problem/detonate-the-maximum-bombs)
