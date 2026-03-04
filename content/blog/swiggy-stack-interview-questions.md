---
title: "Stack Questions at Swiggy: What to Expect"
description: "Prepare for Stack interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-02-13"
category: "dsa-patterns"
tags: ["swiggy", "stack", "interview prep"]
---

Stack questions appear in roughly 12% of Swiggy's technical interviews (5 out of 41 total questions). This isn't a trivial portion. For a company managing real-time food delivery logistics, the stack's LIFO (Last-In, First-Out) property is directly applicable to core operations. Think of tracking the sequence of order states (received, assigned, picked up, delivered), validating nested structures like configuration files or API request/response formats, and parsing delivery route instructions. Mastering stack patterns demonstrates you can handle data that needs reversal, delayed processing, or validation of nested order—skills critical for building Swiggy's scalable systems.

## What to Expect — Types of Problems

Swiggy's stack problems typically fall into three practical categories, moving from fundamentals to more complex logic.

1.  **Direct Applications & Syntax Validation:** These are foundational. Expect questions on implementing a stack using arrays/linked lists, or classic problems like checking for balanced parentheses, HTML tags, or JSON-like braces. They test your understanding of the LIFO principle in isolation.
2.  **Monotonic Stack Patterns:** This is a key pattern for Swiggy's domain. Problems involve finding the "next greater element," or the "next smaller element" in a sequence. This translates to real-world scenarios like finding the next available delivery executive for an order based on proximity or calculating spans of time where demand exceeded capacity.
3.  **Stack in Algorithm Execution:** Here, the stack is a tool within a larger algorithm. This includes evaluating postfix expressions (relevant for parsing rules), simulating recursion iteratively for tree traversals (useful for navigating menu or location hierarchies), or maintaining a history/undo feature in an application.

## How to Prepare — Study Tips with One Code Example

Focus on pattern recognition, not memorization. First, ensure you can implement a stack and its core operations (`push`, `pop`, `peek`) from scratch in your chosen language. Then, practice categorizing problems. When you see a problem involving matching pairs, reversal, or next-element comparisons, a stack should be your first instinct.

The most critical pattern to internalize is the **Monotonic Stack**. It's used to solve "Next Greater Element" (NGE) type problems efficiently in O(n) time. The idea is to maintain a stack where elements are in decreasing order (for NGE). As you iterate, you pop from the stack while the current element is greater than the stack's top element—the current element is the "next greater element" for those popped items.

Here is the implementation for the "Next Greater Element" problem for an array:

<div class="code-group">

```python
def nextGreaterElement(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices

    for i in range(n):
        # While stack is not empty and current element > element at stack's top index
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
    return result

# Example: [4, 5, 2, 10] -> [5, 10, 10, -1]
```

```javascript
function nextGreaterElement(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // stores indices

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}

// Example: [4, 5, 2, 10] -> [5, 10, 10, -1]
```

```java
public int[] nextGreaterElement(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
            int idx = stack.pop();
            result[idx] = nums[i];
        }
        stack.push(i);
    }
    return result;
}

// Example: [4, 5, 2, 10] -> [5, 10, 10, -1]
```

</div>

## Recommended Practice Order

Build competence sequentially. Start with basic implementation and classic problems like valid parentheses. Next, master the monotonic stack pattern with Next Greater Element and its variants. Then, tackle problems where the stack is a component, such as evaluating postfix expressions or tree traversal. Finally, solve hybrid problems that combine stacks with other concepts, like the "largest rectangle in histogram," which uses a monotonic stack but requires additional geometric insight. This order ensures you build from the core concept to its sophisticated applications.

[Practice Stack at Swiggy](/company/swiggy/stack)
