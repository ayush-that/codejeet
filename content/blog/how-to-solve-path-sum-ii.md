---
title: "How to Solve Path Sum II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Path Sum II. Medium difficulty, 61.8% acceptance rate. Topics: Backtracking, Tree, Depth-First Search, Binary Tree."
date: "2026-09-15"
category: "dsa-patterns"
tags: ["path-sum-ii", "backtracking", "tree", "depth-first-search", "medium"]
---

# How to Solve Path Sum II

Path Sum II asks us to find all root-to-leaf paths in a binary tree where the sum of node values equals a given target. What makes this problem interesting is that we need to find **all** valid paths, not just determine if one exists. This requires exploring the entire tree while efficiently tracking paths and their sums.

## Visual Walkthrough

Let's trace through a concrete example:

```
Tree:
       5
      / \
     4   8
    /   / \
   11  13  4
  /  \    / \
 7    2  5   1

Target: 22
```

We need to find all root-to-leaf paths where the sum equals 22.

**Path 1:**

- Start at root: 5 (current sum = 5)
- Go left to 4 (current sum = 9)
- Go left to 11 (current sum = 20)
- Go left to 7 (current sum = 27) → Not a leaf, continue
- Go right to 2 (current sum = 22) → Leaf node! Found path: [5, 4, 11, 2]

**Path 2:**

- Backtrack to 11, then to 4, then to root 5
- From root 5, go right to 8 (current sum = 13)
- Go left to 13 (current sum = 26) → Not a leaf, continue
- Go right to 4 (current sum = 30) → Not a leaf, continue
- Go left to 5 (current sum = 35) → Leaf node! Sum ≠ 22
- Backtrack to 4, go right to 1 (current sum = 22) → Leaf node! Found path: [5, 8, 4, 1]

**Result:** [[5, 4, 11, 2], [5, 8, 4, 1]]

The key insight: we need to explore all paths from root to leaves while tracking both the current path and its sum.

## Brute Force Approach

A naive approach might try to:

1. Generate all root-to-leaf paths
2. For each path, calculate its sum
3. Keep only those with sum equal to target

While this would work, it's inefficient because:

- We'd store all paths separately, using O(n²) space in worst case (when tree is a linked list)
- We'd recalculate sums for overlapping paths
- We'd need to traverse the tree multiple times

The better approach is to use DFS with backtracking, which allows us to:

- Track the current path as we go
- Update the running sum incrementally
- Reuse the same path list by adding/removing nodes

## Optimized Approach

The optimal solution uses Depth-First Search (DFS) with backtracking:

1. **DFS Traversal**: We traverse from root to leaves, exploring each path completely
2. **Path Tracking**: Maintain a current path list as we traverse
3. **Sum Tracking**: Keep a running sum instead of recalculating from scratch
4. **Backtracking**: When we finish exploring a subtree, remove the last node from the path before exploring other branches
5. **Result Collection**: When we reach a leaf node with matching sum, save a copy of the current path

**Why backtracking works:**

- We use the same list object to track the current path
- Before exploring a child, we add the child to the path
- After exploring the child (and all its descendants), we remove it
- This ensures the path list always represents the current traversal path

**Key conditions:**

- Only add to result when we're at a **leaf node** (both children are null)
- Must make a copy of the path when adding to results (otherwise subsequent modifications affect saved paths)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - We visit each node once
# Space: O(h) - Where h is the height of the tree (for recursion stack and path list)
class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> List[List[int]]:
        def dfs(node, current_sum, path):
            if not node:
                return

            # Add current node to the path and update sum
            path.append(node.val)
            current_sum += node.val

            # Check if we're at a leaf node with matching sum
            if not node.left and not node.right and current_sum == targetSum:
                # IMPORTANT: Make a copy of the path before adding to results
                result.append(list(path))

            # Recursively explore left and right subtrees
            dfs(node.left, current_sum, path)
            dfs(node.right, current_sum, path)

            # Backtrack: remove current node from path before returning to parent
            path.pop()

        result = []
        dfs(root, 0, [])
        return result
```

```javascript
// Time: O(n) - We visit each node once
// Space: O(h) - Where h is the height of the tree (for recursion stack and path array)
var pathSum = function (root, targetSum) {
  const result = [];

  function dfs(node, currentSum, path) {
    if (!node) return;

    // Add current node to the path and update sum
    path.push(node.val);
    currentSum += node.val;

    // Check if we're at a leaf node with matching sum
    if (!node.left && !node.right && currentSum === targetSum) {
      // IMPORTANT: Make a copy of the path before adding to results
      result.push([...path]);
    }

    // Recursively explore left and right subtrees
    dfs(node.left, currentSum, path);
    dfs(node.right, currentSum, path);

    // Backtrack: remove current node from path before returning to parent
    path.pop();
  }

  dfs(root, 0, []);
  return result;
};
```

```java
// Time: O(n) - We visit each node once
// Space: O(h) - Where h is the height of the tree (for recursion stack and path list)
class Solution {
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        dfs(root, targetSum, 0, path, result);
        return result;
    }

    private void dfs(TreeNode node, int targetSum, int currentSum,
                     List<Integer> path, List<List<Integer>> result) {
        if (node == null) return;

        // Add current node to the path and update sum
        path.add(node.val);
        currentSum += node.val;

        // Check if we're at a leaf node with matching sum
        if (node.left == null && node.right == null && currentSum == targetSum) {
            // IMPORTANT: Make a copy of the path before adding to results
            result.add(new ArrayList<>(path));
        }

        // Recursively explore left and right subtrees
        dfs(node.left, targetSum, currentSum, path, result);
        dfs(node.right, targetSum, currentSum, path, result);

        // Backtrack: remove current node from path before returning to parent
        path.remove(path.size() - 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the DFS traversal
- At each node, we perform O(1) operations (add to path, check conditions, recursive calls)
- When we find a valid path, copying it takes O(h) time, but in the worst case this happens O(n/h) times, so total remains O(n)

**Space Complexity: O(h)** where h is the height of the tree

- Recursion stack uses O(h) space in worst case (when tree is skewed)
- The `path` list also uses O(h) space at maximum
- Result storage is not counted in auxiliary space complexity, but note that storing all paths could take O(n²) in output space for a balanced tree

**Worst-case space: O(n)** when the tree is completely skewed (linked list)

## Common Mistakes

1. **Not making a copy of the path when adding to results**
   - If you do `result.append(path)` instead of `result.append(list(path))` in Python (or similar in other languages), all entries in `result` will reference the same list object
   - When you backtrack and modify `path`, all saved paths in `result` get modified too
   - **Fix:** Always create a new list copy when saving a valid path

2. **Forgetting to check for leaf nodes**
   - Some candidates check `current_sum == targetSum` at any node, not just leaves
   - The problem specifically asks for **root-to-leaf** paths
   - **Fix:** Add condition `if not node.left and not node.right` before checking the sum

3. **Not backtracking properly**
   - Forgetting to `pop()` the current node after exploring its children
   - This causes the path to keep growing incorrectly
   - **Fix:** Ensure every `path.append()` has a corresponding `path.pop()` after recursive calls

4. **Handling null root incorrectly**
   - Returning `[[0]]` or similar when root is null and target is 0
   - Actually, when root is null, there are no paths, so should return empty list
   - **Fix:** Check `if not root: return []` at the beginning or handle in DFS

## When You'll See This Pattern

This DFS + backtracking pattern appears in many tree and graph problems:

1. **Binary Tree Paths (Easy)** - Similar structure but simpler (no sum checking)
2. **Path Sum III (Medium)** - More complex version where paths don't have to start at root or end at leaf
3. **All Paths From Source to Target (Medium)** - Same pattern but on a directed graph instead of a tree
4. **Combination Sum (Medium)** - Similar backtracking pattern but on arrays instead of trees

The core pattern is: **explore all paths, track current state, backtrack when done with a branch**. This is fundamental to many exhaustive search problems.

## Key Takeaways

1. **DFS with backtracking** is the go-to approach for finding all paths in trees
   - Use a mutable container to track the current path
   - Add node when entering, remove when leaving (backtrack)
   - Make copies when saving complete paths

2. **Incremental computation** saves time
   - Track running sum instead of recalculating from scratch
   - This pattern applies to many problems where you need to compute something along a path

3. **Pay attention to problem constraints**
   - "Root-to-leaf" means both children must be null
   - Always check edge cases: empty tree, single node, skewed trees

Remember: The backtracking pattern (add → explore → remove) is a fundamental algorithm technique that appears in trees, graphs, permutations, and combinations problems.

Related problems: [Path Sum](/problem/path-sum), [Binary Tree Paths](/problem/binary-tree-paths), [Path Sum III](/problem/path-sum-iii)
