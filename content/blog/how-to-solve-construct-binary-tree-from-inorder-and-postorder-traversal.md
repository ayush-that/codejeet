---
title: "How to Solve Construct Binary Tree from Inorder and Postorder Traversal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Construct Binary Tree from Inorder and Postorder Traversal. Medium difficulty, 68.1% acceptance rate. Topics: Array, Hash Table, Divide and Conquer, Tree, Binary Tree."
date: "2026-10-30"
category: "dsa-patterns"
tags:
  [
    "construct-binary-tree-from-inorder-and-postorder-traversal",
    "array",
    "hash-table",
    "divide-and-conquer",
    "medium",
  ]
---

# How to Solve Construct Binary Tree from Inorder and Postorder Traversal

This problem asks us to reconstruct a binary tree given its inorder and postorder traversal arrays. What makes this problem interesting is that while we can't uniquely reconstruct a tree from just one traversal sequence, the combination of inorder with postorder (or preorder) provides enough information to uniquely determine the tree structure. The challenge lies in efficiently mapping the relationships between these two traversals.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

- inorder = [9, 3, 15, 20, 7]
- postorder = [9, 15, 7, 20, 3]

**Step 1: Identify the root**
In postorder traversal, the last element is always the root of the tree (or subtree). Here, `postorder[4] = 3` is our root.

**Step 2: Locate root in inorder**
Find `3` in the inorder array: it's at index 1. In inorder traversal, everything left of the root is in the left subtree, and everything right is in the right subtree:

- Left subtree inorder: [9] (elements before 3)
- Right subtree inorder: [15, 20, 7] (elements after 3)

**Step 3: Determine subtree postorder arrays**
The postorder array has this structure: [left subtree postorder, right subtree postorder, root]
We know:

- Total length = 5
- Left subtree size = 1 (from inorder)
- Right subtree size = 3

So:

- Left subtree postorder: first 1 element = [9]
- Right subtree postorder: next 3 elements = [15, 7, 20]

**Step 4: Recursively build subtrees**
For left subtree:

- inorder = [9], postorder = [9] → root = 9, no children

For right subtree:

- inorder = [15, 20, 7], postorder = [15, 7, 20]
- Root = 20 (last in postorder)
- In inorder: left of 20 = [15], right of 20 = [7]
- Continue recursively...

**Final tree:**

```
    3
   / \
  9  20
    /  \
   15   7
```

## Brute Force Approach

A naive approach would be to:

1. Take the last element from postorder as root
2. Search for this root in the inorder array (linear scan)
3. Split both arrays into left and right portions
4. Recursively build left and right subtrees

The problem with this approach is the linear search in step 2. For each recursive call, we scan the inorder array to find the root position, which takes O(n) time. In the worst case (skewed tree), we make n recursive calls, leading to O(n²) time complexity.

While this brute force approach would technically work and is a good starting point for understanding the problem, it's inefficient for larger trees. The key insight is that we can eliminate the linear search by using a hash map to store value-to-index mappings from the inorder array.

## Optimized Approach

The optimal solution uses divide-and-conquer with hash map optimization:

**Key Insight:**

1. Postorder's last element is always the current root
2. In inorder traversal, all elements before the root belong to the left subtree, and all after belong to the right subtree
3. We can use a hash map to instantly find any value's position in the inorder array

**Optimization Strategy:**

- Preprocess the inorder array into a hash map: `value → index`
- This allows O(1) lookup instead of O(n) linear search
- Use pointer indices to avoid creating new array copies at each recursive call

**Recursive Process:**

1. Base case: if start index > end index, return null
2. Take last element from current postorder segment as root value
3. Find root's position in inorder using hash map
4. Calculate sizes of left and right subtrees
5. Recursively build right subtree first (important for postorder indexing!)
6. Recursively build left subtree
7. Return constructed node

The reason we build the right subtree before the left is due to postorder's structure: [left, right, root]. When we process from the end backward, we encounter right subtree nodes before left subtree nodes.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - we process each node exactly once
# Space: O(n) - for the hash map and recursion stack (O(n) worst, O(log n) average)
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> Optional[TreeNode]:
        # Build hash map for O(1) inorder index lookup
        inorder_index_map = {val: idx for idx, val in enumerate(inorder)}

        def build(in_start: int, in_end: int, post_start: int, post_end: int) -> Optional[TreeNode]:
            # Base case: empty segment
            if in_start > in_end or post_start > post_end:
                return None

            # Root is the last element in current postorder segment
            root_val = postorder[post_end]
            root = TreeNode(root_val)

            # Find root's position in inorder array
            root_idx = inorder_index_map[root_val]

            # Calculate size of left subtree
            left_size = root_idx - in_start

            # Recursively build right subtree first (important for postorder indexing!)
            # Right subtree: inorder[root_idx+1:in_end], postorder[post_start+left_size:post_end-1]
            root.right = build(
                root_idx + 1,          # inorder start for right subtree
                in_end,                # inorder end for right subtree
                post_start + left_size, # postorder start for right subtree
                post_end - 1           # postorder end for right subtree
            )

            # Recursively build left subtree
            # Left subtree: inorder[in_start:root_idx-1], postorder[post_start:post_start+left_size-1]
            root.left = build(
                in_start,              # inorder start for left subtree
                root_idx - 1,          # inorder end for left subtree
                post_start,            # postorder start for left subtree
                post_start + left_size - 1  # postorder end for left subtree
            )

            return root

        # Start building from the entire arrays
        return build(0, len(inorder) - 1, 0, len(postorder) - 1)
```

```javascript
// Time: O(n) - we process each node exactly once
// Space: O(n) - for the hash map and recursion stack (O(n) worst, O(log n) average)
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

var buildTree = function (inorder, postorder) {
  // Build hash map for O(1) inorder index lookup
  const inorderIndexMap = new Map();
  for (let i = 0; i < inorder.length; i++) {
    inorderIndexMap.set(inorder[i], i);
  }

  const build = (inStart, inEnd, postStart, postEnd) => {
    // Base case: empty segment
    if (inStart > inEnd || postStart > postEnd) {
      return null;
    }

    // Root is the last element in current postorder segment
    const rootVal = postorder[postEnd];
    const root = new TreeNode(rootVal);

    // Find root's position in inorder array
    const rootIdx = inorderIndexMap.get(rootVal);

    // Calculate size of left subtree
    const leftSize = rootIdx - inStart;

    // Recursively build right subtree first (important for postorder indexing!)
    // Right subtree: inorder[rootIdx+1:inEnd], postorder[postStart+leftSize:postEnd-1]
    root.right = build(
      rootIdx + 1, // inorder start for right subtree
      inEnd, // inorder end for right subtree
      postStart + leftSize, // postorder start for right subtree
      postEnd - 1 // postorder end for right subtree
    );

    // Recursively build left subtree
    // Left subtree: inorder[inStart:rootIdx-1], postorder[postStart:postStart+leftSize-1]
    root.left = build(
      inStart, // inorder start for left subtree
      rootIdx - 1, // inorder end for left subtree
      postStart, // postorder start for left subtree
      postStart + leftSize - 1 // postorder end for left subtree
    );

    return root;
  };

  // Start building from the entire arrays
  return build(0, inorder.length - 1, 0, postorder.length - 1);
};
```

```java
// Time: O(n) - we process each node exactly once
// Space: O(n) - for the hash map and recursion stack (O(n) worst, O(log n) average)
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
    public TreeNode buildTree(int[] inorder, int[] postorder) {
        // Build hash map for O(1) inorder index lookup
        Map<Integer, Integer> inorderIndexMap = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) {
            inorderIndexMap.put(inorder[i], i);
        }

        return build(inorder, postorder, inorderIndexMap,
                     0, inorder.length - 1, 0, postorder.length - 1);
    }

    private TreeNode build(int[] inorder, int[] postorder, Map<Integer, Integer> inorderIndexMap,
                          int inStart, int inEnd, int postStart, int postEnd) {
        // Base case: empty segment
        if (inStart > inEnd || postStart > postEnd) {
            return null;
        }

        // Root is the last element in current postorder segment
        int rootVal = postorder[postEnd];
        TreeNode root = new TreeNode(rootVal);

        // Find root's position in inorder array
        int rootIdx = inorderIndexMap.get(rootVal);

        // Calculate size of left subtree
        int leftSize = rootIdx - inStart;

        // Recursively build right subtree first (important for postorder indexing!)
        // Right subtree: inorder[rootIdx+1:inEnd], postorder[postStart+leftSize:postEnd-1]
        root.right = build(inorder, postorder, inorderIndexMap,
                          rootIdx + 1,          // inorder start for right subtree
                          inEnd,                // inorder end for right subtree
                          postStart + leftSize, // postorder start for right subtree
                          postEnd - 1           // postorder end for right subtree
                         );

        // Recursively build left subtree
        // Left subtree: inorder[inStart:rootIdx-1], postorder[postStart:postStart+leftSize-1]
        root.left = build(inorder, postorder, inorderIndexMap,
                         inStart,              // inorder start for left subtree
                         rootIdx - 1,          // inorder end for left subtree
                         postStart,            // postorder start for left subtree
                         postStart + leftSize - 1  // postorder end for left subtree
                        );

        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each node exactly once when building the tree
- The hash map provides O(1) lookup for root positions in inorder array
- Each recursive call does constant work plus the recursive calls to build subtrees

**Space Complexity: O(n)**

- Hash map storage: O(n) to store value-to-index mappings for inorder array
- Recursion stack: O(n) in worst case (completely skewed tree), O(log n) on average (balanced tree)
- We don't create new arrays at each recursive call - we use indices to represent segments

The space complexity is dominated by the hash map and recursion stack. Note that while we could theoretically achieve O(1) extra space by doing linear searches instead of using a hash map, that would increase time complexity to O(n²).

## Common Mistakes

1. **Building left subtree before right subtree with postorder**
   - In postorder, the structure is [left, right, root]
   - When processing from the end, we encounter right subtree nodes before left
   - Building left first will use wrong indices for the right subtree

2. **Incorrect index calculations for subtree boundaries**
   - The left subtree size calculation `root_idx - in_start` is crucial
   - Forgetting the `-1` when calculating postorder end for left subtree
   - Mixing up `post_start + left_size` vs `post_start + left_size - 1`

3. **Not handling empty input cases**
   - Both arrays could be empty (null tree)
   - Need to check `if in_start > in_end` as base case
   - This happens when a subtree has no nodes

4. **Creating new array copies instead of using indices**
   - Some candidates create new slices/arrays at each recursive call
   - This increases space complexity to O(n²) due to array copying
   - Always use index pointers to represent array segments

## When You'll See This Pattern

This divide-and-conquer pattern with traversal array reconstruction appears in several tree problems:

1. **Construct Binary Tree from Preorder and Inorder Traversal (LeetCode 105)**
   - Almost identical problem, but with preorder instead of postorder
   - Key difference: in preorder, root is first element instead of last
   - Same core technique: use hash map for inorder, recursively build subtrees

2. **Construct Binary Tree from Preorder and Postorder Traversal (LeetCode 889)**
   - More challenging because preorder+postorder doesn't guarantee uniqueness
   - Still uses similar divide-and-conquer approach
   - Requires careful handling of multiple possible trees

3. **Serialize and Deserialize Binary Tree (LeetCode 297)**
   - While not identical, understanding tree traversals helps with serialization
   - Often uses preorder with markers for null nodes
   - The reconstruction phase uses similar recursive thinking

The pattern also appears in problems involving array segmentation based on pivot elements, like quicksort's partition step.

## Key Takeaways

1. **Inorder + (Preorder/Postorder) uniquely defines a binary tree**
   - Inorder tells you left/right partitioning
   - Preorder/Postorder tells you root positions
   - This combination is sufficient for reconstruction

2. **Hash maps eliminate O(n) searches in divide-and-conquer**
   - Preprocessing traversal arrays into hash maps is a common optimization
   - Turns O(n²) brute force into O(n) optimal solution
   - Useful whenever you need frequent value-to-index lookups

3. **Pointer indices beat array copying**
   - Always pass start/end indices instead of creating array slices
   - Reduces space complexity and avoids unnecessary allocations
   - Critical for maintaining optimal performance

**Related problems:** [Construct Binary Tree from Preorder and Inorder Traversal](/problem/construct-binary-tree-from-preorder-and-inorder-traversal)
