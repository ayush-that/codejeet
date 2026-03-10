---
title: "Stack Questions at Morgan Stanley: What to Expect"
description: "Prepare for Stack interview questions at Morgan Stanley — patterns, difficulty breakdown, and study tips."
date: "2029-07-16"
category: "dsa-patterns"
tags: ["morgan-stanley", "stack", "interview prep"]
---

When you're preparing for technical interviews at Morgan Stanley, you'll notice something interesting in their question breakdown: **Stack** problems make up a significant portion. With 7 out of 53 total questions, that's over 13% of their catalog. This isn't a random distribution. In financial technology, especially at a firm like Morgan Stanley that builds high-frequency trading systems, risk engines, and real-time data pipelines, the Stack's predictable, last-in-first-out (LIFO) behavior is crucial for operations like parsing financial instruments, managing order books, evaluating expressions, and handling undo/redo functionality in complex applications. While not as dominant as arrays or strings, Stack is a **core secondary topic** at Morgan Stanley. You are very likely to encounter at least one Stack-based problem in your interview loop, often in the first or second technical round. It's used as a reliable filter to assess a candidate's grasp on fundamental data structures and their ability to manage state iteratively.

## Specific Patterns Morgan Stanley Favors

Morgan Stanley's Stack problems tend to cluster around a few practical, non-esoteric patterns. You won't often see highly abstract or purely mathematical Stack puzzles here. Instead, they favor problems that mirror real-world system logic.

1.  **Parentheses/Expression Validation and Evaluation:** This is their bread and butter. It directly models parsing financial formulas, configuration files, or trade instructions. They love variations.
2.  **Monotonic Stack for Next-Greater-Element Problems:** This pattern is key for problems like finding the next greater temperature or span of stock prices—a direct link to financial data analysis.
3.  **Stack-Based Simulation (e.g., Asteroid Collision, Daily Temperatures):** These problems test your ability to model a process with collisions, eliminations, or waiting periods, which is analogous to matching orders or processing event streams.

You will rarely see a Stack used for pure tree/graph traversal (like DFS) as an isolated question; that's more likely wrapped into a larger problem. Their questions are **iterative and stateful**, not recursive. They want to see clean, efficient, single-pass solutions.

For example, **Valid Parentheses (#20)** is almost a guaranteed warm-up. A more advanced twist they use is **Basic Calculator II (#227)**, which combines stack for operation precedence with parsing. For monotonic stack, **Daily Temperatures (#739)** is a classic. **Asteroid Collision (#735)** is a perfect example of a stack-based simulation they adore.

## How to Prepare

The key is to internalize the stack's role: **it's a temporary holding area for elements while you wait for a future element in the sequence to resolve their relationship.** Let's look at the two most critical patterns.

**Pattern 1: Monotonic Stack for Next-Greater-Element**
Use a stack to maintain a decreasing sequence (for next greater) or increasing sequence (for next smaller). You process each element, popping from the stack while the current element resolves the "next greater" condition for the older, waiting elements.

<div class="code-group">

```python
def dailyTemperatures(temperatures):
    """
    Returns an array where answer[i] is the number of days you have to wait
    after day i to get a warmer temperature.
    Time: O(n) | Space: O(n)
    """
    n = len(temperatures)
    answer = [0] * n
    stack = []  # stores indices of days waiting for a warmer day

    for i, temp in enumerate(temperatures):
        # Current day `i` is warmer than the day at the top of the stack
        while stack and temperatures[stack[-1]] < temp:
            prev_index = stack.pop()
            answer[prev_index] = i - prev_index
        stack.append(i)
    return answer
```

```javascript
function dailyTemperatures(temperatures) {
  // Time: O(n) | Space: O(n)
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // stores indices

  for (let i = 0; i < n; i++) {
    const currentTemp = temperatures[i];
    while (stack.length > 0 && temperatures[stack[stack.length - 1]] < currentTemp) {
      const prevIndex = stack.pop();
      answer[prevIndex] = i - prevIndex;
    }
    stack.push(i);
  }
  return answer;
}
```

```java
public int[] dailyTemperatures(int[] temperatures) {
    // Time: O(n) | Space: O(n)
    int n = temperatures.length;
    int[] answer = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        int currentTemp = temperatures[i];
        while (!stack.isEmpty() && temperatures[stack.peek()] < currentTemp) {
            int prevIndex = stack.pop();
            answer[prevIndex] = i - prevIndex;
        }
        stack.push(i);
    }
    return answer;
}
```

</div>

**Pattern 2: Stack-Based Simulation (Asteroid Collision)**
This pattern uses the stack as the "stable universe." You iterate, and for each new element, you determine if it collides with the top of the stack. You then simulate the collision outcome, potentially destroying one or both, which may lead to further collisions deeper in the stack.

<div class="code-group">

```python
def asteroidCollision(asteroids):
    """
    Simulates collisions where positive asteroids move right, negative move left.
    Stack holds asteroids moving to the right that haven't been destroyed.
    Time: O(n) | Space: O(n)
    """
    stack = []
    for a in asteroids:
        # Only a scenario where a negative asteroid (moving left) meets
        # a positive asteroid (moving right) on the stack causes a collision.
        while stack and a < 0 < stack[-1]:
            if stack[-1] < -a:      # Incoming negative destroys top
                stack.pop()
                continue            # Keep checking next asteroid in stack
            elif stack[-1] == -a:   # Both destroy
                stack.pop()
            break                   # Incoming asteroid is destroyed
        else:
            # No collision condition met, add asteroid to stable universe
            stack.append(a)
    return stack
```

```javascript
function asteroidCollision(asteroids) {
  // Time: O(n) | Space: O(n)
  const stack = [];
  for (let a of asteroids) {
    let isDestroyed = false;
    // Collision condition: stack top positive, incoming negative
    while (stack.length > 0 && a < 0 && stack[stack.length - 1] > 0) {
      if (stack[stack.length - 1] < -a) {
        stack.pop(); // top is destroyed, continue loop
        continue;
      } else if (stack[stack.length - 1] === -a) {
        stack.pop(); // both destroyed
      }
      isDestroyed = true; // incoming asteroid is destroyed
      break;
    }
    if (!isDestroyed) {
      stack.push(a);
    }
  }
  return stack;
}
```

```java
public int[] asteroidCollision(int[] asteroids) {
    // Time: O(n) | Space: O(n)
    Deque<Integer> stack = new ArrayDeque<>();
    for (int a : asteroids) {
        boolean isDestroyed = false;
        while (!stack.isEmpty() && a < 0 && stack.peek() > 0) {
            if (stack.peek() < -a) {
                stack.pop();
                continue;
            } else if (stack.peek() == -a) {
                stack.pop();
            }
            isDestroyed = true;
            break;
        }
        if (!isDestroyed) {
            stack.push(a);
        }
    }
    // Convert stack to result array (reversed due to LIFO)
    int[] result = new int[stack.size()];
    for (int i = result.length - 1; i >= 0; i--) {
        result[i] = stack.pop();
    }
    return result;
}
```

</div>

## How Morgan Stanley Tests Stack vs Other Companies

At pure tech giants like Google or Meta, a Stack might be one component in a complex graph or system design problem (e.g., iterative DFS in a maze solver). The focus is on algorithmic cleverness. At Morgan Stanley, the Stack is the **star of the show**. Their questions are more self-contained and directly test your mastery of the structure itself. The difficulty is typically in the **medium** range on LeetCode. They care less about extreme optimization tricks and more about **bug-free, readable code that correctly models a business logic process**. You must articulate your thought process clearly, connecting the stack operations to the problem's real-world analogy (e.g., "The stack here holds pending buy orders waiting for a matching sell").

## Study Order

Follow this progression to build a solid foundation without getting overwhelmed:

1.  **Fundamental Operations & Syntax:** Be able to implement a stack using an array/list and know the push/pop/peek/isEmpty operations in your chosen language cold. This is non-negotiable.
2.  **Classic Validation Problems:** Start with Valid Parentheses (#20). This teaches you the core "matching" paradigm. Then, move to Min Stack (#155) to understand how to augment a stack with extra data.
3.  **Monotonic Stack Patterns:** Learn the next-greater-element template with Daily Temperatures (#739) and Next Greater Element I (#496). This pattern is highly reusable.
4.  **Expression Evaluation:** Tackle Basic Calculator II (#227). This combines stack with parsing and operator precedence, a common theme.
5.  **Stack-Based Simulations:** Practice Asteroid Collision (#735) and Simplify Path (#71). These test your ability to manage state changes and collisions within the stack's LIFO context.
6.  **Advanced Hybrids:** Finally, try problems where stack is a key component among others, like Decode String (#394) or Largest Rectangle in Histogram (#84). If you get this far, you're in great shape.

## Recommended Practice Order

Solve these Morgan Stanley-relevant problems in this sequence:

1.  **Valid Parentheses (#20)** - The absolute baseline.
2.  **Min Stack (#155)** - Understand stack augmentation.
3.  **Next Greater Element I (#496)** - Introduction to monotonic stack.
4.  **Daily Temperatures (#739)** - Master monotonic stack.
5.  **Asteroid Collision (#735)** - Master stack-based simulation.
6.  **Basic Calculator II (#227)** - Apply stack to evaluation.
7.  **Decode String (#394)** - A more complex parsing/state problem.
8.  **(Optional Challenge) Largest Rectangle in Histogram (#84)** - A hard problem that uses monotonic stack elegantly; good to know but less frequently asked.

Remember, at Morgan Stanley, clarity and correctness trump cleverness. For every Stack problem, verbally validate your edge cases: empty stack, sequences with no matches, and negative/positive number interactions. If you can do that while writing clean code for the patterns above, you'll handle their Stack questions with confidence.

[Practice Stack at Morgan Stanley](/company/morgan-stanley/stack)
