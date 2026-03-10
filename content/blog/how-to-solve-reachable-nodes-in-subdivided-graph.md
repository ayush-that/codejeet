---
title: "How to Solve Reachable Nodes In Subdivided Graph — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Reachable Nodes In Subdivided Graph. Hard difficulty, 51.8% acceptance rate. Topics: Graph Theory, Heap (Priority Queue), Shortest Path."
date: "2029-01-09"
category: "dsa-patterns"
tags:
  [
    "reachable-nodes-in-subdivided-graph",
    "graph-theory",
    "heap-(priority-queue)",
    "shortest-path",
    "hard",
  ]
---

# How to Solve Reachable Nodes In Subdivided Graph

This problem presents a unique twist on shortest path algorithms. You're given an undirected graph where each edge has been subdivided into multiple intermediate nodes, and you need to count how many total nodes (original + subdivided) are reachable within a maximum number of moves. The challenge lies in modeling the subdivided edges properly and efficiently tracking how many intermediate nodes you can reach along each edge.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have:

- n = 3 (original nodes: 0, 1, 2)
- edges = [[0,1,10], [1,2,10]] (each edge has 10 intermediate nodes)
- maxMoves = 6

**Original Graph:**

```
0 --(10 intermediate nodes)-- 1 --(10 intermediate nodes)-- 2
```

**Step-by-step reasoning:**

1. From node 0, we can travel along edge 0-1. With maxMoves=6, we can reach:
   - Node 0 itself (always reachable)
   - 6 intermediate nodes along edge 0-1
   - Node 1 if we use all 6 moves (but we'd need 11 moves to reach node 1 completely)

2. From node 1, we can travel in both directions:
   - Along edge 0-1: we can reach some of the same intermediate nodes from the other side
   - Along edge 1-2: we can reach intermediate nodes toward node 2

3. The key insight: For each edge u-v with k intermediate nodes:
   - From u's side, we can reach min(maxMoves - dist[u], k) intermediate nodes
   - From v's side, we can reach min(maxMoves - dist[v], k) intermediate nodes
   - The total reachable intermediate nodes on this edge is min(k, reach_from_u + reach_from_v)

Let's trace with actual distances:

- Using Dijkstra, we find shortest distances from node 0:
  - dist[0] = 0
  - dist[1] = 11 (need to traverse 10 intermediate nodes + 1 to reach node 1)
  - dist[2] = 22 (need to traverse both edges)

With maxMoves=6:

- From node 0: can reach min(6-0, 10) = 6 intermediate nodes on edge 0-1
- From node 1: can reach min(6-11, 10) = 0 intermediate nodes on edge 0-1 (distance too far)
- From node 1: can reach min(6-11, 10) = 0 intermediate nodes on edge 1-2
- From node 2: can reach min(6-22, 10) = 0 intermediate nodes on edge 1-2

Total reachable:

- Original nodes: node 0 (dist=0 ≤ 6)
- Intermediate nodes: 6 from edge 0-1
- Total = 1 + 6 = 7

## Brute Force Approach

A naive approach might try to explicitly create all nodes (original + subdivided) and run BFS/DFS. However, this is extremely inefficient because:

- If each edge has up to 10⁴ intermediate nodes and there are up to 10⁴ edges, we could have over 10⁸ nodes
- BFS/DFS would be O(V+E) where V could be enormous
- Memory usage would be prohibitive

Even if we tried to simulate without explicitly creating nodes, a naive BFS that tracks remaining moves would have exponential complexity because we'd revisit nodes with different remaining move counts.

The brute force fails because it doesn't leverage the structure of the problem: we only care about whether we can reach nodes within a distance limit, not the exact path.

## Optimized Approach

The key insight is to treat this as a **shortest path problem with edge weights**:

1. Each original edge u-v with k intermediate nodes becomes an edge with weight k+1 (to travel from u to v)
2. We need to find the shortest distance from node 0 to all original nodes
3. For each original node, if its distance ≤ maxMoves, it's reachable
4. For each edge u-v with k intermediate nodes:
   - From u's side: we can reach min(maxMoves - dist[u], k) intermediate nodes
   - From v's side: we can reach min(maxMoves - dist[v], k) intermediate nodes
   - Total reachable on this edge = min(k, reach_from_u + reach_from_v)

Why does this work?

- Dijkstra's algorithm gives us the minimum distance to each original node
- If dist[u] ≤ maxMoves, we can reach node u with some moves to spare
- The spare moves (maxMoves - dist[u]) tell us how far along each incident edge we can travel
- We sum contributions from both ends of each edge, but cap at k to avoid double-counting

## Optimal Solution

We use Dijkstra's algorithm with a min-heap to find shortest distances from node 0 to all original nodes. Then we sum:

1. All original nodes with distance ≤ maxMoves
2. For each edge, the reachable intermediate nodes calculated from both ends

<div class="code-group">

```python
# Time: O(E log V) where E = number of edges, V = number of original nodes
# Space: O(V + E) for adjacency list and distance array
def reachableNodes(edges, maxMoves, n):
    """
    Calculate total reachable nodes (original + subdivided) within maxMoves.

    Args:
        edges: List of [u, v, cnt] where cnt = number of intermediate nodes
        maxMoves: Maximum number of moves allowed
        n: Number of original nodes

    Returns:
        Total number of reachable nodes
    """
    # Step 1: Build adjacency list for the graph
    # Each edge has weight = cnt + 1 (to travel between original nodes)
    graph = [[] for _ in range(n)]
    for u, v, cnt in edges:
        # Add edge in both directions (undirected graph)
        graph[u].append((v, cnt + 1))
        graph[v].append((u, cnt + 1))

    # Step 2: Run Dijkstra's algorithm from node 0
    # dist[i] = minimum distance from node 0 to node i
    dist = [float('inf')] * n
    dist[0] = 0

    # Min-heap priority queue: (distance, node)
    import heapq
    heap = [(0, 0)]  # Start from node 0 with distance 0

    while heap:
        current_dist, node = heapq.heappop(heap)

        # Skip if we found a better distance already
        if current_dist > dist[node]:
            continue

        # Explore neighbors
        for neighbor, weight in graph[node]:
            new_dist = current_dist + weight

            # If we found a shorter path to neighbor, update it
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))

    # Step 3: Count reachable original nodes
    # A node is reachable if its distance ≤ maxMoves
    reachable_count = 0
    for d in dist:
        if d <= maxMoves:
            reachable_count += 1

    # Step 4: Count reachable intermediate nodes on each edge
    for u, v, cnt in edges:
        # How many intermediate nodes we can reach from u's side
        # If dist[u] > maxMoves, we can't reach any from this side
        reach_from_u = max(0, maxMoves - dist[u])

        # How many intermediate nodes we can reach from v's side
        reach_from_v = max(0, maxMoves - dist[v])

        # Total reachable on this edge, capped at cnt
        # The min() prevents double-counting if both sides can reach more than cnt total
        reachable_on_edge = min(cnt, reach_from_u + reach_from_v)
        reachable_count += reachable_on_edge

    return reachable_count
```

```javascript
// Time: O(E log V) where E = number of edges, V = number of original nodes
// Space: O(V + E) for adjacency list and distance array
function reachableNodes(edges, maxMoves, n) {
  /**
   * Calculate total reachable nodes (original + subdivided) within maxMoves.
   *
   * @param {number[][]} edges - Array of [u, v, cnt] where cnt = number of intermediate nodes
   * @param {number} maxMoves - Maximum number of moves allowed
   * @param {number} n - Number of original nodes
   * @return {number} Total number of reachable nodes
   */

  // Step 1: Build adjacency list for the graph
  // Each edge has weight = cnt + 1 (to travel between original nodes)
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, cnt] of edges) {
    // Add edge in both directions (undirected graph)
    graph[u].push([v, cnt + 1]);
    graph[v].push([u, cnt + 1]);
  }

  // Step 2: Run Dijkstra's algorithm from node 0
  // dist[i] = minimum distance from node 0 to node i
  const dist = Array(n).fill(Infinity);
  dist[0] = 0;

  // Min-heap priority queue: [distance, node]
  const heap = new MinHeap((a, b) => a[0] - b[0]);
  heap.push([0, 0]); // Start from node 0 with distance 0

  while (!heap.isEmpty()) {
    const [currentDist, node] = heap.pop();

    // Skip if we found a better distance already
    if (currentDist > dist[node]) {
      continue;
    }

    // Explore neighbors
    for (const [neighbor, weight] of graph[node]) {
      const newDist = currentDist + weight;

      // If we found a shorter path to neighbor, update it
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        heap.push([newDist, neighbor]);
      }
    }
  }

  // Step 3: Count reachable original nodes
  // A node is reachable if its distance ≤ maxMoves
  let reachableCount = 0;
  for (const d of dist) {
    if (d <= maxMoves) {
      reachableCount++;
    }
  }

  // Step 4: Count reachable intermediate nodes on each edge
  for (const [u, v, cnt] of edges) {
    // How many intermediate nodes we can reach from u's side
    // If dist[u] > maxMoves, we can't reach any from this side
    const reachFromU = Math.max(0, maxMoves - dist[u]);

    // How many intermediate nodes we can reach from v's side
    const reachFromV = Math.max(0, maxMoves - dist[v]);

    // Total reachable on this edge, capped at cnt
    // The min() prevents double-counting if both sides can reach more than cnt total
    const reachableOnEdge = Math.min(cnt, reachFromU + reachFromV);
    reachableCount += reachableOnEdge;
  }

  return reachableCount;
}

// MinHeap implementation for Dijkstra's algorithm
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return root;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  bubbleDown(index) {
    const last = this.heap.length - 1;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left <= last && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right <= last && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
```

```java
// Time: O(E log V) where E = number of edges, V = number of original nodes
// Space: O(V + E) for adjacency list and distance array
class Solution {
    public int reachableNodes(int[][] edges, int maxMoves, int n) {
        /**
         * Calculate total reachable nodes (original + subdivided) within maxMoves.
         *
         * @param edges Array of [u, v, cnt] where cnt = number of intermediate nodes
         * @param maxMoves Maximum number of moves allowed
         * @param n Number of original nodes
         * @return Total number of reachable nodes
         */

        // Step 1: Build adjacency list for the graph
        // Each edge has weight = cnt + 1 (to travel between original nodes)
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], cnt = edge[2];
            // Add edge in both directions (undirected graph)
            graph.get(u).add(new int[]{v, cnt + 1});
            graph.get(v).add(new int[]{u, cnt + 1});
        }

        // Step 2: Run Dijkstra's algorithm from node 0
        // dist[i] = minimum distance from node 0 to node i
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[0] = 0;

        // Min-heap priority queue: (distance, node)
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.offer(new int[]{0, 0});  // Start from node 0 with distance 0

        while (!heap.isEmpty()) {
            int[] current = heap.poll();
            int currentDist = current[0];
            int node = current[1];

            // Skip if we found a better distance already
            if (currentDist > dist[node]) {
                continue;
            }

            // Explore neighbors
            for (int[] neighborInfo : graph.get(node)) {
                int neighbor = neighborInfo[0];
                int weight = neighborInfo[1];
                int newDist = currentDist + weight;

                // If we found a shorter path to neighbor, update it
                if (newDist < dist[neighbor]) {
                    dist[neighbor] = newDist;
                    heap.offer(new int[]{newDist, neighbor});
                }
            }
        }

        // Step 3: Count reachable original nodes
        // A node is reachable if its distance ≤ maxMoves
        int reachableCount = 0;
        for (int d : dist) {
            if (d <= maxMoves) {
                reachableCount++;
            }
        }

        // Step 4: Count reachable intermediate nodes on each edge
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], cnt = edge[2];

            // How many intermediate nodes we can reach from u's side
            // If dist[u] > maxMoves, we can't reach any from this side
            int reachFromU = Math.max(0, maxMoves - dist[u]);

            // How many intermediate nodes we can reach from v's side
            int reachFromV = Math.max(0, maxMoves - dist[v]);

            // Total reachable on this edge, capped at cnt
            // The min() prevents double-counting if both sides can reach more than cnt total
            int reachableOnEdge = Math.min(cnt, reachFromU + reachFromV);
            reachableCount += reachableOnEdge;
        }

        return reachableCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(E log V)**

- Building the adjacency list: O(E)
- Dijkstra's algorithm with binary heap: O((V+E) log V) = O(E log V) since E ≥ V-1 in a connected graph
- Counting reachable nodes: O(V + E)
- Dominated by Dijkstra's O(E log V)

**Space Complexity: O(V + E)**

- Adjacency list: O(E) to store all edges
- Distance array: O(V)
- Priority queue: O(V) in worst case
- Total: O(V + E)

## Common Mistakes

1. **Forgetting to add 1 to edge weights**: The edge weight should be `cnt + 1`, not just `cnt`, because traveling from one original node to another requires traversing all intermediate nodes PLUS moving to the other original node.

2. **Not capping the intermediate node count**: When calculating `reachFromU + reachFromV`, you must take `min(cnt, reachFromU + reachFromV)`. Otherwise, if both sides can collectively reach more than `cnt` nodes, you'd overcount.

3. **Using BFS instead of Dijkstra**: BFS only works with unweighted graphs. Here, edges have different weights (based on `cnt`), so we need Dijkstra's algorithm.

4. **Not handling unreachable nodes properly**: When `dist[u] > maxMoves`, `maxMoves - dist[u]` is negative. We need to use `max(0, maxMoves - dist[u])` to avoid negative values.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Shortest path with Dijkstra**: Any problem involving finding minimum distance/cost to reach nodes in a weighted graph. Examples:
   - [Network Delay Time](https://leetcode.com/problems/network-delay-time/) - Find time for signal to reach all nodes
   - [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) - Find cheapest path with limited stops

2. **Graph transformation**: Problems where you need to transform the graph representation to apply standard algorithms. Examples:
   - [Find All People With Secret](https://leetcode.com/problems/find-all-people-with-secret/) - Similar time-constrained reachability
   - [Minimum Cost to Make at Least One Valid Path](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path/) - Transform grid to graph

3. **Resource-constrained reachability**: Problems where you have limited resources (moves, time, cost) and need to determine what's reachable. Examples:
   - [Minimum Obstacle Removal to Reach Corner](https://leetcode.com/problems/minimum-obstacle-removal-to-reach-corner/) - Limited removals
   - [Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/) - Limited height difference

## Key Takeaways

1. **Recognize shortest path through transformation**: When a problem involves reaching nodes within limited moves/steps, consider transforming it into a shortest path problem. Add appropriate weights to edges based on the constraints.

2. **Think in terms of distances, not explicit traversal**: Instead of simulating every move, calculate distances from the source and determine what's reachable based on those distances. This is often more efficient.

3. **Handle edge contributions separately**: For problems with intermediate points along edges, calculate contributions from both ends independently, then combine them with appropriate bounds to avoid double-counting.

Related problems: [Find All People With Secret](/problem/find-all-people-with-secret), [Paths in Maze That Lead to Same Room](/problem/paths-in-maze-that-lead-to-same-room)
