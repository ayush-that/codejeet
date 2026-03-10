---
title: "How to Solve Evaluate Division — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Evaluate Division. Medium difficulty, 64.0% acceptance rate. Topics: Array, String, Depth-First Search, Breadth-First Search, Union-Find."
date: "2027-01-23"
category: "dsa-patterns"
tags: ["evaluate-division", "array", "string", "depth-first-search", "medium"]
---

# How to Solve Evaluate Division

You're given equations like `a / b = 2.0` and `b / c = 3.0`, and need to answer queries like `a / c = ?`. The challenge is that variables might not be directly connected, requiring you to chain multiple equations together. This is essentially a graph problem where variables are nodes and equations define weighted edges.

## Visual Walkthrough

Let's trace through a concrete example:

**Input:**

- equations = [["a","b"],["b","c"]]
- values = [2.0, 3.0]
- queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]

**Step 1: Build the graph**

- `a / b = 2.0` means `a → b` with weight 2.0, and `b → a` with weight 1/2.0 = 0.5
- `b / c = 3.0` means `b → c` with weight 3.0, and `c → b` with weight 1/3.0 ≈ 0.333

**Step 2: Answer queries**

1. `a / c = ?`: We need to find a path from `a` to `c`. We can go `a → b → c`. Multiply the weights: 2.0 × 3.0 = 6.0
2. `b / a = ?`: Direct edge exists: 0.5
3. `a / e = ?`: `e` doesn't exist in our graph → -1.0
4. `a / a = ?`: Same variable → 1.0
5. `x / x = ?`: `x` doesn't exist → -1.0

**Key insight:** This is a weighted directed graph problem where we need to find paths between nodes and multiply edge weights along the path.

## Brute Force Approach

A naive approach might try to algebraically solve for each query by manipulating equations. For example, you could:

1. Try to find a direct equation connecting the two variables
2. If not found, try to find intermediate variables and chain equations
3. Keep trying different combinations until you find a path

The problem with this approach is it's unstructured and inefficient. You'd need to:

- Store equations in a way that allows quick lookup
- Handle circular dependencies
- Avoid infinite loops when searching for paths
- Efficiently find all possible intermediate variables

Without a proper graph structure, you'd end up with O(n!) complexity in the worst case as you try all permutations of intermediate variables.

## Optimized Approach

The key insight is to model this as a **graph traversal problem**:

1. **Graph Representation**: Each variable is a node. For each equation `a / b = v`:
   - Add edge `a → b` with weight `v`
   - Add edge `b → a` with weight `1/v` (the reciprocal)

2. **Query Processing**: For each query `x / y`:
   - If either variable doesn't exist in the graph → return -1.0
   - If `x == y` → return 1.0
   - Otherwise, perform DFS/BFS from `x` to find `y`, multiplying edge weights along the path

3. **Optimization**: Use memoization or union-find with weights to avoid repeated traversals. The DFS approach is simpler to implement for interviews.

**Why this works**: Division is transitive through multiplication. If `a/b = v1` and `b/c = v2`, then `a/c = v1 × v2`. Our graph captures all known relationships, and traversal finds the chain of multiplications.

## Optimal Solution

Here's the DFS-based solution with detailed comments:

<div class="code-group">

```python
# Time: O((E+Q) * V) where E = equations, Q = queries, V = variables
# Space: O(E + V) for the graph
from collections import defaultdict

def calcEquation(equations, values, queries):
    """
    Main function to evaluate division queries.

    Args:
        equations: List of [numerator, denominator] pairs
        values: List of division results for each equation
        queries: List of queries to evaluate

    Returns:
        List of results for each query
    """
    # Step 1: Build the graph as adjacency list
    # graph[a] = [(b, weight)] where a/b = weight
    graph = defaultdict(list)

    # Build bidirectional edges with weights and reciprocals
    for (num, den), val in zip(equations, values):
        graph[num].append((den, val))      # a -> b with weight val
        graph[den].append((num, 1.0 / val)) # b -> a with weight 1/val

    def dfs(start, end, visited):
        """
        DFS helper to find path from start to end.

        Args:
            start: Starting node
            end: Target node
            visited: Set of visited nodes to avoid cycles

        Returns:
            Product of weights along path, or -1.0 if no path exists
        """
        # Base case: if we reached the end
        if start == end:
            return 1.0

        # Mark current node as visited
        visited.add(start)

        # Explore all neighbors
        for neighbor, weight in graph[start]:
            if neighbor not in visited:
                # Recursively search from neighbor
                result = dfs(neighbor, end, visited)
                if result != -1.0:
                    # Found a path: multiply current edge weight with rest of path
                    return weight * result

        # No path found
        return -1.0

    # Step 2: Process each query
    results = []
    for num, den in queries:
        # Check if both variables exist in the graph
        if num not in graph or den not in graph:
            results.append(-1.0)
        elif num == den:
            # Same variable division is always 1.0
            results.append(1.0)
        else:
            # Perform DFS to find path
            visited = set()
            result = dfs(num, den, visited)
            results.append(result)

    return results
```

```javascript
// Time: O((E+Q) * V) where E = equations, Q = queries, V = variables
// Space: O(E + V) for the graph
function calcEquation(equations, values, queries) {
  // Step 1: Build the graph as adjacency list
  const graph = new Map();

  // Helper to add edge to graph
  function addEdge(start, end, weight) {
    if (!graph.has(start)) {
      graph.set(start, []);
    }
    graph.get(start).push([end, weight]);
  }

  // Build bidirectional edges with weights and reciprocals
  for (let i = 0; i < equations.length; i++) {
    const [num, den] = equations[i];
    const val = values[i];

    addEdge(num, den, val); // a -> b with weight val
    addEdge(den, num, 1.0 / val); // b -> a with weight 1/val
  }

  // DFS helper to find path from start to end
  function dfs(start, end, visited) {
    // Base case: if we reached the end
    if (start === end) {
      return 1.0;
    }

    // Mark current node as visited
    visited.add(start);

    // Get neighbors of current node
    const neighbors = graph.get(start) || [];

    // Explore all neighbors
    for (const [neighbor, weight] of neighbors) {
      if (!visited.has(neighbor)) {
        // Recursively search from neighbor
        const result = dfs(neighbor, end, visited);
        if (result !== -1.0) {
          // Found a path: multiply current edge weight with rest of path
          return weight * result;
        }
      }
    }

    // No path found
    return -1.0;
  }

  // Step 2: Process each query
  const results = [];

  for (const [num, den] of queries) {
    // Check if both variables exist in the graph
    if (!graph.has(num) || !graph.has(den)) {
      results.push(-1.0);
    } else if (num === den) {
      // Same variable division is always 1.0
      results.push(1.0);
    } else {
      // Perform DFS to find path
      const visited = new Set();
      const result = dfs(num, den, visited);
      results.push(result);
    }
  }

  return results;
}
```

```java
// Time: O((E+Q) * V) where E = equations, Q = queries, V = variables
// Space: O(E + V) for the graph
import java.util.*;

class Solution {
    public double[] calcEquation(List<List<String>> equations, double[] values, List<List<String>> queries) {
        // Step 1: Build the graph as adjacency list
        Map<String, List<Pair>> graph = new HashMap<>();

        // Build bidirectional edges with weights and reciprocals
        for (int i = 0; i < equations.size(); i++) {
            String num = equations.get(i).get(0);
            String den = equations.get(i).get(1);
            double val = values[i];

            // Add edge a -> b with weight val
            graph.computeIfAbsent(num, k -> new ArrayList<>()).add(new Pair(den, val));
            // Add edge b -> a with weight 1/val
            graph.computeIfAbsent(den, k -> new ArrayList<>()).add(new Pair(num, 1.0 / val));
        }

        // Step 2: Process each query
        double[] results = new double[queries.size()];

        for (int i = 0; i < queries.size(); i++) {
            String num = queries.get(i).get(0);
            String den = queries.get(i).get(1);

            // Check if both variables exist in the graph
            if (!graph.containsKey(num) || !graph.containsKey(den)) {
                results[i] = -1.0;
            } else if (num.equals(den)) {
                // Same variable division is always 1.0
                results[i] = 1.0;
            } else {
                // Perform DFS to find path
                Set<String> visited = new HashSet<>();
                results[i] = dfs(num, den, graph, visited);
            }
        }

        return results;
    }

    // DFS helper to find path from start to end
    private double dfs(String start, String end, Map<String, List<Pair>> graph, Set<String> visited) {
        // Base case: if we reached the end
        if (start.equals(end)) {
            return 1.0;
        }

        // Mark current node as visited
        visited.add(start);

        // Explore all neighbors
        for (Pair neighbor : graph.get(start)) {
            if (!visited.contains(neighbor.node)) {
                // Recursively search from neighbor
                double result = dfs(neighbor.node, end, graph, visited);
                if (result != -1.0) {
                    // Found a path: multiply current edge weight with rest of path
                    return neighbor.weight * result;
                }
            }
        }

        // No path found
        return -1.0;
    }

    // Helper class to store node-weight pairs
    class Pair {
        String node;
        double weight;

        Pair(String node, double weight) {
            this.node = node;
            this.weight = weight;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Graph construction: O(E) where E is the number of equations
- Query processing: O(Q × V) in worst case, where Q is queries and V is variables
  - Each DFS could traverse all nodes in worst case (linear chain)
  - In practice, with memoization or union-find, this can be optimized to O(Q × α(V)) where α is inverse Ackermann

**Space Complexity:**

- Graph storage: O(E + V) for adjacency list
- DFS recursion stack: O(V) in worst case
- Total: O(E + V)

## Common Mistakes

1. **Forgetting reciprocal edges**: When adding `a/b = v`, you must also add `b/a = 1/v`. Without this, you can only traverse in one direction.

2. **Not handling same-variable queries**: `a/a` should return 1.0, not trigger a DFS. Handle this as a special case.

3. **Missing visited set in DFS**: Without tracking visited nodes, you'll get infinite recursion on cycles (like `a/b = 2` and `b/a = 0.5`).

4. **Incorrect weight multiplication**: Remember that if you're finding `a/c` through path `a→b→c`, you multiply weights: `weight(a→b) × weight(b→c)`. Some candidates mistakenly add or use other operations.

## When You'll See This Pattern

This weighted graph traversal pattern appears in problems where:

1. Relationships are transitive (A relates to B, B relates to C, find A to C)
2. You need to chain operations (multiplication, addition, etc.)
3. Data comes as pairwise relationships

**Related problems:**

1. **Check for Contradictions in Equations (Hard)**: Similar graph structure but need to detect inconsistencies in equations
2. **Maximize Amount After Two Days of Conversions (Medium)**: Currency conversion with multiplication of exchange rates
3. **Network Delay Time (Medium)**: Graph traversal with different aggregation (minimum instead of multiplication)

## Key Takeaways

1. **Think in graphs**: When you see pairwise relationships and need to find connections between elements, consider graph representation. Division equations naturally form a weighted directed graph.

2. **Transitive operations**: If operation ◦ is transitive (a◦b and b◦c implies a◦c), you can chain relationships through intermediate nodes. For division, this chaining is multiplication.

3. **Bidirectional relationships**: Many relationship problems work both ways. Here, knowing `a/b` gives you `b/a` for free via reciprocal.

Related problems: [Check for Contradictions in Equations](/problem/check-for-contradictions-in-equations), [Maximize Amount After Two Days of Conversions](/problem/maximize-amount-after-two-days-of-conversions)
