---
title: "Breadth-First Search Questions at Samsung: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Samsung — patterns, difficulty breakdown, and study tips."
date: "2028-11-22"
category: "dsa-patterns"
tags: ["samsung", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Samsung: What to Expect

If you're preparing for a Samsung interview, you've probably noticed they have 10 Breadth-First Search (BFS) questions in their problem bank. That's about 14% of their total questions — not the highest percentage among tech companies, but significant enough that you can't afford to ignore it. Here's what you need to know: Samsung doesn't just test BFS as an isolated algorithm. They test it as a fundamental building block for solving real-world problems in networking, robotics, and system optimization — areas where Samsung has massive business interests.

In my experience conducting mock interviews with engineers who've interviewed at Samsung, BFS questions tend to appear in about 1 in 3 technical interviews. They're not always labeled as "BFS problems" — sometimes they're disguised as matrix traversal, shortest path, or level-order tree problems. The key insight is that Samsung interviewers use BFS to assess your ability to think about systems, layers, and optimal exploration strategies.

## Specific Patterns Samsung Favors

Samsung's BFS questions cluster around three specific patterns:

1. **Multi-source BFS** — Problems where you need to find the shortest distance from multiple starting points. This pattern appears in Samsung's networking and sensor network problems. Think about routers broadcasting signals or multiple robots exploring a factory floor simultaneously.

2. **BFS with state tracking** — Not just "visited" but tracking additional state like keys collected, direction faced, or steps remaining. This tests your ability to model complex constraints.

3. **Bidirectional BFS** — When the search space is large but you know both start and end points, Samsung sometimes expects this optimization.

A classic example is **"Rotting Oranges" (LeetCode #994)**, which is essentially multi-source BFS. Another favorite is **"Shortest Path in Binary Matrix" (LeetCode #1091)**, which often gets extended with obstacles or multiple endpoints in Samsung interviews.

Here's the multi-source BFS pattern you must master:

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

    # Initialize: add all sources to queue
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # Source nodes
                queue.append((r, c))
            elif grid[r][c] == 1:  # Targets to reach
                fresh_count += 1

    # If no fresh targets, we're already done
    if fresh_count == 0:
        return 0

    # Standard BFS with level tracking
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue and fresh_count > 0:
        # Process one complete level (all nodes at current distance)
        level_size = len(queue)

        for _ in range(level_size):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                # Check bounds and validity
                if (0 <= nr < rows and 0 <= nc < cols and
                    grid[nr][nc] == 1):  # Only unvisited targets

                    grid[nr][nc] = 2  # Mark as visited/reached
                    queue.append((nr, nc))
                    fresh_count -= 1

        minutes += 1  # Each level = one time unit

    return minutes if fresh_count == 0 else -1

# Time: O(rows * cols) - each cell visited at most once
# Space: O(rows * cols) - queue could hold all cells in worst case
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

  // Initialize: add all sources to queue
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        // Source nodes
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        // Targets to reach
        freshCount++;
      }
    }
  }

  // If no fresh targets, we're already done
  if (freshCount === 0) return 0;

  // Standard BFS with level tracking
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0 && freshCount > 0) {
    // Process one complete level
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        // Check bounds and validity
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          // Only unvisited targets

          grid[nr][nc] = 2; // Mark as visited/reached
          queue.push([nr, nc]);
          freshCount--;
        }
      }
    }

    minutes++; // Each level = one time unit
  }

  return freshCount === 0 ? minutes : -1;
}

// Time: O(rows * cols) - each cell visited at most once
// Space: O(rows * cols) - queue could hold all cells in worst case
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

        // Initialize: add all sources to queue
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 2) {  // Source nodes
                    queue.offer(new int[]{r, c});
                } else if (grid[r][c] == 1) {  // Targets to reach
                    freshCount++;
                }
            }
        }

        // If no fresh targets, we're already done
        if (freshCount == 0) return 0;

        // Standard BFS with level tracking
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty() && freshCount > 0) {
            // Process one complete level
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
                        grid[nr][nc] == 1) {  // Only unvisited targets

                        grid[nr][nc] = 2;  // Mark as visited/reached
                        queue.offer(new int[]{nr, nc});
                        freshCount--;
                    }
                }
            }

            minutes++;  // Each level = one time unit
        }

        return freshCount == 0 ? minutes : -1;
    }
}

// Time: O(rows * cols) - each cell visited at most once
// Space: O(rows * cols) - queue could hold all cells in worst case
```

</div>

## How to Prepare

Most candidates make the mistake of practicing BFS in isolation. Samsung interviews test BFS as part of a _system design_ mindset. When you solve a BFS problem for Samsung, think: "What real Samsung system could this represent?" Is it data packets finding the fastest route through a network? Is it a robot navigating a warehouse? This mindset shift will help you anticipate edge cases and optimizations.

For BFS with state tracking (like **"Shortest Path to Get All Keys" - LeetCode #864**), you need to modify the visited tracking to include the state. Here's the pattern:

<div class="code-group">

```python
from collections import deque
from typing import List

def bfs_with_state(grid: List[str]) -> int:
    """
    BFS with state tracking template (e.g., Shortest Path to Get All Keys #864)
    State is often represented as a bitmask for collected items
    """
    if not grid or not grid[0]:
        return -1

    rows, cols = len(grid), len(grid[0])

    # Find start position and count keys
    start_r = start_c = 0
    key_count = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '@':
                start_r, start_c = r, c
            elif 'a' <= grid[r][c] <= 'f':
                key_count = max(key_count, ord(grid[r][c]) - ord('a') + 1)

    # Visited tracking includes position AND key state
    # visited[row][col][key_mask] = whether we've been here with these keys
    visited = [[[False] * (1 << key_count) for _ in range(cols)] for _ in range(rows)]

    # Queue elements: (row, col, keys_mask, distance)
    queue = deque([(start_r, start_c, 0, 0)])
    visited[start_r][start_c][0] = True

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue:
        r, c, keys, dist = queue.popleft()

        # Check if we have all keys (all bits set)
        if keys == (1 << key_count) - 1:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != '#':
                cell = grid[nr][nc]
                new_keys = keys

                # Handle keys
                if 'a' <= cell <= 'f':
                    key_index = ord(cell) - ord('a')
                    new_keys = keys | (1 << key_index)

                # Handle locks - need corresponding key
                elif 'A' <= cell <= 'F':
                    lock_index = ord(cell) - ord('A')
                    if not (keys & (1 << lock_index)):
                        continue  # Don't have the key for this lock

                # Check if this state is new
                if not visited[nr][nc][new_keys]:
                    visited[nr][nc][new_keys] = True
                    queue.append((nr, nc, new_keys, dist + 1))

    return -1

# Time: O(rows * cols * 2^keys) - state space includes key combinations
# Space: O(rows * cols * 2^keys) - visited array tracks all states
```

```javascript
/**
 * BFS with state tracking template (e.g., Shortest Path to Get All Keys #864)
 * State is often represented as a bitmask for collected items
 */
function bfsWithState(grid) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return -1;

  const rows = grid.length;
  const cols = grid[0].length;

  // Find start position and count keys
  let startR = 0,
    startC = 0;
  let keyCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "@") {
        startR = r;
        startC = c;
      } else if (grid[r][c] >= "a" && grid[r][c] <= "f") {
        keyCount = Math.max(keyCount, grid[r].charCodeAt(c) - "a".charCodeAt(0) + 1);
      }
    }
  }

  // Visited tracking includes position AND key state
  // visited[row][col][key_mask] = whether we've been here with these keys
  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Array(1 << keyCount).fill(false))
  );

  // Queue elements: [row, col, keys_mask, distance]
  const queue = [[startR, startC, 0, 0]];
  visited[startR][startC][0] = true;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0) {
    const [r, c, keys, dist] = queue.shift();

    // Check if we have all keys (all bits set)
    if (keys === (1 << keyCount) - 1) {
      return dist;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== "#") {
        const cell = grid[nr][nc];
        let newKeys = keys;

        // Handle keys
        if (cell >= "a" && cell <= "f") {
          const keyIndex = cell.charCodeAt(0) - "a".charCodeAt(0);
          newKeys = keys | (1 << keyIndex);
        }

        // Handle locks - need corresponding key
        else if (cell >= "A" && cell <= "F") {
          const lockIndex = cell.charCodeAt(0) - "A".charCodeAt(0);
          if (!(keys & (1 << lockIndex))) {
            continue; // Don't have the key for this lock
          }
        }

        // Check if this state is new
        if (!visited[nr][nc][newKeys]) {
          visited[nr][nc][newKeys] = true;
          queue.push([nr, nc, newKeys, dist + 1]);
        }
      }
    }
  }

  return -1;
}

// Time: O(rows * cols * 2^keys) - state space includes key combinations
// Space: O(rows * cols * 2^keys) - visited array tracks all states
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class BFSWithState {
    /**
     * BFS with state tracking template (e.g., Shortest Path to Get All Keys #864)
     * State is often represented as a bitmask for collected items
     */
    public int bfsWithState(String[] grid) {
        if (grid == null || grid.length == 0 || grid[0].length() == 0) return -1;

        int rows = grid.length;
        int cols = grid[0].length();

        // Find start position and count keys
        int startR = 0, startC = 0;
        int keyCount = 0;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                char cell = grid[r].charAt(c);
                if (cell == '@') {
                    startR = r;
                    startC = c;
                } else if (cell >= 'a' && cell <= 'f') {
                    keyCount = Math.max(keyCount, cell - 'a' + 1);
                }
            }
        }

        // Visited tracking includes position AND key state
        // visited[row][col][key_mask] = whether we've been here with these keys
        boolean[][][] visited = new boolean[rows][cols][1 << keyCount];

        // Queue elements: int[]{row, col, keys_mask, distance}
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{startR, startC, 0, 0});
        visited[startR][startC][0] = true;

        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int r = current[0];
            int c = current[1];
            int keys = current[2];
            int dist = current[3];

            // Check if we have all keys (all bits set)
            if (keys == (1 << keyCount) - 1) {
                return dist;
            }

            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                    grid[nr].charAt(nc) != '#') {

                    char cell = grid[nr].charAt(nc);
                    int newKeys = keys;

                    // Handle keys
                    if (cell >= 'a' && cell <= 'f') {
                        int keyIndex = cell - 'a';
                        newKeys = keys | (1 << keyIndex);
                    }

                    // Handle locks - need corresponding key
                    else if (cell >= 'A' && cell <= 'F') {
                        int lockIndex = cell - 'A';
                        if ((keys & (1 << lockIndex)) == 0) {
                            continue;  // Don't have the key for this lock
                        }
                    }

                    // Check if this state is new
                    if (!visited[nr][nc][newKeys]) {
                        visited[nr][nc][newKeys] = true;
                        queue.offer(new int[]{nr, nc, newKeys, dist + 1});
                    }
                }
            }
        }

        return -1;
    }
}

// Time: O(rows * cols * 2^keys) - state space includes key combinations
// Space: O(rows * cols * 2^keys) - visited array tracks all states
```

</div>

## How Samsung Tests Breadth-First Search vs Other Companies

Samsung's BFS questions differ from other companies in three key ways:

1. **Practical applications over theoretical complexity** — While Google might ask about BFS time complexity proofs, Samsung wants to see you apply BFS to solve a concrete problem that could relate to their products (smart home networks, manufacturing robots, mobile device optimization).

2. **Multi-constraint problems** — Amazon's BFS questions tend to be more straightforward (warehouse pathfinding). Samsung often adds multiple constraints: limited battery, multiple agents, or changing environments.

3. **Integration with other concepts** — At Facebook, BFS is often tested with trees (level order traversal). At Samsung, it's more commonly integrated with bit manipulation (for state tracking) or dynamic programming (for optimization).

The difficulty level is typically medium, but the _thinking_ required is harder because you need to model real-world constraints.

## Study Order

Don't jump straight into Samsung's hardest BFS problems. Build up systematically:

1. **Basic BFS on grids** — Master the fundamental queue-based traversal. Practice until you can write it from memory.
2. **Level-order tree traversal** — Understand how BFS naturally processes by levels.
3. **Shortest path in unweighted graphs** — This is BFS's superpower. Understand why it finds the shortest path.
4. **Multi-source BFS** — Critical for Samsung. Practice starting from multiple points.
5. **BFS with state tracking** — Learn to track additional information (keys, direction, steps).
6. **Bidirectional BFS** — Optimization for when start and end are known.
7. **0-1 BFS** (using deque) — For graphs with weights 0 or 1 only.

This order works because each concept builds on the previous one. You can't understand state tracking if you're still shaky on basic BFS mechanics.

## Recommended Practice Order

Solve these problems in sequence:

1. **Number of Islands (#200)** — Basic grid BFS
2. **Binary Tree Level Order Traversal (#102)** — Basic tree BFS
3. **Rotting Oranges (#994)** — Multi-source BFS (Samsung favorite)
4. **Shortest Path in Binary Matrix (#1091)** — Grid shortest path
5. **Open the Lock (#752)** — BFS with string states
6. **Shortest Path to Get All Keys (#864)** — BFS with bitmask state (Advanced Samsung)
7. **Sliding Puzzle (#773)** — BFS with complex state representation
8. **Bus Routes (#815)** — BFS on abstract graph (Samsung networking problems)

Each problem introduces a new twist that builds toward Samsung's interview style. Notice how we progress from basic traversal to complex state management — exactly the progression Samsung interviewers expect to see in your problem-solving ability.

[Practice Breadth-First Search at Samsung](/company/samsung/breadth-first-search)
