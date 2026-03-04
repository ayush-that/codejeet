---
title: "Breadth-First Search Questions at Yelp: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Yelp — patterns, difficulty breakdown, and study tips."
date: "2031-01-15"
category: "dsa-patterns"
tags: ["yelp", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a core algorithm for navigating graphs and trees level by level. At Yelp, it's a practical tool for modeling real-world networks. Think about finding the shortest path between two businesses, discovering connections within social features, or traversing hierarchical categories. Yelp's platform is built on relationships—between users, reviews, locations, and services—making graph traversal algorithms directly relevant to their engineering problems. Of their 27 tagged coding questions, 3 specifically test BFS. While this may seem like a small fraction, BFS is often a fundamental component in solving more complex graph problems, so mastery is non-negotiable.

## What to Expect — Types of Problems

Yelp's BFS questions typically fall into two categories, both emphasizing practical application.

**Shortest Path in an Unweighted Graph:** This is the most classic use case. You'll often model a scenario as a grid or an adjacency list where each move or edge has equal cost. Example problems include finding the minimum steps for a delivery driver between two points on a map grid or the minimum number of friend connections between two users. The key is recognizing that BFS inherently finds the shortest path when edges are unweighted.

**Level-Order Traversal or Processing:** Here, the goal isn't necessarily a single shortest path, but systematically visiting all nodes in a layered fashion. This is useful for scenarios like broadcasting a message to nearby users in concentric circles or processing batches of data that are one "hop" away. You may need to perform an operation at each level or track the nodes per level.

The problems are designed to test your ability to translate a business context (like "degrees of separation" or "service areas") into a graph model and then apply BFS correctly.

## How to Prepare — Study Tips with One Code Example

Focus on the pattern, not just memorization. The core BFS pattern uses a queue and a visited set.

1.  **Memorize the Skeleton:** Internalize the standard iterative BFS template. You should be able to write it without thinking.
2.  **Model the Graph:** Practice turning problem descriptions into a graph representation. Is it a grid (4-directional or 8-directional moves)? Is it an adjacency list from given edges?
3.  **Track Extra State:** In interviews, you'll almost always need to track more than just the node. This could be the path distance, the path itself, or an associated value. A common technique is to store tuples `(node, distance)` in the queue.

Here is the essential BFS template for finding the shortest path in an unweighted graph, adaptable to most problems:

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(graph, start, target):
    if start == target:
        return 0

    queue = deque([(start, 0)])  # (node, distance)
    visited = set([start])

    while queue:
        node, dist = queue.popleft()

        for neighbor in graph[node]:
            if neighbor == target:
                return dist + 1
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    return -1  # No path found
```

```javascript
function bfsShortestPath(graph, start, target) {
  if (start === target) return 0;

  const queue = [[start, 0]]; // [node, distance]
  const visited = new Set([start]);

  while (queue.length > 0) {
    const [node, dist] = queue.shift(); // Use shift for FIFO

    for (const neighbor of graph[node] || []) {
      if (neighbor === target) return dist + 1;
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  return -1; // No path found
}
```

```java
import java.util.*;

public class BFS {
    public int bfsShortestPath(Map<Integer, List<Integer>> graph, int start, int target) {
        if (start == target) return 0;

        Queue<int[]> queue = new LinkedList<>(); // [node, distance]
        queue.offer(new int[]{start, 0});
        Set<Integer> visited = new HashSet<>();
        visited.add(start);

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int node = current[0];
            int dist = current[1];

            for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                if (neighbor == target) return dist + 1;
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(new int[]{neighbor, dist + 1});
                }
            }
        }
        return -1; // No path found
    }
}
```

</div>

## Recommended Practice Order

Build your skills progressively:

1.  Start with pure BFS on trees (Binary Tree Level Order Traversal).
2.  Move to simple graphs on grids (Number of Islands, Shortest Path in Binary Matrix).
3.  Tackle shortest path problems in explicit adjacency-list graphs.
4.  Finally, practice Yelp's specific tagged problems. This layered approach ensures you understand the algorithm's core before applying it to more complex scenarios.

[Practice Breadth-First Search at Yelp](/company/yelp/breadth-first-search)
