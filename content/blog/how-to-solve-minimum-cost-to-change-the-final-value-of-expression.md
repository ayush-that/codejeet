---
title: "How to Solve Minimum Cost to Change the Final Value of Expression — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Change the Final Value of Expression. Hard difficulty, 51.2% acceptance rate. Topics: Math, String, Dynamic Programming, Stack."
date: "2026-08-27"
category: "dsa-patterns"
tags:
  [
    "minimum-cost-to-change-the-final-value-of-expression",
    "math",
    "string",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Minimum Cost to Change the Final Value of Expression

This problem asks us to find the minimum number of character changes needed to flip the boolean value of a valid boolean expression. The expression contains `'1'`, `'0'`, `'&'`, `'|'`, `'('`, and `')'`, and follows standard boolean evaluation rules. What makes this problem tricky is that we need to consider how changing operators or operands affects the final result, and parentheses create nested subexpressions that must be handled recursively.

## Visual Walkthrough

Let's trace through a simple example: `"1|(0&1)"`

1. **Original evaluation**: `1|(0&1) = 1|0 = 1`
2. **Goal**: Change the final value from `1` to `0`
3. **Possible changes**:
   - Change `1` to `0`: `0|(0&1) = 0|0 = 0` → 1 change
   - Change `|` to `&`: `1&(0&1) = 1&0 = 0` → 1 change
   - Change `0` to `1`: `1|(1&1) = 1|1 = 1` → doesn't work
   - Change `&` to `|`: `1|(0|1) = 1|1 = 1` → doesn't work

The minimum cost is 1. But for more complex expressions, we need a systematic approach. The key insight is that for any subexpression, we can track two values: the minimum cost to make it evaluate to `0` and the minimum cost to make it evaluate to `1`.

## Brute Force Approach

A naive approach would be to try changing every character (operator or operand) and evaluate the expression each time:

1. Generate all possible single-character changes
2. For each changed expression, evaluate it
3. Count how many changes produce the opposite final value
4. Return the minimum number of changes

However, this approach has several problems:

- Changing parentheses would create invalid expressions
- We'd need to handle operator precedence correctly
- For an expression of length `n`, there are `O(n)` possible changes
- Each evaluation takes `O(n)` time
- Total time: `O(n²)`, which is too slow for `n` up to 10⁵

More importantly, this approach doesn't consider that changing one character might require changing others to achieve the desired result, or that we might need to change multiple characters.

## Optimized Approach

The optimal solution uses **dynamic programming with a stack** to handle the expression parsing and computation. Here's the step-by-step reasoning:

1. **Expression parsing**: We need to evaluate the expression with proper operator precedence. Since `&` and `|` have the same precedence and evaluation is left-to-right, we can use a stack to handle parentheses and operators.

2. **DP states**: For each subexpression, we maintain:
   - `dp0`: minimum cost to make this subexpression evaluate to `0`
   - `dp1`: minimum cost to make this subexpression evaluate to `1`

3. **Base cases**:
   - For operand `'1'`: `dp0 = 1` (change `1` to `0`), `dp1 = 0` (already `1`)
   - For operand `'0'`: `dp0 = 0` (already `0`), `dp1 = 1` (change `0` to `1`)

4. **Combining subexpressions**: When we apply an operator between two subexpressions:
   - For `&` (AND):
     - To get `0`: either left=0 and right=any, or left=any and right=0, or change `&` to `|` (cost 1) and have left=0 and right=0
     - To get `1`: both left=1 and right=1
   - For `|` (OR):
     - To get `0`: both left=0 and right=0
     - To get `1`: either left=1 and right=any, or left=any and right=1, or change `|` to `&` (cost 1) and have left=1 and right=1

5. **Stack implementation**: We use two stacks:
   - `operand_stack`: stores `(dp0, dp1)` pairs for subexpressions
   - `operator_stack`: stores operators and parentheses

6. **Processing**: We iterate through the expression:
   - If we see `'('`, push it to operator stack
   - If we see `'0'` or `'1'`, compute its DP values and push to operand stack
   - If we see `'&'` or `'|'`, process any pending operators with higher or equal precedence
   - If we see `')'`, process operators until we find the matching `'('`

7. **Final answer**: After processing the entire expression, we have DP values for the whole expression. If the original evaluates to `0`, we return `dp1`. If it evaluates to `1`, we return `dp0`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minOperationsToFlip(expression: str) -> int:
    """
    Returns the minimum number of operations to flip the boolean value
    of the given valid boolean expression.
    """
    # Stack for operands: each element is (cost_to_make_0, cost_to_make_1)
    operand_stack = []
    # Stack for operators and parentheses
    operator_stack = []

    def apply_operator():
        """Apply the top operator to the top two operands."""
        if len(operand_stack) < 2 or not operator_stack:
            return

        op = operator_stack.pop()
        right_dp0, right_dp1 = operand_stack.pop()
        left_dp0, left_dp1 = operand_stack.pop()

        if op == '&':
            # For AND operator:
            # To get 0: min(left=0 + right=any, left=any + right=0,
            #             change & to | (cost 1) + left=0 + right=0)
            # To get 1: left=1 + right=1
            new_dp0 = min(left_dp0 + right_dp0,
                         left_dp0 + right_dp1,
                         left_dp1 + right_dp0,
                         left_dp0 + right_dp0 + 1)  # Change & to |
            new_dp1 = left_dp1 + right_dp1
        else:  # op == '|'
            # For OR operator:
            # To get 0: left=0 + right=0
            # To get 1: min(left=1 + right=any, left=any + right=1,
            #             change | to & (cost 1) + left=1 + right=1)
            new_dp0 = left_dp0 + right_dp0
            new_dp1 = min(left_dp1 + right_dp1,
                         left_dp1 + right_dp0,
                         left_dp0 + right_dp1,
                         left_dp1 + right_dp1 + 1)  # Change | to &

        operand_stack.append((new_dp0, new_dp1))

    for ch in expression:
        if ch == '(':
            operator_stack.append(ch)
        elif ch == '0' or ch == '1':
            # Base case: operand '0' or '1'
            if ch == '0':
                # cost to make 0: 0 (already 0), cost to make 1: 1 (change 0 to 1)
                operand_stack.append((0, 1))
            else:  # ch == '1'
                # cost to make 0: 1 (change 1 to 0), cost to make 1: 0 (already 1)
                operand_stack.append((1, 0))
        elif ch == '&' or ch == '|':
            # Process operators with same or higher precedence
            # In this case, & and | have same precedence and are left-associative
            while operator_stack and operator_stack[-1] != '(':
                apply_operator()
            operator_stack.append(ch)
        elif ch == ')':
            # Process all operators until we find the matching '('
            while operator_stack and operator_stack[-1] != '(':
                apply_operator()
            # Remove the '('
            if operator_stack:
                operator_stack.pop()

    # Process any remaining operators
    while operator_stack:
        apply_operator()

    # The final result is at the top of operand_stack
    final_dp0, final_dp1 = operand_stack[-1]

    # The expression evaluates to 1 if dp1 cost is 0, else 0
    # We need to flip the value, so return the opposite cost
    return final_dp1 if final_dp0 == 0 else final_dp0
```

```javascript
// Time: O(n) | Space: O(n)
function minOperationsToFlip(expression) {
  // Stack for operands: each element is [cost_to_make_0, cost_to_make_1]
  const operandStack = [];
  // Stack for operators and parentheses
  const operatorStack = [];

  const applyOperator = () => {
    // Apply the top operator to the top two operands
    if (operandStack.length < 2 || operatorStack.length === 0) {
      return;
    }

    const op = operatorStack.pop();
    const [rightDp0, rightDp1] = operandStack.pop();
    const [leftDp0, leftDp1] = operandStack.pop();

    let newDp0, newDp1;

    if (op === "&") {
      // For AND operator
      newDp0 = Math.min(
        leftDp0 + rightDp0,
        leftDp0 + rightDp1,
        leftDp1 + rightDp0,
        leftDp0 + rightDp0 + 1 // Change & to |
      );
      newDp1 = leftDp1 + rightDp1;
    } else {
      // op === '|'
      // For OR operator
      newDp0 = leftDp0 + rightDp0;
      newDp1 = Math.min(
        leftDp1 + rightDp1,
        leftDp1 + rightDp0,
        leftDp0 + rightDp1,
        leftDp1 + rightDp1 + 1 // Change | to &
      );
    }

    operandStack.push([newDp0, newDp1]);
  };

  for (const ch of expression) {
    if (ch === "(") {
      operatorStack.push(ch);
    } else if (ch === "0" || ch === "1") {
      // Base case: operand '0' or '1'
      if (ch === "0") {
        // cost to make 0: 0 (already 0), cost to make 1: 1 (change 0 to 1)
        operandStack.push([0, 1]);
      } else {
        // ch === '1'
        // cost to make 0: 1 (change 1 to 0), cost to make 1: 0 (already 1)
        operandStack.push([1, 0]);
      }
    } else if (ch === "&" || ch === "|") {
      // Process operators with same or higher precedence
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
        applyOperator();
      }
      operatorStack.push(ch);
    } else if (ch === ")") {
      // Process all operators until we find the matching '('
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
        applyOperator();
      }
      // Remove the '('
      if (operatorStack.length > 0) {
        operatorStack.pop();
      }
    }
  }

  // Process any remaining operators
  while (operatorStack.length > 0) {
    applyOperator();
  }

  // The final result is at the top of operandStack
  const [finalDp0, finalDp1] = operandStack[operandStack.length - 1];

  // The expression evaluates to 1 if dp1 cost is 0, else 0
  // We need to flip the value, so return the opposite cost
  return finalDp0 === 0 ? finalDp1 : finalDp0;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int minOperationsToFlip(String expression) {
        // Stack for operands: each element is int[]{cost_to_make_0, cost_to_make_1}
        Stack<int[]> operandStack = new Stack<>();
        // Stack for operators and parentheses
        Stack<Character> operatorStack = new Stack<>();

        for (char ch : expression.toCharArray()) {
            if (ch == '(') {
                operatorStack.push(ch);
            } else if (ch == '0' || ch == '1') {
                // Base case: operand '0' or '1'
                if (ch == '0') {
                    // cost to make 0: 0 (already 0), cost to make 1: 1 (change 0 to 1)
                    operandStack.push(new int[]{0, 1});
                } else { // ch == '1'
                    // cost to make 0: 1 (change 1 to 0), cost to make 1: 0 (already 1)
                    operandStack.push(new int[]{1, 0});
                }
            } else if (ch == '&' || ch == '|') {
                // Process operators with same or higher precedence
                while (!operatorStack.isEmpty() && operatorStack.peek() != '(') {
                    applyOperator(operandStack, operatorStack);
                }
                operatorStack.push(ch);
            } else if (ch == ')') {
                // Process all operators until we find the matching '('
                while (!operatorStack.isEmpty() && operatorStack.peek() != '(') {
                    applyOperator(operandStack, operatorStack);
                }
                // Remove the '('
                if (!operatorStack.isEmpty()) {
                    operatorStack.pop();
                }
            }
        }

        // Process any remaining operators
        while (!operatorStack.isEmpty()) {
            applyOperator(operandStack, operatorStack);
        }

        // The final result is at the top of operandStack
        int[] finalDp = operandStack.peek();
        int finalDp0 = finalDp[0];
        int finalDp1 = finalDp[1];

        // The expression evaluates to 1 if dp1 cost is 0, else 0
        // We need to flip the value, so return the opposite cost
        return finalDp0 == 0 ? finalDp1 : finalDp0;
    }

    private void applyOperator(Stack<int[]> operandStack, Stack<Character> operatorStack) {
        // Apply the top operator to the top two operands
        if (operandStack.size() < 2 || operatorStack.isEmpty()) {
            return;
        }

        char op = operatorStack.pop();
        int[] rightDp = operandStack.pop();
        int[] leftDp = operandStack.pop();

        int leftDp0 = leftDp[0], leftDp1 = leftDp[1];
        int rightDp0 = rightDp[0], rightDp1 = rightDp[1];

        int newDp0, newDp1;

        if (op == '&') {
            // For AND operator
            newDp0 = Math.min(Math.min(leftDp0 + rightDp0, leftDp0 + rightDp1),
                             Math.min(leftDp1 + rightDp0, leftDp0 + rightDp0 + 1)); // Change & to |
            newDp1 = leftDp1 + rightDp1;
        } else { // op == '|'
            // For OR operator
            newDp0 = leftDp0 + rightDp0;
            newDp1 = Math.min(Math.min(leftDp1 + rightDp1, leftDp1 + rightDp0),
                             Math.min(leftDp0 + rightDp1, leftDp1 + rightDp1 + 1)); // Change | to &
        }

        operandStack.push(new int[]{newDp0, newDp1});
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character in the expression exactly once
- Each character results in at most a constant number of stack operations
- The `apply_operator` function runs in O(1) time

**Space Complexity: O(n)**

- In the worst case (deeply nested parentheses), both stacks can grow to O(n)
- Each stack element stores either a character or a pair of integers
- The total space used is proportional to the expression length

## Common Mistakes

1. **Not considering operator changes**: Candidates often only consider changing operands (`0` to `1` or `1` to `0`) but forget that changing an operator (`&` to `|` or `|` to `&`) with cost 1 can sometimes be cheaper than changing multiple operands.

2. **Incorrect DP transition formulas**: The formulas for combining DP values are subtle. For example, for `&` to get `0`, you need to consider all cases where at least one side is `0`, PLUS the case where you change `&` to `|` and both sides are `0`.

3. **Handling parentheses incorrectly**: Forgetting to process operators before a closing parenthesis `')'` or not properly matching parentheses can lead to wrong evaluation order.

4. **Not optimizing the DP combinations**: Some candidates try all combinations of changing left/right subexpressions, which leads to exponential time. The key is to realize we only need the minimum costs for each target value.

## When You'll See This Pattern

This problem combines **expression parsing with stacks** and **dynamic programming on trees**:

1. **Basic Calculator problems** (LeetCode 224, 227): These also use stacks to parse expressions with operators and parentheses, though they don't have the DP component.

2. **Parse Boolean Expression** (LeetCode 1106): Similar boolean expression parsing, but focuses on evaluation rather than modification costs.

3. **Binary Tree Cameras** (LeetCode 968): While not about expressions, it uses similar DP on trees where each node has states (like `dp0`, `dp1`, `dp2` in that problem).

The pattern is: when you need to process nested structures (expressions, trees) and compute optimal values bottom-up, consider stack-based parsing combined with DP.

## Key Takeaways

1. **Stack-based expression parsing** is essential for handling operators and parentheses in the correct order. Remember that `&` and `|` have the same precedence and are left-associative.

2. **DP with multiple states** per subproblem: When you need to track different "goals" or "states" for each subproblem (like making a subexpression evaluate to `0` or `1`), maintain separate DP values for each state.

3. **Consider all modification types**: When computing minimum changes, don't just think about changing leaf values. Consider changing internal nodes (operators) too, as this can sometimes be cheaper.

[Practice this problem on CodeJeet](/problem/minimum-cost-to-change-the-final-value-of-expression)
