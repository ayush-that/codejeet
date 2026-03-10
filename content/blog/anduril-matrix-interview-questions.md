---
title: "Matrix Questions at Anduril: What to Expect"
description: "Prepare for Matrix interview questions at Anduril — patterns, difficulty breakdown, and study tips."
date: "2029-12-11"
category: "dsa-patterns"
tags: ["anduril", "matrix", "interview prep"]
---

If you're preparing for an Anduril interview, you've likely noticed something unusual in their question distribution: **Matrix problems represent roughly 20% of their technical interview questions** (9 out of 43 total). That's not a coincidence — it's a deliberate signal. At a defense technology company building autonomous systems, sensor fusion, and battlefield awareness platforms, matrix operations aren't just algorithmic exercises; they're fundamental to processing lidar data, image recognition, grid-based simulations, and spatial reasoning. When Anduril asks matrix questions, they're testing your ability to think in two dimensions about real-world spatial problems.

Unlike companies where matrix questions might appear as generic LeetCode exercises, Anduril's problems tend to mirror their domain: you're navigating grids, detecting patterns in sensor data, or optimizing paths through constrained spaces. The frequency means you can't afford to treat this as a secondary topic — it's core to their technical screening.

## Specific Patterns Anduril Favors

Anduril's matrix problems cluster around **grid traversal with state** and **connected components analysis**. They rarely ask pure matrix multiplication or linear algebra puzzles. Instead, they favor problems where the matrix represents a physical space, and your algorithm must reason about movement, connectivity, or transformation within constraints.

The most common patterns I've seen:

1. **Multi-source BFS on grids** — Think "rotting oranges" or "walls and gates" style problems where multiple starting points propagate through the grid. This models sensor coverage or wavefront propagation.
2. **DFS/BFS with visited states** — Not just simple traversal, but traversal where you track additional state (keys collected, direction faced, steps remaining). This tests your ability to manage complexity in state space.
3. **Dynamic programming on grids** — Usually iterative DP from multiple directions (top-left to bottom-right combined with bottom-right to top-left), not recursive memoization.

For example, **Walls and Gates (LeetCode #286)** appears in variations frequently — you're given a grid with empty rooms, walls, and gates, and need to fill each room with the distance to the nearest gate. This directly models sensor range calculation in a constrained environment.

<div class="code-group">

```python
# Multi-source BFS: Walls and Gates pattern
# Time: O(m*n) | Space: O(m*n) for queue in worst case
def walls_and_gates(rooms):
    if not rooms:
        return

    m, n = len(rooms), len(rooms[0])
    queue = collections.deque()

    # Multi-source initialization: all gates enter queue first
    for i in range(m):
        for j in range(n):
            if rooms[i][j] == 0:
                queue.append((i, j))

    # Standard BFS ensures we process all gates simultaneously
    # and each cell gets distance to nearest gate
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    distance = 0

    while queue:
        for _ in range(len(queue)):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                # Valid move: within bounds and is an empty room
                if 0 <= nr < m and 0 <= nc < n and rooms[nr][nc] == 2147483647:
                    rooms[nr][nc] = rooms[r][c] + 1
                    queue.append((nr, nc))
```

```javascript
// Multi-source BFS: Walls and Gates pattern
// Time: O(m*n) | Space: O(m*n) for queue in worst case
function wallsAndGates(rooms) {
  if (!rooms || rooms.length === 0) return;

  const m = rooms.length,
    n = rooms[0].length;
  const queue = [];
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // Initialize queue with all gates
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rooms[i][j] === 0) {
        queue.push([i, j]);
      }
    }
  }

  // BFS from all gates simultaneously
  while (queue.length > 0) {
    const [r, c] = queue.shift();

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;

      if (nr >= 0 && nr < m && nc >= 0 && nc < n && rooms[nr][nc] === 2147483647) {
        rooms[nr][nc] = rooms[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
}
```

```java
// Multi-source BFS: Walls and Gates pattern
// Time: O(m*n) | Space: O(m*n) for queue in worst case
public void wallsAndGates(int[][] rooms) {
    if (rooms == null || rooms.length == 0) return;

    int m = rooms.length, n = rooms[0].length;
    Queue<int[]> queue = new LinkedList<>();
    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};

    // Add all gates to the queue
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (rooms[i][j] == 0) {
                queue.offer(new int[]{i, j});
            }
        }
    }

    // BFS from all gates
    while (!queue.isEmpty()) {
        int[] cell = queue.poll();
        int r = cell[0], c = cell[1];

        for (int[] dir : directions) {
            int nr = r + dir[0], nc = c + dir[1];

            if (nr >= 0 && nr < m && nc >= 0 && nc < n &&
                rooms[nr][nc] == Integer.MAX_VALUE) {
                rooms[nr][nc] = rooms[r][c] + 1;
                queue.offer(new int[]{nr, nc});
            }
        }
    }
}
```

</div>

## How to Prepare

Master the **stateful BFS/DFS** pattern. Anduril problems often add twists like limited movement, key requirements, or changing conditions. Practice tracking visited states using bitmasking when needed (like in **Shortest Path to Get All Keys, LeetCode #864**).

Here's the key insight: when you see an Anduril matrix problem, immediately ask:

1. Does this represent a physical space? (Probably yes)
2. What are my movement constraints? (4-directional? 8-directional? Limited steps?)
3. What state do I need to track beyond position? (Keys collected? Direction faced? Time elapsed?)
4. Is this a coverage problem? (Use multi-source BFS)
5. Is this a connectivity problem? (Use Union-Find or DFS)

<div class="code-group">

```python
# Stateful BFS with bitmasking pattern (Shortest Path to Get All Keys)
# Time: O(m*n*2^k) where k = number of keys | Space: O(m*n*2^k)
def shortestPathAllKeys(grid):
    if not grid:
        return -1

    m, n = len(grid), len(grid[0])
    start_x = start_y = total_keys = 0

    # Find start and count keys
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '@':
                start_x, start_y = i, j
            elif 'a' <= grid[i][j] <= 'f':
                total_keys = max(total_keys, ord(grid[i][j]) - ord('a') + 1)

    # BFS with state: (x, y, keys_mask)
    queue = collections.deque([(start_x, start_y, 0)])
    visited = [[[False] * (1 << total_keys) for _ in range(n)] for _ in range(m)]
    visited[start_x][start_y][0] = True
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    steps = 0

    while queue:
        for _ in range(len(queue)):
            x, y, keys = queue.popleft()

            # All keys collected
            if keys == (1 << total_keys) - 1:
                return steps

            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                new_keys = keys

                if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] != '#':
                    cell = grid[nx][ny]

                    # Check if it's a locked door without key
                    if 'A' <= cell <= 'F':
                        key_needed = 1 << (ord(cell) - ord('A'))
                        if not (keys & key_needed):
                            continue

                    # Collect key if present
                    elif 'a' <= cell <= 'f':
                        new_keys = keys | (1 << (ord(cell) - ord('a')))

                    if not visited[nx][ny][new_keys]:
                        visited[nx][ny][new_keys] = True
                        queue.append((nx, ny, new_keys))

        steps += 1

    return -1
```

```javascript
// Stateful BFS with bitmasking pattern
// Time: O(m*n*2^k) | Space: O(m*n*2^k)
function shortestPathAllKeys(grid) {
  if (!grid || grid.length === 0) return -1;

  const m = grid.length,
    n = grid[0].length;
  let startX = 0,
    startY = 0,
    totalKeys = 0;

  // Find start position and count keys
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "@") {
        startX = i;
        startY = j;
      } else if (grid[i][j] >= "a" && grid[i][j] <= "f") {
        totalKeys = Math.max(totalKeys, grid[i].charCodeAt(j) - 97 + 1);
      }
    }
  }

  const queue = [[startX, startY, 0]];
  const visited = Array(m)
    .fill()
    .map(() =>
      Array(n)
        .fill()
        .map(() => Array(1 << totalKeys).fill(false))
    );
  visited[startX][startY][0] = true;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let steps = 0;

  while (queue.length > 0) {
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      const [x, y, keys] = queue.shift();

      // All keys collected
      if (keys === (1 << totalKeys) - 1) {
        return steps;
      }

      for (const [dx, dy] of directions) {
        const nx = x + dx,
          ny = y + dy;
        let newKeys = keys;

        if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] !== "#") {
          const cell = grid[nx][ny];

          // Check locked door
          if (cell >= "A" && cell <= "F") {
            const keyNeeded = 1 << (cell.charCodeAt(0) - 65);
            if (!(keys & keyNeeded)) continue;
          }

          // Collect key
          else if (cell >= "a" && cell <= "f") {
            newKeys = keys | (1 << (cell.charCodeAt(0) - 97));
          }

          if (!visited[nx][ny][newKeys]) {
            visited[nx][ny][newKeys] = true;
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
// Stateful BFS with bitmasking pattern
// Time: O(m*n*2^k) | Space: O(m*n*2^k)
public int shortestPathAllKeys(String[] grid) {
    int m = grid.length, n = grid[0].length();
    int startX = 0, startY = 0, totalKeys = 0;

    // Find start and count keys
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            char c = grid[i].charAt(j);
            if (c == '@') {
                startX = i;
                startY = j;
            } else if (c >= 'a' && c <= 'f') {
                totalKeys = Math.max(totalKeys, c - 'a' + 1);
            }
        }
    }

    Queue<int[]> queue = new LinkedList<>();
    boolean[][][] visited = new boolean[m][n][1 << totalKeys];
    queue.offer(new int[]{startX, startY, 0});
    visited[startX][startY][0] = true;
    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
    int steps = 0;

    while (!queue.isEmpty()) {
        int size = queue.size();

        for (int i = 0; i < size; i++) {
            int[] current = queue.poll();
            int x = current[0], y = current[1], keys = current[2];

            // All keys collected
            if (keys == (1 << totalKeys) - 1) {
                return steps;
            }

            for (int[] dir : directions) {
                int nx = x + dir[0], ny = y + dir[1];
                int newKeys = keys;

                if (nx >= 0 && nx < m && ny >= 0 && ny < n &&
                    grid[nx].charAt(ny) != '#') {
                    char cell = grid[nx].charAt(ny);

                    // Check locked door
                    if (cell >= 'A' && cell <= 'F') {
                        int keyNeeded = 1 << (cell - 'A');
                        if ((keys & keyNeeded) == 0) continue;
                    }

                    // Collect key
                    else if (cell >= 'a' && cell <= 'f') {
                        newKeys = keys | (1 << (cell - 'a'));
                    }

                    if (!visited[nx][ny][newKeys]) {
                        visited[nx][ny][newKeys] = true;
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

## How Anduril Tests Matrix vs Other Companies

At FAANG companies, matrix problems often test pure algorithmic cleverness — think "rotate image" or "spiral matrix" puzzles. At Anduril, matrix problems are **applied spatial reasoning**. The difference is subtle but important:

- **Google/Meta**: "Given a matrix, rotate it 90 degrees" (pure transformation)
- **Anduril**: "Given a grid representing a battlefield with obstacles, find optimal sensor placement to cover all areas" (applied spatial coverage)

Anduril problems typically have:

- **Real-world constraints**: Limited fuel/energy, keys and locks, timed conditions
- **Multiple agents or sources**: Multi-source BFS is more common than single-source
- **State complexity**: You're often tracking more than just visited positions

The difficulty tends to be medium to hard, but the challenge isn't in mathematical complexity — it's in managing state space and recognizing which traversal pattern fits the problem.

## Study Order

1. **Basic grid traversal** — Start with simple DFS/BFS on matrices (Number of Islands, Flood Fill). Master direction arrays and bounds checking.
2. **Multi-source BFS** — Learn to initialize queues with multiple starting points. This is crucial for coverage problems.
3. **DP on grids** — Practice both top-down and bottom-up approaches (Unique Paths, Minimum Path Sum).
4. **Stateful traversal** — Add keys, doors, time limits, or direction constraints to your BFS/DFS.
5. **Union-Find on grids** — For connectivity problems (Number of Islands II).
6. **Advanced patterns** — A\* search for pathfinding, Dijkstra's on grids with weights.

This order builds from fundamental movement to complex state management — exactly the progression Anduril interviewers expect.

## Recommended Practice Order

Solve these in sequence:

1. **Number of Islands (LeetCode #200)** — Basic DFS/BFS
2. **Rotting Oranges (LeetCode #994)** — Multi-source BFS
3. **Walls and Gates (LeetCode #286)** — Classic Anduril pattern
4. **Shortest Path in Binary Matrix (LeetCode #1091)** — BFS with obstacles
5. **Unique Paths II (LeetCode #63)** — DP with obstacles
6. **Shortest Path to Get All Keys (LeetCode #864)** — Stateful BFS (bitmasking)
7. **Swim in Rising Water (LeetCode #778)** — Binary search + DFS/BFS
8. **Robot Cleaner (LeetCode #489)** — DFS with backtracking (simulates actual robotics)

Each problem builds on the previous one, adding complexity in the exact ways Anduril interviews do.

Remember: at Anduril, you're not just solving matrix problems — you're demonstrating spatial reasoning for autonomous systems. Your interviewer wants to see that you can model physical constraints and think about coverage, connectivity, and optimal movement in two-dimensional space.

[Practice Matrix at Anduril](/company/anduril/matrix)
