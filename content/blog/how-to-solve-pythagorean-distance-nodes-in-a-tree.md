---
title: "How to Solve Pythagorean Distance Nodes in a Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Pythagorean Distance Nodes in a Tree. Medium difficulty, 57.7% acceptance rate. Topics: Tree, Breadth-First Search."
date: "2029-11-07"
category: "dsa-patterns"
tags: ["pythagorean-distance-nodes-in-a-tree", "tree", "breadth-first-search", "medium"]
---

# How to Solve Pythagorean Distance Nodes in a Tree

This problem asks us to find all nodes in a tree whose distance from three distinct target nodes forms a Pythagorean triple. Specifically, for each node `i`, we need to check if `dist(i, x)² + dist(i, y)² = dist(i, z)²`, where `dist(a, b)` is the shortest path distance between nodes `a` and `b` in the tree. What makes this problem interesting is that we need to compute distances from multiple sources efficiently in a tree structure, which requires careful algorithm design rather than simple brute force.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider a tree with `n = 5` nodes and edges:

```
edges = [[0,1], [1,2], [2,3], [2,4]]
x = 0, y = 3, z = 4
```

The tree looks like this:

```
    0
    |
    1
    |
    2
   / \
  3   4
```

We need to check each node to see if it satisfies the Pythagorean condition:

**Node 0**:

- dist(0, x) = dist(0, 0) = 0
- dist(0, y) = dist(0, 3) = 3 (path: 0→1→2→3)
- dist(0, z) = dist(0, 4) = 3 (path: 0→1→2→4)
- Check: 0² + 3² = 0 + 9 = 9, 3² = 9 ✓ Pythagorean triple!

**Node 1**:

- dist(1, x) = dist(1, 0) = 1
- dist(1, y) = dist(1, 3) = 2
- dist(1, z) = dist(1, 4) = 2
- Check: 1² + 2² = 1 + 4 = 5, 2² = 4 ✗ Not a Pythagorean triple

**Node 2**:

- dist(2, x) = 2
- dist(2, y) = 1
- dist(2, z) = 1
- Check: 2² + 1² = 4 + 1 = 5, 1² = 1 ✗ Not a Pythagorean triple

**Node 3**:

- dist(3, x) = 3
- dist(3, y) = 0
- dist(3, z) = 2
- Check: 3² + 0² = 9 + 0 = 9, 2² = 4 ✗ Not a Pythagorean triple

**Node 4**:

- dist(4, x) = 3
- dist(4, y) = 2
- dist(4, z) = 0
- Check: 3² + 2² = 9 + 4 = 13, 0² = 0 ✗ Not a Pythagorean triple

So only node 0 satisfies the condition. The key insight is that we need to compute distances from every node to all three target nodes efficiently.

## Brute Force Approach

A naive approach would be to compute distances between every pair of nodes, then check the Pythagorean condition for each node. For each node `i`, we could:

1. Run BFS/DFS from `i` to find distances to `x`, `y`, and `z`
2. Check if `dist(i, x)² + dist(i, y)² = dist(i, z)²`

This would require running BFS/DFS `n` times (once for each node as source), giving us O(n²) time complexity since each BFS/DFS takes O(n) time in a tree with `n` nodes and `n-1` edges. For `n` up to 10⁵ (common in LeetCode constraints), this O(n²) approach would be far too slow.

Even if we try to compute all-pairs shortest paths using Floyd-Warshall, that would be O(n³), which is even worse. The brute force approach doesn't leverage the tree structure effectively.

## Optimized Approach

The key insight is that in a tree, the shortest path between any two nodes is unique. We can compute distances from all nodes to each target node efficiently using BFS from each target:

1. **Compute distances from x**: Run BFS starting from node `x` to compute `distX[i]` for all nodes `i`
2. **Compute distances from y**: Run BFS starting from node `y` to compute `distY[i]` for all nodes `i`
3. **Compute distances from z**: Run BFS starting from node `z` to compute `distZ[i]` for all nodes `i`

Each BFS takes O(n) time, so three BFS runs take O(3n) = O(n) time total. After we have these three distance arrays, we can check each node `i` in O(1) time to see if:

```
distX[i]² + distY[i]² == distZ[i]²
```

This gives us an overall O(n) time solution, which is optimal since we need to examine every node at least once.

Why does this work? In a tree, BFS from a single source computes the shortest path to all other nodes efficiently. Since the tree is undirected and connected (by definition), BFS will find the unique path to each node.

## Optimal Solution

Here's the complete implementation using three BFS operations:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
from collections import deque
from typing import List

def pythagoreanDistanceNodes(n: int, edges: List[List[int]], x: int, y: int, z: int) -> List[int]:
    """
    Find all nodes where distances to x, y, z form a Pythagorean triple.

    Args:
        n: Number of nodes in the tree (0 to n-1)
        edges: List of undirected edges
        x, y, z: Three distinct target nodes

    Returns:
        List of node indices that satisfy the condition
    """
    # Step 1: Build adjacency list for the tree
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    # Helper function to perform BFS from a source node
    def bfs(start: int) -> List[int]:
        """Return distance array from start node to all other nodes."""
        dist = [-1] * n  # -1 means unvisited
        dist[start] = 0  # Distance to itself is 0
        queue = deque([start])

        while queue:
            node = queue.popleft()
            # Explore all neighbors
            for neighbor in graph[node]:
                if dist[neighbor] == -1:  # Not visited yet
                    dist[neighbor] = dist[node] + 1
                    queue.append(neighbor)
        return dist

    # Step 2: Compute distances from each target node
    dist_x = bfs(x)  # Distance from x to all nodes
    dist_y = bfs(y)  # Distance from y to all nodes
    dist_z = bfs(z)  # Distance from z to all nodes

    # Step 3: Check Pythagorean condition for each node
    result = []
    for i in range(n):
        # Check if distances form a Pythagorean triple
        if dist_x[i] * dist_x[i] + dist_y[i] * dist_y[i] == dist_z[i] * dist_z[i]:
            result.append(i)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Find all nodes where distances to x, y, z form a Pythagorean triple.
 * @param {number} n - Number of nodes in the tree (0 to n-1)
 * @param {number[][]} edges - List of undirected edges
 * @param {number} x - First target node
 * @param {number} y - Second target node
 * @param {number} z - Third target node
 * @return {number[]} - List of node indices that satisfy the condition
 */
function pythagoreanDistanceNodes(n, edges, x, y, z) {
  // Step 1: Build adjacency list for the tree
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Helper function to perform BFS from a source node
  const bfs = (start) => {
    // Return distance array from start node to all other nodes
    const dist = Array(n).fill(-1); // -1 means unvisited
    dist[start] = 0; // Distance to itself is 0
    const queue = [start];

    while (queue.length > 0) {
      const node = queue.shift();
      // Explore all neighbors
      for (const neighbor of graph[node]) {
        if (dist[neighbor] === -1) {
          // Not visited yet
          dist[neighbor] = dist[node] + 1;
          queue.push(neighbor);
        }
      }
    }
    return dist;
  };

  // Step 2: Compute distances from each target node
  const distX = bfs(x); // Distance from x to all nodes
  const distY = bfs(y); // Distance from y to all nodes
  const distZ = bfs(z); // Distance from z to all nodes

  // Step 3: Check Pythagorean condition for each node
  const result = [];
  for (let i = 0; i < n; i++) {
    // Check if distances form a Pythagorean triple
    if (distX[i] * distX[i] + distY[i] * distY[i] === distZ[i] * distZ[i]) {
      result.push(i);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    /**
     * Find all nodes where distances to x, y, z form a Pythagorean triple.
     * @param n Number of nodes in the tree (0 to n-1)
     * @param edges List of undirected edges
     * @param x First target node
     * @param y Second target node
     * @param z Third target node
     * @return List of node indices that satisfy the condition
     */
    public List<Integer> pythagoreanDistanceNodes(int n, int[][] edges, int x, int y, int z) {
        // Step 1: Build adjacency list for the tree
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Helper function to perform BFS from a source node
        int[] bfs(int start) {
            // Return distance array from start node to all other nodes
            int[] dist = new int[n];
            Arrays.fill(dist, -1);  // -1 means unvisited
            dist[start] = 0;  // Distance to itself is 0
            Queue<Integer> queue = new LinkedList<>();
            queue.offer(start);

            while (!queue.isEmpty()) {
                int node = queue.poll();
                // Explore all neighbors
                for (int neighbor : graph[node]) {
                    if (dist[neighbor] == -1) {  // Not visited yet
                        dist[neighbor] = dist[node] + 1;
                        queue.offer(neighbor);
                    }
                }
            }
            return dist;
        }

        // Step 2: Compute distances from each target node
        int[] distX = bfs(x);  // Distance from x to all nodes
        int[] distY = bfs(y);  // Distance from y to all nodes
        int[] distZ = bfs(z);  // Distance from z to all nodes

        // Step 3: Check Pythagorean condition for each node
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            // Check if distances form a Pythagorean triple
            if (distX[i] * distX[i] + distY[i] * distY[i] == distZ[i] * distZ[i]) {
                result.add(i);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the adjacency list takes O(n) time (iterating through `n-1` edges)
- Each BFS traversal visits all `n` nodes and processes all `n-1` edges, taking O(n) time
- We perform 3 BFS traversals, so total BFS time is O(3n) = O(n)
- Checking the Pythagorean condition for all `n` nodes takes O(n) time
- Overall: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- The adjacency list stores `2*(n-1)` edges = O(n) space
- Each distance array uses O(n) space, and we have 3 of them = O(3n) = O(n)
- The BFS queue can hold up to O(n) nodes in the worst case
- Overall: O(n) space

## Common Mistakes

1. **Using DFS instead of BFS for distance calculation**: While DFS can find paths, BFS is more natural for computing shortest path distances in unweighted graphs. DFS might find a path but not necessarily the shortest one if you're not careful about tracking distances.

2. **Forgetting that edges are undirected**: When building the adjacency list, you must add edges in both directions. A tree is undirected by definition, so `graph[u].add(v)` and `graph[v].add(u)` are both needed.

3. **Not handling the Pythagorean condition correctly**: The problem asks for `dist(i, x)² + dist(i, y)² = dist(i, z)²`, not `dist(i, x) + dist(i, y) = dist(i, z)`. Remember to square the distances.

4. **Assuming the tree is rooted or has a specific structure**: The tree is undirected and unrooted. BFS works regardless of which node we start from because trees are connected acyclic graphs.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Multi-source BFS for distance computation**: Computing distances from multiple sources in a graph/tree. Related problems:
   - **LeetCode 863: All Nodes Distance K in Binary Tree** - Find nodes at distance K from a target node
   - **LeetCode 994: Rotting Oranges** - Multi-source BFS to track contamination spread

2. **Tree distance problems using BFS/DFS**: Many tree problems require computing distances between nodes. Related problems:
   - **LeetCode 543: Diameter of a Binary Tree** - Find the longest path between any two nodes
   - **LeetCode 1522: Diameter of N-Ary Tree** - Similar concept for N-ary trees

The core technique of running BFS from key nodes to compute distances efficiently is widely applicable in tree and graph problems.

## Key Takeaways

1. **In trees, BFS from a node computes shortest distances to all other nodes in O(n) time**. This is more efficient than all-pairs shortest path algorithms which would be O(n²) or worse.

2. **When you need distances from multiple reference points, run BFS from each reference separately**. The combined O(kn) time (where k is the number of references) is often acceptable and much better than computing all-pairs distances.

3. **Tree problems often have O(n) solutions** because trees have exactly n-1 edges. If your solution is O(n²) or worse, look for ways to leverage the tree structure more effectively.

[Practice this problem on CodeJeet](/problem/pythagorean-distance-nodes-in-a-tree)
