---
title: "How to Solve Count Unreachable Pairs of Nodes in an Undirected Graph — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Unreachable Pairs of Nodes in an Undirected Graph. Medium difficulty, 49.8% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2027-02-25"
category: "dsa-patterns"
tags:
  [
    "count-unreachable-pairs-of-nodes-in-an-undirected-graph",
    "depth-first-search",
    "breadth-first-search",
    "union-find",
    "medium",
  ]
---

# How to Solve Count Unreachable Pairs of Nodes in an Undirected Graph

You're given an undirected graph with `n` nodes and some edges connecting them. Your task is to count how many pairs of nodes cannot reach each other through any path in the graph. This problem is interesting because it combines graph connectivity with combinatorial counting—you need to find disconnected components first, then calculate how many pairs of nodes come from different components.

## Visual Walkthrough

Let's walk through a concrete example: `n = 7` and `edges = [[0,1],[1,2],[3,4],[5,6]]`

We have 7 nodes (0-6) with edges forming three connected components:

- Component A: nodes {0, 1, 2} (size = 3)
- Component B: nodes {3, 4} (size = 2)
- Component C: nodes {5, 6} (size = 2)

Now, which pairs of nodes are unreachable from each other? Any pair where the nodes are in different components. Let's count systematically:

For component A (size 3):

- Pairs with component B: 3 × 2 = 6 pairs
- Pairs with component C: 3 × 2 = 6 pairs

For component B (size 2):

- Already counted pairs with A
- Pairs with component C: 2 × 2 = 4 pairs

Total unreachable pairs: 6 + 6 + 4 = 16

Notice we didn't count pairs within the same component (like 0-1 or 3-4) because those nodes ARE reachable from each other. The key insight: **unreachable pairs = all possible pairs minus reachable pairs**, or more efficiently, **sum of (component_size × remaining_nodes)** as we process each component.

## Brute Force Approach

A naive approach would be to check every possible pair of nodes (i, j) where i < j, and for each pair, perform a BFS/DFS to see if they're connected. If they're not connected, increment our count.

Why this fails:

- There are n×(n-1)/2 possible pairs (O(n²) pairs)
- Each BFS/DFS takes O(n + e) time in worst case
- Total complexity: O(n² × (n + e)) which is far too slow for n up to 10⁵

Even if we precompute connectivity with multiple BFS/DFS runs, the O(n²) pair checking is still prohibitive. We need a smarter way to count without explicitly checking every pair.

## Optimized Approach

The optimal solution has two clear steps:

1. **Find all connected components and their sizes** using either DFS/BFS or Union-Find
2. **Count unreachable pairs mathematically** using component sizes

For step 1: We can use DFS/BFS to traverse the graph, marking visited nodes and counting how many nodes are in each component. Alternatively, Union-Find (Disjoint Set Union) can efficiently merge connected nodes and track component sizes.

For step 2: Once we have component sizes [s₁, s₂, s₃, ...], the number of unreachable pairs is:

- As we process each component, multiply its size by the number of nodes not yet processed
- Or equivalently: sum of (sᵢ × sⱼ) for all i < j

The mathematical reasoning: Each node in component A can't reach any node in components B, C, etc. So for component of size s, it contributes s × (total_nodes - processed_nodes) unreachable pairs.

## Optimal Solution

Here's the complete solution using DFS to find components, then mathematical counting:

<div class="code-group">

```python
# Time: O(n + e) where n = nodes, e = edges
# Space: O(n + e) for adjacency list and visited array
class Solution:
    def countPairs(self, n: int, edges: List[List[int]]) -> int:
        # Step 1: Build adjacency list for the graph
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)  # Undirected graph needs both directions

        visited = [False] * n  # Track visited nodes
        total_pairs = 0

        # Step 2: DFS function to find component size
        def dfs(node):
            stack = [node]
            visited[node] = True
            count = 1  # Count this node

            while stack:
                current = stack.pop()
                # Visit all unvisited neighbors
                for neighbor in graph[current]:
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        stack.append(neighbor)
                        count += 1
            return count

        # Step 3: Find all components and count pairs
        remaining_nodes = n  # Track how many nodes haven't been processed

        for node in range(n):
            if not visited[node]:
                # Found a new component
                component_size = dfs(node)

                # This component's nodes can't reach any node outside it
                # Multiply component size by all nodes not in this component
                total_pairs += component_size * (remaining_nodes - component_size)

                # Update remaining nodes (those not yet processed in future components)
                remaining_nodes -= component_size

        return total_pairs
```

```javascript
// Time: O(n + e) where n = nodes, e = edges
// Space: O(n + e) for adjacency list and visited array
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number}
 */
var countPairs = function (n, edges) {
  // Step 1: Build adjacency list for the graph
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u); // Undirected graph needs both directions
  }

  const visited = Array(n).fill(false); // Track visited nodes
  let totalPairs = 0;
  let remainingNodes = n; // Track how many nodes haven't been processed

  // Step 2: DFS function to find component size
  const dfs = (startNode) => {
    const stack = [startNode];
    visited[startNode] = true;
    let count = 1; // Count this node

    while (stack.length > 0) {
      const current = stack.pop();
      // Visit all unvisited neighbors
      for (const neighbor of graph[current]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          stack.push(neighbor);
          count++;
        }
      }
    }
    return count;
  };

  // Step 3: Find all components and count pairs
  for (let node = 0; node < n; node++) {
    if (!visited[node]) {
      // Found a new component
      const componentSize = dfs(node);

      // This component's nodes can't reach any node outside it
      // Multiply component size by all nodes not in this component
      totalPairs += componentSize * (remainingNodes - componentSize);

      // Update remaining nodes (those not yet processed in future components)
      remainingNodes -= componentSize;
    }
  }

  return totalPairs;
};
```

```java
// Time: O(n + e) where n = nodes, e = edges
// Space: O(n + e) for adjacency list and visited array
class Solution {
    public long countPairs(int n, int[][] edges) {
        // Step 1: Build adjacency list for the graph
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);  // Undirected graph needs both directions
        }

        boolean[] visited = new boolean[n];  // Track visited nodes
        long totalPairs = 0;
        int remainingNodes = n;  // Track how many nodes haven't been processed

        // Step 2: DFS function to find component size
        for (int node = 0; node < n; node++) {
            if (!visited[node]) {
                // Found a new component
                int componentSize = dfs(node, graph, visited);

                // This component's nodes can't reach any node outside it
                // Multiply component size by all nodes not in this component
                totalPairs += (long) componentSize * (remainingNodes - componentSize);

                // Update remaining nodes (those not yet processed in future components)
                remainingNodes -= componentSize;
            }
        }

        return totalPairs;
    }

    private int dfs(int startNode, List<Integer>[] graph, boolean[] visited) {
        Stack<Integer> stack = new Stack<>();
        stack.push(startNode);
        visited[startNode] = true;
        int count = 1;  // Count this node

        while (!stack.isEmpty()) {
            int current = stack.pop();
            // Visit all unvisited neighbors
            for (int neighbor : graph[current]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    stack.push(neighbor);
                    count++;
                }
            }
        }
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + e)**

- Building adjacency list: O(e) where e = number of edges
- DFS/BFS traversal: Each node and edge visited once, O(n + e)
- Pair counting: O(n) for processing components
- Total: O(n + e) linear in the size of the graph

**Space Complexity: O(n + e)**

- Adjacency list: O(n + e) to store graph
- Visited array: O(n)
- DFS stack: O(n) in worst case (linear chain)
- Total: O(n + e)

## Common Mistakes

1. **Forgetting the graph is undirected**: When building adjacency lists, you must add edges in both directions. Missing this creates one-way connections that break connectivity.

2. **Integer overflow with large n**: When n = 10⁵, n×(n-1)/2 ≈ 5×10⁹ which exceeds 32-bit integer range. Use 64-bit integers (long in Java/C++, long long in C, BigInt in JavaScript for very large results).

3. **Double counting pairs**: When using the formula sum(sᵢ × sⱼ), ensure i < j to avoid counting (A,B) and (B,A) as separate pairs. The solution above avoids this by subtracting processed nodes.

4. **Not handling disconnected nodes**: A node with no edges forms its own component of size 1. Make sure your DFS/BFS handles starting from isolated nodes correctly.

## When You'll See This Pattern

This problem combines two fundamental patterns:

1. **Connected Components**: Finding groups of connected nodes using DFS/BFS/Union-Find
   - Related: [Number of Islands](https://leetcode.com/problems/number-of-islands/) (Medium) - Find connected land cells
   - Related: [Number of Connected Components in Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) (Medium) - Count components directly

2. **Combinatorial Counting on Components**: Once you have component sizes, perform mathematical calculations
   - Related: [Number of Good Pairs](https://leetcode.com/problems/number-of-good-pairs/) (Easy) - Count pairs with same value
   - Related: [Count Nice Pairs in an Array](https://leetcode.com/problems/count-nice-pairs-in-an-array/) (Medium) - More advanced pair counting

## Key Takeaways

1. **Convert pair checking to component analysis**: Instead of checking O(n²) pairs directly, find components first (O(n + e)), then use mathematics (O(n)).

2. **Remaining nodes trick**: When counting cross-component pairs, track "remaining nodes not yet processed" to avoid double counting and simplify the calculation.

3. **Graph representation matters**: For sparse graphs (e << n²), adjacency lists are more efficient than adjacency matrices. Most LeetCode graph problems assume sparse graphs.

Related problems: [Number of Islands](/problem/number-of-islands)
