---
title: "How to Solve Minimum Cost to Reach Destination in Time — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Reach Destination in Time. Hard difficulty, 41.2% acceptance rate. Topics: Array, Dynamic Programming, Graph Theory."
date: "2029-01-23"
category: "dsa-patterns"
tags:
  [
    "minimum-cost-to-reach-destination-in-time",
    "array",
    "dynamic-programming",
    "graph-theory",
    "hard",
  ]
---

# How to Solve Minimum Cost to Reach Destination in Time

You're given a country with `n` cities connected by roads, each with a travel time. You need to travel from city 0 to city n-1 within a maximum time limit `maxTime`, but there's a twist: passing through each city costs money, and you want to minimize the total cost while arriving on time. This problem is tricky because it combines shortest path finding with a time constraint and cost optimization—you can't just use Dijkstra's algorithm for the shortest time, nor can you ignore the time limit while minimizing cost.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

```
n = 4
edges = [[0,1,10],[1,2,10],[2,3,10],[0,2,5],[2,1,2],[1,3,20]]
passingFees = [5,1,3,10]
maxTime = 30
```

We need to get from city 0 to city 3 while minimizing cost (sum of passingFees for visited cities) and arriving within 30 minutes.

**Possible paths:**

1. 0 → 1 → 2 → 3: Time = 10 + 10 + 10 = 30, Cost = 5 + 1 + 3 + 10 = 19
2. 0 → 2 → 3: Time = 5 + 10 = 15, Cost = 5 + 3 + 10 = 18
3. 0 → 2 → 1 → 3: Time = 5 + 2 + 20 = 27, Cost = 5 + 3 + 1 + 10 = 19
4. 0 → 1 → 3: Time = 10 + 20 = 30, Cost = 5 + 1 + 10 = 16

The optimal path is 0 → 1 → 3 with cost 16 and time exactly 30. Notice that:

- The cheapest path (0 → 1 → 3) isn't the fastest
- The fastest path (0 → 2 → 3) isn't the cheapest
- We need to consider both time and cost simultaneously

## Brute Force Approach

A naive approach would be to explore all possible paths from city 0 to city n-1, calculate their total time and cost, and pick the minimum cost path that satisfies the time constraint. We could use DFS to explore all routes.

**Why this fails:**

1. **Exponential time complexity:** With n cities, there could be exponentially many paths (especially in complete graphs)
2. **Repeated computation:** We might visit the same city multiple times via different routes, recalculating costs unnecessarily
3. **No pruning:** Even if we find a path to a city that's both slower AND more expensive than another path, we'd still explore it

The brute force approach would have O(n!) worst-case time complexity, which is completely impractical for n up to 1000 as in the problem constraints.

## Optimized Approach

The key insight is that this is a **constrained shortest path problem**. We need to find the minimum cost path subject to a time constraint. This suggests using **Dynamic Programming with Dijkstra's algorithm**.

**Step-by-step reasoning:**

1. **State definition:** We need to track both the city we're at AND the time spent so far. Let `dp[city][time]` = minimum cost to reach `city` using exactly `time` minutes.
2. **State transition:** If we're at city `u` with time `t`, we can go to neighbor `v` with road time `w`, updating: `dp[v][t + w] = min(dp[v][t + w], dp[u][t] + passingFees[v])`
3. **Optimization:** We don't need to track ALL possible times up to maxTime for every city. Instead, for each city, we only need to track the minimum cost for each time we've actually reached it.
4. **Priority queue:** We use Dijkstra's algorithm but with a 2D state (city, time). At each step, we expand the state with the minimum cost.
5. **Early termination:** We can stop when we reach city n-1, as Dijkstra guarantees the first time we pop it from the queue is with minimum cost.

**Why Dijkstra works here:**
Even though we're optimizing for cost (not time), Dijkstra's algorithm works because we're using a min-heap prioritized by cost. When we pop a state (city, time) from the heap, we know we've found the minimum cost to reach that city with that exact time.

## Optimal Solution

We'll implement a modified Dijkstra's algorithm where each state is (cost, city, time). We prioritize by cost to ensure we always expand the cheapest path first.

<div class="code-group">

```python
# Time: O(E * maxTime) where E is number of edges
# Space: O(n * maxTime) for the dp table
class Solution:
    def minCost(self, maxTime: int, edges: List[List[int]], passingFees: List[int]) -> int:
        n = len(passingFees)

        # Build adjacency list for the graph
        graph = [[] for _ in range(n)]
        for u, v, t in edges:
            graph[u].append((v, t))
            graph[v].append((u, t))

        # dp[city][time] = minimum cost to reach city with exactly time minutes
        # Initialize with infinity
        dp = [[float('inf')] * (maxTime + 1) for _ in range(n)]

        # Start at city 0 with time 0 and cost = passingFees[0]
        dp[0][0] = passingFees[0]

        # Min-heap: (cost, city, time)
        heap = [(passingFees[0], 0, 0)]

        while heap:
            cost, city, time = heapq.heappop(heap)

            # If this isn't the best cost for this (city, time) state, skip it
            if cost > dp[city][time]:
                continue

            # If we reached the destination, return the cost
            # Dijkstra guarantees this is the minimum cost when we first pop destination
            if city == n - 1:
                return cost

            # Explore neighbors
            for neighbor, travel_time in graph[city]:
                new_time = time + travel_time

                # Check if we'd exceed maxTime
                if new_time > maxTime:
                    continue

                # Calculate new cost: current cost + fee for the neighbor city
                new_cost = cost + passingFees[neighbor]

                # If we found a better cost for reaching neighbor with new_time
                if new_cost < dp[neighbor][new_time]:
                    dp[neighbor][new_time] = new_cost
                    heapq.heappush(heap, (new_cost, neighbor, new_time))

        # If we exhaust all possibilities without reaching destination
        return -1
```

```javascript
// Time: O(E * maxTime) where E is number of edges
// Space: O(n * maxTime) for the dp table
var minCost = function (maxTime, edges, passingFees) {
  const n = passingFees.length;

  // Build adjacency list for the graph
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, t] of edges) {
    graph[u].push([v, t]);
    graph[v].push([u, t]);
  }

  // dp[city][time] = minimum cost to reach city with exactly time minutes
  // Initialize with Infinity
  const dp = Array.from({ length: n }, () => Array(maxTime + 1).fill(Infinity));

  // Start at city 0 with time 0 and cost = passingFees[0]
  dp[0][0] = passingFees[0];

  // Min-heap: [cost, city, time]
  const heap = new MinHeap((a, b) => a[0] - b[0]);
  heap.push([passingFees[0], 0, 0]);

  while (!heap.isEmpty()) {
    const [cost, city, time] = heap.pop();

    // If this isn't the best cost for this (city, time) state, skip it
    if (cost > dp[city][time]) {
      continue;
    }

    // If we reached the destination, return the cost
    if (city === n - 1) {
      return cost;
    }

    // Explore neighbors
    for (const [neighbor, travelTime] of graph[city]) {
      const newTime = time + travelTime;

      // Check if we'd exceed maxTime
      if (newTime > maxTime) {
        continue;
      }

      // Calculate new cost
      const newCost = cost + passingFees[neighbor];

      // If we found a better cost
      if (newCost < dp[neighbor][newTime]) {
        dp[neighbor][newTime] = newCost;
        heap.push([newCost, neighbor, newTime]);
      }
    }
  }

  // If we exhaust all possibilities without reaching destination
  return -1;
};

// MinHeap implementation for JavaScript
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return root;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  bubbleDown(index) {
    const last = this.heap.length - 1;
    while (true) {
      let left = index * 2 + 1;
      let right = index * 2 + 2;
      let smallest = index;

      if (left <= last && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right <= last && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
```

```java
// Time: O(E * maxTime) where E is number of edges
// Space: O(n * maxTime) for the dp table
class Solution {
    public int minCost(int maxTime, int[][] edges, int[] passingFees) {
        int n = passingFees.length;

        // Build adjacency list
        List<int[]>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], t = edge[2];
            graph[u].add(new int[]{v, t});
            graph[v].add(new int[]{u, t});
        }

        // dp[city][time] = minimum cost to reach city with exactly time minutes
        int[][] dp = new int[n][maxTime + 1];
        for (int i = 0; i < n; i++) {
            Arrays.fill(dp[i], Integer.MAX_VALUE);
        }
        dp[0][0] = passingFees[0];

        // Min-heap: (cost, city, time)
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.offer(new int[]{passingFees[0], 0, 0});

        while (!heap.isEmpty()) {
            int[] current = heap.poll();
            int cost = current[0];
            int city = current[1];
            int time = current[2];

            // Skip if not the best cost for this state
            if (cost > dp[city][time]) {
                continue;
            }

            // Return if reached destination
            if (city == n - 1) {
                return cost;
            }

            // Explore neighbors
            for (int[] neighborInfo : graph[city]) {
                int neighbor = neighborInfo[0];
                int travelTime = neighborInfo[1];
                int newTime = time + travelTime;

                // Check time constraint
                if (newTime > maxTime) {
                    continue;
                }

                int newCost = cost + passingFees[neighbor];

                // Update if found better cost
                if (newCost < dp[neighbor][newTime]) {
                    dp[neighbor][newTime] = newCost;
                    heap.offer(new int[]{newCost, neighbor, newTime});
                }
            }
        }

        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(E × maxTime)

- We process each edge potentially multiple times, but for each edge traversal, we consider all possible times up to maxTime
- In practice, we don't explore all time values for every edge—only those that lead to better costs
- The heap operations add O(log(E × maxTime)) factor, but this is dominated by the O(E × maxTime) states

**Space Complexity:** O(n × maxTime + E)

- The DP table takes O(n × maxTime) space
- The adjacency list takes O(E) space
- The heap can contain up to O(E × maxTime) elements in worst case

## Common Mistakes

1. **Using standard Dijkstra for time only:** Candidates often try to find the shortest time path first, then check if it's within maxTime. This misses cases where a slightly slower path is much cheaper and still within the time limit.

2. **Forgetting to include the starting city's fee:** The cost includes passingFees[0] for the starting city. Many candidates only add fees when arriving at new cities.

3. **Not pruning suboptimal states:** If you reach the same city with the same time but higher cost, you must skip further exploration. Without this check, the algorithm becomes exponential.

4. **Using BFS instead of Dijkstra:** BFS would explore all paths level by level, but we need to prioritize by cost to ensure we find the minimum cost path first.

## When You'll See This Pattern

This constrained shortest path pattern appears in problems where you need to optimize one metric (cost) subject to a constraint on another metric (time):

1. **Cheapest Flights Within K Stops (LeetCode 787):** Find cheapest flight with at most K stops—similar to having a "stop count" constraint instead of time constraint.

2. **Minimum Cost to Reach Destination With Discounts (LeetCode 2093):** Another variation with discounts applied after certain distances.

3. **Maximum Cost of Trip With K Highways (LeetCode 2247):** Maximize cost (instead of minimize) with a constraint on number of highways.

The core technique is **Dijkstra with multi-dimensional states**—each state tracks both the node and the constrained resource (time, stops, etc.).

## Key Takeaways

1. **Multi-dimensional Dijkstra:** When you need to optimize one metric subject to a constraint on another, extend your state to include both metrics. Use (cost, node, constraint_value) as your heap elements.

2. **DP for constraint tracking:** The constraint (time, stops, etc.) often has limited range, making DP feasible. Store dp[node][constraint_value] = best_metric_value.

3. **Early termination is safe:** With Dijkstra prioritized by the metric you're optimizing (cost), the first time you pop the destination from the heap gives the optimal solution.

**Related problems:** [Maximum Cost of Trip With K Highways](/problem/maximum-cost-of-trip-with-k-highways), [Maximum Path Quality of a Graph](/problem/maximum-path-quality-of-a-graph), [Minimum Cost to Reach City With Discounts](/problem/minimum-cost-to-reach-city-with-discounts)
