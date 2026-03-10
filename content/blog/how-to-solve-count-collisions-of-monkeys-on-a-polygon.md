---
title: "How to Solve Count Collisions of Monkeys on a Polygon — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Collisions of Monkeys on a Polygon. Medium difficulty, 30.0% acceptance rate. Topics: Math, Recursion."
date: "2029-06-30"
category: "dsa-patterns"
tags: ["count-collisions-of-monkeys-on-a-polygon", "math", "recursion", "medium"]
---

# How to Solve Count Collisions of Monkeys on a Polygon

This problem asks: given a regular convex polygon with `n` vertices, each with one monkey, every monkey simultaneously moves to an adjacent vertex (either clockwise or counterclockwise with equal probability). We need to count the number of ways monkeys can move such that **at least one collision occurs** (two or more monkeys land on the same vertex). The result should be returned modulo \(10^9 + 7\).

What makes this problem tricky is that it's fundamentally a combinatorial counting problem disguised as a simulation. The total number of possible moves is easy to calculate (\(2^n\) since each of `n` monkeys has 2 choices), but counting the "collision" cases directly is complex. The key insight is to use the **complementary counting** principle: count the total ways minus the ways with **no collisions**.

## Visual Walkthrough

Let's trace through a small example with `n = 3` vertices (a triangle).

**Total possible moves:** Each monkey at vertices 0, 1, 2 can move clockwise (CW) or counterclockwise (CCW). That's \(2^3 = 8\) total possibilities.

**No-collision cases:** We need to count arrangements where all monkeys end up on different vertices after moving. Let's enumerate:

1. All move CW:  
   Vertex 0 → Vertex 1  
   Vertex 1 → Vertex 2  
   Vertex 2 → Vertex 0  
   Result: {1, 2, 0} → All different ✓

2. All move CCW:  
   Vertex 0 → Vertex 2  
   Vertex 1 → Vertex 0  
   Vertex 2 → Vertex 1  
   Result: {2, 0, 1} → All different ✓

3. Mixed patterns create collisions:  
   Example: Monkey 0 CW, Monkey 1 CW, Monkey 2 CCW  
   Vertex 0 → 1, Vertex 1 → 2, Vertex 2 → 1  
   Result: {1, 2, 1} → Collision at vertex 1 ✗

For `n = 3`, only the two cases where **all monkeys move in the same direction** avoid collisions. So no-collision count = 2.

**Collision cases:** Total (8) - No-collision (2) = 6 ways with at least one collision.

This pattern holds: for any `n`, the only no-collision scenarios occur when all monkeys move CW or all move CCW. Why? Because if monkeys mix directions, adjacent vertices will cause collisions.

## Brute Force Approach

A naive approach would be to generate all \(2^n\) possible move combinations (each monkey: 0 for CW, 1 for CCW), simulate the moves, check for collisions, and count valid ones.

```python
def brute_force(n):
    MOD = 10**9 + 7
    total = 2**n % MOD
    no_collision = 0

    # Generate all binary strings of length n
    for mask in range(2**n):
        positions = [0]*n
        # Simulate moves
        for i in range(n):
            direction = (mask >> i) & 1  # 0=CW, 1=CCW
            if direction == 0:
                positions[i] = (i + 1) % n  # CW move
            else:
                positions[i] = (i - 1) % n  # CCW move

        # Check if all positions are unique
        if len(set(positions)) == n:
            no_collision += 1

    return (total - no_collision) % MOD
```

**Why this fails:**  
Time complexity is \(O(2^n \cdot n)\) due to generating all combinations and checking uniqueness. For `n` up to \(10^9\) (as in the problem constraints), this is astronomically infeasible. Even for `n = 30`, we'd need to process over 1 billion combinations.

## Optimized Approach

The key insight is recognizing that **no-collision cases are extremely limited**. Let's reason through why:

1. **Observation 1:** Each vertex has exactly one monkey, and each monkey moves to one of two adjacent vertices.
2. **Observation 2:** For no collisions, all `n` final vertices must be distinct (bijection between start and end vertices).
3. **Observation 3:** Consider the movement pattern. If monkey at vertex `i` moves CW, it lands on `(i+1) mod n`. If it moves CCW, it lands on `(i-1) mod n`.
4. **Critical Insight:** If two adjacent monkeys move toward each other (i moves CW, i+1 moves CCW), they'll collide at the edge between them. More formally, for no collisions, the movement directions must be consistent around the polygon.

Through case analysis (or mathematical proof), we find only two patterns avoid collisions:

- **All monkeys move clockwise** → each monkey shifts to the next vertex
- **All monkeys move counterclockwise** → each monkey shifts to the previous vertex

Any mixed direction creates at least one collision because the circular arrangement forces adjacent conflicts.

Thus:

- Total ways: \(2^n\) (each monkey: 2 choices)
- No-collision ways: 2 (all CW or all CCW)
- Collision ways: \(2^n - 2\)

We must handle two edge cases:

1. `n = 1`: Only one monkey, can't collide with itself. Result should be 0.
2. Modulo arithmetic: Use \( \text{mod} = 10^9+7 \) for all calculations.

## Optimal Solution

We compute \( (2^n - 2) \mod (10^9+7) \) with fast modular exponentiation to handle large `n` efficiently.

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def monkeyMove(self, n: int) -> int:
    MOD = 10**9 + 7

    # Edge case: n = 1, no possible collisions
    if n == 1:
        return 0

    # Calculate 2^n mod MOD using fast exponentiation
    def pow_mod(base, exp, mod):
        result = 1
        base %= mod  # Ensure base is within mod range

        while exp > 0:
            # If exp is odd, multiply result by base
            if exp & 1:
                result = (result * base) % mod
            # Square the base and halve the exponent
            base = (base * base) % mod
            exp >>= 1  # Right shift = divide by 2
        return result

    # Total possible moves: 2^n mod MOD
    total = pow_mod(2, n, MOD)

    # Subtract 2 for the no-collision cases (all CW or all CCW)
    # Add MOD before modulo to handle negative result
    result = (total - 2) % MOD

    return result
```

```javascript
// Time: O(log n) | Space: O(1)
var monkeyMove = function (n) {
  const MOD = 1_000_000_007n; // Use BigInt for safety with large numbers

  // Edge case: n = 1, no possible collisions
  if (n === 1) return 0;

  // Fast modular exponentiation: (base^exp) % mod
  const powMod = (base, exp, mod) => {
    let result = 1n;
    let b = BigInt(base) % mod;
    let e = BigInt(exp);

    while (e > 0n) {
      // If exponent is odd, multiply result by base
      if (e & 1n) {
        result = (result * b) % mod;
      }
      // Square the base and halve the exponent
      b = (b * b) % mod;
      e >>= 1n; // Right shift = divide by 2
    }
    return Number(result % mod);
  };

  // Total possible moves: 2^n mod MOD
  const total = powMod(2, n, MOD);

  // Subtract 2 for no-collision cases, ensure non-negative
  let result = (total - 2) % Number(MOD);
  if (result < 0) result += Number(MOD);

  return result;
};
```

```java
// Time: O(log n) | Space: O(1)
class Solution {
    private static final int MOD = 1_000_000_007;

    public int monkeyMove(int n) {
        // Edge case: n = 1, no possible collisions
        if (n == 1) return 0;

        // Calculate 2^n mod MOD using fast exponentiation
        long total = powMod(2, n, MOD);

        // Subtract 2 for no-collision cases, ensure non-negative
        int result = (int)((total - 2 + MOD) % MOD);
        return result;
    }

    // Fast modular exponentiation: (base^exp) % mod
    private long powMod(long base, int exp, int mod) {
        long result = 1;
        base %= mod;

        while (exp > 0) {
            // If exponent is odd, multiply result by base
            if ((exp & 1) == 1) {
                result = (result * base) % mod;
            }
            // Square the base and halve the exponent
            base = (base * base) % mod;
            exp >>= 1; // Right shift = divide by 2
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** \(O(\log n)\)  
We use fast exponentiation (binary exponentiation) which requires \(O(\log n)\) multiplications. Each multiplication is \(O(1)\) since we work with fixed-size integers modulo \(10^9+7\).

**Space Complexity:** \(O(1)\)  
We only use a constant amount of extra space for variables, regardless of input size. The fast exponentiation is implemented iteratively, avoiding recursion stack.

## Common Mistakes

1. **Forgetting the n=1 edge case:**  
   With only one monkey, there are 2 possible moves (CW or CCW), but both land on the same vertex (itself). However, the problem defines collision as "two or more monkeys" on same vertex. Since there's only one monkey, no collision is possible. Result should be 0, not \(2^1 - 2 = 0\) (which coincidentally works) but the reasoning matters.

2. **Not using modular arithmetic correctly:**  
   When computing \(2^n - 2\), if \(2^n \mod M < 2\), the result becomes negative. Always add \(M\) before taking modulo: `(total - 2 + MOD) % MOD`.

3. **Using naive exponentiation:**  
   Computing \(2^n\) directly with `pow(2, n)` or loop multiplication takes \(O(n)\) time, which fails for \(n\) up to \(10^9\). Fast exponentiation is essential.

4. **Misunderstanding the collision condition:**  
   Some candidates try to count collisions directly by considering pairwise interactions. This leads to complex inclusion-exclusion that's both error-prone and inefficient. Complementary counting is the clean approach.

## When You'll See This Pattern

This problem combines **complementary counting** with **fast modular exponentiation**—a pattern common in combinatorial problems with large constraints:

1. **Pow(x, n) (LeetCode 50):**  
   Direct application of fast exponentiation. This problem is essentially "calculate 2^n mod M" with a subtraction.

2. **Count Good Numbers (LeetCode 1922):**  
   Similar combinatorial counting requiring fast exponentiation for large `n`.

3. **Number of Ways to Paint N × 3 Grid (LeetCode 1411):**  
   Combinatorial counting with modular arithmetic and potentially large `n`.

The core technique is: when direct counting is hard, count the complement. When dealing with exponential counts modulo large primes, use fast modular exponentiation.

## Key Takeaways

1. **Complementary counting simplifies complex problems:**  
   Instead of counting "at least one collision" directly (which involves complex inclusion-exclusion), count total possibilities and subtract the easy-to-count "no collision" cases.

2. **Fast exponentiation is essential for large exponents:**  
   Any time you need \(a^b \mod m\) with \(b\) up to \(10^9\), use binary exponentiation (\(O(\log b)\)) not naive multiplication (\(O(b)\)).

3. **Analyze constraints to find hidden simplifications:**  
   The problem's circular symmetry and movement constraints drastically reduce the no-collision cases from potentially many to exactly 2. Always look for such structural insights before coding.

Related problems: [Pow(x, n)](/problem/powx-n)
