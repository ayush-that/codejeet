---
title: "How to Solve Binary Tree Paths — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Binary Tree Paths. Easy difficulty, 68.2% acceptance rate. Topics: String, Backtracking, Tree, Depth-First Search, Binary Tree."
date: "2026-10-20"
category: "dsa-patterns"
tags: ["binary-tree-paths", "string", "backtracking", "tree", "easy"]
---

# How to Solve Binary Tree Paths

This problem asks us to find all root-to-leaf paths in a binary tree and return them as strings. While conceptually straightforward, it requires careful handling of tree traversal, path tracking, and string building. The interesting challenge lies in efficiently building paths without unnecessary string copying, and understanding when we've reached a leaf node.

## Visual Walkthrough

Let's trace through a simple example: `root = [1,2,3,null,5]`

```
    1
   / \
  2   3
   \
    5
```

**Step 1:** Start at root node 1. Current path: "1"

**Step 2:** Explore left child 2. Append "->2" to path: "1->2"

**Step 3:** Node 2 has no left child, so we skip that branch.

**Step 4:** Explore right child 5. Append "->5" to path: "1->2->5"

**Step 5:** Node 5 is a leaf (no children), so we add "1->2->5" to our result list.

**Step 6:** Backtrack to node 2, then to node 1. Reset path to "1"

**Step 7:** Explore right child 3. Append "->3" to path: "1->3"

**Step 8:** Node 3 is a leaf (no children), so we add "1->3" to our result list.

**Final result:** `["1->2->5", "1->3"]`

## Brute Force Approach

For this problem, there's no "brute force" in the traditional sense of trying all possible combinations, since we must traverse the entire tree anyway. However, a naive approach would be to:

1. Traverse the tree using any method (DFS, BFS)
2. For each node, store the complete path from root to that node
3. When reaching a leaf, add the complete path to results

The inefficiency comes from how we handle the paths. A naive implementation might:

- Create a new string at each node by concatenating the current path with the new node value
- This creates O(n²) string copying operations in the worst case (for a skewed tree)

While this approach would technically work and have the same time complexity as the optimal solution, it would have worse space complexity due to excessive string copying.

## Optimal Solution

The optimal solution uses Depth-First Search (DFS) with backtracking. We traverse the tree recursively, maintaining a current path as we go. When we reach a leaf node, we convert the current path to a string and add it to our results. The key optimization is using a mutable list to track the path and only converting it to a string when we find a leaf.

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

# Time: O(n) where n is the number of nodes in the tree
# Space: O(h) where h is the height of the tree (call stack + path list)
class Solution:
    def binaryTreePaths(self, root: Optional[TreeNode]) -> List[str]:
        # Initialize result list to store all paths
        result = []

        # Edge case: if tree is empty, return empty list
        if not root:
            return result

        # Helper function for DFS traversal
        def dfs(node, path):
            # Add current node's value to the path
            path.append(str(node.val))

            # Check if current node is a leaf (no children)
            if not node.left and not node.right:
                # Join path elements with "->" and add to results
                result.append("->".join(path))
            else:
                # If left child exists, recursively traverse left subtree
                if node.left:
                    dfs(node.left, path)
                # If right child exists, recursively traverse right subtree
                if node.right:
                    dfs(node.right, path)

            # Backtrack: remove current node from path before returning
            # This is crucial for reusing the same path list
            path.pop()

        # Start DFS from root with empty path
        dfs(root, [])
        return result
```

```javascript
// Definition for a binary tree node.
// function TreeNode(val, left, right) {
//     this.val = (val===undefined ? 0 : val)
//     this.left = (left===undefined ? null : left)
//     this.right = (right===undefined ? null : right)
// }

// Time: O(n) where n is the number of nodes in the tree
// Space: O(h) where h is the height of the tree (call stack + path array)
/**
 * @param {TreeNode} root
 * @return {string[]}
 */
var binaryTreePaths = function (root) {
  // Initialize result array to store all paths
  const result = [];

  // Edge case: if tree is empty, return empty array
  if (!root) {
    return result;
  }

  // Helper function for DFS traversal
  function dfs(node, path) {
    // Add current node's value to the path
    path.push(node.val.toString());

    // Check if current node is a leaf (no children)
    if (!node.left && !node.right) {
      // Join path elements with "->" and add to results
      result.push(path.join("->"));
    } else {
      // If left child exists, recursively traverse left subtree
      if (node.left) {
        dfs(node.left, path);
      }
      // If right child exists, recursively traverse right subtree
      if (node.right) {
        dfs(node.right, path);
      }
    }

    // Backtrack: remove current node from path before returning
    // This is crucial for reusing the same path array
    path.pop();
  }

  // Start DFS from root with empty path
  dfs(root, []);
  return result;
};
```

```java
// Definition for a binary tree node.
// public class TreeNode {
//     int val;
//     TreeNode left;
//     TreeNode right;
//     TreeNode() {}
//     TreeNode(int val) { this.val = val; }
//     TreeNode(int val, TreeNode left, TreeNode right) {
//         this.val = val;
//         this.left = left;
//         this.right = right;
//     }
// }

// Time: O(n) where n is the number of nodes in the tree
// Space: O(h) where h is the height of the tree (call stack + path list)
class Solution {
    public List<String> binaryTreePaths(TreeNode root) {
        // Initialize result list to store all paths
        List<String> result = new ArrayList<>();

        // Edge case: if tree is empty, return empty list
        if (root == null) {
            return result;
        }

        // Start DFS from root with empty path
        dfs(root, new ArrayList<>(), result);
        return result;
    }

    private void dfs(TreeNode node, List<String> path, List<String> result) {
        // Add current node's value to the path
        path.add(Integer.toString(node.val));

        // Check if current node is a leaf (no children)
        if (node.left == null && node.right == null) {
            // Join path elements with "->" and add to results
            result.add(String.join("->", path));
        } else {
            // If left child exists, recursively traverse left subtree
            if (node.left != null) {
                dfs(node.left, path, result);
            }
            // If right child exists, recursively traverse right subtree
            if (node.right != null) {
                dfs(node.right, path, result);
            }
        }

        // Backtrack: remove current node from path before returning
        // This is crucial for reusing the same path list
        path.remove(path.size() - 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the DFS traversal
- For each leaf node, we join the path elements which takes O(h) time, but since there are at most n/2 leaves in a binary tree, the total time for string joining is O(n × h) in the worst case
- However, a more precise analysis shows that each node's value appears in the path of all its descendants, leading to O(n²) string operations in the worst case for a skewed tree
- With the backtracking approach using a mutable list, we avoid repeated string concatenation, making it effectively O(n)

**Space Complexity: O(h)** where h is the height of the tree

- The recursion call stack uses O(h) space
- The path list also uses O(h) space at any point in time
- In the worst case (skewed tree), h = n, so space complexity is O(n)
- In the best case (balanced tree), h = log n, so space complexity is O(log n)
- The result list stores all paths, which takes O(n × h) space, but this is output space and usually not counted in space complexity analysis

## Common Mistakes

1. **Forgetting to handle the empty tree case**: Always check if root is null at the beginning. An empty tree should return an empty list, not null or cause an error.

2. **Not converting node values to strings**: When building the path, node values are integers but we need strings for the final output. Forgetting to convert them will cause type errors when joining.

3. **Missing the backtracking step (path.pop())**: This is the most common mistake. Without removing the current node from the path after processing its children, the path will keep growing incorrectly. Each recursive call must clean up after itself.

4. **Checking for leaf nodes incorrectly**: A leaf node has BOTH left and right children as null. Checking only one child (e.g., `if not node.left`) is incorrect because a node with only a right child is not a leaf.

5. **Using string concatenation instead of list with backtracking**: Building strings by concatenation at each node creates new strings, leading to O(n²) time complexity for skewed trees. Using a list and joining only at leaves is more efficient.

## When You'll See This Pattern

This DFS with backtracking pattern appears in many tree problems where you need to track paths or sequences:

1. **Path Sum II (LeetCode 113)**: Find all root-to-leaf paths where the sum equals a target. The pattern is identical—track the path and check the sum at leaves.

2. **Smallest String Starting From Leaf (LeetCode 988)**: Find the lexicographically smallest string from leaf to root. This reverses the direction but uses the same path tracking.

3. **Step-By-Step Directions From a Binary Tree Node to Another (LeetCode 2096)**: Find the path between two nodes, which requires finding paths from root to each node then manipulating them.

4. **Binary Tree Paths to Sum (variations)**: Any problem asking for paths with specific properties (sum, sequence, etc.) uses this same DFS backtracking approach.

## Key Takeaways

1. **DFS with backtracking is the standard approach for path problems in trees**: When you need to track the path from root to current node, use a mutable data structure (list/array) and remove elements when backtracking.

2. **Only convert to final format at leaf nodes**: To avoid expensive string operations at every step, keep the path in an efficient format (list of values or strings) and only create the final string representation when you've found a complete path.

3. **The leaf check is critical**: Remember that a leaf node has no children (both left and right are null). This termination condition determines when to save a complete path.

Related problems: [Path Sum II](/problem/path-sum-ii), [Smallest String Starting From Leaf](/problem/smallest-string-starting-from-leaf), [Step-By-Step Directions From a Binary Tree Node to Another](/problem/step-by-step-directions-from-a-binary-tree-node-to-another)
