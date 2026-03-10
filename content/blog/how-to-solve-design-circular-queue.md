---
title: "How to Solve Design Circular Queue — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Circular Queue. Medium difficulty, 54.0% acceptance rate. Topics: Array, Linked List, Design, Queue."
date: "2027-06-05"
category: "dsa-patterns"
tags: ["design-circular-queue", "array", "linked-list", "design", "medium"]
---

# How to Solve Design Circular Queue

Designing a circular queue is a classic data structure implementation problem that tests your understanding of arrays, pointers, and edge case handling. What makes this problem interesting is that you need to manage a fixed-size buffer efficiently while handling the wrap-around behavior when the queue reaches its capacity. The main challenge is avoiding off-by-one errors and correctly tracking the empty/full states.

## Visual Walkthrough

Let's trace through a circular queue with capacity 3 (size 4, since we need one empty slot to distinguish between full and empty states):

**Initial State:** `front = 0`, `rear = 0`, `size = 4`

```
Index: 0   1   2   3
Value: -   -   -   -
```

**Step 1:** `enQueue(1)` → `rear = 1`

```
Index: 0   1   2   3
Value: 1   -   -   -
```

**Step 2:** `enQueue(2)` → `rear = 2`

```
Index: 0   1   2   3
Value: 1   2   -   -
```

**Step 3:** `enQueue(3)` → `rear = 3`

```
Index: 0   1   2   3
Value: 1   2   3   -
```

**Step 4:** `deQueue()` → `front = 1`

```
Index: 0   1   2   3
Value: -   2   3   -
```

**Step 5:** `enQueue(4)` → `rear = 0` (wraps around!)

```
Index: 0   1   2   3
Value: 4   2   3   -
```

**Step 6:** `enQueue(5)` → fails! Queue is full because `(rear + 1) % size == front`

The key insight: we need one empty slot to distinguish between full and empty states. When `front == rear`, the queue is empty. When `(rear + 1) % size == front`, the queue is full.

## Brute Force Approach

A naive approach might use a dynamic array and shift elements on every dequeue operation. For example:

```python
class NaiveCircularQueue:
    def __init__(self, k):
        self.capacity = k
        self.queue = []

    def enQueue(self, value):
        if len(self.queue) >= self.capacity:
            return False
        self.queue.append(value)
        return True

    def deQueue(self):
        if not self.queue:
            return False
        self.queue.pop(0)  # O(n) operation!
        return True
```

**Why this fails:**

- `deQueue()` takes O(n) time because removing from the front of a list requires shifting all remaining elements
- Doesn't actually implement circular behavior - just a regular queue with capacity limit
- Wastes space by not reusing freed slots

The brute force approach misses the entire point of a circular queue: O(1) operations and efficient space reuse.

## Optimized Approach

The optimal solution uses a fixed-size array with two pointers (`front` and `rear`) and modular arithmetic for wrap-around. Here's the key insight:

1. **Use a fixed-size array** with capacity `k+1` (we need one extra slot to distinguish between full and empty)
2. **Track `front` and `rear` pointers** that move through the array
3. **Use modulo arithmetic** for wrap-around: `(position + 1) % size`
4. **Empty condition**: `front == rear`
5. **Full condition**: `(rear + 1) % size == front`

The extra slot is crucial: without it, `front == rear` could mean either empty OR full, creating ambiguity.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) for all operations | Space: O(k) where k is the capacity
class MyCircularQueue:
    def __init__(self, k: int):
        """
        Initialize your data structure with capacity k.
        We create an array of size k+1 to distinguish between
        full and empty states using one extra slot.
        """
        self.size = k + 1  # One extra slot for full/empty distinction
        self.queue = [0] * self.size
        self.front = 0  # Points to the first element
        self.rear = 0   # Points to the next available position

    def enQueue(self, value: int) -> bool:
        """
        Insert an element into the circular queue.
        Return true if the operation is successful.
        """
        if self.isFull():
            return False

        # Add element at rear position
        self.queue[self.rear] = value
        # Move rear forward with wrap-around using modulo
        self.rear = (self.rear + 1) % self.size
        return True

    def deQueue(self) -> bool:
        """
        Delete an element from the circular queue.
        Return true if the operation is successful.
        """
        if self.isEmpty():
            return False

        # Move front forward - we don't need to actually delete the value,
        # just move the pointer since it will be overwritten later
        self.front = (self.front + 1) % self.size
        return True

    def Front(self) -> int:
        """
        Get the front item from the queue.
        """
        if self.isEmpty():
            return -1
        return self.queue[self.front]

    def Rear(self) -> int:
        """
        Get the last item from the queue.
        """
        if self.isEmpty():
            return -1

        # Rear points to the next available position, so the last element
        # is at (rear - 1 + size) % size to handle wrap-around
        return self.queue[(self.rear - 1 + self.size) % self.size]

    def isEmpty(self) -> bool:
        """
        Checks whether the circular queue is empty or not.
        """
        return self.front == self.rear

    def isFull(self) -> bool:
        """
        Checks whether the circular queue is full or not.
        """
        # Queue is full when rear is exactly one position behind front
        # (with wrap-around)
        return (self.rear + 1) % self.size == self.front
```

```javascript
// Time: O(1) for all operations | Space: O(k) where k is the capacity
class MyCircularQueue {
  constructor(k) {
    /**
     * Initialize your data structure with capacity k.
     * We create an array of size k+1 to distinguish between
     * full and empty states using one extra slot.
     */
    this.size = k + 1; // One extra slot for full/empty distinction
    this.queue = new Array(this.size);
    this.front = 0; // Points to the first element
    this.rear = 0; // Points to the next available position
  }

  enQueue(value) {
    /**
     * Insert an element into the circular queue.
     * Return true if the operation is successful.
     */
    if (this.isFull()) {
      return false;
    }

    // Add element at rear position
    this.queue[this.rear] = value;
    // Move rear forward with wrap-around using modulo
    this.rear = (this.rear + 1) % this.size;
    return true;
  }

  deQueue() {
    /**
     * Delete an element from the circular queue.
     * Return true if the operation is successful.
     */
    if (this.isEmpty()) {
      return false;
    }

    // Move front forward - we don't need to actually delete the value,
    // just move the pointer since it will be overwritten later
    this.front = (this.front + 1) % this.size;
    return true;
  }

  Front() {
    /**
     * Get the front item from the queue.
     */
    if (this.isEmpty()) {
      return -1;
    }
    return this.queue[this.front];
  }

  Rear() {
    /**
     * Get the last item from the queue.
     */
    if (this.isEmpty()) {
      return -1;
    }

    // Rear points to the next available position, so the last element
    // is at (rear - 1 + size) % size to handle wrap-around
    return this.queue[(this.rear - 1 + this.size) % this.size];
  }

  isEmpty() {
    /**
     * Checks whether the circular queue is empty or not.
     */
    return this.front === this.rear;
  }

  isFull() {
    /**
     * Checks whether the circular queue is full or not.
     */
    // Queue is full when rear is exactly one position behind front
    // (with wrap-around)
    return (this.rear + 1) % this.size === this.front;
  }
}
```

```java
// Time: O(1) for all operations | Space: O(k) where k is the capacity
class MyCircularQueue {
    private int[] queue;
    private int front;
    private int rear;
    private int size;

    public MyCircularQueue(int k) {
        /**
         * Initialize your data structure with capacity k.
         * We create an array of size k+1 to distinguish between
         * full and empty states using one extra slot.
         */
        this.size = k + 1;  // One extra slot for full/empty distinction
        this.queue = new int[this.size];
        this.front = 0;  // Points to the first element
        this.rear = 0;   // Points to the next available position
    }

    public boolean enQueue(int value) {
        /**
         * Insert an element into the circular queue.
         * Return true if the operation is successful.
         */
        if (isFull()) {
            return false;
        }

        // Add element at rear position
        queue[rear] = value;
        // Move rear forward with wrap-around using modulo
        rear = (rear + 1) % size;
        return true;
    }

    public boolean deQueue() {
        /**
         * Delete an element from the circular queue.
         * Return true if the operation is successful.
         */
        if (isEmpty()) {
            return false;
        }

        // Move front forward - we don't need to actually delete the value,
        // just move the pointer since it will be overwritten later
        front = (front + 1) % size;
        return true;
    }

    public int Front() {
        /**
         * Get the front item from the queue.
         */
        if (isEmpty()) {
            return -1;
        }
        return queue[front];
    }

    public int Rear() {
        /**
         * Get the last item from the queue.
         */
        if (isEmpty()) {
            return -1;
        }

        // Rear points to the next available position, so the last element
        // is at (rear - 1 + size) % size to handle wrap-around
        return queue[(rear - 1 + size) % size];
    }

    public boolean isEmpty() {
        /**
         * Checks whether the circular queue is empty or not.
         */
        return front == rear;
    }

    public boolean isFull() {
        /**
         * Checks whether the circular queue is full or not.
         */
        // Queue is full when rear is exactly one position behind front
        // (with wrap-around)
        return (rear + 1) % size == front;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1) for all operations**

- `enQueue()`, `deQueue()`, `Front()`, `Rear()`, `isEmpty()`, `isFull()` all perform constant-time operations (array access, modulo arithmetic, comparisons)
- No loops or recursion in any operation

**Space Complexity: O(k) where k is the capacity**

- We allocate an array of size `k+1` to store the queue elements
- The extra space for `front`, `rear`, and `size` pointers is O(1)
- Total space is dominated by the array: O(k)

## Common Mistakes

1. **Forgetting the extra slot for full/empty distinction**: This is the most common mistake. Without the extra slot, `front == rear` could mean either empty OR full. Always allocate `k+1` space.

2. **Incorrect wrap-around calculation in Rear()**: When getting the rear element, you need `(rear - 1 + size) % size`, not just `rear - 1`. The `+ size` ensures we handle negative indices correctly when `rear = 0`.

3. **Not handling modulo arithmetic correctly**: Always use `(position + 1) % size` for moving forward and `(position - 1 + size) % size` for moving backward. Don't use conditional checks for wrap-around - modulo handles it elegantly.

4. **Actually deleting elements in deQueue()**: You don't need to set the dequeued element to null/zero. Just move the `front` pointer - the old value will be overwritten when that slot is reused.

## When You'll See This Pattern

The circular buffer pattern appears in many system design and low-level programming scenarios:

1. **Design Circular Deque (LeetCode 641)**: A natural extension where you need to support insertion/deletion at both ends while maintaining circular behavior.

2. **Sliding Window Maximum (LeetCode 239)**: While not exactly a circular queue, it uses similar pointer management for maintaining a window of elements.

3. **Producer-Consumer Problems**: Circular buffers are fundamental to implementing bounded buffers in concurrent programming where producers add items and consumers remove them.

4. **Audio/Video Streaming**: Circular buffers efficiently handle real-time data streams where old data gets overwritten by new data.

## Key Takeaways

1. **The extra slot trick**: Always allocate `capacity + 1` space for a circular queue. This creates a sentinel position that helps distinguish between full and empty states without additional flags.

2. **Modulo arithmetic is your friend**: Use `% size` for all pointer movements to handle wrap-around elegantly. This eliminates complex conditional logic for boundary checks.

3. **Pointers vs. values**: In a circular queue, you move pointers, not data. The `front` and `rear` pointers "chase" each other around the circle, with data staying in place until overwritten.

Related problems: [Design Circular Deque](/problem/design-circular-deque), [Design Front Middle Back Queue](/problem/design-front-middle-back-queue)
