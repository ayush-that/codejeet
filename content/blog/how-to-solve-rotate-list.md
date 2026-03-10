---
title: "How to Solve Rotate List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rotate List. Medium difficulty, 41.2% acceptance rate. Topics: Linked List, Two Pointers."
date: "2026-07-10"
category: "dsa-patterns"
tags: ["rotate-list", "linked-list", "two-pointers", "medium"]
---

# How to Solve Rotate List

Given the head of a singly linked list, rotate the list to the right by `k` places. This problem is tricky because `k` can be larger than the length of the list, requiring careful handling of modular arithmetic. The rotation essentially means taking the last `k` nodes and moving them to the front, but we need to find the new head and properly reconnect the list.

## Visual Walkthrough

Let's trace through an example: `[1,2,3,4,5]` with `k = 2`.

**Step 1: Understand what rotation means**
Rotating right by 2 means taking the last 2 nodes (`[4,5]`) and moving them to the front:

- Original: `1 → 2 → 3 → 4 → 5 → None`
- After rotation: `4 → 5 → 1 → 2 → 3 → None`

**Step 2: Find the new tail and head**
The new tail will be at position `length - k` from the beginning. With length = 5 and k = 2:

- New tail position: 5 - 2 = 3rd node (value 3)
- New head: The node after the new tail (value 4)

**Step 3: Handle k > length**
If `k = 7` (larger than length 5), rotating by 7 is the same as rotating by `7 % 5 = 2`. This is because rotating by the full length brings us back to the original list.

**Step 4: Special cases**

- Empty list: Return None
- Single node: Always returns itself regardless of k
- k = 0: No rotation needed

## Brute Force Approach

A naive approach would be to perform the rotation one step at a time:

1. For each rotation (k times):
   - Traverse to find the last node
   - Move the last node to the front

This approach has O(k × n) time complexity, which becomes O(n²) when k ≈ n. For large lists or large k values, this is too slow.

```python
def rotateRight_brute(head, k):
    if not head or not head.next:
        return head

    for _ in range(k):
        # Find the last node and second-to-last node
        prev = None
        curr = head
        while curr.next:
            prev = curr
            curr = curr.next

        # Move last node to front
        prev.next = None
        curr.next = head
        head = curr

    return head
```

The brute force fails because it doesn't handle `k > length` efficiently (it would do unnecessary work) and has poor time complexity.

## Optimized Approach

The key insight is that we only need to:

1. Find the length of the list
2. Calculate the effective rotation `k % length` (handles k > length)
3. Find the new tail at position `length - k`
4. Break the list at that point and reconnect

**Step-by-step reasoning:**

1. **Edge cases**: If the list is empty or has one node, or if k = 0, return head
2. **Find length and last node**: Traverse once to get length and also capture the last node
3. **Calculate effective k**: `k = k % length`. If k = 0, no rotation needed
4. **Find new tail**: The new tail is at position `length - k` from the beginning
5. **Reconnect**:
   - New head = node after new tail
   - Set new tail's next to None
   - Connect original last node to original head

This approach requires only two passes through the list: one to find length, and one to find the new tail position.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def rotateRight(head, k):
    """
    Rotate the linked list to the right by k places.

    Args:
        head: Head node of the linked list
        k: Number of places to rotate

    Returns:
        New head of the rotated list
    """
    # Edge case: empty list or single node
    if not head or not head.next:
        return head

    # Step 1: Find the length of the list and get the last node
    length = 1
    last = head
    while last.next:
        last = last.next
        length += 1

    # Step 2: Calculate effective rotation (k modulo length)
    k = k % length
    if k == 0:  # No rotation needed
        return head

    # Step 3: Find the new tail (at position length - k)
    new_tail = head
    for _ in range(length - k - 1):
        new_tail = new_tail.next

    # Step 4: Reconnect the list
    new_head = new_tail.next  # Node after new tail becomes new head
    new_tail.next = None      # Break the list at new tail
    last.next = head          # Connect original last node to original head

    return new_head
```

```javascript
// Time: O(n) | Space: O(1)
function rotateRight(head, k) {
  /**
   * Rotate the linked list to the right by k places.
   *
   * @param {ListNode} head - Head node of the linked list
   * @param {number} k - Number of places to rotate
   * @return {ListNode} New head of the rotated list
   */

  // Edge case: empty list or single node
  if (!head || !head.next) {
    return head;
  }

  // Step 1: Find the length of the list and get the last node
  let length = 1;
  let last = head;
  while (last.next) {
    last = last.next;
    length++;
  }

  // Step 2: Calculate effective rotation (k modulo length)
  k = k % length;
  if (k === 0) {
    // No rotation needed
    return head;
  }

  // Step 3: Find the new tail (at position length - k)
  let newTail = head;
  for (let i = 0; i < length - k - 1; i++) {
    newTail = newTail.next;
  }

  // Step 4: Reconnect the list
  const newHead = newTail.next; // Node after new tail becomes new head
  newTail.next = null; // Break the list at new tail
  last.next = head; // Connect original last node to original head

  return newHead;
}
```

```java
// Time: O(n) | Space: O(1)
public ListNode rotateRight(ListNode head, int k) {
    /**
     * Rotate the linked list to the right by k places.
     *
     * @param head Head node of the linked list
     * @param k Number of places to rotate
     * @return New head of the rotated list
     */

    // Edge case: empty list or single node
    if (head == null || head.next == null) {
        return head;
    }

    // Step 1: Find the length of the list and get the last node
    int length = 1;
    ListNode last = head;
    while (last.next != null) {
        last = last.next;
        length++;
    }

    // Step 2: Calculate effective rotation (k modulo length)
    k = k % length;
    if (k == 0) {  // No rotation needed
        return head;
    }

    // Step 3: Find the new tail (at position length - k)
    ListNode newTail = head;
    for (int i = 0; i < length - k - 1; i++) {
        newTail = newTail.next;
    }

    // Step 4: Reconnect the list
    ListNode newHead = newTail.next;  // Node after new tail becomes new head
    newTail.next = null;              // Break the list at new tail
    last.next = head;                 // Connect original last node to original head

    return newHead;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding the length and last node: O(n) - one pass through the list
- Finding the new tail: O(n) in worst case (when k = 1)
- Total: O(2n) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for pointers (last, new_tail, new_head)
- No additional data structures are created

## Common Mistakes

1. **Not handling k > length**: Failing to calculate `k % length` leads to index out of bounds or incorrect rotations. Always remember that rotating by the full length returns the original list.

2. **Off-by-one errors in finding new tail**: The new tail is at position `length - k`, but we need to stop at the node before that to set its next pointer to null. That's why we iterate `length - k - 1` times.

3. **Forgetting to connect the original last node**: After breaking the list at the new tail, you must connect the original last node to the original head to complete the rotation.

4. **Not handling edge cases**: Empty list, single node list, or k = 0 should all return the original head without modification.

## When You'll See This Pattern

This pattern of "circular manipulation" appears in several problems:

1. **Rotate Array (LeetCode 189)**: Similar concept but with arrays instead of linked lists. The optimal solution uses reversal techniques.

2. **Split Linked List in Parts (LeetCode 725)**: Requires calculating lengths and breaking the list at specific positions, similar to finding the new tail here.

3. **Reorder List (LeetCode 143)**: Combines finding the middle, reversing, and merging - all operations that require careful pointer manipulation in linked lists.

The core technique is understanding how to manipulate linked list pointers efficiently without extra space, often by first finding the length, then calculating positions, and finally reconnecting nodes.

## Key Takeaways

1. **Modular arithmetic is crucial**: When dealing with rotations or circular operations, always use `k % length` to handle cases where k exceeds the data structure size.

2. **Two-pointer technique**: Finding positions relative to the end often requires knowing the total length first, then traversing to the calculated position.

3. **Visualize before coding**: Drawing the before/after states and tracing pointer changes helps avoid connection errors when manipulating linked lists.

Related problems: [Rotate Array](/problem/rotate-array), [Split Linked List in Parts](/problem/split-linked-list-in-parts)
