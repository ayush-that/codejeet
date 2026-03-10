---
title: "How to Solve Unit Conversion I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Unit Conversion I. Medium difficulty, 54.3% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory."
date: "2029-11-22"
category: "dsa-patterns"
tags: ["unit-conversion-i", "depth-first-search", "breadth-first-search", "graph-theory", "medium"]
---

# How to Solve Unit Conversion I

You're given a set of unit conversion relationships and need to convert between any two units. The tricky part is that conversions might be indirect—you might need to chain multiple conversions together, and the relationships form a tree structure rather than a complete conversion matrix.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have 4 units (0, 1, 2, 3) with these conversions:

- `[0, 1, 2.0]` → 1 unit of type 0 = 2.0 units of type 1
- `[1, 2, 3.0]` → 1 unit of type 1 = 3.0 units of type 2
- `[2, 3, 4.0]` → 1 unit of type 2 = 4.0 units of type 3

We want to convert from unit 0 to unit 3. We can't do this directly, but we can chain the conversions:

1. Start with 1 unit of type 0
2. Convert to type 1: 1 × 2.0 = 2.0 units of type 1
3. Convert to type 2: 2.0 × 3.0 = 6.0 units of type 2
4. Convert to type 3: 6.0 × 4.0 = 24.0 units of type 3

So the conversion factor from unit 0 to unit 3 is 24.0. Notice that we multiply all the conversion factors along the path: 2.0 × 3.0 × 4.0 = 24.0.

The key insight: the conversions form a tree where each node has exactly one parent (except the root). This means there's exactly one path between any two units, and we can find it by traversing up the tree.

## Brute Force Approach

A naive approach might try to build all possible conversion pairs by exploring every possible path. For each query, we could:

1. Start from the source unit
2. Try all possible conversions from that unit
3. Recursively explore until we reach the target unit
4. Multiply all conversion factors along the path

However, this approach has several problems:

- The conversions form a tree, not a general graph, so we don't need to explore all paths
- Without proper memoization, we might re-explore the same paths repeatedly
- We need to handle both forward and backward conversions (converting from A to B vs B to A)

The brute force would be O(n²) in the worst case if we treat it as a general graph search problem, but we can do much better by recognizing the tree structure.

## Optimized Approach

The key insight is that the `n-1` conversions between `n` units form a tree. In a tree with `n` nodes:

- There are exactly `n-1` edges (conversions)
- There's exactly one path between any two nodes
- The tree is rooted (we can pick any node as root)

Our approach:

1. **Build adjacency list**: Create a graph where each unit points to its neighbors with conversion factors
2. **DFS/BFS traversal**: Starting from the source unit, traverse until we find the target unit
3. **Accumulate conversion factor**: Multiply factors as we traverse edges
4. **Handle direction**: If we traverse an edge backward, we need to use the reciprocal (1/factor)

Why this works efficiently:

- Tree structure guarantees O(n) time for each query (worst-case path length is n-1)
- We only explore the path between source and target, not the entire tree
- The adjacency list gives us O(1) access to neighbors

## Optimal Solution

We'll use DFS to find the path from source to target. Since it's a tree, we don't need visited tracking beyond the parent to avoid going back.

<div class="code-group">

```python
# Time: O(n) per query, O(n) total for building graph
# Space: O(n) for adjacency list
from typing import List

def unitConversion(n: int, conversions: List[List[int]], sourceUnit: int, targetUnit: int) -> float:
    # Step 1: Build adjacency list representation of the tree
    # graph[u] will store list of (neighbor, conversion_factor_from_u_to_neighbor)
    graph = [[] for _ in range(n)]

    for source, target, factor in conversions:
        # Add forward edge: source -> target with factor
        graph[source].append((target, factor))
        # Add backward edge: target -> source with 1/factor
        graph[target].append((source, 1.0 / factor))

    # Step 2: DFS to find conversion factor from source to target
    # visited array prevents cycles (though tree has no cycles, we need it for DFS)
    visited = [False] * n

    def dfs(current: int, current_factor: float) -> float:
        """DFS to find target unit and accumulate conversion factor."""
        # If we found the target unit, return the accumulated conversion factor
        if current == targetUnit:
            return current_factor

        visited[current] = True

        # Explore all neighbors
        for neighbor, factor in graph[current]:
            if not visited[neighbor]:
                # Multiply current factor by edge factor to get new factor
                result = dfs(neighbor, current_factor * factor)
                # If result is not -1, we found the target in this path
                if result != -1.0:
                    return result

        # Target not found in this branch
        return -1.0

    # Start DFS from source unit with factor 1.0 (1 unit of source = 1 unit of source)
    return dfs(sourceUnit, 1.0)
```

```javascript
// Time: O(n) per query, O(n) total for building graph
// Space: O(n) for adjacency list
function unitConversion(n, conversions, sourceUnit, targetUnit) {
  // Step 1: Build adjacency list representation of the tree
  // graph[u] will store array of [neighbor, conversion_factor_from_u_to_neighbor]
  const graph = Array.from({ length: n }, () => []);

  for (const [source, target, factor] of conversions) {
    // Add forward edge: source -> target with factor
    graph[source].push([target, factor]);
    // Add backward edge: target -> source with 1/factor
    graph[target].push([source, 1.0 / factor]);
  }

  // Step 2: DFS to find conversion factor from source to target
  // visited array prevents cycles (though tree has no cycles, we need it for DFS)
  const visited = new Array(n).fill(false);

  function dfs(current, currentFactor) {
    // If we found the target unit, return the accumulated conversion factor
    if (current === targetUnit) {
      return currentFactor;
    }

    visited[current] = true;

    // Explore all neighbors
    for (const [neighbor, factor] of graph[current]) {
      if (!visited[neighbor]) {
        // Multiply current factor by edge factor to get new factor
        const result = dfs(neighbor, currentFactor * factor);
        // If result is not -1, we found the target in this path
        if (result !== -1) {
          return result;
        }
      }
    }

    // Target not found in this branch
    return -1;
  }

  // Start DFS from source unit with factor 1.0 (1 unit of source = 1 unit of source)
  return dfs(sourceUnit, 1.0);
}
```

```java
// Time: O(n) per query, O(n) total for building graph
// Space: O(n) for adjacency list
import java.util.*;

public class Solution {
    public double unitConversion(int n, int[][] conversions, int sourceUnit, int targetUnit) {
        // Step 1: Build adjacency list representation of the tree
        // graph[u] will store list of {neighbor, conversion_factor_from_u_to_neighbor}
        List<List<double[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }

        for (int[] conversion : conversions) {
            int source = conversion[0];
            int target = conversion[1];
            double factor = conversion[2];

            // Add forward edge: source -> target with factor
            graph.get(source).add(new double[]{target, factor});
            // Add backward edge: target -> source with 1/factor
            graph.get(target).add(new double[]{source, 1.0 / factor});
        }

        // Step 2: DFS to find conversion factor from source to target
        // visited array prevents cycles (though tree has no cycles, we need it for DFS)
        boolean[] visited = new boolean[n];

        return dfs(sourceUnit, 1.0, targetUnit, graph, visited);
    }

    private double dfs(int current, double currentFactor, int targetUnit,
                      List<List<double[]>> graph, boolean[] visited) {
        // If we found the target unit, return the accumulated conversion factor
        if (current == targetUnit) {
            return currentFactor;
        }

        visited[current] = true;

        // Explore all neighbors
        for (double[] edge : graph.get(current)) {
            int neighbor = (int) edge[0];
            double factor = edge[1];

            if (!visited[neighbor]) {
                // Multiply current factor by edge factor to get new factor
                double result = dfs(neighbor, currentFactor * factor, targetUnit, graph, visited);
                // If result is not -1, we found the target in this path
                if (result != -1.0) {
                    return result;
                }
            }
        }

        // Target not found in this branch
        return -1.0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) per query

- Building the adjacency list takes O(n) time (processing n-1 edges)
- DFS traversal in the worst case visits all n nodes if the path goes through the entire tree
- Each node is visited at most once due to the visited array

**Space Complexity:** O(n)

- Adjacency list stores 2×(n-1) edges (forward and backward) = O(n)
- Visited array uses O(n) space
- Recursion stack in worst case could be O(n) if the tree is a linked list

## Common Mistakes

1. **Forgetting reciprocal factors**: When adding backward edges to the adjacency list, candidates often forget to use 1/factor instead of the original factor. Remember: if A = k×B, then B = (1/k)×A.

2. **Not handling visited nodes**: Even though it's a tree, we need visited tracking in DFS to avoid infinite recursion when going back to the parent. Without it, we'll get stack overflow.

3. **Assuming conversions are complete**: The problem states there are n-1 conversions for n units, forming a tree. Some candidates try to handle missing conversions or cycles, which aren't present in this problem.

4. **Using integer division for reciprocal**: In languages like Python 2 or Java with integer division, 1/factor where factor is an integer gives 0. Always use floating-point division (1.0/factor).

## When You'll See This Pattern

This tree traversal pattern appears in many graph problems:

1. **Binary Tree Problems** (LeetCode 236, 112, 113): Finding paths, ancestors, or accumulating values along paths in trees.

2. **Graph Connectivity** (LeetCode 323, 547): Determining if nodes are connected and finding paths between them.

3. **Conversion/Exchange Rate Problems**: Similar problems where you need to convert between currencies or units through intermediate steps.

The core technique is building an adjacency list and using DFS/BFS to find paths and accumulate values along edges.

## Key Takeaways

1. **Tree structure simplifies pathfinding**: When you have n-1 edges for n nodes, you're working with a tree. This means exactly one path exists between any two nodes, making DFS/BFS straightforward.

2. **Bidirectional edges need reciprocal factors**: In conversion problems, if A = k×B, remember that B = (1/k)×A. Always add both directions to your adjacency list.

3. **DFS with early return is efficient for tree pathfinding**: Once you find the target, you can return immediately without exploring the rest of the tree.

[Practice this problem on CodeJeet](/problem/unit-conversion-i)
