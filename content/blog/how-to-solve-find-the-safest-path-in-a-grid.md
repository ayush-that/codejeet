---
title: "How to Solve Find the Safest Path in a Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Safest Path in a Grid. Medium difficulty, 48.6% acceptance rate. Topics: Array, Binary Search, Breadth-First Search, Union-Find, Heap (Priority Queue)."
date: "2027-03-30"
category: "dsa-patterns"
tags: ["find-the-safest-path-in-a-grid", "array", "binary-search", "breadth-first-search", "medium"]
---

# How to Solve Find the Safest Path in a Grid

This problem asks you to find the **maximum possible minimum safety factor** along any path from the top-left (0,0) to bottom-right (n-1,n-1) of a grid. The safety factor of a cell is its Manhattan distance to the nearest thief cell. What makes this problem interesting is that we're not looking for the shortest path or the path with maximum total safety—we're looking for the path that maximizes the _minimum_ safety value encountered along the way. This "maximin" pattern appears in several graph problems and requires careful thinking about how to traverse the grid.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
[0, 0, 1]
[0, 0, 0]
[0, 0, 0]
```

**Step 1: Calculate safety distances**
First, we compute the Manhattan distance from each cell to the nearest thief. The only thief is at (0,2):

- (0,0): distance = |0-0| + |0-2| = 2
- (0,1): distance = |0-0| + |1-2| = 1
- (0,2): distance = 0 (thief cell)
- (1,0): distance = |1-0| + |0-2| = 3
- (1,1): distance = |1-0| + |1-2| = 2
- (1,2): distance = |1-0| + |2-2| = 1
- (2,0): distance = |2-0| + |0-2| = 4
- (2,1): distance = |2-0| + |1-2| = 3
- (2,2): distance = |2-0| + |2-2| = 2

**Step 2: Find the optimal path**
We need to get from (0,0) to (2,2) while maximizing the minimum safety value along our path.

Consider two potential paths:

- Path A: (0,0)→(1,0)→(2,0)→(2,1)→(2,2)
  Safety values: 2, 3, 4, 3, 2 → Minimum = 2
- Path B: (0,0)→(0,1)→(1,1)→(2,1)→(2,2)
  Safety values: 2, 1, 2, 3, 2 → Minimum = 1

Path A is better because its minimum safety is 2 vs 1. But can we do better?

- Path C: (0,0)→(1,0)→(1,1)→(2,1)→(2,2)
  Safety values: 2, 3, 2, 3, 2 → Minimum = 2

Actually, the maximum possible minimum safety is 2 in this grid. No path can avoid the safety value of 2 at the start and end cells.

## Brute Force Approach

A naive approach would be to:

1. Calculate safety distances for all cells using BFS from all thief cells
2. Generate all possible paths from (0,0) to (n-1,n-1)
3. For each path, find the minimum safety value along it
4. Return the maximum of these minimum values

The problem with this approach is **combinatorial explosion**. For an n×n grid, the number of possible paths grows exponentially. Even with dynamic programming, we'd need to track too much state information. A better brute force might try every possible threshold value k (from 0 to maximum safety), and check if a path exists where all cells have safety ≥ k. But checking each threshold with DFS/BFS would be O(n²) per check, and with up to O(n²) possible thresholds, that's O(n⁴) — still too slow for n up to 400.

## Optimized Approach

The key insight is that we can use **binary search** on the answer combined with **BFS/DFS** to check feasibility:

1. **Precompute safety distances**: Use multi-source BFS starting from all thief cells to compute the minimum Manhattan distance to any thief for every cell in O(n²) time.

2. **Binary search on the safety threshold**: The answer (maximum minimum safety) must be between 0 and the maximum safety value in the grid. For a candidate threshold k, we check if we can reach the bottom-right from top-left using only cells with safety ≥ k.

3. **Feasibility check**: For each candidate k, perform BFS/DFS starting from (0,0), only moving to adjacent cells with safety ≥ k. If we reach (n-1,n-1), then k is feasible.

4. **Find maximum feasible k**: Use binary search to find the largest k that's still feasible.

This approach works because:

- If we can find a path with minimum safety ≥ k, then all smaller thresholds ≤ k are also feasible (monotonic property)
- Binary search reduces the number of BFS/DFS checks from O(n²) to O(log n)
- Each BFS/DFS check takes O(n²) time

## Optimal Solution

Here's the complete implementation using multi-source BFS for distance calculation and binary search with BFS for feasibility checking:

<div class="code-group">

```python
# Time: O(n² log n) | Space: O(n²)
from collections import deque
from typing import List

class Solution:
    def maximumSafenessFactor(self, grid: List[List[int]]) -> int:
        n = len(grid)

        # Step 1: Multi-source BFS to compute safety distances
        # Initialize distance matrix with -1 (unvisited)
        dist = [[-1] * n for _ in range(n)]
        q = deque()

        # Add all thief cells to queue with distance 0
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 1:
                    dist[r][c] = 0
                    q.append((r, c))

        # Directions: up, down, left, right
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

        # BFS to compute minimum distance to any thief
        while q:
            r, c = q.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                # Check bounds and if cell not visited
                if 0 <= nr < n and 0 <= nc < n and dist[nr][nc] == -1:
                    dist[nr][nc] = dist[r][c] + 1
                    q.append((nr, nc))

        # Step 2: Binary search for maximum feasible safety factor
        # The answer ranges from 0 to maximum distance in the grid
        left, right = 0, 0
        for r in range(n):
            for c in range(n):
                right = max(right, dist[r][c])

        # Helper function to check if path exists with min safety >= k
        def canReach(k: int) -> bool:
            if dist[0][0] < k:  # Starting cell must have safety >= k
                return False

            visited = [[False] * n for _ in range(n)]
            q = deque()
            q.append((0, 0))
            visited[0][0] = True

            while q:
                r, c = q.popleft()
                # Reached destination
                if r == n - 1 and c == n - 1:
                    return True

                for dr, dc in directions:
                    nr, nc = r + dr, c + dc
                    # Check bounds, not visited, and safety >= k
                    if (0 <= nr < n and 0 <= nc < n and
                        not visited[nr][nc] and dist[nr][nc] >= k):
                        visited[nr][nc] = True
                        q.append((nr, nc))

            return False

        # Binary search for maximum feasible k
        result = 0
        while left <= right:
            mid = (left + right) // 2
            if canReach(mid):
                result = mid  # mid is feasible, try for higher
                left = mid + 1
            else:
                right = mid - 1  # mid not feasible, try lower

        return result
```

```javascript
// Time: O(n² log n) | Space: O(n²)
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maximumSafenessFactor = function (grid) {
  const n = grid.length;

  // Step 1: Multi-source BFS to compute safety distances
  // Initialize distance matrix with -1 (unvisited)
  const dist = Array.from({ length: n }, () => Array(n).fill(-1));
  const queue = [];

  // Add all thief cells to queue with distance 0
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) {
        dist[r][c] = 0;
        queue.push([r, c]);
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

  // BFS to compute minimum distance to any thief
  let front = 0;
  while (front < queue.length) {
    const [r, c] = queue[front++];
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      // Check bounds and if cell not visited
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }

  // Step 2: Binary search for maximum feasible safety factor
  // Helper function to check if path exists with min safety >= k
  const canReach = (k) => {
    if (dist[0][0] < k) {
      // Starting cell must have safety >= k
      return false;
    }

    const visited = Array.from({ length: n }, () => Array(n).fill(false));
    const q = [[0, 0]];
    visited[0][0] = true;
    let idx = 0;

    while (idx < q.length) {
      const [r, c] = q[idx++];
      // Reached destination
      if (r === n - 1 && c === n - 1) {
        return true;
      }

      for (const [dr, dc] of directions) {
        const nr = r + dr,
          nc = c + dc;
        // Check bounds, not visited, and safety >= k
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && dist[nr][nc] >= k) {
          visited[nr][nc] = true;
          q.push([nr, nc]);
        }
      }
    }

    return false;
  };

  // Find maximum distance for binary search range
  let maxDist = 0;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      maxDist = Math.max(maxDist, dist[r][c]);
    }
  }

  // Binary search for maximum feasible k
  let left = 0,
    right = maxDist;
  let result = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (canReach(mid)) {
      result = mid; // mid is feasible, try for higher
      left = mid + 1;
    } else {
      right = mid - 1; // mid not feasible, try lower
    }
  }

  return result;
};
```

```java
// Time: O(n² log n) | Space: O(n²)
import java.util.*;

class Solution {
    public int maximumSafenessFactor(List<List<Integer>> grid) {
        int n = grid.size();

        // Step 1: Multi-source BFS to compute safety distances
        // Initialize distance matrix with -1 (unvisited)
        int[][] dist = new int[n][n];
        for (int[] row : dist) Arrays.fill(row, -1);
        Queue<int[]> queue = new LinkedList<>();

        // Add all thief cells to queue with distance 0
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                if (grid.get(r).get(c) == 1) {
                    dist[r][c] = 0;
                    queue.offer(new int[]{r, c});
                }
            }
        }

        // Directions: up, down, left, right
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        // BFS to compute minimum distance to any thief
        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int r = cell[0], c = cell[1];
            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                // Check bounds and if cell not visited
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[r][c] + 1;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }

        // Step 2: Binary search for maximum feasible safety factor
        // Find maximum distance for binary search range
        int maxDist = 0;
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                maxDist = Math.max(maxDist, dist[r][c]);
            }
        }

        // Helper function to check if path exists with min safety >= k
        // Using BFS to check connectivity
        int left = 0, right = maxDist;
        int result = 0;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (canReach(dist, mid)) {
                result = mid;  // mid is feasible, try for higher
                left = mid + 1;
            } else {
                right = mid - 1;  // mid not feasible, try lower
            }
        }

        return result;
    }

    private boolean canReach(int[][] dist, int k) {
        int n = dist.length;
        if (dist[0][0] < k) {  // Starting cell must have safety >= k
            return false;
        }

        boolean[][] visited = new boolean[n][n];
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0});
        visited[0][0] = true;
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int r = cell[0], c = cell[1];
            // Reached destination
            if (r == n - 1 && c == n - 1) {
                return true;
            }

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                // Check bounds, not visited, and safety >= k
                if (nr >= 0 && nr < n && nc >= 0 && nc < n &&
                    !visited[nr][nc] && dist[nr][nc] >= k) {
                    visited[nr][nc] = true;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n² log n)**

- Multi-source BFS: O(n²) to compute distances from all thief cells
- Binary search: O(log n) iterations (where n is grid dimension, but actually log(maxDist) ≤ log(n²) = O(log n))
- BFS feasibility check: O(n²) per binary search iteration
- Total: O(n² + log n × n²) = O(n² log n)

**Space Complexity: O(n²)**

- Distance matrix: O(n²)
- BFS queue: O(n²) in worst case
- Visited matrix for feasibility check: O(n²)

## Common Mistakes

1. **Forgetting to check the starting cell**: In the feasibility check, you must verify that `dist[0][0] >= k` before starting BFS. Otherwise, you might incorrectly report that a path exists when the starting cell itself doesn't meet the safety threshold.

2. **Using DFS instead of BFS for feasibility check**: While DFS would work, BFS is generally preferred for grid connectivity problems because it's more memory-efficient for the typical grid sizes and avoids recursion depth issues.

3. **Incorrect binary search bounds**: The lower bound should be 0 (you can always travel through thief cells if necessary), and the upper bound should be the maximum distance in the grid, not n or some arbitrary constant.

4. **Not using multi-source BFS for distance calculation**: Some candidates try to compute distances by checking distance to every thief for every cell, which would be O(n⁴). Multi-source BFS is the optimal O(n²) approach.

## When You'll See This Pattern

This "maximin" path problem pattern appears in several contexts:

1. **Path With Minimum Effort (LeetCode 1631)**: Very similar structure—find a path that minimizes the maximum absolute difference in heights between consecutive cells. The solution uses binary search with BFS/DFS or Dijkstra's algorithm.

2. **Swim in Rising Water (LeetCode 778)**: Find the least time to reach the bottom-right when you can only swim through cells with elevation ≤ current time. Uses binary search or priority queue.

3. **Last Day Where You Can Still Cross (LeetCode 1970)**: Find the last day you can cross from top to bottom as cells become blocked—uses binary search with BFS.

The common thread is optimizing for the worst-case constraint along a path, which often suggests binary search on the answer combined with a feasibility check.

## Key Takeaways

1. **"Maximin" problems often suggest binary search**: When you need to maximize the minimum value along a path (or minimize the maximum), binary search on the answer combined with a feasibility check is a powerful pattern.

2. **Multi-source BFS efficiently computes distances to nearest sources**: When you need distances from each cell to the nearest of multiple sources, initialize the BFS queue with all sources at distance 0.

3. **Grid connectivity checks are O(n²) with BFS**: Checking if a path exists under certain constraints in an n×n grid can be done efficiently with BFS in O(n²) time.

Remember: The binary search works because feasibility is monotonic—if you can find a path with minimum safety ≥ k, you can definitely find one with minimum safety ≥ k-1.

Related problems: [Path With Minimum Effort](/problem/path-with-minimum-effort)
