---
title: "Math Questions at Citadel: What to Expect"
description: "Prepare for Math interview questions at Citadel — patterns, difficulty breakdown, and study tips."
date: "2028-07-23"
category: "dsa-patterns"
tags: ["citadel", "math", "interview prep"]
---

## Why Math Matters at Citadel

If you're preparing for Citadel interviews, you've probably seen the stats: 15 out of 96 total questions in their tagged LeetCode problems are math-related. That's about 15%—significantly higher than the typical 5-10% at most big tech companies. But the raw number understates the reality. At Citadel, math isn't just another category; it's woven into the fabric of their problem-solving culture.

Why? Because quantitative trading is fundamentally about mathematical modeling. Whether it's calculating probabilities for trade outcomes, optimizing portfolio allocations, or modeling market behaviors, Citadel's engineers and researchers think in mathematical terms daily. In interviews, math questions serve as a direct filter for this quantitative mindset. They test your ability to translate real-world constraints into clean mathematical expressions—exactly what you'd do when designing trading systems.

I've spoken with several engineers who've interviewed at Citadel, and the consensus is clear: expect at least one substantial math problem in every technical round. Sometimes it's standalone; other times it's embedded within what appears to be a data structures problem. Unlike companies where math might be an afterthought, here it's a core focus area that can make or break your interview performance.

## Specific Patterns Citadel Favors

Citadel's math problems tend to cluster around three key areas:

1. **Modular Arithmetic and Number Theory** – Problems involving remainders, divisibility, and properties of integers. These appear frequently because they model cyclical patterns (like repeating market cycles) and require precise, efficient computation.

2. **Probability and Combinatorics** – Direct calculations of odds, expected values, and counting problems. These test your ability to reason about uncertainty—a daily reality in trading.

3. **Mathematical Optimization** – Problems where you need to maximize or minimize an outcome given constraints, often using greedy approaches or mathematical insights rather than brute force.

Notice what's _not_ heavily emphasized: complex calculus or linear algebra proofs. While those might appear in quantitative researcher interviews, for software engineering roles, Citadel focuses on discrete math that translates directly to algorithmic implementation.

A classic example is **LeetCode 365. Water and Jug Problem**, which appears in their tagged list. It looks like a simulation problem, but the efficient solution relies entirely on number theory—specifically Bézout's identity and the properties of greatest common divisors. Another favorite pattern appears in **LeetCode 470. Implement Rand10() Using Rand7()**, which tests probability reasoning and rejection sampling.

Here's the number theory pattern from the Water and Jug Problem:

<div class="code-group">

```python
# Time: O(log(min(x, y))) | Space: O(1)
def can_measure_water(jug1_capacity: int, jug2_capacity: int, target: int) -> bool:
    # The mathematical insight: using Bézout's identity,
    # we can only measure amounts that are multiples of GCD(x, y)
    if jug1_capacity + jug2_capacity < target:
        return False

    # Special case: target of 0 is always measurable
    if target == 0:
        return True

    # The core math: target must be divisible by GCD of capacities
    from math import gcd
    return target % gcd(jug1_capacity, jug2_capacity) == 0
```

```javascript
// Time: O(log(min(x, y))) | Space: O(1)
function canMeasureWater(jug1Capacity, jug2Capacity, target) {
  // Bézout's identity application
  if (jug1Capacity + jug2Capacity < target) return false;
  if (target === 0) return true;

  // Euclidean algorithm for GCD
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  return target % gcd(jug1Capacity, jug2Capacity) === 0;
}
```

```java
// Time: O(log(min(x, y))) | Space: O(1)
public boolean canMeasureWater(int jug1Capacity, int jug2Capacity, int target) {
    // Mathematical solution using GCD properties
    if (jug1Capacity + jug2Capacity < target) return false;
    if (target == 0) return true;

    // Euclidean algorithm implementation
    int a = jug1Capacity, b = jug2Capacity;
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    int gcd = a;
    return target % gcd == 0;
}
```

</div>

## How to Prepare

Most candidates make the mistake of approaching Citadel's math problems like standard algorithm questions—they try to brute force or simulate their way through. This almost always fails on time or memory constraints. The key insight is that Citadel expects you to find the mathematical simplification first, then implement it.

Here's my preparation strategy:

1. **Recognize the mathematical core** – When you see a problem involving numbers, ask: "What mathematical property governs this system?" Is it divisibility rules? Probability distributions? Geometric progressions?

2. **Prove it to yourself** – Don't just memorize solutions. Work through small examples on paper to discover the pattern. For probability problems, draw probability trees. For number theory, test with different values.

3. **Implement the efficient version** – Once you understand the mathematical insight, code it cleanly with proper edge cases.

Let's look at a probability pattern from **LeetCode 528. Random Pick with Weight**:

<div class="code-group">

```python
# Time: O(n) for init, O(log n) for pickIndex | Space: O(n)
import random, bisect

class Solution:
    def __init__(self, w: List[int]):
        # Create prefix sums for probability distribution
        self.prefix_sums = []
        prefix_sum = 0
        for weight in w:
            prefix_sum += weight
            self.prefix_sums.append(prefix_sum)
        self.total_sum = prefix_sum

    def pickIndex(self) -> int:
        # Binary search to find position of random value
        target = random.random() * self.total_sum
        return bisect.bisect_left(self.prefix_sums, target)
```

```javascript
// Time: O(n) for init, O(log n) for pickIndex | Space: O(n)
class Solution {
  constructor(w) {
    this.prefixSums = [];
    let prefixSum = 0;
    for (const weight of w) {
      prefixSum += weight;
      this.prefixSums.push(prefixSum);
    }
    this.totalSum = prefixSum;
  }

  pickIndex() {
    const target = Math.random() * this.totalSum;
    // Binary search implementation
    let left = 0,
      right = this.prefixSums.length - 1;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.prefixSums[mid] <= target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  }
}
```

```java
// Time: O(n) for init, O(log n) for pickIndex | Space: O(n)
class Solution {
    private int[] prefixSums;
    private int totalSum;
    private Random random;

    public Solution(int[] w) {
        prefixSums = new int[w.length];
        int prefixSum = 0;
        for (int i = 0; i < w.length; i++) {
            prefixSum += w[i];
            prefixSums[i] = prefixSum;
        }
        totalSum = prefixSum;
        random = new Random();
    }

    public int pickIndex() {
        double target = random.nextDouble() * totalSum;
        // Binary search to find correct index
        int left = 0, right = prefixSums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (prefixSums[mid] <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
}
```

</div>

## How Citadel Tests Math vs Other Companies

At most FAANG companies, math problems tend to be simpler—often just basic arithmetic within a larger algorithm problem. At Google, you might need to calculate a running sum; at Meta, you might compute a simple probability. The math is usually secondary to the main algorithm.

Citadel flips this relationship. Here, the mathematical insight _is_ the main algorithm. The implementation becomes almost trivial once you've found the right mathematical approach. This reflects their real-world work: quants and engineers spend most of their time modeling problems mathematically, then implementing clean solutions.

Another difference is difficulty progression. At other companies, math problems might be early warm-up questions. At Citadel, they're often the main event—moderately to highly difficult problems that require genuine insight. I've seen candidates breeze through the data structure questions only to get stuck on what looked like a simple probability calculation.

## Study Order

1. **Basic Number Theory** – Start with divisibility, prime numbers, and modular arithmetic. These concepts underpin many optimization problems. Without this foundation, you'll miss key insights.

2. **Probability Fundamentals** – Learn basic probability rules, expected value calculations, and common distributions. Focus on problems where you need to compute probabilities algorithmically.

3. **Combinatorics** – Master counting techniques (permutations, combinations) and how to avoid double-counting in algorithms. This often appears in problems about "number of ways" to do something.

4. **Mathematical Optimization** – Study greedy proofs and when they apply. Learn to recognize when a problem reduces to a known optimization (like minimizing maximums or maximizing minimums).

5. **Advanced Number Theory** – Move to GCD/LCM properties, modular inverses, and Bézout's identity. These solve entire classes of problems that seem complex but have elegant mathematical solutions.

This order works because each topic builds on the previous one. Number theory gives you tools to recognize divisibility patterns in optimization problems. Probability often combines with combinatorics for counting favorable outcomes. Trying to study them in reverse would be like learning calculus before algebra.

## Recommended Practice Order

1. **LeetCode 204. Count Primes** – Introduces efficient computation using mathematical properties (Sieve of Eratosthenes).

2. **LeetCode 326. Power of Three** – Tests understanding of number properties without loops/recursion.

3. **LeetCode 367. Valid Perfect Square** – Mathematical optimization using binary search.

4. **LeetCode 462. Minimum Moves to Equal Array Elements II** – Reduces to a median finding problem (mathematical insight).

5. **LeetCode 470. Implement Rand10() Using Rand7()** – Probability and rejection sampling.

6. **LeetCode 528. Random Pick with Weight** – Probability distributions and prefix sums.

7. **LeetCode 365. Water and Jug Problem** – Number theory application (GCD properties).

8. **LeetCode 878. Nth Magical Number** – Combines number theory with binary search.

9. **LeetCode 914. X of a Kind in a Deck of Cards** – Another GCD application problem.

10. **LeetCode 1512. Number of Good Pairs** – Combinatorial counting (simple but tests your formula derivation).

Work through these in order, focusing on understanding _why_ the mathematical solution works, not just memorizing it. For each problem, ask yourself: "What property did I use? How would I explain this proof to an interviewer?"

Remember: at Citadel, showing your mathematical reasoning process is as important as getting the right answer. They want to see how you think about problems, not just that you can implement solutions.

[Practice Math at Citadel](/company/citadel/math)
