---
title: "Breadth-First Search Questions at Flipkart: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Flipkart — patterns, difficulty breakdown, and study tips."
date: "2028-04-26"
category: "dsa-patterns"
tags: ["flipkart", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Flipkart: What to Expect

Flipkart's coding interview preparation list contains 19 Breadth-First Search (BFS) questions out of 117 total — that's over 16% of their technical interview content. This isn't a coincidence. Flipkart, as India's leading e-commerce platform, deals extensively with problems involving shortest paths, level-order traversals, and multi-source propagation — all domains where BFS excels. Whether you're calculating delivery routes, modeling user behavior flows, or analyzing network connectivity in their distributed systems, BFS provides the fundamental algorithmic approach.

In real interviews, BFS questions appear in about 1 out of every 3 technical rounds at Flipkart. They're not just coding exercises — they're used to assess how you think about problems involving layers, distances, and systematic exploration. Interviewers look for candidates who can recognize when BFS is appropriate and implement it cleanly with proper termination conditions and visited state management.

## Specific Patterns Flipkart Favors

Flipkart's BFS questions cluster around three specific patterns that mirror their business needs:

1. **Multi-Source BFS**: Problems where multiple starting points simultaneously propagate outward. This pattern models scenarios like multiple warehouses dispatching deliveries or multiple servers broadcasting updates. LeetCode #994 "Rotting Oranges" is a classic example that appears frequently in their interviews.

2. **Shortest Path in Unweighted Grids**: Given Flipkart's logistics focus, finding the shortest path in a grid with obstacles is practically a job requirement. Problems like LeetCode #1091 "Shortest Path in Binary Matrix" test your ability to navigate 8-directional movement with early termination.

3. **Level-Order Traversal with State Tracking**: More advanced BFS problems where you need to track additional state during traversal, such as keys collected or obstacles removed. LeetCode #864 "Shortest Path to Get All Keys" represents this category well — it's challenging but reveals who can handle BFS with multiple dimensions.

What's interesting is what they _don't_ emphasize: simple tree level-order traversals (LeetCode #102) appear less frequently, suggesting they expect candidates to already have that foundational knowledge.

## How to Prepare

The key to mastering Flipkart's BFS questions is understanding that they're testing your ability to adapt the basic BFS template to specific constraints. Let's examine the multi-source BFS pattern, which appears most frequently:

<div class="code-group">

```python
from collections import deque
from typing import List

def multi_source_bfs(grid: List[List[int]]) -> int:
    """
    Multi-source BFS template for problems like Rotting Oranges (#994)
    Returns the minimum time for all targets to be reached from sources
    """
    if not grid or not grid[0]:
        return 0

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    minutes = 0

    # Initialize: add all sources to queue and count targets
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # Source (e.g., rotten orange)
                queue.append((r, c))
            elif grid[r][c] == 1:  # Target (e.g., fresh orange)
                fresh_count += 1

    # If no targets, return immediately
    if fresh_count == 0:
        return 0

    # Directions: 4 or 8 depending on problem
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    # BFS with level tracking
    while queue and fresh_count > 0:
        # Process all nodes at current level (current minute)
        for _ in range(len(queue)):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                # Check bounds and validity
                if (0 <= nr < rows and 0 <= nc < cols and
                    grid[nr][nc] == 1):  # Is target?
                    grid[nr][nc] = 2  # Mark as visited/source
                    queue.append((nr, nc))
                    fresh_count -= 1

        minutes += 1

    return minutes if fresh_count == 0 else -1

# Time: O(rows * cols) | Space: O(rows * cols) for queue in worst case
```

```javascript
/**
 * Multi-source BFS template for problems like Rotting Oranges (#994)
 * Returns the minimum time for all targets to be reached from sources
 */
function multiSourceBFS(grid) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;

  // Initialize: add all sources to queue and count targets
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        // Source
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        // Target
        freshCount++;
      }
    }
  }

  // If no targets, return immediately
  if (freshCount === 0) return 0;

  // Directions: 4 or 8 depending on problem
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // BFS with level tracking
  while (queue.length > 0 && freshCount > 0) {
    // Process all nodes at current level
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        // Check bounds and validity
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2; // Mark as visited/source
          queue.push([nr, nc]);
          freshCount--;
        }
      }
    }

    minutes++;
  }

  return freshCount === 0 ? minutes : -1;
}

// Time: O(rows * cols) | Space: O(rows * cols) for queue in worst case
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class MultiSourceBFS {
    /**
     * Multi-source BFS template for problems like Rotting Oranges (#994)
     * Returns the minimum time for all targets to be reached from sources
     */
    public int multiSourceBFS(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) return 0;

        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;
        int minutes = 0;

        // Initialize: add all sources to queue and count targets
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 2) {  // Source
                    queue.offer(new int[]{r, c});
                } else if (grid[r][c] == 1) {  // Target
                    freshCount++;
                }
            }
        }

        // If no targets, return immediately
        if (freshCount == 0) return 0;

        // Directions: 4 or 8 depending on problem
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        // BFS with level tracking
        while (!queue.isEmpty() && freshCount > 0) {
            // Process all nodes at current level
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] cell = queue.poll();
                int r = cell[0];
                int c = cell[1];

                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    // Check bounds and validity
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                        grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;  // Mark as visited/source
                        queue.offer(new int[]{nr, nc});
                        freshCount--;
                    }
                }
            }

            minutes++;
        }

        return freshCount == 0 ? minutes : -1;
    }
}

// Time: O(rows * cols) | Space: O(rows * cols) for queue in worst case
```

</div>

Notice the pattern: initialize all sources, track targets, process by levels, and return the level count. This template solves at least 5 of Flipkart's BFS questions.

For shortest path problems, the variation is tracking visited states more carefully:

<div class="code-group">

```python
from collections import deque
from typing import List

def shortest_path_binary_matrix(grid: List[List[int]]) -> int:
    """
    Shortest path in binary matrix (#1091)
    Returns the length of shortest clear path from top-left to bottom-right
    """
    if not grid or grid[0][0] == 1 or grid[-1][-1] == 1:
        return -1

    n = len(grid)
    if n == 1:
        return 1

    queue = deque([(0, 0, 1)])  # (row, col, distance)
    grid[0][0] = 1  # Mark as visited

    # 8 directions for diagonal movement
    directions = [
        (1, 0), (-1, 0), (0, 1), (0, -1),
        (1, 1), (1, -1), (-1, 1), (-1, -1)
    ]

    while queue:
        r, c, dist = queue.popleft()

        # Check if reached destination
        if r == n - 1 and c == n - 1:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                grid[nr][nc] = 1  # Mark as visited
                queue.append((nr, nc, dist + 1))

    return -1

# Time: O(n²) | Space: O(n²) for queue in worst case
```

```javascript
function shortestPathBinaryMatrix(grid) {
  if (!grid || grid[0][0] === 1 || grid[grid.length - 1][grid.length - 1] === 1) {
    return -1;
  }

  const n = grid.length;
  if (n === 1) return 1;

  const queue = [[0, 0, 1]]; // [row, col, distance]
  grid[0][0] = 1; // Mark as visited

  // 8 directions for diagonal movement
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift();

    // Check if reached destination
    if (r === n - 1 && c === n - 1) {
      return dist;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
        grid[nr][nc] = 1; // Mark as visited
        queue.push([nr, nc, dist + 1]);
      }
    }
  }

  return -1;
}

// Time: O(n²) | Space: O(n²) for queue in worst case
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class ShortestPathBinaryMatrix {
    public int shortestPathBinaryMatrix(int[][] grid) {
        if (grid == null || grid[0][0] == 1 ||
            grid[grid.length-1][grid.length-1] == 1) {
            return -1;
        }

        int n = grid.length;
        if (n == 1) return 1;

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, 1});  // {row, col, distance}
        grid[0][0] = 1;  // Mark as visited

        // 8 directions for diagonal movement
        int[][] directions = {
            {1, 0}, {-1, 0}, {0, 1}, {0, -1},
            {1, 1}, {1, -1}, {-1, 1}, {-1, -1}
        };

        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int r = cell[0];
            int c = cell[1];
            int dist = cell[2];

            // Check if reached destination
            if (r == n - 1 && c == n - 1) {
                return dist;
            }

            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {
                    grid[nr][nc] = 1;  // Mark as visited
                    queue.offer(new int[]{nr, nc, dist + 1});
                }
            }
        }

        return -1;
    }
}

// Time: O(n²) | Space: O(n²) for queue in worst case
```

</div>

## How Flipkart Tests Breadth-First Search vs Other Companies

Flipkart's BFS questions differ from other companies in subtle but important ways:

**Compared to Google**: Google tends toward more abstract graph theory problems (LeetCode #815 "Bus Routes"). Flipkart prefers concrete grid-based problems that model real-world logistics scenarios.

**Compared to Amazon**: Amazon's BFS questions often involve trees and serialization (LeetCode #297 "Serialize and Deserialize Binary Tree"). Flipkart focuses on shortest path and propagation problems.

**Compared to Microsoft**: Microsoft mixes BFS with other patterns in complex problems. Flipkart's questions are more "pure" BFS but with clever constraints.

What's unique about Flipkart's approach is their emphasis on **optimization within the BFS framework**. They'll give you a problem that can be solved with standard BFS, then ask: "Can you optimize the space complexity?" or "What if the grid has 10^6 cells?" This tests whether you understand BFS's limitations and when bidirectional BFS might be appropriate.

## Study Order

1. **Basic BFS on Trees** (LeetCode #102) - Understand level-order traversal fundamentals
2. **Basic BFS on Grids** (LeetCode #200 "Number of Islands") - Learn to navigate 2D spaces
3. **Shortest Path in Unweighted Graphs** (LeetCode #1091) - Master distance calculation
4. **Multi-Source BFS** (LeetCode #994) - Handle multiple starting points
5. **BFS with State Tracking** (LeetCode #864) - Add dimensions to your visited set
6. **Bidirectional BFS** (LeetCode #127 "Word Ladder") - Optimize for large search spaces

This order works because each step builds on the previous one. You can't optimize with bidirectional BFS if you don't understand standard BFS. You can't handle state tracking if you're still struggling with basic grid navigation.

## Recommended Practice Order

1. Rotting Oranges (#994) - Multi-source BFS fundamentals
2. Shortest Path in Binary Matrix (#1091) - Grid navigation with obstacles
3. Walls and Gates (#286) - Another multi-source variation
4. 01 Matrix (#542) - Multi-source with distance calculation
5. Shortest Path to Get All Keys (#864) - Advanced state tracking
6. Sliding Puzzle (#773) - BFS on state space (challenging but excellent practice)

Solve these in sequence, and you'll cover 90% of Flipkart's BFS question types. Focus on writing clean, bug-free implementations rather than rushing through many problems. Remember: at Flipkart, they're evaluating not just whether you solve the problem, but how maintainable your code would be in their production systems.

[Practice Breadth-First Search at Flipkart](/company/flipkart/breadth-first-search)
