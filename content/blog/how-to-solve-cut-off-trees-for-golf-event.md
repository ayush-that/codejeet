---
title: "How to Solve Cut Off Trees for Golf Event — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Cut Off Trees for Golf Event. Hard difficulty, 36.1% acceptance rate. Topics: Array, Breadth-First Search, Heap (Priority Queue), Matrix."
date: "2027-10-11"
category: "dsa-patterns"
tags:
  ["cut-off-trees-for-golf-event", "array", "breadth-first-search", "heap-(priority-queue)", "hard"]
---

# How to Solve Cut Off Trees for Golf Event

You're given a forest grid where you need to cut down all trees in order of their height, starting from the shortest. The challenge is that you can only move through walkable cells (1's or tree cells) and need to find the shortest path between consecutive trees. What makes this problem tricky is that it's not just about finding one shortest path—it's about finding a sequence of shortest paths where each destination becomes the next starting point, and you need to handle unreachable trees.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Forest = [
  [1, 2, 3],
  [0, 0, 4],
  [7, 6, 5]
]
```

**Step 1: Identify all trees and sort them by height**

- Tree at (0,1): height 2
- Tree at (0,2): height 3
- Tree at (1,2): height 4
- Tree at (2,2): height 5
- Tree at (2,1): height 6
- Tree at (2,0): height 7

Sorted order: 2 → 3 → 4 → 5 → 6 → 7

**Step 2: Start at (0,0) and find path to first tree (2 at (0,1))**

- From (0,0) to (0,1): distance = 1 step
- Total steps so far: 1

**Step 3: Move to next tree (3 at (0,2))**

- From (0,1) to (0,2): distance = 1 step
- Total steps: 2

**Step 4: Move to next tree (4 at (1,2))**

- From (0,2) to (1,2): blocked by obstacle at (1,0) and (1,1)
- Need to go around: (0,2) → (0,1) → (0,0) → (2,0) → (2,1) → (2,2) → (1,2)
- Distance = 6 steps
- Total steps: 8

**Step 5: Continue this process** for trees 5, 6, and 7

- If any tree is unreachable, return -1
- Otherwise, sum all distances

The key insight: This is essentially a sequence of BFS problems where each BFS finds the shortest path from your current position to the next tree.

## Brute Force Approach

A naive approach might try to:

1. Sort all trees by height
2. For each consecutive pair of trees, use BFS to find the shortest path
3. Sum all distances

Wait—that's actually the right approach! The "brute force" aspect here isn't about the algorithm choice, but about implementation choices that make it too slow.

The truly naive approach would be to use DFS instead of BFS for pathfinding. DFS would explore all possible paths rather than finding the shortest one efficiently. Or worse, someone might try to use Dijkstra's algorithm on an unweighted graph, which is overkill and less efficient than BFS.

The challenge is that a straightforward BFS implementation can still be too slow if we're not careful. For an m × n grid with T trees, we run T+1 BFS operations (including from start to first tree). Each BFS is O(mn) in worst case. With T potentially up to mn, this gives O((mn)²) which is too slow for large grids.

## Optimized Approach

The key insight is that we **must** use BFS for each path segment because:

1. The grid is unweighted (all moves cost 1)
2. BFS guarantees the shortest path in unweighted graphs
3. We need the actual distance, not just whether a path exists

However, we can optimize within each BFS:

- Use early termination: stop BFS as soon as we reach the target tree
- Use a proper queue implementation (deque in Python, ArrayDeque in Java)
- Mark visited cells efficiently to avoid revisiting

The algorithm structure:

1. **Collect all trees**: Scan the grid, record positions of all cells > 1
2. **Sort trees by height**: We must cut trees in increasing height order
3. **Sequential BFS**: Starting from (0,0), BFS to each tree in sorted order
4. **Sum distances**: Add each BFS result to total, return -1 if any tree unreachable

## Optimal Solution

<div class="code-group">

```python
from collections import deque
from typing import List

# Time: O((m*n)^2) in worst case, but much better in practice due to early BFS termination
# Space: O(m*n) for BFS queue and visited set
class Solution:
    def cutOffTree(self, forest: List[List[int]]) -> int:
        # Step 1: Collect all trees with their positions and heights
        trees = []
        for i in range(len(forest)):
            for j in range(len(forest[0])):
                if forest[i][j] > 1:  # It's a tree
                    trees.append((forest[i][j], i, j))

        # Step 2: Sort trees by height (first element of tuple)
        trees.sort()

        # Step 3: BFS helper function to find shortest path between two points
        def bfs(start_row, start_col, target_row, target_col):
            # If start and target are the same, no steps needed
            if start_row == target_row and start_col == target_col:
                return 0

            m, n = len(forest), len(forest[0])
            # Directions: up, right, down, left
            directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]

            queue = deque()
            queue.append((start_row, start_col, 0))  # (row, col, distance)
            visited = [[False] * n for _ in range(m)]
            visited[start_row][start_col] = True

            while queue:
                row, col, dist = queue.popleft()

                # Explore all four neighbors
                for dr, dc in directions:
                    new_row, new_col = row + dr, col + dc

                    # Check bounds, walkability, and if not visited
                    if (0 <= new_row < m and 0 <= new_col < n and
                        forest[new_row][new_col] != 0 and
                        not visited[new_row][new_col]):

                        # If we reached the target, return distance + 1
                        if new_row == target_row and new_col == target_col:
                            return dist + 1

                        # Otherwise, add to queue for further exploration
                        visited[new_row][new_col] = True
                        queue.append((new_row, new_col, dist + 1))

            # Target not reachable
            return -1

        # Step 4: Process trees in sorted order
        total_steps = 0
        current_row, current_col = 0, 0  # Start position

        for height, target_row, target_col in trees:
            # Find shortest path to next tree
            steps = bfs(current_row, current_col, target_row, target_col)

            if steps == -1:  # Tree unreachable
                return -1

            total_steps += steps
            # Update current position to the tree we just cut
            current_row, current_col = target_row, target_col

        return total_steps
```

```javascript
// Time: O((m*n)^2) in worst case
// Space: O(m*n) for BFS queue and visited array
/**
 * @param {number[][]} forest
 * @return {number}
 */
var cutOffTree = function (forest) {
  // Step 1: Collect all trees with their positions and heights
  const trees = [];
  const m = forest.length;
  const n = forest[0].length;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (forest[i][j] > 1) {
        // It's a tree
        trees.push([forest[i][j], i, j]);
      }
    }
  }

  // Step 2: Sort trees by height (first element of array)
  trees.sort((a, b) => a[0] - b[0]);

  // Step 3: BFS helper function to find shortest path between two points
  const bfs = (startRow, startCol, targetRow, targetCol) => {
    // If start and target are the same, no steps needed
    if (startRow === targetRow && startCol === targetCol) {
      return 0;
    }

    // Directions: up, right, down, left
    const directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    const queue = [[startRow, startCol, 0]]; // [row, col, distance]
    const visited = Array(m)
      .fill()
      .map(() => Array(n).fill(false));
    visited[startRow][startCol] = true;

    while (queue.length > 0) {
      const [row, col, dist] = queue.shift();

      // Explore all four neighbors
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        // Check bounds, walkability, and if not visited
        if (
          newRow >= 0 &&
          newRow < m &&
          newCol >= 0 &&
          newCol < n &&
          forest[newRow][newCol] !== 0 &&
          !visited[newRow][newCol]
        ) {
          // If we reached the target, return distance + 1
          if (newRow === targetRow && newCol === targetCol) {
            return dist + 1;
          }

          // Otherwise, add to queue for further exploration
          visited[newRow][newCol] = true;
          queue.push([newRow, newCol, dist + 1]);
        }
      }
    }

    // Target not reachable
    return -1;
  };

  // Step 4: Process trees in sorted order
  let totalSteps = 0;
  let currentRow = 0,
    currentCol = 0; // Start position

  for (const [height, targetRow, targetCol] of trees) {
    // Find shortest path to next tree
    const steps = bfs(currentRow, currentCol, targetRow, targetCol);

    if (steps === -1) {
      // Tree unreachable
      return -1;
    }

    totalSteps += steps;
    // Update current position to the tree we just cut
    currentRow = targetRow;
    currentCol = targetCol;
  }

  return totalSteps;
};
```

```java
// Time: O((m*n)^2) in worst case
// Space: O(m*n) for BFS queue and visited array
import java.util.*;

class Solution {
    public int cutOffTree(List<List<Integer>> forest) {
        // Step 1: Collect all trees with their positions and heights
        List<int[]> trees = new ArrayList<>();
        int m = forest.size();
        int n = forest.get(0).size();

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int height = forest.get(i).get(j);
                if (height > 1) {  // It's a tree
                    trees.add(new int[]{height, i, j});
                }
            }
        }

        // Step 2: Sort trees by height (first element of array)
        trees.sort((a, b) -> Integer.compare(a[0], b[0]));

        // Step 3: Process trees in sorted order
        int totalSteps = 0;
        int currentRow = 0, currentCol = 0;  // Start position

        for (int[] tree : trees) {
            int targetRow = tree[1];
            int targetCol = tree[2];

            // Find shortest path to next tree
            int steps = bfs(forest, currentRow, currentCol, targetRow, targetCol);

            if (steps == -1) {  // Tree unreachable
                return -1;
            }

            totalSteps += steps;
            // Update current position to the tree we just cut
            currentRow = targetRow;
            currentCol = targetCol;
        }

        return totalSteps;
    }

    // BFS helper function to find shortest path between two points
    private int bfs(List<List<Integer>> forest, int startRow, int startCol,
                   int targetRow, int targetCol) {
        // If start and target are the same, no steps needed
        if (startRow == targetRow && startCol == targetCol) {
            return 0;
        }

        int m = forest.size();
        int n = forest.get(0).size();
        // Directions: up, right, down, left
        int[][] directions = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{startRow, startCol, 0});  // [row, col, distance]
        boolean[][] visited = new boolean[m][n];
        visited[startRow][startCol] = true;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];
            int dist = current[2];

            // Explore all four neighbors
            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                // Check bounds, walkability, and if not visited
                if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n &&
                    forest.get(newRow).get(newCol) != 0 && !visited[newRow][newCol]) {

                    // If we reached the target, return distance + 1
                    if (newRow == targetRow && newCol == targetCol) {
                        return dist + 1;
                    }

                    // Otherwise, add to queue for further exploration
                    visited[newRow][newCol] = true;
                    queue.offer(new int[]{newRow, newCol, dist + 1});
                }
            }
        }

        // Target not reachable
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(T × m × n) where T is the number of trees

- In worst case, T could be m × n (every cell is a tree)
- This gives O((m × n)²) in worst case
- Each BFS explores up to m × n cells
- We perform T+1 BFS operations (including from start to first tree)

**Space Complexity:** O(m × n)

- BFS queue can hold up to m × n cells in worst case
- Visited array requires m × n space
- Tree storage requires O(T) space, which is O(m × n) in worst case

The worst-case time might seem high, but in practice:

- BFS terminates early when target is found
- Most grids have far fewer trees than total cells
- The constraints (m, n ≤ 50) make this acceptable

## Common Mistakes

1. **Forgetting to check if starting position (0,0) is walkable**: If forest[0][0] == 0, you can't even start. Our solution handles this because BFS will return -1 when trying to reach the first tree.

2. **Using DFS instead of BFS for pathfinding**: DFS doesn't guarantee the shortest path in unweighted graphs. Candidates might try DFS because it's simpler to implement, but it gives wrong results.

3. **Not sorting trees correctly**: The problem requires cutting trees in strictly increasing height order. Some candidates might try to find optimal order dynamically, but the sorting approach is correct and simpler.

4. **Inefficient BFS implementation**: Using list.pop(0) in Python (O(n) instead of O(1)) or not using early termination. Always use deque for queue operations in Python.

5. **Forgetting to update current position**: After cutting a tree, you need to update your starting position for the next BFS. Otherwise, you're calculating paths from the wrong starting point.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Grid BFS for shortest path**: Similar to "Shortest Path in Binary Matrix" (LeetCode 1091) and "Walls and Gates" (LeetCode 286). Any time you need shortest path in unweighted grid, think BFS.

2. **Processing elements in sorted order**: Like "K Closest Points to Origin" (LeetCode 973) where you sort first, then process. The key insight is determining what order to process elements in.

3. **Sequence of dependent operations**: Similar to "Course Schedule" (LeetCode 207) where you need to complete tasks in specific order, though that uses topological sort rather than BFS.

The core pattern: When you need to perform a sequence of operations where each operation's result affects the next, and each operation itself requires an optimal substructure (like shortest path), you often need to chain together multiple runs of a fundamental algorithm.

## Key Takeaways

1. **BFS is for unweighted shortest path problems**: When all moves cost the same (like in a grid with 4-direction movement), BFS guarantees the shortest path. DFS does not.

2. **Break complex problems into smaller, familiar ones**: This problem seems daunting, but it's just "sort + repeated BFS". Recognizing familiar subproblems is key to solving hard problems.

3. **Always consider the starting position**: In sequence problems, your state changes after each operation. Remember to update your current position/state for the next iteration.

[Practice this problem on CodeJeet](/problem/cut-off-trees-for-golf-event)
