---
title: "How to Solve Evaluate Reverse Polish Notation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Evaluate Reverse Polish Notation. Medium difficulty, 57.1% acceptance rate. Topics: Array, Math, Stack."
date: "2026-06-26"
category: "dsa-patterns"
tags: ["evaluate-reverse-polish-notation", "array", "math", "stack", "medium"]
---

# How to Solve Evaluate Reverse Polish Notation

Reverse Polish Notation (RPN), also known as postfix notation, is a mathematical notation where operators follow their operands. This problem asks us to evaluate an RPN expression given as an array of string tokens. What makes this problem interesting is that it eliminates the need for parentheses while maintaining operator precedence through the order of operations, and it's a classic application of the stack data structure.

## Visual Walkthrough

Let's trace through the example `tokens = ["2","1","+","3","*"]`:

1. Start with an empty stack: `[]`
2. Read `"2"`: It's a number, push to stack → `[2]`
3. Read `"1"`: It's a number, push to stack → `[2, 1]`
4. Read `"+"`: It's an operator, pop two values (1 then 2), compute 2 + 1 = 3, push result → `[3]`
5. Read `"3"`: It's a number, push to stack → `[3, 3]`
6. Read `"*"`: It's an operator, pop two values (3 then 3), compute 3 × 3 = 9, push result → `[9]`
7. No more tokens, final result is 9

The expression `(2 + 1) × 3` in standard notation becomes `2 1 + 3 ×` in RPN. Notice how the stack naturally handles the order of operations: we process numbers by pushing them, and when we encounter an operator, we apply it to the most recent two numbers.

## Brute Force Approach

There isn't really a "brute force" alternative for this problem since RPN evaluation inherently requires processing tokens in order. However, a naive approach might try to:

1. Convert the entire expression back to infix notation
2. Parse and evaluate the infix expression

This approach would be extremely complex because:

- You'd need to handle operator precedence and parentheses
- The conversion from postfix to infix isn't straightforward
- You'd essentially be implementing a full expression parser

The key insight is that RPN was designed specifically to be easy to evaluate with a stack, so any approach that doesn't use a stack is going against the natural solution.

## Optimized Approach

The optimal solution uses a stack because RPN evaluation follows a simple pattern:

1. When you encounter a number, push it onto the stack
2. When you encounter an operator, pop the top two numbers, apply the operator, and push the result back

Why does this work? RPN places operators after their operands, so by the time we reach an operator, both operands have already been processed and are on the stack. The stack's LIFO (Last-In-First-Out) property ensures we get the operands in the correct order.

The algorithm:

1. Initialize an empty stack
2. Iterate through each token:
   - If token is a number: push it onto the stack
   - If token is an operator: pop two numbers, apply the operator, push result
3. The final result is the only value left on the stack

Important details:

- For subtraction and division, the order matters: `b - a` where `a` is popped first, then `b`
- Integer division should truncate toward zero (standard integer division in most languages)
- The input is guaranteed to be valid RPN, so we don't need extensive error checking

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the number of tokens
# Space: O(n) for the stack in worst case (all numbers before any operators)
def evalRPN(tokens):
    """
    Evaluate Reverse Polish Notation expression.

    Args:
        tokens: List of strings representing RPN expression

    Returns:
        Integer result of the expression
    """
    stack = []

    for token in tokens:
        if token not in {"+", "-", "*", "/"}:
            # Token is a number, convert to int and push to stack
            stack.append(int(token))
        else:
            # Token is an operator, pop two operands
            # Note: a is popped first, then b
            a = stack.pop()
            b = stack.pop()

            # Apply the operator based on token
            if token == "+":
                result = b + a
            elif token == "-":
                result = b - a  # b - a (not a - b)!
            elif token == "*":
                result = b * a
            else:  # token == "/"
                # Integer division truncating toward zero
                result = int(b / a)  # Using int() handles truncation toward zero

            # Push result back to stack
            stack.append(result)

    # Final result is the only element in stack
    return stack.pop()
```

```javascript
// Time: O(n) where n is the number of tokens
// Space: O(n) for the stack in worst case (all numbers before any operators)
function evalRPN(tokens) {
  /**
   * Evaluate Reverse Polish Notation expression.
   *
   * @param {string[]} tokens - Array of strings representing RPN expression
   * @return {number} Integer result of the expression
   */
  const stack = [];

  for (const token of tokens) {
    if (!isOperator(token)) {
      // Token is a number, convert to integer and push to stack
      stack.push(parseInt(token));
    } else {
      // Token is an operator, pop two operands
      // Note: a is popped first, then b
      const a = stack.pop();
      const b = stack.pop();

      // Apply the operator based on token
      let result;
      switch (token) {
        case "+":
          result = b + a;
          break;
        case "-":
          result = b - a; // b - a (not a - b)!
          break;
        case "*":
          result = b * a;
          break;
        case "/":
          // Integer division truncating toward zero
          result = Math.trunc(b / a);
          break;
      }

      // Push result back to stack
      stack.push(result);
    }
  }

  // Final result is the only element in stack
  return stack.pop();
}

// Helper function to check if token is an operator
function isOperator(token) {
  return token === "+" || token === "-" || token === "*" || token === "/";
}
```

```java
// Time: O(n) where n is the number of tokens
// Space: O(n) for the stack in worst case (all numbers before any operators)
import java.util.Stack;

class Solution {
    /**
     * Evaluate Reverse Polish Notation expression.
     *
     * @param tokens Array of strings representing RPN expression
     * @return Integer result of the expression
     */
    public int evalRPN(String[] tokens) {
        Stack<Integer> stack = new Stack<>();

        for (String token : tokens) {
            if (!isOperator(token)) {
                // Token is a number, convert to integer and push to stack
                stack.push(Integer.parseInt(token));
            } else {
                // Token is an operator, pop two operands
                // Note: a is popped first, then b
                int a = stack.pop();
                int b = stack.pop();

                // Apply the operator based on token
                int result = 0;
                switch (token) {
                    case "+":
                        result = b + a;
                        break;
                    case "-":
                        result = b - a;  // b - a (not a - b)!
                        break;
                    case "*":
                        result = b * a;
                        break;
                    case "/":
                        // Integer division truncating toward zero
                        result = b / a;  // Java integer division already truncates toward zero
                        break;
                }

                // Push result back to stack
                stack.push(result);
            }
        }

        // Final result is the only element in stack
        return stack.pop();
    }

    // Helper method to check if token is an operator
    private boolean isOperator(String token) {
        return token.equals("+") || token.equals("-") ||
               token.equals("*") || token.equals("/");
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each token exactly once
- Each operation (push, pop, arithmetic) is O(1)
- Total operations: n iterations × O(1) operations = O(n)

**Space Complexity: O(n)**

- In the worst case, all tokens are numbers before any operators (e.g., `["1","2","3","4","5","+","+","+","+"]`)
- The stack would hold all n numbers before processing the first operator
- In practice, the stack size is at most the number of numbers minus the number of binary operators processed so far

## Common Mistakes

1. **Wrong operand order for subtraction and division**: The most common mistake is computing `a - b` instead of `b - a`. Remember: the second popped value (`b`) comes first in the operation. Always think: "b operator a" where a is popped first.

2. **Incorrect integer division handling**: Some languages handle negative division differently. For example, in Python, `-3 // 2 = -2` (floor division), but we need truncation toward zero (`-1`). Using `int(b / a)` in Python handles this correctly.

3. **Not converting strings to numbers**: Forgetting to convert token strings to integers before pushing to stack. The tokens are strings, so `"2" + "1"` would concatenate to `"21"` instead of adding to `3`.

4. **Assuming the stack has exactly one element at the end**: While the problem guarantees valid RPN, in an interview you might want to add a check: `if len(stack) != 1: raise ValueError("Invalid RPN expression")`.

## When You'll See This Pattern

The stack-based evaluation pattern appears in many expression parsing problems:

1. **Basic Calculator (LeetCode 224)**: While more complex due to parentheses and unary operators, it still uses stacks to handle operations in correct order.

2. **Decode String (LeetCode 394)**: Uses stacks to handle nested structures like `3[a2[c]]` → `accaccacc`.

3. **Valid Parentheses (LeetCode 20)**: The classic stack problem for matching opening/closing brackets.

4. **Simplify Path (LeetCode 71)**: Uses stack to handle directory navigation operations like `..` and `.`.

The common theme: when you need to process elements in order but apply operations to the most recent elements first, think "stack."

## Key Takeaways

1. **RPN is stack-natural**: The postfix notation was designed for stack-based evaluation. When you see RPN, immediately think "stack."

2. **Order matters for non-commutative operations**: With subtraction and division, the order of operands is crucial. Always apply the operator as `second_popped operator first_popped`.

3. **Stack transforms recursive structure to iterative**: RPN evaluation could be done recursively (evaluate left subtree, evaluate right subtree, apply operator), but the stack lets us do it iteratively in O(n) space.

Related problems: [Basic Calculator](/problem/basic-calculator), [Expression Add Operators](/problem/expression-add-operators)
