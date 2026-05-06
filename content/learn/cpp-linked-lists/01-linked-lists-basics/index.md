---
slug: linked-lists-basics
title: Linked Lists in C++
description: Pointer chains, the head and tail pointers, and your first insertAtTail implementation.
order: 1
exercise:
  prompt: |
    Implement `LinkedList::insertAtTail` so that values pushed in order print
    in order.

    The harness reads integers from stdin until it sees `-1`, calls
    `insertAtTail` for each, then calls `print()` once. Your job is the
    one-or-two-line body of `insertAtTail` — keep `head` and `tail` consistent.
---

# Linked Lists in C++

## The core idea

A linked list is a chain of nodes. Each node holds some data and a pointer to the next node. The list itself is just a pointer to the first node — the head. That's it.

Contrast with arrays:

- Arrays live in contiguous memory. Random access by index is O(1). Insert or delete in the middle is O(n) because you shift everything after the gap.
- Linked lists are scattered across the heap. Random access is O(n). Insert or delete at a known spot is O(1).

So when do you actually reach for a linked list? In modern C++, rarely. `std::vector` wins most of the time because CPU caches love contiguous memory. Linked lists earn their place when:

- You do a lot of splicing (moving sublists around without copying).
- You need stable iterators that survive insertions.
- You're building something like an LRU cache where O(1) move-to-front matters.

Even so, learning linked lists is foundational. Every DSA interview asks them, and the pointer manipulation skills carry over to trees, graphs, parsers, allocators — basically everything.

---

## The node

```cpp
struct Node {
    int data;
    Node* next;

    Node(int value) : data(value), next(nullptr) {}
};
```

Each node owns its data and a pointer to the next. The last node's `next` is `nullptr`. That's how you know you've reached the end.

Draw it on paper. Seriously. Every time you write linked list code, sketch the boxes and arrows first. It saves hours of debugging.

---

## The list class, with a tail pointer

```cpp
class LinkedList {
public:
    Node* head;
    Node* tail;

    LinkedList() : head(nullptr), tail(nullptr) {}
};
```

We cache `tail` so that adding to the end is O(1). Without it, you'd walk the whole list every time. One cheap pointer for a huge speedup. Always do this.

---

## Insert at tail, O(1) with the tail pointer

```cpp
void insertAtTail(int value) {
    Node* newNode = new Node(value);
    if (head == nullptr) {
        head = tail = newNode;
    } else {
        tail->next = newNode;
        tail = newNode;
    }
}
```

Two cases:

- Empty list: both `head` and `tail` point to the new node.
- Non-empty: hook the new node onto the old tail, then move `tail` forward.

Forget the empty case and you crash on the first insert. Forget to move `tail` and the next insert silently builds a parallel list.

---

## Your turn

The editor on the right has the full skeleton already wired up. The harness reads ints until `-1` and prints the list. All you need to do is fill in the body of `insertAtTail` so that:

- inserting `1`, `2`, `3` prints `1 2 3`
- inserting nothing prints an empty line
- a single insert prints just that value

Hit **Run** to compile and execute against your own input, or **Submit** to score against all hidden test cases.
