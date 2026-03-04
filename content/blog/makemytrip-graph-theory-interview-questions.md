---
title: "Graph Theory Questions at MakeMyTrip: What to Expect"
description: "Prepare for Graph Theory interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-25"
category: "dsa-patterns"
tags: ["makemytrip", "graph-theory", "interview prep"]
---

Graph Theory is a practical necessity at MakeMyTrip, not just an academic exercise. Their platform models a massive network: cities as nodes, flights and routes as edges, hotel bookings as connections between locations and dates, and package deals as complex dependency graphs. Efficiently finding the cheapest flight path, optimizing multi-city itineraries, or managing real-time seat inventory are all graph problems at their core. With 3 out of 24 questions dedicated to this topic, MakeMyTrip directly tests your ability to design systems that scale with their core business logic.

## What to Expect — Types of Problems

The Graph Theory questions at MakeMyTrip typically focus on applied algorithms over abstract theory. Expect problems that mirror real-world travel logistics.

1.  **Shortest Path & Connectivity:** This is the most common category. You might be asked to find the cheapest route with certain constraints (like a maximum number of stops), check if all destinations are connected, or find critical connection points. Think Dijkstra's algorithm and its variations.
2.  **Traversal & Search:** Problems may involve exploring all possible flight combinations from a source, finding if a sequence of bookings is valid (a path exists), or performing operations on a grid representing a map. Depth-First Search (DFS) and Breadth-First Search (BFS) are fundamental here.
3.  **Graph Modeling:** The challenge sometimes lies in correctly constructing the graph from the problem statement. For example, you might need to model multi-layered graphs where different node types represent airports, hotels, and dates.

You will not encounter highly complex algorithms like min-cut or advanced dynamic programming on graphs. The focus is on robust implementation of standard algorithms to solve a clearly defined business scenario.

## How to Prepare — Study Tips with One Code Example

Master the fundamentals. Ensure you can implement BFS, DFS, and Dijkstra's algorithm from memory. Practice on matrix grids (common for map-like problems) and adjacency lists. The key is to quickly recognize the underlying graph pattern in a wordy travel scenario.

A critical pattern is using BFS to find the shortest path in an unweighted graph or a grid. This is often the optimal solution for problems involving "minimum number of flights" or "minimum steps."

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(adj_list, start, end):
    if start == end:
        return 0
    queue = deque([start])
    visited = {start: 0}  # Store node and its distance

    while queue:
        node = queue.popleft()
        for neighbor in adj_list[node]:
            if neighbor not in visited:
                visited[neighbor] = visited[node] + 1
                if neighbor == end:
                    return visited[neighbor]
                queue.append(neighbor)
    return -1  # No path found
```

```javascript
function bfsShortestPath(adjList, start, end) {
  if (start === end) return 0;
  const queue = [start];
  const visited = new Map();
  visited.set(start, 0);

  while (queue.length > 0) {
    const node = queue.shift();
    const distance = visited.get(node);

    for (const neighbor of adjList[node]) {
      if (!visited.has(neighbor)) {
        visited.set(neighbor, distance + 1);
        if (neighbor === end) return distance + 1;
        queue.push(neighbor);
      }
    }
  }
  return -1; // No path found
}
```

```java
import java.util.*;

public class GraphPractice {
    public static int bfsShortestPath(List<List<Integer>> adjList, int start, int end) {
        if (start == end) return 0;
        Queue<Integer> queue = new LinkedList<>();
        Map<Integer, Integer> visited = new HashMap<>(); // node -> distance
        queue.offer(start);
        visited.put(start, 0);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            int distance = visited.get(node);

            for (int neighbor : adjList.get(node)) {
                if (!visited.containsKey(neighbor)) {
                    visited.put(neighbor, distance + 1);
                    if (neighbor == end) return distance + 1;
                    queue.offer(neighbor);
                }
            }
        }
        return -1; // No path found
    }
}
```

</div>

## Recommended Practice Order

Build your skills sequentially. Start with basic traversal (DFS/BFS) on graphs and grids. Then, practice shortest path algorithms, beginning with BFS for unweighted graphs and moving to Dijkstra's for weighted ones. Finally, solve problems involving union-find (disjoint set union) for connectivity questions. Always try to map the problem statement back to these core patterns: "cheapest" suggests weighted edges, "minimum stops" suggests BFS, and "are all cities connected?" suggests union-find or a full traversal.

[Practice Graph Theory at MakeMyTrip](/company/makemytrip/graph-theory)
