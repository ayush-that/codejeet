---
title: "Depth-First Search Questions at Adobe: What to Expect"
description: "Prepare for Depth-First Search interview questions at Adobe — patterns, difficulty breakdown, and study tips."
date: "2027-08-22"
category: "dsa-patterns"
tags: ["adobe", "depth-first-search", "interview prep"]
---

If you're preparing for Adobe interviews, you'll likely face a Depth-First Search (DFS) question. With 20 DFS problems in their tagged list, it's a significant but not overwhelming portion of their technical repertoire. In practice, you can expect a DFS question in roughly 1 out of every 4-5 interviews, often appearing in the second technical round. It's not a core obsession like dynamic programming might be for some companies, but it's a fundamental tool they expect you to wield with precision. Adobe uses DFS to assess your ability to handle hierarchical data (like file systems or UI component trees—highly relevant to their Creative Cloud and Document Cloud products) and to solve pathfinding or state exploration problems without needing the shortest-path guarantee of BFS. They're testing for clean recursive thinking and systematic traversal.

## Specific Patterns Adobe Favors

Adobe's DFS questions tend to cluster around two main themes: **Tree Manipulation** and **Grid/Matrix Exploration with a Twist**. They rarely ask pure, simple graph traversal on abstract node-and-edge structures.

1.  **Tree Path & Property Validation:** This is their bread and butter. Think problems where you need to track state (like a sum, a path, or a condition) from the root to a leaf, or validate properties across subtrees. Recursive DFS is the natural fit.
    - **LeetCode 112. Path Sum:** Classic "root-to-leaf sum equals target."
    - **LeetCode 124. Binary Tree Maximum Path Sum:** A harder variant requiring you to compute the best path that may not pass through the root. This tests your ability to use a recursive function that returns one value (the single-branch contribution) while updating a global result with a different value (the full path sum).

2.  **Matrix DFS with Constraints (Island Variants):** They favor the "Number of Islands" (LeetCode 200) pattern, but often add a constraint that changes the game from simple counting to requiring stateful exploration.
    - **LeetCode 694. Number of Distinct Islands:** This is a quintessential Adobe-style twist. You must not only flood-fill but also _encode the shape_ of each island's DFS traversal path to identify duplicates. This tests if you understand that DFS order itself can be a fingerprint.

They strongly prefer **recursive implementations** for their clarity in expressing the problem's logic. While you should know how to implement DFS iteratively with a stack, a clean recursive solution is often what the interviewer is looking to evaluate.

## How to Prepare

The key is to master the recursive function signature and the thought process for the two main patterns. Let's look at the **Tree Maximum Path Sum** pattern, as it's a common advanced question.

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        # Use a mutable container (or nonlocal in a nested function) for the global result.
        self.max_sum = float('-inf')

        def dfs(node):
            """Returns the maximum *single-branch* sum starting from `node`.
               A "single-branch" sum is the path going down either left or right child.
               Updates `self.max_sum` with the best *full path* sum found anywhere.
            """
            if not node:
                return 0

            # Get the gain from the left and right subtrees. If negative, we take 0 (ignore that branch).
            left_gain = max(dfs(node.left), 0)
            right_gain = max(dfs(node.right), 0)

            # The full path sum if we use this node as the "root" of the path.
            price_newpath = node.val + left_gain + right_gain

            # Update the global maximum.
            self.max_sum = max(self.max_sum, price_newpath)

            # For the recursion return: the best single-branch sum starting from this node.
            return node.val + max(left_gain, right_gain)

        dfs(root)
        return self.max_sum

# Time Complexity: O(N), where N is the number of nodes. We visit each node once.
# Space Complexity: O(H), where H is the tree height, for the recursion call stack. O(N) in the worst case (skewed tree).
```

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxPathSum = function (root) {
  let maxSum = -Infinity;

  const dfs = (node) => {
    if (!node) return 0;

    // Compute the max single-branch sum from children.
    const leftGain = Math.max(dfs(node.left), 0);
    const rightGain = Math.max(dfs(node.right), 0);

    // The full path sum with this node as the "center".
    const pathSum = node.val + leftGain + rightGain;

    // Update the global maximum.
    maxSum = Math.max(maxSum, pathSum);

    // Return the best single-branch continuation.
    return node.val + Math.max(leftGain, rightGain);
  };

  dfs(root);
  return maxSum;
};

// Time Complexity: O(N)
// Space Complexity: O(H)
```

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    private int maxSum;

    public int maxPathSum(TreeNode root) {
        maxSum = Integer.MIN_VALUE;
        pathGain(root);
        return maxSum;
    }

    private int pathGain(TreeNode node) {
        if (node == null) return 0;

        // If child contributions are negative, they are ignored (treated as 0).
        int leftGain = Math.max(pathGain(node.left), 0);
        int rightGain = Math.max(pathGain(node.right), 0);

        // The full path sum using this node as the "root" of the path.
        int newPathSum = node.val + leftGain + rightGain;

        // Update the global maximum.
        maxSum = Math.max(maxSum, newPathSum);

        // Return the maximum single-branch contribution.
        return node.val + Math.max(leftGain, rightGain);
    }
}

// Time Complexity: O(N)
// Space Complexity: O(H)
```

</div>

For **Distinct Islands**, the pattern involves hashing the relative path of your DFS.

<div class="code-group">

```python
class Solution:
    def numDistinctIslands(self, grid: List[List[int]]) -> int:
        if not grid:
            return 0

        rows, cols = len(grid), len(grid[0])
        seen = set()
        distinct_islands = set()

        def dfs(r, c, r0, c0, shape):
            """r0, c0 are the origin coordinates of this island."""
            if 0 <= r < rows and 0 <= c < cols and grid[r][c] == 1 and (r, c) not in seen:
                seen.add((r, c))
                # Record the *relative* position from the origin.
                shape.add((r - r0, c - c0))
                # Standard DFS in 4 directions.
                dfs(r+1, c, r0, c0, shape)
                dfs(r-1, c, r0, c0, shape)
                dfs(r, c+1, r0, c0, shape)
                dfs(r, c-1, r0, c0, shape)

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1 and (r, c) not in seen:
                    shape = set()
                    dfs(r, c, r, c, shape)
                    # Use a frozen set or a sorted tuple as a hashable key for the shape.
                    distinct_islands.add(tuple(sorted(shape)))

        return len(distinct_islands)

# Time Complexity: O(R * C), we visit each cell at most once.
# Space Complexity: O(R * C) for the `seen` set and the recursion stack in worst case.
```

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var numDistinctIslands = function (grid) {
  if (!grid.length) return 0;

  const rows = grid.length,
    cols = grid[0].length;
  const seen = new Set();
  const distinctIslands = new Set();

  const dfs = (r, c, r0, c0, shape) => {
    const key = `${r},${c}`;
    if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === 1 && !seen.has(key)) {
      seen.add(key);
      shape.add(`${r - r0},${c - c0}`);
      dfs(r + 1, c, r0, c0, shape);
      dfs(r - 1, c, r0, c0, shape);
      dfs(r, c + 1, r0, c0, shape);
      dfs(r, c - 1, r0, c0, shape);
    }
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1 && !seen.has(`${r},${c}`)) {
        const shape = new Set();
        dfs(r, c, r, c, shape);
        // Convert Set to a sorted string for hashing.
        const shapeKey = [...shape].sort().join("|");
        distinctIslands.add(shapeKey);
      }
    }
  }
  return distinctIslands.size;
};

// Time Complexity: O(R * C * log(R*C)) due to sorting the shape keys. Can be O(R*C) with more advanced hashing.
// Space Complexity: O(R * C)
```

```java
class Solution {
    private int[][] grid;
    private boolean[][] seen;
    private Set<Set<String>> distinctIslands;

    public int numDistinctIslands(int[][] grid) {
        this.grid = grid;
        int rows = grid.length, cols = grid[0].length;
        seen = new boolean[rows][cols];
        distinctIslands = new HashSet<>();

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 1 && !seen[r][c]) {
                    Set<String> shape = new HashSet<>();
                    dfs(r, c, r, c, shape);
                    distinctIslands.add(shape);
                }
            }
        }
        return distinctIslands.size();
    }

    private void dfs(int r, int c, int r0, int c0, Set<String> shape) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == 0 || seen[r][c]) {
            return;
        }
        seen[r][c] = true;
        shape.add((r - r0) + "," + (c - c0));
        dfs(r+1, c, r0, c0, shape);
        dfs(r-1, c, r0, c0, shape);
        dfs(r, c+1, r0, c0, shape);
        dfs(r, c-1, r0, c0, shape);
    }
}

// Time Complexity: O(R * C)
// Space Complexity: O(R * C)
```

</div>

## How Adobe Tests Depth-First Search vs Other Companies

Adobe's DFS questions are typically **medium difficulty** with a clear, practical hook—like manipulating a document object model or analyzing an image region. They contrast with companies like **Google**, which might embed DFS within a much more complex graph theory or combinatorics problem (e.g., finding Hamiltonian paths), or **Meta**, which often ties DFS directly to cloning complex linked structures or social network traversal. At Adobe, the focus is less on algorithmic cleverness for its own sake and more on applying a fundamental traversal technique correctly and efficiently to a problem that feels relevant to their domain. You're less likely to get a "gotcha" and more likely to be evaluated on the cleanliness of your recursion and your handling of edge cases.

## Study Order

1.  **Basic Tree Traversal:** Master pre-order, in-order, and post-order DFS on binary trees. Understand the recursion stack.
2.  **Simple Tree Path Problems:** Solve problems like Path Sum (LeetCode 112) and Diameter of Binary Tree (LeetCode 543). These teach you to pass information up the recursion tree.
3.  **Matrix/Grid DFS:** Learn the "Number of Islands" (LeetCode 200) flood-fill pattern by heart. This is the foundation for all 2D DFS.
4.  **Stateful Tree DFS:** Tackle problems where the recursive function returns one thing but you need to compute another (like Max Path Sum - LeetCode 124). This is a common Adobe pattern.
5.  **DFS with Encoding/Shape Detection:** Practice problems like Distinct Islands (LeetCode 694). This is where you move from simple traversal to using the traversal path itself as data.
6.  **(Optional) Iterative DFS:** Know how to implement the above using an explicit stack, but prioritize recursive fluency.

## Recommended Practice Order

Solve these problems in sequence to build the skills Adobe looks for:

1.  **LeetCode 104. Maximum Depth of Binary Tree** (Basic recursion)
2.  **LeetCode 112. Path Sum** (Root-to-leaf path with state)
3.  **LeetCode 543. Diameter of Binary Tree** (Similar pattern to Max Path Sum, but simpler)
4.  **LeetCode 200. Number of Islands** (Absolute must-know grid DFS)
5.  **LeetCode 124. Binary Tree Maximum Path Sum** (Core Adobe-style problem)
6.  **LeetCode 694. Number of Distinct Islands** (Grid DFS with a twist)
7.  **LeetCode 437. Path Sum III** (A harder tree path problem that introduces the prefix sum concept with DFS)

This progression takes you from the absolute fundamentals to the nuanced patterns that frequently appear in Adobe's interview loop.

[Practice Depth-First Search at Adobe](/company/adobe/depth-first-search)
