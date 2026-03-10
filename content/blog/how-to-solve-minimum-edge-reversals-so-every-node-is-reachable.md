---
title: "How to Solve Minimum Edge Reversals So Every Node Is Reachable — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Edge Reversals So Every Node Is Reachable. Hard difficulty, 57.3% acceptance rate. Topics: Dynamic Programming, Depth-First Search, Breadth-First Search, Graph Theory."
date: "2029-12-25"
category: "dsa-patterns"
tags:
  [
    "minimum-edge-reversals-so-every-node-is-reachable",
    "dynamic-programming",
    "depth-first-search",
    "breadth-first-search",
    "hard",
  ]
---

# How to Solve Minimum Edge Reversals So Every Node Is Reachable

This problem asks us to find the minimum number of edge reversals needed so that every node in a directed tree is reachable from every other node. The tricky part is that we're working with a directed tree (a tree if edges were undirected), and we need to make it strongly connected with minimal edge flips. This is essentially about finding a root node from which we can reach all others with the fewest reversals.

## Visual Walkthrough

Let's walk through a small example with n=4 and edges = [[0,1],[1,2],[2,3]]. This forms a straight line from 0→1→2→3.

If we choose node 0 as our root:

- From 0, we can reach 1 directly (edge 0→1 is forward)
- To reach 2, we need to go 0→1→2 (both edges forward)
- To reach 3, we need to go 0→1→2→3 (all edges forward)
- Total reversals needed: 0 (all edges already point away from root)

If we choose node 1 as our root:

- To reach 0, we need to reverse edge 0→1 (1 reversal)
- To reach 2, edge 1→2 is forward (0 reversals)
- To reach 3, edge 2→3 is forward (0 reversals)
- Total: 1 reversal

If we choose node 2 as our root:

- To reach 0, reverse edges 0→1 and 1→2 (2 reversals)
- To reach 1, reverse edge 1→2 (1 reversal)
- To reach 3, edge 2→3 is forward (0 reversals)
- Total: 3 reversals

If we choose node 3 as our root:

- To reach 0, reverse all edges (3 reversals)
- To reach 1, reverse edges 1→2 and 2→3 (2 reversals)
- To reach 2, reverse edge 2→3 (1 reversal)
- Total: 6 reversals

The minimum is 0 when root=0. The key insight: we can compute the reversals needed for all roots efficiently using DFS and dynamic programming.

## Brute Force Approach

A naive approach would be to try every node as the root and compute the number of reversals needed from that root. For each candidate root, we'd perform a DFS/BFS through the tree, counting how many edges point in the wrong direction (toward the root instead of away from it).

The problem with this approach is its O(n²) time complexity. For each of n roots, we traverse n-1 edges, resulting in O(n²) operations. With n up to 10⁵, this is far too slow (10¹⁰ operations).

What makes this approach inefficient is that we're recomputing the same information repeatedly. When we move the root from one node to its neighbor, most of the tree structure remains the same - only the edges between these two nodes change orientation.

## Optimized Approach

The key insight is that we can compute the reversal counts for all nodes using **two DFS passes** (a re-rooting DP technique):

1. **First DFS (compute from root 0)**: Pick an arbitrary root (say node 0) and compute how many reversals are needed to make all nodes reachable from this root. This gives us `dp[0]`.

2. **Second DFS (propagate to all nodes)**: For each neighbor of the current node, we can compute its reversal count based on the current node's count:
   - If the edge between current and neighbor points from current to neighbor: when we move root from current to neighbor, this edge becomes "wrong" (points toward the new root), so we add 1 reversal
   - If the edge points from neighbor to current: when we move root from current to neighbor, this edge becomes "correct" (points away from new root), so we subtract 1 reversal

This re-rooting technique allows us to compute all answers in O(n) time after building the adjacency list.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minEdgeReversals(n, edges):
    """
    Returns an array where answer[i] is the minimum number of edge reversals
    needed so node i can reach all other nodes.
    """
    # Build adjacency list with direction information
    # graph[u] contains (v, direction) where direction is:
    # 1 if edge is u->v (forward), 0 if edge is v->u (backward in original)
    graph = [[] for _ in range(n)]

    for u, v in edges:
        # Edge u->v is forward (1), we'll treat v->u as backward (0)
        graph[u].append((v, 1))  # Forward edge
        graph[v].append((u, 0))  # Backward edge (reverse of original)

    # dp[i] will store the answer for node i
    dp = [0] * n

    # First DFS: compute dp[0] from arbitrary root 0
    def dfs1(node, parent):
        reversals = 0
        for neighbor, direction in graph[node]:
            if neighbor == parent:
                continue
            # If edge points toward neighbor (forward), it's correct for root 0
            # If edge points toward node (backward), we need to reverse it
            if direction == 0:  # Backward edge, needs reversal
                reversals += 1
            reversals += dfs1(neighbor, node)
        return reversals

    dp[0] = dfs1(0, -1)

    # Second DFS: propagate answers to all nodes using re-rooting
    def dfs2(node, parent):
        for neighbor, direction in graph[node]:
            if neighbor == parent:
                continue

            # When moving root from node to neighbor:
            if direction == 1:  # Edge node->neighbor
                # This edge becomes backward for new root, add 1 reversal
                dp[neighbor] = dp[node] + 1
            else:  # direction == 0, edge neighbor->node
                # This edge becomes forward for new root, subtract 1 reversal
                dp[neighbor] = dp[node] - 1

            dfs2(neighbor, node)

    dfs2(0, -1)

    return dp
```

```javascript
// Time: O(n) | Space: O(n)
function minEdgeReversals(n, edges) {
  // Build adjacency list with direction information
  // graph[u] contains [v, direction] where direction is:
  // 1 if edge is u->v (forward), 0 if edge is v->u (backward)
  const graph = Array.from({ length: n }, () => []);

  for (const [u, v] of edges) {
    // Edge u->v is forward (1)
    graph[u].push([v, 1]);
    // The reverse edge v->u is backward (0)
    graph[v].push([u, 0]);
  }

  // dp[i] will store the answer for node i
  const dp = new Array(n).fill(0);

  // First DFS: compute dp[0] from arbitrary root 0
  function dfs1(node, parent) {
    let reversals = 0;
    for (const [neighbor, direction] of graph[node]) {
      if (neighbor === parent) continue;

      // If edge is backward (0), it needs reversal for current root
      if (direction === 0) {
        reversals += 1;
      }
      reversals += dfs1(neighbor, node);
    }
    return reversals;
  }

  dp[0] = dfs1(0, -1);

  // Second DFS: propagate answers to all nodes using re-rooting
  function dfs2(node, parent) {
    for (const [neighbor, direction] of graph[node]) {
      if (neighbor === parent) continue;

      // Calculate dp[neighbor] based on dp[node]
      if (direction === 1) {
        // Edge node->neighbor becomes backward for new root
        dp[neighbor] = dp[node] + 1;
      } else {
        // Edge neighbor->node becomes forward for new root
        dp[neighbor] = dp[node] - 1;
      }

      dfs2(neighbor, node);
    }
  }

  dfs2(0, -1);

  return dp;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int[] minEdgeReversals(int n, int[][] edges) {
        // Build adjacency list with direction information
        // graph[u] contains pairs (v, direction) where direction is:
        // 1 if edge is u->v (forward), 0 if edge is v->u (backward)
        List<int[]>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            // Edge u->v is forward (1)
            graph[u].add(new int[]{v, 1});
            // The reverse edge v->u is backward (0)
            graph[v].add(new int[]{u, 0});
        }

        // dp[i] will store the answer for node i
        int[] dp = new int[n];

        // First DFS: compute dp[0] from arbitrary root 0
        dp[0] = dfs1(0, -1, graph);

        // Second DFS: propagate answers to all nodes using re-rooting
        dfs2(0, -1, graph, dp);

        return dp;
    }

    private int dfs1(int node, int parent, List<int[]>[] graph) {
        int reversals = 0;
        for (int[] neighborInfo : graph[node]) {
            int neighbor = neighborInfo[0];
            int direction = neighborInfo[1];

            if (neighbor == parent) continue;

            // If edge is backward (0), it needs reversal for current root
            if (direction == 0) {
                reversals += 1;
            }
            reversals += dfs1(neighbor, node, graph);
        }
        return reversals;
    }

    private void dfs2(int node, int parent, List<int[]>[] graph, int[] dp) {
        for (int[] neighborInfo : graph[node]) {
            int neighbor = neighborInfo[0];
            int direction = neighborInfo[1];

            if (neighbor == parent) continue;

            // Calculate dp[neighbor] based on dp[node]
            if (direction == 1) {
                // Edge node->neighbor becomes backward for new root
                dp[neighbor] = dp[node] + 1;
            } else {
                // Edge neighbor->node becomes forward for new root
                dp[neighbor] = dp[node] - 1;
            }

            dfs2(neighbor, node, graph, dp);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the adjacency list takes O(n) time (n-1 edges)
- First DFS visits each node once: O(n)
- Second DFS visits each node once: O(n)
- Total: O(n) linear time

**Space Complexity: O(n)**

- Adjacency list stores 2\*(n-1) edges (bidirectional representation): O(n)
- Recursion stack depth can be O(n) in worst case (linear tree)
- dp array: O(n)
- Total: O(n) linear space

## Common Mistakes

1. **Forgetting to handle both directions in adjacency list**: The tree edges are directed, but for DFS we need to traverse in both directions. We must store both the forward and backward versions of each edge with proper direction flags.

2. **Incorrect direction logic in re-rooting**: When moving root from node to neighbor:
   - If edge is node→neighbor: becomes "wrong" for new root (add 1)
   - If edge is neighbor→node: becomes "correct" for new root (subtract 1)
     Mixing up this logic is a common error.

3. **Not using an arbitrary root for initial calculation**: Some candidates try to find the "best" root first, but we need to start with any root (like 0) and propagate from there. The initial root choice doesn't affect final results.

4. **Stack overflow with deep recursion**: For large n (up to 10⁵), a deep linear tree could cause recursion depth issues. In practice, Python's recursion limit might need adjustment, or consider using iterative DFS with a stack.

## When You'll See This Pattern

This **re-rooting DP** pattern appears in tree problems where we need to compute some value for every node as the root:

1. **Sum of Distances in Tree** (LeetCode 834): Compute the sum of distances from each node to all other nodes. Uses similar two-pass DFS technique.

2. **Binary Tree Cameras** (LeetCode 968): Determine minimum cameras needed to monitor all nodes, considering different states when moving through the tree.

3. **Tree Diameter** problems: Often solved by finding farthest nodes, but re-rooting can provide alternative solutions for certain variants.

The core idea is to compute the answer for one root, then efficiently compute answers for all other roots by understanding how the answer changes when moving to adjacent nodes.

## Key Takeaways

1. **Re-rooting DP is powerful for tree problems**: When you need to compute something for every node as the root, compute it for one root first, then propagate changes along edges.

2. **Direction matters in directed trees**: Keep track of edge directions with flags (0/1 or True/False) to correctly calculate what changes when the root moves.

3. **Two-pass DFS solves many tree DP problems**: First pass computes bottom-up, second pass propagates top-down. This pattern appears in various tree optimization problems.

Related problems: [Reorder Routes to Make All Paths Lead to the City Zero](/problem/reorder-routes-to-make-all-paths-lead-to-the-city-zero)
