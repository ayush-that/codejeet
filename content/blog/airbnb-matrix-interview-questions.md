---
title: "Matrix Questions at Airbnb: What to Expect"
description: "Prepare for Matrix interview questions at Airbnb — patterns, difficulty breakdown, and study tips."
date: "2028-12-30"
category: "dsa-patterns"
tags: ["airbnb", "matrix", "interview prep"]
---

# Matrix Questions at Airbnb: What to Expect

Airbnb’s coding interviews are known for their practical, product‑oriented problems, but don’t let that fool you into neglecting core data structures. Among their 64 tagged problems on LeetCode, 7 are Matrix‑based—that’s about 11% of their public question set. In real interviews, Matrix problems appear regularly because they elegantly test two‑dimensional reasoning, systematic traversal, and the ability to handle state changes in a grid—skills directly relevant to features like mapping, seating arrangements, or inventory layouts.

While not as dominant as string or array questions, Matrix problems at Airbnb are often used as a medium‑difficulty filter. They rarely ask the most abstract graph theory; instead, they prefer problems that feel like real‑world spatial puzzles. If you get a Matrix question, it’s usually in the first or second technical round, and solving it cleanly signals you can think in two dimensions and write bug‑free iterative code.

## Specific Patterns Airbnb Favors

Airbnb’s Matrix questions lean heavily on **grid traversal** and **simulation** rather than complex graph algorithms. You’ll see:

1. **BFS/DFS on a grid** – Used for exploring regions, counting islands, or finding connected components. Problems often involve modifying the grid in‑place to track visited cells.
2. **Iterative simulation** – Step‑by‑step updates to the grid, like Conway’s Game of Life or rot‑spreading problems. These test your ability to manage state transitions without extra data structures.
3. **Pathfinding with simple constraints** – Usually limited to 4‑direction moves, sometimes with obstacles. They avoid heavy shortest‑path algorithms (like A\*) in favor of BFS or DFS.

For example, **Walls and Gates (#286)** is a classic Airbnb problem: you’re given a grid representing rooms, walls, and gates, and you need to fill each empty room with the distance to the nearest gate. This is a multi‑source BFS—a pattern that comes up often. Another favorite is **Game of Life (#289)**, which tests in‑place updates and careful state handling.

## How to Prepare

The key is to master a few templates and adapt them. Let’s look at multi‑source BFS, which solves Walls and Gates and similar problems. The idea: initialize a queue with all “source” cells (gates), then expand layer by layer, updating distances.

<div class="code-group">

```python
from collections import deque
from typing import List

def walls_and_gates(rooms: List[List[int]]) -> None:
    """
    Modify rooms in-place: INF -> distance to nearest gate.
    Gates are 0, walls are -1, empty rooms are INF.
    """
    if not rooms:
        return

    rows, cols = len(rooms), len(rooms[0])
    q = deque()
    INF = 2**31 - 1

    # Add all gates to the queue
    for r in range(rows):
        for c in range(cols):
            if rooms[r][c] == 0:
                q.append((r, c))

    # Standard BFS directions
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    while q:
        r, c = q.popleft()
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            # Check bounds and if cell is an empty room
            if 0 <= nr < rows and 0 <= nc < cols and rooms[nr][nc] == INF:
                rooms[nr][nc] = rooms[r][c] + 1
                q.append((nr, nc))

# Time: O(m*n) – each cell visited at most once
# Space: O(m*n) – queue could hold all cells in worst case
```

```javascript
function wallsAndGates(rooms) {
  if (!rooms.length) return;

  const rows = rooms.length;
  const cols = rooms[0].length;
  const queue = [];
  const INF = 2 ** 31 - 1;

  // Enqueue all gates
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rooms[r][c] === 0) {
        queue.push([r, c]);
      }
    }
  }

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length) {
    const [r, c] = queue.shift();
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && rooms[nr][nc] === INF) {
        rooms[nr][nc] = rooms[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
}

// Time: O(m*n) | Space: O(m*n)
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class Solution {
    public void wallsAndGates(int[][] rooms) {
        if (rooms.length == 0) return;

        int rows = rooms.length;
        int cols = rooms[0].length;
        Queue<int[]> q = new LinkedList<>();
        int INF = Integer.MAX_VALUE;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (rooms[r][c] == 0) {
                    q.offer(new int[]{r, c});
                }
            }
        }

        int[][] dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};

        while (!q.isEmpty()) {
            int[] cell = q.poll();
            int r = cell[0], c = cell[1];
            for (int[] d : dirs) {
                int nr = r + d[0];
                int nc = c + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && rooms[nr][nc] == INF) {
                    rooms[nr][nc] = rooms[r][c] + 1;
                    q.offer(new int[]{nr, nc});
                }
            }
        }
    }
}

// Time: O(m*n) | Space: O(m*n)
```

</div>

Another pattern is in‑place state updates, as in Game of Life. The challenge is to apply the rules simultaneously. The trick is to use intermediate states to encode both old and new values.

<div class="code-group">

```python
def gameOfLife(board: List[List[int]]) -> None:
    rows, cols = len(board), len(board[0])
    # Encode transitions:
    # 0 -> 0: stays 0
    # 1 -> 0: dies, mark as -1
    # 0 -> 1: becomes alive, mark as 2
    # 1 -> 1: stays 1

    for r in range(rows):
        for c in range(cols):
            live_neighbors = 0
            # Check all 8 neighbors
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    if dr == 0 and dc == 0:
                        continue
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols:
                        if board[nr][nc] in (1, -1):  # Was alive
                            live_neighbors += 1

            # Apply rules
            if board[r][c] == 1:
                if live_neighbors < 2 or live_neighbors > 3:
                    board[r][c] = -1  # Dies
            else:
                if live_neighbors == 3:
                    board[r][c] = 2   # Becomes alive

    # Decode
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == -1:
                board[r][c] = 0
            elif board[r][c] == 2:
                board[r][c] = 1

# Time: O(m*n) | Space: O(1)
```

```javascript
function gameOfLife(board) {
  const rows = board.length,
    cols = board[0].length;
  // Encoding: -1 = was alive, now dead; 2 = was dead, now alive

  const countLiveNeighbors = (r, c) => {
    let live = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (board[nr][nc] === 1 || board[nr][nc] === -1) live++;
        }
      }
    }
    return live;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const live = countLiveNeighbors(r, c);
      if (board[r][c] === 1) {
        if (live < 2 || live > 3) board[r][c] = -1;
      } else {
        if (live === 3) board[r][c] = 2;
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === -1) board[r][c] = 0;
      else if (board[r][c] === 2) board[r][c] = 1;
    }
  }
}

// Time: O(m*n) | Space: O(1)
```

```java
public void gameOfLife(int[][] board) {
    int rows = board.length, cols = board[0].length;
    // -1: was alive, now dead; 2: was dead, now alive

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            int live = 0;
            for (int dr = -1; dr <= 1; dr++) {
                for (int dc = -1; dc <= 1; dc++) {
                    if (dr == 0 && dc == 0) continue;
                    int nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        if (board[nr][nc] == 1 || board[nr][nc] == -1) live++;
                    }
                }
            }

            if (board[r][c] == 1) {
                if (live < 2 || live > 3) board[r][c] = -1;
            } else {
                if (live == 3) board[r][c] = 2;
            }
        }
    }

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (board[r][c] == -1) board[r][c] = 0;
            else if (board[r][c] == 2) board[r][c] = 1;
        }
    }
}

// Time: O(m*n) | Space: O(1)
```

</div>

## How Airbnb Tests Matrix vs Other Companies

At companies like Google or Meta, Matrix questions often tie into advanced graph algorithms (e.g., shortest path with heuristics) or require tricky dynamic programming (e.g., maximal square). Airbnb’s approach is more pragmatic: their problems usually have a direct spatial analogy—placing amenities, navigating a floor plan, simulating spread. The difficulty is rarely “hard” on LeetCode; most are medium. What they test rigorously is **clean implementation under time pressure** and **handling edge cases** like empty grids or all walls.

Unique to Airbnb is the occasional twist where the matrix represents something like calendar availability or pricing grids—still a 2D structure, but the operations are about aggregating rows/columns. This blends Matrix with array techniques.

## Study Order

1. **Basic traversal** – Learn to iterate a grid with nested loops, understand row/column indices. Practice problems that require simple searches.
2. **BFS/DFS on grids** – Start with Number of Islands (#200). This teaches you to mark visited cells and explore connected components. Use both BFS and DFS to internalize them.
3. **Multi‑source BFS** – Move to Walls and Gates (#286) or Rotting Oranges (#994). These build on BFS but start from multiple points.
4. **In‑place updates** – Tackle Game of Life (#289). This forces you to think about simultaneous updates without extra space.
5. **Pathfinding with obstacles** – Try Unique Paths II (#63) (a DP problem) or Shortest Path in Binary Matrix (#1091). These introduce obstacles and simple optimization.
6. **Row/column aggregation** – Practice Matrix Block Sum (#1314) or Range Sum Query 2D (#304). These are less common but appear in Airbnb’s problem set.

This order works because it builds from simple iteration to coordinated multi‑cell operations, layering complexity gradually.

## Recommended Practice Order

Solve these Airbnb‑relevant problems in sequence:

1. **Number of Islands (#200)** – Foundation for grid DFS/BFS.
2. **Walls and Gates (#286)** – Master multi‑source BFS.
3. **Game of Life (#289)** – Learn in‑place state encoding.
4. **Rotting Oranges (#994)** – Another multi‑source BFS with a slight twist.
5. **Shortest Path in Binary Matrix (#1091)** – BFS for shortest path in a grid.
6. **Matrix Block Sum (#1314)** – Practice prefix sums in 2D (less common but good for completeness).
7. **Range Sum Query 2D – Immutable (#304)** – More prefix sums.

If you have time, add **Max Area of Island (#695)** and **Surrounded Regions (#130)** for extra DFS practice.

[Practice Matrix at Airbnb](/company/airbnb/matrix)
