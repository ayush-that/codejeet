---
title: "Graph Theory Questions at MakeMyTrip: What to Expect"
description: "Prepare for Graph Theory interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-17"
category: "dsa-patterns"
tags: ["makemytrip", "graph-theory", "interview prep"]
---

Graph Theory at MakeMyTrip isn't just another topic on a checklist — it's a direct reflection of their core business. As India's largest online travel company, their systems constantly model networks: flight routes (graphs where cities are nodes and flights are edges), hotel recommendations (bipartite graphs connecting users to properties), and package itineraries (paths with constraints). With 3 out of 24 questions dedicated to Graph Theory in their question bank, it represents about 12.5% of their technical focus. In real interviews, you're likely to encounter at least one graph problem, especially for backend, full-stack, or data engineering roles. They don't ask graph theory for academic reasons; they ask because you'll be optimizing these structures on the job.

## Specific Patterns MakeMyTrip Favors

MakeMyTrip's graph problems lean heavily toward **applied graph traversal with real-world constraints**, not abstract mathematical theory. You won't see complex proofs or advanced algorithms like max-flow. Instead, expect problems that mirror travel logistics. Their favorite patterns are:

1. **Multi-source BFS for geographical spread**: Think "cheapest flights within K stops" but adapted to their domain. Problems where you need to find the shortest path from multiple starting points (e.g., flights departing from several hub cities).
2. **DFS/BFS on implicit graphs**: The graph isn't given as an adjacency list; you derive it from a 2D grid or a set of rules. This models scenarios like seating arrangements on planes or hotel room connectivity.
3. **Union-Find for connectivity checks**: Determining if cities are connected via flights, or if user groups can be merged — classic disjoint-set union applications.

A quintessential MakeMyTrip-style problem is **"Number of Islands" (LeetCode #200)** but with a twist: instead of counting islands, you might need to find the largest "connected hotel cluster" or determine if two specific cities are connected via flights with layover constraints. Another common pattern is **"Rotting Oranges" (LeetCode #994)**, which is essentially multi-source BFS — perfect for modeling the spread of flight delays or availability updates across a network.

## How to Prepare

Master the traversal patterns, but always think about the travel industry angle. When practicing, ask yourself: "How would this apply to flights, hotels, or packages?" Here's the core BFS/DFS template you must internalize, with the flexibility to handle MakeMyTrip's constraints.

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(grid, start, target):
    """
    Find shortest path in a 2D grid (implicit graph).
    Models: finding shortest layover route between cities.
    """
    if not grid:
        return -1

    rows, cols = len(grid), len(grid[0])
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    queue = deque([(start[0], start[1], 0)])  # (row, col, distance)
    visited = set([(start[0], start[1])])

    while queue:
        row, col, dist = queue.popleft()

        if (row, col) == target:
            return dist

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            # Key MakeMyTrip constraint: often a validity check
            if (0 <= new_row < rows and 0 <= new_col < cols and
                grid[new_row][new_col] != 'BLOCKED' and  # e.g., no flight route
                (new_row, new_col) not in visited):
                visited.add((new_row, new_col))
                queue.append((new_row, new_col, dist + 1))

    return -1  # No path exists

# Time: O(rows * cols) | Space: O(rows * cols)
```

```javascript
function bfsShortestPath(grid, start, target) {
  // Find shortest path in a 2D grid (implicit graph).
  // Models: finding shortest layover route between cities.
  if (!grid || grid.length === 0) return -1;

  const rows = grid.length,
    cols = grid[0].length;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const queue = [[start[0], start[1], 0]]; // [row, col, distance]
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();

    if (row === target[0] && col === target[1]) {
      return dist;
    }

    for (const [dr, dc] of directions) {
      const newRow = row + dr,
        newCol = col + dc;
      // Key MakeMyTrip constraint: often a validity check
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] !== "BLOCKED" && // e.g., no flight route
        !visited.has(`${newRow},${newCol}`)
      ) {
        visited.add(`${newRow},${newCol}`);
        queue.push([newRow, newCol, dist + 1]);
      }
    }
  }

  return -1; // No path exists
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

```java
import java.util.*;

public class GraphTraversal {
    public int bfsShortestPath(char[][] grid, int[] start, int[] target) {
        // Find shortest path in a 2D grid (implicit graph).
        // Models: finding shortest layover route between cities.
        if (grid == null || grid.length == 0) return -1;

        int rows = grid.length, cols = grid[0].length;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{start[0], start[1], 0});
        boolean[][] visited = new boolean[rows][cols];
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0], col = current[1], dist = current[2];

            if (row == target[0] && col == target[1]) {
                return dist;
            }

            for (int[] dir : directions) {
                int newRow = row + dir[0], newCol = col + dir[1];
                // Key MakeMyTrip constraint: often a validity check
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols &&
                    grid[newRow][newCol] != 'BLOCKED' &&  // e.g., no flight route
                    !visited[newRow][newCol]) {
                    visited[newRow][newCol] = true;
                    queue.offer(new int[]{newRow, newCol, dist + 1});
                }
            }
        }

        return -1;  // No path exists
    }
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

For Union-Find, which frequently appears in connectivity problems, here's the optimized template:

<div class="code-group">

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [1] * n

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False

        # Union by rank
        if self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        elif self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True

# Time for m operations: O(m * α(n)) where α is inverse Ackermann (near constant)
# Space: O(n)
```

```javascript
class UnionFind {
  constructor(n) {
    this.parent = new Array(n);
    this.rank = new Array(n).fill(1);
    for (let i = 0; i < n; i++) this.parent[i] = i;
  }

  find(x) {
    // Path compression
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x),
      rootY = this.find(y);
    if (rootX === rootY) return false;

    // Union by rank
    if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}

// Time for m operations: O(m * α(n)) where α is inverse Ackermann (near constant)
// Space: O(n)
```

```java
class UnionFind {
    private int[] parent;
    private int[] rank;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 1;
        }
    }

    public int find(int x) {
        // Path compression
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) return false;

        // Union by rank
        if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }
}

// Time for m operations: O(m * α(n)) where α is inverse Ackermann (near constant)
// Space: O(n)
```

</div>

## How MakeMyTrip Tests Graph Theory vs Other Companies

Unlike FAANG companies that might ask abstract graph algorithms (e.g., Dijkstra's with complex heaps or topological sort with exotic constraints), MakeMyTrip keeps it practical. Their questions are **medium difficulty with clear real-world analogs**. Compare this to:

- **Google**: Might ask advanced graph theory (max-flow, min-cut) or complex modifications to standard algorithms.
- **Amazon**: Leans toward BFS/DFS on trees more than general graphs, often with OOP design intertwined.
- **Uber**: Asks shortest path problems (Dijkstra's, A\*) but with heavy emphasis on real-time constraints and scalability.

MakeMyTrip's uniqueness is the **travel domain wrapper**. The problem statement will likely involve flights, hotels, itineraries, or geographical data. The core algorithm is standard, but you must extract the graph from the domain description. They test your ability to map a business problem to a computational solution — a critical skill for their engineers.

## Study Order

1. **Graph Representation & Basic Traversal** — Before anything else, understand adjacency lists vs. matrices, and when to use BFS (shortest path in unweighted graphs) vs. DFS (connectivity, cycles). This is non-negotiable foundation.
2. **Union-Find (Disjoint Set Union)** — Learn this early because it's simple yet powerful for connectivity questions. It frequently appears as a sub-problem or alternative solution.
3. **Shortest Path in Unweighted Graphs (BFS)** — Master multi-source BFS and bidirectional BFS. MakeMyTrip loves problems where multiple starting points exist (e.g., flights from multiple hubs).
4. **DFS on Implicit Graphs** — Practice converting 2D grids into graphs. This is where "Number of Islands" style problems live.
5. **Topological Sort** — While less common, it appears in itinerary or dependency problems (e.g., "course schedule" adapted to package tours).
6. **Dijkstra's Algorithm** — Study this last because MakeMyTrip rarely asks weighted shortest path. If they do, it's usually a straightforward application.

This order builds from fundamentals to specifics, ensuring you don't try to run before you can walk. Each topic logically supports the next.

## Recommended Practice Order

Solve these problems in sequence, focusing on the pattern rather than just getting the answer:

1. **Number of Islands (LeetCode #200)** — DFS/BFS on implicit graphs. Ask: "What if islands were connected hotel clusters?"
2. **Rotting Oranges (LeetCode #994)** — Multi-source BFS. Think: "How would this model flight delay propagation?"
3. **Redundant Connection (LeetCode #684)** — Union-Find basics. Consider: "What if edges were flight routes and we need to find the redundant one?"
4. **Shortest Path in Binary Matrix (LeetCode #1091)** — BFS with obstacles. Imagine: "Finding the quickest layover path with blocked routes."
5. **Course Schedule (LeetCode #207)** — Topological sort. Adapt to: "Can you complete these tour packages given prerequisites?"
6. **Cheapest Flights Within K Stops (LeetCode #787)** — BFS with constraints. This is essentially a MakeMyTrip problem in disguise.

After these six, you'll have covered 90% of what MakeMyTrip asks in graph theory. Remember to always verbalize the travel industry connection during your interview — it shows you understand why they're asking.

[Practice Graph Theory at MakeMyTrip](/company/makemytrip/graph-theory)
