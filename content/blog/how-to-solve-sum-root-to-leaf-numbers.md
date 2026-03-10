---
title: "How to Solve Sum Root to Leaf Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum Root to Leaf Numbers. Medium difficulty, 69.6% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2026-08-26"
category: "dsa-patterns"
tags: ["sum-root-to-leaf-numbers", "tree", "depth-first-search", "binary-tree", "medium"]
---

# How to Solve Sum Root to Leaf Numbers

This problem asks us to sum all numbers formed by root-to-leaf paths in a binary tree where each node contains a single digit (0-9). What makes this problem interesting is that it combines tree traversal with number construction—you need to build numbers as you traverse paths, but only add them to the total when you reach actual leaves (not just any node).

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this tree:

```
    1
   / \
  2   3
```

**Step 1:** Start at root node `1` with current number `0`

- Current number becomes `0 * 10 + 1 = 1`

**Step 2:** Go left to node `2`

- Current number becomes `1 * 10 + 2 = 12`
- Node `2` is a leaf (no children), so we add `12` to our total

**Step 3:** Backtrack to root `1`, then go right to node `3`

- Current number becomes `1 * 10 + 3 = 13`
- Node `3` is a leaf, so we add `13` to our total

**Final sum:** `12 + 13 = 25`

The key insight: we build numbers digit-by-digit as we traverse down paths, multiplying by 10 at each step to shift digits left. When we hit a leaf, we've completed one full number.

## Brute Force Approach

A naive approach might be to first collect all root-to-leaf paths as strings or arrays, then convert each to a number and sum them. For example:

1. Perform DFS to find all root-to-leaf paths
2. Store each path as a list of digits: `[[1,2], [1,3]]`
3. Convert each list to a number: `12` and `13`
4. Sum the numbers: `25`

While this works, it's inefficient in both time and space:

- **Time:** O(n²) in worst case (skewed tree) because building each path string/array takes O(h) time where h is height
- **Space:** O(n²) because we store all paths separately

The main issue is we're storing intermediate results we don't need to keep. We can compute the sum incrementally without storing entire paths.

## Optimized Approach

The optimal solution uses DFS with backtracking. Here's the key insight:

**We can compute each number on-the-fly as we traverse, and add it to the total immediately when we reach a leaf.**

The algorithm:

1. Start DFS from root with current number = 0
2. At each node: current number = previous number × 10 + node's value
3. If node is a leaf: add current number to total sum
4. If node has left child: recursively process left subtree
5. If node has right child: recursively process right subtree
6. Backtrack by returning to parent (no explicit cleanup needed since we pass current number by value)

Why this works:

- Multiplying by 10 shifts digits left (decimal system)
- Adding node's value appends the new digit
- By passing the current number as a parameter, each recursive call gets its own copy
- We only add to total at leaves, ensuring we count complete numbers

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(h) where h is height of tree (recursion stack)
class Solution:
    def sumNumbers(self, root: Optional[TreeNode]) -> int:
        def dfs(node, current_sum):
            # Base case: empty node
            if not node:
                return 0

            # Update current number by shifting left and adding current digit
            current_sum = current_sum * 10 + node.val

            # If this is a leaf node, return the completed number
            if not node.left and not node.right:
                return current_sum

            # Otherwise, continue DFS on children and sum their results
            left_sum = dfs(node.left, current_sum)
            right_sum = dfs(node.right, current_sum)

            return left_sum + right_sum

        # Start DFS from root with initial sum of 0
        return dfs(root, 0)
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(h) where h is height of tree (recursion stack)
function sumNumbers(root) {
  function dfs(node, currentSum) {
    // Base case: empty node
    if (!node) {
      return 0;
    }

    // Update current number by shifting left and adding current digit
    currentSum = currentSum * 10 + node.val;

    // If this is a leaf node, return the completed number
    if (!node.left && !node.right) {
      return currentSum;
    }

    // Otherwise, continue DFS on children and sum their results
    const leftSum = dfs(node.left, currentSum);
    const rightSum = dfs(node.right, currentSum);

    return leftSum + rightSum;
  }

  // Start DFS from root with initial sum of 0
  return dfs(root, 0);
}
```

```java
// Time: O(n) where n is number of nodes
// Space: O(h) where h is height of tree (recursion stack)
class Solution {
    public int sumNumbers(TreeNode root) {
        return dfs(root, 0);
    }

    private int dfs(TreeNode node, int currentSum) {
        // Base case: empty node
        if (node == null) {
            return 0;
        }

        // Update current number by shifting left and adding current digit
        currentSum = currentSum * 10 + node.val;

        // If this is a leaf node, return the completed number
        if (node.left == null && node.right == null) {
            return currentSum;
        }

        // Otherwise, continue DFS on children and sum their results
        int leftSum = dfs(node.left, currentSum);
        int rightSum = dfs(node.right, currentSum);

        return leftSum + rightSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We visit each node exactly once
- At each node, we perform O(1) operations (arithmetic, comparisons)

**Space Complexity:** O(h) where h is the height of the tree

- This is the maximum depth of the recursion stack
- Best case (balanced tree): O(log n)
- Worst case (skewed tree): O(n)

The space complexity comes from the recursion call stack. In the worst case of a completely skewed tree (like a linked list), we'll have n recursive calls on the stack simultaneously.

## Common Mistakes

1. **Adding numbers at non-leaf nodes:** The problem specifically says "root-to-leaf" numbers. If you add the number at every node, you'll count partial paths. Always check `if not node.left and not node.right` before adding to total.

2. **Forgetting the ×10 operation:** Each step down the tree represents moving one decimal place left. Without multiplying by 10, you'd just be summing digits instead of forming proper numbers.

3. **Not handling null/empty tree:** If the root is null, the sum should be 0. Make sure your base case returns 0 for null nodes.

4. **Using mutable global variables unnecessarily:** While you could use a global sum variable, it's cleaner to return values from recursive calls. This makes the function pure and easier to reason about.

## When You'll See This Pattern

This "path accumulation" pattern appears in many tree problems:

1. **Path Sum (Easy)** - Similar structure but sums values instead of building numbers
2. **Binary Tree Maximum Path Sum (Hard)** - More complex version where paths don't have to end at leaves
3. **Smallest String Starting From Leaf (Medium)** - Builds strings instead of numbers along paths
4. **All Paths From Root to Leaves** - Collects actual paths rather than computing a value

The core pattern is: traverse tree, accumulate some value along each path, take action (sum, compare, store) at path endpoints. Recognizing this lets you adapt solutions across similar problems.

## Key Takeaways

- **DFS with path accumulation** is the go-to approach for problems involving root-to-leaf computations
- **Multiply by 10 to shift digits** when building numbers from tree paths (decimal system)
- **Check for leaf nodes** using `!node.left && !node.right` before counting complete paths
- **Pass accumulated value as parameter** to avoid mutable state and make recursion cleaner

Related problems: [Path Sum](/problem/path-sum), [Binary Tree Maximum Path Sum](/problem/binary-tree-maximum-path-sum), [Smallest String Starting From Leaf](/problem/smallest-string-starting-from-leaf)
