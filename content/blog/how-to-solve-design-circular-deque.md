---
title: "How to Solve Design Circular Deque — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Circular Deque. Medium difficulty, 64.4% acceptance rate. Topics: Array, Linked List, Design, Queue."
date: "2028-10-24"
category: "dsa-patterns"
tags: ["design-circular-deque", "array", "linked-list", "design", "medium"]
---

# How to Solve Design Circular Deque

Designing a circular deque is a classic data structure implementation problem that tests your understanding of array manipulation, modular arithmetic, and edge case handling. The tricky part is managing the front and rear pointers in a fixed-size buffer while supporting efficient insertions and deletions from both ends. Unlike a regular queue, you need to handle wrap-around logic for both directions.

## Visual Walkthrough

Let's trace through an example with `k = 3` (maximum size 3):

1. **Initialize**: `MyCircularDeque(3)` creates an empty deque with capacity 3
   - Array: `[_, _, _]` (underscores represent empty slots)
   - Front pointer: 0 (points to where next front element would go)
   - Rear pointer: 0 (points to where next rear element would go)
   - Size: 0

2. **insertFront(1)**: Add 1 to the front
   - Since array is empty, we can insert at position 0
   - Array: `[1, _, _]`
   - Front moves left (wrapping around): front = (0 - 1 + 3) % 3 = 2
   - Rear stays at 0
   - Size: 1

3. **insertLast(2)**: Add 2 to the rear
   - Insert at rear position 0
   - Array: `[1, _, 2]` (Wait, that's wrong! Let me fix...)
   - Actually: Array: `[1, 2, _]` (insert at rear=0, then rear moves to 1)
   - Front: 2, Rear: 1, Size: 2

4. **insertFront(3)**: Add 3 to the front
   - Insert at front position 2
   - Array: `[1, 2, 3]`
   - Front moves left: front = (2 - 1 + 3) % 3 = 1
   - Rear: 1, Size: 3 (now full)

5. **isFull()**: Returns true (size == capacity)

6. **deleteLast()**: Remove from rear
   - Rear moves left: rear = (1 - 1 + 3) % 3 = 0
   - Size: 2
   - Array: `[1, 2, 3]` (but rear now points to position 0)

The key insight is that we use modular arithmetic to make the array "circular" - when pointers go past the end, they wrap around to the beginning.

## Brute Force Approach

A naive approach might use a dynamic array (like Python's list or Java's ArrayList) and shift elements on every insertFront operation:

```python
class NaiveDeque:
    def __init__(self, k):
        self.capacity = k
        self.data = []

    def insertFront(self, value):
        if len(self.data) == self.capacity:
            return False
        self.data.insert(0, value)  # O(n) operation!
        return True
```

**Why this is inefficient:**

- `insertFront` takes O(n) time because all elements must be shifted
- `deleteFront` also takes O(n) for the same reason
- The problem requires all operations to be O(1)
- We're not using the fixed capacity efficiently

The brute force fails the efficiency requirements and doesn't implement the "circular" behavior explicitly.

## Optimized Approach

The optimal solution uses a fixed-size array with two pointers and modular arithmetic:

**Key Insights:**

1. **Circular Buffer**: Use a fixed-size array and treat it as circular using modulo operations
2. **Two Pointers**: Maintain `front` and `rear` indices
3. **Size Tracking**: Keep a `size` variable to distinguish between empty and full states
4. **Modular Arithmetic**: All pointer updates use `(index ± 1 + capacity) % capacity`

**Pointer Movement Logic:**

- `insertFront`: Decrement front (with wrap-around), then insert
- `insertLast`: Insert at rear, then increment rear (with wrap-around)
- `deleteFront`: Increment front (with wrap-around)
- `deleteLast`: Decrement rear (with wrap-around)

**Empty vs Full Detection:**

- Empty: `size == 0`
- Full: `size == capacity`

This approach gives us O(1) time for all operations and O(k) space.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(1) for all operations | Space: O(k) where k is capacity
class MyCircularDeque:
    def __init__(self, k: int):
        """
        Initialize your data structure with maximum size k.

        Args:
            k: Maximum number of elements the deque can hold
        """
        self.capacity = k  # Maximum size
        self.arr = [0] * k  # Fixed-size array
        self.front = 0  # Points to the front element position
        self.rear = 0  # Points to the position after the last element
        self.size = 0  # Current number of elements

    def insertFront(self, value: int) -> bool:
        """
        Adds an item at the front of Deque.

        Args:
            value: Value to insert

        Returns:
            True if successful, False if deque is full
        """
        if self.isFull():
            return False

        # Move front pointer backward (with wrap-around)
        # We insert THEN move pointer, so we need to move first
        self.front = (self.front - 1 + self.capacity) % self.capacity
        self.arr[self.front] = value
        self.size += 1
        return True

    def insertLast(self, value: int) -> bool:
        """
        Adds an item at the rear of Deque.

        Args:
            value: Value to insert

        Returns:
            True if successful, False if deque is full
        """
        if self.isFull():
            return False

        # Insert at current rear position, then move rear forward
        self.arr[self.rear] = value
        self.rear = (self.rear + 1) % self.capacity
        self.size += 1
        return True

    def deleteFront(self) -> bool:
        """
        Deletes an item from the front of Deque.

        Returns:
            True if successful, False if deque is empty
        """
        if self.isEmpty():
            return False

        # Move front pointer forward (with wrap-around)
        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        return True

    def deleteLast(self) -> bool:
        """
        Deletes an item from the rear of Deque.

        Returns:
            True if successful, False if deque is empty
        """
        if self.isEmpty():
            return False

        # Move rear pointer backward (with wrap-around)
        self.rear = (self.rear - 1 + self.capacity) % self.capacity
        self.size -= 1
        return True

    def getFront(self) -> int:
        """
        Gets the front item from the Deque.

        Returns:
            Front item if deque is not empty, -1 otherwise
        """
        if self.isEmpty():
            return -1
        return self.arr[self.front]

    def getRear(self) -> int:
        """
        Gets the last item from the Deque.

        Returns:
            Last item if deque is not empty, -1 otherwise
        """
        if self.isEmpty():
            return -1
        # Rear points to next empty slot, so get element before it
        return self.arr[(self.rear - 1 + self.capacity) % self.capacity]

    def isEmpty(self) -> bool:
        """
        Checks whether the circular deque is empty.

        Returns:
            True if deque is empty, False otherwise
        """
        return self.size == 0

    def isFull(self) -> bool:
        """
        Checks whether the circular deque is full.

        Returns:
            True if deque is full, False otherwise
        """
        return self.size == self.capacity
```

```javascript
// Time: O(1) for all operations | Space: O(k) where k is capacity
class MyCircularDeque {
  constructor(k) {
    /**
     * Initialize your data structure with maximum size k.
     *
     * @param {number} k - Maximum number of elements the deque can hold
     */
    this.capacity = k; // Maximum size
    this.arr = new Array(k).fill(0); // Fixed-size array
    this.front = 0; // Points to the front element position
    this.rear = 0; // Points to the position after the last element
    this.size = 0; // Current number of elements
  }

  insertFront(value) {
    /**
     * Adds an item at the front of Deque.
     *
     * @param {number} value - Value to insert
     * @return {boolean} True if successful, False if deque is full
     */
    if (this.isFull()) {
      return false;
    }

    // Move front pointer backward (with wrap-around)
    // We insert THEN move pointer, so we need to move first
    this.front = (this.front - 1 + this.capacity) % this.capacity;
    this.arr[this.front] = value;
    this.size++;
    return true;
  }

  insertLast(value) {
    /**
     * Adds an item at the rear of Deque.
     *
     * @param {number} value - Value to insert
     * @return {boolean} True if successful, False if deque is full
     */
    if (this.isFull()) {
      return false;
    }

    // Insert at current rear position, then move rear forward
    this.arr[this.rear] = value;
    this.rear = (this.rear + 1) % this.capacity;
    this.size++;
    return true;
  }

  deleteFront() {
    /**
     * Deletes an item from the front of Deque.
     *
     * @return {boolean} True if successful, False if deque is empty
     */
    if (this.isEmpty()) {
      return false;
    }

    // Move front pointer forward (with wrap-around)
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return true;
  }

  deleteLast() {
    /**
     * Deletes an item from the rear of Deque.
     *
     * @return {boolean} True if successful, False if deque is empty
     */
    if (this.isEmpty()) {
      return false;
    }

    // Move rear pointer backward (with wrap-around)
    this.rear = (this.rear - 1 + this.capacity) % this.capacity;
    this.size--;
    return true;
  }

  getFront() {
    /**
     * Gets the front item from the Deque.
     *
     * @return {number} Front item if deque is not empty, -1 otherwise
     */
    if (this.isEmpty()) {
      return -1;
    }
    return this.arr[this.front];
  }

  getRear() {
    /**
     * Gets the last item from the Deque.
     *
     * @return {number} Last item if deque is not empty, -1 otherwise
     */
    if (this.isEmpty()) {
      return -1;
    }
    // Rear points to next empty slot, so get element before it
    return this.arr[(this.rear - 1 + this.capacity) % this.capacity];
  }

  isEmpty() {
    /**
     * Checks whether the circular deque is empty.
     *
     * @return {boolean} True if deque is empty, False otherwise
     */
    return this.size === 0;
  }

  isFull() {
    /**
     * Checks whether the circular deque is full.
     *
     * @return {boolean} True if deque is full, False otherwise
     */
    return this.size === this.capacity;
  }
}
```

```java
// Time: O(1) for all operations | Space: O(k) where k is capacity
class MyCircularDeque {
    private int[] arr;
    private int front;
    private int rear;
    private int size;
    private int capacity;

    public MyCircularDeque(int k) {
        /**
         * Initialize your data structure with maximum size k.
         *
         * @param k Maximum number of elements the deque can hold
         */
        this.capacity = k;  // Maximum size
        this.arr = new int[k];  // Fixed-size array
        this.front = 0;  // Points to the front element position
        this.rear = 0;  // Points to the position after the last element
        this.size = 0;  // Current number of elements
    }

    public boolean insertFront(int value) {
        /**
         * Adds an item at the front of Deque.
         *
         * @param value Value to insert
         * @return True if successful, False if deque is full
         */
        if (isFull()) {
            return false;
        }

        // Move front pointer backward (with wrap-around)
        // We insert THEN move pointer, so we need to move first
        front = (front - 1 + capacity) % capacity;
        arr[front] = value;
        size++;
        return true;
    }

    public boolean insertLast(int value) {
        /**
         * Adds an item at the rear of Deque.
         *
         * @param value Value to insert
         * @return True if successful, False if deque is full
         */
        if (isFull()) {
            return false;
        }

        // Insert at current rear position, then move rear forward
        arr[rear] = value;
        rear = (rear + 1) % capacity;
        size++;
        return true;
    }

    public boolean deleteFront() {
        /**
         * Deletes an item from the front of Deque.
         *
         * @return True if successful, False if deque is empty
         */
        if (isEmpty()) {
            return false;
        }

        // Move front pointer forward (with wrap-around)
        front = (front + 1) % capacity;
        size--;
        return true;
    }

    public boolean deleteLast() {
        /**
         * Deletes an item from the rear of Deque.
         *
         * @return True if successful, False if deque is empty
         */
        if (isEmpty()) {
            return false;
        }

        // Move rear pointer backward (with wrap-around)
        rear = (rear - 1 + capacity) % capacity;
        size--;
        return true;
    }

    public int getFront() {
        /**
         * Gets the front item from the Deque.
         *
         * @return Front item if deque is not empty, -1 otherwise
         */
        if (isEmpty()) {
            return -1;
        }
        return arr[front];
    }

    public int getRear() {
        /**
         * Gets the last item from the Deque.
         *
         * @return Last item if deque is not empty, -1 otherwise
         */
        if (isEmpty()) {
            return -1;
        }
        // Rear points to next empty slot, so get element before it
        return arr[(rear - 1 + capacity) % capacity];
    }

    public boolean isEmpty() {
        /**
         * Checks whether the circular deque is empty.
         *
         * @return True if deque is empty, False otherwise
         */
        return size == 0;
    }

    public boolean isFull() {
        /**
         * Checks whether the circular deque is full.
         *
         * @return True if deque is full, False otherwise
         */
        return size == capacity;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1) for all operations**

- Each method performs a constant number of operations: array access, pointer updates, size checks
- No loops or recursion in any operation
- Modular arithmetic is O(1) computation

**Space Complexity: O(k)**

- We allocate an array of size `k` to store elements
- Additional variables (front, rear, size, capacity) use O(1) space
- Total space is O(k) where k is the maximum capacity

## Common Mistakes

1. **Forgetting to handle wrap-around properly**: When `front` or `rear` reaches the end of the array, it must wrap around to the beginning. Always use modulo operations: `(index ± 1 + capacity) % capacity`.

2. **Confusing empty vs full detection**: Without a `size` variable, it's hard to distinguish between empty and full states when `front == rear`. Some implementations use a "wasted slot" approach, but tracking size is more intuitive.

3. **Incorrect pointer movement order**: For `insertFront`, you must move the pointer BEFORE inserting. For `insertLast`, you insert THEN move. Getting this backwards causes elements to be overwritten.

4. **Off-by-one errors in getRear()**: Since `rear` points to the next empty slot, to get the last element you need `arr[(rear - 1 + capacity) % capacity]`, not `arr[rear]`.

## When You'll See This Pattern

The circular buffer pattern appears whenever you need a fixed-size FIFO/LIFO hybrid data structure:

1. **Design Circular Queue (LeetCode 622)**: Simpler version with only rear insertion and front deletion. Mastering the circular deque makes this trivial.

2. **Sliding Window Maximum (LeetCode 239)**: While typically solved with deques, understanding circular buffers helps optimize space when implementing custom deque structures.

3. **Producer-Consumer Problems**: Circular buffers are fundamental in concurrent programming for bounded buffers between producers and consumers.

4. **LRU Cache Implementation (LeetCode 146)**: While typically implemented with hashmap + doubly linked list, circular buffers can be used in space-constrained environments.

## Key Takeaways

1. **Circular buffers use modular arithmetic** to make fixed-size arrays behave as if they're circular. The formula `(index ± 1 + n) % n` handles wrap-around in both directions.

2. **Track size separately** from pointers to easily distinguish between empty and full states. This is cleaner than the "waste one slot" approach.

3. **Double-ended operations require careful pointer management**: Front and rear operations are symmetric but not identical - pay attention to whether you move before or after inserting/deleting.

4. **This pattern is fundamental for systems with fixed memory constraints** like embedded systems, real-time systems, and buffer management in I/O operations.

Related problems: [Design Circular Queue](/problem/design-circular-queue), [Design Front Middle Back Queue](/problem/design-front-middle-back-queue)
