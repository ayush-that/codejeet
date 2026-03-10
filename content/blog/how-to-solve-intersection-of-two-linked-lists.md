---
title: "How to Solve Intersection of Two Linked Lists — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Intersection of Two Linked Lists. Easy difficulty, 63.2% acceptance rate. Topics: Hash Table, Linked List, Two Pointers."
date: "2026-05-07"
category: "dsa-patterns"
tags: ["intersection-of-two-linked-lists", "hash-table", "linked-list", "two-pointers", "easy"]
---

# How to Solve Intersection of Two Linked Lists

This problem asks you to find the node where two singly linked lists intersect, if they intersect at all. The tricky part is that the lists may have different lengths before the intersection point, and you cannot traverse backwards in a singly linked list. This makes simple parallel traversal insufficient.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider these two lists:

```
List A: a1 → a2 → c1 → c2 → c3
List B: b1 → b2 → b3 → c1 → c2 → c3
```

They intersect at node `c1`. Notice that List A has 2 nodes before the intersection, while List B has 3 nodes before the intersection.

If we try to traverse both lists with one pointer each starting at their heads, we'll reach the intersection at different times:

- Pointer A will reach `c1` after 2 steps
- Pointer B will reach `c1` after 3 steps

This misalignment is the core challenge. The key insight is that if we can make both pointers travel the same total distance, they'll arrive at the intersection simultaneously.

Here's how the optimal solution works step-by-step:

1. Start two pointers, `pA` at head of List A and `pB` at head of List B
2. Traverse both lists simultaneously
3. When `pA` reaches the end of List A, redirect it to the head of List B
4. When `pB` reaches the end of List B, redirect it to the head of List A
5. Continue until both pointers meet or both reach the end (null)

Let's trace this:

- Step 1: pA at a1, pB at b1
- Step 2: pA at a2, pB at b2
- Step 3: pA at c1, pB at b3
- Step 4: pA at c2, pB at c1 (pB reached end of B, now at head of A)
- Step 5: pA at c3, pB at a1
- Step 6: pA reaches end of B, goes to head of A (a1), pB at a2
- Step 7: pA at a2, pB at c1
- Step 8: pA at c1, pB at c2
- Step 9: Both at c1! They meet at the intersection.

The magic happens because each pointer travels: length of its own list + length of the other list before intersection. This ensures they travel the same total distance.

## Brute Force Approach

The most straightforward approach is to compare every node in List A with every node in List B:

1. For each node in List A
2. For each node in List B
3. Check if they are the same node (same memory address, not just same value)
4. Return the first match found

<div class="code-group">

```python
# Time: O(m*n) | Space: O(1)
def getIntersectionNodeBrute(headA, headB):
    # Traverse each node in list A
    currentA = headA
    while currentA:
        # For each node in A, traverse all nodes in B
        currentB = headB
        while currentB:
            # Check if this is the same node object
            if currentA == currentB:
                return currentA
            currentB = currentB.next
        currentA = currentA.next
    # No intersection found
    return None
```

```javascript
// Time: O(m*n) | Space: O(1)
function getIntersectionNodeBrute(headA, headB) {
  // Traverse each node in list A
  let currentA = headA;
  while (currentA) {
    // For each node in A, traverse all nodes in B
    let currentB = headB;
    while (currentB) {
      // Check if this is the same node object
      if (currentA === currentB) {
        return currentA;
      }
      currentB = currentB.next;
    }
    currentA = currentA.next;
  }
  // No intersection found
  return null;
}
```

```java
// Time: O(m*n) | Space: O(1)
public ListNode getIntersectionNodeBrute(ListNode headA, ListNode headB) {
    // Traverse each node in list A
    ListNode currentA = headA;
    while (currentA != null) {
        // For each node in A, traverse all nodes in B
        ListNode currentB = headB;
        while (currentB != null) {
            // Check if this is the same node object
            if (currentA == currentB) {
                return currentA;
            }
            currentB = currentB.next;
        }
        currentA = currentA.next;
    }
    // No intersection found
    return null;
}
```

</div>

**Why this is insufficient:** With m nodes in List A and n nodes in List B, this takes O(m\*n) time. For lists with thousands of nodes, this becomes prohibitively slow. We need a linear time solution.

## Optimal Solution

The optimal solution uses two pointers and clever switching between lists. The key insight is that by having each pointer traverse both lists (A then B, and B then A), they will travel the same total distance and meet at the intersection if one exists.

<div class="code-group">

```python
# Time: O(m + n) | Space: O(1)
def getIntersectionNode(headA, headB):
    # Edge case: if either list is empty, no intersection possible
    if not headA or not headB:
        return None

    # Initialize two pointers at the heads of each list
    pointerA = headA
    pointerB = headB

    # Continue until pointers meet or both reach end
    while pointerA != pointerB:
        # Move pointerA forward; if it reaches end, switch to headB
        pointerA = pointerA.next if pointerA else headB

        # Move pointerB forward; if it reaches end, switch to headA
        pointerB = pointerB.next if pointerB else headA

        # Why this works:
        # 1. If lists intersect: both pointers will meet at intersection
        # 2. If lists don't intersect: both will become None simultaneously
        # Each pointer travels: len(A) + len(B) nodes total

    # Return either the intersection node or None
    return pointerA
```

```javascript
// Time: O(m + n) | Space: O(1)
function getIntersectionNode(headA, headB) {
  // Edge case: if either list is empty, no intersection possible
  if (!headA || !headB) return null;

  // Initialize two pointers at the heads of each list
  let pointerA = headA;
  let pointerB = headB;

  // Continue until pointers meet or both reach end
  while (pointerA !== pointerB) {
    // Move pointerA forward; if it reaches end, switch to headB
    pointerA = pointerA ? pointerA.next : headB;

    // Move pointerB forward; if it reaches end, switch to headA
    pointerB = pointerB ? pointerB.next : headA;

    // Why this works:
    // 1. If lists intersect: both pointers will meet at intersection
    // 2. If lists don't intersect: both will become null simultaneously
    // Each pointer travels: len(A) + len(B) nodes total
  }

  // Return either the intersection node or null
  return pointerA;
}
```

```java
// Time: O(m + n) | Space: O(1)
public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    // Edge case: if either list is empty, no intersection possible
    if (headA == null || headB == null) return null;

    // Initialize two pointers at the heads of each list
    ListNode pointerA = headA;
    ListNode pointerB = headB;

    // Continue until pointers meet or both reach end
    while (pointerA != pointerB) {
        // Move pointerA forward; if it reaches end, switch to headB
        pointerA = (pointerA == null) ? headB : pointerA.next;

        // Move pointerB forward; if it reaches end, switch to headA
        pointerB = (pointerB == null) ? headA : pointerB.next;

        // Why this works:
        // 1. If lists intersect: both pointers will meet at intersection
        // 2. If lists don't intersect: both will become null simultaneously
        // Each pointer travels: len(A) + len(B) nodes total
    }

    // Return either the intersection node or null
    return pointerA;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m + n)** where m is the length of List A and n is the length of List B. Each pointer traverses at most m + n nodes. In the worst case (no intersection), each pointer will traverse both lists completely.

**Space Complexity: O(1)**. We only use two pointers regardless of input size. No additional data structures are created.

The linear time comes from the fact that each pointer traverses each list exactly once. The switching mechanism ensures we don't need to know the lengths in advance or store any nodes.

## Common Mistakes

1. **Comparing node values instead of node objects**: The intersection is defined by the same node object (same memory address), not nodes with the same value. Two different nodes could have the same value but not be the intersection point.

2. **Not handling the no-intersection case properly**: When there's no intersection, the pointers will both become null after traversing m + n nodes. The loop condition `pointerA != pointerB` will eventually be false when both are null, correctly returning null.

3. **Infinite loop with different length lists**: Some implementations might create infinite loops if they don't properly handle the switching. The key is that BOTH pointers must switch lists when they reach the end, not just one.

4. **Forgetting edge cases**: Always check if either head is null initially. Also consider cases where one list is much longer than the other, or where the intersection is at the very beginning (one list is a subset of the other).

## When You'll See This Pattern

This "two pointers with switching" pattern appears in several problems where you need to align or synchronize traversal of two sequences:

1. **Linked List Cycle II (LeetCode 142)**: Uses a similar fast/slow pointer approach to find cycle entry point.
2. **Find the Duplicate Number (LeetCode 287)**: Treats the array as a linked list and uses Floyd's cycle detection.
3. **Happy Number (LeetCode 202)**: Uses fast/slow pointers to detect cycles in a sequence.

The core idea is using multiple pointers moving at different "speeds" or along different "paths" to detect meeting points or cycles.

## Key Takeaways

1. **When dealing with different length sequences**, consider having pointers traverse different paths that equalize total distance traveled. This avoids needing to calculate or store lengths.

2. **The "switching lists" technique** is a clever way to handle unknown lengths without extra space. Each pointer gets to traverse both sequences in different orders.

3. **For intersection problems**, remember that intersection means the same object/reference, not just equal values. Always compare references/addresses, not content.

Related problems: [Minimum Index Sum of Two Lists](/problem/minimum-index-sum-of-two-lists)
