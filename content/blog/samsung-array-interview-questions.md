---
title: "Array Questions at Samsung: What to Expect"
description: "Prepare for Array interview questions at Samsung — patterns, difficulty breakdown, and study tips."
date: "2028-11-08"
category: "dsa-patterns"
tags: ["samsung", "array", "interview prep"]
---

If you're preparing for a Samsung interview, you should know one statistic cold: **43 out of their 69 tagged LeetCode problems are Array-based.** That's over 60%. This isn't a coincidence; it's a deliberate focus. Arrays are the fundamental data structure for representing grids (common in hardware simulation), sensor data streams, image buffers, and configuration matrices—all core to Samsung's electronics, semiconductor, and display businesses. In real interviews, you are almost guaranteed to face at least one array problem, often as the first technical screen. They use it as a litmus test for your grasp of indexing, bounds checking, and in-place manipulation—skills directly transferable to embedded systems and memory-constrained environments.

## Specific Patterns Samsung Favors

Samsung's array problems have a distinct flavor. They heavily favor **simulation and traversal on 2D arrays (grids)**, often modeling physical systems. You won't see many abstract mathematical array puzzles here. Instead, expect problems where you must navigate a grid according to specific rules, updating cell states iteratively. This is less about pure graph theory and more about **iterative simulation with BFS/DFS for exploration**.

A prime example is the classic **"Rotting Oranges" (LeetCode #994)** problem, which is essentially a multi-source BFS traversal on a grid. Another frequent pattern is **"Set Matrix Zeroes" (LeetCode #73)**, testing your ability to perform in-place updates with constant space—a critical skill for efficient memory usage. They also show a preference for **prefix sum and sliding window** techniques for problems involving subarray analysis on 1D arrays, which can model signal processing or data stream analysis.

The key insight: Samsung problems often have a **"state transition"** component. You're given an initial array state, a set of rules, and you must compute the final state after `k` iterations or until a termination condition is met. This tests loop control, conditionals, and sometimes queue management for BFS.

## How to Prepare

Your preparation must center on mastering grid traversal and in-place algorithms. Let's look at the core pattern for multi-source BFS on a grid, as seen in "Rotting Orunes" and many Samsung variants.

<div class="code-group">

```python
from collections import deque
from typing import List

def orangesRotting(grid: List[List[int]]) -> int:
    """
    Multi-source BFS to simulate rot propagation.
    Time: O(m * n) | Space: O(m * n) for the queue in worst case.
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    minutes_passed = 0

    # Initialize: find all rotten oranges (sources) and count fresh ones.
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    # Directions: up, down, left, right.
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    # BFS in layers to count minutes.
    while queue and fresh_count > 0:
        # Process all nodes at the current minute mark.
        for _ in range(len(queue)):
            row, col = queue.popleft()

            for dr, dc in directions:
                nr, nc = row + dr, col + dc
                # If adjacent cell is fresh, rot it and add to queue.
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh_count -= 1
                    queue.append((nr, nc))

        minutes_passed += 1

    return minutes_passed if fresh_count == 0 else -1
```

```javascript
/**
 * Multi-source BFS to simulate rot propagation.
 * Time: O(m * n) | Space: O(m * n) for the queue in worst case.
 */
function orangesRotting(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;

  // Initialize sources and count fresh oranges.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        freshCount++;
      }
    }
  }

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0 && freshCount > 0) {
    // Process one complete layer (all nodes at current minute).
    const layerSize = queue.length;
    for (let i = 0; i < layerSize; i++) {
      const [row, col] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          freshCount--;
          queue.push([nr, nc]);
        }
      }
    }
    minutes++;
  }

  return freshCount === 0 ? minutes : -1;
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class Solution {
    /**
     * Multi-source BFS to simulate rot propagation.
     * Time: O(m * n) | Space: O(m * n) for the queue in worst case.
     */
    public int orangesRotting(int[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;
        int minutes = 0;

        // Initialize
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 2) {
                    queue.offer(new int[]{r, c});
                } else if (grid[r][c] == 1) {
                    freshCount++;
                }
            }
        }

        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};

        while (!queue.isEmpty() && freshCount > 0) {
            int layerSize = queue.size();
            for (int i = 0; i < layerSize; i++) {
                int[] cell = queue.poll();
                int row = cell[0];
                int col = cell[1];

                for (int[] dir : directions) {
                    int nr = row + dir[0];
                    int nc = col + dir[1];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        freshCount--;
                        queue.offer(new int[]{nr, nc});
                    }
                }
            }
            minutes++;
        }

        return freshCount == 0 ? minutes : -1;
    }
}
```

</div>

Another critical pattern is the **in-place modification with markers**, as used in "Set Matrix Zeroes". The constant-space solution uses the first row and first column as markers, requiring careful handling to avoid overwriting data.

## How Samsung Tests Array vs Other Companies

Compared to other tech giants, Samsung's array questions are less about clever algorithmic tricks and more about **robust implementation and edge-case handling**. At companies like Google or Meta, an array problem might involve a complex combination of hash maps and two pointers to minimize time complexity. At Samsung, the complexity often lies in the **simulation logic itself**. The difficulty is not in knowing an obscure algorithm, but in cleanly translating a set of physical or business rules into bug-free code that handles all grid boundaries and state conditions.

What's unique is the **"iterative transformation"** aspect. You're often asked to return the state after `k` steps, not just a yes/no or a single number. This tests your ability to manage loops and state updates without introducing off-by-one errors. They also tend to provide problems with larger constraints, pushing you to think about time optimization, but usually within the realm of standard BFS/DFS or prefix sums.

## Study Order

Tackle array topics in this order to build a solid foundation for Samsung's style:

1.  **Basic 1D Array Traversal & Two Pointers:** Start with fundamentals like reversing, sliding window, and prefix sums. This builds intuition for indexing. (e.g., LeetCode #53 Maximum Subarray, #209 Minimum Size Subarray Sum).
2.  **In-place Array Operations:** Learn to manipulate arrays without extra space. This is crucial for their memory-conscious problems. (e.g., LeetCode #283 Move Zeroes, #75 Sort Colors).
3.  **2D Grid Traversal (DFS/BFS):** Master the four-directional movement, visited sets, and layer counting. This is the absolute core. (e.g., LeetCode #200 Number of Islands, #994 Rotting Oranges).
4.  **Simulation on Grids:** Practice problems where you update the grid based on neighbor states over multiple rounds. This directly models their favorite question type. (e.g., LeetCode #289 Game of Life).
5.  **Matrix/Grid-Specific Algorithms:** Finally, study algorithms like matrix rotation, spiral traversal, and search in a sorted matrix. These are less frequent but appear as harder problems.

## Recommended Practice Order

Solve these problems in sequence to progressively build the skills Samsung tests:

1.  **Two Sum (#1)** - Warm-up on hash map usage with arrays.
2.  **Best Time to Buy and Sell Stock (#121)** - Introduction to single-pass logic.
3.  **Product of Array Except Self (#238)** - Master prefix and suffix product thinking.
4.  **Set Matrix Zeroes (#73)** - Drill the in-place, constant-space marker technique.
5.  **Spiral Matrix (#54)** - Practice complex 2D indexing and boundary management.
6.  **Number of Islands (#200)** - Solidify your DFS/BFS template for grids.
7.  **Rotting Oranges (#994)** - Combine BFS with layer counting for simulation.
8.  **Game of Life (#289)** - Advanced simulation requiring simultaneous state updates.
9.  **Search a 2D Matrix II (#240)** - Efficient search in a sorted grid, a common optimization challenge.

This sequence moves from foundational 1D logic to the complex 2D simulations that are Samsung's hallmark. Focus on writing clean, correct code on the first try—they value accuracy over flashy, one-line solutions.

[Practice Array at Samsung](/company/samsung/array)
