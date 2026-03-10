---
title: "How to Solve Find All Groups of Farmland — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find All Groups of Farmland. Medium difficulty, 75.5% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Matrix."
date: "2026-10-23"
category: "dsa-patterns"
tags:
  ["find-all-groups-of-farmland", "array", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Find All Groups of Farmland

You're given a binary matrix representing farmland (1s) and forest (0s), where farmland always appears in axis-aligned rectangular groups. Your task is to find the coordinates of all farmland rectangles, returning each as `[top-left-row, top-left-col, bottom-right-row, bottom-right-col]`. What makes this problem interesting is that farmland rectangles don't touch each other (they're separated by forest), which simplifies the detection logic compared to problems where shapes can be connected.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
land = [
    [1, 1, 0, 0, 0],
    [1, 1, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0]
]
```

We need to find all rectangular groups of 1s. Let's walk through the matrix cell by cell:

1. **Cell (0,0)**: Value is 1. This is the start of a farmland rectangle. Since rectangles are axis-aligned and don't touch, we can find the bottom-right corner by:
   - Moving right while we see 1s: (0,1) is 1, (0,2) is 0 → right boundary at column 1
   - Moving down while we see 1s: (1,0) is 1, (2,0) is 0 → bottom boundary at row 1
   - But wait! We need to check if the entire rectangle is filled with 1s. Let's verify:
     - (1,0) is 1 ✓
     - (1,1) is 1 ✓
   - So our first rectangle is `[0, 0, 1, 1]`

2. **Continue scanning**: We've already processed the first rectangle, so we skip to the next unvisited farmland cell. After (0,0) and (0,1), we reach (0,2) which is 0, then (0,3) which is 0, then (0,4) which is 0.

3. **Row 1**: (1,0) and (1,1) are already part of the first rectangle, so we skip them. (1,2) is 0. (1,3) is 1 - this is a new rectangle!
   - Find right boundary: (1,4) is 1, then out of bounds → right boundary at column 4
   - Find bottom boundary: (2,3) is 1, (2,4) is 1, (3,3) is 0 → bottom boundary at row 2
   - Verify the rectangle: Check (2,3) and (2,4) are both 1 ✓
   - Second rectangle: `[1, 3, 2, 4]`

4. **Continue scanning**: The rest of the matrix contains only 0s or already-processed cells.

Final result: `[[0,0,1,1], [1,3,2,4]]`

The key insight: Once we find the top-left corner of a rectangle (a 1 that hasn't been visited yet), we can find the bottom-right corner by scanning right and down, then mark the entire rectangle as visited to avoid duplicate processing.

## Brute Force Approach

A naive approach might be to check every possible rectangle in the matrix to see if it's all 1s. For each cell as a potential top-left corner, we'd check all possible bottom-right corners, verify the rectangle contains only 1s, and ensure it's maximal (not contained in a larger rectangle). This would be O((mn)³) time - checking O((mn)²) rectangles, each taking O(mn) time to verify.

Even with optimization, a brute force approach would be inefficient. The problem constraints (m, n up to 300) make O(m²n²) approaches potentially too slow (up to ~8 billion operations).

What makes the brute force particularly bad here is that it doesn't leverage the key property: farmland rectangles don't touch each other. This means once we find a farmland cell, we know exactly which rectangle it belongs to, and we can skip the entire rectangle after processing it.

## Optimized Approach

The optimal approach uses a single pass through the matrix with intelligent skipping:

1. **Scan systematically**: Traverse the matrix row by row, left to right.
2. **Detect new rectangles**: When we encounter a `1` that hasn't been visited (or processed), it must be the top-left corner of a new rectangle. Why? Because if it were inside a rectangle we've already processed, we would have marked it as visited.
3. **Find rectangle boundaries**: From the top-left corner:
   - Move right until you hit a `0` or the matrix boundary → this gives you the rightmost column
   - Move down until you hit a `0` or the matrix boundary → this gives you the bottommost row
   - The bottom-right corner is at the intersection of these boundaries
4. **Mark as visited**: To avoid reprocessing, we can either:
   - Use a visited matrix to mark all cells in the rectangle
   - Or simply skip the entire rectangle in our main scan (since we know its boundaries)
5. **Add to results**: Store `[top-left-row, top-left-col, bottom-right-row, bottom-right-col]`

The critical insight is that farmland rectangles are **non-overlapping and axis-aligned**. This means:

- The first `1` we encounter in reading order (top-to-bottom, left-to-right) that we haven't processed must be a top-left corner
- We can find the full rectangle by expanding right and down
- We'll never find another rectangle starting inside this one

This approach is O(mn) time since we visit each cell at most once, and O(1) extra space if we modify the input matrix to mark visited cells, or O(mn) if we use a separate visited matrix.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m*n) - We visit each cell at most once
# Space: O(1) - We modify the input in place, or O(m*n) if we can't modify input
def findFarmland(land):
    """
    Finds all rectangular farmland groups in the given binary matrix.

    Args:
        land: List[List[int]] - Binary matrix where 1 represents farmland

    Returns:
        List[List[int]] - List of rectangles as [r1, c1, r2, c2]
    """
    m, n = len(land), len(land[0])
    result = []

    # Traverse the matrix row by row
    for i in range(m):
        for j in range(n):
            # If we find farmland that hasn't been processed (marked as -1)
            if land[i][j] == 1:
                # This must be the top-left corner of a new rectangle
                r1, c1 = i, j

                # Find the bottom-right corner
                # Start from the current position
                r2, c2 = i, j

                # Expand downwards to find the bottom boundary
                # We check rows below until we hit forest or matrix edge
                while r2 + 1 < m and land[r2 + 1][j] == 1:
                    r2 += 1

                # Expand rightwards to find the right boundary
                # We check columns to the right until we hit forest or matrix edge
                while c2 + 1 < n and land[i][c2 + 1] == 1:
                    c2 += 1

                # Mark the entire rectangle as visited by setting to -1
                # This prevents reprocessing cells from this rectangle
                for r in range(r1, r2 + 1):
                    for c in range(c1, c2 + 1):
                        land[r][c] = -1

                # Add the rectangle coordinates to results
                result.append([r1, c1, r2, c2])

    return result
```

```javascript
// Time: O(m*n) - We visit each cell at most once
// Space: O(1) - We modify the input in place
/**
 * Finds all rectangular farmland groups in the given binary matrix.
 *
 * @param {number[][]} land - Binary matrix where 1 represents farmland
 * @return {number[][]} - List of rectangles as [r1, c1, r2, c2]
 */
function findFarmland(land) {
  const m = land.length;
  const n = land[0].length;
  const result = [];

  // Traverse the matrix row by row
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // If we find farmland that hasn't been processed (marked as -1)
      if (land[i][j] === 1) {
        // This must be the top-left corner of a new rectangle
        const r1 = i,
          c1 = j;

        // Find the bottom-right corner
        let r2 = i,
          c2 = j;

        // Expand downwards to find the bottom boundary
        // Check rows below until we hit forest or matrix edge
        while (r2 + 1 < m && land[r2 + 1][j] === 1) {
          r2++;
        }

        // Expand rightwards to find the right boundary
        // Check columns to the right until we hit forest or matrix edge
        while (c2 + 1 < n && land[i][c2 + 1] === 1) {
          c2++;
        }

        // Mark the entire rectangle as visited by setting to -1
        // This prevents reprocessing cells from this rectangle
        for (let r = r1; r <= r2; r++) {
          for (let c = c1; c <= c2; c++) {
            land[r][c] = -1;
          }
        }

        // Add the rectangle coordinates to results
        result.push([r1, c1, r2, c2]);
      }
    }
  }

  return result;
}
```

```java
// Time: O(m*n) - We visit each cell at most once
// Space: O(1) - We modify the input in place
import java.util.ArrayList;
import java.util.List;

class Solution {
    /**
     * Finds all rectangular farmland groups in the given binary matrix.
     *
     * @param land - Binary matrix where 1 represents farmland
     * @return List of rectangles as [r1, c1, r2, c2]
     */
    public int[][] findFarmland(int[][] land) {
        int m = land.length;
        int n = land[0].length;
        List<int[]> resultList = new ArrayList<>();

        // Traverse the matrix row by row
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // If we find farmland that hasn't been processed (marked as -1)
                if (land[i][j] == 1) {
                    // This must be the top-left corner of a new rectangle
                    int r1 = i, c1 = j;

                    // Find the bottom-right corner
                    int r2 = i, c2 = j;

                    // Expand downwards to find the bottom boundary
                    // Check rows below until we hit forest or matrix edge
                    while (r2 + 1 < m && land[r2 + 1][j] == 1) {
                        r2++;
                    }

                    // Expand rightwards to find the right boundary
                    // Check columns to the right until we hit forest or matrix edge
                    while (c2 + 1 < n && land[i][c2 + 1] == 1) {
                        c2++;
                    }

                    // Mark the entire rectangle as visited by setting to -1
                    // This prevents reprocessing cells from this rectangle
                    for (int r = r1; r <= r2; r++) {
                        for (int c = c1; c <= c2; c++) {
                            land[r][c] = -1;
                        }
                    }

                    // Add the rectangle coordinates to results
                    resultList.add(new int[]{r1, c1, r2, c2});
                }
            }
        }

        // Convert List to array for return type
        int[][] result = new int[resultList.size()][4];
        for (int i = 0; i < resultList.size(); i++) {
            result[i] = resultList.get(i);
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)**

- We traverse each cell of the m×n matrix once in the outer loops
- The while loops for finding boundaries don't add to the complexity because:
  - Each cell is checked at most once in the downward expansion (when it's in the first column of a rectangle)
  - Each cell is checked at most once in the rightward expansion (when it's in the first row of a rectangle)
- The nested loops for marking visited cells process each farmland cell exactly once
- Overall, each cell is processed a constant number of times

**Space Complexity: O(1) additional space** (if we can modify the input matrix)

- We only use a few variables and the result list
- If we cannot modify the input, we would need O(m×n) space for a visited matrix
- The output space is O(k) where k is the number of rectangles, but this is not counted as extra space

## Common Mistakes

1. **Not marking visited cells properly**: Some candidates find the rectangle boundaries but forget to mark the interior cells as visited. This causes the algorithm to process the same rectangle multiple times when it encounters other cells within it. Always mark ALL cells in the rectangle after finding its boundaries.

2. **Incorrect boundary expansion**: Expanding both right and down from every cell instead of just from the top-left corner. Remember: once you find the top-left corner, you only need to expand right from the top row and down from the left column to find the full rectangle boundaries.

3. **Off-by-one errors in rectangle coordinates**: When adding 1 to indices or checking bounds, it's easy to make mistakes. Remember that array indices are 0-based, and when we say "bottom-right corner," we mean the last row and column that contain farmland, not one past it.

4. **Assuming rectangles can touch**: The problem states rectangles are separated by forest, but some candidates write code that handles touching rectangles. This overcomplicates the solution. Always read problem constraints carefully - they often simplify the implementation.

## When You'll See This Pattern

This "connected components in a grid" pattern appears in many matrix problems:

1. **Number of Islands (Medium)**: Similar grid traversal, but islands can have arbitrary shapes (not just rectangles). You still scan for unvisited land and explore connected cells.

2. **Count Sub Islands (Medium)**: Builds on the island concept with two grids. The rectangular constraint in "Find All Groups of Farmland" actually makes it simpler than these island problems.

3. **Max Area of Island (Medium)**: Another connected components problem where you need to find the size of each component, not just its boundaries.

4. **Robot Room Cleaner (Hard)**: Uses similar grid traversal concepts but in a more complex, interactive setting.

The key difference with "Find All Groups of Farmland" is the rectangular constraint, which allows for a more efficient boundary-finding approach compared to general DFS/BFS needed for arbitrary shapes.

## Key Takeaways

1. **Constraints simplify algorithms**: The fact that farmland appears only in non-touching rectangles is a critical constraint that allows the efficient boundary scanning approach. Always look for simplifying constraints in problem statements.

2. **First unvisited 1 is a top-left corner**: In reading order traversal of a matrix with non-touching rectangles, the first unvisited `1` you encounter must be the top-left corner of a new rectangle. This is a powerful insight that eliminates the need to check all possible top-left candidates.

3. **Mark visited cells systematically**: When processing connected components in a grid, always have a clear strategy for marking cells as visited to avoid infinite loops or duplicate processing. Modifying the input matrix in-place is often the most space-efficient approach.

Related problems: [Number of Islands](/problem/number-of-islands), [Count Sub Islands](/problem/count-sub-islands)
