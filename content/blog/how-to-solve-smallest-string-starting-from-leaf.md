---
title: "How to Solve Smallest String Starting From Leaf — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Smallest String Starting From Leaf. Medium difficulty, 61.1% acceptance rate. Topics: String, Backtracking, Tree, Depth-First Search, Binary Tree."
date: "2028-07-29"
category: "dsa-patterns"
tags: ["smallest-string-starting-from-leaf", "string", "backtracking", "tree", "medium"]
---

# How to Solve Smallest String Starting From Leaf

You're given a binary tree where each node's value (0-25) corresponds to a letter ('a'-'z'). You need to find the lexicographically smallest string that starts at any leaf node and ends at the root. The tricky part is that strings are built from leaf to root (reverse of typical root-to-leaf paths), and you need to compare strings lexicographically to find the smallest one.

## Visual Walkthrough

Let's trace through a simple example to build intuition:

```
Tree:       0
           / \
          1   2
         /   / \
        3   4   5
```

Node values: 0='a', 1='b', 2='c', 3='d', 4='e', 5='f'

**Leaf nodes and their paths to root:**

- Node 3 (value 3='d'): Path: 3 → 1 → 0 → String: "dba"
- Node 4 (value 4='e'): Path: 4 → 2 → 0 → String: "eca"
- Node 5 (value 5='f'): Path: 5 → 2 → 0 → String: "fca"

**Lexicographic comparison:**

- "dba" vs "eca": 'd' < 'e', so "dba" is smaller
- "dba" vs "fca": 'd' < 'f', so "dba" is smallest

Thus, the answer is "dba".

The key insight: We need to explore all root-to-leaf paths, reverse them (since we need leaf-to-root), and find the lexicographically smallest one.

## Brute Force Approach

A naive approach would be:

1. Find all leaf nodes
2. For each leaf, trace the path back to the root
3. Build the string by converting node values to characters
4. Compare all strings to find the smallest

This approach has several inefficiencies:

- Finding leaves requires O(n) traversal
- Tracing each path back to root could be O(n) per leaf in worst case (skewed tree)
- Total time could be O(n²) in worst case
- We're repeatedly traversing the same paths

The main issue is redundant work - we're traversing up from each leaf separately when we could build paths during a single DFS traversal.

## Optimized Approach

The optimal solution uses DFS (Depth-First Search) with backtracking:

**Key Insight:** Instead of finding leaves first then tracing back, we can build paths from root to leaves during DFS. When we reach a leaf, we have the complete path from root to leaf. We then:

1. Reverse this path (since we need leaf-to-root)
2. Convert node values to characters
3. Compare with current smallest string

**Why DFS works well:**

- We visit each node exactly once: O(n) time
- We build strings incrementally as we traverse
- We can prune unnecessary comparisons early by comparing strings character-by-character

**Optimization:** Instead of building full strings for every path and comparing them at the end, we can compare paths as we build them. If we find that the current path is already lexicographically larger than our current best at some point, we can stop exploring that branch early.

**String Building:** Since we need leaf-to-root strings but traverse root-to-leaf, we have two options:

1. Build root-to-leaf string, then reverse it when comparing
2. Build the string in reverse order (prepend characters as we go deeper)

The second approach is more efficient for comparison since we're comparing from the leaf end first.

## Optimal Solution

Here's the DFS with backtracking solution:

<div class="code-group">

```python
# Time: O(n * h) where h is tree height (for string comparison)
# Space: O(h) for recursion stack and path storage
class Solution:
    def smallestFromLeaf(self, root: Optional[TreeNode]) -> str:
        # Helper function for DFS traversal
        def dfs(node, current_path):
            nonlocal smallest

            if not node:
                return

            # Convert node value to character and prepend to current path
            # We prepend because we're building leaf-to-root string
            current_path = chr(node.val + ord('a')) + current_path

            # Check if current node is a leaf
            if not node.left and not node.right:
                # Found a leaf, compare current path with smallest
                if smallest is None or current_path < smallest:
                    smallest = current_path
                return

            # Recursively explore left and right children
            if node.left:
                dfs(node.left, current_path)
            if node.right:
                dfs(node.right, current_path)

        # Initialize smallest as None (or a very large string)
        smallest = None
        # Start DFS from root with empty path
        dfs(root, "")
        return smallest
```

```javascript
// Time: O(n * h) where h is tree height (for string comparison)
// Space: O(h) for recursion stack and path storage
var smallestFromLeaf = function (root) {
  let smallest = null;

  // Helper function for DFS traversal
  function dfs(node, currentPath) {
    if (!node) return;

    // Convert node value to character and prepend to current path
    // We prepend because we're building leaf-to-root string
    currentPath = String.fromCharCode(node.val + 97) + currentPath;

    // Check if current node is a leaf
    if (!node.left && !node.right) {
      // Found a leaf, compare current path with smallest
      if (smallest === null || currentPath < smallest) {
        smallest = currentPath;
      }
      return;
    }

    // Recursively explore left and right children
    if (node.left) {
      dfs(node.left, currentPath);
    }
    if (node.right) {
      dfs(node.right, currentPath);
    }
  }

  // Start DFS from root with empty path
  dfs(root, "");
  return smallest;
};
```

```java
// Time: O(n * h) where h is tree height (for string comparison)
// Space: O(h) for recursion stack and path storage
class Solution {
    private String smallest = null;

    public String smallestFromLeaf(TreeNode root) {
        dfs(root, new StringBuilder());
        return smallest;
    }

    private void dfs(TreeNode node, StringBuilder currentPath) {
        if (node == null) return;

        // Convert node value to character and prepend to current path
        // We prepend because we're building leaf-to-root string
        currentPath.insert(0, (char)('a' + node.val));

        // Check if current node is a leaf
        if (node.left == null && node.right == null) {
            String pathStr = currentPath.toString();
            // Found a leaf, compare current path with smallest
            if (smallest == null || pathStr.compareTo(smallest) < 0) {
                smallest = pathStr;
            }
        } else {
            // Recursively explore left and right children
            if (node.left != null) {
                dfs(node.left, currentPath);
            }
            if (node.right != null) {
                dfs(node.right, currentPath);
            }
        }

        // Backtrack: remove the character we added
        currentPath.deleteCharAt(0);
    }
}
```

</div>

**Step-by-step explanation:**

1. **DFS Traversal:** We traverse the tree using DFS to explore all paths from root to leaves.
2. **Path Building:** As we go deeper, we prepend the current node's character to the path string. Prepending is crucial because we need leaf-to-root order.
3. **Leaf Check:** When we reach a leaf (both children are null), we have a complete path.
4. **Comparison:** We compare the current path with the smallest found so far. If it's smaller or if it's the first path we found, we update `smallest`.
5. **Backtracking:** In the Java version, we explicitly backtrack by removing the character we added. In Python/JavaScript, strings are immutable so we create new strings each time, which automatically handles backtracking.

## Complexity Analysis

**Time Complexity:** O(n × h)

- `n`: Number of nodes in the tree (we visit each node once)
- `h`: Height of the tree (maximum depth)
- The `× h` factor comes from string comparisons. When comparing two strings of length up to `h`, it takes O(h) time in worst case.

**Space Complexity:** O(h)

- `h`: Height of the tree (maximum recursion depth)
- We store the current path which can be up to `h` characters long
- In worst case (skewed tree), `h = n`, so O(n) space
- In balanced tree, `h = log n`, so O(log n) space

## Common Mistakes

1. **Building strings in wrong direction:** Forgetting that we need leaf-to-root strings, not root-to-leaf. This leads to comparing strings backwards. Always remember to prepend characters, not append.

2. **Not handling null/empty tree:** If the tree has only one node, that node is both root and leaf. Make sure your solution handles this case correctly.

3. **Inefficient string comparison:** Comparing full strings at each leaf instead of comparing incrementally. While our solution compares full strings, an optimized version could compare character-by-character as we build the path to prune early.

4. **Forgetting to convert node values to characters:** Node values are 0-25, not direct ASCII codes for 'a'-'z'. You need to add `ord('a')` or `97` to convert properly.

5. **Mutable vs immutable strings:** In Java, using `StringBuilder` requires explicit backtracking (deleting the last character). Forgetting to backtrack leads to incorrect paths being compared.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Tree DFS with Backtracking:** Similar to "Binary Tree Paths" (LeetCode 257) where you collect all root-to-leaf paths, but here you need to compare them lexicographically.

2. **Path-based Tree Problems:** Like "Sum Root to Leaf Numbers" (LeetCode 129) where you compute values along paths, but here you're building and comparing strings.

3. **Lexicographic Comparison in Trees:** Problems where you need to find the "smallest" or "largest" path in a tree, such as "Lexicographically Smallest String After Applying Operations" or similar ordering problems.

**Related problems:**

- **Sum Root to Leaf Numbers (129):** Similar DFS traversal accumulating values along paths
- **Binary Tree Paths (257):** Almost identical structure but simpler (just collect paths)
- **Path Sum II (113):** DFS with backtracking to find paths that sum to a target

## Key Takeaways

1. **DFS with backtracking** is the standard approach for exploring all root-to-leaf paths in a tree. The pattern is: process current node, recurse on children, then backtrack.

2. When building paths **from leaf to root** but traversing **root to leaf**, prepend characters as you go deeper rather than appending them.

3. For problems requiring **lexicographic comparison** of paths, consider whether you can prune branches early by comparing partial results.

4. Always consider **edge cases**: single node trees, skewed trees (which affect space complexity), and trees where multiple paths might have the same prefix.

Related problems: [Sum Root to Leaf Numbers](/problem/sum-root-to-leaf-numbers), [Binary Tree Paths](/problem/binary-tree-paths)
