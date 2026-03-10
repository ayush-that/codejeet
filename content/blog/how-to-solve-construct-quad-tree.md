---
title: "How to Solve Construct Quad Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Construct Quad Tree. Medium difficulty, 78.1% acceptance rate. Topics: Array, Divide and Conquer, Tree, Matrix."
date: "2028-10-27"
category: "dsa-patterns"
tags: ["construct-quad-tree", "array", "divide-and-conquer", "tree", "medium"]
---

# How to Solve Construct Quad Tree

This problem asks us to convert a binary matrix into its corresponding quad tree representation. What makes this problem interesting is that it's a practical application of spatial data structures used in computer graphics and geographic information systems. The tricky part is understanding how to recursively partition the matrix while maintaining the quad tree's properties: each node is either a leaf (all same values) or has four children representing the four quadrants.

## Visual Walkthrough

Let's walk through a simple 2×2 example:

```
grid = [[1, 0],
        [1, 1]]
```

**Step 1:** Check if the entire 2×2 matrix has uniform values.

- Top-left: 1
- Top-right: 0
- Bottom-left: 1
- Bottom-right: 1
- Not uniform (contains both 0 and 1), so we need to split.

**Step 2:** Split into four 1×1 quadrants:

- Top-left quadrant: [[1]] → all 1's → leaf node with val=1
- Top-right quadrant: [[0]] → all 0's → leaf node with val=0
- Bottom-left quadrant: [[1]] → all 1's → leaf node with val=1
- Bottom-right quadrant: [[1]] → all 1's → leaf node with val=1

**Step 3:** Create parent node:

- Since we split, this node is not a leaf (isLeaf=false)
- val can be true or false (we'll use true as placeholder)
- Four children are the leaf nodes we created

The resulting tree has a root with four leaf children, where three children have val=1 and one has val=0.

## Brute Force Approach

A naive approach might try to build the tree from the bottom up without proper recursion, but that quickly becomes messy. The brute force equivalent would be to check every possible partition of the matrix, which is exponential in complexity.

Actually, for this problem, the divide-and-conquer approach is the natural solution, but a "brute force" way to think about it would be:

1. Create a node for the entire matrix
2. Check if all values are the same by scanning the entire matrix (O(n²))
3. If not uniform, manually create four new matrices by copying data (expensive O(n²) memory)
4. Repeat for each quadrant

The problem with this approach is the excessive memory usage from creating new matrix copies at each recursive call. For an n×n matrix, we'd create O(n²) total memory across all recursive calls.

## Optimized Approach

The key insight is that we don't need to create new matrix copies at each recursive step. Instead, we can:

1. Pass the original grid and the boundaries (top, left, bottom, right) to each recursive call
2. Check if the current sub-grid is uniform by comparing all values within the boundaries
3. If uniform, create a leaf node
4. If not uniform, split the boundaries into four quadrants and recursively process each

This approach uses divide-and-conquer:

- **Divide**: Split the current grid region into four equal quadrants
- **Conquer**: Recursively build quad trees for each quadrant
- **Combine**: Create a parent node with the four children as its quadrants

The boundaries approach avoids copying data, making it both time and space efficient.

## Optimal Solution

Here's the complete solution using divide-and-conquer with boundary indices:

<div class="code-group">

```python
"""
# Definition for a QuadTree node.
class Node:
    def __init__(self, val, isLeaf, topLeft, topRight, bottomLeft, bottomRight):
        self.val = val
        self.isLeaf = isLeaf
        self.topLeft = topLeft
        self.topRight = topRight
        self.bottomLeft = bottomLeft
        self.bottomRight = bottomRight
"""

class Solution:
    def construct(self, grid):
        """
        Time: O(n^2) - We might check each cell in worst case
        Space: O(log n) for recursion stack, plus O(n^2) for output tree
        """
        def build(top, left, bottom, right):
            """
            Build quad tree for sub-grid defined by boundaries.
            top, left: inclusive starting indices
            bottom, right: exclusive ending indices
            """
            # Base case: check if all values in current region are the same
            first_val = grid[top][left]
            uniform = True

            # Check all cells in current region
            for i in range(top, bottom):
                for j in range(left, right):
                    if grid[i][j] != first_val:
                        uniform = False
                        break
                if not uniform:
                    break

            # If uniform, create leaf node
            if uniform:
                return Node(first_val == 1, True, None, None, None, None)

            # Not uniform: split into 4 quadrants and recurse
            mid_row = (top + bottom) // 2
            mid_col = (left + right) // 2

            # Recursively build four children
            top_left = build(top, left, mid_row, mid_col)
            top_right = build(top, mid_col, mid_row, right)
            bottom_left = build(mid_row, left, bottom, mid_col)
            bottom_right = build(mid_row, mid_col, bottom, right)

            # Create internal node (val can be True or False for internal nodes)
            return Node(True, False, top_left, top_right, bottom_left, bottom_right)

        n = len(grid)
        return build(0, 0, n, n)
```

```javascript
/**
 * // Definition for a QuadTree node.
 * function Node(val,isLeaf,topLeft,topRight,bottomLeft,bottomRight) {
 *    this.val = val;
 *    this.isLeaf = isLeaf;
 *    this.topLeft = topLeft;
 *    this.topRight = topRight;
 *    this.bottomLeft = bottomLeft;
 *    this.bottomRight = bottomRight;
 * };
 */

/**
 * @param {number[][]} grid
 * @return {Node}
 */
var construct = function (grid) {
  /**
   * Time: O(n^2) - In worst case we check each cell
   * Space: O(log n) recursion stack + O(n^2) for output tree
   */

  function build(top, left, bottom, right) {
    // Check if current region has uniform values
    const firstVal = grid[top][left];
    let uniform = true;

    // Scan entire region
    for (let i = top; i < bottom; i++) {
      for (let j = left; j < right; j++) {
        if (grid[i][j] !== firstVal) {
          uniform = false;
          break;
        }
      }
      if (!uniform) break;
    }

    // If uniform, create leaf node
    if (uniform) {
      return new Node(firstVal === 1, true, null, null, null, null);
    }

    // Calculate midpoints for splitting
    const midRow = Math.floor((top + bottom) / 2);
    const midCol = Math.floor((left + right) / 2);

    // Recursively build four quadrants
    const topLeft = build(top, left, midRow, midCol);
    const topRight = build(top, midCol, midRow, right);
    const bottomLeft = build(midRow, left, bottom, midCol);
    const bottomRight = build(midRow, midCol, bottom, right);

    // Internal node: isLeaf=false, val can be arbitrary (using true)
    return new Node(true, false, topLeft, topRight, bottomLeft, bottomRight);
  }

  const n = grid.length;
  return build(0, 0, n, n);
};
```

```java
/*
// Definition for a QuadTree node.
class Node {
    public boolean val;
    public boolean isLeaf;
    public Node topLeft;
    public Node topRight;
    public Node bottomLeft;
    public Node bottomRight;

    public Node() {
        this.val = false;
        this.isLeaf = false;
        this.topLeft = null;
        this.topRight = null;
        this.bottomLeft = null;
        this.bottomRight = null;
    }

    public Node(boolean val, boolean isLeaf) {
        this.val = val;
        this.isLeaf = isLeaf;
        this.topLeft = null;
        this.topRight = null;
        this.bottomLeft = null;
        this.bottomRight = null;
    }

    public Node(boolean val, boolean isLeaf, Node topLeft, Node topRight, Node bottomLeft, Node bottomRight) {
        this.val = val;
        this.isLeaf = isLeaf;
        this.topLeft = topLeft;
        this.topRight = topRight;
        this.bottomLeft = bottomLeft;
        this.bottomRight = bottomRight;
    }
};
*/

class Solution {
    public Node construct(int[][] grid) {
        /**
         * Time: O(n^2) - May check each cell in worst case
         * Space: O(log n) recursion stack + O(n^2) for output tree
         */
        return build(grid, 0, 0, grid.length);
    }

    private Node build(int[][] grid, int top, int left, int size) {
        // Check if current region has uniform values
        int firstVal = grid[top][left];
        boolean uniform = true;

        // Scan the entire current region
        for (int i = top; i < top + size; i++) {
            for (int j = left; j < left + size; j++) {
                if (grid[i][j] != firstVal) {
                    uniform = false;
                    break;
                }
            }
            if (!uniform) break;
        }

        // If uniform, create leaf node
        if (uniform) {
            return new Node(firstVal == 1, true);
        }

        // Split into four quadrants (each half the size)
        int newSize = size / 2;

        // Recursively build four children
        Node topLeft = build(grid, top, left, newSize);
        Node topRight = build(grid, top, left + newSize, newSize);
        Node bottomLeft = build(grid, top + newSize, left, newSize);
        Node bottomRight = build(grid, top + newSize, left + newSize, newSize);

        // Create internal node (val can be true or false for internal nodes)
        return new Node(true, false, topLeft, topRight, bottomLeft, bottomRight);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- In the worst case (checkerboard pattern), we check every cell at each level
- At level 0: check n² cells
- At level 1: check 4 × (n/2)² = n² cells
- At level 2: check 16 × (n/4)² = n² cells
- Total: O(n²) since we have log n levels, each doing O(n²) work in worst case

**Space Complexity: O(n²) for the output tree + O(log n) for recursion stack**

- The quad tree itself has O(n²) nodes in worst case (when no compression occurs)
- Recursion depth is O(log n) since we halve the size at each level
- We don't create new matrices, just pass indices, so no extra O(n²) memory

## Common Mistakes

1. **Creating new matrix copies**: Some candidates create new sub-matrices at each recursive call, wasting O(n²) memory. Always use boundary indices instead.

2. **Incorrect boundary calculations**: Getting the midpoints wrong or using inclusive/exclusive indices inconsistently. Remember: if using exclusive right/bottom bounds, midpoint should split the range evenly.

3. **Forgetting to handle the 1×1 base case**: A 1×1 region is always uniform, but some implementations might try to split it further. Always check if size == 1 or handle it in the uniformity check.

4. **Wrong node initialization for internal nodes**: Internal nodes should have `isLeaf=false`, and their `val` can be arbitrary (often set to `true`). The problem statement allows any value for internal nodes.

## When You'll See This Pattern

This divide-and-conquer pattern appears in many spatial and matrix problems:

1. **427. Construct Quad Tree** (this problem) - Direct application
2. **215. Kth Largest Element in an Array** - Uses divide-and-conquer with partitioning (quickselect)
3. **912. Sort an Array** (Merge Sort) - Classic divide-and-conquer
4. **108. Convert Sorted Array to Binary Search Tree** - Divide array to build balanced tree
5. **240. Search a 2D Matrix II** - Can use divide-and-conquer in some solutions

The pattern is recognizable when you need to process a large data structure by recursively breaking it into smaller, similar subproblems and combining results.

## Key Takeaways

1. **Divide-and-conquer with boundaries**: When working with matrices or arrays, pass indices instead of creating copies to save memory and time.

2. **Spatial data structures**: Quad trees are useful for spatial partitioning problems like image compression, collision detection, and geographic data.

3. **Recursive base cases**: Always identify the simplest case (here, a uniform region or 1×1 cell) that doesn't need further division.

4. **Tree construction patterns**: Many tree construction problems follow similar recursive patterns - identify the root, recursively build subtrees, then combine.

[Practice this problem on CodeJeet](/problem/construct-quad-tree)
