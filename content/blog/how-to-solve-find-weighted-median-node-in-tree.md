---
title: "How to Solve Find Weighted Median Node in Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Weighted Median Node in Tree. Hard difficulty, 26.1% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Bit Manipulation, Tree."
date: "2026-09-07"
category: "dsa-patterns"
tags: ["find-weighted-median-node-in-tree", "array", "binary-search", "dynamic-programming", "hard"]
---

## How to Solve Find Weighted Median Node in Tree

You’re given a weighted, undirected tree with `n` nodes rooted at node 0. Each edge has a weight, and each node’s “weighted distance” is the sum of edge weights from the root to that node. The **weighted median node** is the node where the cumulative sum of distances to all nodes is minimized. This is essentially finding the tree’s **weighted centroid**, but with a twist: we’re minimizing total weighted distance, not just balancing subtree sizes. The challenge lies in efficiently computing subtree sums and total distances without recalculating for every node.

---

## Visual Walkthrough

Let’s walk through a small example to build intuition.

**Example:**

```
n = 4
edges = [[0,1,2], [0,2,1], [2,3,3]]
```

Tree structure:

- Node 0 connected to 1 (weight 2) and 2 (weight 1)
- Node 2 connected to 3 (weight 3)

**Step 1 – Compute distances from root (node 0):**

- dist[0] = 0
- dist[1] = 2
- dist[2] = 1
- dist[3] = 1 + 3 = 4

**Step 2 – Compute total weighted distance from root:**
Total = 0 + 2 + 1 + 4 = 7

**Step 3 – Try moving to neighbor nodes:**
If we move from root (0) to node 2:

- Edge weight between 0 and 2 is 1
- Nodes on “0 side”: nodes 0 and 1 (2 nodes)
- Nodes on “2 side”: nodes 2 and 3 (2 nodes)
- Change in total distance = (nodes on 2 side) _ edge_weight - (nodes on 0 side) _ edge_weight
- Change = 2*1 - 2*1 = 0 → total distance remains 7

If we move from root (0) to node 1:

- Edge weight = 2
- Nodes on 0 side: nodes 0,2,3 (3 nodes)
- Nodes on 1 side: node 1 (1 node)
- Change = 1*2 - 3*2 = 2 - 6 = -4 → new total = 7 - 4 = 3 (better!)

**Step 4 – Continue until no improvement:**
We’d recursively check neighbors until we find the node with minimum total distance. Here, node 1 gives total distance 3, which is the minimum.

The key insight: we can compute total distance for any node if we know:

1. Total distance from a starting node (like root)
2. Number of nodes in each subtree
3. Edge weights

---

## Brute Force Approach

A brute force solution would compute the total weighted distance for **every node** independently. For each candidate node, run DFS/BFS to sum distances to all other nodes. This requires O(n) per node, leading to O(n²) total time. With n up to 10⁵, this is infeasible.

**Why it fails:**

- Recalculates distances from scratch for each node
- Doesn’t reuse information about tree structure
- O(n²) is too slow for large trees

---

## Optimized Approach

We use **two-pass DFS** with dynamic programming on trees:

**First DFS (post-order):**

- Compute `subtreeCount[node]`: number of nodes in subtree rooted at `node`
- Compute `subtreeDistSum[node]`: sum of distances from `node` to all nodes in its subtree

**Second DFS (pre-order):**

- Compute `totalDist[node]`: sum of distances from `node` to **all** nodes in the tree
- For root: `totalDist[root] = subtreeDistSum[root]`
- When moving from parent to child:
  ```
  totalDist[child] = totalDist[parent] + (n - 2*subtreeCount[child]) * edgeWeight
  ```
  Explanation:
  - Moving the “center” from parent to child across an edge of weight `w`
  - For nodes in child’s subtree: distance decreases by `w` → subtract `subtreeCount[child] * w`
  - For nodes NOT in child’s subtree: distance increases by `w` → add `(n - subtreeCount[child]) * w`
  - Net change: `(n - 2*subtreeCount[child]) * w`

**Finding the median:**
After computing `totalDist` for all nodes, the weighted median is the node with minimum `totalDist`.

---

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
from collections import defaultdict
from typing import List

class Solution:
    def findWeightedMedian(self, n: int, edges: List[List[int]]) -> int:
        # Build adjacency list: node -> [(neighbor, weight), ...]
        graph = defaultdict(list)
        for u, v, w in edges:
            graph[u].append((v, w))
            graph[v].append((u, w))

        # Arrays to store subtree information
        subtreeCount = [0] * n      # Number of nodes in subtree rooted at i
        subtreeDistSum = [0] * n    # Sum of distances from i to nodes in its subtree
        totalDist = [0] * n         # Sum of distances from i to all nodes

        # First DFS: compute subtreeCount and subtreeDistSum (post-order)
        def dfs1(node: int, parent: int) -> None:
            subtreeCount[node] = 1  # Count itself
            subtreeDistSum[node] = 0

            for neighbor, weight in graph[node]:
                if neighbor == parent:
                    continue
                dfs1(neighbor, node)
                # Update subtree count and distance sum
                subtreeCount[node] += subtreeCount[neighbor]
                subtreeDistSum[node] += subtreeDistSum[neighbor] + subtreeCount[neighbor] * weight

        # Second DFS: compute totalDist for all nodes (pre-order)
        def dfs2(node: int, parent: int) -> None:
            for neighbor, weight in graph[node]:
                if neighbor == parent:
                    continue
                # Key transition formula
                totalDist[neighbor] = totalDist[node] + (n - 2 * subtreeCount[neighbor]) * weight
                dfs2(neighbor, node)

        # Start DFS from root (node 0)
        dfs1(0, -1)

        # For root, total distance is just its subtree distance sum
        totalDist[0] = subtreeDistSum[0]

        # Compute totalDist for all other nodes
        dfs2(0, -1)

        # Find node with minimum total distance
        minDist = float('inf')
        medianNode = -1
        for i in range(n):
            if totalDist[i] < minDist:
                minDist = totalDist[i]
                medianNode = i

        return medianNode
```

```javascript
// Time: O(n) | Space: O(n)
function findWeightedMedian(n, edges) {
  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    graph[u].push([v, w]);
    graph[v].push([u, w]);
  }

  // Arrays to store subtree information
  const subtreeCount = new Array(n).fill(0);
  const subtreeDistSum = new Array(n).fill(0);
  const totalDist = new Array(n).fill(0);

  // First DFS: compute subtreeCount and subtreeDistSum
  const dfs1 = (node, parent) => {
    subtreeCount[node] = 1; // Count itself
    subtreeDistSum[node] = 0;

    for (const [neighbor, weight] of graph[node]) {
      if (neighbor === parent) continue;
      dfs1(neighbor, node);
      // Update subtree count and distance sum
      subtreeCount[node] += subtreeCount[neighbor];
      subtreeDistSum[node] += subtreeDistSum[neighbor] + subtreeCount[neighbor] * weight;
    }
  };

  // Second DFS: compute totalDist for all nodes
  const dfs2 = (node, parent) => {
    for (const [neighbor, weight] of graph[node]) {
      if (neighbor === parent) continue;
      // Key transition formula
      totalDist[neighbor] = totalDist[node] + (n - 2 * subtreeCount[neighbor]) * weight;
      dfs2(neighbor, node);
    }
  };

  // Start DFS from root (node 0)
  dfs1(0, -1);

  // For root, total distance is just its subtree distance sum
  totalDist[0] = subtreeDistSum[0];

  // Compute totalDist for all other nodes
  dfs2(0, -1);

  // Find node with minimum total distance
  let minDist = Infinity;
  let medianNode = -1;
  for (let i = 0; i < n; i++) {
    if (totalDist[i] < minDist) {
      minDist = totalDist[i];
      medianNode = i;
    }
  }

  return medianNode;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public int findWeightedMedian(int n, int[][] edges) {
        // Build adjacency list
        List<int[]>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            graph[u].add(new int[]{v, w});
            graph[v].add(new int[]{u, w});
        }

        // Arrays to store subtree information
        int[] subtreeCount = new int[n];
        int[] subtreeDistSum = new int[n];
        int[] totalDist = new int[n];

        // First DFS: compute subtreeCount and subtreeDistSum
        dfs1(0, -1, graph, subtreeCount, subtreeDistSum);

        // For root, total distance is just its subtree distance sum
        totalDist[0] = subtreeDistSum[0];

        // Second DFS: compute totalDist for all nodes
        dfs2(0, -1, graph, subtreeCount, totalDist, n);

        // Find node with minimum total distance
        int minDist = Integer.MAX_VALUE;
        int medianNode = -1;
        for (int i = 0; i < n; i++) {
            if (totalDist[i] < minDist) {
                minDist = totalDist[i];
                medianNode = i;
            }
        }

        return medianNode;
    }

    private void dfs1(int node, int parent, List<int[]>[] graph,
                     int[] subtreeCount, int[] subtreeDistSum) {
        subtreeCount[node] = 1;  // Count itself
        subtreeDistSum[node] = 0;

        for (int[] neighborData : graph[node]) {
            int neighbor = neighborData[0];
            int weight = neighborData[1];
            if (neighbor == parent) continue;

            dfs1(neighbor, node, graph, subtreeCount, subtreeDistSum);

            // Update subtree count and distance sum
            subtreeCount[node] += subtreeCount[neighbor];
            subtreeDistSum[node] += subtreeDistSum[neighbor] +
                                   subtreeCount[neighbor] * weight;
        }
    }

    private void dfs2(int node, int parent, List<int[]>[] graph,
                     int[] subtreeCount, int[] totalDist, int n) {
        for (int[] neighborData : graph[node]) {
            int neighbor = neighborData[0];
            int weight = neighborData[1];
            if (neighbor == parent) continue;

            // Key transition formula
            totalDist[neighbor] = totalDist[node] +
                                 (n - 2 * subtreeCount[neighbor]) * weight;

            dfs2(neighbor, node, graph, subtreeCount, totalDist, n);
        }
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity: O(n)**

- Building adjacency list: O(n)
- First DFS: visits each node once, O(n)
- Second DFS: visits each node once, O(n)
- Finding minimum: O(n)
- Total: O(n)

**Space Complexity: O(n)**

- Adjacency list: O(n) storage for edges
- Arrays for subtreeCount, subtreeDistSum, totalDist: O(n) each
- Recursion stack: O(n) in worst case (linear tree)
- Total: O(n)

---

## Common Mistakes

1. **Forgetting the tree is undirected**: When building the graph, you must add edges in both directions. Missing this leads to incomplete traversal.

2. **Incorrect transition formula**: The formula `totalDist[child] = totalDist[parent] + (n - 2*subtreeCount[child]) * weight` is derived from careful counting. A common error is using `(subtreeCount[parent] - subtreeCount[child])` instead of `(n - subtreeCount[child])`.

3. **Not handling large weights**: Use `long` or equivalent for distance sums if weights can be large (though problem constraints often prevent overflow).

4. **Assuming root is always the answer**: The weighted median isn't necessarily the root. You must check all nodes after computing `totalDist`.

---

## When You'll See This Pattern

This **two-pass DFS with subtree DP** pattern appears in many tree problems:

1. **Sum of Distances in Tree (LeetCode 834)** - Almost identical problem, but without edge weights. The transition formula is exactly the same.

2. **Tree Diameter (LeetCode 543)** - Uses similar DFS to compute longest paths through each node.

3. **Binary Tree Maximum Path Sum (LeetCode 124)** - Another DP-on-trees problem where you compute values bottom-up and propagate results.

The core idea: compute something for subtrees (post-order), then use it to compute for the whole tree (pre-order).

---

## Key Takeaways

1. **Tree DP often uses two passes**: First compute bottom-up (post-order), then propagate results top-down (pre-order). This avoids O(n²) recomputation.

2. **The rerooting technique**: When you need to compute a value for every node as the "root", compute for one root first, then use a transition formula to get others efficiently.

3. **Subtree counts are powerful**: Many tree problems become tractable when you know how many nodes are in each subtree. This information helps calculate how values change when moving between nodes.

[Practice this problem on CodeJeet](/problem/find-weighted-median-node-in-tree)
