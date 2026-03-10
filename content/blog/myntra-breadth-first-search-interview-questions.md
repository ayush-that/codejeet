---
title: "Breadth-First Search Questions at Myntra: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Myntra — patterns, difficulty breakdown, and study tips."
date: "2031-05-01"
category: "dsa-patterns"
tags: ["myntra", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Myntra: What to Expect

If you're preparing for Myntra's technical interviews, you've probably noticed their coding question distribution: 3 out of 24 problems focus on Breadth-First Search. That's 12.5% of their problem bank dedicated to BFS. But here's what those numbers don't tell you: in actual interviews, BFS questions appear even more frequently than that ratio suggests. Why? Because BFS isn't just an algorithm—it's a fundamental pattern for solving problems involving shortest paths, level-order traversal, and connectivity checks, all of which are highly relevant to e-commerce platforms like Myntra.

Think about Myntra's domain: recommendation systems (graph-based user-item connections), warehouse path optimization (shortest routes through storage), UI component rendering (tree structures), and social features (friend networks). BFS naturally maps to these real-world scenarios. During my conversations with engineers who've interviewed at Myntra, I've found that BFS questions typically appear in the second coding round, often disguised as matrix traversal or tree problems. They're rarely standalone "implement BFS" questions—instead, they're practical problems where BFS is the optimal approach.

## Specific Patterns Myntra Favors

Myntra's BFS questions tend to cluster around three specific patterns:

1. **Grid/Matrix Traversal with Constraints** - These are the most common. You're given a grid representing something like a warehouse layout, delivery map, or UI component arrangement, and you need to find the shortest path with obstacles, multiple starting points, or conditional movement. Think "Rotting Oranges (#994)" or "Shortest Path in Binary Matrix (#1091)" style problems, but often with e-commerce twists like "find the shortest delivery route avoiding out-of-stock zones."

2. **Level-Order Tree Traversal with Processing** - Not just printing levels, but doing something at each level: calculating averages, finding largest values, or connecting nodes. "Binary Tree Level Order Traversal (#102)" is the foundation, but Myntra often extends this to problems like "Populating Next Right Pointers in Each Node (#116)" which mimics connecting recommendation carousels.

3. **Multi-Source BFS** - Starting BFS from multiple points simultaneously. This pattern appears in problems about service centers reaching customers, inventory spreading through warehouses, or notifications propagating through user networks. The key insight is initializing the queue with all sources at once.

Here's what's notably absent: complex graph theory problems with advanced algorithms. Myntra stays practical—their BFS questions test whether you can recognize when BFS applies and implement it cleanly with the right data structures.

## How to Prepare

The biggest mistake I see candidates make is memorizing BFS implementations without understanding the variations. Let me show you the two template variations you absolutely need to master:

<div class="code-group">

```python
# Standard Single-Source BFS Template
# Time: O(V + E) for graphs, O(m*n) for grids | Space: O(V) or O(m*n)
from collections import deque

def bfs_grid(grid, start_row, start_col):
    if not grid or not grid[0]:
        return -1

    rows, cols = len(grid), len(grid[0])
    # For shortest path problems, we often track distances
    distance = [[-1] * cols for _ in range(rows)]
    queue = deque()

    # Initialize with starting point
    queue.append((start_row, start_col))
    distance[start_row][start_col] = 0

    # Common directions for grid problems
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue:
        row, col = queue.popleft()

        # Process current cell
        # (Often check if we reached target here)

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Boundary check
            if 0 <= new_row < rows and 0 <= new_col < cols:
                # Constraint check (obstacles, visited, etc.)
                if grid[new_row][new_col] == 0 and distance[new_row][new_col] == -1:
                    distance[new_row][new_col] = distance[row][col] + 1
                    queue.append((new_row, new_col))

    return distance  # Or specific target distance
```

```javascript
// Standard Single-Source BFS Template
// Time: O(V + E) for graphs, O(m*n) for grids | Space: O(V) or O(m*n)
function bfsGrid(grid, startRow, startCol) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return -1;

  const rows = grid.length;
  const cols = grid[0].length;
  // For shortest path problems
  const distance = Array(rows)
    .fill()
    .map(() => Array(cols).fill(-1));
  const queue = [];

  // Initialize
  queue.push([startRow, startCol]);
  distance[startRow][startCol] = 0;

  // Grid directions
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0) {
    const [row, col] = queue.shift();

    // Process current cell

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Boundary check
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        // Constraint check
        if (grid[newRow][newCol] === 0 && distance[newRow][newCol] === -1) {
          distance[newRow][newCol] = distance[row][col] + 1;
          queue.push([newRow, newCol]);
        }
      }
    }
  }

  return distance;
}
```

```java
// Standard Single-Source BFS Template
// Time: O(V + E) for graphs, O(m*n) for grids | Space: O(V) or O(m*n)
import java.util.*;

public class BFSGrid {
    public int[][] bfsGrid(int[][] grid, int startRow, int startCol) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return new int[0][0];
        }

        int rows = grid.length;
        int cols = grid[0].length;
        int[][] distance = new int[rows][cols];
        for (int[] row : distance) {
            Arrays.fill(row, -1);
        }

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{startRow, startCol});
        distance[startRow][startCol] = 0;

        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];

            // Process current cell

            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                // Boundary check
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    // Constraint check
                    if (grid[newRow][newCol] == 0 && distance[newRow][newCol] == -1) {
                        distance[newRow][newCol] = distance[row][col] + 1;
                        queue.offer(new int[]{newRow, newCol});
                    }
                }
            }
        }

        return distance;
    }
}
```

</div>

Now here's the multi-source variation that's particularly important for Myntra:

<div class="code-group">

```python
# Multi-Source BFS Template (Critical for Myntra)
# Time: O(m*n) | Space: O(m*n)
from collections import deque

def multi_source_bfs(grid, sources):
    if not grid or not grid[0]:
        return -1

    rows, cols = len(grid), len(grid[0])
    distance = [[-1] * cols for _ in range(rows)]
    queue = deque()

    # Initialize with ALL sources
    for source in sources:
        r, c = source
        queue.append((r, c))
        distance[r][c] = 0  # All sources at distance 0

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue:
        row, col = queue.popleft()

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            if 0 <= new_row < rows and 0 <= new_col < cols:
                if grid[new_row][new_col] == 0 and distance[new_row][new_col] == -1:
                    distance[new_row][new_col] = distance[row][col] + 1
                    queue.append((new_row, new_col))

    return distance
```

```javascript
// Multi-Source BFS Template (Critical for Myntra)
// Time: O(m*n) | Space: O(m*n)
function multiSourceBFS(grid, sources) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return [];

  const rows = grid.length;
  const cols = grid[0].length;
  const distance = Array(rows)
    .fill()
    .map(() => Array(cols).fill(-1));
  const queue = [];

  // Initialize with ALL sources
  for (const [r, c] of sources) {
    queue.push([r, c]);
    distance[r][c] = 0;
  }

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0) {
    const [row, col] = queue.shift();

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        if (grid[newRow][newCol] === 0 && distance[newRow][newCol] === -1) {
          distance[newRow][newCol] = distance[row][col] + 1;
          queue.push([newRow, newCol]);
        }
      }
    }
  }

  return distance;
}
```

```java
// Multi-Source BFS Template (Critical for Myntra)
// Time: O(m*n) | Space: O(m*n)
import java.util.*;

public class MultiSourceBFS {
    public int[][] multiSourceBFS(int[][] grid, List<int[]> sources) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return new int[0][0];
        }

        int rows = grid.length;
        int cols = grid[0].length;
        int[][] distance = new int[rows][cols];
        for (int[] row : distance) {
            Arrays.fill(row, -1);
        }

        Queue<int[]> queue = new LinkedList<>();

        // Initialize with ALL sources
        for (int[] source : sources) {
            queue.offer(source);
            distance[source[0]][source[1]] = 0;
        }

        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];

            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    if (grid[newRow][newCol] == 0 && distance[newRow][newCol] == -1) {
                        distance[newRow][newCol] = distance[row][col] + 1;
                        queue.offer(new int[]{newRow, newCol});
                    }
                }
            }
        }

        return distance;
    }
}
```

</div>

## How Myntra Tests Breadth-First Search vs Other Companies

Myntra's BFS questions differ from other companies in three key ways:

**Difficulty Level**: Myntra's questions are typically in the Medium range, but they test implementation cleanliness more than algorithmic cleverness. At FAANG companies, you might see Hard BFS problems requiring A\* or bidirectional BFS. At Myntra, the challenge is recognizing which BFS variation to use and implementing it without bugs.

**Problem Context**: Myntra often wraps BFS in e-commerce scenarios. Instead of "find the shortest path in a maze," it might be "calculate minimum time for warehouse robots to reach all inventory bins" or "find the closest service center for each customer location." The algorithm is standard, but you need to map the business problem to BFS correctly.

**Follow-up Questions**: Myntra interviewers frequently ask about optimization after you solve the initial problem. "Can we reduce space complexity?" "What if we have multiple destinations?" "How would this scale with 1 million nodes?" Be prepared to discuss trade-offs.

## Study Order

Don't jump straight into Myntra's specific problems. Build your foundation systematically:

1. **Basic BFS on Trees** - Start with "Binary Tree Level Order Traversal (#102)" to understand the queue-based level processing. This is fundamental—if you can't do this, you can't do anything more complex.

2. **BFS on Grids/Matrices** - Move to "Number of Islands (#200)" to learn grid traversal patterns. This teaches you boundary checking, visited tracking, and direction arrays.

3. **Shortest Path BFS** - Practice "Rotting Oranges (#994)" which introduces distance tracking and multi-source BFS. This is where you learn that BFS finds shortest paths in unweighted graphs.

4. **BFS with Constraints** - Try "Shortest Path in Binary Matrix (#1091)" which adds obstacle constraints. Myntra loves these "path with conditions" problems.

5. **BFS on Implicit Graphs** - Finally, attempt "Word Ladder (#127)" to understand that BFS works on any state space, not just explicit graphs.

This order works because each step builds on the previous one. You start with the simplest structure (trees), move to 2D traversal, add pathfinding, incorporate constraints, and finally generalize to any state space.

## Recommended Practice Order

Here's a curated sequence of LeetCode problems that mirror Myntra's interview progression:

1. **Binary Tree Level Order Traversal (#102)** - The absolute foundation
2. **Number of Islands (#200)** - Grid traversal basics
3. **Rotting Oranges (#994)** - Multi-source BFS (highly relevant to Myntra)
4. **Shortest Path in Binary Matrix (#1091)** - Constrained pathfinding
5. **Walls and Gates (#286)** - Another multi-source pattern
6. **01 Matrix (#542)** - Distance transformation (common in image/UI processing)
7. **Populating Next Right Pointers in Each Node (#116)** - Tree BFS with pointer manipulation

If you have time, add "Snakes and Ladders (#909)"—it's not directly e-commerce related, but it tests your ability to model a problem as BFS, which is exactly what Myntra looks for.

Remember: Myntra isn't testing whether you've memorized BFS. They're testing whether you can recognize when a problem reduces to BFS and implement it cleanly. Focus on understanding why BFS works (it explores nodes in order of distance from the source) rather than just memorizing code. When you practice, always ask yourself: "Why is BFS the right approach here? What guarantees does it provide?"

[Practice Breadth-First Search at Myntra](/company/myntra/breadth-first-search)
