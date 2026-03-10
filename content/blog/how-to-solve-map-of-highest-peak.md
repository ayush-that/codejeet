---
title: "How to Solve Map of Highest Peak — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Map of Highest Peak. Medium difficulty, 75.7% acceptance rate. Topics: Array, Breadth-First Search, Matrix."
date: "2026-07-30"
category: "dsa-patterns"
tags: ["map-of-highest-peak", "array", "breadth-first-search", "matrix", "medium"]
---

# How to Solve Map of Highest Peak

This problem asks us to assign heights to a grid where water cells have height 0, and every adjacent cell's height differs by at most 1. The challenge is finding the **maximum possible height** for each land cell while respecting these constraints. What makes this interesting is that it's essentially finding the **distance from each cell to the nearest water cell**, but with the twist that we need to maximize heights while maintaining valid differences between neighbors.

## Visual Walkthrough

Let's trace through a small example:

```
isWater = [[0,0,1],
           [1,0,0]]
```

**Step 1:** Start with all water cells at height 0. We'll mark unknown land cells with -1:

```
Heights: [-1, -1,  0]
         [ 0, -1, -1]
```

**Step 2:** Process water cells first (BFS starting point). From (0,2):

- Check neighbor (0,1): Set to height 1
- Check neighbor (1,2): Set to height 1

**Step 3:** From (1,0):

- Check neighbor (0,0): Set to height 1
- Check neighbor (1,1): Set to height 1

Now we have:

```
Heights: [ 1,  1,  0]
         [ 0,  1,  1]
```

**Step 4:** Process cells at height 1. From (0,0):

- No new neighbors (all visited)

From (0,1):

- No new neighbors

From (1,1):

- Check neighbor (1,2): Already set to 1 ✓

From (1,2):

- No new neighbors

**Final heights:**

```
[[1,1,0],
 [0,1,1]]
```

This satisfies all constraints: water at 0, adjacent cells differ by at most 1, and we've maximized heights.

## Brute Force Approach

A naive approach might try to assign heights greedily or use DFS from each cell. One brute force idea:

1. Start with water cells at height 0
2. For each land cell, try assigning the maximum possible height
3. Check if the assignment violates constraints with neighbors
4. Backtrack if needed

The problem with this approach is **exponential time complexity**. With an m×n grid, we could have O(m×n!) possibilities to check. Even smarter brute force would be O((m×n)²) by checking distances manually.

The key insight is that this is essentially a **multi-source BFS problem**: we need the shortest distance from each cell to any water cell, but we want to maximize heights, which means we want the **maximum minimum distance**.

## Optimized Approach

The optimal solution uses **Breadth-First Search (BFS)** starting from all water cells simultaneously:

1. **Initialize**: Create a result matrix with water cells set to 0 and land cells set to -1 (unvisited)
2. **Queue initialization**: Add all water cells to a queue (these are our BFS starting points)
3. **BFS traversal**: Process cells level by level:
   - For each cell, check its four neighbors
   - If a neighbor is unvisited (-1), set its height to current height + 1
   - Add the neighbor to the queue for processing
4. **Continue** until all cells are visited

Why BFS works:

- BFS guarantees we visit cells in order of increasing distance from water sources
- The first time we visit a land cell, we're giving it the smallest possible height that satisfies constraints
- Since we process from multiple sources simultaneously, each cell gets the minimum distance to ANY water cell
- The "maximum possible height" constraint is satisfied because we're using the minimum distance

## Optimal Solution

<div class="code-group">

```python
# Time: O(m*n) | Space: O(m*n)
def highestPeak(isWater):
    """
    Calculate the highest possible peak for each cell in the grid.

    Args:
        isWater: 2D list where 1 represents water, 0 represents land

    Returns:
        2D list of heights where water=0 and land heights are maximized
    """
    m, n = len(isWater), len(isWater[0])

    # Initialize result matrix with -1 for unvisited cells
    height = [[-1] * n for _ in range(m)]

    # Queue for BFS - will store (row, col) tuples
    from collections import deque
    queue = deque()

    # Step 1: Initialize all water cells as starting points
    for i in range(m):
        for j in range(n):
            if isWater[i][j] == 1:
                height[i][j] = 0  # Water cells have height 0
                queue.append((i, j))  # Add to BFS queue

    # Directions: up, down, left, right
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    # Step 2: Perform BFS from all water cells simultaneously
    while queue:
        row, col = queue.popleft()
        current_height = height[row][col]

        # Check all four neighbors
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check if neighbor is within bounds and unvisited
            if (0 <= new_row < m and 0 <= new_col < n and
                height[new_row][new_col] == -1):

                # Assign height: current cell's height + 1
                height[new_row][new_col] = current_height + 1
                queue.append((new_row, new_col))

    return height
```

```javascript
// Time: O(m*n) | Space: O(m*n)
/**
 * Calculate the highest possible peak for each cell in the grid.
 * @param {number[][]} isWater - 2D array where 1=water, 0=land
 * @return {number[][]} 2D array of heights
 */
function highestPeak(isWater) {
  const m = isWater.length;
  const n = isWater[0].length;

  // Initialize result matrix with -1 for unvisited cells
  const height = Array(m)
    .fill()
    .map(() => Array(n).fill(-1));

  // Queue for BFS
  const queue = [];

  // Step 1: Initialize all water cells as starting points
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (isWater[i][j] === 1) {
        height[i][j] = 0; // Water cells have height 0
        queue.push([i, j]); // Add to BFS queue
      }
    }
  }

  // Directions: up, down, left, right
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Step 2: Perform BFS from all water cells simultaneously
  let index = 0; // Manual queue index to avoid shift() O(n) cost
  while (index < queue.length) {
    const [row, col] = queue[index];
    index++;
    const currentHeight = height[row][col];

    // Check all four neighbors
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if neighbor is within bounds and unvisited
      if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n && height[newRow][newCol] === -1) {
        // Assign height: current cell's height + 1
        height[newRow][newCol] = currentHeight + 1;
        queue.push([newRow, newCol]);
      }
    }
  }

  return height;
}
```

```java
// Time: O(m*n) | Space: O(m*n)
import java.util.LinkedList;
import java.util.Queue;

class Solution {
    public int[][] highestPeak(int[][] isWater) {
        int m = isWater.length;
        int n = isWater[0].length;

        // Initialize result matrix with -1 for unvisited cells
        int[][] height = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                height[i][j] = -1;  // Mark as unvisited
            }
        }

        // Queue for BFS - stores row and column indices
        Queue<int[]> queue = new LinkedList<>();

        // Step 1: Initialize all water cells as starting points
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (isWater[i][j] == 1) {
                    height[i][j] = 0;  // Water cells have height 0
                    queue.offer(new int[]{i, j});  // Add to BFS queue
                }
            }
        }

        // Directions: up, down, left, right
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        // Step 2: Perform BFS from all water cells simultaneously
        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int row = cell[0];
            int col = cell[1];
            int currentHeight = height[row][col];

            // Check all four neighbors
            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                // Check if neighbor is within bounds and unvisited
                if (newRow >= 0 && newRow < m &&
                    newCol >= 0 && newCol < n &&
                    height[newRow][newCol] == -1) {

                    // Assign height: current cell's height + 1
                    height[newRow][newCol] = currentHeight + 1;
                    queue.offer(new int[]{newRow, newCol});
                }
            }
        }

        return height;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- We visit each cell exactly once when we process it from the queue
- Each cell is added to the queue once and removed once
- For each cell, we check up to 4 neighbors, but this is constant work per cell
- Total operations: O(4×m×n) = O(m×n)

**Space Complexity: O(m×n)**

- We store the result matrix: O(m×n)
- The BFS queue can hold up to O(m×n) cells in the worst case (though typically less)
- Total space: O(m×n) for the matrix + O(m×n) for queue = O(m×n)

## Common Mistakes

1. **Starting BFS from only one water cell**: Some candidates might pick a single water cell as the starting point. This is wrong because we need the distance to the NEAREST water cell, not distance to a specific one. Always start BFS from ALL water cells simultaneously.

2. **Forgetting to mark water cells as visited**: If you don't set water cells to height 0 initially, they might get reassigned a higher height later in BFS. Water cells must remain at height 0.

3. **Using DFS instead of BFS**: DFS doesn't guarantee we find the shortest path to water. BFS processes cells in order of increasing distance, which is exactly what we need for minimum distances.

4. **Not handling the all-land case**: While the problem guarantees at least one water cell, in interviews you should mention this assumption. If there were no water cells, we'd need special handling (all heights could be arbitrary as long as adjacent differences ≤ 1).

## When You'll See This Pattern

This **multi-source BFS** pattern appears in several grid-based problems:

1. **01 Matrix (LeetCode 542)**: Find distance of each cell to the nearest 0. Almost identical to this problem!

2. **Rotting Oranges (LeetCode 994)**: Multiple rotten oranges spread to fresh ones simultaneously. Same BFS-from-multiple-sources pattern.

3. **Walls and Gates (LeetCode 286)**: Fill each empty room with distance to nearest gate. Another multi-source BFS problem.

The key signal is when you need to compute distances from multiple starting points to all other points in a grid. The technique is always: initialize queue with all sources, then run standard BFS.

## Key Takeaways

1. **Multi-source BFS**: When you need distances from multiple starting points, initialize your BFS queue with ALL starting points, not just one. This ensures each cell gets the minimum distance to any source.

2. **Grid distance problems**: If a problem involves finding minimum distances in a grid with uniform edge weights (all moves cost 1), BFS is almost always the right approach.

3. **Water cells as sources**: In this specific problem, recognizing that water cells (height 0) are the "sources" and land cells need to find their distance to the nearest source is the critical insight.

[Practice this problem on CodeJeet](/problem/map-of-highest-peak)
