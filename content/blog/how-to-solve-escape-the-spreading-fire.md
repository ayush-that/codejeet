---
title: "How to Solve Escape the Spreading Fire — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Escape the Spreading Fire. Hard difficulty, 37.6% acceptance rate. Topics: Array, Binary Search, Breadth-First Search, Matrix."
date: "2029-11-16"
category: "dsa-patterns"
tags: ["escape-the-spreading-fire", "array", "binary-search", "breadth-first-search", "hard"]
---

# How to Solve Escape the Spreading Fire

This problem asks us to determine the maximum number of minutes we can wait before starting to move from the top-left corner to the bottom-right corner of a grid, while avoiding fire that spreads every minute. The tricky part is that both you and the fire move simultaneously, and you need to find the _maximum_ delay time rather than just checking if escape is possible.

What makes this problem interesting is the two-dimensional optimization: we need to balance waiting longer (which is good) against the fire spreading closer to us (which is bad). The fire spreads in all four directions each minute, but cannot pass through walls. You can only move to adjacent cells (up, down, left, right) each minute, and cannot move into cells that are on fire or will catch fire at the same time you arrive.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0]
]
```

**Initial state (minute 0):**

- You at (0,0)
- Fire at (1,1)
- Target at (2,2)

**If we wait 0 minutes (start immediately):**

- Minute 0: You at (0,0), Fire at (1,1)
- Minute 1: You move to (0,1), Fire spreads to (0,1), (1,0), (1,2), (2,1)
- You're caught in fire at (0,1) - **FAIL**

**If we wait 1 minute:**

- Minute 0: You wait at (0,0), Fire at (1,1)
- Minute 1: Fire spreads to (0,1), (1,0), (1,2), (2,1). You still at (0,0)
- Minute 2: You try to move but (0,1) is on fire, (1,0) is on fire. You're trapped - **FAIL**

**If we wait 0 minutes but take a different path:**

- Minute 0: You at (0,0), Fire at (1,1)
- Minute 1: You move to (1,0), Fire spreads to (0,1), (1,0), (1,2), (2,1)
- You're caught in fire at (1,0) - **FAIL**

Actually, with fire at the center, escape is impossible from any starting delay because the fire cuts off all paths. This shows why we need a systematic approach rather than trial and error.

## Brute Force Approach

A naive approach would be to try every possible waiting time `k` from 0 up to some maximum, and for each `k`, simulate both your movement and the fire spreading to see if you can reach the bottom-right corner.

The brute force algorithm would:

1. For each possible waiting time `k` (starting from 0 and increasing)
2. Create a copy of the grid
3. Simulate fire spreading for `k` minutes (before you start moving)
4. Then simulate both you moving and fire spreading minute by minute
5. Check if you can reach the bottom-right before getting caught

The problem with this approach is efficiency:

- We need to try many possible `k` values (up to `m × n` in worst case)
- Each simulation requires BFS for fire spreading and BFS for your path
- Time complexity would be O((m×n)² × (m×n)) = O((m×n)³) which is far too slow for m,n up to 300

Even if we optimize the simulation, the fundamental issue is we're doing repeated work. Each simulation recalculates fire spread from scratch, when we could compute it once and reuse it.

## Optimized Approach

The key insight is that we can **precompute when each cell catches fire** using a single BFS from all initial fire cells. This gives us a `fireTime[row][col]` matrix where each cell stores the minute when that cell becomes on fire (or infinity if never reachable due to walls).

Once we have `fireTime`, checking if we can escape with a delay of `k` minutes becomes:

- Start BFS from (0,0) at minute `k`
- At each step, we can only move to a cell if:
  1. The cell is within bounds
  2. The cell is not a wall
  3. We reach the cell **before** it catches fire (`currentTime < fireTime[row][col]`)
  4. For the destination cell (m-1, n-1), we can reach it **at or before** it catches fire

The second key insight is that **if we can escape with delay `k`, we can also escape with any delay less than `k`** (because waiting less time means fire has spread less). This monotonic property allows us to use **binary search** on the answer!

So our optimized approach:

1. Precompute `fireTime` using multi-source BFS from all initial fires
2. Binary search for the maximum `k` where escape is possible
3. For each `k` in binary search, run BFS to check if path exists

## Optimal Solution

<div class="code-group">

```python
from collections import deque
from typing import List

class Solution:
    def maximumMinutes(self, grid: List[List[int]]) -> int:
        """
        Time: O(m*n*log(m*n)) - Binary search with BFS checks
        Space: O(m*n) - For fireTime matrix and BFS queues
        """
        m, n = len(grid), len(grid[0])
        INF = 10**9

        # Step 1: Precompute when each cell catches fire using multi-source BFS
        fireTime = [[INF] * n for _ in range(m)]
        fireQueue = deque()

        # Initialize BFS with all fire cells at time 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:  # Fire cell
                    fireTime[i][j] = 0
                    fireQueue.append((i, j))

        # BFS to compute fire spread times
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        while fireQueue:
            x, y = fireQueue.popleft()
            currentTime = fireTime[x][y]

            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                # Check bounds, not a wall, and not visited
                if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] != 2:
                    if fireTime[nx][ny] == INF:  # Not visited yet
                        fireTime[nx][ny] = currentTime + 1
                        fireQueue.append((nx, ny))

        # Step 2: Binary search for maximum wait time
        def canEscape(waitTime: int) -> bool:
            """Check if we can escape starting after waiting 'waitTime' minutes."""
            # If starting cell is on fire at or before we start, impossible
            if fireTime[0][0] <= waitTime:
                return False

            visited = [[False] * n for _ in range(m)]
            queue = deque()
            queue.append((0, 0, waitTime))  # (row, col, currentTime)
            visited[0][0] = True

            while queue:
                x, y, currentTime = queue.popleft()

                # Check all four directions
                for dx, dy in directions:
                    nx, ny = x + dx, y + dy

                    # Check if we reached the destination
                    if nx == m - 1 and ny == n - 1:
                        # We can reach destination if we get there before or when fire arrives
                        return currentTime + 1 <= fireTime[nx][ny]

                    # Check if move is valid
                    if 0 <= nx < m and 0 <= ny < n and not visited[nx][ny]:
                        if grid[nx][ny] != 2:  # Not a wall
                            # We can move to this cell if we arrive before it catches fire
                            # Note: We must arrive STRICTLY before fire for non-destination cells
                            if currentTime + 1 < fireTime[nx][ny]:
                                visited[nx][ny] = True
                                queue.append((nx, ny, currentTime + 1))

            return False

        # Binary search bounds: we can wait at most m*n minutes (theoretical upper bound)
        left, right = 0, m * n
        answer = -1

        while left <= right:
            mid = (left + right) // 2
            if canEscape(mid):
                answer = mid  # Try waiting longer
                left = mid + 1
            else:
                right = mid - 1  # Try waiting less

        # Special case: if we can wait forever (answer is m*n), return 10^9
        return 10**9 if answer == m * n else answer
```

```javascript
/**
 * Time: O(m*n*log(m*n)) - Binary search with BFS checks
 * Space: O(m*n) - For fireTime matrix and BFS queues
 */
var maximumMinutes = function (grid) {
  const m = grid.length,
    n = grid[0].length;
  const INF = 10 ** 9;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  // Step 1: Precompute fire spread times using multi-source BFS
  const fireTime = Array.from({ length: m }, () => Array(n).fill(INF));
  const fireQueue = [];

  // Initialize with all fire cells
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        fireTime[i][j] = 0;
        fireQueue.push([i, j]);
      }
    }
  }

  // BFS for fire spread
  let fireIdx = 0;
  while (fireIdx < fireQueue.length) {
    const [x, y] = fireQueue[fireIdx++];
    const currentTime = fireTime[x][y];

    for (const [dx, dy] of directions) {
      const nx = x + dx,
        ny = y + dy;
      if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] !== 2) {
        if (fireTime[nx][ny] === INF) {
          fireTime[nx][ny] = currentTime + 1;
          fireQueue.push([nx, ny]);
        }
      }
    }
  }

  // Step 2: Binary search for maximum wait time
  const canEscape = (waitTime) => {
    // If starting cell is on fire at or before we start, impossible
    if (fireTime[0][0] <= waitTime) return false;

    const visited = Array.from({ length: m }, () => Array(n).fill(false));
    const queue = [[0, 0, waitTime]]; // [row, col, currentTime]
    visited[0][0] = true;
    let idx = 0;

    while (idx < queue.length) {
      const [x, y, currentTime] = queue[idx++];

      for (const [dx, dy] of directions) {
        const nx = x + dx,
          ny = y + dy;

        // Check if we reached destination
        if (nx === m - 1 && ny === n - 1) {
          // Can reach if we get there before or when fire arrives
          return currentTime + 1 <= fireTime[nx][ny];
        }

        // Check if move is valid
        if (nx >= 0 && nx < m && ny >= 0 && ny < n && !visited[nx][ny]) {
          if (grid[nx][ny] !== 2) {
            // Not a wall
            // Must arrive STRICTLY before fire for non-destination cells
            if (currentTime + 1 < fireTime[nx][ny]) {
              visited[nx][ny] = true;
              queue.push([nx, ny, currentTime + 1]);
            }
          }
        }
      }
    }

    return false;
  };

  // Binary search
  let left = 0,
    right = m * n;
  let answer = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (canEscape(mid)) {
      answer = mid; // Try waiting longer
      left = mid + 1;
    } else {
      right = mid - 1; // Try waiting less
    }
  }

  // Special case: if we can wait forever, return 10^9
  return answer === m * n ? 10 ** 9 : answer;
};
```

```java
import java.util.*;

class Solution {
    // Time: O(m*n*log(m*n)) - Binary search with BFS checks
    // Space: O(m*n) - For fireTime matrix and BFS queues
    public int maximumMinutes(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int INF = (int)1e9;
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

        // Step 1: Precompute fire spread times
        int[][] fireTime = new int[m][n];
        for (int i = 0; i < m; i++) {
            Arrays.fill(fireTime[i], INF);
        }

        Queue<int[]> fireQueue = new LinkedList<>();
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    fireTime[i][j] = 0;
                    fireQueue.offer(new int[]{i, j});
                }
            }
        }

        // BFS for fire spread
        while (!fireQueue.isEmpty()) {
            int[] curr = fireQueue.poll();
            int x = curr[0], y = curr[1];
            int currentTime = fireTime[x][y];

            for (int[] dir : directions) {
                int nx = x + dir[0], ny = y + dir[1];
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] != 2) {
                    if (fireTime[nx][ny] == INF) {
                        fireTime[nx][ny] = currentTime + 1;
                        fireQueue.offer(new int[]{nx, ny});
                    }
                }
            }
        }

        // Step 2: Binary search for maximum wait time
        int left = 0, right = m * n;
        int answer = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (canEscape(grid, fireTime, mid, directions)) {
                answer = mid;
                left = mid + 1;  // Try waiting longer
            } else {
                right = mid - 1;  // Try waiting less
            }
        }

        // Special case: if we can wait forever, return 10^9
        return answer == m * n ? (int)1e9 : answer;
    }

    private boolean canEscape(int[][] grid, int[][] fireTime, int waitTime, int[][] directions) {
        int m = grid.length, n = grid[0].length;
        int INF = (int)1e9;

        // If starting cell is on fire at or before we start, impossible
        if (fireTime[0][0] <= waitTime) return false;

        boolean[][] visited = new boolean[m][n];
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, waitTime});  // row, col, currentTime
        visited[0][0] = true;

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int x = curr[0], y = curr[1], currentTime = curr[2];

            for (int[] dir : directions) {
                int nx = x + dir[0], ny = y + dir[1];

                // Check if we reached destination
                if (nx == m - 1 && ny == n - 1) {
                    // Can reach if we get there before or when fire arrives
                    return currentTime + 1 <= fireTime[nx][ny];
                }

                // Check if move is valid
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && !visited[nx][ny]) {
                    if (grid[nx][ny] != 2) {  // Not a wall
                        // Must arrive STRICTLY before fire for non-destination cells
                        if (currentTime + 1 < fireTime[nx][ny]) {
                            visited[nx][ny] = true;
                            queue.offer(new int[]{nx, ny, currentTime + 1});
                        }
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

**Time Complexity:** O(m×n×log(m×n))

- Precomputing fire times: O(m×n) using BFS that visits each cell once
- Binary search: O(log(m×n)) iterations (theoretical maximum wait time is m×n)
- Each BFS check in binary search: O(m×n)
- Total: O(m×n + log(m×n)×(m×n)) = O(m×n×log(m×n))

**Space Complexity:** O(m×n)

- `fireTime` matrix: O(m×n)
- BFS queues: O(m×n) in worst case
- `visited` matrix in each check: O(m×n)

The log factor comes from binary search, and the m×n factors come from BFS traversals that might visit all cells.

## Common Mistakes

1. **Incorrect fire arrival condition for destination vs. other cells**: For the destination (m-1, n-1), you can arrive at the same time as the fire (≤). For all other cells, you must arrive strictly before the fire (<). Mixing these up will cause wrong answers.

2. **Not checking if starting cell is immediately on fire**: If `fireTime[0][0] <= waitTime`, escape is impossible regardless of path. Candidates often miss this edge case.

3. **Using DFS instead of BFS for pathfinding**: DFS doesn't guarantee shortest path in terms of time, and in time-sensitive problems like this with spreading fire, we need BFS to find the earliest possible arrival time at each cell.

4. **Forgetting walls block both fire and movement**: Walls (value 2) should be treated as completely impassable for both BFS traversals. Some candidates handle them in fire BFS but forget in person BFS, or vice versa.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Multi-source BFS** (like "Rotting Oranges" #994): Starting BFS from multiple initial points simultaneously. Here we start from all fire cells to compute spread times.

2. **Binary search on answer** (like "Koko Eating Bananas" #875): When the answer has monotonic property (if k works, all smaller values work), we can binary search instead of linear scan.

3. **Time-based grid traversal** (like "Last Day Where You Can Still Cross" #1970): Problems where conditions change over time and you need to find if a path exists under dynamic constraints.

Other related problems include "Swim in Rising Water" (#778) which also uses binary search + BFS, and "As Far from Land as Possible" (#1162) which uses multi-source BFS.

## Key Takeaways

1. **Precomputation is powerful**: When you need to repeatedly check conditions that depend on some fixed property (like fire spread times), compute it once and reuse it.

2. **Look for monotonicity**: If the problem asks for "maximum" or "minimum" of something, and larger/smaller values have predictable effects on feasibility, binary search is often applicable.

3. **BFS tracks both position and time**: In time-sensitive movement problems, your BFS state often needs to include both position and current time, not just position.

This problem teaches how to combine multiple algorithms (BFS, binary search) to solve complex optimization problems efficiently. Recognizing when to use each component is key to tackling similar hard problems.

Related problems: [Rotting Oranges](/problem/rotting-oranges), [Last Day Where You Can Still Cross](/problem/last-day-where-you-can-still-cross), [Minimum Weighted Subgraph With the Required Paths](/problem/minimum-weighted-subgraph-with-the-required-paths)
