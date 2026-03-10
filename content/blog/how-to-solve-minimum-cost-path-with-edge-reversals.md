---
title: "How to Solve Minimum Cost Path with Edge Reversals — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Cost Path with Edge Reversals. Medium difficulty, 61.8% acceptance rate. Topics: Graph Theory, Heap (Priority Queue), Shortest Path."
date: "2027-06-07"
category: "dsa-patterns"
tags:
  [
    "minimum-cost-path-with-edge-reversals",
    "graph-theory",
    "heap-(priority-queue)",
    "shortest-path",
    "medium",
  ]
---

# How to Solve Minimum Cost Path with Edge Reversals

You're given a directed, weighted graph where each node has a switch that can reverse all outgoing edges when you arrive at that node. The goal is to find the minimum cost to reach node `n-1` from node `0`. What makes this problem interesting is that edge reversals are local operations that temporarily change the graph's connectivity, requiring us to track not just our position but also which edges have been reversed.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
n = 3
edges = [[0,1,1], [1,2,3], [0,2,10]]
```

We want to go from node 0 to node 2.

**Without using switches:**

- Path 0→1→2 costs 1 + 3 = 4
- Direct path 0→2 costs 10
- Minimum cost without switches: 4

**Using the switch at node 1:**

1. Start at node 0 (cost = 0)
2. Travel 0→1 (cost = 1, total = 1)
3. Arrive at node 1 and flip its switch
   - This reverses edge 1→2 to become 2→1
   - But we're already at node 1, so this doesn't help us reach node 2
4. We're stuck at node 1 with no outgoing edges to node 2

**Using the switch at node 0:**

1. Start at node 0 and flip its switch immediately
   - This reverses edges 0→1 and 0→2
   - Now we have edges 1→0 and 2→0 instead
2. We can't go anywhere useful from node 0 now

The key insight: When we flip a switch at node `u`, we're not just reversing edges from `u`—we're changing whether we can use the original directed edges or their reversed versions. We need to track both our physical location AND which nodes have had their switches flipped.

Let's try a different example where flipping helps:

```
n = 4
edges = [[0,1,1], [1,3,10], [0,2,1], [2,3,10], [1,2,1]]
```

Without flips: 0→1→3 costs 1 + 10 = 11, 0→2→3 costs 1 + 10 = 11
With flip at node 1: 0→1 (cost 1), flip at 1, then 1→2 (now reversed to 2→1 doesn't help), 1→3 (still 10) = 11
Wait, that doesn't help either...

Actually, let me show you the real insight: We need to think of each node as having **two states**—either its switch hasn't been flipped, or it has been flipped. This creates a "state graph" with `2n` nodes: `(node, flipped_status)`.

## Brute Force Approach

A naive approach would be to try all possible combinations of switch flips along all possible paths. Since each of the `n` nodes can either have its switch flipped or not, there are `2^n` possible flip states. For each state, we could run Dijkstra's algorithm to find the shortest path from `0` to `n-1` in the modified graph where edges are reversed according to which nodes have been flipped.

The brute force code would look something like this:

<div class="code-group">

```python
# Brute force - too slow for n > 20
def minCostBruteForce(n, edges):
    min_cost = float('inf')

    # Try all 2^n flip combinations
    for mask in range(1 << n):
        # Build adjacency list for this flip state
        adj = [[] for _ in range(n)]
        for u, v, w in edges:
            # If u is flipped, edge goes from v to u instead
            if (mask >> u) & 1:
                adj[v].append((u, w))
            else:
                adj[u].append((v, w))

        # Run Dijkstra from 0 to n-1
        import heapq
        dist = [float('inf')] * n
        dist[0] = 0
        heap = [(0, 0)]

        while heap:
            cost, node = heapq.heappop(heap)
            if cost > dist[node]:
                continue
            for neighbor, weight in adj[node]:
                new_cost = cost + weight
                if new_cost < dist[neighbor]:
                    dist[neighbor] = new_cost
                    heapq.heappush(heap, (new_cost, neighbor))

        min_cost = min(min_cost, dist[n-1])

    return min_cost if min_cost != float('inf') else -1
```

```javascript
// Brute force - exponential time
function minCostBruteForce(n, edges) {
  let minCost = Infinity;

  // Try all 2^n flip combinations
  for (let mask = 0; mask < 1 << n; mask++) {
    // Build adjacency list for this flip state
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) {
      // If u is flipped, edge goes from v to u instead
      if ((mask >> u) & 1) {
        adj[v].push([u, w]);
      } else {
        adj[u].push([v, w]);
      }
    }

    // Run Dijkstra from 0 to n-1
    const dist = Array(n).fill(Infinity);
    dist[0] = 0;
    const heap = [[0, 0]];

    while (heap.length > 0) {
      const [cost, node] = heap.shift();
      if (cost > dist[node]) continue;
      for (const [neighbor, weight] of adj[node]) {
        const newCost = cost + weight;
        if (newCost < dist[neighbor]) {
          dist[neighbor] = newCost;
          heap.push([newCost, neighbor]);
          heap.sort((a, b) => a[0] - b[0]);
        }
      }
    }

    minCost = Math.min(minCost, dist[n - 1]);
  }

  return minCost !== Infinity ? minCost : -1;
}
```

```java
// Brute force - not feasible for large n
public int minCostBruteForce(int n, int[][] edges) {
    int minCost = Integer.MAX_VALUE;

    // Try all 2^n flip combinations
    for (int mask = 0; mask < (1 << n); mask++) {
        // Build adjacency list for this flip state
        List<int[]>[] adj = new List[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            // If u is flipped, edge goes from v to u instead
            if (((mask >> u) & 1) == 1) {
                adj[v].add(new int[]{u, w});
            } else {
                adj[u].add(new int[]{v, w});
            }
        }

        // Run Dijkstra from 0 to n-1
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[0] = 0;
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.offer(new int[]{0, 0});

        while (!heap.isEmpty()) {
            int[] curr = heap.poll();
            int cost = curr[0], node = curr[1];
            if (cost > dist[node]) continue;
            for (int[] neighbor : adj[node]) {
                int nextNode = neighbor[0], weight = neighbor[1];
                int newCost = cost + weight;
                if (newCost < dist[nextNode]) {
                    dist[nextNode] = newCost;
                    heap.offer(new int[]{newCost, nextNode});
                }
            }
        }

        if (dist[n-1] < minCost) {
            minCost = dist[n-1];
        }
    }

    return minCost != Integer.MAX_VALUE ? minCost : -1;
}
```

</div>

**Why this is too slow:** With `2^n` possible flip states and `O(E log V)` for Dijkstra each time, the total complexity is `O(2^n * E log V)`. For `n = 100`, `2^100` is astronomically large—completely infeasible.

## Optimized Approach

The key insight is that we don't need to try all flip combinations separately. Instead, we can think of each physical node as having **two states**:

- State 0: The node's switch hasn't been flipped
- State 1: The node's switch has been flipped

This creates an expanded graph with `2n` nodes: `(physical_node, flip_state)`.

**How transitions work:**

1. **Travel along an edge**: If we're at `(u, flip_state_u)` and want to travel `u→v` with weight `w`:
   - If `flip_state_u = 0` (switch not flipped), we can use the original edge `u→v`
   - If `flip_state_u = 1` (switch flipped), the edge is reversed, so we can only travel `v→u`
   - After traveling, we arrive at `v` with whatever flip state `v` already has

2. **Flip a switch**: When we arrive at a node `u`, we can choose to flip its switch (if we haven't already). This takes us from state `(u, 0)` to `(u, 1)` with cost 0 (flipping is free).

**The goal**: Find the minimum cost to reach either `(n-1, 0)` or `(n-1, 1)` starting from `(0, 0)`.

This is now a standard shortest path problem on a graph with `2n` nodes and at most `2E + n` edges (original edges in both directions plus flip transitions).

## Optimal Solution

We can solve this using Dijkstra's algorithm on the expanded state graph. Here's the complete solution:

<div class="code-group">

```python
# Time: O((E + n) * log(2n)) = O(E log n) | Space: O(E + n)
def minCost(n, edges):
    """
    Find minimum cost to reach node n-1 from node 0 with optional edge reversals.

    Args:
        n: Number of nodes
        edges: List of [u, v, w] representing directed edge u->v with weight w

    Returns:
        Minimum cost or -1 if unreachable
    """
    # Build adjacency list for the original graph
    # We need to know both outgoing and potential incoming edges (after reversal)
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))

    # dist[node][state] = min cost to reach node with given flip state
    # state 0 = switch not flipped, state 1 = switch flipped
    dist = [[float('inf')] * 2 for _ in range(n)]
    dist[0][0] = 0  # Start at node 0 with switch not flipped

    # Min-heap: (cost, node, flip_state)
    import heapq
    heap = [(0, 0, 0)]  # (cost, node, state)

    while heap:
        cost, node, state = heapq.heappop(heap)

        # Skip if we found a better path already
        if cost > dist[node][state]:
            continue

        # If we reached the target node in either state, return the cost
        if node == n - 1:
            return cost

        # Option 1: Flip the switch at current node (if not already flipped)
        if state == 0:  # Can only flip if not already flipped
            if cost < dist[node][1]:
                dist[node][1] = cost
                heapq.heappush(heap, (cost, node, 1))

        # Option 2: Travel along edges
        # If state == 0: use original outgoing edges
        # If state == 1: edges are reversed, so we can travel along incoming edges
        if state == 0:
            # Travel along original outgoing edges
            for neighbor, weight in adj[node]:
                new_cost = cost + weight
                if new_cost < dist[neighbor][0]:  # Arrive with neighbor's state unchanged
                    dist[neighbor][0] = new_cost
                    heapq.heappush(heap, (new_cost, neighbor, 0))
        else:  # state == 1
            # When switch is flipped, we can travel along reversed edges
            # This means we can go from node to any u where there's an edge u->node
            # We need to check all nodes to find edges pointing to current node
            for u in range(n):
                for v, w in adj[u]:
                    if v == node:  # Found edge u->node that becomes node->u when flipped
                        new_cost = cost + w
                        if new_cost < dist[u][1]:  # Arrive at u with its state unchanged
                            dist[u][1] = new_cost
                            heapq.heappush(heap, (new_cost, u, 1))

    # If we exhaust the heap without reaching n-1, it's unreachable
    return -1
```

```javascript
// Time: O((E + n) * log(2n)) = O(E log n) | Space: O(E + n)
function minCost(n, edges) {
  // Build adjacency list for the original graph
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
  }

  // dist[node][state] = min cost to reach node with given flip state
  // state 0 = switch not flipped, state 1 = switch flipped
  const dist = Array.from({ length: n }, () => [Infinity, Infinity]);
  dist[0][0] = 0; // Start at node 0 with switch not flipped

  // Min-heap: [cost, node, flip_state]
  const heap = [[0, 0, 0]];

  while (heap.length > 0) {
    heap.sort((a, b) => a[0] - b[0]); // Simple sort for min-heap
    const [cost, node, state] = heap.shift();

    // Skip if we found a better path already
    if (cost > dist[node][state]) continue;

    // If we reached the target node in either state, return the cost
    if (node === n - 1) return cost;

    // Option 1: Flip the switch at current node (if not already flipped)
    if (state === 0) {
      // Can only flip if not already flipped
      if (cost < dist[node][1]) {
        dist[node][1] = cost;
        heap.push([cost, node, 1]);
      }
    }

    // Option 2: Travel along edges
    if (state === 0) {
      // Travel along original outgoing edges
      for (const [neighbor, weight] of adj[node]) {
        const newCost = cost + weight;
        if (newCost < dist[neighbor][0]) {
          dist[neighbor][0] = newCost;
          heap.push([newCost, neighbor, 0]);
        }
      }
    } else {
      // state === 1
      // When switch is flipped, we can travel along reversed edges
      // This means we can go from node to any u where there's an edge u->node
      for (let u = 0; u < n; u++) {
        for (const [v, w] of adj[u]) {
          if (v === node) {
            // Found edge u->node that becomes node->u when flipped
            const newCost = cost + w;
            if (newCost < dist[u][1]) {
              dist[u][1] = newCost;
              heap.push([newCost, u, 1]);
            }
          }
        }
      }
    }
  }

  // If we exhaust the heap without reaching n-1, it's unreachable
  return -1;
}
```

```java
// Time: O((E + n) * log(2n)) = O(E log n) | Space: O(E + n)
public int minCost(int n, int[][] edges) {
    // Build adjacency list for the original graph
    List<int[]>[] adj = new List[n];
    for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        adj[u].add(new int[]{v, w});
    }

    // dist[node][state] = min cost to reach node with given flip state
    // state 0 = switch not flipped, state 1 = switch flipped
    int[][] dist = new int[n][2];
    for (int i = 0; i < n; i++) {
        Arrays.fill(dist[i], Integer.MAX_VALUE);
    }
    dist[0][0] = 0;  // Start at node 0 with switch not flipped

    // Min-heap: (cost, node, flip_state)
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    heap.offer(new int[]{0, 0, 0});

    while (!heap.isEmpty()) {
        int[] curr = heap.poll();
        int cost = curr[0], node = curr[1], state = curr[2];

        // Skip if we found a better path already
        if (cost > dist[node][state]) continue;

        // If we reached the target node in either state, return the cost
        if (node == n - 1) return cost;

        // Option 1: Flip the switch at current node (if not already flipped)
        if (state == 0) {  // Can only flip if not already flipped
            if (cost < dist[node][1]) {
                dist[node][1] = cost;
                heap.offer(new int[]{cost, node, 1});
            }
        }

        // Option 2: Travel along edges
        if (state == 0) {
            // Travel along original outgoing edges
            for (int[] neighbor : adj[node]) {
                int nextNode = neighbor[0], weight = neighbor[1];
                int newCost = cost + weight;
                if (newCost < dist[nextNode][0]) {
                    dist[nextNode][0] = newCost;
                    heap.offer(new int[]{newCost, nextNode, 0});
                }
            }
        } else {  // state == 1
            // When switch is flipped, we can travel along reversed edges
            // This means we can go from node to any u where there's an edge u->node
            for (int u = 0; u < n; u++) {
                for (int[] edge : adj[u]) {
                    int v = edge[0], w = edge[1];
                    if (v == node) {  // Found edge u->node that becomes node->u when flipped
                        int newCost = cost + w;
                        if (newCost < dist[u][1]) {
                            dist[u][1] = newCost;
                            heap.offer(new int[]{newCost, u, 1});
                        }
                    }
                }
            }
        }
    }

    // If we exhaust the heap without reaching n-1, it's unreachable
    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O((E + n) * log(2n)) = O(E log n)`

- We have `2n` states in our expanded graph
- Each edge in the original graph creates up to 2 transitions in the state graph
- Each node has a flip transition (state 0 → state 1)
- Dijkstra's algorithm runs in `O((V + E) log V)` where `V = 2n` and `E ≤ 2E_original + n`
- In practice, this simplifies to `O(E log n)` where `E` is the number of original edges

**Space Complexity:** `O(E + n)`

- We store the adjacency list: `O(E)`
- We store distance array for `2n` states: `O(n)`
- The priority queue can hold up to `O(E + n)` elements

## Common Mistakes

1. **Not tracking flip states separately for each node**: Candidates might try to track a single global flip state or use a bitmask, which leads to exponential state space. The key is realizing each node's flip state is independent.

2. **Incorrect edge reversal logic**: When a node is flipped, it doesn't reverse ALL edges in the graph—only its outgoing edges. A common mistake is to reverse edges globally or to reverse incoming edges as well.

3. **Forgetting that flipping is free**: The switch flip operation costs 0, but some candidates add an arbitrary cost or forget to include this transition altogether.

4. **Inefficient handling of reversed edges**: In the state=1 case, naively checking all nodes for edges pointing to the current node gives `O(n)` per operation. While acceptable for the problem constraints, a more optimized approach would precompute reverse adjacency lists.

## When You'll See This Pattern

This "state expansion" technique appears in many shortest path problems where you need to track additional information beyond just node position:

1. **Cheapest Flights Within K Stops** (LeetCode 787): Track both city and number of stops used so far as state `(city, stops_used)`.

2. **Minimum Cost to Reach Destination in Time** (LeetCode 1928): Track both city and time spent as state `(city, time)`.

3. **Shortest Path Visiting All Nodes** (LeetCode 847): Track both current node and bitmask of visited nodes as state `(node, mask)`.

The pattern is: when you have constraints or additional decisions that affect future moves, expand your graph to include those decisions as part of the state.

## Key Takeaways

1. **State expansion transforms complex constraints into standard shortest path**: When you have decisions that affect future moves (like flipping switches), create a new graph where each state includes both position AND decision history.

2. **Dijkstra works on any graph with non-negative weights**: The expanded state graph might be larger but still works with standard shortest path algorithms.

3. **Think about independence of decisions**: Each node's flip decision only affects its outgoing edges, not the entire graph. This local effect is what makes the `2n` state space possible instead of `2^n`.

Related problems: [Minimum Cost to Reach Destination in Time](/problem/minimum-cost-to-reach-destination-in-time)
