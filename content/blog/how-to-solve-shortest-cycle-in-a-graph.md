---
title: "How to Solve Shortest Cycle in a Graph — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Shortest Cycle in a Graph. Hard difficulty, 39.2% acceptance rate. Topics: Breadth-First Search, Graph Theory."
date: "2029-05-04"
category: "dsa-patterns"
tags: ["shortest-cycle-in-a-graph", "breadth-first-search", "graph-theory", "hard"]
---

# How to Solve Shortest Cycle in a Graph

Finding the shortest cycle in an undirected graph is a classic graph theory problem that tests your understanding of BFS traversal and cycle detection. What makes this problem tricky is that cycles can be detected in multiple ways, but finding the _shortest_ one requires careful handling of edge cases—particularly because the graph is bi-directional, meaning edges can be traversed in both directions, which can lead to immediately detecting false cycles if you're not careful.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Consider a graph with `n = 5` vertices and edges: `[[0,1], [1,2], [2,3], [3,4], [4,0], [1,4]]`.

```
    0
   / \
  1---4
  | \ |
  2---3
```

We need to find the shortest cycle. Let's trace what happens:

1. Start BFS from node 0:
   - Level 0: {0} (distance 0)
   - Level 1: {1, 4} (distance 1 from 0)
   - Level 2: From 1: {2, 4} (but 4 is already visited)
     From 4: {1, 3} (but 1 is already visited)

   When we try to add neighbor 4 from node 1, we notice 4 was visited at distance 1 (same as node 1's distance from 0). This means we found a potential cycle: 0→1→4→0. The cycle length would be `dist[0] + dist[1] + 1 = 0 + 1 + 1 = 2` edges? Wait, let's think carefully...

Actually, the key insight: when BFS encounters a node that's already been visited, we need to check if it's the _immediate parent_ (the node we just came from) or a different node. If it's a different node at the same or smaller distance, we've found a cycle!

Let's trace more carefully:

- Start BFS from node 0, parent = -1
- Visit 0: mark visited, distance = 0
- Process 0's neighbors: 1 and 4
  - For neighbor 1: not visited, so queue it with distance = 1, parent = 0
  - For neighbor 4: not visited, so queue it with distance = 1, parent = 0
- Process 1 (distance = 1, parent = 0):
  - Neighbor 0: visited but parent (0) = neighbor (0), so skip (came from here)
  - Neighbor 2: not visited, queue with distance = 2, parent = 1
  - Neighbor 4: visited! And parent (0) ≠ neighbor (4), so we found a cycle!
    Cycle length = dist[1] + dist[4] + 1 = 1 + 1 + 1 = 3 edges (0-1-4-0)

The shortest cycle in this graph is actually triangle 0-1-4 with 3 edges. Our BFS from node 0 found it!

## Brute Force Approach

A naive approach might try to find all cycles and then pick the shortest. One brute force method would be:

1. For each edge (u, v), temporarily remove it from the graph
2. Find the shortest path between u and v using BFS
3. If a path exists, then u → path → v → u forms a cycle
4. The cycle length would be path length + 1
5. Track the minimum such cycle length

This approach has several issues:

- Removing each edge and running BFS is expensive: O(E × (V+E)) time
- It doesn't handle multiple cycles sharing edges well
- The implementation is complex with many edge cases

The main problem is efficiency: with V vertices and E edges, this could be O(V × E²) in worst case, which is far too slow for constraints where n can be up to 1000.

## Optimized Approach

The key insight is that in an undirected graph, the shortest cycle containing a particular edge (u, v) can be found by removing that edge and finding the shortest path between u and v. But we can do better: we don't need to physically remove edges.

Instead, we use BFS from each node, but with a crucial modification: we track not just visited nodes, but also their distance from the source AND their parent. When we encounter a neighbor that's already been visited AND it's not our immediate parent, we've found a cycle! The cycle length is `dist[current] + dist[neighbor] + 1`.

Why does this work?

1. BFS finds shortest paths from the source to all other nodes
2. When we find a visited neighbor that's not our parent, it means there are two different paths from the source to this neighbor
3. These two paths form a cycle with the edge between current and neighbor
4. Since BFS gives shortest paths, this is the shortest cycle containing that particular back edge

We run BFS from each node because the shortest cycle might not be found from every starting point. The minimum over all BFS runs gives us the global shortest cycle.

## Optimal Solution

The optimal solution performs BFS from each node, tracking distances and parents. When we find a visited neighbor that's not our parent, we calculate the cycle length and update our answer. We stop early if we find a cycle of length 3 (the smallest possible in a simple graph).

<div class="code-group">

```python
# Time: O(V * (V + E)) | Space: O(V + E)
def findShortestCycle(n, edges):
    """
    Find the shortest cycle in an undirected graph.

    Args:
        n: Number of vertices (0 to n-1)
        edges: List of [u, v] pairs representing edges

    Returns:
        Length of shortest cycle, or -1 if no cycle exists
    """
    # Build adjacency list for the graph
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)

    # Initialize answer to a large value
    shortest_cycle = float('inf')

    # Run BFS from each node as starting point
    for start in range(n):
        # Arrays to track distance from start and parent in BFS tree
        dist = [-1] * n  # -1 means not visited
        parent = [-1] * n  # -1 means no parent

        # Initialize BFS queue with starting node
        from collections import deque
        queue = deque([start])
        dist[start] = 0

        while queue:
            current = queue.popleft()

            # Explore all neighbors of current node
            for neighbor in adj[current]:
                # If neighbor is not visited yet
                if dist[neighbor] == -1:
                    dist[neighbor] = dist[current] + 1
                    parent[neighbor] = current
                    queue.append(neighbor)
                # If neighbor is visited AND it's not the parent of current
                # (not the node we just came from)
                elif parent[current] != neighbor:
                    # Found a cycle! Calculate its length
                    # The cycle consists of: path from start to current +
                    # path from start to neighbor + the edge between them
                    cycle_length = dist[current] + dist[neighbor] + 1
                    shortest_cycle = min(shortest_cycle, cycle_length)

        # Early exit: if we found a triangle (shortest possible cycle)
        if shortest_cycle == 3:
            return 3

    # Return -1 if no cycle found, otherwise the shortest cycle length
    return -1 if shortest_cycle == float('inf') else shortest_cycle
```

```javascript
// Time: O(V * (V + E)) | Space: O(V + E)
function findShortestCycle(n, edges) {
  /**
   * Find the shortest cycle in an undirected graph.
   *
   * @param {number} n - Number of vertices (0 to n-1)
   * @param {number[][]} edges - Array of [u, v] pairs representing edges
   * @return {number} - Length of shortest cycle, or -1 if no cycle exists
   */

  // Build adjacency list for the graph
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // Initialize answer to a large value
  let shortestCycle = Infinity;

  // Run BFS from each node as starting point
  for (let start = 0; start < n; start++) {
    // Arrays to track distance from start and parent in BFS tree
    const dist = Array(n).fill(-1); // -1 means not visited
    const parent = Array(n).fill(-1); // -1 means no parent

    // Initialize BFS queue with starting node
    const queue = [start];
    dist[start] = 0;

    let front = 0; // Pointer for queue front (simulating deque)

    while (front < queue.length) {
      const current = queue[front++];

      // Explore all neighbors of current node
      for (const neighbor of adj[current]) {
        // If neighbor is not visited yet
        if (dist[neighbor] === -1) {
          dist[neighbor] = dist[current] + 1;
          parent[neighbor] = current;
          queue.push(neighbor);
        }
        // If neighbor is visited AND it's not the parent of current
        // (not the node we just came from)
        else if (parent[current] !== neighbor) {
          // Found a cycle! Calculate its length
          // The cycle consists of: path from start to current +
          // path from start to neighbor + the edge between them
          const cycleLength = dist[current] + dist[neighbor] + 1;
          shortestCycle = Math.min(shortestCycle, cycleLength);
        }
      }
    }

    // Early exit: if we found a triangle (shortest possible cycle)
    if (shortestCycle === 3) {
      return 3;
    }
  }

  // Return -1 if no cycle found, otherwise the shortest cycle length
  return shortestCycle === Infinity ? -1 : shortestCycle;
}
```

```java
// Time: O(V * (V + E)) | Space: O(V + E)
import java.util.*;

class Solution {
    public int findShortestCycle(int n, int[][] edges) {
        /**
         * Find the shortest cycle in an undirected graph.
         *
         * @param n: Number of vertices (0 to n-1)
         * @param edges: Array of [u, v] pairs representing edges
         * @return: Length of shortest cycle, or -1 if no cycle exists
         */

        // Build adjacency list for the graph
        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            adj[u].add(v);
            adj[v].add(u);
        }

        // Initialize answer to a large value
        int shortestCycle = Integer.MAX_VALUE;

        // Run BFS from each node as starting point
        for (int start = 0; start < n; start++) {
            // Arrays to track distance from start and parent in BFS tree
            int[] dist = new int[n];
            int[] parent = new int[n];
            Arrays.fill(dist, -1);  // -1 means not visited
            Arrays.fill(parent, -1);  // -1 means no parent

            // Initialize BFS queue with starting node
            Queue<Integer> queue = new LinkedList<>();
            queue.offer(start);
            dist[start] = 0;

            while (!queue.isEmpty()) {
                int current = queue.poll();

                // Explore all neighbors of current node
                for (int neighbor : adj[current]) {
                    // If neighbor is not visited yet
                    if (dist[neighbor] == -1) {
                        dist[neighbor] = dist[current] + 1;
                        parent[neighbor] = current;
                        queue.offer(neighbor);
                    }
                    // If neighbor is visited AND it's not the parent of current
                    // (not the node we just came from)
                    else if (parent[current] != neighbor) {
                        // Found a cycle! Calculate its length
                        // The cycle consists of: path from start to current +
                        // path from start to neighbor + the edge between them
                        int cycleLength = dist[current] + dist[neighbor] + 1;
                        shortestCycle = Math.min(shortestCycle, cycleLength);
                    }
                }
            }

            // Early exit: if we found a triangle (shortest possible cycle)
            if (shortestCycle == 3) {
                return 3;
            }
        }

        // Return -1 if no cycle found, otherwise the shortest cycle length
        return shortestCycle == Integer.MAX_VALUE ? -1 : shortestCycle;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(V × (V + E))

- We run BFS from each of the V vertices
- Each BFS traversal visits all vertices and edges in the connected component: O(V + E)
- In the worst case (complete graph), E = O(V²), so complexity becomes O(V³)
- However, we have an early exit when we find a cycle of length 3, which helps in practice

**Space Complexity:** O(V + E)

- Adjacency list storage: O(V + E)
- BFS data structures (dist, parent, queue): O(V)
- Total: O(V + E)

The O(V³) worst-case might seem high, but for n ≤ 1000 (typical constraints), this is acceptable. There are more advanced algorithms that run in O(V²), but they're significantly more complex and not expected in interviews.

## Common Mistakes

1. **Forgetting to check parent relationship**: The most common error is treating every visited neighbor as a cycle. In undirected graphs, each edge is bidirectional, so when you go from A to B, B's neighbor list includes A. If you don't check that the visited neighbor isn't your parent, you'll incorrectly count the edge you just traversed as a 2-edge cycle.

2. **Not running BFS from each node**: Some candidates try to run BFS once and think it will find all cycles. However, the shortest cycle might not be discovered from every starting node because BFS finds shortest paths from the source, and the cycle might not include the source node in the optimal way.

3. **Incorrect cycle length calculation**: When you find a visited neighbor that's not your parent, the cycle length is `dist[current] + dist[neighbor] + 1`, not just `dist[current] + 1` or `dist[neighbor] + 1`. You need to include both paths from the source to the two nodes plus the connecting edge.

4. **Missing the early exit for triangles**: A triangle (3-node cycle) is the shortest possible cycle in a simple graph. Once you find one, you can return immediately since no cycle can be shorter. Forgetting this optimization won't break correctness but misses an easy performance gain.

## When You'll See This Pattern

This BFS-with-parent-tracking pattern appears in several graph problems:

1. **Redundant Connection (LeetCode 684)**: Find an edge that can be removed to make the graph a tree. You can use union-find, but BFS/DFS cycle detection also works.

2. **Longest Cycle in a Graph (LeetCode 2360)**: Similar concept but for directed graphs and finding the longest cycle instead of shortest. Requires different cycle detection (often using DFS with recursion stack).

3. **Divide Nodes Into the Maximum Number of Groups (LeetCode 2493)**: Requires understanding graph structure and cycles to determine if bipartite grouping is possible.

The core technique of BFS with distance tracking and parent checking is fundamental for undirected graph cycle detection and shortest path problems in unweighted graphs.

## Key Takeaways

1. **BFS finds shortest paths in unweighted graphs**: This property makes it ideal for finding shortest cycles when combined with careful parent tracking to avoid false cycles from bidirectional edges.

2. **Cycle detection in undirected graphs requires parent tracking**: Unlike directed graphs where you can use recursion stack, undirected graphs need explicit parent checks to avoid counting the edge you just came from as a cycle.

3. **Sometimes brute force over starting points is acceptable**: While O(V³) seems high, for practical constraints and interview settings, starting BFS from each node is often the simplest correct solution. Always mention that more optimal algorithms exist but this is the most straightforward to implement correctly under time pressure.

Related problems: [Redundant Connection](/problem/redundant-connection), [Longest Cycle in a Graph](/problem/longest-cycle-in-a-graph), [Divide Nodes Into the Maximum Number of Groups](/problem/divide-nodes-into-the-maximum-number-of-groups)
