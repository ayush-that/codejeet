---
title: "Math Questions at Yandex: What to Expect"
description: "Prepare for Math interview questions at Yandex — patterns, difficulty breakdown, and study tips."
date: "2028-02-20"
category: "dsa-patterns"
tags: ["yandex", "math", "interview prep"]
---

## Why Math Matters at Yandex

If you're preparing for Yandex interviews, you've probably noticed their problem list includes 11 Math questions out of 134 total. That's about 8% — not an overwhelming percentage, but significant enough that you can't afford to ignore it. Unlike some companies where math questions are rare curveballs, Yandex consistently includes them because they're testing fundamental computer science reasoning, not just coding mechanics.

Math problems at Yandex serve a specific purpose: they filter candidates who can think algorithmically about numerical constraints, optimize operations using mathematical properties, and recognize when a brute-force approach can be replaced with elegant mathematical reasoning. These questions appear in phone screens, online assessments, and onsite interviews, often as the first or second problem to quickly assess problem-solving approach.

## Specific Patterns Yandex Favors

Yandex's math questions tend to cluster around three distinct patterns:

1. **Number Theory & Modular Arithmetic** — Problems involving divisors, multiples, remainders, and properties of integers. These test your ability to reduce problem spaces using mathematical insights.

2. **Combinatorics & Probability** — Counting problems that require careful reasoning about permutations, combinations, and expected values. These often appear in disguised forms.

3. **Mathematical Optimization** — Problems where you need to minimize or maximize some value subject to constraints, requiring you to derive formulas rather than brute-force search.

A classic example is **Happy Number (#202)** — which appears simple but tests understanding of cycles and mathematical termination conditions. Another favorite is **Pow(x, n) (#50)** — testing your ability to optimize exponentiation using mathematical properties rather than naive multiplication.

## How to Prepare

The key to Yandex math questions is recognizing when to stop thinking like a programmer and start thinking like a mathematician. Instead of immediately writing loops, ask: "What mathematical property could simplify this?"

Let's examine the most important pattern: **fast modular exponentiation**. This appears in problems involving large powers and remainders.

<div class="code-group">

```python
def mod_pow(base, exponent, modulus):
    """
    Compute (base^exponent) % modulus efficiently.
    Time: O(log n) where n = exponent
    Space: O(1)
    """
    if modulus == 1:
        return 0

    result = 1
    base = base % modulus

    while exponent > 0:
        # If exponent is odd, multiply base with result
        if exponent % 2 == 1:
            result = (result * base) % modulus

        # exponent must be even now
        exponent = exponent >> 1  # Divide exponent by 2
        base = (base * base) % modulus

    return result

# Example: 3^10 mod 7 = 4
print(mod_pow(3, 10, 7))  # Output: 4
```

```javascript
function modPow(base, exponent, modulus) {
  /**
   * Compute (base^exponent) % modulus efficiently.
   * Time: O(log n) where n = exponent
   * Space: O(1)
   */
  if (modulus === 1) return 0;

  let result = 1;
  base = base % modulus;

  while (exponent > 0) {
    // If exponent is odd, multiply base with result
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }

    // exponent must be even now
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }

  return result;
}

// Example: 3^10 mod 7 = 4
console.log(modPow(3, 10, 7)); // Output: 4
```

```java
public class ModularExponentiation {
    /**
     * Compute (base^exponent) % modulus efficiently.
     * Time: O(log n) where n = exponent
     * Space: O(1)
     */
    public static int modPow(int base, int exponent, int modulus) {
        if (modulus == 1) return 0;

        int result = 1;
        base = base % modulus;

        while (exponent > 0) {
            // If exponent is odd, multiply base with result
            if ((exponent & 1) == 1) {
                result = (result * base) % modulus;
            }

            // exponent must be even now
            exponent = exponent >> 1;  // Divide exponent by 2
            base = (base * base) % modulus;
        }

        return result;
    }

    public static void main(String[] args) {
        // Example: 3^10 mod 7 = 4
        System.out.println(modPow(3, 10, 7));  // Output: 4
    }
}
```

</div>

Another crucial pattern is **Euclidean algorithm** for finding greatest common divisors:

<div class="code-group">

```python
def gcd(a, b):
    """
    Compute greatest common divisor using Euclidean algorithm.
    Time: O(log(min(a, b)))
    Space: O(1)
    """
    while b:
        a, b = b, a % b
    return abs(a)

# Extended Euclidean algorithm for modular inverses
def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    gcd_val, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return gcd_val, x, y
```

```javascript
function gcd(a, b) {
  /**
   * Compute greatest common divisor using Euclidean algorithm.
   * Time: O(log(min(a, b)))
   * Space: O(1)
   */
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return Math.abs(a);
}

// Extended Euclidean algorithm for modular inverses
function extendedGcd(a, b) {
  if (b === 0) {
    return [a, 1, 0];
  }
  const [gcdVal, x1, y1] = extendedGcd(b, a % b);
  const x = y1;
  const y = x1 - Math.floor(a / b) * y1;
  return [gcdVal, x, y];
}
```

```java
public class EuclideanAlgorithm {
    /**
     * Compute greatest common divisor using Euclidean algorithm.
     * Time: O(log(min(a, b)))
     * Space: O(1)
     */
    public static int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return Math.abs(a);
    }

    // Extended Euclidean algorithm for modular inverses
    public static int[] extendedGcd(int a, int b) {
        if (b == 0) {
            return new int[]{a, 1, 0};
        }
        int[] result = extendedGcd(b, a % b);
        int gcdVal = result[0];
        int x1 = result[1];
        int y1 = result[2];
        int x = y1;
        int y = x1 - (a / b) * y1;
        return new int[]{gcdVal, x, y};
    }
}
```

</div>

## How Yandex Tests Math vs Other Companies

Yandex's math questions differ from other companies in subtle but important ways:

**Compared to Google**: Google's math problems often involve probability or expected value in complex scenarios. Yandex focuses more on deterministic number theory — you either get the right answer or you don't.

**Compared to Facebook/Meta**: Meta often embeds math within larger system design or optimization problems. Yandex presents math as standalone problems that test pure algorithmic thinking.

**Compared to Amazon**: Amazon's math questions tend to be practical (inventory, pricing, logistics). Yandex's are more academic, testing fundamental CS knowledge.

What's unique about Yandex is their preference for **problems with multiple solution approaches**. They want to see if you start with brute force, then optimize using mathematical insights. The interviewers often ask: "Can you make it faster?" expecting you to recognize mathematical patterns.

## Study Order

1. **Basic Number Properties** — Start with prime numbers, divisors, and modular arithmetic. These are building blocks for everything else.
2. **GCD/LCM & Euclidean Algorithm** — Essential for problems involving ratios, periods, and cyclic patterns.

3. **Fast Exponentiation** — Critical for handling large powers efficiently, which appears in cryptography and optimization problems.

4. **Combinatorics Fundamentals** — Permutations, combinations, and the inclusion-exclusion principle. Start with small cases before generalizing.

5. **Probability Basics** — Expected value and linearity of expectation are more important than complex probability distributions.

6. **Bit Manipulation** — Many math problems have elegant bitwise solutions, especially those involving parity or binary representations.

This order works because each topic builds on the previous one. You can't understand modular inverses without understanding GCD, and you can't optimize combinatorial counts without understanding basic counting principles.

## Recommended Practice Order

Solve these problems in sequence:

1. **Happy Number (#202)** — Tests cycle detection with mathematical termination
2. **Pow(x, n) (#50)** — Fast exponentiation fundamentals
3. **Sqrt(x) (#69)** — Binary search with mathematical bounds
4. **Excel Sheet Column Number (#171)** — Base conversion thinking
5. **Reverse Integer (#7)** — Handling numerical bounds and overflows
6. **Count Primes (#204)** — Sieve of Eratosthenes optimization
7. **Rectangle Area (#223)** — Geometric reasoning with constraints
8. **Ugly Number (#263)** — Mathematical property recognition
9. **Add Digits (#258)** — Digital root mathematical insight
10. **Integer Break (#343)** — Mathematical optimization proof

After these, tackle Yandex's specific math problems, which often combine multiple patterns. Remember: the goal isn't to memorize solutions, but to recognize when a mathematical insight can replace computational brute force.

[Practice Math at Yandex](/company/yandex/math)
