---
title: "How to Solve Design Graph With Shortest Path Calculator — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Design Graph With Shortest Path Calculator. Hard difficulty, 64.9% acceptance rate. Topics: Graph Theory, Design, Heap (Priority Queue), Shortest Path."
date: "2027-11-21"
category: "dsa-patterns"
tags:
  [
    "design-graph-with-shortest-path-calculator",
    "graph-theory",
    "design",
    "heap-(priority-queue)",
    "hard",
  ]
---

# How to Solve Design Graph With Shortest Path Calculator

This problem asks you to design a weighted directed graph that supports two operations: adding edges and calculating the shortest path between any two nodes. What makes this problem interesting is that it combines graph theory with system design—you need to choose the right algorithm that balances precomputation cost with query efficiency. The challenge is that shortest path queries can be called repeatedly, so you need an approach that's efficient for both edge additions and path queries.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have 4 nodes (0-3) and initially these edges:

- Edge from 0→1 with cost 5
- Edge from 1→2 with cost 3
- Edge from 2→3 with cost 2

Now let's see what happens when we query shortest paths:

**Query shortestPath(0, 3):**

1. Path 0→1→2→3 costs 5+3+2 = 10
2. This is the only path, so answer is 10

**Add edge 0→2 with cost 4:**
Now we have a shorter path from 0→3:

- Old path: 0→1→2→3 = 10
- New path: 0→2→3 = 4+2 = 6

**Query shortestPath(0, 3) again:**
Now the answer should be 6

**Add edge 1→3 with cost 1:**
Now we have an even shorter path:

- 0→1→3 = 5+1 = 6 (ties with 0→2→3)
- 0→2→3 = 6
- 0→1→2→3 = 10

The key insight is that every time we add an edge, we might create new shorter paths between many pairs of nodes. We need an algorithm that can efficiently handle these updates.

## Brute Force Approach

A naive approach would be to store the graph as an adjacency list and, for each `shortestPath` query, run Dijkstra's algorithm from the source node to find the shortest path to the target. For `addEdge`, we simply add the edge to our adjacency list.

**Why this fails:**

- Each `shortestPath` query runs in O(E + V log V) time with Dijkstra's algorithm
- With up to 100 calls to `shortestPath`, this might seem acceptable
- However, the real problem is that we're not leveraging the fact that edges are added incrementally
- We're recomputing shortest paths from scratch every time, even when only a few edges have changed

**What a naive candidate might miss:**
They might try to precompute all-pairs shortest paths using Floyd-Warshall whenever an edge is added. This would be O(n³) per edge addition, which is far too slow for n up to 100 (though 100³ = 1,000,000 operations per edge addition might pass, it's inefficient).

## Optimized Approach

The key insight is that we need an algorithm that can efficiently update shortest paths when new edges are added. Dijkstra from scratch on each query is O(E + V log V), which for V=100 and E up to n\*(n-1) ≈ 10,000 could be up to 10,000 operations per query. With 100 queries, that's 1M operations total—this might actually pass, but we can do better.

However, there's an even more important consideration: the problem constraints allow up to 100 nodes, which is small enough that we can use **Floyd-Warshall algorithm** to maintain all-pairs shortest paths. Here's why this works well:

1. **Initialization**: When the graph is constructed, we run Floyd-Warshall once to compute all shortest paths
2. **Edge Addition**: When a new edge is added, we don't need to recompute everything from scratch. We only need to check if this new edge creates shorter paths between any pairs of nodes
3. **Path Query**: Once we have the all-pairs shortest path matrix, queries are O(1) lookups

The optimization for edge addition is crucial: instead of O(n³) for each addition, we can update in O(n²) by checking if the new edge (u, v, w) creates a shorter path between any pair (i, j) via i→u→v→j.

## Optimal Solution

We'll implement the Graph class with:

1. An adjacency matrix `dist` where `dist[i][j]` stores the shortest distance from i to j
2. Initialize with infinity everywhere, 0 on diagonal
3. Add initial edges
4. Run Floyd-Warshall to compute initial shortest paths
5. For new edges, update the matrix efficiently

<div class="code-group">

```python
class Graph:
    # Time:
    # - Constructor: O(n³) for Floyd-Warshall
    # - addEdge: O(n²) for partial update
    # - shortestPath: O(1) lookup
    # Space: O(n²) for distance matrix

    def __init__(self, n: int, edges: List[List[int]]):
        """
        Initialize the graph with n nodes and given edges.

        Args:
            n: Number of nodes (0 to n-1)
            edges: List of [from, to, cost] edges
        """
        self.n = n

        # Initialize distance matrix with infinity (no path)
        # dist[i][j] = shortest distance from i to j
        self.dist = [[float('inf')] * n for _ in range(n)]

        # Distance from a node to itself is 0
        for i in range(n):
            self.dist[i][i] = 0

        # Add initial edges
        for u, v, w in edges:
            self.dist[u][v] = w

        # Run Floyd-Warshall to compute all-pairs shortest paths
        self._floyd_warshall()

    def _floyd_warshall(self):
        """
        Standard Floyd-Warshall algorithm to compute all shortest paths.
        Time: O(n³), Space: O(1) (in-place update)
        """
        n = self.n
        for k in range(n):
            for i in range(n):
                # Skip if no path from i to k
                if self.dist[i][k] == float('inf'):
                    continue
                for j in range(n):
                    # Skip if no path from k to j
                    if self.dist[k][j] == float('inf'):
                        continue
                    # Update if path i->k->j is shorter than current i->j
                    new_dist = self.dist[i][k] + self.dist[k][j]
                    if new_dist < self.dist[i][j]:
                        self.dist[i][j] = new_dist

    def addEdge(self, edge: List[int]) -> None:
        """
        Add a new edge and update shortest paths efficiently.

        Args:
            edge: [from, to, cost] to add
        """
        u, v, w = edge

        # If the new edge doesn't improve the existing u->v path, we can skip
        if w >= self.dist[u][v]:
            return

        # Update the direct edge
        self.dist[u][v] = w

        # Now check if this new edge creates shorter paths between any pair (i, j)
        # We only need to check paths that go through u->v
        n = self.n
        for i in range(n):
            # Skip if no path from i to u
            if self.dist[i][u] == float('inf'):
                continue
            for j in range(n):
                # Skip if no path from v to j
                if self.dist[v][j] == float('inf'):
                    continue
                # Check if i->u->v->j is shorter than current i->j
                new_dist = self.dist[i][u] + w + self.dist[v][j]
                if new_dist < self.dist[i][j]:
                    self.dist[i][j] = new_dist

    def shortestPath(self, node1: int, node2: int) -> int:
        """
        Return the shortest path cost from node1 to node2.
        Returns -1 if no path exists.

        Args:
            node1: Source node
            node2: Target node

        Returns:
            Shortest path cost or -1 if no path
        """
        dist = self.dist[node1][node2]
        return -1 if dist == float('inf') else dist
```

```javascript
// Time:
// - Constructor: O(n³) for Floyd-Warshall
// - addEdge: O(n²) for partial update
// - shortestPath: O(1) lookup
// Space: O(n²) for distance matrix

class Graph {
  /**
   * Initialize the graph with n nodes and given edges.
   * @param {number} n - Number of nodes (0 to n-1)
   * @param {number[][]} edges - Array of [from, to, cost] edges
   */
  constructor(n, edges) {
    this.n = n;

    // Initialize distance matrix with Infinity (no path)
    // dist[i][j] = shortest distance from i to j
    this.dist = Array.from({ length: n }, () => Array(n).fill(Infinity));

    // Distance from a node to itself is 0
    for (let i = 0; i < n; i++) {
      this.dist[i][i] = 0;
    }

    // Add initial edges
    for (const [u, v, w] of edges) {
      this.dist[u][v] = w;
    }

    // Run Floyd-Warshall to compute all-pairs shortest paths
    this._floydWarshall();
  }

  /**
   * Standard Floyd-Warshall algorithm to compute all shortest paths.
   * Time: O(n³), Space: O(1) (in-place update)
   */
  _floydWarshall() {
    const n = this.n;
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        // Skip if no path from i to k
        if (this.dist[i][k] === Infinity) continue;

        for (let j = 0; j < n; j++) {
          // Skip if no path from k to j
          if (this.dist[k][j] === Infinity) continue;

          // Update if path i->k->j is shorter than current i->j
          const newDist = this.dist[i][k] + this.dist[k][j];
          if (newDist < this.dist[i][j]) {
            this.dist[i][j] = newDist;
          }
        }
      }
    }
  }

  /**
   * Add a new edge and update shortest paths efficiently.
   * @param {number[]} edge - [from, to, cost] to add
   */
  addEdge(edge) {
    const [u, v, w] = edge;

    // If the new edge doesn't improve the existing u->v path, skip
    if (w >= this.dist[u][v]) return;

    // Update the direct edge
    this.dist[u][v] = w;

    // Check if this new edge creates shorter paths between any pair (i, j)
    // We only need to check paths that go through u->v
    const n = this.n;
    for (let i = 0; i < n; i++) {
      // Skip if no path from i to u
      if (this.dist[i][u] === Infinity) continue;

      for (let j = 0; j < n; j++) {
        // Skip if no path from v to j
        if (this.dist[v][j] === Infinity) continue;

        // Check if i->u->v->j is shorter than current i->j
        const newDist = this.dist[i][u] + w + this.dist[v][j];
        if (newDist < this.dist[i][j]) {
          this.dist[i][j] = newDist;
        }
      }
    }
  }

  /**
   * Return the shortest path cost from node1 to node2.
   * Returns -1 if no path exists.
   * @param {number} node1 - Source node
   * @param {number} node2 - Target node
   * @return {number} Shortest path cost or -1 if no path
   */
  shortestPath(node1, node2) {
    const dist = this.dist[node1][node2];
    return dist === Infinity ? -1 : dist;
  }
}
```

```java
// Time:
// - Constructor: O(n³) for Floyd-Warshall
// - addEdge: O(n²) for partial update
// - shortestPath: O(1) lookup
// Space: O(n²) for distance matrix

class Graph {
    private int n;
    private int[][] dist;

    /**
     * Initialize the graph with n nodes and given edges.
     * @param n Number of nodes (0 to n-1)
     * @param edges Array of [from, to, cost] edges
     */
    public Graph(int n, int[][] edges) {
        this.n = n;

        // Initialize distance matrix with infinity (no path)
        // dist[i][j] = shortest distance from i to j
        dist = new int[n][n];

        // Fill with maximum value (simulating infinity)
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                dist[i][j] = Integer.MAX_VALUE;
            }
        }

        // Distance from a node to itself is 0
        for (int i = 0; i < n; i++) {
            dist[i][i] = 0;
        }

        // Add initial edges
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            dist[u][v] = w;
        }

        // Run Floyd-Warshall to compute all-pairs shortest paths
        floydWarshall();
    }

    /**
     * Standard Floyd-Warshall algorithm to compute all shortest paths.
     * Time: O(n³), Space: O(1) (in-place update)
     */
    private void floydWarshall() {
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                // Skip if no path from i to k or if i == k
                if (dist[i][k] == Integer.MAX_VALUE) continue;

                for (int j = 0; j < n; j++) {
                    // Skip if no path from k to j or if k == j
                    if (dist[k][j] == Integer.MAX_VALUE) continue;

                    // Update if path i->k->j is shorter than current i->j
                    // Use long to avoid integer overflow
                    long newDist = (long) dist[i][k] + dist[k][j];
                    if (newDist < dist[i][j]) {
                        dist[i][j] = (int) newDist;
                    }
                }
            }
        }
    }

    /**
     * Add a new edge and update shortest paths efficiently.
     * @param edge [from, to, cost] to add
     */
    public void addEdge(int[] edge) {
        int u = edge[0], v = edge[1], w = edge[2];

        // If the new edge doesn't improve the existing u->v path, skip
        if (w >= dist[u][v]) return;

        // Update the direct edge
        dist[u][v] = w;

        // Check if this new edge creates shorter paths between any pair (i, j)
        // We only need to check paths that go through u->v
        for (int i = 0; i < n; i++) {
            // Skip if no path from i to u
            if (dist[i][u] == Integer.MAX_VALUE) continue;

            for (int j = 0; j < n; j++) {
                // Skip if no path from v to j
                if (dist[v][j] == Integer.MAX_VALUE) continue;

                // Check if i->u->v->j is shorter than current i->j
                // Use long to avoid integer overflow
                long newDist = (long) dist[i][u] + w + dist[v][j];
                if (newDist < dist[i][j]) {
                    dist[i][j] = (int) newDist;
                }
            }
        }
    }

    /**
     * Return the shortest path cost from node1 to node2.
     * Returns -1 if no path exists.
     * @param node1 Source node
     * @param node2 Target node
     * @return Shortest path cost or -1 if no path
     */
    public int shortestPath(int node1, int node2) {
        return dist[node1][node2] == Integer.MAX_VALUE ? -1 : dist[node1][node2];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Constructor**: O(n³) for the initial Floyd-Warshall algorithm. With n ≤ 100, this is at most 1,000,000 operations.
- **addEdge**: O(n²) for the optimized update. We check all pairs (i, j) to see if the new edge creates a shorter path i→u→v→j.
- **shortestPath**: O(1) lookup from the precomputed matrix.

**Space Complexity:** O(n²) for storing the n × n distance matrix. With n ≤ 100, this is at most 10,000 integers.

**Why this is optimal for the constraints:**

- The problem has at most 100 nodes, making O(n³) initialization acceptable
- We have up to 100 calls to `addEdge`, each O(n²) = 10,000 operations, totaling 1M operations
- Queries are instant O(1) lookups
- Any solution using Dijkstra for each query would be O(q _ (E log V)) which could be up to 100 _ (10,000 \* log 100) ≈ 6.6M operations

## Common Mistakes

1. **Running full Floyd-Warshall on every edge addition**: This would be O(n³) per addition, or up to 100 \* 1,000,000 = 100M operations. The optimized O(n²) update is crucial.

2. **Forgetting to handle integer overflow**: When adding distances, especially in Java, you need to use `long` for intermediate calculations to avoid overflow before comparing.

3. **Not checking if the new edge actually improves paths**: In `addEdge`, if `w >= dist[u][v]`, the edge doesn't create any new shorter paths, so we can return early.

4. **Incorrect infinity representation**: Using `Integer.MAX_VALUE` in Java requires careful handling in addition to avoid overflow. Always check for infinity before performing operations.

5. **Missing the diagonal initialization**: Forgetting to set `dist[i][i] = 0` for all i can cause incorrect shortest path calculations.

## When You'll See This Pattern

This problem combines **dynamic programming** (Floyd-Warshall) with **incremental updates**. You'll see similar patterns in:

1. **Network Delay Time (LeetCode 743)**: Also uses shortest path algorithms but focuses on single-source shortest paths rather than all-pairs.

2. **Cheapest Flights Within K Stops (LeetCode 787)**: Another weighted graph problem with constraints, though it uses Bellman-Ford or Dijkstra with modifications.

3. **Find the City With the Smallest Number of Neighbors at a Threshold Distance (LeetCode 1334)**: Uses Floyd-Warshall to compute all-pairs shortest paths, then processes the results.

The key pattern is: when you need all-pairs shortest paths on a reasonably small graph (n ≤ 200), Floyd-Warshall is often the right choice. When the graph is larger but queries are from a single source, Dijkstra is better.

## Key Takeaways

1. **Choose the algorithm based on constraints**: For n ≤ 100, O(n³) is acceptable. For larger graphs, you'd need Dijkstra or A\*.

2. **Incremental updates can be optimized**: When adding edges to a graph with precomputed shortest paths, you don't need to recompute everything—just check if the new edge creates better paths.

3. **Floyd-Warshall is a DP algorithm**: It works by gradually allowing more intermediate nodes (k) in paths. The state is `dist[i][j]` = shortest path from i to j using only nodes 0..k as intermediates.

4. **Design problems require trade-off analysis**: You need to consider which operations are frequent (queries vs. updates) and optimize for the common case.

Related problems: [Number of Restricted Paths From First to Last Node](/problem/number-of-restricted-paths-from-first-to-last-node), [Closest Node to Path in Tree](/problem/closest-node-to-path-in-tree)
