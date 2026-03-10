---
title: "How to Solve Basic Calculator — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Basic Calculator. Hard difficulty, 46.6% acceptance rate. Topics: Math, String, Stack, Recursion."
date: "2027-01-27"
category: "dsa-patterns"
tags: ["basic-calculator", "math", "string", "stack", "hard"]
---

# How to Solve Basic Calculator

The Basic Calculator problem asks you to evaluate a mathematical expression string containing numbers, parentheses, plus signs, minus signs, and spaces. The expression is guaranteed to be valid, but you cannot use built-in evaluation functions like `eval()`. What makes this problem tricky is handling parentheses correctly—they change the order of operations and can invert signs when combined with negative numbers.

## Visual Walkthrough

Let's trace through the example `"(1+(4+5+2)-3)+(6+8)"`:

1. We start scanning from left to right
2. When we see `(`, we push the current result and sign onto the stack
3. Inside the first parentheses: `1+(4+5+2)-3`
   - Process `1`: result = 1
   - `+`: sign = 1
   - `(`: push result=1 and sign=1, reset result=0, sign=1
   - Inside inner parentheses: `4+5+2`
     - Process `4`: result = 4
     - `+`: sign = 1, process `5`: result = 9
     - `+`: sign = 1, process `2`: result = 11
   - End of inner parentheses: pop sign=1 and previous=1, result = 1 + 1\*11 = 12
   - `-`: sign = -1
   - Process `3`: result = 12 + (-1)\*3 = 9
4. End of first parentheses group: pop sign=1 and previous=0, result = 0 + 1\*9 = 9
5. `+`: sign = 1
6. `(`: push result=9 and sign=1, reset result=0, sign=1
7. Inside: `6+8`
   - Process `6`: result = 6
   - `+`: sign = 1, process `8`: result = 14
8. End of parentheses: pop sign=1 and previous=9, result = 9 + 1\*14 = 23

The final result is 23.

## Brute Force Approach

A naive approach might try to parse the entire expression into a tree structure or use recursion to evaluate parentheses. One brute force method would be:

1. Find the innermost parentheses pair
2. Evaluate what's inside
3. Replace the parentheses and contents with the result
4. Repeat until no parentheses remain
5. Evaluate the final expression

However, this approach has several issues:

- It requires multiple passes through the string
- String manipulation (replacing substrings) is inefficient
- Handling signs correctly when parentheses are removed is complex
- Time complexity could be O(n²) in worst case

The main problem with brute force is that it doesn't efficiently handle the sign propagation through nested parentheses. When we encounter a minus sign before parentheses, that minus applies to everything inside the parentheses.

## Optimized Approach

The key insight is that we can process the expression in **one pass** using a stack to handle parentheses. Here's the step-by-step reasoning:

1. **Single pass processing**: We read the string character by character from left to right
2. **Accumulate numbers**: Since numbers can have multiple digits, we build them digit by digit
3. **Track current result and sign**: We maintain `result` (current evaluated value) and `sign` (1 for plus, -1 for minus)
4. **Handle parentheses with a stack**: When we see `(`, we push the current `result` and `sign` onto the stack, then reset them to evaluate what's inside the parentheses
5. **Apply sign to numbers**: When we complete a number, we add `sign * number` to `result`
6. **Update sign for operators**: When we see `+` or `-`, we update the `sign` for the next number
7. **Handle closing parentheses**: When we see `)`, we pop the previous `result` and `sign` from the stack and combine with current result

The stack stores pairs of `(previous_result, sign_before_parentheses)`. This approach correctly handles nested parentheses because each opening parenthesis saves the current context, and each closing parenthesis restores it.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is length of string
# Space: O(n) for the stack in worst case of nested parentheses
def calculate(s: str) -> int:
    stack = []  # Stack to store (result, sign) pairs for parentheses
    result = 0  # Current accumulated result
    sign = 1    # Current sign: 1 for positive, -1 for negative
    num = 0     # Current number being built

    i = 0
    while i < len(s):
        char = s[i]

        if char.isdigit():
            # Build multi-digit number
            num = num * 10 + int(char)

        elif char == '+':
            # Add the completed number to result with current sign
            result += sign * num
            num = 0  # Reset number for next number
            sign = 1  # Next number will be added

        elif char == '-':
            # Add the completed number to result with current sign
            result += sign * num
            num = 0  # Reset number for next number
            sign = -1  # Next number will be subtracted

        elif char == '(':
            # Push current result and sign onto stack
            # We'll resume with these after the closing parenthesis
            stack.append(result)
            stack.append(sign)
            # Reset for evaluating inside parentheses
            result = 0
            sign = 1

        elif char == ')':
            # Add the last number before closing parenthesis
            result += sign * num
            num = 0  # Reset number

            # Apply the sign from before the parentheses
            prev_sign = stack.pop()  # Sign before '('
            prev_result = stack.pop()  # Result before '('

            # Combine: result inside parentheses * sign + previous result
            result = prev_result + prev_sign * result

        # Skip spaces
        i += 1

    # Add the last number if there is one
    result += sign * num

    return result
```

```javascript
// Time: O(n) where n is length of string
// Space: O(n) for the stack in worst case of nested parentheses
function calculate(s) {
  const stack = []; // Stack to store (result, sign) pairs for parentheses
  let result = 0; // Current accumulated result
  let sign = 1; // Current sign: 1 for positive, -1 for negative
  let num = 0; // Current number being built

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char >= "0" && char <= "9") {
      // Build multi-digit number
      num = num * 10 + parseInt(char);
    } else if (char === "+") {
      // Add the completed number to result with current sign
      result += sign * num;
      num = 0; // Reset number for next number
      sign = 1; // Next number will be added
    } else if (char === "-") {
      // Add the completed number to result with current sign
      result += sign * num;
      num = 0; // Reset number for next number
      sign = -1; // Next number will be subtracted
    } else if (char === "(") {
      // Push current result and sign onto stack
      // We'll resume with these after the closing parenthesis
      stack.push(result);
      stack.push(sign);
      // Reset for evaluating inside parentheses
      result = 0;
      sign = 1;
    } else if (char === ")") {
      // Add the last number before closing parenthesis
      result += sign * num;
      num = 0; // Reset number

      // Apply the sign from before the parentheses
      const prevSign = stack.pop(); // Sign before '('
      const prevResult = stack.pop(); // Result before '('

      // Combine: result inside parentheses * sign + previous result
      result = prevResult + prevSign * result;
    }
    // Skip spaces and other characters (only spaces are allowed per problem)
  }

  // Add the last number if there is one
  result += sign * num;

  return result;
}
```

```java
// Time: O(n) where n is length of string
// Space: O(n) for the stack in worst case of nested parentheses
class Solution {
    public int calculate(String s) {
        Stack<Integer> stack = new Stack<>();  // Stack to store (result, sign) pairs for parentheses
        int result = 0;    // Current accumulated result
        int sign = 1;      // Current sign: 1 for positive, -1 for negative
        int num = 0;       // Current number being built

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            if (Character.isDigit(c)) {
                // Build multi-digit number
                num = num * 10 + (c - '0');
            } else if (c == '+') {
                // Add the completed number to result with current sign
                result += sign * num;
                num = 0;   // Reset number for next number
                sign = 1;  // Next number will be added
            } else if (c == '-') {
                // Add the completed number to result with current sign
                result += sign * num;
                num = 0;    // Reset number for next number
                sign = -1;  // Next number will be subtracted
            } else if (c == '(') {
                // Push current result and sign onto stack
                // We'll resume with these after the closing parenthesis
                stack.push(result);
                stack.push(sign);
                // Reset for evaluating inside parentheses
                result = 0;
                sign = 1;
            } else if (c == ')') {
                // Add the last number before closing parenthesis
                result += sign * num;
                num = 0;  // Reset number

                // Apply the sign from before the parentheses
                int prevSign = stack.pop();    // Sign before '('
                int prevResult = stack.pop();  // Result before '('

                // Combine: result inside parentheses * sign + previous result
                result = prevResult + prevSign * result;
            }
            // Skip spaces
        }

        // Add the last number if there is one
        result += sign * num;

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character in the string exactly once
- Each character leads to O(1) operations (digit building, sign updates, stack operations)
- Even with nested parentheses, we still visit each character once

**Space Complexity: O(n)**

- In the worst case, we could have deeply nested parentheses like `(((((...)))))`
- Each opening parenthesis pushes 2 integers onto the stack
- For an expression with n/2 opening parentheses (worst case), we use O(n) space
- The stack dominates the space usage; other variables use O(1) space

## Common Mistakes

1. **Forgetting to reset `num` after processing an operator**: After adding a number to the result when we see `+` or `-`, we must reset `num = 0`. Otherwise, the next digit gets appended to the previous number.

2. **Not handling the last number**: After the loop ends, if there's a number that hasn't been added (no operator after it), we need to add it: `result += sign * num`.

3. **Incorrect stack order when popping**: When we see `)`, we must pop in the correct order: first the sign, then the result. The sign was pushed last, so it comes off first (LIFO).

4. **Not updating sign correctly for negative numbers before parentheses**: The solution handles this automatically because when we see `-` followed by `(`, we set `sign = -1`, then push that sign onto the stack when we see `(`. Everything inside the parentheses gets multiplied by -1 when we combine results.

## When You'll See This Pattern

This stack-based approach for handling nested structures appears in several problems:

1. **Evaluate Reverse Polish Notation (LeetCode 150)**: Uses a stack to evaluate postfix notation, though it's simpler since there are no parentheses to manage.

2. **Basic Calculator II (LeetCode 227)**: Similar but adds multiplication and division. The stack approach still works but needs modification for precedence.

3. **Decode String (LeetCode 394)**: Uses stacks to handle nested encoded strings like `3[a2[c]]`, where you need to repeat substrings multiple times.

4. **Mini Parser (LeetCode 385)**: Parsing nested list structures from strings uses similar stack-based techniques.

The common thread is using a stack to save context when entering a nested structure (parentheses, brackets, etc.) and restoring it when exiting.

## Key Takeaways

1. **Stacks are ideal for nested structures**: When you need to save state before entering a nested context and restore it after exiting, a stack is the natural data structure.

2. **Process expressions in one pass**: You can evaluate arithmetic expressions in O(n) time by processing left to right and using a stack to handle parentheses.

3. **Separate number building from evaluation**: Build multi-digit numbers digit by digit, then apply the current sign when you encounter an operator or parentheses boundary.

4. **Sign propagation through parentheses**: A minus sign before parentheses applies to everything inside. The stack approach handles this elegantly by storing the sign before the parentheses.

Related problems: [Evaluate Reverse Polish Notation](/problem/evaluate-reverse-polish-notation), [Basic Calculator II](/problem/basic-calculator-ii), [Different Ways to Add Parentheses](/problem/different-ways-to-add-parentheses)
