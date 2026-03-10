---
title: "How to Solve Remove Nth Node From End of List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Nth Node From End of List. Medium difficulty, 51.0% acceptance rate. Topics: Linked List, Two Pointers."
date: "2026-03-05"
category: "dsa-patterns"
tags: ["remove-nth-node-from-end-of-list", "linked-list", "two-pointers", "medium"]
---

# How to Solve Remove Nth Node From End of List

You're given the head of a singly linked list and an integer `n`. Your task is to remove the nth node from the end of the list and return the modified head. The tricky part is that you only get to traverse the list once (for an optimal solution), and you need to handle edge cases like removing the first node or having only one node in the list.

## Visual Walkthrough

Let's trace through an example: `[1→2→3→4→5]` with `n = 2`. We want to remove the 2nd node from the end, which is node with value 4.

**Step 1:** Create a dummy node that points to the head. This helps handle edge cases like removing the first node.  
`dummy→1→2→3→4→5`

**Step 2:** Place two pointers: `fast` and `slow`, both starting at the dummy node.

**Step 3:** Move `fast` forward `n + 1` steps (n=2, so 3 steps):  
`fast` moves: dummy→1→2→3  
`slow` is still at dummy

**Step 4:** Now move both pointers one step at a time until `fast` reaches the end (null):

- Both move: `slow` at 1, `fast` at 4
- Both move: `slow` at 2, `fast` at 5
- Both move: `slow` at 3, `fast` at null

**Step 5:** `slow` is now at node 3, which is one node BEFORE the node we want to remove (node 4). We can remove node 4 by setting `slow.next = slow.next.next`.

**Result:** `[1→2→3→5]` — node 4 has been removed.

## Brute Force Approach

A naive approach would be to:

1. Traverse the entire list to count how many nodes there are (let's call it `length`)
2. Calculate which node to remove from the beginning: `position = length - n`
3. Traverse the list again to find the node at position `position - 1` (the node before the one to remove)
4. Remove the target node

This approach requires **two passes** through the list. While it works correctly, it's not optimal because we can solve this with just one pass. The time complexity is O(2n) which simplifies to O(n), but in interviews, showing you can optimize to a single pass demonstrates better problem-solving skills.

## Optimized Approach

The key insight is that we can find the nth node from the end in **one pass** using two pointers. If we place two pointers `n+1` nodes apart, when the front pointer reaches the end, the back pointer will be exactly one node before the node we want to remove.

Why `n+1` nodes apart? Because we need to stop at the node **before** the one we want to remove so we can update its `next` pointer. If we only placed them `n` nodes apart, the back pointer would land on the node to remove, and we wouldn't have access to the previous node (which we need for the removal).

The dummy node trick is crucial here. By adding a dummy node at the beginning that points to the head, we ensure that even if we need to remove the first node (when `n` equals the length of the list), we still have a consistent way to access the node before it.

## Optimal Solution

Here's the complete solution using the two-pointer technique with a dummy node:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
# n is the number of nodes in the linked list
def removeNthFromEnd(head, n):
    """
    Removes the nth node from the end of a singly linked list.

    Args:
        head: The head node of the linked list
        n: The position from the end to remove (1-indexed from end)

    Returns:
        The head of the modified linked list
    """
    # Create a dummy node that points to the head
    # This helps handle edge cases like removing the first node
    dummy = ListNode(0)
    dummy.next = head

    # Initialize two pointers, both starting at the dummy node
    slow = fast = dummy

    # Move fast pointer n+1 steps ahead
    # This creates a gap of n nodes between slow and fast
    for _ in range(n + 1):
        fast = fast.next

    # Move both pointers until fast reaches the end (None)
    # When fast is None, slow will be at the node BEFORE the one to remove
    while fast is not None:
        slow = slow.next
        fast = fast.next

    # Remove the nth node from the end by skipping it
    # slow.next is the node to remove, so we skip it
    slow.next = slow.next.next

    # Return dummy.next, which is the new head
    # (could be original head or head.next if first node was removed)
    return dummy.next
```

```javascript
// Time: O(n) | Space: O(1)
// n is the number of nodes in the linked list
function removeNthFromEnd(head, n) {
  /**
   * Removes the nth node from the end of a singly linked list.
   *
   * @param {ListNode} head - The head node of the linked list
   * @param {number} n - The position from the end to remove (1-indexed from end)
   * @return {ListNode} The head of the modified linked list
   */

  // Create a dummy node that points to the head
  // This helps handle edge cases like removing the first node
  const dummy = new ListNode(0);
  dummy.next = head;

  // Initialize two pointers, both starting at the dummy node
  let slow = dummy;
  let fast = dummy;

  // Move fast pointer n+1 steps ahead
  // This creates a gap of n nodes between slow and fast
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }

  // Move both pointers until fast reaches the end (null)
  // When fast is null, slow will be at the node BEFORE the one to remove
  while (fast !== null) {
    slow = slow.next;
    fast = fast.next;
  }

  // Remove the nth node from the end by skipping it
  // slow.next is the node to remove, so we skip it
  slow.next = slow.next.next;

  // Return dummy.next, which is the new head
  // (could be original head or head.next if first node was removed)
  return dummy.next;
}
```

```java
// Time: O(n) | Space: O(1)
// n is the number of nodes in the linked list
public ListNode removeNthFromEnd(ListNode head, int n) {
    /**
     * Removes the nth node from the end of a singly linked list.
     *
     * @param head The head node of the linked list
     * @param n The position from the end to remove (1-indexed from end)
     * @return The head of the modified linked list
     */

    // Create a dummy node that points to the head
    // This helps handle edge cases like removing the first node
    ListNode dummy = new ListNode(0);
    dummy.next = head;

    // Initialize two pointers, both starting at the dummy node
    ListNode slow = dummy;
    ListNode fast = dummy;

    // Move fast pointer n+1 steps ahead
    // This creates a gap of n nodes between slow and fast
    for (int i = 0; i <= n; i++) {
        fast = fast.next;
    }

    // Move both pointers until fast reaches the end (null)
    // When fast is null, slow will be at the node BEFORE the one to remove
    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }

    // Remove the nth node from the end by skipping it
    // slow.next is the node to remove, so we skip it
    slow.next = slow.next.next;

    // Return dummy.next, which is the new head
    // (could be original head or head.next if first node was removed)
    return dummy.next;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes in the linked list. We traverse the list exactly once with our two pointers. Even though we move `fast` ahead first, the total number of steps taken by both pointers combined is still linear with respect to the list length.

**Space Complexity:** O(1) because we only use a constant amount of extra space (the dummy node and two pointers). The modification is done in-place on the existing list.

## Common Mistakes

1. **Forgetting the dummy node:** Without a dummy node, removing the first node becomes tricky. You'd need special case handling when `n` equals the length of the list. The dummy node elegantly handles all cases uniformly.

2. **Off-by-one errors in pointer placement:** Some candidates move `fast` only `n` steps instead of `n+1`. This causes `slow` to land on the node to remove rather than the node before it, making removal impossible without access to the previous node.

3. **Not checking for null when n equals list length:** When `n` equals the number of nodes, you're removing the head. Without proper handling, you might try to access `fast.next` when `fast` is already null after the initial advancement.

4. **Returning head instead of dummy.next:** After removing the first node, `head` is no longer the start of the list. You must return `dummy.next` which correctly points to the new head (whether it changed or not).

## When You'll See This Pattern

The two-pointer technique with a fixed gap is a common pattern in linked list problems:

1. **Middle of the Linked List (LeetCode 876):** Use two pointers moving at different speeds (slow moves 1 step, fast moves 2 steps). When fast reaches the end, slow is at the middle.

2. **Linked List Cycle (LeetCode 141):** Use slow and fast pointers to detect cycles. If there's a cycle, the fast pointer will eventually lap the slow pointer.

3. **Find the Duplicate Number (LeetCode 287):** This array problem uses the same slow/fast pointer concept but applied to array indices, treating the array as a linked list.

The pattern is useful whenever you need to find a specific position relative to the end or need to maintain a relationship between two points in a sequence.

## Key Takeaways

1. **The dummy node trick** simplifies edge cases in linked list manipulation. By adding an extra node at the beginning, you avoid special handling for operations on the first node.

2. **Two pointers with a fixed gap** is an efficient way to find the nth element from the end in one pass. The gap should be `n+1` when you need access to the node before the target.

3. **Visualize with concrete examples** before coding. Drawing the pointers at each step helps avoid off-by-one errors and builds intuition for why the solution works.

Related problems: [Swapping Nodes in a Linked List](/problem/swapping-nodes-in-a-linked-list), [Delete N Nodes After M Nodes of a Linked List](/problem/delete-n-nodes-after-m-nodes-of-a-linked-list), [Delete the Middle Node of a Linked List](/problem/delete-the-middle-node-of-a-linked-list)
