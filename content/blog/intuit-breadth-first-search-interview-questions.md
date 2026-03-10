---
title: "Breadth-First Search Questions at Intuit: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Intuit — patterns, difficulty breakdown, and study tips."
date: "2028-11-02"
category: "dsa-patterns"
tags: ["intuit", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Intuit: What to Expect

Intuit's interview process has a distinct flavor when it comes to Breadth-First Search (BFS). With 10 BFS questions out of their 71 total tagged problems on LeetCode (roughly 14%), this isn't just a random topic—it's a deliberate focus area. But here's what most candidates miss: Intuit doesn't test BFS for the sake of algorithmic trivia. They test it because it models real-world problems in financial and business software. Think about transaction networks, user permission hierarchies, or dependency graphs in tax software—these are fundamentally graph traversal problems where finding the shortest path or exploring level-by-level matters.

In actual interviews, you're likely to encounter at least one BFS problem, often in the second technical round. The twist? It's rarely presented as "implement BFS." Instead, you'll get a business domain problem that requires you to recognize the underlying graph structure and apply the appropriate traversal.

## Specific Patterns Intuit Favors

Intuit's BFS problems cluster around three specific patterns that mirror their product domains:

1. **Shortest Path in Unweighted Grids/Matrices** - This appears in problems about navigating through obstacles (like transaction validation paths or form completion flows). They love variations with multiple valid paths or conditional movement.
2. **Level-Order Traversal with State Tracking** - Unlike simple binary tree BFS, Intuit often adds an extra dimension: you might need to track visited cells with keys collected, or maintain parallel queues for different entity types. This tests whether you understand that BFS can handle multi-dimensional state spaces.

3. **Multi-Source BFS** - Instead of starting from one point, you start from multiple sources simultaneously. This pattern is perfect for modeling scenarios like "find the nearest service center for all customers" or "propagate updates across a distributed system."

Look at their actual problem distribution: "Walls and Gates" (#286), "Shortest Path in Binary Matrix" (#1091), and "Rotting Oranges" (#994) are classic examples. Notice these aren't abstract graph theory puzzles—they're concrete, grid-based problems with clear business analogs.

## How to Prepare

The biggest mistake candidates make is memorizing BFS template code without understanding state management. Let's look at the core pattern with state tracking—the version Intuit actually tests:

<div class="code-group">

```python
from collections import deque
from typing import List

def shortestPathWithKeys(grid: List[List[str]]) -> int:
    """
    Example problem type: Find shortest path collecting all keys.
    Grid contains: '.'=empty, '#'=wall, 'a-f'=keys, 'A-F'=doors
    """
    m, n = len(grid), len(grid[0])

    # Find starting point and count keys
    start = None
    total_keys = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '@':
                start = (i, j)
            elif grid[i][j].islower():
                total_keys += 1

    # State: (row, col, keys_bitmask)
    # Each key is represented by a bit (1 << (ord(key) - ord('a')))
    target_keys = (1 << total_keys) - 1  # All bits set

    queue = deque()
    visited = set()

    # Start with no keys collected
    queue.append((start[0], start[1], 0))
    visited.add((start[0], start[1], 0))

    steps = 0
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while queue:
        for _ in range(len(queue)):
            r, c, keys = queue.popleft()

            # Check if we collected all keys
            if keys == target_keys:
                return steps

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                # Check bounds
                if nr < 0 or nr >= m or nc < 0 or nc >= n:
                    continue

                cell = grid[nr][nc]

                # Skip walls
                if cell == '#':
                    continue

                new_keys = keys

                # Handle doors (can only pass if we have corresponding key)
                if cell.isupper():
                    key_needed = 1 << (ord(cell.lower()) - ord('a'))
                    if not (keys & key_needed):
                        continue

                # Handle keys (update our key collection)
                elif cell.islower():
                    key_bit = 1 << (ord(cell) - ord('a'))
                    new_keys = keys | key_bit

                new_state = (nr, nc, new_keys)
                if new_state not in visited:
                    visited.add(new_state)
                    queue.append(new_state)

        steps += 1

    return -1  # Not all keys reachable

# Time: O(m * n * 2^k) where k is number of keys
# Space: O(m * n * 2^k) for visited states
```

```javascript
function shortestPathWithKeys(grid) {
  const m = grid.length;
  const n = grid[0].length;

  // Find start and count keys
  let start = null;
  let totalKeys = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "@") {
        start = [i, j];
      } else if (/[a-f]/.test(grid[i][j])) {
        totalKeys++;
      }
    }
  }

  const targetKeys = (1 << totalKeys) - 1;
  const queue = [];
  const visited = new Set();

  // Start state: [row, col, keys]
  queue.push([start[0], start[1], 0]);
  visited.add(`${start[0]},${start[1]},0`);

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
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

        if (nr < 0 || nr >= m || nc < 0 || nc >= n) {
          continue;
        }

        const cell = grid[nr][nc];

        if (cell === "#") {
          continue;
        }

        let newKeys = keys;

        // Handle doors
        if (/[A-F]/.test(cell)) {
          const keyNeeded = 1 << (cell.charCodeAt(0) - "A".charCodeAt(0));
          if ((keys & keyNeeded) === 0) {
            continue;
          }
        }
        // Handle keys
        else if (/[a-f]/.test(cell)) {
          const keyBit = 1 << (cell.charCodeAt(0) - "a".charCodeAt(0));
          newKeys = keys | keyBit;
        }

        const stateKey = `${nr},${nc},${newKeys}`;
        if (!visited.has(stateKey)) {
          visited.add(stateKey);
          queue.push([nr, nc, newKeys]);
        }
      }
    }

    steps++;
  }

  return -1;
}

// Time: O(m * n * 2^k) where k is number of keys
// Space: O(m * n * 2^k) for visited states
```

```java
import java.util.*;

public class ShortestPathWithKeys {
    public int shortestPath(char[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // Find start and count keys
        int[] start = null;
        int totalKeys = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '@') {
                    start = new int[]{i, j};
                } else if (grid[i][j] >= 'a' && grid[i][j] <= 'f') {
                    totalKeys++;
                }
            }
        }

        int targetKeys = (1 << totalKeys) - 1;
        Queue<int[]> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();

        // State: row, col, keys
        queue.offer(new int[]{start[0], start[1], 0});
        visited.add(start[0] + "," + start[1] + ",0");

        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
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

                    if (nr < 0 || nr >= m || nc < 0 || nc >= n) {
                        continue;
                    }

                    char cell = grid[nr][nc];

                    if (cell == '#') {
                        continue;
                    }

                    int newKeys = keys;

                    // Handle doors
                    if (cell >= 'A' && cell <= 'F') {
                        int keyNeeded = 1 << (cell - 'A');
                        if ((keys & keyNeeded) == 0) {
                            continue;
                        }
                    }
                    // Handle keys
                    else if (cell >= 'a' && cell <= 'f') {
                        int keyBit = 1 << (cell - 'a');
                        newKeys = keys | keyBit;
                    }

                    String stateKey = nr + "," + nc + "," + newKeys;
                    if (!visited.contains(stateKey)) {
                        visited.add(stateKey);
                        queue.offer(new int[]{nr, nc, newKeys});
                    }
                }
            }

            steps++;
        }

        return -1;
    }
}

// Time: O(m * n * 2^k) where k is number of keys
// Space: O(m * n * 2^k) for visited states
```

</div>

Notice the pattern: we're not just tracking position, but also the keys collected (as a bitmask). This is the level of complexity Intuit expects—you need to understand that BFS can traverse a state space, not just a physical space.

## How Intuit Tests Breadth-First Search vs Other Companies

Compared to FAANG companies, Intuit's BFS problems have a different emphasis:

- **Google** might give you a BFS problem with clever optimizations or requiring A\* search. They test algorithmic creativity.
- **Amazon** often uses BFS for tree serialization or level-order problems related to their hierarchical data.
- **Intuit** focuses on **practical applications with constraints**. Their problems frequently involve:
  1. Business logic constraints (like keys and doors representing permissions)
  2. Multiple valid solutions where you need the shortest
  3. Clear, testable edge cases (empty grids, unreachable targets, circular paths)

What's unique is that Intuit interviewers will often ask follow-up questions like: "How would this scale with 1 million nodes?" or "What if keys could expire after X steps?" They're testing whether you can extend the algorithm to handle real-world business scenarios.

## Study Order

Don't jump straight into complex BFS problems. Build up systematically:

1. **Basic BFS on Trees** - Understand the queue pattern and level-order traversal. Practice on binary trees first.
2. **BFS on Grids/Matrices** - Learn to handle boundaries, obstacles, and visited tracking. This is where most Intuit problems live.
3. **Shortest Path in Unweighted Graphs** - Recognize that BFS naturally finds shortest paths when edges are unweighted.
4. **Multi-Source BFS** - Practice starting from multiple points simultaneously (like "Rotting Oranges" #994).
5. **BFS with State Tracking** - The advanced pattern shown above. Learn to use bitmasks or tuples to represent additional state.
6. **Bidirectional BFS** - For optimization on large search spaces (less common at Intuit but good to know).

This order works because each step builds on the previous one. You can't handle state tracking if you're still shaky on basic queue management.

## Recommended Practice Order

Solve these problems in sequence to build up to Intuit-level BFS:

1. **Binary Tree Level Order Traversal** (#102) - Master basic BFS on trees
2. **Number of Islands** (#200) - Simple grid BFS with visited tracking
3. **Rotting Oranges** (#994) - Multi-source BFS, perfect Intuit-style problem
4. **Walls and Gates** (#286) - Another multi-source BFS, common at Intuit
5. **Shortest Path in Binary Matrix** (#1091) - Grid BFS finding shortest path
6. **Shortest Path to Get All Keys** (#864) - Advanced state tracking with bitmasks
7. **Sliding Puzzle** (#773) - BFS on state space (not grid), excellent challenge

After solving #864, you'll have seen the full progression from basic BFS to the complex state-tracking problems Intuit favors. The key insight: at Intuit, BFS isn't just an algorithm—it's a tool for modeling business process flows, permission systems, and network effects in their financial products.

[Practice Breadth-First Search at Intuit](/company/intuit/breadth-first-search)
