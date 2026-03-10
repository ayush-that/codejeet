---
title: "Stack Questions at Goldman Sachs: What to Expect"
description: "Prepare for Stack interview questions at Goldman Sachs — patterns, difficulty breakdown, and study tips."
date: "2027-08-06"
category: "dsa-patterns"
tags: ["goldman-sachs", "stack", "interview prep"]
---

If you're preparing for Goldman Sachs technical interviews, you'll quickly notice something interesting: they have a significant number of Stack problems in their question bank. With 24 out of 270 total questions tagged as Stack, it's not their absolute largest category, but it's a consistent and important one. In real interviews, you're more likely to encounter a Stack problem than you might expect, especially in the initial coding rounds. This makes sense—Stack questions are excellent for testing a candidate's ability to think about state management, edge cases, and linear-time solutions, all while keeping the problem scope contained enough for a 45-minute interview.

The key insight is that Goldman Sachs doesn't just ask Stack problems; they ask _specific kinds_ of Stack problems. They favor questions where the Stack elegantly tracks a condition that needs to be validated or a computation that depends on previous elements. You won't often see them asking you to implement a basic Stack class. Instead, they want to see you apply the pattern to solve a non-obvious problem.

## Specific Patterns Goldman Sachs Favors

Goldman Sachs Stack problems typically fall into three categories, listed here in order of frequency:

1.  **Parentheses/Validation Problems:** These are the most common. The Stack naturally tracks opening symbols to match against closing ones. Goldman loves variations that incorporate additional constraints. **LeetCode #20 (Valid Parentheses)** is the fundamental pattern, but expect twists like **LeetCode #32 (Longest Valid Parentheses)**, which requires tracking indices to calculate length.

2.  **Monotonic Stack Problems:** This is a critical pattern for Goldman. A monotonic (increasing or decreasing) Stack is used to solve "next greater element" or "trapping rain water" style problems efficiently. It's a classic interview pattern because it's non-trivial but learnable. **LeetCode #739 (Daily Temperatures)** and **LeetCode #503 (Next Greater Element II)** are quintessential examples.

3.  **Calculator/Evaluation Problems:** Given Goldman's domain, problems that involve evaluating expressions (like **LeetCode #224 (Basic Calculator)** or **LeetCode #227 (Basic Calculator II)**) appear with reasonable frequency. These test your ability to manage operator precedence and state using Stacks.

You'll notice a distinct lack of recursive DFS Stack implementations (like tree traversals). While those use a Stack data structure, Goldman Sachs typically categorizes those under "Tree" or "DFS." Their "Stack" tag is reserved for problems where the Stack _is the algorithm's core logic_.

## How to Prepare

The most effective way to prepare is to internalize the pattern, not just memorize problems. Let's look at the Monotonic Stack pattern, which is a Goldman favorite. The core idea is to maintain a stack where elements are in increasing (or decreasing) order. As you iterate through an array, you pop from the stack when the current element violates the monotonic property, which often lets you compute an answer (like "next greater element") for the popped element.

Here’s the template for a "Next Greater Element" problem (LeetCode #496):

<div class="code-group">

```python
def nextGreaterElement(nums1, nums2):
    """
    Finds the next greater element for each element in nums1 as it appears in nums2.
    Time: O(n + m) where n = len(nums2), m = len(nums1) | Space: O(n) for the stack and map.
    """
    next_greater_map = {}
    stack = []  # Monotonically decreasing stack (stores indices or values)

    # Process nums2 to build the mapping
    for num in nums2:
        # While stack is not empty and current number > top of stack
        while stack and num > stack[-1]:
            smaller = stack.pop()
            next_greater_map[smaller] = num
        stack.append(num)

    # Remaining elements in stack have no next greater element
    while stack:
        next_greater_map[stack.pop()] = -1

    # Build result for nums1
    return [next_greater_map[num] for num in nums1]
```

```javascript
function nextGreaterElement(nums1, nums2) {
  // Time: O(n + m) | Space: O(n)
  const nextGreaterMap = new Map();
  const stack = []; // Monotonically decreasing stack

  for (const num of nums2) {
    while (stack.length > 0 && num > stack[stack.length - 1]) {
      const smaller = stack.pop();
      nextGreaterMap.set(smaller, num);
    }
    stack.push(num);
  }

  // Remaining elements have no next greater
  for (const remaining of stack) {
    nextGreaterMap.set(remaining, -1);
  }

  return nums1.map((num) => nextGreaterMap.get(num));
}
```

```java
public int[] nextGreaterElement(int[] nums1, int[] nums2) {
    // Time: O(n + m) | Space: O(n)
    Map<Integer, Integer> nextGreaterMap = new HashMap<>();
    Deque<Integer> stack = new ArrayDeque<>(); // Monotonically decreasing stack

    for (int num : nums2) {
        while (!stack.isEmpty() && num > stack.peek()) {
            int smaller = stack.pop();
            nextGreaterMap.put(smaller, num);
        }
        stack.push(num);
    }

    // Remaining elements have no next greater
    while (!stack.isEmpty()) {
        nextGreaterMap.put(stack.pop(), -1);
    }

    int[] result = new int[nums1.length];
    for (int i = 0; i < nums1.length; i++) {
        result[i] = nextGreaterMap.get(nums1[i]);
    }
    return result;
}
```

</div>

For parentheses validation, the pattern is simpler but must be rock-solid. Here's the core logic extended to handle a single type of bracket, which is a common building block for more complex problems:

<div class="code-group">

```python
def isValid(s: str) -> bool:
    """
    Validates a string containing just '(' and ')'.
    Time: O(n) | Space: O(n) in worst case (e.g., all opening brackets).
    """
    stack = []
    mapping = {')': '('}

    for char in s:
        if char in mapping:  # It's a closing bracket
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:  # It's an opening bracket
            stack.append(char)
    return not stack  # True if stack is empty
```

```javascript
function isValid(s) {
  // Time: O(n) | Space: O(n)
  const stack = [];
  const mapping = { ")": "(" };

  for (const char of s) {
    if (mapping.hasOwnProperty(char)) {
      const topElement = stack.length > 0 ? stack.pop() : "#";
      if (mapping[char] !== topElement) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}
```

```java
public boolean isValid(String s) {
    // Time: O(n) | Space: O(n)
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> mapping = Map.of(')', '(');

    for (char c : s.toCharArray()) {
        if (mapping.containsKey(c)) {
            char topElement = stack.isEmpty() ? '#' : stack.pop();
            if (mapping.get(c) != topElement) {
                return false;
            }
        } else {
            stack.push(c);
        }
    }
    return stack.isEmpty();
}
```

</div>

## How Goldman Sachs Tests Stack vs Other Companies

Goldman Sachs's Stack questions tend to be "medium" difficulty on LeetCode, with a strong emphasis on clean, efficient implementation. Compared to a company like Google, which might embed a Stack within a more complex graph or system design problem, Goldman's questions are often more self-contained and algorithmic. Unlike some FAANG companies that might prioritize extreme optimization or tricky edge cases, Goldman's interviews typically reward clarity, correct reasoning, and the ability to explain your solution step-by-step. The "financial" twist is subtle—it's less about finance-specific knowledge and more about a preference for problems involving sequences, validation, and state, which are analogous to processing financial data streams or validating transactions.

## Study Order

Tackle Stack topics in this order to build a solid foundation:

1.  **Basic LIFO Operations:** Understand `push`, `pop`, `peek`, and `isEmpty`. Implement a Stack using an array/list and a linked list. This is foundational.
2.  **Classic Validation Problems:** Start with Valid Parentheses (#20). This ingrains the core "push open, pop on close" pattern. Then move to Min Stack (#155) to understand how to augment a Stack with extra data.
3.  **Monotonic Stack Pattern:** Learn this as a distinct concept. Practice with Next Greater Element I (#496) and Daily Temperatures (#739) until the `while` loop condition feels natural.
4.  **Calculator Problems:** Tackle Basic Calculator II (#227) before #224. Dealing with `+`, `-`, `*`, `/` is a logical step before adding parentheses, which adds a recursion or second stack.
5.  **Advanced Variations:** Finally, combine patterns with problems like Longest Valid Parentheses (#32) or Trapping Rain Water (#42). These often require storing indices in the stack and performing additional calculations upon popping.

## Recommended Practice Order

Solve these specific problems in sequence. Each one builds on the previous pattern:

1.  **Valid Parentheses (#20)** - The absolute essential.
2.  **Min Stack (#155)** - Learn to augment stack data.
3.  **Next Greater Element I (#496)** - Introduction to monotonic stack.
4.  **Daily Temperatures (#739)** - Monotonic stack classic.
5.  **Basic Calculator II (#227)** - Expression evaluation without parentheses.
6.  **Evaluate Reverse Polish Notation (#150)** - Another core evaluation pattern.
7.  **Longest Valid Parentheses (#32)** - A challenging but common Goldman-style variation.
8.  **Remove All Adjacent Duplicates In String (#1047)** - A simpler, but pattern-reinforcing problem.

Mastering these patterns will make you well-prepared for the Stack problems you're likely to see at Goldman Sachs. Remember, their goal is to see you recognize the underlying structure of a problem and apply a known, efficient pattern to solve it cleanly.

[Practice Stack at Goldman Sachs](/company/goldman-sachs/stack)
