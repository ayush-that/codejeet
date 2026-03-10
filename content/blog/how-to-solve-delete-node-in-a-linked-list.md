---
title: "How to Solve Delete Node in a Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Delete Node in a Linked List. Medium difficulty, 83.6% acceptance rate. Topics: Linked List."
date: "2026-05-31"
category: "dsa-patterns"
tags: ["delete-node-in-a-linked-list", "linked-list", "medium"]
---

# How to Solve Delete Node in a Linked List

This problem presents a unique twist on linked list deletion: you're given direct access to the node to delete, but **no access to the head** of the list. This means you can't traverse from the beginning to find the previous node, which is normally required for deletion in a singly linked list. The challenge is figuring out how to delete a node when you can only work forward from it, not backward.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have this linked list:

```
4 → 5 → 1 → 9
```

We're given the node with value `5` to delete. Normally, to delete node `5`, we'd need access to node `4` (the previous node) to update its `next` pointer to skip over `5` and point directly to `1`.

But here's the catch: we only have the node `5` itself. We can't access node `4` because we don't have the head, and singly linked lists only move forward.

Here's the clever workaround:

1. **Instead of deleting the current node, we copy the next node's value into the current node**
   - Node `5` gets value `1` copied from the next node
   - List becomes: `4 → 1 → 1 → 9`

2. **Then we skip over the next node (which now has a duplicate value)**
   - Update `5.next` to point to `9` instead of the first `1`
   - List becomes: `4 → 1 → 9`

Visually, it looks like we "moved" the next node's value into the current node, then deleted the next node instead. The original node `5` still exists physically, but it now holds value `1`, effectively becoming what was previously the next node.

## Brute Force Approach

There's no traditional brute force for this problem because the constraints make brute force impossible. A naive candidate might think:

"I need to find the previous node, so I should traverse from the beginning. But wait—I don't have the head! Maybe I can reconstruct the list somehow?"

This thought process reveals why the problem is interesting: the standard deletion approach (find previous node, update its `next` pointer) simply won't work given the constraints. You cannot traverse backward in a singly linked list, and without the head, you can't traverse forward to find the previous node.

Some candidates might consider:

- Trying to store all nodes in an array and reconstruct the list (impossible without head)
- Attempting to modify node values in some illegal way
- Giving up and saying "it's impossible"

The key insight is realizing that **we don't actually need to delete the physical node we're given**—we just need to make the list look like that node was deleted.

## Optimized Approach

The optimal solution uses a clever trick that works because:

1. **We're guaranteed the node isn't the tail** (problem states this explicitly)
2. **All values are unique** (so copying values won't create confusion)

Here's the step-by-step reasoning:

**Step 1: Copy the next node's value**
Since we can't access the previous node, we can't update its `next` pointer. But we can access the next node! If we copy the next node's value into our current node, then from a value perspective, our current node becomes the next node.

**Step 2: Skip over the next node**
Now that our current node has the next node's value, we can safely bypass the next node. We update `current.next` to point to `next.next`, effectively removing the next node from the list.

**Why this works:**

- The original node we wanted to delete now contains the next node's value
- The next node (which held that value) is removed from the list
- From the list's perspective, it appears the target node was deleted
- All pointers remain valid and no nodes are orphaned

**Edge case consideration:**
The problem guarantees the given node isn't the tail, so `node.next` always exists. This is crucial because our solution requires accessing `node.next.val` and `node.next.next`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def deleteNode(node):
    """
    Deletes a node from a linked list when given only that node.

    The trick: Instead of deleting the given node (which would require
    access to the previous node), we copy the next node's value into
    the current node, then skip over the next node.

    Args:
        node: The node to "delete" from the linked list
    """
    # Step 1: Copy the value from the next node into the current node
    # This makes the current node effectively become the next node
    # Example: If node has value 5 and next has value 1, node becomes 1
    node.val = node.next.val

    # Step 2: Update the current node's next pointer to skip the next node
    # We're essentially removing the node whose value we just copied
    # Example: If node.next was pointing to node with value 1, and that
    # node's next pointed to node with value 9, now node.next points to 9
    node.next = node.next.next

    # The original "node" still exists physically, but it now has:
    # - The value that was in the next node
    # - The next pointer that was in the next node
    # So from the list's perspective, the original node is gone
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Deletes a node from a linked list when given only that node.
 *
 * The trick: Instead of deleting the given node (which would require
 * access to the previous node), we copy the next node's value into
 * the current node, then skip over the next node.
 *
 * @param {ListNode} node - The node to "delete" from the linked list
 * @return {void} Do not return anything, modify node in-place instead.
 */
function deleteNode(node) {
  // Step 1: Copy the value from the next node into the current node
  // This makes the current node effectively become the next node
  // Example: If node has value 5 and next has value 1, node becomes 1
  node.val = node.next.val;

  // Step 2: Update the current node's next pointer to skip the next node
  // We're essentially removing the node whose value we just copied
  // Example: If node.next was pointing to node with value 1, and that
  // node's next pointed to node with value 9, now node.next points to 9
  node.next = node.next.next;

  // The original "node" still exists physically, but it now has:
  // - The value that was in the next node
  // - The next pointer that was in the next node
  // So from the list's perspective, the original node is gone
}
```

```java
// Time: O(1) | Space: O(1)
/**
 * Deletes a node from a linked list when given only that node.
 *
 * The trick: Instead of deleting the given node (which would require
 * access to the previous node), we copy the next node's value into
 * the current node, then skip over the next node.
 *
 * @param node The node to "delete" from the linked list
 */
public void deleteNode(ListNode node) {
    // Step 1: Copy the value from the next node into the current node
    // This makes the current node effectively become the next node
    // Example: If node has value 5 and next has value 1, node becomes 1
    node.val = node.next.val;

    // Step 2: Update the current node's next pointer to skip the next node
    // We're essentially removing the node whose value we just copied
    // Example: If node.next was pointing to node with value 1, and that
    // node's next pointed to node with value 9, now node.next points to 9
    node.next = node.next.next;

    // The original "node" still exists physically, but it now has:
    // - The value that was in the next node
    // - The next pointer that was in the next node
    // So from the list's perspective, the original node is gone
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform exactly two operations: copying a value and updating a pointer
- Both operations take constant time regardless of list size
- No traversal of the list is needed

**Space Complexity: O(1)**

- We only use a constant amount of extra space
- No additional data structures are created
- All modifications are done in-place on the existing nodes

The efficiency comes from the clever observation that we don't need to actually delete the given node—we just need to make the list appear as if it was deleted.

## Common Mistakes

1. **Trying to access the previous node**: Many candidates instinctively try to find the previous node, not realizing it's impossible without the head. Remember: singly linked lists only move forward, and without the head, you can't reach any node before the given one.

2. **Forgetting the node isn't the tail**: The solution assumes `node.next` exists. If you try to apply this solution to a tail node, you'll get a null pointer error. Always check problem constraints—here it's guaranteed the node isn't the tail.

3. **Attempting to set node to null**: Some candidates think `node = null` would delete the node, but this only changes the local reference, not the actual list structure. The previous node would still point to the original node.

4. **Overcomplicating with value shifting**: A few candidates try to shift all subsequent values backward, which would be O(n) time. The two-step copy-and-skip approach is optimal at O(1).

## When You'll See This Pattern

This "copy-and-skip" technique appears in problems where you need to modify linked list nodes without full traversal access:

1. **Remove Linked List Elements (LeetCode 203)**: While this problem gives you the head, the mental model of "bypassing" nodes is similar. You practice updating pointers to skip unwanted nodes.

2. **Remove Nodes From Linked List (LeetCode 2487)**: This problem requires removing nodes based on certain conditions, reinforcing the pointer manipulation skills needed for efficient linked list modification.

3. **Delete Nodes From Linked List Present in Array (LeetCode 3217)**: Another variation where you delete multiple nodes, requiring careful pointer updates to maintain list integrity.

The core pattern is **modifying linked lists in-place with minimal traversal** by cleverly manipulating values and pointers rather than physically removing and recreating nodes.

## Key Takeaways

1. **When you can't go backward, bring the next node forward**: In singly linked lists without access to previous nodes, sometimes the solution is to copy data from the next node and then skip it, rather than trying to delete the current node directly.

2. **Constraints are clues**: The guarantees that "the node is not the tail" and "all values are unique" aren't just random details—they're essential for the O(1) solution to work. Always read constraints carefully.

3. **Physical vs. logical deletion**: In linked list problems, what matters is the logical structure, not necessarily which physical node holds which value. Sometimes keeping a node but changing its value achieves the same result as deleting it.

This problem teaches creative thinking within constraints—a valuable skill for system design and optimization problems where you can't always use the obvious approach.

Related problems: [Remove Linked List Elements](/problem/remove-linked-list-elements), [Remove Nodes From Linked List](/problem/remove-nodes-from-linked-list), [Delete Nodes From Linked List Present in Array](/problem/delete-nodes-from-linked-list-present-in-array)
