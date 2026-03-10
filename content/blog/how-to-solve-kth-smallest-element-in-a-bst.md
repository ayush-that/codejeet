---
title: "How to Solve Kth Smallest Element in a BST — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Kth Smallest Element in a BST. Medium difficulty, 76.5% acceptance rate. Topics: Tree, Depth-First Search, Binary Search Tree, Binary Tree."
date: "2026-05-17"
category: "dsa-patterns"
tags:
  ["kth-smallest-element-in-a-bst", "tree", "depth-first-search", "binary-search-tree", "medium"]
---

# How to Solve Kth Smallest Element in a BST

This problem asks us to find the k-th smallest element in a Binary Search Tree (BST), where k is 1-indexed. What makes this problem interesting is that a BST has a specific property: for any node, all values in its left subtree are smaller, and all values in its right subtree are larger. This property gives us multiple approaches—from a simple traversal to more optimized techniques that avoid processing the entire tree.

## Visual Walkthrough

Let's trace through a concrete example. Consider this BST:

```
      5
     / \
    3   6
   / \
  2   4
```

We want to find the 3rd smallest element (k=3).

**Step 1:** Start at the root (5). The left subtree contains smaller values, so we explore there first.

**Step 2:** Move to node 3. Again, explore its left subtree first.

**Step 3:** Visit node 2. This is the smallest element (1st smallest). We count it.

**Step 4:** Backtrack to node 3. This is the 2nd smallest element. We count it.

**Step 5:** Move to node 3's right child (4). This is the 3rd smallest element—exactly what we need!

Notice the pattern: we're visiting nodes in **inorder traversal** order (left → root → right), which naturally yields values in ascending order for a BST. This is the key insight: the k-th element in an inorder traversal is the k-th smallest element.

## Brute Force Approach

The most straightforward approach is to perform a complete inorder traversal of the entire BST, store all values in an array, and then return the element at index k-1 (since k is 1-indexed).

**Why this works:** Inorder traversal of a BST visits nodes in ascending order, so the k-th visited node is the k-th smallest.

**Why it's suboptimal:** This approach requires O(n) time and O(n) space to store all n elements, even when k is small (like k=1). We're doing unnecessary work if we only need a few of the smallest elements.

Here's what the brute force code looks like:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def kthSmallest(root, k):
    # Perform inorder traversal to collect all elements
    def inorder(node):
        if not node:
            return []
        return inorder(node.left) + [node.val] + inorder(node.right)

    # Get all elements in sorted order
    elements = inorder(root)
    # Return the k-th smallest (1-indexed)
    return elements[k-1]
```

```javascript
// Time: O(n) | Space: O(n)
function kthSmallest(root, k) {
  // Perform inorder traversal to collect all elements
  function inorder(node) {
    if (!node) return [];
    return [...inorder(node.left), node.val, ...inorder(node.right)];
  }

  // Get all elements in sorted order
  const elements = inorder(root);
  // Return the k-th smallest (1-indexed)
  return elements[k - 1];
}
```

```java
// Time: O(n) | Space: O(n)
public int kthSmallest(TreeNode root, int k) {
    // Perform inorder traversal to collect all elements
    List<Integer> elements = new ArrayList<>();
    inorder(root, elements);
    // Return the k-th smallest (1-indexed)
    return elements.get(k-1);
}

private void inorder(TreeNode node, List<Integer> elements) {
    if (node == null) return;
    inorder(node.left, elements);
    elements.add(node.val);
    inorder(node.right, elements);
}
```

</div>

## Optimized Approach

The key insight is that we don't need to traverse the entire tree—we can stop as soon as we find the k-th smallest element. We can modify the inorder traversal to:

1. Traverse the left subtree first (smaller values)
2. Process the current node (count it)
3. If we've found the k-th element, return immediately
4. Otherwise, traverse the right subtree (larger values)

This approach uses the BST property to our advantage: by traversing in inorder order, we encounter elements from smallest to largest. We maintain a counter that increments each time we visit a node. When the counter reaches k, we've found our answer.

**Why this is optimal:** We only traverse until we find the k-th element. In the best case (k=1), we only traverse down the leftmost path. In the worst case (k=n), we traverse the entire tree. The average case is much better than O(n) when k is small.

## Optimal Solution

Here's the iterative implementation using a stack, which is more intuitive for many candidates and avoids recursion overhead. We simulate inorder traversal by explicitly managing the stack.

<div class="code-group">

```python
# Time: O(h + k) where h is tree height | Space: O(h)
def kthSmallest(root, k):
    # Use a stack to simulate inorder traversal
    stack = []
    current = root

    while stack or current:
        # Go as far left as possible (smallest elements)
        while current:
            stack.append(current)
            current = current.left

        # Process the node at the top of stack
        current = stack.pop()
        k -= 1  # Count this node

        # If we've found the k-th smallest
        if k == 0:
            return current.val

        # Move to right subtree (larger values)
        current = current.right

    # This line should never be reached for valid inputs
    return -1
```

```javascript
// Time: O(h + k) where h is tree height | Space: O(h)
function kthSmallest(root, k) {
  // Use a stack to simulate inorder traversal
  const stack = [];
  let current = root;

  while (stack.length > 0 || current) {
    // Go as far left as possible (smallest elements)
    while (current) {
      stack.push(current);
      current = current.left;
    }

    // Process the node at the top of stack
    current = stack.pop();
    k--; // Count this node

    // If we've found the k-th smallest
    if (k === 0) {
      return current.val;
    }

    // Move to right subtree (larger values)
    current = current.right;
  }

  // This line should never be reached for valid inputs
  return -1;
}
```

```java
// Time: O(h + k) where h is tree height | Space: O(h)
public int kthSmallest(TreeNode root, int k) {
    // Use a stack to simulate inorder traversal
    Stack<TreeNode> stack = new Stack<>();
    TreeNode current = root;

    while (!stack.isEmpty() || current != null) {
        // Go as far left as possible (smallest elements)
        while (current != null) {
            stack.push(current);
            current = current.left;
        }

        // Process the node at the top of stack
        current = stack.pop();
        k--;  // Count this node

        // If we've found the k-th smallest
        if (k == 0) {
            return current.val;
        }

        // Move to right subtree (larger values)
        current = current.right;
    }

    // This line should never be reached for valid inputs
    return -1;
}
```

</div>

**Line-by-line explanation:**

1. **Initialize stack and current pointer:** We use a stack to keep track of nodes we need to process, and `current` points to the node we're currently examining.
2. **Outer while loop:** Continues as long as we have nodes to process (either in stack or `current` is not null).
3. **Inner while loop:** Goes all the way to the leftmost node. This ensures we process nodes in ascending order because in a BST, the leftmost node is the smallest.
4. **Pop from stack:** Takes the most recent node (which is the smallest unprocessed node).
5. **Decrement k:** Counts this node. When k reaches 0, this is our k-th smallest element.
6. **Move to right subtree:** After processing a node, we explore its right subtree, which contains values larger than the current node but smaller than the current node's parent.

## Complexity Analysis

**Time Complexity:** O(h + k), where h is the height of the tree.

- We traverse down the leftmost path to reach the smallest element (O(h)).
- Then we pop k nodes from the stack (O(k)).
- In the worst case (skewed tree), h = n, so complexity is O(n).
- In a balanced tree, h = log n, so complexity is O(log n + k).

**Space Complexity:** O(h), where h is the height of the tree.

- The stack stores at most h nodes (the path from root to the deepest leftmost node).
- In the worst case (skewed tree), h = n, so space is O(n).
- In a balanced tree, h = log n, so space is O(log n).

## Common Mistakes

1. **Forgetting that k is 1-indexed:** Some candidates treat k as 0-indexed and return when k-1 == 0 instead of k == 0. Always clarify indexing with your interviewer.

2. **Not stopping early:** The brute force approach continues traversal even after finding the k-th element. Remember you can return immediately when counter reaches k.

3. **Incorrect stack management in iterative solution:** A common error is popping from an empty stack or not handling the `current` pointer correctly. Always check `while (stack or current)` and ensure you update `current` appropriately.

4. **Assuming the tree is balanced:** Don't assume O(log n) time without justification. Always consider worst-case scenarios (like a linked-list shaped BST).

## When You'll See This Pattern

This problem teaches the **inorder traversal pattern for BSTs**, which is fundamental for many tree problems:

1. **Binary Tree Inorder Traversal (Easy):** The basic version of this pattern—traverse a binary tree in inorder order.

2. **Validate Binary Search Tree (Medium):** Uses inorder traversal to check if values appear in ascending order.

3. **Convert BST to Greater Tree (Medium):** Uses a reverse inorder traversal (right → root → left) to accumulate sums.

4. **Two Sum IV - Input is a BST (Easy):** Can use inorder traversal to get sorted array, then apply two-pointer technique.

The core idea is that inorder traversal of a BST yields sorted values, which enables many efficient algorithms.

## Key Takeaways

1. **Inorder traversal of a BST produces elements in ascending order.** This is the most important property to remember for BST problems.

2. **You can optimize by stopping early.** When you only need the first k elements of a sorted sequence, you don't need to generate the entire sequence.

3. **Iterative traversal with a stack is often preferred in interviews** because it's easier to explain, avoids recursion limits, and makes early termination more explicit.

Remember: when a BST problem asks about order, size comparisons, or finding elements by rank, think about inorder traversal first.

Related problems: [Binary Tree Inorder Traversal](/problem/binary-tree-inorder-traversal), [Second Minimum Node In a Binary Tree](/problem/second-minimum-node-in-a-binary-tree)
