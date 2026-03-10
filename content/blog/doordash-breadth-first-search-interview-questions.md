---
title: "Breadth-First Search Questions at DoorDash: What to Expect"
description: "Prepare for Breadth-First Search interview questions at DoorDash — patterns, difficulty breakdown, and study tips."
date: "2028-08-20"
category: "dsa-patterns"
tags: ["doordash", "breadth-first-search", "interview prep"]
---

## Why Breadth-First Search Matters at DoorDash

DoorDash's entire business is built on spatial logistics — moving food from restaurants to customers through a network of drivers. This makes graph traversal algorithms, particularly Breadth-First Search (BFS), fundamental to their technical interviews. With 17 BFS questions out of 87 total problems in their tagged question bank, BFS represents nearly 20% of their algorithmic focus. In real interviews, you're likely to encounter at least one BFS problem, often disguised as a "shortest path" or "minimum steps" question that maps directly to their delivery optimization challenges.

What's interesting is that DoorDash doesn't just test BFS as an academic exercise. They test it as a practical tool for solving spatial problems. While other companies might ask BFS questions about social networks or web crawling, DoorDash consistently frames BFS around movement through grids, finding optimal routes, and handling obstacles — all directly analogous to their core business problems.

## Specific Patterns DoorDash Favors

DoorDash's BFS questions cluster around three specific patterns:

1. **Grid traversal with obstacles** — These problems involve moving through a 2D grid with blocked cells, often finding the shortest path from point A to point B. The constraints frequently include multiple valid moves (up/down/left/right, sometimes diagonally) and varying terrain costs.

2. **Multi-source BFS** — Instead of starting from a single point, you begin from multiple starting points simultaneously. This pattern appears in problems about delivery from multiple restaurants or finding the nearest service point.

3. **BFS with state tracking** — These are more advanced problems where you need to track additional state during traversal, like keys collected, obstacles removed, or time elapsed. The state becomes part of the visited tracking.

For example, **Walls and Gates (#286)** is a classic DoorDash multi-source BFS problem where you populate distances from multiple gates. **Shortest Path in Binary Matrix (#1091)** represents their grid traversal pattern with simple obstacles. For state tracking, **Shortest Path to Get All Keys (#864)** appears frequently in their question bank despite its difficulty — it tests whether you can extend basic BFS to handle complex constraints.

## How to Prepare

The key to DoorDash BFS preparation is mastering the template approach with the right modifications for their favored patterns. Let's examine the multi-source BFS pattern, which appears in at least 4 of their 17 BFS questions:

<div class="code-group">

```python
from collections import deque
from typing import List

def multi_source_bfs(grid: List[List[int]], sources: List[tuple]) -> List[List[int]]:
    """
    Multi-source BFS template for problems like Walls and Gates (#286).
    Finds shortest distance from any source to each cell.

    Time: O(m*n) where grid is m x n
    Space: O(m*n) for the queue and distance matrix
    """
    if not grid or not grid[0]:
        return grid

    m, n = len(grid), len(grid[0])
    # Initialize distance matrix with infinity
    dist = [[float('inf')] * n for _ in range(m)]
    queue = deque()

    # Add all sources to queue with distance 0
    for r, c in sources:
        dist[r][c] = 0
        queue.append((r, c))

    # Standard BFS directions
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue:
        r, c = queue.popleft()

        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            # Check bounds and any additional constraints
            if 0 <= nr < m and 0 <= nc < n:
                # For Walls and Gates: grid[nr][nc] == 2147483647 (INF)
                # For other problems: grid[nr][nc] != obstacle_value
                if grid[nr][nc] == 2147483647:  # INF in Walls and Gates
                    if dist[nr][nc] > dist[r][c] + 1:
                        dist[nr][nc] = dist[r][c] + 1
                        queue.append((nr, nc))

    return dist
```

```javascript
/**
 * Multi-source BFS template for problems like Walls and Gates (#286).
 * Time: O(m*n) where grid is m x n
 * Space: O(m*n) for the queue and distance matrix
 */
function multiSourceBFS(grid, sources) {
  if (!grid.length || !grid[0].length) return grid;

  const m = grid.length,
    n = grid[0].length;
  // Initialize distance matrix with Infinity
  const dist = Array.from({ length: m }, () => Array(n).fill(Infinity));
  const queue = [];

  // Add all sources to queue with distance 0
  for (const [r, c] of sources) {
    dist[r][c] = 0;
    queue.push([r, c]);
  }

  // Standard BFS directions
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

      // Check bounds
      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        // For Walls and Gates: grid[nr][nc] === 2147483647 (INF)
        if (grid[nr][nc] === 2147483647) {
          if (dist[nr][nc] > dist[r][c] + 1) {
            dist[nr][nc] = dist[r][c] + 1;
            queue.push([nr, nc]);
          }
        }
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
     * Multi-source BFS template for problems like Walls and Gates (#286).
     * Time: O(m*n) where grid is m x n
     * Space: O(m*n) for the queue and distance matrix
     */
    public int[][] multiSourceBFS(int[][] grid, List<int[]> sources) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return grid;
        }

        int m = grid.length, n = grid[0].length;
        int[][] dist = new int[m][n];
        for (int[] row : dist) {
            Arrays.fill(row, Integer.MAX_VALUE);
        }

        Queue<int[]> queue = new LinkedList<>();

        // Add all sources to queue with distance 0
        for (int[] source : sources) {
            int r = source[0], c = source[1];
            dist[r][c] = 0;
            queue.offer(new int[]{r, c});
        }

        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1];

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];

                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    // For Walls and Gates: grid[nr][nc] == Integer.MAX_VALUE
                    if (grid[nr][nc] == Integer.MAX_VALUE) {
                        if (dist[nr][nc] > dist[r][c] + 1) {
                            dist[nr][nc] = dist[r][c] + 1;
                            queue.offer(new int[]{nr, nc});
                        }
                    }
                }
            }
        }

        return dist;
    }
}
```

</div>

The second critical pattern is BFS with state tracking. Here's how to handle the visited set when state matters:

<div class="code-group">

```python
from collections import deque
from typing import List

def bfs_with_state(grid: List[List[str]]) -> int:
    """
    BFS with state tracking template for problems like Shortest Path to Get All Keys (#864).
    Tracks (row, col, keys_state) in visited set.

    Time: O(m*n*2^k) where k is number of keys
    Space: O(m*n*2^k) for the queue and visited set
    """
    if not grid or not grid[0]:
        return -1

    m, n = len(grid), len(grid[0])

    # Find starting point and count keys
    start_r = start_c = 0
    key_count = 0
    for r in range(m):
        for c in range(n):
            if grid[r][c] == '@':
                start_r, start_c = r, c
            elif grid[r][c].islower():
                key_count += 1

    # All keys collected state (all bits set)
    all_keys = (1 << key_count) - 1

    # Queue stores (row, col, keys_state, distance)
    queue = deque([(start_r, start_c, 0, 0)])
    # Visited tracks (row, col, keys_state)
    visited = set([(start_r, start_c, 0)])

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue:
        r, c, keys, dist = queue.popleft()

        # Check if we've collected all keys
        if keys == all_keys:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] != '#':
                cell = grid[nr][nc]
                new_keys = keys

                # Handle key collection
                if 'a' <= cell <= 'z':
                    key_index = ord(cell) - ord('a')
                    new_keys = keys | (1 << key_index)

                # Handle door - need corresponding key
                if 'A' <= cell <= 'Z':
                    door_index = ord(cell) - ord('A')
                    if not (keys & (1 << door_index)):
                        continue  # Don't have key for this door

                state = (nr, nc, new_keys)
                if state not in visited:
                    visited.add(state)
                    queue.append((nr, nc, new_keys, dist + 1))

    return -1
```

```javascript
// Similar implementation for JavaScript would follow the same pattern
// with visited as a Set of stringified states like `${r},${c},${keys}`
```

```java
// Similar implementation for Java would use a class for State
// with proper hashCode() and equals() methods for visited tracking
```

</div>

## How DoorDash Tests BFS vs Other Companies

DoorDash's BFS questions differ from other companies in three key ways:

1. **Practical framing over theoretical** — While Google might ask about BFS on abstract graphs, DoorDash consistently frames problems around delivery logistics. You're not just finding shortest path — you're optimizing delivery routes with real-world constraints like traffic (obstacles), multiple restaurants (multi-source), and time windows (state tracking).

2. **Moderate difficulty with business context** — Facebook and Amazon often include extremely difficult BFS problems in their interviews. DoorDash tends to stay in the medium difficulty range but adds business context that requires you to think about edge cases specific to delivery. For example, what if a driver can only make left turns? What if certain roads have weight limits?

3. **Grids over adjacency lists** — Most DoorDash BFS problems use 2D grids rather than adjacency list representations. This reflects their mapping and routing focus. You need to be extremely comfortable with grid indexing, bound checking, and direction arrays.

## Study Order

1. **Basic BFS on grids** — Start with simple 2D grid traversal without obstacles. Understand how to use a queue, track visited cells, and handle directions. This builds muscle memory for the core pattern.

2. **BFS with obstacles** — Add walls or blocked cells to your grid traversal. Learn to check constraints before adding cells to the queue. This directly maps to DoorDash's delivery obstacles.

3. **Shortest path in unweighted grids** — Recognize that BFS naturally finds shortest paths in unweighted graphs. Practice problems that explicitly ask for minimum steps.

4. **Multi-source BFS** — Learn to initialize your queue with multiple starting points. This pattern appears frequently in DoorDash questions about multiple delivery origins.

5. **BFS with state tracking** — The most advanced pattern. Practice tracking additional information (keys collected, obstacles removed) as part of your visited state.

6. **Bidirectional BFS** — While less common at DoorDash, understanding bidirectional search helps optimize certain shortest path problems and shows deeper algorithmic knowledge.

This order works because each step builds on the previous one. You can't effectively handle state tracking if you're still struggling with basic grid traversal. The progression from simple to complex ensures you internalize each pattern before adding new complexity.

## Recommended Practice Order

1. **Number of Islands (#200)** — Basic grid BFS/DFS to build confidence
2. **Rotting Oranges (#994)** — Multi-source BFS with a practical framing
3. **Walls and Gates (#286)** — Classic DoorDash multi-source BFS problem
4. **Shortest Path in Binary Matrix (#1091)** — Grid BFS with simple obstacles
5. **01 Matrix (#542)** — Another multi-source BFS variation
6. **Shortest Path to Get All Keys (#864)** — Advanced BFS with state tracking (challenging but worth attempting)
7. **Bus Routes (#815)** — Graph BFS that's less common but tests adaptability

Focus on problems 2-5 as they represent the core patterns DoorDash actually tests. Problem 6 is bonus material that demonstrates mastery. When practicing, always verbalize your thought process as you would in an interview, and pay special attention to the business analogy — how each problem relates to DoorDash's actual operations.

[Practice Breadth-First Search at DoorDash](/company/doordash/breadth-first-search)
