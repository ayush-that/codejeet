---
title: "How to Solve Number of Closed Islands — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Closed Islands. Medium difficulty, 67.0% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix."
date: "2028-03-01"
category: "dsa-patterns"
tags: ["number-of-closed-islands", "array", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Number of Closed Islands

This problem asks us to count islands in a 2D grid where an island is defined as a group of connected land cells (0s) that is completely surrounded by water cells (1s) on all four sides. The tricky part is distinguishing between regular islands and "closed" islands - an island touching the grid boundary cannot be closed since it's not fully surrounded by water.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Grid:
1 1 1 1 1
1 0 0 1 1
1 0 0 0 1
1 1 1 1 1
```

Step 1: We need to identify all connected groups of 0s (islands).

Step 2: Check if each island is "closed" - completely surrounded by 1s.

Let's walk through the grid:

- Cell (1,1) is a 0. It's part of an island with cells (1,1), (1,2), (2,1), (2,2), (2,3)
- This island touches the boundary? No, all its cells are inside the grid.
- Is it surrounded by 1s? Let's check:
  - Top of (1,1): (0,1) is 1 ✓
  - Bottom of (1,1): (2,1) is 0 (but that's part of the island)
  - We need to check the island's perimeter cells:
    - (1,1): top is 1, left is 1
    - (1,2): top is 1, right is 1
    - (2,1): left is 1
    - (2,2): (all neighbors are 0s or 1s - need to check carefully)
    - (2,3): right is 1, bottom is 1
  - All border cells of this island have water neighbors or grid edges? Actually, this island IS closed! It's completely surrounded by 1s.

But wait - we need to be careful. The key insight: **Any island touching the grid boundary cannot be closed.** So we should first eliminate all islands connected to the boundary, then count what remains.

## Brute Force Approach

A naive approach might be:

1. Find all islands using BFS/DFS
2. For each island, check if every cell in it is not on the boundary
3. Count those that pass the check

The problem with this approach is efficiency and correctness. We'd need to:

- Store each island separately
- Check each cell in each island for boundary contact
- Handle the case where an island might have internal holes (though the problem doesn't require this)

But there's a simpler insight: **If we remove (mark as water) all islands connected to the boundary, then all remaining islands must be closed islands.** This is because any island not connected to the boundary is by definition surrounded by water (or other islands, but those would also be connected to water).

## Optimized Approach

The optimal approach uses a two-phase process:

1. **Elimination Phase**: Traverse all cells on the grid boundary. For each boundary cell that's land (0), perform DFS/BFS to mark all connected land cells as visited (or convert them to water). This removes all islands that touch the boundary.

2. **Counting Phase**: After removing boundary-connected islands, traverse the entire grid. For each unvisited land cell, perform DFS/BFS to mark the entire island as visited and increment our count. Each island found in this phase is guaranteed to be a closed island.

Why does this work?

- Any island touching the boundary cannot be closed (it has at least one side not surrounded by water)
- After removing boundary-connected islands, any remaining island is completely surrounded by water (since if it touched water that wasn't at the boundary, that water would connect to the boundary through other water cells)
- The grid edges act as "water" for the purpose of determining closure

## Optimal Solution

Here's the complete solution using DFS:

<div class="code-group">

```python
# Time: O(m*n) where m=rows, n=cols - we visit each cell at most twice
# Space: O(m*n) in worst case for recursion stack (when grid is all land)
def closedIsland(grid):
    """
    Counts the number of closed islands in a 2D grid.
    A closed island is a group of 0s completely surrounded by 1s.
    """
    if not grid or not grid[0]:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        """
        Depth-first search to mark all connected land cells.
        Returns False if the island touches boundary, True otherwise.
        """
        # If out of bounds, we've hit water (grid edge)
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return False

        # If current cell is water or already visited, continue
        if grid[r][c] == 1:
            return True

        # Mark current land cell as visited by converting to water
        grid[r][c] = 1

        # Explore all four directions
        # We use AND (not OR) because ALL parts must not touch boundary
        # for the island to be closed
        up = dfs(r - 1, c)
        down = dfs(r + 1, c)
        left = dfs(r, c - 1)
        right = dfs(r, c + 1)

        # All directions must be within bounds and not touch boundary
        return up and down and left and right

    # First, eliminate islands connected to boundary
    # This is crucial: any island touching boundary cannot be closed
    for r in range(rows):
        for c in range(cols):
            # Only check boundary cells
            if r == 0 or r == rows - 1 or c == 0 or c == cols - 1:
                if grid[r][c] == 0:
                    dfs(r, c)

    # Now count remaining islands (all are closed)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 0:
                # Start DFS and count this island
                dfs(r, c)
                count += 1

    return count
```

```javascript
// Time: O(m*n) where m=rows, n=cols
// Space: O(m*n) in worst case for recursion stack
function closedIsland(grid) {
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return 0;
  }

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  // DFS helper function
  function dfs(r, c) {
    // If out of bounds, we've reached grid edge (considered water)
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
      return false;
    }

    // If current cell is water or already visited
    if (grid[r][c] === 1) {
      return true;
    }

    // Mark as visited by converting to water
    grid[r][c] = 1;

    // Explore all four directions
    const up = dfs(r - 1, c);
    const down = dfs(r + 1, c);
    const left = dfs(r, c - 1);
    const right = dfs(r, c + 1);

    // All directions must be valid for island to be closed
    return up && down && left && right;
  }

  // Phase 1: Eliminate islands touching boundary
  // These cannot be closed islands
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Check only boundary cells
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        if (grid[r][c] === 0) {
          dfs(r, c);
        }
      }
    }
  }

  // Phase 2: Count remaining islands
  // All remaining islands are closed
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0) {
        dfs(r, c);
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(m*n) where m=rows, n=cols
// Space: O(m*n) in worst case for recursion stack
class Solution {
    public int closedIsland(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }

        int rows = grid.length;
        int cols = grid[0].length;
        int count = 0;

        // First, eliminate all islands connected to boundary
        // These cannot be closed islands
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                // Only process boundary cells
                if (r == 0 || r == rows - 1 || c == 0 || c == cols - 1) {
                    if (grid[r][c] == 0) {
                        dfs(grid, r, c);
                    }
                }
            }
        }

        // Now count remaining islands
        // All of these are closed islands
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 0) {
                    dfs(grid, r, c);
                    count++;
                }
            }
        }

        return count;
    }

    private void dfs(int[][] grid, int r, int c) {
        int rows = grid.length;
        int cols = grid[0].length;

        // Check bounds
        if (r < 0 || r >= rows || c < 0 || c >= cols) {
            return;
        }

        // If water or already visited, return
        if (grid[r][c] == 1) {
            return;
        }

        // Mark as visited by converting to water
        grid[r][c] = 1;

        // Explore all four directions
        dfs(grid, r - 1, c); // up
        dfs(grid, r + 1, c); // down
        dfs(grid, r, c - 1); // left
        dfs(grid, r, c + 1); // right
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- We visit each cell at most twice: once during boundary elimination and once during counting
- Each DFS/BFS traversal visits cells in its island exactly once
- In worst case (all land), we traverse the entire grid twice, which is still O(m×n)

**Space Complexity: O(m×n) in worst case**

- For DFS: The recursion stack can go as deep as m×n in worst case (when grid is all land and we start from center)
- For BFS: The queue can store up to O(min(m,n)) cells at once
- We modify the input grid in-place, so no additional space for visited matrix

The space complexity can be reduced to O(min(m,n)) using BFS with iterative queue, but DFS is often simpler to implement.

## Common Mistakes

1. **Not handling boundary islands first**: The most common mistake is trying to check if each island is closed by examining its perimeter. This is complex and error-prone. The correct approach is to eliminate boundary-connected islands first, then count what remains.

2. **Incorrect DFS return logic**: When using DFS that returns boolean (as in the Python/JS versions), candidates often use OR instead of AND. We need ALL directions to be valid (not touching boundary) for the island to be closed.

3. **Forgetting to mark cells as visited**: This leads to infinite recursion or counting the same island multiple times. Always mark cells as visited immediately when you encounter them.

4. **Not checking all boundary cells**: Some candidates only check the four corners or forget that islands can touch the boundary at any point, not just corners.

5. **Modifying input without permission**: While our solution modifies the input, in an interview you should ask if modification is allowed. If not, use a separate visited array.

## When You'll See This Pattern

This "boundary elimination" pattern appears in several grid traversal problems:

1. **Number of Enclaves (LeetCode 1020)**: Almost identical to this problem - count land cells that cannot walk off the grid.

2. **Surrounded Regions (LeetCode 130)**: Capture regions surrounded by 'X's. The solution: first mark 'O's connected to boundary, then flip remaining 'O's to 'X's.

3. **Pacific Atlantic Water Flow (LeetCode 417)**: Water flows from cells to oceans. Start DFS from ocean boundaries and mark reachable cells.

The common theme: **Start from boundaries to eliminate invalid regions, then process what remains.** This is often more efficient than checking each region individually.

## Key Takeaways

1. **Boundary-first approach**: When looking for "closed" or "surrounded" regions in a grid, start by eliminating regions connected to boundaries. What remains must be closed.

2. **In-place modification**: When allowed, modifying the input grid to mark visited cells saves space compared to maintaining a separate visited matrix.

3. **DFS vs BFS choice**: Both work for this problem. DFS is simpler to code recursively, while BFS uses less space in worst case. Know both but choose based on interview context.

4. **Grid traversal fundamentals**: This problem tests core skills in matrix traversal, connected components, and careful handling of boundary conditions.

[Practice this problem on CodeJeet](/problem/number-of-closed-islands)
