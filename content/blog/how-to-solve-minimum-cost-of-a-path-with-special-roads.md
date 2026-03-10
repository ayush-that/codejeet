---
title: "How to Solve Minimum Cost of a Path With Special Roads — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Cost of a Path With Special Roads. Medium difficulty, 42.5% acceptance rate. Topics: Array, Graph Theory, Heap (Priority Queue), Shortest Path."
date: "2029-11-29"
category: "dsa-patterns"
tags:
  [
    "minimum-cost-of-a-path-with-special-roads",
    "array",
    "graph-theory",
    "heap-(priority-queue)",
    "medium",
  ]
---

# How to Solve Minimum Cost of a Path With Special Roads

This problem asks us to find the minimum cost to travel from a starting point to a target point in a 2D plane, where we have two movement options: regular movement (costing the Manhattan distance between points) and special roads (which let us teleport from one point to another for a potentially lower cost than the Manhattan distance). The challenge is that we can use any combination of these special roads, and we can also travel directly between any points using regular movement. This creates a graph problem where we need to find the shortest path in a graph with potentially thousands of nodes.

What makes this problem interesting is that while it looks like a 2D grid problem, it's actually a graph shortest path problem in disguise. The special roads create shortcuts that might be cheaper than direct travel, but we need to consider all possible combinations of these shortcuts and regular movement to find the optimal path.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

- Start: [1, 1]
- Target: [4, 5]
- Special roads: [[1, 2, 3, 4, 3], [2, 3, 4, 5, 2]]

**Special road 1:** From (1, 2) to (3, 4) costs 3
**Special road 2:** From (2, 3) to (4, 5) costs 2

**Step 1: Direct path**
The Manhattan distance from start (1, 1) to target (4, 5) is:
|4-1| + |5-1| = 3 + 4 = 7

**Step 2: Using special road 1 only**
From start (1, 1) to road 1 start (1, 2): |1-1| + |2-1| = 0 + 1 = 1
Take road 1: cost 3
From road 1 end (3, 4) to target (4, 5): |4-3| + |5-4| = 1 + 1 = 2
Total: 1 + 3 + 2 = 6

**Step 3: Using special road 2 only**
From start (1, 1) to road 2 start (2, 3): |2-1| + |3-1| = 1 + 2 = 3
Take road 2: cost 2
From road 2 end (4, 5) to target (4, 5): 0
Total: 3 + 2 + 0 = 5

**Step 4: Using both special roads**
From start (1, 1) to road 1 start (1, 2): 1
Take road 1: 3
From road 1 end (3, 4) to road 2 start (2, 3): |2-3| + |3-4| = 1 + 1 = 2
Take road 2: 2
From road 2 end (4, 5) to target (4, 5): 0
Total: 1 + 3 + 2 + 2 + 0 = 8

The minimum cost is 5, using only special road 2.

This shows that we need to consider:

1. Direct travel between any two points
2. Travel using any combination of special roads
3. Travel from start to any special road start
4. Travel from any special road end to target
5. Travel between special roads

## Brute Force Approach

A naive approach would be to consider all possible sequences of special roads. For n special roads, there are n! possible orderings if we consider using each road at most once. Even if we limit the sequence length, the number of possibilities grows factorially, making this approach infeasible for even moderate n.

Another brute force approach would be to treat every point (start, target, and all special road endpoints) as nodes in a graph, with edges representing either:

1. Direct Manhattan distance between any two nodes
2. Special roads (which might be cheaper than the Manhattan distance)

We could then try to find all paths from start to target, but this would be exponential in the number of nodes.

The key insight is that this is a shortest path problem in a graph where:

- Nodes are: start, target, and all special road endpoints
- Edges exist between every pair of nodes (with cost = Manhattan distance)
- Special roads provide potentially cheaper edges between specific nodes

## Optimized Approach

The optimal approach models this as a graph shortest path problem and uses Dijkstra's algorithm:

1. **Graph Construction:**
   - Create nodes for: start, target, and all special road endpoints (both start and end points of each road)
   - For every pair of nodes, add an edge with cost = Manhattan distance
   - For each special road, add an edge from its start to its end with the given special cost (which might be cheaper than the Manhattan distance)

2. **Key Insight:**
   We don't need to explicitly store all edges between all nodes. Instead, we can use Dijkstra's algorithm where:
   - The priority queue contains (cost, node) pairs
   - When we pop a node, we consider:
     a. Direct travel to target (Manhattan distance)
     b. Travel to each special road's start point (Manhattan distance), then take the special road
     c. Travel to each special road's end point (Manhattan distance)

3. **Optimization:**
   We don't need to precompute all edges. During Dijkstra's algorithm, when we're at a node (x, y), we can compute the Manhattan distance to any other node on the fly. This gives us O(n) edges to consider from each node, where n is the number of special roads.

4. **Dijkstra's Algorithm:**
   - Start with cost 0 at the start node
   - Use a min-heap to always expand the node with the smallest current cost
   - When we reach the target node, we've found the minimum cost

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2 log n) where n is the number of special roads
# Space: O(n) for the priority queue and distance dictionary
def minimumCost(start, target, specialRoads):
    """
    Find minimum cost from start to target using special roads.

    Args:
        start: List[int] - [startX, startY]
        target: List[int] - [targetX, targetY]
        specialRoads: List[List[int]] - each road is [x1, y1, x2, y2, cost]

    Returns:
        int: minimum cost to reach target from start
    """
    import heapq

    # Convert to tuples for hashability
    start = tuple(start)
    target = tuple(target)

    # Distance dictionary: node -> minimum cost to reach that node
    dist = {start: 0}

    # Min-heap priority queue: (cost, x, y)
    heap = [(0, start[0], start[1])]

    while heap:
        current_cost, x, y = heapq.heappop(heap)
        current_node = (x, y)

        # If we've found a better path to this node since adding it to heap, skip it
        if current_cost > dist.get(current_node, float('inf')):
            continue

        # Option 1: Go directly to target from current node
        direct_cost = current_cost + abs(target[0] - x) + abs(target[1] - y)
        dist[target] = min(dist.get(target, float('inf')), direct_cost)

        # Option 2: Consider all special roads from current node
        for road in specialRoads:
            x1, y1, x2, y2, road_cost = road

            # Cost to reach the start of this special road from current node
            to_start_cost = current_cost + abs(x1 - x) + abs(y1 - y)

            # Total cost if we take this special road
            total_via_road = to_start_cost + road_cost

            # End point of this special road
            end_node = (x2, y2)

            # If this gives us a better path to the end point, update it
            if total_via_road < dist.get(end_node, float('inf')):
                dist[end_node] = total_via_road
                heapq.heappush(heap, (total_via_road, x2, y2))

    return dist[target]
```

```javascript
// Time: O(n^2 log n) where n is the number of special roads
// Space: O(n) for the priority queue and distance map
function minimumCost(start, target, specialRoads) {
  /**
   * Find minimum cost from start to target using special roads.
   *
   * @param {number[]} start - [startX, startY]
   * @param {number[]} target - [targetX, targetY]
   * @param {number[][]} specialRoads - each road is [x1, y1, x2, y2, cost]
   * @return {number} minimum cost to reach target from start
   */

  // Min-heap implementation for JavaScript
  class MinHeap {
    constructor() {
      this.heap = [];
    }

    push(node) {
      this.heap.push(node);
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

    bubbleUp(index) {
      const node = this.heap[index];
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.heap[parentIndex];
        if (node[0] >= parent[0]) break;
        this.heap[parentIndex] = node;
        this.heap[index] = parent;
        index = parentIndex;
      }
    }

    sinkDown(index) {
      const length = this.heap.length;
      const node = this.heap[index];
      while (true) {
        let leftChildIndex = 2 * index + 1;
        let rightChildIndex = 2 * index + 2;
        let swap = null;
        let leftChild, rightChild;

        if (leftChildIndex < length) {
          leftChild = this.heap[leftChildIndex];
          if (leftChild[0] < node[0]) {
            swap = leftChildIndex;
          }
        }

        if (rightChildIndex < length) {
          rightChild = this.heap[rightChildIndex];
          if (
            (swap === null && rightChild[0] < node[0]) ||
            (swap !== null && rightChild[0] < leftChild[0])
          ) {
            swap = rightChildIndex;
          }
        }

        if (swap === null) break;
        this.heap[index] = this.heap[swap];
        this.heap[swap] = node;
        index = swap;
      }
    }

    isEmpty() {
      return this.heap.length === 0;
    }
  }

  // Distance map: node string -> minimum cost
  const dist = new Map();
  const startKey = `${start[0]},${start[1]}`;
  dist.set(startKey, 0);

  // Min-heap: each element is [cost, x, y]
  const heap = new MinHeap();
  heap.push([0, start[0], start[1]]);

  while (!heap.isEmpty()) {
    const [currentCost, x, y] = heap.pop();
    const currentNode = `${x},${y}`;

    // Skip if we found a better path to this node
    if (currentCost > (dist.get(currentNode) || Infinity)) {
      continue;
    }

    // Option 1: Direct path to target
    const directCost = currentCost + Math.abs(target[0] - x) + Math.abs(target[1] - y);
    const targetKey = `${target[0]},${target[1]}`;
    const currentTargetCost = dist.get(targetKey) || Infinity;
    if (directCost < currentTargetCost) {
      dist.set(targetKey, directCost);
    }

    // Option 2: Consider all special roads
    for (const road of specialRoads) {
      const [x1, y1, x2, y2, roadCost] = road;

      // Cost to reach start of this special road
      const toStartCost = currentCost + Math.abs(x1 - x) + Math.abs(y1 - y);

      // Total cost if we take this road
      const totalViaRoad = toStartCost + roadCost;

      // End point of this road
      const endKey = `${x2},${y2}`;
      const currentEndCost = dist.get(endKey) || Infinity;

      // Update if we found a better path
      if (totalViaRoad < currentEndCost) {
        dist.set(endKey, totalViaRoad);
        heap.push([totalViaRoad, x2, y2]);
      }
    }
  }

  const targetKey = `${target[0]},${target[1]}`;
  return dist.get(targetKey);
}
```

```java
// Time: O(n^2 log n) where n is the number of special roads
// Space: O(n) for the priority queue and distance map
import java.util.*;

class Solution {
    public int minimumCost(int[] start, int[] target, int[][] specialRoads) {
        /**
         * Find minimum cost from start to target using special roads.
         *
         * @param start - [startX, startY]
         * @param target - [targetX, targetY]
         * @param specialRoads - each road is [x1, y1, x2, y2, cost]
         * @return minimum cost to reach target from start
         */

        // Distance map: node -> minimum cost to reach that node
        Map<String, Integer> dist = new HashMap<>();
        String startKey = start[0] + "," + start[1];
        dist.put(startKey, 0);

        // Min-heap priority queue: stores [cost, x, y]
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.offer(new int[]{0, start[0], start[1]});

        while (!heap.isEmpty()) {
            int[] current = heap.poll();
            int currentCost = current[0];
            int x = current[1];
            int y = current[2];
            String currentNode = x + "," + y;

            // Skip if we found a better path to this node
            if (currentCost > dist.getOrDefault(currentNode, Integer.MAX_VALUE)) {
                continue;
            }

            // Option 1: Direct path to target
            int directCost = currentCost + Math.abs(target[0] - x) + Math.abs(target[1] - y);
            String targetKey = target[0] + "," + target[1];
            int currentTargetCost = dist.getOrDefault(targetKey, Integer.MAX_VALUE);
            if (directCost < currentTargetCost) {
                dist.put(targetKey, directCost);
            }

            // Option 2: Consider all special roads
            for (int[] road : specialRoads) {
                int x1 = road[0];
                int y1 = road[1];
                int x2 = road[2];
                int y2 = road[3];
                int roadCost = road[4];

                // Cost to reach start of this special road
                int toStartCost = currentCost + Math.abs(x1 - x) + Math.abs(y1 - y);

                // Total cost if we take this road
                int totalViaRoad = toStartCost + roadCost;

                // End point of this road
                String endKey = x2 + "," + y2;
                int currentEndCost = dist.getOrDefault(endKey, Integer.MAX_VALUE);

                // Update if we found a better path
                if (totalViaRoad < currentEndCost) {
                    dist.put(endKey, totalViaRoad);
                    heap.offer(new int[]{totalViaRoad, x2, y2});
                }
            }
        }

        String targetKey = target[0] + "," + target[1];
        return dist.get(targetKey);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n² log n)**

- We process each node in the priority queue at most once
- For each node popped from the heap, we consider all n special roads
- Each heap operation (push/pop) takes O(log n) time
- In the worst case, we might push all special road endpoints into the heap, giving us O(n) nodes
- Total: O(n × n × log n) = O(n² log n)

**Space Complexity: O(n)**

- The distance dictionary/map stores entries for start, target, and all special road endpoints: O(n)
- The priority queue stores at most O(n) nodes
- Total: O(n)

Note: n here is the number of special roads, not the grid dimensions. The grid can be arbitrarily large, but we only create nodes for points we actually visit.

## Common Mistakes

1. **Forgetting to consider direct paths:** Some candidates only consider paths that use special roads, forgetting that the direct Manhattan distance path might be cheaper. Always include the option to go directly to the target from any node.

2. **Not handling duplicate nodes correctly:** When the same point appears multiple times (e.g., as both start and end of different roads), we need to track the minimum cost to reach that point. Using a distance dictionary with lazy updates (checking `if current_cost > dist[node]: continue`) is crucial.

3. **Infinite loops in Dijkstra's algorithm:** Without proper visited tracking or distance checks, the algorithm might keep revisiting nodes. The distance check (`if current_cost > dist[node]: continue`) prevents this by ensuring we only process a node if we've found a better path to it.

4. **Using BFS instead of Dijkstra:** Since edge weights (costs) vary, we need Dijkstra's algorithm (or a variant like A\*) rather than plain BFS. BFS only works with unweighted graphs or graphs where all edges have the same weight.

## When You'll See This Pattern

This problem uses **Dijkstra's algorithm on an implicit graph**, a pattern that appears in many shortest path problems:

1. **Network Delay Time (LeetCode 743):** Find how long it takes for a signal to reach all nodes in a network. Like our problem, it involves finding shortest paths in a weighted graph.

2. **Cheapest Flights Within K Stops (LeetCode 787):** Find the cheapest flight path with at most K stops. This adds a constraint (maximum stops) but uses similar shortest path concepts.

3. **Path With Minimum Effort (LeetCode 1631):** Find a path in a grid that minimizes the maximum absolute difference in heights between consecutive cells. It transforms a grid problem into a graph shortest path problem.

The key insight is recognizing when a problem can be modeled as finding the shortest path in a graph, even when the graph isn't explicitly given.

## Key Takeaways

1. **Many grid problems are graph problems in disguise:** When you see movement costs between points and optional shortcuts or teleports, think about modeling it as a graph where nodes are positions and edges are movement options with associated costs.

2. **Dijkstra's algorithm works on implicit graphs:** You don't need to precompute all edges. You can generate neighbors on the fly during the algorithm, which is especially useful when the graph would be dense if fully constructed.

3. **Lazy updates are efficient for Dijkstra:** Instead of updating nodes in the heap when we find better paths, we push new entries and skip stale ones when popping. This is simpler and often more efficient than trying to update heap elements in-place.

Related problems: [Minimum Path Sum](/problem/minimum-path-sum), [Number of Restricted Paths From First to Last Node](/problem/number-of-restricted-paths-from-first-to-last-node)
