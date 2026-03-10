---
title: "How to Solve Shortest Path in a Weighted Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Shortest Path in a Weighted Tree. Hard difficulty, 42.1% acceptance rate. Topics: Array, Tree, Depth-First Search, Binary Indexed Tree, Segment Tree."
date: "2026-07-22"
category: "dsa-patterns"
tags: ["shortest-path-in-a-weighted-tree", "array", "tree", "depth-first-search", "hard"]
---

# How to Solve Shortest Path in a Weighted Tree

This problem asks us to find the shortest path between two nodes in a weighted tree. While finding the distance between two nodes in an unweighted tree is straightforward with BFS, the weighted aspect adds complexity. What makes this problem interesting is that trees have exactly one unique path between any two nodes, so we're not finding the "shortest" among multiple options but rather calculating the sum of weights along that single unique path.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider a tree with 5 nodes and these edges:

```
edges = [[1,2,3], [1,3,5], [2,4,2], [2,5,7]]
```

This creates the following tree:

```
    1
   / \
  2   3
 / \
4   5
```

Edge weights: 1-2=3, 1-3=5, 2-4=2, 2-5=7

Now let's find the distance between node 4 and node 3:

1. Path from 4 to 3: 4 → 2 → 1 → 3
2. Sum the weights: 2 (4-2) + 3 (2-1) + 5 (1-3) = 10

For node 5 to node 4:

1. Path: 5 → 2 → 4
2. Sum: 7 (5-2) + 2 (2-4) = 9

The key insight is that in a tree, the distance between any two nodes u and v equals:

```
distance(u, v) = distance(root, u) + distance(root, v) - 2 × distance(root, LCA(u, v))
```

Where LCA is the Lowest Common Ancestor. This works because the path from u to v goes up to their LCA and then back down.

## Brute Force Approach

A naive approach would be to perform BFS or DFS from the starting node for each query. For each query (u, v), we could:

1. Perform BFS/DFS from u to find v
2. Sum the weights along the path
3. Return the total distance

The code would look something like this:

<div class="code-group">

```python
# Brute Force - Too slow for large trees
def shortest_path_brute_force(n, edges, queries):
    # Build adjacency list
    graph = [[] for _ in range(n + 1)]
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))

    def bfs_distance(start, end):
        from collections import deque
        visited = [False] * (n + 1)
        queue = deque([(start, 0)])  # (node, cumulative_distance)
        visited[start] = True

        while queue:
            node, dist = queue.popleft()
            if node == end:
                return dist

            for neighbor, weight in graph[node]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append((neighbor, dist + weight))

        return -1  # Should never happen in a tree

    results = []
    for u, v in queries:
        results.append(bfs_distance(u, v))

    return results
```

```javascript
// Brute Force - Too slow for large trees
function shortestPathBruteForce(n, edges, queries) {
  // Build adjacency list
  const graph = Array(n + 1)
    .fill()
    .map(() => []);
  for (const [u, v, w] of edges) {
    graph[u].push([v, w]);
    graph[v].push([u, w]);
  }

  function bfsDistance(start, end) {
    const visited = Array(n + 1).fill(false);
    const queue = [[start, 0]]; // [node, cumulative_distance]
    visited[start] = true;

    while (queue.length > 0) {
      const [node, dist] = queue.shift();
      if (node === end) return dist;

      for (const [neighbor, weight] of graph[node]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push([neighbor, dist + weight]);
        }
      }
    }

    return -1; // Should never happen in a tree
  }

  const results = [];
  for (const [u, v] of queries) {
    results.push(bfsDistance(u, v));
  }

  return results;
}
```

```java
// Brute Force - Too slow for large trees
public List<Integer> shortestPathBruteForce(int n, int[][] edges, int[][] queries) {
    // Build adjacency list
    List<int[]>[] graph = new List[n + 1];
    for (int i = 1; i <= n; i++) {
        graph[i] = new ArrayList<>();
    }
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        graph[u].add(new int[]{v, w});
        graph[v].add(new int[]{u, w});
    }

    List<Integer> results = new ArrayList<>();
    for (int[] query : queries) {
        int u = query[0], v = query[1];
        results.add(bfsDistance(graph, u, v, n));
    }

    return results;
}

private int bfsDistance(List<int[]>[] graph, int start, int end, int n) {
    boolean[] visited = new boolean[n + 1];
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{start, 0});
    visited[start] = true;

    while (!queue.isEmpty()) {
        int[] current = queue.poll();
        int node = current[0], dist = current[1];

        if (node == end) return dist;

        for (int[] neighbor : graph[node]) {
            int nextNode = neighbor[0];
            int weight = neighbor[1];
            if (!visited[nextNode]) {
                visited[nextNode] = true;
                queue.offer(new int[]{nextNode, dist + weight});
            }
        }
    }

    return -1;  // Should never happen in a tree
}
```

</div>

**Why this fails:** For Q queries and N nodes, this approach takes O(Q × N) time, which is too slow when both Q and N can be up to 10⁵. We need to answer each query in O(1) or O(log N) time after preprocessing.

## Optimized Approach

The key insight is that we can precompute distances from the root to all nodes, then use the Lowest Common Ancestor (LCA) to compute distances between any two nodes in O(1) time after O(N log N) preprocessing.

Here's the step-by-step reasoning:

1. **Precompute distances from root**: Perform DFS from node 1 to calculate `dist[node]` = distance from root to node.

2. **Precompute LCA data structures**: We need to answer LCA queries quickly. Two common approaches:
   - Binary Lifting: Precompute `up[node][k]` = the 2^k-th ancestor of node
   - Euler Tour + RMQ: Convert LCA to Range Minimum Query

3. **Answer queries using formula**: For nodes u and v:

   ```
   distance(u, v) = dist[u] + dist[v] - 2 × dist[lca(u, v)]
   ```

   This works because:
   - `dist[u]` is the path from root to u
   - `dist[v]` is the path from root to v
   - `dist[lca(u, v)]` is the path from root to their LCA
   - The path from u to v goes up to LCA (dist[u] - dist[lca]) then down to v (dist[v] - dist[lca])

4. **Binary Lifting for LCA**: For each node, store its 2^k-th ancestors. To find LCA(u, v):
   - Make u and v at the same depth
   - Binary search upwards to find the highest nodes that are different
   - The parent of those nodes is the LCA

This gives us O(N log N) preprocessing and O(log N) per query, which is efficient for large trees.

## Optimal Solution

Here's the complete solution using binary lifting for LCA:

<div class="code-group">

```python
# Time: O((N + Q) log N) | Space: O(N log N)
def shortestPathInWeightedTree(n, edges, queries):
    # Step 1: Build adjacency list
    graph = [[] for _ in range(n + 1)]
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))

    # Step 2: Initialize data structures
    MAX_LOG = 20  # Enough for n up to 10^6 (2^20 ≈ 1,000,000)
    depth = [0] * (n + 1)
    dist_from_root = [0] * (n + 1)
    up = [[0] * (MAX_LOG + 1) for _ in range(n + 1)]

    # Step 3: DFS to compute depth, distances, and immediate parents
    def dfs(node, parent, current_depth, current_dist):
        depth[node] = current_depth
        dist_from_root[node] = current_dist
        up[node][0] = parent  # 2^0 = 1st ancestor is parent

        # Fill binary lifting table
        for i in range(1, MAX_LOG + 1):
            # 2^i-th ancestor = 2^(i-1)-th ancestor of 2^(i-1)-th ancestor
            up[node][i] = up[up[node][i - 1]][i - 1]

        # Recursively process children
        for neighbor, weight in graph[node]:
            if neighbor != parent:
                dfs(neighbor, node, current_depth + 1, current_dist + weight)

    # Start DFS from root (node 1)
    dfs(1, 1, 0, 0)  # Root's parent is itself

    # Step 4: Helper function to find LCA using binary lifting
    def lca(u, v):
        # Make u the deeper node
        if depth[u] < depth[v]:
            u, v = v, u

        # Lift u up to the same depth as v
        diff = depth[u] - depth[v]
        for i in range(MAX_LOG, -1, -1):
            if diff & (1 << i):  # If 2^i is set in diff
                u = up[u][i]

        # If they're the same node, we found the LCA
        if u == v:
            return u

        # Binary search upwards to find LCA
        for i in range(MAX_LOG, -1, -1):
            if up[u][i] != up[v][i]:  # If ancestors are different
                u = up[u][i]
                v = up[v][i]

        # Parent of u (or v) is the LCA
        return up[u][0]

    # Step 5: Answer queries using the distance formula
    results = []
    for u, v in queries:
        lca_node = lca(u, v)
        distance = dist_from_root[u] + dist_from_root[v] - 2 * dist_from_root[lca_node]
        results.append(distance)

    return results
```

```javascript
// Time: O((N + Q) log N) | Space: O(N log N)
function shortestPathInWeightedTree(n, edges, queries) {
  // Step 1: Build adjacency list
  const graph = Array(n + 1)
    .fill()
    .map(() => []);
  for (const [u, v, w] of edges) {
    graph[u].push([v, w]);
    graph[v].push([u, w]);
  }

  // Step 2: Initialize data structures
  const MAX_LOG = 20; // Enough for n up to 10^6
  const depth = Array(n + 1).fill(0);
  const distFromRoot = Array(n + 1).fill(0);
  const up = Array(n + 1)
    .fill()
    .map(() => Array(MAX_LOG + 1).fill(0));

  // Step 3: DFS to compute depth, distances, and ancestors
  function dfs(node, parent, currentDepth, currentDist) {
    depth[node] = currentDepth;
    distFromRoot[node] = currentDist;
    up[node][0] = parent; // 2^0 = 1st ancestor is parent

    // Fill binary lifting table
    for (let i = 1; i <= MAX_LOG; i++) {
      // 2^i-th ancestor = 2^(i-1)-th ancestor of 2^(i-1)-th ancestor
      up[node][i] = up[up[node][i - 1]][i - 1];
    }

    // Recursively process children
    for (const [neighbor, weight] of graph[node]) {
      if (neighbor !== parent) {
        dfs(neighbor, node, currentDepth + 1, currentDist + weight);
      }
    }
  }

  // Start DFS from root (node 1)
  dfs(1, 1, 0, 0); // Root's parent is itself

  // Step 4: Helper function to find LCA using binary lifting
  function lca(u, v) {
    // Make u the deeper node
    if (depth[u] < depth[v]) {
      [u, v] = [v, u];
    }

    // Lift u up to the same depth as v
    let diff = depth[u] - depth[v];
    for (let i = MAX_LOG; i >= 0; i--) {
      if (diff & (1 << i)) {
        // If 2^i is set in diff
        u = up[u][i];
      }
    }

    // If they're the same node, we found the LCA
    if (u === v) return u;

    // Binary search upwards to find LCA
    for (let i = MAX_LOG; i >= 0; i--) {
      if (up[u][i] !== up[v][i]) {
        // If ancestors are different
        u = up[u][i];
        v = up[v][i];
      }
    }

    // Parent of u (or v) is the LCA
    return up[u][0];
  }

  // Step 5: Answer queries using the distance formula
  const results = [];
  for (const [u, v] of queries) {
    const lcaNode = lca(u, v);
    const distance = distFromRoot[u] + distFromRoot[v] - 2 * distFromRoot[lcaNode];
    results.push(distance);
  }

  return results;
}
```

```java
// Time: O((N + Q) log N) | Space: O(N log N)
public List<Integer> shortestPathInWeightedTree(int n, int[][] edges, int[][] queries) {
    // Step 1: Build adjacency list
    List<int[]>[] graph = new List[n + 1];
    for (int i = 1; i <= n; i++) {
        graph[i] = new ArrayList<>();
    }
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        graph[u].add(new int[]{v, w});
        graph[v].add(new int[]{u, w});
    }

    // Step 2: Initialize data structures
    final int MAX_LOG = 20;  // Enough for n up to 10^6
    int[] depth = new int[n + 1];
    long[] distFromRoot = new long[n + 1];  // Use long to avoid overflow
    int[][] up = new int[n + 1][MAX_LOG + 1];

    // Step 3: DFS to compute depth, distances, and ancestors
    dfs(1, 1, 0, 0, graph, depth, distFromRoot, up, MAX_LOG);

    // Step 4: Answer queries
    List<Integer> results = new ArrayList<>();
    for (int[] query : queries) {
        int u = query[0], v = query[1];
        int lcaNode = lca(u, v, depth, up, MAX_LOG);
        long distance = distFromRoot[u] + distFromRoot[v] - 2 * distFromRoot[lcaNode];
        results.add((int) distance);
    }

    return results;
}

private void dfs(int node, int parent, int currentDepth, long currentDist,
                 List<int[]>[] graph, int[] depth, long[] distFromRoot,
                 int[][] up, int MAX_LOG) {
    depth[node] = currentDepth;
    distFromRoot[node] = currentDist;
    up[node][0] = parent;  // 2^0 = 1st ancestor is parent

    // Fill binary lifting table
    for (int i = 1; i <= MAX_LOG; i++) {
        // 2^i-th ancestor = 2^(i-1)-th ancestor of 2^(i-1)-th ancestor
        up[node][i] = up[up[node][i - 1]][i - 1];
    }

    // Recursively process children
    for (int[] neighbor : graph[node]) {
        int nextNode = neighbor[0];
        int weight = neighbor[1];
        if (nextNode != parent) {
            dfs(nextNode, node, currentDepth + 1, currentDist + weight,
                graph, depth, distFromRoot, up, MAX_LOG);
        }
    }
}

private int lca(int u, int v, int[] depth, int[][] up, int MAX_LOG) {
    // Make u the deeper node
    if (depth[u] < depth[v]) {
        int temp = u;
        u = v;
        v = temp;
    }

    // Lift u up to the same depth as v
    int diff = depth[u] - depth[v];
    for (int i = MAX_LOG; i >= 0; i--) {
        if ((diff & (1 << i)) != 0) {  // If 2^i is set in diff
            u = up[u][i];
        }
    }

    // If they're the same node, we found the LCA
    if (u == v) return u;

    // Binary search upwards to find LCA
    for (int i = MAX_LOG; i >= 0; i--) {
        if (up[u][i] != up[v][i]) {  // If ancestors are different
            u = up[u][i];
            v = up[v][i];
        }
    }

    // Parent of u (or v) is the LCA
    return up[u][0];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((N + Q) log N)

- **Preprocessing (DFS):** O(N log N) - We visit each node once and for each node, we fill the binary lifting table with log N entries
- **Per Query (LCA):** O(log N) - Binary lifting allows us to jump exponentially upward
- **Total:** O(N log N + Q log N) = O((N + Q) log N)

**Space Complexity:** O(N log N)

- **Graph adjacency list:** O(N) - Stores 2×(N-1) edges
- **Depth array:** O(N)
- **Distance array:** O(N)
- **Binary lifting table (up):** O(N log N) - This is the dominant term, with N nodes each storing log N ancestors

## Common Mistakes

1. **Forgetting that edges are undirected**: When building the adjacency list, you must add edges in both directions. Trees are undirected graphs with no cycles.

2. **Incorrect LCA implementation**: The most common error is not handling the case where u and v are already at the same depth after the initial lift. Always check `if (u == v) return u;` after equalizing depths.

3. **Integer overflow with large weights**: When N is large and weights can be up to 10^9, the total distance might exceed 32-bit integer limits. Use 64-bit integers (long in Java/C++, long long in C, default in Python).

4. **Insufficient binary lifting table size**: MAX_LOG should be at least ⌈log₂(N)⌉. For N ≤ 10⁵, 17 is enough (2¹⁷ = 131,072). For safety, use 20 which handles up to ~1 million nodes.

5. **Not setting root's parent to itself**: In the DFS, the root (node 1) should have its parent set to itself, not 0 or -1, to avoid array index issues when computing ancestors.

## When You'll See This Pattern

This LCA + distance pattern appears in many tree problems:

1. **LeetCode 1483: Kth Ancestor of a Tree Node** - Direct application of binary lifting to find k-th ancestors efficiently.

2. **LeetCode 2096: Step-By-Step Directions From a Binary Tree Node to Another** - Find LCA in a binary tree to determine up/down moves.

3. **LeetCode 2846: Minimum Edge Weight Equilibrium Queries in a Tree** - Similar structure with weighted edges and LCA queries.

4. **Codeforces 609E: Minimum spanning tree for each edge** - Uses LCA to find maximum edge weight on paths.

The core technique of binary lifting for LCA is valuable whenever you need to answer many queries about ancestor relationships or path properties in static trees.

## Key Takeaways

1. **Tree distance formula**: In any tree, distance(u, v) = depth(u) + depth(v) - 2 × depth(LCA(u, v)), where depth is measured from a common root. For weighted trees, use distance from root instead of depth.

2. **Binary lifting for LCA**: Precompute 2^k-th ancestors for each node to answer LCA queries in O(log N) time. This is a tradeoff of O(N log N) preprocessing for fast queries.

3. **Recognize when to use LCA**: Any problem involving many queries about paths or relationships in a static tree likely needs LCA preprocessing. If you see "tree" and "multiple queries," think LCA.

[Practice this problem on CodeJeet](/problem/shortest-path-in-a-weighted-tree)
