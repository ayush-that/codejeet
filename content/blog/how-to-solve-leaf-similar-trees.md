---
title: "How to Solve Leaf-Similar Trees — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Leaf-Similar Trees. Easy difficulty, 70.2% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2027-02-02"
category: "dsa-patterns"
tags: ["leaf-similar-trees", "tree", "depth-first-search", "binary-tree", "easy"]
---

# How to Solve Leaf-Similar Trees

The problem asks us to determine if two binary trees have the same leaf value sequence. While the concept is straightforward, the challenge lies in efficiently collecting leaves in the correct order and comparing them without unnecessary space usage. What makes this interesting is that two trees can have completely different structures but still be leaf-similar if their leaves appear in the same left-to-right order.

## Visual Walkthrough

Let's walk through a concrete example. Consider these two trees:

**Tree 1:**

```
     3
    / \
   5   1
  / \  | \
 6   2 9  8
    / \
   7   4
```

**Tree 2:**

```
     3
    / \
   5   1
  / \  | \
 6   7 4  8
    / \
   9   2
```

**Step 1: Collect leaves from Tree 1 (left-to-right order)**

- Start at root 3 → go left to 5 → go left to 6 (leaf) → add 6
- Backtrack to 5 → go right to 2 → go left to 7 (leaf) → add 7
- Backtrack to 2 → go right to 4 (leaf) → add 4
- Backtrack to 3 → go right to 1 → go left to 9 (leaf) → add 9
- Backtrack to 1 → go right to 8 (leaf) → add 8
- Leaf sequence: [6, 7, 4, 9, 8]

**Step 2: Collect leaves from Tree 2 (left-to-right order)**

- Start at root 3 → go left to 5 → go left to 6 (leaf) → add 6
- Backtrack to 5 → go right to 7 → go left to 9 (leaf) → add 9
- Backtrack to 7 → go right to 2 (leaf) → add 2
- Backtrack to 3 → go right to 1 → go left to 4 (leaf) → add 4
- Backtrack to 1 → go right to 8 (leaf) → add 8
- Leaf sequence: [6, 9, 2, 4, 8]

**Step 3: Compare sequences**

- Sequence 1: [6, 7, 4, 9, 8]
- Sequence 2: [6, 9, 2, 4, 8]
- They differ at position 2 → trees are NOT leaf-similar

The key insight is that we need to traverse each tree in a depth-first manner, collecting leaves as we encounter them in left-to-right order.

## Brute Force Approach

A naive approach would be to collect all leaves from both trees into separate lists, then compare the lists. While this works, it uses O(n + m) space where n and m are the number of nodes in each tree. We can optimize this by comparing leaves as we collect them, which reduces space usage.

What makes the brute force suboptimal isn't time complexity (it's already O(n + m)), but space efficiency. We store complete leaf sequences when we could compare incrementally. Also, some candidates might try to use level-order traversal (BFS), which would collect leaves in the wrong order unless the tree is perfect.

## Optimal Solution

The optimal approach uses DFS to traverse both trees. We can either:

1. Collect leaves into two lists and compare them (simpler, uses O(L) space where L = number of leaves)
2. Use generators/yield to compare leaves on-the-fly (more advanced, uses O(H) space for recursion stack)

We'll implement the generator approach since it's more space-efficient and demonstrates deeper understanding.

<div class="code-group">

```python
# Time: O(n + m) where n, m = nodes in tree1, tree2
# Space: O(h1 + h2) for recursion stack, where h = tree height
class Solution:
    def leafSimilar(self, root1: Optional[TreeNode], root2: Optional[TreeNode]) -> bool:
        def dfs(node):
            """Generator that yields leaf values in left-to-right order."""
            if not node:
                return

            # If it's a leaf node, yield its value
            if not node.left and not node.right:
                yield node.val
                return

            # Recursively traverse left subtree first (for left-to-right order)
            if node.left:
                yield from dfs(node.left)

            # Then recursively traverse right subtree
            if node.right:
                yield from dfs(node.right)

        # Get generators for both trees
        leaves1 = dfs(root1)
        leaves2 = dfs(root2)

        # Compare leaves one by one
        while True:
            try:
                leaf1 = next(leaves1)
            except StopIteration:
                leaf1 = None

            try:
                leaf2 = next(leaves2)
            except StopIteration:
                leaf2 = None

            # If both are None, we've exhausted both trees
            if leaf1 is None and leaf2 is None:
                return True

            # If one is None or values differ, trees aren't leaf-similar
            if leaf1 != leaf2:
                return False
```

```javascript
// Time: O(n + m) where n, m = nodes in tree1, tree2
// Space: O(h1 + h2) for recursion stack, where h = tree height
function leafSimilar(root1, root2) {
  // Generator function to yield leaf values in DFS order
  function* dfs(node) {
    if (!node) return;

    // If it's a leaf node, yield its value
    if (!node.left && !node.right) {
      yield node.val;
      return;
    }

    // Traverse left subtree first
    if (node.left) {
      yield* dfs(node.left);
    }

    // Then traverse right subtree
    if (node.right) {
      yield* dfs(node.right);
    }
  }

  // Create generators for both trees
  const leaves1 = dfs(root1);
  const leaves2 = dfs(root2);

  // Compare leaves one by one
  while (true) {
    const result1 = leaves1.next();
    const result2 = leaves2.next();

    // Check if both generators are done
    if (result1.done && result2.done) {
      return true;
    }

    // If one is done before the other or values differ
    if (result1.done || result2.done || result1.value !== result2.value) {
      return false;
    }
  }
}
```

```java
// Time: O(n + m) where n, m = nodes in tree1, tree2
// Space: O(h1 + h2) for recursion stack, where h = tree height
class Solution {
    public boolean leafSimilar(TreeNode root1, TreeNode root2) {
        // Create lists to store leaf sequences
        List<Integer> leaves1 = new ArrayList<>();
        List<Integer> leaves2 = new ArrayList<>();

        // Helper function to perform DFS and collect leaves
        dfs(root1, leaves1);
        dfs(root2, leaves2);

        // Compare the two lists
        return leaves1.equals(leaves2);
    }

    private void dfs(TreeNode node, List<Integer> leaves) {
        if (node == null) return;

        // If it's a leaf node, add its value to the list
        if (node.left == null && node.right == null) {
            leaves.add(node.val);
            return;
        }

        // Recursively traverse left subtree first
        dfs(node.left, leaves);

        // Then recursively traverse right subtree
        dfs(node.right, leaves);
    }
}
```

</div>

**Key implementation details:**

1. **DFS traversal order**: We must traverse left before right to get leaves in correct left-to-right order.
2. **Leaf identification**: A node is a leaf when both its left and right children are null.
3. **Generator approach (Python/JS)**: Uses `yield` to produce leaves one at a time, allowing comparison without storing all leaves.
4. **List approach (Java)**: Simpler but uses O(L) space to store all leaves before comparison.

## Complexity Analysis

**Time Complexity: O(n + m)**

- We traverse each node exactly once in both trees
- Each node is visited only once during DFS
- The comparison step takes O(min(L1, L2)) time where L = number of leaves

**Space Complexity: O(h1 + h2) for recursion stack**

- In the worst case (skewed tree), h = n, so O(n + m)
- In the best case (balanced tree), h = log(n), so O(log n + log m)
- The generator approach uses only recursion stack space
- The list approach uses additional O(L1 + L2) space for storing leaves

## Common Mistakes

1. **Wrong traversal order**: Using BFS or right-first DFS collects leaves in the wrong order. Always use left-first DFS.
   - _Fix_: Always traverse left subtree before right subtree.

2. **Incorrect leaf detection**: Checking `if not node` instead of `if not node.left and not node.right`.
   - _Fix_: A leaf has no children, not that the node itself is null.

3. **Not handling empty trees**: Assuming both trees are non-empty.
   - _Fix_: Check for null roots at the beginning. Two empty trees are leaf-similar.

4. **Inefficient space usage**: Storing all leaves when you could compare incrementally.
   - _Fix_: Use generators or compare as you collect leaves from the second tree.

5. **Off-by-one in comparison**: Comparing entire lists instead of element-by-element.
   - _Fix_: Use list comparison or compare leaves one at a time.

## When You'll See This Pattern

This problem teaches **DFS with custom processing** and **in-order comparison of sequences**. You'll see similar patterns in:

1. **Same Tree (LeetCode 100)**: Compare two trees node-by-node using DFS.
2. **Binary Tree Paths (LeetCode 257)**: Collect all root-to-leaf paths using DFS.
3. **Find Leaves of Binary Tree (LeetCode 366)**: Collect leaves at each level using DFS.
4. **Sum of Left Leaves (LeetCode 404)**: Identify and process specific leaf types during DFS.

The core pattern is using DFS to traverse a tree while performing specific operations at certain nodes (leaves in this case). Recognizing when to use DFS vs BFS is crucial: use DFS when you need to process nodes in a specific order (like left-to-right) or when exploring paths.

## Key Takeaways

1. **DFS is natural for leaf collection**: Depth-first search processes leaves in the correct left-to-right order when you traverse left before right.

2. **Generators enable space optimization**: When comparing sequences, you can often compare elements as you generate them rather than storing entire sequences.

3. **Tree comparison often involves traversal order**: Whether comparing values, structures, or sequences, the traversal order matters as much as the values themselves.

4. **Leaf nodes have specific properties**: They're nodes with no children, which simplifies base cases in recursive tree problems.

[Practice this problem on CodeJeet](/problem/leaf-similar-trees)
