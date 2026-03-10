---
title: "Breadth-First Search Questions at Anduril: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Anduril — patterns, difficulty breakdown, and study tips."
date: "2029-12-13"
category: "dsa-patterns"
tags: ["anduril", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Anduril: What to Expect

If you're preparing for Anduril interviews, you've probably noticed something interesting in their question distribution: 10 out of 43 total questions are Breadth-First Search problems. That's nearly 25% of their technical interview content. This isn't random—it reflects Anduril's focus on spatial reasoning, robotics, autonomous systems, and defense applications where understanding adjacency, connectivity, and shortest paths is fundamental.

At Anduril, BFS isn't just another algorithm to know—it's a core tool for solving real problems they face daily. Whether it's pathfinding for autonomous vehicles, network analysis for sensor grids, or spatial reasoning for simulation systems, BFS provides the foundation for understanding connectivity and distance in discrete spaces. In my conversations with engineers who've interviewed there, BFS questions appear in about 1 in 3 technical interviews, often as the primary algorithm question rather than a warm-up.

## Specific Patterns Anduril Favors

Anduril's BFS questions tend to cluster around three specific patterns that mirror their engineering challenges:

1. **Grid-based shortest path problems** - These dominate their question bank because they directly model robotic navigation, sensor coverage, and spatial analysis. You'll see variations with obstacles, multiple starting points, and specific termination conditions.

2. **Level-order traversal with state tracking** - Unlike basic BFS that tracks visited nodes, Anduril often adds layers of state (keys collected, time elapsed, resources consumed). This transforms simple traversal into complex state-space search.

3. **Multi-source BFS** - Starting from multiple points simultaneously is common in their problems, reflecting real scenarios like deploying multiple autonomous units or analyzing coverage from multiple sensors.

A perfect example is **"Rotting Oranges" (LeetCode #994)**, which appears in their question bank. This combines grid traversal with multi-source BFS and state tracking (fresh vs. rotten). Another favorite is **"Shortest Path in Binary Matrix" (LeetCode #1091)**, which tests your ability to find shortest paths in grids with obstacles—directly applicable to navigation problems.

## How to Prepare

The key to Anduril's BFS questions is recognizing that they're rarely about vanilla BFS. You need to master the pattern variations. Let's examine the multi-source BFS pattern that appears frequently:

<div class="code-group">

```python
from collections import deque
from typing import List

def multi_source_bfs(grid: List[List[int]], sources: List[tuple]) -> List[List[int]]:
    """
    Multi-source BFS that computes distance from any source to all cells.
    Perfect for problems like "Rotting Oranges" or sensor coverage.

    Time: O(m*n) where m,n are grid dimensions
    Space: O(m*n) for the queue and distance matrix
    """
    if not grid or not grid[0]:
        return []

    m, n = len(grid), len(grid[0])
    # Initialize distance matrix with -1 (unreachable)
    dist = [[-1] * n for _ in range(m)]
    queue = deque()

    # Add all sources to queue with distance 0
    for r, c in sources:
        if 0 <= r < m and 0 <= c < n:
            dist[r][c] = 0
            queue.append((r, c))

    # Standard BFS directions
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

    while queue:
        r, c = queue.popleft()
        current_dist = dist[r][c]

        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            # Check bounds and if cell hasn't been visited
            if 0 <= nr < m and 0 <= nc < n and dist[nr][nc] == -1:
                # Additional condition based on problem
                # For example: grid[nr][nc] == 1 for traversable cells
                dist[nr][nc] = current_dist + 1
                queue.append((nr, nc))

    return dist
```

```javascript
/**
 * Multi-source BFS implementation for grid problems
 * Time: O(m*n) | Space: O(m*n)
 */
function multiSourceBFS(grid, sources) {
  if (!grid.length || !grid[0].length) return [];

  const m = grid.length,
    n = grid[0].length;
  const dist = Array(m)
    .fill()
    .map(() => Array(n).fill(-1));
  const queue = [];

  // Initialize all sources
  for (const [r, c] of sources) {
    if (r >= 0 && r < m && c >= 0 && c < n) {
      dist[r][c] = 0;
      queue.push([r, c]);
    }
  }

  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  for (let i = 0; i < queue.length; i++) {
    const [r, c] = queue[i];
    const currentDist = dist[r][c];

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;

      if (nr >= 0 && nr < m && nc >= 0 && nc < n && dist[nr][nc] === -1) {
        // Add problem-specific condition here
        dist[nr][nc] = currentDist + 1;
        queue.push([nr, nc]);
      }
    }
  }

  return dist;
}
```

```java
import java.util.*;

public class MultiSourceBFS {
    /**
     * Multi-source BFS for grid traversal
     * Time: O(m*n) | Space: O(m*n)
     */
    public int[][] multiSourceBFS(int[][] grid, int[][] sources) {
        if (grid.length == 0 || grid[0].length == 0) {
            return new int[0][0];
        }

        int m = grid.length, n = grid[0].length;
        int[][] dist = new int[m][n];
        Queue<int[]> queue = new LinkedList<>();

        // Initialize distances to -1 and add sources
        for (int i = 0; i < m; i++) {
            Arrays.fill(dist[i], -1);
        }

        for (int[] source : sources) {
            int r = source[0], c = source[1];
            if (r >= 0 && r < m && c >= 0 && c < n) {
                dist[r][c] = 0;
                queue.offer(new int[]{r, c});
            }
        }

        int[][] directions = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int r = current[0], c = current[1];

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];

                if (nr >= 0 && nr < m && nc >= 0 && nc < n && dist[nr][nc] == -1) {
                    // Add problem-specific condition
                    dist[nr][nc] = dist[r][c] + 1;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }

        return dist;
    }
}
```

</div>

Another critical pattern is BFS with state tracking. Anduril loves problems where you need to track additional information beyond position:

<div class="code-group">

```python
from collections import deque
from typing import List

def bfs_with_state(grid: List[List[str]]) -> int:
    """
    BFS with state tracking (like keys collected, time, etc.)
    Example: "Shortest Path to Get All Keys" (LeetCode #864)

    Time: O(m*n*2^k) where k is number of states (keys in this case)
    Space: O(m*n*2^k) for visited states
    """
    if not grid or not grid[0]:
        return -1

    m, n = len(grid), len(grid[0])
    # Find starting position and count keys
    start_r = start_c = -1
    key_count = 0

    for r in range(m):
        for c in range(n):
            if grid[r][c] == '@':
                start_r, start_c = r, c
            elif 'a' <= grid[r][c] <= 'f':
                key_count = max(key_count, ord(grid[r][c]) - ord('a') + 1)

    # State: (row, col, keys_bitmask)
    # visited[row][col][bitmask] tracks visited states
    visited = [[[False] * (1 << key_count) for _ in range(n)] for _ in range(m)]
    queue = deque()

    # Start with no keys collected
    start_state = (start_r, start_c, 0)
    visited[start_r][start_c][0] = True
    queue.append((start_r, start_c, 0, 0))  # (r, c, keys, distance)

    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

    while queue:
        r, c, keys, dist = queue.popleft()

        # Check if we collected all keys
        if keys == (1 << key_count) - 1:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] != '#':
                cell = grid[nr][nc]
                new_keys = keys

                # Handle key collection
                if 'a' <= cell <= 'f':
                    key_idx = ord(cell) - ord('a')
                    new_keys = keys | (1 << key_idx)

                # Handle door - need corresponding key
                elif 'A' <= cell <= 'F':
                    door_idx = ord(cell) - ord('A')
                    if not (keys & (1 << door_idx)):
                        continue  # Don't have the key

                # Check if this state has been visited
                if not visited[nr][nc][new_keys]:
                    visited[nr][nc][new_keys] = True
                    queue.append((nr, nc, new_keys, dist + 1))

    return -1
```

```javascript
// Similar state-tracking BFS pattern in JavaScript
// Time: O(m*n*2^k) | Space: O(m*n*2^k)
```

```java
// Similar state-tracking BFS pattern in Java
// Time: O(m*n*2^k) | Space: O(m*n*2^k)
```

</div>

## How Anduril Tests Breadth-First Search vs Other Companies

Anduril's BFS questions differ from other companies in three key ways:

1. **Applied context over algorithmic purity** - While Google might ask about BFS in abstract graphs, Anduril embeds it in realistic scenarios: "Given a grid representing a warehouse with obstacles, find the shortest path for a robot to reach all charging stations." The algorithm is the same, but the framing tests your ability to map real problems to algorithmic solutions.

2. **Emphasis on optimization constraints** - Facebook might accept a working BFS solution, but Anduril interviewers often push for optimizations specific to their domain: "Can you make it work with limited memory for embedded systems?" or "How would this scale to 3D grids?"

3. **Integration with other concepts** - Amazon might test BFS in isolation, but Anduril frequently combines it with bitmasking (for state), union-find (for connectivity analysis), or A\* search (for informed pathfinding). They're testing whether you see BFS as one tool in a larger toolbox.

## Study Order

1. **Basic BFS on graphs and grids** - Master the standard queue-based implementation before adding complexity. Understand why we use queues (FIFO) for level-order traversal.

2. **Shortest path in unweighted graphs** - Recognize that BFS naturally finds shortest paths when edges are unweighted. Practice on both adjacency list and matrix representations.

3. **Multi-source BFS** - Learn to initialize the queue with multiple starting points. This is counterintuitive for many but essential for coverage problems.

4. **BFS with state tracking** - Add dimensions to your visited tracking. Start with simple states (keys, time) before tackling complex combinations.

5. **Bidirectional BFS** - For further optimization, learn when and how to search from both ends. This is less common at Anduril but shows depth of knowledge.

6. **Integration patterns** - Practice combining BFS with other algorithms like Dijkstra's (for weighted edges) or topological sort (for dependency resolution).

This order works because each layer builds on the previous one. You can't optimize with bidirectional BFS if you don't understand basic BFS, and you can't handle state tracking if you're still struggling with multi-source initialization.

## Recommended Practice Order

1. **Binary Tree Level Order Traversal (LeetCode #102)** - Basic BFS on trees
2. **Number of Islands (LeetCode #200)** - Grid BFS with visited tracking
3. **Rotting Oranges (LeetCode #994)** - Multi-source BFS (direct Anduril question)
4. **Shortest Path in Binary Matrix (LeetCode #1091)** - Grid shortest path
5. **Walls and Gates (LeetCode #286)** - Multi-source BFS with distance recording
6. **01 Matrix (LeetCode #542)** - Another multi-source BFS variant
7. **Shortest Path to Get All Keys (LeetCode #864)** - BFS with state tracking (advanced)
8. **Sliding Puzzle (LeetCode #773)** - BFS on state space (shows versatility)
9. **Bus Routes (LeetCode #815)** - BFS with abstraction layer
10. **Cut Off Trees for Golf Event (LeetCode #675)** - Multiple BFS calls with sorting

This sequence starts with fundamentals and progresses to the exact patterns Anduril favors. By problem #6, you'll have seen multiple variations of their most common question type. Problems #7-10 prepare you for the more complex, integrated questions that separate strong from exceptional candidates.

[Practice Breadth-First Search at Anduril](/company/anduril/breadth-first-search)
