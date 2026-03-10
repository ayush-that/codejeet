---
title: "How to Solve Merge In Between Linked Lists — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Merge In Between Linked Lists. Medium difficulty, 82.9% acceptance rate. Topics: Linked List."
date: "2028-03-07"
category: "dsa-patterns"
tags: ["merge-in-between-linked-lists", "linked-list", "medium"]
---

# How to Solve Merge In Between Linked Lists

This problem asks you to surgically replace a segment of one linked list with another entire linked list. You're given `list1`, indices `a` and `b`, and `list2`. You need to remove nodes from position `a` to position `b` in `list1` (0-indexed) and insert `list2` in their place. What makes this interesting is that you need to find precise connection points while handling edge cases like when `a = 0` or when the removed segment includes the tail of `list1`.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

- `list1`: 1 → 2 → 3 → 4 → 5 → 6
- `a = 2`, `b = 4`
- `list2`: 10 → 11 → 12

**Step-by-step process:**

1. **Find the node before position `a`** (we'll call it `beforeA`):
   - Position 0: node with value 1
   - Position 1: node with value 2 (this is the node BEFORE position `a=2`)
   - `beforeA` points to node with value 2

2. **Find the node after position `b`** (we'll call it `afterB`):
   - Position 2: node with value 3 (start of segment to remove)
   - Position 3: node with value 4
   - Position 4: node with value 5 (end of segment to remove)
   - Position 5: node with value 6 (this is the node AFTER position `b=4`)
   - `afterB` points to node with value 6

3. **Connect `beforeA` to `list2`**:
   - `beforeA.next` (which was pointing to node 3) now points to `list2.head` (node 10)
   - Now we have: 1 → 2 → 10 → 11 → 12

4. **Find the tail of `list2`**:
   - Traverse `list2` to find its last node (node 12)

5. **Connect `list2` tail to `afterB`**:
   - `list2.tail.next` (node 12's next) points to `afterB` (node 6)
   - Final result: 1 → 2 → 10 → 11 → 12 → 6

The removed segment (nodes 3, 4, 5) is now disconnected and will be garbage collected.

## Brute Force Approach

A naive approach might try to:

1. Convert both linked lists to arrays
2. Slice `list1` array to remove elements from index `a` to `b`
3. Insert `list2` array elements in between
4. Convert the resulting array back to a linked list

**Why this fails:**

- It violates the problem's intent of working directly with linked lists
- It uses O(n+m) extra space for the arrays
- The conversion operations are unnecessary and inefficient
- It doesn't demonstrate understanding of pointer manipulation, which is the core skill being tested

While this approach would technically work, it's not what interviewers want to see for a linked list problem. They want to see you can manipulate pointers directly.

## Optimized Approach

The key insight is that we only need to find **four critical nodes**:

1. The node **just before** position `a` in `list1` (to connect to `list2`'s head)
2. The node **at or just after** position `b` in `list1` (for `list2`'s tail to connect to)
3. The **head** of `list2` (to connect after `beforeA`)
4. The **tail** of `list2` (to connect to `afterB`)

**Step-by-step reasoning:**

1. **Find `beforeA`**: Traverse `list1` for `a-1` steps. If `a = 0`, `beforeA` will be `null`, which is a special case we need to handle.

2. **Find `afterB`**: Continue traversing from `beforeA` (or from head if `a=0`) for `(b-a+1)` more steps to get past the segment we're removing. This gives us the node after position `b`.

3. **Connect `beforeA` to `list2`**: If `beforeA` exists, set `beforeA.next = list2`. If `a=0`, then the new head becomes `list2`.

4. **Find `list2`'s tail**: Traverse `list2` to find its last node.

5. **Connect `list2` tail to `afterB`**: Set `list2Tail.next = afterB`.

The beauty of this approach is that we only traverse each list once, and we use constant extra space—just a few pointer variables.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n + m) where n = len(list1), m = len(list2)
# Space: O(1) - we only use a constant amount of extra space
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeInBetween(self, list1: ListNode, a: int, b: int, list2: ListNode) -> ListNode:
        # Step 1: Find the node just before position a (0-indexed)
        # We need to move (a-1) steps from the head
        before_a = list1
        for _ in range(a - 1):
            before_a = before_a.next

        # Step 2: Find the node just after position b
        # Start from before_a and move (b-a+1) steps forward
        # This gets us to the node at position b, then we take one more step
        after_b = before_a
        for _ in range(b - a + 2):  # +2 because: (b-a+1) to reach node b, +1 to go past it
            after_b = after_b.next

        # Step 3: Connect before_a to list2
        # If a > 0, before_a exists and we connect it to list2
        # If a = 0, before_a would be the first node to remove,
        # so we handle this by making list2 the new head
        if a > 0:
            before_a.next = list2
        else:
            # When a = 0, the entire beginning of list1 is removed
            # So list2 becomes the new head
            list1 = list2

        # Step 4: Find the tail of list2
        list2_tail = list2
        while list2_tail.next:
            list2_tail = list2_tail.next

        # Step 5: Connect list2's tail to after_b
        list2_tail.next = after_b

        return list1
```

```javascript
// Time: O(n + m) where n = list1 length, m = list2 length
// Space: O(1) - constant extra space
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

var mergeInBetween = function (list1, a, b, list2) {
  // Step 1: Find the node just before position a
  let beforeA = list1;
  for (let i = 0; i < a - 1; i++) {
    beforeA = beforeA.next;
  }

  // Step 2: Find the node just after position b
  // Start from beforeA and move (b-a+2) steps:
  // (b-a+1) to reach node at position b, +1 to go past it
  let afterB = beforeA;
  for (let i = 0; i < b - a + 2; i++) {
    afterB = afterB.next;
  }

  // Step 3: Connect beforeA to list2
  // Handle special case when a = 0
  if (a > 0) {
    beforeA.next = list2;
  } else {
    // When a = 0, list2 becomes the new head
    list1 = list2;
  }

  // Step 4: Find the tail of list2
  let list2Tail = list2;
  while (list2Tail.next !== null) {
    list2Tail = list2Tail.next;
  }

  // Step 5: Connect list2's tail to afterB
  list2Tail.next = afterB;

  return list1;
};
```

```java
// Time: O(n + m) where n = list1 length, m = list2 length
// Space: O(1) - constant extra space
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode mergeInBetween(ListNode list1, int a, int b, ListNode list2) {
        // Step 1: Find the node just before position a
        ListNode beforeA = list1;
        for (int i = 0; i < a - 1; i++) {
            beforeA = beforeA.next;
        }

        // Step 2: Find the node just after position b
        // Move (b-a+2) steps from beforeA:
        // (b-a+1) to reach node b, +1 to go past it
        ListNode afterB = beforeA;
        for (int i = 0; i < b - a + 2; i++) {
            afterB = afterB.next;
        }

        // Step 3: Connect beforeA to list2
        // Handle the edge case when a = 0
        if (a > 0) {
            beforeA.next = list2;
        } else {
            // When a = 0, list2 becomes the new head
            list1 = list2;
        }

        // Step 4: Find the tail of list2
        ListNode list2Tail = list2;
        while (list2Tail.next != null) {
            list2Tail = list2Tail.next;
        }

        // Step 5: Connect list2's tail to afterB
        list2Tail.next = afterB;

        return list1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- We traverse `list1` once to find `beforeA` and `afterB`: O(n)
- We traverse `list2` once to find its tail: O(m)
- Total: O(n + m)

**Space Complexity: O(1)**

- We only use a constant number of pointer variables (`beforeA`, `afterB`, `list2Tail`)
- No additional data structures are created
- The modification is done in-place on the existing lists

## Common Mistakes

1. **Off-by-one errors with indices**: The most common mistake is miscounting how many steps to move to find `afterB`. Remember: if `beforeA` is at position `a-1`, you need to move `(b-a+2)` steps to get past position `b`. The `+2` comes from: `(b-a+1)` to reach node at position `b`, then `+1` more to go past it.

2. **Not handling the `a = 0` case**: When `a = 0`, there's no `beforeA` node. The new head should be `list2`, not `list1`. Many candidates forget this edge case and try to access `beforeA.next` when `beforeA` doesn't exist.

3. **Forgetting to find `list2`'s tail**: Some candidates connect `beforeA` to `list2` but forget to find `list2`'s tail to connect it to `afterB`. This leaves `list2` disconnected from the rest of `list1`.

4. **Losing reference to `list1` head**: When modifying linked lists in-place, it's easy to lose track of the head. Always keep a reference to the original head (or new head if `a=0`) to return at the end.

## When You'll See This Pattern

This problem tests **surgical linked list manipulation**—finding specific nodes and rerouting pointers. You'll see similar patterns in:

1. **Reverse Linked List II (LeetCode 92)**: Reverse a segment of a linked list between two positions. Like this problem, you need to find precise connection points and manipulate pointers carefully.

2. **Remove Nth Node From End of List (LeetCode 19)**: Find a specific position in a linked list (from the end) and remove it by pointer manipulation.

3. **Rotate List (LeetCode 61)**: Connect the tail to the head and break a connection somewhere in the middle—similar pointer rerouting logic.

4. **Swap Nodes in Pairs (LeetCode 24)**: Manipulate pointers to swap adjacent nodes, requiring careful tracking of nodes before and after the segment being modified.

## Key Takeaways

1. **Linked list surgery requires finding connection points**: Identify the nodes before and after the segment you're modifying. These are your "anchor points" for reconnection.

2. **Edge cases matter**: Always check for `a = 0` (changing the head) and `b = tail` (connecting to null). Draw these cases to visualize what should happen.

3. **Pointer manipulation is about careful sequencing**: Update pointers in the right order to avoid losing references. It often helps to draw the "before" and "after" states to see which connections need to change.

4. **The two-pointer technique is versatile**: While we used sequential traversal here, many linked list problems use fast/slow pointers or multiple pointers tracking different positions.

[Practice this problem on CodeJeet](/problem/merge-in-between-linked-lists)
