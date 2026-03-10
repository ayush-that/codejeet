---
title: "How to Solve Count the Number of Complete Components — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count the Number of Complete Components. Medium difficulty, 77.8% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2026-08-12"
category: "dsa-patterns"
tags:
  [
    "count-the-number-of-complete-components",
    "depth-first-search",
    "breadth-first-search",
    "union-find",
    "medium",
  ]
---

# How to Solve Count the Number of Complete Components

This problem asks us to count how many connected components in an undirected graph are "complete" — meaning every vertex in the component is directly connected to every other vertex. A complete component with `k` vertices must have exactly `k*(k-1)/2` edges connecting them. The challenge is identifying which components meet this strict connectivity requirement.

## Visual Walkthrough

Let's trace through an example with `n = 6` and `edges = [[0,1],[0,2],[1,2],[3,4]]`:

```
Vertices: 0-1-2 form one component, 3-4 form another, 5 is isolated

Component 1: Vertices {0,1,2}
- Possible edges in a complete graph with 3 vertices: 3*2/2 = 3
- Actual edges: (0,1), (0,2), (1,2) → 3 edges ✓
- This is complete!

Component 2: Vertices {3,4}
- Possible edges needed: 2*1/2 = 1
- Actual edges: (3,4) → 1 edge ✓
- This is complete!

Component 3: Vertex {5}
- Possible edges needed: 1*0/2 = 0
- Actual edges: 0 ✓
- This is complete!

Total complete components: 3
```

Now consider `n = 4`, `edges = [[0,1],[0,2],[1,3]]`:

```
Component 1: Vertices {0,1,2,3}
- Possible edges needed: 4*3/2 = 6
- Actual edges: (0,1), (0,2), (1,3) → 3 edges ✗
- Missing edges: (0,3), (1,2), (2,3)
- Not complete!

Total complete components: 0
```

The key insight: For each component, we need to count both its vertices and its edges, then check if `edges_in_component = vertices_in_component * (vertices_in_component - 1) / 2`.

## Brute Force Approach

A naive approach would be:

1. Find all connected components using BFS/DFS
2. For each component, list all its vertices
3. Count how many edges exist between these vertices
4. Compare with the formula for complete graphs

The brute force would work but involves redundant work. For step 3, we'd need to check all edges for each component, leading to O(m × c) time where m is edges and c is components. With adjacency matrix representation, we could check in O(v²) per component where v is vertices in that component.

However, there's a more efficient way to count edges per component during the traversal itself.

## Optimized Approach

The optimal solution combines connected component identification with edge counting:

1. **Build adjacency lists** for efficient neighbor lookup
2. **Traverse the graph** (DFS/BFS/Union-Find) to find components
3. **Track two counts per component**: number of vertices and number of edges
4. **Adjust edge counting**: Since each edge connects two vertices, it will be counted twice during traversal (once from each endpoint). We need to divide by 2.
5. **Apply the complete graph formula**: For a component with `v` vertices, it needs exactly `v*(v-1)/2` edges to be complete.

**Key Insight**: During DFS/BFS, when we visit a vertex, we can count all its edges to neighbors. Since we traverse each vertex once, each edge gets counted twice (once from each endpoint). So total edges in component = (sum of degrees of all vertices in component) / 2.

## Optimal Solution

We'll use DFS to find components and count vertices/edges simultaneously.

<div class="code-group">

```python
# Time: O(n + m) where n = vertices, m = edges
# Space: O(n + m) for adjacency list and visited array
class Solution:
    def countCompleteComponents(self, n: int, edges: List[List[int]]) -> int:
        # Step 1: Build adjacency list representation
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)

        # Step 2: Initialize visited array to track explored vertices
        visited = [False] * n

        # Step 3: DFS function that returns (vertex_count, edge_count) for a component
        def dfs(node):
            visited[node] = True
            # Start with 1 vertex (current node) and count its edges
            vertices = 1
            edges = len(adj[node])  # Count edges from this node

            # Explore all neighbors
            for neighbor in adj[node]:
                if not visited[neighbor]:
                    # Recursively get counts from the neighbor's subtree
                    v, e = dfs(neighbor)
                    vertices += v
                    edges += e

            return vertices, edges

        complete_count = 0

        # Step 4: Iterate through all vertices to find all components
        for i in range(n):
            if not visited[i]:
                # Get the size and total edge count for this component
                vertices, total_edges = dfs(i)

                # Important: Each edge was counted twice (from both endpoints)
                # So actual edges in component = total_edges / 2
                actual_edges = total_edges // 2

                # Check if component is complete
                # A complete graph with 'vertices' nodes has vertices*(vertices-1)/2 edges
                if actual_edges == vertices * (vertices - 1) // 2:
                    complete_count += 1

        return complete_count
```

```javascript
// Time: O(n + m) where n = vertices, m = edges
// Space: O(n + m) for adjacency list and visited array
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number}
 */
var countCompleteComponents = function (n, edges) {
  // Step 1: Build adjacency list representation
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // Step 2: Initialize visited array to track explored vertices
  const visited = new Array(n).fill(false);

  // Step 3: DFS function that returns [vertex_count, edge_count] for a component
  const dfs = (node) => {
    visited[node] = true;
    // Start with 1 vertex (current node) and count its edges
    let vertices = 1;
    let edges = adj[node].length; // Count edges from this node

    // Explore all neighbors
    for (const neighbor of adj[node]) {
      if (!visited[neighbor]) {
        // Recursively get counts from the neighbor's subtree
        const [v, e] = dfs(neighbor);
        vertices += v;
        edges += e;
      }
    }

    return [vertices, edges];
  };

  let completeCount = 0;

  // Step 4: Iterate through all vertices to find all components
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      // Get the size and total edge count for this component
      const [vertices, totalEdges] = dfs(i);

      // Important: Each edge was counted twice (from both endpoints)
      // So actual edges in component = totalEdges / 2
      const actualEdges = totalEdges / 2;

      // Check if component is complete
      // A complete graph with 'vertices' nodes has vertices*(vertices-1)/2 edges
      if (actualEdges === (vertices * (vertices - 1)) / 2) {
        completeCount++;
      }
    }
  }

  return completeCount;
};
```

```java
// Time: O(n + m) where n = vertices, m = edges
// Space: O(n + m) for adjacency list and visited array
class Solution {
    public int countCompleteComponents(int n, int[][] edges) {
        // Step 1: Build adjacency list representation
        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            adj[u].add(v);
            adj[v].add(u);
        }

        // Step 2: Initialize visited array to track explored vertices
        boolean[] visited = new boolean[n];

        // Step 3: DFS to find components and count vertices/edges
        int completeCount = 0;
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                // Perform DFS starting from unvisited node i
                int[] counts = dfs(i, adj, visited);
                int vertices = counts[0];
                int totalEdges = counts[1];

                // Each edge counted twice, so divide by 2
                int actualEdges = totalEdges / 2;

                // Check if component is complete
                if (actualEdges == vertices * (vertices - 1) / 2) {
                    completeCount++;
                }
            }
        }

        return completeCount;
    }

    // DFS helper that returns [vertex_count, edge_count] for the component
    private int[] dfs(int node, List<Integer>[] adj, boolean[] visited) {
        visited[node] = true;
        // Start with 1 vertex and count edges from this node
        int vertices = 1;
        int edges = adj[node].size();

        // Explore all neighbors
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                int[] neighborCounts = dfs(neighbor, adj, visited);
                vertices += neighborCounts[0];
                edges += neighborCounts[1];
            }
        }

        return new int[]{vertices, edges};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Building adjacency list: O(m) where m is number of edges
- DFS traversal: Each vertex visited once (O(n)), each edge processed twice (once from each endpoint in adjacency list, O(2m) = O(m))
- Total: O(n + m)

**Space Complexity: O(n + m)**

- Adjacency list storage: O(n + m) (n lists, m total edges across them)
- Visited array: O(n)
- DFS recursion stack: O(n) in worst case (linear chain)

## Common Mistakes

1. **Forgetting to divide edge count by 2**: During DFS, when we sum `adj[node].length` for each vertex, we count each edge twice (once from each endpoint). Candidates often miss this division, leading to incorrect comparisons.

2. **Not handling isolated vertices correctly**: A single vertex with no edges forms a complete component (K₁ graph has 0 edges, and 1×0/2 = 0). Some candidates incorrectly mark these as incomplete.

3. **Using integer division incorrectly**: In languages like Python, `//` is used for integer division. Using `/` would produce a float, which might cause comparison issues. In Java/JavaScript, ensure the division yields an integer for the comparison.

4. **Assuming the graph is connected**: The problem explicitly states there may be multiple components. Failing to iterate through all vertices to find disconnected components is a critical error.

## When You'll See This Pattern

This problem combines two fundamental graph patterns:

1. **Connected Component Identification**: Used in problems like:
   - [Number of Connected Components in an Undirected Graph](/problem/number-of-connected-components-in-an-undirected-graph) (directly related)
   - [Number of Provinces](https://leetcode.com/problems/number-of-provinces/) (same concept with adjacency matrix)
   - [Accounts Merge](https://leetcode.com/problems/accounts-merge/) (components with additional data)

2. **Graph Property Verification**: Checking if a component has a specific property (completeness in this case) appears in:
   - [Is Graph Bipartite?](https://leetcode.com/problems/is-graph-bipartite/) (checking if graph can be 2-colored)
   - [Course Schedule](https://leetcode.com/problems/course-schedule/) (checking for cycles in directed graph)

## Key Takeaways

1. **Component analysis often requires tracking multiple statistics**: When analyzing connected components, you frequently need more than just membership—here we needed both vertex count and edge count.

2. **Edge counting trick**: Remember that summing degrees of vertices counts each edge twice. This is useful in many graph problems where you need to relate vertex degrees to edge counts.

3. **Complete graph formula**: A complete graph with `n` vertices has exactly `n×(n-1)/2` edges. This is a fundamental combinatorial fact worth memorizing.

Related problems: [Number of Connected Components in an Undirected Graph](/problem/number-of-connected-components-in-an-undirected-graph)
