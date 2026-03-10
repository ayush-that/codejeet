---
title: "Shortest Path Interview Questions: Patterns and Strategies"
description: "Master Shortest Path problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-05-28"
category: "dsa-patterns"
tags: ["shortest-path", "dsa", "interview prep"]
---

# Shortest Path Interview Questions: Patterns and Strategies

You’re asked to find the cheapest flight from New York to San Francisco with at most one stop. You think, “Easy—just BFS.” But then you notice the flights have different prices, and you can only take at most one stop. Suddenly, it’s not just about layers anymore. This is LeetCode 787: Cheapest Flights Within K Stops—a classic shortest path problem that catches candidates off guard because it blends classic BFS with weighted edges and a constraint on steps. Shortest path questions appear in about 5-10% of technical interviews at top tech companies, not because they’re the most common, but because they test a candidate’s ability to recognize graph structures in seemingly unrelated problems and apply the right algorithm under constraints.

What makes these problems tricky is that the “shortest” isn’t always about physical distance. It could be about minimum cost, fewest steps, or least time, often with added twists like limited moves, negative weights, or multiple criteria. Interviewers use these problems to see if you can move beyond memorized algorithms and adapt them to real-world constraints.

## Common Patterns

### 1. Unweighted Graphs: BFS for Shortest Path in Unweighted Graphs

When all edges have equal weight (or cost), the shortest path is simply the path with the fewest edges. Breadth-First Search (BFS) naturally finds this because it explores nodes layer by layer. The moment you reach the target node, you’ve found the shortest path.

**Key intuition:** BFS guarantees the shortest path in unweighted graphs because it explores all nodes at distance `d` before moving to distance `d+1`. Use a queue and a visited set to avoid cycles.

**LeetCode examples:** Word Ladder (#127), Minimum Genetic Mutation (#433), Open the Lock (#752).

<div class="code-group">

```python
from collections import deque

def shortest_path_bfs(start, target, neighbors):
    """
    Find shortest path length from start to target in unweighted graph.
    neighbors(node) returns list of adjacent nodes.
    """
    if start == target:
        return 0

    queue = deque([start])
    visited = set([start])
    distance = 0

    while queue:
        # Process all nodes at current distance level
        for _ in range(len(queue)):
            node = queue.popleft()

            if node == target:
                return distance

            for neighbor in neighbors(node):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

        distance += 1

    return -1  # Target not reachable

# Time: O(V + E) where V = vertices, E = edges
# Space: O(V) for queue and visited set
```

```javascript
function shortestPathBFS(start, target, neighbors) {
  if (start === target) return 0;

  const queue = [start];
  const visited = new Set([start]);
  let distance = 0;

  while (queue.length > 0) {
    // Process all nodes at current distance level
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();

      if (node === target) return distance;

      for (const neighbor of neighbors(node)) {
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

// Time: O(V + E) where V = vertices, E = edges
// Space: O(V) for queue and visited set
```

```java
import java.util.*;

public int shortestPathBFS(String start, String target, Function<String, List<String>> neighbors) {
    if (start.equals(target)) return 0;

    Queue<String> queue = new LinkedList<>();
    Set<String> visited = new HashSet<>();
    queue.offer(start);
    visited.add(start);
    int distance = 0;

    while (!queue.isEmpty()) {
        // Process all nodes at current distance level
        int levelSize = queue.size();

        for (int i = 0; i < levelSize; i++) {
            String node = queue.poll();

            if (node.equals(target)) return distance;

            for (String neighbor : neighbors.apply(node)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }

        distance++;
    }

    return -1;  // Target not reachable
}

// Time: O(V + E) where V = vertices, E = edges
// Space: O(V) for queue and visited set
```

</div>

### 2. Weighted Graphs (Non-negative): Dijkstra's Algorithm

When edges have different non-negative weights, BFS no longer works because it assumes all edges are equal. Dijkstra's algorithm solves this by always expanding the node with the smallest known distance so far, using a priority queue (min-heap).

**Key intuition:** Dijkstra is essentially "greedy BFS"—at each step, you explore the most promising path first. This works because with non-negative weights, once you've found a path to a node, you've found the shortest path to that node.

**LeetCode examples:** Network Delay Time (#743), Path With Minimum Effort (#1631), Cheapest Flights Within K Stops (#787).

<div class="code-group">

```python
import heapq

def dijkstra(n, edges, start):
    """
    Find shortest distances from start to all nodes in weighted graph.
    edges: list of (u, v, weight)
    Returns list of distances, distance[i] = shortest distance from start to i
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))

    # Initialize distances
    dist = [float('inf')] * n
    dist[start] = 0

    # Min-heap: (distance, node)
    heap = [(0, start)]

    while heap:
        current_dist, node = heapq.heappop(heap)

        # Skip if we found a better path already
        if current_dist > dist[node]:
            continue

        for neighbor, weight in graph[node]:
            new_dist = current_dist + weight

            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))

    return dist

# Time: O((V + E) log V) with binary heap
# Space: O(V + E) for graph, O(V) for heap
```

```javascript
function dijkstra(n, edges, start) {
  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    graph[u].push([v, w]);
  }

  // Initialize distances
  const dist = Array(n).fill(Infinity);
  dist[start] = 0;

  // Min-heap: [distance, node]
  const heap = new MinHeap((a, b) => a[0] - b[0]);
  heap.push([0, start]);

  while (!heap.isEmpty()) {
    const [currentDist, node] = heap.pop();

    // Skip if we found a better path already
    if (currentDist > dist[node]) continue;

    for (const [neighbor, weight] of graph[node]) {
      const newDist = currentDist + weight;

      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        heap.push([newDist, neighbor]);
      }
    }
  }

  return dist;
}

// Time: O((V + E) log V) with binary heap
// Space: O(V + E) for graph, O(V) for heap
```

```java
import java.util.*;

public int[] dijkstra(int n, int[][] edges, int start) {
    // Build adjacency list
    List<List<int[]>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        graph.add(new ArrayList<>());
    }
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        graph.get(u).add(new int[]{v, w});
    }

    // Initialize distances
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;

    // Min-heap: [distance, node]
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    heap.offer(new int[]{0, start});

    while (!heap.isEmpty()) {
        int[] current = heap.poll();
        int currentDist = current[0];
        int node = current[1];

        // Skip if we found a better path already
        if (currentDist > dist[node]) continue;

        for (int[] neighbor : graph.get(node)) {
            int nextNode = neighbor[0];
            int weight = neighbor[1];
            int newDist = currentDist + weight;

            if (newDist < dist[nextNode]) {
                dist[nextNode] = newDist;
                heap.offer(new int[]{newDist, nextNode});
            }
        }
    }

    return dist;
}

// Time: O((V + E) log V) with binary heap
// Space: O(V + E) for graph, O(V) for heap
```

</div>

### 3. Multi-Source or Multi-Criteria: Modified BFS/Dijkstra

Some problems have multiple starting points or require tracking additional state. The key is to modify your data structure to include the extra dimension.

**Key intuition:** When you need to track something beyond just node position (like remaining stops, time, or cost), add that dimension to your visited state or heap elements. This turns the problem into searching in a higher-dimensional space.

**LeetCode examples:** Shortest Path in Binary Matrix (#1091), Minimum Cost to Make at Least One Valid Path (#1368), Cheapest Flights Within K Stops (#787).

<div class="code-group">

```python
import heapq

def multi_criteria_dijkstra(n, flights, src, dst, k):
    """
    Cheapest price from src to dst with at most k stops.
    flights: list of [from, to, price]
    """
    # Build graph
    graph = [[] for _ in range(n)]
    for u, v, price in flights:
        graph[u].append((v, price))

    # Min-heap: (price, city, stops_used)
    heap = [(0, src, 0)]
    # Track best price for each (city, stops_used) state
    best = {}

    while heap:
        price, city, stops = heapq.heappop(heap)

        if city == dst:
            return price

        if stops > k:
            continue

        # Skip if we found a better path to this state
        if (city, stops) in best and best[(city, stops)] <= price:
            continue
        best[(city, stops)] = price

        for neighbor, cost in graph[city]:
            heapq.heappush(heap, (price + cost, neighbor, stops + 1))

    return -1

# Time: O((V + E) log V) - similar to Dijkstra but with K factor
# Space: O(V * K) for best dictionary
```

```javascript
function multiCriteriaDijkstra(n, flights, src, dst, k) {
  // Build graph
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, price] of flights) {
    graph[u].push([v, price]);
  }

  // Min-heap: [price, city, stops_used]
  const heap = new MinHeap((a, b) => a[0] - b[0]);
  heap.push([0, src, 0]);

  // Track best price for each (city, stops_used) state
  const best = new Map();

  while (!heap.isEmpty()) {
    const [price, city, stops] = heap.pop();

    if (city === dst) return price;

    if (stops > k) continue;

    // Skip if we found a better path to this state
    const key = `${city},${stops}`;
    if (best.has(key) && best.get(key) <= price) continue;
    best.set(key, price);

    for (const [neighbor, cost] of graph[city]) {
      heap.push([price + cost, neighbor, stops + 1]);
    }
  }

  return -1;
}

// Time: O((V + E) log V) - similar to Dijkstra but with K factor
// Space: O(V * K) for best map
```

```java
import java.util.*;

public int multiCriteriaDijkstra(int n, int[][] flights, int src, int dst, int k) {
    // Build graph
    List<List<int[]>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        graph.add(new ArrayList<>());
    }
    for (int[] flight : flights) {
        int u = flight[0], v = flight[1], price = flight[2];
        graph.get(u).add(new int[]{v, price});
    }

    // Min-heap: [price, city, stops_used]
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    heap.offer(new int[]{0, src, 0});

    // Track best price for each (city, stops_used) state
    Map<String, Integer> best = new HashMap<>();

    while (!heap.isEmpty()) {
        int[] current = heap.poll();
        int price = current[0];
        int city = current[1];
        int stops = current[2];

        if (city == dst) return price;

        if (stops > k) continue;

        // Skip if we found a better path to this state
        String key = city + "," + stops;
        if (best.containsKey(key) && best.get(key) <= price) continue;
        best.put(key, price);

        for (int[] neighbor : graph.get(city)) {
            int nextCity = neighbor[0];
            int cost = neighbor[1];
            heap.offer(new int[]{price + cost, nextCity, stops + 1});
        }
    }

    return -1;
}

// Time: O((V + E) log V) - similar to Dijkstra but with K factor
// Space: O(V * K) for best map
```

</div>

## When to Use Shortest Path vs Alternatives

Recognizing when a problem requires shortest path algorithms is half the battle. Here's how to distinguish them from similar techniques:

**Shortest Path vs BFS/DFS:**

- Use BFS when: All edges have equal weight and you need shortest path in terms of number of edges (unweighted graph)
- Use DFS when: You need to explore all paths (like finding if a path exists), not necessarily the shortest one
- Use Dijkstra when: Edges have different non-negative weights
- Use Bellman-Ford when: Edges can have negative weights (rare in interviews)

**Shortest Path vs Dynamic Programming:**
Some problems can be solved with either approach. Use shortest path when:

- The problem naturally maps to a graph (nodes and edges)
- You're finding minimum cost/distance between two points
- The state transitions resemble moving between nodes

Use DP when:

- The problem has optimal substructure and overlapping subproblems
- You can define a clear recurrence relation
- The "graph" would be too large to build explicitly

**Decision criteria:**

1. Does the problem involve finding minimum cost/distance between points? → Likely shortest path
2. Are there constraints like limited stops or time? → Modified Dijkstra/BFS
3. Can you represent states as nodes and transitions as edges? → Graph algorithm
4. Are weights non-negative? → Dijkstra. Negative weights? → Bellman-Ford (rare)

## Edge Cases and Gotchas

### 1. No Path Exists

Always handle the case where the target is unreachable. Return -1, Infinity, or a sentinel value as specified. Don't assume connectivity.

**How to handle:** Initialize distances to Infinity, check if target distance was updated.

### 2. Large Inputs Causing Memory Issues

When using Dijkstra with a standard priority queue on large graphs (10^5+ nodes), the heap can get huge.

**Solution:** Use a visited set to avoid pushing the same node multiple times with worse distances. Always check `if current_dist > dist[node]: continue` before processing neighbors.

### 3. Integer Overflow

When weights can be large or paths long, sums might overflow 32-bit integers.

**Solution:** Use 64-bit integers (long in Java, int64 in Python). Mention this consideration even if not implementing.

### 4. Multiple Edges Between Same Nodes

Graphs can have multiple edges between the same pair of nodes with different weights.

**How to handle:** In adjacency list, store all edges. Dijkstra will naturally select the best one. Don't accidentally overwrite with only one edge.

### 5. Self-Loops and Zero-Cost Edges

Nodes might have edges to themselves, or edges with zero cost. These don't break Dijkstra but can cause infinite loops in BFS if not handled.

**Solution:** Always mark nodes as visited when adding to queue/stack, not when processing.

## Difficulty Breakdown

The data shows 0% Easy, 58% Medium, 42% Hard problems. This distribution tells us something important:

1. **No Easy problems** means shortest path questions are rarely used as simple warm-ups. They're usually part of the main interview problem.
2. **Medium problems (58%)** are the sweet spot for most interviews. These test your ability to implement Dijkstra or BFS with a twist.
3. **Hard problems (42%)** appear more frequently than in other topics. Companies use these for senior roles or when they want to test advanced graph knowledge.

**Study prioritization:** Master the Medium problems first. They give you the patterns needed for most interviews. Then tackle Hard problems to prepare for more challenging interviews or senior positions.

## Which Companies Ask Shortest Path

**Google** (/company/google) loves graph problems, and shortest path appears in various forms. They often combine it with other concepts like heaps or dynamic programming. Expect problems like "Network Delay Time" or custom variations.

**Amazon** (/company/amazon) frequently asks shortest path in the context of real-world scenarios: delivery routes, network latency, or resource allocation. They like problems that tell a business story.

**Microsoft** (/company/microsoft) tends to ask cleaner algorithmic versions. You might see problems like "Shortest Path in Binary Matrix" or variations on classic algorithms.

**Bloomberg** (/company/bloomberg) asks shortest path in financial contexts: minimum transaction costs, optimal trading paths, or network reliability.

**Meta** (/company/meta) often incorporates shortest path into problems about social networks: degrees of separation, content propagation, or network effects.

Each company has a style, but the underlying patterns remain the same. Google and Meta tend toward the harder variations, while Amazon and Microsoft often stick to Medium difficulty.

## Study Tips

### 1. Start with the Fundamentals

Don't jump straight to Hard problems. First, implement vanilla BFS and Dijkstra from scratch until you can do it in your sleep. Understand why Dijkstra uses a min-heap and why BFS uses a queue.

### 2. Practice Pattern Recognition

When you see a new problem, ask:

- Can I model this as a graph?
- What are the nodes? What are the edges?
- Are edges weighted? If so, are weights non-negative?
- Are there additional constraints (stops, time, etc.)?

### 3. Recommended Problem Order

1. **BFS patterns:** Word Ladder (#127), Open the Lock (#752)
2. **Basic Dijkstra:** Network Delay Time (#743)
3. **Grid shortest path:** Shortest Path in Binary Matrix (#1091)
4. **Multi-criteria:** Cheapest Flights Within K Stops (#787)
5. **Hard variations:** Minimum Cost to Make at Least One Valid Path (#1368)

### 4. Time Yourself

Medium problems: Aim for 20-25 minutes including explanation.
Hard problems: 30-35 minutes.

If you're taking longer, you need more pattern recognition practice, not more coding practice.

### 5. Draw It Out

Always draw a small example graph. This helps you catch edge cases and verify your algorithm works on paper before coding.

Shortest path problems test your ability to see the underlying graph structure in a problem and apply the right algorithm with the necessary modifications. They're not about memorizing code—they're about understanding why the algorithms work and how to adapt them. Master these patterns, and you'll handle most shortest path questions that come your way.

[Practice all Shortest Path questions on CodeJeet](/topic/shortest-path)
