---
title: "How to Solve Solve the Equation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Solve the Equation. Medium difficulty, 46.1% acceptance rate. Topics: Math, String, Simulation."
date: "2028-07-27"
category: "dsa-patterns"
tags: ["solve-the-equation", "math", "string", "simulation", "medium"]
---

# Solving "Solve the Equation": A Step-by-Step Guide

This problem asks us to solve a linear equation in one variable (x) and return the solution as a string like `"x=2"`. The equation contains only `+`, `-`, numbers, and the variable `x`. We need to handle special cases: return `"No solution"` if the equation is contradictory (like `x+1=x+2`), and `"Infinite solutions"` if it's always true (like `x+1=x+1`).

What makes this problem interesting is that it combines string parsing with basic algebra. You can't just evaluate the equation directly—you need to parse it into coefficients and constants, then apply algebraic reasoning. The tricky part is handling the parsing correctly while tracking signs and coefficients.

## Visual Walkthrough

Let's trace through an example: `"x+5-3+x=6+x-2"`

**Step 1: Split at the equals sign**

- Left side: `"x+5-3+x"`
- Right side: `"6+x-2"`

**Step 2: Parse each side into x-coefficients and constants**
We'll move everything to the left side by subtracting the right side:

For the left side (`"x+5-3+x"`):

- Start with coefficient = 0, constant = 0
- `"x"` → coefficient += 1 (coefficient = 1)
- `"+5"` → constant += 5 (constant = 5)
- `"-3"` → constant += -3 (constant = 2)
- `"+x"` → coefficient += 1 (coefficient = 2)

For the right side (`"6+x-2"`):

- `"6"` → when moving to left: constant += -6
- `"+x"` → when moving to left: coefficient += -1
- `"-2"` → when moving to left: constant += 2

**Step 3: Combine everything on left side**

- Total coefficient: 2 + (-1) = 1
- Total constant: 2 + (-6) + 2 = -2

**Step 4: Solve the equation**
We have: `1*x + (-2) = 0` → `x = 2`

**Step 5: Format the answer**
Return `"x=2"`

## Brute Force Approach

A naive approach might try to evaluate the equation for different x values, but this doesn't work because:

1. We don't know what range of x values to try
2. We need to handle "no solution" and "infinite solutions" cases
3. It would be extremely inefficient

Another brute force approach would be to parse the equation character by character with complex state tracking, but this often leads to bugs with:

- Handling multi-digit numbers
- Tracking signs correctly when moving terms across the equals sign
- Distinguishing between "x", "-x", "2x", etc.

The key insight is that we need a systematic parsing approach that separates coefficient collection from constant collection.

## Optimized Approach

The optimal approach uses these steps:

1. **Split the equation** at `=` into left and right expressions
2. **Parse each expression** to extract:
   - Total coefficient of x (sum of all x terms)
   - Total constant (sum of all number terms)
3. **Move all terms to the left side** by subtracting right side values
4. **Solve the simplified equation** `a*x + b = 0`:
   - If `a == 0` and `b == 0`: infinite solutions
   - If `a == 0` and `b != 0`: no solution
   - Otherwise: `x = -b/a`
5. **Format the result** as required

The parsing is the tricky part. We need to:

- Handle signs correctly (each term has a sign)
- Parse multi-digit numbers
- Identify x terms vs constant terms
- Handle standalone "x" vs "nx" where n is a coefficient

We'll use a helper function that parses an expression given its starting sign.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is length of equation | Space: O(1)
class Solution:
    def solveEquation(self, equation: str) -> str:
        def parse_expression(expr, sign_multiplier):
            """
            Parse an expression and update coefficient and constant totals.
            sign_multiplier: 1 for left side, -1 for right side (when moving to left)
            """
            i = 0
            n = len(expr)

            while i < n:
                # Determine the sign of the current term
                sign = 1
                if expr[i] == '+':
                    i += 1
                elif expr[i] == '-':
                    sign = -1
                    i += 1

                # Parse the number (coefficient or constant)
                num = 0
                has_num = False
                while i < n and expr[i].isdigit():
                    num = num * 10 + int(expr[i])
                    i += 1
                    has_num = True

                # Check if this term contains 'x'
                if i < n and expr[i] == 'x':
                    # If no number before 'x', coefficient is 1
                    coeff = num if has_num else 1
                    # Update total coefficient with proper sign
                    coefficient[0] += sign_multiplier * sign * coeff
                    i += 1  # Skip 'x'
                else:
                    # This is a constant term
                    const = num if has_num else 0
                    # Update total constant with proper sign
                    constant[0] += sign_multiplier * sign * const

        # Split equation into left and right sides
        left, right = equation.split('=')

        # coefficient[0] will store total coefficient of x on left side
        # constant[0] will store total constant on left side
        coefficient = [0]
        constant = [0]

        # Parse left side (terms stay as is, so sign_multiplier = 1)
        parse_expression(left, 1)
        # Parse right side (terms move to left, so sign_multiplier = -1)
        parse_expression(right, -1)

        # Now we have: coefficient * x + constant = 0

        # Handle special cases
        if coefficient[0] == 0:
            if constant[0] == 0:
                return "Infinite solutions"
            else:
                return "No solution"

        # Solve for x: x = -constant / coefficient
        result = -constant[0] // coefficient[0]
        return f"x={result}"
```

```javascript
// Time: O(n) where n is length of equation | Space: O(1)
var solveEquation = function (equation) {
  // Arrays to store coefficient and constant (using arrays to pass by reference)
  let coefficient = [0];
  let constant = [0];

  // Helper function to parse an expression
  const parseExpression = (expr, signMultiplier) => {
    let i = 0;
    const n = expr.length;

    while (i < n) {
      // Determine sign of current term
      let sign = 1;
      if (expr[i] === "+") {
        i++;
      } else if (expr[i] === "-") {
        sign = -1;
        i++;
      }

      // Parse the number (coefficient or constant)
      let num = 0;
      let hasNum = false;
      while (i < n && expr[i] >= "0" && expr[i] <= "9") {
        num = num * 10 + parseInt(expr[i]);
        i++;
        hasNum = true;
      }

      // Check if this term contains 'x'
      if (i < n && expr[i] === "x") {
        // If no number before 'x', coefficient is 1
        const coeff = hasNum ? num : 1;
        // Update total coefficient with proper sign
        coefficient[0] += signMultiplier * sign * coeff;
        i++; // Skip 'x'
      } else {
        // This is a constant term
        const constVal = hasNum ? num : 0;
        // Update total constant with proper sign
        constant[0] += signMultiplier * sign * constVal;
      }
    }
  };

  // Split equation into left and right sides
  const [left, right] = equation.split("=");

  // Parse left side (terms stay as is)
  parseExpression(left, 1);
  // Parse right side (terms move to left, so multiply by -1)
  parseExpression(right, -1);

  // Now we have: coefficient * x + constant = 0

  // Handle special cases
  if (coefficient[0] === 0) {
    if (constant[0] === 0) {
      return "Infinite solutions";
    } else {
      return "No solution";
    }
  }

  // Solve for x: x = -constant / coefficient
  const result = -constant[0] / coefficient[0];
  return `x=${result}`;
};
```

```java
// Time: O(n) where n is length of equation | Space: O(1)
class Solution {
    // Using arrays to simulate pass-by-reference for coefficient and constant
    private int[] coefficient = new int[1];
    private int[] constant = new int[1];

    public String solveEquation(String equation) {
        // Split equation into left and right sides
        String[] parts = equation.split("=");
        String left = parts[0];
        String right = parts[1];

        // Parse left side (terms stay as is)
        parseExpression(left, 1);
        // Parse right side (terms move to left, so multiply by -1)
        parseExpression(right, -1);

        // Now we have: coefficient * x + constant = 0

        // Handle special cases
        if (coefficient[0] == 0) {
            if (constant[0] == 0) {
                return "Infinite solutions";
            } else {
                return "No solution";
            }
        }

        // Solve for x: x = -constant / coefficient
        int result = -constant[0] / coefficient[0];
        return "x=" + result;
    }

    private void parseExpression(String expr, int signMultiplier) {
        int i = 0;
        int n = expr.length();

        while (i < n) {
            // Determine sign of current term
            int sign = 1;
            if (expr.charAt(i) == '+') {
                i++;
            } else if (expr.charAt(i) == '-') {
                sign = -1;
                i++;
            }

            // Parse the number (coefficient or constant)
            int num = 0;
            boolean hasNum = false;
            while (i < n && Character.isDigit(expr.charAt(i))) {
                num = num * 10 + (expr.charAt(i) - '0');
                i++;
                hasNum = true;
            }

            // Check if this term contains 'x'
            if (i < n && expr.charAt(i) == 'x') {
                // If no number before 'x', coefficient is 1
                int coeff = hasNum ? num : 1;
                // Update total coefficient with proper sign
                coefficient[0] += signMultiplier * sign * coeff;
                i++; // Skip 'x'
            } else {
                // This is a constant term
                int constVal = hasNum ? num : 0;
                // Update total constant with proper sign
                constant[0] += signMultiplier * sign * constVal;
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the entire equation string once during parsing
- Each character is processed exactly once
- The split operation also takes O(n) time

**Space Complexity: O(1)**

- We only use a few variables to track coefficients and constants
- No additional data structures that grow with input size
- Even the recursive call stack is constant depth (no recursion used)

## Common Mistakes

1. **Not handling multi-digit numbers correctly**: Candidates often parse digits one at a time but forget to build the complete number. Remember: `"123"` is one hundred twenty-three, not 1+2+3.

2. **Forgetting that 'x' alone has coefficient 1**: When you see just `"x"` or `"-x"`, the coefficient is 1 or -1, not 0. This is a common oversight.

3. **Sign errors when moving terms across equals**: Remember that when you move a term from right to left, you need to flip its sign. A common mistake is to parse both sides positively and then wonder why the equation doesn't balance.

4. **Not handling the "no number" case for constants**: When you have a sign without a following number (which shouldn't happen in valid input), you need to handle it gracefully by treating it as 0.

## When You'll See This Pattern

This problem combines string parsing with algebraic simplification—a pattern that appears in several other LeetCode problems:

1. **Fraction Addition and Subtraction (LeetCode 592)**: Similar parsing challenge where you need to parse fractions, perform arithmetic, and simplify results. The string parsing for numbers and signs is very similar.

2. **Basic Calculator (LeetCode 224)**: More complex version with parentheses, but the core of parsing expressions with signs and numbers is the same.

3. **Decode String (LeetCode 394)**: While different in content, it requires similar careful parsing of nested structures with numbers and repetitions.

The key pattern is "tokenization and accumulation": breaking a string into meaningful tokens (numbers, variables, operators) and accumulating results according to rules.

## Key Takeaways

1. **Separate parsing from solving**: First parse the equation to extract coefficients and constants, then apply mathematical reasoning. Don't try to solve while parsing.

2. **Use sign tracking systematically**: Each term has a sign, and when moving terms across the equals sign, you need to multiply by -1. Keep this logic clean and separate.

3. **Handle edge cases mathematically**: The special cases ("no solution", "infinite solutions") come from the mathematical properties of the equation `ax + b = 0`, not from string parsing quirks.

Related problems: [Fraction Addition and Subtraction](/problem/fraction-addition-and-subtraction), [Minimize Result by Adding Parentheses to Expression](/problem/minimize-result-by-adding-parentheses-to-expression)
