---
title: "Breadth-First Search Questions at Adobe: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Adobe — patterns, difficulty breakdown, and study tips."
date: "2027-08-24"
category: "dsa-patterns"
tags: ["adobe", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Adobe: What to Expect

Adobe's technical interviews have a distinct flavor. With 23 Breadth-First Search (BFS) questions out of their 227 total problems on LeetCode (about 10% of their question bank), BFS isn't just a random topic—it's a core assessment area. Why? Because Adobe builds complex creative tools, content management systems, and marketing platforms where hierarchical data structures, UI component trees, and network-like dependencies are everywhere. When they ask BFS questions, they're testing your ability to think in layers—exactly how you'd need to process document object models, dependency graphs, or permission hierarchies in real Adobe products.

In actual interviews, you'll encounter BFS problems in about 1 in 3 technical rounds at Adobe. They're not just looking for rote traversal; they're assessing whether you understand when BFS is the right tool (shortest path in unweighted graphs, level-order processing, minimum steps problems) versus when DFS would be more appropriate. The difference between passing and excelling often comes down to recognizing the pattern variations Adobe favors.

## Specific Patterns Adobe Favors

Adobe's BFS questions cluster around three specific patterns that mirror their engineering needs:

1. **Multi-source BFS for shortest path in grids** — Think problems like "Walls and Gates" (#286) or "Shortest Path to Get Food" (#1730). Adobe loves these because they model real scenarios: finding the nearest available server in a content delivery network, or calculating minimum clicks through a nested menu system. The key insight is initializing the queue with _all_ starting points simultaneously.

2. **Level-order traversal with state tracking** — Problems like "Binary Tree Vertical Order Traversal" (#314) or "Shortest Path in a Grid with Obstacles Elimination" (#1293). Adobe's interviewers often extend basic BFS to include additional state (remaining obstacle breaks, direction traveled, or visited nodes under specific conditions). This tests your ability to manage complexity in the queue elements themselves.

3. **BFS on implicit graphs** — Rather than explicit node-edge structures, Adobe frequently uses problems where you construct the graph on-the-fly. "Word Ladder" (#127) is their classic example—you're not given a graph, but must recognize that words connected by single-letter changes form an implicit graph where BFS finds the shortest transformation sequence.

What's notably _absent_ from Adobe's preferred BFS problems? Pure theoretical graph theory. You won't see complex cycle detection or strongly connected components—those are more common at pure infrastructure companies. Adobe's BFS questions almost always have a tangible, product-adjacent feel.

## How to Prepare

The most common mistake candidates make is treating all BFS problems the same. Adobe specifically looks for your ability to adapt the core algorithm to their pattern variations. Let's examine the multi-source BFS pattern—arguably their most frequently tested variation:

<div class="code-group">

```python
from collections import deque
from typing import List

def walls_and_gates(rooms: List[List[int]]) -> None:
    """
    LeetCode #286: Fill each empty room with the distance to nearest gate.
    INF represents empty room, 0 represents gate, -1 represents wall.
    Multi-source BFS: Start from all gates simultaneously.
    Time: O(m*n) | Space: O(m*n) for the queue in worst case
    """
    if not rooms:
        return

    m, n = len(rooms), len(rooms[0])
    queue = deque()
    INF = 2**31 - 1

    # Initialize queue with all gates (multi-source)
    for i in range(m):
        for j in range(n):
            if rooms[i][j] == 0:
                queue.append((i, j))

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue:
        row, col = queue.popleft()

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check bounds and if it's an empty room
            if (0 <= new_row < m and 0 <= new_col < n and
                rooms[new_row][new_col] == INF):
                rooms[new_row][new_col] = rooms[row][col] + 1
                queue.append((new_row, new_col))
```

```javascript
/**
 * LeetCode #286: Walls and Gates
 * Time: O(m*n) | Space: O(m*n) for the queue in worst case
 */
function wallsAndGates(rooms) {
  if (!rooms || rooms.length === 0) return;

  const m = rooms.length,
    n = rooms[0].length;
  const queue = [];
  const INF = 2 ** 31 - 1;
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

  while (queue.length > 0) {
    const [row, col] = queue.shift();

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n && rooms[newRow][newCol] === INF) {
        rooms[newRow][newCol] = rooms[row][col] + 1;
        queue.push([newRow, newCol]);
      }
    }
  }
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

// LeetCode #286: Walls and Gates
// Time: O(m*n) | Space: O(m*n) for the queue in worst case
public class Solution {
    public void wallsAndGates(int[][] rooms) {
        if (rooms == null || rooms.length == 0) return;

        int m = rooms.length, n = rooms[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int INF = Integer.MAX_VALUE;
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        // Add all gates to the queue
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (rooms[i][j] == 0) {
                    queue.offer(new int[]{i, j});
                }
            }
        }

        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int row = cell[0], col = cell[1];

            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                if (newRow >= 0 && newRow < m &&
                    newCol >= 0 && newCol < n &&
                    rooms[newRow][newCol] == INF) {
                    rooms[newRow][newCol] = rooms[row][col] + 1;
                    queue.offer(new int[]{newRow, newCol});
                }
            }
        }
    }
}
```

</div>

The critical insight here: by starting BFS from _all_ gates simultaneously, we ensure each room gets filled with the distance to its _nearest_ gate in optimal time complexity. Single-source BFS from each gate would be O(k*m*n) for k gates—much less efficient.

Now let's look at the level-order traversal with state tracking pattern, which appears in problems like "Shortest Path in a Grid with Obstacles Elimination":

<div class="code-group">

```python
from collections import deque
from typing import List

def shortestPath(grid: List[List[int]], k: int) -> int:
    """
    LeetCode #1293: Shortest path from top-left to bottom-right
    where you can eliminate up to k obstacles.
    Time: O(m*n*k) | Space: O(m*n*k) for visited states
    """
    if not grid:
        return -1

    m, n = len(grid), len(grid[0])
    # Early exit: if we can eliminate enough obstacles to take direct path
    if k >= m + n - 2:
        return m + n - 2

    # Queue elements: (row, col, remaining_eliminations)
    queue = deque([(0, 0, k, 0)])  # (r, c, k, steps)
    visited = set()
    visited.add((0, 0, k))

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue:
        row, col, remaining, steps = queue.popleft()

        # Check if we reached the destination
        if row == m - 1 and col == n - 1:
            return steps

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            if 0 <= new_row < m and 0 <= new_col < n:
                new_remaining = remaining - grid[new_row][new_col]

                if new_remaining >= 0 and (new_row, new_col, new_remaining) not in visited:
                    visited.add((new_row, new_col, new_remaining))
                    queue.append((new_row, new_col, new_remaining, steps + 1))

    return -1
```

```javascript
/**
 * LeetCode #1293: Shortest Path in a Grid with Obstacles Elimination
 * Time: O(m*n*k) | Space: O(m*n*k) for visited states
 */
function shortestPath(grid, k) {
  if (!grid || grid.length === 0) return -1;

  const m = grid.length,
    n = grid[0].length;
  // If we can eliminate enough to take the Manhattan path
  if (k >= m + n - 2) return m + n - 2;

  const queue = [[0, 0, k, 0]]; // [row, col, remaining, steps]
  const visited = new Set();
  visited.add(`0,0,${k}`);
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0) {
    const [row, col, remaining, steps] = queue.shift();

    if (row === m - 1 && col === n - 1) {
      return steps;
    }

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n) {
        const newRemaining = remaining - grid[newRow][newCol];
        const key = `${newRow},${newCol},${newRemaining}`;

        if (newRemaining >= 0 && !visited.has(key)) {
          visited.add(key);
          queue.push([newRow, newCol, newRemaining, steps + 1]);
        }
      }
    }
  }

  return -1;
}
```

```java
import java.util.*;

// LeetCode #1293: Shortest Path in a Grid with Obstacles Elimination
// Time: O(m*n*k) | Space: O(m*n*k) for visited states
public class Solution {
    public int shortestPath(int[][] grid, int k) {
        if (grid == null || grid.length == 0) return -1;

        int m = grid.length, n = grid[0].length;
        // If we can eliminate enough obstacles for direct path
        if (k >= m + n - 2) return m + n - 2;

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, k, 0}); // row, col, remaining, steps
        boolean[][][] visited = new boolean[m][n][k + 1];
        visited[0][0][k] = true;
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0], col = current[1];
            int remaining = current[2], steps = current[3];

            if (row == m - 1 && col == n - 1) {
                return steps;
            }

            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n) {
                    int newRemaining = remaining - grid[newRow][newCol];

                    if (newRemaining >= 0 && !visited[newRow][newCol][newRemaining]) {
                        visited[newRow][newCol][newRemaining] = true;
                        queue.offer(new int[]{newRow, newCol, newRemaining, steps + 1});
                    }
                }
            }
        }

        return -1;
    }
}
```

</div>

Notice how the state `(row, col, remaining_eliminations)` becomes part of our visited tracking. This is the pattern Adobe interviewers want to see: you're not just tracking visited positions, but visited _states_. Missing this distinction is why many candidates fail Adobe's BFS questions despite knowing basic traversal.

## How Adobe Tests Breadth-First Search vs Other Companies

Adobe's BFS questions differ from other tech companies in three key ways:

1. **Product context over pure algorithms** — While Google might ask abstract BFS on random graphs, Adobe's problems often have a thin veneer of product relevance: "nearest server" (multi-source BFS), "document navigation" (level-order traversal), or "feature dependency resolution" (topological BFS).

2. **Moderate difficulty with one clever twist** — Facebook/Meta tends toward extremely difficult BFS problems; Amazon leans toward easier, more practical ones. Adobe sits in the middle: their BFS questions are usually medium-difficulty with _one_ non-obvious insight required (like the multi-source initialization or state tracking shown above).

3. **Follow-up questions about optimization** — Adobe interviewers frequently ask: "How would this scale with 10,000 nodes?" or "What if the graph is dynamic?" They're testing whether you think about real-world constraints, not just algorithmic correctness.

## Study Order

Don't jump straight to Adobe's hardest BFS problems. Build systematically:

1. **Basic BFS traversal** — Start with simple level-order traversal (#102) and grid BFS (#200). Master the queue mechanics before adding complexity.
2. **Shortest path in unweighted graphs** — Problems like "Rotting Oranges" (#994) teach you why BFS finds shortest paths naturally.
3. **Multi-source BFS** — This is Adobe's sweet spot. Practice #286 and #542 until the pattern feels natural.
4. **BFS with state tracking** — Add dimensions to your visited set, as in #1293 and #847.
5. **Bidirectional BFS** — For optimization questions, know when two-way search helps (#127 Word Ladder).
6. **0-1 BFS** — Advanced but occasionally tested: when weights are only 0 or 1, use deque instead of queue.

This order works because each step builds on the previous one. Trying #1293 before mastering multi-source BFS is like trying calculus before algebra.

## Recommended Practice Order

Solve these Adobe-relevant problems in sequence:

1. **Binary Tree Level Order Traversal** (#102) — Pure BFS mechanics
2. **Number of Islands** (#200) — Grid BFS fundamentals
3. **Rotting Oranges** (#994) — Multi-source BFS introduction
4. **Walls and Gates** (#286) — Adobe's classic multi-source pattern
5. **01 Matrix** (#542) — Another multi-source variation
6. **Word Ladder** (#127) — Implicit graph construction
7. **Shortest Path in a Grid with Obstacles Elimination** (#1293) — State tracking
8. **Sliding Puzzle** (#773) — BFS on complex state spaces
9. **Shortest Path Visiting All Nodes** (#847) — Advanced state tracking

After completing this sequence, you'll have covered every BFS pattern Adobe tests. The key is recognizing which pattern you're facing within the first minute of reading a new problem.

[Practice Breadth-First Search at Adobe](/company/adobe/breadth-first-search)
