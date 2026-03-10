---
title: "How to Solve Validate Stack Sequences — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Validate Stack Sequences. Medium difficulty, 70.2% acceptance rate. Topics: Array, Stack, Simulation."
date: "2027-09-10"
category: "dsa-patterns"
tags: ["validate-stack-sequences", "array", "stack", "simulation", "medium"]
---

# How to Solve Validate Stack Sequences

This problem asks whether a given sequence of push and pop operations on a stack is valid. You're given two arrays: `pushed` (the order elements are pushed) and `popped` (the order they're popped). The challenge is that you can push elements in order, but you can pop them at any time — not just in the reverse order they were pushed. This makes the problem interesting because you need to simulate the stack's behavior to see if the pop sequence is achievable.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose:

- `pushed = [1, 2, 3, 4, 5]`
- `popped = [4, 5, 3, 2, 1]`

We'll simulate what happens with an empty stack:

1. **Push 1** → Stack: [1]
2. **Push 2** → Stack: [1, 2]
3. **Push 3** → Stack: [1, 2, 3]
4. **Push 4** → Stack: [1, 2, 3, 4]

Now we need to pop 4 (first element in `popped`). The top of stack is 4, so we can pop it. 5. **Pop 4** → Stack: [1, 2, 3], `popped` pointer moves to 5

Next we need to pop 5, but top is 3. So we need to push more: 6. **Push 5** → Stack: [1, 2, 3, 5] 7. **Pop 5** → Stack: [1, 2, 3], `popped` pointer moves to 3

Now top is 3, which matches next pop: 8. **Pop 3** → Stack: [1, 2], `popped` pointer moves to 2 9. **Pop 2** → Stack: [1], `popped` pointer moves to 1 10. **Pop 1** → Stack: [], `popped` pointer moves to end

Since we processed all pops successfully, this is a valid sequence.

Now consider an invalid example: `pushed = [1, 2, 3, 4, 5]`, `popped = [4, 3, 5, 1, 2]`

After popping 4 and 3, we push 5 and pop it. Now stack has [1, 2]. Next pop should be 1, but top is 2. We can't pop 1 without popping 2 first, so this sequence is invalid.

## Brute Force Approach

A naive approach would be to generate all possible sequences of push/pop operations and check if any produces the target pop sequence. For each element, we can either push it (if available) or pop from the stack (if not empty). This leads to exploring all possible interleavings of push and pop operations.

The brute force would use recursion/backtracking:

1. Start with empty stack and pointers at start of both arrays
2. At each step, you can either:
   - Push the next element from `pushed` (if any left)
   - Pop from stack (if matches next in `popped`)
3. Continue until both arrays are processed
4. If you reach the end of both arrays, return true

The problem? This explores an exponential number of possibilities. With n elements, there are Catalan number Cₙ possible valid stack permutations, which grows roughly as O(4ⁿ/√n). That's far too slow for typical constraints (n up to 1000).

Even if we prune branches where the stack top doesn't match the next pop, we're still exploring many possibilities unnecessarily. We need a more direct simulation.

## Optimized Approach

The key insight is that we don't need to explore all possibilities — we can simulate deterministically. Here's the optimal strategy:

1. **Use a real stack** to simulate the process
2. **Iterate through the push array** in order (since pushes must happen in the given order)
3. **After each push**, check if we can pop elements from the stack
4. **Keep popping** while the stack top matches the next element in the popped sequence
5. **At the end**, if the stack is empty, all pops were valid

Why does this work? Because pushes must happen in the order given, we have no choice about when to push each element — we must push them in sequence. The only choice is when to pop. So we push elements in order, and whenever the stack top matches what needs to be popped next, we pop it immediately (or later, but popping immediately never hurts since the element is available).

Think of it this way: We're trying to match the popped sequence. When we push an element, it goes on the stack. It can only be popped when it reaches the top. So if the next pop we need is at the top, we should pop it now. If we don't pop it now and push more elements on top, we'll have to pop those first anyway, so we might as well pop now if possible.

## Optimal Solution

Here's the step-by-step implementation:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def validateStackSequences(pushed, popped):
    """
    Determines if the given pop sequence is valid for the given push sequence.

    Args:
        pushed: List of integers pushed in order
        popped: List of integers representing desired pop order

    Returns:
        True if the pop sequence is achievable, False otherwise
    """
    stack = []  # Our simulation stack
    pop_index = 0  # Pointer to track position in popped array

    # Process each element in the push order
    for value in pushed:
        # Push the current value onto the stack (we must push in given order)
        stack.append(value)

        # After pushing, check if we can pop any elements
        # While stack is not empty AND top matches next needed pop
        while stack and stack[-1] == popped[pop_index]:
            # Pop from stack and move to next needed pop
            stack.pop()
            pop_index += 1

    # If we successfully popped all elements, stack should be empty
    # Alternatively, we could check if pop_index == len(popped)
    return len(stack) == 0
```

```javascript
// Time: O(n) | Space: O(n)
function validateStackSequences(pushed, popped) {
  /**
   * Determines if the given pop sequence is valid for the given push sequence.
   *
   * @param {number[]} pushed - Array of integers pushed in order
   * @param {number[]} popped - Array of integers representing desired pop order
   * @return {boolean} - True if the pop sequence is achievable, False otherwise
   */
  const stack = []; // Our simulation stack
  let popIndex = 0; // Pointer to track position in popped array

  // Process each element in the push order
  for (const value of pushed) {
    // Push the current value onto the stack (we must push in given order)
    stack.push(value);

    // After pushing, check if we can pop any elements
    // While stack is not empty AND top matches next needed pop
    while (stack.length > 0 && stack[stack.length - 1] === popped[popIndex]) {
      // Pop from stack and move to next needed pop
      stack.pop();
      popIndex++;
    }
  }

  // If we successfully popped all elements, stack should be empty
  // Alternatively, we could check if popIndex === popped.length
  return stack.length === 0;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.Stack;

class Solution {
    public boolean validateStackSequences(int[] pushed, int[] popped) {
        /**
         * Determines if the given pop sequence is valid for the given push sequence.
         *
         * @param pushed - Array of integers pushed in order
         * @param popped - Array of integers representing desired pop order
         * @return True if the pop sequence is achievable, False otherwise
         */
        Stack<Integer> stack = new Stack<>();  // Our simulation stack
        int popIndex = 0;  // Pointer to track position in popped array

        // Process each element in the push order
        for (int value : pushed) {
            // Push the current value onto the stack (we must push in given order)
            stack.push(value);

            // After pushing, check if we can pop any elements
            // While stack is not empty AND top matches next needed pop
            while (!stack.isEmpty() && stack.peek() == popped[popIndex]) {
                // Pop from stack and move to next needed pop
                stack.pop();
                popIndex++;
            }
        }

        // If we successfully popped all elements, stack should be empty
        // Alternatively, we could check if popIndex == popped.length
        return stack.isEmpty();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the length of the arrays. Each element is pushed exactly once and popped at most once. Even though we have a nested while loop, notice that each element enters the stack once and leaves at most once, so the total number of operations is linear.

**Space Complexity: O(n)** for the stack in the worst case. In the best case (when popped sequence is exactly reverse of pushed), we pop immediately after each push, so stack never grows beyond 1 element. In the worst case (when popped sequence is same as pushed order), we push all elements before popping any, so stack grows to size n.

## Common Mistakes

1. **Not using a stack to simulate**: Some candidates try to solve this with just array pointers, thinking they can track indices without actually simulating the stack. This fails because the stack's LIFO nature is crucial — you can't pop an element until all elements pushed after it are popped first.

2. **Incorrect loop conditions**: A common error is using an `if` instead of `while` when checking for pops. Remember: after pushing, you might be able to pop multiple elements, not just one. For example, with `pushed = [1,2,3]` and `popped = [3,2,1]`, after pushing 3, you can pop 3, then 2, then 1 — that's three pops, not one.

3. **Forgetting to check stack emptiness**: Always check `!stack.isEmpty()` before accessing `stack.peek()` or `stack[-1]`. Otherwise, you'll get an error when the stack is empty.

4. **Assuming arrays are same length**: While the problem guarantees they're the same length, in a real interview you might want to add an early return if `len(pushed) != len(popped)` as a sanity check.

## When You'll See This Pattern

This stack simulation pattern appears in several other problems:

1. **Next Greater Element (LeetCode 496, 503)**: You use a stack to track elements while looking for the next greater element. Similar simulation where you process elements in order and maintain invariants on the stack.

2. **Daily Temperatures (LeetCode 739)**: Another monotonic stack problem where you track temperatures and find how many days until a warmer temperature.

3. **Asteroid Collision (LeetCode 735)**: Simulating collisions where asteroids move and collide based on their directions — uses a stack to track surviving asteroids.

4. **Remove K Digits (LeetCode 402)**: Uses a stack to build the smallest number by removing digits while maintaining order.

The common theme is using a stack to process elements in sequence while maintaining some property (monotonicity, validity, etc.) and making decisions based on the top element.

## Key Takeaways

1. **When you see sequences of operations with constraints on order**, think about simulation with the actual data structure. If the problem involves stack operations, simulate with a stack.

2. **The "push then check for pops" pattern** is efficient because it respects the constraint that pushes happen in fixed order. You only have choices about when to pop, not when to push.

3. **Nested while loops can still be O(n)** if each element is processed a constant number of times. Don't dismiss an algorithm just because it has nested loops — analyze the total operations.

[Practice this problem on CodeJeet](/problem/validate-stack-sequences)
