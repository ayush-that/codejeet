---
title: "How to Solve Prime Arrangements — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Prime Arrangements. Easy difficulty, 60.8% acceptance rate. Topics: Math."
date: "2028-10-20"
category: "dsa-patterns"
tags: ["prime-arrangements", "math", "easy"]
---

# How to Solve Prime Arrangements

This problem asks: given an integer `n`, how many permutations of the numbers 1 through `n` exist where all prime numbers occupy prime-numbered positions (using 1-based indexing)? The challenge lies in combining combinatorial counting with prime number identification, while handling potentially large results modulo 10⁹+7.

**What makes this interesting:** It's a combinatorics problem disguised as an array permutation problem. You don't actually generate permutations—you count them mathematically. The key insight is that primes and non-primes form two independent groups that can be arranged separately.

## Visual Walkthrough

Let's trace through `n = 5` step by step:

1. **Identify primes up to n = 5**: 2, 3, 5 (3 primes total)
2. **Identify prime indices (1-based)**: Position 1 is NOT prime (1 is not prime), position 2 IS prime, position 3 IS prime, position 4 is NOT prime, position 5 IS prime. So we have prime indices at positions 2, 3, 5 (3 prime indices total).
3. **Key observation**: We have exactly 3 primes and 3 prime indices. This means:
   - All prime numbers MUST go into the 3 prime-indexed positions
   - All non-prime numbers (1 and 4) MUST go into the 2 non-prime-indexed positions
4. **Counting arrangements**:
   - Primes can be arranged among prime positions in `3! = 6` ways
   - Non-primes can be arranged among non-prime positions in `2! = 2` ways
   - These arrangements are independent, so total permutations = `3! × 2! = 6 × 2 = 12`

For `n = 4`:

- Primes up to 4: 2, 3 (2 primes)
- Prime indices: positions 2 and 3 (2 prime indices)
- Non-primes: 1, 4 (2 non-primes)
- Non-prime indices: positions 1 and 4 (2 non-prime indices)
- Total arrangements = `2! × 2! = 2 × 2 = 4`

The pattern emerges: count primes (p), count non-primes (n-p), then compute `p! × (n-p)! mod (10⁹+7)`.

## Brute Force Approach

A naive approach would generate all permutations of 1..n, check each one to see if primes are in prime positions, and count valid ones. This is implemented below:

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW FOR LARGE N
# Time: O(n! × n) | Space: O(n)
def numPrimeArrangements_brute(n: int) -> int:
    from itertools import permutations
    import math

    def is_prime(x):
        if x < 2:
            return False
        for i in range(2, int(math.sqrt(x)) + 1):
            if x % i == 0:
                return False
        return True

    # Generate all permutations - this grows factorially!
    nums = list(range(1, n + 1))
    count = 0

    for perm in permutations(nums):
        valid = True
        for i, num in enumerate(perm):
            # Convert to 1-based index
            idx = i + 1
            # Check if prime number is in prime position
            if is_prime(num) != is_prime(idx):
                valid = False
                break
        if valid:
            count += 1

    return count % (10**9 + 7)
```

```javascript
// BRUTE FORCE - TOO SLOW FOR LARGE N
// Time: O(n! × n) | Space: O(n)
function numPrimeArrangementsBrute(n) {
  function isPrime(x) {
    if (x < 2) return false;
    for (let i = 2; i * i <= x; i++) {
      if (x % i === 0) return false;
    }
    return true;
  }

  // Helper to generate permutations
  function* generatePermutations(arr) {
    if (arr.length === 1) {
      yield arr;
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      for (const perm of generatePermutations(rest)) {
        yield [arr[i], ...perm];
      }
    }
  }

  const nums = Array.from({ length: n }, (_, i) => i + 1);
  let count = 0;

  for (const perm of generatePermutations(nums)) {
    let valid = true;
    for (let i = 0; i < n; i++) {
      const idx = i + 1; // 1-based index
      if (isPrime(perm[i]) !== isPrime(idx)) {
        valid = false;
        break;
      }
    }
    if (valid) count++;
  }

  return count % 1000000007;
}
```

```java
// BRUTE FORCE - TOO SLOW FOR LARGE N
// Time: O(n! × n) | Space: O(n)
import java.util.*;

public class Solution {
    public int numPrimeArrangementsBrute(int n) {
        // Generate all permutations - factorial growth!
        List<List<Integer>> permutations = new ArrayList<>();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = i + 1;
        generatePermutations(nums, 0, permutations);

        int count = 0;
        for (List<Integer> perm : permutations) {
            boolean valid = true;
            for (int i = 0; i < n; i++) {
                int idx = i + 1; // 1-based index
                if (isPrime(perm.get(i)) != isPrime(idx)) {
                    valid = false;
                    break;
                }
            }
            if (valid) count++;
        }

        return count % 1_000_000_007;
    }

    private boolean isPrime(int x) {
        if (x < 2) return false;
        for (int i = 2; i * i <= x; i++) {
            if (x % i == 0) return false;
        }
        return true;
    }

    private void generatePermutations(int[] nums, int start, List<List<Integer>> result) {
        if (start == nums.length) {
            List<Integer> perm = new ArrayList<>();
            for (int num : nums) perm.add(num);
            result.add(perm);
            return;
        }

        for (int i = start; i < nums.length; i++) {
            swap(nums, start, i);
            generatePermutations(nums, start + 1, result);
            swap(nums, start, i);
        }
    }

    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

</div>

**Why brute force fails:** For n=100, there are 100! permutations (~9.3×10¹⁵⁷), which is astronomically large. Even for n=20, 20! ≈ 2.4×10¹⁸ is far too many permutations to generate. We need a mathematical approach.

## Optimal Solution

The optimal solution uses combinatorics: count primes (p), then the answer is `p! × (n-p)!`. We compute factorials modulo 10⁹+7 to handle large numbers.

<div class="code-group">

```python
# Optimal Solution: Combinatorial Counting
# Time: O(n√n) for prime counting, or O(n log log n) with sieve | Space: O(1)
def numPrimeArrangements(n: int) -> int:
    MOD = 10**9 + 7

    # Step 1: Count prime numbers up to n
    def count_primes(n):
        if n < 2:
            return 0

        # Sieve of Eratosthenes - more efficient for larger n
        is_prime = [True] * (n + 1)
        is_prime[0] = is_prime[1] = False

        for i in range(2, int(n**0.5) + 1):
            if is_prime[i]:
                # Mark multiples of i as non-prime
                for j in range(i * i, n + 1, i):
                    is_prime[j] = False

        # Count primes
        return sum(is_prime)

    # Step 2: Count primes and non-primes
    prime_count = count_primes(n)
    non_prime_count = n - prime_count

    # Step 3: Compute factorial(product) modulo MOD
    def factorial_mod(x):
        result = 1
        for i in range(2, x + 1):
            result = (result * i) % MOD
        return result

    # Step 4: Result is (prime_count! × non_prime_count!) % MOD
    prime_factorial = factorial_mod(prime_count)
    non_prime_factorial = factorial_mod(non_prime_count)

    return (prime_factorial * non_prime_factorial) % MOD
```

```javascript
// Optimal Solution: Combinatorial Counting
// Time: O(n√n) for prime counting, or O(n log log n) with sieve | Space: O(1)
function numPrimeArrangements(n) {
  const MOD = 1000000007;

  // Step 1: Count prime numbers up to n using sieve
  function countPrimes(n) {
    if (n < 2) return 0;

    const isPrime = new Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;

    // Sieve of Eratosthenes
    for (let i = 2; i * i <= n; i++) {
      if (isPrime[i]) {
        // Mark multiples of i as non-prime
        for (let j = i * i; j <= n; j += i) {
          isPrime[j] = false;
        }
      }
    }

    // Count primes
    return isPrime.filter((val) => val).length;
  }

  // Step 2: Count primes and non-primes
  const primeCount = countPrimes(n);
  const nonPrimeCount = n - primeCount;

  // Step 3: Compute factorial modulo MOD
  function factorialMod(x) {
    let result = 1;
    for (let i = 2; i <= x; i++) {
      result = (result * i) % MOD;
    }
    return result;
  }

  // Step 4: Result is (primeCount! × nonPrimeCount!) % MOD
  const primeFactorial = factorialMod(primeCount);
  const nonPrimeFactorial = factorialMod(nonPrimeCount);

  return (primeFactorial * nonPrimeFactorial) % MOD;
}
```

```java
// Optimal Solution: Combinatorial Counting
// Time: O(n√n) for prime counting, or O(n log log n) with sieve | Space: O(n) for sieve array
class Solution {
    private static final int MOD = 1_000_000_007;

    public int numPrimeArrangements(int n) {
        // Step 1: Count prime numbers up to n
        int primeCount = countPrimes(n);
        int nonPrimeCount = n - primeCount;

        // Step 2: Compute factorials modulo MOD
        long primeFactorial = factorialMod(primeCount);
        long nonPrimeFactorial = factorialMod(nonPrimeCount);

        // Step 3: Result is (primeCount! × nonPrimeCount!) % MOD
        return (int)((primeFactorial * nonPrimeFactorial) % MOD);
    }

    private int countPrimes(int n) {
        if (n < 2) return 0;

        boolean[] isPrime = new boolean[n + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;

        // Sieve of Eratosthenes
        for (int i = 2; i * i <= n; i++) {
            if (isPrime[i]) {
                // Mark multiples of i as non-prime
                for (int j = i * i; j <= n; j += i) {
                    isPrime[j] = false;
                }
            }
        }

        // Count primes
        int count = 0;
        for (int i = 2; i <= n; i++) {
            if (isPrime[i]) count++;
        }
        return count;
    }

    private long factorialMod(int x) {
        long result = 1;
        for (int i = 2; i <= x; i++) {
            result = (result * i) % MOD;
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Prime counting using Sieve of Eratosthenes: O(n log log n)
- Factorial computation: O(n) for each factorial, but we only compute two factorials up to n
- **Overall: O(n log log n)** with sieve, or O(n√n) with simple prime checking

**Space Complexity:**

- Sieve implementation: O(n) for the boolean array
- Could be optimized to O(√n) with more complex prime counting, but O(n) is acceptable for n ≤ 100
- **Overall: O(n)** with sieve, O(1) with simple prime checking

## Common Mistakes

1. **Generating actual permutations**: As shown in brute force, this is computationally impossible for n > 10. Remember: when a problem asks for "number of permutations," it's often a combinatorics problem, not a backtracking problem.

2. **Forgetting 1-based indexing**: The problem specifies "prime indices (1-indexed)." If you use 0-based indexing for prime position checking, you'll get wrong results. Position 1 is not prime, position 2 is prime, etc.

3. **Not using modulo arithmetic for large n**: For n=100, 100! is enormous (≈9.3×10¹⁵⁷). You must compute factorials modulo 10⁹+7 at each multiplication step, not just at the end.

4. **Incorrect prime counting**: Remember 1 is not prime! A common error is to include 1 in prime count. Also, the sieve should start marking multiples from i×i, not 2×i, to avoid redundant work.

5. **Integer overflow in intermediate calculations**: Even with modulo, if you multiply two large numbers before taking modulo, you might overflow 32-bit integers. Use 64-bit integers (long in Java, normal ints are fine in Python).

## When You'll See This Pattern

This problem combines two important patterns:

1. **Combinatorial counting with independent groups**: Similar to:
   - [LeetCode 62. Unique Paths](https://leetcode.com/problems/unique-paths/) - Counting paths using combinations
   - [LeetCode 96. Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees/) - Catalan numbers, counting tree structures
   - Problems where you count arrangements of items into slots with constraints

2. **Prime number problems with sieve**: Similar to:
   - [LeetCode 204. Count Primes](https://leetcode.com/problems/count-primes/) - Direct application of sieve
   - [LeetCode 1175. Prime Arrangements](https://leetcode.com/problems/prime-arrangements/) - This very problem!
   - Problems requiring efficient prime checking up to a limit

## Key Takeaways

1. **Combinatorial thinking over brute force**: When a problem asks for "number of ways" or "number of permutations," consider if there's a mathematical formula instead of generating all possibilities.

2. **Independent event principle in counting**: If arrangements can be broken into independent groups (primes in prime slots, non-primes in non-prime slots), multiply the counts for each group.

3. **Sieve of Eratosthenes for prime counting**: When you need to count or check primes up to n, the sieve gives O(n log log n) time, much better than O(n√n) for individual checks.

4. **Modulo arithmetic for large counts**: Always apply modulo at each multiplication step when dealing with factorials or combinatorial counts that can overflow.

[Practice this problem on CodeJeet](/problem/prime-arrangements)
