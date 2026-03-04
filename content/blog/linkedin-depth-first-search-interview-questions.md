---
title: "Depth-First Search Questions at LinkedIn: What to Expect"
description: "Prepare for Depth-First Search interview questions at LinkedIn — patterns, difficulty breakdown, and study tips."
date: "2027-10-23"
category: "dsa-patterns"
tags: ["linkedin", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a fundamental algorithm for exploring graphs and trees, making it essential for solving problems involving hierarchical data, connected components, and pathfinding. At LinkedIn, with 27 out of 180 total coding questions tagged with DFS, it's a pattern you cannot afford to overlook. The platform's engineering challenges often involve modeling user networks (social graphs), organizational hierarchies (company structures), or dependency resolutions (skills, endorsements), all of which are naturally traversed using DFS. Mastering it demonstrates your ability to handle recursive exploration and backtracking, a key skill for backend and infrastructure roles.

## What to Expect — Types of Problems

LinkedIn's DFS problems typically fall into three categories. First, **tree and binary tree problems** are common, involving operations like finding paths, calculating sums, or validating properties. Second, **graph traversal and connectivity** questions appear, where you might need to find connected components in a user network or determine if a path exists. Third, **matrix/grid-based DFS** is frequent, used for problems like "number of islands" or searching through a 2D board. Expect variations that combine DFS with other concepts, such as memoization for optimization or using iterative stacks instead of recursion. The problems often test your ability to adapt the core DFS pattern to specific constraints, like avoiding cycles in graphs or handling state during traversal.

## How to Prepare — Study Tips with One Code Example

Start by solidifying the core recursive DFS pattern for both graphs (with cycle prevention) and trees. Practice writing it iteratively using a stack. Focus on identifying when a problem is inherently a traversal task—look for keywords like "find all paths," "traverse," "connected," or "explore." Always clarify input constraints (e.g., graph size) to choose between recursion and iteration. A key pattern is using DFS to explore all possible states, often with backtracking.

Here is a standard recursive DFS template for traversing an undirected graph represented as an adjacency list, which is adaptable to many LinkedIn problems:

<div class="code-group">

```python
def dfs(graph, node, visited):
    if node in visited:
        return
    visited.add(node)
    # Process node here if needed
    for neighbor in graph[node]:
        dfs(graph, neighbor, visited)

# Example usage for counting connected components
def count_components(graph):
    visited = set()
    count = 0
    for node in graph:
        if node not in visited:
            dfs(graph, node, visited)
            count += 1
    return count
```

```javascript
function dfs(graph, node, visited) {
  if (visited.has(node)) return;
  visited.add(node);
  // Process node here if needed
  for (const neighbor of graph[node]) {
    dfs(graph, neighbor, visited);
  }
}

// Example usage for counting connected components
function countComponents(graph) {
  const visited = new Set();
  let count = 0;
  for (const node in graph) {
    if (!visited.has(Number(node))) {
      dfs(graph, Number(node), visited);
      count++;
    }
  }
  return count;
}
```

```java
import java.util.*;

public class DFSExample {
    public static void dfs(Map<Integer, List<Integer>> graph, int node, Set<Integer> visited) {
        if (visited.contains(node)) return;
        visited.add(node);
        // Process node here if needed
        for (int neighbor : graph.get(node)) {
            dfs(graph, neighbor, visited);
        }
    }

    // Example usage for counting connected components
    public static int countComponents(Map<Integer, List<Integer>> graph) {
        Set<Integer> visited = new HashSet<>();
        int count = 0;
        for (int node : graph.keySet()) {
            if (!visited.contains(node)) {
                dfs(graph, node, visited);
                count++;
            }
        }
        return count;
    }
}
```

</div>

## Recommended Practice Order

Build proficiency progressively. Begin with basic tree traversals (pre-order, in-order, post-order). Move to simple graph connectivity problems, like finding connected components. Then tackle matrix DFS (e.g., "number of islands"). Advance to pathfinding problems with backtracking, such as finding all paths in a graph. Finally, practice hybrid problems that combine DFS with other techniques, like DFS with memoization for dynamic programming on trees. Consistently time yourself to simulate interview conditions.

[Practice Depth-First Search at LinkedIn](/company/linkedin/depth-first-search)
