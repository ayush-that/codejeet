---
title: "How to Solve Network Delay Time — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Network Delay Time. Medium difficulty, 59.8% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory, Heap (Priority Queue), Shortest Path."
date: "2026-12-01"
category: "dsa-patterns"
tags: ["network-delay-time", "depth-first-search", "breadth-first-search", "graph-theory", "medium"]
---

# How to Solve Network Delay Time

This problem asks us to find the minimum time for a signal to travel from a given starting node to all other nodes in a directed, weighted graph. If some nodes are unreachable, we return -1. What makes this problem interesting is that it's a classic **single-source shortest path** problem in disguise, but with a twist: we need the maximum of all shortest paths, not just the path to a specific destination.

## Visual Walkthrough

Let's trace through a concrete example:

- `n = 4` (nodes 1-4)
- `k = 2` (starting node)
- `times = [[2,1,1], [2,3,1], [3,4,1]]`

We want to find how long it takes for a signal from node 2 to reach all nodes.

**Step 1:** Start at node 2 with time 0. From here, we can go to:

- Node 1 with time 1
- Node 3 with time 1

**Step 2:** Process node 1 (time 1). It has no outgoing edges, so we're done with it.

**Step 3:** Process node 3 (time 1). From here, we can reach node 4 with time 1 + 1 = 2.

**Step 4:** Process node 4 (time 2). No outgoing edges.

Now we have the shortest times to reach each node:

- Node 1: 1
- Node 2: 0 (starting node)
- Node 3: 1
- Node 4: 2

The maximum of these is 2, which is our answer. If any node had remained unreachable (like if node 4 wasn't connected), we'd return -1.

## Brute Force Approach

A naive approach might try to explore all possible paths from the starting node to each destination, keeping track of the minimum time for each node. This could be done with a DFS that explores every possible route.

The problem with this approach is **exponential time complexity**. In the worst case, we could revisit nodes multiple times through different paths, and with weighted edges, we can't simply mark nodes as visited and stop exploring. We need a systematic way to guarantee we find the shortest path to each node.

Even worse, if there are negative cycles (which this problem doesn't have, but similar problems might), a brute force DFS could get stuck in infinite loops. The key insight is that we need an algorithm specifically designed for finding shortest paths in weighted graphs.

## Optimized Approach

This problem screams **Dijkstra's Algorithm**. Here's why:

1. **Non-negative weights**: The problem guarantees all travel times are positive (wi > 0), which is a requirement for Dijkstra's algorithm to work correctly.
2. **Single source**: We're finding paths from one starting node to all others.
3. **Weighted edges**: We can't use simple BFS because edges have different weights.

**Key Insight**: Dijkstra's algorithm uses a priority queue (min-heap) to always process the node with the smallest known distance next. This greedy approach works because with non-negative weights, once we've found the shortest path to a node, we'll never find a shorter one later.

**Step-by-step reasoning:**

1. Create an adjacency list to represent the graph
2. Initialize distances to all nodes as infinity, except the starting node which is 0
3. Use a min-heap to track (distance, node) pairs, starting with (0, k)
4. While the heap isn't empty:
   - Pop the node with smallest distance
   - If we've already found a shorter path to this node, skip it
   - For each neighbor, calculate the new distance through this node
   - If it's shorter than the current known distance, update it and push to heap
5. After processing all reachable nodes, find the maximum distance
6. If any node still has infinity distance, return -1 (unreachable)

## Optimal Solution

Here's the complete implementation using Dijkstra's algorithm:

<div class="code-group">

```python
# Time: O(E log V) where E is number of edges, V is number of vertices
# Space: O(V + E) for adjacency list and distance array
import heapq
from collections import defaultdict

def networkDelayTime(times, n, k):
    """
    Calculate the minimum time for a signal to reach all nodes from node k.

    Args:
        times: List of (source, target, weight) edges
        n: Number of nodes (1-indexed)
        k: Starting node

    Returns:
        Maximum shortest path distance, or -1 if some nodes are unreachable
    """
    # Step 1: Build adjacency list representation of the graph
    # We use defaultdict to avoid key errors for nodes with no outgoing edges
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))

    # Step 2: Initialize distances array with infinity for all nodes
    # We use 1-indexing, so create array of size n+1, ignoring index 0
    distances = [float('inf')] * (n + 1)
    distances[k] = 0  # Distance to starting node is 0

    # Step 3: Use min-heap (priority queue) for Dijkstra's algorithm
    # Heap stores (distance, node) pairs, sorted by distance
    heap = [(0, k)]

    # Step 4: Process nodes in order of increasing distance
    while heap:
        current_dist, current_node = heapq.heappop(heap)

        # Skip if we've already found a better path to this node
        # This can happen if the same node was pushed multiple times with different distances
        if current_dist > distances[current_node]:
            continue

        # Step 5: Explore neighbors of the current node
        for neighbor, weight in graph[current_node]:
            # Calculate new distance to neighbor through current node
            new_dist = current_dist + weight

            # If we found a shorter path to the neighbor, update it
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                # Push the updated distance to the heap
                heapq.heappush(heap, (new_dist, neighbor))

    # Step 6: Find the maximum distance among all nodes
    # Skip index 0 since nodes are 1-indexed
    max_distance = max(distances[1:])

    # Step 7: If any node is unreachable (distance still infinity), return -1
    return max_distance if max_distance < float('inf') else -1
```

```javascript
// Time: O(E log V) where E is number of edges, V is number of vertices
// Space: O(V + E) for adjacency list and distance array

/**
 * Calculate the minimum time for a signal to reach all nodes from node k.
 * @param {number[][]} times - Array of [source, target, weight] edges
 * @param {number} n - Number of nodes (1-indexed)
 * @param {number} k - Starting node
 * @return {number} Maximum shortest path distance, or -1 if some nodes are unreachable
 */
function networkDelayTime(times, n, k) {
  // Step 1: Build adjacency list representation of the graph
  const graph = new Array(n + 1).fill().map(() => []);
  for (const [u, v, w] of times) {
    graph[u].push([v, w]);
  }

  // Step 2: Initialize distances array with Infinity for all nodes
  // We use 1-indexing, so create array of size n+1, ignoring index 0
  const distances = new Array(n + 1).fill(Infinity);
  distances[k] = 0; // Distance to starting node is 0

  // Step 3: Use min-heap (priority queue) for Dijkstra's algorithm
  // In JavaScript, we can use an array and sort it, but that's inefficient
  // Instead, we'll implement a simple min-heap
  const heap = new MinHeap();
  heap.push([0, k]); // Store [distance, node] pairs

  // Step 4: Process nodes in order of increasing distance
  while (!heap.isEmpty()) {
    const [currentDist, currentNode] = heap.pop();

    // Skip if we've already found a better path to this node
    if (currentDist > distances[currentNode]) {
      continue;
    }

    // Step 5: Explore neighbors of the current node
    for (const [neighbor, weight] of graph[currentNode]) {
      // Calculate new distance to neighbor through current node
      const newDist = currentDist + weight;

      // If we found a shorter path to the neighbor, update it
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        // Push the updated distance to the heap
        heap.push([newDist, neighbor]);
      }
    }
  }

  // Step 6: Find the maximum distance among all nodes
  // Skip index 0 since nodes are 1-indexed
  let maxDistance = -Infinity;
  for (let i = 1; i <= n; i++) {
    maxDistance = Math.max(maxDistance, distances[i]);
  }

  // Step 7: If any node is unreachable (distance still Infinity), return -1
  return maxDistance < Infinity ? maxDistance : -1;
}

// MinHeap implementation for Dijkstra's algorithm
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
// Time: O(E log V) where E is number of edges, V is number of vertices
// Space: O(V + E) for adjacency list and distance array
import java.util.*;

class Solution {
    /**
     * Calculate the minimum time for a signal to reach all nodes from node k.
     * @param times Array of [source, target, weight] edges
     * @param n Number of nodes (1-indexed)
     * @param k Starting node
     * @return Maximum shortest path distance, or -1 if some nodes are unreachable
     */
    public int networkDelayTime(int[][] times, int n, int k) {
        // Step 1: Build adjacency list representation of the graph
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i <= n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] time : times) {
            int u = time[0], v = time[1], w = time[2];
            graph.get(u).add(new int[]{v, w});
        }

        // Step 2: Initialize distances array with infinity for all nodes
        // We use 1-indexing, so create array of size n+1, ignoring index 0
        int[] distances = new int[n + 1];
        Arrays.fill(distances, Integer.MAX_VALUE);
        distances[k] = 0;  // Distance to starting node is 0

        // Step 3: Use min-heap (priority queue) for Dijkstra's algorithm
        // PriorityQueue stores [distance, node] pairs, sorted by distance
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.offer(new int[]{0, k});

        // Step 4: Process nodes in order of increasing distance
        while (!heap.isEmpty()) {
            int[] current = heap.poll();
            int currentDist = current[0];
            int currentNode = current[1];

            // Skip if we've already found a better path to this node
            if (currentDist > distances[currentNode]) {
                continue;
            }

            // Step 5: Explore neighbors of the current node
            for (int[] neighborInfo : graph.get(currentNode)) {
                int neighbor = neighborInfo[0];
                int weight = neighborInfo[1];

                // Calculate new distance to neighbor through current node
                int newDist = currentDist + weight;

                // If we found a shorter path to the neighbor, update it
                if (newDist < distances[neighbor]) {
                    distances[neighbor] = newDist;
                    // Push the updated distance to the heap
                    heap.offer(new int[]{newDist, neighbor});
                }
            }
        }

        // Step 6: Find the maximum distance among all nodes
        // Skip index 0 since nodes are 1-indexed
        int maxDistance = 0;
        for (int i = 1; i <= n; i++) {
            maxDistance = Math.max(maxDistance, distances[i]);
        }

        // Step 7: If any node is unreachable (distance still MAX_VALUE), return -1
        return maxDistance == Integer.MAX_VALUE ? -1 : maxDistance;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(E log V)**

- Building the adjacency list takes O(E) time
- Each edge is processed at most once when we explore neighbors
- Each push/pop operation on the heap takes O(log V) time
- In the worst case, we might push each node to the heap for each of its edges, giving us O(E log V)

**Space Complexity: O(V + E)**

- Adjacency list stores all edges: O(E)
- Distance array stores distances for all nodes: O(V)
- Heap can contain up to V nodes in the worst case: O(V)

## Common Mistakes

1. **Forgetting to skip already-processed nodes**: When you pop from the heap, you need to check if the distance is still valid. Multiple entries for the same node can exist in the heap, and you should only process the one with the smallest distance.

2. **Using BFS instead of Dijkstra**: With weighted edges, BFS doesn't guarantee the shortest path. BFS only works for unweighted graphs or when all edges have the same weight.

3. **1-indexing confusion**: The nodes are labeled 1 to n, but arrays are typically 0-indexed. Many candidates create arrays of size n instead of n+1, leading to index out of bounds errors.

4. **Not handling unreachable nodes**: Forgetting to check if all nodes are reachable and returning the maximum distance without verifying it's not infinity.

## When You'll See This Pattern

Dijkstra's algorithm appears in many shortest path problems:

1. **Cheapest Flights Within K Stops**: Similar to Network Delay Time but with an additional constraint on the number of stops. You need to modify Dijkstra to track both cost and stops.

2. **Path With Maximum Minimum Value**: Instead of minimizing the sum of weights, you maximize the minimum weight along the path. The heap logic changes but the structure is similar.

3. **The Time When the Network Becomes Idle**: This problem builds on Network Delay Time by adding processing time at each node after receiving a signal.

The pattern to recognize: whenever you need the shortest path in a weighted graph with non-negative weights from one point to another (or to all points), Dijkstra's algorithm is your go-to solution.

## Key Takeaways

1. **Dijkstra's algorithm is BFS with a priority queue**: Instead of processing nodes in FIFO order, you always process the node with the smallest known distance next. This greedy approach works because with non-negative weights, you can't find a shorter path later.

2. **The heap optimization is crucial**: Without the priority queue, Dijkstra would be O(V²). With it, we get O(E log V), which is much better for sparse graphs.

3. **Always check for unreachable nodes**: In graph problems, not all nodes may be connected. Your solution should handle this gracefully by checking if any distances remain at their initial "infinity" value.

Related problems: [The Time When the Network Becomes Idle](/problem/the-time-when-the-network-becomes-idle), [Second Minimum Time to Reach Destination](/problem/second-minimum-time-to-reach-destination)
