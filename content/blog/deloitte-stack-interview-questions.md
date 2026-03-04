---
title: "Stack Questions at Deloitte: What to Expect"
description: "Prepare for Stack interview questions at Deloitte — patterns, difficulty breakdown, and study tips."
date: "2030-04-04"
category: "dsa-patterns"
tags: ["deloitte", "stack", "interview prep"]
---

Stack questions appear in Deloitte's technical assessments for a specific reason: they test fundamental algorithmic thinking and clean implementation under constraints. While only 3 out of 38 total questions, these problems are often gatekeepers. They evaluate your ability to handle data that requires order preservation, reversal, or nested validation—skills directly applicable to parsing configurations, validating sequences in document processing, or managing execution flows in enterprise systems. Missing these can cost you the interview.

## What to Expect — types of problems

Deloitte’s stack problems typically fall into two categories. First, **classic algorithmic challenges** like validating parentheses, evaluating postfix expressions, or implementing a min-stack. These test your knowledge of the standard LIFO pattern. Second, **slightly adapted business-logic problems** where a stack simplifies the solution. Think matching tags in a markup-like string, tracking user actions for an "undo" feature, or checking for balanced symbols in a data log. The constraints are usually clear, and edge cases matter—empty inputs, single elements, and invalid sequences are common.

## How to Prepare — study tips with one code example

Focus on mastering the core patterns: reversal, validation with matching pairs, and maintaining auxiliary data (like a min-stack). Write clean, iterative solutions. Always handle edge cases first. Practice explaining your reasoning as you code.

A key pattern is **using a stack to validate matching pairs**, common in parentheses or tag validation. Here’s the standard approach:

<div class="code-group">

```python
def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:  # Closing bracket
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
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

Start with fundamentals: implement a stack from scratch, then solve parentheses validation and next greater element. Move to min-stack and postfix evaluation. Finally, tackle problems that disguise the stack usage, like stock span or removing adjacent duplicates. Time yourself. Deloitte’s assessment is timed, so efficiency in both thought and typing is critical.

[Practice Stack at Deloitte](/company/deloitte/stack)
