---
title: "How to Solve Binary Tree Tilt — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Binary Tree Tilt. Easy difficulty, 65.4% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2028-04-02"
category: "dsa-patterns"
tags: ["binary-tree-tilt", "tree", "depth-first-search", "binary-tree", "easy"]
---

# How to Solve Binary Tree Tilt

This problem asks us to calculate the total "tilt" of a binary tree, where each node's tilt is the absolute difference between the sum of its left subtree and the sum of its right subtree. The tricky part is that we need to compute subtree sums efficiently while simultaneously calculating tilt values. A naive approach that repeatedly calculates subtree sums would be inefficient, so we need a smarter traversal strategy.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this binary tree:

```
       4
     /   \
    2     9
   / \     \
  3   5     7
```

**Step-by-step calculation:**

1. **Node 3 (leaf)**: Left sum = 0, Right sum = 0 → Tilt = |0 - 0| = 0  
   Total sum at node 3 = 3 + 0 + 0 = 3

2. **Node 5 (leaf)**: Left sum = 0, Right sum = 0 → Tilt = |0 - 0| = 0  
   Total sum at node 5 = 5 + 0 + 0 = 5

3. **Node 2**: Left sum = 3, Right sum = 5 → Tilt = |3 - 5| = 2  
   Total sum at node 2 = 2 + 3 + 5 = 10

4. **Node 7 (leaf)**: Left sum = 0, Right sum = 0 → Tilt = |0 - 0| = 0  
   Total sum at node 7 = 7 + 0 + 0 = 7

5. **Node 9**: Left sum = 0, Right sum = 7 → Tilt = |0 - 7| = 7  
   Total sum at node 9 = 9 + 0 + 7 = 16

6. **Node 4**: Left sum = 10, Right sum = 16 → Tilt = |10 - 16| = 6  
   Total sum at node 4 = 4 + 10 + 16 = 30

**Total Tilt** = 0 + 0 + 2 + 0 + 7 + 6 = 15

The key insight: We need to compute subtree sums in a bottom-up manner (post-order traversal) so we can calculate each node's tilt using the sums of its already-computed children.

## Brute Force Approach

A naive approach would be to write a helper function that calculates the sum of a subtree, then for each node:

1. Calculate left subtree sum
2. Calculate right subtree sum
3. Compute tilt as absolute difference
4. Add to running total

This approach has a major efficiency problem: it repeatedly recalculates the same subtree sums. For example, when calculating the sum for node 2's left subtree (node 3), we'd calculate it once for node 2's tilt, then potentially recalculate it again when computing node 4's left subtree sum.

**Time Complexity**: O(n²) in the worst case (skewed tree) because for each of n nodes, we might traverse O(n) nodes to calculate subtree sums.

**Space Complexity**: O(h) for the recursion stack, where h is the tree height.

This quadratic time complexity makes the brute force approach impractical for larger trees, so we need a more efficient solution.

## Optimal Solution

The optimal approach uses a single post-order traversal (left → right → root). As we traverse, each node returns the sum of its subtree (its value + left sum + right sum), and we calculate its tilt using the returned sums from its children. This way, each node is visited exactly once.

<div class="code-group">

```python
# Time: O(n) - We visit each node exactly once
# Space: O(h) - Recursion stack height, where h is tree height (O(n) worst case for skewed tree)
class Solution:
    def findTilt(self, root: Optional[TreeNode]) -> int:
        # Global variable to accumulate total tilt
        total_tilt = 0

        def dfs(node):
            nonlocal total_tilt

            # Base case: empty node contributes 0 to sum
            if not node:
                return 0

            # Step 1: Recursively get sum of left subtree
            left_sum = dfs(node.left)

            # Step 2: Recursively get sum of right subtree
            right_sum = dfs(node.right)

            # Step 3: Calculate current node's tilt and add to total
            tilt = abs(left_sum - right_sum)
            total_tilt += tilt

            # Step 4: Return total sum of current subtree
            # (node value + left sum + right sum)
            return node.val + left_sum + right_sum

        # Start DFS from root
        dfs(root)

        return total_tilt
```

```javascript
// Time: O(n) - We visit each node exactly once
// Space: O(h) - Recursion stack height, where h is tree height (O(n) worst case for skewed tree)
var findTilt = function (root) {
  // Variable to accumulate total tilt
  let totalTilt = 0;

  // Helper function for DFS traversal
  const dfs = (node) => {
    // Base case: empty node contributes 0 to sum
    if (!node) {
      return 0;
    }

    // Step 1: Recursively get sum of left subtree
    const leftSum = dfs(node.left);

    // Step 2: Recursively get sum of right subtree
    const rightSum = dfs(node.right);

    // Step 3: Calculate current node's tilt and add to total
    const tilt = Math.abs(leftSum - rightSum);
    totalTilt += tilt;

    // Step 4: Return total sum of current subtree
    // (node value + left sum + right sum)
    return node.val + leftSum + rightSum;
  };

  // Start DFS from root
  dfs(root);

  return totalTilt;
};
```

```java
// Time: O(n) - We visit each node exactly once
// Space: O(h) - Recursion stack height, where h is tree height (O(n) worst case for skewed tree)
class Solution {
    // Class-level variable to accumulate total tilt
    private int totalTilt = 0;

    public int findTilt(TreeNode root) {
        // Start DFS from root
        dfs(root);
        return totalTilt;
    }

    private int dfs(TreeNode node) {
        // Base case: empty node contributes 0 to sum
        if (node == null) {
            return 0;
        }

        // Step 1: Recursively get sum of left subtree
        int leftSum = dfs(node.left);

        // Step 2: Recursively get sum of right subtree
        int rightSum = dfs(node.right);

        // Step 3: Calculate current node's tilt and add to total
        int tilt = Math.abs(leftSum - rightSum);
        totalTilt += tilt;

        // Step 4: Return total sum of current subtree
        // (node value + left sum + right sum)
        return node.val + leftSum + rightSum;
    }
}
```

</div>

**Key points about the solution:**

1. **Post-order traversal**: We process children before parent (left → right → root) because we need child sums to calculate parent tilt.
2. **Single traversal**: Each node is visited exactly once, making it O(n) time.
3. **Two responsibilities**: Each recursive call returns the subtree sum AND updates the global tilt total.
4. **Base case**: Null nodes return 0, which correctly handles missing children.

## Complexity Analysis

**Time Complexity**: O(n) where n is the number of nodes in the tree. We perform a single DFS traversal, visiting each node exactly once. Each node's processing involves O(1) operations (calculating tilt and sum).

**Space Complexity**: O(h) where h is the height of the tree. This is the maximum depth of the recursion stack. In the worst case (skewed tree), h = n, giving O(n) space. In a balanced tree, h = log n.

## Common Mistakes

1. **Forgetting to handle null/empty tree**: Always check if root is null at the beginning. In our solution, the DFS function handles null nodes, but you should still consider edge cases in the main function.

2. **Using pre-order instead of post-order traversal**: If you try to calculate tilt before computing child sums, you'll get incorrect results. Remember: children first, then parent.

3. **Not using a global/accumulator variable**: Some candidates try to return both tilt and sum from the recursive function, which complicates the logic. Using a class-level or closure variable for total tilt is cleaner.

4. **Incorrect tilt calculation for leaves**: For leaf nodes, both left and right sums should be 0, giving tilt = 0. Make sure your base case returns 0 for null nodes.

5. **Integer overflow**: While not a concern for typical LeetCode constraints, in interviews you might discuss that using long integers could be necessary for very large trees with large values.

## When You'll See This Pattern

This "compute-and-return" pattern in tree traversals appears in many tree problems:

1. **Diameter of Binary Tree (LeetCode 543)**: Similar pattern where you compute height at each node while tracking the maximum diameter.

2. **Binary Tree Maximum Path Sum (LeetCode 124)**: More complex version where you compute maximum path sums while tracking a global maximum.

3. **Balanced Binary Tree (LeetCode 110)**: Check balance while computing heights, returning both height and balance status.

4. **Sum of Left Leaves (LeetCode 404)**: Traverse tree while accumulating a specific type of node value.

The common theme: You need to compute some property at each node that depends on properties of its children, so you use post-order traversal and return computed values up the tree.

## Key Takeaways

1. **Post-order traversal is key for bottom-up computation**: When you need information from children to compute something at the parent, process children first (post-order: left → right → root).

2. **Combine computation and accumulation in one pass**: Instead of separate traversals for different purposes, design your recursive function to both return values needed by parents AND update global state.

3. **Tree problems often have O(n) solutions**: If you find yourself needing O(n²) time for a tree problem, there's usually a single-traversal O(n) solution using clever recursion.

4. **Practice the "return value + side effect" pattern**: Many tree problems use recursive functions that return one value (like subtree sum) while having side effects (like updating a global maximum).

Related problems: [Find All The Lonely Nodes](/problem/find-all-the-lonely-nodes)
