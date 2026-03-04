---
title: "Stack Questions at MakeMyTrip: What to Expect"
description: "Prepare for Stack interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-23"
category: "dsa-patterns"
tags: ["makemytrip", "stack", "interview prep"]
---

Stack questions appear in roughly 12.5% of MakeMyTrip's technical interviews (3 out of 24 common problems). For a company managing flight bookings, hotel reservations, and complex itineraries, the stack's ability to handle nested operations, undo/redo states, and parsing sequences is directly relevant to real-world systems like back-navigation in a multi-step booking flow or validating layered discount codes.

## What to Expect — Types of Problems

MakeMyTrip's stack problems typically focus on practical applications rather than abstract theory. You can expect two main categories:

1.  **Sequence Validation & Parsing:** This includes classic problems like checking for balanced parentheses, tags, or brackets. This pattern is fundamental to validating structured data, such as ensuring the correct nesting of user-selected travel options (e.g., `(flight + (hotel + transfer))`).
2.  **Next Greater Element & Monotonic Stack Patterns:** These problems involve finding the next larger or smaller element in an array. At scale, this algorithmic pattern is efficient for problems like finding the next available date with a lower fare in a time-series or managing price visibility in a sorted list.

You are unlikely to see highly complex stack variations; the focus is on clean implementation and recognizing the appropriate data structure.

## How to Prepare — Study Tips with One Code Example

Master the core pattern: use a stack to track unmatched or pending elements while iterating through a sequence. The key is to push items onto the stack when you need to remember them for a future comparison, and pop them when a matching condition is met.

A fundamental example is validating a string containing just the characters `(`, `)`, `{`, `}`, `[`, and `]`. The rule is that every opening bracket must have a corresponding closing bracket of the same type and in the correct nested order.

<div class="code-group">

```python
def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in mapping:  # It's a closing bracket
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:  # It's an opening bracket
            stack.append(char)
    return not stack  # Valid if stack is empty
```

```javascript
function isValid(s) {
  const stack = [];
  const mapping = { ")": "(", "}": "{", "]": "[" };

  for (let char of s) {
    if (mapping[char]) {
      // It's a closing bracket
      const topElement = stack.length ? stack.pop() : "#";
      if (mapping[char] !== topElement) {
        return false;
      }
    } else {
      // It's an opening bracket
      stack.push(char);
    }
  }
  return stack.length === 0;
}
```

```java
public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> mapping = new HashMap<>();
    mapping.put(')', '(');
    mapping.put('}', '{');
    mapping.put(']', '[');

    for (char c : s.toCharArray()) {
        if (mapping.containsKey(c)) { // Closing bracket
            char topElement = stack.isEmpty() ? '#' : stack.pop();
            if (topElement != mapping.get(c)) {
                return false;
            }
        } else { // Opening bracket
            stack.push(c);
        }
    }
    return stack.isEmpty();
}
```

</div>

## Recommended Practice Order

Build competency in this sequence:

1.  **Master the Fundamentals:** `Valid Parentheses` (as above) and `Next Greater Element I`.
2.  **Handle Variations:** Practice `Minimum Add to Make Parentheses Valid` and `Asteroid Collision`.
3.  **Apply to Strings:** Solve `Decode String` and `Remove All Adjacent Duplicates In String`.
4.  **Simulate Real Processes:** Finally, tackle `Online Stock Span` to understand how stack can track state over a sequence, analogous to tracking price changes over a booking timeline.

This progression solidifies the pattern before applying it to more scenario-based problems.

[Practice Stack at MakeMyTrip](/company/makemytrip/stack)
