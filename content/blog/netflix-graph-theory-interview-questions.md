---
title: "Graph Theory Questions at Netflix: What to Expect"
description: "Prepare for Graph Theory interview questions at Netflix — patterns, difficulty breakdown, and study tips."
date: "2030-09-29"
category: "dsa-patterns"
tags: ["netflix", "graph-theory", "interview prep"]
---

Graph Theory at Netflix isn't just another topic on a checklist—it's a direct reflection of their core business. When you're dealing with a content graph where movies are nodes and user interactions (watches, likes, skips) are weighted edges, or modeling a global network of servers and content delivery paths, graph thinking is essential. Out of their roughly 30 coding questions, 4 being Graph Theory is significant; it means you have a ~13% chance of hitting one in any given interview loop. This isn't a "nice to have." It's a "must be prepared for" topic, especially for roles touching backend services, data infrastructure, or recommendation systems. The questions aren't abstract academic puzzles; they're often simplified versions of real problems: finding the most efficient way to propagate a new feature across service clusters, or determining if all users in a social-like "watch party" feature are connected.

## Specific Patterns Netflix Favors

Netflix's Graph Theory questions tend to cluster around **practical traversal and connectivity problems** rather than complex theoretical algorithms. You're more likely to see:

1.  **Multi-source BFS/DFS for "infection" or "propagation" scenarios.** Think: "Given a list of servers that have already updated, how long until all connected servers are updated?" This mirrors feature rollouts.
2.  **Union-Find (Disjoint Set Union) for dynamic connectivity.** Questions about determining if all users in a group are connected via friendships, or if adding a new edge (a new CDN route) would create a redundant/undesirable cycle in the network.
3.  **Topological Sorting for dependency resolution.** This is classic for build systems or task scheduling, which maps to internal tooling or determining the order of content encoding/processing jobs.

You will _rarely_ see complex shortest-path algorithms like Floyd-Warshall or advanced max-flow problems. The focus is on clean, correct implementation of fundamental patterns applied to a business-context wrapper. A quintessential Netflix-style problem is **LeetCode #286 "Walls and Gates"** (multi-source BFS) or **LeetCode #261 "Graph Valid Tree"** (Union-Find or DFS cycle detection).

## How to Prepare

The key is to internalize the three core patterns so you can identify and implement them under pressure. Let's look at the most critical one: **Multi-source BFS**. The standard BFS starts from one node. The multi-source variant initializes the queue with _all_ "source" nodes at distance 0. This perfectly models parallel propagation.

<div class="code-group">

```python
from collections import deque
from typing import List

def walls_and_gates(rooms: List[List[int]]) -> None:
    """
    LeetCode #286. -1 = wall, 0 = gate, INF = empty room.
    Fill each INF with distance to nearest gate.
    Time: O(m*n) | Space: O(m*n) for the queue in worst case.
    """
    if not rooms:
        return

    ROWS, COLS = len(rooms), len(rooms[0])
    queue = deque()
    INF = 2**31 - 1

    # Multi-source initialization: all gates go into the queue.
    for r in range(ROWS):
        for c in range(COLS):
            if rooms[r][c] == 0:
                queue.append((r, c))

    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    while queue:
        row, col = queue.popleft()
        for dr, dc in directions:
            new_r, new_c = row + dr, col + dc
            # If in bounds and is an empty room (INF).
            if (0 <= new_r < ROWS and 0 <= new_c < COLS and
                rooms[new_r][new_c] == INF):
                rooms[new_r][new_c] = rooms[row][col] + 1
                queue.append((new_r, new_c))
```

```javascript
/**
 * @param {number[][]} rooms
 * @return {void} Do not return anything, modify rooms in-place instead.
 */
function wallsAndGates(rooms) {
  // Time: O(m*n) | Space: O(m*n)
  if (!rooms.length) return;

  const ROWS = rooms.length;
  const COLS = rooms[0].length;
  const queue = [];
  const INF = 2 ** 31 - 1;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // Multi-source init
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (rooms[r][c] === 0) {
        queue.push([r, c]);
      }
    }
  }

  while (queue.length) {
    const [row, col] = queue.shift();
    for (const [dr, dc] of dirs) {
      const newR = row + dr;
      const newC = col + dc;
      if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS && rooms[newR][newC] === INF) {
        rooms[newR][newC] = rooms[row][col] + 1;
        queue.push([newR, newC]);
      }
    }
  }
}
```

```java
public class Solution {
    public void wallsAndGates(int[][] rooms) {
        // Time: O(m*n) | Space: O(m*n)
        if (rooms.length == 0) return;
        int ROWS = rooms.length;
        int COLS = rooms[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int INF = Integer.MAX_VALUE;
        int[][] dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};

        // Multi-source init
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                if (rooms[r][c] == 0) {
                    queue.offer(new int[]{r, c});
                }
            }
        }

        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int row = cell[0];
            int col = cell[1];
            for (int[] d : dirs) {
                int newR = row + d[0];
                int newC = col + d[1];
                if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS &&
                    rooms[newR][newC] == INF) {
                    rooms[newR][newC] = rooms[row][col] + 1;
                    queue.offer(new int[]{newR, newC});
                }
            }
        }
    }
}
```

</div>

For **Union-Find**, you must have a bug-free template memorized. Netflix questions often test the "dynamic connectivity" aspect.

<div class="code-group">

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [1] * n
        self.count = n  # Number of distinct components

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        rootX, rootY = self.find(x), self.find(y)
        if rootX == rootY:
            return False  # Already connected, may indicate a cycle

        # Union by rank
        if self.rank[rootX] < self.rank[rootY]:
            self.parent[rootX] = rootY
        elif self.rank[rootX] > self.rank[rootY]:
            self.parent[rootY] = rootX
        else:
            self.parent[rootY] = rootX
            self.rank[rootX] += 1
        self.count -= 1
        return True

def valid_tree(n, edges):
    """
    LeetCode #261. A valid tree has no cycles and is fully connected.
    Time: O(n * α(n)) ~ O(n) | Space: O(n)
    """
    if len(edges) != n - 1:
        return False  # A tree must have exactly n-1 edges

    uf = UnionFind(n)
    for a, b in edges:
        if not uf.union(a, b):
            return False  # Cycle detected
    return uf.count == 1
```

```javascript
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(1);
    this.count = n;
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    let rootX = this.find(x);
    let rootY = this.find(y);
    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    this.count--;
    return true;
  }
}

function validTree(n, edges) {
  // Time: O(n * α(n)) | Space: O(n)
  if (edges.length !== n - 1) return false;

  const uf = new UnionFind(n);
  for (const [a, b] of edges) {
    if (!uf.union(a, b)) return false;
  }
  return uf.count === 1;
}
```

```java
class UnionFind {
    private int[] parent;
    private int[] rank;
    private int count;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 1;
        }
    }

    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return false;

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        count--;
        return true;
    }

    public int getCount() { return count; }
}

public class Solution {
    public boolean validTree(int n, int[][] edges) {
        // Time: O(n * α(n)) | Space: O(n)
        if (edges.length != n - 1) return false;
        UnionFind uf = new UnionFind(n);
        for (int[] edge : edges) {
            if (!uf.union(edge[0], edge[1])) return false;
        }
        return uf.getCount() == 1;
    }
}
```

</div>

## How Netflix Tests Graph Theory vs Other Companies

Netflix's approach is distinct. At companies like Google or Meta, you might get a graph problem that is a clever reduction to a known algorithm (e.g., "this is actually a max-flow problem"). At Netflix, the graph _is_ the obvious data structure, and the problem is about applying a standard traversal or connectivity algorithm correctly and efficiently. The difficulty is **medium**, not hard. The unique aspect is the **emphasis on clean, production-ready code**. They care about edge cases (null inputs, single-node graphs, cycles) and your ability to explain _why_ BFS is better than DFS for shortest path in an unweighted graph (BFS explores level-by-level). They are testing for fundamental engineering rigor on problems that mirror their domain.

## Study Order

1.  **Graph Representations & Basic Traversal:** Understand adjacency lists vs matrices. Master recursive DFS and iterative BFS on both implicit (grid) and explicit graphs. This is non-negotiable foundation.
2.  **Cycle Detection & Connectivity:** Learn to detect cycles in undirected (DFS with parent pointer or Union-Find) and directed graphs (DFS with recursion stack or topological sort). This leads directly into...
3.  **Union-Find (Disjoint Set Union):** Memorize the optimized template with path compression and union by rank. Practice on dynamic connectivity problems.
4.  **Topological Sort:** Implement via Kahn's Algorithm (BFS-based) and DFS-based post-order reversal. Understand it's for directed _acyclic_ graphs (DAGs).
5.  **Shortest Path in Unweighted Graphs:** This is just BFS. Multi-source BFS is a simple but critical extension.
6.  **(Optional) Dijkstra's Algorithm:** Only if you have time. Netflix is less likely to ask weighted shortest path, but it's a classic.

Do not jump to step 5 or 6 without absolute fluency in steps 1-3.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous pattern.

1.  **LeetCode #200 "Number of Islands"** (DFS/BFS on implicit grid).
2.  **LeetCode #133 "Clone Graph"** (BFS/DFS on explicit graph, handling cycles).
3.  **LeetCode #261 "Graph Valid Tree"** (Apply Union-Find or DFS for cycle/connectivity).
4.  **LeetCode #323 "Number of Connected Components in an Undirected Graph"** (Direct Union-Find application).
5.  **LeetCode #207 "Course Schedule"** (Topological Sort for cycle detection in directed graph).
6.  **LeetCode #286 "Walls and Gates"** (Multi-source BFS - the most Netflix-core problem here).
7.  **LeetCode #994 "Rotting Oranges"** (Another excellent multi-source BFS variant).

This sequence takes you from foundational traversal to the specific patterns Netflix favors. If you can solve #286 and #261 confidently and explain your code clearly, you're in a strong position for their graph theory questions.

[Practice Graph Theory at Netflix](/company/netflix/graph-theory)
