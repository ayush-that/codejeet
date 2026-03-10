---
title: "Stack Questions at Flipkart: What to Expect"
description: "Prepare for Stack interview questions at Flipkart — patterns, difficulty breakdown, and study tips."
date: "2028-04-30"
category: "dsa-patterns"
tags: ["flipkart", "stack", "interview prep"]
---

## Stack Questions at Flipkart: What to Expect

Flipkart’s technical interview process is known for its emphasis on data structures that model real‑world hierarchical and sequential relationships. With **19 out of 117** tagged problems involving stacks, this topic is not just a random pick—it’s a deliberate focus. Why? Because stacks naturally handle problems involving nested structures, reversals, and state‑based processing—patterns that appear everywhere in e‑commerce systems, from parsing product categories and tracking user navigation sessions to managing undo/redo operations in their internal tools. In real interviews, you can expect at least one stack‑based problem in the coding rounds, often as the first or second question to gauge your ability to translate a real‑world constraint into a clean, efficient solution.

## Specific Patterns Flipkart Favors

Flipkart’s stack problems tend to cluster around three core patterns, each reflecting a different aspect of their engineering challenges:

1.  **Parentheses & Nested Structure Validation** – This is the most frequent pattern. It’s not just about checking balanced parentheses; it’s about validating any nested, hierarchical data. Think of parsing product specifications, user‑entered filters, or even XML/JSON‑like configuration strings. The classic problem here is **Valid Parentheses (#20)**, but Flipkart often extends it to scenarios requiring you to also return the depth or reconstruct the valid structure.
2.  **Monotonic Stack for Next Greater/Smaller Element** – This pattern is crucial for problems involving finding the next element meeting a certain condition in a sequence, such as finding the next product with a higher rating or the next day with a lower price in a time series. **Daily Temperatures (#739)** is the archetypal example. Flipkart likes to combine this with array manipulation, asking you to not just find the next greater element but perhaps the span or distance to it.
3.  **Stack as a State Machine for String/Path Processing** – Here, the stack tracks the current context or state. This appears in problems like **Simplify Path (#71)**, where you’re collapsing a filesystem path, or **Decode String (#394)**, where you’re parsing and expanding encoded patterns. This directly mirrors operations like processing browser history stacks or simplifying complex product URL paths.

You’ll notice a distinct _lack_ of purely academic stack‑based graph traversal (like iterative DFS) in their question set. Their problems are almost always applied, requiring you to model a tangible process.

## How to Prepare

The key is to internalize the stack’s LIFO (Last‑In, First‑Out) property and recognize when a problem’s logic requires you to “remember” the most recent relevant item or a nested context. Let’s look at the monotonic stack pattern, which is often the trickiest to spot.

The core idea: maintain a stack where elements are kept in a specific order (increasing or decreasing). As you iterate through an array, you pop from the stack when the current element satisfies the condition you’re checking against (e.g., is greater than the stack’s top). This allows you to resolve the “next greater element” for all popped items in O(n) time.

<div class="code-group">

```python
def dailyTemperatures(temperatures):
    """
    Given a list of daily temperatures, returns a list of how many days you have to wait
    until a warmer temperature. If no warmer day, answer is 0.
    Time: O(n) - Each index is pushed and popped at most once.
    Space: O(n) - For the stack in the worst case.
    """
    n = len(temperatures)
    answer = [0] * n
    stack = []  # Monotonic decreasing stack (stores indices)

    for i, temp in enumerate(temperatures):
        # While current temp is greater than the temp at the index on top of stack
        while stack and temperatures[stack[-1]] < temp:
            prev_index = stack.pop()
            answer[prev_index] = i - prev_index  # Days to wait
        stack.append(i)
    return answer
```

```javascript
function dailyTemperatures(temperatures) {
  /**
   * Given an array of daily temperatures, returns an array of how many days you have to wait
   * until a warmer temperature. If no warmer day, answer is 0.
   * Time: O(n) - Each index is pushed and popped at most once.
   * Space: O(n) - For the stack in the worst case.
   */
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // Monotonic decreasing stack (stores indices)

  for (let i = 0; i < n; i++) {
    const currentTemp = temperatures[i];
    // While current temp is greater than the temp at the index on top of stack
    while (stack.length > 0 && temperatures[stack[stack.length - 1]] < currentTemp) {
      const prevIndex = stack.pop();
      answer[prevIndex] = i - prevIndex; // Days to wait
    }
    stack.push(i);
  }
  return answer;
}
```

```java
public int[] dailyTemperatures(int[] temperatures) {
    /**
     * Given an array of daily temperatures, returns an array of how many days you have to wait
     * until a warmer temperature. If no warmer day, answer is 0.
     * Time: O(n) - Each index is pushed and popped at most once.
     * Space: O(n) - For the stack in the worst case.
     */
    int n = temperatures.length;
    int[] answer = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // Monotonic decreasing stack (stores indices)

    for (int i = 0; i < n; i++) {
        int currentTemp = temperatures[i];
        // While current temp is greater than the temp at the index on top of stack
        while (!stack.isEmpty() && temperatures[stack.peek()] < currentTemp) {
            int prevIndex = stack.pop();
            answer[prevIndex] = i - prevIndex; // Days to wait
        }
        stack.push(i);
    }
    return answer;
}
```

</div>

For nested structure validation, the pattern is simpler but must be flawless. Always check for an empty stack at the end—an unmatched opening is a common bug.

## How Flipkart Tests Stack vs Other Companies

Compared to other major tech companies, Flipkart’s stack questions have a distinctive flavor:

- **vs. FAANG (Meta, Google)**: FAANG interviews often use stacks as a component in more complex problems (e.g., in a tree iterator or graph algorithm). Flipkart’s problems are more self‑contained and directly applied. They test if you can identify the stack as the _primary_ data structure.
- **vs. Startups/Unicorns**: Startups might ask more abstract or cutting‑edge problems. Flipkart’s questions feel “grounded”—they often describe a scenario a software engineer on their platform team might actually face, like cleaning a file path or validating a configuration.
- **Difficulty Level**: They are typically in the **Medium** range on LeetCode. You won’t see many “Hard” stack‑only problems. The challenge lies in clean implementation and handling edge cases (empty input, single element, already sorted/descending order for monotonic stacks) rather than complex algorithm design.

The unique aspect is the **emphasis on correctness and clarity over micro‑optimizations**. They want to see you reason about the state the stack represents and produce robust, readable code.

## Study Order

Tackle stack topics in this order to build a solid foundation:

1.  **Fundamental Operations & Syntax**: Get comfortable with `push/pop` and `peek/top` in your language of choice. Implement a stack using a list/array and a linked list. This ensures you understand the underlying mechanics.
2.  **Classic Validation Problems**: Start with **Valid Parentheses (#20)**. This teaches you the core “matching” loop and the importance of checking the stack state at the end. Then move to **Minimum Remove to Make Valid Parentheses (#1249)**, which adds a layer of decision‑making.
3.  **Stack as a State Tracker**: Solve **Simplify Path (#71)** and **Decode String (#394)**. These problems train you to use the stack to hold a “current context” (like a directory or a multiplier), which is a powerful mental model.
4.  **Monotonic Stack Patterns**: Begin with the template problem **Next Greater Element I (#496)** to understand the basic pattern. Then progress to **Daily Temperatures (#739)** and **Online Stock Span (#901)**. These solidify the “find next/previous greater/smaller” logic.
5.  **Hybrid Problems**: Finally, tackle problems where the stack is one of two key pieces, like **Evaluate Reverse Polish Notation (#150)** (stack + operators) or **Asteroid Collision (#735)** (stack + simulation). This prepares you for any slight twists Flipkart might add.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the pattern recognition of the previous one:

1.  **Valid Parentheses (#20)** – The absolute baseline.
2.  **Simplify Path (#71)** – Introduces path/state tracking.
3.  **Decode String (#394)** – A step‑up in state management.
4.  **Next Greater Element I (#496)** – Gentle intro to monotonic stacks.
5.  **Daily Temperatures (#739)** – The canonical monotonic stack problem.
6.  **Asteroid Collision (#735)** – Excellent for simulating a process with a stack.
7.  **Minimum Remove to Make Valid Parentheses (#1249)** – A great Flipkart‑style twist on the classic.

Mastering these patterns means you won’t be surprised when a Flipkart interviewer presents a problem about tracking user actions, parsing a query, or finding the next relevant item in a feed. You’ll see the stack behind the scenario.

[Practice Stack at Flipkart](/company/flipkart/stack)
