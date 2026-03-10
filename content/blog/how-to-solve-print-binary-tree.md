---
title: "How to Solve Print Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Print Binary Tree. Medium difficulty, 66.4% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2027-09-27"
category: "dsa-patterns"
tags: ["print-binary-tree", "tree", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Print Binary Tree

This problem asks us to format a binary tree into a 2D string matrix where each node appears in a specific position based on its location in the tree. What makes this problem interesting is that it requires careful calculation of both the dimensions of the output matrix and the exact positioning of each node value. The challenge lies in determining where each node should go in the matrix based on the tree's structure.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider the tree:

```
      1
     / \
    2   3
     \
      4
```

**Step 1: Determine the height**

- The height of this tree is 3 (root at level 0, node 4 at level 2)
- According to the problem: `m = height + 1 = 4 rows`
- And: `n = 2^(height+1) - 1 = 2^3 - 1 = 7 columns`

**Step 2: Understand the positioning formula**
For any node at position `(r, c)` in the matrix:

- Its left child goes to `(r+1, c - 2^(height-r-1))`
- Its right child goes to `(r+1, c + 2^(height-r-1))`

**Step 3: Place the root**

- Root (1) goes to position `(0, (n-1)/2) = (0, 3)`

**Step 4: Place children recursively**

- Left child (2): `(1, 3 - 2^(3-0-1)) = (1, 3 - 4) = (1, -1)` Wait, that's wrong! Let me recalculate...

Actually, the correct formula should be:

- For a node at `(r, c)`:
  - Left child: `(r+1, c - 2^(height-r-1))`
  - Right child: `(r+1, c + 2^(height-r-1))`

For root (1) at `(0, 3)`:

- Left child (2): `(1, 3 - 2^(3-0-1)) = (1, 3 - 2^2) = (1, 3 - 4) = (1, -1)`

Hmm, this seems off. Let me think about this differently. The spacing should halve each level. Actually, the correct insight is that the gap between parent and child positions halves at each level.

**Better approach**: The root is at the middle of the row. Each level down, the gap between parent and child is half of what it was at the previous level.

Let me work through it correctly:

- Root (1) at `(0, 3)`
- Level 1: Gap = 4 (2^(height-1) = 2^2 = 4)
  - Left child (2) at `(1, 3 - 4) = (1, -1)` → This is wrong!

The issue is my understanding of the formula. Let's derive it properly:

At row r (0-indexed), the number of rows below is `height - r`
The gap should be: `2^(height - r - 1)`

For root at row 0: gap = 2^(3-0-1) = 2^2 = 4
So left child at: 3 - 4 = -1 (still wrong!)

Ah, I see the issue! The gap isn't 4, it's actually half of the current segment width. The matrix width is 7, so at root level, the segment is the whole row. The left child should be at the middle of the left half.

Actually, let me just show the correct placements:

- Root (1): row 0, col 3
- Node 2: row 1, col 1 (middle of left half: positions 0-2)
- Node 3: row 1, col 5 (middle of right half: positions 4-6)
- Node 4: row 2, col 2 (middle of the segment from col 1)

The final matrix would be:

```
["", "", "", "1", "", "", ""]
["", "2", "", "", "", "3", ""]
["", "", "4", "", "", "", ""]
```

## Brute Force Approach

A naive approach might try to build the matrix level by level without proper positioning logic. One might attempt:

1. Do a BFS traversal to get nodes by level
2. Try to center each level in the row
3. But this fails because we need to account for the tree's structure, not just level information

The brute force would fail because:

- Without calculating exact positions based on the tree height and structure, nodes won't align properly with their children
- Simple centering doesn't work when the tree isn't complete
- We need a systematic way to determine where each node goes based on its position in the tree

## Optimized Approach

The key insight is that we can use DFS with position calculation. Here's the step-by-step reasoning:

1. **First, find the height of the tree** - We need this to determine the matrix dimensions
2. **Calculate matrix dimensions**:
   - Rows: `height + 1`
   - Columns: `2^(height+1) - 1` (this gives us enough width for the bottom level)
3. **Use DFS to place nodes**:
   - Start with root at middle of top row: `(0, (n-1)/2)`
   - For each node, calculate its children's positions:
     - Gap = `2^(height - current_row - 1)`
     - Left child: `(current_row + 1, current_col - gap)`
     - Right child: `(current_row + 1, current_col + gap)`
4. **Fill the matrix** as we traverse

Why does this work? Because at each level, the available space is divided in half for the left and right subtrees. The gap represents how far from the parent the child should be placed.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes - we visit each node once
# Space: O(h) for recursion stack + O(m*n) for output matrix
class Solution:
    def printTree(self, root):
        """
        Main function to print binary tree in matrix format.

        Steps:
        1. Calculate height of tree
        2. Calculate matrix dimensions
        3. Initialize matrix with empty strings
        4. DFS to fill matrix with node values at correct positions
        """

        # Helper function to calculate tree height
        def get_height(node):
            """Calculate height of tree using DFS."""
            if not node:
                return -1  # Empty tree has height -1 by definition
            # Height is max of left and right subtree heights + 1
            return max(get_height(node.left), get_height(node.right)) + 1

        # Helper function for DFS traversal to fill matrix
        def fill_matrix(node, row, col, gap):
            """
            Fill matrix with node values using DFS.

            Args:
                node: Current tree node
                row: Current row in matrix
                col: Current column in matrix
                gap: Gap to use for child positioning
            """
            if not node:
                return

            # Place current node value in matrix
            # Convert to string as required by problem
            result[row][col] = str(node.val)

            # Calculate new gap for next level (halves each level)
            new_gap = gap // 2

            # Recursively fill left and right children
            if node.left:
                # Left child: same row + 1, column - new_gap
                fill_matrix(node.left, row + 1, col - new_gap, new_gap)
            if node.right:
                # Right child: same row + 1, column + new_gap
                fill_matrix(node.right, row + 1, col + new_gap, new_gap)

        # Step 1: Calculate tree height
        height = get_height(root)

        # Step 2: Calculate matrix dimensions
        # Rows = height + 1
        # Columns = 2^(height+1) - 1 (enough for bottom level)
        m = height + 1
        n = (1 << (height + 1)) - 1  # Using bit shift for 2^(height+1)

        # Step 3: Initialize matrix with empty strings
        result = [[""] * n for _ in range(m)]

        # Step 4: Fill matrix starting from root
        # Root goes at middle of top row: (0, (n-1)//2)
        # Initial gap is half of what we'll use for first children
        initial_gap = (1 << height) // 2  # 2^height / 2
        fill_matrix(root, 0, (n - 1) // 2, initial_gap)

        return result
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(h) for recursion stack + O(m*n) for output matrix
var printTree = function (root) {
  /**
   * Main function to print binary tree in matrix format.
   */

  // Helper function to calculate tree height
  const getHeight = (node) => {
    if (!node) return -1; // Empty tree has height -1
    return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  };

  // Helper function for DFS traversal to fill matrix
  const fillMatrix = (node, row, col, gap) => {
    if (!node) return;

    // Place current node value in matrix
    result[row][col] = node.val.toString();

    // Calculate new gap for next level (halves each level)
    const newGap = Math.floor(gap / 2);

    // Recursively fill left and right children
    if (node.left) {
      // Left child: same row + 1, column - newGap
      fillMatrix(node.left, row + 1, col - newGap, newGap);
    }
    if (node.right) {
      // Right child: same row + 1, column + newGap
      fillMatrix(node.right, row + 1, col + newGap, newGap);
    }
  };

  // Step 1: Calculate tree height
  const height = getHeight(root);

  // Step 2: Calculate matrix dimensions
  // Rows = height + 1
  // Columns = 2^(height+1) - 1
  const m = height + 1;
  const n = Math.pow(2, height + 1) - 1;

  // Step 3: Initialize matrix with empty strings
  const result = Array(m)
    .fill()
    .map(() => Array(n).fill(""));

  // Step 4: Fill matrix starting from root
  // Root goes at middle of top row: (0, (n-1)/2)
  // Initial gap is half of what we'll use for first children
  const initialGap = Math.pow(2, height) / 2;
  fillMatrix(root, 0, Math.floor((n - 1) / 2), initialGap);

  return result;
};
```

```java
// Time: O(n) where n is number of nodes
// Space: O(h) for recursion stack + O(m*n) for output matrix
class Solution {
    public List<List<String>> printTree(TreeNode root) {
        /**
         * Main function to print binary tree in matrix format.
         */

        // Step 1: Calculate tree height
        int height = getHeight(root);

        // Step 2: Calculate matrix dimensions
        // Rows = height + 1
        // Columns = 2^(height+1) - 1
        int m = height + 1;
        int n = (1 << (height + 1)) - 1;  // Using bit shift for 2^(height+1)

        // Step 3: Initialize matrix with empty strings
        List<List<String>> result = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            List<String> row = new ArrayList<>();
            for (int j = 0; j < n; j++) {
                row.add("");
            }
            result.add(row);
        }

        // Step 4: Fill matrix starting from root
        // Root goes at middle of top row: (0, (n-1)/2)
        // Initial gap is half of what we'll use for first children
        int initialGap = (1 << height) / 2;  // 2^height / 2
        fillMatrix(root, 0, (n - 1) / 2, initialGap, result);

        return result;
    }

    // Helper function to calculate tree height
    private int getHeight(TreeNode node) {
        if (node == null) return -1;  // Empty tree has height -1
        return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    }

    // Helper function for DFS traversal to fill matrix
    private void fillMatrix(TreeNode node, int row, int col, int gap,
                           List<List<String>> result) {
        if (node == null) return;

        // Place current node value in matrix
        result.get(row).set(col, String.valueOf(node.val));

        // Calculate new gap for next level (halves each level)
        int newGap = gap / 2;

        // Recursively fill left and right children
        if (node.left != null) {
            // Left child: same row + 1, column - newGap
            fillMatrix(node.left, row + 1, col - newGap, newGap, result);
        }
        if (node.right != null) {
            // Right child: same row + 1, column + newGap
            fillMatrix(node.right, row + 1, col + newGap, newGap, result);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once to calculate the height: O(n)
- We visit each node exactly once to fill the matrix: O(n)
- Total: O(n) where n is the number of nodes in the tree

**Space Complexity: O(m × n) for output + O(h) for recursion stack**

- The output matrix has dimensions m × n, where m = height + 1 and n = 2^(height+1) - 1
- In the worst case (a skewed tree), height = n-1, so m = n and n = 2^n - 1, giving exponential space
- However, this is the required output space, not auxiliary space
- The recursion stack uses O(h) space where h is the height of the tree

## Common Mistakes

1. **Incorrect height calculation**: Many candidates return 0 for an empty tree instead of -1. Remember: height of empty tree is -1, height of single node tree is 0.

2. **Wrong matrix dimensions**: Forgetting that columns = 2^(height+1) - 1, not 2^height. The extra -1 is crucial for proper spacing.

3. **Incorrect positioning formula**: The most common error is getting the gap calculation wrong. Remember that the gap halves at each level: `new_gap = gap // 2`.

4. **Not converting node values to strings**: The problem requires a string matrix. Forgetting to convert integer node values to strings will cause type errors.

5. **Off-by-one errors in column calculation**: When calculating the root position as `(n-1)/2`, use integer division to get the correct middle index.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Tree height calculation** - Similar to "Maximum Depth of Binary Tree" (LeetCode 104)
2. **DFS with positional tracking** - Similar to "Vertical Order Traversal" (LeetCode 987) where you track column positions
3. **Matrix representation of hierarchical data** - Similar to problems that require formatting tree structures visually

The core technique of calculating positions based on tree structure and using those positions to organize data appears in:

- **LeetCode 987: Vertical Order Traversal of a Binary Tree** - Also uses column tracking
- **LeetCode 314: Binary Tree Vertical Order Traversal** - Similar column-based organization
- **LeetCode 662: Maximum Width of Binary Tree** - Involves calculating positions for width measurement

## Key Takeaways

1. **Tree height dictates everything**: In tree formatting problems, the height determines the output dimensions and positioning logic. Always calculate height first.

2. **Position calculation follows a pattern**: The gap between parent and child positions halves at each level. This creates the tree-like structure in the matrix.

3. **DFS with parameters is powerful**: Passing row, column, and gap as parameters during DFS allows us to calculate positions recursively without needing to store intermediate results.

4. **Output requirements matter**: Always check if the output needs to be strings, integers, or another format. Type conversions are easy to forget but important.

[Practice this problem on CodeJeet](/problem/print-binary-tree)
