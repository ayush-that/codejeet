---
title: "Math Questions at Media.net: What to Expect"
description: "Prepare for Math interview questions at Media.net — patterns, difficulty breakdown, and study tips."
date: "2030-07-13"
category: "dsa-patterns"
tags: ["medianet", "math", "interview prep"]
---

Math questions at Media.net aren't about abstract theory—they're practical problem-solving tools for ad tech. Media.net builds complex systems for real-time bidding, ad targeting, and optimization algorithms. These systems require precise calculations for metrics like click-through rates, revenue per mille (RPM), budget pacing, and statistical forecasting. The five math questions in their 33-question interview assess your ability to translate real-world constraints into efficient, logical code. If you can't handle the math, you can't handle the core engineering problems.

## What to Expect — Types of Problems

Expect combinatorics, probability, and modular arithmetic applied to practical scenarios. You won't solve integrals; you'll write code that counts, calculates odds, or sequences events under constraints.

1. **Combinatorics & Counting**: "Find the number of valid ad placements" or "Count unique user ID combinations under rules." These test systematic thinking.
2. **Probability & Statistics**: "Calculate the expected value of ad revenue given click probabilities" or "Simulate A/B test outcomes." Direct application to their business.
3. **Modular Arithmetic & Number Theory**: "Schedule ad rotations in cycles" or "Hash user IDs into buckets." Essential for distributed systems.
4. **Optimization & Greedy Math**: "Maximize revenue with budget caps" or "Minimize server load with constraints." Core to resource management.
5. **Bit Manipulation & Efficient Math**: "Check power-of-two for allocation" or "Compute fast modulo operations." Low-level performance matters.

## How to Prepare — Study Tips with One Code Example

Focus on translating word problems into clean code. Practice these steps: 1) Restate the problem in your own words, 2) Identify the mathematical rule (combination formula, probability law, etc.), 3) Write brute-force logic first if needed, 4) Optimize with mathematical insights. Use Python for quick iteration, but be ready to implement in Java or JavaScript.

A common pattern is using the **nCr (combinations)** formula efficiently, often with modular arithmetic to avoid overflow. Here’s how to implement it using precomputed factorials with modulo (common in counting problems where results are large):

<div class="code-group">

```python
MOD = 10**9 + 7

class Combinatorics:
    def __init__(self, max_n):
        self.fact = [1] * (max_n + 1)
        self.inv_fact = [1] * (max_n + 1)
        for i in range(1, max_n + 1):
            self.fact[i] = self.fact[i-1] * i % MOD
        self.inv_fact[max_n] = pow(self.fact[max_n], MOD-2, MOD)
        for i in range(max_n-1, -1, -1):
            self.inv_fact[i] = self.inv_fact[i+1] * (i+1) % MOD

    def nCr(self, n, r):
        if r < 0 or r > n:
            return 0
        return self.fact[n] * self.inv_fact[r] % MOD * self.inv_fact[n-r] % MOD
```

```javascript
const MOD = 1e9 + 7;

class Combinatorics {
  constructor(maxN) {
    this.fact = new Array(maxN + 1).fill(1);
    this.invFact = new Array(maxN + 1).fill(1);
    for (let i = 1; i <= maxN; i++) {
      this.fact[i] = (this.fact[i - 1] * i) % MOD;
    }
    this.invFact[maxN] = this.modPow(this.fact[maxN], MOD - 2);
    for (let i = maxN - 1; i >= 0; i--) {
      this.invFact[i] = (this.invFact[i + 1] * (i + 1)) % MOD;
    }
  }

  modPow(a, b) {
    let res = 1;
    while (b > 0) {
      if (b & 1) res = (res * a) % MOD;
      a = (a * a) % MOD;
      b >>= 1;
    }
    return res;
  }

  nCr(n, r) {
    if (r < 0 || r > n) return 0;
    return (((this.fact[n] * this.invFact[r]) % MOD) * this.invFact[n - r]) % MOD;
  }
}
```

```java
public class Combinatorics {
    private static final int MOD = 1_000_000_007;
    private long[] fact, invFact;

    public Combinatorics(int maxN) {
        fact = new long[maxN + 1];
        invFact = new long[maxN + 1];
        fact[0] = 1;
        for (int i = 1; i <= maxN; i++) {
            fact[i] = fact[i-1] * i % MOD;
        }
        invFact[maxN] = modPow(fact[maxN], MOD-2);
        for (int i = maxN-1; i >= 0; i--) {
            invFact[i] = invFact[i+1] * (i+1) % MOD;
        }
    }

    private long modPow(long a, long b) {
        long res = 1;
        while (b > 0) {
            if ((b & 1) == 1) res = res * a % MOD;
            a = a * a % MOD;
            b >>= 1;
        }
        return res;
    }

    public long nCr(int n, int r) {
        if (r < 0 || r > n) return 0;
        return fact[n] * invFact[r] % MOD * invFact[n-r] % MOD;
    }
}
```

</div>

## Recommended Practice Order

1. **Basics**: Prime numbers, GCD/LCM, modular arithmetic, fast exponentiation.
2. **Combinatorics**: Permutations, combinations, inclusion-exclusion principle.
3. **Probability**: Expected value, conditional probability, basic distributions.
4. **Optimization**: Greedy proofs, linear programming intuition.
5. **Media.net-specific**: Practice problems tagged with "Media.net Math" on coding platforms—they often mirror actual interview questions.

Work through problems in this sequence, always coding your solutions. Time yourself; these questions are often part of a larger timed assessment.

[Practice Math at Media.net](/company/medianet/math)
