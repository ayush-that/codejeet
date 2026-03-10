---
title: "How to Solve Implement Stack using Queues — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Implement Stack using Queues. Easy difficulty, 69.4% acceptance rate. Topics: Stack, Design, Queue."
date: "2026-09-23"
category: "dsa-patterns"
tags: ["implement-stack-using-queues", "stack", "design", "queue", "easy"]
---

# How to Solve "Implement Stack using Queues"

This problem asks you to implement a stack (LIFO - Last In, First Out) using only two queues (FIFO - First In, First Out). The challenge is that queues and stacks have opposite ordering principles, so we need to cleverly use two queues to simulate stack behavior. What makes this interesting is that we must maintain stack semantics while being constrained to queue operations like enqueue (add to back) and dequeue (remove from front).

## Visual Walkthrough

Let's trace through an example to build intuition. We'll implement a stack that supports `push(1)`, `push(2)`, `push(3)`, then `pop()`, `top()`, and `empty()`.

**Initial state:** Two empty queues: `q1 = []`, `q2 = []`

**Step 1: push(1)**

- We need to add 1 to the "top" of our stack
- Since queues only add to the back, we can simply enqueue to `q1`
- `q1 = [1]`, `q2 = []`
- The stack now has: [1] (top is 1)

**Step 2: push(2)**

- We want 2 to be the new top
- If we just enqueue to `q1`, we get `q1 = [1, 2]` (front is 1, back is 2)
- But for a stack, popping should return 2 (the most recent)
- Solution: Add 2 to empty `q2`, then move all elements from `q1` to `q2`
  1. `q2 = [2]` (enqueue 2)
  2. Move 1 from `q1` to `q2`: `q2 = [2, 1]`
  3. Swap `q1` and `q2` so `q1` always holds the stack
- `q1 = [2, 1]`, `q2 = []`
- Stack: [2, 1] (top is 2)

**Step 3: push(3)**

- Same process: Add 3 to empty `q2`, move all from `q1` to `q2`
  1. `q2 = [3]`
  2. Move 2, 1 from `q1` to `q2`: `q2 = [3, 2, 1]`
  3. Swap queues
- `q1 = [3, 2, 1]`, `q2 = []`
- Stack: [3, 2, 1] (top is 3)

**Step 4: pop()**

- Should return 3 (top of stack)
- Since `q1 = [3, 2, 1]` has 3 at the front (due to our push logic)
- Simply dequeue from `q1`: returns 3
- `q1 = [2, 1]`
- Stack: [2, 1] (top is now 2)

**Step 5: top()**

- Should return 2 (current top without removing)
- Front of `q1` is 2
- Return front element
- Stack unchanged: [2, 1]

**Step 6: empty()**

- Check if `q1` is empty
- `q1` has 2 elements, so return false

This approach ensures the most recently pushed element is always at the front of the main queue, making `pop()` and `top()` O(1) operations.

## Brute Force Approach

A truly naive approach might try to use a single queue and shift elements on every operation. For example:

- `push(x)`: Enqueue x (O(1))
- `pop()`: Dequeue all elements except the last, store them temporarily, dequeue the last (which is the "top"), then restore all other elements (O(n))
- `top()`: Similar to pop but without removing (O(n))
- `empty()`: Check if queue is empty (O(1))

While this works, it's inefficient because `pop()` and `top()` become O(n) operations. The problem becomes: can we make some operations faster by using an extra queue?

Actually, the "brute force" for this specific problem IS the two-queue approach we'll show below. The key insight is that by using two queues strategically, we can make `push()` O(n) and `pop()/top()` O(1), or vice versa. Most candidates choose to make `push()` O(n) since stacks typically have more pushes than pops in real usage.

## Optimal Solution

We'll implement the stack with two queues where `push()` is O(n) and `pop()/top()/empty()` are O(1). The main idea: always keep the most recent element at the front of the main queue.

<div class="code-group">

```python
# Time Complexity:
# - push: O(n) - we move n-1 elements from q1 to q2
# - pop: O(1) - just dequeue from front
# - top: O(1) - just peek front element
# - empty: O(1) - check if queue is empty
#
# Space Complexity: O(n) - we store all elements across two queues

from collections import deque

class MyStack:
    def __init__(self):
        # Initialize two queues
        # q1 will always hold the stack elements with top at front
        # q2 is used as a temporary queue during push operations
        self.q1 = deque()
        self.q2 = deque()

    def push(self, x: int) -> None:
        # Add the new element to empty q2
        self.q2.append(x)

        # Move all elements from q1 to q2
        # This ensures the new element ends up at the front
        while self.q1:
            self.q2.append(self.q1.popleft())

        # Swap q1 and q2 so q1 always contains the stack
        # Now q1 has the new element at front, followed by older elements
        self.q1, self.q2 = self.q2, self.q1

    def pop(self) -> int:
        # Since q1 has top element at front (due to our push logic)
        # Simply remove and return the front element
        return self.q1.popleft()

    def top(self) -> int:
        # Return the front element without removing it
        return self.q1[0]

    def empty(self) -> bool:
        # Stack is empty if q1 has no elements
        return len(self.q1) == 0
```

```javascript
// Time Complexity:
// - push: O(n) - we move n-1 elements from q1 to q2
// - pop: O(1) - just shift from front
// - top: O(1) - just access first element
// - empty: O(1) - check if queue is empty
//
// Space Complexity: O(n) - we store all elements across two queues

class MyStack {
  constructor() {
    // Initialize two arrays to act as queues
    // q1 will always hold the stack elements with top at front
    // q2 is used as a temporary queue during push operations
    this.q1 = [];
    this.q2 = [];
  }

  push(x) {
    // Add the new element to empty q2
    this.q2.push(x);

    // Move all elements from q1 to q2
    // This ensures the new element ends up at the front
    while (this.q1.length > 0) {
      this.q2.push(this.q1.shift());
    }

    // Swap q1 and q2 so q1 always contains the stack
    // Now q1 has the new element at front, followed by older elements
    [this.q1, this.q2] = [this.q2, this.q1];
  }

  pop() {
    // Since q1 has top element at front (due to our push logic)
    // Simply remove and return the front element
    return this.q1.shift();
  }

  top() {
    // Return the front element without removing it
    return this.q1[0];
  }

  empty() {
    // Stack is empty if q1 has no elements
    return this.q1.length === 0;
  }
}
```

```java
// Time Complexity:
// - push: O(n) - we move n-1 elements from q1 to q2
// - pop: O(1) - just poll from front
// - top: O(1) - just peek front element
// - empty: O(1) - check if queue is empty
//
// Space Complexity: O(n) - we store all elements across two queues

import java.util.LinkedList;
import java.util.Queue;

class MyStack {
    private Queue<Integer> q1;
    private Queue<Integer> q2;

    public MyStack() {
        // Initialize two queues
        // q1 will always hold the stack elements with top at front
        // q2 is used as a temporary queue during push operations
        q1 = new LinkedList<>();
        q2 = new LinkedList<>();
    }

    public void push(int x) {
        // Add the new element to empty q2
        q2.offer(x);

        // Move all elements from q1 to q2
        // This ensures the new element ends up at the front
        while (!q1.isEmpty()) {
            q2.offer(q1.poll());
        }

        // Swap q1 and q2 so q1 always contains the stack
        // Now q1 has the new element at front, followed by older elements
        Queue<Integer> temp = q1;
        q1 = q2;
        q2 = temp;
    }

    public int pop() {
        // Since q1 has top element at front (due to our push logic)
        // Simply remove and return the front element
        return q1.poll();
    }

    public int top() {
        // Return the front element without removing it
        return q1.peek();
    }

    public boolean empty() {
        // Stack is empty if q1 has no elements
        return q1.isEmpty();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `push(x)`: O(n) - We need to move all existing elements from `q1` to `q2` (n-1 moves), making this linear in the number of elements.
- `pop()`: O(1) - Simply remove from the front of `q1`.
- `top()`: O(1) - Peek at the front of `q1`.
- `empty()`: O(1) - Check if `q1` is empty.

**Space Complexity:** O(n) - We store all elements across the two queues. At any time, all elements are in `q1` (with `q2` empty) or being transferred between them, so we use O(n) space.

**Trade-off:** We chose to make `push()` O(n) and other operations O(1). The alternative (making `pop()` O(n) and `push()` O(1)) is also valid and has the same overall complexity. The choice depends on expected usage patterns - stacks typically see more pushes than pops, so this implementation might be slightly less optimal in practice, but both approaches are acceptable in interviews.

## Common Mistakes

1. **Using a single queue and rotating on every operation:** Some candidates try to use just one queue and rotate elements on both `push()` and `pop()`. This makes all operations O(n) instead of having some O(1) operations. Always check if you can optimize some operations at the expense of others.

2. **Forgetting to swap queues properly:** After moving elements from `q1` to `q2`, you must swap the queues so `q1` always contains the stack. Forgetting this means `q1` becomes empty and `q2` holds all elements, breaking subsequent operations.

3. **Not handling empty stack edge cases:** When calling `pop()` or `top()` on an empty stack, you should handle this gracefully. In our implementation, we rely on the underlying queue's behavior (which typically throws an exception or returns null). In an interview, mention that you'd add a check: `if (empty()) throw new RuntimeException("Stack is empty")`.

4. **Inefficient queue operations:** Using lists without proper queue semantics (like using Python lists with `pop(0)` which is O(n)) instead of `deque` (which has O(1) `popleft()`). Always use the right data structure for queue operations.

## When You'll See This Pattern

This "two data structures to simulate one" pattern appears in several problems:

1. **Implement Queue using Stacks (LeetCode 232)** - The inverse problem: implement FIFO queue using LIFO stacks. Uses two stacks with similar element-shuffling logic.

2. **Min Stack (LeetCode 155)** - While not exactly the same, it also involves augmenting a standard data structure (stack) with additional data (min value tracking) to support extra operations efficiently.

3. **Moving Average from Data Stream (LeetCode 346)** - Uses a queue to maintain a sliding window of values, similar to how we use queues to maintain order here.

The core pattern is: when you need to support operations that aren't native to your data structure, use auxiliary structures to rearrange elements or store metadata.

## Key Takeaways

1. **Trade-offs in operation complexity:** When designing data structures, you often need to choose which operations to optimize. Here we made `push()` O(n) to get O(1) `pop()` and `top()`. Always consider the expected usage pattern when making these decisions.

2. **Simulating one ADT with another:** The key insight is that by using two queues and strategically moving elements between them, we can reverse the FIFO order to get LIFO behavior. This "shuffle between two containers" technique is reusable.

3. **Queue selection matters:** Always use proper queue implementations (like `deque` in Python, `LinkedList` in Java) that support O(1) enqueue/dequeue operations. Using arrays/lists with O(n) removals from the front will make your solution inefficient.

Related problems: [Implement Queue using Stacks](/problem/implement-queue-using-stacks)
