---
title: "How to Solve As Far from Land as Possible — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode As Far from Land as Possible. Medium difficulty, 52.2% acceptance rate. Topics: Array, Dynamic Programming, Breadth-First Search, Matrix."
date: "2026-03-27"
category: "dsa-patterns"
tags:
  ["as-far-from-land-as-possible", "array", "dynamic-programming", "breadth-first-search", "medium"]
---

# How to Solve "As Far from Land as Possible"

This problem asks us to find the water cell (value 0) that is farthest from any land cell (value 1) in an n×n grid, using Manhattan distance. The challenge is that we need to compute distances from every land cell to every water cell efficiently. A brute force approach would be too slow for larger grids, so we need a clever way to propagate distances from all land cells simultaneously.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
0 0 0
0 1 0
0 0 0
```

We want to find the water cell farthest from land. The land cell is at (1,1). Let's compute distances:

- (0,0): distance = |0-1| + |0-1| = 2
- (0,1): distance = |0-1| + |1-1| = 1
- (0,2): distance = |0-1| + |2-1| = 2
- (1,0): distance = |1-1| + |0-1| = 1
- (1,2): distance = |1-1| + |2-1| = 1
- (2,0): distance = |2-1| + |0-1| = 2
- (2,1): distance = |2-1| + |1-1| = 1
- (2,2): distance = |2-1| + |2-1| = 2

The maximum distance is 2, so the answer is 2. Notice that the corners are farthest from the center.

Now consider a more complex example:

```
Grid:
1 0 0
0 0 0
0 0 1
```

We have land at (0,0) and (2,2). The key insight: we need to find the water cell whose minimum distance to ANY land cell is maximized. We can think of this as a multi-source BFS problem where we start from all land cells simultaneously and expand outward.

## Brute Force Approach

The most straightforward approach is:

1. For each water cell (0), compute its distance to every land cell (1)
2. Track the minimum distance from that water cell to any land cell
3. Return the maximum of these minimum distances

This would require O(n²) water cells × O(n²) land cells = O(n⁴) operations, which is far too slow for n up to 100 (10⁸ operations).

Even with optimization (storing land positions), we'd still need O(n⁴) in worst case when half the cells are land. We need a better approach.

## Optimized Approach

The key insight is that this is essentially a **multi-source BFS** problem. Think of it as starting a wave from every land cell simultaneously and seeing how far the wave needs to travel to reach each water cell. The distance a water cell gets "hit" by the wave is its distance to the nearest land cell.

Why BFS works:

1. BFS explores cells in increasing distance order from the starting points
2. When we start from ALL land cells simultaneously, the first time we visit a water cell gives us its minimum distance to any land cell
3. The last water cell visited will have the maximum minimum distance

This is similar to computing the "distance transform" of a binary image, where we want to find the distance from each pixel to the nearest foreground pixel.

## Optimal Solution

We'll use a BFS approach starting from all land cells:

1. Add all land cells to a queue with distance 0
2. Use BFS to expand outward, marking distances as we go
3. Track the maximum distance we encounter
4. If no water exists (all land) or no land exists (all water), return -1

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²)
from collections import deque

def maxDistance(grid):
    n = len(grid)
    queue = deque()

    # Step 1: Add all land cells to the queue
    for i in range(n):
        for j in range(n):
            if grid[i][j] == 1:
                queue.append((i, j, 0))  # (row, col, distance)

    # If all cells are land or all are water, return -1
    if len(queue) == 0 or len(queue) == n * n:
        return -1

    max_distance = 0
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

    # Step 2: Perform BFS from all land cells simultaneously
    while queue:
        row, col, dist = queue.popleft()

        # Explore all 4 neighbors
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check if neighbor is within bounds and is water (0)
            if 0 <= new_row < n and 0 <= new_col < n and grid[new_row][new_col] == 0:
                # Mark as visited by setting to 1 (or any non-zero value)
                grid[new_row][new_col] = 1
                # New distance is current distance + 1
                new_dist = dist + 1
                # Update maximum distance
                max_distance = max(max_distance, new_dist)
                # Add to queue for further expansion
                queue.append((new_row, new_col, new_dist))

    return max_distance
```

```javascript
// Time: O(n²) | Space: O(n²)
function maxDistance(grid) {
  const n = grid.length;
  const queue = [];

  // Step 1: Add all land cells to the queue
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        queue.push([i, j, 0]); // [row, col, distance]
      }
    }
  }

  // If all cells are land or all are water, return -1
  if (queue.length === 0 || queue.length === n * n) {
    return -1;
  }

  let maxDistance = 0;
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Step 2: Perform BFS from all land cells simultaneously
  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();

    // Explore all 4 neighbors
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if neighbor is within bounds and is water (0)
      if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n && grid[newRow][newCol] === 0) {
        // Mark as visited by setting to 1
        grid[newRow][newCol] = 1;
        // New distance is current distance + 1
        const newDist = dist + 1;
        // Update maximum distance
        maxDistance = Math.max(maxDistance, newDist);
        // Add to queue for further expansion
        queue.push([newRow, newCol, newDist]);
      }
    }
  }

  return maxDistance;
}
```

```java
// Time: O(n²) | Space: O(n²)
import java.util.LinkedList;
import java.util.Queue;

public class Solution {
    public int maxDistance(int[][] grid) {
        int n = grid.length;
        Queue<int[]> queue = new LinkedList<>();

        // Step 1: Add all land cells to the queue
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    queue.offer(new int[]{i, j, 0});  // {row, col, distance}
                }
            }
        }

        // If all cells are land or all are water, return -1
        if (queue.isEmpty() || queue.size() == n * n) {
            return -1;
        }

        int maxDistance = 0;
        int[][] directions = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

        // Step 2: Perform BFS from all land cells simultaneously
        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];
            int dist = current[2];

            // Explore all 4 neighbors
            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                // Check if neighbor is within bounds and is water (0)
                if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n && grid[newRow][newCol] == 0) {
                    // Mark as visited by setting to 1
                    grid[newRow][newCol] = 1;
                    // New distance is current distance + 1
                    int newDist = dist + 1;
                    // Update maximum distance
                    maxDistance = Math.max(maxDistance, newDist);
                    // Add to queue for further expansion
                    queue.offer(new int[]{newRow, newCol, newDist});
                }
            }
        }

        return maxDistance;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We visit each cell at most once during BFS
- Each visit processes 4 neighbors, but this is constant work per cell
- Total operations: O(4 × n²) = O(n²)

**Space Complexity:** O(n²)

- In the worst case, the queue could contain all cells (when starting BFS)
- This happens when all cells are land, but we return early in that case
- In practice, queue size is O(n²) in worst case (e.g., a single land cell in the center)

## Common Mistakes

1. **Forgetting edge cases:** Not handling the cases where there's no land or no water. Always check if queue is empty (no land) or if queue contains all cells (no water).

2. **Using DFS instead of BFS:** DFS doesn't guarantee we find the shortest path to each water cell. BFS explores in increasing distance order, which is crucial for finding minimum distances.

3. **Not marking visited cells:** If you don't mark cells as visited (by changing 0 to 1 or using a separate visited array), you'll get infinite loops or incorrect distances.

4. **Incorrect distance calculation:** Some candidates try to compute distances using Manhattan formula for each pair, which is O(n⁴). The BFS approach naturally computes Manhattan distances because we only move in 4 directions.

## When You'll See This Pattern

This multi-source BFS pattern appears in several grid-based problems:

1. **Shortest Distance from All Buildings (Hard):** Similar concept but with obstacles and multiple sources. You need to track distances from each building and find cells reachable from all buildings.

2. **Rotting Oranges (Medium):** Multi-source BFS where rotten oranges infect fresh ones. The time until all oranges are rotten is like the maximum distance.

3. **Walls and Gates (Medium):** Fill each empty room with the distance to the nearest gate, which is exactly this pattern.

The key signature is: "Find the minimum distance from each cell to the nearest source cell" where there are multiple sources.

## Key Takeaways

1. **Multi-source BFS** is the go-to technique when you need to find distances from multiple starting points simultaneously. Initialize your queue with all sources.

2. **BFS guarantees shortest paths** in unweighted grids. When you only move in 4 directions, BFS naturally computes Manhattan distances.

3. **Early termination conditions** are important. Check for edge cases like all land or all water before starting the main algorithm.

Related problems: [Shortest Distance from All Buildings](/problem/shortest-distance-from-all-buildings), [K Highest Ranked Items Within a Price Range](/problem/k-highest-ranked-items-within-a-price-range), [Maximum Manhattan Distance After K Changes](/problem/maximum-manhattan-distance-after-k-changes)
