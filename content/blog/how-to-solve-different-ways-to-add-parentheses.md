---
title: "How to Solve Different Ways to Add Parentheses — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Different Ways to Add Parentheses. Medium difficulty, 73.1% acceptance rate. Topics: Math, String, Dynamic Programming, Recursion, Memoization."
date: "2027-09-02"
category: "dsa-patterns"
tags: ["different-ways-to-add-parentheses", "math", "string", "dynamic-programming", "medium"]
---

# How to Solve Different Ways to Add Parentheses

This problem asks us to compute all possible results from evaluating an arithmetic expression by adding parentheses in every possible grouping. Given a string like `"2*3-4*5"`, we need to return all possible results like `[-34, -14, -10, -10, 10]`. What makes this problem interesting is that it's not about evaluating the expression in a standard way—it's about exploring **all possible binary tree structures** the expression could represent, where operators are internal nodes and numbers are leaves.

## Visual Walkthrough

Let's trace through a small example: `"2*3-4"`. This expression has two operators (`*` and `-`), so we can group it in two ways:

1. **Group `(2*3)` first**: `(2*3)-4 = 6-4 = 2`
2. **Group `(3-4)` first**: `2*(3-4) = 2*(-1) = -2`

But wait—there's actually a third grouping! When we have three numbers, we need to consider all possible binary trees with three leaves:

3. **Group as `(2*(3-4))`**: This is the same as case 2 above
4. **Group as `((2*3)-4)`**: This is the same as case 1 above

Actually, with `n` numbers, there are `C(n-1)` possible groupings, where `C(k)` is the k-th Catalan number. For `"2*3-4*5"` with three operators, there are 5 possible groupings:

- `(2*(3-(4*5))) = -34`
- `(2*((3-4)*5)) = -10`
- `((2*3)-(4*5)) = -14`
- `((2*(3-4))*5) = -10`
- `(((2*3)-4)*5) = 10`

The key insight: **Every operator can be the "last" operator to evaluate**, dividing the expression into left and right subproblems. We recursively compute all possible results for the left and right sides, then combine them using the current operator.

## Brute Force Approach

A naive approach would be to generate all possible parenthesizations, evaluate each one, and collect the results. We could try to:

1. Generate all binary tree structures for the expression
2. For each structure, evaluate the expression
3. Collect unique results

The problem with this approach is **exponential complexity**. For an expression with `n` operators, there are `C(n)` possible parenthesizations (Catalan numbers grow roughly as `4^n/(n√πn)`). Generating all trees explicitly would be complex and memory-intensive.

Even if we could generate them, we'd be doing redundant work. For example, in `"2*3-4*5"`, the subexpression `"4*5"` gets evaluated multiple times across different parenthesizations. A better approach avoids this redundancy.

## Optimized Approach

The optimal solution uses **divide-and-conquer with memoization**:

1. **Base case**: If the expression is just a number (no operators), return a list containing that number
2. **Recursive case**: For each operator in the expression:
   - Split the expression at that operator into left and right subexpressions
   - Recursively compute all possible results from the left side
   - Recursively compute all possible results from the right side
   - Combine each left result with each right result using the current operator
3. **Memoization**: Store results for subexpressions we've already computed to avoid redundant work

This works because every valid parenthesization corresponds to some operator being evaluated last. By trying each operator as the "last" one, we cover all possibilities.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(C_n) where C_n is the n-th Catalan number ≈ O(4^n/(n√n))
# Space: O(C_n) for storing all possible results
class Solution:
    def diffWaysToCompute(self, expression: str) -> List[int]:
        # Memoization dictionary: expression -> list of possible results
        memo = {}

        def compute(expr: str) -> List[int]:
            # If we've already computed this expression, return cached result
            if expr in memo:
                return memo[expr]

            results = []

            # Try every character in the expression
            for i, char in enumerate(expr):
                # If current character is an operator
                if char in '+-*':
                    # Split into left and right subexpressions
                    left_expr = expr[:i]
                    right_expr = expr[i+1:]

                    # Recursively compute all possible results for left side
                    left_results = compute(left_expr)
                    # Recursively compute all possible results for right side
                    right_results = compute(right_expr)

                    # Combine every left result with every right result
                    # using the current operator
                    for left_val in left_results:
                        for right_val in right_results:
                            if char == '+':
                                results.append(left_val + right_val)
                            elif char == '-':
                                results.append(left_val - right_val)
                            elif char == '*':
                                results.append(left_val * right_val)

            # Base case: if no operators were found, expression is just a number
            if not results:
                results.append(int(expr))

            # Memoize and return
            memo[expr] = results
            return results

        return compute(expression)
```

```javascript
// Time: O(C_n) where C_n is the n-th Catalan number ≈ O(4^n/(n√n))
// Space: O(C_n) for storing all possible results
/**
 * @param {string} expression
 * @return {number[]}
 */
var diffWaysToCompute = function (expression) {
  // Memoization map: expression -> array of possible results
  const memo = new Map();

  function compute(expr) {
    // If we've already computed this expression, return cached result
    if (memo.has(expr)) {
      return memo.get(expr);
    }

    const results = [];

    // Try every character in the expression
    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];

      // If current character is an operator
      if (char === "+" || char === "-" || char === "*") {
        // Split into left and right subexpressions
        const leftExpr = expr.substring(0, i);
        const rightExpr = expr.substring(i + 1);

        // Recursively compute all possible results for left side
        const leftResults = compute(leftExpr);
        // Recursively compute all possible results for right side
        const rightResults = compute(rightExpr);

        // Combine every left result with every right result
        // using the current operator
        for (const leftVal of leftResults) {
          for (const rightVal of rightResults) {
            if (char === "+") {
              results.push(leftVal + rightVal);
            } else if (char === "-") {
              results.push(leftVal - rightVal);
            } else if (char === "*") {
              results.push(leftVal * rightVal);
            }
          }
        }
      }
    }

    // Base case: if no operators were found, expression is just a number
    if (results.length === 0) {
      results.push(parseInt(expr));
    }

    // Memoize and return
    memo.set(expr, results);
    return results;
  }

  return compute(expression);
};
```

```java
// Time: O(C_n) where C_n is the n-th Catalan number ≈ O(4^n/(n√n))
// Space: O(C_n) for storing all possible results
class Solution {
    // Memoization map: expression -> list of possible results
    private Map<String, List<Integer>> memo = new HashMap<>();

    public List<Integer> diffWaysToCompute(String expression) {
        return compute(expression);
    }

    private List<Integer> compute(String expr) {
        // If we've already computed this expression, return cached result
        if (memo.containsKey(expr)) {
            return memo.get(expr);
        }

        List<Integer> results = new ArrayList<>();

        // Try every character in the expression
        for (int i = 0; i < expr.length(); i++) {
            char c = expr.charAt(i);

            // If current character is an operator
            if (c == '+' || c == '-' || c == '*') {
                // Split into left and right subexpressions
                String leftExpr = expr.substring(0, i);
                String rightExpr = expr.substring(i + 1);

                // Recursively compute all possible results for left side
                List<Integer> leftResults = compute(leftExpr);
                // Recursively compute all possible results for right side
                List<Integer> rightResults = compute(rightExpr);

                // Combine every left result with every right result
                // using the current operator
                for (int leftVal : leftResults) {
                    for (int rightVal : rightResults) {
                        if (c == '+') {
                            results.add(leftVal + rightVal);
                        } else if (c == '-') {
                            results.add(leftVal - rightVal);
                        } else if (c == '*') {
                            results.add(leftVal * rightVal);
                        }
                    }
                }
            }
        }

        // Base case: if no operators were found, expression is just a number
        if (results.isEmpty()) {
            results.add(Integer.parseInt(expr));
        }

        // Memoize and return
        memo.put(expr, results);
        return results;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: `O(C_n)` where `C_n` is the n-th Catalan number, approximately `O(4^n/(n√πn))`. This might seem scary, but in practice:

- Each expression with `k` operators generates `C_k` results
- We compute each subexpression exactly once due to memoization
- The Catalan number growth is inherent to the problem—there really are that many possible results

**Space Complexity**: `O(C_n)` for storing all possible results in the worst case. The memoization dictionary also takes `O(n * C_n)` space, but this is dominated by the results storage.

Why Catalan numbers? For an expression with `n` operators, the number of possible parenthesizations is the `n`-th Catalan number. Each parenthesization produces one result, so we have `C_n` results in the worst case.

## Common Mistakes

1. **Forgetting memoization**: Without memoization, you'll recompute the same subexpressions many times, leading to exponential time complexity. Always check if you've already computed a subproblem before recursing.

2. **Not handling multi-digit numbers**: The expression can contain numbers with more than one digit (like `"123"`). Make sure your base case converts the entire substring to an integer, not just single characters.

3. **Incorrect operator precedence handling**: This problem doesn't follow standard operator precedence—parentheses completely override it. Don't try to apply `*/` before `+-`; let the parentheses (implicit in our recursion) determine evaluation order.

4. **Missing the base case**: When an expression has no operators, it's just a number. Forgetting this base case will cause infinite recursion or empty results.

## When You'll See This Pattern

This **divide-and-conquer with memoization** pattern appears in problems where you need to explore all possible binary tree structures or partitionings:

1. **Unique Binary Search Trees II (LeetCode 95)**: Generate all structurally unique BSTs—similar to generating all parenthesizations, but with BST constraints instead of operators.

2. **Burst Balloons (LeetCode 312)**: Find maximum coins by bursting balloons in different orders—each "last balloon to burst" divides the problem into independent subproblems.

3. **Scramble String (LeetCode 87)**: Determine if strings are scrambled—try every possible split point and recursively check both swap and no-swap cases.

The core pattern: **For each possible "last operation" or "split point", recursively solve left and right subproblems, then combine results.**

## Key Takeaways

1. **Catalan numbers appear in binary tree counting problems**: When a problem involves all possible binary trees or parenthesizations, expect Catalan number complexity.

2. **Divide-and-conquer with memoization is powerful**: For problems with overlapping subproblems, memoization can turn exponential brute force into manageable complexity.

3. **Think about the "last operation"**: Many combinatorial problems become simpler when you consider what happens last, then recursively solve what comes before.

Related problems: [Unique Binary Search Trees II](/problem/unique-binary-search-trees-ii), [Basic Calculator](/problem/basic-calculator), [Expression Add Operators](/problem/expression-add-operators)
