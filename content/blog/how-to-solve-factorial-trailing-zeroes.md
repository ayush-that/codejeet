---
title: "How to Solve Factorial Trailing Zeroes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Factorial Trailing Zeroes. Medium difficulty, 46.2% acceptance rate. Topics: Math."
date: "2027-02-14"
category: "dsa-patterns"
tags: ["factorial-trailing-zeroes", "math", "medium"]
---

# How to Solve Factorial Trailing Zeroes

This problem asks us to count how many trailing zeroes appear in `n!` (n factorial). The challenge is that `n` can be as large as 10⁴, making it impossible to actually compute the factorial value directly due to integer overflow and performance constraints. The key insight is that trailing zeroes come from factors of 10, which are created by pairs of 2 and 5 in the prime factorization. Since there are always more factors of 2 than 5, we only need to count the factors of 5.

## Visual Walkthrough

Let's trace through `n = 25` to build intuition:

`25! = 25 × 24 × 23 × ... × 3 × 2 × 1`

Trailing zeroes come from factors of 10 = 2 × 5. In any factorial, there are always more factors of 2 than 5 (since even numbers appear more frequently than multiples of 5). Therefore, the number of trailing zeroes is determined by the number of factor pairs (2, 5), which equals the count of factors of 5.

For `n = 25`:

- Numbers with at least one factor of 5: 5, 10, 15, 20, 25 → 5 numbers
- But wait! 25 has **two** factors of 5 (25 = 5 × 5)
- So total factors of 5 = 5 (from the first group) + 1 (extra from 25) = 6

Thus, `25!` has 6 trailing zeroes. Let's verify:
`25! = 15,511,210,043,330,985,984,000,000` ← indeed 6 trailing zeroes!

The pattern: We need to count:

1. How many multiples of 5 ≤ n
2. How many multiples of 25 ≤ n (each contributes an extra factor of 5)
3. How many multiples of 125 ≤ n (each contributes yet another factor of 5)
4. And so on...

For `n = 25`:

- ⌊25/5⌋ = 5 multiples of 5
- ⌊25/25⌋ = 1 multiple of 25
- Total = 5 + 1 = 6

## Brute Force Approach

A naive approach would be to:

1. Compute `n!` directly
2. Convert to string
3. Count trailing zeroes by checking characters from the end

<div class="code-group">

```python
# Time: O(n) for factorial computation, but impractical due to overflow
# Space: O(log(n!)) to store the huge factorial value
def trailingZeroes_brute(n: int) -> int:
    # Compute n! - this will overflow for n > 20
    factorial = 1
    for i in range(2, n + 1):
        factorial *= i

    # Count trailing zeroes
    count = 0
    while factorial % 10 == 0:
        count += 1
        factorial //= 10

    return count
```

```javascript
// Time: O(n) for factorial computation, but impractical due to overflow
// Space: O(log(n!)) to store the huge factorial value
function trailingZeroesBrute(n) {
  // Compute n! - this will overflow for n > 20
  let factorial = 1n; // Use BigInt to avoid overflow
  for (let i = 2n; i <= n; i++) {
    factorial *= i;
  }

  // Count trailing zeroes
  let count = 0;
  while (factorial % 10n === 0n) {
    count++;
    factorial /= 10n;
  }

  return count;
}
```

```java
// Time: O(n) for factorial computation, but impractical due to overflow
// Space: O(log(n!)) to store the huge factorial value
import java.math.BigInteger;

public int trailingZeroesBrute(int n) {
    // Compute n! using BigInteger to avoid overflow
    BigInteger factorial = BigInteger.ONE;
    for (int i = 2; i <= n; i++) {
        factorial = factorial.multiply(BigInteger.valueOf(i));
    }

    // Count trailing zeroes
    int count = 0;
    while (factorial.mod(BigInteger.TEN).equals(BigInteger.ZERO)) {
        count++;
        factorial = factorial.divide(BigInteger.TEN);
    }

    return count;
}
```

</div>

**Why this fails:**

1. **Integer overflow**: For `n > 20`, the factorial exceeds 64-bit integer limits. Even with BigInt/BigInteger, the factorial grows astronomically large.
2. **Performance**: Computing and storing huge numbers is extremely inefficient. For `n = 10⁴`, `n!` has ~35,660 digits!
3. **Memory usage**: Storing such large numbers requires significant memory.

## Optimized Approach

The key insight is mathematical: trailing zeroes come from factors of 10, and each 10 requires one factor of 2 and one factor of 5. Since factors of 2 are abundant, we only need to count factors of 5.

But careful! Some numbers contribute multiple factors of 5:

- 5 contributes one factor
- 25 contributes two factors (5 × 5)
- 125 contributes three factors (5 × 5 × 5)
- And so on...

The formula: `count = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ...`

We can compute this efficiently by repeatedly dividing `n` by 5:

1. Start with `count = 0`
2. While `n > 0`:
   - Add `n // 5` to count (how many multiples of current power of 5)
   - Update `n = n // 5` (move to next power of 5)

Example for `n = 125`:

- First iteration: `count += 125 // 5 = 25` (multiples of 5)
- Second: `n = 25`, `count += 25 // 5 = 5` (multiples of 25)
- Third: `n = 5`, `count += 5 // 5 = 1` (multiples of 125)
- Fourth: `n = 1`, `count += 1 // 5 = 0` (stop)
- Total = 25 + 5 + 1 = 31 trailing zeroes

## Optimal Solution

<div class="code-group">

```python
# Time: O(log₅ n) - we divide by 5 each iteration
# Space: O(1) - only using constant extra space
def trailingZeroes(n: int) -> int:
    """
    Count trailing zeroes in n! by counting factors of 5.

    Each trailing zero comes from a factor of 10 = 2 × 5.
    Since there are always more factors of 2 than 5,
    we only need to count factors of 5.

    Some numbers contribute multiple factors of 5:
    - 25 = 5×5 contributes 2 factors
    - 125 = 5×5×5 contributes 3 factors
    - etc.

    So we count: floor(n/5) + floor(n/25) + floor(n/125) + ...
    """
    count = 0

    # Keep dividing n by powers of 5
    while n > 0:
        # Add how many multiples of current power of 5
        n //= 5
        count += n

    return count
```

```javascript
// Time: O(log₅ n) - we divide by 5 each iteration
// Space: O(1) - only using constant extra space
function trailingZeroes(n) {
  /**
   * Count trailing zeroes in n! by counting factors of 5.
   *
   * Each trailing zero comes from a factor of 10 = 2 × 5.
   * Since there are always more factors of 2 than 5,
   * we only need to count factors of 5.
   *
   * Some numbers contribute multiple factors of 5:
   * - 25 = 5×5 contributes 2 factors
   * - 125 = 5×5×5 contributes 3 factors
   * - etc.
   *
   * So we count: floor(n/5) + floor(n/25) + floor(n/125) + ...
   */
  let count = 0;

  // Keep dividing n by powers of 5
  while (n > 0) {
    // Add how many multiples of current power of 5
    n = Math.floor(n / 5);
    count += n;
  }

  return count;
}
```

```java
// Time: O(log₅ n) - we divide by 5 each iteration
// Space: O(1) - only using constant extra space
class Solution {
    public int trailingZeroes(int n) {
        /**
         * Count trailing zeroes in n! by counting factors of 5.
         *
         * Each trailing zero comes from a factor of 10 = 2 × 5.
         * Since there are always more factors of 2 than 5,
         * we only need to count factors of 5.
         *
         * Some numbers contribute multiple factors of 5:
         * - 25 = 5×5 contributes 2 factors
         * - 125 = 5×5×5 contributes 3 factors
         * - etc.
         *
         * So we count: floor(n/5) + floor(n/25) + floor(n/125) + ...
         */
        int count = 0;

        // Keep dividing n by powers of 5
        while (n > 0) {
            // Add how many multiples of current power of 5
            n /= 5;
            count += n;
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log₅ n)**

- Each iteration divides `n` by 5, so we need approximately log₅ n iterations
- For `n = 10⁴`, we need only about 6 iterations (since 5⁶ = 15,625 > 10⁴)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the `count` variable
- No recursion or data structures that grow with input size

## Common Mistakes

1. **Counting both 2s and 5s**: Some candidates try to count both factors of 2 and 5, then take the minimum. While correct mathematically, it's inefficient and unnecessary since factors of 2 are always more abundant.

2. **Only counting multiples of 5**: Forgetting that numbers like 25, 125, etc. contribute multiple factors of 5. This gives wrong answers for `n ≥ 25`.

3. **Using floating-point division**: Using `/` instead of integer division `//` or `Math.floor()` can lead to precision errors for large `n`.

4. **Infinite loop with wrong condition**: Using `while (n >= 5)` instead of `while (n > 0)` misses cases where we need to add `n // 5` when `n < 5` (which would be 0 anyway, but the loop condition matters).

5. **Trying to compute factorial**: As shown in the brute force approach, this leads to overflow and performance issues even for moderately large `n`.

## When You'll See This Pattern

This problem teaches the **mathematical decomposition** pattern, where you solve a seemingly computational problem through mathematical insight rather than brute force computation.

Related problems using similar patterns:

1. **Number of Digit One (Hard)**: Counts how many digit '1's appear in all numbers from 0 to n. Instead of checking each number, it uses mathematical patterns to compute the count directly.

2. **Preimage Size of Factorial Zeroes Function (Hard)**: Given a number of trailing zeroes K, find how many numbers n have exactly K trailing zeroes in n!. Builds directly on the current problem's solution.

3. **Abbreviating the Product of a Range (Hard)**: Requires efficiently computing products of ranges without overflow, often using prime factorization and mathematical properties.

4. **Count Primes (Easy/Medium)**: Uses the Sieve of Eratosthenes to efficiently count primes up to n, another example of mathematical optimization.

## Key Takeaways

1. **Look for mathematical properties**: When a problem involves factorials, powers, or products, there's often a mathematical property that simplifies computation. Trailing zeroes come from factors of 10, which reduces to counting factors of 5.

2. **Consider prime factorization**: Many number theory problems become easier when you think in terms of prime factors. Here, recognizing that 10 = 2 × 5 was key.

3. **Watch for multiple contributions**: Numbers that are powers of a prime (like 25 = 5²) contribute multiple factors. The pattern `floor(n/5) + floor(n/25) + ...` handles this elegantly.

4. **Logarithmic solutions often exist**: When you need to count something in a factorial or large product, there's often a O(log n) solution using division by increasing powers.

Related problems: [Number of Digit One](/problem/number-of-digit-one), [Preimage Size of Factorial Zeroes Function](/problem/preimage-size-of-factorial-zeroes-function), [Abbreviating the Product of a Range](/problem/abbreviating-the-product-of-a-range)
