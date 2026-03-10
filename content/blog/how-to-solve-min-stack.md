---
title: "How to Solve Min Stack — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Min Stack. Medium difficulty, 57.7% acceptance rate. Topics: Stack, Design."
date: "2026-04-17"
category: "dsa-patterns"
tags: ["min-stack", "stack", "design", "medium"]
---

# How to Solve Min Stack

Designing a stack that supports retrieving the minimum element in constant time is a classic interview problem that tests your ability to augment standard data structures. The challenge is that a regular stack gives you O(1) access to the top element, but finding the minimum normally requires O(n) time by scanning through all elements. The trick is to maintain additional information alongside each element so we can always know the current minimum without searching.

## Visual Walkthrough

Let's trace through an example to build intuition. We'll perform these operations:

1. Push 5
2. Push 3
3. Push 7
4. Get minimum (should return 3)
5. Pop (removes 7)
6. Get minimum (should still return 3)
7. Pop (removes 3)
8. Get minimum (should now return 5)

With a regular stack, after pushing 5, 3, and 7, our stack looks like: `[5, 3, 7]` (top at right). To find the minimum, we'd need to scan all three elements. After popping 7, we have `[5, 3]` and still need to scan to find the minimum.

The key insight: we need to track the minimum value **at each point in the stack**. When we push 5, the minimum is 5. When we push 3, the minimum becomes 3. When we push 7, the minimum remains 3. So we can store pairs: `(value, current_minimum)`.

Let's see this in action:

- Push 5: Store `(5, 5)` - min is 5
- Push 3: Store `(3, 3)` - min becomes 3
- Push 7: Store `(7, 3)` - min stays 3
- Get min: Look at top pair's second element: 3
- Pop: Remove `(7, 3)`
- Get min: Look at new top `(3, 3)`: 3
- Pop: Remove `(3, 3)`
- Get min: Look at new top `(5, 5)`: 5

This approach gives us O(1) access to the current minimum!

## Brute Force Approach

A naive approach would use a standard stack and implement `getMin()` by scanning through all elements:

```python
class MinStack:
    def __init__(self):
        self.stack = []

    def push(self, val):
        self.stack.append(val)

    def pop(self):
        if self.stack:
            return self.stack.pop()

    def top(self):
        if self.stack:
            return self.stack[-1]

    def getMin(self):
        if self.stack:
            return min(self.stack)
```

**Why this fails:** The `getMin()` operation takes O(n) time where n is the number of elements in the stack. The problem requires **constant time** for all operations. If we perform `getMin()` repeatedly in a loop, we get O(n²) time complexity, which is unacceptable for large inputs.

## Optimized Approach

The optimal solution maintains two pieces of information for each element:

1. The actual value being pushed
2. The minimum value in the stack **up to and including this element**

When we push a new value, we calculate the new minimum as `min(new_value, current_minimum)`. The current minimum is simply the minimum from the previous top element (or the new value itself if the stack is empty).

This works because:

- When we push, we always know what the minimum was before this push
- We compute and store what the minimum becomes after this push
- When we pop, we simply remove the top element, and the new top already has the correct minimum for the remaining stack
- All operations remain O(1) since we're just doing constant-time comparisons and stack operations

An alternative approach uses two stacks: one for values and one for minimums. This can be more space-efficient in some cases, but the paired approach is simpler to implement and understand.

## Optimal Solution

Here's the complete implementation using the paired value approach:

<div class="code-group">

```python
# Time: O(1) for all operations | Space: O(n) where n is number of elements
class MinStack:
    def __init__(self):
        # Each element in stack is a tuple: (value, current_minimum)
        # current_minimum is the minimum value in the stack up to this point
        self.stack = []

    def push(self, val: int) -> None:
        # If stack is empty, current minimum is the value itself
        if not self.stack:
            self.stack.append((val, val))
        else:
            # Get the current minimum from the top of stack
            current_min = self.stack[-1][1]
            # New minimum is the smaller of new value and current minimum
            new_min = min(val, current_min)
            # Push the pair (value, new_minimum)
            self.stack.append((val, new_min))

    def pop(self) -> None:
        # Simply remove the top element
        # The new top (if exists) already has the correct minimum
        if self.stack:
            self.stack.pop()

    def top(self) -> int:
        # Return the actual value from the top pair
        if self.stack:
            return self.stack[-1][0]
        return -1  # Or raise exception based on requirements

    def getMin(self) -> int:
        # Return the minimum from the top pair
        if self.stack:
            return self.stack[-1][1]
        return -1  # Or raise exception based on requirements
```

```javascript
// Time: O(1) for all operations | Space: O(n) where n is number of elements
class MinStack {
  constructor() {
    // Each element in stack is an object: {value, min}
    // min is the minimum value in the stack up to this point
    this.stack = [];
  }

  push(val) {
    // If stack is empty, current minimum is the value itself
    if (this.stack.length === 0) {
      this.stack.push({ value: val, min: val });
    } else {
      // Get the current minimum from the top of stack
      const currentMin = this.stack[this.stack.length - 1].min;
      // New minimum is the smaller of new value and current minimum
      const newMin = Math.min(val, currentMin);
      // Push the object with value and new minimum
      this.stack.push({ value: val, min: newMin });
    }
  }

  pop() {
    // Simply remove the top element
    // The new top (if exists) already has the correct minimum
    if (this.stack.length > 0) {
      this.stack.pop();
    }
  }

  top() {
    // Return the actual value from the top element
    if (this.stack.length > 0) {
      return this.stack[this.stack.length - 1].value;
    }
    return -1; // Or throw error based on requirements
  }

  getMin() {
    // Return the minimum from the top element
    if (this.stack.length > 0) {
      return this.stack[this.stack.length - 1].min;
    }
    return -1; // Or throw error based on requirements
  }
}
```

```java
// Time: O(1) for all operations | Space: O(n) where n is number of elements
class MinStack {
    // Use a stack of Pair objects (value, current_minimum)
    // current_minimum is the minimum value in the stack up to this point
    private Stack<Pair> stack;

    // Helper class to store value-minimum pairs
    class Pair {
        int value;
        int min;

        Pair(int value, int min) {
            this.value = value;
            this.min = min;
        }
    }

    public MinStack() {
        stack = new Stack<>();
    }

    public void push(int val) {
        // If stack is empty, current minimum is the value itself
        if (stack.isEmpty()) {
            stack.push(new Pair(val, val));
        } else {
            // Get the current minimum from the top of stack
            int currentMin = stack.peek().min;
            // New minimum is the smaller of new value and current minimum
            int newMin = Math.min(val, currentMin);
            // Push the pair (value, new_minimum)
            stack.push(new Pair(val, newMin));
        }
    }

    public void pop() {
        // Simply remove the top element
        // The new top (if exists) already has the correct minimum
        if (!stack.isEmpty()) {
            stack.pop();
        }
    }

    public int top() {
        // Return the actual value from the top pair
        if (!stack.isEmpty()) {
            return stack.peek().value;
        }
        return -1; // Or throw exception based on requirements
    }

    public int getMin() {
        // Return the minimum from the top pair
        if (!stack.isEmpty()) {
            return stack.peek().min;
        }
        return -1; // Or throw exception based on requirements
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) for all operations

- `push()`: O(1) - one comparison and one stack push
- `pop()`: O(1) - one stack pop
- `top()`: O(1) - one stack peek
- `getMin()`: O(1) - one stack peek

**Space Complexity:** O(n) where n is the number of elements in the stack

- We store each element along with its corresponding minimum
- In the worst case, this is 2n integers, which is still O(n)
- The two-stack alternative can be more space-efficient in practice if many consecutive elements have the same minimum

## Common Mistakes

1. **Forgetting to handle empty stack cases:** Always check if the stack is empty before calling `pop()`, `top()`, or `getMin()`. In interviews, clarify what should happen (return -1, throw exception, etc.).

2. **Recalculating minimum on pop:** Some candidates try to recalculate the minimum after popping by scanning the remaining elements. This makes `pop()` O(n). Remember: the minimum for the new top is already stored with that element!

3. **Using a separate variable for global minimum:** Storing just one `min` variable doesn't work because when you pop the minimum element, you lose track of what the new minimum should be. You need history of minimums.

4. **Not understanding why pairs work:** The key insight is that each element stores the minimum **of the stack up to that point**. When you pop, you're revealing the element below which already knows the minimum for the remaining stack.

## When You'll See This Pattern

This "augmented stack" pattern appears whenever you need to maintain additional information about a sequence of elements while supporting efficient updates at the end. Other problems using similar techniques:

1. **Max Stack (LeetCode 716)** - The exact same problem but for maximum instead of minimum. The solution is identical with `max()` instead of `min()`.

2. **Sliding Window Maximum (LeetCode 239)** - While not using a stack, it uses a deque to maintain maximum values in a sliding window, applying similar "keep track of extremum" logic.

3. **Next Greater Element (LeetCode 496, 503)** - These problems use monotonic stacks to efficiently find next greater elements, another example of augmenting stacks with additional information.

4. **Stock Span Problem (LeetCode 901)** - Uses a stack to maintain price and span information, similar to our value-minimum pairs.

## Key Takeaways

1. **Augment standard data structures:** When you need additional information (like minimum, maximum, count) alongside standard operations, consider storing that information with each element.

2. **Think about what information you need at each point:** For minimum tracking, we need to know "what is the minimum up to this point in the stack?" This lets us recover quickly after pops.

3. **Trade space for time:** The O(n) extra space gives us O(1) time for all operations. This is a common tradeoff in algorithm design.

4. **Consider edge cases early:** Empty stacks, duplicate minimum values, and large numbers of operations are all important to handle correctly.

Related problems: [Sliding Window Maximum](/problem/sliding-window-maximum), [Max Stack](/problem/max-stack)
