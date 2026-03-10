---
title: "How to Solve Find the Count of Good Integers — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Count of Good Integers. Hard difficulty, 69.5% acceptance rate. Topics: Hash Table, Math, Combinatorics, Enumeration."
date: "2028-01-07"
category: "dsa-patterns"
tags: ["find-the-count-of-good-integers", "hash-table", "math", "combinatorics", "hard"]
---

# How to Solve Find the Count of Good Integers

This problem asks us to count how many integers with exactly `n` digits can have their digits rearranged to form a palindrome that's divisible by `k`. The challenge comes from combining three constraints: digit permutations, palindrome formation, and divisibility by `k`. A brute force approach would need to check all 10^n possible n-digit numbers, which is impossible for n up to 10^5. The key insight is that we only need to consider unique digit multisets, not every individual number.

## Visual Walkthrough

Let's trace through a small example: `n = 3, k = 2`

We need to count 3-digit numbers whose digits can be rearranged into a palindrome divisible by 2.

**Step 1: Understanding palindrome structure**
For a 3-digit palindrome, the pattern is `ABA` where A and B are digits. The first and last digits must be the same.

**Step 2: Divisibility by 2**
A number is divisible by 2 if its last digit is even. So in our palindrome `ABA`, the last digit A must be even (0, 2, 4, 6, 8).

**Step 3: Generating valid digit multisets**
Let's list some valid digit combinations:

- Digits {0, 0, 0} → forms 000 (divisible by 2, but 000 isn't a valid 3-digit number)
- Digits {1, 1, 2} → can form 121 or 212 (both divisible by 2? 121 ends with 1 → not divisible by 2, 212 ends with 2 → divisible by 2)
- Digits {2, 2, 2} → forms 222 (divisible by 2)
- Digits {0, 1, 1} → forms 101 or 110 (101 ends with 1 → not divisible by 2)

**Step 4: Counting permutations**
For digits {1, 1, 2}:

- Total permutations of 112: 3!/(2!) = 3 permutations
- But only arrangements ending with 2 are valid: 112 (ends with 2), 121 (ends with 1), 211 (ends with 1) → only 112 works
- However, 112 isn't a palindrome! We need to check if it CAN be rearranged into a palindrome divisible by 2, not that every arrangement is valid.

**Step 5: The real check**
For {1, 1, 2}:

- Can we form a palindrome? Yes, because we have two 1's (even count) and one 2 (odd count) → can form 121 or 212
- Is either palindrome divisible by 2? 121 ends with 1 (no), 212 ends with 2 (yes)
- So {1, 1, 2} is valid!

This shows the complexity: we need to check digit multisets, not individual numbers.

## Brute Force Approach

A naive approach would:

1. Generate all n-digit numbers (10^(n-1) to 10^n - 1)
2. For each number, check all permutations of its digits
3. For each permutation, check if it forms a palindrome and is divisible by k

This is catastrophically slow:

- For n=5, there are 90,000 numbers
- Each has up to 120 permutations
- That's 10.8 million checks already
- For n=10, it's 9 billion numbers × millions of permutations

Even checking just the digit multisets directly (without permutations) would still be too slow for large n, as there are C(n+9, 9) possible multisets (stars and bars formula), which grows rapidly.

## Optimized Approach

The key insight is that we don't need to check every number or even every permutation. We only need to consider:

1. **Which digit multisets can form palindromes?** A multiset can form a palindrome if at most one digit has odd frequency.
2. **Which palindromes are divisible by k?** We need to check if the palindrome number (not just the digits) is divisible by k.
3. **How many numbers correspond to each valid multiset?** We need to count distinct n-digit numbers (no leading zeros) with that digit multiset.

**Step-by-step reasoning:**

1. **Generate digit frequency distributions**: Instead of numbers, work with frequency arrays [f0, f1, ..., f9] where sum(fi) = n.
2. **Check palindrome feasibility**: Count how many digits have odd frequency. If more than 1, skip.
3. **Construct the actual palindrome**: Arrange half the digits (floor(n/2) digits) in any order, then mirror them. For odd n, place the odd-count digit in the middle.
4. **Check divisibility by k**: Convert the palindrome to a number (mod k) to check divisibility.
5. **Count valid numbers for this multiset**: Use combinatorics: (n-1)! / (f0! × f1! × ... × f9!) × (n - f0) / n for numbers without leading zeros.

But there's still a problem: iterating over all frequency distributions is O(n^9) which is too slow for n up to 10^5.

**The breakthrough**: We don't need to check all distributions! We only need to check distributions where the constructed palindrome is divisible by k. We can:

- Generate the first half of the palindrome (length m = floor(n/2))
- For each half, compute the full palindrome value mod k
- If it's 0 mod k, count how many digit multisets correspond to this half

## Optimal Solution

We use dynamic programming with digit DP and combinatorics:

1. Let `m = n // 2` (length of half-palindrome)
2. Use DP to count ways to build the first half with certain digit frequencies
3. For each valid half, construct the full palindrome and check divisibility by k
4. Use combinatorics to count total numbers from this digit multiset

<div class="code-group">

```python
# Time: O(10 * n * k) | Space: O(n * k)
from math import comb
from functools import lru_cache

def countGoodIntegers(n: int, k: int) -> int:
    # Factorials and inverse factorials for combinatorics
    MOD = 10**9 + 7
    fact = [1] * (n + 1)
    inv_fact = [1] * (n + 1)

    for i in range(2, n + 1):
        fact[i] = fact[i-1] * i % MOD

    # Fermat's little theorem for modular inverse
    inv_fact[n] = pow(fact[n], MOD-2, MOD)
    for i in range(n-1, -1, -1):
        inv_fact[i] = inv_fact[i+1] * (i+1) % MOD

    def nCr(nn, rr):
        if rr < 0 or rr > nn:
            return 0
        return fact[nn] * inv_fact[rr] % MOD * inv_fact[nn-rr] % MOD

    m = n // 2
    is_odd = n % 2 == 1

    # DP state: (position, remainder mod k, mask of used digits)
    # But we need to track digit frequencies, so we use a different approach

    from collections import defaultdict

    # Count frequency distributions for first half
    def generate_halves(length, start_digit=0, freq=None):
        if freq is None:
            freq = [0] * 10

        if length == 0:
            yield freq.copy()
            return

        for digit in range(start_digit, 10):
            for count in range(1, length + 1):
                freq[digit] += count
                yield from generate_halves(length - count, digit + 1, freq)
                freq[digit] -= count
            # Also consider not using this digit at all
            yield from generate_halves(length, digit + 1, freq)
            break

    total = 0
    memo = {}

    # Iterate over possible halves
    for half_freq in generate_halves(m):
        # Check if we can form a palindrome
        # For odd n, we need one digit with odd count for the middle
        # For even n, all counts must be even

        # Create full frequency array
        full_freq = [0] * 10
        for d in range(10):
            full_freq[d] = half_freq[d] * 2

        if is_odd:
            # Need to choose a middle digit
            for mid_digit in range(10):
                freq = full_freq.copy()
                freq[mid_digit] += 1

                # Check palindrome condition
                odd_count = sum(1 for f in freq if f % 2 == 1)
                if odd_count > 1:
                    continue

                # Check divisibility
                # Build the actual palindrome number
                # First half digits (sorted)
                half_digits = []
                for d in range(10):
                    half_digits.extend([d] * half_freq[d])

                # Construct palindrome
                if is_odd:
                    palindrome = half_digits + [mid_digit] + half_digits[::-1]
                else:
                    palindrome = half_digits + half_digits[::-1]

                # Check divisibility
                num = 0
                for digit in palindrome:
                    num = (num * 10 + digit) % k
                if num != 0:
                    continue

                # Count numbers with these digits (no leading zero)
                # Total permutations: n! / (f0! * f1! * ... * f9!)
                ways = fact[n]
                for f in freq:
                    ways = ways * inv_fact[f] % MOD

                # Subtract numbers with leading zero
                if freq[0] > 0:
                    # Fix 0 at first position
                    invalid = fact[n-1]
                    invalid = invalid * inv_fact[freq[0]-1] % MOD
                    for d in range(1, 10):
                        invalid = invalid * inv_fact[freq[d]] % MOD
                    ways = (ways - invalid) % MOD

                total = (total + ways) % MOD

        else:
            # Even length - all frequencies must be even
            if any(f % 2 == 1 for f in full_freq):
                continue

            # Build palindrome
            half_digits = []
            for d in range(10):
                half_digits.extend([d] * half_freq[d])

            palindrome = half_digits + half_digits[::-1]

            # Check divisibility
            num = 0
            for digit in palindrome:
                num = (num * 10 + digit) % k
            if num != 0:
                continue

            # Count numbers
            ways = fact[n]
            for f in full_freq:
                ways = ways * inv_fact[f] % MOD

            # Subtract leading zeros
            if full_freq[0] > 0:
                invalid = fact[n-1]
                invalid = invalid * inv_fact[full_freq[0]-1] % MOD
                for d in range(1, 10):
                    invalid = invalid * inv_fact[full_freq[d]] % MOD
                ways = (ways - invalid) % MOD

            total = (total + ways) % MOD

    return total
```

```javascript
// Time: O(10 * n * k) | Space: O(n * k)
function countGoodIntegers(n, k) {
  const MOD = 1e9 + 7;

  // Precompute factorials and inverse factorials
  const fact = new Array(n + 1).fill(1);
  const invFact = new Array(n + 1).fill(1);

  for (let i = 2; i <= n; i++) {
    fact[i] = (fact[i - 1] * i) % MOD;
  }

  // Modular inverse using Fermat's little theorem
  invFact[n] = modPow(fact[n], MOD - 2, MOD);
  for (let i = n - 1; i >= 0; i--) {
    invFact[i] = (invFact[i + 1] * (i + 1)) % MOD;
  }

  function modPow(a, b, mod) {
    let result = 1;
    a %= mod;
    while (b > 0) {
      if (b & 1) result = (result * a) % mod;
      a = (a * a) % mod;
      b >>= 1;
    }
    return result;
  }

  const m = Math.floor(n / 2);
  const isOdd = n % 2 === 1;
  let total = 0;

  // Generate all possible halves recursively
  function* generateHalves(length, startDigit = 0, freq = new Array(10).fill(0)) {
    if (length === 0) {
      yield [...freq];
      return;
    }

    for (let digit = startDigit; digit < 10; digit++) {
      for (let count = 1; count <= length; count++) {
        freq[digit] += count;
        yield* generateHalves(length - count, digit + 1, freq);
        freq[digit] -= count;
      }
      // Skip this digit entirely
      yield* generateHalves(length, digit + 1, freq);
      break;
    }
  }

  // Process each half
  for (const halfFreq of generateHalves(m)) {
    if (isOdd) {
      // Need middle digit for odd length
      for (let midDigit = 0; midDigit < 10; midDigit++) {
        const freq = new Array(10).fill(0);
        for (let d = 0; d < 10; d++) {
          freq[d] = halfFreq[d] * 2;
        }
        freq[midDigit]++;

        // Check palindrome condition
        let oddCount = 0;
        for (const f of freq) {
          if (f % 2 === 1) oddCount++;
        }
        if (oddCount > 1) continue;

        // Build palindrome digits
        const halfDigits = [];
        for (let d = 0; d < 10; d++) {
          for (let i = 0; i < halfFreq[d]; i++) {
            halfDigits.push(d);
          }
        }

        const palindrome = [...halfDigits, midDigit, ...halfDigits.reverse()];

        // Check divisibility
        let num = 0;
        for (const digit of palindrome) {
          num = (num * 10 + digit) % k;
        }
        if (num !== 0) continue;

        // Count valid numbers
        let ways = fact[n];
        for (const f of freq) {
          ways = (ways * invFact[f]) % MOD;
        }

        // Subtract numbers with leading zero
        if (freq[0] > 0) {
          let invalid = fact[n - 1];
          invalid = (invalid * invFact[freq[0] - 1]) % MOD;
          for (let d = 1; d < 10; d++) {
            invalid = (invalid * invFact[freq[d]]) % MOD;
          }
          ways = (ways - invalid + MOD) % MOD;
        }

        total = (total + ways) % MOD;
      }
    } else {
      // Even length
      const freq = new Array(10).fill(0);
      for (let d = 0; d < 10; d++) {
        freq[d] = halfFreq[d] * 2;
      }

      // Check all frequencies are even
      if (freq.some((f) => f % 2 === 1)) continue;

      // Build palindrome
      const halfDigits = [];
      for (let d = 0; d < 10; d++) {
        for (let i = 0; i < halfFreq[d]; i++) {
          halfDigits.push(d);
        }
      }

      const palindrome = [...halfDigits, ...halfDigits.reverse()];

      // Check divisibility
      let num = 0;
      for (const digit of palindrome) {
        num = (num * 10 + digit) % k;
      }
      if (num !== 0) continue;

      // Count valid numbers
      let ways = fact[n];
      for (const f of freq) {
        ways = (ways * invFact[f]) % MOD;
      }

      // Subtract leading zeros
      if (freq[0] > 0) {
        let invalid = fact[n - 1];
        invalid = (invalid * invFact[freq[0] - 1]) % MOD;
        for (let d = 1; d < 10; d++) {
          invalid = (invalid * invFact[freq[d]]) % MOD;
        }
        ways = (ways - invalid + MOD) % MOD;
      }

      total = (total + ways) % MOD;
    }
  }

  return total;
}
```

```java
// Time: O(10 * n * k) | Space: O(n * k)
import java.util.*;

class Solution {
    private static final int MOD = 1_000_000_007;

    public int countGoodIntegers(int n, int k) {
        // Precompute factorials and inverse factorials
        long[] fact = new long[n + 1];
        long[] invFact = new long[n + 1];
        fact[0] = 1;
        for (int i = 1; i <= n; i++) {
            fact[i] = fact[i-1] * i % MOD;
        }

        invFact[n] = modPow(fact[n], MOD - 2);
        for (int i = n-1; i >= 0; i--) {
            invFact[i] = invFact[i+1] * (i+1) % MOD;
        }

        int m = n / 2;
        boolean isOdd = n % 2 == 1;
        long total = 0;

        // Generate all possible halves
        List<int[]> halves = new ArrayList<>();
        generateHalves(m, 0, new int[10], halves);

        for (int[] halfFreq : halves) {
            if (isOdd) {
                // Try each possible middle digit
                for (int midDigit = 0; midDigit < 10; midDigit++) {
                    int[] freq = new int[10];
                    for (int d = 0; d < 10; d++) {
                        freq[d] = halfFreq[d] * 2;
                    }
                    freq[midDigit]++;

                    // Check palindrome condition
                    int oddCount = 0;
                    for (int f : freq) {
                        if (f % 2 == 1) oddCount++;
                    }
                    if (oddCount > 1) continue;

                    // Build palindrome
                    List<Integer> halfDigits = new ArrayList<>();
                    for (int d = 0; d < 10; d++) {
                        for (int i = 0; i < halfFreq[d]; i++) {
                            halfDigits.add(d);
                        }
                    }

                    List<Integer> palindrome = new ArrayList<>(halfDigits);
                    palindrome.add(midDigit);
                    Collections.reverse(halfDigits);
                    palindrome.addAll(halfDigits);

                    // Check divisibility
                    long num = 0;
                    for (int digit : palindrome) {
                        num = (num * 10 + digit) % k;
                    }
                    if (num != 0) continue;

                    // Count valid numbers
                    long ways = fact[n];
                    for (int f : freq) {
                        ways = ways * invFact[f] % MOD;
                    }

                    // Subtract numbers with leading zero
                    if (freq[0] > 0) {
                        long invalid = fact[n-1];
                        invalid = invalid * invFact[freq[0]-1] % MOD;
                        for (int d = 1; d < 10; d++) {
                            invalid = invalid * invFact[freq[d]] % MOD;
                        }
                        ways = (ways - invalid + MOD) % MOD;
                    }

                    total = (total + ways) % MOD;
                }
            } else {
                // Even length
                int[] freq = new int[10];
                for (int d = 0; d < 10; d++) {
                    freq[d] = halfFreq[d] * 2;
                }

                // Check all frequencies are even
                boolean allEven = true;
                for (int f : freq) {
                    if (f % 2 == 1) {
                        allEven = false;
                        break;
                    }
                }
                if (!allEven) continue;

                // Build palindrome
                List<Integer> halfDigits = new ArrayList<>();
                for (int d = 0; d < 10; d++) {
                    for (int i = 0; i < halfFreq[d]; i++) {
                        halfDigits.add(d);
                    }
                }

                List<Integer> palindrome = new ArrayList<>(halfDigits);
                Collections.reverse(halfDigits);
                palindrome.addAll(halfDigits);

                // Check divisibility
                long num = 0;
                for (int digit : palindrome) {
                    num = (num * 10 + digit) % k;
                }
                if (num != 0) continue;

                // Count valid numbers
                long ways = fact[n];
                for (int f : freq) {
                    ways = ways * invFact[f] % MOD;
                }

                // Subtract leading zeros
                if (freq[0] > 0) {
                    long invalid = fact[n-1];
                    invalid = invalid * invFact[freq[0]-1] % MOD;
                    for (int d = 1; d < 10; d++) {
                        invalid = invalid * invFact[freq[d]] % MOD;
                    }
                    ways = (ways - invalid + MOD) % MOD;
                }

                total = (total + ways) % MOD;
            }
        }

        return (int) total;
    }

    private void generateHalves(int length, int startDigit, int[] freq, List<int[]> result) {
        if (length == 0) {
            result.add(freq.clone());
            return;
        }

        for (int digit = startDigit; digit < 10; digit++) {
            for (int count = 1; count <= length; count++) {
                freq[digit] += count;
                generateHalves(length - count, digit + 1, freq, result);
                freq[digit] -= count;
            }
            // Skip this digit
            generateHalves(length, digit + 1, freq, result);
            break;
        }
    }

    private long modPow(long a, long b) {
        long result = 1;
        a %= MOD;
        while (b > 0) {
            if ((b & 1) == 1) result = result * a % MOD;
            a = a * a % MOD;
            b >>= 1;
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(10 _ n _ k) in theory, but practically much less due to constraints

- We generate combinations of digits for the first half (m = n/2 digits)
- The number of combinations is the number of ways to distribute m items into 10 bins: C(m+9, 9)
- For each combination, we check divisibility (O(n) time)
- For n ≤ 10^5, C(n/2+9, 9) can be large, but many combinations are pruned early

**Space Complexity:** O(n + k)

- We store factorials up to n: O(n)
- The recursion depth for generating halves: O(10)
- Temporary arrays for digit frequencies: O(10)

## Common Mistakes

1. **Checking every permutation**: Attempting to generate all permutations of digits for each number. Even for n=10, 10! = 3.6 million permutations per number is impossible.

2. **Forgetting the leading zero constraint**: Counting numbers like "0123" as valid 4-digit numbers. We must ensure the first digit isn't 0.

3. **Incorrect palindrome check**: Only checking if the original number is a palindrome, not if it CAN BE REARRANGED into a palindrome. The digits {1,2,1} can form palindrome 121, but {1,2,3} cannot form any palindrome.

4. **Missing the divisibility check on the palindrome**: Checking if the original number is divisible by k instead of checking if the rearranged palindrome is divisible by k.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Digit DP with constraints**: Similar to problems like "Numbers At Most N Given Digit Set" where we need to count numbers satisfying digit-based constraints.

2. **Palindrome construction from multisets**: Related to "Palindrome Permutation" which checks if a string can be rearranged into a palindrome.

3. **Combinatorial counting with restrictions**: Like "Count Numbers with Unique Digits" where we count valid numbers using combinatorics.

4. **Modular arithmetic with large numbers**: Common in problems like "Super Pow" where we need to compute remainders efficiently.

## Key Takeaways

1. **Work with digit frequencies, not individual numbers**: When dealing with digit permutations, it's more efficient to work with multisets of digits rather than enumerating all numbers.

2. **Palindrome condition is about digit parity**: A set of digits can form a palindrome if and only if at most one digit has odd frequency.

3. **Combine constraints incrementally**: Break the problem into subproblems: (1) which digit multisets can form palindromes, (2) which of those palindromes are divisible by k, (3) how many numbers have each valid multiset.

4. **Use combinatorics for counting permutations**: Instead of generating permutations, use factorial-based formulas to count how many numbers correspond to a given digit multiset.

Related problems: [Palindrome Number](/problem/palindrome-number), [Find the Closest Palindrome](/problem/find-the-closest-palindrome)
