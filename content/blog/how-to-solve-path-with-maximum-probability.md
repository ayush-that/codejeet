---
title: "How to Solve Path with Maximum Probability — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Path with Maximum Probability. Medium difficulty, 65.5% acceptance rate. Topics: Array, Graph Theory, Heap (Priority Queue), Shortest Path."
date: "2027-09-08"
category: "dsa-patterns"
tags: ["path-with-maximum-probability", "array", "graph-theory", "heap-(priority-queue)", "medium"]
---

# How to Solve Path with Maximum Probability

You're given an undirected graph where edges have probabilities of success, and you need to find the path with maximum probability between two nodes. This is interesting because it looks like a shortest path problem, but instead of minimizing distance, we're maximizing probability. Since probabilities multiply along a path (not add), we need to adapt classic graph algorithms to handle this multiplicative nature.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

- n = 3 (nodes: 0, 1, 2)
- edges = [[0,1], [1,2], [0,2]]
- succProb = [0.5, 0.7, 0.3]
- start = 0, end = 2

**Step-by-step reasoning:**

We want the maximum probability path from node 0 to node 2. Let's think about the possible paths:

1. **Direct path**: 0 → 2 with probability 0.3
2. **Two-hop path**: 0 → 1 → 2 with probability 0.5 × 0.7 = 0.35

The two-hop path (0.35) has higher probability than the direct path (0.3), even though it has more edges. This is because probabilities multiply, so a path with slightly lower individual probabilities can still have a higher overall probability if the product is larger.

If we think about this like Dijkstra's algorithm but for maximizing probability:

- Start at node 0 with probability 1.0
- From node 0, we can reach:
  - Node 1 with probability 0.5
  - Node 2 with probability 0.3
- From node 1 (probability 0.5), we can reach:
  - Node 2 with probability 0.5 × 0.7 = 0.35
- Compare paths to node 2: direct (0.3) vs via node 1 (0.35)
- Maximum probability to reach node 2 is 0.35

This shows why we can't use a greedy approach that always takes the highest probability edge from the current node — we need to consider all paths.

## Brute Force Approach

A brute force solution would explore all possible paths from start to end and calculate their probabilities. For an undirected graph with n nodes, the number of possible paths can be exponential in the worst case (consider a complete graph where every node connects to every other node).

**Why this fails:**

1. **Exponential time complexity**: In a dense graph, the number of paths grows factorially
2. **Redundant computation**: We revisit the same nodes multiple times without reusing previous computations
3. **No early termination**: We can't prune unpromising paths without a systematic approach

Even for moderately sized graphs (n > 20), this approach becomes computationally infeasible.

## Optimized Approach

The key insight is that this is essentially a **shortest path problem in disguise**, but with two important twists:

1. **We're maximizing, not minimizing**: Instead of finding the path with minimum distance, we want maximum probability
2. **Probabilities multiply, not add**: The "cost" of a path is the product of edge probabilities, not the sum

We can adapt Dijkstra's algorithm to solve this by:

- Using a max-heap (priority queue) instead of min-heap
- Tracking the maximum probability to reach each node
- Multiplying probabilities along edges instead of adding distances
- Initializing all probabilities to 0 (except start node = 1.0)

**Why Dijkstra works here:**

- When we pop a node from the max-heap, we've found the maximum probability path to that node
- This is guaranteed because all edge probabilities are ≤ 1.0, so taking additional edges can only decrease (or keep the same) the probability
- The algorithm greedily expands the most promising paths first

**Step-by-step algorithm:**

1. Build an adjacency list from edges and probabilities
2. Initialize maxProb array with 0 for all nodes, except start = 1.0
3. Use a max-heap (priority queue) storing (-probability, node) since most libraries provide min-heaps
4. While heap is not empty:
   - Pop the node with highest current probability
   - If it's the end node, we can return early (optimization)
   - For each neighbor, calculate new probability = current × edge probability
   - If new probability > stored probability for neighbor, update and push to heap

## Optimal Solution

Here's the complete implementation using Dijkstra's algorithm adapted for maximum probability:

<div class="code-group">

```python
# Time: O(E log V) where E = number of edges, V = number of vertices
# Space: O(V + E) for adjacency list and priority queue
import heapq
from collections import defaultdict

def maxProbability(n, edges, succProb, start, end):
    """
    Find the maximum probability path from start to end in an undirected graph.

    Args:
        n: number of nodes
        edges: list of [u, v] pairs
        succProb: list of probabilities for each edge
        start: starting node
        end: target node

    Returns:
        Maximum probability from start to end, or 0 if no path exists
    """
    # Step 1: Build adjacency list
    # We store (neighbor, probability) pairs for each node
    graph = defaultdict(list)
    for (u, v), prob in zip(edges, succProb):
        graph[u].append((v, prob))
        graph[v].append((u, prob))  # Undirected graph

    # Step 2: Initialize max probability array
    # All nodes start with probability 0, except start with 1.0
    max_prob = [0.0] * n
    max_prob[start] = 1.0

    # Step 3: Use max-heap (implemented as min-heap with negative probabilities)
    # We store (-probability, node) because heapq is a min-heap
    heap = [(-1.0, start)]  # Start with probability 1.0

    while heap:
        # Pop node with highest current probability
        # Negate to get actual probability
        curr_prob_neg, node = heapq.heappop(heap)
        curr_prob = -curr_prob_neg

        # Optimization: If we reached the end node, we can return early
        # This works because Dijkstra guarantees first time we pop end
        # is with maximum probability
        if node == end:
            return curr_prob

        # Important: Skip if current probability is less than stored
        # This handles stale entries in the heap
        if curr_prob < max_prob[node]:
            continue

        # Step 4: Explore neighbors
        for neighbor, edge_prob in graph[node]:
            # Calculate new probability = current * edge probability
            new_prob = curr_prob * edge_prob

            # Only update if we found a better path
            if new_prob > max_prob[neighbor]:
                max_prob[neighbor] = new_prob
                # Push to heap with negative probability for max-heap behavior
                heapq.heappush(heap, (-new_prob, neighbor))

    # If we exhaust the heap without reaching end, no path exists
    return 0.0
```

```javascript
// Time: O(E log V) where E = number of edges, V = number of vertices
// Space: O(V + E) for adjacency list and priority queue

/**
 * Find the maximum probability path from start to end in an undirected graph.
 * @param {number} n - number of nodes
 * @param {number[][]} edges - list of [u, v] pairs
 * @param {number[]} succProb - list of probabilities for each edge
 * @param {number} start - starting node
 * @param {number} end - target node
 * @return {number} - Maximum probability from start to end, or 0 if no path exists
 */
var maxProbability = function (n, edges, succProb, start, end) {
  // Step 1: Build adjacency list
  // We store [neighbor, probability] pairs for each node
  const graph = new Array(n).fill(0).map(() => []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v] = edges[i];
    const prob = succProb[i];
    graph[u].push([v, prob]);
    graph[v].push([u, prob]); // Undirected graph
  }

  // Step 2: Initialize max probability array
  // All nodes start with probability 0, except start with 1.0
  const maxProb = new Array(n).fill(0);
  maxProb[start] = 1.0;

  // Step 3: Use max-heap (implemented as min-heap with negative probabilities)
  // JavaScript doesn't have built-in heap, so we'll use an array and sort
  // For efficiency, we should use a proper heap implementation in interviews
  const heap = new MaxHeap();
  heap.push([1.0, start]);

  while (!heap.isEmpty()) {
    // Pop node with highest current probability
    const [currProb, node] = heap.pop();

    // Optimization: If we reached the end node, we can return early
    if (node === end) {
      return currProb;
    }

    // Important: Skip if current probability is less than stored
    // This handles stale entries in the heap
    if (currProb < maxProb[node]) {
      continue;
    }

    // Step 4: Explore neighbors
    for (const [neighbor, edgeProb] of graph[node]) {
      // Calculate new probability = current * edge probability
      const newProb = currProb * edgeProb;

      // Only update if we found a better path
      if (newProb > maxProb[neighbor]) {
        maxProb[neighbor] = newProb;
        heap.push([newProb, neighbor]);
      }
    }
  }

  // If we exhaust the heap without reaching end, no path exists
  return 0.0;
};

// Simple MaxHeap implementation for JavaScript
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this.heap.sort((a, b) => b[0] - a[0]); // Sort descending by probability
  }

  pop() {
    return this.heap.shift();
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}
```

```java
// Time: O(E log V) where E = number of edges, V = number of vertices
// Space: O(V + E) for adjacency list and priority queue
import java.util.*;

class Solution {
    /**
     * Find the maximum probability path from start to end in an undirected graph.
     * @param n number of nodes
     * @param edges list of [u, v] pairs
     * @param succProb list of probabilities for each edge
     * @param start starting node
     * @param end target node
     * @return Maximum probability from start to end, or 0 if no path exists
     */
    public double maxProbability(int n, int[][] edges, double[] succProb, int start, int end) {
        // Step 1: Build adjacency list
        // We store List<int[]> where int[] = {neighbor, probability encoded as int for comparison}
        // But since we need double probabilities, we'll use List<double[]>
        List<List<double[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }

        for (int i = 0; i < edges.length; i++) {
            int u = edges[i][0];
            int v = edges[i][1];
            double prob = succProb[i];

            graph.get(u).add(new double[]{v, prob});
            graph.get(v).add(new double[]{u, prob});  // Undirected graph
        }

        // Step 2: Initialize max probability array
        // All nodes start with probability 0, except start with 1.0
        double[] maxProb = new double[n];
        maxProb[start] = 1.0;

        // Step 3: Use max-heap (implemented as min-heap with negative probabilities)
        // PriorityQueue in Java is min-heap by default
        // We store [-probability, node] to get max-heap behavior
        PriorityQueue<double[]> heap = new PriorityQueue<>(
            (a, b) -> Double.compare(b[0], a[0])  // Compare probabilities for max-heap
        );
        heap.offer(new double[]{1.0, start});

        while (!heap.isEmpty()) {
            // Pop node with highest current probability
            double[] curr = heap.poll();
            double currProb = curr[0];
            int node = (int) curr[1];

            // Optimization: If we reached the end node, we can return early
            if (node == end) {
                return currProb;
            }

            // Important: Skip if current probability is less than stored
            // This handles stale entries in the heap
            if (currProb < maxProb[node]) {
                continue;
            }

            // Step 4: Explore neighbors
            for (double[] neighborData : graph.get(node)) {
                int neighbor = (int) neighborData[0];
                double edgeProb = neighborData[1];

                // Calculate new probability = current * edge probability
                double newProb = currProb * edgeProb;

                // Only update if we found a better path
                if (newProb > maxProb[neighbor]) {
                    maxProb[neighbor] = newProb;
                    heap.offer(new double[]{newProb, neighbor});
                }
            }
        }

        // If we exhaust the heap without reaching end, no path exists
        return 0.0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(E log V)**

- Building adjacency list: O(E)
- Each edge is processed at most once when we discover a better path to its endpoint
- Each push/pop operation on the heap takes O(log V)
- In worst case, we process each edge and do heap operations, giving O(E log V)

**Space Complexity: O(V + E)**

- Adjacency list: O(E) to store all edges (each undirected edge stored twice)
- Max probability array: O(V)
- Priority queue: O(V) in worst case
- Total: O(V + E)

## Common Mistakes

1. **Using BFS without priority queue**: BFS explores level by level, but in probability maximization, we need to always expand the node with highest current probability first. BFS would waste time exploring low-probability paths.

2. **Forgetting to handle stale heap entries**: When we find a better path to a node, we push it to the heap. Older entries for that node become stale. We must check `if curr_prob < max_prob[node]: continue` to skip them.

3. **Initializing probabilities incorrectly**: All nodes should start with probability 0.0 (except start with 1.0). Some candidates initialize with -1 or other values, which breaks comparisons.

4. **Not treating as undirected graph**: The problem states it's an undirected graph, so edges work in both directions. Forgetting to add both directions to the adjacency list will miss valid paths.

5. **Using addition instead of multiplication**: This is the most subtle error. Probabilities along a path multiply, not add. Using Dijkstra with addition would give incorrect results.

## When You'll See This Pattern

This "Dijkstra for maximization" pattern appears in problems where you need to find an optimal path with a multiplicative (or otherwise non-additive) cost function:

1. **"Number of Ways to Arrive at Destination" (LeetCode 1976)**: Similar structure but counts number of ways instead of maximizing probability. Uses Dijkstra to find shortest paths, then DP to count ways.

2. **"Cheapest Flights Within K Stops" (LeetCode 787)**: Another variation of shortest path with constraints. Uses modified Dijkstra or Bellman-Ford.

3. **"Network Delay Time" (LeetCode 743)**: Classic Dijkstra application for minimizing maximum delay.

4. **"Path With Minimum Effort" (LeetCode 1631)**: Minimizes the maximum absolute difference along a path, which requires a different relaxation condition.

The core pattern is recognizing when a problem is essentially a shortest path problem in disguise, even if you're maximizing instead of minimizing, or using multiplication instead of addition.

## Key Takeaways

1. **Dijkstra's algorithm is versatile**: It can solve maximization problems by using a max-heap and appropriate relaxation conditions. The key requirement is that the "cost" function must satisfy the property that taking additional steps never improves the cost (monotonicity).

2. **Probabilities multiply along paths**: This is different from typical distance problems where costs add. Always check whether your problem uses addition or multiplication for combining edge weights.

3. **Early termination optimization**: In Dijkstra-based solutions, when you pop the target node from the heap, you've found the optimal path and can return immediately. This is because Dijkstra processes nodes in order of optimality.

4. **Graph representation matters**: For undirected graphs, remember to add edges in both directions to your adjacency list.

Related problems: [Number of Ways to Arrive at Destination](/problem/number-of-ways-to-arrive-at-destination)
