---
title: "How to Solve Flatten a Multilevel Doubly Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Flatten a Multilevel Doubly Linked List. Medium difficulty, 62.6% acceptance rate. Topics: Linked List, Depth-First Search, Doubly-Linked List."
date: "2027-07-08"
category: "dsa-patterns"
tags:
  [
    "flatten-a-multilevel-doubly-linked-list",
    "linked-list",
    "depth-first-search",
    "doubly-linked-list",
    "medium",
  ]
---

# How to Solve Flatten a Multilevel Doubly Linked List

You're given a doubly linked list where each node has `next`, `prev`, and `child` pointers. The `child` pointer may point to another doubly linked list, which itself may have children, creating a multilevel structure. Your task is to flatten this hierarchy into a single-level doubly linked list where all nodes appear in a depth-first order. The tricky part is maintaining proper `prev` and `next` connections while traversing this nested structure without losing track of nodes.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this multilevel list:

```
1 ↔ 2 ↔ 3 ↔ 4 ↔ 5 ↔ 6
    ↓
    7 ↔ 8 ↔ 9 ↔ 10
        ↓
        11 ↔ 12
```

Where `↔` represents `next`/`prev` connections and `↓` represents `child` pointers.

**Step-by-step flattening process:**

1. **Start at node 1**: No child, move to node 2
2. **At node 2**: Has child pointing to node 7
   - Save node 3 (the next node after 2) for later
   - Connect 2 ↔ 7 (2.next = 7, 7.prev = 2)
   - Move to the child list starting at 7
3. **Traverse 7 → 8**: No children yet
4. **At node 8**: Has child pointing to node 11
   - Save node 9 (next after 8)
   - Connect 8 ↔ 11 (8.next = 11, 11.prev = 8)
   - Move to child list starting at 11
5. **Traverse 11 → 12**: End of this child list
6. **Connect back to saved node 9**:
   - Connect 12 ↔ 9 (12.next = 9, 9.prev = 12)
   - Continue from node 9
7. **Traverse 9 → 10**: End of this child list
8. **Connect back to saved node 3**:
   - Connect 10 ↔ 3 (10.next = 3, 3.prev = 10)
9. **Continue with original list**: 3 → 4 → 5 → 6

Final flattened list: `1 ↔ 2 ↔ 7 ↔ 8 ↔ 11 ↔ 12 ↔ 9 ↔ 10 ↔ 3 ↔ 4 ↔ 5 ↔ 6`

The key insight: when we encounter a child, we need to fully process that child list before returning to continue with the original `next` node. This is a **depth-first traversal** pattern.

## Brute Force Approach

A naive approach might try to collect all nodes into an array and then rebuild the list:

1. Traverse the list linearly
2. Whenever you encounter a child, recursively collect nodes from the child list
3. Store all nodes in an array in depth-first order
4. Rebuild a new doubly linked list from the array

**Why this isn't optimal:**

- **Extra O(n) space** for the array
- **Unnecessary node creation** if we rebuild a new list instead of modifying in-place
- **More complex than needed** - we can modify the original list directly

While this approach would work and give O(n) time complexity, the space complexity would be O(n) for the array, and it doesn't take advantage of the fact that we can rearrange the existing nodes in-place.

## Optimized Approach

The optimal solution uses an **iterative depth-first approach** with a stack or careful pointer manipulation. The key insight is that when we encounter a node with a child:

1. We need to process the entire child list before continuing with the original `next` node
2. We must save the original `next` pointer somewhere
3. After processing the child list, we need to connect the last node of the child list back to the saved `next` node

We can implement this with either:

- **A stack** to save nodes to process later (explicit DFS)
- **Pointer manipulation** to traverse and reconnect nodes in-place (implicit DFS)

The stack approach is more intuitive:

1. Start with the head node
2. While we have nodes to process:
   - If current node has a child:
     - Save the `next` node to the stack (if it exists)
     - Connect current node to its child
     - Move to the child
   - Else if current node has a `next`:
     - Move to the next node
   - Else (end of current level):
     - If stack has saved nodes, pop one and connect it to current node
     - Move to that node

The pointer manipulation approach is more space-efficient (O(1) space) and modifies the list in-place by carefully reconnecting nodes as we traverse.

## Optimal Solution

Here's the optimal O(1) space solution that modifies the list in-place:

<div class="code-group">

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val, prev, next, child):
        self.val = val
        self.prev = prev
        self.next = next
        self.child = child
"""

class Solution:
    def flatten(self, head: 'Optional[Node]') -> 'Optional[Node]':
        """
        Time: O(n) - We visit each node exactly once
        Space: O(1) - We only use a few pointers, no extra data structures
        """
        if not head:
            return None

        current = head

        while current:
            # Case 1: Current node has no child, just move to next node
            if not current.child:
                current = current.next
                continue

            # Case 2: Current node has a child
            # Find the tail of the child list
            child_tail = current.child
            while child_tail.next:
                child_tail = child_tail.next

            # Connect child_tail to current.next (if current.next exists)
            if current.next:
                child_tail.next = current.next
                current.next.prev = child_tail

            # Connect current to its child
            current.next = current.child
            current.child.prev = current

            # IMPORTANT: Set child pointer to None after flattening
            current.child = None

            # Move to the next node (which is now the former child head)
            current = current.next

        return head
```

```javascript
/**
 * // Definition for a Node.
 * function Node(val,prev,next,child) {
 *    this.val = val;
 *    this.prev = prev;
 *    this.next = next;
 *    this.child = child;
 * };
 */

/**
 * @param {Node} head
 * @return {Node}
 */
var flatten = function (head) {
  /**
   * Time: O(n) - We visit each node exactly once
   * Space: O(1) - We only use a few pointers, no extra data structures
   */
  if (!head) return null;

  let current = head;

  while (current) {
    // Case 1: Current node has no child, just move to next node
    if (!current.child) {
      current = current.next;
      continue;
    }

    // Case 2: Current node has a child
    // Find the tail of the child list
    let childTail = current.child;
    while (childTail.next) {
      childTail = childTail.next;
    }

    // Connect childTail to current.next (if current.next exists)
    if (current.next) {
      childTail.next = current.next;
      current.next.prev = childTail;
    }

    // Connect current to its child
    current.next = current.child;
    current.child.prev = current;

    // IMPORTANT: Set child pointer to null after flattening
    current.child = null;

    // Move to the next node (which is now the former child head)
    current = current.next;
  }

  return head;
};
```

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public Node prev;
    public Node next;
    public Node child;
};
*/

class Solution {
    public Node flatten(Node head) {
        /**
         * Time: O(n) - We visit each node exactly once
         * Space: O(1) - We only use a few pointers, no extra data structures
         */
        if (head == null) return null;

        Node current = head;

        while (current != null) {
            // Case 1: Current node has no child, just move to next node
            if (current.child == null) {
                current = current.next;
                continue;
            }

            // Case 2: Current node has a child
            // Find the tail of the child list
            Node childTail = current.child;
            while (childTail.next != null) {
                childTail = childTail.next;
            }

            // Connect childTail to current.next (if current.next exists)
            if (current.next != null) {
                childTail.next = current.next;
                current.next.prev = childTail;
            }

            // Connect current to its child
            current.next = current.child;
            current.child.prev = current;

            // IMPORTANT: Set child pointer to null after flattening
            current.child = null;

            // Move to the next node (which is now the former child head)
            current = current.next;
        }

        return head;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once in the main while loop
- The inner while loop to find the tail of child lists doesn't increase the overall complexity because each node is only visited once as part of a child tail search
- In total, we traverse each edge (next/child pointer) at most once

**Space Complexity: O(1)**

- We only use a constant amount of extra space (`current`, `childTail` pointers)
- We modify the list in-place without using any auxiliary data structures like stacks or arrays
- This is the optimal space complexity for this problem

## Common Mistakes

1. **Forgetting to set `child` pointers to `None`/`null` after flattening**
   - After connecting a child list, you must set `current.child = null`
   - Otherwise, you haven't fully flattened the list
   - The problem expects all `child` pointers to be null in the final result

2. **Not handling the connection between child tail and original next properly**
   - When a node has both a child and a next node, you must connect the tail of the child list to the original next
   - Forgetting this results in losing part of the original list
   - Always check: `if current.next: child_tail.next = current.next`

3. **Incorrectly updating `prev` pointers in the child list**
   - When you connect `current.next = current.child`, you must also set `current.child.prev = current`
   - Doubly linked lists require both forward and backward connections
   - Test your solution by traversing both forward and backward

4. **Infinite loops from circular references**
   - If you forget to nullify child pointers or incorrectly connect nodes, you might create cycles
   - Always verify your connections don't create loops
   - Consider edge cases like empty lists, single nodes, and deeply nested structures

## When You'll See This Pattern

This problem combines **linked list manipulation** with **depth-first traversal**, a pattern that appears in several other problems:

1. **Flatten Binary Tree to Linked List (LeetCode 114)**
   - Similar concept: flatten a tree structure into a linked list
   - Instead of `child` pointers, you have `left` and `right` pointers
   - The traversal order is different (pre-order vs. depth-first), but the core idea of restructuring a hierarchical data structure into a linear one is the same

2. **Correct a Binary Tree (LeetCode 1660)**
   - Involves traversing and modifying tree structures
   - Requires careful pointer manipulation similar to this problem
   - Tests your ability to handle complex pointer reassignments

3. **Clone Graph (LeetCode 133)**
   - While not about flattening, it uses similar depth-first traversal with careful pointer/node management
   - The pattern of traversing a structure while modifying connections appears here too

## Key Takeaways

1. **Depth-first traversal can be implemented iteratively without a stack** when you can modify the structure in-place. Look for opportunities to use the existing pointers to guide your traversal.

2. **When flattening hierarchical structures**, always think about what needs to be saved (the "next" pointer at each level) and how to reconnect after processing deeper levels.

3. **Doubly linked lists require bidirectional maintenance** - whenever you update `next` pointers, check if you also need to update corresponding `prev` pointers. This is a common source of bugs in linked list problems.

Related problems: [Flatten Binary Tree to Linked List](/problem/flatten-binary-tree-to-linked-list), [Correct a Binary Tree](/problem/correct-a-binary-tree)
