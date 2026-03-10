---
title: "How to Solve Maximum Sum BST in Binary Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Sum BST in Binary Tree. Hard difficulty, 46.5% acceptance rate. Topics: Dynamic Programming, Tree, Depth-First Search, Binary Search Tree, Binary Tree."
date: "2027-02-05"
category: "dsa-patterns"
tags:
  ["maximum-sum-bst-in-binary-tree", "dynamic-programming", "tree", "depth-first-search", "hard"]
---

# How to Solve Maximum Sum BST in Binary Tree

This problem asks us to find the maximum sum of node values in any subtree that forms a valid Binary Search Tree (BST). The challenge is that we need to simultaneously validate BST properties while computing sums, and we must consider **every possible subtree** in the binary tree, not just subtrees rooted at the original tree's nodes.

What makes this problem tricky is that a subtree must satisfy BST conditions at **every node** within it, not just at its root. A naive approach would be extremely inefficient, while the optimal solution requires a clever bottom-up traversal that returns multiple pieces of information from each subtree.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this binary tree:

```
       1
      / \
     4   3
    / \ / \
   2  4 2  5
        \
         4
```

We need to check every possible subtree to see if it's a valid BST, and if so, track its sum.

**Step 1: Leaf nodes** - Single nodes are always valid BSTs:

- Node 2: valid BST, sum = 2
- Node 4 (leftmost): valid BST, sum = 4
- Node 4 (rightmost): valid BST, sum = 4
- Node 5: valid BST, sum = 5

**Step 2: Node with value 2 and right child 4**:

- This subtree (2 → right 4) is NOT a valid BST because 4 > 2 (right child should be greater), but wait — actually 4 IS greater than 2, so this IS valid! My mistake. Let me correct: 2 with right child 4 is valid because 4 > 2.

**Step 3: The subtree rooted at 3**:

- Left child is 2 (with right child 4)
- Right child is 5
- For this to be a BST: all nodes in left subtree must be < 3, and all nodes in right subtree must be > 3
- The left subtree (2→4) has maximum value 4, which is NOT < 3 → invalid BST
- So the subtree rooted at 3 is NOT a valid BST

**Step 4: The subtree rooted at 4** (the left child of root):

- Left child is 2, right child is 4
- For BST: left subtree max < 4, right subtree min > 4
- Left subtree (2) has max = 2 < 4 ✓
- Right subtree (4) has min = 4, but must be > 4 (strictly greater) → 4 is not > 4 ✗
- So this subtree is NOT a valid BST

**Step 5: The entire tree rooted at 1**:

- Left subtree (4 with children 2,4) is not a BST
- Therefore the entire tree cannot be a BST

The maximum sum BST in this tree is actually the single node with value 5 (sum = 5), though there might be larger ones. This walkthrough shows we need to track for each subtree: whether it's a BST, its sum, and its min/max values to validate parent nodes.

## Brute Force Approach

A brute force approach would be to:

1. Generate every possible subtree in the binary tree
2. For each subtree, check if it's a valid BST
3. If valid, compute its sum
4. Track the maximum sum found

Checking if a tree is a BST takes O(n) time where n is the number of nodes in that subtree. Since there are O(n) subtrees in a binary tree, and checking each takes O(size of subtree), the total time complexity would be O(n²) in the worst case (for a skewed tree).

The brute force is inefficient because we're doing redundant work. When checking if a subtree is a BST, we're traversing it multiple times, and we're not using information from child subtrees to help evaluate parent subtrees.

## Optimized Approach

The key insight is that we can perform a **single post-order traversal** (left → right → root) that returns multiple pieces of information from each subtree:

For each node, we need to know:

1. **Whether the subtree rooted at this node is a valid BST**
2. **The sum of all nodes in this subtree** (if it's a valid BST)
3. **The minimum value in this subtree** (to validate with parent)
4. **The maximum value in this subtree** (to validate with parent)

This allows parent nodes to validate BST conditions in O(1) time:

- A node's subtree is a valid BST if:
  1. Its left subtree is a valid BST
  2. Its right subtree is a valid BST
  3. The maximum value in left subtree < node's value
  4. The minimum value in right subtree > node's value

We use a **bottom-up DFS approach** where each recursive call returns a tuple/object containing these four values. The global maximum sum is updated whenever we find a valid BST.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of nodes - each node visited once
# Space: O(h) where h is tree height for recursion stack
class Solution:
    def maxSumBST(self, root: Optional[TreeNode]) -> int:
        self.max_sum = 0

        def dfs(node):
            """
            Returns a tuple (is_bst, min_val, max_val, sum_val) for subtree rooted at node
            - is_bst: whether this subtree is a valid BST
            - min_val: minimum value in this subtree
            - max_val: maximum value in this subtree
            - sum_val: sum of all values in this subtree (if it's a BST)
            """
            if not node:
                # Base case: empty tree is a BST with sum 0
                # min_val = inf, max_val = -inf so parent comparisons work correctly
                return (True, float('inf'), float('-inf'), 0)

            # Recursively check left and right subtrees
            left_is_bst, left_min, left_max, left_sum = dfs(node.left)
            right_is_bst, right_min, right_max, right_sum = dfs(node.right)

            # Current subtree is a BST if:
            # 1. Both left and right subtrees are BSTs
            # 2. Max value in left subtree < current node's value
            # 3. Min value in right subtree > current node's value
            if (left_is_bst and right_is_bst and
                left_max < node.val < right_min):

                # Current subtree is a valid BST
                current_sum = left_sum + right_sum + node.val
                self.max_sum = max(self.max_sum, current_sum)

                # Return BST info for parent
                # min_val = min(left_min, node.val) but left_min could be inf
                # max_val = max(right_max, node.val) but right_max could be -inf
                current_min = min(left_min, node.val)
                current_max = max(right_max, node.val)
                return (True, current_min, current_max, current_sum)
            else:
                # Current subtree is NOT a valid BST
                # Return dummy values - they won't be used by parent for BST validation
                # but we still need to return something
                return (False, 0, 0, 0)

        dfs(root)
        return self.max_sum
```

```javascript
// Time: O(n) where n is number of nodes - each node visited once
// Space: O(h) where h is tree height for recursion stack
var maxSumBST = function (root) {
  let maxSum = 0;

  // Helper function for DFS traversal
  const dfs = (node) => {
    if (!node) {
      // Base case: empty tree is technically a BST
      // Use Infinity and -Infinity so parent comparisons work
      return { isBST: true, minVal: Infinity, maxVal: -Infinity, sum: 0 };
    }

    // Recursively process left and right subtrees
    const left = dfs(node.left);
    const right = dfs(node.right);

    // Check if current subtree is a valid BST
    // Conditions: both children are BSTs, and node.val is between left.max and right.min
    if (left.isBST && right.isBST && left.maxVal < node.val && node.val < right.minVal) {
      // Current subtree is a valid BST
      const currentSum = left.sum + right.sum + node.val;
      maxSum = Math.max(maxSum, currentSum);

      // Calculate min and max for this subtree
      // Math.min handles Infinity correctly
      const currentMin = Math.min(left.minVal, node.val);
      const currentMax = Math.max(right.maxVal, node.val);

      return {
        isBST: true,
        minVal: currentMin,
        maxVal: currentMax,
        sum: currentSum,
      };
    } else {
      // Current subtree is NOT a valid BST
      // Return dummy values (won't be used by parent for BST validation)
      return { isBST: false, minVal: 0, maxVal: 0, sum: 0 };
    }
  };

  dfs(root);
  return maxSum;
};
```

```java
// Time: O(n) where n is number of nodes - each node visited once
// Space: O(h) where h is tree height for recursion stack
class Solution {
    private int maxSum = 0;

    // Helper class to return multiple values from DFS
    class SubtreeInfo {
        boolean isBST;
        int minVal;
        int maxVal;
        int sum;

        SubtreeInfo(boolean isBST, int minVal, int maxVal, int sum) {
            this.isBST = isBST;
            this.minVal = minVal;
            this.maxVal = maxVal;
            this.sum = sum;
        }
    }

    public int maxSumBST(TreeNode root) {
        dfs(root);
        return maxSum;
    }

    private SubtreeInfo dfs(TreeNode node) {
        if (node == null) {
            // Base case: empty tree is a BST
            // Use Integer.MAX_VALUE and Integer.MIN_VALUE for comparisons
            return new SubtreeInfo(true, Integer.MAX_VALUE, Integer.MIN_VALUE, 0);
        }

        // Recursively process left and right subtrees
        SubtreeInfo left = dfs(node.left);
        SubtreeInfo right = dfs(node.right);

        // Check if current subtree forms a valid BST
        if (left.isBST && right.isBST && left.maxVal < node.val && node.val < right.minVal) {
            // Current subtree is a valid BST
            int currentSum = left.sum + right.sum + node.val;
            maxSum = Math.max(maxSum, currentSum);

            // Calculate min and max for this subtree
            // Handle edge cases where left/right might be null (base case)
            int currentMin = Math.min(left.minVal, node.val);
            int currentMax = Math.max(right.maxVal, node.val);

            return new SubtreeInfo(true, currentMin, currentMax, currentSum);
        } else {
            // Current subtree is NOT a valid BST
            // Return dummy values (parent won't use them for BST validation)
            return new SubtreeInfo(false, 0, 0, 0);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the number of nodes in the tree. Each node is visited exactly once during the post-order traversal. For each node, we perform O(1) work: checking conditions, computing sums, and updating min/max values.

**Space Complexity: O(h)** where h is the height of the tree. This is the space used by the recursion call stack. In the worst case (skewed tree), h = n, giving O(n) space. In a balanced tree, h = log(n), giving O(log n) space.

The key to achieving O(n) time is that we compute all necessary information in a single pass, avoiding the O(n²) time of the brute force approach that would check each subtree independently.

## Common Mistakes

1. **Not handling empty subtrees correctly**: When a node has no left or right child, we need to return appropriate min/max values. Using `inf` and `-inf` (or `Integer.MAX_VALUE` and `Integer.MIN_VALUE`) ensures parent comparisons work correctly. Without this, you might incorrectly mark valid BSTs as invalid.

2. **Forgetting that BST requires strict inequalities**: The problem states "less than" and "greater than" (not "less than or equal to"). A common mistake is using `<=` or `>=` comparisons, which would allow duplicate values in what should be invalid BSTs.

3. **Not updating the global maximum sum for all valid BSTs**: Some candidates only check if the entire tree is a BST. Remember we need the maximum sum in **any** subtree that's a BST, not just the whole tree. We must update `max_sum` whenever we find any valid BST subtree.

4. **Returning incorrect values for invalid BSTs**: When a subtree is not a BST, we still need to return something, but the values won't be used by the parent for BST validation (since `isBST` will be false). However, we must ensure we don't accidentally use these dummy values in calculations.

## When You'll See This Pattern

This "return multiple values from DFS" pattern appears in many tree problems:

1. **Validate Binary Search Tree (LeetCode 98)**: Similar concept of checking BST validity by tracking min/max values, though simpler since we only check the entire tree.

2. **Largest BST Subtree (LeetCode 333)**: Almost identical problem structure - find the largest BST subtree by number of nodes rather than sum of values.

3. **Binary Tree Maximum Path Sum (LeetCode 124)**: Uses a similar approach of returning multiple values (max path sum through node, max path sum ending at node) to compute the global maximum.

The pattern is: when you need to compute a global property (max sum, size, etc.) of subtrees that satisfy certain constraints, use post-order DFS to bubble up information from children to parents.

## Key Takeaways

1. **Post-order traversal is powerful for subtree problems**: When you need information from both children to compute something at the parent, post-order (left → right → root) is often the right approach.

2. **Return tuples/objects from recursive calls**: Don't be afraid to design helper functions that return multiple values. This avoids redundant traversals and enables O(n) solutions.

3. **Define what information parents need from children**: Before coding, explicitly list what each recursive call needs to return. For BST problems, this is typically: validity flag, min value, max value, and the computed metric (sum, size, etc.).

[Practice this problem on CodeJeet](/problem/maximum-sum-bst-in-binary-tree)
