---
title: "How to Solve Word Search — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Word Search. Medium difficulty, 46.9% acceptance rate. Topics: Array, String, Backtracking, Depth-First Search, Matrix."
date: "2026-04-26"
category: "dsa-patterns"
tags: ["word-search", "array", "string", "backtracking", "medium"]
---

# How to Solve Word Search

Word Search is a classic backtracking problem that tests your ability to implement depth-first search with state management. The challenge comes from needing to explore multiple paths while tracking which cells have been visited, then properly cleaning up that state when backtracking. It's a perfect example of how DFS with backtracking works in a grid context.

## Visual Walkthrough

Let's trace through a simple example to build intuition:

**Board:**

```
A B C E
S F C S
A D E E
```

**Word:** "ABCCED"

**Step 1:** Start at (0,0) - 'A' matches first letter

- Mark (0,0) as visited
- Check neighbors: (0,1) has 'B' ✓

**Step 2:** At (0,1) - 'B' matches second letter

- Mark (0,1) as visited
- Check neighbors: (0,2) has 'C' ✓

**Step 3:** At (0,2) - 'C' matches third letter

- Mark (0,2) as visited
- Check neighbors: (0,3) has 'E' ✗, (1,2) has 'C' ✓

**Step 4:** At (1,2) - 'C' matches fourth letter

- Mark (1,2) as visited
- Check neighbors: (1,1) has 'F' ✗, (1,3) has 'S' ✗, (2,2) has 'E' ✓

**Step 5:** At (2,2) - 'E' matches fifth letter

- Mark (2,2) as visited
- Check neighbors: (2,1) has 'D' ✗, (2,3) has 'E' ✓

**Step 6:** At (2,3) - 'E' matches sixth letter

- All letters matched! Return true

Notice how we backtrack when we hit dead ends: if at step 3 we had tried (0,3) instead of (1,2), we would have marked it visited, found it doesn't match 'C', unmarked it, and tried the next neighbor.

## Brute Force Approach

A naive approach might try to find all possible paths in the grid and check if any match the word. You could:

1. Start from every cell
2. Generate all possible paths of length equal to the word
3. Check if any path spells the word

The problem with this approach is the exponential explosion of possibilities. For an m×n grid and word length L, there are potentially 4^L paths starting from each cell (since at each step you have up to 4 directions). With m×n starting points, that's O(m×n × 4^L) time complexity, which is far too slow for typical constraints.

Even worse, you'd need to store all these paths, leading to massive memory usage. The brute force approach doesn't prune early when a path clearly won't work, which is where backtracking provides its power.

## Optimized Approach

The key insight is that we can use **DFS with backtracking** to explore paths efficiently:

1. **Early pruning**: Stop exploring a path as soon as we find a mismatch
2. **State management**: Mark cells as visited during exploration, then unmark them when backtracking
3. **Direction exploration**: Only check valid neighbors (within bounds, not visited, matching next character)

The backtracking approach works because:

- We only explore paths that could potentially match the word
- We reuse the same visited tracking structure by marking/unmarking
- We return immediately when we find a match, avoiding unnecessary exploration

The recursive structure is:

1. Base case: If we've matched all letters, return true
2. Base case: If current cell is out of bounds, already visited, or doesn't match current letter, return false
3. Mark current cell as visited
4. Recursively check all four directions
5. Unmark current cell (backtrack)
6. Return true if any direction succeeds

## Optimal Solution

Here's the complete backtracking solution with detailed comments:

<div class="code-group">

```python
# Time: O(m×n × 4^L) where L = len(word)
# Space: O(L) for recursion stack + O(m×n) for visited set (or O(1) if we modify board)
class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        # Get dimensions of the board
        rows, cols = len(board), len(board[0])

        # We'll use a set to track visited cells during DFS
        # Alternative: modify board temporarily with a special marker
        visited = set()

        def dfs(r, c, i):
            """
            Depth-first search helper function.
            r, c: current position in the board
            i: current index in the word we're trying to match
            Returns: True if word can be formed starting from (r,c) at index i
            """
            # Base case 1: we've matched all characters in the word
            if i == len(word):
                return True

            # Base case 2: position is out of bounds
            if r < 0 or r >= rows or c < 0 or c >= cols:
                return False

            # Base case 3: cell already visited or doesn't match current character
            if (r, c) in visited or board[r][c] != word[i]:
                return False

            # Mark current cell as visited
            visited.add((r, c))

            # Explore all four possible directions
            # Note: We use short-circuit evaluation - return immediately if any path works
            found = (dfs(r + 1, c, i + 1) or  # Down
                     dfs(r - 1, c, i + 1) or  # Up
                     dfs(r, c + 1, i + 1) or  # Right
                     dfs(r, c - 1, i + 1))    # Left

            # Backtrack: unmark current cell so it can be used in other paths
            visited.remove((r, c))

            return found

        # Try starting from every cell in the board
        for r in range(rows):
            for c in range(cols):
                # If any starting position leads to the full word, return true
                if dfs(r, c, 0):
                    return True

        # If we've tried all starting positions and none worked
        return False
```

```javascript
// Time: O(m×n × 4^L) where L = word.length
// Space: O(L) for recursion stack + O(m×n) for visited set
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
  const rows = board.length;
  const cols = board[0].length;

  // Create a 2D array to track visited cells
  // Using boolean array is more efficient than Set for grid problems
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

  /**
   * DFS helper function
   * @param {number} r - row index
   * @param {number} c - column index
   * @param {number} i - current index in word
   * @return {boolean}
   */
  const dfs = (r, c, i) => {
    // Base case: matched entire word
    if (i === word.length) {
      return true;
    }

    // Base case: out of bounds
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
      return false;
    }

    // Base case: already visited or character doesn't match
    if (visited[r][c] || board[r][c] !== word[i]) {
      return false;
    }

    // Mark current cell as visited
    visited[r][c] = true;

    // Explore all four directions
    // Using bitwise OR for short-circuit evaluation
    const found =
      dfs(r + 1, c, i + 1) || // Down
      dfs(r - 1, c, i + 1) || // Up
      dfs(r, c + 1, i + 1) || // Right
      dfs(r, c - 1, i + 1); // Left

    // Backtrack: unmark current cell
    visited[r][c] = false;

    return found;
  };

  // Try every possible starting position
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // If we find a valid path starting here, return true immediately
      if (dfs(r, c, 0)) {
        return true;
      }
    }
  }

  // No valid path found
  return false;
};
```

```java
// Time: O(m×n × 4^L) where L = word.length()
// Space: O(L) for recursion stack + O(m×n) for visited array
class Solution {
    public boolean exist(char[][] board, String word) {
        int rows = board.length;
        int cols = board[0].length;

        // Boolean array to track visited cells
        boolean[][] visited = new boolean[rows][cols];

        // Try every cell as a potential starting point
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (dfs(board, word, visited, r, c, 0)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, String word, boolean[][] visited,
                       int r, int c, int index) {
        // Base case: successfully matched all characters
        if (index == word.length()) {
            return true;
        }

        // Base case: out of bounds
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) {
            return false;
        }

        // Base case: already visited or character doesn't match
        if (visited[r][c] || board[r][c] != word.charAt(index)) {
            return false;
        }

        // Mark current cell as visited
        visited[r][c] = true;

        // Define direction vectors: down, up, right, left
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        // Explore all four directions
        for (int[] dir : directions) {
            int newR = r + dir[0];
            int newC = c + dir[1];

            // If any path leads to success, return true immediately
            if (dfs(board, word, visited, newR, newC, index + 1)) {
                // Important: don't forget to backtrack before returning!
                visited[r][c] = false;
                return true;
            }
        }

        // Backtrack: unmark current cell
        visited[r][c] = false;

        // No path from this cell worked
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m×n × 4^L)

- `m×n`: We try starting from every cell in the grid
- `4^L`: In the worst case, for each starting position, we explore up to 4 directions at each step, for L steps (length of word)
- However, in practice it's much better because we prune early when characters don't match

**Space Complexity:** O(L + m×n)

- `O(L)`: Maximum depth of recursion call stack equals word length
- `O(m×n)`: For the visited tracking structure (can be reduced to O(1) by modifying the board in-place with a special character, then restoring it)

The exponential factor 4^L looks scary, but for typical word search puzzles where L is reasonable (usually ≤ 10), this is acceptable. The early pruning makes it efficient in practice.

## Common Mistakes

1. **Forgetting to backtrack**: The most common error is marking a cell as visited but not unmarking it after exploration. This prevents the cell from being used in other valid paths. Always pair `visited[r][c] = true` with `visited[r][c] = false` in a finally-like manner.

2. **Incorrect bounds checking order**: Always check bounds BEFORE accessing the array. Checking `board[r][c]` when r or c is out of bounds causes ArrayIndexOutOfBoundsException. The correct order is: bounds → visited → character match.

3. **Using the wrong data structure for visited**: While a Set works, a 2D boolean array is more efficient for grid problems. Sets have O(1) average access but with higher constant factors than array indexing.

4. **Not pruning early enough**: Some candidates continue exploring even after finding a mismatch. Remember to return false immediately when: out of bounds, already visited, or character doesn't match.

5. **Missing the starting loop**: Forgetting to try every cell as a starting point. The word could start anywhere in the grid, not just at (0,0).

## When You'll See This Pattern

This DFS+backtracking pattern appears in many grid exploration problems:

1. **Word Search II (Hard)**: The natural extension - find ALL words from a dictionary that exist in the board. Requires a Trie data structure for efficient prefix checking.

2. **Number of Islands (Medium)**: Similar grid traversal, but simpler since you don't need to backtrack - just mark visited and don't unmark.

3. **Sudoku Solver (Hard)**: Uses the same backtracking pattern but with different constraints (rows, columns, sub-boxes).

4. **N-Queens (Hard)**: Another classic backtracking problem where you place queens on a chessboard with constraints.

The pattern to recognize: when you need to explore multiple paths in a state space, and you need to track which elements have been used (with the possibility of reusing them in different configurations), backtracking is usually the right approach.

## Key Takeaways

1. **Backtracking = DFS + State Management**: The core pattern is: make a choice (mark visited), explore recursively, undo the choice (unmark). This allows exploring all possibilities without copying state.

2. **Grid DFS directions**: Remember the 4-direction pattern: [(1,0), (-1,0), (0,1), (0,-1)]. For 8-direction problems (like some maze problems), you'd have 8 directions.

3. **Prune early, prune often**: The efficiency of backtracking comes from stopping exploration as soon as we know a path won't work. Always check constraints before making recursive calls.

4. **Think about state representation**: For visited tracking, consider space-time tradeoffs. Modifying the board in-place saves space but might not be allowed if you need to preserve the original board.

Related problems: [Word Search II](/problem/word-search-ii)
