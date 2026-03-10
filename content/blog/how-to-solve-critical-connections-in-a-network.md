---
title: "How to Solve Critical Connections in a Network — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Critical Connections in a Network. Hard difficulty, 59.3% acceptance rate. Topics: Depth-First Search, Graph Theory, Biconnected Component."
date: "2027-12-10"
category: "dsa-patterns"
tags:
  [
    "critical-connections-in-a-network",
    "depth-first-search",
    "graph-theory",
    "biconnected-component",
    "hard",
  ]
---

# How to Solve Critical Connections in a Network

This problem asks us to find all critical connections in a network—connections that, if removed, would make some servers unreachable from others. What makes this problem interesting is that it's essentially finding bridges in an undirected graph, a classic graph theory problem that requires understanding depth-first search timestamps and low-link values.

## Visual Walkthrough

Let's trace through a small example with 4 servers and connections: `[[0,1],[1,2],[2,0],[1,3]]`

```
    0
   / \
  1---2
  |
  3
```

We need to find which connections are critical (bridges). Let's think about what makes a connection critical:

1. **Connection [0,1]**: If we remove it, server 0 is still connected to the network through 0-2-1. Not critical.
2. **Connection [1,2]**: If we remove it, server 2 is still connected through 2-0-1. Not critical.
3. **Connection [2,0]**: If we remove it, server 0 is still connected through 0-1-2. Not critical.
4. **Connection [1,3]**: If we remove it, server 3 becomes completely disconnected! This IS critical.

The key insight: A connection is critical if it's not part of any cycle. Connections [0,1], [1,2], and [2,0] form a cycle, so none of them are critical. But [1,3] is a "dead end" connection—removing it isolates server 3.

## Brute Force Approach

A naive approach would be: for each connection, temporarily remove it from the graph, then check if the graph remains connected using BFS/DFS. If the graph becomes disconnected, that connection is critical.

**Why this fails:**

- Time complexity: O(E × (V+E)) where we do a BFS/DFS for each of E edges
- For n=10⁵ servers, this could be O(10⁵ × 10⁵) = O(10¹⁰) operations, which is far too slow
- We need a linear-time algorithm: O(V+E)

The brute force teaches us what we're looking for (connections whose removal disconnects the graph), but we need a smarter way to identify them without repeatedly checking connectivity.

## Optimized Approach

The optimal solution uses **Tarjan's algorithm** for finding bridges in an undirected graph. Here's the step-by-step reasoning:

1. **DFS Timestamps**: As we DFS through the graph, we assign each node a "discovery time" (when we first visit it). This creates a DFS tree.

2. **Low-link Values**: For each node, we compute the lowest discovery time reachable from that node, including through back edges (edges to already-visited nodes).

3. **Bridge Condition**: An edge (u,v) is a bridge if `low[v] > disc[u]`. This means: the lowest discovery time reachable from v is greater than the discovery time of u. In other words, v cannot reach u or any ancestor of u through any path other than the direct edge (u,v).

4. **Why this works**: If `low[v] <= disc[u]`, then v can reach some ancestor of u through an alternative path, meaning (u,v) is part of a cycle and thus not critical.

The algorithm proceeds as follows:

- Build adjacency list from connections
- Perform DFS from each unvisited node
- Track discovery times and low values
- When exploring edge u→v:
  - If v is unvisited: recurse, then update low[u] = min(low[u], low[v])
  - If v is already visited (back edge): update low[u] = min(low[u], disc[v])
  - Check bridge condition after recursion

## Optimal Solution

<div class="code-group">

```python
# Time: O(V + E) where V = n servers, E = len(connections)
# Space: O(V + E) for adjacency list, recursion stack, and arrays
class Solution:
    def criticalConnections(self, n: int, connections: List[List[int]]) -> List[List[int]]:
        # Step 1: Build adjacency list for the graph
        graph = [[] for _ in range(n)]
        for u, v in connections:
            graph[u].append(v)
            graph[v].append(u)

        # Step 2: Initialize arrays for discovery times and low values
        disc = [-1] * n  # Discovery time of each node
        low = [-1] * n   # Lowest discovery time reachable from each node
        time = [0]       # Current time counter (use list for mutable reference)
        result = []      # Store critical connections

        # Step 3: DFS function to find bridges
        def dfs(u, parent):
            # Set discovery time and low value for current node
            disc[u] = low[u] = time[0]
            time[0] += 1

            # Explore all neighbors
            for v in graph[u]:
                # Skip the edge back to parent (undirected graph)
                if v == parent:
                    continue

                if disc[v] == -1:  # v is not visited yet (tree edge)
                    dfs(v, u)
                    # After DFS returns, update low[u] with low[v]
                    low[u] = min(low[u], low[v])

                    # Check if edge u-v is a bridge
                    if low[v] > disc[u]:
                        result.append([u, v])
                else:  # v is already visited (back edge)
                    # Update low[u] with discovery time of v
                    low[u] = min(low[u], disc[v])

        # Step 4: Run DFS from each unvisited node (graph might be disconnected)
        for i in range(n):
            if disc[i] == -1:
                dfs(i, -1)

        return result
```

```javascript
// Time: O(V + E) where V = n servers, E = connections.length
// Space: O(V + E) for adjacency list, recursion stack, and arrays
/**
 * @param {number} n
 * @param {number[][]} connections
 * @return {number[][]}
 */
var criticalConnections = function (n, connections) {
  // Step 1: Build adjacency list for the graph
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of connections) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Step 2: Initialize arrays for discovery times and low values
  const disc = new Array(n).fill(-1); // Discovery time of each node
  const low = new Array(n).fill(-1); // Lowest discovery time reachable
  let time = 0; // Current time counter
  const result = []; // Store critical connections

  // Step 3: DFS function to find bridges
  const dfs = (u, parent) => {
    // Set discovery time and low value for current node
    disc[u] = low[u] = time;
    time++;

    // Explore all neighbors
    for (const v of graph[u]) {
      // Skip the edge back to parent (undirected graph)
      if (v === parent) {
        continue;
      }

      if (disc[v] === -1) {
        // v is not visited yet (tree edge)
        dfs(v, u);
        // After DFS returns, update low[u] with low[v]
        low[u] = Math.min(low[u], low[v]);

        // Check if edge u-v is a bridge
        if (low[v] > disc[u]) {
          result.push([u, v]);
        }
      } else {
        // v is already visited (back edge)
        // Update low[u] with discovery time of v
        low[u] = Math.min(low[u], disc[v]);
      }
    }
  };

  // Step 4: Run DFS from each unvisited node (graph might be disconnected)
  for (let i = 0; i < n; i++) {
    if (disc[i] === -1) {
      dfs(i, -1);
    }
  }

  return result;
};
```

```java
// Time: O(V + E) where V = n servers, E = connections.size()
// Space: O(V + E) for adjacency list, recursion stack, and arrays
class Solution {
    private List<Integer>[] graph;
    private int[] disc;
    private int[] low;
    private int time;
    private List<List<Integer>> result;

    public List<List<Integer>> criticalConnections(int n, List<List<Integer>> connections) {
        // Step 1: Build adjacency list for the graph
        graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (List<Integer> conn : connections) {
            int u = conn.get(0);
            int v = conn.get(1);
            graph[u].add(v);
            graph[v].add(u);
        }

        // Step 2: Initialize arrays for discovery times and low values
        disc = new int[n];
        low = new int[n];
        Arrays.fill(disc, -1);
        time = 0;
        result = new ArrayList<>();

        // Step 3: Run DFS from each unvisited node (graph might be disconnected)
        for (int i = 0; i < n; i++) {
            if (disc[i] == -1) {
                dfs(i, -1);
            }
        }

        return result;
    }

    private void dfs(int u, int parent) {
        // Set discovery time and low value for current node
        disc[u] = low[u] = time;
        time++;

        // Explore all neighbors
        for (int v : graph[u]) {
            // Skip the edge back to parent (undirected graph)
            if (v == parent) {
                continue;
            }

            if (disc[v] == -1) {  // v is not visited yet (tree edge)
                dfs(v, u);
                // After DFS returns, update low[u] with low[v]
                low[u] = Math.min(low[u], low[v]);

                // Check if edge u-v is a bridge
                if (low[v] > disc[u]) {
                    result.add(Arrays.asList(u, v));
                }
            } else {  // v is already visited (back edge)
                // Update low[u] with discovery time of v
                low[u] = Math.min(low[u], disc[v]);
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(V + E)**

- Building adjacency list: O(E)
- DFS traversal: O(V + E) since we visit each node once and each edge once
- Total: O(V + E)

**Space Complexity: O(V + E)**

- Adjacency list: O(E)
- disc and low arrays: O(V)
- Recursion stack in worst case: O(V) (if graph is a line)
- Result list: O(E) in worst case (if all edges are bridges)
- Total: O(V + E)

## Common Mistakes

1. **Forgetting to handle parent node in undirected graphs**: When exploring neighbors, you must skip the edge back to the parent. Otherwise, you'll incorrectly treat it as a back edge and get wrong low values.

2. **Using low[v] instead of disc[v] for back edges**: When updating low[u] for a back edge to v, use `disc[v]` not `low[v]`. Using `low[v]` can propagate low values incorrectly across bridges.

3. **Not handling disconnected graphs**: The problem states "any server can reach other servers," but your algorithm should still handle potential disconnections gracefully by running DFS from each unvisited node.

4. **Confusing discovery time with low value**: Discovery time (`disc[u]`) is when we first visit u. Low value (`low[u]`) is the earliest discovery time reachable from u. The bridge condition checks `low[v] > disc[u]`, not `low[v] > low[u]`.

## When You'll See This Pattern

This Tarjan's bridge-finding algorithm appears in problems involving:

- Network reliability analysis (this problem)
- Finding articulation points in graphs (very similar algorithm)
- Decomposing graphs into biconnected components

Related LeetCode problems:

1. **Articulation Points (Critical Routers)**: Similar concept but finding nodes instead of edges. Uses the same low/disc concept with condition `low[v] >= disc[u]`.
2. **Minimum Height Trees**: While different, it also involves analyzing graph connectivity properties.
3. **Redundant Connection**: Finding edges that can be removed without disconnecting the graph (opposite of this problem).

## Key Takeaways

1. **Bridges = edges not in cycles**: A connection is critical if and only if it's not part of any cycle in the graph.
2. **Tarjan's algorithm uses DFS timestamps**: The discovery time gives us an ordering, and low values track reachability to detect cycles.
3. **Bridge condition is `low[v] > disc[u]`**: If the lowest discovery time reachable from v is greater than when we discovered u, then (u,v) is a bridge.

[Practice this problem on CodeJeet](/problem/critical-connections-in-a-network)
