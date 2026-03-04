---
title: "Math Questions at Yelp: What to Expect"
description: "Prepare for Math interview questions at Yelp — patterns, difficulty breakdown, and study tips."
date: "2031-01-11"
category: "dsa-patterns"
tags: ["yelp", "math", "interview prep"]
---

Math questions appear in about 15% of Yelp’s technical interviews (4 out of 27 total problems). They aren't about advanced calculus, but they test your ability to translate a real-world scenario into logical operations and efficient code. Strong math skills indicate you can handle data modeling, business metrics, ranking algorithms, and optimization problems—core to Yelp's platform of reviews, search, and recommendations.

## What to Expect — Types of Problems

Yelp’s math questions generally fall into three categories:

1.  **Probability & Statistics:** These assess your comfort with uncertainty and data. You might calculate the probability of events (e.g., user behavior), work with distributions, or compute basic metrics like mean or percentile. A common twist is combining probability with simulation or combinatorial counting.
2.  **Number Theory & Arithmetic:** Problems here involve properties of integers, modular arithmetic, or numerical computations without brute force. Examples include checking for palindromic numbers, implementing operations under constraints (like division without using `/`), or solving digit-based puzzles.
3.  **Geometry & Spatial Reasoning:** Less frequent but possible, these questions involve distances, areas, or spatial logic—relevant for features like map-based search or proximity filtering. You might calculate the distance between two points on Earth or determine if shapes overlap.

The key is that these problems disguise algorithmic thinking. A probability question is often a dynamic programming or counting problem in disguise. A number puzzle usually requires identifying a mathematical property to avoid a naive, inefficient solution.

## How to Prepare — Study Tips with Code Example

Focus on the logic, not memorization. Review fundamentals: probability rules (independent events, combinations), modular arithmetic, and basic geometric formulas. Practice translating word problems into clear computational steps. When you get a problem, verbalize your reasoning, identify the core mathematical principle, and then discuss potential edge cases (like division by zero or integer overflow) before coding.

A frequent pattern is using the **properties of digits in a number**. Instead of converting a number to a string to manipulate digits, you can use modulo (`%`) and integer division (`//` or `/`) to extract and process digits mathematically, which is often more efficient.

<div class="code-group">

```python
def reverse_integer(x: int) -> int:
    rev = 0
    sign = 1 if x >= 0 else -1
    x = abs(x)
    while x > 0:
        # Extract last digit and build reversed number
        rev = rev * 10 + (x % 10)
        x //= 10
    # Handle 32-bit integer overflow constraint
    if rev > 2**31 - 1:
        return 0
    return sign * rev
```

```javascript
function reverseInteger(x) {
  let rev = 0;
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  while (x > 0) {
    // Extract last digit and build reversed number
    rev = rev * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  // Handle 32-bit integer overflow constraint
  if (rev > Math.pow(2, 31) - 1) return 0;
  return sign * rev;
}
```

```java
public int reverseInteger(int x) {
    long rev = 0; // Use long to detect overflow
    int sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);
    while (x > 0) {
        // Extract last digit and build reversed number
        rev = rev * 10 + (x % 10);
        x /= 10;
    }
    // Handle 32-bit integer overflow constraint
    if (rev > Integer.MAX_VALUE) return 0;
    return sign * (int) rev;
}
```

</div>

## Recommended Practice Order

1.  **Foundations:** Start with basic number manipulation (palindrome, reverse, GCD/LCM) and simple probability (coin flips, dice rolls).
2.  **Core Patterns:** Move to problems combining math with standard algorithms, like using prime factorization, solving combinatorial problems with DP, or calculating geometric distances.
3.  **Yelp-Specific Context:** Finally, practice problems framed around business data, user ratings, or location-based logic. Think about how math applies to features like calculating average star ratings, ranking search results, or filtering by map grid.

[Practice Math at Yelp](/company/yelp/math)
