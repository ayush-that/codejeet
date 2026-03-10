---
title: "How to Solve Delete Nodes And Return Forest — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Delete Nodes And Return Forest. Medium difficulty, 72.5% acceptance rate. Topics: Array, Hash Table, Tree, Depth-First Search, Binary Tree."
date: "2027-08-14"
category: "dsa-patterns"
tags: ["delete-nodes-and-return-forest", "array", "hash-table", "tree", "medium"]
---

# How to Solve Delete Nodes And Return Forest

This problem asks us to delete specific nodes from a binary tree and return the roots of all resulting trees (a forest). The tricky part is that when we delete a node, its children become separate trees in the forest, but we need to properly disconnect them from their parent while also ensuring we don't lose track of any new tree roots.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Tree:**

```
        1
       / \
      2   3
     / \   \
    4   5   6
```

**to_delete:** [3, 5]

**Step-by-step deletion:**

1. Start at root (1). It's not in to_delete, so it remains a potential forest root.
2. Check left child (2). Not in to_delete.
3. Check left child of 2 (4). Not in to_delete.
4. Check right child of 2 (5). **5 is in to_delete**, so we delete it:
   - Before deletion: 2 → 5
   - After deletion: 2 → null, and 5's children (none) become separate trees
   - Since 5 had no children, no new trees are added
5. Check right child of 1 (3). **3 is in to_delete**, so we delete it:
   - Before deletion: 1 → 3 → 6
   - After deletion: 1 → null, and 3's children (6) become a separate tree
   - 6 is added as a new forest root
6. Final forest has roots: [1, 6] (and technically 4, but it's part of 1's tree)

The key insight: We need to traverse the tree and whenever we encounter a node to delete, we should:

1. Add its non-null children to the forest
2. Return null to its parent (disconnecting it)
3. If the current node isn't being deleted and has no parent (or its parent was deleted), add it to the forest

## Brute Force Approach

A naive approach might be:

1. Collect all nodes in the tree via BFS/DFS
2. For each node in to_delete, remove it and add its children to a list
3. Try to reconstruct the forest from the remaining nodes

**Why this fails:**

- We lose the tree structure when collecting nodes individually
- Reconstructing parent-child relationships is complex
- We might miss nodes that become roots when their parent is deleted
- The time complexity would be O(n²) in worst case as we'd need to search for parent-child relationships

The fundamental issue is that we're thinking about the tree as a collection of nodes rather than maintaining the hierarchical structure during traversal.

## Optimized Approach

The key insight is to use **post-order DFS traversal** (process children before parent) with these rules:

1. **Base case:** If node is null, return null
2. **Recursively process children:** Get the "new" left and right children after processing subtrees
3. **Check if current node should be deleted:**
   - If YES: Add non-null children to the forest, return null (telling parent this node is gone)
   - If NO: Return the current node (with potentially updated children)
4. **Special case for root:** If the root isn't deleted and we're at the top level, add it to the forest

**Why post-order works:**

- We need to know if children become separate trees before deciding what to do with the parent
- By processing children first, we know which subtrees need to be added to the forest
- The return value tells the parent whether this child still exists

**Data structure choice:**

- Use a set for `to_delete` for O(1) lookups
- Maintain a list for the forest roots
- The recursion stack handles the traversal

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(h + m) where h is tree height (recursion stack) and m is size of to_delete
class Solution:
    def delNodes(self, root: Optional[TreeNode], to_delete: List[int]) -> List[TreeNode]:
        # Convert to_delete to set for O(1) lookups
        to_delete_set = set(to_delete)
        forest = []

        def dfs(node, has_parent):
            """
            Process subtree rooted at 'node'.
            has_parent: True if node has a parent that wasn't deleted
            Returns: The node after processing (or None if deleted)
            """
            if not node:
                return None

            # Recursively process children first (post-order traversal)
            # Children's parent status depends on whether current node will be deleted
            left_result = dfs(node.left, not node.val in to_delete_set)
            right_result = dfs(node.right, not node.val in to_delete_set)

            # Update node's children with processed results
            node.left = left_result
            node.right = right_result

            # Check if current node should be deleted
            if node.val in to_delete_set:
                # Add non-null children to forest
                if left_result:
                    forest.append(left_result)
                if right_result:
                    forest.append(right_result)
                # Return None to parent (this node is deleted)
                return None
            else:
                # Current node stays
                if not has_parent:
                    # If no parent (or parent was deleted), add to forest
                    forest.append(node)
                return node

        # Start DFS from root (no parent initially)
        dfs(root, False)
        return forest
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(h + m) where h is tree height (recursion stack) and m is size of to_delete
function delNodes(root, to_delete) {
  // Convert to_delete to set for O(1) lookups
  const toDeleteSet = new Set(to_delete);
  const forest = [];

  /**
   * Process subtree rooted at 'node'.
   * @param {TreeNode} node - Current node
   * @param {boolean} hasParent - True if node has a parent that wasn't deleted
   * @returns {TreeNode|null} - The node after processing (or null if deleted)
   */
  function dfs(node, hasParent) {
    if (!node) {
      return null;
    }

    // Recursively process children first (post-order traversal)
    // Children's parent status depends on whether current node will be deleted
    const leftResult = dfs(node.left, !toDeleteSet.has(node.val));
    const rightResult = dfs(node.right, !toDeleteSet.has(node.val));

    // Update node's children with processed results
    node.left = leftResult;
    node.right = rightResult;

    // Check if current node should be deleted
    if (toDeleteSet.has(node.val)) {
      // Add non-null children to forest
      if (leftResult) {
        forest.push(leftResult);
      }
      if (rightResult) {
        forest.push(rightResult);
      }
      // Return null to parent (this node is deleted)
      return null;
    } else {
      // Current node stays
      if (!hasParent) {
        // If no parent (or parent was deleted), add to forest
        forest.push(node);
      }
      return node;
    }
  }

  // Start DFS from root (no parent initially)
  dfs(root, false);
  return forest;
}
```

```java
// Time: O(n) where n is number of nodes
// Space: O(h + m) where h is tree height (recursion stack) and m is size of to_delete
class Solution {
    public List<TreeNode> delNodes(TreeNode root, int[] to_delete) {
        // Convert to_delete to set for O(1) lookups
        Set<Integer> toDeleteSet = new HashSet<>();
        for (int val : to_delete) {
            toDeleteSet.add(val);
        }

        List<TreeNode> forest = new ArrayList<>();

        // Start DFS from root (no parent initially)
        dfs(root, false, toDeleteSet, forest);
        return forest;
    }

    /**
     * Process subtree rooted at 'node'.
     * @param node - Current node
     * @param hasParent - True if node has a parent that wasn't deleted
     * @param toDeleteSet - Set of values to delete
     * @param forest - List to collect forest roots
     * @return The node after processing (or null if deleted)
     */
    private TreeNode dfs(TreeNode node, boolean hasParent,
                         Set<Integer> toDeleteSet, List<TreeNode> forest) {
        if (node == null) {
            return null;
        }

        // Recursively process children first (post-order traversal)
        // Children's parent status depends on whether current node will be deleted
        TreeNode leftResult = dfs(node.left, !toDeleteSet.contains(node.val),
                                  toDeleteSet, forest);
        TreeNode rightResult = dfs(node.right, !toDeleteSet.contains(node.val),
                                   toDeleteSet, forest);

        // Update node's children with processed results
        node.left = leftResult;
        node.right = rightResult;

        // Check if current node should be deleted
        if (toDeleteSet.contains(node.val)) {
            // Add non-null children to forest
            if (leftResult != null) {
                forest.add(leftResult);
            }
            if (rightResult != null) {
                forest.add(rightResult);
            }
            // Return null to parent (this node is deleted)
            return null;
        } else {
            // Current node stays
            if (!hasParent) {
                // If no parent (or parent was deleted), add to forest
                forest.add(node);
            }
            return node;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the DFS traversal
- Set operations (checking if a value is in to_delete) are O(1) on average
- No nested loops or repeated traversals

**Space Complexity: O(h + m)**

- **O(h):** Recursion stack depth, where h is the height of the tree
  - Worst case (skewed tree): O(n)
  - Best case (balanced tree): O(log n)
- **O(m):** Storage for the to_delete set, where m is the number of nodes to delete
- **O(k):** Output storage for forest roots (not counted in auxiliary space)

## Common Mistakes

1. **Using pre-order traversal instead of post-order:** If you check whether to delete a node before processing its children, you might add children to the forest before knowing if they themselves will be deleted. Always process children first.

2. **Forgetting to update parent references:** When a node is deleted, you must set the parent's child pointer to null. In the code, this happens when we return null to the parent.

3. **Not handling the root specially:** The root node has no parent, so if it's not deleted, it should always be added to the forest. The `has_parent` parameter tracks this.

4. **Adding deleted nodes' children incorrectly:** Only add children to the forest if they're not null. A deleted leaf node has no children to add.

5. **Using list instead of set for to_delete:** Checking if a value is in a list is O(n), making the overall solution O(n²). Always convert to a set for O(1) lookups.

## When You'll See This Pattern

This "tree modification with conditional processing" pattern appears in several tree problems:

1. **Trim a Binary Search Tree (LeetCode 669):** Remove nodes outside a range. Similar post-order approach where you process children and decide what to return to parent.

2. **Binary Tree Pruning (LeetCode 814):** Remove subtrees that don't contain 1s. Same post-order pattern: process children, decide if current subtree should be kept.

3. **Split BST (LeetCode 776):** Split a BST into two trees based on a value. While not identical, it uses similar tree restructuring logic.

The common theme is **bottom-up processing** where you need information from children to make decisions about the parent, often involving tree restructuring or pruning.

## Key Takeaways

1. **Post-order traversal is key for parent-dependent decisions:** When a node's fate depends on its children's states (or vice versa), process children first using DFS post-order.

2. **Use return values to communicate with parents:** In tree recursion, the return value can tell the parent what the child subtree looks like after processing.

3. **Track parent status explicitly:** When you need to know if a node is a root (has no parent in the final forest), pass a parameter tracking this information through the recursion.

4. **Always optimize lookups:** Convert lists to sets when you need frequent membership checks to avoid O(n) lookups in an O(n) algorithm.

Related problems: [Count Nodes With the Highest Score](/problem/count-nodes-with-the-highest-score)
