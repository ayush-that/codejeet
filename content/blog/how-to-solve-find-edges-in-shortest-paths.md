---
title: "How to Solve Find Edges in Shortest Paths — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Edges in Shortest Paths. Hard difficulty, 46.4% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory, Heap (Priority Queue), Shortest Path."
date: "2029-12-08"
category: "dsa-patterns"
tags:
  [
    "find-edges-in-shortest-paths",
    "depth-first-search",
    "breadth-first-search",
    "graph-theory",
    "hard",
  ]
---

# How to Solve Find Edges in Shortest Paths

This problem asks us to determine which edges in a weighted undirected graph appear in _any_ shortest path between node 0 and node n-1. The challenge is that multiple shortest paths might exist, and an edge counts if it appears in _any_ of them—not necessarily all. This makes it more complex than simply finding one shortest path.

What makes this problem interesting is that we need to understand the _structure_ of all shortest paths, not just compute distances. We need to identify edges that are "critical" to achieving the minimum distance, which requires analyzing the graph from both directions.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Graph:**

- n = 4 nodes (0, 1, 2, 3)
- edges = [[0,1,1], [0,2,2], [1,2,1], [1,3,2], [2,3,1]]

```
    1       2
0 ----- 1 ----- 3
 \     / \     /
  \  1/   \  2/
   \ /     \ /
    2 ----- 3
       1
```

**Step 1: Find shortest distances from node 0**

- dist[0] = 0
- dist[1] = 1 (0→1)
- dist[2] = 1 (0→2 via weight 2? Wait, actually 0→2 is weight 2, but 0→1→2 is 1+1=2, so dist[2] = 2)
- Let's compute properly using Dijkstra:
  - Start: dist = [0, ∞, ∞, ∞]
  - Process 0: update dist[1]=1, dist[2]=2
  - Process 1 (dist=1): update dist[2]=min(2, 1+1=2), dist[3]=1+2=3
  - Process 2 (dist=2): update dist[3]=min(3, 2+1=3)
  - Final: dist = [0, 1, 2, 3]

**Step 2: Find shortest distances from node 3 (reverse)**

- dist_rev[3] = 0
- dist_rev[2] = 1 (3→2)
- dist_rev[1] = 2 (3→2→1 or 3→1)
- dist_rev[0] = 3 (3→2→1→0 or 3→1→0)
- Actually: dist_rev = [3, 2, 1, 0]

**Step 3: Check each edge**
An edge (u,v,w) is in a shortest path if:
dist[u] + w + dist_rev[v] == shortest_distance OR
dist[v] + w + dist_rev[u] == shortest_distance

Where shortest_distance = dist[3] = 3

Check edges:

1. (0,1,1): dist[0]+1+dist_rev[1] = 0+1+2 = 3 ✓ (0→1→...→3)
2. (0,2,2): dist[0]+2+dist_rev[2] = 0+2+1 = 3 ✓ (0→2→3)
3. (1,2,1): dist[1]+1+dist_rev[2] = 1+1+1 = 3 ✓ (0→1→2→3)
4. (1,3,2): dist[1]+2+dist_rev[3] = 1+2+0 = 3 ✓ (0→1→3)
5. (2,3,1): dist[2]+1+dist_rev[3] = 2+1+0 = 3 ✓ (0→2→3)

All 5 edges are in some shortest path! This makes sense because there are multiple shortest paths of length 3.

## Brute Force Approach

A naive approach would be:

1. Find all shortest paths from 0 to n-1
2. For each edge, check if it appears in any of these paths

The problem with this approach is exponential complexity. Finding _all_ shortest paths in a graph can generate an enormous number of paths. Even with Dijkstra's algorithm, enumerating all paths with the minimum distance requires exploring all combinations, which is O(2^n) in the worst case.

Even if we try to be clever and use DFS to find paths with total weight equal to the shortest distance, we'd still need to explore exponentially many paths in dense graphs.

**Why this fails:** The brute force doesn't scale beyond tiny graphs. With n up to 2×10^4 and m up to 4×10^4 in the problem constraints, we need an O(m log n) solution, not exponential.

## Optimized Approach

The key insight is that an edge (u, v, w) is in _some_ shortest path from 0 to n-1 if and only if:

```
dist[0→u] + w + dist[v→n-1] == shortest_distance
```

OR

```
dist[0→v] + w + dist[u→n-1] == shortest_distance
```

Where:

- `dist[0→x]` is the shortest distance from node 0 to node x
- `dist[x→n-1]` is the shortest distance from node x to node n-1

**Why this works:**

1. If we can reach u from 0 with distance d1
2. And we can reach n-1 from v with distance d2
3. And d1 + w + d2 equals the total shortest distance
4. Then the path 0→...→u→v→...→n-1 is a shortest path containing edge (u,v)

We need distances from both directions because the edge might be traversed in either direction in a shortest path.

**Step-by-step reasoning:**

1. Run Dijkstra from node 0 to get `dist_from_start[]`
2. Run Dijkstra from node n-1 to get `dist_to_end[]` (on the reversed graph)
3. The shortest distance = `dist_from_start[n-1]`
4. For each edge (u, v, w):
   - Check if `dist_from_start[u] + w + dist_to_end[v] == shortest_distance`
   - Check if `dist_from_start[v] + w + dist_to_end[u] == shortest_distance`
   - If either is true, this edge is in some shortest path

This approach is efficient because:

- Two Dijkstra runs: O(m log n) each
- Edge checking: O(m)
- Total: O(m log n)

## Optimal Solution

<div class="code-group">

```python
# Time: O(m log n) where m = number of edges, n = number of nodes
# Space: O(n + m) for adjacency list and distance arrays
from heapq import heappush, heappop
from typing import List

class Solution:
    def findAnswer(self, n: int, edges: List[List[int]]) -> List[bool]:
        # Build adjacency list
        adj = [[] for _ in range(n)]
        for i, (u, v, w) in enumerate(edges):
            adj[u].append((v, w, i))  # store edge index for tracking
            adj[v].append((u, w, i))

        # Dijkstra from node 0
        dist_from_start = [float('inf')] * n
        dist_from_start[0] = 0
        min_heap = [(0, 0)]  # (distance, node)

        while min_heap:
            dist, node = heappop(min_heap)
            if dist > dist_from_start[node]:
                continue  # outdated entry
            for neighbor, weight, _ in adj[node]:
                new_dist = dist + weight
                if new_dist < dist_from_start[neighbor]:
                    dist_from_start[neighbor] = new_dist
                    heappush(min_heap, (new_dist, neighbor))

        # Dijkstra from node n-1 (to get distances to the end)
        dist_to_end = [float('inf')] * n
        dist_to_end[n-1] = 0
        min_heap = [(0, n-1)]

        while min_heap:
            dist, node = heappop(min_heap)
            if dist > dist_to_end[node]:
                continue
            for neighbor, weight, _ in adj[node]:
                new_dist = dist + weight
                if new_dist < dist_to_end[neighbor]:
                    dist_to_end[neighbor] = new_dist
                    heappush(min_heap, (new_dist, neighbor))

        # If there's no path from 0 to n-1, all edges are False
        if dist_from_start[n-1] == float('inf'):
            return [False] * len(edges)

        shortest_distance = dist_from_start[n-1]

        # Check each edge
        answer = [False] * len(edges)
        for i, (u, v, w) in enumerate(edges):
            # Check if edge is in any shortest path
            # Case 1: Path goes 0 -> ... -> u -> v -> ... -> n-1
            if (dist_from_start[u] + w + dist_to_end[v] == shortest_distance or
                # Case 2: Path goes 0 -> ... -> v -> u -> ... -> n-1
                dist_from_start[v] + w + dist_to_end[u] == shortest_distance):
                answer[i] = True

        return answer
```

```javascript
// Time: O(m log n) where m = number of edges, n = number of nodes
// Space: O(n + m) for adjacency list and distance arrays

/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {boolean[]}
 */
var findAnswer = function (n, edges) {
  // Build adjacency list with edge indices
  const adj = Array.from({ length: n }, () => []);
  edges.forEach(([u, v, w], idx) => {
    adj[u].push([v, w, idx]);
    adj[v].push([u, w, idx]);
  });

  // Dijkstra from node 0
  const distFromStart = Array(n).fill(Infinity);
  distFromStart[0] = 0;
  const minHeap = [[0, 0]]; // [distance, node]

  while (minHeap.length > 0) {
    const [dist, node] = minHeap.shift();
    if (dist > distFromStart[node]) continue;

    for (const [neighbor, weight, _] of adj[node]) {
      const newDist = dist + weight;
      if (newDist < distFromStart[neighbor]) {
        distFromStart[neighbor] = newDist;
        minHeap.push([newDist, neighbor]);
        minHeap.sort((a, b) => a[0] - b[0]); // maintain heap order
      }
    }
  }

  // Dijkstra from node n-1
  const distToEnd = Array(n).fill(Infinity);
  distToEnd[n - 1] = 0;
  minHeap.length = 0;
  minHeap.push([0, n - 1]);

  while (minHeap.length > 0) {
    const [dist, node] = minHeap.shift();
    if (dist > distToEnd[node]) continue;

    for (const [neighbor, weight, _] of adj[node]) {
      const newDist = dist + weight;
      if (newDist < distToEnd[neighbor]) {
        distToEnd[neighbor] = newDist;
        minHeap.push([newDist, neighbor]);
        minHeap.sort((a, b) => a[0] - b[0]);
      }
    }
  }

  // If no path exists, all edges are false
  if (distFromStart[n - 1] === Infinity) {
    return Array(edges.length).fill(false);
  }

  const shortestDistance = distFromStart[n - 1];
  const answer = Array(edges.length).fill(false);

  // Check each edge
  edges.forEach(([u, v, w], idx) => {
    // Check both directions the edge could be traversed
    if (
      distFromStart[u] + w + distToEnd[v] === shortestDistance ||
      distFromStart[v] + w + distToEnd[u] === shortestDistance
    ) {
      answer[idx] = true;
    }
  });

  return answer;
};
```

```java
// Time: O(m log n) where m = number of edges, n = number of nodes
// Space: O(n + m) for adjacency list and distance arrays

import java.util.*;

class Solution {
    public boolean[] findAnswer(int n, int[][] edges) {
        // Build adjacency list
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }

        for (int i = 0; i < edges.length; i++) {
            int u = edges[i][0];
            int v = edges[i][1];
            int w = edges[i][2];
            adj.get(u).add(new int[]{v, w, i});
            adj.get(v).add(new int[]{u, w, i});
        }

        // Dijkstra from node 0
        long[] distFromStart = new long[n];
        Arrays.fill(distFromStart, Long.MAX_VALUE);
        distFromStart[0] = 0;
        PriorityQueue<long[]> minHeap = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        minHeap.offer(new long[]{0, 0}); // [distance, node]

        while (!minHeap.isEmpty()) {
            long[] curr = minHeap.poll();
            long dist = curr[0];
            int node = (int)curr[1];

            if (dist > distFromStart[node]) continue;

            for (int[] neighborInfo : adj.get(node)) {
                int neighbor = neighborInfo[0];
                int weight = neighborInfo[1];
                long newDist = dist + weight;

                if (newDist < distFromStart[neighbor]) {
                    distFromStart[neighbor] = newDist;
                    minHeap.offer(new long[]{newDist, neighbor});
                }
            }
        }

        // Dijkstra from node n-1
        long[] distToEnd = new long[n];
        Arrays.fill(distToEnd, Long.MAX_VALUE);
        distToEnd[n-1] = 0;
        minHeap.clear();
        minHeap.offer(new long[]{0, n-1});

        while (!minHeap.isEmpty()) {
            long[] curr = minHeap.poll();
            long dist = curr[0];
            int node = (int)curr[1];

            if (dist > distToEnd[node]) continue;

            for (int[] neighborInfo : adj.get(node)) {
                int neighbor = neighborInfo[0];
                int weight = neighborInfo[1];
                long newDist = dist + weight;

                if (newDist < distToEnd[neighbor]) {
                    distToEnd[neighbor] = newDist;
                    minHeap.offer(new long[]{newDist, neighbor});
                }
            }
        }

        // If no path exists, return all false
        if (distFromStart[n-1] == Long.MAX_VALUE) {
            return new boolean[edges.length];
        }

        long shortestDistance = distFromStart[n-1];
        boolean[] answer = new boolean[edges.length];

        // Check each edge
        for (int i = 0; i < edges.length; i++) {
            int u = edges[i][0];
            int v = edges[i][1];
            int w = edges[i][2];

            // Check both directions
            if ((distFromStart[u] + w + distToEnd[v] == shortestDistance) ||
                (distFromStart[v] + w + distToEnd[u] == shortestDistance)) {
                answer[i] = true;
            }
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m log n)**

- Building adjacency list: O(m)
- First Dijkstra from node 0: O(m log n) using min-heap
- Second Dijkstra from node n-1: O(m log n)
- Checking each edge: O(m)
- Total: O(m log n) dominates

**Space Complexity: O(n + m)**

- Adjacency list: O(m) to store all edges
- Distance arrays: O(n) each, we have two of them
- Priority queue: O(n) in worst case
- Answer array: O(m)
- Total: O(n + m)

The log n factor comes from heap operations in Dijkstra's algorithm. With n up to 2×10^4 and m up to 4×10^4, O(m log n) is efficient enough.

## Common Mistakes

1. **Forgetting to check both directions of each edge**: An edge (u,v,w) can be traversed as u→v or v→u in a shortest path. You must check both `dist[0→u] + w + dist[v→n-1]` and `dist[0→v] + w + dist[u→n-1]`.

2. **Not handling the case when no path exists**: If node n-1 is unreachable from node 0, `dist_from_start[n-1]` will be infinity. In this case, no edges can be in a shortest path, so all answers should be false.

3. **Using integer overflow**: Edge weights can be up to 10^5, and paths can have many edges. With n up to 2×10^4, the maximum path weight could be 2×10^9, which fits in 32-bit signed integers but could overflow during intermediate calculations. Use 64-bit integers (long in Java, float('inf') in Python).

4. **Inefficient Dijkstra implementation**: Not using a priority queue leads to O(n²) Dijkstra, which is too slow for n=2×10^4. Always use a min-heap for Dijkstra in interview settings.

## When You'll See This Pattern

This "bidirectional distance checking" pattern appears in several graph problems:

1. **"Number of Ways to Arrive at Destination" (LeetCode 1976)**: Count the number of shortest paths from start to end. Uses similar bidirectional distance logic but with counting instead of edge checking.

2. **"Minimum Weighted Subgraph With the Required Paths" (LeetCode 2203)**: Find subgraph containing required paths between nodes. Uses multiple Dijkstra runs from different sources.

3. **"Find the City With the Smallest Number of Neighbors at a Threshold Distance" (LeetCode 1334)**: Uses all-pairs shortest paths (Floyd-Warshall) or multiple Dijkstra runs.

The core technique is running shortest path algorithms from multiple sources and combining the results to answer structural questions about the graph.

## Key Takeaways

1. **When asked about edges/nodes in "any" shortest path**, think about the condition: `dist[start→u] + weight + dist[v→end] == shortest_distance`. This avoids enumerating all paths.

2. **Bidirectional Dijkstra is powerful**: Running Dijkstra from both start and end (or multiple sources) is a common pattern for problems about graph structure rather than just distances.

3. **Graph problems often reduce to distance computations**: Many seemingly complex graph problems can be solved by computing distances and then applying logical conditions to the results.

[Practice this problem on CodeJeet](/problem/find-edges-in-shortest-paths)
