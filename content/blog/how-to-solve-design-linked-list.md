---
title: "How to Solve Design Linked List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Linked List. Medium difficulty, 29.9% acceptance rate. Topics: Linked List, Design."
date: "2027-05-25"
category: "dsa-patterns"
tags: ["design-linked-list", "linked-list", "design", "medium"]
---

# How to Solve Design Linked List

Designing a linked list from scratch is a fundamental interview problem that tests your understanding of data structure implementation, edge case handling, and object-oriented design. What makes this problem tricky is that you need to implement all operations (get, add, delete) while properly managing head/tail pointers and node connections, especially for edge cases like empty lists, single-element lists, and operations at the beginning/end.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. We'll implement a singly linked list:

**Initialization:** We create an empty linked list with `head = None` and `size = 0`

**Operation 1:** `addAtHead(5)`

- Create new node with value 5
- Set its next to current head (None)
- Update head to point to new node
- Size becomes 1

```
head → [5|next→None]
```

**Operation 2:** `addAtTail(10)`

- Create new node with value 10
- Traverse from head to find last node (node with next=None)
- Set last node's next to new node
- Size becomes 2

```
head → [5|next] → [10|next→None]
```

**Operation 3:** `addAtIndex(1, 7)` (insert at index 1)

- Create new node with value 7
- Find node at index 0 (value 5)
- Set new node's next to node at index 1 (value 10)
- Set node at index 0's next to new node
- Size becomes 3

```
head → [5|next] → [7|next] → [10|next→None]
```

**Operation 4:** `get(2)`

- Start at head (index 0), move to index 1, then index 2
- Return value 10

**Operation 5:** `deleteAtIndex(1)`

- Find node at index 0 (value 5)
- Set its next to node at index 2 (value 10)
- Node with value 7 is now unreachable (garbage collected)
- Size becomes 2

```
head → [5|next] → [10|next→None]
```

## Brute Force Approach

There's no "brute force" in the traditional sense for this problem, but a naive implementation might make several critical mistakes:

1. **Not tracking size:** Without maintaining a size counter, you'd need to traverse the entire list for every operation to determine length, making operations O(n) when they could be O(1).

2. **Inefficient tail operations:** Without a tail pointer, adding at the tail requires O(n) traversal each time.

3. **Poor index validation:** Not checking if index is valid before attempting operations leads to errors.

4. **Memory leaks:** Not properly handling node removal in delete operations.

The key insight is that we need to design our data structure to efficiently support all required operations while properly managing memory and edge cases.

## Optimized Approach

For a singly linked list, we need to optimize several aspects:

1. **Maintain size counter:** This allows O(1) index validation and simplifies boundary checks.

2. **Use dummy/sentinel node:** A common optimization is to use a dummy head node that doesn't store actual data. This simplifies edge cases when adding/deleting at the head since we never need to handle the special case of updating the head pointer separately.

3. **Consider tail pointer:** While not strictly necessary, maintaining a tail pointer makes `addAtTail` O(1) instead of O(n).

4. **Unified add logic:** We can implement a general `addAtIndex` method and have `addAtHead` and `addAtTail` call it with appropriate indices.

The key operations break down as:

- **Get:** Traverse to index, return value (O(n) worst case)
- **Add:** Find predecessor node, insert new node after it (O(n) worst case)
- **Delete:** Find predecessor node, skip over node to delete (O(n) worst case)

## Optimal Solution

Here's the complete implementation using a singly linked list with size tracking and dummy head:

<div class="code-group">

```python
class ListNode:
    """Node class for singly linked list"""
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class MyLinkedList:
    # Time: O(1) for initialization, O(n) for get/add/delete at arbitrary index
    # Space: O(n) where n is number of elements in list

    def __init__(self):
        """Initialize your data structure here."""
        # Use a dummy head node to simplify edge cases
        self.dummy = ListNode(0)
        self.size = 0  # Track size for O(1) index validation

    def get(self, index: int) -> int:
        """
        Get the value of the index-th node in the linked list.
        If the index is invalid, return -1.
        """
        # Check if index is valid (0 <= index < size)
        if index < 0 or index >= self.size:
            return -1

        # Start from first real node (after dummy)
        curr = self.dummy.next
        # Traverse to the desired index
        for _ in range(index):
            curr = curr.next
        return curr.val

    def addAtHead(self, val: int) -> None:
        """
        Add a node of value val before the first element of the linked list.
        After the insertion, the new node will be the first node.
        """
        # Create new node pointing to current first node
        new_node = ListNode(val, self.dummy.next)
        # Update dummy to point to new node
        self.dummy.next = new_node
        # Increment size
        self.size += 1

    def addAtTail(self, val: int) -> None:
        """
        Append a node of value val to the last element of the linked list.
        """
        # Find the last node (node before None)
        curr = self.dummy
        while curr.next:
            curr = curr.next
        # Create new node at the end
        curr.next = ListNode(val)
        # Increment size
        self.size += 1

    def addAtIndex(self, index: int, val: int) -> None:
        """
        Add a node of value val before the index-th node in the linked list.
        If index equals the length of the linked list, the node will be appended to the end.
        If index is greater than the length, the node will not be inserted.
        """
        # Check if index is valid (0 <= index <= size)
        if index < 0 or index > self.size:
            return

        # Find the node before the insertion point
        prev = self.dummy
        for _ in range(index):
            prev = prev.next

        # Create new node and insert it
        new_node = ListNode(val, prev.next)
        prev.next = new_node
        # Increment size
        self.size += 1

    def deleteAtIndex(self, index: int) -> None:
        """
        Delete the index-th node in the linked list, if the index is valid.
        """
        # Check if index is valid (0 <= index < size)
        if index < 0 or index >= self.size:
            return

        # Find the node before the one to delete
        prev = self.dummy
        for _ in range(index):
            prev = prev.next

        # Skip over the node to delete
        prev.next = prev.next.next
        # Decrement size
        self.size -= 1
```

```javascript
// Time: O(1) for initialization, O(n) for get/add/delete at arbitrary index
// Space: O(n) where n is number of elements in list

class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

class MyLinkedList {
  constructor() {
    // Use a dummy head node to simplify edge cases
    this.dummy = new ListNode(0);
    this.size = 0; // Track size for O(1) index validation
  }

  /**
   * Get the value of the index-th node in the linked list.
   * If the index is invalid, return -1.
   * @param {number} index
   * @return {number}
   */
  get(index) {
    // Check if index is valid (0 <= index < size)
    if (index < 0 || index >= this.size) {
      return -1;
    }

    // Start from first real node (after dummy)
    let curr = this.dummy.next;
    // Traverse to the desired index
    for (let i = 0; i < index; i++) {
      curr = curr.next;
    }
    return curr.val;
  }

  /**
   * Add a node of value val before the first element of the linked list.
   * After the insertion, the new node will be the first node.
   * @param {number} val
   * @return {void}
   */
  addAtHead(val) {
    // Create new node pointing to current first node
    const newNode = new ListNode(val, this.dummy.next);
    // Update dummy to point to new node
    this.dummy.next = newNode;
    // Increment size
    this.size++;
  }

  /**
   * Append a node of value val to the last element of the linked list.
   * @param {number} val
   * @return {void}
   */
  addAtTail(val) {
    // Find the last node (node before null)
    let curr = this.dummy;
    while (curr.next) {
      curr = curr.next;
    }
    // Create new node at the end
    curr.next = new ListNode(val);
    // Increment size
    this.size++;
  }

  /**
   * Add a node of value val before the index-th node in the linked list.
   * If index equals the length of the linked list, the node will be appended to the end.
   * If index is greater than the length, the node will not be inserted.
   * @param {number} index
   * @param {number} val
   * @return {void}
   */
  addAtIndex(index, val) {
    // Check if index is valid (0 <= index <= size)
    if (index < 0 || index > this.size) {
      return;
    }

    // Find the node before the insertion point
    let prev = this.dummy;
    for (let i = 0; i < index; i++) {
      prev = prev.next;
    }

    // Create new node and insert it
    const newNode = new ListNode(val, prev.next);
    prev.next = newNode;
    // Increment size
    this.size++;
  }

  /**
   * Delete the index-th node in the linked list, if the index is valid.
   * @param {number} index
   * @return {void}
   */
  deleteAtIndex(index) {
    // Check if index is valid (0 <= index < size)
    if (index < 0 || index >= this.size) {
      return;
    }

    // Find the node before the one to delete
    let prev = this.dummy;
    for (let i = 0; i < index; i++) {
      prev = prev.next;
    }

    // Skip over the node to delete
    prev.next = prev.next.next;
    // Decrement size
    this.size--;
  }
}
```

```java
// Time: O(1) for initialization, O(n) for get/add/delete at arbitrary index
// Space: O(n) where n is number of elements in list

class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class MyLinkedList {
    private ListNode dummy;  // Dummy head node
    private int size;        // Track size for O(1) index validation

    /** Initialize your data structure here. */
    public MyLinkedList() {
        // Use a dummy head node to simplify edge cases
        dummy = new ListNode(0);
        size = 0;
    }

    /** Get the value of the index-th node in the linked list. If the index is invalid, return -1. */
    public int get(int index) {
        // Check if index is valid (0 <= index < size)
        if (index < 0 || index >= size) {
            return -1;
        }

        // Start from first real node (after dummy)
        ListNode curr = dummy.next;
        // Traverse to the desired index
        for (int i = 0; i < index; i++) {
            curr = curr.next;
        }
        return curr.val;
    }

    /** Add a node of value val before the first element of the linked list. After the insertion, the new node will be the first node. */
    public void addAtHead(int val) {
        // Create new node pointing to current first node
        ListNode newNode = new ListNode(val, dummy.next);
        // Update dummy to point to new node
        dummy.next = newNode;
        // Increment size
        size++;
    }

    /** Append a node of value val to the last element of the linked list. */
    public void addAtTail(int val) {
        // Find the last node (node before null)
        ListNode curr = dummy;
        while (curr.next != null) {
            curr = curr.next;
        }
        // Create new node at the end
        curr.next = new ListNode(val);
        // Increment size
        size++;
    }

    /** Add a node of value val before the index-th node in the linked list. If index equals the length of the linked list, the node will be appended to the end. If index is greater than the length, the node will not be inserted. */
    public void addAtIndex(int index, int val) {
        // Check if index is valid (0 <= index <= size)
        if (index < 0 || index > size) {
            return;
        }

        // Find the node before the insertion point
        ListNode prev = dummy;
        for (int i = 0; i < index; i++) {
            prev = prev.next;
        }

        // Create new node and insert it
        ListNode newNode = new ListNode(val, prev.next);
        prev.next = newNode;
        // Increment size
        size++;
    }

    /** Delete the index-th node in the linked list, if the index is valid. */
    public void deleteAtIndex(int index) {
        // Check if index is valid (0 <= index < size)
        if (index < 0 || index >= size) {
            return;
        }

        // Find the node before the one to delete
        ListNode prev = dummy;
        for (int i = 0; i < index; i++) {
            prev = prev.next;
        }

        // Skip over the node to delete
        prev.next = prev.next.next;
        // Decrement size
        size--;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `get(index)`: O(min(n, index)) - We traverse from head to the index
- `addAtHead(val)`: O(1) - Constant time insertion at head
- `addAtTail(val)`: O(n) - Need to traverse to the end
- `addAtIndex(index, val)`: O(min(n, index)) - Traverse to insertion point
- `deleteAtIndex(index)`: O(min(n, index)) - Traverse to deletion point

**Space Complexity:**

- O(n) where n is the number of elements stored, for storing the nodes
- O(1) extra space for pointers and size counter

**Optimization Note:** We could achieve O(1) for `addAtTail` by maintaining a tail pointer, but this adds complexity when deleting the last element (would need to find new tail).

## Common Mistakes

1. **Forgetting to update size:** This is the most common mistake. Every add operation should increment size, every delete should decrement it. Without proper size tracking, index validation becomes O(n).

2. **Incorrect index bounds checking:**
   - For `get()` and `deleteAtIndex()`: index must be 0 ≤ index < size
   - For `addAtIndex()`: index must be 0 ≤ index ≤ size (can add at end)
   - Candidates often use `index > size` instead of `index >= size`

3. **Not handling empty list edge cases:**
   - When list is empty, `head` (or `dummy.next`) should be `None/null`
   - Operations on empty list need special handling if not using dummy node

4. **Memory management issues:**
   - In `deleteAtIndex()`, not properly skipping the deleted node
   - In languages without garbage collection, not freeing deleted node memory
   - Creating cycles by incorrect pointer assignments

## When You'll See This Pattern

This linked list implementation pattern appears in various problems:

1. **LRU Cache (LeetCode 146):** Uses doubly linked list for O(1) insert/delete with hash map for O(1) lookup. The node management is similar but with prev/next pointers.

2. **Design Browser History (LeetCode 1472):** Similar to linked list with forward/backward navigation, requiring efficient add and traversal operations.

3. **Design Twitter (LeetCode 355):** Uses linked lists for storing user tweets, requiring efficient insertion at head (like `addAtHead`).

4. **Merge Two Sorted Lists (LeetCode 21):** Requires understanding of linked list node manipulation similar to our add operations.

The core pattern is managing sequential data with efficient insertion/deletion at arbitrary positions, which linked lists excel at compared to arrays.

## Key Takeaways

1. **Dummy/sentinel nodes simplify edge cases:** By having a dummy head that doesn't store actual data, you eliminate special cases for operations at the beginning of the list.

2. **Always track size for index-based operations:** Maintaining a size counter enables O(1) index validation and makes your code cleaner and more efficient.

3. **Linked lists trade random access for efficient insertions/deletions:** While arrays offer O(1) random access, linked lists offer O(1) insert/delete at known positions (once you've found them).

4. **Consider trade-offs between singly and doubly linked:** Singly linked uses less memory (one pointer per node) but makes some operations harder. Doubly linked uses more memory but makes deletion and backward traversal easier.

Related problems: [Design Skiplist](/problem/design-skiplist)
