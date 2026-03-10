---
title: "Breadth-First Search Questions at Coupang: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Coupang — patterns, difficulty breakdown, and study tips."
date: "2029-06-28"
category: "dsa-patterns"
tags: ["coupang", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Coupang: What to Expect

If you're preparing for Coupang interviews, you've probably noticed their Breadth-First Search (BFS) emphasis: 5 out of 53 total questions is nearly 10% of their problem set. That's not an accident. As a senior engineer who's both taken and given interviews at e-commerce giants, I can tell you this pattern matters more at Coupang than at many other companies. Here's why: Coupang's core business involves logistics, routing, warehouse management, and recommendation systems—all domains where BFS naturally appears. When you're finding the shortest delivery route through a warehouse grid or determining degrees of separation in a social graph for recommendations, BFS is your tool.

In real interviews, you'll likely encounter at least one BFS problem, often in the second technical round. The good news? Coupang's BFS problems tend to follow recognizable patterns rather than being obscure graph theory puzzles. The bad news? They often layer additional constraints that test whether you truly understand the algorithm versus just memorizing template code.

## Specific Patterns Coupang Favors

Coupang's BFS problems cluster around three main patterns:

1. **Grid-based shortest path problems** - These are the most common. Think warehouse navigation, robot movement, or delivery routing. You're given an m×n grid with obstacles, and you need the shortest path from start to finish. The twist is usually in the constraints: multiple starting points, keys and doors, or breaking obstacles.

2. **Level-order tree traversal with a twist** - While basic level-order traversal is too simple for Coupang interviews, they love problems where you need to track something per level: connecting nodes at each level, zigzag traversal, or finding the largest value per level.

3. **Word ladder and transformation problems** - These appear less frequently but are worth preparing for, especially given Coupang's recommendation systems. The pattern involves finding the shortest transformation sequence between two states.

Specific LeetCode problems that mirror Coupang's style include:

- **Shortest Path in Binary Matrix (#1091)** - Classic grid BFS with a simple obstacle pattern
- **Rotting Oranges (#994)** - Multi-source BFS (multiple starting points)
- **Binary Tree Level Order Traversal (#102)** - The foundation for more complex level-order problems
- **Word Ladder (#127)** - Graph BFS disguised as word transformations

Notice what's missing: complex graph theory problems with advanced algorithms. Coupang focuses on practical applications of BFS rather than theoretical graph problems.

## How to Prepare

The key to Coupang's BFS problems is mastering the standard template, then learning the common variations. Let's start with the grid BFS template—this handles 80% of their problems:

<div class="code-group">

```python
from collections import deque

def grid_bfs(grid, start):
    """
    Standard grid BFS template for shortest path problems.
    Returns the shortest path length from start to any reachable cell.
    """
    if not grid or not grid[0]:
        return -1

    rows, cols = len(grid), len(grid[0])
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # 4-directional movement

    # Initialize queue and visited set
    queue = deque([(start[0], start[1], 0)])  # (row, col, distance)
    visited = set([(start[0], start[1])])

    while queue:
        row, col, dist = queue.popleft()

        # Check if we reached a target (implementation varies)
        # if (row, col) == target: return dist

        # Explore neighbors
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Boundary and obstacle check
            if (0 <= new_row < rows and 0 <= new_col < cols and
                grid[new_row][new_col] != 1 and  # Assuming 1 is obstacle
                (new_row, new_col) not in visited):

                visited.add((new_row, new_col))
                queue.append((new_row, new_col, dist + 1))

    return -1  # Target not reachable

# Time: O(m*n) where m=rows, n=cols | Space: O(m*n) for visited set
```

```javascript
function gridBFS(grid, start) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return -1;

  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const queue = [[start[0], start[1], 0]]; // [row, col, distance]
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();

    // Check if we reached a target
    // if (row === target[0] && col === target[1]) return dist;

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      const key = `${newRow},${newCol}`;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] !== 1 && // Assuming 1 is obstacle
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push([newRow, newCol, dist + 1]);
      }
    }
  }

  return -1; // Target not reachable
}

// Time: O(m*n) where m=rows, n=cols | Space: O(m*n) for visited set
```

```java
import java.util.*;

public class GridBFS {
    public int gridBFS(int[][] grid, int[] start) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) return -1;

        int rows = grid.length;
        int cols = grid[0].length;
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{start[0], start[1], 0});
        boolean[][] visited = new boolean[rows][cols];
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];
            int dist = current[2];

            // Check if we reached a target
            // if (row == target[0] && col == target[1]) return dist;

            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                if (newRow >= 0 && newRow < rows &&
                    newCol >= 0 && newCol < cols &&
                    grid[newRow][newCol] != 1 &&  // Assuming 1 is obstacle
                    !visited[newRow][newCol]) {

                    visited[newRow][newCol] = true;
                    queue.offer(new int[]{newRow, newCol, dist + 1});
                }
            }
        }

        return -1;  // Target not reachable
    }
}

// Time: O(m*n) where m=rows, n=cols | Space: O(m*n) for visited array
```

</div>

The second pattern to master is multi-source BFS, which appears in problems like "Rotting Oranges" where you start from multiple points simultaneously:

<div class="code-group">

```python
from collections import deque

def multi_source_bfs(grid, sources):
    """
    Multi-source BFS: all sources start simultaneously.
    Returns minimum distance to reach any cell from nearest source.
    """
    if not grid or not grid[0]:
        return -1

    rows, cols = len(grid), len(grid[0])
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    queue = deque()
    visited = [[False] * cols for _ in range(rows)]
    distance = [[-1] * cols for _ in range(rows)]

    # Initialize all sources
    for r, c in sources:
        queue.append((r, c, 0))
        visited[r][c] = True
        distance[r][c] = 0

    while queue:
        row, col, dist = queue.popleft()

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            if (0 <= new_row < rows and 0 <= new_col < cols and
                not visited[new_row][new_col] and
                grid[new_row][new_col] != 1):  # Assuming 1 is obstacle

                visited[new_row][new_col] = True
                distance[new_row][new_col] = dist + 1
                queue.append((new_row, new_col, dist + 1))

    return distance

# Time: O(m*n) | Space: O(m*n)
```

```javascript
function multiSourceBFS(grid, sources) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return -1;

  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const queue = [];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const distance = Array.from({ length: rows }, () => Array(cols).fill(-1));

  // Initialize all sources
  for (const [r, c] of sources) {
    queue.push([r, c, 0]);
    visited[r][c] = true;
    distance[r][c] = 0;
  }

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol] &&
        grid[newRow][newCol] !== 1
      ) {
        visited[newRow][newCol] = true;
        distance[newRow][newCol] = dist + 1;
        queue.push([newRow, newCol, dist + 1]);
      }
    }
  }

  return distance;
}

// Time: O(m*n) | Space: O(m*n)
```

```java
import java.util.*;

public class MultiSourceBFS {
    public int[][] multiSourceBFS(int[][] grid, List<int[]> sources) {
        if (grid == null || grid.length == 0 || grid[0].length == 0)
            return new int[0][0];

        int rows = grid.length;
        int cols = grid[0].length;
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

        Queue<int[]> queue = new LinkedList<>();
        boolean[][] visited = new boolean[rows][cols];
        int[][] distance = new int[rows][cols];

        // Initialize distance with -1 and set sources to 0
        for (int i = 0; i < rows; i++) {
            Arrays.fill(distance[i], -1);
        }

        for (int[] source : sources) {
            int r = source[0], c = source[1];
            queue.offer(new int[]{r, c, 0});
            visited[r][c] = true;
            distance[r][c] = 0;
        }

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];
            int dist = current[2];

            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                if (newRow >= 0 && newRow < rows &&
                    newCol >= 0 && newCol < cols &&
                    !visited[newRow][newCol] &&
                    grid[newRow][newCol] != 1) {

                    visited[newRow][newCol] = true;
                    distance[newRow][newCol] = dist + 1;
                    queue.offer(new int[]{newRow, newCol, dist + 1});
                }
            }
        }

        return distance;
    }
}

// Time: O(m*n) | Space: O(m*n)
```

</div>

## How Coupang Tests Breadth-First Search vs Other Companies

Coupang's BFS questions differ from other companies in three key ways:

1. **Practical over theoretical** - While Google might ask about BFS in abstract graph theory problems, Coupang almost always grounds their questions in real-world scenarios: warehouse navigation, social network degrees, or recommendation pathways. You need to translate the business problem into a BFS problem.

2. **Constraint-heavy but not trick-heavy** - Amazon loves to add tricky constraints (like teleporters or time-based obstacles). Coupang's constraints are more straightforward but test your implementation rigor: multiple starting points, different cell types, or minimum steps with specific rules.

3. **Implementation efficiency matters** - At Facebook (Meta), you might get away with a suboptimal BFS if you explain the trade-offs. At Coupang, they often expect the optimal BFS implementation because their problems scale to warehouse-sized grids. They'll notice if you use DFS where BFS is appropriate for shortest path.

## Study Order

Follow this sequence to build your BFS skills systematically:

1. **Basic BFS on trees** - Start with level-order traversal to understand the queue mechanism without grid complexities. Practice until you can write it without thinking.

2. **Grid BFS with obstacles** - Learn to handle boundaries and obstacles. This is where most Coupang problems live.

3. **Shortest path variations** - Practice problems where you need to track distance or path reconstruction. Understand why BFS gives shortest path in unweighted graphs.

4. **Multi-source BFS** - Master starting from multiple points simultaneously. This pattern appears in several Coupang problems.

5. **State-space BFS** - Learn to encode additional state in your BFS (like keys collected or doors opened). This is the hardest but most impressive to get right.

6. **Bidirectional BFS** - For advanced preparation, understand when and how to implement bidirectional search for optimization.

## Recommended Practice Order

Solve these problems in sequence:

1. **Binary Tree Level Order Traversal (#102)** - Master the basic queue pattern
2. **Number of Islands (#200)** - BFS on grid (though DFS also works)
3. **Rotting Oranges (#994)** - Multi-source BFS, classic Coupang pattern
4. **Shortest Path in Binary Matrix (#1091)** - Pure grid BFS for shortest path
5. **Word Ladder (#127)** - Graph BFS with string transformations
6. **01 Matrix (#542)** - Another multi-source BFS variation
7. **Shortest Path to Get All Keys (#864)** - Advanced state-space BFS (if you have time)

Spend most time on #3 and #4—these patterns appear most frequently at Coupang. For each problem, implement it in your interview language of choice, then analyze time/space complexity aloud as if explaining to an interviewer. That last step is crucial: Coupang interviewers want to see you understand the implications of your implementation choices.

[Practice Breadth-First Search at Coupang](/company/coupang/breadth-first-search)
