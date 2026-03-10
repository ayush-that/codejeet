---
title: "Matrix Interview Questions: Patterns and Strategies"
description: "Master Matrix problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-03-19"
category: "dsa-patterns"
tags: ["matrix", "dsa", "interview prep"]
---

# Matrix Interview Questions: Patterns and Strategies

You’re 30 minutes into a Google interview, feeling good about your solution to a dynamic programming problem, when the interviewer drops this: “Given a matrix of characters and a word, determine if the word exists in the grid by moving to adjacent cells horizontally or vertically.” You recognize it immediately—Word Search (#79). But as you start coding, you realize the matrix isn’t just a grid to traverse; it’s a state machine where each cell’s visited status matters, backtracking is crucial, and the recursion depth could blow up your stack. This is where candidates get caught: matrix problems look simple visually, but they test your ability to manage multiple dimensions of complexity simultaneously.

Matrix problems appear in 205 LeetCode questions, with a telling distribution: 34 easy (17%), 117 medium (57%), and 54 hard (26%). That 57% medium tells the real story—interviewers love matrix problems because they’re perfect for assessing spatial reasoning, systematic thinking, and attention to detail. The hard problems often combine matrices with advanced concepts like dynamic programming or graph theory.

## Common Patterns

### 1. Layer-by-Layer Traversal (Spiral Order)

When you need to traverse a matrix in a spiral pattern or rotate it, think in layers. The key insight is that you’re not moving randomly—you’re processing concentric rectangles from the outside in. This pattern appears in problems like Spiral Matrix (#54) and Rotate Image (#48).

The intuition: Define four boundaries (top, bottom, left, right) and shrink them as you complete each layer. For rotation problems, think about swapping elements in groups of four rather than trying to rotate the entire matrix at once.

<div class="code-group">

```python
def spiral_order(matrix):
    """
    Return all elements of the matrix in spiral order.
    Time: O(m*n) | Space: O(1) excluding output
    """
    if not matrix or not matrix[0]:
        return []

    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        # Traverse right across the top row
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1

        # Traverse down the right column
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1

        # Traverse left across the bottom row (if still valid)
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1

        # Traverse up the left column (if still valid)
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1

    return result
```

```javascript
function spiralOrder(matrix) {
  // Time: O(m*n) | Space: O(1) excluding output
  if (!matrix.length || !matrix[0].length) return [];

  const result = [];
  let top = 0,
    bottom = matrix.length - 1;
  let left = 0,
    right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    // Right across top
    for (let col = left; col <= right; col++) {
      result.push(matrix[top][col]);
    }
    top++;

    // Down right side
    for (let row = top; row <= bottom; row++) {
      result.push(matrix[row][right]);
    }
    right--;

    // Left across bottom (if valid)
    if (top <= bottom) {
      for (let col = right; col >= left; col--) {
        result.push(matrix[bottom][col]);
      }
      bottom--;
    }

    // Up left side (if valid)
    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        result.push(matrix[row][left]);
      }
      left++;
    }
  }

  return result;
}
```

```java
public List<Integer> spiralOrder(int[][] matrix) {
    // Time: O(m*n) | Space: O(1) excluding output
    List<Integer> result = new ArrayList<>();
    if (matrix.length == 0 || matrix[0].length == 0) return result;

    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;

    while (top <= bottom && left <= right) {
        // Right across top
        for (int col = left; col <= right; col++) {
            result.add(matrix[top][col]);
        }
        top++;

        // Down right side
        for (int row = top; row <= bottom; row++) {
            result.add(matrix[row][right]);
        }
        right--;

        // Left across bottom (if valid)
        if (top <= bottom) {
            for (int col = right; col >= left; col--) {
                result.add(matrix[bottom][col]);
            }
            bottom--;
        }

        // Up left side (if valid)
        if (left <= right) {
            for (int row = bottom; row >= top; row--) {
                result.add(matrix[row][left]);
            }
            left++;
        }
    }

    return result;
}
```

</div>

### 2. DFS/BFS for Connected Components

When a problem asks about finding islands, regions, or connected cells (like Number of Islands (#200) or Word Search (#79)), you’re dealing with a graph disguised as a matrix. Each cell is a node, and adjacent cells (usually up, down, left, right) are edges.

The intuition: Use DFS for simpler implementation when you don’t need the shortest path. Use BFS when you need the shortest path or want to avoid deep recursion. Always mark visited cells to avoid infinite loops—either modify the matrix in-place or use a separate visited structure.

### 3. Dynamic Programming on Grids

For problems like Unique Paths (#62) or Minimum Path Sum (#64), the matrix represents states in a DP table. The key insight is that the value at position (i, j) depends on values from previous positions (usually above and to the left).

The intuition: Define what dp[i][j] represents, then determine the recurrence relation based on how you can reach cell (i, j). Often you can optimize space by using only two rows or even a single row if the recurrence only depends on immediate neighbors.

<div class="code-group">

```python
def min_path_sum(grid):
    """
    Find the minimum path sum from top-left to bottom-right.
    Time: O(m*n) | Space: O(1) modifying input, O(m*n) otherwise
    """
    if not grid or not grid[0]:
        return 0

    m, n = len(grid), len(grid[0])

    # First row: can only come from left
    for j in range(1, n):
        grid[0][j] += grid[0][j-1]

    # First column: can only come from above
    for i in range(1, m):
        grid[i][0] += grid[i-1][0]

    # Rest of the grid: min of above or left
    for i in range(1, m):
        for j in range(1, n):
            grid[i][j] += min(grid[i-1][j], grid[i][j-1])

    return grid[m-1][n-1]
```

```javascript
function minPathSum(grid) {
  // Time: O(m*n) | Space: O(1) modifying input
  if (!grid.length || !grid[0].length) return 0;

  const m = grid.length,
    n = grid[0].length;

  // First row
  for (let j = 1; j < n; j++) {
    grid[0][j] += grid[0][j - 1];
  }

  // First column
  for (let i = 1; i < m; i++) {
    grid[i][0] += grid[i - 1][0];
  }

  // Rest of grid
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
    }
  }

  return grid[m - 1][n - 1];
}
```

```java
public int minPathSum(int[][] grid) {
    // Time: O(m*n) | Space: O(1) modifying input
    if (grid.length == 0 || grid[0].length == 0) return 0;

    int m = grid.length, n = grid[0].length;

    // First row
    for (int j = 1; j < n; j++) {
        grid[0][j] += grid[0][j-1];
    }

    // First column
    for (int i = 1; i < m; i++) {
        grid[i][0] += grid[i-1][0];
    }

    // Rest of grid
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            grid[i][j] += Math.min(grid[i-1][j], grid[i][j-1]);
        }
    }

    return grid[m-1][n-1];
}
```

</div>

## When to Use Matrix vs Alternatives

Matrix problems often overlap with other categories. Here’s how to choose:

**BFS vs DFS for traversal**: Use BFS when you need the shortest path (like in a maze) or when the recursion depth might be too large. Use DFS for simpler implementation when you just need to explore all possibilities (like finding all paths or connected components).

**Hash map vs matrix for lookups**: If you only need to check existence of certain values and the matrix is sparse, consider converting to a hash map of positions. But if you need spatial relationships (adjacency, neighborhoods), stick with the matrix representation.

**Sorting rows/columns**: When a problem mentions "sorted rows" or "sorted columns," think about using binary search on each row (O(m log n)) or walking through the matrix in a staircase pattern (O(m + n)), like in Search a 2D Matrix II (#240).

**Decision criteria**:

1. Are cells connected to neighbors? → Graph traversal (BFS/DFS)
2. Is there an optimal path or count? → Dynamic programming
3. Do you need to traverse in a specific pattern? → Layer-by-layer or directional traversal
4. Are rows/columns sorted? → Binary search or pointer walking

## Edge Cases and Gotchas

1. **Empty matrix or single row/column**: Always check `if not matrix or not matrix[0]` (Python/JS) or `matrix.length == 0 || matrix[0].length == 0` (Java). Single row/column matrices break many spiral and traversal algorithms.

2. **Visited cells in DFS/BFS**: For problems like Word Search where you can't reuse cells, you must mark visited cells. The cleanest approach is to modify the matrix temporarily (e.g., set to `#` or `None`) and restore after recursion. Alternative: use a separate `visited` set, but that uses O(m\*n) extra space.

3. **Integer overflow in DP**: When counting paths (like Unique Paths), the numbers can grow quickly. Use `long` in Java or check constraints. For extremely large counts, you might need modulo arithmetic.

4. **Direction arrays**: When writing DFS/BFS, define direction arrays at the top: `directions = [(0,1), (1,0), (0,-1), (-1,0)]` for 4-directional movement. This prevents bugs from manually writing out each direction.

<div class="code-group">

```python
def num_islands(grid):
    """
    Count number of islands using DFS.
    Time: O(m*n) | Space: O(m*n) worst case recursion
    """
    if not grid:
        return 0

    def dfs(i, j):
        if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]):
            return
        if grid[i][j] != '1':  # Not land or already visited
            return

        grid[i][j] = '#'  # Mark visited

        # Explore all four directions
        dfs(i+1, j)
        dfs(i-1, j)
        dfs(i, j+1)
        dfs(i, j-1)

    count = 0
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1':
                count += 1
                dfs(i, j)

    return count
```

```javascript
function numIslands(grid) {
  // Time: O(m*n) | Space: O(m*n) worst case recursion
  if (!grid.length) return 0;

  const dfs = (i, j) => {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) return;
    if (grid[i][j] !== "1") return;

    grid[i][j] = "#"; // Mark visited

    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  };

  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "1") {
        count++;
        dfs(i, j);
      }
    }
  }

  return count;
}
```

```java
public int numIslands(char[][] grid) {
    // Time: O(m*n) | Space: O(m*n) worst case recursion
    if (grid.length == 0) return 0;

    int count = 0;
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == '1') {
                count++;
                dfs(grid, i, j);
            }
        }
    }
    return count;
}

private void dfs(char[][] grid, int i, int j) {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) return;
    if (grid[i][j] != '1') return;

    grid[i][j] = '#';  // Mark visited

    dfs(grid, i+1, j);
    dfs(grid, i-1, j);
    dfs(grid, i, j+1);
    dfs(grid, i, j-1);
}
```

</div>

## Difficulty Breakdown

The 57% medium distribution is your study guide. Medium matrix problems are the sweet spot—they’re common in interviews and test fundamental patterns without being overly complex. Prioritize medium problems that combine matrices with:

- Graph traversal (DFS/BFS)
- Dynamic programming
- Binary search on sorted rows/columns

Easy problems (17%) are worth doing quickly to build confidence with basic traversal and manipulation. Hard problems (26%) often combine matrices with advanced algorithms—save these for after you’ve mastered the patterns.

## Which Companies Ask Matrix Questions

**Google** (/company/google) loves matrix problems that test algorithmic creativity. Expect variations on classic problems—instead of just Word Search, you might get Word Search with wildcards or multiple words. They also favor problems that involve both matrices and graphs.

**Amazon** (/company/amazon) tends toward practical matrix problems related to real-world scenarios: warehouse robot paths, inventory grids, or network connectivity. Their problems often have clear business analogs.

**Meta** (/company/meta) frequently asks matrix problems in their coding interviews, especially those involving traversal and modification. Rotate Image and Spiral Matrix are classics in their question bank.

**Microsoft** (/company/microsoft) has a mix of classic matrix problems and innovative twists. They might ask you to implement a spreadsheet-like calculation or a game board algorithm.

**Bloomberg** (/company/bloomberg) often includes matrix problems in their interviews, particularly those related to data processing or financial grids. Expect problems with large datasets and efficiency constraints.

## Study Tips

1. **Start with traversal patterns**: Before tackling complex problems, master the four basic traversal patterns: row-major, column-major, spiral, and diagonal. Implement each from scratch until you can do it without thinking.

2. **Group problems by pattern, not difficulty**: Study all the DFS matrix problems together, then all the DP matrix problems. This helps you recognize patterns faster during interviews. For example, do Word Search (#79), Number of Islands (#200), and Max Area of Island (#695) in one sitting.

3. **Draw it out**: Always sketch the matrix on paper or a whiteboard. For traversal problems, draw arrows showing the path. For DP problems, fill in the DP table with example values. Visualizing prevents off-by-one errors.

4. **Recommended problem order**:
   - Easy: Rotate Image (#48), Reshape the Matrix (#566)
   - Medium: Spiral Matrix (#54), Set Matrix Zeroes (#73), Word Search (#79), Number of Islands (#200), Search a 2D Matrix II (#240)
   - Hard: Word Search II (#212), Largest Rectangle in Histogram (#84) (though technically array, it's often presented in matrix context)

Remember: matrix problems test your ability to think in multiple dimensions while keeping track of boundaries and states. The difference between a working solution and a buggy one is often just one off-by-one error or a missed edge case.

[Practice all Matrix questions on CodeJeet](/topic/matrix)
