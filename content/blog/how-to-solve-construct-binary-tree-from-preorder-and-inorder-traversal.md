---
title: "How to Solve Construct Binary Tree from Preorder and Inorder Traversal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Construct Binary Tree from Preorder and Inorder Traversal. Medium difficulty, 68.4% acceptance rate. Topics: Array, Hash Table, Divide and Conquer, Tree, Binary Tree."
date: "2026-06-10"
category: "dsa-patterns"
tags:
  [
    "construct-binary-tree-from-preorder-and-inorder-traversal",
    "array",
    "hash-table",
    "divide-and-conquer",
    "medium",
  ]
---

# How to Solve Construct Binary Tree from Preorder and Inorder Traversal

This problem asks us to reconstruct a binary tree given its preorder and inorder traversal arrays. What makes this problem interesting is that while a single traversal sequence can correspond to many different trees, the combination of preorder and inorder uniquely defines a binary tree (assuming all values are unique). The challenge lies in efficiently mapping the relationships between these two traversals to build the correct tree structure.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

- Preorder: [3, 9, 20, 15, 7]
- Inorder: [9, 3, 15, 20, 7]

**Step 1:** In preorder traversal, the first element is always the root. So `3` is our root.

**Step 2:** Find `3` in the inorder array. In inorder traversal, everything left of the root is in the left subtree, and everything right is in the right subtree:

- Left subtree inorder: [9] (elements before 3)
- Right subtree inorder: [15, 20, 7] (elements after 3)

**Step 3:** Determine the sizes of left and right subtrees:

- Left subtree size: 1 element
- Right subtree size: 3 elements

**Step 4:** Split the preorder array based on these sizes:

- After root `3`, the next 1 element belongs to left subtree: [9]
- The remaining 3 elements belong to right subtree: [20, 15, 7]

**Step 5:** Recursively apply the same process:

- For left subtree: preorder=[9], inorder=[9] → root is 9, no children
- For right subtree: preorder=[20, 15, 7], inorder=[15, 20, 7] → root is 20
  - Find 20 in inorder: left=[15], right=[7]
  - Split preorder: left=[15], right=[7]
  - Continue recursively...

The final tree:

```
    3
   / \
  9  20
    /  \
   15   7
```

## Brute Force Approach

A naive approach would be to:

1. Take the first element of preorder as root
2. Search for this root in the inorder array linearly
3. Split both arrays based on the found position
4. Recursively build left and right subtrees

The problem with this approach is the linear search in step 2. Each recursive call scans a portion of the inorder array to find the root, leading to O(n²) time complexity in the worst case (when the tree is skewed). For a tree with n nodes, we perform O(n) work at each of O(n) levels in the worst case.

While this brute force approach would technically work, it's inefficient for large trees. The key insight is that we can eliminate the linear search by using a hash map to store value-to-index mappings for the inorder array.

## Optimized Approach

The optimal solution uses divide-and-conquer with a hash map for O(1) lookups:

**Key Insight:**

- Preorder: [root, left subtree, right subtree]
- Inorder: [left subtree, root, right subtree]

By knowing the root's position in the inorder array, we can determine:

1. How many nodes are in the left subtree
2. How many nodes are in the right subtree
3. Where to split the preorder array for recursive calls

**Optimization:** Instead of searching for the root in inorder array each time (O(n) per call), we preprocess the inorder array into a hash map that maps values to their indices. This gives us O(1) lookups.

**Recursive Strategy:**

1. Use the next element in preorder as the current root
2. Find its index in inorder using the hash map
3. Calculate left/right subtree sizes
4. Recursively build left subtree with the appropriate portions of both arrays
5. Recursively build right subtree with the remaining portions

We need to track boundaries in both arrays to avoid creating new array copies (which would use extra space).

## Optimal Solution

<div class="code-group">

```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Time: O(n) - We process each node exactly once
# Space: O(n) - For the hash map and recursion stack (O(n) worst case, O(log n) average)
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        # Create a hash map to store value -> index mappings for inorder array
        # This allows O(1) lookups instead of O(n) linear searches
        inorder_index_map = {val: idx for idx, val in enumerate(inorder)}

        # Start the recursive construction
        # We use indices to represent subarrays without creating copies
        return self._buildTreeHelper(
            preorder, 0, len(preorder) - 1,  # preorder start and end indices
            inorder, 0, len(inorder) - 1,    # inorder start and end indices
            inorder_index_map
        )

    def _buildTreeHelper(self, preorder, pre_start, pre_end,
                        inorder, in_start, in_end, index_map):
        # Base case: empty subarray means no subtree to build
        if pre_start > pre_end or in_start > in_end:
            return None

        # The first element in current preorder subarray is always the root
        root_val = preorder[pre_start]
        root = TreeNode(root_val)

        # Find the position of this root in the inorder array
        root_idx_inorder = index_map[root_val]

        # Calculate the size of the left subtree
        # Everything between in_start and root_idx_inorder-1 is left subtree
        left_subtree_size = root_idx_inorder - in_start

        # Recursively build left subtree:
        # - In preorder: starts right after current root (pre_start + 1)
        #   and goes for left_subtree_size elements
        # - In inorder: from in_start to root_idx_inorder - 1
        root.left = self._buildTreeHelper(
            preorder, pre_start + 1, pre_start + left_subtree_size,
            inorder, in_start, root_idx_inorder - 1,
            index_map
        )

        # Recursively build right subtree:
        # - In preorder: starts after left subtree (pre_start + left_subtree_size + 1)
        #   and goes to pre_end
        # - In inorder: from root_idx_inorder + 1 to in_end
        root.right = self._buildTreeHelper(
            preorder, pre_start + left_subtree_size + 1, pre_end,
            inorder, root_idx_inorder + 1, in_end,
            index_map
        )

        return root
```

```javascript
// Definition for a binary tree node.
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

// Time: O(n) - We process each node exactly once
// Space: O(n) - For the hash map and recursion stack (O(n) worst case, O(log n) average)
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
  // Create a hash map for O(1) lookups of inorder indices
  const indexMap = new Map();
  for (let i = 0; i < inorder.length; i++) {
    indexMap.set(inorder[i], i);
  }

  // Helper function that uses indices to avoid array copying
  const build = (preStart, preEnd, inStart, inEnd) => {
    // Base case: empty range means no subtree
    if (preStart > preEnd || inStart > inEnd) {
      return null;
    }

    // First element in current preorder range is the root
    const rootVal = preorder[preStart];
    const root = new TreeNode(rootVal);

    // Find root's position in inorder array
    const rootIndexInorder = indexMap.get(rootVal);

    // Calculate size of left subtree
    const leftSubtreeSize = rootIndexInorder - inStart;

    // Build left subtree recursively
    // Preorder range for left: starts after root, goes for leftSubtreeSize elements
    // Inorder range for left: from inStart to just before root
    root.left = build(preStart + 1, preStart + leftSubtreeSize, inStart, rootIndexInorder - 1);

    // Build right subtree recursively
    // Preorder range for right: starts after left subtree
    // Inorder range for right: starts after root
    root.right = build(preStart + leftSubtreeSize + 1, preEnd, rootIndexInorder + 1, inEnd);

    return root;
  };

  // Start the recursive construction with full array ranges
  return build(0, preorder.length - 1, 0, inorder.length - 1);
};
```

```java
// Definition for a binary tree node.
public class TreeNode {
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

// Time: O(n) - We process each node exactly once
// Space: O(n) - For the hash map and recursion stack (O(n) worst case, O(log n) average)
class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        // Create a hash map to store inorder value -> index mappings
        Map<Integer, Integer> inorderIndexMap = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) {
            inorderIndexMap.put(inorder[i], i);
        }

        // Start recursive construction with full array ranges
        return buildTreeHelper(
            preorder, 0, preorder.length - 1,
            inorder, 0, inorder.length - 1,
            inorderIndexMap
        );
    }

    private TreeNode buildTreeHelper(int[] preorder, int preStart, int preEnd,
                                    int[] inorder, int inStart, int inEnd,
                                    Map<Integer, Integer> indexMap) {
        // Base case: empty range means no subtree to build
        if (preStart > preEnd || inStart > inEnd) {
            return null;
        }

        // First element in current preorder range is the root
        int rootVal = preorder[preStart];
        TreeNode root = new TreeNode(rootVal);

        // Find root's position in inorder array using the hash map
        int rootIndexInorder = indexMap.get(rootVal);

        // Calculate size of left subtree
        // Number of elements between inStart and rootIndexInorder-1
        int leftSubtreeSize = rootIndexInorder - inStart;

        // Recursively build left subtree
        // Preorder range: starts after root, goes for leftSubtreeSize elements
        // Inorder range: from inStart to just before root
        root.left = buildTreeHelper(
            preorder, preStart + 1, preStart + leftSubtreeSize,
            inorder, inStart, rootIndexInorder - 1,
            indexMap
        );

        // Recursively build right subtree
        // Preorder range: starts after left subtree
        // Inorder range: starts after root
        root.right = buildTreeHelper(
            preorder, preStart + leftSubtreeSize + 1, preEnd,
            inorder, rootIndexInorder + 1, inEnd,
            indexMap
        );

        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the hash map takes O(n)
- Each recursive call processes exactly one node, and we have n nodes total
- All operations within each recursive call are O(1) (hash map lookup, index calculations)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Hash map stores n entries: O(n)
- Recursion stack depth:
  - Worst case (skewed tree): O(n)
  - Average case (balanced tree): O(log n)
- We don't create new arrays, just pass indices
- Total: O(n) in worst case, O(n) average due to hash map

## Common Mistakes

1. **Creating new array copies for each recursive call**: This leads to O(n²) space complexity. Instead, use indices to represent subarrays.
2. **Incorrect index calculations for preorder splits**: The most common error is miscalculating where the right subtree starts in the preorder array. Remember: `pre_start + 1` to `pre_start + left_subtree_size` is left subtree, and `pre_start + left_subtree_size + 1` to `pre_end` is right subtree.

3. **Forgetting the base case**: When `pre_start > pre_end` or `in_start > in_end`, we should return `null`. This handles empty subtrees correctly.

4. **Assuming unique values without checking**: The problem statement doesn't explicitly guarantee unique values, but the solution relies on it. In an interview, mention this assumption. If values aren't unique, the tree construction becomes ambiguous.

## When You'll See This Pattern

This divide-and-conquer pattern with array partitioning appears in several tree construction problems:

1. **Construct Binary Tree from Inorder and Postorder Traversal (LeetCode 106)**: Almost identical to this problem, but uses postorder instead of preorder. The key difference is that in postorder, the root is at the end rather than the beginning.

2. **Convert Sorted Array to Binary Search Tree (LeetCode 108)**: While simpler (only one sorted array), it uses the same divide-and-conquer approach of finding the middle element as root and recursively building left/right subtrees.

3. **Serialize and Deserialize Binary Tree (LeetCode 297)**: When deserializing, you often need to reconstruct a tree from traversal sequences, though the exact approach varies based on the serialization format.

The core pattern is: identify the root, determine what belongs to left/right subtrees, then recursively apply the same logic to each subtree.

## Key Takeaways

1. **Preorder + Inorder uniquely defines a binary tree** (with unique values). Preorder gives you roots in the order they're visited; inorder tells you what's left vs. right of each root.

2. **Hash maps eliminate O(n) searches**: When you need to find elements in an array repeatedly during recursion, preprocess with a hash map for O(1) lookups.

3. **Use indices, not array copies**: Passing start/end indices is more space-efficient than slicing arrays in recursive calls. This is a common optimization in divide-and-conquer array problems.

Related problems: [Construct Binary Tree from Inorder and Postorder Traversal](/problem/construct-binary-tree-from-inorder-and-postorder-traversal)
