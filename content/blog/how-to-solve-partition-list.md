---
title: "How to Solve Partition List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition List. Medium difficulty, 60.6% acceptance rate. Topics: Linked List, Two Pointers."
date: "2026-11-16"
category: "dsa-patterns"
tags: ["partition-list", "linked-list", "two-pointers", "medium"]
---

## How to Solve Partition List

You're given the head of a singly linked list and a value `x`. Your task is to rearrange the list so that all nodes with values **less than** `x` come before all nodes with values **greater than or equal to** `x`. The tricky part is that you must **preserve the original relative order** of nodes within each partition. This isn't just about moving values around—it's about maintaining the chain of `next` pointers correctly while splitting and reconnecting nodes.

---

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the list:  
`1 → 4 → 3 → 2 → 5 → 2` with `x = 3`

We need all nodes < 3 before nodes ≥ 3, while keeping relative order.

**Step-by-step partitioning:**

1. Original: `1 → 4 → 3 → 2 → 5 → 2`
2. Identify nodes < 3: `1, 2, 2` (in original order)
3. Identify nodes ≥ 3: `4, 3, 5` (in original order)
4. Desired result: `1 → 2 → 2 → 4 → 3 → 5`

The key insight is we can't just swap nodes in place randomly—we need to build two separate chains (one for "less than", one for "greater/equal") and then connect them. This preserves order within each partition naturally as we traverse the original list.

---

## Brute Force Approach

A naive approach might be:

1. Extract all values into an array
2. Partition the array (collect all < x, then all ≥ x)
3. Build a new linked list from the partitioned array

**Why this fails:**

- It uses O(n) extra space for the array
- It destroys the original nodes and creates new ones (not always allowed)
- It's inefficient—we can solve this in a single pass with O(1) extra space
- Interviewers expect you to manipulate the linked list pointers directly

The brute force teaches us what we need: two groups, each maintaining original order. Now we need to achieve this with pointer manipulation.

---

## Optimized Approach

The optimal solution uses the **two-pointer/dummy node** technique:

**Key Insight:** Create two "dummy" head nodes:

- `less_head` → will chain all nodes < x
- `greater_head` → will chain all nodes ≥ x

As we traverse the original list:

1. If current node value < x: append to `less_head` chain
2. Else: append to `greater_head` chain
3. Move to next node

After traversal:

1. Connect the end of `less_head` chain to beginning of `greater_head` chain
2. Set the end of `greater_head` chain to `null` (to avoid cycles)
3. Return `less_head.next` (the real head of partitioned list)

**Why this works:**

- Each chain maintains relative order because we append nodes as we encounter them
- We use O(1) extra space (just a few pointers)
- Single pass through the list: O(n) time
- The dummy nodes simplify edge cases (empty list, all nodes < x, all nodes ≥ x)

---

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
# n = number of nodes in the linked list
def partition(head, x):
    """
    Partitions a linked list around value x such that all nodes
    less than x come before nodes greater than or equal to x.
    Preserves relative order within each partition.
    """
    # Step 1: Create dummy heads for two partitions
    # less_dummy will hold nodes < x
    # greater_dummy will hold nodes >= x
    less_dummy = ListNode(0)
    greater_dummy = ListNode(0)

    # Step 2: Pointers to track the current end of each partition
    less_tail = less_dummy
    greater_tail = greater_dummy

    # Step 3: Traverse the original list
    current = head
    while current:
        if current.val < x:
            # Append to less-than partition
            less_tail.next = current
            less_tail = less_tail.next  # Move tail forward
        else:
            # Append to greater-or-equal partition
            greater_tail.next = current
            greater_tail = greater_tail.next  # Move tail forward

        # Move to next node in original list
        current = current.next

    # Step 4: Connect the two partitions
    # less_tail now points to last node in less-than partition
    # greater_tail now points to last node in greater-or-equal partition
    less_tail.next = greater_dummy.next  # Connect less partition to greater partition

    # Step 5: Terminate the list to avoid cycles
    greater_tail.next = None

    # Step 6: Return the head of the partitioned list
    # less_dummy.next points to first actual node in less-than partition
    return less_dummy.next
```

```javascript
// Time: O(n) | Space: O(1)
// n = number of nodes in the linked list
function partition(head, x) {
  /**
   * Partitions a linked list around value x such that all nodes
   * less than x come before nodes greater than or equal to x.
   * Preserves relative order within each partition.
   */
  // Step 1: Create dummy heads for two partitions
  // lessDummy will hold nodes < x
  // greaterDummy will hold nodes >= x
  const lessDummy = new ListNode(0);
  const greaterDummy = new ListNode(0);

  // Step 2: Pointers to track the current end of each partition
  let lessTail = lessDummy;
  let greaterTail = greaterDummy;

  // Step 3: Traverse the original list
  let current = head;
  while (current !== null) {
    if (current.val < x) {
      // Append to less-than partition
      lessTail.next = current;
      lessTail = lessTail.next; // Move tail forward
    } else {
      // Append to greater-or-equal partition
      greaterTail.next = current;
      greaterTail = greaterTail.next; // Move tail forward
    }

    // Move to next node in original list
    current = current.next;
  }

  // Step 4: Connect the two partitions
  // lessTail now points to last node in less-than partition
  // greaterTail now points to last node in greater-or-equal partition
  lessTail.next = greaterDummy.next; // Connect less partition to greater partition

  // Step 5: Terminate the list to avoid cycles
  greaterTail.next = null;

  // Step 6: Return the head of the partitioned list
  // lessDummy.next points to first actual node in less-than partition
  return lessDummy.next;
}
```

```java
// Time: O(n) | Space: O(1)
// n = number of nodes in the linked list
public ListNode partition(ListNode head, int x) {
    /**
     * Partitions a linked list around value x such that all nodes
     * less than x come before nodes greater than or equal to x.
     * Preserves relative order within each partition.
     */
    // Step 1: Create dummy heads for two partitions
    // lessDummy will hold nodes < x
    // greaterDummy will hold nodes >= x
    ListNode lessDummy = new ListNode(0);
    ListNode greaterDummy = new ListNode(0);

    // Step 2: Pointers to track the current end of each partition
    ListNode lessTail = lessDummy;
    ListNode greaterTail = greaterDummy;

    // Step 3: Traverse the original list
    ListNode current = head;
    while (current != null) {
        if (current.val < x) {
            // Append to less-than partition
            lessTail.next = current;
            lessTail = lessTail.next;  // Move tail forward
        } else {
            // Append to greater-or-equal partition
            greaterTail.next = current;
            greaterTail = greaterTail.next;  // Move tail forward
        }

        // Move to next node in original list
        current = current.next;
    }

    // Step 4: Connect the two partitions
    // lessTail now points to last node in less-than partition
    // greaterTail now points to last node in greater-or-equal partition
    lessTail.next = greaterDummy.next;  // Connect less partition to greater partition

    // Step 5: Terminate the list to avoid cycles
    greaterTail.next = null;

    // Step 6: Return the head of the partitioned list
    // lessDummy.next points to first actual node in less-than partition
    return lessDummy.next;
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** O(n)  
We traverse the entire linked list exactly once. Each node is examined and appended to one of the two partitions in constant time.

**Space Complexity:** O(1)  
We use only a constant amount of extra space: two dummy nodes and a few pointers. The partitioning is done in-place by rearranging the existing nodes' `next` pointers.

---

## Common Mistakes

1. **Forgetting to terminate the greater partition's tail**  
   If you don't set `greater_tail.next = null`, the last node in the greater partition might still point to a node in the original list, creating a cycle.

2. **Not handling empty lists**  
   The dummy node approach handles this automatically (returns `less_dummy.next` which is `null`), but some implementations might crash on `head = null`.

3. **Losing the head reference**  
   If you modify the original `head` pointer while traversing without saving it, you can't recover the list. Always use a separate `current` pointer for traversal.

4. **Creating new nodes instead of reusing existing ones**  
   The problem expects you to rearrange the existing nodes, not create new ones with the same values.

---

## When You'll See This Pattern

The **two-dummy-heads** technique appears whenever you need to:

- Split a linked list into multiple partitions based on a condition
- Maintain relative order within partitions
- Do it in a single pass with O(1) extra space

**Related problems:**

1. **Odd Even Linked List (LeetCode 328)** - Similar partitioning but based on position rather than value
2. **Reorder List (LeetCode 143)** - Uses similar pointer manipulation to split and merge lists
3. **Sort List (LeetCode 148)** - Merge sort on linked lists uses similar partitioning concepts

---

## Key Takeaways

1. **Dummy nodes simplify edge cases** - They eliminate special handling for "first node in partition" scenarios
2. **Build partitions incrementally** - By appending nodes as you traverse, you automatically preserve relative order
3. **Think in terms of pointer redirection** - Linked list problems are about carefully redirecting `next` pointers, not moving data

This pattern teaches you to **separate concerns**: build clean sublists first, then connect them. It's a fundamental technique for any linked list rearrangement problem.

---

Related problems: [Partition Array According to Given Pivot](/problem/partition-array-according-to-given-pivot)
