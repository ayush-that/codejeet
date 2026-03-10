---
title: "How to Solve Minimum Cost Path with Teleportations — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost Path with Teleportations. Hard difficulty, 45.7% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2028-03-10"
category: "dsa-patterns"
tags: ["minimum-cost-path-with-teleportations", "array", "dynamic-programming", "matrix", "hard"]
---

# How to Solve Minimum Cost Path with Teleportations

This problem asks us to find the minimum cost to travel from the top-left to bottom-right corner of a grid, but with a twist: we can make normal moves (right or down) costing the value of the destination cell, OR we can teleport to any cell with the same value as our current cell for free. The challenge is balancing when to use expensive normal moves versus when to strategically teleport to bypass costly sections of the grid.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
[1, 3, 1]
[2, 1, 2]
[1, 3, 1]

k = 3 (teleportation range doesn't apply here since we can teleport anywhere with same value)
```

**Step 1:** Start at (0,0) with value 1. Cost so far: 0 (starting cell doesn't count)

**Step 2:** Options:

- Move right to (0,1): cost = 3
- Move down to (1,0): cost = 2
- Teleport to any other cell with value 1: (0,2), (2,0), (2,2) all free

**Step 3:** Smart strategy: Teleport from (0,0) to (0,2) for free. Now at (0,2) with value 1.

**Step 4:** From (0,2), move down to (1,2): cost = 2

**Step 5:** From (1,2), move down to (2,2): cost = 1

**Total cost:** 0 (start) + 0 (teleport) + 2 + 1 = 3

Without teleportation, the minimum path would be (0,0)→(0,1)→(0,2)→(1,2)→(2,2) costing 3+1+2+1=7, or (0,0)→(1,0)→(1,1)→(1,2)→(2,2) costing 2+1+2+1=6. Teleportation saves us 3-4 points!

The key insight: Cells with the same value form "teleportation networks" where we can jump between them for free once we've paid to reach any cell in that network.

## Brute Force Approach

A naive approach would be to treat this as a graph search problem where:

1. Each cell is a node
2. Edges exist for: right moves, down moves, and teleports to same-valued cells
3. Use Dijkstra's algorithm to find the shortest path

However, the teleportation edges create a problem: if we add edges from every cell to every other cell with the same value, we get O((mn)²) edges for an m×n grid. Even with Dijkstra's O(E log V) complexity, this becomes O((mn)² log(mn)) which is infeasible for typical constraints.

What candidates might try:

- Pure DFS exploring all paths: O(2^(m+n)) - exponential explosion
- BFS treating teleports as zero-cost moves: Still O((mn)²) edges
- DP without considering teleportation reuse: Would miss optimal paths that use the same teleport network multiple times

The brute force fails because it doesn't efficiently handle the "once you pay to enter a value group, you can teleport within it for free" property.

## Optimized Approach

The key insight is that **teleportation creates equivalence classes of cells with the same value**. Once we pay to reach ANY cell with value v, we can instantly reach ALL cells with value v for free.

This leads to a two-layer Dijkstra approach:

1. **Cell Layer**: Normal grid movement between adjacent cells
2. **Value Layer**: Teleportation between cells sharing the same value

**Step-by-step reasoning:**

1. We maintain `dist[i][j]` = minimum cost to reach cell (i,j)
2. When we first reach a cell with value v, we "activate" the teleportation network for value v
3. All other cells with value v can now be reached with the same cost (since teleportation is free)
4. We use Dijkstra's algorithm with a priority queue to always expand the cheapest path first
5. Crucial optimization: Instead of adding edges from each cell to all same-valued cells (O(n²)), we process all cells of a value group together when first reached

**Why this works:**

- If reaching cell A with value v costs C, then reaching ANY cell with value v should cost at most C
- We propagate this through Dijkstra: when we pop a cell from the priority queue, if it's the first time we're seeing its value, we update all cells with that value
- This is O(mn log(mn)) instead of O((mn)² log(mn))

## Optimal Solution

Here's the complete implementation using Dijkstra with value-group optimization:

<div class="code-group">

```python
# Time: O(mn log(mn)) | Space: O(mn)
def minCost(grid, k):
    """
    Find minimum cost path with teleportation ability.

    Args:
        grid: 2D list of integers
        k: teleportation range (not used in this version)

    Returns:
        Minimum cost to reach bottom-right corner
    """
    m, n = len(grid), len(grid[0])

    # Map each value to list of positions having that value
    value_map = {}
    for i in range(m):
        for j in range(n):
            val = grid[i][j]
            if val not in value_map:
                value_map[val] = []
            value_map[val].append((i, j))

    # Distance matrix: minimum cost to reach each cell
    dist = [[float('inf')] * n for _ in range(m)]
    dist[0][0] = 0  # Start cell cost is 0 (we don't count starting cell)

    # Priority queue: (cost, row, col)
    import heapq
    pq = [(0, 0, 0)]

    # Track which value groups have been "activated" (teleportation available)
    activated = set()

    # Dijkstra's algorithm
    while pq:
        cost, i, j = heapq.heappop(pq)

        # If we found a better path to this cell since it was added to pq, skip
        if cost > dist[i][j]:
            continue

        # If this is the first time reaching a cell with this value,
        # activate teleportation for all cells with same value
        val = grid[i][j]
        if val not in activated:
            activated.add(val)
            # Update all cells with same value to have at most this cost
            for x, y in value_map[val]:
                if dist[x][y] > cost:  # Only update if we found a cheaper path
                    dist[x][y] = cost
                    heapq.heappush(pq, (cost, x, y))

        # Explore normal moves: right and down
        # Right move
        if j + 1 < n:
            new_cost = cost + grid[i][j + 1]
            if new_cost < dist[i][j + 1]:
                dist[i][j + 1] = new_cost
                heapq.heappush(pq, (new_cost, i, j + 1))

        # Down move
        if i + 1 < m:
            new_cost = cost + grid[i + 1][j]
            if new_cost < dist[i + 1][j]:
                dist[i + 1][j] = new_cost
                heapq.heappush(pq, (new_cost, i + 1, j))

    return dist[m - 1][n - 1]
```

```javascript
// Time: O(mn log(mn)) | Space: O(mn)
function minCost(grid, k) {
  const m = grid.length;
  const n = grid[0].length;

  // Map each value to list of positions having that value
  const valueMap = new Map();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const val = grid[i][j];
      if (!valueMap.has(val)) {
        valueMap.set(val, []);
      }
      valueMap.get(val).push([i, j]);
    }
  }

  // Distance matrix: minimum cost to reach each cell
  const dist = Array(m)
    .fill()
    .map(() => Array(n).fill(Infinity));
  dist[0][0] = 0; // Start cell cost is 0

  // Min-heap priority queue: [cost, row, col]
  const pq = new MinHeap((a, b) => a[0] - b[0]);
  pq.push([0, 0, 0]);

  // Track which value groups have been activated
  const activated = new Set();

  // Dijkstra's algorithm
  while (!pq.isEmpty()) {
    const [cost, i, j] = pq.pop();

    // Skip if we found a better path since this was added
    if (cost > dist[i][j]) continue;

    // Activate teleportation for this value if first time
    const val = grid[i][j];
    if (!activated.has(val)) {
      activated.add(val);

      // Update all cells with same value
      const sameValueCells = valueMap.get(val);
      for (const [x, y] of sameValueCells) {
        if (dist[x][y] > cost) {
          dist[x][y] = cost;
          pq.push([cost, x, y]);
        }
      }
    }

    // Explore normal moves
    // Right move
    if (j + 1 < n) {
      const newCost = cost + grid[i][j + 1];
      if (newCost < dist[i][j + 1]) {
        dist[i][j + 1] = newCost;
        pq.push([newCost, i, j + 1]);
      }
    }

    // Down move
    if (i + 1 < m) {
      const newCost = cost + grid[i + 1][j];
      if (newCost < dist[i + 1][j]) {
        dist[i + 1][j] = newCost;
        pq.push([newCost, i + 1, j]);
      }
    }
  }

  return dist[m - 1][n - 1];
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
// Time: O(mn log(mn)) | Space: O(mn)
import java.util.*;

class Solution {
    public int minCost(int[][] grid, int k) {
        int m = grid.length;
        int n = grid[0].length;

        // Map each value to list of positions
        Map<Integer, List<int[]>> valueMap = new HashMap<>();
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int val = grid[i][j];
                valueMap.computeIfAbsent(val, key -> new ArrayList<>()).add(new int[]{i, j});
            }
        }

        // Distance matrix
        int[][] dist = new int[m][n];
        for (int i = 0; i < m; i++) {
            Arrays.fill(dist[i], Integer.MAX_VALUE);
        }
        dist[0][0] = 0;

        // Priority queue: (cost, row, col)
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, 0, 0});

        // Track activated value groups
        Set<Integer> activated = new HashSet<>();

        // Dijkstra's algorithm
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int cost = curr[0];
            int i = curr[1];
            int j = curr[2];

            // Skip if we have a better path now
            if (cost > dist[i][j]) continue;

            // Activate teleportation for this value if first time
            int val = grid[i][j];
            if (!activated.contains(val)) {
                activated.add(val);

                // Update all cells with same value
                List<int[]> sameValueCells = valueMap.get(val);
                for (int[] pos : sameValueCells) {
                    int x = pos[0];
                    int y = pos[1];
                    if (dist[x][y] > cost) {
                        dist[x][y] = cost;
                        pq.offer(new int[]{cost, x, y});
                    }
                }
            }

            // Explore normal moves
            // Right move
            if (j + 1 < n) {
                int newCost = cost + grid[i][j + 1];
                if (newCost < dist[i][j + 1]) {
                    dist[i][j + 1] = newCost;
                    pq.offer(new int[]{newCost, i, j + 1});
                }
            }

            // Down move
            if (i + 1 < m) {
                int newCost = cost + grid[i + 1][j];
                if (newCost < dist[i + 1][j]) {
                    dist[i + 1][j] = newCost;
                    pq.offer(new int[]{newCost, i + 1, j});
                }
            }
        }

        return dist[m - 1][n - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(mn log(mn))

- We process each cell at most once when it's popped from the priority queue: O(mn)
- Each pop/push operation on the priority queue is O(log(mn))
- When we activate a value group, we process all cells with that value, but each cell only gets activated once for its value group
- Total operations: O(mn log(mn))

**Space Complexity:** O(mn)

- `dist` matrix: O(mn)
- `value_map` stores all cell positions: O(mn)
- Priority queue can contain up to O(mn) elements
- `activated` set: O(unique values) ≤ O(mn)

## Common Mistakes

1. **Forgetting to skip outdated queue entries**: In Dijkstra, when you pop from the priority queue, you must check if the cost matches the current `dist[i][j]`. If not, someone found a better path since this was added to the queue.

2. **Adding teleport edges explicitly**: Creating actual edges from each cell to all same-valued cells creates O((mn)²) edges. The optimization is to process value groups lazily when first reached.

3. **Counting starting cell cost**: The problem states you start at (0,0) - you don't pay the cost of the starting cell, only destination cells for moves.

4. **Only moving right/down**: Remember teleportation can move to any cell with same value, not just adjacent ones. This means you might teleport "backwards" or "upwards" if it helps reach the goal cheaper.

## When You'll See This Pattern

This problem combines **Dijkstra's shortest path** with **value grouping optimization**, a pattern seen in:

1. **Cheapest Flights Within K Stops (LeetCode 787)**: Similar layered Dijkstra where you track both cost and stops used.

2. **Network Delay Time (LeetCode 743)**: Standard Dijkstra in a weighted graph, but here the graph structure is implicit.

3. **Minimum Cost to Make at Least One Valid Path in a Grid (LeetCode 1368)**: Also uses Dijkstra on a grid with special movement rules.

The core pattern is: **When you have equivalence classes where reaching one member gives access to all members, process the entire class together when first reached.**

## Key Takeaways

1. **Teleportation creates equivalence classes**: Cells with the same value form groups where teleportation is free. This transforms the problem from pure grid traversal to a graph with special edges.

2. **Lazy activation is key**: Instead of pre-computing all teleport edges (O(n²)), activate value groups only when first reached during Dijkstra traversal.

3. **Dijkstra works on implicit graphs**: You don't need to build the entire graph upfront. You can generate neighbors on-the-fly as you explore.

[Practice this problem on CodeJeet](/problem/minimum-cost-path-with-teleportations)
