---
title: "How to Solve Longest Univalue Path — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Univalue Path. Medium difficulty, 43.6% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2028-07-25"
category: "dsa-patterns"
tags: ["longest-univalue-path", "tree", "depth-first-search", "binary-tree", "medium"]
---

# How to Solve Longest Univalue Path

This problem asks us to find the longest path in a binary tree where every node along the path has the same value. The tricky part is that this path doesn't have to go through the root, and the path length is measured in edges (not nodes). This means we need to consider paths that might start in one subtree, go up through a parent, and then down into another subtree — all while maintaining the same value across all nodes.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Tree: [5,4,5,1,1,null,5]
Visual representation:
      5
     / \
    4   5
   / \   \
  1   1   5
```

We're looking for the longest path where all nodes have the same value.

**Step 1:** Start at the leaf node with value 1 (left child of 4). As a leaf, it can only contribute a path of length 0 (no edges).

**Step 2:** The other leaf with value 1 (right child of 4) also contributes length 0.

**Step 3:** Now look at the node with value 4. Its children both have value 1, which is different from 4. So from node 4's perspective:

- Left child contributes 0 (different value)
- Right child contributes 0 (different value)
- The longest path through node 4 is 0
- But we also check: could we combine left and right? No, because values differ

**Step 4:** Look at the leaf with value 5 (right child of the right 5). As a leaf: contributes length 0.

**Step 5:** Now the middle node with value 5 (right child of root):

- Its right child has value 5 (same!), so that gives us 0 + 1 = 1 edge
- Its left child is null (contributes 0)
- Through this node, we could have a path of length 1 (just down to its child)
- But wait — we could also potentially combine with parent later

**Step 6:** Finally, the root with value 5:

- Left child has value 4 (different) → contributes 0
- Right child has value 5 (same!) → from step 5, we know the right child can contribute 1
- So through the root, we could go: root → right child → right child's right child
- That's 2 edges! (root→right = 1 edge, right→right's right = 1 edge)

**Step 7:** But there's another path we haven't considered: the three 5's in a line on the right side:

- Rightmost leaf (5) → its parent (5) → the root (5)
- That's also 2 edges!

The longest univalue path in this tree is 2 edges. Notice how we had to consider:

1. Paths that go through a node and down one side only
2. Paths that go through a node and down both sides
3. The fact that we can only combine both sides if they have the same value as the current node

## Brute Force Approach

A naive approach would be to check every possible path in the tree. For each node, we could:

1. Consider it as the "highest" point of a potential path
2. Try to extend the path downward on both sides as far as possible while values match
3. Do this for every node in the tree

The brute force code might look like this (in Python-like pseudocode):

```python
def longest_univalue_path_brute(root):
    if not root:
        return 0

    max_length = 0

    def dfs(node, target_value):
        if not node or node.val != target_value:
            return 0
        left = dfs(node.left, target_value)
        right = dfs(node.right, target_value)
        return 1 + max(left, right)

    # Check every node as potential path center
    stack = [root]
    while stack:
        node = stack.pop()
        if node:
            # Check path through this node
            left_len = dfs(node.left, node.val) if node.left else 0
            right_len = dfs(node.right, node.val) if node.right else 0
            max_length = max(max_length, left_len + right_len)

            stack.append(node.left)
            stack.append(node.right)

    return max_length
```

**Why this is inefficient:**

- For each of the n nodes, we're doing a DFS that could visit O(n) nodes in the worst case
- This gives us O(n²) time complexity, which is too slow for large trees
- We're doing redundant work — when we check paths from a node, we're traversing parts of the tree that we've already seen from other nodes

## Optimized Approach

The key insight is that we can compute everything in a **single post-order traversal**. Instead of treating each node as a separate problem, we can compute for each node:

1. **What is the longest univalue path that starts at this node and goes downward?** (We'll call this the "arrow length")
2. **What is the longest path that passes through this node?** (This could combine left and right arrows)

Here's the step-by-step reasoning:

1. **Bottom-up computation**: We process leaves first, then their parents. This is natural for DFS post-order traversal.

2. **For each node, compute two things**:
   - `left_arrow`: How far can we extend a univalue path downward through the left child?
   - `right_arrow`: How far can we extend a univalue path downward through the right child?

   These are only non-zero if the child has the same value as the current node.

3. **Update the global maximum**:
   - The best path through the current node is `left_arrow + right_arrow`
   - This represents a path that goes down the left side, through this node, then down the right side
4. **Return value to parent**:
   - To our parent, we can only extend **one** side (not both)
   - So we return `1 + max(left_arrow, right_arrow)` to our parent
   - The `+1` accounts for the edge from parent to current node

This approach works because:

- We visit each node exactly once → O(n) time
- We compute both local information (path through this node) and information needed by parent (how far can you extend through me?)
- The post-order traversal ensures we have child information before processing parent

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes in tree
# Space: O(h) where h is height of tree (recursion stack)
class Solution:
    def longestUnivaluePath(self, root):
        # Global variable to track the maximum path length found
        self.max_length = 0

        def dfs(node):
            """
            Perform DFS post-order traversal.
            Returns: the length of the longest univalue path that starts at 'node'
                     and goes downward (can only go down one side).
            """
            if not node:
                return 0

            # Recursively get the arrow lengths from left and right children
            left_length = dfs(node.left)
            right_length = dfs(node.right)

            # Initialize arrow lengths for current node
            # These represent how far we can extend from current node downward
            left_arrow = right_arrow = 0

            # If left child exists and has same value as current node,
            # we can extend the left arrow by 1 (for the edge to left child)
            # plus whatever the left child could extend downward
            if node.left and node.left.val == node.val:
                left_arrow = left_length + 1

            # Same logic for right child
            if node.right and node.right.val == node.val:
                right_arrow = right_length + 1

            # Update global maximum
            # The path through current node combines left and right arrows
            # This represents a path that goes: left child path -> node -> right child path
            self.max_length = max(self.max_length, left_arrow + right_arrow)

            # Return to parent: we can only extend one side upward
            # So we take the maximum of left and right arrows
            return max(left_arrow, right_arrow)

        # Start DFS from root
        dfs(root)

        # Return the maximum length found
        return self.max_length
```

```javascript
// Time: O(n) where n is number of nodes in tree
// Space: O(h) where h is height of tree (recursion stack)
var longestUnivaluePath = function (root) {
  // Global variable to track maximum path length
  let maxLength = 0;

  // Helper function for DFS traversal
  const dfs = (node) => {
    // Base case: null node contributes 0 length
    if (!node) return 0;

    // Recursively process left and right subtrees
    const leftLength = dfs(node.left);
    const rightLength = dfs(node.right);

    // Initialize arrow lengths for current node
    let leftArrow = 0;
    let rightArrow = 0;

    // Check if we can extend left arrow
    // We can only extend if left child exists and has same value
    if (node.left && node.left.val === node.val) {
      leftArrow = leftLength + 1; // +1 for edge from current to left child
    }

    // Check if we can extend right arrow
    if (node.right && node.right.val === node.val) {
      rightArrow = rightLength + 1; // +1 for edge from current to right child
    }

    // Update global maximum
    // Path through current node = leftArrow + rightArrow
    maxLength = Math.max(maxLength, leftArrow + rightArrow);

    // Return to parent: can only extend one side upward
    return Math.max(leftArrow, rightArrow);
  };

  // Start DFS from root
  dfs(root);

  return maxLength;
};
```

```java
// Time: O(n) where n is number of nodes in tree
// Space: O(h) where h is height of tree (recursion stack)
class Solution {
    // Class-level variable to track maximum path length
    private int maxLength = 0;

    public int longestUnivaluePath(TreeNode root) {
        // Start DFS traversal
        dfs(root);
        return maxLength;
    }

    private int dfs(TreeNode node) {
        // Base case: null node contributes 0 length
        if (node == null) return 0;

        // Recursively process left and right subtrees
        int leftLength = dfs(node.left);
        int rightLength = dfs(node.right);

        // Initialize arrow lengths for current node
        int leftArrow = 0;
        int rightArrow = 0;

        // Check if we can extend left arrow
        // We can only extend if left child exists and has same value
        if (node.left != null && node.left.val == node.val) {
            leftArrow = leftLength + 1; // +1 for edge from current to left child
        }

        // Check if we can extend right arrow
        if (node.right != null && node.right.val == node.val) {
            rightArrow = rightLength + 1; // +1 for edge from current to right child
        }

        // Update global maximum
        // Path through current node = leftArrow + rightArrow
        maxLength = Math.max(maxLength, leftArrow + rightArrow);

        // Return to parent: can only extend one side upward
        return Math.max(leftArrow, rightArrow);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the DFS traversal
- At each node, we perform O(1) operations (comparisons, arithmetic, updates)
- Therefore, total time is proportional to the number of nodes

**Space Complexity: O(h)** where h is the height of the tree

- The space is used by the recursion call stack
- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- Note: This is the space for recursion. An iterative solution could use O(1) extra space (excluding input), but recursion is more natural for tree problems

## Common Mistakes

1. **Counting nodes instead of edges**: The problem clearly states "number of edges between them," but it's easy to accidentally count nodes. Remember: a path between a node and itself has 0 edges, not 1.

2. **Forgetting that paths can't branch upward**: When returning a value to a parent, you can only return the maximum of left or right arrow lengths, not their sum. The sum is only for paths that pass through the current node (which can't be extended upward).

3. **Not checking for null children before comparing values**: This causes NullPointerException (Java) or similar errors. Always check `if node.left and node.left.val == node.val` instead of just `if node.left.val == node.val`.

4. **Using pre-order instead of post-order traversal**: You need child information before processing a node, so post-order (process children first) is essential. Pre-order won't work because you don't know what your children can contribute yet.

## When You'll See This Pattern

This "compute two things at each node" pattern appears in several tree problems:

1. **Binary Tree Maximum Path Sum (Hard)**: Almost identical structure! Instead of counting edges with same values, you're summing values. You still compute:
   - Local best path through current node (could combine left and right)
   - What to return to parent (can only extend one side)

2. **Diameter of Binary Tree (Easy)**: This is actually a special case of our problem where all nodes have the same value! The diameter is the longest path between any two nodes, which is exactly what we're computing.

3. **Count Univalue Subtrees (Medium)**: Similar concept of propagating information upward about whether a subtree is univalue, but simpler since you don't need to track path lengths.

The core pattern is: **In post-order traversal, compute both a local answer (using both children) and a return value for parent (using at most one child)**.

## Key Takeaways

1. **Tree path problems often require post-order traversal** because you need information from children before you can compute results for the current node.

2. **Distinguish between "path through node" and "path starting at node"**:
   - The global maximum considers paths that go through a node (can use both children)
   - The return value to parent considers paths starting at node (can only use one child)

3. **Edge cases matter**: Empty trees, single nodes, all values different, all values same, skewed trees. Test these to ensure your solution handles them correctly.

Related problems: [Binary Tree Maximum Path Sum](/problem/binary-tree-maximum-path-sum), [Count Univalue Subtrees](/problem/count-univalue-subtrees), [Path Sum III](/problem/path-sum-iii)
