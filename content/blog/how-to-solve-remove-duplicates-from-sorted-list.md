---
title: "How to Solve Remove Duplicates from Sorted List — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Remove Duplicates from Sorted List. Easy difficulty, 56.3% acceptance rate. Topics: Linked List."
date: "2026-05-11"
category: "dsa-patterns"
tags: ["remove-duplicates-from-sorted-list", "linked-list", "easy"]
---

# How to Solve Remove Duplicates from Sorted List

This problem asks us to remove duplicate values from a sorted linked list, ensuring each value appears only once while maintaining the sorted order. What makes this problem interesting is that the sorted nature of the list gives us a significant optimization opportunity — we can detect duplicates by simply comparing adjacent nodes without needing extra data structures. The challenge lies in properly manipulating the linked list pointers while traversing.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the sorted linked list: `1 → 1 → 2 → 3 → 3`

**Step 1:** Start with `current` pointing at the first node (value 1)

- Compare `current.val` (1) with `current.next.val` (1)
- They're equal, so we have a duplicate
- Skip the duplicate by setting `current.next = current.next.next`
- List becomes: `1 → 2 → 3 → 3`

**Step 2:** `current` is still at the first node (value 1)

- Compare `current.val` (1) with `current.next.val` (2)
- They're different, so move `current` forward: `current = current.next`
- `current` now points to the node with value 2

**Step 3:** `current` points to node with value 2

- Compare `current.val` (2) with `current.next.val` (3)
- They're different, so move `current` forward: `current = current.next`
- `current` now points to the node with value 3

**Step 4:** `current` points to node with value 3

- Compare `current.val` (3) with `current.next.val` (3)
- They're equal, so we have a duplicate
- Skip the duplicate by setting `current.next = current.next.next`
- List becomes: `1 → 2 → 3 → null`

**Step 5:** `current.next` is null, so we're done

- Return the modified list: `1 → 2 → 3`

The key insight is that we only advance to the next node when we find two different values. When we find duplicates, we "skip" them by adjusting pointers.

## Brute Force Approach

A naive approach might involve collecting all unique values into an array or set, then reconstructing a new linked list. While this would work, it's inefficient:

1. Traverse the list once to collect values
2. Create a new list from the unique values
3. This requires O(n) extra space for the collection and new nodes

The problem with this approach is that it doesn't leverage the sorted nature of the input and uses unnecessary extra space. In interviews, even for easy problems, you should aim for the most efficient solution unless explicitly asked to demonstrate alternatives.

## Optimal Solution

The optimal solution uses a single pointer to traverse the list, comparing each node with its next node. When duplicates are found, we skip them by adjusting the `next` pointer. This approach works in-place with O(1) extra space.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
# We traverse the list once, and use only constant extra space
def deleteDuplicates(head):
    # Edge case: empty list or single node list
    if not head:
        return head

    # Start with current pointing to the head
    current = head

    # Traverse until we reach the end of the list
    while current and current.next:
        # Compare current node's value with next node's value
        if current.val == current.next.val:
            # Duplicate found: skip the next node
            # This removes the duplicate from the list
            current.next = current.next.next
        else:
            # No duplicate: move to the next node
            # We only advance when values are different
            current = current.next

    # Return the modified list (head remains the same)
    return head
```

```javascript
// Time: O(n) | Space: O(1)
// We traverse the list once, and use only constant extra space
function deleteDuplicates(head) {
  // Edge case: empty list or single node list
  if (!head) return head;

  // Start with current pointing to the head
  let current = head;

  // Traverse until we reach the end of the list
  while (current && current.next) {
    // Compare current node's value with next node's value
    if (current.val === current.next.val) {
      // Duplicate found: skip the next node
      // This removes the duplicate from the list
      current.next = current.next.next;
    } else {
      // No duplicate: move to the next node
      // We only advance when values are different
      current = current.next;
    }
  }

  // Return the modified list (head remains the same)
  return head;
}
```

```java
// Time: O(n) | Space: O(1)
// We traverse the list once, and use only constant extra space
public ListNode deleteDuplicates(ListNode head) {
    // Edge case: empty list or single node list
    if (head == null) return head;

    // Start with current pointing to the head
    ListNode current = head;

    // Traverse until we reach the end of the list
    while (current != null && current.next != null) {
        // Compare current node's value with next node's value
        if (current.val == current.next.val) {
            // Duplicate found: skip the next node
            // This removes the duplicate from the list
            current.next = current.next.next;
        } else {
            // No duplicate: move to the next node
            // We only advance when values are different
            current = current.next;
        }
    }

    // Return the modified list (head remains the same)
    return head;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the list exactly once
- Each node is visited at most twice (once when it's the current node, once when it's the next node being compared)
- In the worst case (no duplicates), we visit each node once
- In the best case (all duplicates), we still traverse the entire list

**Space Complexity: O(1)**

- We use only a constant amount of extra space (the `current` pointer)
- The modification is done in-place without creating new nodes
- No additional data structures are used

The efficiency comes from leveraging the sorted property — we only need to compare adjacent nodes, not search through the entire list for duplicates.

## Common Mistakes

1. **Forgetting to handle edge cases**: Always check for empty list (`head == null`) and single-node list. The while loop condition `while current and current.next` handles the single-node case, but you should still explicitly handle the empty list case.

2. **Incorrect pointer advancement**: A common mistake is to always advance `current` in each iteration. Remember: we only advance when `current.val != current.next.val`. If we find a duplicate and skip it, we need to check the new `current.next` without advancing `current`.

3. **Memory leaks (in languages with manual memory management)**: In C++ or similar languages, when you skip a node, you should properly delete it to avoid memory leaks. In Python/Java/JavaScript, garbage collection handles this automatically.

4. **Modifying the head unintentionally**: Some candidates try to use a dummy node or modify the head pointer unnecessarily. The head never changes in this problem (unless the entire list is duplicates, in which case we still return the first occurrence).

## When You'll See This Pattern

This two-pointer adjacent comparison pattern appears frequently in linked list problems and array problems:

1. **Remove Duplicates from Sorted Array (LeetCode 26)**: Same concept — use a slow pointer to track the position of the last unique element and a fast pointer to scan through the array.

2. **Remove Duplicates from Sorted List II (LeetCode 82)**: A harder version where you remove all nodes that have duplicate numbers, not just the duplicates themselves. This requires tracking the previous node and handling edge cases more carefully.

3. **Merge Two Sorted Lists (LeetCode 21)**: While not about duplicates, it uses similar pointer manipulation techniques to traverse and merge two lists.

The core pattern is: when you have sorted data and need to process duplicates or merge/compare elements, use pointer manipulation to traverse and modify the structure in-place.

## Key Takeaways

1. **Sorted data enables efficient duplicate detection**: When data is sorted, duplicates are guaranteed to be adjacent. This allows O(n) time solutions without extra space for tracking seen elements.

2. **In-place modification with pointer manipulation**: For linked list problems, learn to manipulate `next` pointers directly. This is more efficient than creating new lists or using extra data structures.

3. **The "current" pointer pattern**: Use a single pointer to traverse while comparing with its neighbor. Only advance the pointer when you're sure the current position is correct.

This problem teaches fundamental linked list manipulation skills that are essential for more complex problems. Mastering this pattern will help you solve many other linked list problems efficiently.

Related problems: [Remove Duplicates from Sorted List II](/problem/remove-duplicates-from-sorted-list-ii), [Remove Duplicates From an Unsorted Linked List](/problem/remove-duplicates-from-an-unsorted-linked-list)
