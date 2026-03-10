---
title: "How to Solve Minimum Edge Weight Equilibrium Queries in a Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Edge Weight Equilibrium Queries in a Tree. Hard difficulty, 45.5% acceptance rate. Topics: Array, Tree, Graph Theory, Strongly Connected Component."
date: "2026-06-10"
category: "dsa-patterns"
tags: ["minimum-edge-weight-equilibrium-queries-in-a-tree", "array", "tree", "graph-theory", "hard"]
---

# How to Solve Minimum Edge Weight Equilibrium Queries in a Tree

You're given a tree with weighted edges and multiple queries. Each query asks: "What's the minimum number of edge weight changes needed to make all edges along the path between two nodes have equal weight?" The challenge is answering many queries efficiently on a large tree. What makes this tricky is that paths in trees can be long, and checking each edge weight along every path for every query would be far too slow.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
Tree with 5 nodes:
Edges: 0-1 (weight 2), 1-2 (weight 3), 1-3 (weight 2), 3-4 (weight 3)
Queries: [[0,4], [2,3]]
```

**Query [0,4]**: Path is 0 → 1 → 3 → 4

- Edge weights along path: 2, 2, 3
- We need all edges to have the same weight
- Option 1: Change all to weight 2 → need to change 1 edge (3→2)
- Option 2: Change all to weight 3 → need to change 2 edges (2→3, 2→3)
- Minimum is 1 change

**Query [2,3]**: Path is 2 → 1 → 3

- Edge weights: 3, 2
- Option 1: Change to weight 2 → change 1 edge
- Option 2: Change to weight 3 → change 1 edge
- Minimum is 1 change

The key insight: For any path, the minimum changes equals `path_length - max_frequency_of_any_weight`. If the most common weight appears 3 times in a 5-edge path, we only need to change the other 2 edges to match it.

## Brute Force Approach

A naive approach would be:

1. For each query, find the path between the two nodes (using DFS/BFS)
2. Count the frequency of each weight along that path
3. Answer = path length - max frequency

This is straightforward but extremely slow. Finding the path for each query requires O(n) time, and with q queries, that's O(qn). For n,q up to 10⁴, this becomes 10⁸ operations - far too slow.

Even with LCA (Lowest Common Ancestor) to find paths faster, we'd still need to examine each edge along the path to count weights, which is O(path_length) per query. We need a way to answer "what's the most frequent weight along this path?" without traversing the entire path.

## Optimized Approach

The breakthrough comes from recognizing that:

1. We need to answer "most frequent weight along a path" queries efficiently
2. Tree paths go through the LCA (Lowest Common Ancestor)
3. We can use binary lifting not just for LCA, but also to store weight frequency information

**Key Insight**: For each node and each power-of-two jump, we can store:

- The ancestor node after 2^k jumps
- A frequency map of weights along that 2^k-length path

Then for any path u→v:

1. Find LCA(u,v)
2. Break the path into O(log n) segments using binary lifting
3. Combine frequency maps from all segments
4. Answer = total edges - max frequency

But storing full frequency maps for each (node, k) pair would be O(n log n × W) space where W is number of distinct weights. Too large!

**Better Insight**: Since weights are small (1-26 in constraints), we can use bitmask or small arrays. Even better: we only need to track which weights appear, not full counts, because we can reconstruct counts by combining segments.

**Final Optimization**: Use binary lifting with prefix sums. For each weight w (1-26), maintain a binary lifting table that counts how many edges with weight w are on the path from node to its 2^k-th ancestor. Then for any path, we can compute the count of weight w in O(log n) time by summing contributions from path segments.

## Optimal Solution

We'll use binary lifting with LCA and maintain, for each weight 1-26, a count table `upCount[node][k][w]` = number of edges with weight w on path from node to its 2^k-th ancestor.

For a query u→v:

1. Find LCA = l
2. Path length = depth[u] + depth[v] - 2\*depth[l]
3. For each weight w (1-26):
   - Count w on u→l path = sum of upCount[u][k][w] for jumps to l
   - Count w on v→l path = sum of upCount[v][k][w] for jumps to l
   - Total w = count from u→l + count from v→l
4. Answer = path length - max(total w for any w)

<div class="code-group">

```python
# Time: O((n + q) * log n * W) where W=26 | Space: O(n * log n * W)
from typing import List

class Solution:
    def minOperationsQueries(self, n: int, edges: List[List[int]], queries: List[List[int]]) -> List[int]:
        # Build adjacency list
        adj = [[] for _ in range(n)]
        for u, v, w in edges:
            adj[u].append((v, w))
            adj[v].append((u, w))

        # Binary lifting preparation
        LOG = (n).bit_length()  # Enough for jumps up to n
        parent = [[-1] * n for _ in range(LOG)]
        depth = [0] * n

        # upCount[k][u][w] = count of weight w on path from u to 2^k-th ancestor
        # Since weights are 1-26, we use array of size 27
        upCount = [[[0] * 27 for _ in range(n)] for _ in range(LOG)]

        # DFS to build parent[0] and upCount[0]
        stack = [(0, -1, 0, 0)]  # (node, parent, current depth, weight from parent)
        while stack:
            u, p, d, weight_from_parent = stack.pop()
            parent[0][u] = p
            depth[u] = d

            if p != -1:
                # Path from u to its immediate parent has this weight
                upCount[0][u][weight_from_parent] = 1

            for v, w in adj[u]:
                if v != p:
                    stack.append((v, u, d + 1, w))

        # Build binary lifting tables
        for k in range(1, LOG):
            for u in range(n):
                mid = parent[k-1][u]
                if mid != -1:
                    parent[k][u] = parent[k-1][mid]
                    # Combine counts: u -> mid -> parent[k][u]
                    for w in range(1, 27):
                        upCount[k][u][w] = upCount[k-1][u][w] + upCount[k-1][mid][w]

        # Helper: get weight counts on path from u to ancestor (not including ancestor)
        def get_counts(u: int, ancestor: int) -> List[int]:
            counts = [0] * 27
            diff = depth[u] - depth[ancestor]

            # Move u up to same depth as ancestor
            for k in range(LOG):
                if diff & (1 << k):
                    for w in range(1, 27):
                        counts[w] += upCount[k][u][w]
                    u = parent[k][u]
            return counts

        # Process queries
        result = []
        for u, v in queries:
            # Find LCA using binary lifting
            a, b = u, v

            # Make a deeper
            if depth[a] < depth[b]:
                a, b = b, a

            # Raise a to same depth as b
            diff = depth[a] - depth[b]
            for k in range(LOG):
                if diff & (1 << k):
                    a = parent[k][a]

            # Now a and b at same depth, find LCA
            if a != b:
                for k in reversed(range(LOG)):
                    if parent[k][a] != parent[k][b]:
                        a = parent[k][a]
                        b = parent[k][b]
                a = parent[0][a]  # LCA

            lca = a

            # Get counts on both halves of path
            counts_u = get_counts(u, lca)
            counts_v = get_counts(v, lca)

            # Combine counts
            total_counts = [0] * 27
            path_len = depth[u] + depth[v] - 2 * depth[lca]

            for w in range(1, 27):
                total_counts[w] = counts_u[w] + counts_v[w]

            # Find max frequency
            max_freq = max(total_counts)

            # Minimum operations = change all but most frequent weight
            result.append(path_len - max_freq)

        return result
```

```javascript
// Time: O((n + q) * log n * W) where W=26 | Space: O(n * log n * W)
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number[][]} queries
 * @return {number[]}
 */
var minOperationsQueries = function (n, edges, queries) {
  // Build adjacency list
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }

  // Binary lifting preparation
  const LOG = Math.ceil(Math.log2(n)) + 1;
  const parent = Array.from({ length: LOG }, () => Array(n).fill(-1));
  const depth = Array(n).fill(0);

  // upCount[k][u][w] = count of weight w on path from u to 2^k-th ancestor
  const upCount = Array.from({ length: LOG }, () =>
    Array.from({ length: n }, () => Array(27).fill(0))
  );

  // DFS to build parent[0] and upCount[0]
  const stack = [[0, -1, 0, 0]]; // [node, parent, current depth, weight from parent]
  while (stack.length) {
    const [u, p, d, weightFromParent] = stack.pop();
    parent[0][u] = p;
    depth[u] = d;

    if (p !== -1) {
      // Path from u to its immediate parent has this weight
      upCount[0][u][weightFromParent] = 1;
    }

    for (const [v, w] of adj[u]) {
      if (v !== p) {
        stack.push([v, u, d + 1, w]);
      }
    }
  }

  // Build binary lifting tables
  for (let k = 1; k < LOG; k++) {
    for (let u = 0; u < n; u++) {
      const mid = parent[k - 1][u];
      if (mid !== -1) {
        parent[k][u] = parent[k - 1][mid];
        // Combine counts: u -> mid -> parent[k][u]
        for (let w = 1; w <= 26; w++) {
          upCount[k][u][w] = upCount[k - 1][u][w] + upCount[k - 1][mid][w];
        }
      }
    }
  }

  // Helper: get weight counts on path from u to ancestor (not including ancestor)
  const getCounts = (u, ancestor) => {
    const counts = Array(27).fill(0);
    let diff = depth[u] - depth[ancestor];
    let node = u;

    // Move node up to same depth as ancestor
    for (let k = 0; k < LOG; k++) {
      if (diff & (1 << k)) {
        for (let w = 1; w <= 26; w++) {
          counts[w] += upCount[k][node][w];
        }
        node = parent[k][node];
      }
    }
    return counts;
  };

  // Process queries
  const result = [];
  for (const [u, v] of queries) {
    // Find LCA using binary lifting
    let a = u,
      b = v;

    // Make a deeper
    if (depth[a] < depth[b]) {
      [a, b] = [b, a];
    }

    // Raise a to same depth as b
    let diff = depth[a] - depth[b];
    for (let k = 0; k < LOG; k++) {
      if (diff & (1 << k)) {
        a = parent[k][a];
      }
    }

    // Now a and b at same depth, find LCA
    if (a !== b) {
      for (let k = LOG - 1; k >= 0; k--) {
        if (parent[k][a] !== parent[k][b]) {
          a = parent[k][a];
          b = parent[k][b];
        }
      }
      a = parent[0][a]; // LCA
    }

    const lca = a;

    // Get counts on both halves of path
    const countsU = getCounts(u, lca);
    const countsV = getCounts(v, lca);

    // Combine counts
    const totalCounts = Array(27).fill(0);
    const pathLen = depth[u] + depth[v] - 2 * depth[lca];

    for (let w = 1; w <= 26; w++) {
      totalCounts[w] = countsU[w] + countsV[w];
    }

    // Find max frequency
    let maxFreq = 0;
    for (let w = 1; w <= 26; w++) {
      maxFreq = Math.max(maxFreq, totalCounts[w]);
    }

    // Minimum operations = change all but most frequent weight
    result.push(pathLen - maxFreq);
  }

  return result;
};
```

```java
// Time: O((n + q) * log n * W) where W=26 | Space: O(n * log n * W)
class Solution {
    public int[] minOperationsQueries(int n, int[][] edges, int[][] queries) {
        // Build adjacency list
        List<int[]>[] adj = new List[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            adj[u].add(new int[]{v, w});
            adj[v].add(new int[]{u, w});
        }

        // Binary lifting preparation
        int LOG = 32 - Integer.numberOfLeadingZeros(n);
        int[][] parent = new int[LOG][n];
        int[] depth = new int[n];

        // upCount[k][u][w] = count of weight w on path from u to 2^k-th ancestor
        int[][][] upCount = new int[LOG][n][27];

        // Initialize parent with -1
        for (int k = 0; k < LOG; k++) {
            Arrays.fill(parent[k], -1);
        }

        // DFS to build parent[0] and upCount[0]
        Stack<int[]> stack = new Stack<>();
        stack.push(new int[]{0, -1, 0, 0}); // {node, parent, depth, weight from parent}

        while (!stack.isEmpty()) {
            int[] curr = stack.pop();
            int u = curr[0], p = curr[1], d = curr[2], weightFromParent = curr[3];
            parent[0][u] = p;
            depth[u] = d;

            if (p != -1) {
                upCount[0][u][weightFromParent] = 1;
            }

            for (int[] neighbor : adj[u]) {
                int v = neighbor[0], w = neighbor[1];
                if (v != p) {
                    stack.push(new int[]{v, u, d + 1, w});
                }
            }
        }

        // Build binary lifting tables
        for (int k = 1; k < LOG; k++) {
            for (int u = 0; u < n; u++) {
                int mid = parent[k-1][u];
                if (mid != -1) {
                    parent[k][u] = parent[k-1][mid];
                    for (int w = 1; w <= 26; w++) {
                        upCount[k][u][w] = upCount[k-1][u][w] + upCount[k-1][mid][w];
                    }
                }
            }
        }

        // Process queries
        int[] result = new int[queries.length];

        for (int i = 0; i < queries.length; i++) {
            int u = queries[i][0], v = queries[i][1];

            // Find LCA
            int a = u, b = v;
            if (depth[a] < depth[b]) {
                int temp = a;
                a = b;
                b = temp;
            }

            // Raise a to same depth as b
            int diff = depth[a] - depth[b];
            for (int k = 0; k < LOG; k++) {
                if ((diff & (1 << k)) != 0) {
                    a = parent[k][a];
                }
            }

            if (a != b) {
                for (int k = LOG - 1; k >= 0; k--) {
                    if (parent[k][a] != parent[k][b]) {
                        a = parent[k][a];
                        b = parent[k][b];
                    }
                }
                a = parent[0][a];
            }

            int lca = a;

            // Get counts from u to lca and v to lca
            int[] countsU = getCounts(u, lca, parent, depth, upCount, LOG);
            int[] countsV = getCounts(v, lca, parent, depth, upCount, LOG);

            // Combine counts
            int pathLen = depth[u] + depth[v] - 2 * depth[lca];
            int maxFreq = 0;

            for (int w = 1; w <= 26; w++) {
                int total = countsU[w] + countsV[w];
                maxFreq = Math.max(maxFreq, total);
            }

            result[i] = pathLen - maxFreq;
        }

        return result;
    }

    private int[] getCounts(int u, int ancestor, int[][] parent, int[] depth,
                           int[][][] upCount, int LOG) {
        int[] counts = new int[27];
        int diff = depth[u] - depth[ancestor];
        int node = u;

        for (int k = 0; k < LOG; k++) {
            if ((diff & (1 << k)) != 0) {
                for (int w = 1; w <= 26; w++) {
                    counts[w] += upCount[k][node][w];
                }
                node = parent[k][node];
            }
        }
        return counts;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O((n + q) × log n × W) where W = 26 (max weight value)

- DFS to build tree: O(n)
- Building binary lifting tables: O(n × log n × W)
- Each query: O(log n × W) for LCA + weight counting
- Total: O(n × log n × W + q × log n × W)

**Space Complexity**: O(n × log n × W)

- Parent table: O(n × log n)
- upCount table: O(n × log n × W)
- Depth array: O(n)
- Recursion stack: O(n) for DFS

The log n factor comes from binary lifting (storing ancestors for powers of 2). The W factor comes from tracking counts for each possible weight.

## Common Mistakes

1. **Forgetting that paths go through LCA**: Some candidates try to find paths directly from u to v without considering the tree structure. Remember: in a tree, the unique path between u and v goes through their LCA.

2. **Not handling weight counting efficiently**: The naive approach of traversing the entire path for each query is O(n) per query. With binary lifting, we break the path into O(log n) segments.

3. **Incorrect binary lifting implementation**: Common errors include:
   - Not initializing parent[0] correctly
   - Off-by-one errors in the jump conditions
   - Forgetting to update the node when making jumps
   - Incorrectly combining weight counts when jumping multiple steps

4. **Missing the weight constraint optimization**: Since weights are limited to 1-26, we can use small arrays instead of hash maps. This makes the solution much more efficient.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary Lifting for LCA**: Used in problems like:
   - [Kth Ancestor of a Tree Node](/problem/kth-ancestor-of-a-tree-node) - Direct application of binary lifting
   - Tree path queries where you need to answer questions about ancestors

2. **Path Aggregation Queries**: Similar to problems where you need to compute some aggregate (sum, max, min) along tree paths:
   - Range sum queries on trees
   - Finding maximum/minimum edge weight on paths

3. **Frequency Counting on Paths**: The core challenge of counting weight frequencies efficiently appears in:
   - Problems about most frequent element on a path
   - Path queries with categorical data

## Key Takeaways

1. **Binary lifting is powerful for tree path queries**: When you need to answer many queries about paths in a tree, binary lifting with O(log n) per query is often the answer.

2. **Break complex queries into manageable pieces**: Instead of processing entire paths, break them into O(log n) segments using powers of two. This is a classic divide-and-conquer approach.

3. **Constraints guide optimization**: The small weight range (1-26) is a hint to use array-based counting instead of hash maps. Always check constraints for optimization opportunities.

Related problems: [Kth Ancestor of a Tree Node](/problem/kth-ancestor-of-a-tree-node), [Minimum Runes to Add to Cast Spell](/problem/minimum-runes-to-add-to-cast-spell)
