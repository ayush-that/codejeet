---
title: "How to Solve Swim in Rising Water — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Swim in Rising Water. Hard difficulty, 67.6% acceptance rate. Topics: Array, Binary Search, Depth-First Search, Breadth-First Search, Union-Find."
date: "2027-09-15"
category: "dsa-patterns"
tags: ["swim-in-rising-water", "array", "binary-search", "depth-first-search", "hard"]
---

# How to Solve Swim in Rising Water

You're given an n×n grid where each cell has an elevation. Water rises over time, and you need to find the **minimum time** required for you to swim from the top-left to bottom-right. At time `t`, you can only traverse cells with elevation ≤ t. What makes this problem tricky is that you're not just finding a path — you're finding the minimum water level that makes a path possible, where the water level determines which cells are accessible.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
  [0, 2],
  [1, 3]
]
```

We start at (0,0) with elevation 0. We need to reach (1,1) with elevation 3.

**At time t = 0:**

- Water level = 0
- Accessible cells: only (0,0) with elevation 0
- Can't reach destination ❌

**At time t = 1:**

- Water level = 1
- Accessible cells: (0,0) and (1,0) with elevation 1
- Still can't reach (1,1) ❌

**At time t = 2:**

- Water level = 2
- Accessible cells: (0,0), (0,1), (1,0)
- Can reach (0,1) but still not (1,1) ❌

**At time t = 3:**

- Water level = 3
- Accessible cells: all cells
- Can reach (1,1) ✅

So the answer is 3. Notice that the answer isn't simply the maximum elevation along the path — it's the minimum water level that allows _some_ path to exist. The path we take at t=3 might be different from the path at t=2.

## Brute Force Approach

A naive approach would be to simulate the water rising minute by minute:

1. Start with t = max(grid[0][0], grid[n-1][n-1]) (since we must at least be able to stand on start and end)
2. For each time t, check if there's a path from (0,0) to (n-1,n-1) using only cells with elevation ≤ t
3. If a path exists, return t; otherwise increment t and repeat

The problem with this approach is efficiency. In the worst case:

- Water level could go up to the maximum elevation in the grid (which could be n² × 50 in constraints)
- Each BFS/DFS takes O(n²) time
- Total time: O(maxElevation × n²) — far too slow for n up to 50

Even if we start from the minimum possible time, we're still doing potentially thousands of BFS operations.

## Optimized Approach

The key insight is that we can use **binary search** on the answer space combined with **BFS/DFS** to check feasibility:

1. **Binary Search on Time**: Instead of checking every possible time, we can binary search between the minimum and maximum possible times. The minimum time is at least `max(grid[0][0], grid[n-1][n-1])` (we need to stand on start and end). The maximum time is the highest elevation in the grid.

2. **Feasibility Check**: For a candidate time `t`, we check if a path exists using only cells with elevation ≤ t. This is a standard BFS/DFS problem.

3. **Why This Works**: The property we're leveraging is monotonicity — if you can swim at time `t`, you can definitely swim at any time > t (more cells become accessible). This monotonic property makes binary search applicable.

Alternative approach using **Dijkstra's algorithm** or **priority queue**:

- Think of each cell as a node in a graph
- The "cost" to enter a cell is its elevation
- We want the minimum maximum elevation along any path
- This is essentially finding the path that minimizes the maximum edge weight, which Dijkstra can solve with a slight modification

We'll implement the binary search + BFS approach as it's more intuitive for most candidates.

## Optimal Solution

Here's the complete solution using binary search with BFS:

<div class="code-group">

```python
# Time: O(n^2 * log(maxElevation)) | Space: O(n^2)
class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        n = len(grid)

        # Helper function to check if we can reach the end
        # with water level = time
        def can_reach(time):
            # If start or end cell is above water level, impossible
            if grid[0][0] > time or grid[n-1][n-1] > time:
                return False

            visited = [[False] * n for _ in range(n)]
            queue = deque([(0, 0)])
            visited[0][0] = True

            # Directions: right, down, left, up
            directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

            while queue:
                x, y = queue.popleft()

                # Reached destination
                if x == n-1 and y == n-1:
                    return True

                # Check all four neighbors
                for dx, dy in directions:
                    nx, ny = x + dx, y + dy

                    # Check bounds, visited status, and water level
                    if (0 <= nx < n and 0 <= ny < n and
                        not visited[nx][ny] and grid[nx][ny] <= time):
                        visited[nx][ny] = True
                        queue.append((nx, ny))

            return False

        # Binary search for the minimum time
        left = max(grid[0][0], grid[n-1][n-1])  # Minimum possible time
        right = n * n - 1  # Maximum elevation based on problem constraints

        while left < right:
            mid = (left + right) // 2

            if can_reach(mid):
                # Try for smaller time
                right = mid
            else:
                # Need higher water level
                left = mid + 1

        return left
```

```javascript
// Time: O(n^2 * log(maxElevation)) | Space: O(n^2)
/**
 * @param {number[][]} grid
 * @return {number}
 */
var swimInWater = function (grid) {
  const n = grid.length;

  // Helper function to check if path exists at given time
  const canReach = (time) => {
    // Check start and end cells
    if (grid[0][0] > time || grid[n - 1][n - 1] > time) {
      return false;
    }

    const visited = Array.from({ length: n }, () => Array(n).fill(false));
    const queue = [[0, 0]];
    visited[0][0] = true;

    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    while (queue.length > 0) {
      const [x, y] = queue.shift();

      // Reached destination
      if (x === n - 1 && y === n - 1) {
        return true;
      }

      // Explore neighbors
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        // Check bounds, visited, and water level
        if (nx >= 0 && nx < n && ny >= 0 && ny < n && !visited[nx][ny] && grid[nx][ny] <= time) {
          visited[nx][ny] = true;
          queue.push([nx, ny]);
        }
      }
    }

    return false;
  };

  // Binary search for minimum time
  let left = Math.max(grid[0][0], grid[n - 1][n - 1]);
  let right = n * n - 1; // Max possible elevation

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (canReach(mid)) {
      // Try smaller time
      right = mid;
    } else {
      // Need higher water level
      left = mid + 1;
    }
  }

  return left;
};
```

```java
// Time: O(n^2 * log(maxElevation)) | Space: O(n^2)
class Solution {
    public int swimInWater(int[][] grid) {
        int n = grid.length;

        // Binary search bounds
        int left = Math.max(grid[0][0], grid[n-1][n-1]);
        int right = n * n - 1;  // Maximum possible elevation

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canReach(grid, mid)) {
                // Try for smaller time
                right = mid;
            } else {
                // Need higher water level
                left = mid + 1;
            }
        }

        return left;
    }

    // BFS to check if path exists at given time
    private boolean canReach(int[][] grid, int time) {
        int n = grid.length;

        // Check start and end cells
        if (grid[0][0] > time || grid[n-1][n-1] > time) {
            return false;
        }

        boolean[][] visited = new boolean[n][n];
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0});
        visited[0][0] = true;

        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int x = curr[0], y = curr[1];

            // Reached destination
            if (x == n-1 && y == n-1) {
                return true;
            }

            // Explore neighbors
            for (int[] dir : directions) {
                int nx = x + dir[0];
                int ny = y + dir[1];

                // Check bounds, visited status, and water level
                if (nx >= 0 && nx < n && ny >= 0 && ny < n &&
                    !visited[nx][ny] && grid[nx][ny] <= time) {
                    visited[nx][ny] = true;
                    queue.offer(new int[]{nx, ny});
                }
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n² × log(maxElevation))**

- Binary search runs O(log(maxElevation)) times, where maxElevation ≤ n² (given constraints)
- Each BFS/DFS visit takes O(n²) since we might visit all cells
- Total: O(n² × log(n²)) = O(n² × 2log n) = O(n² log n)

**Space Complexity: O(n²)**

- We need O(n²) for the visited array
- The BFS queue could hold up to O(n²) cells in the worst case
- Total: O(n²)

The Dijkstra/priority queue approach would have O(n² log n) time complexity as well, but with a different constant factor.

## Common Mistakes

1. **Starting binary search from 0 instead of max(start, end)**: You must be able to stand on both the start and end cells, so the minimum time is at least `max(grid[0][0], grid[n-1][n-1])`. Starting from 0 wastes iterations.

2. **Forgetting to check start/end cells in can_reach()**: Even if the water level allows a theoretical path, if you can't stand on the start or end cell, no path exists. Always check these first.

3. **Using DFS recursion without considering stack overflow**: For n=50, DFS recursion depth could be 2500, which might cause stack overflow in some languages. BFS or iterative DFS is safer.

4. **Incorrect binary search bounds update**: Remember the pattern: if `can_reach(mid)` is true, we search left half (`right = mid`), otherwise search right half (`left = mid + 1`). Getting this wrong leads to infinite loops or incorrect answers.

## When You'll See This Pattern

This "binary search on answer + feasibility check" pattern appears in problems where:

1. You're looking for a minimum or maximum value that satisfies some condition
2. The condition is monotonic (if it works for value X, it works for all values > X or < X)
3. Checking feasibility is easier than directly finding the optimal value

Related problems:

- **Path With Minimum Effort (LeetCode 1631)**: Very similar — find the minimum "effort" (maximum height difference) along a path. Uses the same binary search + BFS pattern.
- **Koko Eating Bananas (LeetCode 875)**: Binary search for minimum eating speed where checking if Koko can finish is straightforward.
- **Capacity To Ship Packages (LeetCode 1011)**: Binary search for minimum ship capacity where checking feasibility is easy.

## Key Takeaways

1. **When you need to minimize a maximum value along a path**, consider binary search on the answer space combined with BFS/DFS for feasibility checking.

2. **The monotonicity property is key for binary search**: If condition(X) implies condition(X+1) (or vice versa), binary search applies.

3. **Always validate your binary search bounds**: Make sure your minimum bound is actually achievable (here, at least max(start, end)) and your maximum bound covers all possibilities.

Related problems: [Path With Minimum Effort](/problem/path-with-minimum-effort)
