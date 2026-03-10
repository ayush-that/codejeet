---
title: "How to Solve Path With Minimum Effort — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Path With Minimum Effort. Medium difficulty, 62.8% acceptance rate. Topics: Array, Binary Search, Depth-First Search, Breadth-First Search, Union-Find."
date: "2027-06-18"
category: "dsa-patterns"
tags: ["path-with-minimum-effort", "array", "binary-search", "depth-first-search", "medium"]
---

# How to Solve Path With Minimum Effort

You're given a 2D grid where each cell has a height, and you need to find a path from top-left to bottom-right that minimizes the maximum height difference between consecutive cells along the path. The challenge is that you can't just find the shortest path—you need to minimize the "effort" defined as the maximum absolute difference in heights between adjacent cells in your path. This makes it different from standard shortest path problems where you sum costs.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
heights = [
  [1, 2, 2],
  [3, 8, 2],
  [5, 3, 5]
]
```

We start at (0,0) with height 1 and need to reach (2,2) with height 5.

If we take the path: (0,0)→(0,1)→(0,2)→(1,2)→(2,2)

- |1-2| = 1
- |2-2| = 0
- |2-2| = 0
- |2-5| = 3
  Maximum effort = 3

If we take: (0,0)→(1,0)→(2,0)→(2,1)→(2,2)

- |1-3| = 2
- |3-5| = 2
- |5-3| = 2
- |3-5| = 2
  Maximum effort = 2

The second path has lower maximum effort (2 vs 3), even though it might be longer. Our goal is to find the path with the smallest possible maximum effort.

## Brute Force Approach

A naive approach would be to try all possible paths from start to end and track the maximum effort for each path, then return the minimum of those maximum efforts. We could use DFS to explore all paths:

1. Start at (0,0)
2. Recursively explore all four directions (up, down, left, right)
3. Track the maximum height difference encountered so far
4. When reaching (rows-1, cols-1), update the global minimum effort

The problem? The number of paths grows exponentially with grid size. For an m×n grid, there are roughly O(4^(m×n)) possible paths in the worst case. Even for a modest 10×10 grid, this is computationally impossible.

What makes this problem tricky is that standard Dijkstra's algorithm won't work directly because we're not minimizing the sum of costs, but rather the maximum cost along the path. We need a different approach.

## Optimized Approach

The key insight is that we can use **binary search** on the answer combined with **BFS/DFS** to check feasibility:

1. **Binary Search on Effort**: The answer (minimum maximum effort) must be between 0 and the maximum possible height difference in the grid. We can binary search in this range.
2. **Feasibility Check**: For a given effort threshold `k`, can we find a path from start to end where every step has height difference ≤ `k`? This is a simple reachability problem we can solve with BFS or DFS.
3. **Why This Works**: If we can reach the end with effort ≤ `k`, then the answer is ≤ `k`. If we can't, the answer must be > `k`. This monotonic property allows binary search.

Alternatively, we can use a **modified Dijkstra's algorithm** where we track the minimum possible maximum effort to reach each cell, using a min-heap prioritized by the maximum effort so far.

## Optimal Solution

Here's the binary search + BFS approach, which is often easier to implement correctly:

<div class="code-group">

```python
# Time: O(m*n*log(H)) where H is max height difference
# Space: O(m*n) for BFS queue and visited set
class Solution:
    def minimumEffortPath(self, heights: List[List[int]]) -> int:
        rows, cols = len(heights), len(heights[0])

        # Helper function to check if a path exists with max effort <= k
        def canReach(k):
            # BFS to check reachability
            from collections import deque
            queue = deque([(0, 0)])
            visited = [[False] * cols for _ in range(rows)]
            visited[0][0] = True

            # Directions: down, up, right, left
            directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

            while queue:
                r, c = queue.popleft()

                # If we reached the destination
                if r == rows - 1 and c == cols - 1:
                    return True

                # Explore all four neighbors
                for dr, dc in directions:
                    nr, nc = r + dr, c + dc

                    # Check bounds and if not visited
                    if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc]:
                        # Check if the effort to this neighbor is within limit k
                        effort = abs(heights[nr][nc] - heights[r][c])
                        if effort <= k:
                            visited[nr][nc] = True
                            queue.append((nr, nc))

            return False

        # Binary search for the minimum effort
        left, right = 0, 0

        # Find the maximum possible height in the grid for upper bound
        for r in range(rows):
            for c in range(cols):
                right = max(right, heights[r][c])

        # Binary search between 0 and max height
        while left < right:
            mid = (left + right) // 2

            if canReach(mid):
                # If we can reach with effort mid, try smaller
                right = mid
            else:
                # If we can't reach with effort mid, try larger
                left = mid + 1

        return left
```

```javascript
// Time: O(m*n*log(H)) where H is max height difference
// Space: O(m*n) for BFS queue and visited array
var minimumEffortPath = function (heights) {
  const rows = heights.length;
  const cols = heights[0].length;

  // Helper function to check if a path exists with max effort <= k
  const canReach = (k) => {
    // BFS to check reachability
    const queue = [[0, 0]];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[0][0] = true;

    // Directions: down, up, right, left
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    while (queue.length > 0) {
      const [r, c] = queue.shift();

      // If we reached the destination
      if (r === rows - 1 && c === cols - 1) {
        return true;
      }

      // Explore all four neighbors
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        // Check bounds and if not visited
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
          // Check if the effort to this neighbor is within limit k
          const effort = Math.abs(heights[nr][nc] - heights[r][c]);
          if (effort <= k) {
            visited[nr][nc] = true;
            queue.push([nr, nc]);
          }
        }
      }
    }

    return false;
  };

  // Find the maximum possible height in the grid for upper bound
  let maxHeight = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      maxHeight = Math.max(maxHeight, heights[r][c]);
    }
  }

  // Binary search for the minimum effort
  let left = 0;
  let right = maxHeight;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (canReach(mid)) {
      // If we can reach with effort mid, try smaller
      right = mid;
    } else {
      // If we can't reach with effort mid, try larger
      left = mid + 1;
    }
  }

  return left;
};
```

```java
// Time: O(m*n*log(H)) where H is max height difference
// Space: O(m*n) for BFS queue and visited array
class Solution {
    public int minimumEffortPath(int[][] heights) {
        int rows = heights.length;
        int cols = heights[0].length;

        // Find the maximum possible height in the grid for upper bound
        int maxHeight = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                maxHeight = Math.max(maxHeight, heights[r][c]);
            }
        }

        // Binary search for the minimum effort
        int left = 0;
        int right = maxHeight;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canReach(heights, mid)) {
                // If we can reach with effort mid, try smaller
                right = mid;
            } else {
                // If we can't reach with effort mid, try larger
                left = mid + 1;
            }
        }

        return left;
    }

    // Helper method to check if a path exists with max effort <= k
    private boolean canReach(int[][] heights, int k) {
        int rows = heights.length;
        int cols = heights[0].length;

        // BFS to check reachability
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0});
        boolean[][] visited = new boolean[rows][cols];
        visited[0][0] = true;

        // Directions: down, up, right, left
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0];
            int c = curr[1];

            // If we reached the destination
            if (r == rows - 1 && c == cols - 1) {
                return true;
            }

            // Explore all four neighbors
            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                // Check bounds and if not visited
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
                    // Check if the effort to this neighbor is within limit k
                    int effort = Math.abs(heights[nr][nc] - heights[r][c]);
                    if (effort <= k) {
                        visited[nr][nc] = true;
                        queue.offer(new int[]{nr, nc});
                    }
                }
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n×log(H))**

- `m` is number of rows, `n` is number of columns
- `H` is the maximum possible height difference (0 to max height in grid)
- Binary search runs O(log(H)) times
- Each BFS/DFS runs in O(m×n) since we visit each cell at most once
- Total: O(m×n×log(H))

**Space Complexity: O(m×n)**

- We need O(m×n) for the visited array/matrix
- BFS queue could hold up to O(m×n) cells in worst case (though typically less)
- No recursion stack overhead with BFS (DFS would use O(m×n) recursion depth)

## Common Mistakes

1. **Using standard Dijkstra incorrectly**: Candidates often try to use Dijkstra with sum of efforts instead of tracking maximum effort. Remember: we want to minimize the maximum effort along the path, not the sum.

2. **Forgetting to check bounds in BFS/DFS**: When exploring neighbors, always check `0 <= nr < rows` and `0 <= nc < cols` before accessing the array. Out-of-bounds access is a common runtime error.

3. **Incorrect binary search bounds**: Setting the upper bound too low (like 100) instead of calculating the actual maximum height in the grid. Some test cases have heights up to 10^6.

4. **Not marking cells as visited before adding to queue**: This can cause infinite loops or exponential time complexity. Always mark a cell as visited when you add it to the queue/stack, not when you pop it.

## When You'll See This Pattern

This "binary search on answer + BFS/DFS" pattern appears in several grid path problems:

1. **Swim in Rising Water (Hard)**: Similar concept—find the minimum time to reach the end where you can only swim through cells with water level ≤ current time.

2. **Path With Maximum Minimum Value (Medium)**: Find the path that maximizes the minimum value along the path—same pattern but maximizing instead of minimizing.

3. **Find the Safest Path in a Grid (Medium)**: Find the path that maximizes the minimum distance to any thief—again using binary search + BFS.

The pattern is: when you need to find a path that satisfies some threshold condition (minimize maximum, maximize minimum, etc.), and checking if a path exists for a given threshold is easier than finding the optimal threshold directly, binary search on the answer is often the right approach.

## Key Takeaways

1. **When to use binary search on answer**: If the problem asks to minimize/maximize some value along a path, and checking feasibility for a given value is easier than finding the optimal value directly, consider binary search.

2. **BFS vs DFS for reachability**: For checking if a path exists with certain constraints, BFS is often simpler and avoids recursion depth issues. Both work, but BFS is usually more intuitive.

3. **Track maximum, not sum**: In "minimum effort" problems, you're tracking the maximum value encountered along the path, not summing values. This changes how you think about the path cost.

Related problems: [Swim in Rising Water](/problem/swim-in-rising-water), [Path With Maximum Minimum Value](/problem/path-with-maximum-minimum-value), [Find the Safest Path in a Grid](/problem/find-the-safest-path-in-a-grid)
