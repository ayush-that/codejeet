---
title: "How to Solve Number of Ways to Arrive at Destination — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Ways to Arrive at Destination. Medium difficulty, 37.3% acceptance rate. Topics: Dynamic Programming, Graph Theory, Topological Sort, Shortest Path."
date: "2028-05-18"
category: "dsa-patterns"
tags:
  [
    "number-of-ways-to-arrive-at-destination",
    "dynamic-programming",
    "graph-theory",
    "topological-sort",
    "medium",
  ]
---

# How to Solve Number of Ways to Arrive at Destination

You're given a weighted, undirected graph representing a city's road network, and you need to count the number of ways to reach the destination intersection (n-1) from the start (0) in **minimum time**. The challenge is that you can't just count all paths — you must only count paths that achieve the shortest possible travel time. This makes it a combination of shortest path finding and path counting, which requires careful coordination between Dijkstra's algorithm and dynamic programming.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have 4 intersections (0-3) with these roads:

- 0 → 1: time = 2
- 0 → 2: time = 3
- 1 → 3: time = 1
- 2 → 3: time = 1
- 1 → 2: time = 1

We want to count the number of ways to reach intersection 3 from 0 in minimum time.

**Step 1: Find shortest distances**
Using Dijkstra's algorithm:

- Start at 0: dist[0] = 0
- Process 0: Update neighbors:
  - dist[1] = 2 (via 0→1)
  - dist[2] = 3 (via 0→2)
- Process 1 (smallest unvisited): dist[1] = 2
  - Update neighbor 3: dist[3] = 3 (via 0→1→3)
  - Update neighbor 2: dist[2] = 3 (via 0→1→2) — same as existing
- Process 2: dist[2] = 3
  - Update neighbor 3: dist[3] = 4 (via 0→2→3) — longer than existing 3, so ignore
- Process 3: done

Shortest distance to 3 is 3.

**Step 2: Count ways along shortest paths**
We need to count only paths that achieve distance 3 to node 3:

- Ways[0] = 1 (starting point)
- Check each edge to see if it contributes to a shortest path:
  - Edge 0→1: dist[0] + time = 0 + 2 = 2 = dist[1] ✓ Add ways[1] += ways[0] = 1
  - Edge 0→2: 0 + 3 = 3 = dist[2] ✓ Add ways[2] += ways[0] = 1
  - Edge 1→3: dist[1] + 1 = 2 + 1 = 3 = dist[3] ✓ Add ways[3] += ways[1] = 1
  - Edge 1→2: dist[1] + 1 = 2 + 1 = 3 = dist[2] ✓ Add ways[2] += ways[1] = 1 (now ways[2] = 2)
  - Edge 2→3: dist[2] + 1 = 3 + 1 = 4 > dist[3] ✗ Skip (not shortest path)

Final ways[3] = 1. Only one shortest path: 0→1→3.

The key insight: an edge (u→v) contributes to a shortest path to v if dist[u] + time = dist[v].

## Brute Force Approach

A naive approach would be to generate all possible paths from 0 to n-1, calculate each path's total time, find the minimum time among them, and count how many paths achieve that minimum. This typically involves DFS or BFS exploring all paths.

**Why it fails:**

1. **Exponential time complexity:** In the worst case (complete graph), there are (n-2)! possible paths from 0 to n-1, which is astronomically large.
2. **Redundant computation:** The same subpaths are computed repeatedly.
3. **The problem constraints:** n can be up to 200, making brute force completely infeasible.

Even with memoization, we'd still need to explore all paths, which is too slow. We need a smarter approach that leverages the structure of shortest paths.

## Optimized Approach

The key insight is that **for any node v, all shortest paths to v must arrive through edges where dist[u] + time(u,v) = dist[v]**. This gives us a directed acyclic graph (DAG) of shortest paths, even though the original graph is undirected.

**Step-by-step reasoning:**

1. **Find shortest distances:** Use Dijkstra's algorithm to compute min distance from node 0 to every other node. This gives us dist[] array.
2. **Build shortest path DAG:** Create a new graph containing only edges (u→v) where dist[u] + time(u,v) = dist[v]. These are the edges that can be part of shortest paths.
3. **Count ways with DP:** Since the shortest path graph is a DAG (no cycles in shortest paths), we can use topological order to count ways:
   - ways[0] = 1 (one way to be at start)
   - For each node in topological order, add its ways count to all neighbors in the shortest path DAG
   - ways[v] = sum(ways[u]) for all u where dist[u] + time(u,v) = dist[v]

**Optimization:** We don't need to explicitly build the DAG or find topological order. We can process nodes in increasing order of distance (which Dijkstra already gives us) and update counts as we discover shortest paths.

## Optimal Solution

We'll combine Dijkstra's algorithm with dynamic programming in a single pass. As we process each node with Dijkstra, we update the ways count for its neighbors.

<div class="code-group">

```python
# Time: O(E log V) where E = number of roads, V = number of intersections
# Space: O(V + E) for adjacency list and data structures
import heapq
from collections import defaultdict

def countPaths(n, roads):
    """
    Count the number of ways to reach destination (n-1) from start (0)
    in minimum time through the road network.

    Args:
        n: number of intersections (nodes)
        roads: list of [u, v, time] representing bidirectional roads
    Returns:
        Number of ways modulo 10^9 + 7
    """
    MOD = 10**9 + 7

    # Step 1: Build adjacency list for the graph
    # Each entry: {neighbor: time}
    graph = defaultdict(list)
    for u, v, time in roads:
        graph[u].append((v, time))
        graph[v].append((u, time))  # bidirectional

    # Step 2: Initialize data structures
    # dist[i] = minimum time to reach intersection i from 0
    dist = [float('inf')] * n
    dist[0] = 0

    # ways[i] = number of ways to reach intersection i in minimum time
    ways = [0] * n
    ways[0] = 1  # one way to be at start

    # Min-heap for Dijkstra: (distance, node)
    heap = [(0, 0)]  # start at node 0 with distance 0

    # Step 3: Dijkstra's algorithm with ways counting
    while heap:
        current_dist, node = heapq.heappop(heap)

        # Skip if we found a better path to this node already
        if current_dist > dist[node]:
            continue

        # Step 4: Explore neighbors
        for neighbor, time in graph[node]:
            # Calculate new distance through current node
            new_dist = current_dist + time

            # Case 1: Found a shorter path to neighbor
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                ways[neighbor] = ways[node]  # reset ways to current node's ways
                heapq.heappush(heap, (new_dist, neighbor))

            # Case 2: Found another shortest path to neighbor
            elif new_dist == dist[neighbor]:
                # Add current node's ways to neighbor's ways
                ways[neighbor] = (ways[neighbor] + ways[node]) % MOD

    # Step 5: Return number of ways to reach destination
    return ways[n-1] % MOD
```

```javascript
// Time: O(E log V) where E = number of roads, V = number of intersections
// Space: O(V + E) for adjacency list and data structures

/**
 * Count the number of ways to reach destination (n-1) from start (0)
 * in minimum time through the road network.
 * @param {number} n - number of intersections (nodes)
 * @param {number[][]} roads - array of [u, v, time] representing bidirectional roads
 * @return {number} - Number of ways modulo 10^9 + 7
 */
var countPaths = function (n, roads) {
  const MOD = 10 ** 9 + 7;

  // Step 1: Build adjacency list for the graph
  // graph[u] = [{neighbor: v, time: t}, ...]
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, time] of roads) {
    graph[u].push([v, time]);
    graph[v].push([u, time]); // bidirectional
  }

  // Step 2: Initialize data structures
  // dist[i] = minimum time to reach intersection i from 0
  const dist = Array(n).fill(Infinity);
  dist[0] = 0;

  // ways[i] = number of ways to reach intersection i in minimum time
  const ways = Array(n).fill(0);
  ways[0] = 1; // one way to be at start

  // Min-heap for Dijkstra: [distance, node]
  const heap = new MinHeap();
  heap.push([0, 0]);

  // Step 3: Dijkstra's algorithm with ways counting
  while (!heap.isEmpty()) {
    const [currentDist, node] = heap.pop();

    // Skip if we found a better path to this node already
    if (currentDist > dist[node]) {
      continue;
    }

    // Step 4: Explore neighbors
    for (const [neighbor, time] of graph[node]) {
      // Calculate new distance through current node
      const newDist = currentDist + time;

      // Case 1: Found a shorter path to neighbor
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        ways[neighbor] = ways[node]; // reset ways to current node's ways
        heap.push([newDist, neighbor]);
      }
      // Case 2: Found another shortest path to neighbor
      else if (newDist === dist[neighbor]) {
        // Add current node's ways to neighbor's ways
        ways[neighbor] = (ways[neighbor] + ways[node]) % MOD;
      }
    }
  }

  // Step 5: Return number of ways to reach destination
  return ways[n - 1] % MOD;
};

// MinHeap implementation for Dijkstra
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element[0] >= parent[0]) break;
      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];
    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild[0] < element[0]) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild[0] < element[0]) ||
          (swap !== null && rightChild[0] < leftChild[0])
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      this.heap[swap] = element;
      index = swap;
    }
  }
}
```

```java
// Time: O(E log V) where E = number of roads, V = number of intersections
// Space: O(V + E) for adjacency list and data structures

import java.util.*;

class Solution {
    public int countPaths(int n, int[][] roads) {
        final int MOD = 1_000_000_007;

        // Step 1: Build adjacency list for the graph
        // graph[u] = list of {neighbor, time} pairs
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] road : roads) {
            int u = road[0], v = road[1], time = road[2];
            graph.get(u).add(new int[]{v, time});
            graph.get(v).add(new int[]{u, time});  // bidirectional
        }

        // Step 2: Initialize data structures
        // dist[i] = minimum time to reach intersection i from 0
        long[] dist = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[0] = 0;

        // ways[i] = number of ways to reach intersection i in minimum time
        int[] ways = new int[n];
        ways[0] = 1;  // one way to be at start

        // Min-heap for Dijkstra: {distance, node}
        PriorityQueue<long[]> heap = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
        heap.offer(new long[]{0, 0});  // start at node 0 with distance 0

        // Step 3: Dijkstra's algorithm with ways counting
        while (!heap.isEmpty()) {
            long[] current = heap.poll();
            long currentDist = current[0];
            int node = (int) current[1];

            // Skip if we found a better path to this node already
            if (currentDist > dist[node]) {
                continue;
            }

            // Step 4: Explore neighbors
            for (int[] neighborInfo : graph.get(node)) {
                int neighbor = neighborInfo[0];
                int time = neighborInfo[1];

                // Calculate new distance through current node
                long newDist = currentDist + time;

                // Case 1: Found a shorter path to neighbor
                if (newDist < dist[neighbor]) {
                    dist[neighbor] = newDist;
                    ways[neighbor] = ways[node];  // reset ways to current node's ways
                    heap.offer(new long[]{newDist, neighbor});
                }
                // Case 2: Found another shortest path to neighbor
                else if (newDist == dist[neighbor]) {
                    // Add current node's ways to neighbor's ways
                    ways[neighbor] = (ways[neighbor] + ways[node]) % MOD;
                }
            }
        }

        // Step 5: Return number of ways to reach destination
        return ways[n - 1] % MOD;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(E log V)**

- Building adjacency list: O(E) where E is number of roads
- Dijkstra with min-heap: O(E log V) — each edge is processed once, and heap operations are O(log V)
- Ways counting happens during Dijkstra traversal, adding no extra asymptotic cost

**Space Complexity: O(V + E)**

- Adjacency list: O(E) to store all roads
- Distance array: O(V)
- Ways array: O(V)
- Min-heap: O(V) in worst case
- Total: O(V + E)

The O(E log V) time is optimal for Dijkstra with a binary heap. We could potentially improve to O(E + V log V) with Fibonacci heap, but binary heap is practical and commonly used.

## Common Mistakes

1. **Not handling multiple shortest paths correctly:** The most common error is resetting `ways[neighbor]` when finding an equal-distance path instead of adding to it. Remember: when `newDist == dist[neighbor]`, we add `ways[node]` to `ways[neighbor]`, not replace it.

2. **Forgetting modulo operations:** The result needs to be modulo 10^9+7. Candidates often forget to apply modulo when adding ways, which can cause integer overflow in languages like Java or incorrect results in Python (though Python handles big integers).

3. **Incorrect heap initialization or comparison:** In Dijkstra, the heap should store `(distance, node)` pairs sorted by distance. A common mistake is storing nodes without distances or using max-heap instead of min-heap.

4. **Not skipping processed nodes:** In Dijkstra, when we pop a node from heap, we must check if `currentDist > dist[node]`. If true, we've already found a better path and should skip processing. This optimization is crucial for efficiency.

## When You'll See This Pattern

This "shortest path counting" pattern appears in problems where you need to find not just the optimal value, but how many ways to achieve it:

1. **"Unique Paths" variations:** Problems like [Unique Paths](https://leetcode.com/problems/unique-paths/) (counting paths in grid) use simpler DP, but the concept is similar — count ways to reach a state.

2. **"Path with Maximum Probability"**: While that problem finds maximum probability rather than counting ways, it uses similar Dijkstra adaptation for a different optimization goal.

3. **"Second Minimum Time to Reach Destination"**: This builds on shortest path concepts but adds complexity by considering traffic lights and second-best paths.

4. **Network reliability problems:** In real-world routing, you might want to know not just the fastest route, but how many alternative fast routes exist for redundancy.

## Key Takeaways

1. **Combine algorithms when needed:** This problem shows how to integrate Dijkstra (for shortest paths) with dynamic programming (for counting). Interview problems often require combining multiple techniques.

2. **The shortest path DAG property:** In any graph, the set of all shortest paths from a source forms a directed acyclic graph. This is why we can process nodes in distance order for counting.

3. **Modify standard algorithms carefully:** When adapting Dijkstra for additional computations, maintain its core invariants. Process nodes in distance order, skip outdated heap entries, and update neighbors correctly for both shorter and equal-distance paths.

**Related problems:** [All Paths From Source to Target](/problem/all-paths-from-source-to-target), [Path with Maximum Probability](/problem/path-with-maximum-probability), [Second Minimum Time to Reach Destination](/problem/second-minimum-time-to-reach-destination)
