---
title: "How to Solve Second Minimum Time to Reach Destination — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Second Minimum Time to Reach Destination. Hard difficulty, 62.4% acceptance rate. Topics: Breadth-First Search, Graph Theory, Shortest Path."
date: "2027-08-12"
category: "dsa-patterns"
tags:
  [
    "second-minimum-time-to-reach-destination",
    "breadth-first-search",
    "graph-theory",
    "shortest-path",
    "hard",
  ]
---

# How to Solve Second Minimum Time to Reach Destination

You're given a connected bi-directional graph with `n` nodes labeled 1 to `n` and a time parameter `time` and `change`. Starting from node 1, you need to find the **second minimum time** to reach node `n`. The twist: traffic lights at each node change every `change` minutes, and you can only depart when the light is green. This problem is tricky because you need to track not just the shortest path, but the _second shortest_ path while accounting for waiting times at nodes.

## Visual Walkthrough

Let's trace through a small example: `n = 5`, `edges = [[1,2],[1,3],[1,4],[2,5],[3,5],[4,5]]`, `time = 3`, `change = 5`.

**Graph structure:**

- Node 1 connects to 2, 3, 4
- Nodes 2, 3, 4 all connect to 5

**Traffic light rules:**

- Light cycles: green for `change` minutes, then red for `change` minutes
- At time `t`, if `(t / change) % 2 == 0`, light is green (can depart immediately)
- If red, you must wait until next green cycle

**Step-by-step from node 1 to node 5:**

1. **Time 0 at node 1:** Light is green (0/5 = 0, even). Depart to node 2.
   - Arrive at node 2 at time 3
   - Light at node 2: 3/5 = 0, even → green. Depart immediately to node 5
   - Arrive at node 5 at time 6 → **First minimum time = 6**

2. **Alternative path from node 1:** Time 0, depart to node 3
   - Arrive at node 3 at time 3
   - Light green, depart to node 5
   - Arrive at node 5 at time 6 (same as first path)

3. **Another alternative:** Time 0, depart to node 4
   - Arrive at node 4 at time 3
   - Light green, depart to node 5
   - Arrive at node 5 at time 6 (same again)

All direct 2-hop paths take exactly 6 minutes. But what about longer paths?

4. **Path 1→2→1→5:**
   - Time 0: Depart 1→2, arrive at 3
   - Time 3: Depart 2→1, arrive at 6
   - Time 6: Light at node 1? 6/5 = 1, odd → red! Wait until time 10 (next green)
   - Time 10: Depart 1→5, arrive at 13
   - Total time = 13

5. **Path 1→3→1→5:** Similar calculation gives 13
6. **Path 1→4→1→5:** Also gives 13

The second minimum time is 13 (since 6 appears multiple times but counts as one distinct time value).

## Brute Force Approach

A naive approach would be to enumerate all possible paths from node 1 to node `n`, calculate their travel times (including waiting), collect all distinct times, sort them, and return the second smallest.

Why this fails:

1. **Exponential paths:** In a complete graph, there are factorial many paths
2. **Infinite loops possible:** You could cycle indefinitely
3. **Time calculation complexity:** Each path requires simulating traffic light waits

Even with cycle prevention, the number of reasonable paths grows exponentially with graph size. For `n=1000`, this is computationally impossible.

## Optimized Approach

The key insight: This is a **modified shortest path problem** where we need the _second shortest_ path time, not just the shortest. We can adapt Dijkstra's algorithm to track both the shortest and second shortest distances to each node.

**Core observations:**

1. **Travel time is constant:** Each edge takes exactly `time` minutes to traverse
2. **Waiting only happens at nodes:** The wait time depends on your arrival time modulo `(2 * change)`
3. **BFS/Dijkstra works:** Since edge weights are positive (time + possible wait), we can use a priority queue
4. **Need two distances per node:** Store both minimum and second minimum times

**Step-by-step reasoning:**

1. Use a min-heap (priority queue) to explore nodes in order of arrival time
2. For each node, maintain two values: `min1[node]` and `min2[node]`
3. When we pop a state `(current_time, node)` from the heap:
   - If `current_time` > `min2[node]`, skip (we already found two better/same times)
   - Update `min1` or `min2` for this node appropriately
   - For each neighbor:
     - Calculate departure time: if `(current_time / change) % 2 == 0`, depart immediately; else wait until next green cycle
     - Add edge travel time to get arrival time at neighbor
     - Push to heap if this arrival time improves either `min1` or `min2` at neighbor

**Why BFS/Dijkstra works with constant edge weights?**
Even though edges have constant weight `time`, the waiting times make effective edge weights variable. However, since waiting only increases travel time, and we always explore the smallest times first, the algorithm correctly finds minimum paths.

## Optimal Solution

<div class="code-group">

```python
# Time: O(V + E) where V = n, E = len(edges) - BFS with constant edge weights
# Space: O(V + E) for adjacency list and distance arrays
from collections import deque
import heapq

def secondMinimum(n, edges, time, change):
    """
    Find the second minimum time to travel from node 1 to node n.

    Args:
        n: number of nodes (1-indexed)
        edges: list of [u, v] representing bidirectional edges
        time: time to traverse any edge
        change: traffic light cycle length

    Returns:
        Second minimum time from node 1 to node n
    """
    # Step 1: Build adjacency list
    graph = [[] for _ in range(n + 1)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    # Step 2: Initialize distance arrays
    # dist[node][0] = shortest time to reach node
    # dist[node][1] = second shortest time to reach node
    dist = [[float('inf')] * 2 for _ in range(n + 1)]
    dist[1][0] = 0  # Start at node 1 at time 0

    # Step 3: Min-heap priority queue: (time, node)
    # We'll process nodes in order of arrival time
    heap = [(0, 1)]

    while heap:
        curr_time, node = heapq.heappop(heap)

        # Step 4: Check all neighbors
        for neighbor in graph[node]:
            # Step 5: Calculate departure time considering traffic light
            # Traffic light pattern: green when (t / change) is even
            if (curr_time // change) % 2 == 0:
                # Light is green, can depart immediately
                depart_time = curr_time
            else:
                # Light is red, wait until next green cycle
                # Next green starts at: ((curr_time // change) + 1) * change
                depart_time = ((curr_time // change) + 1) * change

            # Step 6: Calculate arrival time at neighbor
            arrival_time = depart_time + time

            # Step 7: Update distances for neighbor if we found a better time
            if arrival_time < dist[neighbor][0]:
                # New shortest time found
                # Move old shortest to second shortest
                dist[neighbor][1] = dist[neighbor][0]
                dist[neighbor][0] = arrival_time
                heapq.heappush(heap, (arrival_time, neighbor))
            elif dist[neighbor][0] < arrival_time < dist[neighbor][1]:
                # New second shortest time found (different from shortest)
                dist[neighbor][1] = arrival_time
                heapq.heappush(heap, (arrival_time, neighbor))

    # Step 8: Return second minimum time to reach node n
    return dist[n][1]
```

```javascript
// Time: O(V + E) where V = n, E = edges.length - BFS with constant edge weights
// Space: O(V + E) for adjacency list and distance arrays
function secondMinimum(n, edges, time, change) {
  /**
   * Find the second minimum time to travel from node 1 to node n.
   *
   * @param {number} n - number of nodes (1-indexed)
   * @param {number[][]} edges - array of [u, v] representing bidirectional edges
   * @param {number} time - time to traverse any edge
   * @param {number} change - traffic light cycle length
   * @return {number} - second minimum time from node 1 to node n
   */

  // Step 1: Build adjacency list
  const graph = Array.from({ length: n + 1 }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Step 2: Initialize distance arrays
  // dist[node][0] = shortest time to reach node
  // dist[node][1] = second shortest time to reach node
  const dist = Array.from({ length: n + 1 }, () => [Infinity, Infinity]);
  dist[1][0] = 0; // Start at node 1 at time 0

  // Step 3: Min-heap priority queue: [time, node]
  const heap = new MinHeap((a, b) => a[0] - b[0]);
  heap.push([0, 1]);

  while (!heap.isEmpty()) {
    const [currTime, node] = heap.pop();

    // Step 4: Check all neighbors
    for (const neighbor of graph[node]) {
      // Step 5: Calculate departure time considering traffic light
      // Traffic light pattern: green when Math.floor(t / change) is even
      let departTime;
      if (Math.floor(currTime / change) % 2 === 0) {
        // Light is green, can depart immediately
        departTime = currTime;
      } else {
        // Light is red, wait until next green cycle
        // Next green starts at: (Math.floor(currTime / change) + 1) * change
        departTime = (Math.floor(currTime / change) + 1) * change;
      }

      // Step 6: Calculate arrival time at neighbor
      const arrivalTime = departTime + time;

      // Step 7: Update distances for neighbor if we found a better time
      if (arrivalTime < dist[neighbor][0]) {
        // New shortest time found
        // Move old shortest to second shortest
        dist[neighbor][1] = dist[neighbor][0];
        dist[neighbor][0] = arrivalTime;
        heap.push([arrivalTime, neighbor]);
      } else if (arrivalTime > dist[neighbor][0] && arrivalTime < dist[neighbor][1]) {
        // New second shortest time found (different from shortest)
        dist[neighbor][1] = arrivalTime;
        heap.push([arrivalTime, neighbor]);
      }
    }
  }

  // Step 8: Return second minimum time to reach node n
  return dist[n][1];
}

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
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

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
// Time: O(V + E) where V = n, E = edges.length - BFS with constant edge weights
// Space: O(V + E) for adjacency list and distance arrays
import java.util.*;

class Solution {
    public int secondMinimum(int n, int[][] edges, int time, int change) {
        /**
         * Find the second minimum time to travel from node 1 to node n.
         *
         * @param n: number of nodes (1-indexed)
         * @param edges: array of [u, v] representing bidirectional edges
         * @param time: time to traverse any edge
         * @param change: traffic light cycle length
         * @return: second minimum time from node 1 to node n
         */

        // Step 1: Build adjacency list
        List<Integer>[] graph = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Step 2: Initialize distance arrays
        // dist[node][0] = shortest time to reach node
        // dist[node][1] = second shortest time to reach node
        int[][] dist = new int[n + 1][2];
        for (int i = 1; i <= n; i++) {
            dist[i][0] = Integer.MAX_VALUE;
            dist[i][1] = Integer.MAX_VALUE;
        }
        dist[1][0] = 0;  // Start at node 1 at time 0

        // Step 3: Min-heap priority queue: [time, node]
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.offer(new int[]{0, 1});

        while (!heap.isEmpty()) {
            int[] curr = heap.poll();
            int currTime = curr[0];
            int node = curr[1];

            // Step 4: Check all neighbors
            for (int neighbor : graph[node]) {
                // Step 5: Calculate departure time considering traffic light
                // Traffic light pattern: green when (t / change) is even
                int departTime;
                if ((currTime / change) % 2 == 0) {
                    // Light is green, can depart immediately
                    departTime = currTime;
                } else {
                    // Light is red, wait until next green cycle
                    // Next green starts at: ((currTime / change) + 1) * change
                    departTime = ((currTime / change) + 1) * change;
                }

                // Step 6: Calculate arrival time at neighbor
                int arrivalTime = departTime + time;

                // Step 7: Update distances for neighbor if we found a better time
                if (arrivalTime < dist[neighbor][0]) {
                    // New shortest time found
                    // Move old shortest to second shortest
                    dist[neighbor][1] = dist[neighbor][0];
                    dist[neighbor][0] = arrivalTime;
                    heap.offer(new int[]{arrivalTime, neighbor});
                } else if (arrivalTime > dist[neighbor][0] && arrivalTime < dist[neighbor][1]) {
                    // New second shortest time found (different from shortest)
                    dist[neighbor][1] = arrivalTime;
                    heap.offer(new int[]{arrivalTime, neighbor});
                }
            }
        }

        // Step 8: Return second minimum time to reach node n
        return dist[n][1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(V + E)**

- Each node can be processed at most twice (once for shortest time, once for second shortest)
- Each edge is examined at most 4 times (twice from each endpoint)
- The priority queue operations are O(log V) but with constant factors since each node enters at most twice
- In practice, this behaves like BFS with constant edge weights

**Space Complexity: O(V + E)**

- O(V) for distance arrays (2 values per node)
- O(E) for adjacency list representation
- O(V) for priority queue in worst case

## Common Mistakes

1. **Not handling traffic lights correctly:** Forgetting that you can only depart on green lights. The wait calculation `((currTime / change) + 1) * change` is crucial.

2. **Tracking only one distance per node:** This problem requires tracking both shortest and second shortest paths. If you only track one, you'll miss the answer when the second path goes through nodes already visited.

3. **Infinite loops in BFS:** Without proper termination (skipping when `current_time > min2[node]`), the algorithm could run forever exploring worse and worse paths.

4. **Integer division errors:** In Java/C++, ensure you use integer division (`/`) not float division. The traffic light condition uses integer division to determine cycle number.

5. **1-indexed vs 0-indexed confusion:** The problem states nodes are labeled 1 to n inclusive. Many candidates create arrays of size n instead of n+1.

## When You'll See This Pattern

This "second shortest path" pattern appears in several graph problems:

1. **Network Delay Time (LeetCode 743):** Single-source shortest path with weighted edges. This problem extends it by needing the second shortest.

2. **Find the City With the Smallest Number of Neighbors at a Threshold Distance (LeetCode 1334):** All-pairs shortest paths with a distance constraint.

3. **Number of Ways to Arrive at Destination (LeetCode 1976):** Counting shortest paths, which requires tracking multiple distances to nodes.

4. **Cheapest Flights Within K Stops (LeetCode 787):** Constrained shortest path where you need to track distances for different numbers of stops.

The core technique—modifying Dijkstra/BFS to track multiple distance values per node—is useful whenever you need more than just the absolute shortest path.

## Key Takeaways

1. **Modified Dijkstra for k-th shortest paths:** When you need not just the shortest but the k-th shortest path, modify Dijkstra to store k distances per node and process states until you've found k paths to the target.

2. **Constant edge weights with variable delays:** Even when edge traversal time is constant, additional constraints (like traffic lights) can make effective weights variable. The algorithm structure remains the same.

3. **State expansion control:** The key optimization is skipping states when `current_time > min2[node]`. This prevents exponential explosion while guaranteeing we find the first two shortest paths.

4. **Problem decomposition:** Break complex problems into: 1) Graph traversal, 2) Time calculation with constraints, 3) Tracking multiple solutions. Solve each part separately.

**Related problems:** [Network Delay Time](/problem/network-delay-time), [Find the City With the Smallest Number of Neighbors at a Threshold Distance](/problem/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance), [Number of Ways to Arrive at Destination](/problem/number-of-ways-to-arrive-at-destination)
