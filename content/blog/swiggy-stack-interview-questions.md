---
title: "Stack Questions at Swiggy: What to Expect"
description: "Prepare for Stack interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-02-05"
category: "dsa-patterns"
tags: ["swiggy", "stack", "interview prep"]
---

If you're preparing for a Swiggy interview, you'll notice something interesting in their question bank: **Stack** appears in roughly 12% of their problems (5 out of 41). While that might not sound like a dominant focus, it's a critical one. In my experience conducting and analyzing interviews, Stack questions at Swiggy aren't just about checking if you know the data structure—they're a proxy for evaluating your ability to handle **sequential data processing, state tracking, and nested relationships**, which are fundamental to building reliable food delivery and logistics systems. Think order matching, delivery route validation, or parsing complex configuration rules. Missing a Stack pattern here is often an automatic rejection, because it signals a gap in core problem-solving fundamentals.

## Specific Patterns Swiggy Favors

Swiggy's Stack problems tend to cluster around two practical themes, avoiding overly abstract mathematical puzzles.

1.  **Parentheses & Validation Problems:** This is their absolute favorite. It tests your ability to ensure correctness in sequences—directly analogous to validating an order's items, payment steps, or API call sequences. You'll see variations of checking for balanced parentheses, tags, or symbols.
2.  **Next Greater Element & Monotonic Stack:** The second most common pattern involves finding the next larger or smaller element in an array. This pattern is powerful for problems involving timelines, waiting times, or finding the next available delivery executive for an order. Swiggy often uses it in a moderately complex setting, not just the basic form.

You will almost certainly encounter a problem like **Valid Parentheses (LeetCode #20)** or **Next Greater Element I (LeetCode #496)**. They serve as a foundation. The twist is that Swiggy frequently combines these patterns with another concept, like storing indices or integrating with a hash map.

Here’s the core validation pattern you must have memorized:

<div class="code-group">

```python
def isValid(s: str) -> bool:
    """
    Valid Parentheses pattern.
    Time: O(n) - We traverse the string once.
    Space: O(n) - In the worst case (e.g., '((((('), the stack holds all chars.
    """
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in mapping:  # It's a closing bracket
            # Pop if stack isn't empty, else use a dummy value
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:  # It's an opening bracket
            stack.append(char)

    # Valid only if stack is empty (all opened brackets closed)
    return not stack
```

```javascript
function isValid(s) {
  /**
   * Valid Parentheses pattern.
   * Time: O(n) - We traverse the string once.
   * Space: O(n) - In the worst case, the stack holds all chars.
   */
  const stack = [];
  const mapping = { ")": "(", "}": "{", "]": "[" };

  for (let char of s) {
    if (mapping.hasOwnProperty(char)) {
      // Closing bracket
      const topElement = stack.length > 0 ? stack.pop() : "#";
      if (mapping[char] !== topElement) {
        return false;
      }
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
    /**
     * Valid Parentheses pattern.
     * Time: O(n) - We traverse the string once.
     * Space: O(n) - In the worst case, the stack holds all chars.
     */
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> mapping = new HashMap<>();
    mapping.put(')', '(');
    mapping.put('}', '{');
    mapping.put(']', '[');

    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
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

## How to Prepare

Don't just solve Stack problems; solve them with Swiggy's lens. For every problem, ask: "How could this relate to a delivery or logistics workflow?" When practicing the Next Greater Element pattern, internalize the monotonic stack template. It's a workhorse for O(n) solutions.

The key is to recognize that a "Next Greater" problem can be flipped to "Next Smaller" or applied to the left side ("Previous Greater"). Here is the essential monotonic decreasing stack pattern for finding the next greater element for each item in an array:

<div class="code-group">

```python
def nextGreaterElements(nums):
    """
    Monotonic Stack pattern for Next Greater Element.
    Time: O(n) - Each element is pushed and popped at most once.
    Space: O(n) - For the stack and result array.
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Monotonically decreasing stack storing indices

    for i in range(n):
        # While current element > element at stack's top index
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]  # Current element is next greater for idx
        stack.append(i)
    return result
```

```javascript
function nextGreaterElements(nums) {
  /**
   * Monotonic Stack pattern for Next Greater Element.
   * Time: O(n) - Each element is pushed and popped at most once.
   * Space: O(n) - For the stack and result array.
   */
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // Monotonically decreasing stack storing indices

  for (let i = 0; i < n; i++) {
    // While current element > element at stack's top index
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i]; // Current element is next greater for idx
    }
    stack.push(i);
  }
  return result;
}
```

```java
public int[] nextGreaterElements(int[] nums) {
    /**
     * Monotonic Stack pattern for Next Greater Element.
     * Time: O(n) - Each element is pushed and popped at most once.
     * Space: O(n) - For the stack and result array.
     */
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>(); // Monotonically decreasing stack storing indices

    for (int i = 0; i < n; i++) {
        // While current element > element at stack's top index
        while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
            int idx = stack.pop();
            result[idx] = nums[i]; // Current element is next greater for idx
        }
        stack.push(i);
    }
    return result;
}
```

</div>

## How Swiggy Tests Stack vs Other Companies

At large product-based companies like Google or Meta, Stack problems are often a small part of a larger, multi-step problem involving trees or graphs. At pure tech giants, they might be wrapped in complex parsing or compiler design scenarios.

At Swiggy, the approach is more **pragmatic and directly applicable**. The questions are often standalone and medium difficulty, but they test for _clean implementation and edge-case handling_ under pressure. The interviewer is looking for:

- **Correctness First:** A bug in your parentheses validation logic is a major red flag.
- **Clear Communication:** Can you explain why a stack is the right choice compared to, say, a queue or simple counters?
- **Space & Time Analysis:** You must articulate the complexity, as efficient resource use is crucial in high-throughput delivery systems.

The unique aspect is the "real-world" flavor. A problem might be framed as validating a delivery route sequence or checking for conflicting restaurant promo codes, but underneath, it's a classic stack pattern.

## Study Order

Tackle Stack topics in this order to build a logical progression of skills:

1.  **Basic LIFO Operations & Syntax:** Get comfortable with the `push`, `pop`, and `peek`/`top` operations in your chosen language. This is non-negotiable muscle memory.
2.  **Classic Validation (Parentheses, Tags):** Start with LeetCode #20. This teaches you the core "open push, close pop and match" loop and how to handle early false returns.
3.  **Simple Transformations:** Problems like **Removing All Adjacent Duplicates In String (LeetCode #1047)**. This reinforces using the stack as a _stateful buffer_.
4.  **Monotonic Stack - Next Greater Element:** Learn the basic template (as shown above) with LeetCode #496 and #503. Understand why the stack stays monotonic.
5.  **Combination Problems:** Finally, tackle problems where Stack is one of two key techniques, like **Evaluate Reverse Polish Notation (LeetCode #150)** (Stack + operators) or problems using a stack with a hash map. This is where Swiggy's slightly more complex questions live.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous one.

1.  **Valid Parentheses (#20)** - The absolute foundation.
2.  **Min Stack (#155)** - Teaches you to augment a stack with extra state (tracking the minimum).
3.  **Next Greater Element I (#496)** - Introduction to the monotonic stack pattern.
4.  **Daily Temperatures (#739)** - A superb, classic application of the monotonic stack pattern with a clear real-world analogy (waiting days for warmer temps).
5.  **Evaluate Reverse Polish Notation (#150)** - Combines stack with basic arithmetic, testing your ability to follow an algorithm precisely.

Mastering this progression will make you confident for any Stack question Swiggy throws your way. Remember, they're testing for fundamental, bug-free logic applied to a plausible scenario—not academic cleverness.

[Practice Stack at Swiggy](/company/swiggy/stack)
