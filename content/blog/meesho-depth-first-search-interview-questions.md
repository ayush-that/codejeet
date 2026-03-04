---
title: "Depth-First Search Questions at Meesho: What to Expect"
description: "Prepare for Depth-First Search interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-12-03"
category: "dsa-patterns"
tags: ["meesho", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a fundamental algorithm for exploring graphs and trees, making it essential for solving problems related to hierarchical data, paths, and connected components. At Meesho, a social commerce platform, these concepts translate directly to real-world systems. The platform's architecture likely involves user networks, product category trees, recommendation graphs, and inventory management systems—all areas where DFS is a practical tool for traversal and search. With 4 out of their 44 total coding questions focused on DFS, Meesho clearly values candidates who can efficiently navigate and reason about connected data structures. Mastering DFS demonstrates your ability to handle recursive exploration, backtracking, and state management, which are critical for building scalable features like fraud detection in transaction networks or navigating supplier-product hierarchies.

## What to Expect — Types of Problems

Meesho's DFS questions typically fall into two categories. First, **tree-based problems** are common, given the platform's use of product categories and organizational hierarchies. You might encounter tasks like finding the depth of a category tree, calculating paths for recommendation flows, or validating hierarchical rules. Second, **graph traversal and pathfinding** problems appear, often related to user networks or dependency resolution. Examples include checking connectivity between users in a social graph, finding cycles in order dependencies, or identifying connected components in a supplier network. The problems usually require modifying standard DFS to track additional state, such as path sums, visited nodes with conditions, or specific node properties. Expect to implement both recursive and iterative solutions, with an emphasis on clean, bug-free code under time constraints.

## How to Prepare — Study Tips with One Code Example

Focus on understanding the core DFS pattern and its variations. Start by memorizing the recursive template for graphs (with a visited set to avoid cycles) and trees (without a visited set, since trees are acyclic). Practice converting recursive DFS to an iterative version using a stack, as this can be useful for avoiding recursion depth limits or for specific traversal orders. Always analyze time and space complexity—typically O(V + E) for graphs and O(N) for trees. Work on problems that require backtracking, like pathfinding, where you modify state before recursion and revert it afterward.

A key pattern is using DFS to find if a path exists between two nodes in a graph, which is common in network analysis. Here’s how to implement it:

<div class="code-group">

```python
def has_path_dfs(graph, start, end, visited=None):
    if visited is None:
        visited = set()
    if start == end:
        return True
    visited.add(start)
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            if has_path_dfs(graph, neighbor, end, visited):
                return True
    return False
```

```javascript
function hasPathDFS(graph, start, end, visited = new Set()) {
  if (start === end) return true;
  visited.add(start);
  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      if (hasPathDFS(graph, neighbor, end, visited)) {
        return true;
      }
    }
  }
  return false;
}
```

```java
import java.util.*;

public class DFSExample {
    public static boolean hasPathDFS(Map<Integer, List<Integer>> graph, int start, int end, Set<Integer> visited) {
        if (start == end) return true;
        visited.add(start);
        for (int neighbor : graph.getOrDefault(start, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                if (hasPathDFS(graph, neighbor, end, visited)) {
                    return true;
                }
            }
        }
        return false;
    }
}
```

</div>

## Recommended Practice Order

Build your skills progressively. Begin with basic tree traversals (pre-order, in-order, post-order) and simple graph connectivity problems. Move to path-based problems, like finding all root-to-leaf paths or checking for path sums. Then tackle more complex scenarios involving cycles, backtracking (e.g., permutation generation), or multi-state visits (like detecting bipartite graphs). Finally, practice Meesho-specific problems by reviewing common DFS questions from e-commerce or social network domains. Use platforms like CodeJeet to filter problems by company and topic. Time yourself to simulate interview conditions, and always verbalize your thought process as you code.

[Practice Depth-First Search at Meesho](/company/meesho/depth-first-search)
