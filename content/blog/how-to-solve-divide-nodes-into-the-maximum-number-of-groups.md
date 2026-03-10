---
title: "How to Solve Divide Nodes Into the Maximum Number of Groups — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Divide Nodes Into the Maximum Number of Groups. Hard difficulty, 67.0% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2027-09-20"
category: "dsa-patterns"
tags:
  [
    "divide-nodes-into-the-maximum-number-of-groups",
    "depth-first-search",
    "breadth-first-search",
    "union-find",
    "hard",
  ]
---

# How to Solve Divide Nodes Into the Maximum Number of Groups

This problem asks us to divide nodes in an undirected graph into the maximum number of groups such that no two nodes in the same group are connected by an edge. What makes this tricky is that the graph might be disconnected, and within each connected component, we need to find the longest possible "distance" between any two nodes to maximize our group count. This is essentially finding the diameter of each component and using it to determine how many groups we can create.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider `n = 6` with edges: `[[1,2],[1,3],[2,4],[3,5],[5,6]]`.

The graph looks like:

```
1 — 2     (Component 1)
|    |
3    4
|
5 — 6     (Component 2)
```

We have two connected components. For each component, we need to find the maximum number of groups we can create.

**Component 1 (nodes 1-4):**

- If we start BFS from node 1: groups would be {1}, {2,3}, {4} → 3 groups
- If we start BFS from node 2: groups would be {2}, {1,4}, {3} → 3 groups
- If we start BFS from node 4: groups would be {4}, {2}, {1,3} → 3 groups
  The maximum distance (diameter) is 2 edges (1→2→4 or 1→3→5), so we can create 3 groups.

**Component 2 (nodes 5-6):**

- Diameter is 1 edge (5→6), so we can create 2 groups.

**Total groups:** 3 + 2 = 5

The key insight: For each connected component, the maximum number of groups equals the component's diameter + 1. We need to check if the component is bipartite (can be 2-colored) first, because if it contains an odd-length cycle, we can't assign groups at all.

## Brute Force Approach

A naive approach would be to try all possible starting nodes for BFS in each component, compute the maximum depth for each starting point, and take the maximum. For each component with `k` nodes, we'd run BFS `k` times, each taking O(k + edges). This gives O(k²) per component.

The problem with this brute force is that for large components (up to n=500), O(n²) operations (250,000 BFS runs in worst case) would be too slow. We need a smarter way to find the diameter without trying every starting node.

## Optimized Approach

The key optimization comes from graph theory: **The diameter of a tree (or bipartite graph) can be found by running BFS twice.**

1. **First BFS:** Start from any node, find the farthest node.
2. **Second BFS:** Start from that farthest node, find the maximum distance.

This works because in a tree (or any bipartite graph), the longest path must pass through the "center" in some sense. The farthest node from any starting point will be one endpoint of the diameter.

However, our graph might not be a tree—it could have cycles. But if it contains an odd-length cycle, it's not bipartite, and we can't assign groups at all. So we first check bipartiteness using BFS coloring.

**Step-by-step reasoning:**

1. Build adjacency list from edges
2. Find all connected components using BFS/DFS
3. For each component:
   - Check if it's bipartite using BFS coloring
   - If not bipartite, return -1 (impossible to assign groups)
   - If bipartite, find the diameter using the "two BFS" method
4. Sum up (diameter + 1) for all components

The bipartite check is crucial: In a graph with an odd cycle, you'll eventually try to assign the same group to two connected nodes.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * (n + m)) where n = nodes, m = edges
# Space: O(n + m) for adjacency list and BFS queues
class Solution:
    def magnificentSets(self, n: int, edges: List[List[int]]) -> int:
        # Step 1: Build adjacency list
        adj = [[] for _ in range(n + 1)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)

        # Step 2: Find all connected components using BFS
        visited = [False] * (n + 1)
        components = []

        for i in range(1, n + 1):
            if not visited[i]:
                # BFS to find all nodes in this component
                queue = [i]
                visited[i] = True
                component = []

                while queue:
                    node = queue.pop(0)
                    component.append(node)

                    for neighbor in adj[node]:
                        if not visited[neighbor]:
                            visited[neighbor] = True
                            queue.append(neighbor)

                components.append(component)

        # Step 3: Process each component
        total_groups = 0

        for component in components:
            # Check if component is bipartite and find its diameter
            diameter = self.findComponentDiameter(component, adj)
            if diameter == -1:  # Not bipartite
                return -1
            total_groups += diameter

        return total_groups

    def findComponentDiameter(self, component, adj):
        """
        Returns the maximum number of groups possible for this component
        (which is diameter + 1), or -1 if not bipartite.
        """
        max_diameter = 0

        # Try each node as starting point for BFS to find maximum depth
        for start in component:
            # BFS to check bipartiteness and compute depth from this start
            color = {}  # 0 or 1 for bipartite coloring
            depth = {}  # Distance from start node
            queue = [start]
            color[start] = 0
            depth[start] = 1
            is_bipartite = True
            max_depth = 1

            while queue and is_bipartite:
                node = queue.pop(0)

                for neighbor in adj[node]:
                    if neighbor not in color:
                        # Color neighbor with opposite color
                        color[neighbor] = 1 - color[node]
                        depth[neighbor] = depth[node] + 1
                        max_depth = max(max_depth, depth[neighbor])
                        queue.append(neighbor)
                    elif color[neighbor] == color[node]:
                        # Same color for adjacent nodes = not bipartite
                        is_bipartite = False
                        break

            if not is_bipartite:
                return -1

            # Update maximum diameter found from any starting node
            max_diameter = max(max_diameter, max_depth)

        return max_diameter
```

```javascript
// Time: O(n * (n + m)) where n = nodes, m = edges
// Space: O(n + m) for adjacency list and BFS queues
var magnificentSets = function (n, edges) {
  // Step 1: Build adjacency list
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // Step 2: Find all connected components using BFS
  const visited = Array(n + 1).fill(false);
  const components = [];

  for (let i = 1; i <= n; i++) {
    if (!visited[i]) {
      // BFS to find all nodes in this component
      const queue = [i];
      visited[i] = true;
      const component = [];

      while (queue.length > 0) {
        const node = queue.shift();
        component.push(node);

        for (const neighbor of adj[node]) {
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            queue.push(neighbor);
          }
        }
      }

      components.push(component);
    }
  }

  // Step 3: Process each component
  let totalGroups = 0;

  for (const component of components) {
    // Check if component is bipartite and find its diameter
    const diameter = findComponentDiameter(component, adj);
    if (diameter === -1) {
      // Not bipartite
      return -1;
    }
    totalGroups += diameter;
  }

  return totalGroups;
};

function findComponentDiameter(component, adj) {
  /**
   * Returns the maximum number of groups possible for this component
   * (which is diameter + 1), or -1 if not bipartite.
   */
  let maxDiameter = 0;

  // Try each node as starting point for BFS to find maximum depth
  for (const start of component) {
    // BFS to check bipartiteness and compute depth from this start
    const color = new Map(); // 0 or 1 for bipartite coloring
    const depth = new Map(); // Distance from start node
    const queue = [start];
    color.set(start, 0);
    depth.set(start, 1);
    let isBipartite = true;
    let maxDepth = 1;

    while (queue.length > 0 && isBipartite) {
      const node = queue.shift();

      for (const neighbor of adj[node]) {
        if (!color.has(neighbor)) {
          // Color neighbor with opposite color
          color.set(neighbor, 1 - color.get(node));
          depth.set(neighbor, depth.get(node) + 1);
          maxDepth = Math.max(maxDepth, depth.get(neighbor));
          queue.push(neighbor);
        } else if (color.get(neighbor) === color.get(node)) {
          // Same color for adjacent nodes = not bipartite
          isBipartite = false;
          break;
        }
      }
    }

    if (!isBipartite) {
      return -1;
    }

    // Update maximum diameter found from any starting node
    maxDiameter = Math.max(maxDiameter, maxDepth);
  }

  return maxDiameter;
}
```

```java
// Time: O(n * (n + m)) where n = nodes, m = edges
// Space: O(n + m) for adjacency list and BFS queues
class Solution {
    public int magnificentSets(int n, int[][] edges) {
        // Step 1: Build adjacency list
        List<Integer>[] adj = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) {
            adj[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            adj[u].add(v);
            adj[v].add(u);
        }

        // Step 2: Find all connected components using BFS
        boolean[] visited = new boolean[n + 1];
        List<List<Integer>> components = new ArrayList<>();

        for (int i = 1; i <= n; i++) {
            if (!visited[i]) {
                // BFS to find all nodes in this component
                Queue<Integer> queue = new LinkedList<>();
                queue.offer(i);
                visited[i] = true;
                List<Integer> component = new ArrayList<>();

                while (!queue.isEmpty()) {
                    int node = queue.poll();
                    component.add(node);

                    for (int neighbor : adj[node]) {
                        if (!visited[neighbor]) {
                            visited[neighbor] = true;
                            queue.offer(neighbor);
                        }
                    }
                }

                components.add(component);
            }
        }

        // Step 3: Process each component
        int totalGroups = 0;

        for (List<Integer> component : components) {
            // Check if component is bipartite and find its diameter
            int diameter = findComponentDiameter(component, adj);
            if (diameter == -1) {  // Not bipartite
                return -1;
            }
            totalGroups += diameter;
        }

        return totalGroups;
    }

    private int findComponentDiameter(List<Integer> component, List<Integer>[] adj) {
        /**
         * Returns the maximum number of groups possible for this component
         * (which is diameter + 1), or -1 if not bipartite.
         */
        int maxDiameter = 0;

        // Try each node as starting point for BFS to find maximum depth
        for (int start : component) {
            // BFS to check bipartiteness and compute depth from this start
            Map<Integer, Integer> color = new HashMap<>();  // 0 or 1 for bipartite coloring
            Map<Integer, Integer> depth = new HashMap<>();  // Distance from start node
            Queue<Integer> queue = new LinkedList<>();
            queue.offer(start);
            color.put(start, 0);
            depth.put(start, 1);
            boolean isBipartite = true;
            int maxDepth = 1;

            while (!queue.isEmpty() && isBipartite) {
                int node = queue.poll();

                for (int neighbor : adj[node]) {
                    if (!color.containsKey(neighbor)) {
                        // Color neighbor with opposite color
                        color.put(neighbor, 1 - color.get(node));
                        depth.put(neighbor, depth.get(node) + 1);
                        maxDepth = Math.max(maxDepth, depth.get(neighbor));
                        queue.offer(neighbor);
                    } else if (color.get(neighbor) == color.get(node)) {
                        // Same color for adjacent nodes = not bipartite
                        isBipartite = false;
                        break;
                    }
                }
            }

            if (!isBipartite) {
                return -1;
            }

            // Update maximum diameter found from any starting node
            maxDiameter = Math.max(maxDiameter, maxDepth);
        }

        return maxDiameter;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × (n + m)) where n is number of nodes and m is number of edges.

- We process each connected component separately
- For each component of size k, we try each node as BFS starting point: O(k) BFS runs
- Each BFS visits all k nodes and their edges: O(k + edges_in_component)
- In worst case, one component contains all n nodes: O(n × (n + m))

**Space Complexity:** O(n + m)

- Adjacency list stores all edges: O(n + m)
- BFS queues and visited arrays: O(n)
- Color and depth maps for each BFS: O(n)

## Common Mistakes

1. **Forgetting to check bipartiteness first:** Candidates might jump straight to finding the diameter without verifying the graph is bipartite. Any odd cycle makes group assignment impossible.

2. **Assuming the graph is connected:** The problem states it's an undirected graph, which could have multiple connected components. You must process each separately and sum results.

3. **Using DFS instead of BFS for level calculation:** DFS doesn't naturally give you the shortest path distances needed for group assignment. BFS processes nodes level by level, which directly corresponds to group numbers.

4. **Not trying all possible starting nodes:** While the "two BFS" method works for trees, general bipartite graphs can have more complex structures. We need to try all nodes as starting points to find the true maximum depth.

## When You'll See This Pattern

This problem combines several fundamental graph concepts:

1. **Bipartite Graph Checking** (LeetCode 785): The core of checking if groups can be assigned at all. If you can't 2-color the graph, you can't assign groups.

2. **Graph Diameter Finding** (similar to tree diameter problems): Finding the longest shortest path in a graph. In trees, you can use the "two BFS" optimization, but in general graphs with cycles, you might need to try all starting points.

3. **Connected Components** (LeetCode 323): The graph may be disconnected, so you need to handle each component separately.

## Key Takeaways

1. **Bipartite checking is fundamental:** When you need to partition nodes into two groups with no intra-group edges, think bipartite graphs. Use BFS coloring to check.

2. **Graph diameter equals maximum BFS depth:** The longest shortest path in a graph can be found by running BFS from each node (or using optimizations for trees).

3. **Disconnected graphs need component-wise processing:** Always check if the graph might be disconnected. Process each component independently and combine results.

Related problems: [Binary Tree Level Order Traversal](/problem/binary-tree-level-order-traversal), [Is Graph Bipartite?](/problem/is-graph-bipartite), [Shortest Cycle in a Graph](/problem/shortest-cycle-in-a-graph)
