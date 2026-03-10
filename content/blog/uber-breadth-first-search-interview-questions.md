---
title: "Breadth-First Search Questions at Uber: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-06-07"
category: "dsa-patterns"
tags: ["uber", "breadth-first-search", "interview prep"]
---

## Why Breadth-First Search Matters at Uber

Uber's engineering problems are fundamentally about networks — whether it's matching riders to drivers, calculating optimal routes, or modeling surge pricing across a city. This makes Breadth-First Search (BFS) not just another algorithm in their interview toolkit, but a core competency they actively test. With 59 BFS questions in their question bank (15% of their total problems), you're statistically likely to encounter at least one BFS problem in any Uber interview loop.

But here's what most candidates miss: Uber doesn't just test BFS for graph traversal. They test it as a fundamental pattern for solving shortest path problems in weighted grids, level-order processing in hierarchical data, and modeling state transitions in complex systems. When you're asked about "minimum time to deliver a package" or "shortest route avoiding construction," you're not just implementing BFS — you're applying the BFS mindset to real Uber business problems.

## Specific Patterns Uber Favors

Uber's BFS problems tend to cluster around three distinct patterns:

1. **Multi-source BFS on Grids**: Problems where multiple starting points simultaneously explore a grid. This models scenarios like multiple drivers spreading out from different locations or service availability propagating through a city.

2. **Bidirectional BFS for Meeting Problems**: When finding connections between two entities (rider-driver matching, social connections), Uber often uses bidirectional BFS to dramatically reduce search space.

3. **BFS with State Tracking**: Unlike vanilla BFS, Uber problems frequently require tracking additional state — like keys collected, obstacles removed, or time elapsed — making the visited tracking multidimensional.

Consider LeetCode 994 "Rotting Oranges" — a classic multi-source BFS that models contamination spread. Or LeetCode 127 "Word Ladder" — a bidirectional BFS problem about transforming words, analogous to finding connections in Uber's network. These aren't abstract algorithms; they're simplified versions of actual routing and matching problems.

## How to Prepare

The key to Uber's BFS problems is recognizing when to use the queue for more than just coordinates. Let's examine the multi-source BFS pattern, which appears frequently:

<div class="code-group">

```python
from collections import deque
from typing import List

def orangesRotting(grid: List[List[int]]) -> int:
    """LeetCode 994: Multi-source BFS pattern"""
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    minutes = 0

    # Multi-source initialization: all rotten oranges start simultaneously
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    # If no fresh oranges, no time needed
    if fresh_count == 0:
        return 0

    # Standard BFS with level tracking
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue and fresh_count > 0:
        # Process all oranges at current minute level
        for _ in range(len(queue)):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2  # Mark as rotten
                    fresh_count -= 1
                    queue.append((nr, nc))

        minutes += 1

    return minutes if fresh_count == 0 else -1

# Time: O(m*n) where m=rows, n=cols | Space: O(m*n) for queue in worst case
```

```javascript
/**
 * LeetCode 994: Multi-source BFS pattern
 * Time: O(m*n) | Space: O(m*n)
 */
function orangesRotting(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;

  // Multi-source initialization
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        freshCount++;
      }
    }
  }

  if (freshCount === 0) return 0;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0 && freshCount > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          freshCount--;
          queue.push([nr, nc]);
        }
      }
    }

    minutes++;
  }

  return freshCount === 0 ? minutes : -1;
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

class Solution {
    // LeetCode 994: Multi-source BFS pattern
    // Time: O(m*n) | Space: O(m*n)
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;
        int minutes = 0;

        // Multi-source initialization
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 2) {
                    queue.offer(new int[]{r, c});
                } else if (grid[r][c] == 1) {
                    freshCount++;
                }
            }
        }

        if (freshCount == 0) return 0;

        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty() && freshCount > 0) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int r = current[0];
                int c = current[1];

                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        freshCount--;
                        queue.offer(new int[]{nr, nc});
                    }
                }
            }

            minutes++;
        }

        return freshCount == 0 ? minutes : -1;
    }
}
```

</div>

Another critical pattern is BFS with state tracking. Here's a template for problems like LeetCode 864 "Shortest Path to Get All Keys":

<div class="code-group">

```python
from collections import deque
from typing import List

def shortestPathAllKeys(grid: List[str]) -> int:
    """BFS with state tracking pattern"""
    if not grid:
        return -1

    rows, cols = len(grid), len(grid[0])

    # Find starting point and count keys
    start_r = start_c = 0
    key_count = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '@':
                start_r, start_c = r, c
            elif grid[r][c].islower():
                key_count += 1

    # State: (row, col, keys_bitmask)
    # Each key is represented by a bit in the bitmask
    target_keys = (1 << key_count) - 1
    visited = set()
    queue = deque()

    # Start with no keys collected
    start_state = (start_r, start_c, 0)
    queue.append(start_state)
    visited.add(start_state)

    steps = 0
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue:
        for _ in range(len(queue)):
            r, c, keys = queue.popleft()

            # Check if we've collected all keys
            if keys == target_keys:
                return steps

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != '#':
                    cell = grid[nr][nc]
                    new_keys = keys

                    # If it's a key, add it to our collection
                    if 'a' <= cell <= 'f':
                        key_index = ord(cell) - ord('a')
                        new_keys = keys | (1 << key_index)

                    # If it's a lock, check if we have the key
                    elif 'A' <= cell <= 'F':
                        lock_index = ord(cell) - ord('A')
                        if not (keys & (1 << lock_index)):
                            continue  # Don't have the key, can't pass

                    new_state = (nr, nc, new_keys)

                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)

        steps += 1

    return -1

# Time: O(m*n*2^k) where k=number of keys | Space: O(m*n*2^k)
```

```javascript
/**
 * BFS with state tracking pattern
 * Time: O(m*n*2^k) | Space: O(m*n*2^k)
 */
function shortestPathAllKeys(grid) {
  if (!grid || grid.length === 0) return -1;

  const rows = grid.length;
  const cols = grid[0].length;
  let startR = 0,
    startC = 0;
  let keyCount = 0;

  // Find start and count keys
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "@") {
        startR = r;
        startC = c;
      } else if (grid[r][c] >= "a" && grid[r][c] <= "f") {
        keyCount++;
      }
    }
  }

  const targetKeys = (1 << keyCount) - 1;
  const visited = new Set();
  const queue = [];
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // Start state: row, col, keys bitmask
  const startState = `${startR},${startC},0`;
  queue.push([startR, startC, 0]);
  visited.add(startState);

  let steps = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c, keys] = queue.shift();

      if (keys === targetKeys) {
        return steps;
      }

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== "#") {
          const cell = grid[nr][nc];
          let newKeys = keys;

          if (cell >= "a" && cell <= "f") {
            const keyIndex = cell.charCodeAt(0) - "a".charCodeAt(0);
            newKeys = keys | (1 << keyIndex);
          } else if (cell >= "A" && cell <= "F") {
            const lockIndex = cell.charCodeAt(0) - "A".charCodeAt(0);
            if (!(keys & (1 << lockIndex))) {
              continue;
            }
          }

          const newState = `${nr},${nc},${newKeys}`;

          if (!visited.has(newState)) {
            visited.add(newState);
            queue.push([nr, nc, newKeys]);
          }
        }
      }
    }

    steps++;
  }

  return -1;
}
```

```java
import java.util.*;

class Solution {
    // BFS with state tracking pattern
    // Time: O(m*n*2^k) | Space: O(m*n*2^k)
    public int shortestPathAllKeys(String[] grid) {
        if (grid == null || grid.length == 0) return -1;

        int rows = grid.length;
        int cols = grid[0].length();
        int startR = 0, startC = 0;
        int keyCount = 0;

        // Find start and count keys
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                char cell = grid[r].charAt(c);
                if (cell == '@') {
                    startR = r;
                    startC = c;
                } else if (cell >= 'a' && cell <= 'f') {
                    keyCount++;
                }
            }
        }

        int targetKeys = (1 << keyCount) - 1;
        Set<String> visited = new HashSet<>();
        Queue<int[]> queue = new LinkedList<>();
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        // Start state: row, col, keys bitmask
        queue.offer(new int[]{startR, startC, 0});
        visited.add(startR + "," + startC + ",0");

        int steps = 0;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int r = current[0];
                int c = current[1];
                int keys = current[2];

                if (keys == targetKeys) {
                    return steps;
                }

                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr].charAt(nc) != '#') {
                        char cell = grid[nr].charAt(nc);
                        int newKeys = keys;

                        if (cell >= 'a' && cell <= 'f') {
                            int keyIndex = cell - 'a';
                            newKeys = keys | (1 << keyIndex);
                        } else if (cell >= 'A' && cell <= 'F') {
                            int lockIndex = cell - 'A';
                            if ((keys & (1 << lockIndex)) == 0) {
                                continue;
                            }
                        }

                        String newState = nr + "," + nc + "," + newKeys;

                        if (!visited.contains(newState)) {
                            visited.add(newState);
                            queue.offer(new int[]{nr, nc, newKeys});
                        }
                    }
                }
            }

            steps++;
        }

        return -1;
    }
}
```

</div>

## How Uber Tests BFS vs Other Companies

Uber's BFS questions differ from other companies in three key ways:

1. **Business Context Integration**: While Google might ask abstract BFS on a chessboard, Uber frames problems as "minimum time for all drivers to reach riders" or "shortest route avoiding traffic." The algorithm is the same, but the context matters for understanding edge cases.

2. **Weighted vs Unweighted**: Unlike Facebook that often sticks to unweighted graphs, Uber frequently introduces weighted edges (modeling traffic, distance, or time) requiring Dijkstra's algorithm — which is essentially BFS with a priority queue.

3. **State Complexity**: Amazon might test basic BFS on a binary tree, but Uber adds layers of state (keys, time windows, vehicle capacity) that transform simple traversal into complex state-space search.

The difficulty curve is steeper than at companies like Microsoft but more applied than at pure research companies. Uber expects you to not only implement BFS correctly but also to discuss how you'd scale it for their actual systems.

## Study Order

1. **Basic BFS on Trees and Grids** — Master the queue mechanics and level-order traversal before adding complexity.
2. **Shortest Path in Unweighted Graphs** — Understand why BFS gives shortest path in unweighted graphs.
3. **Multi-source BFS** — Learn to initialize queues with multiple starting points.
4. **BFS with Visited State Tracking** — Add dimensions to your visited tracking (keys, obstacles, etc.).
5. **Bidirectional BFS** — Optimize meeting problems by searching from both ends.
6. **BFS with Priority Queue (Dijkstra)** — Transition to weighted graphs, which is essentially BFS with cost optimization.

This order works because each step builds on the previous one. You can't optimize with bidirectional BFS if you don't understand basic BFS queue mechanics. You can't handle state tracking if you're still struggling with visited sets.

## Recommended Practice Order

1. **Binary Tree Level Order Traversal (LeetCode 102)** — Basic BFS on trees
2. **Rotting Oranges (LeetCode 994)** — Multi-source BFS on grids
3. **Word Ladder (LeetCode 127)** — Bidirectional BFS with string transformations
4. **Shortest Path in Binary Matrix (LeetCode 1091)** — Basic grid BFS with obstacles
5. **Shortest Path to Get All Keys (LeetCode 864)** — BFS with state tracking (keys)
6. **Sliding Puzzle (LeetCode 773)** — BFS on state space (board configurations)
7. **Network Delay Time (LeetCode 743)** — BFS with priority queue (Dijkstra)

This sequence takes you from foundational concepts to Uber's favorite patterns, ensuring you're prepared for their most common variations.

[Practice Breadth-First Search at Uber](/company/uber/breadth-first-search)
