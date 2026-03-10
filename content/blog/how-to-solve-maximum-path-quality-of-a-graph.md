---
title: "How to Solve Maximum Path Quality of a Graph — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Path Quality of a Graph. Hard difficulty, 61.7% acceptance rate. Topics: Array, Backtracking, Graph Theory."
date: "2029-03-17"
category: "dsa-patterns"
tags: ["maximum-path-quality-of-a-graph", "array", "backtracking", "graph-theory", "hard"]
---

# How to Solve Maximum Path Quality of a Graph

You're given an undirected graph where each node has a value, and edges have travel times. You need to find the maximum total value you can collect starting from node 0 within a given time limit, where node values are only counted the first time you visit them. The challenge is that you can revisit nodes and edges, but you must return to the starting node within the time limit. This problem is tricky because it combines graph traversal with backtracking and pruning - you need to explore paths efficiently without getting stuck in exponential search.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- `values = [0, 32, 10, 43]`
- `edges = [[0,1,10],[1,2,10],[0,3,10]]`
- `maxTime = 49`

**Graph structure:**

- Node 0 (value 0) connects to node 1 (time 10) and node 3 (time 10)
- Node 1 (value 32) connects to node 2 (time 10)
- Node 2 (value 10)
- Node 3 (value 43)

**Step-by-step exploration:**

1. **Start at node 0** (time used: 0, quality: 0)
   - Mark node 0 as visited (quality remains 0 since we don't count it yet)

2. **Try path 0 → 1** (time: 10, quality: 32)
   - First visit to node 1, add its value 32
   - From node 1, try 1 → 2 (time: 20, quality: 42)
     - First visit to node 2, add value 10
     - From node 2, only option is back to 1
     - 2 → 1 (time: 30, quality: 42) - node 1 already visited
     - 1 → 0 (time: 40, quality: 42) - back to start within time limit
     - **Record quality 42**

3. **Backtrack and try 0 → 3** (time: 10, quality: 43)
   - First visit to node 3, add value 43
   - From node 3, only option is back to 0
   - 3 → 0 (time: 20, quality: 43) - back to start
   - **Record quality 43** (better than 42)

4. **Try 0 → 1 → 0 → 3** (time: 30, quality: 75)
   - 0 → 1 (time: 10, quality: 32)
   - 1 → 0 (time: 20, quality: 32)
   - 0 → 3 (time: 30, quality: 75) - node 3 not visited yet
   - 3 → 0 (time: 40, quality: 75) - back to start
   - **Record quality 75** (new best)

The maximum quality we found is 75 by visiting nodes 0, 1, and 3.

## Brute Force Approach

The brute force approach would explore all possible paths starting and ending at node 0 within the time limit. Since we can revisit nodes and edges, there are potentially infinite paths, but we can bound the search by:

1. Only considering paths where total time ≤ maxTime
2. Using backtracking to explore different node sequences

However, even with these bounds, the search space is exponential. For a complete graph, you could take any sequence of nodes, making it O(n!) in the worst case. This is clearly infeasible for n up to 1000 as given in the constraints.

A naive implementation might try to generate all permutations of nodes, but that would be O(n!) which is astronomically large even for moderate n. We need a smarter approach.

## Optimized Approach

The key insight is that we can use **DFS with backtracking and pruning**:

1. **Build an adjacency list** for efficient graph traversal
2. **Use DFS from node 0** with backtracking:
   - Keep track of current node, time used, and current quality
   - Mark nodes as visited when first encountered
   - Unmark them when backtracking
3. **Prune unpromising paths**:
   - If we can't possibly return to node 0 within maxTime, stop exploring
   - We need to know the shortest time from each node back to node 0
4. **Precompute shortest times** using Dijkstra's algorithm:
   - Calculate minimum time from each node to node 0
   - This tells us the minimum time needed to return to start from any position

The pruning condition becomes: `currentTime + shortestTime[currentNode] > maxTime`

This dramatically reduces the search space because we stop exploring paths that can't possibly return to the start in time.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O((V+E)logV + 4^V) where V is nodes, E is edges
# Space: O(V+E) for adjacency list and visited array
class Solution:
    def maximalPathQuality(self, values, edges, maxTime):
        n = len(values)

        # Step 1: Build adjacency list for the graph
        # Each entry: {neighbor: time}
        graph = [[] for _ in range(n)]
        for u, v, time in edges:
            graph[u].append((v, time))
            graph[v].append((u, time))  # Undirected graph

        # Step 2: Precompute shortest times from each node to node 0
        # Using Dijkstra's algorithm starting from node 0
        import heapq
        shortest_time = [float('inf')] * n
        shortest_time[0] = 0
        heap = [(0, 0)]  # (time, node)

        while heap:
            current_time, node = heapq.heappop(heap)
            if current_time > shortest_time[node]:
                continue
            for neighbor, travel_time in graph[node]:
                new_time = current_time + travel_time
                if new_time < shortest_time[neighbor]:
                    shortest_time[neighbor] = new_time
                    heapq.heappush(heap, (new_time, neighbor))

        # Step 3: DFS with backtracking and pruning
        visited = [0] * n  # Track visit counts (0 = not visited, >0 = visited)
        self.max_quality = 0

        def dfs(node, current_time, current_quality):
            # Step 3a: Update quality if first time visiting this node
            if visited[node] == 0:
                current_quality += values[node]

            visited[node] += 1  # Mark as visited

            # Step 3b: If back at start node, update max quality
            if node == 0:
                self.max_quality = max(self.max_quality, current_quality)

            # Step 3c: Explore neighbors
            for neighbor, travel_time in graph[node]:
                # Prune: Check if we can go to neighbor and still return to start in time
                new_time = current_time + travel_time
                if new_time + shortest_time[neighbor] <= maxTime:
                    dfs(neighbor, new_time, current_quality)

            # Step 3d: Backtrack - unmark this node
            visited[node] -= 1

        # Step 4: Start DFS from node 0
        dfs(0, 0, 0)

        return self.max_quality
```

```javascript
// Time: O((V+E)logV + 4^V) where V is nodes, E is edges
// Space: O(V+E) for adjacency list and visited array
var maximalPathQuality = function (values, edges, maxTime) {
  const n = values.length;

  // Step 1: Build adjacency list for the graph
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, time] of edges) {
    graph[u].push([v, time]);
    graph[v].push([u, time]); // Undirected graph
  }

  // Step 2: Precompute shortest times from each node to node 0
  // Using Dijkstra's algorithm starting from node 0
  const shortestTime = new Array(n).fill(Infinity);
  shortestTime[0] = 0;
  const heap = [[0, 0]]; // [time, node]

  while (heap.length > 0) {
    heap.sort((a, b) => a[0] - b[0]); // Min-heap simulation
    const [currentTime, node] = heap.shift();

    if (currentTime > shortestTime[node]) continue;

    for (const [neighbor, travelTime] of graph[node]) {
      const newTime = currentTime + travelTime;
      if (newTime < shortestTime[neighbor]) {
        shortestTime[neighbor] = newTime;
        heap.push([newTime, neighbor]);
      }
    }
  }

  // Step 3: DFS with backtracking and pruning
  const visited = new Array(n).fill(0); // Track visit counts
  let maxQuality = 0;

  const dfs = (node, currentTime, currentQuality) => {
    // Step 3a: Update quality if first time visiting this node
    if (visited[node] === 0) {
      currentQuality += values[node];
    }

    visited[node]++; // Mark as visited

    // Step 3b: If back at start node, update max quality
    if (node === 0) {
      maxQuality = Math.max(maxQuality, currentQuality);
    }

    // Step 3c: Explore neighbors
    for (const [neighbor, travelTime] of graph[node]) {
      // Prune: Check if we can go to neighbor and still return to start in time
      const newTime = currentTime + travelTime;
      if (newTime + shortestTime[neighbor] <= maxTime) {
        dfs(neighbor, newTime, currentQuality);
      }
    }

    // Step 3d: Backtrack - unmark this node
    visited[node]--;
  };

  // Step 4: Start DFS from node 0
  dfs(0, 0, 0);

  return maxQuality;
};
```

```java
// Time: O((V+E)logV + 4^V) where V is nodes, E is edges
// Space: O(V+E) for adjacency list and visited array
class Solution {
    private List<List<int[]>> graph;
    private int[] values;
    private int[] shortestTime;
    private int[] visited;
    private int maxQuality;
    private int maxTime;

    public int maximalPathQuality(int[] values, int[][] edges, int maxTime) {
        int n = values.length;
        this.values = values;
        this.maxTime = maxTime;

        // Step 1: Build adjacency list for the graph
        graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], time = edge[2];
            graph.get(u).add(new int[]{v, time});
            graph.get(v).add(new int[]{u, time});  // Undirected graph
        }

        // Step 2: Precompute shortest times from each node to node 0
        shortestTime = new int[n];
        Arrays.fill(shortestTime, Integer.MAX_VALUE);
        shortestTime[0] = 0;

        // Dijkstra's algorithm using PriorityQueue
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, 0});  // [time, node]

        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int currentTime = current[0];
            int node = current[1];

            if (currentTime > shortestTime[node]) continue;

            for (int[] neighborInfo : graph.get(node)) {
                int neighbor = neighborInfo[0];
                int travelTime = neighborInfo[1];
                int newTime = currentTime + travelTime;

                if (newTime < shortestTime[neighbor]) {
                    shortestTime[neighbor] = newTime;
                    pq.offer(new int[]{newTime, neighbor});
                }
            }
        }

        // Step 3: Initialize DFS variables
        visited = new int[n];
        maxQuality = 0;

        // Step 4: Start DFS from node 0
        dfs(0, 0, 0);

        return maxQuality;
    }

    private void dfs(int node, int currentTime, int currentQuality) {
        // Step 3a: Update quality if first time visiting this node
        if (visited[node] == 0) {
            currentQuality += values[node];
        }

        visited[node]++;  // Mark as visited

        // Step 3b: If back at start node, update max quality
        if (node == 0) {
            maxQuality = Math.max(maxQuality, currentQuality);
        }

        // Step 3c: Explore neighbors
        for (int[] neighborInfo : graph.get(node)) {
            int neighbor = neighborInfo[0];
            int travelTime = neighborInfo[1];

            // Prune: Check if we can go to neighbor and still return to start in time
            int newTime = currentTime + travelTime;
            if (newTime + shortestTime[neighbor] <= maxTime) {
                dfs(neighbor, newTime, currentQuality);
            }
        }

        // Step 3d: Backtrack - unmark this node
        visited[node]--;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

1. **Dijkstra's algorithm**: O((V+E)logV) where V is number of nodes and E is number of edges. We use a priority queue for efficient shortest path computation.
2. **DFS with backtracking**: In the worst case, O(4^V). This seems high, but in practice it's much lower due to:
   - Pruning using shortest path times
   - The graph is typically sparse (constraints say up to 2000 edges for 1000 nodes)
   - Each node can be visited multiple times, but the pruning limits exploration

**Space Complexity:**

1. **Adjacency list**: O(V+E) to store the graph
2. **Shortest time array**: O(V)
3. **Visited array**: O(V)
4. **DFS recursion stack**: O(V) in worst case
   Total: O(V+E)

## Common Mistakes

1. **Forgetting the graph is undirected**: When building the adjacency list, you must add edges in both directions. This is easy to miss since the problem states "undirected" but the edges array doesn't explicitly show both directions.

2. **Incorrect pruning condition**: A common mistake is to prune based only on `currentTime > maxTime`, but this doesn't account for the time needed to return to the start. You must use `currentTime + shortestTime[currentNode] > maxTime`.

3. **Not handling revisit counts properly**: Since we can revisit nodes, we need to track visit counts (not just boolean visited). If we use a boolean array and mark a node as visited, we might not explore alternative paths that revisit that node. Using a count array allows proper backtracking.

4. **Missing the base case update**: You must update the maximum quality whenever you return to node 0 (not just at the end of exploration). The path can return to start multiple times within the time limit.

## When You'll See This Pattern

This problem combines several important patterns:

1. **DFS with backtracking and pruning**: Similar to problems like [Cherry Pickup](/problem/cherry-pickup) where you need to explore paths with state (visited nodes, time used) and prune unpromising branches.

2. **Graph search with constraints**: Problems like [Minimum Cost to Reach Destination in Time](/problem/minimum-cost-to-reach-destination-in-time) where you have both a cost/quality to maximize and a time constraint to satisfy.

3. **Combining shortest path with exploration**: The technique of precomputing shortest paths to enable pruning appears in problems like [Network Delay Time](/problem/network-delay-time) variations where you need to reach multiple nodes within constraints.

## Key Takeaways

1. **Pruning with precomputed information**: When doing DFS on graphs with constraints, precompute information (like shortest paths) to prune branches that can't possibly satisfy constraints. This transforms exponential search into manageable exploration.

2. **Count-based visited tracking**: For problems where nodes can be revisited but you only collect rewards once, use count arrays instead of boolean arrays to properly backtrack.

3. **Graph representation matters**: Always check if the graph is directed or undirected when building adjacency lists. Undirected graphs need edges added in both directions.

Related problems: [Cherry Pickup](/problem/cherry-pickup), [Minimum Cost to Reach Destination in Time](/problem/minimum-cost-to-reach-destination-in-time)
