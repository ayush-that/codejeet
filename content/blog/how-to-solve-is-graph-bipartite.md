---
title: "How to Solve Is Graph Bipartite? — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Is Graph Bipartite?. Medium difficulty, 58.9% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2026-11-24"
category: "dsa-patterns"
tags: ["is-graph-bipartite", "depth-first-search", "breadth-first-search", "union-find", "medium"]
---

# How to Solve Is Graph Bipartite?

This problem asks us to determine if an undirected graph is **bipartite** — meaning we can color all nodes with two colors such that no two adjacent nodes share the same color. What makes this problem interesting is that it's not about finding the coloring itself, but determining whether such a coloring exists. The challenge lies in efficiently checking this property for potentially disconnected graphs with cycles.

## Visual Walkthrough

Let's trace through a concrete example: `graph = [[1,3],[0,2],[1,3],[0,2]]`

This represents a graph with 4 nodes (0-3):

- Node 0 connects to 1 and 3
- Node 1 connects to 0 and 2
- Node 2 connects to 1 and 3
- Node 3 connects to 0 and 2

Visually, this is a square: 0-1-2-3-0.

Let's try coloring with two colors (say RED and BLUE):

1. Start at node 0: color it RED
2. Node 0's neighbors (1 and 3): must be BLUE
3. Node 1's other neighbor (2): must be RED (since 1 is BLUE)
4. Node 3's other neighbor (2): must be RED (since 3 is BLUE)
5. Check node 2: it connects to 1 (BLUE) and 3 (BLUE) — but we colored it RED, which is fine since RED ≠ BLUE

The coloring works! This graph is bipartite.

Now consider `graph = [[1,2,3],[0,2],[0,1,3],[0,2]]`:

- Node 0 connects to 1, 2, 3
- Node 1 connects to 0, 2
- Node 2 connects to 0, 1, 3
- Node 3 connects to 0, 2

This is a triangle (0-1-2) with extra connections.

Try coloring:

1. Node 0: RED
2. Node 0's neighbors (1,2,3): BLUE
3. Node 1 connects to 2: both are BLUE — conflict! A triangle requires 3 colors.

This graph is NOT bipartite. The key insight: **a graph is bipartite if and only if it contains no odd-length cycles**.

## Brute Force Approach

A truly brute force approach would try all possible 2-colorings of n nodes, which would be O(2ⁿ) — completely infeasible. A more reasonable but still naive approach might try to color nodes randomly or in some fixed order without proper backtracking.

What a candidate might initially try: simply alternate colors while traversing the graph. But this fails with disconnected components and cycles. For example, if we start coloring from different disconnected components independently, we might assign inconsistent colors to nodes that eventually connect through other paths.

The naive approach's flaw is it doesn't systematically check for conflicts across the entire graph. We need a method that ensures consistency.

## Optimized Approach

The key insight is that we can use **graph traversal (BFS or DFS)** to attempt a 2-coloring while checking for conflicts. Here's the step-by-step reasoning:

1. **Graph Representation**: We're given an adjacency list, which is perfect for traversal.
2. **Color Tracking**: We need an array to track each node's color (or "uncolored" state).
3. **Traversal Strategy**: We must check ALL nodes because the graph might be disconnected. For each uncolored node we find, we start a new BFS/DFS from it.
4. **Coloring Rule**: When we color a node, all its neighbors must get the opposite color. If a neighbor is already colored and matches the current node's color, we've found a conflict.
5. **BFS vs DFS**: Both work equally well. BFS is often more intuitive for this "level-by-level" coloring.

Why this works: If we successfully color the entire graph without conflicts, it's bipartite. If we find any edge connecting two same-colored nodes, the graph contains an odd cycle and isn't bipartite.

## Optimal Solution

Here's the complete solution using BFS:

<div class="code-group">

```python
# Time: O(V + E) where V = n nodes, E = total edges
# Space: O(V) for colors array and queue
class Solution:
    def isBipartite(self, graph: List[List[int]]) -> bool:
        n = len(graph)
        colors = [0] * n  # 0 = uncolored, 1 = color A, -1 = color B

        # We need to check all nodes because graph might be disconnected
        for i in range(n):
            # If node is already colored, skip it
            if colors[i] != 0:
                continue

            # Start BFS from this uncolored node
            queue = deque([i])
            colors[i] = 1  # Color starting node with 1

            while queue:
                node = queue.popleft()

                # Check all neighbors of current node
                for neighbor in graph[node]:
                    # If neighbor is uncolored, color it opposite and add to queue
                    if colors[neighbor] == 0:
                        colors[neighbor] = -colors[node]
                        queue.append(neighbor)
                    # If neighbor has same color as current node, graph is not bipartite
                    elif colors[neighbor] == colors[node]:
                        return False

        # If we colored all nodes without conflicts, graph is bipartite
        return True
```

```javascript
// Time: O(V + E) where V = n nodes, E = total edges
// Space: O(V) for colors array and queue
/**
 * @param {number[][]} graph
 * @return {boolean}
 */
var isBipartite = function (graph) {
  const n = graph.length;
  const colors = new Array(n).fill(0); // 0 = uncolored, 1 = color A, -1 = color B

  // Check all nodes because graph might be disconnected
  for (let i = 0; i < n; i++) {
    // Skip already colored nodes
    if (colors[i] !== 0) continue;

    // Start BFS from this uncolored node
    const queue = [i];
    colors[i] = 1; // Color starting node with 1

    while (queue.length > 0) {
      const node = queue.shift();

      // Check all neighbors
      for (const neighbor of graph[node]) {
        // If neighbor is uncolored, color it opposite and enqueue
        if (colors[neighbor] === 0) {
          colors[neighbor] = -colors[node];
          queue.push(neighbor);
        }
        // If neighbor has same color, graph is not bipartite
        else if (colors[neighbor] === colors[node]) {
          return false;
        }
      }
    }
  }

  // All nodes colored without conflicts
  return true;
};
```

```java
// Time: O(V + E) where V = n nodes, E = total edges
// Space: O(V) for colors array and queue
class Solution {
    public boolean isBipartite(int[][] graph) {
        int n = graph.length;
        int[] colors = new int[n]; // 0 = uncolored, 1 = color A, -1 = color B

        // Check all nodes because graph might be disconnected
        for (int i = 0; i < n; i++) {
            // Skip already colored nodes
            if (colors[i] != 0) continue;

            // Start BFS from this uncolored node
            Queue<Integer> queue = new LinkedList<>();
            queue.offer(i);
            colors[i] = 1; // Color starting node with 1

            while (!queue.isEmpty()) {
                int node = queue.poll();

                // Check all neighbors
                for (int neighbor : graph[node]) {
                    // If neighbor is uncolored, color it opposite and enqueue
                    if (colors[neighbor] == 0) {
                        colors[neighbor] = -colors[node];
                        queue.offer(neighbor);
                    }
                    // If neighbor has same color, graph is not bipartite
                    else if (colors[neighbor] == colors[node]) {
                        return false;
                    }
                }
            }
        }

        // All nodes colored without conflicts
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(V + E)**

- We visit each node once: O(V)
- We traverse each edge once when checking neighbors: O(E)
- Total: O(V + E)

**Space Complexity: O(V)**

- Colors array stores color for each node: O(V)
- BFS queue in worst case stores all nodes: O(V)
- Total: O(V)

Note: E can be up to O(V²) in dense graphs, but O(V + E) is the standard way to express graph algorithm complexity.

## Common Mistakes

1. **Forgetting disconnected graphs**: Only starting BFS/DFS from node 0. If the graph has multiple components, you might miss conflicts in other components. Always iterate through all nodes and start a new traversal for each uncolored node.

2. **Incorrect conflict detection**: Checking `colors[neighbor] != -colors[node]` instead of `colors[neighbor] == colors[node]`. The former would incorrectly flag valid opposite colors as conflicts.

3. **Using wrong data structure for colors**: Using a set or map when a simple array suffices. Since nodes are numbered 0 to n-1, an array provides O(1) access and is more space-efficient.

4. **Not handling self-loops**: While the problem states it's an undirected graph, if a node had a self-loop (connects to itself), the graph couldn't be bipartite. Our solution handles this automatically since a self-loop would be detected as a neighbor with the same color.

## When You'll See This Pattern

The bipartite checking pattern appears in problems involving:

- **Graph coloring with 2 colors**
- **Detecting odd cycles in graphs**
- **Problems that can be modeled as two opposing groups**

Related LeetCode problems:

1. **Possible Bipartition (886)**: Almost identical to this problem but with a different input format (dislikes pairs instead of adjacency list).
2. **Divide Nodes Into the Maximum Number of Groups (2493)**: A harder problem that builds on bipartite checking to find maximum grouping.
3. **Course Schedule (207)**: While this uses topological sort, it shares the graph traversal and cycle detection concepts.

## Key Takeaways

1. **A graph is bipartite if and only if it has no odd-length cycles**. This is the fundamental theorem behind the algorithm.
2. **BFS/DFS with alternating colors** is the standard approach. The algorithm attempts to 2-color the graph and checks for conflicts.
3. **Always handle disconnected components** in graph problems. Iterate through all nodes and start new traversals for unvisited/uncolored nodes.

Remember: The coloring doesn't need to be unique (a bipartite graph can have multiple valid 2-colorings). We just need to determine if at least one exists.

Related problems: [Divide Nodes Into the Maximum Number of Groups](/problem/divide-nodes-into-the-maximum-number-of-groups)
