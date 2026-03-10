---
title: "How to Solve Fraction Addition and Subtraction — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Fraction Addition and Subtraction. Medium difficulty, 66.4% acceptance rate. Topics: Math, String, Simulation."
date: "2026-11-17"
category: "dsa-patterns"
tags: ["fraction-addition-and-subtraction", "math", "string", "simulation", "medium"]
---

# How to Solve Fraction Addition and Subtraction

This problem asks us to evaluate a string containing fraction addition and subtraction operations (like `"-1/2+1/3"`) and return the result as a reduced fraction. What makes this tricky is that we need to parse the string while handling signs correctly, compute with fractions without floating-point errors, and finally reduce the result to its simplest form. The challenge lies in the string parsing and the mathematical operations on fractions.

## Visual Walkthrough

Let's trace through the example `"-1/2+1/3-1/6"`:

1. **Parse the first fraction**: `-1/2`
   - Numerator = -1, denominator = 2
   - Current result: -1/2

2. **Parse the next fraction**: `+1/3`
   - Numerator = 1, denominator = 3
   - To add -1/2 and 1/3, we need a common denominator (LCM of 2 and 3 = 6):
     - -1/2 becomes -3/6
     - 1/3 becomes 2/6
     - Sum: (-3 + 2)/6 = -1/6
   - Current result: -1/6

3. **Parse the next fraction**: `-1/6`
   - Numerator = -1, denominator = 6
   - Current denominator is 6, so we can directly add:
     - (-1 + -1)/6 = -2/6
   - Current result: -2/6

4. **Reduce the fraction**: -2/6
   - GCD of 2 and 6 is 2
   - Divide numerator and denominator by 2: -1/3
   - Final answer: `"-1/3"`

The key insight is that we can process fractions one by one, maintaining a running sum, and only reduce at the end.

## Brute Force Approach

A naive approach might try to evaluate the entire expression as a string using `eval()`, but this won't work because:

1. Fractions aren't valid Python/JavaScript/Java syntax
2. We need exact fraction arithmetic, not floating-point
3. We must return the result in reduced form

Another brute force approach would be to parse all fractions into a list, then repeatedly add them two at a time, finding LCM each time. While this would work, it's inefficient because:

- We'd compute LCM multiple times unnecessarily
- The code would be more complex than needed
- Each addition would require reducing the intermediate result

The real challenge isn't algorithmic complexity (the expression length is limited), but rather handling the parsing and fraction arithmetic correctly.

## Optimized Approach

The optimal approach has three main steps:

1. **Parse the expression**: Split it into individual fractions with their signs. Each fraction has the format `±a/b` where `a` and `b` are integers.

2. **Accumulate the sum**: For each fraction `a/b`, add it to the running sum `num/den`. To add fractions:
   - Find the common denominator = `den * b / gcd(den, b)` (LCM)
   - Convert both fractions to have this denominator
   - Add the numerators
   - Keep the common denominator

3. **Reduce the final result**: Find the GCD of the numerator and denominator, then divide both by it.

The key optimization is realizing we don't need to reduce after each addition—we can wait until the end. This simplifies the code and avoids unnecessary GCD calculations.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is the length of the expression
# Space: O(1) excluding the input string
class Solution:
    def fractionAddition(self, expression: str) -> str:
        # Step 1: Initialize numerator and denominator of running sum
        # Start with 0/1 (neutral element for addition)
        num, den = 0, 1

        i, n = 0, len(expression)

        while i < n:
            # Step 2: Parse the sign
            # If the expression doesn't start with a sign, it's positive
            sign = 1
            if expression[i] == '-' or expression[i] == '+':
                sign = -1 if expression[i] == '-' else 1
                i += 1

            # Step 3: Parse the numerator
            # Read digits until we hit '/'
            numerator = 0
            while i < n and expression[i].isdigit():
                numerator = numerator * 10 + int(expression[i])
                i += 1

            # Apply the sign to the numerator
            numerator *= sign

            # Skip the '/' character
            i += 1

            # Step 4: Parse the denominator
            denominator = 0
            while i < n and expression[i].isdigit():
                denominator = denominator * 10 + int(expression[i])
                i += 1

            # Step 5: Add the current fraction to the running sum
            # To add a/b + c/d, we compute (a*d + c*b) / (b*d)
            # But we need to reduce to avoid overflow, so we use LCM
            # Common denominator = lcm(den, denominator)
            common_den = self.lcm(den, denominator)

            # Convert both fractions to have the common denominator
            # num/den becomes (num * (common_den // den))
            # numerator/denominator becomes (numerator * (common_den // denominator))
            num = num * (common_den // den) + numerator * (common_den // denominator)
            den = common_den

        # Step 6: Reduce the final fraction
        # Find the greatest common divisor
        g = self.gcd(abs(num), den)

        # Divide both numerator and denominator by GCD
        num //= g
        den //= g

        # Return as string in format "num/den"
        return f"{num}/{den}"

    def gcd(self, a: int, b: int) -> int:
        # Euclidean algorithm for GCD
        while b != 0:
            a, b = b, a % b
        return a

    def lcm(self, a: int, b: int) -> int:
        # LCM(a, b) = a * b / GCD(a, b)
        return a * b // self.gcd(a, b)
```

```javascript
// Time: O(n) where n is the length of the expression
// Space: O(1) excluding the input string
var fractionAddition = function (expression) {
  // Step 1: Initialize numerator and denominator of running sum
  // Start with 0/1 (neutral element for addition)
  let num = 0,
    den = 1;

  let i = 0,
    n = expression.length;

  while (i < n) {
    // Step 2: Parse the sign
    // If the expression doesn't start with a sign, it's positive
    let sign = 1;
    if (expression[i] === "-" || expression[i] === "+") {
      sign = expression[i] === "-" ? -1 : 1;
      i++;
    }

    // Step 3: Parse the numerator
    // Read digits until we hit '/'
    let numerator = 0;
    while (i < n && expression[i] >= "0" && expression[i] <= "9") {
      numerator = numerator * 10 + parseInt(expression[i]);
      i++;
    }

    // Apply the sign to the numerator
    numerator *= sign;

    // Skip the '/' character
    i++;

    // Step 4: Parse the denominator
    let denominator = 0;
    while (i < n && expression[i] >= "0" && expression[i] <= "9") {
      denominator = denominator * 10 + parseInt(expression[i]);
      i++;
    }

    // Step 5: Add the current fraction to the running sum
    // Common denominator = lcm(den, denominator)
    let commonDen = lcm(den, denominator);

    // Convert both fractions to have the common denominator
    // num/den becomes (num * (commonDen / den))
    // numerator/denominator becomes (numerator * (commonDen / denominator))
    num = num * (commonDen / den) + numerator * (commonDen / denominator);
    den = commonDen;
  }

  // Step 6: Reduce the final fraction
  // Find the greatest common divisor
  let g = gcd(Math.abs(num), den);

  // Divide both numerator and denominator by GCD
  num /= g;
  den /= g;

  // Return as string in format "num/den"
  return `${num}/${den}`;
};

// Euclidean algorithm for GCD
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

// LCM(a, b) = a * b / GCD(a, b)
function lcm(a, b) {
  return (a * b) / gcd(a, b);
}
```

```java
// Time: O(n) where n is the length of the expression
// Space: O(1) excluding the input string
class Solution {
    public String fractionAddition(String expression) {
        // Step 1: Initialize numerator and denominator of running sum
        // Start with 0/1 (neutral element for addition)
        int num = 0, den = 1;

        int i = 0, n = expression.length();

        while (i < n) {
            // Step 2: Parse the sign
            // If the expression doesn't start with a sign, it's positive
            int sign = 1;
            if (expression.charAt(i) == '-' || expression.charAt(i) == '+') {
                sign = expression.charAt(i) == '-' ? -1 : 1;
                i++;
            }

            // Step 3: Parse the numerator
            // Read digits until we hit '/'
            int numerator = 0;
            while (i < n && Character.isDigit(expression.charAt(i))) {
                numerator = numerator * 10 + (expression.charAt(i) - '0');
                i++;
            }

            // Apply the sign to the numerator
            numerator *= sign;

            // Skip the '/' character
            i++;

            // Step 4: Parse the denominator
            int denominator = 0;
            while (i < n && Character.isDigit(expression.charAt(i))) {
                denominator = denominator * 10 + (expression.charAt(i) - '0');
                i++;
            }

            // Step 5: Add the current fraction to the running sum
            // Common denominator = lcm(den, denominator)
            int commonDen = lcm(den, denominator);

            // Convert both fractions to have the common denominator
            // num/den becomes (num * (commonDen / den))
            // numerator/denominator becomes (numerator * (commonDen / denominator))
            num = num * (commonDen / den) + numerator * (commonDen / denominator);
            den = commonDen;
        }

        // Step 6: Reduce the final fraction
        // Find the greatest common divisor
        int g = gcd(Math.abs(num), den);

        // Divide both numerator and denominator by GCD
        num /= g;
        den /= g;

        // Return as string in format "num/den"
        return num + "/" + den;
    }

    // Euclidean algorithm for GCD
    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // LCM(a, b) = a * b / GCD(a, b)
    private int lcm(int a, int b) {
        return a * b / gcd(a, b);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string to parse all fractions: O(n)
- For each fraction, we perform arithmetic operations (addition, GCD, LCM) which are O(1) for the integer sizes in this problem
- The final GCD reduction is also O(1) relative to the input size

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables (num, den, i, etc.)
- The input string is not counted in the space complexity

## Common Mistakes

1. **Forgetting to handle the sign of the first fraction**: If the expression doesn't start with '+' or '-', the first fraction is positive. Many candidates miss this and try to parse a sign that doesn't exist.

2. **Not using integer arithmetic**: Attempting to use floating-point arithmetic will lead to precision errors. Fractions like 1/3 have infinite decimal representations that can't be stored exactly in floating-point.

3. **Reducing after every addition**: While mathematically correct, this is inefficient and makes the code more complex. You can accumulate with a common denominator and only reduce at the end.

4. **Forgetting to take the absolute value when computing GCD**: The GCD function requires positive integers. If the numerator is negative, you need to pass its absolute value to the GCD function.

5. **Integer overflow**: While not a concern for the constraints of this problem, in general, multiplying denominators could cause overflow. Using LCM instead of simple multiplication helps mitigate this.

## When You'll See This Pattern

This problem combines string parsing with mathematical computation—a common pattern in interview problems:

1. **Solve the Equation (LeetCode 640)**: Similar string parsing challenge where you need to solve linear equations. You parse terms with coefficients and constants, then solve for x.

2. **Basic Calculator II (LeetCode 227)**: Requires parsing arithmetic expressions with +, -, \*, / operators and computing the result.

3. **String to Integer (atoi) (LeetCode 8)**: Involves parsing integers from strings with sign handling and overflow checks.

The core pattern is: parse tokens from a string, apply operations based on the tokens, and accumulate a result. The mathematical twist here is working with fractions instead of simple integers.

## Key Takeaways

1. **When parsing strings with mixed formats**, process them character by character with a state machine approach. Track whether you're reading a sign, numerator, or denominator.

2. **For fraction arithmetic**, always work with numerators and denominators separately using integer arithmetic to avoid precision issues. Use LCM for addition/subtraction and GCD for reduction.

3. **Delay simplification** when possible. In this problem, we only reduce at the end, which simplifies the code. Consider whether intermediate results need to be simplified or if you can defer it.

Related problems: [Solve the Equation](/problem/solve-the-equation)
