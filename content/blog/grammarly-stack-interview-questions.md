---
title: "Stack Questions at Grammarly: What to Expect"
description: "Prepare for Stack interview questions at Grammarly — patterns, difficulty breakdown, and study tips."
date: "2031-01-25"
category: "dsa-patterns"
tags: ["grammarly", "stack", "interview prep"]
---

Grammarly’s engineering interviews are known for being practical and product‑focused, but they still test core computer science fundamentals. Out of their 26 most‑asked topics, Stack appears in 4 questions — that’s about 15% of their technical question pool. While not the most frequent topic, it’s a consistent presence. Why? Because stacks naturally model a wide range of real‑world parsing, validation, and state‑tracking problems — exactly the kind of work Grammarly’s text‑processing engine does every day. If you’re interviewing for a role that touches the core editing or language analysis systems, expect to see at least one stack problem. Even for other roles, it’s a reliable indicator of your ability to think sequentially and handle nested structures.

## Specific Patterns Grammarly Favors

Grammarly’s stack questions rarely appear as pure “implement a stack” exercises. Instead, they’re embedded in problems that involve **parsing, validation, or step‑by‑step simulation**. The two most common flavors are:

1.  **Parentheses/brace validation and transformation** — Think checking for balanced brackets, but often extended to HTML/XML tags or custom delimiter pairs. This tests your ability to match opening and closing symbols in order, which is fundamental to text analysis.
2.  **Monotonic stack problems** — These appear in scenarios where you need to find the next greater or smaller element, or maintain a sorted order while processing a stream. This pattern is useful for features like syntax‑highlighting or detecting certain writing patterns.

You’re unlikely to see stack‑based graph traversal (like iterative DFS) as a primary focus — that’s more common at companies like Google or Meta. Grammarly’s problems tend to be self‑contained and often relate directly to string or array manipulation.

A classic example is **Valid Parentheses (LeetCode #20)**, but Grammarly’s version might involve multiple types of nested symbols (curly, square, angle brackets) or require you to output the corrected string. Another pattern is **Next Greater Element I (LeetCode #496)**, which uses a monotonic stack to efficiently find the next larger number.

## How to Prepare

The key is to recognize when a stack is the right tool. Look for problems where you need to:

- Process items in order, but might need to “look back” at recent elements.
- Handle nested or recursive structures (like matching pairs).
- Maintain a running maximum or minimum in a sliding window.

Let’s look at a common variation: checking for balanced tags with a custom mapping. Here’s how you’d implement it in three languages.

<div class="code-group">

```python
def is_valid(s: str, pairs: dict) -> bool:
    """
    Validates if a string has balanced delimiters based on a custom mapping.
    pairs = {'(': ')', '[': ']', '<': '>'} for example.
    Time: O(n) | Space: O(n) in worst-case (all openers).
    """
    stack = []
    for ch in s:
        if ch in pairs:               # Opening symbol
            stack.append(ch)
        elif ch in pairs.values():    # Closing symbol
            if not stack:
                return False
            opener = stack.pop()
            if pairs[opener] != ch:   # Mismatch
                return False
    return len(stack) == 0            # All opened must be closed
```

```javascript
function isValid(s, pairs) {
  // Time: O(n) | Space: O(n)
  const stack = [];
  const closers = new Set(Object.values(pairs));

  for (const ch of s) {
    if (pairs[ch] !== undefined) {
      // Opening symbol
      stack.push(ch);
    } else if (closers.has(ch)) {
      // Closing symbol
      if (stack.length === 0) return false;
      const opener = stack.pop();
      if (pairs[opener] !== ch) return false;
    }
  }
  return stack.length === 0;
}
```

```java
public boolean isValid(String s, Map<Character, Character> pairs) {
    // Time: O(n) | Space: O(n)
    Deque<Character> stack = new ArrayDeque<>();
    Set<Character> closers = new HashSet<>(pairs.values());

    for (char ch : s.toCharArray()) {
        if (pairs.containsKey(ch)) {      // Opening symbol
            stack.push(ch);
        } else if (closers.contains(ch)) { // Closing symbol
            if (stack.isEmpty()) return false;
            char opener = stack.pop();
            if (pairs.get(opener) != ch) return false;
        }
    }
    return stack.isEmpty();
}
```

</div>

For monotonic stacks, the pattern is about maintaining elements in decreasing or increasing order as you iterate. Here’s a template for finding the next greater element for each item in an array.

<div class="code-group">

```python
def next_greater_elements(nums):
    """
    Returns an array where result[i] is the next greater element for nums[i].
    Time: O(n) | Space: O(n)
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices, monotonic decreasing

    for i in range(n):
        while stack and nums[stack[-1]] < nums[i]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
    return result
```

```javascript
function nextGreaterElements(nums) {
  // Time: O(n) | Space: O(n)
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // stores indices, monotonic decreasing

  for (let i = 0; i < n; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}
```

```java
public int[] nextGreaterElements(int[] nums) {
    // Time: O(n) | Space: O(n)
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>(); // stores indices, monotonic decreasing

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            int idx = stack.pop();
            result[idx] = nums[i];
        }
        stack.push(i);
    }
    return result;
}
```

</div>

## How Grammarly Tests Stack vs Other Companies

At large tech companies (FAANG), stack problems are often used as a component of more complex algorithm questions — for example, as part of a tree traversal or graph algorithm. The difficulty tends to be high, focusing on optimization and edge cases.

At Grammarly, stack questions are more **applied and contextual**. You might be given a problem statement that mimics a real‑world text‑processing scenario. For instance, instead of “evaluate reverse polish notation,” you might be asked to evaluate a simplified markup language. The difficulty is usually medium, but the focus is on clean, bug‑free code and clear communication about your approach. They want to see that you can translate a practical problem into a known data structure pattern.

## Study Order

Don’t jump straight into monotonic stacks. Build your understanding progressively:

1.  **Basic LIFO operations** — Be able to implement a stack from scratch (using a list) and describe its operations. Understand its use in function call management.
2.  **Classic validation problems** — Start with Valid Parentheses (#20). Then move to problems like Minimum Remove to Make Valid Parentheses (#1249), where you must both validate and modify.
3.  **Stack in tree/graph traversal** — Practice iterative DFS for binary trees (using a stack instead of recursion). This solidifies how stacks manage state.
4.  **Monotonic stack patterns** — Begin with Next Greater Element I (#496), then tackle Daily Temperatures (#739). Understand both the decreasing stack (for next greater) and increasing stack (for next smaller) variants.
5.  **Hybrid problems** — Finally, try problems where the stack is one part of a larger solution, like Largest Rectangle in Histogram (#84). This is where you synthesize the pattern.

This order works because each step builds on the intuition of the previous one. You start with the core LIFO concept, apply it to straightforward matching, see it manage traversal state, then learn to maintain order, and finally combine it with other techniques.

## Recommended Practice Order

Solve these problems in sequence to build the specific skills Grammarly looks for:

1.  **Valid Parentheses (#20)** — The absolute fundamental.
2.  **Minimum Add to Make Parentheses Valid (#921)** — A slight twist that tests your understanding of the balance count.
3.  **Next Greater Element I (#496)** — Your first monotonic stack.
4.  **Daily Temperatures (#739)** — A perfect, classic monotonic stack application.
5.  **Evaluate Reverse Polish Notation (#150)** — Shows how stacks can be used for expression evaluation (relevant for parsing).
6.  **Asteroid Collision (#735)** — A great “simulation” problem that uses a stack elegantly.
7.  **Remove All Adjacent Duplicates In String (#1047)** — Simple but tests your ability to see the stack pattern in string manipulation.

After this sequence, you’ll have covered the core patterns Grammarly uses. Remember to always articulate _why_ you’re choosing a stack as you solve — interviewers there care about your reasoning as much as your code.

[Practice Stack at Grammarly](/company/grammarly/stack)
