---
title: "How to Solve Recover a Tree From Preorder Traversal — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Recover a Tree From Preorder Traversal. Hard difficulty, 83.2% acceptance rate. Topics: String, Tree, Depth-First Search, Binary Tree."
date: "2026-06-28"
category: "dsa-patterns"
tags: ["recover-a-tree-from-preorder-traversal", "string", "tree", "depth-first-search", "hard"]
---

# How to Solve Recover a Tree From Preorder Traversal

This problem asks us to reconstruct a binary tree from a special string representation of its preorder traversal. The tricky part is that the string doesn't include explicit null markers for missing children - instead, we only get node values with dashes indicating their depth. We need to infer the tree structure by tracking depth relationships between consecutive nodes in the traversal.

## Visual Walkthrough

Let's trace through the example: `"1-2--3--4-5--6--7"`

The string represents:

- `1` (depth 0)
- `2` (depth 1) with dashes: `-2`
- `3` (depth 2) with dashes: `--3`
- `4` (depth 2) with dashes: `--4`
- `5` (depth 1) with dashes: `-5`
- `6` (depth 2) with dashes: `--6`
- `7` (depth 2) with dashes: `--7`

Here's how we reconstruct it step by step:

1. **Root node (1)**: Depth 0, becomes the root
2. **Node 2**: Depth 1, becomes left child of 1 (since it's the first node at depth 1)
3. **Node 3**: Depth 2, becomes left child of 2 (first node at depth 2)
4. **Node 4**: Depth 2, becomes right child of 2 (same depth as previous node, so we go up until we find a node at depth 1 that needs a right child)
5. **Node 5**: Depth 1, becomes right child of 1 (depth decreased from 2 to 1, so we go up to depth 1)
6. **Node 6**: Depth 2, becomes left child of 5
7. **Node 7**: Depth 2, becomes right child of 5

The key insight: when we see a node at depth `d`, we need to find its parent at depth `d-1`. The parent will be the most recent node at depth `d-1` that doesn't have two children yet.

## Brute Force Approach

A naive approach might try to parse the entire string first, then figure out parent-child relationships. One brute force method would be:

1. Parse all nodes into (depth, value) pairs
2. For each node, scan backwards through previous nodes to find its parent
3. Attach the node as a child to the appropriate parent

The problem with this approach is the backward scanning. For the i-th node, we might need to scan through all previous i-1 nodes to find the right parent. This gives us O(n²) time complexity in the worst case (like when the tree is a linked list).

Even worse, we'd need to keep track of which nodes already have two children, adding complexity to the parent-finding logic. This approach quickly becomes messy and inefficient.

## Optimized Approach

The key insight is that we can process the string in a **single pass** using a **stack** to maintain the current path from root to the node we're processing. Here's the step-by-step reasoning:

1. **Use a stack to track nodes**: The stack represents the current path from root to the node we're about to process. The top of the stack is the current parent candidate.

2. **Parse depth and value**: For each segment in the string, count dashes to determine depth, then parse the integer value.

3. **Maintain stack size equal to depth**:
   - If current depth equals stack size, the new node is a child of the top node
   - If current depth is less than stack size, we need to pop from stack until stack size equals depth (going back up the tree)

4. **Attach as left or right child**:
   - If parent has no left child yet, attach as left child
   - Otherwise, attach as right child

5. **Push new node onto stack**: This makes it available as a potential parent for future nodes.

The stack naturally handles the depth relationships: when we see a node at depth `d`, we pop from stack until we have exactly `d` nodes in it (the last one being the parent at depth `d-1`).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of the traversal string
# Space: O(h) where h is the height of the tree (stack size)
class Solution:
    def recoverFromPreorder(self, traversal: str) -> Optional[TreeNode]:
        # Stack to maintain the current path from root
        stack = []
        i = 0  # Pointer to traverse the input string
        n = len(traversal)

        while i < n:
            # Step 1: Count dashes to determine depth of current node
            depth = 0
            while i < n and traversal[i] == '-':
                depth += 1
                i += 1

            # Step 2: Parse the node value (could be multi-digit)
            value = 0
            while i < n and traversal[i].isdigit():
                value = value * 10 + int(traversal[i])
                i += 1

            # Create new node with parsed value
            node = TreeNode(value)

            # Step 3: Adjust stack to match current depth
            # If depth < len(stack), we need to go back up the tree
            while len(stack) > depth:
                stack.pop()

            # Step 4: Attach node to its parent (if exists)
            if stack:  # Stack is not empty, so we have a parent
                parent = stack[-1]
                if parent.left is None:
                    parent.left = node
                else:
                    parent.right = node

            # Step 5: Push current node onto stack
            # This makes it a potential parent for future nodes
            stack.append(node)

        # The first node in stack is the root (depth 0)
        return stack[0]
```

```javascript
// Time: O(n) where n is the length of the traversal string
// Space: O(h) where h is the height of the tree (stack size)
function recoverFromPreorder(traversal) {
  // Stack to maintain the current path from root
  const stack = [];
  let i = 0; // Pointer to traverse the input string
  const n = traversal.length;

  while (i < n) {
    // Step 1: Count dashes to determine depth of current node
    let depth = 0;
    while (i < n && traversal[i] === "-") {
      depth++;
      i++;
    }

    // Step 2: Parse the node value (could be multi-digit)
    let value = 0;
    while (i < n && !isNaN(parseInt(traversal[i]))) {
      value = value * 10 + parseInt(traversal[i]);
      i++;
    }

    // Create new node with parsed value
    const node = new TreeNode(value);

    // Step 3: Adjust stack to match current depth
    // If depth < stack.length, we need to go back up the tree
    while (stack.length > depth) {
      stack.pop();
    }

    // Step 4: Attach node to its parent (if exists)
    if (stack.length > 0) {
      // Stack is not empty, so we have a parent
      const parent = stack[stack.length - 1];
      if (parent.left === null) {
        parent.left = node;
      } else {
        parent.right = node;
      }
    }

    // Step 5: Push current node onto stack
    // This makes it a potential parent for future nodes
    stack.push(node);
  }

  // The first node in stack is the root (depth 0)
  return stack[0];
}

// TreeNode definition for completeness
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
```

```java
// Time: O(n) where n is the length of the traversal string
// Space: O(h) where h is the height of the tree (stack size)
class Solution {
    public TreeNode recoverFromPreorder(String traversal) {
        // Stack to maintain the current path from root
        Stack<TreeNode> stack = new Stack<>();
        int i = 0;  // Pointer to traverse the input string
        int n = traversal.length();

        while (i < n) {
            // Step 1: Count dashes to determine depth of current node
            int depth = 0;
            while (i < n && traversal.charAt(i) == '-') {
                depth++;
                i++;
            }

            // Step 2: Parse the node value (could be multi-digit)
            int value = 0;
            while (i < n && Character.isDigit(traversal.charAt(i))) {
                value = value * 10 + (traversal.charAt(i) - '0');
                i++;
            }

            // Create new node with parsed value
            TreeNode node = new TreeNode(value);

            // Step 3: Adjust stack to match current depth
            // If depth < stack.size(), we need to go back up the tree
            while (stack.size() > depth) {
                stack.pop();
            }

            // Step 4: Attach node to its parent (if exists)
            if (!stack.isEmpty()) {  // Stack is not empty, so we have a parent
                TreeNode parent = stack.peek();
                if (parent.left == null) {
                    parent.left = node;
                } else {
                    parent.right = node;
                }
            }

            // Step 5: Push current node onto stack
            // This makes it a potential parent for future nodes
            stack.push(node);
        }

        // The first node in stack is the root (depth 0)
        return stack.get(0);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the length of the input string. We make a single pass through the string, and each character is processed exactly once. The stack operations (push/pop) are O(1) amortized.

**Space Complexity: O(h)** where h is the height of the tree. In the worst case (a skewed tree), h = n, giving us O(n) space. In the best case (balanced tree), h = log(n). The stack stores at most one node per level of depth.

## Common Mistakes

1. **Not handling multi-digit numbers**: The node values can be integers with multiple digits (like "123"). Candidates often parse only single digits, which fails for test cases with larger numbers. Always use a while loop to accumulate digits until you hit a dash or end of string.

2. **Incorrect stack management**: The most subtle part is popping from the stack until `stack.size() == depth`. Some candidates try to pop exactly `stack.size() - depth` times, which works, but forgetting this step entirely leads to attaching nodes to the wrong parents.

3. **Assuming left child is always available**: When attaching a node to its parent, you must check if the left child is taken first. The pattern is: if parent.left is null, use it; otherwise use parent.right. Some candidates assume they should alternate or use a different logic.

4. **Edge case with empty or single-node trees**: While the problem guarantees at least one node, candidates should still consider how their code handles the root node (depth 0). The root has no parent, so the `if stack:` or `if (!stack.isEmpty())` check is crucial.

## When You'll See This Pattern

This stack-based approach for reconstructing trees from serialized formats appears in several problems:

1. **Construct Binary Tree from Preorder and Inorder Traversal (LeetCode 105)** - While this uses arrays instead of strings, the recursive stack-based thinking is similar for tracking subtree boundaries.

2. **Serialize and Deserialize Binary Tree (LeetCode 297)** - The deserialization process often uses a stack or queue to reconstruct the tree level by level or in preorder.

3. **Verify Preorder Serialization of a Binary Tree (LeetCode 331)** - This also processes a serialized tree representation using a stack to track available slots for children.

The common theme is using a stack to maintain context (current path or available parent nodes) while processing serialized tree data in sequence.

## Key Takeaways

1. **Stack for depth tracking**: When processing hierarchical data (like trees) in a linear sequence, a stack naturally maintains the current path. The stack size corresponds to the current depth.

2. **Single-pass parsing is possible**: Even though the problem seems to require looking ahead or backward, careful stack management allows O(n) processing. Look for opportunities to use stacks when you need to match opening/closing or parent/child relationships.

3. **Parse carefully**: Tree serialization problems often have subtle parsing requirements (multi-digit numbers, special markers, etc.). Always write robust parsing logic before focusing on the tree reconstruction.

[Practice this problem on CodeJeet](/problem/recover-a-tree-from-preorder-traversal)
