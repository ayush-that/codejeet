---
title: "Breadth-First Search Questions at Citadel: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Citadel — patterns, difficulty breakdown, and study tips."
date: "2028-08-02"
category: "dsa-patterns"
tags: ["citadel", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a fundamental algorithm that appears in roughly 11% of Citadel's coding questions. While that might not sound overwhelming, it's a critical area to master because of how Citadel uses it. At many tech companies, BFS is primarily a tool for tree traversal or simple grid problems. At Citadel, BFS is often the engine for solving complex, multi-step simulation and optimization problems that model real-world trading, risk analysis, or system state exploration. They don't just ask "traverse a tree level-by-level." They ask, "Given a state space of possible market conditions or system configurations, find the minimum steps to reach a target state while navigating constraints." This shifts BFS from a simple traversal tool to a core technique for shortest-path problems in implicit graphs.

## Specific Patterns Citadel Favors

Citadel's BFS problems tend to cluster around a few high-value patterns that test your ability to model a problem as a graph and efficiently navigate it.

1.  **Shortest Path in an Unweighted, Implicit Graph:** This is their bread and butter. You won't be given an adjacency list. Instead, you'll be given rules to generate neighboring states from a current state. Classic examples include:
    - **Word Ladder (LeetCode #127):** The state is a word. Neighbors are words that differ by one letter and are in a dictionary. Find the shortest transformation sequence.
    - **Minimum Knight Moves (LeetCode #1197):** The state is a coordinate on an infinite board. Neighbors are the 8 possible knight moves. Find the minimum moves to a target square.
    - **Sliding Puzzle (LeetCode #773):** The state is the board configuration. A neighbor is the board after a legal slide. Find the minimum moves to the solved state.

2.  **Multi-Source BFS:** Instead of starting BFS from a single point, you initialize the queue with multiple sources. This perfectly models scenarios like "simultaneous infection spread" or "distance to the nearest gate." It's efficient and elegant.
    - **Rotting Oranges (LeetCode #994):** All rotten oranges are sources. Find the time for all fresh oranges to rot.
    - **Walls and Gates (LeetCode #286):** All gates are sources. Populate each room with the distance to the nearest gate.

3.  **BFS with State Tracking (Visited Sets with Dimensions):** The state isn't just a position `(x, y)`; it's a tuple like `(x, y, keys_held, steps_taken)`. The visited set must account for all these dimensions to avoid cycles. This tests your ability to design a comprehensive state representation.
    - **Shortest Path to Get All Keys (LeetCode #864):** The state is `(row, col, key_bitmask)`. You can only pass through a lock if you have the corresponding key.

<div class="code-group">

```python
# Pattern: Multi-Source BFS (Rotting Oranges - LeetCode #994)
# Time: O(m * n) | Space: O(m * n) for the queue in worst case
from collections import deque

def orangesRotting(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    minutes = 0

    # Initialize multi-source BFS: find all rotten oranges (sources)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    # If no fresh oranges at start, answer is 0
    if fresh_count == 0:
        return 0

    # Standard BFS layers
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    while queue and fresh_count > 0:
        # Process one complete layer (all oranges that rot at the same time)
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    # Rot the fresh orange
                    grid[nr][nc] = 2
                    queue.append((nr, nc))
                    fresh_count -= 1
        minutes += 1

    return minutes if fresh_count == 0 else -1
```

```javascript
// Pattern: Multi-Source BFS (Rotting Oranges - LeetCode #994)
// Time: O(m * n) | Space: O(m * n) for the queue in worst case
function orangesRotting(grid) {
  if (!grid.length) return 0;

  const rows = grid.length,
    cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;

  // Initialize multi-source BFS
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
    // Process one layer
    const layerSize = queue.length;
    for (let i = 0; i < layerSize; i++) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of directions) {
        const nr = r + dr,
          nc = c + dc;
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
```

```java
// Pattern: Multi-Source BFS (Rotting Oranges - LeetCode #994)
// Time: O(m * n) | Space: O(m * n) for the queue in worst case
import java.util.LinkedList;
import java.util.Queue;

public int orangesRotting(int[][] grid) {
    if (grid == null || grid.length == 0) return 0;

    int rows = grid.length, cols = grid[0].length;
    Queue<int[]> queue = new LinkedList<>();
    int freshCount = 0;
    int minutes = 0;

    // Initialize multi-source BFS
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

    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
    while (!queue.isEmpty() && freshCount > 0) {
        // Process one layer
        int layerSize = queue.size();
        for (int i = 0; i < layerSize; i++) {
            int[] point = queue.poll();
            int r = point[0], c = point[1];
            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
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
```

</div>

## How to Prepare

Your preparation should focus on building the mental muscle to see the "hidden graph." When you read a problem, ask: What is a _state_? What defines a _neighbor_? What is the _goal state_? Is the graph _unweighted_ (if yes, BFS finds the shortest path)?

**Practice the BFS Template with Variations:** Internalize a clean BFS template and then learn how to adapt it. The key adaptations are:

- **Queue Initialization:** Single source vs. multiple sources.
- **Visited State:** A simple `Set` of coordinates vs. a `Set` of tuples `(x, y, keys)`.
- **Goal Check:** Checking upon _expansion_ (popping from queue) vs. upon _generation_ (adding to queue). Usually, checking upon expansion is simpler and correct for unweighted graphs.

<div class="code-group">

```python
# Pattern: BFS with Complex State (Shortest Path to Get All Keys - Concept)
# Time: O(m * n * 2^k) | Space: O(m * n * 2^k) where k is number of keys
from collections import deque

def shortestPathAllKeys(grid):
    rows, cols = len(grid), len(grid[0])
    start_x = start_y = total_keys = 0

    # Find start and count keys
    for r in range(rows):
        for c in range(cols):
            cell = grid[r][c]
            if cell == '@':
                start_x, start_y = r, c
            elif 'a' <= cell <= 'f':
                total_keys = max(total_keys, ord(cell) - ord('a') + 1)

    # State: (x, y, keys_bitmask)
    start_state = (start_x, start_y, 0)
    queue = deque([start_state])
    visited = set([start_state])
    steps = 0
    all_keys_mask = (1 << total_keys) - 1

    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    while queue:
        for _ in range(len(queue)):
            x, y, keys = queue.popleft()

            # Goal check: do we have all keys?
            if keys == all_keys_mask:
                return steps

            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] != '#':
                    cell = grid[nx][ny]
                    new_keys = keys

                    # If it's a key, pick it up
                    if 'a' <= cell <= 'f':
                        key_idx = ord(cell) - ord('a')
                        new_keys = keys | (1 << key_idx)
                    # If it's a lock, check if we have the key
                    elif 'A' <= cell <= 'F':
                        lock_idx = ord(cell) - ord('A')
                        if not (keys & (1 << lock_idx)):
                            continue # Cannot pass without the key

                    new_state = (nx, ny, new_keys)
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)
        steps += 1
    return -1
```

```javascript
// Pattern: BFS with Complex State (Shortest Path to Get All Keys - Concept)
// Time: O(m * n * 2^k) | Space: O(m * n * 2^k) where k is number of keys
function shortestPathAllKeys(grid) {
  const rows = grid.length,
    cols = grid[0].length;
  let startX,
    startY,
    totalKeys = 0;

  // Find start and count keys
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (cell === "@") {
        startX = r;
        startY = c;
      } else if (cell >= "a" && cell <= "f") {
        totalKeys = Math.max(totalKeys, cell.charCodeAt(0) - "a".charCodeAt(0) + 1);
      }
    }
  }

  // State: [x, y, keysBitmask] as a string for visited set
  const startState = `${startX},${startY},0`;
  const queue = [[startX, startY, 0]];
  const visited = new Set([startState]);
  let steps = 0;
  const allKeysMask = (1 << totalKeys) - 1;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length) {
    for (let i = queue.length; i > 0; i--) {
      const [x, y, keys] = queue.shift();

      if (keys === allKeysMask) return steps;

      for (const [dx, dy] of dirs) {
        const nx = x + dx,
          ny = y + dy;
        if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] !== "#") {
          const cell = grid[nx][ny];
          let newKeys = keys;

          if (cell >= "a" && cell <= "f") {
            const keyIdx = cell.charCodeAt(0) - "a".charCodeAt(0);
            newKeys = keys | (1 << keyIdx);
          } else if (cell >= "A" && cell <= "F") {
            const lockIdx = cell.charCodeAt(0) - "A".charCodeAt(0);
            if (!(keys & (1 << lockIdx))) continue;
          }

          const newState = `${nx},${ny},${newKeys}`;
          if (!visited.has(newState)) {
            visited.add(newState);
            queue.push([nx, ny, newKeys]);
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
// Pattern: BFS with Complex State (Shortest Path to Get All Keys - Concept)
// Time: O(m * n * 2^k) | Space: O(m * n * 2^k) where k is number of keys
import java.util.*;

public int shortestPathAllKeys(String[] grid) {
    int rows = grid.length, cols = grid[0].length();
    int startX = 0, startY = 0, totalKeys = 0;

    // Find start and count keys
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            char cell = grid[r].charAt(c);
            if (cell == '@') {
                startX = r; startY = c;
            } else if (cell >= 'a' && cell <= 'f') {
                totalKeys = Math.max(totalKeys, cell - 'a' + 1);
            }
        }
    }

    // State: int[] {x, y, keysBitmask}
    int[] startState = new int[]{startX, startY, 0};
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(startState);
    Set<String> visited = new HashSet<>();
    visited.add(startX + "," + startY + "," + 0);
    int steps = 0;
    int allKeysMask = (1 << totalKeys) - 1;
    int[][] dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};

    while (!queue.isEmpty()) {
        for (int sz = queue.size(); sz > 0; sz--) {
            int[] curr = queue.poll();
            int x = curr[0], y = curr[1], keys = curr[2];

            if (keys == allKeysMask) return steps;

            for (int[] d : dirs) {
                int nx = x + d[0], ny = y + d[1];
                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
                    char cell = grid[nx].charAt(ny);
                    if (cell == '#') continue;

                    int newKeys = keys;
                    if (cell >= 'a' && cell <= 'f') {
                        int keyIdx = cell - 'a';
                        newKeys = keys | (1 << keyIdx);
                    } else if (cell >= 'A' && cell <= 'F') {
                        int lockIdx = cell - 'A';
                        if ((keys & (1 << lockIdx)) == 0) continue;
                    }

                    String stateKey = nx + "," + ny + "," + newKeys;
                    if (!visited.contains(stateKey)) {
                        visited.add(stateKey);
                        queue.offer(new int[]{nx, ny, newKeys});
                    }
                }
            }
        }
        steps++;
    }
    return -1;
}
```

</div>

## How Citadel Tests Breadth-First Search vs Other Companies

At companies like Google or Meta, BFS is often tested in isolation on a well-defined graph or tree (e.g., "Clone a graph" or "Binary Tree Level Order Traversal"). The challenge is implementing the algorithm correctly and handling edge cases.

At Citadel, the BFS is rarely the challenge itself—it's the _problem modeling_. The interview is testing whether you can identify that a shortest-path-on-implicit-graph approach is applicable. The constraints often involve multiple moving parts (keys, locks, time steps, simultaneous agents). The difficulty comes from designing the correct state representation and the rules for state transitions. They want to see if you can break down a messy, real-world-adjacent problem into a clean graph search.

## Study Order

1.  **Master the Basic BFS Template on Explicit Graphs/Trees:** Be able to implement level-order traversal in a binary tree and simple grid traversal (Number of Islands - LeetCode #200) in your sleep. This builds fluency with the queue and visited set mechanics.
2.  **Learn Shortest Path in Implicit Graphs:** Practice problems where you derive neighbors from a state using rules (Word Ladder, Knight Moves). This builds the crucial skill of state definition.
3.  **Tackle Multi-Source BFS:** Understand why this is more efficient than running BFS from each source individually. This pattern frequently appears in optimization contexts.
4.  **Conquer BFS with Multi-Dimensional State:** This is the peak of Citadel-style BFS. Practice designing state tuples that include all necessary information (position, keys, steps, etc.) and managing the corresponding visited set.
5.  **Explore Bi-directional BFS (Optional but Impressive):** For problems with a single, clear start and end state (like Word Ladder), knowing how to implement bi-directional BFS can be a great optimization to discuss, showing deeper algorithmic knowledge.

## Recommended Practice Order

Solve these problems in sequence to build up the patterns:

1.  **Binary Tree Level Order Traversal (LeetCode #102):** Pure BFS template on a tree.
2.  **Number of Islands (LeetCode #200):** BFS on a grid, simple state `(r, c)`.
3.  **Rotting Oranges (LeetCode #994):** Multi-source BFS.
4.  **Word Ladder (LeetCode #127):** Shortest path in an implicit graph (words as nodes).
5.  **Minimum Knight Moves (LeetCode #1197):** Shortest path on an infinite implicit graph. Teaches you to bound your search space.
6.  **Shortest Path in Binary Matrix (LeetCode #1091):** Classic grid shortest path with obstacles.
7.  **Sliding Puzzle (LeetCode #773):** More complex implicit graph; the state is a board configuration.
8.  **Shortest Path to Get All Keys (LeetCode #864):** The ultimate test—BFS with a complex state `(r, c, keys)`.

Mastering this progression will make you exceptionally well-prepared for the type of layered, modeling-intensive BFS problems Citadel uses to identify strong problem-solvers.

[Practice Breadth-First Search at Citadel](/company/citadel/breadth-first-search)
