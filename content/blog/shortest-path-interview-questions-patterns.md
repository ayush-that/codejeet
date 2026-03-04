---
title: "Shortest Path Interview Questions: Patterns and Strategies"
description: "Master Shortest Path problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-03-07"
category: "dsa-patterns"
tags: ["shortest-path", "dsa", "interview prep"]
---

Shortest path problems are a cornerstone of technical interviews because they test fundamental graph theory knowledge, algorithmic thinking, and the ability to translate real-world problems into efficient computational models. From social network friend suggestions to GPS navigation and network routing, the underlying need to find the optimal route between points is ubiquitous. In interviews, these questions are rarely about memorizing Dijkstra's algorithm verbatim. Instead, they assess your ability to recognize when a problem is a shortest path problem in disguise, select the appropriate algorithm, and implement it correctly under pressure.

## Common Patterns

Recognizing the pattern is 80% of the battle. Here are the core patterns you must know.

**1. Weighted Graphs with Non-Negative Weights: Dijkstra's Algorithm**
This is the workhorse. Use it when you have a graph with weighted edges and no negative cycles (or, strictly, no negative weights at all for the classic version). It efficiently finds the shortest path from a single source to all other nodes using a priority queue (min-heap).

<div class="code-group">

```python
import heapq
from collections import defaultdict

def dijkstra(graph, n, start):
    # Graph: adjacency list, graph[u] = [(v, weight), ...]
    dist = [float('inf')] * n
    dist[start] = 0
    min_heap = [(0, start)]  # (distance, node)

    while min_heap:
        curr_dist, u = heapq.heappop(min_heap)
        if curr_dist > dist[u]:
            continue  # Skip outdated entries
        for v, w in graph[u]:
            new_dist = curr_dist + w
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(min_heap, (new_dist, v))
    return dist
```

```javascript
function dijkstra(graph, n, start) {
  // Graph: adjacency list, graph[u] = [[v, weight], ...]
  const dist = new Array(n).fill(Infinity);
  dist[start] = 0;
  const minHeap = new MinPriorityQueue({ priority: (x) => x[0] });
  minHeap.enqueue([0, start]);

  while (!minHeap.isEmpty()) {
    const [currDist, u] = minHeap.dequeue().element;
    if (currDist > dist[u]) continue;
    for (const [v, w] of graph[u]) {
      const newDist = currDist + w;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        minHeap.enqueue([newDist, v]);
      }
    }
  }
  return dist;
}
```

```java
public int[] dijkstra(List<int[]>[] graph, int n, int start) {
    // Graph: adjacency list, graph[u] = List of {v, weight}
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;
    // PriorityQueue in Java is a min-heap by default
    PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    minHeap.offer(new int[]{0, start}); // {distance, node}

    while (!minHeap.isEmpty()) {
        int[] curr = minHeap.poll();
        int currDist = curr[0];
        int u = curr[1];
        if (currDist > dist[u]) continue;
        for (int[] neighbor : graph[u]) {
            int v = neighbor[0];
            int w = neighbor[1];
            int newDist = currDist + w;
            if (newDist < dist[v]) {
                dist[v] = newDist;
                minHeap.offer(new int[]{newDist, v});
            }
        }
    }
    return dist;
}
```

</div>

**2. Graphs with Negative Weights or Detecting Negative Cycles: Bellman-Ford**
When edges can have negative weights, Dijkstra fails. Bellman-Ford handles this by relaxing all edges `V-1` times. A key interview twist is using its `V`-th iteration to detect negative cycles.

**3. Multi-Source or "K Stops" Constraints: Modified BFS/Dijkstra**
For problems where the path length is constrained by the number of edges (stops), not just weight, you must track the state `(node, stops_used)`. This turns the problem into a search on a layered graph, often solvable with a modified BFS (for unweighted) or a priority queue where the priority is based on stops and cost.

**4. Shortest Path in a Grid (Unweighted): BFS**
For a 2D grid where you move up/down/left/right, each move has equal cost. Standard Breadth-First Search from the source guarantees the shortest number of steps when you first reach the target.

## Difficulty Breakdown

Our dataset of 26 questions shows a clear skew: **0% Easy, 58% Medium, 42% Hard**. This split is revealing.

- **0% Easy:** Pure, straightforward shortest path implementation is considered fundamental knowledge. Interviewers assume you know BFS for unweighted graphs and the concept of Dijkstra. You won't get a question that just asks for a textbook implementation.
- **58% Medium:** This is the core battleground. These questions wrap the shortest path core in a layer of problem-solving. You might need to model the problem as a graph first (e.g., treating words as nodes for a word ladder, or treating states `(node, time)` as nodes). The algorithm is standard, but the graph construction is the challenge.
- **42% Hard:** Here, you combine shortest path with other advanced techniques. Examples include: finding the shortest path while obeying additional constraints (like tolls or weather), using Dijkstra within a binary search solution, or applying shortest path algorithms on an implicit, very large state-space graph (like in puzzle-solving).

This distribution means you must be comfortable applying shortest path algorithms as a _tool_ within more complex problems, not just in isolation.

## Which Companies Ask Shortest Path

Shortest path questions are particularly favored by companies dealing with large-scale networks, logistics, mapping, and social graphs.

- **[Google](/company/google)**: As the king of graph and optimization problems (Maps, routing, PageRank).
- **[Amazon](/company/amazon)**: For logistics, warehouse robot pathing, and network optimization in AWS.
- **[Microsoft](/company/microsoft)**: In systems and networking roles, especially for Azure-related infrastructure.
- **[Bloomberg](/company/bloomberg)**: For financial network analysis and data routing problems.
- **[Meta](/company/meta)**: For social network analysis (degrees of separation, feed ranking propagation).

## Study Tips

1.  **Master the State Graph Concept:** The hardest part is often seeing the graph. Practice identifying the "node" and "edge" in a problem description. A node can be a city, a word, a cell in a grid, or a composite state like `(city, fuel_remaining)`.
2.  **Implement Dijkstra from Memory, Blindfolded:** You must be able to write the priority queue version of Dijkstra flawlessly in your chosen language. Drill it until it's muscle memory. The same goes for BFS on a grid.
3.  **Know the Limits:** Dijkstra = non-negative weights. Bellman-Ford = handles negatives and detects cycles. BFS = unweighted graphs (or graphs where each edge has equal cost). Using the wrong algorithm is an instant red flag.
4.  **Practice the Variations:** Specifically seek out "shortest path with obstacles," "cheapest flights within K stops," and "network delay time" style problems. They test your ability to adapt the core algorithm.

Shortest path questions are a test of applied algorithmic fundamentals. Success comes from recognizing the pattern, selecting the right tool, and executing a clean implementation.

[Practice all Shortest Path questions on CodeJeet](/topic/shortest-path)
