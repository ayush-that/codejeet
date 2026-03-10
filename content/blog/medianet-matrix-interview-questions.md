---
title: "Matrix Questions at Media.net: What to Expect"
description: "Prepare for Matrix interview questions at Media.net — patterns, difficulty breakdown, and study tips."
date: "2030-07-15"
category: "dsa-patterns"
tags: ["medianet", "matrix", "interview prep"]
---

When you're preparing for Media.net interviews, you'll notice something interesting in their problem distribution: **Matrix questions make up roughly 12% of their catalog** (4 out of 33). While that might not sound overwhelming, don't be fooled. In practice, these problems are high-signal questions that test your ability to translate a 2D grid into a tractable computational model. Media.net, being an ad-tech company dealing with bid landscapes, inventory grids, and optimization matrices, uses these problems to assess how you handle structured, spatial data—a skill directly relevant to their domain.

The key insight is that Media.net's matrix problems are rarely about brute-force iteration. They're almost always **disguised graph problems** or **dynamic programming scenarios** where the adjacency is defined by the four cardinal directions. They want to see if you recognize that a matrix is just an implicit adjacency list.

## Specific Patterns Media.net Favors

Media.net leans heavily on two specific flavors of matrix problems, both of which test graph traversal fundamentals.

1.  **Multi-Source Breadth-First Search (BFS):** This is their absolute favorite pattern. Instead of starting a traversal from a single point, you initialize the queue with multiple sources. This perfectly models problems like calculating the distance of every cell to the nearest target (e.g., a "0" or a "gate"). It's efficient and intuitive. You'll see this in problems like **"01 Matrix" (LeetCode #542)** and **"Walls and Gates" (LeetCode #286)**.

2.  **Depth-First Search (DFS) for Area Calculation/Validation:** They frequently ask problems that require exploring a connected region, such as counting islands, calculating the area of an island, or checking if a path exists. This tests recursive thinking and careful state management (visiting vs. not visiting). **"Number of Islands" (LeetCode #200)** is the canonical example, but expect variations like "Max Area of Island" (LeetCode #695).

Noticeably absent are complex matrix rotations or obscure linear algebra manipulations. Their focus is on **applied graph traversal**.

<div class="code-group">

```python
# Pattern: Multi-Source BFS (LeetCode #542 - 01 Matrix)
# Time: O(m * n) | Space: O(m * n)
from collections import deque

def updateMatrix(mat):
    """
    Returns a matrix where each cell is the distance to the nearest 0.
    """
    rows, cols = len(mat), len(mat[0])
    # Initialize result matrix with -1 (unvisited)
    dist = [[-1] * cols for _ in range(rows)]
    queue = deque()

    # Multi-source initialization: all 0s are sources
    for r in range(rows):
        for c in range(cols):
            if mat[r][c] == 0:
                dist[r][c] = 0
                queue.append((r, c))

    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    while queue:
        r, c = queue.popleft()
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            # If neighbor is within bounds and unvisited
            if 0 <= nr < rows and 0 <= nc < cols and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))
    return dist
```

```javascript
// Pattern: Multi-Source BFS (LeetCode #542 - 01 Matrix)
// Time: O(m * n) | Space: O(m * n)
function updateMatrix(mat) {
  const rows = mat.length,
    cols = mat[0].length;
  // Initialize distance matrix with Infinity
  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const queue = [];

  // Multi-source initialization
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] === 0) {
        dist[r][c] = 0;
        queue.push([r, c]);
      }
    }
  }

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length) {
    const [r, c] = queue.shift();
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (dist[nr][nc] > dist[r][c] + 1) {
          dist[nr][nc] = dist[r][c] + 1;
          queue.push([nr, nc]);
        }
      }
    }
  }
  return dist;
}
```

```java
// Pattern: Multi-Source BFS (LeetCode #542 - 01 Matrix)
// Time: O(m * n) | Space: O(m * n)
import java.util.LinkedList;
import java.util.Queue;

public int[][] updateMatrix(int[][] mat) {
    int rows = mat.length, cols = mat[0].length;
    int[][] dist = new int[rows][cols];
    Queue<int[]> queue = new LinkedList<>();

    // Initialize: set distance for zeros and add to queue; mark others as -1
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (mat[r][c] == 0) {
                queue.offer(new int[]{r, c});
                dist[r][c] = 0;
            } else {
                dist[r][c] = -1;
            }
        }
    }

    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};

    while (!queue.isEmpty()) {
        int[] cell = queue.poll();
        int r = cell[0], c = cell[1];

        for (int[] dir : directions) {
            int nr = r + dir[0], nc = c + dir[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && dist[nr][nc] == -1) {
                dist[nr][nc] = dist[r][c] + 1;
                queue.offer(new int[]{nr, nc});
            }
        }
    }
    return dist;
}
```

</div>

## How to Prepare

Your preparation should be pattern-centric, not problem-centric. For each pattern:

1.  **Memorize the skeleton code** for BFS and DFS on a matrix (directions array, bounds checking, visited set logic).
2.  **Identify the trigger:** When you see "nearest," "minimum distance," or "propagation," think **Multi-Source BFS**. When you see "connected," "region," "island," or "enclosed," think **DFS area traversal**.
3.  **Practice state representation:** Sometimes you need to modify the input matrix in-place to mark visited cells (saving space). Other times you need a separate `visited` set or `distance` matrix. Know the trade-offs.

<div class="code-group">

```python
# Pattern: DFS for Area Calculation (LeetCode #695 - Max Area of Island)
# Time: O(m * n) | Space: O(m * n) in worst-case due to recursion stack
def maxAreaOfIsland(grid):
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        # Base case: out of bounds or water (0)
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0:
            return 0
        # Mark as visited by sinking the land
        grid[r][c] = 0
        # Count this cell (1) plus all connected land
        area = 1
        area += dfs(r + 1, c)
        area += dfs(r - 1, c)
        area += dfs(r, c + 1)
        area += dfs(r, c - 1)
        return area

    max_area = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                max_area = max(max_area, dfs(r, c))
    return max_area
```

```javascript
// Pattern: DFS for Area Calculation (LeetCode #695 - Max Area of Island)
// Time: O(m * n) | Space: O(m * n)
function maxAreaOfIsland(grid) {
  const rows = grid.length,
    cols = grid[0].length;
  let maxArea = 0;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === 0) {
      return 0;
    }
    grid[r][c] = 0; // mark as visited
    let area = 1;
    area += dfs(r + 1, c);
    area += dfs(r - 1, c);
    area += dfs(r, c + 1);
    area += dfs(r, c - 1);
    return area;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        maxArea = Math.max(maxArea, dfs(r, c));
      }
    }
  }
  return maxArea;
}
```

```java
// Pattern: DFS for Area Calculation (LeetCode #695 - Max Area of Island)
// Time: O(m * n) | Space: O(m * n)
public int maxAreaOfIsland(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    int maxArea = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 1) {
                maxArea = Math.max(maxArea, dfs(grid, r, c));
            }
        }
    }
    return maxArea;
}

private int dfs(int[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == 0) {
        return 0;
    }
    grid[r][c] = 0; // mark visited
    int area = 1;
    area += dfs(grid, r + 1, c);
    area += dfs(grid, r - 1, c);
    area += dfs(grid, r, c + 1);
    area += dfs(grid, r, c - 1);
    return area;
}
```

</div>

## How Media.net Tests Matrix vs Other Companies

Compared to other companies, Media.net's matrix questions have a distinct "applied algorithms" feel.

- **vs. FAANG:** Companies like Google might ask more abstract matrix puzzles (e.g., "Game of Life" with complex rules). Media.net's problems are more grounded—you're usually modeling a real-world spatial process (distance propagation, region grouping).
- **vs. Startups:** Startups might focus on raw speed with simpler iteration problems. Media.net expects you to identify and implement the optimal graph algorithm.
- **Unique Approach:** They often present the matrix as a _given data structure_ and ask you to _extract meaning_ from it. The challenge isn't matrix manipulation itself, but choosing the right traversal to answer a question about the data's structure.

## Study Order

Tackle these sub-topics in this logical progression:

1.  **Basic Matrix Iteration:** Get comfortable navigating with nested loops and direction vectors. This is your foundation.
2.  **DFS on Matrix:** Learn to use recursion (or an explicit stack) to explore connected components. This teaches you how to model adjacency and manage visited state.
3.  **BFS on Matrix:** Learn to use a queue for level-order traversal. Understand why BFS naturally finds shortest paths in unweighted grids.
4.  **Multi-Source BFS:** This is the critical jump. Recognize that you can initialize the queue with multiple starting points to solve "distance to nearest X" problems efficiently.
5.  **Dynamic Programming on Matrix:** While less frequent, some problems (like "Minimum Path Sum" - LeetCode #64) use the matrix for tabulation. Learn to build up solutions row by row.

This order works because each step builds on the previous. You can't implement Multi-Source BFS if you're shaky on standard BFS. You can't do BFS if you don't understand how to move between cells.

## Recommended Practice Order

Solve these problems in sequence to build the competency Media.net tests:

1.  **Number of Islands (LeetCode #200):** Master the DFS skeleton for connected components.
2.  **Max Area of Island (LeetCode #695):** A direct variation that adds area calculation.
3.  **Rotting Oranges (LeetCode #994):** Your first multi-source BFS problem. It clearly models simultaneous propagation.
4.  **01 Matrix (LeetCode #542):** The purest form of the multi-source BFS pattern. This should feel like a direct application of the skeleton code.
5.  **Walls and Gates (LeetCode #286):** Another classic multi-source BFS. Practice modifying the input in-place.
6.  **Shortest Path in Binary Matrix (LeetCode #1091):** Combines BFS for shortest path with obstacle avoidance. Tests if you can handle an extra constraint.

After this sequence, the pattern will be ingrained. You'll see a matrix and immediately ask: "Is this about connected regions (DFS) or shortest distances (BFS)?"

[Practice Matrix at Media.net](/company/medianet/matrix)
