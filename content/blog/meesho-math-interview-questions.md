---
title: "Math Questions at Meesho: What to Expect"
description: "Prepare for Math interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-11-25"
category: "dsa-patterns"
tags: ["meesho", "math", "interview prep"]
---

Math questions appear in 8 of Meesho's 44 total interview problems. For a company built on data-driven decisions in e-commerce, logistics, and pricing, these aren't abstract puzzles. They test your ability to model real-world scenarios—calculating optimal delivery routes, analyzing user growth rates, or determining profit margins—with efficient, scalable code. Strong math skills signal you can translate business logic into precise algorithms.

## What to Expect — Types of Problems

Meesho's math problems typically fall into three categories:

1.  **Combinatorics & Probability:** Questions involving counting, permutations, or basic probability. You might calculate the number of ways to arrange products in a catalog or the likelihood of a specific user event.
2.  **Modular Arithmetic & Number Theory:** Problems dealing with remainders, divisibility, or properties of integers. These are common in tasks related to scheduling, batching, or cyclic processes.
3.  **Simple Mathematical Modeling:** Applying formulas or deriving equations from word problems. This could involve calculating costs, revenues, or geometric properties relevant to warehouse layouts or delivery distances.

The focus is less on advanced calculus and more on discrete math and logical derivation that leads directly to an algorithmic solution.

## How to Prepare — Study Tips with One Code Example

Focus on core concepts: prime numbers, greatest common divisor (GCD), least common multiple (LCM), modular exponentiation, and basic combinatorics (nCr, nPr). Practice translating word problems into these constructs.

A key pattern is using the **Sieve of Eratosthenes** for problems involving primes. This is essential for precomputing prime numbers efficiently up to a given limit `n`.

<div class="code-group">

```python
def sieve_of_eratosthenes(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
        p += 1
    primes = [i for i, prime in enumerate(is_prime) if prime]
    return primes
```

```javascript
function sieveOfEratosthenes(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      for (let i = p * p; i <= n; i += p) {
        isPrime[i] = false;
      }
    }
  }
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }
  return primes;
}
```

```java
import java.util.ArrayList;
import java.util.List;

public List<Integer> sieveOfEratosthenes(int n) {
    boolean[] isPrime = new boolean[n + 1];
    for (int i = 2; i <= n; i++) isPrime[i] = true;
    for (int p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
            for (int i = p * p; i <= n; i += p) {
                isPrime[i] = false;
            }
        }
    }
    List<Integer> primes = new ArrayList<>();
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) primes.add(i);
    }
    return primes;
}
```

</div>

## Recommended Practice Order

1.  Start with foundational number theory: prime checks, GCD/LCM, and modular arithmetic.
2.  Move to combinatorics formulas, understanding how to compute nCr without overflow using iterative multiplication or dynamic programming.
3.  Practice probability problems that combine counting with ratio calculations.
4.  Finally, solve integrated word problems from Meesho's past questions, focusing on breaking down the narrative into the mathematical components above.

[Practice Math at Meesho](/company/meesho/math)
