---
title: "How to Solve Mini Parser — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Mini Parser. Medium difficulty, 42.0% acceptance rate. Topics: String, Stack, Depth-First Search."
date: "2028-01-11"
category: "dsa-patterns"
tags: ["mini-parser", "string", "stack", "depth-first-search", "medium"]
---

# How to Solve Mini Parser

This problem asks you to parse a string representing a nested list structure and convert it into a `NestedInteger` object. The tricky part is that the string can contain arbitrarily nested lists with integers, requiring careful handling of brackets, commas, and negative numbers. What makes this interesting is that it's essentially implementing a simplified JSON parser for a specific data structure, testing your understanding of recursion, stack operations, and string parsing.

## Visual Walkthrough

Let's trace through parsing `"[123,[456,[789]]]"` step by step:

1. **Start**: We encounter `[` → create a new NestedInteger list
2. **Parse `123`**: Read digits `1`, `2`, `3` → convert to integer 123 → add to current list
3. **Comma**: Skip, move to next character
4. **`[`**: Create new nested list → this becomes a child of our current list
5. **Parse `456`**: Read digits → integer 456 → add to child list
6. **Comma**: Skip
7. **`[`**: Create another nested list → child of the previous child list
8. **Parse `789`**: Read digits → integer 789 → add to innermost list
9. **`]`**: Close innermost list
10. **`]`**: Close middle list
11. **`]`**: Close outermost list

The key insight is that every time we see `[`, we're starting a new list that needs to be added to the current context. Every `]` means we're done with the current list and should return to the parent context.

## Brute Force Approach

A naive approach might try to manually parse everything with complex string manipulation and condition checking. For example:

1. Remove all brackets and split by commas
2. Try to reconstruct the nesting structure from the original string indices

This fails because:

- You lose the nesting information when you remove brackets
- Negative numbers and multi-digit integers become problematic
- Empty lists `[]` are impossible to handle correctly
- The relationship between elements and their parent lists is destroyed

The brute force approach would require tracking bracket positions and trying to match opening and closing brackets, then recursively parsing substrings. This leads to messy index arithmetic and edge case handling that's prone to errors.

## Optimized Approach

The key insight is that this is a **recursive parsing problem** that can be solved elegantly with either:

1. **Recursion with index tracking** - Parse recursively, returning both the parsed NestedInteger and the new index position
2. **Stack-based iterative parsing** - Use a stack to maintain the current nesting context

The stack approach is particularly intuitive:

- When you see `[`, create a new NestedInteger list and push it onto the stack
- When you see a number (which could be negative), parse all consecutive digits
- When you see `,`, if there's a number being parsed, add it to the current list
- When you see `]`, finalize any number being parsed, pop from stack, and add the completed list to its parent

The stack naturally handles the nesting: the top of the stack is always the list we're currently adding elements to.

## Optimal Solution

Here's the stack-based solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is length of string - we process each character once
# Space: O(d) where d is maximum nesting depth for the stack
class Solution:
    def deserialize(self, s: str) -> NestedInteger:
        # If the string doesn't start with '[', it's just a single integer
        if s[0] != '[':
            return NestedInteger(int(s))

        stack = []
        current_num = None  # Store digits of current number being parsed
        is_negative = False  # Track if current number is negative

        for char in s:
            if char == '[':
                # Start of a new list - create NestedInteger and push to stack
                new_list = NestedInteger()
                if stack:
                    # If there's a parent list, add this new list to it
                    stack[-1].add(new_list)
                stack.append(new_list)
            elif char == '-':
                # Negative sign for upcoming number
                is_negative = True
            elif char.isdigit():
                # Build the current number digit by digit
                current_num = (current_num or 0) * 10 + int(char)
            elif char == ',' or char == ']':
                # End of a number or list
                if current_num is not None:
                    # We've finished parsing a number
                    num = -current_num if is_negative else current_num
                    if stack:
                        stack[-1].add(NestedInteger(num))
                    # Reset number tracking
                    current_num = None
                    is_negative = False

                if char == ']':
                    # End of current list - pop from stack
                    completed_list = stack.pop()
                    if not stack:
                        # If stack is empty, this is the outermost list
                        return completed_list
            # Note: we ignore other characters (shouldn't exist in valid input)

        # Should never reach here for valid input
        return stack[-1] if stack else NestedInteger()
```

```javascript
// Time: O(n) where n is length of string
// Space: O(d) where d is maximum nesting depth
/**
 * // This is the interface that allows for creating nested lists.
 * // You should not implement it, or speculate about its implementation
 * function NestedInteger() {
 *
 *     Return true if this NestedInteger holds a single integer, rather than a nested list.
 *     @return {boolean}
 *     this.isInteger = function() {
 *         ...
 *     };
 *
 *     Return the single integer that this NestedInteger holds, if it holds a single integer
 *     Return null if this NestedInteger holds a nested list
 *     @return {integer}
 *     this.getInteger = function() {
 *         ...
 *     };
 *
 *     Set this NestedInteger to hold a single integer.
 *     @return {void}
 *     this.setInteger = function(value) {
 *         ...
 *     };
 *
 *     Set this NestedInteger to hold a nested list and adds a nested integer to it.
 *     @return {void}
 *     this.add = function(elem) {
 *         ...
 *     };
 *
 *     Return the nested list that this NestedInteger holds, if it holds a nested list
 *     Return null if this NestedInteger holds a single integer
 *     @return {NestedInteger[]}
 *     this.getList = function() {
 *         ...
 *     };
 * };
 */
/**
 * @param {string} s
 * @return {NestedInteger}
 */
var deserialize = function (s) {
  // Handle single integer case (no brackets)
  if (s[0] !== "[") {
    return new NestedInteger(parseInt(s));
  }

  const stack = [];
  let currentNum = null;
  let isNegative = false;

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char === "[") {
      // Start new nested list
      const newList = new NestedInteger();
      if (stack.length > 0) {
        // Add to parent list if exists
        stack[stack.length - 1].add(newList);
      }
      stack.push(newList);
    } else if (char === "-") {
      // Mark next number as negative
      isNegative = true;
    } else if (char >= "0" && char <= "9") {
      // Build current number
      currentNum = (currentNum || 0) * 10 + parseInt(char);
    } else if (char === "," || char === "]") {
      // End of number or list
      if (currentNum !== null) {
        const num = isNegative ? -currentNum : currentNum;
        if (stack.length > 0) {
          stack[stack.length - 1].add(new NestedInteger(num));
        }
        // Reset for next number
        currentNum = null;
        isNegative = false;
      }

      if (char === "]") {
        // End of current list
        const completedList = stack.pop();
        if (stack.length === 0) {
          // This was the outermost list
          return completedList;
        }
      }
    }
    // Ignore other characters
  }

  // Should not reach here for valid input
  return stack.length > 0 ? stack[stack.length - 1] : new NestedInteger();
};
```

```java
// Time: O(n) where n is length of string
// Space: O(d) where d is maximum nesting depth
/**
 * // This is the interface that allows for creating nested lists.
 * // You should not implement it, or speculate about its implementation
 * public interface NestedInteger {
 *     // Constructor initializes an empty nested list.
 *     public NestedInteger();
 *
 *     // Constructor initializes a single integer.
 *     public NestedInteger(int value);
 *
 *     // @return true if this NestedInteger holds a single integer, rather than a nested list.
 *     public boolean isInteger();
 *
 *     // @return the single integer that this NestedInteger holds, if it holds a single integer
 *     // Return null if this NestedInteger holds a nested list
 *     public Integer getInteger();
 *
 *     // Set this NestedInteger to hold a single integer.
 *     public void setInteger(int value);
 *
 *     // Set this NestedInteger to hold a nested list and adds a nested integer to it.
 *     public void add(NestedInteger ni);
 *
 *     // @return the nested list that this NestedInteger holds, if it holds a nested list
 *     // Return null if this NestedInteger holds a single integer
 *     public List<NestedInteger> getList();
 * }
 */
public class Solution {
    public NestedInteger deserialize(String s) {
        // Handle case where input is just a single integer
        if (s.charAt(0) != '[') {
            return new NestedInteger(Integer.parseInt(s));
        }

        Stack<NestedInteger> stack = new Stack<>();
        Integer currentNum = null;
        boolean isNegative = false;

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            if (c == '[') {
                // Start of a new nested list
                NestedInteger newList = new NestedInteger();
                if (!stack.isEmpty()) {
                    // Add to parent list if it exists
                    stack.peek().add(newList);
                }
                stack.push(newList);
            } else if (c == '-') {
                // Next number will be negative
                isNegative = true;
            } else if (Character.isDigit(c)) {
                // Build the current number digit by digit
                currentNum = (currentNum == null ? 0 : currentNum) * 10 + (c - '0');
            } else if (c == ',' || c == ']') {
                // End of a number or end of a list
                if (currentNum != null) {
                    int num = isNegative ? -currentNum : currentNum;
                    if (!stack.isEmpty()) {
                        stack.peek().add(new NestedInteger(num));
                    }
                    // Reset for next number
                    currentNum = null;
                    isNegative = false;
                }

                if (c == ']') {
                    // End of current list
                    NestedInteger completedList = stack.pop();
                    if (stack.isEmpty()) {
                        // This was the outermost list
                        return completedList;
                    }
                }
            }
            // Ignore other characters
        }

        // Should not reach here for valid input
        return stack.isEmpty() ? new NestedInteger() : stack.peek();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character in the input string exactly once
- Each character triggers at most a constant amount of work (pushing/popping from stack, updating variables)
- Even though we have nested structures, we don't re-process any characters

**Space Complexity: O(d)**

- `d` is the maximum nesting depth of the input
- The stack stores one NestedInteger per nesting level
- In the worst case (e.g., `[[[[[...]]]]]`), the stack depth equals the nesting depth
- Additional O(1) space for variables like `current_num` and `is_negative`

## Common Mistakes

1. **Not handling negative numbers correctly**: Forgetting that `-` could be part of a number (e.g., `-123`) rather than a separator. Solution: When you see `-`, set a flag and include it when building the number.

2. **Forgetting to reset number state after adding**: After adding a number to the current list, you must reset `current_num` to `None/null` and `is_negative` to `false`. Otherwise, the next number might incorrectly incorporate digits from the previous number.

3. **Incorrect handling of empty lists**: `[]` is a valid input representing an empty list. The code should create an empty NestedInteger when it sees `[` and handle the immediate `]` without trying to add any numbers.

4. **Not handling single integers separately**: Input like `"123"` (without brackets) should return a NestedInteger containing just that integer. Check for this case first before starting the main parsing loop.

## When You'll See This Pattern

This stack-based parsing pattern appears in several types of problems:

1. **Expression parsing** - Problems like [Basic Calculator](https://leetcode.com/problems/basic-calculator/) and [Ternary Expression Parser](https://leetcode.com/problems/ternary-expression-parser/) use similar techniques to handle nested structures and operator precedence.

2. **JSON/XML parsing** - Any problem involving parsing structured text with nested elements (like [Mini Parser](https://leetcode.com/problems/mini-parser/) itself) uses this approach.

3. **Nested structure traversal** - [Flatten Nested List Iterator](https://leetcode.com/problems/flatten-nested-list-iterator/) is essentially the inverse problem: instead of building the structure, you're traversing an already-built one.

The core pattern is: **use a stack to maintain context when processing nested or recursive structures**, pushing when you go deeper and popping when you return to a higher level.

## Key Takeaways

1. **Stack for nested context**: When you need to track where you are in a nested structure (brackets, parentheses, tags), a stack is the natural data structure. Each push represents going one level deeper; each pop represents returning to the previous level.

2. **State machine parsing**: This problem is essentially implementing a simple state machine that transitions between "parsing a number", "starting a list", and "ending a list" states. Clear state variables (`current_num`, `is_negative`) make the logic manageable.

3. **Edge cases matter**: Single integers, negative numbers, empty lists, and deeply nested structures all need to be handled. Always test these boundary cases when designing your solution.

Related problems: [Flatten Nested List Iterator](/problem/flatten-nested-list-iterator), [Ternary Expression Parser](/problem/ternary-expression-parser), [Remove Comments](/problem/remove-comments)
