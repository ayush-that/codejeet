---
title: "Stack Questions at Deloitte: What to Expect"
description: "Prepare for Stack interview questions at Deloitte — patterns, difficulty breakdown, and study tips."
date: "2030-03-27"
category: "dsa-patterns"
tags: ["deloitte", "stack", "interview prep"]
---

## Why Stack Matters at Deloitte

Deloitte's technical interviews for software engineering roles often include a mix of data structure questions, with Stack appearing in about 8% of their problem set (3 out of 38 questions). While not as dominant as arrays or strings, Stack is a critical secondary topic that serves as a gateway to more complex concepts. In real interviews, you're more likely to encounter Stack as a component of a larger problem rather than a standalone "implement a stack" question. Deloitte frequently uses Stack problems to assess your ability to handle nested structures, track state, and solve problems with clear LIFO (Last-In-First-Out) logic. Missing a Stack pattern when it's the optimal solution is often an automatic rejection, so recognizing these patterns is essential.

## Specific Patterns Deloitte Favors

Deloitte's Stack questions tend to fall into three specific categories:

1. **Parentheses/Expression Validation** - Classic problems involving matching brackets, validating nested structures, or evaluating expressions. These test basic Stack understanding.
2. **Monotonic Stack** - Problems where you need to find the next greater/smaller element or maintain increasing/decreasing sequences. This is their most frequent advanced Stack pattern.
3. **Stack with State Tracking** - Problems where Stack stores not just values but additional state information, often combined with other operations.

They rarely ask pure Stack implementation questions. Instead, they embed Stack logic within business-like scenarios. For example, instead of "validate parentheses," you might get "validate nested configuration blocks" or "check proper event sequencing."

## How to Prepare

The key to Deloitte's Stack questions is recognizing when to use monotonic stack. Let's examine the most common pattern: finding the next greater element.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def nextGreaterElements(nums):
    """
    For each element, find the next greater element to its right.
    Returns -1 if no greater element exists.
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Monotonic decreasing stack storing indices

    for i in range(n):
        # While current element is greater than stack's top element
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)

    return result

# Example: [2,1,5,3,4] -> [5,5,-1,4,-1]
```

```javascript
// Time: O(n) | Space: O(n)
function nextGreaterElements(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // Monotonic decreasing stack storing indices

  for (let i = 0; i < n; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }

  return result;
}

// Example: [2,1,5,3,4] -> [5,5,-1,4,-1]
```

```java
// Time: O(n) | Space: O(n)
public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>(); // Monotonic decreasing stack

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
            int idx = stack.pop();
            result[idx] = nums[i];
        }
        stack.push(i);
    }

    return result;
}

// Example: [2,1,5,3,4] -> [5,5,-1,4,-1]
```

</div>

Another common variation is the parentheses validation pattern, which often appears in modified forms:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def isValidNestedStructure(s, pairs):
    """
    Generalized validation for any nested structure.
    pairs: dict mapping closing symbols to opening symbols
    """
    stack = []

    for char in s:
        if char in pairs.values():  # Opening symbol
            stack.append(char)
        elif char in pairs:  # Closing symbol
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()

    return len(stack) == 0

# Example: Validate HTML-like tags
# pairs = {'</div>': '<div>', '</p>': '<p>'}
```

```javascript
// Time: O(n) | Space: O(n)
function isValidNestedStructure(s, pairs) {
  const stack = [];

  for (const char of s) {
    // Check if char is an opening symbol
    if (Object.values(pairs).includes(char)) {
      stack.push(char);
    } else if (char in pairs) {
      // Closing symbol
      if (!stack.length || stack[stack.length - 1] !== pairs[char]) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
}

// Example: Validate configuration blocks
// pairs = {']': '[', '}': '{'}
```

```java
// Time: O(n) | Space: O(n)
public boolean isValidNestedStructure(String s, Map<Character, Character> pairs) {
    Deque<Character> stack = new ArrayDeque<>();

    for (char c : s.toCharArray()) {
        if (pairs.containsValue(c)) { // Opening symbol
            stack.push(c);
        } else if (pairs.containsKey(c)) { // Closing symbol
            if (stack.isEmpty() || stack.peek() != pairs.get(c)) {
                return false;
            }
            stack.pop();
        }
    }

    return stack.isEmpty();
}

// Example: Validate nested function calls
// pairs = put(')', '(')
```

</div>

## How Deloitte Tests Stack vs Other Companies

Deloitte's Stack questions differ from FAANG companies in several ways:

1. **Less Theoretical, More Applied** - While Google might ask about Stack in distributed systems or Facebook might test Stack for UI rendering, Deloitte typically presents Stack problems in business contexts: validating document structures, processing event streams, or checking workflow dependencies.

2. **Moderate Difficulty** - Deloitte's Stack questions are usually LeetCode Medium level, rarely reaching Hard. They test pattern recognition more than complex algorithm design. In contrast, companies like Amazon might combine Stack with dynamic programming for Hard-level problems.

3. **Clear Business Analogy** - Problems often come with a business scenario wrapper. Instead of "evaluate reverse polish notation," you might get "calculate the result of our custom business rule language."

4. **Partial Credit Matters** - Deloitte interviewers often look for incremental progress. Even if you don't optimize to O(n) with monotonic stack, getting an O(n²) solution working can earn partial credit if you explain the tradeoffs.

## Study Order

1. **Basic Stack Operations** - Start with push/pop/peek implementations and simple applications. Understand LIFO behavior intuitively.
2. **Parentheses Validation** - Learn the classic pattern (LeetCode #20: Valid Parentheses). This establishes the fundamental "matching" use case.

3. **Expression Evaluation** - Study infix to postfix conversion and RPN evaluation (LeetCode #150: Evaluate Reverse Polish Notation). This builds on validation with computation.

4. **Monotonic Stack Fundamentals** - Master next greater element problems (LeetCode #496: Next Greater Element I). This is Deloitte's most tested advanced pattern.

5. **Stack with State Tracking** - Practice problems where Stack stores tuples or objects (LeetCode #739: Daily Temperatures). This prepares you for Deloitte's business scenario variations.

6. **Stack in Larger Algorithms** - Finally, understand how Stack enables DFS and certain DP solutions, though these appear less frequently at Deloitte.

This order works because each concept builds on the previous one. You can't recognize monotonic stack patterns without understanding basic Stack behavior, and you can't handle state tracking without mastering monotonic fundamentals.

## Recommended Practice Order

1. **LeetCode #20: Valid Parentheses** - The absolute foundation
2. **LeetCode #155: Min Stack** - Teaches Stack with auxiliary data
3. **LeetCode #232: Implement Queue using Stacks** - Tests understanding of Stack properties
4. **LeetCode #496: Next Greater Element I** - Introduction to monotonic stack
5. **LeetCode #739: Daily Temperatures** - Classic monotonic stack application
6. **LeetCode #853: Car Fleet** - Stack with sorting and business logic (similar to Deloitte problems)
7. **LeetCode #84: Largest Rectangle in Histogram** - Advanced monotonic stack (if you have time)
8. **LeetCode #394: Decode String** - Stack with state tracking and string manipulation

Focus on problems 1-6 for Deloitte preparation. Problems 7-8 are bonus if you have extra time, but the first six cover 95% of what you'll encounter.

Remember: Deloitte's Stack questions test whether you can identify the appropriate data structure for a problem with nested or sequential dependencies. Practice recognizing the patterns, not just memorizing solutions.

[Practice Stack at Deloitte](/company/deloitte/stack)
