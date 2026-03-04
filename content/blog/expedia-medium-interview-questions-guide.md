---
title: "Medium Expedia Interview Questions: Strategy Guide"
description: "How to tackle 35 medium difficulty questions from Expedia — patterns, time targets, and practice tips."
date: "2032-09-10"
category: "tips"
tags: ["expedia", "medium", "interview prep"]
---

Medium questions at Expedia typically assess a candidate's ability to implement core algorithms, manipulate data structures, and apply logical reasoning to problems that are one step beyond foundational concepts. They often involve combining multiple ideas, such as traversing a graph while tracking state or applying a known algorithm with a custom twist. Success here demonstrates you can handle the complexity of real-world software development.

## Common Patterns

Expedia's Medium questions frequently test a few key areas. Recognizing these patterns is crucial for efficient problem-solving.

**Graph Traversal (BFS/DFS)**: Problems often involve navigating relationships, like flight routes or dependencies. You'll need to modify standard traversal to track paths, levels, or specific conditions.

<div class="code-group">

```python
# BFS for shortest path in unweighted graph
from collections import deque

def bfs_shortest_path(graph, start, end):
    queue = deque([(start, [start])])
    visited = set([start])
    while queue:
        node, path = queue.popleft()
        if node == end:
            return path
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    return []
```

```javascript
// BFS for shortest path in unweighted graph
function bfsShortestPath(graph, start, end) {
  const queue = [[start, [start]]];
  const visited = new Set([start]);
  while (queue.length) {
    const [node, path] = queue.shift();
    if (node === end) return path;
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }
  return [];
}
```

```java
// BFS for shortest path in unweighted graph
import java.util.*;

public List<String> bfsShortestPath(Map<String, List<String>> graph, String start, String end) {
    Queue<List<String>> queue = new LinkedList<>();
    queue.offer(Arrays.asList(start));
    Set<String> visited = new HashSet<>();
    visited.add(start);

    while (!queue.isEmpty()) {
        List<String> path = queue.poll();
        String node = path.get(path.size() - 1);
        if (node.equals(end)) return path;

        for (String neighbor : graph.getOrDefault(node, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                List<String> newPath = new ArrayList<>(path);
                newPath.add(neighbor);
                queue.offer(newPath);
            }
        }
    }
    return new ArrayList<>();
}
```

</div>

**Dynamic Programming**: Expect problems involving optimization over sequences or states, such as maximizing value under constraints or counting ways to achieve a result. Identifying the subproblem and state definition is key.

**String Manipulation & Hashing**: Questions may require efficient substring searches, palindrome checks, or anagram grouping using hash maps for O(1) lookups.

**Tree Operations**: Beyond simple traversal, you might need to validate BST properties, find lowest common ancestors, or serialize/deserialize tree structures.

## Time Targets

In a 45-60 minute interview slot, you should aim to solve a Medium problem within 25-30 minutes. This timeline includes:

- **First 5 minutes**: Understand the problem, ask clarifying questions, and discuss edge cases.
- **Next 10 minutes**: Explain your approach, including time/space complexity, and get interviewer buy-in.
- **Next 10-12 minutes**: Write clean, syntactically correct code in your chosen language.
- **Final 3-5 minutes**: Walk through a test case and discuss potential optimizations.

Practice under this constraint to build the necessary speed and clarity.

## Practice Strategy

Don't just solve problems; simulate interview conditions. For each Expedia Medium question:

1.  **Timebox your attempt**: Set a 25-minute timer.
2.  **Verbally articulate your thought process**: Explain your reasoning out loud as if an interviewer is present.
3.  **Write production-ready code**: Include clear variable names and handle edge cases.
4.  **Analyze your solution**: After solving, review the optimal solution. Note any gaps in your approach or knowledge.
5.  **Categorize by pattern**: Tag each problem you practice (e.g., "BFS", "DP"). This helps you recognize patterns faster during the actual interview.

Focus on depth over breadth. Mastering 15-20 problems across the common patterns is more effective than superficially attempting all 35.

[Practice Medium Expedia questions](/company/expedia/medium)
