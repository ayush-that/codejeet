---
title: "Math Questions at American Express: What to Expect"
description: "Prepare for Math interview questions at American Express — patterns, difficulty breakdown, and study tips."
date: "2031-03-26"
category: "dsa-patterns"
tags: ["american-express", "math", "interview prep"]
---

Math matters at American Express because the company’s core business—payments, credit risk, fraud detection, and financial analytics—is built on quantitative foundations. Engineers and data professionals here routinely model transaction patterns, optimize approval systems, and analyze large-scale financial data. The four math questions in their technical interview (out of 24 total problems) assess your numerical reasoning, ability to translate a word problem into code, and comfort with algorithmic thinking involving numbers. Strong performance here signals you can handle the quantitative challenges inherent in developing systems that move billions of dollars securely and efficiently.

## What to Expect — types of problems

The math questions typically fall into a few predictable categories. You won’t encounter advanced calculus; instead, expect problems grounded in practical computation.

- **Number Theory & Digit Manipulation:** Problems involving palindromes, reversing integers, checking for Armstrong numbers, or summing digits.
- **Basic Arithmetic & Sequences:** Calculating the nth Fibonacci number, working with geometric or arithmetic progressions, or implementing operations like exponentiation or square root without built-in functions.
- **Probability & Combinatorics:** Simple simulations or calculations of odds, often related to card draws or dice rolls, reflecting the company’s financial context.
- **Modular Arithmetic & Clock Problems:** Calculations involving remainders, circular arrays, or time-based logic.

The focus is less on pure mathematical proof and more on writing clean, efficient code to solve a well-defined numerical puzzle.

## How to Prepare — study tips with one code example

Start by solidifying fundamentals: review modular arithmetic (`%` operator), integer division, and working with digits (using `//` and `%` in a loop). Practice converting word problems into step-by-step algorithms. Use brute-force solutions first to ensure correctness, then optimize for edge cases and performance.

A key pattern is **digit manipulation**, such as reversing an integer. This tests your understanding of modulo arithmetic and integer operations while handling potential overflow.

<div class="code-group">

```python
def reverse_integer(x: int) -> int:
    INT_MAX, INT_MIN = 2**31 - 1, -2**31
    rev = 0
    sign = -1 if x < 0 else 1
    x = abs(x)
    while x != 0:
        pop = x % 10
        x //= 10
        # Check for integer overflow before multiplying
        if rev > (INT_MAX // 10) or (rev == INT_MAX // 10 and pop > 7):
            return 0
        rev = rev * 10 + pop
    return rev * sign
```

```javascript
function reverseInteger(x) {
  const INT_MAX = 2 ** 31 - 1;
  const INT_MIN = -(2 ** 31);
  let rev = 0;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  while (x !== 0) {
    const pop = x % 10;
    x = Math.floor(x / 10);
    // Check for integer overflow
    if (rev > Math.floor(INT_MAX / 10) || (rev === Math.floor(INT_MAX / 10) && pop > 7)) {
      return 0;
    }
    rev = rev * 10 + pop;
  }
  return rev * sign;
}
```

```java
public int reverse(int x) {
    int rev = 0;
    while (x != 0) {
        int pop = x % 10;
        x /= 10;
        // Check for integer overflow
        if (rev > Integer.MAX_VALUE/10 || (rev == Integer.MAX_VALUE/10 && pop > 7)) return 0;
        if (rev < Integer.MIN_VALUE/10 || (rev == Integer.MIN_VALUE/10 && pop < -8)) return 0;
        rev = rev * 10 + pop;
    }
    return rev;
}
```

</div>

## Recommended Practice Order

1.  **Core Concepts:** Master digit manipulation, basic number properties (prime, palindrome), and sequences (Fibonacci).
2.  **Arithmetic & Simulation:** Practice problems requiring step-by-step calculation or simple probabilistic simulation.
3.  **Optimization & Edge Cases:** Revisit problems to handle large numbers, overflow, and negative inputs efficiently.
4.  **Timed Mock Interviews:** Simulate the actual test environment with a mix of math and other problem types.

[Practice Math at American Express](/company/american-express/math)
