---
title: "Depth-First Search Questions at Yandex: What to Expect"
description: "Prepare for Depth-First Search interview questions at Yandex — patterns, difficulty breakdown, and study tips."
date: "2028-03-05"
category: "dsa-patterns"
tags: ["yandex", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a fundamental algorithm that Yandex interviewers use to assess your grasp of recursion, tree/graph traversal, and systematic problem-solving. With 12 specific DFS questions in their problem bank, it's a clearly tested competency. For a company like Yandex, which builds complex systems from search engines to maps and ride-hailing, the ability to navigate hierarchical data structures and explore solution spaces is directly applicable. Mastering DFS demonstrates you can think recursively and handle problems involving paths, connectivity, permutations, or nested structures—all common in large-scale software.

## What to Expect — Types of Problems

Yandex's DFS questions typically fall into a few core categories. You won't see abstract algorithm theory; you'll solve concrete problems.

- **Tree Traversal & Manipulation:** Calculating depths, finding lowest common ancestors, validating binary search trees, or serializing/deserializing tree structures. These test your understanding of pre-order, in-order, and post-order DFS.
- **Graph Connectivity & Pathfinding:** Problems on islands, robot movement on grids, or finding if a path exists between nodes. These often use DFS on adjacency lists or matrices to explore connected components.
- **Backtracking & State-Space Search:** Generating permutations, solving puzzles, or partitioning sets. These are DFS-intensive, requiring you to explore decision trees, make choices, and backtrack upon hitting dead ends.
- **Nested Structure Parsing:** Evaluating expressions, parsing nested lists, or walking through a file directory. These problems model real-world scenarios where data is recursively defined.

The key is recognizing when a problem has a recursive "explore all possibilities" or "visit all connected nodes" structure.

## How to Prepare — Study Tips with Code Example

Start by internalizing the two implementation patterns: the recursive stack (implicit call stack) and the iterative stack (explicit stack). For interviews, the recursive version is often cleaner for trees and backtracking, while the iterative one is useful for avoiding stack overflow on deep graphs.

Practice writing DFS from memory. A core pattern is the "visited" set management for graphs to avoid cycles. For tree problems, understand the base case (usually a `null` node) and what computation to do at the current node (pre, in, or post-order).

Here is the essential iterative DFS pattern for a graph, applicable to many grid and connectivity problems:

<div class="code-group">

```python
def dfs_iterative(graph, start_node):
    stack = [start_node]
    visited = set([start_node])

    while stack:
        node = stack.pop()
        # Process node here (e.g., check a condition)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                stack.append(neighbor)
    # Return result based on processing
    return visited
```

```javascript
function dfsIterative(graph, startNode) {
  const stack = [startNode];
  const visited = new Set([startNode]);

  while (stack.length > 0) {
    const node = stack.pop();
    // Process node here
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }
  // Return result based on processing
  return visited;
}
```

```java
public Set<Integer> dfsIterative(Map<Integer, List<Integer>> graph, Integer startNode) {
    Deque<Integer> stack = new ArrayDeque<>();
    Set<Integer> visited = new HashSet<>();
    stack.push(startNode);
    visited.add(startNode);

    while (!stack.isEmpty()) {
        Integer node = stack.pop();
        // Process node here
        for (Integer neighbor : graph.getOrDefault(node, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                stack.push(neighbor);
            }
        }
    }
    // Return result based on processing
    return visited;
}
```

</div>

## Recommended Practice Order

Build competence progressively. Don't jump to the hardest Yandex-tagged problems first.

1.  **Master the Fundamentals:** Solve basic tree traversal (pre, in, post-order) and graph connectivity (Number of Islands) on any platform.
2.  **Learn Backtracking:** Practice generating subsets, permutations, and combination sums. This teaches you the template of adding a choice, recursing, and then removing the choice (backtracking).
3.  **Apply to Classic Variations:** Solve pathfinding in a maze, finding all paths in a graph, or validating complex trees (like BST).
4.  **Tackle Yandex-Specific Problems:** Finally, work through the actual Yandex DFS questions. By this stage, you'll be pattern-matching and can focus on the unique twist each problem adds.

[Practice Depth-First Search at Yandex](/company/yandex/depth-first-search)
