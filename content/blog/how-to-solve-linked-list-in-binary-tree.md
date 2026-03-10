---
title: "How to Solve Linked List in Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Linked List in Binary Tree. Medium difficulty, 51.9% acceptance rate. Topics: Linked List, Tree, Depth-First Search, Binary Tree."
date: "2028-09-06"
category: "dsa-patterns"
tags: ["linked-list-in-binary-tree", "linked-list", "tree", "depth-first-search", "medium"]
---

# How to Solve Linked List in Binary Tree

This problem asks whether a linked list exists as a downward path in a binary tree. The tricky part is that the linked list can start at **any node** in the tree and must follow a **downward path** (parent to child connections only). This means we need to check every possible starting point and every possible continuation path.

## Visual Walkthrough

Let's trace through an example:

**Binary Tree:**

```
        1
       / \
      4   4
     /   /
    2   2
   /   / \
  1   6   8
```

**Linked List:** `4 → 2 → 8`

**Step-by-step check:**

1. Start at root (1): Doesn't match linked list head (4) → move on
2. Check left child of root (4): Matches linked list head!
   - Now check if `2 → 8` exists downward from here
   - Check left child (2): Matches second node (2)
     - Check left child (1): Doesn't match third node (8) → fail
     - No right child → fail this path
   - No right child from the first 4 → fail starting at this node
3. Check right child of root (4): Matches linked list head!
   - Check if `2 → 8` exists downward from here
   - Check left child (2): Matches second node (2)
     - Check left child (6): Doesn't match third node (8) → fail
     - Check right child (8): Matches third node (8) → SUCCESS!

The key insight: We need to check **every node** as a potential starting point, and from each starting point, we need to check if the **entire linked list** matches going downward.

## Brute Force Approach

The brute force approach would be to:

1. For every node in the tree, check if it matches the head of the linked list
2. If it does, try to match the entire linked list from that point downward
3. Return true if any starting point yields a complete match

The naive implementation might use nested recursion or BFS to check all starting points, then for each starting point, traverse both the tree and linked list together.

**Why this is inefficient:** While this approach would work, the implementation can be messy with nested recursion. More importantly, candidates often fail to realize they need to handle the case where the starting node matches but then the path diverges - they need to backtrack and try other starting points.

## Optimized Approach

The key insight is that we need **two types of searches**:

1. **DFS to find starting points**: Traverse the tree to find nodes that match the linked list head
2. **DFS to verify paths**: From each potential starting point, traverse downward to verify if the entire linked list matches

We can solve this with **two recursive functions**:

- `dfs_find_start(node)`: Searches the tree for nodes matching the linked list head
- `dfs_match_path(tree_node, list_node)`: Checks if the linked list starting at `list_node` exists as a downward path from `tree_node`

The optimization comes from **early termination**:

- In `dfs_match_path`, if at any point the tree node doesn't match the current list node, we return false immediately
- In `dfs_find_start`, we check both children even if one path seems promising, because the linked list might start at different nodes

## Optimal Solution

The solution uses DFS with two helper functions. We traverse the tree looking for starting points, and from each starting point, we try to match the entire linked list.

<div class="code-group">

```python
# Time: O(N * min(L, H)) where N is tree nodes, L is list length, H is tree height
# Space: O(H) for recursion stack where H is tree height
class Solution:
    def isSubPath(self, head: ListNode, root: TreeNode) -> bool:
        # Helper function to check if linked list exists from current tree node
        def dfs_match(tree_node: TreeNode, list_node: ListNode) -> bool:
            # If we've reached end of linked list, we found a complete match
            if not list_node:
                return True
            # If tree node is null or values don't match, this path fails
            if not tree_node or tree_node.val != list_node.val:
                return False
            # Continue checking: either left or right child must match next list node
            return (dfs_match(tree_node.left, list_node.next) or
                    dfs_match(tree_node.right, list_node.next))

        # Helper function to traverse tree and find starting points
        def dfs_find_start(tree_node: TreeNode) -> bool:
            # If tree node is null, no path exists from here
            if not tree_node:
                return False
            # Check if linked list starts at current node
            if dfs_match(tree_node, head):
                return True
            # If not, check left and right subtrees for other starting points
            return (dfs_find_start(tree_node.left) or
                    dfs_find_start(tree_node.right))

        # Start search from root of the tree
        return dfs_find_start(root)
```

```javascript
// Time: O(N * min(L, H)) where N is tree nodes, L is list length, H is tree height
// Space: O(H) for recursion stack where H is tree height
var isSubPath = function (head, root) {
  // Helper function to check if linked list exists from current tree node
  const dfsMatch = (treeNode, listNode) => {
    // If we've reached end of linked list, we found a complete match
    if (!listNode) return true;
    // If tree node is null or values don't match, this path fails
    if (!treeNode || treeNode.val !== listNode.val) return false;
    // Continue checking: either left or right child must match next list node
    return dfsMatch(treeNode.left, listNode.next) || dfsMatch(treeNode.right, listNode.next);
  };

  // Helper function to traverse tree and find starting points
  const dfsFindStart = (treeNode) => {
    // If tree node is null, no path exists from here
    if (!treeNode) return false;
    // Check if linked list starts at current node
    if (dfsMatch(treeNode, head)) return true;
    // If not, check left and right subtrees for other starting points
    return dfsFindStart(treeNode.left) || dfsFindStart(treeNode.right);
  };

  // Start search from root of the tree
  return dfsFindStart(root);
};
```

```java
// Time: O(N * min(L, H)) where N is tree nodes, L is list length, H is tree height
// Space: O(H) for recursion stack where H is tree height
class Solution {
    public boolean isSubPath(ListNode head, TreeNode root) {
        // Start search from root of the tree
        return dfsFindStart(root, head);
    }

    // Helper function to traverse tree and find starting points
    private boolean dfsFindStart(TreeNode treeNode, ListNode head) {
        // If tree node is null, no path exists from here
        if (treeNode == null) return false;
        // Check if linked list starts at current node
        if (dfsMatch(treeNode, head)) return true;
        // If not, check left and right subtrees for other starting points
        return dfsFindStart(treeNode.left, head) ||
               dfsFindStart(treeNode.right, head);
    }

    // Helper function to check if linked list exists from current tree node
    private boolean dfsMatch(TreeNode treeNode, ListNode listNode) {
        // If we've reached end of linked list, we found a complete match
        if (listNode == null) return true;
        // If tree node is null or values don't match, this path fails
        if (treeNode == null || treeNode.val != listNode.val) return false;
        // Continue checking: either left or right child must match next list node
        return dfsMatch(treeNode.left, listNode.next) ||
               dfsMatch(treeNode.right, listNode.next);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(N × min(L, H))

- N: Number of nodes in the tree (we visit each node once in `dfs_find_start`)
- For each node, in the worst case we might traverse min(L, H) nodes in `dfs_match`
  - L: Length of the linked list (we stop when we reach the end)
  - H: Height of the tree (we can only go as deep as the tree allows)
- The min(L, H) factor comes from the fact that we can't traverse deeper than the tree height or longer than the list length

**Space Complexity:** O(H)

- H: Height of the tree (recursion stack depth)
- In the worst case (skewed tree), H = N, giving O(N) space
- In the best case (balanced tree), H = log N

## Common Mistakes

1. **Not checking all starting points**: Candidates find one potential starting point and only check downward from there, forgetting that the linked list might start at a different node.

2. **Continuing after mismatch in `dfs_match`**: In the path verification, if a node doesn't match, we must return false immediately. Some candidates continue checking other paths from that mismatch point.

3. **Confusing tree traversal with path matching**: Using the same recursive function for both finding starting points and verifying paths leads to complex logic errors. The two-phase approach is cleaner.

4. **Forgetting that paths must be downward**: Some candidates try to match paths that go upward or sideways. Remember: once you start matching, you can only go from parent to child.

## When You'll See This Pattern

This "substructure matching" pattern appears in several tree and graph problems:

1. **Subtree of Another Tree (LeetCode 572)**: Similar concept but requires matching entire subtrees rather than just paths.

2. **Path Sum III (LeetCode 437)**: Finding paths that sum to a target value, where paths don't need to start at root or end at leaf.

3. **Binary Tree Cameras (LeetCode 968)**: Uses similar DFS with state tracking to determine camera placement.

The core technique is **DFS with multiple recursive responsibilities** - one to explore the search space and another to verify a candidate solution.

## Key Takeaways

1. **Two-phase DFS is powerful**: When you need to check multiple starting points, use one DFS to find candidates and another to verify them.

2. **Tree + List traversal requires careful synchronization**: When traversing two data structures together, ensure your recursion handles both structures' null conditions properly.

3. **Early termination optimizes search**: Return as soon as you know a path won't work to avoid unnecessary computation.

[Practice this problem on CodeJeet](/problem/linked-list-in-binary-tree)
