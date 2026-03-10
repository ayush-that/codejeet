---
title: "How to Solve Closest Prime Numbers in Range — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Closest Prime Numbers in Range. Medium difficulty, 51.7% acceptance rate. Topics: Math, Number Theory."
date: "2026-02-27"
category: "dsa-patterns"
tags: ["closest-prime-numbers-in-range", "math", "number-theory", "medium"]
---

# How to Solve Closest Prime Numbers in Range

We need to find the closest pair of prime numbers within a given range `[left, right]`. The challenge lies in efficiently identifying prime numbers and tracking the minimum gap between consecutive primes. This problem tests your understanding of prime number generation and efficient range scanning.

## Visual Walkthrough

Let's trace through an example: `left = 10`, `right = 19`.

**Step 1: Identify all primes in the range**

- Check 10: Not prime (divisible by 2)
- Check 11: Prime (no divisors other than 1 and 11)
- Check 12: Not prime
- Check 13: Prime
- Check 14: Not prime
- Check 15: Not prime
- Check 16: Not prime
- Check 17: Prime
- Check 18: Not prime
- Check 19: Prime

Primes in range: `[11, 13, 17, 19]`

**Step 2: Find consecutive prime pairs and their differences**

- Pair (11, 13): Difference = 2
- Pair (13, 17): Difference = 4
- Pair (17, 19): Difference = 2

**Step 3: Find the minimum difference**
Both (11, 13) and (17, 19) have difference 2. Since we need the first pair with minimum difference, we return `[11, 13]`.

This example shows we need to: 1) efficiently check primality, 2) track consecutive primes, and 3) find the minimum gap.

## Brute Force Approach

A naive approach would:

1. For each number in `[left, right]`, check if it's prime using trial division
2. Store all primes in a list
3. Compare every possible pair of primes to find the minimum difference

The primality check for a number `n` using trial division takes O(√n) time. For a range of size `m = right - left + 1`, this gives O(m√right) time complexity. If we then compare all pairs of primes, we add O(p²) where p is the number of primes found.

This becomes inefficient for large ranges (like `left = 1`, `right = 10^6`). The key insight is we don't need to compare all pairs - only consecutive primes matter since primes are sorted by definition, and the minimum difference will always be between consecutive primes.

## Optimized Approach

The optimal solution combines:

1. **Sieve of Eratosthenes** to efficiently find all primes up to `right`
2. **Single pass through primes** to find consecutive pairs with minimum difference

**Key insights:**

- We only need primes up to `right`, not all numbers in the range
- The minimum difference will always be between consecutive primes (if we have primes `[p1, p2, p3]`, then `p3 - p1 = (p3 - p2) + (p2 - p1)`, which is always ≥ `min(p3-p2, p2-p1)`)
- We can generate all primes once and filter for those in `[left, right]`

**Step-by-step reasoning:**

1. Use Sieve of Eratosthenes to mark all non-prime numbers up to `right`
2. Collect all primes in `[left, right]`
3. Iterate through the collected primes, tracking consecutive pairs
4. Keep track of the minimum difference found and the corresponding pair
5. Return the first pair with minimum difference (or `[-1, -1]` if fewer than 2 primes found)

## Optimal Solution

<div class="code-group">

```python
# Time: O(right * log log right) for sieve + O(right - left) for scanning
# Space: O(right) for the sieve array
class Solution:
    def closestPrimes(self, left: int, right: int) -> List[int]:
        # Edge case: if range has less than 2 numbers, no pair possible
        if right - left < 1:
            return [-1, -1]

        # Step 1: Create sieve array up to 'right'
        # is_prime[i] = True means i is prime
        is_prime = [True] * (right + 1)
        is_prime[0] = is_prime[1] = False  # 0 and 1 are not prime

        # Step 2: Sieve of Eratosthenes
        # We only need to check up to sqrt(right)
        for i in range(2, int(right ** 0.5) + 1):
            if is_prime[i]:
                # Mark all multiples of i as non-prime
                # Start from i*i because smaller multiples were already marked
                for j in range(i * i, right + 1, i):
                    is_prime[j] = False

        # Step 3: Collect primes in the range [left, right]
        primes = []
        for num in range(left, right + 1):
            if is_prime[num]:
                primes.append(num)

        # Step 4: Find the closest consecutive prime pair
        # If we have less than 2 primes, return [-1, -1]
        if len(primes) < 2:
            return [-1, -1]

        min_diff = float('inf')
        result = [-1, -1]

        # Check consecutive pairs
        for i in range(len(primes) - 1):
            diff = primes[i + 1] - primes[i]
            if diff < min_diff:
                min_diff = diff
                result = [primes[i], primes[i + 1]]

        return result
```

```javascript
// Time: O(right * log log right) for sieve + O(right - left) for scanning
// Space: O(right) for the sieve array
/**
 * @param {number} left
 * @param {number} right
 * @return {number[]}
 */
var closestPrimes = function (left, right) {
  // Edge case: if range has less than 2 numbers, no pair possible
  if (right - left < 1) {
    return [-1, -1];
  }

  // Step 1: Create sieve array up to 'right'
  // isPrime[i] = true means i is prime
  const isPrime = new Array(right + 1).fill(true);
  isPrime[0] = isPrime[1] = false; // 0 and 1 are not prime

  // Step 2: Sieve of Eratosthenes
  // We only need to check up to sqrt(right)
  for (let i = 2; i * i <= right; i++) {
    if (isPrime[i]) {
      // Mark all multiples of i as non-prime
      // Start from i*i because smaller multiples were already marked
      for (let j = i * i; j <= right; j += i) {
        isPrime[j] = false;
      }
    }
  }

  // Step 3: Collect primes in the range [left, right]
  const primes = [];
  for (let num = left; num <= right; num++) {
    if (isPrime[num]) {
      primes.push(num);
    }
  }

  // Step 4: Find the closest consecutive prime pair
  // If we have less than 2 primes, return [-1, -1]
  if (primes.length < 2) {
    return [-1, -1];
  }

  let minDiff = Infinity;
  let result = [-1, -1];

  // Check consecutive pairs
  for (let i = 0; i < primes.length - 1; i++) {
    const diff = primes[i + 1] - primes[i];
    if (diff < minDiff) {
      minDiff = diff;
      result = [primes[i], primes[i + 1]];
    }
  }

  return result;
};
```

```java
// Time: O(right * log log right) for sieve + O(right - left) for scanning
// Space: O(right) for the sieve array
class Solution {
    public int[] closestPrimes(int left, int right) {
        // Edge case: if range has less than 2 numbers, no pair possible
        if (right - left < 1) {
            return new int[]{-1, -1};
        }

        // Step 1: Create sieve array up to 'right'
        // isPrime[i] = true means i is prime
        boolean[] isPrime = new boolean[right + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;  // 0 and 1 are not prime

        // Step 2: Sieve of Eratosthenes
        // We only need to check up to sqrt(right)
        for (int i = 2; i * i <= right; i++) {
            if (isPrime[i]) {
                // Mark all multiples of i as non-prime
                // Start from i*i because smaller multiples were already marked
                for (int j = i * i; j <= right; j += i) {
                    isPrime[j] = false;
                }
            }
        }

        // Step 3: Collect primes in the range [left, right]
        List<Integer> primes = new ArrayList<>();
        for (int num = left; num <= right; num++) {
            if (isPrime[num]) {
                primes.add(num);
            }
        }

        // Step 4: Find the closest consecutive prime pair
        // If we have less than 2 primes, return [-1, -1]
        if (primes.size() < 2) {
            return new int[]{-1, -1};
        }

        int minDiff = Integer.MAX_VALUE;
        int[] result = new int[]{-1, -1};

        // Check consecutive pairs
        for (int i = 0; i < primes.size() - 1; i++) {
            int diff = primes.get(i + 1) - primes.get(i);
            if (diff < minDiff) {
                minDiff = diff;
                result[0] = primes.get(i);
                result[1] = primes.get(i + 1);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(right × log log right)**

- The Sieve of Eratosthenes takes O(right × log log right) time to mark all non-prime numbers
- Collecting primes in the range takes O(right - left) time
- Finding the closest pair takes O(p) where p ≤ (right - left + 1)
- Dominated by the sieve operation

**Space Complexity: O(right)**

- We need a boolean array of size `right + 1` for the sieve
- The list of primes could take up to O(right - left) space in worst case
- Overall O(right) space

## Common Mistakes

1. **Not handling edge cases properly**: Forgetting to check if the range contains at least 2 primes. Always check `if len(primes) < 2` and return `[-1, -1]`.

2. **Inefficient primality testing**: Using trial division O(√n) for each number instead of Sieve of Eratosthenes. For large ranges (right up to 10^6), trial division becomes too slow.

3. **Comparing all pairs instead of consecutive primes**: Some candidates compare every pair (i, j) where i < j, which is O(p²). Since primes are naturally sorted, the minimum difference will always be between consecutive primes.

4. **Incorrect sieve implementation**: Starting the inner loop from `2*i` instead of `i*i`. While both work, `i*i` is more efficient. Also forgetting to handle 0 and 1 as non-prime.

## When You'll See This Pattern

The Sieve of Eratosthenes pattern appears in problems requiring efficient prime number generation:

1. **Count Primes (LeetCode 204)**: Direct application of the sieve to count primes less than n.
2. **Prime Palindrome (LeetCode 866)**: Find the smallest prime palindrome ≥ N, uses primality checking.
3. **Ugly Number II (LeetCode 264)**: While not about primes, uses similar "marking multiples" concept with pointers.

The "find closest pair in sorted sequence" pattern appears in:

1. **Two Sum (sorted version)**: Finding pair with specific sum in sorted array.
2. **3Sum Closest**: Finding triple with sum closest to target.

## Key Takeaways

1. **Sieve of Eratosthenes is your go-to for prime-related problems** when you need to check primality for many numbers. It trades O(n) space for O(n log log n) time, much better than repeated trial division.

2. **When finding minimum/maximum differences in sorted sequences**, you only need to check consecutive elements. The optimal pair will always be adjacent in sorted order.

3. **Always consider the constraints**: For `right ≤ 10^6`, Sieve of Eratosthenes is perfect. For larger constraints (like `10^9`), you'd need segmented sieve or probabilistic primality tests.

Related problems: [Count Ways to Make Array With Product](/problem/count-ways-to-make-array-with-product)
