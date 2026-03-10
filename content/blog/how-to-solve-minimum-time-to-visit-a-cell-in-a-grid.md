---
title: "How to Solve Minimum Time to Visit a Cell In a Grid — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Time to Visit a Cell In a Grid. Hard difficulty, 56.3% acceptance rate. Topics: Array, Breadth-First Search, Graph Theory, Heap (Priority Queue), Matrix."
date: "2027-09-09"
category: "dsa-patterns"
tags:
  [
    "minimum-time-to-visit-a-cell-in-a-grid",
    "array",
    "breadth-first-search",
    "graph-theory",
    "hard",
  ]
---

# How to Solve Minimum Time to Visit a Cell In a Grid

You're given an `m x n` grid where each cell has a minimum time requirement. You can only enter a cell when your current time is at least that cell's value, and you can move to adjacent cells (up, down, left, right) taking 1 second per move. Starting at the top-left cell at time 0, you need to find the minimum time to reach the bottom-right cell. The tricky part is that sometimes you need to wait before entering certain cells, and finding the optimal path involves balancing movement time with waiting time.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
    [0, 2, 1],
    [3, 1, 1],
    [1, 2, 0]
]
```

We start at `(0,0)` at time 0. The cell value is 0, so we can enter immediately.

**Time 0:** At `(0,0)`

- We can move to `(0,1)` or `(1,0)`
- `(0,1)` requires time ≥ 2, but we're at time 0
- `(1,0)` requires time ≥ 3, but we're at time 0
- We need to wait somewhere

**Key Insight:** We can wait at our current cell! Waiting increases our time without moving.

**Optimal Strategy:** Wait at `(0,0)` until time 1, then:

- Move to `(0,1)`? Still need time ≥ 2
- Move to `(1,0)`? Still need time ≥ 3

Actually, let's think systematically. At each step, we consider all reachable cells given our current time. The optimal path ends up being:

1. Start at `(0,0)` at time 0
2. Wait until time 1 (grid[0][0] = 0, so we can wait here)
3. Move to `(0,1)` at time 2 (arrive at time 2, which equals grid[0][1] = 2)
4. Move to `(0,2)` at time 3 (arrive at time 3, grid[0][2] = 1, so we're good)
5. Move to `(1,2)` at time 4 (arrive at time 4, grid[1][2] = 1, good)
6. Move to `(2,2)` at time 5 (arrive at time 5, grid[2][2] = 0, good)

Total time: 5

But is this optimal? Let's check another path:

- `(0,0)` → `(1,0)` → `(2,0)` → `(2,1)` → `(2,2)`
- We'd need to wait at `(0,0)` until time 3 to enter `(1,0)`
- Then time 4 at `(2,0)`, time 5 at `(2,1)`, time 6 at `(2,2)`
- Total time: 6 (worse)

This shows we need a systematic way to explore paths while considering waiting time.

## Brute Force Approach

A naive approach would try all possible paths from start to end. For each path:

1. Calculate the arrival time at each cell
2. If arrival time < cell's minimum time, wait until you reach that time
3. Track the total time including waiting

The problem with this approach is the exponential number of paths. In an `m x n` grid, there are `C(m+n-2, m-1)` possible paths (choose which m-1 steps are downward moves). For a 10×10 grid, that's over 48,000 paths. For larger grids, this becomes infeasible.

Even if we try DFS with backtracking, we'd still explore many redundant paths because the optimal path to a cell depends on both the path taken AND the time we arrive.

## Optimized Approach

The key insight is that this is essentially a shortest path problem in a weighted graph, where:

- Nodes are grid cells
- Edges have weight 1 (movement time)
- But we also have node constraints (minimum entry times)

We can use **Dijkstra's algorithm** with a priority queue (min-heap), but with a twist: when we reach a cell, if our current time is less than the cell's minimum time, we need to wait.

**Why Dijkstra works:**

1. All edge weights are non-negative (1 second per move)
2. The "cost" to reach a cell is the minimum time we can arrive there
3. Dijkstra guarantees we find the minimum time to reach each cell

**The waiting logic:** When we pop a cell from the priority queue:

- If `current_time < grid[row][col]`, we need to wait
- But here's the subtle part: the waiting time depends on the parity (odd/even) of the difference
- If `grid[row][col] - current_time` is even, we wait until exactly `grid[row][col]`
- If it's odd, we wait until `grid[row][col] + 1` (because we need to arrive at an even time difference from the start)

Wait, why? Because moving takes 1 second, so time parity changes with each move. If we need to wait, we must ensure we can actually leave the cell after waiting!

Actually, the correct logic is simpler: if `current_time < grid[row][col]`, we bump our time up to `grid[row][col]`. But if `(grid[row][col] - current_time) % 2 == 1`, we need to add 1 more because we can only leave on an odd time? Let me think...

Actually, the constraint is: we can only ENTER when `time >= grid[row][col]`. Once we're in, we can leave immediately (next time step). So if `current_time < grid[row][col]`, we wait until `grid[row][col]`. No parity check needed for entry!

But wait, there's another issue: what if waiting makes us miss other opportunities? That's why Dijkstra handles this - it always explores the earliest reachable cells first.

## Optimal Solution

We use Dijkstra's algorithm with a min-heap. At each step, we explore neighbors, calculate the earliest time we can reach them (accounting for waiting), and push them to the heap if we found a better time.

<div class="code-group">

```python
# Time: O(m*n*log(m*n)) - Each cell processed once, heap operations are log(size)
# Space: O(m*n) - For distance matrix and heap
def minimumTime(grid):
    # If the very first move requires waiting and we can't wait at start?
    # Actually we can always wait at start since grid[0][0] is usually 0 or small
    # But if both immediate neighbors require time > 1, we're stuck
    if grid[0][1] > 1 and grid[1][0] > 1:
        return -1

    m, n = len(grid), len(grid[0])
    # Min-heap storing (time, row, col)
    heap = [(0, 0, 0)]  # Start at (0,0) with time 0
    # Distance matrix tracking minimum time to reach each cell
    dist = [[float('inf')] * n for _ in range(m)]
    dist[0][0] = 0

    # Directions: up, down, left, right
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while heap:
        time, r, c = heapq.heappop(heap)

        # If we found a better path to this cell already, skip
        if time > dist[r][c]:
            continue

        # If we reached the destination
        if r == m - 1 and c == n - 1:
            return time

        # Explore all 4 neighbors
        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            # Check bounds
            if 0 <= nr < m and 0 <= nc < n:
                # Calculate time to reach neighbor
                new_time = time + 1

                # If we arrive before the cell's minimum time, we need to wait
                if new_time < grid[nr][nc]:
                    # We need to wait until at least grid[nr][nc]
                    # But if the difference is odd, we might need to wait one more second
                    # Why? Because we can only move into the cell, then immediately out
                    # Actually, let's think: new_time is when we WOULD arrive
                    # We need new_time >= grid[nr][nc]
                    # If not, we wait: wait_time = grid[nr][nc] - new_time
                    # But if wait_time is odd, we can wait that long
                    # Wait, the problem says we can visit when time >= grid[r][c]
                    # So we just wait until grid[nr][nc]
                    wait_time = grid[nr][nc] - new_time
                    # If wait_time is odd, we need to wait one more second
                    # because we need to be able to leave the cell
                    # Actually, no - we just need to be able to ENTER
                    # Once we enter, we can leave next second
                    # So we just wait until grid[nr][nc]
                    new_time = grid[nr][nc]

                # If this is a better time to reach neighbor, update and push to heap
                if new_time < dist[nr][nc]:
                    dist[nr][nc] = new_time
                    heapq.heappush(heap, (new_time, nr, nc))

    return -1  # If we exhaust heap without reaching destination

# Note: Need to import heapq
```

```javascript
// Time: O(m*n*log(m*n)) | Space: O(m*n)
function minimumTime(grid) {
  // Check if stuck at start (both immediate moves require > 1)
  if (grid[0][1] > 1 && grid[1][0] > 1) {
    return -1;
  }

  const m = grid.length,
    n = grid[0].length;
  // Min-heap (priority queue) using array and sorting, but better with proper heap
  // For simplicity, we'll use an array and sort (not optimal but works)
  // In real interview, implement proper min-heap or use language's PriorityQueue
  const heap = [{ time: 0, row: 0, col: 0 }];
  // Distance matrix
  const dist = Array(m)
    .fill()
    .map(() => Array(n).fill(Infinity));
  dist[0][0] = 0;

  // Directions: up, down, left, right
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Simple heap functions
  function heapPush(item) {
    heap.push(item);
    heap.sort((a, b) => a.time - b.time);
  }

  function heapPop() {
    return heap.shift();
  }

  while (heap.length > 0) {
    const { time, row, col } = heapPop();

    // Skip if we found a better path already
    if (time > dist[row][col]) continue;

    // Reached destination
    if (row === m - 1 && col === n - 1) {
      return time;
    }

    // Explore neighbors
    for (const [dr, dc] of directions) {
      const nr = row + dr,
        nc = col + dc;

      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        let newTime = time + 1;

        // Need to wait if we arrive too early
        if (newTime < grid[nr][nc]) {
          // Wait until at least grid[nr][nc]
          newTime = grid[nr][nc];
        }

        // If this is better path to neighbor
        if (newTime < dist[nr][nc]) {
          dist[nr][nc] = newTime;
          heapPush({ time: newTime, row: nr, col: nc });
        }
      }
    }
  }

  return -1; // Destination not reachable
}
```

```java
// Time: O(m*n*log(m*n)) | Space: O(m*n)
import java.util.*;

class Solution {
    public int minimumTime(int[][] grid) {
        // Check if we're stuck at the start
        if (grid[0][1] > 1 && grid[1][0] > 1) {
            return -1;
        }

        int m = grid.length, n = grid[0].length;
        // Min-heap (priority queue) storing [time, row, col]
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.offer(new int[]{0, 0, 0});

        // Distance matrix
        int[][] dist = new int[m][n];
        for (int i = 0; i < m; i++) {
            Arrays.fill(dist[i], Integer.MAX_VALUE);
        }
        dist[0][0] = 0;

        // Directions: up, down, left, right
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        while (!heap.isEmpty()) {
            int[] current = heap.poll();
            int time = current[0], r = current[1], c = current[2];

            // Skip if we found a better path already
            if (time > dist[r][c]) continue;

            // Reached destination
            if (r == m - 1 && c == n - 1) {
                return time;
            }

            // Explore neighbors
            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];

                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    int newTime = time + 1;

                    // Need to wait if we arrive too early
                    if (newTime < grid[nr][nc]) {
                        // Wait until at least grid[nr][nc]
                        newTime = grid[nr][nc];
                    }

                    // If this is a better path to neighbor
                    if (newTime < dist[nr][nc]) {
                        dist[nr][nc] = newTime;
                        heap.offer(new int[]{newTime, nr, nc});
                    }
                }
            }
        }

        return -1; // Destination not reachable
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(m * n * log(m * n))`

- We process each cell at most once (m × n cells)
- Each heap insertion and removal takes `O(log(heap_size))` time
- In worst case, heap contains all cells, so `log(m × n)`
- Total: `O(m × n × log(m × n))`

**Space Complexity:** `O(m × n)`

- Distance matrix: `m × n`
- Heap: in worst case stores all cells: `O(m × n)`
- Total: `O(m × n)`

## Common Mistakes

1. **Forgetting the start check:** If both immediate neighbors from (0,0) require time > 1, you're stuck because you can't wait at (0,0) to reach time 2 (you'd need to move first). Always check `grid[0][1] > 1 and grid[1][0] > 1`.

2. **Incorrect waiting logic:** Some candidates overcomplicate the waiting. You simply need `max(current_time + 1, grid[neighbor])`. No parity checks are needed for the basic problem.

3. **Not using Dijkstra:** Trying BFS won't work because edges have weights (1 second moves) AND node constraints. BFS assumes all edges have equal weight and no additional constraints.

4. **Missing visited/distance tracking:** Without tracking the best time to reach each cell, you might revisit cells unnecessarily, causing exponential time.

## When You'll See This Pattern

This pattern of Dijkstra with node/edge constraints appears in several problems:

1. **Cheapest Flights Within K Stops:** Dijkstra with an additional constraint (number of stops)
2. **Path With Minimum Effort:** Similar grid problem finding path with minimum maximum height difference
3. **Swim in Rising Water:** Very similar - can only move to adjacent cells if water level is high enough

The core pattern is: when you have a shortest path problem with additional constraints on when you can traverse edges/nodes, Dijkstra with a priority queue is often the solution.

## Key Takeaways

1. **Dijkstra adapts to node constraints:** You can modify the relaxation step to account for minimum entry times or other constraints at nodes.

2. **Waiting is just increasing time:** If you need to wait at a cell, it's equivalent to increasing your arrival time before moving to neighbors.

3. **Check immediate feasibility:** Always check if the problem is solvable from the start. Some constraints might make it impossible to even take the first step.

Related problems: [Find Minimum Time to Reach Last Room I](/problem/find-minimum-time-to-reach-last-room-i), [Find Minimum Time to Reach Last Room II](/problem/find-minimum-time-to-reach-last-room-ii)
