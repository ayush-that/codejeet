---
title: "Math Questions at Visa: What to Expect"
description: "Prepare for Math interview questions at Visa — patterns, difficulty breakdown, and study tips."
date: "2028-03-29"
category: "dsa-patterns"
tags: ["visa", "math", "interview prep"]
---

## Why Math Matters at Visa

If you're preparing for a Visa interview, you might be surprised to see that 15 of their 124 tagged problems on LeetCode are categorized under Math. That's about 12% of their problem set—a significant chunk compared to many other large tech companies. But here's the key insight: at Visa, "Math" problems aren't just academic exercises. They're directly tied to the company's core business domains: payment processing, fraud detection, currency conversion, interest calculations, and transaction optimization.

In real interviews, you're more likely to encounter these problems in early screening rounds (phone screens, online assessments) rather than in deep system design sessions. However, they serve as critical filters. Visa's engineering problems often involve handling massive transaction volumes efficiently, which requires mathematical thinking about time complexity, modulo operations, and numerical stability. A candidate who struggles with basic number theory or combinatorics might raise concerns about their ability to work with financial calculations where precision matters.

## Specific Patterns Visa Favors

Visa's Math problems cluster around three practical areas:

1. **Modular Arithmetic and Number Properties** – Essential for hashing, distributed systems (sharding), and cyclic calculations. You'll see problems involving remainders, divisibility, and finding patterns in sequences.
2. **Combinatorics and Probability** – Applied to fraud detection scenarios ("what's the probability of X pattern occurring?") and optimization problems.
3. **Numerical Algorithms** – Efficient computation without floating-point errors, often involving large integers or precise decimal handling.

Notice what's _not_ heavily emphasized: advanced calculus, linear algebra, or complex geometry. Visa's problems are discrete math with immediate engineering applications.

A classic example is **LeetCode 1010: Pairs of Songs With Total Durations Divisible by 60**. This isn't just a "math trick" problem—it mirrors calculating transaction timings across time zones where 60-minute cycles matter. Another frequent pattern appears in **LeetCode 1497: Check If Array Pairs Are Divisible by k**, which tests the same modular pairing logic.

Here's the core pattern for these modular pairing problems:

<div class="code-group">

```python
# Time: O(n) | Space: O(k) where k is the divisor
def numPairsDivisibleBy60(times):
    remainders = [0] * 60
    count = 0

    for time in times:
        remainder = time % 60
        complement = (60 - remainder) % 60  # Handles remainder 0 case
        count += remainders[complement]
        remainders[remainder] += 1

    return count

# Example: times = [30, 20, 150, 100, 40]
# remainder 30 looks for complement 30 (because 60-30=30)
# But special case: remainder 0 looks for complement 0
```

```javascript
// Time: O(n) | Space: O(k) where k is the divisor
function numPairsDivisibleBy60(times) {
  const remainders = new Array(60).fill(0);
  let count = 0;

  for (const time of times) {
    const remainder = time % 60;
    const complement = (60 - remainder) % 60;
    count += remainders[complement];
    remainders[remainder]++;
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(k) where k is the divisor
public int numPairsDivisibleBy60(int[] times) {
    int[] remainders = new int[60];
    int count = 0;

    for (int time : times) {
        int remainder = time % 60;
        int complement = (60 - remainder) % 60;
        count += remainders[complement];
        remainders[remainder]++;
    }

    return count;
}
```

</div>

The key insight is transforming an O(n²) pairwise check into O(n) using the modulo property: if `(a + b) % k == 0`, then `a % k == (-b) % k`. In financial systems, this pattern appears when grouping transactions into batches or detecting periodic patterns.

## How to Prepare

Don't just memorize solutions—understand the mathematical properties. For modular problems, practice deriving the complement formula. For combinatorics, learn when to use permutations vs combinations vs the multiplicative principle.

Here's another common pattern: computing probabilities or counts with dynamic programming. **LeetCode 688: Knight Probability in Chessboard** might seem game-related, but it's fundamentally about modeling state transitions—similar to calculating risk propagation in transaction networks.

<div class="code-group">

```python
# Time: O(k * n²) | Space: O(n²) for DP table
def knightProbability(n, k, row, column):
    # Directions a knight can move
    moves = [(2,1),(1,2),(-1,2),(-2,1),
             (-2,-1),(-1,-2),(1,-2),(2,-1)]

    # dp[r][c] = probability knight is on (r,c)
    dp = [[0] * n for _ in range(n)]
    dp[row][column] = 1.0

    for step in range(k):
        new_dp = [[0] * n for _ in range(n)]
        for r in range(n):
            for c in range(n):
                if dp[r][c] == 0:
                    continue
                prob = dp[r][c] / 8.0
                for dr, dc in moves:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < n and 0 <= nc < n:
                        new_dp[nr][nc] += prob
        dp = new_dp

    # Sum all probabilities
    return sum(sum(row) for row in dp)

# This models how probabilities spread—similar to fraud risk propagation
```

```javascript
// Time: O(k * n²) | Space: O(n²)
function knightProbability(n, k, row, column) {
  const moves = [
    [2, 1],
    [1, 2],
    [-1, 2],
    [-2, 1],
    [-2, -1],
    [-1, -2],
    [1, -2],
    [2, -1],
  ];

  let dp = Array.from({ length: n }, () => new Array(n).fill(0));
  dp[row][column] = 1.0;

  for (let step = 0; step < k; step++) {
    const newDp = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (dp[r][c] === 0) continue;
        const prob = dp[r][c] / 8.0;
        for (const [dr, dc] of moves) {
          const nr = r + dr,
            nc = c + dc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
            newDp[nr][nc] += prob;
          }
        }
      }
    }
    dp = newDp;
  }

  return dp.flat().reduce((sum, val) => sum + val, 0);
}
```

```java
// Time: O(k * n²) | Space: O(n²)
public double knightProbability(int n, int k, int row, int column) {
    int[][] moves = {{2,1},{1,2},{-1,2},{-2,1},
                     {-2,-1},{-1,-2},{1,-2},{2,-1}};

    double[][] dp = new double[n][n];
    dp[row][column] = 1.0;

    for (int step = 0; step < k; step++) {
        double[][] newDp = new double[n][n];
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                if (dp[r][c] == 0) continue;
                double prob = dp[r][c] / 8.0;
                for (int[] move : moves) {
                    int nr = r + move[0], nc = c + move[1];
                    if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                        newDp[nr][nc] += prob;
                    }
                }
            }
        }
        dp = newDp;
    }

    double total = 0;
    for (double[] rowArr : dp) {
        for (double val : rowArr) total += val;
    }
    return total;
}
```

</div>

## How Visa Tests Math vs Other Companies

Compared to Google or Facebook, Visa's Math problems are less about clever "aha!" moments and more about systematic application of discrete mathematics. At Google, you might get a probability brainteaser requiring creative thinking. At Visa, you'll get a problem like **LeetCode 523: Continuous Subarray Sum**, which tests your understanding of prefix sums and modular arithmetic—directly applicable to detecting periodic transaction patterns.

The difficulty is typically medium, not hard. But here's the catch: they expect clean, efficient code with proper edge case handling. A solution that works but uses O(n²) time might be rejected even if you explain the logic correctly. Visa cares about scalability because their systems process thousands of transactions per second.

What's unique is the business context. While a pure tech company might ask about prime numbers in abstract terms, Visa might frame it as "finding fraudulent transactions where amounts are prime numbers" (a real pattern in money laundering). Always think about how the mathematical concept applies to payments, currencies, or fraud.

## Study Order

1. **Modular Arithmetic Fundamentals** – Start with the properties of modulo operations, especially `(a + b) % k = (a % k + b % k) % k`. This is the foundation for most Visa math problems.
2. **Prefix Sums with Modulo** – Learn how to track cumulative sums modulo k to find divisible subarrays in O(n) time.
3. **Basic Combinatorics** – Practice counting problems where order matters vs doesn't matter. Understand the multiplication principle.
4. **Probability with DP** – Master simple state transition probability problems before attempting complex ones.
5. **Number Theory for Interviews** – Focus on GCD/LCM (Euclidean algorithm) and prime checking—skip advanced topics like Euler's totient unless you have extra time.

This order works because modular arithmetic appears in over half of Visa's math problems. Once you internalize those patterns, the other topics become easier since they often incorporate modular concepts.

## Recommended Practice Order

Solve these in sequence—each builds on the previous:

1. **LeetCode 1010: Pairs of Songs With Total Durations Divisible by 60** – The fundamental modulo pairing pattern.
2. **LeetCode 523: Continuous Subarray Sum** – Extends the pattern to subarrays using prefix sums.
3. **LeetCode 1497: Check If Array Pairs Are Divisible by k** – Same core with pairing constraints.
4. **LeetCode 1071: Greatest Common Divisor of Strings** – Applies number theory to string patterns.
5. **LeetCode 688: Knight Probability in Chessboard** – Probability with state transitions.
6. **LeetCode 470: Implement Rand10() Using Rand7()** – Probability and rejection sampling.
7. **LeetCode 1362: Closest Divisors** – Number factorization applied.

After these seven, you'll have covered 80% of the patterns Visa uses. The remaining problems are variations that test if you truly understand the fundamentals.

[Practice Math at Visa](/company/visa/math)
