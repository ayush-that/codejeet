---
title: "Breadth-First Search Questions at ServiceNow: What to Expect"
description: "Prepare for Breadth-First Search interview questions at ServiceNow — patterns, difficulty breakdown, and study tips."
date: "2028-10-13"
category: "dsa-patterns"
tags: ["servicenow", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at ServiceNow: What to Expect

ServiceNow's technical interviews feature Breadth-First Search (BFS) in about 10% of their coding questions (8 out of 78). While not their absolute highest frequency topic, BFS appears consistently enough that you'll likely encounter at least one BFS problem in any interview loop. What makes ServiceNow's BFS questions distinctive isn't their frequency, but their _application context_ — they often frame BFS problems around business workflow scenarios, like ticket routing, dependency resolution, or organizational hierarchy traversal.

Unlike companies that use BFS primarily for abstract graph theory, ServiceNow tends to embed BFS within problems that model real platform scenarios. You're not just finding the shortest path in a maze; you're finding the minimum steps to resolve a service ticket through approval chains, or determining if a configuration change will propagate correctly through dependent systems.

## Specific Patterns ServiceNow Favors

ServiceNow's BFS problems cluster around three specific patterns:

1. **Shortest Path in Unweighted Grids/Matrices** — Classic "minimum steps" problems, often framed as navigating through obstacles or valid states. Think "Shortest Path in Binary Matrix" (LeetCode #1091) but with business logic constraints.

2. **Level-Order Traversal with Business Logic** — Not just binary trees, but traversing organizational hierarchies, approval chains, or dependency graphs where you need to process nodes by "tiers" or "rounds."

3. **Multi-Source BFS** — Problems where multiple starting points simultaneously propagate outward. This models scenarios like broadcasting notifications, parallel processing, or infection spread through connected systems.

The key differentiator is the _constraint layer_. A typical ServiceNow BFS problem might give you a grid representing system states, but then add rules like "you can only move to cells where the adjacent system is compatible" or "certain transitions require waiting a turn."

## How to Prepare

Master the core BFS template first, then learn to adapt it with constraint checks. Here's the fundamental pattern you must have muscle memory for:

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(grid):
    """Find shortest path in unweighted grid from (0,0) to (n-1,m-1)."""
    if not grid or grid[0][0] == 1:
        return -1

    rows, cols = len(grid), len(grid[0])
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    # Queue stores (row, col, distance)
    queue = deque([(0, 0, 1)])
    grid[0][0] = 1  # Mark visited

    while queue:
        r, c, dist = queue.popleft()

        # Check if reached target
        if r == rows-1 and c == cols-1:
            return dist

        # Explore neighbors
        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            # Boundary check, obstacle check, visited check
            if (0 <= nr < rows and 0 <= nc < cols
                and grid[nr][nc] == 0):
                queue.append((nr, nc, dist + 1))
                grid[nr][nc] = 1  # Mark visited

    return -1

# Time: O(rows * cols) — each cell visited at most once
# Space: O(min(rows, cols)) — queue size in worst case
```

```javascript
function bfsShortestPath(grid) {
  if (!grid.length || grid[0][0] === 1) return -1;

  const rows = grid.length,
    cols = grid[0].length;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // Queue stores [row, col, distance]
  const queue = [[0, 0, 1]];
  grid[0][0] = 1; // Mark visited

  while (queue.length) {
    const [r, c, dist] = queue.shift();

    // Check if reached target
    if (r === rows - 1 && c === cols - 1) {
      return dist;
    }

    // Explore neighbors
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;

      // Boundary check, obstacle check, visited check
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        queue.push([nr, nc, dist + 1]);
        grid[nr][nc] = 1; // Mark visited
      }
    }
  }

  return -1;
}

// Time: O(rows * cols) — each cell visited at most once
// Space: O(min(rows, cols)) — queue size in worst case
```

```java
import java.util.LinkedList;
import java.util.Queue;

public int bfsShortestPath(int[][] grid) {
    if (grid == null || grid.length == 0 || grid[0][0] == 1) {
        return -1;
    }

    int rows = grid.length, cols = grid[0].length;
    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};

    // Queue stores arrays of [row, col, distance]
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{0, 0, 1});
    grid[0][0] = 1;  // Mark visited

    while (!queue.isEmpty()) {
        int[] current = queue.poll();
        int r = current[0], c = current[1], dist = current[2];

        // Check if reached target
        if (r == rows-1 && c == cols-1) {
            return dist;
        }

        // Explore neighbors
        for (int[] dir : directions) {
            int nr = r + dir[0], nc = c + dir[1];

            // Boundary check, obstacle check, visited check
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && grid[nr][nc] == 0) {
                queue.offer(new int[]{nr, nc, dist + 1});
                grid[nr][nc] = 1;  // Mark visited
            }
        }
    }

    return -1;
}

// Time: O(rows * cols) — each cell visited at most once
// Space: O(min(rows, cols)) — queue size in worst case
```

</div>

For ServiceNow interviews, you'll need to extend this pattern with constraint checking. Here's a common variation — BFS with state-dependent moves:

<div class="code-group">

```python
from collections import deque

def bfs_with_constraints(grid, constraints):
    """BFS where moves depend on current state and constraints."""
    rows, cols = len(grid), len(grid[0])
    # State might include position + additional info (keys, status, etc.)
    start_state = (0, 0, "initial_status")

    queue = deque([start_state])
    visited = set([start_state])

    while queue:
        r, c, status = queue.popleft()

        if (r, c) == (rows-1, cols-1):
            return True  # or return steps

        # Get valid moves based on current status
        valid_moves = get_valid_moves(r, c, status, constraints)

        for nr, nc, new_status in valid_moves:
            next_state = (nr, nc, new_status)
            if next_state not in visited:
                visited.add(next_state)
                queue.append(next_state)

    return False

# Time: O(rows * cols * states) — states depend on constraints
# Space: O(rows * cols * states) — visited set size
```

```javascript
function bfsWithConstraints(grid, constraints) {
  const rows = grid.length,
    cols = grid[0].length;
  // State includes position + additional info
  const startState = [0, 0, "initial_status"];

  const queue = [startState];
  const visited = new Set();
  visited.add(startState.toString());

  while (queue.length) {
    const [r, c, status] = queue.shift();

    if (r === rows - 1 && c === cols - 1) {
      return true; // or return steps
    }

    // Get valid moves based on current status
    const validMoves = getValidMoves(r, c, status, constraints);

    for (const [nr, nc, newStatus] of validMoves) {
      const nextState = [nr, nc, newStatus];
      const key = nextState.toString();

      if (!visited.has(key)) {
        visited.add(key);
        queue.push(nextState);
      }
    }
  }

  return false;
}

// Time: O(rows * cols * states) — states depend on constraints
// Space: O(rows * cols * states) — visited set size
```

```java
import java.util.*;

public boolean bfsWithConstraints(int[][] grid, Map<String, Object> constraints) {
    int rows = grid.length, cols = grid[0].length;

    // Custom state class to track position + additional info
    class State {
        int r, c;
        String status;

        State(int r, int c, String status) {
            this.r = r;
            this.c = c;
            this.status = status;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            State state = (State) o;
            return r == state.r && c == state.c &&
                   Objects.equals(status, state.status);
        }

        @Override
        public int hashCode() {
            return Objects.hash(r, c, status);
        }
    }

    State start = new State(0, 0, "initial_status");
    Queue<State> queue = new LinkedList<>();
    Set<State> visited = new HashSet<>();

    queue.offer(start);
    visited.add(start);

    while (!queue.isEmpty()) {
        State current = queue.poll();

        if (current.r == rows-1 && current.c == cols-1) {
            return true;  // or return steps
        }

        // Get valid moves based on current status
        List<State> validMoves = getValidMoves(current, constraints);

        for (State next : validMoves) {
            if (!visited.contains(next)) {
                visited.add(next);
                queue.offer(next);
            }
        }
    }

    return false;
}

// Time: O(rows * cols * states) — states depend on constraints
// Space: O(rows * cols * states) — visited set size
```

</div>

## How ServiceNow Tests Breadth-First Search vs Other Companies

Compared to FAANG companies, ServiceNow's BFS questions tend to be more _applied_ and less _theoretical_. At Google, you might get "Word Ladder" (LeetCode #127) — a pure graph search problem. At ServiceNow, you'll get "Word Ladder" but framed as "find the minimum configuration changes to transform System A into System B, where each change must be valid according to our compatibility matrix."

The difficulty level is typically medium — they're testing whether you can recognize the BFS pattern and implement it correctly with business logic constraints, not whether you can derive novel graph algorithms. The unique aspect is the _domain translation_: can you map their business scenario (ticket routing, dependency graphs, workflow steps) to a graph traversal problem?

## Study Order

1. **Basic BFS on Grids** — Start with "Number of Islands" (LeetCode #200) and "Rotting Oranges" (LeetCode #994). These teach you the fundamental queue-based traversal pattern.

2. **Shortest Path in Unweighted Graphs** — Move to "Shortest Path in Binary Matrix" (LeetCode #1091) and "Open the Lock" (LeetCode #752). These introduce the distance tracking aspect.

3. **Level-Order Traversal** — Practice "Binary Tree Level Order Traversal" (LeetCode #102) and "N-ary Tree Level Order Traversal" (LeetCode #429). ServiceNow often applies this pattern to organizational hierarchies.

4. **Multi-Source BFS** — Master "01 Matrix" (LeetCode #542) and "As Far from Land as Possible" (LeetCode #1162). These model parallel propagation scenarios common in workflow systems.

5. **BFS with State/Constraints** — Finally, tackle "Shortest Path to Get All Keys" (LeetCode #864) and "Sliding Puzzle" (LeetCode #773). These most closely resemble ServiceNow's constraint-heavy problems.

This order works because each step builds on the previous one while adding complexity. You learn the pattern first, then distance tracking, then level processing, then multiple sources, and finally state management.

## Recommended Practice Order

1. "Number of Islands" (LeetCode #200) — Basic BFS/DFS recognition
2. "Rotting Oranges" (LeetCode #994) — Multi-source BFS introduction
3. "Shortest Path in Binary Matrix" (LeetCode #1091) — Grid BFS with distance
4. "Open the Lock" (LeetCode #752) — BFS on implicit graph
5. "01 Matrix" (LeetCode #542) — Multi-source BFS with distance
6. "Word Ladder" (LeetCode #127) — BFS on word graph (common ServiceNow pattern)
7. "Shortest Path to Get All Keys" (LeetCode #864) — BFS with state constraints
8. "Sliding Puzzle" (LeetCode #773) — BFS on state space (advanced)

After these eight, you'll have covered every BFS pattern ServiceNow uses. The key is to practice explaining _why_ BFS is appropriate for each problem and how you'd adapt it for their business constraints.

[Practice Breadth-First Search at ServiceNow](/company/servicenow/breadth-first-search)
