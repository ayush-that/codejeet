---
title: "Depth-First Search Questions at Intuit: What to Expect"
description: "Prepare for Depth-First Search interview questions at Intuit — patterns, difficulty breakdown, and study tips."
date: "2028-10-29"
category: "dsa-patterns"
tags: ["intuit", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at Intuit: What to Expect

Intuit has 8 Depth-First Search (DFS) questions out of their 71 total tagged problems on LeetCode. That's about 11% of their problem set, which is significant but not overwhelming. In real interviews, DFS appears frequently because it's fundamental to tree and graph traversal—core concepts in software engineering. At Intuit, which builds complex financial products like QuickBooks and TurboTax, DFS isn't just an academic exercise. Interviewers use it to assess how you handle hierarchical data (think tax form structures, organizational charts, or dependency graphs in accounting systems). They want to see if you can navigate recursive structures cleanly and efficiently.

The key insight: Intuit's DFS questions often have a "business logic" wrapper. You're not just traversing a binary tree; you're calculating tax liabilities, validating transaction sequences, or checking compliance rules in a tree of financial categories. This means your DFS solution needs to be correct, readable, and maintainable—qualities they value in production code.

## Specific Patterns Intuit Favors

Intuit's DFS problems lean heavily toward **tree traversal** rather than general graph theory. They particularly favor:

1. **Path-based problems in binary trees** — Where you need to track the path from root to leaf and make decisions based on the entire path. This mirrors real scenarios like evaluating a chain of financial decisions.
2. **Decision trees with accumulators** — Problems where you carry state (like sums or counts) through the recursion and make decisions at each node.
3. **Validation/constraint checking** — Ensuring a tree structure meets certain rules (like BST validation), which translates to validating financial data structures.

Look at these representative problems from their list:

- **Path Sum (#112)** and **Path Sum II (#113)** — Classic examples of carrying state through DFS
- **Binary Tree Maximum Path Sum (#124)** — A harder variant that tests understanding of local vs. global state
- **Validate Binary Search Tree (#98)** — Constraint checking through inorder traversal

Notice what's missing: complex graph algorithms like topological sort or strongly connected components. Intuit stays closer to practical tree problems.

## How to Prepare

Master the recursive DFS template first, then learn the iterative stack version. The recursive version is cleaner for interviews, but knowing both shows depth of understanding. Here's the core pattern you must internalize:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes | Space: O(h) for recursion stack
def dfs_template(root, path, result):
    if not root:
        return

    # Process current node
    path.append(root.val)

    # Check if we've reached a decision point (often a leaf)
    if not root.left and not root.right:
        # Do something with the complete path
        result.append(list(path))  # Make a copy!

    # Recurse on children
    dfs_template(root.left, path, result)
    dfs_template(root.right, path, result)

    # Backtrack - crucial for path problems
    path.pop()
```

```javascript
// Time: O(n) where n is number of nodes | Space: O(h) for recursion stack
function dfsTemplate(root, path, result) {
  if (!root) return;

  // Process current node
  path.push(root.val);

  // Check if we've reached a decision point
  if (!root.left && !root.right) {
    // Do something with the complete path
    result.push([...path]); // Make a copy!
  }

  // Recurse on children
  dfsTemplate(root.left, path, result);
  dfsTemplate(root.right, path, result);

  // Backtrack
  path.pop();
}
```

```java
// Time: O(n) where n is number of nodes | Space: O(h) for recursion stack
public void dfsTemplate(TreeNode root, List<Integer> path, List<List<Integer>> result) {
    if (root == null) return;

    // Process current node
    path.add(root.val);

    // Check if we've reached a decision point
    if (root.left == null && root.right == null) {
        // Do something with the complete path
        result.add(new ArrayList<>(path));  // Make a copy!
    }

    // Recurse on children
    dfsTemplate(root.left, path, result);
    dfsTemplate(root.right, path, result);

    // Backtrack
    path.remove(path.size() - 1);
}
```

</div>

The critical pattern here is **backtracking**. When you modify a shared `path` list, you must clean up after recursion returns. Forgetting to `pop()` or `remove()` is the most common bug in DFS interviews.

For problems like **Binary Tree Maximum Path Sum (#124)**, you need a more advanced pattern where each recursive call returns information to its parent, and you also track global state:

<div class="code-group">

```python
# Time: O(n) | Space: O(h)
def maxPathSum(root):
    max_sum = float('-inf')

    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0

        # Get max path sums from children (ignore negative paths)
        left_max = max(dfs(node.left), 0)
        right_max = max(dfs(node.right), 0)

        # Current path sum if this node is the "root" of the path
        current_path_sum = node.val + left_max + right_max

        # Update global maximum
        max_sum = max(max_sum, current_path_sum)

        # Return the maximum path sum where this node is part of the path
        return node.val + max(left_max, right_max)

    dfs(root)
    return max_sum
```

```javascript
// Time: O(n) | Space: O(h)
function maxPathSum(root) {
  let maxSum = -Infinity;

  function dfs(node) {
    if (!node) return 0;

    // Get max path sums from children
    const leftMax = Math.max(dfs(node.left), 0);
    const rightMax = Math.max(dfs(node.right), 0);

    // Current path sum if this node is the "root" of the path
    const currentPathSum = node.val + leftMax + rightMax;

    // Update global maximum
    maxSum = Math.max(maxSum, currentPathSum);

    // Return the maximum path sum where this node is part of the path
    return node.val + Math.max(leftMax, rightMax);
  }

  dfs(root);
  return maxSum;
}
```

```java
// Time: O(n) | Space: O(h)
class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        dfs(root);
        return maxSum;
    }

    private int dfs(TreeNode node) {
        if (node == null) return 0;

        // Get max path sums from children
        int leftMax = Math.max(dfs(node.left), 0);
        int rightMax = Math.max(dfs(node.right), 0);

        // Current path sum if this node is the "root" of the path
        int currentPathSum = node.val + leftMax + rightMax;

        // Update global maximum
        maxSum = Math.max(maxSum, currentPathSum);

        // Return the maximum path sum where this node is part of the path
        return node.val + Math.max(leftMax, rightMax);
    }
}
```

</div>

This pattern—returning local information while updating global state—appears in many Intuit DFS problems.

## How Intuit Tests Depth-First Search vs Other Companies

Intuit's DFS questions differ from other companies in three key ways:

1. **Less emphasis on pure algorithmics, more on clean implementation** — At FAANG companies, you might get DFS problems with tricky optimizations or combined with other algorithms. Intuit wants to see you write maintainable, bug-free DFS that could go into production code. They care about edge cases and readability.

2. **Business context matters** — While Google might ask about DFS on an abstract grid, Intuit often frames problems in financial terms. You might traverse a "decision tree" for tax calculations or validate a "transaction dependency graph." The underlying algorithm is the same, but understanding the business context helps you ask better clarifying questions.

3. **Moderate difficulty level** — Intuit's DFS problems rarely go beyond medium difficulty. You won't see the hardest DFS problems like **Word Search II (#212)** or **Critical Connections in a Network (#1192)**. They test fundamentals thoroughly rather than esoteric variations.

Compared to finance companies like Goldman Sachs (which loves graph theory) or pure tech companies like Google (which combines DFS with dynamic programming), Intuit strikes a balance: practical, business-relevant, and medium difficulty.

## Study Order

1. **Basic tree traversal** — Start with preorder, inorder, and postorder traversal. Understand why each order matters for different problems.
2. **Path accumulation problems** — Learn to carry state through recursion with backtracking. This is where most Intuit questions live.
3. **Tree validation** — Practice checking constraints like BST properties or balanced tree conditions.
4. **Global vs local state** — Master problems like maximum path sum where you need both return values and global updates.
5. **Iterative DFS** — Learn the stack-based implementation. It's less common at Intuit but good to know.
6. **Simple graph traversal** — Only if you have time. Focus on adjacency list representation and cycle detection.

This order works because each concept builds on the previous one. You can't solve path problems without understanding basic traversal, and you can't handle global state problems without mastering path accumulation.

## Recommended Practice Order

Solve these problems in sequence:

1. **Binary Tree Inorder Traversal (#94)** — Basic traversal
2. **Maximum Depth of Binary Tree (#104)** — Simple recursion
3. **Path Sum (#112)** — Basic path accumulation
4. **Path Sum II (#113)** — Path accumulation with backtracking
5. **Validate Binary Search Tree (#98)** — Constraint checking
6. **Binary Tree Maximum Path Sum (#124)** — Global vs local state
7. **Sum Root to Leaf Numbers (#129)** — Another path accumulation variant
8. **Lowest Common Ancestor of a Binary Tree (#236)** — More advanced tree reasoning

If you complete these 8 problems, you'll cover 90% of DFS patterns Intuit uses. Focus on writing clean, commented code with proper edge case handling. Time yourself, but prioritize correctness over speed.

Remember: At Intuit, they're evaluating not just whether you can solve the problem, but whether you'd write code their team would want to maintain. Your DFS solutions should be as clean as their tax software's UI.

[Practice Depth-First Search at Intuit](/company/intuit/depth-first-search)
