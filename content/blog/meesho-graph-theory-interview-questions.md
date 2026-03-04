---
title: "Graph Theory Questions at Meesho: What to Expect"
description: "Prepare for Graph Theory interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-12-05"
category: "dsa-patterns"
tags: ["meesho", "graph-theory", "interview prep"]
---

Graph Theory isn't just an academic topic at Meesho—it's a core part of their platform's architecture. As a social commerce company connecting suppliers, resellers, and customers, their systems naturally model networks. Product recommendation engines, mapping social connections between resellers, optimizing delivery routes, and detecting fraudulent user networks all rely on graph algorithms. The four Graph Theory questions in their interview process (out of 44 total) are a direct filter for candidates who can reason about these real-world, interconnected systems.

## What to Expect — Types of Problems

Meesho's graph problems typically focus on applied algorithms over abstract theory. You can expect problems that mirror their business domains.

- **Traversal & Search:** Problems involving BFS or DFS to explore networks, such as finding the shortest path in a delivery network or discovering connected groups of users.
- **Shortest Path:** Variations of Dijkstra's algorithm for weighted graphs, relevant for logistics and cost optimization.
- **Union-Find (Disjoint Set):** Used to efficiently handle dynamic connectivity, like grouping related products or merging user communities.
- **Topological Sorting:** Applicable for resolving dependencies, such as task scheduling in order processing.

The problems are often framed in a business context, but the underlying algorithmic pattern will be familiar.

## How to Prepare — Study Tips with One Code Example

Master the fundamentals before diving into complex variations. Ensure you can implement BFS/DFS from memory and understand their applications (shortest path in unweighted graphs vs. exploration). Practice translating a word problem into a graph representation—identifying what constitutes a node and an edge is the critical first step.

A key pattern to internalize is **Breadth-First Search (BFS) for shortest path in an unweighted graph**. This is a workhorse algorithm for problems like finding the minimum steps between two points in a network.

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(graph, start, target):
    if start == target:
        return 0
    queue = deque([start])
    visited = {start}
    distance = {start: 0}

    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                if neighbor == target:
                    return distance[node] + 1
                visited.add(neighbor)
                distance[neighbor] = distance[node] + 1
                queue.append(neighbor)
    return -1  # No path exists

# Graph as adjacency list: {node: [neighbors]}
graph = {
    0: [1, 2],
    1: [0, 3],
    2: [0, 3],
    3: [1, 2, 4],
    4: [3]
}
print(bfs_shortest_path(graph, 0, 4))  # Output: 3
```

```javascript
function bfsShortestPath(graph, start, target) {
  if (start === target) return 0;
  const queue = [start];
  const visited = new Set([start]);
  const distance = { [start]: 0 };

  while (queue.length > 0) {
    const node = queue.shift();
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        if (neighbor === target) {
          return distance[node] + 1;
        }
        visited.add(neighbor);
        distance[neighbor] = distance[node] + 1;
        queue.push(neighbor);
      }
    }
  }
  return -1; // No path exists
}

// Graph as adjacency list: {node: [neighbors]}
const graph = {
  0: [1, 2],
  1: [0, 3],
  2: [0, 3],
  3: [1, 2, 4],
  4: [3],
};
console.log(bfsShortestPath(graph, 0, 4)); // Output: 3
```

```java
import java.util.*;

public class BFSShortestPath {
    public static int bfsShortestPath(Map<Integer, List<Integer>> graph, int start, int target) {
        if (start == target) return 0;
        Queue<Integer> queue = new LinkedList<>();
        Set<Integer> visited = new HashSet<>();
        Map<Integer, Integer> distance = new HashMap<>();

        queue.offer(start);
        visited.add(start);
        distance.put(start, 0);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            for (int neighbor : graph.get(node)) {
                if (!visited.contains(neighbor)) {
                    if (neighbor == target) {
                        return distance.get(node) + 1;
                    }
                    visited.add(neighbor);
                    distance.put(neighbor, distance.get(node) + 1);
                    queue.offer(neighbor);
                }
            }
        }
        return -1; // No path exists
    }

    public static void main(String[] args) {
        // Graph as adjacency list: {node: [neighbors]}
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.put(0, Arrays.asList(1, 2));
        graph.put(1, Arrays.asList(0, 3));
        graph.put(2, Arrays.asList(0, 3));
        graph.put(3, Arrays.asList(1, 2, 4));
        graph.put(4, Arrays.asList(3));

        System.out.println(bfsShortestPath(graph, 0, 4)); // Output: 3
    }
}
```

</div>

## Recommended Practice Order

Build your competency sequentially. Start with graph representation and master BFS/DFS. Then, practice Union-Find for connectivity problems. Move on to shortest path algorithms (Dijkstra for weighted edges). Finally, study topological sort. For each category, solve 2-3 classic problems (like "Number of Islands" for DFS, "Course Schedule" for topological sort) before attempting Meesho-specific variations. This structured approach ensures you understand the tool, not just a single problem's solution.

[Practice Graph Theory at Meesho](/company/meesho/graph-theory)
