---
title: "How to Solve Largest Prime from Consecutive Prime Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Prime from Consecutive Prime Sum. Medium difficulty, 38.9% acceptance rate. Topics: Array, Math, Number Theory."
date: "2029-08-23"
category: "dsa-patterns"
tags: ["largest-prime-from-consecutive-prime-sum", "array", "math", "number-theory", "medium"]
---

# How to Solve Largest Prime from Consecutive Prime Sum

You need to find the largest prime ≤ n that can be written as a sum of consecutive primes starting from 2. This problem is interesting because it combines prime generation, sliding window techniques, and careful boundary checking—all within a constrained time limit.

## Visual Walkthrough

Let's trace through `n = 100` step by step:

1. **Generate primes ≤ 100**: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]

2. **Find consecutive prime sums ≤ 100**:
   - 2 = 2 ✓ (prime)
   - 2+3 = 5 ✓ (prime)
   - 2+3+5 = 10 ✗ (not prime)
   - 2+3+5+7 = 17 ✓ (prime)
   - 2+3+5+7+11 = 28 ✗
   - 2+3+5+7+11+13 = 41 ✓
   - ...and so on

3. **Check all windows**:
   - Window [2,3,5,7,11,13,17,19,23] = 100 ✗ (not prime)
   - Window [41,43] = 84 ✗
   - Window [2,3,5,7,11,13,17,19,23,29] = 129 ✗ (exceeds 100)

4. **Valid sums we find**: 2, 5, 17, 41, 53 (2+3+5+7+11+13+17), 83 (23+29+31)

5. **Largest valid prime**: 83

The key insight: we need to check ALL possible consecutive windows starting from 2, not just windows starting at different positions.

## Brute Force Approach

A naive approach would:

1. Generate all primes ≤ n
2. For each starting index i, try adding consecutive primes until sum > n
3. For each sum ≤ n, check if it's prime
4. Track the largest valid prime found

This is inefficient because:

- We're repeatedly calculating the same sums
- We're checking primality for every sum, even when we could use a set of primes
- Time complexity would be O(P³) where P is the number of primes ≤ n

The main issue: for each starting position, we recalculate sums from scratch. If we have 1000 primes, we'd do ~500,000 sum calculations and primality checks.

## Optimized Approach

The key insight is to use a **prefix sum array** combined with a **sliding window**:

1. **Generate all primes ≤ n** using the Sieve of Eratosthenes
2. **Build prefix sums** of the prime array so sum(i,j) = prefix[j] - prefix[i-1]
3. **Use two pointers** (left and right) to find all consecutive prime sums ≤ n
4. **Check if each sum is prime** using our precomputed prime set
5. **Track the maximum valid prime**

Why this works efficiently:

- Prefix sums let us calculate any subarray sum in O(1)
- The sliding window ensures we only traverse the prime array once
- The prime set gives O(1) primality checking
- We only consider sums ≤ n, avoiding unnecessary calculations

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log log n) for sieve + O(p) for sliding window where p = primes count
# Space: O(n) for sieve array and prime list
def largestConsecutivePrimeSum(n: int) -> int:
    # Edge case: n < 2, no primes exist
    if n < 2:
        return 0

    # Step 1: Generate all primes up to n using Sieve of Eratosthenes
    sieve = [True] * (n + 1)
    sieve[0] = sieve[1] = False

    # Standard sieve implementation
    for i in range(2, int(n**0.5) + 1):
        if sieve[i]:
            # Mark all multiples of i as non-prime
            for j in range(i * i, n + 1, i):
                sieve[j] = False

    # Collect all primes into a list
    primes = [i for i in range(2, n + 1) if sieve[i]]

    # Step 2: Build prefix sums for O(1) range sum queries
    # prefix[i] = sum of first i primes (1-indexed for easier calculation)
    prefix = [0] * (len(primes) + 1)
    for i in range(len(primes)):
        prefix[i + 1] = prefix[i] + primes[i]

    # Step 3: Use sliding window to find all consecutive prime sums
    max_prime = 0
    left = 0

    # We iterate right pointer through all possible end positions
    for right in range(len(primes)):
        # Shrink window from left while sum exceeds n
        while left <= right and prefix[right + 1] - prefix[left] > n:
            left += 1

        # Check all valid windows ending at 'right'
        for l in range(left, right + 1):
            current_sum = prefix[right + 1] - prefix[l]

            # Check if sum is prime and update maximum
            if current_sum <= n and sieve[current_sum]:
                max_prime = max(max_prime, current_sum)

    return max_prime
```

```javascript
// Time: O(n log log n) for sieve + O(p) for sliding window where p = primes count
// Space: O(n) for sieve array and prime list
function largestConsecutivePrimeSum(n) {
  // Edge case: n < 2, no primes exist
  if (n < 2) return 0;

  // Step 1: Generate all primes up to n using Sieve of Eratosthenes
  const sieve = new Array(n + 1).fill(true);
  sieve[0] = sieve[1] = false;

  // Standard sieve implementation
  for (let i = 2; i * i <= n; i++) {
    if (sieve[i]) {
      // Mark all multiples of i as non-prime
      for (let j = i * i; j <= n; j += i) {
        sieve[j] = false;
      }
    }
  }

  // Collect all primes into an array
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (sieve[i]) primes.push(i);
  }

  // Step 2: Build prefix sums for O(1) range sum queries
  // prefix[i] = sum of first i primes (1-indexed for easier calculation)
  const prefix = new Array(primes.length + 1).fill(0);
  for (let i = 0; i < primes.length; i++) {
    prefix[i + 1] = prefix[i] + primes[i];
  }

  // Step 3: Use sliding window to find all consecutive prime sums
  let maxPrime = 0;
  let left = 0;

  // We iterate right pointer through all possible end positions
  for (let right = 0; right < primes.length; right++) {
    // Shrink window from left while sum exceeds n
    while (left <= right && prefix[right + 1] - prefix[left] > n) {
      left++;
    }

    // Check all valid windows ending at 'right'
    for (let l = left; l <= right; l++) {
      const currentSum = prefix[right + 1] - prefix[l];

      // Check if sum is prime and update maximum
      if (currentSum <= n && sieve[currentSum]) {
        maxPrime = Math.max(maxPrime, currentSum);
      }
    }
  }

  return maxPrime;
}
```

```java
// Time: O(n log log n) for sieve + O(p) for sliding window where p = primes count
// Space: O(n) for sieve array and prime list
public int largestConsecutivePrimeSum(int n) {
    // Edge case: n < 2, no primes exist
    if (n < 2) return 0;

    // Step 1: Generate all primes up to n using Sieve of Eratosthenes
    boolean[] sieve = new boolean[n + 1];
    Arrays.fill(sieve, true);
    sieve[0] = sieve[1] = false;

    // Standard sieve implementation
    for (int i = 2; i * i <= n; i++) {
        if (sieve[i]) {
            // Mark all multiples of i as non-prime
            for (int j = i * i; j <= n; j += i) {
                sieve[j] = false;
            }
        }
    }

    // Collect all primes into a list
    List<Integer> primes = new ArrayList<>();
    for (int i = 2; i <= n; i++) {
        if (sieve[i]) primes.add(i);
    }

    // Step 2: Build prefix sums for O(1) range sum queries
    // prefix[i] = sum of first i primes (1-indexed for easier calculation)
    int[] prefix = new int[primes.size() + 1];
    for (int i = 0; i < primes.size(); i++) {
        prefix[i + 1] = prefix[i] + primes.get(i);
    }

    // Step 3: Use sliding window to find all consecutive prime sums
    int maxPrime = 0;
    int left = 0;

    // We iterate right pointer through all possible end positions
    for (int right = 0; right < primes.size(); right++) {
        // Shrink window from left while sum exceeds n
        while (left <= right && prefix[right + 1] - prefix[left] > n) {
            left++;
        }

        // Check all valid windows ending at 'right'
        for (int l = left; l <= right; l++) {
            int currentSum = prefix[right + 1] - prefix[l];

            // Check if sum is prime and update maximum
            if (currentSum <= n && sieve[currentSum]) {
                maxPrime = Math.max(maxPrime, currentSum);
            }
        }
    }

    return maxPrime;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log log n + p)**

- **Sieve of Eratosthenes**: O(n log log n) to generate all primes ≤ n
- **Sliding window**: O(p) where p = number of primes ≤ n (each prime is processed once)
- In practice, p ≈ n/ln(n), so overall complexity is dominated by the sieve

**Space Complexity: O(n)**

- **Sieve array**: O(n) to mark prime numbers
- **Prime list**: O(p) to store primes
- **Prefix array**: O(p) for prefix sums
- Total: O(n + p) = O(n) since p ≤ n

## Common Mistakes

1. **Forgetting that the sum must start from 2**: Some candidates try windows starting at any prime, but the problem specifically requires starting from 2. Always re-read the problem statement carefully.

2. **Inefficient primality checking**: Checking if each sum is prime using trial division (O(√n) per check) instead of using the precomputed sieve. This turns an O(1) check into O(√n), significantly slowing down the solution.

3. **Off-by-one errors in prefix sums**: Using 0-indexed prefix sums incorrectly. Remember: `prefix[i]` should represent the sum of the first `i` elements, so `sum(l, r) = prefix[r+1] - prefix[l]`.

4. **Not handling the case when no valid prime exists**: For n < 5, the only valid primes are 2 and maybe 5. For n = 1 or 0, we should return 0. Always test edge cases.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sieve of Eratosthenes**: Used in problems requiring prime generation up to a limit.
   - Related: [Count Primes](https://leetcode.com/problems/count-primes/), [Prime Arrangements](https://leetcode.com/problems/prime-arrangements/)

2. **Prefix Sum + Sliding Window**: Used for finding subarrays with certain properties.
   - Related: [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/), [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)

3. **Two Pointers with Constraint**: Maintaining a window that satisfies a condition (sum ≤ n).
   - Related: [Container With Most Water](https://leetcode.com/problems/container-with-most-water/), [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

## Key Takeaways

1. **When you need to check many subarray sums, prefix sums are your friend**: They transform O(k) sum calculations into O(1) lookups, where k is subarray length.

2. **Precomputation saves time**: Generating all primes once with a sieve is much faster than checking primality repeatedly. This is a classic space-time tradeoff.

3. **Sliding window works for consecutive elements**: When the problem specifies "consecutive" elements and you need to find all valid windows, sliding window with two pointers is often the right approach.

[Practice this problem on CodeJeet](/problem/largest-prime-from-consecutive-prime-sum)
