---
title: "How to Solve Count Servers that Communicate — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Servers that Communicate. Medium difficulty, 73.5% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix."
date: "2028-10-14"
category: "dsa-patterns"
tags:
  [
    "count-servers-that-communicate",
    "array",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Count Servers that Communicate

This problem asks us to count servers in a grid that can communicate with at least one other server. Two servers communicate if they're in the same row or same column. The challenge is efficiently identifying which servers have companions in their row or column without checking every pair of servers.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
1 0 0
1 0 1
0 0 1
```

We need to find servers that have at least one other server in their row OR column.

**Step 1:** Look at row 0: `[1, 0, 0]`

- Only one server at (0,0)
- No other servers in row 0
- Check column 0: servers at (0,0) and (1,0) → can communicate!
- Server at (0,0) counts

**Step 2:** Row 1: `[1, 0, 1]`

- Server at (1,0): Check column 0 → servers at (0,0) and (1,0) → can communicate
- Server at (1,2): Check column 2 → servers at (1,2) and (2,2) → can communicate
- Both servers in row 1 count

**Step 3:** Row 2: `[0, 0, 1]`

- Server at (2,2): Check column 2 → servers at (1,2) and (2,2) → can communicate
- Server at (2,2) counts

**Total:** 4 servers can communicate

The key insight: A server communicates if either its row or its column contains more than one server.

## Brute Force Approach

The most straightforward approach is to check every server and see if it has any companion in its row or column:

1. For each server at position (i, j)
2. Scan the entire row i to see if there's another server
3. Scan the entire column j to see if there's another server
4. If either scan finds another server, count this server

This approach has O(m × n × (m + n)) time complexity because for each of O(m × n) servers, we scan O(m + n) cells. For a 250×250 grid, that's ~250×250×500 = 31 million operations, which is too slow.

## Optimized Approach

The key optimization is to precompute how many servers are in each row and column. Then for each server, we can check in O(1) time whether its row or column has more than one server.

**Step-by-step reasoning:**

1. First pass: Count servers in each row and each column
2. Second pass: For each server, check if rowCount[i] > 1 OR colCount[j] > 1
3. If yes, this server can communicate with at least one other server

Why does this work? If a server's row has >1 server, it definitely has a companion in that row. If its column has >1 server, it definitely has a companion in that column. If both have exactly 1 server, this server is isolated.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m × n) | Space: O(m + n)
def countServers(grid):
    """
    Count servers that can communicate with at least one other server.
    A server communicates if it shares a row or column with another server.
    """
    m, n = len(grid), len(grid[0])

    # Step 1: Count servers in each row and column
    row_count = [0] * m
    col_count = [0] * n

    # First pass: count all servers and populate row/col counts
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                row_count[i] += 1
                col_count[j] += 1

    # Step 2: Count servers that can communicate
    result = 0
    for i in range(m):
        for j in range(n):
            # Only check cells that have servers
            if grid[i][j] == 1:
                # Server can communicate if its row OR column has more than 1 server
                # (the "> 1" check ensures it's not counting itself as the only server)
                if row_count[i] > 1 or col_count[j] > 1:
                    result += 1

    return result
```

```javascript
// Time: O(m × n) | Space: O(m + n)
function countServers(grid) {
  /**
   * Count servers that can communicate with at least one other server.
   * A server communicates if it shares a row or column with another server.
   */
  const m = grid.length;
  const n = grid[0].length;

  // Step 1: Count servers in each row and column
  const rowCount = new Array(m).fill(0);
  const colCount = new Array(n).fill(0);

  // First pass: count all servers and populate row/col counts
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        rowCount[i]++;
        colCount[j]++;
      }
    }
  }

  // Step 2: Count servers that can communicate
  let result = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Only check cells that have servers
      if (grid[i][j] === 1) {
        // Server can communicate if its row OR column has more than 1 server
        // (the "> 1" check ensures it's not counting itself as the only server)
        if (rowCount[i] > 1 || colCount[j] > 1) {
          result++;
        }
      }
    }
  }

  return result;
}
```

```java
// Time: O(m × n) | Space: O(m + n)
class Solution {
    public int countServers(int[][] grid) {
        /**
         * Count servers that can communicate with at least one other server.
         * A server communicates if it shares a row or column with another server.
         */
        int m = grid.length;
        int n = grid[0].length;

        // Step 1: Count servers in each row and column
        int[] rowCount = new int[m];
        int[] colCount = new int[n];

        // First pass: count all servers and populate row/col counts
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    rowCount[i]++;
                    colCount[j]++;
                }
            }
        }

        // Step 2: Count servers that can communicate
        int result = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // Only check cells that have servers
                if (grid[i][j] == 1) {
                    // Server can communicate if its row OR column has more than 1 server
                    // (the "> 1" check ensures it's not counting itself as the only server)
                    if (rowCount[i] > 1 || colCount[j] > 1) {
                        result++;
                    }
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n)

- We make two passes through the grid
- First pass: O(m × n) to count servers in rows and columns
- Second pass: O(m × n) to count communicating servers
- Total: O(2 × m × n) = O(m × n)

**Space Complexity:** O(m + n)

- We store two arrays: rowCount of size m and colCount of size n
- No additional data structures scale with grid size
- Total: O(m + n)

## Common Mistakes

1. **Checking `>= 1` instead of `> 1`**: This is the most common error. If you check `rowCount[i] >= 1`, you'll count every server because every server is in a row/column with at least itself. You need `> 1` to ensure there's another server.

2. **Not handling empty grid**: While the problem guarantees m, n ≥ 1, in interviews you should mention edge cases. An empty grid would need special handling.

3. **Trying to use DFS/BFS unnecessarily**: Some candidates see "communication" and think graph traversal, but the row/column relationship is simpler. DFS/BFS would be O(m × n) too but with more overhead.

4. **Forgetting to check both row AND column**: A server communicates if EITHER its row OR its column has another server. Using AND instead of OR would undercount.

## When You'll See This Pattern

This "row/column counting" pattern appears in several grid problems:

1. **Battleships in a Board (LeetCode 419)**: Count battleships by checking if a cell is the "first" cell of the ship (no adjacent ship cells to the left or above).

2. **Lonely Pixel I (LeetCode 531)**: Find black pixels that are the only one in their row and column - similar row/column counting approach.

3. **Toeplitz Matrix (LeetCode 766)**: Check if every diagonal has the same elements by comparing each element with its top-left neighbor.

The common theme: when you need to check relationships along rows and columns, precomputing row/column statistics often leads to optimal solutions.

## Key Takeaways

1. **Precomputation is powerful**: When you need to check properties of rows/columns for many elements, compute row/column statistics first rather than recomputing for each element.

2. **Think about what "communication" means**: In this case, it's simply "shares a row or column with another server." Translating the problem statement into precise mathematical conditions is crucial.

3. **The `> 1` check is key**: Remember that a server being in its own row/column doesn't count as communication. You need at least one other server.

[Practice this problem on CodeJeet](/problem/count-servers-that-communicate)
