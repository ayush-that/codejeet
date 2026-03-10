---
title: "How to Solve Merge BSTs to Create Single BST — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Merge BSTs to Create Single BST. Hard difficulty, 38.0% acceptance rate. Topics: Array, Hash Table, Tree, Depth-First Search, Binary Search Tree."
date: "2030-03-04"
category: "dsa-patterns"
tags: ["merge-bsts-to-create-single-bst", "array", "hash-table", "tree", "hard"]
---

# How to Solve Merge BSTs to Create Single BST

You're given multiple small BSTs (each with ≤3 nodes) and need to merge them into a single valid BST by connecting trees where one tree's root value matches another tree's leaf value. The challenge is determining if a valid merge sequence exists and constructing the final tree while ensuring the result remains a proper BST.

What makes this problem tricky: You need to simultaneously verify that all trees can be connected without cycles, that the resulting structure is a valid BST, and that no values are duplicated. The constraint that each tree has ≤3 nodes is crucial—it means each tree is essentially a root with at most two children, which simplifies the merging logic.

## Visual Walkthrough

Let's trace through an example:

```
trees = [[2,1],[3,2,5],[5,4]]
```

We have three trees:

1. Tree A: root=2, left=1
2. Tree B: root=3, left=2, right=5
3. Tree C: root=5, left=4

**Step 1: Identify potential connections**

- Tree A's root (2) appears as Tree B's left child → Tree A can be attached to Tree B
- Tree C's root (5) appears as Tree B's right child → Tree C can be attached to Tree B

**Step 2: Check for multiple parents**
Each node should have at most one parent. Here:

- Node 2 has parent 3 (from Tree B)
- Node 5 has parent 3 (from Tree B)
- No node has multiple parents ✓

**Step 3: Find the ultimate root**
The root of the final tree should not appear as a child in any tree. Check all root values:

- 2 appears as child in Tree B
- 3 doesn't appear as child anywhere → candidate root
- 5 appears as child in Tree B

So 3 is the only possible root.

**Step 4: Verify BST properties**
After connecting:

- Tree A (root=2) becomes left subtree of 3
- Tree C (root=5) becomes right subtree of 3
- Check Tree A: 1 < 2 ✓
- Check Tree C: 4 < 5 ✓
- Check overall: left subtree values < 3 < right subtree values ✓

**Step 5: Verify all trees are used**
We've used all three trees, so the merge is valid.

## Brute Force Approach

A naive approach might try all possible merge sequences:

1. Try every tree as the starting root
2. For each root, try attaching other trees wherever their root value matches a leaf
3. Continue recursively, checking BST validity at each step
4. If we use all trees and have a valid BST, return it

**Why this fails:**

- With n trees, there are n! possible merge orders
- Each merge requires BST validation (O(m) where m is total nodes)
- Total complexity: O(n! × m) — impossibly slow for n up to 50
- Doesn't leverage the key insight: with ≤3 nodes per tree, each tree has a simple structure that determines exactly where it can attach

The brute force also misses critical constraints:

- Each value must be unique in the final tree
- No cycles can form (a tree's root connecting to its own descendant)
- Exactly one tree should have a root that never appears as a child

## Optimized Approach

The key insight: **Each tree with ≤3 nodes has one of four structures**:

1. Single node (root only)
2. Root with left child only
3. Root with right child only
4. Root with both children

**Step-by-step reasoning:**

1. **Build a value-to-tree map**: Since all values are unique, we can map each value to the tree that contains it as root. This lets us quickly find which tree to attach when we encounter a leaf value.

2. **Track child counts**: For each value, count how many trees have it as a child. A valid final tree has exactly one root (value with 0 child count) and all other values have exactly 1 parent.

3. **Find the ultimate root**: The root of the final tree is the value that appears as a root but never as a child in any tree. There must be exactly one such value.

4. **DFS to build and validate**: Starting from the root, use DFS to:
   - Attach the appropriate tree at each node
   - Verify BST properties locally (left child < parent < right child)
   - Ensure we don't create cycles
   - Track visited nodes to ensure all trees are used

5. **Final checks**: After DFS, verify that:
   - All trees were used (visited count = number of trees)
   - No duplicate values exist
   - The entire structure is a valid BST

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is total number of nodes across all trees
# Space: O(n) for the value maps and recursion stack
class Solution:
    def canMerge(self, trees: List[TreeNode]) -> Optional[TreeNode]:
        # Step 1: Map each value to its tree and count child occurrences
        value_to_tree = {}
        child_count = {}

        for tree in trees:
            value_to_tree[tree.val] = tree
            # Initialize count for root if not present
            if tree.val not in child_count:
                child_count[tree.val] = 0

            # Count children of this tree
            if tree.left:
                child_count[tree.left.val] = child_count.get(tree.left.val, 0) + 1
            if tree.right:
                child_count[tree.right.val] = child_count.get(tree.right.val, 0) + 1

        # Step 2: Find the ultimate root - value that's a root but not a child
        root_val = None
        for tree in trees:
            if child_count[tree.val] == 0:
                if root_val is not None:
                    return None  # Multiple possible roots
                root_val = tree.val

        if root_val is None:
            return None  # No valid root found

        # Remove the root tree from value_to_tree so we don't reattach it
        root_tree = value_to_tree.pop(root_val)

        # Step 3: DFS to merge trees and validate
        visited = set()
        self.is_valid = True

        def dfs(node, min_val, max_val):
            """DFS to attach subtrees and validate BST properties"""
            if not node or not self.is_valid:
                return

            # Check BST bounds
            if not (min_val < node.val < max_val):
                self.is_valid = False
                return

            # If this node's value exists in another tree, attach that tree
            if node.val in value_to_tree:
                # Get the tree to attach
                subtree = value_to_tree.pop(node.val)
                visited.add(node.val)

                # Attach left and right children from the subtree
                node.left = subtree.left
                node.right = subtree.right

                # Check for cycles (shouldn't happen with proper child counts)
                if subtree.val in visited:
                    self.is_valid = False
                    return

            # Recursively process children with updated BST bounds
            if node.left:
                dfs(node.left, min_val, node.val)
            if node.right:
                dfs(node.right, node.val, max_val)

        # Start DFS from root with infinite bounds
        dfs(root_tree, float('-inf'), float('inf'))

        # Step 4: Final validation
        # Check if all trees were used (value_to_tree should be empty)
        # Add 1 for the root tree which we removed earlier
        if not self.is_valid or len(value_to_tree) > 0 or len(visited) + 1 != len(trees):
            return None

        return root_tree
```

```javascript
// Time: O(n) where n is total number of nodes across all trees
// Space: O(n) for the value maps and recursion stack
function canMerge(trees) {
  // Step 1: Map each value to its tree and count child occurrences
  const valueToTree = new Map();
  const childCount = new Map();

  for (const tree of trees) {
    valueToTree.set(tree.val, tree);

    // Initialize count for root if not present
    if (!childCount.has(tree.val)) {
      childCount.set(tree.val, 0);
    }

    // Count children of this tree
    if (tree.left) {
      childCount.set(tree.left.val, (childCount.get(tree.left.val) || 0) + 1);
    }
    if (tree.right) {
      childCount.set(tree.right.val, (childCount.get(tree.right.val) || 0) + 1);
    }
  }

  // Step 2: Find the ultimate root - value that's a root but not a child
  let rootVal = null;
  for (const tree of trees) {
    if (childCount.get(tree.val) === 0) {
      if (rootVal !== null) {
        return null; // Multiple possible roots
      }
      rootVal = tree.val;
    }
  }

  if (rootVal === null) {
    return null; // No valid root found
  }

  // Remove the root tree from valueToTree so we don't reattach it
  const rootTree = valueToTree.get(rootVal);
  valueToTree.delete(rootVal);

  // Step 3: DFS to merge trees and validate
  const visited = new Set();
  let isValid = true;

  function dfs(node, minVal, maxVal) {
    // DFS to attach subtrees and validate BST properties
    if (!node || !isValid) {
      return;
    }

    // Check BST bounds
    if (!(minVal < node.val && node.val < maxVal)) {
      isValid = false;
      return;
    }

    // If this node's value exists in another tree, attach that tree
    if (valueToTree.has(node.val)) {
      // Get the tree to attach
      const subtree = valueToTree.get(node.val);
      valueToTree.delete(node.val);
      visited.add(node.val);

      // Attach left and right children from the subtree
      node.left = subtree.left;
      node.right = subtree.right;

      // Check for cycles (shouldn't happen with proper child counts)
      if (visited.has(subtree.val)) {
        isValid = false;
        return;
      }
    }

    // Recursively process children with updated BST bounds
    if (node.left) {
      dfs(node.left, minVal, node.val);
    }
    if (node.right) {
      dfs(node.right, node.val, maxVal);
    }
  }

  // Start DFS from root with infinite bounds
  dfs(rootTree, -Infinity, Infinity);

  // Step 4: Final validation
  // Check if all trees were used (valueToTree should be empty)
  // Add 1 for the root tree which we removed earlier
  if (!isValid || valueToTree.size > 0 || visited.size + 1 !== trees.length) {
    return null;
  }

  return rootTree;
}
```

```java
// Time: O(n) where n is total number of nodes across all trees
// Space: O(n) for the value maps and recursion stack
class Solution {
    private Map<Integer, TreeNode> valueToTree = new HashMap<>();
    private boolean isValid = true;

    public TreeNode canMerge(List<TreeNode> trees) {
        // Step 1: Map each value to its tree and count child occurrences
        Map<Integer, Integer> childCount = new HashMap<>();

        for (TreeNode tree : trees) {
            valueToTree.put(tree.val, tree);
            // Initialize count for root if not present
            childCount.putIfAbsent(tree.val, 0);

            // Count children of this tree
            if (tree.left != null) {
                childCount.put(tree.left.val, childCount.getOrDefault(tree.left.val, 0) + 1);
            }
            if (tree.right != null) {
                childCount.put(tree.right.val, childCount.getOrDefault(tree.right.val, 0) + 1);
            }
        }

        // Step 2: Find the ultimate root - value that's a root but not a child
        TreeNode rootTree = null;
        for (TreeNode tree : trees) {
            if (childCount.get(tree.val) == 0) {
                if (rootTree != null) {
                    return null;  // Multiple possible roots
                }
                rootTree = tree;
            }
        }

        if (rootTree == null) {
            return null;  // No valid root found
        }

        // Remove the root tree from valueToTree so we don't reattach it
        valueToTree.remove(rootTree.val);
        Set<Integer> visited = new HashSet<>();

        // Step 3: DFS to merge trees and validate
        dfs(rootTree, Integer.MIN_VALUE, Integer.MAX_VALUE, visited);

        // Step 4: Final validation
        // Check if all trees were used (valueToTree should be empty)
        // Add 1 for the root tree which we removed earlier
        if (!isValid || !valueToTree.isEmpty() || visited.size() + 1 != trees.size()) {
            return null;
        }

        return rootTree;
    }

    private void dfs(TreeNode node, int minVal, int maxVal, Set<Integer> visited) {
        // DFS to attach subtrees and validate BST properties
        if (node == null || !isValid) {
            return;
        }

        // Check BST bounds (use long to handle Integer.MIN_VALUE/MAX_VALUE cases)
        if (!((long)node.val > minVal && (long)node.val < maxVal)) {
            isValid = false;
            return;
        }

        // If this node's value exists in another tree, attach that tree
        if (valueToTree.containsKey(node.val)) {
            // Get the tree to attach
            TreeNode subtree = valueToTree.get(node.val);
            valueToTree.remove(node.val);
            visited.add(node.val);

            // Attach left and right children from the subtree
            node.left = subtree.left;
            node.right = subtree.right;

            // Check for cycles (shouldn't happen with proper child counts)
            if (visited.contains(subtree.val)) {
                isValid = false;
                return;
            }
        }

        // Recursively process children with updated BST bounds
        if (node.left != null) {
            dfs(node.left, minVal, node.val, visited);
        }
        if (node.right != null) {
            dfs(node.right, node.val, maxVal, visited);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building value-to-tree map: O(n) where n is total nodes
- Counting child occurrences: O(n)
- Finding root: O(t) where t is number of trees (≤ n)
- DFS traversal: O(n) - each node visited once
- Total: O(n) linear in total number of nodes

**Space Complexity: O(n)**

- `value_to_tree` map: O(t) where t is number of trees (≤ n)
- `child_count` map: O(n) for all unique values
- Recursion stack: O(h) where h is height of final tree (≤ n)
- `visited` set: O(t) (≤ n)
- Total: O(n) linear in total number of nodes

## Common Mistakes

1. **Forgetting to check for multiple roots**: Candidates often find a root but don't verify it's the ONLY value with 0 child count. If multiple roots exist, merging is impossible.

2. **Not verifying all trees are used**: After DFS, you must check that `value_to_tree` is empty (except the root). Otherwise, some trees weren't connected.

3. **Incorrect BST validation during merge**: When attaching a subtree, you must validate that the entire subtree respects BST properties relative to its parent, not just the root value.

4. **Missing cycle detection**: While proper child counting prevents cycles, it's good practice to check for them explicitly. A cycle would cause infinite recursion.

5. **Handling integer bounds incorrectly**: When using `Integer.MIN_VALUE` and `Integer.MAX_VALUE` as initial bounds in Java, be careful with arithmetic. Use `long` for comparisons to avoid overflow.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Graph connectivity with unique mapping**: Similar to problems where you need to connect components with matching interfaces. Related problems:
   - [LeetCode 721: Accounts Merge](https://leetcode.com/problems/accounts-merge/) - merging accounts with common emails
   - [LeetCode 684: Redundant Connection](https://leetcode.com/problems/redundant-connection/) - finding connections that create cycles

2. **BST validation during construction**: The DFS with min/max bounds pattern appears in:
   - [LeetCode 98: Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)
   - [LeetCode 1008: Construct Binary Search Tree from Preorder Traversal](https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/)

3. **Tree merging/restructuring**: Similar to problems that require rebuilding trees:
   - [LeetCode 894: All Possible Full Binary Trees](https://leetcode.com/problems/all-possible-full-binary-trees/) - constructing trees from smaller components

## Key Takeaways

1. **When values are unique, maps are powerful**: Use value-to-node maps to quickly connect components in tree/graph problems.

2. **Validate as you build**: For BST construction problems, it's more efficient to validate properties during construction rather than building then validating.

3. **Constraints guide the solution**: The ≤3 nodes constraint is critical—it means each tree has simple attachment points. Always look for such simplifying constraints.

4. **Count parents/children for connectivity**: Tracking in-degree/out-degree helps find roots and detect invalid structures in tree assembly problems.

[Practice this problem on CodeJeet](/problem/merge-bsts-to-create-single-bst)
