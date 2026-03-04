---
title: "Math Questions at Zomato: What to Expect"
description: "Prepare for Math interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-14"
category: "dsa-patterns"
tags: ["zomato", "math", "interview prep"]
---

Math questions appear in roughly 10% of Zomato's technical interviews (3 out of 29 total questions). They aren't about advanced calculus; they test your quantitative reasoning, ability to model real-world scenarios with code, and skill at optimizing operations—core competencies for a company dealing with logistics, pricing, delivery time estimation, and data analytics at scale.

## What to Expect — Types of Problems

Zomato's math problems typically fall into two categories. First, **applied arithmetic and probability**: questions about delivery probabilities, discount and commission calculations, or average order values. You might calculate the expected time for multiple delivery agents to cover an area or model a simple pricing strategy. Second, **basic number theory and combinatorics**: problems involving divisors, multiples, permutations of menu items or delivery routes, or counting valid arrangements. These questions assess your logical structuring of a problem more than raw mathematical knowledge. The common thread is translating a business or logistical constraint into a clean, efficient piece of logic.

## How to Prepare — Study Tips

Focus on foundational concepts. Review modular arithmetic, greatest common divisor (GCD)/least common multiple (LCM), prime checks, and basic combinatorics (nCr calculations). Practice probability problems involving simple independent and dependent events. Use brute-force simulation for verification when stuck. Most importantly, learn to decompose word problems into discrete computational steps. For example, a problem about scheduling delivery slots might reduce to finding the LCM of time intervals.

A key pattern is using the **Euclidean algorithm** to find the GCD, often the first step in solving problems about dividing resources, finding common cycles, or simplifying ratios.

<div class="code-group">

```python
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

# Example: Simplify a driver-to-order ratio
def simplify_ratio(num, den):
    divisor = gcd(num, den)
    return num // divisor, den // divisor
```

```javascript
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

// Example: Simplify a driver-to-order ratio
function simplifyRatio(num, den) {
  const divisor = gcd(num, den);
  return [num / divisor, den / divisor];
}
```

```java
public class MathUtil {
    public static int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Example: Simplify a driver-to-order ratio
    public static int[] simplifyRatio(int num, int den) {
        int divisor = gcd(num, den);
        return new int[]{num / divisor, den / divisor};
    }
}
```

</div>

## Recommended Practice Order

1.  **Core Concepts:** Solidify GCD/LCM, prime factorization, and modular arithmetic.
2.  **Probability Basics:** Practice counting favorable outcomes and calculating simple expected values.
3.  **Word Problems:** Translate scenarios about delivery times, pricing, or resource allocation into code.
4.  **Optimization:** Look for ways to avoid brute force—use mathematical properties to reduce complexity.
5.  **Simulation:** For probability questions, write a quick simulation to verify your analytical solution.

[Practice Math at Zomato](/company/zomato/math)
