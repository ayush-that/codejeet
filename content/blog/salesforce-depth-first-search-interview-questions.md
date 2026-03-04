---
title: "Depth-First Search Questions at Salesforce: What to Expect"
description: "Prepare for Depth-First Search interview questions at Salesforce — patterns, difficulty breakdown, and study tips."
date: "2027-10-05"
category: "dsa-patterns"
tags: ["salesforce", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a fundamental algorithm for exploring graphs and trees, and its prevalence at Salesforce reflects the company's focus on data structures that model hierarchical relationships. In enterprise software, data is often organized in trees (like org hierarchies, category trees, or nested component structures) or represented as graphs (like networks of users, dependencies between objects, or state machines). DFS provides the intuitive, recursive strategy needed to traverse, search, or process these connected data models efficiently. Mastering it is non-negotiable for tackling a significant portion of their technical interviews.

## What to Expect — Types of Problems

Salesforce's DFS questions typically fall into three categories. First, **tree traversal and manipulation** is the most common. You'll encounter problems involving binary trees, N-ary trees, or directory-like structures where you need to find paths, calculate sums, validate properties, or modify the tree based on certain conditions.

Second, **graph traversal and pathfinding** appears frequently. These problems involve implicit graphs (like grids or matrices) or explicit adjacency lists. Tasks include finding connected components, detecting cycles, checking for valid paths, or performing searches in maze-like scenarios. Given Salesforce's domain, these often relate to navigating relationship networks or dependency graphs.

Third, **backtracking and combinatorial search** is a critical advanced application. DFS is the engine for generating permutations, subsets, or exploring all possible configurations (like placing items or filling slots) under constraints. These problems test your ability to implement clean recursion with precise state management and pruning.

## How to Prepare — Study Tips with Code Example

Internalize the two core implementation patterns: recursive and iterative (using a stack). For trees, recursion is often cleaner. For graphs with cycles, you must track visited nodes. Always clarify the graph's nature (directed/undirected, cyclic/acyclic) first. Practice drawing small examples and walking through the DFS order.

The most essential pattern is the recursive traversal skeleton. Below is a template for a standard DFS on a graph represented as an adjacency list, which you can adapt for most problems.

<div class="code-group">

```python
def dfs_graph(node, graph, visited):
    if node in visited:
        return
    visited.add(node)
    # Process node here if needed (pre-order)
    for neighbor in graph[node]:
        dfs_graph(neighbor, graph, visited)
    # Process node here if needed (post-order)

# Example usage for an undirected graph
graph = {
    0: [1, 2],
    1: [0, 3],
    2: [0],
    3: [1]
}
visited = set()
dfs_graph(0, graph, visited)
```

```javascript
function dfsGraph(node, graph, visited) {
  if (visited.has(node)) return;
  visited.add(node);
  // Process node here if needed (pre-order)
  for (const neighbor of graph[node]) {
    dfsGraph(neighbor, graph, visited);
  }
  // Process node here if needed (post-order)
}

// Example usage for an undirected graph
const graph = {
  0: [1, 2],
  1: [0, 3],
  2: [0],
  3: [1],
};
const visited = new Set();
dfsGraph(0, graph, visited);
```

```java
import java.util.*;

public class DFSExample {
    public static void dfsGraph(int node, Map<Integer, List<Integer>> graph, Set<Integer> visited) {
        if (visited.contains(node)) return;
        visited.add(node);
        // Process node here if needed (pre-order)
        for (int neighbor : graph.get(node)) {
            dfsGraph(neighbor, graph, visited);
        }
        // Process node here if needed (post-order)
    }

    public static void main(String[] args) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.put(0, Arrays.asList(1, 2));
        graph.put(1, Arrays.asList(0, 3));
        graph.put(2, Arrays.asList(0));
        graph.put(3, Arrays.asList(1));

        Set<Integer> visited = new HashSet<>();
        dfsGraph(0, graph, visited);
    }
}
```

</div>

## Recommended Practice Order

Start with basic tree traversals (pre-order, in-order, post-order) and simple path sums. Move to fundamental graph problems like counting connected components or detecting cycles in undirected/directed graphs. Then, tackle grid-based DFS (number of islands, flood fill). Finally, concentrate on backtracking problems (subsets, permutations, word search) which are the most challenging and likely to appear in later interview rounds. For each problem, implement both recursive and iterative solutions when feasible.

[Practice Depth-First Search at Salesforce](/company/salesforce/depth-first-search)
