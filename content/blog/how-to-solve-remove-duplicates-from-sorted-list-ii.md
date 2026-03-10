---
title: "How to Solve Remove Duplicates from Sorted List II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Duplicates from Sorted List II. Medium difficulty, 51.3% acceptance rate. Topics: Linked List, Two Pointers."
date: "2026-10-01"
category: "dsa-patterns"
tags: ["remove-duplicates-from-sorted-list-ii", "linked-list", "two-pointers", "medium"]
---

# How to Solve Remove Duplicates from Sorted List II

This problem asks us to remove **all** nodes that have duplicate values from a sorted linked list, leaving only the nodes with unique values that appear exactly once. What makes this tricky is that we can't just keep one copy of each value like in the easier version—we need to completely eliminate any value that appears more than once. The challenge lies in tracking which nodes to keep while properly rewiring the list pointers.

## Visual Walkthrough

Let's trace through an example: `1 → 2 → 2 → 3 → 4 → 4 → 5`

We need to remove all nodes with duplicate values, so:

- Value 1 appears once → keep it
- Value 2 appears twice → remove both 2's
- Value 3 appears once → keep it
- Value 4 appears twice → remove both 4's
- Value 5 appears once → keep it

Result should be: `1 → 3 → 5`

Here's how we can think through it step by step:

1. **Initialize a dummy node** that points to the head. This helps handle edge cases where the head itself might be removed.
2. **Use two pointers**:
   - `prev` points to the last confirmed unique node
   - `current` explores the list to check for duplicates
3. **Check for duplicates**:
   - When `current.val == current.next.val`, we've found duplicates
   - Move `current` forward until we find a node with a different value
   - Connect `prev.next` to this new node, effectively skipping all duplicates
4. **No duplicates found**:
   - Move both `prev` and `current` forward normally

The key insight: we only advance `prev` when we're sure `current` points to a unique node.

## Brute Force Approach

A naive approach might be:

1. Traverse the list to count frequency of each value
2. Create a new list with only values that appear once
3. Return the new list

While this would work, it requires O(n) extra space for the frequency map and O(n) more space for the new list. More importantly, it doesn't demonstrate the pointer manipulation skills interviewers want to see with linked list problems. The interviewer expects an in-place solution that modifies the original list structure.

## Optimized Approach

The optimal solution uses a **dummy node** and **two-pointer** technique:

**Why a dummy node?**

- The head might be a duplicate and need removal
- A dummy node gives us a stable starting point that won't change
- We can always return `dummy.next` as the new head

**How the two pointers work:**

- `prev` always points to the last confirmed unique node
- `current` explores forward to check if the next node is a duplicate
- When we find duplicates, we skip over them by adjusting `prev.next`
- When no duplicates are found, we advance `prev` to include `current`

**The key logic:**

1. If `current.val == current.next.val`, we have duplicates
2. Move `current` forward until we find a node with a different value
3. Connect `prev.next` to this new node (skipping all duplicates)
4. If no duplicates, move `prev` to `current` and advance both pointers

This runs in one pass through the list with O(1) extra space.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
# We traverse the list once, using only constant extra space
class Solution:
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Create a dummy node that points to the head
        # This handles edge cases where the head itself might be removed
        dummy = ListNode(0, head)

        # prev points to the last confirmed unique node
        # We start with dummy since we haven't confirmed head yet
        prev = dummy

        # current explores the list
        current = head

        while current:
            # Check if current node has duplicates
            if current.next and current.val == current.next.val:
                # Move current forward until we find a node with different value
                # or reach the end of the list
                while current.next and current.val == current.next.val:
                    current = current.next
                # Skip all duplicates by connecting prev.next to the next unique node
                prev.next = current.next
            else:
                # No duplicates found, so current is a unique node
                # Move prev forward to include current in the result list
                prev = current

            # Move current to the next node to continue exploration
            current = current.next

        # Return the new head (dummy.next might be different from original head)
        return dummy.next
```

```javascript
// Time: O(n) | Space: O(1)
// We traverse the list once, using only constant extra space
var deleteDuplicates = function (head) {
  // Create a dummy node that points to the head
  // This handles edge cases where the head itself might be removed
  const dummy = new ListNode(0, head);

  // prev points to the last confirmed unique node
  // We start with dummy since we haven't confirmed head yet
  let prev = dummy;

  // current explores the list
  let current = head;

  while (current) {
    // Check if current node has duplicates
    if (current.next && current.val === current.next.val) {
      // Move current forward until we find a node with different value
      // or reach the end of the list
      while (current.next && current.val === current.next.val) {
        current = current.next;
      }
      // Skip all duplicates by connecting prev.next to the next unique node
      prev.next = current.next;
    } else {
      // No duplicates found, so current is a unique node
      // Move prev forward to include current in the result list
      prev = current;
    }

    // Move current to the next node to continue exploration
    current = current.next;
  }

  // Return the new head (dummy.next might be different from original head)
  return dummy.next;
};
```

```java
// Time: O(n) | Space: O(1)
// We traverse the list once, using only constant extra space
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        // Create a dummy node that points to the head
        // This handles edge cases where the head itself might be removed
        ListNode dummy = new ListNode(0, head);

        // prev points to the last confirmed unique node
        // We start with dummy since we haven't confirmed head yet
        ListNode prev = dummy;

        // current explores the list
        ListNode current = head;

        while (current != null) {
            // Check if current node has duplicates
            if (current.next != null && current.val == current.next.val) {
                // Move current forward until we find a node with different value
                // or reach the end of the list
                while (current.next != null && current.val == current.next.val) {
                    current = current.next;
                }
                // Skip all duplicates by connecting prev.next to the next unique node
                prev.next = current.next;
            } else {
                // No duplicates found, so current is a unique node
                // Move prev forward to include current in the result list
                prev = current;
            }

            // Move current to the next node to continue exploration
            current = current.next;
        }

        // Return the new head (dummy.next might be different from original head)
        return dummy.next;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the list exactly once
- Even though we have nested loops, each node is visited at most twice:
  - Once when we check for duplicates
  - Once when we skip over duplicates
- In total, we perform O(n) operations

**Space Complexity: O(1)**

- We use only a constant amount of extra space
- The dummy node and pointers use O(1) space
- We modify the list in-place without creating new data structures

## Common Mistakes

1. **Forgetting the dummy node**: Without a dummy node, you'll have trouble when the head needs to be removed. You'd need special case handling for head removal, which makes the code more complex and error-prone.

2. **Incorrect pointer updates when skipping duplicates**: A common error is to update `prev.next` before fully traversing all duplicates. Make sure to move `current` completely past all duplicates before updating `prev.next`.

3. **Not handling the end of list properly**: When checking `current.next.val`, always check that `current.next` is not null first. This avoids null pointer exceptions.

4. **Moving prev incorrectly**: Remember that `prev` should only move forward when `current` points to a unique node. When skipping duplicates, `prev` stays where it is, and we only update `prev.next`.

## When You'll See This Pattern

This **dummy node + two-pointer** pattern appears frequently in linked list problems where you need to modify the list structure:

1. **Remove Nth Node From End of List (LeetCode #19)**: Uses similar pointer manipulation to find and remove a specific node.

2. **Partition List (LeetCode #86)**: Uses dummy nodes and pointer rewiring to rearrange list nodes based on a condition.

3. **Reverse Linked List II (LeetCode #92)**: Uses similar techniques to reverse a portion of a list in-place.

The pattern is especially useful when:

- You need to handle edge cases where the head might change
- You need to skip over multiple nodes conditionally
- You're modifying list structure in-place

## Key Takeaways

1. **Dummy nodes simplify edge cases**: When a linked list problem might involve removing or modifying the head, start with a dummy node. This creates a stable reference point and eliminates special case handling.

2. **Two pointers enable in-place modification**: Using `prev` to track the last valid node and `current` to explore ahead allows you to modify the list in a single pass without extra space.

3. **The sorted property is key**: This solution relies on duplicates being consecutive. For unsorted lists, you'd need a different approach (like using a hash map to track frequencies).

Related problems: [Remove Duplicates from Sorted List](/problem/remove-duplicates-from-sorted-list), [Remove Duplicates From an Unsorted Linked List](/problem/remove-duplicates-from-an-unsorted-linked-list)
