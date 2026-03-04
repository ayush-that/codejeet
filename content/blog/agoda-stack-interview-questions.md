---
title: "Stack Questions at Agoda: What to Expect"
description: "Prepare for Stack interview questions at Agoda — patterns, difficulty breakdown, and study tips."
date: "2029-09-30"
category: "dsa-patterns"
tags: ["agoda", "stack", "interview prep"]
---

Stack questions appear in about 17% of Agoda's technical interview problem set (8 out of 46 total questions). This frequency is significant because it tests a candidate's ability to manage data with Last-In-First-Out (LIFO) logic, which is fundamental for parsing, backtracking, and managing function calls—common tasks in building and maintaining a large-scale travel platform.

## What to Expect — Types of Problems

Agoda's stack problems typically focus on real-world scenarios rather than abstract algorithmic puzzles. You can expect variations on core patterns that involve tracking state or reversing processing order. Common themes include:

- **Expression Evaluation:** Parsing and computing values from strings, such as checking for balanced parentheses or evaluating arithmetic expressions (e.g., implementing a basic calculator). This directly relates to processing user inputs or configuration rules.
- **Next Greater Element:** Finding the next larger element in a sequence for each item. This pattern is useful for analyzing timelines, prices, or request queues, which are prevalent in travel booking systems.
- **Stack as a Tool in DFS:** Using an explicit stack to implement iterative Depth-First Search for tree or graph traversal, which is essential for navigating hierarchical data like site menus, location mappings, or dependency graphs.
- **Simulating Recursion:** Converting a recursive algorithm (like file system traversal) into an iterative one using a stack, which is crucial for avoiding overflow in deep, real-world datasets.

## How to Prepare — Study Tips with One Code Example

Master the core operations (push, pop, peek) and recognize when LIFO processing is the key. The most reliable signal is when a problem requires checking or matching elements in a reversed order, or when you need to temporarily hold data to process it later. Practice by first solving problems using your language's built-in `list`, `array`, or `Deque` as a stack, then focus on the underlying logic.

A fundamental pattern is **validating balanced parentheses**. You iterate through a string, pushing opening brackets onto the stack. When you encounter a closing bracket, you check if it matches the most recent opening bracket (the stack's top). A mismatch or a non-empty stack at the end means the string is invalid.

<div class="code-group">

```python
def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:  # Closing bracket
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:  # Opening bracket
            stack.append(char)
    return not stack
```

```javascript
function isValid(s) {
  const stack = [];
  const mapping = { ")": "(", "}": "{", "]": "[" };
  for (let char of s) {
    if (mapping[char]) {
      // Closing bracket
      const top = stack.length ? stack.pop() : "#";
      if (mapping[char] !== top) return false;
    } else {
      // Opening bracket
      stack.push(char);
    }
  }
  return stack.length === 0;
}
```

```java
public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> mapping = Map.of(')', '(', '}', '{', ']', '[');
    for (char c : s.toCharArray()) {
        if (mapping.containsKey(c)) { // Closing bracket
            char top = stack.isEmpty() ? '#' : stack.pop();
            if (mapping.get(c) != top) return false;
        } else { // Opening bracket
            stack.push(c);
        }
    }
    return stack.isEmpty();
}
```

</div>

## Recommended Practice Order

Build competency progressively. Start with the classic patterns before tackling Agoda's specific problems.

1.  **Foundations:** Valid Parentheses, Min Stack.
2.  **Core Patterns:** Next Greater Element, Evaluate Reverse Polish Notation, Daily Temperatures.
3.  **Combination Problems:** Largest Rectangle in Histogram (uses stack with arrays), Binary Tree Inorder Traversal (iterative).
4.  **Agoda-Focused Practice:** Finally, solve the stack problems tagged with Agoda on your practice platform to familiarize yourself with their question style and constraints.

[Practice Stack at Agoda](/company/agoda/stack)
