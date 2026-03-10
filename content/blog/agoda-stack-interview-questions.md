---
title: "Stack Questions at Agoda: What to Expect"
description: "Prepare for Stack interview questions at Agoda — patterns, difficulty breakdown, and study tips."
date: "2029-09-22"
category: "dsa-patterns"
tags: ["agoda", "stack", "interview prep"]
---

Agoda’s interview process is known for being practical and algorithm-focused, with a clear emphasis on data structures that model real-world hierarchical or nested relationships. Out of their 46 tagged problems on LeetCode, 8 are Stack-based—that’s about 17% of their problem set, making it a **high-priority topic** for anyone interviewing there. In practice, this means you have a roughly 1 in 3 chance of encountering a Stack question in any given technical round. Why does Agoda care so much? Because their core business—travel bookings—involves deeply nested data: multi-city itineraries, layered discount rules, cancellation policies with conditions, and UI components that manage stateful, sequential interactions. A Stack’s LIFO (Last-In, First-Out) behavior is perfect for parsing, validating, and backtracking through such structures.

## Specific Patterns Agoda Favors

Agoda’s Stack questions rarely appear in isolation; they’re almost always paired with **string manipulation** or **tree/graph traversal**. You won’t see many abstract, purely mathematical Stack puzzles here. Instead, expect problems where the Stack helps manage state while processing a linear input. The two most frequent patterns are:

1.  **Parentheses and Expression Evaluation:** This is Agoda’s bread and butter. Think validating nested hotel cancellation policies (e.g., `"((valid until date) AND (not used))"`) or evaluating discount rules. The pattern involves pushing opening delimiters onto a stack and popping when you encounter a closing delimiter, ensuring proper nesting and often computing a result along the way.
2.  **Monotonic Stack for Next Greater Element:** Agoda uses this to solve problems like finding the next available date with a lower price (Next Greater Element in disguise) or calculating spans in time-series data (e.g., booking rates). The monotonic stack maintains elements in a sorted order (increasing or decreasing) to efficiently find the next element satisfying a condition.

For example, **LeetCode #20 (Valid Parentheses)** is a classic warm-up, but Agoda’s problems tend to be variations like **LeetCode #394 (Decode String)**, where you must manage both a count stack and a string stack to decode nested patterns like `"3[a2[c]]"` (which becomes `"accaccacc"`). Another favorite is **LeetCode #739 (Daily Temperatures)**, a quintessential monotonic stack problem for finding the next warmer day.

## How to Prepare

The key is to internalize the two core patterns until writing the stack logic becomes mechanical. Let’s look at the monotonic stack pattern for "Next Greater Element" problems, which is incredibly versatile.

<div class="code-group">

```python
def dailyTemperatures(temperatures):
    """
    Given a list of daily temperatures, returns a list of days to wait
    for a warmer temperature. Uses a monotonic decreasing stack.
    Time: O(n) - each index is pushed and popped at most once.
    Space: O(n) - for the stack and output array.
    """
    n = len(temperatures)
    answer = [0] * n
    stack = []  # stores indices of temperatures in decreasing order

    for i, temp in enumerate(temperatures):
        # While current temp is greater than temp at stack's top index
        while stack and temperatures[stack[-1]] < temp:
            prev_index = stack.pop()
            answer[prev_index] = i - prev_index  # days to wait
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
    // Pop while current temp > temp at the index on top of stack
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
    Deque<Integer> stack = new ArrayDeque<>(); // monotonic decreasing index stack

    for (int i = 0; i < n; i++) {
        int currentTemp = temperatures[i];
        // Pop indices while current temp > temp at that index
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

For parentheses/expression problems, the pattern is different but equally formulaic. You’ll often need two stacks: one for counts/operators and one for strings/intermediate results, as seen in Decode String.

## How Agoda Tests Stack vs Other Companies

Compared to FAANG companies, Agoda’s Stack questions are less about clever, one-off tricks and more about **applied data structure usage**. At Google, you might get a Stack problem that’s really a disguised greedy algorithm (e.g., **LeetCode #316 (Remove Duplicate Letters)**). At Agoda, the Stack’s role is usually explicit and directly tied to processing nested data. The difficulty is consistent—mostly LeetCode Medium—but the focus is on **clean, bug-free implementation under time pressure**. They want to see that you can translate a real-world nested data problem into a working Stack solution without overcomplicating it. Whiteboard sessions often involve walking through your stack’s state at each step, so practice verbalizing that.

## Study Order

Don’t jump straight into Agoda’s hardest tagged problems. Build your Stack intuition in this order:

1.  **Fundamental LIFO Operations:** Start with the absolute basics—implement a stack using an array/list, and solve **LeetCode #20 (Valid Parentheses)**. This ingrains the push/pop matching logic.
2.  **Stack in Tree/Graph Traversal:** Practice **LeetCode #94 (Binary Tree Inorder Traversal)** iteratively using a stack. This bridges your understanding of recursion and explicit stack management, a common theme.
3.  **Monotonic Stack Patterns:** Learn the next greater/smaller element pattern with **LeetCode #496 (Next Greater Element I)** and then **#739 (Daily Temperatures)**. This pattern is non-intuitive at first but becomes a powerful tool.
4.  **Expression Evaluation & Nested Decoding:** Tackle problems where you manage multiple stacks or a stack of tuples, like **LeetCode #394 (Decode String)** and **#224 (Basic Calculator)**. This is where Agoda’s problems often live.
5.  **Stack in Dynamic Scenarios:** Finally, combine stacks with other operations, like **LeetCode #853 (Car Fleet)**, which uses a monotonic stack after sorting—a pattern that appears in Agoda problems involving scheduling or sequencing.

This order works because it moves from recognizing _when_ to use a stack (steps 1-2) to mastering its two most powerful _specialized patterns_ (steps 3-4), before finally combining it with other concepts (step 5).

## Recommended Practice Order

Solve these specific problems in sequence. Each builds on the previous one’s pattern.

1.  **Valid Parentheses (#20)** – The foundational matching problem.
2.  **Binary Tree Inorder Traversal (#94)** – Iterative DFS using a stack.
3.  **Next Greater Element I (#496)** – Introduction to the monotonic stack pattern.
4.  **Daily Temperatures (#739)** – The classic monotonic stack application.
5.  **Decode String (#394)** – Managing multiple stacks for nested evaluation.
6.  **Evaluate Reverse Polish Notation (#150)** – Straightforward stack evaluation.
7.  **Basic Calculator (#224)** – A harder, more realistic expression evaluator (covers `+`, `-`, `(`, `)`).
8.  **Car Fleet (#853)** – Stack used after sorting, a good test of applying the pattern in a dynamic scenario.

By following this progression, you’ll cover every Stack pattern Agoda favors. Remember, their goal isn’t to see if you’ve memorized LeetCode solutions, but whether you can identify that a problem involves nested, sequential, or state-dependent processing and reach for the right tool—the stack—immediately.

[Practice Stack at Agoda](/company/agoda/stack)
