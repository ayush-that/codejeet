---
title: "How to Solve Parsing A Boolean Expression — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Parsing A Boolean Expression. Hard difficulty, 69.8% acceptance rate. Topics: String, Stack, Recursion."
date: "2026-10-01"
category: "dsa-patterns"
tags: ["parsing-a-boolean-expression", "string", "stack", "recursion", "hard"]
---

# How to Solve Parsing A Boolean Expression

This problem asks us to evaluate complex boolean expressions with nested operators. What makes it tricky is that we need to handle arbitrary levels of nesting while correctly applying three different boolean operators: NOT (`!`), AND (`&`), and OR (`|`). The expressions are given as strings with parentheses, so we need to parse them correctly to understand which sub-expressions belong to which operators.

## Visual Walkthrough

Let's trace through the example `"|(&(t,f,t),!(t))"` step by step:

1. **Expression**: `|(&(t,f,t),!(t))`
   - Outer operator: `|` (OR)
   - First argument: `&(t,f,t)`
   - Second argument: `!(t)`

2. **Evaluate first argument**: `&(t,f,t)`
   - Operator: `&` (AND)
   - Arguments: `t`, `f`, `t`
   - AND returns true only if ALL arguments are true
   - `t & f & t = f` (false)

3. **Evaluate second argument**: `!(t)`
   - Operator: `!` (NOT)
   - Argument: `t` (true)
   - NOT inverts the value
   - `!t = f` (false)

4. **Combine results**: `|(f, f)`
   - Operator: `|` (OR)
   - Arguments: `f`, `f`
   - OR returns true if ANY argument is true
   - `f | f = f` (false)

5. **Final result**: `false`

The challenge is that we need to process this from the innermost expressions outward, which naturally suggests using a stack or recursion.

## Brute Force Approach

A naive approach might try to evaluate the expression from left to right, but this fails with nested expressions. Another brute force idea is to repeatedly find and evaluate the innermost parentheses:

1. Find the first `)` character
2. Look backward to find the matching `(`
3. Extract the substring between them
4. Evaluate that sub-expression
5. Replace the entire `operator(arg1,arg2,...)` with the result
6. Repeat until no parentheses remain

While this would work, it's inefficient because:

- We need to repeatedly scan the string
- String manipulation (replacing substrings) is expensive
- We need to handle commas and multiple arguments correctly
- Time complexity would be O(n²) in worst case

The key insight is that we need to process the expression in a way that respects the nesting structure, which is exactly what stacks are designed for.

## Optimized Approach

The optimal solution uses a **stack** to handle the nested structure. Here's the step-by-step reasoning:

1. **Why a stack works**: Boolean expressions with parentheses naturally form a tree-like structure. When we encounter `(`, we're going deeper into the tree. When we encounter `)`, we've finished evaluating a subtree and need to combine results. A stack lets us naturally handle this "last in, first out" pattern.

2. **What to store on the stack**: We'll push characters onto the stack until we hit a closing parenthesis `)`. Then we pop until we find the matching `(`, collecting all the boolean values (`t`/`f`) we encounter. When we hit `(`, the next character popped will be the operator.

3. **Processing an operator**:
   - For `!` (NOT): We have exactly one argument to invert
   - For `&` (AND): We need ALL arguments to be true
   - For `|` (OR): We need ANY argument to be true

4. **Handling commas**: Commas separate arguments but don't affect evaluation. We simply ignore them.

5. **Final result**: After processing the entire string, the stack will contain exactly one character: either `t` or `f`.

The stack approach processes the string in a single pass (O(n) time) and uses O(n) space in the worst case for deeply nested expressions.

## Optimal Solution

Here's the complete implementation using a stack:

<div class="code-group">

```python
# Time: O(n) where n is the length of the expression
# Space: O(n) for the stack in worst case
def parseBoolExpr(expression: str) -> bool:
    """
    Evaluate a boolean expression with nested operators.

    Approach: Use a stack to handle nested expressions.
    When we encounter ')', we pop until '(' to get all arguments,
    then apply the operator to those arguments.
    """
    stack = []

    for char in expression:
        if char == ')':
            # We've reached the end of a sub-expression
            # Collect all arguments until we find '('
            args = []
            while stack and stack[-1] != '(':
                top = stack.pop()
                if top == 't':
                    args.append(True)
                elif top == 'f':
                    args.append(False)
                # Note: we ignore commas - they're separators, not values

            # Remove the '(' from stack
            stack.pop()

            # The operator is the next character
            operator = stack.pop()

            # Apply the operator to the collected arguments
            if operator == '!':
                # NOT operator: invert the single argument
                result = not args[0]
            elif operator == '&':
                # AND operator: all arguments must be True
                result = all(args)
            elif operator == '|':
                # OR operator: at least one argument must be True
                result = any(args)

            # Push the result back as 't' or 'f'
            stack.append('t' if result else 'f')

        elif char != ',':
            # Push everything except commas onto the stack
            # Commas are just separators, we don't need them
            stack.append(char)

    # Final result is the only thing left on the stack
    return stack[-1] == 't'
```

```javascript
// Time: O(n) where n is the length of the expression
// Space: O(n) for the stack in worst case
/**
 * Evaluate a boolean expression with nested operators.
 *
 * Approach: Use a stack to handle nested expressions.
 * When we encounter ')', we pop until '(' to get all arguments,
 * then apply the operator to those arguments.
 */
function parseBoolExpr(expression) {
  const stack = [];

  for (const char of expression) {
    if (char === ")") {
      // We've reached the end of a sub-expression
      // Collect all arguments until we find '('
      const args = [];
      while (stack.length > 0 && stack[stack.length - 1] !== "(") {
        const top = stack.pop();
        if (top === "t") {
          args.push(true);
        } else if (top === "f") {
          args.push(false);
        }
        // Note: we ignore commas - they're separators, not values
      }

      // Remove the '(' from stack
      stack.pop();

      // The operator is the next character
      const operator = stack.pop();

      // Apply the operator to the collected arguments
      let result;
      if (operator === "!") {
        // NOT operator: invert the single argument
        result = !args[0];
      } else if (operator === "&") {
        // AND operator: all arguments must be true
        result = args.every((arg) => arg === true);
      } else if (operator === "|") {
        // OR operator: at least one argument must be true
        result = args.some((arg) => arg === true);
      }

      // Push the result back as 't' or 'f'
      stack.push(result ? "t" : "f");
    } else if (char !== ",") {
      // Push everything except commas onto the stack
      // Commas are just separators, we don't need them
      stack.push(char);
    }
  }

  // Final result is the only thing left on the stack
  return stack[stack.length - 1] === "t";
}
```

```java
// Time: O(n) where n is the length of the expression
// Space: O(n) for the stack in worst case
import java.util.Stack;

/**
 * Evaluate a boolean expression with nested operators.
 *
 * Approach: Use a stack to handle nested expressions.
 * When we encounter ')', we pop until '(' to get all arguments,
 * then apply the operator to those arguments.
 */
public boolean parseBoolExpr(String expression) {
    Stack<Character> stack = new Stack<>();

    for (char c : expression.toCharArray()) {
        if (c == ')') {
            // We've reached the end of a sub-expression
            // Collect all arguments until we find '('
            boolean hasTrue = false;
            boolean hasFalse = false;

            while (!stack.isEmpty() && stack.peek() != '(') {
                char top = stack.pop();
                if (top == 't') {
                    hasTrue = true;
                } else if (top == 'f') {
                    hasFalse = true;
                }
                // Note: we ignore commas - they're separators, not values
            }

            // Remove the '(' from stack
            stack.pop();

            // The operator is the next character
            char operator = stack.pop();

            // Apply the operator to the collected arguments
            boolean result;
            if (operator == '!') {
                // NOT operator: invert the single boolean value
                // If we saw 't', result is false; if we saw 'f', result is true
                result = !hasTrue;  // hasTrue will be true if we saw 't'
            } else if (operator == '&') {
                // AND operator: all arguments must be true
                // This means we must have seen ONLY 't' values (no 'f')
                result = !hasFalse;
            } else { // operator == '|'
                // OR operator: at least one argument must be true
                // This means we must have seen at least one 't'
                result = hasTrue;
            }

            // Push the result back as 't' or 'f'
            stack.push(result ? 't' : 'f');
        } else if (c != ',') {
            // Push everything except commas onto the stack
            // Commas are just separators, we don't need them
            stack.push(c);
        }
    }

    // Final result is the only thing left on the stack
    return stack.pop() == 't';
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character in the expression exactly once
- Each character is either pushed onto the stack or causes some pops
- Even though we might pop multiple items when we encounter `)`, each character is popped at most once
- Total operations are linear in the length of the input

**Space Complexity: O(n)**

- In the worst case, we might push almost the entire expression onto the stack
- Consider an expression like `!(!(!(...(t)...)))` with n/2 levels of nesting
- The stack would hold approximately n/2 characters
- Thus, worst-case space is O(n)

## Common Mistakes

1. **Forgetting to handle commas**: Candidates might try to push commas onto the stack or treat them as values. Remember: commas are just separators between arguments and should be ignored.

2. **Incorrect operator application**:
   - NOT (`!`) takes exactly one argument
   - AND (`&`) returns true only if ALL arguments are true
   - OR (`|`) returns true if ANY argument is true
     Mixing these up will give wrong results.

3. **Not converting between boolean and character representations**: When we pop `'t'` or `'f'`, we need to convert them to boolean values (`true`/`false`) to apply boolean operators, then convert the result back to `'t'` or `'f'` to push onto the stack.

4. **Assuming expressions are always valid**: While the problem guarantees valid expressions, in a real interview you might want to mention edge cases like empty expressions or mismatched parentheses.

## When You'll See This Pattern

This stack-based approach for parsing nested expressions appears in several other problems:

1. **Basic Calculator (LeetCode 224)**: Similar concept of using a stack to evaluate arithmetic expressions with parentheses, though with different operators (+, -, \*, /).

2. **Decode String (LeetCode 394)**: Uses a stack to handle nested patterns like `3[a2[c]]` → `accaccacc`. The "pop until `[`" pattern is very similar to our "pop until `(`".

3. **Remove Outermost Parentheses (LeetCode 1021)**: While simpler, it uses similar stack logic to track nesting levels.

The key pattern to recognize: **when you need to process nested structures where inner elements must be evaluated before outer ones, a stack is often the right tool.**

## Key Takeaways

1. **Stacks are perfect for nested structures**: When you see parentheses, brackets, or any kind of nesting in parsing problems, think "stack" first. The LIFO (Last In, First Out) property naturally matches how we need to evaluate innermost expressions first.

2. **Separate parsing from evaluation**: First parse the structure (using the stack), then apply the operations. This separation of concerns makes the logic cleaner.

3. **Pay attention to separators**: In this problem, commas are just syntactic sugar—they separate arguments but don't affect evaluation. Recognizing what characters actually matter versus what's just syntax is key to clean solutions.

[Practice this problem on CodeJeet](/problem/parsing-a-boolean-expression)
