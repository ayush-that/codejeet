---
title: "Stack Questions at Twitter: What to Expect"
description: "Prepare for Stack interview questions at Twitter — patterns, difficulty breakdown, and study tips."
date: "2029-07-30"
category: "dsa-patterns"
tags: ["twitter", "stack", "interview prep"]
---

## Why Stack Matters at Twitter

If you're preparing for a Twitter interview, you might have noticed that Stack problems represent about 7.5% of their tagged questions (4 out of 53). While this might seem like a secondary topic compared to heavyweights like Arrays or Trees, here's the insider perspective: Stack is a _high-signal_ topic at Twitter. It doesn't appear in every interview, but when it does, it's often a carefully chosen problem that tests fundamental computer science intuition about data flow, state management, and parsing—skills directly relevant to Twitter's core engineering work.

Think about what Twitter's systems do: they process streams of tweets (sequential data), validate and parse user input (handling nested structures like JSON or markup), manage undo/redo operations in their editing interfaces, and evaluate expressions in their data pipelines. All of these are classic Stack use cases. In my experience conducting and analyzing Twitter interviews, a Stack question rarely appears as a simple "implement a stack" exercise. Instead, it's usually disguised as a string parsing, tree traversal, or state machine problem where recognizing the Stack pattern is 80% of the battle.

## Specific Patterns Twitter Favors

Twitter's Stack problems tend to cluster around two specific patterns that mirror real engineering challenges in their stack:

1. **Monotonic Stack for Next Greater Element Problems**: This pattern appears in problems involving finding the next greater/smaller element in an array. It's efficient and elegant, testing whether you can optimize beyond the obvious O(n²) solution. Twitter seems to favor this because it's applicable to their data stream processing—like finding when a tweet's engagement surpasses a previous one in a timeline.

2. **Parentheses/Expression Validation and Evaluation**: Given Twitter's need to parse and validate user content, search queries, and API requests, problems involving balanced parentheses, HTML tag validation, or basic calculator operations are highly relevant. These questions test your ability to handle nested structures and state.

A concrete example is **LeetCode 739. Daily Temperatures**, a classic monotonic stack problem. Another is **LeetCode 20. Valid Parentheses**—but Twitter's variation might involve multiple bracket types or additional constraints like minimum removal counts.

<div class="code-group">

```python
# LeetCode 739. Daily Temperatures - Monotonic Stack Pattern
# Time: O(n) | Space: O(n)
def dailyTemperatures(temperatures):
    """
    For each day, find how many days until a warmer temperature.
    Uses a monotonic decreasing stack (stores indices).
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # stores indices of temperatures

    for i in range(n):
        # While current temp is greater than stack's top temp
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx
        stack.append(i)

    return result
```

```javascript
// LeetCode 739. Daily Temperatures - Monotonic Stack Pattern
// Time: O(n) | Space: O(n)
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const result = new Array(n).fill(0);
  const stack = []; // stores indices of temperatures

  for (let i = 0; i < n; i++) {
    // While current temp is greater than stack's top temp
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIdx = stack.pop();
      result[prevIdx] = i - prevIdx;
    }
    stack.push(i);
  }

  return result;
}
```

```java
// LeetCode 739. Daily Temperatures - Monotonic Stack Pattern
// Time: O(n) | Space: O(n)
public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] result = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        // While current temp is greater than stack's top temp
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int prevIdx = stack.pop();
            result[prevIdx] = i - prevIdx;
        }
        stack.push(i);
    }

    return result;
}
```

</div>

## How to Prepare

The key to mastering Stack for Twitter is pattern recognition, not memorization. When you encounter a problem, ask yourself these two questions:

1. **"Do I need to match or pair elements?"** (Think parentheses, tags, or nested structures)
2. **"Do I need to maintain a relative order while finding next/previous greater/smaller elements?"** (Think stock spans or daily temperatures)

If the answer to either is yes, Stack is likely your tool. Practice implementing both the monotonic stack and validation patterns until you can derive the solution from first principles during an interview.

For expression evaluation problems like **LeetCode 224. Basic Calculator**, remember the two-stack approach (values and operators) and pay attention to precedence and unary operators. Twitter interviewers often extend these problems with real-world constraints.

<div class="code-group">

```python
# LeetCode 20. Valid Parentheses - Validation Pattern
# Time: O(n) | Space: O(n)
def isValid(s):
    """
    Validates if parentheses are properly closed and nested.
    Demonstrates the matching/paring pattern.
    """
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in mapping:  # Closing bracket
            # Check if stack is empty or top doesn't match
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:  # Opening bracket
            stack.append(char)

    # Valid if stack is empty (all opened brackets closed)
    return not stack
```

```javascript
// LeetCode 20. Valid Parentheses - Validation Pattern
// Time: O(n) | Space: O(n)
function isValid(s) {
  const stack = [];
  const mapping = { ")": "(", "}": "{", "]": "[" };

  for (let char of s) {
    if (mapping[char]) {
      // Closing bracket
      // Check if stack is empty or top doesn't match
      const topElement = stack.length ? stack.pop() : "#";
      if (mapping[char] !== topElement) {
        return false;
      }
    } else {
      // Opening bracket
      stack.push(char);
    }
  }

  // Valid if stack is empty (all opened brackets closed)
  return stack.length === 0;
}
```

```java
// LeetCode 20. Valid Parentheses - Validation Pattern
// Time: O(n) | Space: O(n)
public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> mapping = new HashMap<>();
    mapping.put(')', '(');
    mapping.put('}', '{');
    mapping.put(']', '[');

    for (char c : s.toCharArray()) {
        if (mapping.containsKey(c)) { // Closing bracket
            // Check if stack is empty or top doesn't match
            char topElement = stack.isEmpty() ? '#' : stack.pop();
            if (mapping.get(c) != topElement) {
                return false;
            }
        } else { // Opening bracket
            stack.push(c);
        }
    }

    // Valid if stack is empty (all opened brackets closed)
    return stack.isEmpty();
}
```

</div>

## How Twitter Tests Stack vs Other Companies

Twitter's Stack questions differ from other companies in three noticeable ways:

**Compared to FAANG**: Twitter problems tend to be more directly applicable to web development scenarios. While Google might ask abstract monotonic stack problems and Facebook might focus on tree traversal with stacks, Twitter often presents problems that feel like real engineering tasks—validating user input, processing timelines, or evaluating expressions.

**Difficulty Level**: Twitter's Stack questions are typically in the medium range. You're unlikely to get a "hard" Stack problem as a first question, but you might get a medium problem with a twist that requires careful edge case handling. The focus is on clean implementation and communication rather than algorithmic complexity.

**Unique Approach**: Twitter interviewers often ask follow-up questions that change constraints: "What if we also had angle brackets?" or "How would this work with a stream of data instead of a fixed array?" This tests your ability to adapt solutions, which is crucial for Twitter's fast-evolving product needs.

## Study Order

1. **Basic Stack Operations** - Understand LIFO behavior and implement push/pop/peek. This is foundational.
2. **Parentheses Validation** - Learn the matching pattern (LeetCode 20). This teaches you to recognize when Stack solves pairing problems.
3. **Monotonic Stack Fundamentals** - Practice Next Greater Element (LeetCode 496) to understand maintaining order while finding relationships.
4. **Expression Evaluation** - Tackle Basic Calculator (LeetCode 224) to handle operator precedence and multiple stacks.
5. **Stack in Tree Traversal** - Implement iterative DFS (LeetCode 94, 144, 145) to see Stack as a replacement for recursion.
6. **Advanced Variations** - Try problems like Remove Duplicate Letters (LeetCode 316) or Maximal Rectangle (LeetCode 85) that combine Stack with other concepts.

This order works because it builds from simple LIFO understanding to pattern recognition (validation, monotonic) to application (expressions, trees) to complex combinations.

## Recommended Practice Order

Solve these problems in sequence to build your Stack skills specifically for Twitter:

1. **Valid Parentheses (LeetCode 20)** - Master the basic validation pattern
2. **Next Greater Element I (LeetCode 496)** - Introduction to monotonic stack
3. **Daily Temperatures (LeetCode 739)** - Classic monotonic stack application
4. **Evaluate Reverse Polish Notation (LeetCode 150)** - Simple expression evaluation
5. **Basic Calculator II (LeetCode 227)** - Handle operators and precedence
6. **Remove All Adjacent Duplicates In String (LeetCode 1047)** - Stack for sequential processing
7. **Exclusive Time of Functions (LeetCode 636)** - Real-world logging analysis (great for Twitter-style questions)
8. **Asteroid Collision (LeetCode 735)** - Creative application of Stack for collision simulation

After completing these, search for Twitter-tagged Stack problems on LeetCode to see the exact style they use.

Remember: In your Twitter interview, when you see a Stack problem, think aloud about why Stack is appropriate. Explain the LIFO property and how it applies to the problem. Twitter engineers value clear communication about your technical choices as much as the solution itself.

[Practice Stack at Twitter](/company/twitter/stack)
