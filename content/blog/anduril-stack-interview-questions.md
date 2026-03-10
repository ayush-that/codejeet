---
title: "Stack Questions at Anduril: What to Expect"
description: "Prepare for Stack interview questions at Anduril — patterns, difficulty breakdown, and study tips."
date: "2029-12-17"
category: "dsa-patterns"
tags: ["anduril", "stack", "interview prep"]
---

If you're preparing for an engineering interview at Anduril, you've likely seen the data: out of 43 total tagged problems, 5 are categorized under Stack. That's over 11% of their technical question pool. This isn't a coincidence or a secondary topic—it's a deliberate focus. Anduril builds complex, real-time systems for defense and security, from autonomous drones to sensor towers. These systems require software that processes continuous streams of data (sensor inputs, telemetry, network packets) and makes decisions based on the most recent, valid, or nested context. The stack data structure is the perfect abstraction for this: it's the engine behind parsing protocols, validating sequences, managing state machines, and undoing operations. At Anduril, a stack question isn't just an algorithmic trivia test; it's a direct probe into how you think about handling ordered, stateful data flows—a daily reality for their engineers.

## Specific Patterns Anduril Favors

Anduril's stack problems tend to avoid esoteric mathematical twists. Instead, they cluster around a few practical, system-relevant patterns. The most frequent is **Parentheses/Sequence Validation and Parsing**. This is foundational for ensuring data integrity in communications and configuration. You'll also see **Monotonic Stack** problems, which are crucial for finding the next greater element or maintaining temperature profiles in time-series data (think sensor readings). Finally, **Stack with State Tracking** appears, where the stack doesn't just store values but complex states, often used in simulating execution or backtracking.

For example, a classic like **Valid Parentheses (#20)** is almost a warm-up. But Anduril is more likely to extend this concept to problems like **Minimum Remove to Make Valid Parentheses (#1249)**, where you must both validate and correct a sequence—mirroring the real-world task of sanitizing malformed but salvageable data. Another telling example is **Asteroid Collision (#735)**, which perfectly models resolving conflicts in a stream of incoming objects (positive and negative masses moving in a line), a neat analogy for processing sensor pings or track updates.

## How to Prepare

The key is to master the core stack operations (push, pop, peek) and then learn to recognize the triggering condition: **when you need to compare the current element with the most recently seen element that hasn't been resolved**. For sequence validation, you push opening symbols and pop when you find a correct closing match. For monotonic stack, you maintain a stack of indices where values are in decreasing order, popping when you find a larger value to compute the "next greater element."

Let's look at the monotonic stack pattern for **Daily Temperatures (#739)**, which asks for the number of days until a warmer temperature. This pattern is incredibly versatile.

<div class="code-group">

```python
def dailyTemperatures(temperatures):
    """
    Time: O(n) - Each index is pushed and popped at most once.
    Space: O(n) - For the stack and the result array.
    """
    n = len(temperatures)
    answer = [0] * n
    stack = []  # Stores indices of temperatures awaiting a warmer day

    for i, temp in enumerate(temperatures):
        # While current temp is warmer than the temp at the index on top of stack
        while stack and temperatures[stack[-1]] < temp:
            prev_index = stack.pop()
            answer[prev_index] = i - prev_index  # Days to wait
        stack.append(i)
    return answer
```

```javascript
function dailyTemperatures(temperatures) {
  // Time: O(n) | Space: O(n)
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // Stores indices

  for (let i = 0; i < n; i++) {
    const currentTemp = temperatures[i];
    // Resolve all colder days in the stack
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
    Deque<Integer> stack = new ArrayDeque<>(); // Better than Stack class

    for (int i = 0; i < n; i++) {
        int currentTemp = temperatures[i];
        // Pop and resolve all indices with lower temperatures
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

For sequence correction problems like **Minimum Remove to Make Valid Parentheses**, the pattern involves using a stack to track problematic indices and then building a corrected string.

<div class="code-group">

```python
def minRemoveToMakeValid(s):
    """
    Time: O(n) - Two passes through the string.
    Space: O(n) - For the stack and the set of indices to remove.
    """
    stack = []
    indices_to_remove = set()

    # First pass: identify mismatched parentheses
    for i, char in enumerate(s):
        if char == '(':
            stack.append(i)
        elif char == ')':
            if stack:
                stack.pop()  # Valid pair found
            else:
                indices_to_remove.add(i)  # Unmatched closing ')'

    # Any remaining '(' in the stack are unmatched
    indices_to_remove.update(stack)

    # Second pass: build the valid string
    result_chars = [char for i, char in enumerate(s) if i not in indices_to_remove]
    return ''.join(result_chars)
```

```javascript
function minRemoveToMakeValid(s) {
  // Time: O(n) | Space: O(n)
  const stack = [];
  const indicesToRemove = new Set();

  const chars = s.split("");
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === "(") {
      stack.push(i);
    } else if (chars[i] === ")") {
      if (stack.length > 0) {
        stack.pop();
      } else {
        indicesToRemove.add(i);
      }
    }
  }
  // Add all unmatched opening '(' indices
  stack.forEach((idx) => indicesToRemove.add(idx));

  // Build the result
  const result = [];
  for (let i = 0; i < chars.length; i++) {
    if (!indicesToRemove.has(i)) {
      result.push(chars[i]);
    }
  }
  return result.join("");
}
```

```java
public String minRemoveToMakeValid(String s) {
    // Time: O(n) | Space: O(n)
    Deque<Integer> stack = new ArrayDeque<>();
    Set<Integer> indicesToRemove = new HashSet<>();
    char[] chars = s.toCharArray();

    for (int i = 0; i < chars.length; i++) {
        if (chars[i] == '(') {
            stack.push(i);
        } else if (chars[i] == ')') {
            if (!stack.isEmpty()) {
                stack.pop();
            } else {
                indicesToRemove.add(i);
            }
        }
    }
    // Add all unmatched opening indices
    while (!stack.isEmpty()) indicesToRemove.add(stack.pop());

    StringBuilder result = new StringBuilder();
    for (int i = 0; i < chars.length; i++) {
        if (!indicesToRemove.contains(i)) {
            result.append(chars[i]);
        }
    }
    return result.toString();
}
```

</div>

## How Anduril Tests Stack vs Other Companies

At large, generalist tech companies (FAANG), stack problems can sometimes feel like abstract puzzles—clever but detached. At Anduril, they feel more _applied_. The difficulty is similar (medium LeetCode level), but the context often hints at a systems application. You might get a problem about parsing a log file with nested events (**Exclusive Time of Functions #636**) or evaluating a network configuration expression (**Basic Calculator II #227**). The expectation isn't just to solve it, but to discuss how the algorithm handles edge cases in a real-time stream, its memory footprint, and what happens if the data is interrupted. They test for _robustness_ alongside correctness.

## Study Order

1.  **Fundamental LIFO Operations:** Truly internalize that a stack reverses order. Solve simple problems like implementing a queue using stacks (#232). This builds intuition.
2.  **Sequence Validation:** Start with Valid Parentheses (#20). This is the core pattern. Then move to problems that require minor modifications, like checking multiple bracket types or adding other characters.
3.  **Stack for State/History:** Tackle problems where the stack holds more than just a single character—like simulating a browser history (#1472) or a filesystem (#388). This teaches you to use the stack as a memory of previous states.
4.  **Monotonic Stack:** Learn this powerful pattern. Start with Next Greater Element I (#496) to understand the concept, then progress to Daily Temperatures (#739) and Trapping Rain Water (#42). This is a high-value pattern for Anduril.
5.  **Combination Patterns:** Finally, practice problems where stack is one part of a larger solution, often combined with a hash map (for O(1) lookups of complementary elements) or used in a tree traversal (iterative DFS). This shows mastery.

## Recommended Practice Order

Solve these problems in sequence to build competence methodically:

1.  **Valid Parentheses (#20)** - The absolute baseline.
2.  **Min Stack (#155)** - Teaches you to augment stack data.
3.  **Evaluate Reverse Polish Notation (#150)** - Stack for expression evaluation.
4.  **Asteroid Collision (#735)** - Classic Anduril-style "resolve conflicts in a stream."
5.  **Daily Temperatures (#739)** - Master the monotonic stack pattern.
6.  **Minimum Remove to Make Valid Parentheses (#1249)** - Sequence validation + correction.
7.  **Exclusive Time of Functions (#636)** - A more complex, nested state-tracking problem that mirrors logging or profiling.

This progression moves from pure mechanics to applied patterns, ending with a problem that closely mimics the complexity of tracking nested operations in a real-time system. When you practice, always verbalize _why_ you're using a stack for each problem. At Anduril, being able to articulate that the stack naturally handles the "last-in, first-out" dependency of the data will score you more points than silently writing perfect code.

[Practice Stack at Anduril](/company/anduril/stack)
