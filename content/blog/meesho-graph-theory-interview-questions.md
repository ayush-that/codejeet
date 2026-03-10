---
title: "Graph Theory Questions at Meesho: What to Expect"
description: "Prepare for Graph Theory interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-11-27"
category: "dsa-patterns"
tags: ["meesho", "graph-theory", "interview prep"]
---

Graph Theory at Meesho isn't the most frequent topic—with only 4 out of 44 tagged problems on their company page—but that's precisely why it's dangerous to ignore. In a marketplace platform built on networks of suppliers, resellers, and customers, graph concepts underpin features like recommendation systems ("users who bought this also viewed"), fraud detection in transaction networks, and inventory routing. When a Graph Theory question does appear in an interview, it's rarely a simple adjacency list traversal. They use it as a filter: candidates who can't handle their graph problems likely struggle with the interconnected, stateful logic that their backend systems require daily.

## Specific Patterns Meesho Favors

Meesho's graph problems consistently lean toward **applied graph traversal with a twist**. You won't get abstract theory questions about planar graphs. Instead, you'll get problems where the graph is implicit in the problem statement, and the core challenge is modeling the scenario correctly before applying BFS/DFS.

The most common pattern is **Multi-Source BFS for shortest path in a grid or network state**. Think "rotten oranges" or "walls and gates" style problems, but often with an additional constraint layer, like time, cost, or a state flag (e.g., a key to pick up). They also show a preference for **DFS-based backtracking on implicit graphs**, like finding all paths or configurations under certain rules.

For example, a classic Meesho-style problem might be **LeetCode 752. Open the Lock**—it's a shortest path problem where each lock combination is a node, and each single-digit turn is an edge. The "twist" is the deadends. Another is **LeetCode 994. Rotting Oranges**, the quintessential multi-source BFS grid problem.

Here’s the core Multi-Source BFS pattern for a grid:

<div class="code-group">

```python
from collections import deque
from typing import List

def orangesRotting(grid: List[List[int]]) -> int:
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    minutes = 0

    # Multi-source initialization: find all rotten oranges
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    # If no fresh oranges, time is already 0
    if fresh_count == 0:
        return 0

    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    # BFS in layers to track minutes
    while queue and fresh_count > 0:
        minutes += 1
        # Process all nodes at the current minute/distance layer
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2  # Mark as rotten
                    queue.append((nr, nc))
                    fresh_count -= 1

    return minutes if fresh_count == 0 else -1

# Time: O(rows * cols) | Space: O(rows * cols) for the queue in worst case
```

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function (grid) {
  if (!grid.length) return 0;

  const rows = grid.length,
    cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;

  // Multi-source initialization
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

  while (queue.length && freshCount > 0) {
    minutes++;
    // Process layer by layer
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
  }

  return freshCount === 0 ? minutes : -1;
};

// Time: O(rows * cols) | Space: O(rows * cols)
```

```java
import java.util.LinkedList;
import java.util.Queue;

class Solution {
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int rows = grid.length, cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;
        int minutes = 0;

        // Multi-source initialization
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
            minutes++;
            int layerSize = queue.size();
            for (int i = 0; i < layerSize; i++) {
                int[] cell = queue.poll();
                int r = cell[0], c = cell[1];
                for (int[] dir : directions) {
                    int nr = r + dir[0], nc = c + dir[1];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        queue.offer(new int[]{nr, nc});
                        freshCount--;
                    }
                }
            }
        }

        return freshCount == 0 ? minutes : -1;
    }
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

## How to Prepare

Your preparation should focus on fluency, not breadth. Master the two core patterns (Multi-Source BFS and DFS Backtracking) until you can derive the solution from a fresh problem statement in under 10 minutes. For each practice problem, explicitly write out:

1. What constitutes a "node" in this graph?
2. What constitutes an "edge"?
3. Is the graph directed or undirected?
4. What is the "cost" or "weight" of moving between nodes? (Often it's 1).

Then, map it to your pattern. The code example above is your template for any "simultaneous spread from multiple sources" problem.

For DFS backtracking, here's a compact template for finding all paths:

<div class="code-group">

```python
from typing import List

def findAllPaths(graph: List[List[int]]) -> List[List[int]]:
    def dfs(node: int, path: List[int]):
        # Base case: if we reach the target (often the last node)
        if node == len(graph) - 1:
            result.append(path.copy())
            return

        for neighbor in graph[node]:
            path.append(neighbor)
            dfs(neighbor, path)
            path.pop()  # Backtrack

    result = []
    dfs(0, [0])  # Start from node 0 with initial path
    return result

# Time: O(2^V * V) in worst case for a dense graph | Space: O(V) for recursion depth and path
```

```javascript
/**
 * @param {number[][]} graph
 * @return {number[][]}
 */
var findAllPaths = function (graph) {
  const result = [];

  function dfs(node, path) {
    if (node === graph.length - 1) {
      result.push([...path]);
      return;
    }

    for (const neighbor of graph[node]) {
      path.push(neighbor);
      dfs(neighbor, path);
      path.pop(); // Backtrack
    }
  }

  dfs(0, [0]);
  return result;
};

// Time: O(2^V * V) | Space: O(V)
```

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> findAllPaths(int[][] graph) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        path.add(0);
        dfs(graph, 0, path, result);
        return result;
    }

    private void dfs(int[][] graph, int node, List<Integer> path, List<List<Integer>> result) {
        if (node == graph.length - 1) {
            result.add(new ArrayList<>(path));
            return;
        }

        for (int neighbor : graph[node]) {
            path.add(neighbor);
            dfs(graph, neighbor, path, result);
            path.remove(path.size() - 1); // Backtrack
        }
    }
}

// Time: O(2^V * V) | Space: O(V)
```

</div>

## How Meesho Tests Graph Theory vs Other Companies

At large tech companies (FAANG), Graph Theory questions often test advanced algorithms: Dijkstra's, Bellman-Ford, Union-Find, or topological sort with complex dependency resolution. The expectation is algorithmic rigor.

At Meesho, the style is more **pragmatic and scenario-based**. The difficulty is medium—rarely "hard" by LeetCode standards—but the trick is in the problem modeling. They might describe a feature like "finding the minimum time for a promotional offer to reach all sellers in a network" which is just Multi-Source BFS in disguise. The interviewer will watch closely to see if you jump to coding before properly defining the graph model. What's unique is their occasional blend of a graph traversal with a simple business rule (e.g., "a node can only be visited if you have collected a certain token first"), turning a standard BFS into a state-space search.

## Study Order

1.  **Graph Representation & Basic Traversal:** Understand adjacency lists vs matrices. Implement BFS and DFS on an explicit graph from scratch. This is non-negotiable foundation.
2.  **Grid-based BFS/DFS:** Practice converting a 2D grid into a graph where each cell is a node and movements are edges. Problems like "Number of Islands" (#200).
3.  **Multi-Source BFS:** Learn to initialize your queue with multiple starting points. This is the single most important pattern for Meesho.
4.  **Shortest Path in Unweighted Graphs:** BFS naturally finds the shortest path when edges are unweighted. Practice this on implicit graphs (like the lock problem).
5.  **DFS with Backtracking:** For problems asking "find all possible paths" or "explore all configurations."
6.  **Cycle Detection & Topological Sort:** Only if you have time. This is less frequent but appears in dependency resolution scenarios (e.g., course schedule).

This order works because it builds from concrete traversal to abstract modeling. You can't solve a multi-source problem if you're shaky on standard single-source BFS.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous pattern.

1.  **LeetCode 200. Number of Islands** (Basic grid DFS/BFS)
2.  **LeetCode 994. Rotting Oranges** (Multi-source BFS on a grid)
3.  **LeetCode 752. Open the Lock** (BFS on an implicit graph with forbidden states)
4.  **LeetCode 797. All Paths From Source to Target** (DFS backtracking on a DAG)
5.  **LeetCode 1091. Shortest Path in Binary Matrix** (BFS for shortest path with obstacles)
6.  **LeetCode 286. Walls and Gates** (Another classic multi-source BFS variant)

After this core set, if you want to cover bases, add **LeetCode 207. Course Schedule** (Cycle detection/Topological Sort).

Remember, at Meesho, the goal isn't to impress with algorithmic trivia but to demonstrate you can dissect a real-world network problem and apply the correct, efficient traversal pattern. Your code should be clean, your reasoning about the graph model should be verbalized, and your complexity analysis should be precise.

[Practice Graph Theory at Meesho](/company/meesho/graph-theory)
