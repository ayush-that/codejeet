---
title: "How to Solve Brace Expansion II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Brace Expansion II. Hard difficulty, 63.9% acceptance rate. Topics: Hash Table, String, Backtracking, Stack, Breadth-First Search."
date: "2029-05-17"
category: "dsa-patterns"
tags: ["brace-expansion-ii", "hash-table", "string", "backtracking", "hard"]
---

# How to Solve Brace Expansion II

Brace Expansion II is a challenging string parsing problem where you need to evaluate expressions containing nested braces, commas, and concatenation to generate all possible combinations. The tricky part is handling the grammar's recursive nature: braces can contain comma-separated lists (unions) or concatenated expressions, and these can be nested arbitrarily deep. This requires careful parsing and combination logic.

## Visual Walkthrough

Let's trace through the example `"{a,b}{c,{d,e}}"` step by step:

1. **Parse the expression**: We need to handle three operations:
   - Concatenation: `"a" + "b"` means combine every element from left with every element from right
   - Union (comma): `"a,b"` means the set containing both "a" and "b"
   - Nesting: `"{d,e}"` inside another expression

2. **Step-by-step evaluation**:
   - Start with `"{a,b}{c,{d,e}}"`
   - Evaluate inner braces first: `{d,e}` → `{"d", "e"}`
   - Now we have `"{a,b}{c,{"d","e"}}"`
   - Evaluate left part: `{a,b}` → `{"a", "b"}`
   - Evaluate right part: `{c,{d,e}}` → union of `{"c"}` and `{"d","e"}` → `{"c", "d", "e"}`
   - Concatenate left and right: For each in `{"a", "b"}` combine with each in `{"c", "d", "e"}`
   - Result: `{"ac", "ad", "ae", "bc", "bd", "be"}`

3. **Order matters**: We need to sort the final result and remove duplicates.

The key insight is that this is essentially evaluating an expression tree where:

- Braces `{...}` create nodes
- Commas represent union operations
- Adjacent expressions represent concatenation (Cartesian product)

## Brute Force Approach

A naive approach might try to generate all combinations by brute force recursion, but this quickly becomes unmanageable with nested expressions. The brute force would:

1. Parse the string character by character
2. Whenever encountering `{`, recursively process the contents
3. Handle concatenation by trying all possible splits

However, this approach fails because:

- It doesn't properly handle operator precedence (concatenation vs union)
- It would generate duplicate work for nested expressions
- The Cartesian product generation would be inefficient without proper data structures
- It's difficult to track the current parsing context

The main issue is that without a systematic way to parse the grammar, we end up with complex, bug-prone code that doesn't scale well with nesting depth.

## Optimized Approach

The optimal solution uses a **stack-based parser** that treats the problem as evaluating an expression with two operators:

1. **Comma (`,`)** - Union operator (lowest precedence)
2. **Concatenation** - Implicit operator when expressions are adjacent (higher precedence)

**Key insights:**

1. We can parse the expression similar to how we evaluate arithmetic expressions
2. Use two stacks: one for operands (sets of strings) and one for operators
3. When we see `{`, we push a marker to start a new expression
4. When we see `,`, we evaluate all pending concatenations before handling the union
5. When we see `}`, we evaluate everything until the matching `{`

**Step-by-step algorithm:**

1. Initialize empty stacks for operands and operators
2. Iterate through each character:
   - If letter: push as singleton set
   - If `{`: push as start of new group
   - If `,`: evaluate all pending concatenations, then push union operator
   - If `}`: evaluate everything in current group
3. After processing all characters, evaluate any remaining operations
4. Sort and deduplicate the final result

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * 2^n) in worst case | Space: O(2^n) for storing all combinations
class Solution:
    def braceExpansionII(self, expression: str) -> List[str]:
        """
        Main function to evaluate brace expansion expression.
        Uses stack-based parsing similar to expression evaluation.
        """
        # Stack for operands (sets of strings)
        operands = []
        # Stack for operators (',' for union, '' for concatenation)
        operators = []

        def evaluate():
            """Evaluate the top of the stack until we hit a start brace or empty."""
            # Pop operator if exists
            if operators and operators[-1] == ',':
                operators.pop()  # Remove the union operator
                # Pop two operands for union
                op2 = operands.pop()
                op1 = operands.pop()
                # Union is just set union
                operands.append(op1.union(op2))
            else:
                # Handle concatenation (implicit operator)
                # Pop last operand
                last = operands.pop()
                if operands and operands[-1] != '{':
                    # If there's another operand before, it's concatenation
                    prev = operands.pop()
                    # Cartesian product: combine every string from prev with every from last
                    new_set = set()
                    for s1 in prev:
                        for s2 in last:
                            new_set.add(s1 + s2)
                    operands.append(new_set)
                else:
                    # No previous operand, just push back
                    operands.append(last)

        for ch in expression:
            if ch == '{':
                # Start of a new group
                operands.append('{')
                operators.append('')
            elif ch == ',':
                # Union operator - evaluate all pending concatenations first
                while operators and operators[-1] == '':
                    evaluate()
                operators.append(',')
            elif ch == '}':
                # End of group - evaluate everything inside
                while operators and operators[-1] != '':
                    evaluate()
                # Remove the start brace marker
                operators.pop()  # Remove the '' operator
                # Pop the '{' from operands
                start_brace = operands.pop()
                # The actual set is now on top
                actual_set = operands.pop()
                operands.append(actual_set)
                # Evaluate any concatenation with previous expression
                evaluate()
            else:
                # Regular letter - push as singleton set
                operands.append({ch})
                # Evaluate concatenation if needed
                evaluate()

        # Final evaluation
        while operators:
            evaluate()

        # Convert set to sorted list
        result = sorted(operands[-1])
        return result
```

```javascript
// Time: O(n * 2^n) in worst case | Space: O(2^n) for storing all combinations
/**
 * @param {string} expression
 * @return {string[]}
 */
var braceExpansionII = function (expression) {
  // Stack for operands (sets of strings)
  let operands = [];
  // Stack for operators (',' for union, '' for concatenation)
  let operators = [];

  /**
   * Evaluate the top of the stack until we hit a start brace or empty.
   */
  const evaluate = () => {
    // Check if we have a union operator
    if (operators.length > 0 && operators[operators.length - 1] === ",") {
      operators.pop(); // Remove the union operator
      // Pop two operands for union
      const op2 = operands.pop();
      const op1 = operands.pop();
      // Union is just set union
      const unionSet = new Set([...op1, ...op2]);
      operands.push(unionSet);
    } else {
      // Handle concatenation (implicit operator)
      // Pop last operand
      const last = operands.pop();
      if (operands.length > 0 && operands[operands.length - 1] !== "{") {
        // If there's another operand before, it's concatenation
        const prev = operands.pop();
        // Cartesian product: combine every string from prev with every from last
        const newSet = new Set();
        for (const s1 of prev) {
          for (const s2 of last) {
            newSet.add(s1 + s2);
          }
        }
        operands.push(newSet);
      } else {
        // No previous operand, just push back
        operands.push(last);
      }
    }
  };

  for (let i = 0; i < expression.length; i++) {
    const ch = expression[i];

    if (ch === "{") {
      // Start of a new group
      operands.push("{");
      operators.push("");
    } else if (ch === ",") {
      // Union operator - evaluate all pending concatenations first
      while (operators.length > 0 && operators[operators.length - 1] === "") {
        evaluate();
      }
      operators.push(",");
    } else if (ch === "}") {
      // End of group - evaluate everything inside
      while (operators.length > 0 && operators[operators.length - 1] !== "") {
        evaluate();
      }
      // Remove the start brace marker
      operators.pop(); // Remove the '' operator
      // Pop the '{' from operands
      operands.pop(); // Remove the '{'
      // The actual set is now on top
      const actualSet = operands.pop();
      operands.push(actualSet);
      // Evaluate any concatenation with previous expression
      evaluate();
    } else {
      // Regular letter - push as singleton set
      operands.push(new Set([ch]));
      // Evaluate concatenation if needed
      evaluate();
    }
  }

  // Final evaluation
  while (operators.length > 0) {
    evaluate();
  }

  // Convert set to sorted array
  const result = Array.from(operands[0]).sort();
  return result;
};
```

```java
// Time: O(n * 2^n) in worst case | Space: O(2^n) for storing all combinations
class Solution {
    public List<String> braceExpansionII(String expression) {
        // Stack for operands (sets of strings)
        Stack<Set<String>> operands = new Stack<>();
        // Stack for operators (',' for union, '' for concatenation)
        Stack<Character> operators = new Stack<>();

        for (int i = 0; i < expression.length(); i++) {
            char ch = expression.charAt(i);

            if (ch == '{') {
                // Start of a new group
                operands.push(new HashSet<>());  // Placeholder
                operators.push(' ');
            } else if (ch == ',') {
                // Union operator - evaluate all pending concatenations first
                while (!operators.isEmpty() && operators.peek() == ' ') {
                    evaluate(operands, operators);
                }
                operators.push(',');
            } else if (ch == '}') {
                // End of group - evaluate everything inside
                while (!operators.isEmpty() && operators.peek() != ' ') {
                    evaluate(operands, operators);
                }
                // Remove the start brace marker
                operators.pop();  // Remove the ' ' operator
                // The actual set is now on top
                Set<String> actualSet = operands.pop();
                operands.push(actualSet);
                // Evaluate any concatenation with previous expression
                evaluate(operands, operators);
            } else {
                // Regular letter - push as singleton set
                Set<String> singleton = new HashSet<>();
                singleton.add(String.valueOf(ch));
                operands.push(singleton);
                // Evaluate concatenation if needed
                evaluate(operands, operators);
            }
        }

        // Final evaluation
        while (!operators.isEmpty()) {
            evaluate(operands, operators);
        }

        // Convert set to sorted list
        Set<String> resultSet = operands.pop();
        List<String> result = new ArrayList<>(resultSet);
        Collections.sort(result);
        return result;
    }

    private void evaluate(Stack<Set<String>> operands, Stack<Character> operators) {
        // Check if we have a union operator
        if (!operators.isEmpty() && operators.peek() == ',') {
            operators.pop();  // Remove the union operator
            // Pop two operands for union
            Set<String> op2 = operands.pop();
            Set<String> op1 = operands.pop();
            // Union is just set union
            Set<String> unionSet = new HashSet<>(op1);
            unionSet.addAll(op2);
            operands.push(unionSet);
        } else {
            // Handle concatenation (implicit operator)
            // Pop last operand
            Set<String> last = operands.pop();
            if (!operands.isEmpty() && !operands.peek().isEmpty()) {
                // If there's another operand before, it's concatenation
                Set<String> prev = operands.pop();
                // Cartesian product: combine every string from prev with every from last
                Set<String> newSet = new HashSet<>();
                for (String s1 : prev) {
                    for (String s2 : last) {
                        newSet.add(s1 + s2);
                    }
                }
                operands.push(newSet);
            } else {
                // No previous operand, just push back
                operands.push(last);
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n \* 2^n) in the worst case

- `n` is the length of the input expression
- The worst case occurs when we have deeply nested concatenations that generate exponential combinations
- Example: `"{a,b}{c,d}{e,f}"` generates 2³ = 8 combinations
- For each combination, we perform string concatenation which takes O(m) time where m is string length

**Space Complexity:** O(2^n) in the worst case

- We need to store all possible combinations in memory
- The stack depth is O(n) for nested expressions
- The result set can contain up to 2^n elements in worst case

The exponential factors come from the Cartesian product operations when concatenating sets. Each concatenation multiplies the number of combinations.

## Common Mistakes

1. **Not handling operator precedence correctly**: Forgetting that concatenation (adjacent expressions) has higher precedence than union (comma). This leads to wrong combinations like treating `"{a,b}{c,d}"` as `{a, b, c, d}` instead of `{ac, ad, bc, bd}`.

2. **Incorrect brace matching**: Not properly tracking nested braces. A stack-based approach helps, but candidates often forget to evaluate everything inside braces before closing them.

3. **Forgetting to sort and deduplicate**: The problem requires sorted output without duplicates. Candidates often return sets in arbitrary order or include duplicates from overlapping expansions.

4. **Inefficient Cartesian product implementation**: Using lists instead of sets for intermediate results leads to O(n²) concatenation instead of O(n\*m) for sets of size n and m.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Expression Evaluation**: Similar to Basic Calculator (LeetCode 224) or Evaluate Reverse Polish Notation (LeetCode 150), where you parse and evaluate expressions with operators and precedence.

2. **Backtracking/DFS for combinations**: Like Letter Combinations of a Phone Number (LeetCode 17) or Generate Parentheses (LeetCode 22), where you generate all possible combinations from choices.

3. **Stack-based parsing**: Common in problems with nested structures like Decode String (LeetCode 394) or Remove Duplicate Letters (LeetCode 316).

The key pattern is using stacks to handle nested structures and operator precedence, combined with combinatorial generation for the actual expansion.

## Key Takeaways

1. **Stack-based parsing is powerful for nested expressions**: When you see problems with parentheses, braces, or other nested structures, consider using stacks to track context and handle evaluation in the correct order.

2. **Treat implicit operators explicitly**: In this problem, concatenation is an implicit operator (no symbol between expressions). Making it explicit in your parsing logic simplifies the evaluation.

3. **Think in terms of expression trees**: Complex string parsing problems often become clearer when you model them as tree structures with operators and operands, even if you don't explicitly build the tree.

Related problems: [Brace Expansion](/problem/brace-expansion)
