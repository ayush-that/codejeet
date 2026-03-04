---
title: "Breadth-First Search Questions at Meta: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Meta — patterns, difficulty breakdown, and study tips."
date: "2027-03-27"
category: "dsa-patterns"
tags: ["meta", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a non-negotiable algorithm for Meta interviews. Meta's engineering work—from social graph traversal and friend recommendations to content delivery network optimization and UI rendering hierarchies—often models problems as graphs or trees where finding the shortest path or exploring layers is critical. With 110 BFS questions in their problem bank (nearly 8% of their total), interviewers frequently use it to assess your ability to recognize graph structures, implement clean iterative solutions, and handle level-order processing. Mastering BFS signals you can think in terms of relationships and distances, a core skill for building scalable systems at Meta's level.

## What to Expect — Types of Problems

Meta's BFS questions typically fall into three categories. You must recognize which one you're facing.

1.  **Shortest Path in Unweighted Graphs:** The most direct application. Given a graph (often represented as an adjacency list or a grid), find the minimum number of steps between two points. This includes problems like finding the shortest transformation sequence or the distance between two nodes in a social network.
2.  **Level-Order Traversal in Trees:** While DFS also traverses trees, BFS is explicitly required for problems that need processing level-by-level. This is common for tasks like printing a tree by level, finding the largest value on each level, or calculating the minimum depth.
3.  **Matrix Traversal (Flood Fill):** Treating a 2D grid as a graph where each cell is a node connected to its four (or eight) neighbors. BFS efficiently expands outward from a starting point to find distance to all cells, count islands, or rot oranges. These problems test your ability to translate grid coordinates into graph nodes and manage visited states.

The key is to identify the underlying graph: Are you moving between words? Traversing a tree? Moving in a grid? The BFS template remains consistent; the art is in setting up the graph model correctly.

## How to Prepare — Study Tips with One Code Example

Your preparation should focus on internalizing the standard BFS template and its variations. Practice until writing the queue initialization, visited set, and layer-by-layer loop is automatic. Then, focus on the problem-specific logic: What represents a node? What defines a valid neighbor? What is your termination condition?

A critical pattern is **BFS for shortest path in an unweighted graph**. Here is the core template applied to a problem like "find the shortest path from node `start` to node `target` in an adjacency list graph."

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(graph, start, target):
    if start == target:
        return 0

    queue = deque([start])
    visited = set([start])
    distance = 0

    while queue:
        # Process all nodes at the current distance level
        for _ in range(len(queue)):
            current_node = queue.popleft()

            # Explore neighbors
            for neighbor in graph[current_node]:
                if neighbor == target:
                    return distance + 1
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        distance += 1
    return -1  # No path exists
```

```javascript
function bfsShortestPath(graph, start, target) {
  if (start === target) return 0;

  const queue = [start];
  const visited = new Set([start]);
  let distance = 0;

  while (queue.length > 0) {
    // Process all nodes at the current distance level
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const currentNode = queue.shift();

      // Explore neighbors
      for (const neighbor of graph[currentNode]) {
        if (neighbor === target) return distance + 1;
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    distance++;
  }
  return -1; // No path exists
}
```

```java
import java.util.*;

public int bfsShortestPath(List<List<Integer>> graph, int start, int target) {
    if (start == target) return 0;

    Queue<Integer> queue = new LinkedList<>();
    Set<Integer> visited = new HashSet<>();
    queue.offer(start);
    visited.add(start);
    int distance = 0;

    while (!queue.isEmpty()) {
        // Process all nodes at the current distance level
        int levelSize = queue.size();
        for (int i = 0; i < levelSize; i++) {
            int currentNode = queue.poll();

            // Explore neighbors
            for (int neighbor : graph.get(currentNode)) {
                if (neighbor == target) return distance + 1;
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }
        distance++;
    }
    return -1; // No path exists
}
```

</div>

Notice the pattern: a queue, a visited set, and a loop that processes one level at a time to track distance. The `for` loop inside the `while` is crucial for problems requiring level-specific answers.

## Recommended Practice Order

Start with fundamentals and build complexity.

1.  **Basic Traversal:** Practice level-order traversal on binary trees and simple adjacency list graphs.
2.  **Matrix BFS:** Solve classic grid problems (Number of Islands, Rotting Oranges, Walls and Gates) to master coordinate mapping and direction arrays.
3.  **Shortest Path Application:** Tackle word ladder problems and explicit shortest path questions. This is where you apply the template above directly.
4.  **BFS with Twists:** Finally, attempt problems that layer BFS with other concepts, like BFS with multiple starting points (multi-source BFS) or BFS that tracks additional state (e.g., breaking down walls).

This progression ensures you solidify the core mechanic before handling the variations Meta uses to increase difficulty.

[Practice Breadth-First Search at Meta](/company/meta/breadth-first-search)
