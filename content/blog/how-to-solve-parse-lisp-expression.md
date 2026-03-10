---
title: "How to Solve Parse Lisp Expression — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Parse Lisp Expression. Hard difficulty, 53.5% acceptance rate. Topics: Hash Table, String, Stack, Recursion."
date: "2029-06-19"
category: "dsa-patterns"
tags: ["parse-lisp-expression", "hash-table", "string", "stack", "hard"]
---

# How to Solve Parse Lisp Expression

This problem asks you to evaluate a Lisp-like expression that can contain integers, variables, and three operations: `let`, `add`, and `mult`. The tricky part is handling variable scoping correctly—variables defined in inner `let` expressions should shadow outer ones, but once the inner expression ends, the outer variable should be visible again. This requires careful management of variable bindings across nested scopes.

## Visual Walkthrough

Let's trace through a simple example: `"(let x 2 (mult x (let x 3 y 4 (add x y))))"`

1. **Parse the outermost expression**: It's a `let` expression
   - Variable `x` gets value `2`
   - Body is `(mult x (let x 3 y 4 (add x y)))`

2. **Evaluate the `mult` expression**:
   - First operand: `x` → lookup in current scope → `2`
   - Second operand: `(let x 3 y 4 (add x y))`

3. **Enter inner `let` expression**:
   - Create new scope (variables from outer scope are still accessible unless shadowed)
   - Bind `x = 3` (shadows outer `x`)
   - Bind `y = 4`
   - Body: `(add x y)`

4. **Evaluate inner `add`**:
   - `x` → lookup in current scope → `3`
   - `y` → lookup in current scope → `4`
   - Result: `3 + 4 = 7`

5. **Exit inner `let`**:
   - Discard inner scope (x=3, y=4)
   - Return to outer scope where `x = 2`

6. **Complete outer `mult`**:
   - First operand was `2`
   - Second operand is `7`
   - Result: `2 * 7 = 14`

The key insight: we need a stack of scopes where each new `let` creates a new scope on top of the stack, and when we exit that `let`, we pop the scope off.

## Brute Force Approach

A naive approach might try to parse the entire expression as a string and substitute variables globally, but this fails because:

1. Variable scoping is lexical, not dynamic—we need to respect the nesting structure
2. Variables can be redefined in inner scopes
3. We need to track when scopes begin and end

A brute force recursive parser without proper scope management would incorrectly handle cases like:

```
(let x 1 (let x 2 x))  # Should evaluate to 2, not 1
```

Without a scope stack, we'd overwrite `x` globally and lose the outer binding. The brute force approach fundamentally misunderstands how Lisp scoping works.

## Optimized Approach

The key insight is that we need:

1. **Recursive parsing** to handle nested expressions
2. **A stack of scopes** to manage variable bindings
3. **Proper tokenization** to break the expression into manageable pieces

Here's the step-by-step reasoning:

1. **Tokenization**: Convert the string into tokens—parentheses, operators, variables, and numbers. This makes parsing easier.

2. **Recursive evaluation**: When we encounter `(`, we know we're starting a new expression. We look at the next token to determine if it's `let`, `add`, or `mult`.

3. **Scope management**:
   - Each `let` creates a new scope (a dictionary) pushed onto the stack
   - Variables are bound in the current scope (top of stack)
   - When looking up a variable, search from the top of the stack downward
   - When exiting a `let`, pop the scope off the stack

4. **Expression types**:
   - **Integer**: Return the parsed integer
   - **Variable**: Look it up in the scope stack
   - **add/mult**: Evaluate both operands and apply the operation
   - **let**: Parse variable-value pairs, then evaluate the body

5. **Index tracking**: Since we're parsing recursively, we need to track our current position in the token list. Each recursive call returns both the result and the new index.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of the expression
# Space: O(n) for the token list and scope stack
class Solution:
    def evaluate(self, expression: str) -> int:
        # Tokenize the expression: split by spaces but keep parentheses as separate tokens
        tokens = self.tokenize(expression)
        # Start evaluation with empty scopes
        return self.evaluate_expression(tokens, 0, [{}])[0]

    def tokenize(self, expr: str) -> list:
        """Convert expression string into tokens."""
        tokens = []
        i = 0
        while i < len(expr):
            if expr[i] in '()':
                # Parentheses are their own tokens
                tokens.append(expr[i])
                i += 1
            elif expr[i] == ' ':
                # Skip spaces
                i += 1
            else:
                # Parse a word (operator, variable, or number)
                start = i
                while i < len(expr) and expr[i] not in '() ':
                    i += 1
                tokens.append(expr[start:i])
        return tokens

    def evaluate_expression(self, tokens: list, idx: int, scopes: list) -> tuple:
        """Evaluate expression starting at idx, return (result, new_idx)."""
        # Base case: integer or variable
        if tokens[idx] != '(':
            # Check if it's a number
            if tokens[idx][0].isdigit() or tokens[idx][0] == '-':
                return int(tokens[idx]), idx + 1
            # It's a variable - look it up in scopes
            var_name = tokens[idx]
            # Search from innermost to outermost scope
            for scope in reversed(scopes):
                if var_name in scope:
                    return scope[var_name], idx + 1

        # We have an expression starting with '('
        idx += 1  # Skip '('
        operator = tokens[idx]
        idx += 1  # Move past operator

        if operator == 'let':
            # Create new scope for this let expression
            new_scope = {}
            scopes.append(new_scope)

            # Parse variable assignments
            while True:
                # Check if next token is the start of the body
                if tokens[idx] == '(' or self.is_value(tokens[idx]):
                    # This is the body, not a variable assignment
                    break

                # Parse variable name
                var_name = tokens[idx]
                idx += 1

                # Check if we've reached the body
                if tokens[idx] == ')':
                    # No body means the variable itself is the result
                    result = self.get_value(var_name, scopes)
                    idx += 1
                    scopes.pop()  # Remove the scope we added
                    return result, idx

                # Parse variable value
                value, idx = self.evaluate_expression(tokens, idx, scopes)
                new_scope[var_name] = value

            # Evaluate the body
            result, idx = self.evaluate_expression(tokens, idx, scopes)
            idx += 1  # Skip ')'
            scopes.pop()  # Remove the scope we added
            return result, idx

        elif operator == 'add' or operator == 'mult':
            # Evaluate first operand
            left, idx = self.evaluate_expression(tokens, idx, scopes)
            # Evaluate second operand
            right, idx = self.evaluate_expression(tokens, idx, scopes)
            idx += 1  # Skip ')'

            # Apply operation
            if operator == 'add':
                return left + right, idx
            else:
                return left * right, idx

    def is_value(self, token: str) -> bool:
        """Check if token is a value (number or variable)."""
        return token[0].isdigit() or token[0] == '-' or not token.startswith('(')

    def get_value(self, token: str, scopes: list) -> int:
        """Get value of a token (number or variable lookup)."""
        if token[0].isdigit() or token[0] == '-':
            return int(token)
        # Look up variable
        for scope in reversed(scopes):
            if token in scope:
                return scope[token]
```

```javascript
// Time: O(n) where n is the length of the expression
// Space: O(n) for the token list and scope stack
var evaluate = function (expression) {
  // Tokenize the expression
  const tokens = tokenize(expression);
  // Start evaluation with empty scopes
  return evaluateExpression(tokens, 0, [new Map()])[0];
};

function tokenize(expr) {
  /** Convert expression string into tokens. */
  const tokens = [];
  let i = 0;

  while (i < expr.length) {
    if (expr[i] === "(" || expr[i] === ")") {
      // Parentheses are their own tokens
      tokens.push(expr[i]);
      i++;
    } else if (expr[i] === " ") {
      // Skip spaces
      i++;
    } else {
      // Parse a word (operator, variable, or number)
      const start = i;
      while (i < expr.length && expr[i] !== "(" && expr[i] !== ")" && expr[i] !== " ") {
        i++;
      }
      tokens.push(expr.substring(start, i));
    }
  }

  return tokens;
}

function evaluateExpression(tokens, idx, scopes) {
  /** Evaluate expression starting at idx, return [result, new_idx]. */
  // Base case: integer or variable
  if (tokens[idx] !== "(") {
    // Check if it's a number
    if (/^-?\d/.test(tokens[idx])) {
      return [parseInt(tokens[idx]), idx + 1];
    }
    // It's a variable - look it up in scopes
    const varName = tokens[idx];
    // Search from innermost to outermost scope
    for (let i = scopes.length - 1; i >= 0; i--) {
      if (scopes[i].has(varName)) {
        return [scopes[i].get(varName), idx + 1];
      }
    }
  }

  // We have an expression starting with '('
  idx++; // Skip '('
  const operator = tokens[idx];
  idx++; // Move past operator

  if (operator === "let") {
    // Create new scope for this let expression
    const newScope = new Map();
    scopes.push(newScope);

    // Parse variable assignments
    while (true) {
      // Check if next token is the start of the body
      if (tokens[idx] === "(" || isValue(tokens[idx])) {
        // This is the body, not a variable assignment
        break;
      }

      // Parse variable name
      const varName = tokens[idx];
      idx++;

      // Check if we've reached the body
      if (tokens[idx] === ")") {
        // No body means the variable itself is the result
        const result = getValue(varName, scopes);
        idx++;
        scopes.pop(); // Remove the scope we added
        return [result, idx];
      }

      // Parse variable value
      const [value, newIdx] = evaluateExpression(tokens, idx, scopes);
      idx = newIdx;
      newScope.set(varName, value);
    }

    // Evaluate the body
    const [result, newIdx] = evaluateExpression(tokens, idx, scopes);
    idx = newIdx + 1; // Skip ')'
    scopes.pop(); // Remove the scope we added
    return [result, idx];
  } else if (operator === "add" || operator === "mult") {
    // Evaluate first operand
    const [left, idx1] = evaluateExpression(tokens, idx, scopes);
    // Evaluate second operand
    const [right, idx2] = evaluateExpression(tokens, idx1, scopes);
    idx = idx2 + 1; // Skip ')'

    // Apply operation
    if (operator === "add") {
      return [left + right, idx];
    } else {
      return [left * right, idx];
    }
  }
}

function isValue(token) {
  /** Check if token is a value (number or variable). */
  return /^-?\d/.test(token) || !token.startsWith("(");
}

function getValue(token, scopes) {
  /** Get value of a token (number or variable lookup). */
  if (/^-?\d/.test(token)) {
    return parseInt(token);
  }
  // Look up variable
  for (let i = scopes.length - 1; i >= 0; i--) {
    if (scopes[i].has(token)) {
      return scopes[i].get(token);
    }
  }
}
```

```java
// Time: O(n) where n is the length of the expression
// Space: O(n) for the token list and scope stack
class Solution {
    public int evaluate(String expression) {
        // Tokenize the expression
        List<String> tokens = tokenize(expression);
        // Start evaluation with empty scopes
        List<Map<String, Integer>> scopes = new ArrayList<>();
        scopes.add(new HashMap<>());
        return evaluateExpression(tokens, 0, scopes)[0];
    }

    private List<String> tokenize(String expr) {
        /** Convert expression string into tokens. */
        List<String> tokens = new ArrayList<>();
        int i = 0;

        while (i < expr.length()) {
            char c = expr.charAt(i);
            if (c == '(' || c == ')') {
                // Parentheses are their own tokens
                tokens.add(String.valueOf(c));
                i++;
            } else if (c == ' ') {
                // Skip spaces
                i++;
            } else {
                // Parse a word (operator, variable, or number)
                int start = i;
                while (i < expr.length() && expr.charAt(i) != '(' &&
                       expr.charAt(i) != ')' && expr.charAt(i) != ' ') {
                    i++;
                }
                tokens.add(expr.substring(start, i));
            }
        }

        return tokens;
    }

    private int[] evaluateExpression(List<String> tokens, int idx,
                                     List<Map<String, Integer>> scopes) {
        /** Evaluate expression starting at idx, return [result, new_idx]. */
        // Base case: integer or variable
        if (!tokens.get(idx).equals("(")) {
            String token = tokens.get(idx);
            // Check if it's a number
            if (Character.isDigit(token.charAt(0)) || token.charAt(0) == '-') {
                return new int[]{Integer.parseInt(token), idx + 1};
            }
            // It's a variable - look it up in scopes
            // Search from innermost to outermost scope
            for (int i = scopes.size() - 1; i >= 0; i--) {
                if (scopes.get(i).containsKey(token)) {
                    return new int[]{scopes.get(i).get(token), idx + 1};
                }
            }
        }

        // We have an expression starting with '('
        idx++; // Skip '('
        String operator = tokens.get(idx);
        idx++; // Move past operator

        if (operator.equals("let")) {
            // Create new scope for this let expression
            Map<String, Integer> newScope = new HashMap<>();
            scopes.add(newScope);

            // Parse variable assignments
            while (true) {
                // Check if next token is the start of the body
                String nextToken = tokens.get(idx);
                if (nextToken.equals("(") || isValue(nextToken)) {
                    // This is the body, not a variable assignment
                    break;
                }

                // Parse variable name
                String varName = tokens.get(idx);
                idx++;

                // Check if we've reached the body
                if (tokens.get(idx).equals(")")) {
                    // No body means the variable itself is the result
                    int result = getValue(varName, scopes);
                    idx++;
                    scopes.remove(scopes.size() - 1); // Remove the scope we added
                    return new int[]{result, idx};
                }

                // Parse variable value
                int[] valueResult = evaluateExpression(tokens, idx, scopes);
                int value = valueResult[0];
                idx = valueResult[1];
                newScope.put(varName, value);
            }

            // Evaluate the body
            int[] bodyResult = evaluateExpression(tokens, idx, scopes);
            int result = bodyResult[0];
            idx = bodyResult[1] + 1; // Skip ')'
            scopes.remove(scopes.size() - 1); // Remove the scope we added
            return new int[]{result, idx};

        } else if (operator.equals("add") || operator.equals("mult")) {
            // Evaluate first operand
            int[] leftResult = evaluateExpression(tokens, idx, scopes);
            int left = leftResult[0];
            idx = leftResult[1];

            // Evaluate second operand
            int[] rightResult = evaluateExpression(tokens, idx, scopes);
            int right = rightResult[0];
            idx = rightResult[1] + 1; // Skip ')'

            // Apply operation
            if (operator.equals("add")) {
                return new int[]{left + right, idx};
            } else {
                return new int[]{left * right, idx};
            }
        }

        return new int[]{0, idx}; // Should never reach here
    }

    private boolean isValue(String token) {
        /** Check if token is a value (number or variable). */
        return Character.isDigit(token.charAt(0)) ||
               token.charAt(0) == '-' ||
               !token.startsWith("(");
    }

    private int getValue(String token, List<Map<String, Integer>> scopes) {
        /** Get value of a token (number or variable lookup). */
        if (Character.isDigit(token.charAt(0)) || token.charAt(0) == '-') {
            return Integer.parseInt(token);
        }
        // Look up variable
        for (int i = scopes.size() - 1; i >= 0; i--) {
            if (scopes.get(i).containsKey(token)) {
                return scopes.get(i).get(token);
            }
        }
        return 0; // Should never reach here for valid expressions
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the length of the expression. We parse each character once during tokenization, and each token is processed once during evaluation. The recursive calls don't re-process tokens because we carefully track our position with the index.

**Space Complexity: O(n)** for several reasons:

1. The token list stores O(n) tokens
2. The scope stack can grow up to O(d) where d is the maximum nesting depth, which is O(n) in the worst case (deeply nested expressions)
3. The recursion stack also grows with nesting depth, which is O(n) in worst case

## Common Mistakes

1. **Not handling variable scoping correctly**: The most common mistake is using a single global dictionary for variables. Remember that `let` creates a new scope that shadows outer variables, and that scope disappears when the `let` ends. Always use a stack of scopes.

2. **Incorrect tokenization**: Trying to parse the expression character by character without proper tokenization leads to complex, error-prone code. Always tokenize first to separate operators, parentheses, variables, and numbers.

3. **Forgetting that `let` can have multiple variable assignments**: A `let` expression can bind multiple variables before its body. Make sure to parse all variable-value pairs until you reach the body.

4. **Not handling the case where the last variable is the result**: In `(let x 1 x)`, the result is the value of `x`, not some separate body expression. Your parser needs to detect when there's no explicit body.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Recursive descent parsing**: Used in expression evaluation problems like [Basic Calculator IV](/problem/basic-calculator-iv) and [Ternary Expression Parser](/problem/ternary-expression-parser). The key is recognizing that expressions are naturally recursive.

2. **Scope stack management**: Similar to [Number of Atoms](/problem/number-of-atoms) where you need to handle nested multipliers. Any problem with nested contexts needs a stack to track the current context.

3. **Symbol table with scoping**: Compiler design problems often require maintaining symbol tables with lexical scoping. This is fundamental to implementing interpreters.

## Key Takeaways

1. **When you see nested expressions, think recursion**: Expression evaluation naturally lends itself to recursive parsing. Each subexpression can be evaluated independently.

2. **Use a scope stack for lexical scoping**: Whenever you need variables that can be shadowed in inner contexts, maintain a stack of dictionaries. Look up variables from the top down, and push/pop scopes as you enter/exit contexts.

3. **Always tokenize complex string inputs**: Don't try to parse complex expressions character by character. Break them into tokens first—it simplifies the parsing logic significantly.

Related problems: [Ternary Expression Parser](/problem/ternary-expression-parser), [Number of Atoms](/problem/number-of-atoms), [Basic Calculator IV](/problem/basic-calculator-iv)
