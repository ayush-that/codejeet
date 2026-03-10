---
title: "How to Solve Flood Fill — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Flood Fill. Easy difficulty, 67.9% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Matrix."
date: "2026-08-03"
category: "dsa-patterns"
tags: ["flood-fill", "array", "depth-first-search", "breadth-first-search", "easy"]
---

# How to Solve Flood Fill

Flood fill is a classic algorithm that simulates the "paint bucket" tool in image editing software. You're given a starting pixel and a new color, and you need to change all connected pixels of the same original color to the new color. What makes this problem interesting is that it's a perfect introduction to graph traversal algorithms on a grid, where each pixel is a node and adjacent pixels are connected edges. The tricky part is avoiding infinite loops by tracking which pixels we've already visited.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Input image:
[
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1]
]
sr = 1, sc = 1, color = 2

Starting pixel: image[1][1] = 1
Target color to replace: 1
New color: 2
```

**Step 1:** Start at (1,1) with value 1. Since this equals our target color (1), we change it to 2.

```
[
  [1, 1, 1],
  [1, 2, 0],
  [1, 0, 1]
]
```

**Step 2:** Check all 4-directional neighbors of (1,1):

- Up: (0,1) = 1 → matches target, will be changed
- Down: (2,1) = 0 → doesn't match target, skip
- Left: (1,0) = 1 → matches target, will be changed
- Right: (1,2) = 0 → doesn't match target, skip

**Step 3:** Process (0,1) and (1,0). Let's do (0,1) first:
Change (0,1) to 2, then check its neighbors:

- Up: (-1,1) → out of bounds, skip
- Down: (1,1) = 2 → already processed, skip
- Left: (0,0) = 1 → matches target, will be changed
- Right: (0,2) = 1 → matches target, will be changed

```
[
  [1, 2, 1],
  [1, 2, 0],
  [1, 0, 1]
]
```

**Step 4:** Process (1,0):
Change (1,0) to 2, then check its neighbors:

- Up: (0,0) = 1 → matches target, will be changed
- Down: (2,0) = 1 → matches target, will be changed
- Left: (1,-1) → out of bounds, skip
- Right: (1,1) = 2 → already processed, skip

```
[
  [1, 2, 1],
  [2, 2, 0],
  [1, 0, 1]
]
```

**Step 5:** Continue this process until all connected 1's are changed to 2. The final result:

```
[
  [2, 2, 2],
  [2, 2, 0],
  [2, 0, 1]
]
```

Notice that (2,2) remains 1 because it's not connected to our starting region - it's separated by a 0 at (2,1).

## Brute Force Approach

There's no true "brute force" alternative for flood fill since any solution must visit each connected pixel at least once. However, a naive approach would be to scan the entire matrix and change every pixel that matches the starting color. This fails because it would change **all** pixels of that color in the entire image, not just the connected region.

For example, in our visual walkthrough, the naive approach would also change the isolated 1 at (2,2) to 2, which is incorrect. The key insight is that we only want to change pixels that are connected to the starting point through a path of the same color.

## Optimal Solution

The optimal solution uses either Depth-First Search (DFS) or Breadth-First Search (BFS) to traverse only the connected region. Both approaches have the same time and space complexity. DFS is often simpler to implement recursively, while BFS uses a queue and avoids potential stack overflow for very large regions.

The algorithm works as follows:

1. Store the original color of the starting pixel
2. If the original color equals the new color, return immediately (nothing to change)
3. Use DFS/BFS to traverse all 4-directionally connected pixels with the original color
4. Change each visited pixel to the new color

<div class="code-group">

```python
# Time: O(m * n) - In worst case, we visit every cell once
# Space: O(m * n) - For the recursion stack in worst case (DFS) or queue (BFS)
def floodFill(image, sr, sc, color):
    """
    Perform flood fill starting from image[sr][sc].

    Args:
        image: 2D list of integers representing pixel values
        sr: starting row index
        sc: starting column index
        color: new color to fill with

    Returns:
        Modified image after flood fill
    """
    # Store the original color at starting position
    original_color = image[sr][sc]

    # If original color is already the new color, no changes needed
    if original_color == color:
        return image

    # Get dimensions of the image
    rows, cols = len(image), len(image[0])

    def dfs(r, c):
        """
        Depth-first search helper function to traverse connected region.

        Args:
            r: current row index
            c: current column index
        """
        # Base case: out of bounds or different color
        if r < 0 or r >= rows or c < 0 or c >= cols or image[r][c] != original_color:
            return

        # Change current pixel to new color
        image[r][c] = color

        # Recursively visit all 4-directional neighbors
        dfs(r + 1, c)  # Down
        dfs(r - 1, c)  # Up
        dfs(r, c + 1)  # Right
        dfs(r, c - 1)  # Left

    # Start DFS from the initial pixel
    dfs(sr, sc)

    return image
```

```javascript
// Time: O(m * n) - In worst case, we visit every cell once
// Space: O(m * n) - For the recursion stack in worst case (DFS) or queue (BFS)
function floodFill(image, sr, sc, color) {
  /**
   * Perform flood fill starting from image[sr][sc].
   *
   * @param {number[][]} image - 2D array of integers representing pixel values
   * @param {number} sr - starting row index
   * @param {number} sc - starting column index
   * @param {number} color - new color to fill with
   * @return {number[][]} Modified image after flood fill
   */

  // Store the original color at starting position
  const originalColor = image[sr][sc];

  // If original color is already the new color, no changes needed
  if (originalColor === color) {
    return image;
  }

  // Get dimensions of the image
  const rows = image.length;
  const cols = image[0].length;

  /**
   * Depth-first search helper function to traverse connected region.
   *
   * @param {number} r - current row index
   * @param {number} c - current column index
   */
  function dfs(r, c) {
    // Base case: out of bounds or different color
    if (r < 0 || r >= rows || c < 0 || c >= cols || image[r][c] !== originalColor) {
      return;
    }

    // Change current pixel to new color
    image[r][c] = color;

    // Recursively visit all 4-directional neighbors
    dfs(r + 1, c); // Down
    dfs(r - 1, c); // Up
    dfs(r, c + 1); // Right
    dfs(r, c - 1); // Left
  }

  // Start DFS from the initial pixel
  dfs(sr, sc);

  return image;
}
```

```java
// Time: O(m * n) - In worst case, we visit every cell once
// Space: O(m * n) - For the recursion stack in worst case (DFS) or queue (BFS)
class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        /**
         * Perform flood fill starting from image[sr][sc].
         *
         * @param image: 2D array of integers representing pixel values
         * @param sr: starting row index
         * @param sc: starting column index
         * @param color: new color to fill with
         * @return Modified image after flood fill
         */

        // Store the original color at starting position
        int originalColor = image[sr][sc];

        // If original color is already the new color, no changes needed
        if (originalColor == color) {
            return image;
        }

        // Start DFS from the initial pixel
        dfs(image, sr, sc, originalColor, color);

        return image;
    }

    private void dfs(int[][] image, int r, int c, int originalColor, int newColor) {
        /**
         * Depth-first search helper function to traverse connected region.
         *
         * @param image: the image matrix
         * @param r: current row index
         * @param c: current column index
         * @param originalColor: the color we're replacing
         * @param newColor: the color to fill with
         */

        // Base case: out of bounds or different color
        if (r < 0 || r >= image.length || c < 0 || c >= image[0].length
            || image[r][c] != originalColor) {
            return;
        }

        // Change current pixel to new color
        image[r][c] = newColor;

        // Recursively visit all 4-directional neighbors
        dfs(image, r + 1, c, originalColor, newColor);  // Down
        dfs(image, r - 1, c, originalColor, newColor);  // Up
        dfs(image, r, c + 1, originalColor, newColor);  // Right
        dfs(image, r, c - 1, originalColor, newColor);  // Left
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n) where m is the number of rows and n is the number of columns. In the worst case, we might need to visit every cell in the grid once (if the entire grid has the same color as the starting pixel).

**Space Complexity:** O(m × n) for the recursive call stack in DFS (or the queue in BFS). In the worst case, if the entire grid needs to be filled, we could have a recursive call for each cell. For BFS, the queue could contain up to min(m, n) elements at once in the worst case, but the visited set (if used) would still be O(m × n).

The space complexity comes from:

1. The recursion stack (DFS) or queue (BFS) which can grow up to O(m × n)
2. If we used a separate visited set, that would also be O(m × n), though in this implementation we avoid that by modifying the image in place

## Common Mistakes

1. **Forgetting the base case when original color equals new color**: If you don't check this, you'll create an infinite loop because you'll keep trying to fill already-filled pixels. Always check `if (originalColor == color) return image;` first.

2. **Not checking bounds before accessing array indices**: In the recursive calls, you must check `r >= 0 && r < rows && c >= 0 && c < cols` before accessing `image[r][c]`. Accessing out-of-bounds indices will cause runtime errors.

3. **Using 8-directional instead of 4-directional movement**: The problem specifies 4-directional connectivity (up, down, left, right), not 8-directional (which would include diagonals). Using 8-directional movement would connect pixels that shouldn't be connected.

4. **Not storing the original color in a variable**: If you use `image[sr][sc]` directly in your comparisons, it will fail because you're changing that value during the flood fill. Always store `originalColor = image[sr][sc]` before starting.

## When You'll See This Pattern

The flood fill pattern appears in many grid traversal problems where you need to find connected components:

1. **Number of Islands (LeetCode 200)**: Instead of changing colors, you count connected regions of '1's. The core DFS/BFS traversal is identical.

2. **Max Area of Island (LeetCode 695)**: Similar to flood fill, but you track the size of each connected region and return the maximum.

3. **Rotting Oranges (LeetCode 994)**: Uses BFS to simulate spread (like flood fill) from multiple starting points simultaneously.

4. **Walls and Gates (LeetCode 286)**: Multi-source BFS that's essentially flood fill from all gates at once.

The key insight is recognizing when a problem involves finding connected components in a grid. Any time you see "connected region," "island," or "cluster" in a matrix, think of flood fill/DFS/BFS.

## Key Takeaways

1. **Grid traversal with DFS/BFS is fundamental**: Flood fill teaches the core pattern of traversing connected regions in a grid, which is essential for many matrix problems.

2. **Always track visited nodes**: Whether through modifying the grid in-place or using a separate visited set, you must avoid revisiting nodes to prevent infinite loops.

3. **Check edge cases early**: The `originalColor == color` check is crucial. Also consider empty grids or invalid starting positions in real interviews.

4. **Understand space complexity trade-offs**: DFS is simpler but can cause stack overflow for large grids. BFS uses a queue but has similar time complexity. Iterative DFS with a stack is another option.

This problem is an excellent introduction to graph traversal algorithms applied to grids. Mastering it will help you solve dozens of similar problems.

Related problems: [Island Perimeter](/problem/island-perimeter)
