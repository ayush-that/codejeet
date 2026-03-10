---
title: "How to Solve Reverse Linked List — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reverse Linked List. Easy difficulty, 80.3% acceptance rate. Topics: Linked List, Recursion."
date: "2026-02-09"
category: "dsa-patterns"
tags: ["reverse-linked-list", "linked-list", "recursion", "easy"]
---

# How to Solve Reverse Linked List

Reversing a singly linked list is a classic interview problem that tests your understanding of pointer manipulation and recursion. While the concept is straightforward, the implementation requires careful handling of node pointers to avoid losing references. What makes this problem interesting is that it has both iterative and recursive solutions, each teaching different aspects of algorithmic thinking.

## Visual Walkthrough

Let's trace through reversing the list `1 → 2 → 3 → 4 → 5` step by step:

**Initial state:**

- `head` points to node 1
- Node 1 points to node 2
- Node 2 points to node 3
- Node 3 points to node 4
- Node 4 points to node 5
- Node 5 points to `null`

**Iterative approach (using three pointers):**

1. **Setup:** `prev = null`, `current = head (node 1)`, `next = null`
2. **Step 1:** Save `next = current.next` (node 2)
   Reverse: `current.next = prev` (node 1 → null)
   Move: `prev = current` (prev = node 1), `current = next` (current = node 2)
   State: `null ← 1` | `2 → 3 → 4 → 5 → null`
3. **Step 2:** Save `next = current.next` (node 3)
   Reverse: `current.next = prev` (node 2 → node 1)
   Move: `prev = current` (prev = node 2), `current = next` (current = node 3)
   State: `null ← 1 ← 2` | `3 → 4 → 5 → null`
4. **Continue this process** until `current = null`
5. **Final state:** `null ← 1 ← 2 ← 3 ← 4 ← 5` with `prev = node 5` as the new head

The key insight is that we need to reverse each link while keeping track of the next node to process, otherwise we'd lose our place in the list.

## Brute Force Approach

For linked list problems, there's rarely a true "brute force" in the sense of trying all permutations. However, a naive approach some candidates consider is:

1. Traverse the list once to copy all values into an array
2. Reverse the array
3. Create a new linked list from the reversed array

This approach has O(n) time complexity but O(n) space complexity, which is unnecessary. More importantly, it misses the point of the problem—interviewers want to see pointer manipulation skills, not just array operations. The interviewer might specifically ask for an in-place reversal, making this approach invalid.

## Optimal Solution

The optimal solution uses either an iterative approach with three pointers or a recursive approach. The iterative method is generally preferred in interviews because it has O(1) space complexity (vs O(n) for recursion due to the call stack).

### Iterative Solution (Three Pointers)

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
# n = number of nodes in the linked list
def reverseList(head):
    """
    Reverse a singly linked list iteratively.

    Args:
        head: The head node of the linked list

    Returns:
        The new head of the reversed linked list
    """
    # Initialize three pointers:
    # prev: tracks the previous node (starts as None)
    # current: tracks the current node being processed
    # next_node: temporarily stores the next node
    prev = None
    current = head

    # Traverse through the entire list
    while current is not None:
        # Save the next node before we break the link
        # This is crucial - without this, we'd lose access to the rest of the list
        next_node = current.next

        # Reverse the link: point current node back to previous node
        current.next = prev

        # Move prev and current forward for the next iteration
        prev = current
        current = next_node

    # When current becomes None, prev is at the last node (new head)
    return prev
```

```javascript
// Time: O(n) | Space: O(1)
// n = number of nodes in the linked list

/**
 * Reverse a singly linked list iteratively.
 *
 * @param {ListNode} head - The head node of the linked list
 * @return {ListNode} The new head of the reversed linked list
 */
function reverseList(head) {
  // Initialize three pointers:
  // prev: tracks the previous node (starts as null)
  // current: tracks the current node being processed
  // nextNode: temporarily stores the next node
  let prev = null;
  let current = head;

  // Traverse through the entire list
  while (current !== null) {
    // Save the next node before we break the link
    // This is crucial - without this, we'd lose access to the rest of the list
    const nextNode = current.next;

    // Reverse the link: point current node back to previous node
    current.next = prev;

    // Move prev and current forward for the next iteration
    prev = current;
    current = nextNode;
  }

  // When current becomes null, prev is at the last node (new head)
  return prev;
}
```

```java
// Time: O(n) | Space: O(1)
// n = number of nodes in the linked list

/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */

public ListNode reverseList(ListNode head) {
    // Initialize three pointers:
    // prev: tracks the previous node (starts as null)
    // current: tracks the current node being processed
    // nextNode: temporarily stores the next node
    ListNode prev = null;
    ListNode current = head;

    // Traverse through the entire list
    while (current != null) {
        // Save the next node before we break the link
        // This is crucial - without this, we'd lose access to the rest of the list
        ListNode nextNode = current.next;

        // Reverse the link: point current node back to previous node
        current.next = prev;

        // Move prev and current forward for the next iteration
        prev = current;
        current = nextNode;
    }

    // When current becomes null, prev is at the last node (new head)
    return prev;
}
```

</div>

### Recursive Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the recursion stack
def reverseListRecursive(head):
    """
    Reverse a singly linked list recursively.

    Args:
        head: The head node of the linked list

    Returns:
        The new head of the reversed linked list
    """
    # Base case: empty list or single node
    if head is None or head.next is None:
        return head

    # Recursively reverse the rest of the list
    # This call will return the new head of the reversed sublist
    new_head = reverseListRecursive(head.next)

    # At this point, head.next is the last node of the reversed sublist
    # We need to make it point back to the current head
    head.next.next = head

    # Break the original forward link to avoid cycles
    head.next = None

    return new_head
```

```javascript
// Time: O(n) | Space: O(n) for the recursion stack
function reverseListRecursive(head) {
  // Base case: empty list or single node
  if (head === null || head.next === null) {
    return head;
  }

  // Recursively reverse the rest of the list
  // This call will return the new head of the reversed sublist
  const newHead = reverseListRecursive(head.next);

  // At this point, head.next is the last node of the reversed sublist
  // We need to make it point back to the current head
  head.next.next = head;

  // Break the original forward link to avoid cycles
  head.next = null;

  return newHead;
}
```

```java
// Time: O(n) | Space: O(n) for the recursion stack
public ListNode reverseListRecursive(ListNode head) {
    // Base case: empty list or single node
    if (head == null || head.next == null) {
        return head;
    }

    // Recursively reverse the rest of the list
    // This call will return the new head of the reversed sublist
    ListNode newHead = reverseListRecursive(head.next);

    // At this point, head.next is the last node of the reversed sublist
    // We need to make it point back to the current head
    head.next.next = head;

    // Break the original forward link to avoid cycles
    head.next = null;

    return newHead;
}
```

</div>

## Complexity Analysis

**Iterative Solution:**

- **Time Complexity:** O(n) where n is the number of nodes. We visit each node exactly once.
- **Space Complexity:** O(1) since we only use a constant amount of extra space for the three pointers.

**Recursive Solution:**

- **Time Complexity:** O(n) where n is the number of nodes. Each node is processed once.
- **Space Complexity:** O(n) due to the recursion call stack. In the worst case (a list of n nodes), we'll have n recursive calls on the stack.

The iterative solution is generally preferred in interviews because:

1. It has better space complexity
2. It's easier to explain and visualize
3. It avoids stack overflow issues with very long lists

## Common Mistakes

1. **Losing the reference to the rest of the list:** The most common mistake is not saving `current.next` before modifying it. If you reverse the link first (`current.next = prev`) without saving the next node, you lose access to the rest of the list. Always save `next_node = current.next` at the beginning of the loop.

2. **Returning the wrong node:** Some candidates return `current` instead of `prev`. Remember that when the loop ends, `current` is `null` (we've processed all nodes), and `prev` is pointing to the last node we processed, which is the new head.

3. **Not handling edge cases:** Always check for:
   - Empty list (`head = null`): Should return `null`
   - Single node list: Should return the same node
     Both the iterative and recursive solutions handle these cases correctly.

4. **Creating cycles in recursive solution:** Forgetting to set `head.next = None` in the recursive solution creates a cycle between the first and second nodes of the original list.

## When You'll See This Pattern

The pointer manipulation technique used in reversing a linked list appears in many other problems:

1. **Reverse Linked List II (Medium):** Reverses only a portion of the list between positions left and right. Uses the same pointer manipulation but with additional boundary handling.

2. **Palindrome Linked List (Easy):** Often solved by reversing the second half of the list and comparing it with the first half. The reversal technique is identical.

3. **Reorder List (Medium):** Requires splitting the list, reversing the second half, then merging. The reversal step uses the exact same logic.

4. **Binary Tree Upside Down (Medium):** While not a linked list problem, it uses similar pointer reassignment logic but with tree nodes having left and right children instead of just a next pointer.

The core pattern of using multiple pointers to traverse and modify links is fundamental to many linked list problems, including cycle detection, node removal, and list partitioning.

## Key Takeaways

1. **The three-pointer technique** (prev, current, next) is a fundamental pattern for in-place linked list manipulation. Always save the next pointer before modifying the current node's next reference.

2. **Recursion provides an elegant solution** but comes with O(n) space overhead. Know both approaches, but default to iterative unless specifically asked for recursion.

3. **Linked list problems are about careful pointer management.** Draw diagrams, trace through examples, and always consider edge cases (empty list, single node, two nodes).

Mastering linked list reversal builds the foundation for solving more complex linked list problems and demonstrates your understanding of pointer manipulation—a key skill interviewers look for.

Related problems: [Reverse Linked List II](/problem/reverse-linked-list-ii), [Binary Tree Upside Down](/problem/binary-tree-upside-down), [Palindrome Linked List](/problem/palindrome-linked-list)
