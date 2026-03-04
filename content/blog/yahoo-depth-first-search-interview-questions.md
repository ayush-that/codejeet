---
title: "Depth-First Search Questions at Yahoo: What to Expect"
description: "Prepare for Depth-First Search interview questions at Yahoo — patterns, difficulty breakdown, and study tips."
date: "2029-02-10"
category: "dsa-patterns"
tags: ["yahoo", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a fundamental algorithm for exploring graphs and trees, and its prevalence at Yahoo signals the company's focus on problems involving hierarchical data, pathfinding, and state-space exploration. With DFS appearing in roughly 11% of their tagged questions, it's a non-negotiable area of study for Yahoo interviews. Success with these questions demonstrates your ability to handle recursion, backtracking, and systematic traversal—skills directly applicable to web crawling, DOM manipulation, dependency resolution, and feature development at scale.

## What to Expect — types of problems

Yahoo's DFS questions typically fall into three categories. First, **tree traversal and manipulation**: calculating paths, sums, or validating properties within binary trees or n-ary structures. Second, **matrix/grid traversal**: problems like "number of islands" or finding paths in a 2D grid, where you must mark visited cells. Third, **backtracking and combinatorial search**: generating permutations, subsets, or solving puzzles where you must explore choices and revert state (e.g., pathfinding with constraints). Expect the problems to be framed in practical contexts, such as parsing directory structures, analyzing user interaction graphs, or optimizing resource allocation.

## How to Prepare — study tips with one code example

Master both recursive and iterative (stack-based) implementations. For trees, understand pre-order, in-order, and post-order traversal. For graphs and grids, internalize the "visited" set pattern to avoid cycles. Always clarify the problem's constraints (e.g., graph size, possibility of cycles) before coding.

A key pattern is the classic DFS skeleton for exploring all connected nodes in an undirected graph from a given starting point. Here is the implementation in three languages:

<div class="code-group">

```python
def dfs_graph(node, graph, visited):
    if node in visited:
        return
    visited.add(node)
    # Process node here if needed (e.g., collect its value)
    for neighbor in graph[node]:
        dfs_graph(neighbor, graph, visited)

# Example usage for adjacency list:
graph = {0: [1, 2], 1: [0, 3], 2: [0], 3: [1]}
visited = set()
dfs_graph(0, graph, visited)
```

```javascript
function dfsGraph(node, graph, visited) {
  if (visited.has(node)) return;
  visited.add(node);
  // Process node here if needed
  for (const neighbor of graph[node]) {
    dfsGraph(neighbor, graph, visited);
  }
}

// Example usage for adjacency list:
const graph = { 0: [1, 2], 1: [0, 3], 2: [0], 3: [1] };
const visited = new Set();
dfsGraph(0, graph, visited);
```

```java
import java.util.*;

public class DFSExample {
    public static void dfsGraph(int node, Map<Integer, List<Integer>> graph, Set<Integer> visited) {
        if (visited.contains(node)) return;
        visited.add(node);
        // Process node here if needed
        for (int neighbor : graph.get(node)) {
            dfsGraph(neighbor, graph, visited);
        }
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

Begin with basic tree traversals to build recursion intuition. Move to standard graph traversal on adjacency lists. Then tackle matrix DFS problems, ensuring you handle four-directional movement and visited marking. Finally, practice backtracking problems, which are often the most challenging. For each problem, implement both recursive and iterative solutions. Time yourself and analyze space complexity. Focus on writing clean, bug-free code on your first attempt, as interviewers will assess your implementation speed and accuracy.

[Practice Depth-First Search at Yahoo](/company/yahoo/depth-first-search)
