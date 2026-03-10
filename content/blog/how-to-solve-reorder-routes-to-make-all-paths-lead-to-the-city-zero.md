---
title: "How to Solve Reorder Routes to Make All Paths Lead to the City Zero — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reorder Routes to Make All Paths Lead to the City Zero. Medium difficulty, 65.6% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory."
date: "2027-12-15"
category: "dsa-patterns"
tags:
  [
    "reorder-routes-to-make-all-paths-lead-to-the-city-zero",
    "depth-first-search",
    "breadth-first-search",
    "graph-theory",
    "medium",
  ]
---

# How to Solve Reorder Routes to Make All Paths Lead to the City Zero

You're given a tree of `n` cities where roads are initially directed. Your task is to find the minimum number of road direction reversals needed so that every city can reach city 0. The tricky part is recognizing that this is essentially a tree traversal problem where we need to count "wrong-way" edges when traversing from the root (city 0) outward.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** n = 6, connections = [[0,1],[1,3],[2,3],[4,0],[4,5]]

First, let's understand the initial directed graph:

- 0 → 1 (road from 0 to 1)
- 1 → 3 (road from 1 to 3)
- 2 → 3 (road from 2 to 3)
- 4 → 0 (road from 4 to 0)
- 4 → 5 (road from 4 to 5)

Visually, we have:

```
4 → 0 → 1 → 3 ← 2
↓
5
```

Now, we want every city to reach city 0. Starting from city 0 (our root), we'll traverse outward:

1. **From city 0 to city 1**: The road goes 0→1, which is AWAY from 0. If we want city 1 to reach 0, we need to reverse this road. Count: 1

2. **From city 1 to city 3**: The road goes 1→3, which is further away from 0. Need to reverse. Count: 2

3. **From city 3 to city 2**: There's no direct road 3→2, but there IS a road 2→3. When we reach city 3 and look at neighbor 2, we see the road goes 2→3, which is TOWARD city 3 (and thus toward our current position in the traversal). This is the correct direction for reaching 0 (since we're coming from 0 outward). No reversal needed.

4. **From city 0 to city 4**: There's no direct road 0→4, but there IS a road 4→0. When we look from 0 to neighbor 4, the road goes 4→0, which is TOWARD 0. This is the wrong direction for our outward traversal from 0. No reversal needed.

5. **From city 4 to city 5**: The road goes 4→5, which is away from 0. Need to reverse. Count: 3

**Total reversals needed:** 3

The key insight: When doing a DFS/BFS from city 0, we need to count edges that point AWAY from 0 in our traversal direction.

## Brute Force Approach

A naive approach might try to simulate all possible reversal combinations or use a complex path-finding algorithm. One brute force idea:

1. For each city i (1 to n-1), find if there's a path to city 0
2. If not, try reversing roads to create a path
3. Track the minimum reversals needed

However, this approach has several problems:

- Checking paths for each city would be O(n²) in a tree
- We'd need to track which reversals help multiple cities
- The search space grows exponentially if we try all reversal combinations

The brute force would be far too slow for n up to 5×10⁴. We need a more systematic approach that leverages the tree structure.

## Optimized Approach

The key insight is that we have a **tree** (n cities, n-1 edges, all connected). This means:

1. There's exactly one path between any two cities
2. We can root the tree at city 0
3. For the tree to be oriented toward city 0, every edge must point toward the root

Here's the step-by-step reasoning:

1. **Build an undirected adjacency list** from the connections so we can traverse the tree freely
2. **Store edge directions separately** so we know which direction each road originally had
3. **Perform DFS/BFS from city 0**, treating it as the root
4. **When traversing from node u to node v**:
   - If the original road was u→v, this edge points AWAY from the root in our traversal
   - We need to reverse it, so increment our counter
   - If the original road was v→u, it already points TOWARD the root, no reversal needed
5. **Recursively traverse all neighbors** (except the parent to avoid cycles)

Why this works: In a tree rooted at 0, for every node to reach 0, all edges on the path from that node to 0 must point toward 0. Our DFS from 0 outward naturally checks each edge exactly once and counts those that need reversal.

## Optimal Solution

Here's the complete implementation using DFS:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
class Solution:
    def minReorder(self, n: int, connections: List[List[int]]) -> int:
        # Step 1: Build adjacency list for undirected traversal
        # We need to know both neighbors and original directions
        graph = [[] for _ in range(n)]

        # Store connections with direction information
        # For each edge a->b, we add:
        # - To a's list: (b, 1) meaning edge points away from a (needs reversal if traversing a->b)
        # - To b's list: (a, 0) meaning edge points toward b (no reversal needed if traversing b->a)
        for a, b in connections:
            graph[a].append((b, 1))  # 1 means original direction is a->b
            graph[b].append((a, 0))  # 0 means original direction is a->b (so b<-a)

        # Step 2: DFS from city 0
        def dfs(node, parent):
            reversals = 0
            # Visit all neighbors
            for neighbor, direction in graph[node]:
                # Skip the parent to avoid cycles
                if neighbor == parent:
                    continue
                # If direction is 1, this edge originally points from current node to neighbor
                # Since we're traversing from root outward, this edge points AWAY from root
                # We need to reverse it
                reversals += direction
                # Continue DFS
                reversals += dfs(neighbor, node)
            return reversals

        # Start DFS from city 0 with no parent
        return dfs(0, -1)
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * @param {number} n
 * @param {number[][]} connections
 * @return {number}
 */
var minReorder = function (n, connections) {
  // Step 1: Build adjacency list
  const graph = Array.from({ length: n }, () => []);

  // Add edges with direction information
  // direction = 1 means edge points from current node to neighbor
  // direction = 0 means edge points from neighbor to current node
  for (const [a, b] of connections) {
    graph[a].push([b, 1]); // a -> b
    graph[b].push([a, 0]); // b <- a (edge points toward b)
  }

  // Step 2: DFS function
  const dfs = (node, parent) => {
    let reversals = 0;

    // Visit all neighbors
    for (const [neighbor, direction] of graph[node]) {
      // Skip parent to avoid cycles
      if (neighbor === parent) {
        continue;
      }

      // If direction is 1, edge points away from current node
      // Since we're traversing from root outward, this needs reversal
      reversals += direction;

      // Continue DFS
      reversals += dfs(neighbor, node);
    }

    return reversals;
  };

  // Start DFS from city 0
  return dfs(0, -1);
};
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int minReorder(int n, int[][] connections) {
        // Step 1: Build adjacency list
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }

        // Add edges with direction information
        // int[] in adjacency list: [neighbor, direction]
        // direction = 1 means edge points from current node to neighbor
        // direction = 0 means edge points from neighbor to current node
        for (int[] connection : connections) {
            int a = connection[0];
            int b = connection[1];
            graph.get(a).add(new int[]{b, 1});  // a -> b
            graph.get(b).add(new int[]{a, 0});  // b <- a
        }

        // Step 2: DFS traversal
        return dfs(0, -1, graph);
    }

    private int dfs(int node, int parent, List<List<int[]>> graph) {
        int reversals = 0;

        // Visit all neighbors
        for (int[] neighborInfo : graph.get(node)) {
            int neighbor = neighborInfo[0];
            int direction = neighborInfo[1];

            // Skip parent to avoid cycles
            if (neighbor == parent) {
                continue;
            }

            // If direction is 1, edge points away from current node
            // Since we're traversing from root outward, this needs reversal
            reversals += direction;

            // Continue DFS
            reversals += dfs(neighbor, node, graph);
        }

        return reversals;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We build the adjacency list in O(n) time since there are n-1 edges
- We perform a DFS that visits each node exactly once: O(n)
- Each edge is processed exactly twice (once in each direction in the adjacency list): O(2×(n-1)) = O(n)
- Total: O(n)

**Space Complexity:** O(n)

- Adjacency list stores 2×(n-1) edges: O(n)
- DFS recursion stack can go up to O(n) in the worst case (linear chain tree)
- Total: O(n)

## Common Mistakes

1. **Forgetting to build an undirected graph**: The input gives directed edges, but we need to traverse in both directions. If you only build a directed graph, you won't be able to reach all nodes from city 0 when some edges point the wrong way.

2. **Not tracking edge directions properly**: When adding both directions to the adjacency list, you must mark which direction corresponds to the original road. A common error is adding all edges as undirected without tracking which ones need reversal.

3. **Missing the parent check in DFS**: Without checking `if neighbor == parent`, you'll get infinite recursion as you bounce back and forth between nodes.

4. **Using BFS without direction tracking**: BFS works too, but you still need to track edge directions. Some candidates implement BFS but forget to count reversals when exploring edges.

## When You'll See This Pattern

This problem uses **tree traversal with state tracking**, a pattern common in many graph problems:

1. **Minimum Edge Reversals So Every Node Is Reachable** (Hard): Direct generalization of this problem to directed graphs that aren't necessarily trees.

2. **Sum of Distances in Tree** (LeetCode 834): Similar tree traversal where you need to propagate information both up and down the tree.

3. **Tree Diameter** (LeetCode 543): Another tree traversal problem where you need to track state (maximum depths) during DFS.

4. **All Nodes Distance K in Binary Tree** (LeetCode 863): Requires treating the tree as an undirected graph and doing BFS/DFS.

The core pattern: When you need to process a tree based on relationships between nodes, build an undirected representation, do a traversal from a root, and track additional state about the edges/nodes.

## Key Takeaways

1. **Trees are undirected by nature**: Even when edges have direction, for traversal purposes, treat them as undirected and track direction as separate state.

2. **Root the tree at the natural center**: When the problem asks about reaching a specific node (city 0), that node should be your traversal root.

3. **Count during traversal, not after**: It's more efficient to incrementally count what you need during DFS/BFS rather than doing a separate pass afterward.

4. **The parent parameter trick**: Always pass the parent node in tree DFS to avoid revisiting nodes and infinite recursion.

Related problems: [Minimum Edge Reversals So Every Node Is Reachable](/problem/minimum-edge-reversals-so-every-node-is-reachable)
