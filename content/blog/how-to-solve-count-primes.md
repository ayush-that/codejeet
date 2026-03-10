---
title: "How to Solve Count Primes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Primes. Medium difficulty, 35.8% acceptance rate. Topics: Array, Math, Enumeration, Number Theory."
date: "2026-08-28"
category: "dsa-patterns"
tags: ["count-primes", "array", "math", "enumeration", "medium"]
---

# How to Solve Count Primes

Given an integer `n`, return the number of prime numbers that are strictly less than `n`. This problem is tricky because a naive approach checking every number for primality would be far too slow for typical constraints (n up to 5×10⁶). The interesting part is applying the Sieve of Eratosthenes — an ancient algorithm that efficiently finds all primes up to a given limit.

## Visual Walkthrough

Let's trace through finding primes less than `n = 20` using the Sieve of Eratosthenes:

1. **Initialize**: Create a boolean array `isPrime` of size 20, all initially `True` (except 0 and 1).

   ```
   Index:  0     1     2     3     4     5     6     7     8     9    10    11    12    13    14    15    16    17    18    19
   Value:  F     F     T     T     T     T     T     T     T     T     T     T     T     T     T     T     T     T     T     T
   ```

2. **Start with 2**: 2 is prime. Mark all multiples of 2 as `False`:
   - Mark 4, 6, 8, 10, 12, 14, 16, 18 as non-prime

   ```
   Index:  2     3     4     5     6     7     8     9    10    11    12    13    14    15    16    17    18    19
   Value:  T     T     F     T     F     T     F     T     F     T     F     T     F     T     F     T     F     T
   ```

3. **Move to 3**: 3 is prime. Mark multiples of 3 (starting from 3×3=9):
   - Mark 9, 12, 15, 18 as non-prime (some already marked)

   ```
   Index:  2     3     4     5     6     7     8     9    10    11    12    13    14    15    16    17    18    19
   Value:  T     T     F     T     F     T     F     F     F     T     F     T     F     F     F     T     F     T
   ```

4. **Move to 5**: 5 is prime. Mark multiples starting from 5×5=25, but that's ≥20, so stop.

5. **Count**: Count `True` values: 2, 3, 5, 7, 11, 13, 17, 19 → **8 primes**.

The key insight: we only need to check up to √n because any composite number ≤ n must have a prime factor ≤ √n.

## Brute Force Approach

A naive solution would check each number from 2 to n-1 for primality by testing divisibility:

```python
def is_prime(num):
    if num < 2:
        return False
    for i in range(2, num):  # Could optimize to sqrt(num)
        if num % i == 0:
            return False
    return True

def countPrimes(n):
    count = 0
    for i in range(2, n):
        if is_prime(i):
            count += 1
    return count
```

**Why it's too slow**: This runs in O(n²) time worst-case. For n=5×10⁶, that's ~25 trillion operations — far too many. Even with the sqrt optimization in `is_prime()`, it's still O(n√n), which is about 5×10⁶ × √(5×10⁶) ≈ 3.5×10⁹ operations.

## Optimized Approach

The Sieve of Eratosthenes eliminates the need to check divisibility for each number individually. Instead:

1. Create a boolean array where `isPrime[i] = True` means `i` might be prime
2. Start with `p = 2`, the first prime
3. Mark all multiples of `p` as non-prime
4. Find the next number > `p` that's still marked prime, repeat
5. Stop when `p² > n` (any remaining unmarked numbers are prime)

**Key optimizations**:

- Start marking multiples from `p × p` (smaller multiples were already marked by smaller primes)
- Only check odd numbers after handling 2 separately (halves the work)
- Use `i += p` to jump through multiples efficiently

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log log n) | Space: O(n)
def countPrimes(n):
    """
    Count prime numbers less than n using the Sieve of Eratosthenes.
    """
    if n <= 2:
        return 0

    # Initialize array: True means the number might be prime
    # We'll only track odd numbers to save space/time
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False  # 0 and 1 are not prime

    # Only check up to sqrt(n) - if n is composite, it has a factor ≤ sqrt(n)
    for i in range(2, int(n ** 0.5) + 1):
        if is_prime[i]:
            # Mark multiples of i as non-prime, starting from i*i
            # (smaller multiples like i*2, i*3... were already marked by smaller primes)
            for j in range(i * i, n, i):
                is_prime[j] = False

    # Count remaining True values
    return sum(is_prime)
```

```javascript
// Time: O(n log log n) | Space: O(n)
function countPrimes(n) {
  /**
   * Count prime numbers less than n using the Sieve of Eratosthenes.
   */
  if (n <= 2) return 0;

  // Initialize array: true means the number might be prime
  const isPrime = new Array(n).fill(true);
  isPrime[0] = isPrime[1] = false; // 0 and 1 are not prime

  // Only check up to sqrt(n) - if n is composite, it has a factor ≤ sqrt(n)
  for (let i = 2; i * i < n; i++) {
    if (isPrime[i]) {
      // Mark multiples of i as non-prime, starting from i*i
      // (smaller multiples were already marked by smaller primes)
      for (let j = i * i; j < n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  // Count remaining true values
  return isPrime.filter((val) => val).length;
}
```

```java
// Time: O(n log log n) | Space: O(n)
class Solution {
    public int countPrimes(int n) {
        /**
         * Count prime numbers less than n using the Sieve of Eratosthenes.
         */
        if (n <= 2) return 0;

        // Initialize array: true means the number might be prime
        boolean[] isPrime = new boolean[n];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;  // 0 and 1 are not prime

        // Only check up to sqrt(n) - if n is composite, it has a factor ≤ sqrt(n)
        for (int i = 2; i * i < n; i++) {
            if (isPrime[i]) {
                // Mark multiples of i as non-prime, starting from i*i
                // (smaller multiples were already marked by smaller primes)
                for (int j = i * i; j < n; j += i) {
                    isPrime[j] = false;
                }
            }
        }

        // Count remaining true values
        int count = 0;
        for (boolean prime : isPrime) {
            if (prime) count++;
        }
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n log log n)

The Sieve of Eratosthenes runs in O(n log log n) time. Here's why:

- For each prime `p`, we mark approximately `n/p` multiples
- The total work is roughly `n × (1/2 + 1/3 + 1/5 + 1/7 + ...)` where the sum is over primes ≤ n
- This sum of reciprocals of primes grows as log log n
- Thus total time is O(n log log n)

**Space Complexity**: O(n)

We need a boolean array of size `n` to track prime status. Some optimizations can reduce this to O(n/2) by only tracking odd numbers, but it's still linear space.

## Common Mistakes

1. **Including n in the count**: The problem asks for primes _strictly less than_ n. If n itself is prime, don't count it. Always use `< n` not `≤ n`.

2. **Not handling small n cases**: For n = 0, 1, or 2, there are no primes less than n. Handle these edge cases first to avoid array index errors.

3. **Starting the inner loop from i×2 instead of i×i**: This causes redundant work. Multiples like 2×3 were already marked when i=2, so starting from i×i avoids re-marking.

4. **Checking up to n instead of √n**: The outer loop only needs to run while `i×i < n`. If a number has no divisors ≤ √n, it's prime. Checking further is wasted work.

5. **Integer overflow in the loop condition**: In Java/C++, use `i * i < n` not `i < sqrt(n)` to avoid floating-point issues, but watch for overflow with large i. Python handles large integers fine.

## When You'll See This Pattern

The Sieve of Eratosthenes pattern appears whenever you need to:

- Find all primes up to a limit
- Precompute prime factors or divisibility information
- Solve problems involving prime distribution

**Related problems**:

1. **Ugly Number II (Medium)**: Uses a similar "marking multiples" approach but with three pointers for factors 2, 3, and 5.
2. **Perfect Squares (Medium)**: Can be solved with dynamic programming, but the sieve idea appears in precomputing squares.
3. **Prime Palindrome (Medium)**: Requires checking if numbers are prime, where a sieve can precompute primality efficiently.

## Key Takeaways

1. **The Sieve of Eratosthenes is the go-to for prime counting**: When asked about primes up to n, think sieve first. It's dramatically faster than checking each number individually.

2. **Stop at √n in the outer loop**: Any composite number ≤ n must have a prime factor ≤ √n. This optimization is crucial for efficiency.

3. **Start marking from p×p**: In the inner loop, begin at `p×p` since smaller multiples were already handled by smaller primes. This avoids redundant work.

4. **Space-time tradeoff**: The sieve uses O(n) memory to achieve O(n log log n) time. For very large n (beyond 10⁷), memory might be a concern, but for typical constraints it's fine.

Related problems: [Ugly Number](/problem/ugly-number), [Ugly Number II](/problem/ugly-number-ii), [Perfect Squares](/problem/perfect-squares)
