---
title: "How to Solve Basic Calculator II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Basic Calculator II. Medium difficulty, 46.7% acceptance rate. Topics: Math, String, Stack."
date: "2026-10-28"
category: "dsa-patterns"
tags: ["basic-calculator-ii", "math", "string", "stack", "medium"]
---

# How to Solve Basic Calculator II

This problem asks us to evaluate a string expression containing integers, spaces, and the four basic operators (`+`, `-`, `*`, `/`). The challenge is handling operator precedence: multiplication and division must be processed before addition and subtraction, but we can't simply evaluate left-to-right. The expression is guaranteed valid, and integer division truncates toward zero.

What makes this interesting is that we need to simulate the order of operations without using `eval()` or building a full expression tree. We must process the string in a single pass while correctly deferring addition/subtraction until after handling all multiplication/division in the current term.

## Visual Walkthrough

Let's trace through `"3+2*2"` step by step:

1. Start with `num = 0`, `stack = []`, and `sign = '+'` (default for first number)
2. Read `'3'`: `num = 3`
3. Read `'+'`: Since previous sign was `'+'`, push `3` to stack. Update `sign = '+'`, reset `num = 0`
4. Read `'2'`: `num = 2`
5. Read `'*'`: Previous sign was `'+'`, but we see `'*'` next. Don't push yet — wait for complete term
6. Read `'2'`: `num = 2` (but we need to multiply with previous `num = 2`)
7. End of string: Process last operation. Previous sign was `'*'`, so pop `2` from stack? Wait — we never pushed it!

This reveals the issue: we can't push numbers immediately when we see `+` or `-` if the next operation is `*` or `/`. We need a different approach.

Better approach: When we see `+` or `-`, we can push the current number with its sign. When we see `*` or `/`, we need to combine it with the next number immediately.

Let's try again with the correct algorithm:

1. `num = 0`, `lastNum = 0`, `result = 0`, `sign = '+'`
2. Read `'3'`: `num = 3`
3. Read `'+'`: Since `sign` is `'+'`, add `num` to `result` → `result = 3`. Set `sign = '+'`, `num = 0`
4. Read `'2'`: `num = 2`
5. Read `'*'`: Since `sign` is `'*'`, we need to wait for next number
6. Read `'2'`: `num = 2`. Now apply `'*'`: `result = 3 + (2 * 2) = 7`

This works! The key insight: we process `*` and `/` immediately by combining with the next number, while `+` and `-` just add to the running total.

## Brute Force Approach

A truly brute force approach would be to parse the entire expression into numbers and operators, then repeatedly scan for multiplication/division operations, evaluate them, and rebuild the expression until only addition/subtraction remains. This would be O(n²) in the worst case.

Another naive approach: evaluate left-to-right ignoring precedence. For `"3+2*2"`, this gives `(3+2)*2 = 10` instead of the correct `7`. This clearly fails.

A candidate might also try using two stacks (one for numbers, one for operators) and repeatedly applying operators when precedence allows. While this works, it's more complex than necessary for this problem with only two precedence levels.

## Optimized Approach

The optimal insight: We can process the string in one pass using a single stack or even just a running total. Since multiplication and division have higher precedence than addition and subtraction, we handle them immediately when we encounter them, while deferring addition/subtraction.

**Stack-based approach:**

- When we encounter a number, build it completely (could be multiple digits)
- When we encounter `+` or `-`, push the current number with the appropriate sign
- When we encounter `*` or `/`, pop the last number, combine it with the current number using the operator, then push the result back
- At the end, sum everything in the stack

**Even better (O(1) space approach):**
We don't actually need a stack! We can maintain:

- `result`: running total of additions/subtractions
- `currentNumber`: current number being built
- `lastNumber`: the value from the last multiplication/division chain
- `sign`: current operator

When we see `+` or `-`, we add `lastNumber` to `result` and start fresh.
When we see `*` or `/`, we update `lastNumber` with the operation immediately.

## Optimal Solution

Here's the O(1) space solution that processes the string in one pass:

<div class="code-group">

```python
# Time: O(n) where n is length of string
# Space: O(1) - only a few variables used
def calculate(s: str) -> int:
    # Initialize variables
    result = 0          # Running total for additions/subtractions
    last_number = 0     # Current term for multiplication/division chain
    current_number = 0  # Number being built from digits
    sign = '+'          # Current operator, default '+' for first number

    for i, char in enumerate(s):
        # If character is a digit, build the current number
        if char.isdigit():
            current_number = current_number * 10 + int(char)

        # If character is an operator or we're at the end of string
        # Note: We need to process the last number when we reach the end
        if (not char.isdigit() and char != ' ') or i == len(s) - 1:
            # Handle based on the previous sign (not current char!)
            if sign == '+':
                # Addition: add last_number to result, start new term
                result += last_number
                last_number = current_number
            elif sign == '-':
                # Subtraction: add last_number to result, start new negative term
                result += last_number
                last_number = -current_number
            elif sign == '*':
                # Multiplication: combine with current term immediately
                last_number *= current_number
            elif sign == '/':
                # Division: combine with current term, truncate toward zero
                # Use integer division with truncation toward zero
                if last_number < 0:
                    last_number = -(-last_number // current_number)
                else:
                    last_number //= current_number

            # Update sign for next operation and reset current number
            sign = char
            current_number = 0

    # Add the final term to result
    result += last_number
    return result
```

```javascript
// Time: O(n) where n is length of string
// Space: O(1) - only a few variables used
function calculate(s) {
  // Initialize variables
  let result = 0; // Running total for additions/subtractions
  let lastNumber = 0; // Current term for multiplication/division chain
  let currentNumber = 0; // Number being built from digits
  let sign = "+"; // Current operator, default '+' for first number

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // If character is a digit, build the current number
    if (!isNaN(parseInt(char)) && char !== " ") {
      currentNumber = currentNumber * 10 + parseInt(char);
    }

    // If character is an operator or we're at the end of string
    // Note: We need to process the last number when we reach the end
    if ((isNaN(parseInt(char)) && char !== " ") || i === s.length - 1) {
      // Handle based on the previous sign (not current char!)
      if (sign === "+") {
        // Addition: add lastNumber to result, start new term
        result += lastNumber;
        lastNumber = currentNumber;
      } else if (sign === "-") {
        // Subtraction: add lastNumber to result, start new negative term
        result += lastNumber;
        lastNumber = -currentNumber;
      } else if (sign === "*") {
        // Multiplication: combine with current term immediately
        lastNumber *= currentNumber;
      } else if (sign === "/") {
        // Division: combine with current term, truncate toward zero
        // Use Math.trunc for integer division with truncation toward zero
        lastNumber = Math.trunc(lastNumber / currentNumber);
      }

      // Update sign for next operation and reset current number
      sign = char;
      currentNumber = 0;
    }
  }

  // Add the final term to result
  result += lastNumber;
  return result;
}
```

```java
// Time: O(n) where n is length of string
// Space: O(1) - only a few variables used
public int calculate(String s) {
    // Initialize variables
    int result = 0;          // Running total for additions/subtractions
    int lastNumber = 0;      // Current term for multiplication/division chain
    int currentNumber = 0;   // Number being built from digits
    char sign = '+';         // Current operator, default '+' for first number

    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);

        // If character is a digit, build the current number
        if (Character.isDigit(c)) {
            currentNumber = currentNumber * 10 + (c - '0');
        }

        // If character is an operator or we're at the end of string
        // Note: We need to process the last number when we reach the end
        if ((!Character.isDigit(c) && c != ' ') || i == s.length() - 1) {
            // Handle based on the previous sign (not current char!)
            if (sign == '+') {
                // Addition: add lastNumber to result, start new term
                result += lastNumber;
                lastNumber = currentNumber;
            } else if (sign == '-') {
                // Subtraction: add lastNumber to result, start new negative term
                result += lastNumber;
                lastNumber = -currentNumber;
            } else if (sign == '*') {
                // Multiplication: combine with current term immediately
                lastNumber *= currentNumber;
            } else if (sign == '/') {
                // Division: combine with current term, truncate toward zero
                // Integer division in Java already truncates toward zero
                lastNumber /= currentNumber;
            }

            // Update sign for next operation and reset current number
            sign = c;
            currentNumber = 0;
        }
    }

    // Add the final term to result
    result += lastNumber;
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the input string. We process each character exactly once. Building multi-digit numbers takes O(1) per digit since we just update `current_number = current_number * 10 + digit`.

**Space Complexity:** O(1) for the optimal solution. We only use a few integer variables and don't allocate any data structures proportional to the input size. A stack-based solution would use O(n) space in the worst case (e.g., `"1+2+3+4+..."`), but our solution avoids this.

## Common Mistakes

1. **Not handling multi-digit numbers correctly**: Candidates often process each digit independently instead of building complete numbers. Remember: `"123"` is one hundred twenty-three, not `1`, `2`, `3`.

2. **Forgetting to process the last number**: The loop processes numbers when it encounters operators. If the expression ends with a number (it always does), we need special handling at the end. Our code checks `i == len(s) - 1` to catch this.

3. **Incorrect integer division truncation**: The problem specifies "truncate toward zero." For negative numbers, `-3/2 = -1` (not -2 or -1.5). Python's `//` does floor division (rounds down), so we need special handling. Java and JavaScript handle this correctly with `/` and `Math.trunc()` respectively.

4. **Processing the wrong sign**: When we see an operator, we need to apply the _previous_ sign to the _previous_ number, not the current sign to the current number. This off-by-one timing issue is subtle but crucial.

## When You'll See This Pattern

This "deferred addition with immediate multiplication/division" pattern appears in several calculator and expression evaluation problems:

1. **Basic Calculator (Hard)**: Adds parentheses handling to the same pattern. You'll need a stack to save state when entering parentheses.

2. **Basic Calculator III (Hard)**: Combines both Basic Calculator I and II — handles parentheses AND all four operators with precedence.

3. **Expression Add Operators (Hard)**: Uses similar parsing techniques but explores all possible operator placements to reach a target value.

The core technique of processing higher-precedence operators immediately while deferring lower-precedence ones is fundamental to expression evaluation. It's essentially a simplified version of the shunting-yard algorithm without needing to handle multiple precedence levels or parentheses.

## Key Takeaways

1. **Operator precedence dictates processing order**: When you have operators with different precedence levels, process higher-precedence operators (`*`, `/`) immediately when you have both operands, while deferring lower-precedence operators (`+`, `-`) until later.

2. **State machine thinking helps**: The solution maintains state about what "term" we're currently building and whether we're in a multiplication/division chain. This state-based approach is cleaner than trying to look ahead or backtrack.

3. **Edge cases matter**: Multi-digit numbers, negative results from division, and the final number in the expression are common pitfalls. Always test with `"3+2*2"`, `"14-3/2"`, and `"1+2+3"` to catch these issues.

Related problems: [Basic Calculator](/problem/basic-calculator), [Expression Add Operators](/problem/expression-add-operators), [Basic Calculator III](/problem/basic-calculator-iii)
