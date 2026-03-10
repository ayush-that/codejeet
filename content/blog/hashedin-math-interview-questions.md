---
title: "Math Questions at Hashedin: What to Expect"
description: "Prepare for Math interview questions at Hashedin — patterns, difficulty breakdown, and study tips."
date: "2030-07-25"
category: "dsa-patterns"
tags: ["hashedin", "math", "interview prep"]
---

## Why Math Matters at Hashedin

You might be surprised to find Math questions in a software engineering interview, but at Hashedin, they serve a specific purpose. While not the primary focus (only 3 out of 32 questions in their typical coding round), Math problems act as an efficient filter for logical reasoning and precision. In real interviews, you're likely to encounter 1-2 Math-related problems, often in the initial screening or first technical round. They're not testing your ability to derive complex theorems, but rather your skill in translating mathematical logic into clean, efficient code. This reflects the type of work at Hashedin—building enterprise software where optimization, data transformations, and algorithmic efficiency are daily concerns. A candidate who stumbles on basic number theory or combinatorics might struggle with the logical decomposition required for complex system design.

## Specific Patterns Hashedin Favors

Hashedin's Math questions tend to cluster around a few predictable areas. They avoid abstract, proof-heavy mathematics and focus on _computational_ and _combinatorial_ problems that have direct programming applications.

1.  **Modular Arithmetic and Number Properties:** Problems involving GCD/LCM, prime numbers, or operations under modulo (like `10^9+7`) are common. They test your understanding of efficient computation and overflow prevention.
2.  **Combinatorics & Probability:** Expect questions about counting ways to arrange, select, or reach a state. These are often disguised as dynamic programming problems. The classic "climbing stairs" is a simple example, but Hashedin might ask for the number of ways to decode a string or unique paths in a grid with constraints.
3.  **Digit Manipulation:** Problems that require breaking down numbers into their digits, reversing them, or checking palindromic properties. These test clean iteration and edge-case handling.
4.  **Basic Geometry & Coordinate Math:** Less frequent, but questions involving points, distances, or simple area calculations can appear, always with a focus on the algorithm rather than geometric theory.

You will _not_ typically see heavy graph theory, linear algebra, or calculus. The pattern is iterative, practical, and leans heavily on **iterative Dynamic Programming** for combinatorial counts and **Euclidean Algorithm** for number theory.

## How to Prepare

The key is to recognize the underlying mathematical concept and then implement it without overcomplicating the solution. Let's look at two core patterns.

**Pattern 1: Combinatorial Counting via Dynamic Programming**
This pattern solves "how many ways" problems. The state transition is usually a sum of previous states.

<div class="code-group">

```python
# LeetCode #91. Decode Ways
# Problem: Given a string of digits, return the number of ways to decode it ('A'->'1', 'B'->'2', ... 'Z'->'26').
# Time: O(n) | Space: O(n) [can be optimized to O(1)]
def numDecodings(s: str) -> int:
    if not s or s[0] == '0':
        return 0
    n = len(s)
    # dp[i] = number of ways to decode substring s[:i]
    dp = [0] * (n + 1)
    dp[0], dp[1] = 1, 1  # Empty string and first char have 1 way (if valid)

    for i in range(2, n + 1):
        # Check single digit decode (s[i-1] must not be '0')
        if s[i-1] != '0':
            dp[i] += dp[i-1]
        # Check two digit decode (must be between "10" and "26")
        two_digit = int(s[i-2:i])
        if 10 <= two_digit <= 26:
            dp[i] += dp[i-2]
    return dp[n]
```

```javascript
// LeetCode #91. Decode Ways
// Time: O(n) | Space: O(n)
function numDecodings(s) {
  if (!s || s[0] === "0") return 0;
  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    // Single digit decode
    if (s[i - 1] !== "0") {
      dp[i] += dp[i - 1];
    }
    // Two digit decode
    const twoDigit = parseInt(s.substring(i - 2, i), 10);
    if (twoDigit >= 10 && twoDigit <= 26) {
      dp[i] += dp[i - 2];
    }
  }
  return dp[n];
}
```

```java
// LeetCode #91. Decode Ways
// Time: O(n) | Space: O(n)
public int numDecodings(String s) {
    if (s == null || s.length() == 0 || s.charAt(0) == '0') return 0;
    int n = s.length();
    int[] dp = new int[n + 1];
    dp[0] = 1;
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        // Single digit decode
        if (s.charAt(i-1) != '0') {
            dp[i] += dp[i-1];
        }
        // Two digit decode
        int twoDigit = Integer.parseInt(s.substring(i-2, i));
        if (twoDigit >= 10 && twoDigit <= 26) {
            dp[i] += dp[i-2];
        }
    }
    return dp[n];
}
```

</div>

**Pattern 2: Euclidean Algorithm for GCD**
This is a must-know for any number theory problem. Remember: `GCD(a, b) = GCD(b, a % b)`.

<div class="code-group">

```python
# LeetCode #1979. Find Greatest Common Divisor of Array
# Problem: Find the GCD of the smallest and largest number in an array.
# Time: O(n + log(min(a,b))) | Space: O(1)
def findGCD(nums):
    def gcd(x, y):
        while y:
            x, y = y, x % y
        return x
    min_val, max_val = min(nums), max(nums)
    return gcd(min_val, max_val)
```

```javascript
// LeetCode #1979. Find Greatest Common Divisor of Array
// Time: O(n + log(min(a,b))) | Space: O(1)
function findGCD(nums) {
  const gcd = (x, y) => {
    while (y) {
      [x, y] = [y, x % y];
    }
    return x;
  };
  const minVal = Math.min(...nums);
  const maxVal = Math.max(...nums);
  return gcd(minVal, maxVal);
}
```

```java
// LeetCode #1979. Find Greatest Common Divisor of Array
// Time: O(n + log(min(a,b))) | Space: O(1)
public int findGCD(int[] nums) {
    int min = Integer.MAX_VALUE, max = Integer.MIN_VALUE;
    for (int num : nums) {
        min = Math.min(min, num);
        max = Math.max(max, num);
    }
    return gcd(min, max);
}
private int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
```

</div>

## How Hashedin Tests Math vs Other Companies

Hashedin's Math questions sit at a unique intersection. Compared to FAANG companies:

- **Google/Meta** might ask more theoretical probability or puzzles (e.g., "estimate the number of golf balls in a plane"). Hashedin's problems are more concrete and always require runnable code.
- **Finance firms (Jane Street, Citadel)** dive much deeper into probability and statistics. Hashedin stays at an undergraduate discrete math level.
- **Other product-based Indian companies (like Flipkart, ShareChat)** have a similar focus, but Hashedin's problems are often more directly tied to potential real-world scenarios in data processing or optimization.

What's unique is the _practical twist_. You might get a combinatorics problem framed as "counting valid configurations in a system" or a modulo arithmetic problem related to "handling large IDs in a distributed system." The context matters.

## Study Order

Tackle these sub-topics in this order to build a logical foundation:

1.  **Basic Number Operations:** Prime checks, digit extraction, palindromes, reversing integers. This warms up your loop and condition logic.
2.  **Modular Arithmetic:** Understand modulo properties, fast exponentiation (pow(x, n) % m), and handling overflow. This is crucial for many counting problems.
3.  **GCD, LCM, and Euclidean Algorithm:** A small topic with high yield. Learn it well.
4.  **Combinatorics Fundamentals:** Permutations, combinations, the "stars and bars" method. Focus on the concepts, not formulas.
5.  **Dynamic Programming for Counting:** This is where combinatorics meets code. Practice translating "number of ways" problems into DP state transitions.
6.  **Basic Probability (Discrete):** Simple counting-based probability. Rarely goes beyond calculating favorable outcomes / total outcomes.

This order works because each topic builds on the last. You need number manipulation skills before modular arithmetic. Understanding combinations helps you recognize DP patterns for counting.

## Recommended Practice Order

Solve these problems in sequence. They gradually increase in difficulty and cover the patterns discussed.

1.  **Palindrome Number (LeetCode #9):** Basic digit manipulation.
2.  **Count Primes (LeetCode #204):** Introduces the Sieve of Eratosthenes.
3.  **Excel Sheet Column Title (LeetCode #168):** Good practice with base-26 conversion and modulo.
4.  **Greatest Common Divisor of Array (LeetCode #1979):** Direct application of Euclidean Algorithm.
5.  **Climbing Stairs (LeetCode #70):** The simplest "ways to reach" DP problem.
6.  **Unique Paths (LeetCode #62):** 2D version of combinatorial counting via DP.
7.  **Decode Ways (LeetCode #91):** More complex DP with string constraints (as shown above).
8.  **Pow(x, n) (LeetCode #50):** Practice fast exponentiation (iterative and recursive).
9.  **Rotate Function (LeetCode #396):** A harder problem that uses mathematical insight to optimize from O(n²) to O(n).

Mastering this sequence will give you confidence for nearly any Math problem Hashedin throws your way.

[Practice Math at Hashedin](/company/hashedin/math)
