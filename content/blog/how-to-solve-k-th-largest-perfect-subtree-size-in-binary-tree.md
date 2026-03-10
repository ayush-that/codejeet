---
title: "How to Solve K-th Largest Perfect Subtree Size in Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode K-th Largest Perfect Subtree Size in Binary Tree. Medium difficulty, 62.1% acceptance rate. Topics: Tree, Depth-First Search, Sorting, Binary Tree."
date: "2029-05-25"
category: "dsa-patterns"
tags:
  [
    "k-th-largest-perfect-subtree-size-in-binary-tree",
    "tree",
    "depth-first-search",
    "sorting",
    "medium",
  ]
---

# How to Solve K-th Largest Perfect Subtree Size in Binary Tree

You're given a binary tree and need to find the size (number of nodes) of the k-th largest perfect binary subtree within it. A perfect binary tree has all leaves at the same level and every parent has exactly two children. The challenge is efficiently identifying all perfect subtrees while tracking their sizes in order to find the k-th largest one.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this tree:

```
        1
       / \
      2   3
     / \   \
    4   5   6
   / \     / \
  7   8   9   10
```

We need to find all perfect binary subtrees and their sizes:

1. **Leaf nodes (7, 8, 9, 10)**: Each is a perfect subtree of size 1
2. **Node 4**: Has children 7 and 8, both leaves → perfect subtree of size 3 (4, 7, 8)
3. **Node 6**: Has children 9 and 10, both leaves → perfect subtree of size 3 (6, 9, 10)
4. **Node 2**: Has children 4 and 5. Node 4 is perfect (size 3), but node 5 is a leaf (size 1). Since children aren't both perfect with same height, node 2 doesn't form a perfect subtree.
5. **Node 3**: Has children 6 and null → not perfect (missing right child)
6. **Node 1**: Children 2 and 3 aren't both perfect → not perfect

Perfect subtree sizes collected: [3, 3, 1, 1, 1, 1]

If k=1, we need the largest: 3  
If k=2, second largest: also 3  
If k=3, third largest: 1  
If k=7 (more than number of perfect subtrees): return -1

## Brute Force Approach

A naive approach would be:

1. For each node, check if the subtree rooted at that node is perfect
2. If perfect, calculate its size and add to a list
3. Sort the list in descending order
4. Return the k-th element or -1 if k exceeds list length

The problem with this approach is efficiency. Checking if a subtree is perfect requires traversing the entire subtree, which takes O(n) time per node. With n nodes, this becomes O(n²) time complexity. Additionally, we'd need O(n) space to store all perfect subtree sizes.

What makes this inefficient is redundant work: when checking if node A's subtree is perfect, we're also checking if its children's subtrees are perfect, but we don't reuse that information.

## Optimized Approach

The key insight is to use **post-order traversal** (bottom-up approach) where each node returns information about its subtree to its parent. For each node, we need to know:

1. Whether its subtree is perfect
2. The height of its subtree (if perfect)
3. The size of its subtree (if perfect)

A subtree rooted at node X is perfect if:

- Both left and right children exist AND
- Both left and right subtrees are perfect AND
- Both subtrees have the same height

If these conditions are met, then:

- Height of X's subtree = height of left subtree + 1
- Size of X's perfect subtree = 1 + size(left) + size(right)

We collect all perfect subtree sizes during this traversal, then find the k-th largest.

## Optimal Solution

We perform a DFS where each node returns a tuple: (isPerfect, height, size). We collect sizes of all perfect subtrees, sort them in descending order, and return the k-th largest or -1.

<div class="code-group">

```python
# Time: O(n + m log m) where n = nodes in tree, m = perfect subtrees found
# Space: O(n) for recursion stack and storing perfect sizes
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def kthLargestPerfectSubtree(self, root: TreeNode, k: int) -> int:
        perfect_sizes = []

        def dfs(node):
            """Return (is_perfect, height, size) for subtree rooted at node"""
            if not node:
                # Empty tree is technically perfect with height 0, size 0
                return True, 0, 0

            # Recursively check left and right subtrees
            left_perfect, left_height, left_size = dfs(node.left)
            right_perfect, right_height, right_size = dfs(node.right)

            # Check if current subtree is perfect
            if (node.left and node.right and  # Must have both children
                left_perfect and right_perfect and  # Both subtrees must be perfect
                left_height == right_height):  # Both subtrees must have same height

                # Current subtree is perfect
                current_height = left_height + 1
                current_size = 1 + left_size + right_size

                # Add to our collection of perfect subtree sizes
                perfect_sizes.append(current_size)

                return True, current_height, current_size
            else:
                # Current subtree is not perfect
                # But we still need to return something - height is max of children's heights + 1
                # Size is not meaningful since subtree isn't perfect
                current_height = max(left_height, right_height) + 1
                return False, current_height, 0

        # Start DFS from root
        dfs(root)

        # Handle edge case: single node is a perfect subtree of size 1
        if not root.left and not root.right:
            perfect_sizes.append(1)

        # Sort perfect sizes in descending order
        perfect_sizes.sort(reverse=True)

        # Return k-th largest or -1 if k exceeds number of perfect subtrees
        return perfect_sizes[k-1] if k <= len(perfect_sizes) else -1
```

```javascript
// Time: O(n + m log m) where n = nodes in tree, m = perfect subtrees found
// Space: O(n) for recursion stack and storing perfect sizes
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function kthLargestPerfectSubtree(root, k) {
  const perfectSizes = [];

  function dfs(node) {
    // Return [isPerfect, height, size] for subtree rooted at node
    if (!node) {
      // Empty tree is technically perfect with height 0, size 0
      return [true, 0, 0];
    }

    // Recursively check left and right subtrees
    const [leftPerfect, leftHeight, leftSize] = dfs(node.left);
    const [rightPerfect, rightHeight, rightSize] = dfs(node.right);

    // Check if current subtree is perfect
    if (
      node.left &&
      node.right && // Must have both children
      leftPerfect &&
      rightPerfect && // Both subtrees must be perfect
      leftHeight === rightHeight
    ) {
      // Both subtrees must have same height

      // Current subtree is perfect
      const currentHeight = leftHeight + 1;
      const currentSize = 1 + leftSize + rightSize;

      // Add to our collection of perfect subtree sizes
      perfectSizes.push(currentSize);

      return [true, currentHeight, currentSize];
    } else {
      // Current subtree is not perfect
      // Height is max of children's heights + 1
      // Size is not meaningful since subtree isn't perfect
      const currentHeight = Math.max(leftHeight, rightHeight) + 1;
      return [false, currentHeight, 0];
    }
  }

  // Start DFS from root
  dfs(root);

  // Handle edge case: single node is a perfect subtree of size 1
  if (root && !root.left && !root.right) {
    perfectSizes.push(1);
  }

  // Sort perfect sizes in descending order
  perfectSizes.sort((a, b) => b - a);

  // Return k-th largest or -1 if k exceeds number of perfect subtrees
  return k <= perfectSizes.length ? perfectSizes[k - 1] : -1;
}
```

```java
// Time: O(n + m log m) where n = nodes in tree, m = perfect subtrees found
// Space: O(n) for recursion stack and storing perfect sizes
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public int kthLargestPerfectSubtree(TreeNode root, int k) {
        List<Integer> perfectSizes = new ArrayList<>();

        // DFS traversal that returns information about subtree
        dfs(root, perfectSizes);

        // Handle edge case: single node is a perfect subtree of size 1
        if (root != null && root.left == null && root.right == null) {
            perfectSizes.add(1);
        }

        // Sort in descending order
        perfectSizes.sort((a, b) -> b - a);

        // Return k-th largest or -1 if k exceeds number of perfect subtrees
        return k <= perfectSizes.size() ? perfectSizes.get(k - 1) : -1;
    }

    private int[] dfs(TreeNode node, List<Integer> perfectSizes) {
        // Return array: [isPerfect (0/1), height, size]
        if (node == null) {
            // Empty tree is technically perfect with height 0, size 0
            return new int[]{1, 0, 0};
        }

        // Recursively check left and right subtrees
        int[] leftInfo = dfs(node.left, perfectSizes);
        int[] rightInfo = dfs(node.right, perfectSizes);

        boolean leftPerfect = leftInfo[0] == 1;
        boolean rightPerfect = rightInfo[0] == 1;
        int leftHeight = leftInfo[1];
        int rightHeight = rightInfo[1];
        int leftSize = leftInfo[2];
        int rightSize = rightInfo[2];

        // Check if current subtree is perfect
        if (node.left != null && node.right != null &&  // Must have both children
            leftPerfect && rightPerfect &&              // Both subtrees must be perfect
            leftHeight == rightHeight) {                // Both subtrees must have same height

            // Current subtree is perfect
            int currentHeight = leftHeight + 1;
            int currentSize = 1 + leftSize + rightSize;

            // Add to our collection of perfect subtree sizes
            perfectSizes.add(currentSize);

            return new int[]{1, currentHeight, currentSize};
        } else {
            // Current subtree is not perfect
            // Height is max of children's heights + 1
            // Size is not meaningful since subtree isn't perfect
            int currentHeight = Math.max(leftHeight, rightHeight) + 1;
            return new int[]{0, currentHeight, 0};
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m log m)

- O(n): We visit each node exactly once during the DFS traversal
- O(m log m): We sort the list of perfect subtree sizes, where m is the number of perfect subtrees found (m ≤ n)
- In the worst case (complete binary tree), nearly every subtree is perfect, so m ≈ n, giving O(n log n)

**Space Complexity:** O(n)

- O(n): Recursion stack in worst case (skewed tree)
- O(n): Storing perfect subtree sizes in worst case
- O(h): Recursion stack where h is height of tree (h ≤ n)

## Common Mistakes

1. **Forgetting the single node case**: A single node (leaf) is a perfect binary tree of size 1. Many solutions miss this because their perfect tree check requires both children to exist. Always handle this edge case explicitly.

2. **Incorrect height calculation**: When a subtree isn't perfect, you still need to return its height for parent nodes to compare. The height should be max(leftHeight, rightHeight) + 1, not 0.

3. **Off-by-one with k indexing**: Remember k is 1-indexed (1st largest, 2nd largest, etc.), but arrays are 0-indexed. Return `perfectSizes[k-1]`, not `perfectSizes[k]`.

4. **Not checking that both children exist**: A perfect binary tree requires every parent to have exactly two children. Don't just check if subtrees are perfect—also verify the node has both left and right children.

## When You'll See This Pattern

This **bottom-up post-order traversal** pattern appears in many tree problems where each node needs information from its children to compute its own result:

1. **Balanced Binary Tree (LeetCode 110)**: Check if tree is balanced by having each node return its height, then checking if children's heights differ by at most 1.

2. **Diameter of Binary Tree (LeetCode 543)**: Find longest path between any two nodes by having each node compute the maximum path through it using heights from children.

3. **Maximum Depth of Binary Tree (LeetCode 104)**: Simple case where each node returns 1 + max(leftDepth, rightDepth).

The pattern is: process children first, combine their results, compute current node's result, and potentially propagate information upward.

## Key Takeaways

1. **Post-order traversal is powerful for subtree problems**: When you need information about entire subtrees to make decisions at parent nodes, process children before parents (post-order).

2. **Return multiple values from recursion**: Use tuples/arrays/objects to return all necessary information (isPerfect, height, size) rather than making multiple recursive calls.

3. **Perfect binary trees have strict properties**: All leaves at same level AND every parent has two children. Both conditions must be checked.

Related problems: [Balanced Binary Tree](/problem/balanced-binary-tree)
