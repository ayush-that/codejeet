---
title: "Matrix Questions at Tinkoff: What to Expect"
description: "Prepare for Matrix interview questions at Tinkoff — patterns, difficulty breakdown, and study tips."
date: "2030-12-22"
category: "dsa-patterns"
tags: ["tinkoff", "matrix", "interview prep"]
---

If you're preparing for Tinkoff's technical interviews, you've likely seen the data: **5 out of their 27 most frequent coding questions involve matrices.** That's nearly 20% of their problem pool. This isn't a coincidence or a quirk of their question bank—it's a deliberate signal. Tinkoff, as a major fintech and tech player in Russia and Eastern Europe, deals heavily with data grids, financial modeling grids, risk assessment tables, and image processing (for document scanning and verification). The matrix is a direct analog for these real-world data structures. When they ask a matrix question, they're not just testing an algorithm; they're testing your ability to navigate and transform structured, two-dimensional data, a skill their engineers use daily. Expect at least one matrix problem in any on-site or final-round interview loop.

## Specific Patterns Tinkoff Favors

Tinkoff's matrix problems aren't about obscure linear algebra. They are almost exclusively applied **graph traversal in disguise**. The matrix is treated as an implicit graph where each cell is a node, and edges exist between adjacent cells (typically 4-directionally: up, down, left, right). This pattern is powerful and appears in three main flavors:

1.  **Connected Components / Flood Fill:** Finding islands of '1's in a sea of '0's (LeetCode #200 "Number of Islands"), or similarly, marking reachable regions. This tests DFS/BFS fundamentals.
2.  **Shortest Path in an Unweighted Grid:** Finding the minimum steps from a start cell to a target, often with obstacles. This is a classic BFS application (LeetCode #1091 "Shortest Path in Binary Matrix").
3.  **Dynamic Programming on Grids:** Less frequent than traversal, but appears for problems like unique paths (LeetCode #62 "Unique Paths") or minimum path sum (LeetCode #64 "Minimum Path Sum"). Tinkoff's DP problems tend to be iterative 2D DP, not recursive memoization.

They heavily favor **iterative solutions using queues (BFS) or stacks (DFS)**. Recursive DFS is acceptable for problems like "Number of Islands," but interviewers will often probe for the iterative version to ensure you understand stack management and can avoid stack overflow on large grids.

## How to Prepare

The core skill is instantly recognizing the matrix-as-graph and knowing which traversal to apply. Let's solidify the most common pattern: **BFS for shortest path in an unweighted grid.**

The template involves using a queue, a `visited` set (or modifying the grid in-place), and processing cells level-by-level. Here's the blueprint:

<div class="code-group">

```python
from collections import deque
from typing import List

def shortestPathBinaryMatrix(grid: List[List[int]]) -> int:
    if not grid or grid[0][0] == 1:
        return -1

    n = len(grid)
    # Directions: 8 adjacent cells. For 4-directional, use [(1,0),(-1,0),(0,1),(0,-1)]
    directions = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]

    queue = deque()
    queue.append((0, 0, 1))  # (row, col, distance)
    grid[0][0] = 1  # Mark as visited by setting to 1 (obstacle)

    while queue:
        r, c, dist = queue.popleft()
        if r == n-1 and c == n-1:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                queue.append((nr, nc, dist + 1))
                grid[nr][nc] = 1  # Mark visited
    return -1

# Time: O(N^2) — we visit each cell at most once.
# Space: O(N^2) — for the queue in the worst case (e.g., an open grid).
```

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
function shortestPathBinaryMatrix(grid) {
  if (!grid || grid[0][0] === 1) return -1;

  const n = grid.length;
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  const queue = [[0, 0, 1]]; // [row, col, distance]
  grid[0][0] = 1;

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift(); // For efficiency, use an index pointer.
    if (r === n - 1 && c === n - 1) return dist;

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
        queue.push([nr, nc, dist + 1]);
        grid[nr][nc] = 1;
      }
    }
  }
  return -1;
}
// Time: O(N^2) | Space: O(N^2)
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class Solution {
    public int shortestPathBinaryMatrix(int[][] grid) {
        if (grid == null || grid[0][0] == 1) return -1;

        int n = grid.length;
        int[][] directions = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0, 1}); // {row, col, distance}
        grid[0][0] = 1;

        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int r = cell[0], c = cell[1], dist = cell[2];
            if (r == n-1 && c == n-1) return dist;

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {
                    queue.offer(new int[]{nr, nc, dist + 1});
                    grid[nr][nc] = 1;
                }
            }
        }
        return -1;
    }
}
// Time: O(N^2) | Space: O(N^2)
```

</div>

For **connected components**, you swap the queue for a stack (DFS) and remove the distance tracking. The core neighbor-checking logic remains identical.

## How Tinkoff Tests Matrix vs Other Companies

Compared to FAANG companies, Tinkoff's matrix problems are more "pure" in their application. At Google or Meta, a matrix might be a small part of a larger system design or a complex DP problem with multiple states. At Tinkoff, the matrix _is_ the problem. They focus on clean, efficient implementation of fundamental graph algorithms applied to the grid.

Difficulty-wise, they sit at a **solid LeetCode Medium**. You won't see esoteric matrix rotations or advanced linear algebra. You will see problems that require you to adapt a standard BFS/DFS/DP template with one clever twist—for example, a multi-source BFS (starting from multiple points simultaneously) or a conditional move (like only moving in certain directions based on cell value). The twist is usually the key to the problem and what they use to separate candidates.

## Study Order

Don't jump straight into complex variations. Build your understanding sequentially:

1.  **Basic Traversal:** Master iterating through a matrix, understanding row/column indices, and checking 4-directional neighbors. This is your foundation.
2.  **Depth-First Search (DFS):** Learn to use DFS (both recursive and iterative) to explore connected regions. Start with "Number of Islands" (#200). This teaches you component counting.
3.  **Breadth-First Search (BFS):** Learn BFS for shortest path guarantees in an unweighted grid. Practice "Shortest Path in Binary Matrix" (#1091). Understand why DFS fails for shortest path here.
4.  **Dynamic Programming on Grids:** Learn to build a 2D DP table where `dp[i][j]` depends on `dp[i-1][j]` and `dp[i][j-1]`. Practice "Unique Paths" (#62) and "Minimum Path Sum" (#64).
5.  **Advanced Variations:** Finally, tackle multi-source BFS, BFS with constraints (like keys and doors), or DP with more complex state (like "Cherry Pickup"). This is where you solve Tinkoff's harder problems.

This order works because each step provides the prerequisite knowledge for the next. You can't reason about shortest path (BFS) without understanding neighbor traversal. You can't optimize path counting (DP) without understanding the basic movement through the grid.

## Recommended Practice Order

Solve these problems in sequence. Each introduces a new concept while reinforcing the last.

1.  **LeetCode #200 "Number of Islands"** (DFS/BFS components)
2.  **LeetCode #733 "Flood Fill"** (Simple DFS/BFS application)
3.  **LeetCode #1091 "Shortest Path in Binary Matrix"** (Standard BFS template)
4.  **LeetCode #994 "Rotting Oranges"** (Multi-source BFS—a key Tinkoff variation)
5.  **LeetCode #62 "Unique Paths"** (Intro to 2D DP)
6.  **LeetCode #64 "Minimum Path Sum"** (DP with minimization)
7.  **LeetCode #542 "01 Matrix"** (Another excellent multi-source BFS problem)

After this sequence, you will have covered 90% of the patterns Tinkoff uses. The final step is to practice their specific company-tagged problems to adapt your templates to their preferred twists.

[Practice Matrix at Tinkoff](/company/tinkoff/matrix)
