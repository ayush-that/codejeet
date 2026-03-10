---
title: "How to Solve Number of Restricted Paths From First to Last Node — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Restricted Paths From First to Last Node. Medium difficulty, 40.9% acceptance rate. Topics: Dynamic Programming, Graph Theory, Topological Sort, Heap (Priority Queue), Shortest Path."
date: "2029-02-27"
category: "dsa-patterns"
tags:
  [
    "number-of-restricted-paths-from-first-to-last-node",
    "dynamic-programming",
    "graph-theory",
    "topological-sort",
    "medium",
  ]
---

# How to Solve Number of Restricted Paths From First to Last Node

This problem asks us to count the number of "restricted paths" from node 1 to node n in a weighted undirected graph, where a path is restricted if for every consecutive pair of nodes (u, v) along the path, the distance from node v to node n is strictly less than the distance from node u to node n. What makes this problem interesting is that it combines shortest path computation with dynamic programming on a graph, requiring us to understand both Dijkstra's algorithm and topological ordering based on computed distances.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider a graph with n=4 nodes and edges:

- Edge 1: (1, 2, weight=3)
- Edge 2: (1, 3, weight=2)
- Edge 3: (2, 4, weight=1)
- Edge 4: (3, 4, weight=4)

**Step 1: Compute shortest distances from each node to node n (node 4)**
We run Dijkstra's algorithm starting from node 4:

- Distance from node 4 to itself: 0
- From node 4 to node 2: 1 (direct edge)
- From node 4 to node 3: 4 (direct edge)
- From node 4 to node 1: min(1+3=4 via node 2, 4+2=6 via node 3) = 4

So distances are: dist[1]=4, dist[2]=1, dist[3]=4, dist[4]=0

**Step 2: Identify restricted paths**
A path is restricted if for each edge (u→v), dist[v] < dist[u]. Let's check possible paths:

Path 1: 1→2→4

- Check 1→2: dist[2]=1 < dist[1]=4 ✓
- Check 2→4: dist[4]=0 < dist[2]=1 ✓
- This is a restricted path

Path 2: 1→3→4

- Check 1→3: dist[3]=4 < dist[1]=4 ✗ (not strictly less)
- This is NOT a restricted path

Path 3: 1→2→3→4

- Check 1→2: dist[2]=1 < dist[1]=4 ✓
- Check 2→3: dist[3]=4 < dist[2]=1 ✗
- This is NOT a restricted path

So we have exactly 1 restricted path from node 1 to node 4.

**Step 3: Dynamic programming approach**
We can count these paths efficiently by processing nodes in order of decreasing distance to node n:

- Start with node 4: dp[4] = 1 (one way to be at the destination)
- Process node 2 (dist=1): Look at neighbors with larger distances (node 1 with dist=4)
  dp[2] contributes to dp[1]
- Process node 3 (dist=4): Look at neighbors with larger distances (node 1 with dist=4) but dist[3] not < dist[1], so no contribution
- Process node 1 (dist=4): Sum contributions from neighbors with smaller distances (nodes 2 and 3)
  dp[1] = dp[2] + dp[3] = 1 + 0 = 1

This gives us the correct answer: 1 restricted path.

## Brute Force Approach

A naive approach would be to enumerate all possible paths from node 1 to node n and check if each one satisfies the restriction condition. We could use DFS to explore all paths:

1. Start DFS from node 1
2. At each step, only move to neighbors where dist[neighbor] < dist[current]
3. Count how many DFS paths reach node n

The problem with this approach is exponential time complexity. In the worst case (a complete graph), there could be O(n!) paths to check. Even with the restriction condition pruning some branches, this is still far too slow for n up to 2×10⁴ as given in the problem constraints.

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
# Time: O(n!) in worst case | Space: O(n) for recursion depth
def countRestrictedPaths_brute(n, edges):
    # Build adjacency list
    graph = [[] for _ in range(n+1)]
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))

    # Precompute distances from node n to all nodes using Dijkstra
    # (Even brute force needs this to check the restriction)
    import heapq
    dist = [float('inf')] * (n+1)
    dist[n] = 0
    heap = [(0, n)]

    while heap:
        d, node = heapq.heappop(heap)
        if d > dist[node]:
            continue
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))

    # DFS to count all restricted paths
    def dfs(node, visited):
        if node == n:
            return 1

        count = 0
        visited.add(node)
        for neighbor, _ in graph[node]:
            if neighbor not in visited and dist[neighbor] < dist[node]:
                count += dfs(neighbor, visited.copy())
        return count % (10**9 + 7)

    return dfs(1, set())
```

```javascript
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O(n!) in worst case | Space: O(n) for recursion depth
function countRestrictedPathsBrute(n, edges) {
  // Build adjacency list
  const graph = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of edges) {
    graph[u].push([v, w]);
    graph[v].push([u, w]);
  }

  // Precompute distances from node n to all nodes using Dijkstra
  const dist = Array(n + 1).fill(Infinity);
  dist[n] = 0;
  const heap = [[0, n]];

  while (heap.length > 0) {
    const [d, node] = heap.shift();
    if (d > dist[node]) continue;

    for (const [neighbor, weight] of graph[node]) {
      const newDist = d + weight;
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        heap.push([newDist, neighbor]);
        heap.sort((a, b) => a[0] - b[0]);
      }
    }
  }

  // DFS to count all restricted paths
  function dfs(node, visited) {
    if (node === n) return 1;

    let count = 0;
    const newVisited = new Set(visited);
    newVisited.add(node);

    for (const [neighbor, _] of graph[node]) {
      if (!newVisited.has(neighbor) && dist[neighbor] < dist[node]) {
        count = (count + dfs(neighbor, newVisited)) % (10 ** 9 + 7);
      }
    }
    return count;
  }

  return dfs(1, new Set());
}
```

```java
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O(n!) in worst case | Space: O(n) for recursion depth
public int countRestrictedPathsBrute(int n, int[][] edges) {
    // Build adjacency list
    List<int[]>[] graph = new ArrayList[n + 1];
    for (int i = 1; i <= n; i++) graph[i] = new ArrayList<>();
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        graph[u].add(new int[]{v, w});
        graph[v].add(new int[]{u, w});
    }

    // Precompute distances from node n to all nodes using Dijkstra
    int[] dist = new int[n + 1];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[n] = 0;
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    heap.offer(new int[]{0, n});

    while (!heap.isEmpty()) {
        int[] curr = heap.poll();
        int d = curr[0], node = curr[1];
        if (d > dist[node]) continue;

        for (int[] neighborInfo : graph[node]) {
            int neighbor = neighborInfo[0], weight = neighborInfo[1];
            int newDist = d + weight;
            if (newDist < dist[neighbor]) {
                dist[neighbor] = newDist;
                heap.offer(new int[]{newDist, neighbor});
            }
        }
    }

    // DFS to count all restricted paths
    return dfs(1, n, graph, dist, new HashSet<>());
}

private int dfs(int node, int target, List<int[]>[] graph, int[] dist, Set<Integer> visited) {
    if (node == target) return 1;

    int count = 0;
    visited.add(node);

    for (int[] neighborInfo : graph[node]) {
        int neighbor = neighborInfo[0];
        if (!visited.contains(neighbor) && dist[neighbor] < dist[node]) {
            Set<Integer> newVisited = new HashSet<>(visited);
            count = (count + dfs(neighbor, target, graph, dist, newVisited)) % 1000000007;
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we can combine Dijkstra's algorithm with dynamic programming in a clever way:

1. **Compute shortest distances**: First, we need to know dist[node] = shortest distance from node to node n for every node. We run Dijkstra's algorithm starting from node n (not node 1!) because the restriction condition compares distances to node n.

2. **Topological ordering by distance**: The restriction "dist[v] < dist[u]" means we can only move from nodes with larger distances to nodes with smaller distances. This creates a DAG (Directed Acyclic Graph) where edges only go from higher-distance nodes to lower-distance nodes. No cycles are possible because distances must strictly decrease along the path.

3. **Dynamic programming on DAG**: We can process nodes in decreasing order of their distance to node n. For each node u, dp[u] = sum of dp[v] for all neighbors v where dist[v] < dist[u]. This works because by processing nodes in decreasing distance order, when we compute dp[u], all nodes v with smaller distances (that u can reach) have already been computed.

4. **Base case**: dp[n] = 1, since there's exactly one way to be at the destination (do nothing).

The clever part is realizing that the distance values themselves give us a topological ordering. Nodes with larger distances to n must be processed before nodes with smaller distances, because in a restricted path, we always move from higher to lower distances.

## Optimal Solution

Here's the complete optimized solution combining Dijkstra's algorithm with dynamic programming:

<div class="code-group">

```python
# Time: O((E + V) log V) for Dijkstra + O(E) for DP = O((E + V) log V)
# Space: O(V + E) for graph and distance array
def countRestrictedPaths(n, edges):
    MOD = 10**9 + 7

    # Step 1: Build adjacency list for the undirected graph
    graph = [[] for _ in range(n + 1)]
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))

    # Step 2: Run Dijkstra's algorithm from node n to get shortest distances
    # to node n for all nodes
    import heapq
    dist = [float('inf')] * (n + 1)
    dist[n] = 0
    min_heap = [(0, n)]  # (distance, node)

    while min_heap:
        current_dist, node = heapq.heappop(min_heap)

        # Skip if we found a better distance already
        if current_dist > dist[node]:
            continue

        # Explore neighbors
        for neighbor, weight in graph[node]:
            new_dist = current_dist + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(min_heap, (new_dist, neighbor))

    # Step 3: Sort nodes by distance in descending order
    # This gives us topological order for the DAG where edges go from
    # higher distance nodes to lower distance nodes
    nodes_by_dist = list(range(1, n + 1))
    nodes_by_dist.sort(key=lambda x: dist[x], reverse=True)

    # Step 4: Dynamic programming to count restricted paths
    dp = [0] * (n + 1)
    dp[n] = 1  # Base case: one way to be at destination

    # Process nodes in decreasing distance order
    for node in nodes_by_dist:
        # For each neighbor with smaller distance (can be reached in restricted path)
        for neighbor, _ in graph[node]:
            if dist[neighbor] < dist[node]:
                dp[node] = (dp[node] + dp[neighbor]) % MOD

    # The answer is number of restricted paths from node 1 to node n
    return dp[1] % MOD
```

```javascript
// Time: O((E + V) log V) for Dijkstra + O(E) for DP = O((E + V) log V)
// Space: O(V + E) for graph and distance array
function countRestrictedPaths(n, edges) {
  const MOD = 10 ** 9 + 7;

  // Step 1: Build adjacency list for the undirected graph
  const graph = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of edges) {
    graph[u].push([v, w]);
    graph[v].push([u, w]);
  }

  // Step 2: Run Dijkstra's algorithm from node n
  const dist = Array(n + 1).fill(Infinity);
  dist[n] = 0;
  const minHeap = [[0, n]]; // [distance, node]

  while (minHeap.length > 0) {
    const [currentDist, node] = minHeap.shift();

    // Skip if we found a better distance already
    if (currentDist > dist[node]) continue;

    // Explore neighbors
    for (const [neighbor, weight] of graph[node]) {
      const newDist = currentDist + weight;
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        minHeap.push([newDist, neighbor]);
        // Maintain heap property (min-heap)
        minHeap.sort((a, b) => a[0] - b[0]);
      }
    }
  }

  // Step 3: Sort nodes by distance in descending order
  // This gives topological order for the DAG
  const nodesByDist = Array.from({ length: n }, (_, i) => i + 1);
  nodesByDist.sort((a, b) => dist[b] - dist[a]);

  // Step 4: Dynamic programming to count restricted paths
  const dp = Array(n + 1).fill(0);
  dp[n] = 1; // Base case: one way to be at destination

  // Process nodes in decreasing distance order
  for (const node of nodesByDist) {
    // For each neighbor with smaller distance
    for (const [neighbor, _] of graph[node]) {
      if (dist[neighbor] < dist[node]) {
        dp[node] = (dp[node] + dp[neighbor]) % MOD;
      }
    }
  }

  // The answer is number of restricted paths from node 1 to node n
  return dp[1] % MOD;
}
```

```java
// Time: O((E + V) log V) for Dijkstra + O(E) for DP = O((E + V) log V)
// Space: O(V + E) for graph and distance array
public int countRestrictedPaths(int n, int[][] edges) {
    final int MOD = 1000000007;

    // Step 1: Build adjacency list for the undirected graph
    List<int[]>[] graph = new ArrayList[n + 1];
    for (int i = 1; i <= n; i++) graph[i] = new ArrayList<>();
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        graph[u].add(new int[]{v, w});
        graph[v].add(new int[]{u, w});
    }

    // Step 2: Run Dijkstra's algorithm from node n
    int[] dist = new int[n + 1];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[n] = 0;
    PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    minHeap.offer(new int[]{0, n});

    while (!minHeap.isEmpty()) {
        int[] current = minHeap.poll();
        int currentDist = current[0];
        int node = current[1];

        // Skip if we found a better distance already
        if (currentDist > dist[node]) continue;

        // Explore neighbors
        for (int[] neighborInfo : graph[node]) {
            int neighbor = neighborInfo[0];
            int weight = neighborInfo[1];
            int newDist = currentDist + weight;
            if (newDist < dist[neighbor]) {
                dist[neighbor] = newDist;
                minHeap.offer(new int[]{newDist, neighbor});
            }
        }
    }

    // Step 3: Sort nodes by distance in descending order
    // This gives topological order for the DAG
    Integer[] nodesByDist = new Integer[n];
    for (int i = 0; i < n; i++) nodesByDist[i] = i + 1;
    Arrays.sort(nodesByDist, (a, b) -> Integer.compare(dist[b], dist[a]));

    // Step 4: Dynamic programming to count restricted paths
    int[] dp = new int[n + 1];
    dp[n] = 1;  // Base case: one way to be at destination

    // Process nodes in decreasing distance order
    for (int node : nodesByDist) {
        // For each neighbor with smaller distance
        for (int[] neighborInfo : graph[node]) {
            int neighbor = neighborInfo[0];
            if (dist[neighbor] < dist[node]) {
                dp[node] = (dp[node] + dp[neighbor]) % MOD;
            }
        }
    }

    // The answer is number of restricted paths from node 1 to node n
    return dp[1] % MOD;
}
```

</div>

## Complexity Analysis

**Time Complexity: O((E + V) log V)**

- Dijkstra's algorithm using a min-heap takes O((E + V) log V) time, where E is the number of edges and V is the number of vertices (n).
- Sorting the nodes by distance takes O(V log V) time.
- The DP step iterates through all edges once, taking O(E) time.
- Dominated by Dijkstra's O((E + V) log V).

**Space Complexity: O(V + E)**

- The adjacency list representation of the graph uses O(E) space.
- Distance array uses O(V) space.
- DP array uses O(V) space.
- The heap in Dijkstra uses O(V) space in worst case.
- Total: O(V + E).

## Common Mistakes

1. **Running Dijkstra from the wrong starting node**: Candidates often run Dijkstra from node 1 instead of node n. Remember, the restriction compares distances TO node n, so we need dist[node] = distance from node to n, not from 1 to node.

2. **Forgetting the MOD operation**: The problem asks for the answer modulo 10^9+7. Forgetting to apply modulo after each addition can cause integer overflow in languages like Java, or just produce wrong results.

3. **Incorrect topological ordering**: Some candidates try to use BFS/DFS for topological sort without realizing that the distance values themselves provide the ordering. Processing nodes in arbitrary order won't work because dp values might not be computed when needed.

4. **Not handling equal distances correctly**: The restriction requires dist[v] < dist[u] (strictly less). If dist[v] == dist[u], the edge cannot be used in a restricted path. Missing the strict inequality leads to overcounting.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Dijkstra + DP on DAG**: Problems where you need to count paths in a graph with some ordering constraint often use this pattern. The distances computed by Dijkstra create a natural topological ordering.

2. **Graph problems with "monotonic" paths**: Similar to "Number of Ways to Arrive at Destination" (LeetCode 1976), which also counts paths in a weighted graph based on shortest path distances.

3. **Problems with state-dependent transitions**: Like "All Ancestors of a Node in a Directed Acyclic Graph" (LeetCode 2192), where you process nodes in topological order to propagate information.

4. **Design Graph With Shortest Path Calculator** (LeetCode 2642): Both involve Dijkstra's algorithm and understanding of graph shortest paths, though the implementation details differ.

## Key Takeaways

1. **Distance values can create topological orders**: When a problem involves moving only in the direction of decreasing (or increasing) some computed value (like distance), that value naturally orders the nodes for DP.

2. **Combine graph algorithms with DP**: Many medium-to-hard graph problems require combining a graph algorithm (BFS, DFS, Dijkstra) with dynamic programming to count paths or compute aggregates.

3. **Start Dijkstra from the destination when needed**: If you need distances to a particular node (not from a particular node), run Dijkstra starting from that node. This is a common twist that changes which node is the source in the shortest path computation.

Related problems: [All Ancestors of a Node in a Directed Acyclic Graph](/problem/all-ancestors-of-a-node-in-a-directed-acyclic-graph), [Design Graph With Shortest Path Calculator](/problem/design-graph-with-shortest-path-calculator), [Minimum Cost of a Path With Special Roads](/problem/minimum-cost-of-a-path-with-special-roads)
