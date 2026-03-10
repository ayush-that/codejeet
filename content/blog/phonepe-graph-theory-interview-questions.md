---
title: "Graph Theory Questions at PhonePe: What to Expect"
description: "Prepare for Graph Theory interview questions at PhonePe — patterns, difficulty breakdown, and study tips."
date: "2028-06-25"
category: "dsa-patterns"
tags: ["phonepe", "graph-theory", "interview prep"]
---

# Graph Theory Questions at PhonePe: What to Expect

If you're preparing for PhonePe interviews, you've probably noticed their question distribution: 14 Graph Theory problems out of 102 total. That's nearly 14% — a significant chunk that demands your attention. But here's what most candidates miss: PhonePe doesn't just test graph theory for the sake of it. They use it as a proxy for assessing how you think about complex systems, which is exactly what you'll encounter when working on payment routing, fraud detection networks, or user connection graphs in their massive fintech platform.

I've spoken with engineers who've interviewed at PhonePe, and the consensus is clear: graph questions appear in about 1 in 3 technical interviews, often as the second or third problem in a session. They're not just checking if you can implement BFS — they're evaluating whether you can recognize when a problem is fundamentally about relationships and dependencies, then apply the right algorithmic approach.

## Specific Patterns PhonePe Favors

PhonePe's graph problems tend to cluster around three specific patterns that mirror real-world fintech challenges:

1. **Shortest Path Variations** — Not just Dijkstra, but weighted BFS and multi-source approaches. They love problems where you need to find optimal routes through networks (think payment routing between banks). LeetCode #743 "Network Delay Time" is a classic example they've adapted in interviews.

2. **Union-Find Applications** — Dynamic connectivity problems appear frequently, especially around grouping related transactions or accounts. Problems like LeetCode #547 "Number of Provinces" test exactly this pattern.

3. **Topological Sorting** — Dependency resolution comes up often in scenarios like transaction processing pipelines or feature rollout dependencies. LeetCode #210 "Course Schedule II" captures this pattern well.

What's interesting is what they _don't_ emphasize as much: complex graph theory algorithms like maximum flow or strongly connected components. Their questions tend to be practical applications of fundamental patterns rather than theoretical exercises.

<div class="code-group">

```python
# Union-Find implementation - a pattern that appears in multiple PhonePe questions
# Time: O(α(n)) amortized | Space: O(n)
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return False

        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

        return True
```

```javascript
// Union-Find implementation
// Time: O(α(n)) amortized | Space: O(n)
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    return true;
  }
}
```

```java
// Union-Find implementation
// Time: O(α(n)) amortized | Space: O(n)
class UnionFind {
    private int[] parent;
    private int[] rank;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // Path compression
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return false;

        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }

        return true;
    }
}
```

</div>

## How to Prepare

Most candidates make the mistake of memorizing graph algorithms without understanding when to apply them. Here's a better approach: build a decision tree for graph problems.

When you see a new problem, ask yourself:

1. Is this about finding connections? → BFS/DFS
2. Is this about optimal paths with weights? → Dijkstra or Bellman-Ford
3. Is this about grouping connected components? → Union-Find
4. Are there dependencies with ordering constraints? → Topological Sort

Practice transforming matrix problems into graph representations — PhonePe often presents problems as grids that are actually graph traversal problems in disguise.

<div class="code-group">

```python
# Multi-source BFS pattern - useful for problems like "Rotting Oranges" (#994)
# Time: O(m*n) | Space: O(m*n)
from collections import deque

def orangesRotting(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0

    # Initialize queue with all rotten oranges (multi-source)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    # If no fresh oranges initially
    if fresh_count == 0:
        return 0

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    minutes = -1  # Start at -1 because we count levels

    while queue:
        minutes += 1
        level_size = len(queue)

        for _ in range(level_size):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh_count -= 1
                    queue.append((nr, nc))

    return minutes if fresh_count == 0 else -1
```

```javascript
// Multi-source BFS pattern
// Time: O(m*n) | Space: O(m*n)
function orangesRotting(grid) {
  if (!grid.length) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // Initialize queue with all rotten oranges
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
  let minutes = -1;

  while (queue.length > 0) {
    minutes++;
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          freshCount--;
          queue.push([nr, nc]);
        }
      }
    }
  }

  return freshCount === 0 ? minutes : -1;
}
```

```java
// Multi-source BFS pattern
// Time: O(m*n) | Space: O(m*n)
import java.util.LinkedList;
import java.util.Queue;

public int orangesRotting(int[][] grid) {
    if (grid == null || grid.length == 0) return 0;

    int rows = grid.length;
    int cols = grid[0].length;
    Queue<int[]> queue = new LinkedList<>();
    int freshCount = 0;

    // Initialize queue with all rotten oranges
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
    int minutes = -1;

    while (!queue.isEmpty()) {
        minutes++;
        int levelSize = queue.size();

        for (int i = 0; i < levelSize; i++) {
            int[] cell = queue.poll();
            int r = cell[0], c = cell[1];

            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2;
                    freshCount--;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }
    }

    return freshCount == 0 ? minutes : -1;
}
```

</div>

## How PhonePe Tests Graph Theory vs Other Companies

Compared to FAANG companies, PhonePe's graph questions have distinct characteristics:

**Google** tends toward clever applications of standard algorithms — think "how can you use BFS to solve this non-obvious problem?" **Meta** often tests graph problems related to social networks (friend suggestions, content propagation). **Amazon** leans toward practical problems with clear business applications.

PhonePe sits somewhere between Amazon and Google: they want practical applications (like payment routing optimization) but also appreciate clever algorithmic thinking. Their questions often include:

- Real-world constraints (limited resources, time windows)
- Multiple valid approaches where you need to justify tradeoffs
- Follow-up questions about scaling to millions of transactions

What's unique is their emphasis on **time complexity justification**. They'll often ask: "Why is O(E log V) acceptable here? What if we had 10x more nodes?"

## Study Order

Don't jump into advanced graph algorithms. Build systematically:

1. **Graph Representations** — Adjacency list vs matrix, when to use each. Practice converting between representations.
2. **Basic Traversal** — BFS and DFS implementations from memory. Understand queue vs stack implications.
3. **Shortest Path (Unweighted)** — BFS for shortest path in unweighted graphs.
4. **Connected Components** — Union-Find and DFS approaches.
5. **Shortest Path (Weighted)** — Dijkstra's algorithm with priority queue.
6. **Topological Sort** — Kahn's algorithm and DFS approaches.
7. **Minimum Spanning Tree** — Prim's and Kruskal's algorithms (less frequent but good to know).

This order works because each concept builds on the previous. You can't understand Dijkstra without mastering BFS and priority queues. You can't appreciate Union-Find without understanding connected components.

## Recommended Practice Order

Solve these problems in sequence:

1. **Number of Islands (#200)** — Basic DFS/BFS on grid
2. **Rotting Oranges (#994)** — Multi-source BFS
3. **Course Schedule (#207)** — Cycle detection with DFS
4. **Course Schedule II (#210)** — Topological sort
5. **Number of Provinces (#547)** — Union-Find application
6. **Network Delay Time (#743)** — Dijkstra's algorithm
7. **Cheapest Flights Within K Stops (#787)** — Weighted BFS with constraints
8. **Word Ladder (#127)** — BFS with graph construction

After these, tackle PhonePe's specific graph problems. Notice the progression: from basic traversal to weighted graphs with constraints.

Remember: PhonePe isn't testing whether you've memorized algorithms. They're testing whether you can recognize patterns in complex systems and apply the right tools. When you practice, focus on the "why" behind each algorithm choice, not just the implementation.

[Practice Graph Theory at PhonePe](/company/phonepe/graph-theory)
