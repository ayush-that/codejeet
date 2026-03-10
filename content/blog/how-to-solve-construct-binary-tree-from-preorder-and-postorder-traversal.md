---
title: "How to Solve Construct Binary Tree from Preorder and Postorder Traversal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Construct Binary Tree from Preorder and Postorder Traversal. Medium difficulty, 78.1% acceptance rate. Topics: Array, Hash Table, Divide and Conquer, Tree, Binary Tree."
date: "2028-08-03"
category: "dsa-patterns"
tags:
  [
    "construct-binary-tree-from-preorder-and-postorder-traversal",
    "array",
    "hash-table",
    "divide-and-conquer",
    "medium",
  ]
---

# How to Solve Construct Binary Tree from Preorder and Postorder Traversal

This problem asks us to reconstruct a binary tree given only its preorder and postorder traversal sequences. What makes this problem interesting—and tricky—is that these two traversals alone don't uniquely define a binary tree for all cases. Unlike the combination of inorder with either preorder or postorder, preorder+postorder can produce multiple valid trees, which is why the problem states we can return any valid tree.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

- Preorder: [1, 2, 4, 5, 3, 6, 7]
- Postorder: [4, 5, 2, 6, 7, 3, 1]

**Step 1: Identify the root**

- In preorder, the first element is always the root: `1`
- In postorder, the last element is always the root: `1` ✓

**Step 2: Find the left subtree**

- The second element in preorder (`2`) is the root of the left subtree
- Find `2` in postorder: it's at index 2
- Everything before `2` in postorder ([4, 5]) belongs to the left subtree
- So left subtree has 2 nodes: [4, 5]

**Step 3: Recursively build left subtree**

- Preorder for left subtree: [2, 4, 5] (next 3 elements after root)
- Postorder for left subtree: [4, 5, 2]
- Root: `2`
- Next in preorder: `4` (left child root)
- Find `4` in postorder: index 0
- Everything before `4` in postorder: [] → left child has no left subtree
- Right child: `5`

**Step 4: Build right subtree**

- Remaining preorder after left subtree: [3, 6, 7]
- Remaining postorder after left subtree: [6, 7, 3]
- Root: `3`
- Next in preorder: `6` (left child root)
- Find `6` in postorder: index 0
- Everything before `6` in postorder: [] → left child has no left subtree
- Right child: `7`

The key insight: For any subtree, the first element in its preorder slice is the root, and the element immediately after it (if it exists) is the root of the left subtree. We find that left subtree root in the postorder array to determine the size of the left subtree.

## Brute Force Approach

A naive approach might try to generate all possible binary trees and check which ones match both traversals, but this would be factorial time complexity. Another brute force would be to try every possible split point between left and right subtrees, but without additional information, we'd have to check all possible splits.

The challenge is that without inorder traversal, we don't know where the left subtree ends and right subtree begins in the preorder sequence. We could try every possible partition:

1. Take root from preorder[0]
2. For each possible split point k (from 0 to n-2):
   - Assume left subtree has k nodes
   - Check if the sequences are consistent
   - If yes, recursively build

This would be O(n²) in the worst case and quite complex to implement correctly. The real issue is we're missing the critical information that tells us the size of the left subtree.

## Optimized Approach

The key insight comes from observing the relationship between preorder and postorder:

1. **Root identification**: `preorder[0]` is always the root of the (sub)tree
2. **Left subtree root**: `preorder[1]` is the root of the left subtree (if it exists)
3. **Finding left subtree size**: We find `preorder[1]` in the `postorder` array. All elements before it in postorder belong to the left subtree. This tells us exactly how many nodes are in the left subtree.

Why does this work? In postorder traversal, all nodes of the left subtree appear before the root of the left subtree, which appears before all nodes of the right subtree. So when we find the left subtree root in postorder, everything to its left must be in the left subtree.

**Algorithm:**

1. Create a hash map to store value → index for postorder (for O(1) lookups)
2. Define recursive function `build(pre_left, pre_right, post_left, post_right)`:
   - If `pre_left > pre_right`, return null (empty subtree)
   - Create root node from `preorder[pre_left]`
   - If `pre_left == pre_right`, return root (single node)
   - Find left root `preorder[pre_left + 1]` in postorder using hash map
   - Calculate left subtree size: `left_size = left_root_post_index - post_left + 1`
   - Recursively build left subtree with appropriate slices
   - Recursively build right subtree with remaining slices
   - Return root

**Why this handles multiple valid trees:**
When a node has only one child, we can't tell if it's a left or right child from preorder+postorder alone. Our algorithm consistently treats it as a left child, which produces one valid tree among several possibilities.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for hash map and recursion stack
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def constructFromPrePost(self, preorder: List[int], postorder: List[int]) -> Optional[TreeNode]:
        # Create hash map for O(1) lookups of values in postorder
        post_index_map = {val: i for i, val in enumerate(postorder)}

        def build(pre_left: int, pre_right: int, post_left: int, post_right: int) -> Optional[TreeNode]:
            """
            Build subtree from preorder[pre_left:pre_right+1] and postorder[post_left:post_right+1]
            """
            # Base case: empty subtree
            if pre_left > pre_right:
                return None

            # Create root node from first element in preorder slice
            root = TreeNode(preorder[pre_left])

            # Base case: single node subtree
            if pre_left == pre_right:
                return root

            # The next element in preorder is the root of the left subtree
            left_root_val = preorder[pre_left + 1]
            # Find position of left subtree root in postorder
            left_root_post_idx = post_index_map[left_root_val]

            # Calculate size of left subtree
            # All nodes before left_root in postorder belong to left subtree
            left_size = left_root_post_idx - post_left + 1

            # Recursively build left subtree
            # Preorder slice for left: starts at pre_left+1, has left_size elements
            # Postorder slice for left: starts at post_left, has left_size elements
            root.left = build(
                pre_left + 1,
                pre_left + left_size,
                post_left,
                left_root_post_idx
            )

            # Recursively build right subtree
            # Preorder slice for right: starts after left subtree, goes to pre_right
            # Postorder slice for right: starts after left subtree, ends before root
            root.right = build(
                pre_left + left_size + 1,
                pre_right,
                left_root_post_idx + 1,
                post_right - 1
            )

            return root

        # Build entire tree from full arrays
        return build(0, len(preorder) - 1, 0, len(postorder) - 1)
```

```javascript
// Time: O(n) | Space: O(n) for hash map and recursion stack
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

/**
 * @param {number[]} preorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var constructFromPrePost = function (preorder, postorder) {
  // Create hash map for O(1) lookups of values in postorder
  const postIndexMap = new Map();
  for (let i = 0; i < postorder.length; i++) {
    postIndexMap.set(postorder[i], i);
  }

  /**
   * Build subtree from preorder[preLeft:preRight+1] and postorder[postLeft:postRight+1]
   */
  const build = (preLeft, preRight, postLeft, postRight) => {
    // Base case: empty subtree
    if (preLeft > preRight) {
      return null;
    }

    // Create root node from first element in preorder slice
    const root = new TreeNode(preorder[preLeft]);

    // Base case: single node subtree
    if (preLeft === preRight) {
      return root;
    }

    // The next element in preorder is the root of the left subtree
    const leftRootVal = preorder[preLeft + 1];
    // Find position of left subtree root in postorder
    const leftRootPostIdx = postIndexMap.get(leftRootVal);

    // Calculate size of left subtree
    // All nodes before leftRoot in postorder belong to left subtree
    const leftSize = leftRootPostIdx - postLeft + 1;

    // Recursively build left subtree
    // Preorder slice for left: starts at preLeft+1, has leftSize elements
    // Postorder slice for left: starts at postLeft, has leftSize elements
    root.left = build(preLeft + 1, preLeft + leftSize, postLeft, leftRootPostIdx);

    // Recursively build right subtree
    // Preorder slice for right: starts after left subtree, goes to preRight
    // Postorder slice for right: starts after left subtree, ends before root
    root.right = build(preLeft + leftSize + 1, preRight, leftRootPostIdx + 1, postRight - 1);

    return root;
  };

  // Build entire tree from full arrays
  return build(0, preorder.length - 1, 0, postorder.length - 1);
};
```

```java
// Time: O(n) | Space: O(n) for hash map and recursion stack
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
    private int[] preorder;
    private int[] postorder;
    private Map<Integer, Integer> postIndexMap;

    public TreeNode constructFromPrePost(int[] preorder, int[] postorder) {
        this.preorder = preorder;
        this.postorder = postorder;

        // Create hash map for O(1) lookups of values in postorder
        postIndexMap = new HashMap<>();
        for (int i = 0; i < postorder.length; i++) {
            postIndexMap.put(postorder[i], i);
        }

        // Build entire tree from full arrays
        return build(0, preorder.length - 1, 0, postorder.length - 1);
    }

    /**
     * Build subtree from preorder[preLeft:preRight+1] and postorder[postLeft:postRight+1]
     */
    private TreeNode build(int preLeft, int preRight, int postLeft, int postRight) {
        // Base case: empty subtree
        if (preLeft > preRight) {
            return null;
        }

        // Create root node from first element in preorder slice
        TreeNode root = new TreeNode(preorder[preLeft]);

        // Base case: single node subtree
        if (preLeft == preRight) {
            return root;
        }

        // The next element in preorder is the root of the left subtree
        int leftRootVal = preorder[preLeft + 1];
        // Find position of left subtree root in postorder
        int leftRootPostIdx = postIndexMap.get(leftRootVal);

        // Calculate size of left subtree
        // All nodes before leftRoot in postorder belong to left subtree
        int leftSize = leftRootPostIdx - postLeft + 1;

        // Recursively build left subtree
        // Preorder slice for left: starts at preLeft+1, has leftSize elements
        // Postorder slice for left: starts at postLeft, has leftSize elements
        root.left = build(
            preLeft + 1,
            preLeft + leftSize,
            postLeft,
            leftRootPostIdx
        );

        // Recursively build right subtree
        // Preorder slice for right: starts after left subtree, goes to preRight
        // Postorder slice for right: starts after left subtree, ends before root
        root.right = build(
            preLeft + leftSize + 1,
            preRight,
            leftRootPostIdx + 1,
            postRight - 1
        );

        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the hash map takes O(n)
- Each recursive call processes a unique subtree, and each node is processed exactly once
- The hash map gives us O(1) lookup for finding the left subtree root in postorder

**Space Complexity: O(n)**

- Hash map uses O(n) space
- Recursion stack uses O(h) space where h is the height of the tree
- In the worst case (skewed tree), h = n, so O(n)
- The output tree itself uses O(n) space, but this is usually not counted in space complexity

## Common Mistakes

1. **Forgetting the single-node base case**: When `pre_left == pre_right`, we have a single node. If we don't handle this case and try to access `preorder[pre_left + 1]`, we'll get an index out of bounds error.

2. **Incorrect left subtree size calculation**: A common error is `left_size = left_root_post_idx - post_left` (missing the +1). Remember: if the left subtree root is at index `post_left`, then `left_size = 1`, not 0.

3. **Wrong indices for right subtree**: The right subtree in preorder starts at `pre_left + left_size + 1` (not `+ left_size`), because `pre_left + left_size` is the last element of the left subtree. Similarly, in postorder, the right subtree ends at `post_right - 1` (excluding the root).

4. **Not handling the ambiguity correctly**: When a node has only one child, preorder+postorder can't tell if it's left or right. Some candidates try to determine this, but the problem says to return any valid tree. Our approach always treats it as a left child, which is simpler and correct.

## When You'll See This Pattern

This divide-and-conquer approach with traversal arrays is common in tree reconstruction problems:

1. **Construct Binary Tree from Preorder and Inorder Traversal (LeetCode 105)**: Similar pattern but easier because inorder gives exact left/right split.

2. **Construct Binary Tree from Inorder and Postorder Traversal (LeetCode 106)**: Same core idea but using postorder's last element as root.

3. **Serialize and Deserialize Binary Tree (LeetCode 297)**: While not identical, understanding tree traversals helps with serialization problems.

The pattern is: Use one traversal to identify roots and another to determine subtree boundaries, then recurse.

## Key Takeaways

1. **Preorder identifies roots, postorder identifies subtree sizes**: The first element in any preorder slice is the root. The position of the next element in postorder tells us how large the left subtree is.

2. **Divide and conquer with array indices is more efficient than slicing**: Passing indices instead of creating new array slices saves space and time.

3. **Hash maps enable O(1) lookups**: When you need to find elements in another array, a hash map turns O(n) searches into O(1) lookups, making the overall algorithm O(n) instead of O(n²).

[Practice this problem on CodeJeet](/problem/construct-binary-tree-from-preorder-and-postorder-traversal)
