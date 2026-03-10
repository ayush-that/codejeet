---
title: "Stack Questions at Expedia: What to Expect"
description: "Prepare for Stack interview questions at Expedia — patterns, difficulty breakdown, and study tips."
date: "2029-06-12"
category: "dsa-patterns"
tags: ["expedia", "stack", "interview prep"]
---

Stack questions at Expedia might seem like a niche topic at first glance—just 5 out of 54 tagged problems on their company-specific LeetCode list. But that number is deceptive. In the real interview room, Stack is a high-leverage topic. It's not a sprawling category like Dynamic Programming, but it's a sharp, focused tool that interviewers love to test because it reveals how cleanly you can model real-world computational logic. At a company built on travel itineraries, booking sequences, and nested service calls, the Stack's "last-in, first-out" principle is more than an abstract data structure; it's a direct analog for parsing user sessions, validating configuration formats, or undoing operations. You won't get a Stack question in every round, but when you do, it's often a make-or-break moment to demonstrate elegant, bug-free code.

## Specific Patterns Expedia Favors

Expedia's Stack problems tend to cluster around two practical, non-trivial patterns: **Parentheses/Expression Validation** and **Monotonic Stack** applications. You won't see many trivial "implement a stack" questions. Instead, they ask you to use the stack as a mechanism to enforce rules or compute relationships.

1.  **Validation & Parsing:** This is their bread and butter. Think problems like **Valid Parentheses (#20)**, but often extended. A classic Expedia twist is to validate more complex nested structures, like checking the validity of HTML/XML tags or a sequence of API calls and returns. This tests your ability to map real-world state (an open travel booking, an incomplete multi-city search) to a stack's push/pop operations.
2.  **Monotonic Stack for Next-Greater-Element:** This pattern is a silent favorite. Problems like **Daily Temperatures (#739)** or **Next Greater Element I (#496)** aren't just about finding a number; they're about efficiently finding the _next_ item in a sequence that satisfies a condition—a common need in pricing lookahead or inventory scanning algorithms. The monotonic (decreasing) stack pattern is a must-know.

They generally avoid overly academic Stack-and-Queue hybrids or complex recursive stack simulations. The focus is on applied logic.

## How to Prepare

Master the two core patterns with an emphasis on clean edge-case handling. Let's look at the Monotonic Stack pattern, which is less intuitive but highly testable.

The key insight: Use a stack to store _indices_ (not just values) of items for which you haven't yet found a "next greater" element. You process the array, and while the current element is greater than the element at the index stored at the stack's top, you've found your answer for that stored index.

<div class="code-group">

```python
def dailyTemperatures(temperatures):
    """
    Given a list of daily temperatures, returns a list of how many days you have to wait
    for a warmer temperature. If no future warmer day, answer is 0.
    Time: O(n) - Each index is pushed and popped from the stack at most once.
    Space: O(n) - For the output list and the stack in the worst case.
    """
    n = len(temperatures)
    answer = [0] * n
    stack = []  # Stores indices of days waiting for a warmer day

    for current_day in range(n):
        current_temp = temperatures[current_day]
        # While the stack is not empty and the current day is warmer
        # than the day at the top of the stack
        while stack and temperatures[stack[-1]] < current_temp:
            previous_day = stack.pop()
            answer[previous_day] = current_day - previous_day
        stack.append(current_day)
    return answer
```

```javascript
function dailyTemperatures(temperatures) {
  /**
   * Time: O(n) - Each index is pushed and popped from the stack at most once.
   * Space: O(n) - For the output array and the stack in the worst case.
   */
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // Stores indices of days waiting for a warmer day

  for (let currentDay = 0; currentDay < n; currentDay++) {
    const currentTemp = temperatures[currentDay];
    // While the stack is not empty and the current day is warmer
    // than the day at the top of the stack
    while (stack.length > 0 && temperatures[stack[stack.length - 1]] < currentTemp) {
      const previousDay = stack.pop();
      answer[previousDay] = currentDay - previousDay;
    }
    stack.push(currentDay);
  }
  return answer;
}
```

```java
public int[] dailyTemperatures(int[] temperatures) {
    /**
     * Time: O(n) - Each index is pushed and popped from the stack at most once.
     * Space: O(n) - For the output array and the stack in the worst case.
     */
    int n = temperatures.length;
    int[] answer = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // Stores indices

    for (int currentDay = 0; currentDay < n; currentDay++) {
        int currentTemp = temperatures[currentDay];
        // While the stack is not empty and the current day is warmer
        // than the day at the top of the stack
        while (!stack.isEmpty() && temperatures[stack.peek()] < currentTemp) {
            int previousDay = stack.pop();
            answer[previousDay] = currentDay - previousDay;
        }
        stack.push(currentDay);
    }
    return answer;
}
```

</div>

For validation problems, the pattern is more straightforward but requires meticulous handling of edge cases. Always check if the stack is empty at the end.

<div class="code-group">

```python
def isValid(s):
    """
    Validates a string containing just '(', ')', '{', '}', '[' and ']'.
    Time: O(n) - Single pass through the string.
    Space: O(n) - In the worst case (all opening brackets), the stack holds all chars.
    """
    mapping = {')': '(', '}': '{', ']': '['}
    stack = []

    for char in s:
        if char in mapping:  # It's a closing bracket
            # Pop if stack not empty, else use a dummy value
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:  # It's an opening bracket
            stack.append(char)
    # Valid if stack is empty (all opened brackets were closed)
    return not stack
```

```javascript
function isValid(s) {
  /**
   * Time: O(n) - Single pass through the string.
   * Space: O(n) - Worst-case stack usage.
   */
  const mapping = { ")": "(", "}": "{", "]": "[" };
  const stack = [];

  for (let char of s) {
    if (char in mapping) {
      // It's a closing bracket
      const topElement = stack.length > 0 ? stack.pop() : "#";
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
    /**
     * Time: O(n) - Single pass through the string.
     * Space: O(n) - Worst-case stack usage.
     */
    Map<Character, Character> mapping = new HashMap<>();
    mapping.put(')', '(');
    mapping.put('}', '{');
    mapping.put(']', '[');

    Deque<Character> stack = new ArrayDeque<>();

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

## How Expedia Tests Stack vs Other Companies

Compared to a company like Google, which might embed a stack within a complex graph or system design problem, Expedia's Stack questions are more self-contained and directly applicable. They feel like a focused coding challenge rather than a puzzle piece. The difficulty is typically in the **Medium** range on LeetCode. Unlike some finance or trading firms that might ask extreme performance variants, Expedia's questions prioritize correctness, clarity, and handling realistic input scenarios (e.g., invalid sequences, empty inputs, large but manageable lists). The "Expedia flavor" is the subtle business context: you might be validating a path, parsing a log, or finding the next available option—all with code that needs to be production-ready.

## Study Order

1.  **Fundamental Operations & Syntax:** Get comfortable with the basic push, pop, peek, and isEmpty operations in your chosen language using its standard library (list in Python, Array in JavaScript, Deque in Java). This avoids fumbling during the interview.
2.  **Classic Validation (Parentheses):** Start with **Valid Parentheses (#20)**. This builds the core muscle memory of using a stack for matching and checking state. It's simple but teaches you to watch for the empty-stack pop edge case.
3.  **Slightly Harder Validation:** Move to problems that use the same core pattern but with a twist, like **Minimum Remove to Make Valid Parentheses (#1249)**. This reinforces the pattern under new constraints.
4.  **Introduction to Monotonic Stack:** Learn the "Next Greater Element" template with **Next Greater Element I (#496)**. Understand _why_ the stack is monotonic and how indices are used.
5.  **Applied Monotonic Stack:** Tackle **Daily Temperatures (#739)**. This is the canonical problem that proves you understand the pattern beyond a simple lookup.
6.  **Combination & Evaluation:** Finally, practice problems where the stack is part of the solution for expression evaluation, like **Evaluate Reverse Polish Notation (#150)**. This tests if you can apply the structure to a different domain (calculations).

This order builds from mechanics to pattern recognition to application, ensuring you understand the "why" before hitting more complex problems.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous or introduces a key nuance.

1.  **Valid Parentheses (#20)** - The absolute foundation.
2.  **Minimum Remove to Make Valid Parentheses (#1249)** - Validation with a modification goal.
3.  **Next Greater Element I (#496)** - Gentle intro to the monotonic stack pattern.
4.  **Daily Temperatures (#739)** - Core monotonic stack mastery.
5.  **Evaluate Reverse Polish Notation (#150)** - Stack for expression evaluation.
6.  **Asteroid Collision (#735)** - Excellent Expedia-style problem: processing a sequence of events (like bookings or cancellations) where elements cancel each other out based on rules.

Mastering this sequence will make you exceptionally prepared for any Stack question Expedia throws your way. Remember, their goal isn't to trick you with obscure data structure theory, but to see you model a sequential process correctly and robustly.

[Practice Stack at Expedia](/company/expedia/stack)
