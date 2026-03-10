---
title: "Math Questions at Google: What to Expect"
description: "Prepare for Math interview questions at Google — patterns, difficulty breakdown, and study tips."
date: "2027-01-26"
category: "dsa-patterns"
tags: ["google", "math", "interview prep"]
---

# Math Questions at Google: What to Expect

Google has 339 Math questions out of 2217 total on LeetCode. That's roughly 15% of their tagged problems, which is a significant chunk. But what does this mean for your interview? Is math a core focus, or just another topic you might get unlucky with? The answer is nuanced. Google's products—from search ranking and ad auctions to distributed systems and machine learning—are fundamentally built on mathematical principles. While you won't be deriving theorems on a whiteboard, you will absolutely encounter problems that test mathematical reasoning, number theory, probability, and clever optimizations that stem from a solid grasp of discrete math. In real interviews, a "math" question might not be labeled as such; it could be a dynamic programming problem with combinatorial counting, or a simulation that requires understanding modular arithmetic. Expect at least one round, often the phone screen or a general technical round, to lean heavily into logical/mathematical problem-solving.

## Specific Patterns Google Favors

Google's math problems tend to cluster around a few high-value areas. They favor **computational number theory** (prime numbers, divisors, GCD/LCM), **combinatorics and probability** (often disguised as counting problems), and **bit manipulation** puzzles that require you to think in binary. You'll also see "simulation" problems that are essentially applied arithmetic or algebra. Recursion appears frequently for problems involving permutations or sequences.

A key observation: Google often asks problems where the brute-force solution is obvious but computationally impossible, forcing you to find a mathematical insight that reduces the complexity from exponential or O(n²) to O(n) or even O(log n). For example, **"Perfect Squares" (LeetCode #279)** isn't just a BFS problem; the optimal solution uses Lagrange's four-square theorem. **"Ugly Number II" (LeetCode #264)** is a classic that uses a merged-sort approach derived from understanding the number's mathematical property.

Here’s a core pattern: using the **GCD (Greatest Common Divisor)** to reduce problems about divisibility or partitioning. Consider the problem **"Water and Jug Problem" (LeetCode #365)**. The brute-force BFS is messy. The mathematical insight is that the amount of water you can measure is a linear combination of the jug capacities, and by Bézout's identity, this is a multiple of their GCD.

<div class="code-group">

```python
# LeetCode #365: Water and Jug Problem - Mathematical Solution
# Time: O(log(min(x, y))) for GCD computation | Space: O(1)
def canMeasureWater(jug1Capacity: int, jug2Capacity: int, targetCapacity: int) -> bool:
    # If the target is more than the combined capacity, impossible.
    if jug1Capacity + jug2Capacity < targetCapacity:
        return False
    # Bézout's identity: target must be divisible by GCD of the jug capacities.
    # Special case: target of 0 is always measurable.
    from math import gcd
    return targetCapacity % gcd(jug1Capacity, jug2Capacity) == 0
```

```javascript
// LeetCode #365: Water and Jug Problem - Mathematical Solution
// Time: O(log(min(x, y))) for GCD computation | Space: O(1)
function canMeasureWater(jug1Capacity, jug2Capacity, targetCapacity) {
  if (jug1Capacity + jug2Capacity < targetCapacity) return false;
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  return targetCapacity % gcd(jug1Capacity, jug2Capacity) === 0;
}
```

```java
// LeetCode #365: Water and Jug Problem - Mathematical Solution
// Time: O(log(min(x, y))) for GCD computation | Space: O(1)
public boolean canMeasureWater(int jug1Capacity, int jug2Capacity, int targetCapacity) {
    if (jug1Capacity + jug2Capacity < targetCapacity) return false;
    return targetCapacity % gcd(jug1Capacity, jug2Capacity) == 0;
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

Another favorite is the **"reservoir sampling"** pattern for probability-based questions, like **"Linked List Random Node" (LeetCode #382)**. This tests whether you understand uniform probability in a streaming context.

## How to Prepare

Don't just memorize formulas. Focus on deriving insights. For each math problem you practice, ask: _What is the underlying property here?_ Start by categorizing problems:

1.  **Modular Arithmetic & Cycles:** Problems involving clocks, circular arrays, or sequences that repeat. Key tool: the modulo operator `%`. Practice **"Happy Number" (LeetCode #202)** which uses Floyd's cycle detection, a math-inspired algorithm.
2.  **Prime Numbers:** Sieve of Eratosthenes is a must-know. Understand how to check primality efficiently (up to √n). See **"Count Primes" (LeetCode #204)**.
3.  **Combinatorics:** Know the basics of permutations and combinations. The key is often to find a formula or a recurrence relation instead of generating all possibilities. **"Unique Paths" (LeetCode #62)** is a classic DP problem that is fundamentally combinatorial (it's "m+n-2 choose m-1").
4.  **Bit Manipulation:** Practice tricks like `n & (n-1)` to clear the lowest set bit (used in **"Number of 1 Bits" #191**), XOR properties, and mask creation.

Here's a common variation: counting something by iterating over divisors, not multiples. A brute-force approach might be O(n²). The mathematical optimization is to realize you can count contributions per divisor.

<div class="code-group">

```python
# Pattern: Sum of divisors or counting multiples efficiently.
# Example: Find the sum of all multiples of 3 or 5 below N (Project Euler #1 style).
# Time: O(1) using arithmetic series formula | Space: O(1)
def sum_multiples(n, a, b):
    def sum_divisible_by(k):
        # Number of terms: (n-1) // k
        p = (n - 1) // k
        return k * p * (p + 1) // 2  # Sum of first p numbers * k
    # Use inclusion-exclusion to avoid double-counting multiples of LCM(a,b)
    return sum_divisible_by(a) + sum_divisible_by(b) - sum_divisible_by(a * b // gcd(a, b))
```

```javascript
// Pattern: Sum of divisors or counting multiples efficiently.
// Time: O(1) | Space: O(1)
function sumMultiples(n, a, b) {
  const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
  const lcm = (x, y) => (x * y) / gcd(x, y);
  const sumDivisibleBy = (k) => {
    const p = Math.floor((n - 1) / k);
    return (k * p * (p + 1)) / 2;
  };
  return sumDivisibleBy(a) + sumDivisibleBy(b) - sumDivisibleBy(lcm(a, b));
}
```

```java
// Pattern: Sum of divisors or counting multiples efficiently.
// Time: O(1) | Space: O(1)
public int sumMultiples(int n, int a, int b) {
    int lcm = a * b / gcd(a, b);
    return sumDivisibleBy(a, n) + sumDivisibleBy(b, n) - sumDivisibleBy(lcm, n);
}
private int sumDivisibleBy(int k, int n) {
    int p = (n - 1) / k;
    return k * p * (p + 1) / 2;
}
private int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}
```

</div>

## How Google Tests Math vs Other Companies

At companies like Facebook (Meta), math problems often appear in the context of probability and statistics for A/B testing or in puzzles for the "product sense" rounds. Amazon might ask more about combinatorics in relation to system scalability (e.g., "how many ways can you arrange these orders?"). Microsoft has a history of tricky brainteasers, though these are less common now.

Google's approach is distinct in two ways:

1.  **Depth over Obscurity:** They prefer a problem with a shallow brute-force and a deep, elegant mathematical solution. They want to see you discover the pattern. The interviewer will often nudge you toward the insight if you're on the right track.
2.  **Integration with CS Fundamentals:** The math is rarely isolated. It's combined with algorithms. For instance, **"Minimum Area Rectangle" (LeetCode #939)** is a geometry problem solved efficiently with hashing. You need both the mathematical understanding of parallel lines and the CS skill of using a hash set for O(1) lookups.

The difficulty is often "Medium" on LeetCode, but the _jump_ from the naive to the optimal solution is what makes it a Google-level "Medium."

## Study Order

Tackle these sub-topics in this order to build a cumulative understanding:

1.  **Basic Number Properties & Bit Manipulation:** Start here because it's the foundation. Learn about even/odd, divisibility, prime numbers, and binary representations. Problems: **"Power of Two" (LeetCode #231)**, **"Missing Number" (LeetCode #268)**.
2.  **Modular Arithmetic and Cycles:** This extends basic arithmetic and introduces the concept of state and repetition. Problems: **"Happy Number" (LeetCode #202)**.
3.  **GCD, LCM, and Euclidean Algorithm:** This is a cornerstone for many optimization problems. Understand it deeply. Problems: **"Water and Jug Problem" (LeetCode #365)**.
4.  **Combinatorics (Basics) & Counting Principles:** Before diving into complex DP, get comfortable with simple permutations, combinations, and the "stars and bars" method. Problems: **"Unique Paths" (LeetCode #62)**.
5.  **Probability and Randomization:** Learn reservoir sampling and how to generate random numbers with constraints. Problems: **"Implement Rand10() Using Rand7()" (LeetCode #470)**.
6.  **Geometric and Linear Algebra Concepts:** Save this for last. Focus on practical computational geometry: area, distance, line intersections. Problems: **"Rectangle Overlap" (LeetCode #836)**.

## Recommended Practice Order

Solve these problems in sequence. Each one introduces a concept used in the next.

1.  **#191 Number of 1 Bits** - Master bit manipulation.
2.  **#202 Happy Number** - Learn cycle detection with fast/slow pointers (a math/algorithm hybrid).
3.  **#204 Count Primes** - Implement the Sieve of Eratosthenes.
4.  **#365 Water and Jug Problem** - Apply GCD/Bézout's identity.
5.  **#62 Unique Paths** - Solve with DP, then derive the combinatorial formula.
6.  **#470 Implement Rand10() Using Rand7()** - Understand probability scaling and rejection sampling.
7.  **#939 Minimum Area Rectangle** - Apply coordinate geometry with hashing.
8.  **#279 Perfect Squares** - A harder problem that may require knowing the four-square theorem, but can be solved with DP or BFS first.

This progression moves from pure number tricks to integrated algorithm-math problems, mirroring what you'll see in an interview.

[Practice Math at Google](/company/google/math)
