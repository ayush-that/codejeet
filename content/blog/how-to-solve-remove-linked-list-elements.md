---
title: "How to Solve Remove Linked List Elements — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Remove Linked List Elements. Easy difficulty, 53.9% acceptance rate. Topics: Linked List, Recursion."
date: "2026-07-09"
category: "dsa-patterns"
tags: ["remove-linked-list-elements", "linked-list", "recursion", "easy"]
---

# How to Solve Remove Linked List Elements

You're given the head of a singly linked list and a target value. Your task is to remove all nodes containing that value and return the new head. While this sounds straightforward, the challenge lies in handling edge cases like removing the head node itself, dealing with consecutive nodes to remove, and properly managing pointers without losing track of the rest of the list.

## Visual Walkthrough

Let's trace through an example: `[1 → 2 → 6 → 3 → 4 → 5 → 6]` with `val = 6`

**Step 1:** We start at head node with value 1. Since 1 ≠ 6, we keep it as our new head.

**Step 2:** Move to node with value 2. 2 ≠ 6, so we keep it. Current list: `[1 → 2]`

**Step 3:** Move to node with value 6. This equals our target! We need to remove it. We do this by making node 2 point to node 3 instead of node 6. Current list: `[1 → 2 → 3]`

**Step 4:** Move to node with value 3. 3 ≠ 6, keep it. Current list: `[1 → 2 → 3 → 4]`

**Step 5:** Move to node with value 4. 4 ≠ 6, keep it. Current list: `[1 → 2 → 3 → 4 → 5]`

**Step 6:** Move to node with value 5. 5 ≠ 6, keep it. Current list: `[1 → 2 → 3 → 4 → 5]`

**Step 7:** Move to node with value 6. This equals our target again! We remove it by making node 5 point to null instead of node 6. Final list: `[1 → 2 → 3 → 4 → 5]`

The tricky part is when the head itself needs to be removed, or when we have consecutive nodes to remove. We need a systematic way to handle all these cases.

## Brute Force Approach

A truly naive approach might involve creating a new linked list by traversing the original and only copying non-matching nodes. However, this requires O(n) extra space and doesn't teach us proper linked list manipulation.

The more instructive "brute force" thinking is what many candidates try first: simply traversing the list and removing nodes as we find them, without properly handling the head removal case. They might write:

```python
def removeElements(head, val):
    current = head
    while current:
        if current.val == val:
            # This doesn't work when current is head!
            # We need access to previous node
            pass
        current = current.next
```

The problem with this approach is that when we find a node to remove, we need to modify the `next` pointer of the _previous_ node. We can't do that if we only have a reference to the current node. This leads us to the proper iterative solution.

## Optimal Solution

The optimal solution uses a **dummy node** technique to handle edge cases elegantly. We create a dummy node that points to the head, then traverse the list with two pointers: one for the current node and one for the previous node. This way, we always have access to the previous node when we need to remove the current one.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def removeElements(head, val):
    """
    Remove all nodes with value equal to val from the linked list.

    Args:
        head: Head node of the linked list
        val: Target value to remove

    Returns:
        New head of the modified linked list
    """
    # Create a dummy node that points to the head
    # This helps handle cases where the head itself needs to be removed
    dummy = ListNode(0)
    dummy.next = head

    # Initialize pointers: prev starts at dummy, current starts at head
    prev = dummy
    current = head

    # Traverse the entire list
    while current:
        if current.val == val:
            # Found a node to remove
            # Skip over current node by linking prev to current's next
            prev.next = current.next
        else:
            # Current node stays in the list
            # Move prev forward to current position
            prev = current

        # Always move current forward to next node
        current = current.next

    # Return the new head (dummy.next)
    # This correctly handles cases where original head was removed
    return dummy.next
```

```javascript
// Time: O(n) | Space: O(1)
function removeElements(head, val) {
  /**
   * Remove all nodes with value equal to val from the linked list.
   *
   * @param {ListNode} head - Head node of the linked list
   * @param {number} val - Target value to remove
   * @return {ListNode} - New head of the modified linked list
   */

  // Create a dummy node that points to the head
  // This helps handle cases where the head itself needs to be removed
  const dummy = new ListNode(0);
  dummy.next = head;

  // Initialize pointers: prev starts at dummy, current starts at head
  let prev = dummy;
  let current = head;

  // Traverse the entire list
  while (current !== null) {
    if (current.val === val) {
      // Found a node to remove
      // Skip over current node by linking prev to current's next
      prev.next = current.next;
    } else {
      // Current node stays in the list
      // Move prev forward to current position
      prev = current;
    }

    // Always move current forward to next node
    current = current.next;
  }

  // Return the new head (dummy.next)
  // This correctly handles cases where original head was removed
  return dummy.next;
}
```

```java
// Time: O(n) | Space: O(1)
public ListNode removeElements(ListNode head, int val) {
    /**
     * Remove all nodes with value equal to val from the linked list.
     *
     * @param head - Head node of the linked list
     * @param val - Target value to remove
     * @return New head of the modified linked list
     */

    // Create a dummy node that points to the head
    // This helps handle cases where the head itself needs to be removed
    ListNode dummy = new ListNode(0);
    dummy.next = head;

    // Initialize pointers: prev starts at dummy, current starts at head
    ListNode prev = dummy;
    ListNode current = head;

    // Traverse the entire list
    while (current != null) {
        if (current.val == val) {
            // Found a node to remove
            // Skip over current node by linking prev to current's next
            prev.next = current.next;
        } else {
            // Current node stays in the list
            // Move prev forward to current position
            prev = current;
        }

        // Always move current forward to next node
        current = current.next;
    }

    // Return the new head (dummy.next)
    // This correctly handles cases where original head was removed
    return dummy.next;
}
```

</div>

**Alternative Recursive Solution:** While the iterative solution is usually preferred for its O(1) space complexity, a recursive solution can be more elegant:

```python
def removeElements(head, val):
    if not head:
        return None
    head.next = removeElements(head.next, val)
    return head.next if head.val == val else head
```

The recursive approach has O(n) space due to the call stack but demonstrates divide-and-conquer thinking: "Remove from the rest of the list, then decide what to do with the current node."

## Complexity Analysis

**Time Complexity:** O(n)

- We traverse the entire linked list exactly once
- Each node is visited and processed in constant time
- Even if we remove multiple nodes, we still only make one pass

**Space Complexity:** O(1) for iterative solution, O(n) for recursive

- Iterative: We only use a few extra pointers (dummy, prev, current)
- Recursive: The call stack grows with the depth of recursion, which equals the length of the list in worst case

## Common Mistakes

1. **Forgetting to handle head removal:** The most common error is not accounting for when the head node itself needs to be removed. Without a dummy node, you'd need special logic to update the head pointer when removing the first node.

2. **Losing the rest of the list when removing nodes:** When you find a node to remove, you must properly link the previous node to the next node. A common mistake is just moving pointers without updating the `next` reference of the previous node.

3. **Not moving prev pointer correctly:** When you remove a node, `prev` should stay where it is (since the next node after prev is now different). When you keep a node, `prev` should move forward. Mixing these up causes skipped nodes or infinite loops.

4. **Memory leaks (in languages without garbage collection):** In C++ or similar languages, candidates might forget to deallocate memory for removed nodes. While not an issue in Python/Java/JavaScript with garbage collection, it's good practice to mention this in interviews.

## When You'll See This Pattern

The dummy node technique is a fundamental pattern for linked list problems where you might need to modify the head. You'll see it in:

1. **Remove Nth Node From End of List (Medium):** Similar pointer manipulation, but you need to find the right node first.
2. **Reverse Linked List (Easy):** While reversible in-place, dummy nodes can simplify the logic.
3. **Merge Two Sorted Lists (Easy):** Dummy nodes help build the new merged list without special casing the first node.

The core idea is creating a "sentinel" node that sits before the actual head, eliminating edge cases and making pointer manipulation more uniform.

## Key Takeaways

1. **Dummy nodes eliminate edge cases:** When you might need to modify the head of a linked list, a dummy node that points to the head lets you treat all nodes uniformly.

2. **Two-pointer traversal is key for removal:** You always need access to both the current node and the previous node to properly remove nodes from a singly linked list.

3. **Draw it out:** Linked list problems become much clearer when you draw the nodes and pointers. Visualizing the "skip" operation (prev.next = current.next) helps avoid pointer errors.

This problem teaches fundamental linked list manipulation that forms the basis for more complex problems like reversing sublists, detecting cycles, and reordering lists.

Related problems: [Remove Element](/problem/remove-element), [Delete Node in a Linked List](/problem/delete-node-in-a-linked-list), [Delete the Middle Node of a Linked List](/problem/delete-the-middle-node-of-a-linked-list)
