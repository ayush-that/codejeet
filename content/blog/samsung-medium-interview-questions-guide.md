---
title: "Medium Samsung Interview Questions: Strategy Guide"
description: "How to tackle 37 medium difficulty questions from Samsung — patterns, time targets, and practice tips."
date: "2032-06-28"
category: "tips"
tags: ["samsung", "medium", "interview prep"]
---

Medium questions at Samsung are where the real interview happens. Unlike Easy problems that often test basic syntax and simple logic, and Hard problems that might involve obscure algorithms, Medium questions at Samsung specifically assess your ability to design and implement efficient, robust solutions under time pressure. Out of their 69 tagged problems, 37 are Medium. This isn't an accident. These problems are the sweet spot for evaluating a candidate's core engineering competency: can you take a non-trivial, real-world adjacent problem, break it down, and translate it into clean, optimized code? The common thread is **applied data structures**—you're not just recalling that a hash map exists, but you're using it to track state in a simulation or to enable an O(n) pass over an array.

## Common Patterns and Templates

Samsung's Medium problems heavily favor **graph traversal (BFS/DFS), array manipulation with hashing, and simulation problems** that require careful state management. A significant portion are grid-based (matrix traversal) or involve parsing/transforming input data. The most common pattern you'll encounter is **Breadth-First Search on a grid with multiple states or constraints**. This isn't just "find the shortest path in an empty maze." It's "find the shortest path while tracking keys collected, or while a fire spreads, or while respecting time-based obstacles."

Here is a template for that quintessential BFS-with-state pattern, which is foundational for problems like "Shortest Path in a Grid with Obstacles Elimination" (a LeetCode archetype that aligns with Samsung's style).

<div class="code-group">

```python
from collections import deque

def bfs_grid_with_state(grid, start, max_obstacles):
    rows, cols = len(grid), len(grid[0])
    # State: (row, col, obstacles_removed)
    start_state = (0, 0, 0)
    # Visited tracks if we've been to a cell with a specific obstacle count.
    visited = set([start_state])
    queue = deque([(start_state, 0)])  # (state, steps)

    while queue:
        (r, c, k), steps = queue.popleft()

        # Check if we reached the target (often bottom-right corner)
        if r == rows - 1 and c == cols - 1:
            return steps

        for dr, dc in [(0,1), (1,0), (0,-1), (-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                new_k = k + (1 if grid[nr][nc] == 1 else 0)  # Assume 1 is obstacle
                new_state = (nr, nc, new_k)
                # Two validity checks: within grid bounds and obstacle limit
                if new_k <= max_obstacles and new_state not in visited:
                    visited.add(new_state)
                    queue.append((new_state, steps + 1))
    return -1  # Target unreachable

# Time: O(rows * cols * K) where K is max_obstacles. We might visit each cell K times.
# Space: O(rows * cols * K) for the visited set and queue.
```

```javascript
function bfsGridWithState(grid, maxObstacles) {
  const rows = grid.length,
    cols = grid[0].length;
  // State: [row, col, obstaclesRemoved]
  const startState = `0,0,0`;
  const visited = new Set([startState]);
  const queue = [[0, 0, 0, 0]]; // [row, col, obstaclesRemoved, steps]

  while (queue.length) {
    const [r, c, k, steps] = queue.shift();

    if (r === rows - 1 && c === cols - 1) {
      return steps;
    }

    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const newK = k + (grid[nr][nc] === 1 ? 1 : 0);
        const newState = `${nr},${nc},${newK}`;
        if (newK <= maxObstacles && !visited.has(newState)) {
          visited.add(newState);
          queue.push([nr, nc, newK, steps + 1]);
        }
      }
    }
  }
  return -1;
}

// Time: O(rows * cols * K) | Space: O(rows * cols * K)
```

```java
import java.util.*;

public class GridBFSWithState {
    public int shortestPath(int[][] grid, int k) {
        int rows = grid.length, cols = grid[0].length;
        // State encoded as string or using a 3D boolean array is common.
        // We'll use a 3D visited array: visited[row][col][obstaclesRemoved]
        boolean[][][] visited = new boolean[rows][cols][k + 1];
        Queue<int[]> queue = new LinkedList<>(); // [row, col, obstaclesRemoved, steps]
        queue.offer(new int[]{0, 0, 0, 0});
        visited[0][0][0] = true;

        int[][] dirs = {{0,1}, {1,0}, {0,-1}, {-1,0}};
        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1], ob = curr[2], steps = curr[3];

            if (r == rows - 1 && c == cols - 1) {
                return steps;
            }

            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    int newOb = ob + (grid[nr][nc] == 1 ? 1 : 0);
                    if (newOb <= k && !visited[nr][nc][newOb]) {
                        visited[nr][nc][newOb] = true;
                        queue.offer(new int[]{nr, nc, newOb, steps + 1});
                    }
                }
            }
        }
        return -1;
    }
}

// Time: O(rows * cols * K) | Space: O(rows * cols * K)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Medium problem at Samsung, you have approximately 25-30 minutes to: understand the problem, ask clarifying questions, design an approach, write the code, and test it. The interviewer is timing you, but they're watching for specific signals beyond raw speed.

1.  **Systematic Problem Breakdown:** Do you immediately start coding, or do you pause to restate the problem, identify input constraints, and walk through a small example? The latter is a strong positive signal.
2.  **Communication of Trade-offs:** When you propose a BFS solution, do you mention why DFS might be unsuitable (e.g., "DFS could get stuck in a cycle or won't guarantee the shortest path")? Articulating the "why" behind your data structure choice is crucial.
3.  **Robustness Over Cleverness:** Samsung's problems often have edge cases—empty inputs, single-element grids, maximum constraint values. Interviewers watch to see if you consider these _during_ your implementation, not just as an afterthought. They prefer a complete, handle-all-cases solution over a clever but brittle one.
4.  **Code Quality:** Use meaningful variable names (`queue` not `q`, `visited` not `v`). Write helper functions if logic becomes nested. This shows you write code for humans, not just for the judge.

## Key Differences from Easy Problems

The jump from Easy to Medium at Samsung is defined by two major shifts:

1.  **From Single-Pass to Multi-Pass or Stateful Traversal:** Easy problems are often solvable with a single loop or a straightforward application of a hash set. Medium problems require you to maintain auxiliary data structures _throughout_ a multi-step process. For example, you might need to run BFS, but the "visited" condition depends on a dynamic variable (like keys collected or obstacles broken), as shown in the template above.
2.  **From Direct Application to Pattern Adaptation:** An Easy problem might be "implement BFS to find a target in a grid." A Medium problem is "implement BFS, but you can break up to K walls, and you must track that in your state." You're not just applying an algorithm; you're adapting its core logic to a new constraint. This requires a deeper understanding of the algorithm's mechanics.

The mindset shift is from **"What data structure solves this?"** to **"How do I model the problem's state so that a known algorithm can process it?"**

## Specific Patterns for Medium

Beyond the BFS-with-state pattern, watch for these:

1.  **Union-Find for Dynamic Connectivity in a Grid:** Problems like "Number of Islands" (Easy) become Medium when the grid is dynamic (e.g., "Number of Islands II" #305, where cells are added one by one). Union-Find allows efficient merging of components as new land is added.

    <div class="code-group">
    ```python
    # Union-Find skeleton for grid problems
    class DSU:
        def __init__(self, n):
            self.parent = list(range(n))
            self.rank = [0] * n
        def find(self, x):
            if self.parent[x] != x:
                self.parent[x] = self.find(self.parent[x])
            return self.parent[x]
        def union(self, x, y):
            xr, yr = self.find(x), self.find(y)
            if xr == yr:
                return False
            if self.rank[xr] < self.rank[yr]:
                self.parent[xr] = yr
            elif self.rank[xr] > self.rank[yr]:
                self.parent[yr] = xr
            else:
                self.parent[yr] = xr
                self.rank[xr] += 1
            return True
    # Time for find/union: ~O(α(n)), effectively constant.
    ```
    </div>

2.  **Prefix Sum with Hashing for Subarray Problems:** When a problem asks for a subarray count or length meeting a certain sum condition (e.g., "find number of subarrays summing to K"), the naive solution is O(n²). The Medium-level technique is to use a running sum and a hash map to store frequencies of previous sums, enabling an O(n) solution. This pattern appears in various guises.

## Practice Strategy

Don't just solve all 37 Medium problems in order. Practice strategically:

1.  **Categorize First:** Sort problems by pattern: BFS/DFS, Union-Find, Array/Hash Map, Dynamic Programming, Simulation.
2.  **Daily Target:** Aim for 2-3 Medium problems per day, but focus on one pattern per session. For example, dedicate a day to solving 3 different "BFS on grid with a twist" problems.
3.  **Recommended Order:** Start with high-frequency patterns.
    - Week 1: Master grid BFS/DFS variations.
    - Week 2: Tackle array and string problems using hash maps for optimization (look for problems involving counts or sums).
    - Week 3: Practice simulation and parsing problems—these test your careful implementation skills, not just algorithm knowledge.
4.  **Simulate the Interview:** For each problem, set a 25-minute timer. Spend the first 5 minutes talking through your approach (out loud, even if alone). Code for 15 minutes. Use the last 5 minutes to test with edge cases.

The goal is to make the pattern recognition and implementation automatic, so in the interview, your brainpower is focused on the unique twist of the problem, not the boilerplate.

[Practice Medium Samsung questions](/company/samsung/medium)
