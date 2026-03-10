---
title: "Math Questions at Agoda: What to Expect"
description: "Prepare for Math interview questions at Agoda — patterns, difficulty breakdown, and study tips."
date: "2029-09-10"
category: "dsa-patterns"
tags: ["agoda", "math", "interview prep"]
---

When you see that Agoda has 7 Math questions in their 46-problem tagged list, your first thought might be, "That's not too many. Maybe I can skip it." That would be a critical mistake. In my experience interviewing candidates for Agoda and similar travel-tech companies, Math problems are not a secondary screening topic—they are a primary filter for a specific type of logical reasoning. These 7 problems represent a concentrated set of patterns that test your ability to model real-world, often travel-adjacent, scenarios with efficient computation. Think pricing algorithms, commission calculations, distance optimizations, and scheduling overlaps. They don't just want to know if you can code; they want to see if you can _think_ mathematically and translate that thinking into clean, optimal code. You will almost certainly encounter at least one, and it will be a core part of the evaluation of your problem-solving approach.

## Specific Patterns Agoda Favors

Agoda's Math problems skew heavily toward **computational geometry, number theory, and modulo arithmetic**. You won't find many abstract algebra proofs here. Instead, you'll find problems that involve calculating angles, distances, divisibility, and handling large numbers that require careful consideration of integer overflow and modulo operations. The theme is _practical calculation_.

A standout pattern is **angle and geometry calculations**, often related to mapping or spatial reasoning (highly relevant for a travel company). Problems like [Angle Between Hands of a Clock (#1344)](https://leetcode.com/problems/angle-between-hands-of-a-clock/) are quintessential Agoda. Another strong pattern is **modular exponentiation and handling large powers**, which comes up in problems about sequences or combinatorial counts that would overflow standard integers. Problems involving **GCD (Greatest Common Divisor) and LCM (Least Common Multiple)** also appear, as they are fundamental to many scheduling and batching algorithms.

Here is the core pattern for the clock angle problem, which teaches you to break down a continuous measurement into discrete components:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def angleClock(hour: int, minutes: int) -> float:
    # Each hour represents 30 degrees (360/12).
    # Each minute, the hour hand moves 0.5 degrees (30/60).
    hour_angle = (hour % 12) * 30 + minutes * 0.5
    # Each minute represents 6 degrees (360/60).
    minute_angle = minutes * 6
    # Find the absolute difference.
    diff = abs(hour_angle - minute_angle)
    # Return the smaller angle (the acute/reflex angle).
    return min(diff, 360 - diff)
```

```javascript
// Time: O(1) | Space: O(1)
function angleClock(hour, minutes) {
  const hourAngle = (hour % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6;
  const diff = Math.abs(hourAngle - minuteAngle);
  return Math.min(diff, 360 - diff);
}
```

```java
// Time: O(1) | Space: O(1)
public double angleClock(int hour, int minutes) {
    double hourAngle = (hour % 12) * 30 + minutes * 0.5;
    double minuteAngle = minutes * 6;
    double diff = Math.abs(hourAngle - minuteAngle);
    return Math.min(diff, 360 - diff);
}
```

</div>

## How to Prepare

Your preparation should focus on precision and edge cases. For geometry, always consider:

1. **Units and Conversions**: Are you mixing degrees and radians? Hours and minutes?
2. **Periodicity**: Does the problem "wrap around" (like a clock or a circle)? Use modulo.
3. **Floating Point Precision**: Can you use integers to avoid precision errors? If you must use floats, be prepared to compare with a tolerance (e.g., `abs(a - b) < 1e-9`).

For number theory, master fast modular exponentiation. This is a non-negotiable pattern for problems like [Super Pow (#372)](https://leetcode.com/problems/super-pow/), which is about calculating a^b mod m efficiently for large b.

<div class="code-group">

```python
# Time: O(n) where n is len(power array) | Space: O(1)
# Modular exponentiation: (a^b) % m
def superPow(a: int, b: list[int]) -> int:
    MOD = 1337
    result = 1
    for digit in b:
        # Use the property: (a^(10*x + y)) % m = ((a^x)^10 * a^y) % m
        # We process digit by digit.
        result = pow(result, 10, MOD) * pow(a, digit, MOD) % MOD
    return result

# Helper: General fast modular exponentiation (binary exponentiation)
def modPow(base: int, exp: int, mod: int) -> int:
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:  # If exp is odd
            result = (result * base) % mod
        base = (base * base) % mod
        exp >>= 1  # Divide exp by 2
    return result
```

```javascript
// Time: O(n) | Space: O(1)
function superPow(a, b) {
  const MOD = 1337;
  let result = 1;
  for (let digit of b) {
    result = (pow(result, 10) * pow(a, digit)) % MOD;
  }
  return result;

  // Fast modular exponentiation helper
  function pow(x, n) {
    if (n === 0) return 1;
    x %= MOD;
    let res = 1;
    while (n > 0) {
      if (n & 1) res = (res * x) % MOD;
      x = (x * x) % MOD;
      n >>= 1;
    }
    return res;
  }
}
```

```java
// Time: O(n) | Space: O(1)
public int superPow(int a, int[] b) {
    final int MOD = 1337;
    int result = 1;
    for (int digit : b) {
        result = (pow(result, 10, MOD) * pow(a, digit, MOD)) % MOD;
    }
    return result;
}

private int pow(int base, int exp, int mod) {
    int result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp >>= 1;
    }
    return result;
}
```

</div>

## How Agoda Tests Math vs Other Companies

Compared to FAANG companies, Agoda's Math problems are less about clever combinatorial tricks (like at Google) and less about probability brainteasers (like at Facebook/Meta). They are more **applied and deterministic**. You're given a clear, often visual, problem and are expected to derive the correct formula. The difficulty is not in complex algorithm design but in accurate mathematical modeling and handling all edge cases flawlessly.

What's unique is the **travel domain context**. While the problem might be a standard LeetCode Math problem, interviewers are often looking for you to make the connection to a real-world use case—calculating the shortest path between points on a globe, optimizing layover times, or distributing resources across different time zones. Your explanation should reflect this understanding. Mentioning how your solution could be extended or applied in a travel booking system can be a strong positive signal.

## Study Order

Do not jump into complex problems. Build your foundation methodically.

1.  **Basic Arithmetic and Number Properties**: Start with problems involving operators, integer overflow, and basic modulo. This builds your comfort with numerical types.
2.  **Geometry Fundamentals**: Learn to calculate distances, angles, and areas. Focus on 2D Cartesian and polar coordinate systems. This is where you'll practice precision and periodicity.
3.  **Number Theory Essentials**: Study GCD/LCM (Euclidean algorithm) and prime number checking/sieving. These are building blocks for more complex problems.
4.  **Fast Exponentiation**: Master both standard and modular binary exponentiation. This is a critical optimization pattern.
5.  **Combinatorial Math**: Learn basic counting principles, permutations, and combinations, but only the straightforward applications. Deep probability is less common.
6.  **Simulation & Iterative Calculation**: Some Math problems are best solved by simulating a process (like robot movement). Practice translating rules into a loop.

This order works because each topic provides tools for the next. You can't understand modular exponentiation without a firm grasp of basic modulo arithmetic. You can't solve complex coordinate problems without being rock-solid on distance formulas.

## Recommended Practice Order

Solve these problems in sequence. Each introduces a new concept that the next one builds upon.

1.  **#7 Reverse Integer**: Teaches handling of integer overflow and digit manipulation.
2.  **#9 Palindrome Number**: Reinforces digit manipulation without string conversion.
3.  **#223 Rectangle Area**: A gentle introduction to 2D geometry and overlapping areas.
4.  **#365 Water and Jug Problem**: Applies GCD to a real-world measurement problem.
5.  **#1344 Angle Between Hands of a Clock**: The classic Agoda-style geometry problem.
6.  **#50 Pow(x, n)**: Master fast exponentiation (non-modular first).
7.  **#372 Super Pow**: Apply fast exponentiation in a modular context with array-based exponents.

After this core set, if you have time, explore **#149 Max Points on a Line** (advanced geometry with slope calculation and edge cases) and **#166 Fraction to Recurring Decimal** (tests precision and cycle detection with a hash map).

Remember, for Agoda, the goal is not to be a mathematician but to be an engineer who can reliably and efficiently implement mathematical models. Your code should be as precise as your reasoning.

[Practice Math at Agoda](/company/agoda/math)
