---
title: "Math Questions at American Express: What to Expect"
description: "Prepare for Math interview questions at American Express — patterns, difficulty breakdown, and study tips."
date: "2031-03-18"
category: "dsa-patterns"
tags: ["american-express", "math", "interview prep"]
---

When you hear "American Express," you might think of credit cards, rewards points, and financial services. You probably don't immediately think of advanced mathematics. This is precisely why candidates are often caught off guard when they encounter the company's coding assessments. American Express includes a dedicated "Math" section in its online coding challenges, typically 4 questions out of a total of 24. This isn't a trick; it's a signal. For a company that processes billions of transactions, models credit risk, detects fraud in real-time, and optimizes financial systems, mathematical reasoning isn't a secondary topic—it's a core competency for their engineers. The ability to write clean, efficient code is a given. The ability to do so while correctly implementing a mathematical concept, optimizing a numerical algorithm, or modeling a logical constraint is what separates candidates. In real interviews, these questions test your foundational computer science math, not your ability to derive theorems. They want to see if you can translate a business rule (like calculating compound interest or validating a transaction sequence) into a robust, bug-free algorithm.

## Specific Patterns American Express Favors

American Express's Math questions are pragmatic. They lean heavily on **number theory, modular arithmetic, and combinatorial logic**. You won't find abstract calculus or linear algebra proofs here. Instead, you'll find problems that mirror real-world financial and systems logic.

The most frequent patterns are:

1.  **Modular Arithmetic and Digit Manipulation:** Problems involving credit card numbers (Luhn algorithm), palindromic numbers, or reversing integers. Think LeetCode problems like **Palindrome Number (#9)** or **Reverse Integer (#7)**, but often with an added twist involving validation or summation of digits under certain conditions.
2.  **Prime Numbers and Divisibility:** Checking for primes, finding prime factors, or problems based on the Sieve of Eratosthenes. This connects to hashing, cryptography, and optimizing checks.
3.  **Basic Combinatorics and Probability:** Calculating permutations or combinations in a constrained way (e.g., "number of ways to make change" akin to **Coin Change (#322)**), or simple expected value calculations. The focus is on logical counting, not memorized formulas.
4.  **Mathematical Simulation:** Problems where you must simulate a process defined by a mathematical rule until a condition is met. This tests loop control, edge case handling, and efficiency.

For example, a classic AmEx-style question might be: _"Given a number, repeatedly sum the squares of its digits. Return true if the process eventually reaches 1 (a happy number), or false if it enters a cycle."_ This is **Happy Number (#202)**, which perfectly blends digit manipulation, cycle detection, and mathematical simulation.

<div class="code-group">

```python
# Time: O(log n) | Space: O(log n) for the set, or O(1) with Floyd's Cycle Detection
def is_happy(n: int) -> bool:
    def get_next(number):
        total_sum = 0
        while number > 0:
            number, digit = divmod(number, 10)
            total_sum += digit ** 2
        return total_sum

    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = get_next(n)
    return n == 1

# Using Floyd's Cycle Detection for O(1) space:
def is_happy_constant_space(n: int) -> bool:
    def get_next(number):
        total_sum = 0
        while number > 0:
            number, digit = divmod(number, 10)
            total_sum += digit ** 2
        return total_sum

    slow_runner = n
    fast_runner = get_next(n)
    while fast_runner != 1 and slow_runner != fast_runner:
        slow_runner = get_next(slow_runner)
        fast_runner = get_next(get_next(fast_runner))
    return fast_runner == 1
```

```javascript
// Time: O(log n) | Space: O(log n) for the set, or O(1) with Floyd's Cycle Detection
function isHappy(n) {
  const getNext = (number) => {
    let totalSum = 0;
    while (number > 0) {
      let digit = number % 10;
      number = Math.floor(number / 10);
      totalSum += digit * digit;
    }
    return totalSum;
  };

  let seen = new Set();
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    n = getNext(n);
  }
  return n === 1;
}

// Floyd's Cycle Detection (O(1) space):
function isHappyConstantSpace(n) {
  const getNext = (number) => {
    let totalSum = 0;
    while (number > 0) {
      let digit = number % 10;
      number = Math.floor(number / 10);
      totalSum += digit * digit;
    }
    return totalSum;
  };

  let slow = n;
  let fast = getNext(n);
  while (fast !== 1 && slow !== fast) {
    slow = getNext(slow);
    fast = getNext(getNext(fast));
  }
  return fast === 1;
}
```

```java
// Time: O(log n) | Space: O(log n) for the set, or O(1) with Floyd's Cycle Detection
public boolean isHappy(int n) {
    Set<Integer> seen = new HashSet<>();
    while (n != 1 && !seen.contains(n)) {
        seen.add(n);
        n = getNext(n);
    }
    return n == 1;
}

private int getNext(int n) {
    int totalSum = 0;
    while (n > 0) {
        int d = n % 10;
        n = n / 10;
        totalSum += d * d;
    }
    return totalSum;
}

// Floyd's Cycle Detection (O(1) space):
public boolean isHappyConstantSpace(int n) {
    int slow = n;
    int fast = getNext(n);
    while (fast != 1 && slow != fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    return fast == 1;
}
```

</div>

## How to Prepare

Don't just solve random "Math" tagged problems. Focus on the patterns above. For each pattern, understand the brute-force approach first, then optimize. For digit manipulation, practice extracting digits with modulo and integer division. For primes, implement the basic O(√n) check and the Sieve of Eratosthenes. For combinatorics, start with the recursive relationship before moving to dynamic programming.

A key tip: **Always test with edge cases**. What if the input is 0, 1, negative, or at the boundary of an integer? American Express questions often include these constraints to test for robustness in financial calculations.

Here’s a template for the prime-checking pattern, a fundamental building block:

<div class="code-group">

```python
# Time: O(sqrt(n)) | Space: O(1)
def is_prime(n: int) -> bool:
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    # Check for factors of the form 6k ± 1 up to sqrt(n)
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True
```

```javascript
// Time: O(sqrt(n)) | Space: O(1)
function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}
```

```java
// Time: O(sqrt(n)) | Space: O(1)
public boolean isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}
```

</div>

## How American Express Tests Math vs Other Companies

Compared to FAANG companies, American Express's Math questions are less about clever "aha!" moments and more about **correct, efficient implementation of known concepts**. At Google or Meta, a math problem might be a disguised graph theory puzzle requiring a non-obvious insight. At American Express, the mathematical rule is usually stated clearly; the challenge is to implement it without bugs and handle all edge cases, much like you would when writing production code for a financial calculation.

The difficulty is generally at the LeetCode Easy to Medium level, but the "Medium" here is defined by careful attention to detail, not algorithmic complexity. The uniqueness lies in the **domain context**. Problems may feel like they have a "financial flavor," testing skills directly applicable to payment systems, such as validating numerical sequences or calculating running totals under specific rules.

## Study Order

Tackle these sub-topics in this logical sequence to build a solid foundation:

1.  **Integer & Digit Manipulation:** Start here because it's the most frequent pattern and uses fundamental programming operations (modulo, division, loops). Mastering this makes later topics easier.
2.  **Prime Numbers & Basic Number Theory:** This builds on integer operations. Learn to check for primes, generate primes (Sieve), and find GCD/LCM.
3.  **Modular Arithmetic:** Understand modulo properties. This is crucial for cycle detection (like in Happy Number) and many optimization problems.
4.  **Simple Combinatorics (Permutations & Combinations):** Focus on the _counting_ logic (often using DP) rather than formulas. Start with the classic "stairs" and "coin change" problems.
5.  **Mathematical Simulation:** Finally, practice combining all the above—writing a loop that applies a rule until a condition is met. This tests your overall control flow and edge case management.

## Recommended Practice Order

Solve these problems in sequence. Each one reinforces a pattern needed for American Express.

1.  **Palindrome Number (#9)** - Basic digit manipulation and reversal.
2.  **Reverse Integer (#7)** - Adds overflow handling, a critical edge case.
3.  **Happy Number (#202)** - Combines digit manipulation, cycle detection, and simulation.
4.  **Count Primes (#204)** - Implement the Sieve of Eratosthenes.
5.  **Power of Three (#326)** - A good exercise in loop and modulo thinking.
6.  **Excel Sheet Column Title (#168)** - Excellent for understanding base-26 conversion _without_ a zero digit—a tricky nuance.
7.  **Coin Change (#322)** - Introduces the combinatorial "ways to make change" DP pattern.
8.  **Rotate Function (#396)** - A more challenging problem that tests your ability to find a mathematical optimization to avoid O(n²) time.

By following this focused approach, you'll be prepared not just to solve, but to _excel_ at the mathematical reasoning American Express values in its engineers.

[Practice Math at American Express](/company/american-express/math)
