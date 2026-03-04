---
title: "Breadth-First Search Questions at Amazon: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Amazon — patterns, difficulty breakdown, and study tips."
date: "2027-03-07"
category: "dsa-patterns"
tags: ["amazon", "breadth-first-search", "interview prep"]
---

Breadth-First Search (BFS) is a core algorithm for traversing graphs and trees level-by-level. At Amazon, it's a critical tool for solving problems related to hierarchical data, shortest paths in unweighted graphs, and systematic exploration—skills directly applicable to their massive distributed systems, warehouse routing, and network services. With 147 BFS questions in their question bank, it's one of their most frequently tested algorithms. Mastering BFS signals you can think in terms of layers, handle adjacency, and solve problems requiring minimal steps or distance, which is essential for Amazon's scale and complexity.

## What to Expect — Types of Problems

Amazon's BFS problems typically fall into three categories:

1.  **Shortest Path in Unweighted Graphs:** Finding the minimum number of steps between two points, like the shortest transformation sequence or the minimum moves to solve a puzzle.
2.  **Level-Order Traversal:** Processing tree or graph nodes level by level. This often extends to problems like finding the largest value on each tree level or zigzag traversal.
3.  **Matrix Traversal:** Treating a grid as a graph where each cell is a node connected to its adjacent cells. Common problems include rotting oranges, shortest path in a binary matrix, or counting islands (though DFS is also used here).

You can expect variations that combine BFS with other concepts, such as using a queue with a visited set to avoid cycles, or multi-source BFS starting from several points simultaneously.

## How to Prepare — Study Tips with One Code Example

Focus on the pattern, not just memorization. The core BFS pattern uses a queue and a visited set. Practice writing this skeleton from scratch until it's automatic.

**Key Tip:** Always clarify with your interviewer: Can the graph have cycles? Are the edges directed? What constitutes a node's neighbors? This will determine if you need a visited set.

Here is the essential BFS pattern for traversing from a start node in an unweighted graph:

<div class="code-group">

```python
from collections import deque

def bfs(start, target, graph):
    if start == target:
        return 0

    queue = deque([start])
    visited = set([start])
    distance = 0

    while queue:
        level_size = len(queue)
        for _ in range(level_size):
            node = queue.popleft()
            # Process node here if needed
            if node == target:
                return distance
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        distance += 1
    return -1  # Target not reachable
```

```javascript
function bfs(start, target, graph) {
  if (start === target) return 0;

  const queue = [start];
  const visited = new Set([start]);
  let distance = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      // Process node here if needed
      if (node === target) return distance;
      for (const neighbor of graph[node] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    distance++;
  }
  return -1; // Target not reachable
}
```

```java
import java.util.*;

public int bfs(Object start, Object target, Map<Object, List<Object>> graph) {
    if (start.equals(target)) return 0;

    Queue<Object> queue = new LinkedList<>();
    Set<Object> visited = new HashSet<>();
    queue.offer(start);
    visited.add(start);
    int distance = 0;

    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        for (int i = 0; i < levelSize; i++) {
            Object node = queue.poll();
            // Process node here if needed
            if (node.equals(target)) return distance;
            for (Object neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }
        distance++;
    }
    return -1; // Target not reachable
}
```

</div>

## Recommended Practice Order

Build competence progressively:

1.  Start with basic level-order traversal on trees (LeetCode 102).
2.  Move to simple matrix BFS (LeetCode 200, 994).
3.  Practice classic shortest path problems (LeetCode 127, 279).
4.  Tackle multi-source BFS (LeetCode 542) and more complex graph problems.
5.  Finally, solve Amazon-tagged BFS questions under timed conditions.

Consistency is key. Solve at least 1-2 BFS problems daily for two weeks to build pattern recognition.

[Practice Breadth-First Search at Amazon](/company/amazon/breadth-first-search)
