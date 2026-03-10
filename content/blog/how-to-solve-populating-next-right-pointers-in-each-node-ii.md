---
title: "How to Solve Populating Next Right Pointers in Each Node II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Populating Next Right Pointers in Each Node II. Medium difficulty, 57.1% acceptance rate. Topics: Linked List, Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2026-12-05"
category: "dsa-patterns"
tags:
  [
    "populating-next-right-pointers-in-each-node-ii",
    "linked-list",
    "tree",
    "depth-first-search",
    "medium",
  ]
---

# How to Solve Populating Next Right Pointers in Each Node II

This problem asks us to connect each node in a binary tree to its "next right" node at the same level, or to `NULL` if no such node exists. The tricky part is that the tree isn't necessarily perfect (complete) - nodes can have missing children, which makes the level-by-level linking more complex than in the perfect tree version of this problem.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Input:
       1
     /   \
    2     3
   / \     \
  4   5     7

Step-by-step process:
Level 0: Node 1 → NULL (no node to its right)

Level 1:
- Node 2 needs to connect to Node 3
- Node 3 → NULL (no node to its right)

Level 2:
- Node 4 needs to connect to Node 5
- Node 5 needs to connect to Node 7 (skipping over the missing right child of Node 2)
- Node 7 → NULL

Final result:
       1 → NULL
     /   \
    2  →  3 → NULL
   / \     \
  4 → 5 →   7 → NULL
```

The key challenge is handling the gaps where nodes are missing. We can't simply assume every node has both children.

## Brute Force Approach

A naive approach would be to perform a standard level-order traversal using a queue, then connect nodes at each level. While this approach works, it requires O(n) space for the queue, which isn't optimal.

What a candidate might initially try:

1. Use BFS with a queue to traverse level by level
2. For each level, connect each node to the next node in the queue
3. This works but uses O(n) space for the queue

The problem with this approach is that it doesn't leverage the `next` pointers we're creating. Once we connect level `i`, we can use those connections to traverse level `i+1` without a queue!

## Optimized Approach

The key insight is that we can use the `next` pointers we're creating to traverse the tree level by level without extra space. Here's the step-by-step reasoning:

1. **Think level by level**: We need to process the tree one level at a time, connecting all nodes at that level before moving to the next.

2. **Use a "dummy" head**: Since we don't know where the next level starts (some nodes might have no children), we can use a dummy node to help us build the linked list for the next level.

3. **Two-pointer traversal**: We maintain:
   - `current`: The node we're currently processing in the current level
   - `tail`: The last node we've added to the linked list for the next level

4. **Process children in order**: For each node in the current level, we add its left child (if exists) to the next level's linked list, then its right child.

5. **Move to next level**: Once we finish the current level, we move to the next level by setting the current node to the first node of the next level (which our dummy node points to).

This approach gives us O(1) space (excluding the recursion stack if we consider it, but we're using iteration) because we're only using a few pointers to traverse and connect nodes.

## Optimal Solution

Here's the complete solution using the level-by-level traversal with O(1) extra space:

<div class="code-group">

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val: int = 0, left: 'Node' = None, right: 'Node' = None, next: 'Node' = None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next
"""

# Time: O(n) - We visit each node exactly once
# Space: O(1) - We only use a few pointers, no queue or recursion stack
class Solution:
    def connect(self, root: 'Node') -> 'Node':
        # Start with the root as the current level
        current = root

        # We'll use a dummy node to help us build the linked list for the next level
        dummy = Node(0)

        # Process each level
        while current:
            # Reset tail to dummy for each new level
            tail = dummy

            # Process all nodes in the current level
            while current:
                # If current node has a left child, add it to the next level's linked list
                if current.left:
                    tail.next = current.left  # Connect tail to this child
                    tail = tail.next          # Move tail forward

                # If current node has a right child, add it to the next level's linked list
                if current.right:
                    tail.next = current.right  # Connect tail to this child
                    tail = tail.next           # Move tail forward

                # Move to the next node in the current level
                current = current.next

            # Move to the next level
            # dummy.next points to the first node of the next level
            current = dummy.next

            # Reset dummy.next for the next iteration
            dummy.next = None

        return root
```

```javascript
/**
 * // Definition for a Node.
 * function Node(val, left, right, next) {
 *    this.val = val === undefined ? null : val;
 *    this.left = left === undefined ? null : left;
 *    this.right = right === undefined ? null : right;
 *    this.next = next === undefined ? null : next;
 * };
 */

// Time: O(n) - We visit each node exactly once
// Space: O(1) - We only use a few pointers, no queue or recursion stack
var connect = function (root) {
  // Start with the root as the current level
  let current = root;

  // We'll use a dummy node to help us build the linked list for the next level
  const dummy = new Node(0);

  // Process each level
  while (current) {
    // Reset tail to dummy for each new level
    let tail = dummy;

    // Process all nodes in the current level
    while (current) {
      // If current node has a left child, add it to the next level's linked list
      if (current.left) {
        tail.next = current.left; // Connect tail to this child
        tail = tail.next; // Move tail forward
      }

      // If current node has a right child, add it to the next level's linked list
      if (current.right) {
        tail.next = current.right; // Connect tail to this child
        tail = tail.next; // Move tail forward
      }

      // Move to the next node in the current level
      current = current.next;
    }

    // Move to the next level
    // dummy.next points to the first node of the next level
    current = dummy.next;

    // Reset dummy.next for the next iteration
    dummy.next = null;
  }

  return root;
};
```

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public Node left;
    public Node right;
    public Node next;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val, Node _left, Node _right, Node _next) {
        val = _val;
        left = _left;
        right = _right;
        next = _next;
    }
};
*/

// Time: O(n) - We visit each node exactly once
// Space: O(1) - We only use a few pointers, no queue or recursion stack
class Solution {
    public Node connect(Node root) {
        // Start with the root as the current level
        Node current = root;

        // We'll use a dummy node to help us build the linked list for the next level
        Node dummy = new Node(0);

        // Process each level
        while (current != null) {
            // Reset tail to dummy for each new level
            Node tail = dummy;

            // Process all nodes in the current level
            while (current != null) {
                // If current node has a left child, add it to the next level's linked list
                if (current.left != null) {
                    tail.next = current.left;  // Connect tail to this child
                    tail = tail.next;          // Move tail forward
                }

                // If current node has a right child, add it to the next level's linked list
                if (current.right != null) {
                    tail.next = current.right;  // Connect tail to this child
                    tail = tail.next;           // Move tail forward
                }

                // Move to the next node in the current level
                current = current.next;
            }

            // Move to the next level
            // dummy.next points to the first node of the next level
            current = dummy.next;

            // Reset dummy.next for the next iteration
            dummy.next = null;
        }

        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once
- For each node, we perform constant-time operations (checking children and updating pointers)

**Space Complexity: O(1)**

- We only use a few pointers (`current`, `dummy`, `tail`)
- No queue or recursion stack is used (the iteration is purely pointer-based)
- The output `next` pointers don't count as extra space since they're part of the required output

## Common Mistakes

1. **Forgetting to reset `dummy.next` to null**: After processing a level, if you don't reset `dummy.next`, it will still point to nodes from the previous level, causing an infinite loop or incorrect connections.

2. **Not handling empty trees**: Always check if `root` is `null` at the beginning. While our solution handles this (the while loop won't execute), it's good practice to explicitly mention this edge case.

3. **Assuming perfect binary tree**: The main difference from the easier version (Problem 116) is that nodes can have missing children. Don't assume every node has both left and right children.

4. **Incorrect order of processing children**: Always process left child before right child to maintain left-to-right order within each level. The problem doesn't explicitly require this, but it's the natural order and what's expected.

## When You'll See This Pattern

This "level traversal using existing pointers" pattern appears in several tree problems:

1. **Binary Tree Level Order Traversal (Problem 102)**: While typically solved with a queue, you could adapt this technique to solve it with O(1) extra space.

2. **Find Largest Value in Each Tree Row (Problem 515)**: You need to process each level separately to find the maximum value.

3. **Average of Levels in Binary Tree (Problem 637)**: Similar to above, but calculating averages instead of maximums.

The core pattern is: **When you need to process a tree level by level and you can modify the tree structure, consider using the tree's own nodes to create a linked list for the next level.**

## Key Takeaways

1. **Leverage the structure you're building**: The `next` pointers aren't just the output - they're also a tool that helps us traverse the tree without extra space.

2. **Dummy nodes simplify edge cases**: Using a dummy node at the start of a linked list makes it easier to handle the "first node" case without special conditions.

3. **Think in terms of levels, not individual nodes**: Many tree problems become simpler when you realize you need to process complete levels before moving deeper.

Related problems: [Populating Next Right Pointers in Each Node](/problem/populating-next-right-pointers-in-each-node)
