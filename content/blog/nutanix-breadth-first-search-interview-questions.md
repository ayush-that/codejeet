---
title: "Breadth-First Search Questions at Nutanix: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Nutanix — patterns, difficulty breakdown, and study tips."
date: "2028-12-14"
category: "dsa-patterns"
tags: ["nutanix", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Nutanix: What to Expect

Nutanix's interview process includes 12 Breadth-First Search (BFS) questions out of their 68 total coding problems. That's 17.6% of their question bank dedicated to BFS—a significant concentration that tells you something important: Nutanix interviewers love testing graph traversal fundamentals. This isn't surprising for a company building distributed systems and hyperconverged infrastructure where understanding data flow, network topologies, and shortest-path problems is daily work.

In real interviews, you're likely to encounter at least one BFS problem if you're interviewing for software engineering roles. The questions tend to be medium difficulty with occasional hard variations, focusing on practical applications rather than purely academic graph theory. What makes Nutanix's BFS questions interesting is how they often blend graph traversal with other concepts—you might need BFS plus some state tracking, or BFS with multiple constraints, reflecting the multi-dimensional thinking required in distributed systems engineering.

## Specific Patterns Nutanix Favors

Nutanix's BFS problems cluster around three main patterns:

1. **Shortest Path in Unweighted Graphs** - This is their bread and butter. Think "minimum steps" or "minimum transformations" problems where each edge has equal weight. They particularly like problems where you need to find the shortest path between two states, not just between nodes in an explicit graph.

2. **Level-Order Traversal with Twists** - Standard BFS level traversal but with additional constraints or output requirements. These test whether you truly understand BFS's level-by-level nature versus just using it as a generic traversal tool.

3. **Multi-Source BFS** - Problems where you start BFS from multiple nodes simultaneously. This pattern appears in distributed systems scenarios where you're calculating distances from multiple servers or finding the nearest resource.

A classic example is **Word Ladder (LeetCode #127)**, which appears in their question bank. This isn't just about finding if a path exists—it's about finding the shortest transformation sequence, which is pure BFS territory. Another favorite is **Rotting Oranges (LeetCode #994)**, which uses multi-source BFS to simulate simultaneous propagation.

Here's the multi-source BFS pattern that appears in several Nutanix questions:

<div class="code-group">

```python
from collections import deque
from typing import List

def multi_source_bfs(grid: List[List[int]]) -> int:
    """
    Multi-source BFS template (like Rotting Oranges #994)
    Time: O(m*n) | Space: O(m*n) for the queue in worst case
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0

    # Initialize queue with all sources
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # Source nodes
                queue.append((r, c))
            elif grid[r][c] == 1:  # Nodes to be processed
                fresh_count += 1

    if fresh_count == 0:
        return 0

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    minutes = 0

    while queue and fresh_count > 0:
        # Process all nodes at current level
        level_size = len(queue)
        for _ in range(level_size):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2  # Mark as visited/processed
                    queue.append((nr, nc))
                    fresh_count -= 1

        minutes += 1

    return -1 if fresh_count > 0 else minutes
```

```javascript
/**
 * Multi-source BFS template
 * Time: O(m*n) | Space: O(m*n) for the queue in worst case
 */
function multiSourceBFS(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // Initialize queue with all sources
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
  let minutes = 0;

  while (queue.length > 0 && freshCount > 0) {
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

  return freshCount > 0 ? -1 : minutes;
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class MultiSourceBFS {
    /**
     * Multi-source BFS template
     * Time: O(m*n) | Space: O(m*n) for the queue in worst case
     */
    public int orangesRotting(int[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;

        // Initialize queue with all sources
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
        int minutes = 0;

        while (!queue.isEmpty() && freshCount > 0) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] cell = queue.poll();
                int r = cell[0], c = cell[1];

                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        queue.offer(new int[]{nr, nc});
                        freshCount--;
                    }
                }
            }

            minutes++;
        }

        return freshCount > 0 ? -1 : minutes;
    }
}
```

</div>

## How to Prepare

Master the BFS template first—the queue initialization, visited tracking, and level-by-level processing. Then practice these variations:

1. **State Tracking BFS** - When you need to track additional state beyond position (like keys collected, remaining steps, or special conditions). Use a tuple or custom object in your queue.

2. **Bidirectional BFS** - For problems where you know both start and end points. This can significantly reduce the search space for certain problems.

3. **0-1 BFS** - For graphs where edges have weights of 0 or 1 only (uses deque instead of regular queue).

Here's the state tracking pattern that appears in several Nutanix problems:

<div class="code-group">

```python
from collections import deque
from typing import List

def bfs_with_state(grid: List[List[str]]) -> int:
    """
    BFS with state tracking (like Shortest Path to Get All Keys #864)
    Time: O(m*n*2^k) where k is number of keys | Space: O(m*n*2^k)
    """
    rows, cols = len(grid), len(grid[0])

    # Find start position and count keys
    start_r = start_c = -1
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
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    steps = 0

    while queue:
        level_size = len(queue)
        for _ in range(level_size):
            r, c, keys = queue.popleft()

            # Check if we have all keys
            if bin(keys).count('1') == key_count:
                return steps

            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                new_keys = keys

                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != '#':
                    cell = grid[nr][nc]

                    # Handle keys
                    if 'a' <= cell <= 'f':
                        new_keys = keys | (1 << (ord(cell) - ord('a')))

                    # Handle locks - need corresponding key
                    if 'A' <= cell <= 'F':
                        needed_key = 1 << (ord(cell) - ord('A'))
                        if not (keys & needed_key):
                            continue

                    new_state = (nr, nc, new_keys)
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)

        steps += 1

    return -1
```

```javascript
/**
 * BFS with state tracking
 * Time: O(m*n*2^k) where k is number of keys | Space: O(m*n*2^k)
 */
function bfsWithState(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Find start position and count keys
  let startR = -1,
    startC = -1;
  let keyCount = 0;

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

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let steps = 0;

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
        let newKeys = keys;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== "#") {
          const cell = grid[nr][nc];

          // Handle keys
          if (cell >= "a" && cell <= "f") {
            const keyBit = 1 << (cell.charCodeAt(0) - "a".charCodeAt(0));
            newKeys = keys | keyBit;
          }

          // Handle locks - need corresponding key
          if (cell >= "A" && cell <= "F") {
            const neededKey = 1 << (cell.charCodeAt(0) - "A".charCodeAt(0));
            if (!(keys & neededKey)) {
              continue;
            }
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
```

```java
import java.util.*;

public class BFSWithState {
    /**
     * BFS with state tracking
     * Time: O(m*n*2^k) where k is number of keys | Space: O(m*n*2^k)
     */
    public int shortestPathAllKeys(String[] grid) {
        int rows = grid.length;
        int cols = grid[0].length();

        // Find start position and count keys
        int startR = -1, startC = -1;
        int keyCount = 0;

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

        // State: row, col, keysBitmask
        int[] startState = new int[]{startR, startC, 0};
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(startState);

        Set<String> visited = new HashSet<>();
        visited.add(startR + "," + startC + "," + 0);

        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        int steps = 0;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int r = current[0], c = current[1], keys = current[2];

                // Check if we have all keys
                if (Integer.bitCount(keys) == keyCount) {
                    return steps;
                }

                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];
                    int newKeys = keys;

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        char cell = grid[nr].charAt(nc);

                        if (cell == '#') continue;

                        // Handle keys
                        if (cell >= 'a' && cell <= 'f') {
                            int keyBit = 1 << (cell - 'a');
                            newKeys = keys | keyBit;
                        }

                        // Handle locks - need corresponding key
                        if (cell >= 'A' && cell <= 'F') {
                            int neededKey = 1 << (cell - 'A');
                            if ((keys & neededKey) == 0) {
                                continue;
                            }
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
```

</div>

## How Nutanix Tests Breadth-First Search vs Other Companies

Nutanix's BFS questions differ from other companies in several key ways:

**Compared to FAANG:** FAANG companies often test BFS as part of larger system design questions or combine it with more advanced data structures. Nutanix tends to keep BFS problems more focused on the algorithm itself, but with practical constraints that mirror distributed systems challenges. While Google might ask you to design a BFS-based web crawler system, Nutanix is more likely to ask about finding shortest paths in a network topology.

**Compared to finance companies:** Quantitative finance interviews often focus on pure algorithmic efficiency. Nutanix cares about correctness and clarity first, then efficiency. They want to see you handle edge cases and understand when BFS is appropriate versus DFS or other algorithms.

**Unique Nutanix characteristics:** Their BFS problems often involve:

- Multiple constraints or states (like keys and doors)
- Implicit graphs (you need to figure out the graph structure)
- Practical scenarios (network propagation, resource location)

The difficulty is typically medium, but they expect clean, production-quality code with good variable names and comments explaining your thought process.

## Study Order

1. **Basic BFS Traversal** - Start with simple grid/level-order traversal to internalize the queue pattern. Understand why BFS gives shortest path in unweighted graphs.

2. **Shortest Path Problems** - Move to explicit shortest path problems in grids and simple graphs. This is where you'll use the standard BFS template most often.

3. **Multi-Source BFS** - Learn to initialize queues with multiple starting points. Understand how this affects your visited tracking and level counting.

4. **State Tracking BFS** - Practice problems where you need to carry additional information in your queue (like collected items, remaining moves, or special conditions).

5. **Bidirectional BFS** - For problems where start and end are known, this optimization can be crucial. Understand when it helps and when it doesn't.

6. **0-1 BFS** - Special case for graphs with only 0 and 1 weight edges. Uses deque instead of queue.

This order works because each concept builds on the previous one. You can't understand state tracking if you're shaky on basic BFS, and bidirectional BFS assumes you're comfortable with standard BFS.

## Recommended Practice Order

1. **Binary Tree Level Order Traversal (LeetCode #102)** - Basic BFS pattern
2. **Number of Islands (LeetCode #200)** - BFS on grid, visited tracking
3. **Rotting Oranges (LeetCode #994)** - Multi-source BFS
4. **Word Ladder (LeetCode #127)** - BFS on implicit graph
5. **Shortest Path in Binary Matrix (LeetCode #1091)** - Basic shortest path
6. **01 Matrix (LeetCode #542)** - Multi-source BFS variation
7. **Shortest Path to Get All Keys (LeetCode #864)** - State tracking BFS
8. **Sliding Puzzle (LeetCode #773)** - BFS on state space
9. **Minimum Knight Moves (LeetCode #1197)** - BFS with constraints
10. **Bus Routes (LeetCode #815)** - BFS on complex graph representation

After these, tackle Nutanix's specific BFS problems. The key is to understand not just how to implement BFS, but when to use it and what variations apply to different problem types.

[Practice Breadth-First Search at Nutanix](/company/nutanix/breadth-first-search)
