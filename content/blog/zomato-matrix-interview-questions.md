---
title: "Matrix Questions at Zomato: What to Expect"
description: "Prepare for Matrix interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-12"
category: "dsa-patterns"
tags: ["zomato", "matrix", "interview prep"]
---

# Matrix Questions at Zomato: What to Expect

If you're preparing for a software engineering interview at Zomato, you've probably noticed something interesting in their question breakdown: out of 29 total problem categories, Matrix problems appear 4 times. That's more than 13% of their catalog. This isn't a coincidence—it's a deliberate choice that reveals what Zomato values in candidates.

Zomato's entire business revolves around location data, restaurant grids, delivery route optimization, and mapping interfaces. Their engineers work with geospatial matrices daily, whether it's representing delivery zones, calculating distances between locations, or visualizing restaurant density across cities. When they ask Matrix questions, they're not testing abstract algorithms—they're evaluating how you'd solve problems they actually face. I've spoken with engineers who've interviewed there, and they consistently report at least one matrix-related question in their technical rounds, often framed in the context of real-world mapping or logistics scenarios.

## Specific Patterns Zomato Favors

Zomato's matrix problems tend to cluster around three specific patterns that mirror their business needs:

1. **Grid traversal with modifications** - Think "delivery agent pathfinding" rather than abstract maze solving. They love variations of BFS/DFS where you need to track multiple states. Problems like "Rotting Oranges" (#994) appear frequently because they model food freshness spreading through inventory grids.

2. **Dynamic programming on grids** - Specifically, minimum path sum problems (#64) with twists. Instead of just finding the cheapest path, you might need to account for delivery time windows or restaurant capacity constraints. They often add obstacles or conditional movement rules.

3. **Matrix transformation** - Problems where you need to modify the matrix in-place following specific rules. "Set Matrix Zeroes" (#73) is a favorite because it tests whether you understand space optimization when working with large location datasets.

What's notably absent? Pure mathematical matrix operations or complex graph theory. Zomato stays practical—their problems usually have direct analogs in their mapping and logistics systems.

## How to Prepare

The key to Zomato's matrix questions is recognizing that they're testing _applied_ algorithms. You need to master the standard patterns, then learn to adapt them to constraints that mimic real delivery logistics.

Let's look at the most critical pattern: BFS for shortest path in a grid with obstacles. This appears in various forms, from "Shortest Path in Binary Matrix" (#1091) to custom problems about delivery route optimization.

<div class="code-group">

```python
from collections import deque
from typing import List

def shortestPathBinaryMatrix(grid: List[List[int]]) -> int:
    """
    Find shortest clear path in binary matrix (0 = passable, 1 = blocked)
    Time: O(n*m) where n=rows, m=columns
    Space: O(n*m) for the queue in worst case
    """
    if not grid or grid[0][0] == 1:
        return -1

    n = len(grid)
    # All 8 possible directions (including diagonals)
    directions = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]

    queue = deque()
    queue.append((0, 0, 1))  # (row, col, distance)
    grid[0][0] = 1  # Mark as visited by setting to 1

    while queue:
        row, col, dist = queue.popleft()

        # Reached destination
        if row == n-1 and col == n-1:
            return dist

        # Explore all 8 directions
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check bounds and if cell is passable
            if (0 <= new_row < n and 0 <= new_col < n
                and grid[new_row][new_col] == 0):
                queue.append((new_row, new_col, dist + 1))
                grid[new_row][new_col] = 1  # Mark visited

    return -1
```

```javascript
/**
 * Find shortest clear path in binary matrix (0 = passable, 1 = blocked)
 * Time: O(n*m) where n=rows, m=columns
 * Space: O(n*m) for the queue in worst case
 */
function shortestPathBinaryMatrix(grid) {
  if (!grid || grid[0][0] === 1) return -1;

  const n = grid.length;
  // All 8 possible directions (including diagonals)
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

  const queue = [[0, 0, 1]]; // [row, col, distance]
  grid[0][0] = 1; // Mark as visited

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();

    // Reached destination
    if (row === n - 1 && col === n - 1) {
      return dist;
    }

    // Explore all 8 directions
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check bounds and if cell is passable
      if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n && grid[newRow][newCol] === 0) {
        queue.push([newRow, newCol, dist + 1]);
        grid[newRow][newCol] = 1; // Mark visited
      }
    }
  }

  return -1;
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class Solution {
    /**
     * Find shortest clear path in binary matrix (0 = passable, 1 = blocked)
     * Time: O(n*m) where n=rows, m=columns
     * Space: O(n*m) for the queue in worst case
     */
    public int shortestPathBinaryMatrix(int[][] grid) {
        if (grid == null || grid[0][0] == 1) {
            return -1;
        }

        int n = grid.length;
        // All 8 possible directions (including diagonals)
        int[][] directions = {
            {-1,-1}, {-1,0}, {-1,1},
            {0,-1},          {0,1},
            {1,-1},  {1,0},  {1,1}
        };

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, 1});  // {row, col, distance}
        grid[0][0] = 1;  // Mark as visited

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];
            int dist = current[2];

            // Reached destination
            if (row == n-1 && col == n-1) {
                return dist;
            }

            // Explore all 8 directions
            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                // Check bounds and if cell is passable
                if (newRow >= 0 && newRow < n &&
                    newCol >= 0 && newCol < n &&
                    grid[newRow][newCol] == 0) {
                    queue.offer(new int[]{newRow, newCol, dist + 1});
                    grid[newRow][newCol] = 1;  // Mark visited
                }
            }
        }

        return -1;
    }
}
```

</div>

The second pattern you must master is in-place matrix transformation. Zomato often asks variations where you need to be space-efficient because their actual systems handle massive location datasets.

<div class="code-group">

```python
def setZeroes(matrix: List[List[int]]) -> None:
    """
    Set entire row and column to zero if any element is zero
    Time: O(m*n) where m=rows, n=columns
    Space: O(1) - using first row and column as markers
    """
    if not matrix:
        return

    m, n = len(matrix), len(matrix[0])
    first_row_has_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_has_zero = any(matrix[i][0] == 0 for i in range(m))

    # Use first row and column as markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0

    # Zero out cells based on markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0

    # Handle first row
    if first_row_has_zero:
        for j in range(n):
            matrix[0][j] = 0

    # Handle first column
    if first_col_has_zero:
        for i in range(m):
            matrix[i][0] = 0
```

```javascript
/**
 * Set entire row and column to zero if any element is zero
 * Time: O(m*n) where m=rows, n=columns
 * Space: O(1) - using first row and column as markers
 */
function setZeroes(matrix) {
  if (!matrix || matrix.length === 0) return;

  const m = matrix.length;
  const n = matrix[0].length;
  let firstRowHasZero = false;
  let firstColHasZero = false;

  // Check first row for zeros
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowHasZero = true;
      break;
    }
  }

  // Check first column for zeros
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColHasZero = true;
      break;
    }
  }

  // Use first row and column as markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }

  // Zero out cells based on markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // Handle first row
  if (firstRowHasZero) {
    for (let j = 0; j < n; j++) {
      matrix[0][j] = 0;
    }
  }

  // Handle first column
  if (firstColHasZero) {
    for (let i = 0; i < m; i++) {
      matrix[i][0] = 0;
    }
  }
}
```

```java
public class Solution {
    /**
     * Set entire row and column to zero if any element is zero
     * Time: O(m*n) where m=rows, n=columns
     * Space: O(1) - using first row and column as markers
     */
    public void setZeroes(int[][] matrix) {
        if (matrix == null || matrix.length == 0) return;

        int m = matrix.length;
        int n = matrix[0].length;
        boolean firstRowHasZero = false;
        boolean firstColHasZero = false;

        // Check first row for zeros
        for (int j = 0; j < n; j++) {
            if (matrix[0][j] == 0) {
                firstRowHasZero = true;
                break;
            }
        }

        // Check first column for zeros
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) {
                firstColHasZero = true;
                break;
            }
        }

        // Use first row and column as markers
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }

        // Zero out cells based on markers
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                    matrix[i][j] = 0;
                }
            }
        }

        // Handle first row
        if (firstRowHasZero) {
            for (int j = 0; j < n; j++) {
                matrix[0][j] = 0;
            }
        }

        // Handle first column
        if (firstColHasZero) {
            for (int i = 0; i < m; i++) {
                matrix[i][0] = 0;
            }
        }
    }
}
```

</div>

## How Zomato Tests Matrix vs Other Companies

Zomato's approach differs from other tech companies in three key ways:

1. **Context matters more** - While Google might ask abstract matrix rotation problems, Zomato frames questions around delivery grids, restaurant locations, or mapping data. They want to see if you can translate business requirements into algorithms.

2. **Space efficiency is emphasized** - Because they work with large geographical datasets, they care about O(1) space solutions more than companies like Amazon, who might accept O(n) auxiliary space.

3. **Medium difficulty is the sweet spot** - Unlike FAANG companies that often include hard DP matrix problems, Zomato sticks to medium difficulty with practical twists. They're testing for solid fundamentals, not algorithmic brilliance.

## Study Order

Follow this sequence to build your skills systematically:

1. **Basic traversal** - Start with simple BFS/DFS on grids. Understand how to track visited cells and handle boundaries. This is foundational—everything else builds on this.

2. **Pathfinding variations** - Practice shortest path problems with different movement rules (4-direction vs 8-direction, with obstacles, with weighted cells). This directly maps to delivery route optimization.

3. **Dynamic programming on grids** - Learn minimum path sum patterns, then practice variations with obstacles or conditional movement. This helps with cost optimization problems.

4. **In-place transformations** - Master modifying matrices without extra space. This is crucial for Zomato's large datasets.

5. **Island/region problems** - Practice connected components in grids. This models restaurant clustering or delivery zone identification.

6. **Search in sorted matrices** - While less common, understanding how to leverage sorted properties is valuable for location lookup problems.

## Recommended Practice Order

Solve these problems in sequence to build up to Zomato-level competency:

1. **Number of Islands** (#200) - Basic DFS/BFS traversal
2. **Rotting Oranges** (#994) - Multi-source BFS, great for modeling spread
3. **Set Matrix Zeroes** (#73) - In-place modification, space optimization
4. **Shortest Path in Binary Matrix** (#1091) - Grid BFS with all directions
5. **Minimum Path Sum** (#64) - Basic DP on grid
6. **Unique Paths II** (#63) - DP with obstacles
7. **Search a 2D Matrix** (#74) - Binary search adaptation
8. **Spiral Matrix** (#54) - Complex traversal patterns
9. **Word Search** (#79) - DFS with backtracking
10. **Surrounded Regions** (#130) - Boundary-based reasoning

After mastering these, look for Zomato-specific problems on platforms like CodeJeet that add delivery/logistics twists to these patterns.

[Practice Matrix at Zomato](/company/zomato/matrix)
