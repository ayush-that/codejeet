---
title: "How to Solve Reverse Linked List II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reverse Linked List II. Medium difficulty, 51.0% acceptance rate. Topics: Linked List."
date: "2026-08-22"
category: "dsa-patterns"
tags: ["reverse-linked-list-ii", "linked-list", "medium"]
---

# How to Solve Reverse Linked List II

You're given a singly linked list and two positions `left` and `right`. Your task is to reverse the nodes between these positions (inclusive) while keeping the rest of the list intact. This problem is tricky because you need to carefully detach and reconnect multiple pointers without losing track of the nodes before and after the reversed section.

## Visual Walkthrough

Let's trace through an example: `[1 → 2 → 3 → 4 → 5]` with `left = 2` and `right = 4`.

**Step 1: Identify the boundaries**
We need to reverse nodes 2, 3, and 4. This means:

- Node before the reversed section: `1` (we'll call this `prev_node`)
- First node to reverse: `2` (we'll call this `start_node`)
- Last node to reverse: `4` (we'll call this `end_node`)
- Node after the reversed section: `5` (we'll call this `next_node`)

**Step 2: Reach the starting position**
We traverse the list until we're at position `left - 1` (node `1`). This gives us `prev_node`.

**Step 3: Reverse the middle section**
From `start_node` (node `2`) to `end_node` (node `4`), we perform a standard linked list reversal:

- `2 → 3 → 4` becomes `4 → 3 → 2`

**Step 4: Reconnect the pieces**
Now we have:

- `prev_node` (node `1`) still pointing to node `2`
- The reversed section: `4 → 3 → 2`
- `next_node` (node `5`)

We need to:

1. Connect `prev_node.next` to the new head of reversed section (node `4`)
2. Connect the tail of reversed section (node `2`) to `next_node` (node `5`)

Final result: `[1 → 4 → 3 → 2 → 5]`

## Brute Force Approach

A naive approach might be to:

1. Extract all node values into an array
2. Reverse the subarray from `left` to `right`
3. Rebuild the entire linked list from the modified array

While this works, it has several issues:

- **O(n) extra space** for the array
- **O(n) time** to rebuild the list
- **Not in-place** - violates the spirit of linked list manipulation problems
- **Inefficient** for large lists

The brute force approach misses the opportunity to practice pointer manipulation, which is exactly what interviewers want to test for linked list problems.

## Optimized Approach

The key insight is that we can reverse the sublist **in-place** using pointer manipulation. We need to:

1. **Find the boundaries**: Traverse to the node just before position `left` (if it exists)
2. **Reverse the middle**: Use the standard three-pointer reversal technique on nodes from `left` to `right`
3. **Reconnect**: Carefully stitch the reversed section back into the original list

The tricky parts are:

- Handling the case when `left = 1` (no `prev_node`)
- Keeping track of the new connections during reversal
- Not losing references to nodes outside the reversed section

We'll use a **dummy node** to simplify edge cases. The dummy node sits before the head, so even if `left = 1`, we still have a `prev_node` to work with.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) - we traverse the list once
# Space: O(1) - we use only constant extra space
def reverseBetween(head, left, right):
    # Edge case: empty list or no reversal needed
    if not head or left == right:
        return head

    # Create a dummy node to handle edge cases when left = 1
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy  # This will point to the node before the reversal section

    # Step 1: Move prev to the node just before position left
    # We need to move (left - 1) steps from the dummy node
    for _ in range(left - 1):
        prev = prev.next

    # Step 2: Initialize pointers for reversal
    # curr will be the first node to reverse (at position left)
    curr = prev.next
    # next_node will track the next node to process
    next_node = None

    # Step 3: Reverse the sublist from left to right
    # We'll reverse (right - left + 1) nodes
    for _ in range(right - left + 1):
        # Standard linked list reversal:
        # 1. Save the next node
        temp = curr.next
        # 2. Reverse the current node's pointer
        curr.next = next_node
        # 3. Move next_node and curr forward
        next_node = curr
        curr = temp

    # Step 4: Reconnect the reversed section to the rest of the list
    # At this point:
    # - prev.next still points to the original first node of the section (now the last node after reversal)
    # - next_node is the new head of the reversed section
    # - curr is the first node after the reversed section (or None if right was the last node)

    # Connect the tail of the reversed section to the node after the section
    prev.next.next = curr
    # Connect the node before the section to the new head of the reversed section
    prev.next = next_node

    # Return the actual head (dummy.next handles cases where head changed)
    return dummy.next
```

```javascript
// Time: O(n) - we traverse the list once
// Space: O(1) - we use only constant extra space
function reverseBetween(head, left, right) {
  // Edge case: empty list or no reversal needed
  if (!head || left === right) {
    return head;
  }

  // Create a dummy node to handle edge cases when left = 1
  const dummy = new ListNode(0);
  dummy.next = head;
  let prev = dummy; // This will point to the node before the reversal section

  // Step 1: Move prev to the node just before position left
  // We need to move (left - 1) steps from the dummy node
  for (let i = 0; i < left - 1; i++) {
    prev = prev.next;
  }

  // Step 2: Initialize pointers for reversal
  // curr will be the first node to reverse (at position left)
  let curr = prev.next;
  // nextNode will track the next node to process
  let nextNode = null;

  // Step 3: Reverse the sublist from left to right
  // We'll reverse (right - left + 1) nodes
  for (let i = 0; i < right - left + 1; i++) {
    // Standard linked list reversal:
    // 1. Save the next node
    const temp = curr.next;
    // 2. Reverse the current node's pointer
    curr.next = nextNode;
    // 3. Move nextNode and curr forward
    nextNode = curr;
    curr = temp;
  }

  // Step 4: Reconnect the reversed section to the rest of the list
  // At this point:
  // - prev.next still points to the original first node of the section (now the last node after reversal)
  // - nextNode is the new head of the reversed section
  // - curr is the first node after the reversed section (or null if right was the last node)

  // Connect the tail of the reversed section to the node after the section
  prev.next.next = curr;
  // Connect the node before the section to the new head of the reversed section
  prev.next = nextNode;

  // Return the actual head (dummy.next handles cases where head changed)
  return dummy.next;
}
```

```java
// Time: O(n) - we traverse the list once
// Space: O(1) - we use only constant extra space
public ListNode reverseBetween(ListNode head, int left, int right) {
    // Edge case: empty list or no reversal needed
    if (head == null || left == right) {
        return head;
    }

    // Create a dummy node to handle edge cases when left = 1
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;  // This will point to the node before the reversal section

    // Step 1: Move prev to the node just before position left
    // We need to move (left - 1) steps from the dummy node
    for (int i = 0; i < left - 1; i++) {
        prev = prev.next;
    }

    // Step 2: Initialize pointers for reversal
    // curr will be the first node to reverse (at position left)
    ListNode curr = prev.next;
    // nextNode will track the next node to process
    ListNode nextNode = null;

    // Step 3: Reverse the sublist from left to right
    // We'll reverse (right - left + 1) nodes
    for (int i = 0; i < right - left + 1; i++) {
        // Standard linked list reversal:
        // 1. Save the next node
        ListNode temp = curr.next;
        // 2. Reverse the current node's pointer
        curr.next = nextNode;
        // 3. Move nextNode and curr forward
        nextNode = curr;
        curr = temp;
    }

    // Step 4: Reconnect the reversed section to the rest of the list
    // At this point:
    // - prev.next still points to the original first node of the section (now the last node after reversal)
    // - nextNode is the new head of the reversed section
    // - curr is the first node after the reversed section (or null if right was the last node)

    // Connect the tail of the reversed section to the node after the section
    prev.next.next = curr;
    // Connect the node before the section to the new head of the reversed section
    prev.next = nextNode;

    // Return the actual head (dummy.next handles cases where head changed)
    return dummy.next;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the list once to find the starting position: O(left)
- We reverse the sublist: O(right - left + 1)
- In the worst case (left = 1, right = n), we traverse the entire list once: O(n)

**Space Complexity: O(1)**

- We use only a constant amount of extra space for pointers
- The reversal is done in-place without additional data structures
- The dummy node uses O(1) space

## Common Mistakes

1. **Forgetting the dummy node**: When `left = 1`, there's no `prev_node`. Many candidates handle this with special cases, which leads to messy code. The dummy node elegantly solves this.

2. **Incorrect reconnection order**: After reversal, you must reconnect in this specific order:
   - First: Connect the tail of reversed section to the node after it
   - Then: Connect the node before the section to the new head
     Doing these in reverse order breaks the list.

3. **Losing references during reversal**: During the reversal loop, you need to save `curr.next` before modifying it. A common mistake is:

   ```python
   curr.next = prev  # Wrong: now we've lost the reference to the next node!
   curr = curr.next  # This won't work as expected
   ```

4. **Off-by-one errors in traversal**: Remember that positions are 1-indexed, but our pointers are 0-indexed. When moving `prev` to position `left-1`, we need `left-1` steps from the dummy node.

## When You'll See This Pattern

This pattern of **partial linked list reversal with boundary management** appears in several problems:

1. **Reverse Nodes in k-Group (LeetCode #25)**: Similar concept but applied repeatedly in groups of k nodes. You need to reverse sections and reconnect them, just like here.

2. **Swap Nodes in Pairs (LeetCode #24)**: A simpler version where you reverse pairs of nodes. The pointer manipulation logic is similar but with fixed group size.

3. **Rotate List (LeetCode #61)**: While not exactly reversal, it involves breaking and reconnecting linked list sections, requiring similar careful pointer management.

The core technique of using a dummy node, finding boundaries, performing in-place reversal, and reconnecting is a fundamental linked list manipulation skill.

## Key Takeaways

1. **Dummy nodes simplify edge cases**: When dealing with linked list modifications that might affect the head, a dummy node provides a consistent starting point and eliminates special cases.

2. **Three-pointer reversal is fundamental**: The pattern of `prev`, `curr`, and `next` pointers for reversal should be second nature. Practice it until you can write it without thinking.

3. **Draw it out**: Linked list problems are visual. Always draw the before/after states and track pointer changes step by step, especially for reconnection logic.

4. **Test boundary cases**: Always test `left = 1`, `right = n`, `left = right`, and single-node lists. These catch most implementation errors.

Related problems: [Reverse Linked List](/problem/reverse-linked-list)
