---
title: "Breadth-First Search Questions at Databricks: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Databricks — patterns, difficulty breakdown, and study tips."
date: "2030-09-11"
category: "dsa-patterns"
tags: ["databricks", "breadth-first-search", "interview prep"]
---

## Why Breadth-First Search Matters at Databricks

Databricks operates at the intersection of distributed systems and data engineering, where graph-like structures appear everywhere — from dependency graphs in data pipelines to network topologies in cluster management. While their interview distribution shows only 3 explicit BFS questions out of 31 total, this statistic is misleading. BFS appears implicitly in many problems that aren't tagged as such, particularly in shortest-path scenarios and level-order traversals of data structures.

What makes BFS particularly relevant for Databricks is its connection to real distributed systems problems. When you're calculating the minimum steps to propagate a configuration change across nodes, or finding the shortest dependency chain in a data pipeline, you're essentially solving a BFS problem. Interviewers here don't just test whether you can implement BFS — they test whether you recognize when BFS is the optimal approach over DFS or other algorithms.

## Specific Patterns Databricks Favors

Databricks BFS questions tend to cluster around three specific patterns:

1. **Multi-source BFS**: Problems where you start from multiple points simultaneously. This pattern appears in infrastructure scenarios like "minimum time to infect all servers" or "propagation of configuration changes." LeetCode #994 (Rotting Oranges) is the classic example, but Databricks variations often involve weighted edges or additional constraints.

2. **Bidirectional BFS**: When searching for the shortest path between two known points, starting from both ends dramatically reduces the search space. This is particularly relevant for Databricks because their engineers frequently optimize graph traversal in large-scale systems.

3. **BFS with state tracking**: Unlike simple grid traversal, Databricks problems often require tracking additional state — like keys collected, obstacles removed, or permissions acquired. LeetCode #864 (Shortest Path to Get All Keys) exemplifies this pattern, though Databricks versions might involve more business-logic constraints.

Here's the multi-source BFS pattern that appears frequently:

<div class="code-group">

```python
from collections import deque
from typing import List

def multi_source_bfs(grid: List[List[int]]) -> int:
    """Multi-source BFS for minimum time propagation."""
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    minutes = 0

    # Initialize with all sources
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # Source nodes
                queue.append((r, c))
            elif grid[r][c] == 1:  # Nodes to be affected
                fresh_count += 1

    # If no fresh nodes, no time needed
    if fresh_count == 0:
        return 0

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue and fresh_count > 0:
        # Process all nodes at current level (current minute)
        for _ in range(len(queue)):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                if (0 <= nr < rows and 0 <= nc < cols and
                    grid[nr][nc] == 1):  # Only affect fresh nodes
                    grid[nr][nc] = 2
                    queue.append((nr, nc))
                    fresh_count -= 1

        minutes += 1

    return minutes if fresh_count == 0 else -1

# Time: O(rows * cols) | Space: O(rows * cols)
# Each cell visited at most once, queue stores all cells
```

```javascript
function multiSourceBFS(grid) {
  if (!grid.length) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;

  // Initialize with all sources
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
    // Process all nodes at current level
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          queue.push([nr, nc]);
          freshCount--;
        }
      }
    }

    minutes++;
  }

  return freshCount === 0 ? minutes : -1;
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class MultiSourceBFS {
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;
        int minutes = 0;

        // Initialize with all sources
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

            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int r = current[0];
                int c = current[1];

                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                        grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
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

// Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

## How to Prepare

Master BFS for Databricks by focusing on pattern recognition rather than memorization. When you see a problem, ask yourself:

1. Is this about finding the shortest path or minimum steps? (BFS territory)
2. Are there multiple starting points? (Multi-source BFS)
3. Do I know both start and end points? (Consider bidirectional BFS)
4. Do I need to track additional state? (BFS with visited states as tuples)

Practice implementing BFS without looking at solutions until you can write it flawlessly in 2 minutes. The queue operations, level tracking, and visited set management should be muscle memory.

For state-tracking BFS problems, here's the pattern you need internalized:

<div class="code-group">

```python
from collections import deque
from typing import List

def bfs_with_state(grid: List[List[str]]) -> int:
    """BFS with state tracking (keys, obstacles, etc.)"""
    if not grid:
        return -1

    rows, cols = len(grid), len(grid[0])

    # Find start position and count target items
    start_r = start_c = 0
    key_count = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '@':
                start_r, start_c = r, c
            elif 'a' <= grid[r][c] <= 'f':
                key_count += 1

    # State: (row, col, keys_bitmask)
    start_state = (start_r, start_c, 0)
    queue = deque([start_state])
    visited = set([start_state])
    steps = 0

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue:
        # Process level by level for shortest path
        for _ in range(len(queue)):
            r, c, keys = queue.popleft()

            # Check if we have all keys
            if bin(keys).count('1') == key_count:
                return steps

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                if 0 <= nr < rows and 0 <= nc < cols:
                    cell = grid[nr][nc]

                    # Skip walls
                    if cell == '#':
                        continue

                    new_keys = keys

                    # Handle key collection
                    if 'a' <= cell <= 'f':
                        key_bit = 1 << (ord(cell) - ord('a'))
                        new_keys = keys | key_bit

                    # Handle door checking
                    if 'A' <= cell <= 'F':
                        door_bit = 1 << (ord(cell) - ord('A'))
                        if not (keys & door_bit):
                            continue  # Don't have key for this door

                    new_state = (nr, nc, new_keys)

                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)

        steps += 1

    return -1

# Time: O(rows * cols * 2^keys) | Space: O(rows * cols * 2^keys)
# Exponential in keys but practical for small key counts
```

```javascript
function bfsWithState(grid) {
  if (!grid.length) return -1;

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

  // State: [row, col, keysBitmask]
  const startState = [startR, startC, 0];
  const queue = [startState];
  const visited = new Set();
  visited.add(`${startR},${startC},0`);
  let steps = 0;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c, keys] = queue.shift();

      // Check if we have all keys
      if (countBits(keys) === keyCount) {
        return steps;
      }

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const cell = grid[nr][nc];

          // Skip walls
          if (cell === "#") continue;

          let newKeys = keys;

          // Handle key collection
          if (cell >= "a" && cell <= "f") {
            const keyBit = 1 << (cell.charCodeAt(0) - "a".charCodeAt(0));
            newKeys = keys | keyBit;
          }

          // Handle door checking
          if (cell >= "A" && cell <= "F") {
            const doorBit = 1 << (cell.charCodeAt(0) - "A".charCodeAt(0));
            if (!(keys & doorBit)) continue;
          }

          const stateKey = `${nr},${nc},${newKeys}`;

          if (!visited.has(stateKey)) {
            visited.add(stateKey);
            queue.push([nr, nc, newKeys]);
          }
        }
      }
    }

    steps++;
  }

  return -1;
}

function countBits(n) {
  let count = 0;
  while (n) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

// Time: O(rows * cols * 2^keys) | Space: O(rows * cols * 2^keys)
```

```java
import java.util.*;

public class BFSWithState {
    public int shortestPathAllKeys(String[] grid) {
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

        // State: row, col, keys bitmask
        int[] startState = new int[]{startR, startC, 0};
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(startState);
        Set<String> visited = new HashSet<>();
        visited.add(startR + "," + startC + "," + 0);
        int steps = 0;

        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int r = current[0];
                int c = current[1];
                int keys = current[2];

                // Check if we have all keys
                if (Integer.bitCount(keys) == keyCount) {
                    return steps;
                }

                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        char cell = grid[nr].charAt(nc);

                        // Skip walls
                        if (cell == '#') continue;

                        int newKeys = keys;

                        // Handle key collection
                        if (cell >= 'a' && cell <= 'f') {
                            int keyBit = 1 << (cell - 'a');
                            newKeys = keys | keyBit;
                        }

                        // Handle door checking
                        if (cell >= 'A' && cell <= 'F') {
                            int doorBit = 1 << (cell - 'A');
                            if ((keys & doorBit) == 0) continue;
                        }

                        String stateKey = nr + "," + nc + "," + newKeys;

                        if (!visited.contains(stateKey)) {
                            visited.add(stateKey);
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

// Time: O(rows * cols * 2^keys) | Space: O(rows * cols * 2^keys)
```

</div>

## How Databricks Tests BFS vs Other Companies

At FAANG companies, BFS problems often test pure algorithmic knowledge with clean graph structures. At Databricks, BFS questions frequently incorporate real distributed systems concepts:

- **Infrastructure propagation**: Instead of "rotting oranges," you might see "minimum time to deploy software to all nodes in a cluster with network latency constraints"
- **Dependency resolution**: Finding shortest paths in DAGs representing data pipeline dependencies
- **Resource contention**: BFS with state tracking for lock acquisition or permission propagation

The difficulty isn't necessarily higher than FAANG, but the problems feel more "applied." You're less likely to get a pure matrix traversal problem and more likely to get a problem disguised as a systems issue.

What's unique is that Databricks interviewers often ask follow-up questions about scaling: "What if the graph doesn't fit in memory?" or "How would you parallelize this BFS?" Be prepared to discuss distributed BFS approximations.

## Study Order

1. **Basic BFS on grids and trees** — Master the queue mechanics and visited set patterns before adding complexity. Practice LeetCode #200 (Number of Islands) until you can implement it perfectly.

2. **Level-order traversal** — Understand how to track levels for problems that ask for "minimum steps" or "shortest path." LeetCode #102 (Binary Tree Level Order Traversal) is your foundation.

3. **Multi-source BFS** — Learn to initialize the queue with multiple starting points. LeetCode #994 (Rotting Oranges) is the canonical problem.

4. **BFS with weighted edges** — Understand when BFS works (unweighted graphs) and when you need Dijkstra's (weighted). Practice LeetCode #505 (The Maze II) to see the transition.

5. **BFS with state tracking** — Add bitmask or tuple states to track keys, permissions, or obstacles. LeetCode #864 (Shortest Path to Get All Keys) is challenging but essential.

6. **Bidirectional BFS** — Optimize for known start and end points. Practice on LeetCode #127 (Word Ladder).

7. **Applied systems problems** — Look for problems that model real distributed systems scenarios, even if not tagged as BFS.

## Recommended Practice Order

1. LeetCode #200 (Number of Islands) — Basic BFS/DFS recognition
2. LeetCode #102 (Binary Tree Level Order Traversal) — Level tracking
3. LeetCode #994 (Rotting Oranges) — Multi-source BFS
4. LeetCode #127 (Word Ladder) — Bidirectional BFS
5. LeetCode #505 (The Maze II) — BFS vs Dijkstra's distinction
6. LeetCode #864 (Shortest Path to Get All Keys) — State tracking with bitmask
7. LeetCode #1293 (Shortest Path in a Grid with Obstacles Elimination) — BFS with obstacle tracking
8. LeetCode #815 (Bus Routes) — Applied BFS on complex graph representation

After these eight problems, you'll have covered every BFS pattern Databricks tests. The key is to understand why BFS works for each problem — not just how to implement it.

[Practice Breadth-First Search at Databricks](/company/databricks/breadth-first-search)
