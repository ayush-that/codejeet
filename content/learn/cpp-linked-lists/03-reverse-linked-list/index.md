---
slug: reverse-linked-list
title: Reverse a Linked List
description: The interview classic. Three pointers, in place, O(n) time, O(1) space.
order: 3
exercise:
  prompt: |
    Implement `LinkedList::reverse` so that calling it flips the list in
    place. The harness inserts values at the tail (so the list reads in
    input order), calls `reverse()`, then prints — the printed output
    should be the input order reversed.
---

# Reverse a Linked List

This is the most-asked linked list interview question. Learn the iterative version first; the recursive one is just a fold of it.

## The iterative trick

Three pointers. At each step:

1. Save the next node before you overwrite the current one's `next`.
2. Flip the current node's `next` to point backwards.
3. Advance both pointers one step forward.

```cpp
void reverse() {
    Node* previous = nullptr;
    Node* current = head;
    tail = head;  // the old head becomes the new tail
    while (current != nullptr) {
        Node* nextNode = current->next;  // 1. save
        current->next = previous;        // 2. flip
        previous = current;              // 3. advance
        current = nextNode;
    }
    head = previous;  // previous now points at the old last node
}
```

Draw it. Four boxes labeled `prev`, `cur`, `next`, with arrows between them. Step through it once on paper. It's the kind of code that feels like magic until you've done it by hand, after which it's obvious forever.

## Why this works

At every iteration, the segment of nodes from the old head up to `previous` is already reversed — it just needs `cur` and the rest hooked onto it. When `cur` reaches `nullptr`, `previous` is sitting on what used to be the last node, which is now the new head.

## The empty and one-node cases

Both work without a special check. An empty list never enters the loop, so `head` ends up `nullptr`. A one-node list flips its `next` from `nullptr` to `nullptr` (a no-op) and then sets `head` back to itself. Always sanity-check these on paper before you submit.

---

## Your turn

Fill in `reverse()`. The harness builds the list with `insertAtTail` so the input order is preserved, then calls your `reverse()`, then prints.
