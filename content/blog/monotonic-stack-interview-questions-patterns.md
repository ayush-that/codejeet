---
title: "Monotonic Stack Interview Questions: Patterns and Strategies"
description: "Master Monotonic Stack problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-02-06"
category: "dsa-patterns"
tags: ["monotonic-stack", "dsa", "interview prep"]
---

Monotonic Stack Interview Questions: Patterns and Strategies

The monotonic stack is a specialized data structure that maintains elements in a strictly increasing or decreasing order. While it appears in less than 2% of LeetCode problems, its presence is disproportionately high in coding interviews, especially at top tech companies. Why? It elegantly solves a specific class of problems involving finding the next/previous greater/smaller element, calculating areas in histograms, or validating sequences—problems that are perfect for assessing a candidate's ability to recognize non-obvious data structure applications. Mastering this pattern can turn a seemingly hard problem into a systematic traversal.

## Common Patterns

The core principle is maintaining a stack where elements are ordered (monotonic) as you process a sequence. You typically push indices onto the stack, and before pushing a new element, you pop from the stack to preserve the monotonic order. This popping step is where the "work" or calculation happens.

**Pattern 1: Next Greater Element**
This is the foundational pattern. For each element, find the next element in the array that is greater than it.

<div class="code-group">

```python
def nextGreaterElement(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices

    for i in range(n):
        # While stack not empty and current element > element at stack's top index
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
    return result
```

```javascript
function nextGreaterElement(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // stores indices

  for (let i = 0; i < n; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}
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
```

</div>

**Pattern 2: Monotonic Increasing Stack for Previous Smaller Element**
Flip the logic to maintain an increasing stack and find the previous smaller element for each index. This is crucial for problems like "Largest Rectangle in Histogram."

<div class="code-group">

```python
def previousSmallerElement(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices

    for i in range(n):
        # Maintain strictly increasing stack
        while stack and nums[stack[-1]] >= nums[i]:
            stack.pop()
        result[i] = nums[stack[-1]] if stack else -1
        stack.append(i)
    return result
```

```javascript
function previousSmallerElement(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = [];

  for (let i = 0; i < n; i++) {
    while (stack.length && nums[stack[stack.length - 1]] >= nums[i]) {
      stack.pop();
    }
    result[i] = stack.length ? nums[stack[stack.length - 1]] : -1;
    stack.push(i);
  }
  return result;
}
```

```java
public int[] previousSmallerElement(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] >= nums[i]) {
            stack.pop();
        }
        result[i] = stack.isEmpty() ? -1 : nums[stack.peek()];
        stack.push(i);
    }
    return result;
}
```

</div>

**Pattern 3: Circular Array Traversal**
A common twist is applying the pattern to circular arrays (where the "next" element wraps around). The standard technique is to simulate a doubled array by iterating `2 * n` times and using the modulo operator `i % n`.

## Difficulty Breakdown

Our dataset of 54 questions shows a telling split: **Easy: 2 (4%), Medium: 31 (57%), Hard: 21 (39%)**. This distribution reveals the pattern's nature. The core concept is simple (hence few Easy problems), but its application is almost always layered with other challenges. Medium problems typically require one clear insight using the stack. Hard problems often combine the monotonic stack with other techniques like dynamic programming ("Largest Rectangle in Histogram"), greedy algorithms, or complex state tracking. The high percentage of Hard problems means interviewers use this pattern to differentiate senior candidates.

## Which Companies Ask Monotonic Stack

This topic is a favorite at companies known for demanding algorithmic interviews. The top askers are:

- [Google](/company/google)
- [Amazon](/company/amazon)
- [Meta](/company/meta)
- [Bloomberg](/company/bloomberg)
- [Microsoft](/company/microsoft)

At these companies, a monotonic stack question is rarely a standalone easy problem. It is often part of a more complex system design discussion (e.g., designing a stack-based data structure like MinStack) or the optimal solution for a tricky array-processing challenge.

## Study Tips

1.  **Internalize the Popping Logic:** Don't just memorize code. Understand that when you pop from the stack while maintaining monotonicity, you are resolving a relationship (e.g., "I have found the next greater element for the popped index").
2.  **Practice the Variations Methodically:** Start with the classic "Next Greater Element I." Then move to "Daily Temperatures" (same pattern, stores differences). Then tackle "Largest Rectangle in Histogram" (uses both previous smaller and next smaller). This builds complexity logically.
3.  **Draw the Stack State:** For any new problem, manually draw the array and step through the algorithm, sketching the stack's contents at each step. This visual debugging is invaluable.
4.  **Recognize the Problem Keywords:** When a problem description includes phrases like "next greater," "previous smaller," "maintain a boundary," or "contiguous subarray satisfying a condition," immediately consider if a monotonic stack could help.

The most effective way to master this pattern is through targeted, progressive practice.

[Practice all Monotonic Stack questions on CodeJeet](/topic/monotonic-stack)
