---
title: "How to Solve Pacific Atlantic Water Flow — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Pacific Atlantic Water Flow. Medium difficulty, 60.6% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Matrix."
date: "2026-12-19"
category: "dsa-patterns"
tags:
  ["pacific-atlantic-water-flow", "array", "depth-first-search", "breadth-first-search", "medium"]
---

## How to Solve Pacific Atlantic Water Flow

This problem asks us to find all cells in an `m x n` height matrix where water can flow to **both** the Pacific Ocean (left/top edges) and Atlantic Ocean (right/bottom edges). Water can only flow from a cell to adjacent cells (up, down, left, right) if the adjacent cell's height is **less than or equal to** the current cell's height. The tricky part is that water flows _from_ higher ground _to_ lower ground (or equal height), so we need to think in reverse: instead of checking every cell to see if it reaches both oceans, we start from the oceans and see which cells can flow _back_ to them.

---

## Visual Walkthrough

Let's trace through a small example:

```
Heights:
[1, 2, 2, 3, 5]
[3, 2, 3, 4, 4]
[2, 4, 5, 3, 1]
[6, 7, 1, 4, 5]
[5, 1, 1, 2, 4]
```

**Step 1 — Pacific reachable cells (starting from left/top edges):**

- Start DFS/BFS from all Pacific border cells (row 0 and column 0)
- From (0,0) height=1: can flow to (0,1) height=2 (2 ≥ 1), (1,0) height=3 (3 ≥ 1)
- Continue propagating: water can flow backwards to any cell where the new height ≥ previous height
- Pacific reachable cells will include all cells that can be reached from Pacific borders following this "reverse flow" rule

**Step 2 — Atlantic reachable cells (starting from right/bottom edges):**

- Start DFS/BFS from all Atlantic border cells (last row and last column)
- From (4,4) height=4: can flow to (4,3) height=2 (2 ≥ 4? No, so stop), (3,4) height=5 (5 ≥ 4)
- Atlantic reachable cells will include all cells reachable from Atlantic borders

**Step 3 — Find intersection:**

- Cells that appear in **both** Pacific and Atlantic reachable sets are our answer
- For our example, the solution cells are: [(0,4), (1,3), (1,4), (2,2), (3,0), (3,1), (4,0)]

The key insight: thinking **from ocean to cell** (reverse flow) instead of from cell to ocean avoids exponential repeated work.

---

## Brute Force Approach

A naive approach would be to check each cell individually: for every cell `(r, c)`, run DFS/BFS to see if it can reach the Pacific Ocean, and run another DFS/BFS to see if it can reach the Atlantic Ocean. If both are true, add it to results.

**Why this fails:**

- Time complexity: O((m·n)²) in worst case — for each of m·n cells, we might traverse all m·n cells
- With m,n up to 200, that's 40,000² = 1.6 billion operations → far too slow
- We're doing massive repeated work: the same paths get explored over and over

This brute force approach helps us understand the problem but isn't viable for the constraints.

---

## Optimized Approach

The key optimization is to **reverse the flow direction**:

1. Instead of checking if water from a cell reaches the ocean, check if water from the ocean can reach the cell (following the same height rule: new height ≥ previous height).
2. Create two boolean matrices:
   - `pacific_reachable`: cells reachable from Pacific borders
   - `atlantic_reachable`: cells reachable from Atlantic borders
3. Perform DFS/BFS starting from **all Pacific border cells** (first row, first column) to mark reachable cells.
4. Perform DFS/BFS starting from **all Atlantic border cells** (last row, last column) to mark reachable cells.
5. Any cell marked in **both** matrices is part of the answer.

**Why this works:**

- We only run two traversals total (one for each ocean) instead of m·n traversals
- Each traversal visits each cell at most once → O(m·n) time
- The height comparison is the same: water flows from lower to higher in reverse direction

---

## Optimal Solution

We'll use DFS (or BFS) from all border cells, marking reachable cells, then find the intersection.

<div class="code-group">

```python
# Time: O(m * n) - each cell visited at most twice
# Space: O(m * n) - for visited matrices and recursion stack
class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        if not heights or not heights[0]:
            return []

        rows, cols = len(heights), len(heights[0])

        # Step 1: Create visited matrices for both oceans
        pacific_visited = [[False] * cols for _ in range(rows)]
        atlantic_visited = [[False] * cols for _ in range(rows)]

        # Step 2: DFS function to mark reachable cells
        def dfs(r, c, visited, prev_height):
            # Base cases: out of bounds, already visited, or height too low
            if (r < 0 or r >= rows or c < 0 or c >= cols or
                visited[r][c] or heights[r][c] < prev_height):
                return

            # Mark current cell as reachable
            visited[r][c] = True

            # Explore all 4 directions
            directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
            for dr, dc in directions:
                dfs(r + dr, c + dc, visited, heights[r][c])

        # Step 3: Start DFS from Pacific borders (first row and first column)
        for c in range(cols):
            dfs(0, c, pacific_visited, heights[0][c])  # First row
        for r in range(rows):
            dfs(r, 0, pacific_visited, heights[r][0])  # First column

        # Step 4: Start DFS from Atlantic borders (last row and last column)
        for c in range(cols):
            dfs(rows - 1, c, atlantic_visited, heights[rows - 1][c])  # Last row
        for r in range(rows):
            dfs(r, cols - 1, atlantic_visited, heights[r][cols - 1])  # Last column

        # Step 5: Find cells reachable from both oceans
        result = []
        for r in range(rows):
            for c in range(cols):
                if pacific_visited[r][c] and atlantic_visited[r][c]:
                    result.append([r, c])

        return result
```

```javascript
// Time: O(m * n) - each cell visited at most twice
// Space: O(m * n) - for visited matrices and recursion stack
var pacificAtlantic = function (heights) {
  if (!heights || !heights.length || !heights[0].length) {
    return [];
  }

  const rows = heights.length;
  const cols = heights[0].length;

  // Step 1: Create visited matrices for both oceans
  const pacificVisited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const atlanticVisited = Array.from({ length: rows }, () => new Array(cols).fill(false));

  // Step 2: DFS function to mark reachable cells
  const dfs = (r, c, visited, prevHeight) => {
    // Base cases: out of bounds, already visited, or height too low
    if (r < 0 || r >= rows || c < 0 || c >= cols || visited[r][c] || heights[r][c] < prevHeight) {
      return;
    }

    // Mark current cell as reachable
    visited[r][c] = true;

    // Explore all 4 directions
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    for (const [dr, dc] of directions) {
      dfs(r + dr, c + dc, visited, heights[r][c]);
    }
  };

  // Step 3: Start DFS from Pacific borders (first row and first column)
  for (let c = 0; c < cols; c++) {
    dfs(0, c, pacificVisited, heights[0][c]); // First row
  }
  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pacificVisited, heights[r][0]); // First column
  }

  // Step 4: Start DFS from Atlantic borders (last row and last column)
  for (let c = 0; c < cols; c++) {
    dfs(rows - 1, c, atlanticVisited, heights[rows - 1][c]); // Last row
  }
  for (let r = 0; r < rows; r++) {
    dfs(r, cols - 1, atlanticVisited, heights[r][cols - 1]); // Last column
  }

  // Step 5: Find cells reachable from both oceans
  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pacificVisited[r][c] && atlanticVisited[r][c]) {
        result.push([r, c]);
      }
    }
  }

  return result;
};
```

```java
// Time: O(m * n) - each cell visited at most twice
// Space: O(m * n) - for visited matrices and recursion stack
class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        List<List<Integer>> result = new ArrayList<>();
        if (heights == null || heights.length == 0 || heights[0].length == 0) {
            return result;
        }

        int rows = heights.length;
        int cols = heights[0].length;

        // Step 1: Create visited matrices for both oceans
        boolean[][] pacificVisited = new boolean[rows][cols];
        boolean[][] atlanticVisited = new boolean[rows][cols];

        // Step 2: DFS from Pacific borders (first row and first column)
        for (int c = 0; c < cols; c++) {
            dfs(heights, 0, c, pacificVisited, heights[0][c]);  // First row
        }
        for (int r = 0; r < rows; r++) {
            dfs(heights, r, 0, pacificVisited, heights[r][0]);  // First column
        }

        // Step 3: DFS from Atlantic borders (last row and last column)
        for (int c = 0; c < cols; c++) {
            dfs(heights, rows - 1, c, atlanticVisited, heights[rows - 1][c]);  // Last row
        }
        for (int r = 0; r < rows; r++) {
            dfs(heights, r, cols - 1, atlanticVisited, heights[r][cols - 1]);  // Last column
        }

        // Step 4: Find cells reachable from both oceans
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (pacificVisited[r][c] && atlanticVisited[r][c]) {
                    result.add(Arrays.asList(r, c));
                }
            }
        }

        return result;
    }

    private void dfs(int[][] heights, int r, int c, boolean[][] visited, int prevHeight) {
        // Base cases: out of bounds, already visited, or height too low
        if (r < 0 || r >= heights.length || c < 0 || c >= heights[0].length ||
            visited[r][c] || heights[r][c] < prevHeight) {
            return;
        }

        // Mark current cell as reachable
        visited[r][c] = true;

        // Explore all 4 directions
        dfs(heights, r + 1, c, visited, heights[r][c]);  // Down
        dfs(heights, r - 1, c, visited, heights[r][c]);  // Up
        dfs(heights, r, c + 1, visited, heights[r][c]);  // Right
        dfs(heights, r, c - 1, visited, heights[r][c]);  // Left
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** O(m × n)

- Each cell is visited at most twice: once from Pacific DFS, once from Atlantic DFS
- Each visit involves constant work (checking 4 neighbors)
- Total: 2 × m × n × O(1) = O(m × n)

**Space Complexity:** O(m × n)

- Two visited matrices: 2 × m × n booleans
- Recursion stack in worst case: O(m × n) when traversing a large connected component
- Total: O(m × n)

---

## Common Mistakes

1. **Wrong height comparison direction:** Remember water flows from higher to lower, so when going backwards (ocean → cell), we need `new_height ≥ previous_height`. Getting this inequality reversed is a frequent error.

2. **Forgetting to handle empty input:** Always check if the matrix is empty or null at the beginning. An empty matrix should return an empty list, not throw an error.

3. **Starting DFS from wrong borders:** Pacific borders are first row AND first column (not just first row). Atlantic borders are last row AND last column. Missing one of these will give incorrect results.

4. **Using the same visited matrix for both oceans:** You need separate matrices because a cell might be reachable from one ocean but not the other. Reusing the same matrix will incorrectly mark cells.

---

## When You'll See This Pattern

This "multi-source BFS/DFS from boundaries" pattern appears in several grid problems:

1. **Number of Islands (LeetCode 200)** — Similar DFS on grid, but starts from any unvisited '1'
2. **Surrounded Regions (LeetCode 130)** — DFS from border 'O's to mark unsurrounded regions
3. **Walls and Gates (LeetCode 286)** — Multi-source BFS from all gates simultaneously
4. **Rotting Oranges (LeetCode 994)** — Multi-source BFS from all rotten oranges

The common theme: when you need to find cells connected to boundaries or multiple sources, start from those boundaries/sources and propagate inward.

---

## Key Takeaways

1. **Reverse the flow:** When checking reachability from many sources to many destinations, consider reversing direction to reduce from O(n²) to O(n) traversals.

2. **Multi-source BFS/DFS:** Starting from multiple points simultaneously is often more efficient than checking each point individually.

3. **Grid connectivity with constraints:** Problems with "flow" constraints (like height comparisons) often use DFS/BFS with custom validity checks at each step.

---

[Practice this problem on CodeJeet](/problem/pacific-atlantic-water-flow)
