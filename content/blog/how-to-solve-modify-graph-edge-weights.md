---
title: "How to Solve Modify Graph Edge Weights — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Modify Graph Edge Weights. Hard difficulty, 55.6% acceptance rate. Topics: Graph Theory, Heap (Priority Queue), Shortest Path."
date: "2028-02-16"
category: "dsa-patterns"
tags:
  ["modify-graph-edge-weights", "graph-theory", "heap-(priority-queue)", "shortest-path", "hard"]
---

# How to Solve Modify Graph Edge Weights

You're given a connected undirected graph where some edges have fixed positive weights while others have weight `-1` (modifiable). Your task is to assign positive integer weights to all `-1` edges so that the shortest path from node `0` to node `n-1` equals a given `target` value. If impossible, return an empty array. This problem is tricky because you need to simultaneously consider shortest path constraints while assigning weights to multiple edges—a classic example of constrained optimization in graphs.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- n = 3
- edges = [[0,1,2], [1,2,-1], [0,2,5]]
- target = 4

**Step 1:** Identify modifiable edges

- Edge [0,1] has weight 2 (fixed)
- Edge [1,2] has weight -1 (modifiable)
- Edge [0,2] has weight 5 (fixed)

**Step 2:** Consider the current shortest path
Without modifying the -1 edge, the shortest path from 0 to 2 is:

- Path 1: 0→1→2 = 2 + ? (unknown)
- Path 2: 0→2 = 5 (direct)

**Step 3:** Think about constraints
We need the shortest path to equal exactly 4. Let's call the modifiable edge weight `x`:

- If we set x = 1: Path 0→1→2 = 2+1=3, Path 0→2=5 → shortest = 3 (too small)
- If we set x = 2: Path 0→1→2 = 2+2=4, Path 0→2=5 → shortest = 4 (perfect!)
- If we set x = 3: Path 0→1→2 = 2+3=5, Path 0→2=5 → shortest = 5 (too large)

**Step 4:** The key insight
We need to find weight assignments where the path through modifiable edges becomes exactly the target, but not shorter than any other path. This requires running Dijkstra's algorithm twice: once with all -1 edges set to 1 (minimum possible), and once with them set to a large value, then adjusting weights strategically.

## Brute Force Approach

A naive approach would try all possible weight assignments to the -1 edges. Since weights must be positive integers and could theoretically be very large, this is infeasible. Even if we bound the weights, with k modifiable edges, we'd have exponential possibilities (m^k where m is the maximum weight).

What a candidate might initially consider:

1. Try assigning random weights to -1 edges
2. Run Dijkstra to check if shortest path = target
3. Repeat until found or exhausted possibilities

This fails because:

- Search space is enormous (combinatorial explosion)
- No systematic way to adjust weights
- Might miss valid solutions due to arbitrary bounds

The brute force teaches us we need a more intelligent, constraint-based approach rather than blind search.

## Optimized Approach

The key insight is to use **two Dijkstra computations** with different initial weight assignments:

1. **First Dijkstra (lower bound):** Set all -1 edges to weight 1 (minimum possible). Compute shortest distances from node 0. Let `dist1[n-1]` be the shortest distance to target node.

2. **Second Dijkstra (upper bound):** Set all -1 edges to a very large value (like `2 * 10^9`). Compute shortest distances from node n-1 (backwards). Let `dist2[0]` be the shortest distance from start.

3. **The gap analysis:**
   - If `dist1[n-1] > target`: Impossible, because even with minimum weights, shortest path is already too long.
   - If `dist1[n-1] == target`: We're done! Assign all -1 edges weight 1.
   - If `dist1[n-1] < target`: We need to increase some -1 edge weights to make the shortest path exactly target.

4. **Strategic weight adjustment:** For each -1 edge (u, v):
   - The path 0→u→v→(n-1) has length: `dist1[u] + w + dist2[v]`
   - The path 0→v→u→(n-1) has length: `dist1[v] + w + dist2[u]`
   - We want the shortest of these to be exactly target
   - We can calculate how much we need to increase w to make one of these paths equal target

5. **Greedy adjustment:** Process edges in any order. For each -1 edge, calculate the maximum we can increase its weight without making the shortest path exceed target. This ensures we don't accidentally create a new shorter path.

This approach works because:

- We're systematically exploring the "gap" between current and target distance
- Each adjustment is calculated based on global shortest path constraints
- We never overshoot the target

## Optimal Solution

<div class="code-group">

```python
# Time: O(E log V) where E = number of edges, V = number of vertices
# Space: O(V + E) for storing graph and distances
from heapq import heappush, heappop
from math import inf

def modifiedGraphEdges(n, edges, source, destination, target):
    # Step 1: Build adjacency list, track modifiable edges
    adj = [[] for _ in range(n)]
    modifiable_edges = []

    for i, (u, v, w) in enumerate(edges):
        adj[u].append((v, w, i))
        adj[v].append((u, w, i))
        if w == -1:
            modifiable_edges.append(i)

    # Step 2: First Dijkstra with all -1 edges set to 1 (minimum)
    def dijkstra(start, initial_weight):
        dist = [inf] * n
        dist[start] = 0
        heap = [(0, start)]

        while heap:
            d, u = heappop(heap)
            if d > dist[u]:
                continue

            for v, w, idx in adj[u]:
                # Use initial_weight for modifiable edges
                edge_weight = initial_weight if w == -1 else w
                if edge_weight == -1:
                    continue  # Should not happen with proper initial_weight

                new_dist = d + edge_weight
                if new_dist < dist[v]:
                    dist[v] = new_dist
                    heappush(heap, (new_dist, v))
        return dist

    # Run first Dijkstra from source with weight = 1 for -1 edges
    dist_from_source = dijkstra(source, 1)

    # If minimum possible distance is already > target, impossible
    if dist_from_source[destination] > target:
        return []

    # If minimum equals target, assign all -1 edges weight 1
    if dist_from_source[destination] == target:
        for idx in modifiable_edges:
            edges[idx][2] = 1
        return edges

    # Step 3: Second Dijkstra from destination with large weight for -1 edges
    dist_to_dest = dijkstra(destination, 10**9)

    # Step 4: Adjust modifiable edge weights greedily
    for idx in modifiable_edges:
        u, v, _ = edges[idx]

        # Calculate current path lengths through this edge
        path1 = dist_from_source[u] + 1 + dist_to_dest[v]
        path2 = dist_from_source[v] + 1 + dist_to_dest[u]

        # We want to increase weight to make shortest path = target
        # But we must consider both directions
        current_min = min(path1, path2)

        if current_min < target:
            # We can increase this edge's weight
            increase = target - current_min
            edges[idx][2] = 1 + increase

            # Update distances from source since we changed an edge weight
            # This is crucial: the change affects future calculations
            dist_from_source = dijkstra(source, 1)

            # Check if we've reached target
            if dist_from_source[destination] == target:
                # Fill remaining -1 edges with large weights
                for remaining_idx in modifiable_edges:
                    if edges[remaining_idx][2] == -1:
                        edges[remaining_idx][2] = 10**9
                return edges

    # If we get here, we couldn't reach target
    return []
```

```javascript
// Time: O(E log V) where E = number of edges, V = number of vertices
// Space: O(V + E) for storing graph and distances
function modifiedGraphEdges(n, edges, source, destination, target) {
  // Step 1: Build adjacency list and track modifiable edges
  const adj = Array.from({ length: n }, () => []);
  const modifiableEdges = [];

  edges.forEach(([u, v, w], idx) => {
    adj[u].push([v, w, idx]);
    adj[v].push([u, w, idx]);
    if (w === -1) {
      modifiableEdges.push(idx);
    }
  });

  // Step 2: Dijkstra implementation
  const dijkstra = (start, initialWeight) => {
    const dist = Array(n).fill(Infinity);
    dist[start] = 0;
    const heap = [[0, start]];

    while (heap.length > 0) {
      const [d, u] = heap.shift();
      if (d > dist[u]) continue;

      for (const [v, w, idx] of adj[u]) {
        const edgeWeight = w === -1 ? initialWeight : w;
        if (edgeWeight === -1) continue;

        const newDist = d + edgeWeight;
        if (newDist < dist[v]) {
          dist[v] = newDist;
          heap.push([newDist, v]);
          heap.sort((a, b) => a[0] - b[0]); // Min-heap simulation
        }
      }
    }
    return dist;
  };

  // First Dijkstra with weight = 1 for -1 edges
  let distFromSource = dijkstra(source, 1);

  // Check if minimum possible distance exceeds target
  if (distFromSource[destination] > target) return [];

  // If minimum equals target, assign weight 1 to all -1 edges
  if (distFromSource[destination] === target) {
    modifiableEdges.forEach((idx) => {
      edges[idx][2] = 1;
    });
    return edges;
  }

  // Second Dijkstra from destination with large weight
  const distToDest = dijkstra(destination, 2e9);

  // Adjust modifiable edges greedily
  for (const idx of modifiableEdges) {
    const [u, v] = edges[idx];

    // Calculate path lengths through this edge in both directions
    const path1 = distFromSource[u] + 1 + distToDest[v];
    const path2 = distFromSource[v] + 1 + distToDest[u];
    const currentMin = Math.min(path1, path2);

    if (currentMin < target) {
      // Increase this edge's weight to help reach target
      const increase = target - currentMin;
      edges[idx][2] = 1 + increase;

      // Recompute distances since we changed an edge
      distFromSource = dijkstra(source, 1);

      // Check if we've reached the target
      if (distFromSource[destination] === target) {
        // Fill remaining -1 edges with large weights
        modifiableEdges.forEach((remainingIdx) => {
          if (edges[remainingIdx][2] === -1) {
            edges[remainingIdx][2] = 2e9;
          }
        });
        return edges;
      }
    }
  }

  // Could not achieve target distance
  return [];
}
```

```java
// Time: O(E log V) where E = number of edges, V = number of vertices
// Space: O(V + E) for storing graph and distances
import java.util.*;

class Solution {
    public int[][] modifiedGraphEdges(int n, int[][] edges, int source, int destination, int target) {
        // Step 1: Build adjacency list and track modifiable edges
        List<int[]>[] adj = new List[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
        List<Integer> modifiableEdges = new ArrayList<>();

        for (int i = 0; i < edges.length; i++) {
            int u = edges[i][0], v = edges[i][1], w = edges[i][2];
            adj[u].add(new int[]{v, w, i});
            adj[v].add(new int[]{u, w, i});
            if (w == -1) modifiableEdges.add(i);
        }

        // Step 2: Dijkstra implementation
        long[] dijkstra(int start, long initialWeight) {
            long[] dist = new long[n];
            Arrays.fill(dist, Long.MAX_VALUE);
            dist[start] = 0;
            PriorityQueue<long[]> heap = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
            heap.offer(new long[]{0, start});

            while (!heap.isEmpty()) {
                long[] curr = heap.poll();
                long d = curr[0];
                int u = (int)curr[1];

                if (d > dist[u]) continue;

                for (int[] neighbor : adj[u]) {
                    int v = neighbor[0];
                    int w = neighbor[1];
                    int idx = neighbor[2];

                    long edgeWeight = (w == -1) ? initialWeight : w;
                    if (edgeWeight == -1) continue;

                    long newDist = d + edgeWeight;
                    if (newDist < dist[v]) {
                        dist[v] = newDist;
                        heap.offer(new long[]{newDist, v});
                    }
                }
            }
            return dist;
        }

        // First Dijkstra with weight = 1 for -1 edges
        long[] distFromSource = dijkstra(source, 1);

        // Check if minimum possible distance exceeds target
        if (distFromSource[destination] > target) return new int[0][0];

        // If minimum equals target, assign weight 1 to all -1 edges
        if (distFromSource[destination] == target) {
            for (int idx : modifiableEdges) edges[idx][2] = 1;
            return edges;
        }

        // Second Dijkstra from destination with large weight
        long[] distToDest = dijkstra(destination, 2000000000);

        // Adjust modifiable edges greedily
        for (int idx : modifiableEdges) {
            int u = edges[idx][0], v = edges[idx][1];

            // Calculate path lengths through this edge
            long path1 = distFromSource[u] + 1 + distToDest[v];
            long path2 = distFromSource[v] + 1 + distToDest[u];
            long currentMin = Math.min(path1, path2);

            if (currentMin < target) {
                // Increase this edge's weight
                long increase = target - currentMin;
                edges[idx][2] = (int)(1 + increase);

                // Recompute distances
                distFromSource = dijkstra(source, 1);

                // Check if target reached
                if (distFromSource[destination] == target) {
                    // Fill remaining -1 edges with large weights
                    for (int remainingIdx : modifiableEdges) {
                        if (edges[remainingIdx][2] == -1) {
                            edges[remainingIdx][2] = 2000000000;
                        }
                    }
                    return edges;
                }
            }
        }

        // Could not achieve target
        return new int[0][0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(E log V)

- We run Dijkstra's algorithm multiple times (at most k+2 times where k is number of modifiable edges)
- Each Dijkstra run takes O(E log V) using a priority queue
- In worst case, we might run Dijkstra for each modifiable edge, giving O(kE log V)
- Since k ≤ E, overall O(E² log V) in worst case, but typically much better

**Space Complexity:** O(V + E)

- Adjacency list: O(E) to store all edges
- Distance arrays: O(V) for each Dijkstra run
- Priority queue: O(V) in worst case
- Total: O(V + E)

The complexity is acceptable because:

- n ≤ 100, edges ≤ n\*(n-1)/2 ≈ 4950
- Even O(E² log V) is manageable for these constraints
- Most real cases require far fewer Dijkstra recomputations

## Common Mistakes

1. **Forgetting to recompute distances after modifying an edge:** After increasing a modifiable edge's weight, the shortest path distances change. You must run Dijkstra again to get updated distances for subsequent calculations.

2. **Using the wrong initial values for -1 edges:** In the second Dijkstra (from destination), you need to use a very large value (like 2×10⁹) for -1 edges, not 1. Using 1 would give incorrect "upper bound" distances.

3. **Not checking both directions for undirected edges:** When calculating path length through an edge (u,v), you must check both 0→u→v→(n-1) and 0→v→u→(n-1) because the graph is undirected.

4. **Integer overflow with large weights:** When using large values (10⁹ range) and adding distances, use 64-bit integers (long in Java, BigInt in JavaScript) to avoid overflow.

5. **Assuming a single adjustment is enough:** You might need to adjust multiple edges to reach the target distance. The greedy approach processes edges one by one until the target is reached or all edges are processed.

## When You'll See This Pattern

This problem combines several important graph patterns:

1. **Constrained Shortest Path:** Similar to "Cheapest Flights Within K Stops" (LeetCode 787) where you have constraints on the path, though here the constraint is on the total distance rather than number of stops.

2. **Dijkstra with State:** Like "Network Delay Time" (LeetCode 743) but with modifiable edge weights. The two-pass Dijkstra approach is reminiscent of "Path With Minimum Effort" (LeetCode 1631) where you use binary search with Dijkstra.

3. **Parameter Optimization in Graphs:** The pattern of finding optimal parameters (edge weights here) to achieve a specific shortest path distance appears in network design and resource allocation problems.

4. **Bidirectional Search:** Running Dijkstra from both start and end nodes is a common optimization for shortest path problems, seen in "Word Ladder II" (LeetCode 127) and other search problems.

## Key Takeaways

1. **Two-pass Dijkstra is powerful:** When dealing with constrained shortest path problems, running Dijkstra from both start and end can provide bounds that help find optimal solutions.

2. **Greedy adjustments with recomputation:** When you need to adjust parameters to meet a target, adjust greedily based on current state, then recompute to see the effects. This is more efficient than trying all combinations.

3. **Think in terms of constraints:** Instead of searching all possibilities, formulate the problem as constraints (lower bound, upper bound, gap to fill) and solve systematically.

4. **Undirected graphs need bidirectional checks:** Always consider both directions when calculating paths through edges in undirected graphs.

[Practice this problem on CodeJeet](/problem/modify-graph-edge-weights)
