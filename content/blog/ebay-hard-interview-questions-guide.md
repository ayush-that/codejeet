---
title: "Hard eBay Interview Questions: Strategy Guide"
description: "How to tackle 10 hard difficulty questions from eBay — patterns, time targets, and practice tips."
date: "2032-08-05"
category: "tips"
tags: ["ebay", "hard", "interview prep"]
---

# Hard eBay Interview Questions: Strategy Guide

eBay’s interview coding questions are known for being practical and often tied to real-world e-commerce scenarios—even at the Hard level. Out of their 60 total tagged questions, only 10 are marked Hard. What separates these from Medium problems isn’t just raw algorithmic complexity, but the need to combine multiple patterns, handle intricate constraints, and often model a business logic layer atop a classic CS problem. You’re not just implementing an algorithm; you’re designing a solution to a messy, realistic problem that might involve inventory, pricing, auctions, or recommendations.

## Common Patterns and Templates

eBay’s Hard problems frequently involve **graph algorithms** (especially on implicit graphs), **dynamic programming with non-standard state**, and **interval merging with extra constraints**. A very common pattern is the **"stateful BFS/DFS"** where you traverse a graph or grid while carrying additional business logic (like remaining inventory, time steps, or transaction limits). This isn't just a simple shortest path; it's shortest path with side constraints.

Here’s a template for a stateful BFS, which appears in problems like finding the minimum steps to reach a target with obstacles and a resource limit (e.g., "Shortest Path in a Grid with Obstacles Elimination" — a classic pattern seen in eBay-style inventory routing problems).

<div class="code-group">

```python
from collections import deque

def stateful_bfs(grid, k):
    """
    Template for BFS with an extra state dimension.
    Example problem: 1293. Shortest Path in a Grid with Obstacles Elimination
    """
    rows, cols = len(grid), len(grid[0])
    # Visited set tracks (row, col, remaining_resource)
    visited = set()
    # Queue holds (row, col, remaining_resource, steps)
    queue = deque([(0, 0, k, 0)])  # start with k resource
    visited.add((0, 0, k))

    while queue:
        r, c, remain, steps = queue.popleft()
        # If reached bottom-right corner
        if r == rows - 1 and c == cols - 1:
            return steps

        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                new_remain = remain - grid[nr][nc]  # grid[nr][nc] is 1 if obstacle
                if new_remain >= 0 and (nr, nc, new_remain) not in visited:
                    visited.add((nr, nc, new_remain))
                    queue.append((nr, nc, new_remain, steps + 1))
    return -1  # unreachable

# Time: O(rows * cols * k) — we potentially visit each cell for each resource level.
# Space: O(rows * cols * k) for the visited set and queue.
```

```javascript
function statefulBFS(grid, k) {
  const rows = grid.length,
    cols = grid[0].length;
  const visited = new Set();
  const queue = [[0, 0, k, 0]]; // [row, col, remain, steps]
  visited.add(`0,0,${k}`);

  while (queue.length) {
    const [r, c, remain, steps] = queue.shift();
    if (r === rows - 1 && c === cols - 1) return steps;

    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const newRemain = remain - grid[nr][nc];
        const key = `${nr},${nc},${newRemain}`;
        if (newRemain >= 0 && !visited.has(key)) {
          visited.add(key);
          queue.push([nr, nc, newRemain, steps + 1]);
        }
      }
    }
  }
  return -1;
}

// Time: O(rows * cols * k) | Space: O(rows * cols * k)
```

```java
import java.util.*;

public class StatefulBFS {
    public int shortestPath(int[][] grid, int k) {
        int rows = grid.length, cols = grid[0].length;
        boolean[][][] visited = new boolean[rows][cols][k + 1];
        Queue<int[]> queue = new LinkedList<>();
        // queue element: [row, col, remain, steps]
        queue.offer(new int[]{0, 0, k, 0});
        visited[0][0][k] = true;

        int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1], remain = curr[2], steps = curr[3];
            if (r == rows - 1 && c == cols - 1) return steps;

            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    int newRemain = remain - grid[nr][nc];
                    if (newRemain >= 0 && !visited[nr][nc][newRemain]) {
                        visited[nr][nc][newRemain] = true;
                        queue.offer(new int[]{nr, nc, newRemain, steps + 1});
                    }
                }
            }
        }
        return -1;
    }
}

// Time: O(rows * cols * k) | Space: O(rows * cols * k)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Hard problem at eBay, you have about 30-35 minutes to understand the problem, design the solution, code it, and test it. That means you need to be writing code within 15 minutes of starting. Interviewers are watching for:

1. **Constraint identification** — Do you immediately ask about input bounds and edge cases? For example, "Can k be larger than the total obstacles?" or "Is the grid always non-empty?"
2. **Incremental correctness** — They prefer to see you build a brute force or naive solution first, then optimize. Saying "I'll start with a simple BFS ignoring k, then add the state dimension" shows structured thinking.
3. **Communication of trade-offs** — Explain why you chose BFS over DFS (shortest path property), and why a 3D visited array is necessary. Mention the time/space complexity as you go.
4. **Code cleanliness with e-commerce context** — Use descriptive variable names like `remainingObstaclePasses` instead of just `k`. If the problem is about shipping routes or inventory, name your functions accordingly.

## Upgrading from Medium to Hard

The jump from Medium to Hard at eBay is about **dimensionality increase** and **constraint stacking**. A Medium problem might ask for the shortest path in a grid. A Hard problem adds: "shortest path where you can break up to k obstacles, but breaking a cost-2 obstacle uses 2 passes, and you have a limited budget."

New techniques required:

- **Multi-dimensional DP or BFS state** (like the template above).
- **Combining two patterns** — e.g., interval scheduling plus binary search, or topological sort with cycle detection for order dependencies.
- **Handling "at most k" constraints** — This appears in problems like "Maximize Palindrome Length From Subsequences" or "Constrained Subsequence Sum," where you maintain a deque or heap to track the best previous states within a window.

Mindset shift: You must now **think in terms of state machines**. What are the minimal parameters that define a unique situation? In the BFS template, `(row, col, remaining_resource)` is a state. Missing that third dimension is the classic mistake.

## Specific Patterns for Hard

**Pattern 1: DP with Monotonic Queue Optimization**
Used in problems like "Constrained Subsequence Sum" (1425) or eBay problems involving maximizing profit with transaction limits. You maintain a deque of indices storing decreasing DP values to get the max from a sliding window in O(1).

```python
from collections import deque

def maxSubsequenceSum(nums, k):
    n = len(nums)
    dp = [0] * n
    dq = deque()  # stores indices, dp values decreasing
    for i in range(n):
        # remove out-of-window indices
        while dq and dq[0] < i - k:
            dq.popleft()
        dp[i] = nums[i] + (dp[dq[0]] if dq else 0)
        # maintain decreasing order
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()
        dq.append(i)
    return max(dp)
# Time: O(n) | Space: O(n)
```

**Pattern 2: Union-Find with Component Tracking**
For problems involving grouping items with constraints (e.g., "Similar String Groups" or account merging scenarios), you need Union-Find that tracks component size or a list of members. eBay might pose this as merging user accounts based on transaction similarities.

```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x
    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry: return
        if self.size[rx] < self.size[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        self.size[rx] += self.size[ry]
# Time for m operations: ~O(m α(n)) | Space: O(n)
```

## Practice Strategy

Don't just solve eBay's 10 Hard questions. Use them as a diagnostic. For each:

1. **First 15 minutes** — Attempt it without help. If stuck, identify the blocking point. Was it recognizing the pattern? Implementing the stateful BFS? Optimizing from O(n²) to O(n log n)?
2. **Study the pattern** — If it's stateful BFS, practice 3 similar problems from other companies (e.g., LeetCode 1293, 864, 787).
3. **Re-implement without reference** — 24 hours later, code it again from scratch. Time yourself.
4. **Daily target** — One Hard problem per day, with 30 minutes of focused effort followed by 30 minutes of analyzing solutions and writing notes on the pattern.

Recommended order for eBay Hards: Start with the stateful BFS problems, then DP with optimization, then graph/union-find. Always tie it back to a plausible eBay scenario—like routing a delivery drone through warehouse obstacles (stateful BFS) or merging duplicate user accounts (union-find).

[Practice Hard eBay questions](/company/ebay/hard)
