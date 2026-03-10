---
title: "How to Solve Minimum Weighted Subgraph With the Required Paths — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Weighted Subgraph With the Required Paths. Hard difficulty, 41.1% acceptance rate. Topics: Graph Theory, Heap (Priority Queue), Shortest Path."
date: "2029-10-25"
category: "dsa-patterns"
tags:
  [
    "minimum-weighted-subgraph-with-the-required-paths",
    "graph-theory",
    "heap-(priority-queue)",
    "shortest-path",
    "hard",
  ]
---

# How to Solve Minimum Weighted Subgraph With the Required Paths

This problem asks us to find the minimum total weight of a subgraph that contains directed paths from a source node `src1` to a destination node `dest`, and from another source node `src2` to the same destination `dest`. The challenge is that paths can overlap, and we want to minimize the total weight by sharing edges where possible. What makes this problem interesting is that it combines multiple shortest path computations with a clever observation about how paths can intersect.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have 5 nodes (0-4) with these edges:

- 0 → 1 (weight 1)
- 1 → 4 (weight 3)
- 0 → 2 (weight 2)
- 2 → 4 (weight 2)
- 3 → 1 (weight 1)
- 3 → 2 (weight 2)

Let `src1 = 0`, `src2 = 3`, and `dest = 4`. We need paths from 0→4 and 3→4.

**Step 1: Find individual shortest paths**

- From 0 to 4: 0→1→4 (weight 4) or 0→2→4 (weight 4)
- From 3 to 4: 3→1→4 (weight 4) or 3→2→4 (weight 4)

**Step 2: Look for overlapping paths**
What if both paths share some edges? The key insight is that the two paths must meet at some node before reaching `dest`. They could:

1. Meet at node 1: 0→1 and 3→1, then share 1→4
   - Total weight = dist(0→1) + dist(3→1) + dist(1→4) = 1 + 1 + 3 = 5
2. Meet at node 2: 0→2 and 3→2, then share 2→4
   - Total weight = dist(0→2) + dist(3→2) + dist(2→4) = 2 + 2 + 2 = 6
3. Meet at node 4 (no sharing): 0→4 and 3→4 separately
   - Total weight = dist(0→4) + dist(3→4) = 4 + 4 = 8

The minimum is 5 when they meet at node 1. Notice we need to compute shortest paths from both sources to all nodes, and from all nodes to the destination.

## Brute Force Approach

A naive approach would be to enumerate all possible subgraphs and check if they contain the required paths. For each possible set of edges (2^m possibilities where m is the number of edges), we would:

1. Check if there's a path from src1 to dest
2. Check if there's a path from src2 to dest
3. Sum the weights of edges in the subgraph
4. Track the minimum valid sum

This is clearly infeasible even for small graphs (m=30 gives over 1 billion possibilities). Even checking connectivity for each subgraph would be expensive. The brute force helps us understand the problem but doesn't give us a practical solution.

## Optimized Approach

The key insight is that any valid solution must have:

1. A path from src1 to some meeting node X
2. A path from src2 to the same meeting node X
3. A path from X to dest

The total weight is the sum of these three distances. Since we want to minimize this, we need to find the node X that minimizes:

```
dist(src1 → X) + dist(src2 → X) + dist(X → dest)
```

We can compute:

- `dist1[i]`: shortest distance from src1 to every node i
- `dist2[i]`: shortest distance from src2 to every node i
- `distDest[i]`: shortest distance from every node i to dest (by running Dijkstra on the reversed graph)

Then for each node i, if all three distances are finite (reachable), we compute the sum and take the minimum.

**Why Dijkstra?** Because edges have positive weights (constraints say weighti ≥ 1), Dijkstra's algorithm gives us the shortest paths in O((n+m) log n) time.

**Why reverse graph for distDest?** Instead of running Dijkstra from every node to dest (O(n\*(n+m) log n)), we reverse all edges and run Dijkstra once from dest. In a reversed graph, the distance from dest to node i equals the distance from node i to dest in the original graph.

## Optimal Solution

Here's the complete solution using Dijkstra's algorithm three times:

<div class="code-group">

```python
# Time: O((n + m) log n) where n = nodes, m = edges
# Space: O(n + m) for adjacency lists and distance arrays
import heapq
from typing import List

class Solution:
    def minimumWeight(self, n: int, edges: List[List[int]], src1: int, src2: int, dest: int) -> int:
        # Build adjacency list for original graph
        graph = [[] for _ in range(n)]
        # Build adjacency list for reversed graph
        reversed_graph = [[] for _ in range(n)]

        for u, v, w in edges:
            graph[u].append((v, w))
            reversed_graph[v].append((u, w))

        def dijkstra(start, graph):
            """Run Dijkstra from start node on given graph"""
            dist = [float('inf')] * n
            dist[start] = 0
            heap = [(0, start)]  # (distance, node)

            while heap:
                d, u = heapq.heappop(heap)
                # Skip if we found a better path already
                if d > dist[u]:
                    continue
                # Explore neighbors
                for v, w in graph[u]:
                    new_dist = d + w
                    if new_dist < dist[v]:
                        dist[v] = new_dist
                        heapq.heappush(heap, (new_dist, v))
            return dist

        # Step 1: Compute distances from src1 to all nodes
        dist_src1 = dijkstra(src1, graph)
        # Step 2: Compute distances from src2 to all nodes
        dist_src2 = dijkstra(src2, graph)
        # Step 3: Compute distances from all nodes to dest (using reversed graph)
        dist_to_dest = dijkstra(dest, reversed_graph)

        # Step 4: Find minimum sum of distances
        min_weight = float('inf')
        for i in range(n):
            # Check if all three paths exist
            if dist_src1[i] < float('inf') and dist_src2[i] < float('inf') and dist_to_dest[i] < float('inf'):
                total = dist_src1[i] + dist_src2[i] + dist_to_dest[i]
                min_weight = min(min_weight, total)

        # Return -1 if no valid subgraph exists
        return min_weight if min_weight < float('inf') else -1
```

```javascript
// Time: O((n + m) log n) where n = nodes, m = edges
// Space: O(n + m) for adjacency lists and distance arrays
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} src1
 * @param {number} src2
 * @param {number} dest
 * @return {number}
 */
var minimumWeight = function (n, edges, src1, src2, dest) {
  // Build adjacency list for original graph
  const graph = Array.from({ length: n }, () => []);
  // Build adjacency list for reversed graph
  const reversedGraph = Array.from({ length: n }, () => []);

  for (const [u, v, w] of edges) {
    graph[u].push([v, w]);
    reversedGraph[v].push([u, w]);
  }

  // Dijkstra's algorithm implementation
  const dijkstra = (start, graph) => {
    const dist = Array(n).fill(Infinity);
    dist[start] = 0;
    const heap = [[0, start]]; // [distance, node]

    while (heap.length > 0) {
      const [d, u] = heap.shift(); // Using shift as min-heap (simplified)
      // In practice, use a proper priority queue for O(log n) operations

      // Skip if we found a better path already
      if (d > dist[u]) continue;

      // Explore neighbors
      for (const [v, w] of graph[u]) {
        const newDist = d + w;
        if (newDist < dist[v]) {
          dist[v] = newDist;
          heap.push([newDist, v]);
        }
      }
      // Sort to maintain heap property (simplified - use proper heap for efficiency)
      heap.sort((a, b) => a[0] - b[0]);
    }
    return dist;
  };

  // Step 1: Compute distances from src1 to all nodes
  const distSrc1 = dijkstra(src1, graph);
  // Step 2: Compute distances from src2 to all nodes
  const distSrc2 = dijkstra(src2, graph);
  // Step 3: Compute distances from all nodes to dest (using reversed graph)
  const distToDest = dijkstra(dest, reversedGraph);

  // Step 4: Find minimum sum of distances
  let minWeight = Infinity;
  for (let i = 0; i < n; i++) {
    // Check if all three paths exist
    if (distSrc1[i] !== Infinity && distSrc2[i] !== Infinity && distToDest[i] !== Infinity) {
      const total = distSrc1[i] + distSrc2[i] + distToDest[i];
      minWeight = Math.min(minWeight, total);
    }
  }

  // Return -1 if no valid subgraph exists
  return minWeight !== Infinity ? minWeight : -1;
};
```

```java
// Time: O((n + m) log n) where n = nodes, m = edges
// Space: O(n + m) for adjacency lists and distance arrays
import java.util.*;

class Solution {
    public long minimumWeight(int n, int[][] edges, int src1, int src2, int dest) {
        // Build adjacency list for original graph
        List<List<int[]>> graph = new ArrayList<>();
        // Build adjacency list for reversed graph
        List<List<int[]>> reversedGraph = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
            reversedGraph.add(new ArrayList<>());
        }

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            graph.get(u).add(new int[]{v, w});
            reversedGraph.get(v).add(new int[]{u, w});
        }

        // Step 1: Compute distances from src1 to all nodes
        long[] distSrc1 = dijkstra(src1, graph, n);
        // Step 2: Compute distances from src2 to all nodes
        long[] distSrc2 = dijkstra(src2, graph, n);
        // Step 3: Compute distances from all nodes to dest (using reversed graph)
        long[] distToDest = dijkstra(dest, reversedGraph, n);

        // Step 4: Find minimum sum of distances
        long minWeight = Long.MAX_VALUE;
        for (int i = 0; i < n; i++) {
            // Check if all three paths exist
            if (distSrc1[i] != Long.MAX_VALUE &&
                distSrc2[i] != Long.MAX_VALUE &&
                distToDest[i] != Long.MAX_VALUE) {
                long total = distSrc1[i] + distSrc2[i] + distToDest[i];
                if (total < minWeight) {
                    minWeight = total;
                }
            }
        }

        // Return -1 if no valid subgraph exists
        return minWeight != Long.MAX_VALUE ? minWeight : -1;
    }

    private long[] dijkstra(int start, List<List<int[]>> graph, int n) {
        long[] dist = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[start] = 0;

        // Priority queue: (distance, node)
        PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        pq.offer(new long[]{0, start});

        while (!pq.isEmpty()) {
            long[] current = pq.poll();
            long d = current[0];
            int u = (int) current[1];

            // Skip if we found a better path already
            if (d > dist[u]) continue;

            // Explore neighbors
            for (int[] neighbor : graph.get(u)) {
                int v = neighbor[0];
                int w = neighbor[1];
                long newDist = d + w;
                if (newDist < dist[v]) {
                    dist[v] = newDist;
                    pq.offer(new long[]{newDist, v});
                }
            }
        }
        return dist;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + m) log n)

- We run Dijkstra's algorithm 3 times
- Each Dijkstra run takes O((n + m) log n) with a binary heap
- The final loop over n nodes is O(n), which is dominated by Dijkstra

**Space Complexity:** O(n + m)

- We store two adjacency lists (original and reversed): O(m) each
- We store three distance arrays: O(n) each
- The priority queue uses O(n) space
- Total: O(n + m)

## Common Mistakes

1. **Using BFS instead of Dijkstra**: Since edges have weights (not just 1), we need Dijkstra, not BFS. BFS only works for unweighted graphs or when all edges have the same weight.

2. **Forgetting to check if paths exist**: Before summing distances, we must check that all three distances are finite (not INF). Otherwise, we might add INF values and get incorrect results.

3. **Not using a reversed graph for dist(X→dest)**: Computing shortest paths from every node to dest would be O(n\*(n+m) log n). The reversed graph trick reduces this to a single Dijkstra run.

4. **Integer overflow**: With n up to 10^5 and weights up to 10^5, total distances can exceed 32-bit integer limits. Use 64-bit integers (long in Java, float('inf') in Python).

## When You'll See This Pattern

This "meeting point" pattern with multiple sources and a destination appears in several graph problems:

1. **Minimum Cost to Make at Least One Valid Path in a Grid**: Also uses Dijkstra with modified edge costs, though in a grid setting.

2. **Network Delay Time**: Single-source shortest paths, simpler version of the same Dijkstra technique.

3. **Cheapest Flights Within K Stops**: Another shortest path variant with constraints, though it uses Bellman-Ford instead of Dijkstra.

The core technique of running Dijkstra multiple times and combining results is powerful for problems where you need to reason about paths between multiple specific nodes.

## Key Takeaways

1. **When you need paths between specific nodes in a weighted graph, think Dijkstra** (for non-negative weights) or Bellman-Ford (if negative weights allowed).

2. **The "meeting point" optimization**: When multiple paths need to reach a common destination, they can share the final segment. Look for the optimal meeting point by summing distances.

3. **Reverse the graph to compute "to destination" distances efficiently**: Instead of running Dijkstra from every node to dest, run it once from dest on the reversed graph.

Related problems: [Minimum Cost to Make at Least One Valid Path in a Grid](/problem/minimum-cost-to-make-at-least-one-valid-path-in-a-grid), [Escape the Spreading Fire](/problem/escape-the-spreading-fire), [Disconnect Path in a Binary Matrix by at Most One Flip](/problem/disconnect-path-in-a-binary-matrix-by-at-most-one-flip)
