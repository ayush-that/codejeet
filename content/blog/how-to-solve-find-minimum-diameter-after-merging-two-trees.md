---
title: "How to Solve Find Minimum Diameter After Merging Two Trees — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Minimum Diameter After Merging Two Trees. Hard difficulty, 57.1% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Graph Theory."
date: "2027-11-25"
category: "dsa-patterns"
tags:
  [
    "find-minimum-diameter-after-merging-two-trees",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "hard",
  ]
---

# How to Solve Find Minimum Diameter After Merging Two Trees

This problem asks us to connect two trees with a single edge and find the minimum possible diameter of the resulting combined tree. The diameter of a tree is the length of the longest path between any two nodes. What makes this problem tricky is that we need to understand tree diameter properties deeply: the diameter is determined by the longest path, and when we connect two trees, we create new potential longest paths that combine segments from both trees.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Tree 1:** 3 nodes in a line: 0-1-2 (diameter = 2)
**Tree 2:** 4 nodes in a star: center 0 connected to 1, 2, 3 (diameter = 2)

We need to connect one node from Tree 1 to one node from Tree 2 with a single edge. Let's try different connections:

1. **Connect leaf 2 (Tree 1) to leaf 1 (Tree 2):**
   - Path through Tree 1: from 0 to 2 = 2 edges
   - Path through Tree 2: from any leaf to another leaf = 2 edges
   - New combined path: from 0 (Tree 1) through 2-1 (connection) to leaf 3 (Tree 2) = 2 + 1 + 2 = 5 edges
   - Diameter = max(2, 2, 5) = 5

2. **Connect middle node 1 (Tree 1) to center 0 (Tree 2):**
   - New combined path: from leaf 0 (Tree 1) through 1-0 (connection) to leaf 3 (Tree 2) = 1 + 1 + 1 = 3 edges
   - Diameter = max(2, 2, 3) = 3

3. **Connect leaf 0 (Tree 1) to center 0 (Tree 2):**
   - New combined path: from leaf 2 (Tree 1) through 0-0 (connection) to leaf 3 (Tree 2) = 2 + 1 + 1 = 4 edges
   - Diameter = max(2, 2, 4) = 4

The minimum diameter is 3. Notice the pattern: we want to connect nodes that are as central as possible in each tree to minimize the longest new path.

## Brute Force Approach

A naive approach would try all possible connections between the two trees:

1. For each node `u` in Tree 1
2. For each node `v` in Tree 2
3. Connect `u` and `v` with an edge
4. Calculate the diameter of the combined tree
5. Track the minimum diameter found

The diameter calculation for a tree with `n+m` nodes using BFS/DFS takes O(n+m) time. With n × m possible connections, this gives O(n × m × (n+m)) time complexity, which is far too slow for constraints where n and m can be up to 10^5.

Even if we optimize diameter calculation, we still have O(n × m) connections to try. We need a smarter approach that doesn't require trying every possible connection.

## Optimized Approach

The key insight is that when we connect two trees, the diameter of the combined tree will be one of three possibilities:

1. The original diameter of Tree 1
2. The original diameter of Tree 2
3. A new path that goes through the connection edge

The new path through the connection has length = `dist1 + 1 + dist2`, where:

- `dist1` = distance from the connection point in Tree 1 to its farthest node
- `dist2` = distance from the connection point in Tree 2 to its farthest node

To minimize the maximum of these three values, we want to minimize the longest new path. This happens when we connect nodes that minimize `max(dist1, dist2)`.

Here's the step-by-step reasoning:

1. **Find tree diameters:** Calculate the diameter of each tree using the standard two-BFS approach.
2. **Find "radius" of each tree:** For each node, find its eccentricity (maximum distance to any other node). The minimum eccentricity is the tree's radius.
3. **Find center nodes:** Nodes with eccentricity equal to the radius are the tree's center(s). Trees have either 1 or 2 centers.
4. **Optimal connection:** Connect a center of Tree 1 to a center of Tree 2. This minimizes the maximum distance from the connection point to the farthest node in each tree.
5. **Calculate result:** The minimum diameter = max(diameter1, diameter2, radius1 + 1 + radius2)

Why does this work? The centers of a tree are the optimal connection points because they minimize the maximum distance to any other node in that tree. By connecting centers, we ensure that the new path through the connection is as short as possible.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) | Space: O(n + m)
from collections import deque
from typing import List

class Solution:
    def minimumDiameterAfterMerge(self, edges1: List[List[int]], edges2: List[List[int]]) -> int:
        # Step 1: Build adjacency lists for both trees
        def build_adjacency(edges, n):
            adj = [[] for _ in range(n)]
            for u, v in edges:
                adj[u].append(v)
                adj[v].append(u)
            return adj

        n = len(edges1) + 1  # nodes in tree 1
        m = len(edges2) + 1  # nodes in tree 2

        adj1 = build_adjacency(edges1, n)
        adj2 = build_adjacency(edges2, m)

        # Step 2: Helper function to find diameter and radius of a tree
        def tree_diameter_and_radius(adj):
            # First BFS to find farthest node from arbitrary start (node 0)
            def bfs_farthest(start):
                visited = [-1] * len(adj)
                q = deque([start])
                visited[start] = 0
                farthest = start

                while q:
                    node = q.popleft()
                    farthest = node
                    for neighbor in adj[node]:
                        if visited[neighbor] == -1:
                            visited[neighbor] = visited[node] + 1
                            q.append(neighbor)
                return farthest, visited

            # Find one end of the diameter
            end1, _ = bfs_farthest(0)
            # Find the other end and all distances from end1
            end2, dist_from_end1 = bfs_farthest(end1)
            # Get distances from end2 to find diameter path
            _, dist_from_end2 = bfs_farthest(end2)

            diameter = max(dist_from_end1)

            # Calculate eccentricity for each node and find radius
            radius = float('inf')
            for i in range(len(adj)):
                # Eccentricity = max distance to either end of diameter
                eccentricity = max(dist_from_end1[i], dist_from_end2[i])
                radius = min(radius, eccentricity)

            return diameter, radius

        # Step 3: Get diameter and radius for both trees
        diam1, radius1 = tree_diameter_and_radius(adj1)
        diam2, radius2 = tree_diameter_and_radius(adj2)

        # Step 4: Three possible diameters after connection:
        # 1. Original diameter of tree 1
        # 2. Original diameter of tree 2
        # 3. Path through connection: radius1 + 1 + radius2
        # We take the maximum of these three
        return max(diam1, diam2, radius1 + 1 + radius2)
```

```javascript
// Time: O(n + m) | Space: O(n + m)
/**
 * @param {number[][]} edges1
 * @param {number[][]} edges2
 * @return {number}
 */
var minimumDiameterAfterMerge = function (edges1, edges2) {
  // Step 1: Build adjacency lists for both trees
  const buildAdjacency = (edges, n) => {
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      adj[u].push(v);
      adj[v].push(u);
    }
    return adj;
  };

  const n = edges1.length + 1; // nodes in tree 1
  const m = edges2.length + 1; // nodes in tree 2

  const adj1 = buildAdjacency(edges1, n);
  const adj2 = buildAdjacency(edges2, m);

  // Step 2: Helper function to find diameter and radius of a tree
  const treeDiameterAndRadius = (adj) => {
    // First BFS to find farthest node from arbitrary start (node 0)
    const bfsFarthest = (start) => {
      const visited = Array(adj.length).fill(-1);
      const queue = [start];
      visited[start] = 0;
      let farthest = start;

      while (queue.length > 0) {
        const node = queue.shift();
        farthest = node;
        for (const neighbor of adj[node]) {
          if (visited[neighbor] === -1) {
            visited[neighbor] = visited[node] + 1;
            queue.push(neighbor);
          }
        }
      }
      return [farthest, visited];
    };

    // Find one end of the diameter
    const [end1, _] = bfsFarthest(0);
    // Find the other end and all distances from end1
    const [end2, distFromEnd1] = bfsFarthest(end1);
    // Get distances from end2 to find diameter path
    const [_, distFromEnd2] = bfsFarthest(end2);

    const diameter = Math.max(...distFromEnd1);

    // Calculate eccentricity for each node and find radius
    let radius = Infinity;
    for (let i = 0; i < adj.length; i++) {
      // Eccentricity = max distance to either end of diameter
      const eccentricity = Math.max(distFromEnd1[i], distFromEnd2[i]);
      radius = Math.min(radius, eccentricity);
    }

    return [diameter, radius];
  };

  // Step 3: Get diameter and radius for both trees
  const [diam1, radius1] = treeDiameterAndRadius(adj1);
  const [diam2, radius2] = treeDiameterAndRadius(adj2);

  // Step 4: Three possible diameters after connection:
  // 1. Original diameter of tree 1
  // 2. Original diameter of tree 2
  // 3. Path through connection: radius1 + 1 + radius2
  // We take the maximum of these three
  return Math.max(diam1, diam2, radius1 + 1 + radius2);
};
```

```java
// Time: O(n + m) | Space: O(n + m)
import java.util.*;

class Solution {
    public int minimumDiameterAfterMerge(int[][] edges1, int[][] edges2) {
        // Step 1: Build adjacency lists for both trees
        int n = edges1.length + 1;  // nodes in tree 1
        int m = edges2.length + 1;  // nodes in tree 2

        List<Integer>[] adj1 = buildAdjacency(edges1, n);
        List<Integer>[] adj2 = buildAdjacency(edges2, m);

        // Step 2: Get diameter and radius for both trees
        int[] result1 = treeDiameterAndRadius(adj1);
        int[] result2 = treeDiameterAndRadius(adj2);

        int diam1 = result1[0], radius1 = result1[1];
        int diam2 = result2[0], radius2 = result2[1];

        // Step 3: Three possible diameters after connection:
        // 1. Original diameter of tree 1
        // 2. Original diameter of tree 2
        // 3. Path through connection: radius1 + 1 + radius2
        // We take the maximum of these three
        return Math.max(Math.max(diam1, diam2), radius1 + 1 + radius2);
    }

    private List<Integer>[] buildAdjacency(int[][] edges, int n) {
        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            adj[u].add(v);
            adj[v].add(u);
        }
        return adj;
    }

    private int[] treeDiameterAndRadius(List<Integer>[] adj) {
        // First BFS to find farthest node from arbitrary start (node 0)
        int[] bfsResult1 = bfsFarthest(adj, 0);
        int end1 = bfsResult1[0];

        // Find the other end and all distances from end1
        int[] bfsResult2 = bfsFarthest(adj, end1);
        int end2 = bfsResult2[0];
        int[] distFromEnd1 = Arrays.copyOfRange(bfsResult2, 1, bfsResult2.length);

        // Get distances from end2
        int[] bfsResult3 = bfsFarthest(adj, end2);
        int[] distFromEnd2 = Arrays.copyOfRange(bfsResult3, 1, bfsResult3.length);

        // Calculate diameter (max distance in distFromEnd1)
        int diameter = 0;
        for (int dist : distFromEnd1) {
            diameter = Math.max(diameter, dist);
        }

        // Calculate radius (minimum eccentricity)
        int radius = Integer.MAX_VALUE;
        for (int i = 0; i < adj.length; i++) {
            // Eccentricity = max distance to either end of diameter
            int eccentricity = Math.max(distFromEnd1[i], distFromEnd2[i]);
            radius = Math.min(radius, eccentricity);
        }

        return new int[]{diameter, radius};
    }

    private int[] bfsFarthest(List<Integer>[] adj, int start) {
        int n = adj.length;
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(start);
        dist[start] = 0;
        int farthest = start;

        while (!queue.isEmpty()) {
            int node = queue.poll();
            farthest = node;
            for (int neighbor : adj[node]) {
                if (dist[neighbor] == -1) {
                    dist[neighbor] = dist[node] + 1;
                    queue.offer(neighbor);
                }
            }
        }

        // Return farthest node followed by all distances
        int[] result = new int[n + 1];
        result[0] = farthest;
        System.arraycopy(dist, 0, result, 1, n);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m)

- Building adjacency lists: O(n + m)
- Two BFS operations per tree (3 total BFS per tree): O(n) for Tree 1, O(m) for Tree 2
- Calculating eccentricities and radius: O(n) for Tree 1, O(m) for Tree 2
- Total: O(n + m)

**Space Complexity:** O(n + m)

- Adjacency lists: O(n + m)
- Distance arrays for BFS: O(n) and O(m) respectively
- Queue for BFS: O(n) or O(m) at worst

## Common Mistakes

1. **Trying all possible connections:** The most common mistake is attempting O(n × m) connections. Candidates need to recognize that connecting centers is optimal without brute force.

2. **Confusing radius with diameter:** The radius is the minimum eccentricity (minimum of maximum distances), while diameter is the maximum eccentricity. Connecting at the radius minimizes the new path length.

3. **Incorrect diameter calculation:** Some candidates try to calculate diameter with a single BFS. The standard approach requires two BFS: first to find one end of the diameter, then from that end to find the other end and the diameter length.

4. **Forgetting the original diameters:** The final diameter is the maximum of three values: diameter1, diameter2, and radius1 + 1 + radius2. Some candidates only consider the new path through the connection.

## When You'll See This Pattern

This problem combines several fundamental tree concepts:

1. **Tree Diameter Problems:** Like [Minimum Height Trees](/problem/minimum-height-trees) which finds tree centers, and [Tree Diameter](/problem/tree-diameter) which calculates the longest path.

2. **Tree Center/Radius Concepts:** Problems involving optimal placement in trees often use centers, like facility location problems or network design.

3. **Graph Combination Problems:** When combining graphs/trees and optimizing a metric (diameter, radius, etc.), similar reasoning applies.

The core technique of finding tree centers via diameter endpoints appears in many tree optimization problems. Recognizing that centers minimize maximum distance is key to solving these efficiently.

## Key Takeaways

1. **Tree centers minimize maximum distance:** For any tree, the nodes with minimum eccentricity (centers) are the optimal connection points when you want to minimize the longest path through that connection point.

2. **Diameter determines many properties:** Once you find a tree's diameter endpoints, you can efficiently compute distances to all nodes and find the radius/centers.

3. **Combine, don't brute force:** When optimizing over combinations of two structures, look for properties that let you find the optimal combination without trying all possibilities.

Related problems: [Minimum Height Trees](/problem/minimum-height-trees), [Tree Diameter](/problem/tree-diameter), [Maximize the Number of Target Nodes After Connecting Trees I](/problem/maximize-the-number-of-target-nodes-after-connecting-trees-i)
