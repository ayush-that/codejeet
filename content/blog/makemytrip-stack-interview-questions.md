---
title: "Stack Questions at MakeMyTrip: What to Expect"
description: "Prepare for Stack interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-15"
category: "dsa-patterns"
tags: ["makemytrip", "stack", "interview prep"]
---

## Why Stack Matters at MakeMyTrip

MakeMyTrip's engineering challenges revolve heavily around processing hierarchical data—think nested itineraries, booking flows with multiple conditional steps, parsing complex search queries, and managing UI state transitions. The stack data structure is the natural tool for tracking state, validating sequences, and handling nested structures. With 3 out of 24 tagged questions being stack-based, it represents about 12.5% of their technical question bank. In practice, this means you have roughly a 1 in 4 chance of encountering a stack problem in any given interview round. It's not their absolute primary focus (like arrays or strings), but it's a consistent secondary theme that tests your ability to manage state and handle edge cases in sequential processing.

## Specific Patterns MakeMyTrip Favors

MakeMyTrip's stack problems tend to cluster around two specific patterns: **parentheses/sequence validation** and **monotonic stack applications for next-greater-element problems**. They rarely ask about generic stack implementations or trivial push/pop exercises. Instead, they test whether you recognize that a stack is the optimal structure for tracking "incomplete" operations or nested contexts.

The parentheses pattern appears in validating correct bracket sequences in itinerary codes or search query syntax. The monotonic stack pattern surfaces in problems like finding the next warmer day (relevant for dynamic pricing algorithms) or calculating spans in time-series data. You'll notice they avoid esoteric stack variations and stick to practical applications their engineers might actually encounter.

Specific LeetCode problems that mirror their style include:

- **Valid Parentheses (#20)** – Classic sequence validation
- **Daily Temperatures (#739)** – Classic monotonic stack for next greater element
- **Asteroid Collision (#735)** – State management with collisions (similar to booking conflicts)
- **Minimum Remove to Make Valid Parentheses (#1249)** – More advanced validation with modifications

## How to Prepare

Master the two core patterns with clean implementations. For sequence validation, the key insight is that every closing element must match the most recent unmatched opening element. For monotonic stack problems, maintain a stack of indices where values are in decreasing order—when you find a larger value, it resolves multiple pending elements.

Here's the monotonic stack pattern for Daily Temperatures (#739):

<div class="code-group">

```python
def dailyTemperatures(temperatures):
    """
    Time: O(n) – Each index is pushed and popped at most once
    Space: O(n) – Stack in worst case stores all indices
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # Stores indices of temperatures awaiting warmer day

    for i in range(n):
        # While current temp is warmer than stack's top
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx  # Days until warmer

        stack.append(i)

    return result
```

```javascript
function dailyTemperatures(temperatures) {
  // Time: O(n) | Space: O(n)
  const n = temperatures.length;
  const result = new Array(n).fill(0);
  const stack = []; // Stores indices of temperatures awaiting warmer day

  for (let i = 0; i < n; i++) {
    // While current temp is warmer than stack's top
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIdx = stack.pop();
      result[prevIdx] = i - prevIdx; // Days until warmer
    }
    stack.push(i);
  }

  return result;
}
```

```java
public int[] dailyTemperatures(int[] temperatures) {
    // Time: O(n) | Space: O(n)
    int n = temperatures.length;
    int[] result = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // Stores indices

    for (int i = 0; i < n; i++) {
        // While current temp is warmer than stack's top
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int prevIdx = stack.pop();
            result[prevIdx] = i - prevIdx; // Days until warmer
        }
        stack.push(i);
    }

    return result;
}
```

</div>

For sequence validation, here's the core pattern for Valid Parentheses (#20):

<div class="code-group">

```python
def isValid(s):
    """
    Time: O(n) – Single pass through string
    Space: O(n) – Stack in worst case stores all opening brackets
    """
    mapping = {')': '(', '}': '{', ']': '['}
    stack = []

    for char in s:
        if char in mapping.values():  # Opening bracket
            stack.append(char)
        elif char in mapping:  # Closing bracket
            if not stack or stack.pop() != mapping[char]:
                return False

    return not stack  # All brackets must be matched
```

```javascript
function isValid(s) {
  // Time: O(n) | Space: O(n)
  const mapping = { ")": "(", "}": "{", "]": "[" };
  const stack = [];

  for (const char of s) {
    if (Object.values(mapping).includes(char)) {
      // Opening bracket
      stack.push(char);
    } else if (char in mapping) {
      // Closing bracket
      if (!stack.length || stack.pop() !== mapping[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}
```

```java
public boolean isValid(String s) {
    // Time: O(n) | Space: O(n)
    Map<Character, Character> mapping = Map.of(')', '(', '}', '{', ']', '[');
    Deque<Character> stack = new ArrayDeque<>();

    for (char c : s.toCharArray()) {
        if (mapping.containsValue(c)) { // Opening bracket
            stack.push(c);
        } else if (mapping.containsKey(c)) { // Closing bracket
            if (stack.isEmpty() || stack.pop() != mapping.get(c)) {
                return false;
            }
        }
    }

    return stack.isEmpty();
}
```

</div>

## How MakeMyTrip Tests Stack vs Other Companies

MakeMyTrip's stack questions differ from other companies in three key ways:

1. **Practical framing**: Unlike FAANG companies that might ask abstract stack problems, MakeMyTrip often wraps stack concepts in travel-domain scenarios—validating itinerary formats, processing booking sequences, or analyzing price trends.

2. **Moderate difficulty**: Their problems typically range from LeetCode Medium to Medium-Hard, avoiding both trivial exercises and overly complex theoretical variations. Expect problems similar to Daily Temperatures (#739) rather than exotic stack applications.

3. **Emphasis on clean state management**: They care about how you handle edge cases in sequential processing. A solution that works for the main case but fails on edge sequences will be penalized more heavily here than at companies that prioritize raw algorithmic efficiency.

Compared to Google (which might combine stacks with other structures) or Amazon (which favors production-like scenarios), MakeMyTrip stays closer to core computer science fundamentals applied to their domain.

## Study Order

1. **Basic stack operations** – Understand LIFO behavior and when it's appropriate
2. **Sequence validation patterns** – Parentheses matching and variations
3. **Monotonic stack fundamentals** – Next greater/smaller element problems
4. **Stack with state tracking** – Problems like Asteroid Collision (#735) where elements interact
5. **Hybrid approaches** – Stacks combined with other structures (less common at MakeMyTrip)

This order works because sequence validation establishes the core "matching" intuition, monotonic stack builds on this with ordering constraints, and state tracking problems combine both concepts. Starting with hybrid approaches would be overwhelming without these foundations.

## Recommended Practice Order

1. Valid Parentheses (#20) – Master the basic pattern
2. Minimum Add to Make Parentheses Valid (#921) – Variation on validation
3. Next Greater Element I (#496) – Introduction to monotonic stack
4. Daily Temperatures (#739) – Core monotonic stack application
5. Asteroid Collision (#735) – State management with interactions
6. Minimum Remove to Make Valid Parentheses (#1249) – Advanced validation with modifications
7. Online Stock Span (#901) – Monotonic stack with cumulative calculations

Solve these in sequence, and you'll cover 90% of stack patterns MakeMyTrip uses. Focus on writing clean, edge-case-handling code rather than optimizing for micro-efficiencies.

[Practice Stack at MakeMyTrip](/company/makemytrip/stack)
