---
slug: insert-at-head
title: Insert at Head
description: The other O(1) end. Build a stack-of-ints out of a linked list.
order: 2
exercise:
  prompt: |
    Implement `LinkedList::insertAtHead`. Each value pushed in order should
    appear in **reverse** order when printed, because each new node is now
    the new head.
---

# Insert at Head, the Other O(1) End

Inserting at the front of a linked list is the only thing it does dramatically faster than `std::vector`. There's no shifting, no reallocation — just three lines of pointer surgery.

```cpp
void insertAtHead(int value) {
    Node* newNode = new Node(value);
    newNode->next = head;
    head = newNode;
    if (tail == nullptr) tail = newNode;  // first node ever
}
```

Step by step:

1. Allocate a new node.
2. Point its `next` at the old head (whatever the old head was, even `nullptr`).
3. Move `head` to the new node.
4. If the list was empty, the new node is also the tail.

**The order of step 2 and step 3 matters.** If you assigned `head` first and then tried to read it for `newNode->next`, you'd just point the new node at itself and lose the rest of the list forever. Always save the old head before you overwrite it.

---

## Why this is a stack

Inserting at head and printing from head gives you LIFO behavior. Push `1`, `2`, `3` and the list becomes `3 -> 2 -> 1`. That's a stack. The same primitive backs the `std::stack` adapter when you give it a `std::list`.

---

## Your turn

The editor reads ints until `-1`, calls `insertAtHead` for each, and prints. Fill in `insertAtHead`. Don't forget the empty-list case for `tail`.
