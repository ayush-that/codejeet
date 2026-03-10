---
title: "Math Questions at Capgemini: What to Expect"
description: "Prepare for Math interview questions at Capgemini — patterns, difficulty breakdown, and study tips."
date: "2030-04-20"
category: "dsa-patterns"
tags: ["capgemini", "math", "interview prep"]
---

## Why Math Matters at Capgemini

Capgemini’s technical assessment typically includes 6 Math-focused questions out of a total of 36. While this ratio might suggest Math is just one component among many, it’s actually a critical filter. In real interviews, especially for roles in data engineering, analytics, and software development with quantitative elements, these questions test logical structuring, numerical reasoning, and the ability to translate a word problem into clean code—skills directly applicable to client projects involving data processing, optimization, and reporting. Unlike companies that focus purely on algorithmic puzzles, Capgemini uses Math problems to assess how you handle precise, often business-logic-oriented calculations. Ignoring this section because it seems secondary is a common mistake; candidates who ace the algorithmic questions but fumble on basic arithmetic or sequence problems often get flagged as lacking attention to detail.

## Specific Patterns Capgemini Favors

Capgemini’s Math questions rarely involve advanced calculus or abstract algebra. Instead, they focus on **computational number problems** and **iterative sequence generation**. You’ll see three recurring themes:

1. **Digit Manipulation & Number Properties**: Problems that require extracting digits, reversing numbers, checking palindromes, or computing sums of digits. These test your ability to work with base-10 arithmetic without string conversion shortcuts.
2. **Sequence & Series Calculation**: Generating sequences like Fibonacci, factorial, or custom patterns defined by recurrence relations. The emphasis is on iterative solutions rather than recursive ones, due to performance and stack overflow concerns in production-like scenarios.
3. **Modular Arithmetic & Basic Number Theory**: Problems involving remainders, divisibility, GCD/LCM, or prime checks—concepts directly useful in scheduling, hashing, and resource allocation tasks common in consulting projects.

For example, **LeetCode #7 (Reverse Integer)** is a classic digit manipulation problem that appears in variations. **LeetCode #509 (Fibonacci Number)** is a straightforward sequence problem, but Capgemini might extend it to ask for the sum of even-valued terms up to N, similar to Project Euler’s second problem.

## How to Prepare

Master the iterative patterns. Let’s look at digit reversal and Fibonacci generation—two patterns that cover most bases.

<div class="code-group">

```python
# Time: O(log10(n)) | Space: O(1)
def reverse_integer(x: int) -> int:
    # Handle negative numbers by working with absolute value
    sign = -1 if x < 0 else 1
    x_abs = abs(x)
    reversed_num = 0

    while x_abs > 0:
        # Extract last digit and build reversed number
        digit = x_abs % 10
        reversed_num = reversed_num * 10 + digit
        x_abs //= 10

    # Apply sign and check for 32-bit integer overflow (optional constraint)
    result = sign * reversed_num
    if result < -2**31 or result > 2**31 - 1:
        return 0
    return result

# Time: O(n) | Space: O(1)
def fibonacci_iterative(n: int) -> int:
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```

```javascript
// Time: O(log10(n)) | Space: O(1)
function reverseInteger(x) {
  const sign = x < 0 ? -1 : 1;
  let xAbs = Math.abs(x);
  let reversed = 0;

  while (xAbs > 0) {
    const digit = xAbs % 10;
    reversed = reversed * 10 + digit;
    xAbs = Math.floor(xAbs / 10);
  }

  const result = sign * reversed;
  // 32-bit integer bounds check
  if (result < Math.pow(-2, 31) || result > Math.pow(2, 31) - 1) return 0;
  return result;
}

// Time: O(n) | Space: O(1)
function fibonacciIterative(n) {
  if (n <= 1) return n;
  let a = 0,
    b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}
```

```java
// Time: O(log10(n)) | Space: O(1)
public int reverseInteger(int x) {
    int sign = x < 0 ? -1 : 1;
    long xAbs = Math.abs((long) x); // Use long to handle overflow during reversal
    long reversed = 0;

    while (xAbs > 0) {
        int digit = (int) (xAbs % 10);
        reversed = reversed * 10 + digit;
        xAbs /= 10;
    }

    long result = sign * reversed;
    if (result < Integer.MIN_VALUE || result > Integer.MAX_VALUE) return 0;
    return (int) result;
}

// Time: O(n) | Space: O(1)
public int fibonacciIterative(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int temp = b;
        b = a + b;
        a = temp;
    }
    return b;
}
```

</div>

Practice variations: sum of digits, count primes up to N (Sieve of Eratosthenes), or generating number sequences with custom rules.

## How Capgemini Tests Math vs Other Companies

At companies like Google or Meta, Math problems often involve combinatorics, probability, or are embedded within complex algorithmic challenges (e.g., using modular arithmetic in hashing). At Capgemini, the Math section is more isolated and foundational. The difficulty is generally **easy to medium**, but the catch is the **time pressure** and the need for **zero errors**. You’re expected to produce working, efficient code quickly, mirroring the fast-paced client delivery environment. Unlike FAANG, where you might discuss trade-offs between recursive and iterative solutions, here the iterative approach is usually the expected answer because it’s more performant and safer for production code. The problems are less about clever tricks and more about robust implementation.

## Study Order

1. **Basic Arithmetic Operations & Loops**: Ensure you’re comfortable with modulo, integer division, and loop constructs. This is the foundation for all digit and sequence problems.
2. **Digit Manipulation**: Learn to extract, reverse, and sum digits using while loops. This pattern transfers directly to palindrome and armstrong number problems.
3. **Sequence Generation (Iterative)**: Master Fibonacci, factorial, and arithmetic/geometric progressions without recursion. Understand how to store only the necessary previous values to save space.
4. **Prime Numbers & Divisibility**: Implement efficient prime checks and learn the Sieve of Eratosthenes for problems like “count primes less than N.”
5. **GCD/LCM & Euclidean Algorithm**: These appear in problems about scheduling or partitioning resources. The Euclidean algorithm is a must-know.
6. **Custom Sequence Problems**: Practice interpreting word problems to derive recurrence relations, then implement them iteratively.

This order builds from simple operations to combined concepts, ensuring you don’t miss foundational skills before tackling composite problems.

## Recommended Practice Order

Solve these problems in sequence to build proficiency:

1. **LeetCode #7 (Reverse Integer)** – Master digit extraction and reversal.
2. **LeetCode #9 (Palindrome Number)** – Apply digit reversal to a common check.
3. **LeetCode #509 (Fibonacci Number)** – Basic iterative sequence generation.
4. **Project Euler Problem 2 (Even Fibonacci Numbers)** – A slight twist on Fibonacci, testing your ability to filter sequence terms.
5. **LeetCode #204 (Count Primes)** – Practice the Sieve of Eratosthenes for efficiency.
6. **LeetCode #258 (Add Digits)** – A digit manipulation problem that can also teach you about digital roots.
7. **LeetCode #367 (Valid Perfect Square)** – Tests your understanding of numerical methods without using sqrt().
8. **Custom Problem: “Sum of Digits of a Number until Single Digit”** – Combines loops and digit manipulation, a common Capgemini-style question.

Focus on writing clean, iterative solutions for each. Time yourself to mimic the assessment’s pace.

[Practice Math at Capgemini](/company/capgemini/math)
