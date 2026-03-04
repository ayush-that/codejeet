---
title: "Depth-First Search Questions at SAP: What to Expect"
description: "Prepare for Depth-First Search interview questions at SAP — patterns, difficulty breakdown, and study tips."
date: "2029-11-13"
category: "dsa-patterns"
tags: ["sap", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a fundamental algorithm for traversing trees and graphs, making it essential for solving problems involving hierarchical data, connected components, and pathfinding. At SAP, a company built on managing complex enterprise data structures—from organizational hierarchies to network dependencies in supply chains—proficiency in DFS is not just an academic exercise. It's a practical skill for modeling real-world systems. With DFS appearing in roughly 9% of their technical question pool (4 out of 45 questions), demonstrating a strong grasp of both recursive and iterative implementations is a direct way to show you can think through these data relationships systematically.

## What to Expect — Types of Problems

SAP's DFS questions typically focus on applying the pattern to common data structures rather than obscure algorithmic twists. You can expect problems in these categories:

- **Tree Traversal & Modification:** Calculating sums, finding paths, or mirroring structures within binary trees or N-ary trees. These test your understanding of pre-order, in-order, and post-order DFS.
- **Graph Connectivity:** Problems involving finding connected components in an undirected graph or checking if a path exists between nodes, which are core to network analysis.
- **Grid-Based Search:** Classic "island" problems where you must traverse a 2D grid to count or modify connected cells, simulating region analysis in data.
- **Pathfinding with Constraints:** Finding any valid path or all paths between points, often with simple conditions like avoiding certain nodes. This assesses your ability to manage state and backtrack correctly.

The complexity usually lies in the problem's logic, not the DFS implementation itself. You need to cleanly integrate your search with the specific rules of the task.

## How to Prepare — Study Tips with One Code Example

Master the standard template for DFS on a graph represented as an adjacency list. Practice writing it recursively and iteratively (using a stack) until it's automatic. Your focus should then shift to problem-specific logic: what to do when you first visit a node (`pre-order`), when you explore neighbors, and when you backtrack (`post-order`). Always clarify if the graph is directed/undirected and if cycles are possible—this determines if you need a `visited` set.

A key pattern is using DFS to find a **target node in a graph and return the path to it**. This combines traversal, state tracking, and backtracking.

<div class="code-group">

```python
def dfs_find_path(graph, start, target, visited=None, path=None):
    if visited is None:
        visited = set()
    if path is None:
        path = []
    visited.add(start)
    path.append(start)

    if start == target:
        return path.copy()  # Return a copy of the current path

    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            result_path = dfs_find_path(graph, neighbor, target, visited, path)
            if result_path:  # If a path was found downstream
                return result_path

    # Backtrack: no path found from this branch
    path.pop()
    return None

# Example usage
graph = {'A': ['B', 'C'], 'B': ['D'], 'C': [], 'D': []}
print(dfs_find_path(graph, 'A', 'D'))  # Output: ['A', 'B', 'D']
```

```javascript
function dfsFindPath(graph, start, target) {
  const visited = new Set();
  const path = [];

  function dfs(node) {
    visited.add(node);
    path.push(node);

    if (node === target) {
      return path.slice(); // Return a copy of the path
    }

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        const resultPath = dfs(neighbor);
        if (resultPath) {
          return resultPath;
        }
      }
    }

    // Backtrack
    path.pop();
    return null;
  }

  return dfs(start);
}

// Example usage
const graph = { A: ["B", "C"], B: ["D"], C: [], D: [] };
console.log(dfsFindPath(graph, "A", "D")); // Output: ['A', 'B', 'D']
```

```java
import java.util.*;

public class DFSFindPath {
    public static List<String> dfsFindPath(Map<String, List<String>> graph, String start, String target) {
        Set<String> visited = new HashSet<>();
        List<String> path = new ArrayList<>();
        return dfs(graph, start, target, visited, path);
    }

    private static List<String> dfs(Map<String, List<String>> graph, String node, String target,
                                    Set<String> visited, List<String> path) {
        visited.add(node);
        path.add(node);

        if (node.equals(target)) {
            return new ArrayList<>(path); // Return a copy
        }

        for (String neighbor : graph.getOrDefault(node, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                List<String> resultPath = dfs(graph, neighbor, target, visited, path);
                if (resultPath != null) {
                    return resultPath;
                }
            }
        }

        // Backtrack
        path.remove(path.size() - 1);
        return null;
    }

    // Example usage
    public static void main(String[] args) {
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", Arrays.asList("B", "C"));
        graph.put("B", Arrays.asList("D"));
        graph.put("C", new ArrayList<>());
        graph.put("D", new ArrayList<>());
        System.out.println(dfsFindPath(graph, "A", "D")); // Output: [A, B, D]
    }
}
```

</div>

## Recommended Practice Order

Build competency in this sequence: 1) DFS on binary trees (in-order, pre-order, post-order), 2) DFS on N-ary trees or simple directed acyclic graphs, 3) DFS on graphs with cycles (requiring a `visited` set), 4) Grid-based DFS problems, and finally 5) problems that require tracking path state or modifying the graph during traversal. For each type, solve at least two problems to internalize the pattern variations.

[Practice Depth-First Search at SAP](/company/sap/depth-first-search)
