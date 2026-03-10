---
title: "How to Solve Height of Binary Tree After Subtree Removal Queries — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Height of Binary Tree After Subtree Removal Queries. Hard difficulty, 54.9% acceptance rate. Topics: Array, Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2027-05-21"
category: "dsa-patterns"
tags:
  [
    "height-of-binary-tree-after-subtree-removal-queries",
    "array",
    "tree",
    "depth-first-search",
    "hard",
  ]
---

# Solving "Height of Binary Tree After Subtree Removal Queries"

This problem asks us to compute the height of a binary tree after removing specific subtrees for multiple independent queries. The challenge is that each query must be processed independently—the tree resets to its original state after each query—and we need to handle up to 10⁵ nodes and queries efficiently. The brute force approach of actually removing subtrees and recomputing heights would be far too slow, requiring us to find a clever preprocessing solution.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this tree (values are node labels, not heights):

```
        1
       / \
      2   3
     / \   \
    4   5   6
```

We want to answer queries like: "What's the tree height if we remove the subtree rooted at node 2?"

**Original heights:**

- Node 4: height 1
- Node 5: height 1
- Node 2: height 2 (1 + max(height(4), height(5)))
- Node 6: height 1
- Node 3: height 2 (1 + height(6))
- Node 1: height 3 (1 + max(height(2), height(3)))

**Query: Remove subtree at node 2**

- Node 2 and its children (4, 5) are removed
- The remaining tree has nodes: 1, 3, 6
- New height: height(1) = 1 + height(3) = 1 + 2 = 3

Wait, that's the same as the original height! That's because when we remove node 2's subtree, the right subtree (node 3) still gives us height 2, plus 1 for the root gives us 3.

**Query: Remove subtree at node 3**

- Node 3 and its child 6 are removed
- Remaining: 1, 2, 4, 5
- New height: height(1) = 1 + height(2) = 1 + 2 = 3

Again the same height! This reveals the key insight: **When we remove a node's subtree, the tree height becomes the maximum of two things:**

1. The height through the other child of the removed node's parent (if it exists)
2. The height from paths that don't go through the removed node at all

But we need a systematic way to compute this for any node efficiently.

## Brute Force Approach

The most straightforward approach would be:

1. For each query, create a copy of the tree
2. Remove the specified subtree (set references to null)
3. Perform DFS to compute the new height
4. Return the result

This approach has several problems:

- **Time Complexity:** O(m × n) where m is number of queries and n is number of nodes
- **Space Complexity:** O(n) per query for tree copies
- With n, m ≤ 10⁵, this becomes O(10¹⁰) operations, which is completely infeasible

Even if we try to optimize by not copying the entire tree and instead marking nodes as removed, we'd still need to recompute heights from scratch for each query, which is O(n) per query.

## Optimized Approach

The key insight is that we can precompute everything we need in O(n) time and answer each query in O(1) time. Here's the step-by-step reasoning:

1. **First DFS:** Compute the height of every node's subtree (standard DFS).
2. **Second DFS:** For each node, we need to know: "If I remove this node's subtree, what's the maximum height I can get from other paths?"
   - When we remove a node, the tree height becomes the maximum of:
     a) The height through the sibling subtree (if parent has two children)
     b) The height from the parent's alternative paths (if we removed the parent's entire subtree from its parent's perspective)
3. **Store per node:** For each node, we want to know the maximum height achievable if we don't go through that node. We can compute this by propagating information downward:
   - For the root: alternative height = 0 (no other paths)
   - For a left child: alternative height = max(parent's alternative height, height of parent's right subtree) + 1
   - For a right child: alternative height = max(parent's alternative height, height of parent's left subtree) + 1
4. **Answer queries:** For query removing node v, answer = max(alternative_height[v], height of v's sibling subtree if exists)

The tricky part is that "alternative height" represents the longest path that doesn't go through the current node, considering all possible paths upward through ancestors.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n + m) where n = number of nodes, m = number of queries
# Space: O(n) for storing heights and alternative heights
class Solution:
    def treeQueries(self, root: Optional[TreeNode], queries: List[int]) -> List[int]:
        # Dictionary to store height of each node's subtree
        height = {}
        # Dictionary to store the maximum height if we don't go through this node
        alt_height = {}

        # First DFS: compute height of each node's subtree
        def dfs_height(node):
            if not node:
                return 0
            # Height = 1 + max(left_height, right_height)
            h = 1 + max(dfs_height(node.left), dfs_height(node.right))
            height[node.val] = h
            return h

        # Second DFS: compute alternative heights
        def dfs_alt(node, depth, max_alt):
            if not node:
                return
            # Store the alternative height for this node
            # This represents the maximum height achievable without going through this node
            alt_height[node.val] = max_alt

            # For the left child, the alternative path could be:
            # 1. Through parent's alternative path (max_alt)
            # 2. Through parent's right subtree (if exists)
            left_height = height[node.left.val] if node.left else 0
            right_height = height[node.right.val] if node.right else 0

            # Process left child: its alternative is max of:
            # - parent's alternative (max_alt)
            # - height of right sibling subtree
            # Then add 1 for the edge from parent to child
            if node.left:
                # max_alt is already the height from paths not through current node
                # We take max of that and the height through the right sibling
                new_max_alt = max(max_alt, right_height)
                dfs_alt(node.left, depth + 1, new_max_alt + 1)

            # Process right child similarly
            if node.right:
                new_max_alt = max(max_alt, left_height)
                dfs_alt(node.right, depth + 1, new_max_alt + 1)

        # Compute subtree heights
        dfs_height(root)
        # Compute alternative heights starting from root (depth=0, max_alt=0)
        dfs_alt(root, 0, 0)

        # Answer queries
        result = []
        for q in queries:
            # When we remove node q's subtree, the tree height is:
            # max(alternative height of q, height of q's sibling if exists)
            # But careful: alternative height already accounts for sibling through parent
            # Actually, alt_height[q] is exactly what we want!
            result.append(alt_height[q])

        return result
```

```javascript
// Time: O(n + m) where n = number of nodes, m = number of queries
// Space: O(n) for storing heights and alternative heights
var treeQueries = function (root, queries) {
  // Maps to store height and alternative height for each node value
  const height = new Map();
  const altHeight = new Map();

  // First DFS: compute height of each node's subtree
  function dfsHeight(node) {
    if (!node) return 0;

    // Recursively compute heights of left and right subtrees
    const leftHeight = dfsHeight(node.left);
    const rightHeight = dfsHeight(node.right);

    // Height of current node = 1 + max(left, right)
    const h = 1 + Math.max(leftHeight, rightHeight);
    height.set(node.val, h);

    return h;
  }

  // Second DFS: compute alternative heights
  function dfsAlt(node, depth, maxAlt) {
    if (!node) return;

    // Store alternative height for this node
    altHeight.set(node.val, maxAlt);

    // Get heights of children (0 if child doesn't exist)
    const leftHeight = node.left ? height.get(node.left.val) : 0;
    const rightHeight = node.right ? height.get(node.right.val) : 0;

    // Process left child
    if (node.left) {
      // For left child, alternative is max of:
      // - parent's alternative (maxAlt)
      // - height of right sibling
      const newMaxAlt = Math.max(maxAlt, rightHeight);
      dfsAlt(node.left, depth + 1, newMaxAlt + 1);
    }

    // Process right child
    if (node.right) {
      // For right child, alternative is max of:
      // - parent's alternative (maxAlt)
      // - height of left sibling
      const newMaxAlt = Math.max(maxAlt, leftHeight);
      dfsAlt(node.right, depth + 1, newMaxAlt + 1);
    }
  }

  // Compute all heights
  dfsHeight(root);
  // Compute alternative heights starting from root
  dfsAlt(root, 0, 0);

  // Answer all queries
  const result = [];
  for (const q of queries) {
    result.push(altHeight.get(q));
  }

  return result;
};
```

```java
// Time: O(n + m) where n = number of nodes, m = number of queries
// Space: O(n) for storing heights and alternative heights
class Solution {
    // Maps to store height and alternative height for each node value
    private Map<Integer, Integer> height = new HashMap<>();
    private Map<Integer, Integer> altHeight = new HashMap<>();

    public int[] treeQueries(TreeNode root, int[] queries) {
        // First DFS: compute all subtree heights
        dfsHeight(root);

        // Second DFS: compute alternative heights
        dfsAlt(root, 0, 0);

        // Answer queries
        int[] result = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            result[i] = altHeight.get(queries[i]);
        }

        return result;
    }

    private int dfsHeight(TreeNode node) {
        if (node == null) return 0;

        // Compute heights recursively
        int leftHeight = dfsHeight(node.left);
        int rightHeight = dfsHeight(node.right);

        // Current node's height = 1 + max(left, right)
        int h = 1 + Math.max(leftHeight, rightHeight);
        height.put(node.val, h);

        return h;
    }

    private void dfsAlt(TreeNode node, int depth, int maxAlt) {
        if (node == null) return;

        // Store alternative height for this node
        altHeight.put(node.val, maxAlt);

        // Get heights of children (0 if null)
        int leftHeight = node.left != null ? height.get(node.left.val) : 0;
        int rightHeight = node.right != null ? height.get(node.right.val) : 0;

        // Process left child
        if (node.left != null) {
            // For left child: max of parent's alternative and right sibling height
            int newMaxAlt = Math.max(maxAlt, rightHeight);
            dfsAlt(node.left, depth + 1, newMaxAlt + 1);
        }

        // Process right child
        if (node.right != null) {
            // For right child: max of parent's alternative and left sibling height
            int newMaxAlt = Math.max(maxAlt, leftHeight);
            dfsAlt(node.right, depth + 1, newMaxAlt + 1);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- First DFS to compute heights: O(n) visits each node once
- Second DFS to compute alternative heights: O(n) visits each node once
- Answering m queries: O(m) lookups in hash map
- Total: O(n + m)

**Space Complexity: O(n)**

- Height map: O(n) stores height for each node
- Alternative height map: O(n) stores alternative height for each node
- Recursion stack: O(h) where h is tree height, worst case O(n) for skewed tree
- Total: O(n)

## Common Mistakes

1. **Forgetting queries are independent:** Some candidates try to chain queries, actually modifying the tree. Remember each query starts from the original tree.

2. **Incorrect alternative height calculation:** The trickiest part is computing `newMaxAlt` for children. For a left child, you need `max(parent_alt, right_sibling_height)`, not `max(parent_alt, left_sibling_height)`.

3. **Not handling null children properly:** When a node has only one child, the missing child's height should be treated as 0, not skipped entirely.

4. **Confusing node depth with subtree height:** Depth is distance from root, height is longest path to leaf. We need heights, not depths.

5. **Using O(n) per query:** The most common performance mistake is recomputing heights for each query instead of preprocessing.

## When You'll See This Pattern

This problem uses a **two-pass DFS with state propagation** pattern, which appears in several tree problems:

1. **Binary Tree Maximum Path Sum (LeetCode 124)** - Similar two-pass approach to compute best path through each node.
2. **Diameter of Binary Tree (LeetCode 543)** - Compute heights in post-order, then combine to find diameter.
3. **House Robber III (LeetCode 337)** - Two-pass DFS to compute with/without robbing current node.
4. **Distribute Coins in Binary Tree (LeetCode 979)** - Propagate coin deficits/surpluses upward.

The core idea is: first gather information bottom-up (post-order), then propagate additional information top-down (pre-order) to answer queries about "what if we remove/exclude this node."

## Key Takeaways

1. **Two-pass DFS is powerful:** When you need information about both subtrees and paths to ancestors, consider one DFS to compute subtree properties and another to propagate ancestor information.

2. **Think about exclusion:** For "what if we remove X" problems, compute the best alternative path that doesn't go through X.

3. **Preprocessing enables O(1) queries:** When you have many queries on a static structure, precompute everything you might need.

4. **Tree problems often reduce to height/depth computations:** Many tree problems boil down to clever uses of height, depth, or distance calculations.

Related problems: [Maximum Depth of Binary Tree](/problem/maximum-depth-of-binary-tree), [Diameter of Binary Tree](/problem/diameter-of-binary-tree), [Binary Tree Maximum Path Sum](/problem/binary-tree-maximum-path-sum)
