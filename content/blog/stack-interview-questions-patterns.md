---
title: "Stack Interview Questions: Patterns and Strategies"
description: "Master Stack problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-04-04"
category: "dsa-patterns"
tags: ["stack", "dsa", "interview prep"]
---

# Stack Interview Questions: Patterns and Strategies

You're solving a seemingly straightforward problem about validating parentheses when the interviewer casually asks, "Now do it for HTML tags." Suddenly, you realize this isn't just about matching '(' with ')' — you need to track opening and closing tags in a specific order, handle nested structures, and ensure everything closes properly. This is where candidates who only memorized the parentheses solution get stuck, while those who understand stacks as a fundamental data structure for tracking state transitions excel.

Stacks appear in 140 LeetCode questions, with a telling distribution: only 16% are Easy, while 56% are Medium and 28% are Hard. This tells us something important — interviewers don't just ask stack basics; they layer complexity onto stack patterns to test deeper problem-solving skills. The companies that ask them most? Google, Amazon, Meta, Microsoft, and Bloomberg — precisely because stacks model so many real-world computing scenarios from browser navigation to function calls to undo operations.

## Common Patterns

### Pattern 1: Next Greater/Smaller Element

This pattern solves problems where you need to find the next element in an array that satisfies some condition relative to the current element. The brute force O(n²) approach compares each element with all subsequent elements, but the stack solution achieves O(n) by maintaining elements in decreasing (or increasing) order.

**Key intuition**: When processing elements left to right, if the current element is greater than the element at the top of the stack, we've found the "next greater element" for that stack element. We can process it immediately rather than storing it for later comparisons.

<div class="code-group">

```python
def nextGreaterElements(nums):
    """
    Find the next greater element for each element in the array.
    For elements with no greater element, use -1.

    Time: O(n) - Each element pushed and popped at most once
    Space: O(n) - Stack can hold up to n elements in worst case
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Stores indices of elements waiting for their next greater

    for i in range(n):
        # While current element > element at top of stack
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)

    return result
```

```javascript
function nextGreaterElements(nums) {
  /**
   * Find the next greater element for each element in the array.
   * For elements with no greater element, use -1.
   *
   * Time: O(n) - Each element pushed and popped at most once
   * Space: O(n) - Stack can hold up to n elements in worst case
   */
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // Stores indices of elements waiting for their next greater

  for (let i = 0; i < n; i++) {
    // While current element > element at top of stack
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
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
    /**
     * Find the next greater element for each element in the array.
     * For elements with no greater element, use -1.
     *
     * Time: O(n) - Each element pushed and popped at most once
     * Space: O(n) - Stack can hold up to n elements in worst case
     */
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();  // Stores indices

    for (int i = 0; i < n; i++) {
        // While current element > element at top of stack
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

**Related problems**: Next Greater Element I (#496), Daily Temperatures (#739), Next Greater Element II (#503 — circular array variation)

### Pattern 2: Monotonic Stack for Constrained Problems

Monotonic stacks maintain elements in strictly increasing or decreasing order. This pattern excels at problems with constraints like "remove k digits to get smallest number" or "largest rectangle in histogram."

**Key intuition**: When you need to maintain some ordering property while potentially removing elements based on constraints, a monotonic stack lets you make local optimal decisions that lead to a global optimum.

<div class="code-group">

```python
def removeKdigits(num, k):
    """
    Remove k digits from num to get the smallest possible number.

    Time: O(n) - Each digit processed once
    Space: O(n) - Stack stores remaining digits
    """
    stack = []

    for digit in num:
        # While we can remove digits (k > 0) and removing improves the number
        while k > 0 and stack and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)

    # Remove remaining k digits from end if needed
    stack = stack[:-k] if k > 0 else stack

    # Remove leading zeros and handle empty result
    result = ''.join(stack).lstrip('0')
    return result if result else '0'
```

```javascript
function removeKdigits(num, k) {
  /**
   * Remove k digits from num to get the smallest possible number.
   *
   * Time: O(n) - Each digit processed once
   * Space: O(n) - Stack stores remaining digits
   */
  const stack = [];

  for (let digit of num) {
    // While we can remove digits (k > 0) and removing improves the number
    while (k > 0 && stack.length > 0 && stack[stack.length - 1] > digit) {
      stack.pop();
      k--;
    }
    stack.push(digit);
  }

  // Remove remaining k digits from end if needed
  stack.length = stack.length - k;

  // Remove leading zeros and handle empty result
  let result = stack.join("").replace(/^0+/, "");
  return result || "0";
}
```

```java
public String removeKdigits(String num, int k) {
    /**
     * Remove k digits from num to get the smallest possible number.
     *
     * Time: O(n) - Each digit processed once
     * Space: O(n) - Stack stores remaining digits
     */
    Deque<Character> stack = new ArrayDeque<>();

    for (char digit : num.toCharArray()) {
        // While we can remove digits (k > 0) and removing improves the number
        while (k > 0 && !stack.isEmpty() && stack.peek() > digit) {
            stack.pop();
            k--;
        }
        stack.push(digit);
    }

    // Remove remaining k digits from end if needed
    while (k > 0) {
        stack.pop();
        k--;
    }

    // Build result and remove leading zeros
    StringBuilder result = new StringBuilder();
    while (!stack.isEmpty()) {
        result.append(stack.pop());
    }
    result.reverse();

    // Remove leading zeros
    while (result.length() > 1 && result.charAt(0) == '0') {
        result.deleteCharAt(0);
    }

    return result.length() == 0 ? "0" : result.toString();
}
```

</div>

**Related problems**: Remove K Digits (#402), Largest Rectangle in Histogram (#84), Trapping Rain Water (#42 — though this also uses two pointers)

### Pattern 3: Stack for State Machine/Validation

This pattern uses stacks to track state transitions, like matching parentheses, validating HTML, or checking if a string has valid nested operations.

**Key intuition**: When you need to ensure operations happen in a specific nested order (last opened, first closed), a stack naturally models this LIFO behavior. Each opening "pushes" a state, and each closing must match the most recent opening.

<div class="code-group">

```python
def isValid(s):
    """
    Check if parentheses/brackets/braces are properly matched.

    Time: O(n) - Process each character once
    Space: O(n) - Stack could hold all opening symbols in worst case
    """
    mapping = {')': '(', ']': '[', '}': '{'}
    stack = []

    for char in s:
        if char in mapping.values():  # Opening symbol
            stack.append(char)
        elif char in mapping:  # Closing symbol
            if not stack or stack[-1] != mapping[char]:
                return False
            stack.pop()
        # Ignore other characters in some problem variations

    return not stack  # Valid if stack is empty (all opened were closed)
```

```javascript
function isValid(s) {
  /**
   * Check if parentheses/brackets/braces are properly matched.
   *
   * Time: O(n) - Process each character once
   * Space: O(n) - Stack could hold all opening symbols in worst case
   */
  const mapping = { ")": "(", "]": "[", "}": "{" };
  const stack = [];

  for (let char of s) {
    if (["(", "[", "{"].includes(char)) {
      // Opening symbol
      stack.push(char);
    } else if (char in mapping) {
      // Closing symbol
      if (stack.length === 0 || stack[stack.length - 1] !== mapping[char]) {
        return false;
      }
      stack.pop();
    }
    // Ignore other characters in some problem variations
  }

  return stack.length === 0; // Valid if stack is empty
}
```

```java
public boolean isValid(String s) {
    /**
     * Check if parentheses/brackets/braces are properly matched.
     *
     * Time: O(n) - Process each character once
     * Space: O(n) - Stack could hold all opening symbols in worst case
     */
    Map<Character, Character> mapping = new HashMap<>();
    mapping.put(')', '(');
    mapping.put(']', '[');
    mapping.put('}', '{');

    Deque<Character> stack = new ArrayDeque<>();

    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {  // Opening symbol
            stack.push(c);
        } else if (mapping.containsKey(c)) {  // Closing symbol
            if (stack.isEmpty() || stack.peek() != mapping.get(c)) {
                return false;
            }
            stack.pop();
        }
        // Ignore other characters in some problem variations
    }

    return stack.isEmpty();  // Valid if stack is empty
}
```

</div>

**Related problems**: Valid Parentheses (#20), Decode String (#394), Minimum Remove to Make Valid Parentheses (#1249)

## When to Use Stack vs Alternatives

Recognizing stack problems is half the battle. Here's how to distinguish them from similar patterns:

**Stack vs Recursion**: Both handle nested structures, but use recursion when the problem definition is inherently recursive (tree traversals, divide-and-conquer) and stack when you need explicit control over the order of operations or when recursion depth could be problematic. Example: Tree inorder traversal can be done recursively (O(n) space for call stack) or with an explicit stack (also O(n) but more control).

**Stack vs Two Pointers**: For problems like "trapping rain water" (#42), both approaches work. Use two pointers when you can make decisions based on both ends of the array simultaneously. Use stack when you need to remember a sequence of elements to process later based on future elements.

**Stack vs Queue**: Stacks are LIFO (last in, first out) while queues are FIFO (first in, first out). Use stacks for reversal operations, nested validations, and "most recent" tracking. Use queues for level-order traversals, caching (LRU), and "first come, first served" scenarios.

**Decision criteria**: Ask yourself:

1. Do I need to process elements in reverse order of encountering them?
2. Do I need to match each element with the most recent unmatched element?
3. Do I need to maintain elements in sorted order while allowing efficient additions/removals?
4. Is the problem about nested structures or hierarchical relationships?

If you answer yes to any of these, consider a stack.

## Edge Cases and Gotchas

1. **Empty input**: Always check if the input string or array is empty. For validation problems, an empty string is often valid. For next greater element problems, return an empty array.

2. **Single element**: With one element, there's no "next" element. Handle this explicitly in your logic rather than letting it flow through general case logic that might fail.

3. **All elements equal**: In monotonic stack problems, equal elements can break your comparison logic. Decide whether to use strict (`>`) or non-strict (`>=`) comparisons based on the problem requirements. For "next greater element," you typically want strict greater, so equal elements don't count.

4. **Circular arrays**: Problems like Next Greater Element II (#503) require wrapping around. The trick is to traverse the array twice (2n iterations) but use modulo indexing to simulate circular behavior while still using a single pass algorithmically.

5. **Memory overflow with recursion**: When a recursive solution would cause stack overflow (like deep nesting in Decode String #394), an explicit stack avoids this limitation since heap memory is typically larger than stack memory.

6. **Time complexity traps**: The naive stack solution might be O(n²) if implemented poorly. Ensure each element is pushed and popped at most once for O(n) time. If you're doing nested loops over the stack, you're probably doing it wrong.

## Difficulty Breakdown

The distribution (23 Easy, 78 Medium, 39 Hard) reveals the interview reality: companies test stack concepts at Medium difficulty most often. Here's what this means for your preparation:

**Easy problems** (16%): Master these first. They're usually direct applications of stack patterns like Valid Parentheses (#20) or implementing basic stack operations. If you can't solve these in under 10 minutes, you're not ready for interviews.

**Medium problems** (56%): This is where interviews actually happen. These combine stack patterns with other concepts: monotonic stacks with constraints, stacks with hash maps for lookups, or stacks for parsing expressions. Spend 70% of your time here.

**Hard problems** (28%): These often involve multiple data structures or complex state tracking. While important for Google/Facebook top-tier interviews, prioritize Medium mastery first. Hard problems test if you can adapt stack patterns to novel situations.

## Which Companies Ask Stack

**Google** (/company/google): Loves stack problems that model real systems — think browser history, file system navigation, or expression evaluation. They often combine stacks with other concepts in multi-part problems.

**Amazon** (/company/amazon): Frequently asks stack problems in their online assessment and final rounds. They prefer practical applications like parsing log files, validating sequences, or solving optimization problems with monotonic stacks.

**Meta** (/company/meta): Asks stack problems for validating nested structures (HTML/XML parsing in disguise) and for optimizing feed algorithms. Their problems often have clean stack solutions that look elegant when coded correctly.

**Microsoft** (/company/microsoft): Tends toward classic computer science applications of stacks — expression evaluation, compiler-related problems, and undo/redo functionality. They appreciate candidates who can explain the theoretical basis.

**Bloomberg** (/company/bloomberg): Asks stack problems related to financial data processing, like finding next greater prices or validating transaction sequences. Their problems often involve processing streaming data with stacks.

## Study Tips

1. **Pattern-first, not problem-first**: Don't just solve random stack problems. Group them by pattern (next greater element, monotonic stack, validation) and solve 3-5 of each type consecutively. This builds pattern recognition muscle memory.

2. **Recommended problem order**:
   - Start: Valid Parentheses (#20), Min Stack (#155)
   - Next Greater: Daily Temperatures (#739), Next Greater Element I (#496)
   - Monotonic: Remove K Digits (#402), Largest Rectangle in Histogram (#84)
   - Advanced: Decode String (#394), Basic Calculator (#224)

3. **Draw it out**: Before coding, draw the stack operations for sample inputs. Use arrows to show pushes and pops. This visualization step catches logical errors before you write a line of code.

4. **Implement from scratch**: Practice implementing stack classes in your language of choice. Know the tradeoffs between using built-in structures (Python list, JavaScript array, Java Deque) versus custom implementations.

5. **Time-box hard problems**: If you're stuck on a Hard problem for more than 45 minutes, look at the solution. The insight is usually a clever adaptation of a Medium pattern, not something you'd invent in an interview setting.

Remember: Stacks are fundamentally about managing state in a LIFO order. When you encounter a problem involving nested structures, reversals, or "most recent" relationships, think stack. The companies asking these problems aren't testing if you know what a stack is — they're testing if you recognize when to use one.

[Practice all Stack questions on CodeJeet](/topic/stack)
