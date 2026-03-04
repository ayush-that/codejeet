---
title: "Medium Uber Interview Questions: Strategy Guide"
description: "How to tackle 224 medium difficulty questions from Uber — patterns, time targets, and practice tips."
date: "2032-01-20"
category: "tips"
tags: ["uber", "medium", "interview prep"]
---

Medium Uber interview questions typically involve real-world scenarios that test your ability to design efficient algorithms and manipulate data structures under constraints. These problems often simulate aspects of Uber's core services, like mapping, routing, pricing, or matching drivers and riders. You'll need to translate a business or logistical problem into clean, optimized code. Success here means demonstrating not just correctness, but also strong problem decomposition and communication.

## Common Patterns

Uber's Medium problems frequently test a few key areas. Recognizing these patterns is crucial for quick identification and solution structuring.

**Graph Traversal and BFS/DFS:** Many problems model cities, trips, or networks as graphs. BFS is common for finding shortest paths in unweighted scenarios (e.g., fewest steps between points), while DFS helps with exploration or connected components.

<div class="code-group">
```python
# BFS template for shortest path in unweighted graph
from collections import deque
def bfs_shortest_path(graph, start, target):
    queue = deque([(start, 0)])  # (node, distance)
    visited = set([start])
    while queue:
        node, dist = queue.popleft()
        if node == target:
            return dist
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    return -1
```
```javascript
// BFS template for shortest path in unweighted graph
function bfsShortestPath(graph, start, target) {
    const queue = [[start, 0]]; // [node, distance]
    const visited = new Set([start]);
    while (queue.length) {
        const [node, dist] = queue.shift();
        if (node === target) return dist;
        for (const neighbor of graph[node] || []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([neighbor, dist + 1]);
            }
        }
    }
    return -1;
}
```
```java
// BFS template for shortest path in unweighted graph
import java.util.*;
public int bfsShortestPath(Map<Integer, List<Integer>> graph, int start, int target) {
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{start, 0});
    Set<Integer> visited = new HashSet<>();
    visited.add(start);
    while (!queue.isEmpty()) {
        int[] current = queue.poll();
        int node = current[0], dist = current[1];
        if (node == target) return dist;
        for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.offer(new int[]{neighbor, dist + 1});
            }
        }
    }
    return -1;
}
```
</div>

**Hash Maps for Frequency Counting:** Problems involving grouping, deduplication, or tracking states (e.g., ride requests, user sessions) often use hash maps for O(1) lookups.

**String Manipulation and Parsing:** You may need to process log files, GPS coordinates, or address strings, requiring careful handling of edge cases and efficient searching or splitting.

**Array and Matrix Manipulation:** Tasks like calculating surge pricing zones or optimizing pickup/dropoff locations involve 2D arrays and sliding window or prefix sum techniques.

## Time Targets

In a 45-minute interview slot, you should aim to solve a Medium problem within **25-30 minutes**. This timeline includes:

- **3-5 minutes:** Understanding the problem, asking clarifying questions, and discussing your approach.
- **15-20 minutes:** Writing clean, syntactically correct code in your chosen language.
- **5 minutes:** Walking through test cases, explaining edge cases, and discussing time/space complexity.

If you exceed 30 minutes without a working solution, you risk not leaving time for the interviewer's follow-up questions or a second problem. Practice under timed conditions to build this pace.

## Practice Strategy

To use Uber's Medium questions effectively:

1. **Pattern-First Practice:** Sort problems by frequency and tag (Graphs, Hash Table, etc.). Solve 5-7 problems of the same pattern consecutively to build muscle memory.
2. **Simulate Interview Conditions:** Time every session. Verbally explain your thought process as you code, even when practicing alone.
3. **Prioritize Uber's Frequent Topics:** Focus on graph problems, string manipulation, and hash map applications, as these appear most often in their question bank.
4. **Analyze Failed Attempts:** If you can't solve a problem in 25 minutes, study the solution, then re-implement it from memory 24 hours later. This strengthens pattern retention.

[Practice Medium Uber questions](/company/uber/medium)
