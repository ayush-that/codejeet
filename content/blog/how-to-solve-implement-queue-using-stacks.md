---
title: "How to Solve Implement Queue using Stacks — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Implement Queue using Stacks. Easy difficulty, 69.4% acceptance rate. Topics: Stack, Design, Queue."
date: "2026-07-27"
category: "dsa-patterns"
tags: ["implement-queue-using-stacks", "stack", "design", "queue", "easy"]
---

# How to Solve "Implement Queue using Stacks"

This problem asks us to implement a queue (FIFO - First In, First Out) using only two stacks (LIFO - Last In, First Out). The challenge is that stacks and queues have opposite ordering principles, so we need to cleverly use two stacks to reverse the order of elements when needed. This is a classic interview question that tests your understanding of fundamental data structures and your ability to manipulate them.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. We'll implement a queue that supports `push(1)`, `push(2)`, `peek()`, `pop()`, and `push(3)`.

**Initial state:** We have two empty stacks: `stackIn` and `stackOut`

```
stackIn: []
stackOut: []
```

**Step 1: push(1)**
We push 1 directly to `stackIn` (always push to `stackIn`)

```
stackIn: [1]
stackOut: []
```

**Step 2: push(2)**
We push 2 to `stackIn`

```
stackIn: [1, 2]
stackOut: []
```

**Step 3: peek()**
To peek at the front of the queue, we need the oldest element. Since `stackIn` has newest elements on top, we need to transfer all elements from `stackIn` to `stackOut` (which reverses their order). After transfer:

```
stackIn: []
stackOut: [2, 1]  ← Top of stack is 1 (oldest element)
```

Now we can peek at the top of `stackOut`, which is 1 (correct front of queue).

**Step 4: pop()**
We need to remove the front element. Since we already transferred elements in the previous step, `stackOut` still has `[2, 1]`. We pop from `stackOut`, removing 1:

```
stackIn: []
stackOut: [2]
```

**Step 5: push(3)**
We push 3 to `stackIn` (always push to `stackIn`)

```
stackIn: [3]
stackOut: [2]
```

**Key insight:** We only transfer from `stackIn` to `stackOut` when we need to access the front of the queue (for `peek()` or `pop()`) AND `stackOut` is empty. This amortizes the cost of transferring elements.

## Brute Force Approach

A truly naive approach might try to use a single stack and repeatedly reverse it for every operation, but that would be O(n) for every operation. Another naive approach might be to always keep elements in reverse order by transferring between stacks on every operation, which would also be inefficient.

However, the standard solution for this problem is already quite efficient with amortized O(1) operations. The "brute force" thinking here would be: what if we transfer elements between stacks on every single operation? Let's analyze that:

**Inefficient approach:** Transfer all elements from `stackIn` to `stackOut` on every `push()`, or vice versa on every `pop()`. This would give us:

- `push(x)`: O(n) - transfer all elements from `stackOut` to `stackIn`, push x, then transfer back
- `pop()`: O(n) - transfer all elements from `stackIn` to `stackOut`, pop, then transfer back
- `peek()`: O(n) - similar to pop
- `empty()`: O(1) - check if both stacks are empty

This approach works but is highly inefficient because every operation becomes O(n). The key optimization is to **lazily** transfer elements only when needed.

## Optimal Solution

The optimal solution uses two stacks with lazy element transfer:

- `stackIn`: Used for all `push()` operations
- `stackOut`: Used for all `pop()` and `peek()` operations
- Transfer elements from `stackIn` to `stackOut` only when `stackOut` is empty and we need to access the front

This gives us **amortized O(1)** time complexity for all operations.

<div class="code-group">

```python
class MyQueue:
    # Time: O(1) amortized for all operations | Space: O(n)

    def __init__(self):
        # Initialize two stacks: one for input, one for output
        self.stack_in = []
        self.stack_out = []

    def push(self, x: int) -> None:
        # Always push new elements to the input stack
        # This is O(1) operation
        self.stack_in.append(x)

    def pop(self) -> int:
        # Ensure the output stack has the front element
        self._transfer_if_needed()
        # Pop from output stack (which contains elements in queue order)
        return self.stack_out.pop()

    def peek(self) -> int:
        # Ensure the output stack has the front element
        self._transfer_if_needed()
        # Peek at the top of output stack without removing it
        return self.stack_out[-1]

    def empty(self) -> bool:
        # Queue is empty only if both stacks are empty
        return not self.stack_in and not self.stack_out

    def _transfer_if_needed(self) -> None:
        # Helper method: transfer elements from input to output stack
        # ONLY when output stack is empty
        if not self.stack_out:
            # Transfer all elements from input to output stack
            # This reverses their order, putting oldest element on top
            while self.stack_in:
                self.stack_out.append(self.stack_in.pop())
```

```javascript
class MyQueue {
  // Time: O(1) amortized for all operations | Space: O(n)

  constructor() {
    // Initialize two stacks: one for input, one for output
    this.stackIn = [];
    this.stackOut = [];
  }

  push(x) {
    // Always push new elements to the input stack
    // This is O(1) operation
    this.stackIn.push(x);
  }

  pop() {
    // Ensure the output stack has the front element
    this._transferIfNeeded();
    // Pop from output stack (which contains elements in queue order)
    return this.stackOut.pop();
  }

  peek() {
    // Ensure the output stack has the front element
    this._transferIfNeeded();
    // Peek at the top of output stack without removing it
    return this.stackOut[this.stackOut.length - 1];
  }

  empty() {
    // Queue is empty only if both stacks are empty
    return this.stackIn.length === 0 && this.stackOut.length === 0;
  }

  _transferIfNeeded() {
    // Helper method: transfer elements from input to output stack
    // ONLY when output stack is empty
    if (this.stackOut.length === 0) {
      // Transfer all elements from input to output stack
      // This reverses their order, putting oldest element on top
      while (this.stackIn.length > 0) {
        this.stackOut.push(this.stackIn.pop());
      }
    }
  }
}
```

```java
class MyQueue {
    // Time: O(1) amortized for all operations | Space: O(n)

    private Stack<Integer> stackIn;
    private Stack<Integer> stackOut;

    public MyQueue() {
        // Initialize two stacks: one for input, one for output
        stackIn = new Stack<>();
        stackOut = new Stack<>();
    }

    public void push(int x) {
        // Always push new elements to the input stack
        // This is O(1) operation
        stackIn.push(x);
    }

    public int pop() {
        // Ensure the output stack has the front element
        transferIfNeeded();
        // Pop from output stack (which contains elements in queue order)
        return stackOut.pop();
    }

    public int peek() {
        // Ensure the output stack has the front element
        transferIfNeeded();
        // Peek at the top of output stack without removing it
        return stackOut.peek();
    }

    public boolean empty() {
        // Queue is empty only if both stacks are empty
        return stackIn.isEmpty() && stackOut.isEmpty();
    }

    private void transferIfNeeded() {
        // Helper method: transfer elements from input to output stack
        // ONLY when output stack is empty
        if (stackOut.isEmpty()) {
            // Transfer all elements from input to output stack
            // This reverses their order, putting oldest element on top
            while (!stackIn.isEmpty()) {
                stackOut.push(stackIn.pop());
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `push(x)`: O(1) - simply push to `stackIn`
- `pop()`: **Amortized O(1)** - in the worst case, we might need to transfer n elements from `stackIn` to `stackOut`, but this only happens when `stackOut` is empty. Each element is transferred exactly once from `stackIn` to `stackOut`, so over n operations, the total transfer cost is O(n), giving us amortized O(1) per operation.
- `peek()`: **Amortized O(1)** - same reasoning as `pop()`
- `empty()`: O(1) - just check if both stacks are empty

**Space Complexity:** O(n) where n is the number of elements in the queue. We store each element in either `stackIn` or `stackOut` (never both at the same time).

## Common Mistakes

1. **Transferring on every operation:** Some candidates transfer elements between stacks on every `push()` or `pop()`, making operations O(n) instead of amortized O(1). Remember: only transfer when `stackOut` is empty AND you need to access the front.

2. **Forgetting to check if `stackOut` is empty before transferring:** Always check `if not stackOut` (or equivalent) before transferring. If `stackOut` already has elements, they're in the correct queue order, so don't disturb them.

3. **Incorrect empty check:** The queue is empty only when BOTH stacks are empty. Checking only `stackIn` or only `stackOut` can give wrong results. For example, after a `pop()` operation, `stackIn` might be empty but `stackOut` could still have elements.

4. **Not understanding amortized complexity:** Interviewers often ask about time complexity. Be prepared to explain why `pop()` and `peek()` are amortized O(1), not just O(1). Each element is moved from `stackIn` to `stackOut` exactly once, so over n operations, the total cost is O(n), giving O(1) on average.

## When You'll See This Pattern

The "two stacks to implement a queue" pattern appears in several contexts:

1. **Browser history navigation:** Some browsers use two stacks to implement back/forward navigation, similar to how we use two stacks for a queue.

2. **Implementing undo/redo functionality:** Text editors and graphic design software often use stacks to manage undo/redo operations, and sometimes need queue-like behavior.

3. **Related LeetCode problems:**
   - **[232. Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)** - This is the current problem.
   - **[225. Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/)** - The inverse problem, where you implement a stack using queues.
   - **[155. Min Stack](https://leetcode.com/problems/min-stack/)** - While not exactly the same, it also involves augmenting a basic data structure to support additional functionality efficiently.

## Key Takeaways

1. **Amortized analysis matters:** Sometimes an operation that seems O(n) can be amortized O(1) if the expensive operation happens infrequently. Always consider the total cost over a sequence of operations.

2. **Lazy evaluation is powerful:** Instead of maintaining perfect order after every operation, we can defer work until it's absolutely necessary. This is a common optimization pattern in system design and algorithms.

3. **Understand the trade-offs:** Stacks are LIFO, queues are FIFO. By using two stacks, we can simulate FIFO behavior, but we pay with extra space and occasional O(n) operations that average out to O(1).

Related problems: [Implement Stack using Queues](/problem/implement-stack-using-queues)
