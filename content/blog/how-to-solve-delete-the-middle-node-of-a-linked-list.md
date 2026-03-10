---
title: "How to Solve Delete the Middle Node of a Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Delete the Middle Node of a Linked List. Medium difficulty, 59.5% acceptance rate. Topics: Linked List, Two Pointers."
date: "2026-11-07"
category: "dsa-patterns"
tags: ["delete-the-middle-node-of-a-linked-list", "linked-list", "two-pointers", "medium"]
---

# How to Solve Delete the Middle Node of a Linked List

You're given the head of a singly linked list and need to delete its middle node. The middle is defined as the node at index `⌊n/2⌋` in 0-based indexing, where `n` is the list length. What makes this problem interesting is that you need to find and remove a node based on its position without knowing the list length in advance — requiring careful pointer manipulation in a single pass.

## Visual Walkthrough

Let's trace through the example `[1,2,3,4,5]` step by step:

**Initial list:** 1 → 2 → 3 → 4 → 5 → None  
Length `n = 5`, middle index = `⌊5/2⌋` = 2 (0-based), so we need to delete node with value 3.

**Step 1:** Initialize two pointers: `slow` and `fast` both at head (node 1). Also create a `prev` pointer at None to track the node before `slow`.

**Step 2:** Move pointers:

- `fast` moves two steps: from 1 → 3
- `slow` moves one step: from 1 → 2
- `prev` moves to old `slow` position: from None → 1

**Step 3:** Move pointers again:

- `fast` moves two steps: from 3 → 5
- `slow` moves one step: from 2 → 3 (this is our middle node!)
- `prev` moves to old `slow` position: from 1 → 2

**Step 4:** Since `fast.next` is None (we've reached the end), we stop. `slow` points to the middle node (3), and `prev` points to the node before it (2).

**Step 5:** Delete the middle node by setting `prev.next = slow.next`. Now 2 points directly to 4.

**Final list:** 1 → 2 → 4 → 5 → None

## Brute Force Approach

A naive approach would be:

1. Traverse the entire list once to count its length `n`
2. Calculate middle index = `⌊n/2⌋`
3. Traverse again to find the node at position `middle - 1` (the node before the middle)
4. Update its `next` pointer to skip the middle node

While this works, it requires two passes through the list. The time complexity is O(2n) = O(n), which is acceptable, but interviewers typically expect the more elegant single-pass solution using the fast-slow pointer technique (also called the tortoise and hare algorithm).

The brute force approach misses the opportunity to demonstrate your understanding of efficient pointer manipulation, which is a key skill for linked list problems.

## Optimized Approach

The key insight is that we can find the middle node in a single pass using two pointers moving at different speeds:

- **Slow pointer:** Moves one node at a time
- **Fast pointer:** Moves two nodes at a time

When the fast pointer reaches the end of the list, the slow pointer will be exactly at the middle. This is because the fast pointer covers twice the distance in the same time.

However, to delete a node in a singly linked list, we need access to the node _before_ it. We solve this by maintaining a third pointer (`prev`) that always stays one step behind the slow pointer.

**Why this works mathematically:** If the list has `n` nodes and the fast pointer moves at twice the speed, when the fast pointer has moved `n` steps (reaching the end), the slow pointer has moved `n/2` steps — exactly to the middle.

## Optimal Solution

Here's the complete solution using the fast-slow pointer technique:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
# n = number of nodes in the linked list
def deleteMiddle(head):
    """
    Deletes the middle node of a singly linked list.
    Returns the head of the modified list.
    """
    # Edge case: if list is empty or has only one node
    if head is None or head.next is None:
        return None

    # Initialize pointers
    slow = head      # Will end up at middle node
    fast = head      # Will reach end when slow reaches middle
    prev = None      # Will track node before slow

    # Move fast pointer twice as fast as slow pointer
    # When fast reaches end, slow will be at middle
    while fast is not None and fast.next is not None:
        # Move fast two steps
        fast = fast.next.next

        # Update prev to current slow position
        prev = slow

        # Move slow one step
        slow = slow.next

    # Now slow points to middle node, prev points to node before it
    # Delete middle node by skipping it
    prev.next = slow.next

    # Optional: free the middle node memory (not needed in Python)
    # slow.next = None

    return head
```

```javascript
// Time: O(n) | Space: O(1)
// n = number of nodes in the linked list
function deleteMiddle(head) {
  /**
   * Deletes the middle node of a singly linked list.
   * Returns the head of the modified list.
   */

  // Edge case: if list is empty or has only one node
  if (head === null || head.next === null) {
    return null;
  }

  // Initialize pointers
  let slow = head; // Will end up at middle node
  let fast = head; // Will reach end when slow reaches middle
  let prev = null; // Will track node before slow

  // Move fast pointer twice as fast as slow pointer
  // When fast reaches end, slow will be at middle
  while (fast !== null && fast.next !== null) {
    // Move fast two steps
    fast = fast.next.next;

    // Update prev to current slow position
    prev = slow;

    // Move slow one step
    slow = slow.next;
  }

  // Now slow points to middle node, prev points to node before it
  // Delete middle node by skipping it
  prev.next = slow.next;

  // Optional: free the middle node memory
  // slow.next = null;

  return head;
}
```

```java
// Time: O(n) | Space: O(1)
// n = number of nodes in the linked list
public ListNode deleteMiddle(ListNode head) {
    /**
     * Deletes the middle node of a singly linked list.
     * Returns the head of the modified list.
     */

    // Edge case: if list is empty or has only one node
    if (head == null || head.next == null) {
        return null;
    }

    // Initialize pointers
    ListNode slow = head;    // Will end up at middle node
    ListNode fast = head;    // Will reach end when slow reaches middle
    ListNode prev = null;    // Will track node before slow

    // Move fast pointer twice as fast as slow pointer
    // When fast reaches end, slow will be at middle
    while (fast != null && fast.next != null) {
        // Move fast two steps
        fast = fast.next.next;

        // Update prev to current slow position
        prev = slow;

        // Move slow one step
        slow = slow.next;
    }

    // Now slow points to middle node, prev points to node before it
    // Delete middle node by skipping it
    prev.next = slow.next;

    // Optional: free the middle node memory
    // slow.next = null;

    return head;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We traverse the list exactly once with our pointers. The fast pointer moves through approximately `n/2` iterations (since it moves two steps each time), and the slow pointer moves through all `n/2` iterations. This gives us O(n/2) = O(n) time.

**Space Complexity:** O(1)  
We only use three pointers (`slow`, `fast`, `prev`) regardless of the input size. No additional data structures are created, so we use constant extra space.

## Common Mistakes

1. **Forgetting the single-node edge case:** When the list has only one node, deleting the middle means deleting the only node, so we should return `None/null`. Many candidates forget this and try to access `prev.next` when `prev` is still `None`.

2. **Incorrect loop condition:** Using `while fast.next is not None` without also checking `fast is not None` can cause a null pointer error when the list has an even number of nodes. The correct condition is `while fast is not None and fast.next is not None`.

3. **Not updating `prev` correctly:** Some candidates try to track `prev` by setting it to `slow` _after_ moving `slow`. This puts `prev` at the same position as `slow`, not one step behind. Always update `prev` to the current `slow` _before_ moving `slow`.

4. **Deleting the wrong node for even-length lists:** Remember the problem defines middle as `⌊n/2⌋` in 0-based indexing. For a list of length 4 (indices 0,1,2,3), `⌊4/2⌋ = 2`, so we delete node at index 2 (the third node). Our algorithm correctly handles this because when `fast` reaches the end, `slow` will be at the second middle node in even-length lists.

## When You'll See This Pattern

The fast-slow pointer technique (tortoise and hare) appears in many linked list problems:

1. **Remove Nth Node From End of List (LeetCode #19):** Use two pointers spaced n nodes apart. When the front pointer reaches the end, the back pointer is at the (n+1)th node from the end.

2. **Linked List Cycle (LeetCode #141):** Use fast and slow pointers to detect cycles. If there's a cycle, the fast pointer will eventually lap the slow pointer.

3. **Find the Duplicate Number (LeetCode #287):** This array problem uses the same concept by treating the array as a linked list where values point to indices.

4. **Palindrome Linked List (LeetCode #234):** Use fast-slow pointers to find the middle, then reverse the second half to compare with the first half.

The pattern is useful whenever you need to find a specific position (middle, nth from end) or detect cycles in a linked list with O(1) space.

## Key Takeaways

1. **Fast-slow pointers find the middle in one pass:** When you need to find the middle of a linked list without knowing its length, use two pointers moving at different speeds. The slow pointer will be at the middle when the fast pointer reaches the end.

2. **Always track the previous node for deletions:** In singly linked lists, you need access to the node before the one you want to delete. Maintain a `prev` pointer that updates in sync with your traversal.

3. **Handle edge cases first:** Check for empty lists and single-node lists before starting pointer manipulation. These cases often have different behavior than the general case.

Related problems: [Remove Nth Node From End of List](/problem/remove-nth-node-from-end-of-list), [Reorder List](/problem/reorder-list), [Remove Linked List Elements](/problem/remove-linked-list-elements)
