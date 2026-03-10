---
title: "How to Solve Minimum Stability Factor of Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Stability Factor of Array. Hard difficulty, 20.3% acceptance rate. Topics: Array, Math, Binary Search, Greedy, Segment Tree."
date: "2026-09-18"
category: "dsa-patterns"
tags: ["minimum-stability-factor-of-array", "array", "math", "binary-search", "hard"]
---

# How to Solve Minimum Stability Factor of Array

This problem asks us to find the length of the longest subarray where all elements share a common factor greater than or equal to 2. The twist is that we can modify up to `maxC` elements in the array to make the subarray stable. What makes this challenging is balancing the mathematical constraint (finding elements with common factors) with the operational constraint (limited modifications).

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 3, 4, 9]` with `maxC = 1`.

We want the longest subarray where we can modify at most 1 element to make all elements share a factor ≥ 2.

**Step 1: Understanding stability**
A subarray is stable if there exists some integer `d ≥ 2` that divides all elements (after modifications). For example:

- `[2, 4]` is stable (common factor 2)
- `[3, 9]` is stable (common factor 3)
- `[2, 3]` is NOT stable (no common factor ≥ 2)

**Step 2: Considering modifications**
We can change up to `maxC` elements to any value. This means we can "fix" elements that don't share the common factor.

Let's try finding the longest stable subarray:

- Starting at index 0: `[2, 3, 4, 9]`
  - If we choose factor 2: elements 2 and 4 already divisible by 2
  - Element 3 is not divisible by 2 → needs modification (1 modification)
  - Element 9 is not divisible by 2 → needs modification (2 modifications total)
  - With maxC=1, we can only modify 1 element → subarray length 3 max
- Starting at index 1: `[3, 4, 9]`
  - If we choose factor 3: elements 3 and 9 already divisible by 3
  - Element 4 is not divisible by 3 → needs modification (1 modification)
  - With maxC=1, this works! Length = 3

The answer is 3. The key insight: for each possible factor, we need to find the longest subarray where at most `maxC` elements are not divisible by that factor.

## Brute Force Approach

A naive approach would be:

1. Try every possible subarray (O(n²) subarrays)
2. For each subarray, try every possible factor from 2 to the maximum element value
3. For each factor, count how many elements need modification
4. Check if modifications needed ≤ maxC

This gives us O(n³ \* m) complexity where m is the maximum element value, which is clearly infeasible for typical constraints.

Even a slightly better brute force would be O(n² \* m) by precomputing divisibility, but with n up to 10⁵ and values up to 10⁶, this is still too slow.

The problem requires us to think differently: instead of checking every subarray for every factor, we need to efficiently find for each factor, what's the longest subarray with at most `maxC` "bad" elements (elements not divisible by that factor).

## Optimized Approach

The key insight is to **invert the problem**: For each possible factor `d`, we can transform the array into a binary array where `1` represents "needs modification" (not divisible by `d`) and `0` represents "good" (divisible by `d`). Then the problem becomes: find the longest subarray with at most `maxC` ones.

This is a classic sliding window problem! For each factor `d`:

1. Create a binary array where `arr[i] = 1` if `nums[i] % d != 0`, else `0`
2. Use sliding window to find the longest subarray with sum ≤ maxC

But we still have too many factors to check (up to 10⁶). The second key insight: we only need to check **prime factors** of the elements! If an element is divisible by a composite number, it's also divisible by its prime factors. So checking all primes up to the maximum element value is sufficient.

However, with values up to 10⁶, there are about 78,000 primes, which is still too many to check for each array. The final optimization: we only need to check primes that appear as factors of elements in our array. For each element, we factorize it and track which primes appear.

**Algorithm outline:**

1. Find all unique prime factors of all elements in `nums`
2. For each prime factor `p`:
   - Create binary array where `bad[i] = 1` if `nums[i] % p != 0`
   - Use sliding window to find longest subarray with sum(bad) ≤ maxC
3. Return the maximum length found

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * sqrt(M) + P * n) where M is max element, P is number of unique prime factors
# Space: O(n + P) for storing prime factors and binary array
def longestStableSubarray(nums, maxC):
    from math import isqrt

    def get_prime_factors(x):
        """Return set of prime factors of x"""
        factors = set()
        # Check divisibility by 2 separately
        while x % 2 == 0:
            factors.add(2)
            x //= 2
        # Check odd factors up to sqrt(x)
        for i in range(3, isqrt(x) + 1, 2):
            while x % i == 0:
                factors.add(i)
                x //= i
        # If x is still > 1, it's a prime factor
        if x > 1:
            factors.add(x)
        return factors

    # Step 1: Collect all unique prime factors from all elements
    all_primes = set()
    for num in nums:
        all_primes.update(get_prime_factors(num))

    # Edge case: if no primes found (all numbers are 0 or 1)
    if not all_primes:
        return min(len(nums), maxC) if maxC > 0 else 0

    max_length = 0

    # Step 2: For each prime factor, find longest valid subarray
    for prime in all_primes:
        # Create binary array: 1 if element not divisible by prime
        bad = [1 if num % prime != 0 else 0 for num in nums]

        # Sliding window to find longest subarray with sum <= maxC
        left = 0
        current_bad = 0

        for right in range(len(nums)):
            # Add current element to window
            current_bad += bad[right]

            # Shrink window if we have too many bad elements
            while current_bad > maxC:
                current_bad -= bad[left]
                left += 1

            # Update maximum length
            max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Time: O(n * sqrt(M) + P * n) where M is max element, P is number of unique prime factors
// Space: O(n + P) for storing prime factors and binary array
function longestStableSubarray(nums, maxC) {
  // Helper function to get prime factors of a number
  function getPrimeFactors(x) {
    const factors = new Set();

    // Handle factor 2 separately
    while (x % 2 === 0) {
      factors.add(2);
      x = Math.floor(x / 2);
    }

    // Check odd factors up to sqrt(x)
    for (let i = 3; i * i <= x; i += 2) {
      while (x % i === 0) {
        factors.add(i);
        x = Math.floor(x / i);
      }
    }

    // If x > 1, it's a prime factor
    if (x > 1) {
      factors.add(x);
    }

    return factors;
  }

  // Step 1: Collect all unique prime factors
  const allPrimes = new Set();
  for (const num of nums) {
    const factors = getPrimeFactors(num);
    factors.forEach((factor) => allPrimes.add(factor));
  }

  // Edge case: no prime factors found
  if (allPrimes.size === 0) {
    return Math.min(nums.length, maxC > 0 ? nums.length : 0);
  }

  let maxLength = 0;

  // Step 2: Check each prime factor
  for (const prime of allPrimes) {
    // Create binary array: 1 if not divisible by prime
    const bad = nums.map((num) => (num % prime !== 0 ? 1 : 0));

    // Sliding window to find longest subarray with sum <= maxC
    let left = 0;
    let currentBad = 0;

    for (let right = 0; right < nums.length; right++) {
      // Expand window to include nums[right]
      currentBad += bad[right];

      // Shrink window from left if we have too many bad elements
      while (currentBad > maxC) {
        currentBad -= bad[left];
        left++;
      }

      // Update maximum length found
      maxLength = Math.max(maxLength, right - left + 1);
    }
  }

  return maxLength;
}
```

```java
// Time: O(n * sqrt(M) + P * n) where M is max element, P is number of unique prime factors
// Space: O(n + P) for storing prime factors and binary array
import java.util.*;

public class Solution {
    public int longestStableSubarray(int[] nums, int maxC) {
        // Helper function to get prime factors
        Set<Integer> getAllPrimeFactors(int[] nums) {
            Set<Integer> allPrimes = new HashSet<>();
            for (int num : nums) {
                allPrimes.addAll(getPrimeFactors(num));
            }
            return allPrimes;
        }

        Set<Integer> getPrimeFactors(int x) {
            Set<Integer> factors = new HashSet<>();

            // Handle factor 2 separately
            while (x % 2 == 0) {
                factors.add(2);
                x /= 2;
            }

            // Check odd factors up to sqrt(x)
            for (int i = 3; i * i <= x; i += 2) {
                while (x % i == 0) {
                    factors.add(i);
                    x /= i;
                }
            }

            // If x > 1, it's a prime factor
            if (x > 1) {
                factors.add(x);
            }

            return factors;
        }

        // Step 1: Get all unique prime factors
        Set<Integer> allPrimes = getAllPrimeFactors(nums);

        // Edge case: no prime factors (all numbers are 0 or 1)
        if (allPrimes.isEmpty()) {
            return Math.min(nums.length, maxC > 0 ? nums.length : 0);
        }

        int maxLength = 0;

        // Step 2: Check each prime factor
        for (int prime : allPrimes) {
            // Create binary array: 1 if not divisible by prime
            int[] bad = new int[nums.length];
            for (int i = 0; i < nums.length; i++) {
                bad[i] = (nums[i] % prime != 0) ? 1 : 0;
            }

            // Sliding window to find longest subarray with sum <= maxC
            int left = 0;
            int currentBad = 0;

            for (int right = 0; right < nums.length; right++) {
                // Include current element in window
                currentBad += bad[right];

                // Shrink window if we have too many bad elements
                while (currentBad > maxC) {
                    currentBad -= bad[left];
                    left++;
                }

                // Update maximum length
                maxLength = Math.max(maxLength, right - left + 1);
            }
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Prime factorization: For each of n elements, we factorize up to O(√M) where M is the maximum element value → O(n√M)
- For each unique prime factor P (at most n _ log M in worst case), we run sliding window O(n) → O(P _ n)
- Total: O(n√M + P \* n)

In practice, P is much smaller than n because many elements share prime factors. The worst case occurs when all elements are distinct primes, making P = n.

**Space Complexity:**

- O(P) to store unique prime factors
- O(n) for the binary array in each iteration (can be optimized to O(1) by computing on the fly)
- Total: O(n + P)

## Common Mistakes

1. **Checking all factors instead of just primes**: Candidates often try to check every number from 2 to max(nums), which is O(M \* n) and times out. Remember that if a number is divisible by a composite, it's divisible by its prime factors.

2. **Forgetting edge cases with 0 and 1**: Numbers 0 and 1 have no prime factors ≥ 2. If all numbers are 0 or 1, the only way to get a stable subarray is to modify elements. Handle this case separately.

3. **Incorrect sliding window logic**: The condition should be `while current_bad > maxC` not `if current_bad > maxC`. We need to keep shrinking until the window is valid, not just remove one element.

4. **Not optimizing prime factorization**: Using trial division up to n instead of √n makes factorization O(n) instead of O(√n). Always stop at √x when finding prime factors.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sliding Window with Constraint**: Similar to "Longest Subarray with at most K zeros" (LeetCode 1004) or "Fruit Into Baskets" (LeetCode 904). The pattern: find longest subarray where some metric (sum of ones) ≤ threshold.

2. **Prime Factorization for Constraints**: Problems like "Largest Component Size by Common Factor" (LeetCode 952) use prime factorization to build graphs based on shared factors.

3. **Binary Transformation**: Converting a problem to a binary array simplifies constraints. Used in "Maximum Points You Can Obtain from Cards" (LeetCode 1423) where we transform to finding minimum subarray sum.

## Key Takeaways

1. **Transform constraints into binary problems**: When you have "at most K elements with property X", create a binary array and use sliding window to find longest subarray with sum ≤ K.

2. **Prime factors are sufficient for divisibility**: For "common factor" problems, you only need to check prime factors, not all numbers. This reduces the search space dramatically.

3. **Combine multiple techniques**: Hard problems often require chaining insights: prime factorization → binary transformation → sliding window. Break the problem into manageable subproblems.

[Practice this problem on CodeJeet](/problem/minimum-stability-factor-of-array)
